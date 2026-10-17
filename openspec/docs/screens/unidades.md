# Unidades de Medida

## Información General

### Nombre

Administración de Unidades de Medida

### Ruta

```text
/admin/unidades
```

### Shell

```text
AdminShell
```

### Feature

```text
features/admin/unidades
```

### Roles Permitidos

```text
ADMIN
GERENTE
SUPERVISOR
```

### Permisos

```text
UNI_VER
UNI_CREAR
UNI_EDITAR
UNI_ELIMINAR
```

---

# Objetivo

Administrar las unidades de medida utilizadas al registrar productos
del restaurante (UNIDAD, PORCION, JARRA, KILOGRAMO, LITRO, etc.).

Permite:

- Crear unidades.
- Editar unidades.
- Activar o desactivar unidades.
- Gestionar abreviaturas y códigos SUNAT.
- Alimentar el selector de unidad del alta de productos.

---

# Usuarios Objetivo

- Administrador
- Gerente
- Supervisor

---

# Layout

## Tipo

```text
ABM (Alta, Baja y Modificación)
```

## Estructura General

```text
┌────────────────────────────────────────────────────┐
│ Header + Breadcrumb                               │
├────────────────────────────────────────────────────┤
│ Filtros                                            │
├────────────────────────────────────────────────────┤
│ Acciones                                           │
├────────────────────────────────────────────────────┤
│ Tabla de Unidades                                 │
├────────────────────────────────────────────────────┤
│ Paginación                                         │
└────────────────────────────────────────────────────┘
```

---

# Sección 1: Header

## Componentes

- Título
- Subtítulo
- Breadcrumb

### Ejemplo

```text
Unidades de Medida

Inicio / Administración / Unidades
```

---

# Sección 2: Acciones Principales

## Botón Nueva Unidad

### Acción

```text
Abrir modal de registro.
```

---

# Sección 3: Filtros

## Filtro Nombre

Tipo:

```text
Input Text
```

---

## Filtro Estado

Opciones:

```text
Activo
Inactivo
```

---

## Botón Buscar

Ejecuta la búsqueda.

---

## Botón Limpiar

Limpia filtros.

---

# Sección 4: Tabla de Unidades

## Columnas

| Campo | Descripción |
|---------|---------|
| Nombre | Nombre de la unidad |
| Abreviatura | Abreviatura (UND, POR, KG…) |
| Código SUNAT | Código de catálogo SUNAT (NIU, KGM, LTR…) |
| Productos | Cantidad de productos asociados |
| Estado | Activo / Inactivo |
| Acciones | Editar / Activar / Desactivar |

---

# Modal Crear Unidad

## Datos

### Nombre

Tipo:

```text
Texto
```

Obligatorio:

```text
Sí (máx. 30)
```

---

### Abreviatura

Tipo:

```text
Texto (se guarda en mayúsculas)
```

Obligatorio:

```text
Sí (máx. 10)
```

---

### Código SUNAT

Tipo:

```text
Texto (se guarda en mayúsculas)
```

Obligatorio:

```text
No (máx. 5)
```

---

# Acciones Disponibles

## Crear

```text
Registrar nueva unidad.
```

---

## Editar

```text
Actualizar información.
```

---

## Activar

```text
Cambiar ESTADO a Activo.
```

---

## Desactivar

```text
Cambiar ESTADO a Inactivo.
```

Con productos asociados exige confirmación explícita
(`TIENE_PRODUCTOS` + conteo); la unidad inactiva deja de aparecer
como opción al crear productos.

---

# Reglas de Negocio

## Unicidad

```text
No se admiten dos unidades con el mismo nombre (409 YA_EXISTE).
```

---

## Protección por uso

```text
Desactivar una unidad con productos exige confirmar:true y muestra
el conteo de asociados.
```

---

# Seguridad

## Roles

```text
ADMIN
GERENTE
SUPERVISOR
```

---

## Permisos

### Consultar

```text
UNI_VER
```

### Crear

```text
UNI_CREAR
```

### Editar

```text
UNI_EDITAR
```

### Desactivar

```text
UNI_ELIMINAR
```

---

# APIs

## Listar Unidades

```http
GET /api/unidades
```

---

## Obtener Unidad

```http
GET /api/unidades/{id}
```

---

## Crear Unidad

```http
POST /api/unidades
```

---

## Actualizar Unidad

```http
PUT /api/unidades/{id}
```

---

## Activar / Desactivar

```http
PATCH /api/unidades/{id}/estado
```

---

# Base de Datos

## Tablas

```text
UNIDAD_MEDIDA
PRODUCTO (conteo de asociados)
AUDITORIA
```

---

# Auditoría

Generar auditoría para:

```text
Crear unidad

Editar unidad

Activar unidad

Desactivar unidad
```

---

# Estados de Pantalla

## Loading

Mostrar:

```text
Skeleton de filtros

Skeleton de tabla
```

---

## Sin Datos

```text
No existen unidades registradas.
```

---

## Error

```text
No fue posible cargar las unidades.
```

---

# Responsive

## Desktop

```text
Tabla completa.
```

---

## Tablet

```text
Tabla con scroll horizontal.
```

---

## Mobile

```text
Cards por unidad.
```

---

# Criterios de Aceptación

## Escenario 1

```gherkin
Given un usuario con permiso UNI_CREAR
When registra una nueva unidad
Then el sistema almacena la unidad correctamente
```

---

## Escenario 2

```gherkin
Given una unidad activa
When se crea un producto
Then la unidad aparece en el selector
```

---

## Escenario 3

```gherkin
Given una unidad inactiva
When se crea un producto
Then la unidad no aparece como opción
```

---

## Escenario 4

```gherkin
Given un usuario sin permiso UNI_EDITAR
When intenta modificar una unidad
Then el sistema deniega la operación
```

---

## Escenario 5

```gherkin
Given una unidad con productos asociados
When se intenta desactivar sin confirmar
Then el sistema pide confirmación mostrando el conteo
```
## Estado de implementación

**Estado:** implementada (ruta en `frontend/src/routes/index.tsx`).
