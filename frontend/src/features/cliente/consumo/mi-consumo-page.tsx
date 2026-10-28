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
  modoPagoMesa: 'CUENTA_UNICA' | 'POR_CONSUMO';
  esOrganizador: boolean;
  participantes: {
    clienteId: number;
    nombre: string;
    esOrganizador: boolean;
    consumoEstimado: number;
  }[];
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
  const [guardandoModo, setGuardandoModo] = useState(false);
  const [errModo, setErrModo] = useState<string | null>(null);
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
            ? 'La solicitud de cuenta ya figura para esta mesa.'
            : body.error === 'NO_COMANDA_ACTIVA'
              ? 'No hay comanda activa en tu mesa.'
              : body.error ?? 'No se pudo pedir la cuenta.',
        );
        return;
      }
      setMsgCuenta('Solicitud de cuenta enviada.');
      await cargar();
    } finally {
      setPidiendo(false);
    }
  }

  async function cambiarModoPago(modo: ComandaActiva['modoPagoMesa']) {
    if (!comanda || !token || !comanda.esOrganizador || guardandoModo || porCobrar) return;
    setGuardandoModo(true);
    setErrModo(null);
    try {
      const res = await fetch(`${API_URL}/cliente/pedidos/${comanda.id}/modo-pago`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ modo }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setErrModo(body.error === 'NO_ES_ORGANIZADOR'
          ? 'Solo quien inició la comanda puede cambiar el modo de pago.'
          : body.error ?? 'No se pudo actualizar el modo de pago.');
        return;
      }
      await cargar();
    } finally {
      setGuardandoModo(false);
    }
  }

  const porCobrar = comanda?.mesaEstado === 'POR COBRAR' || msgCuenta != null;

  if (!mesaId) {
    return (
      <div className="y-shell" style={{ padding: '24px 16px 140px', maxWidth: 520, margin: '0 auto' }}>
        <section className="y-flow-hero y-cliente-flow-hero" aria-labelledby="consumo-scan-title">
          <div className="y-flow-hero__content">
            <span className="y-flow-hero__eyebrow">Autoconsumo QR</span>
            <h1 id="consumo-scan-title" className="y-flow-hero__title">Escanea tu mesa y comparte el consumo.</h1>
            <p className="y-flow-hero__description">
              Todas las personas de la mesa pueden seguir los pedidos y consultar el total acumulado.
            </p>
            <div className="y-flow-hero__actions">
              {token ? (
                <button className="y-btn line" onClick={() => setScannerOpen(true)}>Escanear mesa</button>
              ) : (
                <Link className="y-btn line" to="/cliente/login">Iniciar sesión para escanear</Link>
              )}
            </div>
          </div>
        </section>
        <div className="y-panel" style={{ padding: 24, textAlign: 'center' }}>
          <Ico n="alert" size={24} />
          <h2 style={{ margin: '8px 0 4px', fontSize: 18 }}>Mi consumo</h2>
          <p style={{ color: 'var(--muted)', fontSize: 13, margin: 0 }}>
            Escanea el QR de tu mesa para ver tu comanda en vivo.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
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
      <section className="y-flow-hero y-cliente-flow-hero" aria-labelledby="consumo-hero-title">
        <div className="y-flow-hero__content">
          <span className="y-flow-hero__eyebrow">Mesa {mesaId}</span>
          <h1 id="consumo-hero-title" className="y-flow-hero__title">Tu consumo, siempre a la vista.</h1>
          <p className="y-flow-hero__description">
            Consulta la cuenta compartida de tu mesa y solicita el cobro cuando estén listos.
          </p>
          <div className="y-flow-hero__actions y-client-actions">
            {comanda ? (
              <>
                <button className="y-btn y-btn-hero-secondary y-client-action-secondary" onClick={() => navigate(`/cliente/pedido/${comanda.id}`)}>
                  Ver seguimiento
                </button>
                <Link className="y-btn y-btn-hero-secondary y-client-action-secondary" to="/cliente/menu">
                  Agregar otra tanda
                </Link>
                <button
                  className="y-btn y-btn-hero y-client-action-primary"
                  disabled={pidiendo || porCobrar || comanda.mesaEstado === 'POR COBRAR'}
                  onClick={() => void pedirLaCuenta()}
                >
                  {porCobrar ? 'Cuenta pedida ✔' : pidiendo ? 'Pidiendo…' : 'Pedir la cuenta'}
                </button>
              </>
            ) : null}
          </div>
        </div>
      </section>

      {err && <div className="y-banner" style={{ borderColor: '#ba1a1a', background: '#ffdad6', color: '#93000a' }}>{err}</div>}
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
            <div className="y-banner" style={{ marginTop: 12 }}>La solicitud de cuenta está registrada para esta mesa.</div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 14 }}>
            <span>{comanda.cantidadDetalles} ítems enviados</span>
            <b className="y-price">S/ {comanda.total.toFixed(2)}</b>
          </div>
          <section style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
            <label htmlFor="modo-pago-mesa" style={{ display: 'block', fontSize: 12, color: 'var(--muted)' }}>
              Forma de liquidar la cuenta
            </label>
            <select
              id="modo-pago-mesa"
              className="select"
              style={{ width: '100%', marginTop: 6 }}
              value={comanda.modoPagoMesa}
              disabled={!comanda.esOrganizador || porCobrar || guardandoModo}
              onChange={(event) => void cambiarModoPago(event.target.value as ComandaActiva['modoPagoMesa'])}
            >
              <option value="CUENTA_UNICA">Cuenta completa en un solo pago</option>
              <option value="POR_CONSUMO">Cada integrante paga su consumo</option>
            </select>
            <p style={{ margin: '6px 0 0', fontSize: 11, color: 'var(--muted)' }}>
              {comanda.esOrganizador
                ? 'El modo se define antes de pedir la cuenta.'
                : 'Solo el organizador puede elegir la forma de pago.'}
            </p>
            {errModo && <p role="alert" style={{ color: '#93000a', fontSize: 12 }}>{errModo}</p>}
            {comanda.modoPagoMesa === 'POR_CONSUMO' && (
              <div style={{ display: 'grid', gap: 6, marginTop: 10 }}>
                {comanda.participantes.map((participante) => (
                  <div key={participante.clienteId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span>{participante.nombre}{participante.esOrganizador ? ' · Organizador' : ''}</span>
                    <b>S/ {participante.consumoEstimado.toFixed(2)}</b>
                  </div>
                ))}
                <small style={{ color: 'var(--muted)' }}>
                  Importes estimados; los platos compartidos se distribuyen entre los participantes.
                </small>
              </div>
            )}
          </section>
        </div>
      ) : (
        <div className="y-panel" style={{ padding: 24, textAlign: 'center' }}>
          <p style={{ color: 'var(--muted)', margin: 0 }}>No hay una comanda activa para esta mesa.</p>
        </div>
      )}

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
