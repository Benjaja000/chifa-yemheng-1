# Spec: Mozo Filtros y Búsqueda Productos

## Objetivo
Modal "Agregar producto" con búsqueda, filtros y paginación para catálogo grande.

## Requisitos

### REQ-1: Búsqueda por nombre
- **Given** modal "Agregar producto" abierto
- **When** mozo escribe en input búsqueda
- **Then** `GET /api/v1/productos?nombre=...` con debounce 300ms → lista filtrada en < 500ms.

### REQ-2: Filtro por categoría
- **Given** modal abierto
- **When** selecciona categoría en select
- **Then** `GET /api/v1/productos?categoria=...` → filtra productos.

### REQ-3: Filtro disponibilidad
- **Given** modal abierto
- **When** selecciona "Disponible" / "No disponible" / "Todos"
- **Then** `GET /api/v1/productos?disponible=S|N|` → filtra.

### REQ-4: Paginación
- **Given** resultados > límite
- **When** hace click "Siguiente" / "Anterior"
- **Then** `page` / `limit` actualizados → nueva petición.

### REQ-5: Selección y agregar
- **Given** lista filtrada
- **When** click fila → selecciona producto → input cantidad + nota → "Agregar"
- **Then** `POST /pedidos/:id/detalles` + `recalcular` → modal cierra → comanda actualizada.

## Errores
- 400 `VALIDATION_ERROR` · 401 · 403 · 500 `DB_*`.