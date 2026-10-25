import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';

interface Pin {
  lat: number;
  lng: number;
  label?: string;
  color?: 'blue' | 'red' | 'green';
}

interface MapLeafletProps {
  pins: Pin[];
  readonly?: boolean;
  center?: [number, number];
  zoom?: number;
  onClick?: (e: L.LeafletMouseEvent) => void;
  className?: string;
  height?: string;
}

export function MapLeaflet({ pins, readonly = false, center, zoom = 15, onClick, className = '', height = '400px' }: MapLeafletProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: center || [pins[0]?.lat || -12.05, pins[0]?.lng || -77.03],
      zoom,
      zoomControl: !readonly,
      dragging: !readonly,
      scrollWheelZoom: !readonly,
      doubleClickZoom: !readonly,
      boxZoom: !readonly,
      keyboard: !readonly,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    if (onClick) {
      map.on('click', onClick);
    }

    return () => {
      map.off();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [readonly, center, zoom, onClick]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    pins.forEach((pin, i) => {
      const iconColor = pin.color || (i === 0 ? 'blue' : 'red');
      const icon = L.divIcon({
        className: 'custom-delivery-marker',
        html: `<div style="
          width: 32px; height: 32px; border-radius: 50% 50% 50% 0;
          background: ${iconColor === 'blue' ? '#3b82f6' : iconColor === 'red' ? '#ef4444' : '#22c55e'};
          transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        ">
          <div style="transform: rotate(45deg); display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; color: white; font-size: 14px; font-weight: bold;">
            ${i + 1}
          </div>
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const marker = L.marker([pin.lat, pin.lng], { icon })
        .addTo(map)
        .bindPopup(pin.label || `Pin ${i + 1}`);
      markersRef.current.push(marker);
    });

    if (pins.length > 0) {
      const group = L.featureGroup(markersRef.current as L.Layer[]);
      map.fitBounds(group.getBounds().pad(0.1));
    }
  }, [pins]);

  return <div ref={mapRef} className={`w-full ${className}`} style={{ height }} />;
}