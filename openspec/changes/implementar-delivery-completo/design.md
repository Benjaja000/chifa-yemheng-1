# Design

## Context

Ver `proposal.md` - Why. Estado actual: migraciones GPS ya aplicadas en BD (4 scripts), backend CRUD delivery básico existe (`/api/v1/delivery` con P→R→E), frontend solo placeholders. Stack: React+TS/Vite/Tailwind (frontend) + Express MVC + Zod + Supabase/Postgres (backend). Auth: JWT + roles/permisos (RBAC). Mapas: Leaflet/OSM (gratis, sin API key). Push: FCM (Firebase Cloud Messaging) para Android/web, Expo para iOS.

## Goals / Non-Goals

**Goals:**
- Implementar 6 features frontend completas + 4 grupos APIs backend + push notifications
- Reutilizar auth existente (`clienteAuthGuard` para web, `authGuard` + rol REPARTIDOR para app)
- GPS opcional nunca bloquea (BR-GPS-001), distancia solo sugiere (BR-GPS-002)
- Pago único digital en web, efectivo solo teléfono → rendición caja
- Arquitectura modular: cada feature en `src/features/<dominio>/<feature>/`

**Non-Goals:**
- App nativa iOS/Android (solo PWA/web responsive mobile-first)
- WebSockets tiempo real (polling 30s suficiente per specs)
- Notificaciones email/SMS (solo push in-app)
- Multi-tenant / multi-sede (single restaurante)

## Decisions

### 1. Arquitectura APIs: Routers separados por dominio
**Decisión:** 4 routers nuevos en `backend/src/routes/`:
- `cliente-delivery.ts` → `/api/v1/cliente/delivery/*` (clienteAuthGuard)
- `repartidor.ts` → `/api/v1/repartidor/entregas/*` (authGuard + rol REPARTIDOR)
- `delivery-seguimiento.ts` → `/api/v1/delivery/seguimiento/*` (authGuard + DELIVERY_*)
- `rendiciones.ts` → `/api/v1/rendiciones/*` (authGuard + REN_*)

**Razón:** Separación de responsabilidades, guards distintos, fácil auditoría y testing. Alternativa (todo en `delivery.ts`) mezclaría guards y crecería demasiado.

### 2. Haversine en BD vs App
**Decisión:** Función SQL `haversine_km(lat1, lng1, lat2, lng2)` en Postgres + endpoint `sugerir-costo` que la usa.

**Razón:** Cálculo consistente, evita duplicar lógica, aprovecha índices si se indexan coords. Alternativa (app) requiere replicar en frontend cliente + repartidor + staff.

### 3. Push Notifications: FCM (firebase-admin) + tabla `dispositivo_token`
**Decisión:** Nueva tabla `dispositivo_token(id_empleado, token, plataforma, activo, fecact)` + servicio `push-service.ts` con `firebase-admin`. Payload data-only para polling mapa, notification para alertas usuario.

**Razón:** FCM nativo Android/web, Expo para iOS si necesario. `firebase-admin` en backend evita keys en frontend. Alternativa (Expo server SDK) requiere cuenta Expo; FCM es estándar Google.

### 4. Frontend: Feature-based + Shared UI Kit
**Decisión:** Cada feature en `src/features/<dominio>/<feature>/` con sus `components/`, `hooks/`, `services/`, `types.ts`. Componentes UI reutilizables en `src/shared/ui/` (Button, Card, Modal, MapLeaflet, Timeline, Badge).

**Razón:** Escalable, evita duplicación, alinea con `pedidos-delivery.md` structure. Leaflet wrapper compartido para 3 mapas (cliente, staff, repartidor).

### 5. Rendición: Derivada de `PAGO_VENTA` + `MOVIMIENTO_CAJA`, sin tabla propia
**Decisión:** No crear tabla `RENDICION_DELIVERY`. Rendición = estado UI derivado: consultar `PEDIDO_DELIVERY E` + `PAGO_VENTA` método=EFECTIVO sin `MOVIMIENTO_CAJA` concepto='RENDICION_DELIVERY'. Registrar ingreso → `MOVIMIENTO_CAJA` (concepto VENTA AL CONTADO, afecta_efectivo=true).

**Razón:** Alineado con `rendicion-delivery.md` (corrige versión anterior que citaba tablas inexistentes). Simplifica modelo, reutiliza arqueo existente.

### 6. Polling 30s unificado: `usePolling` hook + AbortController
**Decisión:** Hook genérico `usePolling(fn, 30000)` en `src/shared/hooks/` para mapa + kanban + app repartidor. Limpia en unmount.

**Razón:** Evita memory leaks, centraliza lógica, fácil test. Alternativa (setInterval manual en cada componente) propenso a bugs.

### 7. Permisos: Extender seeds existentes
**Decisión:** Inserts en `PERMISO` + `ROL_PERMISO` via migration/seeds. Roles: REPARTIDOR (DELIVERY_VER, DELIVERY_ENTREGAR), CAJERO (REN_VER, REN_REGISTRAR), SUPERVISOR (todos DELIVERY_* + REN_VALIDAR).

**Razón:** Consistente con RBAC actual (`permission-guard.ts` usa `requirePermisos`).

### 8. Leaflet/OSM sin API key — CDN local en build
**Decisión:** `leaflet` + `leaflet-defaulticon-compatibility` via npm, CSS/JS servidos por Vite. Tile layer `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png` con atribución.

**Razón:** Gratis, sin límites, offline-capable con tiles cacheados. Alternativa Mapbox/Google requiere keys y cuotas.

## Risks / Trade-offs

| Riesgo | Mitigación |
|--------|------------|
| **Push tokens expiran/inválidos** | Manejo gracil: al error UNREGISTERED → `activo=false`, log auditoría, operación delivery no bloquea. Re-registro automático en login app. |
| **Polling 30s carga servidor** | Endpoints ligeros (`VW_DELIVERY_UBICACION` solo coords), índice en `pedido_delivery.estado` + `id_empleado`. Cache-Control: no-store. |
| **GPS preciso en móvil web** | `navigator.geolocation.getCurrentPosition({enableHighAccuracy:true, timeout:10000})` + fallback manual visible siempre. |
| **Haversine rendimiento** | Función SQL inlined, no índice espacial necesario (pocos distritos). Si crece: `postgis` + `ST_DistanceSphere`. |
| **Rendición concurrentes mismo repartidor** | `SELECT ... FOR UPDATE` en `PEDIDO_DELIVERY` al registrar rendición, o `INSERT ... ON CONFLICT` en `MOVIMIENTO_CAJA` con unique constraint. |
| **Leaflet SSR en Vite** | Import dinámico `const Leaflet = await import('leaflet')` solo en cliente (`useEffect` + `import.meta.env.SSR` check). |
| **FCM keys en servidor** | `FIREBASE_SERVICE_ACCOUNT` en env vars (Supabase Vault o `.env`), nunca en frontend. |
| **Zone.js / React 18 concurrent + Leaflet** | `L.Icon.Default.imagePath` fix + `useEffect` cleanup `map.remove()` estricto. |

## Migration Plan

1. **DB (ya hecho):** 4 migraciones GPS aplicadas ✅
2. **Seeds permisos:** Insert `PERMISO` + `ROL_PERMISO` para nuevos códigos
3. **Tabla `dispositivo_token`:** Migration `add_dispositivo_token`
4. **Backend routers:** Crear 4 archivos + registrar en `app.ts`
5. **Services/Repos:** Extender `delivery-repository` (haversine), nuevos services
6. **Frontend shared:** `MapLeaflet`, `Timeline`, `usePolling`, `push-client` (registro token)
7. **Features frontend:** 6 features en orden: cliente-delivery → cliente-seguimiento → admin-pedidos-delivery → delivery-seguimiento → repartidor-mis-entregas → caja-rendicion
8. **Push integration:** En `asignarRepartidorService`, `despacharService`, `repartidor-iniciar-ruta` → llamar `pushService.enviar(...)`
9. **Testing:** E2E Cypress flujos críticos (crear→asignar→ruta→entregar→rendir)
10. **Deploy:** Build Vite → dist/ servida por Express static o CDN

**Rollback:** Migraciones GPS son `ADD COLUMN IF NOT EXISTS` + `DROP FUNCTION/VIEW` reversibles. Features frontend detrás de feature flags si necesario.

## Open Questions

1. **FCM vs Expo unificado:** ¿Usar solo FCM (data-only + notification) para ambas plataformas, o Expo para iOS? (Decidible en implementación push-service)
2. **Índice espacial PostGIS:** ¿Instalar `postgis` extension para `ST_DistanceSphere` nativo o mantener haversine SQL? (Haversine SQL suficiente para ~50 distritos)
3. **Background polling en PWA:** ¿Service Worker para push/data-only cuando app cerrada? (Fase 2, polling 30s solo en foreground por ahora)
4. **Notificación "cliente listo" trigger exacto:** ¿Al crear delivery (P) o al despachar (R)? Spec dice evento 2 = "delivery despachado" (R). Confirmar con stakeholder.