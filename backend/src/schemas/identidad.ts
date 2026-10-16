import { z } from 'zod';

export const dniParamSchema = z.object({
  numero: z.string().regex(/^\d{8}$/, 'DNI de 8 dígitos'),
});

export const rucParamSchema = z.object({
  numero: z.string().regex(/^\d{11}$/, 'RUC de 11 dígitos'),
});

export const ubigeoQuerySchema = z.object({
  ubigeo: z.string().regex(/^\d{6}$/, 'Ubigeo de 6 dígitos'),
});

export type DniParam = z.infer<typeof dniParamSchema>;
export type RucParam = z.infer<typeof rucParamSchema>;
export type UbigeoQuery = z.infer<typeof ubigeoQuerySchema>;
