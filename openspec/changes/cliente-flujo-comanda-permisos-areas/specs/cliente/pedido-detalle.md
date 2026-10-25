# Spec: GET /api/v1/cliente/pedidos/:id

## Endpoint
`GET /api/v1/cliente/pedidos/:id`

## Guard
- `clienteAuthGuard` (JWT de cliente).
- Pertenencia: el pedido debe tener `id_cliente = cliente.sub` o algún detalle con `id_cliente = cliente.sub` (participante QR, BR-EST-013). Si no → 403 `NO_PARTICIPANTE`.

## Respuesta (200)
`Pedido` con `detalles[]` (producto, cantidad, notaCocina, estadoPreparacion P/E/S/A, subTotal) y campo derivado:

```json
{
  "id": 123, "numero": "PED-...", "mesaId": 5, "estado": "ABIERTO|...",
  "estadoComandaDerivado": "EN PREPARACION|SERVIDO|ABIERTO",
  "facturado": "N", "anulado": "N",
  "detalles": [{ "producto": "...", "cantidad": 1, "estadoPreparacion": "E", "notaCocina": "Sin ají", "subTotal": 25.0 }]
}
```

Derivación (BR-INF-047/048): algún ítem E → `EN PREPARACION`; todos S → `SERVIDO`; si no → estado de cabecera.

## Errores
- 401 sin JWT · 403 `NO_PARTICIPANTE` · 404 `NOT_FOUND` · 400 pedido facturado/anulado se informa igual (lectura permitida con `facturado`/`anulado`).
