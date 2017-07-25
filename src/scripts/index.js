// require index.html so livereload will watch it
const index = require('../../index.html') // eslint-disable-line no-unused-vars
const { canDragDrop } = require('./utils')

const audioCtx = new (window.AudioContext || window.webkitAudioContext)() // define audio context


const $player = document.getElementById('you')



const URLS = [
  'tracks/01_MainPair1.wav',
  'tracks/02_MainPair2.wav',
  'tracks/03_SpotMic1_Tenors.wav',
  'tracks/04_SpotMic2_Basses.wav',
  'tracks/05_SpotMic3_Sopranos.wav',
  'tracks/06_SpotMic4_Altos.wav',
  'tracks/07_BassCloseMic1.wav',
  'tracks/08_BassCloseMic2.wav',
  'tracks/09_BassCloseMic3.wav',
  'tracks/10_BassCloseMic4.wav',
  'tracks/11_BassCloseMic5.wav',
  'tracks/12_PercSolo_CloseMic1.wav',
  'tracks/13_PercSolo_CloseMic2.wav',
  'tracks/14_PercSolo_FarMicPair1.wav',
  'tracks/15_PercSolo_FarMicPair2.wav',
  'tracks/16_PercChoir MicPair1.wav',
  'tracks/17_PercChoir MicPair2.wav',
  'tracks/18_PercChoir MicPair3.wav',
  'tracks/19_Whistle.wav',
  'tracks/20_LeadVox.wav',
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
  // source.loop = true
  source.start()
}

canDragDrop($player, ({relativeX, relativeY})=>{
  audioCtx.listener.setPosition(relativeX / 100, 0, relativeY / 100)
})

function makePlayer(buffer, trackName) {
  const newDiv = document.createElement('div')
  let isGrabbing = false
  newDiv.classList.add('speaker')
  newDiv.innerHTML = '😯'
  canDragDrop(newDiv, ({relativeX, relativeY}) => {
    audios[trackName].position = {
      x: relativeX,
      z: relativeY,
    }
    audios[trackName].panner.setPosition(relativeX / 100, 0, relativeY / 100)
  })

  audios[trackName].elem = newDiv
  document.body.append(newDiv)
}

Promise.all(URLS.map(URL => window.fetch(URL)
  .then(res => res.arrayBuffer())
  .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer)))
)
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
    hookUpAudio(audio, URLS[i])
    makePlayer(audio, URLS[i])
  })
  drawLoop()
})

// setInterval(function changeFace(){
//   const faces = ['😯', '😧', '😲', '😩', '😙']
//   Object.keys(audios).forEach((trackName) => {
//     audios[trackName].elem.innerHTML = faces[Math.floor(Math.random() * faces.length)]
//   })
// }, 500)

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

