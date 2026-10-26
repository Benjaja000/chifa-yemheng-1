import { supabase } from '../config/supabase.js';
import type { Unidad, UnidadLista } from '../models/unidad.js';
import type { UnidadCreate, UnidadQuery, UnidadUpdate } from '../schemas/unidad.js';
import { createAudit, updateAudit } from '../utils/auditoria.js';

interface UnidadRow {
  id_unidad: number;
  n_unidad: string;
  abreviatura: string;
  codigo_sunat: string | null;
  estado: string;
}

const SELECT = 'id_unidad, n_unidad, abreviatura, codigo_sunat, estado';

function mapRow(row: UnidadRow): Unidad {
  return {
    id: row.id_unidad,
    nombre: row.n_unidad,
    abreviatura: row.abreviatura,
    codigoSunat: row.codigo_sunat,
    estado: (row.estado ?? 'A') as Unidad['estado'],
  };
}

export async function contarProductos(idUnidad: number): Promise<number> {
  const { count, error } = await supabase
    .from('producto')
    .select('id_producto', { count: 'exact', head: true })
    .eq('id_unidad', idUnidad);
  if (error) {
    throw new Error(`DB_COUNT_FAIL: ${error.message}`);
  }
  return count ?? 0;
}

export async function listarUnidades(q: UnidadQuery): Promise<UnidadLista> {
  const desde = (q.page - 1) * q.limit;
  const hasta = desde + q.limit - 1;

  let query = supabase
    .from('unidad_medida')
    .select(SELECT, { count: 'exact' })
    .order('n_unidad', { ascending: true })
    .range(desde, hasta);

  if (q.buscar) {
    query = query.ilike('n_unidad', `%${q.buscar}%`);
  }
  if (q.estado) {
    query = query.eq('estado', q.estado);
  }

  const { data, error, count } = await query;
  if (error) {
    throw new Error(`DB_LIST_FAIL: ${error.message}`);
  }
  return {
    data: ((data ?? []) as UnidadRow[]).map(mapRow),
    page: q.page,
    limit: q.limit,
    total: count ?? 0,
  };
}

export async function obtenerUnidad(id: number): Promise<Unidad | null> {
  const { data, error } = await supabase
    .from('unidad_medida')
    .select(SELECT)
    .eq('id_unidad', id)
    .maybeSingle();
  if (error) {
    throw new Error(`DB_GET_FAIL: ${error.message}`);
  }
  return data ? mapRow(data as UnidadRow) : null;
}

export async function existeNombre(nombre: string, excluirId?: number): Promise<boolean> {
  let query = supabase
    .from('unidad_medida')
    .select('id_unidad', { count: 'exact', head: true })
    .ilike('n_unidad', nombre);
  if (excluirId !== undefined) {
    query = query.neq('id_unidad', excluirId);
  }
  const { count, error } = await query;
  if (error) {
    throw new Error(`DB_EXISTS_FAIL: ${error.message}`);
  }
  return (count ?? 0) > 0;
}

export async function crearUnidad(
  input: UnidadCreate,
  usucre: string,
  pc = '',
): Promise<Unidad> {
  const { data, error } = await supabase
    .from('unidad_medida')
    .insert({
      n_unidad: input.nombre,
      abreviatura: input.abreviatura,
      codigo_sunat: input.codigoSunat ?? null,
      estado: input.estado,
      ...createAudit(usucre, pc),
    })
    .select(SELECT)
    .single();
  if (error) {
    throw new Error(`DB_CREATE_FAIL: ${error.message}`);
  }
  return mapRow(data as UnidadRow);
}

export async function actualizarUnidad(
  id: number,
  input: UnidadUpdate,
  usumod: string,
  pc = '',
): Promise<Unidad | null> {
  const patch: Record<string, unknown> = { ...updateAudit(usumod, pc) };
  if (input.nombre !== undefined) {
    patch['n_unidad'] = input.nombre;
  }
  if (input.abreviatura !== undefined) {
    patch['abreviatura'] = input.abreviatura;
  }
  if (input.codigoSunat !== undefined) {
    patch['codigo_sunat'] = input.codigoSunat;
  }
  if (input.estado !== undefined) {
    patch['estado'] = input.estado;
  }
  const { data, error } = await supabase
    .from('unidad_medida')
    .update(patch)
    .eq('id_unidad', id)
    .select(SELECT)
    .maybeSingle();
  if (error) {
    throw new Error(`DB_UPDATE_FAIL: ${error.message}`);
  }
  return data ? mapRow(data as UnidadRow) : null;
}

export async function auditar(
  idUsuario: number,
  accion: string,
  idRegistro: number,
  valor: string,
): Promise<void> {
  const { error } = await supabase.from('auditoria').insert({
    id_usuario: idUsuario,
    n_tabla: 'UNIDAD_MEDIDA',
    accion,
    id_registro: idRegistro,
    valor_nuevo: valor,
  });
  if (error) {
    throw new Error(`DB_AUDIT_FAIL: ${error.message}`);
  }
}
