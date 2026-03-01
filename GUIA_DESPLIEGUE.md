# 🚀 Guía de Despliegue a Google Apps Script

## ✅ CORRECCIONES IMPLEMENTADAS EN EL CÓDIGO

Todas las siguientes correcciones están implementadas en los archivos `tech.gs` y `AlimentosBebidas.gs`:

| # | Corrección | ✅ Estado |
|---|-----------|----------|
| 1 | **Fecha de Entrevista Automática** - Se pone la fecha actual cuando se agenda | ✅ Línea 1484/1483 |
| 2 | **Estado "Inscritx" Automático** - Se pone automáticamente al aprobar entrevista | ✅ Línea 1545/1544 |
| 3 | **Desplegable de Cohortes en Columna L** - Corregido de columna K a L | ✅ Línea 1164 |
| 4 | **Entrevistador Vacío** - No se pone automáticamente, queda para selección manual | ✅ Línea 1494/1493 |
| 5 | **Nivel Educativo Correcto** - Se envía correctamente desde Kobo → Interés → Entrevistas → Inscritx | ✅ Línea 1492/1491 |

---

## 📋 OPCIÓN 1: Despliegue Manual (Recomendado)

### Pasos:

1. **Abre Google Apps Script**
   - Ve a tu hoja de Google Sheets
   - Extensiones → Apps Script

2. **Actualiza tech.gs**
   - En el editor de Apps Script, busca el archivo `tech.gs`
   - Borra todo el contenido actual
   - Copia el contenido del archivo `tech.gs` de este repositorio
   - Pega en el editor
   - Guarda (Ctrl+S o Cmd+S)

3. **Actualiza AlimentosBebidas.gs**
   - Busca el archivo `AlimentosBebidas.gs`
   - Borra todo el contenido actual
   - Copia el contenido del archivo `AlimentosBebidas.gs` de este repositorio
   - Pega en el editor
   - Guarda (Ctrl+S o Cmd+S)

4. **Guarda el Proyecto**
   - Haz clic en el ícono de guardar (💾)
   - Espera a que se guarde completamente

5. **Actualiza las Validaciones**
   - Vuelve a tu hoja de Google Sheets
   - En el menú personalizado "🎓 Creamos Tech", selecciona "⚙️ Configurar hojas y validaciones"
   - Espera a que termine (verás un mensaje de confirmación)

6. **Prueba el Flujo**
   - Crea una entrada de prueba en Hoja de Interés
   - Cambia el estado a "Entrevista agendada"
   - Verifica que:
     - ✅ La fecha se pone automáticamente
     - ✅ El entrevistador queda vacío
     - ✅ El nivel educativo se copia correctamente
   - Completa la entrevista y marca como "Aprobada"
   - Verifica que:
     - ✅ El estado "Inscritx" se pone automáticamente
     - ✅ El desplegable de cohortes aparece en la columna L

---

## 🔧 OPCIÓN 2: Despliegue con clasp (Automatizado)

### Requisitos Previos:

```bash
# Instalar Node.js (si no lo tienes)
# Instalar clasp globalmente
npm install -g @google/clasp
```

### Configuración Inicial:

1. **Autenticarse con Google**
   ```bash
   clasp login
   ```

2. **Obtener el Script ID**
   - Ve a tu proyecto en Google Apps Script
   - Configuración del proyecto (⚙️)
   - Copia el "ID de la secuencia de comandos"

3. **Crear archivo .clasp.json**
   - Crea un archivo `.clasp.json` en la raíz del proyecto con:
   ```json
   {
     "scriptId": "TU_SCRIPT_ID_AQUI",
     "rootDir": "."
   }
   ```

4. **Crear archivo appsscript.json**
   ```json
   {
     "timeZone": "America/Guatemala",
     "dependencies": {},
     "exceptionLogging": "STACKDRIVER",
     "runtimeVersion": "V8"
   }
   ```

### Desplegar:

```bash
# Desde la raíz del proyecto
clasp push

# O para forzar la subida
clasp push --force
```

---

## 🔍 VERIFICACIÓN POST-DESPLIEGUE

Después de desplegar, verifica:

### 1. Fecha de Entrevista
- [ ] Al agendar una entrevista, la fecha se pone automáticamente con la fecha actual

### 2. Estado "Inscritx"
- [ ] Al aprobar una entrevista, el estado se pone como "Inscritx" automáticamente

### 3. Desplegable de Cohortes
- [ ] En la hoja "Inscritx", la columna L tiene un desplegable con las cohortes activas
- [ ] Puedes seleccionar una cohorte de la lista

### 4. Nivel Educativo
- [ ] El nivel educativo se copia correctamente desde Kobo → Interés → Entrevistas → Inscritx
- [ ] Verifica que sea el mismo en todas las hojas

### 5. Entrevistador
- [ ] Al crear una entrevista, el campo "Entrevistador" queda vacío para selección manual
- [ ] NO se pone ningún valor automáticamente

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### Problema: "No veo los cambios"
**Solución:** Asegúrate de:
1. Haber guardado los archivos en Google Apps Script
2. Haber ejecutado "Configurar hojas y validaciones" desde el menú
3. Refrescar la página de Google Sheets (F5)

### Problema: "El desplegable sigue en la columna K"
**Solución:**
1. Ejecuta "Configurar hojas y validaciones" nuevamente
2. Si persiste, elimina manualmente la validación de la columna K
3. La validación de la columna L se aplicará automáticamente

### Problema: "La fecha no se pone automáticamente"
**Solución:**
1. Verifica que hayas copiado el código completo
2. Busca la línea `new Date()` en la función `procesarCambioEstadoInteres`
3. Debe estar en la línea ~1484 para tech.gs y ~1483 para AlimentosBebidas.gs

---

## 📞 SOPORTE

Si encuentras problemas:
1. Revisa los logs en Apps Script (Ver → Registros)
2. Verifica que todas las hojas tengan los nombres correctos
3. Ejecuta "Configurar hojas y validaciones" nuevamente

---

**Última actualización:** 2026-03-01
**Versión del código:** claude/add-registration-fields-9lsla
