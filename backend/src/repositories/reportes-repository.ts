import { supabase } from '../config/supabase.js';
import type { ArqueoCaja, ProductoMasVendido, VentaDiaria } from '../models/reportes.js';
import type { ReportesArqueoQuery, ReportesProductosQuery, ReportesVentasQuery } from '../schemas/reportes.js';

interface VentaDiariaRow {
  fecha: string;
  tipodocumento: string;
  n_comprobantes: number;
  subtotal: number;
  igv: number;
  total: number;
}

interface ProductoMasVendidoRow {
  id_producto: number;
  n_producto: string;
  n_categoriaproducto: string;
  cantidad_vendida: number;
  importe_vendido: number;
}

interface ArqueoCajaRow {
  id_aperturacaja: number;
  n_caja: string;
  numero_turno: number;
  f_apertura: string;
  f_cierre: string | null;
  usuario_apertura: string;
  usuario_cierre: string | null;
  monto_inicial: number;
  total_ingresos: number;
  total_egresos: number;
  monto_sistema: number;
  monto_declarado: number;
  diferencia: number;
  situacion: string;
}

export async function ventasDiarias(q: ReportesVentasQuery): Promise<VentaDiaria[]> {
  let query = supabase.from('vw_ventas_diarias').select('*').order('fecha', { ascending: false });
  if (q.desde) query = query.gte('fecha', q.desde);
  if (q.hasta) query = query.lte('fecha', q.hasta);
  const { data, error } = await query;
  if (error) throw new Error(`DB_LIST_FAIL: ${error.message}`);
  return ((data ?? []) as unknown as VentaDiariaRow[]).map((r) => ({
    fecha: r.fecha,
    tipodocumento: r.tipodocumento,
    comprobantes: Number(r.n_comprobantes ?? 0),
    subtotal: Number(r.subtotal ?? 0),
    igv: Number(r.igv ?? 0),
    total: Number(r.total ?? 0),
  }));
}

export async function productosMasVendidos(q: ReportesProductosQuery): Promise<ProductoMasVendido[]> {
  let query = supabase
    .from('vw_productos_mas_vendidos')
    .select('*')
    .order('cantidad_vendida', { ascending: false })
    .limit(q.limit);
  const { data, error } = await query;
  if (error) throw new Error(`DB_LIST_FAIL: ${error.message}`);
  return ((data ?? []) as unknown as ProductoMasVendidoRow[]).map((r) => ({
    productoId: r.id_producto,
    producto: r.n_producto,
    categoria: r.n_categoriaproducto,
    cantidad: Number(r.cantidad_vendida ?? 0),
    total: Number(r.importe_vendido ?? 0),
  }));
}

export async function arqueoCaja(q: ReportesArqueoQuery): Promise<ArqueoCaja[]> {
  let query = supabase.from('vw_arqueo_caja').select('*').order('f_apertura', { ascending: false });
  if (q.desde) query = query.gte('f_apertura', q.desde);
  if (q.hasta) query = query.lte('f_apertura', `${q.hasta}T23:59:59`);
  const { data, error } = await query;
  if (error) throw new Error(`DB_LIST_FAIL: ${error.message}`);
  return ((data ?? []) as unknown as ArqueoCajaRow[]).map((r) => ({
    turnoId: r.id_aperturacaja,
    caja: r.n_caja,
    numeroTurno: Number(r.numero_turno ?? 0),
    fechaApertura: r.f_apertura,
    fechaCierre: r.f_cierre,
    usuarioApertura: r.usuario_apertura,
    usuarioCierre: r.usuario_cierre,
    montoInicial: Number(r.monto_inicial ?? 0),
    totalIngresos: Number(r.total_ingresos ?? 0),
    totalEgresos: Number(r.total_egresos ?? 0),
    montoSistema: Number(r.monto_sistema ?? 0),
    montoDeclarado: Number(r.monto_declarado ?? 0),
    diferencia: Number(r.diferencia ?? 0),
    situacion: r.situacion,
  }));
}
