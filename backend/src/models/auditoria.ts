/** Tipos del módulo auditoría (AUDITORIA). */
export type AccionAuditoria = 'INSERT' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'CAMBIO_CLAVE';

export interface Auditoria {
  id: number;
  usuarioId: number | null;
  usuario: string | null;
  tabla: string;
  accion: string;
  idRegistro: number | null;
  valorAnterior: string | null;
  valorNuevo: string | null;
  fecha: string;
  ip: string | null;
  terminal: string | null;
}

export interface AuditoriaLista {
  data: Auditoria[];
  page: number;
  limit: number;
  total: number;
}

export type AuditoriaErrorCode = 'NOT_FOUND' | 'VALIDATION_ERROR';

export class AuditoriaError extends Error {
  readonly code: AuditoriaErrorCode;

  constructor(code: AuditoriaErrorCode) {
    super(code);
    this.code = code;
  }
}
