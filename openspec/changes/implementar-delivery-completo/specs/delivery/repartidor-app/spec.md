# Spec Delta

## Purpose

App móvil del repartidor para ver sus entregas asignadas, iniciar ruta (P→R), confirmar entrega (R→E), compartir ubicación GPS cada 30s solo en estado R, ver saldo "por rendir" de efectivo contra entrega, y recibir notificaciones push.

## ADDED Requirements

### Requirement: Repartidor ve sus entregas
El sistema SHALL mostrar al repartidor autenticado (rol REPARTIDOR) solo sus entregas (PEDIDO_DELIVERY.ID_Empleado = yo), agrupadas en tabs: [Asignados P] [En ruta R] [Historial E/C], con cards mostrando: N° pedido, cliente, dirección+distrito+referencia, teléfono, total+costo_envío, método pago, estado, tiempo desde asignación.

#### Scenario: Lista mis entregas
- **WHEN** repartidor abre /repartidor/mis-entregas
- **THEN** ve solo pedidos con ID_Empleado = yo, ordenados: P (más antiguo primero) → R → E/C (recientes)

#### Scenario: Filtrado por estado
- **WHEN** repartidor cambia tab a "En ruta"
- **THEN** ve solo entregas con Situacion='R' suyas

#### Scenario: Sin entregas asignadas
- **WHEN** repartidor no tiene pedidos asignados
- **THEN** ve estado vacío "Sin entregas asignadas"

### Requirement: Iniciar ruta (P→R)
El sistema SHALL permitir al repartidor cambiar su entrega de P a R registrando F_Salida = NOW() y activando el compartir GPS.

#### Scenario: Iniciar ruta exitosa
- **WHEN** repartidor pulsa "Iniciar ruta" en entrega P suya
- **THEN** PEDIDO_DELIVERY.Situacion='R', F_Salida=NOW(), GPS activado, push "Ruta iniciada" enviado

#### Scenario: Iniciar ruta ajena
- **WHEN** repartidor intenta iniciar ruta de entrega de otro repartidor
- **THEN** recibe 403 Forbidden

### Requirement: Confirmar entrega (R→E)
El sistema SHALL permitir al repartidor confirmar entrega (R→E) registrando F_Entrega = NOW(), cortando GPS, y si fue efectivo sumando a "por rendir".

#### Scenario: Entrega digital
- **WHEN** repartidor confirma entrega R→E en pedido con pago digital
- **THEN** Situacion='E', F_Entrega=NOW(), GPS cortado, NO suma a por rendir

#### Scenario: Entrega efectivo
- **WHEN** repartidor confirma entrega R→E en pedido con pago efectivo
- **THEN** Situacion='E', F_Entrega=NOW(), GPS cortado, monto suma a "por rendir" visible en su app

#### Scenario: Entrega sin GPS
- **WHEN** repartidor confirma entrega sin haber compartido GPS
- **THEN** pasa a E normalmente, sin error (BR-GPS-001)

### Requirement: Compartir GPS en ruta (polling 30s)
El sistema SHALL permitir al repartidor compartir ubicación (lat/lng) cada 30 segundos SOLO mientras la entrega esté en estado R; en E/C se detiene automáticamente.

#### Scenario: Compartir GPS activo
- **WHEN** entrega en R, repartidor tiene toggle "Compartir ubicación" ON
- **THEN** cada 30s POST /api/repartidor/entregas/{id}/ubicacion {lat, lng} → usp_actualizar_ubicacion_delivery(..., 'REPARTIDOR'), actualiza lat_repartidor/lng_repartidor/f_ubicacion

#### Scenario: GPS se corta en E
- **WHEN** entrega pasa a E
- **THEN** sharing GPS se detiene automáticamente, toggle se desactiva

#### Scenario: Sin permiso GPS en dispositivo
- **WHEN** navegador/dispositivo deniega geolocalización
- **THEN** app muestra "Sin GPS — usando dirección manual", permite confirmar entrega sin error

### Requirement: Ver saldo por rendir
El sistema SHALL mostrar al repartidor el total de efectivo cobrado contra entrega aún no rendido en caja, con detalle por pedido (fecha, cliente, monto), y aviso "Entrégalo en Caja /caja/rendicion".

#### Scenario: Por rendir con pedidos efectivo
- **WHEN** repartidor tiene 2 entregas E en efectivo ($25.00 + $18.50)
- **THEN** header muestra "Por rendir: S/ 43.50", lista detalle con ambos pedidos

#### Scenario: Por rendir vacío
- **WHEN** todas las entregas E son digitales o ya rendidas
- **THEN** muestra "Por rendir: S/ 0.00", sin detalle

### Requirement: Push notifications al repartidor
El sistema SHALL enviar notificaciones push (FCM/Expo) al dispositivo del repartidor en eventos clave: nueva entrega asignada, cliente listo para entrega, ruta iniciada por staff.

#### Scenario: Nueva entrega asignada
- **WHEN** staff asigna repartidor en /admin/delivery (PATCH /asignar)
- **THEN** push al device_token del repartidor: "Nueva entrega #PED-123 asignada - Av. Los Incas 123"

#### Scenario: Cliente listo / delivery despachado
- **WHEN** staff inicia ruta (PATCH /despachar) o repartidor inicia ruta propio
- **THEN** push al repartidor: "Delivery #PED-123 en ruta - Cliente espera en Av. Los Incas 123"

#### Scenario: Ruta iniciada por staff
- **WHEN** supervisor inicia ruta desde kanban /delivery/seguimiento
- **THEN** push al repartidor: "Ruta iniciada por supervisor para #PED-123"

#### Scenario: Repartidor sin token push
- **WHEN** repartidor no tiene device_token registrado o token inválido
- **THEN** sistema registra en auditoría "Push no enviado: token inválido", no bloquea operación