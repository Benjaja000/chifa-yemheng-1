-- 01_fn_registrar_movimiento_caja.sql
-- Wrapper fn_* del PROCEDURE usp_registrar_movimiento_caja.
--   Motivo: supabase.rpc no consume parámetros OUT; se expone como TABLE
--   (convención fn_* del proyecto, igual que fn_anular_venta_con_nc).
--   El USP calcula tipo/signo/afecta_efectivo desde los catálogos
--   CONCEPTO_CAJA × METODO_PAGO y actualiza APERTURA_CAJA (Monto_Sistema).
--   Usado por la rendición de delivery (concepto VENTA AL CONTADO).
-- Ejecutar en Supabase Dashboard → SQL Editor → Run. Idempotente.

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

COMMENT ON FUNCTION public.fn_registrar_movimiento_caja(integer, integer, integer, integer, numeric, character varying, integer, integer, character varying)
  IS 'Wrapper TABLE del USP usp_registrar_movimiento_caja (rendición delivery, VU-DEL-003).';

REVOKE ALL ON FUNCTION public.fn_registrar_movimiento_caja(integer, integer, integer, integer, numeric, character varying, integer, integer, character varying)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.fn_registrar_movimiento_caja(integer, integer, integer, integer, numeric, character varying, integer, integer, character varying)
  TO service_role;

-- ---------- Permisos de rendición (requeridos por /api/v1/rendiciones) ----------
INSERT INTO public.permiso (id_modulo, n_permiso, clave, descripcion)
SELECT m.id_modulo, v.n_permiso, v.clave, v.descripcion
FROM (VALUES
  ('CAJA', 'Ver rendiciones',       'REN_VER',       'Listar pendientes de rendición (rendicion-delivery.md)'),
  ('CAJA', 'Registrar rendiciones', 'REN_REGISTRAR', 'Registrar rendición de efectivo del repartidor'),
  ('CAJA', 'Validar rendiciones',   'REN_VALIDAR',   'Validar/observar rendición (supervisor)')
) AS v(modulo, n_permiso, clave, descripcion)
JOIN public.modulo m ON m.n_modulo = v.modulo
WHERE NOT EXISTS (SELECT 1 FROM public.permiso p WHERE p.clave = v.clave);

INSERT INTO public.rol_permiso (id_rol, id_permiso, concedido)
SELECT r.id_rol, p.id_permiso, 'S'
FROM public.rol r
CROSS JOIN public.permiso p
WHERE ((r.n_rol IN ('ADMINISTRADOR', 'SUPERVISOR') AND p.clave IN ('REN_VER', 'REN_REGISTRAR', 'REN_VALIDAR'))
    OR (r.n_rol = 'CAJERO' AND p.clave IN ('REN_VER', 'REN_REGISTRAR')))
  AND NOT EXISTS (
    SELECT 1 FROM public.rol_permiso x
    WHERE x.id_rol = r.id_rol AND x.id_permiso = p.id_permiso
  );

-- Verificación (requiere un turno de caja abierto y un concepto/método válidos):
--   SELECT * FROM public.fn_registrar_movimiento_caja(
--     (SELECT id_aperturacaja FROM public.apertura_caja WHERE situacion = 'A' ORDER BY feccre DESC LIMIT 1),
--     (SELECT id_concepto FROM public.concepto_caja WHERE n_concepto = 'VENTA AL CONTADO' AND estado = 'A'),
--     (SELECT id_metodopago FROM public.metodo_pago WHERE afecta_efectivo = 'S' AND estado = 'A' ORDER BY id_metodopago LIMIT 1),
--     1, 10.00, 'Prueba rendición', NULL, NULL, NULL);
