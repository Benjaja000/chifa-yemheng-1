/** Tipos del módulo identidad (proxy Factiliza RENIEC/SUNAT vía maestros). */

/** Ubicación descriptiva devuelta por la fuente oficial (solo referencia, no se guarda). */
export interface UbicacionOficial {
  departamento?: string;
  provincia?: string;
  distrito?: string;
}

export interface DniNormalizado extends UbicacionOficial {
  tipo: 'DNI';
  numero: string;
  nombres: string;
  apPaterno: string;
  apMaterno: string;
  fNacimiento?: string;
  genero?: 'M' | 'F';
  direccion?: string;
  /** Código SUNAT de 6 dígitos; manda sobre `ubigeo_reniec`. */
  ubigeo?: string;
}

export interface RucNormalizado extends UbicacionOficial {
  tipo: 'RUC';
  numero: string;
  razonSocial: string;
  direccion?: string;
  tipoContribuyente?: string;
  /** Código SUNAT de 6 dígitos. */
  ubigeo?: string;
  estado: string;
  condicion: string;
  /** true solo si estado==='ACTIVO' && condicion==='HABIDO'. No bloquea, solo avisa. */
  habilitado: boolean;
}

export interface DistritoMatch {
  id: number;
  nombre: string;
  /** Cadena de ubicación (para preseleccionar dep/prov/dist en cadena). */
  provinciaId: number;
  provinciaNombre: string;
  departamentoId: number;
  departamentoNombre: string;
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
