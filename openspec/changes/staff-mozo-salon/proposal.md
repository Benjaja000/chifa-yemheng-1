# Propuesta: Mozo Salón (Salón, Comandas y Pedir Cuenta)

## Problema
- La página `/admin/mozo` es maqueta sin lógica ni datos reales.
- El mozo no tiene un botón de "pedir cuenta" personal que respete la mesa activa (solo existe el caso cliente).
- No hay forma de abrir una comanda para una mesa ni agregar ítems desde la interfaz de salón.

## Alcance
- Ver mesas del salón con estado operativo (LIBRE/OCUPADA/POR COBRAR/RESERVADA).
- Abrir comanda (`POST /pedidos`) para una mesa libre.
- Agregar ítems a una comanda activa desde modal de productos (`POST /pedidos/:id/detalles` + `recalcular`).
- Pedir cuenta de una mesa (`PATCH /pedidos/:id/pedir-cuenta` → mesa a POR COBRAR).

## Fuera de alcance
- Cobro de caja, cierre de turno, delivery, reservas.

## Criterios de aceptación
- El mozo ve mesas disponibles/ocupadas y la comanda de cada mesa.
- Puede abrir una comanda para una mesa libre.
- Puede agregar ítems a una comanda activa.
- Puede pedir cuenta de una mesa activa; la mesa pasa a POR COBRAR.
