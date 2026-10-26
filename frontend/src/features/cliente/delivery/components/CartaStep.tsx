import { useState, useEffect } from 'react';
import { api } from '@/shared/services/api-client';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';

interface Producto {
  id_producto: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  imagen_url: string | null;
  id_categoria: number;
}

interface CartaStepProps {
  items: Array<{ productoId: number; cantidad: number; precioUnit: number; nombre?: string; nota?: string; descuento?: number }>;
  onItemsChange: (items: Array<{ productoId: number; cantidad: number; precioUnit: number; nombre?: string; nota?: string; descuento?: number }>) => void;
  onNext: () => void;
}

export function CartaStep({ items, onItemsChange, onNext }: CartaStepProps) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Array<{ id_categoria: number; nombre: string }>>([]);
  const [categoriaActiva, setCategoriaActiva] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
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
      if (cats.length > 0) setCategoriaActiva(cats[0].id);
    } catch (error) {
      console.error('Error cargando carta:', error);
    } finally {
      setLoading(false);
    }
  };

  const productosFiltrados = categoriaActiva
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
    return <div className="flex items-center justify-center h-64">Cargando carta...</div>;
  }

  return (
    <div className="flex flex-col h-[60vh]">
      {/* Categorías */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {categorias.map(cat => (
          <button
            key={cat.id_categoria}
            onClick={() => setCategoriaActiva(cat.id_categoria)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              categoriaActiva === cat.id_categoria
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {cat.nombre}
          </button>
        ))}
      </div>

      {/* Productos */}
      <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-3">
        {productosFiltrados.map(prod => (
          <div
            key={prod.id_producto}
            className="bg-white border rounded-lg p-3 flex flex-col hover:shadow-md transition-shadow"
          >
            <div className="font-medium text-gray-900">{prod.nombre}</div>
            <div className="text-sm text-gray-500 mb-2">{prod.descripcion || ''}</div>
            <div className="flex items-center justify-between mt-auto">
              <Badge variant="info">S/ {prod.precio.toFixed(2)}</Badge>
              <button
                onClick={() => agregarItem(prod)}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                Agregar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Carrito lateral / footer */}
      {items.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Carrito ({totalItems})</span>
            <Badge variant="info">S/ {subtotal.toFixed(2)}</Badge>
          </div>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {items.map(item => {
              const prod = productos.find(p => p.id_producto === item.productoId);
              return (
                <div key={item.productoId} className="flex items-center justify-between text-sm">
                  <span className="truncate">{prod?.nombre}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => actualizarCantidad(item.productoId, item.cantidad - 1)}
                      className="w-6 h-6 rounded border flex items-center justify-center text-gray-600 hover:bg-gray-100"
                    >-</button>
                    <span className="w-8 text-center">{item.cantidad}</span>
                    <button
                      onClick={() => actualizarCantidad(item.productoId, item.cantidad + 1)}
                      className="w-6 h-6 rounded border flex items-center justify-center text-gray-600 hover:bg-gray-100"
                    >+</button>
                    <Badge variant="default">S/ {(prod?.precio || 0) * item.cantidad}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Botón siguiente */}
      <div className="mt-4">
        <Button
          onClick={onNext}
          disabled={items.length === 0}
          className="w-full"
          size="lg"
        >
          {items.length === 0 ? 'Agrega productos para continuar' : `Continuar a Dirección (${totalItems} items)`}
        </Button>
      </div>
    </div>
  );
}