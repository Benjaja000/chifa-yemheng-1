# Diseño: Seeds Permisos Idempotentes

## Arquitectura
- Script SQL único, re-ejecutable (`ON CONFLICT DO UPDATE`).
- Se ejecuta en Supabase Dashboard → SQL Editor o vía `supabase db push`.
- No requiere migración de esquema (solo datos en `permiso`, `rol_permiso`).

## Permisos a asegurar
| Clave | Nombre | Descripción |
|-------|--------|-------------|
| `VEN_COBRAR` | Cobrar Venta | Registrar cobros y emitir comprobantes |
| `VEN_EMITIR` | Emitir Comprobante | Emitir boletas/facturas |
| `PED_COCINA` | Cocina KDS | Acceso tablero cocina (KDS) |
| `PED_VER` | Ver Pedidos | Listar/ver comandas |
| `PED_REGISTRAR` | Registrar Pedidos | Abrir, agregar detalle, recalcular |
| `PED_ANULAR` | Anular Pedidos | Anular comandas |
| `PED_EDITAR` | Editar Pedidos | Modificar comandas |
| `PED_DESCUENTO` | Descuentos | Aplicar descuentos en pedidos |
| `CAJ_APERTURAR` | Aperturar Caja | Abrir turno de caja |
| `CAJ_CERRAR` | Cerrar Caja | Cerrar turno y arqueo |
| `CAJ_EGRESO` | Egresos Caja | Registrar egresos de caja |
| `CAJA_APERTURA` | Apertura Caja | Abrir turno USP_APERTURAR_CAJA |
| `CAJA_CIERRE` | Cierre Caja | Cerrar turno USP_CERRAR_CAJA |
| `CAJA_ARQUEO` | Arqueo Caja | Arqueo y diferencias |
| `MESA_VER` | Ver Mesas | Listar/ver mesas y estados |
| `PED_REGISTRAR` | Registrar Pedidos | Abrir comanda, agregar items |
| `PED_COCINA` | Cocina KDS | Cambiar estado preparación |
| `PED_VER` | Ver Pedidos | Listar/ver comandas |
| `CLI_VER` | Ver Clientes | Listar/ver clientes |
| `CLI_CREAR` | Crear Clientes | Registrar nuevos clientes |
| `CLI_EDITAR` | Editar Clientes | Modificar datos cliente |
| `MESA_VER` | Ver Mesas | Listar/ver mesas |
| `PROD_VER` | Ver Productos | Catálogo productos |
| `VEN_EMITIR` | Emitir Comprobante | Emitir boletas/facturas |

## Asignación por Rol
| Rol | Permisos Clave |
|-----|----------------|
| CAJERO | `VEN_COBRAR`, `VEN_EMITIR`, `CAJ_APERTURAR`, `CAJ_CERRAR`, `CAJ_EGRESO`, `PED_REGISTRAR`, `PED_VER`, `CLI_VER`, `MESA_VER`, `PROD_VER` |
| COCINA | `PED_COCINA`, `PED_VER`, `PED_REGISTRAR` |
| MOZO | `PED_REGISTRAR`, `PED_VER`, `PED_EDITAR`, `PED_DESCUENTO`, `MESA_VER`, `CLI_VER`, `PROD_VER` |
| SUPERVISOR | Todos los permisos de CAJERO + COCINA + MOZO + `VEN_ANULAR`, `VEN_NOTACREDITO`, `CAJA_ARQUEO`, `CAJA_CIERRE`, `REP_VER`, `AUD_VER` |

## Implementación
Script único `03_seeds_permisos.sql` con:
1. `INSERT INTO permiso ... ON CONFLICT (clave) DO UPDATE ...`
2. `INSERT INTO rol_permiso ... ON CONFLICT (id_rol, id_permiso) DO UPDATE ...`
3. Joins por `n_rol` y `clave` para resolver IDs dinámicamente.