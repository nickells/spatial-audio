const APP_DATA = require('./data-store')
const TRACK_LIST = require('./tracklist')
const AUDIO_CONTEXT = require('./audio-context')

const { canDragDrop, canDoubleClick, toggleMute } = require('./utils')

function initalizeTrackElement(trackName, i) {
  const newDiv = document.createElement('div')
  newDiv.style.transform = `
    translate(${APP_DATA[trackName].position.x}px, ${APP_DATA[trackName].position.z}px)
    scale(${0.0})`

  newDiv.innerHTML = TRACK_LIST[i].icon

  APP_DATA[trackName].elem = newDiv
  document.body.append(newDiv)
  // debugger
  return Promise.resolve()
}

function prepareTrackForPlayback(audioBuffer, trackName) {
  const source = AUDIO_CONTEXT.createBufferSource()
  source.buffer = audioBuffer;

  const panner = AUDIO_CONTEXT.createPanner()
  const gain = AUDIO_CONTEXT.createGain()

  const { x, z } = APP_DATA[trackName].position

  panner.setPosition(x / 100, 0, z / 100)

  // create analyser
  const analyser = AUDIO_CONTEXT.createAnalyser()
  analyser.fftSize = 32
  APP_DATA[trackName].analyser = {
    instance: analyser,
    dataArray: new Uint8Array(analyser.frequencyBinCount),
  }
  APP_DATA[trackName].gainNode = gain

  source.connect(gain)
  gain.connect(analyser)
  analyser.connect(panner)
  panner.connect(AUDIO_CONTEXT.destination)

  APP_DATA[trackName].panner = panner
  APP_DATA[trackName].source = source
  source.loop = true

  // if (Math.random() > 0.3) toggleMute(APP_DATA[trackName])

  return source
}

function finishLoadingTrackElement(TRACK_DATA) {
  const trackName = TRACK_DATA.track
  const trackDiv = APP_DATA[trackName].elem
  trackDiv.classList.add('speaker')
  trackDiv.innerHTML = TRACK_DATA.icon

  canDragDrop(trackDiv, ({ relativeX, relativeY }) => {
    APP_DATA[trackName].position = {
      x: relativeX,
      z: relativeY,
    }
    APP_DATA[trackName].panner.setPosition(relativeX / 100, 0, relativeY / 100)
  })

  trackDiv.classList.add('speaker', 'loading')
  trackDiv.style.transform = `translate(${APP_DATA[trackName].position.x}px, ${APP_DATA[trackName].position.z}px)
    scale(${1.0})`

  setTimeout(() => {
    trackDiv.classList.remove('loading')
    trackDiv.classList.add('active')
  }, 200)

  canDoubleClick(trackDiv, (e) => {
    toggleMute(APP_DATA[trackName])
  })

  return APP_DATA[trackName].source
}

module.exports = {
  initalizeTrackElement,
  prepareTrackForPlayback,
  finishLoadingTrackElement,
}
