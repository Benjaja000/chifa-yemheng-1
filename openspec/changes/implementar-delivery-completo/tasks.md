# Tasks

## 1. Base de Datos y Seeds

- [ ] 1.1 Verificar migraciones GPS aplicadas: `pedido_delivery` (lat/lng_cliente, lat/lng_repartidor, f_ubicacion + CHECKs), `distrito` (lat_ref, lng_ref, radio_km, costo_base), `usp_actualizar_ubicacion_delivery`, `vw_delivery_ubicacion` — `supabase db diff` o `\d` en psql
- [ ] 1.2 Crear migration `add_dispositivo_token` para tabla push: `id_empleado FK EMPLEADO`, `token TEXT`, `plataforma VARCHAR(16)`, `activo BOOLEAN DEFAULT true`, `fecact TIMESTAMP DEFAULT NOW()`, índice único `(id_empleado, token)` — verificar con `supabase migration new` + apply
- [ ] 1.3 Poblar `distrito` con `lat_ref`, `lng_ref`, `radio_km`, `costo_base` reales (centroides Lima/Callao) — script SQL `seed_distrito_gps.sql`, verificar `SELECT * FROM distrito WHERE lat_ref IS NOT NULL`
- [ ] 1.4 Insertar permisos nuevos en `PERMISO` + `ROL_PERMISO`: `DELIVERY_VER`, `DELIVERY_ASIGNAR`, `DELIVERY_DESPACHAR`, `DELIVERY_ENTREGAR`, `CLIENTE_PEDIDOS`, `REN_VER`, `REN_REGISTRAR`, `REN_VALIDAR`; asignar a roles (REPARTIDOR, CAJERO, SUPERVISOR, ADMIN, MOZO) — verificar `SELECT * FROM permiso WHERE codigo LIKE 'DELIVERY_%' OR codigo LIKE 'REN_%' OR codigo='CLIENTE_PEDIDOS'`
- [ ] 1.5 Crear función SQL `haversine_km(lat1, lng1, lat2, lng2) RETURNS numeric` inlined para `sugerir-costo` — verificar `SELECT haversine_km(-12.05, -77.03, -12.10, -77.05)`

## 2. Backend — Shared y Core Delivery

- [ ] 2.1 Extender `delivery-repository.ts`: agregar `sugerirCosto(lat, lng, distritoId)` que usa `haversine_km` + `distrito.costo_base/radio_km` — test unitario con `vitest` mock supabase
- [ ] 2.2 Crear `cliente-delivery-repository.ts` + `cliente-delivery-service.ts`: `crearDeliveryWeb(input, clienteId)`, `sugerirCosto`, `getDetalle(id, clienteId)`, `getUbicacion(id, clienteId)` — reutiliza `USP_ABRIR_PEDIDO` + `USP_AGREGAR_DETALLE_PEDIDO` + insert `PEDIDO_DELIVERY`
- [ ] 2.3 Crear `repartidor-repository.ts` + `repartidor-service.ts`: `listarMisEntregas(empleadoId, estado?)`, `getDetalle(id, empleadoId)`, `iniciarRuta(id, empleadoId)`, `confirmarEntrega(id, empleadoId)`, `actualizarUbicacion(id, lat, lng)`, `getPorRendir(empleadoId)` — filtra `ID_Empleado = empleadoId`
- [ ] 2.4 Crear `seguimiento-repository.ts` + `seguimiento-service.ts`: `listarSeguimiento(filtros)`, `iniciarRutaStaff(id)`, `confirmarEntregaStaff(id)`, `anular(id, motivo)`, `getUbicacion(id)` — usa `vw_delivery_ubicacion`
- [ ] 2.5 Crear `rendicion-repository.ts` + `rendicion-service.ts`: `listarPendientes(repartidorId)`, `registrarRendicion(input)`, `validar(id)`, `observar(id, motivo)`, `getPdf(id)` — consolida `PAGO_VENTA` efectivo → `MOVIMIENTO_CAJA` (concepto VENTA AL CONTADO)
- [ ] 2.6 Crear `push-service.ts` con `firebase-admin`: `enviarNuevaAsignacion(repartidorId, data)`, `enviarEnRuta(repartidorId, data)`, `enviarRutaIniciadaStaff(repartidorId, data)`, `enviarDataOnly(repartidorId, data)` — maneja token inválido (marca `activo=false`), reintentos 2x backoff, auditoría

## 3. Backend — Routers y Guards

- [ ] 3.1 Crear `cliente-delivery.ts` router: `POST /`, `GET /sugerir-costo`, `GET /:id`, `GET /:id/ubicacion` — `clienteAuthGuard` + validación Zod schemas
- [ ] 3.2 Crear `repartidor.ts` router: `GET /entregas`, `GET /entregas/:id`, `PATCH /entregas/:id/ruta`, `PATCH /entregas/:id/entregar`, `POST /entregas/:id/ubicacion`, `GET /por-rendir` — `authGuard` + guard rol REPARTIDOR (`requireRol('REPARTIDOR')`)
- [ ] 3.3 Crear `delivery-seguimiento.ts` router: `GET /`, `PATCH /:id/ruta`, `PATCH /:id/entregar`, `PATCH /:id/anular`, `GET /:id/ubicacion` — `authGuard` + `requirePermisos('DELIVERY_VER'|'DELIVERY_DESPACHAR'|'DELIVERY_ENTREGAR')`
- [ ] 3.4 Crear `rendiciones.ts` router: `GET /pendientes`, `GET /`, `POST /`, `PATCH /:id/validar`, `PATCH /:id/observar`, `GET /:id/pdf` — `authGuard` + `requirePermisos('REN_VER'|'REN_REGISTRAR'|'REN_VALIDAR')`
- [ ] 3.5 Registrar 4 routers en `app.ts` bajo `/api/v1/cliente/delivery`, `/api/v1/repartidor/entregas`, `/api/v1/delivery/seguimiento`, `/api/v1/rendiciones` — verificar `npm run dev` + `curl` health

## 4. Backend — Integración Push en Servicios Existentes

- [ ] 4.1 En `asignarRepartidorService` (tras update exitoso): llamar `pushService.enviarNuevaAsignacion(repartidorId, {pedidoId, deliveryId, direccion, total})` — test: mock pushService, verificar llamada
- [ ] 4.2 En `despacharService` (staff kanban): llamar `pushService.enviarEnRuta(repartidorId, {pedidoId, deliveryId, direccion})` — test: mock
- [ ] 4.3 En `repartidor-service.iniciarRuta` (app repartidor): llamar `pushService.enviarRutaIniciadaStaff(repartidorId, {pedidoId, deliveryId})` — test: mock
- [ ] 4.4 En `repartidor-service.actualizarUbicacion` (polling 30s): si app en foreground, llamar `pushService.enviarDataOnly(repartidorId, {lat, lng, deliveryId})` — test: mock

## 5. Frontend — Shared UI Kit y Hooks

- [ ] 5.1 Crear `src/shared/ui/MapLeaflet.tsx`: wrapper Leaflet con `useEffect` mount/unmount, props `pins: {lat,lng,label}[]`, `readonly`, `onClick?` — test visual Storybook o manual
- [ ] 5.2 Crear `src/shared/ui/Timeline.tsx`: steps P→R→E/C con timestamps, colores (verde/azul/rojo), iconos — test visual
- [ ] 5.3 Crear `src/shared/ui/Badge.tsx`: estado delivery (P/R/E/C) con colores semánticos — test visual
- [ ] 5.4 Crear `src/shared/hooks/usePolling.ts`: `usePolling(fn, intervalMs, enabled)` con `AbortController` cleanup — test: render + wait + verify cleanup
- [ ] 5.5 Crear `src/shared/hooks/usePushToken.ts`: registro token FCM en login repartidor, envío a `POST /api/v1/repartidor/entregas/token` (nuevo endpoint simple) — test: mock API
- [ ] 5.6 Crear `src/shared/services/api-client.ts`: wrapper `fetch` con auth, error handling, base URL — test: request/response interceptors

## 6. Frontend — Feature: Cliente Delivery (Web)

- [ ] 6.1 `features/cliente/delivery/DeliveryWizard.tsx`: stepper 3 pasos (Carta → Dirección → Confirmar), estado React Hook Form + Zod
- [ ] 6.2 `features/cliente/delivery/steps/CartaStep.tsx`: reutiliza `menu-carta` logic (solo ACTIVO+DISPONIBLE), carrito lateral, total + envío estimado
- [ ] 6.3 `features/cliente/delivery/steps/DireccionStep.tsx`: autocomplete dirección + select distrito (jerarquía PROVINCIA→DEPARTAMENTO), botón "Usar mi ubicación" → `navigator.geolocation`, muestra costo sugerido via `GET /sugerir-costo`
- [ ] 6.4 `features/cliente/delivery/steps/ConfirmarStep.tsx`: resumen items + total + envío, select método digital (YAPE/PLIN/TARJETA/TRANSFERENCIA), valida pago único, botón "Confirmar" → `POST /api/v1/cliente/delivery`
- [ ] 6.5 `features/cliente/delivery/api.ts`: `crearDelivery`, `sugerirCosto`, `getDetalle`, `getUbicacion` — types compartidos con backend
- [ ] 6.6 Verificar flujo completo: login Gmail → wizard → confirmar → redirect `/cliente/delivery/{id}` — test E2E Cypress

## 7. Frontend — Feature: Cliente Seguimiento Delivery

- [ ] 7.1 `features/cliente/delivery-seguimiento/TrackingPage.tsx`: layout timeline + repartidor + mapa (mobile stack, desktop side-by-side)
- [ ] 7.2 `features/cliente/delivery-seguimiento/Timeline.tsx`: usa `Timeline` shared, datos `GET /api/v1/cliente/delivery/{id}`
- [ ] 7.3 `features/cliente/delivery-seguimiento/MapaTracking.tsx`: usa `MapLeaflet` shared, pins cliente + repartidor, `usePolling` 30s `GET /ubicacion`, fallback sin GPS
- [ ] 7.4 `features/cliente/delivery-seguimiento/RepartidorCard.tsx`: nombre, tiempo estimado, estado badge
- [ ] 7.5 Verificar: delivery en R con GPS → mapa animado; delivery sin GPS → mensaje fallback; delivery ajeno → 403 — test Cypress

## 8. Frontend — Feature: Admin Pedidos Delivery (Staff Creación)

- [ ] 8.1 `features/admin/pedidos-delivery/PedidosDeliveryPage.tsx`: header + [Nuevo delivery], filtros (fecha, estado, repartidor), tabla pendientes P
- [ ] 8.2 `features/admin/pedidos-delivery/CrearDeliveryModal.tsx`: modal paso a paso — cliente (autocomplete + crear rápido), dirección/distrito/referencia/teléfono, GPS opcional (botón + mapa mini), costo envío (input + botón "Sugerir" → `GET /api/v1/delivery/sugerir-costo`), selector productos (reutiliza `pos-mozo` logic)
- [ ] 8.3 `features/admin/pedidos-delivery/AsignarRepartidorModal.tsx`: select repartidores activos (cargo REPARTIDOR, Estado=A), propone primer disponible, `PATCH /asignar`
- [ ] 8.4 Verificar: crear delivery teléfono sin GPS → OK; crear con GPS → sugiere costo; asignar → P con repartidor; validaciones Zod — test Cypress

## 9. Frontend — Feature: Seguimiento Staff (Kanban + Mapa)

- [ ] 9.1 `features/delivery/seguimiento/SeguimientoPage.tsx`: header KPIs (pendientes, en ruta, entregados, t.promedio), layout kanban (izq) + mapa (der) responsive
- [ ] 9.2 `features/delivery/seguimiento/KanbanBoard.tsx`: 3 columnas P/R/E, cards draggable (opcional), cada card: pedido, cliente, dirección, total+envío, método, repartidor, tiempos, badge estado, botones acción (Iniciar ruta, Entregar, Anular) según permisos
- [ ] 9.3 `features/delivery/seguimiento/MapaGlobal.tsx`: `MapLeaflet` shared, `usePolling` 30s `GET /api/v1/delivery/seguimiento?estado=R` → pins cliente + repartidor por delivery en R
- [ ] 9.4 `features/delivery/seguimiento/actions.ts`: `iniciarRuta(id)`, `confirmarEntrega(id)`, `anular(id, motivo)` → API calls + toast + refresh
- [ ] 9.5 Verificar: KPIs correctos; kanban mueve tarjetas P→R→E; mapa actualiza pins; anular P→C con motivo; responsive mobile 1 col — test Cypress

## 10. Frontend — Feature: Repartidor App (Mis Entregas)

- [ ] 10.1 `features/repartidor/mis-entregas/MisEntregasPage.tsx`: mobile-first, tabs [Asignados P] [En ruta R] [Historial], header "Hola {nombre} + Por rendir S/ X"
- [ ] 10.2 `features/repartidor/mis-entregas/EntregaCard.tsx`: card con N° pedido, cliente, dirección+distrito+ref, teléfono, total+envío, método, estado badge, tiempo desde asignación
- [ ] 10.3 `features/repartidor/mis-entregas/EntregaDetalle.tsx`: modal/drawer con botones grandes "Iniciar ruta" (P→R), "Confirmar entrega" (R→E), toggle "Compartir ubicación" (solo en R), mapa mini opcional
- [ ] 10.4 `features/repartidor/mis-entregas/PorRendirPanel.tsx`: lista pedidos E efectivo sin rendir, total, aviso "Entrégalo en Caja /caja/rendicion"
- [ ] 10.5 `features/repartidor/mis-entregas/useGpsTracking.ts`: hook `navigator.geolocation.watchPosition` cada 30s en R, `POST /ubicacion`, auto-stop en E/C, maneja permiso denegado
- [ ] 10.6 `features/repartidor/mis-entregas/usePushNotifications.ts`: `usePushToken` en login, listener `onMessage` para mostrar toast in-app (nueva asignación, en ruta, supervisor)
- [ ] 10.7 Verificar: P→R activa GPS + push; R→E corta GPS + suma por rendir si efectivo; sin GPS → funciona; push recibidos en foreground/background — test dispositivo real + Cypress mobile

## 11. Frontend — Feature: Rendición Caja

- [ ] 11.1 `features/caja/rendicion/RendicionPage.tsx`: selector repartidor (autocomplete), tabla pedidos pendientes, resumen monetario (esperado, entregado, diferencia, clasificación), observaciones, botones Registrar/Validar/Observar/PDF
- [ ] 11.2 `features/caja/rendicion/PedidosPendientesTable.tsx`: columnas Pedido, Fecha, Cliente, Total, Método, Estado, Rendición; checkbox para selección parcial
- [ ] 11.3 `features/caja/rendicion/ResumenMonetario.tsx`: cards coloridas Cuadrado/Verde, Faltante/Rojo, Sobrante/Azul, cálculo reactivo al cambiar monto entregado
- [ ] 11.4 `features/caja/rendicion/ValidacionModal.tsx`: supervisor aprueba observados, cajero valida cuadrados
- [ ] 11.5 Verificar: rendición cuadrada → Validado + MOVIMIENTO_CAJA ingreso; faltante/sobrante → Observado + obs obligatoria; solo efectivo en rendición; PDF generado — test Cypress + verificar BD `MOVIMIENTO_CAJA`

## 12. Testing y Verificación Integral

- [ ] 12.1 Test unitario backend: `delivery-repository.sugerirCosto`, `push-service` token handling, `rendicion-service` diferencia lógica — `npm run test:unit` (vitest)
- [ ] 12.2 Test integración API: `POST /cliente/delivery` → `GET /cliente/delivery/{id}` → `PATCH /repartidor/entregas/{id}/ruta` → `PATCH /repartidor/entregas/{id}/entregar` → `POST /rendiciones` — `npm run test:integration` (supertest)
- [ ] 12.3 Test E2E Cypress flujos críticos:
  - Cliente web: login Gmail → crear delivery digital → seguimiento mapa
  - Staff teléfono: crear delivery → asignar → kanban iniciar ruta → entregar
  - Repartidor: ver asignada → iniciar ruta (push) → entregar efectivo → por rendir
  - Caja: rendir efectivo → validado → arqueo incluye ingreso
- [ ] 12.4 Verificar permisos: cada endpoint responde 403 sin permiso correcto — script `check-permissions.sh` con curl + tokens de prueba
- [ ] 12.5 Verificar GPS opcional: todos los flujos funcionan con `lat/lng NULL` — test con coordenadas nulas
- [ ] 12.6 Lint + typecheck: `npm run lint` + `npm run typecheck` (backend y frontend) — 0 errores
- [ ] 12.7 Build producción: `npm run build` (frontend + backend) — artifacts generados sin warnings

## 13. Documentación y Cierre

- [ ] 13.1 Actualizar `openspec/specs/delivery/spec.md` con spec final (archive delta)
- [ ] 13.2 Actualizar `openspec/specs/cliente-pedidos/spec.md` y `openspec/specs/caja/spec.md` (archive deltas)
- [ ] 13.3 Documentar endpoints nuevos en `openspec/docs/api/` o Swagger/OpenAPI — `npm run docs:generate`
- [ ] 13.4 Registrar change en `openspec` archive: `openspec archive "implementar-delivery-completo"` — specs sincronizados a main