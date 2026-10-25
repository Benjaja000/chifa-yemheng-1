# Spec: Caja Cierre y Arqueo (`/api/v1/caja/cierre`)

## Objetivo
Permitir al cajero cerrar su turno de caja con arqueo, consultar historial de turnos y generar reporte Z diario.

## Requisitos

### REQ-1: Cerrar turno con arqueo
- **Given** un turno de caja activo (`situacion='A'`) para la caja del usuario
- **When** `POST /api/v1/caja/cierre` con `cajaId`, `montoDeclarado`
- **Then** se valida turno activo → calcula `diferencia = montoDeclarado - montoSistema` → actualiza `APERTURA_CAJA` (`situacion='C'`, `fCierre=now()`, `montoDeclarado`, `diferencia`) → `CAJA.Aperturada='N'` → audita `CERRAR_CAJA` → retorna `{ id, diferencia, montoSistema, montoDeclarado }`.

### REQ-2: Listar movimientos del turno
- **Given** un turno activo
- **When** `GET /api/v1/caja/movimientos`
- **Then** retorna lista de `MOVIMIENTO_CAJA` del turno con concepto, método, monto, descripción.

### REQ-3: Historial de turnos
- **Given** cajero autenticado
- **When** `GET /api/v1/caja/historial?page=1&limit=20`
- **Then** retorna turnos paginados con `id`, `caja`, `numeroTurno`, `fApertura`, `fCierre`, `montoInicial`, `montoSistema`, `montoDeclarado`, `diferencia`, `situacion`, `usuario`.

### REQ-4: Reporte Z diario
- **Given** fecha inicio/fin
- **When** `GET /api/v1/caja/reporte-z?desde=2026-01-01&hasta=2026-01-31`
- **Then** retorna:
  - Por método de pago: cantidad, monto total
  - Por tipo documento (01/03): cantidad, monto
  - Totales: ventas, cobrado, diferencias
  - Por caja: ventas, cobrado

## Errores
- 400 `VALIDATION_ERROR` · 404 `NO_TURNO_ACTIVO` · 409 `TURNO_YA_CERRADO` · 500 `DB_*`.