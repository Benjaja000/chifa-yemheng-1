# Propuesta: Tests Automatizados (Unit + E2E)

## Problema
- No hay tests automatizados en backend ni frontend.
- Cambios pueden romper funcionalidad sin detectarse.

## Alcance
- **Backend**: `vitest` unit tests para services/repositories (`caja-service`, `pedidos-service`, `pedidos-repository`).
- **Frontend**: `vitest` + `React Testing Library` para componentes críticos (`CobroModal`, `ProductosPicker`, `CocinaBoard`).
- **E2E**: Playwright flows críticos (login → cobro → cierre, mozo flujo completo).
- **CI/CD**: GitHub Actions workflow (`test`, `build`, `lint`).

## Fuera de alcance
- Tests de carga / performance (k6).
- Visual regression (Chromatic).

## Criterios de aceptación
- `npm run test` pasa en backend y frontend.
- `npm run test:e2e` pasa flows críticos.
- Cobertura ≥ 70% en services/repositories críticos.
- CI pasa en PRs.