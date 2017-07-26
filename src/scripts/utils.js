const URLS = require('./tracklist')

function canDragDrop($elem, onDrag) {
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
      relativeY,
    })
  })
}

function canDoubleClick($elem, onDoubleClick) {
  let isWaitingForSecondClick = false
  $elem.addEventListener('click', (e) => {
    if (isWaitingForSecondClick){
      onDoubleClick && onDoubleClick(e)
    }
    isWaitingForSecondClick = true
    setTimeout(() => {
      isWaitingForSecondClick = false
    }, 200)
  })
}

function toRadians(angle) {
  return angle * (Math.PI / 180)
}

function calculateInitialPositions(index) {
  const total = URLS.length
  // const deg = 180 + ((180 / (total - 1)) * index)
  const deg = ((360 / (total)) * index)
  const radius = Math.min((window.innerWidth / 2) * 0.5, 500)
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
