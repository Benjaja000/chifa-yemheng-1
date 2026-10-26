-- add-geolocalizacion · 05 — Recargo por km parametrizado
-- Refuerza BR-GPS-002: la distancia solo SUGIERE, el humano confirma (BR-DER-033).
-- Elimina el literal 1.5 de delivery-repository.ts (anti-hardcode).
-- Idempotente.

ALTER TABLE public.distrito
  ADD COLUMN IF NOT EXISTS recargo_km numeric(10,2) DEFAULT 1.50 NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ck_distrito_recargo_km') THEN
    ALTER TABLE public.distrito
      ADD CONSTRAINT ck_distrito_recargo_km CHECK (recargo_km IS NULL OR recargo_km >= 0);
  END IF;
END $$;

COMMENT ON COLUMN public.distrito.recargo_km IS
  'Recargo por km fuera de radio_km para sugerir costo_envio (BR-GPS-002). 0 = sin recargo. Dato de negocio, no constante de código.';
