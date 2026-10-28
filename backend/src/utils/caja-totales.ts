export interface MovimientoMedio {
  medio: string;
  monto: number;
  tipoMovimiento: string;
}

export interface TotalPorMedio {
  medio: string;
  total: number;
}

export function resumirMovimientosPorMedio(movimientos: MovimientoMedio[]): TotalPorMedio[] {
  const totales = new Map<string, number>();

  for (const movimiento of movimientos) {
    const tipo = movimiento.tipoMovimiento.toUpperCase();
    const signo = tipo.includes('INGRESO') ? 1 : tipo.includes('EGRESO') ? -1 : null;
    if (signo === null || !Number.isFinite(movimiento.monto)) {
      throw new Error('MOVIMIENTO_CAJA_INVALIDO');
    }

    totales.set(
      movimiento.medio,
      (totales.get(movimiento.medio) ?? 0) + signo * movimiento.monto,
    );
  }

  return Array.from(totales, ([medio, total]) => ({ medio, total }));
}
