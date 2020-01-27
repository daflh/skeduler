let cacheName = "coragon-1";

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/events.html',
                '/goals.html',
                '/notes.html',
                '/login.html',
                '/404.html',
                '/css/main.css',
                '/js/main.js',
                '/img/logo.png'
            ]).then(() => self.skipWaiting());
        })
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        clients.claim()
    );
});

self.addEventListener('fetch', function(event) {
    if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
        event.respondWith(
            fetch(event.request.url)
        );
    } else {
        event.respondWith(
            caches.match(event.request).then(function(response) {
                return response || fetch(event.request);
            })
        );
    }
});