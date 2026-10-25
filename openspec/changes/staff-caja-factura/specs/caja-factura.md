# Spec: Caja Factura 01 Completa (`/api/v1/caja/cobro` tipo '01')

## Objetivo
Completar el cobro con tipo documento '01' (Factura) validando cliente empresa, poblando `factura.id_empresa` y `boleta` con datos de cliente.

## Requisitos

### REQ-1: Validar cliente empresa para factura
- **Given** `tipoDocumento='01'` y `clienteId`
- **When** `POST /api/v1/caja/cobro`
- **Then** validar que `cliente.id_empresa` existe → si null → 409 `FACTURA_CLIENTE_REQUERIDO`.

### REQ-2: Poblar factura con id_empresa
- **Given** cobro tipo '01' válido
- **When** se inserta en `FACTURA`
- **Then** `id_empresa` = `cliente.id_empresa` (FK a `EMPRESA`).

### REQ-3: Poblar boleta con datos cliente
- **Given** cobro tipo '03' con `clienteId`
- **When** se inserta en `BOLETA`
- **Then** `cliente_documento` = `cliente.n_documento`, `cliente_nombre` = concat(`persona.nombre`, `ap_paterno`, `ap_materno`).

### REQ-4: Validación RUC
- **Given** tipo '01' y `clienteId` con RUC
- **When** se valida
- **Then** RUC = 11 dígitos, opcional verificar estado ACTIVO/HABIDO (proxy Factiliza si token configurado).

## Errores
- 409 `FACTURA_CLIENTE_REQUERIDO` (cliente sin empresa)
- 409 `RUC_INVALIDO` (RUC no 11 dígitos o estado no ACTIVO/HABIDO)
- 400 `VALIDATION_ERROR` · 404 `NOT_FOUND` · 500 `DB_*`.

## Payload ejemplo (Factura 01)
```json
{
  "pedidoId": 213,
  "cajaId": 1,
  "metodoPagoId": 2,
  "tipoDocumento": "01",
  "clienteId": 45,
  "montoRecibido": 100,
  "referencia": "Transferencia BCP"
}
```