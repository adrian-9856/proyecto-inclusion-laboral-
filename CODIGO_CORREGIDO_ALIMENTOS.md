# 🔧 CÓDIGO CORREGIDO - AlimentosBebidas.gs

## 🔴 EL PROBLEMA QUE TENÍAS

El código de **AlimentosBebidas.gs** tenía **errores críticos** que impedían que funcionara correctamente:

### **Error 1: Inconsistencia en número de columnas**
- El código **creaba 12 columnas** en la hoja Inscritx
- Pero luego **solo leía 11 columnas**
- Esto causaba que la columna "Estado" no se guardara correctamente

### **Error 2: Falta de columna "Estado" en varias funciones**
- La función `enviarParticipantesACohorte` escribía solo 10 columnas (faltaban Género y Estado)
- La función de reingreso desde deserción escribía solo 11 columnas (faltaba Estado)

### **Error 3: Comentarios incorrectos**
- Los comentarios decían "columna K (11)" cuando debería ser "columna L (12)"
- Los comentarios decían "11 columnas" cuando eran 12

---

## ✅ LO QUE SE CORRIGIÓ

He corregido **5 errores críticos** en el archivo `AlimentosBebidas.gs`:

### **Corrección 1: Línea 1383**
**ANTES:**
```javascript
// "Enviar a Cohorte" está en columna K (11)
```

**AHORA:**
```javascript
// "Enviar a Cohorte" está en columna L (12)
```

---

### **Corrección 2: Líneas 1824-1825**
**ANTES:**
```javascript
// Inscritx tiene 11 columnas: No, CreamosID, DPI, Nombre, Género, Edad, Tel, NivelEdu, Zona, Notas, EnviarACohorte
const datos = sheet.getRange(fila, 1, 1, 11).getValues()[0];
```

**AHORA:**
```javascript
// Inscritx tiene 12 columnas: No, CreamosID, DPI, Nombre, Género, Edad, Tel, NivelEdu, Zona, Notas, Estado, EnviarACohorte
const datos = sheet.getRange(fila, 1, 1, 12).getValues()[0];
```

---

### **Corrección 3: Línea 1785-1798 (Reingreso desde deserción)**
**ANTES:**
```javascript
const registro = [
  nuevaFila - 1,
  creamosId,
  dpi,
  nombre,
  genero,
  edad || '',
  telefono,
  nivelEducativo,
  '',               // Zona
  'Reingreso desde Deserción...',
  ''                // Enviar a Cohorte
];  // Solo 11 elementos ❌
```

**AHORA:**
```javascript
const registro = [
  nuevaFila - 1,
  creamosId,
  dpi,
  nombre,
  genero,
  edad || '',
  telefono,
  nivelEducativo,
  '',               // Zona
  'Reingreso desde Deserción...',
  'Inscritx',       // Estado (automático) ✅ AGREGADO
  ''                // Enviar a Cohorte
];  // Ahora 12 elementos ✅
```

---

### **Corrección 4: Línea 3922-3938 (Enviar participantes a cohorte)**
**ANTES:**
```javascript
// Columnas: No, CreamosID, DPI, Nombre, Edad, Tel, NivelEdu, Zona, Notas, EnviarACohorte
const registro = [
  nuevaFila - 1, p.creamosId,
  datosInteres ? datosInteres[3] : '', p.nombre,
  datosInteres ? datosInteres[5] : '', p.datos[4],
  datosInteres ? datosInteres[7] : '', datosInteres ? datosInteres[8] : '',
  p.datos[8] || '',
  ''
];  // Solo 10 elementos ❌ (falta Género y Estado)

seleccionadas.getRange(nuevaFila, 1, 1, 10).setValues([registro]);
```

**AHORA:**
```javascript
// Columnas: No, CreamosID, DPI, Nombre, Género, Edad, Tel, NivelEdu, Zona, Notas, Estado, EnviarACohorte
const registro = [
  nuevaFila - 1,                          // No
  p.creamosId,                            // CreamosID
  datosInteres ? datosInteres[3] : '',    // DPI
  p.nombre,                               // Nombre
  datosInteres ? datosInteres[5] : '',    // Género ✅ AGREGADO
  datosInteres ? datosInteres[6] : '',    // Edad
  p.datos[4],                             // Teléfono
  datosInteres ? datosInteres[8] : '',    // Nivel Educativo
  datosInteres ? datosInteres[9] : '',    // Zona
  p.datos[8] || '',                       // Notas
  'Inscritx',                             // Estado ✅ AGREGADO
  ''                                      // Enviar a Cohorte
];  // Ahora 12 elementos ✅

seleccionadas.getRange(nuevaFila, 1, 1, 12).setValues([registro]);
```

---

## 📋 ESTRUCTURA CORRECTA DE INSCRITX

La hoja **Inscritx** ahora tiene **12 columnas** en este orden:

| # | Columna | Descripción |
|---|---------|-------------|
| A | No | Número automático |
| B | CreamosID | ID único |
| C | DPI | Documento de identidad |
| D | Nombre | Nombre completo |
| E | Género | Género |
| F | Edad | Edad |
| G | Teléfono | Teléfono |
| H | NivelEdu | Nivel educativo |
| I | Zona | Zona de residencia |
| J | Notas | Observaciones |
| K | **Estado** | "Inscritx" (automático) ✅ |
| L | **EnviarACohorte** | Desplegable de cohortes ✅ |

---

## 🎯 QUÉ TIENES QUE HACER AHORA

### **Paso 1: Descargar el código corregido**

El código corregido está en el repositorio. Para descargarlo:

```bash
# Ver el archivo corregido
cat AlimentosBebidas.gs
```

### **Paso 2: Copiar el código a Google Apps Script**

1. Abre tu hoja de Google Sheets de **Alimentos y Bebidas**
2. Ve a **Extensiones → Apps Script**
3. **BORRA TODO** el contenido actual de **AlimentosBebidas.gs**
4. **COPIA Y PEGA** el nuevo código corregido desde el archivo del repositorio
5. **GUARDA** (Ctrl+S o botón Guardar)

### **Paso 3: Reinstalar los triggers**

Después de pegar el código corregido:

1. Vuelve a tu hoja de Google Sheets
2. Refresca la página (F5)
3. Ve al menú: **🍔 Alimentos y Bebidas → ⚙️ Configuración → ⏰ Instalar Triggers**
4. Autoriza los permisos si te lo pide
5. Espera el mensaje "✅ Triggers instalados"

### **Paso 4: Verificar que funciona**

Ejecuta la verificación:
```
🍔 Alimentos y Bebidas → 🛠️ Herramientas → ✅ Verificar Instalación
```

Debes ver:
```
✅ Trigger al editar
✅ Trigger de tiempo
🎉 TODO LISTO Y FUNCIONANDO
```

---

## 🧪 PRUEBA QUE FUNCIONA CORRECTAMENTE

### **Test 1: Fecha automática**
1. Ve a **"Hoja de Interés"**
2. En una fila con datos, columna **"Estado"**, selecciona: **"Entrevista agendada"**
3. Ve a **"Entrevistas"**
4. ✅ La columna A debe tener la **fecha de hoy automáticamente**

### **Test 2: Estado "Inscritx" automático**
1. Ve a **"Entrevistas"**
2. En una fila, columna **"Estado"**, pon: **"Aprobada"**
3. Ve a **"Inscritx"**
4. ✅ La columna K debe decir **"Inscritx"** automáticamente
5. ✅ La columna L debe tener un **desplegable de cohortes**

---

## 📊 COMPARACIÓN ANTES vs AHORA

| Aspecto | ANTES (❌ Error) | AHORA (✅ Corregido) |
|---------|------------------|---------------------|
| Columnas en Inscritx | 11 (inconsistente) | 12 (consistente) |
| Estado "Inscritx" | No se guardaba | Se guarda automáticamente |
| Desplegable cohortes | No funcionaba | Funciona en columna L |
| Función enviarParticipantes | Solo 10 columnas | 12 columnas completas |
| Reingreso desde deserción | Solo 11 columnas | 12 columnas completas |

---

## 🔍 CÓMO SABER SI TIENES LA VERSIÓN CORREGIDA

### **Opción 1: Revisar el código**

Abre `AlimentosBebidas.gs` en Apps Script y busca (Ctrl+F):

1. Busca: `Inscritx tiene 12 columnas`
   - Debe estar en la línea ~1824 ✅

2. Busca: `'Inscritx',                             // Estado (automático)`
   - Debe aparecer en varias funciones ✅

3. Busca: `columna L (12)`
   - Debe estar en la línea ~1383 ✅

### **Opción 2: Ver la fecha de modificación**

El archivo fue corregido el: **2026-03-01**

```bash
# Ver fecha de última modificación
ls -la AlimentosBebidas.gs
```

### **Opción 3: Ver el hash del commit**

El commit con las correcciones es: `195064e`

```bash
# Ver detalles del commit
git show 195064e
```

---

## 📝 RESUMEN

```
┌─────────────────────────────────────────────────┐
│ PROBLEMA:                                        │
│ ❌ Código con errores de columnas              │
│ ❌ Estado "Inscritx" no se guardaba            │
│ ❌ Faltan campos en varias funciones           │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ SOLUCIÓN:                                        │
│ ✅ Corregidas 5 ubicaciones en el código       │
│ ✅ Ahora todas las funciones usan 12 columnas  │
│ ✅ Estado "Inscritx" se guarda correctamente   │
│ ✅ Desplegable de cohortes funciona en col. L  │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ QUÉ HACER:                                       │
│ 1. Copiar el código corregido a Apps Script     │
│ 2. Reinstalar triggers desde el menú            │
│ 3. Verificar instalación                        │
│ 4. Probar con un caso real                      │
└─────────────────────────────────────────────────┘
```

---

## ❓ PREGUNTAS FRECUENTES

### **P: ¿Por qué no funcionaba antes?**
**R:** El código tenía inconsistencias: creaba 12 columnas pero luego leía solo 11, lo que causaba errores.

### **P: ¿Tengo que volver a instalar los triggers?**
**R:** SÍ, después de copiar el código corregido, debes reinstalar los triggers.

### **P: ¿Se perderán mis datos al actualizar el código?**
**R:** NO, el código no toca tus datos. Solo corrige la lógica de funcionamiento.

### **P: ¿Este error también estaba en tech.gs?**
**R:** NO, tech.gs ya estaba correcto. Solo AlimentosBebidas.gs tenía estos errores.

---

**Última actualización:** 2026-03-01
**Commit:** 195064e
**Rama:** claude/add-registration-fields-9lsla
**Archivos corregidos:** AlimentosBebidas.gs
