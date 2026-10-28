import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bike, ChevronRight, MapPin, RefreshCw } from 'lucide-react';
import { fmtPEN } from '@/lib/format';
import { api } from '@/shared/services/api-client';
import type { DeliveryShared, EstadoDelivery } from '@/shared/types/delivery';

const ESTADOS: Record<EstadoDelivery, string> = {
  P: 'Pendiente',
  R: 'En ruta',
  E: 'Entregado',
  C: 'Cancelado',
};

function fecha(value: string): string {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? 'Fecha no disponible' : parsed.toLocaleString();
}

export function MisEntregasPage() {
  const [entregas, setEntregas] = useState<DeliveryShared[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const cargar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resultado = await api.getMisEntregas({ page: 1, limit: 100 });
      setEntregas(resultado.data);
    } catch (e) {
      console.error('Error cargando entregas del repartidor:', e);
      setError(e instanceof Error ? e.message : 'No se pudieron cargar tus entregas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar, reloadKey]);

  const pendientes = entregas.filter((entrega) => entrega.estado === 'P').length;
  const enRuta = entregas.filter((entrega) => entrega.estado === 'R').length;
  const entregados = entregas.filter((entrega) => entrega.estado === 'E').length;

  return (
    <div className="y-shell y-responsive-page y-padding-repartidor">
      <div className="mx-auto max-w-3xl space-y-5">
        <header className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-gray-500">Panel del repartidor</p>
            <h1 className="text-2xl font-bold text-[#7F1518]">Mis entregas</h1>
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

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3" aria-label="Resumen de entregas">
          <div className="y-panel p-4">
            <p className="text-sm text-gray-500">Pendientes</p>
            <p className="text-2xl font-bold text-amber-700">{pendientes}</p>
          </div>
          <div className="y-panel p-4">
            <p className="text-sm text-gray-500">En ruta</p>
            <p className="text-2xl font-bold text-blue-700">{enRuta}</p>
          </div>
          <div className="y-panel p-4">
            <p className="text-sm text-gray-500">Entregados</p>
            <p className="text-2xl font-bold text-green-700">{entregados}</p>
          </div>
        </section>

        {error && (
          <div className="y-panel flex flex-wrap items-center justify-between gap-3 p-4" role="alert">
            <p className="m-0 text-sm text-red-700">No se pudieron cargar las entregas. ({error})</p>
            <button type="button" className="y-btn line" onClick={() => setReloadKey((key) => key + 1)}>
              Reintentar
            </button>
          </div>
        )}

        {loading && <div className="y-panel p-6 text-center text-gray-500">Cargando tus entregas…</div>}

        {!loading && !error && entregas.length === 0 && (
          <div className="y-panel p-8 text-center">
            <Bike className="mx-auto mb-3 text-gray-400" size={32} />
            <h2 className="text-lg font-semibold">Todavía no tienes entregas asignadas</h2>
            <p className="mb-0 text-sm text-gray-500">Cuando te asignen un pedido, aparecerá aquí.</p>
          </div>
        )}

        {!loading && entregas.length > 0 && (
          <section className="space-y-3" aria-label="Lista de entregas">
            {entregas.map((entrega) => (
              <Link
                key={entrega.id}
                to={`/repartidor/entrega/${entrega.id}`}
                className="y-panel flex flex-col gap-3 p-4 text-inherit no-underline transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h2 className="m-0 text-lg font-bold">Pedido #{entrega.pedidoId}</h2>
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold">{ESTADOS[entrega.estado]}</span>
                  </div>
                  <p className="mb-1 flex items-start gap-2 text-sm text-gray-600">
                    <MapPin size={16} className="mt-0.5 shrink-0" />
                    <span>{entrega.direccion}{entrega.distrito ? `, ${entrega.distrito}` : ''}</span>
                  </p>
                  <p className="mb-0 text-xs text-gray-500">
                    {entrega.nombreCliente ?? 'Cliente'} · Asignado {fecha(entrega.fechaCreacion)}
                  </p>
                </div>
                <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
                  <div className="text-left sm:text-right">
                    <p className="m-0 text-xs text-gray-500">Por cobrar</p>
                    <p className="m-0 font-bold">{entrega.montoPorCobrar === undefined ? '—' : fmtPEN(entrega.montoPorCobrar)}</p>
                  </div>
                  <ChevronRight size={20} aria-hidden="true" />
                </div>
              </Link>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
