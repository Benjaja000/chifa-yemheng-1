# Proposal

## Why

El módulo **delivery** está pendiente de implementación completa: solo existe CRUD backend básico (P→R→E), pero faltan todas las integraciones operativas — GPS/geolocalización (ya migrado a BD), APIs cliente (web), APIs repartidor (app móvil), kanban staff con mapa vivo, rendición de efectivo en caja, y notificaciones push al repartidor. Esto bloquea el flujo delivery end-to-end que el chifa necesita para operar.

## What Changes

**Backend (nuevas rutas/servicios):**
- `POST /api/cliente/delivery` + `GET /api/cliente/delivery/sugerir-costo` — creación delivery web con pago digital único y sugerencia costo GPS
- `GET/PATCH /api/cliente/delivery/{id}` + `/ubicacion` — seguimiento cliente solo lectura + mapa
- `GET/PATCH /api/repartidor/entregas/*` — app repartidor: mis entregas, iniciar ruta, confirmar entrega, compartir GPS (30s en R), ver "por rendir"
- `GET/PATCH /api/delivery/seguimiento/*` — kanban staff: lista/kanban P/R/E, mapa vivo, acciones iniciar/entregar/anular
- `GET/POST/PATCH /api/rendiciones/*` — rendición efectivo contra entrega → `MOVIMIENTO_CAJA` (concepto VENTA AL CONTADO)
- Push notifications (FCM/Expo) al repartidor: **nueva entrega asignada**, **cliente espera**, **ruta iniciada**

**Frontend (features completas):**
- `features/cliente/delivery` — wizard 3 pasos (carta → dirección+GPS → confirmar digital)
- `features/cliente/delivery-seguimiento` — timeline P→R→E + mapa Leaflet solo lectura
- `features/admin/pedidos-delivery` — crear + asignar repartidor (modal con GPS opcional, costo sugerido)
- `features/delivery/seguimiento` — kanban + mapa vivo (Leaflet/OSM) + KPIs
- `features/repartidor/mis-entregas` — mobile-first: tabs P/R/historial, cards, botones grandes, toggle GPS, "por rendir"
- `features/caja/rendicion` — selector repartidor, tabla pendientes, resumen monetario, validación supervisor (cuadrado/faltante/sobrante)

**BD (ya aplicado - migraciones GPS):**
- `pedido_delivery`: `lat_cliente`, `lng_cliente`, `lat_repartidor`, `lng_repartidor`, `f_ubicacion` + CHECKs
- `distrito`: `lat_ref`, `lng_ref`, `radio_km` (default 5), `costo_base`
- `usp_actualizar_ubicacion_delivery(id_pedido, lat, lng, 'CLIENTE'|'REPARTIDOR')`
- `vw_delivery_ubicacion` — vista consolidada para mapas (polling 30s)

**Permisos (seeds):**
- `DELIVERY_VER`, `DELIVERY_ASIGNAR`, `DELIVERY_DESPACHAR`, `DELIVERY_ENTREGAR`
- `CLIENTE_PEDIDOS` (cliente web)
- `REN_VER`, `REN_REGISTRAR`, `REN_VALIDAR` (caja)
- Asignados a roles: ADMIN, GERENTE, SUPERVISOR, MOZO, CAJERO, REPARTIDOR

## Capabilities

### New Capabilities
- `delivery/cliente-web`: Creación y seguimiento delivery desde web cliente (Gmail obligatorio, pago digital único, GPS opcional, sugerencia costo por distancia)
- `delivery/repartidor-app`: App móvil repartidor — mis entregas, iniciar ruta/entregar, compartir GPS en R (30s), ver saldo por rendir, **push notifications**
- `delivery/seguimiento-staff`: Kanban operativo staff + mapa vivo (polling 30s), acciones P→R→E, anular P→C
- `delivery/rendicion-caja`: Rendición efectivo contra entrega → ingreso consolidado en `MOVIMIENTO_CAJA`, validación supervisor
- `delivery/notificaciones-push`: Notificaciones push al repartidor (FCM/Expo) para eventos: asignación, cliente listo, ruta iniciada

### Modified Capabilities
- `delivery`: Requiere delta spec — el spec actual es solo placeholder; ahora define requisitos completos de APIs, estados, GPS, pagos, integración caja
- `cliente-pedidos`: Requiere delta spec — agregar endpoints delivery cliente (`/api/cliente/delivery/*`) y reutilizar autenticación Gmail existente
- `caja`: Requiere delta spec — agregar flujo rendición delivery (efectivo contra entrega) que alimenta `MOVIMIENTO_CAJA` y arqueo

## Impact

**Código afectado:**
- Backend: `src/routes/`, `src/controllers/`, `src/services/`, `src/repositories/` — nuevos archivos + extender `delivery-repository` con `sugerirCosto` haversine
- Frontend: `src/features/cliente/delivery*`, `src/features/admin/pedidos-delivery`, `src/features/delivery/seguimiento`, `src/features/repartidor/mis-entregas`, `src/features/caja/rendicion`
- BD: Migraciones GPS ya aplicadas; seeds permisos + datos distrito (lat_ref/lng_ref/radio_km/costo_base)
- Auth: `clienteAuthGuard` reutilizado; nuevo guard para repartidor (rol REPARTIDOR)
- Push: Nueva dependencia `firebase-admin` o `expo-server-sdk` + tabla `dispositivo_token` (usuario, token, plataforma, activo)

**APIs existentes:** No hay breaking changes — solo se agregan nuevas rutas bajo `/api/v1/cliente/delivery`, `/api/v1/repartidor/entregas`, `/api/v1/delivery/seguimiento`, `/api/v1/rendiciones`

**Reglas de negocio (BR-*):** Todas ya catalogadas en `REGLAS_DE_NEGOCIO.md` — BR-ACC-040/041/045, BR-DER-033, BR-GPS-001/002, BR-INF-051, BR-RES-021. No se inventan reglas nuevas.