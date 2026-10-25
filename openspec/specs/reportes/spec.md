# Spec: reportes — (pendiente de implementación)

## Estado actual
- Frontend: placeholder (`/admin/reportes`).
- Backend: sin route dedicado. Parcial: `GET /api/v1/dashboard/resumen` (KPIs).
- DB views: `VW_VENTAS_DIARIAS`, `VW_PRODUCTOS_MAS_VENDIDOS`, `VW_ARQUEO_CAJA`.

## Endpoints existentes (parciales)
- `GET /api/v1/dashboard/resumen` (`dashboardRouter`) — KPIs del dashboard.

## Pendiente
- Backend: endpoints para reportes de ventas, productos, arqueo.
- Frontend: implementar UI de reportes con gráficos.
- DB: vistas ya existen, falta exponerlas vía API.
