# Spec delta: maestros — consulta de identidad y ubigeo (nuevo)

## Endpoints (`/api/v1/maestros`, `authGuard`)

### GET /dni/:numero y GET /ruc/:numero (permiso `EMP_VER` o `CLI_VER`)
- Path Zod `^\d{8}$` / `^\d{11}$` → 400 `VALIDATION_ERROR`.
- Proxy a Factiliza (`{base}/dni|ruc/info/{n}`, `Bearer FACTILIZA_TOKEN`,
  timeout 8s). Sin token → 503 `IDENTIDAD_NO_CONFIGURADA`.
- 200 normalizado (ver `design.md`); `success:false` → 404
  `DOCUMENTO_NO_ENCONTRADO`; fallo red/timeout/cuota → 502
  `IDENTIDAD_NO_DISPONIBLE`.
- Caché en memoria 24h por `tipo:numero` (cuota free 100/mes).

### GET /distritos/por-ubigeo?ubigeo= (permiso `EMP_VER` o `CLI_VER`)
- Query `ubigeo` 6 dígitos → 400 si formato inválido.
- 200 `{ id, nombre }` del `distrito.ubigeo` exacto; 404 si no existe.
- Requiere migración `add-ubigeo-distrito` (columna + backfill).
