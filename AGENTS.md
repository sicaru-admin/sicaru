# SICARÚ · Gobernanza técnica permanente

## Alcance y arquitectura

- Aplicar estas reglas a todo el repositorio. Respetar la jerarquía de instrucciones aplicable y las decisiones vigentes de la propietaria dentro de ella. Antes de trabajar, leer las instrucciones aplicables, revisar rama, estado y worktrees, y delimitar el alcance autorizado.
- Conservar la arquitectura existente: Next.js App Router, React, TypeScript, Tailwind y Medusa como backend externo. Reutilizar componentes, utilidades y convenciones antes de introducir dependencias, duplicar lógica o proponer una migración.
- Hacer cambios mínimos y revisables. No mezclar trabajos pendientes ajenos al alcance autorizado. No sobrescribir cambios ajenos ni resolver conflictos descartándolos.
- Verificar el código y las fuentes vigentes; los informes históricos no acreditan el estado actual. No convertir cantidades de catálogo, commits o estados de una auditoría en reglas permanentes.

## Seguridad y datos personales

- No registrar datos personales reales de clientes o terceros, contenido sensible ni cuerpos de solicitudes que los contengan en logs, analítica, capturas, fixtures o reportes. Usar datos sintéticos y diagnósticos mínimos sin información personal. Esta protección no impide usar identificadores públicos, datos comerciales públicos ni información sintética de prueba que no expongan datos personales protegidos o secretos.
- Validar las entradas en el servidor, limitar los datos recabados a lo necesario y evitar exponer detalles internos en errores. Revisar autorización y exposición de datos en endpoints afectados.
- Mantener secretos en mecanismos autorizados del servidor; no incorporarlos al repositorio, al cliente, a URLs ni a evidencias. No leer ni copiar valores secretos sin necesidad para la tarea. Las claves e identificadores explícitamente destinados al cliente pueden usarse conforme a su finalidad y permisos documentados; no tratarlos como secretos ni asumir que una clave es pública solo por su nombre.
- No modificar variables de entorno, permisos, infraestructura ni integraciones fuera del alcance autorizado. Si se detecta un problema de seguridad o privacidad, comunicarlo sin reproducir datos sensibles y corregirlo cuando quede dentro de la tarea ya autorizada. Solicitar ampliación únicamente si la corrección excede ese alcance; una regla escrita no equivale a una corrección implementada.

## Catálogo e identidad de producto

- Corroborar producto, ID de variante, SKU, EAN, marca, tono, numeración, contenido y presentación con la fuente maestra vigente. Conservar ceros iniciales y el formato de los identificadores; no inventarlos ni reasignarlos por similitud de nombre o imagen.
- Mantener separados productos, variantes, tubos, kits y combos. No intercambiar fotografías, existencias, precios ni aprobaciones entre ellos. Ante ambigüedad, dejar el dato pendiente y pedir conciliación.
- No presentar existencias desconocidas como disponibilidad confirmada. Respetar la configuración autorizada de inventario y pedidos pendientes, sin cambiarla para habilitar una acción comercial.

## Precios por variante exacta

- Mostrar un precio solo cuando la variante exacta cuyo precio se presenta pertenezca al producto y esa misma variante tenga `metadata.storefront_price_approved === true`, con un importe calculado válido y finito conforme a las reglas monetarias del backend.
- No heredar aprobación del producto, de otra variante, del primer SKU ni de documentación antigua, aunque exista una sola variante. Un precio calculado por Medusa, una hoja de costos o una cifra citada en un informe no constituyen aprobación comercial.
- Aplicar la misma regla en tarjetas, detalle, selección de variantes, relacionados, carrito, acciones móviles, metadatos y datos estructurados. Si falta aprobación, ofrecer consulta sin publicar un importe inferido.
- No cambiar importes, moneda, impuestos, descuentos, márgenes ni indicadores de aprobación sin autorización comercial explícita y trazable para la variante exacta.

## Catálogo, checkout, pagos y envíos

- Conservar los bloqueos comerciales existentes. La presencia de código, SDK, rutas o credenciales de compra no autoriza activar ventas.
- No habilitar checkout, cobros, creación de pedidos, transportistas, cotizaciones automáticas ni nuevas condiciones de envío sin autorización explícita de la propietaria y validación técnica y operativa del alcance aprobado.
- Mantener los bloqueos de pagos, pedidos y envíos reales durante las pruebas. Se permiten simulaciones aisladas y autorizadas de funciones futuras con datos sintéticos e integraciones simuladas o de prueba, sin activar operaciones reales ni alterar los bloqueos de los entornos operativos.
- Mantener contactos y condiciones comerciales aprobados; no inventar cobertura, tarifas, plazos, disponibilidad, descuentos profesionales ni promesas de atención. Consultar cuando falte confirmación.

## Fotografías e identidad visual

- Usar fotografías originales o material aprobado cuya procedencia y correspondencia con el producto puedan verificarse. Conservar tono, numeración, etiquetas, proporciones, contenido y empaque; evitar recortes que oculten información del producto.
- No generar ni alterar con IA un producto o empaque para presentarlo como fotografía fiel, ni sustituirlo por una imagen genérica sin aprobación explícita. La falta de fotografía debe resolverse con un estado neutral, sin atribuirle una causa no comprobada.
- Respetar la identidad SICARÚ y las decisiones visuales aprobadas: Soft Professional Beauty + Retail, diversidad real, tipografía, paleta y tono de comunicación existentes. Reutilizar tokens y componentes; no rediseñar la marca ni reemplazar material aprobado por iniciativa propia.

## Experiencia, rendimiento y calidad

- Priorizar navegación móvil, legibilidad, búsqueda, selección inequívoca de variantes y contacto útil dentro del modo comercial autorizado. No mejorar conversión mediante precios ficticios, urgencia artificial o promesas sin respaldo.
- Preservar HTML semántico, etiquetas de formularios, navegación por teclado, foco visible, contraste y alternativas textuales. Evitar desbordamientos y controles difíciles de tocar.
- Optimizar imágenes, carga y JavaScript sin degradar fidelidad visual, accesibilidad ni recuperación ante fallos. Mantener límites cliente/servidor y estrategias de caché coherentes; no servir datos personales desde cachés compartidas.
- Ejecutar las comprobaciones pertinentes a cada cambio según scripts y CI reales: lint, TypeScript, pruebas relevantes y build cuando corresponda. No afirmar que una prueba pasó si no se ejecutó; documentar límites por falta de backend o configuración.
- Para cambios de interfaz, verificar móvil y escritorio, imágenes, enlaces y estados vacíos, errores y carga. Para cambios comerciales, cubrir variante exacta, precio sin aprobación, disponibilidad desconocida y continuidad de bloqueos, incluyendo metadatos y accesos alternos.
- Añadir pruebas de regresión cuando protejan una conducta significativa. No modificar snapshots o expectativas solo para ocultar fallos. Revisar el diff final y excluir archivos generados que no correspondan al cambio autorizado, así como cambios ajenos al alcance.

## Git, revisión y publicación

- Trabajar en una rama de tarea con prefijo `codex/`, salvo instrucción expresa distinta, y en un entorno limpio y aislado cuando haya cambios pendientes. No copiar trabajo pendiente al entorno de publicación ni integrar ramas sin revisar su alcance.
- No usar reset destructivo, clean, force-push ni descartar trabajo ajeno. Antes de cualquier operación que pueda afectar cambios existentes, identificar y preservar su estado.
- Preparar commits enfocados, PR con problema, resultado, validación y riesgos, y Preview para revisión cuando se autoricen esas etapas. Las autorizaciones previas siguen vigentes dentro de su alcance, incluidas las que abarquen varias etapas; no solicitar confirmaciones repetidas. La autorización para editar por sí sola no implica autorización para commit, push, PR, fusión o despliegue. Las acciones sensibles no autorizadas requieren aprobación expresa.
- Distinguir trabajo local, revisión en Preview y producción. Verificar rama, revisión y destino reales antes de publicar. No afirmar que producción cambió basándose únicamente en un build o una rama local.
- No fusionar ni desplegar a producción sin autorización explícita. Mantener evidencia suficiente para revisar lo publicado y un plan de reversión proporcional al cambio.

## Fuentes maestras y crecimiento rentable

- Consultar las fuentes maestras vigentes designadas por la propietaria para inventario, costos, precios, identidad y finanzas cuando la tarea dependa de esos datos. No exigir consultas comerciales o financieras para cambios puramente técnicos que no dependan de ellas. Las referencias existentes a Base Maestra Inventario y Precios y SICARU OPERACION MAESTRA son puntos de partida que deben verificarse, no copias eternamente vigentes.
- Antes de usar un dato comercial para tomar una decisión o modificar información comercial, identificar archivo, pestaña o registro, variante y vigencia aplicables. No convertir documentación histórica, fixtures, contenido del storefront o cálculos locales en fuente maestra.
- Si hay conflicto entre fuentes, falta de acceso o aprobación incierta, comunicarlo y detener solo la decisión dependiente del dato. No sincronizar ni escribir automáticamente en hojas maestras, Medusa o sistemas financieros sin autorización específica.
- Proteger el efectivo y el crecimiento rentable: no comprometer compras de inventario, publicidad, suscripciones, crédito, descuentos, reembolsos ni otros gastos sin aprobación. Presentar impacto y supuestos antes de proponer una decisión que afecte caja o margen.
- Distinguir costo, precio de venta, utilidad, impuestos, comisiones y envío. No confundir ventas con efectivo disponible ni estimaciones con resultados; evaluar margen y flujo de caja con datos verificados y sin inventar metas financieras.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
