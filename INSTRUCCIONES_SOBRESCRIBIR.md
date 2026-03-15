# 📘 INSTRUCCIONES: Función Sobrescribir Completo

## 🎯 ¿Para qué sirve esta función?

Esta función es diferente a `autocompletarDesdeCreamosID` porque:

- **autocompletarDesdeCreamosID**: Solo llena campos VACÍOS
- **sobrescribirSiCompleto**: SOBRESCRIBE todo si el directorio tiene info completa

---

## 🔧 Lógica de la Función

### CASO 1: Fila SOLO tiene CreamosID (sin nombre ni datos)

**Ejemplo:**
```
Fila en tu hoja:
- CreamosID: "TECH-2024-001"
- Nombre: (vacío)
- Edad: (vacío)
- Nivel Educativo: (vacío)
- Zona: (vacío)
```

**Resultado:**
- ✅ **NO busca en el directorio**
- ✅ **Mantiene el ID: "TECH-2024-001"**
- ✅ **NO sobrescribe nada**
- ✅ **Deja la fila como está**

---

### CASO 2: Fila tiene información completa

**Ejemplo:**
```
Fila en tu hoja:
- CreamosID: "TECH-2024-001"
- Nombre: "María López"
- Edad: "25"
- Nivel Educativo: "Diversificado completo"
- Zona: "Zona 10"
```

**En el Directorio:**
```
- CreamosID: "TECH-2024-001"
- Nombre: "María López González"  ← Nombre completo corregido
- Edad: "26"  ← Edad actualizada
- Nivel Educativo: "Universitario incompleto"  ← Nivel actualizado
- Zona: "Zona 11"  ← Zona actualizada
```

**Resultado:**
- ✅ **Busca en el directorio por "TECH-2024-001"**
- ✅ **Encuentra info completa en el directorio**
- ✅ **SOBRESCRIBE TODO:**
  - Nombre: "María López González"
  - Edad: "26"
  - Nivel Educativo: "Universitario incompleto"
  - Zona: "Zona 11"

---

### CASO 3: Directorio solo tiene info parcial

**Ejemplo:**
```
Fila en tu hoja:
- CreamosID: "TECH-2024-002"
- Nombre: "Juan Pérez"
- Edad: "30"
- Nivel Educativo: (vacío)
- Zona: "Zona 5"
```

**En el Directorio:**
```
- CreamosID: "TECH-2024-002"
- Nombre: "Juan Pérez"
- Edad: (vacío)  ← No tiene edad
- Nivel Educativo: "Básicos completos"
- Zona: (vacío)  ← No tiene zona
```

**Resultado:**
- ✅ **Busca en el directorio**
- ⚠️ **El directorio NO tiene info completa** (falta edad y zona)
- ✅ **Solo completa campos VACÍOS:**
  - Nivel Educativo: "Básicos completos" ← Se completa porque estaba vacío
  - Edad y Zona SE MANTIENEN: "30" y "Zona 5" ← NO se sobrescriben

---

## 📝 Cómo Usar

### Paso 1: Copiar el código a Google Apps Script

1. Abre tu hoja de Google Sheets
2. Ve a **Extensiones** > **Apps Script**
3. Crea un nuevo archivo llamado `SobrescribirCompleto.gs`
4. Pega el código completo
5. Guarda (Ctrl+S o Cmd+S)

---

### Paso 2: Ejecutar la función

Hay 3 formas de ejecutar:

#### Opción A: Desde el editor de Apps Script
```javascript
// Ejecutar en el editor directamente
sobrescribirHojaInteres();     // Para actualizar "Hoja de Interés"
sobrescribirEntrevistas();      // Para actualizar "Entrevistas"
sobrescribirInscritx();         // Para actualizar "Inscritx"
```

#### Opción B: Crear un menú personalizado
Agrega esto en tu archivo principal (tech.gs):

```javascript
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🔄 Sobrescribir')
    .addItem('📝 Hoja de Interés', 'sobrescribirHojaInteres')
    .addItem('📝 Entrevistas', 'sobrescribirEntrevistas')
    .addItem('📝 Inscritx', 'sobrescribirInscritx')
    .addToUi();
}
```

Luego desde el menú:
1. Abre tu hoja de Google Sheets
2. Verás un nuevo menú "🔄 Sobrescribir"
3. Selecciona la hoja que quieres actualizar

#### Opción C: Especificar cualquier hoja
```javascript
sobrescribirSiCompleto('Nombre de la Hoja');
```

---

## 🧪 Ejemplos Completos

### Ejemplo 1: Solo ID (NO sobrescribe)

**ANTES:**
| CreamosID | Nombre | Edad | Nivel Educativo | Zona |
|-----------|--------|------|-----------------|------|
| TECH-001  |        |      |                 |      |

**DIRECTORIO:**
| CreamosID | Nombre | Edad | Nivel Educativo | Zona |
|-----------|--------|------|-----------------|------|
| TECH-001  | Ana García | 28 | Universitario | Zona 9 |

**DESPUÉS:**
| CreamosID | Nombre | Edad | Nivel Educativo | Zona |
|-----------|--------|------|-----------------|------|
| TECH-001  |        |      |                 |      |

✅ **NO cambió nada** porque la fila solo tenía ID

---

### Ejemplo 2: Info completa (SÍ sobrescribe)

**ANTES:**
| CreamosID | Nombre | Edad | Nivel Educativo | Zona |
|-----------|--------|------|-----------------|------|
| TECH-002  | Pedro López | 25 | Básicos | Zona 5 |

**DIRECTORIO:**
| CreamosID | Nombre | Edad | Nivel Educativo | Zona |
|-----------|-------------|------|-----------------|------|
| TECH-002  | Pedro López Méndez | 26 | Universitario | Zona 10 |

**DESPUÉS:**
| CreamosID | Nombre | Edad | Nivel Educativo | Zona |
|-----------|-------------|------|-----------------|------|
| TECH-002  | Pedro López Méndez | 26 | Universitario | Zona 10 |

✅ **Sobrescribió TODO** porque el directorio tiene info completa

---

### Ejemplo 3: Info parcial (Solo completa vacíos)

**ANTES:**
| CreamosID | Nombre | Edad | Nivel Educativo | Zona |
|-----------|--------|------|-----------------|------|
| TECH-003  | María  | 30   |                 |      |

**DIRECTORIO:**
| CreamosID | Nombre | Edad | Nivel Educativo | Zona |
|-----------|--------|------|-----------------|------|
| TECH-003  | María Rodríguez |  | Básicos |  |

**DESPUÉS:**
| CreamosID | Nombre | Edad | Nivel Educativo | Zona |
|-----------|--------|------|-----------------|------|
| TECH-003  | María  | 30   | Básicos         |      |

✅ **Solo completó Nivel Educativo** porque:
- El directorio NO tiene info completa (falta Edad y Zona)
- Solo se completaron campos vacíos

---

## ⚠️ IMPORTANTE

### Antes de ejecutar:
1. **Haz una copia de seguridad** de tu hoja
2. **Verifica** que la hoja del directorio (NOMBRE_HOJA_CREAMOS_ID_TECH) existe
3. **Prueba** primero con 1-2 filas

### Qué necesita la función:
- Una hoja con datos (ej: "Hoja de Interés", "Entrevistas", etc.)
- Una hoja de directorio con el nombre definido en NOMBRE_HOJA_CREAMOS_ID_TECH
- Columnas en la hoja: CreamosID, DPI, Nombre Completo, Edad, Nivel Educativo, Zona

### Estructura del Directorio:
```
Columna 0: Nombre
Columna 1: CreamosID
Columna 2: Año
Columna 3: Edad (Age)
Columna 4: DPI
Columna 5: Nivel Educativo
Columna 6: Zona
```

---

## 🔍 Mensajes de Resultado

Cuando termine, verás un mensaje como:

```
✅ Actualización completada:

📊 Filas actualizadas: 15
🆔 Solo ID enviado: 3
⚠️ Sin coincidencia: 2

💡 Se enviaron 3 IDs (sin sobrescribir datos)
♻️ Se sobrescribieron 12 filas con información completa
```

**Explicación:**
- **15 filas actualizadas**: Total de filas que se procesaron
- **3 Solo ID**: Filas que solo tenían ID (no se sobrescribieron)
- **2 Sin coincidencia**: Filas que no se encontraron en el directorio
- **12 sobrescribieron**: Filas que se actualizaron con info completa

---

## ❓ Preguntas Frecuentes

### ¿Qué pasa si una fila tiene nombre pero NO tiene CreamosID?
✅ Busca por DPI o por Nombre en el directorio y actualiza

### ¿Qué pasa si el directorio NO tiene el CreamosID?
⚠️ No se actualiza esa fila (se cuenta como "sin coincidencia")

### ¿Puedo deshacer los cambios?
✅ Usa Ctrl+Z o restaura desde la copia de seguridad

### ¿Funciona con otras hojas?
✅ Sí, solo cambia el nombre de la hoja:
```javascript
sobrescribirSiCompleto('Nombre de tu Hoja');
```

---

## 🚀 Siguiente Paso

1. Copia el código a Google Apps Script
2. Haz una copia de seguridad de tu hoja
3. Ejecuta la función
4. Verifica los resultados

¡Listo! Ya puedes sobrescribir datos completos sin afectar filas que solo tienen ID.
