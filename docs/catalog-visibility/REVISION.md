# Catálogo fresco · compañero del PR mínimo Store API-only

16 de noviembre de 2026, America/Monterrey. Base productiva y main: `d8f030ff4e1e9dcdbbd0e08c015884694c5bc693`. Rama `codex/catalog-visibility-cache`, independiente de #30 y sin imágenes Fantasy Nails. No modifica precios, stock, checkout, pagos, contenido visual ni versiones de dependencias.

## Solución preparada

- Layout de tienda force-dynamic + force-no-store + revalidate=0: HTML, RSC, metadatos, categorías, marcas, listados y fichas se resuelven con datos frescos. Sitemap mantiene force-dynamic y añade force-no-store. No se alteran los helpers SDK de precios/productos ni las reglas comerciales protegidas.
- POST /api/revalidate acepta sólo scope=catalog, con HMAC-SHA256 sobre timestamp + cuerpo exacto; secreto privado CATALOG_REVALIDATION_SECRET de al menos 32 caracteres, ventana de 60 s, comparación constante y máximo real de 256 bytes. Sin configuración responde 503, firma inválida 401. No acepta rutas del llamador. Invalida el layout raíz y sitemap; reintento seguro. No se acepta el contrato anterior de secreto en body/path arbitrario; no se encontró un llamador automático del contrato anterior en producción. Revisar consumidores externos antes del release.
- BrowserCacheReset conserva la limpieza de Service Worker/CacheStorage, cambia su versión y renueva el router al volver visible/online, pageshow y popstate. No borra carrito, sesión de compra ni localStorage. No añade sondeo periódico ni servicio nuevo.
- La lectura fresca es la garantía principal: un webhook perdido o no configurado no debe devolver una ficha retirada en una nueva solicitud. El subscriber compañero del backend notifica cambios opcionalmente, sin exponer ID ni datos del producto en el cuerpo. Los eventos no son transaccionales con Vercel; no se promete entrega garantizada con el event bus existente.
- vercel.json sólo añade git.deploymentEnabled=false para esta rama de revisión. No modifica main, cabeceras, regiones ni configuración de infraestructura activa. Evita crear una preview automática al preparar el PR; no sustituye autorización para desplegar manualmente. [Configuración oficial](https://vercel.com/docs/project-configuration/git-configuration).
- Los hashes protegidos originales NO se sustituyen. Dos pruebas permiten exclusivamente ese objeto git exacto y verifican que el resto de vercel.json siga coincidiendo con el hash original. Cualquier otro cambio, incluso cabeceras o ramas habilitadas, falla.

## Pruebas y alcance

Ensayo con build/start reales de **Next 16.1.6**, React/SDK de la instalación fijada del proyecto y navegador Chromium. Store API sintética en memoria, exclusivamente loopback, con un producto publicado que luego pasa a draft, un publicado que permanece y un draft nunca publicado. La mutación es sólo del fixture en memoria; no usa Medusa ni PostgreSQL de producción ni crea registros.

- 34 comprobaciones del navegador/HTTP pasaron.
- HTML y RSC de inicio, catálogo, categoría y marca: publicado presente antes; retirado y draft nuevo ausentes después, incluso ANTES de notificar invalidación. El publicado restante sigue visible.
- Ficha HTML/RSC: retirada semánticamente como no encontrada; ninguna ficha del draft nuevo. En streaming Next puede responder HTTP 200 con noindex/digest 404: se comprueba el estado semántico y ausencia de datos, no se considera suficiente el status HTTP.
- Sitemap: contiene el publicado al inicio y lo retira después; nunca incluye el draft nuevo.
- Invalidación real: rechaza petición sin firma, expirada, scope arbitrario y tamaño excesivo; firma válida y repetición segura responden 200/no-store. Prueba de unidad adicional: secreto ausente, firma inválida y alcance fijo; no se invalida nada en esos rechazos.
- Navegador: una pestaña que mostró el publicado renueva al evento online; el retorno por historial no restaura la ficha retirada; catálogo móvil conserva el publicado correcto sin drafts. No se solicitan pagos ni escrituras al backend.
- Caída del origen: listado y ficha muestran estado neutral, sin datos anteriores de productos. Las respuestas observadas son private/no-cache/no-store.
- Suite completa: 112/112 pruebas; pruebas afectadas de invalidación/archivos protegidos: 20/20. Lint completo sin errores, con tres advertencias existentes de img y variable no utilizada; lint del alcance sin advertencias ni errores. TypeScript y build correctos. Las pruebas nuevas se integran al CI existente, sin servicios externos nuevos.

El primer CI pasó las 34 comprobaciones nuevas, pero la prueba PWA existente seguía quitando el identificador de caché de la versión anterior. Se actualizó sólo la preparación para leer el identificador real del código; las expectativas de limpieza y conservación del carrito no se relajaron.

El primer ensayo reutilizó Next 16.4.3 y no se tomó como evidencia suficiente de producción; se repitió con 16.1.6. Se descartó una propuesta de modificar cabeceras públicas para conservar la configuración protegida; la única excepción final de vercel.json impide despliegue de la rama. No se relajaron hashes comerciales ni se cambiaron expectativas para ocultar fallos.

Evidencia final: evidencia/browser.json y evidencia/unit.log. El runtime/build completo se conserva localmente en artifacts/catalog-visibility/. Los resultados por caso permiten revisar retiradas HTML/RSC y pérdida de entrega.

## Qué debe autorizarse antes de un release

1. Aprobar este SHA por separado del PR backend y #30. Las altas de drafts nunca publicados no necesitan esta modificación frontend si no existen colisiones históricas y se satisfacen todos los controles backend/bypass.
2. No publicar ni retirar productos previamente visibles hasta validar esta protección de extremo a extremo en el alojamiento autorizado. El ensayo local no certifica el CDN de Vercel ni cada navegador instalado. Configurar el mismo secreto privado en backend/frontend por el mecanismo autorizado; no pegarlo en PR/chat. El backend sólo debe llamar al destino autorizado, sin redirecciones.
3. Planificar un release NUEVO del código aprobado; no promover una preview vieja con páginas persistidas. Verificar en el destino HTML/RSC/sitemap y cabeceras de Vercel, ausencia de HIT/STALE con contenido retirado y que no se sirva un despliegue anterior mediante alias antiguo. No se ejecutó invalidación ni purga productiva durante este trabajo.
4. Garantía limitada a nuevas solicitudes y recuperación/navegación del cliente: no puede retractarse una captura, pestaña desconectada, HTML ya descargado o índice externo. No basta robots/noindex para controlar acceso. Imágenes y aprobaciones comerciales siguen separadas.
5. La paginación actual sigue limitada (100 en búsqueda, 50 en colecciones, límite de sitemap). No cambiarla ni introducir motor en este PR. Para un futuro catálogo mayor, cubrir paginación completa también en sitemap.

## Recuperación propuesta

No cambiar datos para recuperar una página. Ante un fallo de entrega, mantener renderizado fresco y reintentar la petición firmada dentro de su ventana; generar firma nueva si expiró. Si el origen falla, conservar la respuesta neutral y reparar la conexión, sin fallback a contenido anterior. Una firma correcta no garantiza que el CDN haya propagado un cambio: comprobar contenido tras el release.

Si falla el release, conservar el despliegue anterior mientras no haya una retirada pendiente y no hacer publicaciones nuevas. Después de retirar un producto, volver a una versión con páginas persistidas puede reexponerlo: preferir conservar no-store y parchear o una respuesta neutral. Cualquier rollback de alias/infraestructura requiere autorización; no es suficiente hacer rollback del backend. No reactivar Meili ni restaurar caches viejas como contingencia.

Este documento es preparación para revisión. No autoriza fusionar, desplegar, modificar Vercel/Railway, crear productos o publicar fotografías.
