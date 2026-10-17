# Design: add-crud-unidades

## Backend (ya construido, sin cambios)
| Pieza | Decisión |
|---|---|
| Capas | `schemas/unidad.ts` (Zod) → `models/unidad.ts` → `repositories/unidades-repository.ts` → `services/unidades-service.ts` → `controllers/unidades-controller.ts` → `routes/unidades.ts`, montado en `app.ts` (`/api/v1/unidades`). Molde clonado de categorías. |
| Unicidad | `existeNombre` (ilike `n_unidad`) → 409 `YA_EXISTE`. |
| Protección | `contarProductos(id_unidad)`; desactivar a `I` con asociados y sin `confirmar:true` → 409 `TIENE_PRODUCTOS` + conteo. |
| Orden | Listados nuevo→antiguo: `feccre DESC + id_unidad DESC` (regla universal `project.md`). |
| Auditoría | `CREAR_UNIDAD / EDITAR_UNIDAD / ACTIVAR_UNIDAD / DESACTIVAR_UNIDAD` en tabla `AUDITORIA`. |
| Permisos | `UNI_VER/CREAR/EDITAR/ELIMINAR` → módulo `MANTENIMIENTO`, roles ADMINISTRADOR + SUPERVISOR (`permiso-crud-unidades.sql`, idempotente). |

## Frontend — decisión de split: página propia vs tab
Se elige **página propia** (`/admin/unidades`) porque:
- El tab duplicaba estado y handlers dentro de una página de 1200 líneas.
- Unidades es catálogo maestro reutilizable (hoy lo usa productos; mañana inventario/recetas).
- El patrón del proyecto es una página por dominio (`categorias`, `productos`, `mesas`).

## Frontend (extracción)
| Pieza | Decisión |
|---|---|
| Carpeta | `features/admin/unidades/` con `unidades-page.tsx` + `unidades-service.ts` + `unidades-types.ts` movidos desde `productos/`. |
| Página | `UnidadesPage`: 13 `useState`, `cargarUnidades`, `abrirNuevaUnidad/abrirEditarUnidad/guardarUnidad/toggleUnidad`, `Toggle` local (convención del proyecto: helpers duplicados por página). |
| Productos | Conserva `unidadesSel` + `listarUnidadesActivas()` en `cargar()` y el select del modal producto (`[]` si la API falla, nunca hardcodear). |
| Ruta | `/admin/unidades` con `RoleGuard ADMINISTRADOR/SUPERVISOR`; item "Unidades" (icono `straighten`) en grupo "Gestión de carta" del `AdminShell`. |
| Errores | `YA_EXISTE` → mensaje; desactivar con asociados → diálogo de confirmación con conteo; error de red → banner + reintentar. |
