import type { AsignarPermisos, RolCreate, RolQuery, UsuarioCreate, UsuarioQuery, UsuarioUpdate } from '../schemas/seguridad.js';
import type { SeguridadActor } from '../models/seguridad.js';
import {
  actualizarUsuario,
  asignarPermisosRol,
  guardarRol,
  crearUsuario,
  listarPermisos,
  listarRoles,
  listarUsuarios,
  listarTiposUsuario,
  listarPermisosDeRol,
} from '../repositories/seguridad-repository.js';
import { SeguridadError } from '../models/seguridad.js';

export async function listarUsuariosService(q: UsuarioQuery) {
  return listarUsuarios(q);
}
export async function listarTiposUsuarioService() {
  return listarTiposUsuario();
}
export async function crearUsuarioService(input: UsuarioCreate, actor: SeguridadActor, pc?: string) {
  try {
    return await crearUsuario(input, actor, pc);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('YA_EXISTE')) throw new SeguridadError('YA_EXISTE');
    if (msg.includes('TIPO_INVALIDO')) throw new SeguridadError('TIPO_INVALIDO');
    throw err;
  }
}
export async function actualizarUsuarioService(id: number, input: UsuarioUpdate, actor: SeguridadActor, pc?: string) {
  const result = await actualizarUsuario(id, input, actor, pc);
  if (!result) throw new SeguridadError('NOT_FOUND');
  return result;
}
export async function listarRolesService(q: RolQuery) {
  return listarRoles(q);
}
export async function guardarRolService(id: number | null, input: RolCreate, actor: SeguridadActor, pc?: string) {
  try {
    return await guardarRol(id, input, actor, pc);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('ROL_NO_ENCONTRADO')) throw new SeguridadError('NOT_FOUND');
    if (message.includes('PERMISO_INVALIDO')) throw new SeguridadError('PERMISO_INVALIDO');
    if (message.includes('PRIVILEGE_ESCALATION')) throw new SeguridadError('PRIVILEGE_ESCALATION');
    if (message.includes('FORBIDDEN')) throw new SeguridadError('FORBIDDEN');
    if (message.includes('ULTIMO_ADMINISTRADOR')) throw new SeguridadError('ULTIMO_ADMINISTRADOR');
    if (message.includes('MOTIVO_REQUERIDO')) throw new SeguridadError('MOTIVO_REQUERIDO');
    throw err;
  }
}
export async function listarPermisosService() {
  return listarPermisos();
}
export async function listarPermisosDeRolService(rolId: number) {
  return listarPermisosDeRol(rolId);
}
export async function asignarPermisosService(rolId: number, input: AsignarPermisos, actor: SeguridadActor, pc?: string) {
  try {
    return await asignarPermisosRol(rolId, input.permisoIds, input.motivo, actor, pc);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('ROL_NO_ENCONTRADO')) throw new SeguridadError('NOT_FOUND');
    if (message.includes('PERMISO_INVALIDO')) throw new SeguridadError('PERMISO_INVALIDO');
    if (message.includes('PRIVILEGE_ESCALATION')) throw new SeguridadError('PRIVILEGE_ESCALATION');
    if (message.includes('FORBIDDEN')) throw new SeguridadError('FORBIDDEN');
    if (message.includes('ULTIMO_ADMINISTRADOR')) throw new SeguridadError('ULTIMO_ADMINISTRADOR');
    if (message.includes('MOTIVO_REQUERIDO')) throw new SeguridadError('MOTIVO_REQUERIDO');
    throw err;
  }
}
