# Spec: Mozo salón (`/api/v1/pedidos` + `/api/v1/mesas`)

## Objetivo
- Permitir al mozo ver el salón, comanda activa y pedir cuenta de la mesa.

## Requisitos

### REQ-1: Ver mesas y pedidos
- **Given** mesas activas y pedidos no facturados/anulados
- **When** el mozo entra a `/admin/mozo`
- **Then** ve mesas disponibles/ocupadas y la comanda de cada mesa.

### REQ-2: Pedir cuenta
- **Given** un pedido activo con mesa
- **When** `PATCH /api/v1/pedidos/:id/pedir-cuenta`
- **Then** `Facturado='N'` se mantiene, mesa pasa a POR COBRAR y se audita.

## Payload
```json
{ "ok": true, "pedidoId": 214, "estado": "POR COBRAR" }
```

## Errores
- 400 `VALIDATION_ERROR` · 404 `NOT_FOUND` · 409 `YA_POR_COBRAR` · 500 `DB_*`.
