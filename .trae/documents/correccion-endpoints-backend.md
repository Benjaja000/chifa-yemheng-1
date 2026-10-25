# Corrección de endpoints del backend (delivery, inventario, reportes, reservas, seguridad)

## Summary

El smoke test en vivo contra Supabase reveló que **5 módulos del backend fueron escritos contra un esquema asumido** y no contra el esquema real de la base de datos. Esto provoca:

1. **Errores de PostgREST** en 6+ endpoints (`column ... does not exist`, `Could not find a relationship ...`).
2. **Caída total del proceso Node**: Express 4 no captura rechazos de funciones `async`, y los controladores afectados no tienen `try/catch`. Cualquier error async tumba el servidor para **todos** los usuarios.
3. **Suite de tests que no corre**: falta `@vitest/coverage-v8` y el import del test apunta a una ruta inexistente.

Este plan corrige los 5 repositorios contra el **esquema LIVE real** (verificado vía Supabase y el DDL de `openspec/database/inserciones/yemheng.sql`), introduce un wrapper `asyncHandler` global, arregla los tests y alinea el contrato de reportes con su frontend.

**Alcance confirmado por el usuario:** módulos completos (lecturas + escrituras), wrapper `asyncHandler` global, arreglar tests, y "alinear contrato + frontend" en reportes.

---

## Current State Analysis

### Esquema LIVE (fuente autoritativa, verificada)

| Tabla | Columnas reales relevantes | Lo que el código asume (incorrecto) |
|---|---|---|
| `pedido_delivery` | PK `id_pedidodelivery`, `id_pedido`, `id_distrito`, `id_empleado`, `direccion_entrega`, `referencia`, `telefono_contacto`, `costo_envio`, `f_salida`, `f_entrega`, `situacion(P/R/E/C)` | `id_delivery`, `direccion`, `telefono`, `id_repartidor`, `costo` |
| `distrito` | `d_distrito` | `n_distrito` |
| `empleado` → `persona` | `empleado.id_persona` → `persona(nombre, ap_paterno, ap_materno)` | `repartidor:empleado(n_nombres, n_apepaterno)` (relación y columnas inexistentes) |
| `movimiento_inventario` | PK `id_movimientoinv`, `id_producto`, `id_usuario`(**NOT NULL**), `id_pedido?`, `tipo_movimiento(E/S/A/M)`, `cantidad`, `stock_anterior`(NOT NULL), `stock_nuevo`(NOT NULL), `costo_unitario`, `documento?`, `observacion?`, `f_movimiento` | `id_movimiento`, `costo`, `motivo`; INSERT omite `id_usuario`, `stock_anterior`, `stock_nuevo` |
| `receta` | `id_receta`, `id_producto`, `id_insumo`, `cantidad`(CHECK > 0), audit, `estado` — **sin** `unidad_medida` | `unidad_medida(n_unidad)` (relación inexistente) |
| `reserva` | `id_reserva`, `id_cliente`, `id_mesa?`, `id_usuario`(**NOT NULL**), `f_reserva`(timestamp), `n_personas`(default 2), `adelanto`, `situacion(P/C/A/X)`, `observacion` | `hora`, `comensales`; INSERT omite `id_usuario` |
| `mesa` | `numero` | `n_mesa` |
| `persona` | `nombre`, `ap_paterno`, `ap_materno` | `n_nombres`, `n_apepaterno` |
| `usuario` | `id_usuario`, `id_tipousuario`(NOT NULL), `id_empleado`(NOT NULL), `logeo`, `clave`, `intentos`, `bloqueado`, `f_ultimoacceso`, audit, `estado` | `tipo`, `id_personal` |
| `tipo_usuario` | `id_tipousuario`, `n_tipousuario` (datos: 1 ADMINISTRADOR, 2 CAJERO, 3 MOZO, 4 COCINA, 5 SUPERVISOR) | — |

### Vistas (definidas en `openspec/database/inserciones/yemheng.sql`)

- `vw_ventas_diarias` (L2699-2708): `fecha, tipodocumento, n_comprobantes, subtotal, igv, total`.
  El código espera `total_ventas, cantidad_ventas, total_efectivo, total_tarjeta` → **no existen**. `GET /reportes/ventas-diarias` devuelve objetos vacíos.
- `vw_productos_mas_vendidos` (L2681-2692): `id_producto, n_producto, n_categoriaproducto, cantidad_vendida, importe_vendido`.
  El código ordena por `cantidad` y mapea `r.cantidad`/`r.total` → **error `column cantidad does not exist`**.
- `vw_arqueo_caja` (L2579-2597): `id_aperturacaja, n_caja, numero_turno, f_apertura, f_cierre, usuario_apertura, usuario_cierre, monto_inicial, total_ingresos, total_egresos, monto_sistema, monto_declarado, diferencia, situacion`.
  El código usa `id_apertura`, `total_ventas` y filtra por `id_caja` → **no existen** (el filtro `cajaId` rompería con 500).

### Infraestructura

- `backend/src/server.ts`: `createApp()` + `app.listen(...)`. No hay manejo de `unhandledRejection`.
- `backend/src/middlewares/error-handler.ts`: `errorHandler` sólo captura errores síncronos reenviados por Express.
- No existe ninguna función `asyncHandler`/`catchAsync`/`wrapAsync` en `backend/src`.
- `backend/src/app.ts` L49-50: indentación rota (cosmético, sin efecto funcional).
- `backend/vitest.config.ts`: `coverage: { enabled: true }` sin `provider` explícito.
- `backend/package.json`: `devDependencies` no incluye `@vitest/coverage-v8` → `npm test` falla al arrancar.
- `backend/src/routes/__tests__/endpoint-tests.test.ts` L2: `import { createApp } from '../app.js'` resuelve a `src/routes/app.js` (inexistente) → la suite no carga.

### Frontends afectados

- `frontend/src/features/admin/reportes/reportes-page.tsx`: interfaces `VentaDiaria`, `ProductoMasVendido`, `ArqueoCaja` y columnas de las 3 tablas deben alinearse al nuevo contrato.
- `frontend/src/features/admin/inventario/inventario-service.ts` + `inventario-page.tsx`: consumen `costo`/`motivo`/`unidad` — **el contrato se preserva** (sólo cambia el mapeo desde columnas reales), no requieren cambios.
- `frontend/src/features/admin/reservas-admin/*` y `frontend/src/features/staff/delivery/*`: consumen `hora`, `comensales`, `costo`, `direccion`, `telefono`, `repartidor` — **el contrato se preserva** (se derivan del esquema real), no requieren cambios.
- `frontend/src/features/admin/usuarios/usuarios-page.tsx`: usa `u.tipo` (string) — **el contrato se preserva**, no requiere cambios.

---

## Proposed Changes

### Grupo A — Infraestructura (bloqueante: sin esto el servidor sigue cayéndose)

#### A1. Nuevo: `backend/src/utils/async-handler.ts`

**Qué:** utilidad que envuelve handlers async y reenvía sus rechazos al `errorHandler` de Express.

```ts
import type { NextFunction, Request, RequestHandler, Response } from 'express';

/** Express 4 no captura rechazos de handlers async: los reenvía al errorHandler. */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
```

**Por qué:** un rechazo async en cualquier controlador mata el proceso Node completo (`unhandledRejection` → exit) y deja sin servicio a todos los usuarios, no sólo al que hizo la petición.

**Cómo:** se aplica a nivel de **router** (no se toca ningún controlador): una línea por endpoint.

#### A2. Aplicar `asyncHandler` en los 5 routers

| Archivo | Handlers a envolver |
|---|---|
| `backend/src/routes/delivery.ts` | `getDelivery`, `postDelivery`, `patchAsignar`, `patchDespachar`, `patchEntregar` |
| `backend/src/routes/inventario.ts` | `getMovimientos`, `postMovimiento`, `getRecetas`, `postReceta` |
| `backend/src/routes/reportes.ts` | `getVentasDiarias`, `getProductosMasVendidos`, `getArqueoCaja` |
| `backend/src/routes/reservas.ts` | `getReservas`, `postReserva`, `patchConfirmar`, `patchAnular` |
| `backend/src/routes/seguridad.ts` | `getUsuarios`, `postUsuario`, `putUsuario`, `getRoles`, `postRol`, `getPermisos`, `putRolPermisos` |

Patrón (ejemplo en `delivery.ts`):

```ts
deliveryRouter.get('/', requirePermisos('DELIVERY_VER'), asyncHandler(getDelivery));
```

Los controladores ya tienen `try/catch` propio donde corresponde; envolverlos es idempotente y no altera su comportamiento.

#### A3. `backend/src/server.ts` — red de seguridad

**Qué:** registrar un handler de `unhandledRejection` para que un rechazo no capturado se registre en vez de tumbar el proceso.

```ts
import { createApp } from './app.js';
import { env } from './config/env.js';

process.on('unhandledRejection', (reason) => {
  // eslint-disable-next-line no-console
  console.error('[unhandledRejection]', reason);
});

const app = createApp();

app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Chifa Yemheng API escuchando en http://localhost:${env.PORT}/api/v1`);
});
```

**Por qué:** respaldo del wrapper A1. No se registra `uncaughtException` porque Express sí captura throws síncronos y silenciarlos ocultaría bugs reales.

#### A4. `backend/src/app.ts` L49-50 — corregir indentación

```ts
  app.use('/api/v1/cliente', clienteAuthRouter);
  app.use('/api/v1/cliente/pedidos', clientePedidosRouter);
```

#### A5. Tests

- `backend/package.json`: agregar `"@vitest/coverage-v8": "^4.1.12"` a `devDependencies` (alineado con `vitest ^4.1.12`).
- `backend/vitest.config.ts`: fijar el proveedor explícitamente:
  ```ts
  coverage: { enabled: true, provider: 'v8' },
  ```
- `backend/src/routes/__tests__/endpoint-tests.test.ts` L2: `'../app.js'` → `'../../app.js'`.
- Ejecutar `npm install` en `backend/` para materializar la nueva dependencia.

---

### Grupo B — Reportes (cambio de contrato + frontend)

#### B1. `backend/src/models/reportes.ts`

Reemplazar las 3 interfaces por las que reflejan las vistas reales:

```ts
/** Tipos del módulo reportes (views VW_*). */
export interface VentaDiaria {
  fecha: string;
  tipodocumento: string;
  comprobantes: number;
  subtotal: number;
  igv: number;
  total: number;
}

export interface ProductoMasVendido {
  productoId: number;
  producto: string;
  categoria: string;
  cantidad: number;
  total: number;
}

export interface ArqueoCaja {
  turnoId: number;
  caja: string;
  numeroTurno: string;
  fechaApertura: string;
  fechaCierre: string | null;
  usuarioApertura: string;
  usuarioCierre: string | null;
  montoInicial: number;
  totalIngresos: number;
  totalEgresos: number;
  montoSistema: number;
  montoDeclarado: number;
  diferencia: number;
  situacion: string;
}
```

(`ReportesLista<T>` y `ReportesError` se mantienen sin cambios.)

**Por qué:** `total_ventas`, `cantidad_ventas`, `total_efectivo`, `total_tarjeta`, `id_apertura` y `total_ventas` no existen en las vistas; `vw_ventas_diarias` agrupa por `(fecha, tipodocumento)`, no por día.

#### B2. `backend/src/repositories/reportes-repository.ts`

- `VentaDiariaRow` → `{ fecha, tipodocumento, n_comprobantes, subtotal, igv, total }`; mapa:
  `fecha`, `tipodocumento`, `comprobantes: Number(r.n_comprobantes ?? 0)`, `subtotal`, `igv`, `total` (todos con `Number(... ?? 0)`).
  Normalizar `hasta`: `.lte('fecha', q.hasta)` sobre una columna `date` funciona con `YYYY-MM-DD`, se mantiene.
- `ProductoMasVendidoRow` → `{ id_producto, n_producto, n_categoriaproducto, cantidad_vendida, importe_vendido }`; mapa:
  `productoId`, `producto`, `categoria: r.n_categoriaproducto`, `cantidad: Number(r.cantidad_vendida ?? 0)`, `total: Number(r.importe_vendido ?? 0)`.
  **Orden:** `.order('cantidad_vendida', { ascending: false })` (hoy ordena por `cantidad`, que no existe → error).
- `ArqueoCajaRow` → columnas reales de la vista; mapa a las claves camelCase de B1.
  **Eliminar** la línea `if (q.cajaId) query = query.eq('id_caja', q.cajaId);` (la vista no expone `id_caja`).
  Normalizar `hasta` a fin de día: `.lte('f_apertura', \`${q.hasta}T23:59:59\`)` para no excluir el día completo.

#### B3. `backend/src/schemas/reportes.ts`

Eliminar `cajaId` de `reportesArqueoQuerySchema` (queda `{ desde?, hasta? }`), porque la vista no permite filtrarlo. `reportesProductosQuerySchema` mantiene `desde`/`hasta` aunque la vista no los use (zod los descarta sin error; el frontend los envía y no rompe).

#### B4. `frontend/src/features/admin/reportes/reportes-page.tsx`

Actualizar las 3 interfaces y las columnas:

- `VentaDiaria { fecha, tipodocumento, comprobantes, subtotal, igv, total }`
  Tabla "Ventas Diarias": `Fecha | Tipo doc | Comprobantes | Subtotal | IGV | Total` (se eliminan Efectivo/Tarjeta).
- `ProductoMasVendido { productoId, producto, categoria, cantidad, total }`
  Tabla "Productos Top": `Producto | Categoría | Cantidad | Total`.
- `ArqueoCaja { turnoId, caja, numeroTurno, fechaApertura, fechaCierre, usuarioApertura, usuarioCierre, montoInicial, totalIngresos, totalEgresos, montoSistema, montoDeclarado, diferencia, situacion }`
  Tabla "Arqueo Caja": reemplazar la columna `Ventas` (no existe) por `Sistema` (`montoSistema`) y `Declarado` (`montoDeclarado`); añadir `Turno` (`numeroTurno`); mantener `Caja | Apertura | Cierre | Inicial | Ingresos | Egresos | Diferencia | Estado`.

---

### Grupo C — Delivery

#### C1. `backend/src/repositories/delivery-repository.ts`

- `DeliveryRow`:
  ```ts
  interface DeliveryRow {
    id_pedidodelivery: number;
    id_pedido: number;
    id_distrito: number | null;
    distrito: { d_distrito: string } | null;
    direccion_entrega: string;
    referencia: string | null;
    telefono_contacto: string | null;
    id_empleado: number | null;
    repartidor: { persona: { nombre: string; ap_paterno: string | null; ap_materno: string | null } } | null;
    costo_envio: number;
    f_salida: string | null;
    f_entrega: string | null;
    situacion: string;
    feccre: string;
  }
  ```
- `SELECT`:
  ```
  'id_pedidodelivery, id_pedido, id_distrito, distrito(d_distrito), direccion_entrega, referencia, telefono_contacto, id_empleado, repartidor:empleado(persona(nombre, ap_paterno, ap_materno)), costo_envio, f_salida, f_entrega, situacion, feccre'
  ```
- `mapRow`: `id` ← `id_pedidodelivery`; `distrito` ← `distrito?.d_distrito`; `direccion` ← `direccion_entrega`; `telefono` ← `telefono_contacto`; `repartidorId` ← `id_empleado`; `repartidor` ← `${persona.nombre} ${persona.ap_paterno ?? ''}`.trim(); `costo` ← `costo_envio`. **El contrato de la interfaz `Delivery` no cambia** (frontend intacto).
- `listarDelivery`: `.order('id_pedidodelivery', { ascending: false })`.
- `crearDelivery`: insertar `direccion_entrega`, `telefono_contacto`, `costo_envio` (en lugar de `direccion`, `telefono`, `costo`).
- `asignarRepartidor`: `.update({ id_empleado: repartidorId, ... })` y `.eq('id_pedidodelivery', id)`.
- `despacharDelivery`: añadir `f_salida: new Date().toISOString()` al update (columna existente y hoy sin usar; corresponde al tránsito `R → E`).
- `entregarDelivery`: añadir `f_entrega: new Date().toISOString()` (corresponde a `E → C`).

---

### Grupo D — Inventario

#### D1. `backend/src/repositories/inventario-repository.ts`

- `MovimientoRow` → `{ id_movimientoinv, id_producto, producto, tipo_movimiento, cantidad, stock_anterior, stock_nuevo, costo_unitario, observacion, f_movimiento, id_usuario }`.
- `SELECT` de movimientos (y el `.select(...)` del insert):
  ```
  'id_movimientoinv, id_producto, producto(n_producto), tipo_movimiento, cantidad, stock_anterior, stock_nuevo, costo_unitario, observacion, f_movimiento, id_usuario'
  ```
- `mapMovimiento`: `id` ← `id_movimientoinv`; `costo` ← `Number(costo_unitario ?? 0)`; `motivo` ← `observacion`. **El modelo `MovimientoInventario` no cambia** (`costo`/`motivo` se conservan; el frontend queda intacto).
- `listarMovimientos`: `.order('id_movimientoinv', { ascending: false })`.
- `crearMovimiento(input, usuarioId: number, usucre: string, pc = '')` — insertar:
  ```ts
  {
    id_producto: input.productoId,
    id_usuario: usuarioId,          // NOT NULL
    tipo_movimiento: input.tipo,
    cantidad: input.cantidad,
    stock_anterior: stockActual,    // NOT NULL
    stock_nuevo: nuevoStock,        // NOT NULL
    costo_unitario: input.costo,
    observacion: input.motivo || null,
    ...createAudit(usucre, pc),
  }
  ```
  Se conserva el recálculo previo de `stock_actual` y la actualización posterior de `producto.stock_actual`.
- `RecetaRow`: quitar `unidad_medida` de primer nivel; añadirlo anidado bajo el insumo:
  ```ts
  insumo: { n_producto: string; unidad_medida: { n_unidad: string } | null } | null;
  ```
- `SELECT` de recetas (listar y crear):
  ```
  'id_receta, id_producto, producto!id_producto(n_producto), id_insumo, producto!id_insumo(n_producto, unidad_medida(n_unidad)), cantidad'
  ```
  (la unidad real de un insumo vive en `producto.id_unidad → unidad_medida.n_unidad`; `receta` no tiene FK a `unidad_medida`).
- `mapReceta`: `unidad` ← `row.insumo?.unidad_medida?.n_unidad ?? ''`. **El modelo `Receta` no cambia** (el frontend sigue mostrando la columna "Unidad").

#### D2. `backend/src/services/inventario-service.ts`

`crearMovimientoService(input, usuarioId: number, usucre: string, pc?: string)` y reenvío a `crearMovimiento(input, usuarioId, usucre, pc)`. Se mantiene la traducción `PRODUCTO_INVALIDO` → `InventarioError`.

#### D3. `backend/src/controllers/inventario-controller.ts`

`postMovimiento`: `await crearMovimientoService(parsed.data, s.id, s.logeo, s.pc)` (el `id_usuario` sale de `sesion(req).sub`).

#### D4. `backend/src/schemas/inventario.ts`

`recetaCreateSchema.cantidad`: `z.number().min(0)` → `z.number().positive()` (la BD exige `cantidad > 0`; hoy un `0` produciría un 500 en vez de un 400).

---

### Grupo E — Reservas

#### E1. `backend/src/repositories/reservas-repository.ts`

- `ReservaRow`:
  ```ts
  interface ReservaRow {
    id_reserva: number;
    id_cliente: number;
    cliente: { persona: { nombre: string; ap_paterno: string | null; ap_materno: string | null } } | null;
    id_mesa: number | null;
    mesa: { numero: string } | null;
    f_reserva: string;
    n_personas: number;
    observacion: string | null;
    situacion: string;
    feccre: string;
  }
  ```
- `SELECT`:
  ```
  'id_reserva, id_cliente, cliente:cliente(persona(nombre, ap_paterno, ap_materno)), id_mesa, mesa(numero), f_reserva, n_personas, observacion, situacion, feccre'
  ```
- `mapRow` (deriva `fecha`/`hora` del timestamp real, preservando el contrato `Reserva` y el frontend):
  ```ts
  fecha: row.f_reserva.slice(0, 10),
  hora: row.f_reserva.slice(11, 16),
  comensales: Number(row.n_personas ?? 1),
  cliente: row.cliente?.persona
    ? `${row.cliente.persona.nombre} ${row.cliente.persona.ap_paterno ?? ''}`.trim()
    : '',
  mesa: row.mesa?.numero ?? null,
  ```
- `listarReservas`: filtro `fecha` → rango sobre el timestamp:
  ```ts
  if (q.fecha) query = query.gte('f_reserva', `${q.fecha}T00:00:00`).lte('f_reserva', `${q.fecha}T23:59:59`);
  ```
  (hoy `.eq('f_reserva', q.fecha)` nunca coincide con un valor `timestamp`).
- `crearReserva(input, usuarioId: number, usucre: string, pc = '')` — insertar:
  ```ts
  {
    id_cliente: input.clienteId,
    id_mesa: input.mesaId ?? null,
    id_usuario: usuarioId,                                         // NOT NULL
    f_reserva: `${input.fecha.slice(0, 10)}T${input.hora.slice(0, 5)}:00`,
    n_personas: input.comensales,
    observacion: input.observacion || null,
    situacion: 'P',
    ...createAudit(usucre, pc),
  }
  ```

#### E2. `backend/src/services/reservas-service.ts`

`crearReservaService(input, usuarioId: number, usucre: string, pc?: string)`.

#### E3. `backend/src/controllers/reservas-controller.ts`

`postReserva`: `await crearReservaService(parsed.data, s.id, s.logeo, s.pc)`.

> Los esquemas `reservaQuerySchema`/`reservaCreateSchema` y el frontend (`reservas-admin`, `cliente/reservas`) **no cambian**: siguen enviando/recibiendo `fecha`, `hora`, `comensales`.

---

### Grupo F — Seguridad

#### F1. `backend/src/repositories/seguridad-repository.ts`

- `UsuarioRow`:
  ```ts
  interface UsuarioRow {
    id_usuario: number;
    logeo: string;
    id_tipousuario: number;
    tipo_usuario: { n_tipousuario: string } | null;
    id_empleado: number;
    empleado: { persona: { nombre: string; ap_paterno: string | null; ap_materno: string | null } } | null;
    bloqueado: string;
    intentos: number;
    estado: string;
    feccre: string;
  }
  ```
- `USUARIO_SELECT`:
  ```
  'id_usuario, logeo, id_tipousuario, tipo_usuario(n_tipousuario), id_empleado, empleado(persona(nombre, ap_paterno, ap_materno)), bloqueado, intentos, estado, feccre'
  ```
- `mapUsuario`: `tipo` ← `row.tipo_usuario?.n_tipousuario ?? ''`; `empleadoId` ← `row.id_empleado`; `empleado` ← `${persona.nombre} ${persona.ap_paterno ?? ''}`.trim(). **El modelo `Usuario` no cambia** (el frontend usa `u.tipo`, `u.empleado`).
- `crearUsuario`: resolver `tipo` (nombre) → `id_tipousuario`:
  ```ts
  const { data: tu } = await supabase
    .from('tipo_usuario')
    .select('id_tipousuario')
    .eq('n_tipousuario', input.tipo.toUpperCase())
    .maybeSingle();
  if (!tu) throw new Error('TIPO_INVALIDO');
  ```
  e insertar `id_tipousuario: tu.id_tipousuario`, `id_empleado: input.empleadoId` (ya no `tipo`/`id_personal`).
- `actualizarUsuario`: si `input.tipo !== undefined`, resolver igual que arriba y parchear `id_tipousuario`; si `input.empleadoId` es un entero positivo, parchear `id_empleado` (si viene `null`, no se toca, porque la columna es NOT NULL).

#### F2. `backend/src/schemas/seguridad.ts`

`usuarioCreateSchema.empleadoId`: de `.optional()` a **requerido** (`z.number().int().positive()`), porque `usuario.id_empleado` es NOT NULL.

#### F3. `backend/src/models/seguridad.ts`

Añadir `'TIPO_INVALIDO'` a `SeguridadErrorCode` (junto a `NOT_FOUND | YA_EXISTE | VALIDATION_ERROR`).

#### F4. `backend/src/services/seguridad-service.ts`

En `crearUsuarioService`, traducir `TIPO_INVALIDO` → `SeguridadError('TIPO_INVALIDO')` (mismo patrón que `YA_EXISTE`).

#### F5. `backend/src/controllers/seguridad-controller.ts`

En `postUsuario`, añadir la rama `TIPO_INVALIDO` → `422` antes del `500`.

> `listarRoles`, `crearRol`, `listarPermisos` y `asignarPermisosRol` ya usan `rol`, `permiso`, `modulo` y `rol_permiso` con los nombres correctos: **sin cambios**.

---

## Assumptions & Decisions

1. **El esquema LIVE manda, no el DDL.** `openspec/database/creacion/creacion-bd-yemheng-postgres.sql` usa identificadores en mayúsculas (`ID_MovimientoInv`, `Nombres`), pero la base real usa minúsculas/snake_case. Todas las correcciones se anclan al esquema verificado vía Supabase.
2. **Se preserva el contrato HTTP** en delivery, inventario y reservas: los nombres de campo que consume el frontend (`costo`, `motivo`, `direccion`, `telefono`, `repartidor`, `hora`, `comensales`, `unidad`, `tipo`, `empleado`) se mantienen y sólo cambia su **origen** en la BD. Esto evita tocar 6 archivos de frontend innecesariamente.
3. **Reportes sí cambia de contrato** (decisión del usuario: "Alinear contrato + frontend"), porque las vistas exponen columnas distintas y no es posible mapearlas a los nombres actuales. Se ajustan backend **y** `reportes-page.tsx`.
4. **`vw_arqueo_caja` no expone `id_caja`** → se elimina el filtro `cajaId` (ningún frontend lo usa). No se intenta derivar `total_efectivo`/`total_tarjeta` mediante joins a `movimiento_caja`: la vista no los tiene y saldría del alcance.
5. **`asyncHandler` se aplica en los routers**, no en cada controlador: 1 línea por endpoint, 23 endpoints, cero cambios en lógica de negocio.
6. **No se registra `uncaughtException`**: Express 4 ya captura throws síncronos; silenciar excepciones no capturadas ocultaría bugs. Sólo se añade `unhandledRejection`.
7. **`despacharDelivery`/`entregarDelivery` escriben `f_salida`/`f_entrega`**: son columnas existentes específicas para esas transiciones y hoy están sin usar; es parte de "reparar el módulo completo".
8. **Filtros por fecha** (`reservas.f_reserva`, `vw_arqueo_caja.f_apertura`) se normalizan a rango de día porque comparar un `timestamp` con `YYYY-MM-DD` no coincide nunca / excluye el día completo.
9. **`@vitest/coverage-v8` se alinea a `^4.1.12`** (misma versión mayor que el `vitest` instalado).

---

## Verification

### V1. Estático

```powershell
cd backend
npm install                      # materializa @vitest/coverage-v8
npm run typecheck                # tsc --noEmit: 0 errores
```

### V2. Tests

```powershell
cd backend
npm test                         # suite carga y pasa; coverage se genera sin error
```

### V3. En vivo (dev server en `localhost:3001`)

Levantar `npm run dev` en `backend/` y con un JWT válido (header `Authorization: Bearer <token>`) verificar **200 + payload con datos reales**, no sólo que no falle:

| Endpoint | Resultado esperado |
|---|---|
| `GET /api/v1/delivery/` | 200, `data: []` o filas con `distrito`, `repartidor`, `costo` |
| `GET /api/v1/inventario/movimientos` | 200, filas con `costo` y `motivo` |
| `GET /api/v1/inventario/recetas` | 200, filas con `insumo` y `unidad` |
| `GET /api/v1/reportes/ventas-diarias` | 200, filas con `tipodocumento`, `comprobantes`, `subtotal`, `igv`, `total` |
| `GET /api/v1/reportes/productos-mas-vendidos` | 200, filas con `categoria`, `cantidad`, `total` |
| `GET /api/v1/reportes/arqueo-caja` | 200, filas con `numeroTurno`, `montoSistema`, `montoDeclarado` |
| `GET /api/v1/reservas/` | 200, filas con `hora`, `comensales`, `mesa` |
| `GET /api/v1/seguridad/usuarios` | 200, filas con `tipo` (ADMINISTRADOR/CAJERO/…) y `empleado` |
| `GET /api/v1/seguridad/roles` | 200 (sin regresión) |
| `GET /api/v1/seguridad/permisos` | 200 (sin regresión) |

### V4. Prueba de no-caída del servidor (clave)

Forzar un error de BD deliberado (p. ej. pedir un `productoId` de inventario inexistente, o provocar temporalmente un nombre de columna inválido) y confirmar que:

- el endpoint responde `4xx/5xx` con JSON,
- el proceso **sigue vivo** y los demás endpoints siguen respondiendo `200`.

### V5. Escrituras (con un JWT con permisos de creación)

- `POST /api/v1/inventario/movimientos` con `{ productoId, tipo: "E", cantidad, costo, motivo }` → 201 y el `stock_actual` del producto actualizado.
- `POST /api/v1/inventario/recetas` con `{ productoId, insumoId, cantidad: 1 }` → 201.
- `POST /api/v1/reservas/` con `{ clienteId, fecha: "2026-11-01", hora: "20:30", comensales: 4 }` → 201 y `fecha`/`hora` devueltos coherentes.
- `PATCH /api/v1/delivery/:id/despachar` → `situacion = "E"` y `f_salida` no nulo.
- `POST /api/v1/seguridad/usuarios` con `{ logeo, clave, tipo: "MOZO", empleadoId }` → 201; con `tipo` inexistente → 422 `TIPO_INVALIDO`.

### V6. Frontend

```powershell
cd frontend
npm run build        # (o el script de lint/typecheck del paquete) sin errores
```

Abrir Reportes en `/admin` y comprobar que las 3 pestañas (Ventas Diarias, Productos Top, Arqueo Caja) renderizan con las nuevas columnas y filtran por rango de fechas.

### V7. Regresión

Confirmar que los endpoints que ya funcionaban siguen en 200: `/health`, `/productos/*`, `/categorias/*`, `/clientes/*`, `/mesas/*`, `/pedidos/*`, `/personal/*`, `/personas/*`, `/dashboard/resumen`, `/auditoria/`, `/caja/maestros`.
