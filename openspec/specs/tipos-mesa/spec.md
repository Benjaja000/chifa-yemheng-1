# Spec: tipos-mesa — CRUD de tipos de mesa (verdad actual)

Consolidada desde código actual. En caso de conflicto, manda el código.

## Endpoints (`/api/v1/tipos-mesa`, `authGuard`)

### GET / (`TMESA_VER`)
- 200 lista de tipos de mesa activos/inactivos con paginación.

### GET /:id (`TMESA_VER`)
- 200 tipo de mesa por ID.
- 404 si no existe.

### POST / (`TMESA_CREAR`)
- Body: `{ nombre, descripcion?, cargoServicio?, estado? }`.
- 201 tipo de mesa creado.
- 409 si nombre ya existe.

### PUT /:id (`TMESA_EDITAR`)
- Body parcial del mismo schema.
- 200 tipo actualizado.
- 404 si no existe, 409 si nombre choca.

### PATCH /:id/estado (`TMESA_ELIMINAR`)
- Body: `{ estado: 'A'|'I' }`.
- 200 `{ ok: true }`.
- 409 `MESAS_ASOCIADAS` si hay mesas usando este tipo (incluye `mesasAsociadas` en respuesta).
