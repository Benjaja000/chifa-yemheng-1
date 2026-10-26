# Tasks: add-crud-catalogos-unidades-tipos-mesa

- [x] T1 Backend: `models/unidad.ts` + `models/tipo-mesa.ts` + schemas Zod
- [x] T2 Backend: `repositories/unidades-repository.ts` (CRUD + conteo + filtros + paginación)
- [x] T3 Backend: `repositories/tipos-mesa-repository.ts` (CRUD + conteo `mesasAsociadas`)
- [x] T4 Backend: `services/unidades-service.ts` + `services/tipos-mesa-service.ts` (409 + auditoría)
- [x] T5 Backend: `controllers/` + `routes/unidades.ts` + `routes/tipos-mesa.ts` + montaje en `app.ts`
- [x] T6 Backend: `typecheck` + `build` limpios
- [x] T7 Frontend: `features/admin/unidades/` (types, service, página)
- [x] T8 Frontend: reemplazar `UNIDADES` hardcode por fetch a `/unidades` en productos
- [x] T9 Frontend: ruta `/admin/unidades` + item sidebar
- [x] T10 Frontend: `tsc` + `vite build` limpios
- [x] T11 BD: patch `permiso-crud-unidades-tipos-mesa.sql` (`UNIDAD_*`, `TMESA_*`)
- [ ] T12 Verificación: 401 sin token, 200 con permiso, 409 duplicado/dependencia, 403 sin permiso
