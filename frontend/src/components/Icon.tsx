import type { ReactNode } from 'react';
import { TriangleAlert, Ban, ShieldCheck, Tag, Users, XCircle, CheckCircle2, Plus, Minus, Pencil, ChefHat, Armchair, Soup, TrendingUp, Trophy, CreditCard, CalendarDays, User, Wallet, Store, Receipt, BarChart3, Hourglass, Flame, StickyNote, Timer, PartyPopper, ConciergeBell, Bell, Bike, Hand, Star, Smartphone, UtensilsCrossed, Sparkles, Search, QrCode, Lock, ChevronRight } from 'lucide-react';

const MAP = {
  alert: TriangleAlert, ban: Ban, shield: ShieldCheck, tag: Tag, users: Users, err: XCircle, ok: CheckCircle2, plus: Plus, minus: Minus, edit: Pencil, chef: ChefHat,
  chair: Armchair, noodles: Soup, trend: TrendingUp, trophy: Trophy, card: CreditCard, calendar: CalendarDays, user: User, money: Wallet, store: Store,
  receipt: Receipt, chart: BarChart3, hourglass: Hourglass, flame: Flame, note: StickyNote, timer: Timer, party: PartyPopper, waiter: ConciergeBell,
  bell: Bell, bike: Bike, hand: Hand, star: Star, phone: Smartphone, chop: UtensilsCrossed, spark: Sparkles, search: Search, qrcode: QrCode, lock: Lock, chevronRight: ChevronRight,
} as const;
export type IcoName = keyof typeof MAP;
const COLOR: Partial<Record<IcoName, string>> = { ok: '#15803d', err: '#ba1a1a', alert: '#ffc641' };

/** Icono SVG en línea (reemplaza a cualquier emoji). */
export function Ico({ n, size = 16 }: { n: IcoName; size?: number }) {
  const I = MAP[n];
  return <I size={size} aria-hidden style={{ display: 'inline-block', verticalAlign: '-0.15em', marginRight: 6, flex: 'none', color: COLOR[n] }} />;
}

const RX = new RegExp(`:(${Object.keys(MAP).join('|')}):`, 'g');
/** Convierte tokens :nombre: dentro de un texto en iconos SVG. */
export function Txt({ children }: { children?: ReactNode }) {
  if (typeof children !== 'string') return <>{children}</>;
  const parts = children.split(RX);
  return <>{parts.map((p, i) => (i % 2 ? <Ico key={i} n={p as IcoName} /> : p))}</>;
}