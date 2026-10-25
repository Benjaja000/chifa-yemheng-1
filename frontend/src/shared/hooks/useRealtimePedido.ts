import { useEffect, useRef } from 'react';
import { supabase } from '../services/supabase';

export function useRealtimePedido(pedidoId: number | null, onRefresh: () => void) {
  const cbRef = useRef(onRefresh);
  cbRef.current = onRefresh;

  useEffect(() => {
    if (!pedidoId) return;
    let debounceTimer: number | null = null;
    const trigger = () => {
      if (debounceTimer) window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(() => cbRef.current(), 200);
    };
    const channel = supabase
      .channel(`pedido:${pedidoId}:detalles`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'detalle_pedido',
        filter: `id_pedido=eq.${pedidoId}`,
      }, trigger)
      .subscribe();
    return () => {
      if (debounceTimer) window.clearTimeout(debounceTimer);
      void supabase.removeChannel(channel);
    };
  }, [pedidoId]);
}