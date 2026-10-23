# Voglia · lote 1 de fotografías reales

Recibido el 23/10/2026 en `SICARU_Voglia_Lote1_Web.zip`. El propietario indica que las fotografías se recuperaron de su catálogo de Google y se optimizaron a WebP. Se conservan los bytes originales: 1200 × 900 px, sin recomprimir, recortar, alterar etiquetas, empaques o tonos. [LEEME original](voglia-lote1-LEEME.txt).

Rama creada desde `main` `54d4ccf6f65aa1703885cc3a0746c4c1fd75e487`: `feat/voglia-lote1-fotos-reales-2026-10-23`. No se incluyen cambios a producción ni a otros PR.

## Vinculación exacta

| Identificador del combo virtual | Tono | Archivo público | Estado |
| --- | --- | --- | --- |
| KIT-VOGLIA-8601-1036 | 1 Negro | `/productos/voglia/KIT-VOGLIA-8601-1036.webp` | Recibido; vinculación al combo en Medusa pendiente |
| KIT-VOGLIA-8603-1036 | 3 Castaño Oscuro | `/productos/voglia/KIT-VOGLIA-8603-1036.webp` | Recibido; vinculación al combo en Medusa pendiente |
| KIT-VOGLIA-8604-1036 | 4 Castaño Medio | `/productos/voglia/KIT-VOGLIA-8604-1036.webp` | Recibido; vinculación al combo en Medusa pendiente |

Las fotografías muestran tinte 90 ml, peróxido 20V 140 ml y mechón. El mapa de presentación está en `VOGLIA_COMBO_ASSETS`, en `src/lib/product-retail.ts`. Solo reconoce `variant.sku` idéntico al identificador completo recibido. Nunca deduce una asociación por título, tono, prefijo, número parcial o similitud. No declara que esos SKU existan en Medusa ni crea productos/variantes. Si el backend usa otro campo como identificador externo, queda pendiente confirmar la relación exacta antes de ampliar el adaptador.

El catálogo y las fichas siguen dependiendo de los productos reales devueltos por Medusa. El registro fotográfico no se concatena al catálogo, ni actúa como fallback de productos. Cuando se reciba una variante real con identificador exacto, la tarjeta y galería usarán el original correspondiente. La selección de una variante en tarjeta cambia su fotografía sin transferirla a otra variante. La galería etiqueta cada imagen con el tono e incluye solo los combos que realmente figuren en las variantes de ese producto.

## Comprobación de Medusa

Lectura realizada mediante `/productos?q=KIT-VOGLIA-8601-1036` del storefront existente, que devuelve hasta 100 productos. La respuesta incluyó nueve productos publicados; no contenía ninguno de los tres identificadores de combo. Esto no acredita ausencia de productos en borrador o de otros canales del administrador.

Sí se encontró `prod_01KVV3GD5ZD8R40HF48DRBF37A`, handle `voglia-tinte-permanente-90ml`, título «Voglia Tinte Permanente 90ml», con variantes como `VOGLIA-TINTE-1-90ML`, `VOGLIA-TINTE-3-90ML` y `VOGLIA-TINTE-4CC-90ML`. Esos identificadores no son los kits. No se les asignan las fotografías del combo; tampoco se equipara tono 4 con 4CC. La respuesta contiene $97 MXN para variantes de tubo, sin metadatos de aprobación: ese importe sigue oculto como «Consultar precio» y no se modifica el backend.

Pendiente: que se confirme o prepare en Medusa el producto real de cada combo, sus identificadores, composición e inventario de ambos componentes. Este trabajo no da de alta productos ni modifica Medusa, Railway o credenciales.

## Precio, disponibilidad y seguridad

- Aprobación del propietario: **$97 MXN exclusivamente por combo tinte + peróxido**, para los tres identificadores de esta tabla. No es precio aprobado del tubo suelto.
- El registro guarda esa aprobación; no sintetiza precios. Solo se muestra $97 cuando la variante real coincide exactamente y Medusa devuelve `calculated_amount: 97` con moneda MXN. Si falta precio o cambia importe/moneda, se muestra «Consultar precio».
- No se generan SKU, variantes, inventario o disponibilidad. La falta de inventario conserva «Consultar disponibilidad» y deshabilita el agregado.
- El carrito se conserva. El modo catálogo y los bloqueos de envío, pagos y pedidos permanecen sin cambios; no se cotiza paquetería.

## Revisión antes de integrar

`/revision/voglia-lote1` muestra los tres originales con los mismos componentes de fotografía de tarjeta y ficha, sin inventar productos comerciales o acciones de compra. Solo funciona en desarrollo/preview; devuelve 404 en producción y declara `noindex, nofollow`. No se enlaza desde la navegación pública. El bloqueo en producción se verifica ejecutando el build como servidor de producción en CI.

Tarjetas y fichas usan `object-contain`; las imágenes completas conservan proporción 4:3. CI prueba las fotografías en ambas presentaciones a 320/375/390 px, imágenes exactas, selección de variantes, ausencia de desbordamiento, precio reservado a los kits, inventario desconocido y bloqueos de checkout. Las variantes de ejemplo existen únicamente en el backend aislado de pruebas.

SHA-256 para verificar que GitHub conserva los originales:

| Archivo | SHA-256 |
| --- | --- |
| KIT-VOGLIA-8601-1036.webp | `d70cd2940096a1c3a17186cb510a200ab3cf425191cf60820e3a6ca1ce4e736c` |
| KIT-VOGLIA-8603-1036.webp | `f98bcecd41e9c5d1eee4c938366adca7f53184aed671cd73d78a60ad88020604` |
| KIT-VOGLIA-8604-1036.webp | `840883a34264a786c56210c3c9ab9f231b31a4b596216bd1e06a5748202489ac` |

Pendiente la revisión visual del propietario para confirmar la correspondencia entre fotografía y producto antes de fusionar. Este PR no publica ni fusiona automáticamente.
