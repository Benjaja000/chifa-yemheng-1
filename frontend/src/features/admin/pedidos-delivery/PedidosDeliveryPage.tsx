import { useState, useEffect } from 'react';
import { api } from '@/shared/services/api-client';
import { Button } from '@/shared/ui/Button';
import { DeliveryStatusBadge } from '@/shared/ui/Badge';
import { CrearDeliveryModal } from './components/CrearDeliveryModal';
import { AsignarRepartidorModal } from './components/AsignarRepartidorModal';

interface Delivery {
  id: number;
  pedidoId: number;
  distrito: string | null;
  direccion: string;
  referencia: string | null;
  telefono: string | null;
  repartidor: string | null;
  repartidorId: number | null;
  costo: number;
  costoConfirmado: boolean;
  estado: 'P' | 'R' | 'E' | 'C';
  fechaCreacion: string;
}

export function PedidosDeliveryPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [crearModalAbierto, setCrearModalAbierto] = useState(false);
  const [asignarModalAbierto, setAsignarModalAbierto] = useState(false);
  const [deliverySeleccionado, setDeliverySeleccionado] = useState<Delivery | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<'P' | 'R' | 'E' | 'C' | ''>('');
  const limit = 20;

  const cargarDeliveries = async () => {
    setLoading(true);
    try {
      const res = await api.getDeliveries({ page, limit, estado: filtroEstado || undefined });
      setDeliveries(res.data);
      setTotal(res.total);
    } catch (error) {
      console.error('Error cargando deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDeliveries();
  }, [page, filtroEstado]);

  const handleAsignar = (delivery: Delivery) => {
    setDeliverySeleccionado(delivery);
    setAsignarModalAbierto(true);
  };

  const handleCrearExitoso = async () => {
    setCrearModalAbierto(false);
    await cargarDeliveries();
  };

  const handleAsignarExitoso = async () => {
    setAsignarModalAbierto(false);
    setDeliverySeleccionado(null);
    await cargarDeliveries();
  };

  const pendingDeliveries = deliveries.filter(d => d.estado === 'P' && !d.repartidorId);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pedidos Delivery</h1>
        <Button onClick={() => setCrearModalAbierto(true)} size="lg">
          + Nuevo Delivery
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Pendientes</p>
          <p className="text-2xl font-bold text-blue-600">
            {deliveries.filter(d => d.estado === 'P').length}
          </p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">En Ruta</p>
          <p className="text-2xl font-bold text-yellow-600">
            {deliveries.filter(d => d.estado === 'R').length}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Entregados Hoy</p>
          <p className="text-2xl font-bold text-green-600">
            {deliveries.filter(d => d.estado === 'E').length}
          </p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Sin Asignar</p>
          <p className="text-2xl font-bold text-gray-600">
            {pendingDeliveries.length}
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
        <select
          value={filtroEstado}
          onChange={e => { setFiltroEstado(e.target.value as any); setPage(1); }}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">Todos los estados</option>
          <option value="P">Pendiente</option>
          <option value="R">En Ruta</option>
          <option value="E">Entregado</option>
          <option value="C">Cancelado</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Cargando...</div>
        ) : deliveries.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No hay pedidos delivery</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Pedido</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Cliente</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Dirección</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Teléfono</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Costo de envío</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Repartidor</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Estado</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {deliveries.map(d => (
                    <tr key={d.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono">#{d.pedidoId}</td>
                      <td className="px-4 py-3 text-sm">
                        {d.direccion.split(',')[0]}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                        {d.direccion} {d.referencia ? `(${d.referencia})` : ''}
                      </td>
                      <td className="px-4 py-3 text-sm">{d.telefono || '-'}</td>
                      <td className="px-4 py-3 text-sm font-medium">
                        S/ {d.costo.toFixed(2)}
                        {!d.costoConfirmado && (
                          <span className="mt-1 block text-xs font-normal text-amber-700">Por confirmar</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {d.repartidor || <span className="text-gray-400">Sin asignar</span>}
                      </td>
                      <td className="px-4 py-3">
                        <DeliveryStatusBadge estado={d.estado} />
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          {!d.repartidorId && d.estado === 'P' && (
                            <Button variant="outline" size="sm" onClick={() => handleAsignar(d)}>
                              Asignar y confirmar
                            </Button>
                          )}
                          {d.repartidorId && d.estado === 'P' && (
                            <Button variant="secondary" size="sm" disabled>
                              Asignado
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {total > limit && (
              <div className="px-4 py-3 flex items-center justify-between border-t">
                <p className="text-sm text-gray-500">
                  Página {page} de {Math.ceil(total / limit)} — {total} total
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(Math.ceil(total / limit), p + 1))}
                    disabled={page === Math.ceil(total / limit)}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modales */}
      <CrearDeliveryModal
        abierto={crearModalAbierto}
        onCerrar={() => setCrearModalAbierto(false)}
        onExito={handleCrearExitoso}
      />
      <AsignarRepartidorModal
        abierto={asignarModalAbierto}
        delivery={deliverySeleccionado}
        onCerrar={() => { setAsignarModalAbierto(false); setDeliverySeleccionado(null); }}
        onExito={handleAsignarExitoso}
      />
    </div>
  );
}