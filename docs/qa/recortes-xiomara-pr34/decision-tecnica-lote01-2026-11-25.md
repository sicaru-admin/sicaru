# SICARÚ · Decisión técnica sobre el lote fotográfico 01
Fecha: 25 de noviembre de 2026
Estado: **EVALUACIÓN EN BORRADOR · NO APROBADO · NO PUBLICADO**

PR de trabajo: https://github.com/sicaru-admin/sicaru/pull/34
Entorno de revisión: Vercel **Preview**, no `main`.
Producción observada (deployment): `dpl_6pdQgoakj37wfCBeZLWEwxd72fv1`, SHA `1f4d8f2f661d8df056c0f559c4f948133e0a5052` (verificada vía Vercel el 25/11).
Fuente comercial: matrices de Store API de 22/11 y documentación previa del PR; **no son una lectura fresca de Admin Medusa**.

## Hallazgo crítico y corrección preventiva en PR #34

El borrador #34 incluía una sustitución R3 *automática* en componentes productivos:
- `src/components/products/RetailProductCard.tsx` invocaba `getVerifiedCatalogCardPhoto`.
- `src/lib/product-media.ts` invocaba `getVerifiedCatalogGalleryPhoto`.

Esa lógica, al hacer merge, habría cambiado fotografías visibles del catálogo aunque el propósito del PR fuera diagnóstico y los recortes definitivos no estuvieran aprobados. **No se autorizó esa publicación.**

**Corrección en la rama de borrador (25/11):**
- Commit `bed25fa195c23f99cc51ca011a9a1260150a2b34`: la tarjeta usa únicamente el `thumbnail`/imagen original recibido de Medusa, sin sustituirlo. Se conserva compatibilidad con las propiedades del laboratorio visual.
- Commit `bee6999e501dcc5313723bb6fa396bb757876820`: la galería vuelve a exponer sus URL e ID originales; el laboratorio sigue haciendo sustituciones temporales en memoria.
- El helper de pruebas `catalog-verified-card-photos.ts` permanece en el borrador como material de evaluación, **sin conexión activa** a los componentes de producción.
- El PR #35 sigue siendo una propuesta de implementación distinta, también sin autorización de publicación. Si se eligen los recortes nuevos XIOMARA, la propuesta de #35 (que usa R3 anteriores) deberá ajustarse antes de cualquier aprobación.

## Matriz de revisión (archivos exactos)

| Identidad de producto | Frontal actual reportado en Store API | Opciones preparadas en Git | Recomendación técnica provisional | Autorización |
| --- | --- | --- | --- | --- |
| XIOMARA Shampoo Platinum 250 ml; Medusa `prod_01M79C6MFY2YPX504ZMDW9HJ0A`; EAN `7501846500905` | `/images/products/xiomara-shampoo-platinum-250ml/01-principal.webp` | `01-principal-r3.webp`; `01-principal-recorte-propietaria-candidato.webp` | Comparar y dar prioridad de revisión al recorte original entregado por la propietaria (azul), por limpieza y fidelidad | Pendiente |
| XIOMARA Shampoo Platinum Libre de Sulfatos 250 ml; Medusa `prod_01M79C7BHA8D7GCZG4DTBM1Q68`; EAN `7501846505863` | `/images/products/xiomara-shampoo-platinum-libre-sulfatos-250ml/01-principal.webp` | `01-principal-r3.webp`; `01-principal-recorte-propietaria-candidato.webp`; reverso R3 | Dar prioridad de revisión al recorte nuevo morado y conservar reverso R3 como candidato independiente | Pendiente |
| NEKANE Morazul Shampoo Matizador 300 g; Medusa `prod_01M79C817D78WYM8K6D9W32NH1` | `/images/products/nekane-morazul-shampoo-matizador-300g/01-principal.webp` | Frente y reverso `-r3.webp` | Evaluar ambos R3 compuestos sobre fondo marfil `#FAF8F5`; los artefactos RGB fuera de la silueta tienen alfa 0 según registro previo | Pendiente |
| MONTIS: variante Medusa `500ml`, ficha maestra / foto `650 ml` | Sin imagen | Foto 650 ml documental | **Bloqueado**: no renombrar ni asignar foto hasta verificar SKU, presentación e identidad física | No autorizable actualmente |

Los dos recortes XIOMARA fueron aportados como PNG con transparencia y exportados a WebP lossless 1600×1600; los hashes están en `docs/qa/recortes-xiomara-pr34/MANIFIESTO_RECORTES.json`.

## Pruebas y criterio de aprobación

1. Verificar CI del **nuevo SHA**, incluido lint, typecheck, build, pruebas de identidad y resguardo de carrito/checkout. CI verde en SHA anterior no confirma la revisión actual.
2. Abrir en Preview la ruta `/qa/reparacion-shampoos/recortes` para los dos XIOMARA y `/qa/reparacion-shampoos` para NEKANE frontal/reverso. **Obtener capturas efectivas** a 320/390 y 1440 px, no dar por evaluada una imagen solo porque existe el código de la ruta.
3. Inspeccionar sobre `#FAF8F5`: legibilidad de etiqueta, tapa, dispensador, base, contornos y escala real en tarjeta y ficha. No añadir sombra o ajustes al propio envase sin aprobación.
4. Confirmar URL HTTP 200 e identidad/galería vigentes desde Store y **Admin Medusa solo lectura**, respaldando URLs e IDs; los datos del 22/11 pueden haber cambiado.
5. Obtener visto bueno visual **por archivo y producto**. Después preparar un PR específico con las fotos elegidas y pruebas visuales; autorización comercial separada antes de merge o escritura de Medusa. Mantener rollback a URLs anteriores.

**No se ha modificado producción, Medusa, stock, precios, envíos o pagos en esta evaluación.**
