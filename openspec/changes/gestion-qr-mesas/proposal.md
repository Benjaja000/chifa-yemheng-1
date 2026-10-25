# Gestión QR Mesas

## Objetivo
Implementar el flujo completo de identificación de mesa por QR + entrada web, adaptando el proyecto origen (`chifa-prueba`) al stack actual. Permite escanear QR, validar mesa, asignar comanda, y manejar escenarios de múltiples clientes en la misma mesa.

## Motivación
El flujo de cliente (QR → login → comanda) está parcialmente implementado (login con Gmail, validación by-qr). Falta la página MesaQR, la auto-decodificación de cámara, la generación de QR en admin, y los escenarios de comanda compartida/split bill/comanda aparte.

## Alcance
- Frontend: MesaQR, auto-decode cámara (jsqr), admin QR (generar/descargar/regenerar), comanda con guard por mesaId, menu reutilizable.
- Backend: endpoint para comanda activa por mesa (para incorporar vs crear).
- Sin cambios de esquema (mesa.codigo_qr ya existe; migración de detalle_pedido.id_cliente compartida con spec 1).

## Fuera de alcance (otras fases)
- Pagos, Facturación, Split bill (UI), Reservas, Reportes.

## Dependencias
- Mesas ✅, Pedidos (Spec 1) en progreso, Clientes/Gmail ✅, migración `detalle_pedido_id_cliente` ✅.