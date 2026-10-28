export interface CalcularSugerenciaCostoInput {
  costoBase: number;
  radioKm: number;
  recargoKm: number;
  distanciaTarifaKm: number | null;
  distanciaCoberturaKm: number | null;
  radioCoberturaKm: number | null;
}

export function calcularDistanciaHaversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const radianes = Math.PI / 180;
  const diferenciaLat = (lat2 - lat1) * radianes;
  const diferenciaLng = (lng2 - lng1) * radianes;
  const latitud1 = lat1 * radianes;
  const latitud2 = lat2 * radianes;
  const a = Math.sin(diferenciaLat / 2) ** 2
    + Math.cos(latitud1) * Math.cos(latitud2) * Math.sin(diferenciaLng / 2) ** 2;
  const distanciaAngular = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return 6371 * distanciaAngular;
}

export function calcularSugerenciaCosto({
  costoBase,
  radioKm,
  recargoKm,
  distanciaTarifaKm,
  distanciaCoberturaKm,
  radioCoberturaKm,
}: CalcularSugerenciaCostoInput) {
  const parametrosNoNegativos = [costoBase, radioKm, recargoKm];
  const distancias = [distanciaTarifaKm, distanciaCoberturaKm, radioCoberturaKm];
  if (
    parametrosNoNegativos.some((valor) => !Number.isFinite(valor) || valor < 0)
    || distancias.some((valor) => valor !== null && (!Number.isFinite(valor) || valor < 0))
  ) {
    throw new RangeError('INVALID_DELIVERY_COST_INPUT');
  }

  const fueraRadio = distanciaTarifaKm !== null && distanciaTarifaKm > radioKm;
  const recargo = distanciaTarifaKm === null || !fueraRadio
    ? 0
    : (distanciaTarifaKm - radioKm) * recargoKm;
  const costoSugerido = costoBase + recargo;
  const limiteCoberturaKm = Number(radioCoberturaKm ?? 0);
  const dentroCobertura = distanciaCoberturaKm === null
    || limiteCoberturaKm <= 0
    || distanciaCoberturaKm <= limiteCoberturaKm;

  return {
    distanciaKm: distanciaTarifaKm === null ? null : Number(distanciaTarifaKm.toFixed(2)),
    fueraRadio,
    dentroCobertura,
    costoSugerido: Number(costoSugerido.toFixed(2)),
  };
}
