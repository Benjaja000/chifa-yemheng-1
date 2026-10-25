# Spec: Caja Impresión Ticket/PDF

## Objetivo
Generar ticket térmico (80mm) y PDF del comprobante de venta.

## Requisitos

### REQ-1: Generar ticket HTML 80mm
- **Given** `ventaId`
- **When** `GET /api/v1/caja/ticket/:ventaId`
- **Then** retorna HTML formateado 80mm con:
  - Cabecera: empresa, RUC, dirección, "BOLETA DE VENTA" / "FACTURA"
  - Detalle: ítems (cantidad, producto, precio, subtotal)
  - Totales: subtotal, descuento, servicio, IGV, total
  - Pie: "Gracias por su preferencia", QR código SUNAT (opcional)

### REQ-2: Descargar PDF
- **Given** `ventaId`
- **When** `GET /api/v1/caja/ticket/:ventaId?format=pdf`
- **Then** retorna `application/pdf` descargable (puppeteer o html2pdf).

### REQ-3: Impresión directa (opcional)
- **Given** impresora térmica USB/Bluetooth conectada
- **When** botón "Imprimir" clickeado
- **Then** envía comandos ESC/POS directos a impresora (raw USB o Bluetooth).

## Errores
- 404 `NOT_FOUND` (venta no existe) · 500 `PRINT_ERROR` (impresora no disponible).