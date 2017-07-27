const waitForServiceWorker = () => new Promise((resolve, reject) => {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      resolve(registration)
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
      reject(err)
    });
  });
})

module.exports = waitForServiceWorker