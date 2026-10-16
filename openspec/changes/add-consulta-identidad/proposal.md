# Proposal: add-consulta-identidad

Autocompletar altas con la API Factiliza (RENIEC/SUNAT) para eliminar errores
de digitación. Fase 1: solo **Clientes** (DNI en ficha N, RUC en ficha J).
Fases 2-3 (Personal, Personas) quedan pendientes, reutilizando el mismo proxy.

El token vive solo en el backend (`FACTILIZA_TOKEN`); el frontend llama a un
proxy propio. Sin token, todo sigue 100% manual. Se agrega `ubigeo` a
`distrito` para preseleccionar el `DistritoPicker` por código exacto
(99 nombres repetidos descartan el match por nombre).
