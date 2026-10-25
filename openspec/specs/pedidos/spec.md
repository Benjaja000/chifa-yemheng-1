# Spec: pedidos — comandas y cocina (verdad actual)

Consolidada desde `changes/gestion-pedidos-comandas/specs/pedidos/spec.md` + código.
En caso de conflicto, manda el código.

## Endpoints (`/api/v1/pedidos`, `authGuard`)

### GET / (`PED_VER`)
- Query: `page` def 1, `limit` 1..100 def 20, `estado`, `mesa`, `tipo`.
- 200 `{ data:[{id, numero, mesaId, mesa, tipo, estado, clienteId, cliente, comensales, subtotal, servicio, igv, total, fApertura}], page, limit, total }`.

### GET /:id (`PED_VER`)
- 200 pedido con detalle completo (líneas con producto, cantidad, nota, descuento, estado preparación).
- 404 si no existe.

### GET /cocina (`PED_COCINA` | `PED_VER` | `PED_REGISTRAR`)
- 200 lista de pedidos activos con detalle para KDS (sin paginación).
- Campos: `{id, numero, mesa, tipo, fApertura, detalles:[{id, producto, cantidad, nota, estadoPreparacion, fAtencion}]}`.

### POST / (`PED_REGISTRAR`)
- Body: `{ tipo, mesaId, clienteId?, comensales?, observacion? }`.
- 201 `{ id, numero }` — crea pedido ABIERTO, mesa pasa a OCUPADA.
- 409 `MESA_OCUPADA` si mesa ya tiene comanda abierta.
- 422 `TIPO_INVALIDO` si tipo no válido.

### POST /:id/detalles (`PED_REGISTRAR`)
- Body: `{ productoId, cantidad, nota?, descuento? }`.
- 200 pedido actualizado con líneas y totales recalculados.
- 409 `PEDIDO_FACTURADO` | `PEDIDO_ANULADO` si pedido ya cerrado.
- 422 `PRODUCTO_NO_DISPONIBLE` si producto inactivo.

### PATCH /:id/detalles/:idDetalle/preparacion (`PED_COCINA` | `PED_REGISTRAR`)
- Body: `{ estado: 'P'|'E'|'S' }`.
- 200 `{ ok: true }` — actualiza `estado_preparacion` y `f_atencion`.

### PATCH /:id/pedir-cuenta (`PED_EDITAR` | `PED_REGISTRAR`)
- 200 `{ ok: true }` — cambia estado a `YA_POR_COBRAR`.
- 409 `YA_POR_COBRAR` si ya está por cobrar.

### PATCH /:id/anular (`PED_ANULAR`)
- Body: `{ motivo }`.
- 200 `{ ok: true }` — anula pedido y líneas, libera mesa, audita.

### POST /:id/recalcular (`PED_REGISTRAR`)
- 200 pedido con totales actualizados (subtotal, servicio por tipo mesa, IGV 18%, total).

## Reglas de negocio
- Comanda compartida: si mesa ya tiene comanda abierta, el nuevo cliente se incorpora (no crea otra).
- `id_cliente` en detalle indica quién pidió (nullable, default host).
- Permiso `PED_DESCUENTO` requerido para aplicar descuentos en líneas.
