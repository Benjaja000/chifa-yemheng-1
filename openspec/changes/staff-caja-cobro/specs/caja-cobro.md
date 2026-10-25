# Spec: Caja Cobro (`/api/v1/caja`)

## Objetivo
Gestionar turnos de caja y registrar el cobro de pedidos por mesa, con venta y comprobante.

## Requisitos

### REQ-1: Maestros
- **Given** un cajero autenticado
- **When** `GET /api/v1/caja/maestros`
- **Then** ve cajas y métodos de pago activos desde la base.

### REQ-2: Pedidos pendientes
- **Given** pedidos con `Facturado='N'` y `Anulado='N'`
- **When** `GET /api/v1/caja/pendientes`
- **Then** se retornan con mesa y detalle de ítems.

### REQ-3: Turno de caja
- **Given** caja no aperturada
- **When** `POST /api/v1/caja/turno` con `cajaId` y `montoInicial`
- **Then** se abre un turno con `situacion='A'` y se marca `CAJA.Aperturada='S'`.

### REQ-4: Cobro
- **Given** un pedido con venta no registrada
- **When** `POST /api/v1/caja/cobro` con `cajaId`, `metodoId`, `tipoDocumento`, `clienteId`, `recibido`, `referencia`
- **Then** se registra venta, detalle de venta, comprobante, pago, movimiento de caja y auditoría.

### REQ-5: Recalcular antes de cobrar
- **Given** un pedido con líneas de detalle
- **When** se ejecuta el cobro
- **Then** se recalculan subtotal, servicio, IGV y total antes de insertar la venta.

### REQ-6: Boleta con datos de cliente
- **Given** tipo documento '03' (boleta)
- **When** se emite el comprobante
- **Then** se rellena `cliente_documento` y `cliente_nombre` desde `CLIENTE` + `PERSONA`.

### REQ-7: Factura requiere empresa
- **Given** tipo documento '01' (factura)
- **When** el cliente no tiene empresa asociada
- **Then** error `FACTURA_CLIENTE_REQUERIDO`.

### REQ-8: Correlativo atómico
- **Given** múltiples cobros concurrentes
- **When** se asigna correlativo de `SERIE_DOCUMENTO`
- **Then** se usa `SELECT ... FOR UPDATE` para evitar duplicados.

### REQ-9: Vuelto en efectivo
- **Given** método de pago afecta efectivo y monto recibido
- **When** se calcula el vuelto
- **Then** `vuelto = max(0, recibido - total)`.

## Errores
- 400 `VALIDATION_ERROR` · 404 `NOT_FOUND` · 409 `FACTURA_CLIENTE_REQUERIDO`,`NO_CAJA_ABIERTA`,`PEDIDO_FACTURADO`,`ID_CLIENTE_INVALIDO`,`MONTO_RECIBIDO_INVALIDO` · 500 `DB_*`.
