# Spec: Cocina KDS (`/api/v1/pedidos/cocina`)

## Objetivo
Proveer un tablero de cocina con pedidos activos, ítems por ítem y estado P/E/S.

## Requisitos

### REQ-1: Listar board
- **Given** pedidos con `Facturado='N'`, `Anulado='N'`, `Estado='A'`
- **When** `GET /api/v1/pedidos/cocina`
- **Then** se retornan pedidos con `detalles` y estado de preparación por ítem.

### REQ-2: Cambiar estado de preparación
- **Given** un ítem con estado P o E
- **When** `PATCH /api/v1/pedidos/:id/detalles/:idDetalle/preparacion` con `estado`
- **Then** se actualiza `Estado_Preparacion` y `F_Atencion` (si E o S).

### REQ-3: Polling automático
- **Given** el board de cocina está abierto
- **When** pasan 12 segundos
- **Then** el frontend vuelve a consultar `GET /api/v1/pedidos/cocina` y actualiza el board.

### REQ-4: Colores por estado
- **Given** un ítem con estado de preparación
- **When** se renderiza en el ticket
- **Then** se muestra con color: P=ámbar `#f59e0b`, E=azul `#3b82f6`, S=verde `#22c55e`, A=rojo `#ef4444`.

### REQ-5: Anular ítem
- **Given** un ítem en estado P o E
- **When** cocina selecciona "Anular"
- **Then** el ítem pasa a estado `A` y se descuenta del total servido.

### REQ-6: Contadores por columna
- **Given** hay pedidos activos
- **When** se renderiza el header del board
- **Then** se muestran chips con cantidad de ítems P, E y S.

### REQ-7: Orden del board
- **Given** múltiples pedidos activos
- **When** se lista el board
- **Then** se ordena por `f_pedido` descendente y `id_pedido` descendente (nuevo→antiguo).

## Errores
- 400 `VALIDATION_ERROR` · 401 · 403 `FORBIDDEN` · 500 `DB_*`.
