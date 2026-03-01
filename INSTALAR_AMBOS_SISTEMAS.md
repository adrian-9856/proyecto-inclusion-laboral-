# 🔧 INSTALAR TRIGGERS PARA AMBOS SISTEMAS

## 📋 RESUMEN

Tienes **DOS archivos separados**:
- **tech.gs** → Para el programa de Tecnología
- **AlimentosBebidas.gs** → Para el programa de Alimentos y Bebidas

**Cada uno tiene su propia hoja de Google Sheets** y necesita instalar sus triggers por separado.

---

## 🎯 ¿QUÉ HOJA ESTÁS USANDO?

### **Opción A: Tienes UNA sola hoja con AMBOS sistemas**

Si tienes una sola hoja de Google Sheets que usa AMBOS archivos (tech.gs Y AlimentosBebidas.gs):

⚠️ **PROBLEMA:** Esto causará conflictos porque ambos archivos intentan crear menús y triggers con los mismos nombres.

✅ **SOLUCIÓN:** Usa SOLO UN archivo a la vez. Comenta o elimina el que no uses.

---

### **Opción B: Tienes DOS hojas separadas**

Si tienes:
- **Hoja 1:** Para Tecnología (usa tech.gs)
- **Hoja 2:** Para Alimentos y Bebidas (usa AlimentosBebidas.gs)

✅ **SOLUCIÓN:** Instala triggers en cada hoja por separado (ver abajo).

---

## 🚀 INSTALACIÓN PARA TECNOLOGÍA (tech.gs)

### **1. Abre la hoja de Google Sheets de Tecnología**

### **2. Busca el menú:** `💻 Tecnología`
   - Si no lo ves, refresca (F5)

### **3. Ejecuta:**
```
💻 Tecnología → ⚙️ Configuración → ⏰ Instalar Triggers
```

### **4. Autoriza los permisos** (si te los pide)

### **5. Verifica:**
```
💻 Tecnología → 🛠️ Herramientas → ✅ Verificar Instalación
```

**Debes ver:**
```
✅ Trigger al editar
✅ Trigger de tiempo
🎉 TODO LISTO Y FUNCIONANDO
```

---

## 🍔 INSTALACIÓN PARA ALIMENTOS Y BEBIDAS (AlimentosBebidas.gs)

### **1. Abre la hoja de Google Sheets de Alimentos y Bebidas**

### **2. Busca el menú:** `🍔 Alimentos y Bebidas`
   - Si no lo ves, refresca (F5)

### **3. Ejecuta:**
```
🍔 Alimentos y Bebidas → ⚙️ Configuración → ⏰ Instalar Triggers
```

### **4. Autoriza los permisos** (si te los pide)

### **5. Verifica:**
```
🍔 Alimentos y Bebidas → 🛠️ Herramientas → ✅ Verificar Instalación
```

**Debes ver:**
```
✅ Trigger al editar
✅ Trigger de tiempo
🎉 TODO LISTO Y FUNCIONANDO
```

---

## 🔍 CÓMO IDENTIFICAR QUÉ ARCHIVO USA TU HOJA

### **Método 1: Por el menú**

- Si ves menú `💻 Tecnología` → Usa **tech.gs**
- Si ves menú `🍔 Alimentos y Bebidas` → Usa **AlimentosBebidas.gs**

### **Método 2: Desde Apps Script**

1. Abre: **Extensiones → Apps Script**
2. En la lista de archivos de la izquierda:
   - ¿Ves `tech.gs`? → Hoja de Tecnología
   - ¿Ves `AlimentosBebidas.gs`? → Hoja de Alimentos
   - ¿Ves AMBOS? → Ver "Opción A" arriba

---

## ⚠️ SI TIENES AMBOS ARCHIVOS EN LA MISMA HOJA

### **Problema:**
- Ambos archivos crean funciones con los mismos nombres
- Causará errores y conflictos
- Solo uno funcionará

### **Solución 1: Usar solo el que necesites**

1. **Abre Apps Script** (Extensiones → Apps Script)
2. **Elimina el archivo que NO uses:**
   - Haz clic derecho en el archivo
   - "Eliminar"
3. **Guarda**
4. **Refresca Google Sheets** (F5)
5. **Instala triggers** del archivo que quedó

### **Solución 2: Renombrar funciones (avanzado)**

Si necesitas AMBOS en la misma hoja, tendrías que:
1. Renombrar todas las funciones de uno de los archivos
2. Cambiar los nombres de los menús
3. Cambiar los nombres de los triggers
4. Esto es complicado - **mejor usa hojas separadas**

---

## 📊 TABLA COMPARATIVA

| Característica | tech.gs | AlimentosBebidas.gs |
|----------------|---------|---------------------|
| Menú | 💻 Tecnología | 🍔 Alimentos y Bebidas |
| Programas | Marketing Digital, Programación, etc. | Gastronomía, Barismo, etc. |
| Triggers | alEditar, actualizarReportes | alEditar, actualizarReportes |
| Función instalar | instalarTriggers() | instalarTriggers() |

⚠️ **Nota:** Tienen funciones con los mismos nombres = NO pueden estar en la misma hoja sin modificaciones.

---

## ✅ CHECKLIST DE INSTALACIÓN

### Para Tecnología (tech.gs):
- [ ] Abrí la hoja de Google Sheets de Tecnología
- [ ] Veo el menú `💻 Tecnología`
- [ ] Ejecuté: `💻 Tecnología → ⚙️ Configuración → ⏰ Instalar Triggers`
- [ ] Autoricé todos los permisos
- [ ] Verifiqué instalación → Dice "TODO LISTO"
- [ ] Probé fecha automática al agendar entrevista
- [ ] Probé estado "Inscritx" al aprobar entrevista

### Para Alimentos y Bebidas (AlimentosBebidas.gs):
- [ ] Abrí la hoja de Google Sheets de Alimentos y Bebidas
- [ ] Veo el menú `🍔 Alimentos y Bebidas`
- [ ] Ejecuté: `🍔 Alimentos y Bebidas → ⚙️ Configuración → ⏰ Instalar Triggers`
- [ ] Autoricé todos los permisos
- [ ] Verifiqué instalación → Dice "TODO LISTO"
- [ ] Probé fecha automática al agendar entrevista
- [ ] Probé estado "Inscritx" al aprobar entrevista

---

## 🆘 PREGUNTAS FRECUENTES

### **P: ¿Puedo usar ambos archivos en la misma hoja?**
**R:** NO, causará conflictos. Usa hojas separadas o elimina el que no uses.

### **P: ¿Los cambios son iguales en ambos archivos?**
**R:** SÍ, ambos tienen las mismas correcciones:
- ✅ Fecha automática
- ✅ Estado "Inscritx" automático
- ✅ Desplegable cohortes en columna L
- ✅ Entrevistador vacío
- ✅ Nivel educativo correcto

### **P: ¿Qué archivo debo usar?**
**R:**
- **tech.gs** → Para programas de Tecnología (Marketing Digital, Programación, etc.)
- **AlimentosBebidas.gs** → Para programas de Gastronomía (Barismo, Gastronomía, etc.)

### **P: Tengo dos hojas, ¿debo copiar ambos archivos?**
**R:**
- **Hoja 1** (Tecnología): Copia solo **tech.gs**
- **Hoja 2** (Alimentos): Copia solo **AlimentosBebidas.gs**

---

## 🎯 RESUMEN RÁPIDO

```
┌─────────────────────────────────────────────┐
│ TECNOLOGÍA                                   │
├─────────────────────────────────────────────┤
│ 1. Abre hoja de Tecnología                  │
│ 2. 💻 Tecnología → ⚙️ → ⏰ Instalar Triggers│
│ 3. Verifica que funciona                    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ ALIMENTOS Y BEBIDAS                          │
├─────────────────────────────────────────────┤
│ 1. Abre hoja de Alimentos y Bebidas         │
│ 2. 🍔 Alimentos → ⚙️ → ⏰ Instalar Triggers │
│ 3. Verifica que funciona                    │
└─────────────────────────────────────────────┘
```

---

**Última actualización:** 2026-03-01
