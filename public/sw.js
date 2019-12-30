self.addEventListener('fetch', ()=>{})

self.addEventListener('install', function(event) {
    event.waitUntil(skipWaiting());
});

self.addEventListener('activate', function(event) {
    event.waitUntil(clients.claim());
});