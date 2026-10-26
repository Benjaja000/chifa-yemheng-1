# Metodología Scrum — sistema-restaurante

> Documento 09: define **cómo se construye** el sistema con Scrum: roles, artefactos,
> eventos y Definition of Done aplicados a este proyecto.
> Complementa el `context:` de `openspec/config.yaml` y el §8/§9/§10 del
> [00-stack-tecnologico.md](./00-stack-tecnologico.md).
> Versión 2.0.0 — Metodología: **Scrum** (adaptado a un equipo unipersonal).

---

# 1. Qué es Scrum

Scrum es un **marco de trabajo empírico**: se apoya en la experiencia y la observación
continua, no en una planificación total hecha por adelantado. No es un proceso rígido; fija
roles, artefactos y eventos mínimos, y deja libre el contenido técnico.

El proyecto se construye de forma **iterativa e incremental**: cada sprint entrega una
**parte del sistema funcionando y verificada** (un incremento), no una fase completa de un
proceso en fila.

```yaml
scrum:
  caracter: iterativo-incremental
  ciclo: [explorar, proponer, especificar, disenar, implementar, verificar, archivar]
  marcoDocumental: OpenSpec (schema: spec-driven)
  tamanoEquipo: 1 desarrollador
```

## 1.1 Los tres pilares (empirismo)

| Pilar | Significado | En este proyecto |
|---|---|---|
| Transparencia | Todos ven el mismo estado real del trabajo | Los cambios y las specs viven en el repositorio, versionados |
| Inspección | Revisión frecuente del avance | Aprobación explícita antes de implementar; verificación con pruebas |
| Adaptación | Corregir el rumbo cuando algo no sirve | Registro de decisiones (§8) y `/opsx-update` cuando cambia un requisito |

## 1.2 Los cinco valores

Compromiso, foco, apertura, respeto y coraje. Se traducen en prácticas concretas:
compromiso con la Definition of Done, foco en un sprint a la vez, apertura al mostrar el
incremento, respeto a las reglas `BR-*` y coraje para descartar lo que no aporta
(p. ej. la arquitectura multisede).

---

# 2. Roles en el proyecto

| Rol Scrum | Quién lo ejerce | Responsabilidad |
|---|---|---|
| Product Owner | Dueño del negocio / cliente | Ordena el Product Backlog, define reglas (catálogo `BR-*`) y acepta incrementos |
| Scrum Master | El propio desarrollador | Asegura que se respete el ciclo OpenSpec y la Definition of Done |
| Developers (equipo) | El propio desarrollador (asistido por herramientas) | Especifica, implementa, prueba y documenta |

> Nota metodológica: al ser un equipo unipersonal, el Daily Scrum se reduce al seguimiento
> por tarea en `tasks.md`. Se conservan el **backlog priorizado**, los **sprints de alcance
> corto** y la **Definition of Done**.

---

# 3. Artefactos en el proyecto

Scrum define tres artefactos, cada uno con un "compromiso":

| Artefacto | Compromiso | Contenido | Dónde vive |
|---|---|---|---|
| **Product Backlog** | Objetivo del producto | Lista ordenada de todo lo que podría construirse | `openspec/changes/` — 37 cambios registrados; `openspec/changes/archive/` para los cerrados |
| **Sprint Backlog** | Objetivo del sprint | Selección y plan del sprint | `openspec/changes/<cambio>/tasks.md` |
| **Incremento** | Definition of Done | Resultado terminado y usable | Código de `backend/` y `frontend/` + migraciones en `openspec/database/` |

```yaml
artefactos:
  productBacklog: openspec/changes/
  sprintBacklog:  openspec/changes/<cambio>/tasks.md
  razon:          openspec/changes/<cambio>/proposal.md
  especificacion: openspec/changes/<cambio>/specs/<capacidad>/spec.md
  diseno:         openspec/changes/<cambio>/design.md
  fuenteDeVerdad: openspec/specs/
  reglasNegocio:  openspec/docs/REGLAS_DE_NEGOCIO.md
  decisiones:     openspec/docs/general/00-stack-tecnologico.md (§10)
```

| Elemento de apoyo | Ubicación en el repo |
|---|---|
| **Especificación viva** | `openspec/specs/` — 14 capacidades (`caja`, `delivery`, `pedidos`, `seguridad`, …) |
| **Reglas de negocio** | `openspec/docs/REGLAS_DE_NEGOCIO.md` — 79 códigos `BR-*` |
| **Pantallas** | `openspec/docs/screens/` — 44 documentos de pantalla |
| **Diccionario de BD** | `openspec/database/` — DDL + seeds + migraciones |

---

# 4. Eventos (las cinco ceremonias)

| Evento | Propósito general | Adaptación en este proyecto |
|---|---|---|
| **Sprint** | Ciclo corto que produce un incremento | Un cambio de `openspec/changes/` |
| **Sprint Planning** | Definir qué y cómo se hará | `/opsx-propose`: proposal + specs + design + tasks |
| **Daily Scrum** | Sincronización diaria de 15 min | Simplificado: seguimiento por tarea en `tasks.md` |
| **Sprint Review** | Mostrar el incremento y recibir retroalimentación | Revisión del incremento contra la spec y las pruebas |
| **Sprint Retrospective** | Mejorar el proceso del equipo | Entrada en el registro de decisiones (§8) |

> Duración: Scrum prescribe sprints de **1 a 4 semanas**. Aquí cada sprint se dimensiona por
> **alcance** (un cambio = un sprint) y no por calendario fijo: puede durar horas o días.

## 4.1 Ciclo de vida de un sprint

Los comandos viven en `.opencode/commands/`.

```text
/opsx-explore  →  /opsx-propose  →  (revisión y aprobación)  →  /opsx-apply  →  archive
   explorar         planning            punto de control         implementar     consolidar
```

| Etapa | Comando / artefacto | Qué produce |
|---|---|---|
| 1. Explorar | `/opsx-explore` | Comprensión del problema, alcance y alternativas |
| 2. Planning | `/opsx-propose` | `proposal.md` + `specs/<capacidad>/spec.md` + `design.md` + `tasks.md` |
| 3. Aprobar | *(control humano)* | El usuario aprueba el alcance antes de tocar código |
| 4. Implementar | `/opsx-apply` | Código + migración + pruebas; cada tarea se marca `- [x]` al completarse |
| 5. Verificar | `/opsx-sync` / `/opsx-update` | Contraste specs ↔ implementación; corrección de desviaciones |
| 6. Cerrar | `/opsx-archive` | El cambio pasa a `openspec/changes/archive/` y su delta se consolida en `openspec/specs/` |

**Regla de oro del sprint:** el Planning es de **solo planificación**; no se escribe código
hasta que existe una aprobación explícita. Así, cada incremento nace de un acuerdo
documentado y no de una improvisación.

## 4.2 Cómo se ordena el backlog

- Se prioriza por **valor de negocio** y **dependencia técnica**, no por orden de llegada.
- Los cambios grandes se dividen en capacidades independientes (`delivery` → `repartidor-app`,
  `seguimiento-staff`, `rendicion-caja`, `notificaciones-push`).
- Un requisito que aparece durante el sprint **no se absorbe en silencio**: se pausa y se
  actualiza el artefacto (`/opsx-update`) o se registra uno nuevo en el backlog.

---

# 5. Definition of Done (DoD)

Un incremento no se cierra si no cumple **todo** lo siguiente:

```yaml
definitionOfDone:
  especificacion:
    - El cambio tiene proposal, specs y tasks completos y aprobados
    - Toda regla citada referencia un código `BR-*` del catálogo
  codigo:
    - TypeScript strict sin `any`
    - Sin cifras de negocio hardcodeadas (precios, tarifas, %, horarios, distritos, textos)
    - Toda cifra/parámetro proviene de BD, config o endpoint, y declara su origen
    - Se respetan las convenciones (§7 del doc 00): kebab-case, PascalCase, camelCase
  verificacion:
    - Tarea de verificación por grep de hardcode sobre los archivos afectados
    - Pruebas automatizadas (Vitest) en verde
    - Migración SQL idempotente cuando hubo cambio de BD
  datos:
    - PKs integer-identity (prohibido UUID); auditoría `usucre/pccre/feccre/...` + `estado`
    - Prohibido crear módulos o pantallas fuera de los 7 canónicos
  cierre:
    - `tasks.md` con todas las tareas marcadas `- [x]`
    - Cambio archivado y specs consolidadas
```

---

# 6. Trazabilidad del sprint

Cadena de evidencia que une la necesidad del negocio con el código funcionando:

```text
BR-* (regla) → proposal.md (por qué) → specs/<capacidad>/spec.md (qué)
             → design.md (cómo) → tasks.md (plan del sprint)
             → código (backend/frontend) + migración SQL (openspec/database)
             → pruebas (Vitest) → archive/ + specs consolidadas
```

Ejemplo real: `add-nota-credito-venta` → reglas `BR-RES-054/055/056` → wrapper SQL
`fn_anular_venta_con_nc` → endpoint en backend → botón en frontend → verificación de
motivo obligatorio y serie de facturación.

---

# 7. Herramientas que soportan el marco

```yaml
tooling:
  planificacion: OpenSpec CLI (schema spec-driven)
  controlVersiones: git
  editorAsistido: Trae / asistente IA
  pruebas: Vitest
  baseDatos: Supabase (PostgreSQL + PostgREST)
  diseno: Google Stitch (solo diseño, no capa runtime)
  documentacion: Markdown en openspec/docs
```

---

# 8. Registro de decisiones

| Fecha | Decisión | Motivo |
|---|---|---|
| 2026-10-25 | Metodología declarada: Scrum adaptado | Los requisitos evolucionaron durante el desarrollo; se necesita entrega por incrementos |
| 2026-10-25 | OpenSpec (`spec-driven`) como marco documental del sprint | Da backlog, specs vivas y trazabilidad `BR-*` → código |
| 2026-10-25 | Daily Scrum reducido al seguimiento en `tasks.md` | Equipo unipersonal; se conservan backlog, sprints cortos y DoD |
