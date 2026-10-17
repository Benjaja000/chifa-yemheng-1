import { useEffect, useState } from 'react';
import { listarPersonas } from './personas-service';
import type { Persona } from './personas-types';
import { nombreCompleto } from './personas-types';

const LIMITE = 20;




function rolBadge(p: Persona): string {
  if (p.esPersonalActivo) {
    return 'Personal';
  }
  if (p.esClienteActivo) {
    return 'Cliente';
  }
  return 'Sin rol';
}

/** /admin/personas — Listado de personas (solo consulta). */
export function PersonasPage() {
  const [page, setPage] = useState(1);
  const [buscar, setBuscar] = useState('');
  const [texto, setTexto] = useState('');
  const [datos, setDatos] = useState<Persona[]>([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);



  const cargar = async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await listarPersonas({ page, limit: LIMITE, buscar });
      setDatos(res.data);
      setTotal(res.total);
    } catch {
      setError('No fue posible cargar las personas.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    void cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, buscar]);


  const totalPaginas = Math.max(1, Math.ceil(total / LIMITE));




  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Personas</h1>
          <p className="text-sm opacity-60">Registro de personas. La asignación de rol se hace en Personal y Clientes.</p>
        </div>
      </div>

      <section className="rounded-2xl border border-[#EADBCE] bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#241010]">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Buscar por nombre, documento o teléfono…"
            className="w-full rounded-lg border border-[#D9D9D9] bg-[#F5F5F5] px-3 py-2 text-sm outline-none focus:border-[#A61E22] dark:border-white/10 dark:bg-white/10"
          />
          <button
            type="button"
            onClick={() => {
              setPage(1);
              setBuscar(texto.trim());
            }}
            className="cursor-pointer rounded-xl bg-[#F5F5F5] px-5 py-2.5 text-sm font-semibold hover:bg-[#D9D9D9] dark:bg-white/10"
          >
            Filtrar
          </button>
        </div>
        {error && (
          <div role="alert" className="mt-3 rounded-lg border border-[#DC2626]/30 bg-[#DC2626]/10 p-3 text-sm">
            {error}
          </div>
        )}
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="text-[11px] tracking-wider uppercase opacity-60">
                <th className="px-3 py-2">Persona</th>
                <th className="px-3 py-2">Documento</th>
                <th className="px-3 py-2">Teléfono</th>
                <th className="px-3 py-2">Rol</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr>
                  <td colSpan={4} className="px-3 py-6 text-center text-sm opacity-60">
                    Cargando…
                  </td>
                </tr>
              ) : datos.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-3 py-6 text-center text-sm opacity-60">
                    No existen personas.
                  </td>
                </tr>
              ) : (
                datos.map((p) => (
                  <tr key={p.id} className="border-t border-[#F5F5F5] text-sm dark:border-white/10">
                    <td className="px-3 py-2 font-semibold">{nombreCompleto(p)}</td>
                    <td className="px-3 py-2">
                      {p.tipoDoc} {p.documento}
                    </td>
                    <td className="px-3 py-2">{p.telefono}</td>
                    <td className="px-3 py-2">{rolBadge(p)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="opacity-60">
            Total {total} · Página {page} de {totalPaginas}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((v) => Math.max(1, v - 1))}
              className="cursor-pointer rounded-lg bg-[#F5F5F5] px-4 py-1.5 font-semibold hover:bg-[#D9D9D9] disabled:opacity-50 dark:bg-white/10"
            >
              Anterior
            </button>
            <button
              type="button"
              disabled={page >= totalPaginas}
              onClick={() => setPage((v) => v + 1)}
              className="cursor-pointer rounded-lg bg-[#F5F5F5] px-4 py-1.5 font-semibold hover:bg-[#D9D9D9] disabled:opacity-50 dark:bg-white/10"
            >
              Siguiente
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
