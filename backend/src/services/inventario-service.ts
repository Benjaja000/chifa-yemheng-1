import type { MovimientoCreate, MovimientoQuery, RecetaCreate, RecetaQuery } from '../schemas/inventario.js';
import { crearMovimiento, crearReceta, listarMovimientos, listarRecetas } from '../repositories/inventario-repository.js';
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
    throw err;
  }
}
