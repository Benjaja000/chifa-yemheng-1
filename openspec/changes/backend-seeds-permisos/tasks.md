# Tareas: Seeds Permisos Idempotentes

## Spec y diseño
- [x] `proposal.md`, `design.md`, `tasks.md`, `specs/seeds-permisos.md`

## Backend
- [ ] Crear `openspec/changes/backend-seeds-permisos/specs/03_seeds_permisos.sql` (script idempotente completo)
- [ ] Verificar permisos en BD: `SELECT * FROM permiso WHERE clave IN (...)` y `SELECT * FROM rol_permiso rp JOIN rol r ON rp.id_rol=r.id_rol WHERE r.n_rol IN ('CAJERO','COCINA','MOZO','SUPERVISOR')`

## BD
- [ ] Ejecutar `03_seeds_permisos.sql` en Supabase Dashboard → SQL Editor
- [ ] Verificar: `SELECT r.n_rol, p.clave FROM rol_permiso rp JOIN rol r ON rp.id_rol = r.id_rol JOIN permiso p ON rp.id_permiso = p.id_permiso WHERE r.n_rol IN ('CAJERO','COCINA','MOZO','SUPERVISOR') ORDER BY r.n_rol, p.clave;`

## Verificación
- [ ] Roles CAJERO/COCINA/MOZO/SUPERVISOR tienen todos los permisos listados en `design.md`
- [ ] Script re-ejecutable sin errores (re-ejecutar 2da vez → 0 filas afectadas en INSERT, solo UPDATE)
- [ ] Sin errores de FK duplicada