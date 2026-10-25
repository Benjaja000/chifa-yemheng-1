# Spec Delta

## Purpose

Sistema de notificaciones push (FCM/Expo) para alertar al repartidor en tiempo real: nueva entrega asignada, cliente listo/delivery despachado, ruta iniciada por staff. Gestión de tokens por dispositivo, reintentos, y auditoría de envíos.

## ADDED Requirements

### Requirement: Registro de token de dispositivo
El sistema SHALL permitir registrar/actualizar token push (FCM/Expo) del repartidor al hacer login en la app, asociado a su EMPLEADO.ID_Empleado, con plataforma (android/ios/web) y estado activo.

#### Scenario: Login registra token
- **WHEN** repartidor hace login en app móvil, envía token FCM
- **THEN** se guarda/actualiza en tabla dispositivo_token (id_empleado, token, plataforma, activo=true, fecact=NOW())

#### Scenario: Logout desactiva token
- **WHEN** repartidor cierra sesión
- **THEN** dispositivo_token.activo=false para ese token

#### Scenario: Múltiples dispositivos
- **WHEN** repartidor usa app en celular y tablet
- **THEN** ambos tokens activos, push se envía a todos

### Requirement: Envío push en eventos delivery
El sistema SHALL disparar push automáticos en 3 eventos clave, usando firebase-admin (Node) o expo-server-sdk, con payload estructurado y auditoría.

#### Evento 1: Nueva entrega asignada
- **WHEN** staff ejecuta PATCH /api/delivery/{id}/asignar {repartidorId}
- **THEN** push a todos los tokens activos del repartidor:
  - Título: "Nueva entrega asignada"
  - Body: "Pedido #PED-123 - Av. Los Incas 123, San Isidro - S/ 45.00"
  - Data: { type: 'NUEVA_ASIGNACION', pedidoId: 123, deliveryId: 456 }
  - Auditoría: ACCION='PUSH_ENVIADO', ENTIDAD='DELIVERY', DETALLE='Nueva asignación a repartidor X'

#### Evento 2: Cliente listo / Delivery despachado
- **WHEN** delivery pasa a R (staff PATCH /despachar O repartidor PATCH /ruta)
- **THEN** push al repartidor:
  - Título: "Delivery en ruta"
  - Body: "Cliente espera #PED-123 - Av. Los Incas 123 - 15 min aprox"
  - Data: { type: 'EN_RUTA', pedidoId: 123, deliveryId: 456, direccion: '...' }

#### Evento 3: Ruta iniciada por staff (supervisor)
- **WHEN** supervisor inicia ruta desde kanban /delivery/seguimiento (P→R)
- **THEN** push al repartidor:
  - Título: "Ruta iniciada por supervisor"
  - Body: "Supervisor despachó #PED-123 - Inicie ruta en app"
  - Data: { type: 'RUTA_INICIADA_STAFF', pedidoId: 123, deliveryId: 456 }

### Requirement: Manejo de fallos y reintentos
El sistema SHALL manejar tokens inválidos/expirados: al recibir error FCM/Expo (UNREGISTERED, INVALID_ARGUMENT), marca token inactivo, registra en auditoría, y no bloquea la operación delivery.

#### Scenario: Token inválido
- **WHEN** FCM responde UNREGISTERED para token
- **THEN** dispositivo_token.activo=false, auditoría "Push fallido: token expirado", operación delivery continúa

#### Scenario: Error de red temporal
- **WHEN** timeout o 5xx de FCM/Expo
- **THEN** reintenta 2 veces con backoff exponencial (1s, 3s), si persiste registra fallo y continúa

### Requirement: Push silencioso para actualización mapa
El sistema SHALL enviar push de tipo "data-only" (sin notificación visible) cada 30s cuando delivery en R para actualizar mapa en background si app está abierta.

#### Scenario: Push data-only polling
- **WHEN** delivery en R, app repartidor en foreground
- **THEN** push silencioso cada 30s: { type: 'UBICACION_UPDATE', deliveryId: 456, lat: -12.05, lng: -77.03 }
- **NOT** muestra notificación al usuario

### Requirement: Preferencias de notificación
El sistema SHALL permitir al repartidor activar/desactivar tipos de push desde configuración de la app (nuevas asignaciones, en ruta, supervisor), guardando preferencias por id_empleado.

#### Scenario: Desactivar notificaciones supervisor
- **WHEN** repartidor desactiva "Rutas iniciadas por supervisor"
- **THEN** evento 3 no envía push a ese repartidor, pero eventos 1 y 2 sí