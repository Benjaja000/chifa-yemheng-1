import { useEffect, useState } from 'react';
import { Ico } from '@/components/Icon';
import { toast } from '@/shared/ui/use-toast';

export function RendicionPage() {
  // Estado de la rendición
  const [repartidorId] = useState<number | null>(null);
  const [repartidorNombre] = useState<string>('');
  const [pedidosEfectivo, setPedidosEfectivo] = useState<any[]>([]);

  // KPIs de la rendición
  const [esperado, setEsperado] = useState<number>(0);
  const [entregado, setEntregado] = useState<number>(0);
  const [diferencia, setDiferencia] = useState<number>(0);
  const [clasificacion, setClasificacion] = useState<'CUADRADO' | 'SOBRANTE' | 'FALTANTE'>('CUADRADO');

  // Observaciones
  const [observaciones, setObservaciones] = useState<string>('');

  useEffect(() => {
    // Cargar pedidos E efectivo pendientes para el repartidor
    // En producción: fetch /api/v1/repartidor/:id/pedidos-efectivo-pendientes
    const mockPedidos = [
      { id: 1, pedidoId: 101, cliente: 'Mesa 08', total: 45.50, metodo: 'Efectivo', fecha: '2024-01-15', registrado: false },
      { id: 2, pedidoId: 102, cliente: 'Mesa 12', total: 62.00, metodo: 'Efectivo', fecha: '2024-01-15', registrado: false },
      { id: 3, pedidoId: 103, cliente: 'Mesa 05', total: 38.20, metodo: 'Efectivo', fecha: '2024-01-15', registrado: false },
    ];

    setPedidosEfectivo(mockPedidos);
    calcularKPIs();
  }, [repartidorId]);

  const calcularKPIs = () => {
    const totalEsperado = pedidosEfectivo.reduce((sum, d) => sum + d.total, 0);
    const totalEntregado = pedidosEfectivo.filter(d => d.registrado).reduce((sum, d) => sum + d.total, 0) || 0;
    const diff = totalEsperado - totalEntregado;

    setEsperado(totalEsperado);
    setEntregado(totalEntregado);
    setDiferencia(diff);

    if (diff === 0) setClasificacion('CUADRADO');
    else if (diff > 0) setClasificacion('SOBRANTE');
    else setClasificacion('FALTANTE');
  };

  const handleRegistrar = async () => {
    if (!repartidorId) {
      toast({ title: 'Error', description: 'Selecciona un repartidor.', variant: 'destructive' });
      return;
    }

    try {
      // Marcar todos los pedidos como registrados
      const todosRegistrados = pedidosEfectivo.map(d => ({ ...d, registrado: true }));
      setPedidosEfectivo(todosRegistrados);

      // Generar MOVIMIENTO_CAJA concepto VENTA AL CONTADO
      // Esto incrementa Monto_Sistema en el turno actual (backend)

      const totalRegistrado = pedidosEfectivo.reduce((sum, d) => sum + d.total, 0);
      toast({
        title: 'Rendición registrada',
        description: `Se registraron S/ ${totalRegistrado} en VENTA AL CONTADO. Movimiento: MOVIMIENTO_CAJA`,
      });

      // Resetear form
      setObservaciones('');
      calcularKPIs();
    } catch (e) {
      toast({ title: 'Error', description: 'No se pudo registrar la rendición.', variant: 'destructive' });
    }
  };

  const handleValidar = async () => {
    if (!repartidorId) return;
    try {
      toast({ title: 'Validada', description: 'La rendición ha sido validada por supervisor.' });
      // En producción: PATCH /api/v1/rendiciones/:id/validar
    } catch (e) {
      toast({ title: 'Error', description: 'No se pudo validar.', variant: 'destructive' });
    }
  };

  return (
    <div className="y-shell y-responsive-page y-padding-caja">
      <div className="max-w-2xl mx-auto">
        <header className="mb-6">
          <h2 className="text-2xl font-bold text-[#7F1518] mb-2">Rendición de Caja</h2>
          <p className="text-sm text-gray-500">Repartidor: {repartidorNombre || '—'} · Turno actual</p>
        </header>

        <div className="grid grid-cols-1 gap-4 mb-4">
          <div className="sm:col-span-2 bg-white rounded-xl p-4 shadow-sm border border-[#F5F5F5]">
            <h3 className="font-medium text-gray-700 text-sm uppercase mb-4">KPIs de la Rendición</h3>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{esperado}</div>
                <div className="text-xs text-blue-500">Esperado</div>
              </div>
              <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-center">
                <div className="text-2xl font-bold text-green-600">{entregado}</div>
                <div className="text-xs text-green-500">Entregado</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-center">
              <div className="text-2xl font-bold text-yellow-600">{diferencia}</div>
              <div className="text-xs text-yellow-500">{clasificacion}</div>
            </div>
          </div>

          <div className="sm:col-span-3 bg-white rounded-xl p-4 shadow-sm border border-[#F5F5F5]">
            <h3 className="font-medium text-gray-700 text-sm uppercase mb-4">Detalle de Pedidos Efectivo</h3>

            {pedidosEfectivo.length === 0 && (
              <p className="text-gray-500">No hay pedidos E efectivo pendientes</p>
            )}

            <table className="w-full text-sm divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-700 uppercase">
                  <th className="p-3">N° Pedido</th>
                  <th className="p-3">Cliente</th>
                  <th className="p-3">Total S/</th>
                  <th className="p-3">Método</th>
                  <th className="p-3">Registrado</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {pedidosEfectivo.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="p-3 font-medium">{d.pedidoId}</td>
                    <td className="p-3">{d.cliente}</td>
                    <td className="p-3 font-bold text-red-600">{d.total.toFixed(2)}</td>
                    <td className="p-3">{d.metodo}</td>
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={d.registrado}
                        onChange={() => {
                          const copia = pedidosEfectivo.map(x =>
                            x.id === d.id ? { ...x, registrado: !x.registrado } : x
                          );
                          setPedidosEfectivo(copia);
                          calcularKPIs();
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">
                Marca los pedidos que ya fueron registrados en la rendición actual.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-6 bg-white rounded-2xl shadow-sm border border-[#F5F5F5]">
          <h3 className="font-medium text-gray-700 text-sm uppercase mb-4">Observaciones y Registro</h3>

          <div className="grid grid-cols-1 gap-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones</label>
              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Ej: Falta S/ 15.00, cliente retiró en mostrador, etc."
              ></textarea>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => handleRegistrar()}
              className="rounded-xl bg-[#A61E22] px-6 py-3 text-sm font-semibold text-white hover:bg-[#7F1518] transition-colors w-full"
            >
              Registrar Rendición
            </button>
            <button
              onClick={() => handleValidar()}
              className="rounded-xl bg-[#7F1518] px-6 py-3 text-sm font-semibold text-white hover:bg-[#A61E22] transition-colors w-full"
            >
              Validar
            </button>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              <Ico n="alert" size={14} /> Al registrar, se genera un Movimiento de Caja concepto VENTA AL CONTADO.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}