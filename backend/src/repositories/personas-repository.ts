import { supabase } from '../config/supabase.js';
import type { PersonaBase, PersonaDetalle, PersonaLista } from '../models/persona.js';
import type { HacerCliente, HacerPersonal, PersonaCreate, PersonaUpdate } from '../schemas/persona.js';
import { createAudit, updateAudit } from '../utils/auditoria.js';

interface PersonaRow {
  id_persona: number;
  n_documento: string;
  nombre: string;
  ap_paterno: string | null;
  ap_materno: string | null;
  celular: string | null;
  email: string | null;
  direccion: string | null;
  id_distrito: number | null;
  f_nacimiento: string | null;
  genero: 'M' | 'F' | 'O' | null;
  estado: string;
  tipo_identidad: { n_tipoidentidad: string } | null;
  distrito: { id_distrito: number; d_distrito: string } | null;
}

const SELECT =
  'id_persona, n_documento, nombre, ap_paterno, ap_materno, celular, email, direccion, id_distrito, f_nacimiento, genero, estado, tipo_identidad(n_tipoidentidad), distrito(id_distrito, d_distrito)';

/** Nombre corto del form → nombre real en TIPO_IDENTIDAD. */
export function mapTipoDoc(nombre: string): string {
  const map: Record<string, string> = { DNI: 'DNI', CE: 'CARNET EXTRANJERIA', PASAPORTE: 'PASAPORTE' };
  return map[nombre] ?? nombre;
}

export async function idTipoDoc(nombre: string): Promise<number | null> {
  const { data } = await supabase
    .from('tipo_identidad')
    .select('id_tipoidentidad')
    .eq('n_tipoidentidad', mapTipoDoc(nombre))
    .maybeSingle();
  return (data as { id_tipoidentidad: number } | null)?.id_tipoidentidad ?? null;
}

function mapBase(row: PersonaRow): PersonaBase {
  return {
    id: row.id_persona,
    tipoDoc: row.tipo_identidad?.n_tipoidentidad ?? '',
    documento: row.n_documento ?? '',
    nombres: row.nombre ?? '',
    apPaterno: row.ap_paterno ?? '',
    apMaterno: row.ap_materno ?? '',
    telefono: row.celular ?? '',
    correo: row.email ?? null,
    distritoId: row.distrito?.id_distrito ?? row.id_distrito ?? null,
    distrito: row.distrito?.d_distrito ?? '',
    direccion: row.direccion ?? null,
    fNacimiento: row.f_nacimiento ?? null,
    genero: row.genero ?? null,
    estado: (row.estado ?? 'A') as PersonaBase['estado'],
  };
}

export function esViolacionUnica(err: unknown): boolean {
  const code = (err as { code?: string } | null)?.code ?? '';
  const msg = `${(err as Error)?.message ?? ''}`.toLowerCase();
  return code === '23505' || msg.includes('duplicate') || msg.includes('unique');
}

/** Busca la ficha por (tipoDoc, documento). Null si no existe. */
export async function buscarPersonaPorDoc(tipoDoc: string, doc: string): Promise<PersonaBase | null> {
  const idTipo = await idTipoDoc(tipoDoc);
  if (!idTipo) {
    return null;
  }
  const { data, error } = await supabase
    .from('persona')
    .select(SELECT)
    .eq('id_tipoidentidad', idTipo)
    .eq('n_documento', doc.trim())
    .maybeSingle();
  if (error) {
    throw new Error(`DB_GET_FAIL: ${error.message}`);
  }
  if (!data) {
    return null;
  }
  return mapBase(data as unknown as PersonaRow);
}

/** Roles con estado A vinculados a la persona (historial I no cuenta). */
export async function rolesActivosDe(
  idPersona: number,
): Promise<{ empleadoId: number | null; clienteId: number | null }> {
  const [emp, cli] = await Promise.all([
    supabase.from('empleado').select('id_empleado').eq('id_persona', idPersona).eq('estado', 'A').maybeSingle(),
    supabase.from('cliente').select('id_cliente').eq('id_persona', idPersona).eq('estado', 'A').maybeSingle(),
  ]);
  if (emp.error) {
    throw new Error(`DB_GET_FAIL: ${emp.error.message}`);
  }
  if (cli.error) {
    throw new Error(`DB_GET_FAIL: ${cli.error.message}`);
  }
  return {
    empleadoId: (emp.data as { id_empleado: number } | null)?.id_empleado ?? null,
    clienteId: (cli.data as { id_cliente: number } | null)?.id_cliente ?? null,
  };
}

/** Roles por documento (atajo para validaciones cruzadas). */
export async function rolesActivosPorDoc(
  tipoDoc: string,
  doc: string,
): Promise<{ idPersona: number | null; empleadoId: number | null; clienteId: number | null }> {
  const persona = await buscarPersonaPorDoc(tipoDoc, doc);
  if (!persona) {
    return { idPersona: null, empleadoId: null, clienteId: null };
  }
  const roles = await rolesActivosDe(persona.id);
  return { idPersona: persona.id, ...roles };
}

export async function obtenerPersona(id: number): Promise<PersonaDetalle | null> {
  const { data, error } = await supabase.from('persona').select(SELECT).eq('id_persona', id).maybeSingle();
  if (error) {
    throw new Error(`DB_GET_FAIL: ${error.message}`);
  }
  if (!data) {
    return null;
  }
  const roles = await rolesActivosDe(id);
  return {
    ...mapBase(data as unknown as PersonaRow),
    esPersonalActivo: roles.empleadoId !== null,
    esClienteActivo: roles.clienteId !== null,
    ...roles,
  };
}

export async function listarPersonas(page: number, limit: number, buscar?: string): Promise<PersonaLista> {
  const desde = (page - 1) * limit;
  const hasta = desde + limit - 1;
  const { data, error, count } = await supabase
    .from('persona')
    .select(SELECT, { count: 'exact' })
    .order('feccre', { ascending: false })
    .order('id_persona', { ascending: false })
    .range(desde, hasta);
  if (error) {
    throw new Error(`DB_LIST_FAIL: ${error.message}`);
  }
  let rows = ((data ?? []) as unknown as PersonaRow[]).map(mapBase);
  if (buscar) {
    const b = buscar.toLowerCase();
    rows = rows.filter(
      (r) =>
        `${r.nombres} ${r.apPaterno} ${r.apMaterno}`.toLowerCase().includes(b) ||
        r.documento.includes(buscar) ||
        (r.telefono ?? '').includes(buscar),
    );
  }
  const data2: PersonaDetalle[] = [];
  for (const r of rows) {
    const roles = await rolesActivosDe(r.id);
    data2.push({
      ...r,
      esPersonalActivo: roles.empleadoId !== null,
      esClienteActivo: roles.clienteId !== null,
      ...roles,
    });
  }
  return { data: data2, page, limit, total: count ?? 0 };
}

/** Crea la ficha base. Si ya existe (carrera 23505), devuelve la existente. */
export async function crearPersonaBase(input: PersonaCreate, usucre: string, pc = ''): Promise<PersonaBase> {
  const idTipo = await idTipoDoc(input.tipoDoc);
  if (!idTipo) {
    throw new Error('DB_REF_FAIL: sin TIPO_IDENTIDAD');
  }
  const { data, error } = await supabase
    .from('persona')
    .insert({
      id_tipoidentidad: idTipo,
      id_distrito: input.distritoId ?? null,
      n_documento: input.documento.trim(),
      nombre: input.nombres,
      ap_paterno: input.apPaterno || null,
      ap_materno: input.apMaterno || null,
      f_nacimiento: input.fNacimiento ?? null,
      email: input.correo || null,
      celular: input.telefono,
      genero: input.genero ?? null,
      direccion: input.direccion || null,
      ...createAudit(usucre, pc),
    })
    .select(SELECT)
    .single();
  if (!error) {
    return mapBase(data as unknown as PersonaRow);
  }
  if (esViolacionUnica(error)) {
    const existente = await buscarPersonaPorDoc(input.tipoDoc, input.documento);
    if (existente) {
      return existente;
    }
  }
  throw new Error(`DB_CREATE_FAIL: ${error.message}`);
}

export async function actualizarPersonaBase(
  id: number,
  input: PersonaUpdate,
  usumod: string,
  pc = '',
): Promise<PersonaDetalle | null> {
  const patch: Record<string, unknown> = { ...updateAudit(usumod, pc) };
  if (input.nombres !== undefined) {
    patch['nombre'] = input.nombres;
  }
  if (input.apPaterno !== undefined) {
    patch['ap_paterno'] = input.apPaterno || null;
  }
  if (input.apMaterno !== undefined) {
    patch['ap_materno'] = input.apMaterno || null;
  }
  if (input.telefono !== undefined) {
    patch['celular'] = input.telefono;
  }
  if (input.correo !== undefined) {
    patch['email'] = input.correo || null;
  }
  if (input.direccion !== undefined) {
    patch['direccion'] = input.direccion || null;
  }
  if (input.distritoId !== undefined) {
    patch['id_distrito'] = input.distritoId;
  }
  if (input.fNacimiento !== undefined) {
    patch['f_nacimiento'] = input.fNacimiento;
  }
  if (input.genero !== undefined) {
    patch['genero'] = input.genero;
  }
  const { error } = await supabase.from('persona').update(patch).eq('id_persona', id);
  if (error) {
    throw new Error(`DB_UPDATE_FAIL: ${error.message}`);
  }
  return obtenerPersona(id);
}

/** Inserta la fila EMPLEADO sobre una persona existente. Retorna id_empleado. */
export async function insertarEmpleado(
  idPersona: number,
  datos: HacerPersonal,
  usucre: string,
  pc = '',
): Promise<number> {
  const { data, error } = await supabase
    .from('empleado')
    .insert({
      id_persona: idPersona,
      id_contrato: datos.contratoId,
      id_cargo: datos.cargoId,
      salario: datos.sueldo,
      turno: datos.turno || null,
      fondo_pension: datos.fondoPension ? datos.fondoPension.toUpperCase() : null,
      n_hijos: datos.nHijos ?? null,
      essalud: datos.essalud || null,
      f_ingreso: datos.fIngreso ?? null,
      ...createAudit(usucre, pc),
    })
    .select('id_empleado')
    .single();
  if (error) {
    throw new Error(`DB_CREATE_FAIL: ${error.message}`);
  }
  return (data as { id_empleado: number }).id_empleado;
}

/** Inserta la fila CLIENTE (tipo N) sobre una persona existente. Retorna id_cliente. */
export async function insertarCliente(
  idPersona: number,
  datos: HacerCliente,
  usucre: string,
  pc = '',
): Promise<number> {
  const { data, error } = await supabase
    .from('cliente')
    .insert({
      id_persona: idPersona,
      id_empresa: null,
      codigo_cliente: datos.codigoCliente?.trim() || null,
      tipo_cliente: 'N',
      ...createAudit(usucre, pc),
    })
    .select('id_cliente')
    .single();
  if (error) {
    throw new Error(`DB_CREATE_FAIL: ${error.message}`);
  }
  return (data as { id_cliente: number }).id_cliente;
}

/** Actualiza contacto de la ficha con datos del rol (solo vacíos/no provistos se conservan). */
export async function completarContacto(
  idPersona: number,
  datos: { telefono?: string; correo?: string; distritoId?: number; direccion?: string },
  usumod: string,
  pc = '',
): Promise<void> {
  const patch: Record<string, unknown> = { ...updateAudit(usumod, pc) };
  if (datos.telefono) {
    patch['celular'] = datos.telefono;
  }
  if (datos.correo !== undefined) {
    patch['email'] = datos.correo || null;
  }
  if (datos.distritoId !== undefined) {
    patch['id_distrito'] = datos.distritoId ?? null;
  }
  if (datos.direccion !== undefined) {
    patch['direccion'] = datos.direccion || null;
  }
  if (Object.keys(patch).length <= 3) {
    return;
  }
  const { error } = await supabase.from('persona').update(patch).eq('id_persona', idPersona);
  if (error) {
    throw new Error(`DB_UPDATE_FAIL: ${error.message}`);
  }
}

/** Cierra el empleado activo (cese lógico con fecha de hoy). */
export async function cerrarEmpleado(idEmpleado: number, usumod: string, pc = ''): Promise<void> {
  const hoy = new Date().toISOString().slice(0, 10);
  const { error } = await supabase
    .from('empleado')
    .update({ estado: 'I', f_cese: hoy, ...updateAudit(usumod, pc) })
    .eq('id_empleado', idEmpleado);
  if (error) {
    throw new Error(`DB_UPDATE_FAIL: ${error.message}`);
  }
}

/** Cierra el cliente activo (baja lógica). */
export async function cerrarCliente(idCliente: number, usumod: string, pc = ''): Promise<void> {
  const { error } = await supabase
    .from('cliente')
    .update({ estado: 'I', ...updateAudit(usumod, pc) })
    .eq('id_cliente', idCliente);
  if (error) {
    throw new Error(`DB_UPDATE_FAIL: ${error.message}`);
  }
}

export async function auditar(
  idUsuario: number,
  accion: string,
  idRegistro: number,
  valor: string,
): Promise<void> {
  const { error } = await supabase.from('auditoria').insert({
    id_usuario: idUsuario,
    n_tabla: 'PERSONA',
    accion,
    id_registro: idRegistro,
    valor_nuevo: valor,
  });
  if (error) {
    throw new Error(`DB_AUDIT_FAIL: ${error.message}`);
  }
}
