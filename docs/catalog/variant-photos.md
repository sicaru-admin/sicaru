# Fotografías por variante · contrato corregido de Medusa 2.13.1

PR #22, rama codex/variant-product-photos.
Base independiente: 837e43137fab23e1a9a6aa6109352497921d4baf.
Esta corrección sustituye el diagnóstico de imágenes del commit 6cd8945:
sus fixtures trataban variant.images como asociaciones exclusivas. Esa premisa
era incorrecta; las pruebas locales anteriores no acreditaban el contrato real.
PR #21 y la preparación de datos/fotografías reales permanecen separadas.

## Investigación realizada antes de la corrección

Fuentes fijadas al tag oficial v2.13.1, sin consultar Medusa ni Railway reales:

- [Guía oficial: asociar imágenes](https://docs.medusajs.com/user-guide/products/edit#associate-images-with-variants) (documentación viva; el código versionado es la referencia para 2.13.1).
- [Servicio ProductModuleService](https://github.com/medusajs/medusa/blob/v2.13.1/packages/modules/product/src/services/product-module-service.ts):
  listProducts/listAndCountProducts/retrieveProduct llaman buildVariantImagesFromProduct
  al cargar variants.images. Se particionan imágenes sin enlaces (generales) e
  imágenes enlazadas. Para cada variante, el array empieza con las generales y
  después incorpora las específicas que tengan un enlace a su ID.
  getVariantImages, utilizado al consultar variantes, también incluye generales.
- [Pruebas oficiales de variantes](https://github.com/medusajs/medusa/blob/v2.13.1/packages/modules/product/integration-tests/__tests__/product-module-service/product-variants.spec.ts):
  caso «should retrieve variant images including product images not associated
  with other variants»; retirar el último enlace convierte la imagen en general.
- [Modelo ProductImage](https://github.com/medusajs/medusa/blob/v2.13.1/packages/modules/product/src/models/product-image.ts):
  variants es manyToMany con ProductVariant.
- [Pivot explícito](https://github.com/medusajs/medusa/blob/v2.13.1/packages/modules/product/src/models/product-variant-product-image.ts):
  ProductVariantProductImage enlaza image y variant. No es metadata inferida.
- [Formulario oficial de asociaciones](https://github.com/medusajs/medusa/blob/v2.13.1/packages/admin/dashboard/src/routes/products/product-image-variants-edit/product-image-variants-edit.tsx):
  solicita images.id, images.url e images.variants.id; usa un tipo local porque
  el tipo HTTP base de imagen no declara la relación expandible.
- [Store GET /products](https://github.com/medusajs/medusa/blob/v2.13.1/packages/medusa/src/api/store/products/route.ts):
  pasa fields a query.graph, o a query.index cuando está habilitado ese motor.
- [Store middleware](https://github.com/medusajs/medusa/blob/v2.13.1/packages/medusa/src/api/store/products/middlewares.ts)
  y [query config](https://github.com/medusajs/medusa/blob/v2.13.1/packages/medusa/src/api/store/products/query-config.ts):
  defaults incluyen *images, pero no images.variants.id. No hay una allowlist
  específica que prohíba esa relación en esta configuración.
- [Parser de fields](https://github.com/medusajs/medusa/blob/v2.13.1/packages/core/framework/src/http/utils/get-query-config.ts):
  +images.variants.id añade el campo sin reemplazar defaults.
  [Conversión remota](https://github.com/medusajs/medusa/blob/v2.13.1/packages/core/modules-sdk/src/remote-query/to-remote-query.ts)
  y [RemoteQuery](https://github.com/medusajs/medusa/blob/v2.13.1/packages/core/modules-sdk/src/remote-query/remote-query.ts)
  convierten esa ruta en selección/relación anidada para el módulo.

La expansión explícita se acredita por el modelo, el formulario oficial y el
camino de consultas de Store. Esta investigación no acredita que un backend
desplegado distinto, personalizado o con index engine tenga idéntico comportamiento.
La aceptación del field y una respuesta no vacía siguen pendientes en media real.
No se añadieron credenciales, consultas Admin ni endpoints de backend al frontend.

## Semántica exacta y resultado comercial

| Asociación nativa de imagen | variant.images derivado | Antes de seleccionar | Selección A | Selección B | Selección C sin específicas |
| --- | --- | --- | --- | --- | --- |
| Ninguna (general G) | G en todas | G | G | G | G |
| Solo A | En A | No | Sí | No | No |
| A+B | En A y B | No | Sí | Sí | No |
| A+B+C (todas) | En todas | No | Sí | Sí | Sí |

En un producto mixto: G1/G2, A1/A2, B1 y AB,
el resultado es G1/G2 sin selección; G1/G2+A1/A2+AB para A;
G1/G2+B1+AB para B; G1/G2 para C.
Sin generales, una variante sin específicas conserva el placeholder.
El hecho de aparecer en todas las variantes no permite distinguir una general
de una imagen explícitamente asociada a todas.

## Corrección y arquitectura

getProductByHandle solicita +images.variants.id y deja de solicitar *variants.images.
Los listados y colecciones conservan sus fields anteriores y su peso.
La relación vive en product.images; el helper no necesita consumir el array
derivado de variantes ni consultar pivotes con credenciales privadas.

ProductActions continúa siendo el único propietario de la variante seleccionada.
ProductExperience conserva el slot que recibe esa variante canónica; no hay
estado espejo, contexto global ni otro resolver. Galería, carrito y consulta
WhatsApp utilizan esa misma selección. No se modifican componentes TSX en esta
corrección, ni CatalogCart, CartProvider, persistencia, precios o product-inquiry.

getProductMedia clasifica únicamente enlaces explícitos por ID:
- variants: [] acredita una imagen general.
- variants: [{id: A}, {id: B}] acredita el alcance A+B.
- Relación omitida, null, malformada o ID contradictorio: imagen desconocida,
  no se promueve a general ni se recupera de variant.images.
- Variante ajena al producto no admite fotos específicas.
- URLs iguales no determinan asociaciones. Se deduplica por ID; los IDs duplicados
  con relaciones/URLs contradictorias se retienen fuera de la galería.
- Orden: generales por rank, luego específicas aplicables por rank.
  Empates conservan el orden recibido. Thumbnail no altera ese orden.
- Un thumbnail aislado de producto o variante no acredita alcance ni introduce
  fotos extra. El carrito conserva la primera imagen de la misma galería segura,
  o null. Puede ser general si el producto tiene generales.
- Se conserva la reserva de espacio y miniaturas para no saltar al cambiar selección.

Los tipos HTTP 2.13.1 instalados no declaran images.variants. Se valida esa extensión
opcional localmente, sin modificar dependencias ni tipos globales.
No se infieren vínculos por nombre, URL, metadata o frecuencia entre variantes.

## Pruebas y reproducción

tests/variant-product-media.test.mjs usa imágenes sintéticas con enlaces explícitos
y, deliberadamente, variant.images mezcladas con generales como hace Medusa.
Cubre generales, específicas A/B, compartidas A+B y A+B+C, varias generales,
variante sin específicas, ausencia total, relación desconocida, orden, duplicados,
thumbnail, misma selección en carrito/WhatsApp y query de detalle aislado.
qa/variant-media/server.mjs reproduce los estados con diagramas que dicen
PRUEBA QA; no son fotografías ni empaques. Rechaza escrituras y no usa Medusa.

La matriz de resultados de tests, TypeScript, lint, build, navegador y CI del
HEAD corregido se registra en el cuerpo de la PR. Las evidencias anteriores
del commit 6cd8945 no sustituyen esa nueva validación.
Los manifiestos de integridad solo actualizan el hash autorizado de
src/lib/data/products.ts por el field corregido; no se elimina ninguna protección.

## Límites y riesgos pendientes

No se cargaron fotografías, asociaciones, productos ni variantes reales.
Sin datos KÜÜL hardcodeados, precios modificados, env vars o infraestructura.
La Preview de esta rama requería configuración pública de lectura en la revisión
anterior; no se modifica aquí. Debe revisarse el despliegue nuevo, no inferir éxito
del HTTP 200 ni del estado READY si el contenido muestra un error.

Falta validar una respuesta real con asociaciones generales + específicas +
compartidas y URLs compatibles con Next Image. Un backend que omita la expansión
dejará esas imágenes fuera de la galería; si rechaza el field, aplica el error
de catálogo existente. No se oculta ni se sustituye por heurísticas.

No merge ni producción. La validación con media real y cualquier operación
de asociación requieren su alcance autorizado independiente.
