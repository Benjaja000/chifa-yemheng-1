# Spec: personas — registro e invariantes (verdad actual)

Consolidada desde `changes/add-modulo-personas/specs/personas/spec.md`,
verificada contra código **tras el recorte UI de 2026-10**. En caso de
conflicto, manda el código.

## Invariantes (base del diseño; un CRUD plano las rompería)
- `uq_persona_doc UNIQUE(id_tipoidentidad, n_documento)`; correo nunca único.
- `uq_empleado_persona`: 1 empleado por persona.
- `ck_cliente_xor`: cliente = persona XOR empresa, exactamente uno.
- `usuario.id_empleado NOT NULL`: sin empleado no hay login.
- Sin borrado físico: `estado A|I(/E)` + auditoría; inserts persona→rol
  secuenciales sin transacción (idempotencia por reintento ante `23505`).

## Backend (`/api/v1/personas`, `authGuard`) — vigente completo
- `GET /` (`PER_VER`): `buscar/page/limit`, orden `feccre DESC, id DESC` →
  `{ data, page, limit, total }` con `esPersonalActivo/esClienteActivo`.
- `GET /buscar?tipoDoc&documento` (`PER_VER`): 200 con roles; 404 `NOT_FOUND`.
- `POST /` (`PER_CREAR`): ficha sin rol; duplicado → 409 `YA_EXISTE`.
- `PUT /:id` (`PER_CREAR`): solo columnas PERSONA; documento/tipoDoc inmutables.
- `POST /:id/hacer-personal|hacer-cliente` (`PER_ASIGNAR`): 409 `YA_ES_*`
  cruzado o `YA_EXISTE` mismo rol.
- `POST /:id/convertir` (`PER_ASIGNAR`): cierra rol actual (`I`, `f_cese` hoy)
  y abre el destino; sin rol activo equivale a hacer-*.

## UI actual (`/admin/personas`) — registro plano tras recorte 2026-10
Solo lista + filtro (nombre/documento/teléfono) + paginación + "Nueva persona"
(ficha base). **Sin** panel de ficha, **sin** buscador por documento y **sin**
Hacer/Convertir en pantalla: la asignación de rol vive en Personal/Clientes
(creación inline) y la conversión por UI no existe (endpoints siguen vivos).
Discrepancia anotada: el delta original describía ficha + roles en UI;
el código vigente tras el recorte es registro.
