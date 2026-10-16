-- =============================================================
-- Patch: permisos CRUD Unidades de medida (UNI_*)
-- BD: RESTAURANTEV3 — correr en SQL Editor (Run).
-- Idempotente: solo inserta lo que no existe (por clave / par rol-permiso).
-- UNI_* → módulo MANTENIMIENTO (catálogos maestros, igual que CAT_*).
-- Roles: ADMINISTRADOR (acceso total) + SUPERVISOR (según specs).
-- =============================================================

-- ---------- 1. PERMISOS ----------
INSERT INTO public.permiso (id_modulo, n_permiso, clave, descripcion)
SELECT m.id_modulo, v.n_permiso, v.clave, v.descripcion
FROM (VALUES
  ('MANTENIMIENTO', 'Ver unidades',     'UNI_VER',      'Listar unidades de medida (tab Unidades en productos)'),
  ('MANTENIMIENTO', 'Crear unidades',   'UNI_CREAR',    'Registrar unidad de medida'),
  ('MANTENIMIENTO', 'Editar unidades',  'UNI_EDITAR',   'Editar unidad de medida'),
  ('MANTENIMIENTO', 'Eliminar unidades','UNI_ELIMINAR', 'Activar/desactivar unidad de medida')
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
  AND p.clave IN ('UNI_VER','UNI_CREAR','UNI_EDITAR','UNI_ELIMINAR')
  AND NOT EXISTS (
    SELECT 1 FROM public.rol_permiso x
    WHERE x.id_rol = r.id_rol AND x.id_permiso = p.id_permiso
  );

-- ---------- 3. VERIFICACION ----------
-- SELECT clave FROM public.permiso WHERE clave LIKE 'UNI\_%';
-- Esperado: 4 filas.
