# Design: add-consulta-identidad (fase 1: Clientes + ubigeo)

## Backend
| Pieza | Decisión |
|---|---|
| Token | `FACTILIZA_TOKEN` opcional en `env.ts`; ausente → `503 IDENTIDAD_NO_CONFIGURADA` sin tumbar arranque. `FACTILIZA_BASE_URL` def `https://api.factiliza.com/v1`. En `backend/.env` + Render, jamás frontend. |
| Proxy | `GET /maestros/dni/:numero`, `GET /maestros/ruc/:numero` (`authGuard` + `EMP_VER`/`CLI_VER`, como tipos-identidad). Zod path `^\d{8}$`/`^\d{11}$`, timeout 8s `AbortController`, `Bearer`, fetch nativo (sin deps). |
| Contratos | DNI → `{numero, nombres, apPaterno, apMaterno, fNacimiento?, genero?, ubigeo?}` (vacíos `''` se omiten; `sexo` M\*/F\*→M/F). RUC → `{numero, razonSocial, direccion, ubigeo?, estado, condicion, habilitado}` (`habilitado = ACTIVO && HABIDO`). Siempre `ubigeo_sunat` (puede diferir del de RENIEC). |
| por-ubigeo | `GET /maestros/distritos/por-ubigeo?ubigeo=` → `{id, nombre} \| 404`. Reutilizable en fases 2-3. `listarDistritos` intacto. |
| Errores | `400 VALIDATION_ERROR`, `404 DOCUMENTO_NO_ENCONTRADO` (`success:false`), `502 IDENTIDAD_NO_DISPONIBLE` (timeout/red/cuota), `503` sin token. |
| Caché | `Map` en memoria TTL 24h por `tipo:numero` (cuota free 100/mes). Solo por pulsación, nunca automático. |

## BD (`alter-data/add-ubigeo-distrito/`)
`01`: `ubigeo char(6)` anulable + CHECK `^\d{6}$` + UNIQUE (admite NULLs) + COMMENT.
`02_backfill`: `UPDATE` solo tripletas exactas normalizadas + `WHERE ubigeo IS NULL`;
no-conciliados quedan `NULL` para resolución manual explícita. Rollback: drop columna.

## Frontend (solo `clientes-page.tsx` + `clientes-service.ts`)
Botón Buscar junto al DNI (solo `tipoDoc==='DNI'`) y al RUC (11 dígitos), con
spinner; resuelve distrito vía `por-ubigeo` (match → preselecciona; si no,
manual + texto de referencia). RUC no habido → banner ámbar sin bloquear.
Todo lo rellenado editable; teléfono/correo/código jamás se tocan; se
sobrescribe identidad (decisión 2026-10). `404/502/503` → mensajes + manual.
Sin cambios en edición (lookup solo asiste a la creación).
