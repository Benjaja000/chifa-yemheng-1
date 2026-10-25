-- 03_seeds_permisos.sql (CORREGIDO)
-- Seed idempotente de permisos para roles CAJERO, COCINA, MOZO, SUPERVISOR
-- Módulos: 1=SEGURIDAD, 2=MANTENIMIENTO, 3=CARTA, 4=SALON, 5=PEDIDOS, 6=VENTAS, 7=CAJA, 8=REPORTES, 9=AUDITORIA
-- Ejecutar en Supabase Dashboard → SQL Editor → Run

-- 1. Permisos base (INSERT/UPDATE idempotente con id_modulo correcto)
INSERT INTO public.permiso (id_modulo, n_permiso, clave, descripcion, estado)
VALUES
  (6, 'Cobrar Venta', 'VEN_COBRAR', 'Permite registrar cobros y emitir comprobantes', 'A'),
  (6, 'Emitir Comprobante', 'VEN_EMITIR', 'Permite emitir boletas y facturas', 'A'),
  (6, 'Anular Venta', 'VEN_ANULAR', 'Permite anular ventas y emitir notas de crédito', 'A'),
  (6, 'Nota de Crédito', 'VEN_NOTACREDITO', 'Permite emitir notas de crédito', 'A'),
  (5, 'Cocina KDS', 'PED_COCINA', 'Acceso al tablero de cocina (KDS)', 'A'),
  (5, 'Ver Pedidos', 'PED_VER', 'Listar y ver comandas', 'A'),
  (5, 'Registrar Pedidos', 'PED_REGISTRAR', 'Abrir comanda y agregar tandas', 'A'),
  (5, 'Anular Pedidos', 'PED_ANULAR', 'Anular comandas', 'A'),
  (5, 'Editar Pedidos', 'PED_EDITAR', 'Editar comandas', 'A'),
  (5, 'Descuentos', 'PED_DESCUENTO', 'Aplicar descuentos y cortesías', 'A'),
  (7, 'Aperturar Caja', 'CAJ_APERTURAR', 'Apertura de turno de caja', 'A'),
  (7, 'Cerrar Caja', 'CAJ_CERRAR', 'Cierre y arqueo de caja', 'A'),
  (7, 'Egresos Caja', 'CAJ_EGRESO', 'Registrar egresos de caja', 'A'),
  (7, 'Apertura Caja', 'CAJA_APERTURA', 'Abrir turno USP_APERTURAR_CAJA', 'A'),
  (7, 'Cierre Caja', 'CAJ_CIERRE', 'Cierre de turno USP_CERRAR_CAJA', 'A'),
  (7, 'Arqueo Caja', 'CAJ_ARQUEO', 'Arqueo de caja', 'A'),
  (7, 'Caja Ver', 'CAJA_VER', 'Ver estado de caja', 'A'),
  (4, 'Ver Mesas', 'MESA_VER', 'Listar y ver mesas', 'A'),
  (4, 'Crear Mesas', 'MESA_CREAR', 'Crear mesas', 'A'),
  (4, 'Editar Mesas', 'MESA_EDITAR', 'Editar mesas', 'A'),
  (4, 'Eliminar Mesas', 'MESA_ELIMINAR', 'Eliminar mesas', 'A'),
  (4, 'Ver Tipos Mesa', 'TMESA_VER', 'Ver tipos de mesa', 'A'),
  (4, 'Crear Tipos Mesa', 'TMESA_CREAR', 'Crear tipos de mesa', 'A'),
  (5, 'Crear Pedidos', 'PED_CREAR', 'Crear pedidos', 'A'),
  (5, 'Entrega Pedidos', 'PED_DELIVERY', 'Entrega de pedidos', 'A'),
  (6, 'Cobrar Venta', 'CAJ_COBRAR', 'Permite cobrar ventas desde caja', 'A'),
  (8, 'Ver Reportes', 'REP_VER', 'Consultar reportes gerenciales', 'A'),
  (9, 'Ver Auditoría', 'AUD_VER', 'Consultar la bitácora del sistema', 'A'),
  (2, 'Crear Categorías', 'CAT_CREAR', 'Crear categorías', 'A'),
  (2, 'Editar Categorías', 'CAT_EDITAR', 'Editar categorías', 'A'),
  (2, 'Eliminar Categorías', 'CAT_ELIMINAR', 'Eliminar categorías', 'A'),
  (2, 'Ver Categorías', 'CAT_VER', 'Ver categorías', 'A'),
  (2, 'Crear Unidades', 'UNI_CREAR', 'Crear unidades', 'A'),
  (2, 'Editar Unidades', 'UNI_EDITAR', 'Editar unidades', 'A'),
  (2, 'Eliminar Unidades', 'UNI_ELIMINAR', 'Eliminar unidades', 'A'),
  (2, 'Ver Unidades', 'UNI_VER', 'Ver unidades', 'A'),
  (3, 'Crear Productos', 'PROD_CREAR', 'Crear productos', 'A'),
  (3, 'Editar Productos', 'PROD_EDITAR', 'Editar productos', 'A'),
  (3, 'Eliminar Productos', 'PROD_ELIMINAR', 'Eliminar productos', 'A'),
  (3, 'Ver Productos', 'PROD_VER', 'Ver productos', 'A'),
  (2, 'Crear Clientes', 'CLI_CREAR', 'Crear clientes', 'A'),
  (2, 'Editar Clientes', 'CLI_EDITAR', 'Editar clientes', 'A'),
  (2, 'Eliminar Clientes', 'CLI_ELIMINAR', 'Eliminar clientes', 'A'),
  (2, 'Ver Clientes', 'CLI_VER', 'Ver clientes', 'A'),
  (1, 'Crear Personas', 'PER_CREAR', 'Crear personas', 'A'),
  (1, 'Ver Personas', 'PER_VER', 'Ver personas', 'A'),
  (1, 'Crear Empleados', 'EMP_CREAR', 'Crear empleados', 'A'),
  (1, 'Editar Empleados', 'EMP_EDITAR', 'Editar empleados', 'A'),
  (1, 'Ver Empleados', 'EMP_VER', 'Ver empleados', 'A'),
  (1, 'Crear Usuarios', 'USU_CREAR', 'Crear usuarios', 'A'),
  (1, 'Crear Roles', 'ROL_CREAR', 'Crear roles', 'A'),
  (1, 'Ver Roles', 'ROL_VER', 'Ver roles', 'A'),
  (1, 'Asignar Permisos', 'PER_ASIGNAR', 'Asignar permisos', 'A'),
  (1, 'Ver Permisos', 'PER_VER', 'Ver permisos', 'A'),
ON CONFLICT (clave) DO UPDATE SET
  id_modulo = EXCLUDED.id_modulo,
  n_permiso = EXCLUDED.n_permiso,
  descripcion = EXCLUDED.descripcion,
  estado = EXCLUDED.estado;

-- 2. Asignación de permisos a roles (idempotente)
-- CAJERO (id_rol = 3)
INSERT INTO public.rol_permiso (id_rol, id_permiso, concedido, estado)
SELECT 3, p.id_permiso, 'S', 'A'
FROM public.permiso p
WHERE p.clave IN (
  'VEN_COBRAR', 'VEN_EMITIR', 'VEN_ANULAR', 'VEN_NOTACREDITO',
  'CAJ_APERTURAR', 'CAJ_CERRAR', 'CAJ_EGRESO', 'CAJA_APERTURA', 'CAJA_CIERRE', 'CAJ_ARQUEO', 'CAJA_VER',
  'PED_REGISTRAR', 'PED_VER', 'PED_ANULAR', 'PED_DESCUENTO',
  'MESA_VER', 'CLI_VER', 'PROD_VER', 'REP_VER', 'AUD_VER'
)
ON CONFLICT (id_rol, id_permiso) DO UPDATE SET
  concedido = EXCLUDED.concedido,
  estado = EXCLUDED.estado;

-- COCINA (id_rol = 4)
INSERT INTO public.rol_permiso (id_rol, id_permiso, concedido, estado)
SELECT 4, p.id_permiso, 'S', 'A'
FROM public.permiso p
WHERE p.clave IN (
  'PED_COCINA', 'PED_VER', 'PED_REGISTRAR',
  'PROD_VER'
)
ON CONFLICT (id_rol, id_permiso) DO UPDATE SET
  concedido = EXCLUDED.concedido,
  estado = EXCLUDED.estado;

-- MOZO (id_rol = 5)
INSERT INTO public.rol_permiso (id_rol, id_permiso, concedido, estado)
SELECT 5, p.id_permiso, 'S', 'A'
FROM public.permiso p
WHERE p.clave IN (
  'PED_REGISTRAR', 'PED_VER', 'PED_EDITAR', 'PED_DESCUENTO',
  'MESA_VER', 'MESA_CREAR', 'MESA_EDITAR', 'MESA_ELIMINAR',
  'CLI_VER', 'CLI_CREAR', 'CLI_EDITAR', 'CLI_ELIMINAR',
  'PROD_VER', 'PROD_CREAR', 'PROD_EDITAR', 'PROD_ELIMINAR',
  'REP_VER', 'AUD_VER'
)
ON CONFLICT (id_rol, id_permiso) DO UPDATE SET
  concedido = EXCLUDED.concedido,
  estado = EXCLUDED.estado;

-- SUPERVISOR (id_rol = 2)
INSERT INTO public.rol_permiso (id_rol, id_permiso, concedido, estado)
SELECT 2, p.id_permiso, 'S', 'A'
FROM public.permiso p
WHERE p.clave IN (
  'VEN_COBRAR', 'VEN_EMITIR', 'VEN_ANULAR', 'VEN_NOTACREDITO',
  'CAJ_APERTURAR', 'CAJ_CERRAR', 'CAJ_EGRESO', 'CAJA_APERTURA', 'CAJA_CIERRE', 'CAJ_ARQUEO', 'CAJA_VER',
  'PED_REGISTRAR', 'PED_VER', 'PED_ANULAR', 'PED_EDITAR', 'PED_DESCUENTO',
  'PED_COCINA',
  'MESA_VER', 'MESA_CREAR', 'MESA_EDITAR', 'MESA_ELIMINAR',
  'CLI_VER', 'CLI_CREAR', 'CLI_EDITAR', 'CLI_ELIMINAR',
  'PROD_VER', 'PROD_CREAR', 'PROD_EDITAR', 'PROD_ELIMINAR',
  'REP_VER', 'AUD_VER', 'DASHBOARD_VER',
  'INV_VER', 'INV_CREAR', 'INV_EDITAR',
  'CLI_VER', 'CLI_CREAR', 'CLI_EDITAR', 'CLI_ELIMINAR',
  'PED_REGISTRAR', 'PED_VER', 'PED_ANULAR', 'PED_EDITAR', 'PED_DESCUENTO',
  'MESA_VER', 'MESA_CREAR', 'MESA_EDITAR', 'MESA_ELIMINAR',
  'CLI_VER', 'CLI_CREAR', 'CLI_EDITAR', 'CLI_ELIMINAR',
  'PROD_VER', 'PROD_CREAR', 'PROD_EDITAR', 'PROD_ELIMINAR',
  'VEN_COBRAR', 'VEN_EMITIR', 'VEN_ANULAR', 'VEN_NOTACREDITO',
  'CAJ_APERTURAR', 'CAJ_CERRAR', 'CAJ_EGRESO', 'CAJA_APERTURA', 'CAJA_CIERRE', 'CAJ_ARQUEO',
  'REP_VER', 'AUD_VER', 'DASHBOARD_VER'
)
ON CONFLICT (id_rol, id_permiso) DO UPDATE SET
  concedido = EXCLUDED.concedido,
  estado = EXCLUDED.estado;

-- VERIFICACIÓN: Ejecutar después para confirmar
-- SELECT r.n_rol, p.clave FROM rol_permiso rp
-- JOIN rol r ON rp.id_rol = r.id_rol
-- JOIN permiso p ON rp.id_permiso = p.id_permiso
-- WHERE r.n_rol IN ('CAJERO','COCINA','MOZO','SUPERVISOR')
-- ORDER BY r.n_rol, p.clave;