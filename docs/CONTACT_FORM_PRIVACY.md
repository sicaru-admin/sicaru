# Privacidad del formulario de contacto · 2026-10-29

## Alcance y evidencia

Revisión aislada desde `origin/main` en `3e0c6cadb13063ff24237da747d8547eecd14f5a` (incluye PR #15), sin copiar cambios pendientes de otros worktrees ni leer datos de clientes, secretos o logs de producción.

`ContactFormClient.tsx` envía nombre, correo, teléfono opcional, asunto y mensaje por JSON a `POST /api/contact`. Antes de la corrección, cualquier solicitud JSON cuyos cuatro campos obligatorios fueran truthy ejecutaba `console.log("[Contact Form Submission]", ...)` con los cinco campos y una fecha ISO. No había condición por entorno: podía aparecer en stdout del proceso Next.js y, si el proveedor lo captura, en logs de ejecución. La revisión no confirma existencia, acceso ni retención de registros históricos en producción.

Los campos obligatorios ausentes/vacíos devolvían 400 antes del log. Errores de parseo o excepciones devolvían 500 genérico sin registrar la excepción. El cliente no registra el formulario. WebVitals envía métricas de rendimiento, sin campos del formulario ni URL de WhatsApp; no se encontró otra integración de analítica del formulario en el código revisado.

## Corrección mínima

Se elimina el log completo sin sustituirlo por otro registro. No se modifica la petición, validación existente, estado de la interfaz, respuesta ni construcción del enlace de WhatsApp. No se agregan dependencias ni servicios. La respuesta conserva `ok` y `whatsappUrl`; ese enlace contiene nombre, asunto y mensaje codificados como parte de su finalidad existente. Correo y teléfono no se incorporan al enlace.

Solo cambia código de aplicación en `src/app/api/contact/route.ts`. El catálogo, precios, carrito, checkout y el número/enlaces de contacto por WhatsApp conservan su código. Las pruebas existentes de hashes protegidos y bloqueos comerciales verifican ese alcance.

## Regresión sintética

`tests/contact-privacy.test.mjs` ejecuta el handler real transpilado con TypeScript, `NextResponse` real y consola aislada, sin red externa. Usa exclusivamente identidad inventada, correo `example.invalid` y teléfono ficticio. Cubre teléfono presente, vacío y ausente; cada campo obligatorio faltante o vacío; JSON malformado, excepción con contenido sintético y cuerpo nulo; respuesta y codificación exactas del enlace; ausencia de logs en todos los casos.

La prueba de envío válido falló contra el handler original al capturar todos los campos sintéticos en consola. Tras retirar el bloque pasa. CI ya ejecuta `tests/*.test.mjs`, por lo que incluye automáticamente esta regresión.

## Límites y riesgo previo de operación

El código vigente NO entrega el formulario a un buzón, backend o servicio de mensajes: solo devuelve un enlace de WhatsApp. El cliente ignora `whatsappUrl` y muestra «¡Mensaje Enviado!»; su enlace posterior de WhatsApp es genérico. El log eliminado no constituía un mecanismo de entrega. No puede acreditarse entrega de mensajes, ni antes ni después de este cambio. Hace falta una decisión explícita sobre el flujo de contacto; no se introduce una integración externa ni se altera WhatsApp dentro de esta corrección de privacidad.

La validación del servidor existente comprueba presencia, no formato ni tipos. Se conserva sin ampliar el alcance. Este cambio evita el registro desde la aplicación; no elimina logs históricos ni audita políticas del proveedor, proxies o capturas externas. No se modifica infraestructura, datos reales ni producción.

Reversión: revertir el commit restaura el handler anterior, pero también su exposición de datos personales; evaluar ese riesgo antes de revertir.

## Resultados de validación

- `npm run lint`: código de salida 0, sin errores; tres advertencias previas en carrito (dos usos de img) y blog (variable sin uso), fuera del diff.
- `npx tsc --noEmit`: código de salida 0 antes y después del build.
- `node --experimental-vm-modules --test tests/*.test.mjs`: 37/37 pruebas pasan, incluidas las tres regresiones nuevas, reglas de aprobación por variante, precios del carrito, hashes protegidos y bloqueo de pagos/pedidos.
- `NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://127.0.0.1:9999 NEXT_PUBLIC_CATALOG_MODE=true npm run build`: código de salida 0 con backend deliberadamente inaccesible. El primer intento falló por DNS de Google Fonts; se repitió con acceso de red y pasó sin cambiar código ni configuración.
- `git diff --check`: sin errores. Sin cambios de dependencias, variables de entorno persistentes, archivos comerciales o infraestructura.

No se ejecutaron pruebas de entrega externa ni operaciones reales, ni despliegues. Las comprobaciones de comportamiento ejecutan el handler real y las pruebas comerciales locales; no acreditan una auditoría de producción ni una revisión visual completa en navegador.
