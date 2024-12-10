
var deferredPrompt;
// adding polyfill for promise
if (!window.Promise) {
  window.Promise = Promise;
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js")
  .then(function () {
    console.log("Service Worker Registered");
  })
  .catch(function (err) {
    console.log(err, "Service Worker Registeration Failed");
  });
}

window.addEventListener("beforeinstallprompt", function (event) {
  console.log("beforeinstallprompt event fired");
  event.preventDefault();
  deferredPrompt = event;
  return false;
});
