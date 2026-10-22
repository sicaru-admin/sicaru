# Checkout online solo con paquetería cotizada

Decisión de esta etapa, 21 de octubre de 2026: suspender entrega local online y confirmar el costo de paquetería antes de iniciar cualquier pago. Continúa el trabajo de `codex/dhl-provisional` y PR #8; no modifica precios de productos, producción ni el bloqueo pendiente de Mercado Pago `2034 Invalid users involved`.

## Comportamiento

- No se ofrece entrega local de $49, $40 ni entrega local gratuita en los flujos de compra. WhatsApp consulta paquetería sin prometer costo o cobertura.
- Una cotización disponible requiere aprobación comercial explícita, cobertura verificada, MXN, IVA incluido, identidad, huella del carrito/dirección y vigencia. La antigua respuesta `mode=review` y las tarifas sin aprobación no habilitan opciones ni pagos.
- Sin cotización se conservan carrito y dirección, se muestra **Envío por cotizar**, se permite consultar por WhatsApp y se bloquean sesiones de pago y confirmación.
- No se monta el formulario de tarjeta antes de verificar nuevamente la cotización. Cambios de cantidades o dirección y el vencimiento invalidan los pasos siguientes; las respuestas asíncronas anteriores no restablecen una cotización descartada.
- El envío guardado debe coincidir en importe, IVA, opción, `quote_id` y huella. Los descuentos de envío y un total distinto a productos más cotización bloquean el pago. Los métodos locales guardados no se consideran válidos.
- Los importes $214/$270/$118 permanecen referencias no aprobadas; no se utilizan como precios comerciales. La configuración backend continúa deshabilitada. **No se verificó una tarifa DHL comercial real.**

## Verificación local

- 35 pruebas de frontend correctas (`npm run test:shipping`; seis archivos).
- TypeScript correcto (`npx tsc --noEmit`) y compilación Next.js correcta (`npm run build`). El build se verificó con API local sintética y claves públicas ficticias, sin pagos.
- ESLint: cero errores y cuatro advertencias anteriores ajenas a esta corrección.
- 36 comprobaciones de navegador correctas, Chromium a 375 y 320 px. [Resultados completos](verification-2026-10-21/browser-results.json).
- Se probaron cantidades, recarga, agregar/eliminar, dirección, ausencia de cobertura, cotización no aprobada, error 503, preservación del carrito, edición de dirección y bloqueo de pagos.
- El caso positivo usa **solo una cotización sintética de $187.65**: un producto de prueba de $97 da $284.65; tres dan $478.65, IVA incluido una vez. No son tarifas ni nuevos precios aprobados. La UI real se conecta a una API local que simula Medusa; no es una prueba de integración con la base de datos real.
- Cero peticiones a Mercado Pago, creación de pagos o pedidos; cero errores JavaScript. Los 401 de invitada y el 503 son respuestas deliberadas del simulador.

### Evidencia móvil

[Checkout a 375 px](verification-2026-10-21/qa-checkout-pending-mobile-375.png) · [Checkout a 320 px](verification-2026-10-21/qa-checkout-pending-mobile-320.png) · [Cotización sintética](verification-2026-10-21/qa-checkout-cotizacion-sintetica-mobile.png).

### Reproducción del navegador, sin producción

Requiere Playwright y Chromium instalados. El simulador rechaza todos los endpoints de pago y pedido. El navegador aborta las peticiones externas y falla si detecta un intento de iniciar pagos.

1. `node tests/browser/medusa-mock.mjs` en una terminal; solo escucha en `127.0.0.1:9100`.
2. En otra terminal, compilar con `NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://127.0.0.1:9100 NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_synthetic_qa NEXT_PUBLIC_SALES_CHANNEL_ID=sc_qa NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY= npm run build`.
3. Con las mismas variables, `npm run start -- --hostname 127.0.0.1 --port 3100`.
4. `node tests/browser/checkout-parcel.mjs`. Guarda evidencia en `work/qa-output`, o en `SICARU_QA_OUTPUT_DIR`. `SICARU_QA_CHROMIUM` permite indicar el ejecutable de Chromium.

El servidor local y los artefactos compilados con datos sintéticos son exclusivamente de QA; no deben desplegarse. Los artefactos de build no se incluyen en Git.

## Antes de publicar

Obtener tarifa comercial y recargos aprobados, pesos y empaque medidos, cobertura y vigencia verificadas; probar el contrato completo contra Medusa aislado. Resolver la diferencia comercial entre tubo Voglia y combo sin cambiar precios automáticamente. Completar la revisión fiscal de paquetería/descuentos y las pruebas de pago sandbox pendientes con identidades de prueba válidas. Mantener el PR en borrador y solicitar aprobación antes de producción.
