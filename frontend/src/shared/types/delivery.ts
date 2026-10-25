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
  estado: EstadoDelivery;
  fechaCreacion: string;
}