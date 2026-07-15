// sw.js - Service Worker para PWA com Notificações
const CACHE_NAME = 'life-rpg-v4';

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Instalação
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// Fetch (cache-first, depois rede)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).then(fetchResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    })
  );
});

// Ativação
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Push Notification
self.addEventListener('push', event => {
  const data = event.data?.json() || {};
  const title = data.title || 'Life RPG';
  const options = {
    body: data.body || 'Hora de completar suas missões!',
    icon: '⚔️',
    badge: '⚔️',
    vibrate: [200, 100, 200],
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Clique na notificação
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});