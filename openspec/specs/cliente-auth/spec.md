# Spec: cliente-auth — autenticación de clientes (verdad actual)

Consolidada desde código actual. En caso de conflicto, manda el código.

## Endpoints (`/api/v1/cliente-auth`, sin authGuard excepto sesion/logout)

### POST /oauth/google (público)
- Body: `{ idToken: string[10..] }`.
- 200 `{ token, cliente: { id, email, nombre }, permisos }` — JWT cliente.
- 401 `CREDENCIALES_INVALIDAS` si token inválido.
- 503 `GOOGLE_NOT_CONFIGURED` si no hay credenciales Google.

### GET /sesion (Bearer token)
- 200 `{ id, email, nombre, permisos }` si token válido.
- 401 `CREDENCIALES_INVALIDAS` si token ausente o inválido.

### POST /logout (Bearer token)
- 200 `{ ok: true }` — invalida sesión.
- 401 si token ausente o inválido.

## Frontend
- `/cliente/login` — login con Google OAuth, chip de mesa validado por QR.
- Derivación futura: con mesa → `/cliente/mesa/:id`; sin mesa → `/cliente/inicio`.
