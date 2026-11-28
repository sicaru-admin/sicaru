# SICARÚ · Corrección de domicilio y mapa · 25 de noviembre de 2026

**ESTADO: PROPUESTO EN RAMA; NO PUBLICADO.**

## Incidencia
La propietaria indicó «la ubicación también esta mal» después del PR #54. Auditoría de producción, SHA `2c3ed2d9ed6c01422898ee6b1071022372b3ec6c`:

- `src/lib/constants/store.ts` publica incorrectamente `La Plaza, Local 204, Cadereyta Jiménez, Nuevo León, 67480`.
- El mapa embebido usa las coordenadas no validadas `25.5933,-99.9836`.
- `/politica-privacidad` repite «La Plaza Local 204».
- El esquema `LocalBusiness` de `src/lib/schema.ts` omitía calle y código postal.

## Evidencia y límites
- **Perfil actual de Google Maps**: `Sicarú`, place ID `ChIJwc6gTeXbYoYReSmhZYk0oMA`, dirección `C. 20 de Noviembre Nte. 102, colonia centro, 67480 Cadereyta Jiménez, N.L., México`, WhatsApp `+52 828 113 6652`. Se consultó tanto la ficha estructurada del negocio como la búsqueda pública de Google Maps.
- **Registros previos de la propietaria y Google Business**: identifican `20 de Noviembre 102` en Cadereyta. Distintos documentos históricos presentan contradicciones sobre **Norte/Sur**, **Plaza San Jorge** y **Local 2 / Local C**. Por consiguiente, este cambio **no afirma número de local ni plaza**, que necesitan verificación física antes de añadirse. Se conserva la forma **Norte 102** publicada en la ficha actual.
- Dirección propuesta: **Calle 20 de Noviembre Norte 102, Col. Centro, Cadereyta Jiménez, Nuevo León, C.P. 67480, México**.
- No se cambiarán los horarios (la web muestra «Lunes a Sábado 9:00–19:00») sin comprobación vigente. La ficha Maps puede mostrar horarios distintos, pendiente fuera de esta corrección.

## Modificaciones en rama
1. `src/lib/constants/store.ts`: dirección central correcta, retiro de coordenadas supuestas y de «La Plaza Local 204», mapa embebido con búsqueda descriptiva de Sicarú + dirección, URL externa de Maps con place ID exacto.
2. `/contacto`: conserva mapa y ofrece **«Ver ubicación de SICARÚ en Google Maps»**, que abre la ficha identificada por place ID.
3. `/politica-privacidad`: usa `STORE.address.full` como fuente común de domicilio, sin alterar procedimiento ARCO o demás textos.
4. `src/lib/schema.ts`: datos estructurados `LocalBusiness` actualizados con calle, ciudad, estado, código postal y propiedad `hasMap` desde la misma fuente.
5. Pruebas `tests/store-location.test.mjs`, cambio de test de privacidad y hash de seguridad de `STORE`.

## Riesgos / QA
- El mapa sin API key resuelve una búsqueda descriptiva y puede mostrar resultados próximos; por ello se agrega un **enlace independiente por place ID**, que apunta a la ficha correcta. Debe comprobarse visualmente la selección final del mapa embebido en el navegador.
- No asumir que la dirección postal verificada identifica el **local interior** exacto; no añadir local hasta que la propietaria lo confirme.
- Verificar que la ficha de Google Business actual es accesible al pulsar el nuevo enlace. Si Google Maps requiere consentimiento o ubicación del navegador, revisar desde un navegador real.
- CI: lint, tipos, tests, guardas de checkout, build sin backend, móviles 320/375/390, contenido de contacto y privacidad.
- Vercel Preview READY, HTTP 200 de `/contacto` y `/politica-privacidad`, comprobar HTML sin referencias obsoletas; si se solicita publicación, requerir **autorización expresa**.
- No modifica precios, fotos, inventarios, Medusa, variantes, pagos, envíos, dominio, secretos o decisiones comerciales.
- Rollback previo SHA `2c3ed2d9ed6c01422898ee6b1071022372b3ec6c`: **contiene ubicación incorrecta**, no reactivarlo sin mitigar el contacto.

## Estado del negocio
**No se modificó Google Business Profile**. Los cambios de este PR afectan solo la web (cuando sea autorizada y publicada). El número de WhatsApp oficial no cambia. En esta fase siguen pausadas las nuevas fotos y altas de catálogo.
