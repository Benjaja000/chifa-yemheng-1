# Spec: cliente-pedidos — comanda del cliente (verdad actual)

Consolidada desde código actual. En caso de conflicto, manda el código.

## Endpoints (`/api/v1/cliente-pedidos`, `clienteAuthGuard`)

### POST / (abrir comanda)
- Body: `{ tipo, mesaId, comensales?, observacion? }`.
- 201 comanda creada o recuperada; para una mesa QR activa no duplica el pedido y registra/revalida al cliente como participante.

### POST /:id/detalles (agregar plato)
- Body: `{ productoId, cantidad, nota?, descuento? }`.
- 200 pedido actualizado.

### POST /:id/recalcular
- 200 pedido con totales actualizados.

### GET /activos?mesaId=
- 200 `{ data: [pedidos abiertos de la mesa] }`.

### GET /comanda?mesaId=
- 200 comanda activa de la mesa, modo de pago, organizador, participantes y consumo estimado por participante (o `{}` si no hay).
- Registrar a un cliente nuevo como participante si la mesa aún admite incorporaciones; un participante existente puede recuperar el acceso a su comanda.

### GET /:id (detalle)
- 200 pedido con detalle. 403 `NO_PARTICIPANTE` si cliente no participa.

### PATCH /cuenta
- Body: `{ mesaId }`.
- 200 `{ ok: true }` — pide la cuenta (cambia a YA_POR_COBRAR).

### PATCH /:id/modo-pago
- Body: `{ modo: "CUENTA_UNICA" | "POR_CONSUMO" }`.
- Solo el organizador puede cambiarlo mientras la mesa no esté POR COBRAR.
- La asignación por consumo conserva una sola venta, comprobante y método de pago; Caja registra los aportes por participante y valida que cubran exactamente el total.
