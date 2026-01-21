/**
 * =====================================================================
 * SISTEMA DE INCLUSIÓN LABORAL - ÁREA DE TECNOLOGÍA
 * =====================================================================
 *
 * CAMBIOS EN ESTA VERSIÓN:
 * - Hoja Entrevistas: "Programa" → "Cohorte a Enviar"
 * - Hoja Entrevistas: "Estado" → "Fase de Entrevista"
 * - Hoja Entrevistas: Eliminada "Fecha Seguimiento"
 * - Hoja Entrevistas: Agregada columna "Enviar" al final
 * - Unificada "No Interesados" + "No Seleccionadas" en una sola hoja
 * - Conexión con KoboToolbox para importar datos automáticamente
 *
 * COHORTES DISPONIBLES:
 * - SAC Cohorte I
 * - SAC Cohorte II
 * - Computación Cohorte I
 *
 * =====================================================================
 */

// =====================================================================
// CONFIGURACIÓN GLOBAL
// =====================================================================

const CONFIG = {
  // URL de KoboToolbox para importar datos
  KOBO_URL: 'https://kf.kobotoolbox.org/api/v2/assets/akz5K2bGfvvisQaE7VaHev/export-settings/esLPozzAX85W2xSv98r2AVM/data.csv',

  // Cohortes disponibles
  COHORTES: [
    'SAC Cohorte I',
    'SAC Cohorte II',
    'Computación Cohorte I',
    'Por definir'
  ],

  // Responsables del programa
  RESPONSABLES: [
    'Adrian Torres',
    'Paola Ortiz'
  ],

  // Niveles educativos
  NIVELES_EDUCATIVOS: [
    'Primaria incompleta',
    'Primaria completa',
    'Básicos incompletos',
    'Básicos completos',
    'Diversificado incompleto',
    'Diversificado completo',
    'Universitario incompleto',
    'Universitario completo',
    'Técnico',
    'Otro'
  ],

  // Zonas de Guatemala
  ZONAS: [
    'Zona 1', 'Zona 2', 'Zona 3', 'Zona 4', 'Zona 5',
    'Zona 6', 'Zona 7', 'Zona 8', 'Zona 9', 'Zona 10',
    'Zona 11', 'Zona 12', 'Zona 13', 'Zona 14', 'Zona 15',
    'Zona 16', 'Zona 17', 'Zona 18', 'Zona 19', 'Zona 21',
    'Zona 24', 'Zona 25',
    'Mixco', 'Villa Nueva', 'San Miguel Petapa', 'Villa Canales',
    'Santa Catarina Pinula', 'San José Pinula', 'Chinautla',
    'Fraijanes', 'Amatitlán', 'Palencia', 'San Pedro Ayampuc',
    'San Juan Sacatepéquez', 'San Raymundo', 'Chuarrancho',
    'San Pedro Sacatepéquez', 'Otro departamento'
  ],

  // Motivos de deserción
  MOTIVOS_DESERCION: [
    'Otras prioridades',
    'Horario laboral',
    'Retos/problemas familiares',
    'Violencia de género',
    'Migración',
    'Embarazo',
    'Problemas de salud física',
    'Problemas de salud mental',
    'Problemas legales',
    'Falta de apoyo',
    'Compromisos religiosos',
    'Problemas financieros',
    'Violencia comunitaria',
    'Falta de motivación',
    'No desea continuar',
    'Descontento con el programa',
    'Falta de comunicación',
    'Falta de interés',
    'Fallecimiento',
    'Cuidado de terceras personas',
    'Falta de adaptabilidad',
    'Consiguió empleo',
    'Problemas de transporte',
    'Otro'
  ],

  // Motivos de no selección
  MOTIVOS_NO_SELECCION: [
    'No le interesa el área de tecnología',
    'Horarios no compatibles',
    'Ubicación no conveniente',
    'Ya tiene otro programa',
    'Consiguió empleo',
    'Cambio de planes',
    'Problemas personales',
    'No cumple requisitos',
    'Sin respuesta después de contacto',
    'Número equivocado/no válido',
    'No aprobó entrevista',
    'No asistió a entrevista',
    'Documentación incompleta',
    'Otro'
  ],

  // Fases de entrevista (antes "Estados")
  FASES_ENTREVISTA: [
    'Pendiente',
    'Agendada',
    'Realizada - Aprobada',
    'Realizada - No aprobada',
    'No asistió',
    'Reprogramada',
    'Cancelada'
  ],

  // Estados de participante en cohorte
  ESTADOS_PARTICIPANTE: [
    'Activa',
    'En pausa',
    'Graduada',
    'Deserción',
    'Baja temporal'
  ],

  // Estados de seguimiento (graduadas)
  ESTADOS_SEGUIMIENTO: [
    'Empleada - Área tecnología',
    'Empleada - Otra área',
    'Emprendimiento propio',
    'Buscando empleo',
    'Continuando estudios',
    'Sin seguimiento',
    'No contactable'
  ]
};

// =====================================================================
// MENÚ PRINCIPAL
// =====================================================================

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🎓 Inclusión Laboral')
    .addItem('🚀 Instalar Sistema', 'instalarSistema')
    .addItem('✅ Verificar Instalación', 'verificarInstalacion')
    .addSeparator()
    .addSubMenu(ui.createMenu('📥 Importar Datos')
      .addItem('📋 Importar desde KoboToolbox', 'importarDesdeKobo')
      .addItem('🔗 Configurar URL de Kobo', 'configurarKoboURL')
      .addItem('🔍 Probar Conexión Kobo', 'probarConexionKobo')
      .addItem('📊 Ver Columnas Tech', 'verColumnasKobo')
      .addItem('🔄 Importación Automática', 'configurarImportacionAutomatica'))
    .addSeparator()
    .addSubMenu(ui.createMenu('📋 Gestión de Cohortes')
      .addItem('➕ Crear Nueva Cohorte', 'crearNuevaCohorte')
      .addItem('📝 Ver/Editar Cohortes', 'verCohortes')
      .addItem('📊 Estadísticas por Cohorte', 'estadisticasCohorte')
      .addItem('👥 Enviar Participantes a Cohorte', 'enviarParticipantesACohorte'))
    .addSeparator()
    .addSubMenu(ui.createMenu('👤 Gestión de Responsables')
      .addItem('➕ Agregar Responsable', 'agregarResponsable')
      .addItem('📝 Ver Responsables', 'verResponsables'))
    .addSeparator()
    .addItem('📊 Actualizar Reportes', 'actualizarReportes')
    .addItem('💾 Guardar Reporte Mensual', 'guardarReporteMensual')
    .addSeparator()
    .addItem('📧 Configurar Email Notificaciones', 'configurarEmail')
    .addItem('✉️ Probar Envío de Email', 'probarEmail')
    .addSeparator()
    .addItem('⏰ Instalar Triggers Automáticos', 'instalarTriggers')
    .addSeparator()
    .addItem('🔧 Reparar Validaciones', 'repararValidaciones')
    .addItem('🔧 Reparar Fórmulas', 'repararFormulas')
    .addSeparator()
    .addItem('🧪 Crear Datos de Prueba', 'crearDatosPrueba')
    .addItem('🧹 Limpiar Todos los Datos', 'limpiarTodosLosDatos')
    .addToUi();

  try {
    mantenimientoAutomatico();
  } catch (error) {
    Logger.log('Error en mantenimiento automático: ' + error.message);
  }
}

function mantenimientoAutomatico() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  try {
    Logger.log('🔧 Iniciando mantenimiento automático...');
    actualizarReportes();
    Logger.log('✅ Reportes actualizados');
  } catch (error) {
    Logger.log('❌ Error en mantenimiento: ' + error.message);
  }
}

// =====================================================================
// INSTALACIÓN DEL SISTEMA
// =====================================================================

function instalarSistema() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  try {
    ss.toast('📋 Creando hojas...', 'Instalando', 3);
    Utilities.sleep(1000);
    crearTodasLasHojas();

    ss.toast('✅ Configurando validaciones...', 'Instalando', 3);
    Utilities.sleep(1000);
    configurarValidaciones();

    ss.toast('🎨 Aplicando formatos...', 'Instalando', 3);
    Utilities.sleep(1000);
    aplicarFormatos();

    ss.toast('⏰ Instalando triggers...', 'Instalando', 3);
    Utilities.sleep(1000);
    instalarTriggers();

    ss.toast(
      '✅ SISTEMA INSTALADO\n\n' +
      '✓ Todas las hojas creadas\n' +
      '✓ Validaciones configuradas\n' +
      '✓ Formatos aplicados\n' +
      '✓ Triggers instalados\n\n' +
      '🎯 El sistema está listo para usar.\n\n' +
      '📥 Use el menú "Importar Datos" para conectar con KoboToolbox',
      'INSTALACIÓN COMPLETA',
      10
    );

    Logger.log('✅ Sistema de Inclusión Laboral - Tecnología instalado');

  } catch (error) {
    ss.toast('❌ Error: ' + error.message, 'ERROR', 10);
    Logger.log('❌ Error en instalación: ' + error.message);
  }
}

function verificarInstalacion() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const triggers = ScriptApp.getProjectTriggers();

  let mensaje = '📋 VERIFICACIÓN DEL SISTEMA\n\n';

  const hojasRequeridas = [
    'Hoja de Interés', 'Entrevistas', 'Seleccionadas',
    'Cohortes', 'Asistencias', 'Graduadas',
    'Deserciones', 'No Seleccionadas', 'Reporte', 'Reportes Mensuales'
  ];

  let hojasOk = 0;
  hojasRequeridas.forEach(nombre => {
    if (ss.getSheetByName(nombre)) hojasOk++;
  });
  mensaje += '✅ Hojas: ' + hojasOk + '/' + hojasRequeridas.length + '\n';

  let triggerEditarOk = false;
  let triggerTiempoOk = false;
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'alEditar') triggerEditarOk = true;
    if (trigger.getHandlerFunction() === 'actualizarReportes') triggerTiempoOk = true;
  });

  mensaje += (triggerEditarOk ? '✅' : '❌') + ' Trigger al editar\n';
  mensaje += (triggerTiempoOk ? '✅' : '⚠️') + ' Trigger de tiempo\n\n';

  // Verificar conexión Kobo
  const props = PropertiesService.getDocumentProperties();
  const koboUrl = props.getProperty('KOBO_URL');
  mensaje += (koboUrl ? '✅' : '⚠️') + ' URL KoboToolbox configurada\n\n';

  if (hojasOk === hojasRequeridas.length && triggerEditarOk) {
    mensaje += '🎉 TODO LISTO Y FUNCIONANDO';
  } else {
    mensaje += '⚠️ Ejecute "Instalar Sistema" para completar';
  }

  ss.toast(mensaje, 'Verificación', -1);
}

// =====================================================================
// CREAR TODAS LAS HOJAS
// =====================================================================

function crearTodasLasHojas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const hojas = ss.getSheets();
  for (let i = hojas.length - 1; i > 0; i--) {
    ss.deleteSheet(hojas[i]);
  }

  hojas[0].setName('Hoja de Interés');

  crearHojaInteres();
  crearHojaEntrevistas();
  crearHojaSeleccionadas();
  crearHojaCohortes();
  crearHojaAsistencias();
  crearHojaGraduadas();
  crearHojaDeserciones();
  crearHojaNoSeleccionadas();  // Antes era "No Interesados"
  crearHojaReporte();
  crearHojaReportesMensuales();
}

/**
 * HOJA DE INTERÉS - Registro inicial (se llena desde KoboToolbox)
 */
function crearHojaInteres() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Hoja de Interés');
  sheet.clear();

  const headers = [
    'Fecha Registro',  // A - Automático
    'No.',             // B - Automático
    'Creamos ID',      // C
    'DPI',             // D
    'Nombre Completo', // E
    'Edad',            // F
    'Teléfono',        // G
    'Nivel Educativo', // H - Desplegable
    'Zona',            // I - Desplegable
    'Cómo se enteró',  // J
    'Programa Interés',// K - Desplegable (cohortes)
    'Responsable',     // L - Desplegable
    'Notas',           // M
    'Estado'           // N - Desplegable (última columna)
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#1565c0')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  for (let i = 2; i <= 500; i++) {
    sheet.getRange('A' + i).setFormula('=IF(E' + i + '<>"",TODAY(),"")');
    sheet.getRange('B' + i).setFormula('=IF(E' + i + '<>"",COUNTA($E$2:E' + i + '),"")');
  }

  [100, 50, 100, 130, 200, 60, 120, 150, 120, 150, 150, 120, 250, 120].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });

  sheet.getRange('A2:A500').protect().setWarningOnly(true);
  sheet.getRange('B2:B500').protect().setWarningOnly(true);
}

/**
 * HOJA DE ENTREVISTAS - MODIFICADA
 * - "Programa" → "Cohorte a Enviar"
 * - "Estado" → "Fase de Entrevista"
 * - Eliminada "Fecha Seguimiento"
 * - Agregada columna "Enviar" al final
 */
function crearHojaEntrevistas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.insertSheet('Entrevistas');

  const headers = [
    'Fecha Entrevista',   // A
    'Hora',               // B
    'Creamos ID',         // C
    'Nombre Completo',    // D
    'Teléfono',           // E
    'Entrevistador',      // F - Desplegable (responsables)
    'Fase de Entrevista', // G - Desplegable (antes "Estado")
    'Calificación',       // H - 1-10
    'Observaciones',      // I
    'Cohorte a Enviar',   // J - Desplegable (antes "Programa", movido al final)
    'Enviar'              // K - Desplegable Sí/No (trigger para enviar)
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#7b1fa2')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Anchos de columna
  [120, 80, 100, 200, 120, 120, 180, 100, 300, 180, 80].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });

  // Destacar columna "Enviar"
  sheet.getRange('K1').setBackground('#4caf50');
}

/**
 * HOJA DE SELECCIONADAS - Lista definitiva por cohorte
 */
function crearHojaSeleccionadas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.insertSheet('Seleccionadas');

  const headers = [
    'Fecha Selección',  // A
    'No.',              // B
    'Creamos ID',       // C
    'DPI',              // D
    'Nombre Completo',  // E
    'Edad',             // F
    'Teléfono',         // G
    'Nivel Educativo',  // H
    'Zona',             // I
    'Cohorte Asignada', // J - Desplegable
    'Responsable',      // K - Desplegable
    'Estado',           // L - Desplegable
    'Notas'             // M
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#2e7d32')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  [120, 50, 100, 130, 200, 60, 120, 150, 120, 150, 120, 100, 250].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });
}

/**
 * HOJA DE COHORTES - Gestión de cohortes activas
 */
function crearHojaCohortes() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.insertSheet('Cohortes');

  const headers = [
    'Nombre Cohorte',     // A
    'Área',               // B
    'Fecha Inicio',       // C
    'Fecha Fin Estimada', // D
    'Responsable',        // E
    'Cupo Máximo',        // F
    'Inscritas',          // G - Fórmula
    'Activas',            // H - Fórmula
    'Graduadas',          // I - Fórmula
    'Deserciones',        // J - Fórmula
    'Estado',             // K
    'Ubicación',          // L
    'Horario',            // M
    'Notas'               // N
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#f57c00')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  const cohortesIniciales = [
    ['SAC Cohorte I', 'Tecnología', '', '', 'Adrian Torres', 25, '', '', '', '', 'Activa', '', '', ''],
    ['SAC Cohorte II', 'Tecnología', '', '', 'Paola Ortiz', 25, '', '', '', '', 'Planificada', '', '', ''],
    ['Computación Cohorte I', 'Tecnología', '', '', 'Adrian Torres', 20, '', '', '', '', 'Planificada', '', '', ''],
    ['Por definir', 'Tecnología', '', '', '', 20, '', '', '', '', 'Planificada', '', '', '']
  ];

  sheet.getRange(2, 1, cohortesIniciales.length, 14).setValues(cohortesIniciales);

  for (let i = 2; i <= 20; i++) {
    sheet.getRange('G' + i).setFormula('=IFERROR(COUNTIF(Seleccionadas!J:J,A' + i + '),0)');
    sheet.getRange('H' + i).setFormula('=IFERROR(COUNTIFS(Seleccionadas!J:J,A' + i + ',Seleccionadas!L:L,"Activa"),0)');
    sheet.getRange('I' + i).setFormula('=IFERROR(COUNTIF(Graduadas!G:G,A' + i + '),0)');
    sheet.getRange('J' + i).setFormula('=IFERROR(COUNTIF(Deserciones!G:G,A' + i + '),0)');
  }

  [180, 100, 120, 120, 120, 100, 80, 80, 80, 80, 100, 150, 150, 200].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });
}

/**
 * HOJA DE ASISTENCIAS
 */
function crearHojaAsistencias() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.insertSheet('Asistencias');

  const headers = [
    'Fecha',
    'Cohorte',
    'Creamos ID',
    'Nombre',
    'Asistió',
    'Justificación',
    'Notas'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#0288d1')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  [120, 180, 100, 200, 80, 200, 250].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });
}

/**
 * HOJA DE GRADUADAS
 */
function crearHojaGraduadas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.insertSheet('Graduadas');

  const headers = [
    'Fecha Graduación',
    'Creamos ID',
    'DPI',
    'Nombre Completo',
    'Teléfono',
    'Nivel Educativo',
    'Cohorte',
    'Calificación Final',
    'Estado Seguimiento',
    'Empresa/Ocupación',
    'Fecha Último Contacto',
    'Notas Seguimiento'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#388e3c')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  [120, 100, 130, 200, 120, 150, 180, 120, 180, 200, 150, 300].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });
}

/**
 * HOJA DE DESERCIONES
 */
function crearHojaDeserciones() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.insertSheet('Deserciones');

  const headers = [
    'Fecha Deserción',
    'Creamos ID',
    'DPI',
    'Nombre Completo',
    'Teléfono',
    'Nivel Educativo',
    'Cohorte',
    'Clases Asistidas',
    'Motivo',
    'Notas',
    'Contacto Futuro'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#d32f2f')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  [120, 100, 130, 200, 120, 150, 180, 100, 200, 300, 120].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });
}

/**
 * HOJA DE NO SELECCIONADAS - Unifica "No Interesados" + "No Seleccionadas"
 */
function crearHojaNoSeleccionadas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.insertSheet('No Seleccionadas');

  const headers = [
    'Fecha',            // A
    'Creamos ID',       // B
    'Nombre Completo',  // C
    'Teléfono',         // D
    'Etapa',            // E - En qué etapa no fue seleccionada
    'Motivo',           // F - Desplegable
    'Origen',           // G - Interés / Entrevista
    'Notas',            // H
    'Recontactar'       // I - Sí/No
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#616161')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  [120, 100, 200, 120, 150, 200, 120, 300, 100].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });
}

/**
 * HOJA DE REPORTE - Dashboard principal (incluye No Seleccionadas)
 */
function crearHojaReporte() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.insertSheet('Reporte');

  const data = [
    ['REPORTE - INCLUSIÓN LABORAL TECNOLOGÍA', '', '', ''],
    ['Última actualización:', '=TEXT(NOW(),"DD/MM/YYYY HH:MM")', 'Mes actual:', '=TEXT(TODAY(),"MMMM YYYY")'],
    ['', '', '', ''],

    ['PERSONAS INTERESADAS', 'Total', 'Este mes', ''],
    ['Registros en Hoja de Interés', '=IFERROR(COUNTA(\'Hoja de Interés\'!E:E)-1,0)', '=IFERROR(COUNTIFS(\'Hoja de Interés\'!A:A,">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1)),0)', ''],
    ['', '', '', ''],

    ['ENTREVISTAS', 'Total', 'Aprobadas', 'Pendientes'],
    ['Entrevistas realizadas', '=IFERROR(COUNTA(Entrevistas!D:D)-1,0)', '=IFERROR(COUNTIF(Entrevistas!G:G,"Realizada - Aprobada"),0)', '=IFERROR(COUNTIF(Entrevistas!G:G,"Pendiente"),0)'],
    ['', '', '', ''],

    ['SELECCIONADAS', 'Total', 'Activas', ''],
    ['Personas seleccionadas', '=IFERROR(COUNTA(Seleccionadas!E:E)-1,0)', '=IFERROR(COUNTIF(Seleccionadas!L:L,"Activa"),0)', ''],
    ['', '', '', ''],

    ['PARTICIPANTES POR COHORTE', 'Inscritas', 'Activas', 'Graduadas'],
    ['SAC Cohorte I', '=IFERROR(COUNTIF(Seleccionadas!J:J,"SAC Cohorte I"),0)', '=IFERROR(COUNTIFS(Seleccionadas!J:J,"SAC Cohorte I",Seleccionadas!L:L,"Activa"),0)', '=IFERROR(COUNTIF(Graduadas!G:G,"SAC Cohorte I"),0)'],
    ['SAC Cohorte II', '=IFERROR(COUNTIF(Seleccionadas!J:J,"SAC Cohorte II"),0)', '=IFERROR(COUNTIFS(Seleccionadas!J:J,"SAC Cohorte II",Seleccionadas!L:L,"Activa"),0)', '=IFERROR(COUNTIF(Graduadas!G:G,"SAC Cohorte II"),0)'],
    ['Computación Cohorte I', '=IFERROR(COUNTIF(Seleccionadas!J:J,"Computación Cohorte I"),0)', '=IFERROR(COUNTIFS(Seleccionadas!J:J,"Computación Cohorte I",Seleccionadas!L:L,"Activa"),0)', '=IFERROR(COUNTIF(Graduadas!G:G,"Computación Cohorte I"),0)'],
    ['TOTAL', '=SUM(B14:B16)', '=SUM(C14:C16)', '=SUM(D14:D16)'],
    ['', '', '', ''],

    ['GRADUADAS', 'Total', 'Este mes', 'Empleadas'],
    ['Personas graduadas', '=IFERROR(COUNTA(Graduadas!D:D)-1,0)', '=IFERROR(COUNTIFS(Graduadas!A:A,">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1)),0)', '=IFERROR(COUNTIFS(Graduadas!I:I,"Empleada*"),0)'],
    ['', '', '', ''],

    ['DESERCIONES', 'Total', 'Este mes', 'Tasa'],
    ['Personas que desertaron', '=IFERROR(COUNTA(Deserciones!D:D)-1,0)', '=IFERROR(COUNTIFS(Deserciones!A:A,">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1)),0)', '=IFERROR(IF((B20+B23)>0,ROUND(B23/(B20+B23)*100,1)&"%","0%"),"0%")'],
    ['', '', '', ''],

    ['NO SELECCIONADAS', 'Total', 'Este mes', ''],
    ['Personas no seleccionadas', '=IFERROR(COUNTA(\'No Seleccionadas\'!C:C)-1,0)', '=IFERROR(COUNTIFS(\'No Seleccionadas\'!A:A,">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1)),0)', ''],
    ['', '', '', ''],

    ['RESUMEN GENERAL', 'Valor', '', ''],
    ['Total personas atendidas', '=B5+B8+B11+B26', '', ''],
    ['Tasa de éxito (graduadas/seleccionadas)', '=IFERROR(IF(B11>0,ROUND(B20/B11*100,1)&"%","0%"),"0%")', '', ''],
    ['Participantes activas actualmente', '=C11', '', '']
  ];

  sheet.getRange(1, 1, data.length, 4).setValues(data);

  // Formato del título
  sheet.getRange('A1:D1')
    .merge()
    .setBackground('#1565c0')
    .setFontColor('white')
    .setFontWeight('bold')
    .setFontSize(16)
    .setHorizontalAlignment('center');
  sheet.setRowHeight(1, 45);

  sheet.getRange('A2:D2')
    .setBackground('#e3f2fd')
    .setFontSize(10);

  const headerRows = [4, 7, 10, 13, 19, 22, 25, 28];
  headerRows.forEach(row => {
    sheet.getRange('A' + row + ':D' + row)
      .setBackground('#1565c0')
      .setFontColor('white')
      .setFontWeight('bold')
      .setHorizontalAlignment('center');
  });

  const totalRows = [17, 29, 30, 31];
  totalRows.forEach(row => {
    sheet.getRange('A' + row + ':D' + row)
      .setBackground('#bbdefb')
      .setFontWeight('bold');
  });

  sheet.setColumnWidth(1, 280);
  sheet.setColumnWidth(2, 120);
  sheet.setColumnWidth(3, 120);
  sheet.setColumnWidth(4, 120);

  sheet.getRange('A1:D' + data.length)
    .setBorder(true, true, true, true, true, true, '#cccccc', SpreadsheetApp.BorderStyle.SOLID);

  sheet.setFrozenRows(2);
}

/**
 * HOJA DE REPORTES MENSUALES
 */
function crearHojaReportesMensuales() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.insertSheet('Reportes Mensuales');

  const headers = [
    'Mes/Año',
    'Interesadas',
    'Entrevistas',
    'Seleccionadas',
    'Activas',
    'Graduadas',
    'Deserciones',
    'No Seleccionadas',
    'Tasa Éxito (%)',
    'SAC I',
    'SAC II',
    'Computación I',
    'Fecha Guardado'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#6a1b9a')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  [100, 90, 90, 100, 80, 80, 90, 120, 100, 80, 80, 100, 120].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });
}

// =====================================================================
// CONFIGURAR VALIDACIONES
// =====================================================================

function configurarValidaciones() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const cohortes = obtenerCohortesActuales();
  const responsables = obtenerResponsablesActuales();

  // === HOJA DE INTERÉS ===
  // Nota: Columnas H (Nivel Educativo), I (Zona), J (Cómo se enteró) permiten valores inválidos
  // porque se llenan desde KoboToolbox con valores que pueden no estar en las listas
  const interes = ss.getSheetByName('Hoja de Interés');
  if (interes) {
    // Nivel Educativo - permitir valores de Kobo (ej: "Tercero Básico", "Diversificado")
    interes.getRange('H2:H500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.NIVELES_EDUCATIVOS).setAllowInvalid(true).build()
    );
    // Zona - permitir valores de Kobo
    interes.getRange('I2:I500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.ZONAS).setAllowInvalid(true).build()
    );
    // Programa Interés (cohortes)
    interes.getRange('K2:K500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(cohortes).setAllowInvalid(true).build()
    );
    // Responsable
    interes.getRange('L2:L500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(responsables).setAllowInvalid(true).build()
    );
    // Estado (ahora en columna N - última columna)
    interes.getRange('N2:N500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(['Nuevo', 'Contactado', 'Entrevista agendada', 'En proceso', 'No seleccionada']).setAllowInvalid(true).build()
    );
  }

  // === HOJA DE ENTREVISTAS (MODIFICADA) ===
  const entrevistas = ss.getSheetByName('Entrevistas');
  if (entrevistas) {
    // Entrevistador (F)
    entrevistas.getRange('F2:F500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(responsables).setAllowInvalid(false).build()
    );
    // Fase de Entrevista (G) - antes "Estado"
    entrevistas.getRange('G2:G500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.FASES_ENTREVISTA).setAllowInvalid(false).build()
    );
    // Calificación (H)
    const calificaciones = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    entrevistas.getRange('H2:H500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(calificaciones).setAllowInvalid(false).build()
    );
    // Cohorte a Enviar (J) - antes "Programa"
    entrevistas.getRange('J2:J500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(cohortes).setAllowInvalid(false).build()
    );
    // Enviar (K) - nueva columna
    entrevistas.getRange('K2:K500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(['Sí', 'No']).setAllowInvalid(false).build()
    );
  }

  // === HOJA DE SELECCIONADAS ===
  const seleccionadas = ss.getSheetByName('Seleccionadas');
  if (seleccionadas) {
    seleccionadas.getRange('H2:H500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.NIVELES_EDUCATIVOS).setAllowInvalid(false).build()
    );
    seleccionadas.getRange('I2:I500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.ZONAS).setAllowInvalid(true).build()
    );
    seleccionadas.getRange('J2:J500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(cohortes).setAllowInvalid(false).build()
    );
    seleccionadas.getRange('K2:K500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(responsables).setAllowInvalid(false).build()
    );
    seleccionadas.getRange('L2:L500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.ESTADOS_PARTICIPANTE).setAllowInvalid(false).build()
    );
  }

  // === HOJA DE ASISTENCIAS ===
  const asistencias = ss.getSheetByName('Asistencias');
  if (asistencias) {
    asistencias.getRange('B2:B500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(cohortes).setAllowInvalid(false).build()
    );
    asistencias.getRange('E2:E500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(['Sí', 'No', 'Justificado']).setAllowInvalid(false).build()
    );
  }

  // === HOJA DE GRADUADAS ===
  const graduadas = ss.getSheetByName('Graduadas');
  if (graduadas) {
    graduadas.getRange('F2:F500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.NIVELES_EDUCATIVOS).setAllowInvalid(false).build()
    );
    graduadas.getRange('G2:G500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(cohortes).setAllowInvalid(false).build()
    );
    graduadas.getRange('I2:I500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.ESTADOS_SEGUIMIENTO).setAllowInvalid(false).build()
    );
  }

  // === HOJA DE DESERCIONES ===
  const deserciones = ss.getSheetByName('Deserciones');
  if (deserciones) {
    deserciones.getRange('G2:G500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(cohortes).setAllowInvalid(false).build()
    );
    deserciones.getRange('I2:I500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.MOTIVOS_DESERCION).setAllowInvalid(true).build()
    );
    deserciones.getRange('K2:K500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(['Sí', 'No']).setAllowInvalid(false).build()
    );
  }

  // === HOJA DE NO SELECCIONADAS ===
  const noSeleccionadas = ss.getSheetByName('No Seleccionadas');
  if (noSeleccionadas) {
    noSeleccionadas.getRange('E2:E500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(['Interés inicial', 'Pre-entrevista', 'Post-entrevista', 'Durante programa']).setAllowInvalid(false).build()
    );
    noSeleccionadas.getRange('F2:F500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.MOTIVOS_NO_SELECCION).setAllowInvalid(true).build()
    );
    noSeleccionadas.getRange('G2:G500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(['Hoja de Interés', 'Entrevistas']).setAllowInvalid(false).build()
    );
    noSeleccionadas.getRange('I2:I500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(['Sí', 'No']).setAllowInvalid(false).build()
    );
  }

  // === HOJA DE COHORTES ===
  const cohortesSheet = ss.getSheetByName('Cohortes');
  if (cohortesSheet) {
    cohortesSheet.getRange('E2:E50').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(responsables).setAllowInvalid(false).build()
    );
    cohortesSheet.getRange('K2:K50').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(['Activa', 'Planificada', 'Finalizada', 'Cancelada']).setAllowInvalid(false).build()
    );
  }

  Logger.log('✅ Validaciones configuradas');
}

function obtenerCohortesActuales() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Cohortes');
  if (!sheet) return CONFIG.COHORTES;

  const datos = sheet.getRange('A2:A50').getValues();
  const cohortes = [];
  datos.forEach(fila => {
    if (fila[0] && fila[0].toString().trim() !== '') {
      cohortes.push(fila[0].toString().trim());
    }
  });
  return cohortes.length > 0 ? cohortes : CONFIG.COHORTES;
}

function obtenerResponsablesActuales() {
  const props = PropertiesService.getDocumentProperties();
  const responsablesJSON = props.getProperty('RESPONSABLES');
  if (responsablesJSON) {
    try {
      const responsables = JSON.parse(responsablesJSON);
      if (responsables.length > 0) return responsables;
    } catch (e) {}
  }
  return CONFIG.RESPONSABLES;
}

function guardarResponsables(responsables) {
  const props = PropertiesService.getDocumentProperties();
  props.setProperty('RESPONSABLES', JSON.stringify(responsables));
}

function aplicarFormatos() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const seleccionadas = ss.getSheetByName('Seleccionadas');
  if (seleccionadas) {
    const rangoEstado = seleccionadas.getRange('L2:L500');

    const reglaActiva = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Activa').setBackground('#c8e6c9').setRanges([rangoEstado]).build();
    const reglaGraduada = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Graduada').setBackground('#bbdefb').setRanges([rangoEstado]).build();
    const reglaDesercion = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Deserción').setBackground('#ffcdd2').setRanges([rangoEstado]).build();

    seleccionadas.setConditionalFormatRules([reglaActiva, reglaGraduada, reglaDesercion]);
  }

  // Formato para Entrevistas - Fase
  const entrevistas = ss.getSheetByName('Entrevistas');
  if (entrevistas) {
    const rangoFase = entrevistas.getRange('G2:G500');

    const reglaAprobada = SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains('Aprobada').setBackground('#c8e6c9').setRanges([rangoFase]).build();
    const reglaPendiente = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Pendiente').setBackground('#fff9c4').setRanges([rangoFase]).build();
    const reglaNoAprobada = SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains('No aprobada').setBackground('#ffcdd2').setRanges([rangoFase]).build();

    entrevistas.setConditionalFormatRules([reglaAprobada, reglaPendiente, reglaNoAprobada]);

    // Formato para columna Enviar
    const rangoEnviar = entrevistas.getRange('K2:K500');
    const reglaEnviarSi = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Sí').setBackground('#4caf50').setFontColor('white').setRanges([rangoEnviar]).build();

    const reglasActuales = entrevistas.getConditionalFormatRules();
    reglasActuales.push(reglaEnviarSi);
    entrevistas.setConditionalFormatRules(reglasActuales);
  }

  Logger.log('✅ Formatos aplicados');
}

// =====================================================================
// TRIGGER PRINCIPAL - AUTOMATIZACIONES
// =====================================================================

function alEditar(e) {
  if (!e || !e.range) return;

  const sheet = e.range.getSheet();
  const hoja = sheet.getName();
  const fila = e.range.getRow();
  const columna = e.range.getColumn();
  const valor = e.range.getValue();

  Logger.log('📝 Edición: ' + hoja + ' [' + fila + ',' + columna + '] = ' + valor);

  if (fila <= 1) return;
  if (!valor) return;

  const val = valor.toString().trim();
  if (val === '') return;

  // === HOJA DE INTERÉS ===
  if (hoja === 'Hoja de Interés') {
    if (columna === 13) { // Estado (M)
      procesarCambioEstadoInteres(sheet, fila, val);
    }
  }

  // === ENTREVISTAS - Columna "Enviar" (K = 11) ===
  if (hoja === 'Entrevistas') {
    if (columna === 11 && val === 'Sí') { // Columna Enviar
      procesarEnvioDesdeEntrevista(sheet, fila);
    }
  }

  // === SELECCIONADAS ===
  if (hoja === 'Seleccionadas') {
    if (columna === 12) { // Estado (L)
      procesarCambioEstadoParticipante(sheet, fila, val);
    }
  }
}

/**
 * Procesa cambio de estado en Hoja de Interés
 */
function procesarCambioEstadoInteres(sheet, fila, estado) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  if (estado === 'No seleccionada') {
    const datos = sheet.getRange(fila, 1, 1, 14).getValues()[0];

    const noSeleccionadas = ss.getSheetByName('No Seleccionadas');
    const nuevaFila = obtenerPrimeraFilaVacia(noSeleccionadas, 'C');

    const registro = [
      new Date(),
      datos[2],             // Creamos ID
      datos[4],             // Nombre
      datos[6],             // Teléfono
      'Interés inicial',    // Etapa
      '',                   // Motivo
      'Hoja de Interés',    // Origen
      datos[13],            // Notas
      'No'                  // Recontactar
    ];

    noSeleccionadas.getRange(nuevaFila, 1, 1, 9).setValues([registro]);
    sheet.getRange(fila, 1, 1, 14).setBackground('#ffcdd2');

    ss.toast('📋 Persona movida a "No Seleccionadas"', 'Registro', 3);
  }

  if (estado === 'Entrevista agendada') {
    const datos = sheet.getRange(fila, 1, 1, 14).getValues()[0];

    const entrevistas = ss.getSheetByName('Entrevistas');
    const nuevaFila = obtenerPrimeraFilaVacia(entrevistas, 'D');

    const registro = [
      '',                   // Fecha Entrevista
      '',                   // Hora
      datos[2],             // Creamos ID
      datos[4],             // Nombre
      datos[6],             // Teléfono
      datos[11],            // Entrevistador (Responsable)
      'Agendada',           // Fase de Entrevista
      '',                   // Calificación
      '',                   // Observaciones
      datos[10],            // Cohorte a Enviar (Programa Interés)
      ''                    // Enviar (vacío)
    ];

    entrevistas.getRange(nuevaFila, 1, 1, 11).setValues([registro]);
    sheet.getRange(fila, 1, 1, 14).setBackground('#fff9c4');

    ss.toast('📋 Entrevista creada. Complete fecha, hora y use "Enviar" cuando apruebe.', 'Entrevista Agendada', 4);
  }
}

/**
 * Procesa envío desde Entrevistas cuando columna "Enviar" = "Sí"
 */
function procesarEnvioDesdeEntrevista(sheet, fila) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const datos = sheet.getRange(fila, 1, 1, 11).getValues()[0];
  const fase = datos[6]; // Fase de Entrevista (G)
  const cohorteDestino = datos[9]; // Cohorte a Enviar (J)

  // Verificar que la fase sea "Aprobada"
  if (!fase || !fase.toString().includes('Aprobada')) {
    ss.toast('⚠️ Solo se puede enviar si la fase es "Realizada - Aprobada"', 'Error', 4);
    sheet.getRange(fila, 11).setValue(''); // Limpiar
    return;
  }

  // Verificar que haya cohorte seleccionada
  if (!cohorteDestino || cohorteDestino.toString().trim() === '') {
    ss.toast('⚠️ Seleccione una "Cohorte a Enviar" primero', 'Error', 4);
    sheet.getRange(fila, 11).setValue(''); // Limpiar
    return;
  }

  // Buscar datos adicionales en Hoja de Interés
  const interes = ss.getSheetByName('Hoja de Interés');
  const datosInteres = buscarPorCreamosID(interes, datos[2]);

  // Mover a Seleccionadas
  const seleccionadas = ss.getSheetByName('Seleccionadas');
  const nuevaFila = obtenerPrimeraFilaVacia(seleccionadas, 'E');

  const registro = [
    new Date(),
    nuevaFila - 1,
    datos[2],             // Creamos ID
    datosInteres ? datosInteres[3] : '',  // DPI
    datos[3],             // Nombre
    datosInteres ? datosInteres[5] : '',  // Edad
    datos[4],             // Teléfono
    datosInteres ? datosInteres[7] : '',  // Nivel Educativo
    datosInteres ? datosInteres[8] : '',  // Zona
    cohorteDestino,       // Cohorte Asignada
    datos[5],             // Responsable (Entrevistador)
    'Activa',
    datos[8]              // Notas (Observaciones)
  ];

  seleccionadas.getRange(nuevaFila, 1, 1, 13).setValues([registro]);

  // Marcar fila como enviada
  sheet.getRange(fila, 1, 1, 11).setBackground('#c8e6c9');
  sheet.getRange(fila, 11).setValue('Enviado ✓');

  ss.toast('✅ ' + datos[3] + ' enviada a ' + cohorteDestino, 'Participante Enviada', 4);

  // Enviar email
  enviarEmailAprobacion(datos[3], cohorteDestino, datos[5]);
}

/**
 * Procesa cambio de estado en Seleccionadas
 */
function procesarCambioEstadoParticipante(sheet, fila, estado) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const datos = sheet.getRange(fila, 1, 1, 13).getValues()[0];

  if (estado === 'Graduada') {
    const graduadas = ss.getSheetByName('Graduadas');
    const nuevaFila = obtenerPrimeraFilaVacia(graduadas, 'D');

    const registro = [
      new Date(),
      datos[2],  // Creamos ID
      datos[3],  // DPI
      datos[4],  // Nombre
      datos[6],  // Teléfono
      datos[7],  // Nivel Educativo
      datos[9],  // Cohorte
      '',        // Calificación Final
      'Sin seguimiento',
      '',
      '',
      datos[12]  // Notas
    ];

    graduadas.getRange(nuevaFila, 1, 1, 12).setValues([registro]);
    sheet.getRange(fila, 1, 1, 13).setBackground('#c8e6c9');

    ss.toast('🎓 ¡Felicitaciones! Persona graduada registrada', 'Graduación', 4);
    enviarEmailGraduacion(datos[4], datos[9]);
  }

  if (estado === 'Deserción') {
    const motivo = mostrarDialogoMotivoDesercion(datos[4]);
    if (!motivo) {
      sheet.getRange(fila, 12).setValue('Activa');
      return;
    }

    const deserciones = ss.getSheetByName('Deserciones');
    const nuevaFila = obtenerPrimeraFilaVacia(deserciones, 'D');

    const registro = [
      new Date(),
      datos[2],  // Creamos ID
      datos[3],  // DPI
      datos[4],  // Nombre
      datos[6],  // Teléfono
      datos[7],  // Nivel Educativo
      datos[9],  // Cohorte
      '',        // Clases Asistidas
      motivo,
      datos[12], // Notas
      'Sí'
    ];

    deserciones.getRange(nuevaFila, 1, 1, 11).setValues([registro]);
    sheet.getRange(fila, 1, 1, 13).setBackground('#ffcdd2');

    ss.toast('📋 Deserción registrada: ' + motivo, 'Deserción', 4);
    enviarEmailDesercion(datos[4], datos[9], motivo);
  }
}

function mostrarDialogoMotivoDesercion(nombre) {
  const ui = SpreadsheetApp.getUi();

  let listaMotivos = '';
  CONFIG.MOTIVOS_DESERCION.forEach((motivo, idx) => {
    listaMotivos += (idx + 1) + '. ' + motivo + '\n';
  });

  const respuesta = ui.prompt(
    'Motivo de Deserción',
    'Participante: ' + nombre + '\n\n' +
    'MOTIVOS:\n' + listaMotivos + '\n' +
    'Ingrese el número del motivo:',
    ui.ButtonSet.OK_CANCEL
  );

  if (respuesta.getSelectedButton() !== ui.Button.OK) return null;

  const num = parseInt(respuesta.getResponseText().trim());
  if (isNaN(num) || num < 1 || num > CONFIG.MOTIVOS_DESERCION.length) {
    ui.alert('Número inválido');
    return null;
  }

  return CONFIG.MOTIVOS_DESERCION[num - 1];
}

// =====================================================================
// FUNCIONES AUXILIARES
// =====================================================================

function obtenerPrimeraFilaVacia(sheet, columnaReferencia) {
  const columnaIndex = columnaReferencia.charCodeAt(0) - 64;
  for (let i = 2; i <= 500; i++) {
    const valor = sheet.getRange(i, columnaIndex).getValue();
    if (!valor || valor.toString().trim() === '') return i;
  }
  return 501;
}

function buscarPorCreamosID(sheet, creamosId) {
  if (!creamosId) return null;
  const datos = sheet.getDataRange().getValues();
  for (let i = 1; i < datos.length; i++) {
    if (datos[i][2] && datos[i][2].toString().trim() === creamosId.toString().trim()) {
      return datos[i];
    }
  }
  return null;
}

// =====================================================================
// IMPORTACIÓN DESDE KOBOTOOLBOX
// =====================================================================

/**
 * Configura la URL de KoboToolbox
 */
function configurarKoboURL() {
  const ui = SpreadsheetApp.getUi();
  const props = PropertiesService.getDocumentProperties();
  const urlActual = props.getProperty('KOBO_URL') || CONFIG.KOBO_URL;

  const respuesta = ui.prompt(
    '🔗 Configurar URL de KoboToolbox',
    'URL actual:\n' + urlActual + '\n\n' +
    'Ingresa la nueva URL del CSV:',
    ui.ButtonSet.OK_CANCEL
  );

  if (respuesta.getSelectedButton() === ui.Button.OK) {
    const nuevaUrl = respuesta.getResponseText().trim();
    if (nuevaUrl && nuevaUrl.includes('http')) {
      props.setProperty('KOBO_URL', nuevaUrl);
      SpreadsheetApp.getActiveSpreadsheet().toast('✅ URL configurada', 'Configurado', 4);
    } else {
      ui.alert('URL inválida');
    }
  }
}

/**
 * Importa datos desde KoboToolbox (solo Tecnología: Marketing y Programación)
 *
 * MAPEO DE COLUMNAS KOBO → HOJA DE INTERÉS:
 * - Inicio/Creamos ID → Creamos ID
 * - Inicio/Número de DPI → DPI
 * - Inicio/Nombre(s) + Inicio/Apellido(s) → Nombre Completo
 * - Inicio/Fecha de nacimiento → Edad (calculada)
 * - Inicio/Número de Teléfono → Teléfono
 * - Inicio/¿Cuál es tu último nivel de estudios terminado? → Nivel Educativo
 * - Inicio/Zona → Zona
 * - ¿Cómo te enteraste de Creamos? → Cómo se enteró
 *
 * FILTRO TECNOLOGÍA:
 * - Inclusión Laboral/.../Tecnología - Marketing = 1
 * - Inclusión Laboral/.../Tecnología - Programación = 1
 */
function importarDesdeKobo() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const props = PropertiesService.getDocumentProperties();
  const url = props.getProperty('KOBO_URL') || CONFIG.KOBO_URL;

  if (!url) {
    ui.alert('⚠️ URL no configurada', 'Configure la URL de KoboToolbox primero.', ui.ButtonSet.OK);
    return;
  }

  try {
    ss.toast('📥 Descargando datos de KoboToolbox...', 'Importando', 5);

    const response = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
      followRedirects: true,
      headers: {
        'Accept': 'text/csv, application/csv, text/plain'
      }
    });

    const responseCode = response.getResponseCode();
    Logger.log('Código de respuesta: ' + responseCode);

    if (responseCode !== 200) {
      throw new Error('Error HTTP: ' + responseCode + '. Verifica que la URL sea correcta y pública.');
    }

    let csvData = response.getContentText('UTF-8');
    Logger.log('Tamaño de datos recibidos: ' + csvData.length + ' caracteres');

    // Verificar que hay datos
    if (!csvData || csvData.trim().length === 0) {
      throw new Error('No se recibieron datos del servidor');
    }

    // Limpiar el texto (quitar BOM si existe)
    if (csvData.charCodeAt(0) === 0xFEFF) {
      csvData = csvData.substring(1);
    }

    // Detectar el separador contando ocurrencias en la primera línea
    const primeraLinea = csvData.split('\n')[0];
    const countComas = (primeraLinea.match(/,/g) || []).length;
    const countPuntoComa = (primeraLinea.match(/;/g) || []).length;
    const countTabs = (primeraLinea.match(/\t/g) || []).length;

    // El separador más frecuente es probablemente el correcto
    let separador = ';'; // Default para KoboToolbox que usa punto y coma
    if (countComas > countPuntoComa && countComas > countTabs) {
      separador = ',';
    } else if (countTabs > countComas && countTabs > countPuntoComa) {
      separador = '\t';
    }
    Logger.log('Separadores encontrados - comas: ' + countComas + ', punto y coma: ' + countPuntoComa + ', tabs: ' + countTabs);
    Logger.log('Separador seleccionado: ' + (separador === '\t' ? 'TAB' : separador));

    // Parsear CSV - usar parseo manual para punto y coma (más confiable)
    let rows;
    try {
      if (separador === ';') {
        // Para punto y coma, usar parseo manual que es más confiable
        rows = parsearCSVManual(csvData, separador);
        Logger.log('Usando parseo manual para separador ;');
      } else {
        rows = Utilities.parseCsv(csvData, separador);
      }
    } catch (parseError) {
      Logger.log('Error en parseCsv: ' + parseError.message);
      // Intentar parseo manual si falla
      rows = parsearCSVManual(csvData, separador);
    }

    if (!rows || rows.length < 2) {
      ss.toast('⚠️ No hay datos para importar', 'Sin Datos', 3);
      return;
    }

    Logger.log('Filas parseadas: ' + rows.length);

    // Obtener headers
    const headers = rows[0];
    Logger.log('Headers encontrados: ' + headers.length);

    // Buscar índices de columnas - Mapeo específico para tu formulario Kobo
    const colIndices = {
      // Creamos ID
      creamosId: buscarIndiceColumnaExacto(headers, [
        'Inicio/Creamos ID',
        'Creamos ID',
        'creamos_id'
      ]),

      // DPI
      dpi: buscarIndiceColumnaExacto(headers, [
        'Inicio/Número de DPI',
        'Número de DPI',
        'DPI'
      ]),

      // Nombre(s)
      nombres: buscarIndiceColumnaExacto(headers, [
        'Inicio/Nombre(s)',
        'Nombre(s)',
        'Nombres'
      ]),

      // Apellido(s)
      apellidos: buscarIndiceColumnaExacto(headers, [
        'Inicio/Apellido(s)',
        'Apellido(s)',
        'Apellidos'
      ]),

      // Fecha de nacimiento (para calcular edad)
      fechaNacimiento: buscarIndiceColumnaExacto(headers, [
        'Inicio/Fecha de nacimiento',
        'Fecha de nacimiento'
      ]),

      // Teléfono
      telefono: buscarIndiceColumnaExacto(headers, [
        'Inicio/Número de Teléfono',
        'Número de Teléfono',
        'Inicio/Número de Móvil/WhatsApp',
        'Número de Móvil/WhatsApp',
        'Teléfono'
      ]),

      // Nivel Educativo
      nivelEducativo: buscarIndiceColumnaExacto(headers, [
        'Inicio/¿Cuál es tu último nivel de estudios terminado?',
        '¿Cuál es tu último nivel de estudios terminado?',
        'Nivel educativo'
      ]),

      // Zona
      zona: buscarIndiceColumnaExacto(headers, [
        'Inicio/Zona',
        'Zona'
      ]),

      // Cómo se enteró
      comoSeEntero: buscarIndiceColumnaExacto(headers, [
        '¿Cómo te enteraste de Creamos?',
        'Como te enteraste'
      ]),

      // === COLUMNA PRINCIPAL DE INTERÉS (contiene texto con las opciones) ===
      servicioInteres: buscarIndiceColumnaExacto(headers, [
        'Inclusión Laboral/¿Tienes interés en un servicio o formación específica?',
        '¿Tienes interés en un servicio o formación específica?'
      ]),

      // Desea inscribirse en Inclusión Laboral
      deseaInscribirse: buscarIndiceColumnaExacto(headers, [
        'Inclusión Laboral/¿Deseas inscribirte en el programa de Inclusión Laboral?',
        '¿Deseas inscribirte en el programa de Inclusión Laboral?'
      ])
    };

    // Log de índices encontrados para debug
    Logger.log('Índices encontrados:');
    for (const [key, value] of Object.entries(colIndices)) {
      Logger.log('  ' + key + ': ' + value + (value >= 0 ? ' (' + headers[value] + ')' : ' (NO ENCONTRADO)'));
    }

    const hojaInteres = ss.getSheetByName('Hoja de Interés');

    // Obtener IDs existentes para evitar duplicados
    const idsExistentes = new Set();
    const dpisExistentes = new Set();
    const datosExistentes = hojaInteres.getDataRange().getValues();
    for (let i = 1; i < datosExistentes.length; i++) {
      if (datosExistentes[i][2]) idsExistentes.add(datosExistentes[i][2].toString().trim());
      if (datosExistentes[i][3]) dpisExistentes.add(datosExistentes[i][3].toString().trim());
    }

    let importados = 0;
    let omitidosDuplicados = 0;
    let omitidosNoTech = 0;

    // Procesar filas
    for (let i = 1; i < rows.length; i++) {
      const fila = rows[i];

      // === FILTRO: Solo registros de TECNOLOGÍA ===
      // Obtener el texto de la columna de servicios de interés
      const servicioTexto = colIndices.servicioInteres >= 0 ?
        (fila[colIndices.servicioInteres] || '').toString().toLowerCase() : '';

      // Verificar si contiene algún programa de tecnología
      const esMarketing = servicioTexto.includes('tecnología - marketing') || servicioTexto.includes('tecnologia - marketing');
      const esProgramacion = servicioTexto.includes('tecnología - programación') || servicioTexto.includes('tecnologia - programacion');
      const esAlfabetizacion = servicioTexto.includes('alfabetización digital') || servicioTexto.includes('alfabetizacion digital');
      const esCertificacion = servicioTexto.includes('certificación microsoft') || servicioTexto.includes('certificacion microsoft');

      // Si no tiene ningún programa de tecnología, omitir
      if (!esMarketing && !esProgramacion && !esAlfabetizacion && !esCertificacion) {
        omitidosNoTech++;
        continue; // Saltar si no es Tech
      }

      // Obtener Creamos ID y DPI
      const creamosId = colIndices.creamosId >= 0 ? fila[colIndices.creamosId].toString().trim() : '';
      const dpi = colIndices.dpi >= 0 ? fila[colIndices.dpi].toString().trim() : '';

      // Verificar duplicados por ID o DPI
      if ((creamosId && idsExistentes.has(creamosId)) || (dpi && dpisExistentes.has(dpi))) {
        omitidosDuplicados++;
        continue;
      }

      // Construir nombre completo
      const nombres = colIndices.nombres >= 0 ? fila[colIndices.nombres].toString().trim() : '';
      const apellidos = colIndices.apellidos >= 0 ? fila[colIndices.apellidos].toString().trim() : '';
      const nombreCompleto = (nombres + ' ' + apellidos).trim();

      // Calcular edad desde fecha de nacimiento
      let edad = '';
      if (colIndices.fechaNacimiento >= 0 && fila[colIndices.fechaNacimiento]) {
        edad = calcularEdad(fila[colIndices.fechaNacimiento]);
      }

      // Obtener teléfono
      const telefono = colIndices.telefono >= 0 ? fila[colIndices.telefono].toString().trim() : '';

      // Obtener nivel educativo
      const nivelEducativo = colIndices.nivelEducativo >= 0 ? fila[colIndices.nivelEducativo].toString().trim() : '';

      // Obtener zona
      const zona = colIndices.zona >= 0 ? fila[colIndices.zona].toString().trim() : '';

      // Obtener cómo se enteró
      const comoSeEntero = colIndices.comoSeEntero >= 0 ? fila[colIndices.comoSeEntero].toString().trim() : 'KoboToolbox';

      // Determinar programa de interés y notas
      let programasSeleccionados = [];
      if (esMarketing) programasSeleccionados.push('Marketing');
      if (esProgramacion) programasSeleccionados.push('Programación');
      if (esAlfabetizacion) programasSeleccionados.push('Alfabetización Digital');
      if (esCertificacion) programasSeleccionados.push('Certificación Microsoft');

      // Asignar cohorte basado en el primer programa seleccionado
      let programaInteres = 'Por definir';
      if (esMarketing) {
        programaInteres = 'SAC Cohorte I';
      } else if (esProgramacion) {
        programaInteres = 'Computación Cohorte I';
      } else if (esAlfabetizacion || esCertificacion) {
        programaInteres = 'SAC Cohorte II';
      }

      const notasPrograma = 'Kobo: ' + programasSeleccionados.join(', ');

      // Obtener primera fila vacía
      const nuevaFila = obtenerPrimeraFilaVacia(hojaInteres, 'E');

      // IMPORTANTE: Limpiar validaciones de la fila antes de insertar
      // Esto evita errores cuando los valores de Kobo no coinciden con las listas
      hojaInteres.getRange(nuevaFila, 1, 1, 14).clearDataValidations();

      // Preparar registro
      const registro = [
        '',                // A: Fecha (fórmula automática)
        '',                // B: No. (fórmula automática)
        creamosId,         // C: Creamos ID
        dpi,               // D: DPI
        nombreCompleto,    // E: Nombre Completo
        edad,              // F: Edad
        telefono,          // G: Teléfono
        nivelEducativo,    // H: Nivel Educativo
        zona,              // I: Zona
        comoSeEntero,      // J: Cómo se enteró
        programaInteres,   // K: Programa Interés
        '',                // L: Responsable
        notasPrograma,     // M: Notas
        'Nuevo'            // N: Estado (última columna)
      ];

      hojaInteres.getRange(nuevaFila, 1, 1, 14).setValues([registro]);

      if (creamosId) idsExistentes.add(creamosId);
      if (dpi) dpisExistentes.add(dpi);
      importados++;
    }

    const mensaje = '✅ IMPORTACIÓN COMPLETADA\n\n' +
      '📥 Importados: ' + importados + '\n' +
      '🔄 Duplicados omitidos: ' + omitidosDuplicados + '\n' +
      '🚫 No Tech (omitidos): ' + omitidosNoTech;

    ss.toast(mensaje, 'Importación', 10);
    Logger.log(mensaje);

  } catch (error) {
    ss.toast('❌ Error: ' + error.message, 'Error de Importación', 5);
    Logger.log('❌ Error importando desde Kobo: ' + error.message);
    Logger.log(error.stack);
  }
}

/**
 * Busca índice de columna por coincidencia exacta o parcial
 */
function buscarIndiceColumnaExacto(headers, nombresPosibles) {
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i].trim();
    for (const nombre of nombresPosibles) {
      // Coincidencia exacta primero
      if (header === nombre) {
        return i;
      }
    }
  }
  // Si no hay coincidencia exacta, buscar parcial
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i].toLowerCase().trim();
    for (const nombre of nombresPosibles) {
      if (header.includes(nombre.toLowerCase())) {
        return i;
      }
    }
  }
  return -1;
}

/**
 * Verifica si un valor en una fila es positivo (1, true, True, Sí, etc.)
 */
function verificarValorPositivo(fila, indice) {
  if (indice < 0 || !fila || indice >= fila.length) return false;
  const valor = fila[indice];
  if (!valor) return false;
  const valorStr = valor.toString().toLowerCase().trim();
  return valorStr === '1' || valorStr === 'true' || valorStr === 'sí' || valorStr === 'si' || valorStr === 'yes';
}

/**
 * DEBUG: Muestra las columnas de tecnología encontradas en Kobo
 */
function verColumnasKobo() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  const props = PropertiesService.getDocumentProperties();
  const url = props.getProperty('KOBO_URL') || CONFIG.KOBO_URL;

  try {
    ss.toast('🔍 Analizando columnas...', 'Análisis', 3);

    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true, followRedirects: true });
    let csvData = response.getContentText('UTF-8');

    if (csvData.charCodeAt(0) === 0xFEFF) csvData = csvData.substring(1);

    const rows = parsearCSVManual(csvData, ';');
    const headers = rows[0];

    let mensaje = '📊 COLUMNAS TECH ENCONTRADAS:\n\n';
    let colsTech = [];

    for (let i = 0; i < headers.length; i++) {
      const h = headers[i].toLowerCase();
      if (h.includes('marketing') || h.includes('programacion') || h.includes('programación') ||
          h.includes('tecnolog') || h.includes('alfabetizaci') || h.includes('certificaci') ||
          h.includes('microsoft')) {
        colsTech.push({ idx: i, nombre: headers[i] });
      }
    }

    if (colsTech.length > 0) {
      colsTech.forEach(c => {
        mensaje += '📌 [' + c.idx + '] ' + c.nombre.substring(0, 40) + '\n';
      });

      mensaje += '\n📋 VALORES FILA 1:\n';
      const primeraFila = rows[1];
      colsTech.forEach(c => {
        const valor = primeraFila && primeraFila[c.idx] ? primeraFila[c.idx] : '(vacío)';
        mensaje += '"' + valor + '" ← ' + c.nombre.substring(0, 25) + '\n';
      });
    } else {
      mensaje += '⚠️ No encontradas. Buscando alternativas...\n\n';
      for (let i = 0; i < headers.length; i++) {
        const h = headers[i].toLowerCase();
        if (h.includes('interés') || h.includes('interes') || h.includes('servicio') || h.includes('formación')) {
          mensaje += '[' + i + '] ' + headers[i].substring(0, 50) + '\n';
        }
      }
    }

    mensaje += '\n📊 Total: ' + headers.length + ' cols, ' + rows.length + ' filas';

    ui.alert('Columnas Kobo', mensaje, ui.ButtonSet.OK);

    Logger.log('=== COLUMNAS KOBO ===');
    headers.forEach((h, i) => Logger.log(i + ': ' + h));

  } catch (error) {
    ui.alert('Error', error.message, ui.ButtonSet.OK);
  }
}

/**
 * Parsea CSV manualmente cuando Utilities.parseCsv falla
 */
function parsearCSVManual(csvData, separador) {
  const lineas = csvData.split(/\r?\n/);
  const resultado = [];

  for (const linea of lineas) {
    if (!linea.trim()) continue;

    const campos = [];
    let campoActual = '';
    let dentroComillas = false;

    for (let i = 0; i < linea.length; i++) {
      const char = linea[i];

      if (char === '"') {
        if (dentroComillas && linea[i + 1] === '"') {
          campoActual += '"';
          i++; // Saltar la siguiente comilla
        } else {
          dentroComillas = !dentroComillas;
        }
      } else if (char === separador && !dentroComillas) {
        campos.push(campoActual.trim());
        campoActual = '';
      } else {
        campoActual += char;
      }
    }
    campos.push(campoActual.trim());
    resultado.push(campos);
  }

  return resultado;
}

/**
 * Calcula la edad a partir de una fecha de nacimiento
 */
function calcularEdad(fechaNacimiento) {
  try {
    let fecha;
    if (typeof fechaNacimiento === 'string') {
      // Intentar parsear diferentes formatos
      if (fechaNacimiento.includes('/')) {
        const partes = fechaNacimiento.split('/');
        if (partes.length === 3) {
          fecha = new Date(partes[2], partes[1] - 1, partes[0]);
        }
      } else if (fechaNacimiento.includes('-')) {
        fecha = new Date(fechaNacimiento);
      }
    } else if (fechaNacimiento instanceof Date) {
      fecha = fechaNacimiento;
    }

    if (!fecha || isNaN(fecha.getTime())) return '';

    const hoy = new Date();
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const mes = hoy.getMonth() - fecha.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
      edad--;
    }
    return edad > 0 && edad < 120 ? edad.toString() : '';
  } catch (e) {
    return '';
  }
}


/**
 * Prueba la conexión con KoboToolbox y muestra información de debug
 */
function probarConexionKobo() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  const props = PropertiesService.getDocumentProperties();
  const url = props.getProperty('KOBO_URL') || CONFIG.KOBO_URL;

  if (!url) {
    ui.alert('⚠️ URL no configurada');
    return;
  }

  try {
    ss.toast('🔍 Probando conexión...', 'Test', 3);

    const response = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
      followRedirects: true
    });

    const responseCode = response.getResponseCode();
    const contentType = response.getHeaders()['Content-Type'] || 'Desconocido';
    const csvData = response.getContentText('UTF-8');

    let mensaje = '📊 RESULTADO DE PRUEBA\n\n';
    mensaje += '📡 Código HTTP: ' + responseCode + '\n';
    mensaje += '📄 Tipo contenido: ' + contentType + '\n';
    mensaje += '📏 Tamaño: ' + csvData.length + ' caracteres\n\n';

    // Mostrar primeros 400 caracteres
    mensaje += '📝 CONTENIDO RECIBIDO:\n';
    mensaje += '─────────────────────\n';
    mensaje += csvData.substring(0, 400).replace(/\n/g, '↵\n') + '\n';
    mensaje += '─────────────────────\n\n';

    // Verificar tipo de contenido
    if (csvData.includes('<!DOCTYPE') || csvData.includes('<html') || csvData.includes('<HTML')) {
      mensaje += '❌ PROBLEMA: Recibiendo HTML, no CSV\n';
      mensaje += 'La URL requiere login o no es correcta.\n';
    } else if (csvData.trim().startsWith('{') || csvData.trim().startsWith('[')) {
      mensaje += '⚠️ Recibiendo JSON, no CSV\n';
      mensaje += 'Usa la URL de exportación CSV.\n';
    } else {
      const lineas = csvData.split(/\r?\n/).filter(l => l.trim());
      mensaje += '📋 Líneas con datos: ' + lineas.length + '\n';

      // Contar separadores
      const primeraLinea = lineas[0] || '';
      const comas = (primeraLinea.match(/,/g) || []).length;
      const tabs = (primeraLinea.match(/\t/g) || []).length;
      const puntoComa = (primeraLinea.match(/;/g) || []).length;

      mensaje += '🔀 Separadores: comas=' + comas + ' tabs=' + tabs + ' ;=' + puntoComa + '\n';

      if (lineas.length > 1) {
        mensaje += '\n✅ Parece ser CSV válido';
      }
    }

    ui.alert('Prueba de Conexión', mensaje, ui.ButtonSet.OK);

    // Log completo para debug
    Logger.log('=== PRUEBA KOBO ===');
    Logger.log('URL: ' + url);
    Logger.log('Código: ' + responseCode);
    Logger.log('Content-Type: ' + contentType);
    Logger.log('Primeros 2000 chars:\n' + csvData.substring(0, 2000));

  } catch (error) {
    ui.alert('❌ Error', 'No se pudo conectar:\n\n' + error.message, ui.ButtonSet.OK);
    Logger.log('Error: ' + error.message);
  }
}

/**
 * Configura importación automática (trigger diario)
 */
function configurarImportacionAutomatica() {
  const ui = SpreadsheetApp.getUi();

  const respuesta = ui.alert(
    '🔄 Importación Automática',
    '¿Desea activar la importación automática diaria desde KoboToolbox?\n\n' +
    'Se ejecutará todos los días a las 8:00 AM.',
    ui.ButtonSet.YES_NO
  );

  if (respuesta === ui.Button.YES) {
    // Eliminar triggers existentes
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'importarDesdeKobo') {
        ScriptApp.deleteTrigger(trigger);
      }
    });

    // Crear nuevo trigger diario
    ScriptApp.newTrigger('importarDesdeKobo')
      .timeBased()
      .atHour(8)
      .everyDays(1)
      .create();

    SpreadsheetApp.getActiveSpreadsheet().toast(
      '✅ Importación automática activada\n\nSe ejecutará diariamente a las 8:00 AM',
      'Configurado',
      5
    );
  }
}

// =====================================================================
// GESTIÓN DE COHORTES
// =====================================================================

function crearNuevaCohorte() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const respNombre = ui.prompt(
    '➕ Crear Nueva Cohorte - Paso 1/4',
    'Ingresa el NOMBRE de la nueva cohorte:\n\nEjemplos: "SAC Cohorte III", "Computación Cohorte II"',
    ui.ButtonSet.OK_CANCEL
  );
  if (respNombre.getSelectedButton() !== ui.Button.OK) return;
  const nombre = respNombre.getResponseText().trim();
  if (!nombre) { ui.alert('Nombre vacío'); return; }

  const cohortesExistentes = obtenerCohortesActuales();
  if (cohortesExistentes.includes(nombre)) {
    ui.alert('❌ Ya existe una cohorte con ese nombre.');
    return;
  }

  const responsables = obtenerResponsablesActuales();
  let listaResponsables = '';
  responsables.forEach((resp, idx) => { listaResponsables += (idx + 1) + '. ' + resp + '\n'; });

  const respResp = ui.prompt(
    '➕ Crear Nueva Cohorte - Paso 2/4',
    'Selecciona el RESPONSABLE:\n\n' + listaResponsables + '\nIngresa el número:',
    ui.ButtonSet.OK_CANCEL
  );
  if (respResp.getSelectedButton() !== ui.Button.OK) return;
  const numResp = parseInt(respResp.getResponseText().trim());
  const responsable = (numResp >= 1 && numResp <= responsables.length) ? responsables[numResp - 1] : '';

  const respCupo = ui.prompt(
    '➕ Crear Nueva Cohorte - Paso 3/4',
    'Ingresa el CUPO MÁXIMO:',
    ui.ButtonSet.OK_CANCEL
  );
  if (respCupo.getSelectedButton() !== ui.Button.OK) return;
  const cupo = parseInt(respCupo.getResponseText().trim()) || 20;

  const respEstado = ui.alert(
    '➕ Crear Nueva Cohorte - Paso 4/4',
    '¿La cohorte estará ACTIVA inmediatamente?\n\nSÍ = Activa\nNO = Planificada',
    ui.ButtonSet.YES_NO
  );
  const estadoInicial = (respEstado === ui.Button.YES) ? 'Activa' : 'Planificada';

  const cohortes = ss.getSheetByName('Cohortes');
  const nuevaFila = obtenerPrimeraFilaVacia(cohortes, 'A');

  const datosCohorte = [nombre, 'Tecnología', '', '', responsable, cupo, '', '', '', '', estadoInicial, '', '', ''];
  cohortes.getRange(nuevaFila, 1, 1, 14).setValues([datosCohorte]);

  cohortes.getRange('G' + nuevaFila).setFormula('=IFERROR(COUNTIF(Seleccionadas!J:J,A' + nuevaFila + '),0)');
  cohortes.getRange('H' + nuevaFila).setFormula('=IFERROR(COUNTIFS(Seleccionadas!J:J,A' + nuevaFila + ',Seleccionadas!L:L,"Activa"),0)');
  cohortes.getRange('I' + nuevaFila).setFormula('=IFERROR(COUNTIF(Graduadas!G:G,A' + nuevaFila + '),0)');
  cohortes.getRange('J' + nuevaFila).setFormula('=IFERROR(COUNTIF(Deserciones!G:G,A' + nuevaFila + '),0)');

  configurarValidaciones();

  ss.toast('✅ Cohorte "' + nombre + '" creada', 'Nueva Cohorte', 5);
}

function enviarParticipantesACohorte() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const cohortesSheet = ss.getSheetByName('Cohortes');
  const datosCohortes = cohortesSheet.getDataRange().getValues();

  const cohortesActivas = [];
  for (let i = 1; i < datosCohortes.length; i++) {
    if (datosCohortes[i][10] === 'Activa') {
      cohortesActivas.push({
        nombre: datosCohortes[i][0],
        cupo: datosCohortes[i][5],
        inscritas: datosCohortes[i][6]
      });
    }
  }

  if (cohortesActivas.length === 0) {
    ui.alert('⚠️ No hay cohortes activas');
    return;
  }

  let listaCohortes = '';
  cohortesActivas.forEach((c, idx) => {
    const disponibles = c.cupo - c.inscritas;
    listaCohortes += (idx + 1) + '. ' + c.nombre + ' (' + disponibles + ' lugares)\n';
  });

  const respCohorte = ui.prompt(
    '👥 Enviar Participantes',
    'COHORTES ACTIVAS:\n\n' + listaCohortes + '\nIngresa el número:',
    ui.ButtonSet.OK_CANCEL
  );
  if (respCohorte.getSelectedButton() !== ui.Button.OK) return;

  const numCohorte = parseInt(respCohorte.getResponseText().trim());
  if (isNaN(numCohorte) || numCohorte < 1 || numCohorte > cohortesActivas.length) {
    ui.alert('Número inválido');
    return;
  }

  const cohorteDestino = cohortesActivas[numCohorte - 1].nombre;

  // Buscar aprobados pendientes en Entrevistas
  const entrevistas = ss.getSheetByName('Entrevistas');
  const datosEntrevistas = entrevistas.getDataRange().getValues();

  const seleccionadas = ss.getSheetByName('Seleccionadas');
  const datosSeleccionadas = seleccionadas.getDataRange().getValues();

  const idsSeleccionados = new Set();
  for (let i = 1; i < datosSeleccionadas.length; i++) {
    if (datosSeleccionadas[i][2]) idsSeleccionados.add(datosSeleccionadas[i][2].toString().trim());
  }

  const pendientes = [];
  for (let i = 1; i < datosEntrevistas.length; i++) {
    const fase = datosEntrevistas[i][6];
    const creamosId = datosEntrevistas[i][2];
    const enviar = datosEntrevistas[i][10];

    if (fase && fase.toString().includes('Aprobada') && creamosId &&
        !idsSeleccionados.has(creamosId.toString().trim()) &&
        (!enviar || !enviar.toString().includes('Enviado'))) {
      pendientes.push({
        fila: i + 1,
        creamosId: creamosId,
        nombre: datosEntrevistas[i][3],
        datos: datosEntrevistas[i]
      });
    }
  }

  if (pendientes.length === 0) {
    ui.alert('ℹ️ No hay participantes aprobados pendientes');
    return;
  }

  let listaPendientes = '';
  pendientes.forEach((p, idx) => { listaPendientes += (idx + 1) + '. ' + p.nombre + '\n'; });

  const respConfirm = ui.alert(
    '👥 Confirmar',
    'Se enviarán ' + pendientes.length + ' participantes a:\n' + cohorteDestino + '\n\n' + listaPendientes + '\n¿Continuar?',
    ui.ButtonSet.YES_NO
  );
  if (respConfirm !== ui.Button.YES) return;

  const interes = ss.getSheetByName('Hoja de Interés');
  let enviados = 0;

  pendientes.forEach(p => {
    const datosInteres = buscarPorCreamosID(interes, p.creamosId);
    const nuevaFila = obtenerPrimeraFilaVacia(seleccionadas, 'E');

    const registro = [
      new Date(), nuevaFila - 1, p.creamosId,
      datosInteres ? datosInteres[3] : '', p.nombre,
      datosInteres ? datosInteres[5] : '', p.datos[4],
      datosInteres ? datosInteres[7] : '', datosInteres ? datosInteres[8] : '',
      cohorteDestino, p.datos[5] || '', 'Activa', p.datos[8] || ''
    ];

    seleccionadas.getRange(nuevaFila, 1, 1, 13).setValues([registro]);
    entrevistas.getRange(p.fila, 1, 1, 11).setBackground('#c8e6c9');
    entrevistas.getRange(p.fila, 11).setValue('Enviado ✓');
    enviados++;
  });

  ss.toast('✅ ' + enviados + ' participantes enviados a ' + cohorteDestino, 'Completado', 5);
}

function verCohortes() {
  const cohortes = obtenerCohortesActuales();
  let mensaje = '📋 COHORTES:\n\n';
  cohortes.forEach((c, i) => { mensaje += (i + 1) + '. ' + c + '\n'; });
  SpreadsheetApp.getUi().alert('Cohortes', mensaje, SpreadsheetApp.getUi().ButtonSet.OK);
}

function estadisticasCohorte() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const cohortesSheet = ss.getSheetByName('Cohortes');
  const datos = cohortesSheet.getDataRange().getValues();

  let mensaje = '📊 ESTADÍSTICAS:\n\n';
  for (let i = 1; i < datos.length; i++) {
    if (datos[i][0]) {
      mensaje += '━━━━━━━━━━━━━━━━━━\n';
      mensaje += '📚 ' + datos[i][0] + '\n';
      mensaje += '   Estado: ' + (datos[i][10] || 'N/A') + '\n';
      mensaje += '   Inscritas: ' + (datos[i][6] || 0) + '\n';
      mensaje += '   Activas: ' + (datos[i][7] || 0) + '\n';
      mensaje += '   Graduadas: ' + (datos[i][8] || 0) + '\n';
      mensaje += '   Deserciones: ' + (datos[i][9] || 0) + '\n';
    }
  }
  SpreadsheetApp.getUi().alert('Estadísticas', mensaje, SpreadsheetApp.getUi().ButtonSet.OK);
}

// =====================================================================
// GESTIÓN DE RESPONSABLES
// =====================================================================

function agregarResponsable() {
  const ui = SpreadsheetApp.getUi();
  const respuesta = ui.prompt('➕ Agregar Responsable', 'Nombre completo:', ui.ButtonSet.OK_CANCEL);
  if (respuesta.getSelectedButton() !== ui.Button.OK) return;

  const nombre = respuesta.getResponseText().trim();
  if (!nombre) { ui.alert('Nombre vacío'); return; }

  const responsables = obtenerResponsablesActuales();
  if (responsables.includes(nombre)) {
    ui.alert('⚠️ Ya existe');
    return;
  }

  responsables.push(nombre);
  guardarResponsables(responsables);
  configurarValidaciones();

  SpreadsheetApp.getActiveSpreadsheet().toast('✅ Responsable agregado: ' + nombre, 'Agregado', 4);
}

function verResponsables() {
  const responsables = obtenerResponsablesActuales();
  let mensaje = '👥 RESPONSABLES:\n\n';
  responsables.forEach((r, i) => { mensaje += (i + 1) + '. ' + r + '\n'; });
  SpreadsheetApp.getUi().alert('Responsables', mensaje, SpreadsheetApp.getUi().ButtonSet.OK);
}

// =====================================================================
// SISTEMA DE EMAILS
// =====================================================================

function obtenerEmailConfiguracion() {
  const props = PropertiesService.getDocumentProperties();
  return props.getProperty('EMAIL_NOTIFICACIONES') || Session.getActiveUser().getEmail();
}

function configurarEmail() {
  const ui = SpreadsheetApp.getUi();
  const emailActual = obtenerEmailConfiguracion();

  const respuesta = ui.prompt('📧 Configurar Email', 'Email actual: ' + emailActual + '\n\nNuevo email:', ui.ButtonSet.OK_CANCEL);
  if (respuesta.getSelectedButton() === ui.Button.OK) {
    const nuevoEmail = respuesta.getResponseText().trim();
    if (nuevoEmail && nuevoEmail.includes('@')) {
      PropertiesService.getDocumentProperties().setProperty('EMAIL_NOTIFICACIONES', nuevoEmail);
      SpreadsheetApp.getActiveSpreadsheet().toast('✅ Email configurado', 'OK', 3);
    }
  }
}

function probarEmail() {
  const email = obtenerEmailConfiguracion();
  try {
    MailApp.sendEmail(email, '✅ Prueba - Sistema Inclusión Laboral Tech', 'Prueba exitosa.\nFecha: ' + new Date());
    SpreadsheetApp.getActiveSpreadsheet().toast('✅ Email enviado a: ' + email, 'OK', 4);
  } catch (e) {
    SpreadsheetApp.getActiveSpreadsheet().toast('❌ Error: ' + e.message, 'Error', 4);
  }
}

function enviarEmailAprobacion(nombre, cohorte, responsable) {
  try {
    MailApp.sendEmail(obtenerEmailConfiguracion(), '✅ Nueva Participante: ' + nombre,
      'APROBADA\n\nNombre: ' + nombre + '\nCohorte: ' + cohorte + '\nResponsable: ' + responsable + '\nFecha: ' + new Date());
  } catch (e) { Logger.log('Error email: ' + e.message); }
}

function enviarEmailGraduacion(nombre, cohorte) {
  try {
    MailApp.sendEmail(obtenerEmailConfiguracion(), '🎓 Graduación: ' + nombre,
      'GRADUACIÓN\n\nNombre: ' + nombre + '\nCohorte: ' + cohorte + '\nFecha: ' + new Date());
  } catch (e) { Logger.log('Error email: ' + e.message); }
}

function enviarEmailDesercion(nombre, cohorte, motivo) {
  try {
    MailApp.sendEmail(obtenerEmailConfiguracion(), '⚠️ Deserción: ' + nombre,
      'DESERCIÓN\n\nNombre: ' + nombre + '\nCohorte: ' + cohorte + '\nMotivo: ' + motivo + '\nFecha: ' + new Date());
  } catch (e) { Logger.log('Error email: ' + e.message); }
}

// =====================================================================
// REPORTES
// =====================================================================

function actualizarReportes() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const reporte = ss.getSheetByName('Reporte');
    if (reporte) {
      reporte.getRange('B2').setValue(new Date());
      SpreadsheetApp.flush();
    }
    return true;
  } catch (e) { return false; }
}

function guardarReporteMensual() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const reporte = ss.getSheetByName('Reporte');
    const mensuales = ss.getSheetByName('Reportes Mensuales');

    const mesActual = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MMMM yyyy');
    const datos = [
      mesActual,
      reporte.getRange('B5').getValue(),
      reporte.getRange('B8').getValue(),
      reporte.getRange('B11').getValue(),
      reporte.getRange('C11').getValue(),
      reporte.getRange('B20').getValue(),
      reporte.getRange('B23').getValue(),
      reporte.getRange('B26').getValue(),
      reporte.getRange('B30').getValue(),
      reporte.getRange('B14').getValue(),
      reporte.getRange('B15').getValue(),
      reporte.getRange('B16').getValue(),
      new Date()
    ];

    const nuevaFila = mensuales.getLastRow() + 1;
    mensuales.getRange(nuevaFila, 1, 1, 13).setValues([datos]);

    ss.toast('✅ Reporte guardado: ' + mesActual, 'OK', 4);
  } catch (e) { Logger.log('Error: ' + e.message); }
}

// =====================================================================
// TRIGGERS
// =====================================================================

function instalarTriggers() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const triggers = ScriptApp.getProjectTriggers();

    triggers.forEach(trigger => {
      if (['alEditar', 'actualizarReportes'].includes(trigger.getHandlerFunction())) {
        ScriptApp.deleteTrigger(trigger);
      }
    });

    ScriptApp.newTrigger('alEditar').forSpreadsheet(ss).onEdit().create();
    ScriptApp.newTrigger('actualizarReportes').timeBased().everyHours(1).create();

    ss.toast('✅ Triggers instalados', 'OK', 3);
    return true;
  } catch (e) { return false; }
}

// =====================================================================
// REPARACIÓN
// =====================================================================

function repararValidaciones() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.toast('🔧 Reparando...', 'Reparando', 2);

  const hojas = ['Hoja de Interés', 'Entrevistas', 'Seleccionadas', 'Cohortes', 'Asistencias', 'Graduadas', 'Deserciones', 'No Seleccionadas'];
  hojas.forEach(nombre => {
    const hoja = ss.getSheetByName(nombre);
    if (hoja) hoja.getRange('A1:Z500').clearDataValidations();
  });

  configurarValidaciones();
  aplicarFormatos();
  ss.toast('✅ Validaciones reparadas', 'OK', 4);
}

function repararFormulas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.toast('🔧 Reparando fórmulas...', 'Reparando', 2);

  const interes = ss.getSheetByName('Hoja de Interés');
  if (interes) {
    for (let i = 2; i <= 500; i++) {
      interes.getRange('A' + i).setFormula('=IF(E' + i + '<>"",TODAY(),"")');
      interes.getRange('B' + i).setFormula('=IF(E' + i + '<>"",COUNTA($E$2:E' + i + '),"")');
    }
  }

  const cohortes = ss.getSheetByName('Cohortes');
  if (cohortes) {
    for (let i = 2; i <= 20; i++) {
      cohortes.getRange('G' + i).setFormula('=IFERROR(COUNTIF(Seleccionadas!J:J,A' + i + '),0)');
      cohortes.getRange('H' + i).setFormula('=IFERROR(COUNTIFS(Seleccionadas!J:J,A' + i + ',Seleccionadas!L:L,"Activa"),0)');
      cohortes.getRange('I' + i).setFormula('=IFERROR(COUNTIF(Graduadas!G:G,A' + i + '),0)');
      cohortes.getRange('J' + i).setFormula('=IFERROR(COUNTIF(Deserciones!G:G,A' + i + '),0)');
    }
  }

  ss.toast('✅ Fórmulas reparadas', 'OK', 4);
}

// =====================================================================
// DATOS DE PRUEBA
// =====================================================================

function crearDatosPrueba() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const resp = SpreadsheetApp.getUi().alert('Crear Datos de Prueba', '¿Crear 3 registros de ejemplo?', SpreadsheetApp.getUi().ButtonSet.YES_NO);
  if (resp !== SpreadsheetApp.getUi().Button.YES) return;

  const interes = ss.getSheetByName('Hoja de Interés');
  const datosPrueba = [
    ['', '', 'CR001', '1234567890101', 'María García', '22', '5555-1234', 'Diversificado completo', 'Zona 1', 'Redes', 'SAC Cohorte I', 'Adrian Torres', 'Nuevo', ''],
    ['', '', 'CR002', '2345678901212', 'Ana Martínez', '25', '5555-5678', 'Universitario', 'Zona 7', 'Referido', 'SAC Cohorte I', 'Paola Ortiz', 'Nuevo', ''],
    ['', '', 'CR003', '3456789012323', 'Laura López', '19', '5555-9012', 'Básicos completos', 'Mixco', 'Facebook', 'Computación Cohorte I', 'Adrian Torres', 'Nuevo', '']
  ];
  interes.getRange(2, 1, 3, 14).setValues(datosPrueba);
  ss.toast('✅ 3 registros creados', 'OK', 4);
}

function limpiarTodosLosDatos() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const resp = SpreadsheetApp.getUi().alert('⚠️ CONFIRMAR', '¿Eliminar TODOS los datos?', SpreadsheetApp.getUi().ButtonSet.YES_NO);
  if (resp !== SpreadsheetApp.getUi().Button.YES) return;

  const hojas = ['Hoja de Interés', 'Entrevistas', 'Seleccionadas', 'Asistencias', 'Graduadas', 'Deserciones', 'No Seleccionadas', 'Reportes Mensuales'];
  hojas.forEach(nombre => {
    const hoja = ss.getSheetByName(nombre);
    if (hoja && hoja.getLastRow() > 1) {
      hoja.getRange(2, 1, hoja.getLastRow() - 1, hoja.getLastColumn()).clearContent();
      hoja.getRange(2, 1, hoja.getLastRow() - 1, hoja.getLastColumn()).setBackground(null);
    }
  });

  const interes = ss.getSheetByName('Hoja de Interés');
  for (let i = 2; i <= 100; i++) {
    interes.getRange('A' + i).setFormula('=IF(E' + i + '<>"",TODAY(),"")');
    interes.getRange('B' + i).setFormula('=IF(E' + i + '<>"",COUNTA($E$2:E' + i + '),"")');
  }

  actualizarReportes();
  ss.toast('✅ Datos eliminados', 'OK', 4);
}
