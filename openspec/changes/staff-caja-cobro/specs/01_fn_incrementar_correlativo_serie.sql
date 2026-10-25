-- 001_fn_incrementar_correlativo_serie.sql
-- Función para incrementar correlativo de serie_documento de forma atómica (FOR UPDATE).
-- Ejecutar en Supabase Dashboard → SQL Editor → Run.

CREATE OR REPLACE FUNCTION public.fn_incrementar_correlativo_serie(p_tipodoc character varying)
RETURNS TABLE (serie character varying, numero character varying)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_serie_id INT;
  v_serie CHAR(4);
  v_corr INT;
  v_num CHAR(8);
BEGIN
  SELECT ID_Serie INTO v_serie_id
  FROM SERIE_DOCUMENTO
  WHERE Tipo_Documento = p_tipodoc AND ESTADO = 'A'
  ORDER BY ID_Serie LIMIT 1 FOR UPDATE;

  IF v_serie_id IS NULL THEN
    RAISE EXCEPTION 'No existe serie activa para el tipo de documento indicado.';
  END IF;

  UPDATE SERIE_DOCUMENTO
  SET Correlativo = Correlativo + 1
  WHERE ID_Serie = v_serie_id
  RETURNING Serie, Correlativo INTO v_serie, v_corr;

  v_num := LPAD(v_corr::TEXT, 8, '0');

  RETURN QUERY SELECT v_serie, v_num;
END;
$$;