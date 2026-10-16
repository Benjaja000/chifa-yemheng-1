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
  crearTipoMesa,
  existeDescripcion,
  listarTiposMesa,
  obtenerTipoMesa,
} from '../repositories/tipos-mesa-repository.js';

export function listarService(q: TipoMesaQuery): Promise<TipoMesaLista> {
  return listarTiposMesa(q);
}

export async function obtenerService(id: number): Promise<TipoMesa> {
  const tipo = await obtenerTipoMesa(id);
  if (!tipo) {
    throw new TipoMesaError('NOT_FOUND');
  }
  return tipo;
}

export async function crearService(input: TipoMesaCreate, idUsuario: number, logeo: string, pc = ''): Promise<TipoMesa> {
  if (await existeDescripcion(input.descripcion)) {
    throw new TipoMesaError('YA_EXISTE');
  }
  const tipo = await crearTipoMesa(input, logeo, pc);
  await auditar(idUsuario, 'CREAR_TIPO_MESA', tipo.id, input.descripcion);
  return tipo;
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
  if (input.descripcion && input.descripcion.toLowerCase() !== actual.descripcion.toLowerCase()) {
    if (await existeDescripcion(input.descripcion, id)) {
      throw new TipoMesaError('YA_EXISTE');
    }
  }
  const tipo = await actualizarTipoMesa(id, input, logeo, pc);
  if (!tipo) {
    throw new TipoMesaError('NOT_FOUND');
  }
  await auditar(idUsuario, 'EDITAR_TIPO_MESA', id, tipo.descripcion);
  return tipo;
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
  if (input.estado === 'I' && !input.confirmar && actual.mesasAsociadas > 0) {
    throw new TipoMesaError('TIENE_MESAS', actual.mesasAsociadas);
  }
  const tipo = await actualizarTipoMesa(id, { estado: input.estado }, logeo, pc);
  if (!tipo) {
    throw new TipoMesaError('NOT_FOUND');
  }
  await auditar(
    idUsuario,
    input.estado === 'A' ? 'ACTIVAR_TIPO_MESA' : 'DESACTIVAR_TIPO_MESA',
    id,
    tipo.descripcion,
  );
  return tipo;
}
