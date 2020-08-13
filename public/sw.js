const cacheVer = "v2.0";
const cacheName = "skeduler-" + cacheVer;
const assets = [
    '/',
    '/index.html',
    '/events.html',
    '/goals.html',
    '/notes.html',
    '/login.html',
    '/css/main.css',
    '/js/main.js',
    '/img/icons.svg',
    '/img/banner.png',
    '/img/logo/64x64.png'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll(assets).then(function() {
                self.skipWaiting();
            });
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(
                keys.filter(function(key) {
                    return key.indexOf(cacheVer) === -1;
                }).map(function(key) {
                    return caches.delete(key);
                })
            );
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        fetch(event.request).catch(function() {
            return caches.match(event.request);
        })
    );
});
