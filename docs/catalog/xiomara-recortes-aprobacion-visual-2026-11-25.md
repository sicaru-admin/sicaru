# SICARÚ · Lote XIOMARA · Aprobación visual y propuesta de integración
Fecha: 25 de noviembre de 2026 · Estado: **APROBADO VISUALMENTE / PREPARADO EN PR / NO PUBLICADO**

## Decisión de la propietaria
En conversación del 25/11/2026: «apruebo el recorte, continuemos». Se interpreta como aprobación visual de los **dos recortes frontales XIOMARA nuevos** previamente mostrados y comparados. **No incluye** reversos, NEKANE, MONTIS, ajustes de contenido comercial, edición de Medusa ni autorización de publicación a producción.

## Archivos exactos
| Producto | ID Medusa histórico / EAN | Imagen anterior | Recorte visualmente aprobado | SHA-256 |
|---|---|---|---|---|
| XIOMARA Shampoo Platinum 250 ml (azul) | `prod_01M79C6MFY2YPX504ZMDW9HJ0A` / `7501846500905` | `/images/products/xiomara-shampoo-platinum-250ml/01-principal.webp` | `/images/products/xiomara-shampoo-platinum-250ml/01-principal-recorte-propietaria-candidato.webp` | `868c47a8d945eb3406b2446557a2ce9aca2d35e5c430a1eb124693dc23a9eb85` |
| XIOMARA Shampoo Platinum Libre de Sulfatos 250 ml (morado) | `prod_01M79C7BHA8D7GCZG4DTBM1Q68` / `7501846505863` | `/images/products/xiomara-shampoo-platinum-libre-sulfatos-250ml/01-principal.webp` | `/images/products/xiomara-shampoo-platinum-libre-sulfatos-250ml/01-principal-recorte-propietaria-candidato.webp` | `5d829ee65edfe4618eb74a64d62b91db7aa592c4e768823cce4890e43c1bc07f` |

Los archivos provienen de originales entregados por propietaria y exportados a WebP lossless 1600×1600, sin reconstruir etiquetas ni modificar colores. Se comprueba el hash original por prueba automatizada en PR.

## Alcance técnico propuesto
- Reutilizar PR #35 **en borrador** en lugar de introducir un segundo mapeo en PR #34. Solo dos frontales nuevos; excluye expresamente la fotografía frontal/reverso NEKANE, que mantiene su asociación vigente.
- Guardas por **ID Medusa, handle, variante única de 250 ml y EAN exacto**.
- Sobrescribir en el frontend solamente si el valor de imagen que envía Medusa coincide exactamente con la URL frontal documentada, mismo origen, sin querystring ni hash. Si cambió la imagen, conservarla.
- Mantener inalterados reversos, imágenes que no coincidan, relación imágenes-variantes, títulos, precios, existencias, disponibilidad, carrito, WhatsApp, backend, envíos y pagos.
- Si se autoriza posteriormente publicar este PR, comprobar versión, pruebas móviles, respuesta de la ficha real, consistencia de imágenes de tarjetas y galerías, WhatsApp y rollback.

## Validaciones pendientes
1. CI del SHA final, Preview READY, WebP HTTP 200 en la misma Preview (no asumirlo por archivos en Git).
2. QA en 320/375/390/1440 px, tarjeta, detalle, reverso, confianza/legibilidad de CTA y enlace WhatsApp correcto.
3. Revalidar en modo **solo lectura** identificación y asociaciones Medusa actuales, antes de cualquier publicación. Datos del 22/11 son históricos.
4. Obtener autorización **expresa de merge/publicación**, adicional a esta aprobación visual. No mutar Admin Medusa para esta solución frontend.

**Rollback de frontend:** revertir el commit del PR o restaurar `main` anterior; los valores anteriores siguen en Medusa y los WebP `01-principal.webp` no se eliminan.
