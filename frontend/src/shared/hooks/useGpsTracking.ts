import { useState, useEffect, useRef } from 'react';

export interface GpsPosition {
  lat: number;
  lng: number;
}

export interface UseGpsTrackingOptions {
  onPosition: (position: GpsPosition) => void;
  enabled?: boolean;
  onError?: (error: GeolocationPositionError) => void;
}

export function useGpsTracking(options: UseGpsTrackingOptions) {
  const { onPosition, onError, enabled: enabledProp = true } = options;
  const [enabled, setEnabled] = useState(enabledProp);
  const onPositionRef = useRef(onPosition);
  const onErrorRef = useRef(onError);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    onPositionRef.current = onPosition;
    onErrorRef.current = onError;
  }, [onPosition, onError]);

  useEffect(() => {
    if (!enabled) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    if (!navigator.geolocation) {
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          onPositionRef.current({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => {
          console.error('Error GPS:', err);
          onErrorRef.current?.(err);
        },
        { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
      );
    watchIdRef.current = watchId;

    return () => {
      navigator.geolocation.clearWatch(watchId);
      watchIdRef.current = null;
    };
  }, [enabled]);

  return { enabled, setEnabled };
}