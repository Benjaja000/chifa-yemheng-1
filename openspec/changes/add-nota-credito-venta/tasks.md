# Tasks: add-nota-credito-venta

- [x] T1 BD: `fn_anular_venta_con_nc` (wrapper de `usp_anular_venta_con_nc`)
- [x] T2 Backend: `models/nota-credito.ts` + schema Zod `{ motivo: max(200) }`
- [x] T3 Backend: `repositories/ventas-repository.ts` (RPC + mapeo de errores DB→API)
- [x] T4 Backend: `services/ventas-service.ts` + `controllers/ventas-controller.ts`
- [x] T5 Backend: `routes/ventas.ts` (`VEN_NOTACREDITO`) + montaje en `app.ts`
- [x] T6 Backend: `typecheck` + `build` limpios
- [ ] T7 Frontend: acción "Anular con NC" en caja/historial + modal con motivo
- [ ] T8 Verificación: E2E venta→NC, 403 sin permiso, 400 sin motivo, 409 venta anulada,
      movimiento de caja + auditoría visibles
