# Diseño: Transaccionalidad Cobro (Rollback Atómico)

## Arquitectura
- Supabase (Postgres) soporta transacciones vía `pg` pool o `supabase.rpc` con función PL/pgSQL transaccional.
- **Estrategia elegida**: Crear función PL/pgSQL `fn_cobrar_pedido_completo` que encapsule toda la lógica en una transacción implícita (PL/pgSQL functions run in a transaction).
- Backend llama `supabase.rpc('fn_cobrar_pedido_completo', params)` → una sola llamada, atómica.

## Ventajas
- Atomicidad garantizada por Postgres (todo o nada).
- Lógica de negocio en BD → evita red chatty (múltiples round-trips).
- Rollback automático en cualquier error (excepción PL/pgSQL).

## Implementación
1. **Crear función PL/pgSQL** `fn_cobrar_pedido_completo` que encapsule toda la lógica actual de `cobrar()`.
2. **Backend**: `caja-service.ts` llama `supabase.rpc('fn_cobrar_pedido_completo', params)`.
3. **Eliminar** lógica dispersa en `caja-repository.ts` `cobrar()` → delegar a RPC.
4. **Manejo errores**: función PL/pgSQL lanza excepciones con códigos mapeables (`RAISE EXCEPTION USING ERRCODE = 'XXXXX'`).

## Parámetros RPC
```json
{
  "p_pedido_id": 213,
  "p_usuario_id": 17,
  "p_apertura_id": 204,
  "p_tipo_documento": "03",
  "p_cliente_id": null,
  "p_metodo_pago_id": 1,
  "p_monto_recibido": 18,
  "p_referencia": "Efectivo"
}
```

## Retorno RPC
```json
{
  "id_venta": 203,
  "serie": "B001",
  "numero": "00000170",
  "total": 18,
  "vuelto": 0
}
```

## Errores mapeados
| Excepción PL/pgSQL | HTTP | Código API |
|--------------------|------|------------|
| `RAISE EXCEPTION 'PEDIDO_FACTURADO'` | 409 | `PEDIDO_FACTURADO` |
| `RAISE EXCEPTION 'NO_CAJA_ABIERTA'` | 409 | `NO_CAJA_ABIERTA` |
| `RAISE EXCEPTION 'FACTURA_CLIENTE_REQUERIDO'` | 409 | `FACTURA_CLIENTE_REQUERIDO` |
| `RAISE EXCEPTION 'TOTAL_CERO'` | 422 | `TOTAL_CERO` |
| `RAISE EXCEPTION 'SERIE_NO_EXISTE'` | 409 | `SERIE_NO_EXISTE` |
| Otros | 500 | `DB_*` |

## Archivos a crear/modificar
1. `openspec/changes/backend-transaccionalidad/specs/01_fn_cobrar_pedido_completo.sql`
2. `backend/src/repositories/caja-repository.ts` → `cobrar()` delega a RPC
3. `backend/src/services/caja-service.ts` → `cobrarService()` llama RPC