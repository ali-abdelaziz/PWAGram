var deferredPrompt;

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

var promise = new Promise (function(resolve, reject) {
  setTimeout(function() {
    // resolve('This is excuted once the timer is done');
    reject({code: 500, message: 'An Error Occured'});
    // console.log('This is excuted once the timer is done');
  }, 3000)
})

// Promises example
// handle ersolve
// promise.then(function(text) {
//   return text;
// }, function(err) {
//   console.log(err.code, err.message);
// })
// .then(function(newText) {
//   console.log(newText);
// });

// handle reject
promise.then(function(text) {
  return text;
}, function(err) {
  console.log(err.code, err.message);
})
.then(function(newText) {
  console.log(newText);
})
.catch(function(err) {
  console.log(err.code, err.message);
});

console.log('This is excuted after the timeout');
