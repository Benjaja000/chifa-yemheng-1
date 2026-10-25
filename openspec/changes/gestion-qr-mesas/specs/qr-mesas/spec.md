# Especificación: QR Mesas

## Requisitos

### REQ-1: Validación de QR escaneado
- **Given** un código QR escaneado (`?mesa=<código>`)
- **When** se envía GET /mesas/by-qr?codigo=<código>
- **Then** retorna la mesa (id, numero, ambiente, capacidad, estado) o 404 (QR_INVALIDO) si no existe/inactiva

### REQ-2: Estados de validación
- **Given** la página de login cliente
- **When** hay `?mesa=` en la URL
- **Then** muestra estados: validando → valida (mesa/ambiente) / invalida (QR no reconocido) / sin-conexion (fallback)

### REQ-3: Sin QR (entrada web)
- **Given** `/cliente/login` sin `?mesa=`
- **When** la página carga
- **Then** muestra aviso "Abre esta página desde el QR" + botón cámara + entrada web (delivery/reservas)

### REQ-4: Auto-decodificación de cámara
- **Given** la cámara abierta en el modal
- **When** jsqr detecta un código QR en los frames
- **Then** valida vía by-qr, actualiza estado/URL, y cierra el modal de cámara

### REQ-5: MesaQR
- **Given** `/cliente/mesa/:id` con un código QR válido
- **When** la página carga
- **Then** muestra mesa/ambiente/QR, setea `cart.mesaId`, links a menú/comanda

### REQ-6: Admin QR
- **Given** el admin de mesas
- **When** se presiona "QR" en una mesa
- **Then** se abre modal con QRCodeSVG (valor = URL de login con mesa param) + código imprimible

### REQ-7: Regenerar QR (candado anti-desync)
- **Given** una mesa con cambio de número
- **When** se guarda sin "Regenerar por seguridad"
- **Then** se bloquea con error QR_DESINCRONIZADO

### REQ-8: Incorporación a comanda activa
- **Given** una mesa con comanda abierta
- **When** un cliente escanea el QR de esa mesa
- **Then** se incorpora a la comanda existente (no crea otra)

### REQ-9: Creación de comanda nueva
- **Given** una mesa sin comanda activa
- **When** un cliente escanea el QR y se loguea
- **Then** se crea nueva comanda y la mesa pasa a OCUPADA

### REQ-10: Guard por mesa (frontend)
- **Given** un cliente sin mesa asignada
- **When** intenta acceder a Comanda
- **Then** se muestra "Escanea el QR de tu mesa" y "Enviar a cocina" está deshabilitado

### REQ-11: Trazabilidad por cliente
- **Given** un detalle de pedido
- **Then** `id_cliente` indica quién lo pidió (nullable, default host)

### REQ-12: Host y non-host
- **Given** un cliente que escanea primero (host)
- **Then** puede agregar/quitar todos, dividir cuenta, cerrar comanda, compartir QR
- **Given** un cliente que se unió después (non-host)
- **Then** puede agregar propio, ver totales, sin quitar otros ni dividir/cerrar

### REQ-13: Split bill
- **Given** una comanda con líneas de múltiples clientes
- **When** se cobra
- **Then** se agrupan líneas por `id_cliente` → subcuentas, cobro por separado

### REQ-14: Comanda aparte
- **Given** un cliente que quiere su propio ticket
- **When** solicita "comanda aparte"
- **Then** se crea un segundo pedido en la misma mesa con su propio host y total