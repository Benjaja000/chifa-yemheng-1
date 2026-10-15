# Spec: cliente — login `/cliente/login` (verdad actual)

Consolidada desde `changes/add-cliente-login-prueba/specs/cliente/spec.md` +
trabajo posterior (chip centrado, botón cámara, validación by-qr),
verificada contra código. En caso de conflicto, manda el código.

## CLI-LOGIN-P1 · Ruta pública
`GET /cliente/login` (shell público, sin guards; `PublicGuard` rebotaría a staff).
Acepta `?mesa=<código>`; abrirla directo nunca retorna 404 (rewrite SPA).

## CLI-LOGIN-P2 · Chip de mesa validado y centrado
Con `?mesa=` no vacío la tarjeta muestra `Mesa <número>` **centrada**, donde
número = código sin sufijo `-TOKEN8` (`01-AbCd1234` → `01`).
Estados: `Verificando…` → `Mesa NN · ambiente` (by-qr 200) | `QR inválido…`
(by-qr 404) | fallback a `Mesa NN` sin conexión (no bloquea en LAN/dev).
Supera al delta original ("muestra el código tal cual, sin validar").

## CLI-LOGIN-P3 · Todo deshabilitado y veraz
Botón Google, inputs (`readOnly`), checkbox y submit `disabled`. Prohibido:
credenciales hardcodeadas, badges SSL, lealtad inventada, links muertos,
auto-registro.

## CLI-LOGIN-P4 · Nota de fase y salida a staff
Informa fase futura y enlaza `/auth/login` para el personal. Sin sesión propia.

## CLI-LOGIN-P5 · QR admin apunta a la prueba
Igual que delta: `${VITE_PUBLIC_URL}/cliente/login?mesa=<código>` con
`encodeURIComponent`; sin código, URL pelada; `codigo_qr` intacto.

## CLI-LOGIN-P6 · Sin mesa = entrada web válida
Sin `?mesa=` no es error: login web (delivery/reservas/hub) en PC y móvil.

## CLI-LOGIN-P7 · Derivación futura (no implementada)
Con `?mesa=` → `/cliente/mesa/:id` (comanda); sin mesa → `/cliente/inicio` (hub).

## CLI-LOGIN-P8 · Aviso contextual + cámara solo-preview
Sin `?mesa=`: PC muestra entrada web y **nunca** invita a escanear; móvil
muestra "¿Estás en el local?" + `Escanea el código QR:` + botón que abre
modal con `<video>` en vivo (`facingMode: environment`). **Solo vista
previa: no decodifica ni redirige.** Requiere contexto seguro (HTTPS/localhost);
en HTTP LAN muestra el error y ofrece foto como fallback. Cierre por X,
backdrop y `Escape`, con limpieza de tracks.
