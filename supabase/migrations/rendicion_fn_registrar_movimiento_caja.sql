-- Wrapper fn_* del PROCEDURE usp_registrar_movimiento_caja (rendición delivery).
-- Ver: openspec/database/alter-data/add-rendicion-wrapper/01_fn_registrar_movimiento_caja.sql
CREATE OR REPLACE FUNCTION public.fn_registrar_movimiento_caja(
  p_id_apertura integer,
  p_id_concepto integer,
  p_id_metodo   integer,
  p_id_usuario  integer,
  p_monto       numeric,
  p_descripcion character varying,
  p_id_pedido   integer,
  p_id_venta    integer,
  p_numero_op   character varying
)
RETURNS TABLE (id_movimientocaja integer, mensaje character varying)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id  integer;
  v_msg character varying;
BEGIN
  CALL public.usp_registrar_movimiento_caja(
    p_id_apertura, p_id_concepto, p_id_metodo, p_id_usuario, p_monto,
    p_descripcion, p_id_pedido, p_id_venta, p_numero_op, 'N',
    v_id, v_msg);
  RETURN QUERY SELECT v_id, v_msg;
END;
$$;

REVOKE ALL ON FUNCTION public.fn_registrar_movimiento_caja(integer, integer, integer, integer, numeric, character varying, integer, integer, character varying)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.fn_registrar_movimiento_caja(integer, integer, integer, integer, numeric, character varying, integer, integer, character varying)
  TO service_role;
