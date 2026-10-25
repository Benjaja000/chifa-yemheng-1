# Tareas: Caja Impresión Ticket/PDF

## Spec y diseño
- [ ] `proposal.md`, `design.md`, `tasks.md`, `specs/caja-impresion.md`

## Backend
- [ ] `GET /api/v1/caja/ticket/:ventaId` (controller + service) → genera HTML ticket
- [ ] Servicio `ticket-service.ts`: genera HTML 80mm (ESC/POS compatible) + opción PDF (puppeteer o html2pdf)

## Frontend
- [ ] `caja-page.tsx`: botón "Imprimir" en modal cobro exitoso → `window.open('/api/v1/caja/ticket/' + ventaId)`
- [ ] Botón "Descargar PDF" → `fetch('/api/v1/caja/ticket/' + ventaId + '?format=pdf')` → blob → download
- [ ] Opcional: `EscPosPrinter` class para comandos ESC/POS directos a impresora USB/Bluetooth

## Verificación
- [ ] `npm run build` frontend OK
- [ ] Test: cobro → modal éxito → "Imprimir" abre ticket 80mm correcto
- [ ] "Descargar PDF" genera PDF válido