import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { api } from '@/shared/services/api-client';
import { Badge } from '@/shared/ui/Badge';
import { Button } from '@/shared/ui/Button';
import { MapLeaflet } from '@/shared/ui/MapLeaflet';

interface Distrito {
  id_distrito: number;
  d_distrito: string;
  id_provincia: number;
}

interface Provincia {
  id_provincia: number;
  d_provincia: string;
  id_departamento: number;
}

interface Departamento {
  id_departamento: number;
  d_departamento: string;
}

interface CoberturaDelivery {
  latLocal: number | null;
  lngLocal: number | null;
  direccionLocal: string | null;
  radioCoberturaKm: number | null;
}

interface DireccionStepProps {
  direccion: string;
  distritoId: number | null;
  referencia: string;
  telefono: string;
  costoEnvio: number;
  onDireccionChange: (direccion: string) => void;
  onDistritoChange: (distritoId: number | null) => void;
  onReferenciaChange: (referencia: string) => void;
  onTelefonoChange: (telefono: string) => void;
  onCostoChange: (costoEnvio: number) => void;
  onGpsChange: (lat: number, lng: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

const buscarSugerencias = async (query: string): Promise<Array<{ etiqueta: string; lat: number; lng: number }>> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
      { headers: { 'User-Agent': 'ChifaYemheng/1.0', 'Accept-Language': 'es' } }
    );

    if (!response.ok) return [];

    const data = (await response.json()) as Array<{ display_name: string; lat: string; lon: string }>;
    return data.map((d) => ({
      etiqueta: d.display_name,
      lat: Number.parseFloat(d.lat),
      lng: Number.parseFloat(d.lon),
    }));
  } catch (error) {
    console.error('Error buscando sugerencias:', error);
    return [];
  }
};

const reverseGeocode = async (lat: number, lng: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      { headers: { 'User-Agent': 'ChifaYemheng/1.0', 'Accept-Language': 'es' } }
    );

    if (!response.ok) throw new Error('Reverse geocoding failed');
    return (await response.json()) as {
      display_name?: string;
      address?: Record<string, string | undefined>;
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
};

function normalizarNombre(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/^(departamento|provincia|distrito|region)\s+(de|del)\s+/, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

function buscarMaestro<T extends { d_departamento?: string; d_provincia?: string; d_distrito?: string }>(
  rows: T[],
  property: 'd_departamento' | 'd_provincia' | 'd_distrito',
  candidates: Array<string | undefined>,
): T | undefined {
  const names = new Set(candidates.filter((value): value is string => Boolean(value)).map(normalizarNombre));
  return rows.find((row) => {
    const name = row[property];
    return Boolean(name && names.has(normalizarNombre(name)));
  });
}

export function DireccionStep(props: DireccionStepProps) {
  const {
    direccion,
    distritoId,
    referencia,
    telefono,
    costoEnvio,
    onDireccionChange,
    onDistritoChange,
    onReferenciaChange,
    onTelefonoChange,
    onCostoChange,
    onGpsChange,
    onNext,
    onPrev,
  } = props;

  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [distritos, setDistritos] = useState<Distrito[]>([]);
  const [departamentoSel, setDepartamentoSel] = useState<number | null>(null);
  const [provinciaSel, setProvinciaSel] = useState<number | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [costoSugerido, setCostoSugerido] = useState<number | null>(null);
  const [cargandoCosto, setCargandoCosto] = useState(false);
  const [errorCosto, setErrorCosto] = useState<string | null>(null);
  const [fueraRadio, setFueraRadio] = useState(false);
  const [dentroCobertura, setDentroCobertura] = useState(true);
  const [mapPins, setMapPins] = useState<Array<{ lat: number; lng: number; label?: string; color?: 'blue' | 'red' | 'green' }>>([]);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [coordenadasCliente, setCoordenadasCliente] = useState<[number, number] | null>(null);
  const [cobertura, setCobertura] = useState<CoberturaDelivery | null>(null);
  const [errorCobertura, setErrorCobertura] = useState<string | null>(null);
  const [estadoUbicacionMapa, setEstadoUbicacionMapa] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [sugerencias, setSugerencias] = useState<Array<{ etiqueta: string; lat: number; lng: number }>>([]);
  const [verSugerencias, setVerSugerencias] = useState(false);
  const [buscandoDir, setBuscandoDir] = useState(false);
  const [errorGps, setErrorGps] = useState<string | null>(null);
  const onDistritoChangeRef = useRef(onDistritoChange);
  const onCostoChangeRef = useRef(onCostoChange);
  const lookupIdRef = useRef(0);
  const departamentosRequestRef = useRef<Promise<Departamento[]> | null>(null);

  onDistritoChangeRef.current = onDistritoChange;
  onCostoChangeRef.current = onCostoChange;

  const obtenerDepartamentos = () => {
    if (!departamentosRequestRef.current) {
      departamentosRequestRef.current = api
        .request<Departamento[]>('/maestros/departamentos')
        .catch((error) => {
          departamentosRequestRef.current = null;
          throw error;
        });
    }
    return departamentosRequestRef.current;
  };

  useEffect(() => {
    const cargarDepartamentos = async () => {
      try {
        const data = await obtenerDepartamentos();
        setDepartamentos(data);
      } catch (error) {
        console.error('Error cargando departamentos:', error);
      }
    };

    void cargarDepartamentos();

    void api.getCoberturaDelivery()
      .then((data) => {
        setCobertura(data);
        setErrorCobertura(null);
      })
      .catch((error) => {
        console.error('Error cargando cobertura de delivery:', error);
        setErrorCobertura('No se pudo cargar el límite de cobertura configurado por el restaurante.');
      });
  }, []);

  useEffect(() => {
    if (!departamentoSel) {
      setProvincias([]);
      setProvinciaSel(null);
      setDistritos([]);
      if (distritoId !== null) {
        onDistritoChangeRef.current(null);
      }
      return;
    }

    const cargarProvincias = async () => {
      try {
        const data = await api.request<any[]>(`/maestros/provincias?departamento=${departamentoSel}`);
        setProvincias(data);
      } catch (error) {
        console.error('Error cargando provincias:', error);
      }
    };

    void cargarProvincias();
  }, [departamentoSel, distritoId]);

  useEffect(() => {
    if (!provinciaSel) {
      setDistritos([]);
      if (distritoId !== null) {
        onDistritoChangeRef.current(null);
      }
      return;
    }

    const cargarDistritos = async () => {
      try {
        const data = await api.request<any[]>(`/maestros/distritos?provincia=${provinciaSel}`);
        setDistritos(data);
      } catch (error) {
        console.error('Error cargando distritos:', error);
      }
    };

    void cargarDistritos();
  }, [provinciaSel, distritoId]);

  useEffect(() => {
    if (!distritoId) {
      setCostoSugerido(null);
      setCargandoCosto(false);
      setErrorCosto(null);
      setFueraRadio(false);
      setDentroCobertura(true);
      return;
    }

    let cancelled = false;
    setCostoSugerido(null);
    setCargandoCosto(true);
    setErrorCosto(null);

    const cargarCosto = async () => {
      try {
        const result = await api.sugerirCosto(
          distritoId,
          coordenadasCliente?.[0],
          coordenadasCliente?.[1],
        );
        if (cancelled) return;
        setCostoSugerido(result.costoSugerido);
        setFueraRadio(result.fueraRadio);
        setDentroCobertura(result.dentroCobertura);
        if (result.costoSugerido !== null) {
          onCostoChangeRef.current(result.costoSugerido);
        }
      } catch (error) {
        console.error('Error sugiriendo costo por distrito:', error);
        if (!cancelled) setErrorCosto('No se pudo calcular el costo. Revisa tu conexión e inténtalo nuevamente.');
      } finally {
        if (!cancelled) setCargandoCosto(false);
      }
    };

    void cargarCosto();
    return () => {
      cancelled = true;
    };
  }, [distritoId, coordenadasCliente]);

  useEffect(() => {
    const q = direccion.trim();
    if (q.length < 4) {
      setSugerencias([]);
      return;
    }

    const timeout = window.setTimeout(async () => {
      setBuscandoDir(true);
      try {
        setSugerencias(await buscarSugerencias(q));
      } finally {
        setBuscandoDir(false);
      }
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [direccion]);

  const aplicarSugerencia = async (s: { etiqueta: string; lat: number; lng: number }) => {
    setVerSugerencias(false);
    setSugerencias([]);
    onDireccionChange(s.etiqueta.slice(0, 150));
    onGpsChange(s.lat, s.lng);
    setMapPins([{ lat: s.lat, lng: s.lng, label: 'Tu ubicación', color: 'blue' }]);
    setMapCenter([s.lat, s.lng]);
    setCoordenadasCliente([s.lat, s.lng]);

    try {
      const geoData = await reverseGeocode(s.lat, s.lng);
      if (geoData?.address) {
        const { address } = geoData;
        const partesDireccion: string[] = [];
        if (address.house_number) partesDireccion.push(address.house_number);
        if (address.road) partesDireccion.push(address.road);
        const area = address.neighbourhood ?? address.suburb;
        if (area) partesDireccion.push(area);
        if (address.postcode) partesDireccion.push(address.postcode);
        if (partesDireccion.length > 0) {
          onDireccionChange(partesDireccion.join(', ').slice(0, 150));
        }

        const referenciaParts: string[] = [];
        if (address.landmark) referenciaParts.push(address.landmark);
        if (address.suburb) referenciaParts.push(`Cerca de ${address.suburb}`);
        if (address.neighbourhood) referenciaParts.push(`En ${address.neighbourhood}`);
        if (referenciaParts.length > 0) {
          onReferenciaChange(referenciaParts.join(' - ').slice(0, 150));
        }
      }
    } catch (error) {
      console.error('Error en reverse geocoding desde sugerencia:', error);
    }
  };

  const seleccionarUbicacionMapa = async (lat: number, lng: number) => {
    const lookupId = ++lookupIdRef.current;
    setEstadoUbicacionMapa('loading');
    setMapCenter([lat, lng]);
    setMapPins([{ lat, lng, label: 'Dirección de entrega', color: 'blue' }]);
    setCoordenadasCliente([lat, lng]);
    onGpsChange(lat, lng);
    onDireccionChange('');
    onReferenciaChange('');

    setDepartamentoSel(null);
    setProvinciaSel(null);
    setProvincias([]);
    setDistritos([]);
    onDistritoChangeRef.current(null);

    const geo = await reverseGeocode(lat, lng);
    if (lookupId !== lookupIdRef.current) return;
    if (!geo?.address) {
      setEstadoUbicacionMapa('error');
      return;
    }
    const address = geo.address;
    const partesDireccion: string[] = [];
    if (address.house_number) partesDireccion.push(address.house_number);
    if (address.road) partesDireccion.push(address.road);
    if (address.neighbourhood || address.suburb) {
      partesDireccion.push(address.neighbourhood || address.suburb || '');
    }
    if (partesDireccion.length > 0) {
      onDireccionChange(partesDireccion.join(', ').slice(0, 150));
    } else if (geo.display_name) {
      onDireccionChange(geo.display_name.slice(0, 150));
    }

    const referenciaParts = [address.landmark, address.suburb, address.neighbourhood].filter(Boolean);
    if (referenciaParts.length > 0) {
      onReferenciaChange(referenciaParts.join(' - ').slice(0, 150));
    }

    const nombresDepartamento = [address.state, address.department, address.region, address.state_district];
    let departamentosDisponibles = departamentos;
    if (departamentosDisponibles.length === 0) {
      try {
        departamentosDisponibles = await obtenerDepartamentos();
        if (lookupId !== lookupIdRef.current) return;
        setDepartamentos(departamentosDisponibles);
      } catch (error) {
        if (lookupId !== lookupIdRef.current) return;
        console.error('Error cargando departamentos para la ubicación seleccionada:', error);
        setDepartamentoSel(null);
        setProvinciaSel(null);
        setProvincias([]);
        setDistritos([]);
        setEstadoUbicacionMapa('error');
        return;
      }
    }

    const departamento = buscarMaestro(departamentosDisponibles, 'd_departamento', nombresDepartamento);
    if (!departamento) {
      setEstadoUbicacionMapa('error');
      return;
    }

    try {
      const nuevasProvincias = await api.getProvincias(departamento.id_departamento);
      if (lookupId !== lookupIdRef.current) return;
      setDepartamentoSel(departamento.id_departamento);
      setProvincias(nuevasProvincias);

      const nombresProvincia = [address.county, address.municipality, address.province, address.city];
      const provincia = buscarMaestro(nuevasProvincias, 'd_provincia', nombresProvincia);
      if (!provincia) {
        setEstadoUbicacionMapa('error');
        return;
      }

      const nuevosDistritos = await api.getDistritos(provincia.id_provincia);
      if (lookupId !== lookupIdRef.current) return;
      setProvinciaSel(provincia.id_provincia);
      setDistritos(nuevosDistritos);

      const nombresDistrito = [
        address.city_district,
        address.district,
        address.suburb,
        address.neighbourhood,
        address.city,
        address.town,
        address.village,
      ];
      const distrito = buscarMaestro(nuevosDistritos, 'd_distrito', nombresDistrito);
      onDistritoChangeRef.current(distrito?.id_distrito ?? null);
      setEstadoUbicacionMapa(distrito ? 'success' : 'error');
    } catch (error) {
      if (lookupId !== lookupIdRef.current) return;
      console.error('Error identificando la zona seleccionada en el mapa:', error);
      setEstadoUbicacionMapa('error');
    }
  };

  const handleUsarUbicacion = async () => {
    if (!navigator.geolocation) {
      setErrorGps('Este navegador no permite compartir la ubicación. Puedes marcarla directamente en el mapa.');
      return;
    }

    setErrorGps(null);
    setGpsLoading(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const { latitude, longitude } = position.coords;
      await seleccionarUbicacionMapa(latitude, longitude);
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
      setErrorGps('No pudimos obtener tu ubicación. Revisa los permisos del navegador o selecciónala en el mapa.');
    } finally {
      setGpsLoading(false);
    }
  };

  const canNext = direccion.trim() !== ''
    && direccion.trim().length <= 150
    && distritoId !== null
    && /^\d{9}$/.test(telefono)
    && costoSugerido !== null
    && !cargandoCosto
    && !errorCosto
    && dentroCobertura;

  return (
    <div className="y-delivery-address-form">
      <div className="y-delivery-step-heading">
        <div>
          <span className="y-cliente-kicker">Paso 1 de 2</span>
          <h2>¿A dónde lo enviamos?</h2>
          <p>Indica la dirección y elige el punto de entrega para comprobar la cobertura.</p>
        </div>
      </div>

      <section className="y-delivery-section" aria-labelledby="delivery-address-title">
        <div className="y-delivery-section__heading">
          <div>
            <span className="y-cliente-kicker">Ubicación</span>
            <h3 id="delivery-address-title">Dirección de entrega</h3>
          </div>
          <MapPin size={20} aria-hidden="true" />
        </div>
        <div className="y-delivery-field relative">
        <label htmlFor="delivery-address" className="y-delivery-label">Dirección o calle *</label>
        <input
          id="delivery-address"
          type="text"
          value={direccion}
          onChange={(e) => {
            onDireccionChange(e.target.value.slice(0, 150));
            setVerSugerencias(true);
          }}
          onFocus={() => setVerSugerencias(true)}
          onBlur={() => window.setTimeout(() => setVerSugerencias(false), 200)}
          placeholder="Av. Los Incas 123, Urb. El Bosque"
          maxLength={150}
          className="y-delivery-input"
          required
          autoComplete="street-address"
        />

        {verSugerencias && (buscandoDir || sugerencias.length > 0) && (
          <ul className="absolute z-40 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
            {buscandoDir ? <li className="px-3 py-2 text-xs text-gray-500">Buscando…</li> : null}
            {sugerencias.map((s, index) => (
              <li key={`${s.lat}-${s.lng}-${index}`}>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    void aplicarSugerencia(s);
                  }}
                  className="y-delivery-suggestion"
                >
                  {s.etiqueta}
                </button>
              </li>
            ))}
          </ul>
        )}
        </div>

        <div className="y-delivery-region-grid">
        <div className="y-delivery-field">
          <label htmlFor="delivery-department" className="y-delivery-label">Departamento *</label>
          <select
            id="delivery-department"
            value={departamentoSel ?? ''}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : null;
              setDepartamentoSel(value);
              setProvinciaSel(null);
            }}
            className="y-delivery-input"
          >
            <option value="">Seleccionar</option>
            {departamentos.map((d) => (
              <option key={d.id_departamento} value={d.id_departamento}>
                {d.d_departamento}
              </option>
            ))}
          </select>
        </div>

        <div className="y-delivery-field">
          <label htmlFor="delivery-province" className="y-delivery-label">Provincia *</label>
          <select
            id="delivery-province"
            value={provinciaSel ?? ''}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : null;
              setProvinciaSel(value);
            }}
            disabled={!departamentoSel}
            className="y-delivery-input"
          >
            <option value="">Seleccionar</option>
            {provincias.map((p) => (
              <option key={p.id_provincia} value={p.id_provincia}>
                {p.d_provincia}
              </option>
            ))}
          </select>
        </div>

        <div className="y-delivery-field">
          <label htmlFor="delivery-district" className="y-delivery-label">Distrito *</label>
          <select
            id="delivery-district"
            value={distritoId ?? ''}
            onChange={(e) => onDistritoChange(e.target.value ? Number(e.target.value) : null)}
            disabled={!provinciaSel}
            className="y-delivery-input"
          >
            <option value="">Seleccionar</option>
            {distritos.map((d) => (
              <option key={d.id_distrito} value={d.id_distrito}>
                {d.d_distrito}
              </option>
            ))}
          </select>
        </div>
        </div>
      </section>

      <section className="y-delivery-section" aria-labelledby="delivery-map-title">
        <div className="y-delivery-section__heading">
          <div>
            <span className="y-cliente-kicker">Punto exacto</span>
            <h3 id="delivery-map-title">Ubica tu dirección en el mapa</h3>
            <p>Toca el mapa o arrastra el marcador. También puedes compartir tu ubicación GPS.</p>
          </div>
        </div>
        <div className="y-delivery-map-grid">
        <div>
          <MapLeaflet
            pins={mapPins}
            center={mapCenter ?? (cobertura?.latLocal != null && cobertura.lngLocal != null
              ? [cobertura.latLocal, cobertura.lngLocal]
              : [-12.0464, -77.0428])}
            zoom={15}
            drawRadius={cobertura?.radioCoberturaKm ?? undefined}
            radiusCenter={
              cobertura?.latLocal != null && cobertura.lngLocal != null
                ? [cobertura.latLocal, cobertura.lngLocal]
                : undefined
            }
            onClick={(e) => void seleccionarUbicacionMapa(e.latlng.lat, e.latlng.lng)}
            draggablePins
            onPinDragEnd={(_, lat, lng) => void seleccionarUbicacionMapa(lat, lng)}
            height="360px"
          />
        </div>

        <div className="y-delivery-map-details">
          <div className="y-delivery-map-help">
            <h4>Zona de entrega</h4>
            <p>El círculo indica el límite configurado por el restaurante.</p>
            {estadoUbicacionMapa !== 'idle' && (
              <p
                className={`y-delivery-inline-message ${
                  estadoUbicacionMapa === 'error' ? 'is-warning' : estadoUbicacionMapa === 'success' ? 'is-success' : ''
                }`}
                role={estadoUbicacionMapa === 'error' ? 'alert' : 'status'}
              >
                {estadoUbicacionMapa === 'loading'
                  ? 'Consultando la ubicación y actualizando departamento, provincia y distrito...'
                  : estadoUbicacionMapa === 'success'
                    ? 'Ubicación consultada; los datos de zona se actualizaron.'
                    : 'No se pudo reconocer la zona automáticamente. Selecciona departamento, provincia y distrito manualmente.'}
              </p>
            )}
            {mapPins.length > 0 && (
              <div className="y-delivery-selected-location">
                <span>Ubicación seleccionada</span>
                <p>
                  {mapPins[0].lat.toFixed(5)}, {mapPins[0].lng.toFixed(5)}
                </p>
              </div>
            )}
          </div>

          <div className="y-delivery-gps">
            <Button type="button" variant="outline" onClick={handleUsarUbicacion} disabled={gpsLoading} className="y-delivery-outline-button">
              {gpsLoading ? 'Obteniendo ubicación…' : 'Usar mi ubicación'}
            </Button>
            {errorGps && <p className="y-delivery-inline-message is-warning" role="alert">{errorGps}</p>}
          </div>
        </div>
      </div>
      </section>

      <p className="y-delivery-coverage-note" role={errorCobertura ? 'alert' : undefined}>
        {errorCobertura
          ? errorCobertura
          : cobertura?.radioCoberturaKm != null && cobertura.radioCoberturaKm > 0
            ? `El círculo muestra el límite máximo de entrega configurado por el restaurante (${cobertura.radioCoberturaKm} km desde el local).`
            : 'El restaurante no ha definido un límite máximo de cobertura. El costo de envío puede variar por distrito.'}
      </p>

      <section className="y-delivery-section" aria-labelledby="delivery-contact-title">
        <div className="y-delivery-section__heading">
          <div>
            <span className="y-cliente-kicker">Contacto y costo</span>
            <h3 id="delivery-contact-title">Últimos detalles</h3>
          </div>
        </div>
        <div className="y-delivery-contact-grid">
        <div className="y-delivery-field">
          <span className="y-delivery-label">Costo de envío estimado</span>
          <div className="y-delivery-input y-delivery-estimated-cost" aria-live="polite">
            {cargandoCosto
              ? 'Calculando…'
              : errorCosto
                ? 'No disponible'
                : `S/ ${costoEnvio.toFixed(2)}`}
          </div>
          <p className="y-delivery-field-hint">Se calcula según tu distrito y ubicación. El restaurante confirmará el costo final.</p>
          {errorCosto && <p className="y-delivery-inline-message is-warning" role="alert">{errorCosto}</p>}
        </div>

        <div className="y-delivery-field">
          <label htmlFor="delivery-reference" className="y-delivery-label">Referencia (opcional)</label>
          <input
            id="delivery-reference"
            type="text"
            value={referencia}
            onChange={(e) => onReferenciaChange(e.target.value.slice(0, 150))}
            placeholder="Frente al parque, casa azul, 2do piso"
            maxLength={150}
            className="y-delivery-input"
          />
        </div>

        <div className="y-delivery-field">
        <label htmlFor="delivery-phone" className="y-delivery-label">Teléfono de contacto *</label>
        <input
          id="delivery-phone"
          type="tel"
          value={telefono}
          onChange={(e) => onTelefonoChange(e.target.value.replace(/\D/g, '').slice(0, 9))}
          placeholder="987654321"
          maxLength={9}
          inputMode="numeric"
          pattern="[0-9]{9}"
          className="y-delivery-input"
          required
          autoComplete="tel"
        />
        </div>
        </div>

      {costoSugerido !== null && (
        <div
          className={`y-delivery-zone-status ${
            !dentroCobertura
              ? 'is-outside'
              : fueraRadio
                ? 'is-warning'
                : 'is-inside'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="y-delivery-zone-status__label">
                {dentroCobertura ? 'Costo de envío sugerido: ' : 'Costo estimado (zona fuera de cobertura): '}
              </span>
              <Badge variant={!dentroCobertura || fueraRadio ? 'warning' : 'success'}>
                S/ {costoSugerido.toFixed(2)}
              </Badge>
              {!dentroCobertura && (
                <span className="y-delivery-zone-status__detail">
                  (Fuera del límite máximo de entrega del restaurante; no se puede continuar)
                </span>
              )}
              {dentroCobertura && fueraRadio && (
                <span className="y-delivery-zone-status__detail">
                  (Supera el radio tarifario del distrito; se aplica recargo)
                </span>
              )}
            </div>
          </div>
        </div>
      )}
      </section>

      <div className="y-delivery-step-actions">
        <Button type="button" variant="secondary" onClick={onPrev}>
          Volver a la carta
        </Button>
        <Button type="button" onClick={onNext} disabled={!canNext || !dentroCobertura} size="lg" className="y-delivery-primary-button">
          Revisar pedido
        </Button>
      </div>
    </div>
  );
}
