# Design: add-modulo-personas

## Mapeo spec ↔ BD
| Origen | BD | Decisión |
|---|---|---|
| Ficha persona (nombres, doc, contacto, distrito) | `PERSONA` (ID_TipoIdentidad, N_Documento UQ por (tipo, doc), Nombre 80, Ap_Paterno/Materno, Celular char(9), Email 50, Direccion 100, ID_Distrito, F_Nacimiento, Genero) | `crearBase` solo inserta PERSONA; `hacer-*`/`convertir` reutilizan `id_persona` existente. |
| Hacer personal | `EMPLEADO` (ID_Persona UQ, ID_Cargo, ID_Contrato, Salario, Turno, F_Ingreso…) | Un empleado activo por persona (`uq_empleado_persona`); 409 `YA_ES_CLIENTE_ACTIVO` si tiene cliente A. |
| Hacer cliente N | `CLIENTE` (ID_Persona, Tipo 'N', `ck_cliente_xor`) | 409 `YA_ES_EMPLEADO_ACTIVO` si tiene empleado A. Ruta J no toca PERSONA. |
| Exclusividad | Sin constraint XOR entre tablas | Regla a nivel app (services): solo un rol con `estado='A'`; historial con `I` se conserva. |
| Carrera concurrente | `uq_persona_doc` | Insert duplica → capturar `23505`, re-buscar y reutilizar (idempotente). |
| Orden | `feccre DESC + id_persona DESC` | Orden listado universal (`openspec/config.yaml`). |

## Decisiones
1. **Sin módulo CRUD pesado de personas sueltas**: la ficha base existe para
   registrar y luego asignar; no hay personas "huérfanas" operativas salvo
   transitorias (se crean y asignan en el mismo flujo UI).
2. **Convertir es atómico en servicio**: cierra rol actual
   (empleado → `estado I + f_cese hoy`; cliente → `estado I`) y abre el
   nuevo; una sola auditoría `CONVERTIR_ROL` + las de crear/cerrar.
3. **Datos compartidos**: `PUT /personas/:id` edita la fila PERSONA (misma
   fila vista desde ambos roles); personal/cliente solo editan su lado.
4. **Guards**: `requirePermisos(PER_*)`; ruta `ADMINISTRADOR, GERENTE`.
5. **Tipos identidad**: se unifica el mapeo CE (`CARNET EXTRANJERIA`) en el
   nuevo repositorio compartido.
6. **Auditoría** `AUDITORIA` (CREAR_PERSONA, HACER_PERSONAL/CLIENTE,
   CONVERTIR_ROL, EDITAR_PERSONA).
