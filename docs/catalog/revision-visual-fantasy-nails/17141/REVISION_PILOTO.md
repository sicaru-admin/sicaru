# Piloto 17141 · Gel Rubber Petal · refinamiento de catálogo

Estado: propuesta refinada para aprobación visual individual. No publicada, no sustituye ningún activo comercial. Exclusivo de 17141; no se han extendido ajustes a los otros cinco SKU. El trabajo backend #7 queda separado y no se ha modificado.

## Entrega

- [Propuesta refinada PNG](17141-catalogo-refinada.png), 2823×2823, RGB sin pérdida, fondo #FAF8F5. Sin textos añadidos.
- [Cuatro vistas lado a lado](17141-comparacion-cuatro-vistas.png): original alineado, máscara refinada, propuesta anterior intacta y propuesta refinada. Las cuatro vistas tienen el mismo encuadre; la lámina es una reducción de visualización. El original completo se conserva por separado.
- [Original de respaldo](17141-original-respaldo.jpeg), 3024×4032, copia byte a byte. [Propuesta anterior](17141-propuesta-anterior.png), copia intacta para comparar.
- [Máscara refinada en coordenadas del original](17141-mascara-refinada.png), 3024×4032: blanco conserva; negro elimina fondo; grises indican cobertura subpíxel.
- [Capa original RGBA con máscara](17141-producto-original-con-mascara.png): canales RGB idénticos a todo el original decodificado, con transparencia independiente. [Sombra separada](17141-sombra.png).
- [Verificación técnica](verificacion-piloto.json) y [script convencional](herramientas/refinar.py).

## Cambios revisados

Se reemplazó el contorno binario dentado por una máscara con trazado manual, alineación óptica local y cobertura subpíxel. Se excluyó fondo neutro adherido usando mediciones de los colores originales en el contorno; no se reemplazaron esos colores dentro del producto. La curva superior se ajustó al borde luminoso medido, evitando que el ruido JPEG del fondo dejara un ribete gris irregular. No se usó IA generativa, clonado, relleno, reconstrucción, cambio de luz, balance de color ni limpieza de imperfecciones del envase.

Se mantiene exactamente el lienzo anterior, la traslación (-5,-475) desde coordenadas del original y la escala 1:1. No se remuestrea el producto. La revisión de máscara redefine qué era fondo conservado por error; no implica transformar o redimensionar el envase.

Sombra nueva: una componente amplia muy discreta y una de contacto más estrecha, suavizadas y compuestas detrás del producto. Se eliminó la mancha alargada de la propuesta anterior. El PNG no contiene logos añadidos, precios ni decoración. Las marcas de la tapa, variaciones de textura y reflejos reales siguen presentes.

## Comprobaciones de fidelidad

- 1,209,917 píxeles opacos del producto: **0 diferencias RGB** frente al original al reabrir el PNG.
- 4,835 píxeles de transición con alfa parcial: se componen con el nuevo fondo para suavizar el borde. Por definición, su RGB visible en la imagen aplanada es una mezcla; **no se afirma igualdad RGB del borde compuesto**. Los RGB de la capa original RGBA permanecen idénticos, incluidos esos píxeles.
- Comprobación independiente de tres zonas totalmente opacas: etiqueta/color del cuerpo, tapa/marcas reales y reflejos de hombros. Todas idénticas al original (coordenadas y cantidades en JSON).
- Original y propuesta anterior conservan sus hashes. Se verificaron también las cinco propuestas restantes contra su manifiesto anterior: ninguna cambió.
- El control RGB verifica ausencia de retoque; la precisión de la silueta y naturalidad de la sombra requieren la aprobación visual humana. No se presenta una prueba de píxeles como sustituto de esa revisión.

## Ampliaciones de bordes críticos

Cada archivo muestra original, máscara, actual y refinada en ese orden. Se recortaron las mismas coordenadas nativas y ampliaron al 200% con vecino más próximo, para no ocultar defectos mediante interpolación. El visor puede reducir la lámina ancha; abrir/descargar a tamaño nativo para inspección 200% real.

| Zona | Lámina |
|---|---|
| Tapa y borde luminoso | [200%](ampliaciones/17141-tapa-200pct.png) |
| Hombros y unión tapa/frasco | [200%](ampliaciones/17141-hombros-200pct.png) |
| Lateral izquierdo | [200%](ampliaciones/17141-lateral-izquierdo-200pct.png) |
| Lateral derecho | [200%](ampliaciones/17141-lateral-derecho-200pct.png) |
| Base | [200%](ampliaciones/17141-base-200pct.png) |
| Sombra/contacto | [200%](ampliaciones/17141-sombra-200pct.png) |

## Zonas que se conservan para revisión

El filo claro superior es un reflejo presente en la fotografía: se conserva. No debe confundirse con la antigua franja gris irregular de fondo. En la unión entre tapa, cuello negro y hombros se preservan pequeñas zonas ambiguas antes que erosionar el borde real. Revisar especialmente ambos extremos de esa unión. En la base, revisar el extremo derecho y la transición de borde oscuro a sombra, donde la fotografía no separa inequívocamente producto y contacto. Puede persistir una transición mínima del gris original por desenfoque óptico: no se ha neutralizado o repintado.

La versión refinada reduce los halos y el escalonado visibles de la anterior; no se declara una extracción perfecta ni una aprobación automática. Si Dirección detecta remanentes en esas zonas, se ajustará exclusivamente la máscara del piloto, conservando el RGB fuente. Esta versión permite decidir sobre contorno, fidelidad y sombra antes de extender el método.

## Decisión de Dirección

- 17141: aprobar visualmente / solicitar ajustes / rechazar: __________
- Observaciones por zona: __________
- La aprobación visual del piloto no autoriza publicación ni sustitución comercial, y no se extiende todavía a otros SKU.

No hubo cambios de sitio, Medusa, precios, inventario o producción; no se fusionaron PR ni se realizaron despliegues. Las fotografías originales permanecen como respaldo intacto.
