# Gestión de Pedidos y Comandas

## Objetivo
Implementar el flujo completo de Pedidos/Comandas (mesa → comanda → cocina) adaptando el proyecto origen (`chifa-prueba`) al stack actual (React 19, react-router v7, Tailwind v4, backend Express + Supabase, JWT). Es el núcleo operativo del sistema; cocina, pagos y facturación dependen de él.

## Motivación
Solo "Mesas" está implementado end-to-end. Los pedidos tienen esquema y SP en BD pero sin capa API ni UI. Los SP (`usp_abrir_pedido`, `usp_agregar_detalle_pedido`, `usp_recalcular_pedido`, `usp_anular_pedido`, `fn_total_pedido`) ya existen, así que el trabajo es capa API + UI.

## Alcance
- Backend: schemas, models, repository (wrappers de SP), service, controller, route, registro en app.ts.
- Frontend: CartContext, ClienteAuthContext, MesaQR, Menu, Comanda, Pedidos, Cocina, rutas/guards.
- Sin cambios de esquema (SPs y permisos PED_* ya existen), salvo migración opcional `detalle_pedido.id_cliente` (trazabilidad por cliente).

## Fuera de alcance (otras fases)
- Pagos, Facturación, Split bill, Reservas, Reportes.

## Dependencias
- Mesas ✅, Productos ✅, Clientes ✅, tipoidentidad ✅, permisos PED_* ✅, migración `detalle_pedido_id_cliente` ✅.