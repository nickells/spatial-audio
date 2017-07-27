// require index.html so livereload will watch it
const index = require('../../index.html') // eslint-disable-line no-unused-vars

const { canDragDrop, calculateInitialPositions, canDoubleClick, toggleMute } = require('./utils')
const URLS = require('./tracklist')
require('whatwg-fetch')
const audios = require('./data-store')

const helpModal = require('./help')()

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

  if (Math.random() > 0.3) toggleMute(audios[trackName])

  return source
}

canDragDrop($player, ({ relativeX, relativeY }) => {
  audioCtx.listener.setPosition(relativeX / 100, 0, relativeY / 100)
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

function createTrackElement(track) {
  const trackName = track.track
  const trackDiv = audios[trackName].elem
  trackDiv.classList.add('speaker')
  trackDiv.innerHTML = track.icon


  canDragDrop(trackDiv, ({ relativeX, relativeY }) => {
    audios[trackName].position = {
      x: relativeX,
      z: relativeY,
    }
    audios[trackName].panner.setPosition(relativeX / 100, 0, relativeY / 100)
  })

  canDoubleClick(trackDiv, (e) => {
    toggleMute(audios[trackName])
  })

  return audios[trackName].source
}


function drawLoop() {
  Object.keys(audios).forEach((trackName) => {
    const audio = audios[trackName]
    audio.analyser.instance.getByteTimeDomainData(audio.analyser.dataArray)
    const max = Math.max.apply(null, audio.analyser.dataArray) / 128

    const { x, z: y } = audio.position

    audio.elem.style.transform = `translate3d(${x}px, ${y}px, 0px) scale(${Math.max(max, 0.8)})`
  })
  setTimeout(() => {
    requestAnimationFrame(drawLoop);
  }, 1000 / 60)
}

// Safari's decodeAudioData isn't a promise by default. use callback spec
const decodePromise = (buffer) => new Promise((res, rej) => {
  return audioCtx.decodeAudioData(buffer, (data, err)=>{
    if (err) rej(err)
    else res(data)
  })
})

function loadMp3(url) {
  return fetch(url)
  .then(res => res.arrayBuffer())
  .then(arrayBuffer => decodePromise(arrayBuffer))
  .catch( err => console.log(err))
}


Promise.all(URLS.map((URL, i) => {
  const trackName = URL.track
  const { z, x } = calculateInitialPositions(i)

  audios[trackName] = {
    elem: undefined,
    source: undefined,
    position: { z, x },
    muted: false
  }

  return createLoadingElement(trackName)
  .then(() => loadMp3(trackName))
  .then(decodedBuffer => prepareTrack(decodedBuffer, trackName))
  .then(res => createTrackElement(URL))
  .catch(err => {
    console.log('erorr')
    console.log(err)
  })
}))
.then((audioSources) => {
  audioSources.forEach(source => source.start())
  drawLoop()
})
