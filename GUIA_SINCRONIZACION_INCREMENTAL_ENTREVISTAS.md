# Guía: Sistema de Sincronización Incremental de Entrevistas

## 📋 Resumen

Se ha implementado un sistema de **sincronización incremental** para la importación de entrevistas desde KoboToolbox. Esto significa que:

- ✅ **Solo se descargan registros nuevos** desde la última sincronización
- ✅ **Ahorro de tiempo y recursos** (no se re-descargan todos los datos cada vez)
- ✅ **Evita duplicados automáticamente**
- ✅ **Tracking automático** de la última fecha de sincronización

---

## 🆕 ¿Qué cambió?

### Antes
- Se descargaban **TODOS** los registros de Kobo cada vez
- Se procesaban duplicados (aunque no se insertaban)
- Más tiempo de procesamiento

### Ahora
- Solo se descargan registros **nuevos** desde la última sincronización
- El sistema recuerda la fecha de la última importación
- Proceso más rápido y eficiente

---

## 🔧 Nueva URL de KoboToolbox

La URL del formulario de entrevistas se ha actualizado a:

```
https://kf.kobotoolbox.org/api/v2/assets/aF4nMQPqbHokM7rg2Vtf5w/export-settings/es8WpJjRKe9LhhrKPChUpFh/data.csv
```

Esta URL ya está configurada automáticamente en:
- `tech.gs` (línea 30)
- `AlimentosBebidas.gs` (línea 30)

---

## 📚 Campos Mapeados

El sistema ahora mapea **85+ columnas** organizadas en las siguientes secciones:

### 👤 SECCIÓN 1: DATOS PERSONALES
- Creamos ID
- Nombres y apellidos
- Género
- Formación previa
- Sector de interés
- Curso de interés

### 🍎 SECCIÓN 2: ALIMENTOS Y BEBIDAS
**Preguntas del Curso:**
- Por qué te interesa
- Qué te llama la atención
- Expectativas
- Dificultades
- Disponibilidad de prácticas
- Tramitar papelería
- Transporte
- Firmar documento

**Área de Empleabilidad:**
- Situación laboral actual
- Satisfacción con trabajo
- Planes próximos meses
- Importancia de conseguir trabajo
- Ayuda económica
- Dependientes económicos
- Responsabilidades de cuidado
- Deudas bancarias
- Antecedentes penales
- Caso legal
- Disposición a empleabilidad
- Temporalidad de metas

### 💻 SECCIÓN 2: TECNOLOGÍA
(Mismas preguntas que Alimentos y Bebidas)

### 🤝 SECCIÓN 2: SERVICIO AL CLIENTE
(Mismas preguntas que Alimentos y Bebidas)

### 👥 SECCIÓN 3: GÉNERO
- Trabajo en grupos mixtos
- Trabajo en grupos diversos
- Conflictos en casa
- Grupo mayoritario de mujeres
- Igualdad hombres-mujeres
- Familiares en Creamos

### 📝 NOTAS Y METADATOS
- Notas del entrevistador
- `_id`, `_uuid`, `_submission_time`
- `_validation_status`, `_notes`, `_status`
- `_submitted_by`, `_tags`, `_index`
- `__version__`, `meta/rootUuid`

---

## 🚀 Cómo Usar el Sistema

### Paso 1: Primera Importación

1. Abrir el Google Sheet correspondiente (Tech o Alimentos y Bebidas)
2. Ir al menú:
   - **💻 Tecnología → ⚙️ Configuración → 📝 Importar Entrevistas (Detalle)**
   - **🍔 Alimentos y Bebidas → ⚙️ Configuración → 📝 Importar Entrevistas (Detalle)**
3. El sistema descargará **TODOS** los registros (primera vez)
4. Mensaje final mostrará:
   ```
   ✅ Importados: X | Duplicados: Y
   📥 Primera importación (todos los registros)
   ```

### Paso 2: Sincronizaciones Posteriores

1. Ejecutar la misma opción del menú
2. El sistema **solo descargará registros nuevos** desde la última sincronización
3. Mensaje final mostrará:
   ```
   ✅ Importados: X | Duplicados: Y
   🔄 Sincronización incremental (desde DD/MM/AAAA)
   ```

### Paso 3: Ver Estado de Sincronización

Para ver cuándo fue la última sincronización:

1. Ir al menú:
   - **💻 Tecnología → ⚙️ Configuración → 📊 Ver Estado Sincronización**
   - **🍔 Alimentos y Bebidas → ⚙️ Configuración → 📊 Ver Estado Sincronización**

2. Se mostrará un mensaje como:
   ```
   📊 Estado de Sincronización de Entrevistas

   Última sincronización: 24/03/2026 10:30 AM

   La próxima sincronización solo traerá registros nuevos desde esta fecha.
   ```

### Paso 4: Resetear Sincronización (Re-importar Todo)

Si necesitas volver a importar **TODOS** los registros (no solo los nuevos):

1. Ir al menú:
   - **💻 Tecnología → ⚙️ Configuración → 🔄 Resetear Sincronización**
   - **🍔 Alimentos y Bebidas → ⚙️ Configuración → 🔄 Resetear Sincronización**

2. Se mostrará una confirmación:
   ```
   🔄 Sincronización Reseteada

   La próxima importación traerá TODOS los registros desde Kobo.
   ```

3. La próxima vez que importes, se descargarán todos los registros nuevamente

---

## ⚙️ Cómo Funciona Técnicamente

### Tracking de Sincronización

El sistema usa **Properties Service** de Google Apps Script para guardar la fecha de última sincronización:

- **Tech:** Guarda en `ULTIMA_SYNC_ENTREVISTAS_TECH`
- **Alimentos y Bebidas:** Guarda en `ULTIMA_SYNC_ENTREVISTAS_AB`

### Filtrado de Registros Nuevos

1. Al importar, el sistema:
   - Lee la fecha de última sincronización guardada
   - Descarga el CSV completo desde Kobo
   - Busca la columna `_submission_time` en el CSV
   - **Filtra** solo las filas donde `_submission_time > última_sincronización`
   - Procesa solo esas filas nuevas

2. Al terminar:
   - Obtiene la fecha más reciente de los registros procesados
   - **Guarda** esa fecha como nueva "última sincronización"

### Prevención de Duplicados

El sistema tiene **doble protección** contra duplicados:

1. **Filtrado incremental:** Solo procesa registros nuevos
2. **Verificación de IDs:** Antes de insertar, verifica que el `Creamos ID` no exista ya en la hoja

---

## 🔍 Logs y Debugging

Para ver detalles del proceso:

1. En Google Apps Script, ir a **Ver → Logs**
2. Buscar mensajes como:
   ```
   📅 Última sincronización: 2026-03-24T10:30:00.000Z
   📊 Total en Kobo: 150, Nuevos a importar: 5
   ✅ 5 registros importados
   💾 Última sincronización guardada: 2026-03-24T11:00:00.000Z
   ```

---

## 🆘 Preguntas Frecuentes

### ¿Qué pasa si no hay registros nuevos?

El sistema mostrará:
```
✅ No hay registros nuevos desde la última sincronización
```

Y no modificará la hoja.

### ¿Puedo forzar una re-importación completa?

Sí, usa la opción **"🔄 Resetear Sincronización"** del menú.

### ¿Qué pasa si edito un registro antiguo en Kobo?

El sistema **NO** actualizará registros existentes, solo importa nuevos. Si necesitas actualizar un registro editado en Kobo, deberás:
1. Eliminar el registro de la hoja manualmente
2. Resetear la sincronización
3. Volver a importar

### ¿Se sincronizan Tech y Alimentos por separado?

Sí, cada sheet tiene su propia fecha de última sincronización independiente.

### ¿Qué pasa si borro la hoja "Detalle Entrevistas"?

Al volver a crearla y ejecutar la importación, el sistema tratará de importar solo los registros nuevos desde la última sincronización guardada. Si quieres importar todo desde cero, usa **"Resetear Sincronización"**.

---

## 📊 Estadísticas Útiles

Después de cada importación, el sistema muestra:

- **Importados:** Cantidad de registros nuevos insertados
- **Duplicados:** Cantidad de registros que ya existían (se omitieron)
- **Tipo de sincronización:** Primera vez o incremental
- **Fecha de referencia:** Desde cuándo se trajeron los nuevos registros

---

## 🔧 Mantenimiento

### Respaldo de Datos

Antes de hacer cambios mayores, considera:
1. Hacer una copia del Google Sheet completo
2. Exportar la hoja "Detalle Entrevistas" a CSV

### Limpieza de Properties

Si necesitas limpiar las propiedades guardadas manualmente:

```javascript
function limpiarPropertiesEntrevistas() {
  const props = PropertiesService.getDocumentProperties();
  props.deleteProperty('ULTIMA_SYNC_ENTREVISTAS_TECH');
  props.deleteProperty('ULTIMA_SYNC_ENTREVISTAS_AB');
  Logger.log('✅ Properties limpiadas');
}
```

---

## 📝 Notas Importantes

1. ✅ El sistema **NO elimina** ni **sobrescribe** registros existentes
2. ✅ Solo **agrega** nuevos registros al final de la hoja
3. ✅ La sincronización es **independiente** para Tech y Alimentos
4. ✅ El campo `_submission_time` de Kobo es crítico para el funcionamiento
5. ✅ Si hay error parseando fechas, el sistema incluye el registro por seguridad

---

## 🎯 Archivos Modificados

- **`tech.gs`**
  - Línea 4608-4630: Agregado filtrado incremental
  - Línea 4776: Cambiado bucle para usar `filasParaProcesar`
  - Línea 4907-4929: Agregado guardado de sincronización y mensaje mejorado
  - Línea 10165-10301: Agregadas funciones de sincronización incremental
  - Línea 234-235: Agregadas opciones de menú

- **`AlimentosBebidas.gs`**
  - Línea 4643-4665: Agregado filtrado incremental
  - Línea 4811: Cambiado bucle para usar `filasParaProcesar`
  - Línea 4942-4964: Agregado guardado de sincronización y mensaje mejorado
  - Línea 9892-10044: Agregadas funciones de sincronización incremental
  - Línea 234-235: Agregadas opciones de menú

---

## 👤 Soporte

Para reportar problemas o solicitar mejoras, contactar al equipo de desarrollo o crear un issue en el repositorio del proyecto.

---

**Última actualización:** 24 de marzo de 2026
**Versión:** 2.0 - Sistema de Sincronización Incremental
