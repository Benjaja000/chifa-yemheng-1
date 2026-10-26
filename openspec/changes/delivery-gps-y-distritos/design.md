# Design: delivery-gps-y-distritos

## Contexto
- Backend ya expone `GET /api/v1/cliente/delivery/sugerir-costo`,
  `POST /api/v1/cliente/delivery`, `GET /api/v1/cliente/delivery/:id/ubicacion`
  y, para staff/repartidor, `GET /api/v1/delivery/sugerir-costo`,
  `PATCH /api/v1/repartidor/entregas/:id/ruta|entregar`, `POST .../ubicacion`.
- `distrito` tiene `lat_ref, lng_ref, radio_km, costo_base`; `pedido_delivery` tiene
  `lat_cliente, lng_cliente, lat_repartidor, lng_repartidor, f_ubicacion`.
- `vw_delivery_ubicacion` consolida coordenadas + estado + tiempos (sin PII).
- `DeliveryWizard` (carta → dirección → confirmar) ya cablea distrito real.
- El precio de producto vive en `producto.precio`; el total oficial lo recalcula el
  backend al cobrar (`usp_agregar_detalle_pedido`), el front solo muestra.

## Decisiones
- **D1 — Flujo único.** `delivery-page.tsx` = contenedor. Sin sesión: presentación
  informativa (sin datos de negocio). Con sesión: `DeliveryWizard` o, ya creado el
  delivery, `DeliveryTracking`. Se elimina el flujo legacy.
- **D2 — Autoridad sobre el costo.**
  - Cliente: costo **sugerido en solo lectura** (derivado del distrito), evita
    manipulación de precios.
  - Empleado `DELIVERY_VER`: ajusta `costo_envio` manualmente al registrar/confirmar.
- **D3 — Sugerencia server-side.** haversine + `costo_base` + recargo por km fuera de
  `radio_km` ocurre en backend; el front solo muestra.
- **D4 — Recargo parametrizado.** `distrito.recargo_km` (default 1.50) sustituye el
  literal `1.5` en `delivery-repository.ts`. Si es NULL/0 → sin recargo.
- **D5 — GPS opcional.** Sin GPS o sin permiso se usa `distrito` + `costo_base`
  (endpoint con `lat/lng` opcionales); nunca bloquea (BR-GPS-001).
- **D6 — Precio real.** El ítem lleva `precioUnit`; `ConfirmarStep` suma
  `Σ (precioUnit × cantidad)`. Nunca una constante.
- **D7 — Realtime con respaldo.** Tracking en vivo por `postgres_changes` sobre
  `pedido_delivery` (requiere migración) + polling 30s como respaldo.
- **D8 — Desacoplar de la vista.** El cliente lee `vw_delivery_ubicacion` (sin PII),
  no `pedido_delivery` directo.

## Flujo de datos
```
Cliente elige Depto→Prov→Distrito (/maestros/*)
        │
        ├─ (opcional) GPS → sugerirCosto(distrito, lat, lng)
        └─ sin GPS        → sugerirCosto(distrito) ⇒ costo_base
                │
        costoSugerido (solo lectura para el cliente, D2)
                │
        POST /cliente/delivery { distritoId, costoEnvio, lat?, lng?, ... }
                │
        PEDIDO_DELIVERY.costo_envio = valor confirmado (BR-DER-033)
                │
Repartidor: PATCH /repartidor/entregas/:id/ruta → situación R
            POST /repartidor/entregas/:id/ubicacion (throttle) → lat/lng_repartidor
                │
Cliente: GET /cliente/delivery/:id/ubicacion (vw) + Realtime → MapLeaflet
```

## Contrato API
| Método | Ruta | Guard | Cambio |
|---|---|---|---|
| GET | `/cliente/delivery/sugerir-costo` | cliente | `lat`/`lng` ahora **opcionales** |
| GET | `/delivery/sugerir-costo` | `DELIVERY_VER` | `lat`/`lng` ahora **opcionales** |
| GET | `/cliente/delivery/:id/ubicacion` | cliente | sin cambios (vista) |
| POST | `/cliente/delivery` | cliente | sin cambios |

## Esquema / Migraciones
- `alter-data/add-geolocalizacion/05_alter_distrito_recargo.sql` — `distrito.recargo_km`
  `numeric(10,2) DEFAULT 1.50 NOT NULL` + CHECK + COMMENT (idempotente).
- `alter-data/add-geolocalizacion/06_enable_realtime_pedido_delivery.sql` — añade
  `pedido_delivery` a `supabase_realtime` + `REPLICA IDENTITY FULL` (idempotente).

## Riesgos
- Distritos sin `costo_base` ⇒ sugerido 0: aceptable (estado vacío), nunca inventar.
- Realtime requiere la migración 06; sin ella el tracking baja a polling (D7).
- `REPLICA IDENTITY FULL` aumenta el payload del WAL: aceptable para el volumen del chifa.

## Ownership de archivos
- Backend: `delivery-repository.ts`, `schemas/delivery.ts`, controladores/servicios de
  `cliente-delivery` y `delivery`, `api-client.ts`.
- Frontend: `features/cliente/delivery/**`, `features/repartidor/entrega-detalle/**`,
  `shared/hooks/useRealtimeDelivery.ts`, `shared/hooks/useDeliveryUbicacion.ts`.
