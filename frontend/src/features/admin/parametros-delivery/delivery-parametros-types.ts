export interface ParametrosNegocio {
  latLocal: number | null;
  lngLocal: number | null;
  direccionLocal: string | null;
  radioCoberturaKm: number | null;
}

export interface TarifaDistrito {
  distritoId: number;
  distrito: string;
  costoBase: number;
  radioKm: number;
  recargoKm: number;
}

export interface Departamento {
  id_departamento: number;
  d_departamento: string;
}

export interface Provincia {
  id_provincia: number;
  d_provincia: string;
  id_departamento: number;
}

export interface Distrito {
  id_distrito: number;
  d_distrito: string;
  id_provincia: number;
}

export interface TarifaForm {
  costoBase: number;
  radioKm: number;
  recargoKm: number;
}

export interface SugerenciaDireccion {
  etiqueta: string;
  lat: number;
  lng: number;
}
