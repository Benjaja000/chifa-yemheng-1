export type EstadoRegistro = 'A' | 'I';
export type TipoDocPersona = 'DNI' | 'CE' | 'PASAPORTE';
export type Genero = 'M' | 'F' | 'O';

export interface Persona {
  id: number;
  tipoDoc: string;
  documento: string;
  nombres: string;
  apPaterno: string;
  apMaterno: string;
  telefono: string;
  correo: string | null;
  distritoId: number | null;
  distrito: string;
  direccion: string | null;
  fNacimiento: string | null;
  genero: Genero | null;
  estado: EstadoRegistro;
  esPersonalActivo: boolean;
  esClienteActivo: boolean;
  empleadoId: number | null;
  clienteId: number | null;
}

export interface PersonaLista {
  data: Persona[];
  page: number;
  limit: number;
  total: number;
}

export interface PersonaForm {
  tipoDoc: TipoDocPersona;
  documento: string;
  nombres: string;
  apPaterno: string;
  apMaterno: string;
  telefono: string;
  correo: string;
  distritoId: number;
  direccion: string;
  fNacimiento: string;
  genero: Genero | '';
}

export interface HacerPersonalForm {
  cargoId: number;
  contratoId: number;
  turno: string;
  sueldo: number;
  fIngreso: string;
}

export function nombreCompleto(p: Pick<Persona, 'nombres' | 'apPaterno' | 'apMaterno'>): string {
  return [p.nombres, p.apPaterno, p.apMaterno].filter(Boolean).join(' ');
}
