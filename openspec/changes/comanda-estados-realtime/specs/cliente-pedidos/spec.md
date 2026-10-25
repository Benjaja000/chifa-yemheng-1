# Delta: cliente-pedidos — tracking del cliente (estados por plato + realtime)

## Modified Requirements

### Requirement: Visualización de estado por plato en tracking del cliente
El tracking del cliente DEBE mostrar el estado de preparación de cada plato mediante un badge informativo (etiqueta + color) en lugar de un puntito de 8px.

#### Scenario: Badge por plato
- **WHEN** el cliente abre `/cliente/pedido/:id`
- **THEN** cada plato muestra un `EstadoBadge size="sm"` con etiqueta y color.

#### Scenario: Tooltip con hora
- **WHEN** el cliente hace hover/touch sobre el badge
- **THEN** muestra la hora exacta del cambio de estado (si existe).

#### Scenario: Anulación visible
- **WHEN** cocina o mozo anula un plato
- **THEN** el badge cambia a rojo "Anulado" en <1s.

### Requirement: Sincronización en tiempo real
El tracking del cliente DEBE usar Supabase Realtime en lugar de polling 10s.

#### Scenario: Sin polling
- **WHEN** el tracking está montado
- **THEN** no se emiten peticiones HTTP periódicas; solo la carga inicial + eventos realtime.

#### Scenario: Actualización de badges
- **WHEN** cambia `estado_preparacion` de un detalle
- **THEN** el badge correspondiente se actualiza en <1s.