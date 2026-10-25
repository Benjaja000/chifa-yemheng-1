const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api/v1';

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'UNKNOWN_ERROR' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  // Auth
  login(email: string, password: string) {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  // Cliente Delivery
  crearDelivery(data: {
    items: Array<{ productoId: number; cantidad: number; nota?: string; descuento?: number }>;
    direccion: string;
    distritoId: number;
    referencia?: string;
    telefono?: string;
    costoEnvio: number;
    latCliente?: number;
    lngCliente?: number;
    metodoDigital: 'YAPE' | 'PLIN' | 'TARJETA' | 'TRANSFERENCIA';
  }) {
    return this.request<{ idPedidoDelivery: number; situacion: string; costoEnvio: number }>('/cliente/delivery', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  sugerirCosto(lat: number, lng: number, distrito: number) {
    return this.request<{ distanciaKm: number | null; fueraRadio: boolean; costoSugerido: number }>(
      `/cliente/delivery/sugerir-costo?lat=${lat}&lng=${lng}&distrito=${distrito}`
    );
  }

  getDeliveryDetalle(id: number) {
    return this.request<any>(`/cliente/delivery/${id}`);
  }

  getDeliveryUbicacion(id: number) {
    return this.request<any>(`/cliente/delivery/${id}/ubicacion`);
  }

  // Repartidor
  getMisEntregas(params?: { estado?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request<any>(`/repartidor/entregas?${query}`);
  }

  getMiEntrega(id: number) {
    return this.request<any>(`/repartidor/entregas/${id}`);
  }

  iniciarRuta(id: number) {
    return this.request<any>(`/repartidor/entregas/${id}/ruta`, { method: 'PATCH' });
  }

  confirmarEntrega(id: number) {
    return this.request<any>(`/repartidor/entregas/${id}/entregar`, { method: 'PATCH' });
  }

  actualizarUbicacion(id: number, lat: number, lng: number) {
    return this.request<{ ok: boolean }>(`/repartidor/entregas/${id}/ubicacion`, {
      method: 'POST',
      body: JSON.stringify({ lat, lng }),
    });
  }

  getPorRendir() {
    return this.request<any>('/repartidor/por-rendir');
  }

  registrarPushToken(token: string, platform: string) {
    return this.request<{ ok: boolean }>('/repartidor/entregas/token', {
      method: 'POST',
      body: JSON.stringify({ token, platform }),
    });
  }

  // Staff Seguimiento
  listarDelivery(filtros?: { page?: number; limit?: number; estado?: string }) {
    const query = new URLSearchParams({
      page: filtros?.page?.toString() ?? '1',
      limit: filtros?.limit?.toString() ?? '20',
      estado: filtros?.estado ?? '',
    }).toString();
    return this.request<any>(`/delivery?${query}`);
  }

  getSeguimiento(params?: { estado?: string; repartidorId?: number; page?: number; limit?: number }) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request<any>(`/delivery/seguimiento?${query}`);
  }

  getDeliverySeguimiento(id: number) {
    return this.request<any>(`/delivery/seguimiento/${id}`);
  }

  iniciarRutaStaff(id: number) {
    return this.request<any>(`/delivery/seguimiento/${id}/ruta`, { method: 'PATCH' });
  }

  confirmarEntregaStaff(id: number) {
    return this.request<any>(`/delivery/seguimiento/${id}/entregar`, { method: 'PATCH' });
  }

  anularDelivery(id: number, motivo: string) {
    return this.request<any>(`/delivery/seguimiento/${id}/anular`, {
      method: 'PATCH',
      body: JSON.stringify({ motivo }),
    });
  }

  getUbicacionSeguimiento(id: number) {
    return this.request<any>(`/delivery/seguimiento/${id}/ubicacion`);
  }

  // Rendiciones
  getPendientesRendicion(repartidorId: number) {
    return this.request<any>(`/rendiciones/pendientes?repartidorId=${repartidorId}`);
  }

  registrarRendicion(data: { repartidorId: number; pedidoIds: number[]; montoEntregado: number; observaciones?: string }) {
    return this.request<any>('/rendiciones', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  validarRendicion(id: number) {
    return this.request<{ ok: boolean }>(`/rendiciones/${id}/validar`, { method: 'PATCH' });
  }

  observarRendicion(id: number, motivo: string) {
    return this.request<{ ok: boolean }>(`/rendiciones/${id}/observar`, {
      method: 'PATCH',
      body: JSON.stringify({ motivo }),
    });
  }

  getRendicionPdf(id: number) {
    return this.request<any>(`/rendiciones/${id}/pdf`);
  }

  // Maestros
  getProductos(params?: { activo?: boolean; disponible?: boolean }) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request<any[]>(`/productos?${query}`);
  }

  getCategorias() {
    return this.request<any[]>(`/categorias`);
  }

  getDepartamentos() {
    return this.request<any[]>(`/maestros/departamentos`);
  }

  getProvincias(departamento: number) {
    return this.request<any[]>(`/maestros/provincias?departamento=${departamento}`);
  }

  getDistritos(provincia: number) {
    return this.request<any[]>(`/maestros/distritos?provincia=${provincia}`);
  }

  // Delivery Staff
  getDeliveries(params?: { page?: number; limit?: number; estado?: string }) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request<any>(`/delivery?${query}`);
  }

  getDelivery(id: number) {
    return this.request<any>(`/delivery/${id}`);
  }

  asignarRepartidor(deliveryId: number, repartidorId: number) {
    return this.request<any>(`/delivery/${deliveryId}/asignar`, {
      method: 'PATCH',
      body: JSON.stringify({ repartidorId }),
    });
  }
}

export const api = new ApiClient();