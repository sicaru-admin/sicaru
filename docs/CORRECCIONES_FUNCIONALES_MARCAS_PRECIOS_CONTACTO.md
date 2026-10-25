# Correcciones funcionales — rama de revisión, sin publicar

Base: main 40056f3f6dd6b8a0ed8be858538ab749e8dfb84c. Rama codex/correcciones-marcas-precios-contacto. Solo Preview; no integrar ni publicar en producción sin revisión de la propietaria.

## Marcas: causa y solución

Lectura Store API de Medusa: HTTP 200, región MXN, 9 productos publicados, 0 colecciones. Los nueve productos tienen collection null. Cada consulta de handle kuul, voglia, nekane-capilar, hidra-color, xiomara, vitale y montis devuelve count 0. Por ello getCollectionByHandle devuelve null y la página anterior ejecuta notFound(); no fue un fallo del componente Link ni de permisos de lectura de productos.

No se crean colecciones ni se asignan productos. Los accesos se generan a partir del mismo conjunto de productos que /productos y solo anuncian búsquedas no vacías. Se reconoce metadata explícita o colección conocida; en ausencia de ellas se admite el prefijo exacto de la marca en el título publicado, nunca descripción o coincidencia aproximada. Los nueve títulos y SKU reales se verificaron manualmente contra la lectura pública. El enlace es una búsqueda funcional, no una colección simulada.

Resultados verificados: Küül 2; Voglia 2; Nekane Capilar 1; Hidra Color 1; Xiomara 1; Vitale 1; Montis 1. Home e índice usan enlaces directos /productos?q=…; las siete URLs anteriores /marcas/[handle] y el alias /marcas/nekane redirigen solo si existe resultado publicado. Si una marca no tiene productos se omite de los accesos; la URL heredada muestra explícitamente que no hay productos, con salida al catálogo. Fallas del backend producen estado de recuperación, no una promesa de surtido. Marcas relacionadas y badges/migas de producto usan búsquedas funcionales.

getCollectionByHandle permanece sin cambios: funciona de acuerdo con la respuesta real. Las colecciones no conocidas que sí existan conservan la ruta anterior. El descubrimiento envía al navegador solo opciones y enlaces, y solicita campos ligeros al servidor. Mantiene el conjunto actual de hasta 100 productos de /productos; no corrige la paginación pendiente ni cambia el buscador.

## Precios

ProductRelatedCard ya no usa el primer precio crudo como precio del producto. Si existe una sola variante se pide la misma validación; si hay varias sin selección, se muestra Consultar precio. ProductActions tampoco cotiza automáticamente la variante más barata antes de elegir.

PriceDisplay con una variante exige el producto y getApprovedPrice. La aprobación se verifica en la variante canónica del producto por ID, con storefront_price_approved === true; no hereda flags del producto ni acepta strings truthy. Sin aprobación, variante identificable o importe finito válido, no muestra importe. No se cambia ni se aprueba ningún dato de Medusa. Se conserva la ruta amount/currency de totales del carrito; no se modifica su cálculo ni su componente. StickyAddToCart pasa también el contexto de producto aunque no esté montado en las fichas actuales.

La lectura actual tiene 31 variantes, sin flags de aprobación. Por tanto, los nueve productos y relacionados deben mostrar Consultar precio. Los casos aprobados se prueban exclusivamente con fixtures locales.

## Contacto y afirmaciones

Se corrigen al WhatsApp oficial +52 828 113 6652 los enlaces anteriores de Privacidad, ContactFormClient, Blog, Términos, página offline y llms.txt. El auxiliar Next /api/contact solo cambia el número en la URL de respuesta; no cambia validación, registro, transporte o backend Medusa. No se envían mensajes en QA real.

El aviso de privacidad conserva literalmente datos del responsable, domicilio, correo y contenido jurídico: solo cambian teléfono factual y enlace. El domicilio/identidad legal, periodos, bases jurídicas, destinatarios, cookies y texto de derechos requieren revisión de la propietaria/asesoría legal. No se certifica ni se reescribe ese contenido.

Se retiran de descripciones/FAQ de marcas las afirmaciones no acreditadas de distribución autorizada, garantía de originalidad, liderazgo, país/fabricante, porcentajes de resultados, ingredientes o descuentos. Se conserva nombre/color de marca y consulta a productos publicados. Contacto deja de prometer atención inmediata. FAQ genérica de marcas evita prometer asesoría técnica o resultados.

Excepción protegida: el número antiguo en checkout/confirmacion no se modifica por la prohibición expresa de tocar checkout; esa ruta sigue protegida por modo catálogo. Queda pendiente para una revisión autorizada de checkout/contactos. No es un acceso habilitado de pedidos.

Inventario adicional de revisión editorial: los cinco artículos en content/blog contienen comparativas técnicas, tablas/precios orientativos, recomendaciones y algunas afirmaciones de compra/envío que no están sustentadas con fuentes en este trabajo. Se localizan para una revisión aparte; no se reescriben instrucciones técnicas ni se aprueban esos valores. Los enlaces de marca heredados quedan resueltos por las rutas seguras. Los enlaces a productos editoriales que no existen requieren validación por SKU, no reasignación por palabras.

## Fotografías: diagnóstico sin implementación

Ver DIAGNOSTICO_IMAGENES_POR_VARIANTE.csv: nombre exacto, producto/variante/SKU, URL y ausencia en origen por cada una de las 31 variantes. Ocho productos tienen thumbnail null y images []; no es un fallo de renderizado. Solo Voglia All in One Keratin 250ml declara imagen: su URL responde 200, PNG 1254×1254, 1.445.507 bytes y coincide por hash con public/images/products/voglia-all-in-one-keratin-250ml.png, conservada de la versión aprobada.

No hay otra correspondencia exacta de SKU/foto aprobada acreditada en el proyecto. Vitale Bifase Pro-Keratin no demuestra ser Vitale Keratina Profesional 500ml; Voglia Total Repair/Color Fun no son prueba de Voglia Tinte Permanente 90ml. No se asignaron fotos por marca o nombre aproximado. Para las ocho referencias se necesitan frontales autorizados del SKU/presentación y, donde corresponda, tono exacto; el material puede suministrarlo el fabricante o producirse con los productos reales. No se actualiza Medusa ni se cambia ningún asset.

## Catálogo móvil: propuesta, no aplicada

La estructura de ProductosContent, fotos y tarjetas permanece byte por byte igual a main, ver hashes protegidos. Se presentan captura actual y esquema visual compacto fuera del repositorio, señalados como propuesta no implementada. Idea: conservar búsqueda, reducir padding del encabezado, categorías con etiquetas cortas reconocibles en dos filas y contador/buscador cerca de resultados. No añade filtros por necesidades ni una sección al Inicio. Se requiere aprobación antes de modificar esa estructura.

## Alcance y pruebas

No se tocan checkout, pagos/pedidos, carrito, impuestos, inventario, envíos, backend Medusa/Railway, imágenes, hero, Conócenos o las etapas 2–3. Los hashes congelados desde main prueban estas restricciones. La antigua prueba de publicación excluye solo el helper de aprobación, BrandsShowcase y llms.txt autorizados ahora; están cubiertos por pruebas semánticas nuevas. CI ejecuta todos los tests .test.mjs además del navegador con fixtures.

Preview requiere la clave publicable existente, limitada a la rama nueva. No se cambian variables de Production ni se genera una nueva credencial. El build/QA local y la Preview deben distinguirse de datos reales de Medusa. Riesgo React #418 permanece abierto en #13; esta rama no pretende corregirlo ni ocultarlo.

## Cierre autorizado de enlaces editoriales (adenda de publicación)

La propietaria autorizó corregir los seis destinos inexistentes dentro de esta misma PR. Se conserva el resto del trabajo. Las rutas antiguas se comprobaron renderizando su pantalla: HTTP 200 por streaming no impide un encabezado 404. No se crean redirecciones.

- Voglia Tinte Permanente: el artículo describe un kit de 60 ml; el catálogo publica 90 ml con 23 variantes. No acredita el mismo SKU/presentación.
- Küül Color System: el texto describe 90 ml, la ficha es Color System Cream 3oz; sin SKU editorial no se acredita equivalencia exacta.
- Küül Cure Me Shampoo: no existe ficha publicada del shampoo.
- Vitale Keratina Brasileña: el nombre no acredita equivalencia con Vitale Keratina Profesional 500ml.
- Nekane Mascarilla Hidratante: no acredita equivalencia con Tratamiento Hidra Intenso 300ml.
- Küül Cure Me Tratamiento: no identifica SKU/presentación; no se equipara con Reconstructor 1L.

Se retiran las fichas enlazadas incorrectamente y los diez ProductEmbed con importes editoriales no aprobados. En su lugar se ofrecen los productos publicados de cada marca mediante las rutas verificadas. Las demás menciones pierden el enlace específico; solo se ajustan las frases inmediatas que prometían catálogo/línea completa y el cierre que prometía esas referencias. El resto de tablas, afirmaciones técnicas y contenido legal sigue pendiente de revisión, sin ampliación editorial en esta PR.

Las pruebas recorren todos los artículos públicos y sus destinos de producto renderizados, además de los accesos principales. Se añade una comprobación explícita de pantallas 404 con HTTP 200 y un inventario de handles publicado obtenido por lectura pública, sin precios ni existencias; ese snapshot debe actualizarse solo con datos verificados cuando cambie el catálogo. La validación remota repite el recorrido contra el catálogo real antes y después de publicar.
