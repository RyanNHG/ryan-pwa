// Configuration
const config = {
  cache: {
    name: 'ryans-pwa-1.0.3',
    urlsToCache: [
      '/',
      '/service-worker.js',
      '/public/manifest.json',
      '/public/main.css',
      '/public/main.js',
      '/public/icons/192.png'
    ]
  }
}

// Install
const setupCache = (event) =>
  event.waitUntil(caches.open(config.cache.name)
    .then((cache) => cache.addAll(config.cache.urlsToCache))
  )

// Fetch
const _cacheResponse = (request, response) => {
  caches.open(config.cache.name).then(cache =>
    cache.put(request, response.clone())
  )
  return response
}

const _actuallyFetch = (request) =>
  fetch(request.clone()).then(response =>
    (response && response.status === 200 && response.type === 'basic')
      ? _cacheResponse(request, response)
      : response
  )

const fetchFromCache = (event) =>
  event.respondWith(caches.match(event.request)
    .then((response) => response || _actuallyFetch(event.request))
  )

// Activate
const cleanUpOldCaches = (event) =>
  event.waitUntil(caches.keys()
    .then((cacheNames) => Promise.all(
      cacheNames
        .filter(name => name !== config.cache.name)
        .map(name => caches.delete(name))
    ))
  )

// Lifecycle
self.addEventListener('install', setupCache)
self.addEventListener('fetch', fetchFromCache)
self.addEventListener('activate', cleanUpOldCaches)
