ALTER TABLE public.pedido
  ADD COLUMN IF NOT EXISTS modo_pago_mesa character varying(20) NOT NULL DEFAULT 'CUENTA_UNICA';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'ck_pedido_modo_pago_mesa'
      AND conrelid = 'public.pedido'::regclass
  ) THEN
    ALTER TABLE public.pedido
      ADD CONSTRAINT ck_pedido_modo_pago_mesa
      CHECK (modo_pago_mesa IN ('CUENTA_UNICA', 'POR_CONSUMO'));
  END IF;
END;
$$;

ALTER TABLE public.detalle_pedido
  ADD COLUMN IF NOT EXISTS id_cliente integer;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'fk_detalle_pedido_cliente'
      AND conrelid = 'public.detalle_pedido'::regclass
  ) THEN
    ALTER TABLE public.detalle_pedido
      ADD CONSTRAINT fk_detalle_pedido_cliente
      FOREIGN KEY (id_cliente) REFERENCES public.cliente(id_cliente);
  END IF;
END;
$$;

CREATE INDEX IF NOT EXISTS ix_detalle_pedido_cliente
  ON public.detalle_pedido (id_pedido, id_cliente);

CREATE TABLE IF NOT EXISTS public.pedido_participante (
  id_pedido integer NOT NULL REFERENCES public.pedido(id_pedido) ON DELETE CASCADE,
  id_cliente integer NOT NULL REFERENCES public.cliente(id_cliente),
  es_organizador boolean NOT NULL DEFAULT false,
  feccre timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_pedido, id_cliente)
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_pedido_participante_organizador
  ON public.pedido_participante (id_pedido)
  WHERE es_organizador;

CREATE INDEX IF NOT EXISTS ix_pedido_participante_cliente
  ON public.pedido_participante (id_cliente, id_pedido);

ALTER TABLE public.pedido_participante ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.pedido_participante FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.pedido_participante TO service_role;

INSERT INTO public.pedido_participante (id_pedido, id_cliente, es_organizador)
SELECT p.id_pedido, p.id_cliente, true
FROM public.pedido AS p
WHERE p.id_mesa IS NOT NULL
  AND p.id_cliente IS NOT NULL
  AND p.anulado = 'N'
ON CONFLICT (id_pedido, id_cliente) DO NOTHING;

ALTER TABLE public.pago_venta
  ADD COLUMN IF NOT EXISTS id_cliente_pagador integer;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'fk_pago_venta_cliente_pagador'
      AND conrelid = 'public.pago_venta'::regclass
  ) THEN
    ALTER TABLE public.pago_venta
      ADD CONSTRAINT fk_pago_venta_cliente_pagador
      FOREIGN KEY (id_cliente_pagador) REFERENCES public.cliente(id_cliente);
  END IF;
END;
$$;

CREATE INDEX IF NOT EXISTS ix_pago_venta_cliente_pagador
  ON public.pago_venta (id_cliente_pagador, id_venta);

CREATE INDEX IF NOT EXISTS ix_rol_permiso_activo
  ON public.rol_permiso (id_rol, id_permiso)
  WHERE estado = 'A';

CREATE INDEX IF NOT EXISTS ix_receta_producto_insumo_activa
  ON public.receta (id_producto, id_insumo)
  WHERE estado = 'A';

ALTER TABLE public.producto
  ALTER COLUMN stock_actual TYPE numeric(12,3) USING stock_actual::numeric(12,3),
  ALTER COLUMN stock_minimo TYPE numeric(12,3) USING stock_minimo::numeric(12,3);

CREATE OR REPLACE FUNCTION public.fn_abrir_pedido_validado(
  p_tipo integer,
  p_usuario integer,
  p_mesa integer,
  p_cliente integer,
  p_empleado integer,
  p_comensales integer,
  p_obs character varying
)
RETURNS TABLE (o_id integer, o_num character varying)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_id_mesa integer;
  v_id integer;
  v_num character varying;
BEGIN
  IF p_mesa IS NOT NULL THEN
    SELECT m.id_mesa INTO v_id_mesa
    FROM public.mesa AS m
    WHERE m.id_mesa = p_mesa
    FOR UPDATE;
    IF NOT FOUND THEN
      RAISE EXCEPTION USING MESSAGE = 'MESA_OCUPADA';
    END IF;
  END IF;

  CALL public.usp_abrir_pedido(
    p_tipo, p_usuario, p_mesa, p_cliente, p_empleado,
    p_comensales, p_obs, v_id, v_num
  );
  RETURN QUERY SELECT v_id, v_num;
END;
$$;

CREATE OR REPLACE FUNCTION public.fn_recalcular_pedido(p_id integer)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
BEGIN
  PERFORM 1 FROM public.pedido WHERE id_pedido = p_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING MESSAGE = 'NO_COMANDA_ACTIVA';
  END IF;
  CALL public.usp_recalcular_pedido(p_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.fn_agregar_detalle_pedido(
  p_pedido integer,
  p_prod integer,
  p_cant numeric,
  p_nota character varying,
  p_desc numeric
)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_pedido public.pedido%ROWTYPE;
  v_estado_mesa character varying;
BEGIN
  SELECT * INTO v_pedido
  FROM public.pedido
  WHERE id_pedido = p_pedido
  FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING MESSAGE = 'NO_COMANDA_ACTIVA';
  END IF;
  IF v_pedido.facturado = 'S' THEN
    RAISE EXCEPTION USING MESSAGE = 'PEDIDO_FACTURADO';
  END IF;
  IF v_pedido.anulado = 'S' THEN
    RAISE EXCEPTION USING MESSAGE = 'PEDIDO_ANULADO';
  END IF;
  IF v_pedido.id_mesa IS NOT NULL THEN
    SELECT em.descripcion INTO v_estado_mesa
    FROM public.mesa AS m
    JOIN public.estado_mesa AS em ON em.id_estadomesa = m.id_estadomesa
    WHERE m.id_mesa = v_pedido.id_mesa
    FOR UPDATE OF m;
    IF v_estado_mesa = 'POR COBRAR' THEN
      RAISE EXCEPTION USING MESSAGE = 'MESA_POR_COBRAR';
    END IF;
  END IF;
  CALL public.usp_agregar_detalle_pedido(p_pedido, p_prod, p_cant, p_nota, p_desc);
END;
$$;

CREATE OR REPLACE FUNCTION public.fn_registrar_participante_comanda(
  p_pedido integer,
  p_cliente integer
)
RETURNS TABLE (
  organizador_cliente_id integer,
  es_organizador boolean,
  modo_pago_mesa character varying
)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_pedido public.pedido%ROWTYPE;
  v_estado_mesa character varying;
  v_es_organizador boolean;
  v_organizador integer;
BEGIN
  SELECT * INTO v_pedido
  FROM public.pedido
  WHERE id_pedido = p_pedido
  FOR UPDATE;
  IF NOT FOUND OR v_pedido.facturado = 'S' OR v_pedido.anulado = 'S' THEN
    RAISE EXCEPTION USING MESSAGE = 'NO_COMANDA_ACTIVA';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.cliente
    WHERE id_cliente = p_cliente AND estado = 'A'
  ) THEN
    RAISE EXCEPTION USING MESSAGE = 'NO_PARTICIPANTE';
  END IF;

  IF v_pedido.id_mesa IS NOT NULL THEN
    SELECT em.descripcion INTO v_estado_mesa
    FROM public.mesa AS m
    JOIN public.estado_mesa AS em ON em.id_estadomesa = m.id_estadomesa
    WHERE m.id_mesa = v_pedido.id_mesa
    FOR UPDATE OF m;
  END IF;

  SELECT pp.es_organizador INTO v_es_organizador
  FROM public.pedido_participante AS pp
  WHERE pp.id_pedido = p_pedido AND pp.id_cliente = p_cliente;
  IF NOT FOUND THEN
    IF v_estado_mesa = 'POR COBRAR' THEN
      RAISE EXCEPTION USING MESSAGE = 'MESA_POR_COBRAR';
    END IF;
    v_es_organizador := NOT EXISTS (
      SELECT 1
      FROM public.pedido_participante AS pp
      WHERE pp.id_pedido = p_pedido
    );
    INSERT INTO public.pedido_participante (id_pedido, id_cliente, es_organizador)
    VALUES (p_pedido, p_cliente, v_es_organizador)
    ON CONFLICT (id_pedido, id_cliente) DO NOTHING;
    SELECT pp.es_organizador INTO v_es_organizador
    FROM public.pedido_participante AS pp
    WHERE pp.id_pedido = p_pedido AND pp.id_cliente = p_cliente;
  END IF;

  SELECT pp.id_cliente INTO v_organizador
  FROM public.pedido_participante AS pp
  WHERE pp.id_pedido = p_pedido AND pp.es_organizador;
  IF v_organizador IS NULL THEN
    RAISE EXCEPTION USING MESSAGE = 'NO_COMANDA_ACTIVA';
  END IF;

  RETURN QUERY SELECT v_organizador, COALESCE(v_es_organizador, false), v_pedido.modo_pago_mesa;
END;
$$;

CREATE OR REPLACE FUNCTION public.fn_abrir_o_unirse_comanda_qr(
  p_tipo integer,
  p_usuario integer,
  p_mesa integer,
  p_cliente integer,
  p_comensales integer,
  p_obs character varying
)
RETURNS TABLE (id_pedido integer, numero_pedido character varying, es_nuevo boolean)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_id_mesa integer;
  v_id integer;
  v_num character varying;
  v_estado_mesa character varying;
  v_es_participante boolean;
BEGIN
  SELECT pd.id_pedido, pd.numero_pedido
  INTO v_id, v_num
  FROM public.pedido AS pd
  WHERE pd.id_mesa = p_mesa
    AND pd.facturado = 'N'
    AND pd.anulado = 'N'
    AND pd.estado = 'A'
  ORDER BY pd.f_pedido DESC, pd.id_pedido DESC
  LIMIT 1
  FOR UPDATE;

  IF FOUND THEN
    SELECT true INTO v_es_participante
    FROM public.pedido_participante AS pp
    WHERE pp.id_pedido = v_id AND pp.id_cliente = p_cliente;
    IF NOT FOUND THEN
      SELECT em.descripcion INTO v_estado_mesa
      FROM public.mesa AS m
      JOIN public.estado_mesa AS em ON em.id_estadomesa = m.id_estadomesa
      WHERE m.id_mesa = p_mesa;
      IF v_estado_mesa = 'POR COBRAR' THEN
        RAISE EXCEPTION USING MESSAGE = 'MESA_POR_COBRAR';
      END IF;
    END IF;
    PERFORM public.fn_registrar_participante_comanda(v_id, p_cliente);
    RETURN QUERY SELECT v_id, v_num, false;
    RETURN;
  END IF;

  SELECT m.id_mesa INTO v_id_mesa
  FROM public.mesa AS m
  WHERE m.id_mesa = p_mesa
  FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING MESSAGE = 'MESA_OCUPADA';
  END IF;
  IF EXISTS (
    SELECT 1
    FROM public.pedido AS pd
    WHERE pd.id_mesa = p_mesa
      AND pd.facturado = 'N'
      AND pd.anulado = 'N'
      AND pd.estado = 'A'
  ) THEN
    RAISE EXCEPTION USING MESSAGE = 'MESA_OCUPADA';
  END IF;

  CALL public.usp_abrir_pedido(
    p_tipo, p_usuario, p_mesa, p_cliente, NULL, p_comensales, p_obs, v_id, v_num
  );
  PERFORM public.fn_registrar_participante_comanda(v_id, p_cliente);
  RETURN QUERY SELECT v_id, v_num, true;
END;
$$;

CREATE OR REPLACE FUNCTION public.fn_agregar_detalle_pedido_cliente(
  p_pedido integer,
  p_prod integer,
  p_cant numeric,
  p_nota character varying,
  p_desc numeric,
  p_cliente integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_pedido public.pedido%ROWTYPE;
  v_estado_mesa character varying;
  v_detalle integer;
BEGIN
  SELECT * INTO v_pedido
  FROM public.pedido
  WHERE id_pedido = p_pedido
  FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING MESSAGE = 'NO_COMANDA_ACTIVA';
  END IF;
  IF v_pedido.facturado = 'S' THEN
    RAISE EXCEPTION USING MESSAGE = 'PEDIDO_FACTURADO';
  END IF;
  IF v_pedido.anulado = 'S' THEN
    RAISE EXCEPTION USING MESSAGE = 'PEDIDO_ANULADO';
  END IF;
  IF v_pedido.id_mesa IS NOT NULL THEN
    SELECT em.descripcion INTO v_estado_mesa
    FROM public.mesa AS m
    JOIN public.estado_mesa AS em ON em.id_estadomesa = m.id_estadomesa
    WHERE m.id_mesa = v_pedido.id_mesa
    FOR UPDATE OF m;
    IF v_estado_mesa = 'POR COBRAR' THEN
      RAISE EXCEPTION USING MESSAGE = 'MESA_POR_COBRAR';
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM public.pedido_participante
      WHERE id_pedido = p_pedido AND id_cliente = p_cliente
    ) THEN
      RAISE EXCEPTION USING MESSAGE = 'NO_PARTICIPANTE';
    END IF;
  END IF;

  CALL public.usp_agregar_detalle_pedido(p_pedido, p_prod, p_cant, p_nota, p_desc);
  v_detalle := currval('public.detalle_pedido_id_detallepedido_seq'::regclass);
  UPDATE public.detalle_pedido
  SET id_cliente = p_cliente
  WHERE id_detallepedido = v_detalle
    AND id_pedido = p_pedido;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING MESSAGE = 'DETALLE_NO_REGISTRADO';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.fn_configurar_modo_pago_comanda(
  p_pedido integer,
  p_cliente integer,
  p_modo character varying
)
RETURNS character varying
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_pedido public.pedido%ROWTYPE;
  v_estado_mesa character varying;
BEGIN
  IF p_modo NOT IN ('CUENTA_UNICA', 'POR_CONSUMO') THEN
    RAISE EXCEPTION USING MESSAGE = 'VALIDATION_ERROR';
  END IF;
  SELECT * INTO v_pedido
  FROM public.pedido
  WHERE id_pedido = p_pedido
  FOR UPDATE;
  IF NOT FOUND OR v_pedido.facturado = 'S' OR v_pedido.anulado = 'S' THEN
    RAISE EXCEPTION USING MESSAGE = 'NO_COMANDA_ACTIVA';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.pedido_participante
    WHERE id_pedido = p_pedido
      AND id_cliente = p_cliente
      AND es_organizador
  ) THEN
    RAISE EXCEPTION USING MESSAGE = 'NO_ES_ORGANIZADOR';
  END IF;
  IF v_pedido.id_mesa IS NOT NULL THEN
    SELECT em.descripcion INTO v_estado_mesa
    FROM public.mesa AS m
    JOIN public.estado_mesa AS em ON em.id_estadomesa = m.id_estadomesa
    WHERE m.id_mesa = v_pedido.id_mesa
    FOR UPDATE OF m;
    IF v_estado_mesa = 'POR COBRAR' THEN
      RAISE EXCEPTION USING MESSAGE = 'MESA_POR_COBRAR';
    END IF;
  END IF;
  UPDATE public.pedido
  SET modo_pago_mesa = p_modo,
      usumod = current_user,
      pcmod = NULL,
      fecmod = CURRENT_TIMESTAMP
  WHERE id_pedido = p_pedido;
  RETURN p_modo;
END;
$$;

CREATE OR REPLACE FUNCTION public.fn_pedir_cuenta_comanda(
  p_pedido integer,
  p_cliente integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_pedido public.pedido%ROWTYPE;
  v_estado_mesa character varying;
  v_estado_por_cobrar integer;
BEGIN
  SELECT * INTO v_pedido
  FROM public.pedido
  WHERE id_pedido = p_pedido
  FOR UPDATE;
  IF NOT FOUND OR v_pedido.facturado = 'S' OR v_pedido.anulado = 'S' THEN
    RAISE EXCEPTION USING MESSAGE = 'NO_COMANDA_ACTIVA';
  END IF;
  IF v_pedido.id_mesa IS NULL OR NOT (
    v_pedido.id_cliente = p_cliente
    OR EXISTS (
      SELECT 1 FROM public.pedido_participante
      WHERE id_pedido = p_pedido AND id_cliente = p_cliente
    )
  ) THEN
    RAISE EXCEPTION USING MESSAGE = 'NO_PARTICIPANTE';
  END IF;

  SELECT em.descripcion INTO v_estado_mesa
  FROM public.mesa AS m
  JOIN public.estado_mesa AS em ON em.id_estadomesa = m.id_estadomesa
  WHERE m.id_mesa = v_pedido.id_mesa
  FOR UPDATE OF m;
  IF v_estado_mesa = 'POR COBRAR' THEN
    RAISE EXCEPTION USING MESSAGE = 'YA_POR_COBRAR';
  END IF;

  SELECT em.id_estadomesa INTO v_estado_por_cobrar
  FROM public.estado_mesa AS em
  WHERE em.descripcion = 'POR COBRAR' AND em.estado = 'A'
  ORDER BY em.id_estadomesa
  LIMIT 1;
  IF v_estado_por_cobrar IS NULL THEN
    RAISE EXCEPTION USING MESSAGE = 'ESTADO_POR_COBRAR_NO_CONFIGURADO';
  END IF;

  UPDATE public.mesa
  SET id_estadomesa = v_estado_por_cobrar,
      usumod = current_user,
      pcmod = NULL,
      fecmod = CURRENT_TIMESTAMP
  WHERE id_mesa = v_pedido.id_mesa;
END;
$$;

CREATE OR REPLACE FUNCTION public.fn_cobrar_pedido_aportes_atomic(
  p_pedido integer,
  p_usuario integer,
  p_apertura integer,
  p_tipodoc character varying,
  p_cliente integer,
  p_metodo integer,
  p_recibido numeric,
  p_ref character varying,
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
  v_total numeric(12,2);
  v_total_centimos bigint;
  v_modo character varying;
  v_pesos jsonb;
  v_cantidad_participantes integer;
  v_peso_total bigint;
  v_miembro jsonb;
  v_cliente integer;
  v_peso bigint;
  v_esperado bigint;
  v_asignado bigint := 0;
  v_indice integer := 0;
  v_aportes_cliente integer;
  v_monto_cliente bigint;
  v_total_aportes bigint := 0;
  v_participantes_con_consumo integer := 0;
  v_cobro record;
  v_referencia character varying;
BEGIN
  IF jsonb_typeof(p_aportes) IS DISTINCT FROM 'array' THEN
    RAISE EXCEPTION USING MESSAGE = 'APORTES_INVALIDOS';
  END IF;
  IF jsonb_array_length(p_aportes) = 0 THEN
    RAISE EXCEPTION USING MESSAGE = 'APORTES_INVALIDOS';
  END IF;
  IF EXISTS (
    SELECT 1
    FROM jsonb_array_elements(p_aportes) AS a(value)
    WHERE NOT (a.value ? 'clienteId')
       OR NOT (a.value ? 'monto')
       OR (a.value ->> 'monto')::numeric <= 0
  ) THEN
    RAISE EXCEPTION USING MESSAGE = 'APORTES_INVALIDOS';
  END IF;
  IF (
    SELECT count(*) <> count(DISTINCT (a.value ->> 'clienteId')::integer)
    FROM jsonb_array_elements(p_aportes) AS a(value)
  ) THEN
    RAISE EXCEPTION USING MESSAGE = 'APORTES_DUPLICADOS';
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
  IF v_pedido.modo_pago_mesa <> 'POR_CONSUMO' THEN
    RAISE EXCEPTION USING MESSAGE = 'MODO_NO_INDIVIDUAL';
  END IF;

  CALL public.usp_recalcular_pedido(p_pedido);
  SELECT pd.total, pd.modo_pago_mesa
  INTO v_total, v_modo
  FROM public.pedido AS pd
  WHERE pd.id_pedido = p_pedido;
  IF v_modo <> 'POR_CONSUMO' THEN
    RAISE EXCEPTION USING MESSAGE = 'MODO_NO_INDIVIDUAL';
  END IF;
  IF v_total IS NULL OR v_total <= 0 THEN
    RAISE EXCEPTION USING MESSAGE = 'TOTAL_CERO';
  END IF;
  v_total_centimos := round(v_total * 100)::bigint;
  v_referencia := COALESCE(
    NULLIF(BTRIM(p_ref), ''),
    NULLIF(BTRIM(p_aportes -> 0 ->> 'referencia'), '')
  );

  WITH participantes AS (
    SELECT
      pp.id_cliente,
      row_number() OVER (ORDER BY pp.id_cliente)::integer AS orden,
      count(*) OVER ()::integer AS cantidad
    FROM public.pedido_participante AS pp
    WHERE pp.id_pedido = p_pedido
  ),
  lineas AS (
    SELECT
      dp.id_detallepedido,
      round(COALESCE(dp.sub_total, dp.cantidad * dp.precio_unitario) * 100)::bigint AS centimos,
      CASE WHEN propietario.id_cliente IS NULL THEN NULL ELSE dp.id_cliente END AS cliente_propietario
    FROM public.detalle_pedido AS dp
    LEFT JOIN participantes AS propietario ON propietario.id_cliente = dp.id_cliente
    WHERE dp.id_pedido = p_pedido
      AND dp.estado_preparacion <> 'A'
      AND dp.estado = 'A'
      AND dp.es_cortesia = 'N'
  ),
  reparto AS (
    SELECT
      participante.id_cliente,
      CASE
        WHEN linea.cliente_propietario = participante.id_cliente THEN linea.centimos
        ELSE floor(linea.centimos::numeric / participante.cantidad)::bigint
          + CASE
              WHEN participante.orden <= mod(linea.centimos, participante.cantidad) THEN 1
              ELSE 0
            END
      END AS centimos
    FROM lineas AS linea
    CROSS JOIN participantes AS participante
    WHERE linea.cliente_propietario IS NULL
       OR linea.cliente_propietario = participante.id_cliente
  ),
  bases AS (
    SELECT participante.id_cliente, COALESCE(sum(reparto.centimos), 0)::bigint AS peso
    FROM participantes AS participante
    LEFT JOIN reparto ON reparto.id_cliente = participante.id_cliente
    GROUP BY participante.id_cliente
  )
  SELECT
    jsonb_agg(jsonb_build_object('clienteId', bases.id_cliente, 'peso', bases.peso) ORDER BY bases.id_cliente),
    count(*)::integer,
    COALESCE(sum(bases.peso), 0)::bigint
  INTO v_pesos, v_cantidad_participantes, v_peso_total
  FROM bases;

  IF COALESCE(v_cantidad_participantes, 0) = 0 THEN
    RAISE EXCEPTION USING MESSAGE = 'NO_PARTICIPANTES';
  END IF;

  FOR v_miembro IN
    SELECT a.value
    FROM jsonb_array_elements(v_pesos) AS a(value)
    ORDER BY (a.value ->> 'clienteId')::integer
  LOOP
    v_indice := v_indice + 1;
    v_cliente := (v_miembro ->> 'clienteId')::integer;
    v_peso := (v_miembro ->> 'peso')::bigint;
    IF v_peso_total = 0 THEN
      v_esperado := CASE
        WHEN v_indice = v_cantidad_participantes THEN v_total_centimos - v_asignado
        ELSE floor(v_total_centimos::numeric / v_cantidad_participantes)::bigint
      END;
    ELSIF v_indice = v_cantidad_participantes THEN
      v_esperado := v_total_centimos - v_asignado;
    ELSE
      v_esperado := floor((v_total_centimos::numeric * v_peso) / v_peso_total)::bigint;
    END IF;
    v_asignado := v_asignado + v_esperado;

    SELECT
      count(*)::integer,
      COALESCE(sum(round((aporte.value ->> 'monto')::numeric * 100)::bigint), 0)::bigint
    INTO v_aportes_cliente, v_monto_cliente
    FROM jsonb_array_elements(p_aportes) AS aporte(value)
    WHERE (aporte.value ->> 'clienteId')::integer = v_cliente;

    IF v_esperado > 0 THEN
      v_participantes_con_consumo := v_participantes_con_consumo + 1;
      IF v_aportes_cliente <> 1 OR v_monto_cliente <> v_esperado THEN
        RAISE EXCEPTION USING MESSAGE = 'APORTE_NO_COINCIDE_CON_CONSUMO';
      END IF;
      v_total_aportes := v_total_aportes + v_monto_cliente;
    ELSIF v_aportes_cliente <> 0 THEN
      RAISE EXCEPTION USING MESSAGE = 'APORTE_NO_COINCIDE_CON_CONSUMO';
    END IF;
  END LOOP;

  IF jsonb_array_length(p_aportes) <> v_participantes_con_consumo
     OR v_total_aportes <> v_total_centimos THEN
    RAISE EXCEPTION USING MESSAGE = 'APORTES_NO_CUBREN_TOTAL';
  END IF;

  SELECT *
  INTO v_cobro
  FROM public.fn_cobrar_pedido_atomic(
    p_pedido,
    p_usuario,
    p_apertura,
    p_tipodoc,
    p_cliente,
    p_metodo,
    p_recibido,
    COALESCE(v_referencia, '')
  );

  DELETE FROM public.pago_venta AS pv
  WHERE pv.id_venta = v_cobro.id_venta;

  INSERT INTO public.pago_venta (
    id_venta,
    id_metodopago,
    monto,
    referencia,
    id_cliente_pagador
  )
  SELECT
    v_cobro.id_venta,
    p_metodo,
    round((aporte.value ->> 'monto')::numeric, 2),
    NULLIF(LEFT(BTRIM(COALESCE(aporte.value ->> 'referencia', v_referencia, '')), 50), ''),
    (aporte.value ->> 'clienteId')::integer
  FROM jsonb_array_elements(p_aportes) AS aporte(value)
  WHERE round((aporte.value ->> 'monto')::numeric, 2) > 0;

  RETURN QUERY
  SELECT v_cobro.id_venta, v_cobro.serie, v_cobro.numero, v_cobro.total, v_cobro.vuelto;
END;
$$;

CREATE OR REPLACE FUNCTION public.fn_registrar_movimiento_inventario(
  p_producto integer,
  p_usuario integer,
  p_tipo character varying,
  p_cantidad numeric,
  p_costo numeric,
  p_observacion character varying,
  p_usucre character varying,
  p_pc character varying
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_producto public.producto%ROWTYPE;
  v_nuevo_stock numeric(12,3);
  v_id bigint;
BEGIN
  IF p_cantidad IS NULL OR p_cantidad <= 0 OR p_tipo NOT IN ('E', 'S', 'A', 'M') THEN
    RAISE EXCEPTION USING MESSAGE = 'VALIDATION_ERROR';
  END IF;
  SELECT * INTO v_producto
  FROM public.producto AS prod
  WHERE prod.id_producto = p_producto
    AND prod.estado = 'A'
  FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING MESSAGE = 'PRODUCTO_INVALIDO';
  END IF;

  v_nuevo_stock := COALESCE(v_producto.stock_actual, 0);
  IF v_producto.controla_stock = 'S' THEN
    IF p_tipo IN ('E', 'A') THEN
      v_nuevo_stock := v_nuevo_stock + p_cantidad;
    ELSE
      v_nuevo_stock := v_nuevo_stock - p_cantidad;
      IF v_nuevo_stock < 0 THEN
        RAISE EXCEPTION USING MESSAGE = 'STOCK_INSUFICIENTE';
      END IF;
    END IF;
  END IF;

  INSERT INTO public.movimiento_inventario (
    id_producto, id_usuario, tipo_movimiento, cantidad,
    stock_anterior, stock_nuevo, costo_unitario, observacion,
    usucre, pccre
  )
  VALUES (
    p_producto, p_usuario, p_tipo, p_cantidad,
    COALESCE(v_producto.stock_actual, 0), v_nuevo_stock,
    COALESCE(p_costo, 0), NULLIF(p_observacion, ''),
    p_usucre, p_pc
  )
  RETURNING id_movimientoinv INTO v_id;

  IF v_producto.controla_stock = 'S' THEN
    UPDATE public.producto
    SET stock_actual = v_nuevo_stock,
        usumod = p_usucre,
        pcmod = p_pc,
        fecmod = CURRENT_TIMESTAMP
    WHERE id_producto = p_producto;
  END IF;
  RETURN v_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.fn_asignar_permisos_rol(
  p_rol integer,
  p_permisos integer[],
  p_usuario character varying,
  p_pc character varying
)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
BEGIN
  PERFORM 1 FROM public.rol WHERE id_rol = p_rol FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING MESSAGE = 'ROL_NO_ENCONTRADO';
  END IF;
  IF EXISTS (
    SELECT 1
    FROM unnest(COALESCE(p_permisos, ARRAY[]::integer[])) AS seleccionado(id_permiso)
    LEFT JOIN public.permiso AS permiso
      ON permiso.id_permiso = seleccionado.id_permiso
     AND permiso.estado = 'A'
    WHERE permiso.id_permiso IS NULL
  ) THEN
    RAISE EXCEPTION USING MESSAGE = 'PERMISO_INVALIDO';
  END IF;

  DELETE FROM public.rol_permiso
  WHERE id_rol = p_rol;

  INSERT INTO public.rol_permiso (
    id_rol, id_permiso, concedido, estado, usucre, pccre
  )
  SELECT DISTINCT
    p_rol, seleccionado.id_permiso, 'S', 'A', p_usuario, p_pc
  FROM unnest(COALESCE(p_permisos, ARRAY[]::integer[])) AS seleccionado(id_permiso);
END;
$$;

CREATE OR REPLACE FUNCTION public.fn_consumir_insumos_venta()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_venta public.venta%ROWTYPE;
  v_producto public.producto%ROWTYPE;
  v_insumo record;
  v_stock_nuevo numeric(12,3);
  v_cantidad numeric(12,3);
  v_tiene_receta boolean;
BEGIN
  SELECT * INTO v_venta
  FROM public.venta
  WHERE id_venta = NEW.id_venta;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING MESSAGE = 'VENTA_NO_ENCONTRADA';
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.receta
    WHERE id_producto = NEW.id_producto AND estado = 'A'
  ) INTO v_tiene_receta;

  IF v_tiene_receta THEN
    IF EXISTS (
      SELECT 1
      FROM public.receta AS receta
      LEFT JOIN public.producto AS insumo ON insumo.id_producto = receta.id_insumo
      WHERE receta.id_producto = NEW.id_producto
        AND receta.estado = 'A'
        AND (insumo.id_producto IS NULL OR insumo.estado <> 'A')
    ) THEN
      RAISE EXCEPTION USING MESSAGE = 'INSUMO_INVALIDO';
    END IF;

    FOR v_insumo IN
      SELECT
        receta.id_insumo,
        receta.cantidad,
        insumo.stock_actual,
        insumo.controla_stock,
        insumo.costo,
        insumo.estado
      FROM public.receta AS receta
      JOIN public.producto AS insumo ON insumo.id_producto = receta.id_insumo
      WHERE receta.id_producto = NEW.id_producto
        AND receta.estado = 'A'
      ORDER BY receta.id_insumo
      FOR UPDATE OF insumo
    LOOP
      IF v_insumo.estado <> 'A' THEN
        RAISE EXCEPTION USING MESSAGE = 'INSUMO_INVALIDO';
      END IF;
      IF v_insumo.controla_stock = 'S' THEN
        v_cantidad := round(v_insumo.cantidad * NEW.cantidad, 3);
        v_stock_nuevo := COALESCE(v_insumo.stock_actual, 0) - v_cantidad;
        IF v_stock_nuevo < 0 THEN
          RAISE EXCEPTION USING MESSAGE = 'STOCK_INSUFICIENTE';
        END IF;
        UPDATE public.producto
        SET stock_actual = v_stock_nuevo,
            usumod = current_user,
            pcmod = NULL,
            fecmod = CURRENT_TIMESTAMP
        WHERE id_producto = v_insumo.id_insumo;
        INSERT INTO public.movimiento_inventario (
          id_producto, id_usuario, id_pedido, tipo_movimiento, cantidad,
          stock_anterior, stock_nuevo, costo_unitario, documento, observacion
        )
        VALUES (
          v_insumo.id_insumo, v_venta.id_usuario, v_venta.id_pedido, 'S', v_cantidad,
          COALESCE(v_insumo.stock_actual, 0), v_stock_nuevo, COALESCE(v_insumo.costo, 0),
          'VENTA ' || v_venta.id_venta, 'Consumo por receta en venta ' || v_venta.id_venta
        );
      END IF;
    END LOOP;
  ELSE
    SELECT * INTO v_producto
    FROM public.producto
    WHERE id_producto = NEW.id_producto
    FOR UPDATE;
    IF FOUND AND v_producto.controla_stock = 'S' THEN
      v_cantidad := NEW.cantidad;
      v_stock_nuevo := COALESCE(v_producto.stock_actual, 0) - v_cantidad;
      IF v_stock_nuevo < 0 THEN
        RAISE EXCEPTION USING MESSAGE = 'STOCK_INSUFICIENTE';
      END IF;
      UPDATE public.producto
      SET stock_actual = v_stock_nuevo,
          usumod = current_user,
          pcmod = NULL,
          fecmod = CURRENT_TIMESTAMP
      WHERE id_producto = NEW.id_producto;
      INSERT INTO public.movimiento_inventario (
        id_producto, id_usuario, id_pedido, tipo_movimiento, cantidad,
        stock_anterior, stock_nuevo, costo_unitario, documento, observacion
      )
      VALUES (
        NEW.id_producto, v_venta.id_usuario, v_venta.id_pedido, 'S', v_cantidad,
        COALESCE(v_producto.stock_actual, 0), v_stock_nuevo, COALESCE(v_producto.costo, 0),
        'VENTA ' || v_venta.id_venta, 'Consumo por venta ' || v_venta.id_venta
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_consumir_insumos_venta ON public.detalle_venta;
CREATE TRIGGER trg_consumir_insumos_venta
AFTER INSERT ON public.detalle_venta
FOR EACH ROW
EXECUTE FUNCTION public.fn_consumir_insumos_venta();

REVOKE ALL ON FUNCTION public.fn_abrir_pedido_validado(integer, integer, integer, integer, integer, integer, character varying) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fn_recalcular_pedido(integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fn_agregar_detalle_pedido(integer, integer, numeric, character varying, numeric) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fn_registrar_participante_comanda(integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fn_abrir_o_unirse_comanda_qr(integer, integer, integer, integer, integer, character varying) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fn_agregar_detalle_pedido_cliente(integer, integer, numeric, character varying, numeric, integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fn_configurar_modo_pago_comanda(integer, integer, character varying) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fn_pedir_cuenta_comanda(integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fn_cobrar_pedido_aportes_atomic(integer, integer, integer, character varying, integer, integer, numeric, character varying, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fn_registrar_movimiento_inventario(integer, integer, character varying, numeric, numeric, character varying, character varying, character varying) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fn_asignar_permisos_rol(integer, integer[], character varying, character varying) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fn_consumir_insumos_venta() FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.fn_abrir_pedido_validado(integer, integer, integer, integer, integer, integer, character varying) TO service_role;
GRANT EXECUTE ON FUNCTION public.fn_recalcular_pedido(integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.fn_agregar_detalle_pedido(integer, integer, numeric, character varying, numeric) TO service_role;
GRANT EXECUTE ON FUNCTION public.fn_registrar_participante_comanda(integer, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.fn_abrir_o_unirse_comanda_qr(integer, integer, integer, integer, integer, character varying) TO service_role;
GRANT EXECUTE ON FUNCTION public.fn_agregar_detalle_pedido_cliente(integer, integer, numeric, character varying, numeric, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.fn_configurar_modo_pago_comanda(integer, integer, character varying) TO service_role;
GRANT EXECUTE ON FUNCTION public.fn_pedir_cuenta_comanda(integer, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.fn_cobrar_pedido_aportes_atomic(integer, integer, integer, character varying, integer, integer, numeric, character varying, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.fn_registrar_movimiento_inventario(integer, integer, character varying, numeric, numeric, character varying, character varying, character varying) TO service_role;
GRANT EXECUTE ON FUNCTION public.fn_asignar_permisos_rol(integer, integer[], character varying, character varying) TO service_role;

NOTIFY pgrst, 'reload schema';