import request from 'supertest'
import jwt from 'jsonwebtoken'
import { createApp } from '../../app.js'
import { env } from '../../config/env.js'
import { supabase } from '../../config/supabase.js'

const app = createApp()

/**
 * Firma un JWT válido con los claims que exige authGuard
 * (sub, logeo, tipo, roles[], permisos[]).
 */
function token(permisos: string[], sub = 1, roles: string[] = ['ADMINISTRADOR']): string {
  return jwt.sign({ sub, logeo: 'test', tipo: 'STAFF', roles, permisos }, env.JWT_SECRET, {
    expiresIn: '5m',
  })
}

const T_DELIVERY_VER = token(['DELIVERY_VER'])
const T_SIN_PERMISOS = token([])
const T_REPARTIDOR = token(['DELIVERY_VER', 'DELIVERY_ENTREGAR'], 1, ['REPARTIDOR'])

/** Lee el costo_base real de un distrito para no asertar cifras hardcodeadas. */
async function costoBaseDe(distritoId: number): Promise<number> {
  const { data, error } = await supabase
    .from('distrito')
    .select('costo_base')
    .eq('id_distrito', distritoId)
    .single()
  if (error) throw new Error(`No se pudo leer distrito ${distritoId}: ${error.message}`)
  return Number((data as { costo_base: number | null }).costo_base ?? 0)
}

// ─────────────────────────────────────────────────────────────
// Autenticación y permisos
// ─────────────────────────────────────────────────────────────
describe('Delivery · autenticación y permisos', () => {
  it('GET /delivery sin token → 401', async () => {
    const res = await request(app).get('/api/v1/delivery/')
    expect(res.status).toBe(401)
    expect(res.body).toHaveProperty('error', 'CREDENCIALES_INVALIDAS')
  })

  it('GET /delivery con token sin DELIVERY_VER → 403', async () => {
    const res = await request(app)
      .get('/api/v1/delivery/')
      .set('Authorization', `Bearer ${T_SIN_PERMISOS}`)
    expect(res.status).toBe(403)
    expect(res.body).toHaveProperty('error', 'FORBIDDEN')
  })

  it('GET /delivery con DELIVERY_VER → 200 y shape paginado', async () => {
    const res = await request(app)
      .get('/api/v1/delivery/?page=1&limit=5')
      .set('Authorization', `Bearer ${T_DELIVERY_VER}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body).toMatchObject({ page: 1, limit: 5 })
    expect(typeof res.body.total).toBe('number')
    expect(res.body.data.length).toBeLessThanOrEqual(5)
  })

  it('GET /delivery con limit fuera de rango → 400 VALIDATION_ERROR', async () => {
    const res = await request(app)
      .get('/api/v1/delivery/?limit=999')
      .set('Authorization', `Bearer ${T_DELIVERY_VER}`)
    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error', 'VALIDATION_ERROR')
  })

  it('GET /delivery/sugerir-costo sin permiso → 403', async () => {
    const res = await request(app)
      .get('/api/v1/delivery/sugerir-costo?distrito=1')
      .set('Authorization', `Bearer ${T_SIN_PERMISOS}`)
    expect(res.status).toBe(403)
  })
})

// ─────────────────────────────────────────────────────────────
// Sugerencia de costo — BR-GPS-001 / BR-GPS-002
// ─────────────────────────────────────────────────────────────
describe('Delivery · sugerir costo', () => {
  const DISTRITO = 1

  it('sin GPS ⇒ distanciaKm null y costoSugerido = costo_base (BR-GPS-001)', async () => {
    const esperado = await costoBaseDe(DISTRITO)
    const res = await request(app)
      .get(`/api/v1/delivery/sugerir-costo?distrito=${DISTRITO}`)
      .set('Authorization', `Bearer ${T_DELIVERY_VER}`)

    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      distanciaKm: null,
      fueraRadio: false,
      dentroCobertura: true,
      costoSugerido: esperado,
    })
  })

  it('con GPS ⇒ respeta el schema y nunca sugiere menos que costo_base (BR-GPS-002)', async () => {
    const base = await costoBaseDe(DISTRITO)
    const { data } = await supabase
      .from('distrito')
      .select('lat_ref, lng_ref')
      .eq('id_distrito', DISTRITO)
      .single()
    const referencia = data as { lat_ref: number | null; lng_ref: number | null } | null
    const tieneReferenciaDistrito = referencia?.lat_ref !== null
      && referencia?.lat_ref !== undefined
      && referencia?.lng_ref !== null
      && referencia?.lng_ref !== undefined

    const res = await request(app)
      .get(`/api/v1/delivery/sugerir-costo?distrito=${DISTRITO}&lat=-12.0464&lng=-77.0428`)
      .set('Authorization', `Bearer ${T_DELIVERY_VER}`)

    expect(res.status).toBe(200)
    expect(typeof res.body.fueraRadio).toBe('boolean')
    expect(typeof res.body.dentroCobertura).toBe('boolean')
    expect(typeof res.body.costoSugerido).toBe('number')
    expect(res.body.costoSugerido).toBeGreaterThanOrEqual(base)

    if (tieneReferenciaDistrito) {
      // La distancia publicada corresponde a la referencia usada para la tarifa distrital.
      expect(typeof res.body.distanciaKm).toBe('number')
      expect(res.body.distanciaKm).toBeGreaterThanOrEqual(0)
    } else {
      // Sin referencia distrital, se conserva costo_base; cobertura se evalúa aparte con el local.
      expect(res.body.distanciaKm).toBeNull()
      expect(res.body.fueraRadio).toBe(false)
      expect(res.body.costoSugerido).toBe(base)
    }
  })

  it('falta el parámetro distrito → 400 VALIDATION_ERROR', async () => {
    const res = await request(app)
      .get('/api/v1/delivery/sugerir-costo?lat=-12.04&lng=-77.04')
      .set('Authorization', `Bearer ${T_DELIVERY_VER}`)
    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error', 'VALIDATION_ERROR')
  })

  it('lat/lng fuera de rango → 400 VALIDATION_ERROR', async () => {
    const res = await request(app)
      .get(`/api/v1/delivery/sugerir-costo?distrito=${DISTRITO}&lat=999&lng=-77.04`)
      .set('Authorization', `Bearer ${T_DELIVERY_VER}`)
    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error', 'VALIDATION_ERROR')
  })

  it('distrito inexistente → responde error (no un 200 con datos inventados)', async () => {
    const res = await request(app)
      .get('/api/v1/delivery/sugerir-costo?distrito=99999999')
      .set('Authorization', `Bearer ${T_DELIVERY_VER}`)
    // Hoy el repositorio lanza al no encontrar la fila y el handler global lo
    // convierte en 500 INTERNAL_ERROR; lo relevante es que nunca devuelva 200.
    expect(res.status).not.toBe(200)
    expect(res.body).toHaveProperty('error')
  })
})

// ─────────────────────────────────────────────────────────────
// Seguimiento staff (kanban + mapa)
// ─────────────────────────────────────────────────────────────
describe('Delivery · seguimiento staff', () => {
  it('GET /delivery/seguimiento → 200 con shape paginado', async () => {
    const res = await request(app)
      .get('/api/v1/delivery/seguimiento')
      .set('Authorization', `Bearer ${T_DELIVERY_VER}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body).toMatchObject({ page: 1, limit: 20 })
    expect(typeof res.body.total).toBe('number')
  })

  it('filtra por estado=R y devuelve solo ese estado', async () => {
    const res = await request(app)
      .get('/api/v1/delivery/seguimiento?estado=R')
      .set('Authorization', `Bearer ${T_DELIVERY_VER}`)
    expect(res.status).toBe(200)
    for (const item of res.body.data) {
      expect(item.estado).toBe('R')
    }
  })

  it('estado inválido → 400 VALIDATION_ERROR', async () => {
    const res = await request(app)
      .get('/api/v1/delivery/seguimiento?estado=X')
      .set('Authorization', `Bearer ${T_DELIVERY_VER}`)
    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error', 'VALIDATION_ERROR')
  })

  it('GET /delivery/seguimiento/:id/ubicacion → 200 con coords y sin teléfono', async () => {
    const { data } = await supabase
      .from('pedido_delivery')
      .select('id_pedidodelivery')
      .order('id_pedidodelivery', { ascending: false })
      .limit(1)
      .single()

    expect(data).toBeTruthy()
    const id = (data as { id_pedidodelivery: number }).id_pedidodelivery

    const res = await request(app)
      .get(`/api/v1/delivery/seguimiento/${id}/ubicacion`)
      .set('Authorization', `Bearer ${T_DELIVERY_VER}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('id_pedidodelivery', id)
    expect(res.body).toHaveProperty('situacion')
    // La vista expone coordenadas para el mapa…
    expect(res.body).toHaveProperty('lat_repartidor')
    expect(res.body).toHaveProperty('lng_repartidor')
    // …y no datos de contacto del cliente.
    expect(res.body).not.toHaveProperty('telefono_contacto')
    expect(res.body).not.toHaveProperty('telefono')
  })

  it('ubicacion de un id inexistente → 404 NOT_FOUND', async () => {
    const res = await request(app)
      .get('/api/v1/delivery/seguimiento/99999999/ubicacion')
      .set('Authorization', `Bearer ${T_DELIVERY_VER}`)
    expect(res.status).toBe(404)
    expect(res.body).toHaveProperty('error', 'NOT_FOUND')
  })
})

// ─────────────────────────────────────────────────────────────
// App repartidor (solo lectura)
// ─────────────────────────────────────────────────────────────
describe('Delivery · repartidor', () => {
  it('GET /repartidor/entregas → 200 con shape paginado', async () => {
    const res = await request(app)
      .get('/api/v1/repartidor/entregas')
      .set('Authorization', `Bearer ${T_REPARTIDOR}`)
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(typeof res.body.total).toBe('number')
  })

  it('GET /repartidor/por-rendir → 200', async () => {
    const res = await request(app)
      .get('/api/v1/repartidor/por-rendir')
      .set('Authorization', `Bearer ${T_REPARTIDOR}`)
    expect(res.status).toBe(200)
  })

  it('GET /repartidor/entregas sin token → 401', async () => {
    const res = await request(app).get('/api/v1/repartidor/entregas')
    expect(res.status).toBe(401)
  })
})
