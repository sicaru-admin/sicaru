# Lote Web 01 · R3 · escala y colocación · pendiente de aprobación visual

Continuación del mismo PR Draft y comparativo `/qa/lote-web-01-r2`: **ACTUAL / R2 / R3**. No reemplaza las imágenes productivas ni cambia Medusa. R2 sigue disponible, sin modificar sus bytes ni sus máscaras.

## Único cambio fotográfico

Se reutilizan los originales de R2, verificados por SHA-256, y exactamente `../lote-web-01-r2/masks.json` (SHA-256 `4abc994aac871a81d5ed27f0ec1f257ebb56aef84f219439ce0edeb08e11a0e0`). No se traza, corrige ni recalcula una silueta nueva. Se cambia únicamente el tamaño proporcional y la posición sobre un lienzo transparente de **1600 × 1600 px**.

| Producto | Altura R2 | Altura R3 | Base R3 | Margen superior |
| --- | --- | --- | --- | --- |
| XIOMARA Platinum | 1312 px (82%) | 1472 px (92%) | 1536 px | 64 px |
| XIOMARA Libre de Sulfatos, frente y reverso | 1312 px (82%) | 1472 px (92%) | 1536 px | 64 px |
| NEKANE Morazul, frente y reverso | 1312 px (82%) | 1464 px (91.5%) | 1528 px | 64 px |

Centrado óptico horizontal por el mismo centroide de alpha de R2. Morazul queda ligeramente menos alto para conservar aire y equilibrio con las bombas de XIOMARA. La base baja 96 px (XIOMARA) u 88 px (Morazul) respecto a R2. Se conserva el encuadre completo y las imperfecciones visibles.

Los masters son WebP **lossless**, sin EXIF personal, sin fondo ni sombra incorporados. RGB previo al escalado: **cero cambios**. La reducción proporcional usa el mismo Lanczos3, desde la resolución nativa, nunca ampliando R2. Sin IA, exposición, ajustes de color, iluminación, retoque de etiqueta ni sharpening. La interpolación necesaria para escalar no es una edición cromática.

## Reproducción y propuesta de optimización

Con las dependencias existentes del proyecto:

```sh
node scripts/prepare-lote-web01-r3.mjs --originals /ruta/a/originales --evidence /ruta/externa/a/evidencias-r3
```

Los originales siguen siendo `<Drive ID>.jpg`, de solo lectura. El script rechaza cambios en originales, máscaras, R1 o R2. `placement.json` contiene exclusivamente escala y base. `assets.json` registra la procedencia y los hashes de cada master.

La ejecución crea candidatos WebP Q95 **solo en la carpeta externa de evidencias** `optimizados-propuesta-no-publicar/`, con manifiesto, hashes, tamaño, alpha idéntico y métricas RGB. **No se incluyen en `public`, Git, Preview ni Medusa; no sustituyen los masters.** Q95 es una propuesta sujeta a revisión visual de etiqueta y bordes, no una aprobación automática por métricas. Los masters máximos se conservan.

## Revisión con componentes reales

RetailProductCard → ProductPhoto e ImageGallery no cambian. En móvil se mantienen dos columnas del tamaño habitual; la tercera versión ocupa otra fila, evitando reducir las tres tarjetas para hacerlas caber artificialmente. Escritorio muestra tres columnas. Las galerías desplegables conservan el componente grande existente.

Con ProductPhoto real, la altura del producto equivale aproximadamente a 72–78% del área cuadrada de imagen a 320, 390 px y escritorio, según el padding de cada breakpoint. Esta medición no equivale a aprobación visual. Deben revisarse los cinco archivos y especialmente las tres imágenes principales.

La página sigue exclusiva para Preview/desarrollo, `noindex, nofollow`, ausente de navegación y sitemap y bloqueada por `notFound()` en Production. El fixture comercial y los componentes de venta permanecen intactos. No merge ni publicación productiva; una futura asociación de fotografías requerirá autorización posterior.
