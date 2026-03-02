# DIAGNÓSTICO: Campos "Nivel Educativo" y "Zona" Incompletos

## Fecha: 2026-03-02

## Problema Reportado
El usuario reporta que los campos **"Nivel Educativo"** y **"Zona"** no están llegando completos cuando los datos se transfieren entre hojas.

## Análisis del Código

### ✅ El código está CORRECTO
Después de revisar exhaustivamente ambos archivos (`tech.gs` y `AlimentosBebidas.gs`), confirmo que las transferencias de datos están correctamente implementadas:

#### 1. Importación desde KoboToolbox
**Ubicación:** Función `importarDesdeKoboInterno()` (línea ~2974-2977)
```javascript
const nivelEducativo = colIndices.nivelEducativo >= 0 ? fila[colIndices.nivelEducativo].toString().trim() : '';
const zona = colIndices.zona >= 0 ? fila[colIndices.zona].toString().trim() : '';
```
**Se inserta en Hoja de Interés** (línea ~3037-3038):
```javascript
nivelEducativo,    // I: Nivel Educativo
zona,              // J: Zona
```

#### 2. Transferencia: Hoja de Interés → Entrevistas
**Ubicación:** Función `procesarCambioEstadoInteres()` (línea ~1540-1541)
```javascript
datos[8],             // I: Nivel Educativo
datos[9],             // J: Zona
```

#### 3. Transferencia: Entrevistas → Inscritx
**Ubicación:** Función `procesarResultadoEntrevista()` (línea ~1590-1591)
```javascript
datos[8] || '',       // Nivel Educativo
datos[9] || '',       // Zona
```

#### 4. Transferencia: Inscritx → Cohortes
**Ubicación:** Función `procesarEnvioACohorte()` (línea ~1950-1951 en AlimentosBebidas / 1956-1957 en tech)
```javascript
datos[7],             // Nivel Educativo
datos[8],             // Zona
```

## Posibles Causas del Problema

### 1. ❌ Los datos NO están llegando desde KoboToolbox
**Síntoma:** Los campos "Nivel Educativo" y "Zona" están vacíos desde el principio en la Hoja de Interés.

**Causa:** Los nombres de las columnas en KoboToolbox han cambiado o los formularios no están capturando estos datos.

**Solución:**
- Verificar que el formulario en KoboToolbox tenga los campos:
  - `Inicio/¿Cuál es tu último nivel de estudios terminado?`
  - `Inicio/Zona`
- Ejecutar la función de menú **"Ver Columnas Kobo"** para diagnosticar qué columnas están llegando
- Revisar que la URL de exportación de Kobo esté configurada correctamente

### 2. ❌ Las hojas tienen una estructura antigua
**Síntoma:** Las columnas están en posiciones diferentes a las esperadas.

**Causa:** Las hojas fueron creadas antes de implementar las correcciones documentadas.

**Solución:**
- **OPCIÓN A (Reinstalar - BORRA DATOS):** Ejecutar "🗑️ Desinstalar Sistema Completo" y luego "🚀 Instalación Completa"
- **OPCIÓN B (Verificar estructura):** Verificar manualmente que las columnas estén en el orden correcto

### 3. ❌ Los campos están vacíos en algunos registros
**Síntoma:** Algunos registros tienen los campos llenos y otros no.

**Causa:** Los datos no se llenaron en el formulario original de Kobo.

**Solución:**
- Si tienes una hoja "CREAMOS ID - Directorio Maestro" (importada desde Salesforce):
  - Ejecutar **"Autocompletar desde CREAMOS ID"** del menú
  - Esto rellenará automáticamente los campos vacíos

## Estructura Esperada de Cada Hoja

### Hoja de Interés (16 columnas)
```
A - Fecha Registro
B - No.
C - Creamos ID
D - DPI
E - Nombre Completo
F - Género
G - Edad
H - Teléfono
I - Nivel Educativo ⭐
J - Zona ⭐
K - Cómo se enteró
L - Responsable
M - Notas
N - ¿Deseas inscribirte?
O - Servicio/Formación de Interés
P - Estado
```

### Entrevistas (14 columnas)
```
A - Fecha Entrevista
B - Hora
C - Creamos ID
D - DPI
E - Nombre Completo
F - Género
G - Edad
H - Teléfono
I - Nivel Educativo ⭐
J - Zona ⭐
K - Entrevistador
L - Calificación
M - Observaciones
N - Estado
```

### Inscritx (12 columnas)
```
A - No.
B - Creamos ID
C - DPI
D - Nombre Completo
E - Género
F - Edad
G - Teléfono
H - Nivel Educativo ⭐
I - Zona ⭐
J - Notas
K - Estado
L - Enviar a Cohorte
```

### Hoja Individual de Cohorte (12 columnas)
```
A - Fecha Selección
B - No.
C - Creamos ID
D - DPI
E - Nombre Completo
F - Género
G - Edad
H - Teléfono
I - Nivel Educativo ⭐
J - Zona ⭐
K - Estado
L - Año
```

## Pasos para Solucionar

### Paso 1: Verificar Hoja de Interés
1. Abrir la hoja "Hoja de Interés"
2. Verificar que las columnas I y J sean "Nivel Educativo" y "Zona"
3. Revisar si los datos están llegando desde Kobo (ver filas recientes)

### Paso 2: Si los datos NO están en Hoja de Interés
- El problema está en la importación desde Kobo
- Verificar URL de Kobo y nombres de columnas
- Ejecutar función diagnóstica "Ver Columnas Kobo"

### Paso 3: Si los datos SÍ están en Hoja de Interés pero NO en Entrevistas
- Verificar que la hoja "Entrevistas" tenga las columnas I y J como "Nivel Educativo" y "Zona"
- Si la estructura es diferente, necesitas recrear la hoja

### Paso 4: Actualizar código si es necesario
- Asegurarse de tener la versión más reciente de `tech.gs` o `AlimentosBebidas.gs`
- Copiar el código actualizado al editor de Apps Script
- Guardar y refrescar

## Recomendación Final

**Si el problema persiste después de verificar los pasos anteriores:**

1. **Crear nuevas hojas con la estructura correcta** ejecutando:
   - Menú → 🔧 Reparar Validaciones
   - Menú → 🔧 Reparar Fórmulas

2. **Importar datos desde Kobo nuevamente**

3. **Verificar que cada transferencia funcione correctamente:**
   - Hoja de Interés → cambiar estado a "Entrevista agendada"
   - Ver que los datos lleguen completos a Entrevistas
   - Marcar entrevista como "Aprobada"
   - Ver que los datos lleguen completos a Inscritx
   - Enviar a una cohorte
   - Ver que los datos lleguen completos a la hoja de cohorte

## Contacto
Si después de seguir estos pasos el problema continúa, necesitaría ver:
1. Un screenshot de la estructura de columnas de cada hoja
2. Un ejemplo de un registro que tenga el problema
3. Los logs del sistema (Ver → Registros en Apps Script)
