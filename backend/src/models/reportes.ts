/** Tipos del módulo reportes (views VW_*). */
export interface VentaDiaria {
  fecha: string;
  tipodocumento: string;
  comprobantes: number;
  subtotal: number;
  igv: number;
  total: number;
}

export interface ProductoMasVendido {
  productoId: number;
  producto: string;
  categoria: string;
  cantidad: number;
  total: number;
}

export interface ArqueoCaja {
  turnoId: number;
  caja: string;
  numeroTurno: number;
  fechaApertura: string;
  fechaCierre: string | null;
  usuarioApertura: string;
  usuarioCierre: string | null;
  montoInicial: number;
  totalIngresos: number;
  totalEgresos: number;
  montoSistema: number;
  montoDeclarado: number;
  diferencia: number;
  situacion: string;
}

export interface ReportesLista<T> {
  data: T[];
  total: number;
}

export type ReportesErrorCode = 'NOT_FOUND' | 'VALIDATION_ERROR';

export class ReportesError extends Error {
  readonly code: ReportesErrorCode;

  constructor(code: ReportesErrorCode) {
    super(code);
    this.code = code;
  }
}
