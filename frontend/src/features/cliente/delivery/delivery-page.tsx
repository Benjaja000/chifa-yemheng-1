import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { DEMO_IMG } from '../../../lib/demoData';
import { useClienteAuth } from '../auth/cliente-auth-context';
import { DeliveryWizard } from './components/DeliveryWizard';
import { DeliveryTracking } from './components/DeliveryTracking';

export function ClienteDeliveryPage() {
  const { cliente } = useClienteAuth();
  const [deliveryId, setDeliveryId] = useState<number | null>(null);

  // Guest view: presentación informativa (sin datos de negocio hardcodeados).
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

          <div className="p-8 max-w-2xl mx-auto pt-20">
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Entrega en tu puerta</h3>
            <p style={{ margin: '4px 0 0', fontSize: 13, opacity: 0.85 }}>Pide desde la app y sigue tu pedido en vivo.</p>

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
                <h4 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700 }}>Beneficios</h4>
                <div style={{ display: 'grid', gap: 6, fontSize: 13, color: 'var(--muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Check size={14} style={{ color: 'var(--gold2)' }} /> Pedidos sin llamar por teléfono</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Check size={14} style={{ color: 'var(--gold2)' }} /> Seguimiento en tiempo real</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Check size={14} style={{ color: 'var(--gold2)' }} /> Pago digital (Yape/Plin) o efectivo</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Check size={14} style={{ color: 'var(--gold2)' }} /> Acumula puntos con tu cuenta</div>
                </div>
              </div>
            </div>

            <Link className="y-btn red" to="/cliente/login" style={{ marginTop: 12, display: 'inline-flex' }}>Iniciar sesión para hacer un pedido</Link>
          </div>

          <div className="y-scroll" />
        </section>
      </div>
    );
  }

  // Logged-in: seguimiento si ya hay un delivery creado, si no el wizard (único flujo).
  if (deliveryId !== null) {
    return <DeliveryTracking deliveryId={deliveryId} />;
  }

  return (
    <div className="y-shell y-responsive-page">
      <div className="y-head">
        <Link to="/cliente/inicio" className="y-icon-btn" aria-label="Volver"><ArrowLeft size={18} /></Link>
        <h2 className="font-d" style={{ margin: 0, fontSize: 22 }}>Delivery a domicilio</h2>
      </div>

      <section style={{ padding: 16 }}>
        <DeliveryWizard onCreated={(idPedidoDelivery) => setDeliveryId(idPedidoDelivery)} />
      </section>
    </div>
  );
}
