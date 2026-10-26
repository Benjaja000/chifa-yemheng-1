# Spec delta: nota-credito

## Endpoints (`/api/v1/ventas`, protegidos con `authGuard`)

### POST /:id/nota-credito — `VEN_NOTACREDITO`
- Body: `{ motivo: string[1..200] }`.
- 201 `{ idNc, serie, numero, monto, mensaje }`.
- 400 `VALIDATION_ERROR` · 403 `SIN_PERMISO` · 404 `VENTA_NO_EXISTE`.
- 409 `VENTA_ANULADA` | `NO_CAJA_ABIERTA` | `SERIE_NC_NO_DISPONIBLE`.

### GET /:id/nota-credito — `VEN_NOTACREDITO` (o `VEN_VER`/`VEN_COBRAR`)
- 200 NC(s) de la venta; `[]` si no hay.

## Criterios (BR-RES-054/055/056, BR-ACC-055)
1. Given una venta facturada no anulada, When el supervisor emite NC con motivo,
   Then se crea `NOTA_CREDITO` serie 07 con correlativo incrementado y la venta
   queda `Anulada='S'`.
2. Given motivo vacío, When se intenta emitir, Then 400 sin crear NC.
3. Given un rol sin `VEN_NOTACREDITO`, When invoca el endpoint, Then 403.
4. Given que no hay turno abierto en la caja de la venta, Then 409 `NO_CAJA_ABIERTA`.
5. Given una NC emitida, Then se registra movimiento `DEVOLUCION A CLIENTE` y
   auditoría `NOTA_CREDITO/INSERT`.
