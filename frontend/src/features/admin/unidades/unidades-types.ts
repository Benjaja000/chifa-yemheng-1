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

export interface UnidadForm {
  nombre: string;
  abreviatura: string;
  codigoSunat: string;
  estado: EstadoRegistro;
}
