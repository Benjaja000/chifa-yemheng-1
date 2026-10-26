-- 01_fn_anular_venta_con_nc.sql
-- Wrapper fn_* del PROCEDURE usp_anular_venta_con_nc
--   (BR-RES-054/055/056, BR-ACC-055).
-- Motivo: supabase.rpc no consume OUT params; se expone como TABLE
--   (convención fn_* del proyecto).
-- Ejecutar en Supabase Dashboard → SQL Editor → Run. Idempotente.

CREATE OR REPLACE FUNCTION public.fn_anular_venta_con_nc(
  p_id_venta integer,
  p_usuario  integer,
  p_motivo   character varying
)
RETURNS TABLE (id_nc integer, serie character varying, numero character varying,
               monto numeric, mensaje character varying)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id  integer;
  v_s   character varying;
  v_n   character varying;
  v_m   numeric;
  v_msg character varying;
BEGIN
  CALL public.usp_anular_venta_con_nc(
    p_id_venta, p_usuario, p_motivo, v_id, v_s, v_n, v_m, v_msg);
  RETURN QUERY SELECT v_id, v_s, v_n, v_m, v_msg;
END;
$$;

-- Verificación:
--   SELECT * FROM public.fn_anular_venta_con_nc(1, 1, 'Prueba de anulación');
