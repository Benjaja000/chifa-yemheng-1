import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Ico } from '../../../components/Icon';
import { QrScannerModal } from '../../../components/QrScannerModal';
import { Loading } from '../../../components/ui';
import { useClienteAuth } from '../auth/cliente-auth-context';
import { useCart } from '../../../contexts/CartContext';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/v1';

interface ComandaActiva {
  id: number;
  numero: string;
  mesaId: number;
  estado: string;
  estadoComandaDerivado: string;
  total: number;
  cantidadDetalles: number;
  mesaEstado: string | null;
}

const ESTUDIOS: Record<string, string> = {
  'EN PREPARACION': 'f59e0b',
  'SERVIDO': '22c55e',
  ABIERTO: '6c757d',
};

export function ClienteMiConsumoPage() {
  const { mesaId, setMesaId } = useCart();
  const { token, logoutCliente } = useClienteAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [comanda, setComanda] = useState<ComandaActiva | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [pidiendo, setPidiendo] = useState(false);
  const [msgCuenta, setMsgCuenta] = useState<string | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);

  const cargar = useCallback(async () => {
    if (!mesaId || !token) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`${API_URL}/cliente/pedidos/comanda?mesaId=${Number(mesaId)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        if (res.status === 401) {
          void logoutCliente();
          return;
        }
        setErr('No se pudo cargar tu consumo.');
        return;
      }
      const data = (await res.json()) as ComandaActiva | null;
      setComanda(data && 'id' in data ? data : null);
    } finally {
      setLoading(false);
    }
  }, [mesaId, token, logoutCliente]);

  useEffect(() => {
    void cargar();
    const t = setInterval(() => void cargar(), 10000);
    return () => clearInterval(t);
  }, [cargar]);

  async function pedirLaCuenta() {
    if (!mesaId || !token || pidiendo) return;
    setPidiendo(true);
    setMsgCuenta(null);
    try {
      const res = await fetch(`${API_URL}/cliente/pedidos/cuenta`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ mesaId: Number(mesaId) }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setMsgCuenta(
          body.error === 'YA_POR_COBRAR'
            ? 'Ya pediste la cuenta; el mozo/cajero la traerá en breve.'
            : body.error === 'NO_COMANDA_ACTIVA'
              ? 'No hay comanda activa en tu mesa.'
              : body.error ?? 'No se pudo pedir la cuenta.',
        );
        return;
      }
      setMsgCuenta('Cuenta pedida ✔ Un mozo o cajero se acerca a tu mesa.');
      await cargar();
    } finally {
      setPidiendo(false);
    }
  }

  const porCobrar = comanda?.mesaEstado === 'POR COBRAR' || msgCuenta != null;

  if (!mesaId) {
    return (
      <div className="y-shell" style={{ padding: '24px 16px 140px', maxWidth: 520, margin: '0 auto' }}>
        <div className="y-panel" style={{ padding: 24, textAlign: 'center' }}>
          <Ico n="alert" size={24} />
          <h2 style={{ margin: '8px 0 4px', fontSize: 18 }}>Mi consumo</h2>
          <p style={{ color: 'var(--muted)', fontSize: 13, margin: 0 }}>
            Escanea el QR de tu mesa para ver tu comanda en vivo.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
            {token ? (
              <button className="y-btn red" onClick={() => setScannerOpen(true)}>Escanear mesa</button>
            ) : (
              <Link className="y-btn red" to="/cliente/login">Iniciar sesión para escanear</Link>
            )}
            <Link className="y-btn line" to="/cliente/inicio">Volver</Link>
          </div>
        </div>
        <QrScannerModal
          open={scannerOpen}
          onClose={() => setScannerOpen(false)}
          onScan={(codigo) => {
            setMesaId(codigo);
            setScannerOpen(false);
          }}
        />
      </div>
    );
  }

  if (loading && !comanda) return <div className="y-shell" style={{ padding: 24 }}><Loading text="Cargando tu consumo…" /></div>;

  return (
    <div className="y-shell" style={{ padding: '24px 16px 140px', maxWidth: 520, margin: '0 auto' }}>
      <h1 className="font-d" style={{ fontSize: 28, margin: '0 0 12px' }}>Mi consumo — Mesa {mesaId}</h1>

      {err && <div className="y-banner" style={{ borderColor: 'rgba(239,68,68,.4)', background: 'rgba(239,68,68,.08)', color: '#fca5a5' }}>{err}</div>}
      {msgCuenta && <div className="y-banner">{msgCuenta}</div>}

      {comanda ? (
        <div className="y-panel" style={{ padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <b className="font-d" style={{ fontSize: 16 }}>{comanda.numero}</b>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>Mesa {comanda.mesaId}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: ESTUDIOS[comanda.estadoComandaDerivado] ?? '#6c757d', display: 'inline-block' }} />
            <b style={{ fontSize: 13 }}>{comanda.estadoComandaDerivado}</b>
          </div>
          {comanda.mesaEstado === 'POR COBRAR' && (
            <div className="y-banner" style={{ marginTop: 12 }}>Mesa en estado POR COBRAR — esperando al cajero.</div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 14 }}>
            <span>{comanda.cantidadDetalles} ítems enviados</span>
            <b className="y-price">S/ {comanda.total.toFixed(2)}</b>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
            <button className="y-btn line sm" onClick={() => navigate(`/cliente/pedido/${comanda.id}`)}>Ver seguimiento</button>
            <button
              className="y-btn red sm"
              disabled={pidiendo || porCobrar || comanda.mesaEstado === 'POR COBRAR'}
              onClick={() => void pedirLaCuenta()}
            >
              {porCobrar ? 'Cuenta pedida ✔' : pidiendo ? 'Pidiendo…' : 'Pedir la cuenta'}
            </button>
          </div>
        </div>
      ) : (
        <div className="y-panel" style={{ padding: 24, textAlign: 'center' }}>
          <p style={{ color: 'var(--muted)', margin: 0 }}>No hay comanda activa en tu mesa.</p>
          <Link className="y-btn red" to="/cliente/menu" style={{ marginTop: 16, display: 'inline-flex' }}>Ver carta</Link>
        </div>
      )}

      <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <Link className="y-btn line" to="/cliente/comanda">Mi comanda</Link>
        <Link className="y-btn line" to="/cliente/inicio">Volver</Link>
      </div>

      <QrScannerModal
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onScan={(codigo) => {
          setMesaId(codigo);
          setScannerOpen(false);
        }}
      />
    </div>
  );
}
