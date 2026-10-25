# Spec: mozo — salón (verdad actual)

Backend soportado vía `/api/v1/mesas`, `/api/v1/pedidos`, `/api/v1/productos`, `/api/v1/caja`.
En caso de conflicto, manda el código.

## Endpoints (reutilizados)
- `GET /api/v1/mesas` + `/ocupacion` (`MESA_VER`) — mapa de mesas.
- `GET /api/v1/mesas/by-qr?codigo=` (público) — resolución por QR.
- `POST /api/v1/pedidos` (`PED_REGISTRAR`) — abrir comanda.
- `POST /api/v1/pedidos/:id/detalles` (`PED_REGISTRAR`) — agregar plato.
- `PATCH /api/v1/pedidos/:id/pedir-cuenta` (`PED_EDITAR` | `PED_REGISTRAR`) — pedir cuenta.
- `POST /api/v1/caja/cobro` (`VEN_COBRAR` | `VEN_EMITIR`) — cobro rápido.

## Frontend (`/admin/mozo`, AreaGuard MOZO)
- Mapa de mesas por ambiente, comanda, cobro rápido.
- Vista `VW_MAPA_MESAS`.

## Pendiente
- Backend route dedicado para mozo (actualmente reutiliza genéricos).
