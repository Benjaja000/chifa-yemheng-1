import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PREFIJO_QR_MESA = 'yemheng.pe/m/';

/**
 * Normaliza cualquier variante del QR de una mesa al formato canónico que
 * espera el backend (`yemheng.pe/m/<CÓDIGO>`), porque `mesa.codigo_qr` guarda
 * la cadena completa. Acepta la cadena pelada, una URL con `?mesa=` o solo el código.
 */
export function codigoQrCanonico(texto: string): string {
  let valor = texto.trim();
  if (!valor) return '';
  try {
    valor = (new URL(valor).searchParams.get('mesa') ?? valor).trim();
  } catch {
    /* no es una URL absoluta: se usa tal cual */
  }
  try {
    valor = decodeURIComponent(valor);
  } catch {
    /* escape de porcentaje mal formado: se deja igual */
  }
  const marca = valor.indexOf(PREFIJO_QR_MESA);
  if (marca >= 0) {
    valor = valor.slice(marca + PREFIJO_QR_MESA.length);
  } else {
    valor = valor.split('/m/')[1] ?? valor;
  }
  valor = valor.split('?')[0].split('#')[0].trim();
  return valor ? `${PREFIJO_QR_MESA}${valor}` : '';
}