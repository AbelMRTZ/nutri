# Importador de catálogo USDA (Foundation Foods + SR Legacy)

Puebla las tablas `nutrients`, `reference_foods` y `reference_food_nutrients`
(migración `0011_food_catalog.sql`) a partir de los CSV oficiales de
[USDA FoodData Central](https://fdc.nal.usda.gov/download-datasets.html).
Idempotente: ejecutarlo varias veces sobre los mismos ficheros actualiza las
filas existentes, nunca las duplica.

## 1. Descargar los datasets

Desde la web oficial (gratuita, dominio público), descarga por separado —
**nunca** el paquete combinado, que arrastra Branded Foods:

- Foundation Foods → sección "Foundation Foods", descarga CSV.
- SR Legacy → sección "SR Legacy", descarga CSV (versión final, abril 2018).

Descomprime cada zip en su propia carpeta, por ejemplo:

```
data/usda/foundation/FoodData_Central_foundation_food_csv_<fecha>/
data/usda/sr_legacy/FoodData_Central_sr_legacy_food_csv_2018-04/
```

`data/usda/` ya está en `.gitignore` — no se commitean los CSV originales.

## 2. Configurar la service role key

Añade en `.env` (nunca en el bundle de la app):

```
SUPABASE_SERVICE_ROLE_KEY=...
```

Se obtiene en el panel de Supabase → Project Settings → API → `service_role`.
Este script es el único sitio del proyecto que la usa — bypassa RLS.

## 3. Ejecutar

```
npm run import:usda -- --foundation data/usda/foundation/<carpeta_extraida> --sr-legacy data/usda/sr_legacy/<carpeta_extraida>
```

Puedes pasar solo uno de los dos flags si quieres (re)importar un único
dataset.

## 4. Revisar el informe

Cada ejecución escribe `scripts/import-usda/reports/<timestamp>.json` con:
alimentos procesados/excluidos por categoría o por marca (con ejemplos),
nutrientes vistos, y cuántas filas de nutrientes quedaron marcadas
(`is_flagged`) por unidad desconocida o valor fuera de rango plausible.
Nada de esto modifica ni descarta un valor original — solo lo señala.

## Traducciones al español

`translations.es.json` empieza vacío (`{}`). Añade a mano
`"<fdc_id>": "Nombre en español"` para los alimentos que quieras traducir —
nunca se genera automáticamente ni con IA. Mientras no exista traducción, la
app mostraría el nombre original de USDA.

## Qué NO hace este script

- No descarga nada por scraping ni adivina URLs — la descarga es manual.
- No traduce, no estima ni inventa ningún valor nutricional.
- No convierte un nutriente ausente en `0` — si USDA no lo midió, no se
  inserta fila para ese nutriente en `reference_food_nutrients`.
- No toca la tabla `foods` (alimentos personales de cada usuario) ni nada
  de `meals`/`plans`.
