# Tasks — Gestión de Pedidos y Comandas

## Bloque 0 — Backend
- [ ] Crear `backend/src/schemas/pedido.ts` (Zod: PedidoQuery, PedidoAbrir, DetalleAdd, PedidoAnular, PreparacionUpdate)
- [ ] Crear `backend/src/models/pedido.ts` (tipos)
- [ ] Crear `backend/src/repositories/pedidos-repository.ts` (wrappers de SP + listar/obtener/cambiar preparación + audit)
- [ ] Crear `backend/src/services/pedidos-service.ts` (validaciones + audit + permisos)
- [ ] Crear `backend/src/controllers/pedidos-controller.ts` (parse + mapeo de errores)
- [ ] Crear `backend/src/routes/pedidos.ts` (authGuard + requirePermisos)
- [ ] Registrar `app.use('/api/v1/pedidos', pedidosRouter)` en `app.ts`
- [ ] Typecheck + build backend

## Bloque 1 — Infraestructura cliente
- [ ] Portar `CartContext` → `frontend/src/contexts/CartContext.tsx`
- [ ] Crear `ClienteAuthContext` sobre `cliente-auth-service`
- [ ] Conectar `CartProvider` y `ClienteAuthProvider` en `main.tsx`

## Bloque 2 — Páginas cliente
- [ ] `features/cliente/mesa/mesa-qr-page.tsx` (ya creado) — ajustar a by-qr
- [ ] `features/cliente/menu/menu-page.tsx` (adaptar de origen)
- [ ] `features/cliente/comanda/comanda-page.tsx` (adaptar de origen, guard por mesaId)

## Bloque 3 — Páginas staff
- [ ] `features/admin/pedidos/pedidos-page.tsx` (adaptar de origen)
- [ ] `features/admin/pedidos/pedidos-service.ts`
- [ ] `features/admin/pedidos/pedidos-types.ts`
- [ ] `features/admin/cocina/cocina-page.tsx` (adaptar de origen)

## Bloque 4 — Rutas y guards
- [ ] Registrar rutas en `routes/index.tsx` (RequireClient/RequireStaff adaptados)
- [ ] Adaptar imports rr v6 → v7

## Bloque 5 — Verificación
- [ ] Typecheck + build frontend
- [ ] Prueba manual: abrir comanda, agregar plato, ver totales, anular, cocina