# 🍔 SOLUCIÓN: ALIMENTOS Y BEBIDAS NO FUNCIONA

## 🔴 EL PROBLEMA

Has copiado el código de **AlimentosBebidas.gs** correctamente, PERO los cambios automáticos **NO se ejecutan** porque **faltan los TRIGGERS** (disparadores).

**Sin triggers = El código NO funciona** ❌

---

## ✅ SOLUCIÓN RÁPIDA (2 MINUTOS)

### **Paso 1: Abre tu hoja de Google Sheets de Alimentos y Bebidas**

### **Paso 2: Busca el menú 🍔 Alimentos y Bebidas**
   - Si NO lo ves, presiona **F5** para refrescar la página
   - Espera 10-20 segundos

### **Paso 3: Instala los Triggers**
```
🍔 Alimentos y Bebidas → ⚙️ Configuración → ⏰ Instalar Triggers
```

### **Paso 4: Autoriza los permisos**
   - Google te pedirá autorización
   - ✅ Acepta TODOS los permisos
   - ✅ Continúa en todas las pantallas

### **Paso 5: Espera el mensaje**
```
✅ Triggers instalados
```

### **Paso 6: ¡LISTO! Ahora prueba**

---

## 🔍 CÓMO VERIFICAR QUE FUNCIONÓ

### **Verificación 1: Revisar instalación**
```
🍔 Alimentos y Bebidas → 🛠️ Herramientas → ✅ Verificar Instalación
```

**Debes ver:**
```
✅ Trigger al editar
✅ Trigger de tiempo
🎉 TODO LISTO Y FUNCIONANDO
```

### **Verificación 2: Probar fecha automática**

1. Ve a la hoja **"Hoja de Interés"**
2. En una fila con datos, columna **"Estado"**, selecciona: **"Entrevista agendada"**
3. Ve a la hoja **"Entrevistas"**
4. ✅ **La columna A debe tener la FECHA DE HOY automáticamente**

### **Verificación 3: Probar estado Inscritx**

1. En la hoja **"Entrevistas"**, columna **"Estado"**, pon: **"Aprobada"**
2. Ve a la hoja **"Inscritx"**
3. ✅ **La columna K debe decir "Inscritx" automáticamente**

---

## 🆘 SI NO FUNCIONA

### **Problema 1: No veo el menú 🍔 Alimentos y Bebidas**

**Solución:**
1. Refresca la página (F5)
2. Cierra y vuelve a abrir la hoja
3. Espera 10-20 segundos
4. Si aún no aparece, ve a **Extensiones → Apps Script**
5. Busca la función `onOpen` en el menú desplegable
6. Haz clic en **Ejecutar** (▶️)
7. Autoriza permisos
8. Vuelve a Google Sheets

---

### **Problema 2: Me pide autorización pero da error**

**Solución:**
1. Ve a **Extensiones → Apps Script**
2. En el menú superior, selecciona la función: **`instalarTriggers`**
3. Haz clic en **Ejecutar** (▶️)
4. Autoriza TODOS los permisos
5. Espera "Ejecución completada"
6. Cierra Apps Script y vuelve a Sheets

---

### **Problema 3: Los cambios siguen sin funcionar**

**Diagnóstico paso a paso:**

1. **Verifica que el código está completo:**
   - Ve a **Extensiones → Apps Script**
   - Busca el archivo: **AlimentosBebidas.gs**
   - Debe tener aproximadamente **5,664 líneas**
   - Si tiene menos, copia el código completo de nuevo

2. **Verifica los triggers manualmente:**
   - En Apps Script, haz clic en el ícono del **reloj** ⏰ (Activadores)
   - Debe haber:
     - ✅ Un trigger llamado `alEditar` (Al editar)
     - ✅ Un trigger llamado `actualizarReportes` (Basado en tiempo)
   - Si NO están, ejecuta `instalarTriggers` manualmente

3. **Revisa los logs de error:**
   - En Apps Script, haz clic en **Ejecuciones** (ícono de lista)
   - Si hay errores rojos, léelos
   - Los errores comunes son:
     - "No se encuentra la hoja": Verifica que las hojas tengan los nombres correctos
     - "No se autorizó": Autoriza permisos desde Apps Script

---

## 📊 CHECKLIST COMPLETO

Marca cada paso que completaste:

- [ ] Copié **AlimentosBebidas.gs** completo en Google Apps Script
- [ ] Guardé el archivo
- [ ] Veo el menú **🍔 Alimentos y Bebidas** en Google Sheets
- [ ] Ejecuté: **🍔 Alimentos y Bebidas → ⚙️ → ⏰ Instalar Triggers**
- [ ] Autoricé TODOS los permisos
- [ ] Vi el mensaje "✅ Triggers instalados"
- [ ] Ejecuté "Verificar Instalación" → Dice "TODO LISTO"
- [ ] Probé crear entrevista → Fecha automática ✅
- [ ] Probé aprobar entrevista → Estado "Inscritx" automático ✅

---

## 🎯 RESUMEN

```
┌─────────────────────────────────────────────────┐
│ LO QUE YA HICISTE:                              │
│ ✅ Copiar el código AlimentosBebidas.gs        │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ LO QUE TE FALTA (2 MINUTOS):                    │
│ ⚠️  Instalar triggers                           │
│                                                  │
│ CÓMO:                                            │
│ 🍔 Alimentos y Bebidas                          │
│   → ⚙️ Configuración                            │
│   → ⏰ Instalar Triggers                        │
└─────────────────────────────────────────────────┘
```

---

## ❓ PREGUNTAS FRECUENTES

### **P: ¿Es normal que el código no funcione si no instalo triggers?**
**R:** SÍ. Los triggers son OBLIGATORIOS para que el código se ejecute automáticamente.

### **P: ¿Los triggers se instalan solos?**
**R:** NO. Debes instalarlos manualmente desde el menú o desde Apps Script.

### **P: ¿Tengo que instalar triggers cada vez que abro la hoja?**
**R:** NO. Los triggers se instalan UNA SOLA VEZ y quedan permanentes.

### **P: ¿Qué pasa si tengo tech.gs y AlimentosBebidas.gs en la misma hoja?**
**R:** ⚠️ Causará CONFLICTOS. Usa hojas separadas o elimina el que no uses.

---

## 📞 AYUDA ADICIONAL

Si después de seguir todos estos pasos aún no funciona:

1. **Revisa el archivo:** `SOLUCION_NO_FUNCIONA.md`
2. **Lee la guía completa:** `INSTALAR_AMBOS_SISTEMAS.md`
3. **Verifica que usas la hoja correcta:** Una hoja para Tecnología, otra para Alimentos

---

**Última actualización:** 2026-03-01
**Tiempo de solución:** 2 minutos
**Problema más común:** 95% de las veces es falta de triggers
