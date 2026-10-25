# Spec Delta

## Purpose

Permite al cliente autenticado con Gmail crear pedidos delivery desde la web, con dirección/distrito, GPS opcional, sugerencia de costo por distancia, y pago único digital (Yape/Plin/tarjeta/transferencia); y hacer seguimiento del estado P→R→E con mapa.

## ADDED Requirements

### Requirement: Cliente crea delivery web
El sistema SHALL permitir al cliente autenticado (Gmail) crear un pedido delivery seleccionando productos disponibles, ingresando dirección y distrito obligatorios, con GPS opcional ("Usar mi ubicación"), y confirmando con pago digital único.

#### Scenario: Creación exitosa sin GPS
- **WHEN** cliente Gmail autenticado completa carrito, ingresa dirección + distrito manual, elige Yape, confirma
- **THEN** se crea PEDIDO (tipo DELIVERY) + DETALLE_PEDIDO + PEDIDO_DELIVERY (Situacion='P', lat/lng_cliente NULL, costo_envio confirmado)

#### Scenario: Creación con GPS y sugerencia costo
- **WHEN** cliente usa "Usar mi ubicación", ve costo sugerido por distancia haversine a distrito.lat_ref/lng_ref, confirma costo final manual
- **THEN** se guarda lat_cliente/lng_cliente en PEDIDO_DELIVERY, costo_envio = valor confirmado por humano (BR-GPS-002)

#### Scenario: Rechazo pago efectivo en web
- **WHEN** cliente intenta seleccionar "Efectivo contra entrega" en web
- **THEN** sistema rechaza con mensaje "El efectivo es solo por teléfono" (BR-RES-021, BR-ACC-043)

#### Scenario: Validación dirección obligatoria
- **WHEN** cliente omite dirección o distrito
- **THEN** sistema muestra error "Dirección y distrito son obligatorios"

### Requirement: Sugerencia costo por distancia GPS
El sistema SHALL exponer endpoint para sugerir costo de envío calculando distancia haversine entre pin cliente y centroide distrito (lat_ref/lng_ref), aplicando costo_base del distrito, y avisando si supera radio_km (no bloquea).

#### Scenario: Sugerencia dentro de radio
- **WHEN** GET /api/cliente/delivery/sugerir-costo?lat=-12.05&lng=-77.03&distrito=5 (distrito radio_km=5, costo_base=8.00)
- **THEN** response: { distanciaKm: 3.2, fueraRadio: false, costoSugerido: 8.00 }

#### Scenario: Sugerencia fuera de radio
- **WHEN** distancia > radio_km del distrito
- **THEN** response: { distanciaKm: 8.5, fueraRadio: true, costoSugerido: 12.00 } — humano decide costo final

#### Scenario: Distrito sin coordenadas
- **WHEN** distrito no tiene lat_ref/lng_ref cargados
- **THEN** response: { distanciaKm: null, fueraRadio: false, costoSugerido: costo_base } — fallback a costo_base

### Requirement: Cliente sigue delivery en vivo
El sistema SHALL permitir al cliente ver timeline P→R→E con timestamps (F_Salida, F_Entrega), datos del repartidor (nombre), y mapa Leaflet/OSM con pin cliente + pin repartidor (polling 30s via f_ubicacion); sin GPS muestra dirección textual.

#### Scenario: Seguimiento con GPS activo
- **WHEN** cliente abre /cliente/delivery/{id} y delivery está en R con lat_repartidor/lng_repartidor
- **THEN** ve timeline en R con F_Salida, nombre repartidor, mapa con 2 pines actualizados cada 30s

#### Scenario: Seguimiento sin GPS
- **WHEN** delivery sin coordenadas (lat_cliente NULL)
- **THEN** ve timeline + mensaje "Sin ubicación GPS — usando dirección manual" + link opcional a mapa externo

#### Scenario: Acceso a delivery ajeno
- **WHEN** cliente intenta ver delivery de otro cliente (ID_Cliente ≠ usuario)
- **THEN** recibe 403 Forbidden

### Requirement: Pago único digital
El sistema SHALL exigir que el delivery web se pague con un solo método digital (Yape/Plin/tarjeta/transferencia); no permite efectivo ni pagos mixtos.

#### Scenario: Confirmación con método digital
- **WHEN** cliente elige Yape y confirma
- **THEN** pedido queda en P con metodo_pago='DIGITAL' (no genera rendición en caja)

#### Scenario: Validación pago único
- **WHEN** payload intenta enviar múltiples métodos
- **THEN** error VALIDATION_ERROR "Pago único: solo un método digital permitido"