import { useEffect, useState } from 'react';
import {
  actualizarUnidad,
  cambiarEstadoUnidad,
  crearUnidad,
  listarUnidades,
} from './unidades-service';
import type { Unidad, UnidadForm } from './unidades-types';

const LIMITE = 20;

const VACIO: UnidadForm = { nombre: '', abreviatura: '', codigoSunat: '', estado: 'A' };

const INPUT =
  'w-full rounded-lg border border-[#D9D9D9] bg-[#F5F5F5] px-3.5 py-2.5 text-sm outline-none focus:border-[#A61E22]';

/** /admin/unidades — ABM de unidades de medida (unidad_medida). */
export function UnidadesPage() {
  const [page, setPage] = useState(1);
  const [buscar, setBuscar] = useState('');
  const [estado, setEstado] = useState<'' | 'A' | 'I'>('');
  const [datos, setDatos] = useState<Unidad[]>([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<null | { editando: Unidad | null }>(null);
  const [form, setForm] = useState<UnidadForm>(VACIO);
  const [formError, setFormError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [confirmar, setConfirmar] = useState<Unidad | null>(null);

  const cargar = async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await listarUnidades({ page, limit: LIMITE, buscar, estado });
      setDatos(res.data);
      setTotal(res.total);
    } catch {
      setError('No fue posible cargar las unidades.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    void cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, buscar, estado]);

  const totalPaginas = Math.max(1, Math.ceil(total / LIMITE));

  const abrirNuevo = () => {
    setForm(VACIO);
    setFormError(null);
    setModal({ editando: null });
  };

  const abrirEditar = (u: Unidad) => {
    setForm({
      nombre: u.nombre,
      abreviatura: u.abreviatura,
      codigoSunat: u.codigoSunat ?? '',
      estado: u.estado,
    });
    setFormError(null);
    setModal({ editando: u });
  };

  const guardar = async () => {
    if (!form.nombre.trim()) {
      setFormError('El nombre es obligatorio.');
      return;
    }
    if (form.nombre.trim().length > 30) {
      setFormError('El nombre admite máximo 30 caracteres (BD).');
      return;
    }
    if (!form.abreviatura.trim()) {
      setFormError('La abreviatura es obligatoria.');
      return;
    }
    if (form.abreviatura.trim().length > 10) {
      setFormError('La abreviatura admite máximo 10 caracteres (BD).');
      return;
    }
    if (form.codigoSunat.trim().length > 5) {
      setFormError('El código SUNAT admite máximo 5 caracteres (BD).');
      return;
    }
    setGuardando(true);
    setFormError(null);
    try {
      const payload: UnidadForm = {
        nombre: form.nombre.trim(),
        abreviatura: form.abreviatura.trim(),
        codigoSunat: form.codigoSunat.trim(),
        estado: form.estado,
      };
      if (modal?.editando) {
        await actualizarUnidad(modal.editando.id, payload);
      } else {
        await crearUnidad(payload);
      }
      setModal(null);
      await cargar();
    } catch (e) {
      const codigo = (e as Error).message;
      setFormError(
        codigo === 'YA_EXISTE'
          ? 'Ya existe una unidad con ese nombre.'
          : 'No se pudo guardar. Reintente.',
      );
    } finally {
      setGuardando(false);
    }
  };

  const toggleEstado = async (u: Unidad, forzar = false) => {
    const nuevo = u.estado === 'A' ? 'I' : 'A';
    if (nuevo === 'I' && !forzar) {
      try {
        await cambiarEstadoUnidad(u.id, nuevo, false);
        await cargar();
      } catch (e) {
        const err = e as Error & { productosAsociados?: number };
        if (err.message === 'PRODUCTOS_ASOCIADOS') {
          setConfirmar(u);
        } else {
          setError('No se pudo cambiar el estado.');
        }
      }
      return;
    }
    try {
      await cambiarEstadoUnidad(u.id, nuevo, forzar);
      setConfirmar(null);
      await cargar();
    } catch {
      setError('No se pudo cambiar el estado.');
    }
  };

  return (
    <div className="flex w-full flex-col gap-6 pb-12">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <nav className="flex items-center gap-2 text-[11px] tracking-wider text-[#333333]/60 uppercase">
            <span>Inicio</span>
            <span>/</span>
            <span className="font-bold text-[#A61E22]">Unidades</span>
          </nav>
          <h1 className="mt-1 font-[Newsreader] text-3xl font-medium text-[#7F1518]">
            Unidades de Medida
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-[#333333]/70">
            Catálogo de unidades usado por productos y comprobantes (código SUNAT).
          </p>
        </div>
        <button
          onClick={abrirNuevo}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-[#A61E22] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#7F1518]"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span>Nueva Unidad</span>
        </button>
      </div>

      <div className="flex flex-col items-stretch justify-between gap-4 rounded-xl bg-white p-4 shadow-sm md:flex-row md:items-center">
        <div className="relative w-full md:w-96">
          <input
            value={buscar}
            onChange={(e) => {
              setBuscar(e.target.value);
              setPage(1);
            }}
            placeholder="Buscar por nombre…"
            className="w-full rounded-lg border border-[#D9D9D9] bg-[#F5F5F5] py-2 pr-12 pl-4 text-sm outline-none focus:border-[#A61E22]"
          />
          <span className="material-symbols-outlined absolute top-1/2 right-3 -translate-y-1/2 text-[18px] text-[#333333]/50">
            search
          </span>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold tracking-wider uppercase opacity-60">Estado:</label>
          <select
            value={estado}
            onChange={(e) => {
              setEstado(e.target.value as '' | 'A' | 'I');
              setPage(1);
            }}
            className="rounded-lg bg-[#F5F5F5] px-3 py-2 text-sm outline-none"
          >
            <option value="">Todas</option>
            <option value="A">Activas</option>
            <option value="I">Inactivas</option>
          </select>
        </div>
      </div>

      {cargando ? (
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="h-8 animate-pulse rounded bg-[#F5F5F5]" />
          <div className="mt-3 h-8 animate-pulse rounded bg-[#F5F5F5]" />
          <div className="mt-3 h-8 animate-pulse rounded bg-[#F5F5F5]" />
        </div>
      ) : error ? (
        <div className="rounded-xl bg-white p-6 text-center shadow-sm">
          <p>{error}</p>
          <button
            onClick={() => void cargar()}
            className="mt-3 cursor-pointer rounded-lg bg-[#A61E22] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#7F1518]"
          >
            Reintentar
          </button>
        </div>
      ) : datos.length === 0 ? (
        <div className="rounded-xl bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold">No existen unidades registradas.</p>
          <button
            onClick={abrirNuevo}
            className="mt-4 cursor-pointer rounded-xl bg-[#A61E22] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7F1518]"
          >
            Crear la primera
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="max-h-[60vh] overflow-auto">
              <table className="w-full border-collapse text-left">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-[#F5F5F5] text-[11px] tracking-wider text-[#333333]/60 uppercase">
                    <th className="px-6 py-3">Unidad</th>
                    <th className="px-6 py-3">Abreviatura</th>
                    <th className="px-6 py-3">Código SUNAT</th>
                    <th className="px-6 py-3 text-center">Estado</th>
                    <th className="w-44 px-6 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F5F5] text-sm">
                  {datos.map((u) => (
                    <tr key={u.id} className="transition-colors hover:bg-[#F5F5F5]">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-[#7F1518]">{u.nombre}</div>
                        <div className="text-[11px] tracking-wider text-[#333333]/50 uppercase">
                          ID: {u.id}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded bg-[#F5F5F5] px-2 py-1 text-xs font-semibold">
                          {u.abreviatura}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#333333]/70">{u.codigoSunat ?? '—'}</td>
                      <td className="px-6 py-4 text-center">
                        <BadgeEstado estado={u.estado} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            title="Editar unidad"
                            onClick={() => abrirEditar(u)}
                            className="rounded-lg p-1.5 text-[#D4A017] transition-colors hover:bg-[#F5F5F5]"
                          >
                            <span className="material-symbols-outlined text-[19px]">edit</span>
                          </button>
                          <button
                            title={u.estado === 'A' ? 'Desactivar unidad' : 'Activar unidad'}
                            onClick={() => void toggleEstado(u)}
                            className="rounded-lg p-1.5 text-[#A61E22] transition-colors hover:bg-[#F5F5F5]"
                          >
                            <span className="material-symbols-outlined text-[19px]">
                              {u.estado === 'A' ? 'toggle_on' : 'toggle_off'}
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col items-center justify-between gap-3 bg-[#F5F5F5]/60 p-4 text-sm text-[#333333]/70 sm:flex-row">
              <span>
                Mostrando <strong>{datos.length}</strong> de <strong>{total}</strong> unidades
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="cursor-pointer rounded-lg bg-white px-3 py-1.5 shadow-sm transition-colors hover:bg-[#F5F5F5] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ← Anterior
                </button>
                <span>
                  {page} / {totalPaginas}
                </span>
                <button
                  disabled={page >= totalPaginas}
                  onClick={() => setPage((p) => Math.min(totalPaginas, p + 1))}
                  className="cursor-pointer rounded-lg bg-white px-3 py-1.5 shadow-sm transition-colors hover:bg-[#F5F5F5] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Siguiente →
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {modal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <h2 className="font-[Newsreader] text-xl font-medium text-[#7F1518]">
              {modal.editando ? 'Editar unidad' : 'Nueva unidad'}
            </h2>
            <div className="mt-4 flex flex-col gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold tracking-wider uppercase opacity-60">
                  Nombre *
                </span>
                <input
                  value={form.nombre}
                  maxLength={30}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className={INPUT}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold tracking-wider uppercase opacity-60">
                  Abreviatura *
                </span>
                <input
                  value={form.abreviatura}
                  maxLength={10}
                  onChange={(e) => setForm({ ...form, abreviatura: e.target.value })}
                  className={INPUT}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold tracking-wider uppercase opacity-60">
                  Código SUNAT
                </span>
                <input
                  value={form.codigoSunat}
                  maxLength={5}
                  onChange={(e) => setForm({ ...form, codigoSunat: e.target.value })}
                  className={INPUT}
                />
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.estado === 'A'}
                  onChange={(e) => setForm({ ...form, estado: e.target.checked ? 'A' : 'I' })}
                />
                <span className="text-sm">Activa</span>
              </label>
              {formError ? <p className="text-sm text-red-600">{formError}</p> : null}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setModal(null)}
                className="cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-[#333333]/70 transition-colors hover:bg-[#F5F5F5]"
              >
                Cancelar
              </button>
              <button
                disabled={guardando}
                onClick={() => void guardar()}
                className="cursor-pointer rounded-lg bg-[#A61E22] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#7F1518] disabled:opacity-50"
              >
                {guardando ? 'Guardando…' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {confirmar ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">
            <p className="text-sm">
              La unidad <strong>{confirmar.nombre}</strong> está asociada a productos. ¿Desactivar de
              todos modos?
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setConfirmar(null)}
                className="cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-[#333333]/70 transition-colors hover:bg-[#F5F5F5]"
              >
                Cancelar
              </button>
              <button
                onClick={() => void toggleEstado(confirmar, true)}
                className="cursor-pointer rounded-lg bg-[#A61E22] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#7F1518]"
              >
                Desactivar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function BadgeEstado({ estado }: { estado: 'A' | 'I' }) {
  const activo = estado === 'A';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
        activo ? 'bg-emerald-50 text-emerald-700' : 'bg-[#F5F5F5] text-[#333333]/60'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${activo ? 'bg-emerald-500' : 'bg-[#333333]/40'}`} />
      {activo ? 'Activa' : 'Inactiva'}
    </span>
  );
}
