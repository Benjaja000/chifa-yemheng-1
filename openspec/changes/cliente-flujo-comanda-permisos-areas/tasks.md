# Tareas: Flujo cliente + permisos por área

## Fase A — Backend (este cambio)
1. [x] Verificar/asegurar permisos en BD: `CLIENTE_QR`, `CLIENTE_PEDIDOS`, `PED_COCINA`, `VEN_COBRAR` (seed idempotente).
2. [x] `pedidos-repository.ts`: `clienteParticipa`, `obtenerEstadoMesa`, `idEstadoMesaPorNombre`, `pedirCuentaMesa` (mover MESA a POR COBRAR con `updateAudit`) + auditoría `PEDIR_CUENTA`.
3. [x] `cliente-pedidos-service.ts`: `detalleClienteService(id, clienteId)` con pertenencia (403 si no participante) y `estadoComandaDerivado` (BR-INF-047/048); `comandaActivaClienteService(mesaId)`; `pedirCuentaClienteService(mesaId, clienteId)`; check BR-RES-029 en `agregarDetalleClienteService` (mesa POR COBRAR → 422 `MESA_POR_COBRAR`).
4. [x] `cliente-pedidos-controller.ts` + rutas: GET `/:id`, GET `/comanda`, PATCH `/cuenta` (montadas en `/api/v1/cliente/pedidos`).
5. [x] Typecheck backend OK.
6. [x] E2E verificado contra BD live: abrir tipo 1 (mesa→OCUPADA), agregar detalle, GET detalle con `estadoComandaDerivado`, GET comanda activa, PATCH cuenta (mesa→POR COBRAR), re-agregar→422, cuenta repetida→409, no participante→403; auditoría `PEDIR_CUENTA` insertada; datos de prueba anulados y mesa liberada.

## Fase B — Frontend (cambio posterior `cliente-ver-comanda-ui`)
- [x] `ClientePedidoTrackingPage`: MOCK eliminado → `GET /cliente/pedidos/:id` con polling 10 s, pasos reales por `estadoComandaDerivado`, platos con punto P/E/S, botón "Pedir la cuenta" → `PATCH /cliente/pedidos/cuenta` (maneja `YA_POR_COBRAR`).
- [x] Página `/cliente/mi-consumo` (`mi-consumo-page.tsx`): comanda activa resumida vía `GET /cliente/pedidos/comanda`, scan de mesa, "Ver seguimiento" y "Pedir la cuenta"; tile en el hub.
- [x] `ClienteComandaPage` post-envío → banner con enlace "Ver mi comanda" a `/cliente/pedido/:id`; mensajes por código (`MESA_POR_COBRAR`, `PEDIDO_FACTURADO`, `PEDIDO_ANULADO`, `PRODUCTO_NO_DISPONIBLE`).
- [x] `AreaGuard` en `routes/guards.tsx` (matriz MESAS/MOZO/COCINA/CAJA/SEGURIDAD) aplicado a cocina/mozo/caja; permisos del login persistidos en `chifa.permisos` (`auth-service.ts`).
- [x] Build frontend OK (`tsc && vite build`).

## BD / Seeds
- [x] Sin ALTER de esquema; solo INSERT idempotente de permisos faltantes.
