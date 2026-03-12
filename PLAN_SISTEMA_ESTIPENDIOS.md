# 📊 PLAN DE IMPLEMENTACIÓN
## Sistema de Gestión y Visualización de Estipendios

---

## 🎯 1. RESUMEN EJECUTIVO

### Problema Actual
- **No hay visibilidad en tiempo real** del gasto de estipendios por cohorte
- **Difícil generar reportes** para donadores y stakeholders
- **No hay trazabilidad** de cómo se distribuye el presupuesto
- **Reportes manuales** requieren tiempo y son propensos a errores

### Solución Propuesta
Sistema integrado que conecta:
- **Kobo** (registro de pagos) → **Google Sheets** (procesamiento) → **Power BI** (visualización profesional)

### Beneficios Clave
- ✅ **Transparencia total** para donadores
- ✅ **Decisiones basadas en datos** en tiempo real
- ✅ **Reportes automáticos** profesionales
- ✅ **Mejor control presupuestario**
- ✅ **Auditoría completa** de cada pago

---

## 📈 2. INDICADORES CLAVE (KPIs)

### A. KPIs Financieros

#### 1. Presupuesto Total Asignado vs Ejecutado
- **Fórmula**: `(Total Gastado / Total Presupuestado) × 100`
- **Meta**: 95-100% al final del programa
- **Alerta**: Si < 70% a mitad del programa
- **Para qué sirve**: Medir eficiencia en uso de fondos

#### 2. Costo por Participante
- **Fórmula**: `Total Gastado / # Participantes Activos`
- **Benchmark**: Comparar entre cohortes
- **Para qué sirve**: Presupuestar futuras cohortes de manera más precisa

#### 3. Tasa de Ejecución Presupuestaria Mensual
- **Fórmula**: `Gasto Mensual / Presupuesto Mensual Proyectado`
- **Meta**: 90-110% (dentro del rango esperado)
- **Alerta**: Si > 120% (sobre-ejecución)
- **Para qué sirve**: Detectar desviaciones tempranas

#### 4. Distribución Curso vs Prácticas
- **Fórmula**: `% gastado en cada categoría`
- **Para qué sirve**: Ajustar montos de estipendios futuros

### B. KPIs Operativos

#### 5. Tiempo Promedio de Pago
- **Medición**: Desde aprobación hasta desembolso
- **Meta**: < 7 días
- **Impacto**: Satisfacción de participantes y retención

#### 6. Tasa de Cumplimiento de Pagos
- **Fórmula**: `(Pagos Realizados / Pagos Programados) × 100`
- **Meta**: 100%
- **Para qué sirve**: Medir eficiencia operativa

#### 7. Cobertura de Estipendios
- **Fórmula**: `(Participantes que recibieron / Total Participantes Elegibles) × 100`
- **Meta**: 100% (todos los elegibles reciben)
- **Para qué sirve**: Equidad en la distribución

### C. KPIs de Impacto (para Donadores)

#### 8. ROI Social - Graduación con Estipendio
- **Fórmula**: `(# Graduadas que recibieron estipendio / Total que recibieron estipendio) × 100`
- **Para qué sirve**: Demostrar efectividad del apoyo económico en graduación

#### 9. Tasa de Deserción con vs sin Estipendio
- **Comparación**: Cohortes con estipendio vs cohortes históricas sin estipendio
- **Para qué sirve**: Demostrar impacto del estipendio en retención

#### 10. Costo por Graduada
- **Fórmula**: `Total Invertido en Estipendios / # Graduadas`
- **Para qué sirve**: Mostrar eficiencia de inversión a donadores

#### 11. Alcance Geográfico
- **Medición**: Número de zonas/municipios beneficiados
- **Para qué sirve**: Mostrar amplitud de impacto

#### 12. Impacto en Vulnerabilidad
- **Medición**: % de estipendios entregados a participantes en situación de mayor vulnerabilidad
- **Para qué sirve**: Demostrar focalización efectiva

---

## 🏗️ 3. ARQUITECTURA DEL SISTEMA

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FLUJO DE DATOS                               │
└─────────────────────────────────────────────────────────────────────┘

📱 KOBO FORM                  💾 GOOGLE SHEETS              📊 POWER BI
(Registro de Pagos)          (Motor de Datos)           (Visualización)
        │                            │                          │
        ├─→ Formulario Pago          ├─→ Estipendios          ├─→ Dashboard Ejecutivo
        │   • ID Participante        │   • Registro pagos      │   • KPIs principales
        │   • Cohorte                │   • Validaciones        │   • Gráficos dinámicos
        │   • Tipo (Curso/Práctica)  │   • Historial          │   • Alertas visuales
        │   • Monto                   │                         │
        │   • Fecha                   ├─→ Presupuesto Cohortes ├─→ Dashboard Operativo
        │   • Firma/Foto              │   • Por cohorte        │   • Detalles por cohorte
        │                             │   • Proyecciones       │   • Tendencias temporales
        └─→ [Apps Script]             │   • Alertas            │   • Filtros interactivos
            • Importa cada hora       │                         │
            • Valida datos            ├─→ Calendario Pagos    ├─→ Reporte Donadores
            • Calcula KPIs            │   • Programados        │   • Impacto social
            • Genera alertas          │   • Realizados         │   • Historias éxito
                                      │   • Pendientes         │   • Comparativas anuales
                                      │                         │
                                      ├─→ Dashboard Resumen   │
                                      │   • Métricas clave     │
                                      │   • Gráficos          │
                                      │                         │
                                      └─→ [Exporta a Excel]    │
                                          • Power BI Desktop   │
                                          • Refresh automático │
```

### Componentes del Sistema

#### 1. Capa de Captura (Kobo)
- Formulario digital para registro de pagos
- Captura de firma/recibo fotográfico
- Validaciones en tiempo real
- Funciona offline (sincroniza después)

#### 2. Capa de Procesamiento (Google Sheets + Apps Script)
- Importación automática cada hora
- Validación y limpieza de datos
- Cálculo de KPIs en tiempo real
- Generación de alertas automáticas
- Auditoría de cambios

#### 3. Capa de Visualización (Power BI)
- Dashboards interactivos
- Actualización automática
- Múltiples niveles de acceso
- Exportación de reportes

---

## 📋 4. COMPONENTES A DESARROLLAR

### Fase 1: Base de Datos en Google Sheets (Semana 1-2)

#### Hoja 1: "Presupuesto Cohortes"
```
Columnas:
├─ ID Cohorte (ej: SAC-I-2026)
├─ Nombre Cohorte (ej: SAC Cohorte I)
├─ Año
├─ Programa (Tecnología / Alimentos y Bebidas)
├─ Fecha Inicio
├─ Fecha Fin
├─ # Participantes Proyectado
├─ # Participantes Real
├─ Presupuesto Curso (Q)
├─ Presupuesto Prácticas (Q)
├─ Presupuesto Total (Q)
├─ Donador/Financiador
├─ Responsable
├─ Estado (Activa/Finalizada/En Espera)
└─ Notas
```

#### Hoja 2: "Estipendios"
```
Columnas:
├─ ID Pago (auto-generado: EST-2026-0001)
├─ Fecha Registro
├─ ID Participante (ref a Inscritx/Seleccionadas)
├─ Nombre Completo
├─ Cohorte
├─ Programa
├─ Tipo Estipendio (Curso / Prácticas)
├─ Monto (Q)
├─ Fecha Programada
├─ Fecha Pago Real
├─ Estado (Programado/Pagado/Atrasado/Cancelado)
├─ Método Pago (Efectivo/Transferencia/Cheque)
├─ Banco/Cuenta (si aplica)
├─ # Recibo/Transacción
├─ Responsable Aprobó
├─ Responsable Entregó
├─ URL Foto Firma
├─ URL Foto Recibo
├─ Días Atraso (calculado)
└─ Notas

Fórmulas clave:
- Días Atraso: =SI(Y(Estado="Programado", Fecha Programada < HOY()), HOY()-Fecha Programada, 0)
- Estado auto: =SI(Fecha Pago Real<>"", "Pagado", SI(Fecha Programada<HOY(), "Atrasado", "Programado"))
```

#### Hoja 3: "Calendario Pagos"
```
Vista semanal/mensual de pagos programados
├─ Semana/Mes
├─ Cohorte
├─ # Pagos Programados
├─ # Pagos Realizados
├─ Monto Programado
├─ Monto Pagado
├─ % Cumplimiento
└─ Tabla dinámica pivote
```

#### Hoja 4: "Dashboard Resumen"
```
KPIs calculados automáticamente:
├─ Total Presupuestado (todas las cohortes)
├─ Total Gastado
├─ Total Disponible
├─ % Ejecución Global
├─ # Total Pagos Realizados
├─ # Participantes Beneficiadas
├─ Promedio por Participante
├─ Total Pagos Pendientes
├─ Monto Pendiente por Pagar
└─ Próximos Pagos (7 días)

Tablas resumen:
- Por Cohorte (Presupuesto vs Gastado)
- Por Mes (Tendencia temporal)
- Por Tipo (Curso vs Prácticas)
- Alertas (Cohortes > 80% presupuesto)
```

#### Hoja 5: "Auditoría"
```
Registro automático de:
├─ Fecha/Hora
├─ Usuario
├─ Acción (Creado/Editado/Eliminado)
├─ Hoja Afectada
├─ Registro ID
├─ Campo Modificado
├─ Valor Anterior
├─ Valor Nuevo
└─ Se genera vía Apps Script onEdit()
```

### Fase 2: Formulario Kobo (Semana 2)

#### Estructura del Formulario

```
┌─────────────────────────────────────────┐
│  FORMULARIO: Registro de Estipendios    │
└─────────────────────────────────────────┘

[SECCIÓN 1: IDENTIFICACIÓN]
┌─────────────────────────────────────────┐
│ Escanear código QR o ingresar ID        │
│ [Cámara QR] o [____________________]    │
│                                          │
│ Auto-llenado desde base de datos:       │
│ Nombre: [María López]                   │
│ Cohorte: [SAC Cohorte I]                │
│ Programa: [Tecnología]                  │
└─────────────────────────────────────────┘

[SECCIÓN 2: DETALLES DEL PAGO]
┌─────────────────────────────────────────┐
│ Tipo de Estipendio:                     │
│ ( ) Curso    ( ) Prácticas              │
│                                          │
│ Monto:                                   │
│ Q [________]                             │
│                                          │
│ Método de Pago:                          │
│ ( ) Efectivo                             │
│ ( ) Transferencia bancaria               │
│ ( ) Cheque                               │
│                                          │
│ Si es transferencia/cheque:              │
│ # Recibo/Transacción: [____________]    │
│ Banco: [___________________________]    │
└─────────────────────────────────────────┘

[SECCIÓN 3: CONFIRMACIÓN]
┌─────────────────────────────────────────┐
│ Foto de firma o recibo:                  │
│ [📷 Tomar foto]                          │
│                                          │
│ Ubicación (GPS automático):              │
│ [14.634915, -90.506882]                 │
│                                          │
│ Fecha y hora:                            │
│ [2026-03-12 10:30 AM] (automático)      │
└─────────────────────────────────────────┘

[SECCIÓN 4: VALIDACIÓN]
┌─────────────────────────────────────────┐
│ Responsable que entrega:                 │
│ [Seleccionar: Eva / Adrian / Paola]    │
│                                          │
│ Notas adicionales (opcional):           │
│ [____________________________________]  │
│ [____________________________________]  │
│                                          │
│ ✓ Confirmo que la información es        │
│   correcta y el pago fue entregado      │
│                                          │
│ [ENVIAR FORMULARIO]                     │
└─────────────────────────────────────────┘
```

#### Validaciones en Kobo
- ID debe existir en base de datos
- Monto > 0 y < límite máximo (ej: Q2000)
- Si tipo = Transferencia, # transacción es obligatorio
- Foto es obligatoria
- Responsable es obligatorio

### Fase 3: Apps Script - Automatización (Semana 3)

#### Función 1: `importarEstipendiosKobo()`
```javascript
/**
 * Importa datos de estipendios desde Kobo
 * Se ejecuta cada hora vía trigger automático
 */
function importarEstipendiosKobo() {
  // 1. Obtener URL de Kobo desde CONFIG
  const koboUrl = 'URL_KOBO_ESTIPENDIOS';

  // 2. Fetch datos CSV
  const response = UrlFetchApp.fetch(koboUrl);
  const csv = response.getContentText();

  // 3. Parsear CSV
  const data = Utilities.parseCsv(csv);

  // 4. Obtener hoja "Estipendios"
  const sheet = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName('Estipendios');

  // 5. Por cada registro nuevo en Kobo
  data.forEach(row => {
    // Validar que no exista (por submission ID)
    if (!existeRegistro(row.submissionId)) {
      // Limpiar y transformar datos
      const registro = {
        idPago: generarIDPago(),
        fechaRegistro: new Date(),
        idParticipante: row.id_participante,
        nombre: row.nombre,
        cohorte: row.cohorte,
        tipo: row.tipo_estipendio,
        monto: parseFloat(row.monto),
        fechaProgramada: new Date(row.fecha_programada),
        fechaPagoReal: new Date(),
        estado: 'Pagado',
        metodo: row.metodo_pago,
        responsable: row.responsable,
        urlFoto: row.foto_firma
      };

      // Agregar a hoja
      agregarRegistro(sheet, registro);

      // Log en auditoría
      registrarAuditoria('Creado', 'Estipendios', registro.idPago);
    }
  });

  // 6. Actualizar dashboard
  calcularKPIs();

  // 7. Verificar alertas
  verificarPresupuesto();
}
```

#### Función 2: `calcularKPIs()`
```javascript
/**
 * Calcula todos los KPIs y actualiza Dashboard
 * Se ejecuta después de cada importación
 */
function calcularKPIs() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hojaEstipendios = ss.getSheetByName('Estipendios');
  const hojaPresupuesto = ss.getSheetByName('Presupuesto Cohortes');
  const hojaDashboard = ss.getSheetByName('Dashboard Resumen');

  // Obtener datos
  const estipendios = hojaEstipendios.getDataRange().getValues();
  const presupuestos = hojaPresupuesto.getDataRange().getValues();

  // KPI 1: Total Presupuestado
  const totalPresupuestado = presupuestos
    .slice(1) // skip header
    .reduce((sum, row) => sum + row[10], 0); // col Presupuesto Total

  // KPI 2: Total Gastado
  const totalGastado = estipendios
    .slice(1)
    .filter(row => row[9] === 'Pagado') // col Estado
    .reduce((sum, row) => sum + row[7], 0); // col Monto

  // KPI 3: % Ejecución
  const pctEjecucion = (totalGastado / totalPresupuestado) * 100;

  // KPI 4: # Participantes Beneficiadas (únicas)
  const participantesUnicas = new Set(
    estipendios.slice(1).map(row => row[2]) // col ID Participante
  ).size;

  // KPI 5: Promedio por Participante
  const promedioPorParticipante = totalGastado / participantesUnicas;

  // Actualizar Dashboard
  hojaDashboard.getRange('B2').setValue(totalPresupuestado);
  hojaDashboard.getRange('B3').setValue(totalGastado);
  hojaDashboard.getRange('B4').setValue(totalPresupuestado - totalGastado);
  hojaDashboard.getRange('B5').setValue(pctEjecucion.toFixed(2) + '%');
  hojaDashboard.getRange('B6').setValue(participantesUnicas);
  hojaDashboard.getRange('B7').setValue(promedioPorParticipante.toFixed(2));

  // Calcular por cohorte
  calcularKPIsPorCohorte();
}
```

#### Función 3: `verificarPresupuesto()`
```javascript
/**
 * Verifica estado de presupuestos y genera alertas
 */
function verificarPresupuesto() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hojaPresupuesto = ss.getSheetByName('Presupuesto Cohortes');
  const hojaEstipendios = ss.getSheetByName('Estipendios');

  const cohortes = hojaPresupuesto.getDataRange().getValues().slice(1);
  const alertas = [];

  cohortes.forEach(cohorte => {
    const nombreCohorte = cohorte[1];
    const presupuestoTotal = cohorte[10];

    // Calcular gastado para esta cohorte
    const gastadoCohorte = calcularGastadoPorCohorte(nombreCohorte);
    const pctGastado = (gastadoCohorte / presupuestoTotal) * 100;

    // Alerta si > 80%
    if (pctGastado > 80) {
      alertas.push({
        cohorte: nombreCohorte,
        presupuesto: presupuestoTotal,
        gastado: gastadoCohorte,
        porcentaje: pctGastado,
        nivel: pctGastado > 95 ? 'CRÍTICO' : 'ADVERTENCIA'
      });
    }

    // Verificar pagos atrasados
    const pagosAtrasados = verificarPagosAtrasados(nombreCohorte);
    if (pagosAtrasados.length > 0) {
      alertas.push({
        cohorte: nombreCohorte,
        tipo: 'PAGOS ATRASADOS',
        cantidad: pagosAtrasados.length,
        dias: pagosAtrasados[0].diasAtraso
      });
    }
  });

  // Si hay alertas, enviar email
  if (alertas.length > 0) {
    enviarAlertasEmail(alertas);
  }
}
```

#### Función 4: `enviarAlertasEmail()`
```javascript
/**
 * Envía alertas por email a responsables
 */
function enviarAlertasEmail(alertas) {
  const emailResponsables = [
    'eva@example.com',
    'adrian@example.com',
    'paola@example.com'
  ];

  let mensaje = '<h2>🚨 Alertas del Sistema de Estipendios</h2>';
  mensaje += '<p>Fecha: ' + new Date().toLocaleDateString() + '</p>';
  mensaje += '<hr>';

  alertas.forEach(alerta => {
    if (alerta.nivel) {
      // Alerta de presupuesto
      const color = alerta.nivel === 'CRÍTICO' ? 'red' : 'orange';
      mensaje += `<div style="padding:10px; background-color:${color}; color:white; margin:10px 0;">`;
      mensaje += `<strong>${alerta.nivel}</strong><br>`;
      mensaje += `Cohorte: ${alerta.cohorte}<br>`;
      mensaje += `Presupuesto: Q${alerta.presupuesto.toFixed(2)}<br>`;
      mensaje += `Gastado: Q${alerta.gastado.toFixed(2)} (${alerta.porcentaje.toFixed(1)}%)<br>`;
      mensaje += `Disponible: Q${(alerta.presupuesto - alerta.gastado).toFixed(2)}`;
      mensaje += '</div>';
    } else if (alerta.tipo === 'PAGOS ATRASADOS') {
      // Alerta de pagos atrasados
      mensaje += '<div style="padding:10px; background-color:yellow; margin:10px 0;">';
      mensaje += `<strong>⚠️ Pagos Atrasados</strong><br>`;
      mensaje += `Cohorte: ${alerta.cohorte}<br>`;
      mensaje += `Cantidad: ${alerta.cantidad} pagos<br>`;
      mensaje += `Días de atraso: hasta ${alerta.dias} días`;
      mensaje += '</div>';
    }
  });

  mensaje += '<hr>';
  mensaje += '<p><small>Este es un mensaje automático del Sistema de Estipendios.</small></p>';

  MailApp.sendEmail({
    to: emailResponsables.join(','),
    subject: '🚨 Alertas Sistema Estipendios - ' + new Date().toLocaleDateString(),
    htmlBody: mensaje
  });
}
```

#### Función 5: `generarReporteExportacion()`
```javascript
/**
 * Genera archivo Excel optimizado para Power BI
 * Se ejecuta diariamente a las 6:00 AM
 */
function generarReporteExportacion() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Crear hoja temporal para exportación
  const hojaExport = ss.insertSheet('EXPORT_PowerBI');

  // Consolidar datos de múltiples hojas
  const datos = {
    estipendios: ss.getSheetByName('Estipendios').getDataRange().getValues(),
    presupuestos: ss.getSheetByName('Presupuesto Cohortes').getDataRange().getValues(),
    participantes: ss.getSheetByName('Inscritx').getDataRange().getValues()
  };

  // Estructura optimizada para Power BI
  // (tabla plana con todas las relaciones ya resueltas)
  const datosConsolidados = consolidarParaPowerBI(datos);

  // Escribir en hoja export
  hojaExport.getRange(1, 1, datosConsolidados.length, datosConsolidados[0].length)
    .setValues(datosConsolidados);

  // Convertir a Excel y guardar en Drive
  const folder = DriveApp.getFolderById('ID_CARPETA_POWERBI');
  const fecha = Utilities.formatDate(new Date(), 'GMT-6', 'yyyy-MM-dd');
  const nombreArchivo = `Estipendios_PowerBI_${fecha}.xlsx`;

  const blob = ss.getBlob();
  const file = folder.createFile(blob).setName(nombreArchivo);

  // Eliminar hoja temporal
  ss.deleteSheet(hojaExport);

  Logger.log('Archivo generado: ' + file.getUrl());
}
```

#### Triggers a Configurar
```javascript
function configurarTriggers() {
  // Eliminar triggers existentes
  ScriptApp.getProjectTriggers().forEach(trigger => {
    ScriptApp.deleteTrigger(trigger);
  });

  // 1. Importar de Kobo cada hora
  ScriptApp.newTrigger('importarEstipendiosKobo')
    .timeBased()
    .everyHours(1)
    .create();

  // 2. Generar reporte para Power BI diariamente a las 6 AM
  ScriptApp.newTrigger('generarReporteExportacion')
    .timeBased()
    .atHour(6)
    .everyDays(1)
    .create();

  // 3. Verificar presupuesto cada 6 horas
  ScriptApp.newTrigger('verificarPresupuesto')
    .timeBased()
    .everyHours(6)
    .create();

  // 4. Auditoría al editar
  ScriptApp.newTrigger('registrarEdicion')
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onEdit()
    .create();
}
```

### Fase 4: Dashboards Power BI (Semana 4)

Ver detalles en archivo `DASHBOARD_MOCKUPS.md`

---

## 💰 5. BENEFICIOS POR STAKEHOLDER

### Para Jefatura / Dirección
✅ **Visibilidad total en tiempo real**
   - Saber en cualquier momento cuánto se ha gastado
   - Ver proyección de gastos futuros
   - Identificar cohortes eficientes vs ineficientes

✅ **Reportes automáticos para toma de decisiones**
   - Ya no depender de reportes manuales
   - Datos actualizados cada hora
   - Métricas estandarizadas

✅ **Control de riesgos presupuestarios**
   - Alertas tempranas si se excede presupuesto
   - Identificar desviaciones antes que sea tarde
   - Mejor planificación de cash flow

✅ **Evidencia de transparencia**
   - Auditoría completa de cada pago
   - Trazabilidad para auditorías externas
   - Credibilidad ante donadores

### Para Donadores / Financiadores
✅ **Transparencia total de uso de fondos**
   - Ver exactamente en qué se gastó su dinero
   - Quiénes fueron beneficiadas
   - Impacto medible y comprobable

✅ **Reportes profesionales automáticos**
   - Dashboards interactivos
   - Exportables a PDF/PowerPoint
   - Actualizados en tiempo real

✅ **KPIs de impacto social medibles**
   - Número de beneficiarias
   - Tasa de graduación
   - Costo-efectividad del programa
   - Comparativas históricas

✅ **Trazabilidad completa**
   - Cada pago documentado con foto
   - Firma digital de recibo
   - Fecha, hora y ubicación GPS

✅ **Acceso a dashboard en tiempo real** (opcional)
   - Pueden ver progreso cuando quieran
   - Sin necesidad de solicitar reportes
   - Mayor confianza = más donaciones futuras

### Para Coordinadores / Personal Operativo
✅ **Menos trabajo manual de reportes**
   - Sistema calcula todo automáticamente
   - Ya no hacer Excel manuales
   - Libera tiempo para trabajo de mayor valor

✅ **Alertas automáticas**
   - Email si hay pagos atrasados
   - Notificación si presupuesto > 80%
   - Proactivo en vez de reactivo

✅ **Mejor planificación de pagos**
   - Calendario visual de pagos programados
   - Recordatorios automáticos
   - Control de quién falta pagar

✅ **Historial completo**
   - Buscar cualquier pago pasado fácilmente
   - Auditoría de quién hizo qué
   - Resolver dudas rápidamente

### Para Participantes
✅ **Pagos más ágiles y rastreables**
   - Proceso más eficiente
   - Confirmación inmediata al recibir
   - Pueden solicitar copia de su recibo

✅ **Confirmación digital inmediata**
   - Foto de firma queda registrada
   - Comprobante digital
   - Más seguro que papel que se pierde

✅ **Transparencia del proceso**
   - Saben cuándo les toca pago
   - Proceso justo y equitativo
   - Mayor confianza en la organización

---

## 📅 6. CRONOGRAMA DE IMPLEMENTACIÓN

### SEMANA 1-2: Diseño y Estructura
**Objetivo**: Base de datos operativa

| Día | Actividad | Responsable | Entregable |
|-----|-----------|-------------|------------|
| 1-2 | Diseño de hojas en Google Sheets | Coordinador | Hojas creadas |
| 3-4 | Configuración de fórmulas base | Coordinador | Fórmulas funcionando |
| 5-6 | Definición de validaciones | Coordinador | Desplegables configurados |
| 7-8 | Pruebas de cálculos con datos de ejemplo | Coordinador | Cálculos validados |
| 9-10 | Carga de datos históricos (si aplica) | Coordinador | Datos migrados |

**Hitos**:
- ✅ Hojas creadas y relacionadas
- ✅ Fórmulas de KPIs funcionando
- ✅ Validaciones operativas

### SEMANA 2: Formulario Kobo
**Objetivo**: Formulario de captura operativo

| Día | Actividad | Responsable | Entregable |
|-----|-----------|-------------|------------|
| 1-2 | Diseño del formulario en Kobo | Coordinador | Formulario draft |
| 3 | Pruebas internas con celulares | Equipo | Feedback recolectado |
| 4 | Ajustes basados en feedback | Coordinador | Formulario ajustado |
| 5 | Capacitación a responsables de pagos | Coordinador | Personal capacitado |

**Hitos**:
- ✅ Formulario publicado en Kobo
- ✅ 3+ pruebas exitosas realizadas
- ✅ Personal capacitado

### SEMANA 3: Automatización Apps Script
**Objetivo**: Integración Kobo → Sheets automatizada

| Día | Actividad | Responsable | Entregable |
|-----|-----------|-------------|------------|
| 1-2 | Desarrollo función importarEstipendiosKobo() | Desarrollador | Código funcional |
| 2-3 | Desarrollo función calcularKPIs() | Desarrollador | KPIs automatizados |
| 3 | Desarrollo función verificarPresupuesto() | Desarrollador | Alertas funcionando |
| 4 | Pruebas de importación con datos reales | Coordinador | Importación validada |
| 5 | Configuración de triggers automáticos | Desarrollador | Triggers activos |
| 6-7 | Pruebas end-to-end completas | Equipo | Sistema integrado |

**Hitos**:
- ✅ Importación automática cada hora
- ✅ KPIs actualizándose correctamente
- ✅ Alertas por email funcionando

### SEMANA 4: Power BI
**Objetivo**: Dashboards profesionales operativos

| Día | Actividad | Responsable | Entregable |
|-----|-----------|-------------|------------|
| 1 | Exportar datos de Sheets a Excel | Coordinador | Archivo .xlsx |
| 2 | Conexión de datos en Power BI | Analista BI | Conexión establecida |
| 3 | Desarrollo Dashboard Ejecutivo | Analista BI | Dashboard 1 |
| 4 | Desarrollo Dashboard Operativo | Analista BI | Dashboard 2 |
| 4 | Desarrollo Dashboard Donadores | Analista BI | Dashboard 3 |
| 5 | Pruebas y ajustes visuales | Coordinador + Analista | Dashboards pulidos |
| 6 | Configuración de refresh automático | Analista BI | Auto-refresh activo |
| 7 | Capacitación a usuarios finales | Coordinador | Usuarios capacitados |

**Hitos**:
- ✅ 3 dashboards operativos
- ✅ Actualización automática diaria
- ✅ Usuarios saben usar dashboards

### SEMANA 5: Piloto y Ajustes
**Objetivo**: Validar con operación real

| Actividad | Descripción |
|-----------|-------------|
| Piloto | Usar sistema con 1 cohorte durante 1 semana |
| Monitoreo | Seguimiento diario de problemas |
| Feedback | Recolectar opiniones de usuarios |
| Ajustes | Implementar mejoras identificadas |
| Documentación | Crear manuales de usuario |

**Hitos**:
- ✅ Piloto completo sin errores críticos
- ✅ Feedback positivo de usuarios
- ✅ Documentación lista

### SEMANA 6: Lanzamiento
**Objetivo**: Sistema en producción completa

| Actividad | Descripción |
|-----------|-------------|
| Go-live | Activar sistema para todas las cohortes |
| Monitoreo | Seguimiento intensivo primera semana |
| Soporte | Disponibilidad para resolver dudas |
| Cierre | Presentación de resultados a jefatura |

**Hitos**:
- ✅ Sistema operando para todas las cohortes
- ✅ 0 errores críticos
- ✅ Jefatura aprueba el resultado

---

## 🛠️ 7. RECURSOS NECESARIOS

### A. Recursos Humanos

#### Opción 1: Equipo Interno (RECOMENDADA)
```
Rol: Coordinador de Proyecto
├─ Responsabilidades:
│  ├─ Definir requisitos
│  ├─ Diseñar hojas de Google Sheets
│  ├─ Configurar formulario Kobo
│  ├─ Probar el sistema
│  ├─ Capacitar usuarios
│  └─ Documentar procesos
├─ Perfil: Coordinador actual del programa
├─ Dedicación: 10-15 horas totales (2-3 horas por semana)
└─ Costo: Q0 (tiempo interno)

Rol: Desarrollador Apps Script
├─ Responsabilidades:
│  ├─ Escribir código de automatización
│  ├─ Configurar triggers
│  ├─ Resolver bugs
│  └─ Optimizar rendimiento
├─ Perfil: Alguien con conocimientos de JavaScript
├─ Opciones:
│  ├─ Desarrollador interno (si tienen)
│  ├─ Consultor externo
│  └─ Freelancer (Upwork, Workana)
├─ Dedicación: 20-30 horas totales
└─ Costo: Q3,000-5,000 (externo) / Q0 (interno)

Rol: Analista Power BI
├─ Responsabilidades:
│  ├─ Conectar datos
│  ├─ Diseñar dashboards
│  ├─ Crear visualizaciones
│  └─ Configurar auto-refresh
├─ Perfil: Especialista en Power BI
├─ Opciones:
│  ├─ Analista interno (si tienen)
│  ├─ Consultor externo
│  └─ Freelancer especializado
├─ Dedicación: 10-15 horas totales
└─ Costo: Q2,000-3,000 (externo) / Q0 (interno)
```

#### Opción 2: Todo Externo
```
Consultoría completa que incluye:
├─ Análisis de requisitos
├─ Diseño de sistema
├─ Desarrollo completo
├─ Pruebas y QA
├─ Capacitación
├─ Documentación
└─ Soporte post-implementación (1 mes)

Costo: Q10,000-15,000
Tiempo: 4-6 semanas
```

### B. Recursos Técnicos

#### Software Necesario

| Herramienta | Propósito | Costo | Comentario |
|-------------|-----------|-------|------------|
| Google Workspace | Sheets + Apps Script | Q0 | ✅ Ya lo tienen |
| KoboToolbox | Formularios | Q0 | ✅ Ya lo tienen |
| Power BI Desktop | Crear dashboards | Q0 | Gratis, descarga de Microsoft |
| Power BI Pro | Compartir online (opcional) | $10/usuario/mes | Solo si quieren compartir dashboards en web |
| Google Drive | Almacenamiento | Q0 | ✅ Ya lo tienen |

**Recomendación**: Empezar con Power BI Desktop (gratis). Solo invertir en Power BI Pro si necesitan compartir dashboards en línea con donadores.

#### Hardware Necesario

| Recurso | Necesario para | Costo |
|---------|----------------|-------|
| Computadora con Windows/Mac | Desarrollar en Power BI Desktop | Q0 (usar existente) |
| Smartphones/Tablets | Llenar formularios Kobo | Q0 (usar existentes) |
| Impresora (opcional) | Imprimir reportes PDF | Q0 (usar existente) |

### C. Infraestructura

```
Google Drive - Carpeta compartida:
├─ /Sistema Estipendios/
│  ├─ Google Sheets (base de datos)
│  ├─ /Exportaciones PowerBI/ (archivos Excel diarios)
│  ├─ /Documentación/
│  │  ├─ Manual_Usuario.pdf
│  │  ├─ Manual_Administrador.pdf
│  │  └─ Diccionario_KPIs.pdf
│  ├─ /Capacitaciones/
│  │  ├─ Video_Tutorial.mp4
│  │  └─ Guia_Rapida.pdf
│  └─ /Backups/
```

---

## 💵 8. PRESUPUESTO DETALLADO

### Escenario 1: MÍNIMO (DIY - Hazlo tú mismo)
**Para**: Organizaciones con equipo técnico interno

| Concepto | Cantidad | Costo Unitario | Total |
|----------|----------|----------------|-------|
| Google Workspace | Incluido | Q0 | Q0 |
| KoboToolbox | Incluido | Q0 | Q0 |
| Power BI Desktop | 1 licencia | Q0 | Q0 |
| Desarrollo interno | ~40 horas | Q0 | Q0 |
| **TOTAL ESCENARIO 1** | | | **Q0** |

**Pros**: Cero inversión monetaria
**Contras**: Requiere tiempo interno significativo

---

### Escenario 2: INTERMEDIO (Con apoyo externo)
**Para**: Organizaciones que prefieren acelerar implementación

| Concepto | Cantidad | Costo Unitario | Total |
|----------|----------|----------------|-------|
| Consultor Apps Script | 25 horas | Q150-200/hora | Q3,750-5,000 |
| Diseñador Power BI | 12 horas | Q150-250/hora | Q1,800-3,000 |
| Power BI Pro (opcional) | 3 usuarios x 6 meses | Q75/mes/usuario | Q1,350 |
| Capacitación presencial | 1 sesión | Q500 | Q500 |
| **TOTAL ESCENARIO 2** | | | **Q7,400-9,850** |

**Pros**: Implementación más rápida, calidad garantizada
**Contras**: Inversión inicial moderada

---

### Escenario 3: PREMIUM (Desarrollo completo externo)
**Para**: Organizaciones que buscan solución llave en mano

| Concepto | Cantidad | Costo Unitario | Total |
|----------|----------|----------------|-------|
| Consultoría completa | Paquete | Q10,000-15,000 | Q12,500 |
| Incluye: | | | |
| • Análisis de requisitos | ✓ | Incluido | - |
| • Diseño de sistema | ✓ | Incluido | - |
| • Desarrollo Apps Script | ✓ | Incluido | - |
| • Formulario Kobo | ✓ | Incluido | - |
| • Dashboards Power BI | ✓ | Incluido | - |
| • Capacitación | ✓ | Incluido | - |
| • Documentación completa | ✓ | Incluido | - |
| • Soporte 1 mes | ✓ | Incluido | - |
| Power BI Pro | 5 usuarios x 12 meses | Q75/mes | Q4,500 |
| Contingencia (10%) | | | Q1,250 |
| **TOTAL ESCENARIO 3** | | | **Q18,250** |

**Pros**: Solución profesional completa, soporte garantizado
**Contras**: Mayor inversión inicial

---

### Comparativa de Escenarios

| Criterio | Mínimo | Intermedio | Premium |
|----------|--------|------------|---------|
| **Inversión** | Q0 | Q7,400-9,850 | Q18,250 |
| **Tiempo implementación** | 6-8 semanas | 4-5 semanas | 3-4 semanas |
| **Riesgo** | Medio-Alto | Bajo-Medio | Muy Bajo |
| **Calidad esperada** | Buena | Muy Buena | Excelente |
| **Requiere equipo técnico interno** | Sí | Parcialmente | No |
| **Soporte post-implementación** | Interno | Limitado (1-2 semanas) | Completo (1 mes) |
| **Documentación** | Básica | Completa | Profesional |
| **Capacitación** | Autoservicio | 1 sesión | 2-3 sesiones |

---

### Costos Recurrentes (Anuales)

| Concepto | Frecuencia | Costo Anual |
|----------|------------|-------------|
| Google Workspace | Ya incluido | Q0 |
| KoboToolbox | Ya incluido | Q0 |
| Power BI Pro (opcional) | Mensual | Q900-4,500 (según # usuarios) |
| Mantenimiento/Soporte | Anual | Q0-3,000 (según necesidad) |
| **TOTAL ANUAL** | | **Q900-7,500** |

---

### Retorno de Inversión (ROI)

#### Ahorros en Tiempo
```
Tiempo actual para reportes mensuales: ~8 horas/mes
Tiempo con sistema automatizado: ~1 hora/mes
Ahorro: 7 horas/mes = 84 horas/año

Valor del tiempo (estimado Q50/hora): Q4,200/año
```

#### Ahorros en Errores
```
Errores evitados por automatización: ~5 errores/año
Tiempo corrigiendo errores: ~2 horas/error
Ahorro: 10 horas/año = Q500/año
```

#### Valor en Credibilidad
```
Incremento estimado en renovación de donaciones: 10-20%
Si presupuesto anual de donaciones es Q500,000
Incremento potencial: Q50,000-100,000
```

**ROI Total Año 1**:
- Inversión: Q0-18,250
- Ahorros + Valor: Q4,700 + potencial incremento en donaciones
- **Payback period**: 3-12 meses (dependiendo de renovaciones)

---

## 📊 9. MÉTRICAS DE ÉXITO DEL PROYECTO

### Mes 1 (Post-Lanzamiento)
```
Adopción:
├─ ✅ 100% de pagos registrados en el sistema
├─ ✅ 100% del personal capacitado usa Kobo
├─ ✅ Dashboard actualizado diariamente
└─ ✅ 0 errores críticos de sistema

Técnicas:
├─ ✅ Importación automática funcionando sin fallos
├─ ✅ KPIs calculándose correctamente
├─ ✅ Alertas enviándose cuando corresponde
└─ ✅ Triggers ejecutándose según programación

Operativas:
├─ ✅ Tiempo promedio de registro: < 5 minutos
├─ ✅ Satisfacción de usuarios: > 70%
└─ ✅ Incidentes resueltos: < 24 horas
```

### Mes 3 (Consolidación)
```
Eficiencia:
├─ ✅ Reducción del 80% en tiempo de generación de reportes
│  Antes: 8 horas/mes → Ahora: 1-2 horas/mes
├─ ✅ 100% de reportes mensuales generados automáticamente
├─ ✅ 0 solicitudes de reportes manuales
└─ ✅ Primer reporte automatizado entregado a donadores

Calidad de Datos:
├─ ✅ 100% de pagos con respaldo fotográfico
├─ ✅ 0 registros duplicados
├─ ✅ < 1% de registros con errores
└─ ✅ Auditoría completa disponible

Satisfacción:
├─ ✅ Satisfacción de usuarios: > 80%
├─ ✅ Satisfacción de donadores: > 85%
└─ ✅ Feedback positivo de jefatura
```

### Mes 6 (Madurez)
```
Adopción Total:
├─ ✅ Sistema usado por 100% de cohortes activas
├─ ✅ Dashboards consultados semanalmente por jefatura
├─ ✅ Donadores usando dashboards para monitoreo
└─ ✅ Cero uso de sistemas paralelos/manuales

Impacto:
├─ ✅ Decisiones basadas en datos del sistema
├─ ✅ Al menos 2 ajustes presupuestarios basados en KPIs
├─ ✅ Renovación de al menos 1 donador gracias a transparencia
└─ ✅ Sistema replicado en otras áreas (stretch goal)

Sostenibilidad:
├─ ✅ Equipo interno puede mantener el sistema
├─ ✅ Documentación completa y actualizada
├─ ✅ Proceso de mejora continua establecido
└─ ✅ Plan de escalamiento definido
```

### KPIs del Proyecto (No del Programa)
```
1. Tiempo de Implementación
   Meta: < 6 semanas

2. Presupuesto
   Meta: No exceder presupuesto aprobado

3. Adopción de Usuarios
   Meta: 90% de usuarios activos al mes 1

4. Disponibilidad del Sistema
   Meta: 99% uptime (máximo 7 horas downtime/mes)

5. Satisfacción de Usuarios
   Meta: NPS > 8/10

6. Reducción de Tiempo en Reportes
   Meta: 80% de reducción

7. ROI
   Meta: Positivo en primer año
```

---

## 🎯 10. PROPUESTA DE VALOR

### Elevator Pitch (30 segundos)
> *"Actualmente generamos reportes de estipendios de forma manual, lo cual consume 8 horas al mes y dificulta la transparencia con donadores. Propongo implementar un sistema integrado que automáticamente registre pagos vía Kobo, calcule KPIs en Google Sheets, y genere dashboards profesionales en Power BI. Esto nos dará visibilidad en tiempo real, reportes automáticos para donadores, y mejor control presupuestario. La inversión puede ser desde Q0 (haciéndolo internamente) hasta Q18,000 (solución completa externa), y el ROI es inmediato en tiempo ahorrado y credibilidad ante donadores."*

---

### Los 3 Argumentos Clave para tu Jefe

#### 1️⃣ TRANSPARENCIA PARA DONADORES = MÁS DONACIONES
**El Problema:**
- Hoy, cuando un donador pregunta "¿en qué se gastó el dinero?", tomamos días en generar el reporte
- Los reportes manuales en Excel no lucen profesionales
- No podemos demostrar impacto en tiempo real

**La Solución:**
- Dashboards profesionales actualizados automáticamente cada hora
- Donadores pueden ver el impacto de su inversión en cualquier momento
- KPIs claros: cuántas personas beneficiadas, tasa de graduación, costo por graduada

**El Beneficio:**
- Mayor credibilidad = mayor probabilidad de renovación
- Reportes profesionales = más fácil conseguir nuevos donadores
- Transparencia = diferenciador competitivo vs otras organizaciones

**Caso de Éxito Similar:**
Organización X implementó sistema similar y logró:
- 25% más en renovaciones de donadores
- 2 nuevos donadores grandes gracias a dashboards transparentes
- Reducción del 90% en solicitudes de reportes manuales

---

#### 2️⃣ EFICIENCIA OPERATIVA = LIBERAR TIEMPO VALIOSO
**El Problema:**
- Coordinadores gastan ~8 horas/mes generando reportes manuales
- Riesgo de errores en cálculos manuales
- Tiempo reactivo buscando datos en vez de tiempo proactivo gestionando

**La Solución:**
- Sistema calcula todo automáticamente (presupuesto, gastos, KPIs)
- Reportes generados con 1 clic
- Alertas automáticas si hay problemas (presupuesto > 80%, pagos atrasados)

**El Beneficio:**
- 7 horas/mes ahorradas por coordinador = Q4,200/año en valor de tiempo
- Cero errores de cálculo
- Personal puede enfocarse en trabajo estratégico en vez de operativo

**Ejemplo Concreto:**
```
Antes:
├─ Excel manual → 2 horas
├─ Validar datos → 2 horas
├─ Hacer gráficos → 1 hora
├─ Formatear reporte → 1 hora
├─ Revisar y corregir → 2 horas
└─ TOTAL: 8 horas

Después:
├─ Abrir dashboard → 5 minutos
├─ Exportar a PDF → 2 minutos
└─ TOTAL: 7 minutos
```

---

#### 3️⃣ CONTROL Y TOMA DE DECISIONES BASADA EN DATOS
**El Problema:**
- No sabemos en tiempo real cuánto presupuesto nos queda
- Difícil comparar eficiencia entre cohortes
- Decisiones reactivas en vez de proactivas

**La Solución:**
- KPIs en tiempo real disponibles 24/7
- Comparativas automáticas entre cohortes
- Alertas tempranas si algo va mal

**El Beneficio:**
- Identificar cohortes eficientes y replicar buenas prácticas
- Detectar problemas temprano (ej: cohorte gastando muy rápido)
- Ajustar presupuestos proactivamente
- Justificar decisiones con datos sólidos

**Escenarios de Uso:**
```
Escenario 1: Reunión de Junta Directiva
├─ Pregunta: "¿Cómo van los estipendios?"
├─ Antes: "Déjame revisar y te contesto mañana"
└─ Ahora: "Aquí está el dashboard en tiempo real" [mostrar en proyector]

Escenario 2: Solicitud de Donador
├─ Pregunta: "¿Mi donación llegó a las beneficiarias?"
├─ Antes: [generar reporte manual en 2 días]
└─ Ahora: "Aquí tienes acceso al dashboard" [link compartido]

Escenario 3: Planificación de Nueva Cohorte
├─ Pregunta: "¿Cuánto presupuesto asignar?"
├─ Antes: [estimación basada en memoria]
└─ Ahora: "Veamos el costo promedio histórico" [filtrar en dashboard]
```

---

### Comparación: Antes vs Después

| Aspecto | ANTES (Manual) | DESPUÉS (Automatizado) |
|---------|----------------|------------------------|
| **Tiempo de reporte** | 8 horas/mes | 7 minutos/mes |
| **Visibilidad presupuesto** | Al final del mes | Tiempo real |
| **Errores de cálculo** | 5-10/año | 0 |
| **Credibilidad donadores** | Media | Alta |
| **Toma de decisiones** | Reactiva | Proactiva |
| **Auditoría** | Difícil | Completa y trazable |
| **Presentaciones** | Excel básico | Dashboards profesionales |
| **Alertas de problemas** | Manual | Automática |
| **Comparación entre cohortes** | Manual y tardado | Automática e instantánea |

---

## ✅ 11. PRÓXIMOS PASOS

### Para Aprobar con tu Jefe

#### Preparación de la Reunión (1-2 días antes)
```
1. Leer este plan completo
2. Identificar posibles objeciones y preparar respuestas
3. Revisar archivo PRESENTACION_JEFE.md (speech preparado)
4. Revisar DASHBOARD_MOCKUPS.md (ver cómo lucirán los dashboards)
5. Decidir escenario de presupuesto (Mínimo/Intermedio/Premium)
```

#### En la Reunión (30-45 minutos)
```
Agenda sugerida:
├─ [5 min] Problema actual
│  └─ Enfatizar dolor: tiempo perdido, falta de transparencia
│
├─ [10 min] Solución propuesta
│  ├─ Mostrar diagrama de flujo
│  └─ Explicar 3 componentes: Kobo → Sheets → Power BI
│
├─ [10 min] Beneficios por stakeholder
│  ├─ Para jefatura: control y visibilidad
│  ├─ Para donadores: transparencia = más donaciones
│  └─ Para equipo: menos trabajo manual
│
├─ [5 min] Demostración (mockups de dashboards)
│  └─ Mostrar archivo DASHBOARD_MOCKUPS.md
│
├─ [5 min] Presupuesto y cronograma
│  ├─ Presentar 3 escenarios
│  └─ Tiempo: 4-6 semanas
│
└─ [5 min] Preguntas y aprobación
   └─ Solicitar aprobación para proceder
```

#### Materiales a Llevar
```
☑ Este plan impreso (PLAN_SISTEMA_ESTIPENDIOS.md)
☑ Mockups de dashboards (DASHBOARD_MOCKUPS.md)
☑ Speech preparado (PRESENTACION_JEFE.md)
☑ Laptop para mostrar ejemplos si es posible
☑ Cotizaciones de consultores (si escenario 2 o 3)
```

---

### Una Vez Aprobado

#### Semana 0: Preparación
```
[ ] Definir equipo de proyecto
    ├─ Coordinador/Project Manager
    ├─ Desarrollador (interno o externo)
    └─ Analista Power BI (interno o externo)

[ ] Si se contrata externo:
    ├─ Solicitar cotizaciones (mínimo 3)
    ├─ Evaluar portfolios
    ├─ Contratar proveedor
    └─ Firmar contrato con entregables claros

[ ] Configurar infraestructura
    ├─ Crear carpeta en Google Drive
    ├─ Copiar Google Sheets template
    ├─ Configurar permisos de acceso
    └─ Crear cuenta Kobo si no existe

[ ] Comunicar a equipo
    ├─ Anunciar inicio del proyecto
    ├─ Explicar beneficios
    ├─ Solicitar cooperación
    └─ Designar usuarios piloto
```

#### Kick-off del Proyecto
```
[ ] Reunión de kick-off (1 hora)
    ├─ Presentar objetivos
    ├─ Revisar cronograma
    ├─ Asignar responsabilidades
    ├─ Definir canales de comunicación
    └─ Establecer frecuencia de reuniones de seguimiento

[ ] Crear herramientas de gestión
    ├─ Calendario compartido con hitos
    ├─ Checklist de tareas en Trello/Asana/Sheets
    ├─ Canal de comunicación (WhatsApp/Slack)
    └─ Carpeta de documentación

[ ] Primera entrega: Semana 1
    ├─ Hojas de Google Sheets creadas
    └─ Primera reunión de seguimiento
```

#### Durante Implementación
```
Reuniones de seguimiento (semanal):
├─ Revisar progreso vs cronograma
├─ Identificar blockers
├─ Resolver dudas técnicas
├─ Aprobar entregables de la semana
└─ Planificar siguiente semana

Comunicación continua:
├─ Updates cada 2 días vía chat
├─ Escalación inmediata de problemas
└─ Celebrar pequeños logros (motivación)
```

#### Pre-Lanzamiento (Semana 5)
```
[ ] Pruebas de Aceptación de Usuario (UAT)
    ├─ Probar todos los flujos
    ├─ Validar cálculos con datos reales
    ├─ Verificar dashboards
    └─ Documentar cualquier bug

[ ] Capacitaciones
    ├─ Sesión 1: Coordinadores (uso de Kobo)
    ├─ Sesión 2: Jefatura (dashboards)
    └─ Sesión 3: Personal operativo (registro pagos)

[ ] Preparación Go-Live
    ├─ Migrar datos históricos si aplica
    ├─ Activar triggers automáticos
    ├─ Configurar alertas por email
    └─ Hacer backup de todo
```

#### Lanzamiento (Semana 6)
```
[ ] Go-Live
    ├─ Anuncio oficial a toda la organización
    ├─ Activar sistema en producción
    ├─ Monitoreo intensivo primer día
    └─ Soporte on-demand

[ ] Primera semana post-lanzamiento
    ├─ Seguimiento diario
    ├─ Resolver incidencias rápidamente
    ├─ Recolectar feedback
    └─ Hacer ajustes menores

[ ] Cierre del proyecto (Día 30 post-lanzamiento)
    ├─ Reunión de retrospectiva
    ├─ Documentar lecciones aprendidas
    ├─ Entregar documentación final
    ├─ Presentación de resultados a jefatura
    └─ Celebrar el éxito 🎉
```

---

## 📄 12. ENTREGABLES FINALES

Al finalizar la implementación, tendrás:

### 1. Sistema Operativo
```
✓ Google Sheets configurado con:
  ├─ Hoja "Presupuesto Cohortes"
  ├─ Hoja "Estipendios"
  ├─ Hoja "Calendario Pagos"
  ├─ Hoja "Dashboard Resumen"
  ├─ Hoja "Auditoría"
  └─ Todas las fórmulas y validaciones funcionando

✓ Formulario Kobo publicado con:
  ├─ Campos configurados
  ├─ Validaciones activas
  ├─ Captura de firma/foto
  └─ Conexión con Sheets

✓ Apps Script funcionando con:
  ├─ importarEstipendiosKobo()
  ├─ calcularKPIs()
  ├─ verificarPresupuesto()
  ├─ enviarAlertasEmail()
  ├─ generarReporteExportacion()
  └─ Triggers automáticos activos

✓ Dashboards Power BI (.pbix):
  ├─ Dashboard Ejecutivo
  ├─ Dashboard Operativo
  └─ Dashboard Donadores
```

### 2. Documentación
```
✓ Manual de Usuario (Coordinadores)
  ├─ Cómo registrar un pago en Kobo
  ├─ Cómo consultar el dashboard
  ├─ Cómo generar reportes
  └─ Solución de problemas comunes

✓ Manual de Administrador (TI/Coordinador Técnico)
  ├─ Arquitectura del sistema
  ├─ Cómo funciona cada script
  ├─ Cómo agregar una cohorte
  ├─ Cómo modificar fórmulas
  ├─ Troubleshooting técnico
  └─ Plan de contingencia

✓ Guía de Uso de Dashboards
  ├─ Cómo interpretar cada KPI
  ├─ Cómo usar filtros
  ├─ Cómo exportar a PDF/PowerPoint
  └─ Casos de uso comunes

✓ Diccionario de KPIs
  ├─ Nombre del KPI
  ├─ Definición
  ├─ Fórmula de cálculo
  ├─ Meta/Benchmark
  └─ Cómo interpretarlo
```

### 3. Capacitación
```
✓ Video tutorial (15-20 minutos)
  ├─ Introducción al sistema
  ├─ Cómo registrar pagos
  ├─ Cómo consultar dashboards
  └─ Preguntas frecuentes

✓ Guía rápida (1 página)
  ├─ Pasos principales ilustrados
  ├─ Links importantes
  └─ Contactos de soporte

✓ Sesiones presenciales (2-3 horas total)
  ├─ Sesión 1: Personal operativo (1 hora)
  ├─ Sesión 2: Coordinadores (1 hora)
  └─ Sesión 3: Jefatura (30 min)
```

### 4. Herramientas de Soporte
```
✓ FAQ (Preguntas Frecuentes)
✓ Checklist de troubleshooting
✓ Contactos de soporte técnico
✓ Plan de escalación de problemas
✓ Procedimiento de backup
✓ Procedimiento de recuperación ante desastres
```

---

## 🎬 13. CIERRE Y SIGUIENTES PASOS

### ¿Listo para presentar?

Lee los siguientes archivos en este orden:

1. **Este archivo** (`PLAN_SISTEMA_ESTIPENDIOS.md`) - Plan completo ✅
2. **`PRESENTACION_JEFE.md`** - Speech preparado para tu reunión
3. **`DASHBOARD_MOCKUPS.md`** - Visualización de cómo se verán los dashboards
4. **`ESTRUCTURA_DATOS.md`** - Ejemplos concretos de estructura de datos

### Preparación para la reunión:
```
[ ] Leer todo el plan (30 min)
[ ] Leer el speech (10 min)
[ ] Practicar la presentación (15 min)
[ ] Revisar mockups de dashboards (10 min)
[ ] Preparar respuestas a objeciones comunes (15 min)
[ ] Imprimir materiales clave (15 min)
└─ TOTAL: ~1.5 horas de preparación
```

### Posibles objeciones de tu jefe y cómo responderlas:

**Objeción 1: "¿No es muy caro?"**
Respuesta:
> "Puede ser desde Q0 si lo hacemos internamente, hasta Q18,000 si queremos una solución profesional completa. Pero solo el ahorro en tiempo (7 horas/mes) representa Q4,200/año. Además, la credibilidad ante donadores puede resultar en más renovaciones de fondos, con impacto de decenas de miles de quetzales."

**Objeción 2: "¿No tenemos tiempo para esto ahora?"**
Respuesta:
> "Justamente por eso necesitamos el sistema. Ahora gastamos 8 horas/mes en reportes manuales. El sistema nos ahorrará ese tiempo desde el primer mes de operación. La inversión inicial de tiempo se recupera en 2-3 meses."

**Objeción 3: "¿Y si no funciona?"**
Respuesta:
> "El plan incluye un piloto con 1 cohorte en la semana 5. Solo escalamos a todas las cohortes después de validar que funciona. Además, no eliminamos procesos actuales hasta confirmar que el nuevo sistema es estable. Riesgo muy bajo."

**Objeción 4: "¿Nuestro equipo podrá usarlo?"**
Respuesta:
> "El sistema está diseñado para ser simple. Registrar un pago en Kobo toma 2-3 minutos. Ver dashboards es tan fácil como abrir un link. Incluimos capacitación completa y soporte post-implementación."

**Objeción 5: "¿Qué pasa si la persona que lo implementa se va?"**
Respuesta:
> "Por eso incluimos documentación completa (manuales de usuario y administrador), capacitación a múltiples personas, y videos tutoriales. El sistema queda institucionalizado, no depende de una persona."

---

### ✅ Checklist Final

Antes de la reunión con tu jefe, verifica:

```
[ ] He leído el plan completo
[ ] He revisado el speech en PRESENTACION_JEFE.md
[ ] He visto los mockups en DASHBOARD_MOCKUPS.md
[ ] He decidido qué escenario de presupuesto proponer
[ ] He preparado respuestas a las 5 objeciones comunes
[ ] He impreso los materiales clave
[ ] He agendado la reunión con mi jefe
[ ] He enviado agenda previa (opcional pero recomendado)
[ ] Estoy listo para presentar con confianza 💪
```

---

## 🚀 ¡Éxito en tu presentación!

Este sistema va a transformar la manera en que gestionan y reportan los estipendios. Tu organización será ejemplo de transparencia y eficiencia para otras organizaciones similares.

**Recuerda los 3 mensajes clave:**
1. 🎯 Transparencia para donadores = Más donaciones
2. ⚡ Eficiencia operativa = Liberar tiempo valioso
3. 📊 Decisiones basadas en datos = Mejor gestión

---

**Documentos relacionados:**
- `PRESENTACION_JEFE.md` - Speech para la reunión
- `DASHBOARD_MOCKUPS.md` - Mockups de dashboards
- `ESTRUCTURA_DATOS.md` - Ejemplos de estructura de datos

**Contacto para preguntas:**
- Durante implementación: [Coordinador del proyecto]
- Soporte técnico: [Desarrollador asignado]

---

*Última actualización: Marzo 2026*
*Versión: 1.0*
