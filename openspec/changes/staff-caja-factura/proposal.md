# Propuesta: Caja Factura 01 Completa

## Problema
- El endpoint `POST /api/v1/caja/cobro` soporta tipo documento '03' (boleta) completamente, pero para '01' (factura) **falta**:
  1. Validar que el cliente tenga `id_empresa` (empresa asociada con RUC).
  2. Poblar `factura.id_empresa` al insertar.
  3. Selector de cliente empresa en frontend (buscador por RUC/razón social).
  4. Validación de RUC (11 dígitos) y estado ACTIVO/HABIDO (proxy Factiliza opcional).

## Alcance
- Backend: validar `clienteId` + `id_empresa` en `cobrar()` para tipo '01', poblar `factura.id_empresa`.
- Backend: poblar `boleta.cliente_documento` / `cliente_nombre` para tipo '03'.
- Frontend: selector cliente empresa en modal cobro (solo para factura), búsqueda por RUC/razón social.
- Validación RUC (11 dígitos) + estado ACTIVO/HABIDO (proxy Factiliza si configurado).

## Fuera de alcance
- Emisión SUNAT real / envío a OSE / CDR.
- Nota de crédito / anulación.

## Criterios de aceptación
- Cobro tipo '01' sin `clienteId` → 409 `FACTURA_CLIENTE_REQUERIDO`.
- Cobro tipo '01' con cliente sin `id_empresa` → 409 `FACTURA_CLIENTE_REQUERIDO`.
- Factura insertada con `id_empresa` correcto.
- Boleta insertada con `cliente_documento` y `cliente_nombre`.