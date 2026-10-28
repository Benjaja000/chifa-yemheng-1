# Spec: inventario — existencias, kardex y recetas

## Endpoints (`/api/v1/inventario`, `authGuard`)

- `GET /movimientos?page=&limit=&productoId=&tipo=` — consulta paginada del kardex.
- `POST /movimientos` — registra entradas, salidas, ajustes o mermas y actualiza stock en la misma transacción.
- `GET /recetas?page=&limit=&productoId=` — consulta recetas.
- `POST /recetas` — crea una receta.
- `PATCH /recetas/:id` — actualiza cantidad o activa/desactiva una receta.

## Reglas

- Los movimientos son un ledger append-only: no se editan ni borran.
- Un movimiento no puede dejar stock controlado por debajo de cero; registro y saldo se confirman juntos.
- La venta descuenta los insumos de las recetas activas; si el producto no tiene receta, descuenta su propio stock cuando está controlado.
- Las recetas se desactivan en vez de borrarse para conservar trazabilidad.
- Los permisos requeridos son `INV_VER`, `INV_CREAR`, `REC_VER` y `REC_CREAR`.
