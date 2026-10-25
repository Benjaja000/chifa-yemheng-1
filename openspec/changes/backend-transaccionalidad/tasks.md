# Tareas: Transaccionalidad Cobro (Rollback Atómico)

## Spec y diseño
- [x] `proposal.md`, `design.md`, `tasks.md`, `specs/transaccionalidad-cobro.md`

## Backend
- [ ] Crear `openspec/changes/backend-transaccionalidad/specs/01_fn_cobrar_pedido_completo.sql` (función PL/pgSQL completa)
- [ ] Refactor `caja-repository.ts` → `cobrar()` delega a `supabase.rpc('fn_cobrar_pedido_completo', ...)`
- [ ] `caja-service.ts` → `cobrarService()` llama RPC, mapea errores
- [ ] `caja-controller.ts` → sin cambios (misma API)
- [ ] `caja-repository.ts`: eliminar lógica `cobrar()` dispersa, mantener helpers (`listarCajas`, `listarMetodosPago`, `turnoAbiertoDeCaja`, `abrirCaja`)

## Frontend
- [ ] Sin cambios (misma API)

## BD
- [ ] Crear `fn_cobrar_pedido_completo` en Supabase (ejecutar SQL en Dashboard)
- [ ] Verificar que todos los pasos están en la función (recalcular, venta, detalle_venta, boleta/factura, pago_venta, movimiento_caja, serie_documento, pedido, mesa, auditoria)

## Verificación
- [ ] `npm run build` backend OK
- [ ] Test E2E: cobro exitoso → todo commitado
- [ ] Test E2E: fallo intermedio (ej. serie no existe) → **ningún cambio en BD** (rollback)
- [ ] Verificar códigos de error idénticos a antes