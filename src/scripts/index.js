// require index.html so livereload will watch it
const index = require('../../index.html') // eslint-disable-line no-unused-vars
const { canDragDrop } = require('./utils')

const audioCtx = new (window.AudioContext || window.webkitAudioContext)() // define audio context


const $player = document.getElementById('you')

const URLS = [
  'tracks/Creep%201.ogg',
  'tracks/Creep%202.ogg',
  'tracks/Creep%203.ogg',
  'tracks/Creep%204.ogg',
  'tracks/Creep%205.ogg',
  'tracks/Creep%206.ogg',
  'tracks/Creep%207.ogg',
  'tracks/Creep%208.ogg',
  'tracks/Creep%209.ogg',
]

const listener = audioCtx.listener

const audios = {

}

window.audios = audios

listener.setPosition(0, 0, 0);

function hookUpAudio(audioBuffer, trackName) {
  const source = audioCtx.createBufferSource()
  source.buffer = audioBuffer;

  const panner = audioCtx.createPanner()

  const { x, z } = audios[trackName].position

  panner.setPosition(x / 100, 0, z / 100)

  // create analyser
  const analyser = audioCtx.createAnalyser()
  analyser.fftSize = 32
  audios[trackName].analyser = {
    instance: analyser,
    dataArray: new Uint8Array(analyser.frequencyBinCount),
  }

  source.connect(analyser)
  analyser.connect(panner)
  panner.connect(audioCtx.destination)

  audios[trackName].panner = panner
  source.loop = true

  return source
}

canDragDrop($player, ({relativeX, relativeY})=>{
  audioCtx.listener.setPosition(relativeX / 100, 0, relativeY / 100)
})

function makePlayer(buffer, trackName) {
  const newDiv = document.createElement('div')
  newDiv.classList.add('speaker')
  newDiv.innerHTML = '🔊'

  newDiv.style.transform = `translate(${audios[trackName].position.x}px, ${audios[trackName].position.z}px) scale(${0.0})`

  canDragDrop(newDiv, ({relativeX, relativeY}) => {
    audios[trackName].position = {
      x: relativeX,
      z: relativeY,
    }
    audios[trackName].panner.setPosition(relativeX / 100, 0, relativeY / 100)
  })

  audios[trackName].elem = newDiv
  document.body.append(newDiv)
  return buffer
}

Promise.all(
  URLS.map((URL, i) => window.fetch(URL)
    .then(res => res.arrayBuffer())
    .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
    .then((decodedBuffer) => {
      const trackName = URLS[i]

      // initial data
      audios[trackName] = {
        elem: undefined,
        source: undefined,
        position: {
          z: Math.random() * -300,
          x: 300 - Math.random() * 500,
        },
      }

      makePlayer(decodedBuffer, trackName)
      return hookUpAudio(decodedBuffer, trackName)
    }),
  ),
)
.then((audioSources) => {
  audioSources.forEach((source) => {
    source.start()
  })
  drawLoop()
})

function drawLoop() {
  Object.keys(audios).forEach((trackName) => {
    const audio = audios[trackName]
    audio.analyser.instance.getByteTimeDomainData(audio.analyser.dataArray)
    const max = Math.max.apply(null, audio.analyser.dataArray) / 128

    const { x, z: y } = audio.position
    audio.elem.style.transform = `translate(${x}px, ${y}px) scale(${max})`
  })
  setTimeout(()=>{
    requestAnimationFrame(drawLoop);
  }, 1000 / 60)
}

