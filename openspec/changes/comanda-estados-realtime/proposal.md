# Proposal

## Why

El seguimiento de comandas es inconsistente entre las tres vistas que consumen el estado de preparación de cada plato: el cliente solo ve un "puntito" de 8px sin etiqueta, el mozo ve una letra cruda (P/E/S/A) y la cocina un tablero completo. Además, la sincronización se hace por polling (10-12s), lo que genera latencia perceptible y peticiones innecesarias. Se necesita un badge informativo unificado por plato y sincronización en tiempo real vía Supabase Realtime.

## What Changes

- **Nuevo componente compartido `EstadoBadge`** (`sm`/`md`/`lg`) con etiquetas legibles ("Pendiente", "Preparando", "Servido", "Anulado") y colores unificados.
- **Cliente tracking** (`/cliente/pedido/:id`): reemplaza el dot 8px por `EstadoBadge size="sm"` por plato; elimina polling 10s, usa Supabase Realtime.
- **Mozo comanda** (modal): reemplaza texto crudo por `EstadoBadge size="md"` por línea; suscripción realtime al abrir comanda.
- **Cocina KDS** (opcional): migración a realtime, badges `size="lg"` consistentes.
- **Nueva infraestructura**: cliente Supabase browser + hook `useRealtimePedido(pedidoId, onChange)` que suscribe a `detalle_pedido` por `id_pedido`.
- **RLS**: políticas `cliente_detalle_own` y `staff_detalle_all` en `detalle_pedido` para que Realtime respete permisos.

## Capabilities

### New Capabilities
- `realtime-sync`: sincronización en tiempo real de cambios de `estado_preparacion` por plato vía Supabase Realtime channels, con RLS y fallback a polling.

### Modified Capabilities
- `pedidos`: visualización por plato con badge informativo en comanda del mozo; suscripción realtime.
- `cliente-pedidos`: visualización por plato con badge informativo en tracking del cliente; suscripción realtime.
- `cocina`: migración de polling a realtime en KDS; badges consistentes.
- `mozo`: visualización por plato con badge informativo en comanda del salón.

## Impact

- **Frontend**: nuevos archivos `shared/services/supabase.ts`, `shared/hooks/useRealtimePedido.ts`, `shared/ui/EstadoBadge.tsx`; modificaciones en `pedido-tracking-page.tsx`, `mozo-page.tsx`, `cocina-page.tsx`.
- **Backend/DB**: políticas RLS en `detalle_pedido` (Supabase). Sin cambios de endpoints ni schema.
- **Dependencias**: `@supabase/supabase-js` (cliente browser) si no está instalado.
- **Sin breaking changes**: endpoints existentes intactos; solo cambios de presentación y sync.