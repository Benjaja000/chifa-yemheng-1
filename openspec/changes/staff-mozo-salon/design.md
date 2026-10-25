# Diseño: Mozo Salón

## Arquitectura
- Reutiliza endpoints existentes: `GET /mesas`, `GET /pedidos?mesa=`, `POST /pedidos`, `POST /pedidos/:id/detalles`, `POST /pedidos/:id/recalcular`, `PATCH /pedidos/:id/pedir-cuenta`, `GET /productos`.
- No agrega endpoints nuevos sin necesidad.
- Frontend: grid de mesas (`ys-mesa`), panel de comanda lateral, modal de productos, botón "Pedir cuenta".

## Endpoints backend
| Método | Ruta | Guard | Descripción |
|--------|------|-------|-------------|
| GET | `/api/v1/mesas` | `MESA_VER` | Lista mesas con estado operativo |
| GET | `/api/v1/pedidos?mesa=X` | `PED_VER` | Pedidos activos de una mesa |
| POST | `/api/v1/pedidos` | `PED_REGISTRAR` | Abrir comanda (mesa → OCUPADA) |
| POST | `/api/v1/pedidos/:id/detalles` | `PED_REGISTRAR` | Agregar ítem + recalcular |
| POST | `/api/v1/pedidos/:id/recalcular` | `PED_REGISTRAR` | Recalcular totales |
| PATCH | `/api/v1/pedidos/:id/pedir-cuenta` | `PED_EDITAR` o `PED_REGISTRAR` | Mesa → POR COBRAR |
| GET | `/api/v1/productos` | `PROD_VER` | Catálogo de productos para modal |

## Reglas de negocio
- BR-ACC-037/051: la cuenta afecta a toda la mesa y la mesa vuelve a LIBRE al cobrar.
- Una mesa solo puede tener una comanda activa a la vez.
- No se pueden agregar ítems a una mesa en POR COBRAR.
