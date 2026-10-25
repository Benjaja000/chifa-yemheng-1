# Propuesta: Caja Historial y Movimientos

## Problema
- Caja tiene `GET /caja/pendientes` y `POST /caja/turno` + `cobro`, pero **no hay historial de turnos cerrados ni lista de movimientos del turno activo**.
- Cajero no puede ver qué movimientos hizo en su turno ni consultar turnos anteriores.

## Alcance
- `GET /api/v1/caja/movimientos` → lista `MOVIMIENTO_CAJA` del turno activo (concepto, método, monto, descripción, fecha).
- `GET /api/v1/caja/historial` → lista paginada de `APERTURA_CAJA` (turnos) con apertura/cierre, usuario, montos, diferencias.
- Frontend: pestañas "Pendientes" / "Movimientos" / "Historial" en `/admin/caja`.

## Fuera de alcance
- Reporte Z (change aparte `staff-caja-reporte-z`).
- Exportar a Excel/PDF (futuro).

## Criterios de aceptación
- Pestaña "Movimientos" muestra movimientos del turno actual con totales.
- Pestaña "Historial" lista turnos con paginación, filtros fecha/caja.
- Totales por turno: apertura, cierre, ingresos, egresos, diferencia.