import { useCallback, useEffect, useMemo, useState } from 'react';
import { ErrorBox, Loading, PageHeader } from '../../../components/ui';
import { Ico } from '../../../components/Icon';
import { fmtPEN } from '../../../lib/format';
import {
  aperturarCaja,
  listarCajaMaestros,
  listarCajaPendientes,
  registrarCobro,
  type CajaInfo,
  type MetodoPagoInfo,
  type Ticket,
} from '../staff-service';

export function StaffCajaPage() {
  const [pendientes, setPendientes] = useState<Ticket[] | null>(null);
  const [maestros, setMaestros] = useState<{ cajas: CajaInfo[]; metodosPago: MetodoPagoInfo[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [seleccion, setSeleccion] = useState<Ticket | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [cajaTurno, setCajaTurno] = useState<number>(0);
  const [montoInicial, setMontoInicial] = useState('');
  const [aperturando, setAperturando] = useState(false);

  const cargar = useCallback(async () => {
    try {
      const [pend, mast] = await Promise.all([listarCajaPendientes(), listarCajaMaestros()]);
      // Solo pedidos por cobrar, no anulados ni ya facturados.
      setPendientes(pend.filter((p) => p.anulado === 'N' && p.facturado === 'N'));
      setMaestros(mast);
      setCajaTurno((prev) => prev || mast.cajas[0]?.id || 0);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo cargar la caja');
    }
  }, []);

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const total = useMemo(
    () => (pendientes ?? []).reduce((acc, t) => acc + (t.total ?? 0), 0),
    [pendientes],
  );

  const cajaSel = maestros?.cajas.find((c) => c.id === cajaTurno) ?? null;

  const aperturar = useCallback(async () => {
    if (!cajaSel) return;
    setAperturando(true);
    try {
      const r = await aperturarCaja(cajaSel.id, Number(montoInicial || 0));
      setMensaje(`Turno aperturado en ${cajaSel.nombre}. ${r.mensaje}`.trim());
      setMontoInicial('');
      await cargar();
    } catch (e) {
      setMensaje(e instanceof Error ? e.message : 'No se pudo aperturar la caja');
    } finally {
      setAperturando(false);
    }
  }, [cajaSel, montoInicial, cargar]);

  return (
    <div className="y-shell" style={{ padding: '24px 16px 140px', maxWidth: 1240, margin: '0 auto' }}>
      <PageHeader
        title="Caja"
        sub="Turno de caja, cobros y movimientos."
        right={
          <button className="btn btn-ghost" onClick={() => void cargar()}>
            Refrescar
          </button>
        }
      />
      {error && <ErrorBox msg={error} retry={cargar} />}
      {pendientes === null && !error && <Loading text="Cargando caja..." />}
      {pendientes && maestros && !error && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 16 }}>
            <div className="ys-kpi card">
              <div className="ic" style={{ background: 'var(--primary)' }}>
                <Ico n="chair" size={20} />
              </div>
              <b>{pendientes.length}</b>
              <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Pedidos pendientes</span>
            </div>
            <div className="ys-kpi card">
              <div className="ic" style={{ background: 'var(--primary)' }}>
                <Ico n="money" size={20} />
              </div>
              <b>{fmtPEN(total)}</b>
              <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Total por cobrar</span>
            </div>
            <div className="ys-kpi card">
              <div className="ic" style={{ background: 'var(--primary)' }}>
                <Ico n="store" size={20} />
              </div>
              <b>{maestros.cajas.length}</b>
              <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Cajas activas</span>
            </div>
          </div>
          <div className="card" style={{ padding: 16, marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <b>Turno de caja</b>
                <p style={{ margin: '2px 0 0', color: 'var(--text-muted)', fontSize: 12 }}>
                  Apertura el turno antes de registrar cobros.
                </p>
              </div>
              <select className="select" value={cajaTurno} onChange={(e) => setCajaTurno(Number(e.target.value))} style={{ maxWidth: 220 }}>
                {maestros.cajas.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} · {c.aperturada === 'S' ? 'ABIERTA' : 'CERRADA'}
                  </option>
                ))}
              </select>
              {cajaSel?.aperturada === 'N' ? (
                <>
                  <input
                    className="input"
                    inputMode="decimal"
                    placeholder="Monto inicial S/"
                    value={montoInicial}
                    onChange={(e) => setMontoInicial(e.target.value)}
                    style={{ width: 140 }}
                  />
                  <button className="btn btn-gold" disabled={aperturando || !cajaSel} onClick={() => void aperturar()}>
                    Aperturar turno
                  </button>
                </>
              ) : (
                <span className="ys-status" style={{ color: '#22c55e', background: '#22c55e22' }}>
                  <i /> Turno abierto
                </span>
              )}
            </div>
          </div>
          {pendientes.length === 0 ? (
            <div className="card" style={{ padding: 32, textAlign: 'center' }}>
              <Ico n="ok" size={40} />
              <h3 style={{ margin: '8px 0 0' }}>Todo en orden</h3>
              <p style={{ color: 'var(--text-muted)' }}>No hay pedidos pendientes de cobro.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 10 }}>
              {pendientes.map((t) => (
                <div key={t.id} className="ys-ticket card" style={{ ['--tone' as string]: '#17a2b8' }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <b>{t.numero}</b>
                    <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                      {t.mesaId ? `Mesa ${t.mesaId}` : 'Delivery'} · {t.detalles.length} ítems · S/ {(t.total ?? 0).toFixed(2)}
                    </span>
                    <span style={{ marginLeft: 'auto' }}>
                      <button className="btn btn-gold" onClick={() => setSeleccion(t)}>Cobrar</button>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {seleccion && maestros && (
        <CobroModal
          ticket={seleccion}
          cajas={maestros.cajas}
          metodos={maestros.metodosPago}
          onClose={() => {
            setSeleccion(null);
            setMensaje(null);
          }}
          onCobrar={async (payload) => {
            const res = await registrarCobro(payload);
            setMensaje(`Comprobante ${res.serie}-${res.numero} emitido`);
            setSeleccion(null);
            await cargar();
          }}
        />
      )}
      {mensaje && !seleccion && (
        <p style={{ marginTop: 14, color: 'var(--gold-light)' }}>{mensaje}</p>
      )}
    </div>
  );
}

function CobroModal({
  ticket,
  cajas,
  metodos,
  onClose,
  onCobrar,
}: {
  ticket: Ticket;
  cajas: CajaInfo[];
  metodos: MetodoPagoInfo[];
  onClose: () => void;
  onCobrar: (payload: {
    pedidoId: number;
    cajaId: number;
    metodoPagoId: number;
    tipoDocumento: string;
    clienteId: number | null;
    montoRecibido: number | null;
    referencia: string;
  }) => Promise<void>;
}) {
  const [cajaId, setCaja] = useState<number>(cajas[0]?.id ?? 0);
  const [metodoId, setMetodo] = useState<number>(metodos[0]?.id ?? 0);
  const [tipoDocumento, setTipoDocumento] = useState('03');
  const [clienteTexto, setClienteTexto] = useState('');
  const [recibido, setRecibido] = useState<string>('');
  const [referencia, setReferencia] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const metodo = metodos.find((m) => m.id === metodoId);
  const esEfectivo = metodo?.afectaEfectivo ?? false;
  const montoRecibido = esEfectivo && recibido !== '' ? Number(recibido) : null;
  const cajaCerrada = (cajas.find((c) => c.id === cajaId)?.aperturada ?? 'N') === 'N';

  const enviar = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      if (clienteTexto && !/^\d+$/.test(clienteTexto)) {
        throw new Error('ID_CLIENTE_INVALIDO');
      }
      if (esEfectivo && recibido !== '' && isNaN(Number(recibido))) {
        throw new Error('MONTO_RECIBIDO_INVALIDO');
      }
      await onCobrar({
        pedidoId: ticket.id,
        cajaId,
        metodoPagoId: metodoId,
        tipoDocumento,
        clienteId: clienteTexto ? Number(clienteTexto) : null,
        montoRecibido,
        referencia,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo registrar el cobro');
    } finally {
      setBusy(false);
    }
  }, [onCobrar, ticket, cajaId, metodoId, tipoDocumento, clienteTexto, montoRecibido, referencia, esEfectivo, recibido]);

  return (
    <div
      className="ys-veil"
      style={{ position: 'fixed', inset: 0, zIndex: 70, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,.35)' }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{ width: 'min(520px, 94vw)', padding: 22, maxHeight: '88vh', overflow: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0 }}>Cobrar {ticket.numero}</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 12 }}>
              {ticket.mesaId ? `Mesa ${ticket.mesaId}` : 'Delivery'} · {fmtPEN(ticket.total)}
            </p>
          </div>
          <button className="btn btn-ghost" onClick={onClose}>Cerrar</button>
        </div>

        <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
          <label style={{ color: 'var(--text-muted)', fontSize: 12 }}>Caja</label>
          <select className="select" value={cajaId} onChange={(e) => setCaja(Number(e.target.value))}>
            {cajas.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>

          <label style={{ color: 'var(--text-muted)', fontSize: 12 }}>Método de pago</label>
          <select className="select" value={metodoId} onChange={(e) => setMetodo(Number(e.target.value))}>
            {metodos.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nombre}
              </option>
            ))}
          </select>

          <label style={{ color: 'var(--text-muted)', fontSize: 12 }}>Comprobante</label>
          <select className="select" value={tipoDocumento} onChange={(e) => setTipoDocumento(e.target.value)}>
            <option value="03">Boleta</option>
            <option value="01">Factura (cliente empresa)</option>
          </select>

          {tipoDocumento === '01' && (
            <>
              <label style={{ color: 'var(--text-muted)', fontSize: 12 }}>ID cliente (empresa)</label>
              <input
                className="input"
                placeholder="Ej: 3"
                value={clienteTexto}
                onChange={(e) => setClienteTexto(e.target.value)}
              />
            </>
          )}

          {esEfectivo && (
            <>
              <label style={{ color: 'var(--text-muted)', fontSize: 12 }}>Monto recibido</label>
              <input
                className="input"
                inputMode="decimal"
                placeholder={ticket.total.toFixed(2)}
                value={recibido}
                onChange={(e) => setRecibido(e.target.value)}
              />
            </>
          )}

          <label style={{ color: 'var(--text-muted)', fontSize: 12 }}>Referencia (opcional)</label>
          <input
            className="input"
            placeholder="N° operación / datos"
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
          />
        </div>

        {error && (
          <p style={{ marginTop: 10, color: '#fca5a5' }}>{error}</p>
        )}
        {cajaCerrada && !error && (
          <p style={{ marginTop: 10, color: '#fcd34d' }}>
            La caja seleccionada está cerrada: apertura el turno primero.
          </p>
        )}

        <button
          className="btn btn-gold"
          style={{ marginTop: 14 }}
          disabled={busy || cajaCerrada}
          onClick={() => void enviar()}
        >
          Emitir comprobante
        </button>
        <p style={{ marginTop: 8, color: 'var(--text-muted)', fontSize: 12 }}>
          Se generará venta, comprobante, pago y movimiento de caja.
        </p>
      </div>
    </div>
  );
}
