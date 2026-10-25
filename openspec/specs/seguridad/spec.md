# Spec: seguridad — usuarios, roles y permisos (pendiente de implementación)

## Estado actual
- Frontend: placeholder (`/admin/usuarios`).
- Backend: solo auth (login, permisos, cambio clave). Sin CRUD de usuarios/roles/permisos.
- DB: `TIPO_USUARIO`, `USUARIO`, `MODULO`, `ROL`, `PERMISO`, `ROL_PERMISO`, `USUARIO_ROL` (seeds definen roles).
- Permiso `SEG_USUARIO`, `SEG_ROL` existen en seeds.

## Endpoints existentes (`/api/v1/auth`, `authGuard`)
- `POST /login` — autenticación (usp_login, 3 intentos bloquea).
- `GET /permisos` — permisos del usuario autenticado.
- `PATCH /clave` — cambio de clave.

## Pendiente
- Backend: CRUD usuarios (POST/PUT/PATCH estado), roles, asignación de permisos.
- Frontend: implementar UI de gestión de usuarios.
- DB: activar uso de `USUARIO_ROL` para asignación dinámica.
