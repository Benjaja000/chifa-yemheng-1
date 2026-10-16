import { supabase } from '../config/supabase.js';
import type { TipoMesa, TipoMesaLista } from '../models/tipo-mesa.js';
import type { TipoMesaCreate, TipoMesaQuery, TipoMesaUpdate } from '../schemas/tipo-mesa.js';
import { createAudit, updateAudit } from '../utils/auditoria.js';

interface TipoMesaRow {
  id_tipomesa: number;
  descripcion: string;
  cargo_servicio: number | string;
  f_creacion: string;
  estado: string;
}

const SELECT_COLS =
  'id_tipomesa, descripcion, cargo_servicio, f_creacion, estado';

function mapRow(row: TipoMesaRow, mesasAsociadas: number): TipoMesa {
  return {
    id: row.id_tipomesa,
    descripcion: row.descripcion,
    cargoServicio: Number(row.cargo_servicio ?? 0),
    estado: (row.estado ?? 'A') as TipoMesa['estado'],
    mesasAsociadas,
    fCreacion: row.f_creacion,
  };
}

async function contarMesas(idTipo: number): Promise<number> {
  const { count, error } = await supabase
    .from('mesa')
    .select('id_mesa', { count: 'exact', head: true })
    .eq('id_tipomesa', idTipo);
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
    .select(SELECT_COLS, { count: 'exact' })
    .order('f_creacion', { ascending: false })
    .order('id_tipomesa', { ascending: false })
    .range(desde, hasta);

  if (q.nombre) {
    query = query.ilike('descripcion', `%${q.nombre}%`);
  }
  if (q.estado) {
    query = query.eq('estado', q.estado);
  }

  const { data, error, count } = await query;
  if (error) {
    throw new Error(`DB_LIST_FAIL: ${error.message}`);
  }
  const rows = (data ?? []) as TipoMesaRow[];
  const data2: TipoMesa[] = [];
  for (const row of rows) {
    data2.push(mapRow(row, await contarMesas(row.id_tipomesa)));
  }
  return { data: data2, page: q.page, limit: q.limit, total: count ?? 0 };
}

export async function obtenerTipoMesa(id: number): Promise<TipoMesa | null> {
  const { data, error } = await supabase
    .from('tipo_mesa')
    .select(SELECT_COLS)
    .eq('id_tipomesa', id)
    .maybeSingle();
  if (error) {
    throw new Error(`DB_GET_FAIL: ${error.message}`);
  }
  if (!data) {
    return null;
  }
  const row = data as TipoMesaRow;
  return mapRow(row, await contarMesas(row.id_tipomesa));
}

export async function existeDescripcion(descripcion: string, excluirId?: number): Promise<boolean> {
  let query = supabase
    .from('tipo_mesa')
    .select('id_tipomesa', { count: 'exact', head: true })
    .ilike('descripcion', descripcion);
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
      descripcion: input.descripcion,
      cargo_servicio: input.cargoServicio,
      estado: input.estado,
      ...createAudit(usucre, pc),
    })
    .select(SELECT_COLS)
    .single();
  if (error) {
    throw new Error(`DB_CREATE_FAIL: ${error.message}`);
  }
  const row = data as TipoMesaRow;
  return mapRow(row, 0);
}

export async function actualizarTipoMesa(
  id: number,
  input: TipoMesaUpdate,
  usumod: string,
  pc = '',
): Promise<TipoMesa | null> {
  const patch: Record<string, unknown> = { ...updateAudit(usumod, pc) };
  if (input.descripcion !== undefined) {
    patch['descripcion'] = input.descripcion;
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
    .select(SELECT_COLS)
    .maybeSingle();
  if (error) {
    throw new Error(`DB_UPDATE_FAIL: ${error.message}`);
  }
  if (!data) {
    return null;
  }
  const row = data as TipoMesaRow;
  return mapRow(row, await contarMesas(row.id_tipomesa));
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
