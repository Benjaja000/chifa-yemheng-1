# Diseño: Cocina KDS

## Arquitectura
- Backend delgado: `GET /api/v1/pedidos/cocina` lee `PEDIDO` + `DETALLE_PEDIDO` + `PRODUCTO` filtrando `Facturado='N'`, `Anulado='N'`, `Estado='A'`.
- `PATCH /api/v1/pedidos/:id/detalles/:idDetalle/preparacion` actualiza `DETALLE_PEDIDO.Estado_Preparacion` y `F_Atencion`.
- Frontend pinta board con 3 columnas usando `ys-board` / `ys-col` / `ys-ticket`.
- Polling automático cada 12 segundos.

## Endpoints backend
| Método | Ruta | Guard | Descripción |
|--------|------|-------|-------------|
| GET | `/api/v1/pedidos/cocina` | `PED_COCINA` o `PED_VER` o `PED_REGISTRAR` | Pedidos activos con detalle e ítems P/E/S |
| PATCH | `/api/v1/pedidos/:id/detalles/:idDetalle/preparacion` | `PED_COCINA` o `PED_REGISTRAR` | Cambia estado de preparación de un ítem |

## Reglas de negocio
- BR-INF-047/048: flujo P→E→S por ítem; el estado derivado del pedido se obtiene del estado de sus ítems.
- Un ítem solo puede moverse P→E, E→S, o anularse (A) si está en P o E.
- Un ítem servido (S) no se puede revertir desde cocina (solo anulación desde caja).
