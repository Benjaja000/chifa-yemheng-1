import { useState, useEffect } from 'react';
import { api } from '@/shared/services/api-client';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';

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

  useEffect(() => {
    cargarDepartamentos();
  }, []);

  useEffect(() => {
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
    if (provinciaSel) {
      cargarDistritos(provinciaSel);
    } else {
      setDistritos([]);
      onDistritoChange(null);
    }
  }, [provinciaSel]);

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

      if (distritoId) {
        try {
          const result = await api.sugerirCosto(latitude, longitude, distritoId);
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
      // Intentar geocodificar la dirección usando Nominatim (gratis)
      const geo = await geocodeAddress(direccion.trim());
      if (geo) {
        // Si logramos geocodificar, sugerir costo con esas coords
        const result = await api.sugerirCosto(geo.lat, geo.lng, distritoId);
        setCostoSugerido(result.costoSugerido);
        setFueraRadio(result.fueraRadio);
        onCostoChange(result.costoSugerido);
      } else {
        // Si no geocodificamos, mostrar aviso y sugerir usar GPS
        alert('No pudimos geocodificar la dirección. Usa "Usar mi ubicación" para sugerir costo por GPS, o ingresa el costo manualmente.');
        // También intentamos con coords undefined - el backend validará
        setCostoSugerido(null);
        setFueraRadio(false);
      }
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
            {distritos.map(d => <option key={d.id_distrito} value={d.id_distrito}>{d.d_distrito}</option>)}
          </select>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Costo de envío *</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={costoEnvio}
              onChange={e => onCostoChange(Number(e.target.value) || 0)}
              min="0"
              step="0.1"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-500">S/</span>
          </div>
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
              <span className="font-medium">Costo sugerido por GPS: </span>
              <Badge variant={fueraRadio ? 'warning' : 'success'}>S/ {costoSugerido.toFixed(2)}</Badge>
              {fueraRadio && <span className="ml-2 text-sm text-yellow-700">(Fuera de radio de cobertura)</span>}
            </div>
            <Button size="sm" variant="secondary" onClick={() => onCostoChange(costoSugerido)}>
              Usar este costo
            </Button>
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