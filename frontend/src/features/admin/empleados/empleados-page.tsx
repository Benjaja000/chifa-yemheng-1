import { useEffect, useState } from 'react';
import { PageHeader } from '../../../components/ui';
import type { Maestro } from '../../../services/maestros';
import {
  actualizarEmpleado,
  cambiarEstadoEmpleado,
  crearEmpleado,
  listarCargos,
  listarContratos,
  listarPersonal,
  listarTiposIdentidad,
} from '../personal/personal-service';
import type { Personal, PersonalForm } from '../personal/personal-types';

const LIMITE = 20;

const VACIO: PersonalForm = {
  nombres: '',
  apPaterno: '',
  apMaterno: '',
  tipoDoc: 'DNI',
  documento: '',
  telefono: '',
  correo: '',
  direccion: '',
  distritoId: 0,
  fNacimiento: '',
  genero: '',
  cargoId: 0,
  contratoId: 0,
  turno: '',
  fondoPension: '',
  nHijos: null,
  essalud: '',
  fIngreso: '',
  fCese: '',
  sueldo: 0,
};

function tipoDocForm(valor: string): PersonalForm['tipoDoc'] {
  const normalizado = valor.trim().toUpperCase();
  if (normalizado === 'CE' || normalizado === 'CARNET EXTRANJERIA') {
    return 'CE';
  }
  if (normalizado === 'PAS' || normalizado === 'PASAPORTE') {
    return 'PASAPORTE';
  }
  return 'DNI';
}

function tiposPersona(tipos: Maestro[]): { valor: PersonalForm['tipoDoc']; label: string }[] {
  const opciones: { valor: PersonalForm['tipoDoc']; label: string }[] = [];
  for (const tipo of tipos) {
    const abreviatura = (tipo.abreviatura ?? '').trim().toUpperCase();
    if (abreviatura === 'DNI') {
      opciones.push({ valor: 'DNI', label: tipo.nombre });
    } else if (abreviatura === 'CE') {
      opciones.push({ valor: 'CE', label: tipo.nombre });
    } else if (abreviatura === 'PAS') {
      opciones.push({ valor: 'PASAPORTE', label: tipo.nombre });
    }
  }
  return opciones;
}

export function AdminEmpleadosPage() {
  const [buscar, setBuscar] = useState('');
  const [texto, setTexto] = useState('');
  const [estado, setEstado] = useState<'' | 'A' | 'I'>('');
  const [page, setPage] = useState(1);
  const [empleados, setEmpleados] = useState<Personal[]>([]);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorAccion, setErrorAccion] = useState<string | null>(null);
  const [cambiandoEstado, setCambiandoEstado] = useState<number | null>(null);
  const [cargos, setCargos] = useState<Maestro[]>([]);
  const [contratos, setContratos] = useState<Maestro[]>([]);
  const [tiposDoc, setTiposDoc] = useState<Maestro[]>([]);
  const [cargandoMaestros, setCargandoMaestros] = useState(true);
  const [errorMaestros, setErrorMaestros] = useState<string | null>(null);
  const [modal, setModal] = useState<null | { editando: Personal | null }>(null);
  const [form, setForm] = useState<PersonalForm>(VACIO);
  const [formError, setFormError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  const cargarEmpleados = async () => {
    setCargando(true);
    setError(null);
    try {
      const resultado = await listarPersonal({
        page,
        limit: LIMITE,
        buscar,
        cargo: '',
        turno: '',
        estado,
      });
      setEmpleados(resultado.data);
      setTotal(resultado.total);
    } catch {
      setError('No fue posible cargar los empleados.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    void cargarEmpleados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, buscar, estado]);

  const cargarMaestros = async () => {
    setCargandoMaestros(true);
    setErrorMaestros(null);
    try {
      const [listaCargos, listaContratos, listaTipos] = await Promise.all([
        listarCargos(),
        listarContratos(),
        listarTiposIdentidad(),
      ]);
      setCargos(listaCargos);
      setContratos(listaContratos);
      setTiposDoc(listaTipos);
    } catch {
      setErrorMaestros('No fue posible cargar cargos, contratos y documentos.');
    } finally {
      setCargandoMaestros(false);
    }
  };

  useEffect(() => {
    void cargarMaestros();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const abrirNuevo = () => {
    setForm(VACIO);
    setFormError(null);
    setModal({ editando: null });
  };

  const abrirEditar = (empleado: Personal) => {
    setForm({
      ...VACIO,
      nombres: empleado.nombres,
      apPaterno: empleado.apPaterno,
      apMaterno: empleado.apMaterno,
      tipoDoc: tipoDocForm(empleado.tipoDoc),
      documento: empleado.documento,
      telefono: empleado.telefono,
      correo: empleado.correo ?? '',
      direccion: empleado.direccion ?? '',
      distritoId: empleado.distritoId ?? 0,
      fNacimiento: (empleado.fNacimiento ?? '').slice(0, 10),
      genero: empleado.genero ?? '',
      cargoId: empleado.cargoId,
      contratoId: empleado.contratoId,
      turno: empleado.turno ?? '',
      fondoPension: empleado.fondoPension ?? '',
      nHijos: empleado.nHijos,
      essalud: empleado.essalud ?? '',
      fIngreso: (empleado.fIngreso ?? '').slice(0, 10),
      fCese: (empleado.fCese ?? '').slice(0, 10),
      sueldo: empleado.sueldo,
    });
    setFormError(null);
    setModal({ editando: empleado });
  };

  const validar = (): string | null => {
    if (!form.nombres.trim()) {
      return 'Los nombres son obligatorios.';
    }
    if (!form.documento.trim()) {
      return 'El documento es obligatorio.';
    }
    if (form.tipoDoc === 'DNI' && !/^\d{8}$/.test(form.documento.trim())) {
      return 'El DNI debe tener 8 dígitos.';
    }
    if (!/^\d{9}$/.test(form.telefono.trim())) {
      return 'El celular debe tener 9 dígitos.';
    }
    if (!form.cargoId || !form.contratoId) {
      return 'Selecciona el cargo y el contrato.';
    }
    if (form.correo.trim() && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.correo.trim())) {
      return 'El correo no es válido.';
    }
    if (form.sueldo < 0) {
      return 'El sueldo no puede ser negativo.';
    }
    return null;
  };

  const guardar = async () => {
    const validacion = validar();
    if (validacion) {
      setFormError(validacion);
      return;
    }

    setGuardando(true);
    setFormError(null);
    try {
      if (modal?.editando) {
        await actualizarEmpleado(modal.editando.id, {
          ...form,
          fCese: form.fCese || undefined,
        });
      } else {
        await crearEmpleado({ ...form, fIngreso: form.fIngreso || undefined });
      }
      setModal(null);
      await cargarEmpleados();
    } catch (e) {
      const codigo = (e as Error).message;
      setFormError(
        codigo === 'YA_EXISTE'
          ? 'Ya existe un empleado con ese documento.'
          : 'No se pudo guardar el empleado. Revisa los datos e inténtalo nuevamente.',
      );
    } finally {
      setGuardando(false);
    }
  };

  const cambiarEstado = async (empleado: Personal) => {
    setCambiandoEstado(empleado.id);
    setErrorAccion(null);
    try {
      await cambiarEstadoEmpleado(empleado.id, empleado.estado === 'A' ? 'I' : 'A');
      await cargarEmpleados();
    } catch {
      setErrorAccion('No se pudo cambiar el estado del empleado. Inténtalo nuevamente.');
    } finally {
      setCambiandoEstado(null);
    }
  };

  const totalPaginas = Math.max(1, Math.ceil(total / LIMITE));
  const opcionesTipoDoc = tiposPersona(tiposDoc);

  return (
    <div className="y-shell" style={{ padding: '24px 16px 140px', maxWidth: 1240, margin: '0 auto' }}>
      <PageHeader title="Empleados" sub="Consulta y administra los registros de personal." />

      <div className="y-panel" style={{ padding: 20, marginTop: 16 }}>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold">Directorio de empleados</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {total} {total === 1 ? 'empleado registrado' : 'empleados registrados'}
            </p>
          </div>
          <button
            type="button"
            onClick={abrirNuevo}
            className="rounded-xl bg-[#A61E22] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7F1518]"
          >
            + Nuevo empleado
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_180px_auto]">
          <form
            className="flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              setBuscar(texto.trim());
              setPage(1);
            }}
          >
            <input
              aria-label="Buscar empleados"
              value={texto}
              onChange={(event) => setTexto(event.target.value)}
              placeholder="Buscar por nombre, documento o celular"
              className="min-w-0 flex-1 rounded-xl border border-[#D9D9D9] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#A61E22]"
            />
            <button
              type="submit"
              className="rounded-xl border border-[#D9D9D9] px-4 py-2.5 text-sm font-semibold hover:bg-[#F5F5F5]"
            >
              Buscar
            </button>
          </form>
          <select
            aria-label="Filtrar por estado"
            value={estado}
            onChange={(event) => {
              setEstado(event.target.value as '' | 'A' | 'I');
              setPage(1);
            }}
            className="rounded-xl border border-[#D9D9D9] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#A61E22]"
          >
            <option value="">Todos los estados</option>
            <option value="A">Activos</option>
            <option value="I">Inactivos</option>
          </select>
          <button
            type="button"
            onClick={() => void cargarEmpleados()}
            className="rounded-xl border border-[#D9D9D9] px-4 py-2.5 text-sm font-semibold hover:bg-[#F5F5F5]"
          >
            Actualizar
          </button>
        </div>

        {errorAccion && (
          <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
            {errorAccion}
          </p>
        )}

        <div className="mt-5">
          {cargando ? (
            <div role="status" className="py-12 text-center text-sm text-[var(--muted)]">
              Cargando empleados…
            </div>
          ) : error ? (
            <div className="py-12 text-center">
              <p role="alert" className="text-sm text-red-800">{error}</p>
              <button
                type="button"
                onClick={() => void cargarEmpleados()}
                className="mt-3 rounded-lg bg-[#A61E22] px-4 py-2 text-sm font-semibold text-white hover:bg-[#7F1518]"
              >
                Reintentar
              </button>
            </div>
          ) : empleados.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-semibold">No se encontraron empleados.</p>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Prueba con otra búsqueda o registra un nuevo empleado.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#D9D9D9] text-xs uppercase text-[var(--muted)]">
                    <th scope="col" className="px-3 py-3 font-semibold">Empleado</th>
                    <th scope="col" className="px-3 py-3 font-semibold">Documento</th>
                    <th scope="col" className="px-3 py-3 font-semibold">Cargo</th>
                    <th scope="col" className="px-3 py-3 font-semibold">Contacto</th>
                    <th scope="col" className="px-3 py-3 font-semibold">Estado</th>
                    <th scope="col" className="px-3 py-3 text-right font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {empleados.map((empleado) => (
                    <tr key={empleado.id} className="border-b border-[#F0F0F0] last:border-0">
                      <td className="px-3 py-4">
                        <div className="font-semibold">
                          {empleado.nombres} {empleado.apPaterno} {empleado.apMaterno}
                        </div>
                        <div className="mt-1 text-xs text-[var(--muted)]">
                          {empleado.turno || 'Sin turno'} · {empleado.area || 'Sin área'}
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div>{empleado.tipoDoc}</div>
                        <div className="mt-1 text-xs text-[var(--muted)]">{empleado.documento}</div>
                      </td>
                      <td className="px-3 py-4">{empleado.cargo || 'Sin cargo'}</td>
                      <td className="px-3 py-4">
                        <div>{empleado.telefono}</div>
                        <div className="mt-1 text-xs text-[var(--muted)]">
                          {empleado.correo || 'Sin correo'}
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            empleado.estado === 'A'
                              ? 'bg-green-50 text-green-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {empleado.estado === 'A' ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => abrirEditar(empleado)}
                            className="rounded-lg border border-[#D9D9D9] px-3 py-2 text-xs font-semibold hover:bg-[#F5F5F5]"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            disabled={cambiandoEstado === empleado.id}
                            onClick={() => void cambiarEstado(empleado)}
                            className="rounded-lg border border-[#D9D9D9] px-3 py-2 text-xs font-semibold hover:bg-[#F5F5F5] disabled:cursor-wait disabled:opacity-50"
                          >
                            {cambiandoEstado === empleado.id
                              ? 'Guardando…'
                              : empleado.estado === 'A'
                                ? 'Desactivar'
                                : 'Activar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!cargando && !error && total > 0 && (
          <div className="mt-4 flex items-center justify-between border-t border-[#F0F0F0] pt-4 text-sm">
            <span className="text-[var(--muted)]">
              Página {page} de {totalPaginas}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((actual) => actual - 1)}
                className="rounded-lg border border-[#D9D9D9] px-3 py-2 disabled:opacity-40"
              >
                Anterior
              </button>
              <button
                type="button"
                disabled={page >= totalPaginas}
                onClick={() => setPage((actual) => actual + 1)}
                className="rounded-lg border border-[#D9D9D9] px-3 py-2 disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 backdrop-blur-xs sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !guardando) {
              setModal(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="empleado-form-title"
            className="flex max-h-[95vh] w-full max-w-3xl flex-col overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            <header className="sticky top-0 flex items-center justify-between bg-[#7F1518] px-5 py-4 text-white">
              <h2 id="empleado-form-title" className="text-lg font-bold">
                {modal.editando ? 'Editar empleado' : 'Nuevo empleado'}
              </h2>
              <button
                type="button"
                aria-label="Cerrar"
                disabled={guardando}
                onClick={() => setModal(null)}
                className="rounded-lg px-2 py-1 text-xl hover:bg-white/10 disabled:opacity-50"
              >
                ×
              </button>
            </header>

            <form
              className="flex flex-col gap-5 p-5"
              onSubmit={(event) => {
                event.preventDefault();
                void guardar();
              }}
            >
              {formError && (
                <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                  {formError}
                </p>
              )}
              {errorMaestros && (
                <div role="alert" className="flex items-center justify-between gap-3 rounded-lg bg-amber-50 p-3 text-sm">
                  <span>{errorMaestros}</span>
                  <button
                    type="button"
                    onClick={() => void cargarMaestros()}
                    className="shrink-0 font-semibold underline"
                  >
                    Reintentar
                  </button>
                </div>
              )}

              <fieldset disabled={guardando} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <legend className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Datos personales
                </legend>
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold">Nombres *</span>
                  <input
                    required
                    maxLength={80}
                    value={form.nombres}
                    onChange={(event) => setForm({ ...form, nombres: event.target.value })}
                    className="rounded-lg border border-[#D9D9D9] px-3 py-2.5 text-sm outline-none focus:border-[#A61E22]"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold">Apellido paterno</span>
                  <input
                    maxLength={80}
                    value={form.apPaterno}
                    onChange={(event) => setForm({ ...form, apPaterno: event.target.value })}
                    className="rounded-lg border border-[#D9D9D9] px-3 py-2.5 text-sm outline-none focus:border-[#A61E22]"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold">Apellido materno</span>
                  <input
                    maxLength={80}
                    value={form.apMaterno}
                    onChange={(event) => setForm({ ...form, apMaterno: event.target.value })}
                    className="rounded-lg border border-[#D9D9D9] px-3 py-2.5 text-sm outline-none focus:border-[#A61E22]"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold">Tipo de documento *</span>
                  <select
                    required
                    value={form.tipoDoc}
                    disabled={!!modal.editando || cargandoMaestros || opcionesTipoDoc.length === 0}
                    onChange={(event) =>
                      setForm({ ...form, tipoDoc: event.target.value as PersonalForm['tipoDoc'] })
                    }
                    className="rounded-lg border border-[#D9D9D9] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#A61E22] disabled:opacity-60"
                  >
                    {opcionesTipoDoc.map((tipo) => (
                      <option key={tipo.valor} value={tipo.valor}>{tipo.label}</option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold">Documento *</span>
                  <input
                    required
                    maxLength={15}
                    disabled={!!modal.editando}
                    value={form.documento}
                    onChange={(event) => setForm({ ...form, documento: event.target.value })}
                    className="rounded-lg border border-[#D9D9D9] px-3 py-2.5 text-sm outline-none focus:border-[#A61E22] disabled:bg-gray-100"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold">Celular (9 dígitos) *</span>
                  <input
                    required
                    inputMode="numeric"
                    maxLength={9}
                    value={form.telefono}
                    onChange={(event) =>
                      setForm({ ...form, telefono: event.target.value.replace(/\D/g, '') })
                    }
                    className="rounded-lg border border-[#D9D9D9] px-3 py-2.5 text-sm outline-none focus:border-[#A61E22]"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold">Correo</span>
                  <input
                    type="email"
                    maxLength={50}
                    value={form.correo}
                    onChange={(event) => setForm({ ...form, correo: event.target.value })}
                    className="rounded-lg border border-[#D9D9D9] px-3 py-2.5 text-sm outline-none focus:border-[#A61E22]"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold">Fecha de nacimiento</span>
                  <input
                    type="date"
                    value={form.fNacimiento}
                    onChange={(event) => setForm({ ...form, fNacimiento: event.target.value })}
                    className="rounded-lg border border-[#D9D9D9] px-3 py-2.5 text-sm outline-none focus:border-[#A61E22]"
                  />
                </label>
                <label className="flex flex-col gap-1 sm:col-span-2">
                  <span className="text-xs font-semibold">Dirección</span>
                  <input
                    maxLength={100}
                    value={form.direccion}
                    onChange={(event) => setForm({ ...form, direccion: event.target.value })}
                    className="rounded-lg border border-[#D9D9D9] px-3 py-2.5 text-sm outline-none focus:border-[#A61E22]"
                  />
                </label>
              </fieldset>

              <fieldset disabled={guardando} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <legend className="mb-1 text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                  Datos laborales
                </legend>
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold">Cargo *</span>
                  <select
                    required
                    value={form.cargoId || ''}
                    disabled={cargandoMaestros || cargos.length === 0}
                    onChange={(event) => setForm({ ...form, cargoId: Number(event.target.value) })}
                    className="rounded-lg border border-[#D9D9D9] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#A61E22] disabled:opacity-60"
                  >
                    <option value="">Seleccionar cargo</option>
                    {cargos.map((cargo) => (
                      <option key={cargo.id} value={cargo.id}>{cargo.nombre}</option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold">Contrato *</span>
                  <select
                    required
                    value={form.contratoId || ''}
                    disabled={cargandoMaestros || contratos.length === 0}
                    onChange={(event) => setForm({ ...form, contratoId: Number(event.target.value) })}
                    className="rounded-lg border border-[#D9D9D9] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#A61E22] disabled:opacity-60"
                  >
                    <option value="">Seleccionar contrato</option>
                    {contratos.map((contrato) => (
                      <option key={contrato.id} value={contrato.id}>{contrato.nombre}</option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold">Turno</span>
                  <input
                    maxLength={18}
                    value={form.turno}
                    onChange={(event) => setForm({ ...form, turno: event.target.value })}
                    className="rounded-lg border border-[#D9D9D9] px-3 py-2.5 text-sm outline-none focus:border-[#A61E22]"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold">Fecha de ingreso</span>
                  <input
                    type="date"
                    value={form.fIngreso}
                    onChange={(event) => setForm({ ...form, fIngreso: event.target.value })}
                    className="rounded-lg border border-[#D9D9D9] px-3 py-2.5 text-sm outline-none focus:border-[#A61E22]"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold">Sueldo</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.sueldo}
                    onChange={(event) => setForm({ ...form, sueldo: Number(event.target.value) })}
                    className="rounded-lg border border-[#D9D9D9] px-3 py-2.5 text-sm outline-none focus:border-[#A61E22]"
                  />
                </label>
              </fieldset>

              <div className="flex justify-end gap-2 border-t border-[#F0F0F0] pt-4">
                <button
                  type="button"
                  disabled={guardando}
                  onClick={() => setModal(null)}
                  className="rounded-xl border border-[#D9D9D9] px-4 py-2.5 text-sm font-semibold hover:bg-[#F5F5F5] disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando || cargandoMaestros || !!errorMaestros}
                  className="rounded-xl bg-[#A61E22] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#7F1518] disabled:cursor-wait disabled:opacity-50"
                >
                  {guardando ? 'Guardando…' : 'Guardar empleado'}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
