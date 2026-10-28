import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, WalletCards } from 'lucide-react';
import { fmtPEN } from '@/lib/format';
import { api } from '@/shared/services/api-client';
import type { PorRendirShared } from '@/shared/types/delivery';

function fecha(value: string): string {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? '—' : parsed.toLocaleString();
}

export function PorRendirPage() {
  const [pendientes, setPendientes] = useState<PorRendirShared[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setPendientes(await api.getPorRendir());
    } catch (e) {
      console.error('Error cargando rendiciones pendientes del repartidor:', e);
      setError(e instanceof Error ? e.message : 'No se pudo consultar el monto por rendir.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar, reloadKey]);

  const total = pendientes.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="y-shell y-responsive-page y-padding-repartidor">
      <div className="mx-auto max-w-3xl space-y-5">
        <header className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-gray-500">Efectivo recibido en entregas</p>
            <h1 className="text-2xl font-bold text-[#7F1518]">Por rendir</h1>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm"
            onClick={() => setReloadKey((key) => key + 1)}
            disabled={loading}
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Actualizar
          </button>
        </header>

        <section className="y-panel flex items-center justify-between gap-4 p-5">
          <div>
            <p className="m-0 text-sm text-gray-500">Total pendiente de entregar en caja</p>
            <p className="m-0 text-3xl font-bold text-[#7F1518]">{fmtPEN(total)}</p>
          </div>
          <WalletCards size={32} className="text-[#7F1518]" />
        </section>

        {error && (
          <div className="y-panel flex flex-wrap items-center justify-between gap-3 p-4" role="alert">
            <p className="m-0 text-sm text-red-700">No se pudo cargar la información. ({error})</p>
            <button type="button" className="y-btn line" onClick={() => setReloadKey((key) => key + 1)}>
              Reintentar
            </button>
          </div>
        )}

        {loading && <div className="y-panel p-6 text-center text-gray-500">Consultando rendiciones…</div>}

        {!loading && !error && pendientes.length === 0 && (
          <div className="y-panel p-8 text-center">
            <WalletCards className="mx-auto mb-3 text-gray-400" size={32} />
            <h2 className="text-lg font-semibold">No tienes efectivo pendiente por rendir</h2>
            <p className="mb-0 text-sm text-gray-500">Aquí aparecerán las entregas en efectivo completadas que aún no se registraron en caja.</p>
          </div>
        )}

        {!loading && pendientes.length > 0 && (
          <section className="y-panel overflow-x-auto p-4" aria-label="Pedidos pendientes de rendición">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b text-xs uppercase text-gray-500">
                  <th className="p-3">Pedido</th>
                  <th className="p-3">Cliente y dirección</th>
                  <th className="p-3">Pago</th>
                  <th className="p-3">Entregado</th>
                  <th className="p-3 text-right">Monto</th>
                </tr>
              </thead>
              <tbody>
                {pendientes.map((item) => (
                  <tr key={item.idPedidoDelivery} className="border-b last:border-0">
                    <td className="p-3 font-semibold">#{item.pedidoId}</td>
                    <td className="p-3">
                      <p className="m-0 font-medium">{item.cliente}</p>
                      <p className="m-0 text-xs text-gray-500">{item.direccion}</p>
                    </td>
                    <td className="p-3">{item.metodoPago || 'Efectivo'}</td>
                    <td className="p-3 text-gray-600">{fecha(item.fechaEntrega)}</td>
                    <td className="p-3 text-right font-bold text-[#7F1518]">{fmtPEN(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mb-0 mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">
              Entrega este efectivo al cajero para que registre la rendición. Esta pantalla es informativa y no registra movimientos de caja.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
