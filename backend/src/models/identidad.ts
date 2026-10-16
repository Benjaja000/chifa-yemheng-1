/** Tipos del módulo identidad (proxy Factiliza RENIEC/SUNAT vía maestros). */

export interface DniNormalizado {
  tipo: 'DNI';
  numero: string;
  nombres: string;
  apPaterno: string;
  apMaterno: string;
  fNacimiento?: string;
  genero?: 'M' | 'F';
  ubigeo?: string;
}

export interface RucNormalizado {
  tipo: 'RUC';
  numero: string;
  razonSocial: string;
  direccion?: string;
  ubigeo?: string;
  estado: string;
  condicion: string;
  /** true solo si estado==='ACTIVO' && condicion==='HABIDO'. No bloquea, solo avisa. */
  habilitado: boolean;
}

export interface DistritoMatch {
  id: number;
  nombre: string;
}

export type IdentidadErrorCode =
  | 'VALIDATION_ERROR'
  | 'DOCUMENTO_NO_ENCONTRADO'
  | 'IDENTIDAD_NO_DISPONIBLE'
  | 'IDENTIDAD_NO_CONFIGURADA';

export class IdentidadError extends Error {
  readonly code: IdentidadErrorCode;

  constructor(code: IdentidadErrorCode) {
    super(code);
    this.code = code;
  }
}
