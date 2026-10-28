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
  costoConfirmado?: boolean;
  estado: EstadoDelivery;
  fechaCreacion: string;
  fechaSalida?: string | null;
  fechaEntrega?: string | null;
  fechaUbicacion?: string | null;
  latCliente?: number | null;
  lngCliente?: number | null;
  latRepartidor?: number | null;
  lngRepartidor?: number | null;
  nombreCliente?: string | null;
  totalPedido?: number;
  montoPagado?: number;
  montoPorCobrar?: number;
  metodoPago?: string | null;
}

export interface DeliveryLista {
  data: Delivery[];
  page: number;
  limit: number;
  total: number;
}

export type DeliveryErrorCode =
  | 'NOT_FOUND'
  | 'PEDIDO_INVALIDO'
  | 'VALIDATION_ERROR'
  | 'FUERA_DE_COBERTURA'
  | 'CLIENTE_NOT_FOUND'
  | 'DISTRITO_NOT_FOUND'
  | 'PRODUCTO_NO_DISPONIBLE'
  | 'AUTOSERVICIO_USER_NOT_READY';

export class DeliveryError extends Error {
  readonly code: DeliveryErrorCode;

  constructor(code: DeliveryErrorCode) {
    super(code);
    this.code = code;
  }
}
