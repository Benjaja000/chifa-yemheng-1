# Spec: cliente-pedidos — comanda del cliente (verdad actual)

Consolidada desde código actual. En caso de conflicto, manda el código.

## Endpoints (`/api/v1/cliente-pedidos`, `clienteAuthGuard`)

### POST / (abrir comanda)
- Body: `{ tipo, mesaId, comensales?, observacion? }`.
- 201 pedido creado (cliente queda como participante).

### POST /:id/detalles (agregar plato)
- Body: `{ productoId, cantidad, nota?, descuento? }`.
- 200 pedido actualizado.

### POST /:id/recalcular
- 200 pedido con totales actualizados.

### GET /activos?mesaId=
- 200 `{ data: [pedidos abiertos de la mesa] }`.

### GET /comanda?mesaId=
- 200 comanda activa de la mesa (o `{}` si no hay).

### GET /:id (detalle)
- 200 pedido con detalle. 403 `NO_PARTICIPANTE` si cliente no participa.

### PATCH /cuenta
- Body: `{ mesaId }`.
- 200 `{ ok: true }` — pide la cuenta (cambia a YA_POR_COBRAR).
