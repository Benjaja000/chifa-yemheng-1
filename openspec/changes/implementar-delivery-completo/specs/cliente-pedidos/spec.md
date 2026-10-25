# Spec Delta

## ADDED Requirements

### Requirement: Cliente crea delivery web
El sistema SHALL exponer endpoints bajo `/api/v1/cliente/delivery` (clienteAuthGuard) para crear delivery y seguimiento, separados de la comanda mesa.

#### Scenario: POST /api/v1/cliente/delivery — crear delivery
- **WHEN** cliente Gmail autenticado envía `{ items:[{productoId,cantidad,nota?}], direccion, idDistrito, telefono, latCliente?, lngCliente?, metodoDigital }`
- **THEN** 201 crea PEDIDO(tipo=DELIVERY, id_cliente=usuario) + DETALLE_PEDIDO + PEDIDO_DELIVERY(P, lat/lng_cliente, costo_envio confirmado), response `{ idPedidoDelivery, situacion:'P', costoEnvio }`

#### Scenario: GET /api/v1/cliente/delivery/sugerir-costo — sugerencia GPS
- **WHEN** GET ?lat=-12.05&lng=-77.03&distrito=5
- **THEN** 200 `{ distanciaKm, fueraRadio:bool, costoSugerido }` — haversine pin↔distrito.lat_ref/lng_ref, aplica costo_base, fueraRadio si > radio_km (aviso, no bloqueo)

#### Scenario: GET /api/v1/cliente/delivery/{id} — detalle propio
- **WHEN** cliente consulta su delivery
- **THEN** 200 `{ situacion, fSalida, fEntrega, repartidor, costoEnvio, direccion, distrito, items[], metodoDigital }` — solo si ID_Cliente = usuario (403 si ajeno)

#### Scenario: GET /api/v1/cliente/delivery/{id}/ubicacion — mapa
- **WHEN** cliente pide ubicación
- **THEN** 200 fila de VW_DELIVERY_UBICACION filtrada por dueño: `{ situacion, fSalida, fEntrega, repartidor, latCliente, lngCliente, latRepartidor, lngRepartidor, fUbicacion }`

### Requirement: Pago único digital obligatorio
El sistema SHALL validar que `metodoDigital` sea uno de: YAPE, PLIN, TARJETA, TRANSFERENCIA; rechazar EFECTIVO y pagos mixtos.

#### Scenario: Rechazo efectivo
- **WHEN** payload incluye metodoDigital: 'EFECTIVO'
- **THEN** 400 VALIDATION_ERROR "El efectivo es solo por teléfono"