# Tareas: Caja Historial y Movimientos

## Spec y diseño
- [x] `proposal.md`, `design.md`, `tasks.md`, `specs/caja-historial.md`

## Backend
- [ ] `GET /api/v1/caja/movimientos` (repo + service + controller + route)
- [ ] `GET /api/v1/caja/historial` (repo + service + controller + route)
- [ ] Repositorio: `listarMovimientos(aperturaId)`, `historialCaja(cajaId, page, limit, desde, hasta)`

## Frontend
- [ ] `caja-page.tsx`: tabs "Pendientes" / "Movimientos" / "Historial"
- [ ] Tab "Movimientos": tabla con concepto, método, monto, descripción, fecha
- [ ] Tab "Historial": tabla paginada + filtros fecha/caja + totales

## Verificación
- [ ] `npm run build` frontend OK
- [ ] Test: abrir turno → cobros → ver movimientos → cerrar → ver historial