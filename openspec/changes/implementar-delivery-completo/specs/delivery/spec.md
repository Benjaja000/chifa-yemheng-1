# Spec Delta

## MODIFIED Requirements

### Requirement: CRUD delivery backend completo
El sistema SHALL proveer API completa delivery bajo `/api/v1/delivery` (authGuard + permisos DELIVERY_*) con estados P→R→E/C, GPS opcional, asignación repartidor, y sugerencia costo.

#### Scenario: GET /api/v1/delivery — listar con filtros
- **WHEN** DELIVERY_VER GET ?page=1&limit=20&estado=R
- **THEN** 200 `{ data:[{id,pedidoId,distrito,direccion,referencia,telefono,repartidor,costo,estado,fechaCreacion}], page,limit,total }` ordenado por feccre desc

#### Scenario: POST /api/v1/delivery — crear (staff teléfono)
- **WHEN** DELIVERY_VER POST `{ pedidoId, distritoId?, direccion, referencia?, telefono?, costo, latCliente?, lngCliente? }`
- **THEN** 201 insert PEDIDO_DELIVERY(P, direccion, costo, lat/lng_cliente), auditoría usucre/pc

#### Scenario: PATCH /api/v1/delivery/{id}/asignar — asignar repartidor
- **WHEN** DELIVERY_ASIGNAR PATCH `{ repartidorId }`
- **THEN** 200 update ID_Empleado=repartidorId, Situacion sigue P (R lo marca seguimiento), auditoría usumod

#### Scenario: PATCH /api/v1/delivery/{id}/despachar — iniciar ruta (P→R)
- **WHEN** DELIVERY_DESPACHAR PATCH (staff kanban)
- **THEN** 200 Situacion='R', F_Salida=NOW(), push a repartidor, auditoría

#### Scenario: PATCH /api/v1/delivery/{id}/entregar — confirmar entrega (R→E)
- **WHEN** DELIVERY_ENTREGAR PATCH (staff o repartidor propio)
- **THEN** 200 Situacion='E', F_Entrega=NOW(), si efectivo suma a por rendir, GPS cortado, auditoría

#### Scenario: PATCH /api/v1/delivery/{id}/anular — anular (P→C)
- **WHEN** DELIVERY_VER PATCH `{ motivo }` en P
- **THEN** 200 Situacion='C', motivo en auditoría, C→* y E→* prohibidos, R→P prohibido

#### Scenario: GET /api/v1/delivery/{id}/ubicacion — mapa staff
- **WHEN** DELIVERY_VER GET /ubicacion
- **THEN** 200 VW_DELIVERY_UBICACION row (solo coords + situacion + tiempos, sin PII)

#### Scenario: Sugerir costo haversine
- **WHEN** GET /api/v1/delivery/sugerir-costo?lat=&lng=&distrito=
- **THEN** 200 `{ distanciaKm, fueraRadio:bool, costoSugerido }` — BD calcula haversine pin↔distrito.lat_ref/lng_ref, aplica costo_base, fueraRadio si > radio_km

### Requirement: Estados delivery P/R/E/C con timestamps
El sistema SHALL mantener máquina de estados estricta: P (creado) → R (F_Salida) → E (F_Entrega), y P → C (motivo). R→P, E→*, C→* prohibidos.

#### Scenario: Transición válida P→R→E
- **WHEN** secuencia: crear → despachar → entregar
- **THEN** Situacion: P → R (F_Salida) → E (F_Entrega), cada transición audita quién/cuándo

#### Scenario: Transición inválida E→C
- **WHEN** intenta anular entrega ya en E
- **THEN** 400 "Transición no permitida: E no puede ir a C"

### Requirement: GPS opcional nunca bloquea (BR-GPS-001/002)
El sistema SHALL aceptar lat/lng NULL en creación y actualización; distancia solo sugiere costo_envio, humano confirma final; sin GPS opera con dirección+distrito manual.

#### Scenario: Crear sin GPS
- **WHEN** POST /delivery sin latCliente/lngCliente
- **THEN** 201 PEDIDO_DELIVERY con lat/lng_cliente NULL, costo_envio manual, funciona normal

#### Scenario: Actualizar GPS solo coordenadas
- **WHEN** usp_actualizar_ubicacion_delivery(123, -12.05, -77.03, 'CLIENTE')
- **THEN** actualiza lat_cliente/lng_cliente/f_ubicacion, NO toca Situacion ni Costo_Envio

#### Scenario: Costo sugerido vs confirmado
- **WHEN** app sugiere 12.00 por GPS, humano ingresa 10.00
- **THEN** se guarda 10.00 en costo_envio (BR-DER-033 intacto)

### Requirement: Asignación primer repartidor disponible (BR-ACC-041)
El sistema SHALL proponer en UI el primer EMPLEADO con cargo REPARTIDOR, Estado='A', sin entregas en R activas; humano confirma o cambia.

#### Scenario: Propuesta automática
- **WHEN** staff abre modal asignar en delivery P
- **THEN** selector muestra solo repartidores activos, propuesto el primero sin R activa

### Requirement: Efectivo contra entrega → rendición caja (BR-ACC-045, BR-INF-051)
El sistema SHALL: delivery efectivo en E queda "por rendir"; repartidor ve monto en app; cajero registra en /caja/rendicion → MOVIMIENTO_CAJA (VENTA AL CONTADO) incrementa Monto_Sistema; digitales NO rendición.

#### Scenario: Flujo efectivo completo
- **WHEN** delivery E en efectivo → repartidor ve por rendir → cajero rendición → MOVIMIENTO_CAJA ingreso
- **THEN** Monto_Sistema de turno actual incrementado, arqueo incluye este ingreso

#### Scenario: Flujo digital sin rendición
- **WHEN** delivery E en Yape
- **THEN** NO aparece en por rendir, NO genera MOVIMIENTO_CAJA, solo Total_Ingresos (BR-INF-051)