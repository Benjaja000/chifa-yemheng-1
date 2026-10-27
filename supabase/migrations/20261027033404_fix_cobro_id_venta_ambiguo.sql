CREATE OR REPLACE FUNCTION public.fn_cobrar_pedido_atomic(
  p_pedido integer,
  p_usuario integer,
  p_apertura integer,
  p_tipodoc character varying,
  p_cliente integer,
  p_metodo integer,
  p_recibido numeric,
  p_ref character varying
)
RETURNS TABLE (
  id_venta integer,
  serie character varying,
  numero character varying,
  total numeric,
  vuelto numeric
)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_pedido public.pedido%ROWTYPE;
  v_estado_mesa character varying;
  v_total numeric(12,2);
  v_efectivo character(1);
  v_referencia character(1);
  v_ruc character varying;
  v_apertura integer;
  v_id_venta integer;
  v_serie character varying;
  v_numero character varying;
  v_total_venta numeric;
  v_vuelto numeric;
BEGIN
  SELECT * INTO v_pedido
  FROM public.pedido
  WHERE id_pedido = p_pedido
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'PEDIDO_NOT_FOUND';
  END IF;
  IF v_pedido.facturado = 'S' THEN
    RAISE EXCEPTION 'PEDIDO_FACTURADO';
  END IF;
  IF v_pedido.anulado = 'S' THEN
    RAISE EXCEPTION 'PEDIDO_ANULADO';
  END IF;

  IF v_pedido.id_mesa IS NOT NULL THEN
    SELECT em.descripcion INTO v_estado_mesa
    FROM public.mesa m
    JOIN public.estado_mesa em ON em.id_estadomesa = m.id_estadomesa
    WHERE m.id_mesa = v_pedido.id_mesa
    FOR UPDATE OF m;

    IF v_estado_mesa IS DISTINCT FROM 'POR COBRAR' THEN
      RAISE EXCEPTION 'PEDIDO_NO_POR_COBRAR';
    END IF;
  END IF;

  SELECT ac.id_aperturacaja INTO v_apertura
  FROM public.apertura_caja AS ac
  WHERE ac.id_aperturacaja = p_apertura
    AND ac.situacion = 'A'
  FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'NO_CAJA_ABIERTA';
  END IF;
  IF p_tipodoc IS NULL OR p_tipodoc NOT IN ('01', '03') THEN
    RAISE EXCEPTION 'TIPO_DOCUMENTO_INVALIDO';
  END IF;

  SELECT mp.afecta_efectivo, mp.requiere_referencia
  INTO v_efectivo, v_referencia
  FROM public.metodo_pago AS mp
  WHERE mp.id_metodopago = p_metodo
    AND mp.estado = 'A';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'METODO_PAGO_INVALIDO';
  END IF;

  CALL public.usp_recalcular_pedido(p_pedido);
  SELECT p.total INTO v_total
  FROM public.pedido AS p
  WHERE p.id_pedido = p_pedido;
  IF v_total IS NULL OR v_total <= 0 THEN
    RAISE EXCEPTION 'TOTAL_CERO';
  END IF;

  IF v_efectivo = 'S' AND COALESCE(p_recibido, v_total) < v_total THEN
    RAISE EXCEPTION 'EFECTIVO_INSUFICIENTE';
  END IF;
  IF v_referencia = 'S' AND COALESCE(BTRIM(p_ref), '') = '' THEN
    RAISE EXCEPTION 'REFERENCIA_REQUERIDA';
  END IF;
  IF p_tipodoc = '01' THEN
    SELECT e.ruc INTO v_ruc
    FROM public.cliente AS c
    JOIN public.empresa AS e ON e.id_empresa = c.id_empresa
    WHERE c.id_cliente = p_cliente;
    IF v_ruc IS NULL OR v_ruc !~ '^[0-9]{11}$' THEN
      RAISE EXCEPTION 'RUC_INVALIDO';
    END IF;
  END IF;

  CALL public.usp_facturar_pedido(
    p_pedido,
    p_usuario,
    p_apertura,
    p_tipodoc,
    p_cliente,
    p_metodo,
    CASE WHEN v_efectivo = 'S' THEN COALESCE(p_recibido, v_total) ELSE v_total END,
    LEFT(COALESCE(p_ref, ''), 30),
    v_id_venta,
    v_serie,
    v_numero,
    v_total_venta,
    v_vuelto
  );

  IF p_tipodoc = '03' AND NOT EXISTS (
    SELECT 1
    FROM public.boleta AS b
    WHERE b.id_venta = v_id_venta
  ) THEN
    INSERT INTO public.boleta (id_venta, serie, numero, cliente_documento, cliente_nombre)
    VALUES (v_id_venta, BTRIM(v_serie), BTRIM(v_numero), '00000000', 'CLIENTES VARIOS');
  END IF;

  RETURN QUERY SELECT v_id_venta, v_serie, v_numero, v_total_venta, v_vuelto;
END;
$$;

NOTIFY pgrst, 'reload schema';