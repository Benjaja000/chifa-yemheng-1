import { supabase } from '../config/supabase.js';
import type { NotaCredito, NotaCreditoEmitida } from '../models/nota-credito.js';
import { NotaCreditoError } from '../models/nota-credito.js';

interface NotaCreditoRow {
  id_notacredito: number;
  id_venta: number;
  serie: string;
  numero: string;
  tipo_doc_referencia: string;
  serie_referencia: string;
  numero_referencia: string;
  motivo: string;
  monto: number | string;
  f_emision: string;
  estado_sunat: string | null;
}

const SELECT =
  'id_notacredito, id_venta, serie, numero, tipo_doc_referencia, serie_referencia, ' +
  'numero_referencia, motivo, monto, f_emision, estado_sunat';

function mapRow(row: NotaCreditoRow): NotaCredito {
  return {
    id: row.id_notacredito,
    idVenta: row.id_venta,
    serie: row.serie,
    numero: row.numero,
    tipoDocReferencia: row.tipo_doc_referencia,
    serieReferencia: row.serie_referencia,
    numeroReferencia: row.numero_referencia,
    motivo: row.motivo,
    monto: Number(row.monto ?? 0),
    fEmision: row.f_emision,
    estadoSunat: row.estado_sunat,
  };
}

/** Traduce el mensaje de la excepción PL/pgSQL a un código de error de API. */
function mapearError(mensaje: string): NotaCreditoError {
  const m = mensaje.toLowerCase();
  if (m.includes('inexistente')) {
    return new NotaCreditoError('VENTA_NO_EXISTE');
  }
  if (m.includes('ya esta anulada') || m.includes('inactiva')) {
    return new NotaCreditoError('VENTA_ANULADA');
  }
  if (m.includes('permiso')) {
    return new NotaCreditoError('SIN_PERMISO');
  }
  if (m.includes('motivo')) {
    return new NotaCreditoError('VALIDATION_ERROR');
  }
  if (m.includes('turno abierto')) {
    return new NotaCreditoError('NO_CAJA_ABIERTA');
  }
  if (m.includes('serie')) {
    return new NotaCreditoError('SERIE_NC_NO_DISPONIBLE');
  }
  return new NotaCreditoError('SERIE_NC_NO_DISPONIBLE');
}

export async function emitirNotaCredito(
  idVenta: number,
  idUsuario: number,
  motivo: string,
): Promise<NotaCreditoEmitida> {
  const { data, error } = await supabase.rpc('fn_anular_venta_con_nc', {
    p_id_venta: idVenta,
    p_usuario: idUsuario,
    p_motivo: motivo,
  });
  if (error) {
    throw mapearError(error.message);
  }
  const rows = (data as Record<string, unknown>[] | null) ?? [];
  if (rows.length === 0) {
    throw new NotaCreditoError('SERIE_NC_NO_DISPONIBLE');
  }
  const r = rows[0];
  return {
    idNc: Number(r['id_nc'] ?? 0),
    serie: String(r['serie'] ?? ''),
    numero: String(r['numero'] ?? ''),
    monto: Number(r['monto'] ?? 0),
    mensaje: String(r['mensaje'] ?? ''),
  };
}

export async function listarNotasPorVenta(idVenta: number): Promise<NotaCredito[]> {
  const { data, error } = await supabase
    .from('nota_credito')
    .select(SELECT)
    .eq('id_venta', idVenta)
    .order('id_notacredito', { ascending: false });
  if (error) {
    throw new Error(`DB_LIST_NC_FAIL: ${error.message}`);
  }
  return ((data ?? []) as unknown as NotaCreditoRow[]).map(mapRow);
}
