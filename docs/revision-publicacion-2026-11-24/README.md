# Publicación del Inicio · Revisión detenida antes del merge

24 de noviembre de 2026. Autorización de la propietaria: publicar la composición morada aprobada **solo después** de satisfacer todas las condiciones de imagen, logo, tienda, pruebas e integración. Si aparece un bloqueo, conservar producción intacta. **No se hizo merge ni publicación parcial.**

## Estado y referencias comprobadas

- Production READY: `dpl_6pdQgoakj37wfCBeZLWEwxd72fv1`, SHA `1f4d8f2f661d8df056c0f559c4f948133e0a5052`.
- PR #40 draft: categorías aprobadas, `bf6a44695d26cfe6fa1671fa349fad13fea57136`.
- PR #41 draft, apilado en #40: `4f8747fcca21d4bebb7eb20e3710af80c7786392`.
- PR #42 draft, apilado en #41: `363e4fc344514897940dcff71e94e1033568a4b8`.
- PR #44 draft, apilado en #42: `18fe6475b41bd281f0fb5f8ca1b1fdc1fd0d9c6e`; Preview comprobada `dpl_4m19jAxwMPSKpnYFvcJkgKpU7s2J`, URL `https://sicaru-3a2epfj87-sicaru-admins-projects.vercel.app/qa/banner-morado`.
- PR #45 draft independiente: mensajes de envíos, `ed54882`; **no fusionar/publicar parcialmente**.

Las indicaciones históricas de «no aprobado» de #44 quedan actualizadas por la aprobación condicionada más reciente: la composición morada está aprobada; ello no elimina los requisitos pendientes de calidad/limpieza del asset, corrección del logo y validación final.

## Bloqueo visual de fotografía

El único origen exacto localizado es la lámina generada de 1672 × 941 px. Su SHA-256 `6dc94ad0b47666252bc4d8403835130366bd14e1685afa111d66dd458a070a68` coincide en los tres lugares:

1. `public/images/preview/sicaru-textura-en-libertad-concepto.png` de #44.
2. `docs/design/direccion-fotografica-v2/b-textura-en-libertad.png` de #42.
3. Salida original de `image_gen` de esta conversación, archivo `exec-762d959f-5f56-4f53-9a5b-539fcdda5034.png`.

Se generó con un prompt textual y persona ficticia, sin referencia de una modelo real ni fotografía rechazada. **Es una imagen sintética, no una sesión fotográfica.** Se comprobó la procedencia mediante coincidencia del archivo, no por semejanza visual.

La lámina incluye títulos y dos fotografías. El panel vertical limpio aprovechable mide aproximadamente **549 × 816 px**. El panel horizontal mide aproximadamente **1087 × 816 px**, pero ya deja parte de los rizos al borde/cortados. No se localizó otro master limpio de mayor tamaño. Quitar el texto y separar los paneles no recupera detalle ni cabello que no están en la fuente. La diferencia entre el retrato de la maqueta anterior y este concepto también está documentada en `docs/design/decision-banner-morado-2026-11-24.md`.

Ese documento del PR #44 pide masters horizontal ≥3000 px y vertical ≥1800 px, encuadres completos y revisión de nitidez. El origen localizado no satisface esos criterios de fotografía final. **La publicación se detiene por calidad/encuadre, sin generar una persona nueva, reconstruir cabello, ampliar artificialmente ni sustituir la fotografía aprobada.** Los avisos internos no se retiraron del deployment porque hacerlo y publicar esa fuente como fotografía final no resolvería el bloqueo.

### Base de uso del resultado sintético

Se consultaron los [Términos de uso de OpenAI](https://openai.com/policies/row-terms-of-use/) y el [Acuerdo de Servicios, sección 4.1](https://openai.com/policies/services-agreement/), vigentes consultados en esta revisión. Ambos asignan al usuario/cliente, en la relación con OpenAI y según la ley aplicable, los derechos de OpenAI sobre el resultado. No son una garantía de exclusividad o ausencia de derechos de terceros. No se atribuye una licencia de fotógrafo ni un consentimiento de modelo real a un resultado sintético.

La procedencia de esta salida está comprobada. Esa base contractual no convierte la lámina en un master de calidad ni acredita el retrato distinto de la maqueta anterior. No se presenta una declaración jurídica general de derechos sobre cualquier fotografía. El desbloqueo visual requiere el master limpio de la imagen aprobada; si no existe, cualquier alternativa requiere decisión de la propietaria, sin sustitución automática.

## Logo: revisión pendiente, sin recreación

`src/components/layout/BrandWordmark.tsx` renderiza «SICARÚ» como texto. No es la aplicación del archivo gráfico oficial solicitada para esta publicación.

Los originales `public/brand/logo-dark.png`, `logo-cream.png` y `logo-violet.png` miden 1600 × 993 px e incluyen símbolo curvo y descriptor. Su proporción completa debe conservarse; no se deben cortar esos elementos tratándolos como márgenes vacíos ni recrear el nombre con una tipografía. La corrección responsive aún no está terminada/validada, y no se publicó un cambio parcial del encabezado. Una variante horizontal oficial facilitaría el aumento de presencia manteniendo el encabezado móvil compacto.

## Tienda real: comprobaciones completadas en Preview #44

Acceso mediante sesión de navegador existente, sin enlaces temporales ni ampliación de permisos. No se cambió ninguna variable/credencial.

- Siete marcas y ocho destacados visibles; la recuperación del catálogo queda comprobada para esa Preview en ese momento. No son contadores permanentes de inventario.
- Búsqueda del encabezado «Voglia» navega a `/productos?q=Voglia` y muestra dos resultados.
- Tarjeta y ficha de Voglia Tinte Permanente 90ml: selección de `7.35 Rubio medio dorado caoba`; el enlace WhatsApp contiene producto, variante y SKU `VOGLIA-TINTE-7-35-90ML`. No se pulsó el enlace ni se envió mensaje.
- Ficha con 23 tonos; algunos recursos de producto muestran estado de fotografía no disponible. No se inventaron ni cambiaron fotos de producto para ocultarlo.
- Categorías tratamientos, coloración, herramientas y acceso `/salon-pro` renderizan sus H1 correspondientes, sin pantallas 404/500.
- Carrito abierto en estado vacío. No se afirma haber validado en navegador un carrito conectado con ítems ni el flujo completo del carrito informativo.
- `/checkout` muestra el bloqueo «Los pedidos y pagos en línea aún no están habilitados.» Sin solicitudes de pago, cotización automática ni creación de pedidos.
- **Sigue pendiente aplicar la corrección DHL:** la Preview #44 aún muestra la afirmación en Inicio, catálogo/ficha y checkout. PR #45 la retira en el cambio independiente; no se fusionó.

Resultados saneados: `catalogo-preview.json`, `flujo-preview.json`. Cinco capturas de la Preview actual: 320/375/390/768/1440. Muestran el estado pendiente de corregir, **no un candidato final aprobado**.

## Ámbito Medusa

La lectura de metadatos con valores ocultos confirmó asignación Preview específica de `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` para `design/banner-morado-en-pagina-preview-20261124` (envId `zITAPUGVcpmSlXyg`). No se amplió a #42, a la rama de mensajes ni a otra rama. Production no se modificó. No se leyó/cambió el valor de la clave.

## Integración y reversión preparadas, NO ejecutadas

No es seguro fusionar en bloque #40 → #41 → #42 → #44: además del cambio aprobado, arrastraría laboratorios, láminas conceptuales y documentación experimental. Cuando se resuelva la imagen, preparar un PR de integración desde el main productivo vigente con una lista explícita de archivos: categorías aprobadas de #40, hero aprobado derivado de #44 sin avisos/arte conceptual, logo oficial responsive y corrección de mensajes de #45. Mantener fuera del diff las rutas de laboratorio, láminas, configuraciones y funciones no autorizadas. Comparar hashes del resto del código y ejecutar QA sobre el mismo candidato que se fusionaría.

Se generó y verificó respaldo Git local completo del estado productivo: `/private/tmp/sicaru-produccion-1f4d8f2-20261124.bundle`, referencia `origin/main` a `1f4d8f2f661d8df056c0f559c4f948133e0a5052`. El deployment productivo anterior sigue disponible. Conservar el bundle en un destino duradero antes de una futura operación de merge.

Reversión futura, si llegara a publicarse el candidato completo y fallara: restaurar el deployment productivo registrado mediante el mecanismo autorizado de Vercel, comprobar dominio/commit, y revertir exclusivamente el commit de integración en Git mediante PR. No cambiar variables, inventario o backend para revertir una publicación visual. Registrar antes de ejecutar IDs y SHA actuales; el respaldo de hoy no sustituye esa comprobación.

## Validación y trabajo no completado

El PR #45 independiente pasó build, TypeScript, 112 pruebas Node y lint sin errores (tres warnings preexistentes); tiene revisión local de textos y bloqueos. **Eso no acredita la publicación del Inicio.**

No existe un candidato final completo y validado para merge. No se declaran aprobados el logo nuevo, foto limpia final, rendimiento/Lighthouse, Safari/WebKit, pruebas finales sobre la integración ni verificación postproducción. Se detuvo el proceso antes de completar esas fases por el bloqueo visual. No se ocultan ni sustituyen esos pendientes con un build anterior READY.

Se iniciaron preparativos locales aislados en `/private/tmp/sicaru-inicio-release`, rama `codex/inicio-publicacion-limpia`; no se subieron ni se proponen como versión lista. La revisión del logo oficial y del master impidió considerar esos preparativos un candidato final. El checkout original con cambios ajenos quedó intacto.
