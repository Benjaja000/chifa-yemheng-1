import request from 'supertest';
import { createApp } from '../../app.js';

const app = createApp();

describe('Maestros · provincias', () => {
  it('lista provincias con su departamento cuando no se especifica filtro', async () => {
    const response = await request(app).get('/api/v1/maestros/provincias');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    if (response.body.length > 0) {
      expect(response.body.every(
        (provincia: { id_departamento?: number }) => typeof provincia.id_departamento === 'number',
      )).toBe(true);
    }
  });

  it('mantiene el filtrado por departamento y rechaza ids inválidos', async () => {
    const allResponse = await request(app).get('/api/v1/maestros/provincias');
    expect(allResponse.status).toBe(200);
    const departamentoId = allResponse.body[0]?.id_departamento;

    if (departamentoId !== undefined) {
      const filteredResponse = await request(app)
        .get(`/api/v1/maestros/provincias?departamento=${departamentoId}`);

      expect(filteredResponse.status).toBe(200);
      expect(filteredResponse.body.length).toBeGreaterThan(0);
      expect(filteredResponse.body.every(
        (provincia: { id_departamento: number }) => provincia.id_departamento === departamentoId,
      )).toBe(true);
    }

    const invalidResponse = await request(app).get('/api/v1/maestros/provincias?departamento=0');
    expect(invalidResponse.status).toBe(400);
  });
});
