# 🚀 GUÍA RÁPIDA - SISTEMA DE ESTIPENDIOS

## ✅ ¿QUÉ SE HIZO?

El código del sistema de estipendios ya está **INTEGRADO** en:
- ✅ `AlimentosBebidas.gs`
- ✅ `tech.gs`

**NO necesitas copiar ni pegar nada más.** Todo ya está listo.

---

## 📋 PASOS PARA ACTIVARLO

### **PASO 1: Subir el código** (5 minutos)

1. Abre tu **Google Sheet de Alimentos y Bebidas**
2. Ve a **Extensiones → Apps Script**
3. Verás el archivo `AlimentosBebidas.gs` en el editor
4. **Selecciona TODO** el contenido actual (Ctrl+A)
5. **Bórralo**
6. Abre el nuevo archivo `AlimentosBebidas.gs` que descargaste del repositorio
7. **Copia TODO** el contenido (Ctrl+A, Ctrl+C)
8. **Pégalo** en Apps Script (Ctrl+V)
9. **Guarda** (Ctrl+S)
10. **Repite** para el sheet de Tecnología con `tech.gs`

### **PASO 2: Refrescar las hojas** (10 segundos)

1. Vuelve a tu Google Sheet
2. **Refresca** la página (F5)
3. Espera 5 segundos
4. Deberías ver un nuevo menú: **💰 Estipendios**

### **PASO 3: Instalar el sistema** (30 segundos)

1. Haz clic en: **💰 Estipendios → 🚀 Instalar Sistema**
2. **Autoriza** los permisos si te los pide
3. Haz clic en **"Sí"** cuando te pregunte si deseas continuar
4. Espera a que termine (verás un mensaje de éxito)

**¿Qué pasó?**
- ✅ Se agregaron columnas de presupuesto a tu hoja "Cohortes" (sin borrar nada)
- ✅ Se creó la hoja "Estipendios"
- ✅ Se creó la hoja "Dashboard Estipendios"

### **PASO 4: Configurar presupuestos** (5 minutos)

1. Ve a la hoja **"Cohortes"**
2. Verás nuevas columnas al final:
   - Presupuesto Curso (Q)
   - Presupuesto Prácticas (Q)
   - Presupuesto Total (Q) ← se calcula solo
   - Gastado a la Fecha (Q) ← se calcula solo
   - Disponible (Q) ← se calcula solo
   - % Ejecución ← se calcula solo
   - Donador/Financiador

3. **Llena** para cada cohorte que tiene estipendios:
   - Presupuesto Curso (Q): Ejemplo: 20000
   - Presupuesto Prácticas (Q): Ejemplo: 35000
   - Donador/Financiador: Ejemplo: Fundación XYZ

**El resto se calcula automáticamente.**

### **PASO 5: Importar datos desde Kobo** (1 minuto)

1. Haz clic en: **💰 Estipendios → 📥 Importar Desde Kobo**
2. Espera mientras se importan los datos
3. Verás un mensaje: **"✅ X nuevos registros importados"**
4. Ve a la hoja **"Estipendios"** para ver los pagos

### **PASO 6: Ver el dashboard** (30 segundos)

1. Ve a la hoja **"Dashboard Estipendios"**
2. Haz clic en: **💰 Estipendios → 🔄 Actualizar Dashboard**
3. Verás todos los KPIs calculados:
   - Total Presupuestado
   - Total Gastado
   - % Ejecución
   - # Beneficiadas
   - Resumen por cohorte
   - Próximos pagos
   - Auditoría

### **PASO 7: Activar actualización automática** (30 segundos)

1. Haz clic en: **💰 Estipendios → ⚙️ Activar Actualización Automática**
2. Autoriza si te lo pide
3. Verás un mensaje confirmando que se activó:
   - ✅ Importación desde Kobo: **Cada hora**
   - ✅ Verificación de presupuesto: **Cada 6 horas**
   - ✅ Exportación Power BI: **Diario a las 6:00 AM**

---

## 🎯 ¡LISTO! EL SISTEMA YA FUNCIONA

Ahora automáticamente:
- 📥 Importa pagos desde Kobo **cada hora**
- 📊 Calcula KPIs en tiempo real
- 📧 Te envía alertas por email si:
  - Una cohorte gasta >80% del presupuesto
  - Hay pagos atrasados

---

## 📊 ¿CÓMO USAR EL DASHBOARD?

### **Ver KPIs Globales:**
1. Ve a la hoja **"Dashboard Estipendios"**
2. Sección **"KPIs GLOBALES"** (filas 3-14)
3. Todos los números se actualizan automáticamente

### **Ver Próximos Pagos:**
1. Mismo dashboard
2. Sección **"PRÓXIMOS PAGOS (7 DÍAS)"** (columna E)
3. Ejecuta **💰 Estipendios → 🔄 Actualizar Dashboard** para refrescar

### **Ver Resumen por Cohorte:**
1. Mismo dashboard
2. Sección **"RESUMEN POR COHORTE"** (fila 16+)
3. Colores:
   - 🟢 Verde = OK (< 80% gastado)
   - 🟡 Amarillo = Advertencia (80-95%)
   - 🔴 Rojo = Crítico (> 95%)

### **Ver Auditoría:**
1. Mismo dashboard
2. Sección **"AUDITORÍA"** (fila 25+)
3. Ver últimas 20 acciones

---

## 📊 EXPORTAR PARA POWER BI

Cuando quieras crear dashboards profesionales:

1. **Exportar datos:**
   - Haz clic en: **💰 Estipendios → 📊 Exportar para Power BI**
   - Se creará una hoja **"EXPORT_PowerBI"**

2. **Descargar:**
   - En tu Google Sheet: **Archivo → Descargar → Microsoft Excel (.xlsx)**

3. **Abrir en Power BI:**
   - Abre **Power BI Desktop**
   - **Obtener datos → Excel**
   - Selecciona el archivo descargado
   - Importa la hoja **"EXPORT_PowerBI"**

4. **Crear dashboards:**
   - Usa los mockups en `DASHBOARD_MOCKUPS.md` como referencia
   - Crea visualizaciones según necesites

---

## 🔔 ALERTAS POR EMAIL

El sistema te enviará emails automáticamente cuando:

**🔴 CRÍTICO:**
- Una cohorte tiene >95% del presupuesto gastado
- Hay pagos con >10 días de atraso

**🟡 ADVERTENCIA:**
- Una cohorte tiene >80% del presupuesto gastado
- Hay pagos atrasados

**Configurar email:**
1. Abre el archivo `AlimentosBebidas.gs` o `tech.gs` en Apps Script
2. Busca la línea (alrededor línea 167):
   ```javascript
   EMAIL_ALERTAS_ESTIPENDIOS: 'adrian@example.com'
   ```
3. **Cámbiala** por tu email real:
   ```javascript
   EMAIL_ALERTAS_ESTIPENDIOS: 'tuemail@gmail.com'
   ```
4. **Guarda** (Ctrl+S)

---

## 🛠️ FUNCIONES DEL MENÚ

### **💰 Estipendios →**

| Opción | ¿Cuándo usarla? |
|--------|-----------------|
| 🚀 Instalar Sistema | Solo una vez al inicio |
| 📥 Importar Desde Kobo | Cuando quieras importar manualmente (automático cada hora) |
| 🔄 Actualizar Dashboard | Cuando quieras ver datos actualizados en el dashboard |
| 📊 Exportar para Power BI | Cuando necesites el archivo para Power BI |
| ⚙️ Activar Actualización Automática | Solo una vez para activar triggers |
| 🛑 Desactivar Actualización Automática | Si quieres pausar las importaciones automáticas |
| 🔍 Verificar Presupuestos Ahora | Para forzar verificación y envío de alertas |

---

## 📋 ESTRUCTURA DE HOJAS

Después de instalar tendrás:

### **Hojas Existentes (sin cambios):**
- Hoja de Interés
- Entrevistas
- Inscritx
- Graduadx
- Retiradx
- No Inscritx
- Reporte
- Reportes Mensuales

### **Hojas Modificadas:**
- **Cohortes** ← Ahora tiene columnas de presupuesto al final

### **Hojas Nuevas:**
1. **Estipendios** ← Todos los pagos registrados
2. **Dashboard Estipendios** ← KPIs, calendario, resumen, auditoría

### **Hojas Temporales (se crean cuando exportas):**
- **EXPORT_PowerBI** ← Solo cuando ejecutas "Exportar para Power BI"

---

## ❓ PREGUNTAS FRECUENTES

### **¿Se perderán mis datos al instalar?**
**NO.** El sistema solo:
- Agrega columnas a "Cohortes" (al final, no toca lo existente)
- Crea 2 hojas nuevas
- No borra ni modifica datos existentes

### **¿Tengo que importar manualmente cada hora?**
**NO.** Una vez que actives la actualización automática, se importa solo cada hora.

### **¿Puedo desactivar las importaciones automáticas?**
**SÍ.** Ejecuta: **💰 Estipendios → 🛑 Desactivar Actualización Automática**

### **¿Cómo sé si hay problemas de presupuesto?**
Recibirás un **email automático** cuando:
- Una cohorte gaste >80% del presupuesto
- Haya pagos atrasados

### **¿Puedo ver los datos en tiempo real?**
**SÍ.** El dashboard se actualiza automáticamente. Si quieres forzar actualización: **💰 Estipendios → 🔄 Actualizar Dashboard**

### **¿Los datos se exportan automáticamente a Power BI?**
La **hoja se crea automáticamente** cada día a las 6 AM. Pero debes **descargar el Excel manualmente** y abrirlo en Power BI. (O configurar Power BI para conectarse directamente a Google Sheets)

---

## 🎉 ¡TODO LISTO!

Ahora tienes un **sistema completo de estipendios** que:

✅ Importa datos automáticamente
✅ Calcula KPIs en tiempo real
✅ Envía alertas proactivas
✅ Genera dashboards profesionales
✅ Mantiene auditoría completa
✅ Exporta fácilmente a Power BI

---

## 📞 ¿NECESITAS AYUDA?

Si algo no funciona:

1. **Revisa los logs** en Apps Script:
   - Ve a Apps Script
   - Haz clic en **Ver → Registros** (o Ctrl+Enter)
   - Busca mensajes de error (en rojo)

2. **Verifica la configuración:**
   - ¿La URL de Kobo es correcta?
   - ¿El token es válido?
   - ¿El email está configurado?

3. **Prueba la conexión:**
   - **Herramientas → Probar Conexión Kobo**

---

**¡Disfruta tu nuevo sistema de estipendios!** 🎊

*Última actualización: Marzo 2026*
