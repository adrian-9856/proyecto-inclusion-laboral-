# 🚨 SOLUCIÓN URGENTE - ZONA Y NIVEL EDUCATIVO NO SE COPIAN

## ❌ PROBLEMA IDENTIFICADO

**El código actualizado está en GitHub pero NO en Google Apps Script.**

Por eso:
- ❌ Zona y Nivel Educativo NO se copian de Entrevistas a Inscritx
- ❌ El estado "Inscritx" no se asigna automáticamente
- ❌ Los datos no se mueven entre hojas

## ✅ SOLUCIÓN (5 minutos)

### SISTEMA TECNOLOGÍA

1. **Abre tu Google Sheet de Tecnología**

2. **Menú: Extensiones → Apps Script**
   - Se abre el editor de código

3. **En el editor:**
   - Presiona `Ctrl+A` (seleccionar todo el código antiguo)
   - Presiona `Delete` (borrarlo)

4. **Copia el código nuevo:**
   - Abre este archivo: `tech.gs`
   - Presiona `Ctrl+A` para seleccionar todo
   - Presiona `Ctrl+C` para copiar

5. **Pega en Google Apps Script:**
   - Vuelve al editor de Apps Script
   - Presiona `Ctrl+V` para pegar
   - Haz clic en el **icono del diskette 💾** para GUARDAR
   - Espera a que diga "Proyecto guardado"

6. **Instala los triggers:**
   - Vuelve a tu Google Sheet
   - En el menú superior verás: **🔧 CREAMOS**
   - Haz clic en: **🔧 CREAMOS → ⚙️ Configuración → Instalar Triggers**
   - Acepta los permisos cuando te los pida
   - Espera el mensaje "✅ Triggers instalados"

7. **PRUEBA:**
   - Ve a la hoja "Entrevistas"
   - En una fila con datos, cambia la columna "Estado" a "Aprobada"
   - **DEBE aparecer:**
     - Mensaje: "✅ Aprobada - copiada a Inscritx"
     - Los datos SE COPIAN a la hoja "Inscritx" **CON Zona y Nivel Educativo**

---

### SISTEMA ALIMENTOS Y BEBIDAS

Repite **EXACTAMENTE** los mismos pasos pero:
- Usa tu Google Sheet de **Alimentos y Bebidas**
- Copia el archivo: `AlimentosBebidas.gs` (en lugar de tech.gs)

---

## 🔍 VERIFICACIÓN

Después de subir el código, verifica que funciona:

### Test 1: Transferencia Hoja de Interés → Entrevistas
1. Ve a "Hoja de Interés"
2. En una fila con datos, cambia "Estado" a "Entrevista agendada"
3. **DEBE aparecer:**
   - La fila se copia a "Entrevistas"
   - Nivel Educativo y Zona se copian correctamente

### Test 2: Transferencia Entrevistas → Inscritx
1. Ve a "Entrevistas"
2. En una fila con datos, cambia "Estado" a "Aprobada"
3. **DEBE aparecer:**
   - La fila se copia a "Inscritx"
   - **Nivel Educativo y Zona SE COPIAN** (esto era lo que fallaba)
   - El estado muestra "Inscritx"

---

## 🆘 SI TODAVÍA NO FUNCIONA

Si después de copiar el código TODAVÍA no funciona:

1. **Verifica errores en Apps Script:**
   - En el editor de Apps Script
   - Haz clic en el ícono de reloj ⏰ (Executions) en la barra lateral
   - Mira si hay errores rojos
   - **Copia el error y avísame**

2. **Verifica que la hoja "Copy of CREAMOS ID nuevo" existe:**
   - Esta es la hoja del Directorio Maestro
   - Debe tener columnas: Nombre, Creamos ID, DPI, Edad, Nivel Educativo, Zona
   - Si no existe, los campos NO se autocompletarán

3. **Avísame qué mensaje de error ves exactamente**

---

## 📝 RESUMEN RÁPIDO

1. ✅ Google Sheets → Extensiones → Apps Script
2. ✅ Borrar código antiguo (Ctrl+A, Delete)
3. ✅ Copiar `tech.gs` → Pegar → Guardar (💾)
4. ✅ Repetir para `AlimentosBebidas.gs`
5. ✅ Instalar Triggers (menú 🔧 CREAMOS)
6. ✅ Probar: Entrevista "Aprobada" → Debe copiar a Inscritx CON Zona y Nivel Educativo

---

**El código YA está corregido. Solo necesitas COPIARLO a Google Apps Script.**

¿Necesitas ayuda con algún paso? ¡Avísame!
