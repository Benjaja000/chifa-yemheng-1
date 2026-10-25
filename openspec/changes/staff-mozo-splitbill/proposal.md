# Propuesta: Mozo - Split Bill (Dividir Cuenta)

## Problema
- Una mesa puede tener múltiples comensales que quieren pagar por separado.
- Actual `POST /caja/cobro` cobra toda la comanda de una vez.
- Falta: dividir comanda por comensal → subcuentas → cobro individual.

## Alcance
- Backend: `POST /api/v1/caja/split-bill` recibe `pedidoId`, array de `{ clienteId, items: [{detalleId, cantidad}] }` → crea sub-pedidos hijos → cada uno cobrable por separado.
- Frontend: botón "Dividir cuenta" en `/admin/mozo` y `/admin/caja` → modal asigna ítems a comensales → genera sub-pedidos → cada uno cobrable por separado.

## Fuera de alcance
- Pago parcial de un mismo ítem (dividir cantidad de un mismo plato).
- Propinas automáticas por comensal.

## Criterios de aceptación
- Mozo selecciona "Dividir cuenta" → modal muestra ítems + comensales → asigna ítems → genera sub-pedidos.
- Cada sub-pedido apareice en `/admin/caja` como cobrable independiente.
- Cierre de sub-cuenta libera ítems del pedido original.