import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';
import { env } from '../config/env.js';
import type { Reserva } from '../models/reservas.js';

// ---- Helper: lookup persona → cliente ----
async function lookupClienteByEmail(email: string): Promise<{ id_cliente: number; id_persona: number } | null> {
  const { data: persona, error } = await supabase
    .from('persona')
    .select('id_persona, id_cliente')
    .eq('email', email)
    .maybeSingle();
  if (error || !persona) return null;
  return { id_cliente: persona.id_cliente, id_persona: persona.id_persona };
}

const AUTOSERVICIO_USUARIO_ID = 999; // ID fijo para usuario interno AUTOSERVICIO

export async function postClienteReserva(req: Request, res: Response): Promise<void> {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) {
    res.status(412).json({ error: 'CREDENCIALES_INVALIDAS' });
    return;
  }
  let decoded: unknown;
  try {
    decoded = jwt.verify(token, env.JWT_SECRET);
  } catch {
    res.status(401).json({ error: 'TOKEN_INVALIDO' });
    return;
  }
  const v = decoded as Record<string, unknown>;
  if (typeof v['sub'] !== 'number' || v['rol'] !== 'CLIENTE') {
    res.status(401).json({ error: 'ROL_INVALIDO' });
    return;
  }
  const email = (v['email'] as string) ?? '';

  // Buscar cliente por email
  const cliente = await lookupClienteByEmail(email);
  if (!cliente) {
    res.status(404).json({ error: 'CLIENTE_NOT_FOUND' });
    return;
  }
  const clienteId = cliente.id_cliente;

  // Validar campos del body
  const { fecha, hora, comensales, observacion, adelanto } = req.body as {
    fecha?: string;
    hora?: string;
    comensales?: number;
    observacion?: string;
    adelanto?: number;
  };
  if (!fecha || !hora) {
    res.status(400).json({ error: 'FECHA_HORA_OBLIGATORIAS' });
    return;
  }

  const { data, error } = await supabase
    .from('reserva')
    .insert({
      id_cliente: clienteId,
      id_mesa: null,
      id_usuario: AUTOSERVICIO_USUARIO_ID,
      f_reserva: `${fecha}T${hora}:00`,
      n_personas: comensales ?? 2,
      adelanto: adelanto ?? 0,
      observacion: observacion ?? null,
      situacion: 'P',
      usucre: email,
      pccre: '',
      feccre: new Date().toISOString(),
      usumod: '',
      pcmod: '',
      fecmod: null,
    })
    .select()
    .single();
  if (error) { res.status(500).json({ error: 'DB_CREATE_FAIL', details: error.message }); return; }
  res.status(201).json(data as Reserva);
}

export async function getMisReservasCli(req: Request, res: Response): Promise<void> {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) {
    res.status(401).json({ error: 'CREDENCIALES_INVALIDAS' });
    return;
  }
  let decoded: unknown;
  try {
    decoded = jwt.verify(token, env.JWT_SECRET);
  } catch {
    res.status(401).json({ error: 'TOKEN_INVALIDO' });
    return;
  }
  const v = decoded as Record<string, unknown>;
  if (typeof v['sub'] !== 'number' || v['rol'] !== 'CLIENTE') {
    res.status(401).json({ error: 'ROL_INVALIDO' });
    return;
  }
  const personId = v['sub'] as number;

  // Listar reservas de este cliente (por id_cliente)
  // Primero obtener id_cliente desde persona
  const { data: persona, error: perr } = await supabase
    .from('persona')
    .select('id_cliente')
    .eq('id_persona', personId)
    .maybeSingle();
  if (perr) { res.status(500).json({ error: 'DB_LIST_FAIL', details: perr.message }); return; }
  const clientId = persona?.id_cliente;

  const { data, error } = await supabase
    .from('reserva')
    .select('id_reserva, f_reserva, n_personas, situacion, observacion, mesa(numero), adelanto')
    .eq('id_cliente', clientId)
    .order('f_reserva', { ascending: false });
  if (error) { res.status(500).json({ error: 'DB_LIST_FAIL', details: error.message }); return; }
  res.json(data ?? []);
}