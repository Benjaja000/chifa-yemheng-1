import type { AsignarPermisos, RolCreate, RolQuery, UsuarioCreate, UsuarioQuery, UsuarioUpdate } from '../schemas/seguridad.js';
import {
  actualizarUsuario,
  asignarPermisosRol,
  crearRol,
  crearUsuario,
  listarPermisos,
  listarRoles,
  listarUsuarios,
} from '../repositories/seguridad-repository.js';
import { SeguridadError } from '../models/seguridad.js';

export async function listarUsuariosService(q: UsuarioQuery) {
  return listarUsuarios(q);
}
export async function crearUsuarioService(input: UsuarioCreate, usucre: string, pc?: string) {
  try {
    return await crearUsuario(input, usucre, pc);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('YA_EXISTE')) throw new SeguridadError('YA_EXISTE');
    if (msg.includes('TIPO_INVALIDO')) throw new SeguridadError('TIPO_INVALIDO');
    throw err;
  }
}
export async function actualizarUsuarioService(id: number, input: UsuarioUpdate, usumod: string, pc?: string) {
  const result = await actualizarUsuario(id, input, usumod, pc);
  if (!result) throw new SeguridadError('NOT_FOUND');
  return result;
}
export async function listarRolesService(q: RolQuery) {
  return listarRoles(q);
}
export async function crearRolService(input: RolCreate, usucre: string, pc?: string) {
  return crearRol(input, usucre, pc);
}
export async function listarPermisosService() {
  return listarPermisos();
}
export async function asignarPermisosService(rolId: number, input: AsignarPermisos, usumod: string, pc?: string) {
  return asignarPermisosRol(rolId, input.permisoIds, usumod, pc);
}
