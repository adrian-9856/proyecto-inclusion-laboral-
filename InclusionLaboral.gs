/**
 * =====================================================================
 * SISTEMA DE INCLUSIÓN LABORAL - ÁREA DE TECNOLOGÍA
 * =====================================================================
 *
 * Sistema para gestionar el proceso de inclusión laboral en programas
 * de tecnología: SAC (Cohortes I y II), Computación (Cohorte I), etc.
 *
 * INSTALACIÓN:
 * 1. Crear un nuevo Google Sheets
 * 2. Ir a Extensiones → Apps Script
 * 3. Copiar y pegar TODO este código
 * 4. Guardar (Ctrl+S)
 * 5. Ejecutar: instalarSistema
 * 6. Autorizar permisos cuando se solicite
 * 7. Refrescar la hoja de cálculo
 * 8. Usar el menú: 🎓 Inclusión Laboral
 *
 * FLUJO DEL SISTEMA:
 * 1. HOJA DE INTERÉS → Personas interesadas llenan sus datos
 * 2. ENTREVISTAS → Se agendan y realizan entrevistas
 * 3. SELECCIONADAS → Personas aprobadas se asignan a cohortes
 * 4. COHORTES → Gestión de cada cohorte activa
 * 5. ASISTENCIAS → Control de asistencia por cohorte
 * 6. GRADUADAS → Personas que completaron el programa
 * 7. DESERCIONES → Personas que abandonaron
 * 8. NO INTERESADOS → Personas que declinaron participar
 *
 * COHORTES DISPONIBLES:
 * - SAC Cohorte I
 * - SAC Cohorte II
 * - Computación Cohorte I
 * - (Configurables desde el menú)
 *
 * RESPONSABLES:
 * - Adrian Torres
 * - Paola Ortiz
 *
 * =====================================================================
 */

// =====================================================================
// CONFIGURACIÓN GLOBAL
// =====================================================================

const CONFIG = {
  // Cohortes disponibles (se pueden agregar más)
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

  // Motivos de no interés
  MOTIVOS_NO_INTERES: [
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
    'Otro'
  ],

  // Estados de entrevista
  ESTADOS_ENTREVISTA: [
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
    .addSubMenu(ui.createMenu('📋 Gestión de Cohortes')
      .addItem('➕ Agregar Nueva Cohorte', 'agregarCohorte')
      .addItem('📝 Ver/Editar Cohortes', 'verCohortes')
      .addItem('📊 Estadísticas por Cohorte', 'estadisticasCohorte'))
    .addSeparator()
    .addItem('📊 Actualizar Reportes', 'actualizarReportes')
    .addItem('💾 Guardar Reporte Mensual', 'guardarReporteMensual')
    .addSeparator()
    .addItem('📧 Configurar Email Notificaciones', 'configurarEmail')
    .addItem('👥 Configurar Emails Responsables', 'configurarEmailsResponsables')
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

  // Mantenimiento automático al abrir
  try {
    mantenimientoAutomatico();
  } catch (error) {
    Logger.log('Error en mantenimiento automático: ' + error.message);
  }
}

/**
 * Mantenimiento automático al abrir el documento
 */
function mantenimientoAutomatico() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  try {
    Logger.log('🔧 Iniciando mantenimiento automático...');

    // Actualizar reportes
    actualizarReportes();
    Logger.log('✅ Reportes actualizados');

    Logger.log('🎉 Mantenimiento automático completado');
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
      '🎯 El sistema está listo para usar.',
      'INSTALACIÓN COMPLETA',
      10
    );

    Logger.log('✅ Sistema de Inclusión Laboral instalado');

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
    'Deserciones', 'No Interesados', 'Reporte', 'Reportes Mensuales'
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

  // Eliminar hojas existentes excepto la primera
  const hojas = ss.getSheets();
  for (let i = hojas.length - 1; i > 0; i--) {
    ss.deleteSheet(hojas[i]);
  }

  // Renombrar la primera hoja
  hojas[0].setName('Hoja de Interés');

  // Crear todas las hojas
  crearHojaInteres();
  crearHojaEntrevistas();
  crearHojaSeleccionadas();
  crearHojaCohortes();
  crearHojaAsistencias();
  crearHojaGraduadas();
  crearHojaDeserciones();
  crearHojaNoInteresados();
  crearHojaReporte();
  crearHojaReportesMensuales();
}

/**
 * HOJA DE INTERÉS - Registro inicial de personas interesadas
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
    'Estado',          // M - Desplegable
    'Notas'            // N
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#1565c0')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Fórmulas automáticas para fecha y número
  for (let i = 2; i <= 500; i++) {
    sheet.getRange('A' + i).setFormula('=IF(E' + i + '<>"",TODAY(),"")');
    sheet.getRange('B' + i).setFormula('=IF(E' + i + '<>"",COUNTA($E$2:E' + i + '),"")');
  }

  // Anchos de columna
  [100, 50, 100, 130, 200, 60, 120, 150, 120, 150, 150, 120, 120, 250].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });

  // Proteger columnas automáticas
  sheet.getRange('A2:A500').protect().setWarningOnly(true);
  sheet.getRange('B2:B500').protect().setWarningOnly(true);
}

/**
 * HOJA DE ENTREVISTAS - Seguimiento de entrevistas
 */
function crearHojaEntrevistas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.insertSheet('Entrevistas');

  const headers = [
    'Fecha Entrevista', // A
    'Hora',             // B
    'Creamos ID',       // C
    'Nombre Completo',  // D
    'Teléfono',         // E
    'Programa',         // F - Desplegable
    'Entrevistador',    // G - Desplegable
    'Estado',           // H - Desplegable
    'Calificación',     // I - 1-10
    'Observaciones',    // J
    'Fecha Seguimiento' // K
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#7b1fa2')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Anchos de columna
  [120, 80, 100, 200, 120, 150, 120, 150, 100, 300, 120].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });
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

  // Anchos de columna
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

  // Datos iniciales de cohortes
  const cohortesIniciales = [
    ['SAC Cohorte I', 'Tecnología', '', '', 'Adrian Torres', 25, '', '', '', '', 'Activa', '', '', ''],
    ['SAC Cohorte II', 'Tecnología', '', '', 'Paola Ortiz', 25, '', '', '', '', 'Planificada', '', '', ''],
    ['Computación Cohorte I', 'Tecnología', '', '', 'Adrian Torres', 20, '', '', '', '', 'Planificada', '', '', ''],
    ['Por definir', 'Tecnología', '', '', '', 20, '', '', '', '', 'Planificada', '', '', '']
  ];

  sheet.getRange(2, 1, cohortesIniciales.length, 14).setValues(cohortesIniciales);

  // Fórmulas para contar participantes
  for (let i = 2; i <= 20; i++) {
    // Inscritas (cuenta en Seleccionadas)
    sheet.getRange('G' + i).setFormula('=IFERROR(COUNTIF(Seleccionadas!J:J,A' + i + '),0)');
    // Activas
    sheet.getRange('H' + i).setFormula('=IFERROR(COUNTIFS(Seleccionadas!J:J,A' + i + ',Seleccionadas!L:L,"Activa"),0)');
    // Graduadas
    sheet.getRange('I' + i).setFormula('=IFERROR(COUNTIF(Graduadas!G:G,A' + i + '),0)');
    // Deserciones
    sheet.getRange('J' + i).setFormula('=IFERROR(COUNTIF(Deserciones!G:G,A' + i + '),0)');
  }

  // Anchos de columna
  [180, 100, 120, 120, 120, 100, 80, 80, 80, 80, 100, 150, 150, 200].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });
}

/**
 * HOJA DE ASISTENCIAS - Control de asistencia
 */
function crearHojaAsistencias() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.insertSheet('Asistencias');

  const headers = [
    'Fecha',            // A
    'Cohorte',          // B - Desplegable
    'Creamos ID',       // C
    'Nombre',           // D
    'Asistió',          // E - Checkbox o Sí/No
    'Justificación',    // F
    'Notas'             // G
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#0288d1')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Anchos de columna
  [120, 180, 100, 200, 80, 200, 250].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });
}

/**
 * HOJA DE GRADUADAS - Personas que completaron el programa
 */
function crearHojaGraduadas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.insertSheet('Graduadas');

  const headers = [
    'Fecha Graduación', // A
    'Creamos ID',       // B
    'DPI',              // C
    'Nombre Completo',  // D
    'Teléfono',         // E
    'Nivel Educativo',  // F
    'Cohorte',          // G
    'Calificación Final', // H
    'Estado Seguimiento', // I - Desplegable
    'Empresa/Ocupación',  // J
    'Fecha Último Contacto', // K
    'Notas Seguimiento' // L
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#388e3c')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Anchos de columna
  [120, 100, 130, 200, 120, 150, 180, 120, 180, 200, 150, 300].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });
}

/**
 * HOJA DE DESERCIONES - Registro de deserciones
 */
function crearHojaDeserciones() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.insertSheet('Deserciones');

  const headers = [
    'Fecha Deserción',  // A
    'Creamos ID',       // B
    'DPI',              // C
    'Nombre Completo',  // D
    'Teléfono',         // E
    'Nivel Educativo',  // F
    'Cohorte',          // G
    'Clases Asistidas', // H
    'Motivo',           // I - Desplegable
    'Notas',            // J
    'Contacto Futuro'   // K - Sí/No
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#d32f2f')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Anchos de columna
  [120, 100, 130, 200, 120, 150, 180, 100, 200, 300, 120].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });
}

/**
 * HOJA DE NO INTERESADOS - Personas que declinaron
 */
function crearHojaNoInteresados() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.insertSheet('No Interesados');

  const headers = [
    'Fecha',            // A
    'Creamos ID',       // B
    'Nombre Completo',  // C
    'Teléfono',         // D
    'Etapa',            // E - En qué etapa declinó
    'Motivo',           // F - Desplegable
    'Notas',            // G
    'Recontactar'       // H - Sí/No
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#616161')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Anchos de columna
  [120, 100, 200, 120, 150, 200, 300, 100].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });
}

/**
 * HOJA DE REPORTE - Dashboard principal
 */
function crearHojaReporte() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.insertSheet('Reporte');

  const data = [
    ['REPORTE - INCLUSIÓN LABORAL', '', '', ''],
    ['Última actualización:', '=TEXT(NOW(),"DD/MM/YYYY HH:MM")', 'Mes actual:', '=TEXT(TODAY(),"MMMM YYYY")'],
    ['', '', '', ''],

    // SECCIÓN 1: INTERESADAS
    ['PERSONAS INTERESADAS', 'Total', 'Este mes', ''],
    ['Registros en Hoja de Interés', '=IFERROR(COUNTA(\'Hoja de Interés\'!E:E)-1,0)', '=IFERROR(COUNTIFS(\'Hoja de Interés\'!A:A,">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1)),0)', ''],
    ['', '', '', ''],

    // SECCIÓN 2: ENTREVISTAS
    ['ENTREVISTAS', 'Total', 'Aprobadas', 'Pendientes'],
    ['Entrevistas realizadas', '=IFERROR(COUNTA(Entrevistas!D:D)-1,0)', '=IFERROR(COUNTIF(Entrevistas!H:H,"Realizada - Aprobada"),0)', '=IFERROR(COUNTIF(Entrevistas!H:H,"Pendiente"),0)'],
    ['', '', '', ''],

    // SECCIÓN 3: SELECCIONADAS
    ['SELECCIONADAS', 'Total', 'Activas', ''],
    ['Personas seleccionadas', '=IFERROR(COUNTA(Seleccionadas!E:E)-1,0)', '=IFERROR(COUNTIF(Seleccionadas!L:L,"Activa"),0)', ''],
    ['', '', '', ''],

    // SECCIÓN 4: POR COHORTE
    ['PARTICIPANTES POR COHORTE', 'Inscritas', 'Activas', 'Graduadas'],
    ['SAC Cohorte I', '=IFERROR(COUNTIF(Seleccionadas!J:J,"SAC Cohorte I"),0)', '=IFERROR(COUNTIFS(Seleccionadas!J:J,"SAC Cohorte I",Seleccionadas!L:L,"Activa"),0)', '=IFERROR(COUNTIF(Graduadas!G:G,"SAC Cohorte I"),0)'],
    ['SAC Cohorte II', '=IFERROR(COUNTIF(Seleccionadas!J:J,"SAC Cohorte II"),0)', '=IFERROR(COUNTIFS(Seleccionadas!J:J,"SAC Cohorte II",Seleccionadas!L:L,"Activa"),0)', '=IFERROR(COUNTIF(Graduadas!G:G,"SAC Cohorte II"),0)'],
    ['Computación Cohorte I', '=IFERROR(COUNTIF(Seleccionadas!J:J,"Computación Cohorte I"),0)', '=IFERROR(COUNTIFS(Seleccionadas!J:J,"Computación Cohorte I",Seleccionadas!L:L,"Activa"),0)', '=IFERROR(COUNTIF(Graduadas!G:G,"Computación Cohorte I"),0)'],
    ['TOTAL', '=SUM(B14:B16)', '=SUM(C14:C16)', '=SUM(D14:D16)'],
    ['', '', '', ''],

    // SECCIÓN 5: GRADUADAS
    ['GRADUADAS', 'Total', 'Este mes', 'Empleadas'],
    ['Personas graduadas', '=IFERROR(COUNTA(Graduadas!D:D)-1,0)', '=IFERROR(COUNTIFS(Graduadas!A:A,">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1)),0)', '=IFERROR(COUNTIFS(Graduadas!I:I,"Empleada*"),0)'],
    ['', '', '', ''],

    // SECCIÓN 6: DESERCIONES
    ['DESERCIONES', 'Total', 'Este mes', 'Tasa'],
    ['Personas que desertaron', '=IFERROR(COUNTA(Deserciones!D:D)-1,0)', '=IFERROR(COUNTIFS(Deserciones!A:A,">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1)),0)', '=IFERROR(IF((B20+B23)>0,ROUND(B23/(B20+B23)*100,1)&"%","0%"),"0%")'],
    ['', '', '', ''],

    // SECCIÓN 7: NO INTERESADOS
    ['NO INTERESADOS', 'Total', '', ''],
    ['Personas no interesadas', '=IFERROR(COUNTA(\'No Interesados\'!C:C)-1,0)', '', ''],
    ['', '', '', ''],

    // SECCIÓN 8: RESUMEN
    ['RESUMEN GENERAL', 'Valor', '', ''],
    ['Total personas atendidas', '=B5+B8+B11', '', ''],
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

  // Formato de subtítulo
  sheet.getRange('A2:D2')
    .setBackground('#e3f2fd')
    .setFontSize(10);

  // Formato de headers de secciones
  const headerRows = [4, 7, 10, 13, 19, 22, 25, 28];
  headerRows.forEach(row => {
    sheet.getRange('A' + row + ':D' + row)
      .setBackground('#1565c0')
      .setFontColor('white')
      .setFontWeight('bold')
      .setHorizontalAlignment('center');
  });

  // Formato de filas totales
  const totalRows = [17, 29, 30, 31];
  totalRows.forEach(row => {
    sheet.getRange('A' + row + ':D' + row)
      .setBackground('#bbdefb')
      .setFontWeight('bold');
  });

  // Anchos de columna
  sheet.setColumnWidth(1, 280);
  sheet.setColumnWidth(2, 120);
  sheet.setColumnWidth(3, 120);
  sheet.setColumnWidth(4, 120);

  // Bordes
  sheet.getRange('A1:D' + data.length)
    .setBorder(true, true, true, true, true, true, '#cccccc', SpreadsheetApp.BorderStyle.SOLID);

  sheet.setFrozenRows(2);
}

/**
 * HOJA DE REPORTES MENSUALES - Histórico
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
    'No Interesados',
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

  // Anchos de columna
  [100, 90, 90, 100, 80, 80, 90, 110, 100, 80, 80, 100, 120].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });
}

// =====================================================================
// CONFIGURAR VALIDACIONES (DESPLEGABLES)
// =====================================================================

function configurarValidaciones() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Obtener cohortes actuales
  const cohortes = obtenerCohortesActuales();

  // === HOJA DE INTERÉS ===
  const interes = ss.getSheetByName('Hoja de Interés');
  if (interes) {
    // Nivel Educativo (H)
    interes.getRange('H2:H500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(CONFIG.NIVELES_EDUCATIVOS)
        .setAllowInvalid(false)
        .build()
    );

    // Zona (I)
    interes.getRange('I2:I500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(CONFIG.ZONAS)
        .setAllowInvalid(true)
        .build()
    );

    // Programa de Interés (K)
    interes.getRange('K2:K500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(cohortes)
        .setAllowInvalid(false)
        .build()
    );

    // Responsable (L)
    interes.getRange('L2:L500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(CONFIG.RESPONSABLES)
        .setAllowInvalid(false)
        .build()
    );

    // Estado (M)
    interes.getRange('M2:M500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(['Nuevo', 'Contactado', 'Entrevista agendada', 'En proceso', 'No interesado'])
        .setAllowInvalid(false)
        .build()
    );
  }

  // === HOJA DE ENTREVISTAS ===
  const entrevistas = ss.getSheetByName('Entrevistas');
  if (entrevistas) {
    // Programa (F)
    entrevistas.getRange('F2:F500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(cohortes)
        .setAllowInvalid(false)
        .build()
    );

    // Entrevistador (G)
    entrevistas.getRange('G2:G500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(CONFIG.RESPONSABLES)
        .setAllowInvalid(false)
        .build()
    );

    // Estado (H)
    entrevistas.getRange('H2:H500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(CONFIG.ESTADOS_ENTREVISTA)
        .setAllowInvalid(false)
        .build()
    );

    // Calificación (I)
    const calificaciones = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    entrevistas.getRange('I2:I500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(calificaciones)
        .setAllowInvalid(false)
        .build()
    );
  }

  // === HOJA DE SELECCIONADAS ===
  const seleccionadas = ss.getSheetByName('Seleccionadas');
  if (seleccionadas) {
    // Nivel Educativo (H)
    seleccionadas.getRange('H2:H500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(CONFIG.NIVELES_EDUCATIVOS)
        .setAllowInvalid(false)
        .build()
    );

    // Zona (I)
    seleccionadas.getRange('I2:I500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(CONFIG.ZONAS)
        .setAllowInvalid(true)
        .build()
    );

    // Cohorte Asignada (J)
    seleccionadas.getRange('J2:J500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(cohortes)
        .setAllowInvalid(false)
        .build()
    );

    // Responsable (K)
    seleccionadas.getRange('K2:K500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(CONFIG.RESPONSABLES)
        .setAllowInvalid(false)
        .build()
    );

    // Estado (L)
    seleccionadas.getRange('L2:L500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(CONFIG.ESTADOS_PARTICIPANTE)
        .setAllowInvalid(false)
        .build()
    );
  }

  // === HOJA DE ASISTENCIAS ===
  const asistencias = ss.getSheetByName('Asistencias');
  if (asistencias) {
    // Cohorte (B)
    asistencias.getRange('B2:B500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(cohortes)
        .setAllowInvalid(false)
        .build()
    );

    // Asistió (E)
    asistencias.getRange('E2:E500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(['Sí', 'No', 'Justificado'])
        .setAllowInvalid(false)
        .build()
    );
  }

  // === HOJA DE GRADUADAS ===
  const graduadas = ss.getSheetByName('Graduadas');
  if (graduadas) {
    // Nivel Educativo (F)
    graduadas.getRange('F2:F500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(CONFIG.NIVELES_EDUCATIVOS)
        .setAllowInvalid(false)
        .build()
    );

    // Cohorte (G)
    graduadas.getRange('G2:G500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(cohortes)
        .setAllowInvalid(false)
        .build()
    );

    // Estado Seguimiento (I)
    graduadas.getRange('I2:I500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(CONFIG.ESTADOS_SEGUIMIENTO)
        .setAllowInvalid(false)
        .build()
    );
  }

  // === HOJA DE DESERCIONES ===
  const deserciones = ss.getSheetByName('Deserciones');
  if (deserciones) {
    // Nivel Educativo (F)
    deserciones.getRange('F2:F500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(CONFIG.NIVELES_EDUCATIVOS)
        .setAllowInvalid(false)
        .build()
    );

    // Cohorte (G)
    deserciones.getRange('G2:G500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(cohortes)
        .setAllowInvalid(false)
        .build()
    );

    // Motivo (I)
    deserciones.getRange('I2:I500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(CONFIG.MOTIVOS_DESERCION)
        .setAllowInvalid(true)
        .build()
    );

    // Contacto Futuro (K)
    deserciones.getRange('K2:K500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(['Sí', 'No'])
        .setAllowInvalid(false)
        .build()
    );
  }

  // === HOJA DE NO INTERESADOS ===
  const noInteresados = ss.getSheetByName('No Interesados');
  if (noInteresados) {
    // Etapa (E)
    noInteresados.getRange('E2:E500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(['Interés inicial', 'Pre-entrevista', 'Post-entrevista', 'Durante programa'])
        .setAllowInvalid(false)
        .build()
    );

    // Motivo (F)
    noInteresados.getRange('F2:F500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(CONFIG.MOTIVOS_NO_INTERES)
        .setAllowInvalid(true)
        .build()
    );

    // Recontactar (H)
    noInteresados.getRange('H2:H500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(['Sí', 'No'])
        .setAllowInvalid(false)
        .build()
    );
  }

  // === HOJA DE COHORTES ===
  const cohortesSheet = ss.getSheetByName('Cohortes');
  if (cohortesSheet) {
    // Responsable (E)
    cohortesSheet.getRange('E2:E50').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(CONFIG.RESPONSABLES)
        .setAllowInvalid(false)
        .build()
    );

    // Estado (K)
    cohortesSheet.getRange('K2:K50').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(['Activa', 'Planificada', 'Finalizada', 'Cancelada'])
        .setAllowInvalid(false)
        .build()
    );
  }

  Logger.log('✅ Validaciones configuradas correctamente');
}

/**
 * Obtiene las cohortes actuales desde la hoja Cohortes
 */
function obtenerCohortesActuales() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Cohortes');

  if (!sheet) {
    return CONFIG.COHORTES; // Retorna las predeterminadas
  }

  const datos = sheet.getRange('A2:A50').getValues();
  const cohortes = [];

  datos.forEach(fila => {
    if (fila[0] && fila[0].toString().trim() !== '') {
      cohortes.push(fila[0].toString().trim());
    }
  });

  return cohortes.length > 0 ? cohortes : CONFIG.COHORTES;
}

/**
 * Aplicar formatos condicionales
 */
function aplicarFormatos() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Formato para Seleccionadas - Estado
  const seleccionadas = ss.getSheetByName('Seleccionadas');
  if (seleccionadas) {
    const rangoEstado = seleccionadas.getRange('L2:L500');

    const reglaActiva = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Activa')
      .setBackground('#c8e6c9')
      .setRanges([rangoEstado])
      .build();

    const reglaGraduada = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Graduada')
      .setBackground('#bbdefb')
      .setRanges([rangoEstado])
      .build();

    const reglaDesercion = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Deserción')
      .setBackground('#ffcdd2')
      .setRanges([rangoEstado])
      .build();

    seleccionadas.setConditionalFormatRules([reglaActiva, reglaGraduada, reglaDesercion]);
  }

  // Formato para Entrevistas - Estado
  const entrevistas = ss.getSheetByName('Entrevistas');
  if (entrevistas) {
    const rangoEstadoEnt = entrevistas.getRange('H2:H500');

    const reglaAprobada = SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains('Aprobada')
      .setBackground('#c8e6c9')
      .setRanges([rangoEstadoEnt])
      .build();

    const reglaPendiente = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Pendiente')
      .setBackground('#fff9c4')
      .setRanges([rangoEstadoEnt])
      .build();

    const reglaNoAprobada = SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains('No aprobada')
      .setBackground('#ffcdd2')
      .setRanges([rangoEstadoEnt])
      .build();

    entrevistas.setConditionalFormatRules([reglaAprobada, reglaPendiente, reglaNoAprobada]);
  }

  Logger.log('✅ Formatos aplicados');
}

// =====================================================================
// TRIGGER PRINCIPAL - AUTOMATIZACIONES
// =====================================================================

function alEditar(e) {
  if (!e || !e.range) {
    Logger.log('❌ ERROR: No hay evento o rango');
    return;
  }

  const sheet = e.range.getSheet();
  const hoja = sheet.getName();
  const fila = e.range.getRow();
  const columna = e.range.getColumn();
  const valor = e.range.getValue();

  Logger.log('📝 Edición: ' + hoja + ' [' + fila + ',' + columna + '] = ' + valor);

  if (fila <= 1) return; // Ignorar headers
  if (!valor) return;

  const val = valor.toString().trim();
  if (val === '') return;

  // === HOJA DE INTERÉS ===
  if (hoja === 'Hoja de Interés') {
    // Cambio de Estado (columna M = 13)
    if (columna === 13) {
      procesarCambioEstadoInteres(sheet, fila, val);
    }
  }

  // === ENTREVISTAS ===
  if (hoja === 'Entrevistas') {
    // Cambio de Estado (columna H = 8)
    if (columna === 8) {
      procesarCambioEstadoEntrevista(sheet, fila, val);
    }
  }

  // === SELECCIONADAS ===
  if (hoja === 'Seleccionadas') {
    // Cambio de Estado (columna L = 12)
    if (columna === 12) {
      procesarCambioEstadoParticipante(sheet, fila, val);
    }
  }
}

/**
 * Procesa cambio de estado en Hoja de Interés
 */
function procesarCambioEstadoInteres(sheet, fila, estado) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  if (estado === 'No interesado') {
    // Mover a No Interesados
    const datos = sheet.getRange(fila, 1, 1, 14).getValues()[0];

    const noInteresados = ss.getSheetByName('No Interesados');
    const nuevaFila = obtenerPrimeraFilaVacia(noInteresados, 'C');

    const registro = [
      new Date(),           // A: Fecha
      datos[2],             // B: Creamos ID
      datos[4],             // C: Nombre
      datos[6],             // D: Teléfono
      'Interés inicial',    // E: Etapa
      '',                   // F: Motivo (se llena después)
      datos[13],            // G: Notas
      'No'                  // H: Recontactar
    ];

    noInteresados.getRange(nuevaFila, 1, 1, 8).setValues([registro]);

    // Marcar fila original
    sheet.getRange(fila, 1, 1, 14).setBackground('#ffcdd2');

    ss.toast('📋 Persona movida a "No Interesados"', 'Registro', 3);
  }

  if (estado === 'Entrevista agendada') {
    // Crear registro en Entrevistas
    const datos = sheet.getRange(fila, 1, 1, 14).getValues()[0];

    const entrevistas = ss.getSheetByName('Entrevistas');
    const nuevaFila = obtenerPrimeraFilaVacia(entrevistas, 'D');

    const registro = [
      '',                   // A: Fecha Entrevista (por llenar)
      '',                   // B: Hora (por llenar)
      datos[2],             // C: Creamos ID
      datos[4],             // D: Nombre
      datos[6],             // E: Teléfono
      datos[10],            // F: Programa
      datos[11],            // G: Entrevistador
      'Agendada',           // H: Estado
      '',                   // I: Calificación
      '',                   // J: Observaciones
      ''                    // K: Fecha Seguimiento
    ];

    entrevistas.getRange(nuevaFila, 1, 1, 11).setValues([registro]);

    // Marcar fila original
    sheet.getRange(fila, 1, 1, 14).setBackground('#fff9c4');

    ss.toast('📋 Entrevista creada. Complete fecha y hora.', 'Entrevista Agendada', 3);
  }
}

/**
 * Procesa cambio de estado en Entrevistas
 */
function procesarCambioEstadoEntrevista(sheet, fila, estado) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  if (estado === 'Realizada - Aprobada') {
    // Mover a Seleccionadas
    const datos = sheet.getRange(fila, 1, 1, 11).getValues()[0];

    const seleccionadas = ss.getSheetByName('Seleccionadas');
    const nuevaFila = obtenerPrimeraFilaVacia(seleccionadas, 'E');

    // Buscar datos adicionales en Hoja de Interés
    const interes = ss.getSheetByName('Hoja de Interés');
    const datosInteres = buscarPorCreamosID(interes, datos[2]);

    const registro = [
      new Date(),           // A: Fecha Selección
      nuevaFila - 1,        // B: No.
      datos[2],             // C: Creamos ID
      datosInteres ? datosInteres[3] : '',  // D: DPI
      datos[3],             // E: Nombre
      datosInteres ? datosInteres[5] : '',  // F: Edad
      datos[4],             // G: Teléfono
      datosInteres ? datosInteres[7] : '',  // H: Nivel Educativo
      datosInteres ? datosInteres[8] : '',  // I: Zona
      datos[5],             // J: Cohorte Asignada
      datos[6],             // K: Responsable
      'Activa',             // L: Estado
      datos[9]              // M: Notas (Observaciones)
    ];

    seleccionadas.getRange(nuevaFila, 1, 1, 13).setValues([registro]);

    // Marcar fila original
    sheet.getRange(fila, 1, 1, 11).setBackground('#c8e6c9');

    ss.toast('✅ Persona aprobada y agregada a Seleccionadas', 'Aprobada', 3);

    // Enviar email de notificación
    enviarEmailAprobacion(datos[3], datos[5], datos[6]);
  }

  if (estado === 'Realizada - No aprobada') {
    // Mover a No Interesados
    const datos = sheet.getRange(fila, 1, 1, 11).getValues()[0];

    const noInteresados = ss.getSheetByName('No Interesados');
    const nuevaFila = obtenerPrimeraFilaVacia(noInteresados, 'C');

    const registro = [
      new Date(),           // A: Fecha
      datos[2],             // B: Creamos ID
      datos[3],             // C: Nombre
      datos[4],             // D: Teléfono
      'Post-entrevista',    // E: Etapa
      'No cumple requisitos', // F: Motivo
      datos[9],             // G: Notas
      'No'                  // H: Recontactar
    ];

    noInteresados.getRange(nuevaFila, 1, 1, 8).setValues([registro]);

    // Marcar fila original
    sheet.getRange(fila, 1, 1, 11).setBackground('#ffcdd2');

    ss.toast('📋 Persona movida a "No Interesados"', 'No Aprobada', 3);
  }
}

/**
 * Procesa cambio de estado en Seleccionadas
 */
function procesarCambioEstadoParticipante(sheet, fila, estado) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const datos = sheet.getRange(fila, 1, 1, 13).getValues()[0];

  if (estado === 'Graduada') {
    // Mover a Graduadas
    const graduadas = ss.getSheetByName('Graduadas');
    const nuevaFila = obtenerPrimeraFilaVacia(graduadas, 'D');

    const registro = [
      new Date(),           // A: Fecha Graduación
      datos[2],             // B: Creamos ID
      datos[3],             // C: DPI
      datos[4],             // D: Nombre
      datos[6],             // E: Teléfono
      datos[7],             // F: Nivel Educativo
      datos[9],             // G: Cohorte
      '',                   // H: Calificación Final
      'Sin seguimiento',    // I: Estado Seguimiento
      '',                   // J: Empresa/Ocupación
      '',                   // K: Fecha Último Contacto
      datos[12]             // L: Notas
    ];

    graduadas.getRange(nuevaFila, 1, 1, 12).setValues([registro]);

    // Marcar fila original
    sheet.getRange(fila, 1, 1, 13).setBackground('#c8e6c9');

    ss.toast('🎓 ¡Felicitaciones! Persona graduada registrada', 'Graduación', 4);

    // Enviar email de graduación
    enviarEmailGraduacion(datos[4], datos[9]);
  }

  if (estado === 'Deserción') {
    // Preguntar motivo
    const motivo = mostrarDialogoMotivoDesercion(datos[4]);

    if (!motivo) {
      // Usuario canceló
      sheet.getRange(fila, 12).setValue('Activa');
      return;
    }

    // Mover a Deserciones
    const deserciones = ss.getSheetByName('Deserciones');
    const nuevaFila = obtenerPrimeraFilaVacia(deserciones, 'D');

    const registro = [
      new Date(),           // A: Fecha Deserción
      datos[2],             // B: Creamos ID
      datos[3],             // C: DPI
      datos[4],             // D: Nombre
      datos[6],             // E: Teléfono
      datos[7],             // F: Nivel Educativo
      datos[9],             // G: Cohorte
      '',                   // H: Clases Asistidas (llenar después)
      motivo,               // I: Motivo
      datos[12],            // J: Notas
      'Sí'                  // K: Contacto Futuro
    ];

    deserciones.getRange(nuevaFila, 1, 1, 11).setValues([registro]);

    // Marcar fila original
    sheet.getRange(fila, 1, 1, 13).setBackground('#ffcdd2');

    ss.toast('📋 Deserción registrada: ' + motivo, 'Deserción', 4);

    // Enviar email de notificación
    enviarEmailDesercion(datos[4], datos[9], motivo);
  }
}

/**
 * Muestra diálogo para seleccionar motivo de deserción
 */
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

  if (respuesta.getSelectedButton() !== ui.Button.OK) {
    return null;
  }

  const num = parseInt(respuesta.getResponseText().trim());

  if (isNaN(num) || num < 1 || num > CONFIG.MOTIVOS_DESERCION.length) {
    ui.alert('Número inválido. Ingrese un número entre 1 y ' + CONFIG.MOTIVOS_DESERCION.length);
    return null;
  }

  return CONFIG.MOTIVOS_DESERCION[num - 1];
}

// =====================================================================
// FUNCIONES AUXILIARES
// =====================================================================

/**
 * Obtiene la primera fila vacía en una hoja
 */
function obtenerPrimeraFilaVacia(sheet, columnaReferencia) {
  const columnaIndex = columnaReferencia.charCodeAt(0) - 64; // A=1, B=2, etc.

  for (let i = 2; i <= 500; i++) {
    const valor = sheet.getRange(i, columnaIndex).getValue();
    if (!valor || valor.toString().trim() === '') {
      return i;
    }
  }
  return 501;
}

/**
 * Busca datos por Creamos ID en una hoja
 */
function buscarPorCreamosID(sheet, creamosId) {
  if (!creamosId) return null;

  const datos = sheet.getDataRange().getValues();

  for (let i = 1; i < datos.length; i++) {
    // Buscar en columna C (índice 2) para Hoja de Interés
    if (datos[i][2] && datos[i][2].toString().trim() === creamosId.toString().trim()) {
      return datos[i];
    }
  }

  return null;
}

// =====================================================================
// SISTEMA DE EMAILS
// =====================================================================

function obtenerEmailConfiguracion() {
  const props = PropertiesService.getDocumentProperties();
  let email = props.getProperty('EMAIL_NOTIFICACIONES');

  if (!email || email === '') {
    email = Session.getActiveUser().getEmail();
  }

  return email;
}

function obtenerEmailResponsable(nombreResponsable) {
  const props = PropertiesService.getDocumentProperties();
  return props.getProperty('EMAIL_' + nombreResponsable.toUpperCase().replace(' ', '_'));
}

function configurarEmail() {
  const ui = SpreadsheetApp.getUi();
  const emailActual = obtenerEmailConfiguracion();

  const respuesta = ui.prompt(
    '📧 Configurar Email para Notificaciones',
    'Email actual: ' + emailActual + '\n\nIngresa el nuevo email:',
    ui.ButtonSet.OK_CANCEL
  );

  if (respuesta.getSelectedButton() === ui.Button.OK) {
    const nuevoEmail = respuesta.getResponseText().trim();

    if (!nuevoEmail || !nuevoEmail.includes('@')) {
      ui.alert('Email inválido');
      return;
    }

    const props = PropertiesService.getDocumentProperties();
    props.setProperty('EMAIL_NOTIFICACIONES', nuevoEmail);

    SpreadsheetApp.getActiveSpreadsheet().toast(
      '✅ Email configurado: ' + nuevoEmail,
      'Configurado',
      5
    );
  }
}

function configurarEmailsResponsables() {
  const ui = SpreadsheetApp.getUi();
  const props = PropertiesService.getDocumentProperties();

  for (const responsable of CONFIG.RESPONSABLES) {
    const key = 'EMAIL_' + responsable.toUpperCase().replace(' ', '_');
    const emailActual = props.getProperty(key) || 'No configurado';

    const respuesta = ui.prompt(
      'Email de ' + responsable,
      'Email actual: ' + emailActual + '\n\nIngresa el email:',
      ui.ButtonSet.OK_CANCEL
    );

    if (respuesta.getSelectedButton() !== ui.Button.OK) {
      return;
    }

    const email = respuesta.getResponseText().trim();

    if (email && email.includes('@')) {
      props.setProperty(key, email);
    }
  }

  ui.alert('✅ Emails de responsables configurados');
}

function probarEmail() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const email = obtenerEmailConfiguracion();

  try {
    MailApp.sendEmail(
      email,
      '✅ Prueba - Sistema Inclusión Laboral',
      'Este es un email de prueba del Sistema de Inclusión Laboral.\n\n' +
      'Si recibiste este mensaje, el sistema de notificaciones está funcionando.\n\n' +
      'Fecha: ' + new Date().toLocaleString()
    );

    ss.toast('✅ Email enviado a: ' + email, 'Email Enviado', 5);
  } catch (error) {
    ss.toast('❌ Error: ' + error.message, 'Error', 5);
  }
}

function enviarEmailAprobacion(nombre, cohorte, responsable) {
  try {
    const email = obtenerEmailConfiguracion();

    MailApp.sendEmail(
      email,
      '✅ Nueva Participante Aprobada: ' + nombre,
      'NUEVA PARTICIPANTE APROBADA\n\n' +
      'Nombre: ' + nombre + '\n' +
      'Cohorte: ' + cohorte + '\n' +
      'Responsable: ' + responsable + '\n' +
      'Fecha: ' + new Date().toLocaleString() + '\n\n' +
      'Sistema de Inclusión Laboral'
    );

    Logger.log('✅ Email de aprobación enviado');
  } catch (error) {
    Logger.log('❌ Error enviando email: ' + error.message);
  }
}

function enviarEmailGraduacion(nombre, cohorte) {
  try {
    const email = obtenerEmailConfiguracion();

    MailApp.sendEmail(
      email,
      '🎓 Graduación: ' + nombre,
      '¡FELICITACIONES!\n\n' +
      'Nueva graduación registrada:\n\n' +
      'Nombre: ' + nombre + '\n' +
      'Cohorte: ' + cohorte + '\n' +
      'Fecha: ' + new Date().toLocaleString() + '\n\n' +
      'Sistema de Inclusión Laboral'
    );

    Logger.log('✅ Email de graduación enviado');
  } catch (error) {
    Logger.log('❌ Error enviando email: ' + error.message);
  }
}

function enviarEmailDesercion(nombre, cohorte, motivo) {
  try {
    const email = obtenerEmailConfiguracion();

    MailApp.sendEmail(
      email,
      '⚠️ Deserción: ' + nombre,
      'DESERCIÓN REGISTRADA\n\n' +
      'Nombre: ' + nombre + '\n' +
      'Cohorte: ' + cohorte + '\n' +
      'Motivo: ' + motivo + '\n' +
      'Fecha: ' + new Date().toLocaleString() + '\n\n' +
      'Sistema de Inclusión Laboral'
    );

    Logger.log('✅ Email de deserción enviado');
  } catch (error) {
    Logger.log('❌ Error enviando email: ' + error.message);
  }
}

// =====================================================================
// GESTIÓN DE COHORTES
// =====================================================================

function agregarCohorte() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const respNombre = ui.prompt(
    '➕ Agregar Nueva Cohorte',
    'Ingresa el nombre de la nueva cohorte:\n\n' +
    'Ejemplo: "SAC Cohorte III", "Diseño Cohorte I"',
    ui.ButtonSet.OK_CANCEL
  );

  if (respNombre.getSelectedButton() !== ui.Button.OK) return;

  const nombre = respNombre.getResponseText().trim();
  if (!nombre) {
    ui.alert('Nombre vacío');
    return;
  }

  const cohortes = ss.getSheetByName('Cohortes');
  const nuevaFila = obtenerPrimeraFilaVacia(cohortes, 'A');

  cohortes.getRange(nuevaFila, 1).setValue(nombre);
  cohortes.getRange(nuevaFila, 2).setValue('Tecnología');
  cohortes.getRange(nuevaFila, 6).setValue(20);
  cohortes.getRange(nuevaFila, 11).setValue('Planificada');

  // Actualizar fórmulas
  cohortes.getRange('G' + nuevaFila).setFormula('=IFERROR(COUNTIF(Seleccionadas!J:J,A' + nuevaFila + '),0)');
  cohortes.getRange('H' + nuevaFila).setFormula('=IFERROR(COUNTIFS(Seleccionadas!J:J,A' + nuevaFila + ',Seleccionadas!L:L,"Activa"),0)');
  cohortes.getRange('I' + nuevaFila).setFormula('=IFERROR(COUNTIF(Graduadas!G:G,A' + nuevaFila + '),0)');
  cohortes.getRange('J' + nuevaFila).setFormula('=IFERROR(COUNTIF(Deserciones!G:G,A' + nuevaFila + '),0)');

  // Actualizar validaciones
  configurarValidaciones();

  ss.toast('✅ Cohorte "' + nombre + '" agregada', 'Nueva Cohorte', 4);
}

function verCohortes() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const cohortes = obtenerCohortesActuales();

  let mensaje = '📋 COHORTES CONFIGURADAS:\n\n';
  cohortes.forEach((c, i) => {
    mensaje += (i + 1) + '. ' + c + '\n';
  });

  ui.alert('Cohortes', mensaje, ui.ButtonSet.OK);
}

function estadisticasCohorte() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const cohortesSheet = ss.getSheetByName('Cohortes');
  const datos = cohortesSheet.getDataRange().getValues();

  let mensaje = '📊 ESTADÍSTICAS POR COHORTE:\n\n';

  for (let i = 1; i < datos.length; i++) {
    if (datos[i][0]) {
      mensaje += '━━━━━━━━━━━━━━━━━━━━━━\n';
      mensaje += '📚 ' + datos[i][0] + '\n';
      mensaje += '   Estado: ' + (datos[i][10] || 'N/A') + '\n';
      mensaje += '   Inscritas: ' + (datos[i][6] || 0) + '\n';
      mensaje += '   Activas: ' + (datos[i][7] || 0) + '\n';
      mensaje += '   Graduadas: ' + (datos[i][8] || 0) + '\n';
      mensaje += '   Deserciones: ' + (datos[i][9] || 0) + '\n';
    }
  }

  ui.alert('Estadísticas', mensaje, ui.ButtonSet.OK);
}

// =====================================================================
// REPORTES
// =====================================================================

function actualizarReportes() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const reporte = ss.getSheetByName('Reporte');

    if (!reporte) {
      Logger.log('Hoja Reporte no encontrada');
      return;
    }

    // Actualizar fecha
    reporte.getRange('B2').setValue(new Date());

    SpreadsheetApp.flush();

    Logger.log('📊 Reportes actualizados');
    return true;
  } catch (error) {
    Logger.log('❌ Error: ' + error.message);
    return false;
  }
}

function guardarReporteMensual() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const reporte = ss.getSheetByName('Reporte');
    const mensuales = ss.getSheetByName('Reportes Mensuales');

    const mesActual = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MMMM yyyy');

    const datos = [
      mesActual,
      reporte.getRange('B5').getValue(),   // Interesadas
      reporte.getRange('B8').getValue(),   // Entrevistas
      reporte.getRange('B11').getValue(),  // Seleccionadas
      reporte.getRange('C11').getValue(),  // Activas
      reporte.getRange('B20').getValue(),  // Graduadas
      reporte.getRange('B23').getValue(),  // Deserciones
      reporte.getRange('B26').getValue(),  // No Interesados
      reporte.getRange('B30').getValue(),  // Tasa Éxito
      reporte.getRange('B14').getValue(),  // SAC I
      reporte.getRange('B15').getValue(),  // SAC II
      reporte.getRange('B16').getValue(),  // Computación I
      new Date()
    ];

    const nuevaFila = mensuales.getLastRow() + 1;
    mensuales.getRange(nuevaFila, 1, 1, 13).setValues([datos]);

    ss.toast('✅ Reporte mensual guardado: ' + mesActual, 'Guardado', 5);

  } catch (error) {
    Logger.log('❌ Error: ' + error.message);
    SpreadsheetApp.getActiveSpreadsheet().toast('Error: ' + error.message, 'Error', 5);
  }
}

// =====================================================================
// TRIGGERS
// =====================================================================

function instalarTriggers() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const triggers = ScriptApp.getProjectTriggers();

    // Eliminar triggers existentes
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'alEditar' ||
          trigger.getHandlerFunction() === 'actualizarReportes') {
        ScriptApp.deleteTrigger(trigger);
      }
    });

    // Trigger onEdit
    ScriptApp.newTrigger('alEditar')
      .forSpreadsheet(ss)
      .onEdit()
      .create();

    // Trigger de tiempo (cada hora)
    ScriptApp.newTrigger('actualizarReportes')
      .timeBased()
      .everyHours(1)
      .create();

    Logger.log('✅ Triggers instalados');
    return true;
  } catch (error) {
    Logger.log('❌ Error: ' + error.message);
    return false;
  }
}

// =====================================================================
// REPARACIÓN Y MANTENIMIENTO
// =====================================================================

function repararValidaciones() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  try {
    ss.toast('🔧 Reparando validaciones...', 'Reparando', 2);

    // Limpiar validaciones existentes
    const hojas = ['Hoja de Interés', 'Entrevistas', 'Seleccionadas',
                   'Cohortes', 'Asistencias', 'Graduadas',
                   'Deserciones', 'No Interesados'];

    hojas.forEach(nombre => {
      const hoja = ss.getSheetByName(nombre);
      if (hoja) {
        hoja.getRange('A1:Z500').clearDataValidations();
      }
    });

    // Reconfigurar
    configurarValidaciones();
    aplicarFormatos();

    ss.toast('✅ Validaciones reparadas', 'Completado', 5);

  } catch (error) {
    ss.toast('❌ Error: ' + error.message, 'Error', 5);
  }
}

function repararFormulas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  try {
    ss.toast('🔧 Reparando fórmulas...', 'Reparando', 2);

    // Reparar fórmulas de Hoja de Interés
    const interes = ss.getSheetByName('Hoja de Interés');
    if (interes) {
      for (let i = 2; i <= 500; i++) {
        interes.getRange('A' + i).setFormula('=IF(E' + i + '<>"",TODAY(),"")');
        interes.getRange('B' + i).setFormula('=IF(E' + i + '<>"",COUNTA($E$2:E' + i + '),"")');
      }
    }

    // Reparar fórmulas de Cohortes
    const cohortes = ss.getSheetByName('Cohortes');
    if (cohortes) {
      for (let i = 2; i <= 20; i++) {
        cohortes.getRange('G' + i).setFormula('=IFERROR(COUNTIF(Seleccionadas!J:J,A' + i + '),0)');
        cohortes.getRange('H' + i).setFormula('=IFERROR(COUNTIFS(Seleccionadas!J:J,A' + i + ',Seleccionadas!L:L,"Activa"),0)');
        cohortes.getRange('I' + i).setFormula('=IFERROR(COUNTIF(Graduadas!G:G,A' + i + '),0)');
        cohortes.getRange('J' + i).setFormula('=IFERROR(COUNTIF(Deserciones!G:G,A' + i + '),0)');
      }
    }

    ss.toast('✅ Fórmulas reparadas', 'Completado', 5);

  } catch (error) {
    ss.toast('❌ Error: ' + error.message, 'Error', 5);
  }
}

// =====================================================================
// DATOS DE PRUEBA Y LIMPIEZA
// =====================================================================

function crearDatosPrueba() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const resp = ui.alert(
    'Crear Datos de Prueba',
    '¿Crear datos de ejemplo para probar el sistema?',
    ui.ButtonSet.YES_NO
  );

  if (resp !== ui.Button.YES) return;

  const interes = ss.getSheetByName('Hoja de Interés');

  const datosPrueba = [
    ['', '', 'CR001', '1234567890101', 'María García López', '22', '5555-1234', 'Diversificado completo', 'Zona 1', 'Redes sociales', 'SAC Cohorte I', 'Adrian Torres', 'Nuevo', ''],
    ['', '', 'CR002', '2345678901212', 'Ana Martínez Pérez', '25', '5555-5678', 'Universitario incompleto', 'Zona 7', 'Referido', 'SAC Cohorte I', 'Paola Ortiz', 'Nuevo', ''],
    ['', '', 'CR003', '3456789012323', 'Laura Hernández', '19', '5555-9012', 'Básicos completos', 'Mixco', 'Facebook', 'Computación Cohorte I', 'Adrian Torres', 'Nuevo', '']
  ];

  interes.getRange(2, 1, datosPrueba.length, 14).setValues(datosPrueba);

  ss.toast('✅ 3 registros de prueba creados', 'Datos de Prueba', 5);
}

function limpiarTodosLosDatos() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const resp = ui.alert(
    '⚠️ CONFIRMAR LIMPIEZA',
    '¿Eliminar TODOS los datos?\n\nEsta acción NO se puede deshacer.',
    ui.ButtonSet.YES_NO
  );

  if (resp !== ui.Button.YES) return;

  try {
    const hojas = ['Hoja de Interés', 'Entrevistas', 'Seleccionadas',
                   'Asistencias', 'Graduadas', 'Deserciones',
                   'No Interesados', 'Reportes Mensuales'];

    hojas.forEach(nombre => {
      const hoja = ss.getSheetByName(nombre);
      if (hoja && hoja.getLastRow() > 1) {
        hoja.getRange(2, 1, hoja.getLastRow() - 1, hoja.getLastColumn()).clearContent();
        hoja.getRange(2, 1, hoja.getLastRow() - 1, hoja.getLastColumn()).setBackground(null);
      }
    });

    // Restaurar fórmulas de Hoja de Interés
    const interes = ss.getSheetByName('Hoja de Interés');
    for (let i = 2; i <= 100; i++) {
      interes.getRange('A' + i).setFormula('=IF(E' + i + '<>"",TODAY(),"")');
      interes.getRange('B' + i).setFormula('=IF(E' + i + '<>"",COUNTA($E$2:E' + i + '),"")');
    }

    actualizarReportes();

    ss.toast('✅ Todos los datos han sido eliminados', 'Limpieza Completa', 5);

  } catch (error) {
    ss.toast('❌ Error: ' + error.message, 'Error', 5);
  }
}
