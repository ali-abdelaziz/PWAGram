var CACH_STATIC_NAME = "static-v10";
var CACH_DYNAMIC_NAME = "dynamic-v2";

self.addEventListener("install", function (event) {
  console.log("[Service worker] Installing Service Worker ...", event);
  event.waitUntil(
    caches.open(CACH_STATIC_NAME)
  .then(function (cache) {
    console.log("[Service worker] Precaching App Shell");
    cache.addAll([
      '/',
      '/index.html',
      '/offline.html',
      '/src/js/app.js',
      '/src/js/feed.js',
      '/src/js/promise.js',
      '/src/js/fetch.js',
      '/src/js/material.min.js',
      '/src/css/app.css',
      '/src/css/feed.css',
      '/src/images/main-image.jpg',
      'https://fonts.googleapis.com/css?family=Roboto:400,700',
      'https://fonts.googleapis.com/icon?family=Material+Icons',
      'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
    ]);
  })
  )
});

self.addEventListener("activate", function (event) {
  console.log("[Service worker] Activating Service Worker ...", event);
  // removing  old caches that are no longer needed and adding new ones [static-v3, dynamic]
  event.waitUntil(
    caches.keys()
    .then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== CACH_STATIC_NAME && key !== CACH_DYNAMIC_NAME) {
          console.log("[Service worker] Removing old cache", key);
          return caches.delete(key);
        }
      }));
    })
  )
  return self.clients.claim();
});

// Cach with network fallback strategy
self.addEventListener("fetch", function (event) {
  event.respondWith(
    // return the data from cache if we have it
    caches.match(event.request)
    .then(function (response) {
      if (response) {
        return response;
      } else {
        return fetch(event.request)
        .then(function (res) {
          return caches.open(CACH_DYNAMIC_NAME)
          .then(function (cach) {
            cach.put(event.request.url, res.clone());
            return res;
          })
        })
        .catch(function (err) {
          // console.log(err);
          return caches.open(CACH_STATIC_NAME)
          .then(function (cache) {
            return cache.match('/offline.html');
          });
        });
      }
    })
  );
});
