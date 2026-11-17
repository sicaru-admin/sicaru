# Autorización visual única · Dirección SICARÚ

**Control preparado, sin firma ni aprobación registrada. Las seis imágenes siguen seleccionadas y pendientes de autorización formal.**

- Paquete local: **SICARU-FN-MAESTRO-20261114-01**; ZIP y respaldos conservados localmente, sin subir binarios nuevos.
- Manifiesto compartido: [MANIFIESTO_APROBACION.md](MANIFIESTO_APROBACION.md).
- SHA-256 del archivo Markdown exacto del manifiesto: `bf3f2e1ee348c0ecd0e89f229def5486cb596ead6d5effd92ca083cabea1e98b`.
- Fuente consolidada de las seis imágenes existentes: commit `e4073b729140080d692be728112622685d1ffece`.

La decisión comprende exclusivamente: 17133 Pink Shine primera candidata del lote 1f9c777; 17141 Petal R2; 17136 Piel primera candidata del lote 1f9c777; 28101 Super Blanco R3; 28102 Super Negro R2; 20132 TrueBond R3. Rutas y hashes completos están en el manifiesto. No se solicitan más retoques.

## Decisión pendiente

- [ ] Aprobar visualmente el conjunto exacto de seis archivos y hashes del manifiesto.
- [ ] No aprobar; registrar observaciones.

Nombre/cargo de quien autoriza: ____________________
Fecha y constancia trazable de la decisión: ____________________
Observaciones: ____________________

**Esta aprobación visual no autoriza ninguna actividad productiva del anexo siguiente.** Publicación de imágenes, despliegues, fusión de PR, altas/actualizaciones de Medusa, precios, inventarios, canales, checkout, pagos y Meta necesitan sus autorizaciones específicas. No se permite deducirlas de una firma de aprobación fotográfica. Cambiar selección o bytes exige actualizar la trazabilidad antes de autorizar.

## Anexo informativo · siguiente fase comercial, sin ejecución

Objetivo posterior: seis fichas visibles en https://www.sicarubeauty.com/ como catálogo informativo, con consultas por WhatsApp y manteniendo los bloqueos comerciales vigentes. Este plan no acredita que precios o existencias estén confirmados, ni reabre la auditoría de identidad del backend ya concluida.

| Paso | Actividad y aceptación | Dependencias | Autorización de Dirección necesaria |
|---|---|---|---|
| 0 | Formalizar la selección visual de los seis archivos mediante este control, sin cambiar imágenes. | Manifiesto cotejado y decisión trazable. | Aprobación visual única; no publicación. |
| 1 | Desplegar de forma segura la protección de borradores del backend PR #7: confirmar servicio/versión/persistencia de Meilisearch, consumidores y claves directas; resolver configuración efectiva de arranque y migraciones pendientes; respaldo comprobado, monitorización y recuperación. Repetir aceptación de drafts excluidos y published→draft retirado. | Cerrar las condiciones técnicas de liberación; no depende de la decisión fotográfica. Antes de crear borradores productivos, debe estar resuelta la exposición de búsquedas. | Liberación técnica backend separada, con SHA, ventana y alcance de recuperación. No implica alta ni publicación de productos. |
| 2 | Publicar exclusivamente los seis PNG seleccionados en alojamiento estable propio: HTTPS permanente, acceso anónimo, HTTP 200 image/png y hash idéntico; verificar conservación tras futuros despliegues. Los enlaces GitHub de revisión no sustituyen las URLs públicas del catálogo. | Paso 0. Puede prepararse en paralelo al 1; no se asignan ni publican URLs ahora. | Publicación de fotografías por separado; no fusionar el PR #30 completo para publicar sólo archivos. |
| 3 | Conciliar datos comerciales: confirmar precio realmente aplicado por variante exacta y aprobación para mostrarlo; reconteo físico y evidencia de existencias; cotejo directo de nota V52007133 pendiente. No usar precios de referencia ni cantidades históricas como evidencia de estado actual. | Preparación documental puede avanzar en paralelo; necesaria antes de registrar importes/cantidades o afirmar disponibilidad. | Aprobación comercial individual de precios y de cualquier escritura de inventario, separada de esta selección visual. Si no hay confirmación, precio por consulta y disponibilidad pendiente; nunca inventar cantidades. |
| 4 | Revalidar SKU/handle/categoría contra Medusa justo antes del alta; reutilizar product_id/variant_id/categoría existentes y detener coincidencias múltiples. Crear sólo lo ausente: categoría Uñas profesionales, handle propuesto unas-profesionales, inactiva/interna; seis productos draft sin canales comerciales, con variantes/SKU exactos y fotos del paso 2. Workflow e idempotencia ya ensayados, repetir guardas. | Paso 1 resuelto; paso 2 para fijar imágenes; identidad documental y campos conciliados del 3. No modificar registros ambiguos. | Altas/actualizaciones productivas expresas C-01 y P-17133/P-17141/P-17136/P-28101/P-28102/P-20132. Esa autorización no debe incluir importes o cantidades no aprobados. |
| 5 | Preparar y revisar fichas definitivas: enlaces por handle/ID reales, nombres y descripciones SEO, alt de imágenes, categoría multimarcas y metadatos fieles. Todos los botones de consulta a +52 828 113 6652, con nombre/SKU correcto. Comprobar móvil/escritorio, galería, búsqueda y ausencia de precios/disponibilidad inferidos. | IDs y medios conciliados; criterios comerciales del 3. Ensayo en revisión antes de exponer públicamente. | La preparación de código puede revisarse aparte; integración y despliegue públicos necesitan aprobación explícita. Conservar checkout/pagos bloqueados. |
| 6 | Autorizar visibilidad: categoría activa/pública y productos published, sólo con asociaciones al canal del catálogo que sean necesarias y aprobadas. Verificar seis fichas, URLs de fotos, SEO, búsqueda y WhatsApp en producción tras la liberación autorizada. | Pasos 1–5 aceptados. Si Dirección admite catálogo con datos aún pendientes, mostrar consulta y disponibilidad por confirmar; no presentar stock ni precio no aprobado. | Autorización comercial de publicación de categoría/productos y liberación frontend separada; no activa venta, pagos o envíos. |
| 7 | Integración posterior con Meta: preparar feed sólo de productos publicados/autorizados, SKU estables, URLs públicas, fichas canónicas y datos comerciales validados; revisar requisitos vigentes y errores antes de activar. Nunca enviar borradores, categorías internas o disponibilidad ficticia. | Paso 6, URLs estables del 2 y datos comerciales del 3 compatibles con los requisitos del catálogo Meta. | Autorización específica de feed/catálogo. Publicidad, campañas y cobros no forman parte de esta etapa ni se activan. |

### Riesgos que deben cerrarse antes de liberar

- El rebuild actual del PR #7 vacía y repuebla el índice; no es un swap atómico. Mantener las búsquedas nativas de Medusa durante conciliación, identificar clientes directos y no prometer continuidad para ellos. Si falla, recuperar conectividad y reconstruir desde Medusa con protección vigente; no volver a exponer un índice antiguo que contenga borradores. No desplegar mientras Meilisearch/configuración/migraciones o recuperación sigan sin resolver.
- Precio calculado por Medusa no equivale a aprobación comercial. La variante exacta debe tener precio válido y autorización de mostrarse (regla actual storefront_price_approved); de lo contrario, consulta sin importe. Cualquier cambio del importe o de esa aprobación es una escritura comercial que requiere permiso.
- Un registro estructural de inventario o price_set vacío no acredita stock ni precio. La creación de borradores no permite inventar niveles, reservas, movimientos o importes. La publicación del catálogo informativo no debe activar checkout ni pagos.
- Las 28 vulnerabilidades de dependencias siguen como trabajo separado, con priorización de exposición productiva, actualización candidata, pruebas y rollback propios. No se cambian versiones en esta entrega.

Esta entrega compartida consta **sólo de tres documentos**. No incorpora imágenes/ZIP, cambios de aplicación, nuevos previews manuales ni acciones de producción. Un push documental a la rama puede activar el flujo automático de comprobación/preview ya configurado; no autoriza promoción ni publicación productiva y no cambia los activos de las fichas.
