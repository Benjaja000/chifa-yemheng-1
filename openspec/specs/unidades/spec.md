# Spec: unidades — CRUD con protección por productos (verdad actual)

Consolidada desde `changes/add-crud-unidades/specs/unidades/spec.md`,
verificada contra código. En caso de conflicto, manda el código.

## Endpoints (`/api/v1/unidades`, `authGuard`)
- `GET /` (`UNI_VER`): `page≥1` def 1, `limit` 1..100 def 20, `nombre` ilike,
  `estado A|I` → `{ data:[{ id, nombre, abreviatura, codigoSunat, estado,
  productosAsociados, fCreacion }], page, limit, total }`.
- `GET /:id` (`UNI_VER`) → 200 o 404 `NOT_FOUND`.
- `POST /` (`UNI_CREAR`): `{ nombre[1..30], abreviatura[1..10] (mayúsculas),
  codigoSunat?[..5] (mayúsculas, def ''), estado? def A }`
  → 201; 400; 409 `YA_EXISTE` nombre duplicado.
- `PUT /:id` (`UNI_EDITAR`, parcial; 404; 409 por choque de nombre).
- `PATCH /:id/estado` (`UNI_ELIMINAR`): `{ estado:'A'|'I', confirmar? }`;
  a `I` con productos y sin `confirmar:true` → 409 `TIENE_PRODUCTOS`
  con `productosAsociados: N`; 200 + auditoría ACTIVO/DESACTIVO.

## Reglas
- Unidad inactiva no aparece como opción al crear producto.
- Sin `UNI_EDITAR` → 403.

## UI (`/admin/unidades`, `features/admin/unidades`)
- Página propia extraída del tab de productos (`add-crud-unidades`):
  tabla + filtros nombre/estado + paginación + modal + confirmación con conteo.
- `productos` conserva el selector vivo (`listarUnidadesActivas`, `[]` si falla).
