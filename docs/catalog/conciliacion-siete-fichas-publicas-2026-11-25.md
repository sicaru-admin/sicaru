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
| `kuul-cure-me-reconstructor-1l` | `prod_01KVV3GD5ZFG0NT90YWFXRPZFK` | `KUUL-CURE-1L` | `variant_01KVV3GD877SSAGARCPETM9JT5` | **Discrepancia de presentación:** Medusa publica «Reconstructor 1L» y variante «1L», pero Dirección aclara que, si el producto es **mascarilla Cure Me**, su presentación correcta es **1 kg**. **Leave-in** puede ser otra presentación y no debe confundirse con la mascarilla. Confirmar producto físico, nombre, unidad, SKU y foto; bloquear sustitución hasta conciliar. |
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

## Corrección de Dirección · 25 noviembre 2026

La propietaria precisa: **KÜÜL Cure Me mascarilla/reconstructor = 1 kg (peso), NO 1 L (volumen)**. La posible presentación de 1 L corresponde a un producto **leave-in** distinto y debe verificarse, no asumirse. Los campos «1L» del producto y la variante pública están registrados arriba como **valores observados, no como identidad comercial aprobada**. **No se debe renombrar automáticamente** la ficha ni reutilizar una foto del leave-in o de otro tamaño; requiere cotejo de producto, empaque, SKU y fuente maestra. Este documento no autoriza actualizaciones de Medusa.

## Facturas Henkel · conciliación KÜÜL Cure Me 1 kg · 25 noviembre 2026

**Evidencia directa:** XML CFDI originales en Gmail, emisor HENKEL CAPITAL; se examinaron las líneas de concepto, fecha y campo `NoIdentificacion`. Los documentos no demuestran inventario físico ni el motivo técnico del cambio de código.

| Factura | Fecha | Descripción literal | NoIdentificacion del proveedor |
|---|---|---|---|
| FA1123765101 | 2026-06-09 | Kuul Cure Me Recons 1 kg | `7501438366445` |
| FA1124490778 | 2026-09-28 | Kuul Cure Me Reconstructor System 1 Kg | `7501438306731` |
| FA1124762867 | 2026-11-10 | Kuul Cure Me Reconstructor System 1 Kg | `7501438306731` |

**Hallazgo:** existe una transición documental de identificador del fabricante para la presentación 1 kg entre junio y septiembre 2026. `7501438366445` es anterior documentado y `7501438306731` es el más reciente de las facturas revisadas. Se conserva ambos códigos como referencia de conciliación/historial; verificar EAN físico de la unidad actual y registro maestro antes de tratar `NoIdentificacion` como EAN garantizado. No es evidencia suficiente de que el cambio se debiera a KÜÜLPLEX+ ni de la fecha exacta de modificación del fabricante.

**Producto distinto, no confundir:** FA1124490778 de 2026-09-28 distingue `KUUL Cure Me Leave-in Treatment 1 L` con `NoIdentificacion=7501438368500`. FA1124762867 de noviembre también distingue `KUUL Cure Me Shampoo 1 L`, `NoIdentificacion=7501438368494`. **Ni leave-in 1 L ni shampoo 1 L deben reemplazar la mascarilla/reconstructor 1 kg.**

**Corrección propuesta a revisión:** para el producto Medusa `prod_01KVV3GD5ZFG0NT90YWFXRPZFK`, el título `Küül Cure Me Reconstructor 1L`, la variante `1L` y SKU interno `KUUL-CURE-1L` **son inconsistentes con la referencia documentada si representan la mascarilla**. Nombre de destino tentativo `KÜÜL Cure Me Reconstructor System 1 kg`. Antes de editar: cotejar foto real, EAN impreso y base maestra; decidir la política de SKU interno y conservar historial de ambos NoIdentificacion. La factura no autoriza un cambio de SKU automático ni confirma existencia. No realizar escrituras, despliegues o fusiones sin aprobación separada.
