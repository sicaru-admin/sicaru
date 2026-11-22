# SICARÚ · Matriz de sustitución propuesta · solo referencia (22/11/2026)

**NO EJECUTAR CONTRA MEDUSA SIN AUTORIZACIÓN ESPECÍFICA.**
Verificación técnica histórica: `docs/catalog/lote-web-01-r2/fixture.json` en PR #29, captura anterior; NO representa una lectura Admin actual. Las URL R3 existen en `main` por PR #32; el HTTP de producción no ha podido verificarse desde esta sesión.

| Producto | ID en fixture histórico | Imagen original documentada | R3 principal propuesta |
| --- | --- | --- | --- |
| XIOMARA Shampoo Platinum 250 ml | `prod_01M79C6MFY2YPX504ZMDW9HJ0A` | `/images/products/xiomara-shampoo-platinum-250ml/01-principal.webp` | `/images/products/xiomara-shampoo-platinum-250ml/01-principal-r3.webp` |
| XIOMARA Platinum Libre de Sulfatos 250 ml | `prod_01M79C7BHA8D7GCZG4DTBM1Q68` | `/images/products/xiomara-shampoo-platinum-libre-sulfatos-250ml/01-principal.webp` | `/images/products/xiomara-shampoo-platinum-libre-sulfatos-250ml/01-principal-r3.webp` |
| NEKANE Morazul Shampoo Matizador 300 g | `prod_01M79C817D78WYM8K6D9W32NH1` | `/images/products/nekane-morazul-shampoo-matizador-300g/01-principal.webp` | `/images/products/nekane-morazul-shampoo-matizador-300g/01-principal-r3.webp` |

Galería secundaria propuesta, si la correspondencia se confirma en Admin:
- Xiomara Libre de Sulfatos `/images/products/xiomara-shampoo-platinum-libre-sulfatos-250ml/02-reverso-r3.webp`
- Nekane Morazul `/images/products/nekane-morazul-shampoo-matizador-300g/02-reverso-r3.webp`

**Montis**: la fotografía real frontal en Drive `1gjUv3UiPo-z7UrB7xdpDwAexlVGRn6n9` fue abierta y examinada visualmente el 22/11/2026: envase transparente ámbar con etiqueta negra, dibujo de caballo, texto frontal Shampoo de Caballo y `650 ml` en base. Hay pequeño logotipo MONTIS visible. La Base Maestra `BASE_MAESTRA_PRODUCTOS` fila 580 identifica **Shampoo de Caballo Montis 650 ml**, ID maestro `PRD-MONTIS-CABALLO-650`, EAN físico histórico documentado `7503000640069`. Esta evidencia eleva la foto a **candidata frontal real con identidad y tamaño coherentes**, pero aún no está recortada para web ni aprobada formalmente; no atribuirle inventario ni precio de publicación.

## Precondiciones estrictas

1. Releer por Store/Admin el ID actual, handle, título, ID maestro y URL de cada una de las cuatro fichas. Si cambió un ID, detener.
2. Cotejar el original físico, su EAN y la fotografía candidata de Montis, y presentar preparación visual para aprobación.
3. Comprobar por GET HTTPS 200 los cinco R3 y el preview en móvil.
4. Respaldar `title`, `thumbnail` e `images` actuales exactamente antes de proponer cambio, con rollback a esos valores.
5. No publicar ni actualizar precios/inventario/checkout. No ejecutar borradores de creación de productos antiguos.
