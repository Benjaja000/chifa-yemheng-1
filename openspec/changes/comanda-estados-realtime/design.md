# Design: comanda-estados-realtime

## Context

Stack: React + TypeScript (Vite), Express + TS, Supabase (Postgres + Realtime).
Actualmente polling 10-12s en cliente tracking y cocina KDS.
El estado por plato (`estado_preparacion`: P/E/S/A) ya existe en `detalle_pedido`.

## Goals / Non-Goals

**Goals:**
- Badge informativo unificado por plato (cliente/mozo/cocina).
- Sincronización <1s vía Supabase Realtime.
- Eliminar polling cuando Realtime activo.
- RLS respetado.

**Non-Goals:**
- No cambios de endpoints ni schema.
- No WebSocket custom (usamos Supabase Realtime).
- No cambios en el modelo de estados (P/E/S/A se mantiene).

## Decisions

### D1: Supabase Realtime (no WebSocket custom)
**Decisión**: Usar `supabase.channel(...).on('postgres_changes', ...)` filtrando por `id_pedido`.
**Rationale**: Ya tenemos Supabase; Realtime es built-in y respeta RLS. Evita infraestructura custom.
**Trade-off**: Dependencia de Supabase; si falla, fallback a polling 30s.

### D2: Hook `useRealtimePedido(pedidoId, onChange)`
**Decisión**: Hook genérico que suscribe y hace refetch completo del pedido al recibir cualquier evento.
**Rationale**: Simplifica manejo de INSERT/UPDATE/DELETE; el refetch completo garantiza consistencia.
**Trade-off**: Más tráfico por evento, pero pedidos son pequeños (<50 líneas).

### D3: Componente `EstadoBadge` unificado
**Decisión**: Un solo componente con `size` prop (sm/md/lg) y colores consistentes con `cocina-page.tsx`.
**Rationale**: Evita duplicación; garantiza consistencia visual.
**Colores**: P=#f59e0b, E=#3b82f6, S=#22c55e, A=#ef4444.

### D4: Fallback a polling
**Decisión**: Si Realtime falla o no está disponible, activar polling 30s + banner "sin conexión".
**Rationale**: Robustez; no bloquear funcionalidad por fallo de infraestructura.

### D5: RLS en `detalle_pedido`
**Decisión**: Políticas `cliente_detalle_own` (cliente ve sus detalles) y `staff_detalle_all` (staff ve todo).
**Rationale**: Realtime respeta RLS automáticamente; sin esto, cliente podría ver pedidos ajenos.

## Risks / Trade-offs

- **R1**: Supabase Realtime puede tener latencia variable (>1s en picos). Mitigación: debounce 200ms + refetch completo.
- **R2**: RLS mal configurado → cliente ve datos ajenos. Mitigación: test con 2 usuarios distintos.
- **R3**: Memory leaks si no se limpia el canal. Mitigación: cleanup en `useEffect` return.

## Migration Plan

1. Crear cliente Supabase browser + hook + componente.
2. Integrar en cliente tracking (eliminar polling).
3. Integrar en mozo comanda (eliminar polling).
4. (Opcional) Integrar en cocina KDS.
5. Aplicar RLS en Supabase.

## Open Questions

- ¿`@supabase/supabase-js` ya está instalado en frontend? (verificar package.json)
- ¿Las env vars `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` existen?