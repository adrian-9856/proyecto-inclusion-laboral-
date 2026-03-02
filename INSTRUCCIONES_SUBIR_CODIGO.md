# 📋 INSTRUCCIONES PARA SUBIR EL CÓDIGO A GOOGLE SHEETS

## 🚨 PROBLEMA IDENTIFICADO

El código está guardado localmente (en GitHub) pero **NO está en Google Apps Script**. Por eso los cambios no funcionan.

## ✅ SOLUCIÓN - PASO A PASO

### PASO 1: Abrir Google Sheets

1. Ve a tu hoja de Google Sheets de Tecnología
2. En el menú superior, haz clic en: **Extensiones → Apps Script**
3. Se abrirá el editor de Google Apps Script

### PASO 2: Subir el código de Tecnología (tech.gs)

1. En el editor de Apps Script, busca el archivo existente (probablemente se llama "Código.gs" o similar)
2. **SELECCIONA TODO EL CÓDIGO ANTIGUO** (Ctrl+A o Cmd+A)
3. **BÓRRALO** (Delete)
4. Abre el archivo `tech.gs` de este repositorio
5. **COPIA TODO EL CONTENIDO** del archivo `tech.gs` (Ctrl+A, luego Ctrl+C)
6. **PEGA EL CÓDIGO** en el editor de Google Apps Script (Ctrl+V)
7. Haz clic en el ícono del **diskette (💾) para GUARDAR**
8. Espera a que diga "Guardando proyecto..." y luego "Proyecto guardado"

### PASO 3: Subir el código de Alimentos y Bebidas (AlimentosBebidas.gs)

1. Ve a tu hoja de Google Sheets de Alimentos y Bebidas
2. En el menú superior, haz clic en: **Extensiones → Apps Script**
3. En el editor de Apps Script, selecciona TODO el código antiguo y bórralo
4. Abre el archivo `AlimentosBebidas.gs` de este repositorio
5. **COPIA TODO EL CONTENIDO** del archivo
6. **PEGA EL CÓDIGO** en el editor de Google Apps Script
7. **GUARDA** (ícono del diskette 💾)

### PASO 4: Instalar los Triggers (MUY IMPORTANTE)

Después de subir el código:

#### Para Tecnología:
1. En tu hoja de Google Sheets de Tecnología
2. Busca el nuevo menú: **🔧 CREAMOS** (aparecerá en la barra superior)
3. Haz clic en: **🔧 CREAMOS → ⚙️ Configuración → Instalar Triggers**
4. Acepta los permisos cuando te los pida Google
5. Espera el mensaje "✅ Triggers instalados"

#### Para Alimentos y Bebidas:
1. En tu hoja de Google Sheets de Alimentos y Bebidas
2. Haz clic en: **🔧 CREAMOS → ⚙️ Configuración → Instalar Triggers**
3. Acepta los permisos
4. Espera el mensaje de confirmación

### PASO 5: Verificar que funciona

1. Ve a la hoja **"Hoja de Interés"**
2. Selecciona una fila con datos
3. En la columna **"Estado"**, selecciona **"Entrevista agendada"**
4. Deberías ver:
   - Un mensaje emergente: "📋 Entrevista creada en hoja Entrevistas"
   - Los datos se copian a la hoja "Entrevistas"
   - Los campos vacíos se autocompletan desde el Directorio Maestro

## ⚠️ IMPORTANTE

- **NO uses "clasp push"** a menos que hayas configurado clasp correctamente
- **SIEMPRE guarda** después de pegar el código (ícono del diskette 💾)
- **INSTALA LOS TRIGGERS** después de subir el código
- Si Google pide permisos, **acéptalos** (son necesarios para que funcione)

## 🆘 SI ALGO FALLA

Si después de seguir estos pasos algo no funciona:

1. Revisa la consola de errores en Apps Script:
   - En el editor de Apps Script, haz clic en **Executions** (⚡) en la barra lateral izquierda
   - Mira si hay errores rojos

2. Verifica que la hoja "Copy of CREAMOS ID nuevo" (Directorio Maestro) existe y tiene datos

3. Avísame qué error específico ves y te ayudaré a resolverlo

## 📝 RESUMEN

1. ✅ Abrir Google Sheets → Extensiones → Apps Script
2. ✅ Copiar código de `tech.gs` → Pegar → Guardar
3. ✅ Copiar código de `AlimentosBebidas.gs` → Pegar → Guardar
4. ✅ Instalar Triggers desde el menú 🔧 CREAMOS
5. ✅ Probar que funciona

---

**¿Necesitas ayuda con algún paso específico? ¡Avísame!**
