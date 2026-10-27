# Spec: mozo — salón

Backend soportado vía `/api/v1/mesas`, `/api/v1/pedidos` y `/api/v1/productos`.
En caso de conflicto, manda el código.

## Endpoints (reutilizados)
- `GET /api/v1/mesas` + `/ocupacion` (`MESA_VER`) — mapa de mesas.
- `GET /api/v1/mesas/by-qr?codigo=` (público) — resolución por QR.
- `POST /api/v1/pedidos` (`PED_REGISTRAR`) — abrir comanda.
- `POST /api/v1/pedidos/:id/detalles` (`PED_REGISTRAR`) — agregar plato solo en atención presencial; pedidos QR/WEB se bloquean también en backend para el rol MOZO.
- `PATCH /api/v1/pedidos/:id/pedir-cuenta` (`PED_EDITAR` | `PED_REGISTRAR`) — pedir cuenta.
- `GET /api/v1/pedidos/mozo/entregas` (`PED_VER` | `PED_REGISTRAR` | `PED_ENTREGAR` | rol `MOZO`) — pedidos activos con platos SERVIDOS pendientes de entrega.
- `PATCH /api/v1/pedidos/:id/detalles/:idDetalle/entrega` (`PED_ENTREGAR` | `PED_REGISTRAR` | rol `MOZO`) — registrar usuario y fecha de entrega; no cambia estado de preparación.
- `PATCH /api/v1/pedidos/:id/detalles/:idDetalle/preparacion` requiere exclusivamente `PED_COCINA`.

## Frontend (`/admin/mozo`, AreaGuard MOZO)
- Resumen de mesas libres/ocupadas/por cobrar y bandeja modal de platos listos agrupada por mesa.
- Comandas QR/WEB: solo consulta y confirmación de entrega; sin acciones para agregar productos, anular, recalcular, pedir cuenta o cobrar.
- Comandas presenciales: abrir mesa, agregar productos y pedir cuenta mientras no esté POR COBRAR.
- No se cobra desde la interfaz de Mozo; Caja conserva ese flujo.
- Vista `VW_MAPA_MESAS`.

## Origen del pedido
- `PEDIDO.CANAL_ORIGEN`: `QR`, `WEB` o `PRESENCIAL`; el backend asigna `QR` al flujo de cliente QR y `PRESENCIAL` al alta del personal.
- La migración de origen y entrega agrega `PED_ENTREGAR` a MOZO, SUPERVISOR y ADMINISTRADOR.
