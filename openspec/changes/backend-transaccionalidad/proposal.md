# Propuesta: Transaccionalidad Cobro (Rollback Atómico)

## Problema
- El proceso `POST /api/v1/caja/cobro` ejecuta una secuencia de INSERT/UPDATE en múltiples tablas (`VENTA`, `DETALLE_VENTA`, `BOLETA`/`FACTURA`, `PAGO_VENTA`, `MOVIMIENTO_CAJA`, `PEDIDO`, `MESA`, `SERIE_DOCUMENTO`) **sin transacción**.
- Si falla en el paso 5 de 8, los pasos 1-4 ya están commitados → **inconsistencia de datos** (venta sin boleta, movimiento sin venta, etc.).
- No hay rollback automático ante fallo.

## Alcance
- Envolver toda la lógica de `cobrar()` en una **transacción Supabase** (pg `BEGIN` / `COMMIT` / `ROLLBACK`).
- Si cualquier paso falla → rollback completo, ningún cambio persistido.
- Mantener misma API y códigos de error.

## Fuera de alcance
- Transaccionalidad en otros endpoints (future changes).
- Compensación automática de errores de red (retry logic).

## Criterios de aceptación
- Cobro exitoso → todos los pasos commitados.
- Fallo en paso intermedio (ej. serie no existe) → **ningún cambio persistido** en BD.
- Mismos códigos de error devueltos al cliente.