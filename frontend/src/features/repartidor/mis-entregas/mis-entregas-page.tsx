import { useEffect, useState } from 'react';

export function MisEntregasPage() {
  const [entregas, setEntregas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockData = [
      { id: 1, pedidoId: 101, estado: 'P', total: 45.50 },
      { id: 2, pedidoId: 102, estado: 'R', total: 62.00 },
      { id: 3, pedidoId: 103, estado: 'E', total: 38.20 },
    ];
    setEntregas(mockData);
    setLoading(false);
  }, []);

  const pendientes = entregas.filter(d => d.estado === 'P').length;
  const enRuta = entregas.filter(d => d.estado === 'R').length;
  const entregados = entregas.filter(d => d.estado === 'E').length;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Mis Entregas</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-red-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Pendientes</p>
          <p className="text-2xl font-bold text-red-600">{pendientes}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">En ruta</p>
          <p className="text-2xl font-bold text-yellow-600">{enRuta}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-500">Entregados</p>
          <p className="text-2xl font-bold text-green-600">{entregados}</p>
        </div>
      </div>
      {loading && <p className="text-center text-gray-500">Cargando...</p>}
    </div>
  );
}