# 🔧 SOLUCIÓN: EL CÓDIGO NO FUNCIONA

## 🔴 PROBLEMA IDENTIFICADO

El código está copiado correctamente en Google Apps Script, pero **los cambios automáticos NO se ejecutan** porque faltan los **TRIGGERS** (disparadores).

Los triggers son como "alarmas" que le dicen a Google Apps Script:
- "Cuando alguien edite una celda, ejecuta el código"
- "Cada hora, actualiza los reportes"

**SIN triggers = El código NO se ejecuta automáticamente** ❌

---

## ✅ SOLUCIÓN (2 MINUTOS)

### **OPCIÓN 1: Instalar Solo los Triggers (RECOMENDADO)**

1. **Abre tu hoja de Google Sheets**
2. **Ve al menú:** `💻 Tecnología` → `⚙️ Configuración` → `⏰ Instalar Triggers`
3. **Autoriza los permisos** si te lo pide
4. **Espera el mensaje:** "✅ Triggers instalados"
5. **¡LISTO!** Ahora prueba los cambios

---

### **OPCIÓN 2: Instalar Sistema Completo**

Si la Opción 1 no funciona, usa esta:

1. **Abre tu hoja de Google Sheets**
2. **Ve al menú:** `💻 Tecnología` → `⚙️ Configuración` → `⚙️ Instalar Sistema (solo hojas)`
3. **Autoriza los permisos** si te lo pide
4. **Espera** a que termine (30-60 segundos)
5. **Verifica la instalación:** `💻 Tecnología` → `🛠️ Herramientas` → `✅ Verificar Instalación`

---

### **OPCIÓN 3: Manual desde Apps Script (Si las anteriores fallan)**

1. **Abre Google Apps Script** (Extensiones → Apps Script)
2. **En el editor, busca la función:** `instalarTriggers`
3. **Selecciónala en el menú desplegable** (arriba, al lado de "Ejecutar")
4. **Haz clic en el botón "Ejecutar"** (▶️)
5. **Autoriza los permisos** si te lo pide
6. **Espera** a que termine (verás "Ejecución completada")
7. **Cierra Apps Script** y vuelve a Google Sheets

---

## 🔍 CÓMO VERIFICAR QUE FUNCIONÓ

### **Paso 1: Verificar Instalación**

1. En Google Sheets, ve a: `💻 Tecnología` → `🛠️ Herramientas` → `✅ Verificar Instalación`
2. Deberías ver:
   ```
   ✅ Trigger al editar
   ✅ Trigger de tiempo
   🎉 TODO LISTO Y FUNCIONANDO
   ```

### **Paso 2: Probar que Funciona**

#### Test 1: Fecha Automática ✅
1. Ve a "Hoja de Interés"
2. En una fila con datos, columna "Estado" (O), selecciona: **"Entrevista agendada"**
3. Ve a la hoja "Entrevistas"
4. ✅ **Verifica que la columna A tiene la fecha de HOY**

#### Test 2: Entrevistador Vacío ✅
1. En la misma fila de "Entrevistas"
2. ✅ **Verifica que la columna K (Entrevistador) está VACÍA**

#### Test 3: Estado Inscritx ✅
1. En la hoja "Entrevistas", columna N (Estado), pon: **"Aprobada"**
2. Ve a la hoja "Inscritx"
3. ✅ **Verifica que la columna K dice "Inscritx"**

---

## 🆘 SI AÚN NO FUNCIONA

### Problema: "No veo el menú 💻 Tecnología"

**Solución:**
1. Refresca la página (F5)
2. Cierra y vuelve a abrir la hoja
3. Espera 10-20 segundos después de abrir la hoja

---

### Problema: "Me pide autorización pero da error"

**Solución:**
1. Ve a Google Apps Script (Extensiones → Apps Script)
2. En el menú superior: **Ejecutar** → Selecciona `onOpen`
3. Haz clic en **Ejecutar** (▶️)
4. **Autoriza** todos los permisos que te pida
5. Una vez autorizado, ejecuta `instalarTriggers` de la misma forma
6. Cierra Apps Script y vuelve a Sheets

---

### Problema: "Verificar Instalación dice ❌ Trigger al editar"

**Solución:**
1. Ve a Google Apps Script
2. En el menú lateral izquierdo, haz clic en el ícono del **reloj** (⏰ Activadores/Triggers)
3. **Verifica** si hay un trigger llamado `alEditar`
4. Si NO hay ninguno:
   - Vuelve al editor (< >)
   - Ejecuta manualmente `instalarTriggers`
5. Si HAY uno pero con otro nombre (ej. `onEdit`):
   - **Elimínalo** (botón de 3 puntos → Eliminar)
   - Ejecuta `instalarTriggers` de nuevo

---

### Problema: "Los cambios siguen sin funcionar"

**Diagnóstico paso a paso:**

1. **Verifica el código copiado:**
   ```javascript
   // Busca esta línea en tech.gs (línea ~1484)
   new Date(),           // A: Fecha Entrevista (automática - fecha actual)

   // Busca esta línea (línea ~1545)
   'Inscritx',           // Estado (automático)
   ```

2. **Verifica los triggers en Apps Script:**
   - Apps Script → ⏰ Activadores
   - Debe haber: `alEditar` (Al editar)
   - Debe haber: `actualizarReportes` (Basado en tiempo)

3. **Verifica los logs de error:**
   - Apps Script → Ejecuciones (ícono de lista)
   - Si hay errores rojos, cópialos y revísalos

4. **Prueba manualmente una función:**
   - Apps Script → Editor
   - Selecciona función: `procesarCambioEstadoInteres`
   - Ejecutar
   - Si da error, lee el mensaje de error

---

## 📊 TABLA DE DIAGNÓSTICO

| Síntoma | Causa Probable | Solución |
|---------|---------------|----------|
| No pasa nada al editar celdas | Triggers no instalados | Ejecutar "Instalar Triggers" |
| Pide permisos constantemente | No se autorizó completamente | Autorizar desde Apps Script |
| Error "función no encontrada" | Código no copiado bien | Volver a copiar tech.gs completo |
| Funciona a veces, a veces no | Trigger duplicado o corrupto | Eliminar todos los triggers y reinstalar |
| Menu "Tecnología" no aparece | onOpen no se ejecutó | Refrescar página o ejecutar onOpen manual |

---

## ✅ LISTA DE VERIFICACIÓN COMPLETA

Marca cada paso:

- [ ] Copié tech.gs completo en Google Apps Script
- [ ] Copié AlimentosBebidas.gs completo en Google Apps Script
- [ ] Guardé ambos archivos
- [ ] Ejecuté "Instalar Triggers" desde el menú
- [ ] Autoricé todos los permisos solicitados
- [ ] Ejecuté "Verificar Instalación" → Dice "TODO LISTO"
- [ ] Probé crear una entrevista → Fecha se pone automática
- [ ] Probé aprobar entrevista → Estado "Inscritx" se pone automático
- [ ] El desplegable de cohortes está en la columna L de Inscritx

---

## 🎯 RESUMEN RÁPIDO

```
1. Copia el código → ✅ YA LO HICISTE
2. Instala los triggers → ⚠️ FALTA ESTE PASO
3. Prueba que funciona → Después del paso 2
```

**El paso que te falta es el #2: INSTALAR TRIGGERS**

**Menú:** `💻 Tecnología` → `⚙️ Configuración` → `⏰ Instalar Triggers`

---

## 📞 COMANDOS ÚTILES

Desde Google Apps Script, puedes ejecutar:

- `instalarTriggers()` - Instala los triggers necesarios
- `verificarInstalacion()` - Verifica que todo esté OK
- `repararValidaciones()` - Repara desplegables si están mal
- `onOpen()` - Crea el menú personalizado

---

**Última actualización:** 2026-03-01
**Problema común:** 95% de las veces es falta de triggers
**Tiempo de solución:** 2 minutos
