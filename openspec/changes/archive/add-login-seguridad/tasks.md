# Tasks: add-login-seguridad

- [x] T1 Backend: models + schemas Zod (`models/auth.ts`, `schemas/auth.ts`)
- [x] T2 Backend: `repositories/auth-repository.ts` (rpc `fn_login`, `fn_permisos_usuario`)
- [x] T3 Backend: `services/auth-service.ts` (mapeo 401, JWT 8h, `rutaInicial`)
- [x] T4 Backend: `controllers/auth-controller.ts` + `routes/auth.ts` + montar en `app.ts`
- [x] T5 Backend: `middlewares/auth-guard.ts`, `role-guard.ts`, `permission-guard.ts`
- [x] T6 Backend: `typecheck` + `build` limpios
- [x] T7 Frontend: `features/auth/login/` (service, context, form, page)
- [x] T8 Frontend: guards + rutas (`/auth/login` pública, `/admin` protegida)
- [x] T9 Frontend: `tsc` + `vite build` limpios
- [x] T10 Verificación: `fran/fran` → JWT → `/admin`; clave mala → 401;
  ×3 fallos → `BLOQUEADO`; 5 escenarios Gherkin en verde; desbloquear `fran`
- [x] T11 Archive del change

> Sincerado 2026-10-15: auth en uso productivo (login 200, JWT 8h, guards). Bug conocido aparte: error no-LoginError tumba el proceso (fix 503 pendiente).
