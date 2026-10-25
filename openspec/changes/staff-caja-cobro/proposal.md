# Propuesta: Caja Cobro (Turnos y Cobro de Pedidos)

## Problema
- La página `/admin/caja` es maqueta sin lógica ni datos reales.
- No hay endpoint `cobro` que registre la venta, comprobante, pago y movimiento de caja.
- No hay gestión de turnos de caja (apertura con monto inicial).

## Alcance
- Gestión de turnos de caja (`POST /api/v1/caja/turno` con monto inicial).
- Listar pedidos pendientes (`GET /api/v1/caja/pendientes`).
- Cobro de pedido por mesa (`POST /api/v1/caja/cobro`) vía `usp_facturar_pedido` (o equivalente TS): venta + detalle + comprobante (boleta/factura) + pago + movimiento de caja + auditoría.
- Listar cajas y métodos de pago (`GET /api/v1/caja/maestros`).

## Fuera de alcance
- Cierre de turno y arqueo (cambio aparte `staff-caja-cierre`).
- Emisión de comprobante digital / SUNAT / impresión real.

## Criterios de aceptación
- El cajero abre un turno de caja con monto inicial.
- El cajero ve pedidos pendientes de cobro con detalle de ítems.
- El cajero registra un cobro con método, tipo documento y monto recibido.
- El sistema genera venta, comprobante, pago, movimiento de caja y auditoría.
- El pedido se marca facturado y la mesa vuelve a LIBRE.
