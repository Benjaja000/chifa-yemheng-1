import { supabase } from '../config/supabase.js';

export interface Maestro {
  id: number;
  nombre: string;
  area?: string | null;
  abreviatura?: string | null;
}

async function listar(
  tabla: string,
  idCol: string,
  nombreCol: string,
  extra?: string,
): Promise<Maestro[]> {
  const cols = extra ? `${idCol}, ${nombreCol}, ${extra}` : `${idCol}, ${nombreCol}`;
  const { data, error } = await supabase
    .from(tabla)
    .select(cols)
    .eq('estado', 'A')
    .order(idCol, { ascending: true });
  if (error) {
    throw new Error(`DB_LIST_FAIL: ${error.message}`);
  }
  return ((data ?? []) as unknown as Record<string, unknown>[]).map((r) => ({
    id: Number(r[idCol]),
    nombre: String(r[nombreCol] ?? ''),
    ...(extra === 'area' ? { area: (r['area'] as string | null) ?? null } : {}),
    ...(extra === 'abreviatura'
      ? { abreviatura: (r['abreviatura'] as string | null) ?? null }
      : {}),
  }));
}

/** Departamentos con estado A. */
export async function listarDepartamentos(): Promise<any[]> {
  const { data, error } = await supabase
    .from('departamento')
    .select('id_departamento, n_departamento')
    .eq('estado', 'A')
    .order('id_departamento', { ascending: true });
  if (error) throw new Error(`DB_LIST_FAIL: ${error.message}`);
  return (data ?? []).map((r: any) => ({
    id_departamento: r.id_departamento,
    d_departamento: r.n_departamento,
  }));
}

/** Provincias con estado A filtradas por departamento. */
export async function listarProvincias(idDepartamento: number): Promise<any[]> {
  const { data, error } = await supabase
    .from('provincia')
    .select('id_provincia, n_provincia')
    .eq('estado', 'A')
    .eq('id_departamento', idDepartamento)
    .order('id_provincia', { ascending: true });
  if (error) throw new Error(`DB_LIST_FAIL: ${error.message}`);
  return (data ?? []).map((r: any) => ({
    id_provincia: r.id_provincia,
    d_provincia: r.n_provincia,
    id_departamento: idDepartamento,
  }));
}

/** Distritos con estado A (opcionalmente filtrados por provincia). */
export async function listarDistritos(idProvincia?: number): Promise<any[]> {
  let query = supabase
    .from('distrito')
    .select('id_distrito, d_distrito, id_provincia')
    .eq('estado', 'A')
    .order('id_distrito', { ascending: true });
  if (idProvincia !== undefined) {
    query = query.eq('id_provincia', idProvincia);
  }
  const { data, error } = await query;
  if (error) throw new Error(`DB_LIST_FAIL: ${error.message}`);
  return data ?? [];
}

/** Cargos con estado A (los reales de BD, sin inventados). */
export function listarCargos(): Promise<Maestro[]> {
  return listar('cargo', 'id_cargo', 'n_cargo', 'area');
}

/** Contratos con estado A. */
export function listarContratos(): Promise<Maestro[]> {
  return listar('contrato', 'id_contrato', 'n_contrato');
}

/** Tipos de identidad con estado A (DNI/RUC/CE/PAS). */
export function listarTiposIdentidad(): Promise<Maestro[]> {
  return listar('tipo_identidad', 'id_tipoidentidad', 'n_tipoidentidad', 'abreviatura');
}
