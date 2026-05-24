# Plan de Pruebas — Sistema de Inclusión Laboral
**Versión:** Final  
**Aplica a:** Tecnología y Alimentos & Bebidas  
**Objetivo:** Verificar que todo funciona antes de cerrar el desarrollo.

---

## Cómo usar este documento
- ✅ Marcar cuando la prueba pasa
- ❌ Marcar si falla (anotar qué pasó)
- ⏭️ Omitir si no aplica a tu programa

Cada prueba indica **dónde hacerla** y **qué resultado esperado** debes ver.

---

## BLOQUE 1 — Menú y carga del sistema

| # | Prueba | Cómo hacerla | Resultado esperado |
|---|--------|--------------|-------------------|
| 1.1 | El menú aparece al abrir | Abrir la hoja de cálculo | Menú "💻 Tecnología" o "🍔 Alimentos y Bebidas" visible en la barra |
| 1.2 | El menú tiene las secciones correctas | Clic en el menú | Ver: ACTUALIZAR TODO, APLICAR ACTUALIZACIONES, Datos, Directorio CREAMOS ID, Cohortes, Reportes, Power BI, Herramientas, Configuración |
| 1.3 | No aparecen botones eliminados | Revisar submenús | NO debe aparecer: "Diagnosticar IDs", "Activar Mejoras Entrevistas", "Activar Traslados", "Instalar Cambios Nuevos" |
| 1.4 | Items de setup están en Configuración | Abrir ⚙️ Configuración | Debe contener: "Importar Datos Históricos", "Instalar/Actualizar Reportes", "Crear Tabla PowerBI_Export", "Verificar Instalación" |

---

## BLOQUE 2 — Flujo principal de participantes

| # | Prueba | Cómo hacerla | Resultado esperado |
|---|--------|--------------|-------------------|
| 2.1 | Agregar persona en Hoja de Interés | Escribir nombre en columna Nombre → Tab | El sistema autocompleta Creamos ID, DPI, Edad, Zona si existen en el directorio |
| 2.2 | Autocompletado no asigna ID equivocado | Escribir solo primer nombre (ej. "María") | NO debe autocompletar con el ID de "María González" — debe quedarse vacío o marcar ⚠️ |
| 2.3 | Autocompletado con nombre completo | Escribir nombre completo exacto | Sí debe autocompletar correctamente |
| 2.4 | Nombre ambiguo no se autocompleta | Escribir un nombre que comparten 2 personas en el directorio | NO autocompleta. El campo queda vacío. |
| 2.5 | Cambio de estado en Hoja de Interés | Cambiar columna Estado a "Interesada/o" | Aparece el diálogo UNA SOLA VEZ (no dos veces) |
| 2.6 | Marcar como "Reprogramada" | En Hoja de Interés, cambiar estado a "Reprogramada" | Aparece diálogo de fecha UNA sola vez |
| 2.7 | Pasar a Entrevistas | En Hoja de Interés, cambiar estado a "Entrevistar" | La persona aparece en hoja Entrevistas con sus datos |
| 2.8 | Resultado de entrevista | En Entrevistas, seleccionar resultado | Diálogo aparece UNA sola vez. La persona pasa a la hoja correspondiente |
| 2.9 | Enviar a cohorte | En Inscritx, marcar "Enviar a Cohorte" | Diálogo de selección aparece UNA sola vez. La persona aparece en la cohorte |

---

## BLOQUE 3 — Deserción y Graduación (sin duplicados)

| # | Prueba | Cómo hacerla | Resultado esperado |
|---|--------|--------------|-------------------|
| 3.1 | Marcar deserción | En una cohorte, cambiar estado a "Retiradx" | Diálogo aparece **UNA sola vez** |
| 3.2 | Sin duplicado en Retiradx | Después de marcar deserción | La persona aparece **UNA sola vez** en la hoja Retiradx |
| 3.3 | K11 no se borra | Después de marcar deserción | La celda de estado (K11 o equivalente) mantiene "Retiradx" — no queda vacía |
| 3.4 | Graduación individual | Cambiar estado a "Graduada" en cohorte | Diálogo aparece **UNA sola vez** |
| 3.5 | Sin duplicado en Graduadx | Después de marcar graduación | La persona aparece **UNA sola vez** en hoja Graduadx |
| 3.6 | Finalizar cohorte | En hoja Cohortes, marcar cohorte como "Finalizada" | Diálogo aparece **UNA sola vez**. Solo los activos pasan a Graduadx (los Retiradx no) |
| 3.7 | Retirados no graduados al finalizar | Tener una persona Retiradx en la cohorte antes de finalizar | Esa persona NO aparece en Graduadx al finalizar la cohorte |

---

## BLOQUE 4 — Directorio CREAMOS ID

| # | Prueba | Cómo hacerla | Resultado esperado |
|---|--------|--------------|-------------------|
| 4.1 | Actualizar desde directorio manual | Menú → Directorio → 🔁 Actualizar desde directorio | Rellena campos vacíos (Creamos ID, DPI, etc.) sin borrar los que ya tienen datos |
| 4.2 | Placeholder "⚠️ Crear perfil" se reemplaza | Poner "⚠️ Crear perfil" en celda de Creamos ID de alguien que sí está en el directorio, luego ejecutar Actualizar | La celda debe cambiar al ID correcto y el color naranja debe desaparecer |
| 4.3 | Auditoría detecta IDs correctos | Menú → Directorio → 🕵️ Auditar IDs | Personas con ID correcto aparecen en verde |
| 4.4 | Auditoría detecta IDs incorrectos | Tener una fila donde el nombre no coincide con el ID | Aparece en amarillo con mensaje "Nombre no coincide" |
| 4.5 | Auditoría detecta IDs inexistentes | Tener una fila con un ID inventado (ej. "ABC123") | Aparece en rojo con mensaje "ID no existe" |
| 4.6 | Limpieza borra IDs incorrectos | Menú → 🧹 Limpiar IDs que no corresponden | Muestra lista de lo que va a borrar, pide confirmación, luego borra solo los incorrectos |
| 4.7 | Limpieza conserva IDs correctos | Después de la limpieza | Las personas con ID correcto mantienen su ID intacto |
| 4.8 | Limpieza revisa TODAS las hojas | Ejecutar limpieza con cohortes activas | El toast debe mostrar "Revisando 'NombreCohorte'..." para cada cohorte |
| 4.9 | Reporte sin Creamos ID | Menú → 📋 Reporte: personas sin Creamos ID | Crea hoja "📋 Sin Creamos ID" con lista de personas. Pregunta si marcar con ⚠️ |
| 4.10 | Marcar "⚠️ Crear perfil" | En el reporte, responder Sí a marcar | Las celdas vacías de Creamos ID quedan con fondo naranja y texto "⚠️ Crear perfil" |

---

## BLOQUE 5 — Importación desde Kobo

| # | Prueba | Cómo hacerla | Resultado esperado |
|---|--------|--------------|-------------------|
| 5.1 | Importar datos nuevos | Menú → Datos → 📥 Importar Datos Nuevos | Importa sin errores. Muestra cuántos registros nuevos se agregaron |
| 5.2 | No duplica registros | Importar dos veces seguidas | El segundo import no agrega duplicados |
| 5.3 | Auto-importación activa | Menú → Datos → ⏰ Activar Auto-Importación | Confirma que el trigger fue instalado. Los datos se actualizan solos cada 10 min |

---

## BLOQUE 6 — Reportes

| # | Prueba | Cómo hacerla | Resultado esperado |
|---|--------|--------------|-------------------|
| 6.1 | Guardar reporte mensual | Menú → Reportes → 📊 Guardar Mensual | Se guarda el resumen del mes actual sin errores |
| 6.2 | Generar mes anterior | Menú → Reportes → 📅 Generar Mes Anterior | Genera el reporte del mes anterior correctamente |
| 6.3 | Conteo de Inscritx correcto | Revisar hoja Cohortes | El conteo de inscritas/os activos es correcto (los retirados no cuentan) |

---

## BLOQUE 7 — Power BI Export

| # | Prueba | Cómo hacerla | Resultado esperado |
|---|--------|--------------|-------------------|
| 7.1 | Actualizar ahora | Menú → Power BI → 🔄 Actualizar ahora | La hoja PowerBI_Export se actualiza con los datos más recientes |
| 7.2 | Auto-actualización activa | Menú → Power BI → ⏰ Activar Auto-Actualización (2 AM) | Confirma trigger instalado |

---

## BLOQUE 8 — APLICAR ACTUALIZACIONES

| # | Prueba | Cómo hacerla | Resultado esperado |
|---|--------|--------------|-------------------|
| 8.1 | Botón funciona | Menú → 🆕 APLICAR ACTUALIZACIONES | Ejecuta 5 pasos mostrando progreso en toast. Termina sin errores |
| 8.2 | Repara trigger si faltaba | Borrar manualmente el trigger onEdit, luego ejecutar APLICAR ACTUALIZACIONES | El trigger se reinstala automáticamente |

---

## BLOQUE 9 — Llamadas y seguimiento

| # | Prueba | Cómo hacerla | Resultado esperado |
|---|--------|--------------|-------------------|
| 9.1 | Registrar llamada | En Hoja de Interés, marcar "1ra Llamada" | Diálogo de registro aparece **UNA sola vez** |
| 9.2 | Registrar entrevista Kobo | En hoja Entrevistas, cambiar estado a "Llenar Kobo" | Formulario abre **una sola vez** |
| 9.3 | Traslado entre programas | En Entrevistas, seleccionar "Enviar a otro programa" | Diálogo aparece **UNA sola vez**. La persona aparece en el otro programa |

---

## BLOQUE 10 — Verificación final del sistema

| # | Prueba | Cómo hacerla | Resultado esperado |
|---|--------|--------------|-------------------|
| 10.1 | Sin errores en logs | Apps Script → Ver → Logs | No hay errores rojos en las últimas ejecuciones |
| 10.2 | Un solo trigger onEdit instalado | Apps Script → Disparadores | Debe haber exactamente **1** trigger de tipo "Al editar" (alEditarTech o alEditarAB) |
| 10.3 | Sin sintaxis errores | Guardar el script en GAS | No aparece ningún error de sintaxis al guardar |
| 10.4 | Verificar instalación | Menú → Configuración → ✅ Verificar Instalación | Reporte muestra todo en verde o con advertencias menores |

---

## Resumen de verificación final

| Módulo | Estado | Notas |
|--------|--------|-------|
| Menú limpio | ⬜ | |
| Flujo de participantes | ⬜ | |
| Sin diálogos dobles | ⬜ | |
| Sin duplicados Retiradx/Graduadx | ⬜ | |
| Autocompletado seguro (sin falsos positivos) | ⬜ | |
| Limpieza de IDs | ⬜ | |
| Reporte sin Creamos ID | ⬜ | |
| Importación Kobo | ⬜ | |
| Reportes mensuales | ⬜ | |
| Power BI | ⬜ | |
| Un solo trigger | ⬜ | |

**Sistema listo para producción cuando todos los bloques tengan ✅**
