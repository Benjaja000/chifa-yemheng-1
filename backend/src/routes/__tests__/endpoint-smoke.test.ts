import request from 'supertest';
import { createApp } from '../../app.js';

type HttpMethod = 'get' | 'post' | 'put' | 'patch';

interface RouteLayer {
  route?: { path: string; methods: Partial<Record<HttpMethod, boolean>> };
  handle?: { stack?: RouteLayer[] };
  regexp?: RegExp;
}

interface ExpressAppInternals {
  _router: { stack: RouteLayer[] };
}

interface Endpoint {
  method: HttpMethod;
  path: string;
}

function listarEndpoints(app: ReturnType<typeof createApp>): Endpoint[] {
  const layers = (app as unknown as ExpressAppInternals)._router.stack;
  return layers.flatMap((layer) => {
    const stack = layer.handle?.stack;
    if (!stack || !layer.regexp) return [];
    const prefix = layer.regexp.source
      .replace('^', '')
      .split('\\/?(')[0]
      .replaceAll('\\/', '/');
    return stack.flatMap((routeLayer) => {
      if (!routeLayer.route) return [];
      return (Object.keys(routeLayer.route.methods) as HttpMethod[])
        .filter((method) => routeLayer.route?.methods[method])
        .map((method) => ({
          method,
          path: `${prefix}${routeLayer.route?.path.replace(/:([A-Za-z0-9_]+)/g, '1') ?? ''}`,
        }));
    });
  });
}

async function solicitar(endpoint: Endpoint, app: ReturnType<typeof createApp>) {
  const target = request(app)[endpoint.method](endpoint.path);
  return endpoint.method === 'get'
    ? target
    : target.send({});
}

describe('Endpoint smoke coverage', () => {
  it('returns an HTTP response for every registered API method and path', async () => {
    const firstApp = createApp();
    const secondApp = createApp();
    const endpoints = listarEndpoints(firstApp);
    expect(endpoints.length).toBeGreaterThan(100);

    for (const [index, endpoint] of endpoints.entries()) {
      const app = index < 100 ? firstApp : secondApp;
      const response = await solicitar(endpoint, app);
      expect(response.status, `${endpoint.method.toUpperCase()} ${endpoint.path}`).toBeLessThan(500);
    }
  }, 120_000);
});
