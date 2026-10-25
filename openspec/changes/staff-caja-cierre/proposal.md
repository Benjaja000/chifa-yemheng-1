# Propuesta: Caja Cierre y Arqueo

## Problema
- La página `/admin/caja` permite apertura de turno y cobro, pero **no tiene cierre de turno ni arqueo**.
- No hay historial de movimientos del turno ni reporte de arqueo (diferencias entre monto sistema vs declarado).
- No hay reporte Z (resumen diario de ventas por método de pago).

## Alcance
- `POST /api/v1/caja/cierre` — Cierre de turno con monto declarado, cálculo de diferencias, arqueo.
- `GET /api/v1/caja/movimientos` — Listar movimientos del turno activo.
- `GET /api/v1/caja/historial` — Historial de turnos (apertura/cierre) con totales.
- `GET /api/v1/caja/reporte-z` — Reporte Z diario (ventas por método, totales, diferencias).
- Frontend: botón "Cerrar turno" en `/admin/caja`, modal de arqueo, vista de historial.

## Fuera de alcance
- Nota de crédito / anulación de venta (change aparte).
- Integración SUNAT / facturación electrónica real.

## Criterios de aceptación
- Cajero puede cerrar turno ingresando monto declarado → sistema calcula diferencia.
- Historial muestra turnos con apertura/cierre, usuario, montos, diferencias.
- Reporte Z muestra ventas por método, total vendido, diferencias por caja.