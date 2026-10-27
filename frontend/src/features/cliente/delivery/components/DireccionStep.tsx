import { useEffect, useRef, useState } from 'react';
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

  const [mostrarHero, setMostrarHero] = useState(true);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [distritos, setDistritos] = useState<Distrito[]>([]);
  const [departamentoSel, setDepartamentoSel] = useState<number | null>(null);
  const [provinciaSel, setProvinciaSel] = useState<number | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [costoSugerido, setCostoSugerido] = useState<number | null>(null);
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
    const timer = window.setTimeout(() => setMostrarHero(false), 5000);
    return () => window.clearTimeout(timer);
  }, []);

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
      setFueraRadio(false);
      setDentroCobertura(true);
      return;
    }

    let cancelled = false;

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
    onDireccionChange(s.etiqueta);
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
          onDireccionChange(partesDireccion.join(', '));
        }

        const referenciaParts: string[] = [];
        if (address.landmark) referenciaParts.push(address.landmark);
        if (address.suburb) referenciaParts.push(`Cerca de ${address.suburb}`);
        if (address.neighbourhood) referenciaParts.push(`En ${address.neighbourhood}`);
        if (referenciaParts.length > 0) {
          onReferenciaChange(referenciaParts.join(' - '));
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
      onDireccionChange(partesDireccion.join(', '));
    } else if (geo.display_name) {
      onDireccionChange(geo.display_name);
    }

    const referenciaParts = [address.landmark, address.suburb, address.neighbourhood].filter(Boolean);
    if (referenciaParts.length > 0) {
      onReferenciaChange(referenciaParts.join(' - '));
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
      alert('Geolocalización no soportada en este navegador');
      return;
    }

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
      alert('No se pudo obtener la ubicación. Verifica los permisos.');
    } finally {
      setGpsLoading(false);
    }
  };

  const canNext = direccion.trim() !== '' && distritoId !== null;

  return (
    <div className="space-y-6">
      {mostrarHero && (
        <section className="y-flow-hero" aria-labelledby="delivery-address-hero-title">
          <div className="y-flow-hero__content">
            <span className="y-flow-hero__eyebrow">Delivery Yemheng</span>
            <h1 id="delivery-address-hero-title" className="y-flow-hero__title">
              ¿Dónde quieres que llegue tu pedido?
            </h1>
            <p className="y-flow-hero__description">
              Ingresa tu dirección para calcular el costo de envío. La ubicación GPS es opcional; también puedes completar los datos manualmente.
            </p>
            <div className="y-flow-hero__actions">
              <button type="button" className="y-btn gold" onClick={() => setVerSugerencias(true)}>
              Comenzar a pedir
              </button>
              <button type="button" className="y-btn line" onClick={() => setMostrarHero(false)}>
              Saltar
              </button>
            </div>
          </div>
        </section>
      )}

      <div className="relative">
        <label className="mb-1 block text-sm font-medium text-gray-700">Dirección de entrega *</label>
        <input
          type="text"
          value={direccion}
          onChange={(e) => {
            onDireccionChange(e.target.value);
            setVerSugerencias(true);
          }}
          onFocus={() => setVerSugerencias(true)}
          onBlur={() => window.setTimeout(() => setVerSugerencias(false), 200)}
          placeholder="Av. Los Incas 123, Urb. El Bosque"
          className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          required
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
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                >
                  {s.etiqueta}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Departamento *</label>
          <select
            value={departamentoSel ?? ''}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : null;
              setDepartamentoSel(value);
              setProvinciaSel(null);
            }}
            className="w-full rounded-lg border px-3 py-2"
          >
            <option value="">Seleccionar</option>
            {departamentos.map((d) => (
              <option key={d.id_departamento} value={d.id_departamento}>
                {d.d_departamento}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Provincia *</label>
          <select
            value={provinciaSel ?? ''}
            onChange={(e) => {
              const value = e.target.value ? Number(e.target.value) : null;
              setProvinciaSel(value);
            }}
            disabled={!departamentoSel}
            className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-50"
          >
            <option value="">Seleccionar</option>
            {provincias.map((p) => (
              <option key={p.id_provincia} value={p.id_provincia}>
                {p.d_provincia}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Distrito *</label>
          <select
            value={distritoId ?? ''}
            onChange={(e) => onDistritoChange(e.target.value ? Number(e.target.value) : null)}
            disabled={!provinciaSel}
            className="w-full rounded-lg border px-3 py-2 disabled:bg-gray-50"
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
            height="350px"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <h4 className="mb-2 text-sm font-medium text-gray-700">Ubicación en el mapa</h4>
            <p className="mb-3 text-xs text-gray-500">Haz clic en el mapa o arrastra el marcador para seleccionar tu punto de entrega exacto.</p>
            {estadoUbicacionMapa !== 'idle' && (
              <p
                className={`mb-3 text-xs ${
                  estadoUbicacionMapa === 'error' ? 'text-amber-700' : 'text-gray-600'
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
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-sm text-gray-700">Tu ubicación seleccionada</span>
                </div>
                <p className="text-xs text-gray-500" style={{ wordBreak: 'break-all' }}>
                  {mapPins[0].lat.toFixed(5)}, {mapPins[0].lng.toFixed(5)}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleUsarUbicacion} disabled={gpsLoading} className="flex-1">
              {gpsLoading ? 'Obteniendo...' : 'Usar mi ubicación GPS'}
            </Button>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500" role={errorCobertura ? 'alert' : undefined}>
        {errorCobertura
          ? errorCobertura
          : cobertura?.radioCoberturaKm != null && cobertura.radioCoberturaKm > 0
            ? `El círculo muestra el límite máximo de entrega configurado por el restaurante (${cobertura.radioCoberturaKm} km desde el local).`
            : 'El restaurante no ha definido un límite máximo de cobertura. El costo de envío puede variar por distrito.'}
      </p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Costo de envío (automático) *</label>
          <div className="w-full rounded-lg border bg-gray-100 px-3 py-2 text-gray-700">
            S/ {costoEnvio.toFixed(2)}
          </div>
          <p className="mt-1 text-xs text-gray-500">Calculado automáticamente según tu distrito y ubicación.</p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Referencia</label>
          <input
            type="text"
            value={referencia}
            onChange={(e) => onReferenciaChange(e.target.value)}
            placeholder="Frente al parque, casa azul, 2do piso"
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Teléfono *</label>
        <input
          type="tel"
          value={telefono}
          onChange={(e) => onTelefonoChange(e.target.value)}
          placeholder="987654321"
          maxLength={9}
          className="w-full rounded-lg border px-3 py-2"
          required
        />
      </div>

      {costoSugerido !== null && (
        <div
          className={`rounded-lg border p-3 ${
            !dentroCobertura
              ? 'border-red-200 bg-red-50'
              : fueraRadio
                ? 'border-yellow-200 bg-yellow-50'
                : 'border-green-200 bg-green-50'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="font-medium">
                {dentroCobertura ? 'Costo de envío sugerido: ' : 'Costo estimado (zona fuera de cobertura): '}
              </span>
              <Badge variant={!dentroCobertura || fueraRadio ? 'warning' : 'success'}>
                S/ {costoSugerido.toFixed(2)}
              </Badge>
              {!dentroCobertura && (
                <span className="ml-2 text-sm text-red-700">
                  (Fuera del límite máximo de entrega del restaurante; no se puede continuar)
                </span>
              )}
              {dentroCobertura && fueraRadio && (
                <span className="ml-2 text-sm text-yellow-700">
                  (Supera el radio tarifario del distrito; se aplica recargo)
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="secondary" onClick={onPrev}>
          Anterior
        </Button>
        <Button onClick={onNext} disabled={!canNext || !dentroCobertura} size="lg">
          Continuar a Confirmar
        </Button>
      </div>
    </div>
  );
}
