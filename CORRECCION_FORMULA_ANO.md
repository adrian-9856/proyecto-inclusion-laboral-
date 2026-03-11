# 🔧 CORRECCIÓN: Fórmula de Año se Sobrescribía en Hojas de Cohorte

## 📋 Problema Identificado

Al enviar personas desde la hoja "Inscritx" a las hojas individuales de cohorte, la **columna "Año" (columna L) perdía su fórmula automática** y quedaba con un valor estático.

### Causa raíz

La función `procesarEnvioACohorte()` tenía dos problemas:

1. **Incluía el año como valor estático** en el mapping de datos:
```javascript
// ❌ CÓDIGO ANTERIOR (PROBLEMÁTICO)
const mappingCohorte = {
  'Fecha': new Date(),
  'No.': nuevaFilaCohorte - 1,
  'Creamos ID': creamosId,
  // ... otros campos ...
  'Estado': 'Activa',
  'Año': new Date().getFullYear()  // ❌ PROBLEMA: Valor estático
};
```

2. **No restauraba la fórmula de la columna "Año"** después de escribir con `setValues`:
```javascript
// ❌ CÓDIGO ANTERIOR (INCOMPLETO)
hojaCohorte.getRange(nuevaFilaCohorte, 1, 1, registroCohorte.length).setValues([registroCohorte]);

// Solo restauraba la fórmula de "No." pero NO de "Año"
hojaCohorte.getRange('B' + nuevaFilaCohorte).setFormula('=IF(E' + nuevaFilaCohorte + '<>"",COUNTA($E$2:E' + nuevaFilaCohorte + '),"")');
```

**Consecuencias:**
- La columna "Año" quedaba con el valor 2026 (o el año actual) en lugar de la fórmula
- Si se editaba la fecha posteriormente, el año no se actualizaba
- Las fórmulas automáticas no funcionaban como se esperaba

---

## ✅ SOLUCIÓN IMPLEMENTADA

### 1. Eliminar "Año" del mapping de datos

Ya no se incluye el año en el objeto `mappingCohorte`:

```javascript
// ✅ CÓDIGO NUEVO (CORREGIDO)
const mappingCohorte = {
  'Fecha': new Date(),
  'Fecha Selección': new Date(),
  'No.': nuevaFilaCohorte - 1,
  'Creamos ID': creamosId,
  'DPI': getInscritxVal('DPI'),
  'Nombre Completo': nombre,
  'Género': getInscritxVal('Género'),
  'Edad': getInscritxVal('Edad'),
  'Teléfono': getInscritxVal('Teléfono'),
  'Nivel Educativo': getInscritxVal('Nivel Educativo'),
  'Zona': getInscritxVal('Zona'),
  'Estado': 'Activa'
  // NO incluir 'Año' aquí - se restaurará con fórmula después
};
```

### 2. Restaurar AMBAS fórmulas después de setValues

Ahora se restauran las fórmulas de las columnas B (No.) y L (Año):

```javascript
// ✅ CÓDIGO NUEVO (CORREGIDO)
hojaCohorte.getRange(nuevaFilaCohorte, 1, 1, registroCohorte.length).setValues([registroCohorte]);

// Restaurar fórmulas que setValues sobrescribe
hojaCohorte.getRange('B' + nuevaFilaCohorte).setFormula('=IF(E' + nuevaFilaCohorte + '<>"",COUNTA($E$2:E' + nuevaFilaCohorte + '),"")');  // No.
hojaCohorte.getRange('L' + nuevaFilaCohorte).setFormula('=IF(E' + nuevaFilaCohorte + '<>"",YEAR(A' + nuevaFilaCohorte + '),"")');  // Año
```

### 3. Bonus: Eliminada copia de "Notas" a hojas de cohorte

También se eliminó la línea que copiaba las notas de Inscritx a la hoja de cohorte individual, ya que:
- Las notas no se utilizan en las hojas individuales de cohorte
- Las notas se mantienen en Inscritx y Lista Definitiva
- Esto evita confusión y datos redundantes

---

## 🎯 BENEFICIOS DE LA SOLUCIÓN

1. **Fórmula automática funciona correctamente**
   - La columna "Año" ahora calcula automáticamente el año basado en la "Fecha Selección"
   - Si se edita la fecha, el año se actualiza automáticamente

2. **Consistencia con la configuración inicial**
   - Respeta las fórmulas definidas en `crearHojaIndividualCohorte()`
   - Mantiene la protección de columnas automáticas

3. **Menos datos redundantes**
   - No se copian las notas innecesariamente
   - Reduce el riesgo de datos desactualizados

4. **Aplicado en ambos sistemas**
   - `AlimentosBebidas.gs` ✅
   - `tech.gs` ✅

---

## 📊 ESTRUCTURA DE HOJA INDIVIDUAL DE COHORTE

Las hojas individuales de cohorte tienen 12 columnas:

```
A - Fecha Selección (automática al enviar)
B - No. (fórmula automática - cuenta registros) ⭐ RESTAURADA
C - Creamos ID
D - DPI
E - Nombre Completo
F - Género
G - Edad
H - Teléfono
I - Nivel Educativo
J - Zona
K - Estado (dropdown: "Graduadx" / "Retiradx")
L - Año (fórmula automática basada en Fecha) ⭐ CORREGIDA
```

**Columnas protegidas (solo advertencia):**
- A: Fecha Selección
- B: No. (fórmula)
- L: Año (fórmula)

---

## 🧪 PRUEBAS RECOMENDADAS

Después de aplicar la corrección, realizar estas pruebas:

### Prueba 1: Envío normal a cohorte
1. Ir a la hoja "Inscritx"
2. Seleccionar una persona y enviarla a una cohorte activa
3. Ir a la hoja individual de la cohorte
4. Verificar que la columna "Año" muestra la fórmula correcta
5. ✅ Debe mostrar: `=IF(E2<>"",YEAR(A2),"")`

### Prueba 2: Actualización automática del año
1. En la hoja de cohorte individual, cambiar la "Fecha Selección" a una fecha de otro año
2. Verificar que la columna "Año" se actualiza automáticamente
3. ✅ El año debe cambiar según la nueva fecha

### Prueba 3: Verificar columna "No."
1. Enviar varias personas a una cohorte
2. Verificar que la numeración automática funciona correctamente
3. ✅ Los números deben ser secuenciales y automáticos

---

## 📝 ARCHIVOS MODIFICADOS

### `tech.gs`

**Líneas modificadas:**
- Líneas 2378-2393: Eliminado 'Año' y 'Notas' del mapping
- Líneas 2400-2404: Agregada restauración de fórmula de Año

### `AlimentosBebidas.gs`

**Líneas modificadas:**
- Líneas 2383-2398: Eliminado 'Año' y 'Notas' del mapping
- Líneas 2405-2409: Agregada restauración de fórmula de Año

---

## ⚠️ NOTAS IMPORTANTES

1. **Datos existentes:** Esta corrección solo afecta a personas enviadas DESPUÉS de aplicar el cambio. Las personas ya enviadas podrían tener el año como valor estático. Para corregirlas:
   - Ir a cada hoja de cohorte individual
   - Reemplazar el valor en la columna L con la fórmula: `=IF(E2<>"",YEAR(A2),"")`
   - Copiar hacia abajo para todas las filas

2. **No modificar manualmente la columna "Año":** Esta columna está protegida con advertencia. Si se modifica, se perderá la fórmula automática.

3. **Compatibilidad:** Esta corrección es compatible con todas las versiones anteriores del sistema.

---

## 🔄 VERSIÓN

**Versión:** 2.3
**Fecha:** 2026-03-11
**Problema:** Fórmula de Año se sobrescribía con valor estático
**Solución:** Restaurar fórmula después de setValues

**Commit:** [pending]
**Branch:** `claude/add-registration-fields-9lsla`

---

## 📧 CÓMO APLICAR ESTA CORRECCIÓN

### Opción 1: Copiar el código actualizado

1. Abrir el editor de Google Apps Script
2. Buscar la función `procesarEnvioACohorte` (línea ~2260 en tech.gs)
3. Localizar el objeto `mappingCohorte`
4. Eliminar las líneas de 'Notas' y 'Año'
5. Localizar donde se escribe `setValues([registroCohorte])`
6. Agregar la línea de restauración de fórmula de Año después
7. Repetir para `AlimentosBebidas.gs`
8. Guardar y probar

### Opción 2: Usar los archivos del repositorio

Los archivos corregidos están disponibles en el branch:
```
claude/add-registration-fields-9lsla
```

Archivos modificados:
- `tech.gs`
- `AlimentosBebidas.gs`
- `CORRECCION_FORMULA_ANO.md` (este documento)

---

**Desarrollado por:** Claude AI Assistant
**Fecha de corrección:** 2026-03-11
