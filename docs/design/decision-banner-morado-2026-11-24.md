# SICARÚ · Banner morado: decisión visual y requisitos de fotografía

**Fecha:** 24 de noviembre de 2026  
**Estado:** composición móvil agradable para la propietaria y autorizada **solo para seguir explorando en Preview**. No hay autorización para publicar. La fotografía no está aprobada como imagen definitiva.

## Evidencia revisada
- Maquetas independientes preparadas para conversación: `sicaru_320_refinada.png`, `sicaru_celular_refinada.png` (390 px) y `sicaru_escritorio_refinada.png` (1440 px). No equivalen a capturas del deployment #44 ni certifican catálogo conectado.
- PR #44, branch `design/banner-morado-en-pagina-preview-20261124`: ruta privada `/qa/banner-morado`, imagen conceptual B de Codex, texto y CTA reales del sitio, categorías PR #40 reutilizadas.
- El retrato usado en las maquetas de conversación mide **600 × 680 px**: sirve para juzgar composición, no garantiza nitidez suficiente en escritorio/Retina. El arte del PR #44 **no es la misma fotografía** que la maqueta agradable para la propietaria. No presentar ambos como versión idéntica.
- Vercel aprobó la compilación del commit `a026a9f18ee928460491c0387869ee5b69d95989`. Eso **no certifica** aceptación visual ni QA manual del catálogo.

## Qué conservar
1. Fondo morado profundo localizado en el hero y superficies claras en categorías.
2. Jerarquía texto → propuesta de valor → CTA `Explorar productos`, sin rayas o iconos decorativos que compitan.
3. Fotografía a todo el ancho bajo el mensaje en móvil. Separar texto y cabello, sin superposición.
4. Evitar un hero tan alto que esconda todas las categorías en el primer recorrido; comparar 320, 375, 390, 768 y 1440 px.
5. Mantener la tienda **multimarca**; no atribuir todos los productos a SICARÚ ni crear etiquetas.

## Requisito antes de fotografía final
- **Identidad:** imagen actual, luminosa y poderosa; belleza mexicana auténtica y diversa sin asumir nacionalidad por apariencia.
- **Movimiento:** cabello y gestos creíbles, textura visible, naturalidad de piel; evitar halos, artificialidad y blur.
- **Dos encuadres reales:** horizontal para escritorio y vertical para móvil. No depender de un solo recorte lateral.
- **Calidad:** master horizontal de al menos 3000 px de ancho y vertical de al menos 1800 px. Evaluar nitidez al tamaño real y pantallas de alta densidad.
- **Fidelidad:** no incrustar textos, logotipos ni precios en la fotografía; el texto y el botón deben seguir siendo HTML accesible.
- **Derechos:** origen identificado y permiso/licencia comercial, consentimiento de modelo si corresponde, usos y periodo documentados.
- **Entrega web:** exportar derivados optimizados tras verificación visual, con dimensiones explícitas, compresión y análisis de LCP/CLS.
- **Aprobación:** propietaria revisa ambas variantes dentro de Preview y autoriza expresamente la fotografía antes de integrarla en la home real.

## Validaciones antes de una propuesta de publicación
- Comprobar HTML, teclado, contraste y visibilidad de botones.
- Revisar recorte de rostro y cabellera a 320, 375, 390, 768 y 1440 px; obtener capturas verificadas de la Preview **sin ampliar permisos Vercel**.
- Resolver clave publicable de Medusa para Preview **solo tras autorización específica**, según diagnóstico PR #43, y verificar búsqueda, marcas, destacados, variantes y enlace de consulta por WhatsApp. La foto no debe usarse para ocultar fallos de datos.
- Corregir promesas sobre DHL en PR comercial independiente antes de publicar; no anunciar envío automático.
- Mantener `main`, variables, precios, inventario, cobros y envíos sin modificaciones. Cualquier publicación o merge requiere autorización explícita.

**Conclusión:** se aprobó explorar la composición, **no** una imagen ni una publicación. El siguiente cuello de botella comercial del banner es una fotografía auténtica con calidad y derechos suficientes, no otra ronda de decoración CSS.

## Aprobación de corrección cromática — 24/11/2026
- La propietaria aprobó visualmente la propuesta cromática basada en `#7F6D8A` (morado profundo), con fondos de apoyo `#9B89A8`, marfil `#FAF8F5` y texto oscuro `#2E2B2B` fuera del hero.
- Implementado **solo en la ruta experimental** `/qa/banner-morado`: el fondo del panel de texto usa exactamente `#7F6D8A`; el área de la fotografía usa `#9B89A8`; se quitó la gradación accidental `#49314B`/ciruela.
- Para texto pequeño sobre `#7F6D8A`, usar `#FFFFFF` (aprox. 4.71:1); el marfil `#FAF8F5` da aprox. 4.44:1 y no alcanza WCAG AA para texto normal.
- **Limitación explícita:** la fotografía limpia que aparece en la maqueta cromática está alojada como imagen generada en la conversación y **no se ha importado al repositorio**. La Preview sigue usando la lámina antigua `sicaru-textura-en-libertad-concepto.png`, con problemas ya identificados. Por eso la Preview solo valida **fondo/texto y estructura**, no la imagen que gustó.
- La fotografía creada para la maqueta mide 1774 × 887 px y no cumple aún el master horizontal ≥3000 px ni existe un master móvil independiente ≥1800 px. No se deben aplicar upscalings que se presenten como detalle real.
- **No publicar, no fusionar** hasta resolver archivo maestro, modelo visual, fotografía definitiva, logo, mensajes de envío y QA integrado. Mantener intacta producción.
