# Spec Delta

## Purpose

Kanban operativo staff para seguimiento global de deliveries P→R→E/C con mapa vivo (polling 30s), KPIs, y acciones: iniciar ruta (P→R), confirmar entrega (R→E), anular (P→C). Solo lectura de GPS (el repartidor reporta).

## ADDED Requirements

### Requirement: Kanban deliveries global
El sistema SHALL mostrar a SUPERVISOR/ADMIN/MOZO/CAJERO (DELIVERY_VER) un kanban con columnas P / R / E, tarjetas por delivery con: pedido, cliente, dirección+distrito, teléfono, total+costo_envío, método pago, repartidor, tiempos (espera desde creación, en ruta desde F_Salida), Situacion + F_Salida/F_Entrega.

#### Scenario: Kanban carga inicial
- **WHEN** staff abre /delivery/seguimiento
- **THEN** ve 3 columnas P/R/E con tarjetas, KPIs arriba (pendientes, en ruta, entregados hoy, tiempo prom.)

#### Scenario: Filtro por estado
- **WHEN** staff filtra estado=R
- **THEN** kanban muestra solo columna R con sus tarjetas

#### Scenario: Polling estados
- **WHEN** kanban abierto, cada 30s
- **THEN** se refrescan tarjetas (polling GET /api/delivery/seguimiento?estado=R), mapa actualiza si hay GPS

### Requirement: Mapa vivo global
El sistema SHALL mostrar mapa Leaflet/OSM junto al kanban con pin cliente (lat_cliente/lng_cliente) y pin repartidor (lat_repartidor/lng_repartidor) + f_ubicacion para entregas en R; sin coords muestra mensaje + dirección manual.

#### Scenario: Mapa con GPS activo
- **WHEN** hay entregas en R con lat_repartidor/lng_repartidor
- **THEN** mapa muestra pin cliente (fijo) + pin repartidor (móvil, actualizado cada 30s via f_ubicacion)

#### Scenario: Mapa sin GPS
- **WHEN** entrega en R sin coordenadas
- **THEN** mapa muestra "Sin ubicación GPS — usando dirección manual" + link a mapa externo opcional

#### Scenario: Responsive mapa
- **WHEN** móvil
- **THEN** mapa colapsable, 1 columna kanban + mapa toggle

### Requirement: Iniciar ruta (P→R) — staff
El sistema SHALL permitir a staff con DELIVERY_DESPACHAR cambiar P→R registrando F_Salida=NOW() (equivalente a "despachar").

#### Scenario: Staff inicia ruta
- **WHEN** supervisor pulsa "Iniciar ruta" en tarjeta P
- **THEN** Situacion='R', F_Salida=NOW(), push enviado al repartidor, tarjeta mueve a columna R

#### Scenario: Iniciar ruta sin repartidor asignado
- **WHEN** staff intenta iniciar ruta en P sin ID_Empleado
- **THEN** error "Asigne repartidor antes de despachar"

### Requirement: Confirmar entrega (R→E) — staff
El sistema SHALL permitir a staff con DELIVERY_ENTREGAR cambiar R→E registrando F_Entrega=NOW(); si efectivo, queda "por rendir".

#### Scenario: Staff confirma entrega
- **WHEN** supervisor pulsa "Confirmar entrega" en tarjeta R
- **THEN** Situacion='E', F_Entrega=NOW(), tarjeta mueve a E, si efectivo suma a por rendir

### Requirement: Anular delivery (P→C)
El sistema SHALL permitir anular delivery en P (P→C) con motivo obligatorio; C→* y E→* prohibidos; R→P prohibido (reasignar en /admin/delivery).

#### Scenario: Anular P→C con motivo
- **WHEN** staff pulsa "Anular" en P, ingresa motivo "Cliente canceló"
- **THEN** Situacion='C', motivo guardado en auditoría, tarjeta sale del kanban

#### Scenario: Transiciones prohibidas
- **WHEN** intenta anular E o C, o revertir R→P
- **THEN** error 400 "Transición no permitida"

### Requirement: KPIs operativos
El sistema SHALL mostrar en header del kanban: pendientes (P), en ruta (R), entregados hoy (E hoy), tiempo promedio en ruta (F_Entrega - F_Salida de E de hoy).

#### Scenario: KPIs actualizados
- **WHEN** kanban carga o polling
- **THEN** KPIs reflejan conteos y promedios del día actual