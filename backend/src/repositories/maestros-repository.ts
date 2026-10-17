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
    .order('feccre', { ascending: false })
    .order(idCol, { ascending: false });
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

/** Distritos con estado A (Ica + aledaños). */
export function listarDistritos(): Promise<Maestro[]> {
  return listar('distrito', 'id_distrito', 'd_distrito');
}

/** Departamentos con estado A (para cascada de ubicación). */
export function listarDepartamentos(): Promise<Maestro[]> {
  return listar('departamento', 'id_departamento', 'n_departamento');
}

/** Provincia con su departamento (para cascada de ubicación en frontend). */
export interface Provincia extends Maestro {
  departamentoId: number;
}

/** Provincias con estado A + FK a departamento. */
export async function listarProvincias(): Promise<Provincia[]> {
  const { data, error } = await supabase
    .from('provincia')
    .select('id_provincia, n_provincia, id_departamento')
    .eq('estado', 'A')
    .order('n_provincia');
  if (error) {
    throw new Error(`DB_LIST_FAIL: ${error.message}`);
  }
  return ((data ?? []) as unknown as Record<string, unknown>[]).map((r) => ({
    id: Number(r['id_provincia']),
    nombre: String(r['n_provincia'] ?? ''),
    departamentoId: Number(r['id_departamento']),
  }));
}

/** Distrito con su provincia (para derivar la cadena en frontend sin requests extra). */
export interface Distrito extends Maestro {
  provinciaId: number;
}

/** Distritos con estado A + FK a provincia. */
export async function listarDistritosConProvincia(): Promise<Distrito[]> {
  const { data, error } = await supabase
    .from('distrito')
    .select('id_distrito, d_distrito, id_provincia')
    .eq('estado', 'A')
    .order('d_distrito');
  if (error) {
    throw new Error(`DB_LIST_FAIL: ${error.message}`);
  }
  return ((data ?? []) as unknown as Record<string, unknown>[]).map((r) => ({
    id: Number(r['id_distrito']),
    nombre: String(r['d_distrito'] ?? ''),
    provinciaId: Number(r['id_provincia']),
  }));
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
