# Tareas: Tests Automatizados (Unit + E2E)

## Spec y diseño
- [ ] `proposal.md`, `design.md`, `tasks.md`

## Backend (vitest)
- [ ] Configurar `vitest` en `backend/package.json`
- [ ] Unit tests `caja-service.ts`: `cobrarService` (éxito, error TOTAL_CERO, NO_CAJA_ABIERTA, FACTURA_CLIENTE_REQUERIDO)
- [ ] Unit tests `pedidos-service.ts`: `abrirService`, `agregarDetalleService`, `pedirCuentaStaffService`
- [ ] Unit tests `pedidos-repository.ts`: `listarPedidosCocina`, `cobrar` (mock supabase)
- [ ] Cobertura ≥ 70% en services/repositories

## Frontend (vitest + React Testing Library)
- [ ] `CobroModal`: render, validaciones, submit éxito/error
- [ ] `ProductosPicker`: búsqueda, filtro categoría, selección, agregar
- [ ] `CocinaBoard`: render tickets, botones P/E/S/A, polling/SSE

## E2E (Playwright)
- [ ] Flow: login `fran.cocina` → cocina board → cambiar estado P→E→S
- [ ] Flow: login `fran.mozo` → grid mesas → abrir comanda → agregar productos → pedir cuenta
- [ ] Flow: login `fran.caja` → abrir turno → cobro boleta/factura → cerrar turno

## CI/CD (GitHub Actions)
- [ ] `.github/workflows/ci.yml`: `test`, `build`, `lint` en PRs

## Verificación
- [ ] `npm run test` backend → pass
- [ ] `npm run test` frontend → pass
- [ ] `npm run test:e2e` → pass
- [ ] Cobertura ≥ 70% services/repositories