import { useCallback, useEffect, useMemo, useState } from 'react';
import { ErrorBox, Loading } from '../../../components/ui';
import { Ico } from '../../../components/Icon';
import { fmtPEN } from '../../../lib/format';
import { leerPermisos } from '../../auth/login/auth-service';
import {
  aperturarCaja,
  confirmarCierreCaja,
  listarCierresPendientes,
  listarCajaMaestros,
  listarCajaPendientes,
  registrarCobro,
  solicitarCierreCaja,
  type CajaInfo,
  type CierrePendiente,
  type MetodoPagoInfo,
  type Ticket,
} from '../staff-service';

function mensajeCaja(codigo: string): string {
  const mensajes: Record<string, string> = {
    EFECTIVO_INSUFICIENTE: 'El monto recibido no cubre el total de la cuenta.',
    REFERENCIA_REQUERIDA: 'Ingresa el número de operación para este método de pago.',
    PEDIDO_NO_POR_COBRAR: 'La cuenta todavía no fue solicitada por la mesa.',
    PEDIDO_FACTURADO: 'Este pedido ya fue cobrado.',
    NO_CAJA_ABIERTA: 'No hay un turno abierto para esta caja.',
    TURNO_NO_ABIERTO: 'El turno ya no está disponible para cierre.',
    CIERRE_NO_PENDIENTE: 'Este arqueo ya fue atendido.',
    SOLO_CAJERO_APERTURA: 'Solo quien aperturó el turno puede solicitar su cierre.',
    VALIDADOR_DEBE_SER_DISTINTO: 'El cierre debe ser aprobado por otra persona.',
    RUC_INVALIDO: 'El RUC asociado al cliente no es válido.',
    FACTURA_REQUIERE_EMPRESA: 'Selecciona un cliente asociado a una empresa con RUC.',
    MONTO_INVALIDO: 'Ingresa un monto válido.',
  };
  return mensajes[codigo] ?? codigo;
}

export function StaffCajaPage() {
  const [pendientes, setPendientes] = useState<Ticket[] | null>(null);
  const [maestros, setMaestros] = useState<{ cajas: CajaInfo[]; metodosPago: MetodoPagoInfo[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [seleccion, setSeleccion] = useState<Ticket | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [cajaTurno, setCajaTurno] = useState<number>(0);
  const [montoInicial, setMontoInicial] = useState('');
  const [aperturando, setAperturando] = useState(false);
  const [montoDeclarado, setMontoDeclarado] = useState('');
  const [observacionCierre, setObservacionCierre] = useState('');
  const [solicitandoCierre, setSolicitandoCierre] = useState(false);
  const [validandoCierre, setValidandoCierre] = useState<number | null>(null);
  const [cierres, setCierres] = useState<CierrePendiente[]>([]);
  const permisos = leerPermisos();
  const puedeCerrar = permisos.includes('CAJ_CERRAR');
  const puedeValidarCierre = permisos.includes('CAJ_VALIDAR_CIERRE');

  const cargar = useCallback(async () => {
    try {
      const [pend, mast, solicitudes] = await Promise.all([
        listarCajaPendientes(),
        listarCajaMaestros(),
        puedeValidarCierre ? listarCierresPendientes() : Promise.resolve([]),
      ]);
      setPendientes(pend.filter((p) => p.anulado === 'N' && p.facturado === 'N'));
      setMaestros(mast);
      setCierres(solicitudes);
      setCajaTurno(
        (prev) =>
          prev ||
          mast.cajas.find((caja) => caja.aperturada === 'S' && !caja.cierrePendiente)?.id ||
          mast.cajas[0]?.id ||
          0,
      );
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo cargar la caja');
    }
  }, [puedeValidarCierre]);

  useEffect(() => {
    void cargar();
    const timer = window.setInterval(() => void cargar(), 15000);
    return () => window.clearInterval(timer);
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
      setMensaje(e instanceof Error ? mensajeCaja(e.message) : 'No se pudo aperturar la caja');
    } finally {
      setAperturando(false);
    }
  }, [cajaSel, montoInicial, cargar]);

  const solicitarCierre = useCallback(async () => {
    if (!cajaSel?.turnoId || cajaSel.cierrePendiente || montoDeclarado === '') return;
    setSolicitandoCierre(true);
    setMensaje(null);
    try {
      const result = await solicitarCierreCaja({
        cajaId: cajaSel.id,
        montoDeclarado: Number(montoDeclarado),
        observacion: observacionCierre,
      });
      setMensaje(`Cierre enviado a validación. Diferencia: ${fmtPEN(result.diferencia)}.`);
      setMontoDeclarado('');
      setObservacionCierre('');
      await cargar();
    } catch (e) {
      setMensaje(e instanceof Error ? mensajeCaja(e.message) : 'No se pudo solicitar el cierre');
    } finally {
      setSolicitandoCierre(false);
    }
  }, [cajaSel, montoDeclarado, observacionCierre, cargar]);

  const validarCierre = useCallback(async (cierre: CierrePendiente) => {
    setValidandoCierre(cierre.id);
    try {
      const result = await confirmarCierreCaja(cierre.id);
      setMensaje(`Cierre de ${cierre.cajaNombre} validado: ${result.resultado.toLowerCase()}.`);
      await cargar();
    } catch (e) {
      setMensaje(e instanceof Error ? mensajeCaja(e.message) : 'No se pudo validar el cierre');
    } finally {
      setValidandoCierre(null);
    }
  }, [cargar]);

  return (
    <div className="y-shell" style={{ padding: '24px 16px 140px', maxWidth: 1240, margin: '0 auto' }}>
      <section className="y-flow-hero" aria-labelledby="caja-hero-title">
        <div className="y-flow-hero__content">
          <span className="y-flow-hero__eyebrow">Operación y control de efectivo</span>
          <h1 id="caja-hero-title" className="y-flow-hero__title">Caja, clara y bajo control.</h1>
          <p className="y-flow-hero__description">
            Administra tu turno, cobra las cuentas solicitadas y entrega el arqueo para validación.
          </p>
          <div className="y-flow-hero__actions">
            <button className="y-btn line" onClick={() => void cargar()}>Actualizar información</button>
          </div>
        </div>
      </section>
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
              {!cajaSel ? (
                <span className="caja-muted">No hay cajas activas configuradas.</span>
              ) : cajaSel.aperturada === 'N' ? (
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
              ) : cajaSel.cierrePendiente ? (
                <span className="ys-status" style={{ color: '#fbbf24', background: '#fbbf2422' }}>
                  <i /> Cierre pendiente de validación
                </span>
              ) : (
                <>
                  <span className="ys-status" style={{ color: '#22c55e', background: '#22c55e22' }}>
                    <i /> Turno abierto · sistema {fmtPEN(cajaSel?.montoSistema ?? 0)}
                  </span>
                  {puedeCerrar && cajaSel?.turnoId && (
                    <div className="caja-cierre-form">
                      <label>
                        Efectivo contado
                        <input
                          className="input"
                          inputMode="decimal"
                          min="0"
                          placeholder="0.00"
                          value={montoDeclarado}
                          onChange={(e) => setMontoDeclarado(e.target.value)}
                        />
                      </label>
                      <label>
                        Observación (opcional)
                        <input
                          className="input"
                          maxLength={200}
                          placeholder="Diferencia, incidencia o comentario"
                          value={observacionCierre}
                          onChange={(e) => setObservacionCierre(e.target.value)}
                        />
                      </label>
                      <button
                        className="btn btn-ghost"
                        disabled={solicitandoCierre || montoDeclarado === '' || !Number.isFinite(Number(montoDeclarado)) || Number(montoDeclarado) < 0}
                        onClick={() => void solicitarCierre()}
                      >
                        {solicitandoCierre ? 'Enviando…' : 'Solicitar cierre'}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          {puedeValidarCierre && (
            <section className="caja-validaciones card" aria-labelledby="cierres-pendientes-title">
              <div className="caja-section-heading">
                <div>
                  <span className="y-flow-hero__eyebrow">Supervisión</span>
                  <h2 id="cierres-pendientes-title">Arqueos por validar</h2>
                </div>
                <span className="caja-count">{cierres.length}</span>
              </div>
              {cierres.length === 0 ? (
                <p className="caja-muted">No hay cierres pendientes de aprobación.</p>
              ) : cierres.map((cierre) => (
                <article className="caja-cierre-pendiente" key={cierre.id}>
                  <div>
                    <b>{cierre.cajaNombre}</b>
                    <span>{cierre.cajero} · {new Date(cierre.fechaSolicitud).toLocaleString('es-PE')}</span>
                    {cierre.observacion && <small>{cierre.observacion}</small>}
                  </div>
                  <div className="caja-arqueo-cifras">
                    <span>Sistema <b>{fmtPEN(cierre.montoSistema)}</b></span>
                    <span>Declarado <b>{fmtPEN(cierre.montoDeclarado)}</b></span>
                    <span>Diferencia <b>{fmtPEN(cierre.diferencia)}</b></span>
                  </div>
                  <button
                    className="btn btn-gold"
                    disabled={validandoCierre !== null}
                    onClick={() => void validarCierre(cierre)}
                  >
                    {validandoCierre === cierre.id ? 'Validando…' : 'Validar y cerrar'}
                  </button>
                </article>
              ))}
            </section>
          )}
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
                      <button
                        className="btn btn-gold"
                        disabled={!cajaSel || cajaSel.aperturada !== 'S' || cajaSel.cierrePendiente}
                        onClick={() => setSeleccion(t)}
                      >
                        Cobrar
                      </button>
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
          cajas={maestros.cajas.filter((c) => c.aperturada === 'S' && !c.cierrePendiente)}
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
        <p className="caja-feedback" role="status">{mensaje}</p>
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
  const [recibido, setRecibido] = useState<string>(ticket.total.toFixed(2));
  const [referencia, setReferencia] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const metodo = metodos.find((m) => m.id === metodoId);
  const esEfectivo = metodo?.afectaEfectivo ?? false;
  const montoRecibido = esEfectivo && recibido !== '' ? Number(recibido) : null;
  const efectivoInsuficiente = esEfectivo && (montoRecibido === null || montoRecibido < ticket.total);
  const requiereReferencia = metodo?.requiereReferencia ?? false;
  const faltaReferencia = requiereReferencia && referencia.trim() === '';
  const cajaCerrada = (cajas.find((c) => c.id === cajaId)?.aperturada ?? 'N') === 'N';

  const enviar = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      if (clienteTexto && !/^\d+$/.test(clienteTexto)) {
        throw new Error('ID_CLIENTE_INVALIDO');
      }
      if (esEfectivo && (recibido === '' || !Number.isFinite(Number(recibido)))) {
        throw new Error('MONTO_RECIBIDO_INVALIDO');
      }
      if (efectivoInsuficiente) throw new Error('EFECTIVO_INSUFICIENTE');
      if (faltaReferencia) throw new Error('REFERENCIA_REQUERIDA');
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
      setError(e instanceof Error ? mensajeCaja(e.message) : 'No se pudo registrar el cobro');
    } finally {
      setBusy(false);
    }
  }, [onCobrar, ticket, cajaId, metodoId, tipoDocumento, clienteTexto, montoRecibido, referencia, esEfectivo, recibido, efectivoInsuficiente, faltaReferencia]);

  useEffect(() => {
    const cerrarConEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busy) onClose();
    };
    window.addEventListener('keydown', cerrarConEscape);
    return () => window.removeEventListener('keydown', cerrarConEscape);
  }, [busy, onClose]);

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
        role="dialog"
        aria-modal="true"
        aria-labelledby="cobro-modal-title"
      >
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <h3 id="cobro-modal-title" style={{ margin: 0 }}>Cobrar {ticket.numero}</h3>
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
              <label htmlFor="cobro-efectivo" style={{ color: 'var(--text-muted)', fontSize: 12 }}>Monto recibido</label>
              <input
                id="cobro-efectivo"
                className="input"
                inputMode="decimal"
                placeholder={ticket.total.toFixed(2)}
                value={recibido}
                onChange={(e) => setRecibido(e.target.value)}
              />
              <div className="caja-vuelto">
                <span>Total a pagar <b>{fmtPEN(ticket.total)}</b></span>
                <span>Vuelto estimado <b>{fmtPEN(Math.max(0, Number(recibido || 0) - ticket.total))}</b></span>
              </div>
            </>
          )}

          {(!esEfectivo || requiereReferencia) && (
            <>
              <label htmlFor="cobro-referencia" style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                Número de operación{requiereReferencia ? '' : ' (opcional)'}
              </label>
              <input
                id="cobro-referencia"
                className="input"
                maxLength={30}
                placeholder="N° de operación"
                value={referencia}
                onChange={(e) => setReferencia(e.target.value)}
              />
            </>
          )}
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
          disabled={busy || cajaCerrada || efectivoInsuficiente || faltaReferencia}
          onClick={() => void enviar()}
        >
          {busy ? 'Procesando cobro…' : 'Confirmar cobro'}
        </button>
        <p style={{ marginTop: 8, color: 'var(--text-muted)', fontSize: 12 }}>
          El cobro se registrará en una sola operación. Revisa el método y el total antes de confirmar.
        </p>
      </div>
    </div>
  );
}
