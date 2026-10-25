# Tareas: Caja Cierre y Arqueo

## Spec y diseño
- [x] `proposal.md`, `design.md`, `tasks.md`, `specs/caja-cierre.md`

## Backend
- [ ] `GET /api/v1/caja/movimientos` (repositorio + servicio + controlador + ruta)
- [ ] `GET /api/v1/caja/historial` (repositorio + servicio + controlador + ruta)
- [ ] `GET /api/v1/caja/reporte-z` (repositorio + servicio + controlador + ruta)
- [ ] `POST /api/v1/caja/cierre` (repositorio + servicio + controlador + ruta)
- [ ] Repositorio: `turnoActivo(cajaId, usuarioId)`, `cerrarCaja(aperturaId, montoDeclarado, usuarioId)`, `listarMovimientos(aperturaId)`, `historialCaja(cajaId, page, limit)`, `reporteZ(fechaDesde, fechaHasta)`

## Frontend
- [ ] `features/staff/caja/caja-page.tsx` — botón "Cerrar turno" + modal arqueo
- [ ] `features/staff/caja/caja-historial.tsx` — vista historial turnos
- [ ] `features/staff/caja/caja-reporte-z.tsx` — vista reporte Z
- [ ] `features/staff/staff-service.ts` — `listarMovimientosCaja`, `historialCaja`, `reporteZ`, `cerrarCaja`

## BD
- [ ] Sin ALTER de esquema (usa tablas existentes `APERTURA_CAJA`, `MOVIMIENTO_CAJA`, `CAJA`, `VENTA`, `PAGO_VENTA`, `METODO_PAGO`)

## Verificación
- [ ] `npm run build` backend OK
- [ ] `npm run build` frontend OK
- [ ] Test E2E: abrir turno → cobros → cerrar turno con arqueo → verificar historial y reporte Z