import type { Maestro } from '../repositories/maestros-repository.js';
import {
  listarCargos,
  listarContratos,
  listarDistritos,
  listarDepartamentos,
  listarProvincias,
  listarTiposIdentidad,
} from '../repositories/maestros-repository.js';

/** Listas maestras vivas para formularios (cero constantes en frontend). */
export async function departamentosService(): Promise<any[]> {
  return listarDepartamentos();
}

export async function provinciasService(idDepartamento: number): Promise<any[]> {
  return listarProvincias(idDepartamento);
}

export async function distritosService(idProvincia?: number): Promise<any[]> {
  return listarDistritos(idProvincia);
}

export function cargosService(): Promise<Maestro[]> {
  return listarCargos();
}

export function contratosService(): Promise<Maestro[]> {
  return listarContratos();
}

export function tiposIdentidadService(): Promise<Maestro[]> {
  return listarTiposIdentidad();
}
