import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogoMark } from '../../../components/Logo';

export function ClienteResetClavePage() {
  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');
  const [msg, setMsg] = useState('');
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  const save = async () => {
    setMsg('');
    if (pass.length < 6) { setMsg('La contraseña debe tener al menos 6 caracteres.'); return; }
    if (pass !== pass2) { setMsg('Las contraseñas no coinciden.'); return; }
    setBusy(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setOk(true);
      setTimeout(() => nav('/cliente/inicio'), 1200);
    } catch (e) {
      setMsg('No se pudo actualizar. Reintente.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="y-login">
      <motion.div className="box" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div style={{ display: 'grid', placeItems: 'center', marginBottom: 14 }}><LogoMark size={46} /></div>
        <h2 className="font-d" style={{ margin: '0 0 4px', fontSize: 22 }}>Nueva contraseña</h2>
        <p style={{ color: 'var(--muted)', fontSize: 13, margin: '0 0 18px' }}>Define tu nueva contraseña para continuar.</p>
        <div style={{ display: 'grid', gap: 10, textAlign: 'left' }}>
          <label className="label">Nueva contraseña</label>
          <input className="input" type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Mínimo 6 caracteres" />
          <label className="label">Repetir contraseña</label>
          <input className="input" type="password" value={pass2} onChange={(e) => setPass2(e.target.value)} placeholder="Repite la contraseña" />
        </div>
        <button className="y-btn red" style={{ width: '100%', marginTop: 16, padding: 14 }} disabled={busy} onClick={() => void save()}>
          {busy ? 'Guardando…' : 'Guardar contraseña'}
        </button>
        {msg && <p style={{ marginTop: 10, fontSize: 13, color: '#fca5a5', textAlign: 'center' }}>{msg}</p>}
        {ok && <p style={{ marginTop: 10, fontSize: 13, color: '#86efac', textAlign: 'center' }}>Contraseña actualizada. Redirigiendo…</p>}
        <Link to="/cliente/inicio" style={{ display: 'block', marginTop: 14, fontSize: 12, color: 'var(--muted)' }}>Volver al inicio</Link>
      </motion.div>
    </div>
  );
}