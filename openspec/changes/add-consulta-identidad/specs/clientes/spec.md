# Spec delta: clientes — asistencia Factiliza (fase 1)

## CLI-AUTOFILL-1 · Botón por documento
Ficha N (solo `tipoDoc==='DNI'`) y ficha J muestran botón "Buscar" junto al
documento, habilitado con longitud válida (8 / 11 dígitos). Consulta solo por
pulsación explícita, nunca automática.

## CLI-AUTOFILL-2 · Llenado
N: `nombres/apPaterno/apMaterno` (+`fNacimiento/genero` si vienen con valor);
J: `razonSocial` (+`direccion`). Se sobrescribe identidad; teléfono/correo/
código jamás se tocan. Todo lo rellenado queda editable.

## CLI-AUTOFILL-3 · Distrito por ubigeo
Con `ubigeo_sunat` se resuelve `por-ubigeo`: match → preselecciona el picker;
sin match → manual + texto de referencia con depa/prov/distrito. Nunca por nombre.

## CLI-AUTOFILL-4 · RUC no habido y errores
RUC con `estado`/`condicion` distintos de ACTIVO/HABIDO → banner ámbar sin
bloquear el guardado. `404` (no encontrado), `502` (servicio), `503` (sin
token) → mensajes + formulario manual intacto. Sin cambios en edición.
