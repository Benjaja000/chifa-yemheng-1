import { useState } from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, CalendarCheck } from 'lucide-react';
import { fmtDate, fmtPEN, errText } from '../lib/format';
import { Txt } from './Icon';
import type { Reserva } from '../types/db';

const SIT: Record<string, [string, string]> = { P: ['Pendiente', 'warn'], C: ['Confirmada', 'ok'], A: ['Atendida', 'ok'], X: ['Cancelada', 'bad'] };

export function ReservaCard({ r, nombre }: { r: Reserva; nombre?: string }) {
  const [txt, tone] = SIT[String(r.situacion)] ?? [String(r.situacion ?? '-'), 'warn'];
  return (
    <motion.div className="y-panel y-rcard" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div className="y-avatar">{(nombre ?? r.cliente_nombre ?? 'R').charAt(0).toUpperCase()}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <b style={{ fontSize: 14 }}>{nombre ?? r.cliente_nombre ?? `Reserva #${r.id_reserva}`}</b>
        <div style={{ color: 'var(--muted)', fontSize: 12, margin: '3px 0 6px' }}>{fmtDate(r.f_reserva)} · {r.n_personas} personas{r.adelanto ? ` · Adelanto ${fmtPEN(r.adelanto)}` : ''}</div>
        <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span className={`y-chip ${tone}`}>{txt}</span>
          <span className="y-chip" style={{ background: 'rgba(255,255,255,.06)', color: 'var(--muted)' }}>{r.id_mesa ? `Mesa ${r.mesa_numero ?? r.id_mesa} asignada` : 'Sin mesa aún'}</span>
        </span>
      </div>
    </motion.div>
  );
}

export function ReservaForm({ onDone, baseUrl }: { onDone: () => void; baseUrl?: string }) {
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('20:00');
  const [personas, setPersonas] = useState(2);
  const [adelanto, setAdelanto] = useState(0);
  const [obs, setObs] = useState('');
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!fecha) { setMsg('Elige la fecha.'); return; }
    setBusy(true); setMsg('');
    try {
      const body = JSON.stringify({
        fecha,
        hora,
        comensales: personas,
        adelanto,
        observacion: obs || undefined,
      });
      const res = await fetch(baseUrl ?? '/api/v1/reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'NETWORK_ERROR');
      setOk(true);
      setTimeout(onDone, 1500);
    } catch (e) { setMsg(`:err: ${errText(e, 'Error')}`); } finally { setBusy(false); }
  };

  if (ok) return (
    <motion.div className="y-panel" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: 28, textAlign: 'center' }}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 12 }} style={{ color: '#4ade80', display: 'grid', placeItems: 'center' }}><CalendarCheck size={48} /></motion.div>
      <b style={{ display: 'block', margin: '10px 0 4px' }}>Reserva registrada</b>
      <p style={{ color: 'var(--muted)', fontSize: 13, margin: 0 }}>Queda como pendiente y sin mesa. Te avisaremos cuando el personal la confirme.</p>
    </motion.div>
  );
  return (
    <div className="y-panel" style={{ padding: 18, display: 'grid', gap: 12 }}>
      <div className="grid2">
        <div><label className="label">Fecha</label><input type="date" className="input" value={fecha} onChange={(e) => setFecha(e.target.value)} /></div>
        <div><label className="label">Hora</label><input type="time" className="input" value={hora} onChange={(e) => setHora(e.target.value)} /></div>
      </div>
      <div className="grid2">
        <div><label className="label">Personas</label>
          <div className="y-qty" style={{ marginTop: 0, display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={() => setPersonas(Math.max(1, personas - 1))} aria-label="Menos"><Minus size={12} /></button><b>{personas}</b>
            <button onClick={() => setPersonas(Math.min(20, personas + 1))} aria-label="Más"><Plus size={12} /></button>
          </div></div>
        <div><label className="label">Adelanto opcional (S/)</label><input type="number" min={0} className="input" value={adelanto} onChange={(e) => setAdelanto(Number(e.target.value))} /></div>
      </div>
      <div><label className="label">Observación</label><textarea className="textarea" rows={3} value={obs} onChange={(e) => setObs(e.target.value)} placeholder="Cumpleaños, mesa cerca a la ventana..." /></div>
      <button className="y-btn red" style={{ padding: 14 }} disabled={busy} onClick={save}>{busy ? 'Registrando...' : 'Solicitar reserva'}</button>
      {msg && <p style={{ margin: 0, fontSize: 13, textAlign: 'center' }}><Txt>{msg}</Txt></p>}
    </div>
  );
}