ALTER TABLE public.pedido
  ADD COLUMN IF NOT EXISTS canal_origen character varying(12) NOT NULL DEFAULT 'PRESENCIAL';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'ck_pedido_canal_origen'
      AND conrelid = 'public.pedido'::regclass
  ) THEN
    ALTER TABLE public.pedido
      ADD CONSTRAINT ck_pedido_canal_origen
      CHECK (canal_origen IN ('QR', 'WEB', 'PRESENCIAL'));
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.fn_marcar_pedido_qr_autoservicio()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF NEW.id_usuario = 1
    AND NEW.id_mesa IS NOT NULL
    AND NEW.canal_origen = 'PRESENCIAL'
  THEN
    NEW.canal_origen := 'QR';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_pedido_canal_qr_autoservicio ON public.pedido;

CREATE TRIGGER trg_pedido_canal_qr_autoservicio
BEFORE INSERT ON public.pedido
FOR EACH ROW
EXECUTE FUNCTION public.fn_marcar_pedido_qr_autoservicio();

UPDATE public.pedido
SET canal_origen = 'QR'
WHERE id_usuario = 1
  AND id_mesa IS NOT NULL;

ALTER TABLE public.detalle_pedido
  ADD COLUMN IF NOT EXISTS f_entrega_mozo timestamp without time zone,
  ADD COLUMN IF NOT EXISTS id_usuario_entrega integer REFERENCES public.usuario(id_usuario);

INSERT INTO public.permiso (id_modulo, n_permiso, clave, descripcion)
SELECT modulo.id_modulo, permiso.n_permiso, permiso.clave, permiso.descripcion
FROM (
  SELECT COALESCE(
    (SELECT p.id_modulo FROM public.permiso AS p WHERE p.clave = 'PED_VER' LIMIT 1),
    (
      SELECT m.id_modulo
      FROM public.modulo AS m
      WHERE m.n_modulo IN ('PEDIDOS', 'MOZO')
      ORDER BY CASE m.n_modulo WHEN 'PEDIDOS' THEN 0 ELSE 1 END
      LIMIT 1
    )
  ) AS id_modulo
) AS modulo
CROSS JOIN (
  VALUES
    ('Ver pedidos', 'PED_VER', 'Listar y consultar comandas'),
    ('Entregar platos', 'PED_ENTREGAR', 'Confirmar la entrega de platos servidos a la mesa')
) AS permiso(n_permiso, clave, descripcion)
WHERE modulo.id_modulo IS NOT NULL
ON CONFLICT (clave) DO NOTHING;

INSERT INTO public.rol_permiso (id_rol, id_permiso, concedido, estado)
SELECT r.id_rol, p.id_permiso, 'S', 'A'
FROM public.rol AS r
CROSS JOIN public.permiso AS p
WHERE r.n_rol IN ('MOZO', 'SUPERVISOR', 'ADMINISTRADOR')
  AND p.clave = 'PED_VER'
ON CONFLICT (id_rol, id_permiso) DO UPDATE
SET concedido = 'S',
    estado = 'A',
    usumod = 'MIGRATION',
    fecmod = CURRENT_TIMESTAMP;

INSERT INTO public.rol_permiso (id_rol, id_permiso, concedido, estado)
SELECT r.id_rol, p.id_permiso, 'S', 'A'
FROM public.rol AS r
CROSS JOIN public.permiso AS p
WHERE r.n_rol IN ('MOZO', 'SUPERVISOR', 'ADMINISTRADOR')
  AND p.clave = 'PED_ENTREGAR'
ON CONFLICT (id_rol, id_permiso) DO UPDATE
SET concedido = 'S',
    estado = 'A',
    usumod = 'MIGRATION',
    fecmod = CURRENT_TIMESTAMP;

NOTIFY pgrst, 'reload schema';