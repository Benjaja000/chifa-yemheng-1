import { useState } from 'react';
import { Ico } from '@/components/Icon';
import { toast } from '@/shared/ui/use-toast';
import { api } from '@/shared/services/api-client';

export function RendicionPage() {
  const [repartidorId, setRepartidorId] = useState<string>('');
  const [repartidorNombre] = useState<string>('');
  const [pedidosEfectivo, setPedidosEfectivo] = useState<any[]>([]);
  const [montoEntregado, setMontoEntregado] = useState<number | ''>('');
  const [observaciones, setObservaciones] = useState<string>('');
  const [idRendicion, setIdRendicion] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // KPIs de la rendición
  const [esperado, setEsperado] = useState<number>(0);
  const [entregado, setEntregado] = useState<number>(0);
  const [diferencia, setDiferencia] = useState<number>(0);
  const [clasificacion, setClasificacion] = useState<'CUADRADO' | 'SOBRANTE' | 'FALTANTE'>('CUADRADO');

  const calcularKPIs = () => {
    const totalEsperado = pedidosEfectivo.reduce((sum, d) => sum + Number(d.total ?? 0), 0);
    const totalEntregado = pedidosEfectivo.filter(d => d.registrado).reduce((sum, d) => sum + Number(d.total ?? 0), 0) || 0;
    const diff = totalEsperado - totalEntregado;

    setEsperado(totalEsperado);
    setEntregado(totalEntregado);
    setDiferencia(diff);

    if (diff === 0) setClasificacion('CUADRADO');
    else if (diff > 0) setClasificacion('SOBRANTE');
    else setClasificacion('FALTANTE');
  };

  const cargarPendientes = async () => {
    const id = Number(repartidorId);
    if (!id) {
      toast({ title: 'Error', description: 'Ingresa un ID de repartidor válido.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const data = await api.getPendientesRendicion(id);
      const pedidos = Array.isArray(data) ? data : (data.pedidos ?? []);
      setPedidosEfectivo(pedidos.map((d: any) => ({ ...d, registrado: false })));
      calcularKPIs();
      setMontoEntregado('');
      setIdRendicion(null);
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'No se pudieron cargar los pedidos pendientes.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrar = async () => {
    const id = Number(repartidorId);
    if (!id) {
      toast({ title: 'Error', description: 'Ingresa un ID de repartidor válido.', variant: 'destructive' });
      return;
    }
    const pendientes = pedidosEfectivo.filter(d => d.registrado);
    if (pendientes.length === 0) {
      toast({ title: 'Error', description: 'Selecciona al menos un pedido para rendir.', variant: 'destructive' });
      return;
    }
    if (!montoEntregado || Number(montoEntregado) <= 0) {
      toast({ title: 'Error', description: 'Ingresa el monto entregado.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const pedidoIds = pendientes.map((d: any) => d.pedidoId ?? d.id);
      const data = await api.registrarRendicion({
        repartidorId: id,
        pedidoIds,
        montoEntregado: Number(montoEntregado),
        observaciones,
      });
      setIdRendicion(data.id ?? data.id_rendicion ?? null);
      toast({
        title: 'Rendición registrada',
        description: `Se registraron S/ ${montoEntregado} en VENTA AL CONTADO.`,
      });
      setMontoEntregado('');
      setObservaciones('');
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'No se pudo registrar la rendición.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleValidar = async () => {
    if (!idRendicion) {
      toast({ title: 'Error', description: 'Primero registra una rendición.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      await api.validarRendicion(idRendicion);
      toast({ title: 'Validada', description: 'La rendición ha sido validada por supervisor.' });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'No se pudo validar.', variant: 'destructive' });
    } finally {
      setLoading(false);
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
            <div className="flex items-center gap-3 mb-4">
              <label className="text-sm font-medium text-gray-700">ID Repartidor</label>
              <input
                type="number"
                min="1"
                value={repartidorId}
                onChange={(e) => setRepartidorId(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 w-24"
              />
              <button
                onClick={cargarPendientes}
                disabled={loading}
                className="rounded-lg bg-[#A61E22] px-4 py-2 text-sm font-semibold text-white hover:bg-[#7F1518] disabled:opacity-50"
              >
                Cargar Pedidos Pendientes
              </button>
            </div>
            {loading && <p className="text-sm text-gray-500">Cargando...</p>}
            <h3 className="font-medium text-gray-700 text-sm uppercase mb-4">KPIs de la Rendición</h3>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-center">
                <div className="text-2xl font-bold text-blue-600">{esperado.toFixed(2)}</div>
                <div className="text-xs text-blue-500">Esperado</div>
              </div>
              <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-center">
                <div className="text-2xl font-bold text-green-600">{entregado.toFixed(2)}</div>
                <div className="text-xs text-green-500">Entregado</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-center">
              <div className="text-2xl font-bold text-yellow-600">{diferencia.toFixed(2)}</div>
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

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Monto Entregado (S/)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={montoEntregado === '' ? '' : montoEntregado}
                onChange={(e) => {
                  const val = e.target.value;
                  setMontoEntregado(val === '' ? '' : Number(val));
                }}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
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
              onClick={handleRegistrar}
              disabled={!repartidorId || loading}
              className="rounded-xl bg-[#A61E22] px-6 py-3 text-sm font-semibold text-white hover:bg-[#7F1518] disabled:opacity-50 transition-colors w-full"
            >
              {loading ? 'Registrando...' : 'Registrar Rendición'}
            </button>
            <button
              onClick={handleValidar}
              disabled={!idRendicion || loading}
              className="rounded-xl bg-[#7F1518] px-6 py-3 text-sm font-semibold text-white hover:bg-[#A61E22] disabled:opacity-50 transition-colors w-full"
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
