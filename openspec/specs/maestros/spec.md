# Spec: maestros — datos maestros y consulta de identidad (verdad actual)

Consolidada desde `changes/add-consulta-identidad/specs/maestros/spec.md` + código.
En caso de conflicto, manda el código.

## Endpoints (`/api/v1/maestros`, `authGuard`)

### Ubicación (permiso `EMP_VER` o `CLI_VER`)
- `GET /departamentos` — departamentos activos.
- `GET /provincias` — provincias activas con departamento.
- `GET /distritos` — distritos activos.
- `GET /distritos/por-ubigeo?ubigeo=` — resuelve ubigeo (6 dígitos) a `{ id, nombre }`. 404 si no existe. Requiere migración `add-ubigeo-distrito`.

### Personal (permiso `EMP_VER`)
- `GET /cargos` — cargos activos.
- `GET /contratos` — tipos de contrato activos.
- `GET /tipos-identidad` — tipos de identidad activos.

### Consulta de identidad (permiso `EMP_VER` o `CLI_VER`)
- `GET /dni/:numero` — proxy Factiliza RENIEC. Path `^\d{8}$` → 400 `VALIDATION_ERROR`.
  - 200 normalizado. `success:false` → 404 `DOCUMENTO_NO_ENCONTRADO`.
  - Sin token → 503 `IDENTIDAD_NO_CONFIGURADA`.
  - Fallo red/timeout/cuota → 502 `IDENTIDAD_NO_DISPONIBLE`.
  - Caché en memoria 24h por `tipo:numero` (cuota free 100/mes).
- `GET /ruc/:numero` — proxy Factiliza SUNAT. Path `^\d{11}$` → 400 `VALIDATION_ERROR`.
  - Mismos códigos de error que DNI.
