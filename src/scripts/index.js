// require index.html so livereload will watch it
const index = require('../../index.html') // eslint-disable-line no-unused-vars
const { canDragDrop, calculateInitialPositions, canDoubleClick } = require('./utils')
const URLS = require('./tracklist')
const audios = require('./data-store')

const audioCtx = new (window.AudioContext || window.webkitAudioContext)() // define audio context
const $player = document.getElementById('you')

let sunglasses = false

audioCtx.listener.setPosition(0, 0, 0);

function prepareTrack(audioBuffer, trackName) {
  const source = audioCtx.createBufferSource()
  source.buffer = audioBuffer;

  const panner = audioCtx.createPanner()
  const gain = audioCtx.createGain()

  const { x, z } = audios[trackName].position

  panner.setPosition(x / 100, 0, z / 100)

  // create analyser
  const analyser = audioCtx.createAnalyser()
  analyser.fftSize = 32
  audios[trackName].analyser = {
    instance: analyser,
    dataArray: new Uint8Array(analyser.frequencyBinCount),
  }
  audios[trackName].gainNode = gain

  source.connect(gain)
  gain.connect(analyser)
  analyser.connect(panner)
  panner.connect(audioCtx.destination)

  audios[trackName].panner = panner
  audios[trackName].source = source
  source.loop = true

  return source
}

canDragDrop($player, ({ relativeX, relativeY }) => {
  audioCtx.listener.setPosition(relativeX / 100, 0, relativeY / 100)
})

canDoubleClick($player, () => {
  sunglasses = !sunglasses
  if (sunglasses) $player.innerHTML = '😎'
  else $player.innerHTML = '🙂'
})

function createLoadingElement(trackName) {
  const newDiv = document.createElement('div')
  newDiv.classList.add('speaker')
  newDiv.style.transform = `
    translate(${audios[trackName].position.x}px, ${audios[trackName].position.z}px)
    scale(${1.0})`

  newDiv.innerHTML = '⏳'

  audios[trackName].elem = newDiv
  document.body.append(newDiv)
  return Promise.resolve()
}

function createTrackElement(trackName) {
  const trackDiv = audios[trackName].elem
  trackDiv.classList.add('speaker')
  trackDiv.innerHTML = '⌛'


  canDragDrop(trackDiv, ({ relativeX, relativeY }) => {
    audios[trackName].position = {
      x: relativeX,
      z: relativeY,
    }
    audios[trackName].panner.setPosition(relativeX / 100, 0, relativeY / 100)
  })

  canDoubleClick(trackDiv, (e) => {
    audios[trackName].muted = !audios[trackName].muted
    if (audios[trackName].muted) {
      audios[trackName].elem.innerHTML = '🔇'
      audios[trackName].gainNode.gain.value = 0
    } else {
      audios[trackName].elem.innerHTML = '🔉'
      audios[trackName].gainNode.gain.value = 1
    }
  })

  return audios[trackName].source
}


function drawLoop() {
  Object.keys(audios).forEach((trackName) => {
    const audio = audios[trackName]
    audio.analyser.instance.getByteTimeDomainData(audio.analyser.dataArray)
    const max = Math.max.apply(null, audio.analyser.dataArray) / 128

    if (audio.muted) audio.elem.innerHTML = '🔇'
    else if (max < 1.0) audio.elem.innerHTML =  '🔈'
    else audio.elem.innerHTML = '🔉'

    const { x, z: y } = audio.position
    audio.elem.style.transform = `translate3d(${x}px, ${y}px, 0px) scale(${max})`
  })
  setTimeout(() => {
    requestAnimationFrame(drawLoop);
  }, 1000 / 60)
}


Promise.all(URLS.map((URL, i) => {
  const trackName = URLS[i]
  const { z, x } = calculateInitialPositions(i)

  audios[trackName] = {
    elem: undefined,
    source: undefined,
    position: { z, x },
    muted: false
  }

  return createLoadingElement(trackName)
  .then(() => window.fetch(URL))
  .then(res => res.arrayBuffer())
  .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
  .then(decodedBuffer => prepareTrack(decodedBuffer, trackName))
  .then(res => createTrackElement(trackName))
}))
.then((audioSources) => {
  audioSources.forEach(source => source.start())
  drawLoop()
})
