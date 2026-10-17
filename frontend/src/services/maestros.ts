import { leerToken } from '../features/auth/login/auth-service';

/** Ítem de lista maestra viva (endpoint /maestros/*). Fuente única (cero consts). */
export interface Maestro {
  id: number;
  nombre: string;
  area?: string | null;
  abreviatura?: string | null;
  /** FK a provincia (solo en distritos; para derivar la cadena en cliente). */
  provinciaId?: number | null;
}

/** Provincia con su departamento (para cascada de ubicación en cliente). */
export interface Provincia extends Maestro {
  departamentoId: number;
}

const MAESTROS = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/v1'}/maestros`;

function headers(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${leerToken() ?? ''}`,
  };
}

/** Lista viva de distritos con estado A (Ica + aledaños). */
export function listarDistritos(): Promise<Maestro[]> {
  return fetch(`${MAESTROS}/distritos`, { headers: headers() }).then(async (res) => {
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(body.error ?? 'NETWORK_ERROR');
    }
    return (await res.json()) as Maestro[];
  });
}

/** Lista viva de departamentos con estado A (cascada de ubicación). */
export function listarDepartamentos(): Promise<Maestro[]> {
  return fetch(`${MAESTROS}/departamentos`, { headers: headers() }).then(async (res) => {
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(body.error ?? 'NETWORK_ERROR');
    }
    return (await res.json()) as Maestro[];
  });
}

/** Lista viva de provincias con estado A + su departamento (cascada). */
export function listarProvincias(): Promise<Provincia[]> {
  return fetch(`${MAESTROS}/provincias`, { headers: headers() }).then(async (res) => {
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(body.error ?? 'NETWORK_ERROR');
    }
    return (await res.json()) as Provincia[];
  });
}
