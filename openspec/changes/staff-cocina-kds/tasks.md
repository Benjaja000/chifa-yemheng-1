# Tareas: Cocina KDS

## Spec y diseño
- [x] `proposal.md`, `design.md`, `specs/cocina-kds.md`, `tasks.md`.

## Backend
- [x] `GET /api/v1/pedidos/cocina` (repositorio + servicio + controlador + ruta).
- [x] `PATCH /api/v1/pedidos/:id/detalles/:idDetalle/preparacion` (repositorio + servicio + controlador + ruta).
- [x] `listarPedidosCocina()` en `pedidos-repository.ts`.
- [x] `cocinaService()` en `pedidos-service.ts`.

## Frontend
- [x] `features/staff/cocina/cocina-page.tsx` con board real (3 columnas, polling, acciones).
- [x] `features/staff/staff-service.ts` con `listarPedidosCocina()` y `cambiarPreparacion()`.

## BD
- [ ] Sin ALTER de esquema.

## Verificación
- [ ] `npm run build` backend OK.
- [ ] `npm run build` frontend OK.
- [ ] Test E2E con `fran.cocina` en `/admin/cocina`.
