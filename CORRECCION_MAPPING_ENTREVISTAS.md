# 🔧 CORRECCIÓN: Mapping Incorrecto en Hoja de Entrevistas

## 📋 Problema Identificado

Al enviar personas desde la **Hoja de Interés** a **Entrevistas**, los datos se estaban escribiendo en las **columnas incorrectas**, causando que la información se sobrescribiera o apareciera en lugares inesperados.

### Causa raíz

El mapping de datos usaba nombres de columnas incorrectos que no coincidían con los nombres reales de las columnas en la hoja "Entrevistas".

#### Estructura real de la hoja "Entrevistas":

```
A - Fecha Entrevista  ← Nombre completo con "Entrevista"
B - Hora
C - Creamos ID
D - DPI
E - Nombre Completo
F - Género
G - Edad
H - Teléfono
I - Nivel Educativo
J - Zona
K - Entrevistador
L - Calificación
M - Observaciones  ← Nombre correcto es "Observaciones", NO "Notas"
N - Estado
```

#### Problema 1: 'Fecha' vs 'Fecha Entrevista'

**Código anterior (❌ INCORRECTO):**
```javascript
const mapping = {
  'Fecha': new Date(),  // ❌ PROBLEMA: No existe columna "Fecha"
  'Creamos ID': creamosId,
  // ...
};
```

**¿Por qué fallaba?**
- El sistema normaliza "Fecha Entrevista" a `"fechaentrevista"`
- El mapping usaba "Fecha" que se normaliza a `"fecha"`
- Como no coinciden, la fecha NO se escribía en la columna A
- Esto causaba que todos los datos se desplazaran y se sobrescribieran en columnas incorrectas

#### Problema 2: 'Notas' vs 'Observaciones'

**Código anterior (❌ INCORRECTO):**
```javascript
const mapping = {
  // ...
  'Notas': 'Reingreso desde No Inscritx - ' + notas,  // ❌ PROBLEMA: No existe columna "Notas"
  // ...
};
```

**¿Por qué fallaba?**
- La hoja "Entrevistas" tiene columna "Observaciones" (M), NO "Notas"
- Al usar 'Notas', el valor no se escribía en ninguna columna
- Se perdían los comentarios importantes sobre el reingreso

---

## ✅ SOLUCIÓN IMPLEMENTADA

### Corrección 1: Usar 'Fecha Entrevista' correctamente

**Código nuevo (✅ CORRECTO):**
```javascript
const mapping = {
  'Fecha Entrevista': new Date(),  // ✅ Nombre correcto de columna A
  'Creamos ID': creamosId,
  'DPI': getVal('DPI'),
  'Nombre Completo': nombreCompleto,
  'Género': getVal('Género'),
  'Edad': getVal('Edad'),
  'Teléfono': getVal('Teléfono'),
  'Nivel Educativo': getVal('Nivel Educativo'),
  'Zona': getVal('Zona')
};
```

### Corrección 2: Usar 'Observaciones' en lugar de 'Notas'

**Código nuevo (✅ CORRECTO):**
```javascript
const mapping = {
  'Fecha Entrevista': new Date(),  // ✅ Agregar fecha de reenvío
  'Creamos ID': creamosId,
  'DPI': datosInteres ? datosInteres[3] : '',
  'Nombre Completo': nombre,
  'Género': genero,
  'Edad': datosInteres ? datosInteres[6] : '',
  'Teléfono': telefono,
  'Nivel Educativo': datosInteres ? normalizarNivelEducativo(datosInteres[8]) : '',
  'Zona': datosInteres ? datosInteres[9] : '',
  'Entrevistador': 'Eva',
  'Observaciones': 'Reingreso desde No Inscritx - ' + notas,  // ✅ Columna correcta
  'Estado': ''
};
```

---

## 🎯 BENEFICIOS DE LA SOLUCIÓN

1. **Datos en las columnas correctas**
   - La fecha ahora se escribe en la columna A (Fecha Entrevista)
   - Todos los demás campos se alinean correctamente

2. **No más sobreescritura de datos**
   - Los datos ya no se desplazan a columnas incorrectas
   - La información se mantiene en el lugar esperado

3. **Observaciones guardadas correctamente**
   - Los comentarios de reingreso ahora se guardan en la columna M (Observaciones)
   - No se pierden datos importantes

4. **Aplicado en ambos sistemas y dos flujos**
   - ✅ `tech.gs` - Hoja de Interés → Entrevistas
   - ✅ `tech.gs` - No Inscritx → Entrevistas (reenvío)
   - ✅ `AlimentosBebidas.gs` - Hoja de Interés → Entrevistas
   - ✅ `AlimentosBebidas.gs` - No Inscritx → Entrevistas (reenvío)

---

## 📝 LUGARES CORREGIDOS

### En `tech.gs`:

1. **Líneas 1820-1830:** Función `procesarCambioEstadoInteres()`
   - Flujo: Hoja de Interés → Entrevistas
   - Agregado: 'Fecha Entrevista'

2. **Líneas 2108-2121:** Función `procesarReenvioDesdeNoInscritx()`
   - Flujo: No Inscritx → Entrevistas
   - Agregado: 'Fecha Entrevista'
   - Cambiado: 'Notas' → 'Observaciones'

### En `AlimentosBebidas.gs`:

1. **Líneas 1817-1826:** Función `procesarCambioEstadoInteres()`
   - Flujo: Hoja de Interés → Entrevistas
   - Agregado: 'Fecha Entrevista'

2. **Líneas 2110-2122:** Función `procesarReenvioDesdeNoInscritx()`
   - Flujo: No Inscritx → Entrevistas
   - Agregado: 'Fecha Entrevista'
   - Cambiado: 'Notas' → 'Observaciones'

---

## 🧪 PRUEBAS RECOMENDADAS

Después de aplicar la corrección, realizar estas pruebas:

### Prueba 1: Envío desde Hoja de Interés
1. En la hoja "Hoja de Interés", seleccionar una persona
2. Cambiar el estado a "Entrevista agendada"
3. Ir a la hoja "Entrevistas"
4. ✅ Verificar que:
   - Columna A (Fecha Entrevista) tiene la fecha actual
   - Columna C (Creamos ID) tiene el ID correcto
   - Columna E (Nombre Completo) tiene el nombre correcto
   - Todos los demás datos están en sus columnas correctas

### Prueba 2: Reenvío desde No Inscritx
1. En la hoja "No Inscritx", seleccionar una persona
2. En la columna "Acción", seleccionar "Reenviar a Entrevistas"
3. Ir a la hoja "Entrevistas"
4. ✅ Verificar que:
   - Columna A (Fecha Entrevista) tiene la fecha actual
   - Columna K (Entrevistador) tiene "Eva"
   - Columna M (Observaciones) tiene el comentario "Reingreso desde No Inscritx - ..."
   - Todos los demás datos están correctos

### Prueba 3: Verificar que NO haya sobreescritura
1. Enviar varias personas a Entrevistas
2. Verificar que ningún dato se sobrescriba
3. ✅ Cada persona debe tener su propia fila con datos completos y correctos

---

## ⚠️ NOTAS IMPORTANTES

1. **Datos existentes:** Esta corrección solo afecta a personas enviadas DESPUÉS de aplicar el cambio. Las personas ya enviadas antes de la corrección podrían tener datos en columnas incorrectas y necesitarán corrección manual.

2. **Normalización de nombres:** El sistema normaliza los nombres de columnas eliminando espacios y caracteres especiales. Por eso es CRÍTICO usar el nombre exacto de la columna tal como aparece en el encabezado.

3. **Diferencia entre hojas:**
   - "Entrevistas" usa **"Observaciones"** (columna M)
   - Otras hojas como "Inscritx" usan **"Notas"**
   - No confundir los nombres de columnas entre diferentes hojas

4. **Importancia de 'Fecha Entrevista':** Sin este campo, todos los datos se desplazan una columna, causando sobreescritura masiva de información.

---

## 🔄 VERSIÓN

**Versión:** 2.4
**Fecha:** 2026-03-11
**Problema:** Mapping incorrecto causaba sobreescritura de datos en Entrevistas
**Solución:** Corregir nombres de columnas en mappings

**Archivos modificados:**
- `tech.gs`: líneas 1820-1830, 2108-2121
- `AlimentosBebidas.gs`: líneas 1817-1826, 2110-2122
- `CORRECCION_MAPPING_ENTREVISTAS.md`: este documento

**Commit:** [pending]
**Branch:** `claude/add-registration-fields-9lsla`

---

## 📧 CÓMO APLICAR ESTA CORRECCIÓN

### Opción 1: Copiar el código actualizado

1. Abrir el editor de Google Apps Script
2. Buscar la función `procesarCambioEstadoInteres` (línea ~1744 en tech.gs)
3. Localizar el mapping para Entrevistas
4. Cambiar `'Fecha': new Date()` por `'Fecha Entrevista': new Date()`
5. Buscar la función `procesarReenvioDesdeNoInscritx` (línea ~2085)
6. Agregar `'Fecha Entrevista': new Date()` al mapping
7. Cambiar `'Notas'` por `'Observaciones'`
8. Repetir para `AlimentosBebidas.gs`
9. Guardar y probar

### Opción 2: Usar los archivos del repositorio

Los archivos corregidos están disponibles en el branch:
```
claude/add-registration-fields-9lsla
```

---

## 🔗 RELACIÓN CON OTRAS CORRECCIONES

Esta corrección es parte de una serie de fixes para problemas de sobreescritura de datos:

1. **CORRECCION_FORMULA_ANO.md** - Fórmula de Año se sobrescribía en cohortes
2. **CORRECCION_MAPPING_ENTREVISTAS.md** - Este documento (mapping incorrecto en Entrevistas)

Ambos problemas tenían síntomas similares (datos sobrescritos) pero causas diferentes.

---

**Desarrollado por:** Claude AI Assistant
**Fecha de corrección:** 2026-03-11
