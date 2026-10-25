# Tareas: Mozo - Filtros y Búsqueda de Productos

## Spec y diseño
- [x] `proposal.md`, `design.md`, `tasks.md`

## Backend
- [ ] Verificar `GET /api/v1/productos` acepta `nombre`, `categoria`, `disponible`, `estado`, `page`, `limit` (ya implementado en `productos-service.ts`).
- [ ] `GET /api/v1/categorias?estado=A` para select filtro.

## Frontend
- [ ] `features/staff/mozo/ProductosPicker.tsx` (nuevo componente extraído de `mozo-page.tsx`):
  - [ ] Input búsqueda con debounce 300ms → `nombre`
  - [ ] Select categoría (carga `/categorias?estado=A`)
  - [ ] Select disponible: 'S' / 'N' / 'Todos'
  - [ ] Tabla con columnas: Producto, Categoría, Precio, Stock, Acciones
  - [ ] Paginación: botones Anterior/Siguiente + indicador página
  - [ ] Click fila → selecciona → muestra input cantidad + nota → btn "Agregar"
- [ ] `mozo-page.tsx` → usa `ProductosPicker` en modal "Agregar producto".

## Backend
- [ ] Verificar `productos-service.ts` `listarProductos()` maneja todos los filtros.
- [ ] Verificar `categorias-service.ts` `listarCategoriasActivas()` retorna activas.

## Verificación
- [ ] `npm run build` frontend OK
- [ ] Test manual: buscar "chaufa" → resultados filtrados
- [ ] Test filtro categoría "Platos" → solo platos
- [ ] Paginación funciona (página 1, 2, 3...)