# Spec: Cocina KDS (`/api/v1/pedidos/cocina`)

## Objetivo
- Proveer un tablero de cocina con pedidos activos, ítems por ítem y estado P/E/S.

## Requisitos

### REQ-1: Listar board
- **Given** pedidos con `Facturado='N'`, `Anulado='N'`, `Estado='A'`
- **When** `GET /api/v1/pedidos/cocina`
- **Then** se retornan pedidos con `detalles` y estado de preparación por ítem.

### REQ-2: Acción
- **Given** un ítem con estado P
- **When** cocina lo mueve
- **Then** se actualiza `Estado_Preparacion` y `F_Atencion`.

## Errores
- 400 `VALIDATION_ERROR` · 401 · 403 `FORBIDDEN` · 500 `DB_*`.
