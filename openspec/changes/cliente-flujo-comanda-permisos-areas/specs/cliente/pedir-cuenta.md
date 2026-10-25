# Spec: PATCH /api/v1/cliente/pedidos/cuenta (Pedir cuenta)

## Endpoint
`PATCH /api/v1/cliente/pedidos/cuenta`

## Guard
- `clienteAuthGuard` (JWT de cliente).

## Body
```json
{ "mesaId": 5 }
```

## Acción
1. Busca la comanda activa de la mesa (`facturado='N'`, `anulado='N'`, `estado='A'`).
2. Si no hay → 404 `NO_COMANDA_ACTIVA`. Si ya POR COBRAR → 409 `YA_POR_COBRAR`.
3. `PEDIDO.ID_EstadoPedido = {POR COBRAR}` + `usumod/fecmod`.
4. Si `ESTADO_MESA` tiene estado POR COBRAR → `MESA.ID_EstadoMesa = {POR COBRAR}` (BR-INF-053 coherente con mapa).
5. Audita `PEDIR_CUENTA` (`n_tabla='PEDIDO'`, `id_registro=pedidoId`, `id_usuario=1 AUTOSERVICIO`).

## Respuesta (200)
```json
{ "ok": true, "pedidoId": 123, "estado": "POR COBRAR" }
```

## Reglas de negocio
- BR-ACC-051: pedir cuenta afecta a toda la mesa (todos los participantes).
- BR-RES-026: la solicitud de cuenta aplica a toda la comanda.
- BR-RES-028/029: archivo POR COBRAR no admite nuevos ítems; el cobro lo hace el cajero en caja (VEN_COBRAR); no divisible.
- BR-RES-055: BR-DER-030 pago único queda en fase caja.

## Errores
- 400 `VALIDATION_ERROR` · 401 · 404 `NO_COMANDA_ACTIVA` · 409 `YA_POR_COBRAR` · 500 `DB_*`.
