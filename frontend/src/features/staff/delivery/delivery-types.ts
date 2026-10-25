export type EstadoDelivery = 'P' | 'R' | 'E' | 'C';

export interface Delivery {
  id: number;
  pedidoId: number;
  distrito: string | null;
  direccion: string;
  referencia: string | null;
  telefono: string | null;
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

export const ESTADO_DELIVERY: Record<EstadoDelivery, string> = {
  P: 'Pendiente',
  R: 'Asignado',
  E: 'En camino',
  C: 'Entregado',
};
