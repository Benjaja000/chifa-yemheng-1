# Spec: productos — CRUD (verdad actual)

Consolidada desde `changes/add-crud-productos/specs/productos/spec.md`,
verificada contra código. En caso de conflicto, manda el código.

## Endpoints (`/api/v1/productos`, `authGuard`)
- `GET /` (`PROD_VER`): `page≥1` def 1, `limit` 1..100 def 20, `nombre` ilike,
  `categoria`, `estado A|I`, `disponible S|N` → `{ data:[{ id, nombre, codigo,
  categoriaId, categoria, tipo, precio, costo, unidadId, unidad, stock, stockMin,
  controlaStock, tiempo, disponible, imagen, detalle, estado }], page, limit, total }`.
- `GET /:id` (`PROD_VER`) → 404.
- `POST /` (`PROD_CREAR`): `{ nombre[1..50], categoriaId, unidadId,
  tipo P|B|I def P, precio≥0, costo≥0 def 0, stock/stockMin≥0 def 0,
  controlaStock def false, tiempo?≥0, disponible def true, imagen?[..200],
  detalle?[..150], afectoIgv def true, codigo?[..20], estado? def A }`.
  Categoría debe existir y estar `A` → 422 `CATEGORIA_INVALIDA`.
  201; 400; 409 `YA_EXISTE` si `codigo` duplicado.
- `PUT /:id` (`PROD_EDITAR`, parcial, mismas reglas; 404; 409 código).
- `PATCH /:id/estado` (`PROD_ELIMINAR`): `{ estado:'A'|'I' }` → 200.

## Reglas
- `Disponible=N` o `Estado=I` → excluido de carta/comandas.
- Frontend `/admin/productos`: filtros + paginación + responsive; sugerencia
  de correlativo y `REF` visible por fila.
