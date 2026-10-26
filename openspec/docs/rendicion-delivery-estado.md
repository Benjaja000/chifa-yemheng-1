# Rendición de Delivery — Estado y pendientes

> Cambio OpenSpec: `implementar-delivery-completo` → grupo "Rendición Caja"
> Spec: [rendicion-caja/spec.md](../changes/implementar-delivery-completo/specs/delivery/rendicion-caja/spec.md)
> Última actualización: 2026-10-25

---

## 1. Entender esta parte (contexto)

### 1.1 Qué resuelve

Un repartidor sale con pedidos **pagados en efectivo contra entrega**. Al volver,
entrega el dinero al cajero. La caja debe:

1. Saber **qué pedidos entregados aún no han sido rendidos** por repartidor.
2. **Registrar** el monto entregado como **ingreso de caja** (impacta el arqueo).
3. Detectar **faltante / sobrante** y exigir observación obligatoria.
4. **Validar** (cajero) u **observar/aprobar** (supervisor) la rendición.
5. Excluir pagos digitales (Yape/Plin/tarjeta) de la rendición física — **BR-INF-051**.

### 1.2 Decisión de diseño clave: **no existe tabla `rendicion_delivery`**

La rendición **no tiene tabla propia**. Es un *estado derivado*:

| Concepto | Dónde vive |
|---|---|
| Pedidos entregados por repartidor | `pedido_delivery.situacion = 'E'` + `id_empleado` |
| Método de pago real | `venta → pago_venta → metodo_pago.afecta_efectivo` |
| Monto pagado (sin envío) | `pago_venta.monto` |
| Costo de envío | `pedido_delivery.costo_envio` |
| **Marca de "ya rendido"** | `movimiento_caja.id_pedido` (registro activo) |
| Ingreso al arqueo | `movimiento_caja` + `apertura_caja.monto_sistema` |

**Total esperado por pedido = `pago_venta.monto + pedido_delivery.costo_envio`.**

> ⚠️ El camino de relación **NO** es `pedido_delivery → pago_venta` (no existe).
> Es: `pedido_delivery → pedido → venta → pago_venta → metodo_pago`.
> Este fue el bug raíz del 500 en `GET /repartidor/por-rendir` y en
> `GET /rendiciones/pendientes`.

### 1.3 Modelo elegido (Opción A): **1 movimiento de caja por pedido**

Al registrar una rendición de N pedidos se insertan **N filas** en
`movimiento_caja`, cada una con:

- `id_pedido` + `id_venta` (relación 1:1 con la venta del pedido) → trazabilidad fina.
- `id_concepto` = catálogo **`VENTA AL CONTADO`** (afecta efectivo).
- `id_metodopago` = primer método con `afecta_efectivo = 'S'`.
- `descripcion` = lote + número de pedido (permite reconstruir el lote de la rendición).

**Por qué:** `VU-DEL-005` ("un pedido solo puede rendirse una vez") se resuelve con un
simple `NOT EXISTS` sobre `id_pedido`, sin tocar el esquema. La "consolidación por
repartidor" la hace `apertura_caja` (suma de movimientos) + la marca de lote.

### 1.4 Por qué hay que pasar por un wrapper `fn_*`

`supabase.rpc()` **no consume parámetros `OUT`**. El SP de negocio
`usp_registrar_movimiento_caja` los usa, por lo que **no es invocable** desde el backend.
Solución (convención del proyecto, igual que `fn_anular_venta_con_nc`): exponer un
wrapper `fn_registrar_movimiento_caja(...) RETURNS TABLE` con `SECURITY DEFINER`.

**Ventaja:** el SP ya calcula `id_tipomovimiento`, `signo`, `afecta_efectivo`
desde los catálogos `concepto_caja × metodo_pago` y **actualiza `apertura_caja`**
(`total_ingresos`, `monto_sistema`). No duplicamos esa lógica en TypeScript.

### 1.5 Mapa de archivos

```
backend/src/
  routes/rendiciones.ts              → 5 endpoints (authGuard + REN_*)
  controllers/rendicion-controller.ts→ zod schemas + mapeo HTTP
  services/rendicion-service.ts      → passthrough
  repositories/rendicion-repository.ts → ✅ reescrito (modelo A)

frontend/src/
  features/caja/rendicion/RendicionPage.tsx → ⚠️ MOCK (no consume la API)
  shared/services/api-client.ts             → ✅ métodos ya existen

openspec/database/alter-data/add-rendicion-wrapper/
  01_fn_registrar_movimiento_caja.sql       → ✅ script fuente
supabase/migrations/
  rendicion_fn_registrar_movimiento_caja.sql → ⚠️ creado, NO aplicado aún
```

---

## 2. Estado actual

### ✅ Hecho

- **`rendicion-repository.ts` reescrito** al modelo A:
  - embed correcto `pedido → cliente` y `pedido → venta → pago_venta → metodo_pago`;
  - discriminación de efectivo por `metodo_pago.afecta_efectivo = 'S'` (**sin hardcodear 'EFECTIVO'**);
  - `idsPedidosRendidos()` → implementa `VU-DEL-005` vía `NOT EXISTS` por `id_pedido`;
  - `registrarRendicion()` inserta 1 movimiento por pedido vía RPC, usando `id_movimientocaja` (PK real);
  - `validar`/`observar`/`getRendicionPdf` usan columnas reales (`id_movimientocaja`, `documento`).
- **Wrapper SQL** `fn_registrar_movimiento_caja` escrito (script fuente + migración).
- **Controller** devuelve `409` en `PEDIDO_YA_RENDIDO` / `CAJA_NO_ABIERTA` y `400` en el resto.
- **2 tests obsoletos de `/api/v1/personas`** eliminados (ruta inexistente).
- **`npx tsc --noEmit`** OK · **`npm test` 61/61 verde**.

### ⛔ Bloqueante inmediato

- **La función `fn_registrar_movimiento_caja` NO existe en la BD viva** (el RPC responde `404`).
  Mientras no se aplique, `POST /api/v1/rendiciones` fallará con
  `MOVIMIENTO_CAJA_FAIL: ... 404`.

---

## 3. Falta implementar

### 3.1 Base de datos

- [ ] **Aplicar `supabase/migrations/rendicion_fn_registrar_movimiento_caja.sql`**
      (Supabase Dashboard → SQL Editor → Run). Verificar:
      ```sql
      SELECT p.proname FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
      WHERE n.nspname = 'public' AND p.proname = 'fn_registrar_movimiento_caja';
      ```
- [ ] **Verificar permisos** `REN_VER`, `REN_REGISTRAR`, `REN_VALIDAR` en
      `permiso` y `rol_permiso`, asignados a CAJERO / SUPERVISOR / ADMIN (task 1.4).
- [ ] Confirmar que existe un turno abierto (`apertura_caja.situacion = 'A'`),
      si no → `CAJA_NO_ABIERTA`.

### 3.2 Backend (gaps de diseño)

- [ ] **Persistencia del estado de rendición (Rendido / Observado / Validado).**
      Hoy `validarRendicion`/`observarRendicion` solo tocan auditoría (`usumod`/`fecmod`);
      **no queda registrado** que la rendición fue validada. La spec exige
      Rendido → Validado y Observado → Validado.
      *Opciones a decidir:* (a) usar `movimiento_caja.estado` (`'A'/'I'/'E'` del CHECK)
      con una convención documentada; (b) columna nueva; (c) derivarlo de auditoría.
      **Decisión pendiente — no implementar sin acordar.**
- [ ] Endpoint `GET /api/v1/rendiciones` (histórico) — mencionado en tasks 3.4,
      **no existe** en el router. Necesario para "exportar histórico".
- [ ] Test unitario de la lógica de diferencia (`rendicion-service`) — task 12.1.
- [ ] Test de integración `POST /rendiciones` → verificar N filas en `movimiento_caja`
      y `apertura_caja.monto_sistema` — task 12.2.

### 3.3 Frontend

- [ ] **`RendicionPage.tsx` es un mock completo**: no llama a la API, usa `mockPedidos`
      y calcula KPIs localmente. Reemplazar por los métodos reales de `api-client.ts`
      (que ya existen).
- [ ] `PedidosPendientesTable.tsx` — tabla con checkbox de selección parcial.
- [ ] `ResumenMonetario.tsx` — cards Cuadrado/Faltante/Sobrante reactivas.
- [ ] `ValidacionModal.tsx` — aprobar observados / validar cuadrados.
- [ ] Selector de repartidor (autocomplete) que alimente `repartidorId`.

### 3.4 Reportes

- [ ] **PDF real.** `getRendicionPdf` devuelve **JSON**, no un PDF. Falta generación
      y descarga real (constancia con firma del validador).
- [ ] Exportar histórico Excel/PDF con filtros (fecha / repartidor / estado).

### 3.5 Bloqueante externo (otro módulo)

- [ ] Cargar **centroides de distritos** (`distrito.lat_ref` / `lng_ref`) y
      `costo_base` — hoy están vacíos/`0.00`, lo que impide validar haversine real
      (afecta `sugerir-costo`, no a rendición).

---

## 4. Cómo verificarlo paso a paso

1. **Aplicar la migración** del wrapper (§3.1) y confirmar que el RPC responde
   (ya no `404`).
2. Abrir un turno de caja (`apertura_caja.situacion = 'A'`).
3. `GET /api/v1/rendiciones/pendientes?repartidorId=<id>` con token `REN_VER`
   → debe listar solo pedidos `E` con pago efectivo sin movimiento previo.
4. `POST /api/v1/rendiciones` con un monto igual al esperado → `201`,
   `estado: "Rendido"`, `diferencia: 0`.
   - Verificar en BD: N filas nuevas en `movimiento_caja` con `id_pedido`, y
     `apertura_caja.monto_sistema` incrementado.
5. Repetir el mismo `POST` → `409 PEDIDO_YA_RENDIDO` (VU-DEL-005).
6. `POST` con monto menor → `400 OBSERVACION_REQUERIDA` si no se envía observación;
   `201 estado: "Observado"` con `diferencia < 0` si se envía.

---

## 5. Riesgos / notas

- **Cifras siempre leídas de BD** — nunca hardcodear montos ni el string `'EFECTIVO'`
  (ya se usa el catálogo `metodo_pago.afecta_efectivo`).
- **GPS nunca bloquea** (BR-GPS-001) — no aplica a rendición, pero rige en delivery.
- **Pagos digitales** deben seguir **fuera** de la rendición física (BR-INF-051);
  el filtro `afecta_efectivo = 'S'` es la única fuente de verdad.
- La rama de tests tiene un fallo **flaky** conocido en el test GPS de delivery
  (pool de vitest); en retry pasa.
