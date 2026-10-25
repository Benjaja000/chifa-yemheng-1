# Tasks — Gestión QR Mesas

## Bloque 0 — Backend (prerequisito: Spec 1 Bloque 0)
- [ ] Endpoint `GET /pedidos/activos?mesaId=` para saber si hay comanda activa (incorporar vs crear)
- [ ] Verificar `GET /mesas/by-qr` público funciona con formatos corto/completo/URL

## Bloque 1 — Infraestructura cliente
- [x] Portar `CartContext` → `frontend/src/contexts/CartContext.tsx` (ya creado)
- [ ] Crear `ClienteAuthContext` sobre `cliente-auth-service`
- [ ] Conectar providers en `main.tsx`

## Bloque 2 — MesaQR
- [x] `features/cliente/mesa/mesa-qr-page.tsx` (ya creado) — ajustar a by-qr
- [ ] Registrar ruta `/cliente/mesa/:id` en `routes/index.tsx` (ya creado)

## Bloque 3 — Auto-decodificación de cámara
- [x] Agregar jsqr y auto-decode en `cliente-login-page.tsx` (ya creado)
- [x] Canvas oculto para captura de frames (ya creado)

## Bloque 4 — Admin QR
- [x] Botón "QR" + modal en `mesas-page.tsx` (ya creado)
- [ ] Descarga de QR (canvas → PNG)
- [ ] Regenerar QR en edición (ya existe, verificar UI)

## Bloque 5 — Comanda con guard
- [ ] `features/cliente/comanda/comanda-page.tsx` (guard por mesaId, estado "Escanea QR")
- [ ] `features/cliente/menu/menu-page.tsx` (reutilizable, sin mesa → delivery; con mesa → "Enviar a cocina")
- [ ] `features/cliente/inicio/cliente-hub-page.tsx` (botón "Escanear mesa", acceso a carta/reservas/perfil)

## Bloque 6 — Rutas y guards
- [ ] Registrar rutas: `/cliente/mesa/:id`, `/cliente/menu`, `/cliente/comanda`, `/cliente/inicio`
- [ ] Adaptar guards (RequireClient usando ClienteAuthContext)

## Bloque 7 — Verificación
- [ ] Typecheck + build frontend
- [ ] Prueba: escanear QR → login → MesaQR → menú → comanda → enviar tanda