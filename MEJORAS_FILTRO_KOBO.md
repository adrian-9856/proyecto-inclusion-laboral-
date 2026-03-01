# Mejoras al Filtro de Importación de Kobo - Alimentos y Bebidas

## 🎯 Problema Resuelto

El sistema anterior tenía problemas para detectar correctamente los datos de **Barismo** y **Gastronomía** provenientes de KoboToolbox, tanto en datos nuevos como históricos. Esto causaba que muchos registros válidos se omitieran durante la importación.

## ✨ Mejoras Implementadas

### 1. **Detección Robusta de Texto**

Se crearon tres nuevas funciones que hacen la detección mucho más confiable:

#### `normalizarTexto(texto)`
- Convierte todo a minúsculas
- Elimina tildes (á → a, é → e, etc.)
- Normaliza espacios (múltiples espacios → un espacio)
- Esto permite comparar textos sin importar formato

#### `esTextGastronomia(texto)`
Detecta **múltiples variaciones** de Gastronomía:
- ✅ "Alimentos y Bebidas - Gastronomía"
- ✅ "alimentos y bebidas gastronomia" (sin tildes)
- ✅ "Gastronomía" (solo la palabra)
- ✅ "Cocina"
- ✅ "Repostería"
- ✅ Con o sin mayúsculas
- ✅ Con espacios extras

#### `esTextBarismo(texto)`
Detecta **múltiples variaciones** de Barismo:
- ✅ "Alimentos y Bebidas - Barismo"
- ✅ "alimentos y bebidas barismo"
- ✅ "Barismo" (solo la palabra)
- ✅ "Barista"
- ✅ "Café" / "Cafe"
- ✅ Con o sin mayúsculas
- ✅ Con espacios extras

### 2. **Búsqueda en Múltiples Columnas**

El sistema ahora busca en **TODAS** estas columnas posibles:
- Columna de "servicio de interés" (columna principal)
- Columna de "programa"
- Columna de "área"
- Columna de "especialidad"

Esto es crucial para:
- **Datos históricos** que pueden tener estructura diferente
- **Diferentes versiones del formulario** de Kobo
- **Cambios futuros** en la estructura de datos

### 3. **Logging Mejorado para Debug**

Ahora el sistema registra en el Logger:
- ✅ Cada registro que SE IMPORTA (con detalles)
- ⚠️ Cada registro que SE OMITE (con el texto que contenía)
- 📊 Qué columnas se detectaron
- 🔍 Índices de columnas encontradas

Esto permite diagnosticar problemas rápidamente.

### 4. **Función de Debug Mejorada**

La función `verColumnasKobo()` ahora muestra:
- Todas las columnas relevantes encontradas
- Valores de las primeras 3 filas
- Marcadores visuales (🍽️ para Gastronomía, ☕ para Barismo)
- **Contador de detección**: cuántos registros se detectarían
- Resumen completo antes de importar

## 🚀 Cómo Usar

### Para Importar Datos (Proceso Normal)

1. En Google Sheets, ir al menú: **🍽️ Alimentos y Bebidas**
2. Seleccionar: **Importar desde Kobo**
3. El sistema ahora detectará MUCHOS más registros automáticamente

### Para Diagnosticar Problemas (Si algo no funciona)

1. En Google Sheets, ir al menú: **🍽️ Alimentos y Bebidas**
2. Seleccionar: **Debug: Ver Columnas Kobo**
3. Se mostrará un reporte completo con:
   - Qué columnas se encontraron
   - Ejemplos de valores
   - Cuántos registros se detectarían
   - Marcadores visuales para cada tipo

4. Para ver logs detallados:
   - Ir a **Extensiones → Apps Script**
   - Ejecutar la función `importarDesdeKobo`
   - Ver el panel de **Ejecución → Logs**
   - Verás exactamente qué se importó y qué se omitió

## 📊 Ejemplo de Mejora

### ANTES (Filtro Antiguo)
```javascript
// Solo detectaba exactamente esto:
servicioTexto.includes('alimentos y bebidas - gastronomía')
servicioTexto.includes('alimentos y bebidas - barismo')
```

**Problema**: Si venía "GASTRONOMIA" (sin tilde), "Gastronmía" (con espacio extra), o "Cocina" → ❌ NO se detectaba

### AHORA (Filtro Mejorado)
```javascript
// Detecta TODAS estas variaciones:
esTextGastronomia(textoCompleto)  // Busca en múltiples columnas
esTextBarismo(textoCompleto)      // Normaliza y busca patrones
```

**Resultado**: Detecta variaciones de formato, tildes, mayúsculas, espacios, sinónimos → ✅ SE DETECTA

## 🔧 Para Desarrolladores

Si necesitas agregar más variaciones de detección, edita las funciones:

```javascript
// En AlimentosBebidas.gs, línea ~2908
function esTextGastronomia(texto) {
  const patronesGastronomia = [
    'gastronomia',
    'cocina',
    'reposteria',
    // Agregar aquí más variaciones
  ];
  // ...
}
```

## ✅ Ventajas de las Mejoras

1. ✅ **Detecta datos históricos** con diferentes formatos
2. ✅ **Resistente a cambios** en el formulario de Kobo
3. ✅ **Maneja errores tipográficos** (tildes, mayúsculas, espacios)
4. ✅ **Fácil de diagnosticar** con logs detallados
5. ✅ **Busca en múltiples lugares** no solo una columna
6. ✅ **Extensible** para agregar más variaciones fácilmente

## 📝 Notas Importantes

- Los datos **NO se modifican**, solo se mejora la detección
- Los registros duplicados **siguen siendo detectados y omitidos** correctamente
- El sistema **sigue filtrando** registros que no son de Alimentos y Bebidas
- La estructura de la hoja **no cambia**, solo mejora la importación

## 🐛 Si Encuentras Problemas

1. Ejecuta `verColumnasKobo()` para ver qué está detectando el sistema
2. Revisa los logs en Apps Script (Extensiones → Apps Script → Logs)
3. Verifica que la URL de Kobo esté configurada correctamente
4. Si hay un formato específico que no se detecta, agrégalo a las funciones de detección

---

**Fecha de implementación**: 2026-03-01
**Archivos modificados**: `AlimentosBebidas.gs`
**Funciones agregadas**: `normalizarTexto()`, `esTextGastronomia()`, `esTextBarismo()`, mejoras en `verColumnasKobo()`
