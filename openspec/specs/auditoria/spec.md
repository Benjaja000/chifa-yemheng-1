# Spec: auditoria

## Estado actual
- Frontend: consulta paginada con filtros por usuario, tabla, acción y fechas; el detalle se abre en un modal legible con motivo, cambios y datos del evento.
- Backend: endpoint `GET /api/v1/auditoria`, protegido por autenticación y `AUD_VER`; no hay rutas de escritura para la interfaz.
- DB: escrituras de auditoría en cambios críticos dentro de la misma transacción; las credenciales se excluyen de los valores registrados.

## Acciones cubiertas
- Apertura de caja, cobros y pagos mixtos, movimientos de caja y solicitud/validación del cierre.
- Creación y modificación de usuarios y roles, asignación de permisos, cambios de contraseña (sin guardar ni comparar hashes).
- Cambios relevantes en pedidos, emisión de notas de crédito y registro de ventas.
- Filtros de consulta: usuario, tabla, acción y rango de fechas; detalle de valores anteriores/nuevos y motivo asociado al evento.
- Motivos de cambios administrativos se conservan en cada evento; los registros históricos sin motivo se muestran como "No registrado".
- `pccre` y `pcmod` guardan automáticamente la IP del cliente resuelta por Express; no se permite sobrescribirla con un nombre de dispositivo enviado por el navegador. Las columnas admiten IPv6.

## Protección y datos sensibles
- La consulta requiere `AUD_VER`; está disponible solo mediante `GET`.
- No se guardan contraseñas ni hashes; tampoco se incluyen referencias de pago, bancos ni datos confidenciales.
- Los cambios de contraseña se presentan como una acción completada, sin exponer claves ni hashes. Las acciones sin motivo requerido se muestran como "No aplica".
- El backend solo interpreta `X-Forwarded-For` cuando `TRUST_PROXY_HOPS` configura explícitamente la cantidad de proxies de confianza; el valor predeterminado es cero.
- Las funciones y triggers de auditoría son `SECURITY INVOKER`; los eventos se insertan en la transacción que realiza el cambio.
