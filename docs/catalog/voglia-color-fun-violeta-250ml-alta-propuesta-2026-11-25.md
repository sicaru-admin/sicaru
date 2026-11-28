# SICARÚ · Propuesta de primera alta con fotografía real
**Fecha:** 25 de noviembre de 2026 · **Estado:** PREPARADA EN RAMA / NO CREADA EN MEDUSA / NO PUBLICADA

## Identidad documental verificada
- **Producto:** VOGLIA Color Fun / Color & Fun — Vivid Purple (Tinte fantasía Violeta).
- **Presentación:** 250 ml (según etiqueta visible en el archivo real y Base Maestra).
- **SKU proveedor:** `1934`.
- **EAN:** `7501633719343`.
- **ID de Base Maestra:** `PRD-C58CB078FA1F`, fila 409, pestaña `BASE_MAESTRA_PRODUCTOS` de `SICARÚ · BASE MAESTRA INVENTARIO Y PRECIOS 2026`.
- **Precio público:** **$175 MXN**, aprobado el 7/10/2026, según Base Maestra. **NO publicar sin confirmar vigencia/implementación comercial actual.**
- **Conteo físico histórico:** **8 piezas** al 13/11/2026, pestaña `TINTES POR MARCA`, fila 148 de `SICARÚ · INVENTARIO PERLITA · NOVIEMBRE 2026 · CONTEO 13`. El conteo no confirma existencia al 25/11/2026; movimientos POS posteriores podrían no estar conciliados.
- Se buscó `SKU 1934` en `MOVIMIENTOS_INVENTARIO`, `ROTACION_EXISTENCIAS` e `INVENTARIO_VERIFICADO` de `SICARU OPERACION MAESTRA 2026`: sin coincidencia identificada en esas pestañas; **NO asumir que no hubo ventas**.

## Fotografía exacta
- **Original real:** `public/images/products-hero/voglia-color-fun.webp`.
- **Copia para ficha (mismo Git blob, sin recomprimir/retocar):** `public/images/products/voglia-color-fun-violeta-250ml/01-principal.webp`.
- SHA-1 de blob Git para **ambos archivos**: `965b801c2f4cc846222053bfc5be61d5e562320c`.
- Inspección ocular: envase blanco, línea `Color & Fun`, texto `Vivid Purple`, `Tinte de Fantasía Violeta`, `250 ml`.
- La copia en la rama **no modifica la fotografía del hero** ni activa una nueva ficha.

## Campos propuestos para la ficha, NO implementados
- **Título candidato:** `VOGLIA Color Fun Violeta 250 ml · Tinte fantasía semipermanente`.
- **Marca:** `VOGLIA`.
- **Handle candidato:** `voglia-color-fun-violeta-250ml` (verificar colisiones en Medusa Admin antes de usar).
- **Variante candidata:** `Violeta · 250 ml`; código `1934`; EAN `7501633719343`.
- **Categoría:** Coloración / Fantasía (validar colección real en Medusa, no crear categoría inexistente).
- **Descripción comprobable:** `Tinte de fantasía violeta de la línea Color Fun de Voglia. Presentación de 250 ml. Consulta precio vigente y disponibilidad por WhatsApp en SICARÚ.` No agregar promesas de duración, resultados o aplicación sin ficha técnica.
- **Canal de venta:** catálogo informativo; WhatsApp oficial `+52 828 113 6652`; checkout/envío automático deshabilitados.
- Precio aprobado/documental de $175 pero **sin escritura en Medusa**, ni sustitución de otra ficha/ID.

## Bloqueos antes de autorizar alta comercial
1. Confirmar **conteo físico actual** de VOGLIA Color Fun Violeta SKU `1934` y confirmar que corresponde a EAN `7501633719343`.
2. Comprobar **en Admin Medusa en solo lectura** si el producto ya existe como borrador, variante o publicado; el frontend público solo permite constatar que no aparece entre sus 12 fichas visibles. NO crear duplicado.
3. Revalidar precio comercial vigente de **$175** contra POS/base/aprobación posterior y documentación fiscal sin duplicar IVA. No inferir margen sin costo vigente comprobado.
4. Revisar visualmente el recorte sobre marfil y móvil, comprobar transparencia y relación título/tonalidad. La prueba de CI garantiza integridad de bytes, no aprobación estética.
5. Pedir autorización expresa de la propietaria para alta/activación comercial en Medusa y publicación en frontend; conservar rollback y verificar consulta por WhatsApp tras publicación.

## Sin cambios operativos
La rama y PR contienen solo una copia byte a byte de una fotografía previamente existente, una vista QA restringida y pruebas. **No se escriben precios, existencias, productos, variantes o colecciones en Medusa**; no cambian checkout, pagos ni producción.
