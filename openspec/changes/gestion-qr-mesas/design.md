# Gestión QR Mesas — Diseño

## Arquitectura
- **Validación pública**: `GET /mesas/by-qr?codigo=` (ya existe) valida el QR contra `mesa.codigo_qr`. Maneja formatos corto, completo y URL.
- **Auto-decodificación**: jsqr captura frames del video y decodifica; al detectar código, valida vía by-qr y actualiza estado/URL.
- **MesaQR**: página en `/cliente/mesa/:id` que busca mesa por QR code, muestra info, setea `cart.mesaId`, links a menú/comanda.
- **Admin QR**: modal con QRCodeSVG (valor = URL de login con mesa param) + código imprimible; regenerar si se renombra la mesa (candado anti-desync).
- **Comanda compartida**: si la mesa tiene comanda abierta, se incorpora; si no, se crea nueva y la mesa pasa a OCUPADA.
- **Guard reutilizable**: sin `mesaId` → estado "Escanea el QR de tu mesa" + botón cámara/volver; con mesa → flujo completo.

## Escenarios de comanda
| Escenario | Comportamiento |
|---|---|
| Uno pide para todos | Un pedido, múltiples líneas, `n_comensales = N`. `id_cliente` = host. |
| Varios se unen | Todos los clientes logueados pueden agregar líneas al mismo pedido. `id_cliente` por línea = quién la pidió. |
| Pago por separado (split bill) | Al cobrar, agrupar líneas por `id_cliente` → subcuentas. |
| Comanda aparte | Múltiples pedidos abiertos por mesa (cada uno con su host). |

## Permisos del host (cliente)
- Host = primer cliente que escanea el QR y abre la comanda.
- Host: agregar/quitar platos para todos, dividir cuenta, cerrar comanda, compartir QR/link.
- Non-host: agregar propio, ver totales, sin quitar otros ni dividir/cerrar.
- Validación: `clienteActual.id === pedido.id_cliente` → host.

## Auto-decodificación de cámara
- jsqr captura frames cada 400ms, decodifica, valida vía by-qr.
- Al detectar: actualiza estado (`valida`/`invalida`), ambiente, y URL con `?mesa=<código>`.
- Requiere HTTPS o localhost (secure context).

## Redirección post-login
- Con `?mesa=` → `/cliente/mesa/:id` (MesaQR).
- Sin `?mesa=` → `/cliente/inicio` (hub) o landing (`/`).

## Reglas clave
- `cart.mesaId` se setea al escanear QR o al abrir `/cliente/mesa/:id`.
- Sesión de cliente (JWT) independiente de mesa (localStorage `chifa.cliente`).
- Sin mesa asignada, "Enviar a cocina" deshabilitado.
- Candado anti-desync: renombrar mesa exige regenerar QR.