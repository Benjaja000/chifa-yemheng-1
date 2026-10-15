/** Tipos del módulo personas (ficha única PERSONA + asignación de rol). */
export type EstadoRegistro = 'A' | 'I';

export interface PersonaBase {
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
  genero: 'M' | 'F' | 'O' | null;
  estado: EstadoRegistro;
}

export interface PersonaDetalle extends PersonaBase {
  esPersonalActivo: boolean;
  esClienteActivo: boolean;
  empleadoId: number | null;
  clienteId: number | null;
}

export interface PersonaLista {
  data: PersonaDetalle[];
  page: number;
  limit: number;
  total: number;
}

export type PersonaErrorCode =
  | 'YA_EXISTE'
  | 'YA_ES_PERSONAL_ACTIVO'
  | 'YA_ES_CLIENTE_ACTIVO'
  | 'SIN_ROL_ACTIVO'
  | 'NOT_FOUND'
  | 'VALIDATION_ERROR';

export class PersonaError extends Error {
  readonly code: PersonaErrorCode;

  constructor(code: PersonaErrorCode) {
    super(code);
    this.code = code;
  }
}
