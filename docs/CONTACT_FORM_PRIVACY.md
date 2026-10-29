# Privacidad del formulario de contacto · 2026-10-29

## Alcance y evidencia

Revisión aislada desde `origin/main` en `3e0c6cadb13063ff24237da747d8547eecd14f5a` (incluye PR #15), sin copiar cambios pendientes de otros worktrees ni leer datos de clientes, secretos o logs de producción.

Antes de la corrección, `ContactFormClient.tsx` enviaba nombre, correo, teléfono opcional, asunto y mensaje por JSON a `POST /api/contact`. Antes de la corrección, cualquier solicitud JSON cuyos cuatro campos obligatorios fueran truthy ejecutaba `console.log("[Contact Form Submission]", ...)` con los cinco campos y una fecha ISO. No había condición por entorno: podía aparecer en stdout del proceso Next.js y, si el proveedor lo captura, en logs de ejecución. La revisión no confirma existencia, acceso ni retención de registros históricos en producción.

Los campos obligatorios ausentes/vacíos devolvían 400 antes del log. Errores de parseo o excepciones devolvían 500 genérico sin registrar la excepción. El cliente no registra el formulario. WebVitals envía métricas de rendimiento, sin campos del formulario ni URL de WhatsApp; no se encontró otra integración de analítica del formulario en el código revisado.

## Corrección mínima

Se elimina el log completo sin sustituirlo por otro registro. El formulario ahora solicita y transmite únicamente nombre, asunto y mensaje. El servidor exige los tres como cadenas de texto no vacías (rechaza espacios solos y tipos incorrectos), ignora campos adicionales no utilizados y no los registra ni devuelve. Se conserva la respuesta y la construcción del enlace de WhatsApp. La interfaz ahora consume el enlace devuelto y explica el paso voluntario de envío. No se agregan dependencias ni servicios. La respuesta conserva `ok` y `whatsappUrl`; ese enlace contiene nombre, asunto y mensaje codificados como parte de su finalidad existente. No se solicitan ni transmiten correo o teléfono desde el formulario.

El código de aplicación cambia únicamente en `src/app/api/contact/route.ts` y `src/components/contact/ContactFormClient.tsx`. El catálogo, precios, carrito, checkout y el número oficial de WhatsApp se conservan. Las pruebas existentes de hashes protegidos y bloqueos comerciales verifican ese alcance.

## Regresión sintética

`tests/contact-privacy.test.mjs` ejecuta el handler real transpilado con TypeScript, `NextResponse` real y consola aislada, sin red externa. Usa exclusivamente identidad y contenido inventados. Cubre solicitudes válidas con solo los tres campos, campos extra sintéticos ignorados, cada campo obligatorio faltante, vacío, con espacios o tipo inválido; JSON malformado, excepción con contenido sintético y cuerpo nulo; respuesta y codificación exactas del enlace; ausencia de logs en todos los casos.

La prueba de envío válido falló contra el handler original al capturar todos los campos sintéticos en consola. Tras retirar el bloque pasa. CI ya ejecuta `tests/*.test.mjs`, por lo que incluye automáticamente esta regresión.

## Confirmación visual neutral

La palomita y el fondo verde de éxito se sustituyen por una burbuja de mensaje decorativa (aria-hidden) en tonos morados SICARÚ. Se conservan «Tu mensaje está listo» y «Aún no se ha enviado». El texto indica que se debe continuar a WhatsApp y pulsar enviar. El verde permanece únicamente en el enlace de WhatsApp.

## Continuación voluntaria por WhatsApp y límites

La implementación previa devolvía `whatsappUrl`, pero el cliente lo ignoraba y mostraba «¡Mensaje Enviado!» sin entregar nada. Por autorización explícita de la propietaria, el cliente ahora muestra «Preparar mensaje» y, tras una respuesta válida del endpoint, «Tu mensaje está listo», junto con «Aún no se ha enviado». El botón «Continuar a WhatsApp» lleva al número oficial +52 828 113 6652 con nombre, asunto y mensaje preparados; el cliente deberá revisar y pulsar enviar en WhatsApp. No hay apertura ni envío automático. El botón «Editar mensaje» regresa al formulario conservando sus valores. El foco pasa al encabezado del mensaje preparado; los errores se anuncian con role=alert.

El cliente solo acepta respuestas exitosas con enlace del prefijo oficial HTTPS; conserva formulario y error ante fallos de red, API o respuesta inválida. El enlace usa noopener, noreferrer y no-referrer. No se agrega almacenamiento persistente ni analítica. El enlace incluye el texto preparado en su query por el mecanismo existente de WhatsApp; solo se navega si el cliente lo elige. Correo y teléfono no se agregan al texto. WhatsApp recibe el contenido al continuar; esta prueba no acredita recepción o entrega, que dependen de la acción posterior del cliente y del servicio externo.

`tests/contact-client.test.mjs` ejecuta el componente real con hooks aislados y renderiza los estados resultantes: valida POST, destino oficial, texto sin confirmación falsa, regreso a edición, solo tres campos required y ausencia de correo/teléfono, carga, errores, rechazo de enlaces externos y ausencia de logs. No envía mensajes ni navega a WhatsApp.

La validación del servidor comprueba presencia y tipo de los tres campos necesarios. Este cambio evita el registro desde la aplicación; no elimina logs históricos ni audita políticas del proveedor, proxies o capturas externas. No se modifica infraestructura, datos reales ni producción.

Reversión: revertir solo el commit de interfaz restaura el flujo previo sin entrega. Revertir también el commit de privacidad restaura el log sensible; evaluar ese riesgo antes de revertir.

## Resultados de validación

- `npm run lint`: código de salida 0, sin errores; tres advertencias previas en carrito (dos usos de img) y blog (variable sin uso), fuera del diff.
- `npx tsc --noEmit`: código de salida 0 antes y después del build.
- `node --experimental-vm-modules --test tests/*.test.mjs`: 41/41 pruebas pasan, incluidas las siete regresiones nuevas, reglas de aprobación por variante, precios del carrito, hashes protegidos y bloqueo de pagos/pedidos.
- `NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://127.0.0.1:9999 NEXT_PUBLIC_CATALOG_MODE=true npm run build`: código de salida 0 con backend deliberadamente inaccesible. El primer intento falló por DNS de Google Fonts; se repitió con acceso de red y pasó sin cambiar código ni configuración.
- `git diff --check`: sin errores. Sin cambios de dependencias, variables de entorno persistentes, archivos comerciales o infraestructura.

No se ejecutaron pruebas de entrega externa ni operaciones reales, ni despliegues a producción. Las comprobaciones de comportamiento ejecutan el handler real y las pruebas comerciales locales; no acreditan una auditoría de producción ni entrega en WhatsApp.

### Navegador local con datos sintéticos

Playwright + Chromium aislados en tmp: PASS a 320, 390 y 1440 px. Se probaron validaciones HTML de los tres campos obligatorios sin POST, ausencia de campos correo/teléfono y petición con exactamente nombre/asunto/mensaje, POST real a la API local, enlace con número/texto exactos, ausencia de apertura automática, foco del estado preparado, edición conservando datos, error HTTP recuperable y ausencia de desbordamiento horizontal. Se bloquearon solicitudes de navegador fuera de localhost y no se pulsó el enlace externo. Se revisaron capturas móvil y escritorio. Los marcadores sintéticos de nombre y mensaje no aparecen en el log del servidor local.
