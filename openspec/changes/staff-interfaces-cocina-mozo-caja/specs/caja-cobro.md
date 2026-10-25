# Spec: Caja cobro (`/api/v1/caja`)

## Objetivo
- Gestionar turnos de caja y registrar el cobro de pedidos por mesa, con venta y comprobante.

## Requisitos

### REQ-1: Maestros
- **Given** un cajero autenticado
- **When** `GET /api/v1/caja/maestros`
- **Then** ve cajas y métodos de pago activos desde la base.

### REQ-2: Pedidos pendientes
- **Given** pedidos con `Facturado='N'` y `Anulado='N'`
- **When** `GET /api/v1/caja/pendientes`
- **Then** se retornan con mesa y detalle de ítems.

### REQ-3: Cobro
- **Given** un pedido con venta no registrada
- **When** `POST /api/v1/caja/cobro` con `cajaId`, `metodoId`, `tipoDocumento`, `clienteId`, `recibido`, `referencia`
- **Then** se registra venta, detalle de venta, comprobante, pago, movimiento de caja y auditoría vía `usp_facturar_pedido`.

### REQ-4: Turno de caja
- **Given** caja no aperturada
- **When** `POST /api/v1/caja/turno`
- **Then** se abre un turno con `montoInicial` y audita apertura.

## Errores
- 400 `VALIDATION_ERROR` · 404 `NOT_FOUND` · 409 `FACTURA_REQUIERE_EMPRESA`,`NO_CAJA_ABIERTA`,`PEDIDO_FACTURADO` · 500 `DB_*`.
