import { supabase } from '../config/supabase.js';

interface PushPayload {
  title: string;
  body: string;
  data: Record<string, any>;
}

async function getActiveTokens(empleadoId: number): Promise<string[]> {
  const { data, error } = await supabase
    .from('dispositivo_token')
    .select('token')
    .eq('id_empleado', empleadoId)
    .eq('activo', true);

  if (error) throw new Error(`TOKEN_GET_FAIL: ${error.message}`);
  return (data ?? []).map((t: any) => t.token);
}

async function deactivateToken(token: string): Promise<void> {
  await supabase.from('dispositivo_token').update({ activo: false }).eq('token', token);
}

async function getFirebaseApp() {
  try {
    const admin = await import('firebase-admin');
    if (!admin.apps.length) {
      const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
        : undefined;
      admin.initializeApp({
        credential: serviceAccount ? admin.credential.cert(serviceAccount) : admin.credential.applicationDefault(),
      });
    }
    return admin;
  } catch {
    return null;
  }
}

async function sendFCM(tokens: string[], payload: PushPayload): Promise<void> {
  const admin = await getFirebaseApp();
  if (!admin) {
    console.warn('[Push] firebase-admin no disponible, saltando envío');
    return;
  }

  const messaging = admin.messaging();
  const chunks = tokens.reduce((acc: string[][], token, i) => {
    const chunkIndex = Math.floor(i / 500);
    if (!acc[chunkIndex]) acc[chunkIndex] = [];
    acc[chunkIndex].push(token);
    return acc;
  }, []);

  for (const chunk of chunks) {
    try {
      await messaging.sendEachForMulticast({
        tokens: chunk,
        notification: { title: payload.title, body: payload.body },
        data: Object.fromEntries(Object.entries(payload.data).map(([k, v]) => [k, String(v)])),
        android: { priority: 'high' },
        apns: { payload: { aps: { contentAvailable: true } } },
      });
    } catch (e: any) {
      if (e.code === 'messaging/registration-token-not-registered' || e.message?.includes('UNREGISTERED')) {
        for (const token of chunk) await deactivateToken(token);
      }
      console.error('[Push] FCM error:', e.message);
    }
  }
}

async function sendWithRetry(empleadoId: number, payload: PushPayload, retries = 2): Promise<void> {
  const tokens = await getActiveTokens(empleadoId);
  if (!tokens.length) {
    console.log(`[Push] No tokens activos para empleado ${empleadoId}`);
    return;
  }

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      await sendFCM(tokens, payload);
      console.log(`[Push] Enviado a empleado ${empleadoId}: ${payload.title}`);
      return;
    } catch (e) {
      if (attempt === retries) {
        console.error(`[Push] Falló tras ${retries + 1} intentos para empleado ${empleadoId}:`, e);
        return;
      }
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
    }
  }
}

export const pushService = {
  async enviarNuevaAsignacion(repartidorId: number, data: { pedidoId: number; deliveryId: number; direccion: string; total: number }): Promise<void> {
    await sendWithRetry(repartidorId, {
      title: 'Nueva entrega asignada',
      body: `Pedido #${data.pedidoId} - ${data.direccion} - S/ ${data.total.toFixed(2)}`,
      data: { type: 'NUEVA_ASIGNACION', pedidoId: data.pedidoId, deliveryId: data.deliveryId, direccion: data.direccion },
    });
  },

  async enviarEnRuta(repartidorId: number, data: { pedidoId: number; deliveryId: number; direccion: string }): Promise<void> {
    await sendWithRetry(repartidorId, {
      title: 'Delivery en ruta',
      body: `Cliente espera #${data.pedidoId} - ${data.direccion}`,
      data: { type: 'EN_RUTA', pedidoId: data.pedidoId, deliveryId: data.deliveryId, direccion: data.direccion },
    });
  },

  async enviarRutaIniciadaStaff(repartidorId: number, data: { pedidoId: number; deliveryId: number }): Promise<void> {
    await sendWithRetry(repartidorId, {
      title: 'Ruta iniciada por supervisor',
      body: `Supervisor despachó #${data.pedidoId} - Inicie ruta en app`,
      data: { type: 'RUTA_INICIADA_STAFF', pedidoId: data.pedidoId, deliveryId: data.deliveryId },
    });
  },

  async enviarDataOnly(repartidorId: number, data: { deliveryId: number; lat: number; lng: number }): Promise<void> {
    const tokens = await getActiveTokens(repartidorId);
    if (!tokens.length) return;

    const admin = await getFirebaseApp();
    if (!admin) return;

    const messaging = admin.messaging();
    try {
      await messaging.sendEachForMulticast({
        tokens,
        data: { type: 'UBICACION_UPDATE', deliveryId: String(data.deliveryId), lat: String(data.lat), lng: String(data.lng) },
        android: { priority: 'high' },
        apns: { payload: { aps: { contentAvailable: true } } },
      });
    } catch (e: any) {
      if (e.code === 'messaging/registration-token-not-registered') {
        for (const token of tokens) await deactivateToken(token);
      }
    }
  },
};