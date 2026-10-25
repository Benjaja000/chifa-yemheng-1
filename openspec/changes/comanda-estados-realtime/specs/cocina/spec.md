# Delta: cocina — KDS (realtime + badges consistentes)

## Modified Requirements

### Requirement: Sincronización en tiempo real en KDS
La cocina DEBE usar Supabase Realtime en lugar de polling 12s.

#### Scenario: Sin polling
- **WHEN** el KDS está montado
- **THEN** no se emiten peticiones HTTP periódicas; solo carga inicial + eventos realtime.

### Requirement: Badges consistentes
El KDS DEBE usar `EstadoBadge size="lg"` en cada línea para consistencia visual con cliente y mozo.

#### Scenario: Badge por línea
- **WHEN** se renderiza una línea en el KDS
- **THEN** muestra `EstadoBadge size="lg"` con etiqueta y color unificado.