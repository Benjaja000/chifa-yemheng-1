import { useEffect, useState } from 'react';
import type { Maestro } from '../../../services/maestros';
import { DistritoPicker } from '../../../components/distrito-picker';
import { listarDistritos } from '../personal/personal-service';
import { crearPersona, listarPersonas } from './personas-service';
import type { Persona, PersonaForm, TipoDocPersona } from './personas-types';
import { nombreCompleto } from './personas-types';

const LIMITE = 20;

const VACIO: PersonaForm = {
  tipoDoc: 'DNI',
  documento: '',
  nombres: '',
  apPaterno: '',
  apMaterno: '',
  telefono: '',
  correo: '',
  distritoId: 0,
  direccion: '',
  fNacimiento: '',
  genero: '',
};

function mensajeError(codigo: string): string {
  switch (codigo) {
    case 'YA_EXISTE':
      return 'El documento ya está registrado.';
    case 'VALIDATION_ERROR':
      return 'Revisa los datos del formulario.';
    default:
      return 'Ocurrió un error. Reintente.';
  }
}

function rolBadge(p: Persona): string {
  if (p.esPersonalActivo) {
    return 'Personal';
  }
  if (p.esClienteActivo) {
    return 'Cliente';
  }
  return 'Sin rol';
}

/** /admin/personas — Registro de personas (listar, filtrar, crear). */
export function PersonasPage() {
  const [page, setPage] = useState(1);
  const [buscar, setBuscar] = useState('');
  const [texto, setTexto] = useState('');
  const [datos, setDatos] = useState<Persona[]>([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [modalCrear, setModalCrear] = useState(false);
  const [form, setForm] = useState<PersonaForm>(VACIO);
  const [formError, setFormError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  const [distritos, setDistritos] = useState<Maestro[]>([]);

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

  useEffect(() => {
    void (async () => {
      try {
        setDistritos(await listarDistritos());
      } catch {
        setError('No fue posible cargar los distritos.');
      }
    })();
  }, []);

  const totalPaginas = Math.max(1, Math.ceil(total / LIMITE));

  const onCrear = async () => {
    setFormError(null);
    setGuardando(true);
    try {
      await crearPersona(form);
      setModalCrear(false);
      setForm(VACIO);
      await cargar();
    } catch (e) {
      setFormError(mensajeError((e as Error).message));
    } finally {
      setGuardando(false);
    }
  };

  const campo = 'w-full rounded-lg border border-[#D9D9D9] bg-[#F5F5F5] px-3 py-2 text-sm outline-none focus:border-[#A61E22] dark:border-white/10 dark:bg-white/10';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold">Personas</h1>
          <p className="text-sm opacity-60">Registro de personas. La asignación de rol se hace en Personal y Clientes.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setForm(VACIO);
            setFormError(null);
            setModalCrear(true);
          }}
          className="cursor-pointer rounded-xl bg-[#A61E22] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#7F1518]"
        >
          Nueva persona
        </button>
      </div>

      <section className="rounded-2xl border border-[#EADBCE] bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#241010]">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Buscar por nombre, documento o teléfono…"
            className={campo}
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

      {modalCrear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-[#2a0d0e]">
            <h2 className="text-lg font-bold">Nueva persona</h2>
            {formError && (
              <div role="alert" className="mt-3 rounded-lg border border-[#DC2626]/30 bg-[#DC2626]/10 p-3 text-sm">
                {formError}
              </div>
            )}
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold tracking-wider uppercase opacity-60">Tipo doc</span>
                <select value={form.tipoDoc} onChange={(e) => setForm({ ...form, tipoDoc: e.target.value as TipoDocPersona })} className={campo}>
                  <option value="DNI">DNI</option>
                  <option value="CE">CE</option>
                  <option value="PASAPORTE">PASAPORTE</option>
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold tracking-wider uppercase opacity-60">Documento *</span>
                <input value={form.documento} onChange={(e) => setForm({ ...form, documento: e.target.value })} className={campo} />
              </label>
              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="text-[11px] font-bold tracking-wider uppercase opacity-60">Nombres *</span>
                <input value={form.nombres} onChange={(e) => setForm({ ...form, nombres: e.target.value })} className={campo} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold tracking-wider uppercase opacity-60">Ap. paterno</span>
                <input value={form.apPaterno} onChange={(e) => setForm({ ...form, apPaterno: e.target.value })} className={campo} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold tracking-wider uppercase opacity-60">Ap. materno</span>
                <input value={form.apMaterno} onChange={(e) => setForm({ ...form, apMaterno: e.target.value })} className={campo} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold tracking-wider uppercase opacity-60">Celular (9 dígitos) *</span>
                <input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} className={campo} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold tracking-wider uppercase opacity-60">Correo</span>
                <input value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} className={campo} />
              </label>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="text-[11px] font-bold tracking-wider uppercase opacity-60">Distrito</span>
                <DistritoPicker value={form.distritoId} onChange={(id) => setForm({ ...form, distritoId: id })} distritos={distritos} cargando={false} />
              </div>
              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="text-[11px] font-bold tracking-wider uppercase opacity-60">Dirección</span>
                <input value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} className={campo} />
              </label>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setModalCrear(false)} className="cursor-pointer rounded-xl bg-[#F5F5F5] px-5 py-2.5 text-sm font-semibold hover:bg-[#D9D9D9] dark:bg-white/10">
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => void onCrear()}
                disabled={guardando}
                className="cursor-pointer rounded-xl bg-[#A61E22] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#7F1518] disabled:opacity-60"
              >
                {guardando ? 'Guardando…' : 'Crear persona'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
