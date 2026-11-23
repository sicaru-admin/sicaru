# SICARÚ · Matriz de sustitución verificada por Store API · 22/11/2026

## ALERTA DE IDENTIDAD MONTIS · BLOQUEO ACTIVO (segunda lectura Store API, 22/11/2026)

**NO REEMPLAZAR NI RENOMBRAR EL PRODUCTO MONTIS EXISTENTE HASTA CONCILIAR SKU Y PRESENTACIÓN FÍSICA.** La segunda lectura de Store API confirma que `prod_01KVV3GD5ZR40Q6YWBS7QHJ48Z` tiene variante `variant_01KVV3GD87JA7N4A9201QH2MEW`, **título de variante `500ml`**, **SKU `MONTIS-SHAMPOO-NAT`**, `barcode=null`. La Base Maestra y la fotografía real del Shampoo de Caballo Montis documentan **650 ml**. Esta diferencia invalida la hipótesis previa de que basta corregir el título para convertir la ficha en Shampoo de Caballo 650 ml; requiere comprobar producto exacto con inventario/etiqueta, y no crear otro producto automáticamente.

**Registro de las imágenes actuales confirmado en la segunda lectura de Store API (sin escrituras):**
- Xiomara Platinum 250 ml: `img_01M79C6MFZESC3HZQ7BM31G5TP` → `https://www.sicarubeauty.com/images/products/xiomara-shampoo-platinum-250ml/01-principal.webp` (rank 0); EAN Medusa `7501846500905`.
- Xiomara Libre Sulfatos 250 ml: `img_01M79C7BHBGB550X7DZ5HJJWQJ` → `https://www.sicarubeauty.com/images/products/xiomara-shampoo-platinum-libre-sulfatos-250ml/01-principal.webp` (rank 0), `img_01M79C7BHBF79KRTFS6NGJKRPA` → `https://www.sicarubeauty.com/images/products/xiomara-shampoo-platinum-libre-sulfatos-250ml/02-reverso.webp` (rank 1); EAN Medusa `7501846505863`.
- Nekane Morazul 300 g: `img_01M79C817E4PS0RFP19X5SZX1K` → `https://www.sicarubeauty.com/images/products/nekane-morazul-shampoo-matizador-300g/01-principal.webp` (rank 0), `img_01M79C817E823BNBWGEP2EWYW6` → `https://www.sicarubeauty.com/images/products/nekane-morazul-shampoo-matizador-300g/02-reverso.webp` (rank 1); SKU/EAN no expuestos por la variante en Store API.
- Montis: `thumbnail=null`, `images=[]`, variante 500 ml antes indicada.

La descripción actual de Montis en Medusa (texto íntegro recuperado) es: `Shampoo Montis con extractos naturales para cabello saludable y brillante. Libre de parabenos.` Esta descripción no debe reemplazarse sin identificación de la variante y aprobación de contenido. Los demás textos descriptivos fueron recuperados mediante la consulta efímera y deben respaldarse nuevamente junto con todos los campos del Admin antes de cualquier edición. El script de extracción fue retirado después de obtener evidencia.

---


**ESTADO: PREPARADO / NO APROBADO / NO APLICADO A MEDUSA.**
La lectura **real y sin escrituras** de Medusa se confirmó en el build Vercel Preview `dpl_H99cdGw8DdijPT4c4rd2QsSADftS` (SHA `3f0a56a`), con `[SICARU_CATALOG_AUDIT] STORE_API_OK total=12`. El script temporal fue retirado de la rama y el PR pasó después GitHub CI #109 (`e7cb1e6`). Los datos visibles son únicamente de la Store API pública de ese momento; se necesita volver a verificar Admin inmediatamente antes de modificar.

## Registro exacto y sustitución de fotografías propuesta

| Producto | ID confirmado desde Store API | Nombre recibido | Thumbnail existente | Thumbnail R3 propuesto |
| --- | --- | --- | --- | --- |
| XIOMARA Platinum 250 ml | `prod_01M79C6MFY2YPX504ZMDW9HJ0A` | XIOMARA Shampoo Platinum 250 ml | `/images/products/xiomara-shampoo-platinum-250ml/01-principal.webp` | `/images/products/xiomara-shampoo-platinum-250ml/01-principal-r3.webp` |
| XIOMARA Libre de Sulfatos 250 ml | `prod_01M79C7BHA8D7GCZG4DTBM1Q68` | XIOMARA Shampoo Platinum Libre de Sulfatos 250 ml | `/images/products/xiomara-shampoo-platinum-libre-sulfatos-250ml/01-principal.webp` | `/images/products/xiomara-shampoo-platinum-libre-sulfatos-250ml/01-principal-r3.webp` |
| NEKANE Morazul Matizador 300 g | `prod_01M79C817D78WYM8K6D9W32NH1` | NEKANE Morazul Shampoo Matizador 300 g | `/images/products/nekane-morazul-shampoo-matizador-300g/01-principal.webp` | `/images/products/nekane-morazul-shampoo-matizador-300g/01-principal-r3.webp` |

**Origen exacto actual de las tres miniaturas:** `https://www.sicarubeauty.com` + la ruta de la columna anterior. Store API devolvió galería de 1 imagen para XIOMARA Platinum, 2 para XIOMARA Libre de Sulfatos y 2 para NEKANE Morazul. La primera URL de galería coincide con su `thumbnail`. **La segunda URL de las dos galerías no se registró en el diagnóstico vivo**, por lo que debe recuperarse en Admin antes de preparar un cambio de galería. Los reversos R3 candidatos son:

- XIOMARA Libre de Sulfatos: `/images/products/xiomara-shampoo-platinum-libre-sulfatos-250ml/02-reverso-r3.webp`
- NEKANE Morazul: `/images/products/nekane-morazul-shampoo-matizador-300g/02-reverso-r3.webp`

Los cinco assets R3 están en GitHub main desde el PR #32 y tienen dimensiones 1600×1600 comprobadas por CI. **No se confirmó HTTP 200 público individual de los cinco assets desde el lector externo**, ni aprobación visual final de la propietaria. Tampoco se ha modificado ninguna asociación en Medusa.

## MONTIS · ficha defectuosa confirmada (ATENCIÓN: no coincide presentación, ver alerta arriba)

- ID Medusa vigente desde Store API: `prod_01KVV3GD5ZR40Q6YWBS7QHJ48Z`.
- Handle: `montis-shampoo-extracto-natural`.
- **Nombre recibido:** `Montis Shampoo Extracto Natural`.
- **Thumbnail:** null / vacío. **Galería:** 0 elementos.
- **ID maestro expuesto en la Store API:** ausente para los cuatro productos, por lo que el enlace con la Base Maestra necesita conciliación comercial, no puede suponerse por metadata.
- Base Maestra, fila 580: `PRD-MONTIS-CABALLO-650`, nombre **Shampoo de Caballo Montis 650 ml**; EAN documental `7503000640069` pendiente cotejo con el producto de esa ficha.
- Fotografía frontal original en Drive: `1gjUv3UiPo-z7UrB7xdpDwAexlVGRn6n9`. Foto original real, etiqueta Montis y 650 ml legibles. WebP V2: **archivo local de revisión**, todavía no subido ni aprobado; la etiqueta menciona ingredientes que no deben convertirse en promesas terapéuticas.
- Cambio propuesto, **no ejecutado**: nombre `Shampoo de Caballo Montis 650 ml` y una fotografía web aprobada cuando se confirme SKU/EAN y procedencia. La descripción prudente está documentada en `docs/catalog/ficha-montis-caballo-650-propuesta-2026-11-22.md`.
- Precio, inventario, categoría, variantes, checkout y metadatos no forman parte de los cambios autorizados. El precio no se concilió en Store API y no se debe inferir de una página indexada.

## Condiciones para aplicar una corrección

1. Abrir los cuatro registros **exactos por ID Medusa** en Admin en modo solo lectura; comprobar título, SKU/EAN, variantes, thumbnail y cada `images[].url` y exportar **respaldo íntegro inmediatamente antes del cambio** (incluida descripción de Montis).
2. Confirmar por HTTP 200 las cinco fotografías R3 en la misma URL de origen usada por la web; revisar tarjetas de 320 y 390 px. Se requiere aprobación visual final, incluyendo Montis.
3. Revalidar que cada producto conserva **el mismo ID y handle**, y que la miniatura actual es idéntica a la capturada aquí; si hay diferencias, detener y conciliar, no sobrescribir a ciegas.
4. Si se aprueba una actualización de contenido, aplicar **solo** título, descripción e imágenes autorizadas al producto exacto; no tocar otros campos.
5. Verificar tarjeta, ficha, búsqueda, categoría, CTA de WhatsApp y render móvil. Para revertir, restaurar los valores íntegros del respaldo hecho en el paso 1.
6. Obtener autorización expresa para cualquier actualización de Medusa de producción y otra autorización para publicar cambios del frontend. Este documento y el PR #34 no equivalen a ninguna de esas autorizaciones.
