# SICARÚ · Cola fotográfica priorizada — 25 de noviembre de 2026

**Tipo:** auditoría operativa de SOLO LECTURA y propuesta de trabajo. **No es aprobación para cambiar Medusa ni publicar.**

## Fuentes contrastadas

- Producción: página `/productos` del despliegue `dpl_6pdQgoakj37wfCBeZLWEwxd72fv1` (rama `main`, SHA `1f4d8f2`). En la lectura anterior devolvió 12 tarjetas: 5 con URL de imagen, 7 con «Imagen no disponible». **Esto describe esa fecha/deployment, no una consulta nueva a Admin Medusa.**
- [PR #34](https://github.com/sicaru-admin/sicaru/pull/34) y [matriz de sustitución existente](../catalog/matriz-sustitucion-shampoos-2026-11-22.md), versión R3 de shampoos y dos recortes aportados por la propietaria.
- Nuevos candidatos XIOMARA: azul y morado en `public/images/products/*/01-principal-recorte-propietaria-candidato.webp`, con hash y transparencia íntegros; publicados **solo en Preview**.
- [Carpeta Drive: recortes de productos](https://drive.google.com/drive/folders/1Li4e_-qIqj_o9Ns1kH9jk2-eGLv7w38q): 48 PNG, inspeccionados **por inventario de nombre**, no todos visualmente. Hay fotos de Voglia Anti Frizz, reveladores, Hidra bifásica, shampoo violeta Vittalé, NEKANE Planchado Express, herramientas y uñas; **no equivalen** a los productos concretos sin imagen.
- [Carpeta Drive: recortes genéricos](https://drive.google.com/drive/folders/17XZr17-e_zU0m8LdlW1uYvQuiItDwZL7): 17 archivos listados; **16 imágenes revisadas visualmente** a 25/11. Identificación positiva: depilación PASSINI, aftershave ZANDOKAN, coloración y peróxidos VOGLIA y KÜÜL/Change. **Ninguna de las 16 es el gel XIOMARA, tratamiento NEKANE ni keratina VITALE pendientes**. Un archivo con nombre genérico no se pudo leer (Drive respondió 404); queda sin clasificar.
- [Carpeta Drive: fotos editadas](https://drive.google.com/drive/folders/1-7yUAooSQpmaqRjCu8khHDvJQcyyszRn): 27 JPEG con nombres DSC; se revisó una muestra de nueve archivos que **no son fotografías de producto**. No corresponde continuar explorando esa carpeta para corregir estas fichas comerciales; los 18 restantes no se inspeccionaron.
- [Carpeta Drive: catálogo PNG sin fondo](https://drive.google.com/drive/folders/1FEgpCyJvMMzeYqE_MwCU9M1pbc2Ivt7P): cuatro subcarpetas; `03 — Shampoos` y `90 — Por identificar` actualmente vacías al listar hijos directos.

## Plan por prioridad (NO cambiar imágenes todavía)

| Orden | Handle / producto visible | Estado de imagen en sitio de referencia | Material disponible ya revisado | Próximo paso seguro |
| --- | --- | --- | --- | --- |
| 1 | `xiomara-shampoo-platinum-250ml` / XIOMARA Platinum azul 250 ml | Frontal original con fondo gris | R3 existente y recorte limpio nuevo de la propietaria, ambos en PR #34; recorte nuevo WebP 1600×1600 con alpha verificada | Comparativa a tamaño real en tarjeta/galería y aprobar candidato exacto |
| 2 | `xiomara-shampoo-platinum-libre-sulfatos-250ml` / XIOMARA Libre de Sulfatos morado 250 ml | Frontal original con fondo gris | R3 frontal/reverso y nuevo frontal propietario en PR #34 | Comparar frente/cortes de dispensador y conservar reverso adecuado |
| 3 | `nekane-morazul-shampoo-matizador-300g` / NEKANE Morazul 300 g | Original con fondo gris | R3 frente y reverso 1600×1600 ya en Git; alfa comprobada; franjas RGB fuera de envase son totalmente transparentes | Revisar frente/reverso real en Preview; pedir nuevo recorte solo ante defecto visible |
| 4 | `xiomara-gel-fijacion-fuerte` / Gel Fijación Fuerte 250 ml | Sin foto | No se identificó archivo exacto **por nombre** en la carpeta de 48 PNG | Localizar recorte correcto en archivos sin nombre o solicitar foto frontal real + reverso opcional, cotejar presentación/SKU |
| 5 | `nekane-tratamiento-hidra-intenso` / NEKANE Hidra Intenso 300 ml | Sin foto | Hay PNG de otros productos NEKANE, **no confirmar coincidencia** | Revisar contenido de archivos genéricos y cotejar envase 300 ml; luego recorte |
| 6 | `vitale-keratina-profesional` / VITALE Keratina Profesional 500 ml | Sin foto | Hay PNG de shampoo violeta **Vittalé**, no de Keratina Profesional confirmada | Pedir frontal exacto si no aparece en Drive/catálogo, verificar etiqueta y 500 ml |
| 7 | `hidra-color-tinte-cremoso` / HIDRA Color 90 ml | Sin foto | Existen PNG de **otros HIDRA** (bifásico, etc.), no asignar | Verificar tono/EAN/SKU concreto y solo después fotografiar |
| 8 | `voglia-tinte-permanente-90ml` / VOGLIA tinte 90 ml | Sin foto | Hay otros recortes VOGLIA en Drive, pero no prueba de foto por tono | Priorizar tonos según demanda/existencias y verificar identificación exacta |
| 9 | `kuul-cure-me-reconstructor-1l` / KÜÜL Cure Me | Sin foto | Identidad de presentación 1L frente a histórico 1kg pendiente | **Bloquear** hasta conciliar etiqueta, ficha y SKU |
| 10 | `montis-shampoo-extracto-natural` / MONTIS | Sin foto | Ficha previa 500 ml vs maestro Shampoo de Caballo 650 ml | **Bloquear** hasta corregir identificación; no asignar foto ajena |
| 11 | `voglia-all-in-one-keratin-250ml` / VOGLIA All in One 250 ml | Foto visible | PNG actual enlazado desde subdominio de Vercel | Comprobar calidad y URL duradera; no etiquetar como defectuoso sin mirar |
| 12 | `kuul-color-system-90ml` / KÜÜL Color System 90 ml | Imagen visible | WebP en Git de tono 7.44 | Verificar que fotografía y tono coinciden con variante seleccionada |

## Flujo de control

1. **Recuperar primero, recortar después:** 16 de 17 PNG sin nombre ya se identificaron visualmente como PASSINI/ZANDOKAN/VOGLIA/KÜÜL; queda uno inaccesible. Nueve JPEG editados revisados no son material de producto; no continuar esa carpeta sin razón específica. No dar por terminado el inventario solo por su título.
2. Confirmar el producto exacto: marca, línea, presentación, tono/SKU y código de barras cuando aplique. No asumir stock por la presencia de fotografía.
3. Foto real con alfa genuino. Componer a estándar de catálogo acordado, sin alterar letras/colores, sin fabricar etiquetas y sin recortar parte del producto.
4. Comparar original vs candidato en tarjeta 320/390 px y galería escritorio sobre `#FAF8F5`; revisar escala, bordes, sombras, código y compatibilidad con imágenes restantes.
5. Obtener visto bueno **por producto**; solo tras autorización comercial separada y verificación de Medusa asociar la foto exacta, asegurar rollback y verificar resultado productivo.

**Siguiente lote propuesto:** cerrar XIOMARA azul/morado y NEKANE Morazul, luego identificar material de gel XIOMARA, tratamiento NEKANE y keratina VITALE. **No crear un nuevo catálogo o repetir toda la auditoría histórica.**

No se realizó ningún cambio en precios, inventario, pedidos, pagos, envíos o Medusa al producir esta lista.
