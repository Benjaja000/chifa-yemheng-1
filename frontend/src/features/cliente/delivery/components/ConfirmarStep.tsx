import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';

interface ConfirmarStepProps {
  items: Array<{ productoId: number; cantidad: number; precioUnit: number; nombre?: string; nota?: string }>;
  direccion: string;
  referencia: string;
  telefono: string;
  costoEnvio: number;
  onSubmit: () => void;
  onPrev: () => void;
  loading: boolean;
}

export function ConfirmarStep({
  items,
  direccion,
  referencia,
  telefono,
  costoEnvio,
  onSubmit,
  onPrev,
  loading,
}: ConfirmarStepProps) {
  const subtotal = items.reduce((sum, item) => sum + item.precioUnit * item.cantidad, 0);
  const total = subtotal + costoEnvio;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Resumen del pedido</h3>
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span>{item.cantidad}x {item.nombre ?? `Producto #${item.productoId}`}</span>
              <Badge variant="default">S/ {(item.precioUnit * item.cantidad).toFixed(2)}</Badge>
            </div>
          ))}
          <div className="border-t pt-2 space-y-1">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>S/ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Envío sugerido</span>
              <span>S/ {costoEnvio.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium text-lg border-t pt-2">
              <span>Total estimado</span>
              <span>S/ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Dirección de entrega</h3>
        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
          {direccion}
          {referencia && <p className="mt-2 mb-0 text-gray-500">Referencia: {referencia}</p>}
          <p className="mt-2 mb-0 text-gray-500">Teléfono de contacto: {telefono}</p>
        </div>
      </div>

      <div>
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Este paso solo registra tu pedido; no realiza un cobro. El equipo confirmará el costo final del envío y el pago se registrará al momento de la entrega.
        </p>
      </div>

      <div className="flex justify-between pt-4 border-t">
        <Button variant="secondary" onClick={onPrev} size="lg">Anterior</Button>
        <Button onClick={onSubmit} loading={loading} size="lg" className="w-full md:w-auto">
          {loading ? 'Enviando pedido...' : 'Solicitar delivery'}
        </Button>
      </div>
    </div>
  );
}