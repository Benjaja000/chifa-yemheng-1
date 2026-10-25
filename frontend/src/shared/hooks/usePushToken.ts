import { useEffect, useCallback } from 'react';

interface PushTokenOptions {
  userId: number;
  platform?: 'android' | 'ios' | 'web';
  vapidKey?: string; // Para web push
}

export function usePushToken({ userId, platform = 'web', vapidKey }: PushTokenOptions) {
  const registerToken = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.log('[Push] Push notifications not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      
      let subscription = await registration.pushManager.getSubscription();
      
      if (!subscription) {
        const options: PushSubscriptionOptionsInit = {
          userVisibleOnly: true,
        };
        if (vapidKey) {
          options.applicationServerKey = urlBase64ToUint8Array(vapidKey) as unknown as BufferSource;
        }
        subscription = await registration.pushManager.subscribe(options);
      }

      const token = subscription.toJSON();
      
      // Enviar token al backend
      const response = await fetch('/api/v1/repartidor/entregas/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({
          userId,
          token: JSON.stringify(token),
          platform,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to register push token');
      }

      console.log('[Push] Token registered successfully');
    } catch (error) {
      console.error('[Push] Registration failed:', error);
    }
  }, [userId, platform, vapidKey]);

  const unregisterToken = useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        
        await fetch('/api/v1/repartidor/entregas/token', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
          body: JSON.stringify({ userId }),
        });
      }
    } catch (error) {
      console.error('[Push] Unregister failed:', error);
    }
  }, [userId]);

  useEffect(() => {
    if (platform === 'web') {
      registerToken();
    }
    return () => {
      if (platform === 'web') {
        unregisterToken();
      }
    };
  }, [registerToken, unregisterToken, platform]);

  return { registerToken, unregisterToken };
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}