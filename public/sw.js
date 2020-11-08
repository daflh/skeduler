const cacheVer = "v2.0";
const cacheName = "skeduler-" + cacheVer;
const assets = [
    'manifest.json',
    '/',
    '/index.html',
    '/events.html',
    '/goals.html',
    '/login.html',
    '/css/main.css',
    '/js/main.js',
    '/img/icons.svg',
    '/img/logo-64x64.png',
    '/img/logo-192x192.png',
    '/img/logo-512x512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(assets).then(() => {
                self.skipWaiting();
            });
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => {
                    return key.indexOf(cacheVer) === -1;
                }).map((key) => {
                    return caches.delete(key);
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
