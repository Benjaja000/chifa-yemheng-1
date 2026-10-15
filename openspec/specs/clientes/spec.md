# Spec: clientes — CRUD N/J + ficha completa (verdad actual)

Consolidada desde `changes/add-crud-clientes/specs/clientes/spec.md` +
`changes/add-clientes-ficha-completa/specs/clientes/spec.md`, verificada
contra código. En caso de conflicto, manda el código.

## Endpoints (`/api/v1/clientes`, `authGuard`)
- `GET /` (`CLI_VER`): `page` def 1, `limit` 1..100 def 20, `buscar`
  (nombre/razón/documento/correo ilike), `tipo N|J`, `estado A|I`,
  `orden puntos|alpha|recientes` (def `recientes`) → `{ data, page, limit, total }`
  con `{ id, tipo, nombre, documento, tipoDoc, telefono, correo, distrito,
  direccion, puntos, estado }`.
- `GET /:id` (`CLI_VER`) → 404.
- `POST /` (`CLI_CREAR`), body discriminado:
  `N{ nombres, apPaterno?, apMaterno?, tipoDoc DNI|CE|PASAPORTE, dni[8],
  telefono[9], correo?, distritoId?, direccion?, fNacimiento? pasada,
  genero? M|F|O, codigoCliente?[..15] }` |
  `J{ razonSocial[..140], ruc[11], telefono[..15], correo?, distritoId?,
  direccion?, codigoCliente?[..15] }`.
  Reutiliza `persona` si el documento ya existía (ej. era personal); 409
  `YA_EXISTE` (duplicado) o `YA_ES_EMPLEADO_ACTIVO` (deriva a convertir).
  Sin autoincremento ni unicidad en `codigo_cliente` (igual que BD).
- `PUT /:id` (`CLI_EDITAR`): mismo tipo, sin cambio N↔J; omite `''` donde el
  schema rechaza; 404/409.
- `PATCH /:id/estado` (`CLI_ELIMINAR`): `{ estado:'A'|'I' }` → 200.

## Reglas
- `cliente` = persona XOR empresa (`ck_cliente_xor`); J habilita FACTURA.
- Inactivo → excluido de selectores de venta/reserva/delivery.
- `linea_credito` eliminada de la tabla (change archivado add-drop-linea-credito).

## Frontend (`/admin/clientes`, roles con `CLI_*` + CAJERO en lectura)
Tabs N/J solo al crear; documento/RUC no editables; validación espejo
(DNI 8, CE 9, RUC 11, celular 9, correo+distrito requeridos en UI).
Mensaje `YA_ES_EMPLEADO_ACTIVO` ya no enlaza a Personas-convertir
(recorte UI 2026-10): indica dar de baja el rol activo primero.
