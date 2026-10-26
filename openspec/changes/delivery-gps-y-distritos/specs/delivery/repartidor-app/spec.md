# Spec Delta: delivery/repartidor-app

## MODIFIED Requirements

### Requirement: El repartidor persiste su ubicación en ruta
Al iniciar ruta, el repartidor DEBE reportar su posición al backend, que la persiste
en `pedido_delivery.lat_repartidor/lng_repartidor` y `f_ubicacion` vía
`usp_actualizar_ubicacion_delivery`. El reporte NO DEBE cambiar la situación ni el
costo, y DEBE aplicar throttle para no saturar la BD. (BR-GPS-001/002)

#### Scenario: Iniciar ruta
- **GIVEN** un repartidor con una entrega asignada
- **WHEN** pulsa "Iniciar ruta"
- **THEN** se llama `PATCH /repartidor/entregas/:id/ruta` (situación → `R`)
- **AND** se comienza a reportar GPS a `POST /repartidor/entregas/:id/ubicacion`

#### Scenario: Throttle de GPS
- **GIVEN** el GPS activo con `watchPosition`
- **WHEN** llegan varias posiciones seguidas
- **THEN** solo se envía una actualización cada 15s como máximo

#### Scenario: Auto-stop al entregar
- **GIVEN** el repartidor compartiendo ubicación
- **WHEN** confirma la entrega
- **THEN** el reporte de GPS se detiene y la situación queda en `E`

### Requirement: Datos reales de la entrega
La pantalla de detalle de entrega DEBE mostrar la dirección, referencia, distrito,
teléfono y número de pedido de la entrega real obtenida de la API, no valores fijos.

#### Scenario: Cargar entrega
- **GIVEN** un repartidor que abre `/repartidor/entregas/:id`
- **WHEN** la página carga
- **THEN** los datos provienen de `GET /repartidor/entregas/:id`
- **AND** no hay dirección ni cliente hardcodeados en el componente

#### Scenario: Confirmar entrega
- **GIVEN** una entrega en ruta
- **WHEN** el repartidor confirma la entrega
- **THEN** se llama `PATCH /repartidor/entregas/:id/entregar` y navega a mis-entregas
