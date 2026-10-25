# Propuesta: Seeds Permisos Idempotentes (CAJERO, COCINA, MOZO, SUPERVISOR)

## Problema
- Los permisos `VEN_COBRAR`, `PED_COCINA`, `VEN_EMITIR` y otros necesarios para los nuevos módulos no están garantizados en la BD.
- Los roles CAJERO, COCINA, MOZO, SUPERVISOR pueden no tener asignados los permisos necesarios.
- Falta script idempotente para asegurar estado consistente en cualquier entorno.

## Alcance
- Script SQL idempotente (`ON CONFLICT DO UPDATE`) que:
  1. Inserta/actualiza permisos base: `VEN_COBRAR`, `VEN_EMITIR`, `PED_COCINA`, etc.
  2. Asigna permisos a roles: CAJERO, COCINA, MOZO, SUPERVISOR.
  3. Es re-ejecutable sin duplicados ni errores.

## Fuera de alcance
- Creación de nuevos roles.
- Permisos de módulos no implementados (delivery, reservas, etc.).

## Criterios de aceptación
- Script re-ejecutable sin errores (`ON CONFLICT DO UPDATE`).
- Roles CAJERO/COCINA/MOZO/SUPERVISOR tienen permisos correctos tras ejecución.
- Verificable con `SELECT * FROM rol_permiso WHERE id_rol IN (...)`.