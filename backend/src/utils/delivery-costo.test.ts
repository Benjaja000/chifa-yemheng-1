import { describe, expect, it } from 'vitest';
import { calcularDistanciaHaversineKm, calcularSugerenciaCosto } from './delivery-costo.js';

describe('calcularDistanciaHaversineKm', () => {
  it('returns zero for the same coordinates', () => {
    expect(calcularDistanciaHaversineKm(-14.058616, -75.717849, -14.058616, -75.717849)).toBe(0);
  });

  it('calculates the distance between Ica and a nearby location', () => {
    expect(calcularDistanciaHaversineKm(-14.058616, -75.717849, -14.074954, -75.775628))
      .toBeCloseTo(6.51, 1);
  });
});

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

  it('rechaza parámetros no finitos para no producir costos NaN', () => {
    expect(() => calcularSugerenciaCosto({
      ...parametrosBase,
      costoBase: Number.NaN,
      distanciaTarifaKm: null,
      distanciaCoberturaKm: null,
      radioCoberturaKm: null,
    })).toThrow('INVALID_DELIVERY_COST_INPUT');
  });
});
