# QA local · fotografías nativas por variante

Fixture sintético de solo lectura. No importa SDK ni credenciales, no se conecta
a Medusa y rechaza POST/PUT/PATCH/DELETE. No contiene tonos, SKU, EAN o fotos de
KÜÜL. Los rectángulos SVG dicen PRUEBA QA; son diagramas de identificación visual,
no fotografías de producto. Los datos de disponibilidad son únicamente de prueba.

Con las dependencias del lockfile instaladas (`npm ci`), iniciar en una Terminal:

```sh
node qa/variant-media/server.mjs
```

Usa exclusivamente `127.0.0.1:9000`. Si el puerto está ocupado, identificarlo antes
de continuar; no detener ni usar un backend ajeno como fixture. Si ya está abierto
este fixture, no iniciar una segunda copia.

En otra Terminal, valores exclusivos del proceso local, sin editar `.env`:

```sh
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://127.0.0.1:9000 NEXT_PUBLIC_CATALOG_MODE=true npm run build
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://127.0.0.1:9000 NEXT_PUBLIC_CATALOG_MODE=true npm run start -- --hostname 127.0.0.1 --port 3226
```

Abrir:

- `http://127.0.0.1:3226/productos/qa-galeria-variantes`: general + A (2), B (1), C sin propias.
- `http://127.0.0.1:3226/productos/qa-galeria-sin-general`: placeholder inicial y para C; propias para A/B.
- `http://127.0.0.1:3226/productos/qa-galeria-sin-imagen`: sin imágenes.
- `http://127.0.0.1:3226/productos/qa-galeria-general`: dos generales para cualquier selección.

El fixture solo incluye `variant.images` cuando el cliente pide la expansión;
así se comprueba también el query real del frontend. El thumbnail del producto
con variantes se configura intencionadamente como A para detectar una fuga al
carrito de B. La implementación debe usar B o un fallback general seguro.

Verificar a 320/375/390 y escritorio: elegir A, activar su miniatura 2 por teclado,
cambiar a B y después C; comprobar imagen, cantidad, botón seleccionado, posición
del título, URL sin navegación y consulta WhatsApp. Inspeccionar enlaces sin
abrir WhatsApp ni enviar mensajes. El carrito de esta reproducción es local y
solo debe contener los productos QA; se puede limpiar desde sus controles.

Pruebas reproducibles:

```sh
node --experimental-vm-modules --test tests/*.test.mjs
npx tsc --noEmit --incremental false
npm run lint
```

No ejecutar este servidor ni usar su contenido como datos comerciales. No se
importa desde `src`, no añade rutas al sitio ni carga fotografías en Medusa.
