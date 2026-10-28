import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api-client';
import { useRealtimeDelivery } from './useRealtimeDelivery';

export type DeliverySituacion = 'P' | 'R' | 'E' | 'C';

export interface DeliveryUbicacion {
  id_pedidodelivery: number;
  id_pedido: number;
  id_distrito: number | null;
  distrito: string | null;
  direccion_entrega: string;
  costo_envio: number;
  costo_envio_confirmado: boolean;
  situacion: DeliverySituacion;
  f_salida: string | null;
  f_entrega: string | null;
  lat_cliente: number | null;
  lng_cliente: number | null;
  lat_repartidor: number | null;
  lng_repartidor: number | null;
  f_ubicacion: string | null;
  id_repartidor: number | null;
}

const POLL_INTERVAL = 30000;

/**
 * Ubicación/estado de un delivery para el cliente.
 * Actualización en vivo vía Realtime (pedido_delivery) + respaldo por polling.
 * Datos desde vw_delivery_ubicacion (BR-GPS-001/002), sin PII.
 */
export function useDeliveryUbicacion(deliveryId: number | null, interval = POLL_INTERVAL) {
  const [ubicacion, setUbicacion] = useState<DeliveryUbicacion | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!deliveryId) return;
    try {
      const data = await api.getDeliveryUbicacion(deliveryId);
      setUbicacion(data as DeliveryUbicacion);
    } catch (e) {
      console.error('Error consultando ubicación delivery:', e);
    } finally {
      setLoading(false);
    }
  }, [deliveryId]);

  useEffect(() => {
    if (!deliveryId) return;
    void refresh();
    const timer = setInterval(() => void refresh(), interval);
    return () => clearInterval(timer);
  }, [deliveryId, interval, refresh]);

  useRealtimeDelivery(deliveryId, () => void refresh());

  return { ubicacion, loading, refresh };
}
