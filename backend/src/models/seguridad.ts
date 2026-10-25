/** Tipos del módulo seguridad (USUARIO, ROL, PERMISO). */
export type EstadoRegistro = 'A' | 'I';

export interface Usuario {
  id: number;
  logeo: string;
  tipo: string;
  empleadoId: number | null;
  empleado: string | null;
  bloqueado: string;
  intentos: number;
  estado: EstadoRegistro;
  fechaCreacion: string;
}

export interface Rol {
  id: number;
  nombre: string;
  descripcion: string | null;
  estado: EstadoRegistro;
}

export interface Permiso {
  id: number;
  modulo: string;
  moduloId: number;
  nombre: string;
  clave: string;
  descripcion: string | null;
  estado: EstadoRegistro;
}

export interface UsuarioLista {
  data: Usuario[];
  page: number;
  limit: number;
  total: number;
}

export interface RolLista {
  data: Rol[];
  page: number;
  limit: number;
  total: number;
}

export interface PermisoLista {
  data: Permiso[];
  page: number;
  limit: number;
  total: number;
}

export type SeguridadErrorCode = 'NOT_FOUND' | 'YA_EXISTE' | 'TIPO_INVALIDO' | 'VALIDATION_ERROR';

export class SeguridadError extends Error {
  readonly code: SeguridadErrorCode;

  constructor(code: SeguridadErrorCode) {
    super(code);
    this.code = code;
  }
}
