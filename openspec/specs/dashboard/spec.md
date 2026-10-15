# Spec: dashboard — panel operativo sin hardcode (verdad actual)

Consolidada desde `changes/add-panel-admin/specs/dashboard/spec.md` +
`changes/add-dashboard-graficos/specs/dashboard/spec.md` (este último
**sustituye**: `ventasDia` 14 días reemplaza `linea6Meses`/`ventasHora`, y los
fallbacks estáticos se reemplazan por estados vacíos), verificada contra
código. En caso de conflicto, manda el código.

## Endpoint (`GET /api/v1/dashboard/resumen`, `authGuard`, `DASHBOARD_VER`)
- Sin query. 401 sin token, 403 sin permiso.
- 200: `ventasHoy{total,comandas}`, `pedidos{activos,abiertos,cocina,porCobrar}`,
  `mesas{ocupadas,total}`, `reservasPendientes`, `actividad[]` (últimas filas de
  `AUDITORIA` con "hace X"), `ultimasVentas[]`, `stockBajo[]`,
  `ventasDia[]` (14 días incl. hoy, `anulada=N`, días sin venta en 0),
  `donaPlatos` (top5 real 30d por cantidad).
- Prohibido hardcodear datos de negocio: en vacío/error, ceros y arreglos
  vacíos con estados vacíos en UI (`Sin ventas en el rango`, `Sin datos de
  platos`, `Sin ventas registradas`, `Sin alertas de stock`).

## Frontend (`/admin`, índice)
KPIs reales, barras (suman activos), gauge `ocupadas/total` (`0/0→0%`),
ticket `total/comandas` (`—` si 0), dona ~100%, refresh 30s sin skeleton +
badge hora + botón manual, timeline 5 filas, tablas 5 filas, responsive.
