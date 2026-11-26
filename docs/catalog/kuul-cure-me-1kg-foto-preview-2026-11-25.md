# SICARÚ · KÜÜL Cure Me 1 kg · Prueba visual aislada

**Estado: SOLO PREVIEW · SIN PUBLICAR · SIN ESCRITURAS EN MEDUSA**

## Archivo fotográfico
- Fuente: fotografía original aportada por Dirección en la conversación (envase verde Cure Me, KÜÜLPLEX+, 35.27 oz / 1 kg).
- Fuente local original: 1536 × 1152 px, WebP, SHA-256 `19d32735dbb0f9e1d26a86306cfbe4a8ee51c2d6bee4b37170468806623ebee0` (no alojada aquí).
- **Versión temporal para revisión:** `public/images/products/kuul-cure-me-reconstructor-1kg/cure-me-1kg-preview-400.webp` (400 × 300 px; calidad 65), SHA-256 `255a4bee816af0641728c853426a4ac12f3bc353f961cff8ef00fc41f88e2510`. Generada por reescalado proporcional y compresión estándar; no se editaron etiquetas, colores ni contenidos.
- **Esta versión reducida NO es el asset final para una ficha comercial con zoom.** Antes de solicitar producción, alojar una versión de mayor resolución desde el original y verificar SHA contra el archivo original. No inventar empaque ni usar IA para reconstruirlo.

## Página QA
- `/qa/kuul-cure-me-1kg` habilitada solo en Preview de Vercel o desarrollo; responde 404 cuando `NODE_ENV=production` y `VERCEL_ENV` no es `preview`.
- Noindex/nofollow. Nombre **propuesto**, precio y existencia a consultar. Enlace al WhatsApp oficial de SICARÚ sin SKU técnico incorrecto.
- Foto original para identificar **Reconstructor System 1 kg**, no shampoo 1 L ni leave-in 1 L.

## Bloqueos de publicación
- Producto público actual: `prod_01KVV3GD5ZFG0NT90YWFXRPZFK`, variante `variant_01KVV3GD877SSAGARCPETM9JT5`; título e identificador interno todavía hacen referencia a 1 L.
- Base maestra 1 kg: `PRD-1A10D85B307D`, código de hoja `3136871`.
- Factura Henkel junio: `7501438366445`; facturas septiembre/noviembre: `7501438306731`. Ambos valores son `NoIdentificacion`, EAN físico pendiente.
- Para integrar la foto en tarjeta/galería pública: identificar y autorizar antes el producto 1 kg y su variante, corroborar código del envase y aprobar el cambio concreto de Medusa. **No conectar esta imagen por un simple handle que dice 1L.**

## Validación necesaria
- Verificar asset HTTP 200, tipo `image/webp`, PNG/WebP original y dimensiones.
- Probar QA en 320/390/1440 px y CTA WhatsApp.
- Confirmar página pública sin modificaciones y ausencia de efectos en precios, stock, variantes, checkout, búsqueda o carrito.
- CI y build antes de aprobar; plan de rollback: cerrar PR y descartar rama Preview. No publicar ni mergear sin autorización.


## Original íntegro y exportación comercial de alta resolución
- En el entorno de trabajo de esta revisión se verificó directamente el original aportado por Dirección: WebP **1536 × 1152**, 46,856 bytes, SHA-256 `19d32735dbb0f9e1d26a86306cfbe4a8ee51c2d6bee4b37170468806623ebee0`.
- También se generó exportación WebP a resolución íntegra, calidad 90: 1536 × 1152, **55,908 bytes**, SHA-256 `50cd454e020909cd118c47c798dd7858c394b226f0c6ac1296c8db4581db8fa0`. Es un archivo local de entrega, **no integrado todavía en este PR**.
- Para el asset comercial final se prefiere el original íntegro de 46,856 bytes: evita recomprimir y pesa menos. No declarar que el original se ha publicado.
- La foto reducida en este PR es solo para la ruta de QA; no reemplazar el recurso de Medusa sin evidencia de identidad y aprobación específica.

## Control agregado
- `tests/kuul-cure-me-1kg-preview.test.mjs`: verifica cabecera RIFF/WEBP de la referencia, aislamiento Preview/noindex, nombre propuesto y WhatsApp oficial. Es comprobación estructural, **no** prueba calidad visual, fidelidad de píxeles ni EAN físico.
