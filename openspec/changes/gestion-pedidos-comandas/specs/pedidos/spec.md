# Especificación: Pedidos y Comandas

## Requisitos

### REQ-1: Abrir comanda por mesa
- **Given** un usuario con permiso PED_REGISTRAR y una mesa libre
- **When** envía POST /api/v1/pedidos con tipo, mesa, cliente, comensales, observación
- **Then** se crea el pedido (estado ABIERTO), la mesa pasa a OCUPADA, y se retorna id + número generado

### REQ-2: Agregar plato a comanda
- **Given** un pedido no facturado ni anulado y un producto activo/disponible
- **When** envía POST /api/v1/pedidos/:id/detalles con producto, cantidad, nota, descuento
- **Then** se inserta la línea y se recalculan los totales automáticamente

### REQ-3: Recalcular totales
- **Given** un pedido con líneas
- **When** se invoca POST /api/v1/pedidos/:id/recalcular
- **Then** se actualizan subtotal, servicio (por tipo mesa), IGV (18%) y total

### REQ-4: Anular comanda
- **Given** un pedido no facturado
- **When** envía PATCH /api/v1/pedidos/:id/anular con motivo
- **Then** se anula el pedido y sus líneas, se libera la mesa, se audita

### REQ-5: Cambiar estado de preparación (cocina)
- **Given** una línea de detalle
- **When** envía PATCH .../preparacion con estado P/E/S
- **Then** se actualiza estado_preparacion y f_atencion

### REQ-6: Comanda compartida por mesa
- **Given** una mesa con comanda abierta
- **When** otro cliente escanea el QR de esa mesa
- **Then** se incorpora a la comanda existente (no crea otra)

### REQ-7: Trazabilidad por cliente
- **Given** un detalle de pedido
- **Then** `id_cliente` indica quién lo pidió (nullable, default host)

### REQ-8: Permisos
- PED_VER: listar/ver comandas
- PED_REGISTRAR: abrir, agregar detalle, recalcular
- PED_ANULAR: anular comanda
- PED_COCINA: cambiar estado de preparación
- PED_DESCUENTO: aplicar descuentos

### REQ-9: Guard por mesa (frontend)
- **Given** un cliente sin mesa asignada
- **When** intenta acceder a Comanda
- **Then** se muestra "Escanea el QR de tu mesa" y el botón "Enviar a cocina" está deshabilitado