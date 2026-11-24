# Diagnóstico de catálogo en Preview y revisión del mensaje de envíos

24 de noviembre de 2026. Línea técnica independiente de la dirección fotográfica del PR #42. **Solo diagnóstico y propuesta, sin cambios de código ni configuración.**

## Resultado

La configuración de Vercel no asigna `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` a las ramas de los PR #40, #41 y #42. La URL del backend sí tiene ámbito común Production/Preview. La clave publicable de Production sí existe en su ámbito. Hay asignaciones de clave para otras ramas Preview, pero ninguna general ni específica aplicable a estas tres. Se inspeccionaron únicamente nombres y ámbitos con `decrypt=false`: no se descifraron valores ni se copiaron claves.

Esta diferencia explica la caída conjunta de marcas y destacados. La Store API exige el encabezado de clave publicable incluso para consultas públicas de catálogo. Se corroboró con dos GET de solo lectura sin clave contra el origen público que aparece en el JavaScript productivo: tanto `/store/regions?limit=1` como `/store/products?limit=1&fields=id,title,handle` devolvieron **400**, tipo `not_allowed`, mensaje que exige `x-publishable-api-key`. No fue 401 ni se trató de una respuesta vacía de catálogo.

### Cadena causal en el código vigente

1. `src/lib/medusa.ts` construye el SDK con `process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`.
2. `getProducts()` en `src/lib/data/products.ts` primero llama a `getMexicoRegion()` en `regions.ts`. Sin clave, la consulta regional falla antes de llegar a los productos.
3. `getPublishedBrandOptions()` en `src/lib/data/brand-navigation.ts` obtiene marcas del conjunto de productos publicados. Ante excepción devuelve `brands: []` y `unavailable: true`.
4. `BrandsShowcase.tsx` no utiliza el indicador `unavailable`; presenta solo «Explorar el catálogo». Son accesos textuales de marca, **no un carrusel de logotipos**. La falta observada era de datos, no de archivos de logos.
5. `FeaturedProducts.tsx` captura la excepción y muestra «No pudimos cargar esta selección».

No hay diferencias entre main productivo y la base #41 en los cinco archivos anteriores de SDK, productos, navegación de marca y los dos componentes. El banner no cambió esta lógica. Es una falla de configuración por ámbito, reproducible sin clave; no se observó una regresión del layout. Las consultas iniciales ocurren del lado servidor: no hay evidencia de que CORS sea la causa de este síntoma. No se evaluaron todos los usos de catálogo desde el cliente.

## Comparación comprobada

| Evidencia | Producción | Preview #42 |
| --- | --- | --- |
| Commit observado | `1f4d8f2f661d8df056c0f559c4f948133e0a5052` | `c2b01fe504c590815c425a89188b69b0abe5d18a` |
| Marcas visibles | 7 accesos | 0 marcas, 1 enlace de recuperación |
| Destacados visibles | 8 tarjetas | 0 tarjetas, estado de recuperación |
| URL backend con ámbito aplicable | Sí | Sí |
| Clave publicable con ámbito aplicable | Sí | No |
| Mensaje DHL | Presente | Presente |

Ramas Preview sin asignación aplicable: `design/home-real-photo-hierarchy-20261123`, `design/banner-belleza-real-preview-20261124`, `codex/evolucion-visual-banner`.

Producción fue comprobada directamente en [sicarubeauty.com](https://www.sicarubeauty.com/); Preview mediante la sesión de navegador existente en [deployment #42](https://sicaru-ne0dhfgzi-sicaru-admins-projects.vercel.app/qa/banner-belleza-real), sin enlaces temporales ni modificaciones de permisos. Último despliegue Production confirmado READY: `dpl_6pdQgoakj37wfCBeZLWEwxd72fv1`. La presencia de productos en producción no equivale a existencias o precios aprobados.

[Captura completa de producción](produccion.jpg) · [Captura completa de Preview](preview.jpg).

Los logs Vercel de los últimos 15 minutos consultados devolvieron telemetría web; no aportaron el error de catálogo. El código captura esos errores sin registrarlos. Una primera consulta de una hora excedió la retención admitida y se reintentó con ventana reciente. No se interpreta ausencia de error en esos logs como prueba de éxito. La atribución se apoya en ámbitos, código idéntico, observación de ambas páginas y reproducción HTTP sin clave. No se leyó un volcado de variables del proceso desplegado ni se afirmó haberlo hecho.

## Solución propuesta, NO aplicada

La corrección real requiere configuración de Preview; no existe un cambio puramente visual que sustituya la clave exigida por Medusa.

1. En una etapa autorizada, el responsable del entorno debe confirmar cuál es la clave publicable **ya existente y aprobada** para leer el catálogo y su canal de ventas. No crear ni rotar claves por este incidente, ni sustituirla por un token administrativo.
2. Asignarla solo a las ramas Preview necesarias, manteniendo valores y ámbitos de Production intactos. No copiar todas las variables de producción, pagos o servicios. No ampliar por defecto a todas las Preview.
3. Reconstruir únicamente las Preview seleccionadas: cambiar variables no modifica los deployments existentes, y `NEXT_PUBLIC_*` se incorpora durante build. Conservar SSO/noindex y modo catálogo.
4. Verificar que regiones/productos responden correctamente y que marcas/destacados se reconstruyen a partir de productos publicados. No exigir permanentemente siete marcas u ocho tarjetas: son observaciones de hoy, no reglas de inventario.
5. Comprobar búsqueda, ficha, variante exacta y consulta WhatsApp sin enviar mensajes; confirmar ausencia de cobros, pedidos y cotizaciones automáticas. Revisar navegador y servidor por separado. Si se reportan errores posteriores, diagnosticarlos sin dar por hecho que esta única corrección los resuelve todos.
6. Reversión acotada: retirar únicamente la nueva asignación de la rama Preview y volver al deployment anterior; nunca tocar Production para revertir esta prueba.

Mejora de diagnóstico opcional para otro cambio: señalar explícitamente indisponibilidad temporal en marcas y registrar un código técnico saneado en servidor, sin claves, headers completos ni datos personales. Mantener la recuperación en pantalla; no esconder el problema con marcas/productos hardcodeados, precios inventados, fixtures presentados como catálogo real o respuestas administrativas.

**Estado actual:** sin remediación aplicada; se respeta la instrucción de no modificar credenciales ni configuración sensible. Este informe no declara solucionada la carga real.

## Revisión del mensaje «Envíos por DHL a México»

El texto es visible en producción y Preview. La integración no está habilitada según la propietaria; el modo catálogo además conserva los bloqueos de pagos/pedidos. La frase puede interpretarse como disponibilidad confirmada de un transportista y cobertura nacional. La existencia de componentes o textos históricos no demuestra operación habilitada. No se hicieron cotizaciones, llamadas a DHL ni pruebas de pedidos reales.

### Corrección propuesta

**Inicio y recordatorios breves:**

> Consulta opciones de envío, cobertura y costo por WhatsApp antes de confirmar tu pedido.

**Página de envíos:**

- Título y H1: «Consulta de envíos | SICARÚ» / «Consulta de envíos».
- Texto: «Escríbenos por WhatsApp para consultar opciones de envío a tu destino. Te confirmaremos cobertura y costo antes de confirmar tu pedido.»
- Aclaración: «Los pedidos y pagos en línea aún no están habilitados.»
- CTA: «Consultar envío por WhatsApp».
- Meta description: «Consulta por WhatsApp las opciones de envío, cobertura y costo a tu destino antes de confirmar tu pedido con SICARÚ.»

**Contacto:** «Escríbenos para consultar productos, disponibilidad, precio y opciones de envío.»

**Carrito:** «Opciones de envío · Consulta por WhatsApp».

**Enlace en términos:** «Consulta de envíos».

No se promete transportista, cobertura nacional, tarifa, entrega garantizada ni una integración automática. La falta de integración tampoco demuestra que no exista algún envío manual: por eso se propone consultar opciones, sin afirmar indisponibilidad total del servicio.

### Lugares que deben corregirse juntos, tras aprobación del texto

- `src/components/home/WhatsAppBanner.tsx`
- `src/components/checkout/ShippingInquiryHint.tsx`
- `src/components/checkout/ShippingNotice.tsx`
- `src/app/(shop)/carrito/page.tsx`
- `src/app/(shop)/contacto/page.tsx`
- `src/app/(shop)/envios/page.tsx` (metadata incluida)
- `src/app/(shop)/terminos/page.tsx` (enlace)

Ninguno se modificó. Aplicar el texto en un cambio comercial separado, conservando el checkout bloqueado y las condiciones no autorizadas fuera de la interfaz.

## Validación y fuentes

Lecturas de navegador, SDK/código y metadatos Vercel; dos GET sin clave. `git diff` confirma ausencia de cambios de aplicación. No se ejecutaron pruebas de pagos ni inventario; no se repitió build/lint por un informe documental. No hay contenido sensible en los adjuntos.

- [Medusa Store API · Publishable API Key](https://docs.medusajs.com/api/store#publishable-api-key)
- [Vercel · Environment variables](https://vercel.com/docs/environment-variables)

La documentación respalda el mecanismo de claves y ámbitos; el diagnóstico específico de SICARÚ procede de las comprobaciones de esta sesión. La línea fotográfica se mantiene en el PR #42, sin mezclarla con este diagnóstico.
