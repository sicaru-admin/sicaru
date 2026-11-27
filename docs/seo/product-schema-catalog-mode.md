# Product rich results en modo catálogo

Fecha: 4 de noviembre de 2026. Base: `837e43137fab23e1a9a6aa6109352497921d4baf`.

## Diagnóstico previo

`generateProductSchema` era el único generador de `Product` del runtime. La ficha
lo serializaba siempre, mientras que `offers` se añadía únicamente fuera de
`CATALOG_MODE`. No había `review` ni `aggregateRating`. Una lectura pública HTTP
200 de `/productos/kuul-color-system-cream-3oz` confirmó los nodos Store/LocalBusiness,
Product sin esas tres propiedades, BreadcrumbList y FAQPage.

Esto incumple los requisitos de elegibilidad de Product snippets de Google; no
demuestra por sí mismo desindexación o una penalización. Fuera de catálogo se
utilizaba el precio calculado de la primera variante sin comprobar su aprobación.
FAQ y metadata de precio compartían esa lectura fuera de catálogo.

## Solución elegida

Omitir completamente el nodo Product en catálogo (opción A). Añadir WebPage
(opción B) sería posible, pero no hace falta para resolver esta incidencia;
anidar un Product incompleto dentro de otro schema conservaría el problema.
No se añaden ofertas, reseñas o valoraciones ficticias (opción C).

El generador devuelve `null` en catálogo y la ficha lo excluye del array JSON-LD;
no se serializa un nodo nulo. Fuera de catálogo conserva Product + Offer cuando
`getApprovedPrice` valida la aprobación explícita de la variante canónica y un
importe numérico, finito y no negativo. Sin oferta aprobada tampoco se emite un
Product incompleto. No se busca otro precio ni se hereda aprobación.

FAQ y metadata OpenGraph/precio reutilizan la misma regla, dentro de los dos
archivos SEO afectados. En catálogo no leen precios calculados para esas
superficies. No se cambia el precio ni su aprobación en ninguna fuente.

BreadcrumbList y FAQPage permanecen en las fichas. Store/LocalBusiness se conserva
en el layout shop y WebSite en Inicio, donde ya se emitía; no se duplica WebSite
en cada ficha. Se conserva el serializador JsonLd compartido, imágenes OpenGraph,
títulos y descripciones. No se modifica el contenido visual, carrito, WhatsApp,
checkout, pagos, envíos, backend, variables persistentes o infraestructura.

## Validaciones locales ejecutadas

- Suite completa: 69/69 PASS, incluidas nueve pruebas de regresión SEO.
- Lint: cero errores; tres advertencias preexistentes fuera del diff.
- TypeScript: PASS (`--noEmit --incremental false`).
- Build: PASS, con API sintética de solo lectura en loopback.
- HTML HTTP de dos fichas sintéticas en catálogo: 200 y H1; exactamente
  Store/LocalBusiness, BreadcrumbList y FAQPage; cero Product/Offer/review/rating,
  sin metatags de precio ni importe no aprobado en HTML visible.
- Inicio compilado: un Store/LocalBusiness y un WebSite.
- Modo comercial mediante HTML SSR con módulo de modo y backend simulados:
  Product + Offer para la variante exacta aprobada; sin aprobación, flags de
  producto/otra variante, string `"true"`, importe ausente, no numérico, infinito
  o negativo, no se publica precio en Product, FAQ ni metadata.
- Un importe cero explícitamente aprobado conserva la regla monetaria vigente.
- Getters que fallan al leer precio demuestran que los generadores SEO en
  catálogo no acceden al precio calculado.
- El fixture local no se conecta a Medusa y rechaza métodos de escritura.

Los datos de prueba son sintéticos. No se habilitó el modo comercial de ningún
entorno operativo para probar la rama alternativa. Las variables usadas para
apuntar al fixture son exclusivas del proceso local, sin editar `.env` ni Vercel.

## Riesgos y límites

En catálogo la página deja de solicitar Product rich results intencionadamente;
su HTML visible y los demás schemas siguen disponibles. No cambia robots,
canonical, sitemap o indexabilidad. El generador es nullable y su único consumidor
runtime queda adaptado y cubierto por pruebas.

La validación local/Preview no demuestra que Search Console haya actualizado el
informe. Después de una futura publicación autorizada debe comprobarse el HTML
público, utilizar inspección de URL/Rich Results Test y solicitar validación del
problema cuando corresponda. Google necesitará volver a rastrear las fichas; no
se promete un plazo ni la aparición de resultados enriquecidos.

## Fuentes oficiales

- [Google: Product snippets](https://developers.google.com/search/docs/appearance/structured-data/product-snippet)
- [Google: directrices de datos estructurados](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Google: solicitar nuevo rastreo](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)

El paquete Next.js 16.1.6 instalado no incluye `node_modules/next/dist/docs`.
Se consultó la [guía oficial JSON-LD de Next.js](https://nextjs.org/docs/app/guides/json-ld)
y se mantuvo el patrón existente de scripts en página/layout.

Estado de entrega: PR y Preview sujetos a revisión. Sin autorización de merge
ni publicación en producción.
