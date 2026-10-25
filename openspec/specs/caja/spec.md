# Spec: caja — turnos y cobro (verdad actual)

Consolidada desde `changes/staff-caja-cobro/specs/caja-cobro.md` + código actual.
En caso de conflicto, manda el código.

## Endpoints (`/api/v1/caja`, `authGuard`)

### GET /maestros (`CAJ_APERTURAR` | `CAJA_APERTURA` | `VEN_COBRAR` | `PED_VER` | `PED_REGISTRAR`)
- 200 `{ cajas:[{id, nombre, aperturada}], metodosPago:[{id, nombre, afectaEfectivo}] }`.

### GET /pendientes (mismos guards que /maestros)
- 200 lista de pedidos con `Facturado='N'` y `Anulado='N'`, con mesa y detalle de ítems.

### POST /turno (`CAJ_APERTURAR` | `CAJA_APERTURA`)
- Body Zod: `{ cajaId: int, montoInicial: number >= 0 }`.
- 201 `{ id, mensaje }` — abre turno con `situacion='A'`, marca `CAJA.Aperturada='S'`.
- 409 `NO_CAJA_ABIERTA` si ya hay turno abierto.

### POST /cobro (`VEN_COBRAR` | `VEN_EMITIR`)
- Body Zod: `{ pedidoId, cajaId, tipoDocumento, clienteId?, metodoPagoId, montoRecibido, referencia? }`.
- 200 `{ idVenta, serie, numero, total, vuelto }`.
- Recalcula totales (subtotal, servicio, IGV 18%, total) antes de insertar.
- Boleta ('03'): rellena `cliente_documento` y `cliente_nombre` desde CLIENTE + PERSONA.
- Factura ('01'): requiere empresa asociada → 409 `FACTURA_REQUIERE_EMPRESA`.
- Correlativo atómico via `fn_incrementar_correlativo_serie` (`SELECT ... FOR UPDATE`).
- Vuelto = `max(0, recibido - total)` solo si método afecta efectivo.

### Errores
- 400 `VALIDATION_ERROR` | 404 `NOT_FOUND` | 409 `FACTURA_REQUIERE_EMPRESA`, `NO_CAJA_ABIERTA`, `PEDIDO_FACTURADO`, `ID_CLIENTE_INVALIDO`, `MONTO_RECIBIDO_INVALIDO` | 500 `DB_*`.
