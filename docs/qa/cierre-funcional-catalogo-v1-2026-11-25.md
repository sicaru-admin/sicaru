# SICARÚ · Cierre funcional del catálogo V1 · 25/11/2026

**Estado:** cambios preparados en rama / sin publicación. Catálogo informativo con consulta por WhatsApp; pagos, checkout y envíos automáticos deshabilitados.

## Dirección vigente
Por instrucción de la propietaria «no no, terminemos lo que ya tenemos y después continuamos actualizando fotos» se **posponen las altas y fotografías**, sin descartar registros existentes. No fusionar ni publicar PR #52 de VOGLIA por esta tarea. No crear contenido comercial no validado.

## Estado previo y problemas comprobados
- Producción `www.sicarubeauty.com` en SHA `99011816a39b92a10bfae754b9d8816a9c51d470`, Vercel READY; 12 fichas documentadas. Dos recortes XIOMARA anteriores aprobados y publicados.
- Catálogo limitado: búsquedas de productos no publicados terminan en pantalla sin sugerencia de WhatsApp; crea pérdida de consulta calificada.
- En `/productos`, «Herramientas profesionales» apunta a `/categorias/herramientas-pro`, que durante la auditoría tenía cero productos, pese a que la portada ya lo dirigía a WhatsApp.
- Categorías con cero productos terminan sin opción de asesoría directa, aunque la tienda sí puede atender una consulta.
- Carrito informativo: el texto «Enviaremos producto…» sugiere transmisión automática; en realidad el cliente debe abrir y enviar voluntariamente el mensaje en WhatsApp.

## Cambios delimitados
1. Nueva utilidad `src/lib/catalog-inquiry.ts` que prepara enlaces al WhatsApp oficial **desde STORE.whatsapp** y normaliza/limita términos a 120 caracteres. No invoca Medusa ni crea pedidos.
2. Búsquedas del catálogo con cero resultados: botón para consultar el término exacto por WhatsApp y opción de limpiar búsqueda. No afirmar existencias ni precios.
3. Destino «Herramientas» dentro del catálogo: acceso explícito a consulta por WhatsApp, sin enviar clientes a categoría vacía, manteniendo la categoría histórica para enlaces externos/SEO.
4. Para categorías de Medusa actualmente vacías: mensaje preciso «aún no hay productos publicados» y WhatsApp con nombre de la categoría, además del enlace al catálogo completo.
5. Carrito informativo: texto confirma que el cliente revisa y envía manualmente la consulta, sin venta, pedido ni cobro.
6. Contacto consistente: el pie usa `STORE.email` igual que `/contacto`; `/contacto` y el aviso de privacidad identifican el número oficial como **WhatsApp**, no como teléfono de llamadas. **La recepción real del correo sigue pendiente de verificación**, y el texto jurídico necesita revisión comercial/legal antes de darlo como definitivo.
7. Tests unitarios de enlaces, límites y no intervención de Medusa, pruebas de consistencia de contacto y prueba móvil de búsqueda sin resultados / enlace herramientas. Actualización del hash protegido del componente revisado.

## Excluido del alcance
- Fotos, recortes, fichas nuevas, precios, stock, Medusa Admin/Store, base de datos, pagos, checkout, políticas legales, dominios, credenciales, SEO de fichas existentes, diseño aprobado de inicio y cambios en producción.
- Sustituir o dar por validado el buzón de correo: se armonizan las referencias al correo que ya figuraba en `STORE.email`, sin verificar su recepción ni alterar condiciones legales sustantivas.

## Puertas de verificación
1. GitHub CI: lint, tipos, protecciones de pagos/archivos, pruebas Node y navegador 320/375/390, build con backend no disponible.
2. Vercel Preview `READY`; comprobación de página pública sólo después de autorización de publicación específica.
3. Probar consulta de búsqueda, categorías, carrito y WhatsApp real prellenado sin enviar mensajes; regresión de las fichas XIOMARA, home, catálogo y checkout bloqueado.
4. Si se publica después con aprobación: confirmar Vercel SHA, rutas y enlaces + rollback a `99011816a39b92a10bfae754b9d8816a9c51d470`, sin modificar datos comerciales.

## Pendientes fuera del cierre de esta versión
- Siete fotografías ausentes / fichas sin completar, PR #52 en pausa.
- Conciliación SKU/tonos KÜÜL 7.44, MONTIS 500 vs 650 ml, Cure Me 1 L vs 1 kg.
- Confirmación documental de correos de contacto y revisión de privacidad antes de publicar cambios legales.
- Medición atribuible de consultas a WhatsApp/pedidos web si se habilita en siguiente etapa.

**No cambiar inventario ni afirmar ventas por clics a WhatsApp.**
