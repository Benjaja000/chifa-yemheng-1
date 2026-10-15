# Spec: auth — login personal, permisos y clave (verdad actual)

Consolidada desde `changes/add-login-seguridad/specs/auth-login/spec.md` +
`changes/add-perfil-clave/specs/auth/spec.md`, verificada contra código.
En caso de conflicto, manda el código.

## POST /api/v1/auth/login (público)
- Body Zod: `{ logeo: string[3..30], clave: string[1..100] }` → 400 `VALIDATION_ERROR`.
- 200: `{ token, usuario: { id, logeo, tipo, empleado, cargo }, roles, permisos, rutaInicial }`. JWT 8h.
- 401: `CREDENCIALES_INVALIDAS` | `BLOQUEADO` | `INACTIVO` (`fn_login`: 3er fallo bloquea, resetea intentos y `f_ultimoacceso` al éxito).
- 500 `INTERNAL_ERROR` ante fallo BD.
- **Bug conocido pendiente:** un error no-`LoginError` (ej. caída de red a Supabase) se relanza desde el controller y tumba el proceso en Express 4. Fix propuesto (no aplicado): responder `503` en vez de relanzar.

## GET /api/v1/auth/permisos · PATCH /api/v1/auth/clave (`authGuard`)
- Permisos: 200 `{ permisos: [{ modulo, orden, clave, permiso }] }` (solo concedidos y vigentes).
- Clave: body `{actual[1..100], nueva[4..100]}`; `nueva==actual` → validación; 200 `{ok:true}` con `clave=sha256(nueva)`, `intentos=0`, auditoría `CAMBIO_CLAVE`; actual incorrecta → 401 + `intentos+1`/bloqueo.

## Frontend
- `/auth/login` (shell público, `PublicGuard`): AuthContext + JWT en `localStorage`, `rutaInicial` por rol.
- Guards: sin JWT → `/auth/login`; menú = unión de permisos (`fn_permisos_usuario`).
- Criterio: `fran/fran` → JWT + `/admin`; clave mala → 401; bloqueado + clave buena → `BLOQUEADO`.
