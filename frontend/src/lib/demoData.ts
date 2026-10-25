import type { Producto, Categoria } from '../types/db';

const img = (id: string) => `https://images.unsplash.com/${id}?q=80&w=800&auto=format&fit=crop`;

export const DEMO_IMG: Record<string, string> = {
  chaufa: img('photo-1512058564366-18510be2db19'),
  lomo: img('photo-1544025162-d76694265947'),
  tallarin: img('photo-1585032226651-759b368d7246'),
  wantan: img('photo-1496116218417-1a781b1c416c'),
  pollo: img('photo-1598103442097-8b74394b95c6'),
  chijaukay: img('photo-1563245372-f21724e3856d'),
  tipakay: img('photo-1552611052-33e04de081de'),
  aeropuerto: img('photo-1603133872878-684f208fb84b'),
  hero: img('photo-1504674900247-0877df9cc836'),
  hero2: img('photo-1555126634-323283e090fa'),
  salon: img('photo-1517248135467-4c7edcad34c4'),
  causa: img('photo-1546069901-ba9599a7e63c'),
  inca: img('photo-1541544741938-0af808871cc0'),
};

export const DEMO_CATEGORIAS: Categoria[] = [
  { id_categoriaproducto: 1, n_categoriaproducto: 'CHAUFAS' },
  { id_categoriaproducto: 2, n_categoriaproducto: 'TALLARINES' },
  { id_categoriaproducto: 3, n_categoriaproducto: 'POLLOS Y CARNES' },
  { id_categoriaproducto: 4, n_categoriaproducto: 'PIQUEOS' },
  { id_categoriaproducto: 5, n_categoriaproducto: 'BEBIDAS' },
];

export const DEMO_PRODUCTOS: Producto[] = [
  { id_producto: 101, id_categoriaproducto: 1, n_producto: 'Arroz Chaufa de Pollo', detalle: 'Wok al fuego alto, huevo, cebollita china y sillao.', precio: 28, disponible: 'S', categoria: 'CHAUFAS', imagen: DEMO_IMG.chaufa },
  { id_producto: 102, id_categoriaproducto: 1, n_producto: 'Chaufa Especial Yemheng', detalle: 'Pollo, chancho asado, langostino y huevo.', precio: 36, disponible: 'S', categoria: 'CHAUFAS', imagen: DEMO_IMG.aeropuerto },
  { id_producto: 103, id_categoriaproducto: 2, n_producto: 'Tallarín Saltado de Pollo', detalle: 'Fideos salteados al wok con verduras crocantes.', precio: 30, disponible: 'S', categoria: 'TALLARINES', imagen: DEMO_IMG.tallarin },
  { id_producto: 104, id_categoriaproducto: 3, n_producto: 'Pollo Chijaukay', detalle: 'Crujiente con salsa agridulce de la casa.', precio: 34, disponible: 'S', categoria: 'POLLOS Y CARNES', imagen: DEMO_IMG.chijaukay },
  { id_producto: 105, id_categoriaproducto: 3, n_producto: 'Pollo Tipakay', detalle: 'Trozos dorados con salsa de tamarindo.', precio: 34, disponible: 'S', categoria: 'POLLOS Y CARNES', imagen: DEMO_IMG.tipakay },
  { id_producto: 106, id_categoriaproducto: 3, n_producto: 'Lomo Saltado Oriental', detalle: 'Lomo fino, sillao y toque wok chifa.', precio: 38, disponible: 'S', categoria: 'POLLOS Y CARNES', imagen: DEMO_IMG.lomo },
  { id_producto: 107, id_categoriaproducto: 4, n_producto: 'Wantan Frito x8', detalle: 'Relleno de chancho, salsa de tamarindo.', precio: 18, disponible: 'S', categoria: 'PIQUEOS', imagen: DEMO_IMG.wantan },
  { id_producto: 108, id_categoriaproducto: 4, n_producto: 'Causa Limeña Nikkei', detalle: 'Papa amarilla, pollo y mayonesa de ají.', precio: 16, disponible: 'S', categoria: 'PIQUEOS', imagen: DEMO_IMG.causa },
  { id_producto: 109, id_categoriaproducto: 3, n_producto: 'Pollo a la Brasa Chifa', detalle: 'Marinado oriental, papas doradas.', precio: 32, disponible: 'S', categoria: 'POLLOS Y CARNES', imagen: DEMO_IMG.pollo },
  { id_producto: 110, id_categoriaproducto: 5, n_producto: 'Inca Kola 1L', detalle: 'Bien helada para compartir.', precio: 12, disponible: 'S', categoria: 'BEBIDAS', imagen: DEMO_IMG.inca },
];