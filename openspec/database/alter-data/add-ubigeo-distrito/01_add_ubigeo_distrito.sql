-- add-ubigeo-distrito · 01 — columna ubigeo en distrito (match exacto por código)
-- PRE-REQUISITO: respaldo de la BD antes de ejecutar.
-- Idempotente: IF NOT EXISTS + DROP CONSTRAINT IF EXISTS.

ALTER TABLE public.distrito ADD COLUMN IF NOT EXISTS ubigeo char(6);

ALTER TABLE public.distrito DROP CONSTRAINT IF EXISTS ck_distrito_ubigeo_fmt;
ALTER TABLE public.distrito ADD CONSTRAINT ck_distrito_ubigeo_fmt
  CHECK (ubigeo IS NULL OR ubigeo ~ '^\d{6}$');

ALTER TABLE public.distrito DROP CONSTRAINT IF EXISTS uq_distrito_ubigeo;
ALTER TABLE public.distrito ADD CONSTRAINT uq_distrito_ubigeo UNIQUE (ubigeo);

COMMENT ON COLUMN public.distrito.ubigeo IS
  'Ubigeo SUNAT de 6 dígitos (DDPPDD). Autoselección de distrito en altas con Factiliza. Anulable hasta conciliar el 100%.';
