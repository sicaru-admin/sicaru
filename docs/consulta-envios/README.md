# Corrección de mensajes de consulta de envíos

Retira DHL como transportista confirmado en Inicio, recordatorios de catálogo, carrito, contacto, página de envíos y enlace de términos. Se armonizan metadatos y CTA; se conserva el número oficial de WhatsApp y el bloqueo de pedidos/pagos online. Sin cambios de tarifas, cobertura, operaciones, backend o credenciales.

Validación: 112 pruebas Node aprobadas, TypeScript sin errores, build con backend inaccesible aprobado, lint sin errores y tres advertencias preexistentes. Se actualizaron expectativas de copia del test preexistente mvp-dhl y exclusivamente la huella de WhatsAppBanner en el manifiesto funcional, tras revisar el cambio de texto; resto de huellas intacto. Regresión adicional impide reintroducir la promesa de transportista/cobertura nacional en los siete puntos públicos.

Navegador integrado contra build local: /envios sin overflow en 320/390/1440, metadata y enlace WhatsApp correcto; Inicio, contacto, términos y carrito sin DHL; /checkout conserva el bloqueo. Sin enviar mensajes ni pedidos. Carrito vacío; el resumen con ítems conserva lógica y está cubierto por código/pruebas, no se declara probado con carrito real conectado. Safari pendiente. Capturas adjuntas de /envios y resultados en qa-local.json.

PR independiente desde main 1f4d8f2. No publicar de forma parcial: puede integrarse en la publicación global de Inicio solo cuando todas las condiciones de la propietaria se cumplan. Reversión: revertir este commit de texto, sin tocar configuración ni datos.
