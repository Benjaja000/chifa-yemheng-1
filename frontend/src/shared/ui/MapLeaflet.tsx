import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';

interface PinConProvincia {
  lat: number;
  lng: number;
  label?: string;
  color?: 'blue' | 'red' | 'green';
  id_distrito?: number;
  id_provincia?: number;
}

interface MapLeafletProps {
  pins: PinConProvincia[];
  readonly?: boolean;
  center?: [number, number];
  zoom?: number;
  onClick?: (e: L.LeafletMouseEvent) => void;
  draggablePins?: boolean;
  onPinDragEnd?: (index: number, lat: number, lng: number) => void;
  className?: string;
  height?: string;
  drawRadius?: number;
  radiusCenter?: [number, number];
  provinciaId?: number; // Filtrar pins por provincia
}

export function MapLeaflet({ pins, readonly = false, center, zoom = 15, onClick, draggablePins = false, onPinDragEnd, className = '', height = '400px', drawRadius, radiusCenter, provinciaId }: MapLeafletProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const onClickRef = useRef(onClick);
  const onPinDragEndRef = useRef(onPinDragEnd);
  const radiusCircleRef = useRef<L.Circle | null>(null);

  useEffect(() => {
    onClickRef.current = onClick;
  });

  useEffect(() => {
    onPinDragEndRef.current = onPinDragEnd;
  });

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

    if (onClickRef.current) {
      map.on('click', onClickRef.current);
    }

    return () => {
      map.off();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [readonly, zoom]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !center) return;
    map.setView(center, zoom);
  }, [center, zoom]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const allowPinDrag = draggablePins && !readonly;

    // Filtrar pins por provincia si se especifica
    const pinsFiltrados = provinciaId
      ? pins.filter((pin) => pin.id_provincia === provinciaId)
      : pins;

    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    pinsFiltrados.forEach((pin, i) => {
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

      const marker = L.marker([pin.lat, pin.lng], {
        icon,
        draggable: allowPinDrag,
        bubblingMouseEvents: !allowPinDrag,
      })
        .addTo(map)
        .bindPopup(pin.label || `Pin ${i + 1}`);
      if (allowPinDrag) {
        marker.on('dragend', () => {
          const position = marker.getLatLng();
          onPinDragEndRef.current?.(i, position.lat, position.lng);
        });
      }
      markersRef.current.push(marker);
    });

  }, [pins, zoom, provinciaId, draggablePins, readonly]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (radiusCircleRef.current) {
      map.removeLayer(radiusCircleRef.current);
      radiusCircleRef.current = null;
    }
    if (drawRadius === undefined || drawRadius <= 0) return;

    const circleCenter = radiusCenter ?? center ?? [map.getCenter().lat, map.getCenter().lng];
    radiusCircleRef.current = L.circle(circleCenter, {
      radius: drawRadius * 1000,
      color: '#a61e22',
      fillColor: '#d4a017',
      fillOpacity: 0.12,
      weight: 3,
      dashArray: '8, 6',
    })
      .bindTooltip(`Límite de entrega: ${drawRadius} km`)
      .addTo(map);
  }, [drawRadius, radiusCenter, center]);

  // `relative isolate z-0` crea un contexto de apilamiento propio:
  // los z-index internos de Leaflet (panes 400-700, controles 1000) quedan
  // confinados y NO se superponen a modales, menús ni barras fijas de la app.
  return <div ref={mapRef} className={`relative isolate z-0 w-full ${className}`} style={{ height }} />;
}