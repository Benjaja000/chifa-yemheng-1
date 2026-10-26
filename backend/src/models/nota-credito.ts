/** Tipos del módulo nota de crédito (NOTA_CREDITO + BR-RES-054/055/056). */
export interface NotaCredito {
  id: number;
  idVenta: number;
  serie: string;
  numero: string;
  tipoDocReferencia: string;
  serieReferencia: string;
  numeroReferencia: string;
  motivo: string;
  monto: number;
  fEmision: string;
  estadoSunat: string | null;
}

export interface NotaCreditoEmitida {
  idNc: number;
  serie: string;
  numero: string;
  monto: number;
  mensaje: string;
}

export type NotaCreditoErrorCode =
  | 'VENTA_NO_EXISTE'
  | 'VENTA_ANULADA'
  | 'NO_CAJA_ABIERTA'
  | 'SERIE_NC_NO_DISPONIBLE'
  | 'SIN_PERMISO'
  | 'VALIDATION_ERROR';

export class NotaCreditoError extends Error {
  readonly code: NotaCreditoErrorCode;

  constructor(code: NotaCreditoErrorCode) {
    super(code);
    this.code = code;
  }
}
