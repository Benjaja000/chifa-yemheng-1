# Diseño: Caja Factura 01 Completa

## Arquitectura
- Reutiliza `POST /api/v1/caja/cobro` con `tipoDocumento='01'`.
- Backend valida `clienteId` + `id_empresa` en `cliente` → `empresa`.
- Frontend: selector cliente empresa (solo tipo 'J') con búsqueda RUC/razón social.

## Endpoints backend (existentes, se completan)
| Método | Ruta | Guard | Descripción |
|--------|------|-------|-------------|
| POST | `/api/v1/caja/cobro` | `VEN_COBRAR` / `VEN_EMITIR` | Cobro con factura 01 completa |

## Reglas de negocio
- **Factura (01)**: requiere `clienteId` con `id_empresa` NOT NULL → inserta en `FACTURA(id_empresa)`.
- **Boleta (03)**: poblar `cliente_documento` (N_Documento) y `cliente_nombre` (nombres + apellidos) desde `CLIENTE` + `PERSONA`.
- **Validación RUC**: 11 dígitos, estado ACTIVO/HABIDO (proxy Factiliza opcional, no bloqueante).
- **Correlativo**: usa `fn_incrementar_correlativo_serie('01')` con FOR UPDATE.

## Frontend
- Modal cobro: selector tipo documento (03/01).
- Si '01': mostrar buscador cliente empresa (RUC/razón social), validar 11 dígitos.
- Mostrar `id_empresa` / RUC confirmado antes de emitir.