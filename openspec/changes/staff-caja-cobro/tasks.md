# Tareas: Caja Cobro

## Spec y diseño
- [x] `proposal.md`, `design.md`, `specs/caja-cobro.md`, `tasks.md`.

## Backend
- [x] `GET /api/v1/caja/maestros` (repositorio + servicio + controlador + ruta).
- [x] `GET /api/v1/caja/pendientes` (repositorio + servicio + controlador + ruta).
- [x] `POST /api/v1/caja/turno` (repositorio + servicio + controlador + ruta).
- [x] `POST /api/v1/caja/cobro` (repositorio + servicio + controlador + ruta).
- [ ] Función Postgres `fn_incrementar_correlativo_serie` (FOR UPDATE interno).
- [ ] `caja-repository.ts`: recalcular pedido antes de insertar venta.
- [ ] `caja-repository.ts`: poblar `boleta.cliente_documento` / `cliente_nombre`.
- [ ] `caja-repository.ts`: validar `id_empresa` para factura (01).

## Frontend
- [x] `features/staff/caja/caja-page.tsx` con turnos + cobro + maestros.
- [x] `features/staff/staff-service.ts` con `listarCajaMaestros`, `listarCajaPendientes`, `aperturarCaja`, `registrarCobro`.

## BD
- [ ] Sin ALTER de esquema.
- [ ] Crear función `fn_incrementar_correlativo_serie` (nueva función, no altera tablas).

## Verificación
- [ ] `npm run build` backend OK.
- [ ] `npm run build` frontend OK.
- [ ] Test E2E con `fran.caja` en `/admin/caja` (abrir turno + cobro 03 y 01).
