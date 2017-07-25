// require index.html so livereload will watch it
const index = require('../../index.html') // eslint-disable-line no-unused-vars

const audioCtx = new (window.AudioContext || window.webkitAudioContext)() // define audio context

const URLS = [
  'tracks/01_KickIn.wav',
  'tracks/02_KickOut.wav',
  'tracks/03_Snare.wav',
  'tracks/04_HiHat.wav',
  'tracks/05_Tom1.wav',
  'tracks/06_Tom2.wav',
  'tracks/07_Overheads.wav',
  'tracks/08_Congas.wav',
  'tracks/09_Shaker.wav',
  'tracks/10_Tambourine.wav',
  'tracks/11_Bass.wav',
  'tracks/12_Synth1.wav',
  'tracks/13_Synth2.wav',
  'tracks/14_Synth3.wav',
  'tracks/15_Synth4.wav',
  'tracks/16_Hammond.wav',
  'tracks/17_ElecPiano1.wav',
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
  panner.setPosition(0, 0, 0)

  // create analyser
  const analyser = audioCtx.createAnalyser()
  analyser.fftSize = 32
  audios[trackName].analyser = {
    instance: analyser,
    dataArray: new Uint8Array(analyser.frequencyBinCount)
  }

  source.connect(analyser)
  analyser.connect(panner)
  panner.connect(audioCtx.destination)
  audios[trackName].panner = panner
  source.start()
}


function makeElement(buffer, trackName){
  const newDiv = document.createElement('div')
  let isGrabbing = false
  newDiv.classList.add('speaker')
  newDiv.innerHTML = '🔊'
  newDiv.addEventListener('mousedown', (e)=>{
    isGrabbing = true
  })
  newDiv.addEventListener('mouseup', (e)=>{
    isGrabbing = false
  })
  window.addEventListener('mousemove', (e)=> {
    if (!isGrabbing) return
    const relativeX = e.pageX - newDiv.offsetLeft
    const relativeY = e.pageY - newDiv.offsetTop
    audios[trackName].position = {
      x: relativeX,
      z: relativeY
    }
    audios[trackName].panner.setPosition(relativeX / 100, 0, relativeY / 100)
  }, false)
  audios[trackName].elem = newDiv
  document.body.append(newDiv)
}

Promise.all(URLS.map(URL=> {
  return window.fetch(URL)
  .then(res => res.arrayBuffer())
  .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
}))
.then(audioBuffers => {
  audioBuffers.forEach((audio, i)=>{
    audios[URLS[i]] = {
      elem: undefined,
      source: undefined,
      position: {
        x: 0,
        z: 0
      }
    }
    play(audio, URLS[i])
    makeElement(audio, URLS[i])
  })
  drawLoop()
})

function drawLoop() {
  Object.keys(audios).forEach(trackName => {
    const audio = audios[trackName]
    audio.analyser.instance.getByteTimeDomainData(audio.analyser.dataArray)
    const max = Math.max.apply(null, audio.analyser.dataArray) / 128
    const {x, z: y} = audio.position
    audio.elem.style.transform = `translate(${x}px, ${y}px) scale(${max})`
  })

  requestAnimationFrame(drawLoop);
}

