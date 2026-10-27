export interface CalcularSugerenciaCostoInput {
  costoBase: number;
  radioKm: number;
  recargoKm: number;
  distanciaTarifaKm: number | null;
  distanciaCoberturaKm: number | null;
  radioCoberturaKm: number | null;
}

export function calcularSugerenciaCosto({
  costoBase,
  radioKm,
  recargoKm,
  distanciaTarifaKm,
  distanciaCoberturaKm,
  radioCoberturaKm,
}: CalcularSugerenciaCostoInput) {
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
