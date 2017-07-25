// require index.html so livereload will watch it
const index = require('../../index.html') // eslint-disable-line no-unused-vars

const audioCtx = new (window.AudioContext || window.webkitAudioContext)() // define audio context


const $player = document.getElementById('you')



// const URLS = [
//   'tracks1/01_KickIn.wav',
//   'tracks1/02_KickOut.wav',
//   'tracks1/03_Snare.wav',
//   'tracks1/04_HiHat.wav',
//   'tracks1/05_Tom1.wav',
//   'tracks1/06_Tom2.wav',
//   'tracks1/07_Overheads.wav',
//   'tracks1/08_Congas.wav',
//   'tracks1/09_Shaker.wav',
//   'tracks1/10_Tambourine.wav',
//   'tracks1/11_Bass.wav',
//   'tracks1/12_Synth1.wav',
//   'tracks1/13_Synth2.wav',
//   'tracks1/14_Synth3.wav',
//   'tracks1/15_Synth4.wav',
//   'tracks1/16_Hammond.wav',
//   'tracks1/17_ElecPiano1.wav',
// ]

const URLS = [
  'tracks/01_KickInside.wav',
  'tracks/02_KickBeater.wav',
  'tracks/03_Snare.wav',
  'tracks/04_Overheads.wav',
  'tracks/05_Bass.wav',
  'tracks/06_Piano.wav',
]

const listener = audioCtx.listener

const audios = {

}

window.audios = audios

listener.setPosition(0, 0, 0);

function play(audioBuffer, trackName) {
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
  audios[trackName].delays = {
    l: 100,
    r: 2,
  }

  // split channels


  source.connect(analyser)
  analyser.connect(panner)
  panner.connect(audioCtx.destination)

  // add delays
  // const splitter = audioCtx.createChannelSplitter(2)
  // panner.connect(splitter)

  // const lDelay = audioCtx.createDelay(audios[trackName].delays.l)
  // const rDelay = audioCtx.createDelay(audios[trackName].delays.r)

  // splitter.connect(lDelay, 0)
  // splitter.connect(rDelay, 1)

  // const merger = audioCtx.createChannelMerger(2)

  // lDelay.connect(merger, 0, 0)
  // rDelay.connect(merger, 0, 1)

  // merger.connect(audioCtx.destination)

  audios[trackName].panner = panner
  source.loop = true
  source.start()
}

(function dragDropPlayer(){
  let isGrabbing = false
  $player.addEventListener('mousedown', (e) => {
    isGrabbing = true
  })
  $player.addEventListener('mouseup', (e) => {
    isGrabbing = false
  })
  window.addEventListener('mousemove', (e) => {
    if (!isGrabbing) return
    const relativeX = e.pageX - $player.offsetLeft - ($player.clientWidth / 2)
    const relativeY = e.pageY - $player.offsetTop - ($player.clientHeight / 2)
    $player.style.transform = `translate(${relativeX}px, ${relativeY}px)`
    audioCtx.listener.setPosition(relativeX / 100, 0, relativeY / 100)
  }, false)
})()

function makeElement(buffer, trackName) {
  const newDiv = document.createElement('div')
  let isGrabbing = false
  newDiv.classList.add('speaker')
  newDiv.innerHTML = '🔊'
  newDiv.addEventListener('mousedown', (e) => {
    isGrabbing = true
  })
  newDiv.addEventListener('mouseup', (e) => {
    isGrabbing = false
  })
  window.addEventListener('mousemove', (e) => {
    if (!isGrabbing) return
    const relativeX = e.pageX - newDiv.offsetLeft - (newDiv.clientWidth / 2)
    const relativeY = e.pageY - newDiv.offsetTop - (newDiv.clientHeight / 2)
    audios[trackName].position = {
      x: relativeX,
      z: relativeY,
    }
    audios[trackName].panner.setPosition(relativeX / 100, 0, relativeY / 100)
  }, false)
  audios[trackName].elem = newDiv
  document.body.append(newDiv)
}

Promise.all(URLS.map(URL => window.fetch(URL)
  .then(res => res.arrayBuffer())
  .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))))
  .then((audioBuffers) => {
    audioBuffers.forEach((audio, i) => {
      audios[URLS[i]] = {
        elem: undefined,
        source: undefined,
        position: {
          z: Math.random() * -300,
          x: 300 - Math.random() * 500,
        },
      }
      play(audio, URLS[i])
      makeElement(audio, URLS[i])
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

  requestAnimationFrame(drawLoop);
}

