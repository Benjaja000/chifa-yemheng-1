# Spec: reservas — implementado

## Estado actual

- Frontend: AdminReservasPage con vista Lista/Calendario, KPIs, modales de confirmar/atender/anular.
- Backend: CRUD completo (listar, crear, confirmar con mesa, atender, anular, reprogramar, disponibilidad).
- DB: Tabla `reserva` con estados P/C/A/X, campo `adelanto`, relación con `mesa` y `cliente`.
- Permisos: `RES_VER`, `RES_CREAR`, `RES_CONFIRMAR`, `RES_ANULAR`, `RES_ATENDER`, `RES_REPROGRAMAR`.

## Endpoints (REST — `authGuard` + permisos correspondientes)

### Listar

```http
GET /api/v1/reservas?fecha=&mesaId=&estado=&page=&limit=
```

- Filtros opcionales: `fecha` (formato YYYY-MM-DD), `mesaId` (número entero positivo), `estado` (`P`|`C`|`A`|`X`).
- Paginación: `page` (def 1), `limit` (def 20, máx 100).
- Orden: `f_reserva` DESC, `id_reserva` DESC.
- Retorna: `{ data: Reserva[], page, limit, total }`.

### Crear

```http
POST /api/v1/reservas
```

Cuerpo (JSON):
```json
{
  "clienteId": 1,
  "mesaId": null,
  "fecha": "2026-12-20",
  "hora": "20:00",
  "comensales": 4,
  "observacion": "Cumpleaños",
  "adelanto": 20
}
```

- Valida disponibilidad de mesa (capacidad ≥ comensales, mesa LIBRE).
- Reserva creada con `situacion='P'` (Pendiente), `id_mesa=NULL`, `adelanto` registrado.
- Retorna: `201` con la reserva creada.

### Confirmar

```http
PATCH /api/v1/reservas/{id}/confirmar
```

Cuerpo (JSON):
```json
{
  "mesaId": 5,
  "adelanto": 20,
  "observacion": "Mesa por la ventana"
}
```

- Validaciones:
  - La mesa existe y está `LIBRE` (`id_estadomesa = 1`).
  - `mesa.capacidad ≥ comensales` de la reserva.
  - La reserva está en estado `P`.
- Efectos:
  - `situacion` → `C` (Confirmada).
  - `id_mesa` → asignada.
  - `id_estadomesa` de la mesa → `3` (RESERVADA).
  - Si `adelanto > 0`: registra `MOVIMIENTO_CAJA` concepto `ADELANTO DE RESERVA`.
- Retorna: `200` con la reserva confirmada.

### Atender

```http
PATCH /api/v1/reservas/{id}/atender
```

- Efectos:
  - `situacion` → `A` (Atendida).
  - `id_estadomesa` de la mesa → `1` (LIBRE).
- Retorna: `200` con la reserva atendida.

### Anular

```http
PATCH /api/v1/reservas/{id}/anular
```

- Efectos:
  - `situacion` → `X` (Cancelada).
  - `id_estadomesa` de la mesa → `1` (LIBRE).
- Retorna: `200` con la reserva anulada.

### Reprogramar

```http
PATCH /api/v1/reservas/{id}/reprogramar
```

Cuerpo (JSON):
```json
{
  "fecha": "2026-12-21",
  "hora": "19:00",
  "mesaId": 5,
  "comensales": 4,
  "observacion": "Cambio de fecha"
}
```

- Validaciones:
  - Si cambia de mesa: la nueva mesa debe estar `LIBRE` y tener `capacidad ≥ comensales`.
  - Si cambia fecha/hora: no debe solapar con otras reservas confirmadas/atendidas en ese horario.
- Efectos:
  - Actualiza `f_reserva` (fecha + hora).
  - Actualiza `id_mesa` si cambia.
  - Si cambia de mesa: actualiza `id_estadomesa` de la mesa vieja a `1` (LIBRE) y la nueva a `3` (RESERVADA).
- Retorna: `200` con la reserva reprogramada.

### Disponibilidad

```http
GET /api/v1/reservas/disponibilidad?fecha=2026-12-20&hora=20:00&comensales=4
```

- Retorna lista de todas las mesas con `{ mesaId, numero, capacidad, ambiente, disponible, razon }`.
- `disponible=true` si no hay solapa de reserva confirmada/atendida en ese slot y la mesa está `LIBRE`.
- `disponible=false` con `razon` explicativa (ocupada, capacidad insuficiente, fuera de servicio).

## Esquemas (Zod)

- `reservaQuerySchema`: `page`, `limit`, `fecha`, `mesaId`, `estado`.
- `reservaCreateSchema`: `clienteId`, `mesaId` (opcional), `fecha`, `hora`, `comensales`, `observacion`, `adelanto` (≥0).
- `reservaConfirmarSchema`: `mesaId` (positivo), `adelanto` (≥0), `observación` (opcional).
- `reservaReprogramarSchema`: `fecha` (opcional), `hora` (opcional), `mesaId` (opcional), `comensales` (opcional), `observación` (opcional).
- `disponibilidadQuerySchema`: `fecha`, `hora`, `mesaId` (opcional), `comensales` (def 1).

## Modelos

- `Reserva`: `id`, `clienteId`, `cliente`, `mesaId`, `mesa`, `fecha`, `hora`, `comensales`, `adelanto`, `observacion`, `estado` (`P`|`C`|`A`|`X`), `fechaCreacion`.
- `DisponibilidadMesa`: `mesaId`, `numero`, `capacidad`, `ambiente`, `disponible`, `razon`.
- `ReservaErrorCode`: `'NOT_FOUND' | 'VALIDATION_ERROR' | 'MESA_OCUPADA' | 'CAPACIDAD_INSUFICIENTE' | 'ESTADO_INVALIDO'`.

## Flujos Principales

### Flujo Reserva Online (Cliente)

1. Cliente entra a `/cliente/reservar`, completa formulario (fecha, hora, personas).
2. Reserva se crea con `situacion='P'`, `id_mesa=NULL`, sin mesa asignada.
3. El sistema notifica al personal (visual en admin, email/push futuro).
4. Personal con permiso `RES_CONFIRMAR` confirma la reserva, asigna una mesa libre.
5. Mesa pasa a estado `RESERVADA` (`id_estadomesa = 3`).
6. Cliente recibe notificación de confirmación.
7. Al llegar el cliente, personal marca `atender` (`situacion='A'`, mesa a `LIBRE`).
8. Al anular, `situacion='X'`, mesa a `LIBRE`.

### Flujo Reserva Staff

1. Staff crea reserva con cliente y mesa explícitos.
2. Confirmar asigna mesa y cambia estado a `C`.
3. Atender cambia a `A` y libera mesa.
4. Anular cambia a `X` y libera mesa.
5. Reprogramar cambia fecha/hora/mesa con validaciones.

## Estados de Reserva

| Código | Nombre | Significado | Transición |
|--------|--------|-------------|------------|
| `P` | Pendiente | Reserva creada, sin mesa, espera confirmación. | `→ C` (confirmar), `→ X` (anular). |
| `C` | Confirmada | Mesa asignada, reserva validada. | `→ A` (atender), `→ X` (anular). |
| `A` | Atendida | Cliente ocupó la mesa. | `→ X` (anular). |
| `X` | Cancelada | Reserva cancelada. | Estado terminal. |

## KPIs (Admin)

- **Hoy**: total de reservas agendadas para la fecha actual.
- **Pendientes**: cantidad de reservas con estado `P` (por confirmar).
- **Confirmadas**: cantidad de reservas con estado `C` (mesa asignada).
- **Anuladas**: cantidad de reservas con estado `X` (canceladas).

## Permisos

| Acción | Clave | Módulo | Descripción |
|--------|-------|--------|-------------|
| Ver reservas | `RES_VER` | RESERVAS | Listar reservas. |
| Crear reservas | `RES_CREAR` | RESERVAS | Registrar presencial/online. |
| Confirmar reservas | `RES_CONFIRMAR` | RESERVAS | Confirmar online con mesa libre. |
| Atender reservas | `RES_ATENDER` | RESERVAS | Marcar reserva como atendida (cliente llegó). |
| Anular reservas | `RES_ANULAR` | RESERVAS | Anular reserva (P→X, C→X). |

## Validaciones Negocio (alineadas a REGLAS_DE_NEGOCIO.md)

| Código | Regla | Implementación |
|--------|-------|----------------|
| **BR-RES-052** | Reserva online nace `P` sin mesa; personal confirma asignando mesa libre → mesa a `RESERVADA`. | `confirmarReserva` valida mesa LIBRE + capacidad, actualiza `id_estadomesa=3`. |
| **VU-RES-006** | Una mesa no puede ser reservada dos veces para el mismo horario. | `disponibilidad()` valida solapa de reservas `C`/`A` en el mismo horario. |
| **VU-RES-007** | Confirmar una reserva cambia su estado a `C`. | `confirmarReserva` cambia `situacion` a `C`. |
| **VU-RES-009** | Una reserva anulada no puede reactivarse. | Una vez `situacion='X'`, no hay endpoint para revertir a `P`/`C`/`.` |
| **BR-DER-053** | El adelanto de una reserva es opcional. En online, solo pago único digital y se registra con concepto `ADELANTO DE RESERVA`. Se cruza con la factura al cobrar. | En `confirmarReserva`: si `adelanto > 0`, inserta `MOVIMIENTO_CAJA` concepto `ADELANTO DE RESERVA`. |

## APIs Cliente

- `POST /api/v1/cliente/reservas` (body: `fecha`, `hora`, `comensales`, `observacion`, `adelanto?`) → crea reserva `P` sin mesa, asociada al cliente autenticado via Gmail.
- `GET /api/v1/cliente/reservas` → lista las reservas del cliente autenticado (estados `P`/`C`/`.

## Base de Datos

### Tablas relacionadas

- `RESERVA` (id_reserva, id_cliente, id_mesa, id_usuario, f_reserva, n_personas, adelanto, situacion, observacion, feccre, usucare/pccre/usumod/pcmod/fecmod).
- `MESA` (id_mesa, numero, capacidad, id_estadomesa, ...). Estados: `1=LIBRE`, `2=OCUPADA`, `3=RESERVADA`, `4=POR COBRAR`, `5=FUERA DE SERVICIO`.
- `CLIENTE`, `PERSONA`, `USUARIO` (relaciones de negocio).

### Movimiento Caja (adevanto)

- `MOVIMIENTO_CAJA` insertado cuando `confirmarReserva` tiene `adelanto > 0`:
  - `concepto`: `ADELANTO DE RESERVA`.
  - `signo`: `+` (ingreso).
  - `monto`: valor del adelanto.
  - `id_caja`: current open `apertura_caja`.

## Criterios de Aceptación

1. Given un cliente registra una reserva online → When la reserva se almacena → Then se crea con estado `Pendiente` (`P`), `id_mesa = NULL`, sin mesa asignada.
2. Given una reserva pendiente → When el supervisor la confirma → Then se asigna una mesa libre y cambia a `Confirmada` (`C`), mesa a `RESERVADA` (`id_estadomesa=3`).
3. Given una mesa ya reservada para una fecha y hora → When se intenta asignar nuevamente → Then el sistema rechaza la operación y devuelve error `MESA_OCUPADA`.
4. Given una reserva confirmada → When el cliente llega al restaurante → Then la reserva cambia a estado `Atendida` (`A`), mesa a `LIBRE`.
5. Given una reserva pendiente → When el usuario la anula → Then el sistema registra la anulación y actualiza el estado a `Cancelada` (`X`), mesa a `LIBRE`.
6. Given los KPIs de reservas → When el admin consulta el dashboard → Then muestra Hoy/Pendientes/Confirmadas/Anuladas con conteo correcto.
7. Given una fecha y hora solicitada → When se consulta disponibilidad → Then el sistema muestra mesas libres con capacidad suficiente y descarta las ocupadas.

## Estados de Pantalla

- **Loading**: Skeleton de calendario y tabla.
- **Sin Datos**: "No existen reservas registradas."
- **Error**: "No fue posible cargar las reservas."
- **Responsive**:
  - Desktop: Calendario y tabla simultáneos.
  - Tablet: Calendario arriba, tabla abajo.
  - Mobile: Vista agenda tipo cards.

## Criterios de Prueba

- Unit tests: repo/servicio (crear, confirmar mesa libre/ocupada, atender, anular, reprogramar, disponibilidad).
- E2E: flujo cliente (login Gmail → crear reserva P → staff confirma → vista mis reservas → staff atiende).
- Cobertura de tests ≥ 80%.

---

*Documento generado a partir de la implementación real del módulo reservas al 2026-10-24.*