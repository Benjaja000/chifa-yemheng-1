import { useState, useEffect, useRef } from 'react';

export interface GpsPosition {
  lat: number;
  lng: number;
}

export interface UseGpsTrackingOptions {
  onPosition: (position: GpsPosition) => void;
  autoStop?: 'P' | 'R' | 'E' | 'C';
  enabled?: boolean;
}

export function useGpsTracking(options: UseGpsTrackingOptions) {
  const { onPosition, autoStop: autoStopProp, enabled: enabledProp = true } = options;
  const [enabled, setEnabled] = useState(enabledProp);
  const [state, setState] = useState<'P' | 'R' | 'E' | 'C'>('P');

  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    const checkAutoStop = (_pos: GpsPosition) => {
      if (autoStopProp && autoStopProp.includes(state)) {
        navigator.geolocation.clearWatch(watchIdRef.current!);
        watchIdRef.current = null;
        setEnabled(false);
      }
    };

    let watchId: number | null = null;

    const startWatch = () => {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          onPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          checkAutoStop({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => console.error('Error GPS:', err),
        { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 }
      );
      watchIdRef.current = watchId;
    };

    startWatch();

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [enabled, onPosition, autoStopProp]);

  return { enabled, setEnabled, state, setState };
}