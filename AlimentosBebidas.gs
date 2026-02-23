/**
 * =====================================================================
 * SISTEMA DE INCLUSIÓN LABORAL - ÁREA DE ALIMENTOS Y BEBIDAS
 * =====================================================================
 *
 * FLUJO SIMPLIFICADO:
 * 1. Hoja de Interés: Estado → "Entrevista agendada" o "No interesado"
 * 2. Entrevistas: Final → "Aprobada" (→ Seleccionadas) / "No aprobada" (→ No Seleccionadas)
 * 3. Seleccionadas: "Enviar a Cohorte" → envía a la hoja individual
 * 4. Cohortes: Estado "Finalizada" → pregunta si graduar a todas
 * 5. Hojas individuales: Estado "Graduada" o "Deserción"
 *
 * PROGRAMAS: Gastronomía, Barismo
 *
 * =====================================================================
 */

// =====================================================================
// CONFIGURACIÓN GLOBAL
// =====================================================================

const CONFIG = {
  // URL de KoboToolbox para importar datos de registro inicial
  KOBO_URL: 'https://kf.kobotoolbox.org/api/v2/assets/akz5K2bGfvvisQaE7VaHev/export-settings/esLPozzAX85W2xSv98r2AVM/data.csv',

  // URL de KoboToolbox para importar datos de ENTREVISTAS (IL_01_Entrevista)
  KOBO_ENTREVISTAS_URL: 'https://kf.kobotoolbox.org/api/v2/assets/aF4nMQPqbHokM7rg2Vtf5w/export-settings/esqKoJjmoR34panMLhM8j3Z/data.csv',

  // URL de KoboToolbox para la NUEVA hoja de interés (históricos + nuevos)
  KOBO_NUEVA_INTERES_URL: 'https://kf.kobotoolbox.org/api/v2/assets/auvEELWQEgiwF54W4pGpV5/export-settings/eseYzEgWw6Tui9y2eppZy3L/data.csv',

  // Cohortes disponibles (se llenan dinámicamente desde la hoja Cohortes)
  COHORTES: [],

  // Programas de Alimentos y Bebidas (para Hoja de Interés - viene de Kobo)
  PROGRAMAS_ALIMENTOS: [
    'Gastronomía',
    'Barismo'
  ],

  // Responsables del programa
  RESPONSABLES: [
    'Eva',
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
    'No le interesa el área de alimentos y bebidas',
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

  // Resultado Final de entrevista (simplificado)
  RESULTADO_FINAL: [
    'Aprobada',
    'No aprobada',
    'No asistió',
    'Reprogramada'
  ],

  // Estados de cohorte
  ESTADOS_COHORTE: [
    'Activa',
    'Finalizada'
  ],

  // Estados de seguimiento (graduadas)
  ESTADOS_SEGUIMIENTO: [
    'Empleada - Área alimentos y bebidas',
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
  ui.createMenu('🍽️ Alimentos y Bebidas')
    .addItem('📋 Importar Hoja de Interés (Kobo)', 'importarDesdeKobo')
    .addItem('🔄 Actualizar Hoja de Interés (Nuevo Kobo)', 'actualizarHojaInteresDesdeNuevoKobo')
    .addItem('🔁 Actualizar desde CREAMOS ID', 'actualizarTodosDesdeDirectorio')
    .addSeparator()
    .addSubMenu(ui.createMenu('📊 Reportes')
      .addItem('📊 Actualizar Reportes', 'actualizarReportes')
      .addItem('💾 Guardar Reporte Mensual', 'guardarReporteMensual'))
    .addSubMenu(ui.createMenu('📋 Cohortes')
      .addItem('➕ Crear Nueva Cohorte', 'crearNuevaCohorte')
      .addItem('📝 Ver/Editar Cohortes', 'verCohortes')
      .addItem('📊 Estadísticas por Cohorte', 'estadisticasCohorte')
      .addItem('👥 Enviar Participantes a Cohorte', 'enviarParticipantesACohorte'))
    .addSubMenu(ui.createMenu('⚙️ Configuración')
      .addItem('🔗 URL Registros Kobo', 'configurarKoboURL')
      .addItem('🔗 URL Entrevistas Kobo', 'configurarKoboEntrevistasURL')
      .addItem('🔄 Importación Automática', 'configurarImportacionAutomatica')
      .addItem('📝 Importar Entrevistas (Detalle)', 'importarEntrevistasDesdeKobo')
      .addSeparator()
      .addItem('📧 Configurar Email General', 'configurarEmail')
      .addItem('📧 Configurar Email Eva', 'configurarEmailEva')
      .addItem('✉️ Probar Email', 'probarEmail')
      .addSeparator()
      .addItem('⏰ Instalar Triggers', 'instalarTriggers')
      .addItem('🔒 Configurar CREAMOS ID', 'configurarHojaCreamosID'))
    .addSubMenu(ui.createMenu('🛠️ Herramientas')
      .addItem('🔧 Reparar Validaciones', 'repararValidaciones')
      .addItem('🔧 Reparar Fórmulas', 'repararFormulas')
      .addSeparator()
      .addSubMenu(ui.createMenu('👤 Responsables')
        .addItem('➕ Agregar Responsable', 'agregarResponsable')
        .addItem('📝 Ver Responsables', 'verResponsables'))
      .addSeparator()
      .addItem('🔍 Probar Conexión Kobo', 'probarConexionKobo')
      .addItem('📊 Ver Columnas Kobo', 'verColumnasKobo')
      .addItem('🔄 Autocompletar desde CREAMOS ID', 'autocompletarDesdeCreamosID')
      .addSeparator()
      .addItem('🧪 Crear Datos de Prueba', 'crearDatosPrueba')
      .addItem('🧹 Limpiar Todos los Datos', 'limpiarTodosLosDatos'))
    .addSeparator()
    .addItem('🚀 INSTALAR TODO (Completo)', 'instalarTodo')
    .addItem('🆕 Actualizar v4 (sin borrar datos)', 'instalarV4')
    .addItem('⚙️ Instalar Sistema (solo hojas)', 'instalarSistema')
    .addItem('🧹 Limpiar cohortes eliminadas', 'limpiarCohortesEliminadas')
    .addItem('🔄 Reenviar graduadas al seguimiento', 'reenviarDesdeMenuCohorte')
    .addItem('📖 Ver Guía de Uso', 'verGuiaUso')
    .addItem('✅ Verificar Instalación', 'verificarInstalacion')
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
    protegerHojaCreamosIDSiExiste();
    Logger.log('✅ Hoja CREAMOS ID verificada');
    actualizarTodosDesdeDirectorio(true);
    Logger.log('✅ Datos actualizados en todas las hojas desde CREAMOS ID');
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

    Logger.log('✅ Sistema de Inclusión Laboral - Alimentos y Bebidas instalado');

  } catch (error) {
    ss.toast('❌ Error: ' + error.message, 'ERROR', 10);
    Logger.log('❌ Error en instalación: ' + error.message);
  }
}

/**
 * Instalación v2 — Solo agrega funcionalidades nuevas SIN borrar datos existentes
 * Usar cuando el sistema ya está instalado y se quiere actualizar
 */
function instalarV3() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const confirmacion = ui.alert(
    '🆕 Actualización v3 — Sin borrar datos',
    'Esta actualización agrega lo nuevo SIN eliminar hojas ni datos existentes:\n\n' +
    '• Hoja "Lista Definitiva" (si no existe)\n' +
    '• Actualiza validaciones de datos\n' +
    '• Corrige fórmulas de Cohortes (Inscritas)\n' +
    '• Limpia cohortes eliminadas del desplegable\n\n' +
    '¿Deseas continuar?',
    ui.ButtonSet.YES_NO
  );

  if (confirmacion !== ui.Button.YES) return;

  const cambios = [];

  try {
    // 1. Crear Lista Definitiva si no existe
    if (!ss.getSheetByName('Lista Definitiva')) {
      crearHojaListaDefinitiva();
      cambios.push('✅ Hoja "Lista Definitiva" creada');
    } else {
      cambios.push('ℹ️ "Lista Definitiva" ya existía');
    }

    // 2. Limpiar cohortes cuyas hojas ya no existen
    const eliminadas = limpiarCohortesEliminadas(true);
    if (eliminadas > 0) {
      cambios.push('✅ ' + eliminadas + ' cohorte(s) sin hoja eliminadas del registro');
    } else {
      cambios.push('ℹ️ No hay cohortes eliminadas pendientes');
    }

    // 3. Actualizar validaciones (no borra datos)
    configurarValidaciones();
    cambios.push('✅ Validaciones actualizadas');

    // 4. Corregir fórmulas de Cohortes
    repararFormulas();
    cambios.push('✅ Fórmulas de Cohortes corregidas');

    ss.toast(
      '🆕 ACTUALIZACIÓN v3 COMPLETADA\n\n' + cambios.join('\n') + '\n\nTus datos están intactos.',
      'Actualización',
      10
    );
    Logger.log('✅ Actualización v3: ' + cambios.join(', '));

  } catch (error) {
    ss.toast('❌ Error en actualización: ' + error.message, 'ERROR', 10);
    Logger.log('❌ Error v3: ' + error.message);
  }
}

/**
 * Limpia del registro de Cohortes aquellas cuya hoja individual ya fue eliminada.
 * También refresca los desplegables de "Enviar a Cohorte".
 * @param {boolean} silencioso - si es true no muestra alert (para llamada interna desde instalarV3)
 * @returns {number} cantidad de cohortes eliminadas
 */
function limpiarCohortesEliminadas(silencioso) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  const cohortesSheet = ss.getSheetByName('Cohortes');
  if (!cohortesSheet) {
    if (!silencioso) ss.toast('⚠️ No se encontró la hoja "Cohortes"', 'Error', 4);
    return 0;
  }

  const datos = cohortesSheet.getDataRange().getValues();
  const filasAEliminar = [];

  for (let i = 1; i < datos.length; i++) {
    const nombreCohorte = datos[i][0] ? datos[i][0].toString().trim() : '';
    if (nombreCohorte && !ss.getSheetByName(nombreCohorte)) {
      filasAEliminar.push(i + 1); // +1 porque las filas son base 1
    }
  }

  if (filasAEliminar.length === 0) {
    if (!silencioso) ss.toast('✅ No hay cohortes eliminadas en el registro', 'Limpiar', 4);
    return 0;
  }

  // Eliminar de abajo hacia arriba para no desplazar índices
  for (let i = filasAEliminar.length - 1; i >= 0; i--) {
    cohortesSheet.deleteRow(filasAEliminar[i]);
  }

  // Refrescar desplegables de cohorte
  configurarValidaciones();

  if (!silencioso) {
    ui.alert('✅ Limpieza completada',
      filasAEliminar.length + ' cohorte(s) sin hoja han sido eliminadas del registro.\nLos desplegables han sido actualizados.',
      ui.ButtonSet.OK);
  }
  return filasAEliminar.length;
}

function verificarInstalacion() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const triggers = ScriptApp.getProjectTriggers();

  let mensaje = '📋 VERIFICACIÓN DEL SISTEMA\n\n';

  const hojasRequeridas = [
    'Hoja de Interés', 'Entrevistas', 'Seleccionadas',
    'Cohortes', 'Graduadas', 'Deserciones',
    'No Seleccionadas', 'Lista Definitiva', 'Reporte', 'Reportes Mensuales'
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
  const HOJAS_PROTEGIDAS = ['Copy of CREAMOS ID nuevo'];

  // Eliminar todas las hojas excepto la primera y las protegidas
  for (let i = hojas.length - 1; i > 0; i--) {
    const nombreHoja = hojas[i].getName();
    // NO eliminar si es una hoja protegida
    if (!HOJAS_PROTEGIDAS.includes(nombreHoja)) {
      ss.deleteSheet(hojas[i]);
    }
  }

  hojas[0].setName('Hoja de Interés');

  crearHojaInteres();
  crearHojaEntrevistas();
  crearHojaDetalleEntrevistas();
  crearHojaSeleccionadas();
  crearHojaCohortes();
  // Asistencias eliminada - no se usa
  crearHojaGraduadas();
  crearHojaDeserciones();
  crearHojaNoSeleccionadas();
  crearHojaListaDefinitiva();
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
 * HOJA DE ENTREVISTAS - SIMPLIFICADA
 * - "Estado" al final (después de Observaciones)
 * - Trigger actúa según el Estado seleccionado
 */
function crearHojaEntrevistas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss.getSheetByName('Entrevistas')) return;
  const sheet = ss.insertSheet('Entrevistas');

  const headers = [
    'Fecha Entrevista',   // A
    'Hora',               // B
    'Creamos ID',         // C
    'Nombre Completo',    // D
    'Teléfono',           // E
    'Entrevistador',      // F - Desplegable (responsables)
    'Calificación',       // G
    'Observaciones',      // H
    'Estado'              // I - Desplegable (última columna - trigger)
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#7b1fa2')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Anchos de columna
  [120, 80, 100, 200, 120, 120, 120, 300, 150].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });

  // Destacar columna "Estado"
  sheet.getRange('I1').setBackground('#4caf50');
}

/**
 * HOJA DE DETALLE ENTREVISTAS - Almacena todas las respuestas del formulario Kobo
 * Se vincula por Creamos ID con las demás hojas
 * Importa desde: IL_01_Entrevista en KoboToolbox
 */
function crearHojaDetalleEntrevistas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss.getSheetByName('Detalle Entrevistas')) return;
  const sheet = ss.insertSheet('Detalle Entrevistas');

  const headers = [
    // === INFORMACIÓN GENERAL ===
    'Fecha Importación',          // A
    'Creamos ID',                 // B - CLAVE DE VINCULACIÓN
    'Nombre Completo',            // C
    'Género',                     // D

    // === TRABAJO EN GRUPOS ===
    'Grupos Diversos',            // E
    'Grupos Mixtos',              // F
    'Experiencia Grupos Mixtos',  // G

    // === FORMACIÓN Y CAPACITACIÓN ===
    'Formación Previa',           // H
    'Dónde Formación',            // I
    'Tiene Certificado',          // J
    'Cuál Certificado',           // K

    // === INTERESES LABORALES ===
    'Sector Interés',             // L
    'Proyecto Interés',           // M

    // === CURSO ALIMENTOS/BEBIDAS/TECNOLOGÍA ===
    'Dificultades Curso',         // N
    'Áreas Vida Cambiarán',       // O
    'Por Qué Interesa Curso',     // P
    'Firmar Documento',           // Q
    'Disponibilidad Prácticas',   // R
    'Trabajar en Sector',         // S
    'Horarios Demandantes',       // T
    'Comentarios Curso',          // U

    // === SITUACIÓN ECONÓMICA ===
    'Ayuda Económica',            // V
    'Comentario Ayuda',           // W
    'Dependientes Económicos',    // X
    'Comentario Dependientes',    // Y
    'Responsabilidades Cuidado',  // Z
    'Comentario Cuidado',         // AA
    'Otros Comentarios Económicos', // AB

    // === TRANSPORTE Y ANTECEDENTES ===
    'Tiene Transporte',           // AC
    'Plan Traslado',              // AD
    'Deudas Bancarias',           // AE
    'Antecedentes Manchados',     // AF
    'Comentario Antecedentes',    // AG

    // === SOLO OPERARIOS ===
    'Trámites Penales',           // AH
    'Talla Zapato',               // AI
    'Movilizarse Cualquier Zona', // AJ
    'Comentarios Operarios',      // AK

    // === ENFOQUE DE GÉNERO ===
    'Comentario Previo Género',   // AL
    'Conoce VBG',                 // AM
    'Grupos Mixtos Género',       // AN
    'Grupos Diversos Género',     // AO
    'Comentario Género',          // AP
    'Conflictos Casa',            // AQ
    'Comentario Conflictos',      // AR
    'Grupo Mayormente Mujeres',   // AS
    'Igualdad Hombres Mujeres',   // AT
    'Familiares Creamos',         // AU
    'Nombres Familiares',         // AV
    'Formal o Informal',          // AW
    'Conoce Violencia Mujer',     // AX

    // === PREGUNTA ADICIONAL CURSO ===
    '¿Aprender para práctica en trabajo?', // AY - ¿Te interesa aprender para luego ponerlo en práctica?

    // === CONTROL ===
    'Vinculado'                   // AZ
  ];

  // Expandir la hoja para acomodar todas las columnas (por defecto solo tiene 26)
  const currentCols = sheet.getMaxColumns();
  if (headers.length > currentCols) {
    sheet.insertColumnsAfter(currentCols, headers.length - currentCols);
  }

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#5e35b1')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setWrap(true);

  sheet.setFrozenRows(1);

  // Anchos de columna (52 valores = 52 headers, A a AZ)
  const anchos = [
    100, 100, 180, 80,
    80, 80, 80,
    80, 150, 80, 150,
    120, 150,
    200, 200, 200, 80, 80, 80, 80, 200,
    80, 150, 80, 150, 80, 150, 200,
    80, 200, 80, 80, 150,
    80, 80, 80, 150,
    150, 80, 80, 80, 150, 80, 150, 150, 200, 80, 150, 100, 200,
    150,  // Adicionales (AY)
    80    // Vinculado (AZ)
  ];
  anchos.forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });

  // Colorear secciones
  sheet.getRange('A1:D1').setBackground('#1565c0');
  sheet.getRange('E1:G1').setBackground('#2e7d32');
  sheet.getRange('H1:K1').setBackground('#f57c00');
  sheet.getRange('L1:M1').setBackground('#c62828');
  sheet.getRange('N1:U1').setBackground('#6a1b9a');
  sheet.getRange('V1:AB1').setBackground('#00838f');
  sheet.getRange('AC1:AG1').setBackground('#4527a0');
  sheet.getRange('AH1:AK1').setBackground('#bf360c');
  sheet.getRange('AL1:AX1').setBackground('#ad1457');
  sheet.getRange('AY1:AZ1').setBackground('#37474f');
}

/**
 * HOJA DE SELECCIONADAS - SIMPLIFICADA
 * - Sin columna Estado
 * - "Enviar a Cohorte" al final - dropdown dinámico con cohortes activas
 * - Al seleccionar cohorte, se envía automáticamente
 */
function crearHojaSeleccionadas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss.getSheetByName('Seleccionadas')) return;
  const sheet = ss.insertSheet('Seleccionadas');

  const headers = [
    'No.',              // A
    'Creamos ID',       // B
    'DPI',              // C
    'Nombre Completo',  // D
    'Edad',             // E
    'Teléfono',         // F
    'Nivel Educativo',  // G
    'Zona',             // H
    'Notas',            // I
    'Enviar a Cohorte'  // J - Desplegable dinámico (última columna - trigger)
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#2e7d32')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  [50, 100, 130, 200, 60, 120, 150, 120, 250, 180].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });

  // Destacar columna de envío
  sheet.getRange('J1').setBackground('#4caf50');
}

/**
 * HOJA DE COHORTES - Gestión de cohortes
 * Estado: Activa / Finalizada
 * Al marcar Finalizada, pregunta si todas se graduaron
 */
function crearHojaCohortes() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss.getSheetByName('Cohortes')) return;
  const sheet = ss.insertSheet('Cohortes');

  const headers = [
    'Nombre Cohorte',     // A
    'Proyecto',           // B
    'Fecha Inicio',       // C
    'Fecha Fin',          // D
    'Responsable',        // E
    'Cupo Máximo',        // F
    'Inscritas',          // G - Fórmula (cuenta en hoja individual)
    'Graduadas',          // H - Fórmula
    'Deserciones',        // I - Fórmula
    'Ubicación',          // J
    'Horario',            // K
    'Notas',              // L
    'Estado'              // M - Activa/Finalizada (última columna - trigger)
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#f57c00')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Las fórmulas se actualizan cuando se crea la cohorte individual
  for (let i = 2; i <= 20; i++) {
    // Inscritas: cuenta participantes en la hoja individual de la cohorte
    sheet.getRange('G' + i).setFormula('=IF(A' + i + '="",0,IFERROR(COUNTIF(INDIRECT("\'"&A' + i + '&"\'!E:E"),"<>")-1,0))');
    sheet.getRange('H' + i).setFormula('=IFERROR(COUNTIF(Graduadas!G:G,A' + i + '),0)');
    sheet.getRange('I' + i).setFormula('=IFERROR(COUNTIF(Deserciones!G:G,A' + i + '),0)');
  }

  [180, 100, 120, 120, 120, 100, 80, 80, 80, 150, 150, 200, 120].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });

  // Destacar columna Estado
  sheet.getRange('M1').setBackground('#4caf50');
}

// Función crearHojaAsistencias eliminada - no se usa

/**
 * HOJA DE GRADUADAS
 */
function crearHojaGraduadas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss.getSheetByName('Graduadas')) return;
  const sheet = ss.insertSheet('Graduadas');

  const headers = [
    'Fecha Graduación',     // A
    'Creamos ID',           // B
    'DPI',                  // C
    'Nombre Completo',      // D
    'Teléfono',             // E
    'Nivel Educativo',      // F
    'Cohorte',              // G
    'Notas'                 // H
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#388e3c')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  [120, 100, 130, 200, 120, 150, 180, 300].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });
}

/**
 * HOJA DE DESERCIONES - Con opción de reenviar a Seleccionadas
 */
function crearHojaDeserciones() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss.getSheetByName('Deserciones')) return;
  const sheet = ss.insertSheet('Deserciones');

  const headers = [
    'Fecha Deserción',  // A
    'Creamos ID',       // B
    'DPI',              // C
    'Nombre Completo',  // D
    'Teléfono',         // E
    'Nivel Educativo',  // F
    'Cohorte',          // G
    'Motivo',           // H
    'Notas',            // I
    'Acción'            // J - Desplegable para reenviar (última columna - trigger)
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#d32f2f')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  [120, 100, 130, 200, 120, 150, 180, 200, 300, 180].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });

  // Destacar columna Acción
  sheet.getRange('J1').setBackground('#4caf50');
}

/**
 * HOJA DE NO SELECCIONADAS - Con colores según origen y opción de reenviar
 * COLORES:
 * - Amarillo (#fff9c4): Vino de Hoja de Interés (no interesado inicial)
 * - Naranja (#ffe0b2): Vino de Entrevistas (no aprobó/no asistió)
 * - Rojo claro (#ffcdd2): Vino de Seleccionadas (ya estaba seleccionado)
 */
function crearHojaNoSeleccionadas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss.getSheetByName('No Seleccionadas')) return;
  const sheet = ss.insertSheet('No Seleccionadas');

  const headers = [
    'Fecha',            // A
    'Creamos ID',       // B
    'Nombre Completo',  // C
    'Teléfono',         // D
    'Etapa',            // E - En qué etapa no fue seleccionada
    'Motivo',           // F - Desplegable
    'Origen',           // G - Interés / Entrevista / Seleccionadas
    'Notas',            // H
    'Acción'            // I - Desplegable para reenviar (última columna - trigger)
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#616161')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  [120, 100, 200, 120, 150, 200, 150, 300, 180].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });

  // Destacar columna Acción
  sheet.getRange('I1').setBackground('#4caf50');
}

/**
 * HOJA LISTA DEFINITIVA - Registro histórico de todas las personas enviadas a cohorte
 * Solo se agregan registros, nunca se eliminan — para reporte y seguimiento
 */
function crearHojaListaDefinitiva() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss.getSheetByName('Lista Definitiva')) return;
  const sheet = ss.insertSheet('Lista Definitiva');

  const headers = [
    'No.',              // A
    'Fecha Envío',      // B
    'Creamos ID',       // C
    'DPI',              // D
    'Nombre Completo',  // E
    'Edad',             // F
    'Teléfono',         // G
    'Nivel Educativo',  // H
    'Zona',             // I
    'Cohorte'           // J
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#1a237e')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  [50, 120, 100, 130, 200, 60, 120, 150, 120, 180].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });

  sheet.setFrozenRows(1);

  // Destacar columna Cohorte
  sheet.getRange('J1').setBackground('#4caf50');
}

/**
 * HOJA DE REPORTE - Dashboard principal (incluye No Seleccionadas)
 */
function crearHojaReporte() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss.getSheetByName('Reporte')) return;
  const sheet = ss.insertSheet('Reporte');

  // Columnas actualizadas:
  // Seleccionadas: A-No, B-CreamosID, C-DPI, D-Nombre, E-Edad, F-Tel, G-NivelEdu, H-Zona, I-Notas, J-EnviarACohorte
  // Graduadas: A-Fecha, B-CreamosID, C-DPI, D-Nombre, E-Tel, F-NivelEdu, G-Cohorte, H-Notas
  const data = [
    ['REPORTE - INCLUSIÓN LABORAL ALIMENTOS Y BEBIDAS', '', '', ''],                                    // 1
    ['Última actualización:', '=TEXT(NOW(),"DD/MM/YYYY HH:MM")', 'Mes actual:', '=TEXT(TODAY(),"MMMM YYYY")'], // 2
    ['', '', '', ''],                                                                           // 3

    ['PERSONAS INTERESADAS', 'Total', 'Este mes', ''],                                         // 4
    ['Registros en Hoja de Interés', '=IFERROR(COUNTA(\'Hoja de Interés\'!E:E)-1,0)', '=IFERROR(COUNTIFS(\'Hoja de Interés\'!A:A,">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1)),0)', ''], // 5
    ['', '', '', ''],                                                                           // 6

    ['ENTREVISTAS', 'Total', 'Aprobadas', ''],                                                // 7
    ['Entrevistas realizadas', '=IFERROR(COUNTA(Entrevistas!D:D)-1,0)', '=IFERROR(COUNTIF(Entrevistas!I:I,"Aprobada"),0)', ''], // 8
    ['', '', '', ''],                                                                           // 9

    ['SELECCIONADAS', 'Total', '', ''],                                                         // 10
    ['Personas pendientes de asignar cohorte', '=IFERROR(COUNTA(Seleccionadas!D:D)-1,0)', '', ''], // 11
    ['', '', '', ''],                                                                           // 12

    ['PARTICIPANTES POR COHORTE', 'Ver hoja Cohortes', '', ''],                                 // 13
    ['(Los datos por cohorte se ven en la hoja Cohortes)', '', '', ''],                         // 14
    ['', '', '', ''],                                                                           // 15

    ['GRADUADAS', 'Total', 'Este mes', ''],                                                     // 16
    ['Personas graduadas', '=IFERROR(COUNTA(Graduadas!D:D)-1,0)', '=IFERROR(COUNTIFS(Graduadas!A:A,">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1)),0)', ''], // 17
    ['', '', '', ''],                                                                           // 18

    ['DESERCIONES', 'Total', 'Este mes', 'Tasa'],                                              // 19
    ['Personas que desertaron', '=IFERROR(COUNTA(Deserciones!D:D)-1,0)', '=IFERROR(COUNTIFS(Deserciones!A:A,">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1)),0)', '=IFERROR(IF((B17+B20)>0,ROUND(B20/(B17+B20)*100,1)&"%","0%"),"0%")'], // 20
    ['', '', '', ''],                                                                           // 21

    ['NO SELECCIONADAS', 'Total', 'Este mes', ''],                                             // 22
    ['Personas no seleccionadas', '=IFERROR(COUNTA(\'No Seleccionadas\'!C:C)-1,0)', '=IFERROR(COUNTIFS(\'No Seleccionadas\'!A:A,">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1)),0)', ''], // 23
    ['', '', '', ''],                                                                           // 24

    ['RESUMEN GENERAL', 'Valor', '', ''],                                                       // 25
    ['Total personas atendidas', '=B5+B17+B20+B23', '', ''],                                   // 26
    ['Tasa de éxito (graduadas/total)', '=IFERROR(IF((B17+B20)>0,ROUND(B17/(B17+B20)*100,1)&"%","0%"),"0%")', '', ''], // 27
    ['Participantes activas en cohortes', '=B11', '', '']                                       // 28
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

  // Filas de encabezado de sección (azul)
  const headerRows = [4, 7, 10, 13, 16, 19, 22, 25];
  headerRows.forEach(row => {
    sheet.getRange('A' + row + ':D' + row)
      .setBackground('#1565c0')
      .setFontColor('white')
      .setFontWeight('bold')
      .setHorizontalAlignment('center');
  });

  // Filas de resumen (azul claro)
  const totalRows = [26, 27, 28];
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
  if (ss.getSheetByName('Reportes Mensuales')) return;
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
  const cohortes = obtenerCohortesActivas(); // Solo cohortes activas para envío
  const responsables = obtenerResponsablesActuales();

  // === HOJA DE INTERÉS ===
  // Estado: solo "Entrevista agendada" y "No interesado"
  const interes = ss.getSheetByName('Hoja de Interés');
  if (interes) {
    // Limpiar validaciones de datos de Kobo
    interes.getRange('H2:H500').clearDataValidations();
    interes.getRange('I2:I500').clearDataValidations();
    interes.getRange('K2:K500').clearDataValidations();
    interes.getRange('L2:L500').clearDataValidations();

    // Estado (columna N) - SOLO DOS OPCIONES
    interes.getRange('N2:N500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(['Entrevista agendada', 'No interesado'])
        .setAllowInvalid(false)
        .build()
    );
  }

  // === HOJA DE ENTREVISTAS ===
  // Columnas: A-Fecha, B-Hora, C-CreamosID, D-Nombre, E-Tel, F-Entrevistador, G-Observaciones, H-Estado
  const entrevistas = ss.getSheetByName('Entrevistas');
  if (entrevistas) {
    // Entrevistador (F)
    entrevistas.getRange('F2:F500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(responsables).setAllowInvalid(false).build()
    );
    // Estado (I) - Resultado de entrevista (última columna)
    entrevistas.getRange('I2:I500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.RESULTADO_FINAL).setAllowInvalid(false).build()
    );
  }

  // === HOJA DE SELECCIONADAS ===
  // Columnas: A-No, B-CreamosID, C-DPI, D-Nombre, E-Edad, F-Tel, G-NivelEdu, H-Zona, I-Notas, J-EnviarACohorte
  const seleccionadas = ss.getSheetByName('Seleccionadas');
  if (seleccionadas) {
    seleccionadas.getRange('G2:G500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.NIVELES_EDUCATIVOS).setAllowInvalid(false).build()
    );
    seleccionadas.getRange('H2:H500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.ZONAS).setAllowInvalid(true).build()
    );
    // Enviar a Cohorte (J) - dropdown dinámico con cohortes activas
    if (cohortes.length > 0) {
      seleccionadas.getRange('J2:J500').setDataValidation(
        SpreadsheetApp.newDataValidation().requireValueInList(cohortes).setAllowInvalid(false).build()
      );
    }
  }

  // === HOJA DE GRADUADAS ===
  // Columnas: A-Fecha, B-CreamosID, C-DPI, D-Nombre, E-Tel, F-NivelEdu, G-Cohorte, H-Notas
  const graduadas = ss.getSheetByName('Graduadas');
  if (graduadas) {
    graduadas.getRange('F2:F500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.NIVELES_EDUCATIVOS).setAllowInvalid(false).build()
    );
    const todasCohortes = obtenerCohortesActuales();
    graduadas.getRange('G2:G500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(todasCohortes).setAllowInvalid(false).build()
    );
    // Nota: No hay desplegable de Estado en Graduadas — el seguimiento se gestiona en el Archivo de Seguimiento externo
  }

  // === HOJA DE DESERCIONES ===
  // Columnas: A-Fecha, B-CreamosID, C-DPI, D-Nombre, E-Tel, F-NivelEdu, G-Cohorte, H-Motivo, I-Notas, J-Acción
  const deserciones = ss.getSheetByName('Deserciones');
  if (deserciones) {
    const todasCohortes = obtenerCohortesActuales();
    deserciones.getRange('G2:G500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(todasCohortes).setAllowInvalid(false).build()
    );
    deserciones.getRange('H2:H500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.MOTIVOS_DESERCION).setAllowInvalid(true).build()
    );
    // Acción (J) - Opción para reenviar a Seleccionadas
    deserciones.getRange('J2:J500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(['Reenviar a Seleccionadas']).setAllowInvalid(true).build()
    );
  }

  // === HOJA DE NO SELECCIONADAS ===
  // Columnas: A-Fecha, B-CreamosID, C-Nombre, D-Tel, E-Etapa, F-Motivo, G-Origen, H-Notas, I-Acción
  const noSeleccionadas = ss.getSheetByName('No Seleccionadas');
  if (noSeleccionadas) {
    noSeleccionadas.getRange('E2:E500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(['Interés inicial', 'Post-entrevista', 'Post-selección']).setAllowInvalid(false).build()
    );
    noSeleccionadas.getRange('F2:F500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.MOTIVOS_NO_SELECCION).setAllowInvalid(true).build()
    );
    noSeleccionadas.getRange('G2:G500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(['Hoja de Interés', 'Entrevistas', 'Seleccionadas']).setAllowInvalid(false).build()
    );
    // Acción (I) - Opciones para reenviar según origen
    noSeleccionadas.getRange('I2:I500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(['Reenviar a Entrevistas', 'Reenviar a Seleccionadas']).setAllowInvalid(true).build()
    );
  }

  // === HOJA DE COHORTES ===
  const cohortesSheet = ss.getSheetByName('Cohortes');
  if (cohortesSheet) {
    cohortesSheet.getRange('E2:E50').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(responsables).setAllowInvalid(false).build()
    );
    // Estado (columna M) - Solo Activa/Finalizada
    cohortesSheet.getRange('M2:M50').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.ESTADOS_COHORTE).setAllowInvalid(false).build()
    );
  }

  Logger.log('✅ Validaciones configuradas');
}

/**
 * Obtiene solo cohortes con estado "Activa"
 */
function obtenerCohortesActivas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Cohortes');
  if (!sheet) return [];

  const datos = sheet.getRange('A2:M50').getValues();
  const cohortes = [];
  datos.forEach(fila => {
    // Columna A = nombre, Columna M (índice 12) = estado
    if (fila[0] && fila[0].toString().trim() !== '' && fila[12] === 'Activa') {
      cohortes.push(fila[0].toString().trim());
    }
  });
  return cohortes;
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

  // Formato para Entrevistas - Estado (columna I)
  const entrevistas = ss.getSheetByName('Entrevistas');
  if (entrevistas) {
    const rangoEstadoEnt = entrevistas.getRange('I2:I500');

    const reglaAprobada = SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains('Aprobada').setBackground('#c8e6c9').setRanges([rangoEstadoEnt]).build();
    const reglaPendiente = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Pendiente').setBackground('#fff9c4').setRanges([rangoEstadoEnt]).build();
    const reglaNoAprobada = SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains('No aprobada').setBackground('#ffcdd2').setRanges([rangoEstadoEnt]).build();
    const reglaNoAsistio = SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains('No asistió').setBackground('#ffcdd2').setRanges([rangoEstadoEnt]).build();

    entrevistas.setConditionalFormatRules([reglaAprobada, reglaPendiente, reglaNoAprobada, reglaNoAsistio]);
  }

  // Formato condicional para Cohortes - Cupo lleno (Inscritas >= Cupo Máximo)
  const cohortesSheet = ss.getSheetByName('Cohortes');
  if (cohortesSheet) {
    const rangoInscritas = cohortesSheet.getRange('G2:G50');
    const reglaCupoLleno = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=AND(G2>=F2,F2>0)')
      .setBackground('#ffcdd2')
      .setFontColor('#b71c1c')
      .setBold(true)
      .setRanges([rangoInscritas])
      .build();

    const rangoDisponible = cohortesSheet.getRange('G2:G50');
    const reglaCupoDisponible = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=AND(G2<F2,F2>0)')
      .setBackground('#c8e6c9')
      .setRanges([rangoDisponible])
      .build();

    cohortesSheet.setConditionalFormatRules([reglaCupoLleno, reglaCupoDisponible]);
  }

  Logger.log('✅ Formatos aplicados');
}

// =====================================================================
// TRIGGER PRINCIPAL - AUTOMATIZACIONES SIMPLIFICADAS
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
  // Estado está en columna N (14) - solo "Entrevista agendada" o "No interesado"
  if (hoja === 'Hoja de Interés') {
    if (columna === 14) {
      procesarCambioEstadoInteres(sheet, fila, val);
    }
  }

  // === ENTREVISTAS ===
  // Estado está en columna I (9) - triggers automáticos según resultado
  if (hoja === 'Entrevistas') {
    if (columna === 9) {
      procesarResultadoEntrevista(sheet, fila, val);
    }
  }

  // === SELECCIONADAS ===
  // "Enviar a Cohorte" está en columna J (10) - al seleccionar cohorte se envía
  if (hoja === 'Seleccionadas') {
    if (columna === 10 && val !== '') {
      procesarEnvioACohorte(sheet, fila, val);
    }
  }

  // === COHORTES ===
  // Estado está en columna M (13) - "Finalizada" activa graduación masiva
  if (hoja === 'Cohortes') {
    if (columna === 13 && val === 'Finalizada') {
      procesarFinalizacionCohorte(sheet, fila);
    }
  }

  // === NO SELECCIONADAS ===
  // Acción está en columna I (9) - reenviar a Entrevistas o Seleccionadas
  if (hoja === 'No Seleccionadas') {
    if (columna === 9 && val.startsWith('Reenviar')) {
      procesarReenvioDesdeNoSeleccionadas(sheet, fila, val);
    }
  }

  // === DESERCIONES ===
  // Acción está en columna J (10) - reenviar a Seleccionadas
  if (hoja === 'Deserciones') {
    if (columna === 10 && val === 'Reenviar a Seleccionadas') {
      procesarReenvioDesdeDeserciones(sheet, fila);
    }
  }

  // === HOJAS DE COHORTES INDIVIDUALES ===
  const hojasPrincipales = ['Hoja de Interés', 'Entrevistas', 'Seleccionadas', 'Cohortes',
                            'Graduadas', 'Deserciones', 'No Seleccionadas', 'Reporte', 'Reportes Mensuales',
                            'Lista Definitiva', 'Detalle Entrevistas'];
  if (!hojasPrincipales.includes(hoja)) {
    // Auto-rellenar Fecha (A) y No. (B) cuando se escribe el Nombre (E) manualmente
    if (columna === 5 && val !== '') {
      if (!sheet.getRange(fila, 1).getValue()) {
        sheet.getRange(fila, 1).setValue(new Date());
      }
      if (!sheet.getRange(fila, 2).getValue()) {
        sheet.getRange(fila, 2).setValue(fila - 1);
      }
    }
    // Estado está en columna I (9) - "Graduada" o "Deserción"
    if (columna === 9) {
      if (val === 'Graduada') {
        procesarGraduacionIndividual(sheet, fila, hoja);
      } else if (val === 'Deserción') {
        procesarDesercionEnCohorte(sheet, fila, hoja);
      }
    }
  }
}

/**
 * Procesa cambio de estado en Hoja de Interés
 * - "No interesado" → Copia a No Seleccionadas (conserva registro en Hoja de Interés)
 * - "Entrevista agendada" → Copia a Entrevistas (conserva registro en Hoja de Interés)
 */
function procesarCambioEstadoInteres(sheet, fila, estado) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const datos = sheet.getRange(fila, 1, 1, 14).getValues()[0];

  if (estado === 'No interesado') {
    const noSeleccionadas = ss.getSheetByName('No Seleccionadas');
    const nuevaFila = obtenerPrimeraFilaVacia(noSeleccionadas, 'C');

    // Columnas: Fecha, CreamosID, Nombre, Tel, Etapa, Motivo, Origen, Notas, Acción
    const registro = [
      new Date(),
      datos[2],             // Creamos ID
      datos[4],             // Nombre
      datos[6],             // Teléfono
      'Interés inicial',    // Etapa
      'No interesado',      // Motivo
      'Hoja de Interés',    // Origen
      datos[12],            // Notas (columna M)
      ''                    // Acción (vacío)
    ];

    noSeleccionadas.getRange(nuevaFila, 1, 1, 9).setValues([registro]);

    // COLOR AMARILLO: Vino de Hoja de Interés
    noSeleccionadas.getRange(nuevaFila, 1, 1, 9).setBackground('#fff9c4');

    // Marcar como procesado (NO eliminar - conservar registro)
    sheet.getRange(fila, 1, 1, 14).setBackground('#fff9c4'); // Amarillo claro
    ss.toast('📋 Copiado a "No Seleccionadas" (registro conservado)', 'Completado', 3);
  }

  if (estado === 'Entrevista agendada') {
    const entrevistas = ss.getSheetByName('Entrevistas');
    const nuevaFila = entrevistas.getLastRow() + 1;

    // Entrevistas: Fecha, Hora, CreamosID, Nombre, Tel, Entrevistador, Observaciones, Estado
    const registro = [
      '',                   // A: Fecha Entrevista
      '',                   // B: Hora
      datos[2],             // C: Creamos ID
      datos[4],             // D: Nombre
      datos[6],             // E: Teléfono
      'Eva',                // F: Entrevistador (por defecto)
      '',                   // G: Observaciones
      ''                    // H: Estado (vacío hasta que se complete)
    ];

    entrevistas.getRange(nuevaFila, 1, 1, 8).setValues([registro]);

    // Marcar como procesado (NO eliminar - conservar registro)
    sheet.getRange(fila, 1, 1, 14).setBackground('#c8e6c9'); // Verde claro
    ss.toast('📋 Entrevista creada en hoja Entrevistas (registro conservado).', 'Entrevista Agendada', 4);
  }
}

/**
 * Procesa resultado de entrevista (columna Estado)
 * - "Aprobada" → Mueve a Seleccionadas
 * - "No aprobada" / "No asistió" → Mueve a No Seleccionadas
 * - "Reprogramada" → No hace nada
 */
function procesarResultadoEntrevista(sheet, fila, resultado) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  // Lee 9 columnas: A=Fecha, B=Hora, C=CreamosID, D=Nombre, E=Tel,
  //                 F=Entrevistador, G=Calificación, H=Observaciones, I=Estado
  const datos = sheet.getRange(fila, 1, 1, 9).getValues()[0];
  const creamosId = datos[2];

  if (resultado === 'Aprobada') {
    // Buscar datos adicionales en Hoja de Interés
    const interes = ss.getSheetByName('Hoja de Interés');
    const busqueda = buscarPorCreamosID(interes, creamosId);
    const datosInteres = busqueda ? busqueda.datos : null;
    const filaInteres = busqueda ? busqueda.fila : null;

    // Mover a Seleccionadas
    const seleccionadas = ss.getSheetByName('Seleccionadas');
    const nuevaFila = obtenerPrimeraFilaVacia(seleccionadas, 'D');

    // Orden: No, CreamosID, DPI, Nombre, Edad, Tel, NivelEdu, Zona, Notas, EnviarACohorte
    // Entrevistas: [0]Fecha, [1]Hora, [2]CreamosID, [3]Nombre, [4]Tel,
    //              [5]Entrevistador, [6]Calificación, [7]Observaciones, [8]Estado
    const registroSeleccionadas = [
      nuevaFila - 1,
      creamosId,
      datosInteres ? datosInteres[3] : '',          // DPI
      datos[3],                                     // Nombre
      datosInteres ? datosInteres[5] : '',          // Edad
      datos[4],                                     // Teléfono
      datosInteres ? datosInteres[7] : '',          // Nivel Educativo
      datosInteres ? datosInteres[8] : '',          // Zona
      datos[7],                                     // Notas (Observaciones - columna H)
      ''                                            // Enviar a Cohorte (vacío)
    ];

    seleccionadas.getRange(nuevaFila, 1, 1, 10).setValues([registroSeleccionadas]);

    // Marcar en Hoja de Interés como procesado (NO eliminar)
    if (filaInteres) {
      interes.getRange(filaInteres, 1, 1, 14).setBackground('#c8e6c9'); // Verde claro
    }

    // Marcar en Entrevistas como procesado (NO eliminar)
    sheet.getRange(fila, 1, 1, 9).setBackground('#c8e6c9'); // Verde claro

    ss.toast('✅ Aprobada - copiada a Seleccionadas. Asigne cohorte.', 'Entrevista', 4);
    return;
  }

  if (resultado === 'No aprobada' || resultado === 'No asistió') {
    const noSeleccionadas = ss.getSheetByName('No Seleccionadas');
    const nuevaFila = obtenerPrimeraFilaVacia(noSeleccionadas, 'C');

    const motivo = resultado === 'No aprobada' ? 'No aprobó entrevista' : 'No asistió a entrevista';

    // Columnas: Fecha, CreamosID, Nombre, Tel, Etapa, Motivo, Origen, Notas, Acción
    const registro = [
      new Date(),
      datos[2],             // Creamos ID
      datos[3],             // Nombre
      datos[4],             // Teléfono
      'Post-entrevista',    // Etapa
      motivo,
      'Entrevistas',        // Origen
      datos[7],             // Notas (Observaciones - columna H)
      ''                    // Acción (vacío)
    ];

    noSeleccionadas.getRange(nuevaFila, 1, 1, 9).setValues([registro]);

    // COLOR NARANJA: Vino de Entrevistas
    noSeleccionadas.getRange(nuevaFila, 1, 1, 9).setBackground('#ffe0b2');

    // Marcar en Entrevistas como procesado (NO eliminar)
    sheet.getRange(fila, 1, 1, 9).setBackground('#ffe0b2'); // Naranja claro

    ss.toast('📋 Copiado a "No Seleccionadas" (registro conservado)', 'Entrevista', 3);
  }

  // "Reprogramada" no hace nada automático
}

/**
 * Procesa deserción desde hoja individual de Cohorte
 * Pregunta motivo y mueve a Deserciones
 */
function procesarDesercionEnCohorte(sheet, fila, nombreCohorte) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  // Datos de la hoja de cohorte: Fecha, No, CreamosID, DPI, Nombre, Edad, Tel, NivelEdu, Estado
  const datos = sheet.getRange(fila, 1, 1, 9).getValues()[0];
  const creamosId = datos[2];
  const nombre = datos[4];

  // Mostrar motivos de deserción
  let listaMotivos = '';
  CONFIG.MOTIVOS_DESERCION.forEach((motivo, idx) => {
    listaMotivos += (idx + 1) + '. ' + motivo + '\n';
  });

  const respuesta = ui.prompt(
    '📋 Deserción - ' + nombre,
    'Seleccione el MOTIVO:\n\n' + listaMotivos + '\nIngrese el número:',
    ui.ButtonSet.OK_CANCEL
  );

  if (respuesta.getSelectedButton() !== ui.Button.OK) {
    sheet.getRange(fila, 9).setValue(''); // Limpiar Estado
    return;
  }

  const num = parseInt(respuesta.getResponseText().trim());
  if (isNaN(num) || num < 1 || num > CONFIG.MOTIVOS_DESERCION.length) {
    ui.alert('Número inválido');
    sheet.getRange(fila, 9).setValue(''); // Limpiar Estado
    return;
  }

  const motivo = CONFIG.MOTIVOS_DESERCION[num - 1];

  // Agregar a Deserciones
  // Columnas: Fecha, CreamosID, DPI, Nombre, Tel, NivelEdu, Cohorte, Motivo, Notas, Acción
  const deserciones = ss.getSheetByName('Deserciones');
  const nuevaFila = obtenerPrimeraFilaVacia(deserciones, 'D');

  const registro = [
    new Date(),
    datos[2],           // Creamos ID
    datos[3],           // DPI
    datos[4],           // Nombre
    datos[6],           // Teléfono
    datos[7],           // Nivel Educativo
    nombreCohorte,      // Cohorte
    motivo,             // Motivo
    '',                 // Notas
    ''                  // Acción (vacío)
  ];

  deserciones.getRange(nuevaFila, 1, 1, 10).setValues([registro]);

  // Marcar fila como Deserción (NO eliminar - conservar registro)
  sheet.getRange(fila, 1, 1, 9).setBackground('#ffcdd2'); // Rojo claro

  ss.toast('📋 Deserción registrada: ' + motivo, 'Cohorte ' + nombreCohorte, 4);

  // Enviar email a Eva con recordatorio de Salesforce
  enviarEmailDesercionEva(nombre, nombreCohorte, motivo, creamosId);

  // Recordatorio Salesforce: actualizar etapa en el CRM
  ui.alert(
    '⚠️ Recordatorio Salesforce',
    'La deserción de ' + nombre + ' ha sido registrada.\n\n' +
    'Recuerda cambiar la etapa en Salesforce a "Deserción" para mantener el CRM actualizado.',
    ui.ButtonSet.OK
  );
}

/**
 * Procesa envío a cohorte desde Seleccionadas (columna K - Enviar a Cohorte)
 * - Agrega a la hoja individual de la Cohorte
 * - Marca como enviada en Seleccionadas (conserva registro)
 */
/**
 * Procesa envío a cohorte desde Seleccionadas (columna J - Enviar a Cohorte)
 * - Verifica cupo disponible
 * - Agrega a la hoja individual de la Cohorte
 * - ELIMINA de Seleccionadas
 */
function procesarEnvioACohorte(sheet, fila, cohorteDestino) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Seleccionadas tiene 10 columnas: No, CreamosID, DPI, Nombre, Edad, Tel, NivelEdu, Zona, Notas, EnviarACohorte
  const datos = sheet.getRange(fila, 1, 1, 10).getValues()[0];
  const creamosId = datos[1];
  const nombre = datos[3];

  // Verificar que la cohorte existe
  const hojaCohorte = ss.getSheetByName(cohorteDestino);
  if (!hojaCohorte) {
    ss.toast('⚠️ La cohorte "' + cohorteDestino + '" no existe. Créela primero.', 'Error', 4);
    sheet.getRange(fila, 10).setValue(''); // Limpiar selección
    return;
  }

  // Verificar cupo disponible
  const cohortesSheet = ss.getSheetByName('Cohortes');
  if (cohortesSheet) {
    const datosCohortes = cohortesSheet.getDataRange().getValues();
    for (let i = 1; i < datosCohortes.length; i++) {
      if (datosCohortes[i][0] === cohorteDestino) {
        const cupoMax = datosCohortes[i][5];
        const inscritas = datosCohortes[i][6];
        if (cupoMax && inscritas >= cupoMax) {
          const ui = SpreadsheetApp.getUi();
          const resp = ui.alert(
            '⚠️ CUPO LLENO',
            'La cohorte "' + cohorteDestino + '" tiene el cupo lleno.\n\n' +
            'Inscritas: ' + inscritas + ' / ' + cupoMax + ' (Cupo Máximo)\n\n' +
            '¿Desea enviar de todas formas?',
            ui.ButtonSet.YES_NO
          );
          if (resp !== ui.Button.YES) {
            sheet.getRange(fila, 10).setValue(''); // Limpiar selección
            return;
          }
        }
        break;
      }
    }
  }

  // Agregar a la hoja individual de la Cohorte
  // Usar obtenerPrimeraFilaVacia sobre columna E (Nombre) para evitar contar filas vacías
  const nuevaFilaCohorte = obtenerPrimeraFilaVacia(hojaCohorte, 'E');
  const noParticipante = nuevaFilaCohorte - 1; // No. secuencial (fila 2 = participante 1)
  // Orden: Fecha, No, CreamosID, DPI, Nombre, Edad, Tel, NivelEdu, Estado
  const registroCohorte = [
    new Date(),
    noParticipante,
    creamosId,
    datos[2],           // DPI
    nombre,
    datos[4],           // Edad
    datos[5],           // Teléfono
    datos[6],           // Nivel Educativo
    ''                  // Estado (vacío - opciones: Graduada/Deserción)
  ];
  hojaCohorte.getRange(nuevaFilaCohorte, 1, 1, 9).setValues([registroCohorte]);

  // Agregar copia a Lista Definitiva (registro histórico permanente)
  // Crear automáticamente si no existe
  if (!ss.getSheetByName('Lista Definitiva')) {
    crearHojaListaDefinitiva();
  }
  const listaDefinitiva = ss.getSheetByName('Lista Definitiva');
  if (listaDefinitiva) {
    const nuevaFilaLD = obtenerPrimeraFilaVacia(listaDefinitiva, 'E');
    const registroLD = [
      nuevaFilaLD - 1,    // No.
      new Date(),         // Fecha Envío
      creamosId,          // Creamos ID
      datos[2],           // DPI
      nombre,             // Nombre Completo
      datos[4],           // Edad
      datos[5],           // Teléfono
      datos[6],           // Nivel Educativo
      datos[7],           // Zona
      cohorteDestino      // Cohorte
    ];
    listaDefinitiva.getRange(nuevaFilaLD, 1, 1, 10).setValues([registroLD]);
  }

  // Marcar como enviada (NO eliminar - conservar registro)
  sheet.getRange(fila, 9).setValue('Enviada a ' + cohorteDestino);
  sheet.getRange(fila, 10).setValue(''); // Limpiar dropdown
  sheet.getRange(fila, 1, 1, 10).setBackground('#e0e0e0'); // Gris claro

  ss.toast('✅ ' + nombre + ' enviada a cohorte "' + cohorteDestino + '" y registrada en Lista Definitiva', 'Completado', 4);
}

/**
 * Procesa finalización de cohorte
 * Pregunta si todas se graduaron, si sí las gradúa masivamente
 * Si no, indica que vaya a la hoja individual para marcar una por una
 */
function procesarFinalizacionCohorte(sheet, fila) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const nombreCohorte = sheet.getRange(fila, 1).getValue();

  if (!nombreCohorte) {
    ss.toast('⚠️ No hay nombre de cohorte', 'Error', 3);
    sheet.getRange(fila, 13).setValue('Activa');
    return;
  }

  const hojaCohorte = ss.getSheetByName(nombreCohorte);
  if (!hojaCohorte) {
    ss.toast('⚠️ No existe la hoja de la cohorte', 'Error', 3);
    sheet.getRange(fila, 13).setValue('Activa');
    return;
  }

  // Contar participantes activas en la cohorte (sin estado definido)
  const datosCohorte = hojaCohorte.getDataRange().getValues();
  let participantesActivas = 0;
  for (let i = 1; i < datosCohorte.length; i++) {
    if (datosCohorte[i][4] && (!datosCohorte[i][8] || datosCohorte[i][8] === '')) {
      participantesActivas++;
    }
  }

  if (participantesActivas === 0) {
    // Todas ya fueron graduadas individualmente — ofrecer reenviar al seguimiento externo
    const totalGraduadas = datosCohorte.slice(1).filter(f => f[4] && f[8] === 'Graduada').length;
    if (totalGraduadas > 0) {
      const reenviar = ui.alert(
        '✅ Cohorte ya graduada',
        'Todos los participantes ya tienen estado "Graduada".\n\n' +
        totalGraduadas + ' participante(s) registradas en la cohorte.\n\n' +
        '¿Reenviar al archivo externo de seguimiento las que falten?\n' +
        '(Seguro hacerlo — no duplica si ya están registradas)',
        ui.ButtonSet.YES_NO
      );
      if (reenviar === ui.Button.YES) {
        reenviarCohorteAlSeguimiento(nombreCohorte, hojaCohorte);
      }
    } else {
      ss.toast('✅ Cohorte finalizada (sin participantes)', 'Completado', 3);
    }
    return;
  }

  // Preguntar si todas se graduaron
  const respuesta = ui.alert(
    '🎓 Finalizar Cohorte: ' + nombreCohorte,
    'Hay ' + participantesActivas + ' participantes en esta cohorte.\n\n' +
    '¿Todas se GRADUARON?\n\n' +
    'SÍ = Graduar a todas automáticamente\n' +
    'NO = Ir a la hoja "' + nombreCohorte + '" para marcar individualmente',
    ui.ButtonSet.YES_NO
  );

  if (respuesta === ui.Button.YES) {
    // Graduar a todas
    graduarTodaLaCohorte(nombreCohorte, hojaCohorte);

    // OCULTAR la hoja de cohorte (archivar)
    hojaCohorte.hideSheet();

    ss.toast('🎓 Todas graduadas de ' + nombreCohorte + ' - Hoja archivada', 'Graduación Masiva', 4);
  } else {
    // Revertir estado a Activa y notificar
    sheet.getRange(fila, 13).setValue('Activa');
    ss.toast('📋 Vaya a la hoja "' + nombreCohorte + '" para marcar individualmente', 'Acción Requerida', 5);

    // Activar la hoja de la cohorte
    hojaCohorte.activate();
  }
}

/**
 * Gradúa a todas las participantes de una cohorte
 */
function graduarTodaLaCohorte(nombreCohorte, hojaCohorte) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  const graduadas = ss.getSheetByName('Graduadas');

  const datosCohorte = hojaCohorte.getDataRange().getValues();
  const fechaGraduacion = new Date();
  let graduadasCount = 0;
  const listaParaEmail = [];

  for (let i = 1; i < datosCohorte.length; i++) {
    const fila = datosCohorte[i];
    // Solo procesar si tiene nombre y no tiene estado (o estado vacío)
    if (fila[4] && (!fila[8] || fila[8] === '')) {
      listaParaEmail.push({ nombre: fila[4], creamosId: fila[2] || '' });
      const nuevaFilaGrad = graduadas.getLastRow() + 1;

      // Si no tiene Creamos ID, agregar nota
      const notaID = fila[2] ? '' : '⚠️ Sin Creamos ID — verificar en Salesforce';

      // Orden Graduadas: Fecha, CreamosID, DPI, Nombre, Tel, NivelEdu, Cohorte, Notas
      const registroGraduada = [
        fechaGraduacion,
        fila[2] || '',     // Creamos ID (puede estar vacío)
        fila[3],           // DPI
        fila[4],           // Nombre
        fila[6],           // Teléfono
        fila[7],           // Nivel Educativo
        nombreCohorte,
        notaID             // Notas (alerta si falta ID)
      ];

      graduadas.getRange(nuevaFilaGrad, 1, 1, 8).setValues([registroGraduada]);

      // Marcar como Graduada en la hoja de cohorte (NO eliminar — queda como archivo)
      hojaCohorte.getRange(i + 1, 9).setValue('Graduada');
      hojaCohorte.getRange(i + 1, 1, 1, 9).setBackground('#e8f5e9'); // Verde claro = graduada

      // Si falta Creamos ID, resaltar col C en naranja (encima del verde)
      if (!fila[2]) {
        hojaCohorte.getRange(i + 1, 3).setBackground('#ffe0b2');
      }

      graduadasCount++;
    }
  }

  // Enviar AL ARCHIVO EXTERNO en un solo batch después del loop
  // (evita fallos por cuota/caché al llamar openById múltiples veces)
  if (graduadasCount > 0) {
    reenviarCohorteAlSeguimiento(nombreCohorte, hojaCohorte, true); // silencioso = toast only
    // Enviar email con lista completa de graduadas
    enviarEmailListaGraduadas(nombreCohorte, listaParaEmail);
  }

  // Recordatorio Salesforce para toda la cohorte
  if (graduadasCount > 0) {
    ui.alert(
      '⚠️ Recordatorio Salesforce',
      graduadasCount + ' participante(s) de la cohorte "' + nombreCohorte + '" han sido graduadas.\n\n' +
      'Recuerda cambiar la etapa en Salesforce a "Graduada" para mantener el CRM actualizado.',
      ui.ButtonSet.OK
    );
  }
}

/**
 * Procesa graduación individual desde hoja de cohorte
 */
function procesarGraduacionIndividual(sheet, fila, nombreCohorte) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const graduadas = ss.getSheetByName('Graduadas');

  const datos = sheet.getRange(fila, 1, 1, 9).getValues()[0];
  const fechaGraduacion = new Date();

  // Si no tiene Creamos ID, agregar nota
  const notaID = datos[2] ? '' : '⚠️ Sin Creamos ID — verificar en Salesforce';

  const nuevaFilaGrad = graduadas.getLastRow() + 1;

  // Orden Graduadas: Fecha, CreamosID, DPI, Nombre, Tel, NivelEdu, Cohorte, Notas
  const registroGraduada = [
    fechaGraduacion,
    datos[2] || '',     // Creamos ID (puede estar vacío)
    datos[3],           // DPI
    datos[4],           // Nombre
    datos[6],           // Teléfono
    datos[7],           // Nivel Educativo
    nombreCohorte,
    notaID              // Notas (alerta si falta ID)
  ];

  graduadas.getRange(nuevaFilaGrad, 1, 1, 8).setValues([registroGraduada]);

  // Enviar automáticamente al archivo externo de seguimiento
  enviarAArchivoSeguimiento(datos[2], datos[4], datos[6], datos[7], nombreCohorte);

  // Marcar como Graduada en la hoja de cohorte (NO eliminar — queda como archivo)
  sheet.getRange(fila, 9).setValue('Graduada');
  sheet.getRange(fila, 1, 1, 9).setBackground('#e8f5e9'); // Verde claro = graduada

  // Si falta Creamos ID, resaltar esa celda en naranja
  if (!datos[2]) {
    sheet.getRange(fila, 3).setBackground('#ffe0b2'); // Naranja claro en col C (Creamos ID)
  }

  ss.toast('🎓 ' + datos[4] + ' graduada exitosamente', 'Completado', 3);

  // Recordatorio Salesforce
  SpreadsheetApp.getUi().alert(
    '⚠️ Recordatorio Salesforce',
    datos[4] + ' ha sido graduada.\n\n' +
    'Recuerda cambiar la etapa en Salesforce a "Graduada" para mantener el CRM actualizado.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * Reenvía al archivo externo de seguimiento todos los participantes marcados como "Graduada"
 * en una hoja de cohorte. Evita duplicados consultando el archivo externo.
 */
/**
 * Reenvía al archivo externo todos los participantes "Graduada" de una cohorte.
 * Hace UNA SOLA apertura del archivo externo y UNA SOLA escritura en batch.
 *
 * @param {string}  nombreCohorte
 * @param {Sheet}   hojaCohorte    (null = usa activeSheet)
 * @param {boolean} silencioso     (true = toast sólo, sin alerta modal)
 * @returns {number} participantes enviadas
 */
function reenviarCohorteAlSeguimiento(nombreCohorte, hojaCohorte, silencioso) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  silencioso = silencioso === true;

  if (!hojaCohorte) {
    hojaCohorte   = ss.getActiveSheet();
    nombreCohorte = hojaCohorte.getName();
  }

  const ID_SEGUIMIENTO = '1_596FX6yr8tX93UyIks4emSeE2_vxLJMDyw9Zncsnzs';
  let hojaSeg;
  try {
    const archivoExterno = SpreadsheetApp.openById(ID_SEGUIMIENTO);
    hojaSeg = archivoExterno.getSheetByName('Graduados');
    if (!hojaSeg) {
      for (const s of archivoExterno.getSheets()) {
        if (s.getSheetId() === 676353499) { hojaSeg = s; break; }
      }
    }
  } catch (e) {
    if (!silencioso) ui.alert('❌ Error', 'No se pudo abrir el archivo externo:\n' + e.message, ui.ButtonSet.OK);
    else ss.toast('❌ Error al conectar con archivo externo: ' + e.message, 'Seguimiento', 8);
    return 0;
  }
  if (!hojaSeg) {
    if (!silencioso) ui.alert('❌ Error', 'No se encontró la hoja "Graduados" en el archivo externo.', ui.ButtonSet.OK);
    return 0;
  }

  // ── Deduplicación: leer UNA VEZ los registros existentes ──────────────────
  const ultimaFilaExterna = hojaSeg.getLastRow();
  const datosSeg = ultimaFilaExterna > 1
    ? hojaSeg.getRange(2, 1, ultimaFilaExterna - 1, 7).getValues()
    : [];
  const yaRegistrados = new Set();
  datosSeg.forEach(r => {
    if (r[2]) yaRegistrados.add(r[2].toString().trim()); // Creamos ID (col C)
    if (r[3]) yaRegistrados.add(r[3].toString().trim()); // Nombre    (col D)
  });

  // ── Entrevistas locales (para incluir fecha y entrevistador) ───────────────
  const hEnt     = ss.getSheetByName('Entrevistas');
  const datosEnt = (hEnt && hEnt.getLastRow() > 1) ? hEnt.getDataRange().getValues() : [];
  const buscarEntrevista = (creamosId) => {
    if (!creamosId) return { fecha: '', entrevistador: '' };
    for (let i = 1; i < datosEnt.length; i++) {
      if (datosEnt[i][2] && datosEnt[i][2].toString().trim() === creamosId.toString().trim()) {
        return { fecha: datosEnt[i][0] || '', entrevistador: datosEnt[i][5] || '' };
      }
    }
    return { fecha: '', entrevistador: '' };
  };

  // ── Construir filas a agregar ──────────────────────────────────────────────
  const datosCohorte = hojaCohorte.getDataRange().getValues();
  const fechaEnvio   = new Date();
  let   sigNo        = ultimaFilaExterna; // No. secuencial base
  const nuevasFilas  = [];
  let   omitidas     = 0;

  for (let i = 1; i < datosCohorte.length; i++) {
    const fila = datosCohorte[i];
    if (!fila[4] || fila[8] !== 'Graduada') continue;

    const creamosId = fila[2] ? fila[2].toString().trim() : '';
    const nombre    = fila[4].toString().trim();

    if ((creamosId && yaRegistrados.has(creamosId)) || yaRegistrados.has(nombre)) {
      omitidas++;
      continue;
    }

    const entrev = buscarEntrevista(creamosId);
    sigNo++;

    nuevasFilas.push([
      sigNo - 1,           //  1: No.
      fechaEnvio,          //  2: Fecha de envío
      creamosId || '',     //  3: Creamos ID
      nombre,              //  4: Nombre completo
      fila[6] || '',       //  5: Número de teléfono
      fila[7] || '',       //  6: Formación (Nivel Educativo)
      nombreCohorte,       //  7: Cohorte
      entrev.fecha,        //  8: Fecha de entrevista
      entrev.entrevistador,//  9: Entrevistador
      'Aprobada',          // 10: Resultado entrevista
      '', '', '', '', '',  // 11-15
      'Graduada'           // 16: Etapa
    ]);

    yaRegistrados.add(nombre);
    if (creamosId) yaRegistrados.add(creamosId);
  }

  // ── Escritura en UN SOLO bloque ────────────────────────────────────────────
  if (nuevasFilas.length > 0) {
    const filaInicio = ultimaFilaExterna + 1;
    hojaSeg.getRange(filaInicio, 1, nuevasFilas.length, nuevasFilas[0].length)
           .setValues(nuevasFilas);
    SpreadsheetApp.flush();
  }

  const enviadas = nuevasFilas.length;
  const msg = enviadas + ' participante(s) enviadas al seguimiento'
            + (omitidas > 0 ? ' (' + omitidas + ' ya existían)' : '');

  if (silencioso) {
    ss.toast(msg, 'Seguimiento', 5);
  } else {
    ui.alert('✅ Reenvío completado',
      'Cohorte: ' + nombreCohorte + '\n\n' +
      '• ' + enviadas + ' participante(s) enviadas al archivo de seguimiento\n' +
      '• ' + omitidas + ' ya estaban registradas (omitidas)',
      ui.ButtonSet.OK);
  }
  return enviadas;
}

/**
 * Versión del menú — usa la hoja activa como cohorte
 */
function reenviarDesdeMenuCohorte() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hojaActiva = ss.getActiveSheet();
  const hojasPrincipales = ['Hoja de Interés', 'Entrevistas', 'Seleccionadas', 'Cohortes',
                            'Graduadas', 'Deserciones', 'No Seleccionadas', 'Reporte',
                            'Reportes Mensuales', 'Lista Definitiva', 'Detalle Entrevistas'];
  if (hojasPrincipales.includes(hojaActiva.getName())) {
    SpreadsheetApp.getUi().alert('⚠️ Aviso',
      'Esta función debe usarse estando en la hoja de la cohorte (ej. "Barismo Cohorte 1").\n\n' +
      'Ve a la hoja de la cohorte y vuelve a ejecutar.',
      SpreadsheetApp.getUi().ButtonSet.OK);
    return;
  }
  reenviarCohorteAlSeguimiento(hojaActiva.getName(), hojaActiva);
}

/**
 * Aplica formato condicional a una hoja de cohorte:
 * - Resalta Creamos ID (col C) en naranja si Nombre (col E) está lleno y col C está vacío
 */
function aplicarFormatoCohorte(hojaCohorte) {
  const rangoID = hojaCohorte.getRange('C2:C200');

  const reglaIDVacio = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND($E2<>"",$C2="")')
    .setBackground('#ffe0b2')
    .setFontColor('#e65100')
    .setRanges([rangoID])
    .build();

  const reglasActuales = hojaCohorte.getConditionalFormatRules().filter(
    r => r.getRanges().every(rng => rng.getA1Notation() !== 'C2:C200')
  );
  reglasActuales.push(reglaIDVacio);
  hojaCohorte.setConditionalFormatRules(reglasActuales);
}

/**
 * Instalación v4 — Auto-fill, formatos en cohortes, reenvío de graduadas
 */
function instalarV4() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const confirmacion = ui.alert(
    '🆕 Actualización v4 — Sin borrar datos',
    'Esta actualización agrega:\n\n' +
    '• Auto-rellenar Fecha y No. al escribir nombre en hojas de cohorte\n' +
    '• Resaltar Creamos ID vacíos en hojas de cohorte (naranja)\n' +
    '• Hoja "Lista Definitiva" (si no existe)\n' +
    '• Limpia cohortes eliminadas del desplegable\n' +
    '• Actualiza validaciones y fórmulas\n\n' +
    '¿Deseas continuar?',
    ui.ButtonSet.YES_NO
  );

  if (confirmacion !== ui.Button.YES) return;

  const cambios = [];

  try {
    if (!ss.getSheetByName('Lista Definitiva')) {
      crearHojaListaDefinitiva();
      cambios.push('✅ Hoja "Lista Definitiva" creada');
    } else {
      cambios.push('ℹ️ "Lista Definitiva" ya existía');
    }

    const eliminadas = limpiarCohortesEliminadas(true);
    if (eliminadas > 0) {
      cambios.push('✅ ' + eliminadas + ' cohorte(s) eliminadas del registro');
    }

    configurarValidaciones();
    cambios.push('✅ Validaciones actualizadas');

    repararFormulas();
    cambios.push('✅ Fórmulas de Cohortes corregidas');

    const hojasPrincipales = ['Hoja de Interés', 'Entrevistas', 'Seleccionadas', 'Cohortes',
                              'Graduadas', 'Deserciones', 'No Seleccionadas', 'Reporte',
                              'Reportes Mensuales', 'Lista Definitiva', 'Detalle Entrevistas'];
    let cohortesFormateadas = 0;
    ss.getSheets().forEach(s => {
      if (!hojasPrincipales.includes(s.getName()) && s.getLastRow() > 1) {
        try { aplicarFormatoCohorte(s); cohortesFormateadas++; } catch (e) {}
      }
    });
    if (cohortesFormateadas > 0) {
      cambios.push('✅ Formato de Creamos ID aplicado a ' + cohortesFormateadas + ' hojas de cohorte');
    }

    ss.toast(
      '🆕 ACTUALIZACIÓN v4 COMPLETADA\n\n' + cambios.join('\n') + '\n\nTus datos están intactos.',
      'Actualización',
      12
    );

  } catch (error) {
    ss.toast('❌ Error en actualización: ' + error.message, 'ERROR', 10);
    Logger.log('❌ Error v4: ' + error.message);
  }
}

// Función procesarCambioEstadoParticipante eliminada - ya no hay Estado en Seleccionadas

/**
 * Procesa reenvío desde No Seleccionadas
 * - "Reenviar a Entrevistas" → Crea entrada en Entrevistas
 * - "Reenviar a Seleccionadas" → Crea entrada en Seleccionadas
 */
function procesarReenvioDesdeNoSeleccionadas(sheet, fila, accion) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Columnas: Fecha, CreamosID, Nombre, Tel, Etapa, Motivo, Origen, Notas, Acción
  const datos = sheet.getRange(fila, 1, 1, 9).getValues()[0];
  const creamosId = datos[1];
  const nombre = datos[2];
  const telefono = datos[3];
  const origen = datos[6];
  const notas = datos[7];

  if (accion === 'Reenviar a Entrevistas') {
    const entrevistas = ss.getSheetByName('Entrevistas');
    const nuevaFila = entrevistas.getLastRow() + 1;

    // Columnas: Fecha, Hora, CreamosID, Nombre, Tel, Entrevistador, Obs, Estado
    const registro = [
      '',               // Fecha
      '',               // Hora
      creamosId,
      nombre,
      telefono,
      'Eva',            // Entrevistador (por defecto)
      'Reingreso desde No Seleccionadas - ' + notas,
      ''                // Estado
    ];

    entrevistas.getRange(nuevaFila, 1, 1, 8).setValues([registro]);

    // Marcar como reenviado (NO eliminar - conservar registro)
    sheet.getRange(fila, 9).setValue(''); // Limpiar acción
    sheet.getRange(fila, 1, 1, 9).setBackground('#e0e0e0'); // Gris claro

    ss.toast('✅ ' + nombre + ' reenviada a Entrevistas (registro conservado)', 'Reenvío', 4);
  }

  if (accion === 'Reenviar a Seleccionadas') {
    const seleccionadas = ss.getSheetByName('Seleccionadas');
    const nuevaFila = obtenerPrimeraFilaVacia(seleccionadas, 'D');

    // Columnas: No, CreamosID, DPI, Nombre, Edad, Tel, NivelEdu, Zona, Notas, EnviarACohorte
    const registro = [
      nuevaFila - 1,
      creamosId,
      '',               // DPI
      nombre,
      '',               // Edad
      telefono,
      '',               // Nivel Educativo
      '',               // Zona
      'Reingreso desde No Seleccionadas - ' + notas,
      ''                // Enviar a Cohorte
    ];

    seleccionadas.getRange(nuevaFila, 1, 1, 10).setValues([registro]);

    // Marcar como reenviado (NO eliminar - conservar registro)
    sheet.getRange(fila, 9).setValue(''); // Limpiar acción
    sheet.getRange(fila, 1, 1, 9).setBackground('#e0e0e0'); // Gris claro

    ss.toast('✅ ' + nombre + ' reenviada a Seleccionadas (registro conservado)', 'Reenvío', 4);
  }
}

/**
 * Procesa reenvío desde Deserciones a Seleccionadas
 */
function procesarReenvioDesdeDeserciones(sheet, fila) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Columnas: Fecha, CreamosID, DPI, Nombre, Tel, NivelEdu, Cohorte, Motivo, Notas, Acción
  const datos = sheet.getRange(fila, 1, 1, 10).getValues()[0];
  const creamosId = datos[1];
  const dpi = datos[2];
  const nombre = datos[3];
  const telefono = datos[4];
  const nivelEducativo = datos[5];
  const cohorteAnterior = datos[6];
  const notas = datos[8];

  const seleccionadas = ss.getSheetByName('Seleccionadas');
  const nuevaFila = obtenerPrimeraFilaVacia(seleccionadas, 'D');

  // Columnas: No, CreamosID, DPI, Nombre, Edad, Tel, NivelEdu, Zona, Notas, EnviarACohorte
  const registro = [
    nuevaFila - 1,
    creamosId,
    dpi,
    nombre,
    '',               // Edad
    telefono,
    nivelEducativo,
    '',               // Zona
    'Reingreso desde Deserción (' + cohorteAnterior + ') - ' + notas,
    ''                // Enviar a Cohorte
  ];

  seleccionadas.getRange(nuevaFila, 1, 1, 10).setValues([registro]);

  // NO ELIMINAR - Mantener registro histórico de deserción
  // Solo marcar que reingresó y limpiar la acción
  const notasActuales = datos[8] || '';
  const fechaReingreso = Utilities.formatDate(new Date(), 'America/Guatemala', 'dd/MM/yyyy');
  sheet.getRange(fila, 9).setValue(notasActuales + ' [Reingresó: ' + fechaReingreso + ']');
  sheet.getRange(fila, 10).setValue(''); // Limpiar Acción

  // Marcar fila con color gris claro para indicar que ya reingresó
  sheet.getRange(fila, 1, 1, 10).setBackground('#e0e0e0');

  ss.toast('✅ ' + nombre + ' reenviada a Seleccionadas (registro de deserción conservado)', 'Reenvío', 4);
}

/**
 * Elimina una fila por Creamos ID
 */
function eliminarPorCreamosID(sheet, creamosId) {
  if (!creamosId) return false;
  const datos = sheet.getDataRange().getValues();
  for (let i = datos.length - 1; i >= 1; i--) {
    if (datos[i][2] && datos[i][2].toString().trim() === creamosId.toString().trim()) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }
  return false;
}

/**
 * Envía una graduada al archivo externo de seguimiento.
 * Se llama automáticamente al graduarse — no requiere acción manual.
 * Columnas destino (hoja "Graduados"):
 *   ID Kobo | Nombre | Teléfono | Email | Formación | Cohorte |
 *   Fecha entrevista | Entrevistador | Resultado entrevista |
 *   Siguiente paso | Clasificación | Fecha clasificación |
 *   Empleado | Próxima llamada | Notas
 */
function enviarAArchivoSeguimiento(creamosId, nombre, telefono, formacion, cohorte) {
  const ID_SEGUIMIENTO = '1_596FX6yr8tX93UyIks4emSeE2_vxLJMDyw9Zncsnzs';
  const GID_GRADUADOS  = 676353499;

  try {
    const archivoExterno = SpreadsheetApp.openById(ID_SEGUIMIENTO);

    // Buscar hoja por nombre primero, luego por GID
    let hoja = archivoExterno.getSheetByName('Graduados');
    if (!hoja) {
      for (const s of archivoExterno.getSheets()) {
        if (s.getSheetId() === GID_GRADUADOS) { hoja = s; break; }
      }
    }
    if (!hoja) {
      Logger.log('❌ No se encontró la hoja "Graduados" en el archivo externo');
      return;
    }

    // Intentar obtener datos de entrevista desde hoja local "Entrevistas"
    // (puede estar vacío si el registro ya fue eliminado al aprobar)
    let fechaEntrevista = '';
    let entrevistador   = '';
    if (creamosId) {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const hEnt = ss.getSheetByName('Entrevistas');
      if (hEnt && hEnt.getLastRow() > 1) {
        const datosEnt = hEnt.getDataRange().getValues();
        for (let i = 1; i < datosEnt.length; i++) {
          if (datosEnt[i][2] && datosEnt[i][2].toString().trim() === creamosId.toString().trim()) {
            fechaEntrevista = datosEnt[i][0] || '';   // Columna A: Fecha Entrevista
            entrevistador   = datosEnt[i][5] || '';   // Columna F: Entrevistador
            break;
          }
        }
      }
    }

    const nuevaFila = hoja.getLastRow() + 1;

    // Columnas destino (16 columnas):
    // No. | Fecha de envío | Creamos ID | Nombre completo | Número de teléfono |
    // Formación | Cohorte | Fecha de entrevista | Entrevistador | Resultado entrevista |
    // Siguiente paso | Clasificación | Empleado | Próxima llamada | Notas | Etapa
    const registro = [
      nuevaFila - 1,            //  1: No. (auto)
      new Date(),               //  2: Fecha de envío
      creamosId   || '',        //  3: Creamos ID
      nombre      || '',        //  4: Nombre completo
      telefono    || '',        //  5: Número de teléfono
      formacion   || '',        //  6: Formación
      cohorte     || '',        //  7: Cohorte
      fechaEntrevista,          //  8: Fecha de entrevista
      entrevistador,            //  9: Entrevistador
      'Aprobada',               // 10: Resultado entrevista
      '',                       // 11: Siguiente paso
      '',                       // 12: Clasificación
      '',                       // 13: Empleado
      '',                       // 14: Próxima llamada
      '',                       // 15: Notas
      'Graduada'                // 16: Etapa
    ];

    hoja.getRange(nuevaFila, 1, 1, registro.length).setValues([registro]);
    SpreadsheetApp.getActiveSpreadsheet()
      .toast('✅ ' + (nombre || 'Graduada') + ' enviada al archivo de seguimiento', 'Seguimiento', 4);

  } catch (e) {
    Logger.log('❌ Error al enviar a archivo externo: ' + e.message);
    // Error silencioso — no bloquea el flujo de graduación
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
      return {
        datos: datos[i],
        fila: i + 1  // +1 porque getValues() empieza en 0 pero las filas en 1
      };
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
 * Importa datos desde KoboToolbox (solo Alimentos y Bebidas: Gastronomía y Barismo)
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
 * FILTRO ALIMENTOS Y BEBIDAS:
 * - Alimentos y Bebidas - Gastronomía
 * - Alimentos y Bebidas - Barismo
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
      // Fecha de registro (campo 'today' del formulario Kobo)
      fechaRegistro: buscarIndiceColumnaExacto(headers, [
        'today',
        'Fecha de registro',
        'Fecha registro'
      ]),

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

      // Redes sociales (sub-columnas de "¿Cuáles son las redes sociales que más utilizas?")
      // Estas se combinan para formar el valor de "Cómo se enteró"
      redFacebook: buscarIndiceColumnaExacto(headers, [
        'Inicio/¿Cuáles son las redes sociales que más utilizas?/Facebook',
        '¿Cuáles son las redes sociales que más utilizas?/Facebook'
      ]),
      redInstagram: buscarIndiceColumnaExacto(headers, [
        'Inicio/¿Cuáles son las redes sociales que más utilizas?/Instagram',
        '¿Cuáles son las redes sociales que más utilizas?/Instagram'
      ]),
      redTikTok: buscarIndiceColumnaExacto(headers, [
        'Inicio/¿Cuáles son las redes sociales que más utilizas?/TikTok',
        '¿Cuáles son las redes sociales que más utilizas?/TikTok'
      ]),
      redTwitter: buscarIndiceColumnaExacto(headers, [
        'Inicio/¿Cuáles son las redes sociales que más utilizas?/Twitter',
        '¿Cuáles son las redes sociales que más utilizas?/Twitter'
      ]),
      redWhatsApp: buscarIndiceColumnaExacto(headers, [
        'Inicio/¿Cuáles son las redes sociales que más utilizas?/WhatsApp',
        '¿Cuáles son las redes sociales que más utilizas?/WhatsApp'
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
    const nombresExistentes = new Set();
    const datosExistentes = hojaInteres.getDataRange().getValues();
    for (let i = 1; i < datosExistentes.length; i++) {
      if (datosExistentes[i][2]) idsExistentes.add(datosExistentes[i][2].toString().trim().toUpperCase());
      if (datosExistentes[i][3]) dpisExistentes.add(datosExistentes[i][3].toString().trim());
      if (datosExistentes[i][4]) nombresExistentes.add(datosExistentes[i][4].toString().trim().toLowerCase());
    }

    // Leer columna E una sola vez para rastrear filas vacías en memoria
    // (evita huecos y sobreescrituras al usar getLastRow() que devuelve 500+ por fórmulas en A/B)
    let maxFilasHoja = hojaInteres.getMaxRows();
    const colESnapshot = hojaInteres.getRange(2, 5, maxFilasHoja - 1, 1).getValues().flat();
    let filaVaciaIdx = 0;
    function siguienteFilaVacia() {
      while (filaVaciaIdx < colESnapshot.length &&
             colESnapshot[filaVaciaIdx] !== '' && colESnapshot[filaVaciaIdx] !== null) {
        filaVaciaIdx++;
      }
      if (filaVaciaIdx >= colESnapshot.length) {
        hojaInteres.insertRowsAfter(maxFilasHoja, 200);
        maxFilasHoja += 200;
        for (let ext = 0; ext < 200; ext++) colESnapshot.push('');
      }
      return filaVaciaIdx + 2; // +2: array[0] corresponde a fila 2
    }

    let importados = 0;
    let omitidosDuplicados = 0;
    let omitidosNoAlimentos = 0;

    // Procesar filas
    for (let i = 1; i < rows.length; i++) {
      const fila = rows[i];

      // === FILTRO: Solo registros de ALIMENTOS Y BEBIDAS ===
      // Obtener el texto de la columna de servicios de interés
      const servicioTexto = colIndices.servicioInteres >= 0 ?
        (fila[colIndices.servicioInteres] || '').toString().toLowerCase() : '';

      // Verificar si contiene algún programa de Alimentos y Bebidas
      const esGastronomia = servicioTexto.includes('alimentos y bebidas - gastronomía') || servicioTexto.includes('alimentos y bebidas - gastronomia');
      const esBarismo = servicioTexto.includes('alimentos y bebidas - barismo');

      // Si no tiene ningún programa de Alimentos y Bebidas, omitir
      if (!esGastronomia && !esBarismo) {
        omitidosNoAlimentos++;
        continue; // Saltar si no es Alimentos y Bebidas
      }

      // Obtener Creamos ID y DPI
      const creamosId = colIndices.creamosId >= 0 ? fila[colIndices.creamosId].toString().trim() : '';
      const dpi = colIndices.dpi >= 0 ? fila[colIndices.dpi].toString().trim() : '';

      // Construir nombre completo (necesario para la verificación de duplicados)
      const nombres = colIndices.nombres >= 0 ? fila[colIndices.nombres].toString().trim() : '';
      const apellidos = colIndices.apellidos >= 0 ? fila[colIndices.apellidos].toString().trim() : '';
      const nombreCompleto = (nombres + ' ' + apellidos).trim();

      // Verificar duplicados por CreamosID, DPI o Nombre (como último recurso)
      const esDuplicadoId = creamosId && idsExistentes.has(creamosId.toUpperCase());
      const esDuplicadoDpi = dpi && dpisExistentes.has(dpi);
      const esDuplicadoNombre = !creamosId && !dpi && nombreCompleto && nombresExistentes.has(nombreCompleto.toLowerCase());
      if (esDuplicadoId || esDuplicadoDpi || esDuplicadoNombre) {
        omitidosDuplicados++;
        continue;
      }

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

      // Obtener fecha de registro desde campo 'today' de Kobo
      let fechaRegistroKobo = '';
      if (colIndices.fechaRegistro >= 0 && fila[colIndices.fechaRegistro]) {
        const rawFecha = fila[colIndices.fechaRegistro].toString().trim();
        if (rawFecha) {
          const parsed = new Date(rawFecha);
          fechaRegistroKobo = isNaN(parsed.getTime()) ? rawFecha : parsed;
        }
      }

      // Construir "Cómo se enteró" desde las sub-columnas de redes sociales
      const redesSociales = [];
      if (verificarValorPositivo(fila, colIndices.redFacebook)) redesSociales.push('Facebook');
      if (verificarValorPositivo(fila, colIndices.redInstagram)) redesSociales.push('Instagram');
      if (verificarValorPositivo(fila, colIndices.redTikTok)) redesSociales.push('TikTok');
      if (verificarValorPositivo(fila, colIndices.redTwitter)) redesSociales.push('Twitter');
      if (verificarValorPositivo(fila, colIndices.redWhatsApp)) redesSociales.push('WhatsApp');
      const comoSeEntero = redesSociales.length > 0 ? redesSociales.join(' ') : '';

      // Determinar programa de interés y notas
      let programasSeleccionados = [];
      if (esGastronomia) programasSeleccionados.push('Gastronomía');
      if (esBarismo) programasSeleccionados.push('Barismo');

      // Programa de interés basado en la especialidad seleccionada
      let programaInteres = '';
      if (esGastronomia) {
        programaInteres = 'Gastronomía';
      } else if (esBarismo) {
        programaInteres = 'Barismo';
      }

      const notasPrograma = 'Kobo: ' + programasSeleccionados.join(', ');

      // Obtener la siguiente fila realmente vacía (sin huecos ni sobreescrituras)
      const nuevaFila = siguienteFilaVacia();
      colESnapshot[filaVaciaIdx] = nombreCompleto; // marcar como ocupada en memoria
      filaVaciaIdx++;

      // Limpiar validaciones solo en columnas intermedias (C-M) para no borrar
      // el dropdown de Estado (columna N) ni las protecciones de A y B
      hojaInteres.getRange(nuevaFila, 3, 1, 11).clearDataValidations();

      // Usar fecha de Kobo si existe; si no, poner fecha de hoy como valor fijo
      const fechaParaHoja = fechaRegistroKobo || new Date();

      // Preparar registro
      const registro = [
        fechaParaHoja,     // A: Fecha Registro (valor fijo, no fórmula dinámica)
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
        ''                 // N: Estado (vacío para que el dropdown funcione)
      ];

      hojaInteres.getRange(nuevaFila, 1, 1, 14).setValues([registro]);

      // Restaurar fórmula de No. (columna B) que setValues sobreescribe
      hojaInteres.getRange('B' + nuevaFila).setFormula('=IF(E' + nuevaFila + '<>"",COUNTA($E$2:E' + nuevaFila + '),"")');

      // Restaurar dropdown de Estado (columna N) para esta fila
      hojaInteres.getRange(nuevaFila, 14).setDataValidation(
        SpreadsheetApp.newDataValidation()
          .requireValueInList(['Entrevista agendada', 'No interesado'])
          .setAllowInvalid(false)
          .build()
      );

      if (creamosId) idsExistentes.add(creamosId.toUpperCase());
      if (dpi) dpisExistentes.add(dpi);
      if (nombreCompleto) nombresExistentes.add(nombreCompleto.toLowerCase());
      importados++;
    }

    const mensaje = '✅ IMPORTACIÓN COMPLETADA\n\n' +
      '📥 Importados: ' + importados + '\n' +
      '🔄 Duplicados omitidos: ' + omitidosDuplicados + '\n' +
      '🚫 No Alimentos (omitidos): ' + omitidosNoAlimentos;

    ss.toast(mensaje, 'Importación', 10);
    Logger.log(mensaje);

    // Actualizar datos faltantes en todas las hojas desde directorio maestro
    actualizarTodosDesdeDirectorio(true);

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
 * DEBUG: Muestra las columnas de Alimentos y Bebidas encontradas en Kobo
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

    let mensaje = '📊 COLUMNAS ALIMENTOS Y BEBIDAS ENCONTRADAS:\n\n';
    let colsAlimentos = [];

    for (let i = 0; i < headers.length; i++) {
      const h = headers[i].toLowerCase();
      if (h.includes('alimentos') || h.includes('bebidas') || h.includes('gastronomía') ||
          h.includes('gastronomia') || h.includes('barismo')) {
        colsAlimentos.push({ idx: i, nombre: headers[i] });
      }
    }

    if (colsAlimentos.length > 0) {
      colsAlimentos.forEach(c => {
        mensaje += '📌 [' + c.idx + '] ' + c.nombre.substring(0, 40) + '\n';
      });

      mensaje += '\n📋 VALORES FILA 1:\n';
      const primeraFila = rows[1];
      colsAlimentos.forEach(c => {
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
 * Actualiza la Hoja de Interés desde el nuevo formulario de Kobo
 * Combina históricos + nuevos datos sin eliminar registros existentes
 */
function actualizarHojaInteresDesdeNuevoKobo() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const url = CONFIG.KOBO_NUEVA_INTERES_URL;

  if (!url) {
    ui.alert('⚠️ URL no configurada', 'La URL del nuevo Kobo no está configurada.', ui.ButtonSet.OK);
    return;
  }

  try {
    ss.toast('📥 Actualizando Hoja de Interés desde nuevo Kobo...', 'Importando', 5);

    const response = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
      followRedirects: true,
      headers: { 'Accept': 'text/csv, application/csv, text/plain' }
    });

    const responseCode = response.getResponseCode();
    if (responseCode !== 200) {
      throw new Error('Error HTTP: ' + responseCode + '. Verifica que la URL sea correcta y pública.');
    }

    let csvData = response.getContentText('UTF-8');
    if (!csvData || csvData.trim().length === 0) {
      throw new Error('No se recibieron datos del servidor');
    }

    // Limpiar BOM si existe
    if (csvData.charCodeAt(0) === 0xFEFF) {
      csvData = csvData.substring(1);
    }

    // Detectar separador
    const primeraLinea = csvData.split('\n')[0];
    const countComas = (primeraLinea.match(/,/g) || []).length;
    const countPuntoComa = (primeraLinea.match(/;/g) || []).length;
    const countTabs = (primeraLinea.match(/\t/g) || []).length;

    let separador = ';';
    if (countComas > countPuntoComa && countComas > countTabs) {
      separador = ',';
    } else if (countTabs > countComas && countTabs > countPuntoComa) {
      separador = '\t';
    }

    // Parsear CSV
    let rows;
    try {
      if (separador === ';') {
        rows = parsearCSVManual(csvData, separador);
      } else {
        rows = Utilities.parseCsv(csvData, separador);
      }
    } catch (parseError) {
      rows = parsearCSVManual(csvData, separador);
    }

    if (!rows || rows.length < 2) {
      ss.toast('⚠️ No hay datos nuevos para importar', 'Sin Datos', 3);
      return;
    }

    const headers = rows[0];
    const sheet = ss.getSheetByName('Hoja de Interés');

    if (!sheet) {
      throw new Error('La hoja "Hoja de Interés" no existe. Ejecuta primero la instalación del sistema.');
    }

    // Obtener datos existentes (excluyendo encabezados)
    const datosExistentes = sheet.getLastRow() > 1 ? sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues() : [];

    // Crear un conjunto de registros existentes usando DPI o Nombre Completo como clave
    const registrosExistentes = new Set();
    datosExistentes.forEach(fila => {
      const dpi = fila[3] ? String(fila[3]).trim() : ''; // Columna D (DPI)
      const nombre = fila[4] ? String(fila[4]).trim() : ''; // Columna E (Nombre)
      if (dpi) registrosExistentes.add(dpi);
      if (nombre) registrosExistentes.add(nombre);
    });

    // Buscar índices de columnas en el CSV de Kobo
    const colIndices = {
      fechaRegistro: buscarIndiceColumnaExacto(headers, ['today', 'Fecha de registro', 'Fecha registro']),
      creamosId: buscarIndiceColumnaExacto(headers, ['Inicio/Creamos ID', 'Creamos ID', 'creamos_id']),
      dpi: buscarIndiceColumnaExacto(headers, ['Inicio/Número de DPI', 'Número de DPI', 'DPI']),
      nombres: buscarIndiceColumnaExacto(headers, ['Inicio/Nombre(s)', 'Nombre(s)', 'Nombres']),
      apellidos: buscarIndiceColumnaExacto(headers, ['Inicio/Apellido(s)', 'Apellido(s)', 'Apellidos']),
      fechaNacimiento: buscarIndiceColumnaExacto(headers, ['Inicio/Fecha de nacimiento', 'Fecha de nacimiento']),
      telefono: buscarIndiceColumnaExacto(headers, ['Inicio/Número de Teléfono', 'Número de Teléfono', 'Inicio/Número de Móvil/WhatsApp', 'Número de Móvil/WhatsApp', 'Teléfono']),
      nivelEducativo: buscarIndiceColumnaExacto(headers, ['Inicio/¿Cuál es tu último nivel de estudios terminado?', '¿Cuál es tu último nivel de estudios terminado?', 'Nivel educativo']),
      zona: buscarIndiceColumnaExacto(headers, ['Inicio/Zona', 'Zona']),
      comoSeEntero: buscarIndiceColumnaExacto(headers, ['Inicio/¿Cómo se enteró del programa?', '¿Cómo se enteró del programa?', 'Como se entero']),
      programaInteres: buscarIndiceColumnaExacto(headers, ['Inicio/¿Qué programa te interesa?', '¿Qué programa te interesa?', 'Programa interés'])
    };

    // Agregar solo registros nuevos
    let nuevosRegistros = 0;
    const nuevasFilas = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];

      const dpi = colIndices.dpi >= 0 ? String(row[colIndices.dpi] || '').trim() : '';
      const nombres = colIndices.nombres >= 0 ? String(row[colIndices.nombres] || '').trim() : '';
      const apellidos = colIndices.apellidos >= 0 ? String(row[colIndices.apellidos] || '').trim() : '';
      const nombreCompleto = (nombres + ' ' + apellidos).trim();

      // Verificar si el registro ya existe
      const yaExiste = (dpi && registrosExistentes.has(dpi)) || registrosExistentes.has(nombreCompleto);

      if (!yaExiste && nombreCompleto) {
        // Construir la fila según el formato de la Hoja de Interés
        const fechaRegistro = colIndices.fechaRegistro >= 0 ? row[colIndices.fechaRegistro] || '' : '';
        const creamosId = colIndices.creamosId >= 0 ? row[colIndices.creamosId] || '' : '';
        const fechaNac = colIndices.fechaNacimiento >= 0 ? row[colIndices.fechaNacimiento] || '' : '';
        const edad = calcularEdadDesdeTexto(fechaNac);
        const telefono = colIndices.telefono >= 0 ? row[colIndices.telefono] || '' : '';
        const nivelEducativo = colIndices.nivelEducativo >= 0 ? row[colIndices.nivelEducativo] || '' : '';
        const zona = colIndices.zona >= 0 ? row[colIndices.zona] || '' : '';
        const comoSeEntero = colIndices.comoSeEntero >= 0 ? row[colIndices.comoSeEntero] || '' : '';
        const programaInteres = colIndices.programaInteres >= 0 ? row[colIndices.programaInteres] || '' : '';

        nuevasFilas.push([
          fechaRegistro,    // A - Fecha Registro
          '',               // B - No. (se calculará con fórmula)
          creamosId,        // C - Creamos ID
          dpi,              // D - DPI
          nombreCompleto,   // E - Nombre Completo
          edad,             // F - Edad
          telefono,         // G - Teléfono
          nivelEducativo,   // H - Nivel Educativo
          zona,             // I - Zona
          comoSeEntero,     // J - Cómo se enteró
          programaInteres,  // K - Programa Interés
          '',               // L - Responsable (vacío)
          '',               // M - Notas (vacío)
          ''                // N - Estado (vacío)
        ]);

        nuevosRegistros++;
      }
    }

    if (nuevosRegistros > 0) {
      const ultimaFila = sheet.getLastRow();
      sheet.getRange(ultimaFila + 1, 1, nuevasFilas.length, nuevasFilas[0].length).setValues(nuevasFilas);

      // Copiar fórmulas para las nuevas filas
      for (let i = 0; i < nuevasFilas.length; i++) {
        const fila = ultimaFila + 1 + i;
        sheet.getRange('A' + fila).setFormula('=IF(E' + fila + '<>"",TODAY(),"")');
        sheet.getRange('B' + fila).setFormula('=IF(E' + fila + '<>"",COUNTA($E$2:E' + fila + '),"")');
      }

      ss.toast('✅ ' + nuevosRegistros + ' registro(s) nuevo(s) agregado(s) a Hoja de Interés', 'Actualización Completa', 5);
      Logger.log('✅ Actualización desde nuevo Kobo: ' + nuevosRegistros + ' registros agregados');
    } else {
      ss.toast('ℹ️ No hay registros nuevos para agregar', 'Sin Cambios', 3);
      Logger.log('ℹ️ No hay registros nuevos desde el nuevo Kobo');
    }

  } catch (error) {
    const mensaje = '❌ Error al actualizar desde nuevo Kobo: ' + error.message;
    ss.toast(mensaje, 'ERROR', 10);
    Logger.log(mensaje);
    throw error;
  }
}


/**
 * Importa datos de ENTREVISTAS desde KoboToolbox (IL_01_Entrevista)
 * Guarda en la hoja "Detalle Entrevistas" y vincula por Creamos ID
 */
function importarEntrevistasDesdeKobo() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const props = PropertiesService.getDocumentProperties();
  const url = props.getProperty('KOBO_ENTREVISTAS_URL') || CONFIG.KOBO_ENTREVISTAS_URL;

  if (!url) {
    ui.alert('⚠️ URL no configurada', 'Configure la URL de Entrevistas de KoboToolbox primero.', ui.ButtonSet.OK);
    return;
  }

  try {
    ss.toast('📥 Descargando datos de entrevistas desde KoboToolbox...', 'Importando', 5);

    const response = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
      followRedirects: true,
      headers: { 'Accept': 'text/csv, application/csv, text/plain' }
    });

    const responseCode = response.getResponseCode();
    if (responseCode !== 200) {
      throw new Error('Error HTTP: ' + responseCode);
    }

    let csvData = response.getContentText('UTF-8');
    if (!csvData || csvData.trim().length === 0) {
      throw new Error('No se recibieron datos del servidor');
    }

    if (csvData.charCodeAt(0) === 0xFEFF) {
      csvData = csvData.substring(1);
    }

    const primeraLinea = csvData.split('\n')[0];
    const countPuntoComa = (primeraLinea.match(/;/g) || []).length;
    const countComas = (primeraLinea.match(/,/g) || []).length;
    const separador = countPuntoComa > countComas ? ';' : ',';

    let rows;
    try {
      rows = separador === ';' ? parsearCSVManual(csvData, separador) : Utilities.parseCsv(csvData, separador);
    } catch (e) {
      rows = parsearCSVManual(csvData, separador);
    }

    if (!rows || rows.length < 2) {
      ss.toast('⚠️ No hay datos para importar', 'Sin Datos', 3);
      return;
    }

    const headers = rows[0];

    const colMap = {
      creamosId: buscarIndiceColumna(headers, ['Creamos ID', 'creamos_id', 'Información General/Creamos ID']),
      nombre: buscarIndiceColumna(headers, ['Nombre y apellidos', 'nombre', 'Información General/Nombre']),
      genero: buscarIndiceColumna(headers, ['Género', 'genero', 'Información General/Género']),
      gruposDiversos: buscarIndiceColumna(headers, ['grupos diversos', 'Trabajo en grupos/grupos diversos']),
      gruposMixtos: buscarIndiceColumna(headers, ['grupos mixtos', 'Trabajo en grupos/grupos mixtos']),
      expGruposMixtos: buscarIndiceColumna(headers, ['experiencia previa', 'grupos mixtos de hombres']),
      formacionPrevia: buscarIndiceColumna(headers, ['formación o capacitación previa', 'Formación']),
      dondeFormacion: buscarIndiceColumna(headers, ['Dónde', 'donde']),
      tieneCertificado: buscarIndiceColumna(headers, ['certificado para la capacitación']),
      cualCertificado: buscarIndiceColumna(headers, ['Cuál']),
      sectorInteres: buscarIndiceColumna(headers, ['sector te gustaría trabajar']),
      proyectoInteres: buscarIndiceColumna(headers, ['Proyecto de interés', 'proyecto']),
      dificultadesCurso: buscarIndiceColumna(headers, ['dificultades crees']),
      areasVida: buscarIndiceColumna(headers, ['áreas de tu vida']),
      porQueInteres: buscarIndiceColumna(headers, ['Por qué te interesa']),
      aprenderPractica: buscarIndiceColumna(headers, ['aprender para luego ponerlo en práctica', 'aprender para luego', 'ponerlo en práctica en el trabajo']),
      firmarDocumento: buscarIndiceColumna(headers, ['firmar un documento']),
      disponibilidadPracticas: buscarIndiceColumna(headers, ['disponibilidad de tiempo para realizar prácticas']),
      trabajarSector: buscarIndiceColumna(headers, ['dispuesto/a a trabajar en el sector']),
      horariosDemanantes: buscarIndiceColumna(headers, ['horarios nocturnos']),
      comentariosCurso: buscarIndiceColumna(headers, ['Comentarios']),
      ayudaEconomica: buscarIndiceColumna(headers, ['ayuda económicamente']),
      dependientesEcon: buscarIndiceColumna(headers, ['depende de ti económicamente']),
      responsabilidadesCuidado: buscarIndiceColumna(headers, ['responsabilidades de cuidado']),
      tieneTransporte: buscarIndiceColumna(headers, ['transporte para trasladarte']),
      planTraslado: buscarIndiceColumna(headers, ['plan para trasladarte']),
      deudasBancarias: buscarIndiceColumna(headers, ['deudas bancarias']),
      antecedentesManchados: buscarIndiceColumna(headers, ['antecedentes penales o policiacos']),
      tramitesPenales: buscarIndiceColumna(headers, ['trámites penales']),
      tallaZapato: buscarIndiceColumna(headers, ['talla de zapato']),
      movilizarseZona: buscarIndiceColumna(headers, ['movilizarte a cualquier zona']),
      conoceVBG: buscarIndiceColumna(headers, ['violencia basada en género']),
      conflictosCasa: buscarIndiceColumna(headers, ['conflictos en casa']),
      grupoMujeres: buscarIndiceColumna(headers, ['grupo formado mayormente por mujeres']),
      igualdadHM: buscarIndiceColumna(headers, ['hombres y mujeres sean tratados por igual']),
      familiaresCreamos: buscarIndiceColumna(headers, ['familiares que son participantes']),
      nombresFamiliares: buscarIndiceColumna(headers, ['facilitarnos sus nombres']),
      formalInformal: buscarIndiceColumna(headers, ['formal o informal']),
      conoceViolenciaMujer: buscarIndiceColumna(headers, ['violencia contra la mujer'])
    };

    let detalleSheet = ss.getSheetByName('Detalle Entrevistas');
    if (!detalleSheet) {
      crearHojaDetalleEntrevistas();
      detalleSheet = ss.getSheetByName('Detalle Entrevistas');
    }

    const datosExistentes = detalleSheet.getDataRange().getValues();
    const idsExistentes = new Set();
    for (let i = 1; i < datosExistentes.length; i++) {
      if (datosExistentes[i][1]) {
        idsExistentes.add(datosExistentes[i][1].toString().trim());
      }
    }

    let importados = 0;
    let duplicados = 0;

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const creamosId = colMap.creamosId >= 0 ? (row[colMap.creamosId] || '').toString().trim() : '';

      if (!creamosId) continue;

      if (idsExistentes.has(creamosId)) {
        duplicados++;
        continue;
      }

      const getVal = (idx) => idx >= 0 && row[idx] ? row[idx].toString().trim() : '';

      const registro = [
        new Date(), creamosId, getVal(colMap.nombre), getVal(colMap.genero),
        getVal(colMap.gruposDiversos), getVal(colMap.gruposMixtos), getVal(colMap.expGruposMixtos),
        getVal(colMap.formacionPrevia), getVal(colMap.dondeFormacion), getVal(colMap.tieneCertificado), getVal(colMap.cualCertificado),
        getVal(colMap.sectorInteres), getVal(colMap.proyectoInteres),
        getVal(colMap.dificultadesCurso), getVal(colMap.areasVida), getVal(colMap.porQueInteres),
        getVal(colMap.firmarDocumento), getVal(colMap.disponibilidadPracticas), getVal(colMap.trabajarSector),
        getVal(colMap.horariosDemanantes), getVal(colMap.comentariosCurso),
        getVal(colMap.ayudaEconomica), '', getVal(colMap.dependientesEcon), '',
        getVal(colMap.responsabilidadesCuidado), '', '',
        getVal(colMap.tieneTransporte), getVal(colMap.planTraslado), getVal(colMap.deudasBancarias),
        getVal(colMap.antecedentesManchados), '',
        getVal(colMap.tramitesPenales), getVal(colMap.tallaZapato), getVal(colMap.movilizarseZona), '',
        '', getVal(colMap.conoceVBG), '', '', '', getVal(colMap.conflictosCasa), '',
        getVal(colMap.grupoMujeres), getVal(colMap.igualdadHM), getVal(colMap.familiaresCreamos),
        getVal(colMap.nombresFamiliares), getVal(colMap.formalInformal), getVal(colMap.conoceViolenciaMujer),
        getVal(colMap.aprenderPractica), 'No'
      ];

      const nuevaFila = detalleSheet.getLastRow() + 1;
      detalleSheet.getRange(nuevaFila, 1, 1, registro.length).setValues([registro]);
      idsExistentes.add(creamosId);
      importados++;
    }

    vincularEntrevistasConDetalle();

    ss.toast('✅ Importados: ' + importados + ' | Duplicados: ' + duplicados, 'Importación Completa', 5);

  } catch (error) {
    ss.toast('❌ Error: ' + error.message, 'ERROR', 5);
    Logger.log('Error importando entrevistas: ' + error.message);
  }
}

/**
 * Busca el índice de una columna por nombre parcial
 */
function buscarIndiceColumna(headers, posiblesNombres) {
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i].toString().toLowerCase();
    for (const nombre of posiblesNombres) {
      if (header.includes(nombre.toLowerCase())) {
        return i;
      }
    }
  }
  return -1;
}

/**
 * Vincula los registros de Detalle Entrevistas con la hoja Entrevistas
 */
function vincularEntrevistasConDetalle() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const entrevistasSheet = ss.getSheetByName('Entrevistas');
  const detalleSheet = ss.getSheetByName('Detalle Entrevistas');

  if (!entrevistasSheet || !detalleSheet) return;

  const entrevistas = entrevistasSheet.getDataRange().getValues();
  const detalles = detalleSheet.getDataRange().getValues();

  const detalleMap = new Map();
  for (let i = 1; i < detalles.length; i++) {
    const id = detalles[i][1] ? detalles[i][1].toString().trim() : '';
    if (id) {
      detalleMap.set(id, { fila: i + 1, datos: detalles[i] });
    }
  }

  for (let i = 1; i < entrevistas.length; i++) {
    const idEntrevista = entrevistas[i][2] ? entrevistas[i][2].toString().trim() : '';
    if (idEntrevista && detalleMap.has(idEntrevista)) {
      const info = detalleMap.get(idEntrevista);
      detalleSheet.getRange(info.fila, 53).setValue('Sí');
    }
  }
}

/**
 * Configura la URL de KoboToolbox para Entrevistas
 */
function configurarKoboEntrevistasURL() {
  const ui = SpreadsheetApp.getUi();
  const props = PropertiesService.getDocumentProperties();
  const urlActual = props.getProperty('KOBO_ENTREVISTAS_URL') || CONFIG.KOBO_ENTREVISTAS_URL;

  const respuesta = ui.prompt(
    '🔗 Configurar URL de Entrevistas Kobo',
    'URL actual:\n' + urlActual + '\n\n' +
    'Ingresa la nueva URL del CSV de IL_01_Entrevista:',
    ui.ButtonSet.OK_CANCEL
  );

  if (respuesta.getSelectedButton() === ui.Button.OK) {
    const nuevaUrl = respuesta.getResponseText().trim();
    if (nuevaUrl && nuevaUrl.includes('http')) {
      props.setProperty('KOBO_ENTREVISTAS_URL', nuevaUrl);
      SpreadsheetApp.getActiveSpreadsheet().toast('✅ URL de Entrevistas configurada', 'Configurado', 4);
    } else {
      ui.alert('URL inválida');
    }
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
    '➕ Crear Nueva Cohorte - Paso 1/3',
    'Ingresa el NOMBRE de la nueva cohorte:\n\nEjemplos: "Cocina Cohorte III", "Barismo Cohorte II"',
    ui.ButtonSet.OK_CANCEL
  );
  if (respNombre.getSelectedButton() !== ui.Button.OK) return;
  const nombreBase = respNombre.getResponseText().trim();
  if (!nombreBase) { ui.alert('Nombre vacío'); return; }

  // Agregar año actual automáticamente entre paréntesis
  const anioActual = new Date().getFullYear();
  const nombre = nombreBase + ' (' + anioActual + ')';

  const cohortesExistentes = obtenerCohortesActuales();
  if (cohortesExistentes.includes(nombre)) {
    ui.alert('❌ Ya existe una cohorte con ese nombre: "' + nombre + '"');
    return;
  }

  const respCupo = ui.prompt(
    '➕ Crear Nueva Cohorte - Paso 2/3',
    'Ingresa el CUPO MÁXIMO:',
    ui.ButtonSet.OK_CANCEL
  );
  if (respCupo.getSelectedButton() !== ui.Button.OK) return;
  const cupo = parseInt(respCupo.getResponseText().trim()) || 20;

  const respFechaFin = ui.prompt(
    '➕ Crear Nueva Cohorte - Paso 3/3',
    'Ingresa la FECHA DE FIN (dd/mm/aaaa):',
    ui.ButtonSet.OK_CANCEL
  );
  if (respFechaFin.getSelectedButton() !== ui.Button.OK) return;
  const fechaFinTexto = respFechaFin.getResponseText().trim();
  let fechaFin = '';
  if (fechaFinTexto) {
    const partes = fechaFinTexto.split('/');
    if (partes.length === 3) {
      fechaFin = new Date(partes[2], partes[1] - 1, partes[0]);
    } else {
      fechaFin = fechaFinTexto;
    }
  }

  // Responsable automático: Eva
  const responsable = 'Eva';
  // Fecha inicio automática: hoy
  const fechaInicio = new Date();
  // Todas las cohortes nuevas empiezan como "Activa"
  const estadoInicial = 'Activa';

  const cohortes = ss.getSheetByName('Cohortes');
  const nuevaFila = obtenerPrimeraFilaVacia(cohortes, 'A');

  // Orden: Nombre, Proyecto, FechaInicio, FechaFin, Responsable, Cupo, Inscritas(formula), Graduadas(formula), Deserciones(formula), Ubicación, Horario, Notas, Estado
  const datosCohorte = [nombre, 'Alimentos y Bebidas', fechaInicio, fechaFin, responsable, cupo, '', '', '', '', '', '', estadoInicial];
  cohortes.getRange(nuevaFila, 1, 1, 13).setValues([datosCohorte]);

  // Fórmulas: Inscritas cuenta en la hoja individual de la cohorte (resta deserciones)
  cohortes.getRange('G' + nuevaFila).setFormula('=IF(A' + nuevaFila + '="",0,IFERROR(COUNTIF(INDIRECT("\'"&A' + nuevaFila + '&"\'!E:E"),"<>")-1-COUNTIF(INDIRECT("\'"&A' + nuevaFila + '&"\'!I:I"),"Deserción"),0))');
  cohortes.getRange('H' + nuevaFila).setFormula('=IFERROR(COUNTIF(Graduadas!G:G,A' + nuevaFila + '),0)');
  cohortes.getRange('I' + nuevaFila).setFormula('=IFERROR(COUNTIF(Deserciones!G:G,A' + nuevaFila + '),0)');

  // Crear hoja individual para la cohorte
  crearHojaIndividualCohorte(nombre);

  configurarValidaciones();

  ss.toast('✅ Cohorte "' + nombre + '" creada con su hoja individual', 'Nueva Cohorte', 5);
}

/**
 * Crea una hoja individual para una cohorte específica
 * Columnas: Fecha, No., Creamos ID, DPI, Nombre, Edad, Teléfono, Nivel Educativo, Estado
 */
function crearHojaIndividualCohorte(nombreCohorte) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Verificar si ya existe la hoja
  if (ss.getSheetByName(nombreCohorte)) {
    Logger.log('La hoja "' + nombreCohorte + '" ya existe');
    return;
  }

  const sheet = ss.insertSheet(nombreCohorte);

  const headers = [
    'Fecha Selección',  // A
    'No.',              // B
    'Creamos ID',       // C
    'DPI',              // D
    'Nombre Completo',  // E
    'Edad',             // F
    'Teléfono',         // G
    'Nivel Educativo',  // H
    'Estado'            // I - Solo opción "Deserción"
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#4caf50')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Anchos de columna
  [120, 50, 100, 130, 200, 60, 120, 150, 100].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });

  // Desplegable Estado con "Graduada" y "Deserción"
  sheet.getRange('I2:I100').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['Graduada', 'Deserción'])
      .setAllowInvalid(true)
      .build()
  );

  // Proteger columnas automáticas
  sheet.getRange('A2:A100').protect().setWarningOnly(true);
  sheet.getRange('B2:B100').protect().setWarningOnly(true);
}

function enviarParticipantesACohorte() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const cohortesSheet = ss.getSheetByName('Cohortes');
  const datosCohortes = cohortesSheet.getDataRange().getValues();

  const cohortesActivas = [];
  for (let i = 1; i < datosCohortes.length; i++) {
    // Estado está en columna M (índice 12)
    if (datosCohortes[i][12] === 'Activa') {
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
    if (datosSeleccionadas[i][1]) idsSeleccionados.add(datosSeleccionadas[i][1].toString().trim());
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
    const nuevaFila = obtenerPrimeraFilaVacia(seleccionadas, 'D');

    // Columnas: No, CreamosID, DPI, Nombre, Edad, Tel, NivelEdu, Zona, Notas, EnviarACohorte
    const registro = [
      nuevaFila - 1, p.creamosId,
      datosInteres ? datosInteres[3] : '', p.nombre,
      datosInteres ? datosInteres[5] : '', p.datos[4],
      datosInteres ? datosInteres[7] : '', datosInteres ? datosInteres[8] : '',
      p.datos[8] || '',
      ''                // Enviar a Cohorte (vacío)
    ];

    seleccionadas.getRange(nuevaFila, 1, 1, 10).setValues([registro]);
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
      const cupo = datos[i][5] || 0;
      const inscritas = datos[i][6] || 0;
      const graduadas = datos[i][7] || 0;
      const deserciones = datos[i][8] || 0;
      const disponibles = cupo - inscritas;
      mensaje += '━━━━━━━━━━━━━━━━━━\n';
      mensaje += '📚 ' + datos[i][0] + '\n';
      mensaje += '   Estado: ' + (datos[i][12] || 'N/A') + '\n';
      mensaje += '   Cupo: ' + inscritas + ' / ' + cupo + (disponibles <= 0 ? ' (LLENO)' : ' (' + disponibles + ' disponibles)') + '\n';
      mensaje += '   Graduadas: ' + graduadas + '\n';
      mensaje += '   Deserciones: ' + deserciones + '\n';
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
    MailApp.sendEmail(email, '✅ Prueba - Sistema Alimentos y Bebidas', 'Prueba exitosa.\nFecha: ' + new Date());
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
  ss.toast('🔧 Reparando fórmulas...', 'Reparando', 3);

  // Repara columna B (No.) con batch y columna A (Fecha) solo en celdas vacías
  function repararNumerosYFechas(sheet, maxFila) {
    if (!sheet) return;
    // Limitar a filas reales de la hoja para evitar error de coordenadas
    const limite = Math.min(maxFila, sheet.getMaxRows());
    if (limite < 2) return;
    // Columna B: siempre fórmula (batch)
    const fmB = [];
    for (let r = 2; r <= limite; r++) {
      fmB.push(['=IF(E' + r + '<>"",COUNTA($E$2:E' + r + '),"")']);
    }
    sheet.getRange(2, 2, limite - 1, 1).setFormulas(fmB);
    // Columna A: solo celdas vacías (preserva fechas reales de Kobo)
    const colA = sheet.getRange(2, 1, limite - 1, 1).getValues();
    colA.forEach((row, idx) => {
      if (row[0] === '' || row[0] === null) {
        const fila = idx + 2;
        sheet.getRange(fila, 1).setFormula('=IF(E' + fila + '<>"",TODAY(),"")');
      }
    });
  }

  // Hoja de Interés
  repararNumerosYFechas(ss.getSheetByName('Hoja de Interés'), 500);

  // Hojas individuales de cada cohorte
  const cohortes = ss.getSheetByName('Cohortes');
  if (cohortes) {
    // Fórmulas de conteo en hoja Cohortes
    const MAX_COH = 20;
    const fG = [], fH = [], fI = [];
    for (let i = 2; i <= MAX_COH; i++) {
      fG.push(['=IF(A' + i + '="",0,IFERROR(COUNTIF(INDIRECT("\'"&A' + i + '&"\'!E:E"),"<>")-1,0))']);
      fH.push(['=IFERROR(COUNTIF(Graduadas!G:G,A' + i + '),0)']);
      fI.push(['=IFERROR(COUNTIF(Deserciones!G:G,A' + i + '),0)']);
    }
    cohortes.getRange(2, 7, MAX_COH - 1, 1).setFormulas(fG);
    cohortes.getRange(2, 8, MAX_COH - 1, 1).setFormulas(fH);
    cohortes.getRange(2, 9, MAX_COH - 1, 1).setFormulas(fI);

    // Reparar hojas individuales de cohorte
    const datosCohortes = cohortes.getDataRange().getValues();
    for (let i = 1; i < datosCohortes.length; i++) {
      const nombreCohorte = datosCohortes[i][0] ? datosCohortes[i][0].toString().trim() : '';
      if (!nombreCohorte) continue;
      repararNumerosYFechas(ss.getSheetByName(nombreCohorte), 100);
    }
  }

  // Reparar también las fórmulas del Reporte
  repararFormulasReporte();

  ss.toast('✅ Fórmulas reparadas en todas las hojas', 'OK', 4);
}

// =====================================================================
// DATOS DE PRUEBA
// =====================================================================

function crearDatosPrueba() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const resp = SpreadsheetApp.getUi().alert('Crear Datos de Prueba', '¿Crear 3 registros de ejemplo?', SpreadsheetApp.getUi().ButtonSet.YES_NO);
  if (resp !== SpreadsheetApp.getUi().Button.YES) return;

  const interes = ss.getSheetByName('Hoja de Interés');
  // Orden: Fecha, No, CreamosID, DPI, Nombre, Edad, Teléfono, NivelEducativo, Zona, ComoSeEntero, ProgramaInteres, Responsable, Notas, Estado
  // Estado vacío para que usuario elija "Entrevista agendada" o "No interesado"
  const datosPrueba = [
    ['', '', 'CR001', '1234567890101', 'María García', '22', '5555-1234', 'Diversificado completo', 'Zona 1', 'Redes', 'Gastronomía', 'Adrian Torres', '', ''],
    ['', '', 'CR002', '2345678901212', 'Ana Martínez', '25', '5555-5678', 'Universitario', 'Zona 7', 'Referido', 'Barismo', 'Paola Ortiz', '', ''],
    ['', '', 'CR003', '3456789012323', 'Laura López', '19', '5555-9012', 'Básicos completos', 'Mixco', 'Facebook', 'Gastronomía', 'Adrian Torres', '', '']
  ];
  interes.getRange(2, 1, 3, 14).setValues(datosPrueba);
  ss.toast('✅ 3 registros creados', 'OK', 4);
}

function limpiarTodosLosDatos() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const resp = SpreadsheetApp.getUi().alert('⚠️ CONFIRMAR', '¿Eliminar TODOS los datos?', SpreadsheetApp.getUi().ButtonSet.YES_NO);
  if (resp !== SpreadsheetApp.getUi().Button.YES) return;

  const hojas = ['Hoja de Interés', 'Entrevistas', 'Seleccionadas', 'Graduadas', 'Deserciones', 'No Seleccionadas', 'Reportes Mensuales'];
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

// =====================================================================
// HOJA MAESTRA "COPY OF CREAMOS ID NUEVO"
// =====================================================================

const NOMBRE_HOJA_CREAMOS_ID = 'Copy of CREAMOS ID nuevo';

/**
 * Configura la hoja "Copy of CREAMOS ID nuevo":
 * - La crea si no existe (con los headers correctos)
 * - La oculta para usuarios regulares
 * - La protege contra edición y eliminación accidental
 * Llamar desde el menú o desde instalarSistema()
 */
function configurarHojaCreamosID() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  // Buscar o crear la hoja
  let hoja = ss.getSheetByName(NOMBRE_HOJA_CREAMOS_ID);
  if (!hoja) {
    hoja = ss.insertSheet(NOMBRE_HOJA_CREAMOS_ID);
    Logger.log('Hoja "' + NOMBRE_HOJA_CREAMOS_ID + '" creada.');

    // Establecer headers
    const headers = [
      'Nombre completo',
      'Creamos ID',
      'Año que entró Creamos',
      'Age',
      'Numero de DPI'
    ];
    hoja.getRange(1, 1, 1, headers.length).setValues([headers])
      .setBackground('#37474f')
      .setFontColor('white')
      .setFontWeight('bold')
      .setHorizontalAlignment('center');

    [200, 120, 120, 60, 150].forEach((w, i) => {
      hoja.setColumnWidth(i + 1, w);
    });
  }

  // Ocultar la hoja
  hoja.hideSheet();

  // Proteger la hoja completa (solo advertencia para editores, sin permitir borrar hoja)
  const protecciones = hoja.getProtections(SpreadsheetApp.ProtectionType.SHEET);
  // Eliminar protecciones anteriores para reinstalar limpiamente
  protecciones.forEach(p => p.remove());

  const proteccion = hoja.protect();
  proteccion.setDescription('Hoja maestra CREAMOS ID - conectada con Salesforce. NO ELIMINAR.');
  proteccion.setWarningOnly(true); // Advertencia al editar, no bloqueo total (para scripts)

  ss.toast('✅ Hoja "' + NOMBRE_HOJA_CREAMOS_ID + '" configurada: oculta y protegida', 'CREAMOS ID', 5);
  Logger.log('Hoja CREAMOS ID configurada correctamente.');
}

/**
 * Autocompleta información faltante en la Hoja de Interés usando la hoja maestra
 * "Copy of CREAMOS ID nuevo" como fuente de verdad.
 *
 * Rellena automáticamente los campos vacíos:
 * - Creamos ID (col C) → buscando por Nombre completo o DPI
 * - DPI (col D) → buscando por Creamos ID o Nombre completo
 * - Edad (col F) → calculada desde 'Age' en la hoja maestra, buscando por Creamos ID o DPI
 *
 * También actualiza el directorio maestro con datos nuevos que no estén en él.
 */
/**
 * silencioso=false → muestra ui.alert con el resumen (llamada manual desde menú)
 * silencioso=true  → solo hace Logger.log, sin alertas (llamada automática)
 */
function autocompletarDesdeCreamosID(silencioso) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = silencioso ? null : SpreadsheetApp.getUi();

  const hojaInteres = ss.getSheetByName('Hoja de Interés');
  const hojaDirectorio = ss.getSheetByName(NOMBRE_HOJA_CREAMOS_ID);

  if (!hojaDirectorio) {
    if (!silencioso) ui.alert('⚠️ Hoja no encontrada',
      'La hoja "' + NOMBRE_HOJA_CREAMOS_ID + '" no existe.\nEjecuta primero "Configurar Hoja CREAMOS ID" desde el menú.',
      ui.ButtonSet.OK);
    return;
  }

  if (!hojaInteres) {
    if (!silencioso) ui.alert('⚠️ Error', 'No se encontró la Hoja de Interés.', ui.ButtonSet.OK);
    return;
  }

  const datosInteres = hojaInteres.getDataRange().getValues();
  const datosDirectorio = hojaDirectorio.getDataRange().getValues();

  if (datosDirectorio.length < 2) {
    if (!silencioso) ui.alert('ℹ️ Directorio vacío',
      'La hoja "' + NOMBRE_HOJA_CREAMOS_ID + '" no tiene datos.\nImporta los datos desde Salesforce primero.',
      ui.ButtonSet.OK);
    return;
  }

  // Construir índices de búsqueda desde el directorio maestro
  // Directorio: col 0=Nombre, 1=CreamosID, 2=Año, 3=Age, 4=DPI
  const mapPorCreamosId = new Map();  // creamosId → fila directorio
  const mapPorDpi = new Map();        // dpi → fila directorio
  const mapPorNombre = new Map();     // nombre normalizado → fila directorio

  for (let i = 1; i < datosDirectorio.length; i++) {
    const fila = datosDirectorio[i];
    const nombre = fila[0] ? fila[0].toString().trim() : '';
    const creamosId = fila[1] ? fila[1].toString().trim() : '';
    const dpi = fila[4] ? fila[4].toString().trim() : '';

    if (creamosId) mapPorCreamosId.set(creamosId.toUpperCase(), fila);
    if (dpi) mapPorDpi.set(dpi, fila);
    if (nombre) mapPorNombre.set(nombre.toLowerCase(), fila);
  }

  let completados = 0;
  let sinCoincidencia = 0;

  // Hoja de Interés: A=FechaRegistro, B=No, C=CreamosID, D=DPI, E=NombreCompleto, F=Edad
  for (let i = 1; i < datosInteres.length; i++) {
    const fila = datosInteres[i];
    const creamosIdActual = fila[2] ? fila[2].toString().trim() : '';
    const dpiActual = fila[3] ? fila[3].toString().trim() : '';
    const nombreActual = fila[4] ? fila[4].toString().trim() : '';
    const edadActual = fila[5] ? fila[5].toString().trim() : '';

    // Fila vacía: no hay nombre ni Creamos ID ni DPI
    if (!nombreActual && !creamosIdActual && !dpiActual) continue;

    // Buscar en directorio por CreamosID → DPI → Nombre
    let filaDirectorio = null;
    if (creamosIdActual) {
      filaDirectorio = mapPorCreamosId.get(creamosIdActual.toUpperCase()) || null;
    }
    if (!filaDirectorio && dpiActual) {
      filaDirectorio = mapPorDpi.get(dpiActual) || null;
    }
    if (!filaDirectorio && nombreActual) {
      filaDirectorio = mapPorNombre.get(nombreActual.toLowerCase()) || null;
    }

    if (!filaDirectorio) {
      sinCoincidencia++;
      continue;
    }

    const nombreDirectorio = filaDirectorio[0] ? filaDirectorio[0].toString().trim() : '';
    const creamosIdDirectorio = filaDirectorio[1] ? filaDirectorio[1].toString().trim() : '';
    const ageDirectorio = filaDirectorio[3] ? filaDirectorio[3].toString().trim() : '';
    const dpiDirectorio = filaDirectorio[4] ? filaDirectorio[4].toString().trim() : '';

    let actualizado = false;
    const filaNum = i + 1;

    // Rellenar Nombre Completo si está vacío
    if (!nombreActual && nombreDirectorio) {
      hojaInteres.getRange(filaNum, 5).setValue(nombreDirectorio);
      actualizado = true;
    }

    // Rellenar Creamos ID si está vacío
    if (!creamosIdActual && creamosIdDirectorio) {
      hojaInteres.getRange(filaNum, 3).setValue(creamosIdDirectorio);
      actualizado = true;
    }

    // Rellenar DPI si está vacío
    if (!dpiActual && dpiDirectorio) {
      hojaInteres.getRange(filaNum, 4).setValue(dpiDirectorio);
      actualizado = true;
    }

    // Rellenar Edad si está vacía
    if (!edadActual && ageDirectorio) {
      hojaInteres.getRange(filaNum, 6).setValue(ageDirectorio);
      actualizado = true;
    }

    if (actualizado) completados++;
  }

  const mensaje = '✅ Autocompletado finalizado\n\n' +
    '📝 Registros actualizados: ' + completados + '\n' +
    '❓ Sin coincidencia en directorio: ' + sinCoincidencia;

  if (!silencioso) ui.alert('Autocompletar desde CREAMOS ID', mensaje, ui.ButtonSet.OK);
  Logger.log(mensaje);
}

/**
 * Actualiza datos faltantes desde el directorio CREAMOS ID en TODAS las hojas.
 * Solo rellena celdas vacías — no borra ni sobreescribe nada existente.
 * silencioso=true  → solo Logger.log (para llamadas automáticas)
 * silencioso=false → muestra resumen en pantalla (botón del menú)
 */
function actualizarTodosDesdeDirectorio(silencioso) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = silencioso ? null : SpreadsheetApp.getUi();

  const hojaDirectorio = ss.getSheetByName(NOMBRE_HOJA_CREAMOS_ID);
  if (!hojaDirectorio) {
    if (!silencioso) ui.alert('⚠️ Directorio no encontrado',
      'La hoja "' + NOMBRE_HOJA_CREAMOS_ID + '" no existe.',
      ui.ButtonSet.OK);
    return;
  }

  const datosDirectorio = hojaDirectorio.getDataRange().getValues();
  if (datosDirectorio.length < 2) {
    if (!silencioso) ui.alert('ℹ️ Directorio vacío',
      'Importa los datos desde Salesforce primero.',
      ui.ButtonSet.OK);
    return;
  }

  // Construir mapas de búsqueda: Directorio col 0=Nombre, 1=CreamosID, 2=Año, 3=Age, 4=DPI
  const mapPorCreamosId = new Map();
  const mapPorDpi = new Map();
  const mapPorNombre = new Map();

  for (let i = 1; i < datosDirectorio.length; i++) {
    const f = datosDirectorio[i];
    const nombre    = f[0] ? f[0].toString().trim() : '';
    const creamosId = f[1] ? f[1].toString().trim() : '';
    const dpi       = f[4] ? f[4].toString().trim() : '';
    if (creamosId) mapPorCreamosId.set(creamosId.toUpperCase(), f);
    if (dpi)       mapPorDpi.set(dpi, f);
    if (nombre)    mapPorNombre.set(nombre.toLowerCase(), f);
  }

  /**
   * Recorre una hoja y rellena celdas vacías desde el directorio.
   * colMap (números de columna 0-indexados):
   *   creamosId, dpi, nombre, edad  → -1 si esa columna no existe en la hoja
   */
  function completarHoja(sheet, colMap) {
    if (!sheet) return 0;
    const datos = sheet.getDataRange().getValues();
    let actualizados = 0;

    for (let i = 1; i < datos.length; i++) {
      const fila = datos[i];

      const cId = colMap.creamosId >= 0 ? (fila[colMap.creamosId] || '').toString().trim() : '';
      const dpi = colMap.dpi      >= 0 ? (fila[colMap.dpi]      || '').toString().trim() : '';
      const nom = colMap.nombre   >= 0 ? (fila[colMap.nombre]   || '').toString().trim() : '';
      const ed  = colMap.edad     >= 0 ? (fila[colMap.edad]     || '').toString().trim() : '';

      // Fila completamente vacía → saltar
      if (!cId && !dpi && !nom) continue;

      // Buscar en directorio: CreamosID → DPI → Nombre
      let filaDir = null;
      if (cId) filaDir = mapPorCreamosId.get(cId.toUpperCase()) || null;
      if (!filaDir && dpi) filaDir = mapPorDpi.get(dpi) || null;
      if (!filaDir && nom) filaDir = mapPorNombre.get(nom.toLowerCase()) || null;
      if (!filaDir) continue;

      const nombreDir  = filaDir[0] ? filaDir[0].toString().trim() : '';
      const cIdDir     = filaDir[1] ? filaDir[1].toString().trim() : '';
      const edadDir    = filaDir[3] ? filaDir[3].toString().trim() : '';
      const dpiDir     = filaDir[4] ? filaDir[4].toString().trim() : '';

      const filaNum = i + 1;
      let actualizado = false;

      if (colMap.nombre    >= 0 && !nom && nombreDir) { sheet.getRange(filaNum, colMap.nombre    + 1).setValue(nombreDir); actualizado = true; }
      if (colMap.creamosId >= 0 && !cId && cIdDir)   { sheet.getRange(filaNum, colMap.creamosId + 1).setValue(cIdDir);    actualizado = true; }
      if (colMap.dpi       >= 0 && !dpi && dpiDir)   { sheet.getRange(filaNum, colMap.dpi       + 1).setValue(dpiDir);    actualizado = true; }
      if (colMap.edad      >= 0 && !ed  && edadDir)  { sheet.getRange(filaNum, colMap.edad      + 1).setValue(edadDir);   actualizado = true; }

      if (actualizado) actualizados++;
    }
    return actualizados;
  }

  let total = 0;

  // Hoja de Interés: C[2]=CreamosID, D[3]=DPI, E[4]=Nombre, F[5]=Edad
  ss.toast('🔄 Actualizando Hoja de Interés...', 'Actualizando', 4);
  total += completarHoja(ss.getSheetByName('Hoja de Interés'),
    { creamosId: 2, dpi: 3, nombre: 4, edad: 5 });

  // Entrevistas: C[2]=CreamosID, D[3]=Nombre (sin DPI ni Edad en esa hoja)
  ss.toast('🔄 Actualizando Entrevistas...', 'Actualizando', 4);
  total += completarHoja(ss.getSheetByName('Entrevistas'),
    { creamosId: 2, dpi: -1, nombre: 3, edad: -1 });

  // Seleccionadas: B[1]=CreamosID, C[2]=DPI, D[3]=Nombre, E[4]=Edad
  ss.toast('🔄 Actualizando Seleccionadas...', 'Actualizando', 4);
  total += completarHoja(ss.getSheetByName('Seleccionadas'),
    { creamosId: 1, dpi: 2, nombre: 3, edad: 4 });

  // No Seleccionadas: B[1]=CreamosID, C[2]=Nombre (sin DPI ni Edad)
  ss.toast('🔄 Actualizando No Seleccionadas...', 'Actualizando', 4);
  total += completarHoja(ss.getSheetByName('No Seleccionadas'),
    { creamosId: 1, dpi: -1, nombre: 2, edad: -1 });

  // Hojas individuales de cada cohorte: C[2]=CreamosID, D[3]=DPI, E[4]=Nombre, F[5]=Edad
  const cohortesSheet = ss.getSheetByName('Cohortes');
  if (cohortesSheet) {
    const datosCohortes = cohortesSheet.getDataRange().getValues();
    for (let i = 1; i < datosCohortes.length; i++) {
      const nombreCohorte = datosCohortes[i][0] ? datosCohortes[i][0].toString().trim() : '';
      if (!nombreCohorte) continue;
      const hojaCohorte = ss.getSheetByName(nombreCohorte);
      if (!hojaCohorte) continue;
      ss.toast('🔄 Actualizando cohorte "' + nombreCohorte + '"...', 'Actualizando', 4);
      total += completarHoja(hojaCohorte, { creamosId: 2, dpi: 3, nombre: 4, edad: 5 });
    }
  }

  const mensaje = '✅ Actualización completa\n\n' +
    '📝 Celdas rellenadas: ' + total + '\n\n' +
    '(Solo se rellenaron celdas vacías, no se borró nada)';
  if (!silencioso) ui.alert('Actualizar Todo desde CREAMOS ID', mensaje, ui.ButtonSet.OK);
  Logger.log(mensaje);
}

/**
 * Asegura que la hoja CREAMOS ID esté oculta y protegida al abrir el archivo.
 * Se llama desde mantenimientoAutomatico().
 */
// =====================================================================
// EMAIL EVA — NOTIFICACIONES DESERCIÓN Y GRADUACIÓN
// =====================================================================

function obtenerEmailEva() {
  const props = PropertiesService.getDocumentProperties();
  return props.getProperty('EMAIL_EVA') || obtenerEmailConfiguracion();
}

function configurarEmailEva() {
  const ui = SpreadsheetApp.getUi();
  const emailActual = obtenerEmailEva();
  const respuesta = ui.prompt(
    '📧 Email de Eva',
    'Email actual: ' + emailActual + '\n\nNuevo email de Eva para alertas de deserción y graduación:',
    ui.ButtonSet.OK_CANCEL
  );
  if (respuesta.getSelectedButton() === ui.Button.OK) {
    const nuevoEmail = respuesta.getResponseText().trim();
    if (nuevoEmail && nuevoEmail.includes('@')) {
      PropertiesService.getDocumentProperties().setProperty('EMAIL_EVA', nuevoEmail);
      SpreadsheetApp.getActiveSpreadsheet().toast('✅ Email de Eva configurado: ' + nuevoEmail, 'OK', 4);
    } else {
      SpreadsheetApp.getActiveSpreadsheet().toast('❌ Email inválido. Ingresa un email válido.', 'Error', 4);
    }
  }
}

function enviarEmailDesercionEva(nombre, cohorte, motivo, creamosId) {
  try {
    const emailEva   = obtenerEmailEva();
    const emailNotif = obtenerEmailConfiguracion();
    const fecha = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');

    const asunto = '⚠️ Deserción — ' + nombre + ' — Actualizar Salesforce';
    const cuerpo =
      'Hola Eva,\n\n' +
      'Se registró la siguiente DESERCIÓN en el Sistema de Inclusión Laboral:\n\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
      'Nombre:      ' + nombre + '\n' +
      (creamosId ? 'Creamos ID:  ' + creamosId + '\n' : '') +
      'Cohorte:     ' + cohorte + '\n' +
      'Motivo:      ' + motivo + '\n' +
      'Fecha:       ' + fecha + '\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
      '⚠️ ACCIÓN REQUERIDA EN SALESFORCE:\n' +
      'Por favor, cambia la etapa de esta participante a "Deserción"\n' +
      'para mantener el CRM actualizado.\n\n' +
      'Mensaje automático — Sistema de Inclusión Laboral Alimentos y Bebidas';

    const destinatarios = [emailEva];
    if (emailNotif && emailNotif !== emailEva) destinatarios.push(emailNotif);
    MailApp.sendEmail(destinatarios.join(','), asunto, cuerpo);
    Logger.log('✅ Email deserción enviado a: ' + destinatarios.join(', '));
  } catch (e) {
    Logger.log('Error email deserción Eva: ' + e.message);
  }
}

function enviarEmailListaGraduadas(nombreCohorte, listaGraduadas) {
  try {
    if (!listaGraduadas || listaGraduadas.length === 0) return;
    const emailEva   = obtenerEmailEva();
    const emailNotif = obtenerEmailConfiguracion();
    const fecha = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');

    const asunto = '🎓 Graduación completada — ' + nombreCohorte + ' (' + listaGraduadas.length + ' participantes)';

    let listaTexto = '';
    listaGraduadas.forEach(function(p, idx) {
      listaTexto += (idx + 1) + '. ' + p.nombre;
      if (p.creamosId) listaTexto += '   |   Creamos ID: ' + p.creamosId;
      listaTexto += '\n';
    });

    const cuerpo =
      'Hola Eva,\n\n' +
      'La cohorte "' + nombreCohorte + '" ha sido graduada exitosamente.\n\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
      'Fecha:            ' + fecha + '\n' +
      'Cohorte:          ' + nombreCohorte + '\n' +
      'Total graduadas:  ' + listaGraduadas.length + ' participantes\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
      'LISTA DE GRADUADAS:\n\n' +
      listaTexto +
      '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
      '⚠️ ACCIÓN REQUERIDA EN SALESFORCE:\n' +
      'Por favor, actualiza la etapa de TODAS las participantes listadas a "Graduada"\n' +
      'para mantener el CRM al día.\n\n' +
      'Mensaje automático — Sistema de Inclusión Laboral Alimentos y Bebidas';

    const destinatarios = [emailEva];
    if (emailNotif && emailNotif !== emailEva) destinatarios.push(emailNotif);
    MailApp.sendEmail(destinatarios.join(','), asunto, cuerpo);
    SpreadsheetApp.getActiveSpreadsheet().toast(
      '📧 Email con ' + listaGraduadas.length + ' graduadas enviado a Eva', 'Email', 5);
    Logger.log('✅ Email graduación enviado a: ' + destinatarios.join(', '));
  } catch (e) {
    Logger.log('Error email graduación: ' + e.message);
    SpreadsheetApp.getActiveSpreadsheet().toast('⚠️ No se pudo enviar email de graduación: ' + e.message, 'Email', 4);
  }
}

// =====================================================================
// REPARAR FÓRMULAS DEL REPORTE
// =====================================================================

function repararFormulasReporte() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const reporte = ss.getSheetByName('Reporte');
  if (!reporte) return;

  // B28: Participantes activas en cohortes (antes era =B11, que solo mostraba Seleccionadas)
  reporte.getRange('B28').setFormula(
    '=IFERROR(SUMIF(Cohortes!A:A,"<>",Cohortes!G:G)' +
    '-SUMIF(Cohortes!A:A,"<>",Cohortes!H:H)' +
    '-SUMIF(Cohortes!A:A,"<>",Cohortes!I:I),0)'
  );

  // B26: Total personas atendidas (incluye todas las etapas activas + históricas)
  reporte.getRange('B26').setFormula('=B5+B8+B11+B28+B17+B20+B23');

  // C8: Entrevistas pendientes (solo filas con nombre Y sin resultado)
  reporte.getRange('C8').setFormula('=IFERROR(COUNTIFS(Entrevistas!D:D,"<>",Entrevistas!I:I,""),0)');

  Logger.log('✅ Fórmulas del Reporte reparadas');
}

// =====================================================================
// INSTALAR TODO — BOTÓN MAESTRO DE INSTALACIÓN COMPLETA
// =====================================================================

function instalarTodo() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const confirmacion = ui.alert(
    '🚀 Instalación Completa del Sistema',
    'Esta función configurará TODO el sistema:\n\n' +
    '✓ Crear todas las hojas necesarias\n' +
    '✓ Configurar validaciones y formatos\n' +
    '✓ Instalar fórmulas en todas las hojas\n' +
    '✓ Instalar triggers automáticos\n' +
    '✓ Importar datos de ambos Kobos\n' +
    '✓ Actualizar Hoja de Interés (históricos + nuevos)\n' +
    '✓ Reparar fórmulas del Reporte\n' +
    '✓ Crear/actualizar Guía de Uso\n\n' +
    '⚠️ NO se borrará "Copy of CREAMOS ID nuevo"\n' +
    '⚠️ NO se borrarán datos existentes\n\n' +
    '¿Deseas continuar?',
    ui.ButtonSet.YES_NO
  );

  if (confirmacion !== ui.Button.YES) return;

  const cambios = [];

  try {
    ss.toast('📋 Verificando hojas del sistema...', 'Instalando', 5);
    crearTodasLasHojas();
    cambios.push('✅ Hojas del sistema verificadas');

    if (!ss.getSheetByName('Lista Definitiva')) {
      crearHojaListaDefinitiva();
      cambios.push('✅ Hoja Lista Definitiva creada');
    }

    ss.toast('📖 Creando Guía de Uso...', 'Instalando', 5);
    crearHojaGuiaUso();
    cambios.push('✅ Guía de Uso creada/actualizada');

    ss.toast('✅ Configurando validaciones...', 'Instalando', 5);
    configurarValidaciones();
    cambios.push('✅ Validaciones configuradas');

    ss.toast('🎨 Aplicando formatos...', 'Instalando', 5);
    aplicarFormatos();
    cambios.push('✅ Formatos aplicados');

    ss.toast('🔧 Instalando fórmulas...', 'Instalando', 5);
    repararFormulas();
    cambios.push('✅ Fórmulas instaladas y reparadas');

    const hojasPrincipales = ['Hoja de Interés', 'Entrevistas', 'Seleccionadas', 'Cohortes',
      'Graduadas', 'Deserciones', 'No Seleccionadas', 'Reporte',
      'Reportes Mensuales', 'Lista Definitiva', 'Detalle Entrevistas', 'Guía de Uso'];
    let cohortesFormateadas = 0;
    ss.getSheets().forEach(function(s) {
      const nombre = s.getName();
      if (!hojasPrincipales.includes(nombre) &&
          !nombre.startsWith('Copy of') &&
          !nombre.includes('Auto Refresh') &&
          s.getLastRow() > 1) {
        try { aplicarFormatoCohorte(s); cohortesFormateadas++; } catch (e) {}
      }
    });
    if (cohortesFormateadas > 0) {
      cambios.push('✅ Formato aplicado a ' + cohortesFormateadas + ' cohorte(s)');
    }

    const eliminadas = limpiarCohortesEliminadas(true);
    if (eliminadas > 0) cambios.push('✅ ' + eliminadas + ' cohorte(s) huérfanas limpiadas');

    ss.toast('⏰ Instalando triggers automáticos...', 'Instalando', 5);
    instalarTriggers();
    cambios.push('✅ Triggers automáticos instalados');

    ss.toast('📥 Importando Hoja de Interés desde Kobo...', 'Instalando', 8);
    try {
      importarDesdeKobo();
      cambios.push('✅ Hoja de Interés importada desde Kobo');
    } catch (e) {
      cambios.push('⚠️ Kobo Registros: ' + e.message);
    }

    ss.toast('📥 Importando Entrevistas desde Kobo...', 'Instalando', 8);
    try {
      importarEntrevistasDesdeKobo();
      cambios.push('✅ Entrevistas importadas desde Kobo');
    } catch (e) {
      cambios.push('⚠️ Kobo Entrevistas: ' + e.message);
    }

    // Actualizar Hoja de Interés desde Nuevo Kobo (históricos + nuevos)
    ss.toast('🔄 Actualizando Hoja de Interés desde Nuevo Kobo...', 'Instalando', 8);
    try {
      actualizarHojaInteresDesdeNuevoKobo();
      cambios.push('✅ Hoja de Interés actualizada desde Nuevo Kobo');
    } catch (e) {
      cambios.push('⚠️ Nuevo Kobo Interés: ' + e.message);
    }

    actualizarReportes();
    cambios.push('✅ Reporte actualizado');

    ss.toast(
      '🚀 INSTALACIÓN COMPLETA\n\n' +
      cambios.join('\n') +
      '\n\n🎯 El sistema está listo para usar.',
      'LISTO', 15
    );

    Logger.log('✅ instalarTodo completado: ' + cambios.join(' | '));

  } catch (error) {
    ss.toast('❌ Error en instalación: ' + error.message, 'ERROR', 10);
    Logger.log('❌ Error en instalarTodo: ' + error.message);
  }
}

function verGuiaUso() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let guia = ss.getSheetByName('Guía de Uso');
  if (!guia) {
    crearHojaGuiaUso();
    guia = ss.getSheetByName('Guía de Uso');
  }
  if (guia) ss.setActiveSheet(guia);
}

// =====================================================================
// GUÍA DE USO — HOJA DE DOCUMENTACIÓN
// =====================================================================

function crearHojaGuiaUso() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const existente = ss.getSheetByName('Guía de Uso');
  if (existente) ss.deleteSheet(existente);
  const sheet = ss.insertSheet('Guía de Uso');

  const AZUL_OSCURO  = '#1565c0';
  const AZUL_MEDIO   = '#1976d2';
  const AZUL_CLARO   = '#e3f2fd';
  const VERDE_CLARO  = '#e8f5e9';
  const AMARILLO     = '#fff9c4';
  const BLANCO       = '#ffffff';

  const filas = [
    ['GUÍA DE USO — SISTEMA DE INCLUSIÓN LABORAL ALIMENTOS Y BEBIDAS', '', ''],
    ['Versión 4  ·  Actualizada: ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy'), '', ''],
    ['', '', ''],
    ['1. ¿QUÉ ES ESTE SISTEMA?', '', ''],
    ['Este sistema de Google Sheets gestiona todo el ciclo de vida de las participantes del programa de Inclusión Laboral – Alimentos y Bebidas de CREAMOS.', '', ''],
    ['Desde que una persona se registra en KoboToolbox hasta que se gradúa, el sistema lleva el control de cada etapa y automatiza las notificaciones.', '', ''],
    ['', '', ''],
    ['2. FLUJO DE TRABAJO (paso a paso)', '', ''],
    ['①', 'La persona completa el formulario de registro en KoboToolbox'],
    ['②', 'Usar menú: 📋 Importar Hoja de Interés (Kobo) → Los datos llegan a la hoja "Hoja de Interés"'],
    ['③', 'En "Hoja de Interés": cambiar columna Estado a "Entrevista Programada" → pasa automáticamente a "Entrevistas"'],
    ['④', 'En "Entrevistas": después de la entrevista, cambiar columna Resultado (col. I):'],
    ['  →', '"Aprobada"  →  pasa a hoja "Seleccionadas" automáticamente'],
    ['  →', '"No aprobada" / "No asistió"  →  pasa a "No Seleccionadas" automáticamente'],
    ['⑤', 'En "Seleccionadas": usar menú Cohortes → Enviar Participantes a Cohorte'],
    ['⑥', 'En la hoja de la cohorte: cambiar columna Estado (col. I):'],
    ['  →', '"Graduada"  →  pasa a "Graduadas" + se envía email automático a Eva con lista'],
    ['  →', '"Deserción"  →  pasa a "Deserciones" + se envía email automático a Eva con alerta Salesforce'],
    ['', '', ''],
    ['3. DESCRIPCIÓN DE CADA HOJA', '', ''],
    ['HOJA', 'QUÉ CONTIENE / PARA QUÉ SIRVE'],
    ['Hoja de Interés',          'Personas que se registraron y aún no han tenido entrevista. Primera etapa del flujo.'],
    ['Entrevistas',              'Personas con entrevista programada, pendientes de resultado. Segunda etapa.'],
    ['Seleccionadas',            'Personas aprobadas en entrevista, esperando ser asignadas a una cohorte. Tercera etapa.'],
    ['Cohortes',                 'Tabla resumen de todas las cohortes: nombre, programa, fechas, estadísticas automáticas.'],
    ['[Nombre de Cohorte]',      'Hoja individual por cohorte con la lista de participantes activas. Se crea al crear la cohorte.'],
    ['Graduadas',                'Registro histórico de todas las personas que completaron el programa.'],
    ['Deserciones',              'Registro de personas que abandonaron con fecha, cohorte y motivo.'],
    ['No Seleccionadas',         'Personas que no pasaron la entrevista o no fueron seleccionadas.'],
    ['Lista Definitiva',         'Vista consolidada de todos los registros activos en el sistema.'],
    ['Reporte',                  'Estadísticas generales del programa: totales por etapa, tasa de éxito, etc.'],
    ['Reportes Mensuales',       'Histórico de reportes guardados mes a mes.'],
    ['Detalle Entrevistas',      'Respuestas completas del formulario de entrevistas desde Kobo.'],
    ['Guía de Uso',              'Esta hoja — instrucciones y documentación del sistema.'],
    ['Copy of CREAMOS ID nuevo', '⚠️ Hoja de Salesforce — sincronización automática. NO EDITAR NI BORRAR.'],
    ['Auto Refresh Execution Log','⚠️ Registro automático de sincronizaciones de Salesforce. NO BORRAR.'],
    ['', '', ''],
    ['4. OPCIONES DEL MENÚ  🎓 Inclusión Laboral', '', ''],
    ['OPCIÓN DE MENÚ', 'QUÉ HACE'],
    ['📋 Importar Hoja de Interés (Kobo)',    'Trae nuevos registros desde el formulario de registro de KoboToolbox. No duplica.'],
    ['🔁 Actualizar desde CREAMOS ID',        'Rellena automáticamente los Creamos IDs consultando la hoja maestra de Salesforce.'],
    ['📊 Actualizar Reportes',                'Recalcula todos los números del Reporte.'],
    ['💾 Guardar Reporte Mensual',            'Guarda una copia del reporte actual con fecha en "Reportes Mensuales".'],
    ['➕ Crear Nueva Cohorte',               'Crea una nueva hoja de cohorte y la registra en la tabla Cohortes.'],
    ['📝 Ver/Editar Cohortes',               'Muestra el resumen de todas las cohortes.'],
    ['📊 Estadísticas por Cohorte',          'Estadísticas detalladas + opción para graduar toda la cohorte.'],
    ['👥 Enviar Participantes a Cohorte',    'Mueve personas de "Seleccionadas" a la cohorte que elijas.'],
    ['🚀 INSTALAR TODO (Completo)',          'Configura TODO el sistema de una sola vez: hojas, fórmulas, triggers, Kobo, guía.'],
    ['🆕 Actualizar v4',                    'Actualiza validaciones, fórmulas y formatos SIN borrar datos.'],
    ['🔧 Reparar Fórmulas',                 'Repara fórmulas de numeración, cohortes y el Reporte.'],
    ['🔗 URL Registros Kobo',               'Cambia la URL del formulario de registro en KoboToolbox.'],
    ['🔗 URL Entrevistas Kobo',             'Cambia la URL del formulario de entrevistas en KoboToolbox.'],
    ['📧 Configurar Email General',         'Cambia el email para notificaciones generales del sistema.'],
    ['📧 Configurar Email Eva',             'Configura el email específico de Eva para alertas de deserción y graduación.'],
    ['✉️ Probar Email',                     'Envía un email de prueba para verificar que el correo funcione.'],
    ['⏰ Instalar Triggers',               'Instala las automatizaciones que actualizan el sistema cada hora.'],
    ['📖 Ver Guía de Uso',                 'Navega directamente a esta hoja.'],
    ['', '', ''],
    ['5. ACCIONES EN HOJAS DE COHORTE', '', ''],
    ['Cada hoja de cohorte tiene una columna "Estado" (columna I). Al cambiar ese valor el sistema actúa automáticamente:', '', ''],
    ['ESTADO QUE SE ESCRIBE', 'QUÉ OCURRE AUTOMÁTICAMENTE'],
    ['Graduada',     'La participante se mueve a la hoja "Graduadas" + la fila queda verde en la cohorte'],
    ['Deserción',    'El sistema pide el motivo + la participante pasa a "Deserciones" + se envía email a Eva'],
    ['Para graduar TODA la cohorte de una vez:', 'Menú → Cohortes → Estadísticas por Cohorte → botón "Graduar toda la cohorte"', ''],
    ['', '', ''],
    ['6. CORREOS AUTOMÁTICOS', '', ''],
    ['CUÁNDO', 'A QUIÉN', 'CONTENIDO'],
    ['Al registrar una deserción',          'Eva + Email general',  'Nombre, cohorte, motivo + recordatorio de actualizar Salesforce'],
    ['Al graduar toda la cohorte',          'Eva + Email general',  'Lista completa de graduadas con Creamos IDs + recordatorio Salesforce'],
    ['Para configurar los emails:',         'Menú → ⚙️ Configuración → 📧 Configurar Email Eva', ''],
    ['', '', ''],
    ['7. HOJAS DE SALESFORCE — NO TOCAR', '', ''],
    ['"Copy of CREAMOS ID nuevo"',          'Reporte de Salesforce sincronizado automáticamente. El sistema usa esta hoja para rellenar Creamos IDs.'],
    ['"Auto Refresh Execution Log"',        'Registro de cuándo se sincronizó. Es normal que aparezca. NO borrar ni editar.'],
    ['⚠️ NUNCA borres estas hojas.',        'El sistema depende de ellas para los Creamos IDs y la integración con Salesforce.'],
    ['', '', ''],
    ['8. PREGUNTAS FRECUENTES', '', ''],
    ['PREGUNTA', 'RESPUESTA'],
    ['¿Por qué "Entrevistas realizadas" muestra 0?',
     '"Entrevistas" solo muestra pendientes. Al procesarlas se mueven a la siguiente etapa. Es correcto.'],
    ['¿Cómo actualizo los datos de Kobo?',
     'Menú → 📋 Importar Hoja de Interés (Kobo). Solo trae nuevos registros, no duplica.'],
    ['¿Puedo borrar filas manualmente?',
     'NO recomendado. Usa los botones del menú. Borrar manualmente omite emails y registros.'],
    ['¿Qué significa la celda naranja en Creamos ID?',
     'La participante no tiene Creamos ID. Asígnalo en Salesforce y usa "Actualizar desde CREAMOS ID".'],
    ['¿Cada cuánto se actualiza automáticamente?',
     'Cada hora por triggers. También al abrir el archivo. Puedes forzarlo con "Actualizar Reportes".'],
    ['¿El email no llega?',
     'Verifica con Menú → ✉️ Probar Email. Revisa la configuración con 📧 Configurar Email Eva.'],
    ['', '', '']
  ];

  const maxCols = 3;
  const numFilas = filas.length;
  const data = filas.map(function(f) {
    while (f.length < maxCols) f.push('');
    return f.slice(0, maxCols);
  });
  sheet.getRange(1, 1, numFilas, maxCols).setValues(data);

  function seccion(fila) {
    sheet.getRange('A' + fila + ':C' + fila)
      .merge().setBackground(AZUL_OSCURO).setFontColor('white')
      .setFontWeight('bold').setFontSize(12);
    sheet.setRowHeight(fila, 30);
  }
  function tablaHeader(fila) {
    sheet.getRange('A' + fila + ':C' + fila)
      .setBackground(AZUL_MEDIO).setFontColor('white').setFontWeight('bold');
  }

  sheet.getRange('A1:C1').merge().setBackground(AZUL_OSCURO).setFontColor('white')
    .setFontSize(16).setFontWeight('bold').setHorizontalAlignment('center');
  sheet.setRowHeight(1, 48);
  sheet.getRange('A2:C2').merge().setBackground(AZUL_CLARO).setFontColor('#1a237e')
    .setFontSize(10).setHorizontalAlignment('center');

  seccion(4); seccion(8); seccion(19); seccion(37); seccion(57); seccion(64); seccion(71); seccion(76);
  tablaHeader(20); tablaHeader(38); tablaHeader(60); tablaHeader(67); tablaHeader(78);

  for (var r = 21; r <= 35; r++) {
    sheet.getRange('A' + r + ':C' + r).setBackground(r % 2 === 0 ? AZUL_CLARO : BLANCO);
  }
  sheet.getRange('A34:C34').setBackground('#fff3e0');
  sheet.getRange('A35:C35').setBackground('#fff3e0');
  for (var rm = 39; rm <= 55; rm++) {
    sheet.getRange('A' + rm + ':C' + rm).setBackground(rm % 2 === 0 ? AZUL_CLARO : BLANCO);
  }
  sheet.getRange('A68:C68').setBackground(VERDE_CLARO);
  sheet.getRange('A69:C69').setBackground(VERDE_CLARO);
  sheet.getRange('A72:C72').setBackground('#fff3e0');
  sheet.getRange('A73:C73').setBackground('#fff3e0');
  sheet.getRange('A74:C74').setBackground('#ffccbc').setFontWeight('bold');
  for (var rf = 79; rf <= 85; rf++) {
    sheet.getRange('A' + rf + ':C' + rf).setBackground(rf % 2 === 0 ? AMARILLO : BLANCO);
  }
  for (var rp = 9; rp <= 17; rp++) {
    sheet.getRange('A' + rp + ':C' + rp).setBackground(VERDE_CLARO);
    sheet.getRange('A' + rp).setFontWeight('bold');
  }

  sheet.setColumnWidth(1, 280);
  sheet.setColumnWidth(2, 400);
  sheet.setColumnWidth(3, 200);
  sheet.getRange(1, 1, numFilas, maxCols).setWrap(true);
  sheet.getRange(1, 1, numFilas, maxCols)
    .setBorder(true, true, true, true, true, true, '#bbdefb', SpreadsheetApp.BorderStyle.SOLID);
  sheet.setFrozenRows(1);
  Logger.log('✅ Guía de Uso (A&B) creada');
}

function protegerHojaCreamosIDSiExiste() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const hoja = ss.getSheetByName(NOMBRE_HOJA_CREAMOS_ID);
    if (!hoja) return;

    // Ocultar si está visible
    if (!hoja.isSheetHidden()) {
      hoja.hideSheet();
    }

    // Asegurar protección
    const protecciones = hoja.getProtections(SpreadsheetApp.ProtectionType.SHEET);
    if (protecciones.length === 0) {
      const p = hoja.protect();
      p.setDescription('Hoja maestra CREAMOS ID - conectada con Salesforce. NO ELIMINAR.');
      p.setWarningOnly(true);
    }
  } catch (e) {
    Logger.log('protegerHojaCreamosIDSiExiste: ' + e.message);
  }
}
