import { useEffect, useState } from 'react';
import { crearMovimiento, crearReceta, listarMovimientos, listarRecetas } from './inventario-service';
import type { Movimiento, Receta } from './inventario-service';

const LIMITE = 20;

export function AdminInventarioPage() {
  const [tab, setTab] = useState<'movimientos' | 'recetas'>('movimientos');
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [totalMov, setTotalMov] = useState(0);
  const [totalRec, setTotalRec] = useState(0);
  const [page, setPage] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalMov, setModalMov] = useState(false);
  const [modalRec, setModalRec] = useState(false);
  const [formMov, setFormMov] = useState({ productoId: 0, tipo: 'E', cantidad: 0, costo: 0, motivo: '' });
  const [formRec, setFormRec] = useState({ productoId: 0, insumoId: 0, cantidad: 0 });
  const [guardando, setGuardando] = useState(false);

  const cargar = async () => {
    setCargando(true);
    setError(null);
    try {
      if (tab === 'movimientos') {
        const res = await listarMovimientos({ page, limit: LIMITE });
        setMovimientos(res.data);
        setTotalMov(res.total);
      } else {
        const res = await listarRecetas({ page, limit: LIMITE });
        setRecetas(res.data);
        setTotalRec(res.total);
      }
    } catch {
      setError('No fue posible cargar los datos.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { void cargar(); }, [page, tab]);

  const handleCrearMov = async () => {
    if (!formMov.productoId || !formMov.cantidad) { setError('Producto y cantidad son obligatorios.'); return; }
    setGuardando(true);
    try {
      await crearMovimiento({ productoId: formMov.productoId, tipo: formMov.tipo, cantidad: formMov.cantidad, costo: formMov.costo, motivo: formMov.motivo || undefined });
      setModalMov(false);
      setFormMov({ productoId: 0, tipo: 'E', cantidad: 0, costo: 0, motivo: '' });
      await cargar();
    } catch (e) { setError((e as Error).message); }
    finally { setGuardando(false); }
  };

  const handleCrearRec = async () => {
    if (!formRec.productoId || !formRec.insumoId || !formRec.cantidad) { setError('Todos los campos son obligatorios.'); return; }
    setGuardando(true);
    try {
      await crearReceta({ productoId: formRec.productoId, insumoId: formRec.insumoId, cantidad: formRec.cantidad });
      setModalRec(false);
      setFormRec({ productoId: 0, insumoId: 0, cantidad: 0 });
      await cargar();
    } catch (e) { setError((e as Error).message); }
    finally { setGuardando(false); }
  };

  const colorTipo = (t: string) => t === 'E' ? 'bg-green-100 text-green-700' : t === 'S' ? 'bg-red-100 text-red-700' : t === 'A' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700';
  const labelTipo = (t: string) => t === 'E' ? 'Entrada' : t === 'S' ? 'Salida' : t === 'A' ? 'Ajuste' : 'Merma';

  const totalPaginas = Math.max(1, Math.ceil((tab === 'movimientos' ? totalMov : totalRec) / LIMITE));

  return (
    <div className="y-shell" style={{ padding: '24px 16px 140px', maxWidth: 1240, margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--fg)' }}>Inventario</h1>
        <button onClick={() => tab === 'movimientos' ? setModalMov(true) : setModalRec(true)} className="rounded-lg bg-[#A61E22] px-4 py-2 text-sm font-semibold text-white hover:bg-[#7F1518]">
          + {tab === 'movimientos' ? 'Movimiento' : 'Receta'}
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => { setTab('movimientos'); setPage(1); }} className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${tab === 'movimientos' ? 'bg-[#A61E22] text-white' : 'bg-[#F5F5F5] hover:bg-[#D9D9D9]'}`}>Kardex</button>
        <button onClick={() => { setTab('recetas'); setPage(1); }} className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${tab === 'recetas' ? 'bg-[#A61E22] text-white' : 'bg-[#F5F5F5] hover:bg-[#D9D9D9]'}`}>Recetas</button>
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">{error} <button onClick={() => setError(null)} className="ml-2 underline">Cerrar</button></div>}

      {cargando ? (
        <div className="y-panel" style={{ padding: 24, textAlign: 'center' }}>Cargando...</div>
      ) : tab === 'movimientos' ? (
        movimientos.length === 0 ? (
          <div className="y-panel" style={{ padding: 24, textAlign: 'center' }}>No hay movimientos registrados.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F5F5F5] text-left text-xs uppercase tracking-wider text-[#333]/60">
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Producto</th>
                  <th className="px-3 py-2">Tipo</th>
                  <th className="px-3 py-2 text-right">Cantidad</th>
                  <th className="px-3 py-2 text-right">Costo</th>
                  <th className="px-3 py-2">Motivo</th>
                  <th className="px-3 py-2">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F5F5]">
                {movimientos.map((m) => (
                  <tr key={m.id} className="hover:bg-[#F5F5F5]">
                    <td className="px-3 py-2">{m.id}</td>
                    <td className="px-3 py-2">{m.producto}</td>
                    <td className="px-3 py-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${colorTipo(m.tipo)}`}>{labelTipo(m.tipo)}</span>
                    </td>
                    <td className="px-3 py-2 text-right">{m.cantidad}</td>
                    <td className="px-3 py-2 text-right">S/. {m.costo.toFixed(2)}</td>
                    <td className="px-3 py-2">{m.motivo || '—'}</td>
                    <td className="px-3 py-2">{new Date(m.fecha).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        recetas.length === 0 ? (
          <div className="y-panel" style={{ padding: 24, textAlign: 'center' }}>No hay recetas registradas.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F5F5F5] text-left text-xs uppercase tracking-wider text-[#333]/60">
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Producto</th>
                  <th className="px-3 py-2">Insumo</th>
                  <th className="px-3 py-2 text-right">Cantidad</th>
                  <th className="px-3 py-2">Unidad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F5F5]">
                {recetas.map((r) => (
                  <tr key={r.id} className="hover:bg-[#F5F5F5]">
                    <td className="px-3 py-2">{r.id}</td>
                    <td className="px-3 py-2">{r.producto}</td>
                    <td className="px-3 py-2">{r.insumo}</td>
                    <td className="px-3 py-2 text-right">{r.cantidad}</td>
                    <td className="px-3 py-2">{r.unidad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      <div className="flex items-center justify-center gap-2 mt-4">
        <button disabled={page <= 1} onClick={() => setPage((x) => Math.max(1, x - 1))} className="rounded-lg bg-white px-3 py-1.5 shadow-sm disabled:opacity-50">← Anterior</button>
        <span className="text-sm">Página {page} de {totalPaginas}</span>
        <button disabled={page >= totalPaginas} onClick={() => setPage((x) => x + 1)} className="rounded-lg bg-white px-3 py-1.5 shadow-sm disabled:opacity-50">Siguiente →</button>
      </div>

      {modalMov && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-[#7F1518] mb-4">Nuevo Movimiento</h2>
            <div className="flex flex-col gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase opacity-60">Producto ID *</span>
                <input type="number" value={formMov.productoId} onChange={(e) => setFormMov({ ...formMov, productoId: Number(e.target.value) })} className="rounded-lg bg-[#F5F5F5] px-3 py-2 text-sm" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase opacity-60">Tipo *</span>
                <select value={formMov.tipo} onChange={(e) => setFormMov({ ...formMov, tipo: e.target.value })} className="rounded-lg bg-[#F5F5F5] px-3 py-2 text-sm">
                  <option value="E">Entrada</option>
                  <option value="S">Salida</option>
                  <option value="A">Ajuste</option>
                  <option value="M">Merma</option>
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase opacity-60">Cantidad *</span>
                <input type="number" value={formMov.cantidad} onChange={(e) => setFormMov({ ...formMov, cantidad: Number(e.target.value) })} className="rounded-lg bg-[#F5F5F5] px-3 py-2 text-sm" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase opacity-60">Costo</span>
                <input type="number" value={formMov.costo} onChange={(e) => setFormMov({ ...formMov, costo: Number(e.target.value) })} className="rounded-lg bg-[#F5F5F5] px-3 py-2 text-sm" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase opacity-60">Motivo</span>
                <input value={formMov.motivo} onChange={(e) => setFormMov({ ...formMov, motivo: e.target.value })} className="rounded-lg bg-[#F5F5F5] px-3 py-2 text-sm" />
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setModalMov(false)} className="rounded-xl bg-[#F5F5F5] px-5 py-2.5 text-sm font-semibold hover:bg-[#D9D9D9]">Cancelar</button>
              <button onClick={() => void handleCrearMov()} disabled={guardando} className="rounded-xl bg-[#A61E22] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#7F1518] disabled:opacity-60">
                {guardando ? 'Guardando…' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalRec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-[#7F1518] mb-4">Nueva Receta</h2>
            <div className="flex flex-col gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase opacity-60">Producto ID *</span>
                <input type="number" value={formRec.productoId} onChange={(e) => setFormRec({ ...formRec, productoId: Number(e.target.value) })} className="rounded-lg bg-[#F5F5F5] px-3 py-2 text-sm" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase opacity-60">Insumo ID *</span>
                <input type="number" value={formRec.insumoId} onChange={(e) => setFormRec({ ...formRec, insumoId: Number(e.target.value) })} className="rounded-lg bg-[#F5F5F5] px-3 py-2 text-sm" />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase opacity-60">Cantidad *</span>
                <input type="number" value={formRec.cantidad} onChange={(e) => setFormRec({ ...formRec, cantidad: Number(e.target.value) })} className="rounded-lg bg-[#F5F5F5] px-3 py-2 text-sm" />
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setModalRec(false)} className="rounded-xl bg-[#F5F5F5] px-5 py-2.5 text-sm font-semibold hover:bg-[#D9D9D9]">Cancelar</button>
              <button onClick={() => void handleCrearRec()} disabled={guardando} className="rounded-xl bg-[#A61E22] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#7F1518] disabled:opacity-60">
                {guardando ? 'Guardando…' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
