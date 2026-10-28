import { useState, useEffect } from 'react';
import { api } from '@/shared/services/api-client';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';

interface Repartidor {
  id_empleado: number;
  nombre: string;
  tieneRutaActiva: boolean;
  disponibilidadNoVerificada?: boolean;
}

interface AsignarRepartidorModalProps {
  abierto: boolean;
  delivery: { id: number; direccion: string; repartidor: string | null; costo: number; costoConfirmado: boolean } | null;
  onCerrar: () => void;
  onExito: () => void;
}

export function AsignarRepartidorModal({ abierto, delivery, onCerrar, onExito }: AsignarRepartidorModalProps) {
  const [repartidores, setRepartidores] = useState<Repartidor[]>([]);
  const [repartidorId, setRepartidorId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [costoEnvio, setCostoEnvio] = useState('0');
  const [errorCarga, setErrorCarga] = useState<string | null>(null);

  const cargarRepartidores = async () => {
    try {
      const res = await api.request<any[]>('/personal?cargo=REPARTIDOR&estado=A');
      const conRuta = await Promise.all(
        res.map(async (r: any) => {
          try {
            const entregas = await api.request<any>(`/delivery?estado=R&repartidorId=${r.id_empleado}`);
            return { ...r, tieneRutaActiva: entregas.data?.length > 0 };
          } catch {
            console.error(`No se pudo verificar la ruta activa del repartidor ${r.id_empleado}.`);
            return { ...r, tieneRutaActiva: true, disponibilidadNoVerificada: true };
          }
        })
      );
      setRepartidores(conRuta);
      setRepartidorId(conRuta.find((r) => !r.tieneRutaActiva && !r.disponibilidadNoVerificada)?.id_empleado ?? null);
      if (conRuta.some((r) => r.disponibilidadNoVerificada)) {
        setErrorCarga('No se pudo verificar la disponibilidad de todos los repartidores; los no verificados no se pueden asignar.');
      }
    } catch (error) {
      console.error('Error cargando repartidores:', error);
      setErrorCarga('No se pudo cargar la lista de repartidores. Intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (!abierto || !delivery) return;
    setCargando(true);
    setErrorCarga(null);
    setCostoEnvio(String(delivery.costo));
    void cargarRepartidores();
  }, [abierto, delivery?.id]);

  const handleAsignar = async () => {
    const costo = Number(costoEnvio);
    if (!delivery || !repartidorId || !costoEnvio.trim() || !Number.isFinite(costo) || costo < 0) return;
    setLoading(true);
    try {
      await api.request(`/delivery/${delivery.id}/asignar`, {
        method: 'PATCH',
        body: JSON.stringify({ repartidorId, costoEnvio: costo }),
      });
      alert('Costo confirmado y repartidor asignado. El pedido permanece pendiente hasta iniciar la ruta.');
      onExito();
      onCerrar();
    } catch (error: any) {
      alert(error.message || 'Error asignando repartidor');
    } finally {
      setLoading(false);
    }
  };

  if (!abierto || !delivery) return null;

  const disponible = repartidores.filter(r => !r.tieneRutaActiva);
  const sugerido = disponible[0] || repartidores[0];

  let listaContent: React.ReactNode;
  if (cargando) {
    listaContent = <div className="text-center py-4">Cargando repartidores...</div>;
  } else if (errorCarga && repartidores.length === 0) {
    listaContent = <div className="text-center py-4 text-red-600" role="alert">{errorCarga}</div>;
  } else if (repartidores.length === 0) {
    listaContent = <div className="text-center py-4 text-red-600">No hay repartidores disponibles</div>;
  } else {
    listaContent = (
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {repartidores.map(r => (
          <label key={r.id_empleado} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="repartidor"
              value={String(r.id_empleado)}
              checked={repartidorId === r.id_empleado}
              onChange={() => setRepartidorId(r.id_empleado)}
              className="w-4 h-4 text-blue-600"
              disabled={r.tieneRutaActiva}
            />
            <div className="flex-1">
              <p className="font-medium">{r.nombre}</p>
              <p className="text-xs text-gray-500">
                {r.disponibilidadNoVerificada ? 'No se pudo verificar' : r.tieneRutaActiva ? 'Tiene ruta activa' : 'Disponible'}
              </p>
            </div>
            {r.id_empleado === sugerido?.id_empleado && !r.tieneRutaActiva && (
              <Badge variant="success" size="sm">Sugerido</Badge>
            )}
          </label>
        ))}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold">Asignar Repartidor</h2>
          <Button variant="ghost" onClick={onCerrar} disabled={loading}>✕</Button>
        </div>

        <div className="p-4 border-b bg-gray-50">
          <p className="text-sm font-medium">Pedido: <span className="font-mono">#{delivery.id}</span></p>
          <p className="text-sm text-gray-600 mt-1">{delivery.direccion}</p>
          <label className="mt-3 block text-sm font-medium text-gray-700" htmlFor="delivery-costo-final">
            Costo de envío final (S/)
          </label>
          <input
            id="delivery-costo-final"
            className="mt-1 w-full rounded-lg border px-3 py-2"
            type="number"
            min="0"
            step="0.01"
            value={costoEnvio}
            onChange={(event) => setCostoEnvio(event.target.value)}
            required
          />
          {!delivery.costoConfirmado && (
            <p className="mt-1 text-xs text-amber-700">Revisa y confirma el costo sugerido antes de asignar.</p>
          )}
          {delivery.repartidor && (
            <p className="text-sm text-green-600 mt-1">Ya asignado a: {delivery.repartidor}</p>
          )}
        </div>

        <div className="p-4">
          {errorCarga && repartidores.length > 0 && (
            <p className="mb-3 text-sm text-amber-700" role="status">{errorCarga}</p>
          )}
          {listaContent}
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          <Button variant="secondary" onClick={onCerrar} disabled={loading}>Cancelar</Button>
          <Button
            onClick={handleAsignar}
            disabled={loading || !repartidorId || !costoEnvio.trim() || !Number.isFinite(Number(costoEnvio)) || Number(costoEnvio) < 0}
          >
            {loading ? 'Asignando...' : 'Asignar Repartidor'}
          </Button>
        </div>
      </div>
    </div>
  );
}