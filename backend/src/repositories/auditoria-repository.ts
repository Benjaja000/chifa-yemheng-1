import { supabase } from '../config/supabase.js';
import type { Auditoria, AuditoriaLista } from '../models/auditoria.js';
import type { AuditoriaQuery } from '../schemas/auditoria.js';

interface AuditoriaRow {
  id_auditoria: number;
  id_usuario: number | null;
  usuario: { logeo: string } | null;
  n_tabla: string;
  accion: string;
  id_registro: number | null;
  valor_anterior: string | null;
  valor_nuevo: string | null;
  f_evento: string;
  ip: string | null;
  terminal: string | null;
}

const SELECT =
  'id_auditoria, id_usuario, usuario(logeo), n_tabla, accion, id_registro, valor_anterior, valor_nuevo, f_evento, ip, terminal';

function mapRow(row: AuditoriaRow): Auditoria {
  return {
    id: row.id_auditoria,
    usuarioId: row.id_usuario,
    usuario: row.usuario?.logeo ?? null,
    tabla: row.n_tabla,
    accion: row.accion,
    idRegistro: row.id_registro,
    valorAnterior: row.valor_anterior,
    valorNuevo: row.valor_nuevo,
    fecha: row.f_evento,
    ip: row.ip,
    terminal: row.terminal,
  };
}

export async function listarAuditoria(q: AuditoriaQuery): Promise<AuditoriaLista> {
  const desde = (q.page - 1) * q.limit;
  const hasta = desde + q.limit - 1;

  let query = supabase
    .from('auditoria')
    .select(SELECT, { count: 'exact' })
    .order('f_evento', { ascending: false })
    .order('id_auditoria', { ascending: false })
    .range(desde, hasta);

  if (q.usuarioId !== undefined) {
    query = query.eq('id_usuario', q.usuarioId);
  }
  if (q.tabla) {
    query = query.ilike('n_tabla', `%${q.tabla}%`);
  }
  if (q.accion) {
    query = query.eq('accion', q.accion);
  }
  if (q.desde) {
    query = query.gte('f_evento', q.desde);
  }
  if (q.hasta) {
    query = query.lte('f_evento', q.hasta);
  }

  const { data, error, count } = await query;
  if (error) {
    throw new Error(`DB_LIST_FAIL: ${error.message}`);
  }
  return {
    data: ((data ?? []) as unknown as AuditoriaRow[]).map(mapRow),
    page: q.page,
    limit: q.limit,
    total: count ?? 0,
  };
}
