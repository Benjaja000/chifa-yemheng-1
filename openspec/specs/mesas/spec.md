# Spec: mesas — CRUD, QR rotativo y resolución por QR (verdad actual)

Consolidada desde `changes/add-crud-mesas/specs/mesas/spec.md` +
`changes/add-qr-seguro/specs/mesas/spec.md` + trabajo posterior (by-qr,
candado anti-desync), verificada contra código. En caso de conflicto, manda el código.

## CRUD (`/api/v1/mesas`, `authGuard`)
- `GET /` (`MESA_VER`): `page` def 1, `limit` 1..100 def 20, `ambiente`, `estado A|I`, `buscar` ilike → `{ data:[{ id, numero, ambienteId, ambiente, capacidad, tipoId, tipo, cargoServicio, estadoOperativoId, estadoOperativo, color, detalle, qr, estado }], page, limit, total }`.
- `GET /:id` (`MESA_VER`) → 404. `GET /ocupacion` (pedidos abiertos, sin `qr`).
- `POST /` (`MESA_CREAR`): `{ ambienteId, numero[1..5], capacidad 1..99, tipoId, detalle?[..100], estado? def A }` → 201 con `qr=yemheng.pe/m/{NUM}-{TOKEN8}` generado (3 reintentos ante colisión UNIQUE); 409 `YA_EXISTE` por ambiente; 422 ambiente/tipo inválido.
- `PUT /:id` (`MESA_EDITAR`, parcial): número/ambiente que choca → 409.
- `PATCH /:id/estado` (`MESA_ELIMINAR`): `{ estado:'A'|'I' }` → 200.
- Ambientes: `GET /ambientes/todos`, `POST`, `PUT /:id`, `PATCH /:id/estado` (mismos guards).

## QR rotativo + candado anti-desync
- `PUT` acepta `regenerarQr?` (def `false`). `false` + cambio de número → **422 `QR_DESINCRONIZADO`** (cambio de conducta posterior a los deltas, que decían "mantiene QR": el código actual bloquea; caso real que lo motivó: `M-65` vs QR `M-67`).
- `regenerarQr:true` → `codigo_qr` nuevo `yemheng.pe/m/{NUM_FINAL}-{TOKEN8}`, anterior invalidado (reimprimir).

## Resolución por QR (cierra T6 de add-qr-seguro)
- `GET /api/v1/mesas/by-qr?codigo=` **público** (sin sesión; el QR físico es el secreto; registrado antes de `authGuard` y de `/:id`).
- Acepta código corto (`01-AbCd1234`), completo (`yemheng.pe/m/...`) y URL escaneada (`?...mesa=...`); mesas `estado<>'A'` → 404 `QR_INVALIDO`. Sin el fix, el corto nunca igualaba al `codigo_qr` completo.

## Admin QR (frontend)
- `qrValor()` codifica `${VITE_PUBLIC_URL}/cliente/login?mesa=<codigo>` (`encodeURIComponent`); sin código, URL pelada. `codigo_qr` en BD intacto.
- Render/descarga PNG 512/impresión de detalle y hoja por ambiente; errores visibles (sin SVG o popup bloqueado → aviso, no silencio).
- Regla operativa: los impresos congelan la URL del momento; al cambiar dominio/IP, reimprimir desde el admin del entorno final.
