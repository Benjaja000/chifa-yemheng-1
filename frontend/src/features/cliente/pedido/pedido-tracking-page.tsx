import { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, X, ChefHat, ConciergeBell, PackageCheck, Receipt } from 'lucide-react';
import { Loading } from '../../../components/ui';
import DishImg from '../../../components/DishImg';
import { useClienteAuth } from '../auth/cliente-auth-context';
import { EstadoBadge } from '../../../shared/ui/EstadoBadge';
import { useRealtimePedido } from '../../../shared/hooks/useRealtimePedido';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/v1';

const PASOS = [
  { id: 'recibido', label: 'Recibido', icon: Receipt },
  { id: 'preparacion', label: 'En preparación', icon: ChefHat },
  { id: 'servido', label: 'Servido', icon: ConciergeBell },
  { id: 'entregado', label: 'Entregado', icon: PackageCheck },
];

interface DetalleDTO {
  id: number;
  producto: string;
  cantidad: number;
  estadoPreparacion: 'P' | 'E' | 'S' | 'A';
  estadoRegistro: 'A' | 'I';
  precioUnitario: number;
  subTotal: number;
  fechaAtencion: string | null;
}

interface PedidoDTO {
  id: number;
  numero: string;
  mesaId: number | null;
  estado: string;
  estadoComandaDerivado: string;
  total: number;
  facturado: 'S' | 'N';
  anulado: 'S' | 'N';
  detalles: DetalleDTO[];
}

function pasoDeEstado(e: string): number {
  switch (e) {
    case 'EN PREPARACION': return 1;
    case 'SERVIDO': return 2;
    case 'FACTURADO': return 3;
    default: return 0; // RECIBIDO / ABIERTO
  }
}

export function ClientePedidoTrackingPage() {
  const { id } = useParams();
  const { token, logoutCliente } = useClienteAuth();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [pedido, setPedido] = useState<PedidoDTO | null>(null);
  const [pidiendo, setPidiendo] = useState(false);
  const [msgCuenta, setMsgCuenta] = useState<string | null>(null);
  const [errCuenta, setErrCuenta] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!token || !id) return;
    try {
      const res = await fetch(`${API_URL}/cliente/pedidos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        if (res.status === 401) {
          void logoutCliente();
          return;
        }
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setErr(body.error ?? 'NETWORK_ERROR');
        return;
      }
      const data = (await res.json()) as PedidoDTO;
      setPedido(data);
    } finally {
      setLoading(false);
    }
  }, [id, token, logoutCliente]);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  useRealtimePedido(pedido ? Number(id) : null, () => void cargar());

  async function pedirCuenta() {
    if (!pedido || !token || pedido.mesaId == null || pidiendo) return;
    setPidiendo(true);
    setMsgCuenta(null);
    setErrCuenta(null);
    try {
      const res = await fetch(`${API_URL}/cliente/pedidos/cuenta`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ mesaId: pedido.mesaId }),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setErrCuenta(
          body.error === 'YA_POR_COBRAR'
            ? 'Ya pediste la cuenta; el mozo/ cajero la traerá en breve.'
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

  if (loading) return <div className="y-shell" style={{ padding: 24 }}><Loading text="Cargando tu pedido…" /></div>;

  if (err || !pedido) {
    return (
      <div className="y-shell" style={{ padding: '24px 16px 140px', maxWidth: 480, margin: '0 auto' }}>
        <div className="y-panel" style={{ padding: 24, textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 8px', fontSize: 18 }}>No se encontró tu pedido</h2>
          <p style={{ color: 'var(--muted)', fontSize: 13, margin: 0 }}>{err === 'NO_PARTICIPANTE' ? 'No participas de esta comanda.' : err ?? 'Inténtalo de nuevo.'}</p>
          <Link className="y-btn line" to="/cliente/inicio" style={{ marginTop: 16, display: 'inline-flex' }}>Volver</Link>
        </div>
      </div>
    );
  }

  const step = pedido.anulado === 'S' ? -1 : pasoDeEstado(pedido.estadoComandaDerivado);
  const activos = pedido.detalles.filter((d) => d.estadoRegistro === 'A' && d.estadoPreparacion !== 'A');
  const puedePedirCuenta = pedido.mesaId != null && pedido.anulado === 'N' && pedido.estadoComandaDerivado !== 'FACTURADO';
  const porCobrar = pedido.mesaId != null && (step >= 2 || msgCuenta != null);

  return (
    <div className="y-shell" style={{ padding: '24px 16px 140px', maxWidth: 480, margin: '0 auto' }}>
      <section className="y-flow-hero y-cliente-flow-hero" aria-labelledby="pedido-hero-title">
        <div className="y-flow-hero__content">
          <span className="y-flow-hero__eyebrow">
            {pedido.mesaId ? `Mesa ${pedido.mesaId}` : 'Seguimiento de pedido'}
          </span>
          <h1 id="pedido-hero-title" className="y-flow-hero__title">Sigue cada paso de tu pedido.</h1>
          <p className="y-flow-hero__description">
            Pedido {pedido.numero} · {pedido.estadoComandaDerivado}
          </p>
        </div>
      </section>
      <div className="y-panel" style={{ padding: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Link to="/cliente/inicio" style={{ color: 'var(--muted)' }}><ArrowLeft size={18} /></Link>
          <h2 className="font-d" style={{ margin: 0, fontSize: 20 }}>{pedido.numero}</h2>
          <Link to="/cliente/inicio" style={{ color: 'var(--muted)' }}><X size={18} /></Link>
        </div>

        {pedido.anulado === 'S' ? (
          <div className="y-banner" style={{ marginBottom: 12 }}>Tu pedido fue anulado.</div>
        ) : (
          <div className="y-track">
            {PASOS.map((p, i) => {
              const done = i < step;
              const now = i === step;
              return (
                <div key={p.id} className={`y-tstep ${done ? 'done' : ''} ${now ? 'now' : ''}`}>
                  <div className="dot"><p.icon size={16} /></div>
                  <div>
                    <b>{p.label}</b>
                    <small>{done ? 'Completado' : now ? 'En curso' : 'Pendiente'}</small>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <b style={{ fontSize: 13 }}>Platos enviados</b>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
             {activos.map((it) => (
               <div key={it.id} className="y-line">
                 <DishImg alt={it.producto} style={{ width: 44, height: 44, borderRadius: 10 }} />
                 <div style={{ flex: 1 }}>
                   <b style={{ fontSize: 13 }}>{it.producto}</b>
                   <div style={{ fontSize: 11, color: 'var(--muted)' }}>x{it.cantidad}</div>
                 </div>
                 <EstadoBadge
                   estado={it.estadoPreparacion}
                   size="sm"
                   tooltip={it.fechaAtencion ? new Date(it.fechaAtencion).toLocaleTimeString() : undefined}
                 />
               </div>
             ))}
            {activos.length === 0 && <div style={{ fontSize: 12, color: 'var(--muted)' }}>Sin platos pendientes de servir.</div>}
          </div>
        </div>

        {(step >= 2 || msgCuenta) && !errCuenta && (
          <div className="y-banner" style={{ marginTop: 14 }}>✓ Tu comanda está servida/lista para servir.</div>
        )}
        {msgCuenta && (
          <div className="y-banner" style={{ marginTop: 14 }}>{msgCuenta}</div>
        )}
        {errCuenta && (
          <div className="y-banner" style={{ marginTop: 14, borderColor: 'rgba(239,68,68,.4)', background: 'rgba(239,68,68,.08)', color: '#fca5a5' }}>{errCuenta}</div>
        )}

        {puedePedirCuenta ? (
          <button
            className="y-btn red"
            style={{ width: '100%', marginTop: 16 }}
            disabled={pidiendo || porCobrar}
            onClick={() => void pedirCuenta()}
          >
            {porCobrar ? 'Cuenta pedida ✔' : pidiendo ? 'Pidiendo…' : 'Pedir la cuenta'}
          </button>
        ) : (
          <Link className="y-btn line" to="/cliente/inicio" style={{ width: '100%', marginTop: 16, justifyContent: 'center' }}>
            Volver al inicio
          </Link>
        )}
      </div>
    </div>
  );
}
