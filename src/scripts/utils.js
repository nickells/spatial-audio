const URLS = require('./tracklist')

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
