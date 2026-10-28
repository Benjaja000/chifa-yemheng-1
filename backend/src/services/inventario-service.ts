import type { MovimientoCreate, MovimientoQuery, RecetaCreate, RecetaQuery, RecetaUpdate } from '../schemas/inventario.js';
import { actualizarReceta, crearMovimiento, crearReceta, listarMovimientos, listarRecetas } from '../repositories/inventario-repository.js';
import { InventarioError } from '../models/inventario.js';

export async function listarMovimientosService(q: MovimientoQuery) {
  return listarMovimientos(q);
}
export async function crearMovimientoService(input: MovimientoCreate, usuarioId: number, usucre: string, pc?: string) {
  try {
    return await crearMovimiento(input, usuarioId, usucre, pc);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('PRODUCTO_INVALIDO')) throw new InventarioError('PRODUCTO_INVALIDO');
    if (msg.includes('STOCK_INSUFICIENTE')) throw new InventarioError('STOCK_INSUFICIENTE');
    throw err;
  }
}
export async function listarRecetasService(q: RecetaQuery) {
  return listarRecetas(q);
}
export async function crearRecetaService(input: RecetaCreate, usucre: string, pc?: string) {
  try {
    return await crearReceta(input, usucre, pc);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('INSUMO_INVALIDO')) throw new InventarioError('INSUMO_INVALIDO');
    if (msg.includes('PRODUCTO_INVALIDO')) throw new InventarioError('PRODUCTO_INVALIDO');
    throw err;
  }
}

export async function actualizarRecetaService(id: number, input: RecetaUpdate, usumod: string, pc?: string) {
  try {
    const receta = await actualizarReceta(id, input, usumod, pc);
    if (!receta) throw new InventarioError('NOT_FOUND');
    return receta;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('RECETA_DUPLICADA')) throw new InventarioError('RECETA_DUPLICADA');
    if (msg.includes('PRODUCTO_INVALIDO')) throw new InventarioError('PRODUCTO_INVALIDO');
    if (msg.includes('INSUMO_INVALIDO')) throw new InventarioError('INSUMO_INVALIDO');
    throw err;
  }
}
