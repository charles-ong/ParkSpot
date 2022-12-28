if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
        console.log('Service Worker registration successful', registration.scope);
      }, function(err) {
        console.log('Service Worker registration failed', err);
      }).catch(function(err) {
        console.log(err);
      });
    });
} 
else {
  console.log('Service Worker is not supported by browser.');
}
