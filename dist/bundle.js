/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

const URLS = [
  'tracks/01_KickInside.wav',
  'tracks/02_KickBeater.wav',
  'tracks/03_Snare.wav',
  'tracks/04_Overheads.wav',
  'tracks/05_Bass.wav',
  'tracks/06_Piano.wav',
]

const Ambience = [
  {
    track: 'ambience/Bird Ambience.mp3',
    icon: '🐦',
  },
  {
    track: 'ambience/Busy City Street.mp3',
    icon: '🏙',
  },
  {
    track: 'ambience/Campfire.mp3',
    icon: '🔥',
  },
  {
    track: 'ambience/Car Interior.mp3',
    icon: '🚗',
  },
  {
    track: 'ambience/Coffee Shop.mp3',
    icon: '☕',
  },
  {
    track: 'ambience/Electric Hum.mp3',
    icon: '🔌',
  },
  {
    track: 'ambience/Forest 1.mp3',
    icon: '🌳',
  },
  {
    track: 'ambience/Forest 2.mp3',
    icon: '🏕',
  },
  {
    track: 'ambience/Helicopter.mp3',
    icon: '🚁',
  },
  {
    track: 'ambience/Ocean Waves.mp3',
    icon: '🌊',
  },
  // {
  //   track: 'ambience/Plane.mp3',
  //   icon: '🛩',
  // },
  {
    track: 'ambience/Rumble.mp3',
    icon: '💢',
  },
  {
    track: 'ambience/Street Traffic.mp3',
    icon: '🛣',
  },
  {
    track: 'ambience/Thuderstorm.mp3',
    icon: '⛈',
  },
  {
    track: 'ambience/Windy Desert.mp3',
    icon: '🌬',
  },
]

module.exports = Ambience

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = "<!DOCTYPE html>\n<html>\n<head>\n  <title></title>\n  <link rel=\"stylesheet\" type=\"text/css\" href=\"dist/styles.css\">\n  <meta name=\"viewport\" content=\"width=device-width, user-scalable=no, initial-scale=0.8\" />\n\n</head>\n<body>\n<div id=\"help-modal\" class=\"\">\n  <div class=\"info\">\n    <span>Double click on any sound to activate or deactivate it.</span>\n    <span>Drag sounds around to change their position.</span>\n    <span>Drag the face to change your position.</span>\n    <span>Headphones are highly recommended!</span>\n  </div>\n  <div class=\"scrim\"></div>\n</div>\n\n<div id=\"you\">🙂</div>\n<div id=\"help\">❓</div>\n<script src=\"dist/bundle.js\"></script>\n<script src=\"http://localhost:35729/livereload.js\"></script>\n\n</body>\n</html>"

/***/ }),
/* 2 */
/***/ (function(module, exports) {

const audios = {

}

module.exports = audios


/***/ }),
/* 3 */
/***/ (function(module, exports) {

function initHelp(){
  const modal = document.getElementById('help-modal')
  document.getElementById('help').addEventListener('click', ()=>{
    modal.classList.add('active')
  })

  document.getElementsByClassName('scrim')[0].addEventListener('click', ()=>{
    modal.classList.remove('active')
  })
}

module.exports = initHelp

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const URLS = __webpack_require__(0)

function canDragDrop($elem, onDrag) {
  let isGrabbing = false

  const mousedown = (e) => {
    e.preventDefault()
    isGrabbing = true
    document.body.classList.add('is-dragging')
    $elem.classList.add('is-being-dragged')
  }

  const mouseup = (e) => {
    e.preventDefault()
    isGrabbing = false
    document.body.classList.remove('is-dragging')
    $elem.classList.remove('is-being-dragged')
  }

  const mousemove = (e) => {
    if (!isGrabbing) return
    let touch = e.touches ? e.touches[0] : e
    const relativeX = touch.pageX - $elem.offsetLeft - ($elem.clientWidth / 2)
    const relativeY = touch.pageY - $elem.offsetTop - ($elem.clientHeight / 2)
    $elem.style.transform = `translate(${relativeX}px, ${relativeY}px)`
    onDrag && onDrag({
      relativeX,
      relativeY,
    })
  }

  $elem.addEventListener('mousedown', mousedown)
  $elem.addEventListener('mouseup', mouseup)
  window.addEventListener('mousemove', mousemove)

  $elem.addEventListener('touchstart', mousedown)
  $elem.addEventListener('touchend', mouseup)
  window.addEventListener('touchmove', mousemove)
}

function canDoubleClick($elem, onDoubleClick) {
  let isWaitingForSecondClick = false
  const doubleClick = (e) => {
    e.preventDefault()
    if (isWaitingForSecondClick){
      onDoubleClick && onDoubleClick(e)
    }
    isWaitingForSecondClick = true
    setTimeout(() => {
      isWaitingForSecondClick = false
    }, 200)
  }
  $elem.addEventListener('click', doubleClick)
  $elem.addEventListener('touchstart', doubleClick)
}

function toRadians(angle) {
  return angle * (Math.PI / 180)
}

function calculateInitialPositions(index) {
  const total = URLS.length
  // const deg = 180 + ((180 / (total - 1)) * index)
  const deg = ((360 / (total)) * index)
  const radius = Math.min((window.innerWidth / 2), (window.innerHeight / 2)) * 0.6
  return {
    x: 0 + radius * Math.cos(toRadians(deg)),
    z: radius * Math.sin(toRadians(deg)),
  }
}

function toggleMute(audioTrack){
  audioTrack.muted = !audioTrack.muted
  if (audioTrack.muted) {
    audioTrack.gainNode.gain.value = 0
    audioTrack.elem.style.opacity = 0.5
  } else {
    audioTrack.gainNode.gain.value = 1
    audioTrack.elem.style.opacity = 1.0
  }
}


module.exports = {
  canDragDrop,
  toRadians,
  canDoubleClick,
  calculateInitialPositions,
  toggleMute
}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

// require index.html so livereload will watch it
const index = __webpack_require__(1) // eslint-disable-line no-unused-vars
const { canDragDrop, calculateInitialPositions, canDoubleClick, toggleMute } = __webpack_require__(4)
const URLS = __webpack_require__(0)
const audios = __webpack_require__(2)

const helpModal = __webpack_require__(3)()

const audioCtx = new (window.AudioContext || window.webkitAudioContext)() // define audio context
const $player = document.getElementById('you')

let sunglasses = false

audioCtx.listener.setPosition(0, 0, 0);

// function createListener(audioBuffer, trackName) {
//   navigator.mediaDevices.getUserMedia({audio: true, video: true})
//   .then(stream => {
//     const source = audioCtx.createMediaStreamSource(stream)
//   })
// }

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

// canDoubleClick($player, () => {
//   sunglasses = !sunglasses
//   if (sunglasses) $player.innerHTML = '😌'
//   else $player.innerHTML = '🙂'
// })

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
    audio.elem.style.transform = `translate3d(${x}px, ${y}px, 0px) scale(${max})`
  })
  setTimeout(() => {
    requestAnimationFrame(drawLoop);
  }, 1000 / 60)
}

function loadMp3(url) {
  return window.fetch(url)
  .then(res => res.arrayBuffer())
  .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
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
}))
.then((audioSources) => {
  audioSources.forEach(source => source.start())
  drawLoop()
})


/***/ })
/******/ ]);