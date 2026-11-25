# SICARÚ · Nuevos recortes aportados por la propietaria · XIOMARA

**Estado actualizado 25/11/2026: CANDIDATOS WEB INCORPORADOS AL PR #34; archivos comprobados en GitHub y Vercel Preview. NO ASOCIADOS EN MEDUSA Y NO PUBLICADOS EN PRODUCCIÓN.**

Fecha de entrega: 24 de noviembre de 2026. Origen: dos PNG RGBA adjuntados por la propietaria al proyecto web. Los archivos contienen envases reales ya recortados y fueron identificados visualmente por el texto impreso en cada etiqueta. **No usar los nombres de archivo para deducir el producto sin cotejar la imagen.**

## Identidad y prioridad

| Fotografía entregada | Producto correcto | Handle Medusa | Candidato para Preview |
| --- | --- | --- | --- |
| `Botella de shampoo Platinum profesional.png` (envase azul) | **XIOMARA Shampoo Platinum 250 ml** | `xiomara-shampoo-platinum-250ml` | `public/images/products/xiomara-shampoo-platinum-250ml/01-principal-recorte-propietaria-candidato.webp` |
| `Botella de shampoo Platinum Xiomara.png` (envase morado, letras verdes) | **XIOMARA Shampoo Platinum Libre de Sulfatos 250 ml** | `xiomara-shampoo-platinum-libre-sulfatos-250ml` | `public/images/products/xiomara-shampoo-platinum-libre-sulfatos-250ml/01-principal-recorte-propietaria-candidato.webp` |

Ambos originales: **1086×1448 RGBA**, máscara alfa real.

## Procesamiento técnico, sin retoque de producto

- Composición de cada PNG original al centro de lienzo **1600×1600 transparente**, sin cambiar el tamaño nativo, sin reconstruir etiqueta/empaque, sin modificar RGB/alpha, sin IA, sin eliminar sombras propias. Coordenadas de pegado: `x=257, y=76`.
- Exportación **WebP lossless** con transparencia. Verificación: archivo decodifica correctamente, 1600×1600 RGBA; la composición sobre fondo `#FAF8F5` es **idéntica píxel por píxel** al PNG original colocado en el mismo lienzo (máxima diferencia RGB = 0).

| Producto | SHA-256 PNG fuente | SHA-256 WebP candidato | WebP bytes |
| --- | --- | --- | ---: |
| Platinum azul | `1bf849880929b5df388b58aeed27bfac88da8fbabcd7fe9ca776de2dc36f7e80` | `868c47a8d945eb3406b2446557a2ce9aca2d35e5c430a1eb124693dc23a9eb85` | 402958 |
| Platinum Libre de Sulfatos morado | `0d0a082119ed802ed0d7dfca01ab899e639d3310ea0ba7a17b938ac0494485c1` | `5d829ee65edfe4618eb74a64d62b91db7aa592c4e768823cce4890e43c1bc07f` | 536118 |

El ZIP con los dos WebP, `MANIFIESTO_RECORTES.json` y `LEEME_Codex.txt` se entregó en la conversación con el nombre `SICARU_XIOMARA_2_RECORTES_PARA_PREVIEW_NO_PUBLICAR.zip` y **ya fue recibido e integrado por Codex en el PR #34**. Verificado: ambos archivos están presentes en las rutas exactas, sus hashes SHA-256 y dimensiones coinciden con el manifiesto, CI `45551071706` concluyó **success**, Vercel deployment `dpl_FoJ1qtKo4XjE8rnrWdxaGP7qiafj` **READY**, SHA `47587366bf26d87ac990c4673476fa195a5a4b88`. [Comparativa de dos productos en la Preview](https://sicaru-j5v8rxagz-sicaru-admins-projects.vercel.app/qa/reparacion-shampoos/recortes).

## Reglas de integración

1. **Completado en PR #34:** ZIP íntegro recibido, hashes confirmados e incorporación de ambos WebP a la rama de revisión.
2. Conservar intactos los archivos actuales `01-principal.webp` y los masters históricos `01-principal-r3.webp` del PR #32. Los nuevos se agregan como **terceros candidatos** para comparación; no sustituir a ciegas.
3. Preparar comparativo **actual / R3 anterior / nuevo recorte de la propietaria** en tarjetas reales y galería 320/390/1440 px; revisar pump, alpha/bordes, letras, fondo marfil y nitidez a escala real.
4. Confirmar ID Medusa, handle, EAN/SKU, presentación 250 ml, galería y asociación actual antes de proponer las sustituciones; usar los ID verificados en `matriz-sustitucion-shampoos-2026-11-22.md` como antecedente, no prueba actual.
5. No editar precio, costo, inventario, pagos, envíos, metadatos comerciales ni Medusa de producción; **sin publicar**, hasta aprobación explícita de la candidata ganadora y autorización separada de implementación.
6. El problema de Montis 500/650 ml y el recorte NEKANE Morazul se mantienen como tareas independientes.

Este documento fija procedencia, integridad y plan de revisión de los recortes. **Las fotografías están accesibles en la Preview del PR #34; no se han vinculado a Medusa ni publicado en la web pública.**

## Revisión técnica adicional · 25/11/2026

- La ruta `/qa/reparacion-shampoos/recortes` devolvió HTTP 200 para **ambos productos** y mostró tres versiones (publicada / R3 anterior / nueva candidata) con componentes reales, sin bloqueo de identidad. Esto valida el laboratorio, **no una sustitución comercial**.
- Se decodificaron mediante Pillow los masters R3 publicados de XIOMARA Platinum, XIOMARA Libre de Sulfatos y NEKANE Morazul (frente/reverso). Las bandas horizontales blancas/magenta/verde/cian que algunos visores muestran a la derecha son RGB oculto **con alfa 0**, no fondos visibles de las fichas. Por ejemplo, en el área derecha de cada R3 (`x=1050..1550`, `y=350..1450`) se registraron **0 de 5,500 muestras con alfa positivo**. No usar esa apariencia de un visor que ignora alfa como evidencia de recorte defectuoso.
- NEKANE Morazul cuenta ya con masters R3 de frente y reverso en 1600×1600 y alfa comprobada. Antes de solicitar un recorte nuevo a la propietaria, comparar ambos correctamente sobre fondo `#FAF8F5` en `/qa/reparacion-shampoos`.
- **Dirección visual preliminar:** los dos nuevos recortes aportados por la propietaria son candidatos preferentes por limpieza y fidelidad al origen, pero el veredicto final depende de comparar nitidez y bordes, en **tarjeta real móvil y galería**, con las versiones R3 compuestas sobre marfil. No aprobar sustitución en Medusa por evaluación parcial.
- Siguiente control: capturas fieles de las comparativas en 320, 390 y 1440 px, ampliaciones de dispensadores/bases y consentimiento visual exacto de la propietaria. Ningún cambio en precios, existencias, envíos, pagos o producción.
