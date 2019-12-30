importScripts('https://www.gstatic.com/firebasejs/7.4.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.4.0/firebase-messaging.js');

firebase.initializeApp({
  'messagingSenderId': '975187721562'
});

firebase.messaging().setBackgroundMessageHandler(function(payload) {
  let data = payload.data;
  let title = data.title || "Coragon Notification";
  let options = {
    body: data.body,
    icon: './img/icons/192x192.png',
    requireInteraction: true
  };
  return self.registration.showNotification(title, options);
});

self.addEventListener('fetch', ()=>{})

self.addEventListener('install', function(event) {
  event.waitUntil(skipWaiting());
});

self.addEventListener('activate', function(event) {
  event.waitUntil(clients.claim());
});

// self.addEventListener('notificationclick', function(event) {
//   let data = event.data;
//   let action = event.action;
//   if (action === 'snooze') {
//     console.log("notification snoozed");
//   } else if (action === "done") {
//     console.log("notification done");
//   } else {
//     clients.openWindow('https://coragon.web.app/events');
//   }
//   event.notification.close();
// });