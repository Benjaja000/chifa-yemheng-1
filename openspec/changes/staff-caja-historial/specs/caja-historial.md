# Spec: Caja Historial y Movimientos (`/api/v1/caja`)

## Objetivo
Consultar movimientos del turno activo y historial de turnos cerrados.

## Requisitos

### REQ-1: Movimientos turno activo
- **Given** turno de caja activo (`situacion='A'`)
- **When** `GET /api/v1/caja/movimientos`
- **Then** retorna `MOVIMIENTO_CAJA[]` del turno con: concepto, método, monto, descripción, fecha, usuario.

### REQ-2: Historial turnos
- **Given** cajero autenticado
- **When** `GET /api/v1/caja/historial?page=1&limit=20&desde=2026-01-01&hasta=2026-01-31`
- **Then** retorna `{ data: Turno[], page, limit, total }` con:
  - `id`, `caja`, `numeroTurno`, `fApertura`, `fCierre`, `montoInicial`, `montoSistema`, `montoDeclarado`, `diferencia`, `situacion`, `usuario`.

### REQ-3: Totales por turno
- Ingreso = suma movimientos `id_tipomovimiento=1` (INGRESO)
- Egreso = suma movimientos `id_tipomovimiento=2` (EGRESO)
- Diferencia = `montoDeclarado - montoSistema`.

## Errores
- 400 `VALIDATION_ERROR` · 401 · 403 · 500 `DB_*`.