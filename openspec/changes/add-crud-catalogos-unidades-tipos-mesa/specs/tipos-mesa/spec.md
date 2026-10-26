# Spec delta: tipos-mesa

## Endpoints (`/api/v1/tipos-mesa`, protegidos con `authGuard`)

### GET / — `TMESA_VER` (o `MESA_VER`)
- Query: `page` (def 1), `limit` (1..100, def 20), `buscar` (descripción, ilike), `estado` (`A`|`I`).
- 200: `{ data:[{ id, nombre, cargoServicio, estado }], page, limit, total }`.

### GET /:id — `TMESA_VER` · 404 si no existe.

### POST / — `TMESA_CREAR`
- Body `{ nombre[1..80], cargoServicio?>=0, estado? }`.
- 201 objeto; 400 validación; 409 `YA_EXISTE`.

### PUT /:id — `TMESA_EDITAR` · 200 / 404 / 409.

### PATCH /:id/estado — `TMESA_ELIMINAR`
- Body `{ estado:'A'|'I', confirmar? }`. 200 objeto.
- 409 `MESAS_ASOCIADAS` con `{ mesasAsociadas:N }` si el tipo está en uso.

## Criterios
1. Desactivar tipo con mesas → 409 `MESAS_ASOCIADAS` (conteo).
2. `cargo_servicio` se persiste y expone como `cargoServicio`.
3. Sin `TMESA_EDITAR` → 403.
