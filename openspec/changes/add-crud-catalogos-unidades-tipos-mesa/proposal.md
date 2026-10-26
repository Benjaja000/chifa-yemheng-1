# Proposal: add-crud-catalogos-unidades-tipos-mesa

## Por qué
Productos y mesas dependen de dos catálogos que hoy no tienen API:
- `producto` requiere `unidadId`, pero el front usa una lista hardcodeada
  (`UNIDADES` en `productos-types.ts`) → viola "no hardcodear datos de negocio"
  (config.yaml). La tabla `unidad_medida` ya existe (yemheng.sql:2424).
- `mesa` requiere `id_tipomesa`; la tabla `tipo_mesa` ya existe
  (yemheng.sql:2287) con `cargo_servicio` (recargo por servicio, BR-DER-023/024).
Los tests `endpoint-tests.test.ts` ya esperan `/unidades` y `/tipos-mesa` (401).

## Qué
ABM de catálogos según `openspec/specs/tipos-mesa/spec.md`:
- `GET/POST/PUT/PATCH /api/v1/unidades` — permisos `UNIDAD_VER/CREAR/EDITAR/ELIMINAR`.
- `GET/POST/PUT/PATCH /api/v1/tipos-mesa` — permisos `TMESA_VER/CREAR/EDITAR/ELIMINAR`.
- Repositorio + servicio + controlador + ruta para cada uno; montar en `app.ts`.
- Reemplazar el hardcode `UNIDADES` por fetch a `/unidades` en el formulario de productos.
- Página admin `/admin/unidades` + item en el sidebar.

## No objetivos
- Asignar unidad a insumos de inventario (change propio).
- Recálculo de precios por `cargo_servicio` (pertenece a cobro).
- Importación masiva / exportación Excel.
