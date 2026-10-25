import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Ico } from '../../components/Icon';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ScanLine, ClipboardList, HandPlatter, ChefHat, Smile, ArrowRight, ShieldCheck, Zap, Flame, Clock, MapPin, Phone, Star } from 'lucide-react';
import { DEMO_IMG } from '../../lib/demoData';
import type { Producto } from '../../types/db';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/v1';

const steps = [[ScanLine, 'Escanea'], [ClipboardList, 'Elige'], [HandPlatter, 'Pide'], [ChefHat, 'Cocina'], [Smile, 'Disfruta']] as const;
const lines = [['El', 'sabor', 'del', 'wok'], ['en', 'tu', 'mesa,']];
const how = [
  [ScanLine, 'Escanea', 'El QR de tu mesa te abre la carta al instante.'],
  [ShieldCheck, 'Identifícate', 'Ingresa con Gmail y comparte la comanda con tu mesa.'],
  [Zap, 'Elige y confirma', 'Solo platos disponibles, con stock real.'],
  [Flame, 'Cocina y disfruta', 'Sigue tu pedido en vivo hasta que llegue a tu mesa.'],
] as const;

const testimonios = [
  { nombre: 'María L.', texto: 'El chaufa especial es increíble. Pedir desde el celular sin llamar al mozo cambió todo.', estrellas: 5 },
  { nombre: 'Carlos R.', texto: 'Rápido, sabroso y sin esperas. El tracking del pedido en vivo es genial.', estrellas: 5 },
  { nombre: 'Ana P.', texto: 'Reservé mesa online y al llegar ya estaba lista. Excelente servicio.', estrellas: 4 },
];

const galeria = [DEMO_IMG.chaufa, DEMO_IMG.lomo, DEMO_IMG.tallarin, DEMO_IMG.wantan, DEMO_IMG.pollo, DEMO_IMG.causa];

const word = { hidden: { y: 46, opacity: 0, rotate: 2 }, show: (i: number) => ({ y: 0, opacity: 1, rotate: 0, transition: { delay: 0.25 + i * 0.09, duration: 0.7, ease: [0.2, 0.7, 0.2, 1] as const } }) };
const up = (d = 0) => ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { delay: d, duration: 0.6 } });

export default function Landing() {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 700], [0, 140]);
  const textY = useTransform(scrollY, [0, 500], [0, -40]);
  const [platos, setPlatos] = useState<Producto[]>([]);
  let n = 0;

  useEffect(() => {
    fetch(`${API_URL}/productos?limit=6`)
      .then((r) => (r.ok ? r.json() : []))
      .then((body: { data?: Producto[] } | Producto[]) => {
        const list = Array.isArray(body) ? body : (body.data ?? []);
        setPlatos(list.slice(0, 6));
      })
      .catch(() => setPlatos([]));
  }, []);

  const destacados = platos.length > 0 ? platos : [];

  return (
    <div className="y-shell">
      {/* Hero */}
      <section className="y-hero">
        <motion.div className="bg" style={{ backgroundImage: `url(${DEMO_IMG.hero})`, y: bgY }} initial={{ scale: 1.18 }} animate={{ scale: 1.05 }} transition={{ duration: 2.4, ease: 'easeOut' }} />
        <div className="fade" />
        <div className="y-embers">
          {Array.from({ length: 22 }, (_, i) => (
            <span key={i} className="y-ember" style={{ left: `${(i * 37 + 11) % 100}%`, width: 2 + (i % 3) * 2, height: 2 + (i % 3) * 2, animationDuration: `${6 + (i % 5) * 1.7}s`, animationDelay: `${(i * 0.7) % 8}s` }} />
          ))}
        </div>

        <motion.div style={{ y: textY, position: 'relative', maxWidth: 1280, margin: '0 auto', width: '100%', padding: '56px 28px 84px' }}>
          <div style={{ maxWidth: 580 }}>
            <motion.span {...up(0)} className="y-chip" style={{ background: 'rgba(201,164,92,.12)', color: 'var(--gold2)', border: '1px solid var(--line)', marginBottom: 18 }}><Ico n="chop" /> CHIFA CONTEMPORÁNEO</motion.span>
            <h1>
              {lines.map((l, li) => (
                <span key={li} style={{ display: 'block' }}>
                  {l.map((w) => <motion.span key={w + n} custom={n++} variants={word} initial="hidden" animate="show" style={{ display: 'inline-block', marginRight: '.26em' }}>{w}</motion.span>)}
                </span>
              ))}
              <span style={{ display: 'block' }}>
                {['sin', 'esperar', 'al', 'mozo.'].map((w) => <motion.em key={w} custom={n++} variants={word} initial="hidden" animate="show" style={{ display: 'inline-block', marginRight: '.26em' }}>{w}</motion.em>)}
              </span>
            </h1>
            <motion.p {...up(1)} style={{ color: '#d6d3d1', fontSize: 15, lineHeight: 1.6, margin: '20px 0 0', maxWidth: 420 }}>
              Escanea el QR de tu mesa, elige, pide y disfruta. Así de simple. Así de Yemheng.
            </motion.p>
            <div className="y-steps">
              {steps.map(([Icon, t], i) => (
                <motion.div key={t} {...up(1.15 + i * 0.12)} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                  <div className="y-step" style={{ ['--d' as string]: `${i * 0.5}s` }}><i><Icon size={22} /></i>{t}</div>
                  {i < steps.length - 1 && <ArrowRight size={14} className="y-arrow" />}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
        <div className="y-scroll" />
      </section>

      <div className="y-marquee"><div className="t">{[...['Chaufa Especial', 'Wantán Frito', 'Lomo Saltado', 'Tallarín Saltado', 'Pollo Chijaukay', 'Pollo Tipakay', 'Limonada de Hierbabuena'], ...['Chaufa Especial', 'Wantán Frito', 'Lomo Saltado', 'Tallarín Saltado', 'Pollo Chijaukay', 'Pollo Tipakay', 'Limonada de Hierbabuena']].map((d, i) => <span key={i}>{d} <span style={{ color: 'var(--red2)', marginLeft: 46 }}><Ico n="spark" /></span></span>)}</div></div>

      {/* Platos destacados */}
      {destacados.length > 0 && (
        <section style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 28px 40px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-d" style={{ fontSize: 32, margin: '0 0 6px' }}>Nuestros destacados</h2>
            <p style={{ color: 'var(--muted)', marginTop: 0 }}>Los más pedidos por nuestros comensales.</p>
          </motion.div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginTop: 20 }}>
            {destacados.map((p, i) => (
              <motion.div key={p.id_producto} className="y-dish y-panel" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}>
                {p.imagen ? (
                  <img src={p.imagen} alt={p.n_producto} />
                ) : (
                  <div className="y-ph" />
                )}
                <div className="b">
                  <b style={{ fontSize: 14 }}>{p.n_producto}</b>
                  <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0, lineHeight: 1.4 }}>{p.detalle}</p>
                  <div className="row">
                    <span className="y-price">S/ {Number(p.precio).toFixed(2)}</span>
                    <Link to="/cliente/login" className="y-plus" aria-label="Pedir">+</Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Sobre Yemheng */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 28px' }}>
        <div className="y-feature y-panel">
          <img src={DEMO_IMG.salon} alt="Salón Chifa Yemheng" />
          <div className="tx">
            <span className="y-chip" style={{ background: 'rgba(201,164,92,.12)', color: 'var(--gold2)', border: '1px solid var(--line)', alignSelf: 'flex-start' }}><Ico n="chop" /> NUESTRA HISTORIA</span>
            <h2 className="font-d" style={{ fontSize: 28, margin: '8px 0 4px' }}>Tradición chifa, sabor contemporáneo</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              En Chifa Yemheng fusionamos la tradición cantonesa con el paladar peruano. Cada plato se prepara al wok con ingredientes frescos y el toque único de la casa. Ahora puedes pedir desde tu mesa sin esperar al mozo: escanea, elige y disfruta.
            </p>
            <Link className="y-btn red" to="/cliente/login" style={{ alignSelf: 'flex-start', marginTop: 8 }}>Conocer la carta</Link>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 28px 40px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-d" style={{ fontSize: 32, margin: '0 0 6px' }}>Pide sin esperar</h2>
          <p style={{ color: 'var(--muted)', marginTop: 0 }}>Cuatro pasos entre tú y el wok.</p>
        </motion.div>
        <div className="grid4" style={{ marginTop: 20 }}>
          {how.map(([Icon, t, d], i) => (
            <motion.div key={t} className="y-panel y-how" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: i * 0.12, duration: 0.55 }}>
              <div className="ic"><Icon size={22} /></div><h3 style={{ margin: '0 0 6px', fontSize: 16 }}>{t}</h3><p style={{ color: 'var(--muted)', fontSize: 13, margin: 0, lineHeight: 1.5 }}>{d}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Galería */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 28px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-d" style={{ fontSize: 32, margin: '0 0 6px' }}>Nuestra cocina</h2>
          <p style={{ color: 'var(--muted)', marginTop: 0 }}>Platos que nacen del wok y llegan a tu mesa.</p>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginTop: 20 }}>
          {galeria.map((img, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.4 }} style={{ overflow: 'hidden', borderRadius: 12, aspectRatio: '1', background: 'var(--card)' }}>
              <img src={img} alt={`Plato ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonios */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 28px 40px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-d" style={{ fontSize: 32, margin: '0 0 6px' }}>Lo que dicen nuestros clientes</h2>
          <p style={{ color: 'var(--muted)', marginTop: 0 }}>Experiencias reales en Yemheng.</p>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginTop: 20 }}>
          {testimonios.map((t, i) => (
            <motion.div key={i} className="y-panel" style={{ padding: 22 }} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.5 }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
                {Array.from({ length: t.estrellas }, (_, j) => <Star key={j} size={14} style={{ color: 'var(--gold2)', fill: 'var(--gold2)' }} />)}
              </div>
              <p style={{ color: 'var(--cream)', fontSize: 14, lineHeight: 1.6, margin: '0 0 10px', fontStyle: 'italic' }}>"{t.texto}"</p>
              <b style={{ fontSize: 13, color: 'var(--gold2)' }}>— {t.nombre}</b>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Horarios y ubicación */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          <div className="y-panel" style={{ padding: 22 }}>
            <h3 className="font-d" style={{ margin: '0 0 10px', fontSize: 20 }}>Horarios</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: 'var(--muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Lunes a Jueves</span><b style={{ color: 'var(--cream)' }}>11:00 – 22:00</b></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Viernes y Sábado</span><b style={{ color: 'var(--cream)' }}>11:00 – 23:00</b></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Domingo</span><b style={{ color: 'var(--cream)' }}>11:00 – 21:00</b></div>
            </div>
          </div>
          <div className="y-panel" style={{ padding: 22 }}>
            <h3 className="font-d" style={{ margin: '0 0 10px', fontSize: 20 }}>Ubicación</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><MapPin size={14} style={{ color: 'var(--gold2)' }} /> Av. Principal 123, Lima, Perú</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Phone size={14} style={{ color: 'var(--gold2)' }} /> (01) 441-2090</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Clock size={14} style={{ color: 'var(--gold2)' }} /> Abierto todos los días</div>
            </div>
            <Link className="y-btn red sm" to="/cliente/login" style={{ marginTop: 12, display: 'inline-flex' }}>Reservar mesa</Link>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 28px 80px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-d" style={{ fontSize: 32, margin: '0 0 8px' }}>¿Listo para pedir?</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 20 }}>Escanea el QR de tu mesa o pide delivery desde tu celular.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link className="y-btn red" to="/cliente/login">Ver la carta</Link>
            <Link className="y-btn line" to="/cliente/login">Reservar mesa</Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--line)', padding: '24px 28px', maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, fontSize: 12, color: 'var(--muted)' }}>
        <span>© 2025 Chifa Yemheng. Todos los derechos reservados.</span>
        <div style={{ display: 'flex', gap: 16 }}>
          <a href="#" style={{ color: 'var(--gold2)' }}>Instagram</a>
          <a href="#" style={{ color: 'var(--gold2)' }}>Facebook</a>
          <a href="#" style={{ color: 'var(--gold2)' }}>WhatsApp</a>
        </div>
      </footer>
    </div>
  );
}