# Tareas: Caja Factura 01 Completa

## Spec y diseño
- [x] `proposal.md`, `design.md`, `tasks.md`, `specs/caja-factura.md`

## Backend
- [ ] `caja-repository.ts` `cobrar()`:
  - [ ] Validar `clienteId` obligatorio si `tipoDocumento='01'`
  - [ ] Consultar `cliente.id_empresa` → lanzar `FACTURA_CLIENTE_REQUERIDO` si null
  - [ ] Insertar `FACTURA(id_empresa)` para tipo '01'
  - [ ] Poblar `BOLETA.cliente_documento` / `cliente_nombre` para '03'
- [ ] `caja-service.ts` `cobrarService()`:
  - [ ] Validar RUC (11 dígitos) si factura, opcional proxy Factiliza
- [ ] `caja-controller.ts`: mapear errores `FACTURA_CLIENTE_REQUERIDO`, `RUC_INVALIDO`

## Frontend
- [ ] `features/staff/caja/caja-page.tsx`:
  - [ ] Modal cobro: selector tipo documento (03/01)
  - [ ] Si '01': buscador cliente empresa (input RUC/razón social + autocomplete)
  - [ ] Validación RUC 11 dígitos en cliente
  - [ ] Mostrar `razon_social` / `ruc` confirmado antes de emitir
- [ ] `staff-service.ts`: `buscarClientesEmpresa(rucOrRazon)` para autocomplete

## BD
- [ ] Verificar FK `factura.id_empresa` NOT NULL
- [ ] Verificar `boleta.cliente_documento`, `cliente_nombre` nullable

## Verificación
- [ ] `npm run build` backend + frontend OK
- [ ] Test E2E: cobro factura 01 con cliente empresa → venta + factura + pago + movimiento
- [ ] Test E2E: cobro factura 01 sin empresa → 409 FACTURA_CLIENTE_REQUERIDO
- [ ] Test E2E: cobro boleta 03 → boleta con cliente_documento/nombre