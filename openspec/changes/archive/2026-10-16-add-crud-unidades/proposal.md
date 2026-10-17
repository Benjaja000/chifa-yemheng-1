# Proposal: add-crud-unidades

## Por qué
El CRUD de unidades de medida (`UNIDAD_MEDIDA`) ya existe en backend
(`/api/v1/unidades`) y frontend (tab en `/admin/productos`), pero es el
único CRUD sin spec ni screen doc: rompe el flujo OpenSpec del proyecto.
Además, el tab mezcla dos dominios en una página de 1200 líneas y el
producto necesitaba las unidades como selector vivo, no como pestaña.

## Qué
Documentar el CRUD existente y extraerlo a página propia
(`/admin/unidades`, `features/admin/unidades`) según
`openspec/docs/screens/unidades.md`:
- Tabla: Nombre, Abreviatura, Código SUNAT, Productos Asociados,
  Estado, Acciones (editar/activar-desactivar).
- Modal: Nombre* (max 30), Abreviatura* (max 10, mayúsculas),
  Código SUNAT (max 5, opcional).
- Filtros nombre + estado, paginación 20, responsive
  (tabla desktop / scroll tablet / cards móvil).
- Desactivar con productos → confirmación con conteo (protección
  `TIENE_PRODUCTOS`, mismo molde que categorías).
- Auditoría crear/editar/activar/desactivar. Eliminar = estado `I`.
- Roles ADMINISTRADOR/SUPERVISOR, permisos
  `UNI_VER/CREAR/EDITAR/ELIMINAR` (módulo MANTENIMIENTO).
- `productos-page.tsx` conserva el selector vivo de unidades
  (`listarUnidadesActivas`) para el alta de productos.

## No objetivos
- TIPO_MESA (change aparte, mismo hueco de documentación).
- Exportar Excel/PDF (diferido a change propio).
- Cambios en el backend de unidades (ya verificado, sin tocar).
