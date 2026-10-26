import { z } from 'zod';

export const notaCreditoCreateSchema = z.object({
  motivo: z.string().trim().min(1).max(200),
});

export type NotaCreditoCreate = z.infer<typeof notaCreditoCreateSchema>;
