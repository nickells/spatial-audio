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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = "<!DOCTYPE html>\n<html>\n<head>\n  <title></title>\n  <link rel=\"stylesheet\" type=\"text/css\" href=\"dist/styles.css\">\n</head>\n<body>\n\n<div id=\"you\">🙂</div>\n<script src=\"dist/bundle.js\"></script>\n<script src=\"http://localhost:35729/livereload.js\"></script>\n\n</body>\n</html>"

/***/ }),
/* 1 */
/***/ (function(module, exports) {

function canDragDrop($elem, onDrag){
  let isGrabbing = false

  $elem.addEventListener('mousedown', (e) => {
    isGrabbing = true
    document.body.classList.add('is-dragging')
    $elem.classList.add('is-being-dragged')
  })
  $elem.addEventListener('mouseup', (e) => {
    isGrabbing = false
    document.body.classList.remove('is-dragging')
    $elem.classList.remove('is-being-dragged')
  })
  window.addEventListener('mousemove', (e) => {
    if (!isGrabbing) return
    const relativeX = e.pageX - $elem.offsetLeft - ($elem.clientWidth / 2)
    const relativeY = e.pageY - $elem.offsetTop - ($elem.clientHeight / 2)
    $elem.style.transform = `translate(${relativeX}px, ${relativeY}px)`
    onDrag && onDrag({
      relativeX,
      relativeY
    })
  })
}

module.exports = {
  canDragDrop
}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

// require index.html so livereload will watch it
const index = __webpack_require__(0) // eslint-disable-line no-unused-vars
const { canDragDrop } = __webpack_require__(1)

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

function makePlayer(trackName) {
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
}

function toRadians (angle) {
  return angle * (Math.PI / 180)
}

function calculatePositions(index){
  const total = URLS.length
  const deg = 360 - ((180 / (total - 1)) * index)
  const radius = 150
  return {
    x: 0 + radius * Math.cos(toRadians(deg)),
    z: radius * Math.sin(toRadians(deg))
  }
}

Promise.all(
  URLS.map((URL, i) =>
    window.fetch(URL)
    .then(res => {
      // initial data
      const { z, x} = calculatePositions(i)
      audios[URLS[i]] = {
        elem: undefined,
        source: undefined,
        position: {
          z,
          x
        },
      }
      makePlayer(URLS[i])
      return res
    })
    .then(res => res.arrayBuffer())
    .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
    .then(decodedBuffer => hookUpAudio(decodedBuffer, URLS[i]))
  )
)
.then((audioSources) => {
  audioSources.forEach(source => source.start())
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



/***/ })
/******/ ]);