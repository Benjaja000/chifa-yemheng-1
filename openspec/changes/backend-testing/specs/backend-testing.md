# Spec: Tests Automatizados (Unit + E2E)

## Objetivo
Cobertura de tests para garantizar calidad y prevenir regresiones.

## Requisitos

### REQ-1: Unit Tests Backend (vitest)
- **Given** services/repositories críticos
- **When** `npm run test`
- **Then** tests pasan con cobertura ≥ 70% en:
  - `caja-service.ts`: `cobrarService`, `abrirCajaService`, `listarCajaMaestros`
  - `pedidos-service.ts`: `abrirService`, `agregarDetalleService`, `pedirCuentaStaffService`, `cocinaService`
  - `pedidos-repository.ts`: `listarPedidosCocina`, `cobrar`, `recalcularPedido`

### REQ-2: Unit Tests Frontend (vitest + React Testing Library)
- **Given** componentes críticos
- **When** `npm run test`
- **Then** tests pasan para:
  - `CobroModal`: render, validaciones, submit éxito/error
  - `ProductosPicker`: búsqueda, filtro categoría, selección, agregar
  - `CocinaBoard`: render tickets, botones P/E/S/A, polling/SSE

### REQ-3: E2E Tests (Playwright)
- **Given** app corriendo
- **When** `npm run test:e2e`
- **Then** flows pasan:
  - **Cocina**: login `fran.cocina` → board → cambiar P→E→S→A
  - **Mozo**: login `fran.mozo` → grid mesas → abrir comanda → agregar productos → pedir cuenta
  - **Caja**: login `fran.caja` → abrir turno → cobro boleta/factura → cerrar turno

### REQ-4: CI/CD (GitHub Actions)
- **Given** PR abierto
- **When** push/PR
- **Then** workflow ejecuta: `lint` → `test` (backend+frontend) → `build` → `test:e2e`

## Errores
- Ninguno (tests pasan = éxito).