import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';

interface ConfirmarStepProps {
  items: Array<{ productoId: number; cantidad: number; precioUnit: number; nombre?: string; nota?: string; descuento?: number }>;
  direccion: string;
  costoEnvio: number;
  metodoDigital: 'YAPE' | 'PLIN' | 'TARJETA' | 'TRANSFERENCIA';
  onMetodoChange: (metodo: 'YAPE' | 'PLIN' | 'TARJETA' | 'TRANSFERENCIA') => void;
  onSubmit: () => void;
  onPrev: () => void;
  loading: boolean;
}

const METODOS = [
  { value: 'YAPE', label: 'Yape', icon: '💜' },
  { value: 'PLIN', label: 'Plin', icon: '💚' },
  { value: 'TARJETA', label: 'Tarjeta', icon: '💳' },
  { value: 'TRANSFERENCIA', label: 'Transferencia', icon: '🏦' },
];

export function ConfirmarStep({ items, direccion, costoEnvio, metodoDigital, onMetodoChange, onSubmit, onPrev, loading }: ConfirmarStepProps) {
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
              <span>Envío</span>
              <span>S/ {costoEnvio.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium text-lg border-t pt-2">
              <span>Total</span>
              <span>S/ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Dirección de entrega</h3>
        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
          {direccion}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Método de pago *</h3>
        <p className="text-sm text-gray-500 mb-3">Efectivo: se paga al repartidor contra entrega. Digital: Yape/Plin/Tarjeta/Transferencia.</p>
        <div className="grid grid-cols-2 gap-3">
          {METODOS.map(m => (
            <button
              key={m.value}
              onClick={() => onMetodoChange(m.value as any)}
              className={`relative p-4 rounded-lg border-2 transition-all ${
                metodoDigital === m.value
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-3xl">{m.icon}</span>
              <div className="mt-1 font-medium">{m.label}</div>
              {metodoDigital === m.value && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">
                  ✓
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-4 border-t">
        <Button variant="secondary" onClick={onPrev} size="lg">Anterior</Button>
        <Button onClick={onSubmit} loading={loading} size="lg" className="w-full md:w-auto">
          {loading ? 'Creando pedido...' : `Confirmar y pagar S/ ${total.toFixed(2)}`}
        </Button>
      </div>
    </div>
  );
}