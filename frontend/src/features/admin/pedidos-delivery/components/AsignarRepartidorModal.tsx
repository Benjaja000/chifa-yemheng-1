import { useState, useEffect } from 'react';
import { api } from '@/shared/services/api-client';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';

interface Repartidor {
  id_empleado: number;
  nombre: string;
  tieneRutaActiva: boolean;
}

interface AsignarRepartidorModalProps {
  abierto: boolean;
  delivery: { id: number; direccion: string; repartidor: string | null } | null;
  onCerrar: () => void;
  onExito: () => void;
}

export function AsignarRepartidorModal({ abierto, delivery, onCerrar, onExito }: AsignarRepartidorModalProps) {
  if (!abierto || !delivery) return null;

  const [repartidores, setRepartidores] = useState<Repartidor[]>([]);
  const [repartidorId, setRepartidorId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarRepartidores();
  }, []);

  const cargarRepartidores = async () => {
    try {
      const res = await api.request<any[]>('/personal?cargo=REPARTIDOR&estado=A');
      const conRuta = await Promise.all(
        res.map(async (r: any) => {
          try {
            const entregas = await api.request<any>(`/delivery?estado=R&repartidorId=${r.id_empleado}`);
            return { ...r, tieneRutaActiva: entregas.data?.length > 0 };
          } catch {
            return { ...r, tieneRutaActiva: false };
          }
        })
      );
      setRepartidores(conRuta);
    } catch (error) {
      console.error('Error cargando repartidores:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleAsignar = async () => {
    if (!repartidorId) return;
    setLoading(true);
    try {
      await api.request(`/delivery/${delivery.id}/asignar`, {
        method: 'PATCH',
        body: JSON.stringify({ repartidorId }),
      });
      alert('Repartidor asignado exitosamente');
      onExito();
      onCerrar();
    } catch (error: any) {
      alert(error.message || 'Error asignando repartidor');
    } finally {
      setLoading(false);
    }
  };

  if (!abierto) return null;

  const disponible = repartidores.filter(r => !r.tieneRutaActiva);
  const sugerido = disponible[0] || repartidores[0];

  let listaContent: React.ReactNode;
  if (cargando) {
    listaContent = <div className="text-center py-4">Cargando repartidores...</div>;
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
                {r.tieneRutaActiva ? '⚠️ Tiene ruta activa' : '✓ Disponible'}
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
          {delivery.repartidor && (
            <p className="text-sm text-green-600 mt-1">Ya asignado a: {delivery.repartidor}</p>
          )}
        </div>

        <div className="p-4">
          {listaContent}
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          <Button variant="secondary" onClick={onCerrar} disabled={loading}>Cancelar</Button>
          <Button onClick={handleAsignar} disabled={loading || !repartidorId}>
            {loading ? 'Asignando...' : 'Asignar Repartidor'}
          </Button>
        </div>
      </div>
    </div>
  );
}