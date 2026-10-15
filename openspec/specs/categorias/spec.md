# Spec: categorias — CRUD con protección por productos (verdad actual)

Consolidada desde `changes/add-crud-categorias/specs/categorias/spec.md`,
verificada contra código. En caso de conflicto, manda el código.

## Endpoints (`/api/v1/categorias`, `authGuard`)
- `GET /` (`CAT_VER`): `page≥1` def 1, `limit` 1..100 def 20, `nombre` ilike,
  `estado A|I` → `{ data:[{ id, nombre, descripcion, area, orden, estado,
  productosAsociados, fCreacion }], page, limit, total }`.
- `GET /:id` (`CAT_VER`) → 200 o 404 `NOT_FOUND`.
- `POST /` (`CAT_CREAR`): `{ nombre[1..50], descripcion?[..100],
  area COCINA|BARRA|CAJA def COCINA, orden?≥0 (def max+1), estado? def A }`
  → 201; 400; 409 `YA_EXISTE` nombre duplicado.
- `PUT /:id` (`CAT_EDITAR`, parcial; 404; 409 por choque de nombre).
- `PATCH /:id/estado` (`CAT_ELIMINAR`): `{ estado:'A'|'I', confirmar? }`;
  a `I` con productos y sin `confirmar:true` → 409 `TIENE_PRODUCTOS`
  con `productosAsociados: N`; 200 + auditoría ACTIVO/DESACTIVO.

## Reglas
- Categoría inactiva no aparece como opción al crear producto.
- Sin `CAT_EDITAR` → 403.
