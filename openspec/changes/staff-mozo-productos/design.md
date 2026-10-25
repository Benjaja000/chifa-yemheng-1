# Diseño: Mozo - Filtros y Búsqueda de Productos

## Arquitectura
- Reutiliza `GET /api/v1/productos` con query params (ya implementado en `productos-service.ts`).
- Frontend: `ProductosPicker` en `mozo-page.tsx` → agrega inputs búsqueda/filtro + paginación.

## Endpoints backend (existentes)
| Método | Ruta | Guard | Parámetros |
|--------|------|-------|------------|
| GET | `/api/v1/productos` | `PROD_VER` | `nombre`, `categoria`, `disponible`, `estado`, `page`, `limit` |

## Frontend
- `ProductosPicker` en `mozo-page.tsx`:
  - Input búsqueda (debounce 300ms) → `nombre`
  - Select categoría (carga `/api/v1/categorias?estado=A`)
  - Select disponible (S/N/Todos)
  - Tabla con paginación (botones Anterior/Siguiente o scroll infinito)
  - Click fila → selecciona producto → input cantidad/nota → botón "Agregar"