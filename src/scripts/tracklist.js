const URLS = [
  'tracks/01_KickInside.wav',
  'tracks/02_KickBeater.wav',
  'tracks/03_Snare.wav',
  'tracks/04_Overheads.wav',
  'tracks/05_Bass.wav',
  'tracks/06_Piano.wav',
]

const Jazz = [
  {
    track: 'jazz/01_Kick.wav',
    icon: '🥁',
  },
  {
    track: 'jazz/02_Snare.wav',
    icon: '🥁',
  },
  {
    track: 'jazz/03_Overhead.wav',
    icon: '🥁',
  },
  {
    track: 'jazz/04_BassDI.wav',
    icon: '🐟',
  },
  {
    track: 'jazz/05_ElecGtr.wav',
    icon: '🎸',
  },
  {
    track: 'jazz/06_Piano.wav',
    icon: '🎹',
  },
  {
    track: 'jazz/07_Trumpet1.wav',
    icon: '🎺',
  },
  {
    track: 'jazz/08_Trumpet2.wav',
    icon: '🎺',
  },
  {
    track: 'jazz/09_Trumpet3.wav',
    icon: '🎺',
  },
  {
    track: 'jazz/10_Trumpet4.wav',
    icon: '🎺',
  },
  {
    track: 'jazz/11_SaxAlto01.wav',
    icon: '🎷',
  },
  {
    track: 'jazz/12_SaxAlto02.wav',
    icon: '🎷',
  },
  {
    track: 'jazz/13_SaxTenor01.wav',
    icon: '🎷',
  },
  {
    track: 'jazz/14_SaxTenor02.wav',
    icon: '🎷',
  },
  {
    track: 'jazz/15_SaxBaritone.wav',
    icon: '🎷',
  },
  {
    track: 'jazz/16_Trombone1.wav',
    icon: '🍖',
  },
  {
    track: 'jazz/17_Trombone2.wav',
    icon: '🍖',
  },
  {
    track: 'jazz/18_Trombone3.wav',
    icon: '🍖',
  },
  {
    track: 'jazz/19_TromboneBass.wav',
    icon: '🍖',
  },
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


module.exports = window.location.search.includes('jazz') ? Jazz : Ambience
