const AUDIO_CONTEXT = new (window.AudioContext || window.webkitAudioContext)()

AUDIO_CONTEXT.listener.setPosition(0, 0, 0);

module.exports = AUDIO_CONTEXT
