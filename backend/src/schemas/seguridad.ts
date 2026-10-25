import { z } from 'zod';

const estadoSchema = z.enum(['A', 'I']);

export const usuarioQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  buscar: z.string().max(50).optional(),
  estado: estadoSchema.optional(),
});

export const usuarioCreateSchema = z.object({
  logeo: z.string().min(3).max(30),
  clave: z.string().min(4).max(100),
  tipo: z.string().min(1).max(20),
  empleadoId: z.number().int().positive(),
  estado: estadoSchema.default('A'),
});

export const usuarioUpdateSchema = z.object({
  tipo: z.string().min(1).max(20).optional(),
  empleadoId: z.number().int().positive().optional().nullable(),
  estado: estadoSchema.optional(),
});

export const usuarioEstadoSchema = z.object({
  estado: estadoSchema,
});

export const rolQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  buscar: z.string().max(50).optional(),
  estado: estadoSchema.optional(),
});

export const rolCreateSchema = z.object({
  nombre: z.string().min(1).max(50),
  descripcion: z.string().max(200).optional(),
  estado: estadoSchema.default('A'),
});

export const asignarPermisosSchema = z.object({
  permisoIds: z.array(z.number().int().positive()),
});

export type UsuarioQuery = z.infer<typeof usuarioQuerySchema>;
export type UsuarioCreate = z.infer<typeof usuarioCreateSchema>;
export type UsuarioUpdate = z.infer<typeof usuarioUpdateSchema>;
export type UsuarioEstado = z.infer<typeof usuarioEstadoSchema>;
export type RolQuery = z.infer<typeof rolQuerySchema>;
export type RolCreate = z.infer<typeof rolCreateSchema>;
export type AsignarPermisos = z.infer<typeof asignarPermisosSchema>;
