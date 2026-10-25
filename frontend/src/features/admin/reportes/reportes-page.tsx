import { useEffect, useState } from 'react';
import { leerToken } from '../../auth/login/auth-service';

const BASE = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/v1'}/reportes`;

interface VentaDiaria { fecha: string; tipodocumento: string; comprobantes: number; subtotal: number; igv: number; total: number; }
interface ProductoMasVendido { productoId: number; producto: string; categoria: string; cantidad: number; total: number; }
interface ArqueoCaja { turnoId: number; caja: string; numeroTurno: number; fechaApertura: string; fechaCierre: string | null; usuarioApertura: string; usuarioCierre: string | null; montoInicial: number; totalIngresos: number; totalEgresos: number; montoSistema: number; montoDeclarado: number; diferencia: number; situacion: string; }

async function fetchReporte<T>(path: string, params: Record<string, string>): Promise<T> {
  const q = new URLSearchParams(params);
  const res = await fetch(`${BASE}/${path}?${q.toString()}`, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${leerToken() ?? ''}` } });
  if (!res.ok) throw new Error('NETWORK_ERROR');
  return res.json();
}

export function AdminReportesPage() {
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [ventas, setVentas] = useState<VentaDiaria[]>([]);
  const [productos, setProductos] = useState<ProductoMasVendido[]>([]);
  const [arqueo, setArqueo] = useState<ArqueoCaja[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'ventas' | 'productos' | 'arqueo'>('ventas');

  const cargar = async () => {
    setCargando(true);
    setError(null);
    try {
      const params: Record<string, string> = {};
      if (desde) params.desde = desde;
      if (hasta) params.hasta = hasta;
      const [v, p, a] = await Promise.all([
        fetchReporte<VentaDiaria[]>('ventas-diarias', params),
        fetchReporte<ProductoMasVendido[]>('productos-mas-vendidos', { limit: '10', ...params }),
        fetchReporte<ArqueoCaja[]>('arqueo-caja', params),
      ]);
      setVentas(v);
      setProductos(p);
      setArqueo(a);
    } catch {
      setError('No fue posible cargar los reportes.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { void cargar(); }, [desde, hasta]);

  const fmt = (n: number) => `S/. ${n.toFixed(2)}`;

  return (
    <div className="y-shell" style={{ padding: '24px 16px 140px', maxWidth: 1240, margin: '0 auto' }}>
      <h1 className="text-2xl font-bold mb-4" style={{ color: 'var(--fg)' }}>Reportes</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} className="rounded-lg bg-[#F5F5F5] px-3 py-2 text-sm" />
        <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} className="rounded-lg bg-[#F5F5F5] px-3 py-2 text-sm" />
        <div className="flex gap-1 ml-2">
          {(['ventas', 'productos', 'arqueo'] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${tab === t ? 'bg-[#A61E22] text-white' : 'bg-[#F5F5F5] hover:bg-[#D9D9D9]'}`}>
              {t === 'ventas' ? 'Ventas Diarias' : t === 'productos' ? 'Productos Top' : 'Arqueo Caja'}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">{error}</div>}

      {cargando ? (
        <div className="y-panel" style={{ padding: 24, textAlign: 'center' }}>Cargando...</div>
      ) : tab === 'ventas' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F5F5F5] text-left text-xs uppercase tracking-wider text-[#333]/60">
                <th className="px-3 py-2">Fecha</th>
                <th className="px-3 py-2">Tipo doc</th>
                <th className="px-3 py-2 text-right">Comprobantes</th>
                <th className="px-3 py-2 text-right">Subtotal</th>
                <th className="px-3 py-2 text-right">IGV</th>
                <th className="px-3 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F5]">
              {ventas.map((v, i) => (
                <tr key={i} className="hover:bg-[#F5F5F5]">
                  <td className="px-3 py-2">{v.fecha}</td>
                  <td className="px-3 py-2">{v.tipodocumento}</td>
                  <td className="px-3 py-2 text-right">{v.comprobantes}</td>
                  <td className="px-3 py-2 text-right">{fmt(v.subtotal)}</td>
                  <td className="px-3 py-2 text-right">{fmt(v.igv)}</td>
                  <td className="px-3 py-2 text-right font-bold">{fmt(v.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {ventas.length === 0 && <p className="text-center py-4 text-sm text-[#333]/60">Sin datos.</p>}
        </div>
      ) : tab === 'productos' ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F5F5F5] text-left text-xs uppercase tracking-wider text-[#333]/60">
                <th className="px-3 py-2">Producto</th>
                <th className="px-3 py-2">Categoría</th>
                <th className="px-3 py-2 text-right">Cantidad</th>
                <th className="px-3 py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F5]">
              {productos.map((p, i) => (
                <tr key={i} className="hover:bg-[#F5F5F5]">
                  <td className="px-3 py-2">{p.producto}</td>
                  <td className="px-3 py-2">{p.categoria}</td>
                  <td className="px-3 py-2 text-right">{p.cantidad}</td>
                  <td className="px-3 py-2 text-right font-bold">{fmt(p.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {productos.length === 0 && <p className="text-center py-4 text-sm text-[#333]/60">Sin datos.</p>}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#F5F5F5] text-left text-xs uppercase tracking-wider text-[#333]/60">
                <th className="px-3 py-2">Caja</th>
                <th className="px-3 py-2">Turno</th>
                <th className="px-3 py-2">Apertura</th>
                <th className="px-3 py-2">Cierre</th>
                <th className="px-3 py-2 text-right">Inicial</th>
                <th className="px-3 py-2 text-right">Ingresos</th>
                <th className="px-3 py-2 text-right">Egresos</th>
                <th className="px-3 py-2 text-right">Sistema</th>
                <th className="px-3 py-2 text-right">Declarado</th>
                <th className="px-3 py-2 text-right">Diferencia</th>
                <th className="px-3 py-2">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F5F5]">
              {arqueo.map((a, i) => (
                <tr key={i} className="hover:bg-[#F5F5F5]">
                  <td className="px-3 py-2">{a.caja}</td>
                  <td className="px-3 py-2">{a.numeroTurno}</td>
                  <td className="px-3 py-2">{new Date(a.fechaApertura).toLocaleString()}</td>
                  <td className="px-3 py-2">{a.fechaCierre ? new Date(a.fechaCierre).toLocaleString() : '—'}</td>
                  <td className="px-3 py-2 text-right">{fmt(a.montoInicial)}</td>
                  <td className="px-3 py-2 text-right">{fmt(a.totalIngresos)}</td>
                  <td className="px-3 py-2 text-right">{fmt(a.totalEgresos)}</td>
                  <td className="px-3 py-2 text-right font-bold">{fmt(a.montoSistema)}</td>
                  <td className="px-3 py-2 text-right">{fmt(a.montoDeclarado)}</td>
                  <td className="px-3 py-2 text-right">{fmt(a.diferencia)}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${a.situacion === 'C' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {a.situacion === 'C' ? 'Cerrado' : 'Abierto'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {arqueo.length === 0 && <p className="text-center py-4 text-sm text-[#333]/60">Sin datos.</p>}
        </div>
      )}
    </div>
  );
}
