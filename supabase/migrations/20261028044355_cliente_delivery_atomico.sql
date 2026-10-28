ALTER TABLE public.pedido_delivery
  ADD COLUMN IF NOT EXISTS lat_cliente numeric(9,6),
  ADD COLUMN IF NOT EXISTS lng_cliente numeric(9,6),
  ADD COLUMN IF NOT EXISTS lat_repartidor numeric(9,6),
  ADD COLUMN IF NOT EXISTS lng_repartidor numeric(9,6),
  ADD COLUMN IF NOT EXISTS f_ubicacion timestamp without time zone,
  ADD COLUMN IF NOT EXISTS costo_envio_confirmado boolean NOT NULL DEFAULT true;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ck_peddel_lat_cli') THEN
    ALTER TABLE public.pedido_delivery
      ADD CONSTRAINT ck_peddel_lat_cli CHECK (lat_cliente IS NULL OR lat_cliente BETWEEN -90 AND 90);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ck_peddel_lng_cli') THEN
    ALTER TABLE public.pedido_delivery
      ADD CONSTRAINT ck_peddel_lng_cli CHECK (lng_cliente IS NULL OR lng_cliente BETWEEN -180 AND 180);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ck_peddel_lat_rep') THEN
    ALTER TABLE public.pedido_delivery
      ADD CONSTRAINT ck_peddel_lat_rep CHECK (lat_repartidor IS NULL OR lat_repartidor BETWEEN -90 AND 90);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ck_peddel_lng_rep') THEN
    ALTER TABLE public.pedido_delivery
      ADD CONSTRAINT ck_peddel_lng_rep CHECK (lng_repartidor IS NULL OR lng_repartidor BETWEEN -180 AND 180);
  END IF;
END $$;

ALTER TABLE public.distrito
  ADD COLUMN IF NOT EXISTS lat_ref numeric(9,6),
  ADD COLUMN IF NOT EXISTS lng_ref numeric(9,6),
  ADD COLUMN IF NOT EXISTS radio_km numeric(6,2) DEFAULT 5 NOT NULL,
  ADD COLUMN IF NOT EXISTS costo_base numeric(10,2) DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS recargo_km numeric(10,2) DEFAULT 1.50 NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ck_distrito_radio') THEN
    ALTER TABLE public.distrito
      ADD CONSTRAINT ck_distrito_radio CHECK (radio_km IS NULL OR radio_km > 0);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ck_distrito_costo') THEN
    ALTER TABLE public.distrito
      ADD CONSTRAINT ck_distrito_costo CHECK (costo_base IS NULL OR costo_base >= 0);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ck_distrito_recargo_km') THEN
    ALTER TABLE public.distrito
      ADD CONSTRAINT ck_distrito_recargo_km CHECK (recargo_km IS NULL OR recargo_km >= 0);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.configuracion_negocio (
  id integer PRIMARY KEY CHECK (id = 1),
  lat_local numeric(9,6),
  lng_local numeric(9,6),
  direccion_local varchar(150),
  radio_cobertura_km numeric(6,2),
  usucre varchar(30) NOT NULL DEFAULT current_user,
  pccre varchar(30),
  feccre timestamp without time zone NOT NULL DEFAULT current_timestamp,
  usumod varchar(30),
  pcmod varchar(30),
  fecmod timestamp without time zone,
  CONSTRAINT ck_config_negocio_lat CHECK (lat_local IS NULL OR lat_local BETWEEN -90 AND 90),
  CONSTRAINT ck_config_negocio_lng CHECK (lng_local IS NULL OR lng_local BETWEEN -180 AND 180),
  CONSTRAINT ck_config_negocio_radio CHECK (radio_cobertura_km IS NULL OR radio_cobertura_km > 0)
);

INSERT INTO public.configuracion_negocio (id)
SELECT 1
WHERE NOT EXISTS (SELECT 1 FROM public.configuracion_negocio WHERE id = 1);

ALTER TABLE public.configuracion_negocio ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.configuracion_negocio FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.configuracion_negocio TO service_role;

CREATE OR REPLACE FUNCTION public.haversine_km(
  lat1 double precision,
  lng1 double precision,
  lat2 double precision,
  lng2 double precision
)
RETURNS double precision
LANGUAGE sql
IMMUTABLE
STRICT
SET search_path = pg_catalog
AS $$
  SELECT 6371 * 2 * asin(sqrt(
    power(sin(radians((lat2 - lat1) / 2)), 2)
    + cos(radians(lat1)) * cos(radians(lat2))
    * power(sin(radians((lng2 - lng1) / 2)), 2)
  ));
$$;

REVOKE ALL ON FUNCTION public.haversine_km(double precision, double precision, double precision, double precision)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.haversine_km(double precision, double precision, double precision, double precision)
  TO service_role;

CREATE OR REPLACE VIEW public.vw_delivery_ubicacion
WITH (security_invoker = true)
AS
SELECT
  pd.id_pedidodelivery,
  pd.id_pedido,
  pd.id_distrito,
  d.d_distrito AS distrito,
  pd.direccion_entrega,
  pd.costo_envio,
  pd.situacion,
  pd.f_salida,
  pd.f_entrega,
  pd.lat_cliente,
  pd.lng_cliente,
  pd.lat_repartidor,
  pd.lng_repartidor,
  pd.f_ubicacion,
  pd.id_empleado AS id_repartidor,
  pd.costo_envio_confirmado
FROM public.pedido_delivery AS pd
LEFT JOIN public.distrito AS d ON d.id_distrito = pd.id_distrito
WHERE pd.estado = 'A';

REVOKE ALL ON TABLE public.vw_delivery_ubicacion FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.vw_delivery_ubicacion TO service_role;

CREATE OR REPLACE FUNCTION public.fn_crear_delivery_cliente(
  p_cliente integer,
  p_usuario integer,
  p_distrito integer,
  p_direccion varchar,
  p_referencia varchar,
  p_telefono varchar,
  p_costo_envio numeric,
  p_lat_cliente numeric,
  p_lng_cliente numeric,
  p_items jsonb,
  p_pc varchar
)
RETURNS TABLE (
  id_pedidodelivery integer,
  situacion character,
  costo_envio numeric
)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_id_pedido integer;
  v_numero_pedido varchar(15);
  v_id_delivery integer;
  v_item jsonb;
  v_actor varchar(30);
  v_pc varchar(30);
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.cliente
    WHERE id_cliente = p_cliente AND estado = 'A'
  ) THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'CLIENTE_NOT_FOUND';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.usuario
    WHERE id_usuario = p_usuario AND estado = 'A' AND bloqueado = 'N'
  ) THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'AUTOSERVICIO_USER_NOT_READY';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.distrito
    WHERE id_distrito = p_distrito AND estado = 'A'
  ) THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'DISTRITO_NOT_FOUND';
  END IF;

  IF p_direccion IS NULL OR btrim(p_direccion) = '' OR char_length(p_direccion) > 150
    OR p_referencia IS NOT NULL AND char_length(p_referencia) > 150
    OR p_telefono IS NULL OR p_telefono !~ '^[0-9]{9}$'
    OR p_costo_envio IS NULL OR p_costo_envio < 0
    OR (p_lat_cliente IS NULL) <> (p_lng_cliente IS NULL)
    OR p_lat_cliente IS NOT NULL AND p_lat_cliente NOT BETWEEN -90 AND 90
    OR p_lng_cliente IS NOT NULL AND p_lng_cliente NOT BETWEEN -180 AND 180
  THEN
    RAISE EXCEPTION USING ERRCODE = '22023', MESSAGE = 'DELIVERY_VALIDATION_ERROR';
  END IF;

  IF jsonb_typeof(p_items) IS DISTINCT FROM 'array' THEN
    RAISE EXCEPTION USING ERRCODE = '22023', MESSAGE = 'DELIVERY_ITEMS_INVALID';
  END IF;
  IF jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION USING ERRCODE = '22023', MESSAGE = 'DELIVERY_ITEMS_INVALID';
  END IF;

  FOR v_item IN SELECT value FROM jsonb_array_elements(p_items) AS items(value)
  LOOP
    IF jsonb_typeof(v_item) IS DISTINCT FROM 'object'
      OR coalesce(v_item ->> 'productoId', '') !~ '^[1-9][0-9]*$'
      OR coalesce(v_item ->> 'cantidad', '') !~ '^[1-9][0-9]*$'
      OR char_length(coalesce(v_item ->> 'nota', '')) > 150
    THEN
      RAISE EXCEPTION USING ERRCODE = '22023', MESSAGE = 'DELIVERY_ITEMS_INVALID';
    END IF;
  END LOOP;

  v_actor := 'CLIENTE:' || p_cliente::text;
  v_pc := CASE WHEN char_length(coalesce(p_pc, '')) <= 30 THEN nullif(p_pc, '') ELSE NULL END;

  SELECT opened.o_id, opened.o_num
  INTO v_id_pedido, v_numero_pedido
  FROM public.fn_abrir_pedido_validado(
    3, p_usuario, NULL, p_cliente, NULL, 1, 'Delivery: ' || p_direccion
  ) AS opened;

  UPDATE public.pedido
  SET usucre = v_actor,
      pccre = v_pc
  WHERE id_pedido = v_id_pedido;

  FOR v_item IN SELECT value FROM jsonb_array_elements(p_items) AS items(value)
  LOOP
    PERFORM public.fn_agregar_detalle_pedido(
      v_id_pedido,
      (v_item ->> 'productoId')::integer,
      (v_item ->> 'cantidad')::numeric,
      nullif(v_item ->> 'nota', ''),
      0
    );
  END LOOP;

  INSERT INTO public.pedido_delivery (
    id_pedido,
    id_distrito,
    direccion_entrega,
    referencia,
    telefono_contacto,
    costo_envio,
    costo_envio_confirmado,
    lat_cliente,
    lng_cliente,
    usucre,
    pccre
  )
  VALUES (
    v_id_pedido,
    p_distrito,
    btrim(p_direccion),
    nullif(btrim(p_referencia), ''),
    p_telefono,
    round(p_costo_envio, 2),
    false,
    p_lat_cliente,
    p_lng_cliente,
    v_actor,
    v_pc
  )
  RETURNING pedido_delivery.id_pedidodelivery INTO v_id_delivery;

  RETURN QUERY
  SELECT v_id_delivery, 'P'::character(1), round(p_costo_envio, 2);
END;
$$;

REVOKE ALL ON FUNCTION public.fn_crear_delivery_cliente(
  integer, integer, integer, varchar, varchar, varchar, numeric, numeric, numeric, jsonb, varchar
) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.fn_crear_delivery_cliente(
  integer, integer, integer, varchar, varchar, varchar, numeric, numeric, numeric, jsonb, varchar
) TO service_role;