export type EstadoDelivery = 'P' | 'R' | 'E' | 'C';

export const ESTADO_LABELS: Record<EstadoDelivery, string> = {
  P: 'Pendiente', R: 'En ruta', E: 'Entregado', C: 'Cancelado'
};

export const ESTADO_COLORS: Record<EstadoDelivery, string> = {
  P: 'y-chip warn', R: 'y-chip warn', E: 'y-chip ok', C: 'y-chip bad'
};

export const METODOS_PAGO = ['EFECTIVO', 'YAPE', 'PLIN', 'TARJETA', 'TRANSFERENCIA'] as const;
export const METODOS_DIGITALES = ['YAPE', 'PLIN', 'TARJETA', 'TRANSFERENCIA'] as const;

export interface DeliveryShared {
  id: number;
  pedidoId: number;
  distrito: string | null;
  direccion: string;
  referencia: string | null;
  telefono: string | null;
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

export interface DeliveryListaShared {
  data: DeliveryShared[];
  page: number;
  limit: number;
  total: number;
}

export interface PorRendirShared {
  idPedidoDelivery: number;
  pedidoId: number;
  cliente: string;
  direccion: string;
  total: number;
  metodoPago: string;
  fechaEntrega: string;
  estadoRendicion: 'P';
}