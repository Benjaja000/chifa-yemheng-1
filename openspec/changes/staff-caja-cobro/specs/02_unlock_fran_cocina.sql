-- 002_unlock_fran_cocina.sql
-- Desbloquear usuario fran.cocina (bloqueado por intentos fallidos).
-- Ejecutar en Supabase Dashboard → SQL Editor → Run.

UPDATE public.usuario
SET bloqueado = 'N',
    intentos = 0
WHERE logeo = 'fran.cocina';