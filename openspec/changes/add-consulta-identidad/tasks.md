# Tasks: add-consulta-identidad (fase 1: Clientes + ubigeo)

- [x] T0 Change: `proposal.md` + `design.md` + `tasks.md` + `specs/` + migración `01_add_ubigeo_distrito.sql` + `README.md`
- [x] T1 Backfill: INEI 2025 x CONCYTEC-SUNAT conciliados → `02_backfill_ubigeo.sql` (1734 UPDATEs exactos) + `pendientes-conciliacion.md` (157 solo-INEI, 0 difieren, 0 sin match). Spot-check TACABAMBA→060417 = ubigeo_sunat de Factiliza
- [x] T2 Backend: `FACTILIZA_TOKEN/BASE_URL` opcionales en `env.ts` + `models/schemas/identidad` + `identidad-service` (proxy dni/ruc, caché 24h) + `distritoPorUbigeo` + rutas `dni|ruc|distritos/por-ubigeo` + `typecheck` verde
- [x] T3 Frontend: `consultarDni/Ruc/distritoPorUbigeo` en `clientes-service.ts` + botones con spinner (solo al crear, DNI solo si `tipoDoc==='DNI'`) + llenado de identidad + preselección de distrito por ubigeo + banner RUC no habido + avisos + `tsc` + `vite build` verdes
- [ ] T4 Manuales usuario: token en `backend/.env` + Render; correr 01→02 en Supabase; resolver no-conciliados si los hay
- [ ] T5 Verificación: columna+UNIQUE+CHECK; cobertura backfill; e2e DNI/RUC conocidos (picker correcto); ubigeo inexistente → manual; doc inexistente → 404; sin token → 503; caché no gasta cuota
- [ ] T6 Fases 2-3 pendientes: Personal (DNI), Personas (DNI)
