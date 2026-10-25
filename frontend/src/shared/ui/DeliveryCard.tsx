import type { DeliveryShared } from '@/shared/types/delivery';
import { DeliveryStatusBadge } from './DeliveryStatusBadge';

interface DeliveryCardProps {
  delivery: DeliveryShared;
  showRepartidor?: boolean;
  showTiempos?: boolean;
  onVer?: () => void;
  onAnular?: () => void;
  onDespachar?: () => void;
  onEntregar?: () => void;
}

export function DeliveryCard({
  delivery,
  showRepartidor = true,
  showTiempos = true,
}: DeliveryCardProps) {
  const tiempoEnEstado = showTiempos && delivery.estado !== 'P'
    ? delivery.estado === 'R'
      ? 'Desde: ' + new Date().toLocaleTimeString()
      : delivery.estado === 'E'
        ? 'Entregado' : '' : '';

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-[#F5F5F5]">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-[#F5F5F5] flex items-center justify-center flex-shrink-0">
          <span className="text-xl font-bold">{delivery.id.toString().slice(-2)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 line-clamp-1">
            {delivery.direccion}
          </div>
          {delivery.referencia && (
            <div className="text-sm text-gray-500 line-clamp-1 mt-1">
              {delivery.referencia}
            </div>
          )}
          {showRepartidor && delivery.repartidor && (
            <div className="text-xs text-gray-500 line-clamp-1 mt-2">
              Repartidor: {delivery.repartidor}
            </div>
          )}
        </div>
      </div>

      {showTiempos && tiempoEnEstado && (
        <div className="mt-3 text-xs text-gray-500">
          {tiempoEnEstado}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div>
          <DeliveryStatusBadge estado={delivery.estado} />
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-500">#{delivery.pedidoId}</span>
        </div>
      </div>
    </div>
  );
}