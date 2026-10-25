# Spec: GET /api/v1/cliente/pedidos/comanda

## Endpoint
`GET /api/v1/cliente/pedidos/comanda?mesaId=X`

## Guard
- `clienteAuthGuard` (JWT de cliente). `mesaId` requerido (mesa identificada por QR escaneado, BR-ACC-049).

## Respuesta (200)
Comanda activa de la mesa (`facturado='N'`, `anulado='N'`, `estado='A'`) o `{}` si no hay:

```json
{ "id": 123, "numero": "PED-...", "mesaId": 5, "estado": "ABIERTO", "estadoComandaDerivado": "...", "total": 33.0, "cantidadDetalles": 4 }
```

## Reglas de negocio
- BR-EST-011: la comanda pertenece a la mesa, no al cliente individual.
- BR-ACC-049/050: quien escanea el QR de la mesa se incorpora y visualiza el mismo consumo acumulado.

## Errores
- 400 `VALIDATION_ERROR` si falta mesaId · 401 sin JWT.
