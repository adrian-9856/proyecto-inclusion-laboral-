# 📋 INSTRUCCIONES DE INSTALACIÓN
## Sistema de Estipendios con Kobo → Google Sheets → Power BI

---

## 🎯 PASO 1: CREAR GOOGLE SHEETS

### Opción A: Crear 2 nuevos Google Sheets

1. Ve a: https://sheets.google.com
2. Crea un nuevo spreadsheet llamado: **🍽️ Estipendios - Alimentos y Bebidas**
3. Crea otro spreadsheet llamado: **🎓 Estipendios - Tecnología**
4. Copia los IDs de ambos (están en la URL entre `/d/` y `/edit`)

### Opción B: Usar spreadsheets existentes

Si ya tienes los sheets, solo necesitas los IDs.

**Ejemplo de ID:**
```
URL: https://docs.google.com/spreadsheets/d/1ABC_xyz_123DEF/edit
ID:  1ABC_xyz_123DEF
```

---

## 🎯 PASO 2: CONFIGURAR IDS EN EL SCRIPT (Opcional)

Si tienes sheets existentes, edita `ImportacionEstipendios.gs` líneas 18-19:

```javascript
SHEET_ALIMENTOS_ID: 'TU_ID_AQUI',  // ID del sheet de Alimentos y Bebidas
SHEET_TECH_ID: 'TU_ID_AQUI',       // ID del sheet de Tecnología
```

**Si dejas esto vacío**, el script creará automáticamente los sheets nuevos.

---

## 🎯 PASO 3: COPIAR CÓDIGO A GOOGLE APPS SCRIPT

### 3.1 Abre Apps Script en tu Google Sheet

1. Abre el Google Sheet de **Alimentos y Bebidas**
2. Ve a: **Extensiones → Apps Script**
3. Borra el código existente
4. Copia TODO el contenido de `ImportacionEstipendios.gs`
5. Pégalo en el editor
6. Haz clic en **💾 Guardar** (Ctrl+S)
7. Pon un nombre al proyecto: "Sistema Estipendios Kobo"

### 3.2 Repite para el sheet de Tecnología

1. Abre el Google Sheet de **Tecnología**
2. Repite los pasos anteriores

---

## 🎯 PASO 4: PRIMERA EJECUCIÓN (PRUEBA)

### 4.1 Autorizar el script

1. En Apps Script, selecciona la función: **`importarEstipendiosDesdeKobo`**
2. Haz clic en **▶️ Ejecutar**
3. Aparecerá un mensaje de autorización:
   - Haz clic en **"Revisar permisos"**
   - Selecciona tu cuenta de Google
   - Haz clic en **"Avanzado"**
   - Haz clic en **"Ir a Sistema Estipendios Kobo (no seguro)"**
   - Haz clic en **"Permitir"**

### 4.2 Ver los resultados

1. Ve al panel de **Ejecución** (icono de reloj ⏱️)
2. Verás los logs de la importación:
   ```
   🚀 Iniciando importación desde Kobo...
   ✅ 150 registros obtenidos desde Kobo
   📊 Alimentos y Bebidas: 65 registros
   📊 Tecnología: 85 registros
   ✅ Importación completada exitosamente
   ```

3. Refresca tu Google Sheet (F5)
4. Deberías ver las hojas creadas:
   - ✅ Datos Kobo
   - ✅ Estipendios
   - ✅ Presupuesto Cohortes
   - ✅ Dashboard Resumen
   - ✅ Calendario Pagos
   - ✅ Auditoría

---

## 🎯 PASO 5: ACTIVAR ACTUALIZACIÓN AUTOMÁTICA

### Una vez que confirmes que funciona correctamente:

1. En tu Google Sheet, aparecerá un nuevo menú: **📊 Estipendios Kobo**
2. Haz clic en: **⚙️ Instalar Actualización Automática**
3. Autoriza si te lo pide
4. ✅ ¡Listo! Ahora se actualizará automáticamente cada hora

### Para verificar que el trigger está activo:

1. En Apps Script, haz clic en el icono de **⏰ Activadores** (reloj)
2. Deberías ver una entrada:
   - Función: `importarEstipendiosDesdeKobo`
   - Tipo: Activador de tiempo
   - Frecuencia: Cada hora

---

## 🎯 PASO 6: COMPLETAR DATOS DE PRESUPUESTO

El script crea la estructura, pero necesitas llenar manualmente la hoja **"Presupuesto Cohortes"**:

### Campos a completar:

| Campo | Ejemplo |
|-------|---------|
| ID Cohorte | Cocina-2024 |
| Nombre Cohorte | Cocina Cohorte I |
| Año | 2024 |
| Programa | Alimentos y Bebidas |
| Fecha Inicio | 01/02/2024 |
| Fecha Fin | 30/06/2024 |
| # Participantes Proyectado | 40 |
| # Participantes Real | 35 |
| Presupuesto Curso (Q) | 20,000 |
| Presupuesto Prácticas (Q) | 35,000 |
| Donador/Financiador | Fundación XYZ |
| Responsable | Eva |
| Estado | Activa |

⚠️ **Importante**: El **ID Cohorte** debe coincidir con lo que se genera automáticamente en la hoja "Estipendios" (columna E).

---

## 🎯 PASO 7: VERIFICAR DASHBOARDS

### Dashboard Resumen

Debería calcular automáticamente:
- ✅ Total Presupuestado
- ✅ Total Gastado
- ✅ % Ejecución
- ✅ # Beneficiarias
- ✅ Promedio por participante
- ✅ Pagos pendientes/atrasados

### Si algo no se calcula:

1. Ve a **📊 Estipendios Kobo → 📋 Ver Configuración**
2. Verifica que el token esté configurado correctamente
3. Revisa los logs en Apps Script

---

## 🎯 PASO 8: MENÚ PERSONALIZADO

Cuando abras tu Google Sheet, verás el menú **📊 Estipendios Kobo** con:

- **🔄 Importar Ahora**: Ejecuta importación manual inmediatamente
- **⚙️ Instalar Actualización Automática**: Activa trigger cada hora
- **🛑 Desinstalar Actualización Automática**: Desactiva el trigger
- **📋 Ver Configuración**: Muestra configuración actual

---

## 📊 EXPORTAR PARA POWER BI

### Método 1: Conectar Power BI directamente a Google Sheets

1. En Power BI Desktop → **Obtener datos**
2. Busca: **Google Sheets**
3. Autoriza tu cuenta de Google
4. Selecciona el sheet: **Estipendios**
5. Importa las hojas que necesites

### Método 2: Exportar a Excel

1. En Google Sheets: **Archivo → Descargar → Microsoft Excel (.xlsx)**
2. Abre el archivo en Power BI

### Hojas recomendadas para Power BI:

- ✅ **Estipendios**: Datos completos de todos los pagos
- ✅ **Presupuesto Cohortes**: Información de presupuestos
- Opcional: **Dashboard Resumen** si quieres KPIs pre-calculados

---

## ⚠️ SOLUCIÓN DE PROBLEMAS

### Error: "No se obtuvieron datos de Kobo"

**Causa**: Token incorrecto o URL inválida

**Solución**:
1. Verifica el token en: https://kf.kobotoolbox.org/token/
2. Genera uno nuevo si es necesario
3. Actualiza `CONFIG.KOBO_TOKEN` en el script

---

### Error: "Request failed with status 403"

**Causa**: Permisos insuficientes en Kobo

**Solución**:
1. Ve a Kobo → Settings del formulario
2. Verifica que tengas permisos de **View submissions**
3. Si es un proyecto compartido, pide acceso al dueño

---

### No se crean las hojas automáticamente

**Causa**: Error en la ejecución del script

**Solución**:
1. Ve a Apps Script → Ver logs (Ctrl+Enter)
2. Busca mensajes de error en rojo
3. Verifica que autorizaste todos los permisos

---

### Las fórmulas no se calculan

**Causa**: Referencias rotas o nombres de hojas incorrectos

**Solución**:
1. Verifica que las hojas se llamen exactamente:
   - "Datos Kobo"
   - "Estipendios"
   - "Presupuesto Cohortes"
2. Si cambiaste nombres, actualiza `CONFIG` en el script

---

## 📞 SOPORTE

Si tienes problemas:

1. **Revisa los logs** en Apps Script (⏱️ Ejecuciones)
2. **Verifica la configuración**: Menu → Ver Configuración
3. **Ejecuta manualmente**: Menu → Importar Ahora
4. **Revisa los datos** en la hoja "Auditoría"

---

## ✅ CHECKLIST FINAL

Antes de considerar la instalación completa, verifica:

- [ ] Token de Kobo configurado correctamente
- [ ] Google Sheets creados (o IDs configurados)
- [ ] Código copiado a Apps Script en ambos sheets
- [ ] Primera ejecución exitosa (con autorización)
- [ ] Hojas creadas automáticamente
- [ ] Datos importados visibles en "Datos Kobo" y "Estipendios"
- [ ] Hoja "Presupuesto Cohortes" completada manualmente
- [ ] Dashboard muestra cálculos correctos
- [ ] Trigger automático instalado
- [ ] Menu personalizado visible

---

## 🎉 ¡LISTO!

Una vez completados todos los pasos, tu sistema estará funcionando:

- ✅ Importación automática cada hora desde Kobo
- ✅ Separación automática por proyecto
- ✅ Dashboards actualizados en tiempo real
- ✅ Listo para conectar con Power BI
- ✅ Auditoría completa de todas las importaciones

---

**Próximo paso**: Crear los dashboards en Power BI según `DASHBOARD_MOCKUPS.md`

---

*Última actualización: Marzo 2026*
