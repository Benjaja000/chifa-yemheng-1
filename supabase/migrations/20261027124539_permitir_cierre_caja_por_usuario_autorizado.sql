CREATE OR REPLACE FUNCTION public.fn_solicitar_cierre_caja(
  p_apertura integer,
  p_usuario integer,
  p_declarado numeric,
  p_observacion character varying
)
RETURNS TABLE (sistema numeric, declarado numeric, diferencia numeric)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_caja integer;
  v_sistema numeric(12,2);
BEGIN
  SELECT id_caja, monto_sistema
  INTO v_caja, v_sistema
  FROM public.apertura_caja
  WHERE id_aperturacaja = p_apertura AND situacion = 'A'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'TURNO_NO_ABIERTO';
  END IF;
  IF p_declarado IS NULL OR p_declarado < 0 THEN
    RAISE EXCEPTION 'MONTO_INVALIDO';
  END IF;
  IF EXISTS (
    SELECT 1
    FROM public.pedido p
    JOIN public.mesa m ON m.id_mesa = p.id_mesa
    JOIN public.estado_mesa em ON em.id_estadomesa = m.id_estadomesa
    WHERE p.facturado = 'N'
      AND p.anulado = 'N'
      AND p.estado = 'A'
      AND em.descripcion = 'POR COBRAR'
  ) THEN
    RAISE EXCEPTION 'PEDIDOS_POR_COBRAR';
  END IF;

  UPDATE public.apertura_caja
  SET situacion = 'P',
      monto_declarado = p_declarado,
      diferencia = p_declarado - v_sistema,
      observacion = NULLIF(LEFT(BTRIM(p_observacion), 200), ''),
      id_usuario_solicita_cierre = p_usuario,
      f_solicitud_cierre = CURRENT_TIMESTAMP,
      usumod = p_usuario::text,
      fecmod = CURRENT_TIMESTAMP
  WHERE id_aperturacaja = p_apertura;

  INSERT INTO public.auditoria (id_usuario, n_tabla, accion, id_registro, valor_nuevo)
  VALUES (
    p_usuario,
    'APERTURA_CAJA',
    'SOLICITUD_CIERRE',
    p_apertura,
    'Sistema: ' || v_sistema::text ||
      ' Declarado: ' || p_declarado::text ||
      ' Diferencia: ' || (p_declarado - v_sistema)::text
  );

  RETURN QUERY SELECT v_sistema, p_declarado, p_declarado - v_sistema;
END;
$$;

NOTIFY pgrst, 'reload schema';