# 📋 CÓMO COPIAR EL CÓDIGO CORREGIDO A GOOGLE APPS SCRIPT

## 🎯 PASO A PASO MUY DETALLADO

---

## 📁 **UBICACIÓN DE LOS ARCHIVOS CORREGIDOS**

Los archivos están en tu computadora/servidor en:
```
/home/user/proyecto-inclusion-laboral-/tech.gs
/home/user/proyecto-inclusion-laboral-/AlimentosBebidas.gs
```

---

## 🔄 **OPCIÓN 1: VER EL CÓDIGO AQUÍ Y COPIARLO**

### **Para tech.gs:**

**Paso 1:** Ejecuta este comando para ver el archivo:
```bash
cat tech.gs
```

**Paso 2:** El código completo aparecerá en la terminal

**Paso 3:** Selecciona TODO el código (desde la primera línea hasta la última)

**Paso 4:** Copia (Ctrl+C o Cmd+C)

**Paso 5:** Ve a tu hoja de Google Sheets de **Tecnología**

**Paso 6:** Menú → **Extensiones → Apps Script**

**Paso 7:** En la lista de archivos de la izquierda, busca **tech.gs** (o Code.gs)

**Paso 8:** **SELECCIONA TODO** el contenido actual (Ctrl+A)

**Paso 9:** **BORRA** (Delete)

**Paso 10:** **PEGA** el código copiado (Ctrl+V)

**Paso 11:** **GUARDA** (Ctrl+S o el icono de disquete)

---

### **Para AlimentosBebidas.gs:**

**Paso 1:** Ejecuta este comando para ver el archivo:
```bash
cat AlimentosBebidas.gs
```

**Paso 2:** El código completo aparecerá en la terminal

**Paso 3:** Selecciona TODO el código (desde la primera línea hasta la última)

**Paso 4:** Copia (Ctrl+C o Cmd+C)

**Paso 5:** Ve a tu hoja de Google Sheets de **Alimentos y Bebidas**

**Paso 6:** Menú → **Extensiones → Apps Script**

**Paso 7:** En la lista de archivos de la izquierda, busca **AlimentosBebidas.gs** (o Code.gs)

**Paso 8:** **SELECCIONA TODO** el contenido actual (Ctrl+A)

**Paso 9:** **BORRA** (Delete)

**Paso 10:** **PEGA** el código copiado (Ctrl+V)

**Paso 11:** **GUARDA** (Ctrl+S o el icono de disquete)

---

## 🔄 **OPCIÓN 2: DESCARGAR LOS ARCHIVOS**

Si estás trabajando desde un servidor remoto, necesitas descargar los archivos:

### **Método A: Usando Git Clone**

Si tienes acceso a GitHub:

**Paso 1:** Ve a tu repositorio en GitHub

**Paso 2:** Haz clic en el botón verde **"Code"**

**Paso 3:** Selecciona **"Download ZIP"**

**Paso 4:** Descomprime el archivo ZIP

**Paso 5:** Abre los archivos `tech.gs` y `AlimentosBebidas.gs` con un editor de texto

**Paso 6:** Copia el contenido y pégalo en Google Apps Script (ver pasos arriba)

---

### **Método B: Copiar directamente desde la terminal**

Si tienes acceso a la terminal donde están los archivos:

**Para tech.gs:**
```bash
cat tech.gs
```
Copia TODO el output y pégalo en Google Apps Script

**Para AlimentosBebidas.gs:**
```bash
cat AlimentosBebidas.gs
```
Copia TODO el output y pégalo en Google Apps Script

---

## ✅ **CÓMO VERIFICAR QUE COPIASTE CORRECTAMENTE**

### **En tech.gs de Google Apps Script:**

**Verificación 1:** Busca (Ctrl+F) la línea **1149**
- Debe decir: `K-Estado, L-EnviarACohorte`
- Si dice solo `K-EnviarACohorte` → NO copiaste el archivo corregido

**Verificación 2:** Busca (Ctrl+F) la línea **3886**
- Debe decir: `seleccionadas.getRange(nuevaFila, 1, 1, 12).setValues([registro]);`
- Si dice `10` en lugar de `12` → NO copiaste el archivo corregido

**Verificación 3:** Cuenta las líneas del archivo
- Debe tener aproximadamente **5,612 líneas**
- Si tiene mucho menos → falta código

---

### **En AlimentosBebidas.gs de Google Apps Script:**

**Verificación 1:** Busca (Ctrl+F) la línea **36**
- Debe decir: `PROGRAMAS_ALIMENTOS:`
- Si dice `PROGRAMAS_TECNOLOGIA:` → NO copiaste el archivo corregido

**Verificación 2:** Busca (Ctrl+F) la línea **1149**
- Debe decir: `K-Estado, L-EnviarACohorte`
- Si dice solo `K-EnviarACohorte` → NO copiaste el archivo corregido

**Verificación 3:** Busca (Ctrl+F) la línea **1467**
- Debe decir: `noInscritx.getRange(nuevaFila, 1, 1, 11).setValues([registro]);`
- Si dice `12` en lugar de `11` → NO copiaste el archivo corregido

**Verificación 4:** Cuenta las líneas del archivo
- Debe tener aproximadamente **5,664 líneas**
- Si tiene mucho menos → falta código

---

## 🚨 **ERRORES COMUNES**

### **Error 1: "No veo los cambios"**
**Causa:** No copiaste el archivo corregido, sigues viendo el viejo
**Solución:** Asegúrate de copiar desde `/home/user/proyecto-inclusion-laboral-/`

### **Error 2: "El código se ve igual"**
**Causa:** Copiaste el archivo equivocado o de una ubicación antigua
**Solución:** Verifica que estás copiando desde la ruta correcta

### **Error 3: "Faltan líneas"**
**Causa:** No copiaste TODO el archivo
**Solución:** Usa `cat` completo y copia desde la primera hasta la última línea

### **Error 4: "Aparecen caracteres raros"**
**Causa:** Problema de codificación al copiar
**Solución:** Descarga el archivo directamente en lugar de copiar desde terminal

---

## 📊 **CHECKLIST ANTES DE CONTINUAR**

Marca cada paso que completaste:

### **Para tech.gs:**
- [ ] Ejecuté `cat tech.gs` y vi el código completo
- [ ] Copié TODO el código (desde línea 1 hasta el final)
- [ ] Abrí Google Apps Script de la hoja de Tecnología
- [ ] Borré TODO el contenido actual
- [ ] Pegué el código nuevo
- [ ] Guardé el archivo (Ctrl+S)
- [ ] Verifiqué línea 1149: dice `K-Estado, L-EnviarACohorte` ✅
- [ ] Verifiqué línea 3886: dice `1, 1, 12` ✅

### **Para AlimentosBebidas.gs:**
- [ ] Ejecuté `cat AlimentosBebidas.gs` y vi el código completo
- [ ] Copié TODO el código (desde línea 1 hasta el final)
- [ ] Abrí Google Apps Script de la hoja de Alimentos y Bebidas
- [ ] Borré TODO el contenido actual
- [ ] Pegué el código nuevo
- [ ] Guardé el archivo (Ctrl+S)
- [ ] Verifiqué línea 36: dice `PROGRAMAS_ALIMENTOS` ✅
- [ ] Verifiqué línea 1149: dice `K-Estado, L-EnviarACohorte` ✅
- [ ] Verifiqué línea 1467: dice `1, 1, 11` ✅

---

## 🔄 **DESPUÉS DE COPIAR EL CÓDIGO**

Una vez que copiaste AMBOS archivos:

1. **Cierra Google Apps Script**
2. **Vuelve a Google Sheets**
3. **Refresca la página** (F5)
4. **Espera 10 segundos**
5. **Ve al menú** (💻 Tecnología o 🍔 Alimentos y Bebidas)
6. **Instala los triggers:**
   - `⚙️ Configuración → ⏰ Instalar Triggers`
7. **Verifica instalación:**
   - `🛠️ Herramientas → ✅ Verificar Instalación`

---

## 📞 **SI NECESITAS AYUDA**

Dime en qué paso estás:

1. ❓ "No puedo ver el código" → Te ayudo a ejecutar `cat`
2. ❓ "No sé dónde pegar el código" → Te explico cómo abrir Apps Script
3. ❓ "No sé si copié bien" → Te ayudo a verificar
4. ❓ "Ya copié pero sigue igual" → Revisamos juntos

---

**IMPORTANTE:** Los cambios solo se verán DESPUÉS de copiar y pegar el código en Google Apps Script. Los archivos corregidos están en tu repositorio, no en Google automáticamente.
