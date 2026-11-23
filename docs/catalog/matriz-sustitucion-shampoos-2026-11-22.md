# SICARÚ · Matriz de sustitución verificada por Store API · 22/11/2026

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

## MONTIS · ficha defectuosa confirmada

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
