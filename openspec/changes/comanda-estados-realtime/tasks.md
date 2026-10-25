# Tareas: Comanda - Estados por ítem en tiempo real

## Spec y diseño
- [x] `proposal.md`, `design.md`, `specs/realtime-sync/spec.md`, `specs/pedidos/spec.md`, `specs/cliente-pedidos/spec.md`, `specs/cocina/spec.md`, `specs/mozo/spec.md`, `tasks.md`.

## Fundación (frontend)
- [x] `frontend/src/shared/services/supabase.ts` — cliente Supabase browser con realtime.
- [x] `frontend/src/shared/hooks/useRealtimePedido.ts` — hook `useRealtimePedido(pedidoId, onRefresh)` con debounce 200ms y cleanup.
- [x] `frontend/src/shared/ui/EstadoBadge.tsx` — componente pill `sm`/`md`/`lg` (P=ámbar, E=azul, S=verde, A=rojo).
- [x] Exportar `EstadoBadge` en `shared/ui/index.ts` y `useRealtimePedido` en `shared/hooks/index.ts`.

## Cliente Tracking (`/cliente/pedido/:id`)
- [x] Reemplazar dot 8px por `<EstadoBadge estado={it.estadoPreparacion} size="sm" tooltip={...} />`.
- [x] Eliminar polling 10s (`setInterval`); usar `useRealtimePedido(id, () => void cargar())`.
- [x] Mostrar badge rojo "Anulado" si cocina/mozo anula ítem.
- [x] Agregar `fechaAtencion` a `DetalleDTO` para tooltip.

## Mozo Comanda (modal)
- [x] Suscribir `useRealtimePedido(activo?.id ?? null, () => void onRefrescar())` al abrir comanda.
- [x] Reemplazar texto crudo por `<EstadoBadge estado={d.estadoPreparacion} size="md" />`.

## Cocina KDS
- [x] Migrar polling 12s a realtime (suscripción a `detalle_pedido` completo con debounce).
- [x] Usar `EstadoBadge size="lg"` en `DetalleLinea`.

## Backend / BD
- [x] Agregar `detalle_pedido` a publicación `supabase_realtime` (migración `enable_realtime_detalle_pedido`).
- [~] RLS en `detalle_pedido` — **omitido**: frontend usa JWT custom (no Supabase Auth), `auth.uid()` sería null; habilitar RLS bloquearía realtime para anon. Seguridad se basa en filtro `id_pedido=eq.X` del canal + verificación de participación en API. Pendiente migrar a Supabase Auth o emitir JWTs desde backend.

## Verificación
- [x] `npm run build` frontend OK (tsc + vite).
- [x] `npm run typecheck` backend OK (sin cambios backend).
- [x] Corregido typo pre-existente `</RepartidorGuard>` → `</RoleGuard>` en `routes/index.tsx` (bloqueaba build).