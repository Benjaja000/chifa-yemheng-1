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

/** /admin/unidades — ABM de unidades de medida (unidades.md). */
export function UnidadesPage() {
  const [page, setPage] = useState(1);
  const [nombre, setNombre] = useState('');
  const [busqueda, setBusqueda] = useState('');
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
      const res = await listarUnidades({ page, limit: LIMITE, nombre: busqueda, estado });
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
  }, [page, busqueda, estado]);

  const totalPaginas = Math.max(1, Math.ceil(total / LIMITE));

  const abrirNuevo = () => {
    setForm(VACIO);
    setFormError(null);
    setModal({ editando: null });
  };

  const abrirEditar = (u: Unidad) => {
    setForm({ nombre: u.nombre, abreviatura: u.abreviatura, codigoSunat: u.codigoSunat ?? '', estado: u.estado });
    setFormError(null);
    setModal({ editando: u });
  };

  const guardar = async () => {
    if (!form.nombre.trim()) {
      setFormError('El nombre es obligatorio (máx. 30).');
      return;
    }
    if (!form.abreviatura.trim()) {
      setFormError('La abreviatura es obligatoria (máx. 10).');
      return;
    }
    setGuardando(true);
    setFormError(null);
    try {
      const payload = { ...form, nombre: form.nombre.trim(), abreviatura: form.abreviatura.trim().toUpperCase(), codigoSunat: form.codigoSunat.trim().toUpperCase() };
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
    if (nuevo === 'I' && u.productosAsociados > 0 && !forzar) {
      setConfirmar(u);
      return;
    }
    try {
      await cambiarEstadoUnidad(u.id, nuevo, forzar);
      setConfirmar(null);
      await cargar();
    } catch (e) {
      const err = e as Error & { productosAsociados?: number };
      if (err.message === 'TIENE_PRODUCTOS') {
        setConfirmar(u);
      } else {
        setError('No se pudo cambiar el estado.');
      }
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
          <p className="mt-1 max-w-3xl text-sm text-[#333333]/70">
            Unidades de medida del catálogo (<strong>UNIDAD_MEDIDA</strong>). Se usan al registrar productos.
          </p>
        </div>
        <button
          onClick={abrirNuevo}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-[#A61E22] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#7F1518]"
        >
          <span className="material-symbols-outlined text-[22px]">add</span>
          <span>Nueva Unidad</span>
        </button>
      </div>

      <div className="grid grid-cols-1 items-center gap-3 rounded-xl bg-white p-4 shadow-sm md:grid-cols-2 lg:grid-cols-12">
        <div className="relative lg:col-span-8">
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setBusqueda(nombre);
                setPage(1);
              }
            }}
            placeholder="Buscar por nombre…"
            className="w-full rounded-xl bg-[#F5F5F5] py-2.5 pr-12 pl-4 text-sm outline-none focus:bg-white focus:ring-1 focus:ring-[#A61E22]"
          />
          <button
            type="button"
            aria-label="Buscar"
            onClick={() => {
              setBusqueda(nombre);
              setPage(1);
            }}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-lg bg-[#A61E22] p-1.5 text-white transition-colors hover:bg-[#7F1518]"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
          </button>
        </div>
        <select
          value={estado}
          onChange={(e) => {
            setEstado(e.target.value as '' | 'A' | 'I');
            setPage(1);
          }}
          className="cursor-pointer rounded-xl bg-[#F5F5F5] px-3.5 py-2.5 text-sm outline-none lg:col-span-4"
        >
          <option value="">Estado: Todos</option>
          <option value="A">Activo</option>
          <option value="I">Inactivo</option>
        </select>
      </div>

      {cargando ? (
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="h-8 animate-pulse rounded bg-[#F5F5F5]" />
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
        <div className="hidden overflow-hidden rounded-xl bg-white shadow-sm md:block">
          <div className="max-h-[60vh] overflow-auto">
            <table className="w-full border-collapse text-left">
              <thead className="sticky top-0 z-10">
                <tr className="bg-[#F5F5F5] text-[11px] tracking-wider text-[#333333]/60 uppercase">
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Abreviatura</th>
                  <th className="px-4 py-3">Código SUNAT</th>
                  <th className="px-4 py-3 text-center">Productos</th>
                  <th className="px-4 py-3 text-center">Estado</th>
                  <th className="w-36 px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F5F5] text-sm">
                {datos.map((u) => (
                  <tr key={u.id} className="transition-colors hover:bg-[#F5F5F5]">
                    <td className="px-4 py-3 font-semibold">{u.nombre}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-[#F2C94C]/30 px-2.5 py-1 text-[11px] font-bold">
                        {u.abreviatura}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{u.codigoSunat || '—'}</td>
                    <td className="px-4 py-3 text-center">{u.productosAsociados}</td>
                    <td className="px-4 py-3 text-center">
                      {u.estado === 'A' ? (
                        <span className="rounded bg-[#22C55E]/15 px-2 py-0.5 text-[11px] font-bold text-[#22C55E]">
                          Activo
                        </span>
                      ) : (
                        <span className="rounded bg-[#D9D9D9]/40 px-2 py-0.5 text-[11px] font-bold text-[#333333]/60">
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          title="Editar unidad"
                          onClick={() => abrirEditar(u)}
                          className="rounded-lg p-1.5 text-[#2563EB] transition-colors hover:bg-[#2563EB]/10"
                        >
                          <span className="material-symbols-outlined text-[19px]">edit</span>
                        </button>
                        <Toggle
                          activo={u.estado === 'A'}
                          titulo={u.estado === 'A' ? 'Desactivar' : 'Activar'}
                          onClick={() => void toggleEstado(u)}
                        />
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
                onClick={() => setPage((x) => Math.max(1, x - 1))}
                className="cursor-pointer rounded-lg bg-white px-3 py-1.5 shadow-sm transition-colors hover:bg-[#F5F5F5] disabled:cursor-not-allowed disabled:opacity-50"
              >
                ← Anterior
              </button>
              <span>
                Página {page} de {totalPaginas}
              </span>
              <button
                disabled={page >= totalPaginas}
                onClick={() => setPage((x) => x + 1)}
                className="cursor-pointer rounded-lg bg-white px-3 py-1.5 shadow-sm transition-colors hover:bg-[#F5F5F5] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Siguiente →
              </button>
            </div>
          </div>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-0 backdrop-blur-xs sm:p-4">
          <div className="flex max-h-[90vh] w-full flex-col overflow-y-auto bg-white shadow-2xl sm:max-w-lg sm:rounded-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between bg-[#F5F5F5] px-6 py-4">
              <h2 className="text-xl font-bold text-[#7F1518]">
                {modal.editando ? 'Editar Unidad' : 'Nueva Unidad'}
              </h2>
              <button
                onClick={() => setModal(null)}
                aria-label="Cerrar"
                className="rounded-lg p-2 transition-colors hover:bg-[#D9D9D9]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-4 p-6">
              {formError && (
                <div role="alert" className="rounded-lg border border-[#DC2626]/30 bg-[#DC2626]/10 p-3 text-sm">
                  {formError}
                </div>
              )}
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold tracking-wider uppercase opacity-60">
                  Nombre <span className="text-[#A61E22]">*</span>
                </span>
                <input
                  value={form.nombre}
                  maxLength={30}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Ej. Kilogramo"
                  className="rounded-lg bg-[#F5F5F5] px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:ring-1 focus:ring-[#A61E22]"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold tracking-wider uppercase opacity-60">
                  Abreviatura <span className="text-[#A61E22]">*</span>
                </span>
                <input
                  value={form.abreviatura}
                  maxLength={10}
                  onChange={(e) => setForm({ ...form, abreviatura: e.target.value })}
                  placeholder="Ej. KG"
                  className="rounded-lg bg-[#F5F5F5] px-3.5 py-2.5 text-sm outline-none focus:bg-white focus:ring-1 focus:ring-[#A61E22]"
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold tracking-wider uppercase opacity-60">
                  Código SUNAT <span className="normal-case opacity-70">(opcional)</span>
                </span>
                <input
                  value={form.codigoSunat}
                  maxLength={5}
                  onChange={(e) => setForm({ ...form, codigoSunat: e.target.value })}
                  placeholder="Ej. KGM"
                  className="rounded-lg bg-[#F5F5F5] px-3.5 py-2.5 font-mono text-sm outline-none focus:bg-white focus:ring-1 focus:ring-[#A61E22]"
                />
              </label>
            </div>
            <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-[#F5F5F5] bg-white px-6 py-4">
              <button
                onClick={() => setModal(null)}
                className="rounded-xl bg-[#F5F5F5] px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-[#D9D9D9]"
              >
                Cancelar
              </button>
              <button
                onClick={() => void guardar()}
                disabled={guardando}
                className="flex items-center gap-2 rounded-xl bg-[#A61E22] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#7F1518] disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-[20px]">save</span>
                <span>{guardando ? 'Guardando…' : 'Guardar Unidad'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-bold">Desactivar con productos asociados</h2>
            <p className="mt-2 text-sm opacity-70">
              <strong>{confirmar.nombre}</strong> tiene {confirmar.productosAsociados} producto(s)
              asociado(s). Ya no aparecerá como opción al crear productos.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setConfirmar(null)}
                className="rounded-xl bg-[#F5F5F5] px-5 py-2.5 text-sm font-semibold hover:bg-[#D9D9D9]"
              >
                Cancelar
              </button>
              <button
                onClick={() => void toggleEstado(confirmar, true)}
                className="rounded-xl bg-[#A61E22] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#7F1518]"
              >
                Desactivar igual
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Toggle({ activo, titulo, onClick }: { activo: boolean; titulo: string; onClick: () => void }) {
  return (
    <button
      title={titulo}
      onClick={onClick}
      className={`relative flex h-6 w-11 cursor-pointer items-center rounded-full p-0.5 transition-colors hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A61E22]/50 dark:hover:brightness-110 ${
        activo ? 'bg-[#A61E22]' : 'bg-[#D9D9D9]'
      }`}
    >
      <div
        className={`h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
          activo ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}
