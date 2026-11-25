# SICARÚ · Recuperación comercial del sitio — 25 de noviembre de 2026

**Estado: IMPLEMENTADO EN RAMA / PENDIENTE DE VALIDACIÓN PREVIEW. NO PUBLICADO.**

## Base verificada
- `main` antes del cambio: `3e3253db2a1eb5b8c9e0d5241dfabb3653a053be` (PR #35, recortes XIOMARA).
- Auditoría pública: 12 productos y 7 tarjetas sin fotografía; enlace Herramientas Pro con 0 productos; búsqueda, menú y WhatsApp operativos; 28 cargas en 390/1200 px y 26 rutas HTTP 200.
- Dirección visual aprobada: PR #40 (categorías) y #46 (escala del nombre en header), contraste reforzado en PR #47. El banner morado humano de #44/#47 sigue condicionado por calidad y procedencia; excluido.

## Cambios propuestos
1. **Categorías:** disposición fotográfica C previamente aprobada, con cuatro destinos visibles: Tratamientos, Coloración, Herramientas y Para profesionales. Imágenes **reales del repositorio**, sin reconstrucción. Textos y colores de contraste de PR #47.
2. **Herramientas:** dado que su categoría tiene 0 productos registrados en Medusa, el bloque dirige a WhatsApp oficial con una consulta de herramientas, sin afirmar disponibilidad, SKU o precio.
3. **Navbar:** escala tipográfica de PR #46, sin alterar `BrandWordmark` ni recortar `logo-dark.png`, `logo-cream.png` o `logo-violet.png`.
4. **Destacados:** consultar lista (hasta 100, sin escritura de datos), conservar solo fichas con URL de fotografía de `thumbnail` o primera imagen, presentar máximo 4. Ficha sin imagen no se borra del catálogo. No supone stock o precio aprobado.
5. **Catálogo completo:** fotografías primero en orden **estable**; siguen presentes todos los registros originales, incluso los que no tienen foto. Búsqueda conserva el término y funciona sobre el catálogo completo.
6. **Pruebas:** suite de navegador adaptada a categorías fotográficas y CTA de herramientas; pruebas puras que exigen no eliminar registros; huellas protegidas actualizadas solo para los componentes revisados.

## Restricciones
- No incorpora fotografía humana conceptual del banner (PR #44/#47) ni activa un hero no aprobado final.
- No cambia homepage `HeroSection` ni `HomeHeroVisual`, orden de secciones de la home, checkout, Medusa, imágenes de producto, variantes, costos, existencias, precios, política de envío ni pagos.
- Preserva PR #35 y sus dos recortes originales.
- MONTIS 500 vs 650 ml y KÜÜL 1 L vs 1 kg siguen bloqueados.
- Catálogo limitado a los registros vigentes; aún deben verificarse fotos y fichas faltantes en fuente maestra.

## Verificación requerida antes de publicar
- CI: lint, TypeScript, Node tests, backend offline, build, screenshots móviles 320/375/390, tablet 768 y escritorio 1440.
- Preview con Vercel READY; comprobar disposición, fotografías y enlaces visibles, contraste y sin overflow; revisar Safari cuando el entorno lo permita.
- La Preview podrá carecer de clave Medusa aplicable a esta rama; no modificar variables sin autorización. Si faltan productos, usar pruebas con fixture **solo como pruebas** y jamás presentarlas como validación del catálogo real.
- Confirmar en producción, tras **autorización expresa de merge**: deployment SHA, home y catálogo, dos XIOMARA, WhatsApp SKU/variante, herramientas hacia WhatsApp, carrito informativo y checkout deshabilitado.

## Rollback
Si se autoriza publicación y aparece regresión, recuperar deployment / commit de producción previo `3e3253db2a1eb5b8c9e0d5241dfabb3653a053be`, evitando tocar datos de Medusa. Ningún archivo comercial original fue eliminado.

**No cerrar la incidencia #48 hasta pruebas funcionales y visuales aprobadas y autorización de producción.**
