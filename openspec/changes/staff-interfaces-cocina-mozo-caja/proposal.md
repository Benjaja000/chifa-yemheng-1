# Propuesta: Interfaces staff (Cocina KDS / Mozo salón / Caja cobro)

## Problema
- Las páginas `/admin/cocina`, `/admin/mozo` y `/admin/caja` son maquetas sin lógica ni datos reales.
- Cocina no tiene una fuente "board" con detalles P/E/S por pedido sin N llamadas.
- Mozo carece de un botón de "pedir cuenta" personal que respete la mesa activa (solo existe el caso cliente).
- Caja no puede cobrar: no hay endpoint `cobro` que use `usp_facturar_pedido`, ni turnos de caja.

## Alcance
- Cocina KDS: endpoint board de comandas activas con detalle por ítem.
- Mozo: acción "pedir cuenta" asociada a un pedido activo y lectura de mesas/comandas usando endpoints existentes.
- Caja cobro: turnos de caja (`caja` + `apertura_caja`) y registro de cobro vía `usp_facturar_pedido` con venta + comprobante + pago + auditoría.

## Fuera de alcance
- Emisión de comprobante digital / SUNAT / impresión real, cierre contable completo, nota de crédito, delivery.

## Criterios de aceptación
- Cocina: el board muestra pedidos activos con detalle por ítem y permite cambiar estado P/E/S/A.
- Mozo: selecciona mesa con comanda activa, agrega ítems y pide cuenta.
- Caja: lista turnos/cajas abiertas, registra un cobro por pedido con método y comprobante, y devuelve venta/serie/número.
