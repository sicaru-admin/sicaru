# SICARÚ · Lote web 01 · Matizadores / shampoos

**PREPARADO PARA REVISIÓN · NO CREADO EN MEDUSA · NO PUBLICADO.**

Fecha: 12/11/2026. Rama `codex/lote-web01-matizadores`, desde main `478e0572e59f1081e9c38f2fe8d15f3befc0a4b9`, que ya incorpora el MVP DHL del PR #27. Esta rama no vuelve a modificar ese trabajo.

Solo se añaden cinco assets WebP, documentación, un manifiesto de tres borradores y pruebas. Ningún componente, ruta, variable, integración, precio existente o dato del backend cambia. No hay importador, seed ni script de ejecución contra Medusa. No se crean fichas de prueba en el catálogo real.

## Referencias y autoridad

Fuente vigente: [Base Maestra Inventario y Precios 2026](https://docs.google.com/spreadsheets/d/12bFla6f5ceeSFuPYrLvlEdRwCvkWWWYJ3qJYkFoU69g/edit). Se leyeron los encabezados y registros concretos de `BASE_MAESTRA_PRODUCTOS` y `FICHAS_GOOGLE` mediante el conector, sin modificar la hoja.

| Producto exacto | ID maestro | Base Maestra | Ficha Google | Precio público autorizado para preparar | Barcode propuesto |
| --- | --- | --- | --- | --- | --- |
| XIOMARA Shampoo Platinum 250 ml | PRD-9CC3A06A6F10 | fila 241 | No localizada por ID/EAN ni nombre regular en el rango existente | $95 MXN | 7501846500905 |
| XIOMARA Shampoo Platinum Libre de Sulfatos 250 ml | PRD-3CE612A96316 | fila 242 | fila 71 | $115 MXN | 7501846505863 |
| NEKANE Morazul Shampoo Matizador 300 g | PRD-ABEB7E8039E3 | fila 52 | fila 68 | $95 MXN | **OMITIDO · pendiente de conciliación** |

Los precios se preparan por autorización expresa de Dirección para estas tres referencias en este lote. No se incluyen precios profesionales, costos ni márgenes. Las observaciones históricas de la fila 242 todavía dicen «por aprobar», mientras la columna de precio y FICHAS_GOOGLE fila 71 registran $115 aprobado; no se modifica esa nota antigua ni se utiliza para trasladar $95 desde el Platinum regular.

No hay SKU proveedor confirmado en los tres registros: se omite `sku`, sin inventar uno. Los IDs maestros son referencias de trazabilidad y no se convierten en SKU/EAN.

## Copy web propuesto

### XIOMARA Shampoo Platinum 250 ml

XIOMARA Platinum es un shampoo para el cuidado del cabello platinado y canoso, en presentación de 250 ml.

Consulta disponibilidad, precio y envío por WhatsApp.

**Respaldo:** identidad y presentación de la fila 241 y leyenda legible «para cabello platinado y canoso» en el frente auténtico. Al no localizarse su ficha Google, no se extrapolan los beneficios de la versión Libre de Sulfatos ni se añade una pauta de uso.

### XIOMARA Shampoo Platinum Libre de Sulfatos 250 ml

Shampoo matizador XIOMARA Platinum Libre de Sulfatos para cabello rubio o decolorado. Ayuda a neutralizar reflejos anaranjados, acondiciona y facilita el desenredo.

Presentación de 250 ml. Sigue las indicaciones del envase y consulta disponibilidad, precio y envío por WhatsApp.

**Respaldo:** FICHAS_GOOGLE!D71 y fotografía frontal original. Es una referencia distinta del Platinum regular.

### NEKANE Morazul Shampoo Matizador 300 g

Shampoo matizador NEKANE Morazul para el cuidado de rubios y platinados. Su fórmula con extracto de mora azul ayuda a neutralizar reflejos amarillos y anaranjados y aporta brillo y suavidad. Libre de sal y parabenos. Contenido neto: 300 g.

Aplica sobre cabello húmedo, masajea y enjuaga siguiendo las instrucciones del fabricante. Ajusta la frecuencia al matiz deseado; consulta a tu estilista para orientación de uso. Consulta disponibilidad, precio y envío por WhatsApp.

**Respaldo:** FICHAS_GOOGLE!D68 y envase auténtico. No se promete un resultado universal ni se extrapolan instrucciones de otro tamaño o producto. La descripción no convierte 300 g a ml ni a peso logístico.

## Assets reales y fidelidad

`assets.json` contiene por archivo: ID/URL y nombre original de Drive, hash del original, dimensiones, bytes, coordenadas exactas del recorte, parámetros, versión del codificador y hash del WebP final.

Los originales son JPEG de 3024 × 4032 px. Se conservaron intactos en Drive y en la carpeta de evidencia local. Las únicas operaciones fueron orientación automática, recorte de fondo vacío, reducción proporcional Lanczos3 hasta 1800 px de altura y codificación WebP de alta calidad. No hay ampliación, máscaras, sustitución de fondo, cambios de exposición/color, texto nuevo ni reconstrucción del empaque. Se conserva el fondo real. Se omiten metadatos EXIF privados del derivado y se usa salida sRGB.

Se emplea calidad 95 y, para conservar mejor el reverso de Morazul, calidad 98. La compresión es con pérdida controlada, no se declara identidad byte a byte de los píxeles derivados. La fidelidad se cotejó visualmente y contra el raster recortado/redimensionado previo a comprimir: PSNR ≥40 dB y error absoluto medio <2 niveles por canal. Estas métricas de conversión no sustituyen la conciliación de identidad ni validan un EAN.

Los archivos promocionales `74.png` y `75.png` no se descargaron ni se utilizaron. No se publican rótulos promocionales ni precios impresos antiguos. Ninguna fotografía se intercambia entre referencias.

## Morazul: discrepancia retenida

- Reverso físico fotografiado: candidato documental `0659525853273` (se conserva el cero inicial). Los dígitos impresos bajo el símbolo se leen agrupados como UPC `6 59525 85327 3`.
- FICHAS_GOOGLE fila 68: candidato `0659525853365`, expresamente no cotejado físicamente.
- `prepared_medusa_body` de Morazul no contiene `barcode`, `ean` ni `upc`.
- No se corrige la Base Maestra. La discrepancia se concilia antes de asignar cualquier código. El precio aprobado no acredita existencia ni resuelve el código.

## Handles y categoría

`read-only-checks.json` registra respuestas GET de Medusa Production. Los tres handles propuestos no aparecen en Store API (200, cero coincidencias por handle). **Esto acredita ausencia pública, no ausencia en borradores/Admin.** La sesión administrativa redirigió a login. No se recuperaron contraseñas, crearon accesos ni efectuaron escrituras.

Antes de una futura alta se exige consultar Admin en todos los status y comprobar handle, ID maestro, identidad y EAN donde corresponda. Si existe una ficha exacta o ambigua, detener la creación para evitar duplicados. No se da por libre global un handle basándose solo en Store API.

Categoría existente verificada: **Shampoo y Acondicionador**, `pcat_01KVV3GD50MECKKS27Q8Y21HPK`, handle `shampoo-y-acondicionador`, activa y pública. Se propone esa misma categoría para los tres shampoos. No se crea una categoría nueva.

## Manifiesto Medusa: preparación sin ejecución

`medusa-drafts.proposal.json` tiene un envoltorio con `execution_allowed: false`, fuentes, pendientes y `prepared_medusa_body` por referencia. No es un cuerpo listo para pegar sin revisión ni un programa que haga peticiones. Las estructuras se contrastan en tests con `HttpTypes.AdminCreateProduct` de `@medusajs/types` 2.13.1 instalado.

Cada cuerpo propone:

- `status: "draft"` y `sales_channels: []`.
- La categoría existente; una opción Tamaño y una sola variante con su presentación literal.
- Un único precio público MXN 95 / 115 / 95 y `metadata.storefront_price_approved: true` **en esa variante**, según la autorización específica de este lote.
- `manage_inventory: true`, `allow_backorder: false`.
- Sin inventory levels, cantidades, ubicaciones, kits de inventario, stock positivo o `storefront_inventory_verified`.
- Sin peso logístico, SKU inventado ni precio preferente.
- Barcode documental solo para los dos XIOMARA; ninguno para Morazul.
- Fotografías generales del producto de una única presentación, en orden frente/reverso, y frente como thumbnail. No hay tonos distintos en estas fichas.

Un alta futura autorizada con inventario gestionado puede hacer que el workflow oficial cree la estructura interna de inventory item. **No autoriza crear niveles ni cargar existencia.** Debe comprobarse ese resultado y conservar «Disponibilidad por confirmar»; la aprobación de precio no habilita Agregar.

Las URLs HTTPS de imágenes apuntan a las rutas propuestas del dominio oficial. **Todavía no están publicadas allí ni cargadas/asociadas en Medusa.** Solo podrán usarse después de aprobar/publicar los assets y verificar cada GET 200 y hash; no se afirma hoy que esas URLs productivas estén disponibles.

## Secuencia futura que requiere autorización separada

1. Revisar copy, fotos y discrepancias. Confirmar todos los status por Admin antes de reutilizar los handles.
2. Autorizar y publicar exclusivamente los assets revisados; verificar HTTPS, bytes y hashes en su ubicación persistente.
3. Autorizar por separado las altas en Medusa. Releer fuentes y categoría antes de escribir. Crear una ficha draft y una variante por referencia, sin canal de venta ni niveles.
4. Leer de vuelta IDs, opción, presentación, precio/aprobación exacta, imágenes e inventario. Detener ante duplicados o cualquier dato no conciliado.
5. Hacer QA aislada de tarjeta, ficha, WhatsApp, disponibilidad desconocida y bloqueos. Publicar/asignar canal solo mediante una autorización comercial posterior.

Esta tarea no ejecuta ninguno de esos pasos de escritura/publicación. Se conservan checkout/pagos bloqueados y el flujo DHL por cotización WhatsApp del main de base.

## Verificación

Comandos del repositorio: `node --experimental-vm-modules --test tests/*.test.mjs`, `npx tsc --noEmit`, `npm run lint`, `npm run build`. Las ocho pruebas nuevas cubren alcance exacto, borradores/precios/variantes, inventario, discrepancia de Morazul, WebP/hash/dimensiones, procedencia, asociación correcta de assets y tipos de Medusa.

Las pruebas del manifiesto son locales y no acreditan que se hayan creado productos o publicado URLs. Los resultados de ejecución y CI se registran en el PR Draft y la entrega local, sin modificar la configuración de CI.

Resultado local final: **111/111 tests PASS**, TypeScript PASS, build PASS y lint sin errores (tres advertencias previas: dos usos de `<img>` y una variable sin uso en blog). Las ocho pruebas de este lote están incluidas en esas 111. CI queda sujeto a la ejecución del HEAD publicado en el PR.

## Archivos WebP finales

| Archivo | Dimensiones | Bytes | SHA-256 |
| --- | --- | --- | --- |
| `public/images/products/xiomara-shampoo-platinum-250ml/01-principal.webp` | 634 × 1800 | 129910 | `5f545fec3abff825aca893d02b6f5499fb76ce4c533e66a2594a144fe5c789e1` |
| `public/images/products/xiomara-shampoo-platinum-libre-sulfatos-250ml/01-principal.webp` | 690 × 1800 | 203726 | `d9bebc39927b24ef1be50e9b31e0e1d470b376e2197464a991bf0b968fb72bc1` |
| `public/images/products/xiomara-shampoo-platinum-libre-sulfatos-250ml/02-reverso.webp` | 662 × 1800 | 206724 | `c7d7dce8a3b3cb08b083f186d8df25e0c3953f0ad0f589d8f9f132044f1f1ea5` |
| `public/images/products/nekane-morazul-shampoo-matizador-300g/01-principal.webp` | 566 × 1800 | 273374 | `82e1508cc3355b6eeb049229f684edfc101f3910e34f76621f66babe1a54f07b` |
| `public/images/products/nekane-morazul-shampoo-matizador-300g/02-reverso.webp` | 563 × 1800 | 436352 | `d5a62ce2e4bdfb663947c88f80fbcb4113e35e64e4a45a8fdc211f7f2a2f010c` |

Total derivados: 1250086 bytes. Originales: 3361644 bytes.
