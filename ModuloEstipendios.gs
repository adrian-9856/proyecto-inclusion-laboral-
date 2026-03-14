/**
 * =============================================================================
 * MÓDULO DE GESTIÓN DE ESTIPENDIOS
 * =============================================================================
 *
 * Este módulo se integra con el sistema existente de Alimentos y Bebidas / Tecnología
 * para agregar funcionalidad completa de gestión de estipendios.
 *
 * FUNCIONALIDADES:
 * - Importación automática desde Kobo de pagos de estipendios
 * - Gestión de presupuestos por cohorte
 * - Cálculo automático de KPIs
 * - Alertas presupuestarias por email
 * - Dashboards automáticos
 * - Exportación para Power BI
 *
 * INSTRUCCIONES DE INTEGRACIÓN:
 * 1. Copiar este archivo COMPLETO
 * 2. Pegarlo al FINAL de AlimentosBebidas.gs (antes del último })
 * 3. Pegarlo al FINAL de tech.gs (antes del último })
 * 4. Actualizar el CONFIG con la URL de Kobo de estipendios
 * 5. Actualizar el menú agregando el submenú de Estipendios
 *
 * =============================================================================
 */

// =============================================================================
// CONFIGURACIÓN DE ESTIPENDIOS (Agregar al CONFIG existente)
// =============================================================================

/**
 * INSTRUCCIÓN: Agregar estas líneas dentro del objeto CONFIG_AB existente:
 *
 * // URL de KoboToolbox para importar Estipendios
 * KOBO_ESTIPENDIOS_URL: 'https://kf.kobotoolbox.org/api/v2/assets/aNpJWVRoxxQ5a8pwBQVJac/export-settings/esqLSo9A8oFvxVwZKUXwADx/data.csv',
 *
 * // Token de Kobo (si es necesario para autenticación)
 * KOBO_TOKEN: '64cc018b88067397addd36b09288be8b6539cf39',
 *
 * // Email para alertas de estipendios
 * EMAIL_ALERTAS_ESTIPENDIOS: 'adrian@example.com',
 */

// =============================================================================
// HOJAS DEL SISTEMA DE ESTIPENDIOS
// =============================================================================

const HOJAS_ESTIPENDIOS = {
  PRESUPUESTO_COHORTES: 'Presupuesto Cohortes',
  ESTIPENDIOS: 'Estipendios',
  CALENDARIO_PAGOS: 'Calendario Pagos',
  DASHBOARD_RESUMEN: 'Dashboard Estipendios',
  AUDITORIA_ESTIPENDIOS: 'Auditoría Estipendios'
};

// =============================================================================
// FUNCIÓN: CREAR HOJAS DE ESTIPENDIOS
// =============================================================================

/**
 * Crea todas las hojas necesarias para el sistema de estipendios
 * Llamar desde el menú: Estipendios → Instalar Sistema de Estipendios
 */
function instalarSistemaEstipendios() {
  try {
    SpreadsheetApp.getActiveSpreadsheet().toast('Instalando sistema de estipendios...', 'Instalación', 5);

    crearHojaPresupuestoCohortes();
    crearHojaEstipendios();
    crearHojaCalendarioPagos();
    crearHojaDashboardEstipendios();
    crearHojaAuditoriaEstipendios();

    SpreadsheetApp.getActiveSpreadsheet().toast('✅ Sistema de estipendios instalado correctamente', 'Éxito', 5);

    const ui = SpreadsheetApp.getUi();
    ui.alert(
      '✅ Instalación Completa',
      'Se han creado las siguientes hojas:\n\n' +
      '• Presupuesto Cohortes\n' +
      '• Estipendios\n' +
      '• Calendario Pagos\n' +
      '• Dashboard Estipendios\n' +
      '• Auditoría Estipendios\n\n' +
      'Ahora puedes:\n' +
      '1. Configurar presupuestos en "Presupuesto Cohortes"\n' +
      '2. Importar datos desde Kobo: Estipendios → Importar Desde Kobo',
      ui.ButtonSet.OK
    );

  } catch (error) {
    Logger.log('Error instalando sistema de estipendios: ' + error.message);
    SpreadsheetApp.getActiveSpreadsheet().toast('❌ Error: ' + error.message, 'Error', 10);
  }
}

/**
 * Crea la hoja "Presupuesto Cohortes"
 * Almacena información de presupuesto por cada cohorte
 */
function crearHojaPresupuestoCohortes() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(HOJAS_ESTIPENDIOS.PRESUPUESTO_COHORTES);

  if (!sheet) {
    sheet = ss.insertSheet(HOJAS_ESTIPENDIOS.PRESUPUESTO_COHORTES);
  } else {
    sheet.clear();
  }

  // Headers
  const headers = [
    'ID Cohorte',
    'Nombre Cohorte',
    'Año',
    'Programa',
    'Fecha Inicio',
    'Fecha Fin',
    '# Participantes Proyectado',
    '# Participantes Real',
    'Presupuesto Curso (Q)',
    'Presupuesto Prácticas (Q)',
    'Presupuesto Total (Q)',
    'Gastado a la Fecha (Q)',
    'Disponible (Q)',
    '% Ejecución',
    'Donador/Financiador',
    'Responsable',
    'Estado',
    'Notas'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Formato de headers
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#4285f4')
    .setFontColor('#ffffff')
    .setHorizontalAlignment('center');

  // Fórmulas en fila 2 (ejemplo)
  sheet.getRange('K2').setFormula('=I2+J2'); // Presupuesto Total
  sheet.getRange('L2').setFormula('=SUMIF(Estipendios!E:E,A2,Estipendios!H:H)'); // Gastado
  sheet.getRange('M2').setFormula('=K2-L2'); // Disponible
  sheet.getRange('N2').setFormula('=IF(K2>0,L2/K2,0)'); // % Ejecución

  // Formato de columnas
  sheet.setColumnWidth(1, 120);  // ID Cohorte
  sheet.setColumnWidth(2, 180);  // Nombre Cohorte
  sheet.setColumnWidth(3, 60);   // Año
  sheet.setColumnWidth(4, 150);  // Programa
  sheet.setColumnWidth(5, 100);  // Fecha Inicio
  sheet.setColumnWidth(6, 100);  // Fecha Fin

  // Formatos numéricos
  sheet.getRange('I:M').setNumberFormat('"Q"#,##0.00');
  sheet.getRange('N:N').setNumberFormat('0.00%');

  // Validaciones
  const estadosValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Activa', 'Finalizada', 'En Espera'])
    .setAllowInvalid(false)
    .build();
  sheet.getRange('Q2:Q1000').setDataValidation(estadosValidation);

  // Formato condicional para % Ejecución
  const regla1 = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThan(0.95)
    .setBackground('#ea4335')
    .setFontColor('#ffffff')
    .setRanges([sheet.getRange('N2:N1000')])
    .build();

  const regla2 = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberBetween(0.80, 0.95)
    .setBackground('#fbbc04')
    .setRanges([sheet.getRange('N2:N1000')])
    .build();

  const regla3 = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(0.80)
    .setBackground('#34a853')
    .setFontColor('#ffffff')
    .setRanges([sheet.getRange('N2:N1000')])
    .build();

  sheet.setConditionalFormatRules([regla1, regla2, regla3]);

  sheet.setFrozenRows(1);

  Logger.log('✅ Hoja "Presupuesto Cohortes" creada');
}

/**
 * Crea la hoja "Estipendios"
 * Almacena todos los pagos de estipendios realizados
 */
function crearHojaEstipendios() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(HOJAS_ESTIPENDIOS.ESTIPENDIOS);

  if (!sheet) {
    sheet = ss.insertSheet(HOJAS_ESTIPENDIOS.ESTIPENDIOS);
  } else {
    sheet.clear();
  }

  // Headers
  const headers = [
    'ID Pago',
    'Fecha Registro',
    'ID Participante',
    'Nombre Completo',
    'Cohorte',
    'Programa',
    'Tipo Estipendio',
    'Monto (Q)',
    'Fecha Programada',
    'Fecha Pago Real',
    'Estado',
    'Método Pago',
    'Banco/Cuenta',
    '# Recibo/Transacción',
    'Responsable Aprobó',
    'Responsable Entregó',
    'URL Foto Firma',
    'URL Foto Recibo',
    'GPS Ubicación',
    'Días Atraso',
    'Notas'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Formato de headers
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#0f9d58')
    .setFontColor('#ffffff')
    .setHorizontalAlignment('center');

  // Fórmulas en fila 2 (ejemplo)
  // Estado automático
  sheet.getRange('K2').setFormula('=IF(J2<>"","Pagado",IF(I2<TODAY(),"🔴 Atrasado","Programado"))');

  // Días atraso
  sheet.getRange('T2').setFormula('=IF(AND(K2<>"Pagado",I2<TODAY()),TODAY()-I2,0)');

  // Formato de columnas
  sheet.setColumnWidth(1, 120);  // ID Pago
  sheet.setColumnWidth(4, 180);  // Nombre Completo
  sheet.setColumnWidth(5, 150);  // Cohorte

  // Formatos numéricos
  sheet.getRange('H:H').setNumberFormat('"Q"#,##0.00');

  // Validaciones
  const tipoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Curso', 'Prácticas'])
    .setAllowInvalid(false)
    .build();
  sheet.getRange('G2:G1000').setDataValidation(tipoValidation);

  const metodoValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Efectivo', 'Transferencia', 'Cheque'])
    .setAllowInvalid(false)
    .build();
  sheet.getRange('L2:L1000').setDataValidation(metodoValidation);

  // Formato condicional para Estado
  const reglaEstado1 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains('Pagado')
    .setBackground('#d9ead3')
    .setRanges([sheet.getRange('K2:K1000')])
    .build();

  const reglaEstado2 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextContains('🔴')
    .setBackground('#f4cccc')
    .setRanges([sheet.getRange('K2:K1000')])
    .build();

  sheet.setConditionalFormatRules([reglaEstado1, reglaEstado2]);

  sheet.setFrozenRows(1);

  Logger.log('✅ Hoja "Estipendios" creada');
}

/**
 * Crea la hoja "Calendario Pagos"
 * Vista de calendario de pagos programados y realizados
 */
function crearHojaCalendarioPagos() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(HOJAS_ESTIPENDIOS.CALENDARIO_PAGOS);

  if (!sheet) {
    sheet = ss.insertSheet(HOJAS_ESTIPENDIOS.CALENDARIO_PAGOS);
  } else {
    sheet.clear();
  }

  // Headers
  const headers = [
    'Fecha',
    'Cohorte',
    '# Pagos Programados',
    'Monto Programado (Q)',
    '# Pagos Realizados',
    'Monto Pagado (Q)',
    '% Cumplimiento',
    'Estado'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Formato de headers
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#f4b400')
    .setFontColor('#ffffff')
    .setHorizontalAlignment('center');

  // Instrucciones
  sheet.getRange('A3').setValue('INSTRUCCIONES:');
  sheet.getRange('A4').setValue('Esta hoja se actualiza automáticamente desde los datos de "Estipendios"');
  sheet.getRange('A5').setValue('Para ver el calendario actualizado, ejecuta: Estipendios → Actualizar Calendario');

  sheet.setFrozenRows(1);

  Logger.log('✅ Hoja "Calendario Pagos" creada');
}

/**
 * Crea la hoja "Dashboard Estipendios"
 * Dashboard con KPIs y métricas clave
 */
function crearHojaDashboardEstipendios() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(HOJAS_ESTIPENDIOS.DASHBOARD_RESUMEN);

  if (!sheet) {
    sheet = ss.insertSheet(HOJAS_ESTIPENDIOS.DASHBOARD_RESUMEN);
  } else {
    sheet.clear();
  }

  // Título
  sheet.getRange('A1:H1').merge();
  sheet.getRange('A1').setValue('📊 DASHBOARD DE ESTIPENDIOS - RESUMEN EJECUTIVO');
  sheet.getRange('A1').setFontSize(16).setFontWeight('bold')
    .setBackground('#4285f4').setFontColor('#ffffff')
    .setHorizontalAlignment('center');

  // KPIs Globales
  sheet.getRange('A3').setValue('KPIs GLOBALES').setFontWeight('bold')
    .setBackground('#e8eaf6').setFontSize(12);

  const kpis = [
    ['KPI', 'Valor', 'Fórmula'],
    ['Total Presupuestado', '', '=SUM(\'Presupuesto Cohortes\'!K:K)'],
    ['Total Gastado', '', '=SUMIF(Estipendios!K:K,"Pagado",Estipendios!H:H)'],
    ['Total Disponible', '', '=B5-B6'],
    ['% Ejecución Global', '', '=IF(B5>0,B6/B5,0)'],
    ['# Cohortes Activas', '', '=COUNTIF(\'Presupuesto Cohortes\'!Q:Q,"Activa")'],
    ['# Participantes Beneficiadas', '', '=COUNTA(UNIQUE(FILTER(Estipendios!C:C,Estipendios!C:C<>"")))'],
    ['Total Pagos Realizados', '', '=COUNTIF(Estipendios!K:K,"Pagado")'],
    ['Promedio por Participante', '', '=IF(B9>0,B6/B9,0)'],
    ['Tiempo Promedio Pago (días)', '', '=IF(COUNTIF(Estipendios!K:K,"Pagado")>0,AVERAGE(Estipendios!T:T),0)'],
    ['Pagos Pendientes', '', '=COUNTIF(Estipendios!K:K,"Programado")'],
    ['Monto Pendiente', '', '=SUMIF(Estipendios!K:K,"Programado",Estipendios!H:H)'],
    ['Pagos Atrasados', '', '=COUNTIF(Estipendios!K:K,"*Atrasado*")'],
    ['Monto Atrasado', '', '=SUMIF(Estipendios!K:K,"*Atrasado*",Estipendios!H:H)']
  ];

  sheet.getRange(4, 1, kpis.length, kpis[0].length).setValues(kpis);

  // Aplicar fórmulas
  for (let i = 1; i < kpis.length; i++) {
    sheet.getRange(4 + i, 2).setFormula(kpis[i][2]);
  }

  // Formato
  sheet.getRange('A4:C4').setFontWeight('bold').setBackground('#d9d9d9');
  sheet.getRange('B5:B17').setNumberFormat('"Q"#,##0.00');
  sheet.getRange('B8').setNumberFormat('0.00%');

  // Resumen por Cohorte
  sheet.getRange('E3').setValue('RESUMEN POR COHORTE').setFontWeight('bold')
    .setBackground('#e8eaf6').setFontSize(12);

  const headersCoh = [
    ['Cohorte', 'Presupuesto', 'Gastado', 'Disponible', '% Ejec', '# Pagos', 'Estado']
  ];
  sheet.getRange(4, 5, 1, headersCoh[0].length).setValues(headersCoh);
  sheet.getRange('E4:K4').setFontWeight('bold').setBackground('#d9d9d9');

  // Instrucción
  sheet.getRange('E5').setValue('Ejecuta: Estipendios → Actualizar Dashboard para ver datos');

  // Ajustar columnas
  sheet.setColumnWidths(1, 3, 200);
  sheet.setColumnWidths(5, 7, 120);

  sheet.setFrozenRows(4);

  Logger.log('✅ Hoja "Dashboard Estipendios" creada');
}

/**
 * Crea la hoja "Auditoría Estipendios"
 * Registro de todas las acciones realizadas en el sistema
 */
function crearHojaAuditoriaEstipendios() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(HOJAS_ESTIPENDIOS.AUDITORIA_ESTIPENDIOS);

  if (!sheet) {
    sheet = ss.insertSheet(HOJAS_ESTIPENDIOS.AUDITORIA_ESTIPENDIOS);
  } else {
    sheet.clear();
  }

  // Headers
  const headers = [
    'Fecha/Hora',
    'Usuario',
    'Acción',
    'Hoja',
    'Registro ID',
    'Campo',
    'Valor Anterior',
    'Valor Nuevo'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Formato de headers
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#9e9e9e')
    .setFontColor('#ffffff')
    .setHorizontalAlignment('center');

  sheet.setColumnWidth(1, 150);
  sheet.setColumnWidth(2, 200);
  sheet.setColumnWidth(3, 150);

  sheet.setFrozenRows(1);

  Logger.log('✅ Hoja "Auditoría Estipendios" creada');
}

// =============================================================================
// FUNCIÓN: IMPORTAR DESDE KOBO
// =============================================================================

/**
 * Importa datos de estipendios desde el formulario Kobo
 * Mapea los campos del formulario a la estructura de Estipendios
 */
function importarEstipendiosDesdeKobo() {
  try {
    SpreadsheetApp.getActiveSpreadsheet().toast('Importando datos desde Kobo...', 'Importación', 5);

    const config = typeof CONFIG_AB !== 'undefined' ? CONFIG_AB : CONFIG_TECH;
    const koboUrl = config.KOBO_ESTIPENDIOS_URL || config.KOBO_URL;

    if (!koboUrl) {
      throw new Error('No se ha configurado la URL de Kobo para estipendios');
    }

    // Obtener token si existe
    const token = config.KOBO_TOKEN || '';
    const options = {};

    if (token) {
      options.headers = {
        'Authorization': `Token ${token}`
      };
    }

    // Fetch datos
    Logger.log('📡 Conectando a Kobo: ' + koboUrl);
    const response = UrlFetchApp.fetch(koboUrl, options);
    const csv = response.getContentText();

    if (!csv || csv.trim().length === 0) {
      throw new Error('No se obtuvieron datos de Kobo');
    }

    // Parsear CSV
    const data = Utilities.parseCsv(csv);
    if (data.length <= 1) {
      throw new Error('El CSV no contiene datos (solo headers)');
    }

    Logger.log(`✅ ${data.length - 1} registros obtenidos desde Kobo`);

    // Obtener headers
    const headers = data[0];
    const filas = data.slice(1);

    // Mapear campos (según tu formulario Kobo)
    const mapeo = {
      'Creamos_ID': 2,          // ID Participante
      'Nombre_s': 3,            // Nombre
      'Apellido_s': 3,          // Apellido (se concatena con nombre)
      'Fecha': 8,               // Fecha Pago
      'Proyecto': 5,            // Programa
      'Especialidad': 4,        // Cohorte
      'Fase': 6,                // Tipo Estipendio
      'Monto_total': 7,         // Monto
      'Comentarios': 20,        // Notas
      'Firma': 16,              // URL Firma
      '_submission_time': 1     // Fecha Registro
    };

    // Obtener índices de columnas en el CSV
    const indices = {};
    Object.keys(mapeo).forEach(campo => {
      indices[campo] = headers.indexOf(campo);
    });

    // Procesar datos
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetEstipendios = ss.getSheetByName(HOJAS_ESTIPENDIOS.ESTIPENDIOS);

    if (!sheetEstipendios) {
      throw new Error('La hoja "Estipendios" no existe. Ejecuta primero: Estipendios → Instalar Sistema');
    }

    let nuevosRegistros = 0;

    filas.forEach((fila, index) => {
      try {
        // Extraer datos
        const creamosID = indices['Creamos_ID'] >= 0 ? fila[indices['Creamos_ID']] : '';
        const nombre = indices['Nombre_s'] >= 0 ? fila[indices['Nombre_s']] : '';
        const apellido = indices['Apellido_s'] >= 0 ? fila[indices['Apellido_s']] : '';
        const fecha = indices['Fecha'] >= 0 ? fila[indices['Fecha']] : '';
        const proyecto = indices['Proyecto'] >= 0 ? fila[indices['Proyecto']] : '';
        const especialidad = indices['Especialidad'] >= 0 ? fila[indices['Especialidad']] : '';
        const fase = indices['Fase'] >= 0 ? fila[indices['Fase']] : '';
        const monto = indices['Monto_total'] >= 0 ? fila[indices['Monto_total']] : '';
        const comentarios = indices['Comentarios'] >= 0 ? fila[indices['Comentarios']] : '';
        const firma = indices['Firma'] >= 0 ? fila[indices['Firma']] : '';
        const submissionTime = indices['_submission_time'] >= 0 ? fila[indices['_submission_time']] : '';

        if (!creamosID) return; // Saltar si no hay ID

        // Mapear Fase → Tipo Estipendio
        let tipoEstipendio = '';
        if (fase === 'Teórica') tipoEstipendio = 'Curso';
        else if (fase === 'Práctica' || fase === 'Formación Dual') tipoEstipendio = 'Prácticas';

        // Determinar cohorte
        const año = new Date().getFullYear();
        const cohorte = determinarCohorteDesdeEspecialidad(especialidad, año);

        // Generar ID Pago
        const añoPago = fecha ? new Date(fecha).getFullYear() : año;
        const ultimaFila = sheetEstipendios.getLastRow();
        const idPago = `EST-${añoPago}-${String(ultimaFila).padStart(4, '0')}`;

        // Nombre completo
        const nombreCompleto = `${nombre} ${apellido}`.trim();

        // Verificar si ya existe (por ID Participante + Fecha)
        const dataExistente = sheetEstipendios.getDataRange().getValues();
        const existe = dataExistente.some((row, i) =>
          i > 0 && row[2] === creamosID && row[9] && new Date(row[9]).getTime() === new Date(fecha).getTime()
        );

        if (existe) {
          Logger.log(`⏭️ Registro ya existe: ${creamosID} - ${fecha}`);
          return;
        }

        // Agregar registro
        const nuevoRegistro = [
          idPago,                    // A: ID Pago
          submissionTime || new Date(), // B: Fecha Registro
          creamosID,                 // C: ID Participante
          nombreCompleto,            // D: Nombre Completo
          cohorte,                   // E: Cohorte
          proyecto,                  // F: Programa
          tipoEstipendio,            // G: Tipo Estipendio
          parseFloat(monto) || 0,    // H: Monto
          fecha,                     // I: Fecha Programada
          fecha,                     // J: Fecha Pago Real
          '',                        // K: Estado (fórmula)
          'Efectivo',                // L: Método Pago
          '',                        // M: Banco/Cuenta
          '',                        // N: # Recibo
          '',                        // O: Responsable Aprobó
          '',                        // P: Responsable Entregó
          firma,                     // Q: URL Firma
          '',                        // R: URL Recibo
          '',                        // S: GPS
          '',                        // T: Días Atraso (fórmula)
          comentarios                // U: Notas
        ];

        sheetEstipendios.appendRow(nuevoRegistro);
        nuevosRegistros++;

        // Registrar en auditoría
        registrarAuditoriaEstipendios('Importación Kobo', 'Estipendios', idPago);

      } catch (error) {
        Logger.log(`⚠️ Error procesando fila ${index}: ${error.message}`);
      }
    });

    Logger.log(`✅ ${nuevosRegistros} nuevos registros importados`);

    // Actualizar KPIs
    calcularKPIsEstipendios();

    SpreadsheetApp.getActiveSpreadsheet().toast(
      `✅ Importación completa: ${nuevosRegistros} nuevos registros`,
      'Éxito',
      5
    );

  } catch (error) {
    Logger.log('❌ Error en importación: ' + error.message);
    SpreadsheetApp.getActiveSpreadsheet().toast('❌ Error: ' + error.message, 'Error', 10);
    throw error;
  }
}

/**
 * Determina la cohorte basándose en la especialidad
 */
function determinarCohorteDesdeEspecialidad(especialidad, año) {
  const mapeo = {
    'Gastronomía': `Cocina-${año}`,
    'Barismo': `Barismo-${año}`,
    'Programación': `SAC-${año}`,
    'Marketing': `Marketing-${año}`,
    'Carpinteria': `Carpintería-${año}`,
    'Fotovoltaico-Electricidad': `Electricidad-${año}`,
    'Mecánica': `Mecánica-${año}`
  };

  return mapeo[especialidad] || `${especialidad}-${año}`;
}

// =============================================================================
// FUNCIÓN: CALCULAR KPIs
// =============================================================================

/**
 * Calcula todos los KPIs automáticamente
 * Se ejecuta después de cada importación
 */
function calcularKPIsEstipendios() {
  try {
    Logger.log('📊 Calculando KPIs...');

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetEstipendios = ss.getSheetByName(HOJAS_ESTIPENDIOS.ESTIPENDIOS);
    const sheetPresupuesto = ss.getSheetByName(HOJAS_ESTIPENDIOS.PRESUPUESTO_COHORTES);
    const sheetDashboard = ss.getSheetByName(HOJAS_ESTIPENDIOS.DASHBOARD_RESUMEN);

    if (!sheetEstipendios || !sheetDashboard) {
      Logger.log('⚠️ Hojas no encontradas para calcular KPIs');
      return;
    }

    // Las fórmulas ya están en el dashboard, solo forzamos recálculo
    SpreadsheetApp.flush();

    // Actualizar resumen por cohorte
    if (sheetPresupuesto) {
      actualizarResumenPorCohorte(sheetPresupuesto, sheetEstipendios, sheetDashboard);
    }

    Logger.log('✅ KPIs actualizados');

  } catch (error) {
    Logger.log('❌ Error calculando KPIs: ' + error.message);
  }
}

/**
 * Actualiza el resumen por cohorte en el dashboard
 */
function actualizarResumenPorCohorte(sheetPresupuesto, sheetEstipendios, sheetDashboard) {
  const cohortes = sheetPresupuesto.getDataRange().getValues().slice(1);
  const estipendios = sheetEstipendios.getDataRange().getValues().slice(1);

  const resumen = [['Cohorte', 'Presupuesto', 'Gastado', 'Disponible', '% Ejec', '# Pagos', 'Estado']];

  cohortes.forEach(cohorte => {
    const idCohorte = cohorte[0];
    if (!idCohorte) return;

    const presupuestoTotal = cohorte[10] || 0;
    const gastado = estipendios
      .filter(e => e[4] === idCohorte && e[10] === 'Pagado')
      .reduce((sum, e) => sum + (parseFloat(e[7]) || 0), 0);
    const disponible = presupuestoTotal - gastado;
    const pctEjec = presupuestoTotal > 0 ? gastado / presupuestoTotal : 0;
    const numPagos = estipendios.filter(e => e[4] === idCohorte).length;
    const estado = pctEjec > 0.95 ? '🔴' : pctEjec > 0.80 ? '🟡' : '🟢';

    resumen.push([
      cohorte[1],  // Nombre Cohorte
      presupuestoTotal,
      gastado,
      disponible,
      pctEjec,
      numPagos,
      estado
    ]);
  });

  if (resumen.length > 1) {
    const rangoInicio = sheetDashboard.getRange('E4');
    sheetDashboard.getRange(5, 5, sheetDashboard.getLastRow() - 4, 7).clear();
    sheetDashboard.getRange(5, 5, resumen.length - 1, 7).setValues(resumen.slice(1));

    // Formato
    sheetDashboard.getRange(5, 6, resumen.length - 1, 4).setNumberFormat('"Q"#,##0.00');
    sheetDashboard.getRange(5, 9, resumen.length - 1, 1).setNumberFormat('0.00%');
  }
}

// =============================================================================
// FUNCIÓN: VERIFICAR PRESUPUESTO Y ALERTAS
// =============================================================================

/**
 * Verifica estado de presupuestos y genera alertas
 * Se ejecuta periódicamente (cada 6 horas vía trigger)
 */
function verificarPresupuestoEstipendios() {
  try {
    Logger.log('🔍 Verificando presupuestos...');

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetPresupuesto = ss.getSheetByName(HOJAS_ESTIPENDIOS.PRESUPUESTO_COHORTES);
    const sheetEstipendios = ss.getSheetByName(HOJAS_ESTIPENDIOS.ESTIPENDIOS);

    if (!sheetPresupuesto || !sheetEstipendios) {
      Logger.log('⚠️ Hojas no encontradas');
      return;
    }

    const cohortes = sheetPresupuesto.getDataRange().getValues().slice(1);
    const estipendios = sheetEstipendios.getDataRange().getValues().slice(1);

    const alertas = [];

    cohortes.forEach(cohorte => {
      const idCohorte = cohorte[0];
      const nombreCohorte = cohorte[1];
      const presupuestoTotal = cohorte[10] || 0;

      if (!idCohorte || presupuestoTotal === 0) return;

      // Calcular gastado
      const gastado = estipendios
        .filter(e => e[4] === idCohorte && e[10] === 'Pagado')
        .reduce((sum, e) => sum + (parseFloat(e[7]) || 0), 0);

      const pctGastado = (gastado / presupuestoTotal) * 100;

      // Alerta si > 80%
      if (pctGastado > 80) {
        alertas.push({
          tipo: 'presupuesto',
          cohorte: nombreCohorte,
          presupuesto: presupuestoTotal,
          gastado: gastado,
          porcentaje: pctGastado,
          nivel: pctGastado > 95 ? 'CRÍTICO' : 'ADVERTENCIA'
        });
      }

      // Verificar pagos atrasados
      const pagosAtrasados = estipendios.filter(e =>
        e[4] === idCohorte && String(e[10]).includes('🔴')
      );

      if (pagosAtrasados.length > 0) {
        const maxDias = Math.max(...pagosAtrasados.map(e => parseFloat(e[19]) || 0));
        alertas.push({
          tipo: 'atrasados',
          cohorte: nombreCohorte,
          cantidad: pagosAtrasados.length,
          dias: maxDias
        });
      }
    });

    // Enviar alertas si hay
    if (alertas.length > 0) {
      enviarAlertasEstipendios(alertas);
      Logger.log(`⚠️ ${alertas.length} alertas generadas`);
    } else {
      Logger.log('✅ No hay alertas');
    }

  } catch (error) {
    Logger.log('❌ Error verificando presupuesto: ' + error.message);
  }
}

/**
 * Envía alertas por email
 */
function enviarAlertasEstipendios(alertas) {
  try {
    const config = typeof CONFIG_AB !== 'undefined' ? CONFIG_AB : CONFIG_TECH;
    const emailDestinatarios = config.EMAIL_ALERTAS_ESTIPENDIOS || Session.getActiveUser().getEmail();

    let mensaje = '<h2>🚨 Alertas del Sistema de Estipendios</h2>';
    mensaje += '<p>Fecha: ' + new Date().toLocaleDateString() + '</p>';
    mensaje += '<hr>';

    alertas.forEach(alerta => {
      if (alerta.tipo === 'presupuesto') {
        const color = alerta.nivel === 'CRÍTICO' ? '#ea4335' : '#fbbc04';
        mensaje += `<div style="padding:15px; background-color:${color}; color:white; margin:10px 0; border-radius:5px;">`;
        mensaje += `<strong>${alerta.nivel}</strong><br>`;
        mensaje += `Cohorte: ${alerta.cohorte}<br>`;
        mensaje += `Presupuesto: Q${alerta.presupuesto.toFixed(2)}<br>`;
        mensaje += `Gastado: Q${alerta.gastado.toFixed(2)} (${alerta.porcentaje.toFixed(1)}%)<br>`;
        mensaje += `Disponible: Q${(alerta.presupuesto - alerta.gastado).toFixed(2)}`;
        mensaje += '</div>';
      } else if (alerta.tipo === 'atrasados') {
        mensaje += '<div style="padding:15px; background-color:#fbbc04; margin:10px 0; border-radius:5px;">';
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
      to: emailDestinatarios,
      subject: '🚨 Alertas Sistema Estipendios - ' + new Date().toLocaleDateString(),
      htmlBody: mensaje
    });

    Logger.log('✅ Alertas enviadas por email');

  } catch (error) {
    Logger.log('❌ Error enviando alertas: ' + error.message);
  }
}

// =============================================================================
// FUNCIÓN: EXPORTAR PARA POWER BI
// =============================================================================

/**
 * Genera archivo optimizado para Power BI
 * Consolida datos de múltiples hojas en una tabla plana
 */
function exportarParaPowerBI() {
  try {
    SpreadsheetApp.getActiveSpreadsheet().toast('Generando exportación para Power BI...', 'Exportación', 5);

    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Crear hoja temporal
    let sheetExport = ss.getSheetByName('EXPORT_PowerBI');
    if (sheetExport) {
      ss.deleteSheet(sheetExport);
    }
    sheetExport = ss.insertSheet('EXPORT_PowerBI');

    // Headers consolidados
    const headers = [
      'ID Pago',
      'Fecha Pago',
      'Año',
      'Mes',
      'ID Participante',
      'Nombre',
      'Cohorte',
      'Programa',
      'Tipo Estipendio',
      'Monto',
      'Estado',
      'Método Pago',
      'Responsable',
      'Presupuesto Cohorte',
      'Donador'
    ];

    const datosConsolidados = [headers];

    // Obtener datos
    const estipendios = ss.getSheetByName(HOJAS_ESTIPENDIOS.ESTIPENDIOS).getDataRange().getValues().slice(1);
    const presupuestos = ss.getSheetByName(HOJAS_ESTIPENDIOS.PRESUPUESTO_COHORTES).getDataRange().getValues().slice(1);

    // Crear diccionario de presupuestos
    const dictPresupuestos = {};
    presupuestos.forEach(p => {
      dictPresupuestos[p[0]] = {
        presupuesto: p[10],
        donador: p[14]
      };
    });

    // Consolidar
    estipendios.forEach(e => {
      const fechaPago = e[9] ? new Date(e[9]) : new Date();
      const cohorte = e[4];
      const presupuesto = dictPresupuestos[cohorte] || {};

      datosConsolidados.push([
        e[0],  // ID Pago
        fechaPago,
        fechaPago.getFullYear(),
        obtenerNombreMes(fechaPago.getMonth()),
        e[2],  // ID Participante
        e[3],  // Nombre
        e[4],  // Cohorte
        e[5],  // Programa
        e[6],  // Tipo
        e[7],  // Monto
        e[10], // Estado
        e[11], // Método
        e[15], // Responsable
        presupuesto.presupuesto || 0,
        presupuesto.donador || ''
      ]);
    });

    // Escribir datos
    sheetExport.getRange(1, 1, datosConsolidados.length, datosConsolidados[0].length)
      .setValues(datosConsolidados);

    // Formato
    sheetExport.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#4285f4')
      .setFontColor('#ffffff');

    SpreadsheetApp.getActiveSpreadsheet().toast(
      '✅ Datos exportados a la hoja "EXPORT_PowerBI"\n\nPuedes conectar Power BI directamente a esta hoja o descargar como Excel.',
      'Éxito',
      10
    );

    // Activar la hoja
    sheetExport.activate();

  } catch (error) {
    Logger.log('❌ Error exportando: ' + error.message);
    SpreadsheetApp.getActiveSpreadsheet().toast('❌ Error: ' + error.message, 'Error', 10);
  }
}

/**
 * Obtiene nombre del mes
 */
function obtenerNombreMes(mes) {
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return meses[mes];
}

// =============================================================================
// FUNCIÓN: AUDITORÍA
// =============================================================================

/**
 * Registra acciones en la hoja de auditoría
 */
function registrarAuditoriaEstipendios(accion, hoja, registroID, campo, valorAnterior, valorNuevo) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetAuditoria = ss.getSheetByName(HOJAS_ESTIPENDIOS.AUDITORIA_ESTIPENDIOS);

    if (!sheetAuditoria) return;

    const nuevaFila = [
      new Date(),
      Session.getActiveUser().getEmail(),
      accion,
      hoja,
      registroID || '',
      campo || '',
      valorAnterior || '',
      valorNuevo || ''
    ];

    sheetAuditoria.appendRow(nuevaFila);

  } catch (error) {
    Logger.log('⚠️ Error registrando auditoría: ' + error.message);
  }
}

// =============================================================================
// FUNCIÓN: ACTUALIZAR DASHBOARD
// =============================================================================

/**
 * Actualiza el dashboard manualmente
 * Fuerza recálculo de todas las fórmulas y resúmenes
 */
function actualizarDashboardEstipendios() {
  try {
    SpreadsheetApp.getActiveSpreadsheet().toast('Actualizando dashboard...', 'Actualización', 3);

    calcularKPIsEstipendios();

    SpreadsheetApp.getActiveSpreadsheet().toast('✅ Dashboard actualizado', 'Éxito', 3);

  } catch (error) {
    Logger.log('❌ Error actualizando dashboard: ' + error.message);
    SpreadsheetApp.getActiveSpreadsheet().toast('❌ Error: ' + error.message, 'Error', 5);
  }
}

// =============================================================================
// FUNCIÓN: CONFIGURAR TRIGGERS AUTOMÁTICOS
// =============================================================================

/**
 * Configura triggers para ejecución automática
 */
function configurarTriggersEstipendios() {
  try {
    // Eliminar triggers existentes de estipendios
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => {
      const functionName = trigger.getHandlerFunction();
      if (functionName.includes('Estipendios') || functionName.includes('estipendios')) {
        ScriptApp.deleteTrigger(trigger);
      }
    });

    // 1. Importar cada hora
    ScriptApp.newTrigger('importarEstipendiosDesdeKobo')
      .timeBased()
      .everyHours(1)
      .create();

    // 2. Verificar presupuesto cada 6 horas
    ScriptApp.newTrigger('verificarPresupuestoEstipendios')
      .timeBased()
      .everyHours(6)
      .create();

    // 3. Exportar para Power BI diariamente a las 6 AM
    ScriptApp.newTrigger('exportarParaPowerBI')
      .timeBased()
      .atHour(6)
      .everyDays(1)
      .create();

    Logger.log('✅ Triggers de estipendios configurados');

    SpreadsheetApp.getUi().alert(
      '✅ Triggers Configurados',
      'Se han activado los siguientes procesos automáticos:\n\n' +
      '• Importación desde Kobo: Cada hora\n' +
      '• Verificación de presupuesto: Cada 6 horas\n' +
      '• Exportación Power BI: Diario a las 6:00 AM\n\n' +
      'Recibirás alertas por email si hay problemas presupuestarios.',
      SpreadsheetApp.getUi().ButtonSet.OK
    );

  } catch (error) {
    Logger.log('❌ Error configurando triggers: ' + error.message);
    SpreadsheetApp.getUi().alert('Error: ' + error.message);
  }
}

/**
 * Desinstala los triggers automáticos
 */
function desinstalarTriggersEstipendios() {
  try {
    const triggers = ScriptApp.getProjectTriggers();
    let count = 0;

    triggers.forEach(trigger => {
      const functionName = trigger.getHandlerFunction();
      if (functionName.includes('Estipendios') || functionName.includes('estipendios')) {
        ScriptApp.deleteTrigger(trigger);
        count++;
      }
    });

    Logger.log(`✅ ${count} triggers eliminados`);

    SpreadsheetApp.getUi().alert(
      '✅ Triggers Desinstalados',
      `Se han desactivado ${count} procesos automáticos de estipendios.\n\n` +
      'Ahora deberás ejecutar las funciones manualmente desde el menú.',
      SpreadsheetApp.getUi().ButtonSet.OK
    );

  } catch (error) {
    Logger.log('❌ Error desinstalando triggers: ' + error.message);
  }
}

// =============================================================================
// INTEGRACIÓN AL MENÚ PRINCIPAL
// =============================================================================

/**
 * INSTRUCCIÓN: Agregar estas líneas al menú principal (función setupMenuAB o setupMenuTech)
 *
 * Agregar ANTES del .addToUi():
 *
 *   .addSeparator()
 *   .addSubMenu(ui.createMenu('💰 Estipendios')
 *     .addItem('🚀 Instalar Sistema de Estipendios', 'instalarSistemaEstipendios')
 *     .addSeparator()
 *     .addItem('📥 Importar Desde Kobo', 'importarEstipendiosDesdeKobo')
 *     .addItem('🔄 Actualizar Dashboard', 'actualizarDashboardEstipendios')
 *     .addSeparator()
 *     .addItem('📊 Exportar para Power BI', 'exportarParaPowerBI')
 *     .addSeparator()
 *     .addItem('⚙️ Configurar Actualización Automática', 'configurarTriggersEstipendios')
 *     .addItem('🛑 Desactivar Actualización Automática', 'desinstalarTriggersEstipendios')
 *     .addSeparator()
 *     .addItem('🔍 Verificar Presupuestos Ahora', 'verificarPresupuestoEstipendios'))
 *
 */

/**
 * Función de prueba para verificar que el módulo se cargó correctamente
 */
function verificarModuloEstipendios() {
  Logger.log('✅ Módulo de Estipendios cargado correctamente');
  Logger.log('Hojas configuradas:');
  Logger.log('- ' + HOJAS_ESTIPENDIOS.PRESUPUESTO_COHORTES);
  Logger.log('- ' + HOJAS_ESTIPENDIOS.ESTIPENDIOS);
  Logger.log('- ' + HOJAS_ESTIPENDIOS.CALENDARIO_PAGOS);
  Logger.log('- ' + HOJAS_ESTIPENDIOS.DASHBOARD_RESUMEN);
  Logger.log('- ' + HOJAS_ESTIPENDIOS.AUDITORIA_ESTIPENDIOS);

  SpreadsheetApp.getUi().alert(
    '✅ Módulo de Estipendios Verificado',
    'El módulo está correctamente cargado y listo para usar.\n\n' +
    'Para instalar, ejecuta:\nEstipendios → Instalar Sistema de Estipendios',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

// =============================================================================
// FIN DEL MÓDULO DE ESTIPENDIOS
// =============================================================================

/**
 * INSTRUCCIONES FINALES:
 *
 * 1. COPIAR todo este archivo
 *
 * 2. PEGAR al final de AlimentosBebidas.gs (antes del último })
 *
 * 3. PEGAR al final de tech.gs (antes del último })
 *
 * 4. ACTUALIZAR el CONFIG agregando:
 *    KOBO_ESTIPENDIOS_URL: 'https://kf.kobotoolbox.org/api/v2/assets/.../data.csv'
 *    KOBO_TOKEN: '64cc018b88067397addd36b09288be8b6539cf39'
 *    EMAIL_ALERTAS_ESTIPENDIOS: 'tu_email@example.com'
 *
 * 5. AGREGAR al menú las líneas indicadas arriba
 *
 * 6. GUARDAR y refrescar la hoja
 *
 * 7. EJECUTAR: Estipendios → Instalar Sistema de Estipendios
 *
 * 8. CONFIGURAR presupuestos en la hoja "Presupuesto Cohortes"
 *
 * 9. EJECUTAR: Estipendios → Importar Desde Kobo
 *
 * 10. ACTIVAR triggers: Estipendios → Configurar Actualización Automática
 *
 * ¡LISTO! El sistema de estipendios estará funcionando automáticamente.
 */
