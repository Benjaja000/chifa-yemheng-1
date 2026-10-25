import { supabase } from '../config/supabase.js';
import type { MovimientoCreate, MovimientoQuery, RecetaCreate, RecetaQuery } from '../schemas/inventario.js';
import type { MovimientoInventario, MovimientoLista, Receta } from '../models/inventario.js';
import { createAudit, updateAudit } from '../utils/auditoria.js';

interface MovimientoRow {
  id_movimientoinv: number;
  id_producto: number;
  producto: { n_producto: string } | null;
  tipo_movimiento: string;
  cantidad: number;
  costo_unitario: number;
  observacion: string | null;
  f_movimiento: string;
  id_usuario: number | null;
}

interface RecetaRow {
  id_receta: number;
  id_producto: number;
  producto: { n_producto: string } | null;
  id_insumo: number;
  insumo: { n_producto: string; unidad_medida: { n_unidad: string } | null } | null;
  cantidad: number;
}

const MOV_SELECT = 'id_movimientoinv, id_producto, producto(n_producto), tipo_movimiento, cantidad, costo_unitario, observacion, f_movimiento, id_usuario';
const RECETA_SELECT = 'id_receta, id_producto, producto!fk_receta_producto(n_producto), id_insumo, insumo:producto!fk_receta_insumo(n_producto, unidad_medida(n_unidad)), cantidad';

function mapMovimiento(row: MovimientoRow): MovimientoInventario {
  return {
    id: row.id_movimientoinv,
    productoId: row.id_producto,
    producto: row.producto?.n_producto ?? '',
    tipo: row.tipo_movimiento as MovimientoInventario['tipo'],
    cantidad: Number(row.cantidad ?? 0),
    costo: Number(row.costo_unitario ?? 0),
    motivo: row.observacion,
    fecha: row.f_movimiento,
    usuarioId: row.id_usuario,
  };
}

function mapReceta(row: RecetaRow): Receta {
  return {
    id: row.id_receta,
    productoId: row.id_producto,
    producto: row.producto?.n_producto ?? '',
    insumoId: row.id_insumo,
    insumo: row.insumo?.n_producto ?? '',
    cantidad: Number(row.cantidad ?? 0),
    unidad: row.insumo?.unidad_medida?.n_unidad ?? '',
  };
}

export async function listarMovimientos(q: MovimientoQuery): Promise<MovimientoLista> {
  const desde = (q.page - 1) * q.limit;
  const hasta = desde + q.limit - 1;

  let query = supabase
    .from('movimiento_inventario')
    .select(MOV_SELECT, { count: 'exact' })
    .order('f_movimiento', { ascending: false })
    .order('id_movimientoinv', { ascending: false })
    .range(desde, hasta);

  if (q.productoId) query = query.eq('id_producto', q.productoId);
  if (q.tipo) query = query.eq('tipo_movimiento', q.tipo);

  const { data, error, count } = await query;
  if (error) throw new Error(`DB_LIST_FAIL: ${error.message}`);
  return {
    data: ((data ?? []) as unknown as MovimientoRow[]).map(mapMovimiento),
    page: q.page,
    limit: q.limit,
    total: count ?? 0,
  };
}

export async function crearMovimiento(input: MovimientoCreate, usuarioId: number, usucre: string, pc = ''): Promise<MovimientoInventario> {
  // Obtener stock actual del producto
  const { data: prod, error: prodErr } = await supabase
    .from('producto')
    .select('stock_actual, controla_stock')
    .eq('id_producto', input.productoId)
    .maybeSingle();
  if (prodErr) throw new Error(`DB_PROD_FAIL: ${prodErr.message}`);
  if (!prod) throw new Error('PRODUCTO_INVALIDO');

  const stockActual = Number((prod as { stock_actual: number }).stock_actual ?? 0);

  // Calcular nuevo stock según tipo
  let nuevoStock = stockActual;
  if (input.tipo === 'E' || input.tipo === 'A') {
    nuevoStock = stockActual + input.cantidad;
  } else if (input.tipo === 'S' || input.tipo === 'M') {
    nuevoStock = Math.max(0, stockActual - input.cantidad);
  }

  // Insertar movimiento
  const { data, error } = await supabase
    .from('movimiento_inventario')
    .insert({
      id_producto: input.productoId,
      id_usuario: usuarioId,
      tipo_movimiento: input.tipo,
      cantidad: input.cantidad,
      stock_anterior: stockActual,
      stock_nuevo: nuevoStock,
      costo_unitario: input.costo,
      observacion: input.motivo || null,
      ...createAudit(usucre, pc),
    })
    .select(MOV_SELECT)
    .single();
  if (error) throw new Error(`DB_CREATE_FAIL: ${error.message}`);

  // Actualizar stock del producto
  await supabase
    .from('producto')
    .update({ stock_actual: nuevoStock, ...updateAudit(usucre, pc) })
    .eq('id_producto', input.productoId);

  return mapMovimiento(data as unknown as MovimientoRow);
}

export async function listarRecetas(q: RecetaQuery): Promise<{ data: Receta[]; page: number; limit: number; total: number }> {
  const desde = (q.page - 1) * q.limit;
  const hasta = desde + q.limit - 1;

  let query = supabase
    .from('receta')
    .select(RECETA_SELECT, { count: 'exact' })
    .order('id_receta', { ascending: false })
    .range(desde, hasta);

  if (q.productoId) query = query.eq('id_producto', q.productoId);

  const { data, error, count } = await query;
  if (error) throw new Error(`DB_LIST_FAIL: ${error.message}`);
  return {
    data: ((data ?? []) as unknown as RecetaRow[]).map(mapReceta),
    page: q.page,
    limit: q.limit,
    total: count ?? 0,
  };
}

export async function crearReceta(input: RecetaCreate, usucre: string, pc = ''): Promise<Receta> {
  // Verificar que el insumo existe
  const { data: insumo, error: insumoErr } = await supabase
    .from('producto')
    .select('id_producto')
    .eq('id_producto', input.insumoId)
    .maybeSingle();
  if (insumoErr) throw new Error(`DB_INSUMO_FAIL: ${insumoErr.message}`);
  if (!insumo) throw new Error('INSUMO_INVALIDO');

  const { data, error } = await supabase
    .from('receta')
    .insert({
      id_producto: input.productoId,
      id_insumo: input.insumoId,
      cantidad: input.cantidad,
      ...createAudit(usucre, pc),
    })
    .select(RECETA_SELECT)
    .single();
  if (error) throw new Error(`DB_CREATE_FAIL: ${error.message}`);
  return mapReceta(data as unknown as RecetaRow);
}
