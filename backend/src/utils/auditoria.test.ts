import type { Request } from 'express';
import { describe, expect, it, vi } from 'vitest';
import { getPc } from './auditoria.js';

function requestFixture(options: {
  equipo?: string;
  ip?: string;
  remoteAddress?: string;
}): Request {
  return {
    header: vi.fn().mockReturnValue(options.equipo),
    ip: options.ip,
    socket: { remoteAddress: options.remoteAddress },
  } as unknown as Request;
}

describe('getPc', () => {
  it('uses the client IP and ignores manually supplied device headers', () => {
    expect(getPc(requestFixture({ equipo: 'Laptop de administración', ip: '192.168.1.25' }))).toBe('192.168.1.25');
    expect(getPc(requestFixture({ ip: '::ffff:192.168.1.25' }))).toBe('192.168.1.25');
  });

  it('falls back to the socket IP and preserves IPv6 addresses', () => {
    expect(getPc(requestFixture({ remoteAddress: '2001:db8::1' }))).toBe('2001:db8::1');
  });

  it('returns an explicit marker instead of leaving the device field empty', () => {
    expect(getPc(requestFixture({ ip: 'not-an-ip', remoteAddress: undefined }))).toBe('UNKNOWN');
  });
});
