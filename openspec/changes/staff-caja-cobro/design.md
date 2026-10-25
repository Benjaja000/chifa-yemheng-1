# Diseño: Caja Cobro

## Arquitectura
- Backend delgado: usa tablas `CAJA`, `APERTURA_CAJA`, `PEDIDO`, `DETALLE_PEDIDO`, `VENTA`, `DETALLE_VENTA`, `PAGO_VENTA`, `MOVIMIENTO_CAJA`, `BOLETA`/`FACTURA`, `SERIE_DOCUMENTO`, `METODO_PAGO`.
- `POST /api/v1/caja/turno` crea una fila en `APERTURA_CAJA` con `situacion='A'` y marca `CAJA.Aperturada='S'`.
- `POST /api/v1/caja/cobro` recalcula el pedido, inserta venta, detalle de venta, comprobante (boleta/factura), pago y movimiento de caja; marca pedido `Facturado='S'` y mesa `LIBRE`.
- Para evitar duplicación de correlativo de serie bajo concurrencia, se usa función Postgres `fn_incrementar_correlativo_serie(p_tipodoc)` con `SELECT ... FOR UPDATE` interno.

## Endpoints backend
| Método | Ruta | Guard | Descripción |
|--------|------|-------|-------------|
| GET | `/api/v1/caja/maestros` | `CAJ_*` / `VEN_*` / `PED_VER` | Cajas y métodos de pago activos |
| GET | `/api/v1/caja/pendientes` | `CAJ_*` / `VEN_*` / `PED_VER` | Pedidos activos (no facturados/anulados) con detalle |
| POST | `/api/v1/caja/turno` | `CAJ_APERTURAR` / `CAJA_APERTURA` | Apertura de turno de caja |
| POST | `/api/v1/caja/cobro` | `VEN_COBRAR` / `VEN_EMITIR` | Cobro por pedido con venta + comprobante + pago |

## Reglas de negocio
- VU-COB-004 / BR-EST-006: toda venta genera comprobante y auditoría.
- BR-EST-005: un pedido solo puede cobrarse una vez (no ya facturado ni anulado).
- BR-RES-016: factura valida cliente de empresa con RUC.
- Para boleta se pobla `cliente_documento` y `cliente_nombre` desde `CLIENTE` + `PERSONA`.
- Para factura se valida `cliente.id_empresa NOT NULL`.
