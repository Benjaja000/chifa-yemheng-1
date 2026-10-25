# Propuesta: Mozo - Filtros y Búsqueda de Productos

## Problema
- El modal "Agregar producto" en `/admin/mozo` carga todos los productos sin filtros.
- Con catálogo grande, encontrar un producto es lento.
- No hay búsqueda por nombre ni filtro por categoría.

## Alcance
- `GET /api/v1/productos` con filtros: `nombre`, `categoriaId`, `disponible`, `estado`, `page`, `limit`.
- Frontend: `ProductosPicker` con input búsqueda, select categoría, paginación.
- Backend: ya existe `listarProductos` en `productos-service.ts` con filtros.

## Fuera de alcance
- Crear/editar productos desde mozo (solo admin).
- Stock en tiempo real (solo lectura).

## Criterios de aceptación
- Mozo busca "chaufa" → lista filtrada en < 500ms.
- Filtro categoría "Platos" → solo platos.
- Paginación funciona (scroll infinito o botones).