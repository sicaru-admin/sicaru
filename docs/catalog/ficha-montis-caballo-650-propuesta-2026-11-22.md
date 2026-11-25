# SICARÚ · Texto propuesto para corregir la ficha MONTIS

**ESTADO: PROPUESTO · NO APROBADO · NO PUBLICADO**  
**Fecha de revisión: 22/11/2026**

## Identidad y fuente

- Base Maestra `BASE_MAESTRA_PRODUCTOS`, fila 580, ID: `PRD-MONTIS-CABALLO-650`.
- Nombre registrado: **Shampoo de Caballo Montis 650 ml**.
- Marca: **MONTIS**.
- Presentación: **650 ml**.
- EAN físico documentado en registros: **7503000640069**, pendiente de conciliar con el ítem publicado actual.
- Fotografía original frontal Drive: `1gjUv3UiPo-z7UrB7xdpDwAexlVGRn6n9`. La foto revisada muestra botella ámbar, caballo en etiqueta y 650 ml.
- Fotografía preparada WebP V2: **solo local, en revisión visual**, no incorporada al repositorio ni a Medusa.

## Propuesta de campos visibles

**Título de producto:**  
Shampoo de Caballo Montis 650 ml

**Descripción breve:**  
Shampoo de uso diario para el cuidado y limpieza del cabello. La fórmula declara biotina y colágeno hidrolizado en su etiqueta. Presentación de 650 ml.

**Modo de uso (según reverso físico documentado):**  
Aplicar sobre cabello húmedo, masajear hasta formar espuma y enjuagar. Repetir si se desea. Evitar el contacto con los ojos.

**Consulta comercial:**  
Consulta disponibilidad por WhatsApp antes de confirmar tu pedido.

**Título SEO sugerido:**  
Shampoo de Caballo Montis 650 ml | SICARÚ

**Meta descripción sugerida:**  
Conoce el Shampoo de Caballo Montis de 650 ml, con biotina y colágeno hidrolizado según su etiqueta. Consulta disponibilidad en SICARÚ.

## Retirar o no repetir sin evidencia

- **“Libre de parabenos”**: aparece en la ficha web indexada, pero no tiene verificación suficiente en las fuentes revisadas.
- “Cabello saludable y brillante” como promesa de efecto garantizado: evitar sin respaldo.
- Afirmaciones de crecimiento capilar, control de caída o eficacia médica; la lista de ingredientes del reverso menciona minoxidil **sin concentración comprobada**, por lo que la ficha comercial no debe transformarse en una promesa terapéutica.
- No confundir este producto con shampoo de **cola** de caballo, loción Montis ni shampoo de romero de otra marca.
- No publicar precio de referencia como cambio: Base Maestra documenta $150 MXN en tienda al 21/10/2026, pero la ficha pública indexada exhibe otra cifra histórica; corresponde conciliar el precio actual **por separado** y no tocarlo en este PR.
- No publicar existencias sin conteo o dato vigente verificable.

## Condiciones de implementación

1. Confirmar en Medusa Admin (GET) ID, handle, título, variantes, EAN/SKU y vínculo con `PRD-MONTIS-CABALLO-650`. **Si no coincide, bloquear.**
2. Respaldar título, descripción, metadatos e imágenes actuales con fecha y objeto/ID.
3. Presentar fotografía V2 y texto a propietaria para aprobación visual/comercial específica.
4. Realizar cambio controlado en entorno de pruebas aislado o preparar payload documental; no escribir en Admin de producción por preparar este documento.
5. Comprobar categoría, búsqueda, ficha, CTA WhatsApp y móvil; plan de rollback restaurando valores respaldados.
6. Solicitar autorización separada para publicación.

**Alcance:** identidad, descripción y fotografía principal únicamente. Ninguna propuesta de modificación de precio, inventario, checkout, pagos o envíos.
