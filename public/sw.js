var CACH_STATIC_NAME = "static-v13";
var CACH_DYNAMIC_NAME = "dynamic-v2";
var STATIC_FILES = [
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
  'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css',
];

self.addEventListener("install", function (event) {
  console.log("[Service worker] Installing Service Worker ...", event);
  event.waitUntil(
    caches.open(CACH_STATIC_NAME)
  .then(function (cache) {
    console.log("[Service worker] Precaching App Shell");
    cache.addAll(STATIC_FILES);
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

// function isInArray(string, array) {
//   for (var i = 0; i < array.length; i++) {
//     if (array[i] === string) {
//       return true;
//     }
//   }
//   return false;
// }

// Making route matching more precise
function isInArray(string, array) {
  var cachePath;
  if (string.indexOf(self.origin) === 0) { // request targets domain where we serve the page from (i.e. NOT a CDN)
    console.log('matched ', string);
    cachePath = string.substring(self.origin.length); // take the part of the URL AFTER the domain (e.g. after localhost:8080)
  } else {
    cachePath = string; // store the full request (for CDNs)
  }
  return array.indexOf(cachePath) > -1;
}

// Cach then network with network fallback strategy [offline support]
self.addEventListener('fetch', function (event) {
  var url = 'https://httpbin.org/get';
  if (event.request.url.indexOf(url) > -1) {
    event.respondWith(
      caches.open(CACH_DYNAMIC_NAME)
        .then(function (cache) {
          return fetch(event.request)
            .then(function (res) {
              cache.put(event.request, res.clone());
              return res;
            });
        })
    );
    // check if the request urls matches the url we want to cache in the STATIC_FILES array[]
  } else if (isInArray(event.request.url, STATIC_FILES)) {
    // cach only strategy
    event.respondWith(
      caches.match(event.request)
    );
  } else {
    event.respondWith(
      // Cach with network fallback strategy
      // return the data from cache if we have it
      caches.match(event.request).then(function (response) {
        if (response) {
          return response;
        } else {
          return fetch(event.request)
            .then(function (res) {
              return caches.open(CACH_DYNAMIC_NAME)
              .then(function (cache) {
                cache.put(event.request.url, res.clone());
                return res;
              });
            })
            .catch(function (err) {
              // console.log(err);
              return caches.open(CACH_STATIC_NAME)
              .then(function (cache) {
                if (event.request.headers.get('accept').includes('text/html')) {
                  return cache.match("/offline.html");
                }
              });
            });
        }
      })
    );
  }
});

// Cach with network fallback strategy
// self.addEventListener("fetch", function (event) {
//   event.respondWith(
//     // return the data from cache if we have it
//     caches.match(event.request)
//     .then(function (response) {
//       if (response) {
//         return response;
//       } else {
//         return fetch(event.request)
//         .then(function (res) {
//           return caches.open(CACH_DYNAMIC_NAME)
//           .then(function (cach) {
//             cach.put(event.request.url, res.clone());
//             return res;
//           })
//         })
//         .catch(function (err) {
//           // console.log(err);
//           return caches.open(CACH_STATIC_NAME)
//           .then(function (cache) {
//             return cache.match('/offline.html');
//           });
//         });
//       }
//     })
//   );
// });

// Cach only strategy - [ only return data from the cache ]
// self.addEventListener("fetch", function (event) {
//   event.respondWith(
//     caches.match(event.request)
//   );
// });

// Network only strategy - [ only return data from the network ]
// self.addEventListener("fetch", function (event) {
//   event.respondWith(
//     fetch(event.request)
//   );
// });

// Network with cache fallback strategy
// self.addEventListener("fetch", function (event) {
//   event.respondWith(
//     fetch(event.request)
//     .then(function (res) {
//       return caches.open(CACH_DYNAMIC_NAME)
//       .then(function (cache) {
//         cache.put(event.request.url, res.clone());
//         return res;
//       })
//     })
//     .catch(function (err) {
//       return caches.match(event.request);
//     })
//   );
// });
