# Spec: personas

## Listar (DESC universal)
```http
GET /api/v1/personas?buscar=juan&page=1&limit=20
```
Orden `feccre DESC, id_persona DESC`. Responde `{ data, page, limit, total }`;
cada item incluye `esPersonalActivo`, `esClienteActivo`.

## Buscar por documento
```http
GET /api/v1/personas/buscar?tipoDoc=DNI&documento=12345678
```
200 con persona + roles activos; 404 `NOT_FOUND` si no existe (el UI ofrece crearla).

## Crear base (sin rol)
```http
POST /api/v1/personas
Body: { tipoDoc, documento, nombres, apPaterno?, apMaterno?, telefono, correo?, distritoId?, direccion?, fNacimiento?, genero? }
```
201 persona. Duplicado (tipo, doc) → 409 `YA_EXISTE`.

## Asignar rol
```http
POST /api/v1/personas/:id/hacer-personal
Body: { cargoId, contratoId, sueldo?, turno?, fIngreso?, ... }
POST /api/v1/personas/:id/hacer-cliente
Body: { codigoCliente?, telefono?, correo?, distritoId?, direccion? }
```
- 409 `YA_ES_CLIENTE_ACTIVO` / `YA_ES_EMPLEADO_ACTIVO` si tiene el otro rol activo.
- 409 `YA_EXISTE` si ya tiene ese mismo rol activo.
- Hacer-cliente solo usa la persona (tipo N); no cambia `tipoDoc/documento`.

## Convertir (cambio de rol, un paso)
```http
POST /api/v1/personas/:id/convertir
Body: { destino: 'personal' | 'cliente', datos: {...mismo shape que hacer-*} }
```
Cierra el rol activo actual (`I`, empleado con `f_cese` hoy) y abre el
destino. Sin rol activo → equivale a hacer-*. Con el destino ya activo → 409.

## Editar ficha compartida
```http
PUT /api/v1/personas/:id
```
Edita solo columnas PERSONA (misma fila visible desde ambos roles).
Documento/tipoDoc no editables (son identidad UQ).

## Criterios de aceptación
- Crear persona → hacer personal → intentar hacer cliente → 409 `YA_ES_EMPLEADO_ACTIVO`.
- Convertir a cliente → empleado `I` con `f_cese` hoy, cliente `A`, una sola fila persona.
- Crear cliente con DNI existente de empleado activo → 409 (indica convertir).
- Listado ordenado nuevo→antiguo; `GET /buscar` con doc inexistente → 404.
