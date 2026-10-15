import type { PersonaDetalle, PersonaLista } from '../models/persona.js';
import { PersonaError } from '../models/persona.js';
import type {
  HacerCliente,
  HacerPersonal,
  PersonaBuscar,
  PersonaCreate,
  PersonaQuery,
  PersonaUpdate,
} from '../schemas/persona.js';
import {
  auditar,
  buscarPersonaPorDoc,
  cerrarCliente,
  cerrarEmpleado,
  completarContacto,
  crearPersonaBase,
  insertarCliente,
  insertarEmpleado,
  listarPersonas,
  obtenerPersona,
} from '../repositories/personas-repository.js';
import { obtenerCliente } from '../repositories/clientes-repository.js';
import { obtenerPersonal } from '../repositories/personal-repository.js';

export function listarService(q: PersonaQuery): Promise<PersonaLista> {
  return listarPersonas(q.page, q.limit, q.buscar);
}

export async function buscarService(input: PersonaBuscar): Promise<PersonaDetalle> {
  const base = await buscarPersonaPorDoc(input.tipoDoc, input.documento);
  if (!base) {
    throw new PersonaError('NOT_FOUND');
  }
  const detalle = await obtenerPersona(base.id);
  if (!detalle) {
    throw new PersonaError('NOT_FOUND');
  }
  return detalle;
}

export async function obtenerService(id: number): Promise<PersonaDetalle> {
  const detalle = await obtenerPersona(id);
  if (!detalle) {
    throw new PersonaError('NOT_FOUND');
  }
  return detalle;
}

export async function crearService(
  input: PersonaCreate,
  idUsuario: number,
  logeo: string,
  pc = '',
): Promise<PersonaDetalle> {
  if (input.tipoDoc === 'DNI' && !/^\d{8}$/.test(input.documento)) {
    throw new PersonaError('VALIDATION_ERROR');
  }
  const existente = await buscarPersonaPorDoc(input.tipoDoc, input.documento);
  if (existente) {
    throw new PersonaError('YA_EXISTE');
  }
  const base = await crearPersonaBase(input, logeo, pc);
  await auditar(idUsuario, 'CREAR_PERSONA', base.id, `${base.nombres} ${base.apPaterno}`);
  const detalle = await obtenerPersona(base.id);
  if (!detalle) {
    throw new PersonaError('NOT_FOUND');
  }
  return detalle;
}

export async function hacerPersonalService(
  idPersona: number,
  datos: HacerPersonal,
  idUsuario: number,
  logeo: string,
  pc = '',
): Promise<import('../models/personal.js').Personal> {
  const persona = await obtenerPersona(idPersona);
  if (!persona) {
    throw new PersonaError('NOT_FOUND');
  }
  if (persona.esPersonalActivo) {
    throw new PersonaError('YA_EXISTE');
  }
  if (persona.esClienteActivo) {
    throw new PersonaError('YA_ES_CLIENTE_ACTIVO');
  }
  const idEmpleado = await insertarEmpleado(idPersona, datos, logeo, pc);
  await auditar(idUsuario, 'HACER_PERSONAL', idEmpleado, `${persona.nombres} ${persona.apPaterno}`);
  const creado = await obtenerPersonal(idEmpleado);
  if (!creado) {
    throw new PersonaError('NOT_FOUND');
  }
  return creado;
}

export async function hacerClienteService(
  idPersona: number,
  datos: HacerCliente,
  idUsuario: number,
  logeo: string,
  pc = '',
): Promise<import('../models/cliente.js').Cliente> {
  const persona = await obtenerPersona(idPersona);
  if (!persona) {
    throw new PersonaError('NOT_FOUND');
  }
  if (persona.esClienteActivo) {
    throw new PersonaError('YA_EXISTE');
  }
  if (persona.esPersonalActivo) {
    throw new PersonaError('YA_ES_PERSONAL_ACTIVO');
  }
  await completarContacto(
    idPersona,
    { telefono: datos.telefono, correo: datos.correo, distritoId: datos.distritoId, direccion: datos.direccion },
    logeo,
    pc,
  );
  const idCliente = await insertarCliente(idPersona, datos, logeo, pc);
  await auditar(idUsuario, 'HACER_CLIENTE', idCliente, `${persona.nombres} ${persona.apPaterno}`);
  const creado = await obtenerCliente(idCliente);
  if (!creado) {
    throw new PersonaError('NOT_FOUND');
  }
  return creado;
}

export async function convertirService(
  idPersona: number,
  destino: 'personal' | 'cliente',
  datos: Record<string, unknown>,
  idUsuario: number,
  logeo: string,
  pc = '',
): Promise<PersonaDetalle> {
  const persona = await obtenerPersona(idPersona);
  if (!persona) {
    throw new PersonaError('NOT_FOUND');
  }
  if (destino === 'personal') {
    if (persona.esPersonalActivo) {
      throw new PersonaError('YA_EXISTE');
    }
    if (persona.clienteId !== null && persona.esClienteActivo) {
      await cerrarCliente(persona.clienteId, logeo, pc);
    }
    const idEmpleado = await insertarEmpleado(idPersona, datos as unknown as HacerPersonal, logeo, pc);
    await auditar(idUsuario, 'CONVERTIR_ROL', idEmpleado, `CLIENTE->PERSONAL ${persona.documento}`);
  } else {
    if (persona.esClienteActivo) {
      throw new PersonaError('YA_EXISTE');
    }
    if (persona.empleadoId !== null && persona.esPersonalActivo) {
      await cerrarEmpleado(persona.empleadoId, logeo, pc);
    }
    const d = datos as unknown as HacerCliente;
    await completarContacto(
      idPersona,
      { telefono: d.telefono, correo: d.correo, distritoId: d.distritoId, direccion: d.direccion },
      logeo,
      pc,
    );
    const idCliente = await insertarCliente(idPersona, d, logeo, pc);
    await auditar(idUsuario, 'CONVERTIR_ROL', idCliente, `PERSONAL->CLIENTE ${persona.documento}`);
  }
  const detalle = await obtenerPersona(idPersona);
  if (!detalle) {
    throw new PersonaError('NOT_FOUND');
  }
  return detalle;
}

export async function actualizarService(
  id: number,
  input: PersonaUpdate,
  idUsuario: number,
  logeo: string,
  pc = '',
): Promise<PersonaDetalle> {
  const actual = await obtenerPersona(id);
  if (!actual) {
    throw new PersonaError('NOT_FOUND');
  }
  const { actualizarPersonaBase } = await import('../repositories/personas-repository.js');
  const detalle = await actualizarPersonaBase(id, input, logeo, pc);
  if (!detalle) {
    throw new PersonaError('NOT_FOUND');
  }
  await auditar(idUsuario, 'EDITAR_PERSONA', id, `${detalle.nombres} ${detalle.apPaterno}`);
  return detalle;
}
