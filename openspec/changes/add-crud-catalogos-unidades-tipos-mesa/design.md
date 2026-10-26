# Design: add-crud-catalogos-unidades-tipos-mesa

## Mapeo spec ↔ BD
| Campo API | `unidad_medida` | `tipo_mesa` | Decisión |
|---|---|---|---|
| nombre | `n_unidad varchar(30)` UNIQUE | `descripcion varchar(80)` | Zod `max(30)`/`max(80)`; duplicado → 409 `YA_EXISTE`. |
| abreviatura | `abreviatura varchar(10)` | — | Obligatoria en unidades. |
| codigoSunat | `codigo_sunat varchar(5)` | — | Opcional; usado en comprobantes. |
| cargoServicio | — | `cargo_servicio numeric(5,2)` def 0 | Numérico ≥0. |
| estado | `estado char(1)` A/I/E | idem | Eliminar = `I`; físico prohibido. |

## Decisiones
1. **Permisos nuevos**: `UNIDAD_*` (módulo CARTA) y `TMESA_*` (módulo MESAS) no
   están en `permiso_modulo.sql`; se agregan con el patch idempotente
   `openspec/database/permiso-crud-unidades-tipos-mesa.sql`
   (ADMINISTRADOR + SUPERVISOR).
2. **409 por dependencia**: `PATCH /tipos-mesa/:id/estado {estado:'I'}` →
   409 `MESAS_ASOCIADAS` con `{ mesasAsociadas:N }`; unidades →
   409 `PRODUCTOS_ASOCIADOS` con `{ productosAsociados:N }`.
   Reintento con `{estado:'I', confirmar:true}`.
3. **Auditoría**: INSERT en `AUDITORIA` (CREAR/EDITAR/ACTIVAR/DESACTIVAR) con
   `ID_Usuario` del JWT y `n_tabla` `UNIDAD_MEDIDA` / `TIPO_MESA`.
4. **DTO camelCase** (`codigoSunat`, `cargoServicio`); snake_case en BD.

## Riesgos
- `backend/coverage/src/routes/...` contiene versiones HTML de estas rutas:
  solo plantilla, no copiar imports `.js` inexistentes.
- `/personas` (esperado por `endpoint-tests.test.ts`) queda fuera de este change.
