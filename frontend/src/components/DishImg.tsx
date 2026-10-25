import { useState, type CSSProperties } from 'react';
import { UtensilsCrossed } from 'lucide-react';

export default function DishImg({ src, alt, style }: { src?: string | null; alt: string; style?: CSSProperties }) {
  const [bad, setBad] = useState(false);
  if (!src || bad) return <div className="y-ph" style={style} role="img" aria-label={alt}><UtensilsCrossed size={22} /></div>;
  return <img src={src} alt={alt} loading="lazy" style={style} onError={() => setBad(true)} />;
}