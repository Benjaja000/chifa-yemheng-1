# add-ubigeo-distrito — match exacto de distrito por código (no por nombre)

99 nombres de distrito se repiten en distintas provincias: el match por
`d_distrito` es una lotería. Con `ubigeo char(6)` (DDPPDD SUNAT) el alta con
Factiliza preselecciona el `DistritoPicker` por código exacto. Se usa siempre
`ubigeo_sunat` (el de RENIEC puede diferir).

## Orden de ejecución

1. `01_add_ubigeo_distrito.sql` (columna anulable + CHECK formato + UNIQUE;
   `UNIQUE` admite múltiples `NULL`, seguro con filas sin conciliar)
2. `02_backfill_ubigeo.sql` (solo tripletas exactas + `WHERE ubigeo IS NULL`)

```bash
psql -d RESTAURANTEV3 -f "01_add_ubigeo_distrito.sql"
psql -d RESTAURANTEV3 -f "02_backfill_ubigeo.sql"
```

## Rollback (aditiva = reversible)

```sql
ALTER TABLE public.distrito DROP CONSTRAINT IF EXISTS uq_distrito_ubigeo;
ALTER TABLE public.distrito DROP CONSTRAINT IF EXISTS ck_distrito_ubigeo_fmt;
ALTER TABLE public.distrito DROP COLUMN IF EXISTS ubigeo;
```

## Verificación

```sql
SELECT conname FROM pg_constraint WHERE conname IN ('uq_distrito_ubigeo','ck_distrito_ubigeo_fmt');
-- Cobertura del backfill:
SELECT count(*) FILTER (WHERE ubigeo IS NOT NULL) AS con_ubigeo,
       count(*) AS total FROM public.distrito;
-- Pendientes de conciliación manual (resolver con UPDATEs explícitos):
SELECT d.id_distrito, p.n_provincia, dep.n_departamento, d.d_distrito
FROM public.distrito d JOIN public.provincia p USING (id_provincia)
JOIN public.departamento dep USING (id_departamento)
WHERE d.ubigeo IS NULL ORDER BY 2,3,4;
-- Sin duplicados:
SELECT ubigeo, count(*) FROM public.distrito GROUP BY ubigeo HAVING count(*) > 1;
```
