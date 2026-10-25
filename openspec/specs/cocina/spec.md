# Spec: cocina — KDS (verdad actual)

Backend soportado vía `/api/v1/pedidos` (GET /cocina, PATCH preparación).
En caso de conflicto, manda el código.

## Endpoints (reutilizados)
- `GET /api/v1/pedidos/cocina` (`PED_COCINA` | `PED_VER` | `PED_REGISTRAR`) — pedidos activos con detalle para KDS.
- `PATCH /api/v1/pedidos/:id/detalles/:idDetalle/preparacion` (`PED_COCINA` | `PED_REGISTRAR`) — `{ estado: 'P'|'E'|'S' }`.

## Frontend (`/admin/cocina`, AreaGuard COCINA)
- Auto-refresh cada 12s. Muestra comandas activas con estado de preparación por línea.
- Vista `VW_COMANDA_COCINA`. Área de despacho por `CATEGORIA_PRODUCTO.Area_Despacho`.

## Pendiente
- WebSocket para push en tiempo real (change `staff-cocina-websocket` en progreso).
