# Tareas: Cocina WebSocket / SSE (Real-time)

## Spec y diseño
- [ ] `proposal.md`, `design.md`, `tasks.md`, `specs/cocina-websocket.md`

## Backend
- [ ] `GET /api/v1/pedidos/cocina/stream` (SSE endpoint):
  - [ ] Response `text/event-stream`
  - [ ] Emite eventos: `pedido_nuevo`, `detalle_cambio_estado`, `pedido_anulado`
  - [ ] Heartbeat cada 30s (`: ping\n\n`)
  - [ ] Limpieza al cerrar conexión

## Frontend
- [ ] `cocina-page.tsx`: reemplazar `setInterval` polling por `EventSource`
  - [ ] `EventSource('/api/v1/pedidos/cocina/stream')`
  - [ ] Handlers: `pedido_nuevo` → add ticket, `detalle_cambio_estado` → update item, `pedido_anulado` → remove ticket
  - [ ] Fallback: si `EventSource` falla → fallback a polling 12s
  - [ ] Reconexión automática (nativa `EventSource`)

## Verificación
- [ ] `npm run build` frontend OK
- [ ] Test: cambio estado en cocina (P→E→S) visible < 500ms
- [ ] Sin polling visible en Network tab
- [ ] Reconexión automática si se corta conexión