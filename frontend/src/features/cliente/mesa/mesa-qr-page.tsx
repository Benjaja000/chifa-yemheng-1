import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { useCart } from '../../../contexts/CartContext';
import { useClienteAuth } from '../auth/cliente-auth-context';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/v1';

interface MesaInfo {
  id: number;
  numero: string;
  ambiente: string;
  capacidad: number;
  estadoOperativo: string;
  qr: string | null;
}

export default function MesaQrPage() {
  const { id } = useParams();
  const { setMesaId } = useCart();
  const { cliente } = useClienteAuth();
  const [mesa, setMesa] = useState<MesaInfo | null>(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setErr('Mesa no especificada.');
      setLoading(false);
      return;
    }
    let cancelado = false;
    setLoading(true);
    setErr('');
    fetch(`${API_URL}/mesas/by-qr?codigo=${encodeURIComponent(id)}`)
      .then(async (res) => {
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(body.error === 'QR_INVALIDO' ? 'Mesa no encontrada o inactiva.' : (body.error ?? 'NETWORK_ERROR'));
        }
        return res.json();
      })
      .then((data: MesaInfo) => {
        if (cancelado) return;
        setMesa(data);
        setMesaId(String(data.id));
      })
      .catch((e: Error) => {
        if (!cancelado) setErr(e.message);
      })
      .finally(() => {
        if (!cancelado) setLoading(false);
      });
    return () => {
      cancelado = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="y-shell" style={{ padding: 24, display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--muted)' }}>Identificando tu mesa…</p>
      </div>
    );
  }
  if (err || !mesa) {
    return (
      <div className="y-shell" style={{ padding: 24, maxWidth: 420, margin: '0 auto' }}>
        <div className="y-panel" style={{ padding: 24, textAlign: 'center' }}>
          <p style={{ color: 'var(--rose-soft, #ffb4ab)', fontWeight: 600 }}>{err || 'Mesa no encontrada.'}</p>
          <Link to="/cliente/login" className="y-btn red" style={{ marginTop: 16 }}>Volver al login</Link>
        </div>
      </div>
    );
  }

  const qrValue = `${window.location.origin}/cliente/login?mesa=${encodeURIComponent(mesa.qr ?? id ?? '')}`;

  return (
    <div className="y-shell" style={{ padding: '24px 16px 140px', maxWidth: 420, margin: '0 auto' }}>
      <motion.div className="y-panel" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} style={{ padding: 26, textAlign: 'center', background: 'radial-gradient(300px 200px at 50% 0,rgba(166,30,34,0.12),transparent),var(--surface-lowest)' }}>
        <p style={{ margin: '0 0 18px', fontSize: 14, color: 'var(--text-muted)' }}>Escanea el QR de tu mesa</p>
        <div className="y-qrbox">
          <i /><i /><i /><i /><span className="scan" />
          <div style={{ background: '#fff', padding: 10, borderRadius: 8, display: 'inline-block' }}>
            <QRCodeSVG value={qrValue} size={168} />
          </div>
        </div>
        <h1 className="font-d" style={{ fontSize: 34, margin: '16px 0 4px' }}>Mesa {mesa.numero}</h1>
        <p style={{ color: 'var(--muted)', fontSize: 12, margin: 0 }}>
          {mesa.ambiente} · Capacidad {mesa.capacidad} · {mesa.estadoOperativo}
        </p>
        <p style={{ color: 'var(--muted)', fontSize: 12, margin: '14px 0' }}>
          Abre la cámara de tu celular y escanea el código. Tus acompañantes comparten esta misma comanda.
        </p>
        <div className="y-client-actions">
          <Link
            className="y-btn y-btn-hero y-client-action-primary"
            to={cliente ? '/cliente/menu' : `/cliente/login?mesa=${encodeURIComponent(mesa.qr ?? id ?? '')}`}
          >
            Ver carta y pedir
          </Link>
          <Link
            className="y-btn y-btn-hero-secondary y-client-action-secondary"
            to={cliente ? '/cliente/mi-consumo' : `/cliente/login?mesa=${encodeURIComponent(mesa.qr ?? id ?? '')}`}
          >
            Mi comanda
          </Link>
        </div>
      </motion.div>
    </div>
  );
}