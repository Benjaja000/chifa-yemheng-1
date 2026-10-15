# Tasks: add-modulo-personas

- [x] T1 Change: `proposal.md` + `design.md` + `tasks.md` + `specs/personas/spec.md`
- [x] T2 Backend: `schemas/persona.ts` + `repositories/personas-repository.ts` (buscar/listar DESC/crear/convertir)
- [x] T3 Backend: `services/personas-service.ts` (409 cruzados) + `controllers/personas-controller.ts` + `routes/personas.ts` + mount en `app.ts`
- [x] T4 Backend: reutilización en `personal-repository.ts` / `clientes-repository.ts` (quitar delete compensatorio, YA_EXISTE por rol, 23505→reutilizar)
- [x] T5 Backend: seed `PER_VER/CREAR/ASIGNAR` en `permiso_modulo.sql` + `typecheck` limpio
- [x] T6 Frontend: `features/admin/personas/` (service, types, page) + ruta `/admin/personas` + menú shell
- [x] T7 Frontend: avisos cruzados en PersonalPage/ClientesPage + `tsc` + `vite build`
- [ ] T8 Verificación manual pendiente (con API corriendo): alta→asignar→409 cruzado→convertir→sin duplicados; ejecutar `permiso_modulo.sql` en BD para activar PER_*
