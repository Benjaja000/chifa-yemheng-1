/** Tipos del módulo tipos de mesa (tipo_mesa). */
export type EstadoRegistro = 'A' | 'I';

export interface TipoMesa {
  id: number;
  nombre: string;
  cargoServicio: number;
  estado: EstadoRegistro;
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
  | 'MESAS_ASOCIADAS'
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
