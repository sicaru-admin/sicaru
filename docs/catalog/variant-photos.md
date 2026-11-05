# Fotografías por variante · contrato de frontend

Base independiente: `837e43137fab23e1a9a6aa6109352497921d4baf`.
Fecha de diagnóstico: 4 de noviembre de 2026. PR #21 permanece separada.

## Diagnóstico antes de editar

Las versiones instaladas de `@medusajs/types` y `@medusajs/js-sdk` son 2.13.1.
`StoreProductVariant` hereda `images: BaseProductImage[] | null` y
`thumbnail: string | null`. Las imágenes tienen `id`, `url` y `rank`.
La relación nativa existe en el modelo de backend 2.13.1; no requiere metadata
personalizada ni un plugin de imágenes.

La consulta actual de `getProductByHandle()` pide precios y metadata de variantes,
pero no `variants.images`. Los campos por defecto de Store incluyen imágenes del
producto y variantes, pero no esa relación anidada. Debe ampliarse únicamente el
detalle con `*variants.images`, manteniendo los listados sin esa carga adicional.
Los tipos instalados no prueban por sí solos la versión del backend desplegado;
la aceptación del query real debe verificarse de forma independiente y de lectura.

`product.images` es el conjunto de imágenes del producto y también puede contener
las asociadas a variantes. Por eso no debe utilizarse completo como fallback
general. Las fotos sin asociación específica son las generales, de acuerdo con
el modelo nativo de Medusa.

La ficha actual pasa únicamente `product.images` a ImageGallery. ProductActions
ya resuelve la variante, opciones y SKU, y main conserva su entrega al carrito
local mediante `getCatalogCartAddInput`. Esa lógica no debe reemplazarse por el
trabajo antiguo de KÜÜL.

## Arquitectura elegida

Un contenedor cliente ProductExperience compone la cuadrícula existente. Usa un
slot de renderizado opcional de ProductActions que recibe su variante canónica y
su panel de acciones. ProductActions sigue siendo el único propietario de la
selección; no hay estado espejo, efecto de sincronización ni segundo resolver.
La galería, el carrito y WhatsApp utilizan la misma variante en la misma
renderización. El título y marca siguen siendo children preparados en servidor.

Único ajuste necesario del payload del carrito: su thumbnail procede del mismo
helper de imágenes seguras. El helper existente de carrito usaba el thumbnail
general o la primera imagen del producto, que podría ser la de otro tono.
Se conservan `getCatalogCartAddInput`, identificadores, SKU, opciones y cantidad;
no se modifican CatalogCart, CartProvider, persistencia ni WhatsApp.

El helper puro getProductMedia usa las relaciones nativas:

1. Sin selección: imágenes generales no reservadas, thumbnail general no reservado
   cuando no hay otras generales, y finalmente placeholder.
2. Con fotos propias: solo las de la variante canónica; su thumbnail puede ir
   primero, seguido del orden estable por rank. Se eliminan URLs duplicadas.
3. Sin fotos propias: únicamente fallback general; nunca fotos de otra variante.

Se reservan imágenes específicas por ID y URL, incluidos thumbnails de variantes.
Esto también impide que una URL duplicada vuelva a aparecer como imagen general.
Una variante ajena al producto no es una selección válida.

La galería reinicia la miniatura al cambiar la selección o el conjunto de fotos,
y limita su índice para tolerar arrays más cortos. Cuando el producto contiene
fotos por variante, reserva el marco y el espacio de miniaturas necesarios para
evitar saltos al pasar entre fotos, fallback y placeholder. Los productos
totalmente sin fotos conservan las dimensiones anteriores del placeholder.

Sin variantes se conservan título y galería, aunque no haya panel de acciones.
Si hay varias variantes indistinguibles sin opciones seleccionables, no se elige
una arbitrariamente. El contacto sigue siendo una consulta general.

## Fuentes

- [Tipos HTTP v2.13.1](https://raw.githubusercontent.com/medusajs/medusa/v2.13.1/packages/core/types/src/http/product/common.ts)
- [Modelo ProductVariant v2.13.1](https://raw.githubusercontent.com/medusajs/medusa/v2.13.1/packages/modules/product/src/models/product-variant.ts)
- [Modelo ProductImage v2.13.1](https://raw.githubusercontent.com/medusajs/medusa/v2.13.1/packages/modules/product/src/models/product-image.ts)
- [Campos Store por defecto v2.13.1](https://raw.githubusercontent.com/medusajs/medusa/v2.13.1/packages/medusa/src/api/store/products/query-config.ts)
- [Guía oficial de asociación de imágenes](https://docs.medusajs.com/user-guide/products/edit#associate-images-with-variants)

La distribución Next.js 16.1.6 instalada no incluye `node_modules/next/dist/docs`;
se consultó la guía oficial de composición de componentes servidor/cliente.

## Límites de esta fase

No se cargan fotos ni asociaciones en Medusa. No se crean productos o variantes
reales, ni se introducen tonos, SKU, EAN o URLs fotográficas de KÜÜL en runtime.
El helper no acredita identidad, derechos, aprobación visual o stock: esos datos
deben conciliarse antes de cualquier escritura posterior autorizada.
Una imagen específica que no esté correctamente asociada en Medusa se seguirá
considerando general; la preparación del backend debe respetar ese contrato.

## Verificación ejecutada

- Store API pública, solo lectura: el query exacto de lista usado por
  getProductByHandle, con handle, limit, region_id y `*variants.images`, respondió
  HTTP 200 para un producto vigente y devolvió `variants.images: []` en su misma
  variante. También se contrastó la ruta por ID con/sin expansión. Esto acredita
  aceptación del campo, no una asignación real no vacía ni una versión de Railway.
- Suite completa: **76/76 PASS**, incluidas 16 pruebas nuevas de medios, selección,
  miniaturas, fallback, payload de carrito y fields del SDK.
- TypeScript y build: PASS. Lint: cero errores; tres advertencias preexistentes.
- Navegador local, 320/375/390 y 1440 px: A con dos imágenes, B con una, C con
  fallback general; sin fotos generales, C usa placeholder. Producto totalmente
  sin imágenes y producto solo con imágenes generales también comprobados.
- Cambio con teclado, `aria-pressed`, imagen cargada y ausencia de overflow.
  El título conservó su posición documental (delta 0 px) entre A/B/C en los
  escenarios medidos. La cantidad se conservó entre selecciones, sin recarga.
- Carrito local real del frontend: B conserva su imagen y SKU en la consulta
  preparada. No se envió ningún mensaje. El fixture no recibió escrituras.
- Checkout mantiene el bloqueo vigente; consola observada sin errores/warnings.

Los dos manifiestos de integridad solo actualizan los hashes de
`src/lib/data/products.ts` (expansión autorizada de fields) y de ImageGallery
(donde estaba incluido). No se excluyó ningún archivo protegido. El resto de
las 49/56 entradas conserva sus hashes y existen regresiones de comportamiento
para los dos cambios autorizados, además de la comprobación de integridad.

La reproducción usa `qa/variant-media/server.mjs`: cuatro productos y diagramas
SVG identificados como sintéticos, fuera de `src` y sin conexión a Medusa.
No son fotografías ni empaques reconstruidos. No se sirven como datos reales
en una Preview o en producción.

## Riesgos y revisión pendiente

No hay una asociación real no vacía validada en backend dentro de esta fase.
La validación de cambio visual se realizó con datos sintéticos; las fotografías
reales deben asociarse y aprobarse posteriormente mediante un alcance autorizado.
Sus URLs deben ser accesibles y compatibles con los orígenes permitidos por
Next Image. Esta rama no modifica esa configuración.

Los cards de catálogo, relacionados y metadata SEO no se rediseñan aquí. La PR
#21 conserva su corrección independiente. Una Preview necesita la configuración
de lectura del catálogo para su rama; esta PR no cambia variables o permisos.
Sin merge ni publicación en producción.
