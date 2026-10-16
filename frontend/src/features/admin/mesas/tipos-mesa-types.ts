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

export interface TipoMesaForm {
  descripcion: string;
  cargoServicio: number;
  estado: EstadoRegistro;
}
