# Proposal: add-modulo-personas

## Por qué
`PERSONA` es la base de la que derivan `EMPLEADO` y `CLIENTE` (`BR-EST-002`),
pero hoy no tiene pantalla: cada alta (personal, cliente N) hace su propio
`INSERT persona` y el servicio bloquea con `YA_EXISTE` si el documento ya
existe en `PERSONA`, aunque sea del otro rol. Resultado ilógico: si Juan ya
es cliente no se le puede hacer empleado y viceversa, y se corre riesgo de
duplicar la ficha.

## Qué
Módulo `Personas` (`/admin/personas`, `features/admin/personas`):
- Ficha única por persona natural: buscar por (tipoDoc, documento),
  crear base sin rol, listar nuevo→antiguo (orden universal DESC).
- Desde la ficha: **Hacer personal** / **Hacer cliente** / **Convertir**
  (cambiar de rol). Regla nueva: **un rol activo a la vez** — nunca
  personal y cliente activos simultáneamente; el historial se conserva
  (rol anterior queda `I`, empleado con `f_cese` del día).
- `POST /personas` y `POST/PUT /personal|/clientes` reutilizan la persona
  existente en vez de duplicarla; se elimina el `delete` compensatorio de
  persona en `crearPersonal`.
- Permisos nuevos `PER_VER/CREAR/ASIGNAR`, ruta con roles
  ADMINISTRADOR + GERENTE (igual que Personal, el más restrictivo).

## No objetivos
- Personas jurídicas (empresas con RUC siguen solo en Clientes, ruta J).
- DDL: sin migraciones (la BD ya permite compartir `id_persona`;
  `uq_persona_doc` sigue impidiendo duplicados).
- `UNIQUE(cliente.id_persona)` (propuesto como migración aparte, fuera).
- Validaciones Reniec en línea.
