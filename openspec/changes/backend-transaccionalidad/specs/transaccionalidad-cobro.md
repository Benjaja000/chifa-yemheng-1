# Spec: Transaccionalidad Cobro (Rollback Atómico)

## Objetivo
Garantizar atomicidad del proceso de cobro: **todo o nada**.

## Requisitos

### REQ-1: Función PL/pgSQL transaccional
- **Given** parámetros de cobro válidos
- **When** `supabase.rpc('fn_cobrar_pedido_completo', params)`
- **Then** se ejecuta toda la lógica en una transacción implícita:
  1. Recalcular pedido (`fn_recalcular_pedido`)
  2. Validar pedido no facturado/anulado
  3. Validar turno de caja activo
  4. Calcular totales, vuelto
  5. Insertar VENTA (retorna id_venta)
  6. Insertar DETALLE_VENTA desde DETALLE_PEDIDO
  7. Incrementar correlativo serie_documento (FOR UPDATE) → serie, numero
  8. Insertar BOLETA (03) o FACTURA (01) con id_empresa
  9. Insertar PAGO_VENTA
  10. Insertar MOVIMIENTO_CAJA (id_tipomovimiento=1 INGRESO, id_concepto según método)
  9. Actualizar PEDIDO (facturado='S', id_estadopedido=4, f_cierre)
  10. Actualizar MESA (id_estadomesa=1 LIBRE) si tiene mesa
  10. INSERT AUDITORIA (COBRAR_VENTA)
  11. Retornar { id_venta, serie, numero, total, vuelto }

### REQ-2: Rollback automático
- **Given** fallo en cualquier paso (ej. serie no existe, FK viola constraint)
- **When** excepción lanzada en PL/pgSQL
- **Then** transacción completa hace rollback → **cero cambios persistidos**.

### REQ-3: Mapeo errores
- Excepciones PL/pgSQL mapeadas a códigos API idénticos a implementación anterior.

## Errores
- 409 `PEDIDO_FACTURADO` / `NO_CAJA_ABIERTA` / `FACTURA_CLIENTE_REQUERIDO` / `SERIE_NO_EXISTE` / `TOTAL_CERO`
- 422 `MONTO_RECIBIDO_INVALIDO` / `ID_CLIENTE_INVALIDO`
- 500 `DB_*` (otros)