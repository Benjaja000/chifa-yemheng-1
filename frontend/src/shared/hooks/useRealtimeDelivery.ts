import { useEffect, useRef } from 'react';
import { supabase } from '../services/supabase';

/**
 * Suscripción Realtime a los cambios de un delivery (pedido_delivery).
 * Requiere que la tabla esté en la publicación supabase_realtime
 * (openspec/database/alter-data/add-geolocalizacion/06_enable_realtime_pedido_delivery.sql).
 */
export function useRealtimeDelivery(deliveryId: number | null, onRefresh: () => void) {
  const cbRef = useRef(onRefresh);
  cbRef.current = onRefresh;

  useEffect(() => {
    if (!deliveryId) return;
    let debounceTimer: number | null = null;
    const trigger = () => {
      if (debounceTimer) window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(() => cbRef.current(), 200);
    };
    const channel = supabase
      .channel(`delivery:${deliveryId}:ubicacion`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'pedido_delivery',
        filter: `id_pedidodelivery=eq.${deliveryId}`,
      }, trigger)
      .subscribe();
    return () => {
      if (debounceTimer) window.clearTimeout(debounceTimer);
      void supabase.removeChannel(channel);
    };
  }, [deliveryId]);
}
