import { useState, useEffect } from 'react';
import { Check, Minus, Plus, ShoppingBag } from 'lucide-react';
import { api } from '@/shared/services/api-client';
import { Button } from '@/shared/ui/Button';

interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  imagen_url: string | null;
  id_categoria: number;
}

interface CartaStepProps {
  items: Array<{ productoId: number; cantidad: number; precioUnit: number; nombre?: string; nota?: string }>;
  onItemsChange: (items: Array<{ productoId: number; cantidad: number; precioUnit: number; nombre?: string; nota?: string }>) => void;
  onNext: () => void;
}

export function CartaStep({ items, onItemsChange, onNext }: CartaStepProps) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Array<{ id_categoria: number; nombre: string }>>([]);
  const [categoriaActiva, setCategoriaActiva] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    void cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    setError(false);
    try {
      const [prods, cats] = await Promise.all([
        api.getProductos({ estado: true, disponible: true }),
        api.getCategorias(),
      ]);
      setProductos(
        prods.map((p: any) => ({
          id_producto: p.id,
          nombre: p.nombre,
          descripcion: p.detalle ?? null,
          precio: Number(p.precio ?? 0),
          imagen_url: p.imagen ?? null,
          id_categoria: p.categoriaId ?? 0,
        })),
      );
      setCategorias(
        cats.map((c: any) => ({
          id_categoria: c.id,
          nombre: c.nombre,
        })),
      );
    } catch (error) {
      console.error('Error cargando carta:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const productosFiltrados = categoriaActiva !== null
    ? productos.filter(p => p.id_categoria === categoriaActiva)
    : productos;

  const agregarItem = (producto: Producto) => {
    const existente = items.find(i => i.productoId === producto.id_producto);
    if (existente) {
      onItemsChange(items.map(i =>
        i.productoId === producto.id_producto ? { ...i, cantidad: i.cantidad + 1 } : i
      ));
    } else {
      onItemsChange([...items, { productoId: producto.id_producto, cantidad: 1, precioUnit: producto.precio, nombre: producto.nombre }]);
    }
  };

  const actualizarCantidad = (productoId: number, cantidad: number) => {
    if (cantidad <= 0) {
      onItemsChange(items.filter(i => i.productoId !== productoId));
    } else {
      onItemsChange(items.map(i =>
        i.productoId === productoId ? { ...i, cantidad } : i
      ));
    }
  };

  const totalItems = items.reduce((sum, i) => sum + i.cantidad, 0);
  const subtotal = items.reduce((sum, i) => sum + i.precioUnit * i.cantidad, 0);

  if (loading) {
    return (
      <div className="y-delivery-state" role="status" aria-live="polite">
        <span className="y-delivery-state__spinner" aria-hidden="true" />
        <span>Cargando la carta…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="y-delivery-state y-delivery-state--error" role="alert">
        <ShoppingBag size={24} aria-hidden="true" />
        <div>
          <strong>No pudimos cargar la carta</strong>
          <p>Revisa tu conexión e inténtalo nuevamente.</p>
        </div>
        <Button type="button" variant="outline" onClick={() => void cargarDatos()}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="y-delivery-menu">
      <div className="y-delivery-step-heading">
        <div>
          <span className="y-cliente-kicker">Paso 1 de 3</span>
          <h2>¿Qué se te antoja?</h2>
          <p>Elige tus platos; podrás ajustar las cantidades antes de confirmar.</p>
        </div>
        <span className="y-delivery-item-count">
          <ShoppingBag size={16} aria-hidden="true" />
          {totalItems} {totalItems === 1 ? 'plato' : 'platos'}
        </span>
      </div>

      <div className="y-delivery-categories" aria-label="Filtrar por categoría">
        <button
          type="button"
          onClick={() => setCategoriaActiva(null)}
          aria-pressed={categoriaActiva === null}
          className={`y-delivery-category${categoriaActiva === null ? ' is-active' : ''}`}
        >
          Toda la carta
        </button>
        {categorias.map(cat => (
          <button
            type="button"
            key={cat.id_categoria}
            onClick={() => setCategoriaActiva(cat.id_categoria)}
            aria-pressed={categoriaActiva === cat.id_categoria}
            className={`y-delivery-category${categoriaActiva === cat.id_categoria ? ' is-active' : ''}`}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      {productosFiltrados.length === 0 ? (
        <div className="y-delivery-state">
          <ShoppingBag size={24} aria-hidden="true" />
          <strong>No hay platos disponibles en esta categoría.</strong>
          <button type="button" className="y-delivery-text-button" onClick={() => setCategoriaActiva(null)}>
            Ver toda la carta
          </button>
        </div>
      ) : (
        <div className="y-delivery-products">
          {productosFiltrados.map((prod) => {
            const cantidad = items.find((item) => item.productoId === prod.id_producto)?.cantidad ?? 0;
            return (
              <article key={prod.id_producto} className="y-delivery-product">
                <div className="y-delivery-product__image">
                  <span aria-hidden="true">{prod.nombre.charAt(0).toUpperCase()}</span>
                  {prod.imagen_url && (
                    <img
                      src={prod.imagen_url}
                      alt={prod.nombre}
                      loading="lazy"
                      onError={(event) => { event.currentTarget.hidden = true; }}
                    />
                  )}
                  {cantidad > 0 && (
                    <span className="y-delivery-product__selected">
                      <Check size={14} aria-hidden="true" /> En tu pedido
                    </span>
                  )}
                </div>
                <div className="y-delivery-product__body">
                  <div className="y-delivery-product__copy">
                    <h3>{prod.nombre}</h3>
                    <p>{prod.descripcion || 'Preparado al momento en nuestra cocina.'}</p>
                  </div>
                  <div className="y-delivery-product__footer">
                    <strong>S/ {prod.precio.toFixed(2)}</strong>
                    {cantidad > 0 ? (
                      <div className="y-delivery-quantity" role="group" aria-label={`Cantidad de ${prod.nombre}`}>
                        <button
                          type="button"
                          aria-label={`Quitar una unidad de ${prod.nombre}`}
                          onClick={() => actualizarCantidad(prod.id_producto, cantidad - 1)}
                        >
                          <Minus size={15} aria-hidden="true" />
                        </button>
                        <span aria-live="polite">{cantidad}</span>
                        <button
                          type="button"
                          aria-label={`Agregar una unidad de ${prod.nombre}`}
                          onClick={() => agregarItem(prod)}
                        >
                          <Plus size={15} aria-hidden="true" />
                        </button>
                      </div>
                    ) : (
                      <button type="button" className="y-delivery-add" onClick={() => agregarItem(prod)}>
                        <Plus size={16} aria-hidden="true" /> Agregar
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <section className="y-delivery-cart" aria-label="Resumen de tu pedido">
        <div className="y-delivery-cart__heading">
          <div>
            <span className="y-cliente-kicker">Tu pedido</span>
            <h3>{totalItems === 0 ? 'Aún no agregas platos' : `${totalItems} ${totalItems === 1 ? 'plato' : 'platos'} seleccionados`}</h3>
          </div>
          <strong>S/ {subtotal.toFixed(2)}</strong>
        </div>
        {items.length > 0 ? (
          <div className="y-delivery-cart__items">
            {items.map(item => {
              const prod = productos.find(p => p.id_producto === item.productoId);
              return (
                <div key={item.productoId} className="y-delivery-cart__item">
                  <span><b>{item.cantidad}×</b> {prod?.nombre ?? item.nombre}</span>
                  <strong>S/ {(item.precioUnit * item.cantidad).toFixed(2)}</strong>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="y-delivery-cart__empty">Agrega tus favoritos y aquí verás el detalle.</p>
        )}

        <div className="y-delivery-cart__action">
          <p>El envío se calcula en el siguiente paso.</p>
          <Button
            type="button"
            onClick={onNext}
            disabled={items.length === 0}
            className="y-delivery-primary-button"
            size="lg"
          >
            {items.length === 0 ? 'Agrega platos para continuar' : 'Continuar a mi dirección'}
          </Button>
        </div>
      </section>
    </div>
  );
}