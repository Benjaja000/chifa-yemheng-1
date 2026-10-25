# Spec: Permisos por área de navegación

## Principio
- Autorización final = Rol + Permiso (BR-ACC-036). Orden de validación: AuthGuard → RoleGuard/PermissionGuard (02-guards.md).
- El JWT de cliente no lleva permisos de staff: el área `/cliente/*` se autoriza con `clienteAuthGuard` + pertenencia/participación (ver specs cliente).
- El staff valida por ruta en backend con `requirePermisos(...)` y por área en frontend (Fase B, `AreaGuard`): si el usuario no tiene ninguno de los permisos del área, se redirige al login (403 si ya autenticado).

## Matriz área → permiso → rutas backend
| Área | Rutas backend existentes | Permisos |
|------|-------------------------|----------|
| MESAS | `/api/v1/mesas`, `/tipos-mesa` | MESA_VER, MESA_CREAR, MESA_EDITAR, MESA_ELIMINAR, TMESA_* |
| MOZO/PEDIDOS | `/api/v1/pedidos` | PED_VER, PED_REGISTRAR, PED_ANULAR, PED_COCINA, PED_DESCUENTO |
| COCINA | PATCH `/pedidos/:id/detalles/:d/preparacion` | PED_COCINA (o PED_REGISTRAR transitorio) |
| CAJA/VENTAS | rutas futuras | CAJA_APERTURA, CAJA_CIERRE, CAJA_ARQUEO, VEN_COBRAR, VEN_NOTACREDITO |
| SEGURIDAD | `/api/v1/personal`, `/personas` | EMP_*, PER_* |
| CLIENTE | `/api/v1/cliente/**` | clienteAuthGuard (JWT Gmail, BR-ACC-044) |

## Seed de permisos
- Claves citadas por las pantallas deben existir en `permiso` (seed idempotente `permiso-modulo.sql`).
- Este cambio verifica/asegura: `CLIENTE_QR`, `CLIENTE_PEDIDOS`, `PED_COCINA`, `VEN_COBRAR`.
