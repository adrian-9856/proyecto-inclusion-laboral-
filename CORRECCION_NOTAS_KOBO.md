# 🔧 CORRECCIÓN: Comentarios de Kobo en Hoja de Interés

## 📋 Problema Identificado

Cuando se importaban datos desde KoboToolbox a la "Hoja de Interés", la columna **"Notas" (M)** y la columna **"Servicio/Formación de Interés" (O)** contenían **el mismo valor**: la lista de programas seleccionados (Gastronomía, Barismo, etc.).

### Comportamiento Incorrecto (ANTES)

```
Columna M (Notas):                      → "Gastronomía, Barismo"  ❌ INCORRECTO
Columna O (Servicio/Formación):         → "Gastronomía, Barismo"  ✅ CORRECTO
```

**Resultado:** Los comentarios/observaciones que la persona escribió en el formulario de Kobo se perdían y no se importaban.

---

## ✅ SOLUCIÓN IMPLEMENTADA

Se corrigió el mapeo de columnas de Kobo para que:
- La columna **"Notas" (M)** contenga los **comentarios/observaciones de Kobo**
- La columna **"Servicio/Formación de Interés" (O)** contenga los **programas seleccionados**

### Comportamiento Correcto (AHORA)

```
Columna M (Notas):                      → "Me interesa aprender cocina" ✅ CORRECTO
Columna O (Servicio/Formación):         → "Gastronomía, Barismo"        ✅ CORRECTO
```

---

## 🔧 CAMBIOS REALIZADOS

### 1. **Agregar mapeo de observaciones en `colIndices`**

Se agregó el campo de observaciones al mapeo de columnas de Kobo:

```javascript
// EN AlimentosBebidas.gs (línea ~3558-3569)
// EN tech.gs (línea ~3547-3558)

const colIndices = {
  // ... otros campos ...

  deseaInscribirse: buscarIndiceColumnaExacto(headers, [
    '¿Deseas inscribirte en el programa de Inclusión Laboral?',
    'Inclusión Laboral/¿Deseas inscribirte en el programa de Inclusión Laboral?'
  ]),

  // ⭐ NUEVO: Mapeo de observaciones/comentarios
  observaciones: buscarIndiceColumnaExacto(headers, [
    'Observaciones / Comentarios adicionales',
    'Observaciones',
    'Comentarios adicionales',
    'Comentarios',
    'Notas'
  ])
};
```

### 2. **Extraer observaciones de Kobo**

Se agregó la extracción de observaciones antes de construir el registro:

```javascript
// EN AlimentosBebidas.gs (línea ~3732)
// EN tech.gs (línea ~3728)

// Obtener observaciones/comentarios de Kobo para la columna Notas
const observacionesKobo = colIndices.observaciones >= 0 ?
  fila[colIndices.observaciones].toString().trim() : '';
```

### 3. **Usar observaciones en columna Notas**

Se cambió el valor de la columna "Notas" (M) para que use `observacionesKobo` en lugar de `notasPrograma`:

```javascript
// EN AlimentosBebidas.gs (línea ~3757-3772)
// EN tech.gs (línea ~3757-3772)

const registro = [
  fechaParaHoja,      // A: Fecha Registro
  '',                 // B: No. (fórmula automática)
  creamosId,          // C: Creamos ID
  dpi,                // D: DPI
  nombreCompleto,     // E: Nombre Completo
  genero,             // F: Género
  edad,               // G: Edad
  telefono,           // H: Teléfono
  nivelEducativo,     // I: Nivel Educativo
  zona,               // J: Zona
  comoSeEntero,       // K: Cómo se enteró
  '',                 // L: Responsable
  observacionesKobo,  // M: Notas ⭐ CORREGIDO (antes era: notasPrograma)
  deseaInscribirse,   // N: ¿Deseas inscribirte?
  servicioFormacion,  // O: Servicio/Formación de Interés
  ''                  // P: Estado
];
```

---

## 📊 COMPARACIÓN ANTES vs DESPUÉS

### ANTES (Incorrecto)

| Columna | Contenido | Fuente |
|---------|-----------|--------|
| M - Notas | "Gastronomía, Barismo" | Programas seleccionados ❌ |
| O - Servicio/Formación | "Gastronomía, Barismo" | Programas seleccionados ✅ |

**Problema:** Los comentarios de Kobo se perdían

### DESPUÉS (Correcto)

| Columna | Contenido | Fuente |
|---------|-----------|--------|
| M - Notas | "Me interesa aprender cocina" | Observaciones de Kobo ✅ |
| O - Servicio/Formación | "Gastronomía, Barismo" | Programas seleccionados ✅ |

**Resultado:** Los comentarios de Kobo se importan correctamente

---

## 🎯 BENEFICIOS DE LA CORRECCIÓN

1. ✅ **Se preservan los comentarios de Kobo**
   - Los comentarios/observaciones que las personas escriben en el formulario ya no se pierden
   - Se guardan en la columna "Notas" donde corresponden

2. ✅ **Información más completa**
   - Ahora tienes acceso a comentarios valiosos de las personas registradas
   - Puedes ver notas específicas sobre intereses, disponibilidad, etc.

3. ✅ **Columnas con propósito claro**
   - "Notas" → Comentarios libres de la persona
   - "Servicio/Formación" → Programas que seleccionó

4. ✅ **Consistencia entre sistemas**
   - La corrección se aplicó tanto en `AlimentosBebidas.gs` como en `tech.gs`
   - Ambos sistemas funcionan de la misma manera

---

## 📝 CÓMO VERIFICAR LA CORRECCIÓN

### Paso 1: Actualizar el código
1. Abrir Google Sheets
2. Ir a **Extensiones → Apps Script**
3. Copiar el contenido actualizado de:
   - `AlimentosBebidas.gs` (para Alimentos y Bebidas)
   - `tech.gs` (para Tecnología)
4. **Guardar** (Ctrl+S / Cmd+S)
5. **Recargar** el Google Sheet (F5)

### Paso 2: Importar datos nuevos desde Kobo
1. En el menú, seleccionar:
   - **🍽️ Alimentos y Bebidas → Importar desde Kobo** (para Alimentos)
   - **💻 Tecnología → Importar desde Kobo** (para Tecnología)
2. Esperar a que se complete la importación

### Paso 3: Verificar las columnas
1. Ir a la hoja **"Hoja de Interés"**
2. Revisar las columnas:
   - **Columna M (Notas):** Debe mostrar los comentarios de Kobo
   - **Columna O (Servicio/Formación):** Debe mostrar los programas seleccionados
3. Verificar que **NO** sean iguales (a menos que la persona no haya puesto comentarios)

---

## ⚠️ NOTAS IMPORTANTES

### Datos anteriores ya importados

Esta corrección **solo afecta datos nuevos** que se importen después de aplicar la actualización.

**Los datos que ya fueron importados antes:**
- Seguirán teniendo los programas en la columna "Notas"
- NO se actualizarán automáticamente
- Si deseas corregirlos:
  1. Borrar las filas de la Hoja de Interés
  2. Volver a importar desde Kobo

### Si una persona no puso comentarios

Si en el formulario de Kobo la persona **no escribió comentarios**:
- La columna "Notas" estará **vacía** ✅ (esto es correcto)
- La columna "Servicio/Formación" tendrá los programas seleccionados

### Nombres de campos en Kobo

El sistema busca el campo de comentarios con estos nombres:
- "Observaciones / Comentarios adicionales"
- "Observaciones"
- "Comentarios adicionales"
- "Comentarios"
- "Notas"

Si tu formulario de Kobo usa un nombre diferente, agrégalo en el código en la sección `observaciones:`.

---

## 🔄 ARCHIVOS MODIFICADOS

**Versión:** 2.3
**Fecha:** 2026-03-11

### Archivos actualizados:
- ✅ `AlimentosBebidas.gs` - líneas 3558-3569, 3732, 3757-3772
- ✅ `tech.gs` - líneas 3547-3558, 3728, 3757-3772

### Commit:
- Branch: `claude/add-registration-fields-9lsla`
- Descripción: "Corregir mapeo de Notas de Kobo en Hoja de Interés"

---

## 📧 SOPORTE

Si después de aplicar esta corrección:
- Los comentarios aún no aparecen en la columna "Notas"
- Siguen duplicándose los valores en ambas columnas

**Verifica:**
1. ✅ El código se copió correctamente
2. ✅ Se guardó y recargó el Sheet
3. ✅ Los datos son **nuevos** (importados después de la corrección)
4. ✅ El formulario de Kobo tiene el campo de observaciones/comentarios
5. ✅ Las personas sí escribieron comentarios en el formulario

---

## 🎓 CONTEXTO TÉCNICO

### ¿Por qué estaba mal?

En el código anterior, la variable `notasPrograma` contenía la lista de programas:

```javascript
const notasPrograma = programasSeleccionados.join(', ');
// Ejemplo: "Gastronomía, Barismo"
```

Y se asignaba tanto a "Notas" como a "Servicio/Formación":

```javascript
notasPrograma,     // M: Notas ❌ INCORRECTO
servicioFormacion, // O: Servicio/Formación ✅ CORRECTO
```

Pero faltaba **extraer el campo de observaciones de Kobo**.

### ¿Cómo se corrigió?

Se agregó una nueva variable que extrae los comentarios:

```javascript
const observacionesKobo = colIndices.observaciones >= 0 ?
  fila[colIndices.observaciones].toString().trim() : '';
```

Y se usó en la columna correcta:

```javascript
observacionesKobo,  // M: Notas ✅ CORREGIDO
servicioFormacion,  // O: Servicio/Formación ✅ CORRECTO
```

---

**Desarrollado por:** Claude AI Assistant
**Fecha de corrección:** 2026-03-11
**Versión:** 2.3
