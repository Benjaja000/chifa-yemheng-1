# Propuesta: OpenAPI/Swagger Documentation

## Problema
- No hay documentación automática de la API REST.
- Desarrolladores frontend / terceros no tienen contrato formal.

## Alcance
- Generar especificación OpenAPI 3.0 desde código (decoradores `tsoa` o `nestjs/swagger`).
- Endpoint `GET /api/docs` sirve Swagger UI.
- Endpoint `GET /api/docs/json` sirve spec JSON.

## Fuera de alcance
- Generación de cliente SDK (TypeScript, Python, etc.).
- Validación de request/response contra spec (middleware).

## Criterios de aceptación
- `GET /api/docs` renderiza Swagger UI con todos los endpoints.
- `GET /api/docs/json` retorna JSON válido OpenAPI 3.0.
- Specs generadas desde código (no manuales).