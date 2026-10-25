# Diseño: Caja Cierre y Arqueo

## Arquitectura
- Backend delgado: usa tablas `CAJA`, `APERTURA_CAJA`, `MOVIMIENTO_CAJA`, `VENTA`, `PAGO_VENTA`.
- `POST /api/v1/caja/cierre` valida turno activo, calcula totales sistema vs declarado, inserta cierre en `APERTURA_CAJA` (situacion='C'), actualiza `CAJA.Aperturada='N'`.
- `GET /api/v1/caja/movimientos` lista `MOVIMIENTO_CAJA` del turno activo.
- `GET /api/v1/caja/historial` lista `APERTURA_CAJA` con join a `CAJA` y `USUARIO`.
- `GET /api/v1/caja/reporte-z` agrega `VENTA` + `PAGO_VENTA` por método de pago, filtra por fecha/turno.

## Endpoints backend
| Método | Ruta | Guard | Descripción |
|--------|------|-------|-------------|
| POST | `/api/v1/caja/cierre` | `CAJ_CERRAR` / `CAJA_CIERRE` | Cierre de turno con arqueo |
| GET | `/api/v1/caja/movimientos` | `CAJ_*` / `VEN_*` | Movimientos turno activo |
| GET | `/api/v1/caja/historial` | `CAJ_*` / `VEN_*` | Historial turnos (paginado) |
| GET | `/api/v1/caja/reporte-z` | `REP_VER` / `CAJ_*` | Reporte Z diario |

## Reglas de negocio
- Solo se puede cerrar turno con `situacion='A'`.
- Cálculo: `diferencia = monto_declarado - monto_sistema`.
- `situacion` pasa a `'C'`, `CAJA.Aperturada='N'`.
- Auditoría `CERRAR_CAJA` en `AUDITORIA`.
- Reporte Z: agrupa `VENTA` por `TIPO_DOCUMENTO` y `METODO_PAGO`, suma totales.