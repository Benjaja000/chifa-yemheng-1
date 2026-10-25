import { supabase } from '../config/supabase.js';
import { createAudit } from '../utils/auditoria.js';

export interface PersonaGmail {
  id_persona: number;
  nombre: string;
  ap_paterno: string | null;
  ap_materno: string | null;
  email: string;
}

export async function buscarPersonaPorEmail(email: string): Promise<PersonaGmail | null> {
  const { data, error } = await supabase
    .from('persona')
    .select('id_persona, nombre, ap_paterno, ap_materno, email')
    .eq('email', email)
    .maybeSingle();
  if (error) {
    throw new Error(`DB_GET_FAIL: ${error.message}`);
  }
  if (!data) {
    return null;
  }
  const row = data as PersonaGmail;
  return row;
}

export async function crearPersonaGmail(
  nombre: string,
  apPaterno: string | null,
  apMaterno: string | null,
  email: string,
  usucre = 'SYSTEM',
  pc = '',
): Promise<number> {
  const { data, error } = await supabase
    .from('persona')
    .insert({
      id_tipoidentidad: null,
      n_documento: null,
      nombre,
      ap_paterno: apPaterno,
      ap_materno: apMaterno,
      email,
      ...createAudit(usucre, pc),
    })
    .select('id_persona')
    .single();
  if (error) {
    throw new Error(`DB_CREATE_FAIL: ${error.message}`);
  }
  return (data as { id_persona: number }).id_persona;
}

export async function buscarClienteActivoPorPersona(idPersona: number): Promise<{ id_cliente: number; puntos: number } | null> {
  const { data, error } = await supabase
    .from('cliente')
    .select('id_cliente, puntos')
    .eq('id_persona', idPersona)
    .eq('estado', 'A')
    .maybeSingle();
  if (error) {
    throw new Error(`DB_GET_FAIL: ${error.message}`);
  }
  if (!data) {
    return null;
  }
  return data as { id_cliente: number; puntos: number };
}

export async function crearClienteGmail(idPersona: number, usucre = 'SYSTEM', pc = ''): Promise<number> {
  const { data, error } = await supabase
    .from('cliente')
    .insert({
      id_persona: idPersona,
      id_empresa: null,
      codigo_cliente: null,
      tipo_cliente: 'N',
      ...createAudit(usucre, pc),
    })
    .select('id_cliente')
    .single();
  if (error) {
    throw new Error(`DB_CREATE_FAIL: ${error.message}`);
  }
  return (data as { id_cliente: number }).id_cliente;
}

export async function auditarCliente(accion: string, idCliente: number | null, valor: string, ip?: string): Promise<void> {
  const { error } = await supabase.from('auditoria').insert({
    id_usuario: null,
    n_tabla: 'CLIENTE',
    accion,
    id_registro: idCliente,
    valor_nuevo: valor,
    ip: ip ?? null,
    ...createAudit('CLIENTE', ip ?? ''),
  });
  if (error) {
    throw new Error(`DB_AUDIT_FAIL: ${error.message}`);
  }
}