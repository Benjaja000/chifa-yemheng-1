-- =============================================================
-- Patch: permisos CRUD Unidades de medida + Tipos de mesa
--   (UNIDAD_*, TMESA_*) — segmento S2 (catálogos admin).
-- BD: RESTAURANTEV3 — correr en SQL Editor (Run).
-- Idempotente: solo inserta lo que no existe (clave / par rol-permiso).
-- UNIDAD_* → módulo CARTA (catálogo usado por producto.id_unidad).
-- TMESA_*  → módulo MESAS (catálogo usado por mesa.id_tipomesa).
-- Roles: ADMINISTRADOR + SUPERVISOR.
-- =============================================================

-- ---------- 1. PERMISOS ----------
INSERT INTO public.permiso (id_modulo, n_permiso, clave, descripcion)
SELECT m.id_modulo, v.n_permiso, v.clave, v.descripcion
FROM (VALUES
  ('CARTA', 'Ver unidades',           'UNIDAD_VER',      'Listar unidades de medida'),
  ('CARTA', 'Crear unidades',         'UNIDAD_CREAR',    'Registrar unidad de medida'),
  ('CARTA', 'Editar unidades',        'UNIDAD_EDITAR',   'Editar unidad de medida'),
  ('CARTA', 'Eliminar unidades',      'UNIDAD_ELIMINAR', 'Activar/desactivar unidad'),
  ('MESAS', 'Ver tipos de mesa',      'TMESA_VER',       'Listar tipos de mesa'),
  ('MESAS', 'Crear tipos de mesa',    'TMESA_CREAR',     'Registrar tipo de mesa'),
  ('MESAS', 'Editar tipos de mesa',   'TMESA_EDITAR',    'Editar tipo de mesa'),
  ('MESAS', 'Eliminar tipos de mesa', 'TMESA_ELIMINAR',  'Activar/desactivar tipo de mesa')
) AS v(modulo, n_permiso, clave, descripcion)
JOIN public.modulo m ON m.n_modulo = v.modulo
WHERE NOT EXISTS (
  SELECT 1 FROM public.permiso p WHERE p.clave = v.clave
);

-- ---------- 2. MATRIZ ROL_PERMISO ----------
INSERT INTO public.rol_permiso (id_rol, id_permiso, concedido)
SELECT r.id_rol, p.id_permiso, 'S'
FROM public.rol r
CROSS JOIN public.permiso p
WHERE r.n_rol IN ('ADMINISTRADOR', 'SUPERVISOR')
  AND p.clave IN ('UNIDAD_VER','UNIDAD_CREAR','UNIDAD_EDITAR','UNIDAD_ELIMINAR',
                  'TMESA_VER','TMESA_CREAR','TMESA_EDITAR','TMESA_ELIMINAR')
  AND NOT EXISTS (
    SELECT 1 FROM public.rol_permiso x
    WHERE x.id_rol = r.id_rol AND x.id_permiso = p.id_permiso
  );

-- ---------- 3. VERIFICACION ----------
-- SELECT clave FROM public.permiso
--  WHERE clave LIKE 'UNIDAD\_%' OR clave LIKE 'TMESA\_%';
-- Esperado: 8 filas.
