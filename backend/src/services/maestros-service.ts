import type { Distrito, Maestro, Provincia } from '../repositories/maestros-repository.js';
import {
  listarCargos,
  listarContratos,
  listarDepartamentos,
  listarDistritosConProvincia,
  listarProvincias,
  listarTiposIdentidad,
} from '../repositories/maestros-repository.js';

/** Listas maestras vivas para formularios (cero constantes en frontend). */
export function distritosService(): Promise<Distrito[]> {
  return listarDistritosConProvincia();
}

/** Departamentos activos (cascada de ubicación). */
export function departamentosService(): Promise<Maestro[]> {
  return listarDepartamentos();
}

/** Provincias activas con su departamento (cascada de ubicación). */
export function provinciasService(): Promise<Provincia[]> {
  return listarProvincias();
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
