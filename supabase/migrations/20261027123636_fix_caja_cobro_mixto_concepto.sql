CREATE OR REPLACE FUNCTION public.fn_cobrar_pedido_mixto_atomic(
  p_pedido integer,
  p_usuario integer,
  p_apertura integer,
  p_tipodoc character varying,
  p_cliente integer,
  p_pagos jsonb,
  p_aportes jsonb
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
  v_pago jsonb;
  v_cobro record;
  v_total numeric(12,2);
  v_total_centimos bigint;
  v_metodo integer;
  v_metodo_base integer;
  v_metodo_nombre character varying;
  v_afecta_efectivo character(1);
  v_requiere_referencia character(1);
  v_referencia character varying;
  v_referencia_base character varying;
  v_banco character varying;
  v_monto numeric(12,2);
  v_recibido numeric(12,2);
  v_suma_pagos bigint := 0;
  v_suma_efectivo numeric(12,2) := 0;
  v_vuelto numeric(12,2) := 0;
  v_concepto integer;
  v_aportes jsonb;
BEGIN
  IF jsonb_typeof(p_pagos) IS DISTINCT FROM 'array' THEN
    RAISE EXCEPTION USING MESSAGE = 'PAGOS_INVALIDOS';
  END IF;
  IF jsonb_array_length(p_pagos) = 0 OR jsonb_array_length(p_pagos) > 20 THEN
    RAISE EXCEPTION USING MESSAGE = 'PAGOS_INVALIDOS';
  END IF;

  SELECT * INTO v_pedido
  FROM public.pedido AS pd
  WHERE pd.id_pedido = p_pedido
  FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING MESSAGE = 'PEDIDO_NOT_FOUND';
  END IF;
  IF v_pedido.facturado = 'S' OR v_pedido.anulado = 'S' THEN
    RAISE EXCEPTION USING MESSAGE = 'PEDIDO_NO_COBRABLE';
  END IF;

  CALL public.usp_recalcular_pedido(p_pedido);
  SELECT pd.total, pd.modo_pago_mesa
  INTO v_total, v_pedido.modo_pago_mesa
  FROM public.pedido AS pd
  WHERE pd.id_pedido = p_pedido;
  IF v_total IS NULL OR v_total <= 0 THEN
    RAISE EXCEPTION USING MESSAGE = 'TOTAL_CERO';
  END IF;
  v_total_centimos := round(v_total * 100)::bigint;
  v_metodo_base := (p_pagos -> 0 ->> 'metodoPagoId')::integer;
  v_referencia_base := LEFT(COALESCE(p_pagos -> 0 ->> 'referencia', ''), 30);

  FOR v_pago IN SELECT value FROM jsonb_array_elements(p_pagos)
  LOOP
    IF NOT (v_pago ? 'metodoPagoId')
       OR NOT (v_pago ? 'monto')
       OR (v_pago ->> 'monto')::numeric <= 0 THEN
      RAISE EXCEPTION USING MESSAGE = 'PAGOS_INVALIDOS';
    END IF;
    v_metodo := (v_pago ->> 'metodoPagoId')::integer;
    v_monto := round((v_pago ->> 'monto')::numeric, 2);
    v_referencia := BTRIM(COALESCE(v_pago ->> 'referencia', ''));
    v_banco := BTRIM(COALESCE(v_pago ->> 'banco', ''));
    v_recibido := round(COALESCE(NULLIF(v_pago ->> 'montoRecibido', '')::numeric, v_monto), 2);
    SELECT mp.n_metodopago, mp.afecta_efectivo, mp.requiere_referencia
    INTO v_metodo_nombre, v_afecta_efectivo, v_requiere_referencia
    FROM public.metodo_pago AS mp
    WHERE mp.id_metodopago = v_metodo AND mp.estado = 'A';
    IF NOT FOUND THEN
      RAISE EXCEPTION USING MESSAGE = 'METODO_PAGO_INVALIDO';
    END IF;
    IF v_requiere_referencia = 'S' AND v_referencia = '' THEN
      RAISE EXCEPTION USING MESSAGE = 'REFERENCIA_REQUERIDA';
    END IF;
    IF upper(v_metodo_nombre) LIKE '%TRANSF%' AND v_banco = '' THEN
      RAISE EXCEPTION USING MESSAGE = 'BANCO_REQUERIDO';
    END IF;
    IF v_afecta_efectivo = 'S' THEN
      IF v_recibido < v_monto THEN
        RAISE EXCEPTION USING MESSAGE = 'EFECTIVO_INSUFICIENTE';
      END IF;
      v_suma_efectivo := v_suma_efectivo + v_monto;
      v_vuelto := v_vuelto + v_recibido - v_monto;
    ELSIF NULLIF(v_pago ->> 'montoRecibido', '') IS NOT NULL THEN
      RAISE EXCEPTION USING MESSAGE = 'MONTO_RECIBIDO_NO_APLICA';
    END IF;
    IF v_pedido.modo_pago_mesa = 'POR_CONSUMO'
       AND NULLIF(v_pago ->> 'clienteId', '') IS NULL THEN
      RAISE EXCEPTION USING MESSAGE = 'PAGADOR_REQUERIDO';
    END IF;
    IF v_pedido.modo_pago_mesa <> 'POR_CONSUMO'
       AND NULLIF(v_pago ->> 'clienteId', '') IS NOT NULL THEN
      RAISE EXCEPTION USING MESSAGE = 'PAGADORES_NO_PERMITIDOS';
    END IF;
    v_suma_pagos := v_suma_pagos + round(v_monto * 100)::bigint;
  END LOOP;

  IF v_suma_pagos <> v_total_centimos THEN
    RAISE EXCEPTION USING MESSAGE = 'PAGOS_NO_CUBREN_TOTAL';
  END IF;

  IF v_pedido.modo_pago_mesa = 'POR_CONSUMO' THEN
    SELECT jsonb_agg(
      jsonb_build_object(
        'clienteId', pago.cliente_id,
        'monto', pago.monto,
        'referencia', pago.referencia
      )
      ORDER BY pago.cliente_id
    )
    INTO v_aportes
    FROM (
      SELECT
        (a.value ->> 'clienteId')::integer AS cliente_id,
        round(sum((a.value ->> 'monto')::numeric), 2) AS monto,
        min(NULLIF(BTRIM(a.value ->> 'referencia'), '')) AS referencia
      FROM jsonb_array_elements(p_pagos) AS a(value)
      GROUP BY (a.value ->> 'clienteId')::integer
    ) AS pago;
    SELECT * INTO v_cobro
    FROM public.fn_cobrar_pedido_aportes_atomic(
      p_pedido, p_usuario, p_apertura, p_tipodoc, p_cliente,
      v_metodo_base, v_total, v_referencia_base, v_aportes
    );
  ELSE
    IF p_aportes IS NOT NULL THEN
      RAISE EXCEPTION USING MESSAGE = 'APORTES_NO_PERMITIDOS';
    END IF;
    SELECT * INTO v_cobro
    FROM public.fn_cobrar_pedido_atomic(
      p_pedido, p_usuario, p_apertura, p_tipodoc, p_cliente,
      v_metodo_base, v_total, v_referencia_base
    );
  END IF;

  SELECT mp.afecta_efectivo
  INTO v_afecta_efectivo
  FROM public.metodo_pago AS mp
  WHERE mp.id_metodopago = v_metodo_base;

  DELETE FROM public.pago_venta AS pv
  WHERE pv.id_venta = v_cobro.id_venta;
  DELETE FROM public.movimiento_caja AS mc
  WHERE mc.id_venta = v_cobro.id_venta;

  UPDATE public.apertura_caja AS ac
  SET monto_sistema = ac.monto_sistema + v_suma_efectivo
    - CASE WHEN v_afecta_efectivo = 'S' THEN v_total ELSE 0 END,
      usumod = CURRENT_USER,
      fecmod = CURRENT_TIMESTAMP
  WHERE ac.id_aperturacaja = p_apertura
    AND ac.situacion = 'A';
  IF NOT FOUND THEN
    RAISE EXCEPTION USING MESSAGE = 'NO_CAJA_ABIERTA';
  END IF;

  FOR v_pago IN SELECT value FROM jsonb_array_elements(p_pagos)
  LOOP
    v_metodo := (v_pago ->> 'metodoPagoId')::integer;
    v_monto := round((v_pago ->> 'monto')::numeric, 2);
    v_referencia := NULLIF(LEFT(BTRIM(COALESCE(v_pago ->> 'referencia', '')), 50), '');
    v_banco := NULLIF(LEFT(BTRIM(COALESCE(v_pago ->> 'banco', '')), 60), '');
    SELECT mp.n_metodopago, mp.afecta_efectivo
    INTO v_metodo_nombre, v_afecta_efectivo
    FROM public.metodo_pago AS mp
    WHERE mp.id_metodopago = v_metodo;

    INSERT INTO public.pago_venta (
      id_venta, id_metodopago, monto, referencia, banco, id_cliente_pagador
    )
    VALUES (
      v_cobro.id_venta,
      v_metodo,
      v_monto,
      v_referencia,
      v_banco,
      NULLIF(v_pago ->> 'clienteId', '')::integer
    );

    SELECT cc.id_concepto INTO v_concepto
    FROM public.concepto_caja AS cc
    WHERE cc.estado = 'A'
      AND cc.id_tipomovimiento = 1
      AND (
        (v_afecta_efectivo = 'S' AND upper(cc.n_concepto) = 'VENTA AL CONTADO')
        OR (v_afecta_efectivo = 'N' AND upper(v_metodo_nombre) LIKE ANY (ARRAY['%VISA%', '%MASTER%', '%TARJ%'])
            AND upper(cc.n_concepto) = 'COBRO CON TARJETA')
        OR (v_afecta_efectivo = 'N' AND NOT (upper(v_metodo_nombre) LIKE ANY (ARRAY['%VISA%', '%MASTER%', '%TARJ%']))
            AND upper(cc.n_concepto) = 'COBRO BILLETERA DIGITAL')
      )
    ORDER BY cc.id_concepto
    LIMIT 1;
    IF v_concepto IS NULL THEN
      RAISE EXCEPTION USING MESSAGE = 'CONCEPTO_COBRO_NO_CONFIGURADO';
    END IF;

    INSERT INTO public.movimiento_caja (
      id_aperturacaja, id_tipomovimiento, id_concepto, id_metodopago,
      id_usuario, id_pedido, id_venta, numero_operacion, banco,
      descripcion, monto, afecta_efectivo, documento, estado
    )
    VALUES (
      p_apertura, 1, v_concepto, v_metodo,
      p_usuario, p_pedido, v_cobro.id_venta,
      LEFT(v_referencia, 30), v_banco, 'Cobro comprobante',
      v_monto, v_afecta_efectivo, 'N', 'A'
    );
  END LOOP;

  UPDATE public.venta AS v
  SET total_pagado = v_total,
      vuelto = v_vuelto,
      usumod = CURRENT_USER,
      fecmod = CURRENT_TIMESTAMP
  WHERE v.id_venta = v_cobro.id_venta;

  RETURN QUERY SELECT v_cobro.id_venta, v_cobro.serie, v_cobro.numero, v_cobro.total, v_vuelto;
END;
$$;

NOTIFY pgrst, 'reload schema';