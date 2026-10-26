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
