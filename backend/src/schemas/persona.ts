import { z } from 'zod';

const tipoDocSchema = z.enum(['DNI', 'CE', 'PASAPORTE']);
const generoSchema = z.enum(['M', 'F', 'O']); // espejo de CK_PERSONA_GEN
const emailSchema = z.string().email('Correo inválido').max(50);

export const personaQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  buscar: z.string().max(50).optional(),
});

export const personaBuscarSchema = z.object({
  tipoDoc: tipoDocSchema,
  documento: z.string().min(1).max(15),
});

export const personaCreateSchema = z.object({
  tipoDoc: tipoDocSchema.default('DNI'),
  documento: z.string().min(1).max(15),
  nombres: z.string().min(1).max(80),
  apPaterno: z.string().max(80).optional().default(''),
  apMaterno: z.string().max(80).optional().default(''),
  telefono: z.string().regex(/^\d{9}$/, 'Celular de 9 dígitos'),
  correo: emailSchema.optional(),
  distritoId: z.number().int().positive().optional(),
  direccion: z.string().max(100).optional().default(''),
  fNacimiento: z.string().date().optional(),
  genero: generoSchema.optional(),
});

export const personaUpdateSchema = z.object({
  nombres: z.string().min(1).max(80).optional(),
  apPaterno: z.string().max(80).optional(),
  apMaterno: z.string().max(80).optional(),
  telefono: z.string().regex(/^\d{9}$/, 'Celular de 9 dígitos').optional(),
  correo: emailSchema.nullable().optional(),
  distritoId: z.number().int().positive().nullable().optional(),
  direccion: z.string().max(100).optional(),
  fNacimiento: z.string().date().nullable().optional(),
  genero: generoSchema.nullable().optional(),
});

export const hacerPersonalSchema = z.object({
  cargoId: z.number().int().positive(),
  contratoId: z.number().int().positive(),
  turno: z.string().max(18).optional().default(''),
  fondoPension: z.string().max(3).optional().default(''),
  nHijos: z.number().int().min(0).max(9).optional(),
  essalud: z.string().max(6).optional().default(''),
  fIngreso: z.string().date().optional(),
  sueldo: z.number().min(0).default(0),
});

export const hacerClienteSchema = z.object({
  telefono: z.string().min(1).max(15).optional(),
  correo: emailSchema.optional(),
  distritoId: z.number().int().positive().optional(),
  direccion: z.string().max(100).optional(),
  codigoCliente: z.string().max(15).optional(),
});

export const convertirSchema = z.object({
  destino: z.enum(['personal', 'cliente']),
  datos: z.record(z.string(), z.unknown()).optional().default({}),
});

export type PersonaQuery = z.infer<typeof personaQuerySchema>;
export type PersonaBuscar = z.infer<typeof personaBuscarSchema>;
export type PersonaCreate = z.infer<typeof personaCreateSchema>;
export type PersonaUpdate = z.infer<typeof personaUpdateSchema>;
export type HacerPersonal = z.infer<typeof hacerPersonalSchema>;
export type HacerCliente = z.infer<typeof hacerClienteSchema>;
export type Convertir = z.infer<typeof convertirSchema>;
