# Spec delta: clientes — asistencia Factiliza (fase 1)

## CLI-AUTOFILL-1 · Botón por documento
Ficha N (solo `tipoDoc==='DNI'`) y ficha J muestran botón "Buscar" junto al
documento, habilitado con longitud válida (8 / 11 dígitos). Consulta solo por
pulsación explícita, nunca automática.

## CLI-AUTOFILL-2 · Llenado
N: `nombres` (+`apPaterno/apMaterno/fNacimiento/genero` si vienen con valor,
+`direccion` si trae valor; si viene vacío conserva lo digitado);
J: `razonSocial` (+`direccion` si trae valor). Se sobrescribe identidad;
teléfono/correo/código jamás se tocan. Todo lo rellenado queda editable. Nombres,
apellido paterno y apellido materno se exponen como campos propios; teléfono se
captura como `Celular` en la UI.

## CLI-AUTOFILL-2b · Datos oficiales de solo referencia
Los nombres de ubicación que trae la fuente (`distrito - provincia -
departamento`) se muestran como texto de referencia bajo el picker, sin
guardarse. En ficha J, `tipo_contribuyente` se muestra como caption bajo
Razón Social, sin guardarse. Ninguno bloquea el guardado.

## CLI-AUTOFILL-3 · Ubicación en cadena
Formulario usa `Departamento → Provincia → Distrito` en cadena, tanto manual
como autocompletado:
- Manual: provincia filtrada por departamento; distrito filtrado por provincia;
  cambiar un nivel superior resetea los inferiores y el `distritoId` a `0`.
- `por-ubigeo`: devuelve `{ id, nombre, provinciaId, provinciaNombre,
  departamentoId, departamentoNombre }`; autocompleta los 3 niveles por el
  `distritoId` derivado.
- Sin match de ubigeo o sin ubigeo: formulario manual intacto y referencia
  `Ubigeo SUNAT <código> sin equivalencia local`.
El picker nunca consulta por nombre; solo el código de 6 dígitos.

## CLI-AUTOFILL-4 · RUC no habido y errores
RUC con `estado`/`condicion` distintos de ACTIVO/HABIDO → banner ámbar sin
bloquear el guardado. `404` (no encontrado), `502` (servicio), `503` (sin
token) → mensajes + formulario manual intacto. Sin cambios en edición.
