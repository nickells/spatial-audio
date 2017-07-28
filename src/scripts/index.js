// require index.html so livereload will watch it
const index = require('../../index.html') // eslint-disable-line no-unused-vars

const { mapSeries } = require('bluebird')
require('whatwg-fetch')

const { canDragDrop, calculateInitialPositions, loadMp3 } = require('./utils')
const { initalizeTrackElement, prepareTrackForPlayback, finishLoadingTrackElement } = require('./lifecycle')

const APP_DATA = require('./data-store')
const TRACK_LIST = require('./tracklist')
const AUDIO_CONTEXT = require('./audio-context')

require('./help')()

const $player = document.getElementById('you')
canDragDrop($player, ({ relativeX, relativeY }) => {
  AUDIO_CONTEXT.listener.setPosition(relativeX / 100, 0, relativeY / 100)
})

function drawLoop() {
  Object.keys(APP_DATA).forEach((trackName) => {
    const audio = APP_DATA[trackName]
    if (!audio.analyser) return
    audio.analyser.instance.getByteTimeDomainData(audio.analyser.dataArray)
    const max = Math.max.apply(null, audio.analyser.dataArray) / 128

    const { x, z: y } = audio.position

    audio.elem.style.transform = `translate3d(${x}px, ${y}px, 0px) scale(${Math.max(max, 0.8)})`
  })
  setTimeout(() => {
    requestAnimationFrame(drawLoop);
  }, 1000 / 60)
}

drawLoop()
mapSeries(TRACK_LIST, (TRACK_DATA, i) => {
  const trackName = TRACK_DATA.track
  const { z, x } = calculateInitialPositions(i)

  APP_DATA[trackName] = {
    elem: undefined,
    source: undefined,
    panner: undefined,
    gainNode: undefined,
    position: { z, x },
    muted: false,
  }

  return initalizeTrackElement(trackName, i)
  .then(() => loadMp3(trackName))
  .then(decodedBuffer => prepareTrackForPlayback(decodedBuffer, trackName))
  .then(res => finishLoadingTrackElement(TRACK_DATA))
  .then(audioSource => audioSource.start())
  .catch(err => {
    console.log('error')
    console.log(err)
  })
})
