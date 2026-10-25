# Spec: auditoria — (pendiente de implementación)

## Estado actual
- Frontend: placeholder (`/admin/auditoria`).
- Backend: sin endpoint de lectura. Escritura vía `auditar()` en repositorios y triggers.
- DB: tabla `AUDITORIA` (sin query endpoint). `touch_audit` trigger en todas las tablas.

## Endpoints existentes (escritura implícita)
- Muchos repositorios llaman `auditar()` para insertar en `AUDITORIA`.
- Triggers: `tr_producto_auditoria`, `tr_venta_auditoria`, `touch_audit`.

## Pendiente
- Backend: endpoint de consulta con filtros (usuario, tabla, fecha, acción).
- Frontend: implementar UI de consulta de auditoría.
- DB: índices para consultas por fecha/usuario.
