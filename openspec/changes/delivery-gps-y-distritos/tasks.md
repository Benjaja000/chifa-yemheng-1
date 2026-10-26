# Tareas: delivery-gps-y-distritos

## Spec y diseño
- [x] `proposal.md`, `design.md`, `specs/delivery/cliente-web/spec.md`, `specs/delivery/repartidor-app/spec.md`, `tasks.md`.

## Configuración (anti-hardcode)
- [x] `openspec/config.yaml` — lista explícita de lo prohibido hardcodear (precios, costos de envío, %, distritos, horarios, teléfonos, textos) + reglas por artefacto (proposal/design/tasks) exigiendo origen de cada cifra y tarea de verificación por grep.

## BD (migraciones idempotentes)
- [x] `openspec/database/alter-data/add-geolocalizacion/05_alter_distrito_recargo.sql` — `distrito.recargo_km numeric(10,2) DEFAULT 1.50 NOT NULL` + CHECK + COMMENT.
- [x] `openspec/database/alter-data/add-geolocalizacion/06_enable_realtime_pedido_delivery.sql` — `pedido_delivery` en `supabase_realtime` + `REPLICA IDENTITY FULL`.
- [x] **Aplicadas** ambas migraciones en la BD. Verificado contra el proyecto `jslpzwdtaggfclnbmrmt`: `distrito.recargo_km` = 1.50; evento Realtime real recibido en UPDATE de `pedido_delivery` con payload de todas las columnas (confirma publicación `supabase_realtime` + `REPLICA IDENTITY FULL`).

## Backend
- [x] `delivery-repository.ts` — `sugerirCosto(lat|null, lng|null, distrito)`: sin GPS o sin centroide ⇒ `costo_base`; recargo por km leído de `distrito.recargo_km` (elimina el literal `1.5`).
- [x] `schemas/delivery.ts` y `cliente-delivery-controller.ts` — `lat`/`lng` opcionales en `sugerir-costo`.
- [x] `delivery-service.ts` y `cliente-delivery-service.ts` — propagan `null` cuando no hay GPS.
- [x] `frontend/src/shared/services/api-client.ts` — `sugerirCosto(distrito, lat?, lng?)`.

## Frontend — precios sin hardcode
- [x] `CartaStep.tsx` — el ítem transporta `precioUnit` (de `producto.precio`) y `nombre`.
- [x] `DeliveryWizard.tsx` — tipa `items[]` con `precioUnit`; envía a la API solo `{ productoId, cantidad, nota, descuento }`.
- [x] `ConfirmarStep.tsx` — reemplaza `item.cantidad * 15` por `Σ (precioUnit × cantidad)`.

## Frontend — costo y rol
- [x] `DireccionStep.tsx` — costo de envío en **solo lectura** para el cliente + sugerido automático al elegir distrito (sin GPS) y al usar GPS/geocodificación.

## Frontend — seguimiento real
- [x] `shared/hooks/useRealtimeDelivery.ts` — suscripción a `pedido_delivery` (debounce 200ms, cleanup).
- [x] `shared/hooks/useDeliveryUbicacion.ts` — `vw_delivery_ubicacion` + Realtime + polling 30s.
- [x] `components/DeliveryTracking.tsx` — timeline P/R/E + mapa (`MapLeaflet`) con pin repartidor/cliente + tiempos reales.
- [x] `delivery-page.tsx` — contenedor único (`DeliveryWizard` → `DeliveryTracking`); eliminado el flujo legacy, `DISTRITOS`, `totalFinal`, `enviar()` mock, "Cobertura" y "Horarios".
- [x] `DeliveryWizard.tsx` — prop `onCreated`; navegación corregida (sin ruta inexistente).
- [x] `entrega-detalle-page.tsx` (repartidor) — persiste GPS con throttle 15s + `iniciarRuta`/`confirmarEntrega` reales + datos reales de la entrega.

## Verificación
- [x] `npm run typecheck` backend OK.
- [x] `npm run build` frontend OK (tsc + vite).
- [x] Grep anti-hardcode en `cliente/delivery/**`, `repartidor/entrega-detalle/**` y `delivery-repository.ts`: 0 coincidencias (distritos, horarios, `* 15`, `* 1.5`, `console.log`, datos fijos).
- [x] Realtime verificado en vivo: UPDATE de `pedido_delivery` ⇒ evento recibido con payload completo (tracking del cliente operativo).
- [x] RPC `haversine_km` verificado contra la BD: 11.52 km para un par de puntos a ~11.5 km.
- [x] Suite automatizada de endpoints delivery: `backend/src/routes/__tests__/delivery-endpoints.test.ts` (18/18 verde, solo lectura). Cubre auth/permisos (401/403/400), paginación, `sugerir-costo` (BR-GPS-001/002), seguimiento staff, ubicación sin PII y rutas de repartidor. Firma JWT con `env.JWT_SECRET` real vía supertest (sin necesidad de levantar el backend).
- [ ] E2E autenticado *contra el servidor levantado* de `/api/v1/delivery/sugerir-costo` (permiso `DELIVERY_VER`) — la suite cubre el caso in-process; queda pendiente la corrida end-to-end con el backend real.
- [ ] **Bloqueante de datos**: `distrito` tiene 1891 filas y **0 con `lat_ref`/`lng_ref`** ⇒ hoy `sugerirCosto` siempre cae al fallback `costo_base` (y `costo_base` = 0.00 en los distritos revisados). Hay que cargar centroides y `costo_base` por distrito para que la sugerencia por distancia funcione.
