# Delta: mozo — salón (estados por plato + realtime)

## Modified Requirements

### Requirement: Visualización de estado por plato en comanda del mozo
La comanda del mozo (modal) DEBE mostrar el estado de preparación de cada plato mediante un badge informativo en lugar de texto crudo.

#### Scenario: Badge por línea
- **WHEN** el mozo abre una comanda
- **THEN** cada línea muestra un `EstadoBadge size="md"` con etiqueta y color.

#### Scenario: Actualización en vivo
- **WHEN** cocina cambia el estado de un plato
- **THEN** el badge se actualiza en <1s sin click en "Refrescar".