import { supabase } from '../config/supabase.js';
import type { Permiso, Rol, Usuario, UsuarioLista, RolLista, PermisoLista } from '../models/seguridad.js';
import type { RolCreate, RolQuery, UsuarioCreate, UsuarioQuery, UsuarioUpdate } from '../schemas/seguridad.js';
import { createAudit, updateAudit } from '../utils/auditoria.js';
import { createHash } from 'crypto';

interface UsuarioRow {
  id_usuario: number;
  logeo: string;
  id_tipousuario: number;
  tipo_usuario: { n_tipousuario: string } | null;
  id_empleado: number;
  empleado: { persona: { nombre: string; ap_paterno: string | null } } | null;
  bloqueado: string;
  intentos: number;
  estado: string;
  feccre: string;
}

interface RolRow {
  id_rol: number;
  n_rol: string;
  descripcion: string | null;
  estado: string;
}

interface PermisoRow {
  id_permiso: number;
  id_modulo: number;
  modulo: { n_modulo: string } | null;
  n_permiso: string;
  clave: string;
  descripcion: string | null;
  estado: string;
}

const USUARIO_SELECT = 'id_usuario, logeo, id_tipousuario, tipo_usuario(n_tipousuario), id_empleado, empleado(persona(nombre, ap_paterno)), bloqueado, intentos, estado, feccre';
const ROL_SELECT = 'id_rol, n_rol, descripcion, estado';
const PERMISO_SELECT = 'id_permiso, id_modulo, modulo(n_modulo), n_permiso, clave, descripcion, estado';

function mapUsuario(row: UsuarioRow): Usuario {
  return {
    id: row.id_usuario,
    logeo: row.logeo,
    tipo: row.tipo_usuario?.n_tipousuario ?? '',
    empleadoId: row.id_empleado ?? null,
    empleado: row.empleado?.persona
      ? `${row.empleado.persona.nombre} ${row.empleado.persona.ap_paterno ?? ''}`.trim()
      : null,
    bloqueado: row.bloqueado ?? 'N',
    intentos: Number(row.intentos ?? 0),
    estado: (row.estado ?? 'A') as Usuario['estado'],
    fechaCreacion: row.feccre,
  };
}

function mapRol(row: RolRow): Rol {
  return {
    id: row.id_rol,
    nombre: row.n_rol,
    descripcion: row.descripcion,
    estado: (row.estado ?? 'A') as Rol['estado'],
  };
}

function mapPermiso(row: PermisoRow): Permiso {
  return {
    id: row.id_permiso,
    modulo: row.modulo?.n_modulo ?? '',
    moduloId: row.id_modulo,
    nombre: row.n_permiso,
    clave: row.clave,
    descripcion: row.descripcion,
    estado: (row.estado ?? 'A') as Permiso['estado'],
  };
}

export async function listarUsuarios(q: UsuarioQuery): Promise<UsuarioLista> {
  const desde = (q.page - 1) * q.limit;
  const hasta = desde + q.limit - 1;

  let query = supabase
    .from('usuario')
    .select(USUARIO_SELECT, { count: 'exact' })
    .order('feccre', { ascending: false })
    .order('id_usuario', { ascending: false })
    .range(desde, hasta);

  if (q.buscar) {
    query = query.ilike('logeo', `%${q.buscar}%`);
  }
  if (q.estado) {
    query = query.eq('estado', q.estado);
  }

  const { data, error, count } = await query;
  if (error) throw new Error(`DB_LIST_FAIL: ${error.message}`);
  return {
    data: ((data ?? []) as unknown as UsuarioRow[]).map(mapUsuario),
    page: q.page,
    limit: q.limit,
    total: count ?? 0,
  };
}

export async function crearUsuario(input: UsuarioCreate, usucre: string, pc = ''): Promise<Usuario> {
  // Verificar que el logeo no exista
  const { data: existing } = await supabase
    .from('usuario')
    .select('id_usuario')
    .eq('logeo', input.logeo)
    .maybeSingle();
  if (existing) throw new Error('YA_EXISTE');

  // Resolver el tipo de usuario por nombre
  const { data: tipo } = await supabase
    .from('tipo_usuario')
    .select('id_tipousuario')
    .eq('n_tipousuario', input.tipo)
    .maybeSingle();
  if (!tipo) throw new Error('TIPO_INVALIDO');

  const claveHash = createHash('sha256').update(input.clave).digest('hex');

  const { data, error } = await supabase
    .from('usuario')
    .insert({
      logeo: input.logeo,
      clave: claveHash,
      id_tipousuario: (tipo as { id_tipousuario: number }).id_tipousuario,
      id_empleado: input.empleadoId,
      bloqueado: 'N',
      intentos: 0,
      estado: input.estado,
      ...createAudit(usucre, pc),
    })
    .select(USUARIO_SELECT)
    .single();
  if (error) throw new Error(`DB_CREATE_FAIL: ${error.message}`);
  return mapUsuario(data as unknown as UsuarioRow);
}

export async function actualizarUsuario(id: number, input: UsuarioUpdate, usumod: string, pc = ''): Promise<Usuario | null> {
  const patch: Record<string, unknown> = { ...updateAudit(usumod, pc) };
  if (input.tipo !== undefined) {
    const { data: tipo } = await supabase
      .from('tipo_usuario')
      .select('id_tipousuario')
      .eq('n_tipousuario', input.tipo)
      .maybeSingle();
    if (!tipo) throw new Error('TIPO_INVALIDO');
    patch['id_tipousuario'] = (tipo as { id_tipousuario: number }).id_tipousuario;
  }
  if (input.empleadoId !== undefined) patch['id_empleado'] = input.empleadoId;
  if (input.estado !== undefined) patch['estado'] = input.estado;

  const { data, error } = await supabase
    .from('usuario')
    .update(patch)
    .eq('id_usuario', id)
    .select(USUARIO_SELECT)
    .maybeSingle();
  if (error) throw new Error(`DB_UPDATE_FAIL: ${error.message}`);
  if (!data) return null;
  return mapUsuario(data as unknown as UsuarioRow);
}

export async function listarRoles(q: RolQuery): Promise<RolLista> {
  const desde = (q.page - 1) * q.limit;
  const hasta = desde + q.limit - 1;

  let query = supabase
    .from('rol')
    .select(ROL_SELECT, { count: 'exact' })
    .order('n_rol', { ascending: true })
    .range(desde, hasta);

  if (q.buscar) query = query.ilike('n_rol', `%${q.buscar}%`);
  if (q.estado) query = query.eq('estado', q.estado);

  const { data, error, count } = await query;
  if (error) throw new Error(`DB_LIST_FAIL: ${error.message}`);
  return {
    data: ((data ?? []) as unknown as RolRow[]).map(mapRol),
    page: q.page,
    limit: q.limit,
    total: count ?? 0,
  };
}

export async function crearRol(input: RolCreate, usucre: string, pc = ''): Promise<Rol> {
  const { data, error } = await supabase
    .from('rol')
    .insert({
      n_rol: input.nombre,
      descripcion: input.descripcion || null,
      estado: input.estado,
      ...createAudit(usucre, pc),
    })
    .select(ROL_SELECT)
    .single();
  if (error) throw new Error(`DB_CREATE_FAIL: ${error.message}`);
  return mapRol(data as unknown as RolRow);
}

export async function listarPermisos(): Promise<PermisoLista> {
  const { data, error } = await supabase
    .from('permiso')
    .select(PERMISO_SELECT)
    .order('id_modulo', { ascending: true })
    .order('clave', { ascending: true });
  if (error) throw new Error(`DB_LIST_FAIL: ${error.message}`);
  return {
    data: ((data ?? []) as unknown as PermisoRow[]).map(mapPermiso),
    page: 1,
    limit: 1000,
    total: (data ?? []).length,
  };
}

export async function asignarPermisosRol(rolId: number, permisoIds: number[], usumod: string, pc = ''): Promise<void> {
  // Eliminar permisos actuales
  await supabase.from('rol_permiso').delete().eq('id_rol', rolId);
  // Insertar nuevos
  if (permisoIds.length > 0) {
    const rows = permisoIds.map((pid) => ({
      id_rol: rolId,
      id_permiso: pid,
      concedido: 'S',
      estado: 'A',
      ...createAudit(usumod, pc),
    }));
    const { error } = await supabase.from('rol_permiso').insert(rows);
    if (error) throw new Error(`DB_ASSIGN_FAIL: ${error.message}`);
  }
}
