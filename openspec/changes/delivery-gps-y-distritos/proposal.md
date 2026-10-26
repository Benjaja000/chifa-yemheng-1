# Proposal: delivery-gps-y-distritos

## Por qué
El flujo de delivery del cliente estaba dividido y con datos inventados:
- `cliente/delivery/delivery-page.tsx` mantenía un flujo legacy paralelo con `DISTRITOS`
  (id + costo) hardcodeado, `totalFinal` local, `enviar()` con `setTimeout` que no
  llamaba a la API, y horarios de atención inventados.
- El wizard (`DeliveryWizard`) ya usaba distritos reales, pero el precio se perdía:
  `ConfirmarStep` recalculaba con la constante `15`.
- El backend calcularra el recargo por km con el literal `1.5` en TS.
- El repartidor capturaba su GPS y solo hacía `console.log` (no se persistía), por lo
  que el cliente no podía seguir al repartidor de verdad.

Esto viola el contexto del proyecto (toda cifra viene de BD) y las reglas
BR-DER-033 / BR-GPS-001 / BR-GPS-002.

## Qué
- **Un flujo único de delivery cliente**: `delivery-page.tsx` pasa a ser contenedor
  (`DeliveryWizard` → `DeliveryTracking`); se elimina el flujo legacy y todo hardcode
  (distritos, costos, horarios, textos de negocio).
- **Precio real propagado**: el ítem del carrito transporta `precioUnit` tomado de
  `producto.precio`; el resumen suma `Σ (precioUnit × cantidad)`, sin constantes.
- **Recargo por km parametrizado**: nueva columna `distrito.recargo_km` (dato de
  negocio); el backend la lee en `sugerirCosto` en lugar del literal `1.5`.
- **Costo sugerido sin GPS**: `GET /api/v1/cliente/delivery/sugerir-costo` acepta
  `lat`/`lng` opcionales; sin GPS devuelve `costo_base`. El cliente lo ve en
  **solo lectura** (BR-DER-033).
- **Seguimiento real del repartidor**: el repartidor persiste su GPS
  (`usp_actualizar_ubicacion_delivery` → `lat/lng_repartidor`, `f_ubicacion`),
  con throttle; el cliente consume `vw_delivery_ubicacion` y dibuja el mapa
  (`MapLeaflet`) con pin de repartidor y de cliente.
- **Realtime**: se habilita `pedido_delivery` en la publicación `supabase_realtime`
  (nueva migración idempotente) + hook `useRealtimeDelivery`, con respaldo por polling.
- **Datos reales en la app del repartidor**: `entrega-detalle-page` carga la entrega
  por `getMiEntrega` y llama a `iniciarRuta`/`confirmarEntrega` reales (antes era UI
  estática con dirección/cliente hardcodeados).

## No objetivos
- Pago mixto: se mantiene pago único (BR-DER-030).
- Nuevas columnas distintas de `recargo_km` (GPS ya migrado en `add-geolocalizacion`).
- Permiso nuevo: se reutiliza `DELIVERY_VER` para el ajuste manual de costo.
- Creación de infraestructura nueva (tabla `parametro` global): el recargo vive en
  `distrito`, junto a `radio_km`/`costo_base`.
- Horarios de atención: no existe tabla/BR que los respalde → no se inventan.

## Criterios de aceptación
- No queda ninguna cifra/distrito/horario hardcodeado en `cliente/delivery/**`.
- Sin GPS: seleccionar distrito devuelve `costoSugerido` de `distrito.costo_base`
  (vía `/cliente/delivery/sugerir-costo` sin `lat/lng`).
- Con GPS: el sugerido usa la distancia real + `distrito.recargo_km` fuera de `radio_km`.
- El repartidor al iniciar ruta persiste GPS; el cliente lo ve en el mapa y recibe
  cambios por Realtime (respaldo polling 30s).
- `POST /cliente/delivery` persiste el `costo_envio` confirmado (BR-DER-033).
- BRs cubiertos: BR-DER-033, BR-GPS-001, BR-GPS-002, BR-RES-021, BR-EST-009,
  BR-ACC-040/041.
