# Spec Delta

## ADDED Requirements

### Requirement: Rendición delivery efectivo contra entrega
El sistema SHALL exponer endpoints `/api/v1/rendiciones` para consolidar efectivo de deliveries E en MOVIMIENTO_CAJA (concepto VENTA AL CONTADO), con validación supervisor.

#### Scenario: GET /api/v1/rendiciones/pendientes — lista por repartidor
- **WHEN** CAJERO GET ?repartidorId=5
- **THEN** 200 lista pedidos E con pago EFECTIVO sin MOVIMIENTO_CAJA rendición: `{ pedidoId, fechaEntrega, cliente, total, metodo:'EFECTIVO', estadoRendicion:'P' }`

#### Scenario: POST /api/v1/rendiciones — registrar rendición
- **WHEN** CAJERO POST `{ repartidorId, pedidoIds:[], montoEntregado, observaciones? }`
- **THEN** 201 crea rendición estado Rendido/Observado según diferencia, crea MOVIMIENTO_CAJA ingreso (VENTA AL CONTADO) por montoEntregado en APERTURA_CAJA actual, incrementa Monto_Sistema

#### Scenario: PATCH /api/v1/rendiciones/{id}/validar — validar
- **WHEN** CAJERO/SUPERVISOR PATCH /validar
- **THEN** estado=Validado, auditoría registra validador, caja consolidada

#### Scenario: PATCH /api/v1/rendiciones/{id}/observar — observar
- **WHEN** CAJERO PATCH /observar `{ motivo }`
- **THEN** estado=Observado, requiere supervisor para validar

#### Scenario: GET /api/v1/rendiciones/{id}/pdf — constancia
- **WHEN** GET /pdf en rendición Validado
- **THEN** 200 PDF con repartidor, fecha, pedidos, montos, diferencia, validador

#### Scenario: Diferencia obliga observación
- **WHEN** montoEntregado ≠ total esperado
- **THEN** observaciones obligatorio, estado=Observado (VU-DEL-004)

#### Scenario: Solo efectivo en rendición
- **WHEN** repartidor tiene pedidos E mixtos (efectivo + digital)
- **THEN** rendición solo considera efectivo; digitales suman Total_Ingresos no Monto_Sistema (BR-INF-051)

#### Scenario: Pedido ya rendido bloqueado
- **WHEN** intenta rendir pedido con MOVIMIENTO_CAJA existente
- **THEN** 409 "Pedido ya rendido" (VU-DEL-005)

#### Scenario: Solo CAJERO/SUPERVISOR validan
- **WHEN** REPARTIDOR/MOZO intentan PATCH /validar
- **THEN** 403 Forbidden (VU-DEL-006)