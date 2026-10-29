# Catálogo comercial · lote 1 · 29 de octubre de 2026

## Resultado y alcance

Primera mejora de frontend: conservar la variante y el SKU seleccionados al preparar una consulta voluntaria al WhatsApp oficial. Antes, elegir cualquiera de los 23 tonos Voglia dejaba un mensaje con el título general del producto. Ahora transmite el título de la variante canónica y su SKU. Sin selección, la consulta sigue siendo general. Solo puede incorporar un precio si la variante exacta tiene aprobación explícita mediante la regla actual `getApprovedPrice`.

No se asignan fotografías, crean referencias ni modifican datos en Medusa. No hay cambios visuales, dependencias, reglas de precios, inventario, carrito, checkout, pagos o envíos. La propietaria deberá revisar el Draft; esta fase no autoriza fusión ni producción.

## Estado contrastado

- Base de trabajo: `main` `6aad285c414e7f7a2a8fab2df8649aff83c2feb9`, incluye AGENTS del PR #15 y privacidad del PR #16. El dominio público apunta al mismo commit, deployment `dpl_FRqBmybRfTb6waD2U1SLLCoVEr1W`, READY. Es la referencia previa a este lote, no un despliegue de este trabajo.
- Lectura pública Store API y navegador: 9 productos, 31 variantes, 8 destacados; una ficha con imagen y ocho sin imagen en origen. Ninguna de las 31 variantes devuelve `metadata.storefront_price_approved === true`. Las cifras calculadas por Medusa no equivalen a aprobación y permanecen ocultas.
- Se consultaron todas las páginas hasta completar `count`, sin escritura ni acceso administrativo. El navegador público no registró `pageerror`; se observaron respuestas 401 anónimas de `/store/customers/me`, sin fallo del catálogo.
- Se conservan los otros worktrees, incluido el checkout original con cambios pendientes y la rama anterior de publicación. Rama aislada: `codex/catalogo-consulta-exacta`.
- La conciliación anterior se reutiliza como antecedente, no se reconstruye ni se trata como prueba actual de existencia física. La instantánea de identificadores públicos de este lote está en `catalogo-comercial-lote-1.json`, sin importes no aprobados ni datos de clientes.

## Matriz operativa breve

Todos los registros de esta primera tabla ya están publicados; los bloqueos se refieren a completar/validar su ficha y fotografía, no a crear nuevamente productos existentes. Los IDs de las 31 variantes se conservan en el JSON adjunto.

| Producto / variante y SKU actual | Fotografía comprobada | Precio por variante en Store API | Bloqueo y acción concreta |
| --- | --- | --- | --- |
| Voglia Tinte Permanente 90ml · 23 tonos, entre ellos 1 Negro `VOGLIA-TINTE-1-90ML` y 3 Castaño oscuro `VOGLIA-TINTE-3-90ML` | Sin imagen en Medusa. Las tres fotos de PR #11 son combos; no son fotografías aprobadas de tubos sueltos | Pendiente en las 23 | Conservar consultas por tono/SKU. Para fotografiar tubos reutilizar guías aprobadas de 1, 3, 5, 6 y 7, sin convertirlas en ranking de demanda. Validar etiqueta y 90 ml / 85 g frente a registros históricos 90 g. Nunca transferir precio/foto de kit al tubo |
| KÜÜL Cure Me Reconstructor · 1L · `KUUL-CURE-1L` | Drive conserva reverso real del tarro; no muestra contenido neto, frente ni código. La carpeta local de integración sigue sin los tres archivos solicitados | Pendiente | Medusa `prod_01KVV3GD5ZFG0NT90YWFXRPZFK`, variante `variant_01KVV3GD877SSAGARCPETM9JT5`. Candidato maestro `PRD-1A10D85B307D`, proveedor `3136871`, **1 kg**; no son unidades intercambiables. Recibir frente y etiqueta con contenido/código y propuesta editada; validar identidad y autorizar corrección por separado antes de asignar |
| Voglia All in One Keratin · 250ml · `VOGLIA-ALL-IN-ONE-250ML` | Archivo existente y publicado: `public/images/products/voglia-all-in-one-keratin-250ml.png`; se conserva íntegro | Pendiente | EAN Medusa `7501633712023`; Base fila 164 dice All in One Bioliberarsi / termoprotector 250 ml sin EAN/SKU. Pedir reverso y vínculo documental; no sustituir la foto ni asumir equivalencia |
| Nekane Hidra Intenso · 300ml · `NEKANE-HIDRA-300ML` | Sin foto exacta acreditada | Pendiente | Base tiene suero dos fases 300 ml y tratamientos 280 g diferentes. Obtener frente, contenido y código de esta referencia exacta; no convertir gramos en ml |
| Vitale Keratina Profesional · 500ml · `VITALE-KERAT-500ML` | Sin foto exacta acreditada | Pendiente | Bifase Prokeratin 320 ml y Belcapel 250 ml no son esa referencia. Identificar envase 500 ml, EAN/SKU y fuente antes de fotografiar/asignar |
| Hidra Color Tinte Cremoso · 90ml · `HIDRA-COLOR-90ML` | Sin foto exacta acreditada | Pendiente | Falta tono/EAN. Base separa 3, 7.44, 8.21 y 10.21. Solicitar caja/tubo con código y tono; no elegir uno por similitud |
| Xiomara Gel Fijación Fuerte · 250ml · `XIOMARA-GEL-250ML` | Sin foto exacta acreditada. La foto encontrada de Argan Drop no es gel | Pendiente | Obtener gel físico con nombre, contenido y código; no usar Ten+Tú ni ampolletas |
| Montis Shampoo Extracto Natural · 500ml · `MONTIS-SHAMPOO-NAT` | Sin foto exacta acreditada | Pendiente | Base fila 580 documenta Caballo 650 ml, no esta ficha. Confirmar línea, presentación y EAN; no usar la foto del 650 ml |
| KÜÜL Color System Cream · 3oz · `KUUL-COLOR-3OZ` | Sin foto exacta acreditada | Pendiente | Falta tono/EAN. Base separa Color System 90 ml por tono. No asumir equivalencia de 3 oz a 90 ml ni escoger un tono |

### Referencias aún no publicadas y material reutilizable

| Referencia exacta | Estado / original disponible | Precio y decisión pendiente |
| --- | --- | --- |
| `KIT-VOGLIA-8601-1036` · 1 Negro + peróxido 20V 140 ml | No existe ese kit en las nueve fichas publicadas. Original WebP 1200 × 900 en PR #11 | Base documenta $97 para el **combo**, no el tubo. Falta confirmar correspondencia visual, presentación, existencia actual de ambos componentes y variante propia autorizada; no crearla en esta fase |
| `KIT-VOGLIA-8603-1036` · 3 Castaño Oscuro + peróxido 20V 140 ml | Igual; original independiente en PR #11 | Misma separación kit/tubo; no heredar aprobación de precio al frontend |
| `KIT-VOGLIA-8604-1036` · 4 Castaño Medio + peróxido 20V 140 ml | Igual; **4 no es 4CC**, variante que sí aparece publicada | No asignar al tono 4CC ni fabricar equivalencias. Requiere identidad y nueva autorización de datos |
| Voglia Anti Frizz Shampoo 250 ml · proveedor `1042`, EAN `7501633710425`, maestro `PRD-3A52F80D932A` | No está entre las nueve fichas. Las fotos candidatas inspeccionadas no acreditan frontal de esta referencia exacta | Base fila 17 registra aprobación propietaria del 28/10: público $115 y preferente $90 IVA incluido. No hay variante Medusa publicada a la que atribuirlos. Interés comercial documentado por decisión de la propietaria; demanda/ventas no cuantificadas. Recibir frente y reverso exactos, confirmar existencia actual y solicitar autorización de publicación independiente |

No hay actualmente una referencia adicional que reúna, de forma comprobada, demanda específica, identidad física completa, foto comercial aprobada y aprobación de precio en su variante publicada. No se presenta ningún producto como listo para vender basándose solo en existencias históricas o en que su foto sea accesible.

## Primer lote preparado y siguiente paso ejecutable

1. **Frontend listo para revisión:** consulta inequívoca en las fichas actuales, especialmente los 23 tonos Voglia. No cambia orden, productos, fotografías ni importes. No abre WhatsApp automáticamente ni envía mensajes.
2. **Lote fotográfico condicionado:** cerrar una referencia por ficha. KÜÜL Reconstructor tiene interés explícito en este chat y un reverso documental recuperado: el siguiente archivo necesario es el frente del ejemplar y una etiqueta que muestre contenido neto/código. Se reutiliza el procedimiento local ya preparado; no se vuelve a crear. El tarro de 245 g (proveedor `3136872`) no sustituye al de 1 kg.
3. **Siguiente candidata comercial a evaluar:** Shampoo Voglia 1042 tiene identidad y decisión de precio en la Base; necesita originales exactos y confirmación comercial de prioridad antes de crear ficha. El reverso encontrado tiene EAN **7501633711996**, diferente de 1042: no asociarlo.
4. **Combos Voglia:** conservar los tres originales del PR #11 para revisar, sin copiarlos al catálogo, alterar empaques ni fabricar fotos de tubo a partir del combo. Solicitar confirmación visual individual y modelo comercial de componentes antes de cualquier alta. No priorizarlos por tener fotos.

La selección definitiva del próximo producto depende de interés/ventas verificables y de cerrar esas evidencias. No se solicitan compras, gastos ni cambios de inventario. El lote de cinco tonos naturales anterior continúa como guía de captura, no como cinco fichas independientes ni evidencia de demanda.

## Procedencia y discrepancias

- [Base Maestra de Inventario y Precios 2026](https://docs.google.com/spreadsheets/d/12bFla6f5ceeSFuPYrLvlEdRwCvkWWWYJ3qJYkFoU69g/edit), metadata modificada 2026-10-29T18:48:05.665Z. Lecturas dirigidas: BASE_MAESTRA_PRODUCTOS A1:AA90, A34:AA45, A164:AA164, A276:AA280, A533:AA535, A580:AA580; BUSQUEDAS_REALES_GOOGLE A1:I35. Las consultas generales de Google no acreditan demanda de estos SKU específicos. No se escribieron hojas maestras ni se auditó nueva rentabilidad.
- [Draft #11](https://github.com/sicaru-admin/sicaru/pull/11), head `f7fd6860f1512320baac9c0215a994101465704b`, sigue independiente. No integrar completo: contiene excepciones de precios incompatibles con aprobación por variante y archivos anteriores a las correcciones comerciales actuales.
- Originales Git, sin modificación: `public/productos/voglia/KIT-VOGLIA-8601-1036.webp` SHA-256 `d70cd2940096a1c3a17186cb510a200ab3cf425191cf60820e3a6ca1ce4e736c`; `KIT-VOGLIA-8603-1036.webp` `f98bcecd41e9c5d1eee4c938366adca7f53184aed671cd73d78a60ad88020604`; `KIT-VOGLIA-8604-1036.webp` `840883a34264a786c56210c3c9ab9f231b31a4b596216bd1e06a5748202489ac`. Están disponibles en ese commit, no aprobados automáticamente para nuevas asociaciones.
- [Reverso real KÜÜL Reconstructor](https://drive.google.com/file/d/1S45khnW5Xr41mY5XbHB07bG-bQENB3wq/view): documental, sin contenido/EAN legibles en la toma; no fotografía comercial aprobada.
- [Reverso Voglia EAN 7501633711996](https://drive.google.com/file/d/1ROLMxRPu3Ya2IJE6hiW8byrnhTvmYgCv/view): no corresponde por código al Shampoo 1042. No asignado. Los otros dos resultados inspeccionados son Argan Drop de Xiomara y mascarilla Total Repair, no las referencias buscadas.
- Evidencia de identificación, fotografía comercial final y archivo web aprobado siguen siendo tres pasos diferentes. No se publican fotografías editoriales de Conócenos ni Nuestros productos en esta tarea.

## Decisiones que requieren autorización posterior

- Aprobar o rechazar el Draft de consulta exacta antes de fusionar/publicar.
- Confirmar el ejemplar KÜÜL 1 kg y su correspondencia documental con la ficha actual 1 L; autorizar explícitamente cualquier corrección y asignación en Medusa solo después de conciliar.
- Confirmar qué SKU tiene prioridad comercial demostrable y aprobar la fotografía web exacta. Precio de hoja, aprobación de foto y permiso de escritura en Medusa son autorizaciones distintas.
- Resolver tubos/combos Voglia, unidades y componentes antes de proponer altas o precios por variante. No convertir los $97 del kit en precio del tubo.

Las incidencias de hidratación #13, CORS de Preview y revisión legal permanecen fuera de este lote; no se aplican correcciones especulativas.

## Pruebas y límites de la evidencia

- `node --experimental-vm-modules --test tests/*.test.mjs`: 47/47 pasan, seis regresiones nuevas. Se ejecutan helper y componente real con hooks aislados; cubren 23 tonos sintéticos, cambio de selección, precio aprobado/no aprobado, IDs ajenos, información incompleta y codificación sin mutación. Las pruebas de hashes confirman que archivos comerciales, fotos y etapas aprobadas no cambiaron.
- `npm run lint`: cero errores; tres advertencias previas fuera del diff (dos img en carrito y una variable en blog). `npx tsc --noEmit`: pasa antes y después del build.
- Build con `NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://127.0.0.1:9999` y `NEXT_PUBLIC_CATALOG_MODE=true`: pasa. El primer intento sin red falló al descargar Poppins/Libre Bodoni de Google Fonts; el segundo con red pasó, sin cambiar fuentes, configuración ni aplicación.
- Chromium limpio contra frontend local y una reproducción **de solo lectura** de la Store API pública: 320, 390 y 1440 px pasan. En cada ancho se comprueban 9 tarjetas, las consultas de las 31 variantes, 8 destacados, ausencia de importes no aprobados, navegación Conócenos/Profesionales, imagen existente decodificable y checkout bloqueado sin llamadas a pagos/envíos. Sin `pageerror`, sin mensajes enviados y sin escrituras a Medusa. Esto acredita el frontend local con una instantánea real, no una carga de imágenes en Medusa ni un Preview desplegado.
- La suite amplia preexistente de navegador pasó el recorrido de 320 px, pero su primera ejecución local falló al final de 375 px por un `SyntaxError: Invalid or unexpected token`, sin stack capturado por la suite. Una segunda ejecución con instrumentación lo observó en Inicio (`http://127.0.0.1:3000/`, stack vacío) y falló la comprobación de foco del buscador a 320 px. Se conservan ambos fallos; no se atribuyen al helper ni se ocultan. El QA focal anterior no los reprodujo. La suite amplia local no se declara aprobada. CI en entorno limpio y revisión del Preview deben comprobarse antes de cualquier futura propuesta de publicación.
