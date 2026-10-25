# Propuesta: Flujo cliente (comanda) + permisos por área

## Problema
- El cliente envía la comanda y el backend la graba, pero el frontend solo muestra un mensaje efímero y limpia el carrito. No hay forma de consultar el estado real (P/E/S) de lo enviado.
- No existe la pantalla `/cliente/mi-consumo` especificada en `cliente-comanda.md`.
- El tracking `/cliente/pedido/:id` usa MOCK; no conecta a backend real.
- Falta el endpoint `PATCH /cliente/comanda/cuenta` para pedir la cuenta (mesa → POR COBRAR).
- Los permisos no están vinculados estrictamente a áreas de navegación: cualquier usuario autenticado podría intentar entrar a rutas de cocina, caja, mozo, etc., sin tener el permiso de ese módulo.

## Alcance
- Backend: 3 endpoints nuevos en `cliente-pedidos.ts` (detalle de comanda, comanda activa, pedir cuenta) + auditoría `PEDIR_CUENTA`.
- Frontend (Fase B): conectar tracking real, crear página Mi Consumo, actualizar comanda page post-envío, guard de rutas por área con `AreaGuard`.
- BD: sin cambios de esquema. Seed idempotente si faltan permisos (`CLIENTE_QR`, `CLIENTE_PEDIDOS`, `PED_COCINA`, `VEN_COBRAR`).

## Fuera de alcance
- Caja/facturación, cocina board staff, delivery, reservas.

## Criterios de aceptación
- El cliente puede ver el estado real de su comanda enviada (P/E/S/A por ítem) vía `GET /cliente/pedidos/:id`.
- El cliente puede solicitar la cuenta desde la app vía `PATCH /cliente/comanda/cuenta` (mesa → POR COBRAR, BR-ACC-051).
- `GET /cliente/comanda` devuelve la comanda activa de la mesa (BR-EST-011, BR-ACC-050) o vacío.
- Las rutas de cliente exigen JWT de cliente (`clienteAuthGuard`); el staff ya valida `requirePermisos` por ruta.
