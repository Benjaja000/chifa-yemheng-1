import { describe, expect, it } from 'vitest';
import { calcularSugerenciaCosto } from './delivery-costo.js';

describe('calcularSugerenciaCosto', () => {
  const parametrosBase = {
    costoBase: 0.17,
    radioKm: 2,
    recargoKm: 0.1,
  };

  it('aplica recargo tarifario sin marcar fuera de cobertura global', () => {
    const result = calcularSugerenciaCosto({
      ...parametrosBase,
      distanciaTarifaKm: 3,
      distanciaCoberturaKm: 5,
      radioCoberturaKm: 10,
    });

    expect(result).toEqual({
      distanciaKm: 3,
      fueraRadio: true,
      dentroCobertura: true,
      costoSugerido: 0.27,
    });
  });

  it('marca fuera de cobertura aunque no se exceda el radio tarifario', () => {
    const result = calcularSugerenciaCosto({
      ...parametrosBase,
      distanciaTarifaKm: 1,
      distanciaCoberturaKm: 11,
      radioCoberturaKm: 10,
    });

    expect(result).toEqual({
      distanciaKm: 1,
      fueraRadio: false,
      dentroCobertura: false,
      costoSugerido: 0.17,
    });
  });

  it('mantiene ambos estados independientes cuando se exceden los dos radios', () => {
    const result = calcularSugerenciaCosto({
      ...parametrosBase,
      distanciaTarifaKm: 3,
      distanciaCoberturaKm: 11,
      radioCoberturaKm: 10,
    });

    expect(result.fueraRadio).toBe(true);
    expect(result.dentroCobertura).toBe(false);
    expect(result.costoSugerido).toBe(0.27);
  });

  it('mantiene dentro las ubicaciones en el límite y permite cobertura sin radio definido', () => {
    const enLimite = calcularSugerenciaCosto({
      ...parametrosBase,
      distanciaTarifaKm: 2,
      distanciaCoberturaKm: 10,
      radioCoberturaKm: 10,
    });
    const sinLimite = calcularSugerenciaCosto({
      ...parametrosBase,
      distanciaTarifaKm: null,
      distanciaCoberturaKm: 100,
      radioCoberturaKm: null,
    });

    expect(enLimite.fueraRadio).toBe(false);
    expect(enLimite.dentroCobertura).toBe(true);
    expect(sinLimite.dentroCobertura).toBe(true);
  });
});
