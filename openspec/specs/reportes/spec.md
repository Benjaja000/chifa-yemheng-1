# Spec: reportes — consulta operativa e histórica

## Endpoints (`/api/v1/reportes`, `authGuard`)

- `GET /ventas-diarias?desde=&hasta=` — comprobantes y montos por día/tipo.
- `GET /productos-mas-vendidos?desde=&hasta=&limit=` — ranking por unidades e importe.
- `GET /arqueo-caja?desde=&hasta=` — turnos, apertura, cierre, ingresos, egresos y diferencias.
- `GET /pagos-por-medio?desde=&hasta=&metodoPagoId=&usuarioId=` — importes y operaciones agrupados por fecha, medio y responsable.
- `GET /comprobantes?desde=&hasta=&usuarioId=` — comprobantes emitidos, correlativo, caja, turno, cajero y total.
- `GET /movimientos-caja?desde=&hasta=&usuarioId=` — detalle histórico de ingresos, egresos, devoluciones, ajustes y cobros.
- `GET /ventas-por-categoria?desde=&hasta=` — unidades, cantidad de productos distintos e importe vendido agrupado por categoría.
- `GET /reservas?desde=&hasta=&estado=` — detalle de reservas con fecha/hora, personas, adelanto, mesa, responsable y estado.
- `GET /delivery?desde=&hasta=&estado=&distritoId=&repartidorId=` — pedidos de delivery agrupados en tabla por pedido, distrito, repartidor, estado y marcas de tiempo disponibles.
- `GET /analisis-comercial?desde=&hasta=` — análisis por canal/tipo de pedido, día y hora, ticket promedio/comensal, ventas por mesa/ambiente y empleado asignado, desglose diario de subtotal/descuento/servicio/IGV, ventas anuladas, estado SUNAT registrado de boletas y facturas, operaciones de pago, reservas por estado, ventas por tipo de cliente, comparación con el periodo anterior y resumen por apertura de caja.

Todos requieren `REP_VER`. Las consultas históricas exponen responsable, fechas y método para permitir auditoría; las rutas no modifican datos.

## UI

La página incluye filtros por fecha y pestañas independientes para ventas, productos, ventas por categoría, arqueo, pagos por medio, comprobantes, movimientos, reservas, delivery, ventas por canal/tipo, horarios, ticket promedio, pedidos anulados, notas de crédito, clientes frecuentes, ventas por mesa, ventas por empleado asignado, desglose fiscal, ventas anuladas, SUNAT registrado, pagos por operación, reservas por estado, tipo de cliente, comparación de periodos y resumen de caja. Cada pestaña permite descargar su propio PDF o Excel con el conjunto filtrado; los documentos no combinan reportes distintos. Incluyen el período y los filtros aplicados.

Los filtros permiten restringir comprobantes, categorías/productos, top 10/20/50/100, caja, estado del turno, responsable, método de pago, tipo de movimiento, efectivo físico, estado de reserva, cantidad de personas, adelanto, estado de delivery, distrito, repartidor, búsqueda textual y rangos de importes, según el reporte seleccionado. La comparación de periodos requiere un rango completo y válido; compara con el rango inmediatamente anterior de igual duración. Las consultas históricas se cargan por páginas para evitar el límite de filas por respuesta de PostgREST.

Los pagos mixtos aparecen una vez por medio en su desglose, pero sus comprobantes/ventas no se duplican en los reportes de ventas. El detalle de pagos es por operación individual y puede repetir una venta en varias filas. El resumen de caja muestra las ventas vinculadas a la apertura separadas de los totales guardados para el turno; no se deben sumar, porque pueden representar los mismos cobros.

## Fuentes de datos

`VW_VENTAS_DIARIAS`, `VW_ARQUEO_CAJA`, `VW_REPORTES_PAGOS_MEDIO`, `VW_REPORTES_COMPROBANTES` y `VW_REPORTES_MOVIMIENTOS_CAJA`. El ranking por período se calcula desde `DETALLE_VENTA`, `VENTA`, `PRODUCTO` y `CATEGORIA_PRODUCTO`.

El informe por categoría agrega detalles de ventas activas no anuladas desde `DETALLE_VENTA`; reservas y delivery se consultan desde sus tablas activas con sus relaciones de cliente/mesa/responsable y distrito/repartidor/pedido. Los análisis comerciales, salvo la pestaña explícita de ventas anuladas, excluyen ventas anuladas e inactivas. Los clientes frecuentes solo incluyen ventas con cliente asociado y se limitan a los 100 con mayor importe. Pedidos anulados, ventas anuladas y notas de crédito se obtienen de sus tablas de origen activas. Como la venta no tiene una fecha dedicada de anulación, la pestaña de ventas anuladas muestra su fecha de venta. Las operaciones de pago se filtran por su fecha de pago; el estado SUNAT se filtra por fecha de emisión. La atribución a empleado describe el empleado asignado al pedido, no demuestra quién realizó cada acción. El estado SUNAT de boletas, facturas y notas de crédito es el registrado localmente, no una consulta en tiempo real. El informe de horarios describe la distribución histórica registrada, no una proyección. Los estados de delivery se presentan como códigos almacenados: debido a diferencias existentes entre flujos, no se traducen en métricas de duración o cumplimiento.
