# Spec delta: unidades

## Endpoints (`/api/v1/unidades`, protegidos con `authGuard`)

### GET / — `UNI_VER`
- Query Zod: `page` (≥1, default 1), `limit` (1..100, default 20),
  `nombre` (opcional, ilike sobre `n_unidad`), `estado` (`A`|`I`, opcional).
- 200: `{ data: [{ id, nombre, abreviatura, codigoSunat, estado,
  productosAsociados, fCreacion }], page, limit, total }`.
- Orden: `feccre DESC + id_unidad DESC`.

### GET /:id — `UNI_VER`
- 200: objeto; 404 `{ error:'NOT_FOUND' }`.

### POST / — `UNI_CREAR`
- Body Zod: `{ nombre: string[1..30], abreviatura: string[1..10],
  codigoSunat?: string[..5] (default ''), estado?: 'A'|'I' (default 'A') }`.
- 201 objeto; 400 validación; 409 `{ error:'YA_EXISTE' }` si nombre duplicado.

### PUT /:id — `UNI_EDITAR`
- Mismo body (parcial opcional salvo validaciones); 404 si no existe;
  409 si el nombre choca con otra.

### PATCH /:id/estado — `UNI_ELIMINAR`
- Body: `{ estado: 'A'|'I', confirmar?: boolean }`.
- A `I` con productos y sin `confirmar:true` → 409
  `{ error:'TIENE_PRODUCTOS', productosAsociados: N }`.
- 200 objeto actualizado; auditoría ACTIVO/DESACTIVO.

## Criterios de aceptación (Gherkin, de `unidades.md`)
1. Usuario con `UNI_CREAR` registra → se almacena correctamente.
2. Unidad activa + nuevo producto → aparece en el selector de unidades.
3. Unidad inactiva + nuevo producto → no aparece como opción.
4. Usuario sin `UNI_EDITAR` intenta modificar → 403 denegado.
5. Unidad con productos + desactivar → confirmación antes de continuar.
