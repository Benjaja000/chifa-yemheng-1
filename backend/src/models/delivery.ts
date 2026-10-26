/** Tipos del módulo delivery (PEDIDO_DELIVERY). */
export type EstadoDelivery = 'P' | 'R' | 'E' | 'C';

export interface Delivery {
  id: number;
  pedidoId: number;
  distritoId: number | null;
  distrito: string | null;
  direccion: string;
  referencia: string | null;
  telefono: string | null;
  repartidorId: number | null;
  repartidor: string | null;
  costo: number;
  estado: EstadoDelivery;
  fechaCreacion: string;
}

export interface DeliveryLista {
  data: Delivery[];
  page: number;
  limit: number;
  total: number;
}

export type DeliveryErrorCode = 'NOT_FOUND' | 'PEDIDO_INVALIDO' | 'VALIDATION_ERROR' | 'FUERA_DE_COBERTURA';

export class DeliveryError extends Error {
  readonly code: DeliveryErrorCode;

  constructor(code: DeliveryErrorCode) {
    super(code);
    this.code = code;
  }
}
