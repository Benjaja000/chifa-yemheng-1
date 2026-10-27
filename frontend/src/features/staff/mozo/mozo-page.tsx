import { useCallback, useEffect, useMemo, useState } from 'react';
import { ErrorBox, Loading, PageHeader } from '../../../components/ui';
import { Ico } from '../../../components/Icon';
import { fmtPEN, timeAgo } from '../../../lib/format';
import { listarMesas } from '../../admin/mesas/mesas-service';
import { COLOR_POR_ESTADO, type Mesa } from '../../admin/mesas/mesas-types';
import { listarProductos } from '../../admin/productos/productos-service';
import type { Producto } from '../../admin/productos/productos-types';
import {
  abrirPedidoMesa,
  agregarLinea,
  confirmarEntregaMozo,
  listarEntregasMozo,
  listarPedidoPorMesa,
  pedirCuenta,
  type Ticket,
} from '../staff-service';
import { EstadoBadge } from '../../../shared/ui/EstadoBadge';
import { useRealtimePedido } from '../../../shared/hooks/useRealtimePedido';

function tone(mesa: Mesa): string {
  return mesa.color || COLOR_POR_ESTADO[mesa.estadoOperativo] || '#d4a017';
}

export function StaffMozoPage() {
  const [mesas, setMesas] = useState<Mesa[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [buscar, setBuscar] = useState('');
  const [abierta, setAbierta] = useState<Mesa | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [cargandoComanda, setCargandoComanda] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [entregas, setEntregas] = useState<Ticket[] | null>(null);
  const [entregaError, setEntregaError] = useState<string | null>(null);
  const [entregasAbiertas, setEntregasAbiertas] = useState(false);

  const cargarMesas = useCallback(async () => {
    try {
      const lista = await listarMesas({ page: 1, limit: 100, ambiente: '', estado: 'A', buscar: '' });
      setMesas(lista.data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo cargar el salón');
    }
  }, []);

  useEffect(() => {
    void cargarMesas();
  }, [cargarMesas]);

  const cargarEntregas = useCallback(async () => {
    try {
      setEntregas(await listarEntregasMozo());
      setEntregaError(null);
    } catch (e) {
      setEntregaError(e instanceof Error ? e.message : 'No se pudieron cargar los platos listos');
    }
  }, []);

  useEffect(() => {
    void cargarEntregas();
    const timer = window.setInterval(() => void cargarEntregas(), 15000);
    return () => window.clearInterval(timer);
  }, [cargarEntregas]);

  const abrirComanda = useCallback(async (mesa: Mesa) => {
    setAbierta(mesa);
    setCargandoComanda(true);
    setTickets([]);
    setMensaje(null);
    try {
      const lista = await listarPedidoPorMesa(mesa.id);
      setTickets(lista.filter((p) => p.anulado === 'N'));
    } catch (e) {
      setMensaje(e instanceof Error ? e.message : 'No se pudo abrir la comanda');
    } finally {
      setCargandoComanda(false);
    }
  }, []);

  const activos = useMemo(() => (mesas ?? []).filter((m) => m.estadoOperativo !== 'LIBRE'), [mesas]);
  const porCobrar = useMemo(() => (mesas ?? []).filter((m) => m.estadoOperativo === 'POR COBRAR'), [mesas]);
  const cantidadListos = useMemo(
    () => (entregas ?? []).reduce((total, pedido) => total + (pedido.detalles?.length ?? 0), 0),
    [entregas],
  );
  const visibles = useMemo(() => {
    const q = buscar.trim().toUpperCase();
    if (!q) return mesas ?? [];
    return (mesas ?? []).filter((m) => `${m.numero} ${m.ambiente}`.toUpperCase().includes(q));
  }, [mesas, buscar]);

  return (
    <div className="y-shell" style={{ padding: '24px 16px 140px', maxWidth: 1240, margin: '0 auto' }}>
      <PageHeader
        title="Atención del salón"
        sub="Prioriza los platos listos y mantén a la vista el estado de cada mesa."
        right={(
          <div style={{ display: 'grid', gap: 10, justifyItems: 'end' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'end' }}>
              <span className="ys-status" style={{ color: '#22c55e', background: '#22c55e22' }}>
                <i /> {(mesas?.length ?? 0) - activos.length} libres
              </span>
              <span className="ys-status" style={{ color: '#ef4444', background: '#ef444422' }}>
                <i /> {activos.length - porCobrar.length} ocupadas
              </span>
              <span className="ys-status" style={{ color: '#17a2b8', background: '#17a2b822' }}>
                <i /> {porCobrar.length} por cobrar
              </span>
            </div>
            <button
              className="btn btn-gold"
              onClick={() => {
                setEntregasAbiertas(true);
                void cargarEntregas();
              }}
            >
              Platos listos · {cantidadListos}
            </button>
          </div>
        )}
      />
      <section className="y-flow-hero y-cliente-flow-hero" style={{ marginBottom: 16 }}>
        <div className="y-flow-hero__content">
          <span className="y-flow-hero__eyebrow">Bandeja de atención</span>
          <h2 className="y-flow-hero__title">Primero lo que ya salió de cocina.</h2>
          <p className="y-flow-hero__description">
            Revisa los platos listos para entregar y abre una mesa para continuar la atención.
            Los pedidos QR/web se consultan aquí, pero los gestiona el cliente.
          </p>
        </div>
      </section>
      <div className="y-search" style={{ marginBottom: 14 }}>
        <Ico n="search" size={18} />
        <input
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          placeholder="Buscar mesa o ambiente"
        />
      </div>
      {error && <ErrorBox msg={error} retry={cargarMesas} />}
      {mesas === null && !error && <Loading text="Cargando salón..." />}
      {mesas?.length === 0 && !error && (
        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
          <Ico n="chair" size={40} />
          <h3 style={{ margin: '8px 0 0' }}>Sin mesas registradas</h3>
          <p style={{ color: 'var(--text-muted)' }}>Cuando existan mesas activas aparecerán aquí.</p>
        </div>
      )}
      {visibles.length > 0 && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
          {visibles.map((m) => (
            <button
              key={m.id}
              className="ys-mesa card"
              style={{ ['--tone' as string]: tone(m), textAlign: 'left', cursor: 'pointer' }}
              onClick={() => void abrirComanda(m)}
            >
              <div className="n">{m.numero}</div>
              <p style={{ margin: '10px 0 2px', color: tone(m), fontWeight: 700, fontSize: 12 }}>{m.estadoOperativo}</p>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 12 }}>{m.ambiente}</p>
              {m.ocupacion && (
                <p style={{ margin: '10px 0 0', fontSize: 12 }}>
                  {m.ocupacion.pedido}
                </p>
              )}
            </button>
          ))}
        </div>
      )}

      {abierta && (
        <MozoDetalles
          mesa={abierta}
          tickets={tickets}
          cargando={cargandoComanda}
          mensaje={mensaje}
          onClose={() => setAbierta(null)}
          onRefrescar={() => void abrirComanda(abierta)}
          onAgregar={async (pedidoId, productoId, cantidad, nota) => {
            const nuevo = await agregarLinea(pedidoId, productoId, cantidad, nota);
            setTickets((prev) => prev.map((p) => (p.id === nuevo.id ? nuevo : p)));
            setMensaje(null);
          }}
          onAbrirComanda={async (comensales) => {
            const nuevo = await abrirPedidoMesa(abierta.id, comensales);
            setTickets((prev) => [...prev, nuevo]);
            await abrirComanda(abierta);
          }}
          onPedirCuenta={async (pedidoId) => {
            await pedirCuenta(pedidoId);
            setMensaje('Mesa marcada como POR COBRAR');
            await cargarMesas();
          }}
          onMensaje={setMensaje}
        />
      )}
      {entregasAbiertas && (
        <EntregasListasModal
          pedidos={entregas}
          error={entregaError}
          onCerrar={() => setEntregasAbiertas(false)}
          onRefrescar={cargarEntregas}
          onConfirmar={async (pedidoId, detalleId) => {
            await confirmarEntregaMozo(pedidoId, detalleId);
            await cargarEntregas();
            await cargarMesas();
            if (abierta) await abrirComanda(abierta);
          }}
        />
      )}
    </div>
  );
}

function MozoDetalles({
  mesa,
  tickets,
  cargando,
  mensaje,
  onClose,
  onRefrescar,
  onAgregar,
  onAbrirComanda,
  onPedirCuenta,
  onMensaje,
}: {
  mesa: Mesa;
  tickets: Ticket[];
  cargando: boolean;
  mensaje: string | null;
  onClose: () => void;
  onRefrescar: () => void;
  onAgregar: (pedidoId: number, productoId: number, cantidad: number, nota: string) => Promise<void>;
  onAbrirComanda: (comensales: number) => Promise<void>;
  onPedirCuenta: (pedidoId: number) => Promise<void>;
  onMensaje: (m: string) => void;
}) {
  const activos = tickets.filter((t) => t.anulado === 'N' && t.facturado === 'N');
  const activo = activos[0];
  const [pickerAbierto, setPickerAbierto] = useState(false);
  const pedidoDigital = activo?.canalOrigen === 'QR' || activo?.canalOrigen === 'WEB';
  const puedeAgregar = Boolean(activo && !pedidoDigital && mesa.estadoOperativo !== 'POR COBRAR');

  useRealtimePedido(activo?.id ?? null, () => void onRefrescar());

  return (
    <div
      className="ys-veil"
      style={{ position: 'fixed', inset: 0, zIndex: 70, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,.35)' }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{ width: 'min(640px, 94vw)', padding: 22, maxHeight: '88vh', overflow: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div className="ys-mesa" style={{ ['--tone' as string]: tone(mesa), padding: 0 }}>
            <div className="n" style={{ width: 44, height: 44, fontSize: 18 }}>{mesa.numero}</div>
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0 }}>Mesa {mesa.numero}</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 12 }}>{mesa.ambiente} · {mesa.capacidad} pax</p>
          </div>
          <button className="btn btn-ghost" onClick={onClose}>Cerrar</button>
        </div>

        {mensaje && (
          <p style={{ marginTop: 12, color: 'var(--gold-light)' }}>{mensaje}</p>
        )}

        {cargando && <Loading text="Cargando comanda..." />}

        {!cargando && activos.length === 0 && mesa.estadoOperativo === 'LIBRE' && (
          <div style={{ marginTop: 16, display: 'grid', gap: 10 }}>
            <button className="btn btn-gold" onClick={() => void onAbrirComanda(mesa.capacidad || 1)}>
              Abrir pedido ({mesa.capacidad} pax)
            </button>
          </div>
        )}

        {!cargando && activo && (
          <>
            <div style={{ marginTop: 14, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <span className="ys-status" style={{ color: '#f6be39', background: '#f6be3922' }}>{activo.numero}</span>
              <span className="ys-status" style={{ color: pedidoDigital ? '#8b5cf6' : '#64748b', background: pedidoDigital ? '#8b5cf622' : '#64748b22' }}>
                <i /> {pedidoDigital ? `Pedido ${activo.canalOrigen}` : 'Atención presencial'}
              </span>
              <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{timeAgo(activo.fecha)}</span>
              <span style={{ marginLeft: 'auto', fontWeight: 700 }}>{fmtPEN(activo.total)}</span>
            </div>
            <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
              {activo.detalles?.map((d) => (
                <div key={d.id} className="y-line" style={{ padding: '8px 0' }}>
                  <div style={{ flex: 1 }}>
                    <b>{d.cantidad}x {d.producto}</b>
                    {d.notaCocina && <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 12 }}>{d.notaCocina}</p>}
                    {d.fechaEntregaMozo && <p style={{ margin: 0, color: '#22c55e', fontSize: 11 }}>Entregado a la mesa</p>}
                  </div>
                  <EstadoBadge estado={d.estadoPreparacion} size="md" />
                </div>
              ))}
            </div>
            {pedidoDigital && (
              <p style={{ margin: '12px 0 0', color: 'var(--text-muted)', fontSize: 12 }}>
                El cliente administra su pedido digital. Desde aquí solo se consulta el avance y se registra la entrega.
              </p>
            )}
            <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {puedeAgregar && (
                <button
                  className="btn btn-gold"
                  onClick={() => setPickerAbierto(true)}
                >
                  Agregar producto
                </button>
              )}
              {!pedidoDigital && mesa.estadoOperativo !== 'POR COBRAR' && (
                <button
                  className="btn btn-ghost"
                  onClick={() => void onPedirCuenta(activo.id).catch((e) => onMensaje(e instanceof Error ? e.message : 'No se pudo pedir cuenta'))}
                >
                  Pedir cuenta · {fmtPEN(activo.total)}
                </button>
              )}
              {mesa.estadoOperativo === 'POR COBRAR' && (
                <span className="ys-status" style={{ color: '#17a2b8', background: '#17a2b822' }}>
                  Cuenta solicitada · cobro en Caja
                </span>
              )}
              <button className="btn btn-ghost" onClick={onRefrescar}>Refrescar</button>
            </div>
          </>
        )}

        {pickerAbierto && activo && (
          <ProductosPicker
            onCerrar={() => setPickerAbierto(false)}
            onAgregar={async (productoId, cantidad, nota) => {
              await onAgregar(activo.id, productoId, cantidad, nota);
            }}
          />
        )}
      </div>
    </div>
  );
}

function ProductosPicker({
  onCerrar,
  onAgregar,
}: {
  onCerrar: () => void;
  onAgregar: (productoId: number, cantidad: number, nota: string) => Promise<void>;
}) {
  const [productos, setProductos] = useState<Producto[] | null>(null);
  const [buscar, setBuscar] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [nota, setNota] = useState('');
  const [seleccion, setSeleccion] = useState<Producto | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listarProductos({ page: 1, limit: 100, nombre: '', categoria: '', estado: 'A', disponible: 'S' })
      .then((r) => setProductos(r.data))
      .catch((e) => setError(e instanceof Error ? e.message : 'No se pudieron cargar los productos'));
  }, []);

  const visibles = useMemo(() => {
    const q = buscar.trim().toUpperCase();
    return (productos ?? []).filter((p) => p.nombre.toUpperCase().includes(q));
  }, [productos, buscar]);

  return (
    <div style={{ marginTop: 16, borderTop: '1px solid var(--line2)', paddingTop: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <h4 style={{ margin: 0, flex: 1 }}>Productos</h4>
        <button className="btn btn-ghost" onClick={onCerrar}>Cerrar</button>
      </div>
      <div className="y-search" style={{ marginBottom: 10 }}>
        <Ico n="search" size={18} />
        <input value={buscar} onChange={(e) => setBuscar(e.target.value)} placeholder="Buscar producto" />
      </div>
      {error && <ErrorBox msg={error} />}
      {!productos && !error && <Loading text="Cargando productos..." />}
      {productos?.length === 0 && <p style={{ color: 'var(--text-muted)' }}>Sin productos activos.</p>}
      {visibles.length > 0 && (
        <div style={{ display: 'grid', gap: 6, maxHeight: 260, overflow: 'auto' }}>
          {visibles.map((p) => (
            <button
              key={p.id}
              className="y-row"
              style={{ cursor: 'pointer' }}
              onClick={() => setSeleccion(p)}
            >
              <span>{p.nombre}</span>
              <span className="r">{fmtPEN(p.precio)}</span>
            </button>
          ))}
        </div>
      )}
      {seleccion && (
        <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
          <p style={{ margin: 0 }}>
            <b>{seleccion.nombre}</b> · {fmtPEN(seleccion.precio)}
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              className="input"
              type="number"
              min={1}
              value={cantidad}
              onChange={(e) => setCantidad(Math.max(1, Number(e.target.value)))}
              style={{ width: 90 }}
            />
            <input
              className="input"
              placeholder="Nota para cocina"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              style={{ flex: 1 }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-gold"
              onClick={() => void onAgregar(seleccion.id, cantidad, nota).then(() => setSeleccion(null))}
            >
              Agregar
            </button>
            <button className="btn btn-ghost" onClick={() => setSeleccion(null)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

function EntregasListasModal({
  pedidos,
  error,
  onCerrar,
  onRefrescar,
  onConfirmar,
}: {
  pedidos: Ticket[] | null;
  error: string | null;
  onCerrar: () => void;
  onRefrescar: () => Promise<void>;
  onConfirmar: (pedidoId: number, detalleId: number) => Promise<void>;
}) {
  const [procesando, setProcesando] = useState<number | null>(null);
  const [errorAccion, setErrorAccion] = useState<string | null>(null);
  const cantidad = (pedidos ?? []).reduce((total, pedido) => total + (pedido.detalles?.length ?? 0), 0);

  return (
    <div
      className="ys-veil"
      style={{ position: 'fixed', inset: 0, zIndex: 80, display: 'grid', placeItems: 'center', padding: 16, background: 'rgba(0,0,0,.58)' }}
      onClick={onCerrar}
    >
      <section
        className="card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mozo-entregas-title"
        style={{ width: 'min(760px, 96vw)', maxHeight: '88vh', overflow: 'auto', padding: 22 }}
        onClick={(event) => event.stopPropagation()}
      >
        <header style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <span className="y-flow-hero__eyebrow">Despacho de cocina</span>
            <h2 id="mozo-entregas-title" style={{ margin: '4px 0', fontSize: 22 }}>Listos para entregar</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 13 }}>
              {cantidad} {cantidad === 1 ? 'plato espera' : 'platos esperan'} en sus mesas.
            </p>
          </div>
          <button className="btn btn-ghost" onClick={() => void onRefrescar()} aria-label="Actualizar platos listos">
            Actualizar
          </button>
          <button className="btn btn-ghost" onClick={onCerrar}>Cerrar</button>
        </header>

        {error && <ErrorBox msg={error} retry={onRefrescar} />}
        {errorAccion && <ErrorBox msg={errorAccion} />}
        {pedidos === null && !error && <Loading text="Buscando platos listos..." />}
        {pedidos?.length === 0 && !error && (
          <div className="card" style={{ textAlign: 'center', padding: 32, background: 'var(--surface-2)' }}>
            <Ico n="ok" size={30} />
            <h3 style={{ margin: '8px 0 4px' }}>Todo entregado</h3>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Cuando cocina despache nuevos platos aparecerán aquí.</p>
          </div>
        )}

        <div style={{ display: 'grid', gap: 12 }}>
          {pedidos?.map((pedido) => (
            <article key={pedido.id} className="card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  <strong>Mesa {pedido.mesaNumero ?? pedido.mesaId ?? '—'}</strong>
                  <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: 12 }}>
                    Comanda {pedido.numero} · {pedido.canalOrigen === 'PRESENCIAL' ? 'Atención presencial' : `Pedido ${pedido.canalOrigen}`}
                  </span>
                </div>
                <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{timeAgo(pedido.fecha)}</span>
              </div>
              <div style={{ display: 'grid', gap: 8 }}>
                {pedido.detalles?.map((detalle) => (
                  <div key={detalle.id} className="y-line" style={{ gap: 12, padding: '10px 0' }}>
                    <div style={{ flex: 1 }}>
                      <strong>{detalle.cantidad} × {detalle.producto}</strong>
                      {detalle.notaCocina && (
                        <p style={{ margin: '3px 0 0', color: 'var(--text-muted)', fontSize: 12 }}>{detalle.notaCocina}</p>
                      )}
                    </div>
                    <button
                      className="btn btn-gold"
                      disabled={procesando === detalle.id}
                      onClick={() => {
                        setProcesando(detalle.id);
                        setErrorAccion(null);
                        void onConfirmar(pedido.id, detalle.id)
                          .catch((e) => setErrorAccion(e instanceof Error ? e.message : 'No se pudo registrar la entrega'))
                          .finally(() => setProcesando(null));
                      }}
                    >
                      {procesando === detalle.id ? 'Registrando…' : 'Confirmar entrega'}
                    </button>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
