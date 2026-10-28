import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Bike, CheckCircle2, ExternalLink, MapPin, Phone } from 'lucide-react';
import { fmtPEN } from '@/lib/format';
import { MapLeaflet } from '@/shared/ui/MapLeaflet';
import { useGpsTracking, type GpsPosition } from '@/shared/hooks/useGpsTracking';
import { api } from '@/shared/services/api-client';
import type { DeliveryShared, EstadoDelivery } from '@/shared/types/delivery';
import { toast } from '@/shared/ui/use-toast';

const GPS_MIN_INTERVAL_MS = 10000;

const ESTADOS: Record<EstadoDelivery, string> = {
  P: 'Pendiente',
  R: 'En ruta',
  E: 'Entregado',
  C: 'Cancelado',
};

function googleMapsUrl(entrega: DeliveryShared): string {
  const destino = entrega.latCliente !== null && entrega.latCliente !== undefined &&
      entrega.lngCliente !== null && entrega.lngCliente !== undefined
    ? `${entrega.latCliente},${entrega.lngCliente}`
    : `${entrega.direccion}${entrega.distrito ? `, ${entrega.distrito}` : ''}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destino)}`;
}

function geolocationMessage(code: number): string {
  if (code === 1) return 'No se autorizó el GPS. Puedes continuar la ruta, pero el cliente no verá tu ubicación.';
  if (code === 2) return 'No se pudo determinar tu ubicación. Revisa el GPS del dispositivo.';
  if (code === 3) return 'El GPS tardó demasiado en responder. Se volverá a intentar.';
  return 'El GPS no está disponible en este dispositivo.';
}

export function EntregaDetallePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const deliveryId = Number(id) || 0;
  const [gps, setGps] = useState<GpsPosition | null>(null);
  const [compartiendoGps, setCompartiendoGps] = useState(false);
  const [entrega, setEntrega] = useState<DeliveryShared | null>(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);
  const lastSentRef = useRef(0);

  const cargar = useCallback(async () => {
    if (!deliveryId) {
      setError('El identificador de entrega no es válido.');
      setLoading(false);
      return;
    }
    try {
      setError(null);
      const resultado = await api.getMiEntrega(deliveryId);
      setEntrega(resultado);
      if (resultado.estado === 'R') setCompartiendoGps(true);
      if (resultado.estado === 'E' || resultado.estado === 'C') setCompartiendoGps(false);
    } catch (e) {
      console.error('Error cargando entrega:', e);
      setError(e instanceof Error ? e.message : 'No se pudo cargar la entrega.');
    } finally {
      setLoading(false);
    }
  }, [deliveryId]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const onPosition = useCallback((position: GpsPosition) => {
    setGps(position);
    setGpsMessage(null);
    const now = Date.now();
    if (now - lastSentRef.current < GPS_MIN_INTERVAL_MS) return;
    lastSentRef.current = now;
    api.actualizarUbicacion(deliveryId, position.lat, position.lng).catch((e: unknown) => {
      console.error('Error reportando ubicación:', e);
      setGpsMessage('No se pudo enviar la ubicación. Revisa tu conexión.');
    });
  }, [deliveryId]);

  const onGpsError = useCallback((errorGps: GeolocationPositionError) => {
    setGpsMessage(geolocationMessage(errorGps.code));
  }, []);

  const { setEnabled } = useGpsTracking({
    onPosition,
    onError: onGpsError,
    enabled: compartiendoGps,
  });

  useEffect(() => {
    if (compartiendoGps && !navigator.geolocation) {
      setGpsMessage('Este navegador no permite GPS en este contexto. Puedes seguir la ruta por dirección.');
    }
  }, [compartiendoGps]);

  useEffect(() => {
    setEnabled(compartiendoGps);
  }, [compartiendoGps, setEnabled]);

  const iniciarRuta = async () => {
    if (guardando || !entrega || entrega.estado !== 'P') return;
    setGuardando(true);
    try {
      const actualizada = await api.iniciarRuta(deliveryId);
      setEntrega(actualizada);
      setCompartiendoGps(true);
      setGpsMessage(null);
      await toast({
        title: 'Ruta iniciada',
        description: 'El cliente recibirá tu ubicación mientras esta entrega esté en ruta.',
      });
    } catch (e) {
      console.error('Error iniciando ruta:', e);
      toast({ title: 'Error', description: 'No se pudo iniciar la ruta. Actualiza la entrega e inténtalo nuevamente.', variant: 'destructive' });
    } finally {
      setGuardando(false);
    }
  };

  const confirmarEntrega = async () => {
    if (guardando || !entrega || entrega.estado !== 'R') return;
    setGuardando(true);
    try {
      const actualizada = await api.confirmarEntrega(deliveryId);
      setEntrega(actualizada);
      setCompartiendoGps(false);
      setEnabled(false);
      await toast({ title: 'Entrega completada', description: 'El pedido quedó marcado como entregado.' });
      navigate('/repartidor/mis-entregas');
    } catch (e) {
      console.error('Error confirmando entrega:', e);
      toast({ title: 'Error', description: 'No se pudo confirmar la entrega. Actualiza e inténtalo nuevamente.', variant: 'destructive' });
    } finally {
      setGuardando(false);
    }
  };

  const pins = useMemo(() => {
    const result = [];
    if (entrega?.latCliente != null && entrega.lngCliente != null) {
      result.push({ lat: entrega.latCliente, lng: entrega.lngCliente, label: 'Dirección del cliente', color: 'blue' as const });
    }
    const currentGps = gps ?? (
      entrega?.latRepartidor != null && entrega.lngRepartidor != null
        ? { lat: entrega.latRepartidor, lng: entrega.lngRepartidor }
        : null
    );
    if (currentGps) {
      result.push({ ...currentGps, label: 'Tu ubicación', color: 'red' as const });
    }
    return result;
  }, [entrega, gps]);

  const center = useMemo<[number, number] | undefined>(() => {
    if (pins.length === 0) return undefined;
    if (pins.length === 1) return [pins[0].lat, pins[0].lng];
    return [
      (pins[0].lat + pins[1].lat) / 2,
      (pins[0].lng + pins[1].lng) / 2,
    ];
  }, [pins]);

  if (loading) {
    return <div className="y-shell y-responsive-page p-6 text-center text-gray-500">Cargando detalle de la entrega…</div>;
  }

  if (error || !entrega) {
    return (
      <div className="y-shell y-responsive-page y-padding-repartidor">
        <div className="y-panel mx-auto max-w-xl p-6" role="alert">
          <p className="text-red-700">{error ?? 'No se encontró la entrega.'}</p>
          <div className="flex gap-3">
            <button type="button" className="y-btn line" onClick={() => void cargar()}>Reintentar</button>
            <Link to="/repartidor/mis-entregas" className="y-btn red">Volver a mis entregas</Link>
          </div>
        </div>
      </div>
    );
  }

  const direccionCompleta = `${entrega.direccion}${entrega.distrito ? `, ${entrega.distrito}` : ''}`;
  const terminal = entrega.estado === 'E' || entrega.estado === 'C';

  return (
    <div className="y-shell y-responsive-page y-padding-repartidor">
      <div className="mx-auto max-w-3xl space-y-4">
        <Link to="/repartidor/mis-entregas" className="inline-flex items-center gap-2 text-sm text-gray-600">
          <ArrowLeft size={17} /> Mis entregas
        </Link>

        <section className="y-panel space-y-5 p-5 sm:p-6">
          <header className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="m-0 text-sm text-gray-500">Detalle de entrega</p>
              <h1 className="m-0 text-2xl font-bold text-[#7F1518]">Pedido #{entrega.pedidoId}</h1>
            </div>
            <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-semibold">{ESTADOS[entrega.estado]}</span>
          </header>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border p-4">
              <h2 className="mb-2 flex items-center gap-2 text-base font-semibold"><MapPin size={18} /> Dirección</h2>
              <p className="mb-1 font-medium">{direccionCompleta}</p>
              {entrega.referencia && <p className="mb-3 text-sm text-gray-500">Referencia: {entrega.referencia}</p>}
              {!entrega.referencia && <div className="mb-3" />}
              <a href={googleMapsUrl(entrega)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                Abrir ruta en Google Maps <ExternalLink size={15} />
              </a>
            </div>

            <div className="rounded-xl border p-4">
              <h2 className="mb-2 text-base font-semibold">Datos del cliente</h2>
              <p className="mb-2 font-medium">{entrega.nombreCliente ?? 'Cliente'}</p>
              {entrega.telefono ? (
                <a href={`tel:${entrega.telefono}`} className="inline-flex items-center gap-2 text-sm text-blue-700">
                  <Phone size={15} /> {entrega.telefono}
                </a>
              ) : (
                <p className="mb-0 text-sm text-gray-500">No se registró un teléfono de contacto.</p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <h2 className="mb-2 text-base font-semibold">Cobro al cliente</h2>
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="m-0 text-sm text-gray-600">Importe pendiente</p>
                <p className="m-0 text-3xl font-bold text-[#7F1518]">
                  {entrega.montoPorCobrar === undefined ? '—' : fmtPEN(entrega.montoPorCobrar)}
                </p>
              </div>
              <div className="text-sm text-gray-600">
                <p className="m-0">Pedido: {entrega.totalPedido === undefined ? '—' : fmtPEN(entrega.totalPedido)}</p>
                <p className="m-0">Envío: {fmtPEN(entrega.costo)}{entrega.costoConfirmado === false ? ' (por confirmar)' : ''}</p>
                {entrega.montoPagado !== undefined && entrega.montoPagado > 0 && (
                  <p className="m-0">Ya pagado: {fmtPEN(entrega.montoPagado)}</p>
                )}
                {entrega.metodoPago && <p className="m-0">Pagos registrados: {entrega.metodoPago}</p>}
              </div>
            </div>
            {entrega.costoConfirmado === false && (
              <p className="mb-0 mt-2 text-sm text-amber-800">El local aún no confirmó el costo de envío; verifica el monto antes de cobrar.</p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            {entrega.estado === 'P' && (
              <button type="button" onClick={() => void iniciarRuta()} disabled={guardando} className="y-btn red inline-flex items-center gap-2">
                <Bike size={18} /> {guardando ? 'Iniciando…' : 'Iniciar ruta'}
              </button>
            )}
            {entrega.estado === 'R' && (
              <button type="button" onClick={() => void confirmarEntrega()} disabled={guardando} className="y-btn red inline-flex items-center gap-2">
                <CheckCircle2 size={18} /> {guardando ? 'Confirmando…' : 'Confirmar entrega'}
              </button>
            )}
            {terminal && <p className="my-auto text-sm text-gray-600">Esta entrega ya está finalizada.</p>}
            {entrega.estado === 'R' && <p className="my-auto text-sm text-gray-600">Compartir GPS es opcional; la ruta puede continuar si no está disponible.</p>}
          </div>

          {entrega.estado === 'R' && (
            <section aria-label="Mapa de la entrega">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <h2 className="m-0 flex items-center gap-2 text-base font-semibold"><MapPin size={18} /> Mapa de entrega</h2>
                <span className={`text-xs ${compartiendoGps ? 'text-green-700' : 'text-amber-700'}`}>
                  {gpsMessage ? 'GPS con problemas' : gps ? 'GPS activo' : compartiendoGps ? 'Buscando GPS…' : 'GPS detenido'}
                </span>
              </div>
              {gpsMessage && <p className="text-sm text-amber-800" role="status">{gpsMessage}</p>}
              {pins.length > 0 ? (
                <MapLeaflet pins={pins} readonly center={center} zoom={14} height="320px" />
              ) : (
                <div className="rounded-xl border bg-gray-50 p-4 text-sm text-gray-600">
                  No hay coordenadas disponibles. Usa “Abrir ruta en Google Maps” para navegar por dirección.
                </div>
              )}
            </section>
          )}
        </section>
      </div>
    </div>
  );
}
