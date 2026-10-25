# Propuesta: Cocina KDS (Tablero de Comandas)

## Problema
- La página `/admin/cocina` es maqueta sin lógica ni datos reales.
- No hay un tablero (KDS) que agrupe pedidos activos por estado de preparación (P/E/S).
- No hay endpoint dedicado que devuelva pedidos con detalle por ítem en una sola consulta.
- No hay acción para cambiar estado de preparación P→E→S/A ni contadores por columna.

## Alcance
- Endpoint `GET /api/v1/pedidos/cocina` que devuelve pedidos activos con `detalles` y estado de preparación por ítem.
- Endpoint `PATCH /api/v1/pedidos/:id/detalles/:idDetalle/preparacion` para cambiar estado P/E/S/A.
- Interfaz KDS con 3 columnas (Pendiente / En proceso / Servido), polling, conteo por columna y tickets con detalle.

## Fuera de alcance
- Emisión de comprobante, cobro de caja, cierre de turno, anotaciones de cocina avanzadas (notas privadas).

## Criterios de aceptación
- El board muestra pedidos activos con detalle por ítem y estado P/E/S/A.
- Cocina puede mover un ítem de P→E→S o anularlo (A).
- El sistema muestra conteo por columna (pendientes / en proceso / servidos).
- El tablero se actualiza por polling automático.
