# Diseño: Flujo cliente + permisos por área

## Arquitectura
- Backend: capa delgada. Los nuevos endpoints leen `PEDIDO` + `DETALLE_PEDIDO` + `ESTADO_PEDIDO`; el pedir-cuenta actualiza `PEDIDO.ID_EstadoPedido` (y `MESA.ID_EstadoMesa` si existe estado POR COBRAR) y audita con `auditar()`/`updateAudit`.
- El JWT de cliente NO lleva permisos de staff: la autorización del área `/cliente/*` es el propio `clienteAuthGuard` (BR-ACC-044: login Gmail → CLIENTE). La seguridad fina va por pertenencia/participación:
  - `GET /cliente/pedidos/:id`: el pedido debe tener `id_cliente = cliente.sub` o algún detalle con `id_cliente = cliente.sub` (participante QR, BR-EST-013); si no → 403.
  - `GET /cliente/comanda?mesaId=X`: devuelve la comanda activa de la mesa escaneada (BR-ACC-049/050: quien escanea el QR se incorpora y ve el acumulado).
  - `PATCH /cliente/comanda/cuenta`: bajo la misma regla de mesa (BR-ACC-051).
- El staff valida permisos por ruta con `requirePermisos` ( áreas: `/cocina` → PED_COCINA; `/mozo|pedidos` → PED_VER/PED_REGISTRAR; `/caja|ventas` → CAJA_*/VEN_*).

## Endpoints backend (`/api/v1/cliente`)
| Método | Ruta | Guard | Descripción |
|--------|------|-------|-------------|
| GET | `/pedidos/:id` | `clienteAuthGuard` + pertenencia | Detalle de comanda + ítems con estados P/E/S + totales |
| GET | `/comanda?mesaId=X` | `clienteAuthGuard` | Comanda activa de la mesa; vacío `{}` si no hay |
| PATCH | `/cuenta` | `clienteAuthGuard` | Pasa comanda activa de la mesa a POR COBRAR; afecta a toda la mesa (BR-ACC-051) |

> Nota sobre rutas: `GET /pedidos/activos` ya existe; el nuevo `/:id` se registra después para no colisionar. `POST /`, `POST /:id/detalles`, `POST /:id/recalcular` ya existen.

## Reglas de negocio aplicadas
- **BR-INF-047/048:** estado de comanda derivado de ítems (algún E → EN PREPARACION; todos S → SERVIDO). Se expone en la respuesta como `estadoComandaDerivado`.
- **BR-ACC-038:** ítem P→E→S/P→A; el cliente solo ve, cocina cambia.
- **ACC-050/051:** todos los participantes ven mismo consumo; pedir cuenta afecta a toda la mesa.
- **BR-RES-026/029:** cuenta a toda la mesa; POR COBRAR bloquea nuevos ítems.
- **BR-EST-011/012/013/014:** 1 mesa = 1 comanda activa = N participantes.

## Auditoría
- `PEDIR_CUENTA` (11 chars, cabe en `Accion varchar(50)`), `n_tabla='PEDIDO'`, `id_registro=pedidoId`, `id_usuario=1 (AUTOSERVICIO)`.
- El agregado de detalle ya audita `AGREGAR_DETALLE_CLIENTE`.
