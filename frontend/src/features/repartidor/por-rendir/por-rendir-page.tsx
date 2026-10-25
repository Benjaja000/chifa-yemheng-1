import { useEffect, useState } from 'react';
import { Ico } from '@/components/Icon';

export function PorRendirPage() {
  // En producción: fetch /api/v1/repartidor/por-rendir
  const [pendientes] = useState<any[]>([
    { id: 1, pedidoId: 101, cliente: 'Mesa 08', total: 45.50, metodo: 'Efectivo', horas: 2, entregado: false },
    { id: 2, pedidoId: 102, cliente: 'Mesa 12', total: 62.00, metodo: 'Efectivo', horas: 1, entregado: false },
  ]);

  const KPIS = () => {
    const total = pendientes.reduce((sum, d) => sum + d.total, 0);
    const esperado = pendientes.reduce((sum, d) => sum + d.total, 0);
    const entregado = pendientes.filter(d => d.entregado).reduce((sum, d) => sum + d.total, 0) || 0;
    const diferencia = esperado - entregado;
    return { total, esperado, entregado, diferencia };
  };

  useEffect(() => {
    // Actualizar periódicamente
    const interval = setInterval(() => {
      // En producción: refetch API
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="y-shell y-responsive-page">
      <div className="max-w-2xl mx-auto p-4">
        <div className="y-panel y-panel-card" style={{ padding: 24, borderRadius: 16 }}>
          <h2 className="text-2xl font-bold text-[#7F1518] mb-6">Por Rendir</h2>

          <div className="grid grid-cols-1 gap-3 mb-4">
            <div className="p-3 rounded-lg bg-red-100 text-red-700 text-center">
              <div className="text-2xl font-bold">{KPIS().total}</div>
              <div className="text-xs">S/ total esperado</div>
            </div>
            <div className="p-3 rounded-lg bg-green-100 text-green-700 text-center">
              <div className="text-2xl font-bold">{KPIS().entregado}</div>
              <div className="text-xs">S/ entregado</div>
            </div>
            <div className="p-3 rounded-lg bg-yellow-100 text-yellow-700 text-center">
              <div className="text-2xl font-bold">{KPIS().diferencia}</div>
              <div className="text-xs">S/ diferencia</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-700 uppercase">
                  <th className="p-3">N° Pedido</th>
                  <th className="p-3">Cliente</th>
                  <th className="p-3">Total S/</th>
                  <th className="p-3">Método</th>
                  <th className="p-3">Hrs desde</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {pendientes.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="p-3 font-medium">{d.pedidoId}</td>
                    <td className="p-3">{d.cliente}</td>
                    <td className="p-3 font-bold text-red-600">{d.total.toFixed(2)}</td>
                    <td className="p-3">{d.metodo}</td>
                    <td className="p-3 text-sm text-gray-500">{d.horas}h</td>
                    <td className="p-3">
                      <button className="text-xs text-blue-600 hover:text-blue-800">Llevar a Caja</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <Ico n="chevronRight" size={16} /> Los pagos en efectivo contra entrega quedan 'por rendir' al regresar. Llevar el monto al cajero para registrar MOVIMIENTO_CAJA concepto VENTA AL CONTADO.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}