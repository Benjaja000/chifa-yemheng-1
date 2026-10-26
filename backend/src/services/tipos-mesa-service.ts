import type { TipoMesa, TipoMesaLista } from '../models/tipo-mesa.js';
import { TipoMesaError } from '../models/tipo-mesa.js';
import type {
  TipoMesaCreate,
  TipoMesaEstado,
  TipoMesaQuery,
  TipoMesaUpdate,
} from '../schemas/tipo-mesa.js';
import {
  actualizarTipoMesa,
  auditar,
  contarMesas,
  crearTipoMesa,
  existeNombre,
  listarTiposMesa,
  obtenerTipoMesa,
} from '../repositories/tipos-mesa-repository.js';

export function listarService(q: TipoMesaQuery): Promise<TipoMesaLista> {
  return listarTiposMesa(q);
}

export async function obtenerService(id: number): Promise<TipoMesa> {
  const t = await obtenerTipoMesa(id);
  if (!t) {
    throw new TipoMesaError('NOT_FOUND');
  }
  return t;
}

export async function crearService(
  input: TipoMesaCreate,
  idUsuario: number,
  logeo: string,
  pc = '',
): Promise<TipoMesa> {
  if (await existeNombre(input.nombre)) {
    throw new TipoMesaError('YA_EXISTE');
  }
  const t = await crearTipoMesa(input, logeo, pc);
  await auditar(idUsuario, 'CREAR_TIPO_MESA', t.id, t.nombre);
  return t;
}

export async function actualizarService(
  id: number,
  input: TipoMesaUpdate,
  idUsuario: number,
  logeo: string,
  pc = '',
): Promise<TipoMesa> {
  const actual = await obtenerTipoMesa(id);
  if (!actual) {
    throw new TipoMesaError('NOT_FOUND');
  }
  if (input.nombre && input.nombre.toLowerCase() !== actual.nombre.toLowerCase()) {
    if (await existeNombre(input.nombre, id)) {
      throw new TipoMesaError('YA_EXISTE');
    }
  }
  const t = await actualizarTipoMesa(id, input, logeo, pc);
  if (!t) {
    throw new TipoMesaError('NOT_FOUND');
  }
  await auditar(idUsuario, 'EDITAR_TIPO_MESA', id, t.nombre);
  return t;
}

export async function cambiarEstadoService(
  id: number,
  input: TipoMesaEstado,
  idUsuario: number,
  logeo: string,
  pc = '',
): Promise<TipoMesa> {
  const actual = await obtenerTipoMesa(id);
  if (!actual) {
    throw new TipoMesaError('NOT_FOUND');
  }
  if (input.estado === 'I' && !input.confirmar) {
    const n = await contarMesas(id);
    if (n > 0) {
      throw new TipoMesaError('MESAS_ASOCIADAS', n);
    }
  }
  const t = await actualizarTipoMesa(id, { estado: input.estado }, logeo, pc);
  if (!t) {
    throw new TipoMesaError('NOT_FOUND');
  }
  await auditar(
    idUsuario,
    input.estado === 'A' ? 'ACTIVAR_TIPO_MESA' : 'DESACTIVAR_TIPO_MESA',
    id,
    t.nombre,
  );
  return t;
}
