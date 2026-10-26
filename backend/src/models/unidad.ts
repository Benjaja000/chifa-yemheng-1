/** Tipos del módulo unidades de medida (unidad_medida). */
export type EstadoRegistro = 'A' | 'I';

export interface Unidad {
  id: number;
  nombre: string;
  abreviatura: string;
  codigoSunat: string | null;
  estado: EstadoRegistro;
}

export interface UnidadLista {
  data: Unidad[];
  page: number;
  limit: number;
  total: number;
}

export type UnidadErrorCode =
  | 'YA_EXISTE'
  | 'NOT_FOUND'
  | 'PRODUCTOS_ASOCIADOS'
  | 'VALIDATION_ERROR';

export class UnidadError extends Error {
  readonly code: UnidadErrorCode;
  readonly productosAsociados?: number;

  constructor(code: UnidadErrorCode, productosAsociados?: number) {
    super(code);
    this.code = code;
    this.productosAsociados = productosAsociados;
  }
}
