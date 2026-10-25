# Spec: Seeds Permisos Idempotentes

## Objetivo
Garantizar que los permisos base y su asignación a roles existan y sean consistentes en cualquier entorno.

## Requisitos

### REQ-1: Permisos base
- **Given** BD vacía o con permisos parciales
- **When** seed ejecutado
- **Then** existen en `permiso` (clave, n_permiso, descripcion, estado='A'):
  - `VEN_COBRAR` / Cobrar Venta
  - `VEN_EMITIR` / Emitir Comprobante
  - `PED_COCINA` / Cocina KDS
  - `PED_VER` / Ver Pedidos
  - `PED_REGISTRAR` / Registrar Pedidos
  - `PED_ANULAR` / Anular Pedidos
  - `PED_EDITAR` / Editar Pedidos
  - `PED_DESCUENTO` / Descuentos
  - `CAJ_APERTURAR` / Aperturar Caja
  - `CAJ_CERRAR` / Cerrar Caja
  - `CAJ_EGRESO` / Egresos Caja
  - `CAJA_APERTURA` / Apertura Caja
  - `CAJA_CIERRE` / Cierre Caja
  - `CAJA_ARQUEO` / Arqueo Caja
  - `MESA_VER` / Ver Mesas
  - `PED_REGISTRAR` / Registrar Pedidos
  - `PED_COCINA` / Cocina KDS
  - `PED_VER` / Ver Pedidos
  - `CLI_VER` / Ver Clientes
  - `CLI_CREAR` / Crear Clientes
  - `CLI_EDITAR` / Editar Clientes
  - `MESA_VER` / Ver Mesas
  - `PROD_VER` / Ver Productos
  - `VEN_EMITIR` / Emitir Comprobante

### REQ-2: Asignación a roles
- **Given** roles CAJERO, COCINA, MOZO, SUPERVISOR existen
- **When** seed ejecutado
- **Then** `rol_permiso` tiene asignaciones según matriz en `design.md`.

### REQ-3: Idempotencia
- **Given** seed ya ejecutado
- **When** se re-ejecuta
- **Then** 0 filas INSERT, solo UPDATE en campos no clave → 0 errores, 0 filas afectadas netas.

## Errores
- Ninguno (script solo datos, sin DDL).