# SICARÚ — Modern Beauty Retail

Rama: `feat/catalogo-proximamente-2026-10-22`; PR #10. Revisión visual previa a cualquier publicación.

## Referencia de identidad y corrección visual

Fuente de verdad consultada en modo de solo lectura: [SICARU OPERACION MAESTRA 2026 · IDENTIDAD_MARCA · MARCA-008](https://docs.google.com/spreadsheets/d/1yYs9IW2t5RCGfr5NNsYU_C6is9OT3t6nQobfUEqR2fI/edit#gid=20261018&range=A9:G9), vigente desde 2026-10-18. El registro establece Soft Professional Beauty + Retail, diversidad real, fidelidad al empaque/numeración/tono y la paleta aprobada. No contiene originales fotográficos adjuntos.

Corrección: se retiran el círculo y la elipse decorativa del hero. Se conservan sus tres fotografías existentes con composición más contenida y sombras suaves; el título pasa a Poppins, con un CTA comercial de esquinas suaves. El acceso secundario a categorías aparece en pantallas amplias para mantener compacto el primer scroll móvil. Las marcas preceden al catálogo y tienen áreas de toque claras. No se modifican precios, datos, navegación, carrito ni restricciones de envío/pago.

Sustituciones de referencias en las cuatro tarjetas (archivos originales intactos):

- Coloración: `marcas-colorista-aplicando-tinte.jpg` → `products-hero/voglia-color-fun.webp`.
- Tratamientos: `salon-aplicacion-tratamiento.jpg` → `products-hero/voglia-total-repair.webp`.
- Herramientas: `salon-alisado-plancha-profesional.jpg` → `products-hero/navaja-profesional.webp`.
- Para profesionales: `barberia-corte-masculino.jpg` → composición de `products-hero/vitale-bifase-pro-keratin.webp` e `hidra-color-mask.webp`.

Motivo: favorecer el reconocimiento inmediato de producto y una presentación coherente de retail, con menos ruido visual. Las escenas anteriores se conservan en el repositorio; no se modifican sus bytes ni el contenido de Conócenos.

## Diseño y comportamiento

Inicio: encabezado compacto y búsqueda visible → hero comercial de producto → cuatro categorías → siete marcas reales → productos destacados → banner breve de WhatsApp → acceso discreto «Conoce SICARÚ». El contenido institucional y la diversidad de personas se conservan en `/nosotros#filosofia`, también accesible desde «Conócenos» en la navegación.

Se conservan los archivos de fotografía existentes sin modificar sus bytes, etiquetas, proporciones ni tonalidades. La composición del hero se realiza con CSS sobre los recortes existentes; no se generan fotografías ni empaques. Las categorías reutilizan recortes de producto que ya estaban en el repositorio sobre un fondo cálido uniforme, en lugar de escenas de salón con fondos recargados. No se descargaron ni generaron nuevas fotografías para sustituirlas.

Las tarjetas usan exclusivamente productos y variantes devueltos por Medusa. No existen datos de muestra en la interfaz desplegada. Ante un fallo se muestra un estado de recuperación sin tarjetas ficticias. Las imágenes rotas tienen un sustituto neutro sin simular un producto.

Precios: `metadata.storefront_price_approved: true` en la variante habilita su precio calculado. La aprobación a nivel de producto se admite únicamente para productos de un solo SKU. Los importes sin aprobación se sustituyen por «Consultar precio». No se aprobaron precios ni se modificaron datos del backend en esta revisión. La selección de variantes no hereda aprobaciones de otros SKU. Las existencias desconocidas no se presentan como disponibles.

El carrito conserva cantidades y resumen. No se muestran tarifas anteriores ni «Gratis», aunque un carrito guardado contenga un método de envío antiguo. Checkout conserva el bloqueo de pagos/pedidos y muestra «Envíos online próximamente», con WhatsApp +52 828 113 6652. No se activan cotizaciones DHL.

El retiro del service worker anterior y la limpieza de cachés están versionados. `/sw.js` se sirve sin caché y elimina los workers anteriores; se conserva el carrito en localStorage.

## Fotografías originales pendientes

La documentación previa no acredita la procedencia de todos los recortes existentes. Se conservan como material temporal sin afirmar que se recibieron nuevas fotografías originales. Queda pendiente confirmar los originales de Voglia Total Repair 250 ml, Vitale Bifase Pro-Keratin e Hidra Color Mask 150 g usados en el hero y categorías, además de Voglia Color Fun y la navaja profesional reutilizados en categorías, o reemplazarlos por sus originales aprobados. La inspección de los recortes existentes no sustituye la confirmación de su procedencia.

Primer lote pendiente de archivos originales y vinculación exacta a SKU:

- PRD-77EF10219E85: Brocha para Tinte con Peine 2 en 1 Pomania Graphite; referencia `1000705663.png`.
- PRD-FE443FA48D89: Lija para Pies Pomania con Separador de Dedos; fotografía proporcionada el 08/10.
- KIT-VOGLIA-8601-1036: Tinte Negro Voglia 1 90 ml + peróxido 20V 140 ml; fotografía de ambos componentes y mechón.
- KIT-VOGLIA-8603-1036: Tinte Castaño Oscuro Voglia 3 + peróxido 20V; referencia `1000705957.png`.
- KIT-VOGLIA-8604-1036: Tinte Castaño Medio Voglia 4 + peróxido 20V; referencia `1000705958.png`.

Una fotografía grupal original de producto SICARÚ permitiría sustituir la composición temporal del hero. No se recreará con IA sin aprobación.

## Verificación

CI ejecuta lint, TypeScript, pruebas de recuperación/aprobación de precios/inventario/búsqueda, build sin backend y recorrido completo a 320, 375 y 390 px con un backend aislado de prueba. Verifica selección exacta de SKU, modificación de cantidades, ausencia de tarifas previas y cobros, fallos de Medusa, imágenes rotas y actualización de una app controlada por un worker antiguo. Además se verifica el orden comercial de secciones y que los marcos de imagen no recorten los empaques usando los límites alfa originales, a 320/375/390 y 1440 px. Las capturas móviles y de escritorio se guardan como artefacto `storefront-mobile-review`.

No se modifican producción, credenciales, Railway ni los PR #8 y #5.
