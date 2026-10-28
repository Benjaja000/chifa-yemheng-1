import { supabase } from '../config/supabase.js';
import type { FnLoginResult, PermisoEfectivo } from '../models/auth.js';

/**
 * Acceso a auth via wrappers JSON (HTTPS). Nunca pg directo:
 * el puerto 5432/6543 expira desde esta red.
 */
export async function rpcLogin(logeo: string, clave: string): Promise<FnLoginResult> {
  const { data, error } = await supabase.rpc('fn_login', {
    p_logeo: logeo,
    p_clave: clave,
  });
  if (error) {
    throw new Error(`DB_LOGIN_FAIL: ${error.message}`);
  }
  return data as FnLoginResult;
}

export async function rpcPermisos(idUsuario: number): Promise<PermisoEfectivo[]> {
  const { data, error } = await supabase.rpc('fn_permisos_usuario', {
    p_id_usuario: idUsuario,
  });
  if (error) {
    throw new Error(`DB_PERMISOS_FAIL: ${error.message}`);
  }
  return (data ?? []) as PermisoEfectivo[];
}

export interface EstadoSesion {
  authVersion: number;
  estado: string;
  bloqueado: string;
  empleado: { id: number; estado: string; f_cese: string | null } | null;
}

export async function leerEstadoSesion(idUsuario: number): Promise<EstadoSesion | null> {
  const { data, error } = await supabase
    .from('usuario')
    .select('auth_version, estado, bloqueado, empleado(id_empleado, estado, f_cese)')
    .eq('id_usuario', idUsuario)
    .maybeSingle();
  if (error) {
    throw new Error(`DB_SESSION_STATE_FAIL: ${error.message}`);
  }
  if (!data) {
    return null;
  }
  const row = data as unknown as {
    auth_version: number;
    estado: string;
    bloqueado: string;
    empleado: { id_empleado: number; estado: string; f_cese: string | null } | null;
  };
  return {
    authVersion: Number(row.auth_version),
    estado: row.estado,
    bloqueado: row.bloqueado,
    empleado: row.empleado
      ? { id: Number(row.empleado.id_empleado), estado: row.empleado.estado, f_cese: row.empleado.f_cese }
      : null,
  };
}

export async function rpcCambiarClave(
  idUsuario: number,
  actual: string,
  nueva: string,
): Promise<{ ok: boolean; mensaje: string }> {
  const { data, error } = await supabase.rpc('fn_cambiar_clave', {
    p_id_usuario: idUsuario,
    p_actual: actual,
    p_nueva: nueva,
  });
  if (error) {
    throw new Error(`DB_CLAVE_FAIL: ${error.message}`);
  }
  return data as { ok: boolean; mensaje: string };
}

/** Lectura fina para distinguir INACTIVO de inexistente (solo código de error). */
export async function leerEstadoUsuario(
  logeo: string,
): Promise<{ existe: boolean; bloqueado: boolean; inactivo: boolean }> {
  const { data, error } = await supabase
    .from('usuario')
    .select('estado, bloqueado, empleado(estado, f_cese)')
    .eq('logeo', logeo)
    .maybeSingle();
  if (error || !data) {
    return { existe: false, bloqueado: false, inactivo: false };
  }
  const row = data as unknown as {
    estado: string;
    bloqueado: string;
    empleado: { estado: string; f_cese: string | null } | null;
  };
  return {
    existe: true,
    bloqueado: row.bloqueado === 'S',
    inactivo:
      row.estado === 'I' ||
      row.estado === 'E' ||
      row.empleado?.estado !== 'A' ||
      (row.empleado.f_cese !== null && row.empleado.f_cese <= new Date().toISOString().slice(0, 10)),
  };
}
