# Spec: Mozo Split Bill (Dividir Cuenta)

## Objetivo
Permitir dividir una comanda por comensal → sub-pedidos cobrables individualmente.

## Requisitos

### REQ-1: Dividir cuenta
- **Given** pedido activo con múltiples ítems y comensales
- **When** mozo selecciona "Dividir cuenta" → asigna ítems a comensales → confirma
- **Then** se crean sub-pedidos hijos (`id_pedido_padre = pedido_original`) con:
  - `id_pedido` nuevo por comensal
  - `id_pedido_padre` = pedido original
  - Ítems asignados a cada sub-pedido
  - `id_cliente` = comensal correspondiente
  - Estado = ABIERTO, Facturado=N, Anulado=N

### REQ-2: Cobro independiente
- **Given** sub-pedidos generados
- **When** cajero abre `/admin/caja`
- **Then** cada sub-pedido aparece como cobrable independiente en `/caja/pendientes`.

### REQ-3: Cierre sub-cuenta
- **Given** sub-pedido cobrado
- **When** cobro completado
- **Then** sub-pedido → `facturado='S'`, ítems removidos del pedido original disponible.

## Errores
- 400 `VALIDATION_ERROR` (ítems no asignados, comensales vacíos)
- 409 `YA_FACTURADO` (sub-pedido ya cobrado)
- 500 `DB_*`.