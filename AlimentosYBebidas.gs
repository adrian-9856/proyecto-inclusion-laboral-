/**
 * =====================================================================
 * SISTEMA DE INCLUSIÓN LABORAL - ÁREA DE ALIMENTOS Y BEBIDAS
 * =====================================================================
 *
 * Sistema para gestionar el proceso de inclusión laboral en programas
 * de Alimentos y Bebidas: Cocina, Repostería, Barismo, etc.
 *
 * INSTALACIÓN:
 * 1. Crear un nuevo Google Sheets
 * 2. Ir a Extensiones → Apps Script
 * 3. Copiar y pegar TODO este código
 * 4. Guardar (Ctrl+S)
 * 5. Ejecutar: instalarSistema
 * 6. Autorizar permisos cuando se solicite
 * 7. Refrescar la hoja de cálculo
 * 8. Usar el menú: 🍽️ Alimentos y Bebidas
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
 * =====================================================================
 */

// =====================================================================
// CONFIGURACIÓN GLOBAL - ALIMENTOS Y BEBIDAS
// =====================================================================

const CONFIG = {
  // Nombre del programa
  NOMBRE_PROGRAMA: 'Alimentos y Bebidas',

  // Cohortes disponibles (se pueden agregar más desde el menú)
  COHORTES: [
    'Cocina Cohorte I',
    'Cocina Cohorte II',
    'Repostería Cohorte I',
    'Barismo Cohorte I',
    'Por definir'
  ],

  // Responsables del programa (modificar según necesidad)
  RESPONSABLES: [
    'Responsable 1',
    'Responsable 2'
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
    'Alergia a ingredientes',
    'No se adapta al trabajo en cocina',
    'Otro'
  ],

  // Motivos de no interés
  MOTIVOS_NO_INTERES: [
    'No le interesa el área de alimentos',
    'Horarios no compatibles',
    'Ubicación no conveniente',
    'Ya tiene otro programa',
    'Consiguió empleo',
    'Cambio de planes',
    'Problemas personales',
    'No cumple requisitos',
    'Sin respuesta después de contacto',
    'Número equivocado/no válido',
    'Prefiere área de tecnología',
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
    'Empleada - Restaurante',
    'Empleada - Hotel',
    'Empleada - Cafetería',
    'Empleada - Panadería/Repostería',
    'Empleada - Otra área alimentos',
    'Empleada - Otra área',
    'Emprendimiento propio',
    'Buscando empleo',
    'Continuando estudios',
    'Sin seguimiento',
    'No contactable'
  ],

  // Especialidades (específico de Alimentos y Bebidas)
  ESPECIALIDADES: [
    'Cocina general',
    'Repostería y panadería',
    'Barismo',
    'Cocina internacional',
    'Cocina guatemalteca',
    'Pastelería',
    'Otro'
  ]
};

// =====================================================================
// MENÚ PRINCIPAL
// =====================================================================

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🍽️ Alimentos y Bebidas')
    .addItem('🚀 Instalar Sistema', 'instalarSistema')
    .addItem('✅ Verificar Instalación', 'verificarInstalacion')
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

    Logger.log('✅ Sistema de Alimentos y Bebidas instalado');

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
    'Especialidad',    // L - Desplegable (nuevo para A&B)
    'Responsable',     // M - Desplegable
    'Estado',          // N - Desplegable
    'Notas'            // O
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#ff6f00')  // Naranja para A&B
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Fórmulas automáticas para fecha y número
  for (let i = 2; i <= 500; i++) {
    sheet.getRange('A' + i).setFormula('=IF(E' + i + '<>"",TODAY(),"")');
    sheet.getRange('B' + i).setFormula('=IF(E' + i + '<>"",COUNTA($E$2:E' + i + '),"")');
  }

  // Anchos de columna
  [100, 50, 100, 130, 200, 60, 120, 150, 120, 150, 150, 150, 120, 120, 250].forEach((w, i) => {
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
    'Especialidad',     // G - Desplegable
    'Entrevistador',    // H - Desplegable
    'Estado',           // I - Desplegable
    'Calificación',     // J - 1-10
    'Observaciones',    // K
    'Fecha Seguimiento' // L
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#e65100')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Anchos de columna
  [120, 80, 100, 200, 120, 150, 150, 120, 150, 100, 300, 120].forEach((w, i) => {
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
    'Especialidad',     // K
    'Responsable',      // L - Desplegable
    'Estado',           // M - Desplegable
    'Notas'             // N
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#2e7d32')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Anchos de columna
  [120, 50, 100, 130, 200, 60, 120, 150, 120, 180, 150, 120, 100, 250].forEach((w, i) => {
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
    'Especialidad',       // C
    'Fecha Inicio',       // D
    'Fecha Fin Estimada', // E
    'Responsable',        // F
    'Cupo Máximo',        // G
    'Inscritas',          // H - Fórmula
    'Activas',            // I - Fórmula
    'Graduadas',          // J - Fórmula
    'Deserciones',        // K - Fórmula
    'Estado',             // L
    'Ubicación',          // M
    'Horario',            // N
    'Notas'               // O
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#bf360c')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Datos iniciales de cohortes
  const cohortesIniciales = [
    ['Cocina Cohorte I', 'Alimentos y Bebidas', 'Cocina general', '', '', '', 20, '', '', '', '', 'Activa', '', '', ''],
    ['Cocina Cohorte II', 'Alimentos y Bebidas', 'Cocina general', '', '', '', 20, '', '', '', '', 'Planificada', '', '', ''],
    ['Repostería Cohorte I', 'Alimentos y Bebidas', 'Repostería y panadería', '', '', '', 15, '', '', '', '', 'Planificada', '', '', ''],
    ['Barismo Cohorte I', 'Alimentos y Bebidas', 'Barismo', '', '', '', 15, '', '', '', '', 'Planificada', '', '', ''],
    ['Por definir', 'Alimentos y Bebidas', '', '', '', '', 20, '', '', '', '', 'Planificada', '', '', '']
  ];

  sheet.getRange(2, 1, cohortesIniciales.length, 15).setValues(cohortesIniciales);

  // Fórmulas para contar participantes
  for (let i = 2; i <= 30; i++) {
    sheet.getRange('H' + i).setFormula('=IFERROR(COUNTIF(Seleccionadas!J:J,A' + i + '),0)');
    sheet.getRange('I' + i).setFormula('=IFERROR(COUNTIFS(Seleccionadas!J:J,A' + i + ',Seleccionadas!M:M,"Activa"),0)');
    sheet.getRange('J' + i).setFormula('=IFERROR(COUNTIF(Graduadas!G:G,A' + i + '),0)');
    sheet.getRange('K' + i).setFormula('=IFERROR(COUNTIF(Deserciones!G:G,A' + i + '),0)');
  }

  // Anchos de columna
  [180, 150, 150, 120, 120, 120, 100, 80, 80, 80, 80, 100, 150, 150, 200].forEach((w, i) => {
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
    'Especialidad',     // H
    'Calificación Final', // I
    'Estado Seguimiento', // J - Desplegable
    'Empresa/Ocupación',  // K
    'Fecha Último Contacto', // L
    'Notas Seguimiento' // M
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#388e3c')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Anchos de columna
  [120, 100, 130, 200, 120, 150, 180, 150, 120, 180, 200, 150, 300].forEach((w, i) => {
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
    'Especialidad',     // H
    'Clases Asistidas', // I
    'Motivo',           // J - Desplegable
    'Notas',            // K
    'Contacto Futuro'   // L - Sí/No
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#d32f2f')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Anchos de columna
  [120, 100, 130, 200, 120, 150, 180, 150, 100, 200, 300, 120].forEach((w, i) => {
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
    ['REPORTE - ALIMENTOS Y BEBIDAS', '', '', ''],
    ['Última actualización:', '=TEXT(NOW(),"DD/MM/YYYY HH:MM")', 'Mes actual:', '=TEXT(TODAY(),"MMMM YYYY")'],
    ['', '', '', ''],

    // SECCIÓN 1: INTERESADAS
    ['PERSONAS INTERESADAS', 'Total', 'Este mes', ''],
    ['Registros en Hoja de Interés', '=IFERROR(COUNTA(\'Hoja de Interés\'!E:E)-1,0)', '=IFERROR(COUNTIFS(\'Hoja de Interés\'!A:A,">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1)),0)', ''],
    ['', '', '', ''],

    // SECCIÓN 2: ENTREVISTAS
    ['ENTREVISTAS', 'Total', 'Aprobadas', 'Pendientes'],
    ['Entrevistas realizadas', '=IFERROR(COUNTA(Entrevistas!D:D)-1,0)', '=IFERROR(COUNTIF(Entrevistas!I:I,"Realizada - Aprobada"),0)', '=IFERROR(COUNTIF(Entrevistas!I:I,"Pendiente"),0)'],
    ['', '', '', ''],

    // SECCIÓN 3: SELECCIONADAS
    ['SELECCIONADAS', 'Total', 'Activas', ''],
    ['Personas seleccionadas', '=IFERROR(COUNTA(Seleccionadas!E:E)-1,0)', '=IFERROR(COUNTIF(Seleccionadas!M:M,"Activa"),0)', ''],
    ['', '', '', ''],

    // SECCIÓN 4: POR COHORTE
    ['PARTICIPANTES POR COHORTE', 'Inscritas', 'Activas', 'Graduadas'],
    ['Cocina Cohorte I', '=IFERROR(COUNTIF(Seleccionadas!J:J,"Cocina Cohorte I"),0)', '=IFERROR(COUNTIFS(Seleccionadas!J:J,"Cocina Cohorte I",Seleccionadas!M:M,"Activa"),0)', '=IFERROR(COUNTIF(Graduadas!G:G,"Cocina Cohorte I"),0)'],
    ['Cocina Cohorte II', '=IFERROR(COUNTIF(Seleccionadas!J:J,"Cocina Cohorte II"),0)', '=IFERROR(COUNTIFS(Seleccionadas!J:J,"Cocina Cohorte II",Seleccionadas!M:M,"Activa"),0)', '=IFERROR(COUNTIF(Graduadas!G:G,"Cocina Cohorte II"),0)'],
    ['Repostería Cohorte I', '=IFERROR(COUNTIF(Seleccionadas!J:J,"Repostería Cohorte I"),0)', '=IFERROR(COUNTIFS(Seleccionadas!J:J,"Repostería Cohorte I",Seleccionadas!M:M,"Activa"),0)', '=IFERROR(COUNTIF(Graduadas!G:G,"Repostería Cohorte I"),0)'],
    ['Barismo Cohorte I', '=IFERROR(COUNTIF(Seleccionadas!J:J,"Barismo Cohorte I"),0)', '=IFERROR(COUNTIFS(Seleccionadas!J:J,"Barismo Cohorte I",Seleccionadas!M:M,"Activa"),0)', '=IFERROR(COUNTIF(Graduadas!G:G,"Barismo Cohorte I"),0)'],
    ['TOTAL', '=SUM(B14:B17)', '=SUM(C14:C17)', '=SUM(D14:D17)'],
    ['', '', '', ''],

    // SECCIÓN 5: POR ESPECIALIDAD
    ['POR ESPECIALIDAD', 'Total', '', ''],
    ['Cocina general', '=IFERROR(COUNTIF(Seleccionadas!K:K,"Cocina general"),0)', '', ''],
    ['Repostería y panadería', '=IFERROR(COUNTIF(Seleccionadas!K:K,"Repostería y panadería"),0)', '', ''],
    ['Barismo', '=IFERROR(COUNTIF(Seleccionadas!K:K,"Barismo"),0)', '', ''],
    ['', '', '', ''],

    // SECCIÓN 6: GRADUADAS
    ['GRADUADAS', 'Total', 'Este mes', 'Empleadas'],
    ['Personas graduadas', '=IFERROR(COUNTA(Graduadas!D:D)-1,0)', '=IFERROR(COUNTIFS(Graduadas!A:A,">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1)),0)', '=IFERROR(COUNTIFS(Graduadas!J:J,"Empleada*"),0)'],
    ['', '', '', ''],

    // SECCIÓN 7: DESERCIONES
    ['DESERCIONES', 'Total', 'Este mes', 'Tasa'],
    ['Personas que desertaron', '=IFERROR(COUNTA(Deserciones!D:D)-1,0)', '=IFERROR(COUNTIFS(Deserciones!A:A,">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1)),0)', '=IFERROR(IF((B26+B29)>0,ROUND(B29/(B26+B29)*100,1)&"%","0%"),"0%")'],
    ['', '', '', ''],

    // SECCIÓN 8: RESUMEN
    ['RESUMEN GENERAL', 'Valor', '', ''],
    ['Total personas atendidas', '=B5+B8+B11', '', ''],
    ['Tasa de éxito (graduadas/seleccionadas)', '=IFERROR(IF(B11>0,ROUND(B26/B11*100,1)&"%","0%"),"0%")', '', ''],
    ['Participantes activas actualmente', '=C11', '', '']
  ];

  sheet.getRange(1, 1, data.length, 4).setValues(data);

  // Formato del título
  sheet.getRange('A1:D1')
    .merge()
    .setBackground('#ff6f00')
    .setFontColor('white')
    .setFontWeight('bold')
    .setFontSize(16)
    .setHorizontalAlignment('center');
  sheet.setRowHeight(1, 45);

  // Formato de subtítulo
  sheet.getRange('A2:D2')
    .setBackground('#fff3e0')
    .setFontSize(10);

  // Formato de headers de secciones
  const headerRows = [4, 7, 10, 13, 20, 25, 28, 31];
  headerRows.forEach(row => {
    sheet.getRange('A' + row + ':D' + row)
      .setBackground('#e65100')
      .setFontColor('white')
      .setFontWeight('bold')
      .setHorizontalAlignment('center');
  });

  // Formato de filas totales
  const totalRows = [18, 32, 33, 34];
  totalRows.forEach(row => {
    sheet.getRange('A' + row + ':D' + row)
      .setBackground('#ffe0b2')
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
    'Cocina I',
    'Cocina II',
    'Repostería I',
    'Barismo I',
    'Fecha Guardado'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#bf360c')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Anchos de columna
  [100, 90, 90, 100, 80, 80, 90, 110, 100, 80, 80, 90, 80, 120].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });
}

// =====================================================================
// CONFIGURAR VALIDACIONES (DESPLEGABLES)
// =====================================================================

function configurarValidaciones() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Obtener cohortes y responsables actuales
  const cohortes = obtenerCohortesActuales();
  const responsables = obtenerResponsablesActuales();

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

    // Especialidad (L)
    interes.getRange('L2:L500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(CONFIG.ESPECIALIDADES)
        .setAllowInvalid(false)
        .build()
    );

    // Responsable (M)
    interes.getRange('M2:M500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(responsables)
        .setAllowInvalid(false)
        .build()
    );

    // Estado (N)
    interes.getRange('N2:N500').setDataValidation(
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

    // Especialidad (G)
    entrevistas.getRange('G2:G500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(CONFIG.ESPECIALIDADES)
        .setAllowInvalid(false)
        .build()
    );

    // Entrevistador (H)
    entrevistas.getRange('H2:H500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(responsables)
        .setAllowInvalid(false)
        .build()
    );

    // Estado (I)
    entrevistas.getRange('I2:I500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(CONFIG.ESTADOS_ENTREVISTA)
        .setAllowInvalid(false)
        .build()
    );

    // Calificación (J)
    const calificaciones = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    entrevistas.getRange('J2:J500').setDataValidation(
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

    // Especialidad (K)
    seleccionadas.getRange('K2:K500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(CONFIG.ESPECIALIDADES)
        .setAllowInvalid(false)
        .build()
    );

    // Responsable (L)
    seleccionadas.getRange('L2:L500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(responsables)
        .setAllowInvalid(false)
        .build()
    );

    // Estado (M)
    seleccionadas.getRange('M2:M500').setDataValidation(
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
    // Cohorte (G)
    graduadas.getRange('G2:G500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(cohortes)
        .setAllowInvalid(false)
        .build()
    );

    // Especialidad (H)
    graduadas.getRange('H2:H500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(CONFIG.ESPECIALIDADES)
        .setAllowInvalid(false)
        .build()
    );

    // Estado Seguimiento (J)
    graduadas.getRange('J2:J500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(CONFIG.ESTADOS_SEGUIMIENTO)
        .setAllowInvalid(false)
        .build()
    );
  }

  // === HOJA DE DESERCIONES ===
  const deserciones = ss.getSheetByName('Deserciones');
  if (deserciones) {
    // Cohorte (G)
    deserciones.getRange('G2:G500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(cohortes)
        .setAllowInvalid(false)
        .build()
    );

    // Especialidad (H)
    deserciones.getRange('H2:H500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(CONFIG.ESPECIALIDADES)
        .setAllowInvalid(false)
        .build()
    );

    // Motivo (J)
    deserciones.getRange('J2:J500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(CONFIG.MOTIVOS_DESERCION)
        .setAllowInvalid(true)
        .build()
    );

    // Contacto Futuro (L)
    deserciones.getRange('L2:L500').setDataValidation(
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
    // Especialidad (C)
    cohortesSheet.getRange('C2:C50').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(CONFIG.ESPECIALIDADES)
        .setAllowInvalid(false)
        .build()
    );

    // Responsable (F)
    cohortesSheet.getRange('F2:F50').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(responsables)
        .setAllowInvalid(false)
        .build()
    );

    // Estado (L)
    cohortesSheet.getRange('L2:L50').setDataValidation(
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
    return CONFIG.COHORTES;
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
 * Obtiene los responsables actuales (desde propiedades o configuración)
 */
function obtenerResponsablesActuales() {
  const props = PropertiesService.getDocumentProperties();
  const responsablesJSON = props.getProperty('RESPONSABLES');

  if (responsablesJSON) {
    try {
      const responsables = JSON.parse(responsablesJSON);
      if (responsables.length > 0) {
        return responsables;
      }
    } catch (e) {
      Logger.log('Error parseando responsables: ' + e.message);
    }
  }

  return CONFIG.RESPONSABLES;
}

/**
 * Guarda los responsables
 */
function guardarResponsables(responsables) {
  const props = PropertiesService.getDocumentProperties();
  props.setProperty('RESPONSABLES', JSON.stringify(responsables));
}

/**
 * Aplicar formatos condicionales
 */
function aplicarFormatos() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Formato para Seleccionadas - Estado
  const seleccionadas = ss.getSheetByName('Seleccionadas');
  if (seleccionadas) {
    const rangoEstado = seleccionadas.getRange('M2:M500');

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

  if (fila <= 1) return;
  if (!valor) return;

  const val = valor.toString().trim();
  if (val === '') return;

  // === HOJA DE INTERÉS ===
  if (hoja === 'Hoja de Interés') {
    // Cambio de Estado (columna N = 14)
    if (columna === 14) {
      procesarCambioEstadoInteres(sheet, fila, val);
    }
  }

  // === ENTREVISTAS ===
  if (hoja === 'Entrevistas') {
    // Cambio de Estado (columna I = 9)
    if (columna === 9) {
      procesarCambioEstadoEntrevista(sheet, fila, val);
    }
  }

  // === SELECCIONADAS ===
  if (hoja === 'Seleccionadas') {
    // Cambio de Estado (columna M = 13)
    if (columna === 13) {
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
    const datos = sheet.getRange(fila, 1, 1, 15).getValues()[0];

    const noInteresados = ss.getSheetByName('No Interesados');
    const nuevaFila = obtenerPrimeraFilaVacia(noInteresados, 'C');

    const registro = [
      new Date(),
      datos[2],             // Creamos ID
      datos[4],             // Nombre
      datos[6],             // Teléfono
      'Interés inicial',
      '',
      datos[14],            // Notas
      'No'
    ];

    noInteresados.getRange(nuevaFila, 1, 1, 8).setValues([registro]);
    sheet.getRange(fila, 1, 1, 15).setBackground('#ffcdd2');

    ss.toast('📋 Persona movida a "No Interesados"', 'Registro', 3);
  }

  if (estado === 'Entrevista agendada') {
    const datos = sheet.getRange(fila, 1, 1, 15).getValues()[0];

    const entrevistas = ss.getSheetByName('Entrevistas');
    const nuevaFila = obtenerPrimeraFilaVacia(entrevistas, 'D');

    const registro = [
      '',                   // Fecha Entrevista
      '',                   // Hora
      datos[2],             // Creamos ID
      datos[4],             // Nombre
      datos[6],             // Teléfono
      datos[10],            // Programa
      datos[11],            // Especialidad
      datos[12],            // Entrevistador
      'Agendada',
      '',
      '',
      ''
    ];

    entrevistas.getRange(nuevaFila, 1, 1, 12).setValues([registro]);
    sheet.getRange(fila, 1, 1, 15).setBackground('#fff9c4');

    ss.toast('📋 Entrevista creada. Complete fecha y hora.', 'Entrevista Agendada', 3);
  }
}

/**
 * Procesa cambio de estado en Entrevistas
 */
function procesarCambioEstadoEntrevista(sheet, fila, estado) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  if (estado === 'Realizada - Aprobada') {
    const datos = sheet.getRange(fila, 1, 1, 12).getValues()[0];

    const seleccionadas = ss.getSheetByName('Seleccionadas');
    const nuevaFila = obtenerPrimeraFilaVacia(seleccionadas, 'E');

    const interes = ss.getSheetByName('Hoja de Interés');
    const datosInteres = buscarPorCreamosID(interes, datos[2]);

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
      datos[5],             // Cohorte
      datos[6],             // Especialidad
      datos[7],             // Responsable
      'Activa',
      datos[10]             // Observaciones
    ];

    seleccionadas.getRange(nuevaFila, 1, 1, 14).setValues([registro]);
    sheet.getRange(fila, 1, 1, 12).setBackground('#c8e6c9');

    ss.toast('✅ Persona aprobada y agregada a Seleccionadas', 'Aprobada', 3);
    enviarEmailAprobacion(datos[3], datos[5], datos[7]);
  }

  if (estado === 'Realizada - No aprobada') {
    const datos = sheet.getRange(fila, 1, 1, 12).getValues()[0];

    const noInteresados = ss.getSheetByName('No Interesados');
    const nuevaFila = obtenerPrimeraFilaVacia(noInteresados, 'C');

    const registro = [
      new Date(),
      datos[2],
      datos[3],
      datos[4],
      'Post-entrevista',
      'No cumple requisitos',
      datos[10],
      'No'
    ];

    noInteresados.getRange(nuevaFila, 1, 1, 8).setValues([registro]);
    sheet.getRange(fila, 1, 1, 12).setBackground('#ffcdd2');

    ss.toast('📋 Persona movida a "No Interesados"', 'No Aprobada', 3);
  }
}

/**
 * Procesa cambio de estado en Seleccionadas
 */
function procesarCambioEstadoParticipante(sheet, fila, estado) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const datos = sheet.getRange(fila, 1, 1, 14).getValues()[0];

  if (estado === 'Graduada') {
    const graduadas = ss.getSheetByName('Graduadas');
    const nuevaFila = obtenerPrimeraFilaVacia(graduadas, 'D');

    const registro = [
      new Date(),
      datos[2],             // Creamos ID
      datos[3],             // DPI
      datos[4],             // Nombre
      datos[6],             // Teléfono
      datos[7],             // Nivel Educativo
      datos[9],             // Cohorte
      datos[10],            // Especialidad
      '',                   // Calificación Final
      'Sin seguimiento',
      '',
      '',
      datos[13]             // Notas
    ];

    graduadas.getRange(nuevaFila, 1, 1, 13).setValues([registro]);
    sheet.getRange(fila, 1, 1, 14).setBackground('#c8e6c9');

    ss.toast('🎓 ¡Felicitaciones! Persona graduada registrada', 'Graduación', 4);
    enviarEmailGraduacion(datos[4], datos[9]);
  }

  if (estado === 'Deserción') {
    const motivo = mostrarDialogoMotivoDesercion(datos[4]);

    if (!motivo) {
      sheet.getRange(fila, 13).setValue('Activa');
      return;
    }

    const deserciones = ss.getSheetByName('Deserciones');
    const nuevaFila = obtenerPrimeraFilaVacia(deserciones, 'D');

    const registro = [
      new Date(),
      datos[2],             // Creamos ID
      datos[3],             // DPI
      datos[4],             // Nombre
      datos[6],             // Teléfono
      datos[7],             // Nivel Educativo
      datos[9],             // Cohorte
      datos[10],            // Especialidad
      '',                   // Clases Asistidas
      motivo,
      datos[13],            // Notas
      'Sí'
    ];

    deserciones.getRange(nuevaFila, 1, 1, 12).setValues([registro]);
    sheet.getRange(fila, 1, 1, 14).setBackground('#ffcdd2');

    ss.toast('📋 Deserción registrada: ' + motivo, 'Deserción', 4);
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
    if (!valor || valor.toString().trim() === '') {
      return i;
    }
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
// GESTIÓN DE COHORTES - MEJORADO
// =====================================================================

/**
 * Crear nueva cohorte con todos los detalles
 */
function crearNuevaCohorte() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Paso 1: Nombre de la cohorte
  const respNombre = ui.prompt(
    '➕ Crear Nueva Cohorte - Paso 1/5',
    'Ingresa el NOMBRE de la nueva cohorte:\n\n' +
    'Ejemplos:\n' +
    '- "Cocina Cohorte III"\n' +
    '- "Repostería Cohorte II"\n' +
    '- "Barismo Cohorte II"',
    ui.ButtonSet.OK_CANCEL
  );

  if (respNombre.getSelectedButton() !== ui.Button.OK) return;
  const nombre = respNombre.getResponseText().trim();
  if (!nombre) { ui.alert('Nombre vacío'); return; }

  // Verificar si ya existe
  const cohortesExistentes = obtenerCohortesActuales();
  if (cohortesExistentes.includes(nombre)) {
    ui.alert('❌ Error', 'Ya existe una cohorte con ese nombre.', ui.ButtonSet.OK);
    return;
  }

  // Paso 2: Especialidad
  let listaEspecialidades = '';
  CONFIG.ESPECIALIDADES.forEach((esp, idx) => {
    listaEspecialidades += (idx + 1) + '. ' + esp + '\n';
  });

  const respEsp = ui.prompt(
    '➕ Crear Nueva Cohorte - Paso 2/5',
    'Selecciona la ESPECIALIDAD:\n\n' + listaEspecialidades +
    '\nIngresa el número:',
    ui.ButtonSet.OK_CANCEL
  );

  if (respEsp.getSelectedButton() !== ui.Button.OK) return;
  const numEsp = parseInt(respEsp.getResponseText().trim());
  const especialidad = (numEsp >= 1 && numEsp <= CONFIG.ESPECIALIDADES.length)
    ? CONFIG.ESPECIALIDADES[numEsp - 1] : '';

  // Paso 3: Responsable
  const responsables = obtenerResponsablesActuales();
  let listaResponsables = '';
  responsables.forEach((resp, idx) => {
    listaResponsables += (idx + 1) + '. ' + resp + '\n';
  });

  const respResp = ui.prompt(
    '➕ Crear Nueva Cohorte - Paso 3/5',
    'Selecciona el RESPONSABLE:\n\n' + listaResponsables +
    '\nIngresa el número:',
    ui.ButtonSet.OK_CANCEL
  );

  if (respResp.getSelectedButton() !== ui.Button.OK) return;
  const numResp = parseInt(respResp.getResponseText().trim());
  const responsable = (numResp >= 1 && numResp <= responsables.length)
    ? responsables[numResp - 1] : '';

  // Paso 4: Cupo máximo
  const respCupo = ui.prompt(
    '➕ Crear Nueva Cohorte - Paso 4/5',
    'Ingresa el CUPO MÁXIMO de participantes:\n\n' +
    '(Número entre 5 y 50)',
    ui.ButtonSet.OK_CANCEL
  );

  if (respCupo.getSelectedButton() !== ui.Button.OK) return;
  const cupo = parseInt(respCupo.getResponseText().trim()) || 20;

  // Paso 5: Estado inicial
  const respEstado = ui.alert(
    '➕ Crear Nueva Cohorte - Paso 5/5',
    '¿La cohorte estará ACTIVA inmediatamente?\n\n' +
    'SÍ = Activa (lista para recibir participantes)\n' +
    'NO = Planificada (para después)',
    ui.ButtonSet.YES_NO
  );

  const estadoInicial = (respEstado === ui.Button.YES) ? 'Activa' : 'Planificada';

  // Guardar la cohorte
  const cohortes = ss.getSheetByName('Cohortes');
  const nuevaFila = obtenerPrimeraFilaVacia(cohortes, 'A');

  const datosCohorte = [
    nombre,
    'Alimentos y Bebidas',
    especialidad,
    '',  // Fecha inicio
    '',  // Fecha fin
    responsable,
    cupo,
    '',  // Inscritas (fórmula)
    '',  // Activas (fórmula)
    '',  // Graduadas (fórmula)
    '',  // Deserciones (fórmula)
    estadoInicial,
    '',  // Ubicación
    '',  // Horario
    ''   // Notas
  ];

  cohortes.getRange(nuevaFila, 1, 1, 15).setValues([datosCohorte]);

  // Agregar fórmulas
  cohortes.getRange('H' + nuevaFila).setFormula('=IFERROR(COUNTIF(Seleccionadas!J:J,A' + nuevaFila + '),0)');
  cohortes.getRange('I' + nuevaFila).setFormula('=IFERROR(COUNTIFS(Seleccionadas!J:J,A' + nuevaFila + ',Seleccionadas!M:M,"Activa"),0)');
  cohortes.getRange('J' + nuevaFila).setFormula('=IFERROR(COUNTIF(Graduadas!G:G,A' + nuevaFila + '),0)');
  cohortes.getRange('K' + nuevaFila).setFormula('=IFERROR(COUNTIF(Deserciones!G:G,A' + nuevaFila + '),0)');

  // Actualizar validaciones
  configurarValidaciones();

  ss.toast(
    '✅ COHORTE CREADA\n\n' +
    'Nombre: ' + nombre + '\n' +
    'Especialidad: ' + especialidad + '\n' +
    'Responsable: ' + responsable + '\n' +
    'Cupo: ' + cupo + '\n' +
    'Estado: ' + estadoInicial,
    'Nueva Cohorte',
    8
  );

  Logger.log('✅ Nueva cohorte creada: ' + nombre);
}

/**
 * Enviar participantes de Entrevistas Aprobadas a una cohorte específica
 */
function enviarParticipantesACohorte() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Obtener cohortes activas
  const cohortes = obtenerCohortesActuales();
  const cohortesSheet = ss.getSheetByName('Cohortes');
  const datosCohortes = cohortesSheet.getDataRange().getValues();

  // Filtrar solo cohortes activas
  const cohortesActivas = [];
  for (let i = 1; i < datosCohortes.length; i++) {
    if (datosCohortes[i][11] === 'Activa') {
      cohortesActivas.push({
        nombre: datosCohortes[i][0],
        cupo: datosCohortes[i][6],
        inscritas: datosCohortes[i][7]
      });
    }
  }

  if (cohortesActivas.length === 0) {
    ui.alert('⚠️ Sin Cohortes Activas',
      'No hay cohortes con estado "Activa".\n\n' +
      'Primero cree una cohorte o cambie el estado a "Activa".',
      ui.ButtonSet.OK);
    return;
  }

  // Mostrar lista de cohortes activas
  let listaCohortes = '';
  cohortesActivas.forEach((c, idx) => {
    const disponibles = c.cupo - c.inscritas;
    listaCohortes += (idx + 1) + '. ' + c.nombre + ' (' + disponibles + ' lugares disponibles)\n';
  });

  const respCohorte = ui.prompt(
    '👥 Enviar Participantes a Cohorte',
    'COHORTES ACTIVAS:\n\n' + listaCohortes +
    '\nIngresa el número de la cohorte destino:',
    ui.ButtonSet.OK_CANCEL
  );

  if (respCohorte.getSelectedButton() !== ui.Button.OK) return;

  const numCohorte = parseInt(respCohorte.getResponseText().trim());
  if (isNaN(numCohorte) || numCohorte < 1 || numCohorte > cohortesActivas.length) {
    ui.alert('Número inválido');
    return;
  }

  const cohorteDestino = cohortesActivas[numCohorte - 1].nombre;

  // Buscar participantes aprobados pendientes de asignar
  const entrevistas = ss.getSheetByName('Entrevistas');
  const datosEntrevistas = entrevistas.getDataRange().getValues();

  const seleccionadas = ss.getSheetByName('Seleccionadas');
  const datosSeleccionadas = seleccionadas.getDataRange().getValues();

  // IDs ya en seleccionadas
  const idsSeleccionados = new Set();
  for (let i = 1; i < datosSeleccionadas.length; i++) {
    if (datosSeleccionadas[i][2]) {
      idsSeleccionados.add(datosSeleccionadas[i][2].toString().trim());
    }
  }

  // Buscar aprobados no asignados
  const pendientes = [];
  for (let i = 1; i < datosEntrevistas.length; i++) {
    const estado = datosEntrevistas[i][8]; // Columna I
    const creamosId = datosEntrevistas[i][2];

    if (estado === 'Realizada - Aprobada' && creamosId && !idsSeleccionados.has(creamosId.toString().trim())) {
      pendientes.push({
        fila: i + 1,
        creamosId: creamosId,
        nombre: datosEntrevistas[i][3],
        datos: datosEntrevistas[i]
      });
    }
  }

  if (pendientes.length === 0) {
    ui.alert('ℹ️ Sin Pendientes',
      'No hay participantes aprobados pendientes de asignar.\n\n' +
      'Todos los aprobados ya están en Seleccionadas.',
      ui.ButtonSet.OK);
    return;
  }

  // Mostrar pendientes
  let listaPendientes = '';
  pendientes.forEach((p, idx) => {
    listaPendientes += (idx + 1) + '. ' + p.nombre + ' (' + p.creamosId + ')\n';
  });

  const respConfirm = ui.alert(
    '👥 Confirmar Envío',
    'Se enviarán ' + pendientes.length + ' participantes a:\n' +
    '📚 ' + cohorteDestino + '\n\n' +
    'PARTICIPANTES:\n' + listaPendientes +
    '\n¿Continuar?',
    ui.ButtonSet.YES_NO
  );

  if (respConfirm !== ui.Button.YES) return;

  // Procesar cada pendiente
  const interes = ss.getSheetByName('Hoja de Interés');
  let enviados = 0;

  pendientes.forEach(p => {
    const datosInteres = buscarPorCreamosID(interes, p.creamosId);
    const nuevaFila = obtenerPrimeraFilaVacia(seleccionadas, 'E');

    const registro = [
      new Date(),
      nuevaFila - 1,
      p.creamosId,
      datosInteres ? datosInteres[3] : '',  // DPI
      p.nombre,
      datosInteres ? datosInteres[5] : '',  // Edad
      p.datos[4],                            // Teléfono
      datosInteres ? datosInteres[7] : '',  // Nivel Educativo
      datosInteres ? datosInteres[8] : '',  // Zona
      cohorteDestino,                        // Cohorte asignada
      p.datos[6] || '',                      // Especialidad
      p.datos[7] || '',                      // Responsable
      'Activa',
      p.datos[10] || ''                      // Notas
    ];

    seleccionadas.getRange(nuevaFila, 1, 1, 14).setValues([registro]);

    // Marcar en entrevistas
    entrevistas.getRange(p.fila, 1, 1, 12).setBackground('#c8e6c9');

    enviados++;
  });

  ss.toast(
    '✅ PARTICIPANTES ENVIADOS\n\n' +
    'Enviados: ' + enviados + '\n' +
    'Cohorte: ' + cohorteDestino,
    'Proceso Completado',
    5
  );

  Logger.log('✅ ' + enviados + ' participantes enviados a ' + cohorteDestino);
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
      mensaje += '🍽️ ' + datos[i][0] + '\n';
      mensaje += '   Especialidad: ' + (datos[i][2] || 'N/A') + '\n';
      mensaje += '   Estado: ' + (datos[i][11] || 'N/A') + '\n';
      mensaje += '   Cupo: ' + (datos[i][6] || 0) + '\n';
      mensaje += '   Inscritas: ' + (datos[i][7] || 0) + '\n';
      mensaje += '   Activas: ' + (datos[i][8] || 0) + '\n';
      mensaje += '   Graduadas: ' + (datos[i][9] || 0) + '\n';
      mensaje += '   Deserciones: ' + (datos[i][10] || 0) + '\n';
    }
  }

  ui.alert('Estadísticas', mensaje, ui.ButtonSet.OK);
}

// =====================================================================
// GESTIÓN DE RESPONSABLES
// =====================================================================

function agregarResponsable() {
  const ui = SpreadsheetApp.getUi();

  const respuesta = ui.prompt(
    '➕ Agregar Responsable',
    'Ingresa el nombre completo del nuevo responsable:',
    ui.ButtonSet.OK_CANCEL
  );

  if (respuesta.getSelectedButton() !== ui.Button.OK) return;

  const nombre = respuesta.getResponseText().trim();
  if (!nombre) {
    ui.alert('Nombre vacío');
    return;
  }

  const responsables = obtenerResponsablesActuales();

  if (responsables.includes(nombre)) {
    ui.alert('⚠️ Ya existe', 'Este responsable ya está registrado.', ui.ButtonSet.OK);
    return;
  }

  responsables.push(nombre);
  guardarResponsables(responsables);

  // Actualizar validaciones
  configurarValidaciones();

  SpreadsheetApp.getActiveSpreadsheet().toast(
    '✅ Responsable agregado: ' + nombre,
    'Agregado',
    4
  );
}

function verResponsables() {
  const ui = SpreadsheetApp.getUi();
  const responsables = obtenerResponsablesActuales();

  let mensaje = '👥 RESPONSABLES ACTUALES:\n\n';
  responsables.forEach((r, i) => {
    mensaje += (i + 1) + '. ' + r + '\n';
  });

  ui.alert('Responsables', mensaje, ui.ButtonSet.OK);
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
    SpreadsheetApp.getActiveSpreadsheet().toast('✅ Email configurado: ' + nuevoEmail, 'Configurado', 5);
  }
}

function probarEmail() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const email = obtenerEmailConfiguracion();

  try {
    MailApp.sendEmail(
      email,
      '✅ Prueba - Sistema Alimentos y Bebidas',
      'Este es un email de prueba del Sistema de Inclusión Laboral - Alimentos y Bebidas.\n\n' +
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
      '✅ Nueva Participante Aprobada - Alimentos y Bebidas: ' + nombre,
      'NUEVA PARTICIPANTE APROBADA\n\n' +
      'Área: Alimentos y Bebidas\n' +
      'Nombre: ' + nombre + '\n' +
      'Cohorte: ' + cohorte + '\n' +
      'Responsable: ' + responsable + '\n' +
      'Fecha: ' + new Date().toLocaleString()
    );
  } catch (error) {
    Logger.log('❌ Error enviando email: ' + error.message);
  }
}

function enviarEmailGraduacion(nombre, cohorte) {
  try {
    const email = obtenerEmailConfiguracion();
    MailApp.sendEmail(
      email,
      '🎓 Graduación - Alimentos y Bebidas: ' + nombre,
      '¡FELICITACIONES!\n\n' +
      'Nueva graduación en Alimentos y Bebidas:\n\n' +
      'Nombre: ' + nombre + '\n' +
      'Cohorte: ' + cohorte + '\n' +
      'Fecha: ' + new Date().toLocaleString()
    );
  } catch (error) {
    Logger.log('❌ Error enviando email: ' + error.message);
  }
}

function enviarEmailDesercion(nombre, cohorte, motivo) {
  try {
    const email = obtenerEmailConfiguracion();
    MailApp.sendEmail(
      email,
      '⚠️ Deserción - Alimentos y Bebidas: ' + nombre,
      'DESERCIÓN REGISTRADA\n\n' +
      'Área: Alimentos y Bebidas\n' +
      'Nombre: ' + nombre + '\n' +
      'Cohorte: ' + cohorte + '\n' +
      'Motivo: ' + motivo + '\n' +
      'Fecha: ' + new Date().toLocaleString()
    );
  } catch (error) {
    Logger.log('❌ Error enviando email: ' + error.message);
  }
}

// =====================================================================
// REPORTES
// =====================================================================

function actualizarReportes() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const reporte = ss.getSheetByName('Reporte');
    if (!reporte) return;
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
      reporte.getRange('B5').getValue(),
      reporte.getRange('B8').getValue(),
      reporte.getRange('B11').getValue(),
      reporte.getRange('C11').getValue(),
      reporte.getRange('B26').getValue(),
      reporte.getRange('B29').getValue(),
      '',  // No Interesados
      reporte.getRange('B33').getValue(),
      reporte.getRange('B14').getValue(),
      reporte.getRange('B15').getValue(),
      reporte.getRange('B16').getValue(),
      reporte.getRange('B17').getValue(),
      new Date()
    ];

    const nuevaFila = mensuales.getLastRow() + 1;
    mensuales.getRange(nuevaFila, 1, 1, 14).setValues([datos]);

    ss.toast('✅ Reporte mensual guardado: ' + mesActual, 'Guardado', 5);
  } catch (error) {
    Logger.log('❌ Error: ' + error.message);
  }
}

// =====================================================================
// TRIGGERS
// =====================================================================

function instalarTriggers() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const triggers = ScriptApp.getProjectTriggers();

    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'alEditar' ||
          trigger.getHandlerFunction() === 'actualizarReportes') {
        ScriptApp.deleteTrigger(trigger);
      }
    });

    ScriptApp.newTrigger('alEditar')
      .forSpreadsheet(ss)
      .onEdit()
      .create();

    ScriptApp.newTrigger('actualizarReportes')
      .timeBased()
      .everyHours(1)
      .create();

    SpreadsheetApp.getActiveSpreadsheet().toast('✅ Triggers instalados', 'Instalado', 3);
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

    const hojas = ['Hoja de Interés', 'Entrevistas', 'Seleccionadas',
                   'Cohortes', 'Asistencias', 'Graduadas',
                   'Deserciones', 'No Interesados'];

    hojas.forEach(nombre => {
      const hoja = ss.getSheetByName(nombre);
      if (hoja) {
        hoja.getRange('A1:Z500').clearDataValidations();
      }
    });

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

    const interes = ss.getSheetByName('Hoja de Interés');
    if (interes) {
      for (let i = 2; i <= 500; i++) {
        interes.getRange('A' + i).setFormula('=IF(E' + i + '<>"",TODAY(),"")');
        interes.getRange('B' + i).setFormula('=IF(E' + i + '<>"",COUNTA($E$2:E' + i + '),"")');
      }
    }

    const cohortes = ss.getSheetByName('Cohortes');
    if (cohortes) {
      for (let i = 2; i <= 30; i++) {
        cohortes.getRange('H' + i).setFormula('=IFERROR(COUNTIF(Seleccionadas!J:J,A' + i + '),0)');
        cohortes.getRange('I' + i).setFormula('=IFERROR(COUNTIFS(Seleccionadas!J:J,A' + i + ',Seleccionadas!M:M,"Activa"),0)');
        cohortes.getRange('J' + i).setFormula('=IFERROR(COUNTIF(Graduadas!G:G,A' + i + '),0)');
        cohortes.getRange('K' + i).setFormula('=IFERROR(COUNTIF(Deserciones!G:G,A' + i + '),0)');
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
    ['', '', 'AB001', '1234567890101', 'María López García', '23', '5555-1234', 'Diversificado completo', 'Zona 1', 'Redes sociales', 'Cocina Cohorte I', 'Cocina general', 'Responsable 1', 'Nuevo', ''],
    ['', '', 'AB002', '2345678901212', 'Ana Martínez Pérez', '28', '5555-5678', 'Básicos completos', 'Zona 7', 'Referido', 'Repostería Cohorte I', 'Repostería y panadería', 'Responsable 2', 'Nuevo', ''],
    ['', '', 'AB003', '3456789012323', 'Laura Hernández', '20', '5555-9012', 'Diversificado completo', 'Mixco', 'Facebook', 'Barismo Cohorte I', 'Barismo', 'Responsable 1', 'Nuevo', '']
  ];

  interes.getRange(2, 1, datosPrueba.length, 15).setValues(datosPrueba);

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
