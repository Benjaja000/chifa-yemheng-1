import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGpsTracking } from '@/shared/hooks/useGpsTracking';
import { api } from '@/shared/services/api-client';
import { Ico } from '@/components/Icon';
import { toast } from '@/shared/ui/use-toast';

const GPS_MIN_INTERVAL_MS = 15000;

interface EntregaDetalle {
  id: number;
  pedidoId: number;
  direccion: string;
  distrito: string | null;
  referencia: string | null;
  telefono: string | null;
  costo: number;
  estado: 'P' | 'R' | 'E' | 'C';
}

export function EntregaDetallePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const deliveryId = Number(id) || 0;
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [compartiendoGps, setCompartiendoGps] = useState(false);
  const [entrega, setEntrega] = useState<EntregaDetalle | null>(null);
  const lastSentRef = useRef(0);

  useEffect(() => {
    if (!deliveryId) return;
    api.getMiEntrega(deliveryId).then(setEntrega).catch((e) => {
      console.error('Error cargando entrega:', e);
    });
  }, [deliveryId]);

  // Hook de GPS: watchPosition, auto-stop al entregar. Persiste la posición en BD (throttle).
  const { setEnabled } = useGpsTracking({
    onPosition: (pos) => {
      setLat(pos.lat);
      setLng(pos.lng);
      const now = Date.now();
      if (now - lastSentRef.current < GPS_MIN_INTERVAL_MS) return;
      lastSentRef.current = now;
      api.actualizarUbicacion(deliveryId, pos.lat, pos.lng).catch((e) => {
        console.error('Error reportando ubicación:', e);
      });
    },
    autoStop: 'E',
    enabled: compartiendoGps,
  });

  const iniciarRuta = async () => {
    try {
      await api.iniciarRuta(deliveryId);
      await toast({
        title: 'Ruta iniciada',
        description: 'Compartiendo tu ubicación mientras estás en ruta.',
      });
      setCompartiendoGps(true);
      setEnabled(true);
    } catch (e) {
      toast({ title: 'Error', description: 'No se pudo iniciar la ruta', variant: 'destructive' });
    }
  };

  const confirmarEntrega = async () => {
    try {
      await api.confirmarEntrega(deliveryId);
      toast({ title: 'Entregado', description: 'El pedido ha sido entregado exitosamente.' });
      setCompartiendoGps(false);
      setEnabled(false);
      navigate('/repartidor/mis-entregas');
    } catch (e) {
      toast({ title: 'Error', description: 'No se pudo confirmar la entrega', variant: 'destructive' });
    }
  };

  return (
    <div className="y-shell y-responsive-page y-padding-repartidor">
      <div className="max-w-2xl mx-auto">
        <div className="y-panel y-panel-card" style={{ padding: 24, borderRadius: 16 }}>
          <h2 className="text-2xl font-bold text-[#7F1518] mb-6">Entrega #{deliveryId}</h2>

          <div className="grid grid-cols-1 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
              <p className="text-gray-900 font-medium">{entrega?.direccion ?? '—'}</p>
              {entrega?.referencia && <p className="text-sm text-gray-500">{entrega.referencia}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pedido</label>
              <p className="text-gray-900">#{entrega?.pedidoId ?? '—'} · {entrega?.distrito ?? '—'}</p>
              {entrega?.telefono && <p className="text-sm text-gray-500">Tel: {entrega.telefono}</p>}
            </div>
          </div>

          {/* Estado badge */}
          <div className="mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider">Estado actual</span>
            <span className={`inline-block rounded-full px-3 py-1.5 text-sm font-medium ${compartiendoGps ? 'text-yellow-600' : 'text-gray-600'}`}>
              {compartiendoGps ? 'En ruta' : 'Pendiente'}
            </span>
          </div>

          {/* Botones grandes */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => iniciarRuta()}
              disabled={compartiendoGps}
              className="rounded-2xl bg-[#A61E22] text-white px-6 py-4 text-lg font-semibold hover:bg-[#7F1518] transition-colors flex items-center justify-center">
                <Ico n={compartiendoGps ? 'ok' : 'bike'} size={20} /> {compartiendoGps ? 'Detener ruta' : 'Iniciar ruta'}
            </button>
            <button
              onClick={() => confirmarEntrega()}
              disabled={!compartiendoGps}
              className="rounded-2xl bg-[#7F1518] text-white px-6 py-4 text-lg font-semibold hover:bg-[#A61E22] transition-colors flex items-center justify-center">
                <Ico n="ok" size={20} /> Confirmar entrega
            </button>
          </div>

          {/* Mini mapa si hay GPS */}
          {lat !== null && lng !== null && (
            <div className="mt-4">
              <p className="text-xs text-gray-500">Tu posición actual</p>
              <div className="h-32 rounded-lg bg-gray-100 overflow-hidden relative">
                <div className="absolute inset-0 bg-blue-500 opacity-20" />
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 border-2 white" />
                <p className="text-center text-xs text-gray-500 mt-8">Lat: {lat.toFixed(4)}, Lng: {lng.toFixed(4)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
