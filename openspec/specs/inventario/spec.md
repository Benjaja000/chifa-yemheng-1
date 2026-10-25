# Spec: inventario — (pendiente de implementación)

## Estado actual
- Frontend: sin página dedicada. Stock gestionado en `/admin/productos`.
- Backend: sin route dedicado. `productosRouter` maneja stock fields (`stock`, `stockMin`, `controlaStock`).
- DB: `PRODUCTO` (Tipo='I', Stock_Actual, Stock_Minimo), `MOVIMIENTO_INVENTARIO` (sin uso), `RECETA`.
- Seeds: stock controlado solo en 2 productos.

## Endpoints existentes (parciales)
- `GET/POST/PUT/PATCH /api/v1/productos` — incluye campos de stock.
- `MOVIMIENTO_INVENTARIO` sin uso.

## Pendiente
- Backend: endpoints de movimiento de inventario, recetas, consumo por venta.
- Frontend: página dedicada `/admin/inventario`.
- DB: activar uso de `MOVIMIENTO_INVENTARIO` y `RECETA`.
