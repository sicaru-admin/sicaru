# SICARÚ · Piloto Fantasy Nails · Seis fichas web

## Alcance de la rama
- Crea una vista previa interna en `/piloto-fantasy-nails/[slug]` para seis referencias.
- **No** crea productos en Medusa, cambia precios de POS, altera inventario, modifica el checkout ni modifica Meta.
- **No** integra aún imágenes: los campos `imageUrl` están deliberadamente en `null` y muestran un aviso, no una imagen engañosa.
- Las vistas previas incluyen `robots: noindex, nofollow`; no deben enlazarse desde navegación pública.
- Los precios son aprobados según recepción histórica, pero su implementación en POS está por cotejar. La existencia actual no se presume.

## Rutas propuestas (solo en la rama)
- `/piloto-fantasy-nails/gel-rubber-pink-shine` — SKU 17133 — $99
- `/piloto-fantasy-nails/gel-rubber-petal` — SKU 17141 — $99
- `/piloto-fantasy-nails/gel-rubber-piel` — SKU 17136 — $99
- `/piloto-fantasy-nails/gel-polish-super-blanco` — SKU 28101 — $99
- `/piloto-fantasy-nails/gel-polish-super-negro` — SKU 28102 — $99
- `/piloto-fantasy-nails/truebond-sin-acido` — SKU 20132 — $59

## Antes de exponer productos al público
1. Confrontar todos los envases editados con las fotografías originales; no subir versiones con etiquetas reconstruidas.
2. Integrar imágenes aprobadas en el repositorio o almacenamiento estático bajo URL HTTP(S) pública, preferentemente administradas por SICARÚ.
3. Verificar el precio **aplicado** en POS y conservar registros de precio aprobado vs. implementado.
4. Reconteo físico y fecha para cada SKU. No marcar `in stock` solo por la recepción de noviembre.
5. Usar las rutas existentes `/productos/[handle]` **y el modelo Medusa** para el catálogo definitivo, con fichas asociadas a un producto y variante por SKU. La ruta piloto **no es la solución final**.
6. Confirmar si Meta acepta estas fichas conforme a los requisitos comerciales aplicables en México y modo consulta por WhatsApp.
7. Mantener `NEXT_PUBLIC_CATALOG_MODE` habilitado, checkout y pagos deshabilitados; no activar pauta.

## Validación técnica sugerida
- `npm ci && npm run lint && npm run build`
- Verificar la preview de Vercel, las seis rutas y el enlace `wa.me/528281136652`.
- No fusionar a `main` ni publicar sin aprobación de Dirección.


## Paquete fotográfico preparado el 12 nov 2026
Se verificó que existen **seis fotos originales** y **seis versiones 1:1 editadas** en el material suministrado por Dirección. Se preparó localmente el paquete `SICARU_FANTASY_NAILS_ASSETS_WEB_PILOTO.zip`, aún **NO subido al repositorio**.

Destino previsto de los archivos editados en el proyecto:
- `public/images/fantasy-nails/17133.png` — Gel Rubber Pink Shine
- `public/images/fantasy-nails/17141.png` — Gel Rubber Petal
- `public/images/fantasy-nails/17136.png` — Gel Rubber Piel
- `public/images/fantasy-nails/28101.png` — Gel Polish Super Blanco
- `public/images/fantasy-nails/28102.png` — Gel Polish Super Negro
- `public/images/fantasy-nails/20132.png` — TrueBond

El ZIP incluye `manifest.json` con SHA256 y copias originales para contrastar fidelidad. Después de añadir los archivos a GitHub, vincular `imageUrl` únicamente en la rama de prueba y revisar las seis páginas. **No activar ni fusionar producción antes de revisión.**

## Verificación de despliegue
- Despliegue Vercel de commit `683d07f`: **READY** (se confirmó compilación).
- La revisión visual y los accesos externos no fueron confirmados aún; la URL de preview puede estar protegida.
- No se ha realizado importación a Meta ni publicación de productos en Medusa.
