# Tareas: Interfaces staff (Cocina KDS / Mozo salón / Caja cobro)

## Spec y diseño
- [x] `proposal.md`, `design.md`, 3 specs, `tasks.md`.

## Backend
- [x] `GET /api/v1/pedidos/cocina` (repositorio + servicio + controlador + ruta).
- [x] `PATCH /api/v1/pedidos/:id/pedir-cuenta` (staff, audita, usa `idEstadoMesaPorName` y `pedirCuentaMesa`).
- [x] `caja` backend: `caja.ts` / `caja-controller.ts` / `caja-service.ts` / `caja-repository.ts` / `schemas/caja.ts`.
- [x] `GET /api/v1/caja/maestros` + `GET /api/v1/caja/pendientes`.
- [x] `POST /api/v1/caja/turno` y `POST /api/v1/caja/cobro` vía `usp_facturar_pedido`.

## Frontend
- [x] `features/staff/cocina/cocina-page.tsx` con board real.
- [x] `features/staff/mozo/mozo-page.tsx` con salón + comanda + pedir cuenta + cobro opcional.
- [x] `features/staff/caja/caja-page.tsx` con turnos + cobro + maestros.
- [x] `features/staff/staff-service.ts` con llamadas backend.

## BD
- [ ] Sin ALTER de esquema. Solo sushi seed si falta `VEN_COBRAR` o permisos.
