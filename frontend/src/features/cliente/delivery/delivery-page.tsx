import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Bike, Check, PackageCheck } from 'lucide-react';
import { useCart } from '../../../contexts/CartContext';
import { Ico } from '../../../components/Icon';
import { fmtPEN, errText } from '../../../lib/format';
import DishImg from '../../../components/DishImg';
import { DEMO_IMG } from '../../../lib/demoData';
import { useClienteAuth } from '../auth/cliente-auth-context';
import { useDeliveryPolling } from '@/shared/hooks/useDeliveryPolling';
import { DeliveryWizard } from './components/DeliveryWizard';

const DISTRITOS = [
  { id: 1, nombre: 'Miraflores', costo: 8 },
  { id: 2, nombre: 'San Isidro', costo: 9 },
  { id: 3, nombre: 'Surco', costo: 10 },
  { id: 4, nombre: 'La Molina', costo: 12 },
];

export function ClienteDeliveryPage() {
  const { items, total, clear } = useCart();
  const { cliente } = useClienteAuth();
  const [direccion, setDireccion] = useState('');
  const [distrito, setDistrito] = useState(1);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [step, setStep] = useState<'form' | 'tracking'>('form');
  const [situacion] = useState<'P' | 'R' | 'E'>('P');

  // Sin un id de delivery activo todavía no hay nada que consultar
  const { delivery } = useDeliveryPolling(null);
  const costoEnvio = DISTRITOS.find((d) => d.id === distrito)?.costo ?? 0;
  const totalFinal = total + costoEnvio;

  useEffect(() => {
    if (step !== 'tracking') return;
    // Polling automático ya está en useDeliveryPolling
  }, [step]);

  async function enviar() {
    if (!direccion.trim()) { setMsg('Ingresa la dirección de entrega.'); return; }
    if (items.length === 0) { setMsg('Tu carrito está vacío.'); return; }
    setBusy(true); setMsg('');
    try {
      await new Promise((r) => setTimeout(r, 800));
      setStep('tracking');
      clear();
    } catch (e) {
      setMsg(errText(e, 'No se pudo registrar el delivery.'));
    } finally {
      setBusy(false);
    }
  }

  // Guest view: informational presentation with hero style
  if (!cliente) {
    return (
      <div className="y-shell y-responsive-page">
        <div className="y-head">
          <Link to="/cliente/inicio" className="y-icon-btn" aria-label="Volver"><ArrowLeft size={18} /></Link>
          <h2 className="font-d" style={{ margin: 0, fontSize: 22 }}>Delivery a domicilio</h2>
        </div>

        <section className="y-hero">
          <motion.div className="bg" style={{ backgroundImage: `url(${DEMO_IMG.hero})`, y: 0 }} initial={{ scale: 1.18 }} animate={{ scale: 1.05 }} transition={{ duration: 2.4, ease: 'easeOut' }} />
          <div className="fade" />
          <div className="y-embers">
            {Array.from({ length: 22 }, (_, i) => (
              <span key={i} className="y-ember" style={{ left: `${(i * 37 + 11) % 100}%`, width: 2 + (i % 3) * 2, height: 2 + (i % 3) * 2, animationDuration: `${6 + (i % 5) * 1.7}s`, animationDelay: `${(i * 0.7) % 8}s` }} />
            ))}
          </div>

          <div className="p-8 max-w-2xl mx-auto pt-20">
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Entrega en tu puerta</h3>
            <p style={{ margin: '4px 0 0', fontSize: 13, opacity: 0.85 }}>Cobertura en distritos seleccionados.</p>

            <div className="grid grid-cols-1 gap-4 mt-8">
              <div className="y-panel" style={{ padding: 16 }}>
                <h4 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700 }}>¿Cómo funciona?</h4>
                <div style={{ display: 'grid', gap: 8, fontSize: 13, color: 'var(--muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--red)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>1</span>
                    <span>Elige tus platos de la carta y agrégalos al carrito.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--red)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>2</span>
                    <span>Ingresa tu dirección y distrito de entrega.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--red)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>3</span>
                    <span>Sigue tu pedido en vivo hasta que llegue a tu puerta.</span>
                  </div>
                </div>
              </div>

              <div className="y-panel" style={{ padding: 16 }}>
                <h4 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700 }}>Cobertura</h4>
                <div style={{ display: 'grid', gap: 6, fontSize: 13, color: 'var(--muted)' }}>
                  {DISTRITOS.map((d) => (
                    <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><MapPin size={12} style={{ color: 'var(--gold2)' }} /> {d.nombre}</span>
                      <span style={{ fontSize: 12 }}>Envío S/ {d.costo.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="y-panel" style={{ padding: 16 }}>
                <h4 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700 }}>Beneficios</h4>
                <div style={{ display: 'grid', gap: 6, fontSize: 13, color: 'var(--muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Check size={14} style={{ color: 'var(--gold2)' }} /> Pedidos sin llamar por teléfono</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Check size={14} style={{ color: 'var(--gold2)' }} /> Seguimiento en tiempo real</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Check size={14} style={{ color: 'var(--gold2)' }} /> Pago digital (Yape/Plin) o efectivo</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Check size={14} style={{ color: 'var(--gold2)' }} /> Acumula puntos con tu cuenta</div>
                </div>
              </div>

              <div className="y-panel" style={{ padding: 16 }}>
                <h4 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700 }}>Horarios de delivery</h4>
                <div style={{ display: 'grid', gap: 4, fontSize: 13, color: 'var(--muted)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Lunes a Jueves</span><b style={{ color: 'var(--cream)' }}>11:00 – 22:00</b></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Viernes y Sábado</span><b style={{ color: 'var(--cream)' }}>11:00 – 23:00</b></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Domingo</span><b style={{ color: 'var(--cream)' }}>11:00 – 21:00</b></div>
                </div>
              </div>
            </div>

            {cliente ? (
              <Link className="y-btn red" to="/cliente/login" style={{ marginTop: 12, display: 'inline-flex' }}>Iniciar sesión para hacer un pedido</Link>
            ) : (
              <Link className="y-btn red" to="/cliente/login" style={{ marginTop: 12, display: 'inline-flex' }}>Iniciar sesión para hacer un pedido</Link>
            )}
          </div>

          <div className="y-scroll" />
        </section>

        <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
          <div className="y-panel" style={{ padding: 16 }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700 }}>Preguntas Frecuentes</h3>
            <div style={{ fontSize: 13, color: 'var(--muted)', display: 'grid', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Check size={14} style={{ color: 'var(--gold2)' }} /> ¿Cómo rastreo mi pedido?</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Check size={14} style={{ color: 'var(--gold2)' }} /> ¿Pago contra entrega?</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Check size={14} style={{ color: 'var(--gold2)' }} /> ¿Qué pasa si no hay GPS?</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logged-in view: tracking with real polling
  if (step === 'tracking') {
    const pasos: { id: 'P' | 'R' | 'E'; label: string; icon: typeof Bike }[] = [
      { id: 'P', label: 'Pendiente', icon: PackageCheck },
      { id: 'R', label: 'En ruta', icon: Bike },
      { id: 'E', label: 'Entregado', icon: Check },
    ];
    const idx = pasos.findIndex((p) => p.id === situacion);

    // Mostrar datos reales del delivery si están disponibles
    const deliveryData = delivery ?? null;

    return (
      <div className="y-shell y-responsive-page">
        <div className="y-head">
          <h2 className="font-d" style={{ margin: 0, fontSize: 22 }}>Seguimiento delivery</h2>
        </div>

        <div className="y-panel" style={{ padding: 22 }}>
          {/* KPIs superiores */}
          {deliveryData && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="y-kpi">
                <div className="ic" style={{ background: 'var(--primary)', color: '#fff' }}>
                  <span>{pasos.filter(p => p.id === 'P').length}</span>
                </div>
                <span>Pendientes</span>
              </div>
              <div className="y-kpi">
                <div className="ic" style={{ background: 'var(--gold2)', color: '#1b1c1c' }}>
                  <span>{pasos.filter(p => p.id === 'R').length}</span>
                </div>
                <span>En ruta</span>
              </div>
              <div className="y-kpi">
                <div className="ic" style={{ background: 'var(--success)', color: '#fff' }}>
                  <span>{pasos.filter(p => p.id === 'E').length}</span>
                </div>
                <span>Entregados</span>
              </div>
            </div>
          )}

          <div className="y-track">
            {pasos.map((p, i) => {
              const done = i < idx;
              const now = i === idx;
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

          {/* Card delivery actual con datos reales */}
          {deliveryData && (
            <div className="mt-6 p-4 rounded-lg border" style={{ borderColor: 'var(--outline-variant)' }}>
              <h3 className="font-medium text-gray-900 mb-2">Pedido #{deliveryData.pedidoId}</h3>
              <p className="text-gray-500 mb-2">Dirección: {deliveryData.direccion || '—'}</p>
              <p className="text-gray-500 mb-2">Distrito: {deliveryData.distrito || '—'}</p>
              <p className="text-gray-500 mb-2">Método: {'Efectivo'}</p>
              <p className="text-gray-500 mb-2">Total: S/ {Number(deliveryData.costo ?? totalFinal).toFixed(2)}</p>
              {deliveryData.estado === 'R' && (
                <p className="text-green-600 text-sm">
                  <b>Repartidor:</b> {deliveryData.repartidor || '—'} — <b>En ruta desde:</b> {new Date().toLocaleTimeString()}
                </p>
              )}
            </div>
          )}

          {situacion === 'E' && (
            <div className="y-banner" style={{ marginTop: 14, borderTop: '1px solid var(--line2)', paddingTop: 14 }}>
              <Ico n="ok" /> ¡Pedido entregado! Gracias por tu preferencia.
            </div>
          )}
        </div>

        <Link className="y-btn line y-btn-full-mobile" to="/cliente/inicio" style={{ marginTop: 16, display: 'inline-flex' }}>Volver al inicio</Link>
      </div>
    );
  }

  // Logged-in view: form
  return (
    <div className="y-shell y-responsive-page">
      <div className="y-head">
        <Link to="/cliente/inicio" className="y-icon-btn" aria-label="Volver"><ArrowLeft size={18} /></Link>
        <h2 className="font-d" style={{ margin: 0, fontSize: 22 }}>Delivery a domicilio</h2>
      </div>

      <section className="y-hero">
        <motion.div className="bg" style={{ backgroundImage: `url(${DEMO_IMG.hero})`, y: 0 }} initial={{ scale: 1.18 }} animate={{ scale: 1.05 }} transition={{ duration: 2.4, ease: 'easeOut' }} />
        <div className="fade" />
        <div className="y-embers">
          {Array.from({ length: 22 }, (_, i) => (
            <span key={i} className="y-ember" style={{ left: `${(i * 37 + 11) % 100}%`, width: 2 + (i % 3) * 2, height: 2 + (i % 3) * 2, animationDuration: `${6 + (i % 5) * 1.7}s`, animationDelay: `${(i * 0.7) % 8}s` }} />
          ))}
        </div>

        <div className="max-w-2xl mx-auto p-4 pt-20">
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Entrega en tu puerta</h3>
          <p style={{ margin: '4px 0 0', fontSize: 13, opacity: 0.85 }}>Cobertura en distritos seleccionados.</p>

          <DeliveryWizard />
        </div>

        <div className="y-scroll" />
      </section>

      <div className="y-delivery-grid" style={{ marginTop: 16 }}>
        <div className="y-panel" style={{ padding: 18, display: 'grid', gap: 12 }}>
          <div>
            <label className="label">Dirección de entrega *</label>
            <div style={{ position: 'relative' }}>
              <MapPin size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
              <input className="input" style={{ paddingLeft: 36 }} value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Av. Aviación 2890, Dpto 402" />
            </div>
          </div>
          <div>
            <label className="label">Distrito *</label>
            <select className="select" value={distrito} onChange={(e) => setDistrito(Number(e.target.value))}>
              {DISTRITOS.map((d) => (
                <option key={d.id} value={d.id}>{d.nombre} — envío S/ {d.costo.toFixed(2)}</option>
              ))}
            </select>
          </div>

          {items.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <b style={{ fontSize: 13 }}>Tu pedido</b>
              {items.map((it) => (
                <div key={it.producto.id_producto} className="y-line" style={{ padding: '6px 0' }}>
                  <DishImg src={it.producto.imagen} alt={it.producto.n_producto} style={{ width: 40, height: 40, borderRadius: 8 }} />
                  <div style={{ flex: 1 }}>
                    <b style={{ fontSize: 13 }}>{it.producto.n_producto}</b>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>x{it.cantidad}</div>
                  </div>
                  <span className="y-price" style={{ fontSize: 13 }}>{fmtPEN(it.cantidad * Number(it.producto.precio))}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, paddingTop: 8, borderTop: '1px solid var(--line2)' }}>
                <span>Subtotal</span><b>{fmtPEN(total)}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span>Envío</span><b>{fmtPEN(costoEnvio)}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700 }}>
                <span>Total</span><b style={{ color: 'var(--gold2)' }}>{fmtPEN(totalFinal)}</b>
              </div>
            </div>
          )}

          {items.length === 0 && (
            <div style={{ textAlign: 'center', padding: 16 }}>
              <p style={{ color: 'var(--muted)', fontSize: 13, margin: 0 }}>Tu carrito está vacío.</p>
              <Link className="y-btn red sm" to="/cliente/menu" style={{ marginTop: 8, display: 'inline-flex' }}>Ver carta</Link>
            </div>
          )}

          {msg && <p style={{ margin: 0, fontSize: 13, color: '#fca5a5', textAlign: 'center' }}>{msg}</p>}

          <button className="y-btn red y-btn-full-mobile" style={{ padding: 14 }} disabled={busy || items.length === 0} onClick={() => void enviar()}>
            {busy ? 'Registrando…' : 'Confirmar delivery'}
          </button>
        </div>

        <div className="y-panel" style={{ padding: 18, display: 'grid', gap: 12, alignSelf: 'start' }}>
          <h3 className="font-d" style={{ margin: 0, fontSize: 16 }}>Resumen</h3>
          <div style={{ fontSize: 13, color: 'var(--muted)', display: 'grid', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Productos</span><b style={{ color: 'var(--cream)' }}>{items.length}</b></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal</span><b style={{ color: 'var(--cream)' }}>{fmtPEN(total)}</b></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Envío</span><b style={{ color: 'var(--cream)' }}>{fmtPEN(costoEnvio)}</b></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, paddingTop: 8, borderTop: '1px solid var(--line2)' }}>
              <span>Total</span><b style={{ color: 'var(--gold2)' }}>{fmtPEN(totalFinal)}</b>
            </div>
          </div>
          <Link className="y-btn line sm" to="/cliente/menu" style={{ display: 'inline-flex', justifyContent: 'center' }}>Agregar más platos</Link>
        </div>
      </div>
    </div>
  );
}