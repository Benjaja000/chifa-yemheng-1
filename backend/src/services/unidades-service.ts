import type { Unidad, UnidadLista } from '../models/unidad.js';
import { UnidadError } from '../models/unidad.js';
import type { UnidadCreate, UnidadEstado, UnidadQuery, UnidadUpdate } from '../schemas/unidad.js';
import {
  actualizarUnidad,
  auditar,
  contarProductos,
  crearUnidad,
  existeNombre,
  listarUnidades,
  obtenerUnidad,
} from '../repositories/unidades-repository.js';

export function listarService(q: UnidadQuery): Promise<UnidadLista> {
  return listarUnidades(q);
}

export async function obtenerService(id: number): Promise<Unidad> {
  const u = await obtenerUnidad(id);
  if (!u) {
    throw new UnidadError('NOT_FOUND');
  }
  return u;
}

export async function crearService(
  input: UnidadCreate,
  idUsuario: number,
  logeo: string,
  pc = '',
): Promise<Unidad> {
  if (await existeNombre(input.nombre)) {
    throw new UnidadError('YA_EXISTE');
  }
  const u = await crearUnidad(input, logeo, pc);
  await auditar(idUsuario, 'CREAR_UNIDAD', u.id, u.nombre);
  return u;
}

export async function actualizarService(
  id: number,
  input: UnidadUpdate,
  idUsuario: number,
  logeo: string,
  pc = '',
): Promise<Unidad> {
  const actual = await obtenerUnidad(id);
  if (!actual) {
    throw new UnidadError('NOT_FOUND');
  }
  if (input.nombre && input.nombre.toLowerCase() !== actual.nombre.toLowerCase()) {
    if (await existeNombre(input.nombre, id)) {
      throw new UnidadError('YA_EXISTE');
    }
  }
  const u = await actualizarUnidad(id, input, logeo, pc);
  if (!u) {
    throw new UnidadError('NOT_FOUND');
  }
  await auditar(idUsuario, 'EDITAR_UNIDAD', id, u.nombre);
  return u;
}

export async function cambiarEstadoService(
  id: number,
  input: UnidadEstado,
  idUsuario: number,
  logeo: string,
  pc = '',
): Promise<Unidad> {
  const actual = await obtenerUnidad(id);
  if (!actual) {
    throw new UnidadError('NOT_FOUND');
  }
  if (input.estado === 'I' && !input.confirmar) {
    const n = await contarProductos(id);
    if (n > 0) {
      throw new UnidadError('PRODUCTOS_ASOCIADOS', n);
    }
  }
  const u = await actualizarUnidad(id, { estado: input.estado }, logeo, pc);
  if (!u) {
    throw new UnidadError('NOT_FOUND');
  }
  await auditar(
    idUsuario,
    input.estado === 'A' ? 'ACTIVAR_UNIDAD' : 'DESACTIVAR_UNIDAD',
    id,
    u.nombre,
  );
  return u;
}
