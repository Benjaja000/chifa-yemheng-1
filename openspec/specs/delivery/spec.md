# Spec: delivery — (pendiente de implementación)

## Estado actual
- Frontend: placeholders (`/admin/delivery` "Maqueta", `/cliente/delivery` mock sin API).
- Backend: sin route dedicado. `TIPO_PEDIDO` incluye DELIVERY. Tabla `PEDIDO_DELIVERY` sin uso.
- Permiso `PED_DELIVERY` existe en seeds.

## Pendiente
- Backend: CRUD de pedidos delivery, tracking, asignación de repartidor.
- Frontend: implementar UI real con API.
- DB: activar uso de `PEDIDO_DELIVERY`.
