import { useState, useEffect, useRef } from 'react';
import { api } from '@/shared/services/api-client';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
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

// Nominatim geocoder gratuito (OpenStreetMap)
const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  try {
    const encoded = encodeURIComponent(address);
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&limit=1`, {
      headers: { 'User-Agent': 'ChifaYemheng/1.0' }
    });
    if (!response.ok) throw new Error('Geocoding failed');
    const data = await response.json();
    if (data.length === 0) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

// Nominatim reverse geocoder gratuito (OpenStreetMap) — coords → dirección
const reverseGeocode = async (lat: number, lng: number): Promise<any> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`,
      { headers: { 'User-Agent': 'ChifaYemheng/1.0' } }
    );
    if (!response.ok) throw new Error('Reverse geocoding failed');
    return await response.json();
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
};

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

  const [departamentos, setDepartamentos] = useState<Array<{ id_departamento: number; d_departamento: string }>>([]);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [distritos, setDistritos] = useState<Distrito[]>([]);
  const [departamentoSel, setDepartamentoSel] = useState<number | null>(null);
  const [provinciaSel, setProvinciaSel] = useState<number | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [costoSugerido, setCostoSugerido] = useState<number | null>(null);
  const [fueraRadio, setFueraRadio] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [mapPins, setMapPins] = useState<{ lat: number; lng: number; label?: string; color?: 'blue' | 'red' | 'green' }[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const isAutoSelecting = useRef(false);

  useEffect(() => {
    cargarDepartamentos();
  }, []);

  useEffect(() => {
    if (isAutoSelecting.current) return;
    if (departamentoSel) {
      cargarProvincias(departamentoSel);
    } else {
      setProvincias([]);
      setDistritos([]);
      setProvinciaSel(null);
      onDistritoChange(null);
    }
  }, [departamentoSel]);

  useEffect(() => {
    if (isAutoSelecting.current) return;
    if (provinciaSel) {
      cargarDistritos(provinciaSel);
    } else {
      setDistritos([]);
      onDistritoChange(null);
    }
  }, [provinciaSel]);

  // Costo sugerido automático por distrito (sin GPS): el cliente lo ve en solo lectura (BR-DER-033/BR-GPS-002).
  useEffect(() => {
    if (!distritoId) {
      setCostoSugerido(null);
      setFueraRadio(false);
      return;
    }
    let cancel = false;
    (async () => {
      try {
        const result = await api.sugerirCosto(distritoId);
        if (cancel) return;
        setCostoSugerido(result.costoSugerido);
        setFueraRadio(result.fueraRadio);
        onCostoChange(result.costoSugerido);
      } catch (error) {
        console.error('Error sugiriendo costo por distrito:', error);
      }
    })();
    return () => { cancel = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distritoId]);

  const cargarDepartamentos = async () => {
    try {
      const data = await api.request<any[]>('/maestros/departamentos');
      setDepartamentos(data);
    } catch (error) {
      console.error('Error cargando departamentos:', error);
    }
  };

  const cargarProvincias = async (idDepartamento: number) => {
    try {
      const data = await api.request<any[]>(`/maestros/provincias?departamento=${idDepartamento}`);
      setProvincias(data);
    } catch (error) {
      console.error('Error cargando provincias:', error);
    }
  };

  const cargarDistritos = async (idProvincia: number) => {
    try {
      const data = await api.request<any[]>(`/maestros/distritos?provincia=${idProvincia}`);
      setDistritos(data);
      if (data.length > 0) {
        setProvinciaSel(data[0].id_provincia);
      }
    } catch (error) {
      console.error('Error cargando distritos:', error);
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
      onGpsChange(latitude, longitude);
      setMapPins([{ lat: latitude, lng: longitude, label: 'Tu ubicación', color: 'blue' }]);
      setMapCenter([latitude, longitude]);

      // Auto-seleccionar departamento/provincia/distrito desde GPS vía reverse geocoding
      isAutoSelecting.current = true;
      let distritoSeleccionado: { id_distrito: number; d_distrito: string } | null = null;
      try {
        const geo = await reverseGeocode(latitude, longitude);
        console.log('GPS reverse geocode result:', geo);

        if (geo?.address) {
          const { address } = geo;
          const deptoNombre = address.state;
          const provNombre = address.county || address.municipality;
          const distNombre = address.city_district || address.suburb || address.neighbourhood;
          console.log('GPS address parts:', { deptoNombre, provNombre, distNombre });

          // Cargar departamentos si aún no están cargados
          let deptoList = departamentos;
          if (deptoList.length === 0) {
            const data = await api.request<any[]>('/maestros/departamentos');
            setDepartamentos(data);
            deptoList = data;
          }
          console.log('Departamentos cargados:', deptoList.length);

          // Autocompletar dirección y referencia directamente desde Nominatim (sin depender de coincidencias de BD)
          const partesDireccion: string[] = [];
          if (address.house_number) partesDireccion.push(address.house_number);
          if (address.road) partesDireccion.push(address.road);
          if (address.neighbourhood || address.suburb) {
            partesDireccion.push(address.neighbourhood || address.suburb);
          }
          if (address.postcode) partesDireccion.push(address.postcode);
          if (partesDireccion.length > 0) {
            onDireccionChange(partesDireccion.join(', '));
          }

          const referenciaParts: string[] = [];
          if (address.suburb) referenciaParts.push(`Cerca de ${address.suburb}`);
          if (address.postcode) referenciaParts.push(`CP ${address.postcode}`);
          if (referenciaParts.length > 0) {
            onReferenciaChange(referenciaParts.join(' - '));
          }

          // Buscar departamento por nombre (case-insensitive, fallback: primero de la lista)
          let deptoSeleccionado: { id_departamento: number; d_departamento: string } | null = null;
          if (deptoList.length > 0) {
            deptoSeleccionado = deptoList.find(d =>
              deptoNombre && d.d_departamento?.toLowerCase() === deptoNombre.toLowerCase()
            ) ?? deptoList[0];
          }

          if (deptoSeleccionado) {
            setDepartamentoSel(deptoSeleccionado.id_departamento);
            console.log('Departamento seleccionado:', deptoSeleccionado);

            const provs = await api.request<any[]>(`/maestros/provincias?departamento=${deptoSeleccionado.id_departamento}`);
            console.log('Provincias del departamento:', provs.length);
            setProvincias(provs);

            // Buscar provincia por nombre, o tomar la primera si no hay coincidencia
            let provSeleccionada: { id_provincia: number; d_provincia: string } | null = null;
            if (provs.length > 0) {
              provSeleccionada = provs.find(p =>
                provNombre && p.d_provincia?.toLowerCase() === provNombre.toLowerCase()
              ) ?? provs[0];
            }

            if (provSeleccionada) {
              setProvinciaSel(provSeleccionada.id_provincia);
              console.log('Provincia seleccionada:', provSeleccionada);

              const dists = await api.request<any[]>(`/maestros/distritos?provincia=${provSeleccionada.id_provincia}`);
              console.log('Distritos de la provincia:', dists.length);
              setDistritos(dists);

              // Buscar distrito por nombre, o tomar el primero si no hay coincidencia
              let distSeleccionado: Distrito | null = null;
              if (dists.length > 0) {
                distSeleccionado = dists.find(d =>
                  distNombre && d.d_distrito?.toLowerCase() === distNombre.toLowerCase()
                ) ?? dists[0];
              }

              if (distSeleccionado) {
                distritoSeleccionado = distSeleccionado;
                onDistritoChange(distSeleccionado.id_distrito);
                console.log('Distrito seleccionado:', distSeleccionado);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error auto-seleccionando ubicación desde GPS:', error);
      }
      isAutoSelecting.current = false;

      // Sugerir costo usando el distrito recién seleccionado (no el prop del padre, que aún no se actualizó)
      const distritoParaCosto = distritoSeleccionado ?? (distritoId ? { id_distrito: distritoId, d_distrito: '' } : null);
      if (distritoParaCosto) {
        try {
          const result = await api.sugerirCosto(distritoParaCosto.id_distrito, latitude, longitude);
          setCostoSugerido(result.costoSugerido);
          setFueraRadio(result.fueraRadio);
          onCostoChange(result.costoSugerido);
        } catch (error) {
          console.error('Error sugiriendo costo:', error);
        }
      }
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
      alert('No se pudo obtener la ubicación. Verifica los permisos.');
    } finally {
      setGpsLoading(false);
    }
  };

  const handleSugerirCosto = async () => {
    if (!distritoId) return;
    setGeocoding(true);
    try {
      let lat: number | undefined;
      let lng: number | undefined;

      // Intentar geocodificar la dirección usando Nominatim (gratis)
      const direccionLimpia = direccion.trim();
      if (direccionLimpia) {
        const geo = await geocodeAddress(direccionLimpia);
        if (geo) {
          lat = geo.lat;
          lng = geo.lng;
        }
      }

      // Sugerir costo con coordenadas si las tenemos, o solo con distritoId
      const result = await api.sugerirCosto(distritoId, lat, lng);
      setCostoSugerido(result.costoSugerido);
      setFueraRadio(result.fueraRadio);
      onCostoChange(result.costoSugerido);
    } catch (error) {
      console.error('Error sugiriendo costo:', error);
      alert('Error al sugerir costo. Verifica tu conexión e intenta con GPS.');
    } finally {
      setGeocoding(false);
    }
  };

  const canNext = direccion.trim() !== '' && distritoId !== null;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de entrega *</label>
        <input
          type="text"
          value={direccion}
          onChange={e => onDireccionChange(e.target.value)}
          placeholder="Av. Los Incas 123, Urb. El Bosque"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Departamento *</label>
          <select
            value={departamentoSel || ''}
            onChange={e => {
              const val = e.target.value ? Number(e.target.value) : null;
              setDepartamentoSel(val);
              setProvinciaSel(null);
            }}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccionar</option>
            {departamentos.map(d => <option key={d.id_departamento} value={d.id_departamento}>{d.d_departamento}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Provincia *</label>
          <select
            value={provinciaSel || ''}
            onChange={e => {
              const val = e.target.value ? Number(e.target.value) : null;
              setProvinciaSel(val);
            }}
            disabled={!departamentoSel}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          >
            <option value="">Seleccionar</option>
            {provincias.map(p => <option key={p.id_provincia} value={p.id_provincia}>{p.d_provincia}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Distrito *</label>
          <select
            value={distritoId || ''}
            onChange={e => onDistritoChange(e.target.value ? Number(e.target.value) : null)}
            disabled={!provinciaSel}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
          >
            <option value="">Seleccionar</option>
            {distritos.map(d => <option key={d.id_distrito} value={d.id_distrito}>{d.d_distrito}</option>)}</select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="lg:col-span-1">
          <MapLeaflet
            pins={mapPins}
            center={mapCenter || [-12.0464, -77.0428]}
            zoom={15}
            onClick={(e) => {
              const { lat, lng } = e.latlng;
              setMapCenter([lat, lng]);
              setMapPins([{ lat, lng, label: 'Tu ubicación', color: 'blue' }]);
              onGpsChange(lat, lng);
            }}
            height="350px"
          />
        </div>
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="p-3 rounded-lg border border-gray-200 bg-gray-50">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Ubicación en el mapa</h4>
            <p className="text-xs text-gray-500 mb-3">Haz clic en el mapa para seleccionar tu punto de entrega exacto.</p>
            {mapPins.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  <span className="text-sm text-gray-700">Tu ubicación seleccionada</span>
                </div>
                <p className="text-xs text-gray-500" style={{ wordBreak: 'break-all' }}>{mapPins[0].lat.toFixed(5)}, {mapPins[0].lng.toFixed(5)}</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Referencia</label>
          <input
            type="text"
            value={referencia}
            onChange={e => onReferenciaChange(e.target.value)}
            placeholder="Frente al parque, casa azul, 2do piso"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono de contacto *</label>
          <input
            type="tel"
            value={telefono}
            onChange={e => onTelefonoChange(e.target.value)}
            placeholder="987654321"
            maxLength={9}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Costo de envío (sugerido) *</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={costoEnvio}
              readOnly
              disabled
              className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-700"
            />
            <span className="text-gray-500">S/</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Sugerido según el distrito. Un operador puede ajustarlo al confirmar.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">GPS</label>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleUsarUbicacion}
              disabled={gpsLoading}
              className="flex-1"
            >
              {gpsLoading ? 'Obteniendo...' : 'Usar mi ubicación'}
            </Button>
            <Button variant="outline" onClick={handleSugerirCosto} disabled={geocoding || !distritoId}>
              {geocoding ? 'Geocodificando...' : 'Sugerir'}
            </Button>
          </div>
        </div>
      </div>

      {costoSugerido !== null && (
        <div className={`p-3 rounded-lg ${fueraRadio ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">Costo de envío sugerido: </span>
              <Badge variant={fueraRadio ? 'warning' : 'success'}>S/ {costoSugerido.toFixed(2)}</Badge>
              {fueraRadio && <span className="ml-2 text-sm text-yellow-700">(Fuera de radio de cobertura)</span>}
            </div>
          </div>
        </div>
      )}

      {geocoding && (
        <div className="p-3 rounded-lg bg-blue-50 border-blue-200 mb-4">
          <p className="text-sm text-blue-800">Geocodificando dirección con OpenStreetMap (Nominatim)...</p>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="secondary" onClick={onPrev}>Anterior</Button>
        <Button onClick={onNext} disabled={!canNext} size="lg">
          Continuar a Confirmar
        </Button>
      </div>
    </div>
  );
}
