# Fantasy Nails · Integración de revisión · 12 noviembre 2026

## Resultado técnico
Rama `codex/fantasy-nails-meta-pilot`, PR #30. Categoría de revisión `/piloto-unas-profesionales` y seis fichas `/piloto-fantasy-nails/[slug]`, todas noindex/nofollow. No se enlazan desde navegación pública. No se ha publicado producción ni modificado Medusa, Meta, inventario, costos, precios, pagos o envíos.

Se copiaron los seis JPEG originales suministrados en la carpeta Fantasy Nails del escritorio, sin recortar, retocar, reconstruir etiquetas, convertir formato ni modificar color. Inspección visual de nombres, etiquetas y presentación de 15 ml realizada. La relación nombre/SKU procede del piloto existente; las fotografías frontales no acreditan por sí mismas el SKU físico. `public/images/fantasy-nails/manifest.json` conserva nombre de origen, destino por SKU y SHA256. El original de Super Blanco contiene una barra invertida literal en su nombre; se documenta en el manifiesto. No se usaron las versiones editadas ni imágenes generadas.

Se sirve el archivo original con `unoptimized` y `object-contain`, para preservar contenido y proporción; se conserva su fondo y sombra real. La superficie de página es #FAF8F5. El coste de fidelidad es mayor transferencia que una versión comprimida (seis JPEG suman aproximadamente 1.2 MB).

| SKU | Ficha | Referencia aprobada MXN |
| --- | --- | --- |
| 17133 | gel-rubber-pink-shine | 99 |
| 17141 | gel-rubber-petal | 99 |
| 17136 | gel-rubber-piel | 99 |
| 28101 | gel-polish-super-blanco | 99 |
| 28102 | gel-polish-super-negro | 99 |
| 20132 | truebond-sin-acido | 59 |

Estos importes permanecen como referencia histórica del piloto, identificados como aprobados y pendientes de cotejo en caja. No se escriben a Medusa ni representan precio implementado. Todas las fichas indican disponibilidad por confirmar. Consultas de categoría y fichas usan el contacto central `STORE.whatsapp`, +52 828 113 6652, con SKU en el mensaje de producto.

## Estructura Medusa observada en el código
- `src/lib/medusa.ts`: SDK Medusa v2, backend externo, Store API con clave publicable.
- `src/lib/data/categories.ts`: categorías reales por `sdk.store.category.list`, handle y ID del backend. La metadata editorial en `constants/categories.ts` no crea registros.
- `src/lib/data/products.ts`: fichas por handle; variantes con ID, SKU, metadata e importe calculado. El catálogo definitivo usa `/productos/[handle]` y `/categorias/[handle]`.
- `src/lib/brand-navigation.ts`: marca en `metadata.brand` o colección reconocida en `constants/brands.ts`. Fantasy Nails requiere futura entrada editorial para navegación por marca, después de conciliación.
- No hay backend administrativo ni fuente de inventario en este repositorio. No se ha auditado la base de datos viva; no se afirma ausencia de categoría o productos.

## Integración definitiva propuesta (requiere acceso y autorización; NO ejecutada)
1. Obtener exportación administrativa paginada de categorías, productos y variantes, incluyendo borradores, registros ocultos, IDs, SKU y relaciones. La Store API no acredita ausencia de registros.
2. Buscar categoría exacta `unas-profesionales` y equivalentes normalizados (uñas, uñas profesionales). Ante más de una coincidencia, conciliar con Dirección; reutilizar ID existente. Crear solo con ausencia comprobada y autorización específica.
3. Mantener **Uñas profesionales** como categoría transversal para Fantasy Nails y futuras marcas. No crear una categoría de marca por cada fabricante; subcategorías opcionales solo al contar con catálogo suficiente y aprobación.
4. Buscar cada SKU como cadena exacta, sin convertir a número ni perder ceros. Registrar `product_id`, `variant_id`, handle y `category_id` en una matriz de conciliación. Cero coincidencias: proponer alta para autorización; una: reutilizar; varias: bloquear y resolver el duplicado antes de escribir. No inferir identidad por título.
5. Reutilizar agrupaciones de producto/variantes existentes; no dividir ni agrupar Rubber automáticamente. Asociar imágenes al SKU/variante exactos según soporte del backend, preservando asociaciones de otras variantes. Nunca asignar una foto a todas las variantes por defecto.
6. Proponer solamente relaciones de categoría y medios para IDs conciliados, con copia previa, diff y plan de reversión. Cualquier alta se revisa aparte. Repetir lectura antes de aplicar para detectar concurrencia; verificar que el número de productos/variantes no aumente al actualizar existentes.
7. No tocar inventario, costos, precios, `allow_backorder`, `manage_inventory`, estado de publicación ni aprobaciones comerciales. Antes de mostrar precios definitivos, corroborar la variante exacta y `metadata.storefront_price_approved === true` conforme a la lógica vigente.
8. Confirmar existencia física, fecha y responsable por SKU, precio realmente aplicado y aprobación comercial. Activar navegación definitiva solo con contenido y autorización de Dirección; conservar catálogo de consulta, sin habilitar checkout ni publicidad.

## Pendientes de Dirección
- Cotejar SKU físico frente a fuente maestra vigente y aprobar presentación de las fotos originales.
- Confirmar precio implementado y existencia física de cada referencia.
- Autorizar y proporcionar acceso administrativo para conciliación Medusa; aprobar cualquier alta o modificación propuesta por ID.
- Aprobar futura publicación. Este PR permanece borrador; no fusionar a main.

## Pruebas y vista previa
Los resultados y enlaces finales se registran en la descripción del PR #30. Las verificaciones HTTP no sustituyen revisión visual en navegador. El manifiesto y las pruebas protegen asociación de imágenes, hashes, noindex, disponibilidad pendiente y contacto oficial.
