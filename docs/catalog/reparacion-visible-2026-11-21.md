# SICARÚ · Reparación controlada del catálogo visible · 21 noviembre 2026

**ESTADO: PROPUESTA TÉCNICA / SOLO LECTURA. NO PUBLICAR.**

## Evidencia de origen

Captura de pantalla aportada por propietaria (21/11/2026) en categoría de shampoos: cuatro tarjetas visibles. La de Montis se titula `Montis Shampoo Extracto Natural` y muestra `Imagen no disponible`. Las otras muestran fotografías originales con fondo de mesa/estudio gris que la propietaria **rechazó por calidad comercial**: XIOMARA Platinum 250 ml, XIOMARA Platinum Libre de Sulfatos 250 ml, NEKANE Morazul 300 g.

**Dato maestro confirmado, lectura 21/11/2026:** en `BASE_MAESTRA_PRODUCTOS` fila 580, ID `PRD-MONTIS-CABALLO-650`, el nombre oficial es **Shampoo de Caballo Montis 650 ml**; código de barras físico documentado **7503000640069**. Precio actual de tienda reportado el 21/10: $150 MXN. **No equivale a precio implementado ni autoriza actualizar precios web**, y no constituye prueba de inventario. La fotografía frontal señalada por propietaria debe compararse visual y físicamente con este registro; no equiparar el shampoo de romero Natural Cosmetics ni otros envases de shampoo.

## Fotografías existentes de reemplazo (no volver a producir)

PR #32 incorporó a `main` exactamente cinco archivos R3 WebP transparentes de 1600×1600 px para:
- `xiomara-shampoo-platinum-250ml`: `01-principal-r3.webp` (ID maestro PRD-9CC3A06A6F10)
- `xiomara-shampoo-platinum-libre-sulfatos-250ml`: `01-principal-r3.webp` y `02-reverso-r3.webp` (PRD-3CE612A96316)
- `nekane-morazul-shampoo-matizador-300g`: `01-principal-r3.webp` y `02-reverso-r3.webp` (PRD-ABEB7E8039E3)

**Punto técnico:** `RetailProductCard` presenta `product.thumbnail || product.images?.[0]?.url`; la presencia de los WebP en GitHub no implica asociación en Medusa. No hacer un fallback por nombre de marca ni sobreescribir fotografías de otras variantes.

## Herramienta de diagnóstico ya añadida

```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://<backend-publico> \
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=<clave-publicable> \
node scripts/audit-catalog-photo-repair.mjs

node --test tests/audit-catalog-photo-repair.test.mjs
```

No usar ninguna clave administrativa. La herramienta sólo realiza solicitudes GET a Store API y los assets R3 públicos, e imprime un informe JSON; **jamás escribe ni hace cambios comerciales**. Para pruebas sin conexión se puede usar `--fixture /ruta/fixture.json`.

## Secuencia necesaria para implementar la reparación

1. **Identidad:** leer Medusa Store y Admin (GET) con producto, handle, ID maestro, presentación, variante, SKU/EAN, título, thumbnail, galería. Si Montis no tiene `sicaru_master_product_id=PRD-MONTIS-CABALLO-650`, detener cambio de nombre y conciliarlo antes. No crear otro producto.
2. **R3:** verificar GET 200, tipo WebP y render real de los cinco assets del PR #32, cotejar frontal/reverso contra originales y foto física. Si algún ID maestro no coincide, detener su reemplazo. Presentar comparativa ACTUAL/R3 de las tres fichas a propietaria (tarjeta y galería).
3. **Montis:** presentar candidata frontal de Shampoo de Caballo Montis **650 ml**, cotejar empaque y EAN físico; usar nombre maestro sólo si identidad exacta. No usar la foto de Shampoo Romero ni de Natural Cosmetics.
4. **Vista previa:** preparar un cambio puntual de datos de imágenes/título **sin escribir en Medusa de producción**; revisar página de categoría, búsqueda, ficha, carrito y consulta WhatsApp en 320/390 px y escritorio. Si no existe backend sandbox aislado, entregar payload documental/diff; **no simular publicación real en producción**.
5. **Validación:** confirmar build, lint, pruebas automatizadas y capturas; registro de enlaces, versión/SHA, comparación estética y ausencia de regresiones.
6. **Autorización independiente:** la propietaria aprueba cada foto y el cambio concreto de nombre, después autoriza explícitamente la publicación a producción. Ejecutar con respaldo de campos previos y rollback (restaurar títulos/URLs anteriores, o revertir el commit si corresponde), y verificar en URL pública.

## Acciones expresamente bloqueadas en este PR

- Crear, borrar o fusionar productos de Medusa.
- Actualizar Admin, precio, costo, existencia, EAN, stock, checkout, envíos o pagos.
- Usar la fotografía frontal de otra presentación o de otra marca.
- Mezclar R3 no revisadas con fotos de fondo oscuro en la web publicada.
- Hacer merge o publicar automáticamente por éxito de CI.

Riesgo prioritario: un cambio por coincidencia de texto puede asignar imágenes o identidad incorrecta a un producto. Esta herramienta impone coincidencia exacta de ID maestro y handle para candidatos R3, y señala la actualización de Montis como **pendiente de revisión**, no como cambio realizado.
