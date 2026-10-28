ALTER TABLE public.usuario
  ADD COLUMN IF NOT EXISTS auth_version integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS motivo_ultimo_cambio varchar(500);

ALTER TABLE public.rol
  ADD COLUMN IF NOT EXISTS motivo_ultimo_cambio varchar(500);

ALTER TABLE public.rol_permiso
  ADD COLUMN IF NOT EXISTS motivo_ultimo_cambio varchar(500);

CREATE OR REPLACE FUNCTION public.fn_usuario_tiene_permiso_seguridad(
  p_id_usuario integer,
  p_clave text
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.usuario AS u
    JOIN public.empleado AS e
      ON e.id_empleado = u.id_empleado
     AND e.estado = 'A'
     AND (e.f_cese IS NULL OR e.f_cese > CURRENT_DATE)
    JOIN public.usuario_rol AS ur
      ON ur.id_usuario = u.id_usuario
     AND ur.estado = 'A'
     AND ur.vigente = 'S'
    JOIN public.rol AS r
      ON r.id_rol = ur.id_rol
     AND r.estado = 'A'
    JOIN public.rol_permiso AS rp
      ON rp.id_rol = r.id_rol
     AND rp.estado = 'A'
     AND rp.concedido = 'S'
    JOIN public.permiso AS p
      ON p.id_permiso = rp.id_permiso
     AND p.estado = 'A'
    WHERE u.id_usuario = p_id_usuario
      AND u.estado = 'A'
      AND u.bloqueado = 'N'
      AND p.clave = p_clave
  );
$$;

CREATE OR REPLACE FUNCTION public.fn_hay_administrador_activo(
  p_excluir_usuario integer DEFAULT NULL,
  p_excluir_empleado integer DEFAULT NULL,
  p_excluir_rol integer DEFAULT NULL,
  p_excluir_rolpermiso integer DEFAULT NULL
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
  SELECT EXISTS (
    SELECT u.id_usuario
    FROM public.usuario AS u
    JOIN public.tipo_usuario AS tu
      ON tu.id_tipousuario = u.id_tipousuario
     AND tu.estado = 'A'
     AND tu.n_tipousuario = 'ADMINISTRADOR'
    JOIN public.empleado AS e
      ON e.id_empleado = u.id_empleado
     AND e.estado = 'A'
     AND (e.f_cese IS NULL OR e.f_cese > CURRENT_DATE)
    JOIN public.usuario_rol AS ur
      ON ur.id_usuario = u.id_usuario
     AND ur.estado = 'A'
     AND ur.vigente = 'S'
    JOIN public.rol AS r
      ON r.id_rol = ur.id_rol
     AND r.estado = 'A'
     AND r.n_rol = 'ADMINISTRADOR'
    JOIN public.rol_permiso AS rp
      ON rp.id_rol = r.id_rol
     AND rp.estado = 'A'
     AND rp.concedido = 'S'
     AND rp.id_rolpermiso IS DISTINCT FROM p_excluir_rolpermiso
    JOIN public.permiso AS p
      ON p.id_permiso = rp.id_permiso
     AND p.estado = 'A'
    WHERE u.estado = 'A'
      AND u.bloqueado = 'N'
      AND u.id_usuario IS DISTINCT FROM p_excluir_usuario
      AND e.id_empleado IS DISTINCT FROM p_excluir_empleado
      AND r.id_rol IS DISTINCT FROM p_excluir_rol
      AND p.clave IN ('SEG_USUARIO', 'SEG_ROL')
    GROUP BY u.id_usuario
    HAVING COUNT(DISTINCT p.clave) = 2
  );
$$;

CREATE OR REPLACE FUNCTION public.fn_usuario_es_administrador_activo(p_id_usuario integer)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
  SELECT EXISTS (
       SELECT u.id_usuario
       FROM public.usuario AS u
       JOIN public.tipo_usuario AS tu
         ON tu.id_tipousuario = u.id_tipousuario
        AND tu.estado = 'A'
        AND tu.n_tipousuario = 'ADMINISTRADOR'
       JOIN public.empleado AS e
         ON e.id_empleado = u.id_empleado
        AND e.estado = 'A'
        AND (e.f_cese IS NULL OR e.f_cese > CURRENT_DATE)
       JOIN public.usuario_rol AS ur
         ON ur.id_usuario = u.id_usuario
        AND ur.estado = 'A'
        AND ur.vigente = 'S'
       JOIN public.rol AS r
         ON r.id_rol = ur.id_rol
        AND r.estado = 'A'
        AND r.n_rol = 'ADMINISTRADOR'
       JOIN public.rol_permiso AS rp
         ON rp.id_rol = r.id_rol
        AND rp.estado = 'A'
        AND rp.concedido = 'S'
       JOIN public.permiso AS p
         ON p.id_permiso = rp.id_permiso
        AND p.estado = 'A'
       WHERE u.id_usuario = p_id_usuario
         AND u.estado = 'A'
         AND u.bloqueado = 'N'
         AND p.clave IN ('SEG_USUARIO', 'SEG_ROL')
       GROUP BY u.id_usuario
       HAVING COUNT(DISTINCT p.clave) = 2
     );
$$;

CREATE OR REPLACE FUNCTION public.fn_controlar_usuario_seguridad()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_empleado_estado character(1);
  v_f_cese date;
  v_actor_logeo text;
  v_actor_id integer;
  v_cambio_acceso boolean;
  v_es_admin_objetivo boolean;
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_cambio_acceso := true;
  ELSE
    v_cambio_acceso := OLD.id_tipousuario IS DISTINCT FROM NEW.id_tipousuario
      OR OLD.id_empleado IS DISTINCT FROM NEW.id_empleado
      OR OLD.estado IS DISTINCT FROM NEW.estado
      OR OLD.bloqueado IS DISTINCT FROM NEW.bloqueado
      OR OLD.clave IS DISTINCT FROM NEW.clave;
  END IF;

  IF TG_OP = 'INSERT' THEN
    SELECT e.estado, e.f_cese
    INTO v_empleado_estado, v_f_cese
    FROM public.empleado AS e
    WHERE e.id_empleado = NEW.id_empleado
    FOR SHARE;

    IF NOT FOUND
       OR v_empleado_estado <> 'A'
       OR (v_f_cese IS NOT NULL AND v_f_cese <= CURRENT_DATE) THEN
      RAISE EXCEPTION USING MESSAGE = 'EMPLEADO_INACTIVO';
    END IF;
  ELSIF OLD.id_empleado IS DISTINCT FROM NEW.id_empleado
        OR (OLD.estado IS DISTINCT FROM NEW.estado AND NEW.estado = 'A') THEN
    SELECT e.estado, e.f_cese
    INTO v_empleado_estado, v_f_cese
    FROM public.empleado AS e
    WHERE e.id_empleado = NEW.id_empleado
    FOR SHARE;

    IF NOT FOUND
       OR v_empleado_estado <> 'A'
       OR (v_f_cese IS NOT NULL AND v_f_cese <= CURRENT_DATE) THEN
      RAISE EXCEPTION USING MESSAGE = 'EMPLEADO_INACTIVO';
    END IF;
  END IF;

  IF current_user NOT IN ('postgres', 'supabase_admin')
     AND current_setting('app.audit_auto_user_disable', true) IS DISTINCT FROM 'on'
     AND v_cambio_acceso THEN
    v_actor_logeo := CASE WHEN TG_OP = 'INSERT' THEN NEW.usucre ELSE NEW.usumod END;
    SELECT u.id_usuario
    INTO v_actor_id
    FROM public.usuario AS u
    WHERE u.logeo = v_actor_logeo
      AND u.estado = 'A'
      AND u.bloqueado = 'N'
    LIMIT 1;

    IF v_actor_id IS NULL
       OR NOT public.fn_usuario_tiene_permiso_seguridad(v_actor_id, 'SEG_USUARIO') THEN
      RAISE EXCEPTION USING MESSAGE = 'FORBIDDEN';
    END IF;

    SELECT tu.n_tipousuario = 'ADMINISTRADOR'
    INTO v_es_admin_objetivo
    FROM public.tipo_usuario AS tu
    WHERE tu.id_tipousuario = NEW.id_tipousuario;
    IF COALESCE(v_es_admin_objetivo, false)
       AND NOT public.fn_usuario_es_administrador_activo(v_actor_id) THEN
      RAISE EXCEPTION USING MESSAGE = 'FORBIDDEN';
    END IF;

    IF TG_OP = 'UPDATE' THEN
      IF public.fn_usuario_es_administrador_activo(OLD.id_usuario)
         AND NOT public.fn_usuario_es_administrador_activo(v_actor_id) THEN
        RAISE EXCEPTION USING MESSAGE = 'FORBIDDEN';
      END IF;
      IF v_actor_id = OLD.id_usuario THEN
        RAISE EXCEPTION USING MESSAGE = 'AUTO_MODIFICACION_PROHIBIDA';
      END IF;
      IF v_cambio_acceso
         AND length(btrim(COALESCE(NEW.motivo_ultimo_cambio, ''))) < 8 THEN
        RAISE EXCEPTION USING MESSAGE = 'MOTIVO_REQUERIDO';
      END IF;
    END IF;
  END IF;

  SELECT tu.n_tipousuario = 'ADMINISTRADOR'
  INTO v_es_admin_objetivo
  FROM public.tipo_usuario AS tu
  WHERE tu.id_tipousuario = NEW.id_tipousuario;
  IF TG_OP = 'INSERT' AND COALESCE(v_es_admin_objetivo, false) THEN
    PERFORM pg_advisory_xact_lock(724310, 1);
  ELSIF TG_OP = 'UPDATE'
        AND (
          COALESCE(v_es_admin_objetivo, false)
          OR public.fn_usuario_es_administrador_activo(OLD.id_usuario)
        ) THEN
    PERFORM pg_advisory_xact_lock(724310, 1);
  END IF;
  IF current_user NOT IN ('postgres', 'supabase_admin') THEN
    IF TG_OP = 'INSERT' AND COALESCE(v_es_admin_objetivo, false) THEN
      IF NOT public.fn_usuario_es_administrador_activo(v_actor_id) THEN
        RAISE EXCEPTION USING MESSAGE = 'FORBIDDEN';
      END IF;
    ELSIF TG_OP = 'UPDATE' THEN
      IF COALESCE(v_es_admin_objetivo, false)
         OR public.fn_usuario_es_administrador_activo(OLD.id_usuario) THEN
        IF NOT public.fn_usuario_es_administrador_activo(v_actor_id) THEN
          RAISE EXCEPTION USING MESSAGE = 'FORBIDDEN';
        END IF;
      END IF;
    END IF;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF public.fn_usuario_es_administrador_activo(OLD.id_usuario)
       AND (
         OLD.id_tipousuario IS DISTINCT FROM NEW.id_tipousuario
         OR NEW.estado <> 'A'
         OR NEW.bloqueado = 'S'
       ) THEN
      PERFORM pg_advisory_xact_lock(724310, 1);
      IF NOT public.fn_hay_administrador_activo(OLD.id_usuario, NULL, NULL, NULL) THEN
        RAISE EXCEPTION USING MESSAGE = 'ULTIMO_ADMINISTRADOR';
      END IF;
    END IF;
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.auth_version := COALESCE(NEW.auth_version, 0);
  ELSE
    NEW.auth_version := GREATEST(OLD.auth_version, COALESCE(NEW.auth_version, OLD.auth_version));
    IF OLD.id_tipousuario IS DISTINCT FROM NEW.id_tipousuario
       OR OLD.id_empleado IS DISTINCT FROM NEW.id_empleado
       OR OLD.estado IS DISTINCT FROM NEW.estado
       OR OLD.bloqueado IS DISTINCT FROM NEW.bloqueado
       OR OLD.clave IS DISTINCT FROM NEW.clave THEN
      NEW.auth_version := OLD.auth_version + 1;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.fn_proteger_admin_al_cese_empleado()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF (NEW.estado <> 'A' OR (NEW.f_cese IS NOT NULL AND NEW.f_cese <= CURRENT_DATE))
     AND (
       OLD.estado = 'A'
       AND (OLD.f_cese IS NULL OR OLD.f_cese > CURRENT_DATE)
     )
     AND EXISTS (
       SELECT 1
       FROM public.usuario AS u
       JOIN public.tipo_usuario AS tu
         ON tu.id_tipousuario = u.id_tipousuario
        AND tu.n_tipousuario = 'ADMINISTRADOR'
       WHERE u.id_empleado = OLD.id_empleado
         AND u.estado = 'A'
         AND u.bloqueado = 'N'
         AND public.fn_usuario_es_administrador_activo(u.id_usuario)
     ) THEN
    PERFORM pg_advisory_xact_lock(724310, 1);
    IF NOT public.fn_hay_administrador_activo(NULL, OLD.id_empleado, NULL, NULL) THEN
      RAISE EXCEPTION USING MESSAGE = 'ULTIMO_ADMINISTRADOR';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.fn_desactivar_usuario_al_cese_empleado()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF (NEW.estado <> 'A' OR (NEW.f_cese IS NOT NULL AND NEW.f_cese <= CURRENT_DATE))
     AND (
       OLD.estado IS DISTINCT FROM NEW.estado
       OR OLD.f_cese IS DISTINCT FROM NEW.f_cese
     ) THEN
    PERFORM set_config('app.audit_auto_user_disable', 'on', true);
    UPDATE public.usuario AS u
    SET estado = 'I',
        motivo_ultimo_cambio = 'Desactivación automática al finalizar el vínculo laboral',
        usumod = COALESCE(NULLIF(NEW.usumod, ''), current_user),
        pcmod = NEW.pcmod,
        fecmod = CURRENT_TIMESTAMP
    WHERE u.id_empleado = NEW.id_empleado
      AND u.estado = 'A';
    PERFORM set_config('app.audit_auto_user_disable', 'off', true);
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.fn_proteger_rol_administrador()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_actor_logeo text;
  v_actor_id integer;
  v_rol_nombre text;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_rol_nombre := OLD.n_rol;
    v_actor_logeo := COALESCE(
      NULLIF(current_setting('app.audit_actor_logeo', true), ''),
      NULLIF(OLD.usumod, ''),
      NULLIF(OLD.usucre, '')
    );
  ELSE
    v_rol_nombre := NEW.n_rol;
    v_actor_logeo := COALESCE(
      NULLIF(current_setting('app.audit_actor_logeo', true), ''),
      NULLIF(NEW.usumod, ''),
      NULLIF(NEW.usucre, '')
    );
  END IF;

  SELECT u.id_usuario INTO v_actor_id
  FROM public.usuario AS u
  WHERE u.logeo = v_actor_logeo
    AND u.estado = 'A'
    AND u.bloqueado = 'N'
  LIMIT 1;
  IF current_user NOT IN ('postgres', 'supabase_admin')
     AND NOT public.fn_usuario_tiene_permiso_seguridad(v_actor_id, 'SEG_ROL') THEN
    RAISE EXCEPTION USING MESSAGE = 'FORBIDDEN';
  END IF;
  IF current_user NOT IN ('postgres', 'supabase_admin') THEN
    IF v_rol_nombre = 'ADMINISTRADOR'
       AND NOT public.fn_usuario_es_administrador_activo(v_actor_id) THEN
      RAISE EXCEPTION USING MESSAGE = 'FORBIDDEN';
    END IF;
    IF TG_OP = 'UPDATE' THEN
      IF OLD.n_rol = 'ADMINISTRADOR'
         AND NOT public.fn_usuario_es_administrador_activo(v_actor_id) THEN
        RAISE EXCEPTION USING MESSAGE = 'FORBIDDEN';
      END IF;
    END IF;
  END IF;

  IF TG_OP = 'DELETE' THEN
    IF OLD.n_rol = 'ADMINISTRADOR' THEN
      PERFORM pg_advisory_xact_lock(724310, 1);
      IF NOT public.fn_hay_administrador_activo(NULL, NULL, OLD.id_rol, NULL) THEN
        RAISE EXCEPTION USING MESSAGE = 'ULTIMO_ADMINISTRADOR';
      END IF;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.n_rol = 'ADMINISTRADOR'
       AND (NEW.n_rol IS DISTINCT FROM OLD.n_rol OR NEW.estado <> 'A') THEN
      PERFORM pg_advisory_xact_lock(724310, 1);
      IF NOT public.fn_hay_administrador_activo(NULL, NULL, OLD.id_rol, NULL) THEN
        RAISE EXCEPTION USING MESSAGE = 'ULTIMO_ADMINISTRADOR';
      END IF;
    END IF;
  END IF;
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.fn_proteger_permiso_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_rol integer;
  v_rol_nombre text;
  v_clave text;
  v_quita_permiso boolean;
  v_actor_logeo text;
  v_actor_id integer;
BEGIN
  IF TG_OP = 'UPDATE'
     AND (
       NEW.id_rol IS DISTINCT FROM OLD.id_rol
       OR NEW.id_permiso IS DISTINCT FROM OLD.id_permiso
     ) THEN
    RAISE EXCEPTION USING MESSAGE = 'FORBIDDEN';
  END IF;

  IF TG_OP = 'DELETE' THEN
    v_rol := OLD.id_rol;
    SELECT r.n_rol, p.clave
    INTO v_rol_nombre, v_clave
    FROM public.rol AS r
    JOIN public.permiso AS p ON p.id_permiso = OLD.id_permiso
    WHERE r.id_rol = OLD.id_rol;
    v_actor_logeo := COALESCE(
      NULLIF(current_setting('app.audit_actor_logeo', true), ''),
      NULLIF(OLD.usumod, ''),
      NULLIF(OLD.usucre, '')
    );
  ELSE
    v_rol := NEW.id_rol;
    SELECT r.n_rol, p.clave
    INTO v_rol_nombre, v_clave
    FROM public.rol AS r
    JOIN public.permiso AS p ON p.id_permiso = NEW.id_permiso
    WHERE r.id_rol = NEW.id_rol;
    v_actor_logeo := COALESCE(
      NULLIF(current_setting('app.audit_actor_logeo', true), ''),
      NULLIF(NEW.usumod, ''),
      NULLIF(NEW.usucre, '')
    );
  END IF;
  SELECT u.id_usuario INTO v_actor_id
  FROM public.usuario AS u
  WHERE u.logeo = v_actor_logeo
    AND u.estado = 'A'
    AND u.bloqueado = 'N'
  LIMIT 1;
  IF current_user NOT IN ('postgres', 'supabase_admin')
     AND NOT public.fn_usuario_tiene_permiso_seguridad(v_actor_id, 'SEG_ROL') THEN
    RAISE EXCEPTION USING MESSAGE = 'FORBIDDEN';
  END IF;
  IF v_rol_nombre = 'ADMINISTRADOR'
     AND current_user NOT IN ('postgres', 'supabase_admin')
     AND NOT public.fn_usuario_es_administrador_activo(v_actor_id) THEN
    RAISE EXCEPTION USING MESSAGE = 'FORBIDDEN';
  END IF;

  IF TG_OP <> 'DELETE' THEN
    IF NEW.estado = 'A'
       AND NEW.concedido = 'S'
       AND NOT public.fn_usuario_tiene_permiso_seguridad(v_actor_id, v_clave)
       AND NOT EXISTS (
         SELECT 1
         FROM public.rol_permiso AS existente
         WHERE existente.id_rol = NEW.id_rol
           AND existente.id_permiso = NEW.id_permiso
           AND existente.estado = 'A'
           AND existente.concedido = 'S'
           AND (TG_OP <> 'UPDATE' OR existente.id_rolpermiso <> NEW.id_rolpermiso)
       ) THEN
      RAISE EXCEPTION USING MESSAGE = 'PRIVILEGE_ESCALATION';
    END IF;
  END IF;

  IF TG_OP = 'DELETE' THEN
    v_quita_permiso := true;
  ELSE
    v_quita_permiso := NEW.estado <> 'A' OR NEW.concedido <> 'S';
  END IF;

  IF v_rol_nombre = 'ADMINISTRADOR'
     AND v_clave IN ('SEG_USUARIO', 'SEG_ROL') THEN
    PERFORM pg_advisory_xact_lock(724310, 1);
    IF v_quita_permiso THEN
      IF TG_OP = 'INSERT' THEN
        RAISE EXCEPTION USING MESSAGE = 'ULTIMO_ADMINISTRADOR';
      ELSIF NOT public.fn_hay_administrador_activo(
        NULL,
        NULL,
        NULL,
        OLD.id_rolpermiso
      ) THEN
        RAISE EXCEPTION USING MESSAGE = 'ULTIMO_ADMINISTRADOR';
      END IF;
    END IF;
  END IF;
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.fn_proteger_asignacion_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_role_name text;
  v_quita_asignacion boolean;
  v_actor_logeo text;
  v_actor_id integer;
  v_rol_anterior text;
  v_asigna_admin boolean;
BEGIN
  IF TG_OP = 'DELETE' THEN
    SELECT r.n_rol INTO v_role_name
    FROM public.rol AS r WHERE r.id_rol = OLD.id_rol;
    v_actor_logeo := COALESCE(
      NULLIF(current_setting('app.audit_actor_logeo', true), ''),
      NULLIF(OLD.usumod, ''),
      NULLIF(OLD.usucre, '')
    );
  ELSE
    SELECT r.n_rol INTO v_role_name
    FROM public.rol AS r WHERE r.id_rol = NEW.id_rol;
    v_actor_logeo := COALESCE(
      NULLIF(current_setting('app.audit_actor_logeo', true), ''),
      NULLIF(NEW.usumod, ''),
      NULLIF(NEW.usucre, '')
    );
  END IF;

  SELECT u.id_usuario INTO v_actor_id
  FROM public.usuario AS u
  WHERE u.logeo = v_actor_logeo
    AND u.estado = 'A'
    AND u.bloqueado = 'N'
  LIMIT 1;
  IF current_user NOT IN ('postgres', 'supabase_admin')
     AND NOT public.fn_usuario_tiene_permiso_seguridad(v_actor_id, 'SEG_ROL') THEN
    RAISE EXCEPTION USING MESSAGE = 'FORBIDDEN';
  END IF;

  IF TG_OP <> 'INSERT' THEN
    SELECT r.n_rol INTO v_rol_anterior
    FROM public.rol AS r
    WHERE r.id_rol = OLD.id_rol;
  END IF;

  IF TG_OP = 'DELETE' THEN
    v_asigna_admin := false;
  ELSE
    v_asigna_admin := v_role_name = 'ADMINISTRADOR'
      AND NEW.estado = 'A'
      AND NEW.vigente = 'S';
  END IF;
  IF v_asigna_admin THEN
    PERFORM pg_advisory_xact_lock(724310, 1);
    IF current_user NOT IN ('postgres', 'supabase_admin')
       AND NOT public.fn_usuario_es_administrador_activo(v_actor_id) THEN
      RAISE EXCEPTION USING MESSAGE = 'FORBIDDEN';
    END IF;
  END IF;

  IF TG_OP = 'DELETE' THEN
    v_quita_asignacion := true;
  ELSIF TG_OP = 'UPDATE' THEN
    v_quita_asignacion := NEW.id_usuario IS DISTINCT FROM OLD.id_usuario
      OR NEW.id_rol IS DISTINCT FROM OLD.id_rol
      OR NEW.estado <> 'A'
      OR NEW.vigente <> 'S';
  ELSE
    v_quita_asignacion := false;
  END IF;

  IF TG_OP <> 'INSERT' THEN
    IF v_rol_anterior = 'ADMINISTRADOR' AND v_quita_asignacion THEN
      PERFORM pg_advisory_xact_lock(724310, 1);
      IF current_user NOT IN ('postgres', 'supabase_admin')
         AND NOT public.fn_usuario_es_administrador_activo(v_actor_id) THEN
        RAISE EXCEPTION USING MESSAGE = 'FORBIDDEN';
      END IF;
      IF OLD.estado = 'A'
         AND OLD.vigente = 'S'
         AND public.fn_usuario_es_administrador_activo(OLD.id_usuario) THEN
        IF NOT public.fn_hay_administrador_activo(OLD.id_usuario, NULL, NULL, NULL) THEN
          RAISE EXCEPTION USING MESSAGE = 'ULTIMO_ADMINISTRADOR';
        END IF;
      END IF;
    END IF;
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.fn_invalidar_sesiones_por_cambio_rol()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_rol integer;
BEGIN
  IF TG_OP <> 'INSERT' THEN
    v_rol := OLD.id_rol;
    UPDATE public.usuario AS u
    SET auth_version = u.auth_version + 1
    FROM public.usuario_rol AS ur
    WHERE ur.id_usuario = u.id_usuario
      AND ur.id_rol = v_rol
      AND ur.estado = 'A'
      AND ur.vigente = 'S'
      AND TG_OP = 'DELETE';
  END IF;
  IF TG_OP = 'UPDATE' THEN
    IF OLD.id_rol IS DISTINCT FROM NEW.id_rol THEN
      v_rol := OLD.id_rol;
      UPDATE public.usuario AS u
      SET auth_version = u.auth_version + 1
      FROM public.usuario_rol AS ur
      WHERE ur.id_usuario = u.id_usuario
        AND ur.id_rol = v_rol
        AND ur.estado = 'A'
        AND ur.vigente = 'S';
    END IF;
  END IF;
  IF TG_OP <> 'DELETE' THEN
    v_rol := NEW.id_rol;
    UPDATE public.usuario AS u
    SET auth_version = u.auth_version + 1
    FROM public.usuario_rol AS ur
    WHERE ur.id_usuario = u.id_usuario
      AND ur.id_rol = v_rol
      AND ur.estado = 'A'
      AND ur.vigente = 'S';
  END IF;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.fn_invalidar_sesion_por_asignacion_rol()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF TG_OP <> 'INSERT' THEN
    UPDATE public.usuario
    SET auth_version = auth_version + 1
    WHERE id_usuario = OLD.id_usuario;
  END IF;
  IF TG_OP = 'INSERT' THEN
    UPDATE public.usuario
    SET auth_version = auth_version + 1
    WHERE id_usuario = NEW.id_usuario;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.id_usuario IS DISTINCT FROM OLD.id_usuario THEN
      UPDATE public.usuario
      SET auth_version = auth_version + 1
      WHERE id_usuario = NEW.id_usuario;
    END IF;
  END IF;
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.fn_auditar_motivo_seguridad()
RETURNS trigger
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_id_usuario integer;
  v_id_registro integer;
  v_actor_logeo text;
  v_tabla varchar(50);
  v_accion varchar(20);
  v_motivo text;
  v_terminal text;
  v_cambio_relevante boolean := false;
BEGIN
  v_actor_logeo := COALESCE(
    NULLIF(to_jsonb(NEW) ->> 'usumod', ''),
    NULLIF(to_jsonb(NEW) ->> 'usucre', '')
  );
  v_motivo := NULLIF(btrim(to_jsonb(NEW) ->> 'motivo_ultimo_cambio'), '');
  v_terminal := LEFT(COALESCE(
    NULLIF(to_jsonb(NEW) ->> 'pcmod', ''),
    NULLIF(to_jsonb(NEW) ->> 'pccre', '')
  ), 30);

  IF TG_TABLE_NAME = 'usuario' THEN
    v_tabla := 'USUARIO';
    v_id_registro := COALESCE((to_jsonb(NEW) ->> 'id_usuario')::integer, 0);
    IF TG_OP = 'INSERT' THEN
      v_cambio_relevante := v_motivo IS NOT NULL;
      v_accion := 'CREACION_USUARIO';
    ELSE
      v_cambio_relevante := OLD.id_tipousuario IS DISTINCT FROM NEW.id_tipousuario
        OR OLD.id_empleado IS DISTINCT FROM NEW.id_empleado
        OR OLD.estado IS DISTINCT FROM NEW.estado
        OR OLD.bloqueado IS DISTINCT FROM NEW.bloqueado
        OR OLD.clave IS DISTINCT FROM NEW.clave
        OR OLD.motivo_ultimo_cambio IS DISTINCT FROM NEW.motivo_ultimo_cambio;
      v_accion := CASE
        WHEN OLD.bloqueado = 'S' AND NEW.bloqueado = 'N' THEN 'DESBLOQUEO'
        WHEN OLD.estado = 'A' AND NEW.estado <> 'A' THEN 'DESACTIVACION'
        ELSE 'CAMBIO_ACCESO'
      END;
    END IF;
  ELSIF TG_TABLE_NAME = 'rol' THEN
    v_tabla := 'ROL';
    v_id_registro := COALESCE((to_jsonb(NEW) ->> 'id_rol')::integer, 0);
    IF TG_OP = 'INSERT' THEN
      v_cambio_relevante := v_motivo IS NOT NULL;
      v_accion := 'CREACION_ROL';
    ELSE
      v_cambio_relevante := OLD.n_rol IS DISTINCT FROM NEW.n_rol
        OR OLD.descripcion IS DISTINCT FROM NEW.descripcion
        OR OLD.estado IS DISTINCT FROM NEW.estado
        OR OLD.motivo_ultimo_cambio IS DISTINCT FROM NEW.motivo_ultimo_cambio;
      v_accion := 'CAMBIO_ROL';
    END IF;
  ELSE
    v_tabla := 'ROL_PERMISO';
    IF TG_OP = 'INSERT' THEN
      v_id_registro := COALESCE((to_jsonb(NEW) ->> 'id_rolpermiso')::integer, 0);
      v_cambio_relevante := true;
    ELSE
      v_id_registro := COALESCE((to_jsonb(NEW) ->> 'id_rolpermiso')::integer, (to_jsonb(OLD) ->> 'id_rolpermiso')::integer, 0);
      v_cambio_relevante := OLD.id_rol IS DISTINCT FROM NEW.id_rol
        OR OLD.id_permiso IS DISTINCT FROM NEW.id_permiso
        OR OLD.concedido IS DISTINCT FROM NEW.concedido
        OR OLD.estado IS DISTINCT FROM NEW.estado
        OR OLD.motivo_ultimo_cambio IS DISTINCT FROM NEW.motivo_ultimo_cambio;
    END IF;
    v_accion := 'ASIGNACION_PERMISOS';
  END IF;

  IF NOT v_cambio_relevante OR v_motivo IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT u.id_usuario
  INTO v_id_usuario
  FROM public.usuario AS u
  WHERE u.logeo = v_actor_logeo
  LIMIT 1;

  INSERT INTO public.auditoria (
    id_usuario, n_tabla, accion, id_registro, valor_anterior, valor_nuevo, terminal
  )
  VALUES (
    v_id_usuario,
    v_tabla,
    v_accion,
    v_id_registro,
    CASE WHEN TG_OP = 'INSERT' THEN NULL
      ELSE jsonb_build_object('motivo', OLD.motivo_ultimo_cambio)::text END,
    jsonb_build_object('motivo', v_motivo)::text,
    v_terminal
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.fn_asignar_permisos_rol_seguridad(
  p_rol integer,
  p_permisos integer[],
  p_usuario character varying,
  p_pc character varying,
  p_motivo text,
  p_actor_usuario integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_permisos integer[] := COALESCE(p_permisos, ARRAY[]::integer[]);
  v_nombre_rol text;
BEGIN
  IF length(btrim(COALESCE(p_motivo, ''))) < 8 THEN
    RAISE EXCEPTION USING MESSAGE = 'MOTIVO_REQUERIDO';
  END IF;
  IF NOT public.fn_usuario_tiene_permiso_seguridad(p_actor_usuario, 'SEG_ROL') THEN
    RAISE EXCEPTION USING MESSAGE = 'FORBIDDEN';
  END IF;

  PERFORM 1 FROM public.rol WHERE id_rol = p_rol FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING MESSAGE = 'ROL_NO_ENCONTRADO';
  END IF;
  SELECT n_rol INTO v_nombre_rol FROM public.rol WHERE id_rol = p_rol;

  IF v_nombre_rol = 'ADMINISTRADOR'
     AND NOT public.fn_usuario_es_administrador_activo(p_actor_usuario) THEN
    RAISE EXCEPTION USING MESSAGE = 'FORBIDDEN';
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

  IF EXISTS (
    SELECT 1
    FROM unnest(v_permisos) AS seleccionado(id_permiso)
    JOIN public.permiso AS permiso ON permiso.id_permiso = seleccionado.id_permiso
    WHERE NOT public.fn_usuario_tiene_permiso_seguridad(p_actor_usuario, permiso.clave)
      AND NOT EXISTS (
        SELECT 1
        FROM public.rol_permiso AS existente
        WHERE existente.id_rol = p_rol
          AND existente.id_permiso = seleccionado.id_permiso
          AND existente.estado = 'A'
          AND existente.concedido = 'S'
      )
  ) THEN
    RAISE EXCEPTION USING MESSAGE = 'PRIVILEGE_ESCALATION';
  END IF;

  PERFORM set_config('app.audit_actor_logeo', p_usuario, true);
  PERFORM set_config('app.audit_terminal', COALESCE(p_pc, ''), true);

  UPDATE public.rol_permiso
  SET concedido = 'N',
      estado = 'I',
      usumod = p_usuario,
      pcmod = p_pc,
      fecmod = CURRENT_TIMESTAMP,
      motivo_ultimo_cambio = p_motivo
  WHERE id_rol = p_rol
    AND estado = 'A'
    AND NOT (id_permiso = ANY(v_permisos));

  UPDATE public.rol_permiso
  SET concedido = 'S',
      estado = 'A',
      usumod = p_usuario,
      pcmod = p_pc,
      fecmod = CURRENT_TIMESTAMP,
      motivo_ultimo_cambio = p_motivo
  WHERE id_rol = p_rol
    AND id_permiso = ANY(v_permisos)
    AND (estado <> 'A' OR concedido <> 'S');

  INSERT INTO public.rol_permiso (
    id_rol, id_permiso, concedido, estado, usucre, pccre, motivo_ultimo_cambio
  )
  SELECT DISTINCT p_rol, seleccionado.id_permiso, 'S', 'A', p_usuario, p_pc, p_motivo
  FROM unnest(v_permisos) AS seleccionado(id_permiso)
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.rol_permiso AS existente
    WHERE existente.id_rol = p_rol
      AND existente.id_permiso = seleccionado.id_permiso
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.fn_guardar_rol_seguridad(
  p_id_rol integer,
  p_nombre character varying,
  p_descripcion character varying,
  p_estado character,
  p_permiso_ids integer[],
  p_actor_usuario integer,
  p_usuario character varying,
  p_pc character varying,
  p_motivo text
)
RETURNS integer
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_rol_id integer;
  v_rol_anterior text;
BEGIN
  IF length(btrim(COALESCE(p_motivo, ''))) < 8 THEN
    RAISE EXCEPTION USING MESSAGE = 'MOTIVO_REQUERIDO';
  END IF;
  IF NOT public.fn_usuario_tiene_permiso_seguridad(p_actor_usuario, 'SEG_ROL') THEN
    RAISE EXCEPTION USING MESSAGE = 'FORBIDDEN';
  END IF;

  PERFORM set_config('app.audit_actor_logeo', p_usuario, true);
  PERFORM set_config('app.audit_terminal', COALESCE(p_pc, ''), true);

  IF p_id_rol IS NULL THEN
    IF upper(btrim(p_nombre)) = 'ADMINISTRADOR'
       AND NOT public.fn_usuario_es_administrador_activo(p_actor_usuario) THEN
      RAISE EXCEPTION USING MESSAGE = 'FORBIDDEN';
    END IF;
    INSERT INTO public.rol (
      n_rol, descripcion, estado, usucre, pccre, motivo_ultimo_cambio
    )
    VALUES (
      btrim(p_nombre), NULLIF(btrim(p_descripcion), ''), p_estado,
      p_usuario, p_pc, p_motivo
    )
    RETURNING id_rol INTO v_rol_id;
  ELSE
    SELECT n_rol
    INTO v_rol_anterior
    FROM public.rol
    WHERE id_rol = p_id_rol
    FOR UPDATE;
    IF NOT FOUND THEN
      RAISE EXCEPTION USING MESSAGE = 'ROL_NO_ENCONTRADO';
    END IF;
    IF (v_rol_anterior = 'ADMINISTRADOR' OR upper(btrim(p_nombre)) = 'ADMINISTRADOR')
       AND NOT public.fn_usuario_es_administrador_activo(p_actor_usuario) THEN
      RAISE EXCEPTION USING MESSAGE = 'FORBIDDEN';
    END IF;
    UPDATE public.rol
    SET n_rol = btrim(p_nombre),
        descripcion = NULLIF(btrim(p_descripcion), ''),
        estado = p_estado,
        usumod = p_usuario,
        pcmod = p_pc,
        fecmod = CURRENT_TIMESTAMP,
        motivo_ultimo_cambio = p_motivo
    WHERE id_rol = p_id_rol;
    v_rol_id := p_id_rol;
  END IF;

  PERFORM public.fn_asignar_permisos_rol_seguridad(
    v_rol_id, p_permiso_ids, p_usuario, p_pc, p_motivo, p_actor_usuario
  );
  RETURN v_rol_id;
END;
$$;

DROP TRIGGER IF EXISTS tr_controlar_usuario_seguridad ON public.usuario;
CREATE TRIGGER tr_controlar_usuario_seguridad
BEFORE INSERT OR UPDATE ON public.usuario
FOR EACH ROW EXECUTE FUNCTION public.fn_controlar_usuario_seguridad();

DROP TRIGGER IF EXISTS tr_proteger_admin_al_cese_empleado ON public.empleado;
CREATE TRIGGER tr_proteger_admin_al_cese_empleado
BEFORE UPDATE OF estado, f_cese ON public.empleado
FOR EACH ROW EXECUTE FUNCTION public.fn_proteger_admin_al_cese_empleado();

DROP TRIGGER IF EXISTS tr_desactivar_usuario_al_cese_empleado ON public.empleado;
CREATE TRIGGER tr_desactivar_usuario_al_cese_empleado
AFTER UPDATE OF estado, f_cese ON public.empleado
FOR EACH ROW EXECUTE FUNCTION public.fn_desactivar_usuario_al_cese_empleado();

DROP TRIGGER IF EXISTS tr_proteger_rol_administrador ON public.rol;
CREATE TRIGGER tr_proteger_rol_administrador
BEFORE INSERT OR UPDATE OR DELETE ON public.rol
FOR EACH ROW EXECUTE FUNCTION public.fn_proteger_rol_administrador();

DROP TRIGGER IF EXISTS tr_proteger_permiso_admin ON public.rol_permiso;
CREATE TRIGGER tr_proteger_permiso_admin
BEFORE INSERT OR UPDATE OR DELETE ON public.rol_permiso
FOR EACH ROW EXECUTE FUNCTION public.fn_proteger_permiso_admin();

DROP TRIGGER IF EXISTS tr_proteger_asignacion_admin ON public.usuario_rol;
CREATE TRIGGER tr_proteger_asignacion_admin
BEFORE INSERT OR UPDATE OR DELETE ON public.usuario_rol
FOR EACH ROW EXECUTE FUNCTION public.fn_proteger_asignacion_admin();

DROP TRIGGER IF EXISTS tr_invalidar_sesiones_cambio_rol_permiso ON public.rol_permiso;
CREATE TRIGGER tr_invalidar_sesiones_cambio_rol_permiso
AFTER INSERT OR UPDATE OR DELETE ON public.rol_permiso
FOR EACH ROW EXECUTE FUNCTION public.fn_invalidar_sesiones_por_cambio_rol();

DROP TRIGGER IF EXISTS tr_invalidar_sesiones_cambio_rol ON public.rol;
CREATE TRIGGER tr_invalidar_sesiones_cambio_rol
AFTER UPDATE ON public.rol
FOR EACH ROW
WHEN (OLD.estado IS DISTINCT FROM NEW.estado OR OLD.n_rol IS DISTINCT FROM NEW.n_rol)
EXECUTE FUNCTION public.fn_invalidar_sesiones_por_cambio_rol();

DROP TRIGGER IF EXISTS tr_invalidar_sesion_asignacion_rol ON public.usuario_rol;
CREATE TRIGGER tr_invalidar_sesion_asignacion_rol
AFTER INSERT OR UPDATE OR DELETE ON public.usuario_rol
FOR EACH ROW EXECUTE FUNCTION public.fn_invalidar_sesion_por_asignacion_rol();

DROP TRIGGER IF EXISTS tr_auditar_motivo_usuario ON public.usuario;
CREATE TRIGGER tr_auditar_motivo_usuario
AFTER INSERT OR UPDATE ON public.usuario
FOR EACH ROW EXECUTE FUNCTION public.fn_auditar_motivo_seguridad();

DROP TRIGGER IF EXISTS tr_auditar_motivo_rol ON public.rol;
CREATE TRIGGER tr_auditar_motivo_rol
AFTER INSERT OR UPDATE ON public.rol
FOR EACH ROW EXECUTE FUNCTION public.fn_auditar_motivo_seguridad();

DROP TRIGGER IF EXISTS tr_auditar_motivo_rol_permiso ON public.rol_permiso;
CREATE TRIGGER tr_auditar_motivo_rol_permiso
AFTER INSERT OR UPDATE ON public.rol_permiso
FOR EACH ROW EXECUTE FUNCTION public.fn_auditar_motivo_seguridad();

CREATE OR REPLACE FUNCTION public.fn_login(p_logeo text, p_clave text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public, extensions
AS $$
DECLARE
  v_id integer;
  v_hash varchar(200);
  v_bloq char(1);
  r record;
BEGIN
  SELECT u.id_usuario, u.clave
  INTO v_id, v_hash
  FROM public.usuario AS u
  JOIN public.empleado AS e
    ON e.id_empleado = u.id_empleado
   AND e.estado = 'A'
   AND (e.f_cese IS NULL OR e.f_cese > CURRENT_DATE)
  WHERE u.logeo = p_logeo
    AND u.estado = 'A'
    AND u.bloqueado = 'N';

  IF v_id IS NULL THEN
    INSERT INTO public.auditoria (id_usuario, n_tabla, accion, valor_nuevo)
    VALUES (NULL, 'USUARIO', 'LOGIN_FALLIDO', 'Logeo: ' || p_logeo);
    RETURN json_build_object(
      'ok', false, 'id_usuario', 0, 'logeo', NULL,
      'tipo_usuario', NULL, 'empleado', NULL, 'cargo', NULL,
      'mensaje', 'Usuario inexistente, inactivo o bloqueado'
    );
  END IF;

  IF v_hash IS DISTINCT FROM encode(digest(p_clave, 'sha256'), 'hex') THEN
    UPDATE public.usuario
    SET intentos = intentos + 1,
        bloqueado = CASE WHEN intentos + 1 >= 3 THEN 'S' ELSE 'N' END,
        motivo_ultimo_cambio = CASE WHEN intentos + 1 >= 3
          THEN 'Bloqueo automático tras 3 intentos fallidos'
          ELSE motivo_ultimo_cambio END,
        usumod = current_user,
        pcmod = NULL,
        fecmod = CURRENT_TIMESTAMP
    WHERE id_usuario = v_id;

    INSERT INTO public.auditoria (id_usuario, n_tabla, accion, id_registro, valor_nuevo)
    VALUES (v_id, 'USUARIO', 'LOGIN_FALLIDO', v_id, 'Clave incorrecta');

    SELECT u.bloqueado INTO v_bloq FROM public.usuario AS u WHERE u.id_usuario = v_id;
    RETURN json_build_object(
      'ok', false, 'id_usuario', 0, 'logeo', NULL,
      'tipo_usuario', NULL, 'empleado', NULL, 'cargo', NULL,
      'mensaje', CASE WHEN v_bloq = 'S'
        THEN 'Usuario bloqueado tras 3 intentos. Contacte al administrador.'
        ELSE 'Clave incorrecta' END
    );
  END IF;

  UPDATE public.usuario
  SET intentos = 0,
      f_ultimoacceso = CURRENT_TIMESTAMP
  WHERE id_usuario = v_id;

  INSERT INTO public.auditoria (id_usuario, n_tabla, accion, id_registro, valor_nuevo)
  VALUES (v_id, 'USUARIO', 'LOGIN', v_id, 'Acceso correcto');

  SELECT v_id AS v_id,
         u.logeo,
         tu.n_tipousuario,
         pe.nombre || ' ' || COALESCE(pe.ap_paterno, '') AS nombre,
         ca.n_cargo
  INTO r
  FROM public.usuario AS u
  JOIN public.tipo_usuario AS tu ON tu.id_tipousuario = u.id_tipousuario
  JOIN public.empleado AS e ON e.id_empleado = u.id_empleado
  JOIN public.persona AS pe ON pe.id_persona = e.id_persona
  JOIN public.cargo AS ca ON ca.id_cargo = e.id_cargo
  WHERE u.id_usuario = v_id;

  RETURN json_build_object(
    'ok', true, 'id_usuario', r.v_id, 'logeo', r.logeo,
    'tipo_usuario', r.n_tipousuario, 'empleado', r.nombre, 'cargo', r.n_cargo,
    'mensaje', 'Acceso correcto'
  );
END;
$$;

DO $$
BEGIN
  IF to_regprocedure('public.fn_asignar_permisos_rol(integer,integer[],character varying,character varying)') IS NOT NULL THEN
    REVOKE ALL ON FUNCTION public.fn_asignar_permisos_rol(integer, integer[], character varying, character varying)
      FROM PUBLIC, anon, authenticated, service_role;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.fn_usuario_tiene_permiso_seguridad(integer, text)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fn_hay_administrador_activo(integer, integer, integer, integer)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fn_usuario_es_administrador_activo(integer)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fn_controlar_usuario_seguridad()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fn_proteger_admin_al_cese_empleado()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fn_desactivar_usuario_al_cese_empleado()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fn_proteger_rol_administrador()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fn_proteger_permiso_admin()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fn_proteger_asignacion_admin()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fn_invalidar_sesiones_por_cambio_rol()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fn_invalidar_sesion_por_asignacion_rol()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fn_auditar_motivo_seguridad()
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fn_asignar_permisos_rol_seguridad(integer, integer[], character varying, character varying, text, integer)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fn_guardar_rol_seguridad(integer, character varying, character varying, character, integer[], integer, character varying, character varying, text)
  FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.fn_usuario_tiene_permiso_seguridad(integer, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.fn_hay_administrador_activo(integer, integer, integer, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.fn_usuario_es_administrador_activo(integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.fn_asignar_permisos_rol_seguridad(integer, integer[], character varying, character varying, text, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.fn_guardar_rol_seguridad(integer, character varying, character varying, character, integer[], integer, character varying, character varying, text) TO service_role;
REVOKE ALL ON FUNCTION public.fn_login(text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.fn_login(text, text) TO service_role;

NOTIFY pgrst, 'reload schema';