# SICARÚ · Siete fichas sin fotografía · conciliación pública (25/11/2026)

**ESTADO: SOLO LECTURA / PROPUESTA. NO PUBLICAR NI EDITAR MEDUSA.**

Se consultaron las siete URLs públicas de ficha mediante Vercel autenticado, todas HTTP 200. El HTML de cada ficha incluía el mensaje `Imagen no disponible`, sin etiquetas de imagen de galería. Los identificadores siguientes proceden del producto serializado por la Store API en la respuesta de la página; **no equivalen a auditoría Admin ni a cotejo físico**.

| Handle público | Product ID actual | SKU(s) encontrado(s) | Variante(s) identificadas | Intervención bloqueada |
|---|---|---|---|---|
| `nekane-tratamiento-hidra-intenso` | `prod_01KVV3GD5Z3VZCKH48G0MDZAP0` | `NEKANE-HIDRA-300ML` | `variant_01KVV3GD87DTVD8FX1HJGCRD37` | Foto exacta y presentación por validar |
| `vitale-keratina-profesional` | `prod_01KVV3GD5Z4E86TFJNTJ806QZX` | `VITALE-KERAT-500ML` | `variant_01KVV3GD87G57YGAJE93QXKKEG` | Foto exacta y presentación por validar |
| `hidra-color-tinte-cremoso` | `prod_01KVV3GD5Z8Q1ND1PXMBD6PZ47` | `HIDRA-COLOR-90ML` | `variant_01KVV3GD87P3WFSH6R73379RZD` | Tono no acreditado; no asignar foto de un tono por defecto |
| `xiomara-gel-fijacion-fuerte` | `prod_01KVV3GD5Z9RXF3QAZWM7TJCDS` | `XIOMARA-GEL-250ML` | `variant_01KVV3GD87T6ZD7C1DZ0PVXRF5` | Foto exacta y presentación por validar |
| `voglia-tinte-permanente-90ml` | `prod_01KVV3GD5ZD8R40HF48DRBF37A` | **Múltiples SKU**, entre ellos `VOGLIA-TINTE-1-90ML`, `VOGLIA-TINTE-3-90ML` | Múltiples variantes (no listado exhaustivo aquí) | Asociar por variante/tono; no usar una imagen de tono para todos |
| `kuul-cure-me-reconstructor-1l` | `prod_01KVV3GD5ZFG0NT90YWFXRPZFK` | `KUUL-CURE-1L` | `variant_01KVV3GD877SSAGARCPETM9JT5` | Revisar fotografía anterior aprobada: no confundir 1 L con 1 kg ni 3 oz |
| `montis-shampoo-extracto-natural` | `prod_01KVV3GD5ZR40Q6YWBS7QHJ48Z` | `MONTIS-SHAMPOO-NAT` | `variant_01KVV3GD87JA7N4A9201QH2MEW` | **Identidad incongruente** frente a referencia maestra Shampoo de Caballo Montis 650 ml / PRD-MONTIS-CABALLO-650; no cambiar nombre ni imagen sin cotejo |

## Fuentes y límites
- URL general: https://www.sicarubeauty.com/productos
- URLs exactas: `https://www.sicarubeauty.com/productos/<handle>`.
- El estado corresponde al HTML servido durante las consultas del 25/11/2026, no certifica estado futuro ni visibilidad de borradores.
- La fuente maestra comercial fue localizada en Drive bajo `SICARÚ · BASE MAESTRA INVENTARIO Y PRECIOS 2026`; **sus filas no se han reconciliado aquí mediante lectura de celdas**.
- PR #32 contiene cinco masters R3 de otros shampoos (dos Xiomara Platinum y Nekane Morazul). **No son fotos aprobadas para estas siete fichas**.
- PR #30 Fantasy Nails es una integración distinta. No mezclar sus imágenes ni sus SKUs en estos siete productos.

## Siguiente cambio acotado, una vez exista foto auténtica verificada
1. Cotejar ID de producto, variante, SKU/EAN físico, presentación exacta, foto original y permiso visual.
2. Comprobar que la asociación en Medusa corresponde al producto y, si aplica, variante correcta. Relectura antes de escritura.
3. Preparar Preview de tarjeta y galería en móvil 320/390 y escritorio, con WhatsApp y selección intactos.
4. Autorizar por separado cualquier actualización de título, imagen o relaciones en Medusa, y posterior publicación.
5. Preservar títulos, URL y foto anteriores para rollback. No tocar precio, stock, canal, checkout, pagos ni envíos.

**No deducir permisos de escritura ni ausencia de registros a partir de esta conciliación Store API.**
