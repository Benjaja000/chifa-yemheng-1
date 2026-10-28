CREATE INDEX IF NOT EXISTS ix_auditoria_fecha_id
  ON public.auditoria (f_evento DESC, id_auditoria DESC);

CREATE INDEX IF NOT EXISTS ix_auditoria_usuario_fecha
  ON public.auditoria (id_usuario, f_evento DESC, id_auditoria DESC);

DO $$
DECLARE
  v_columna record;
BEGIN
  FOR v_columna IN
    SELECT n.nspname, c.relname, a.attname
    FROM pg_catalog.pg_attribute AS a
    JOIN pg_catalog.pg_class AS c ON c.oid = a.attrelid
    JOIN pg_catalog.pg_namespace AS n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relkind IN ('r', 'p')
      AND a.attnum > 0
      AND NOT a.attisdropped
      AND a.attname IN ('pccre', 'pcmod')
      AND a.atttypid = 'character varying'::regtype
      AND a.atttypmod BETWEEN 5 AND 48
  LOOP
    EXECUTE format(
      'ALTER TABLE %I.%I ALTER COLUMN %I TYPE varchar(45)',
      v_columna.nspname,
      v_columna.relname,
      v_columna.attname
    );
  END LOOP;
END;
$$;

ALTER TABLE public.auditoria
  ADD COLUMN IF NOT EXISTS motivo text;

ALTER TABLE public.auditoria
  ALTER COLUMN terminal TYPE varchar(45);

CREATE OR REPLACE FUNCTION public.fn_auditar_cambio_critico()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_old_row jsonb := CASE WHEN TG_OP = 'INSERT' THEN '{}'::jsonb ELSE to_jsonb(OLD) END;
  v_new_row jsonb := CASE WHEN TG_OP = 'DELETE' THEN '{}'::jsonb ELSE to_jsonb(NEW) END;
  v_old jsonb;
  v_new jsonb;
  v_actor integer;
  v_actor_logeo text;
  v_terminal text;
  v_motivo text;
  v_id_registro integer;
  v_tabla varchar(50);
  v_accion varchar(20);
BEGIN
  v_terminal := LEFT(COALESCE(
    NULLIF(current_setting('app.audit_terminal', true), ''),
    NULLIF(v_new_row ->> 'terminal', ''),
    NULLIF(v_new_row ->> 'pcmod', ''),
    NULLIF(v_new_row ->> 'pccre', ''),
    NULLIF(v_old_row ->> 'pcmod', ''),
    NULLIF(v_old_row ->> 'pccre', '')
  ), 45);

  CASE TG_TABLE_NAME
    WHEN 'usuario' THEN
      v_tabla := 'USUARIO';
      v_id_registro := COALESCE((v_new_row ->> 'id_usuario')::integer, (v_old_row ->> 'id_usuario')::integer);
      v_old := jsonb_build_object(
        'logeo', v_old_row -> 'logeo',
        'id_tipousuario', v_old_row -> 'id_tipousuario',
        'id_empleado', v_old_row -> 'id_empleado',
        'bloqueado', v_old_row -> 'bloqueado',
        'estado', v_old_row -> 'estado'
      );
      v_new := jsonb_build_object(
        'logeo', v_new_row -> 'logeo',
        'id_tipousuario', v_new_row -> 'id_tipousuario',
        'id_empleado', v_new_row -> 'id_empleado',
        'bloqueado', v_new_row -> 'bloqueado',
        'estado', v_new_row -> 'estado'
      );
      v_actor_logeo := COALESCE(
        NULLIF(current_setting('app.audit_actor_logeo', true), ''),
        NULLIF(v_new_row ->> 'usumod', ''),
        NULLIF(v_new_row ->> 'usucre', ''),
        NULLIF(v_old_row ->> 'usumod', ''),
        NULLIF(v_old_row ->> 'usucre', '')
      );
      v_actor := v_id_registro;
      IF TG_OP = 'UPDATE' AND v_old_row -> 'clave' IS DISTINCT FROM v_new_row -> 'clave' THEN
        v_accion := 'CAMBIO_CLAVE';
        v_old := jsonb_build_object('clave', '[REDACTED]');
        v_new := jsonb_build_object('clave', 'actualizada');
      ELSE
        v_accion := CASE TG_OP WHEN 'INSERT' THEN 'INSERT' WHEN 'DELETE' THEN 'DELETE' ELSE 'UPDATE' END;
        IF TG_OP = 'UPDATE' AND v_old IS NOT DISTINCT FROM v_new THEN
          RETURN NEW;
        END IF;
      END IF;

    WHEN 'rol' THEN
      v_tabla := 'ROL';
      v_id_registro := COALESCE((v_new_row ->> 'id_rol')::integer, (v_old_row ->> 'id_rol')::integer);
      v_old := jsonb_build_object(
        'n_rol', v_old_row -> 'n_rol',
        'descripcion', v_old_row -> 'descripcion',
        'nivel', v_old_row -> 'nivel',
        'estado', v_old_row -> 'estado'
      );
      v_new := jsonb_build_object(
        'n_rol', v_new_row -> 'n_rol',
        'descripcion', v_new_row -> 'descripcion',
        'nivel', v_new_row -> 'nivel',
        'estado', v_new_row -> 'estado'
      );
      v_actor_logeo := COALESCE(
        NULLIF(current_setting('app.audit_actor_logeo', true), ''),
        NULLIF(v_new_row ->> 'usumod', ''),
        NULLIF(v_new_row ->> 'usucre', ''),
        NULLIF(v_old_row ->> 'usumod', ''),
        NULLIF(v_old_row ->> 'usucre', '')
      );
      v_accion := CASE TG_OP WHEN 'INSERT' THEN 'INSERT' WHEN 'DELETE' THEN 'DELETE' ELSE 'UPDATE' END;
      IF TG_OP = 'UPDATE' AND v_old IS NOT DISTINCT FROM v_new THEN
        RETURN NEW;
      END IF;

    WHEN 'rol_permiso' THEN
      v_tabla := 'ROL_PERMISO';
      v_id_registro := COALESCE((v_new_row ->> 'id_rolpermiso')::integer, (v_old_row ->> 'id_rolpermiso')::integer);
      v_old := jsonb_build_object(
        'id_rol', v_old_row -> 'id_rol',
        'id_permiso', v_old_row -> 'id_permiso',
        'concedido', v_old_row -> 'concedido',
        'estado', v_old_row -> 'estado'
      );
      v_new := jsonb_build_object(
        'id_rol', v_new_row -> 'id_rol',
        'id_permiso', v_new_row -> 'id_permiso',
        'concedido', v_new_row -> 'concedido',
        'estado', v_new_row -> 'estado'
      );
      v_actor_logeo := COALESCE(
        NULLIF(current_setting('app.audit_actor_logeo', true), ''),
        NULLIF(v_new_row ->> 'usumod', ''),
        NULLIF(v_new_row ->> 'usucre', ''),
        NULLIF(v_old_row ->> 'usumod', ''),
        NULLIF(v_old_row ->> 'usucre', '')
      );
      v_accion := CASE TG_OP WHEN 'INSERT' THEN 'INSERT' WHEN 'DELETE' THEN 'DELETE' ELSE 'UPDATE' END;
      IF TG_OP = 'UPDATE' AND v_old IS NOT DISTINCT FROM v_new THEN
        RETURN NEW;
      END IF;

    WHEN 'apertura_caja' THEN
      v_tabla := 'APERTURA_CAJA';
      v_id_registro := (v_new_row ->> 'id_aperturacaja')::integer;
      v_old := '{}'::jsonb;
      v_new := jsonb_build_object(
        'id_caja', v_new_row -> 'id_caja',
        'id_usuario', v_new_row -> 'id_usuario',
        'numero_turno', v_new_row -> 'numero_turno',
        'f_apertura', v_new_row -> 'f_apertura',
        'monto_inicial', v_new_row -> 'monto_inicial',
        'monto_sistema', v_new_row -> 'monto_sistema',
        'situacion', v_new_row -> 'situacion'
      );
      v_actor := (v_new_row ->> 'id_usuario')::integer;
      v_accion := 'APERTURA';

    WHEN 'movimiento_caja' THEN
      v_tabla := 'MOVIMIENTO_CAJA';
      v_id_registro := (v_new_row ->> 'id_movimientocaja')::integer;
      v_old := '{}'::jsonb;
      v_new := jsonb_build_object(
        'id_aperturacaja', v_new_row -> 'id_aperturacaja',
        'id_tipomovimiento', v_new_row -> 'id_tipomovimiento',
        'id_concepto', v_new_row -> 'id_concepto',
        'id_metodopago', v_new_row -> 'id_metodopago',
        'id_pedido', v_new_row -> 'id_pedido',
        'id_venta', v_new_row -> 'id_venta',
        'monto', v_new_row -> 'monto',
        'afecta_efectivo', v_new_row -> 'afecta_efectivo',
        'f_movimiento', v_new_row -> 'f_movimiento'
      );
      v_actor := (v_new_row ->> 'id_usuario')::integer;
      v_accion := CASE
        WHEN NULLIF(v_new_row ->> 'id_venta', '') IS NOT NULL THEN 'COBRO'
        ELSE 'MOVIMIENTO'
      END;

    WHEN 'venta' THEN
      v_tabla := 'VENTA';
      v_id_registro := (v_new_row ->> 'id_venta')::integer;
      v_old := '{}'::jsonb;
      v_new := jsonb_build_object(
        'id_pedido', v_new_row -> 'id_pedido',
        'id_aperturacaja', v_new_row -> 'id_aperturacaja',
        'tipodocumento', v_new_row -> 'tipodocumento',
        'subtotal', v_new_row -> 'subtotal',
        'descuento', v_new_row -> 'descuento',
        'total', v_new_row -> 'total',
        'total_pagado', v_new_row -> 'total_pagado',
        'f_venta', v_new_row -> 'f_venta'
      );
      v_actor := (v_new_row ->> 'id_usuario')::integer;
      v_accion := 'COBRO';

    WHEN 'nota_credito' THEN
      v_tabla := 'NOTA_CREDITO';
      v_id_registro := (v_new_row ->> 'id_notacredito')::integer;
      v_old := '{}'::jsonb;
      v_new := jsonb_build_object(
        'id_venta', v_new_row -> 'id_venta',
        'serie', v_new_row -> 'serie',
        'numero', v_new_row -> 'numero',
        'tipo_doc_referencia', v_new_row -> 'tipo_doc_referencia',
        'serie_referencia', v_new_row -> 'serie_referencia',
        'numero_referencia', v_new_row -> 'numero_referencia',
        'monto', v_new_row -> 'monto',
        'f_emision', v_new_row -> 'f_emision',
        'estado_sunat', v_new_row -> 'estado_sunat'
      );
      v_actor_logeo := COALESCE(
        NULLIF(current_setting('app.audit_actor_logeo', true), ''),
        NULLIF(v_new_row ->> 'usucre', '')
      );
      v_accion := 'EMISION_NC';

    WHEN 'pedido' THEN
      v_tabla := 'PEDIDO';
      v_id_registro := (v_new_row ->> 'id_pedido')::integer;
      v_old := jsonb_build_object(
        'descuento', v_old_row -> 'descuento',
        'total', v_old_row -> 'total',
        'anulado', v_old_row -> 'anulado',
        'facturado', v_old_row -> 'facturado',
        'id_estadopedido', v_old_row -> 'id_estadopedido',
        'estado', v_old_row -> 'estado'
      );
      v_new := jsonb_build_object(
        'descuento', v_new_row -> 'descuento',
        'total', v_new_row -> 'total',
        'anulado', v_new_row -> 'anulado',
        'facturado', v_new_row -> 'facturado',
        'id_estadopedido', v_new_row -> 'id_estadopedido',
        'estado', v_new_row -> 'estado'
      );
      IF v_old IS NOT DISTINCT FROM v_new THEN
        RETURN NEW;
      END IF;
      v_actor_logeo := COALESCE(
        NULLIF(current_setting('app.audit_actor_logeo', true), ''),
        NULLIF(v_new_row ->> 'usumod', '')
      );
      v_actor := (v_new_row ->> 'id_usuario')::integer;
      v_accion := CASE
        WHEN v_old_row -> 'anulado' IS DISTINCT FROM v_new_row -> 'anulado'
          AND v_new_row ->> 'anulado' = 'S' THEN 'ANULACION'
        WHEN v_old_row -> 'descuento' IS DISTINCT FROM v_new_row -> 'descuento' THEN 'DESCUENTO'
        WHEN v_old_row -> 'facturado' IS DISTINCT FROM v_new_row -> 'facturado' THEN 'FACTURACION'
        WHEN v_old_row -> 'id_estadopedido' IS DISTINCT FROM v_new_row -> 'id_estadopedido'
          OR v_old_row -> 'estado' IS DISTINCT FROM v_new_row -> 'estado' THEN 'CAMBIO_ESTADO'
        ELSE 'UPDATE'
      END;

    ELSE
      RAISE EXCEPTION 'Tabla no soportada por la auditoría crítica: %', TG_TABLE_NAME;
  END CASE;

  IF v_actor_logeo IS NOT NULL THEN
    SELECT u.id_usuario
    INTO v_actor
    FROM public.usuario AS u
    WHERE u.logeo = v_actor_logeo
    LIMIT 1;
  END IF;
  IF v_actor IS NULL AND TG_TABLE_NAME = 'usuario' THEN
    v_actor := v_id_registro;
  END IF;
  v_motivo := NULLIF(btrim(COALESCE(
    v_new_row ->> 'motivo_ultimo_cambio',
    v_old_row ->> 'motivo_ultimo_cambio'
  )), '');
  IF TG_TABLE_NAME = 'usuario'
     AND v_accion = 'CAMBIO_CLAVE'
     AND v_actor = v_id_registro THEN
    v_motivo := NULL;
  END IF;

  INSERT INTO public.auditoria (
    id_usuario, n_tabla, accion, id_registro,
    valor_anterior, valor_nuevo, motivo, terminal
  )
  VALUES (
    v_actor, v_tabla, v_accion, v_id_registro,
    CASE WHEN TG_OP = 'INSERT' THEN NULL ELSE v_old::text END,
    CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE v_new::text END,
    v_motivo,
    v_terminal
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.fn_auditar_cierre_caja()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_actor integer;
  v_accion varchar(20);
  v_old jsonb;
  v_new jsonb;
  v_terminal text;
  v_auditoria_id bigint;
BEGIN
  IF OLD.situacion IS NOT DISTINCT FROM NEW.situacion THEN
    RETURN NULL;
  END IF;

  v_actor := COALESCE(NEW.id_usuariocierre, NEW.id_usuario_solicita_cierre, NEW.id_usuario);
  v_accion := CASE NEW.situacion
    WHEN 'P' THEN 'SOLICITUD_CIERRE'
    WHEN 'C' THEN 'CIERRE_VALIDADO'
    ELSE 'CAMBIO_ESTADO'
  END;
  v_terminal := LEFT(COALESCE(
    NULLIF(current_setting('app.audit_terminal', true), ''),
    NULLIF(NEW.pcmod, ''),
    NULLIF(NEW.pccre, '')
  ), 45);
  v_old := jsonb_build_object(
    'id_caja', OLD.id_caja,
    'id_usuario', OLD.id_usuario,
    'situacion', OLD.situacion,
    'monto_sistema', OLD.monto_sistema,
    'monto_declarado', OLD.monto_declarado,
    'diferencia', OLD.diferencia
  );
  v_new := jsonb_build_object(
    'id_caja', NEW.id_caja,
    'id_usuario', NEW.id_usuario,
    'id_usuario_solicita_cierre', NEW.id_usuario_solicita_cierre,
    'id_usuariocierre', NEW.id_usuariocierre,
    'situacion', NEW.situacion,
    'monto_sistema', NEW.monto_sistema,
    'monto_declarado', NEW.monto_declarado,
    'diferencia', NEW.diferencia,
    'f_solicitud_cierre', NEW.f_solicitud_cierre,
    'f_cierre', NEW.f_cierre
  );

  SELECT a.id_auditoria
  INTO v_auditoria_id
  FROM public.auditoria AS a
  WHERE a.n_tabla = 'APERTURA_CAJA'
    AND a.accion = v_accion
    AND a.id_registro = NEW.id_aperturacaja
    AND a.id_usuario = v_actor
    AND a.f_evento >= transaction_timestamp()
  ORDER BY a.id_auditoria DESC
  LIMIT 1;

  IF v_auditoria_id IS NOT NULL THEN
    UPDATE public.auditoria
    SET valor_anterior = v_old::text,
        valor_nuevo = v_new::text,
        terminal = COALESCE(terminal, v_terminal)
    WHERE id_auditoria = v_auditoria_id;
  ELSE
    INSERT INTO public.auditoria (
      id_usuario, n_tabla, accion, id_registro,
      valor_anterior, valor_nuevo, terminal
    )
    VALUES (
      v_actor, 'APERTURA_CAJA', v_accion, NEW.id_aperturacaja,
      v_old::text, v_new::text, v_terminal
    );
  END IF;

  RETURN NULL;
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
DECLARE
  v_permisos integer[] := COALESCE(p_permisos, ARRAY[]::integer[]);
BEGIN
  PERFORM 1 FROM public.rol WHERE id_rol = p_rol FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING MESSAGE = 'ROL_NO_ENCONTRADO';
  END IF;
  IF EXISTS (
    SELECT 1
    FROM unnest(v_permisos) AS seleccionado(id_permiso)
    LEFT JOIN public.permiso AS permiso
      ON permiso.id_permiso = seleccionado.id_permiso
     AND permiso.estado = 'A'
    WHERE permiso.id_permiso IS NULL
  ) THEN
    RAISE EXCEPTION USING MESSAGE = 'PERMISO_INVALIDO';
  END IF;

  PERFORM set_config('app.audit_actor_logeo', p_usuario, true);
  PERFORM set_config('app.audit_terminal', COALESCE(p_pc, ''), true);

  UPDATE public.rol_permiso
  SET concedido = 'N',
      estado = 'I',
      usumod = p_usuario,
      pcmod = p_pc,
      fecmod = CURRENT_TIMESTAMP
  WHERE id_rol = p_rol
    AND estado = 'A'
    AND NOT (id_permiso = ANY(v_permisos));

  UPDATE public.rol_permiso
  SET concedido = 'S',
      estado = 'A',
      usumod = p_usuario,
      pcmod = p_pc,
      fecmod = CURRENT_TIMESTAMP
  WHERE id_rol = p_rol
    AND id_permiso = ANY(v_permisos)
    AND (estado <> 'A' OR concedido <> 'S');

  INSERT INTO public.rol_permiso (
    id_rol, id_permiso, concedido, estado, usucre, pccre
  )
  SELECT DISTINCT p_rol, seleccionado.id_permiso, 'S', 'A', p_usuario, p_pc
  FROM unnest(v_permisos) AS seleccionado(id_permiso)
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.rol_permiso AS existente
    WHERE existente.id_rol = p_rol
      AND existente.id_permiso = seleccionado.id_permiso
  );
END;
$$;

DROP TRIGGER IF EXISTS tr_auditoria_usuario_critica ON public.usuario;
CREATE TRIGGER tr_auditoria_usuario_critica
AFTER INSERT OR UPDATE ON public.usuario
FOR EACH ROW EXECUTE FUNCTION public.fn_auditar_cambio_critico();

DROP TRIGGER IF EXISTS tr_auditoria_rol_critica ON public.rol;
CREATE TRIGGER tr_auditoria_rol_critica
AFTER INSERT OR UPDATE ON public.rol
FOR EACH ROW EXECUTE FUNCTION public.fn_auditar_cambio_critico();

DROP TRIGGER IF EXISTS tr_auditoria_rol_permiso_critica ON public.rol_permiso;
CREATE TRIGGER tr_auditoria_rol_permiso_critica
AFTER INSERT OR UPDATE OR DELETE ON public.rol_permiso
FOR EACH ROW EXECUTE FUNCTION public.fn_auditar_cambio_critico();

DROP TRIGGER IF EXISTS tr_auditoria_apertura_caja_insert ON public.apertura_caja;
CREATE TRIGGER tr_auditoria_apertura_caja_insert
AFTER INSERT ON public.apertura_caja
FOR EACH ROW EXECUTE FUNCTION public.fn_auditar_cambio_critico();

DROP TRIGGER IF EXISTS tr_auditoria_apertura_caja_cierre ON public.apertura_caja;
CREATE CONSTRAINT TRIGGER tr_auditoria_apertura_caja_cierre
AFTER UPDATE ON public.apertura_caja
DEFERRABLE INITIALLY DEFERRED
FOR EACH ROW EXECUTE FUNCTION public.fn_auditar_cierre_caja();

DROP TRIGGER IF EXISTS tr_auditoria_movimiento_caja_insert ON public.movimiento_caja;
CREATE TRIGGER tr_auditoria_movimiento_caja_insert
AFTER INSERT ON public.movimiento_caja
FOR EACH ROW EXECUTE FUNCTION public.fn_auditar_cambio_critico();

DROP TRIGGER IF EXISTS tr_auditoria_venta_insert ON public.venta;
CREATE TRIGGER tr_auditoria_venta_insert
AFTER INSERT ON public.venta
FOR EACH ROW EXECUTE FUNCTION public.fn_auditar_cambio_critico();

DROP TRIGGER IF EXISTS tr_auditoria_nota_credito_insert ON public.nota_credito;
CREATE TRIGGER tr_auditoria_nota_credito_insert
AFTER INSERT ON public.nota_credito
FOR EACH ROW EXECUTE FUNCTION public.fn_auditar_cambio_critico();

DROP TRIGGER IF EXISTS tr_auditoria_pedido_update ON public.pedido;
CREATE TRIGGER tr_auditoria_pedido_update
AFTER UPDATE ON public.pedido
FOR EACH ROW EXECUTE FUNCTION public.fn_auditar_cambio_critico();

REVOKE ALL ON FUNCTION public.fn_auditar_cambio_critico() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fn_auditar_cierre_caja() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.auditoria FROM PUBLIC, anon, authenticated, service_role;
REVOKE ALL ON SEQUENCE public.auditoria_id_auditoria_seq FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.fn_auditar_cambio_critico() TO service_role;
GRANT EXECUTE ON FUNCTION public.fn_auditar_cierre_caja() TO service_role;
GRANT EXECUTE ON FUNCTION public.fn_asignar_permisos_rol(integer, integer[], character varying, character varying) TO service_role;
GRANT SELECT, INSERT, UPDATE ON TABLE public.auditoria TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.auditoria_id_auditoria_seq TO service_role;

NOTIFY pgrst, 'reload schema';