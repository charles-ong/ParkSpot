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
  
  // This variable will save the event for later use.
  let deferredPrompt;

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevents the default mini-infobar or install dialog from appearing on mobile
    e.preventDefault();
    // Save the event because you'll need to trigger it later.
    deferredPrompt = e;
    console.log("1");
    console.log(deferredPrompt);
  });
} 
else {
  console.log('Service Worker is not supported by browser.');
}
