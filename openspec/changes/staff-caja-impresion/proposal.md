# Propuesta: Caja Impresión Ticket/PDF

## Problema
- Al cobrar, no hay forma de imprimir ticket térmico (80mm) ni generar PDF del comprobante.
- Cajero debe escribir a mano o usar sistema externo.

## Alcance
- Backend: `GET /api/v1/caja/ticket/:ventaId` → genera HTML/PDF del ticket (boleta/factura).
- Frontend: botón "Imprimir" en modal cobro exitoso + botón "Descargar PDF".
- Integración opcional: ESC/POS para impresora térmica USB/Bluetooth (ESC/POS commands).

## Fuera de alcance
- Driver impresora específico (depende de hardware).
- Cola de impresión / spooler.

## Criterios de aceptación
- Botón "Imprimir" abre ventana con ticket formateado (80mm).
- Botón "Descargar PDF" descarga PDF válido.
- Ticket incluye: cabecera (empresa, RUC), detalle items, totales, pie (gracias, QR SUNAT opcional).