# Tareas: Mozo Salón

## Spec y diseño
- [x] `proposal.md`, `design.md`, `specs/mozo-salon.md`, `tasks.md`.

## Backend
- [x] `GET /api/v1/mesas` (ya existente).
- [x] `GET /api/v1/pedidos?mesa=X` (ya existente).
- [x] `POST /api/v1/pedidos` (ya existente).
- [x] `POST /api/v1/pedidos/:id/detalles` (ya existente).
- [x] `POST /api/v1/pedidos/:id/recalcular` (ya existente).
- [x] `PATCH /api/v1/pedidos/:id/pedir-cuenta` (ya implementado en `staff-interfaces-cocina-mozo-caja`).

## Frontend
- [x] `features/staff/mozo/mozo-page.tsx` con salón + comanda + pedir cuenta + cobro opcional.
- [x] `features/staff/staff-service.ts` con `listarMesas`, `listarPedidoPorMesa`, `abrirPedidoMesa`, `agregarLinea`, `pedirCuenta`.

## BD
- [ ] Sin ALTER de esquema.

## Verificación
- [ ] `npm run build` backend OK.
- [ ] `npm run build` frontend OK.
- [ ] Test E2E con `fran.mozo` en `/admin/mozo`.
