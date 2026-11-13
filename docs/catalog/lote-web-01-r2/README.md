# Lote Web 01 · fotografías R2 · pendiente de aprobación visual

Esta rama añade cinco archivos `-r2.webp` y una comparación aislada. No sustituye los assets actuales ni modifica Medusa, precios, inventario, categorías, variantes, contactos, checkout o pagos. No hay payload ejecutable de Medusa.

## Fuentes y edición

Se reutilizan exclusivamente los cinco originales identificados por Drive ID y SHA-256 en `../lote-web-01/assets.json`. Los originales no se incorporan a `public` ni se editan. El script rechaza cualquier hash distinto. `assets.json` de este directorio registra procedencia, dimensiones, transformaciones y hashes de los derivados R2.

La máscara es una silueta manual trazada con curvas Bezier en `masks.json`, rasterizada con antialias a la resolución original. La operación sustituye el canal alpha; RGB del producto queda intacto antes de la reducción. No hay segmentación generativa, reconstrucción, retoque de letras, cambios de color/exposición, sharpening ni pintura de detalles. Se conserva la suavidad y los reflejos de la fotografía, con sus limitaciones de foco originales.

Los cinco lienzos son WebP lossless de **1600 × 1600**, transparentes, sin fondo ni sombra horneados. Altura de producto: **1312 px (82%)**. Base: **1440 px (90%)**. Escala uniforme sin ampliación y centrado por centroide de alpha. La sombra de la tarjeta continúa siendo exclusivamente la del componente real del storefront.

Para reproducir usando las dependencias existentes del proyecto (Sharp, instalado por Next), con los originales disponibles en una carpeta separada:

```sh
node scripts/prepare-lote-web01-r2.mjs --originals /ruta/a/originales --evidence /ruta/a/evidencias
```

Cada original debe conservar el nombre `<Drive ID>.jpg`. El script solo lee esa carpeta. Las pruebas sobre crema y magenta son evidencias locales; no son imágenes comerciales con fondo incorporado.

## Revisión humana de bordes

- Platinum: punta blanca, reborde y concavidad inferior de la bomba.
- Libre de Sulfatos frente: plástico translúcido y reflejos capturados. Se conserva su RGB original; no se reconstruye cómo transmitiría luz sobre otro fondo.
- Libre de Sulfatos reverso: boquilla posterior naturalmente desenfocada; no se inventa un borde nítido ni detalle ausente.
- Morazul: muesca de tapa dorada, hombros blancos y pequeñas imperfecciones de base.
- Reversos: texto y barcode conservados tal como fueron fotografiados, con su nitidez original. El código visible de Morazul no se traslada a metadata ni se considera conciliado.

La existencia de alpha y las pruebas automáticas no constituyen aprobación visual. Dirección debe revisar especialmente esos contornos a tamaño grande. No se incluyen ampliaciones generativas ni retoques para disimular limitaciones de las fuentes.

## Preview comparativo

Ruta **`/qa/lote-web-01-r2`**, exclusiva para Preview o desarrollo, bloqueada en Production y fuera de modo catálogo. Metadata `noindex, nofollow`; sin enlaces desde navegación ni sitemap.

Reutiliza **RetailProductCard → ProductPhoto** y **ImageGallery** sin modificarlos. Cada uno de los cinco assets se compara ACTUAL/R2 en tarjeta cuadrada y en una galería grande desplegable. Las tarjetas aplican sus breakpoints reales al comprobar 320, 390 px y escritorio. Los enlaces «Ver ficha productiva actual» permiten consultar la versión vigente sin confundirla con el candidato.

El fixture conserva una lectura de las tres fichas publicadas, sus IDs, precios y flags exactos. Solo se sustituye `thumbnail` en memoria para el comparativo. No carga datos nuevos en Medusa ni cambia los barcodes; Morazul sigue sin barcode/EAN/UPC. La página no necesita claves de Store API ni nuevos ámbitos de variables.

## Límites de publicación

PR Draft y Preview para revisión únicamente. No merge ni producción. Asociar estos archivos en Medusa requerirá otra autorización expresa después de la aprobación visual; esta rama no contiene esa operación.
