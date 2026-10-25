# Gestión de Pedidos y Comandas — Diseño

## Arquitectura
- **Backend**: capa delgada sobre SP existentes. Repository llama `supabase.rpc(...)`; service valida negocio y audita; controller parsea Zod y mapea errores; route aplica `authGuard` + `requirePermisos(...)`.
- **Frontend**: feature folder `features/admin/pedidos/` siguiendo patrón mesas. Cliente usa `CartContext` (estado puro) + `ClienteAuthContext` (JWT cliente). Componentes reutilizables con guard por `mesaId`.
- **Auth**: staff JWT (`chifa.token`) + client JWT (`chifa.cliente.token`), secretos separados por claims (`rol`).

## Endpoints (`/api/v1/pedidos`)
| Método | Ruta | Permiso | Descripción |
|---|---|---|---|
| GET | `/` | PED_VER | Listar comandas (filtros: estado, mesa, fecha, paginación) |
| GET | `/:id` | PED_VER | Detalle de comanda + líneas |
| POST | `/` | PED_REGISTRAR | Abrir comanda (tipo, mesa, cliente, comensales, obs) |
| POST | `/:id/detalles` | PED_REGISTRAR | Agregar plato |
| PATCH | `/:id/detalles/:idDetalle/preparacion` | PED_COCINA/PED_REGISTRAR | Cambiar estado preparación (P→E→S) |
| PATCH | `/:id/anular` | PED_ANULAR | Anular comanda |
| POST | `/:id/recalcular` | PED_REGISTRAR | Recalcular totales |

## SP usados
- `usp_abrir_pedido`, `usp_agregar_detalle_pedido`, `usp_recalcular_pedido`, `usp_anular_pedido`, `fn_total_pedido`.

## Reglas de negocio
- Mesa debe estar libre para abrir comanda.
- Producto debe estar activo/disponible al agregar.
- Recálculo automático tras cada adición/modificación.
- Anulación bloqueada si ya facturado (usar nota de crédito).
- IGV 18% y cargo de servicio por tipo de mesa (calculado en SP).
- Trazabilidad: `detalle_pedido.id_cliente` = quién pidió cada plato.

## Frontend
- `CartContext`: items, mesaId, add/remove/setQty/setNota/clear, total/count.
- `MesaQR`: busca mesa por id/numero, setea `cart.mesaId`, links.
- `Menu`: categorías/productos vía API; sin mesa → delivery; con mesa → además "Enviar a cocina".
- `Comanda`: cantidades, notas, totales; guard por `mesaId` (sin mesa → "Escanea QR").
- `Pedidos` (staff): tabla de comandas recientes.
- `Cocina`: tablero 3 columnas (P/E/S) con polling, cambio de estado.
- Rutas: `/cliente/mesa/:id`, `/cliente/menu`, `/cliente/comanda`, `/app/pedidos`, `/app/cocina`.

## Reglas de comanda compartida
- Si la mesa ya tiene comanda abierta, se incorpora (no crea otra).
- Host = primer cliente que escanea; puede agregar/quitar todos, dividir cuenta, cerrar comanda.
- Non-host: agrega propio, ve totales, sin quitar otros ni dividir/cerrar.