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

var promise = new Promise (function(resolve, reject) {
  setTimeout(function() {
    // resolve('This is excuted once the timer is done');
    reject({code: 500, message: 'An Error Occured'});
    // console.log('This is excuted once the timer is done');
  }, 3000)
})

// example for using Ajax, We can not use traditional Ajax method with service worker
var xhr = new XMLHttpRequest();
xhr.open("GET", "https://httpbin.org/ip");

xhr.responseType = "json";

xhr.onload = function () {
  console.log(xhr.response);
};

xhr.onerror = function () {
  console.log("Errror");
};

xhr.send();

// Fetch is the best way to make http request in service worker
// Fetch
// get request
fetch('https://httpbin.org/ip')
// fetch('https://httpbin.org/ipssss') // wrong url for testing error handling
.then(function(respone) {
  console.log(respone);
  return respone.json();
})
.then(function(data) {
  console.log(data);
})
.catch(function(err) {
  console.log(err);
});

// post request
fetch('https://httpbin.org/post', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  mode: 'cors', // no-cors, cors, same-origin - [ (default) is 'cors' ]
  // mode: 'no-cors', // no-cors, cors, same-origin - [ (default) is 'cors' ]
  // body: {body: 'This is a test'}
  body: JSON.stringify({
    body: 'This is a test'
  })
})
.then(function(respone) {
  console.log(respone);
  return respone.json();
})
.then(function(data) {
  console.log(data);
})
.catch(function(err) {
  console.log(err);
});

// Promises example
// handle ersolve
promise.then(function(text) {
  return text;
}, function(err) {
  console.log(err.code, err.message);
})
.then(function(newText) {
  console.log(newText);
});

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
