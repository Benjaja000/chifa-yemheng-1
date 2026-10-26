# Spec delta: unidades

## Endpoints (`/api/v1/unidades`, protegidos con `authGuard`)

### GET / — `UNIDAD_VER` (o `CAT_VER`/`PROD_VER`)
- Query: `page` (def 1), `limit` (1..100, def 20), `buscar` (nombre, ilike), `estado` (`A`|`I`).
- 200: `{ data:[{ id, nombre, abreviatura, codigoSunat, estado }], page, limit, total }`.

### GET /:id — `UNIDAD_VER` · 404 si no existe.

### POST / — `UNIDAD_CREAR`
- Body `{ nombre[1..30], abreviatura[1..10], codigoSunat?[..5], estado? }`.
- 201 objeto; 400 validación; 409 `YA_EXISTE` (nombre duplicado).

### PUT /:id — `UNIDAD_EDITAR` · 200 / 404 / 409 `YA_EXISTE`.

### PATCH /:id/estado — `UNIDAD_ELIMINAR`
- Body `{ estado:'A'|'I', confirmar? }`. 200 objeto.
- 409 `PRODUCTOS_ASOCIADOS` con `{ productosAsociados:N }` si N>0
  (reintento con `{estado:'I', confirmar:true}`).

## Criterios
1. Unidad duplicada → 409 `YA_EXISTE`.
2. Sin `UNIDAD_VER` → 403; sin token → 401.
3. El formulario de productos deja de usar `UNIDADES` hardcodeado.
