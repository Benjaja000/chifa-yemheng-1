# Spec: realtime-sync — sincronización en tiempo real de estados por plato

## Purpose

Permitir que los cambios de `estado_preparacion` de un plato en `detalle_pedido` se propaguen a todas las vistas suscritas (cliente tracking, mozo comanda, cocina KDS) en menos de 1 segundo, sin polling, respetando RLS.

## Requirements

### Requirement: Suscripción por pedido
El sistema DEBE permitir suscribirse a cambios de `detalle_pedido` filtrados por `id_pedido` para recibir eventos `INSERT`, `UPDATE` y `DELETE` en tiempo real.

#### Scenario: Cambio de estado en cocina
- **WHEN** cocina actualiza `estado_preparacion` de un detalle a `E` o `S`
- **THEN** las vistas suscritas al `id_pedido` correspondiente reciben el evento en <1s y refrescan la lista de detalles.

#### Scenario: Nuevo plato agregado por mozo
- **WHEN** mozo agrega una línea a una comanda abierta
- **THEN** el cliente tracking recibe el `INSERT` y muestra el nuevo plato con estado `P` (Pendiente) en <1s.

#### Scenario: Plataforma sin conexión
- **WHEN** la conexión Realtime se pierde
- **THEN** la vista muestra un indicador "sin conexión" y reintenta reconexión automática; NO se pierden eventos al reconectar (Supabase replay).

### Requirement: RLS en Realtime
Los eventos Realtime DEBEN respetar las políticas RLS de `detalle_pedido`: cliente ve solo sus detalles, staff ve todos.

#### Scenario: Cliente no ve pedidos ajenos
- **WHEN** un cliente está suscrito a `pedido:A:detalles`
- **THEN** NO recibe eventos de `detalle_pedido` de otros pedidos (RLS filtra).

#### Scenario: Staff ve todos
- **WHEN** un usuario con rol MOZO/COCINA/ADMINISTRADOR está suscrito
- **THEN** recibe eventos de cualquier `detalle_pedido`.

### Requirement: Badge informativo por plato
Cada vista DEBE mostrar el estado de preparación de cada plato mediante un badge con etiqueta legible y color consistente.

#### Scenario: Cliente tracking
- **WHEN** el cliente abre `/cliente/pedido/:id`
- **THEN** cada plato muestra un pill con etiqueta ("Pendiente"/"Preparando"/"Servido"/"Anulado") y color (ámbar/azul/verde/rojo).

#### Scenario: Mozo comanda
- **WHEN** el mozo abre una comanda
- **THEN** cada línea muestra un pill `md` con etiqueta y color.

#### Scenario: Anulación visible
- **WHEN** cocina o mozo anula un plato (estado `A`)
- **THEN** el badge cambia a rojo "Anulado" en todas las vistas suscritas en <1s.

### Requirement: Sin polling cuando Realtime activo
Las vistas DEBEN eliminar `setInterval` de polling cuando la suscripción Realtime está activa.

#### Scenario: Cliente sin polling
- **WHEN** el cliente tracking está montado
- **THEN** no se emiten peticiones HTTP periódicas; solo la inicial + eventos realtime.

#### Scenario: Fallback a polling
- **WHEN** Realtime falla o no está disponible
- **THEN** la vista activa polling cada 30s como fallback y muestra banner "sin conexión".