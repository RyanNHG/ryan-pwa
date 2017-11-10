'use strict';

// Configuration
var config = {
  cache: {
    name: 'ryans-pwa-1.0.0',
    urlsToCache: ['/', '/public/manifest.json', '/public/main.css', '/public/main.js', '/public/icons/192.png']
  }
};

// Install
var setupCache = function setupCache(event) {
  return event.waitUntil(caches.open(config.cache.name).then(function (cache) {
    return cache.addAll(config.cache.urlsToCache);
  }));
};

// Fetch
var _cacheResponse = function _cacheResponse(request, response) {
  caches.open(config.cache.name).then(function (cache) {
    return cache.put(request, response.clone());
  });
  return response;
};

var _actuallyFetch = function _actuallyFetch(request) {
  return fetch(request.clone()).then(function (response) {
    return response && response.status === 200 && response.type === 'basic' ? _cacheResponse(request, response) : response;
  });
};

var fetchFromCache = function fetchFromCache(event) {
  return event.respondWith(caches.match(event.request).then(function (response) {
    return response || _actuallyFetch(event.request);
  }));
};

// Activate
var cleanUpOldCaches = function cleanUpOldCaches(event) {
  return event.waitUntil(caches.keys().then(function (cacheNames) {
    return Promise.all(cacheNames.filter(function (name) {
      return name !== config.cache.name;
    }).map(function (name) {
      return caches.delete(name);
    }));
  }));
};

// Lifecycle
self.addEventListener('install', setupCache);
self.addEventListener('fetch', fetchFromCache);
self.addEventListener('activate', cleanUpOldCaches);
