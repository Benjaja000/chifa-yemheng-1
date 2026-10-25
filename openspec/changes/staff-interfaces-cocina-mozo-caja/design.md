# Diseño: Interfaces staff (Cocina KDS / Mozo salón / Caja cobro)

## Arquitectura
- Backend delgado. Cocina y Caja se apoyan en las tablas `PEDIDO`, `DETALLE_PEDIDO`, `MESA`, `CAJA`, `APERTURA_CAJA` y `USP_*` existentes.
- Mozo reutiliza `/pedidos` y `/mesas`; no agrega endpoints sin necesidad.
- Caja usa `usp_facturar_pedido` para no duplicar lógica de venta, comprobante y pago.

## Endpoints backend
| Método | Ruta | Guard | Descripción |
|--------|------|-------|-------------|
| GET | `/api/v1/pedidos/cocina` | `PED_COCINA` o `PED_VER` | Pedidos activos con detalle e ítems P/E/S |
| PATCH | `/api/v1/pedidos/:id/pedir-cuenta` | `PED_REGISTRAR` | Marca pedido/mesa POR COBRAR |
| GET | `/api/v1/caja/maestros` | `CAJ_*`/`VEN_*`/`MESA_VER` | Cajas y métodos de pago activos |
| POST | `/api/v1/caja/turno` | `CAJ_APERTURAR`/`CAJA_APERTURA` | Apertura de turno de caja |
| GET | `/api/v1/caja/pendientes` | `CAJ_*`/`VEN_*`/`PED_VER` | Pedidos activos (no facturados/anulados) con detalle |
| POST | `/api/v1/caja/cobro` | `VEN_COBRAR`/`VEN_EMITIR` | Cobro por pedido vía `usp_facturar_pedido` |

## Reglas de negocio aplicadas
- BR-INF-047/048: flujo P→E→S por ítem en cocina.
- BR-ACC-037/051: cuenta afecta toda la mesa y la mesa vuelve a LIBRE al cobrar.
- VU-COB-004 / BR-EST-006: toda venta genera comprobante y auditoría.
- BR-EST-005: pedido solo puede cobrarse una vez.
- BR-RES-016: factura valida cliente de empresa con RUC.
