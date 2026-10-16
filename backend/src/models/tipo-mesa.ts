/** Tipos del módulo tipos de mesa (TIPO_MESA). */
export type EstadoRegistro = 'A' | 'I';

export interface TipoMesa {
  id: number;
  descripcion: string;
  cargoServicio: number;
  estado: EstadoRegistro;
  mesasAsociadas: number;
  fCreacion: string;
}

export interface TipoMesaLista {
  data: TipoMesa[];
  page: number;
  limit: number;
  total: number;
}

export type TipoMesaErrorCode =
  | 'YA_EXISTE'
  | 'NOT_FOUND'
  | 'TIENE_MESAS'
  | 'VALIDATION_ERROR';

export class TipoMesaError extends Error {
  readonly code: TipoMesaErrorCode;
  readonly mesasAsociadas?: number;

  constructor(code: TipoMesaErrorCode, mesasAsociadas?: number) {
    super(code);
    this.code = code;
    this.mesasAsociadas = mesasAsociadas;
  }
}
