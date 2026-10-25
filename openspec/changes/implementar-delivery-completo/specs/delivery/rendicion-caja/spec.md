# Spec Delta

## Purpose

Rendición de efectivo contra entrega: el repartidor entrega dinero al cajero al regresar, quien registra el ingreso consolidado en MOVIMIENTO_CAJA (concepto VENTA AL CONTADO), valida diferencias (cuadrado/faltante/sobrante), y supervisor aprueba casos observados.

## ADDED Requirements

### Requirement: Consultar pedidos pendientes de rendición
El sistema SHALL listar pedidos delivery en E (entregados) con pago efectivo que no tienen MOVIMIENTO_CAJA de rendición asociado, agrupados por repartidor, con: pedido, fecha entrega, cliente, total, método=EFECTIVO, estado rendición=Pendiente.

#### Scenario: Lista pendientes por repartidor
- **WHEN** cajero selecciona repartidor en /caja/rendicion
- **THEN** ve tabla con sus entregas E en efectivo sin rendir, totales por pedido

#### Scenario: Sin pedidos pendientes
- **WHEN** repartidor no tiene entregas efectivo sin rendir
- **THEN** muestra "No existen rendiciones pendientes para este repartidor"

### Requirement: Registrar rendición (Pendiente → Rendido)
El sistema SHALL permitir a CAJERO (REN_REGISTRAR) registrar monto entregado por repartidor para sus pedidos pendientes, con observaciones obligatorias si hay diferencia.

#### Scenario: Rendición cuadrada
- **WHEN** cajero ingresa monto = total esperado (suma pedidos efectivo), sin diferencia
- **THEN** estado=Rendido, observaciones opcionales, crea MOVIMIENTO_CAJA ingreso (VENTA AL CONTADO) por monto total, incrementa Monto_Sistema de APERTURA_CAJA actual

#### Scenario: Rendición con faltante
- **WHEN** monto entregado < total esperado (ej. esperaba 100, entregó 95)
- **THEN** exige observación obligatoria, estado=Observado, diferencia=-5, crea MOVIMIENTO_CAJA por 95

#### Scenario: Rendición con sobrante
- **WHEN** monto entregado > total esperado (ej. esperaba 100, entregó 103)
- **THEN** exige observación obligatoria justificando excedente, estado=Observado, diferencia=+3, crea MOVIMIENTO_CAJA por 103

#### Scenario: Rendición parcial (pedidos seleccionados)
- **WHEN** cajero selecciona solo algunos pedidos de la lista
- **THEN** total esperado = suma seleccionados, proceso igual

#### Scenario: Pedido ya rendido
- **WHEN** intenta rendir pedido que ya tiene MOVIMIENTO_CAJA rendición
- **THEN** error "Pedido ya rendido" (VU-DEL-005)

### Requirement: Validar rendición (Rendido → Validado)
El sistema SHALL permitir a CAJERO/SUPERVISOR (REN_VALIDAR) validar rendiciones Rendido → Validado (cuadrado) u Observado → Validado (supervisor aprueba).

#### Scenario: Validar cuadrado
- **WHEN** cajero valida rendición Rendido con diferencia=0
- **THEN** estado=Validado, caja actualizada, auditoría registra validación

#### Scenario: Supervisor aprueba observado
- **WHEN** supervisor valida rendición Observado (faltante/sobrante justificado)
- **THEN** estado=Validado, auditoría registra aprobación supervisor

#### Scenario: Solo roles autorizados
- **WHEN** REPARTIDOR o MOZO intentan validar
- **THEN** 403 Forbidden (VU-DEL-006)

### Requirement: Resumen monetario y resultado
El sistema SHALL mostrar: Total Esperado (suma pedidos efectivo), Total Entregado (monto declarado), Diferencia = Entregado - Esperado, Clasificación: Cuadrado (0/verde), Faltante (<0/rojo), Sobrante (>0/azul).

#### Scenario: Clasificación automática
- **WHEN** cajero ve resumen antes de registrar
- **THEN** ve colores y etiquetas según diferencia calculada en tiempo real

### Requirement: Constancia PDF y exportación
El sistema SHALL generar constancia PDF de la rendición (repartidor, fecha, pedidos, montos, diferencia, validador) y permitir exportar Excel/PDF del histórico.

#### Scenario: Generar PDF rendición
- **WHEN** cajero pulsa "Imprimir constancia" en rendición Validado
- **THEN** descarga PDF con detalle completo y firma digital validador

#### Scenario: Exportar histórico
- **WHEN** supervisor exporta rendiciones del mes
- **THEN** genera Excel con todas las rendiciones, filtros por fecha/repartidor/estado

### Requirement: Pagos digitales excluidos
El sistema SHALL excluir automáticamente pedidos con pago digital (Yape/Plin/tarjeta) de la rendición física; solo suman a Total_Ingresos, no a Monto_Sistema (BR-INF-051).

#### Scenario: Solo efectivo en rendición
- **WHEN** repartidor tiene 3 entregas E: 2 efectivo ($50, $30) + 1 Yape ($40)
- **THEN** rendición muestra solo $80 esperado, $40 Yape no aparece en rendición física