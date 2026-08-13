/**
 * Service Worker для обработки push-уведомлений
 * Позволяет получать уведомления даже когда приложение закрыто
 */

self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    
    const options = {
      body: data.body || 'Проверьте карту для получения информации об опасности',
      icon: 'images/logo.png',
      badge: 'images/icon-target.png',
      tag: data.tag || 'radar-notification',
      requireInteraction: true,
      actions: [
        { action: 'open', title: 'Открыть' },
        { action: 'close', title: 'Закрыть' }
      ]
    };
  
    event.waitUntil(
      self.registration.showNotification(data.title || 'РАДАР: Опасность БПЛА', options)
    );
  });
  
  // Обработка клика на уведомление
  self.addEventListener('notificationclick', (event) => {
    event.notification.close();
  
    if (event.action === 'close') {
      return;
    }
  
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        // Проверяем, открыто ли приложение
        for (let client of clientList) {
          if (client.url === '/' || client.url.includes('index.html')) {
            return client.focus();
          }
        }
        // Если приложение не открыто, открываем его
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  });
  
  // Закрытие уведомления
  self.addEventListener('notificationclose', (event) => {
    console.log('Уведомление закрыто:', event.notification.tag);
  });
  