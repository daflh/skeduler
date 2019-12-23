self.addEventListener('fetch', ()=>{})

self.addEventListener('install', function(event) {
    event.waitUntil(skipWaiting());
});

self.addEventListener('activate', function(event) {
    event.waitUntil(clients.claim());
});

self.addEventListener('push', function(event) {
    let options = {
        body: 'Here is a push notification body!',
        icon: './img/icons/144x144.png',
        requireInteraction: true
    };
    event.waitUntil(
        self.registration.showNotification('Coragon Push', options)
    );
});

self.addEventListener('notificationclick', function(event) {
    let data = event.data;
    let action = event.action;
    if (action === 'snooze') {
        console.log("notification snoozed");
    } else if (action === "done") {
        console.log("notification done");
    } else {
        clients.openWindow('https://coragon.web.app/events');
    }
    event.notification.close();
});