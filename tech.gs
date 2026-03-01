/**
 * =====================================================================
 * SISTEMA DE INCLUSIÓN LABORAL - ÁREA DE TECNOLOGÍA
 * =====================================================================
 *
 * FLUJO SIMPLIFICADO:
 * 1. Hoja de Interés: Estado → "Entrevista agendada" o "No interesado"
 * 2. Entrevistas: Final → "Aprobada" (→ Inscritx) / "No aprobada" (→ No Inscritx)
 * 3. Inscritx: "Enviar a Cohorte" → envía a la hoja individual
 * 4. Cohortes: Estado "Finalizada" → pregunta si graduar a todas
 * 5. Hojas individuales: Estado "Graduada" o "Deserción"
 *
 * HOJAS:
 * - Hoja de Interés, Entrevistas, Inscritx, Cohortes
 * - Graduadx, Retiradx, No Inscritx, Reporte, Reportes Mensuales
 * - [Hojas individuales por cohorte]
 *
 * =====================================================================
 */

// =====================================================================
// CONFIGURACIÓN GLOBAL
// =====================================================================

const CONFIG = {
  // URL de KoboToolbox para importar Hoja de Interés (formulario principal)
  KOBO_URL: 'https://kf.kobotoolbox.org/api/v2/assets/auvEELWQEgiwF54W4pGpV5/export-settings/eseYzEgWw6Tui9y2eppZy3L/data.csv',

  // URL de KoboToolbox para importar datos de ENTREVISTAS (IL_01_Entrevista)
  KOBO_ENTREVISTAS_URL: 'https://kf.kobotoolbox.org/api/v2/assets/aF4nMQPqbHokM7rg2Vtf5w/export-settings/esqKoJjmoR34panMLhM8j3Z/data.csv',

  // Cohortes disponibles (se llenan dinámicamente desde la hoja Cohortes)
  COHORTES: [],

  // Programas de Tecnología (para Hoja de Interés - viene de Kobo)
  PROGRAMAS_TECNOLOGIA: [
    'Marketing Digital',
    'Programación',
    'Alfabetización Digital',
    'Certificación Microsoft',
    'Servicio al Cliente'
  ],

  // Responsables del programa
  RESPONSABLES: [
    'Eva',
    'Adrian Torres',
    'Paola Ortiz'
  ],

  // Opciones de Género (valores válidos del formulario Kobo)
  GENEROS: [
    'Mujer / Femenino',
    'Hombre / Masculino',
    'Trans Mujer',
    'Trans Hombre',
    'No Binarie / Género Queer / Género No Conforme',
    'Agénero',
    'Prefiero autodescribirme',
    'No quiere contestar'
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
    // ========== ACCIONES PRINCIPALES ==========
    .addItem('📥 Importar Datos Históricos (una vez)', 'importarDatosHistoricos')
    .addItem('📥 Importar Datos Nuevos (cada 10 min)', 'importarDesdeKobo')
    .addItem('🔁 Actualizar desde CREAMOS ID', 'actualizarTodosDesdeDirectorio')
    .addSeparator()

    // ========== REPORTES Y EXPORTACIÓN ==========
    .addSubMenu(ui.createMenu('📊 Reportes y Exportación')
      .addItem('📊 Actualizar Reportes', 'actualizarReportes')
      .addItem('💾 Guardar Reporte Mensual', 'guardarReporteMensual'))

    // ========== COHORTES ==========
    .addSubMenu(ui.createMenu('📋 Cohortes')
      .addItem('➕ Crear Nueva Cohorte', 'crearNuevaCohorte')
      .addItem('📝 Ver/Editar Cohortes', 'verCohortes')
      .addItem('👥 Enviar Participantes a Cohorte', 'enviarParticipantesACohorte')
      .addSeparator()
      .addItem('📊 Estadísticas por Cohorte', 'estadisticasCohorte')
      .addItem('🔄 Reenviar Graduadx al Seguimiento', 'reenviarDesdeMenuCohorte'))
    .addSeparator()

    // ========== CONFIGURACIÓN ==========
    .addSubMenu(ui.createMenu('⚙️ Configuración')
      .addItem('🔗 URL Registros Kobo', 'configurarKoboURL')
      .addItem('🔗 URL Entrevistas Kobo', 'configurarKoboEntrevistasURL')
      .addItem('📝 Importar Entrevistas (Detalle)', 'importarEntrevistasDesdeKobo')
      .addSeparator()
      .addItem('📧 Configurar Email General', 'configurarEmail')
      .addItem('📧 Configurar Email Eva', 'configurarEmailEva')
      .addSeparator()
      .addItem('🔄 Importación Automática', 'configurarImportacionAutomatica')
      .addItem('⏰ Instalar Triggers', 'instalarTriggers')
      .addItem('🔒 Configurar CREAMOS ID', 'configurarHojaCreamosID')
      .addSeparator()
      .addItem('⚙️ Instalar Sistema (solo hojas)', 'instalarSistema'))

    // ========== HERRAMIENTAS ==========
    .addSubMenu(ui.createMenu('🛠️ Herramientas')
      .addItem('🔧 Reparar Validaciones', 'repararValidaciones')
      .addItem('🔧 Reparar Fórmulas', 'repararFormulas')
      .addSeparator()
      .addItem('🧹 Limpiar Filas Vacías', 'limpiarFilasVaciasHojaInteres')
      .addItem('🧹 Limpiar Cohortes Eliminadas', 'limpiarCohortesEliminadas')
      .addSeparator()
      .addItem('🔄 Autocompletar desde CREAMOS ID', 'autocompletarDesdeCreamosID')
      .addItem('✅ Verificar Instalación', 'verificarInstalacion')
      .addSeparator()
      .addSubMenu(ui.createMenu('👤 Responsables')
        .addItem('➕ Agregar Responsable', 'agregarResponsable')
        .addItem('📝 Ver Responsables', 'verResponsables'))
      .addSeparator()
      .addItem('🔍 Probar Conexión Kobo', 'probarConexionKobo')
      .addItem('📊 Ver Columnas Kobo', 'verColumnasKobo')
      .addItem('✉️ Probar Email', 'probarEmail'))
    .addSeparator()

    // ========== INSTALACIÓN Y AYUDA ==========
    .addItem('🚀 Instalación Completa', 'instalarTodo')
    .addItem('📖 Ver Guía de Uso', 'verGuiaUso')
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

    Logger.log('✅ Sistema de Inclusión Laboral - Tecnología instalado');

  } catch (error) {
    ss.toast('❌ Error: ' + error.message, 'ERROR', 10);
    Logger.log('❌ Error en instalación: ' + error.message);
  }
}

/**
 * Instalación v3 — Solo agrega funcionalidades nuevas SIN borrar datos existentes
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
    'Hoja de Interés', 'Entrevistas', 'Inscritx',
    'Cohortes', 'Graduadx', 'Retiradx',
    'No Inscritx', 'Lista Definitiva', 'Reporte', 'Reportes Mensuales'
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

  // Solo crear hojas que no existan — NUNCA eliminar hojas existentes
  // para preservar datos históricos

  if (!ss.getSheetByName('Hoja de Interés')) {
    const primera = ss.getSheets()[0];
    if (primera.getLastRow() <= 1 && primera.getLastColumn() <= 1) {
      primera.setName('Hoja de Interés');
    } else {
      ss.insertSheet('Hoja de Interés');
    }
  }

  crearHojaInteres();
  crearHojaEntrevistas();
  crearHojaDetalleEntrevistas();
  crearHojaInscritx();
  crearHojaCohortes();
  crearHojaGraduadx();
  crearHojaRetiradx();
  crearHojaNoInscritx();
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

  // Si la hoja ya tiene datos (más de solo encabezados), NO borrar
  // Solo configurar encabezados y formato
  const tieneData = sheet.getLastRow() > 1;

  if (!tieneData) {
    sheet.clear();
  }

  const headers = [
    'Fecha Registro',  // A - Automático
    'No.',             // B - Automático
    'Creamos ID',      // C
    'DPI',             // D
    'Nombre Completo', // E
    'Género',          // F - Desplegable
    'Edad',            // G
    'Teléfono',        // H
    'Nivel Educativo', // I - Desplegable
    'Zona',            // J - Desplegable
    'Cómo se enteró',  // K
    'Responsable',     // L - Desplegable
    'Notas',           // M
    '¿Deseas inscribirte?', // N - Desde Kobo
    'Servicio/Formación de Interés', // O - Desde Kobo
    'Estado'           // P - Desplegable (al final para evitar problemas)
  ];

  // Siempre asegurar que los encabezados estén correctos
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#1565c0')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Solo instalar fórmulas en filas vacías (sin nombre en col E)
  const ultimaFila = Math.max(sheet.getLastRow(), 2);
  const maxFila = Math.max(ultimaFila + 50, 500);
  for (let i = 2; i <= maxFila; i++) {
    const valorE = sheet.getRange('E' + i).getValue();
    const valorA = sheet.getRange('A' + i).getValue();
    // Solo poner fórmula de No. si no hay valor fijo ya puesto
    sheet.getRange('B' + i).setFormula('=IF(E' + i + '<>"",COUNTA($E$2:E' + i + '),"")');
    // Solo poner fórmula de fecha si la celda está vacía y no hay nombre
    if (!valorA && !valorE) {
      sheet.getRange('A' + i).setFormula('=IF(E' + i + '<>"",TODAY(),"")');
    }
  }

  [100, 50, 100, 130, 200, 120, 60, 120, 150, 120, 150, 150, 120, 250, 250, 120, 250].forEach((w, i) => {
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
    'Género',             // E
    'Teléfono',           // F
    'Entrevistador',      // G - Desplegable (responsables)
    'Calificación',       // H
    'Observaciones',      // I
    'Estado'              // J - Desplegable (última columna - trigger)
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#7b1fa2')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Anchos de columna
  [120, 80, 100, 200, 120, 120, 120, 120, 300, 150].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });

  // Destacar columna "Estado"
  sheet.getRange('J1').setBackground('#4caf50');
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
    'Grupos Diversos',            // E - ¿Dispuesto a trabajar en grupos diversos?
    'Grupos Mixtos',              // F - ¿Dispuesto a trabajar en grupos mixtos?
    'Experiencia Grupos Mixtos',  // G - ¿Experiencia previa en grupos mixtos?

    // === FORMACIÓN Y CAPACITACIÓN ===
    'Formación Previa',           // H - ¿Tiene formación previa?
    'Dónde Formación',            // I
    'Tiene Certificado',          // J
    'Cuál Certificado',           // K

    // === INTERESES LABORALES ===
    'Sector Interés',             // L - ¿En qué sector le gustaría trabajar?
    'Proyecto Interés',           // M

    // === CURSO ALIMENTOS/BEBIDAS/TECNOLOGÍA ===
    'Dificultades Curso',         // N - ¿Con qué dificultades cree que se encontraría?
    'Áreas Vida Cambiarán',       // O
    'Por Qué Interesa Curso',     // P
    'Firmar Documento',           // Q - ¿Dispuesto a firmar documento permanencia?
    'Disponibilidad Prácticas',   // R
    'Trabajar en Sector',         // S - ¿Dispuesto a trabajar en el sector?
    'Horarios Demandantes',       // T - ¿Horarios nocturnos, fines de semana?
    'Comentarios Curso',          // U

    // === SITUACIÓN ECONÓMICA ===
    'Ayuda Económica',            // V - ¿Alguien le ayuda económicamente?
    'Comentario Ayuda',           // W
    'Dependientes Económicos',    // X - ¿Alguien depende de usted?
    'Comentario Dependientes',    // Y
    'Responsabilidades Cuidado',  // Z - ¿Tiene responsabilidades de cuidado?
    'Comentario Cuidado',         // AA
    'Otros Comentarios Económicos', // AB

    // === TRANSPORTE Y ANTECEDENTES ===
    'Tiene Transporte',           // AC
    'Plan Traslado',              // AD
    'Deudas Bancarias',           // AE
    'Antecedentes Manchados',     // AF
    'Comentario Antecedentes',    // AG

    // === SOLO OPERARIOS ===
    'Trámites Penales',           // AH - ¿Ya tiene los trámites?
    'Talla Zapato',               // AI
    'Movilizarse Cualquier Zona', // AJ
    'Comentarios Operarios',      // AK

    // === ENFOQUE DE GÉNERO ===
    'Comentario Previo Género',   // AL
    'Conoce VBG',                 // AM - ¿Ha escuchado de violencia basada en género?
    'Grupos Mixtos Género',       // AN
    'Grupos Diversos Género',     // AO
    'Comentario Género',          // AP
    'Conflictos Casa',            // AQ - ¿Causaría conflictos en casa?
    'Comentario Conflictos',      // AR
    'Grupo Mayormente Mujeres',   // AS - ¿Cómo se siente?
    'Igualdad Hombres Mujeres',   // AT - ¿Qué haría para igualdad?
    'Familiares Creamos',         // AU - ¿Tiene familiares en Creamos?
    'Nombres Familiares',         // AV
    'Formal o Informal',          // AW
    'Conoce Violencia Mujer',     // AX

    // === PREGUNTA ADICIONAL CURSO ===
    '¿Aprender para práctica en trabajo?', // AY - ¿Te interesa aprender para luego ponerlo en práctica?

    // === CONTROL ===
    'Vinculado'                   // AZ - Sí/No - Si ya está vinculado con Entrevistas
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

  // Congelar fila de encabezados
  sheet.setFrozenRows(1);

  // Anchos de columna (52 valores = 52 headers, A a AZ)
  const anchos = [
    100,  // Fecha
    100,  // Creamos ID
    180,  // Nombre
    80,   // Género
    80, 80, 80,  // Grupos
    80, 150, 80, 150,  // Formación
    120, 150,  // Intereses
    200, 200, 200, 80, 80, 80, 80, 200,  // Curso
    80, 150, 80, 150, 80, 150, 200,  // Económico
    80, 200, 80, 80, 150,  // Transporte
    80, 80, 80, 150,  // Operarios
    150, 80, 80, 80, 150, 80, 150, 150, 200, 80, 150, 100, 200,  // Género
    150,  // Adicionales (AY)
    80    // Vinculado (AZ)
  ];
  anchos.forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });

  // Colorear secciones de encabezado
  sheet.getRange('A1:D1').setBackground('#1565c0');   // Info General - Azul
  sheet.getRange('E1:G1').setBackground('#2e7d32');   // Grupos - Verde
  sheet.getRange('H1:K1').setBackground('#f57c00');   // Formación - Naranja
  sheet.getRange('L1:M1').setBackground('#c62828');   // Intereses - Rojo
  sheet.getRange('N1:U1').setBackground('#6a1b9a');   // Curso - Morado
  sheet.getRange('V1:AB1').setBackground('#00838f');  // Económico - Cyan
  sheet.getRange('AC1:AG1').setBackground('#4527a0'); // Transporte - Índigo
  sheet.getRange('AH1:AK1').setBackground('#bf360c'); // Operarios - Naranja oscuro
  sheet.getRange('AL1:AX1').setBackground('#ad1457'); // Género - Rosa
  sheet.getRange('AY1:AZ1').setBackground('#37474f'); // Adicionales - Gris
}

/**
 * HOJA DE SELECCIONADAS - SIMPLIFICADA
 * - Sin columna Estado
 * - "Enviar a Cohorte" al final - dropdown dinámico con cohortes activas
 * - Al seleccionar cohorte, se envía automáticamente
 */
function crearHojaInscritx() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss.getSheetByName('Inscritx')) return;
  const sheet = ss.insertSheet('Inscritx');

  const headers = [
    'No.',              // A
    'Creamos ID',       // B
    'DPI',              // C
    'Nombre Completo',  // D
    'Género',           // E
    'Edad',             // F
    'Teléfono',         // G
    'Nivel Educativo',  // H
    'Zona',             // I
    'Notas',            // J
    'Enviar a Cohorte'  // K - Desplegable dinámico (última columna - trigger)
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#2e7d32')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  [50, 100, 130, 200, 120, 60, 120, 150, 120, 250, 180].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });

  // Destacar columna de envío
  sheet.getRange('K1').setBackground('#4caf50');
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
    'Graduadx',          // H - Fórmula
    'Retiradx',        // I - Fórmula
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
    sheet.getRange('H' + i).setFormula('=IFERROR(COUNTIF(Graduadx!G:G,A' + i + '),0)');
    sheet.getRange('I' + i).setFormula('=IFERROR(COUNTIF(Retiradx!G:G,A' + i + '),0)');
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
function crearHojaGraduadx() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss.getSheetByName('Graduadx')) return;
  const sheet = ss.insertSheet('Graduadx');

  const headers = [
    'Fecha Graduación',     // A
    'Creamos ID',           // B
    'DPI',                  // C
    'Nombre Completo',      // D
    'Género',               // E
    'Teléfono',             // F
    'Nivel Educativo',      // G
    'Cohorte',              // H
    'Notas'                 // I
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#388e3c')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  [120, 100, 130, 200, 120, 120, 150, 180, 300].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });
}

/**
 * HOJA DE DESERCIONES - Con opción de reenviar a Inscritx
 */
function crearHojaRetiradx() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss.getSheetByName('Retiradx')) return;
  const sheet = ss.insertSheet('Retiradx');

  const headers = [
    'Fecha Deserción',  // A
    'Creamos ID',       // B
    'DPI',              // C
    'Nombre Completo',  // D
    'Género',           // E
    'Teléfono',         // F
    'Nivel Educativo',  // G
    'Cohorte',          // H
    'Motivo',           // I
    'Notas',            // J
    'Acción'            // K - Desplegable para reenviar (última columna - trigger)
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#d32f2f')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  [120, 100, 130, 200, 120, 120, 150, 180, 200, 300, 180].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });

  // Destacar columna Acción
  sheet.getRange('K1').setBackground('#4caf50');
}

/**
 * HOJA DE NO SELECCIONADAS - Con colores según origen y opción de reenviar
 * COLORES:
 * - Amarillo (#fff9c4): Vino de Hoja de Interés (no interesado inicial)
 * - Naranja (#ffe0b2): Vino de Entrevistas (no aprobó/no asistió)
 * - Rojo claro (#ffcdd2): Vino de Inscritx (ya estaba seleccionado)
 */
function crearHojaNoInscritx() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss.getSheetByName('No Inscritx')) return;
  const sheet = ss.insertSheet('No Inscritx');

  const headers = [
    'Fecha',            // A
    'Creamos ID',       // B
    'Nombre Completo',  // C
    'Género',           // D
    'Teléfono',         // E
    'Etapa',            // F - En qué etapa no fue seleccionada
    'Motivo',           // G - Desplegable
    'Origen',           // H - Interés / Entrevista / Inscritx
    'Notas',            // I
    'Acción'            // J - Desplegable para reenviar (última columna - trigger)
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#616161')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  [120, 100, 200, 120, 120, 150, 200, 150, 300, 180].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });

  // Destacar columna Acción
  sheet.getRange('J1').setBackground('#4caf50');
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
    'Género',           // F
    'Edad',             // G
    'Teléfono',         // H
    'Nivel Educativo',  // I
    'Zona',             // J
    'Cohorte'           // K
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#1a237e')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  [50, 120, 100, 130, 200, 120, 60, 120, 150, 120, 180].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });

  sheet.setFrozenRows(1);

  // Destacar columna Cohorte
  sheet.getRange('K1').setBackground('#4caf50');
}

/**
 * HOJA DE REPORTE - Dashboard principal (incluye No Inscritx)
 */
function crearHojaReporte() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss.getSheetByName('Reporte')) return;
  const sheet = ss.insertSheet('Reporte');

  // Columnas actualizadas:
  // Inscritx: A-No, B-CreamosID, C-DPI, D-Nombre, E-Edad, F-Tel, G-NivelEdu, H-Zona, I-Notas, J-EnviarACohorte
  // Graduadx: A-Fecha, B-CreamosID, C-DPI, D-Nombre, E-Tel, F-NivelEdu, G-Cohorte, H-Notas
  const data = [
    ['REPORTE - INCLUSIÓN LABORAL TECNOLOGÍA', '', '', ''],                                    // 1
    ['Última actualización:', '=TEXT(NOW(),"DD/MM/YYYY HH:MM")', 'Mes actual:', '=TEXT(TODAY(),"MMMM YYYY")'], // 2
    ['', '', '', ''],                                                                           // 3

    ['PERSONAS INTERESADAS', 'Total', 'Este mes', ''],                                         // 4
    ['Registros en Hoja de Interés', '=IFERROR(COUNTA(\'Hoja de Interés\'!E:E)-1,0)', '=IFERROR(COUNTIFS(\'Hoja de Interés\'!A:A,">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1)),0)', ''], // 5
    ['', '', '', ''],                                                                           // 6

    ['ENTREVISTAS', 'Total', 'Pendientes', ''],                                                // 7
    ['Entrevistas', '=IFERROR(COUNTA(Entrevistas!D:D)-1,0)', '=IFERROR(COUNTIF(Entrevistas!I:I,""),0)', ''], // 8
    ['', '', '', ''],                                                                           // 9

    ['SELECCIONADAS', 'Total', '', ''],                                                         // 10
    ['Personas pendientes de asignar cohorte', '=IFERROR(COUNTA(Inscritx!D:D)-1,0)', '', ''], // 11
    ['', '', '', ''],                                                                           // 12

    ['PARTICIPANTES POR COHORTE', 'Ver hoja Cohortes', '', ''],                                 // 13
    ['(Los datos por cohorte se ven en la hoja Cohortes)', '', '', ''],                         // 14
    ['', '', '', ''],                                                                           // 15

    ['GRADUADAS', 'Total', 'Este mes', ''],                                                     // 16
    ['Personas graduadas', '=IFERROR(COUNTA(Graduadx!D:D)-1,0)', '=IFERROR(COUNTIFS(Graduadx!A:A,">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1)),0)', ''], // 17
    ['', '', '', ''],                                                                           // 18

    ['DESERCIONES', 'Total', 'Este mes', 'Tasa'],                                              // 19
    ['Personas que desertaron', '=IFERROR(COUNTA(Retiradx!D:D)-1,0)', '=IFERROR(COUNTIFS(Retiradx!A:A,">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1)),0)', '=IFERROR(IF((B17+B20)>0,ROUND(B20/(B17+B20)*100,1)&"%","0%"),"0%")'], // 20
    ['', '', '', ''],                                                                           // 21

    ['NO SELECCIONADAS', 'Total', 'Este mes', ''],                                             // 22
    ['Personas no seleccionadas', '=IFERROR(COUNTA(\'No Inscritx\'!C:C)-1,0)', '=IFERROR(COUNTIFS(\'No Inscritx\'!A:A,">="&DATE(YEAR(TODAY()),MONTH(TODAY()),1)),0)', ''], // 23
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
    'Inscritx',
    'Activas',
    'Graduadx',
    'Retiradx',
    'No Inscritx',
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
    interes.getRange('I2:I500').clearDataValidations();
    interes.getRange('J2:J500').clearDataValidations();

    // Género (columna F) - Desplegable con opciones de género
    interes.getRange('F2:F500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(CONFIG.GENEROS)
        .setAllowInvalid(true)
        .build()
    );

    // Estado (columna P) - SOLO DOS OPCIONES
    interes.getRange('P2:P500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(['Entrevista agendada', 'No interesado'])
        .setAllowInvalid(false)
        .build()
    );
  }

  // === HOJA DE ENTREVISTAS ===
  // Columnas: A-Fecha, B-Hora, C-CreamosID, D-Nombre, E-Género, F-Tel, G-Entrevistador, H-Calificación, I-Observaciones, J-Estado
  const entrevistas = ss.getSheetByName('Entrevistas');
  if (entrevistas) {
    // Género (E)
    entrevistas.getRange('E2:E500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.GENEROS).setAllowInvalid(true).build()
    );
    // Entrevistador (G)
    entrevistas.getRange('G2:G500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(responsables).setAllowInvalid(false).build()
    );
    // Estado (J) - Resultado de entrevista (última columna)
    entrevistas.getRange('J2:J500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.RESULTADO_FINAL).setAllowInvalid(false).build()
    );
  }

  // === HOJA DE SELECCIONADAS ===
  // Columnas: A-No, B-CreamosID, C-DPI, D-Nombre, E-Género, F-Edad, G-Tel, H-NivelEdu, I-Zona, J-Notas, K-EnviarACohorte
  const seleccionadas = ss.getSheetByName('Inscritx');
  if (seleccionadas) {
    // Género (E)
    seleccionadas.getRange('E2:E500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.GENEROS).setAllowInvalid(true).build()
    );
    seleccionadas.getRange('H2:H500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.NIVELES_EDUCATIVOS).setAllowInvalid(false).build()
    );
    seleccionadas.getRange('I2:I500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.ZONAS).setAllowInvalid(true).build()
    );
    // Enviar a Cohorte (K) - dropdown dinámico con cohortes activas
    if (cohortes.length > 0) {
      seleccionadas.getRange('K2:K500').setDataValidation(
        SpreadsheetApp.newDataValidation().requireValueInList(cohortes).setAllowInvalid(false).build()
      );
    }
  }

  // === HOJA DE GRADUADAS ===
  // Columnas: A-Fecha, B-CreamosID, C-DPI, D-Nombre, E-Género, F-Tel, G-NivelEdu, H-Cohorte, I-Notas
  const graduadas = ss.getSheetByName('Graduadx');
  if (graduadas) {
    // Género (E)
    graduadas.getRange('E2:E500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.GENEROS).setAllowInvalid(true).build()
    );
    graduadas.getRange('G2:G500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.NIVELES_EDUCATIVOS).setAllowInvalid(false).build()
    );
    const todasCohortes = obtenerCohortesActuales();
    graduadas.getRange('H2:H500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(todasCohortes).setAllowInvalid(false).build()
    );
    // Nota: No hay desplegable de Estado en Graduadx — el seguimiento se gestiona en el Archivo de Seguimiento externo
  }

  // === HOJA DE DESERCIONES ===
  // Columnas: A-Fecha, B-CreamosID, C-DPI, D-Nombre, E-Género, F-Tel, G-NivelEdu, H-Cohorte, I-Motivo, J-Notas, K-Acción
  const deserciones = ss.getSheetByName('Retiradx');
  if (deserciones) {
    // Género (E)
    deserciones.getRange('E2:E500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.GENEROS).setAllowInvalid(true).build()
    );
    const todasCohortes = obtenerCohortesActuales();
    deserciones.getRange('H2:H500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(todasCohortes).setAllowInvalid(false).build()
    );
    deserciones.getRange('I2:I500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.MOTIVOS_DESERCION).setAllowInvalid(true).build()
    );
    // Acción (K) - Opción para reenviar a Inscritx
    deserciones.getRange('K2:K500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(['Reenviar a Inscritx']).setAllowInvalid(true).build()
    );
  }

  // === HOJA DE NO SELECCIONADAS ===
  // Columnas: A-Fecha, B-CreamosID, C-Nombre, D-Género, E-Tel, F-Etapa, G-Motivo, H-Origen, I-Notas, J-Acción
  const noInscritx = ss.getSheetByName('No Inscritx');
  if (noInscritx) {
    // Género (D)
    noInscritx.getRange('D2:D500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.GENEROS).setAllowInvalid(true).build()
    );
    noInscritx.getRange('F2:F500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(['Interés inicial', 'Post-entrevista', 'Post-selección']).setAllowInvalid(false).build()
    );
    noInscritx.getRange('G2:G500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.MOTIVOS_NO_SELECCION).setAllowInvalid(true).build()
    );
    noInscritx.getRange('H2:H500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(['Hoja de Interés', 'Entrevistas', 'Inscritx']).setAllowInvalid(false).build()
    );
    // Acción (J) - Opciones para reenviar según origen
    noInscritx.getRange('J2:J500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(['Reenviar a Entrevistas', 'Reenviar a Inscritx']).setAllowInvalid(true).build()
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
    // Fórmula personalizada: si Inscritas (G) >= Cupo Máximo (F) y Cupo > 0
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
  // Estado está en columna P (16) - solo "Entrevista agendada" o "No interesado"
  if (hoja === 'Hoja de Interés') {
    if (columna === 16) {
      procesarCambioEstadoInteres(sheet, fila, val);
    }
  }

  // === ENTREVISTAS ===
  // Estado está en columna J (10) - triggers automáticos según resultado
  if (hoja === 'Entrevistas') {
    if (columna === 10) {
      procesarResultadoEntrevista(sheet, fila, val);
    }
  }

  // === SELECCIONADAS ===
  // "Enviar a Cohorte" está en columna K (11) - al seleccionar cohorte se envía
  if (hoja === 'Inscritx') {
    if (columna === 11 && val !== '') {
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
  // Acción está en columna J (10) - reenviar a Entrevistas o Inscritx
  if (hoja === 'No Inscritx') {
    if (columna === 10 && val.startsWith('Reenviar')) {
      procesarReenvioDesdeNoInscritx(sheet, fila, val);
    }
  }

  // === DESERCIONES ===
  // Acción está en columna K (11) - reenviar a Inscritx
  if (hoja === 'Retiradx') {
    if (columna === 11 && val === 'Reenviar a Inscritx') {
      procesarReenvioDesdeRetiradx(sheet, fila);
    }
  }

  // === HOJAS DE COHORTES INDIVIDUALES ===
  const hojasPrincipales = ['Hoja de Interés', 'Entrevistas', 'Inscritx', 'Cohortes',
                            'Graduadx', 'Retiradx', 'No Inscritx', 'Reporte', 'Reportes Mensuales',
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
    // Estado está en columna J (10) - "Graduada" o "Deserción"
    if (columna === 10) {
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
 * - "No interesado" → Copia a No Inscritx (conserva registro en Hoja de Interés)
 * - "Entrevista agendada" → Copia a Entrevistas (conserva registro en Hoja de Interés)
 */
function procesarCambioEstadoInteres(sheet, fila, estado) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const datos = sheet.getRange(fila, 1, 1, 16).getValues()[0];

  if (estado === 'No interesado') {
    const noInscritx = ss.getSheetByName('No Inscritx');
    const nuevaFila = obtenerPrimeraFilaVacia(noInscritx, 'C');

    // Columnas: Fecha, CreamosID, Nombre, Género, Tel, Etapa, Motivo, Origen, Notas, Acción
    const registro = [
      new Date(),
      datos[2],             // Creamos ID
      datos[4],             // Nombre
      datos[5],             // Género
      datos[7],             // Teléfono
      'Interés inicial',    // Etapa
      'No interesado',      // Motivo
      'Hoja de Interés',    // Origen
      datos[12],            // Notas (columna M)
      ''                    // Acción (vacío)
    ];

    noInscritx.getRange(nuevaFila, 1, 1, 10).setValues([registro]);

    // COLOR AMARILLO: Vino de Hoja de Interés
    noInscritx.getRange(nuevaFila, 1, 1, 10).setBackground('#fff9c4');

    // Marcar como procesado (NO eliminar - conservar registro)
    sheet.getRange(fila, 1, 1, 16).setBackground('#fff9c4'); // Amarillo claro
    ss.toast('📋 Copiado a "No Inscritx" (registro conservado)', 'Completado', 3);
  }

  if (estado === 'Entrevista agendada') {
    const entrevistas = ss.getSheetByName('Entrevistas');
    const nuevaFila = entrevistas.getLastRow() + 1;

    // Entrevistas: Fecha, Hora, CreamosID, Nombre, Género, Tel, Entrevistador, Calificación, Observaciones, Estado
    const registro = [
      '',                   // A: Fecha Entrevista
      '',                   // B: Hora
      datos[2],             // C: Creamos ID
      datos[4],             // D: Nombre
      datos[5],             // E: Género
      datos[7],             // F: Teléfono
      'Eva',                // G: Entrevistador (por defecto)
      '',                   // H: Calificación
      '',                   // I: Observaciones
      ''                    // J: Estado (vacío hasta que se complete)
    ];

    entrevistas.getRange(nuevaFila, 1, 1, 10).setValues([registro]);

    // Marcar como procesado (NO eliminar - conservar registro)
    sheet.getRange(fila, 1, 1, 16).setBackground('#c8e6c9'); // Verde claro
    ss.toast('📋 Entrevista creada en hoja Entrevistas (registro conservado).', 'Entrevista Agendada', 4);
  }
}

/**
 * Procesa resultado de entrevista (columna Final)
 * - "Aprobada" → Mueve a Inscritx
 * - "No aprobada" / "No asistió" → Mueve a No Inscritx
 * - "Reprogramada" → No hace nada
 */
function procesarResultadoEntrevista(sheet, fila, resultado) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  // Lee 10 columnas: A=Fecha, B=Hora, C=CreamosID, D=Nombre, E=Género, F=Tel,
  //                  G=Entrevistador, H=Calificación, I=Observaciones, J=Estado
  const datos = sheet.getRange(fila, 1, 1, 10).getValues()[0];
  const creamosId = datos[2];

  if (resultado === 'Aprobada') {
    // Buscar datos adicionales en Hoja de Interés
    const interes = ss.getSheetByName('Hoja de Interés');
    const busqueda = buscarPorCreamosID(interes, creamosId);
    const datosInteres = busqueda ? busqueda.datos : null;
    const filaInteres = busqueda ? busqueda.fila : null;

    // Mover a Inscritx
    const seleccionadas = ss.getSheetByName('Inscritx');
    const nuevaFila = obtenerPrimeraFilaVacia(seleccionadas, 'D');

    // Orden: No, CreamosID, DPI, Nombre, Género, Edad, Tel, NivelEdu, Zona, Notas, EnviarACohorte
    // Entrevistas: [0]Fecha, [1]Hora, [2]CreamosID, [3]Nombre, [4]Género, [5]Tel,
    //              [6]Entrevistador, [7]Calificación, [8]Observaciones, [9]Estado
    const registroInscritx = [
      nuevaFila - 1,
      creamosId,
      datosInteres ? datosInteres[3] : '',          // DPI
      datos[3],                                     // Nombre
      datos[4],                                     // Género
      datosInteres ? datosInteres[6] : '',          // Edad
      datos[5],                                     // Teléfono
      datosInteres ? datosInteres[8] : '',          // Nivel Educativo
      datosInteres ? datosInteres[9] : '',          // Zona
      datos[8],                                     // Notas (Observaciones - columna I)
      ''                                            // Enviar a Cohorte (vacío)
    ];

    seleccionadas.getRange(nuevaFila, 1, 1, 11).setValues([registroInscritx]);

    // Marcar en Hoja de Interés como procesado (NO eliminar)
    if (filaInteres) {
      interes.getRange(filaInteres, 1, 1, 16).setBackground('#c8e6c9'); // Verde claro
    }

    // Marcar en Entrevistas como procesado (NO eliminar)
    sheet.getRange(fila, 1, 1, 10).setBackground('#c8e6c9'); // Verde claro

    ss.toast('✅ Aprobada - copiada a Inscritx. Asigne cohorte.', 'Entrevista', 4);
    return;
  }

  if (resultado === 'No aprobada' || resultado === 'No asistió') {
    const noInscritx = ss.getSheetByName('No Inscritx');
    const nuevaFila = obtenerPrimeraFilaVacia(noInscritx, 'C');

    const motivo = resultado === 'No aprobada' ? 'No aprobó entrevista' : 'No asistió a entrevista';

    // Columnas: Fecha, CreamosID, Nombre, Género, Tel, Etapa, Motivo, Origen, Notas, Acción
    const registro = [
      new Date(),
      datos[2],             // Creamos ID
      datos[3],             // Nombre
      datos[4],             // Género
      datos[5],             // Teléfono
      'Post-entrevista',    // Etapa
      motivo,
      'Entrevistas',        // Origen
      datos[8],             // Notas (Observaciones - columna I)
      ''                    // Acción (vacío)
    ];

    noInscritx.getRange(nuevaFila, 1, 1, 10).setValues([registro]);

    // COLOR NARANJA: Vino de Entrevistas
    noInscritx.getRange(nuevaFila, 1, 1, 10).setBackground('#ffe0b2');

    // Marcar en Entrevistas como procesado (NO eliminar)
    sheet.getRange(fila, 1, 1, 10).setBackground('#ffe0b2'); // Naranja claro

    ss.toast('📋 Copiado a "No Inscritx" (registro conservado)', 'Entrevista', 3);
  }

  // "Reprogramada" no hace nada automático
}

/**
 * Procesa deserción desde hoja individual de Cohorte
 * Pregunta motivo y mueve a Retiradx
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

  // Agregar a Retiradx
  // Columnas: Fecha, CreamosID, DPI, Nombre, Género, Tel, NivelEdu, Cohorte, Motivo, Notas, Acción
  const deserciones = ss.getSheetByName('Retiradx');
  const nuevaFila = obtenerPrimeraFilaVacia(deserciones, 'D');

  const registro = [
    new Date(),
    datos[2],           // Creamos ID
    datos[3],           // DPI
    datos[4],           // Nombre
    datos[5] || '',     // Género (puede no existir en hojas antiguas)
    datos[6],           // Teléfono
    datos[7],           // Nivel Educativo
    nombreCohorte,      // Cohorte
    motivo,             // Motivo
    '',                 // Notas
    ''                  // Acción (vacío)
  ];

  deserciones.getRange(nuevaFila, 1, 1, 11).setValues([registro]);

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
 * Procesa reenvío desde No Inscritx
 * - "Reenviar a Entrevistas" → Crea entrada en Entrevistas
 * - "Reenviar a Inscritx" → Crea entrada en Inscritx
 */
function procesarReenvioDesdeNoInscritx(sheet, fila, accion) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Columnas: Fecha, CreamosID, Nombre, Género, Tel, Etapa, Motivo, Origen, Notas, Acción
  const datos = sheet.getRange(fila, 1, 1, 10).getValues()[0];
  const creamosId = datos[1];
  const nombre = datos[2];
  const genero = datos[3];
  const telefono = datos[4];
  const origen = datos[7];
  const notas = datos[8];

  if (accion === 'Reenviar a Entrevistas') {
    const entrevistas = ss.getSheetByName('Entrevistas');
    const nuevaFila = entrevistas.getLastRow() + 1;

    // Columnas: Fecha, Hora, CreamosID, Nombre, Género, Tel, Entrevistador, Calificación, Obs, Estado
    const registro = [
      '',               // Fecha
      '',               // Hora
      creamosId,
      nombre,
      genero,
      telefono,
      'Eva',            // Entrevistador (por defecto)
      '',               // Calificación
      'Reingreso desde No Inscritx - ' + notas,
      ''                // Estado
    ];

    entrevistas.getRange(nuevaFila, 1, 1, 10).setValues([registro]);

    // Marcar como reenviado (NO eliminar - conservar registro)
    sheet.getRange(fila, 10).setValue(''); // Limpiar acción
    sheet.getRange(fila, 1, 1, 10).setBackground('#e0e0e0'); // Gris claro

    ss.toast('✅ ' + nombre + ' reenviada a Entrevistas (registro conservado)', 'Reenvío', 4);
  }

  if (accion === 'Reenviar a Inscritx') {
    const seleccionadas = ss.getSheetByName('Inscritx');
    const nuevaFila = obtenerPrimeraFilaVacia(seleccionadas, 'D');

    // Columnas: No, CreamosID, DPI, Nombre, Género, Edad, Tel, NivelEdu, Zona, Notas, EnviarACohorte
    const registro = [
      nuevaFila - 1,
      creamosId,
      '',               // DPI
      nombre,
      genero,
      '',               // Edad
      telefono,
      '',               // Nivel Educativo
      '',               // Zona
      'Reingreso desde No Inscritx - ' + notas,
      ''                // Enviar a Cohorte
    ];

    seleccionadas.getRange(nuevaFila, 1, 1, 11).setValues([registro]);

    // Marcar como reenviado (NO eliminar - conservar registro)
    sheet.getRange(fila, 10).setValue(''); // Limpiar acción
    sheet.getRange(fila, 1, 1, 10).setBackground('#e0e0e0'); // Gris claro

    ss.toast('✅ ' + nombre + ' reenviada a Inscritx (registro conservado)', 'Reenvío', 4);
  }
}

/**
 * Procesa reenvío desde Retiradx a Inscritx
 */
function procesarReenvioDesdeRetiradx(sheet, fila) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Columnas: Fecha, CreamosID, DPI, Nombre, Género, Tel, NivelEdu, Cohorte, Motivo, Notas, Acción
  const datos = sheet.getRange(fila, 1, 1, 11).getValues()[0];
  const creamosId = datos[1];
  const dpi = datos[2];
  const nombre = datos[3];
  const genero = datos[4];
  const telefono = datos[5];
  const nivelEducativo = datos[6];
  const cohorteAnterior = datos[7];
  const notas = datos[9];

  const seleccionadas = ss.getSheetByName('Inscritx');
  const nuevaFila = obtenerPrimeraFilaVacia(seleccionadas, 'D');

  // Columnas: No, CreamosID, DPI, Nombre, Género, Edad, Tel, NivelEdu, Zona, Notas, EnviarACohorte
  const registro = [
    nuevaFila - 1,
    creamosId,
    dpi,
    nombre,
    genero,
    '',               // Edad
    telefono,
    nivelEducativo,
    '',               // Zona
    'Reingreso desde Deserción (' + cohorteAnterior + ') - ' + notas,
    ''                // Enviar a Cohorte
  ];

  seleccionadas.getRange(nuevaFila, 1, 1, 11).setValues([registro]);

  // NO ELIMINAR - Mantener registro histórico de deserción
  // Solo marcar que reingresó y limpiar la acción
  const notasActuales = datos[9] || '';
  const fechaReingreso = Utilities.formatDate(new Date(), 'America/Guatemala', 'dd/MM/yyyy');
  sheet.getRange(fila, 10).setValue(notasActuales + ' [Reingresó: ' + fechaReingreso + ']');
  sheet.getRange(fila, 11).setValue(''); // Limpiar Acción

  // Marcar fila con color gris claro para indicar que ya reingresó
  sheet.getRange(fila, 1, 1, 11).setBackground('#e0e0e0');

  ss.toast('✅ ' + nombre + ' reenviada a Inscritx (registro de deserción conservado)', 'Reenvío', 4);
}

/**
 * Procesa envío a cohorte desde Inscritx (columna J - Enviar a Cohorte)
 * - Verifica cupo disponible
 * - Agrega a la hoja individual de la Cohorte
 * - Marca como enviada en Inscritx (conserva registro)
 */
function procesarEnvioACohorte(sheet, fila, cohorteDestino) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Inscritx tiene 11 columnas: No, CreamosID, DPI, Nombre, Género, Edad, Tel, NivelEdu, Zona, Notas, EnviarACohorte
  const datos = sheet.getRange(fila, 1, 1, 11).getValues()[0];
  const creamosId = datos[1];
  const nombre = datos[3];

  // Verificar que la cohorte existe
  const hojaCohorte = ss.getSheetByName(cohorteDestino);
  if (!hojaCohorte) {
    ss.toast('⚠️ La cohorte "' + cohorteDestino + '" no existe. Créela primero.', 'Error', 4);
    sheet.getRange(fila, 11).setValue(''); // Limpiar selección
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
            sheet.getRange(fila, 11).setValue(''); // Limpiar selección
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
  // Orden: Fecha, No, CreamosID, DPI, Nombre, Género, Edad, Tel, NivelEdu, Estado
  const registroCohorte = [
    new Date(),
    noParticipante,
    creamosId,
    datos[2],           // DPI
    nombre,
    datos[4] || '',     // Género
    datos[5],           // Edad
    datos[6],           // Teléfono
    datos[7],           // Nivel Educativo
    ''                  // Estado (vacío - opciones: Graduada/Deserción)
  ];
  hojaCohorte.getRange(nuevaFilaCohorte, 1, 1, 10).setValues([registroCohorte]);

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
      datos[4] || '',     // Género
      datos[5],           // Edad
      datos[6],           // Teléfono
      datos[7],           // Nivel Educativo
      datos[8],           // Zona
      cohorteDestino      // Cohorte
    ];
    listaDefinitiva.getRange(nuevaFilaLD, 1, 1, 11).setValues([registroLD]);
  }

  // Marcar como enviada (NO eliminar - conservar registro)
  sheet.getRange(fila, 10).setValue('Enviada a ' + cohorteDestino);
  sheet.getRange(fila, 11).setValue(''); // Limpiar dropdown
  sheet.getRange(fila, 1, 1, 11).setBackground('#e0e0e0'); // Gris claro

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
    const totalGraduadx = datosCohorte.slice(1).filter(f => f[4] && f[8] === 'Graduada').length;
    if (totalGraduadx > 0) {
      const reenviar = ui.alert(
        '✅ Cohorte ya graduada',
        'Todos los participantes ya tienen estado "Graduada".\n\n' +
        totalGraduadx + ' participante(s) registradas en la cohorte.\n\n' +
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
  const graduadas = ss.getSheetByName('Graduadx');

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

      // Orden Graduadx: Fecha, CreamosID, DPI, Nombre, Tel, NivelEdu, Cohorte, Notas
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

      // Marcar como Graduada en la hoja de cohorte (NO eliminar — la hoja queda como archivo)
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
    enviarEmailListaGraduadx(nombreCohorte, listaParaEmail);
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
  const graduadas = ss.getSheetByName('Graduadx');

  const datos = sheet.getRange(fila, 1, 1, 10).getValues()[0];
  const fechaGraduacion = new Date();

  // Si no tiene Creamos ID, agregar nota
  const notaID = datos[2] ? '' : '⚠️ Sin Creamos ID — verificar en Salesforce';

  const nuevaFilaGrad = graduadas.getLastRow() + 1;

  // Orden Graduadx: Fecha, CreamosID, DPI, Nombre, Género, Tel, NivelEdu, Cohorte, Notas
  const registroGraduada = [
    fechaGraduacion,
    datos[2] || '',     // Creamos ID (puede estar vacío)
    datos[3],           // DPI
    datos[4],           // Nombre
    datos[5] || '',     // Género
    datos[7],           // Teléfono
    datos[8],           // Nivel Educativo
    nombreCohorte,
    notaID              // Notas (alerta si falta ID)
  ];

  graduadas.getRange(nuevaFilaGrad, 1, 1, 9).setValues([registroGraduada]);

  // Enviar automáticamente al archivo externo de seguimiento
  enviarAArchivoSeguimiento(datos[2], datos[4], datos[7], datos[8], nombreCohorte);

  // Marcar como Graduada en la hoja de cohorte (NO eliminar — queda como archivo)
  sheet.getRange(fila, 10).setValue('Graduada');
  sheet.getRange(fila, 1, 1, 10).setBackground('#e8f5e9'); // Verde claro = graduada

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
 * Llamable desde menú (reenviarDesdeMenuCohorte) o internamente.
 */
/**
 * Reenvía al archivo externo todos los participantes "Graduada" de una cohorte.
 * Hace UNA SOLA apertura del archivo externo y UNA SOLA escritura en batch
 * para evitar fallos por cuotas o caché de getLastRow().
 *
 * @param {string}  nombreCohorte  - Nombre de la cohorte
 * @param {Sheet}   hojaCohorte    - Hoja de la cohorte (o usa activeSheet si es null)
 * @param {boolean} silencioso     - Si true, muestra sólo toast (no alerta modal)
 * @returns {number} - Cantidad de participantes enviadas
 */
function reenviarCohorteAlSeguimiento(nombreCohorte, hojaCohorte, silencioso) {
  const ss  = SpreadsheetApp.getActiveSpreadsheet();
  const ui  = SpreadsheetApp.getUi();
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
  const datosCohorte  = hojaCohorte.getDataRange().getValues();
  const fechaEnvio    = new Date();
  let   sigNo         = ultimaFilaExterna; // No. secuencial (fila 2 = No.1 → No = filaExterna - 1)
  const nuevasFilas   = [];
  let   omitidas      = 0;

  for (let i = 1; i < datosCohorte.length; i++) {
    const fila = datosCohorte[i];
    if (!fila[4] || fila[8] !== 'Graduada') continue; // sólo filas con nombre y estado Graduada

    const creamosId = fila[2] ? fila[2].toString().trim() : '';
    const nombre    = fila[4].toString().trim();

    // Saltar si ya existe en el archivo externo
    if ((creamosId && yaRegistrados.has(creamosId)) || yaRegistrados.has(nombre)) {
      omitidas++;
      continue;
    }

    const entrev = buscarEntrevista(creamosId);
    sigNo++;

    nuevasFilas.push([
      sigNo - 1,           //  1: No. (= filaAbsoluta - 1 para que empiece en 1)
      fechaEnvio,          //  2: Fecha de envío
      creamosId || '',     //  3: Creamos ID
      nombre,              //  4: Nombre completo
      fila[6] || '',       //  5: Número de teléfono
      fila[7] || '',       //  6: Formación (Nivel Educativo)
      nombreCohorte,       //  7: Cohorte
      entrev.fecha,        //  8: Fecha de entrevista
      entrev.entrevistador,//  9: Entrevistador
      'Aprobada',          // 10: Resultado entrevista
      '', '', '', '', '',  // 11-15: Siguiente paso, Clasificación, Empleado, Próxima llamada, Notas
      'Graduada'           // 16: Etapa
    ]);

    // Registrar en el Set para no duplicar dentro del mismo batch
    yaRegistrados.add(nombre);
    if (creamosId) yaRegistrados.add(creamosId);
  }

  // ── Escritura en UN SOLO bloque ────────────────────────────────────────────
  if (nuevasFilas.length > 0) {
    const filaInicio = ultimaFilaExterna + 1;
    hojaSeg.getRange(filaInicio, 1, nuevasFilas.length, nuevasFilas[0].length)
           .setValues(nuevasFilas);
    SpreadsheetApp.flush(); // Forzar escritura antes de retornar
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
  const hojasPrincipales = ['Hoja de Interés', 'Entrevistas', 'Inscritx', 'Cohortes',
                            'Graduadx', 'Retiradx', 'No Inscritx', 'Reporte',
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
  const rangoNombre = hojaCohorte.getRange('E2:E200');
  const rangoID = hojaCohorte.getRange('C2:C200');

  // Resaltar Creamos ID vacío cuando hay nombre: fórmula =AND(E2<>"",C2="")
  const reglaIDVacio = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND($E2<>"",$C2="")')
    .setBackground('#ffe0b2')  // Naranja claro
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
    // 1. Lista Definitiva
    if (!ss.getSheetByName('Lista Definitiva')) {
      crearHojaListaDefinitiva();
      cambios.push('✅ Hoja "Lista Definitiva" creada');
    } else {
      cambios.push('ℹ️ "Lista Definitiva" ya existía');
    }

    // 2. Limpiar cohortes sin hoja
    const eliminadas = limpiarCohortesEliminadas(true);
    if (eliminadas > 0) {
      cambios.push('✅ ' + eliminadas + ' cohorte(s) eliminadas del registro');
    }

    // 3. Validaciones
    configurarValidaciones();
    cambios.push('✅ Validaciones actualizadas');

    // 4. Fórmulas
    repararFormulas();
    cambios.push('✅ Fórmulas de Cohortes corregidas');

    // 5. Aplicar formato a todas las hojas de cohorte actuales
    const hojasPrincipales = ['Hoja de Interés', 'Entrevistas', 'Inscritx', 'Cohortes',
                              'Graduadx', 'Retiradx', 'No Inscritx', 'Reporte',
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

// Función procesarCambioEstadoParticipante eliminada - ya no hay Estado en Inscritx

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
 * Importa DATOS HISTÓRICOS desde KoboToolbox (solo Tecnología)
 * URL FIJA de datos históricos que NO cambia
 */
function importarDatosHistoricos() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  // URL FIJA de datos históricos
  const url = 'https://kf.kobotoolbox.org/api/v2/assets/akz5K2bGfvvisQaE7VaHev/export-settings/esuV4RKqQhYUUaUizfWBP8S/data.csv';

  importarDesdeKoboInterno(ss, ui, url, '📥 DATOS HISTÓRICOS');
}

/**
 * Importa SOLO DATOS NUEVOS desde KoboToolbox (se actualiza cada 10 minutos)
 * URL FIJA de datos nuevos que se actualiza automáticamente
 */
function importarDesdeKobo() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  // URL FIJA de datos nuevos (actualizada cada 10 minutos)
  const url = 'https://kf.kobotoolbox.org/api/v2/assets/auvEELWQEgiwF54W4pGpV5/export-settings/eseYzEgWw6Tui9y2eppZy3L/data.csv';

  importarDesdeKoboInterno(ss, ui, url, '📥 DATOS NUEVOS');
}

/**
 * Función interna que realiza la importación desde cualquier URL de Kobo
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
function importarDesdeKoboInterno(ss, ui, url, tipoImportacion)

  try {
    ss.toast(tipoImportacion + ' - Descargando...', 'Importando', 5);

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

      // Género
      genero: buscarIndiceColumnaExacto(headers, [
        'Inicio/Género',
        'Género',
        'genero',
        'Inicio/¿Cómo te identificas en cuestiones de género?',
        '¿Cómo te identificas en cuestiones de género?'
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
        'Nivel educativo',
        'Inicio/¿Cuál es su último nivel de estudios terminado?',
        '¿Cuál es su último nivel de estudios terminado?',
        'Nivel de estudios',
        'Estudios',
        'Escolaridad'
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

    // Leer columna E completa de una sola vez (evita llamadas individuales en el loop)
    // y construir lista de filas vacías disponibles para insertar sin huecos ni sobreescrituras
    let maxFilasHoja = hojaInteres.getMaxRows();
    const colESnapshot = hojaInteres.getRange(2, 5, maxFilasHoja - 1, 1).getValues().flat();
    // filaVaciaIdx: puntero al siguiente slot vacío en colESnapshot
    let filaVaciaIdx = 0;
    // Función que devuelve el número de fila (1-based) del siguiente slot vacío
    function siguienteFilaVacia() {
      while (filaVaciaIdx < colESnapshot.length &&
             colESnapshot[filaVaciaIdx] !== '' && colESnapshot[filaVaciaIdx] !== null) {
        filaVaciaIdx++;
      }
      if (filaVaciaIdx >= colESnapshot.length) {
        // Ampliar hoja si se agotaron las filas
        hojaInteres.insertRowsAfter(maxFilasHoja, 200);
        maxFilasHoja += 200;
        for (let ext = 0; ext < 200; ext++) colESnapshot.push('');
      }
      return filaVaciaIdx + 2; // +2: array[0] = fila 2
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
      const esMarketing = servicioTexto.includes('tecnología - marketing') || servicioTexto.includes('tecnologia - marketing') || servicioTexto.includes('marketing digital');
      const esProgramacion = servicioTexto.includes('tecnología - programación') || servicioTexto.includes('tecnologia - programacion') || servicioTexto.includes('programación') || servicioTexto.includes('programacion');
      const esAlfabetizacion = servicioTexto.includes('alfabetización digital') || servicioTexto.includes('alfabetizacion digital');
      const esCertificacion = servicioTexto.includes('certificación microsoft') || servicioTexto.includes('certificacion microsoft');
      const esServicioCliente = servicioTexto.includes('servicio al cliente') || servicioTexto.includes('atención al cliente') || servicioTexto.includes('atencion al cliente');

      // Si no tiene ningún programa de tecnología, omitir
      if (!esMarketing && !esProgramacion && !esAlfabetizacion && !esCertificacion && !esServicioCliente) {
        omitidosNoTech++;
        continue; // Saltar si no es Tech
      }

      // Obtener Creamos ID y DPI - CONVERTIR A MAYÚSCULAS
      const creamosId = colIndices.creamosId >= 0 ? fila[colIndices.creamosId].toString().trim().toUpperCase() : '';
      const dpi = colIndices.dpi >= 0 ? fila[colIndices.dpi].toString().trim() : '';

      // Construir nombre completo (necesario para la verificación de duplicados)
      const nombres = colIndices.nombres >= 0 ? fila[colIndices.nombres].toString().trim() : '';
      const apellidos = colIndices.apellidos >= 0 ? fila[colIndices.apellidos].toString().trim() : '';
      const nombreCompleto = (nombres + ' ' + apellidos).trim();

      // Obtener género
      const genero = colIndices.genero >= 0 ? fila[colIndices.genero].toString().trim() : '';

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

      // Determinar notas de programas seleccionados
      let programasSeleccionados = [];
      if (esMarketing) programasSeleccionados.push('Marketing');
      if (esProgramacion) programasSeleccionados.push('Programación');
      if (esAlfabetizacion) programasSeleccionados.push('Alfabetización Digital');
      if (esCertificacion) programasSeleccionados.push('Certificación Microsoft');
      if (esServicioCliente) programasSeleccionados.push('Servicio al Cliente');

      const notasPrograma = 'Kobo: ' + programasSeleccionados.join(', ');

      // Obtener datos de las preguntas de Inclusión Laboral
      const deseaInscribirse = colIndices.deseaInscribirse >= 0 ?
        (fila[colIndices.deseaInscribirse] || '').toString().trim() : '';
      const servicioFormacion = colIndices.servicioInteres >= 0 ?
        (fila[colIndices.servicioInteres] || '').toString().trim() : '';

      // Extender la hoja si nuevaFila supera el número de filas disponibles
      // Obtener la siguiente fila realmente vacía (sin huecos ni sobreescrituras)
      const nuevaFila = siguienteFilaVacia();
      colESnapshot[filaVaciaIdx] = nombreCompleto; // marcar como ocupada en memoria
      filaVaciaIdx++;

      // Limpiar validaciones solo en columnas intermedias (C-O) para no borrar
      // el dropdown de Estado (columna P) ni las protecciones de A y B
      hojaInteres.getRange(nuevaFila, 3, 1, 13).clearDataValidations();

      // Usar fecha de Kobo si existe; si no, poner fecha de hoy como valor fijo
      const fechaParaHoja = fechaRegistroKobo || new Date();

      // Preparar registro
      const registro = [
        fechaParaHoja,     // A: Fecha Registro (valor fijo, no fórmula dinámica)
        '',                // B: No. (fórmula automática)
        creamosId,         // C: Creamos ID
        dpi,               // D: DPI
        nombreCompleto,    // E: Nombre Completo
        genero,            // F: Género
        edad,              // G: Edad
        telefono,          // H: Teléfono
        nivelEducativo,    // I: Nivel Educativo
        zona,              // J: Zona
        comoSeEntero,      // K: Cómo se enteró
        '',                // L: Responsable
        notasPrograma,     // M: Notas
        deseaInscribirse,  // N: ¿Deseas inscribirte?
        servicioFormacion, // O: Servicio/Formación de Interés
        ''                 // P: Estado (vacío para que el dropdown funcione)
      ];

      hojaInteres.getRange(nuevaFila, 1, 1, 16).setValues([registro]);

      // Restaurar fórmula de No. (columna B) que setValues sobreescribe
      hojaInteres.getRange('B' + nuevaFila).setFormula('=IF(E' + nuevaFila + '<>"",COUNTA($E$2:E' + nuevaFila + '),"")');

      // Restaurar dropdown de Género (columna F) para esta fila
      hojaInteres.getRange(nuevaFila, 6).setDataValidation(
        SpreadsheetApp.newDataValidation()
          .requireValueInList(CONFIG.GENEROS)
          .setAllowInvalid(true)
          .build()
      );

      // Restaurar dropdown de Estado (columna P) para esta fila
      hojaInteres.getRange(nuevaFila, 16).setDataValidation(
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
      '🚫 No Tech (omitidos): ' + omitidosNoTech;

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

    // Limpiar BOM
    if (csvData.charCodeAt(0) === 0xFEFF) {
      csvData = csvData.substring(1);
    }

    // Detectar separador
    const primeraLinea = csvData.split('\n')[0];
    const countPuntoComa = (primeraLinea.match(/;/g) || []).length;
    const countComas = (primeraLinea.match(/,/g) || []).length;
    const separador = countPuntoComa > countComas ? ';' : ',';

    // Parsear CSV
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
    Logger.log('Headers entrevistas: ' + headers.join(' | '));

    // Mapeo de columnas de Kobo a nuestra hoja
    // Buscar índices de las columnas importantes
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

    Logger.log('Mapeo de columnas: ' + JSON.stringify(colMap));

    // Obtener hoja destino
    let detalleSheet = ss.getSheetByName('Detalle Entrevistas');
    if (!detalleSheet) {
      crearHojaDetalleEntrevistas();
      detalleSheet = ss.getSheetByName('Detalle Entrevistas');
    }

    // Obtener IDs existentes para evitar duplicados
    const datosExistentes = detalleSheet.getDataRange().getValues();
    const idsExistentes = new Set();
    for (let i = 1; i < datosExistentes.length; i++) {
      if (datosExistentes[i][1]) {
        idsExistentes.add(datosExistentes[i][1].toString().trim());
      }
    }

    // Procesar cada fila
    let importados = 0;
    let duplicados = 0;

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const creamosId = colMap.creamosId >= 0 ? (row[colMap.creamosId] || '').toString().trim() : '';

      if (!creamosId) continue;

      // Verificar duplicados
      if (idsExistentes.has(creamosId)) {
        duplicados++;
        continue;
      }

      // Función helper para obtener valor seguro
      const getVal = (idx) => idx >= 0 && row[idx] ? row[idx].toString().trim() : '';

      // Crear registro para Detalle Entrevistas (53 columnas)
      const registro = [
        new Date(),                                    // A: Fecha Importación
        creamosId,                                     // B: Creamos ID
        getVal(colMap.nombre),                         // C: Nombre
        getVal(colMap.genero),                         // D: Género
        getVal(colMap.gruposDiversos),                 // E: Grupos Diversos
        getVal(colMap.gruposMixtos),                   // F: Grupos Mixtos
        getVal(colMap.expGruposMixtos),                // G: Experiencia Grupos Mixtos
        getVal(colMap.formacionPrevia),                // H: Formación Previa
        getVal(colMap.dondeFormacion),                 // I: Dónde Formación
        getVal(colMap.tieneCertificado),               // J: Tiene Certificado
        getVal(colMap.cualCertificado),                // K: Cuál Certificado
        getVal(colMap.sectorInteres),                  // L: Sector Interés
        getVal(colMap.proyectoInteres),                // M: Proyecto Interés
        getVal(colMap.dificultadesCurso),              // N: Dificultades Curso
        getVal(colMap.areasVida),                      // O: Áreas Vida Cambiarán
        getVal(colMap.porQueInteres),                  // P: Por Qué Interesa Curso
        getVal(colMap.firmarDocumento),                // Q: Firmar Documento
        getVal(colMap.disponibilidadPracticas),        // R: Disponibilidad Prácticas
        getVal(colMap.trabajarSector),                 // S: Trabajar en Sector
        getVal(colMap.horariosDemanantes),             // T: Horarios Demandantes
        getVal(colMap.comentariosCurso),               // U: Comentarios Curso
        getVal(colMap.ayudaEconomica),                 // V: Ayuda Económica
        '',                                            // W: Comentario Ayuda
        getVal(colMap.dependientesEcon),               // X: Dependientes Económicos
        '',                                            // Y: Comentario Dependientes
        getVal(colMap.responsabilidadesCuidado),       // Z: Responsabilidades Cuidado
        '',                                            // AA: Comentario Cuidado
        '',                                            // AB: Otros Comentarios Económicos
        getVal(colMap.tieneTransporte),                // AC: Tiene Transporte
        getVal(colMap.planTraslado),                   // AD: Plan Traslado
        getVal(colMap.deudasBancarias),                // AE: Deudas Bancarias
        getVal(colMap.antecedentesManchados),          // AF: Antecedentes Manchados
        '',                                            // AG: Comentario Antecedentes
        getVal(colMap.tramitesPenales),                // AH: Trámites Penales
        getVal(colMap.tallaZapato),                    // AI: Talla Zapato
        getVal(colMap.movilizarseZona),                // AJ: Movilizarse Cualquier Zona
        '',                                            // AK: Comentarios Operarios
        '',                                            // AL: Comentario Previo Género
        getVal(colMap.conoceVBG),                      // AM: Conoce VBG
        '',                                            // AN: Grupos Mixtos Género
        '',                                            // AO: Grupos Diversos Género
        '',                                            // AP: Comentario Género
        getVal(colMap.conflictosCasa),                 // AQ: Conflictos Casa
        '',                                            // AR: Comentario Conflictos
        getVal(colMap.grupoMujeres),                   // AS: Grupo Mayormente Mujeres
        getVal(colMap.igualdadHM),                     // AT: Igualdad Hombres Mujeres
        getVal(colMap.familiaresCreamos),              // AU: Familiares Creamos
        getVal(colMap.nombresFamiliares),              // AV: Nombres Familiares
        getVal(colMap.formalInformal),                 // AW: Formal o Informal
        getVal(colMap.conoceViolenciaMujer),             // AX: Conoce Violencia Mujer
        getVal(colMap.aprenderPractica),               // AY: ¿Te interesa aprender para práctica en trabajo?
        'No'                                           // AZ: Vinculado
      ];

      const nuevaFila = detalleSheet.getLastRow() + 1;
      detalleSheet.getRange(nuevaFila, 1, 1, registro.length).setValues([registro]);
      idsExistentes.add(creamosId);
      importados++;
    }

    // Vincular con hoja Entrevistas
    vincularEntrevistasConDetalle();

    ss.toast('✅ Importados: ' + importados + ' | Duplicados: ' + duplicados, 'Importación Completa', 5);
    Logger.log('Entrevistas importadas: ' + importados + ', duplicados: ' + duplicados);

  } catch (error) {
    ss.toast('❌ Error: ' + error.message, 'ERROR', 5);
    Logger.log('Error importando entrevistas: ' + error.message);
  }
}

/**
 * Busca el índice de una columna por nombre parcial (case insensitive)
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
 * Actualiza datos complementarios usando Creamos ID como clave
 */
function vincularEntrevistasConDetalle() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const entrevistasSheet = ss.getSheetByName('Entrevistas');
  const detalleSheet = ss.getSheetByName('Detalle Entrevistas');

  if (!entrevistasSheet || !detalleSheet) return;

  const entrevistas = entrevistasSheet.getDataRange().getValues();
  const detalles = detalleSheet.getDataRange().getValues();

  // Crear mapa de detalles por Creamos ID
  const detalleMap = new Map();
  for (let i = 1; i < detalles.length; i++) {
    const id = detalles[i][1] ? detalles[i][1].toString().trim() : '';
    if (id) {
      detalleMap.set(id, { fila: i + 1, datos: detalles[i] });
    }
  }

  // Actualizar columna "Vinculado" en Detalle Entrevistas
  for (let i = 1; i < entrevistas.length; i++) {
    const idEntrevista = entrevistas[i][2] ? entrevistas[i][2].toString().trim() : ''; // Columna C
    if (idEntrevista && detalleMap.has(idEntrevista)) {
      const info = detalleMap.get(idEntrevista);
      // Marcar como vinculado (columna BA = 53)
      detalleSheet.getRange(info.fila, 53).setValue('Sí');
    }
  }

  Logger.log('Vinculación completada');
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
    'Ingresa el NOMBRE de la nueva cohorte:\n\nEjemplos: "SAC Cohorte III", "Computación Cohorte II"',
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

  // Orden: Nombre, Proyecto, FechaInicio, FechaFin, Responsable, Cupo, Inscritas(formula), Graduadx(formula), Retiradx(formula), Ubicación, Horario, Notas, Estado
  const datosCohorte = [nombre, 'Tecnología', fechaInicio, fechaFin, responsable, cupo, '', '', '', '', '', '', estadoInicial];
  cohortes.getRange(nuevaFila, 1, 1, 13).setValues([datosCohorte]);

  // Fórmulas: Inscritas cuenta en la hoja individual de la cohorte (resta deserciones)
  cohortes.getRange('G' + nuevaFila).setFormula('=IF(A' + nuevaFila + '="",0,IFERROR(COUNTIF(INDIRECT("\'"&A' + nuevaFila + '&"\'!E:E"),"<>")-1-COUNTIF(INDIRECT("\'"&A' + nuevaFila + '&"\'!I:I"),"Deserción"),0))');
  cohortes.getRange('H' + nuevaFila).setFormula('=IFERROR(COUNTIF(Graduadx!G:G,A' + nuevaFila + '),0)');
  cohortes.getRange('I' + nuevaFila).setFormula('=IFERROR(COUNTIF(Retiradx!G:G,A' + nuevaFila + '),0)');

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
    'Género',           // F
    'Edad',             // G
    'Teléfono',         // H
    'Nivel Educativo',  // I
    'Estado'            // J - Solo opción "Deserción"
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#4caf50')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Anchos de columna
  [120, 50, 100, 130, 200, 120, 60, 120, 150, 100].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });

  // Desplegable Estado con "Graduada" y "Deserción"
  sheet.getRange('J2:J100').setDataValidation(
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

  const seleccionadas = ss.getSheetByName('Inscritx');
  const datosInscritx = seleccionadas.getDataRange().getValues();

  const idsSeleccionados = new Set();
  for (let i = 1; i < datosInscritx.length; i++) {
    if (datosInscritx[i][1]) idsSeleccionados.add(datosInscritx[i][1].toString().trim());
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
      mensaje += '   Graduadx: ' + graduadas + '\n';
      mensaje += '   Retiradx: ' + deserciones + '\n';
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

  const hojas = ['Hoja de Interés', 'Entrevistas', 'Inscritx', 'Cohortes', 'Asistencias', 'Graduadx', 'Retiradx', 'No Inscritx'];
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
      fH.push(['=IFERROR(COUNTIF(Graduadx!G:G,A' + i + '),0)']);
      fI.push(['=IFERROR(COUNTIF(Retiradx!G:G,A' + i + '),0)']);
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
  // Orden: Fecha, No, CreamosID, DPI, Nombre, Género, Edad, Teléfono, NivelEducativo, Zona, ComoSeEntero, Responsable, Notas, DeseaInscribirse, ServicioFormacion, Estado
  // Estado vacío para que usuario elija "Entrevista agendada" o "No interesado"
  const datosPrueba = [
    ['', '', 'CR001', '1234567890101', 'María García', 'Mujer / Femenino', '22', '5555-1234', 'Diversificado completo', 'Zona 1', 'Redes', 'Adrian Torres', '', '', '', ''],
    ['', '', 'CR002', '2345678901212', 'Ana Martínez', 'Mujer / Femenino', '25', '5555-5678', 'Universitario', 'Zona 7', 'Referido', 'Paola Ortiz', '', '', '', ''],
    ['', '', 'CR003', '3456789012323', 'Laura López', 'Mujer / Femenino', '19', '5555-9012', 'Básicos completos', 'Mixco', 'Facebook', 'Adrian Torres', '', '', '', '']
  ];
  interes.getRange(2, 1, 3, 16).setValues(datosPrueba);
  ss.toast('✅ 3 registros creados', 'OK', 4);
}

function limpiarTodosLosDatos() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const resp = SpreadsheetApp.getUi().alert('⚠️ CONFIRMAR', '¿Eliminar TODOS los datos?', SpreadsheetApp.getUi().ButtonSet.YES_NO);
  if (resp !== SpreadsheetApp.getUi().Button.YES) return;

  const hojas = ['Hoja de Interés', 'Entrevistas', 'Inscritx', 'Graduadx', 'Retiradx', 'No Inscritx', 'Reportes Mensuales'];
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

/**
 * Limpia filas vacías en la Hoja de Interés
 * Elimina filas que tienen fórmulas pero no tienen datos reales (sin nombre en columna E)
 * Esto arregla el problema de numeración cuando hay filas vacías entre registros
 */
function limpiarFilasVaciasHojaInteres() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  const hoja = ss.getSheetByName('Hoja de Interés');

  if (!hoja) {
    ui.alert('⚠️ Error', 'No se encontró la hoja "Hoja de Interés"', ui.ButtonSet.OK);
    return;
  }

  const resp = ui.alert(
    '🧹 Limpiar Filas Vacías',
    'Esta acción eliminará las filas que no tienen nombre en la columna "Nombre Completo".\n\n' +
    'Esto arreglará la numeración y eliminará las filas vacías.\n\n' +
    '¿Continuar?',
    ui.ButtonSet.YES_NO
  );

  if (resp !== ui.Button.YES) return;

  ss.toast('🧹 Limpiando filas vacías...', 'Limpieza', 3);

  const ultimaFila = hoja.getLastRow();
  let filasEliminadas = 0;

  // Recorrer desde la última fila hacia arriba para no afectar los índices
  for (let i = ultimaFila; i >= 2; i--) {
    const nombreCompleto = hoja.getRange(i, 5).getValue(); // Columna E = 5

    // Si la celda de nombre está vacía, eliminar toda la fila
    if (!nombreCompleto || nombreCompleto.toString().trim() === '') {
      hoja.deleteRow(i);
      filasEliminadas++;
    }
  }

  // Reinstalar las fórmulas en las primeras 100 filas después de la última con datos
  const nuevaUltimaFila = hoja.getLastRow();
  const maxFila = nuevaUltimaFila + 100;

  for (let i = nuevaUltimaFila + 1; i <= maxFila; i++) {
    hoja.getRange('A' + i).setFormula('=IF(E' + i + '<>"",TODAY(),"")');
    hoja.getRange('B' + i).setFormula('=IF(E' + i + '<>"",COUNTA($E$2:E' + i + '),"")');
  }

  ui.alert(
    '✅ Limpieza Completada',
    'Se eliminaron ' + filasEliminadas + ' filas vacías.\n\n' +
    'La numeración ahora debería estar correcta.',
    ui.ButtonSet.OK
  );

  ss.toast('✅ Filas vacías eliminadas: ' + filasEliminadas, 'Completado', 5);
}

// =====================================================================
// HOJA "Copy of CREAMOS ID nuevo" - DIRECTORIO MAESTRO DE PARTICIPANTES
// Conectada con Salesforce. NUNCA eliminar. Siempre oculta y protegida.
// Columnas: Nombre completo | Creamos ID | Año que entró Creamos | Age | Numero de DPI
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
    const nombre   = f[0] ? f[0].toString().trim() : '';
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

      if (colMap.nombre   >= 0 && !nom && nombreDir) { sheet.getRange(filaNum, colMap.nombre   + 1).setValue(nombreDir);  actualizado = true; }
      if (colMap.creamosId >= 0 && !cId && cIdDir)  { sheet.getRange(filaNum, colMap.creamosId + 1).setValue(cIdDir);     actualizado = true; }
      if (colMap.dpi      >= 0 && !dpi && dpiDir)   { sheet.getRange(filaNum, colMap.dpi      + 1).setValue(dpiDir);      actualizado = true; }
      if (colMap.edad     >= 0 && !ed  && edadDir)  { sheet.getRange(filaNum, colMap.edad     + 1).setValue(edadDir);     actualizado = true; }

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

  // Inscritx: B[1]=CreamosID, C[2]=DPI, D[3]=Nombre, E[4]=Edad
  ss.toast('🔄 Actualizando Inscritx...', 'Actualizando', 4);
  total += completarHoja(ss.getSheetByName('Inscritx'),
    { creamosId: 1, dpi: 2, nombre: 3, edad: 4 });

  // No Inscritx: B[1]=CreamosID, C[2]=Nombre (sin DPI ni Edad)
  ss.toast('🔄 Actualizando No Inscritx...', 'Actualizando', 4);
  total += completarHoja(ss.getSheetByName('No Inscritx'),
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
      'Mensaje automático — Sistema de Inclusión Laboral Tecnología';

    const destinatarios = [emailEva];
    if (emailNotif && emailNotif !== emailEva) destinatarios.push(emailNotif);
    MailApp.sendEmail(destinatarios.join(','), asunto, cuerpo);
    Logger.log('✅ Email deserción enviado a: ' + destinatarios.join(', '));
  } catch (e) {
    Logger.log('Error email deserción Eva: ' + e.message);
  }
}

function enviarEmailListaGraduadx(nombreCohorte, listaGraduadx) {
  try {
    if (!listaGraduadx || listaGraduadx.length === 0) return;
    const emailEva   = obtenerEmailEva();
    const emailNotif = obtenerEmailConfiguracion();
    const fecha = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');

    const asunto = '🎓 Graduación completada — ' + nombreCohorte + ' (' + listaGraduadx.length + ' participantes)';

    let listaTexto = '';
    listaGraduadx.forEach(function(p, idx) {
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
      'Total graduadas:  ' + listaGraduadx.length + ' participantes\n' +
      '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
      'LISTA DE GRADUADAS:\n\n' +
      listaTexto +
      '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
      '⚠️ ACCIÓN REQUERIDA EN SALESFORCE:\n' +
      'Por favor, actualiza la etapa de TODAS las participantes listadas a "Graduada"\n' +
      'para mantener el CRM al día.\n\n' +
      'Mensaje automático — Sistema de Inclusión Laboral Tecnología';

    const destinatarios = [emailEva];
    if (emailNotif && emailNotif !== emailEva) destinatarios.push(emailNotif);
    MailApp.sendEmail(destinatarios.join(','), asunto, cuerpo);
    SpreadsheetApp.getActiveSpreadsheet().toast(
      '📧 Email con ' + listaGraduadx.length + ' graduadas enviado a Eva', 'Email', 5);
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

  // B28: Participantes activas en cohortes (antes era =B11, que solo mostraba Inscritx)
  reporte.getRange('B28').setFormula(
    '=IFERROR(SUMIF(Cohortes!A:A,"<>",Cohortes!G:G)' +
    '-SUMIF(Cohortes!A:A,"<>",Cohortes!H:H)' +
    '-SUMIF(Cohortes!A:A,"<>",Cohortes!I:I),0)'
  );

  // B26: Total personas atendidas (incluye todas las etapas activas + históricas)
  reporte.getRange('B26').setFormula('=B5+B8+B11+B28+B17+B20+B23');

  // C8: Entrevistas pendientes (solo filas con nombre Y sin resultado — evita contar celdas vacías)
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
    '✓ Reparar fórmulas del Reporte\n' +
    '✓ Crear Guía de Uso (si no existe)\n\n' +
    'ℹ️ Importación de Kobo: usar menú después\n' +
    '⚠️ NO se borrará "Copy of CREAMOS ID nuevo"\n' +
    '⚠️ NO se borrarán datos existentes\n\n' +
    '¿Deseas continuar?',
    ui.ButtonSet.YES_NO
  );

  if (confirmacion !== ui.Button.YES) return;

  const cambios = [];

  try {
    // 1. Crear hojas del sistema (respeta las existentes y CREAMOS ID)
    ss.toast('📋 Verificando hojas del sistema...', 'Instalando', 5);
    crearTodasLasHojas();
    cambios.push('✅ Hojas del sistema verificadas');

    // 2. Lista Definitiva
    if (!ss.getSheetByName('Lista Definitiva')) {
      crearHojaListaDefinitiva();
      cambios.push('✅ Hoja Lista Definitiva creada');
    }

    // 3. Crear Guía de Uso solo si no existe (para que sea más rápido)
    if (!ss.getSheetByName('Guía de Uso')) {
      ss.toast('📖 Creando Guía de Uso...', 'Instalando', 5);
      crearHojaGuiaUso();
      cambios.push('✅ Guía de Uso creada');
    }

    // 4. Validaciones
    ss.toast('✅ Configurando validaciones...', 'Instalando', 5);
    configurarValidaciones();
    cambios.push('✅ Validaciones configuradas');

    // 5. Formatos
    ss.toast('🎨 Aplicando formatos...', 'Instalando', 5);
    aplicarFormatos();
    cambios.push('✅ Formatos aplicados');

    // 6. Fórmulas
    ss.toast('🔧 Instalando fórmulas...', 'Instalando', 5);
    repararFormulas();
    cambios.push('✅ Fórmulas instaladas y reparadas');

    // 7. Formato en hojas de cohorte existentes
    const hojasPrincipales = ['Hoja de Interés', 'Entrevistas', 'Inscritx', 'Cohortes',
      'Graduadx', 'Retiradx', 'No Inscritx', 'Reporte',
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

    // 8. Limpiar cohortes huérfanas del desplegable
    const eliminadas = limpiarCohortesEliminadas(true);
    if (eliminadas > 0) cambios.push('✅ ' + eliminadas + ' cohorte(s) huérfanas limpiadas');

    // 9. Triggers
    ss.toast('⏰ Instalando triggers automáticos...', 'Instalando', 5);
    instalarTriggers();
    cambios.push('✅ Triggers automáticos instalados');

    // SALTAR IMPORTACIÓN AUTOMÁTICA - El usuario la hará manualmente para que sea más rápido
    cambios.push('ℹ️ Importación de Kobo: Usar menú después de instalación');

    // Actualizar reporte final
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
  const GRIS_CLARO   = '#f5f5f5';
  const BLANCO       = '#ffffff';

  const filas = [
    // 1 — Título principal
    ['GUÍA DE USO — SISTEMA DE INCLUSIÓN LABORAL TECNOLOGÍA', '', ''],
    // 2 — Subtítulo
    ['Versión 4  ·  Actualizada: ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy'), '', ''],
    // 3 — Espacio
    ['', '', ''],
    // 4 — Sección 1
    ['1. ¿QUÉ ES ESTE SISTEMA?', '', ''],
    // 5-7 — Descripción
    ['Este sistema de Google Sheets gestiona todo el ciclo de vida de las participantes del programa de Inclusión Laboral – Tecnología de CREAMOS.', '', ''],
    ['Desde que una persona se registra en KoboToolbox hasta que se gradúa, el sistema lleva el control de cada etapa y automatiza las notificaciones.', '', ''],
    ['', '', ''],
    // 8 — Sección 2
    ['2. FLUJO DE TRABAJO (paso a paso)', '', ''],
    // 9-17 — Pasos
    ['①', 'La persona completa el formulario de registro en KoboToolbox'],
    ['②', 'Usar menú: 📋 Importar Hoja de Interés (Kobo) → Los datos llegan a la hoja "Hoja de Interés"'],
    ['③', 'En "Hoja de Interés": cambiar columna Estado a "Entrevista Programada" → pasa automáticamente a "Entrevistas"'],
    ['④', 'En "Entrevistas": después de la entrevista, cambiar columna Resultado (col. I):'],
    ['  →', '"Aprobada"  →  pasa a hoja "Inscritx" automáticamente'],
    ['  →', '"No aprobada" / "No asistió"  →  pasa a "No Inscritx" automáticamente'],
    ['⑤', 'En "Inscritx": usar menú Cohortes → Enviar Participantes a Cohorte'],
    ['⑥', 'En la hoja de la cohorte: cambiar columna Estado (col. I):'],
    ['  →', '"Graduada"  →  pasa a "Graduadx" + se envía email automático a Eva con lista'],
    ['  →', '"Deserción"  →  pasa a "Retiradx" + se envía email automático a Eva con alerta Salesforce'],
    ['', '', ''],
    // 19 — Sección 3
    ['3. DESCRIPCIÓN DE CADA HOJA', '', ''],
    // 20 — Encabezado tabla
    ['HOJA', 'QUÉ CONTIENE / PARA QUÉ SIRVE'],
    // 21-33 — Hojas
    ['Hoja de Interés',          'Personas que se registraron y aún no han tenido entrevista. Primera etapa del flujo.'],
    ['Entrevistas',              'Personas con entrevista programada, pendientes de resultado. Segunda etapa.'],
    ['Inscritx',            'Personas aprobadas en entrevista, esperando ser asignadas a una cohorte. Tercera etapa.'],
    ['Cohortes',                 'Tabla resumen de todas las cohortes: nombre, programa, fechas, estadísticas automáticas.'],
    ['[Nombre de Cohorte]',      'Hoja individual por cohorte con la lista de participantes activas. Se crea al crear la cohorte.'],
    ['Graduadx',                'Registro histórico de todas las personas que completaron el programa.'],
    ['Retiradx',              'Registro de personas que abandonaron con fecha, cohorte y motivo.'],
    ['No Inscritx',         'Personas que no pasaron la entrevista o no quisieron continuar.'],
    ['Lista Definitiva',         'Vista consolidada de todos los registros activos en el sistema.'],
    ['Reporte',                  'Estadísticas generales del programa: totales por etapa, tasa de éxito, etc.'],
    ['Reportes Mensuales',       'Histórico de reportes guardados mes a mes (usar "Guardar Reporte Mensual").'],
    ['Detalle Entrevistas',      'Respuestas completas del formulario de entrevistas importadas desde Kobo.'],
    ['Guía de Uso',              'Esta hoja — instrucciones y documentación del sistema.'],
    ['Copy of CREAMOS ID nuevo', '⚠️ Hoja de Salesforce — sincronización automática. NO EDITAR NI BORRAR.'],
    ['Auto Refresh Execution Log','⚠️ Registro automático de sincronizaciones de Salesforce. NO BORRAR.'],
    ['', '', ''],
    // Sección 4
    ['4. OPCIONES DEL MENÚ  🎓 Inclusión Laboral', '', ''],
    ['OPCIÓN DE MENÚ', 'QUÉ HACE'],
    ['📋 Importar Hoja de Interés (Kobo)',    'Trae nuevos registros desde el formulario de registro de KoboToolbox. No duplica.'],
    ['🔁 Actualizar desde CREAMOS ID',        'Rellena automáticamente los Creamos IDs consultando la hoja maestra de Salesforce.'],
    ['📊 Actualizar Reportes',                'Recalcula todos los números del Reporte (también se actualiza automáticamente cada hora).'],
    ['💾 Guardar Reporte Mensual',            'Guarda una copia del reporte actual en la hoja "Reportes Mensuales" con fecha.'],
    ['➕ Crear Nueva Cohorte',               'Crea una nueva hoja de cohorte y la registra en la tabla Cohortes.'],
    ['📝 Ver/Editar Cohortes',               'Muestra el resumen de todas las cohortes.'],
    ['📊 Estadísticas por Cohorte',          'Estadísticas detalladas de una cohorte específica + opción para graduar toda la cohorte.'],
    ['👥 Enviar Participantes a Cohorte',    'Mueve personas seleccionadas de "Inscritx" a la cohorte que elijas.'],
    ['🚀 INSTALAR TODO (Completo)',          'Configura TODO el sistema de una sola vez: hojas, fórmulas, triggers, Kobo, guía.'],
    ['🆕 Actualizar v4',                    'Solo actualiza validaciones, fórmulas y formatos SIN borrar datos.'],
    ['🔧 Reparar Fórmulas',                 'Repara fórmulas de numeración, cohortes y el Reporte.'],
    ['🔗 URL Registros Kobo',               'Cambia la URL del formulario de registro en KoboToolbox.'],
    ['🔗 URL Entrevistas Kobo',             'Cambia la URL del formulario de entrevistas en KoboToolbox.'],
    ['📧 Configurar Email General',         'Cambia el email para notificaciones generales del sistema.'],
    ['📧 Configurar Email Eva',             'Configura el email específico de Eva para alertas de deserción y graduación.'],
    ['✉️ Probar Email',                     'Envía un email de prueba para verificar que el correo funcione.'],
    ['⏰ Instalar Triggers',               'Instala las automatizaciones que actualizan el sistema cada hora.'],
    ['📖 Ver Guía de Uso',                 'Navega directamente a esta hoja.'],
    ['', '', ''],
    // Sección 5
    ['5. ACCIONES EN HOJAS DE COHORTE', '', ''],
    ['Cada hoja de cohorte tiene una columna "Estado" (columna I). Al cambiar ese valor el sistema actúa automáticamente:', '', ''],
    ['ESTADO QUE SE ESCRIBE', 'QUÉ OCURRE AUTOMÁTICAMENTE'],
    ['Graduada',     'La participante se mueve a la hoja "Graduadx" + la fila queda verde en la cohorte'],
    ['Deserción',    'El sistema pide el motivo + la participante pasa a "Retiradx" + se envía email a Eva'],
    ['Para graduar TODA la cohorte de una vez:', 'Menú → Cohortes → Estadísticas por Cohorte → botón "Graduar toda la cohorte"', ''],
    ['', '', ''],
    // Sección 6
    ['6. CORREOS AUTOMÁTICOS', '', ''],
    ['CUÁNDO', 'A QUIÉN', 'CONTENIDO'],
    ['Al registrar una deserción',          'Eva + Email general',  'Nombre, cohorte, motivo + recordatorio de actualizar Salesforce'],
    ['Al graduar toda la cohorte',          'Eva + Email general',  'Lista completa de graduadas con Creamos IDs + recordatorio Salesforce'],
    ['Para configurar los emails:',         'Menú → ⚙️ Configuración → 📧 Configurar Email Eva', ''],
    ['', '', ''],
    // Sección 7
    ['7. HOJAS DE SALESFORCE — NO TOCAR', '', ''],
    ['"Copy of CREAMOS ID nuevo"',          'Reporte de Salesforce sincronizado automáticamente. El sistema usa esta hoja para rellenar Creamos IDs.'],
    ['"Auto Refresh Execution Log"',        'Registro de cuándo se sincronizó. Es normal que aparezca. NO borrar ni editar.'],
    ['⚠️ NUNCA borres estas hojas.',        'El sistema depende de ellas para los Creamos IDs y la integración con Salesforce.'],
    ['', '', ''],
    // Sección 8
    ['8. PREGUNTAS FRECUENTES', '', ''],
    ['PREGUNTA', 'RESPUESTA'],
    ['¿Por qué "Entrevistas realizadas" muestra 0?',
     '"Entrevistas" solo muestra entrevistas PENDIENTES. Al marcarlas Aprobada/No aprobada, se mueven y desaparecen. Es correcto.'],
    ['¿Cómo actualizo los datos de Kobo?',
     'Menú → 📋 Importar Hoja de Interés (Kobo). Solo trae registros nuevos, no duplica existentes.'],
    ['¿Puedo borrar filas manualmente?',
     'NO recomendado. Usa los botones del menú para mover personas entre etapas. Borrar manualmente omite emails y registros.'],
    ['¿Qué significa la celda naranja en Creamos ID?',
     'La participante no tiene Creamos ID asignado. Asígnalo en Salesforce y usa "Actualizar desde CREAMOS ID".'],
    ['¿Cada cuánto se actualiza automáticamente?',
     'Cada hora gracias a los triggers. También al abrir el archivo. Puedes forzarlo con "Actualizar Reportes".'],
    ['¿El email no llega?',
     'Verifica con Menú → ✉️ Probar Email. Si falla, revisa que el email esté bien configurado con 📧 Configurar Email Eva.'],
    ['¿Puedo tener más de una cohorte activa?',
     'Sí. Cada cohorte tiene su propia hoja. Puedes crear tantas como necesites con "Crear Nueva Cohorte".'],
    ['', '', '']
  ];

  // Escribir todo el contenido
  const maxCols = 3;
  const numFilas = filas.length;
  const data = filas.map(function(f) {
    while (f.length < maxCols) f.push('');
    return f.slice(0, maxCols);
  });
  sheet.getRange(1, 1, numFilas, maxCols).setValues(data);

  // ── Formateo ──────────────────────────────────────────────────────

  // Título principal
  sheet.getRange('A1:C1').merge().setBackground(AZUL_OSCURO).setFontColor('white')
    .setFontSize(16).setFontWeight('bold').setHorizontalAlignment('center');
  sheet.setRowHeight(1, 48);

  // Subtítulo
  sheet.getRange('A2:C2').merge().setBackground(AZUL_CLARO).setFontColor('#1a237e')
    .setFontSize(10).setHorizontalAlignment('center');

  // Función helper: marcar encabezado de sección
  function seccion(fila) {
    sheet.getRange('A' + fila + ':C' + fila)
      .merge().setBackground(AZUL_OSCURO).setFontColor('white')
      .setFontWeight('bold').setFontSize(12);
    sheet.setRowHeight(fila, 30);
  }

  // Función helper: marcar encabezado de tabla (fondo azul medio)
  function tablaHeader(fila) {
    sheet.getRange('A' + fila + ':C' + fila)
      .setBackground(AZUL_MEDIO).setFontColor('white').setFontWeight('bold');
  }

  // Marcar secciones
  seccion(4);   // ¿Qué es este sistema?
  seccion(8);   // Flujo de trabajo
  seccion(19);  // Descripción de hojas
  seccion(37);  // Opciones del menú
  seccion(57);  // Acciones en cohortes
  seccion(64);  // Correos automáticos
  seccion(71);  // Hojas Salesforce
  seccion(76);  // FAQ

  // Encabezados de tablas
  tablaHeader(20);  // Hojas
  tablaHeader(38);  // Menú
  tablaHeader(60);  // Cohortes-estado
  tablaHeader(67);  // Emails
  tablaHeader(78);  // FAQ

  // Colores alternos para filas de contenido de hojas (21-35)
  for (var r = 21; r <= 35; r++) {
    var bg = (r % 2 === 0) ? AZUL_CLARO : BLANCO;
    sheet.getRange('A' + r + ':C' + r).setBackground(bg);
  }
  // Alerta para las hojas de Salesforce
  sheet.getRange('A34:C34').setBackground('#fff3e0');
  sheet.getRange('A35:C35').setBackground('#fff3e0');

  // Colores alternos para menú (39-55)
  for (var rm = 39; rm <= 55; rm++) {
    var bgm = (rm % 2 === 0) ? AZUL_CLARO : BLANCO;
    sheet.getRange('A' + rm + ':C' + rm).setBackground(bgm);
  }

  // Sección correos
  sheet.getRange('A68:C68').setBackground(VERDE_CLARO);
  sheet.getRange('A69:C69').setBackground(VERDE_CLARO);

  // Sección Salesforce — alertas
  sheet.getRange('A72:C72').setBackground('#fff3e0');
  sheet.getRange('A73:C73').setBackground('#fff3e0');
  sheet.getRange('A74:C74').setBackground('#ffccbc').setFontWeight('bold');

  // FAQ alternos
  for (var rf = 79; rf <= 85; rf++) {
    var bgf = (rf % 2 === 0) ? AMARILLO : BLANCO;
    sheet.getRange('A' + rf + ':C' + rf).setBackground(bgf);
  }

  // Pasos del flujo (9-17) — fondo verde claro con ícono col A
  for (var rp = 9; rp <= 17; rp++) {
    sheet.getRange('A' + rp + ':C' + rp).setBackground(VERDE_CLARO);
    sheet.getRange('A' + rp).setFontWeight('bold');
  }

  // Anchos de columna
  sheet.setColumnWidth(1, 280);
  sheet.setColumnWidth(2, 400);
  sheet.setColumnWidth(3, 200);

  // Wrap text
  sheet.getRange(1, 1, numFilas, maxCols).setWrap(true);

  // Borde general
  sheet.getRange(1, 1, numFilas, maxCols)
    .setBorder(true, true, true, true, true, true, '#bbdefb', SpreadsheetApp.BorderStyle.SOLID);

  // Congelar primera fila
  sheet.setFrozenRows(1);

  Logger.log('✅ Guía de Uso creada');
}

/**
 * Asegura que la hoja CREAMOS ID esté oculta y protegida al abrir el archivo.
 * Se llama desde mantenimientoAutomatico().
 */
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

// =====================================================================
// FUNCIONES DE EXPORTACIÓN E HISTÓRICO
// =====================================================================

/**
 * Reconstruye la hoja "Lista Definitiva" con todos los datos históricos
 * Escanea todas las hojas de cohortes y agrega registros faltantes
 */
function reconstruirHistoricoCompleto() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const confirmacion = ui.alert(
    '🔄 Reconstruir Histórico Completo',
    'Esta función escaneará todas las hojas de cohortes y agregará a "Lista Definitiva" ' +
    'todos los registros que falten.\n\n' +
    '⚠️ NO eliminará datos existentes, solo agregará lo que falte.\n\n' +
    '¿Deseas continuar?',
    ui.ButtonSet.YES_NO
  );

  if (confirmacion !== ui.Button.YES) return;

  ss.toast('🔄 Reconstruyendo histórico...', 'Procesando', 30);

  // Crear Lista Definitiva si no existe
  if (!ss.getSheetByName('Lista Definitiva')) {
    crearHojaListaDefinitiva();
  }

  const listaDefinitiva = ss.getSheetByName('Lista Definitiva');
  const datosActuales = listaDefinitiva.getDataRange().getValues();

  // Crear un Set con los Creamos ID ya existentes en Lista Definitiva
  const idsExistentes = new Set();
  for (let i = 1; i < datosActuales.length; i++) {
    const creamosId = datosActuales[i][2]; // Columna C
    const cohorte = datosActuales[i][9]; // Columna J
    if (creamosId && cohorte) {
      idsExistentes.add(creamosId + '|' + cohorte); // Clave única: ID + Cohorte
    }
  }

  const hojasPrincipales = ['Hoja de Interés', 'Entrevistas', 'Inscritx', 'Cohortes',
                            'Graduadx', 'Retiradx', 'No Inscritx', 'Reporte',
                            'Reportes Mensuales', 'Lista Definitiva', 'Detalle Entrevistas',
                            'Guía de Uso'];

  let registrosAgregados = 0;
  const nuevosRegistros = [];

  // Escanear todas las hojas de cohortes
  ss.getSheets().forEach(function(hoja) {
    const nombreHoja = hoja.getName();

    // Saltar hojas principales y hojas de sistema
    if (hojasPrincipales.includes(nombreHoja) ||
        nombreHoja.startsWith('Copy of') ||
        nombreHoja === 'Auto Refresh Execution Log') {
      return;
    }

    // Esta es una hoja de cohorte
    const datos = hoja.getDataRange().getValues();

    // Saltar si no tiene datos (solo encabezados)
    if (datos.length <= 1) return;

    // Procesar cada fila de la cohorte
    for (let i = 1; i < datos.length; i++) {
      const fila = datos[i];

      // Columnas de hoja de cohorte: A-No, B-Fecha, C-CreamosID, D-DPI, E-Nombre, F-Edad, G-Tel, H-NivelEdu, I-Estado
      const creamosId = fila[2] ? fila[2].toString().trim() : '';
      const nombre = fila[4] ? fila[4].toString().trim() : '';

      // Saltar filas vacías
      if (!nombre || nombre === '') continue;

      // Crear clave única
      const clave = creamosId + '|' + nombreHoja;

      // Si ya existe en Lista Definitiva, saltar
      if (idsExistentes.has(clave)) continue;

      // Agregar a la lista de nuevos registros
      const nuevoRegistro = [
        '', // No. - se calculará después
        fila[1] || new Date(), // Fecha Envío (usar fecha de la cohorte o hoy)
        creamosId,              // Creamos ID
        fila[3] || '',          // DPI
        nombre,                 // Nombre Completo
        fila[5] || '',          // Edad
        fila[6] || '',          // Teléfono
        fila[7] || '',          // Nivel Educativo
        fila[8] || '',          // Zona
        nombreHoja              // Cohorte
      ];

      nuevosRegistros.push(nuevoRegistro);
      idsExistentes.add(clave);
      registrosAgregados++;
    }
  });

  // Agregar todos los nuevos registros
  if (nuevosRegistros.length > 0) {
    const primeraFilaVacia = listaDefinitiva.getLastRow() + 1;

    // Calcular números para cada registro
    for (let i = 0; i < nuevosRegistros.length; i++) {
      nuevosRegistros[i][0] = primeraFilaVacia + i - 1;
    }

    listaDefinitiva.getRange(primeraFilaVacia, 1, nuevosRegistros.length, 10)
      .setValues(nuevosRegistros);
  }

  ss.toast('✅ Histórico reconstruido: ' + registrosAgregados + ' registros agregados', 'Completado', 5);

  ui.alert(
    '✅ Histórico Reconstruido',
    'Se agregaron ' + registrosAgregados + ' registros a "Lista Definitiva".\n\n' +
    'Total de registros en histórico: ' + (listaDefinitiva.getLastRow() - 1),
    ui.ButtonSet.OK
  );
}

/**
 * Exporta todo el histórico de "Lista Definitiva" como archivo CSV
 */
function exportarHistoricoCompleto() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  // Verificar que existe Lista Definitiva
  const listaDefinitiva = ss.getSheetByName('Lista Definitiva');
  if (!listaDefinitiva) {
    ui.alert('⚠️ Error', 'No se encontró la hoja "Lista Definitiva".\n\nEjecuta primero "Reconstruir Histórico Completo".', ui.ButtonSet.OK);
    return;
  }

  const totalRegistros = listaDefinitiva.getLastRow() - 1;

  if (totalRegistros === 0) {
    ui.alert('⚠️ Aviso', 'La hoja "Lista Definitiva" está vacía.\n\nEjecuta primero "Reconstruir Histórico Completo".', ui.ButtonSet.OK);
    return;
  }

  const confirmacion = ui.alert(
    '📥 Exportar Histórico Completo',
    'Se exportarán TODOS los ' + totalRegistros + ' registros de "Lista Definitiva".\n\n' +
    'Se creará una nueva hoja con los datos listos para copiar.\n\n' +
    '¿Deseas continuar?',
    ui.ButtonSet.YES_NO
  );

  if (confirmacion !== ui.Button.YES) return;

  ss.toast('📥 Exportando histórico completo...', 'Procesando', 10);

  // Obtener todos los datos
  const datos = listaDefinitiva.getDataRange().getValues();

  // Crear nueva hoja de exportación
  const nombreExportacion = 'Exportación_Completa_' + Utilities.formatDate(new Date(), 'America/Guatemala', 'yyyyMMdd_HHmmss');
  let hojaExportacion = ss.getSheetByName(nombreExportacion);

  if (hojaExportacion) {
    ss.deleteSheet(hojaExportacion);
  }

  hojaExportacion = ss.insertSheet(nombreExportacion);

  // Copiar todos los datos
  hojaExportacion.getRange(1, 1, datos.length, datos[0].length).setValues(datos);

  // Formatear encabezados
  hojaExportacion.getRange(1, 1, 1, datos[0].length)
    .setBackground('#1a237e')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Ajustar anchos de columna
  [50, 120, 100, 130, 200, 60, 120, 150, 120, 180].forEach((w, i) => {
    hojaExportacion.setColumnWidth(i + 1, w);
  });

  hojaExportacion.setFrozenRows(1);

  // Activar la hoja de exportación
  ss.setActiveSheet(hojaExportacion);

  // Guardar fecha de última exportación completa
  PropertiesService.getScriptProperties().setProperty('ULTIMA_EXPORTACION_COMPLETA', new Date().toISOString());

  ss.toast('✅ Exportación completa: ' + totalRegistros + ' registros', 'Completado', 5);

  ui.alert(
    '✅ Exportación Completada',
    'Se creó la hoja "' + nombreExportacion + '" con ' + totalRegistros + ' registros.\n\n' +
    '📋 Puedes copiar todos los datos y pegarlos en Excel o Google Sheets.\n\n' +
    '💡 Para descargar como CSV:\n' +
    '1. Archivo → Descargar → Valores separados por comas (.csv)\n' +
    '2. Selecciona solo esta hoja',
    ui.ButtonSet.OK
  );
}

/**
 * Exporta solo los datos nuevos desde la última exportación
 */
function exportarDatosNuevos() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  // Verificar que existe Lista Definitiva
  const listaDefinitiva = ss.getSheetByName('Lista Definitiva');
  if (!listaDefinitiva) {
    ui.alert('⚠️ Error', 'No se encontró la hoja "Lista Definitiva".\n\nEjecuta primero "Reconstruir Histórico Completo".', ui.ButtonSet.OK);
    return;
  }

  // Obtener fecha de última exportación
  const props = PropertiesService.getScriptProperties();
  const ultimaExportacion = props.getProperty('ULTIMA_EXPORTACION_NUEVOS');
  let fechaCorte = null;

  if (ultimaExportacion) {
    fechaCorte = new Date(ultimaExportacion);
  }

  const mensaje = fechaCorte
    ? 'Se exportarán los registros agregados después del ' +
      Utilities.formatDate(fechaCorte, 'America/Guatemala', 'dd/MM/yyyy HH:mm') + '.\n\n'
    : 'No hay registro de exportación anterior. Se exportarán TODOS los registros.\n\n';

  const confirmacion = ui.alert(
    '📥 Exportar Datos Nuevos',
    mensaje +
    'Se creará una nueva hoja con los datos listos para copiar.\n\n' +
    '¿Deseas continuar?',
    ui.ButtonSet.YES_NO
  );

  if (confirmacion !== ui.Button.YES) return;

  ss.toast('📥 Exportando datos nuevos...', 'Procesando', 10);

  // Obtener todos los datos
  const datos = listaDefinitiva.getDataRange().getValues();
  const encabezados = datos[0];
  const datosNuevos = [encabezados]; // Incluir encabezados

  let contadorNuevos = 0;

  // Filtrar solo los registros nuevos
  for (let i = 1; i < datos.length; i++) {
    const fechaEnvio = datos[i][1]; // Columna B - Fecha Envío

    if (!fechaCorte || (fechaEnvio && new Date(fechaEnvio) > fechaCorte)) {
      datosNuevos.push(datos[i]);
      contadorNuevos++;
    }
  }

  if (contadorNuevos === 0) {
    ui.alert('ℹ️ Sin Datos Nuevos', 'No hay registros nuevos desde la última exportación.', ui.ButtonSet.OK);
    return;
  }

  // Crear nueva hoja de exportación
  const nombreExportacion = 'Exportación_Nuevos_' + Utilities.formatDate(new Date(), 'America/Guatemala', 'yyyyMMdd_HHmmss');
  let hojaExportacion = ss.getSheetByName(nombreExportacion);

  if (hojaExportacion) {
    ss.deleteSheet(hojaExportacion);
  }

  hojaExportacion = ss.insertSheet(nombreExportacion);

  // Copiar los datos nuevos
  hojaExportacion.getRange(1, 1, datosNuevos.length, datosNuevos[0].length).setValues(datosNuevos);

  // Formatear encabezados
  hojaExportacion.getRange(1, 1, 1, datosNuevos[0].length)
    .setBackground('#1a237e')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Ajustar anchos de columna
  [50, 120, 100, 130, 200, 60, 120, 150, 120, 180].forEach((w, i) => {
    hojaExportacion.setColumnWidth(i + 1, w);
  });

  hojaExportacion.setFrozenRows(1);

  // Activar la hoja de exportación
  ss.setActiveSheet(hojaExportacion);

  // Guardar fecha de última exportación de nuevos
  props.setProperty('ULTIMA_EXPORTACION_NUEVOS', new Date().toISOString());

  ss.toast('✅ Exportación nuevos: ' + contadorNuevos + ' registros', 'Completado', 5);

  ui.alert(
    '✅ Exportación Completada',
    'Se creó la hoja "' + nombreExportacion + '" con ' + contadorNuevos + ' registros nuevos.\n\n' +
    '📋 Puedes copiar todos los datos y pegarlos en Excel o Google Sheets.\n\n' +
    '💡 Para descargar como CSV:\n' +
    '1. Archivo → Descargar → Valores separados por comas (.csv)\n' +
    '2. Selecciona solo esta hoja',
    ui.ButtonSet.OK
  );
}
