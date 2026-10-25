# Propuesta: Cocina WebSocket / SSE (Real-time)

## Problema
- Cocina KDS usa polling cada 12s (`GET /pedidos/cocina`).
- Latencia: hasta 12s para ver cambios de estado.
- Carga innecesaria en servidor (requests constantes).

## Alcance
- Backend: Server-Sent Events (SSE) endpoint `GET /api/v1/pedidos/cocina/stream` → emite eventos `pedido_nuevo`, `detalle_cambio_estado`, `pedido_anulado`.
- Frontend: `cocina-page.tsx` reemplaza polling por `EventSource` (SSE) → actualización instantánea.
- Fallback: si SSE falla → vuelve a polling 12s.

## Fuera de alcance
- WebSocket bidireccional (no necesario, solo server→client).
- Reconexión automática avanzada (básica nativa de EventSource).

## Criterios de aceptación
- Cambio estado en cocina (P→E→S) se ve en < 500ms.
- Sin polling visible en Network tab.
- Reconexión automática si se corta conexión.