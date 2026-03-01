# 📋 INSTRUCCIONES ULTRA-SIMPLES - COPIAR Y PEGAR

## 🎯 LOS CAMBIOS YA ESTÁN HECHOS EN LOS ARCHIVOS

Los archivos `tech.gs` y `AlimentosBebidas.gs` de este repositorio YA tienen todos los cambios correctos:

✅ Fecha de entrevista automática
✅ Estado "Inscritx" automático
✅ Desplegable de cohortes en columna L (no en K)
✅ Entrevistador vacío (no automático)
✅ Nivel educativo correcto en todo el flujo
✅ Hora vacía para ingreso manual

---

## 🚀 PASOS PARA DESPLEGAR (5 MINUTOS)

### **PASO 1: Abrir Google Apps Script**

1. Abre tu hoja de Google Sheets del proyecto
2. Ve a: **Extensiones** → **Apps Script**
3. Verás una lista de archivos a la izquierda

---

### **PASO 2: Copiar tech.gs**

#### En tu computadora:
1. Abre el archivo `tech.gs` de este repositorio
2. Selecciona TODO el contenido (Ctrl+A o Cmd+A)
3. Copia (Ctrl+C o Cmd+C)

#### En Google Apps Script:
1. Haz clic en el archivo `tech.gs` en la lista de la izquierda
2. Selecciona TODO el contenido actual (Ctrl+A o Cmd+A)
3. Pega el nuevo contenido (Ctrl+V o Cmd+V)
4. **GUARDA** (Ctrl+S o Cmd+S o haz clic en el ícono 💾)

---

### **PASO 3: Copiar AlimentosBebidas.gs**

#### En tu computadora:
1. Abre el archivo `AlimentosBebidas.gs` de este repositorio
2. Selecciona TODO el contenido (Ctrl+A o Cmd+A)
3. Copia (Ctrl+C o Cmd+C)

#### En Google Apps Script:
1. Haz clic en el archivo `AlimentosBebidas.gs` en la lista de la izquierda
2. Selecciona TODO el contenido actual (Ctrl+A o Cmd+A)
3. Pega el nuevo contenido (Ctrl+V o Cmd+V)
4. **GUARDA** (Ctrl+S o Cmd+S o haz clic en el ícono 💾)

---

### **PASO 4: Actualizar Validaciones**

1. Cierra el editor de Apps Script
2. Vuelve a tu hoja de Google Sheets
3. En el menú personalizado **"🎓 Creamos Tech"**, selecciona:
   - **"⚙️ Configurar hojas y validaciones"**
4. Espera 10-20 segundos hasta ver el mensaje de confirmación

---

### **PASO 5: Probar que Funciona**

#### Test 1: Fecha Automática
1. Ve a la hoja "Hoja de Interés"
2. Selecciona una fila con datos
3. En la columna "Estado" selecciona: **"Entrevista agendada"**
4. Ve a la hoja "Entrevistas"
5. ✅ **Verifica que la columna A (Fecha) tiene la fecha de hoy**

#### Test 2: Entrevistador Vacío
1. En la misma fila de "Entrevistas"
2. ✅ **Verifica que la columna K (Entrevistador) está VACÍA**

#### Test 3: Nivel Educativo
1. Verifica que el nivel educativo de la persona aparece en la columna I
2. ✅ **Verifica que sea el mismo que tenía en Hoja de Interés**

#### Test 4: Estado Inscritx
1. En la hoja "Entrevistas", pon en la columna N (Estado): **"Aprobada"**
2. Ve a la hoja "Inscritx"
3. ✅ **Verifica que la columna K (Estado) dice "Inscritx" automáticamente**

#### Test 5: Desplegable Cohortes
1. En la hoja "Inscritx"
2. Haz clic en la columna L (Enviar a Cohorte)
3. ✅ **Verifica que aparece un desplegable con las cohortes activas**

---

## ✅ LISTA DE VERIFICACIÓN

Marca cada uno cuando lo completes:

- [ ] Abrí Google Apps Script
- [ ] Copié y pegué tech.gs completo
- [ ] Guardé tech.gs
- [ ] Copié y pegué AlimentosBebidas.gs completo
- [ ] Guardé AlimentosBebidas.gs
- [ ] Ejecuté "Configurar hojas y validaciones"
- [ ] Probé que la fecha se pone automática
- [ ] Probé que el entrevistador queda vacío
- [ ] Probé que el nivel educativo se copia bien
- [ ] Probé que el estado "Inscritx" se pone automático
- [ ] Probé que el desplegable de cohortes está en la columna L

---

## 🆘 SI ALGO NO FUNCIONA

### Problema: No veo los cambios
**Solución:**
1. Refresca la página de Google Sheets (F5)
2. Ejecuta "Configurar hojas y validaciones" otra vez
3. Espera 30 segundos

### Problema: Error al guardar
**Solución:**
1. Verifica que copiaste TODO el contenido (desde la primera línea hasta la última)
2. Asegúrate de que no quedan caracteres extra al inicio o final
3. Intenta guardar de nuevo

### Problema: El desplegable sigue en la columna K
**Solución:**
1. Selecciona toda la columna K
2. Ve a Datos → Validación de datos
3. Elimina la validación
4. Ejecuta "Configurar hojas y validaciones" de nuevo

---

## 📞 NOTAS IMPORTANTES

- **NO borres** ningún archivo en Google Apps Script, solo REEMPLAZA el contenido
- **NO cierres** Google Apps Script hasta que hayas guardado ambos archivos
- **SI tienes dudas**, ejecuta "Configurar hojas y validaciones" de nuevo - no hace daño ejecutarlo varias veces

---

**Tiempo total estimado:** 5-7 minutos
**Última actualización:** 2026-03-01
