# Spec Delta: delivery/cliente-web

## MODIFIED Requirements

### Requirement: Precio de producto proviene del catálogo
El precio unitario de cada ítem DEBE tomarse del catálogo (`producto.precio`) y
transportarse en el ítem del carrito; el resumen NO DEBE recalcular con constantes.

#### Scenario: Resumen del wizard
- **GIVEN** un carrito con ítems cuyos precios vienen del catálogo
- **WHEN** se muestra el resumen (ConfirmarStep)
- **THEN** `subtotal = Σ (precioUnit × cantidad)` usando los precios capturados
- **AND** no existe ningún valor de precio literal en los componentes

### Requirement: Costo de envío sugerido por distrito
El sistema DEBE sugerir el costo de envío a partir del `distrito` seleccionado
(`costo_base`) y, si hay GPS, de la distancia haversine a `distrito.lat_ref/lng_ref`,
aplicando `distrito.recargo_km` por km fuera de `radio_km`. El valor definitivo se
persiste en `pedido_delivery.costo_envio`. (BR-DER-033, BR-GPS-002)

#### Scenario: Cliente sin GPS
- **GIVEN** un cliente autenticado que eligió un distrito con `costo_base = 8`
- **WHEN** solicita `GET /cliente/delivery/sugerir-costo?distrito=N` (sin lat/lng)
- **THEN** responde `costoSugerido = 8`, `distanciaKm = null`
- **AND** el cliente lo visualiza en solo lectura

#### Scenario: Distrito fuera de radio
- **GIVEN** un distrito con `radio_km=5`, `costo_base=8`, `recargo_km=1.5`
- **WHEN** la distancia es 8 km
- **THEN** `costoSugerido = 8 + (8-5)×1.5 = 12.5`
- **AND** si `recargo_km` es NULL/0, no aplica recargo (nunca una constante en código)

### Requirement: Autoridad sobre el costo de envío
Solo el personal con permiso `DELIVERY_VER` DEBE poder ajustar manualmente el
`costo_envio`. El cliente NO DEBE poder editarlo. (BR-DER-033)

#### Scenario: Cliente en el paso de dirección
- **GIVEN** un cliente en `DireccionStep`
- **THEN** el campo de costo de envío se muestra deshabilitado (solo lectura)

### Requirement: GPS opcional sin bloqueo
La ausencia de GPS o la denegación de permiso NO DEBE impedir registrar el delivery;
se usa `distrito` + dirección manual. (BR-GPS-001)

#### Scenario: Permiso GPS denegado
- **GIVEN** un cliente que rechaza el permiso de ubicación
- **WHEN** completa dirección y distrito
- **THEN** puede continuar y registrar el delivery sin `lat/lng`

### Requirement: Seguimiento del delivery en vivo
El cliente DEBE poder ver el estado (P/R/E/C) y la ubicación del repartidor de su
delivery, actualizada en vivo. La fuente es `vw_delivery_ubicacion` (sin PII).

#### Scenario: Ver mapa con repartidor en ruta
- **GIVEN** un delivery en situación `R` con `lat/lng_repartidor` informados
- **WHEN** el cliente abre el seguimiento de su delivery
- **THEN** ve el mapa con el pin del repartidor y su propio pin
- **AND** muestra "En ruta desde: f_ubicacion" (dato real, no la hora del navegador)

#### Scenario: Actualización en vivo
- **GIVEN** el cliente en la pantalla de seguimiento
- **WHEN** el repartidor actualiza su ubicación
- **THEN** el cambio llega por Realtime (`pedido_delivery`) y el mapa se refresca
- **AND** existe respaldo por polling cada 30s si Realtime no está disponible

### Requirement: Sin datos de negocio hardcodeados
El flujo de delivery del cliente NO DEBE contener cifras, distritos ni horarios
hardcodeados; toda cifra proviene de BD/endpoint.

#### Scenario: Lista de distritos
- **GIVEN** la vista del wizard
- **WHEN** se renderiza el selector de distrito
- **THEN** los distritos provienen de `/api/v1/maestros/distritos`
- **AND** no existe un array `DISTRITOS` ni horarios literales en el código
