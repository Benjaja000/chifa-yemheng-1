# Delta: pedidos — comanda del mozo (estados por plato + realtime)

## Modified Requirements

### Requirement: Visualización de estado por plato en comanda del mozo
La comanda del mozo (modal) DEBE mostrar el estado de preparación de cada plato mediante un badge informativo (etiqueta + color) en lugar de una letra cruda.

#### Scenario: Badge por línea
- **WHEN** el mozo abre una comanda
- **THEN** cada línea muestra un `EstadoBadge size="md"` con etiqueta ("Pendiente"/"Preparando"/"Servido"/"Anulado") y color (ámbar/azul/verde/rojo).

#### Scenario: Actualización en vivo
- **WHEN** cocina cambia el estado de un plato
- **THEN** el badge de esa línea se actualiza en <1s sin click en "Refrescar".