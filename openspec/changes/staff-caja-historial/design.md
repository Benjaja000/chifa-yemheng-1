# Diseño: Caja Historial y Movimientos

## Arquitectura
- Reutiliza tablas: `APERTURA_CAJA`, `MOVIMIENTO_CAJA`, `CAJA`, `VENTA`, `PAGO_VENTA`, `METODO_PAGO`.
- `GET /caja/movimientos` → filtra `MOVIMIENTO_CAJA` por `id_aperturacaja` del turno activo.
- `GET /caja/historial` → `APERTURA_CAJA` JOIN `CAJA` + `USUARIO` (apertura/cierre, usuario, montos).
- Filtros: `cajaId`, `desde`, `hasta`, `page`, `limit`.

## Endpoints backend
| Método | Ruta | Guard | Descripción |
|--------|------|-------|-------------|
| GET | `/api/v1/caja/movimientos` | `CAJ_*` / `VEN_*` | Movimientos turno activo |
| GET | `/api/v1/caja/historial` | `CAJ_*` / `VEN_*` | Historial turnos (paginado, filtros) |

## Frontend
- `caja-page.tsx`: pestañas "Pendientes" / "Movimientos" / "Historial".
- "Movimientos": tabla con concepto, método, monto, descripción, fecha.
- "Historial": tabla paginada con filtros fecha/caja, columnas: turno, caja, usuario, apertura, cierre, apertura_monto, cierre_monto, diferencia.