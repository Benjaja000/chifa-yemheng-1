import { useState, useEffect } from 'react';
import { api } from '@/shared/services/api-client';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';

interface Producto {
  id_producto: number;
  nombre: string;
  precio: number;
  id_categoria: number;
}

interface Categoria {
  id_categoria: number;
  nombre: string;
}

interface Cliente {
  id_cliente: number;
  nombre: string;
}

interface Distrito {
  id_distrito: number;
  d_distrito: string;
  id_provincia: number;
}

interface Provincia {
  id_provincia: number;
  d_provincia: string;
  id_departamento: number;
}

interface Departamento {
  id_departamento: number;
  d_departamento: string;
}

interface ItemCarrito {
  productoId: number;
  nombre: string;
  precio: number;
  cantidad: number;
  nota?: string;
}

interface CrearDeliveryModalProps {
  abierto: boolean;
  onCerrar: () => void;
  onExito: () => void;
}

export function CrearDeliveryModal({ abierto, onCerrar, onExito }: CrearDeliveryModalProps) {
  if (!abierto) return null;

  // Paso actual: 1=cliente, 2=dirección, 3=productos, 4=confirmar
  const [paso, setPaso] = useState(1);
  const [loading, setLoading] = useState(false);

  // Datos del formulario
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [clienteBuscar, setClienteBuscar] = useState('');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [mostrarClientes, setMostrarClientes] = useState(false);

  const [direccion, setDireccion] = useState('');
  const [referencia, setReferencia] = useState('');
  const [telefono, setTelefono] = useState('');
  const [departamentoId, setDepartamentoId] = useState<number | null>(null);
  const [provinciaId, setProvinciaId] = useState<number | null>(null);
  const [distritoId, setDistritoId] = useState<number | null>(null);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [provincias, setProvincias] = useState<Provincia[]>([]);
  const [distritos, setDistritos] = useState<Distrito[]>([]);
  const [costoEnvio, setCostoEnvio] = useState(0);
  const [costoSugerido, setCostoSugerido] = useState<number | null>(null);
  const [fueraRadio, setFueraRadio] = useState(false);

  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaActiva, setCategoriaActiva] = useState<number | null>(null);
  const [buscarProducto, setBuscarProducto] = useState('');

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = async () => {
    try {
      const [cats, deps] = await Promise.all([
        api.getCategorias(),
        api.getDepartamentos(),
      ]);
      setCategorias(cats);
      setDepartamentos(deps);
      if (cats.length > 0) setCategoriaActiva(cats[0].id_categoria);
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
    }
  };

  useEffect(() => {
    if (departamentoId) {
      api.getProvincias(departamentoId).then(setProvincias);
      setProvinciaId(null);
      setDistritoId(null);
      setDistritos([]);
    } else {
      setProvincias([]);
      setDistritos([]);
    }
  }, [departamentoId]);

  useEffect(() => {
    if (provinciaId) {
      api.getDistritos(provinciaId).then(setDistritos);
      setDistritoId(null);
    } else {
      setDistritos([]);
    }
  }, [provinciaId]);

  useEffect(() => {
    if (categoriaActiva) {
      api.getProductos({ disponible: true }).then(prods => {
        setProductos(prods.filter(p => p.id_categoria === categoriaActiva));
      });
    }
  }, [categoriaActiva]);

  // Cliente
  useEffect(() => {
    if (clienteBuscar.length >= 2) {
      api.request<Cliente[]>(`/clientes?search=${encodeURIComponent(clienteBuscar)}`)
        .then(setClientes)
        .catch(() => setClientes([]));
      setMostrarClientes(true);
    } else {
      setMostrarClientes(false);
    }
  }, [clienteBuscar]);

  // Sugerir costo
  const handleSugerirCosto = async () => {
    if (!distritoId) return;
    try {
      const res = await api.sugerirCosto(0, 0, distritoId); // sin GPS por ahora
      setCostoSugerido(res.costoSugerido);
      setFueraRadio(res.fueraRadio);
      setCostoEnvio(res.costoSugerido);
    } catch (error) {
      console.error('Error sugiriendo costo:', error);
    }
  };

  // Carrito
  const agregarItem = (producto: Producto) => {
    setItems(prev => {
      const existing = prev.find(i => i.productoId === producto.id_producto);
      if (existing) {
        return prev.map(i =>
          i.productoId === producto.id_producto
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        );
      }
      return [...prev, { productoId: producto.id_producto, nombre: producto.nombre, precio: producto.precio, cantidad: 1 }];
    });
  };

  const subtotal = items.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
  const total = subtotal + costoEnvio;

  const handleSubmit = async () => {
    if (!clienteId) { alert('Seleccione un cliente'); return; }
    if (!direccion.trim()) { alert('Dirección obligatoria'); return; }
    if (!distritoId) { alert('Distrito obligatorio'); return; }
    if (!telefono.trim()) { alert('Teléfono obligatorio'); return; }
    if (items.length === 0) { alert('Agregue al menos un producto'); return; }

    setLoading(true);
    try {
      await api.request('/delivery', {
        method: 'POST',
        body: JSON.stringify({
          pedidoId: 0, // Se crea desde staff, el backend debe crear PEDIDO + PEDIDO_DELIVERY
          clienteId,
          items: items.map(i => ({
            productoId: i.productoId,
            cantidad: i.cantidad,
            nota: i.nota,
          })),
          direccion,
          distritoId,
          referencia,
          telefono,
          costoEnvio,
        }),
      });
      alert('Delivery creado exitosamente');
      onExito();
      onCerrar();
    } catch (error: any) {
      alert(error.message || 'Error creando delivery');
    } finally {
      setLoading(false);
    }
  };

  const renderPaso = () => {
    switch (paso) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">1. Seleccionar Cliente</h3>
            <div className="relative">
              <input
                type="text"
                value={clienteBuscar}
                onChange={e => setClienteBuscar(e.target.value)}
                placeholder="Buscar cliente por nombre, teléfono o documento..."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              {mostrarClientes && clientes.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {clientes.map(c => (
                    <button
                      key={c.id_cliente}
                      onClick={() => { setClienteId(c.id_cliente); setClienteBuscar(c.nombre); setMostrarClientes(false); }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-100 border-b last:border-0"
                    >
                      {c.nombre}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {clienteId && (
              <div className="p-3 bg-green-50 rounded-lg text-green-800">
                Cliente: <strong>{clienteBuscar}</strong>
              </div>
            )}
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">2. Dirección de Entrega</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Dirección *</label>
                <input
                  type="text"
                  value={direccion}
                  onChange={e => setDireccion(e.target.value)}
                  placeholder="Av. Los Incas 123, Urb. El Bosque"
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Referencia</label>
                <input
                  type="text"
                  value={referencia}
                  onChange={e => setReferencia(e.target.value)}
                  placeholder="Frente al parque, casa azul, 2do piso"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Teléfono *</label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={e => setTelefono(e.target.value)}
                  placeholder="987654321"
                  maxLength={9}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Departamento *</label>
                <select
                  value={departamentoId || ''}
                  onChange={e => setDepartamentoId(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Seleccionar</option>
                  {departamentos.map(d => <option key={d.id_departamento} value={d.id_departamento}>{d.d_departamento}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Provincia *</label>
                <select
                  value={provinciaId || ''}
                  onChange={e => setProvinciaId(e.target.value ? Number(e.target.value) : null)}
                  disabled={!departamentoId}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Seleccionar</option>
                  {provincias.map(p => <option key={p.id_provincia} value={p.id_provincia}>{p.d_provincia}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Distrito *</label>
                <select
                  value={distritoId || ''}
                  onChange={e => setDistritoId(e.target.value ? Number(e.target.value) : null)}
                  disabled={!provinciaId}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">Seleccionar</option>
                  {distritos.map(d => <option key={d.id_distrito} value={d.id_distrito}>{d.d_distrito}</option>)}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Costo Envío *</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={costoEnvio}
                    onChange={e => setCostoEnvio(Number(e.target.value) || 0)}
                    min="0"
                    step="0.1"
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                  <span className="flex items-center text-gray-500">S/</span>
                </div>
              </div>
              <Button variant="outline" onClick={handleSugerirCosto} disabled={!distritoId}>
                Sugerir por distrito
              </Button>
            </div>
            {costoSugerido !== null && (
              <div className={`p-3 rounded-lg ${fueraRadio ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
                <span className="font-medium">Costo sugerido: </span>
                <Badge variant={fueraRadio ? 'warning' : 'success'}>S/ {costoSugerido.toFixed(2)}</Badge>
                {fueraRadio && <span className="ml-2 text-sm text-yellow-700">(Fuera de radio)</span>}
                <Button size="sm" variant="secondary" onClick={() => setCostoEnvio(costoSugerido!)} className="ml-2">
                  Usar
                </Button>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">3. Productos</h3>
            <div className="flex gap-2 mb-2">
              <select
                value={categoriaActiva || ''}
                onChange={e => setCategoriaActiva(e.target.value ? Number(e.target.value) : null)}
                className="px-3 py-2 border rounded-lg w-48"
              >
                {categorias.map(c => <option key={c.id_categoria} value={c.id_categoria}>{c.nombre}</option>)}
              </select>
              <input
                type="text"
                value={buscarProducto}
                onChange={e => setBuscarProducto(e.target.value)}
                placeholder="Buscar producto..."
                className="flex-1 px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
              {productos
                .filter(p => p.nombre.toLowerCase().includes(buscarProducto.toLowerCase()))
                .map(p => (
                  <div key={p.id_producto} className="bg-white border rounded-lg p-3 hover:shadow-md">
                    <p className="font-medium">{p.nombre}</p>
                    <p className="text-sm text-gray-500">S/ {p.precio.toFixed(2)}</p>
                    <Button className="mt-2 w-full" size="sm" onClick={() => agregarItem(p)}>
                      Agregar
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">4. Confirmar Pedido</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>{item.cantidad}x {item.nombre}</span>
                  <Badge variant="default">S/ {(item.precio * item.cantidad).toFixed(2)}</Badge>
                </div>
              ))}
              <div className="border-t pt-2 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>S/ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Envío</span>
                  <span>S/ {costoEnvio.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium text-lg border-t pt-2">
                  <span>Total</span>
                  <span>S/ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
              <strong>Nota:</strong> Este pedido se crea para entrega (delivery). El pago se cobrará contra entrega (efectivo) o digital según acuerde con el cliente.
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-bold">Nuevo Delivery Telefónico</h2>
          <Button variant="ghost" onClick={onCerrar} disabled={loading}>
            ✕
          </Button>
        </div>

        {/* Stepper */}
        <div className="px-4 py-3 bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            {['Cliente', 'Dirección', 'Productos', 'Confirmar'].map((label, i) => (
              <div key={i} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i + 1 < paso ? 'bg-green-500 text-white' :
                  i + 1 === paso ? 'bg-blue-500 text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {i + 1 < paso ? '✓' : i + 1}
                </div>
                <span className={`ml-1 text-xs ${i + 1 <= paso ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
                {i < 3 && <div className={`w-16 h-0.5 mx-1 ${i + 1 < paso ? 'bg-green-500' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {renderPaso()}
        </div>

        <div className="p-4 border-t flex justify-between">
          <Button variant="secondary" onClick={() => setPaso(p => Math.max(1, p - 1))} disabled={paso === 1 || loading}>
            Anterior
          </Button>
          <div className="flex gap-2">
            {paso < 4 ? (
              <Button onClick={() => setPaso(p => Math.min(4, p + 1))} disabled={loading}>
                Siguiente
              </Button>
            ) : (
              <Button onClick={handleSubmit} loading={loading} size="lg">
                {loading ? 'Creando...' : 'Crear Delivery'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}