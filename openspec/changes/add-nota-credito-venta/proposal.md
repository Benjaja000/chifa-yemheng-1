# Proposal: add-nota-credito-venta

## Por qué
BR-RES-054/055/056 y BR-ACC-055 exigen que una venta facturada solo se corrija
con NOTA_CREDITO, por supervisor (permiso `VEN_NOTACREDITO`), con motivo
obligatorio, serie 07 y correlativo bloqueado. La lógica ya existe en BD
(`usp_anular_venta_con_nc`, yemheng.sql:248) y la tabla `nota_credito` está
creada, pero **el backend no expone ningún endpoint**.

## Qué
- `POST /api/v1/ventas/:id/nota-credito` (permiso `VEN_NOTACREDITO`).
- Body `{ motivo[1..200] }` → `{ idNc, serie, numero, monto, mensaje }`.
- `GET /api/v1/ventas/:id/nota-credito` → NC(s) de la venta.
- Wrapper `fn_anular_venta_con_nc` (convención `fn_*` invocable por RPC).

## No objetivos
- Envío a SUNAT / firma digital / CDR.
- Impresión del comprobante (change `staff-caja-impresion`).
- Anulación de pedido no facturado (BR-RES-015, ya cubierto).
