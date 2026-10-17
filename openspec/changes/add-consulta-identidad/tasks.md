# Tasks: add-consulta-identidad (fase 1: Clientes + ubigeo)

- [x] T0 Change: `proposal.md` + `design.md` + `tasks.md` + `specs/` + migración `01_add_ubigeo_distrito.sql` + `README.md`
- [x] T1 Backfill: INEI 2025 x CONCYTEC-SUNAT conciliados → `02_backfill_ubigeo.sql` (1734 UPDATEs exactos) + `pendientes-conciliacion.md` (157 solo-INEI, 0 difieren, 0 sin match). Spot-check TACABAMBA→060417 = ubigeo_sunat de Factiliza
- [x] T2 Backend: `FACTILIZA_TOKEN/BASE_URL` opcionales en `env.ts` + `models/schemas/identidad` + `identidad-service` (proxy dni/ruc, caché 24h) + `distritoPorUbigeo` + rutas `dni|ruc|distritos/por-ubigeo` + `typecheck` verde
- [x] T3 Frontend: `consultarDni/Ruc/distritoPorUbigeo` en `clientes-service.ts` + botones con spinner (solo al crear, DNI solo si `tipoDoc==='DNI'`) + llenado de identidad + preselección de distrito por ubigeo + banner RUC no habido + avisos + `tsc` + `vite build` verdes
- [x] T3 Frontend: `consultarDni/Ruc/distritoPorUbigeo` en `clientes-service.ts` + botones con spinner (solo al crear, DNI solo si `tipoDoc==='DNI'`) + llenado de identidad + preselección de distrito por ubigeo + banner RUC no habido + avisos + `tsc` + `vite build` verdes
- [x] T3b Ampliación "todos los que trae la API": `direccion` en ficha N; `tipo_contribuyente` (caption bajo Razón Social) y `distrito/provincia/departamento` (referencia bajo el picker) en ambas fichas; solo referencia, no se guardan. Backend `models/schemas` + `identidad-service` + frontend `clientes-service/page`; `typecheck` + `tsc` + `vite build` verdes
- [x] T3c Ubicación en cadena: endpoints `GET /maestros/departamentos` y `GET /maestros/provincias`; `UbicacionPicker` con `Departamento → Provincia → Distrito`; autoselección triple por `ubigeo_sunat`; reseteo en cascada en manual; `typecheck` + `tsc` + `vite build` verdes
- [x] T3d Reorden visual del modal de Cliente según secuencia solicitada (`Tipo Doc / N Doc, Nombres, Género, Ap. Paterno, Ap. Materno, F. Nacimiento, Celular, Correo, Dirección, Ubicación, Código`); labels `Nombres` y `Celular` (campo interno `telefono` se mantiene)
- [ ] T4 Manuales usuario: token en `backend/.env` + Render; correr 01→02 en Supabase; resolver no-conciliados si los hay
- [ ] T5 Verificación: columna+UNIQUE+CHECK; cobertura backfill; e2e DNI/RUC conocidos (picker correcto); ubigeo inexistente → manual; doc inexistente → 404; sin token → 503; caché no gasta cuota
- [ ] T6 Fases 2-3 pendientes: Personal (DNI), Personas (DNI)

## Nota de alcance (2026-10-16)
`nombre_completo`, `direccion_completa` y `ubigeo[]` se siguen ignorando por ser
composiciones redundantes de campos ya usados. `ubigeo_reniec` se ignora: el
código SUNAT es el que resuelve el distrito. `telefono`, `correo`,
`codigoCliente` y `nombreComercial` no existen en la API: siguen manuales.
