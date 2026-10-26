import { useEffect, useMemo, useState } from 'react';
import { MapLeaflet } from '../../../shared/ui/MapLeaflet';
import {
  actualizarParametros,
  getParametros,
  guardarTarifaDistrito,
  listarTarifasDistrito,
  reversarGeocodificacion,
  sugerirDirecciones,
} from './delivery-parametros-service';
import type { ParametrosNegocio, SugerenciaDireccion, TarifaDistrito, TarifaForm } from './delivery-parametros-types';

const INPUT =
  'w-full rounded-lg border border-[#D9D9D9] bg-[#F5F5F5] px-3.5 py-2.5 text-sm outline-none focus:border-[#A61E22]';

export function ParametrosDeliveryPage() {
  const [params, setParams] = useState<ParametrosNegocio | null>(null);
  const [tarifas, setTarifas] = useState<TarifaDistrito[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [direccion, setDireccion] = useState('');
  const [radioCobertura, setRadioCobertura] = useState('');
  const [tarifaModal, setTarifaModal] = useState<TarifaDistrito | null>(null);
  const [tarifaForm, setTarifaForm] = useState<TarifaForm | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [sugerencias, setSugerencias] = useState<SugerenciaDireccion[]>([]);
  const [verSugerencias, setVerSugerencias] = useState(false);
  const [busquedaTarifa, setBusquedaTarifa] = useState('');
  const [centroMapa, setCentroMapa] = useState<[number, number] | null>(null);

  const cargar = async () => {
    setCargando(true);
    setError(null);
    try {
      const [p, t] = await Promise.all([getParametros(), listarTarifasDistrito()]);
      setParams(p);
      setDireccion(p.direccionLocal ?? '');
      setRadioCobertura(p.radioCoberturaKm != null ? String(p.radioCoberturaKm) : '');
      setTarifas(t);
    } catch {
      setError('No fue posible cargar los parámetros de delivery.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    void cargar();
  }, []);

  const tarifasFiltradas = useMemo(() => {
    const q = busquedaTarifa.trim().toLowerCase();
    if (!q) return tarifas;
    return tarifas.filter((t) => t.distrito.toLowerCase().includes(q));
  }, [tarifas, busquedaTarifa]);

  const ubicarDistrito = async (consulta: string) => {
    const s = await sugerirDirecciones(consulta);
    if (s[0]) setCentroMapa([s[0].lat, s[0].lng]);
  };

  const aplicarUbicacion = async (lat: number, lng: number) => {
    await fijarPunto(lat, lng);
    const dir = await reversarGeocodificacion(lat, lng);
    if (dir) {
      setDireccion(dir);
      try {
        setParams(await actualizarParametros({ direccionLocal: dir }));
      } catch {
        /* la direccion no es critica: el punto ya quedo guardado */
      }
    }
  };

  const buscarDireccion = async (q: string) => {
    setBusqueda(q);
    if (q.trim().length < 4) {
      setSugerencias([]);
      return;
    }
    setBuscando(true);
    try {
      setSugerencias(await sugerirDirecciones(q));
      setVerSugerencias(true);
    } finally {
      setBuscando(false);
    }
  };

  const fijarPunto = async (lat: number, lng: number) => {
    try {
      const p = await actualizarParametros({ latLocal: lat, lngLocal: lng });
      setParams(p);
      setAviso('Punto del local actualizado.');
    } catch {
      setError('No se pudo guardar el punto del local.');
    }
  };

  const guardarDireccion = async () => {
    try {
      const p = await actualizarParametros({ direccionLocal: direccion.trim() });
      setParams(p);
      setAviso('Dirección actualizada.');
    } catch {
      setError('No se pudo guardar la dirección.');
    }
  };

  const guardarRadio = async () => {
    const valor = radioCobertura.trim();
    try {
      const p = await actualizarParametros({
        radioCoberturaKm: valor === '' ? null : Number(valor),
      });
      setParams(p);
      setAviso(valor === '' ? 'Sin límite de cobertura.' : 'Radio de cobertura actualizado.');
    } catch {
      setError('No se pudo guardar el radio de cobertura.');
    }
  };

  const abrirEditarTarifa = (t: TarifaDistrito) => {
    setTarifaForm({ costoBase: t.costoBase, radioKm: t.radioKm, recargoKm: t.recargoKm });
    setFormError(null);
    setTarifaModal(t);
  };

  const guardarTarifaHandler = async () => {
    if (!tarifaModal || !tarifaForm) return;
    setGuardando(true);
    setFormError(null);
    try {
      await guardarTarifaDistrito(tarifaModal.distritoId, tarifaForm);
      setTarifaModal(null);
      await cargar();
    } catch {
      setFormError('No se pudo guardar la tarifa. Reintente.');
    } finally {
      setGuardando(false);
    }
  };

  const tienePunto = params?.latLocal != null && params?.lngLocal != null;

  const pinsLocal = useMemo(
    () =>
      params?.latLocal != null && params?.lngLocal != null
        ? [{ lat: params.latLocal, lng: params.lngLocal, label: 'Local', color: 'red' as const }]
        : [],
    [params?.latLocal, params?.lngLocal],
  );

  const centroMapaActual: [number, number] | undefined =
    centroMapa ?? (tienePunto ? [params!.latLocal!, params!.lngLocal!] : undefined);

  return (
    <div className="flex w-full flex-col gap-6 pb-12">
      <div>
        <nav className="flex items-center gap-2 text-[11px] tracking-wider text-[#333333]/60 uppercase">
          <span>Inicio</span>
          <span>/</span>
          <span className="font-bold text-[#A61E22]">Parámetros de Delivery</span>
        </nav>
        <h1 className="mt-1 font-[Newsreader] text-3xl font-medium text-[#7F1518]">Parámetros de Delivery</h1>
        <p className="mt-1 max-w-2xl text-sm text-[#333333]/70">
          Punto de origen del local y tarifas de envío por distrito. El costo sugerido se calcula desde el
          local hasta la ubicación del cliente.
        </p>
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
      ) : (
        <>
          {aviso ? <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{aviso}</div> : null}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <h2 className="font-[Newsreader] text-lg font-medium text-[#7F1518]">Punto del local</h2>
              <p className="mt-1 text-xs text-[#333333]/60">Busque la dirección o haga clic en el mapa para fijar el origen.</p>
              <div className="relative mt-3">
                <input
                  value={busqueda}
                  onChange={(e) => void buscarDireccion(e.target.value)}
                  onFocus={() => setVerSugerencias(true)}
                  onBlur={() => window.setTimeout(() => setVerSugerencias(false), 200)}
                  placeholder="Ej: Av. Los Incas, Ica"
                  className={INPUT}
                />
                {verSugerencias && (buscando || sugerencias.length > 0) ? (
                  <ul className="absolute z-40 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-[#D9D9D9] bg-white shadow-lg">
                    {buscando ? <li className="px-3 py-2 text-xs text-[#333333]/60">Buscando…</li> : null}
                    {sugerencias.map((s, i) => (
                      <li key={`${s.lat}-${s.lng}-${i}`}>
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setVerSugerencias(false);
                            setBusqueda(s.etiqueta);
                            void aplicarUbicacion(s.lat, s.lng);
                          }}
                          className="w-full cursor-pointer px-3 py-2 text-left text-xs hover:bg-[#F5F5F5]"
                        >
                          {s.etiqueta}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
              <div className="mt-3">
                <MapLeaflet
                  pins={pinsLocal}
                  center={centroMapaActual}
                  height="320px"
                  onClick={(e) => void fijarPunto(Number(e.latlng.lat.toFixed(6)), Number(e.latlng.lng.toFixed(6)))}
                />
              </div>
              <div className="mt-3 flex items-end gap-2">
                <label className="flex flex-1 flex-col gap-1.5">
                  <span className="text-[11px] font-bold tracking-wider uppercase opacity-60">Dirección del local</span>
                  <input value={direccion} maxLength={200} onChange={(e) => setDireccion(e.target.value)} className={INPUT} />
                </label>
                <button
                  onClick={() => void guardarDireccion()}
                  className="cursor-pointer rounded-lg bg-[#F5F5F5] px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-[#D9D9D9]"
                >
                  Guardar
                </button>
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-[#F5F5F5] p-3">
                  <dt className="text-[11px] font-bold tracking-wider uppercase opacity-60">Latitud</dt>
                  <dd className="font-semibold">{params?.latLocal ?? '—'}</dd>
                </div>
                <div className="rounded-lg bg-[#F5F5F5] p-3">
                  <dt className="text-[11px] font-bold tracking-wider uppercase opacity-60">Longitud</dt>
                  <dd className="font-semibold">{params?.lngLocal ?? '—'}</dd>
                </div>
              </dl>
              <div className="mt-3 flex items-end gap-2">
                <label className="flex flex-1 flex-col gap-1.5">
                  <span className="text-[11px] font-bold tracking-wider uppercase opacity-60">Radio de cobertura (km)</span>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={radioCobertura}
                    onChange={(e) => setRadioCobertura(e.target.value)}
                    placeholder="Vacío = sin límite"
                    className={INPUT}
                  />
                </label>
                <button
                  onClick={() => void guardarRadio()}
                  className="cursor-pointer rounded-lg bg-[#F5F5F5] px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-[#D9D9D9]"
                >
                  Guardar
                </button>
              </div>
              <p className="mt-2 text-xs text-[#333333]/60">
                Distancia máxima de entrega desde el local. Vacío o 0 = sin límite.
              </p>
              {!tienePunto ? (
                <p className="mt-2 rounded-lg bg-amber-50 p-2 text-xs text-amber-700">
                  Sin coordenadas: el costo sugerido usará solo la tarifa base.
                </p>
              ) : null}
            </div>

            <div className="rounded-xl bg-white p-4 shadow-sm">
              <h2 className="font-[Newsreader] text-lg font-medium text-[#7F1518]">Tarifas por distrito</h2>
              <input
                value={busquedaTarifa}
                onChange={(e) => setBusquedaTarifa(e.target.value)}
                placeholder="Buscar distrito…"
                className={`${INPUT} mt-3`}
              />
              <div className="mt-3 max-h-[460px] overflow-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="sticky top-0">
                    <tr className="bg-[#F5F5F5] text-[11px] tracking-wider text-[#333333]/60 uppercase">
                      <th className="px-3 py-2">Distrito</th>
                      <th className="px-3 py-2">Base</th>
                      <th className="px-3 py-2">Km incl.</th>
                      <th className="px-3 py-2">Recargo/km</th>
                      <th className="w-24 px-3 py-2" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5F5F5]">
                    {tarifasFiltradas.map((t) => (
                      <tr key={t.distritoId} className="hover:bg-[#F5F5F5]">
                        <td className="px-3 py-2">{t.distrito}</td>
                        <td className="px-3 py-2">{t.costoBase.toFixed(2)}</td>
                        <td className="px-3 py-2">{t.radioKm.toFixed(2)}</td>
                        <td className="px-3 py-2">{t.recargoKm.toFixed(2)}</td>
                        <td className="px-3 py-2 text-right whitespace-nowrap">
                          <button
                            title="Ubicar en el mapa"
                            onClick={() => void ubicarDistrito(`${t.distrito}, Peru`)}
                            className="cursor-pointer rounded-lg p-1.5 text-[#3B82F6] hover:bg-[#F5F5F5]"
                          >
                            <span className="material-symbols-outlined text-[18px]">my_location</span>
                          </button>
                          <button
                            title="Editar tarifa"
                            onClick={() => abrirEditarTarifa(t)}
                            className="cursor-pointer rounded-lg p-1.5 text-[#D4A017] hover:bg-[#F5F5F5]"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {tarifasFiltradas.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-3 py-6 text-center text-[#333333]/60">
                          {busquedaTarifa.trim() ? 'Sin coincidencias.' : 'No hay distritos registrados.'}
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {tarifaModal && tarifaForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
            <h2 className="font-[Newsreader] text-xl font-medium text-[#7F1518]">Tarifa de {tarifaModal.distrito}</h2>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold tracking-wider uppercase opacity-60">Base</span>
                <input
                  type="number"
                  step="0.01"
                  value={tarifaForm.costoBase}
                  onChange={(e) => setTarifaForm({ ...tarifaForm, costoBase: Number(e.target.value) })}
                  className={INPUT}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold tracking-wider uppercase opacity-60">Km incl.</span>
                <input
                  type="number"
                  step="0.01"
                  value={tarifaForm.radioKm}
                  onChange={(e) => setTarifaForm({ ...tarifaForm, radioKm: Number(e.target.value) })}
                  className={INPUT}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-bold tracking-wider uppercase opacity-60">Recargo/km</span>
                <input
                  type="number"
                  step="0.01"
                  value={tarifaForm.recargoKm}
                  onChange={(e) => setTarifaForm({ ...tarifaForm, recargoKm: Number(e.target.value) })}
                  className={INPUT}
                />
              </label>
            </div>
            {formError ? <p className="mt-3 text-sm text-red-600">{formError}</p> : null}
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setTarifaModal(null)}
                className="cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-[#333333]/70 transition-colors hover:bg-[#F5F5F5]"
              >
                Cancelar
              </button>
              <button
                disabled={guardando}
                onClick={() => void guardarTarifaHandler()}
                className="cursor-pointer rounded-lg bg-[#A61E22] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#7F1518] disabled:opacity-50"
              >
                {guardando ? 'Guardando…' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
