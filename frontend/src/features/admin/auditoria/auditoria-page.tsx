import { useEffect, useState } from 'react';
import { leerToken } from '../../auth/login/auth-service';

const BASE = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/v1'}/auditoria`;

interface Auditoria {
  id: number;
  usuario: string | null;
  tabla: string;
  accion: string;
  idRegistro: number | null;
  fecha: string;
  ip: string | null;
}

interface AuditoriaLista {
  data: Auditoria[];
  page: number;
  limit: number;
  total: number;
}

async function listar(f: { page: number; limit: number; tabla: string; accion: string; desde: string; hasta: string }): Promise<AuditoriaLista> {
  const q = new URLSearchParams({ page: String(f.page), limit: String(f.limit) });
  if (f.tabla) q.set('tabla', f.tabla);
  if (f.accion) q.set('accion', f.accion);
  if (f.desde) q.set('desde', f.desde);
  if (f.hasta) q.set('hasta', f.hasta);
  const res = await fetch(`${BASE}?${q.toString()}`, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${leerToken() ?? ''}` } });
  if (!res.ok) throw new Error('NETWORK_ERROR');
  return res.json();
}

const LIMITE = 20;

export function AdminAuditoriaPage() {
  const [page, setPage] = useState(1);
  const [tabla, setTabla] = useState('');
  const [accion, setAccion] = useState('');
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [datos, setDatos] = useState<Auditoria[]>([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await listar({ page, limit: LIMITE, tabla, accion, desde, hasta });
      setDatos(res.data);
      setTotal(res.total);
    } catch {
      setError('No fue posible cargar la auditoría.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { void cargar(); }, [page, tabla, accion, desde, hasta]);

  const totalPaginas = Math.max(1, Math.ceil(total / LIMITE));

  return (
    <div className="y-shell" style={{ padding: '24px 16px 140px', maxWidth: 1240, margin: '0 auto' }}>
      <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--fg)' }}>Auditoría</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        <input placeholder="Tabla" value={tabla} onChange={(e) => { setTabla(e.target.value); setPage(1); }} className="rounded-lg bg-[#F5F5F5] px-3 py-2 text-sm" />
        <input placeholder="Acción" value={accion} onChange={(e) => { setAccion(e.target.value); setPage(1); }} className="rounded-lg bg-[#F5F5F5] px-3 py-2 text-sm" />
        <input type="date" value={desde} onChange={(e) => { setDesde(e.target.value); setPage(1); }} className="rounded-lg bg-[#F5F5F5] px-3 py-2 text-sm" />
        <input type="date" value={hasta} onChange={(e) => { setHasta(e.target.value); setPage(1); }} className="rounded-lg bg-[#F5F5F5] px-3 py-2 text-sm" />
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">{error}</div>}

      {cargando ? (
        <div className="y-panel" style={{ padding: 24, textAlign: 'center' }}>Cargando...</div>
      ) : datos.length === 0 ? (
        <div className="y-panel" style={{ padding: 24, textAlign: 'center' }}>No hay registros de auditoría.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F5F5F5] text-left text-xs uppercase tracking-wider text-[#333]/60">
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Usuario</th>
                <th className="px-3 py-2">Tabla</th>
                <th className="px-3 py-2">Acción</th>
                <th className="px-3 py-2">Registro</th>
                <th className="px-3 py-2">Fecha</th>
                <th className="px-3 py-2">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F5]">
              {datos.map((a) => (
                <tr key={a.id} className="hover:bg-[#F5F5F5]">
                  <td className="px-3 py-2">{a.id}</td>
                  <td className="px-3 py-2">{a.usuario || '—'}</td>
                  <td className="px-3 py-2">{a.tabla}</td>
                  <td className="px-3 py-2">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold">{a.accion}</span>
                  </td>
                  <td className="px-3 py-2">{a.idRegistro ?? '—'}</td>
                  <td className="px-3 py-2">{new Date(a.fecha).toLocaleString()}</td>
                  <td className="px-3 py-2">{a.ip || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-center gap-2 mt-4">
        <button disabled={page <= 1} onClick={() => setPage((x) => Math.max(1, x - 1))} className="rounded-lg bg-white px-3 py-1.5 shadow-sm disabled:opacity-50">← Anterior</button>
        <span className="text-sm">Página {page} de {totalPaginas}</span>
        <button disabled={page >= totalPaginas} onClick={() => setPage((x) => x + 1)} className="rounded-lg bg-white px-3 py-1.5 shadow-sm disabled:opacity-50">Siguiente →</button>
      </div>
    </div>
  );
}
