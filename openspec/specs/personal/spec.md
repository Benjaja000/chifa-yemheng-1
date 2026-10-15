# Spec: personal — CRUD + ficha completa (verdad actual)

Consolidada desde `changes/add-crud-personal/specs/personal/spec.md` +
`changes/add-personal-ficha-completa/specs/personal/spec.md`, verificada
contra código. En caso de conflicto, manda el código.

## Endpoints (`/api/v1/personal`, `authGuard`)
- `GET /` (`EMP_VER`): `page` def 1, `limit` 1..100 def 20, `buscar`
  (nombres/documento/celular), `cargo`, `turno` libre, `estado A|I` → lista con
  datos PERSONA+EMPLEADO.
- `GET /:id` (`EMP_VER`) → 404.
- `POST /` (`EMP_CREAR`): `{ nombres[1..80], apPaterno?, apMaterno?,
  tipoDoc DNI|CE|PASAPORTE, documento (DNI 8 / CE-PAS 1..15), telefono[9],
  correo?, direccion?, distritoId?, fNacimiento?, genero? M|F|O, cargoId,
  contratoId, turno?[..18], fIngreso?, sueldo≥0, fondoPension?, nHijos?,
  essalud? }`. DNI 8 dígitos validado en servicio; reutiliza persona si el
  documento existía (ej. era cliente). 409 `YA_EXISTE` o `YA_ES_CLIENTE_ACTIVO`.
- `PUT /:id` (`EMP_EDITAR`, parcial + `fCese?`; documento no editable; 404/409).
- `PATCH /:id/estado` (`EMP_ELIMINAR`): no toca `USUARIO`.
- Maestros vivos (`/api/v1/maestros/...`, permiso EMP_VER o CLI_VER): distritos,
  cargos, contratos, tipos-identidad con `estado='A'`; sin filas el form muestra
  error + Reintentar, nunca datos inventados. Turno texto libre; `Otro` en
  distrito = `NULL`. Cero listas hardcodeadas en selects.

## Reglas
- 1 empleado por persona (`uq_empleado_persona`); cesado (`I` + `f_cese`)
  excluido de futuros usuarios y listados de activos.
- "Crear usuario" no crea nada en v1 (tooltip a futuro módulo).
- Mensaje `YA_ES_CLIENTE_ACTIVO` ya no enlaza a Personas-convertir
  (recorte UI 2026-10): indica dar de baja el rol activo primero.
