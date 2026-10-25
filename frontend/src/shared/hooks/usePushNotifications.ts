import { useEffect, useState } from 'react';

export interface PushNotificationOptions {
  onNewAssignment?: (deliveryId: number) => void;
  onEnRuta?: (deliveryId: number) => void;
  onSupervisorMessage?: (message: string) => void;
}

export function usePushNotifications(options: PushNotificationOptions = {}) {
  const { onNewAssignment, onEnRuta } = options;
  const [tokenRegistrado, setTokenRegistrado] = useState(false);

  useEffect(() => {
    // Solicitar permiso de notificaciones
    if (!('Notification' in window)) {
      console.log('Notifications not supported');
      return;
    }

    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        setTokenRegistrado(true);
        // Registrar token FCM en backend
        navigator.serviceWorker.ready.then(registration => {
          registration.pushManager.getSubscription().then(subscription => {
            if (subscription) {
              // Enviar token al backend
              // fetch('/api/v1/repartidor/entregas/token', {
              //   method: 'POST',
              //   body: JSON.stringify({ token: subscription.toJSON(), platform: 'web' })
              // })
              console.log('Token FCM listo:', subscription.toJSON());
            }
          });
        });
      }
    });
  }, []);

  // Simular listener de mensajes entrantes (en producción usaría service worker)
  useEffect(() => {
    const checkMessages = () => {
      // En producción: navigator.serviceWorker.addEventListener('message', ...)
      // Por ahora, simulación con setInterval
      // const data = localStorage.getItem('push-data');
      // if (data) {
      //   const parsed = JSON.parse(data);
      //   if (parsed.type === 'new_assignment' && onNewAssignment) {
      //     onNewAssignment(parsed.deliveryId);
      //   }
      //   if (parsed.type === 'en_ruta' && onEnRuta) {
      //     onEnRuta(parsed.deliveryId);
      //   }
      //   localStorage.removeItem('push-data');
      // }
    };

    const interval = setInterval(checkMessages, 15000);
    return () => clearInterval(interval);
  }, [onNewAssignment, onEnRuta]);

  return { tokenRegistrado };
}