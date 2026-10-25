import type { EstadoDelivery } from '@/shared/types/delivery';
import { ESTADO_LABELS, ESTADO_COLORS } from '@/shared/types/delivery';

export function DeliveryStatusBadge({ estado }: { estado: EstadoDelivery }) {
  const label = ESTADO_LABELS[estado] ?? String(estado).toUpperCase();
  const color = ESTADO_COLORS[estado] ?? 'y-chip bad';
  return <span className={color}>{label}</span>;
}