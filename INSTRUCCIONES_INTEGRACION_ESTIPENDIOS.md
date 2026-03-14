# 🔧 INSTRUCCIONES DE INTEGRACIÓN - MÓDULO DE ESTIPENDIOS

## ✅ ¿Qué tienes ahora?

Has recibido el **Módulo Completo de Gestión de Estipendios** (`ModuloEstipendios.gs`) que implementa TODO el plan de estipendios.

Este módulo se integra perfectamente con tus sistemas existentes:
- ✅ AlimentosBebidas.gs
- ✅ tech.gs

---

## 🎯 PASO 1: ABRIR TU GOOGLE SHEETS

1. Ve a tu Google Sheets de **🍽️ Alimentos y Bebidas**
2. Abre **Extensiones → Apps Script**
3. Verás el archivo `AlimentosBebidas.gs`

---

## 📝 PASO 2: COPIAR EL MÓDULO

1. Abre el archivo `ModuloEstipendios.gs` (el que te acabo de crear)
2. **Copia TODO el contenido** (Ctrl+A, Ctrl+C)
3. En Apps Script de tu Google Sheet:
   - Ve al FINAL del archivo `AlimentosBebidas.gs`
   - Busca el ÚLTIMO `}` del archivo
   - **PEGA** todo el contenido del módulo **ANTES** de ese último `}`
4. **Guarda** (Ctrl+S)

---

## ⚙️ PASO 3: ACTUALIZAR CONFIGURACIÓN

Busca la sección `const CONFIG_AB = {` en tu código y **agrega estas 3 líneas**:

```javascript
const CONFIG_AB = {
  // ... configuración existente ...

  // ========== AGREGAR ESTAS 3 LÍNEAS ==========
  // URL de KoboToolbox para importar Estipendios
  KOBO_ESTIPENDIOS_URL: 'https://kf.kobotoolbox.org/api/v2/assets/aNpJWVRoxxQ5a8pwBQVJac/export-settings/esqLSo9A8oFvxVwZKUXwADx/data.csv',

  // Token de Kobo
  KOBO_TOKEN: '64cc018b88067397addd36b09288be8b6539cf39',

  // Email para alertas de estipendios
  EMAIL_ALERTAS_ESTIPENDIOS: 'adrian@example.com',  // ⚠️ CAMBIAR POR TU EMAIL REAL
  // ========== FIN DE LÍNEAS A AGREGAR ==========

  // ... resto de configuración ...
};
```

**Guarda** (Ctrl+S)

---

## 🍔 PASO 4: AGREGAR MENÚ DE ESTIPENDIOS

Busca la función `setupMenuAB()` (alrededor de la línea 176).

Busca donde dice `.addToUi();` (al final del menú, línea 260 aproximadamente)

**ANTES** de esa línea, agrega esto:

```javascript
function setupMenuAB() {
  try {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('🍔 Alimentos y Bebidas')
      // ... todo el menú existente ...

      // ========== AGREGAR ESTAS LÍNEAS AQUÍ ==========
      .addSeparator()
      .addSubMenu(ui.createMenu('💰 Estipendios')
        .addItem('🚀 Instalar Sistema de Estipendios', 'instalarSistemaEstipendios')
        .addSeparator()
        .addItem('📥 Importar Desde Kobo', 'importarEstipendiosDesdeKobo')
        .addItem('🔄 Actualizar Dashboard', 'actualizarDashboardEstipendios')
        .addSeparator()
        .addItem('📊 Exportar para Power BI', 'exportarParaPowerBI')
        .addSeparator()
        .addItem('⚙️ Configurar Actualización Automática', 'configurarTriggersEstipendios')
        .addItem('🛑 Desactivar Actualización Automática', 'desinstalarTriggersEstipendios')
        .addSeparator()
        .addItem('🔍 Verificar Presupuestos Ahora', 'verificarPresupuestoEstipendios'))
      // ========== FIN DE LÍNEAS A AGREGAR ==========

      .addToUi();  // ← Esta línea ya estaba, solo agregar arriba
  } catch (e) {
    // ...
  }
}
```

**Guarda** (Ctrl+S)

---

## 🎓 PASO 5: REPETIR PARA TECNOLOGÍA

Ahora haz LO MISMO para el archivo **tech.gs**:

1. Abre tu Google Sheet de **🎓 Tecnología**
2. Ve a **Extensiones → Apps Script**
3. **Copia y pega** todo el `ModuloEstipendios.gs` al final
4. **Actualiza** el `const CONFIG_TECH = {` con las mismas 3 líneas
5. **Agrega** el submenú en `setupMenuTech()`
6. **Guarda**

---

## ✅ PASO 6: PROBAR LA INSTALACIÓN

1. **Refresca** tu Google Sheet (F5)
2. Deberías ver un **nuevo submenú**: **💰 Estipendios**
3. Haz clic en: **💰 Estipendios → 🚀 Instalar Sistema de Estipendios**
4. **Autoriza** los permisos si te los pide
5. Espera a que termine (creará 5 hojas nuevas)
6. Verás un mensaje: **✅ Instalación Completa**

---

## 🎯 PASO 7: CONFIGURAR PRESUPUESTOS

1. Ve a la hoja **"Presupuesto Cohortes"**
2. Llena los datos de cada cohorte que tiene estipendios:

| Columna | Ejemplo | Descripción |
|---------|---------|-------------|
| ID Cohorte | Cocina-2024 | Identificador único |
| Nombre Cohorte | Cocina Cohorte I | Nombre descriptivo |
| Año | 2024 | Año del programa |
| Programa | Alimentos y Bebidas | Tecnología o A&B |
| Fecha Inicio | 01/02/2024 | Fecha de inicio |
| Fecha Fin | 30/06/2024 | Fecha de finalización |
| # Participantes Proyectado | 40 | Cantidad esperada |
| # Participantes Real | 35 | Cantidad real |
| Presupuesto Curso (Q) | 20,000 | Presupuesto para fase teórica |
| Presupuesto Prácticas (Q) | 35,000 | Presupuesto para prácticas |
| Donador/Financiador | Fundación XYZ | Quién financia |
| Responsable | Eva | Coordinador |
| Estado | Activa | Activa/Finalizada/En Espera |

**Las columnas K, L, M, N se calculan automáticamente**

---

## 📥 PASO 8: IMPORTAR DATOS DESDE KOBO

1. Ve a: **💰 Estipendios → 📥 Importar Desde Kobo**
2. Espera mientras se importan los datos
3. Verás un mensaje: **✅ Importación completa: X nuevos registros**
4. Ve a la hoja **"Estipendios"** para ver los datos

---

## 🔄 PASO 9: ACTIVAR ACTUALIZACIÓN AUTOMÁTICA

1. Ve a: **💰 Estipendios → ⚙️ Configurar Actualización Automática**
2. Autoriza si te lo pide
3. Verás un mensaje confirmando:
   - ✅ Importación desde Kobo: **Cada hora**
   - ✅ Verificación de presupuesto: **Cada 6 horas**
   - ✅ Exportación Power BI: **Diario a las 6:00 AM**

---

## 📊 PASO 10: VER EL DASHBOARD

1. Ve a la hoja **"Dashboard Estipendios"**
2. Ejecuta: **💰 Estipendios → 🔄 Actualizar Dashboard**
3. Verás todos los KPIs calculados automáticamente:
   - Total Presupuestado
   - Total Gastado
   - % Ejecución
   - # Beneficiadas
   - Resumen por cohorte
   - Y más...

---

## 🎨 ESTRUCTURA DE HOJAS CREADAS

El sistema crea **5 hojas nuevas**:

### 1️⃣ Presupuesto Cohortes
- Configuración de presupuestos
- Se llena manualmente
- Calcula automáticamente: Total, Gastado, Disponible, % Ejecución

### 2️⃣ Estipendios
- Todos los pagos realizados
- Se llena automáticamente desde Kobo
- Contiene: ID, Fechas, Participante, Cohorte, Monto, Estado, etc.

### 3️⃣ Calendario Pagos
- Vista de calendario mensual
- Pagos programados vs realizados
- Se actualiza automáticamente

### 4️⃣ Dashboard Estipendios
- KPIs globales (12 indicadores)
- Resumen por cohorte
- Gráficos y métricas
- Se actualiza con un clic

### 5️⃣ Auditoría Estipendios
- Registro de todas las acciones
- Quién hizo qué y cuándo
- Se llena automáticamente

---

## 📊 EXPORTAR PARA POWER BI

Cuando quieras crear dashboards en Power BI:

1. Ejecuta: **💰 Estipendios → 📊 Exportar para Power BI**
2. Se creará una hoja **"EXPORT_PowerBI"** con datos consolidados
3. **Descarga** como Excel: `Archivo → Descargar → Microsoft Excel`
4. **Abre** en Power BI Desktop
5. **Conecta** los datos
6. ¡Crea tus dashboards según `DASHBOARD_MOCKUPS.md`!

---

## 🔔 ALERTAS POR EMAIL

El sistema te enviará emails automáticamente cuando:

- 🔴 Una cohorte tenga **>95% del presupuesto** gastado (CRÍTICO)
- 🟡 Una cohorte tenga **>80% del presupuesto** gastado (ADVERTENCIA)
- ⚠️ Haya **pagos atrasados** (más de X días)

Los emails se envían al correo configurado en `EMAIL_ALERTAS_ESTIPENDIOS`

---

## 🛠️ SOLUCIÓN DE PROBLEMAS

### ❌ "La hoja Estipendios no existe"
**Solución**: Ejecuta primero `Estipendios → Instalar Sistema de Estipendios`

### ❌ "No se obtuvieron datos de Kobo"
**Solución**:
1. Verifica que la URL en `KOBO_ESTIPENDIOS_URL` sea correcta
2. Verifica que el token en `KOBO_TOKEN` sea válido
3. Ejecuta: `Herramientas → Probar Conexión Kobo`

### ❌ "Las fórmulas no calculan"
**Solución**:
1. Verifica que las hojas tengan los nombres exactos:
   - "Presupuesto Cohortes"
   - "Estipendios"
2. Ejecuta: `Estipendios → Actualizar Dashboard`

### ❌ "No recibo alertas por email"
**Solución**:
1. Verifica que `EMAIL_ALERTAS_ESTIPENDIOS` tenga tu email correcto
2. Revisa tu carpeta de SPAM
3. Ejecuta manualmente: `Estipendios → Verificar Presupuestos Ahora`

---

## 📋 CHECKLIST DE INTEGRACIÓN

Verifica que hayas completado todos los pasos:

- [ ] ✅ Módulo copiado en AlimentosBebidas.gs
- [ ] ✅ Módulo copiado en tech.gs
- [ ] ✅ CONFIG actualizado con URL de Kobo
- [ ] ✅ CONFIG actualizado con Token
- [ ] ✅ CONFIG actualizado con Email
- [ ] ✅ Menú agregado en setupMenuAB()
- [ ] ✅ Menú agregado en setupMenuTech()
- [ ] ✅ Código guardado
- [ ] ✅ Sistema instalado (5 hojas creadas)
- [ ] ✅ Presupuestos configurados
- [ ] ✅ Primera importación exitosa
- [ ] ✅ Dashboard visible con datos
- [ ] ✅ Triggers automáticos activados
- [ ] ✅ Alertas por email funcionando

---

## 🎉 ¡LISTO!

Si completaste todos los pasos, tu **Sistema de Estipendios** está funcionando al 100%:

- ✅ Importación automática cada hora
- ✅ Cálculo automático de KPIs
- ✅ Alertas por email
- ✅ Dashboards actualizados
- ✅ Listo para Power BI

---

## 📞 PRÓXIMOS PASOS

1. **Personaliza el dashboard** según tus necesidades
2. **Configura más cohortes** en "Presupuesto Cohortes"
3. **Exporta a Power BI** y crea visualizaciones profesionales
4. **Comparte con donadores** para transparencia total

---

## 📚 DOCUMENTACIÓN RELACIONADA

- `PLAN_SISTEMA_ESTIPENDIOS.md` - Plan completo (el que te pasaste)
- `DASHBOARD_MOCKUPS.md` - Diseños de dashboards para Power BI
- `ESTRUCTURA_DATOS.md` - Detalles de las estructuras de datos
- `PRESENTACION_JEFE.md` - Speech para presentar el sistema

---

**¿Necesitas ayuda?** Revisa los logs en Apps Script (Ver → Registros) o ejecuta las funciones de diagnóstico en el menú Herramientas.

*Última actualización: Marzo 2026*
