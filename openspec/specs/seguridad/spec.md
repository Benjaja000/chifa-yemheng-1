# Spec: seguridad — usuarios, roles y permisos

## Endpoints (`/api/v1/seguridad`, `authGuard`)

- `GET /usuarios?page=&limit=&buscar=&estado=` — lista usuarios.
- `POST /usuarios` — crea una cuenta vinculada a un empleado; la clave se almacena con SHA-256 como requiere el login legado.
- `PUT /usuarios/:id` — actualiza tipo, empleado o estado; al definir una nueva clave reinicia intentos y desbloquea la cuenta.
- `GET /tipos-usuario` — tipos de cuenta activos.
- `GET /roles?page=&limit=&buscar=&estado=` / `POST /roles` / `PUT /roles/:id` — consulta, crea y actualiza roles.
- `GET /permisos` — catálogo de permisos.
- `GET /roles/:id/permisos` / `PUT /roles/:id/permisos` — consulta y reemplaza la asignación del rol de forma atómica.

## Autorización y reglas

- Usuarios requieren `SEG_USUARIO`; roles y permisos requieren `SEG_ROL`.
- Solo un administrador activo puede crear o modificar cuentas, roles o permisos que otorguen privilegios de administrador.
- Un actor no puede conceder permisos que no posee; no se permiten permisos inexistentes o inactivos.
- Toda cuenta debe estar vinculada a un empleado activo y vigente. Al cesar o inactivarse el empleado, sus cuentas se desactivan.
- Las ediciones de acceso requieren un motivo de al menos 8 caracteres; el usuario no puede modificar su propia cuenta desde la administración.
- El cambio de clave desde el perfil sigue permitido mediante `fn_cambiar_clave`; un cambio de acceso incrementa la versión de sesión e invalida JWT anteriores.
- No se puede desactivar, bloquear, desvincular ni degradar al último administrador activo. Se define como administrador a una cuenta activa y desbloqueada, vinculada a un empleado vigente, con rol `ADMINISTRADOR` activo y permisos `SEG_USUARIO` y `SEG_ROL`.
- La edición de un rol y sus permisos se realiza dentro de una sola transacción. Los intentos de escalada, la falta de motivo y la protección del último administrador se responden como errores de negocio, no como fallos genéricos.
- La auditoría conserva actor, terminal, motivo y valores de cambio; nunca registra claves, tokens ni datos de pago confidenciales.
- `authGuard` verifica en cada petición el estado de la cuenta y del empleado y compara la versión de sesión del JWT con la de la base de datos.
- Las cuentas se desactivan en vez de borrarse físicamente para conservar trazabilidad.
- La UI muestra carga, error y vacío por separado y permite crear/editar usuarios y roles.

## Persistencia

- `USUARIO`, `TIPO_USUARIO`, `EMPLEADO`, `ROL`, `PERMISO`, `ROL_PERMISO`.
- El reemplazo de permisos de rol usa `fn_guardar_rol_seguridad` / `fn_asignar_permisos_rol_seguridad`; la migración `20261027180411_security_user_role_controls.sql` agrega los controles y `auth_version`.
- El despliegue de esa migración hace que las sesiones ya emitidas no tengan una versión válida; los usuarios deberán iniciar sesión nuevamente.
