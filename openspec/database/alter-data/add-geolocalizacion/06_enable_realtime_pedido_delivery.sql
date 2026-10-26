-- add-geolocalizacion · 06 — Realtime para seguimiento delivery
-- Habilita Realtime (postgres_changes) sobre pedido_delivery para el tracking
-- en vivo del cliente (BR-GPS-002 / BR-DER-033: seguimiento real, no simulado).
-- Sin esto, el mapa del cliente solo puede actualizarse por polling.
-- Idempotente.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'pedido_delivery'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.pedido_delivery';
  END IF;
END $$;

-- REPLICA IDENTITY FULL para que el payload de UPDATE incluya todas las columnas
-- (lat_repartidor/lng_repartidor/situacion/f_ubicacion) necesarias en el cliente.
ALTER TABLE public.pedido_delivery REPLICA IDENTITY FULL;
