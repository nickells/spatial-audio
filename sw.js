const CACHE_NAME = 'ambience-cache';
const urlsToCache = [
  'ambience/Bird Ambience.mp3',
  'ambience/Busy City Street.mp3',
  'ambience/Campfire.mp3',
  'ambience/Car Interior.mp3',
  'ambience/Coffee Shop.mp3',
  'ambience/Electric Hum.mp3',
  'ambience/Forest 1.mp3',
  'ambience/Forest 2.mp3',
  'ambience/Helicopter.mp3',
  'ambience/Ocean Waves.mp3',
  'ambience/Plane.mp3',
  'ambience/Rumble.mp3',
  'ambience/Street Traffic.mp3',
  'ambience/Thuderstorm.mp3',
  'ambience/Windy Desert.mp3',
];

self.addEventListener('install', (event) => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          console.log('returning', response, 'from cache')
          return response;
        }
        return fetch(event.request);
      }
    )
  )
})