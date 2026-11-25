# SICARÚ · Corrección urgente de canal de contacto no verificado
**Fecha:** 25 de noviembre de 2026 · **Estado:** EN RAMA / PENDIENTE DE PRUEBAS Y AUTORIZACIÓN DE PUBLICACIÓN

## Hecho confirmado por la propietaria
Después de publicarse PR #53, la propietaria informó: **«no, yo no tengo ese correo»** respecto a `contacto@sicaru.com`. Dicho buzón se había declarado erróneamente como contacto de SICARÚ. El correo alterno `hola@sicaru.com` tampoco cuenta con aprobación verificada; no usar.

## Evidencia técnica
- Producción Vercel SHA `144ab9489c00b9625dd0f406e288e20b65bb65d8` incluía `STORE.email`, Footer, contacto y aviso de privacidad con el correo inexistente.
- El aviso de privacidad indicaba `mailto:contacto@sicaru.com` en **tres lugares**, uno para derechos ARCO.
- Los términos (rama no catálogo) también indicaban ese correo.
- El formulario `ContactFormClient` solicita nombre/asunto/mensaje y llama `POST /api/contact`. La ruta **no envía correos ni pedidos**: construye un enlace `https://wa.me/528281136652?text=...` que el cliente debe abrir y enviar manualmente. No había una bandeja de recepción de emails conectada a ese flujo.

## Corrección limitada
1. Eliminar la propiedad `email` de `STORE` para evitar que un correo no verificado se propague.
2. Eliminar enlace de correo de pie y página de contacto, conservando WhatsApp `+52 828 113 6652`.
3. En aviso de privacidad: eliminar correo no verificado. Para derechos ARCO, ofrecer **solicitar procedimiento por WhatsApp oficial o directamente en tienda**, sin promover envío informal de documentos de identidad ni alterar el plazo documental vigente. El aviso jurídico sigue sujeto a revisión profesional.
4. Eliminar el correo del texto alternativo de términos, conservando atención por WhatsApp.
5. Prueba de regresión sobre archivos `src` y `public`: cero referencias de esos correos o `STORE.email`, WhatsApp funcional y formulario sin correo/compra automática.

## No afecta
Medusa, catálogo, productos, variantes, precios, stock, facturas, checkout, pago, envío, fotos, banners, paleta, dominio, variables de entorno ni credenciales.

## Gate antes de publicar
- CI de SHA final en verde (lint, tipos, pruebas Node incluyendo nuevas protecciones, build, navegador móvil con backend controlado).
- Vercel Preview READY, verificación de página de contacto, pie, aviso de privacidad y términos en Preview.
- **Autorización expresa de publicación por la propietaria.**
- Después de publicar: hostname `www.sicarubeauty.com`, SHA, ausencia del correo en HTML y enlaces correctos WhatsApp y checkout bloqueado.
- Rollback a deployment `dpl_29YtQMv31V6DDM1ta9qe2ZbP91kt` / commit `144ab948...` en caso de fallo técnico; **ese commit contiene el correo incorrecto, por lo que un rollback debe ir acompañado de una mitigación de contacto apropiada**.

## Pendiente distinto de este PR
No instalar/crear un buzón corporativo ni sustituir otro sin una dirección que la propietaria controle y verifique. Revisar aviso de privacidad con asesoría legal antes de cerrar el trabajo jurídico. Mantener en pausa PR #52 (fotos y alta VOGLIA).
