import { supabase } from '../config/supabase.js';
import type { TipoMesa, TipoMesaLista } from '../models/tipo-mesa.js';
import type { TipoMesaCreate, TipoMesaQuery, TipoMesaUpdate } from '../schemas/tipo-mesa.js';
import { createAudit, updateAudit } from '../utils/auditoria.js';

interface TipoMesaRow {
  id_tipomesa: number;
  descripcion: string;
  cargo_servicio: number | string;
  estado: string;
}

const SELECT = 'id_tipomesa, descripcion, cargo_servicio, estado';

function mapRow(row: TipoMesaRow): TipoMesa {
  return {
    id: row.id_tipomesa,
    nombre: row.descripcion,
    cargoServicio: Number(row.cargo_servicio ?? 0),
    estado: (row.estado ?? 'A') as TipoMesa['estado'],
  };
}

export async function contarMesas(idTipoMesa: number): Promise<number> {
  const { count, error } = await supabase
    .from('mesa')
    .select('id_mesa', { count: 'exact', head: true })
    .eq('id_tipomesa', idTipoMesa);
  if (error) {
    throw new Error(`DB_COUNT_FAIL: ${error.message}`);
  }
  return count ?? 0;
}

export async function listarTiposMesa(q: TipoMesaQuery): Promise<TipoMesaLista> {
  const desde = (q.page - 1) * q.limit;
  const hasta = desde + q.limit - 1;

  let query = supabase
    .from('tipo_mesa')
    .select(SELECT, { count: 'exact' })
    .order('descripcion', { ascending: true })
    .range(desde, hasta);

  if (q.buscar) {
    query = query.ilike('descripcion', `%${q.buscar}%`);
  }
  if (q.estado) {
    query = query.eq('estado', q.estado);
  }

  const { data, error, count } = await query;
  if (error) {
    throw new Error(`DB_LIST_FAIL: ${error.message}`);
  }
  return {
    data: ((data ?? []) as TipoMesaRow[]).map(mapRow),
    page: q.page,
    limit: q.limit,
    total: count ?? 0,
  };
}

export async function obtenerTipoMesa(id: number): Promise<TipoMesa | null> {
  const { data, error } = await supabase
    .from('tipo_mesa')
    .select(SELECT)
    .eq('id_tipomesa', id)
    .maybeSingle();
  if (error) {
    throw new Error(`DB_GET_FAIL: ${error.message}`);
  }
  return data ? mapRow(data as TipoMesaRow) : null;
}

export async function existeNombre(nombre: string, excluirId?: number): Promise<boolean> {
  let query = supabase
    .from('tipo_mesa')
    .select('id_tipomesa', { count: 'exact', head: true })
    .ilike('descripcion', nombre);
  if (excluirId !== undefined) {
    query = query.neq('id_tipomesa', excluirId);
  }
  const { count, error } = await query;
  if (error) {
    throw new Error(`DB_EXISTS_FAIL: ${error.message}`);
  }
  return (count ?? 0) > 0;
}

export async function crearTipoMesa(
  input: TipoMesaCreate,
  usucre: string,
  pc = '',
): Promise<TipoMesa> {
  const { data, error } = await supabase
    .from('tipo_mesa')
    .insert({
      descripcion: input.nombre,
      cargo_servicio: input.cargoServicio,
      estado: input.estado,
      ...createAudit(usucre, pc),
    })
    .select(SELECT)
    .single();
  if (error) {
    throw new Error(`DB_CREATE_FAIL: ${error.message}`);
  }
  return mapRow(data as TipoMesaRow);
}

export async function actualizarTipoMesa(
  id: number,
  input: TipoMesaUpdate,
  usumod: string,
  pc = '',
): Promise<TipoMesa | null> {
  const patch: Record<string, unknown> = { ...updateAudit(usumod, pc) };
  if (input.nombre !== undefined) {
    patch['descripcion'] = input.nombre;
  }
  if (input.cargoServicio !== undefined) {
    patch['cargo_servicio'] = input.cargoServicio;
  }
  if (input.estado !== undefined) {
    patch['estado'] = input.estado;
  }
  const { data, error } = await supabase
    .from('tipo_mesa')
    .update(patch)
    .eq('id_tipomesa', id)
    .select(SELECT)
    .maybeSingle();
  if (error) {
    throw new Error(`DB_UPDATE_FAIL: ${error.message}`);
  }
  return data ? mapRow(data as TipoMesaRow) : null;
}

export async function auditar(
  idUsuario: number,
  accion: string,
  idRegistro: number,
  valor: string,
): Promise<void> {
  const { error } = await supabase.from('auditoria').insert({
    id_usuario: idUsuario,
    n_tabla: 'TIPO_MESA',
    accion,
    id_registro: idRegistro,
    valor_nuevo: valor,
  });
  if (error) {
    throw new Error(`DB_AUDIT_FAIL: ${error.message}`);
  }
}
