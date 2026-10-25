import { useEffect, useState, useMemo } from 'react';
import { api } from '@/shared/services/api-client';
import { DeliveryStatusBadge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { toast } from '@/shared/ui/use-toast';

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
  estado: 'P' | 'R' | 'E' | 'C';
  fechaCreacion: string;
  fechaSalida: string | null;
  fechaEntrega: string | null;
}

const LIMITE = 20;

export function StaffDeliveryPage() {
  const [page, setPage] = useState(1);
  const [estado, setEstado] = useState<'P' | 'R' | 'E' | 'C' | ''>('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ pedidoId: 0, direccion: '', referencia: '', telefono: '', costo: 0 });
  const [guardando, setGuardando] = useState(false);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [total, setTotal] = useState(0);

  const cargar = async () => {
    try {
      const res = await api.getDeliveries({ page, limit: LIMITE, estado: estado || undefined });
      if (res?.data) {
        setDeliveries(res.data);
        setTotal(res.total);
      }
    } catch {
      toast({ title: 'Error', description: 'No fue posible cargar las entregas.', variant: 'destructive' });
    }
  };

  useEffect(() => {
    void cargar();
  }, [page, estado]);

  const kpis = useMemo(() => {
    const all = deliveries;
    const pendientes = all.filter(d => d.estado === 'P').length;
    const enRuta = all.filter(d => d.estado === 'R').length;
    const hoy = new Date();
    const hoyStr = `${hoy.getFullYear()}-${(hoy.getMonth() + 1).toString().padStart(2, '0')}-${hoy.getDate().toString().padStart(2, '0')}`;
    const entregadosHoy = all.filter(d => d.estado === 'E' && d.fechaCreacion?.startsWith(hoyStr)).length;
    const enRutaConTiempos = all.filter(d => d.estado === 'E' && d.fechaSalida && d.fechaEntrega);
    const tiempoPromedio = enRutaConTiempos.length > 0
      ? enRutaConTiempos.reduce((sum, d) => sum + (new Date(d.fechaEntrega!).getTime() - new Date(d.fechaSalida!).getTime()), 0) / 60000 / enRutaConTiempos.length
      : 0;
    return { pendientes, enRuta, entregados: entregadosHoy, tiempoPromedio: Math.round(tiempoPromedio) };
  }, [deliveries]);

  const handleCrear = async () => {
    if (!form.pedidoId || !form.direccion.trim()) {
      toast({ title: 'Error', description: 'Pedido ID y dirección son obligatorios.', variant: 'destructive' });
      return;
    }
    setGuardando(true);
    try {
      await api.request('/delivery', {
        method: 'POST',
        body: JSON.stringify({ pedidoId: form.pedidoId, direccion: form.direccion.trim(), referencia: form.referencia || undefined, telefono: form.telefono || undefined, costo: form.costo }),
      });
      setModal(false);
      setForm({ pedidoId: 0, direccion: '', referencia: '', telefono: '', costo: 0 });
      await cargar();
    } catch (e) {
      toast({ title: 'Error', description: (e as Error).message, variant: 'destructive' });
    } finally {
      setGuardando(false);
    }
  };

  const renderKpis = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-red-50 rounded-lg p-4">
        <p className="text-sm text-gray-500">Pendientes</p>
        <p className="text-2xl font-bold text-red-600">{kpis.pendientes}</p>
      </div>
      <div className="bg-yellow-50 rounded-lg p-4">
        <p className="text-sm text-gray-500">En Ruta</p>
        <p className="text-2xl font-bold text-yellow-600">{kpis.enRuta}</p>
      </div>
      <div className="bg-green-50 rounded-lg p-4">
        <p className="text-sm text-gray-500">Entregados Hoy</p>
        <p className="text-2xl font-bold text-green-600">{kpis.entregados}</p>
      </div>
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-500">Tiempo Prom. Ruta (min)</p>
        <p className="text-2xl font-bold text-gray-600">{kpis.tiempoPromedio}</p>
      </div>
    </div>
  );

  const renderFiltros = () => (
    <div className="flex flex-wrap gap-2 mb-6">
      {(['', 'P', 'R', 'E', 'C'] as const).map((e) => (
        <Button
          key={e}
          variant={estado === e ? 'primary' : 'outline'}
          size="sm"
          onClick={() => { setEstado(e as '' | 'P' | 'R' | 'E' | 'C'); setPage(1); }}
        >
          {e === '' ? 'Todos' : ({ P: 'Pendiente', R: 'En Ruta', E: 'Entregado', C: 'Cancelado' } as Record<string, string>)[e]}
        </Button>
      ))}
    </div>
  );

  const renderKanban = () => {
    const columns = [
      { key: 'P' as const, label: 'Pendiente', color: 'bg-red-50 border-red-200' },
      { key: 'R' as const, label: 'En Ruta', color: 'bg-yellow-50 border-yellow-200' },
      { key: 'E' as const, label: 'Entregado', color: 'bg-green-50 border-green-200' },
    ];

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map((col) => {
          const items = deliveries.filter((d) => d.estado === col.key);
          return (
            <div key={`col-${col.key}`} className={`rounded-xl p-4 shadow-sm border ${col.color}`}>
              <h3 className="font-medium text-gray-700 text-sm uppercase mb-4">
                {col.label} ({items.length})
              </h3>
              {items.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Sin entregas</p>
              ) : (
                <div className="space-y-3">
                  {items.map((d) => (
                    <div key={d.id} className="bg-white rounded-lg p-3 border hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-mono text-sm text-gray-600">Pedido #{d.pedidoId}</p>
                          <p className="text-sm font-medium text-gray-900 truncate">{d.direccion}</p>
                        </div>
                        <DeliveryStatusBadge estado={d.estado} />
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{d.repartidor || 'Sin asignar'}</span>
                        <span>S/ {d.costo.toFixed(2)}</span>
                      </div>
                      <div className="flex gap-2 mt-2 pt-2 border-t">
                        {d.estado === 'P' && !d.repartidorId && (
                          <Button variant="outline" size="sm" className="flex-1" onClick={() => { /* asignar */ }}>
                            Asignar
                          </Button>
                        )}
                        {d.estado === 'P' && d.repartidorId && (
                          <Button variant="secondary" size="sm" className="flex-1" disabled>
                            Asignado
                          </Button>
                        )}
                        {d.estado === 'R' && (
                          <Button variant="secondary" size="sm" className="flex-1" onClick={() => { /* entregar */ }}>
                            Entregar
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderPagination = () => (
    <div className="flex items-center justify-between mt-6">
      <p className="text-sm text-gray-500">
        Página {page} de {Math.max(1, Math.ceil(total / LIMITE))} — {total} total
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
          Anterior
        </Button>
        <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(Math.ceil(total / LIMITE), p + 1))} disabled={page === Math.ceil(total / LIMITE)}>
          Siguiente
        </Button>
      </div>
    </div>
  );

  const renderModal = () => {
    if (!modal) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-red-600 mb-4">Nueva Entrega</h2>
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase opacity-60">Pedido ID *</span>
              <input type="number" value={form.pedidoId} onChange={(e) => setForm({ ...form, pedidoId: Number(e.target.value) })} className="rounded-lg bg-gray-50 px-3 py-2 text-sm" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase opacity-60">Dirección *</span>
              <input value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} className="rounded-lg bg-gray-50 px-3 py-2 text-sm" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase opacity-60">Referencia</span>
              <input value={form.referencia} onChange={(e) => setForm({ ...form, referencia: e.target.value })} className="rounded-lg bg-gray-50 px-3 py-2 text-sm" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase opacity-60">Teléfono</span>
              <input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} className="rounded-lg bg-gray-50 px-3 py-2 text-sm" />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase opacity-60">Costo</span>
              <input type="number" value={form.costo} onChange={(e) => setForm({ ...form, costo: Number(e.target.value) })} className="rounded-lg bg-gray-50 px-3 py-2 text-sm" />
            </label>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="secondary" onClick={() => setModal(false)}>Cancelar</Button>
            <Button onClick={() => void handleCrear()} disabled={guardando}>
              {guardando ? 'Guardando…' : 'Crear'}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Delivery</h1>
        <Button onClick={() => setModal(true)} size="lg">
          + Nueva Entrega
        </Button>
      </div>

      {renderKpis()}
      {renderFiltros()}
      {renderKanban()}
      {renderPagination()}
      {renderModal()}
    </div>
  );
}