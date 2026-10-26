# Design: add-nota-credito-venta

## Reutilización de la lógica existente
`usp_anular_venta_con_nc(p_id_venta, p_usuario, p_motivo, OUT ...)` ya implementa:
validación de venta (no anulada, `Total` no nulo), motivo obligatorio, permiso
`VEN_NOTACREDITO`, referencia boleta(03)/factura(01), serie 07 con `FOR UPDATE`,
INSERT en `NOTA_CREDITO`, UPDATE `VENTA.Anulada='S'`, egreso
`DEVOLUCION A CLIENTE` en el turno abierto y auditoría `NOTA_CREDITO/INSERT`.

## Decisión clave: wrapper `fn_*`
La convención del proyecto prohíbe invocar `usp_*` con OUT params vía
`supabase.rpc`. Se crea `fn_anular_venta_con_nc`, que hace `CALL` y
`RETURN QUERY` como TABLE (archivo
`openspec/database/alter-data/add-nota-credito-wrapper/01_fn_anular_venta_con_nc.sql`).

## Mapeo de errores DB → API
`inexistente` → 404 `VENTA_NO_EXISTE`; `anulada`/`inactiva` → 409 `VENTA_ANULADA`;
`permiso` → 403 `SIN_PERMISO`; `motivo` → 400 `VALIDATION_ERROR`;
`turno abierto` → 409 `NO_CAJA_ABIERTA`; `serie` → 409 `SERIE_NC_NO_DISPONIBLE`.

## Decisiones
1. **Doble control de permiso**: `requirePermisos('VEN_NOTACREDITO')` en la ruta
   + validación interna del procedimiento (defensa en profundidad, BR-ACC-055).
2. **Atomicidad**: toda la operación ocurre dentro de la función DB.
3. **Auditoría**: la genera el procedimiento; el backend no la duplica.

## Riesgos
- `SECURITY DEFINER` requerido si `supabase.rpc` no usa `service_role`.
- Venta de ticket ('TK'): la referencia serie/numero queda NULL.
