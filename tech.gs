/**
 * =====================================================================
 * SISTEMA DE INCLUSIÓN LABORAL - ÁREA DE TECNOLOGÍA
 * =====================================================================
 *
 * FLUJO SIMPLIFICADO:
 * 1. Hoja de Interés: Estado → "Entrevista realizada" o "No interesado"
 * 2. Entrevistas: Final → "Aprobada" (→ Inscritx) / "No asistió / No aprobó" (→ No Inscritx)
 * 3. Inscritx: "Enviar a Cohorte" → envía a la hoja individual
 * 4. Cohortes: Estado "Finalizada" → pregunta si graduar a todas
 * 5. Hojas individuales: Estado "Graduadx" o "Retiradx"
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

const CONFIG_TECH = {
  // URL de KoboToolbox para importar Hoja de Interés (formulario principal)
  KOBO_URL: 'https://kf.kobotoolbox.org/api/v2/assets/auvEELWQEgiwF54W4pGpV5/export-settings/esd2gxqN87HPuQDypxFqUNi/data.csv',

  // URL de KoboToolbox para importar datos de ENTREVISTAS (IL_01_Entrevista)
  KOBO_ENTREVISTAS_URL: 'https://kf.kobotoolbox.org/api/v2/assets/aF4nMQPqbHokM7rg2Vtf5w/export-settings/eshupKNDPXEsWYXUFzBKwcK/data.csv',

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
    'Pamela Samayoa',
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
    'Seleccionada/o',
    'No seleccionada/o',
    'No asistió',
    'Reprogramada',
    'Próxima cohorte Programación',
    'Próxima cohorte Alfa Digital'
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
  ],

  // ========== ESTIPENDIOS ==========
  // URL de KoboToolbox para importar Estipendios
  KOBO_ESTIPENDIOS_URL: 'https://kf.kobotoolbox.org/api/v2/assets/ay7MxyzvXBGGakXG7jkAE3/export-settings/esS6RKmzxXxn3qK87Jwxgrt/data.csv',

  // URL Enketo del formulario de referidos (para pre-llenado)
  KOBO_FORMULARIO_URL: 'https://ee.kobotoolbox.org/x/LHmyWvLj',
  // Raíz XForm del formulario (ajustar si el pre-llenado no funciona)
  // Ver en KoboToolbox → Configuración → General → "Form ID"
  KOBO_FORM_ROOT: 'C_08_Referencia_de_Programas',
  // Programa que se enviará como origen en el formulario
  PROGRAMA_NOMBRE: 'Tecnología',

  // Token de Kobo para autenticación
  KOBO_TOKEN: '64cc018b88067397addd36b09288be8b6539cf39',

  // Email para alertas de estipendios
  EMAIL_ALERTAS_ESTIPENDIOS: 'adrian@example.com',  // ⚠️ CAMBIAR POR TU EMAIL REAL

  // ID del Google Sheets de Alimentos y Bebidas (para traslados entre programas)
  // Se encuentra en la URL: docs.google.com/spreadsheets/d/[ESTE_ID]/edit
  ID_SPREADSHEET_AB: '1Ay1z3HdFHTzSjq7891sQVuEpIXBA8g9XGibjI-wFklc'
};

// =====================================================================
// MENÚ PRINCIPAL
// =====================================================================

function onOpen() {
  setupMenuTech();
  try {
    if (typeof setupMenuReferencias === 'function') {
      setupMenuReferencias();
    }
  } catch(e) { }
}

function setupMenuTech() {
  try {
    const ui = SpreadsheetApp.getUi();
    ui.createMenu('💻 Tecnología')
      .addItem('🔄 ACTUALIZAR TODO', 'actualizarTodoTech')
      .addItem('🆕 APLICAR ACTUALIZACIONES', 'aplicarActualizacionesTech')
      .addSeparator()

      .addSubMenu(ui.createMenu('📥 Datos')
        .addItem('📥 Importar Datos Nuevos', 'importarDesdeKoboTech')
        .addItem('🔄 Actualizar Todas las Notas', 'actualizarNotasDesdeKoboTech')
        .addItem('📝 Importar Entrevistas', 'importarEntrevistasDesdeKobo')
        .addSeparator()
        .addItem('⏰ Activar Auto-Importación (c/10 min)', 'instalarTriggersImportacionAuto')
        .addItem('🛑 Desactivar Auto-Importación', 'desinstalarTriggersImportacionAuto')
        .addSeparator()
        .addItem('📦 Separar datos 2025 → Histórico', 'separarDatos2025Tech'))
      .addSeparator()

      .addSubMenu(ui.createMenu('🗂️ Directorio CREAMOS ID')
        .addItem('🔁 Actualizar desde directorio (manual)', 'actualizarTodosDesdeDirectorio')
        .addItem('🕵️ Auditar IDs en todas las hojas', 'auditarCreamosIDsTech')
        .addItem('🔧 Reparar IDs incorrectos', 'repararCreamosIDsTech')
        .addItem('🧹 Limpiar IDs que no corresponden', 'limpiarCreamosIDsIncorrectosTech')
        .addItem('📋 Reporte: personas sin Creamos ID', 'reporteSinCreamosIDTech')
        .addSeparator()
        .addItem('⏰ Activar actualización automática (c/hora)', 'instalarTriggerAutoDirectorio')
        .addItem('🛑 Desactivar actualización automática', 'desinstalarTriggerAutoDirectorio'))
      .addSeparator()

      .addSubMenu(ui.createMenu('📋 Cohortes')
        .addItem('➕ Crear Nueva Cohorte', 'crearNuevaCohorteTech')
        .addItem('✏️ Editar Cohorte', 'editarCohorte')
        .addItem('👥 Enviar Participantes', 'enviarParticipantesACohorteTech')
        .addItem('📊 Estadísticas', 'estadisticasCohorte')
        .addSeparator()
        .addItem('🔧 Reparar Cohorte con Problemas', 'repararCohorte')
        .addSeparator()
        .addItem('📝 Ver/Gestionar', 'verCohortes'))
      .addSeparator()

      .addSubMenu(ui.createMenu('📊 Reportes')
        .addItem('🔄 Reiniciar Mes Actual', 'reiniciarMesEnReporteTech')
        .addItem('📊 Guardar Mensual', 'guardarReporteMensualAutomatico')
        .addItem('📅 Generar Mes Anterior', 'generarReporteMensualPorMesTech')
        .addItem('⏰ Activar/Desactivar Automáticos', 'mostrarMenuReportesAutomaticos'))
      .addSeparator()

      .addSubMenu(ui.createMenu('🔌 Power BI')
        .addItem('🔄 Actualizar PowerBI_Export Ahora', 'actualizarPowerBIExport')
        .addItem('⏰ Activar Auto-Actualización (2 AM)', 'instalarTriggerPowerBIExport')
        .addItem('🛑 Desactivar Auto-Actualización', 'desinstalarTriggerPowerBIExport'))
      .addSeparator()

      .addSubMenu(ui.createMenu('🛠️ Herramientas')
        .addItem('📞 Flujo Seguimiento Manual', 'abrirFlujoSeguimientoManual')
        .addItem('🔧 Reparar Validaciones', 'repararValidaciones')
        .addItem('🔧 Reparar Fórmulas', 'repararFormulas')
        .addItem('🔧 Reparar Columnas', 'repararColumnasTech'))
      .addSeparator()

      .addSubMenu(ui.createMenu('⚙️ Configuración')
        .addItem('🏗️ Primera Instalación (Nuevo Sistema)', 'instalarSistemaCompletoTech')
        .addSeparator()
        .addItem('📥 Importar Datos Históricos (una vez)', 'importarDatosHistoricos')
        .addItem('🚀 Instalar / Actualizar Reportes', 'instalarTodoLoNuevoTech')
        .addItem('✨ Mejorar Reportes', 'mejorarYRepararReportes')
        .addItem('💾 Crear Tabla PowerBI_Export', 'crearHojaPowerBIExport')
        .addItem('📅 Reparar columna Fecha Inscritx', 'asegurarColumnaFechaEnvioInscritxTech')
        .addItem('🗓️ Rellenar fechas faltantes Inscritx', 'rellenarFechasInscritxFaltantesTech')
        .addItem('👤 Agregar Responsable', 'agregarResponsable')
        .addItem('✅ Verificar Instalación', 'verificarInstalacion')
        .addSeparator()
        .addItem('🔗 URL Kobo Registros', 'configurarKoboURL')
        .addItem('🔗 URL Kobo Entrevistas', 'configurarKoboEntrevistasURL')
        .addItem('📧 Configurar Email', 'configurarEmail')
        .addSeparator()
        .addItem('⏰ Instalar Triggers', 'instalarTriggers'))

      .addSeparator()
      .addItem('⚡ Prueba de Rendimiento', 'pruebaRendimientoTech')

      .addToUi();
  } catch (e) {
    Logger.log('No UI context available for setupMenuTech.');
  }

  try {
    verificarEInstalarTriggersAutomaticamente();
    mantenimientoAutomatico();
  } catch (error) {
    Logger.log('Error en mantenimiento automático: ' + error.message);
  }
}

/**
 * Verifica si los triggers necesarios están instalados y los instala automáticamente si faltan
 * Ejecutado silenciosamente en onOpen para asegurar funcionamiento automático
 */
function verificarEInstalarTriggersAutomaticamente() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const triggers = ScriptApp.getProjectTriggers();

    // Verificar si ya existen los triggers
    let triggerEditarOk = false;
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'alEditarTech') triggerEditarOk = true;
    });

    // Si no existe el trigger de edición (crítico para asignar estado "Inscritx"), instalarlo
    if (!triggerEditarOk) {
      Logger.log('⚠️ Trigger onEdit no encontrado. Instalando automáticamente...');
      ScriptApp.newTrigger('alEditarTech').forSpreadsheet(ss).onEdit().create();
      Logger.log('✅ Trigger onEdit instalado automáticamente');
    }
  } catch (error) {
    Logger.log('❌ Error al verificar/instalar triggers: ' + error.message);
  }
}

function mantenimientoAutomatico() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  try {
    Logger.log('🔧 Iniciando mantenimiento automático...');
    actualizarReportesTech();
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
    ss.toast('📋 Creando hojas...', 'Instalando', 2);
    crearTodasLasHojas();

    ss.toast('✅ Configurando validaciones...', 'Instalando', 2);
    configurarValidaciones();

    ss.toast('🎨 Aplicando formatos...', 'Instalando', 2);
    aplicarFormatos();

    ss.toast('⏰ Instalando triggers...', 'Instalando', 2);
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
 * Instala solo la hoja "Detalle Entrevistas"
 * Útil cuando solo necesitas crear/actualizar esta hoja específica
 */
function instalarHojaDetalleEntrevistas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  try {
    ss.toast('📄 Creando hoja "Detalle Entrevistas"...', 'Instalando', 2);
    crearHojaDetalleEntrevistas();

    ss.toast(
      '✅ HOJA INSTALADA\n\n' +
      '✓ Hoja "Detalle Entrevistas" creada con 99 columnas (TECH + SAC)\n\n' +
      '🎯 Ahora puedes importar los datos desde:\n' +
      '   💻 Tecnología → ⚙️ Configuración → 📝 Importar Entrevistas (Detalle)',
      'INSTALACIÓN COMPLETA',
      10
    );

    Logger.log('✅ Hoja "Detalle Entrevistas" instalada');

  } catch (error) {
    ss.toast('❌ Error: ' + error.message, 'ERROR', 10);
    Logger.log('❌ Error al instalar hoja: ' + error.message);
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

/**
 * Limpia cohortes mal nombradas (SAC I I, Computación 1, etc)
 * Permite elegir cuáles eliminar y después recrearlas bien.
 */
function limpiarCohortesMalNombradasTech() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  const cohortesSheet = ss.getSheetByName('Cohortes');

  if (!cohortesSheet) {
    ui.alert('❌ Error', 'No se encontró la hoja Cohortes', ui.ButtonSet.OK);
    return;
  }

  // Detectar cohortes con nombres confusos
  const datos = cohortesSheet.getDataRange().getValues();
  const cohortesMalNombradas = [];

  for (let i = 1; i < datos.length; i++) {
    const nombre = datos[i][0] ? datos[i][0].toString().trim() : '';
    if (!nombre) continue;

    // Detectar patrones de error
    const tieneNumeroDuplicado = /\s[IVX]+\s[IVX]+(\s|$)/.test(nombre); // "I I", "II II"
    const tieneNumeroArabigo = /\s[0-9]+(\s|$)/.test(nombre); // número al final
    const tieneAnoIncluido = /\(\s*20\d{2}\s*\)/.test(nombre); // (2026)
    const soloNombreYAno = /^[A-Za-z\s]+\s\(\d{4}\)$/.test(nombre); // "SAC (2026)"

    if (tieneNumeroDuplicado || tieneNumeroArabigo || (tieneAnoIncluido && soloNombreYAno)) {
      cohortesMalNombradas.push({
        fila: i + 1,
        nombre: nombre,
        razon: tieneNumeroDuplicado ? 'Números duplicados' :
               tieneNumeroArabigo ? 'Número suelto' :
               'Faltan número de cohorte'
      });
    }
  }

  if (cohortesMalNombradas.length === 0) {
    ui.alert('✅ Todas bien', 'No hay cohortes mal nombradas.', ui.ButtonSet.OK);
    return;
  }

  // Mostrar lista
  let mensaje = '⚠️ Se encontraron ' + cohortesMalNombradas.length + ' cohorte(s) mal nombrada(s):\n\n';
  cohortesMalNombradas.forEach((c, idx) => {
    mensaje += (idx + 1) + '. ' + c.nombre + ' (' + c.razon + ')\n';
  });
  mensaje += '\n¿Deseas ELIMINAR estas cohortes?';

  const respuesta = ui.alert('Limpiar Cohortes', mensaje, ui.ButtonSet.YES_NO);

  if (respuesta !== ui.Button.YES) {
    ui.alert('Cancelado', 'Nada fue eliminado.', ui.ButtonSet.OK);
    return;
  }

  // Eliminar de abajo hacia arriba
  for (let i = cohortesMalNombradas.length - 1; i >= 0; i--) {
    const fila = cohortesMalNombradas[i].fila;
    const nombreCohorte = cohortesMalNombradas[i].nombre;

    // Eliminar la hoja si existe
    const hojaCohorte = ss.getSheetByName(nombreCohorte);
    if (hojaCohorte) {
      ss.deleteSheet(hojaCohorte);
    }

    // Eliminar fila de Cohortes
    cohortesSheet.deleteRow(fila);
  }

  ui.alert('✅ Cohortes eliminadas',
    'Se eliminaron ' + cohortesMalNombradas.length + ' cohorte(s).\n\n' +
    'Ahora puedes crear nuevas cohortes bien nombradas con:\n' +
    'Menu > Crear Nueva Cohorte',
    ui.ButtonSet.OK);

  limpiarCohortesEliminadas(true);
  configurarValidaciones();
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
    if (trigger.getHandlerFunction() === 'alEditarTech') triggerEditarOk = true;
    if (trigger.getHandlerFunction() === 'actualizarReportesTech') triggerTiempoOk = true;
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

/**
 * Diagnóstico de campos "Nivel Educativo" y "Zona"
 * Verifica que estos campos estén presentes en cada hoja y muestra estadísticas
 */
function diagnosticarCamposNivelYZona() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  let reporte = '🔍 DIAGNÓSTICO: Nivel Educativo y Zona\n\n';
  let problemaEncontrado = false;

  // Verificar Hoja de Interés
  const hojaInteres = ss.getSheetByName('Hoja de Interés');
  if (hojaInteres) {
    const headers = hojaInteres.getRange(1, 1, 1, 16).getValues()[0];
    const tieneNivel = headers[8] === 'Nivel Educativo';
    const tieneZona = headers[9] === 'Zona';

    reporte += '📄 Hoja de Interés:\n';
    reporte += (tieneNivel ? '  ✅' : '  ❌') + ' Columna I = Nivel Educativo ' + (tieneNivel ? '' : '(encontrado: "' + headers[8] + '")') + '\n';
    reporte += (tieneZona ? '  ✅' : '  ❌') + ' Columna J = Zona ' + (tieneZona ? '' : '(encontrado: "' + headers[9] + '")') + '\n';

    if (tieneNivel && tieneZona) {
      const datos = hojaInteres.getDataRange().getValues();
      let vacios = 0;
      let llenos = 0;
      for (let i = 1; i < datos.length && i < 100; i++) {
        if (datos[i][4]) { // Si tiene nombre
          if (!datos[i][8] || !datos[i][9]) vacios++;
          else llenos++;
        }
      }
      reporte += '  📊 Registros con datos: ' + llenos + '\n';
      reporte += '  ⚠️ Registros con campos vacíos: ' + vacios + '\n';
      if (vacios > 0) problemaEncontrado = true;
    } else {
      problemaEncontrado = true;
    }
    reporte += '\n';
  }

  // Verificar Entrevistas
  const entrevistas = ss.getSheetByName('Entrevistas');
  if (entrevistas) {
    const headers = entrevistas.getRange(1, 1, 1, 14).getValues()[0];
    const tieneNivel = headers[8] === 'Nivel Educativo';
    const tieneZona = headers[9] === 'Zona';

    reporte += '📄 Entrevistas:\n';
    reporte += (tieneNivel ? '  ✅' : '  ❌') + ' Columna I = Nivel Educativo ' + (tieneNivel ? '' : '(encontrado: "' + headers[8] + '")') + '\n';
    reporte += (tieneZona ? '  ✅' : '  ❌') + ' Columna J = Zona ' + (tieneZona ? '' : '(encontrado: "' + headers[9] + '")') + '\n';

    if (tieneNivel && tieneZona) {
      const datos = entrevistas.getDataRange().getValues();
      let vacios = 0;
      let llenos = 0;
      for (let i = 1; i < datos.length && i < 100; i++) {
        if (datos[i][4]) { // Si tiene nombre
          if (!datos[i][8] || !datos[i][9]) vacios++;
          else llenos++;
        }
      }
      reporte += '  📊 Registros con datos: ' + llenos + '\n';
      reporte += '  ⚠️ Registros con campos vacíos: ' + vacios + '\n';
      if (vacios > 0) problemaEncontrado = true;
    } else {
      problemaEncontrado = true;
    }
    reporte += '\n';
  }

  // Verificar Inscritx
  const inscritx = ss.getSheetByName('Inscritx');
  if (inscritx) {
    const headers = inscritx.getRange(1, 1, 1, 12).getValues()[0];
    const tieneNivel = headers[7] === 'Nivel Educativo';
    const tieneZona = headers[8] === 'Zona';

    reporte += '📄 Inscritx:\n';
    reporte += (tieneNivel ? '  ✅' : '  ❌') + ' Columna H = Nivel Educativo ' + (tieneNivel ? '' : '(encontrado: "' + headers[7] + '")') + '\n';
    reporte += (tieneZona ? '  ✅' : '  ❌') + ' Columna I = Zona ' + (tieneZona ? '' : '(encontrado: "' + headers[8] + '")') + '\n';

    if (tieneNivel && tieneZona) {
      const datos = inscritx.getDataRange().getValues();
      let vacios = 0;
      let llenos = 0;
      for (let i = 1; i < datos.length; i++) {
        if (datos[i][3]) { // Si tiene nombre
          if (!datos[i][7] || !datos[i][8]) vacios++;
          else llenos++;
        }
      }
      reporte += '  📊 Registros con datos: ' + llenos + '\n';
      reporte += '  ⚠️ Registros con campos vacíos: ' + vacios + '\n';
      if (vacios > 0) problemaEncontrado = true;
    } else {
      problemaEncontrado = true;
    }
    reporte += '\n';
  }

  // Verificar una cohorte de ejemplo
  const cohortesSheet = ss.getSheetByName('Cohortes');
  if (cohortesSheet) {
    const datosCohortes = cohortesSheet.getDataRange().getValues();
    if (datosCohortes.length > 1 && datosCohortes[1][0]) {
      const nombreCohorte = datosCohortes[1][0];
      const hojaCohorte = ss.getSheetByName(nombreCohorte);
      if (hojaCohorte) {
        const headers = hojaCohorte.getRange(1, 1, 1, 12).getValues()[0];
        const tieneNivel = headers[8] === 'Nivel Educativo';
        const tieneZona = headers[9] === 'Zona';

        reporte += '📄 Cohorte "' + nombreCohorte + '" (ejemplo):\n';
        reporte += (tieneNivel ? '  ✅' : '  ❌') + ' Columna I = Nivel Educativo ' + (tieneNivel ? '' : '(encontrado: "' + headers[8] + '")') + '\n';
        reporte += (tieneZona ? '  ✅' : '  ❌') + ' Columna J = Zona ' + (tieneZona ? '' : '(encontrado: "' + headers[9] + '")') + '\n';

        if (tieneNivel && tieneZona) {
          const datos = hojaCohorte.getDataRange().getValues();
          let vacios = 0;
          let llenos = 0;
          for (let i = 1; i < datos.length; i++) {
            if (datos[i][4]) { // Si tiene nombre
              if (!datos[i][8] || !datos[i][9]) vacios++;
              else llenos++;
            }
          }
          reporte += '  📊 Registros con datos: ' + llenos + '\n';
          reporte += '  ⚠️ Registros con campos vacíos: ' + vacios + '\n';
          if (vacios > 0) problemaEncontrado = true;
        } else {
          problemaEncontrado = true;
        }
        reporte += '\n';
      }
    }
  }

  // Conclusión
  if (problemaEncontrado) {
    reporte += '❌ PROBLEMAS ENCONTRADOS\n\n';
    reporte += 'Soluciones recomendadas:\n';
    reporte += '1. Si las columnas están mal ubicadas:\n';
    reporte += '   → Ejecutar "Reparar Validaciones"\n\n';
    reporte += '2. Si hay registros con campos vacíos:\n';
    reporte += '   → Verificar importación desde Kobo\n';
    reporte += '   → Ejecutar "Actualizar desde CREAMOS ID"\n\n';
    reporte += '3. Ver archivo DIAGNOSTICO_CAMPOS.md\n';
    reporte += '   para instrucciones detalladas';
  } else {
    reporte += '✅ TODO CORRECTO\n';
    reporte += 'Las columnas están bien ubicadas\n';
    reporte += 'y los datos están completos';
  }

  ui.alert('Diagnóstico de Campos', reporte, ui.ButtonSet.OK);
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
  crearHojaPasoAPaso();
  crearHojaDetalleEntrevistas();
  crearHojaInscritx();
  crearHojaCohortes();
  crearHojaGraduadx();
  crearHojaRetiradx();
  crearHojaNoInscritx();
  crearHojaListaDefinitiva();
  crearHojaReferenciasProgramas();
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
    sheet.getRange('B' + i).setFormula('=IF(E' + i + '<>"",ROW()-1,"")');
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
    '🔗 Abrir Kobo',      // C - NUEVO: Link al formulario
    'Creamos ID',         // D
    'DPI',                // E
    'Nombre Completo',    // F
    'Género',             // G
    'Edad',               // H
    'Teléfono',           // I
    'Nivel Educativo',    // J
    'Zona',               // K
    'Entrevistador',      // L - Desplegable (responsables)
    'Calificación',       // M
    'Observaciones',      // N
    'Estado'              // O - Desplegable (última columna - trigger)
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#7b1fa2')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Anchos de columna
  [120, 80, 120, 100, 130, 200, 120, 60, 120, 150, 120, 120, 120, 300, 150].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });

  // Destacar columna "Estado"
  sheet.getRange('O1').setBackground('#4caf50');

  // Destacar columna "Abrir Kobo"
  sheet.getRange('C1').setBackground('#2196f3').setFontColor('white');
}

/**
 * Crea la hoja "Paso a Paso" - copia de Entrevistas para derivar a otras personas
 */
function crearHojaPasoAPaso() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss.getSheetByName('Paso a Paso')) return;
  const sheet = ss.insertSheet('Paso a Paso');

  const headers = [
    'Fecha Entrevista',   // A
    'Hora',               // B
    '🔗 Abrir Kobo',      // C - Link al formulario
    'Creamos ID',         // D
    'DPI',                // E
    'Nombre Completo',    // F
    'Género',             // G
    'Edad',               // H
    'Teléfono',           // I
    'Nivel Educativo',    // J
    'Zona',               // K
    'Entrevistador',      // L
    'Calificación',       // M
    'Observaciones',      // N
    'Estado'              // O
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#1976d2')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Anchos de columna (iguales a Entrevistas)
  [120, 80, 120, 100, 130, 200, 120, 60, 120, 150, 120, 120, 120, 300, 150].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });

  // Destacar columnas especiales
  sheet.getRange('O1').setBackground('#4caf50').setFontColor('white');
  sheet.getRange('C1').setBackground('#2196f3').setFontColor('white');
}

/**
 * HOJA DE DETALLE ENTREVISTAS - Almacena todas las respuestas del formulario Kobo (NUEVA ENTREVISTA)
 * Se vincula por Creamos ID con las demás hojas
 * Importa desde: IL_01_Entrevista en KoboToolbox
 * Estructura: 134 columnas (A a ED)
 */
function crearHojaDetalleEntrevistas() {
  crearHojaDetalleEntrevistasUnificada();
}

/**
 * =====================================================================
 * ESTRUCTURA UNIFICADA PARA DETALLE DE ENTREVISTAS
 * Incluida aquí para no depender de EntrevistasUnificado.gs
 * =====================================================================
 */
function crearHojaDetalleEntrevistasUnificada() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Si ya existe, no la recrea
  if (ss.getSheetByName('Detalle Entrevistas')) return;

  const sheet = ss.insertSheet('Detalle Entrevistas');

  // Estructura específica para TECNOLOGÍA + SERVICIO AL CLIENTE (99 columnas)
  // No incluye columnas de AB (esas van en el otro sistema: AlimentosBebidas.gs)
  const headers = [
    // === SECCIÓN 1: DATOS PERSONALES (A-H) === 8 columnas (índices 0-7)
    'Fecha Entrevista', 'Creamos ID', 'Nombres y Apellidos', 'Género',
    'Formación Previa', 'Dónde y De Qué Formación', 'Sector Interés', 'Curso Interés',
    // === SECCIÓN 2B: TECNOLOGÍA - PREGUNTAS DEL CURSO (I-S) === 11 columnas (índices 8-18)
    'TECH: Por Qué Interesa Curso', 'TECH: Qué Llama la Atención', 'TECH: Expectativa del Curso',
    'TECH: Dificultades Curso', 'TECH: Áreas Vida Cambiarán', 'TECH: Disponibilidad Curso',
    'TECH: Plan Disponibilidad', 'TECH: Transporte', 'TECH: Plan Transporte',
    'TECH: Firmar Documento', 'TECH: Comentario Documento',
    // === SECCIÓN 2B: TECNOLOGÍA - EMPLEABILIDAD (T-AO) === 22 columnas (índices 19-40)
    'TECH: Actualmente Tiene Trabajo', 'TECH: Cuéntanos Más Trabajo', 'TECH: Satisfecho con Trabajo',
    'TECH: Comentario Satisfacción', 'TECH: Qué Hacer Próximos Meses', 'TECH: Importancia Conseguir Trabajo',
    'TECH: Te Ves Trabajando Sector', 'TECH: Ayuda Económica', 'TECH: Comentario Ayuda',
    'TECH: Dependientes Económicos', 'TECH: Comentario Dependientes', 'TECH: Responsabilidades Cuidado',
    'TECH: Comentario Cuidado', 'TECH: Deudas Bancarias', 'TECH: Comentario Deudas',
    'TECH: Antecedentes Penales', 'TECH: Comentario Antecedentes', 'TECH: Caso Legal',
    'TECH: Comentario Legal', 'TECH: Dispuesto Empleabilidad', 'TECH: Comentario Empleabilidad',
    'TECH: Temporalidad Metas',
    // === SECCIÓN 2C: SERVICIO AL CLIENTE - PREGUNTAS DEL CURSO (AP-AZ) === 11 columnas (índices 41-51)
    'SAC: Por Qué Interesa Curso', 'SAC: Qué Llama la Atención', 'SAC: Expectativa del Curso',
    'SAC: Dificultades Curso', 'SAC: Áreas Vida Cambiarán', 'SAC: Disponibilidad Curso',
    'SAC: Plan Disponibilidad', 'SAC: Transporte', 'SAC: Plan Transporte',
    'SAC: Firmar Documento', 'SAC: Comentario Documento',
    // === SECCIÓN 2C: SERVICIO AL CLIENTE - EMPLEABILIDAD (BA-BV) === 22 columnas (índices 52-73)
    'SAC: Actualmente Tiene Trabajo', 'SAC: Cuéntanos Más Trabajo', 'SAC: Satisfecho con Trabajo',
    'SAC: Comentario Satisfacción', 'SAC: Qué Hacer Próximos Meses', 'SAC: Importancia Conseguir Trabajo',
    'SAC: Te Ves Trabajando Sector', 'SAC: Ayuda Económica', 'SAC: Comentario Ayuda',
    'SAC: Dependientes Económicos', 'SAC: Comentario Dependientes', 'SAC: Responsabilidades Cuidado',
    'SAC: Comentario Cuidado', 'SAC: Deudas Bancarias', 'SAC: Comentario Deudas',
    'SAC: Antecedentes Penales', 'SAC: Comentario Antecedentes', 'SAC: Caso Legal',
    'SAC: Comentario Legal', 'SAC: Dispuesto Empleabilidad', 'SAC: Comentario Empleabilidad',
    'SAC: Temporalidad Metas',
    // === SECCIÓN 3: GÉNERO (BW-CI) === 13 columnas (índices 74-86)
    'Género: Comentario Previo', 'Género: Grupos Mixtos', 'Género: Comentario Mixtos',
    'Género: Grupos Diversos', 'Género: Comentario Diversos', 'Género: Conflicto en Grupos',
    'Género: Comentario Conflicto Grupos', 'Género: Conflicto Horarios',
    'Género: Comentario Conflicto Horarios', 'Género: Grupo Mayoritariamente Mujeres',
    'Género: Igualdad H/M', 'Género: Familiares Creamos', 'Género: Nombres Familiares',
    // === NOTAS Y METADATOS KOBO (CJ-CU) === 12 columnas (índices 87-98)
    'Notas del Entrevistador', '_id', '_uuid', '_submission_time', '_validation_status',
    '_notes', '_status', '_submitted_by', '__version__', '_tags', 'meta/rootUuid', '_index'
  ];
  // Total: 99 columnas (A-CU)

  const currentCols = sheet.getMaxColumns();
  if (headers.length > currentCols) {
    sheet.insertColumnsAfter(currentCols, headers.length - currentCols);
  }

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setFontColor('white').setFontWeight('bold')
    .setHorizontalAlignment('center').setWrap(true);

  sheet.setFrozenRows(1);

  const anchos = [
    // Datos personales A-H (8)
    100, 100, 200, 80, 80, 150, 120, 150,
    // TECH Preguntas I-S (11)
    200, 200, 200, 200, 200, 80, 200, 80, 200, 80, 200,
    // TECH Empleabilidad T-AO (22)
    80, 200, 80, 200, 200, 150, 200, 80, 150, 80, 150, 80, 150, 80, 150, 80, 150, 80, 150, 80, 200, 200,
    // SAC Preguntas AP-AZ (11)
    200, 200, 200, 200, 200, 80, 200, 80, 200, 80, 200,
    // SAC Empleabilidad BA-BV (22)
    80, 200, 80, 200, 200, 150, 200, 80, 150, 80, 150, 80, 150, 80, 150, 80, 150, 80, 150, 80, 200, 200,
    // Género BW-CI (13)
    200, 80, 150, 80, 150, 80, 200, 80, 200, 150, 200, 80, 200,
    // Metadatos CJ-CU (12)
    250, 100, 150, 120, 100, 120, 100, 100, 80, 120, 150, 80
  ];
  anchos.forEach((w, i) => sheet.setColumnWidth(i + 1, w));

  sheet.getRange('A1:H1').setBackground('#1565c0');   // Datos Personales - Azul
  sheet.getRange('I1:S1').setBackground('#283593');   // TECH Preguntas - Índigo
  sheet.getRange('T1:AO1').setBackground('#1a237e');  // TECH Empleabilidad - Índigo oscuro
  sheet.getRange('AP1:AZ1').setBackground('#1b5e20'); // SAC Preguntas - Verde
  sheet.getRange('BA1:BV1').setBackground('#33691e'); // SAC Empleabilidad - Verde oscuro
  sheet.getRange('BW1:CI1').setBackground('#880e4f'); // Género - Rosa
  sheet.getRange('CJ1:CU1').setBackground('#455a64'); // Metadatos - Gris azulado

  Logger.log('✅ Hoja "Detalle Entrevistas" TECH/SAC creada - 99 columnas (sin AB)');
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
    'Estado',                   // K - Automático "Inscritx"
    'Enviar a Cohorte',         // L - Desplegable dinámico (última columna - trigger)
    'Fecha envío a Inscritx',   // M - Fecha automática para reportes mensuales
    'Trasladar a A y B'         // N - Traslado a programa de Alimentos y Bebidas
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#2e7d32')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  [50, 100, 130, 200, 120, 60, 120, 150, 120, 250, 120, 180, 100, 180].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });

  // Destacar columnas importantes
  sheet.getRange('K1').setBackground('#ffd54f'); // Estado en amarillo
  sheet.getRange('L1').setBackground('#4caf50');  // Enviar a Cohorte en verde
  sheet.getRange('M1').setBackground('#90caf9');  // Fecha envío a Inscritx
  sheet.getRange('N1').setBackground('#ffcc80');  // Trasladar a A y B en naranja
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
    'Año',                // C - Autocompletado con año actual
    'Fecha Inicio',       // D
    'Fecha Fin',          // E
    'Responsable',        // F
    'Cupo Máximo',        // G
    'Inscritas',          // H - Fórmula (cuenta en hoja individual)
    'Graduadx',          // I - Fórmula
    'Retiradx',        // J - Fórmula
    'Ubicación',          // K
    'Horario',            // L
    'Notas',              // M
    'Estado'              // N - Activa/Finalizada (última columna - trigger)
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#f57c00')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Las fórmulas se actualizan cuando se crea la cohorte individual
  for (let i = 2; i <= 20; i++) {
    // Inscritas: cuenta por Creamos ID (col C) en la hoja individual, restando Retiradx
    sheet.getRange('H' + i).setFormula('=IF(A' + i + '="",0,IFERROR(COUNTIF(INDIRECT("\'"&A' + i + '&"\'!E:E"),"<>")-1-COUNTIF(INDIRECT("\'"&A' + i + '&"\'!K:K"),"Graduadx")-COUNTIF(INDIRECT("\'"&A' + i + '&"\'!K:K"),"Retiradx"),0))');
    sheet.getRange('I' + i).setFormula('=IFERROR(COUNTIF(Graduadx!J:J,A' + i + '),0)');
    sheet.getRange('J' + i).setFormula('=IFERROR(COUNTIF(Retiradx!J:J,A' + i + '),0)');
  }

  [180, 100, 70, 120, 120, 120, 100, 80, 80, 80, 150, 150, 200, 120].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });

  // Destacar columna Estado
  sheet.getRange('N1').setBackground('#4caf50');
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
    'Edad',                 // F
    'Teléfono',             // G
    'Nivel Educativo',      // H
    'Zona',                 // I
    'Cohorte',              // J
    'Notas'                 // K
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#388e3c')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  [120, 100, 130, 200, 120, 80, 120, 150, 120, 180, 300].forEach((w, i) => {
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
    'Edad',             // F
    'Teléfono',         // G
    'Nivel Educativo',  // H
    'Zona',             // I
    'Cohorte',          // J
    'Motivo',           // K
    'Notas',            // L
    'Acción'            // M - Desplegable para reenviar (última columna - trigger)
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#d32f2f')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  [120, 100, 130, 200, 120, 80, 120, 150, 120, 180, 200, 300, 180].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });

  // Destacar columna Acción
  sheet.getRange('M1').setBackground('#4caf50');
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
    'Edad',             // E
    'Teléfono',         // F
    'Etapa',            // G - En qué etapa no fue seleccionada
    'Motivo',           // H - Desplegable
    'Origen',           // I - Interés / Entrevista / Inscritx
    'Notas',            // J
    'Acción'            // K - Desplegable para reenviar (última columna - trigger)
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#616161')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  [120, 100, 200, 120, 80, 120, 150, 200, 150, 300, 180].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });

  // Destacar columna Acción
  sheet.getRange('K1').setBackground('#4caf50');
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
 * HOJA DE REFERENCIAS DE PROGRAMAS
 * Reemplaza la anterior "Referencias IL"
 */
function crearHojaReferenciasProgramas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss.getSheetByName('Referencias de Programas')) return;
  const sheet = ss.insertSheet('Referencias de Programas');

  const headers = [
    'Fecha',            // A
    'No.',              // B
    'Creamos ID',       // C
    'DPI',              // D
    'Nombre Completo',  // E
    'Género',           // F
    'Edad',             // G
    'Teléfono',         // H
    'Nivel Educativo',  // I
    'Zona',             // J
    'Programa de Referencia', // K
    'Referido por',     // L
    '¿Tiene Hoja de Interés?', // M - Sí/No con color
    'Notas'             // N
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#6a1b9a')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  [120, 50, 100, 130, 200, 120, 60, 120, 150, 120, 180, 150, 180, 200].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });

  sheet.setFrozenRows(1);

  // Configurar validación para "¿Tiene Hoja de Interés?" (columna M)
  sheet.getRange('M2:M500').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['Sí', 'No'])
      .setAllowInvalid(false)
      .build()
  );
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
    ['Entrevistas', '=IFERROR(COUNTA(Entrevistas!D:D)-1,0)', '=IFERROR(COUNTIF(Entrevistas!N:N,""),0)', ''], // 8
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
    ['Participantes activas en cohortes', '=IFERROR(SUM(IFERROR(VALUE(Cohortes!G2:G),0))-SUM(IFERROR(VALUE(Cohortes!H2:H),0))-SUM(IFERROR(VALUE(Cohortes!I2:I),0)),0)', '', '']                                       // 28
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
    'Mes/Año',            // A
    'Nuevos Registros',   // B - Hoja de Interés del mes
    'Entrevistas',        // C - del mes
    'Aprobadas',          // D
    'No Aprobadas',       // E
    'No Asistió',         // F
    'Reprogramadas',      // G
    'Derivadas P.Paso',   // H
    'Total Inscritx',     // I - acumulado
    'Graduadx Mes',       // J
    'Deserciones Mes',    // K
    'Cohortes Activas',   // L
    'Tasa Conversión %',  // M
    'Titular de Impacto', // N
    'Logros del Mes',     // O
    'Fecha Guardado'      // P
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#6a1b9a')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  [100,110,90,90,95,90,100,110,95,90,100,110,110,300,400,120].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });
  sheet.setRowHeight(1, 40);
}

function asegurarEstructuraReportesMensualesTech() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Reportes Mensuales');
  if (!sheet) {
    crearHojaReportesMensuales();
    sheet = ss.getSheetByName('Reportes Mensuales');
  }
  if (!sheet) return;

  const headers = [
    'Mes/Año', 'Nuevos Registros', 'Entrevistas', 'Aprobadas', 'No Aprobadas', 'No Asistió',
    'Reprogramadas', 'Derivadas P.Paso', 'Total Inscritx', 'Graduadx Mes', 'Deserciones Mes',
    'Cohortes Activas', 'Tasa Conversión %', 'Titular de Impacto', 'Logros del Mes', 'Fecha Guardado'
  ];
  if (sheet.getMaxColumns() < headers.length) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), headers.length - sheet.getMaxColumns());
  }
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#6a1b9a').setFontColor('white').setFontWeight('bold').setHorizontalAlignment('center');
  [100,110,90,90,95,90,100,110,95,90,100,110,110,300,400,120].forEach((w, i) => sheet.setColumnWidth(i + 1, w));
  sheet.setRowHeight(1, 40);
}

// =====================================================================
// CONFIGURAR VALIDACIONES
// =====================================================================

function configurarValidaciones() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const cohortes = obtenerCohortesActivas(); // Solo cohortes activas para envío
  const responsables = obtenerResponsablesActuales();

  // === HOJA DE INTERÉS ===
  const interes = ss.getSheetByName('Hoja de Interés');
  if (interes) {
    const hdrsHI = interes.getRange(1, 1, 1, interes.getLastColumn()).getValues()[0];

    const aplicarHI = (nombreCol, lista, allowInvalid) => {
      const idx = hdrsHI.findIndex(h => h.toString().trim().toLowerCase() === nombreCol.toLowerCase());
      if (idx >= 0) {
        interes.getRange(2, idx + 1, 499, 1).setDataValidation(
          SpreadsheetApp.newDataValidation().requireValueInList(lista).setAllowInvalid(allowInvalid !== false).build()
        );
      }
    };

    aplicarHI('Género', CONFIG_TECH.GENEROS, true);
    aplicarHI('Estado', ['Entrevista agendada', 'Reprogramada', 'No interesada/o'], true);
  }

  // === HOJA DE ENTREVISTAS ===
  // Usa detección dinámica por nombre de columna para evitar errores de posición
  const entrevistas = ss.getSheetByName('Entrevistas');
  if (entrevistas) {
    const headersEnt = entrevistas.getRange(1, 1, 1, entrevistas.getLastColumn()).getValues()[0];

    // Función auxiliar: aplicar validación a columna buscada por nombre
    const aplicarValidacionEnt = (nombreCol, lista, allowInvalid) => {
      const idx = headersEnt.findIndex(h => h.toString().trim().toLowerCase() === nombreCol.toLowerCase());
      if (idx >= 0) {
        entrevistas.getRange(2, idx + 1, 499, 1).setDataValidation(
          SpreadsheetApp.newDataValidation().requireValueInList(lista).setAllowInvalid(allowInvalid !== false).build()
        );
      }
    };

    aplicarValidacionEnt('Género', CONFIG_TECH.GENEROS, true);
    aplicarValidacionEnt('Nivel Educativo', CONFIG_TECH.NIVELES_EDUCATIVOS, true);
    aplicarValidacionEnt('Zona', CONFIG_TECH.ZONAS, true);
    aplicarValidacionEnt('Entrevistador', responsables, true);

    // Estado: menú limpio + allowInvalid para no romper datos viejos
    const colEstado = headersEnt.findIndex(h => h.toString().trim() === 'Estado');
    if (colEstado >= 0) {
      const opcionesEstado = CONFIG_TECH.RESULTADO_FINAL.concat([
        'Derivar a Paso a Paso',
        'Derivación a Programas',
        'Enviar a A y B'
      ]);
      entrevistas.getRange(2, colEstado + 1, 499, 1).setDataValidation(
        SpreadsheetApp.newDataValidation()
          .requireValueInList(opcionesEstado)
          .setAllowInvalid(true)
          .build()
      );
    }
  }

  // === HOJA DE SELECCIONADAS (Inscritx) ===
  const seleccionadas = ss.getSheetByName('Inscritx');
  if (seleccionadas) {
    const hdrsIns = seleccionadas.getRange(1, 1, 1, seleccionadas.getLastColumn()).getValues()[0];

    const aplicarIns = (nombreCol, lista, allowInvalid) => {
      const idx = hdrsIns.findIndex(h => h.toString().trim().toLowerCase() === nombreCol.toLowerCase());
      if (idx >= 0) {
        seleccionadas.getRange(2, idx + 1, 499, 1).setDataValidation(
          SpreadsheetApp.newDataValidation().requireValueInList(lista).setAllowInvalid(allowInvalid !== false).build()
        );
      }
    };

    aplicarIns('Género', CONFIG_TECH.GENEROS, true);
    aplicarIns('Nivel Educativo', CONFIG_TECH.NIVELES_EDUCATIVOS, true);
    aplicarIns('Zona', CONFIG_TECH.ZONAS, true);
    if (cohortes.length > 0) {
      aplicarIns('Enviar a Cohorte', cohortes, false);
    }
  }

  // === HOJA DE GRADUADAS ===
  // Columnas: A-Fecha, B-CreamosID, C-DPI, D-Nombre, E-Género, F-Edad, G-Tel, H-NivelEdu, I-Zona, J-Cohorte, K-Notas
  const graduadas = ss.getSheetByName('Graduadx');
  if (graduadas) {
    // Género (E)
    graduadas.getRange('E2:E500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG_TECH.GENEROS).setAllowInvalid(true).build()
    );
    // Nivel Educativo (H)
    graduadas.getRange('H2:H500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG_TECH.NIVELES_EDUCATIVOS).setAllowInvalid(false).build()
    );
    // Zona (I)
    graduadas.getRange('I2:I500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG_TECH.ZONAS).setAllowInvalid(true).build()
    );
    // Cohorte (J)
    const todasCohortes = obtenerCohortesActuales();
    graduadas.getRange('J2:J500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(todasCohortes).setAllowInvalid(false).build()
    );
    // Nota: No hay desplegable de Estado en Graduadx — el seguimiento se gestiona en el Archivo de Seguimiento externo
  }

  // === HOJA DE DESERCIONES ===
  // Columnas: A-Fecha, B-CreamosID, C-DPI, D-Nombre, E-Género, F-Edad, G-Tel, H-NivelEdu, I-Zona, J-Cohorte, K-Motivo, L-Notas, M-Acción
  const deserciones = ss.getSheetByName('Retiradx');
  if (deserciones) {
    // Género (E)
    deserciones.getRange('E2:E500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG_TECH.GENEROS).setAllowInvalid(true).build()
    );
    // Nivel Educativo (H)
    deserciones.getRange('H2:H500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG_TECH.NIVELES_EDUCATIVOS).setAllowInvalid(false).build()
    );
    // Zona (I)
    deserciones.getRange('I2:I500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG_TECH.ZONAS).setAllowInvalid(true).build()
    );
    // Cohorte (J)
    const todasCohortes = obtenerCohortesActuales();
    deserciones.getRange('J2:J500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(todasCohortes).setAllowInvalid(false).build()
    );
    // Motivo (K)
    deserciones.getRange('K2:K500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG_TECH.MOTIVOS_DESERCION).setAllowInvalid(true).build()
    );
    // Acción (M) - Opción para reenviar a Inscritx
    deserciones.getRange('M2:M500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(['Reenviar a Inscritx']).setAllowInvalid(true).build()
    );
  }

  // === HOJA DE NO SELECCIONADAS ===
  // Columnas: A-Fecha, B-CreamosID, C-Nombre, D-Género, E-Edad, F-Teléfono, G-Etapa, H-Motivo, I-Origen, J-Notas, K-Acción
  const noInscritx = ss.getSheetByName('No Inscritx');
  if (noInscritx) {
    // Género (D)
    noInscritx.getRange('D2:D500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG_TECH.GENEROS).setAllowInvalid(true).build()
    );
    // Etapa (G)
    noInscritx.getRange('G2:G500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(['Interés inicial', 'Post-entrevista', 'Post-selección']).setAllowInvalid(false).build()
    );
    // Motivo (H)
    noInscritx.getRange('H2:H500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG_TECH.MOTIVOS_NO_SELECCION).setAllowInvalid(true).build()
    );
    // Origen (I)
    noInscritx.getRange('I2:I500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(['Hoja de Interés', 'Entrevistas', 'Inscritx']).setAllowInvalid(false).build()
    );
    // Acción (K) - Opciones para reenviar según origen
    noInscritx.getRange('K2:K500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(['Reenviar a Entrevistas', 'Reenviar a Inscritx']).setAllowInvalid(true).build()
    );
  }

  // === HOJA DE COHORTES ===
  // Columnas: A-Nombre, B-Proyecto, C-Año, D-FechaInicio, E-FechaFin, F-Responsable, G-Cupo, H-Inscritas, I-Graduadx, J-Retiradx, K-Ubicación, L-Horario, M-Notas, N-Estado
  const cohortesSheet = ss.getSheetByName('Cohortes');
  if (cohortesSheet) {
    cohortesSheet.getRange('F2:F50').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(responsables).setAllowInvalid(false).build()
    );
    // Estado (columna N) - Solo Activa/Finalizada
    cohortesSheet.getRange('N2:N50').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG_TECH.ESTADOS_COHORTE).setAllowInvalid(false).build()
    );
  }

  // === HOJA DE REPORTES MENSUALES ===
  // Columnas: A-Mes/Año, B-Nuevos Registros, C-Entrevistas, D-Aprobadas, E-No Aprobadas, F-No Asistió,
  //          G-Reprogramadas, H-Derivadas P.Paso, I-Total Inscritx, J-Graduadx Mes, K-Deserciones Mes,
  //          L-Cohortes Activas, M-Tasa Conversión %, N-Titular de Impacto, O-Logros del Mes, P-Fecha Guardado
  const reportesMensuales = ss.getSheetByName('Reportes Mensuales');
  if (reportesMensuales) {
    // Titular de Impacto (columna N) - debe ser uno de los responsables
    reportesMensuales.getRange('N2:N500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(responsables).setAllowInvalid(true).build()
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

  const datos = sheet.getRange('A2:N50').getValues();
  const cohortes = [];
  datos.forEach(fila => {
    // Columna A = nombre, Columna N (índice 13) = estado
    if (fila[0] && fila[0].toString().trim() !== '' && fila[13] === 'Activa') {
      cohortes.push(fila[0].toString().trim());
    }
  });
  return cohortes;
}

function obtenerCohortesActuales() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Cohortes');
  if (!sheet) return CONFIG_TECH.COHORTES;

  const datos = sheet.getRange('A2:A50').getValues();
  const cohortes = [];
  datos.forEach(fila => {
    if (fila[0] && fila[0].toString().trim() !== '') {
      cohortes.push(fila[0].toString().trim());
    }
  });
  return cohortes.length > 0 ? cohortes : CONFIG_TECH.COHORTES;
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
  return CONFIG_TECH.RESPONSABLES;
}

function guardarResponsables(responsables) {
  const props = PropertiesService.getDocumentProperties();
  props.setProperty('RESPONSABLES', JSON.stringify(responsables));
}

function aplicarFormatos() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Formato para Entrevistas - Estado (columna dinámica)
  const entrevistas = ss.getSheetByName('Entrevistas');
  if (entrevistas) {
    const headersEnt2 = entrevistas.getRange(1, 1, 1, entrevistas.getLastColumn()).getValues()[0];
    const colEstadoEnt = headersEnt2.indexOf('Estado') + 1;
    const colLetra = colEstadoEnt > 0
      ? String.fromCharCode(64 + colEstadoEnt)
      : 'N'; // fallback columna N
    const rangoEstadoEnt = entrevistas.getRange(colLetra + '2:' + colLetra + '500');

    const reglaAprobada = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Seleccionada/o').setBackground('#c8e6c9').setRanges([rangoEstadoEnt]).build();
    const reglaPendiente = SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('Pendiente').setBackground('#fff9c4').setRanges([rangoEstadoEnt]).build();
    const reglaNoAsistioNoAprobo = SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains('No seleccionada/o').setBackground('#ffcdd2').setRanges([rangoEstadoEnt]).build();
    const reglaNoAsistio = SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains('No asistió').setBackground('#ffcdd2').setRanges([rangoEstadoEnt]).build();
    const reglaProgramacion = SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains('Próxima cohorte Programación').setBackground('#bbdefb').setRanges([rangoEstadoEnt]).build();
    const reglaAlfaDigital = SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains('Próxima cohorte Alfa Digital').setBackground('#dcedc8').setRanges([rangoEstadoEnt]).build();

    entrevistas.setConditionalFormatRules([reglaAprobada, reglaPendiente, reglaNoAsistioNoAprobo, reglaNoAsistio, reglaProgramacion, reglaAlfaDigital]);
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

function alEditarTech(e) {
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
    // Autocompletar cuando editan DPI (col D=4) o Nombre (col E=5)
    if (columna === 4 || columna === 5) {
      autocompletarDesdeCreamosID(true);
    }

    // Detectar por nombre de columna (más robusto)
    const headerHI = sheet.getRange(1, columna).getValue().toString().trim();

    // Estado en Hoja de Interés
    if (headerHI === 'Estado') {
      if (val === 'Reprogramada') {
        manejarReprogramadaEnHojaInteres(sheet, fila);
        return;
      }
      procesarCambioEstadoInteres(sheet, fila, val);
      return;
    }

    // 2da Llamada - si selecciona Reprogramada, cambiar automáticamente Estado a No interesada/o
    if (headerHI === '2da Llamada' && val === 'Reprogramada') {
      const colEstado = obtenerMapaColumnas(sheet)['estado'];
      if (colEstado !== undefined) {
        sheet.getRange(fila, colEstado + 1).setValue('No interesada/o');
      }
    }

    // ¿Tiene Hoja de Interés? (mantener la lógica original si existe)
    if (columna === 17 && (val === 'Sí' || val === 'No')) {
      procesarMarcaHojaInteres(sheet, fila, val);
    }
  }

  // === ENTREVISTAS ===
  // Busca "Estado" por nombre de columna (puede ser N=14 o O=15 según estructura)
  if (hoja === 'Entrevistas') {
    const headerEditado = sheet.getRange(1, columna).getValue();
    if (headerEditado === 'Estado') {
      if (val === 'Derivación a Programas' || val === '🔗 Abrir Formulario') {
        abrirFormularioKobo(sheet, fila, columna);
        return;
      }
      if (val === 'Enviar a A y B') {
        enviarAOtroProgramaDesdeEntrevistas(sheet, fila, columna, 'AyB');
        return;
      }
      procesarResultadoEntrevista(sheet, fila, val);
      if (val === 'Derivar a Paso a Paso') {
        derivarApasoAPaso(sheet, fila);
      }
    }
  }

  // === INSCRITX ===
  if (hoja === 'Inscritx') {
    const headerInsc = sheet.getRange(1, columna).getValue().toString().trim();
    if (headerInsc === 'Enviar a Cohorte' && val !== '') {
      procesarEnvioACohorte(sheet, fila, val);
    }
  }

  // === COHORTES ===
  if (hoja === 'Cohortes') {
    const headerCoh = sheet.getRange(1, columna).getValue().toString().trim();
    if (headerCoh === 'Estado' && val === 'Finalizada') {
      procesarFinalizacionCohorte(sheet, fila);
    }
  }

  // === NO INSCRITX ===
  if (hoja === 'No Inscritx') {
    const headerNoIns = sheet.getRange(1, columna).getValue().toString().trim();
    if (headerNoIns === 'Acción' && val.startsWith('Reenviar')) {
      procesarReenvioDesdeNoInscritx(sheet, fila, val);
    }
  }

  // === RETIRADX ===
  if (hoja === 'Retiradx') {
    const headerRet = sheet.getRange(1, columna).getValue().toString().trim();
    if (headerRet === 'Acción' && val === 'Reenviar a Inscritx') {
      procesarReenvioDesdeRetiradx(sheet, fila);
    }
  }

  // === REFERENCIAS DE PROGRAMAS ===
  // ¿Se realizó hoja de interés? - verificar y marcar con colores
  // Mantiene compatibilidad con "Referencias IL" (legacy)
  if (hoja === 'Referencias de Programas' || hoja === 'Referencias IL') {
    const tituloColumna = sheet.getRange(1, columna).getValue().toString().trim();
    if (tituloColumna === '¿Se realizó hoja de interés?' && (val === 'Se realizó hoja de interés' || val === 'No')) {
      if (typeof procesarAccionReferencias === 'function') {
        procesarAccionReferencias(sheet, fila, val);
      }
    }
  }

  // === HOJAS DE COHORTES INDIVIDUALES ===
  const hojasPrincipales = ['Hoja de Interés', 'Entrevistas', 'Inscritx', 'Cohortes',
                            'Graduadx', 'Retiradx', 'No Inscritx', 'Reporte', 'Reportes Mensuales',
                            'Lista Definitiva', 'Detalle Entrevistas', 'Referencias IL', 'Referencias de Programas'];
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
    // Estado está en columna K (11) - "Graduadx" o "Retiradx"
    if (columna === 11) {
      if (val === 'Graduadx') {
        procesarGraduacionIndividual(sheet, fila, hoja);
      } else if (val === 'Retiradx') {
        procesarDesercionEnCohorte(sheet, fila, hoja);
      }
    }
  }
}

/**
 * Maneja la selección de "Reprogramada" en Estado de Hoja de Interés
 * Pregunta si ya hizo seguimiento por mensaje y guarda el comentario
 */
function manejarReprogramadaEnHojaInteres(sheet, fila) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(0)) return;
  try {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Pregunta inicial
  const resp = ui.alert(
    '📞 Reprogramar seguimiento',
    '¿Ya hizo seguimiento por mensaje?',
    ui.ButtonSet.YES_NO
  );

  if (resp !== ui.Button.YES) {
    return;
  }

  // Pedir comentario
  const comentario = ui.prompt('Escriba el comentario del seguimiento:');
  if (!comentario) return;

  // Guardar en Notas/Comentario
  const colMap = obtenerMapaColumnas(sheet);
  const colNotas = colMap['notas/comentario'] || colMap['notas'];
  if (colNotas !== undefined) {
    const notasActuales = sheet.getRange(fila, colNotas + 1).getValue().toString().trim();
    const fecha = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy');
    const nuevaNota = notasActuales ? notasActuales + ' | [' + fecha + '] ' + comentario : '[' + fecha + '] ' + comentario;
    sheet.getRange(fila, colNotas + 1).setValue(nuevaNota);
  }

  ss.toast('✅ Seguimiento registrado', 'Reprogramada', 3);
  } finally { lock.releaseLock(); }
}

/**
 * Procesa cambio de estado en Hoja de Interés
 * - "No interesada/o" → Copia a No Inscritx (conserva registro en Hoja de Interés)
 * - "Entrevista realizada" → Copia a Entrevistas (conserva registro en Hoja de Interés)
 */
function procesarCambioEstadoInteres(sheet, fila, estado) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(0)) return;
  try {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const colMapInteres = obtenerMapaColumnas(sheet);
  const maxCol = sheet.getLastColumn();
  const datos = sheet.getRange(fila, 1, 1, maxCol).getValues()[0];

  // Helper robusto para Hoja de Interés
  const getVal = (nombre) => {
    const norm = nombre.toLowerCase().replace(/[^a-z0-9]/g, '');
    const idx = colMapInteres[norm];
    let val = idx !== undefined ? datos[idx] : '';
    
    // Auto-normalizar nivel educativo al leerlo
    if (norm === 'niveleducativo') return normalizarNivelEducativo(val);
    return val;
  };

  const creamosId = getVal('Creamos ID');
  const nombreCompleto = getVal('Nombre Completo');

  Logger.log('>>>> TRASLADO DESDE INTERÉS (tech): ' + nombreCompleto + ' (' + creamosId + ')');
  Logger.log('     Nivel Educativo encontrado: ' + getVal('Nivel Educativo'));
  Logger.log('     Zona encontrada: ' + getVal('Zona'));

  // "Entrevista agendada" → lanzar flujo de llamadas (NO copiar a Entrevistas todavía)
  // El flujo decide si va a Entrevistas (contestó) o No Inscritx (no contestó)
  if (estado === 'Entrevista agendada') {
    flujoSeguimientoInterés(sheet, fila);
    return;
  }

  // "Entrevista realizada" → copiar a Entrevistas (llamado desde flujoSeguimientoInterés)
  if (estado === 'Entrevista realizada') {
    Logger.log('🔍 PROCESO: Copiando a Entrevistas...');

    // PASO 1: Autocompletar datos faltantes desde directorio SIEMPRE
    if (creamosId || nombreCompleto) {
      Logger.log('   📚 Autocompletando desde directorio...');
      const colMapInteres = obtenerMapaColumnas(sheet);
      autocompletarFilaDesdeDirectorio(sheet, fila, colMapInteres);
      SpreadsheetApp.flush();
    }

    // PASO 2: Re-leer datos frescos desde la hoja (post-autocompletado)
    const datosActualizados = sheet.getRange(fila, 1, 1, maxCol).getValues()[0];
    const getValFresh = (nombre) => {
      const norm = nombre.toLowerCase().replace(/[^a-z0-9]/g, '');
      const idx = colMapInteres[norm];
      let val = idx !== undefined ? datosActualizados[idx] : '';
      if (norm === 'niveleducativo') return normalizarNivelEducativo(val);
      return val ? val.toString().trim() : '';
    };

    const creamosIdFinal   = getValFresh('Creamos ID');
    const nombreFinal      = getValFresh('Nombre Completo');
    const dpiFinal         = getValFresh('DPI');
    const generoFinal      = getValFresh('Género');
    const edadFinal        = getValFresh('Edad');
    const telefonoFinal    = getValFresh('Teléfono');
    const nivelFinal       = getValFresh('Nivel Educativo');
    const zonaFinal        = getValFresh('Zona');

    Logger.log('   Datos finales: nombre="' + nombreFinal + '", cId="' + creamosIdFinal + '", zona="' + zonaFinal + '"');

    // Verificar que al menos existe nombre o Creamos ID
    if (!creamosIdFinal && !nombreFinal) {
      Logger.log('⚠️ ERROR: Falta Creamos ID Y Nombre — no se puede copiar');
      SpreadsheetApp.getUi().alert('⚠️ Falta información\n\nNecesita al menos "Creamos ID" o "Nombre Completo" para copiar a Entrevistas.');
      return;
    }

    if (!nombreFinal) {
      Logger.log('⚠️ ERROR: No se encontró el nombre en el directorio para ID: ' + creamosIdFinal);
      SpreadsheetApp.getUi().alert('⚠️ No se encontró el nombre\n\nEl Creamos ID "' + creamosIdFinal + '" no está en el directorio.\nVerifica que el ID sea correcto.');
      return;
    }

    const entrevistas = ss.getSheetByName('Entrevistas');
    if (!entrevistas) {
      SpreadsheetApp.getUi().alert('⚠️ No se encuentra la hoja "Entrevistas".');
      return;
    }

    const colMapEntrevistas = obtenerMapaColumnas(entrevistas);
    const nuevaFila = obtenerPrimeraFilaVacia(entrevistas, ['C', 'E']);
    Logger.log('   → Escribiendo en Entrevistas fila ' + nuevaFila);

    const numColsEnt = entrevistas.getLastColumn();
    const registro = new Array(numColsEnt).fill('');

    const mapping = {
      'Fecha Entrevista': new Date(),
      'Creamos ID':       creamosIdFinal,
      'DPI':              dpiFinal,
      'Nombre Completo':  nombreFinal,
      'Género':           generoFinal,
      'Edad':             edadFinal,
      'Teléfono':         telefonoFinal,
      'Nivel Educativo':  nivelFinal,
      'Zona':             zonaFinal
    };

    for (let [header, valor] of Object.entries(mapping)) {
      const norm = header.toLowerCase().replace(/[^a-z0-9]/g, '');
      const targetIdx = colMapEntrevistas[norm];
      if (targetIdx !== undefined) {
        registro[targetIdx] = valor;
        Logger.log('   ✓ ' + header + ' = "' + valor + '"');
      } else {
        Logger.log('   ✗ Columna "' + header + '" no encontrada en Entrevistas');
      }
    }

    try {
      entrevistas.getRange(nuevaFila, 1, 1, registro.length).setValues([registro]);
      SpreadsheetApp.flush();
      Logger.log('   ✅ Fila escrita en Entrevistas');
    } catch (e) {
      Logger.log('⚠️ ERROR escribiendo en Entrevistas: ' + e.message);
      SpreadsheetApp.getUi().alert('⚠️ Error al guardar en Entrevistas.\n\n' + e.message);
      return;
    }

    // Autocompletar la fila recién agregada en Entrevistas con datos del directorio
    autocompletarFilaDesdeDirectorio(entrevistas, nuevaFila, mapearColumnasParaAutocompletar(entrevistas));
    Logger.log('   ✅ Autocompletada fila en Entrevistas');

    sheet.getRange(fila, 1, 1, maxCol).setBackground('#e3f2fd');
    ss.toast('✅ ' + nombreFinal + ' → Entrevistas', 'Hoja de Interés', 5);
    Logger.log('✅ COMPLETADO: ' + nombreFinal + ' enviada/o a Entrevistas');
    return;
  }

  if (estado === 'No interesada/o' || estado === 'No interesado') {
    const noInscritx = ss.getSheetByName('No Inscritx');
    const colMapNoInsc = obtenerMapaColumnas(noInscritx);
    const nuevaFila = obtenerPrimeraFilaVacia(noInscritx, 'C');

    const numColsNoInsc = noInscritx.getLastColumn();
    const registro = new Array(numColsNoInsc).fill('');

    const mapping = {
      'Fecha': new Date(),
      'Creamos ID': creamosId,
      'Nombre Completo': nombreCompleto,
      'Género': getVal('Género'),
      'Edad': getVal('Edad'),
      'Teléfono': getVal('Teléfono'),
      'Nivel Educativo': getVal('Nivel Educativo'),
      'Zona': getVal('Zona'),
      'Etapa': 'Interés inicial',
      'Motivo': 'No interesada/o inicial',
      'Origen': 'Hoja de Interés',
      'Notas': getVal('Notas')
    };

    for (let [header, valor] of Object.entries(mapping)) {
      const norm = header.toLowerCase().replace(/[^a-z0-9]/g, '');
      const targetIdx = colMapNoInsc[norm];
      if (targetIdx !== undefined) registro[targetIdx] = valor;
    }

    try {
      noInscritx.getRange(nuevaFila, 1, 1, registro.length).setValues([registro]);
      SpreadsheetApp.flush();
    } catch (e) {
      Logger.log('⚠️ ERROR CRÍTICO escribiendo en No Inscritx (tech): ' + e.message);
      SpreadsheetApp.getUi().alert('⚠️ Error al guardar en No Inscritx. Por favor inténtalo nuevamente.\n\nDetalle: ' + e.message);
      return;
    }

    autocompletarFilaDesdeDirectorio(noInscritx, nuevaFila, mapearColumnasParaAutocompletar(noInscritx));

    sheet.getRange(fila, 1, 1, maxCol).setBackground('#ffe0b2');
    ss.toast('✅ Registrada/o en No Inscritx', 'Hoja de Interés', 4);
  }
  } finally { lock.releaseLock(); }
}

/**
 * Abre el flujo de seguimiento manual desde el menú
 * El usuario selecciona una fila en la Hoja de Interés
 */
function abrirFlujoSeguimientoManual() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getActiveSheet();
  const ui = SpreadsheetApp.getUi();

  if (sheet.getName() !== 'Hoja de Interés') {
    ui.alert('❌ Error', 'Por favor, selecciona una fila en la hoja "Hoja de Interés"', ui.ButtonSet.OK);
    return;
  }

  const fila = sheet.getActiveRange().getRow();
  if (fila <= 1) {
    ui.alert('❌ Error', 'Por favor, selecciona una fila de datos (no el encabezado)', ui.ButtonSet.OK);
    return;
  }

  flujoSeguimientoInterés(sheet, fila);
}

/**
 * Flujo automático en DOS PASOS para seguimiento en Hoja de Interés
 *
 * PRIMER CLIC "Entrevista agendada":
 *   - Pregunta: ¿Contestó 1ra Llamada?
 *   - Si SÍ → Guarda respuesta y FIN
 *   - Si NO → Pedir comentario/nota y FIN
 *
 * SEGUNDO CLIC "Entrevista agendada":
 *   - Verifica: ¿Mensaje está lleno?
 *   - Si SÍ → Pregunta: ¿Contestó 2da Llamada?
 *   - Si NO contesta 2da → Pedir nota y FIN
 *   - Si CONTESTA 2da → Envía a Entrevistas
 */
function flujoSeguimientoInterés(sheet, fila) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  const fecha = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');

  // ── Búsqueda robusta por nombre exacto de columna (no por clave normalizada) ──
  const hdrsRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const colPor = (nombre) => hdrsRow.findIndex(h => h.toString().trim() === nombre) + 1; // retorna col 1-based, 0 = no encontrada

  const cEst  = colPor('Estado');
  const c1ra  = colPor('1ra Llamada');
  const cCom1 = colPor('Comentario 1ra Llamada');
  const cMsg1 = colPor('Mensaje Enviado 1ra');
  const c2da  = colPor('2da Llamada');
  const cCom2 = colPor('Comentario 2da Llamada');

  const setVal = (col, valor) => { if (col > 0) sheet.getRange(fila, col).setValue(valor); };
  const getVal = (col) => col > 0 ? sheet.getRange(fila, col).getValue().toString().trim() : '';
  const clearEstado = () => setVal(cEst, '');

  // Si faltan las columnas clave, avisar y salir
  if (c1ra === 0 || c2da === 0) {
    ui.alert('⚠️ Columnas no encontradas',
      'No se encontraron las columnas "1ra Llamada" o "2da Llamada".\nEjecuta: Menú → Herramientas → 📋 Reorganizar columnas Hoja de Interés',
      ui.ButtonSet.OK);
    clearEstado();
    return;
  }

  const val1ra  = getVal(c1ra);
  const valMsg1 = getVal(cMsg1);
  const val2da  = getVal(c2da);

  // ═══════════════════════════════════════════════════════════════════════
  // PRIMER CLIC: 1ra Llamada aún vacía
  // ═══════════════════════════════════════════════════════════════════════
  if (val1ra === '') {
    const r1 = ui.alert(
      '📞 PASO 1 — 1ra Llamada',
      'SÍ → Contestó\nNO → No contestó\nCANCELAR → cancelar',
      ui.ButtonSet.YES_NO_CANCEL
    );
    if (r1 === ui.Button.CANCEL || r1 === ui.Button.CLOSE) { clearEstado(); return; }

    const resultado1 = r1 === ui.Button.YES ? 'Contestó' : 'No contestó';
    setVal(c1ra, resultado1 + ' (' + fecha + ')');

    // ══════════════════════════════════════════════════════════════════════
    // Si CONTESTÓ → va directo a Entrevistas (sin necesidad de mensaje)
    // ══════════════════════════════════════════════════════════════════════
    if (resultado1 === 'Contestó') {
      SpreadsheetApp.flush();
      const r1b = ui.alert(
        '✅ Contestó en 1ra Llamada',
        'SÍ → Agendar Entrevista\nNO → Continuar a 2da Llamada',
        ui.ButtonSet.YES_NO
      );

      if (r1b === ui.Button.YES) {
        procesarCambioEstadoInteres(sheet, fila, 'Entrevista realizada');
        clearEstado();
        return;
      } else {
        // Continuar a 2da Llamada (necesita mensaje)
        clearEstado();
        SpreadsheetApp.flush();
        ui.alert('📋 CONTINUAR CON 2da LLAMADA:\n\n' +
          '1. Escribe en "Mensaje Enviado 1ra" el texto enviado\n' +
          '2. Vuelve a seleccionar "Entrevista agendada"\n\n' +
          'Sistema continuará con 2da Llamada.',
          ui.ButtonSet.OK);
        return;
      }
    }

    // ══════════════════════════════════════════════════════════════════════
    // Si NO CONTESTÓ → necesita mensaje para 2da Llamada
    // ══════════════════════════════════════════════════════════════════════
    if (resultado1 === 'No contestó') {
      const rc = ui.prompt('📝 Comentario (opcional)', 'Ej: Teléfono apagado, no disponible...', ui.ButtonSet.OK_CANCEL);
      if (rc.getSelectedButton() !== ui.Button.CANCEL) {
        const nota = rc.getResponseText().trim();
        if (nota) setVal(cCom1, '[' + fecha + '] ' + nota);
      }
    }

    clearEstado();
    SpreadsheetApp.flush();
    ui.alert('📋 PASOS A SEGUIR:\n\n' +
      '1. Escribe en "Mensaje Enviado 1ra" el texto de WhatsApp enviado\n' +
      '2. Vuelve a seleccionar "Entrevista agendada" en Estado\n\n' +
      'Sistema continuará con la 2da Llamada.',
      ui.ButtonSet.OK);
    return;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SEGUNDO CLIC: Verificar si 1ra Llamada fue "Contestó"
  // Si sí → va directo a Entrevistas. Si no → continúa a 2da Llamada
  // ═══════════════════════════════════════════════════════════════════════
  if (valMsg1 === '') {
    ui.alert('⚠️ Falta el mensaje de WhatsApp',
      'Escribe en "Mensaje Enviado 1ra" el texto que enviaste.\nLuego vuelve a seleccionar "Entrevista agendada".',
      ui.ButtonSet.OK);
    clearEstado();
    return;
  }

  const val1raBase = val1ra.split('(')[0].trim().toLowerCase();

  // Si 1ra Llamada = "Contestó" → va directo a Entrevistas
  if (val1raBase === 'contestó') {
    procesarCambioEstadoInteres(sheet, fila, 'Entrevista realizada');
    clearEstado();
    return;
  }

  // Si 1ra Llamada = "No contestó" → continúa a 2da Llamada
  const val2daBase = val2da.split('(')[0].trim().toLowerCase();
  if (val2daBase === 'contestó' || val2daBase === 'no contestó') {
    ui.alert('ℹ️ Ya procesado', 'Esta persona ya tiene el resultado de la 2da llamada registrado.', ui.ButtonSet.OK);
    clearEstado();
    return;
  }

  const r2 = ui.alert(
    '📞 PASO 2 — 2da Llamada',
    'SÍ → Contestó  →  pasa a Entrevistas\nNO → No contestó  →  pasa a No Inscritx\nCANCELAR → Reprogramada / Pendiente',
    ui.ButtonSet.YES_NO_CANCEL
  );

  if (r2 === ui.Button.YES) {
    setVal(c2da, 'Contestó (' + fecha + ')');
    SpreadsheetApp.flush();
    procesarCambioEstadoInteres(sheet, fila, 'Entrevista realizada');

  } else if (r2 === ui.Button.NO) {
    setVal(c2da, 'No contestó (' + fecha + ')');
    const rc2 = ui.prompt('📝 Comentario (opcional)', 'Ej: No contesta, número inválido...', ui.ButtonSet.OK_CANCEL);
    if (rc2.getSelectedButton() !== ui.Button.CANCEL) {
      const nota2 = rc2.getResponseText().trim();
      if (nota2) setVal(cCom2, '[' + fecha + '] ' + nota2);
    }
    SpreadsheetApp.flush();
    procesarCambioEstadoInteres(sheet, fila, 'No interesada/o');

  } else if (r2 === ui.Button.CANCEL) {
    const r3 = ui.alert('¿Cuál es el estado?',
      'SÍ → Reprogramada\nNO → Pendiente', ui.ButtonSet.YES_NO);
    const est2 = r3 === ui.Button.YES ? 'Reprogramada' : 'Pendiente';
    setVal(c2da, est2 + ' (' + fecha + ')');
    clearEstado();
    SpreadsheetApp.flush();
    ss.toast('🔄 Estado: ' + est2 + ' — selecciona "Entrevista agendada" otra vez cuando reintentes.', 'Llamadas', 5);
  } else {
    clearEstado();
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
  
  // Obtener mapa de columnas robusto
  const colMapEntrevistas = obtenerMapaColumnas(sheet);
  const maxCol = sheet.getLastColumn();
  const datos = sheet.getRange(fila, 1, 1, maxCol).getValues()[0];
  
  // Buscar Creamos ID de forma flexible
  const creamosId = datos[colMapEntrevistas['creamosid']] || datos[colMapEntrevistas['creamos id']];

  // Helper disponible para TODOS los bloques de la función
  const getVal = (nombre) => {
    const norm = nombre.toLowerCase().replace(/[^a-z0-9]/g, '');
    const idx = colMapEntrevistas[norm];
    let val = idx !== undefined ? datos[idx] : '';
    if (norm === 'niveleducativo') return normalizarNivelEducativo(val);
    return val;
  };

  // "Próxima cohorte Programación/Alfa Digital" → igual que Seleccionada/o pero con nota de programa
  const esProximaCohorte = resultado === 'Próxima cohorte Programación' || resultado === 'Próxima cohorte Alfa Digital';

  if (resultado === 'Seleccionada/o' || resultado === 'Aprobada' || esProximaCohorte) {
    const interes = ss.getSheetByName('Hoja de Interés');
    const busqueda = creamosId ? buscarPorCreamosID(interes, creamosId) : null;
    const filaInteres = busqueda ? busqueda.fila : null;

    // Mover a Inscritx
    const seleccionadas = ss.getSheetByName('Inscritx');
    const colMapInscritx = obtenerMapaColumnas(seleccionadas);

    // ✅ DEDUP: Verificar si ya existe en Inscritx antes de escribir
    if (creamosId) {
      const datosInscritx = seleccionadas.getDataRange().getValues();
      const idxInscritxId = colMapInscritx['creamosid'];
      for (let r = 1; r < datosInscritx.length; r++) {
        const idExistente = idxInscritxId !== undefined ? (datosInscritx[r][idxInscritxId] || '').toString().trim() : '';
        if (idExistente && idExistente === creamosId.toString().trim()) {
          ss.toast('⚠️ ' + (datos[colMapEntrevistas['nombrecompleto']] || creamosId) + ' ya está en Inscritx', 'Duplicado omitido', 5);
          return;
        }
      }
    }

    const nuevaFila = obtenerPrimeraFilaVacia(seleccionadas, ['B', 'D']);

    // Preparar registro para Inscritx de forma dinámica
    const numColumnasInscritx = seleccionadas.getLastColumn();
    const registroInscritx = new Array(numColumnasInscritx).fill('');

    Logger.log('>>>> TRASLADO DESDE ENTREVISTAS (' + resultado + ' - tech): ' + getVal('Nombre Completo') + ' (' + creamosId + ')');
    Logger.log('     Nivel Educativo: ' + getVal('Nivel Educativo'));
    Logger.log('     Zona: ' + getVal('Zona'));

    // Para "Próxima cohorte" se agrega nota del programa en Notas
    const notaBase = getVal('Observaciones');
    let notaFinal = notaBase;
    if (esProximaCohorte) {
      const etiqueta = resultado === 'Próxima cohorte Programación' ? '[Próxima cohorte Programación]' : '[Próxima cohorte Alfa Digital]';
      notaFinal = notaBase ? etiqueta + ' ' + notaBase : etiqueta;
    }

    // Mapeo dinámico robusto Entrevistas → Inscritx
    const mapping = {
      'Creamos ID': creamosId || '',
      'No.': nuevaFila - 1,
      'DPI': getVal('DPI'),
      'Nombre Completo': getVal('Nombre Completo'),
      'Género': getVal('Género'),
      'Edad': getVal('Edad'),
      'Teléfono': getVal('Teléfono'),
      'Nivel Educativo': getVal('Nivel Educativo'),
      'Zona': getVal('Zona'),
      'Notas': notaFinal,
      'Estado': 'Inscritx'
    };

    // Llenar el registro usando el mapa de destino (también robusto)
    for (let [header, valor] of Object.entries(mapping)) {
      const norm = header.toLowerCase().replace(/[^a-z0-9]/g, '');
      const targetIdx = colMapInscritx[norm];
      if (targetIdx !== undefined) registroInscritx[targetIdx] = valor;
    }

    // Fecha de ingreso a Inscritx para medición mensual
    const idxFechaEnvioInscritx = colMapInscritx['fechaenvioainscritx'];
    Logger.log('🔍 DEBUG colMapInscritx keys: ' + Object.keys(colMapInscritx).join(', '));
    Logger.log('🔍 DEBUG buscando: fechaenvioainscritx = ' + idxFechaEnvioInscritx);
    if (idxFechaEnvioInscritx !== undefined && !registroInscritx[idxFechaEnvioInscritx]) {
      registroInscritx[idxFechaEnvioInscritx] = new Date();
      Logger.log('✅ Fecha de Inscritx puesta en índice ' + idxFechaEnvioInscritx);
    } else {
      Logger.log('⚠️ No se puso fecha: idx=' + idxFechaEnvioInscritx + ', valor ya existe=' + !!registroInscritx[idxFechaEnvioInscritx]);
    }

    Logger.log('     Escribiendo en Inscritx (tech): ' + JSON.stringify(registroInscritx));
    try {
      seleccionadas.getRange(nuevaFila, 1, 1, registroInscritx.length).setValues([registroInscritx]);
      SpreadsheetApp.flush();
    } catch (e) {
      Logger.log('⚠️ Error de validación en Inscritx (tech): ' + e.message);
      seleccionadas.getRange(nuevaFila, 1, 1, registroInscritx.length).setValues([registroInscritx]);
    }

    // Autocompletar campos vacíos usando el adaptador robusto
    autocompletarFilaDesdeDirectorio(seleccionadas, nuevaFila, mapearColumnasParaAutocompletar(seleccionadas));

    // Marcar procesado
    if (filaInteres) {
      interes.getRange(filaInteres, 1, 1, interes.getLastColumn()).setBackground('#c8e6c9');
    }
    sheet.getRange(fila, 1, 1, maxCol).setBackground('#c8e6c9');

    const toastMsg = esProximaCohorte
      ? '✅ ' + resultado + ' — copiada a Inscritx con nota de programa.'
      : '✅ Aprobada - copiada a Inscritx. (Mapeo Robusto V2.5)';
    ss.toast(toastMsg, 'Entrevista', 4);
    return;
  }

  if (resultado === 'No seleccionada/o' || resultado === 'No asistió' ||
      resultado === 'No asistió / No aprobó' || resultado === 'No aprobada') {
    const noInscritx = ss.getSheetByName('No Inscritx');
    const colMapNoInscritx = obtenerMapaColumnas(noInscritx);
    const nuevaFila = obtenerPrimeraFilaVacia(noInscritx, 'C');

    const motivo = 'No asistió / No aprobó';

    const numColsNoInsc = noInscritx.getLastColumn();
    const registro = new Array(numColsNoInsc).fill('');
    
    // Helper para mapear de forma robusta a No Inscritx
    const mapping = {
      'Fecha': new Date(),
      'Creamos ID': creamosId,
      'Nombre Completo': getVal('Nombre Completo'),
      'Género': getVal('Género'),
      'Edad': getVal('Edad'),
      'Teléfono': getVal('Teléfono'),
      'Nivel Educativo': getVal('Nivel Educativo'),
      'Zona': getVal('Zona'),
      'Etapa': 'Post-entrevista',
      'Motivo': motivo,
      'Origen': 'Entrevistas',
      'Notas': getVal('Observaciones')
    };

    for (let [header, valor] of Object.entries(mapping)) {
      const norm = header.toLowerCase().replace(/[^a-z0-9]/g, '');
      const targetIdx = colMapNoInscritx[norm];
      if (targetIdx !== undefined) registro[targetIdx] = valor;
    }

    try {
      noInscritx.getRange(nuevaFila, 1, 1, registro.length).setValues([registro]);
      noInscritx.getRange(nuevaFila, 1, 1, registro.length).setBackground('#ffe0b2');
      SpreadsheetApp.flush();
    } catch (e) {
      Logger.log('⚠️ Error escribiendo en No Inscritx (No Aprobada - tech): ' + e.message);
      noInscritx.getRange(nuevaFila, 1, 1, registro.length).setValues([registro]);
    }

    sheet.getRange(fila, 1, 1, colMapEntrevistas ? sheet.getLastColumn() : 1).setBackground('#ffe0b2');
    ss.toast('📋 Copiado a "No Inscritx" (registro conservado - Mapeo Dinámico)', 'Entrevista', 3);
  }
}

/**
 * Muestra panel con datos de la persona listos para copiar al formulario Kobo.
 */
function abrirFormularioKobo(sheet, fila, columna) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(0)) return;
  try {
  sheet.getRange(fila, columna).setValue('');

  const colMap = obtenerMapaColumnas(sheet);
  const datos = sheet.getRange(fila, 1, 1, sheet.getLastColumn()).getValues()[0];
  const getVal = (nombre) => {
    const norm = nombre.toLowerCase().replace(/[^a-z0-9]/g, '');
    const idx = colMap[norm];
    const v = idx !== undefined ? datos[idx] : '';
    return (v === null || v === undefined) ? '' : v.toString().trim();
  };

  const programa    = CONFIG_TECH.PROGRAMA_NOMBRE;
  const urlForm     = CONFIG_TECH.KOBO_FORMULARIO_URL;
  const nombre      = getVal('Nombre Completo') || '—';
  const responsable = getVal('Entrevistador') || '—';

  const filas = [
    ['Programa',          programa],
    ['Responsable',       responsable],
    ['Ya es participante','si'],
    ['Creamos ID',        getVal('Creamos ID')],
    ['Nombre completo',   nombre],
    ['DPI / CUI',         getVal('DPI')],
    ['Edad',              getVal('Edad')],
    ['Género',            getVal('Género')],
    ['Teléfono',          getVal('Teléfono')],
    ['Zona residencia',   getVal('Zona')],
    ['Programa destino',  programa],
    ['Nivel educativo',   getVal('Nivel Educativo')]
  ].filter(([, v]) => v !== '');

  const filasHtml = filas.map(([label, val]) =>
    '<tr>' +
    '<td style="padding:4px 8px;color:#546e7a;font-size:12px;white-space:nowrap;">' + label + '</td>' +
    '<td style="padding:4px 8px;font-size:13px;font-weight:500;max-width:160px;overflow:hidden;text-overflow:ellipsis;" title="' + val + '">' + val + '</td>' +
    '<td style="padding:4px 4px;">' +
    '<button onclick="navigator.clipboard.writeText(\'' + val.replace(/'/g, "\\'") + '\').then(()=>{this.textContent=\'✅\';setTimeout(()=>this.textContent=\'📋\',1200)})" ' +
    'style="border:none;background:#e3f2fd;border-radius:4px;cursor:pointer;padding:3px 7px;font-size:12px;">📋</button>' +
    '</td></tr>'
  ).join('');

  const html = HtmlService.createHtmlOutput(
    '<div style="font-family:Arial,sans-serif;padding:12px;">' +
    '<div style="text-align:center;margin-bottom:12px;">' +
    '<a href="' + urlForm + '" target="_blank" ' +
    'style="display:inline-block;background:#1976d2;color:white;padding:11px 22px;' +
    'text-decoration:none;border-radius:8px;font-size:14px;font-weight:bold;">' +
    '🔗 Abrir Formulario Kobo</a>' +
    '</div>' +
    '<p style="color:#78909c;font-size:11px;text-align:center;margin:0 0 10px;">' +
    'Clic en 📋 para copiar cada dato y pegarlo en el formulario</p>' +
    '<table style="width:100%;border-collapse:collapse;background:#fafafa;border-radius:6px;overflow:hidden;">' +
    '<tr style="background:#1565c0;">' +
    '<th style="padding:6px 8px;color:white;font-size:11px;text-align:left;">Campo</th>' +
    '<th style="padding:6px 8px;color:white;font-size:11px;text-align:left;">Valor</th>' +
    '<th style="padding:6px 4px;color:white;font-size:11px;">Copiar</th>' +
    '</tr>' +
    filasHtml +
    '</table>' +
    '<div style="text-align:center;margin-top:10px;">' +
    '<button id="copyAll" onclick="copyAll()" ' +
    'style="border:none;background:#e8f5e9;border-radius:6px;cursor:pointer;padding:7px 16px;font-size:12px;color:#2e7d32;font-weight:bold;">' +
    '📋 Copiar todos los datos</button>' +
    '</div>' +
    '<p id="logStatus" style="color:#78909c;font-size:11px;text-align:center;margin:6px 0 0;height:16px;"></p>' +
    '<script>' +
    'var datosParaLog=' + JSON.stringify(Object.fromEntries(filas)) + ';' +
    'function copyAll(){' +
    'const rows=[' + filas.map(([l,v]) => '["'+l.replace(/"/g,'\\"')+'","'+v.replace(/"/g,'\\"')+'"]').join(',') + '];' +
    'const txt=rows.map(r=>r[0]+": "+r[1]).join("\\n");' +
    'navigator.clipboard.writeText(txt).then(()=>{' +
    'document.getElementById("copyAll").textContent="✅ Copiado!";' +
    'setTimeout(()=>document.getElementById("copyAll").textContent="📋 Copiar todos los datos",2000);' +
    'google.script.run' +
    '.withSuccessHandler(function(){document.getElementById("logStatus").textContent="📝 Registro guardado";})' +
    '.withFailureHandler(function(){document.getElementById("logStatus").textContent="⚠️ No se pudo guardar el registro";})' +
    '.registrarEnvioKoboTech(datosParaLog);' +
    '});' +
    '}' +
    '</script>' +
    '</div>'
  ).setWidth(400).setHeight(545);
  SpreadsheetApp.getUi().showModalDialog(html, '📋 Datos para Formulario — ' + nombre);
  } finally { lock.releaseLock(); }
}

/**
 * Guarda un registro en "Registro Formulario Kobo" cada vez que se copian
 * todos los datos. Solo se llama si el usuario hizo clic en "Copiar todos".
 */
function registrarEnvioKoboTech(datos) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = ss.getSheetByName('Registro Formulario Kobo');

  if (!hoja) {
    hoja = ss.insertSheet('Registro Formulario Kobo');
    const headers = [
      'Fecha y Hora', 'Usuario', 'Creamos ID', 'Nombre Completo',
      'Programa', 'Responsable', 'Teléfono', 'DPI / CUI',
      'Zona', 'Nivel Educativo'
    ];
    hoja.getRange(1, 1, 1, headers.length).setValues([headers])
      .setBackground('#1565c0').setFontColor('white').setFontWeight('bold');
    hoja.setFrozenRows(1);
    [180, 160, 130, 200, 140, 120, 100, 120, 100, 160].forEach((w, i) => hoja.setColumnWidth(i + 1, w));
  }

  hoja.appendRow([
    new Date(),
    Session.getActiveUser().getEmail() || '—',
    datos['Creamos ID']      || '',
    datos['Nombre completo'] || '',
    datos['Programa']        || '',
    datos['Responsable']     || '',
    datos['Teléfono']        || '',
    datos['DPI / CUI']       || '',
    datos['Zona residencia'] || '',
    datos['Nivel educativo'] || ''
  ]);
}

/**
 * Copia una fila de Entrevistas a la hoja "Paso a Paso" con color azul claro
 * Se ejecuta cuando el Estado cambia a "Derivar a Paso a Paso"
 */
function derivarApasoAPaso(entrevistasSheet, fila) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let pasoAPasoSheet = ss.getSheetByName('Paso a Paso');

  if (!pasoAPasoSheet) {
    crearHojaPasoAPaso();
    pasoAPasoSheet = ss.getSheetByName('Paso a Paso');
  }

  // Obtener la fila completa de Entrevistas
  const maxCol = entrevistasSheet.getLastColumn();
  const datosCompletos = entrevistasSheet.getRange(fila, 1, 1, maxCol).getValues()[0];

  // Buscar primera fila vacía en Paso a Paso
  const pasoData = pasoAPasoSheet.getDataRange().getValues();
  let filaDestino = pasoData.length + 1;

  // Copiar la fila
  pasoAPasoSheet.getRange(filaDestino, 1, 1, datosCompletos.length).setValues([datosCompletos]);

  // Colorear la fila con azul claro
  pasoAPasoSheet.getRange(filaDestino, 1, 1, maxCol).setBackground('#bbdefb');
  pasoAPasoSheet.getRange(filaDestino, 1, 1, maxCol).setFontColor('#000000');

  // Cambiar el Estado a "Derivada" en la fila copiada
  pasoAPasoSheet.getRange(filaDestino, 15).setValue('Derivada');

  ss.toast('✅ Derivada a Paso a Paso', 'Fila copiada', 3);
}

/**
 * Procesa deserción desde hoja individual de Cohorte
 * Pregunta motivo y mueve a Retiradx
 */
function procesarDesercionEnCohorte(sheet, fila, nombreCohorte) {
  // Guard 1: LockService — si otro trigger ya está ejecutando, salir de inmediato (sin esperar)
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(0)) {
    Logger.log('⚠️ procesarDesercionEnCohorte: doble trigger detectado, omitiendo segunda ejecución');
    return;
  }

  // Guard 2: Re-leer celda para confirmar que sigue siendo 'Retiradx'
  const estadoCelda = sheet.getRange(fila, 11).getValue();
  if (estadoCelda !== 'Retiradx') {
    lock.releaseLock();
    return;
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  // Datos de la hoja de cohorte: Fecha, No, CreamosID, DPI, Nombre, Género, Edad, Tel, NivelEdu, Zona, Estado, Año
  const datos = sheet.getRange(fila, 1, 1, 12).getValues()[0];
  const creamosId = datos[2];
  const nombre = datos[4];

  // Mostrar motivos de deserción
  let listaMotivos = '';
  CONFIG_TECH.MOTIVOS_DESERCION.forEach(function(motivo, idx) {
    listaMotivos += (idx + 1) + '. ' + motivo + '\n';
  });

  const respuesta = ui.prompt(
    '📋 Deserción - ' + nombre,
    'Seleccione el MOTIVO:\n\n' + listaMotivos + '\nIngrese el número:',
    ui.ButtonSet.OK_CANCEL
  );

  if (respuesta.getSelectedButton() !== ui.Button.OK) {
    sheet.getRange(fila, 11).setValue(''); // Limpiar Estado
    lock.releaseLock();
    return;
  }

  const num = parseInt(respuesta.getResponseText().trim());
  if (isNaN(num) || num < 1 || num > CONFIG_TECH.MOTIVOS_DESERCION.length) {
    ui.alert('Número inválido');
    sheet.getRange(fila, 11).setValue(''); // Limpiar Estado
    lock.releaseLock();
    return;
  }

  const motivo = CONFIG_TECH.MOTIVOS_DESERCION[num - 1];

  // Agregar a Retiradx
  // Columnas: Fecha, CreamosID, DPI, Nombre, Género, Edad, Tel, NivelEdu, Zona, Cohorte, Motivo, Notas, Acción
  const deserciones = ss.getSheetByName('Retiradx');
  const nuevaFila = obtenerPrimeraFilaVacia(deserciones, ['B', 'D']);  // Columnas B=CreamosID y D=Nombre (evita sobrescritura en ambos casos)

  const registro = [
    new Date(),
    datos[2],                                   // Creamos ID
    datos[3],                                   // DPI
    datos[4],                                   // Nombre
    datos[5] || '',                             // Género
    datos[6],                                   // Edad
    datos[7],                                   // Teléfono
    normalizarNivelEducativo(datos[8]),          // Nivel Educativo (Normalizado)
    datos[9] || '',                             // Zona
    nombreCohorte,                              // Cohorte
    motivo,                                     // Motivo
    '',                                         // Notas
    ''                                          // Acción (vacío)
  ];

  try {
    deserciones.getRange(nuevaFila, 1, 1, 13).setValues([registro]);
    SpreadsheetApp.flush();
  } catch (e) {
    Logger.log('⚠️ ERROR CRÍTICO escribiendo en Retiradx (tech): ' + e.message);
    SpreadsheetApp.getUi().alert('⚠️ Error al guardar deserción en Retiradx. Por favor inténtalo nuevamente.\n\nDetalle: ' + e.message);
    return; // ❌ NO REINTENTAR - puede sobrescribir datos
  }

  // Autocompletar campos vacíos desde Directorio Maestro
  // Retiradx: B[1]=CreamosID, C[2]=DPI, D[3]=Nombre, F[5]=Edad, H[7]=NivelEducativo, I[8]=Zona
  autocompletarFilaDesdeDirectorio(deserciones, nuevaFila,
    { creamosId: 1, dpi: 2, nombre: 3, edad: 5, nivelEducativo: 7, zona: 8 });

  // Marcar fila como Deserción (NO eliminar - conservar registro)
  sheet.getRange(fila, 1, 1, 12).setBackground('#ffcdd2'); // Rojo claro

  ss.toast('📋 Deserción: ' + nombre + ' — ' + motivo + '\n⚠️ Recuerda actualizar Salesforce.', 'Cohorte ' + nombreCohorte, 6);

  // Enviar email a Eva con recordatorio de Salesforce
  enviarEmailDesercionEva(nombre, nombreCohorte, motivo, creamosId);
  lock.releaseLock();
}

/**
 * Procesa reenvío desde No Inscritx
 * - "Reenviar a Entrevistas" → Crea entrada en Entrevistas
 * - "Reenviar a Inscritx" → Crea entrada en Inscritx
 */
function procesarReenvioDesdeNoInscritx(sheet, fila, accion) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Columnas: Fecha, CreamosID, Nombre, Género, Edad, Tel, Etapa, Motivo, Origen, Notas, Acción
  const datos = sheet.getRange(fila, 1, 1, 11).getValues()[0];
  const creamosId = datos[1];
  const nombre = datos[2];
  const genero = datos[3];
  const edad = datos[4];
  const telefono = datos[5];
  const origen = datos[8];
  const notas = datos[9];

  if (accion === 'Reenviar a Entrevistas') {
    const entrevistas = ss.getSheetByName('Entrevistas');
    const colMapEntrevistas = obtenerMapaColumnas(entrevistas);
    const nuevaFila = obtenerPrimeraFilaVacia(entrevistas, ['C', 'E']);  // Columnas C=CreamosID y E=Nombre (evita sobrescritura en ambos casos)

    // Buscar datos adicionales en Hoja de Interés
    const interes = ss.getSheetByName('Hoja de Interés');
    const busqueda = buscarPorCreamosID(interes, creamosId);
    const datosInteres = busqueda ? busqueda.datos : null;

    const mapping = {
      'Fecha Entrevista': new Date(),  // Agregar fecha de reenvío
      'Creamos ID': creamosId,
      'DPI': datosInteres ? datosInteres[3] : '',
      'Nombre Completo': nombre,
      'Género': genero,
      'Edad': datosInteres ? datosInteres[6] : '',
      'Teléfono': telefono,
      'Nivel Educativo': normalizarNivelEducativo(datosInteres ? datosInteres[8] : ''),
      'Zona': datosInteres ? datosInteres[9] : '',
      'Entrevistador': 'Eva',
      'Observaciones': 'Reingreso desde No Inscritx - ' + notas,  // Columna correcta es 'Observaciones', no 'Notas'
      'Estado': ''
    };

    const numColsEnt = entrevistas.getLastColumn();
    const registro = new Array(numColsEnt).fill('');
    for (let [header, valor] of Object.entries(mapping)) {
      const norm = header.toLowerCase().replace(/[^a-z0-9]/g, '');
      const targetIdx = colMapEntrevistas[norm];
      if (targetIdx !== undefined) registro[targetIdx] = valor;
    }

    try {
      entrevistas.getRange(nuevaFila, 1, 1, registro.length).setValues([registro]);
      SpreadsheetApp.flush();
    } catch (e) {
      Logger.log('⚠️ Error reenvío a Entrevistas (tech): ' + e.message);
      entrevistas.getRange(nuevaFila, 1, 1, registro.length).setValues([registro]);
    }

    ss.toast('✅ ' + nombre + ' reenviada a Entrevistas', 'Reenvío', 4);
    sheet.getRange(fila, 11).setValue(''); 
    sheet.getRange(fila, 1, 1, 11).setBackground('#e0e0e0'); 
  }

  if (accion === 'Reenviar a Inscritx') {
    const seleccionadas = ss.getSheetByName('Inscritx');
    const colMapInscritx = obtenerMapaColumnas(seleccionadas);
    const nuevaFila = obtenerPrimeraFilaVacia(seleccionadas, ['B', 'D']);  // Columnas B=CreamosID y D=Nombre (evita sobrescritura en ambos casos)

    // Buscar datos adicionales en Hoja de Interés
    const interes = ss.getSheetByName('Hoja de Interés');
    const busqueda = buscarPorCreamosID(interes, creamosId);
    const datosInteres = busqueda ? busqueda.datos : null;

    const mapping = {
      'No.': nuevaFila - 1,
      'Creamos ID': creamosId,
      'Nombre Completo': nombre,
      'Género': genero,
      'Edad': edad || (datosInteres ? datosInteres[6] : ''),
      'Teléfono': telefono,
      'Nivel Educativo': normalizarNivelEducativo(datosInteres ? datosInteres[8] : ''),
      'Zona': datosInteres ? datosInteres[9] : '',
      'Notas': 'Reingreso desde No Inscritx - ' + notas,
      'Estado': 'Inscritx'
    };

    const numColsInsc = seleccionadas.getLastColumn();
    const registro = new Array(numColsInsc).fill('');
    for (let [header, valor] of Object.entries(mapping)) {
      const norm = header.toLowerCase().replace(/[^a-z0-9]/g, '');
      const targetIdx = colMapInscritx[norm];
      if (targetIdx !== undefined) registro[targetIdx] = valor;
    }

    try {
      seleccionadas.getRange(nuevaFila, 1, 1, registro.length).setValues([registro]);
      SpreadsheetApp.flush();
    } catch (e) {
      Logger.log('⚠️ Error reenvío a Inscritx (tech): ' + e.message);
      seleccionadas.getRange(nuevaFila, 1, 1, registro.length).setValues([registro]);
    }

    autocompletarFilaDesdeDirectorio(seleccionadas, nuevaFila, mapearColumnasParaAutocompletar(seleccionadas));

    ss.toast('✅ ' + nombre + ' reenviada a Inscritx', 'Reenvío', 4);
    sheet.getRange(fila, 11).setValue(''); 
    sheet.getRange(fila, 1, 1, 11).setBackground('#e0e0e0'); 
  }
}

/**
 * Procesa reenvío desde Retiradx a Inscritx
 */
function procesarReenvioDesdeRetiradx(sheet, fila) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Columnas: Fecha, CreamosID, DPI, Nombre, Género, Edad, Tel, NivelEdu, Zona, Cohorte, Motivo, Notas, Acción
  const datos = sheet.getRange(fila, 1, 1, 13).getValues()[0];
  const creamosId = datos[1];
  const dpi = datos[2];
  const nombre = datos[3];
  const genero = datos[4];
  const edad = datos[5];
  const telefono = datos[6];
  const nivelEducativo = datos[7];
  const zona = datos[8];
  const cohorteAnterior = datos[9];
  const notas = datos[11];

  const seleccionadas = ss.getSheetByName('Inscritx');
  const nuevaFila = obtenerPrimeraFilaVacia(seleccionadas, ['B', 'D']);  // Columnas B=CreamosID y D=Nombre (evita sobrescritura en ambos casos)

  // Columnas: No, CreamosID, DPI, Nombre, Género, Edad, Tel, NivelEdu, Zona, Notas, Estado, EnviarACohorte
  const registro = [
    nuevaFila - 1,
    creamosId,
    dpi,
    nombre,
    genero,
    edad || '',       // Edad
    telefono,
    normalizarNivelEducativo(nivelEducativo),
    zona || '',       // Zona
    'Reingreso desde Deserción (' + cohorteAnterior + ') - ' + notas,
    'Inscritx',       // Estado
    ''                // Enviar a Cohorte
  ];

  try {
    seleccionadas.getRange(nuevaFila, 1, 1, 12).setValues([registro]);
    SpreadsheetApp.flush();
  } catch (e) {
    Logger.log('⚠️ Error reenvío desde Retiradx (tech): ' + e.message);
    seleccionadas.getRange(nuevaFila, 1, 1, 12).setValues([registro]);
  }

  // Autocompletar campos vacíos desde Directorio Maestro
  // Inscritx: B[1]=CreamosID, C[2]=DPI, D[3]=Nombre, F[5]=Edad, H[7]=NivelEducativo, I[8]=Zona
  autocompletarFilaDesdeDirectorio(seleccionadas, nuevaFila,
    { creamosId: 1, dpi: 2, nombre: 3, edad: 5, nivelEducativo: 7, zona: 8 });

  // NO ELIMINAR - Mantener registro histórico de deserción
  // Solo marcar que reingresó y limpiar la acción
  const notasActuales = datos[11] || '';
  const fechaReingreso = Utilities.formatDate(new Date(), 'America/Guatemala', 'dd/MM/yyyy');
  sheet.getRange(fila, 12).setValue(notasActuales + ' [Reingresó: ' + fechaReingreso + ']');
  sheet.getRange(fila, 13).setValue(''); // Limpiar Acción

  // Marcar fila con color gris claro para indicar que ya reingresó
  sheet.getRange(fila, 1, 1, 13).setBackground('#e0e0e0');

  ss.toast('✅ ' + nombre + ' reenviada a Inscritx (registro de deserción conservado)', 'Reenvío', 4);
}

/**
 * Procesa envío a cohorte desde Inscritx (columna L - Enviar a Cohorte)
 * - Verifica cupo disponible
 * - Agrega a la hoja individual de la Cohorte
 * - Marca como enviada en Inscritx (conserva registro)
 */
function procesarEnvioACohorte(sheet, fila, cohorteDestino) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // LOCK: evita doble ejecución por triggers duplicados
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(0)) return;

  // Obtener mapa de columnas de Inscritx
  const colMapInscritx = obtenerMapaColumnas(sheet);
  const maxCol = sheet.getLastColumn();
  const datosInscritx = sheet.getRange(fila, 1, 1, maxCol).getValues()[0];

  // Helper robusto para Inscritx
  const getInscritxVal = (nombre) => {
    const idx = colMapInscritx[nombre.toLowerCase()];
    return idx !== undefined ? datosInscritx[idx] : '';
  };

  const creamosId = getInscritxVal('Creamos ID');
  const nombre = getInscritxVal('Nombre Completo');

  try {
    // VALIDACIÓN: Verificar que el nombre no esté vacío
    if (!nombre || nombre.toString().trim() === '') {
      ss.toast('⚠️ El nombre está vacío. No se puede enviar a la cohorte.', 'Error', 4);
      const colEnvio = colMapInscritx['enviar a cohorte'];
      if (colEnvio !== undefined) sheet.getRange(fila, colEnvio + 1).setValue('');
      return;
    }

    // Verificar que la cohorte existe
    const hojaCohorte = ss.getSheetByName(cohorteDestino);
    if (!hojaCohorte) {
      ss.toast('⚠️ La cohorte "' + cohorteDestino + '" no existe. Créela primero.', 'Error', 4);
      const colEnvio = colMapInscritx['enviar a cohorte'];
      if (colEnvio !== undefined) sheet.getRange(fila, colEnvio + 1).setValue('');
      return;
    }

    const colMapCohorte = obtenerMapaColumnas(hojaCohorte);

    // VALIDACIÓN: Verificar que no esté duplicado
    const idxCreamosIdCohorte = colMapCohorte['creamos id'];
    const idxNombreCohorte = colMapCohorte['nombre completo'];
    const datosCohorte = hojaCohorte.getDataRange().getValues();

    for (let i = 1; i < datosCohorte.length; i++) {
      let esDuplicado = false;

      // Verificar por Creamos ID si existe
      if (creamosId && creamosId.toString().trim() !== '' && idxCreamosIdCohorte !== undefined) {
        const idExistente = datosCohorte[i][idxCreamosIdCohorte] ? datosCohorte[i][idxCreamosIdCohorte].toString().trim() : '';
        if (idExistente !== '' && idExistente === creamosId.toString().trim()) {
          esDuplicado = true;
        }
      }

      // Verificar por Nombre Completo (fallback si no hay Creamos ID o validación adicional)
      if (!esDuplicado && nombre && nombre.toString().trim() !== '' && idxNombreCohorte !== undefined) {
        const nombreExistente = datosCohorte[i][idxNombreCohorte] ? datosCohorte[i][idxNombreCohorte].toString().trim().toLowerCase() : '';
        if (nombreExistente !== '' && nombreExistente === nombre.toString().trim().toLowerCase()) {
          esDuplicado = true;
        }
      }

      if (esDuplicado) {
        ss.toast('⚠️ ' + nombre + ' ya está en la cohorte "' + cohorteDestino + '"', 'Duplicado', 4);
        const colEnvio = colMapInscritx['enviar a cohorte'];
        if (colEnvio !== undefined) sheet.getRange(fila, colEnvio + 1).setValue('');
        return;
      }
    }

    // Verificar cupo disponible
    const cohortesSheet = ss.getSheetByName('Cohortes');
    if (cohortesSheet) {
      const colMapCohortesRoot = obtenerMapaColumnas(cohortesSheet);
      const datosCohortes = cohortesSheet.getDataRange().getValues();
      for (let i = 1; i < datosCohortes.length; i++) {
        if (datosCohortes[i][colMapCohortesRoot['nombre cohorte']] === cohorteDestino) {
          const cupoMax = datosCohortes[i][colMapCohortesRoot['cupo máximo']];
          const inscritas = datosCohortes[i][colMapCohortesRoot['inscritas']];
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
              const colEnvio = colMapInscritx['enviar a cohorte'];
              if (colEnvio !== undefined) sheet.getRange(fila, colEnvio + 1).setValue('');
              return;
            }
          }
          break;
        }
      }
    }

    // --- 1. Preparar y escribir en Hoja de Cohorte ---
    const numColsCohorte = hojaCohorte.getLastColumn();
    const registroCohorte = new Array(numColsCohorte).fill('');
    const nuevaFilaCohorte = obtenerPrimeraFilaVacia(hojaCohorte, 'E');  // Columna E = Nombre Completo (siempre tiene valor)

    // Obtener notas originales de Inscritx (si existen)
    const notasOriginales = getInscritxVal('Notas');

    const mappingCohorte = {
      'Fecha': new Date(),
      'Fecha Selección': new Date(),
      'No.': nuevaFilaCohorte - 1,
      'Creamos ID': creamosId,
      'DPI': getInscritxVal('DPI'),
      'Nombre Completo': nombre,
      'Género': getInscritxVal('Género'),
      'Edad': getInscritxVal('Edad'),
      'Teléfono': getInscritxVal('Teléfono'),
      'Nivel Educativo': getInscritxVal('Nivel Educativo'),
      'Zona': getInscritxVal('Zona'),
      'Estado': 'Activa'
      // NO incluir 'Año' aquí - se restaurará con fórmula después
      // NO incluir 'Notas' - no debe copiarse a la hoja de cohorte individual
    };

    for (let [header, valor] of Object.entries(mappingCohorte)) {
      const targetIdx = colMapCohorte[header.toLowerCase()];
      if (targetIdx !== undefined) registroCohorte[targetIdx] = valor;
    }

    hojaCohorte.getRange(nuevaFilaCohorte, 1, 1, registroCohorte.length).setValues([registroCohorte]);

    // Restaurar fórmulas que setValues sobrescribe
    hojaCohorte.getRange('B' + nuevaFilaCohorte).setFormula('=IF(E' + nuevaFilaCohorte + '<>"",COUNTA($E$2:E' + nuevaFilaCohorte + '),"")');  // No.
    hojaCohorte.getRange('L' + nuevaFilaCohorte).setFormula('=IF(E' + nuevaFilaCohorte + '<>"",YEAR(A' + nuevaFilaCohorte + '),"")');  // Año

    // --- 2. Registrar en Lista Definitiva ---
    const listaDefinitiva = ss.getSheetByName('Lista Definitiva');
    if (listaDefinitiva) {
      const colMapListaDef = obtenerMapaColumnas(listaDefinitiva);
      const nuevaFilaDef = obtenerPrimeraFilaVacia(listaDefinitiva, 'E');  // Columna E = Nombre Completo (siempre tiene valor)
      const numColsDef = listaDefinitiva.getLastColumn();
      const registroDef = new Array(numColsDef).fill('');

      const mappingDef = Object.assign({}, mappingCohorte, {'Cohorte': cohorteDestino});

      for (let [header, valor] of Object.entries(mappingDef)) {
        const targetIdx = colMapListaDef[header.toLowerCase()];
        if (targetIdx !== undefined) registroDef[targetIdx] = valor;
      }
      listaDefinitiva.getRange(nuevaFilaDef, 1, 1, registroDef.length).setValues([registroDef]);
    }

    // --- 3. Marcar como procesado en Inscritx ---
    const colNotas = colMapInscritx['notas'];
    const colEnvio = colMapInscritx['enviar a cohorte'];

    // Limpiar nota en Inscritx (ya se copió a la cohorte si existía)
    if (colNotas !== undefined) sheet.getRange(fila, colNotas + 1).setValue('');
    // Limpiar dropdown de envío
    if (colEnvio !== undefined) sheet.getRange(fila, colEnvio + 1).setValue('');

    // Marcar con color gris para indicar que fue procesada
    sheet.getRange(fila, 1, 1, maxCol).setBackground('#e0e0e0');

    ss.toast('✅ ' + nombre + ' enviada a cohorte "' + cohorteDestino + '"', 'Completado', 4);
  } catch (error) {
    // Manejar cualquier error que ocurra durante el envío
    Logger.log('⚠️ ERROR en procesarEnvioACohorte: ' + error.message);
    Logger.log('Stack trace: ' + error.stack);
    ss.toast('⚠️ Error al enviar a la cohorte: ' + error.message, 'Error', 6);

    // Limpiar el dropdown para que el usuario pueda intentar de nuevo
    const colEnvio = colMapInscritx['enviar a cohorte'];
    if (colEnvio !== undefined) {
      try {
        sheet.getRange(fila, colEnvio + 1).setValue('');
      } catch (e) {
        Logger.log('⚠️ No se pudo limpiar el dropdown: ' + e.message);
      }
    }
  } finally {
    // UNLOCK: Siempre liberar el lock
    lock.releaseLock();
  }
}

/**
 * Envía a una persona desde la hoja Entrevistas al otro programa (AyB o Tech).
 * Se activa al seleccionar "Enviar a A y B" en el Estado de Entrevistas.
 */
function enviarAOtroProgramaDesdeEntrevistas(sheet, fila, columnaEstado, destino) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(0)) return;
  try {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const idDestino = destino === 'AyB' ? CONFIG_TECH.ID_SPREADSHEET_AB : '';
  const nombrePrograma = destino === 'AyB' ? 'Alimentos y Bebidas' : 'Tecnología';

  if (!idDestino || idDestino.trim() === '') {
    ui.alert('⚠️ No configurado', 'Falta el ID del Sheets de ' + nombrePrograma + '.\nConfigura CONFIG_TECH.ID_SPREADSHEET_AB en el script.', ui.ButtonSet.OK);
    sheet.getRange(fila, columnaEstado).setValue('');
    return;
  }

  const colMap = obtenerMapaColumnas(sheet);
  const maxCol = sheet.getLastColumn();
  const datos = sheet.getRange(fila, 1, 1, maxCol).getValues()[0];
  const getVal = (n) => { const i = colMap[n.toLowerCase()]; return i !== undefined ? datos[i] : ''; };

  const nombre = getVal('Nombre Completo');
  if (!nombre || nombre.toString().trim() === '') {
    ui.alert('⚠️ Error', 'Esta fila no tiene nombre. No se puede enviar.', ui.ButtonSet.OK);
    sheet.getRange(fila, columnaEstado).setValue('');
    return;
  }

  const resp = ui.alert('🔄 Confirmar envío', '¿Enviar a ' + nombre + ' al programa de ' + nombrePrograma + '?\n\nSe agregará en su Hoja de Interés como nuevo registro.', ui.ButtonSet.YES_NO);
  if (resp !== ui.Button.YES) {
    sheet.getRange(fila, columnaEstado).setValue('');
    return;
  }

  let ssDest;
  try {
    ssDest = SpreadsheetApp.openById(idDestino.trim());
  } catch (e) {
    ui.alert('⚠️ Error', 'No se pudo abrir el Sheets de ' + nombrePrograma + '.\n\nError: ' + e.message, ui.ButtonSet.OK);
    sheet.getRange(fila, columnaEstado).setValue('');
    return;
  }

  const hojaDestino = ssDest.getSheetByName('Hoja de Interés');
  if (!hojaDestino) {
    ui.alert('⚠️ Error', 'No se encontró "Hoja de Interés" en ' + nombrePrograma + '.', ui.ButtonSet.OK);
    sheet.getRange(fila, columnaEstado).setValue('');
    return;
  }

  const colMapDest = obtenerMapaColumnas(hojaDestino);
  const numColsDest = hojaDestino.getLastColumn();
  const nuevaFila = hojaDestino.getLastRow() + 1;
  const registro = new Array(numColsDest).fill('');

  const mapping = {
    'Creamos ID':      getVal('Creamos ID'),
    'DPI':             getVal('DPI'),
    'Nombre Completo': nombre,
    'Género':          getVal('Género'),
    'Edad':            getVal('Edad'),
    'Teléfono':        getVal('Teléfono'),
    'Nivel Educativo': getVal('Nivel Educativo'),
    'Zona':            getVal('Zona'),
    'Notas':           'Enviado desde Entrevistas Tecnología el ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy')
  };

  for (const [header, valor] of Object.entries(mapping)) {
    const norm = header.toLowerCase().replace(/[^a-z0-9]/g, '');
    const idx = colMapDest[norm];
    if (idx !== undefined) registro[idx] = valor;
  }

  try {
    hojaDestino.getRange(nuevaFila, 1, 1, registro.length).setValues([registro]);
    SpreadsheetApp.flush();
  } catch (e) {
    ui.alert('⚠️ Error al guardar', 'No se pudo escribir en ' + nombrePrograma + '.\n\nError: ' + e.message, ui.ButtonSet.OK);
    sheet.getRange(fila, columnaEstado).setValue('');
    return;
  }

  sheet.getRange(fila, columnaEstado).setValue('✅ Enviado a ' + nombrePrograma);
  ss.toast('✅ ' + nombre + ' enviado a ' + nombrePrograma, 'Envío completado', 4);
  } finally { lock.releaseLock(); }
}

/**
 * Traslada una persona de Inscritx (Tecnología) a la Hoja de Interés de Alimentos y Bebidas.
 * Requiere configurar CONFIG_TECH.ID_SPREADSHEET_AB con el ID del otro Sheets.
 */
function trasladarPersonaAAyB(sheet, fila) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(0)) return;
  try {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  const colN = 14; // columna N = "Trasladar a A y B"

  const idDestino = CONFIG_TECH.ID_SPREADSHEET_AB;
  if (!idDestino || idDestino.trim() === '') {
    ui.alert(
      '⚠️ No configurado',
      'Para usar traslados, abre el script de Tecnología y\n' +
      'coloca el ID del Sheets de Alimentos y Bebidas en:\n\n' +
      'CONFIG_TECH.ID_SPREADSHEET_AB\n\n' +
      'El ID está en la URL del otro Sheets:\n' +
      'docs.google.com/spreadsheets/d/[ESTE_ID]/edit',
      ui.ButtonSet.OK
    );
    sheet.getRange(fila, colN).setValue('');
    return;
  }

  const colMap = obtenerMapaColumnas(sheet);
  const maxCol = sheet.getLastColumn();
  const datos = sheet.getRange(fila, 1, 1, maxCol).getValues()[0];
  const getVal = (n) => { const i = colMap[n.toLowerCase()]; return i !== undefined ? datos[i] : ''; };

  const nombre = getVal('Nombre Completo');
  if (!nombre || nombre.toString().trim() === '') {
    ui.alert('⚠️ Error', 'Esta fila no tiene nombre. No se puede trasladar.', ui.ButtonSet.OK);
    sheet.getRange(fila, colN).setValue('');
    return;
  }

  const resp = ui.alert(
    '🔄 Confirmar traslado',
    '¿Trasladar a ' + nombre + ' al programa de Alimentos y Bebidas?\n\n' +
    'Se agregará en la Hoja de Interés de A y B como nuevo registro.',
    ui.ButtonSet.YES_NO
  );
  if (resp !== ui.Button.YES) {
    sheet.getRange(fila, colN).setValue('');
    return;
  }

  let ssDest;
  try {
    ssDest = SpreadsheetApp.openById(idDestino.trim());
  } catch (e) {
    ui.alert('⚠️ Error al abrir A y B', 'No se pudo abrir el Sheets de Alimentos y Bebidas.\nVerifica el ID en CONFIG_TECH.ID_SPREADSHEET_AB.\n\nError: ' + e.message, ui.ButtonSet.OK);
    sheet.getRange(fila, colN).setValue('');
    return;
  }

  const hojaDestino = ssDest.getSheetByName('Hoja de Interés');
  if (!hojaDestino) {
    ui.alert('⚠️ Error', 'No se encontró la hoja "Hoja de Interés" en el Sheets de Alimentos y Bebidas.', ui.ButtonSet.OK);
    sheet.getRange(fila, colN).setValue('');
    return;
  }

  const colMapDest = obtenerMapaColumnas(hojaDestino);
  const numColsDest = hojaDestino.getLastColumn();
  const nuevaFila = hojaDestino.getLastRow() + 1;
  const registro = new Array(numColsDest).fill('');

  const mapping = {
    'Creamos ID':      getVal('Creamos ID'),
    'DPI':             getVal('DPI'),
    'Nombre Completo': nombre,
    'Género':          getVal('Género'),
    'Edad':            getVal('Edad'),
    'Teléfono':        getVal('Teléfono'),
    'Nivel Educativo': getVal('Nivel Educativo'),
    'Zona':            getVal('Zona'),
    'Notas':           'Trasladado desde Tecnología el ' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy')
  };

  for (const [header, valor] of Object.entries(mapping)) {
    const norm = header.toLowerCase().replace(/[^a-z0-9]/g, '');
    const idx = colMapDest[norm];
    if (idx !== undefined) registro[idx] = valor;
  }

  try {
    hojaDestino.getRange(nuevaFila, 1, 1, registro.length).setValues([registro]);
    SpreadsheetApp.flush();
  } catch (e) {
    ui.alert('⚠️ Error al guardar', 'No se pudo escribir en la Hoja de Interés de A y B.\n\nError: ' + e.message, ui.ButtonSet.OK);
    sheet.getRange(fila, colN).setValue('');
    return;
  }

  sheet.getRange(fila, colN).setValue('✅ Trasladado');
  ss.toast('✅ ' + nombre + ' trasladado a Alimentos y Bebidas', 'Traslado completado', 4);
  } finally { lock.releaseLock(); }
}

/**
 * Procesa finalización de cohorte
 * Pregunta si todas se graduaron, si sí las gradúa masivamente
 * Si no, indica que vaya a la hoja individual para marcar una por una
 */
function procesarFinalizacionCohorte(sheet, fila) {
  // Guard 1: LockService — evita doble ejecución por triggers duplicados
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(0)) {
    Logger.log('⚠️ procesarFinalizacionCohorte: doble trigger detectado, omitiendo');
    return;
  }

  // Guard 2: Re-leer celda para confirmar que sigue siendo 'Finalizada'
  const estadoCelda = sheet.getRange(fila, 14).getValue();
  if (estadoCelda !== 'Finalizada') {
    lock.releaseLock();
    return;
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const nombreCohorte = sheet.getRange(fila, 1).getValue();

  if (!nombreCohorte) {
    ss.toast('⚠️ No hay nombre de cohorte', 'Error', 3);
    sheet.getRange(fila, 14).setValue('Activa');
    lock.releaseLock();
    return;
  }

  const hojaCohorte = ss.getSheetByName(nombreCohorte);
  if (!hojaCohorte) {
    ss.toast('⚠️ No existe la hoja de la cohorte', 'Error', 3);
    sheet.getRange(fila, 14).setValue('Activa');
    lock.releaseLock();
    return;
  }

  // Si la hoja ya está oculta, la cohorte ya fue finalizada anteriormente
  if (hojaCohorte.isSheetHidden()) {
    ss.toast('ℹ️ "' + nombreCohorte + '" ya estaba finalizada y archivada.', 'Ya finalizada', 4);
    lock.releaseLock();
    return;
  }

  // Contar participantes activas en la cohorte (sin estado definido)
  const datosCohorte = hojaCohorte.getDataRange().getValues();
  let participantesActivas = 0;
  for (let i = 1; i < datosCohorte.length; i++) {
    const estadoK = datosCohorte[i][10];
    if (datosCohorte[i][4] && (!estadoK || estadoK === '' || estadoK === 'Activa')) {
      participantesActivas++;
    }
  }

  if (participantesActivas === 0) {
    hojaCohorte.hideSheet();
    ss.toast('✅ Cohorte finalizada y archivada', 'Completado', 3);
    lock.releaseLock();
    return;
  }

  // Preguntar si todas se graduaron
  const respuesta = ui.alert(
    '🎓 Finalizar Cohorte: ' + nombreCohorte,
    'Hay ' + participantesActivas + ' participantes en esta cohorte.\n\n' +
    '¿Todas se GRADUARON?\n\n' +
    'SÍ = Graduar a todas automáticamente\n' +
    'NO = Ir a la hoja "' + nombreCohorte + '" para marcar individualmente\n' +
    '(El estado queda en "Finalizada"; cuando termines de marcar, no necesitas hacer nada más)',
    ui.ButtonSet.YES_NO
  );

  if (respuesta === ui.Button.YES) {
    graduarTodaLaCohorte(nombreCohorte, hojaCohorte);
    hojaCohorte.hideSheet();
    ss.toast('🎓 Todas graduadas de ' + nombreCohorte + ' - Hoja archivada', 'Graduación Masiva', 4);
  } else {
    ss.toast('📋 Ve a la hoja "' + nombreCohorte + '" y marca cada participante. Cuando todas tengan estado, cambia a "Finalizada" de nuevo.', 'Acción Requerida', 7);
    hojaCohorte.activate();
  }
  lock.releaseLock();
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

  // ✅ FIX: Calcular primera fila vacía UNA SOLA VEZ antes del loop
  // Evita condiciones de carrera y sobrescritura de datos
  const primeraFilaVaciaGrad = graduadas.getLastRow() + 1;
  const registrosParaBatch = []; // Acumular todos los registros para escribir en batch

  for (let i = 1; i < datosCohorte.length; i++) {
    const fila = datosCohorte[i];
    // Solo procesar si tiene nombre y no tiene estado final (vacío o 'Activa' = pendiente)
    if (fila[4] && (!fila[10] || fila[10] === '' || fila[10] === 'Activa')) {
      listaParaEmail.push({ nombre: fila[4], creamosId: fila[2] || '' });

      // Si no tiene Creamos ID, agregar nota
      const notaID = fila[2] ? '' : '⚠️ Sin Creamos ID — verificar en Salesforce';

      // Orden Graduadx: Fecha, CreamosID, DPI, Nombre, Género, Edad, Tel, NivelEdu, Zona, Cohorte, Notas
      const registroGraduada = [
        fechaGraduacion,
        fila[2] || '',     // Creamos ID (puede estar vacío)
        fila[3],           // DPI
        fila[4],           // Nombre
        fila[5] || '',     // Género
        fila[6],           // Edad
        fila[7],           // Teléfono
        fila[8],           // Nivel Educativo
        fila[9] || '',     // Zona
        nombreCohorte,
        notaID             // Notas (alerta si falta ID)
      ];

      registrosParaBatch.push(registroGraduada);
      const nuevaFilaGrad = primeraFilaVaciaGrad + graduadasCount;

      // Marcar como Graduada en la hoja de cohorte (NO eliminar — la hoja queda como archivo)
      hojaCohorte.getRange(i + 1, 11).setValue('Graduadx');
      hojaCohorte.getRange(i + 1, 1, 1, 12).setBackground('#e8f5e9'); // Verde claro = graduada

      // Si falta Creamos ID, resaltar col C en naranja (encima del verde)
      if (!fila[2]) {
        hojaCohorte.getRange(i + 1, 3).setBackground('#ffe0b2');
      }

      graduadasCount++;
    }
  }

  // ✅ FIX: Escribir TODOS los registros en un solo batch (mucho más eficiente y seguro)
  if (registrosParaBatch.length > 0) {
    graduadas.getRange(primeraFilaVaciaGrad, 1, registrosParaBatch.length, 11).setValues(registrosParaBatch);
    SpreadsheetApp.flush();
  }

  // Enviar email con lista completa de graduadas
  if (graduadasCount > 0) {
    enviarEmailListaGraduadx(nombreCohorte, listaParaEmail);
  }

  // Recordatorio Salesforce para toda la cohorte
  if (graduadasCount > 0) {
    ui.alert(
      '⚠️ Recordatorio Salesforce',
      graduadasCount + ' participante(s) de la cohorte "' + nombreCohorte + '" han sido graduadas.\n\n' +
      'Recuerda cambiar la etapa en Salesforce a "Graduadx" para mantener el CRM actualizado.',
      ui.ButtonSet.OK
    );
  }
}

/**
 * Procesa graduación individual desde hoja de cohorte
 */
function procesarGraduacionIndividual(sheet, fila, nombreCohorte) {
  // Guard 1: LockService — si otro trigger ya está ejecutando, salir de inmediato
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(0)) {
    Logger.log('⚠️ procesarGraduacionIndividual: doble trigger detectado, omitiendo segunda ejecución');
    return;
  }

  // Guard 2: Re-leer celda para confirmar que sigue siendo 'Graduada'
  const estadoCelda = sheet.getRange(fila, 11).getValue();
  if (estadoCelda !== 'Graduada') {
    lock.releaseLock();
    return;
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  const graduadas = ss.getSheetByName('Graduadx');

  const datos = sheet.getRange(fila, 1, 1, 11).getValues()[0];
  const fechaGraduacion = new Date();

  // Si no tiene Creamos ID, agregar nota
  const notaID = datos[2] ? '' : '⚠️ Sin Creamos ID — verificar en Salesforce';

  const nuevaFilaGrad = graduadas.getLastRow() + 1;

  // Orden Graduadx: Fecha, CreamosID, DPI, Nombre, Género, Edad, Tel, NivelEdu, Zona, Cohorte, Notas
  const registroGraduada = [
    fechaGraduacion,
    datos[2] || '',     // Creamos ID (puede estar vacío)
    datos[3],           // DPI
    datos[4],           // Nombre
    datos[5] || '',     // Género
    datos[6],           // Edad
    datos[7],           // Teléfono
    datos[8],           // Nivel Educativo
    datos[9] || '',     // Zona
    nombreCohorte,
    notaID              // Notas (alerta si falta ID)
  ];

  graduadas.getRange(nuevaFilaGrad, 1, 1, 11).setValues([registroGraduada]);

  // Autocompletar campos vacíos desde Directorio Maestro
  autocompletarFilaDesdeDirectorio(graduadas, nuevaFilaGrad,
    { creamosId: 1, dpi: 2, nombre: 3, edad: 5, nivelEducativo: 7, zona: 8 });

  // Marcar como Graduada en la hoja de cohorte (NO eliminar — queda como archivo)
  sheet.getRange(fila, 11).setValue('Graduadx');
  sheet.getRange(fila, 1, 1, 12).setBackground('#e8f5e9'); // Verde claro = graduada

  // Si falta Creamos ID, resaltar esa celda en naranja
  if (!datos[2]) {
    sheet.getRange(fila, 3).setBackground('#ffe0b2');
  }

  ss.toast('🎓 ' + datos[4] + ' graduada ✅  — Recuerda actualizar Salesforce.', 'Completado', 6);

  // Verificar si todos los participantes de la cohorte ya tienen estado
  const datosActualizados = sheet.getDataRange().getValues();
  const pendientes = datosActualizados.slice(1).filter(r => r[4] && (!r[10] || r[10] === '' || r[10] === 'Activa')).length;

  if (pendientes === 0) {
    const respuestaFinalizar = ui.alert(
      '🎓 Cohorte Completada',
      'Todos los participantes de "' + nombreCohorte + '" ya tienen estado asignado.\n\n' +
      '¿Deseas marcar esta cohorte como "Finalizada"?',
      ui.ButtonSet.YES_NO
    );
    if (respuestaFinalizar === ui.Button.YES) {
      const hojaCohortes = ss.getSheetByName('Cohortes');
      if (hojaCohortes) {
        const datosCohortes = hojaCohortes.getDataRange().getValues();
        for (let i = 1; i < datosCohortes.length; i++) {
          if (datosCohortes[i][0] === nombreCohorte) {
            hojaCohortes.getRange(i + 1, 14).setValue('Finalizada');
            break;
          }
        }
      }
      ss.toast('✅ Cohorte "' + nombreCohorte + '" marcada como Finalizada', 'Completado', 5);
    }
  }
  lock.releaseLock();
}



/**
 * Diagnostica y repara una cohorte que quedó en estado incorrecto.
 * Permite: ver diagnóstico, reactivar hoja oculta, corregir Estado en Cohortes,
 * limpiar Estado de participantes que no tienen Graduadx/Retiradx.
 */
function repararCohorte() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  // ── 1. Seleccionar cohorte ──────────────────────────────────────────────
  const cohortesSheet = ss.getSheetByName('Cohortes');
  if (!cohortesSheet) { ui.alert('⚠️ No existe la hoja "Cohortes".'); return; }

  const datosCohortes = cohortesSheet.getDataRange().getValues();
  let listaNombres = '';
  const mapCohortes = {}; // nombre → { fila (1-based), estado, filaIdx }
  for (let i = 1; i < datosCohortes.length; i++) {
    const nombre = (datosCohortes[i][0] || '').toString().trim();
    if (!nombre) continue;
    const estado = (datosCohortes[i][13] || '').toString().trim();
    listaNombres += (Object.keys(mapCohortes).length + 1) + '. ' + nombre + '  [' + (estado || 'sin estado') + ']\n';
    mapCohortes[Object.keys(mapCohortes).length + 1] = { nombre, estado, fila: i + 1 };
  }

  if (!listaNombres) { ui.alert('No hay cohortes registradas.'); return; }

  const resp = ui.prompt(
    '🔧 Reparar Cohorte — Selecciona',
    'Cohortes disponibles:\n\n' + listaNombres + '\nEscribe el número:',
    ui.ButtonSet.OK_CANCEL
  );
  if (resp.getSelectedButton() !== ui.Button.OK) return;

  const num = parseInt(resp.getResponseText().trim());
  if (isNaN(num) || !mapCohortes[num]) { ui.alert('Número inválido.'); return; }

  const { nombre: nombreCohorte, estado: estadoActual, fila: filaCohortes } = mapCohortes[num];

  // ── 2. Diagnóstico ─────────────────────────────────────────────────────
  const hojaCohorte = ss.getSheetByName(nombreCohorte);
  const hojaOculta  = hojaCohorte ? hojaCohorte.isSheetHidden() : null;

  let activas = 0, graduadas = 0, retiradas = 0, sinNombre = 0;
  let filasDatos = [];
  if (hojaCohorte) {
    const datos = hojaCohorte.getDataRange().getValues();
    for (let i = 1; i < datos.length; i++) {
      const nombre_ = (datos[i][4] || '').toString().trim();
      const estado_  = (datos[i][10] || '').toString().trim();
      if (!nombre_) { sinNombre++; continue; }
      if (estado_ === 'Graduadx')       graduadas++;
      else if (estado_ === 'Retiradx')  retiradas++;
      else                              activas++;   // vacío o 'Activa'
      filasDatos.push({ fila: i + 1, nombre: nombre_, estado: estado_ });
    }
  }

  const diagMsg =
    '📋 DIAGNÓSTICO — ' + nombreCohorte + '\n\n' +
    '• Estado en tabla Cohortes:  ' + (estadoActual || '(vacío)') + '\n' +
    '• Hoja individual:           ' + (hojaCohorte ? (hojaOculta ? '⚠️ OCULTA' : '✅ Visible') : '❌ NO EXISTE') + '\n' +
    '• Participantes activos:     ' + activas + '\n' +
    '• Ya graduadas:              ' + graduadas + '\n' +
    '• Ya retiradas:              ' + retiradas + '\n' +
    (sinNombre > 0 ? '• Filas sin nombre (ignorar): ' + sinNombre + '\n' : '') +
    '\n¿Quieres aplicar las reparaciones necesarias?';

  const confirmar = ui.alert('🔧 Reparar Cohorte', diagMsg, ui.ButtonSet.YES_NO);
  if (confirmar !== ui.Button.YES) return;

  const acciones = [];

  // ── 3. Reparaciones ────────────────────────────────────────────────────

  // a) Mostrar hoja si estaba oculta
  if (hojaCohorte && hojaOculta) {
    hojaCohorte.showSheet();
    acciones.push('✅ Hoja "' + nombreCohorte + '" visible de nuevo');
  }

  // b) Resetear Estado en tabla Cohortes → 'Activa'
  if (estadoActual !== 'Activa') {
    cohortesSheet.getRange(filaCohortes, 14).setValue('Activa');
    acciones.push('✅ Estado en tabla Cohortes → "Activa"');
  }

  // c) Corregir Estado de participantes sin estado final
  //    Cualquier valor que no sea Graduadx/Retiradx se normaliza a 'Activa'
  if (hojaCohorte) {
    let corregidos = 0;
    filasDatos.forEach(({ fila, estado: est }) => {
      if (est !== 'Graduadx' && est !== 'Retiradx') {
        hojaCohorte.getRange(fila, 11).setValue('Activa');
        corregidos++;
      }
    });
    if (corregidos > 0) acciones.push('✅ ' + corregidos + ' participante(s) sin estado final → "Activa"');
  }

  // d) Si no existía la hoja, crearla
  if (!hojaCohorte) {
    crearHojaIndividualCohorte(nombreCohorte);
    acciones.push('✅ Hoja individual "' + nombreCohorte + '" creada');
  }

  SpreadsheetApp.flush();

  if (acciones.length === 0) {
    ui.alert('✅ La cohorte "' + nombreCohorte + '" ya estaba en buen estado. No se hicieron cambios.');
  } else {
    ui.alert('✅ Reparación completada',
      acciones.join('\n') + '\n\nAhora puedes:\n• Enviar participantes desde Inscritx\n• O finalizar la cohorte desde la tabla Cohortes.',
      ui.ButtonSet.OK);
  }
}

/**
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


function mostrarDialogoMotivoDesercion(nombre) {
  const ui = SpreadsheetApp.getUi();

  let listaMotivos = '';
  CONFIG_TECH.MOTIVOS_DESERCION.forEach((motivo, idx) => {
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
  if (isNaN(num) || num < 1 || num > CONFIG_TECH.MOTIVOS_DESERCION.length) {
    ui.alert('Número inválido');
    return null;
  }

  return CONFIG_TECH.MOTIVOS_DESERCION[num - 1];
}

/**
 * Procesa marca de "¿Tiene Hoja de Interés?" en Hoja de Interés
 * - "Sí" → Marca con color verde y copia a Referencias de Programas
 * - "No" → Marca con color rojo
 * REEMPLAZA la lógica anterior de envío a lista de espera
 */
function procesarMarcaHojaInteres(sheet, fila, tieneHoja) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const datos = sheet.getRange(fila, 1, 1, 17).getValues()[0];

  if (tieneHoja === 'Sí') {
    const referenciasPrograms = ss.getSheetByName('Referencias de Programas');
    if (!referenciasPrograms) {
      ss.toast('⚠️ La hoja "Referencias de Programas" no existe. Créala primero.', 'Error', 3);
      return;
    }

    const nuevaFila = obtenerPrimeraFilaVacia(referenciasPrograms, 'C');

    // Columnas: Fecha, No., Creamos ID, DPI, Nombre, Género, Edad, Tel, NivelEdu, Zona, Programa, Referido, Tiene Hoja, Notas
    const registro = [
      new Date(),           // A - Fecha
      nuevaFila - 1,        // B - No.
      datos[2],             // C - Creamos ID
      datos[3],             // D - DPI
      datos[4],             // E - Nombre Completo
      datos[5],             // F - Género
      datos[6],             // G - Edad
      datos[7],             // H - Teléfono
      datos[8],             // I - Nivel Educativo
      datos[9],             // J - Zona
      'Tecnología',         // K - Programa de Referencia
      'Hoja de Interés',    // L - Referido por
      'Sí',                 // M - ¿Tiene Hoja de Interés?
      datos[12] || ''       // N - Notas
    ];

    referenciasPrograms.getRange(nuevaFila, 1, 1, 14).setValues([registro]);

    // Restaurar fórmula de No. (columna B) que setValues sobreescribe
    referenciasPrograms.getRange('B' + nuevaFila).setFormula('=IF(E' + nuevaFila + '<>"",COUNTA($E$2:E' + nuevaFila + '),"")');

    // Marcar la columna Q con color VERDE en Hoja de Interés
    sheet.getRange(fila, 17).setBackground('#c8e6c9'); // Verde claro
    ss.toast('✅ Registro copiado a "Referencias de Programas" (Sí tiene hoja de interés)', 'Completado', 3);
  }

  if (tieneHoja === 'No') {
    // Solo marcar con color ROJO, no copiar a ninguna hoja
    sheet.getRange(fila, 17).setBackground('#ffcdd2'); // Rojo claro
    ss.toast('❌ Marcado como "No tiene hoja de interés"', 'Completado', 2);
  }
}

/**
 * Actualiza masivamente todas las marcas de "¿Tiene Hoja de Interés?"
 * en la Hoja de Interés sin eliminar registros
 * - Copia los "Sí" a Referencias de Programas
 * - Marca con colores: Sí=verde, No=rojo
 */
function actualizarHojasInteresMasivamente() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  const hojaInteres = ss.getSheetByName('Hoja de Interés');

  if (!hojaInteres) {
    ui.alert('⚠️ Error', 'No existe la hoja "Hoja de Interés"', ui.ButtonSet.OK);
    return;
  }

  const referenciasPrograms = ss.getSheetByName('Referencias de Programas');
  if (!referenciasPrograms) {
    ui.alert('⚠️ Error', 'No existe la hoja "Referencias de Programas". Créala primero.', ui.ButtonSet.OK);
    return;
  }

  const ultimaFila = hojaInteres.getLastRow();
  if (ultimaFila < 2) {
    ui.alert('ℹ️ Sin registros', 'No hay registros para procesar en "Hoja de Interés"', ui.ButtonSet.OK);
    return;
  }

  // Confirmar con el usuario
  const respuesta = ui.alert(
    '📋 Actualización Masiva',
    'Esta acción procesará todos los registros en la columna "¿Tiene Hoja de Interés?" (columna Q).\n\n' +
    '• Los que tienen "Sí" se copiarán a "Referencias de Programas" y se marcarán en VERDE.\n' +
    '• Los que tienen "No" se marcarán en ROJO.\n\n' +
    '⚠️ NO se eliminarán registros.\n\n' +
    '¿Continuar?',
    ui.ButtonSet.YES_NO
  );

  if (respuesta !== ui.Button.YES) {
    ss.toast('❌ Operación cancelada', 'Cancelado', 2);
    return;
  }

  let procesados = 0;
  let copiados = 0;
  let marcados = 0;

  // Obtener IDs existentes en Referencias de Programas para evitar duplicados
  const datosRef = referenciasPrograms.getDataRange().getValues();
  const idsExistentes = new Set();
  for (let i = 1; i < datosRef.length; i++) {
    const id = datosRef[i][2]; // Columna C - Creamos ID
    if (id) idsExistentes.add(id.toString().trim());
  }

  // Procesar todas las filas
  for (let fila = 2; fila <= ultimaFila; fila++) {
    const tieneHoja = hojaInteres.getRange(fila, 17).getValue(); // Columna Q

    if (!tieneHoja || tieneHoja === '') continue;

    const datos = hojaInteres.getRange(fila, 1, 1, 17).getValues()[0];
    const creamosId = datos[2] ? datos[2].toString().trim() : '';

    // Procesar según el valor
    if (tieneHoja === 'Sí') {
      const referenciasPrograms = ss.getSheetByName('Referencias de Programas');
      if (referenciasPrograms) {
        const nuevaFila = obtenerPrimeraFilaVacia(referenciasPrograms, 'C');

        // Verificar si ya existe para evitar duplicados
        if (creamosId && idsExistentes.has(creamosId)) {
          // Ya existe, solo marcar con color
          hojaInteres.getRange(fila, 17).setBackground('#c8e6c9');
          marcados++;
        } else {
          // No existe, copiar a Referencias de Programas
          const registro = [
            new Date(),           // A - Fecha
            nuevaFila - 1,        // B - No.
            datos[2],             // C - Creamos ID
            datos[3],             // D - DPI
            datos[4],             // E - Nombre Completo
            datos[5],             // F - Género
            datos[6],             // G - Edad
            datos[7],             // H - Teléfono
            datos[8],             // I - Nivel Educativo
            datos[9],             // J - Zona
            'Tecnología',         // K - Programa de Referencia
            'Hoja de Interés',    // L - Referido por
            'Sí',                 // M - ¿Tiene Hoja de Interés?
            datos[12] || ''       // N - Notas
          ];

          referenciasPrograms.getRange(nuevaFila, 1, 1, 14).setValues([registro]);

          // Restaurar fórmula de No. (columna B) que setValues sobreescribe
          referenciasPrograms.getRange('B' + nuevaFila).setFormula('=IF(E' + nuevaFila + '<>"",COUNTA($E$2:E' + nuevaFila + '),"")');

          hojaInteres.getRange(fila, 17).setBackground('#c8e6c9'); // Verde

          if (creamosId) idsExistentes.add(creamosId);
          copiados++;
        }
      }
      procesados++;
    } else if (tieneHoja === 'No') {
      hojaInteres.getRange(fila, 17).setBackground('#ffcdd2'); // Rojo
      marcados++;
      procesados++;
    }
  }

  // Mostrar resumen
  const mensaje = '✅ ACTUALIZACIÓN COMPLETADA\n\n' +
    '📊 Registros procesados: ' + procesados + '\n' +
    '📋 Copiados a Referencias de Programas: ' + copiados + '\n' +
    '🎨 Celdas marcadas con color: ' + marcados;

  ui.alert('Completado', mensaje, ui.ButtonSet.OK);
  ss.toast('✅ Actualización masiva completada', 'Completado', 4);
}

// =====================================================================
// FUNCIONES AUXILIARES
// =====================================================================

function obtenerPrimeraFilaVacia(sheet, columnaReferencia) {
  // ⚠️ VERSIÓN MEJORADA: Evita sobrescritura verificando múltiples columnas
  // Si columnaReferencia es un array → verificar que TODAS estén vacías
  // Si es un string → verificar solo esa columna (compatibilidad)

  if (Array.isArray(columnaReferencia)) {
    // CASO 1: Array de columnas - buscar fila donde TODAS estén vacías
    const datos = sheet.getDataRange().getValues();

    // Convertir letras de columna a índices (A=0, B=1, C=2, etc.)
    const colIndices = columnaReferencia.map(col => {
      return col.charCodeAt(0) - 'A'.charCodeAt(0);
    });

    // Buscar desde el final hacia arriba
    for (let i = datos.length - 1; i >= 1; i--) {
      const fila = datos[i];

      // Verificar si ALGUNA de las columnas tiene datos
      const tieneAlgunDato = colIndices.some(colIdx => {
        return fila[colIdx] && fila[colIdx].toString().trim() !== '';
      });

      if (tieneAlgunDato) {
        // Esta fila tiene datos, la siguiente está vacía
        return i + 2;
      }
    }

    // Si no hay datos en ninguna fila, empezar en fila 2
    return 2;

  } else {
    // CASO 2: String de columna - verificar solo esa columna (original)
    const valores = sheet.getRange(columnaReferencia + '1:' + columnaReferencia).getValues();

    for (let i = valores.length - 1; i >= 0; i--) {
      if (valores[i][0] && valores[i][0].toString().trim() !== '') {
        return i + 2;
      }
    }

    return 2;
  }
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

/**
 * Diagnóstico para ver por qué la fecha no está jalando de Kobo
 */
function diagnosticarFechaKoboTech() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let ui;
  try {
    ui = SpreadsheetApp.getUi();
  } catch(e) { /* Ejecutado desde editor sin UI */ }
  
  const props = PropertiesService.getDocumentProperties();
  const url = CONFIG_TECH.KOBO_URL; // props.getProperty('KOBO_URL') || CONFIG_TECH.KOBO_URL;

  try {
    if(ui) ss.toast('🔍 Leyendo URL de Kobo...', 'Diagnóstico', 3);
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true, followRedirects: true });
    let csvData = response.getContentText('UTF-8');

    if (csvData.charCodeAt(0) === 0xFEFF) csvData = csvData.substring(1);

    let rows = [];
    try {
      rows = Utilities.parseCsv(csvData);
    } catch(e) {
      rows = parsearCSVManual(csvData, ';');
    }

    if (rows.length < 2) {
      if(ui) ui.alert('No hay datos en Kobo o URL incorrecta.');
      Logger.log('No hay datos en Kobo o URL incorrecta.');
      return;
    }

    const headers = rows[0];
    const indiceToday = buscarIndiceColumnaExacto(headers, ['today']);
    const indiceStart = buscarIndiceColumnaExacto(headers, ['start']);
    const indiceSubmission = buscarIndiceColumnaExacto(headers, ['_submission_time']);

    let msg = '🔎 DIAGNÓSTICO DE FECHAS\n\n';
    msg += 'Total columnas: ' + headers.length + '\n';
    msg += 'Índice "today": ' + indiceToday + '\n';
    msg += 'Índice "start": ' + indiceStart + '\n';
    msg += 'Índice "_submission_time": ' + indiceSubmission + '\n\n';

    // Revisar primeras 3 filas
    for (let i = 1; i <= Math.min(3, rows.length - 1); i++) {
        const fila = rows[i];
        msg += '--- FILA ' + i + ' ---\n';
        msg += 'Valor en "today": "' + (indiceToday >= 0 ? fila[indiceToday] : 'N/A') + '"\n';
        msg += 'Valor en "start": "' + (indiceStart >= 0 ? fila[indiceStart] : 'N/A') + '"\n';
        msg += 'Valor en "_submission_time": "' + (indiceSubmission >= 0 ? fila[indiceSubmission] : 'N/A') + '"\n\n';
    }

    if(ui) ui.alert('Resultado Diagnóstico', msg, ui.ButtonSet.OK);
    Logger.log(msg);

  } catch (error) {
    if(ui) ui.alert('❌ Error', error.message, ui.ButtonSet.OK);
    Logger.log('ERROR: ' + error.message);
  }
}

// =====================================================================
// AUTOMATIZACIÓN DE TRIGGERS
// =====================================================================

/**
 * Configura la URL de KoboToolbox
 */
function configurarKoboURL() {
  const ui = SpreadsheetApp.getUi();
  const props = PropertiesService.getDocumentProperties();
  const urlActual = props.getProperty('KOBO_URL') || CONFIG_TECH.KOBO_URL;

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
function importarDesdeKoboTech() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let ui = null;
  try {
    ui = SpreadsheetApp.getUi();
  } catch (e) {
    // Sin UI disponible (trigger automático)
    Logger.log('⚠️ Ejecutándose como trigger automático (sin UI)');
  }

  // URL FIJA de datos nuevos (actualizada cada 10 minutos)
  const url = CONFIG_TECH.KOBO_URL;

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
function importarDesdeKoboInterno(ss, ui, url, tipoImportacion) {
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
      // Fecha de registro (campo 'today', 'start' o 'submission_time' del formulario Kobo)
      // Priorizamos 'today' o 'start' ya que representan la fecha en que se llenó/inició el formulario
      fechaRegistro: buscarIndiceColumnaExacto(headers, [
        'today',
        'start',
        'Fecha de registro',
        'Fecha registro',
        'fecha_registro',
        'Fecha',
        'fecha',
        '_submission_time',
        'submission_time'
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

      // === COLUMNAS ESPECÍFICAS DE PROGRAMAS (Binary 1/0 en nuevos exports de Kobo) ===
      colMarketing: buscarIndiceColumnaExacto(headers, [
        '¿Tienes interés en un servicio o formación específica?/Tecnología - Marketing',
        'Inclusión Laboral/¿Tienes interés en un servicio o formación específica?/Tecnología - Marketing'
      ]),
      colProgramacion: buscarIndiceColumnaExacto(headers, [
        '¿Tienes interés en un servicio o formación específica?/Tecnología - Programación',
        'Inclusión Laboral/¿Tienes interés en un servicio o formación específica?/Tecnología - Programación'
      ]),
      colAlfabetizacion: buscarIndiceColumnaExacto(headers, [
        '¿Tienes interés en un servicio o formación específica?/Alfabetización digital',
        'Inclusión Laboral/¿Tienes interés en un servicio o formación específica?/Alfabetización digital'
      ]),
      colCertificacion: buscarIndiceColumnaExacto(headers, [
        '¿Tienes interés en un servicio o formación específica?/Certificación Microsoft',
        'Inclusión Laboral/¿Tienes interés en un servicio o formación específica?/Certificación Microsoft'
      ]),
      colServicioCliente: buscarIndiceColumnaExacto(headers, [
        '¿Tienes interés en un servicio o formación específica?/Servicio al Cliente',
        'Inclusión Laboral/¿Tienes interés en un servicio o formación específica?/Servicio al Cliente'
      ]),

      // Desea inscribirse en Inclusión Laboral
      deseaInscribirse: buscarIndiceColumnaExacto(headers, [
        'Inclusión Laboral/¿Deseas inscribirte en el programa de Inclusión Laboral?',
        '¿Deseas inscribirte en el programa de Inclusión Laboral?'
      ]),

      // Observaciones/Comentarios adicionales
      observaciones: buscarIndiceColumnaExacto(headers, [
        'Observaciones / Comentarios adicionales',
        'Observaciones',
        'Comentarios adicionales',
        'Comentarios',
        'Notas'
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
      // Detectar programas seleccionados mediante las columnas binarias
      const esMarketing = colIndices.colMarketing >= 0 && fila[colIndices.colMarketing] == '1';
      const esProgramacion = colIndices.colProgramacion >= 0 && fila[colIndices.colProgramacion] == '1';
      const esAlfabetizacion = colIndices.colAlfabetizacion >= 0 && fila[colIndices.colAlfabetizacion] == '1';
      const esCertificacion = colIndices.colCertificacion >= 0 && fila[colIndices.colCertificacion] == '1';
      const esServicioCliente = colIndices.colServicioCliente >= 0 && fila[colIndices.colServicioCliente] == '1';

      // Si no tiene ningún programa de tecnología en las columnas binarias, 
      // buscar como respaldo en el resto de la fila (para compatibilidad con formatos viejos)
      let esTech = esMarketing || esProgramacion || esAlfabetizacion || esCertificacion || esServicioCliente;
      
      if (!esTech) {
        for (let col = 0; col < fila.length; col++) {
          const valor = (fila[col] || '').toString().toLowerCase();
          if (valor && (valor.includes('marketing') || valor.includes('programacion') || 
                        valor.includes('programación') || valor.includes('alfabetizacion') ||
                        valor.includes('alfabetización') || valor.includes('microsoft') ||
                        valor.includes('servicio al cliente'))) {
            esTech = true;
            break;
          }
        }
      }

      // Si no tiene ningún programa de tecnología, omitir
      if (!esTech) {
        omitidosNoTech++;
        continue;
      }

      // Obtener el texto de la especialidad (para logs)
      let textoDetectado = '';
      if (esMarketing) textoDetectado += ' Marketing';
      if (esProgramacion) textoDetectado += ' Programación';
      if (esAlfabetizacion) textoDetectado += ' Alfabetización';
      if (esCertificacion) textoDetectado += ' Certificación';
      if (esServicioCliente) textoDetectado += ' Servicio Cliente';
      
      Logger.log('✅ DETECTADO TECH:' + textoDetectado);

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

      // Obtener fecha de registro desde campo seleccionado de Kobo
      let fechaRegistroKobo = '';
      if (colIndices.fechaRegistro >= 0 && fila[colIndices.fechaRegistro]) {
        let rawFecha = fila[colIndices.fechaRegistro].toString().trim();
        rawFecha = rawFecha.replace(/^["']|["']$/g, ''); // Limpiar posibles comillas perdidas
        if (rawFecha) {
          // Reemplazar la T para parsear mejor en Sheets
          fechaRegistroKobo = rawFecha.replace('T', ' '); 
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

      // Obtener datos de las preguntas de Inclusión Laboral
      const deseaInscribirse = colIndices.deseaInscribirse >= 0 ?
        (fila[colIndices.deseaInscribirse] || '').toString().trim() : '';

      // Construir el texto del servicio/formación basado en las columnas binarias
      let programasSeleccionados = [];
      if (esMarketing) programasSeleccionados.push('Marketing');
      if (esProgramacion) programasSeleccionados.push('Programación');
      if (esAlfabetizacion) programasSeleccionados.push('Alfabetización Digital');
      if (esCertificacion) programasSeleccionados.push('Certificación Microsoft');
      if (esServicioCliente) programasSeleccionados.push('Servicio al Cliente');

      const servicioFormacion = programasSeleccionados.length > 0 ? programasSeleccionados.join(', ') : '';

      // Obtener observaciones/comentarios de Kobo para la columna Notas
      // Primero limpiar, luego importar, si no hay nota dejar en blanco
      let observacionesKobo = '';
      if (colIndices.observaciones >= 0 && fila[colIndices.observaciones] != null && fila[colIndices.observaciones] !== '') {
        observacionesKobo = fila[colIndices.observaciones].toString().trim();
      }

      // Extender la hoja si nuevaFila supera el número de filas disponibles
      // Obtener la siguiente fila realmente vacía (sin huecos ni sobreescrituras)
      const nuevaFila = siguienteFilaVacia();
      colESnapshot[filaVaciaIdx] = nombreCompleto; // marcar como ocupada en memoria
      filaVaciaIdx++;

      // Limpiar validaciones solo en columnas intermedias (C-O) para no borrar
      // el dropdown de Estado (columna P) ni las protecciones de A y B
      hojaInteres.getRange(nuevaFila, 3, 1, 13).clearDataValidations();

      // Usar fecha de Kobo si existe; si no, poner fecha de hoy como valor fijo
      let fechaParaHoja = new Date();
      if (fechaRegistroKobo) {
        // Intentar parsear YYYY-MM-DD robustamente
        const fParts = fechaRegistroKobo.split('-');
        if (fParts.length >= 3) {
           const year = parseInt(fParts[0], 10);
           const month = parseInt(fParts[1], 10) - 1; // Meses en JS son 0-11
           const day = parseInt(fParts[2].substring(0, 2), 10);
           if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
               fechaParaHoja = new Date(year, month, day);
           }
        } else {
           fechaParaHoja = new Date(fechaRegistroKobo);
        }
      }

      // Preparar registro
      const registro = [
        fechaParaHoja,      // A: Fecha Registro (valor fijo, no fórmula dinámica)
        '',                 // B: No. (fórmula automática)
        creamosId,          // C: Creamos ID
        dpi,                // D: DPI
        nombreCompleto,     // E: Nombre Completo
        genero,             // F: Género
        edad,               // G: Edad
        telefono,           // H: Teléfono
        nivelEducativo,     // I: Nivel Educativo
        zona,               // J: Zona
        comoSeEntero,       // K: Cómo se enteró
        '',                 // L: Responsable
        observacionesKobo,  // M: Notas (comentarios/observaciones de Kobo)
        deseaInscribirse,   // N: ¿Deseas inscribirte?
        servicioFormacion,  // O: Servicio/Formación de Interés (programas seleccionados)
        ''                  // P: Estado (vacío para que el dropdown funcione)
      ];

      hojaInteres.getRange(nuevaFila, 1, 1, 16).setValues([registro]);

      // RESALTADO AUTOMÁTICO 2026: Si el registro es del año 2026, aplicar color de fondo
      if (fechaParaHoja && fechaParaHoja instanceof Date && fechaParaHoja.getFullYear() === 2026) {
        hojaInteres.getRange(nuevaFila, 1, 1, 16).setBackground('#fff3e0'); // Ámbar claro
      }

      // Restaurar fórmula de No. (columna B) que setValues sobreescribe
      hojaInteres.getRange('B' + nuevaFila).setFormula('=IF(E' + nuevaFila + '<>"",COUNTA($E$2:E' + nuevaFila + '),"")');

      // Restaurar dropdown de Género (detección dinámica)
      const hdrsHIGenero = hojaInteres.getRange(1, 1, 1, hojaInteres.getLastColumn()).getValues()[0];
      const colGeneroHI = hdrsHIGenero.findIndex(h => h.toString().trim().toLowerCase() === 'género') + 1;
      if (colGeneroHI > 0) {
        hojaInteres.getRange(nuevaFila, colGeneroHI).setDataValidation(
          SpreadsheetApp.newDataValidation().requireValueInList(CONFIG_TECH.GENEROS).setAllowInvalid(true).build()
        );
      }

      // Restaurar dropdown de Estado (detección dinámica)
      const colEstadoHI = hdrsHIGenero.findIndex(h => h.toString().trim() === 'Estado') + 1;
      if (colEstadoHI > 0) {
        hojaInteres.getRange(nuevaFila, colEstadoHI).setDataValidation(
          SpreadsheetApp.newDataValidation()
            .requireValueInList(['Entrevista agendada', 'Reprogramada', 'No interesada/o'])
            .setAllowInvalid(true).build()
        );
      }

      if (creamosId) idsExistentes.add(creamosId.toUpperCase());
      if (dpi) dpisExistentes.add(dpi);
      if (nombreCompleto) nombresExistentes.add(nombreCompleto.toLowerCase());
      importados++;
    }

    const mensaje = '✅ IMPORTACIÓN TECNOLOGÍA FINALIZADA\n\n' +
      '📥 Importados: ' + importados + '\n' +
      '🔄 Duplicados omitidos: ' + omitidosDuplicados + '\n' +
      '🚫 No Tech (omitidos): ' + omitidosNoTech;

    ss.toast(mensaje, 'Importación Tech', 8);
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
 * =====================================================================
 * ACTUALIZAR NOTAS DE REGISTROS EXISTENTES DESDE KOBO
 * =====================================================================
 *
 * Esta función actualiza la columna "Notas" (M) de los registros existentes
 * con las observaciones/comentarios de Kobo, sin borrar ni modificar nada más.
 *
 * Útil para aplicar correcciones de mapeo sin tener que reimportar todo.
 */
function actualizarNotasDesdeKoboTech() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  // Confirmar acción
  const respuesta = ui.alert(
    '🔄 Actualizar Notas desde Kobo',
    'Esta acción actualizará la columna "Notas" de todos los registros existentes con los comentarios de Kobo.\n\n' +
    '✅ Se mantendrán todos los demás datos\n' +
    '✅ Solo se actualizará la columna M (Notas)\n' +
    '✅ Obtiene TODOS los registros (hasta 30,000)\n\n' +
    '¿Deseas continuar?',
    ui.ButtonSet.YES_NO
  );

  if (respuesta !== ui.Button.YES) {
    ss.toast('❌ Operación cancelada', 'Actualización cancelada', 3);
    return;
  }

  try {
    ss.toast('🔄 Actualizando notas desde Kobo...', 'Actualización', 3);

    // === PASO 1: Obtener datos de Kobo usando JSON API (sin límite de 200) ===
    // Usar el asset ID del formulario actual (C_01_Hoja de Interés 2026)
    const assetId = 'auvEELWQEgiwF54W4pGpV5';
    const url = 'https://kf.kobotoolbox.org/api/v2/assets/' + assetId + '/data.json?limit=30000';

    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true, followRedirects: true });
    const responseCode = response.getResponseCode();

    if (responseCode !== 200) {
      throw new Error('Error HTTP: ' + responseCode + '. No se pudo conectar con Kobo.');
    }

    const jsonData = JSON.parse(response.getContentText('UTF-8'));

    if (!jsonData.results || jsonData.results.length === 0) {
      throw new Error('No hay datos en Kobo para actualizar');
    }

    // Crear mapa de observaciones por CreamosID y DPI
    const observacionesPorId = new Map();
    const observacionesPorDpi = new Map();

    for (let i = 0; i < jsonData.results.length; i++) {
      const registro = jsonData.results[i];

      // Buscar campos en el JSON (pueden tener diferentes nombres)
      const creamosId = (registro['Inicio/CREAMOS_ID'] || registro['CREAMOS_ID'] || registro['creamosid'] || '').toString().trim().toUpperCase();
      const dpi = (registro['Inicio/DPI_Documento_Personal_de_Identificaci_n_'] || registro['DPI'] || registro['dpi'] || '').toString().trim();
      const observaciones = (registro['Observaciones_Comentarios_adicionales'] || registro['Observaciones'] || registro['Comentarios_adicionales'] || registro['Comentarios'] || registro['Notas'] || '').toString().trim();

      if (creamosId) observacionesPorId.set(creamosId, observaciones);
      if (dpi) observacionesPorDpi.set(dpi, observaciones);
    }

    Logger.log('Total de registros obtenidos de Kobo: ' + jsonData.results.length);

    // === PASO 2: Actualizar registros existentes ===
    const hojaInteres = ss.getSheetByName('Hoja de Interés');
    const datos = hojaInteres.getDataRange().getValues();

    let actualizados = 0;
    let sinCoincidencia = 0;
    let sinCambios = 0;

    for (let i = 1; i < datos.length; i++) {
      const fila = datos[i];
      const creamosId = fila[2] ? fila[2].toString().trim().toUpperCase() : ''; // Columna C
      const dpi = fila[3] ? fila[3].toString().trim() : ''; // Columna D
      const notasActuales = fila[12] ? fila[12].toString().trim() : ''; // Columna M

      // Buscar observaciones en Kobo
      let observacionesKobo = '';
      if (creamosId && observacionesPorId.has(creamosId)) {
        observacionesKobo = observacionesPorId.get(creamosId);
      } else if (dpi && observacionesPorDpi.has(dpi)) {
        observacionesKobo = observacionesPorDpi.get(dpi);
      } else {
        sinCoincidencia++;
        continue;
      }

      // Solo actualizar si hay cambios
      if (observacionesKobo !== notasActuales) {
        hojaInteres.getRange(i + 1, 13).setValue(observacionesKobo); // Columna M
        actualizados++;
      } else {
        sinCambios++;
      }
    }

    const mensaje = '✅ ACTUALIZACIÓN DE NOTAS FINALIZADA\n\n' +
      '🔄 Registros actualizados: ' + actualizados + '\n' +
      '✓ Sin cambios: ' + sinCambios + '\n' +
      '⚠ Sin coincidencia en Kobo: ' + sinCoincidencia;

    ui.alert('Actualización completada', mensaje, ui.ButtonSet.OK);
    ss.toast(mensaje, 'Actualización completada', 8);
    Logger.log(mensaje);

  } catch (error) {
    ss.toast('❌ Error: ' + error.message, 'Error de Actualización', 5);
    Logger.log('❌ Error actualizando notas: ' + error.message);
    Logger.log(error.stack);
  }
}

/**
 * =====================================================================
 * LIMPIAR TODAS LAS NOTAS
 * =====================================================================
 * Borra todas las notas de la columna M (Notas) en la Hoja de Interés
 */
function limpiarTodasLasNotasTech() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  // Confirmar acción
  const respuesta = ui.alert(
    '🗑️ Limpiar Todas las Notas',
    '⚠️ ATENCIÓN: Esta acción borrará TODAS las notas de la columna "Notas".\n\n' +
    '❌ Esta acción NO se puede deshacer fácilmente\n' +
    '💡 Recomendación: Haz una copia de seguridad primero\n\n' +
    '¿Estás seguro de que deseas continuar?',
    ui.ButtonSet.YES_NO
  );

  if (respuesta !== ui.Button.YES) {
    ss.toast('❌ Operación cancelada', 'Limpieza cancelada', 3);
    return;
  }

  try {
    ss.toast('🗑️ Limpiando todas las notas...', 'Limpieza', 3);

    const hojaInteres = ss.getSheetByName('Hoja de Interés');
    const datos = hojaInteres.getDataRange().getValues();

    let notasLimpiadas = 0;

    // Empezar desde fila 2 (índice 1) para omitir encabezados
    for (let i = 1; i < datos.length; i++) {
      const notasActuales = datos[i][12] ? datos[i][12].toString().trim() : ''; // Columna M

      if (notasActuales !== '') {
        hojaInteres.getRange(i + 1, 13).setValue(''); // Limpiar columna M
        notasLimpiadas++;
      }
    }

    const mensaje = '✅ LIMPIEZA DE NOTAS FINALIZADA\n\n' +
      '🗑️ Notas eliminadas: ' + notasLimpiadas + '\n' +
      '📊 Total de registros: ' + (datos.length - 1);

    ui.alert('Limpieza completada', mensaje, ui.ButtonSet.OK);
    ss.toast(mensaje, 'Limpieza completada', 5);
    Logger.log(mensaje);

  } catch (error) {
    ss.toast('❌ Error: ' + error.message, 'Error de Limpieza', 5);
    Logger.log('❌ Error limpiando notas: ' + error.message);
    Logger.log(error.stack);
  }
}

/**
 * =====================================================================
 * ACTUALIZAR SOLO NOTAS HISTÓRICAS (antes de 2026)
 * =====================================================================
 */
function actualizarNotasHistoricasTech() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  // Confirmar acción
  const respuesta = ui.alert(
    '📚 Actualizar Notas Históricas',
    'Esta acción actualizará la columna "Notas" de TODOS los registros históricos.\n\n' +
    '✅ Se mantendrán todos los demás datos\n' +
    '✅ Se actualizarán registros de todos los años\n\n' +
    '¿Deseas continuar?',
    ui.ButtonSet.YES_NO
  );

  if (respuesta !== ui.Button.YES) {
    ss.toast('❌ Operación cancelada', 'Actualización cancelada', 3);
    return;
  }

  actualizarNotasPorFiltroTech('historicas');
}

/**
 * =====================================================================
 * ACTUALIZAR SOLO NOTAS NUEVAS (2026)
 * =====================================================================
 */
function actualizarNotasNuevasTech() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  // Confirmar acción
  const respuesta = ui.alert(
    '🆕 Actualizar Notas Nuevas (2026)',
    'Esta acción actualizará la columna "Notas" solo de los registros NUEVOS (2026).\n\n' +
    '✅ Se mantendrán todos los demás datos\n' +
    '✅ Solo se actualizarán registros del 2026\n\n' +
    '¿Deseas continuar?',
    ui.ButtonSet.YES_NO
  );

  if (respuesta !== ui.Button.YES) {
    ss.toast('❌ Operación cancelada', 'Actualización cancelada', 3);
    return;
  }

  actualizarNotasPorFiltroTech('nuevas');
}

/**
 * =====================================================================
 * FUNCIÓN AUXILIAR: Actualizar notas con filtro
 * =====================================================================
 * @param {string} filtro - 'historicas' o 'nuevas'
 */
function actualizarNotasPorFiltroTech(filtro) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  try {
    const tipoRegistro = filtro === 'historicas' ? 'históricos' : 'nuevos (2026)';
    ss.toast('🔄 Actualizando notas de registros ' + tipoRegistro + '...', 'Actualización', 3);

    // === PASO 1: Obtener datos de Kobo usando JSON API (sin límite de 200) ===
    // Usar el asset ID del formulario actual (C_01_Hoja de Interés 2026)
    const assetId = 'auvEELWQEgiwF54W4pGpV5';
    const url = 'https://kf.kobotoolbox.org/api/v2/assets/' + assetId + '/data.json?limit=30000';

    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true, followRedirects: true });
    const responseCode = response.getResponseCode();

    if (responseCode !== 200) {
      throw new Error('Error HTTP: ' + responseCode + '. No se pudo conectar con Kobo.');
    }

    const jsonData = JSON.parse(response.getContentText('UTF-8'));

    if (!jsonData.results || jsonData.results.length === 0) {
      throw new Error('No hay datos en Kobo para actualizar');
    }

    // Crear mapa de observaciones por CreamosID y DPI
    const observacionesPorId = new Map();
    const observacionesPorDpi = new Map();

    for (let i = 0; i < jsonData.results.length; i++) {
      const registro = jsonData.results[i];

      // Buscar campos en el JSON (pueden tener diferentes nombres)
      const creamosId = (registro['Inicio/CREAMOS_ID'] || registro['CREAMOS_ID'] || registro['creamosid'] || '').toString().trim().toUpperCase();
      const dpi = (registro['Inicio/DPI_Documento_Personal_de_Identificaci_n_'] || registro['DPI'] || registro['dpi'] || '').toString().trim();
      const observaciones = (registro['Observaciones_Comentarios_adicionales'] || registro['Observaciones'] || registro['Comentarios_adicionales'] || registro['Comentarios'] || registro['Notas'] || '').toString().trim();

      if (creamosId) observacionesPorId.set(creamosId, observaciones);
      if (dpi) observacionesPorDpi.set(dpi, observaciones);
    }

    Logger.log('Total de registros obtenidos de Kobo: ' + jsonData.results.length);

    // === PASO 2: Actualizar registros existentes con filtro ===
    const hojaInteres = ss.getSheetByName('Hoja de Interés');
    const datos = hojaInteres.getDataRange().getValues();

    let actualizados = 0;
    let sinCoincidencia = 0;
    let sinCambios = 0;
    let omitidos = 0; // Registros que no cumplen el filtro

    for (let i = 1; i < datos.length; i++) {
      const fila = datos[i];
      const fechaRegistro = fila[0]; // Columna A - Fecha de Registro
      const creamosId = fila[2] ? fila[2].toString().trim().toUpperCase() : ''; // Columna C
      const dpi = fila[3] ? fila[3].toString().trim() : ''; // Columna D
      const notasActuales = fila[12] ? fila[12].toString().trim() : ''; // Columna M

      // Aplicar filtro por fecha
      let cumpleFiltro = false;

      if (fechaRegistro && fechaRegistro instanceof Date) {
        const anio = fechaRegistro.getFullYear();

        if (filtro === 'historicas') {
          // Históricos: TODOS los registros
          cumpleFiltro = true;
        } else if (filtro === 'nuevas') {
          // Nuevos: solo 2026
          cumpleFiltro = (anio === 2026);
        }
      } else if (typeof fechaRegistro === 'string' && fechaRegistro.trim() !== '') {
        // Intentar parsear fecha como string
        const fecha = new Date(fechaRegistro);
        if (!isNaN(fecha.getTime())) {
          const anio = fecha.getFullYear();

          if (filtro === 'historicas') {
            // Históricos: TODOS los registros
            cumpleFiltro = true;
          } else if (filtro === 'nuevas') {
            // Nuevos: solo 2026
            cumpleFiltro = (anio === 2026);
          }
        } else {
          // Si no se puede parsear la fecha
          if (filtro === 'historicas') {
            cumpleFiltro = true; // Incluir en históricos
          } else if (filtro === 'nuevas') {
            cumpleFiltro = true; // Considerar como nuevo si no hay fecha válida
          }
        }
      } else {
        // Si no hay fecha válida
        if (filtro === 'historicas') {
          cumpleFiltro = true; // Incluir en históricos
        } else if (filtro === 'nuevas') {
          cumpleFiltro = true; // Considerar como nuevo si no hay fecha
        }
      }

      // Si no cumple el filtro, omitir
      if (!cumpleFiltro) {
        omitidos++;
        continue;
      }

      // Buscar observaciones en Kobo
      let observacionesKobo = '';
      if (creamosId && observacionesPorId.has(creamosId)) {
        observacionesKobo = observacionesPorId.get(creamosId);
      } else if (dpi && observacionesPorDpi.has(dpi)) {
        observacionesKobo = observacionesPorDpi.get(dpi);
      } else {
        sinCoincidencia++;
        continue;
      }

      // Solo actualizar si hay cambios
      if (observacionesKobo !== notasActuales) {
        hojaInteres.getRange(i + 1, 13).setValue(observacionesKobo); // Columna M
        actualizados++;
      } else {
        sinCambios++;
      }
    }

    const mensaje = '✅ ACTUALIZACIÓN DE NOTAS ' + tipoRegistro.toUpperCase() + ' FINALIZADA\n\n' +
      '🔄 Registros actualizados: ' + actualizados + '\n' +
      '✓ Sin cambios: ' + sinCambios + '\n' +
      '⚠ Sin coincidencia en Kobo: ' + sinCoincidencia + '\n' +
      '⏭️ Omitidos (no cumplen filtro): ' + omitidos;

    ui.alert('Actualización completada', mensaje, ui.ButtonSet.OK);
    ss.toast(mensaje, 'Actualización completada', 8);
    Logger.log(mensaje);

  } catch (error) {
    ss.toast('❌ Error: ' + error.message, 'Error de Actualización', 5);
    Logger.log('❌ Error actualizando notas: ' + error.message);
    Logger.log(error.stack);
  }
}

/**
 * Busca índice de columna por coincidencia exacta o parcial
 */
function buscarIndiceColumnaExacto(headers, nombresPosibles) {
  // Limpiar y normalizar headers
  const headersNorm = headers.map(h => h ? h.toString().toLowerCase().trim().replace(/[^a-z0-9]/g, '') : '');
  const nombresNorm = nombresPosibles.map(n => n ? n.toString().toLowerCase().trim().replace(/[^a-z0-9]/g, '') : '');

  // 1. Coincidencia exacta con super-normalización
  for (let i = 0; i < headersNorm.length; i++) {
    for (const nombre of nombresNorm) {
      if (headersNorm[i] === nombre && nombre !== '') {
        return i;
      }
    }
  }

  // 2. Coincidencia parcial si falla la exacta
  for (let i = 0; i < headersNorm.length; i++) {
    for (const nombre of nombresNorm) {
      if (nombre !== '' && headersNorm[i].includes(nombre)) {
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
  const url = CONFIG_TECH.KOBO_URL; // props.getProperty('KOBO_URL') || CONFIG_TECH.KOBO_URL;

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
  // Parser robusto que maneja campos multilínea (con saltos de línea dentro de comillas)
  const resultado = [];
  const campos = [];
  let campoActual = '';
  let dentroComillas = false;
  let i = 0;

  while (i < csvData.length) {
    const char = csvData[i];

    if (char === '"') {
      if (dentroComillas && i + 1 < csvData.length && csvData[i + 1] === '"') {
        // Comilla escapada ("") dentro de campo entrecomillado
        campoActual += '"';
        i += 2;
        continue;
      } else {
        // Abrir o cerrar comillas
        dentroComillas = !dentroComillas;
        i++;
        continue;
      }
    }

    if (!dentroComillas) {
      if (char === separador) {
        // Fin de campo
        campos.push(campoActual.trim());
        campoActual = '';
        i++;
        continue;
      }
      if (char === '\r' || char === '\n') {
        // Fin de fila (saltar \r\n como una sola secuencia)
        if (char === '\r' && i + 1 < csvData.length && csvData[i + 1] === '\n') {
          i++;
        }
        campos.push(campoActual.trim());
        if (campos.some(c => c.length > 0)) {
          resultado.push(campos.slice());
        }
        campos.length = 0;
        campoActual = '';
        i++;
        continue;
      }
    }

    // Carácter normal (o salto de línea dentro de comillas → se preserva)
    campoActual += char;
    i++;
  }

  // Última fila si no termina en newline
  if (campoActual.length > 0 || campos.length > 0) {
    campos.push(campoActual.trim());
    if (campos.some(c => c.length > 0)) {
      resultado.push(campos.slice());
    }
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
 * DIAGNÓSTICO COMPLETO: Crea una hoja temporal con toda la información del CSV
 */
function diagnosticarCSVCompleto() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const props = PropertiesService.getDocumentProperties();
  const url = props.getProperty('KOBO_ENTREVISTAS_URL') || CONFIG_TECH.KOBO_ENTREVISTAS_URL;

  if (!url) {
    ui.alert('⚠️ URL no configurada', 'Configure la URL de Entrevistas de KoboToolbox primero.', ui.ButtonSet.OK);
    return;
  }

  try {
    ss.toast('📥 Descargando CSV desde Kobo...', 'Diagnóstico', 3);

    const response = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
      followRedirects: true,
      headers: { 'Accept': 'text/csv, application/csv, text/plain' }
    });

    const responseCode = response.getResponseCode();
    if (responseCode !== 200) {
      ui.alert('Error HTTP', 'Código de respuesta: ' + responseCode, ui.ButtonSet.OK);
      return;
    }

    let csvData = response.getContentText('UTF-8');
    if (!csvData || csvData.trim().length === 0) {
      ui.alert('Error', 'No se recibieron datos del servidor', ui.ButtonSet.OK);
      return;
    }

    // Limpiar BOM
    if (csvData.charCodeAt(0) === 0xFEFF) {
      csvData = csvData.substring(1);
    }

    // Crear o limpiar hoja de diagnóstico
    let diagnosticoSheet = ss.getSheetByName('🔍 Diagnóstico CSV');
    if (diagnosticoSheet) {
      diagnosticoSheet.clear();
    } else {
      diagnosticoSheet = ss.insertSheet('🔍 Diagnóstico CSV');
    }

    // Analizar separadores
    const lineas = csvData.split('\n');
    const primeraLinea = lineas[0];
    const countComas = (primeraLinea.match(/,/g) || []).length;
    const countPuntoComa = (primeraLinea.match(/;/g) || []).length;
    const countTabs = (primeraLinea.match(/\t/g) || []).length;

    // Escribir información general
    let row = 1;
    diagnosticoSheet.getRange(row++, 1, 1, 2).setValues([['🔍 DIAGNÓSTICO CSV', new Date()]]);
    diagnosticoSheet.getRange(row++, 1).setValue('');
    diagnosticoSheet.getRange(row++, 1, 1, 2).setValues([['Total de líneas:', lineas.length]]);
    diagnosticoSheet.getRange(row++, 1, 1, 2).setValues([['Tamaño (caracteres):', csvData.length]]);
    diagnosticoSheet.getRange(row++, 1).setValue('');
    diagnosticoSheet.getRange(row++, 1).setValue('CONTEO DE SEPARADORES (línea 1):');
    diagnosticoSheet.getRange(row++, 1, 1, 2).setValues([['Comas (,)', countComas]]);
    diagnosticoSheet.getRange(row++, 1, 1, 2).setValues([['Punto y coma (;)', countPuntoComa]]);
    diagnosticoSheet.getRange(row++, 1, 1, 2).setValues([['Tabs (\\t)', countTabs]]);
    diagnosticoSheet.getRange(row++, 1).setValue('');

    // Detectar separador
    const separador = countPuntoComa > countComas ? ';' : ',';
    diagnosticoSheet.getRange(row++, 1, 1, 2).setValues([['Separador detectado:', separador === ';' ? 'Punto y coma (;)' : 'Coma (,)']]);
    diagnosticoSheet.getRange(row++, 1).setValue('');

    // Mostrar primeras 5 líneas RAW
    diagnosticoSheet.getRange(row++, 1).setValue('PRIMERAS 5 LÍNEAS (SIN PROCESAR):');
    for (let i = 0; i < Math.min(5, lineas.length); i++) {
      diagnosticoSheet.getRange(row++, 1).setValue(`Línea ${i + 1}:`);
      diagnosticoSheet.getRange(row++, 1).setValue(lineas[i].substring(0, 500));
      diagnosticoSheet.getRange(row++, 1).setValue('');
    }

    // Intentar parsear
    let rows;
    let metodoUsado = '';
    try {
      rows = Utilities.parseCsv(csvData, separador);
      metodoUsado = 'Utilities.parseCsv';
    } catch (e) {
      try {
        rows = parsearCSVManual(csvData, separador);
        metodoUsado = 'parsearCSVManual';
      } catch (e2) {
        diagnosticoSheet.getRange(row++, 1).setValue('❌ ERROR AL PARSEAR:');
        diagnosticoSheet.getRange(row++, 1).setValue(e.message);
        diagnosticoSheet.getRange(row++, 1).setValue(e2.message);
        ui.alert('Error', 'No se pudo parsear el CSV. Ver detalles en la hoja "🔍 Diagnóstico CSV"', ui.ButtonSet.OK);
        return;
      }
    }

    diagnosticoSheet.getRange(row++, 1, 1, 2).setValues([['Método de parseo:', metodoUsado]]);
    diagnosticoSheet.getRange(row++, 1, 1, 2).setValues([['Columnas detectadas:', rows[0].length]]);
    diagnosticoSheet.getRange(row++, 1, 1, 2).setValues([['Filas de datos:', rows.length - 1]]);
    diagnosticoSheet.getRange(row++, 1).setValue('');

    // Mostrar headers
    diagnosticoSheet.getRange(row++, 1).setValue('ENCABEZADOS (Primeros 20):');
    for (let i = 0; i < Math.min(20, rows[0].length); i++) {
      diagnosticoSheet.getRange(row++, 1, 1, 2).setValues([[`[${i}]`, rows[0][i]]]);
    }

    // === DETECTAR Y MOSTRAR FILAS DESCRIPTIVAS VS DATOS REALES ===
    diagnosticoSheet.getRange(row++, 1).setValue('');
    diagnosticoSheet.getRange(row++, 1).setValue('DETECCIÓN DE FILAS DESCRIPTIVAS:');

    const patronesHeadersDescriptivos = [
      '*Las preguntas no son',
      '¿Qué hacemos?',
      'Facilitar la inserción',
      '*Las siguientes preguntas',
      'Comentario previo',
      '### ',
      'Preguntas del Curso',
      'ÁREA DE EMPLEABILIDAD'
    ];

    let indiceDatosReales = 1;
    for (let i = 1; i < Math.min(10, rows.length); i++) {
      const primeraColumna = (rows[i][0] || '').toString().trim();
      const segundaColumna = (rows[i][1] || '').toString().trim();

      let esHeaderDescriptivo = false;
      for (const patron of patronesHeadersDescriptivos) {
        if (primeraColumna.includes(patron) || segundaColumna.includes(patron)) {
          esHeaderDescriptivo = true;
          break;
        }
      }

      const tipo = esHeaderDescriptivo ? '❌ DESCRIPTIVA' : '✅ DATOS';
      diagnosticoSheet.getRange(row++, 1, 1, 3).setValues([[
        `Fila ${i + 1}: ${tipo}`,
        primeraColumna.substring(0, 100),
        segundaColumna.substring(0, 100)
      ]]);

      if (!esHeaderDescriptivo && primeraColumna.length > 0 && indiceDatosReales === 1) {
        indiceDatosReales = i;
      }
    }

    diagnosticoSheet.getRange(row++, 1).setValue('');
    diagnosticoSheet.getRange(row++, 1, 1, 2).setValues([[
      '📍 Primera fila de datos reales detectada:',
      `Fila ${indiceDatosReales + 1} (índice ${indiceDatosReales})`
    ]]);

    // Mostrar primera fila de datos REALES
    if (rows.length > indiceDatosReales) {
      diagnosticoSheet.getRange(row++, 1).setValue('');
      diagnosticoSheet.getRange(row++, 1).setValue('PRIMERA FILA DE DATOS REALES (Primeras 10 columnas):');
      for (let i = 0; i < Math.min(10, rows[indiceDatosReales].length); i++) {
        diagnosticoSheet.getRange(row++, 1, 1, 3).setValues([[`[${i}] ${rows[0][i]}`, '→', rows[indiceDatosReales][i]]]);
      }
    }

    // Formatear
    diagnosticoSheet.getRange(1, 1, row, 3).setFontFamily('Consolas');
    diagnosticoSheet.getRange(1, 1).setFontSize(14).setFontWeight('bold');
    diagnosticoSheet.setColumnWidth(1, 300);
    diagnosticoSheet.setColumnWidth(2, 400);
    diagnosticoSheet.setColumnWidth(3, 400);

    // Activar la hoja
    ss.setActiveSheet(diagnosticoSheet);

    ui.alert('✅ Diagnóstico Completo',
      `Se creó la hoja "🔍 Diagnóstico CSV" con toda la información.\n\n` +
      `Columnas detectadas: ${rows[0].length}\n` +
      `Filas de datos: ${rows.length - 1}\n` +
      `Separador: ${separador === ';' ? 'Punto y coma' : 'Coma'}\n` +
      `Método: ${metodoUsado}`,
      ui.ButtonSet.OK);

  } catch (error) {
    ui.alert('Error', error.message + '\n\n' + error.stack, ui.ButtonSet.OK);
    Logger.log('Error en diagnosticarCSVCompleto: ' + error.stack);
  }
}


/**
 * DIAGNÓSTICO: Ver cómo se está parseando el CSV
 */
function diagnosticarCSV() {
  // Llamar a la función completa que es más útil
  diagnosticarCSVCompleto();
}


/**
 * Importa datos de ENTREVISTAS desde KoboToolbox (IL_01_Entrevista)
 * Guarda en la hoja "Detalle Entrevistas" y vincula por Creamos ID
 */
function importarEntrevistasDesdeKobo() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let ui = null;
  try {
    ui = SpreadsheetApp.getUi();
  } catch (e) {
    Logger.log('⚠️ Ejecutándose como trigger automático (sin UI)');
  }

  const props = PropertiesService.getDocumentProperties();
  const url = props.getProperty('KOBO_ENTREVISTAS_URL') || CONFIG_TECH.KOBO_ENTREVISTAS_URL;

  if (!url) {
    if (ui) {
      ui.alert('⚠️ URL no configurada', 'Configure la URL de Entrevistas de KoboToolbox primero.', ui.ButtonSet.OK);
    } else {
      Logger.log('❌ URL no configurada para Entrevistas');
    }
    return;
  }

  try {
    if (ui) ss.toast('📥 Descargando datos de entrevistas desde KoboToolbox...', 'Importando', 5);

    // Obtener última fecha de sincronización
    // Si la hoja está vacía (recién creada o reseteada), forzar importación completa
    const hojaDetalleExistente = ss.getSheetByName('Detalle Entrevistas');
    const hojaEstaVacia = !hojaDetalleExistente || hojaDetalleExistente.getLastRow() <= 1;
    let ultimaSync = hojaEstaVacia ? null : obtenerUltimaSincronizacionEntrevistas();
    if (hojaEstaVacia && obtenerUltimaSincronizacionEntrevistas()) {
      guardarUltimaSincronizacionEntrevistas(new Date(0)); // reset
      ultimaSync = null;
      Logger.log('🔄 Hoja vacía detectada → Forzando importación completa (sync reseteada)');
    }
    Logger.log(`📅 Última sincronización: ${ultimaSync || 'Primera vez (importación completa)'}`);

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

    // Detectar separador contando solo fuera de comillas
    const primeraLinea = csvData.split('\n')[0];
    let countPuntoComa = 0, countComas = 0, enComillas = false;
    for (let c = 0; c < primeraLinea.length; c++) {
      if (primeraLinea[c] === '"') { enComillas = !enComillas; continue; }
      if (!enComillas) {
        if (primeraLinea[c] === ';') countPuntoComa++;
        if (primeraLinea[c] === ',') countComas++;
      }
    }
    const separador = countPuntoComa > countComas ? ';' : ',';
    Logger.log(`🔍 Separador detectado: "${separador}" (punto y coma: ${countPuntoComa}, comas: ${countComas})`);

    // Parsear CSV con parser robusto que maneja campos multilínea
    let rows;
    try {
      rows = parsearCSVManual(csvData, separador);
    } catch (e) {
      Logger.log('⚠️ Error en parser manual, intentando Utilities.parseCsv: ' + e.message);
      rows = Utilities.parseCsv(csvData, separador);
    }

    if (!rows || rows.length < 2) {
      ss.toast('⚠️ No hay datos para importar', 'Sin Datos', 3);
      return;
    }

    const headers = rows[0];
    Logger.log('📋 Headers recibidos de Kobo (' + headers.length + ' columnas):');
    Logger.log(headers.join(' | '));

    // === LIMPIAR FILAS DE HEADERS DESCRIPTIVOS DE KOBO ===
    // Kobo a veces exporta filas adicionales con descripciones antes de los datos reales
    // Detectar y eliminar estas filas basándose en patrones conocidos
    let indiceDatosReales = 1; // Normalmente los datos empiezan en la fila 1
    const patronesHeadersDescriptivos = [
      '*Las preguntas no son',
      '¿Qué hacemos?',
      'Facilitar la inserción',
      '*Las siguientes preguntas',
      'Comentario previo',
      '### ',  // Headers con formato Markdown
      'SECCIÓN',
      'Preguntas del Curso',
      'ÁREA DE EMPLEABILIDAD'
    ];

    // Buscar la primera fila que NO sea un header descriptivo
    for (let i = 1; i < Math.min(20, rows.length); i++) {
      const primeraColumna = (rows[i][0] || '').toString().trim();
      const segundaColumna = (rows[i][1] || '').toString().trim();
      const terceraColumna = (rows[i][2] || '').toString().trim();

      // Verificar si esta fila es un header descriptivo
      // Revisar primeras 3 columnas para mejor detección
      let esHeaderDescriptivo = false;
      for (const patron of patronesHeadersDescriptivos) {
        if (primeraColumna.includes(patron) || segundaColumna.includes(patron) || terceraColumna.includes(patron)) {
          esHeaderDescriptivo = true;
          Logger.log(`🧹 Fila ${i + 1} es descriptiva (patrón: "${patron}"): ${segundaColumna.substring(0, 50)}`);
          break;
        }
      }

      // Una fila es datos reales si: no es descriptiva Y tiene contenido en alguna de las primeras columnas
      // (NO requiere Creamos ID en col 1 — puede estar vacío para registros sin ID asignado)
      const tieneAlgunValor = primeraColumna.length > 0 || segundaColumna.length > 0 || terceraColumna.length > 0;
      if (!esHeaderDescriptivo && tieneAlgunValor) {
        indiceDatosReales = i;
        Logger.log(`✅ Primera fila de datos reales encontrada en índice: ${i} (Creamos ID: ${primeraColumna})`);
        break;
      }
    }

    // Eliminar las filas de headers descriptivos
    if (indiceDatosReales > 1) {
      const filasEliminadas = indiceDatosReales - 1;
      rows.splice(1, filasEliminadas);
      Logger.log(`🧹 Eliminadas ${filasEliminadas} filas de headers descriptivos de Kobo`);
    }

    // === PROCESAR TODOS LOS REGISTROS (deduplicación por UUID, no por fecha) ===
    // El filtro por fecha fue reemplazado por dedup UUID — más confiable y no pierde registros
    const totalRegistrosKobo = rows.length - 1;
    Logger.log(`📊 Total registros en CSV de Kobo: ${totalRegistrosKobo}`);

    const filasParaProcesar = rows.slice(1); // Todas las filas excepto el header
    Logger.log(`📊 Filas a procesar: ${filasParaProcesar.length}`);

    // Mapeo de columnas de Kobo a nuestra hoja
    // Usa rutas exactas del CSV de Kobo para evitar colisiones entre secciones
    // Helper: columna siguiente al padre (para campos de seguimiento/comentario duplicados)
    const sigCol = (parentIdx) => parentIdx >= 0 ? parentIdx + 1 : -1;

    // === SECCIÓN 1: DATOS PERSONALES ===
    const idx_creamosId = buscarIndiceColumna(headers, ['DATOS PERSONALES/Creamos ID', 'SECCIÓN 1: DATOS PERSONALES / Creamos ID', 'Creamos ID', 'creamos id']);
    const idx_nombre = buscarIndiceColumna(headers, ['DATOS PERSONALES/Nombres y apellidos', 'SECCIÓN 1: DATOS PERSONALES / Nombres y apellidos', 'nombres y apellidos', 'nombre completo']);
    const idx_genero = buscarIndiceColumna(headers, ['DATOS PERSONALES/Género', 'SECCIÓN 1: DATOS PERSONALES / Género', 'género', 'genero']);
    const idx_formacionPrevia = buscarIndiceColumna(headers, ['formación o capacitación previa', 'formacion o capacitacion previa', 'SECCIÓN 1: DATOS PERSONALES / ¿Tienes alguna formación', 'formacion previa', 'tienes alguna formacion']);
    const idx_dondeFormacion = buscarIndiceColumna(headers, ['dónde y de qué fue el curso', 'donde y de que fue el curso', 'SECCIÓN 1: DATOS PERSONALES / Si sí', 'donde formacion']);
    const idx_sectorInteres = buscarIndiceColumna(headers, ['sector te gustaria trabajar', 'sector te gustaría trabajar', 'SECCIÓN 1: DATOS PERSONALES / ¿En qué sector', 'en que sector']);
    // cursoInteres: buscar el campo "Elije/Elige el curso de tu interés" - MUY ESPECÍFICO para evitar falsos positivos
    const idx_cursoInteres = buscarIndiceColumna(headers, [
      'SECCIÓN 1: DATOS PERSONALES / Elije el curso de tu interés',
      'SECCIÓN 1: DATOS PERSONALES / Elige el curso de tu interés',
      'DATOS PERSONALES/Elije el curso',
      'DATOS PERSONALES/Elige el curso',
      'Elije el curso de tu interés',
      'Elige el curso de tu interés',
      'Elije el curso',
      'Elige el curso',
      'elije el curso',
      'elige el curso',
    ]);

    Logger.log('🔍 Columnas críticas encontradas:');
    Logger.log(`   Creamos ID: ${idx_creamosId >= 0 ? 'Columna ' + idx_creamosId + ' = "' + headers[idx_creamosId] + '"' : 'NO ENCONTRADA ❌'}`);
    Logger.log(`   Nombre: ${idx_nombre >= 0 ? 'Columna ' + idx_nombre + ' = "' + headers[idx_nombre] + '"' : 'NO ENCONTRADA ❌'}`);
    Logger.log(`   Curso Interés: ${idx_cursoInteres >= 0 ? 'Columna ' + idx_cursoInteres + ' = "' + headers[idx_cursoInteres] + '"' : 'NO ENCONTRADA ❌'}`);
    Logger.log(`   Sector Interés: ${idx_sectorInteres >= 0 ? 'Columna ' + idx_sectorInteres + ' = "' + headers[idx_sectorInteres] + '"' : 'NO ENCONTRADA ❌'}`);

    // Índices de sección por posición (fallback si el nombre no coincide exactamente)
    const colsAB   = encontrarColumnasPorSeccion(headers, 'alimentos');
    const colsTECH = encontrarColumnasPorSeccion(headers, 'tecnolog');
    const colsSAC  = encontrarColumnasPorSeccion(headers, 'servicio');
    Logger.log(`   Columnas AB por "alimentos": ${colsAB.length} → [${colsAB.slice(0,5).join(',')}...]`);
    Logger.log(`   Columnas TECH por "tecnolog": ${colsTECH.length} → [${colsTECH.slice(0,5).join(',')}...]`);
    Logger.log(`   Columnas SAC por "servicio": ${colsSAC.length} → [${colsSAC.slice(0,5).join(',')}...]`);

    // === ALIMENTOS Y BEBIDAS - PREGUNTAS DEL CURSO ===
    const idx_ab_q1 = buscarIndiceColumna(headers, ['ALIMENTOS Y BEBIDAS/1. ¿Por qué', '🍎 SECCIÓN 2: ALIMENTOS Y BEBIDAS/1. ¿Por qué', 'alimentos y bebidas/1.', 'alimentos/1.']);
    const idx_ab_q2 = buscarIndiceColumna(headers, ['ALIMENTOS Y BEBIDAS/2. ¿Qué te llama', '🍎 SECCIÓN 2: ALIMENTOS Y BEBIDAS/2. ¿Qué te llama', 'alimentos y bebidas/2.', 'alimentos/2.']);
    const idx_ab_q3 = buscarIndiceColumna(headers, ['ALIMENTOS Y BEBIDAS/3. ¿Cuál es tu expectativa', '🍎 SECCIÓN 2: ALIMENTOS Y BEBIDAS/3. ¿Cuál es tu expectativa', 'alimentos y bebidas/3.', 'alimentos/3.']);
    const idx_ab_q4 = buscarIndiceColumna(headers, ['ALIMENTOS Y BEBIDAS/4. Al tomar', '🍎 SECCIÓN 2: ALIMENTOS Y BEBIDAS/4. Al tomar', 'alimentos y bebidas/4.', 'alimentos/4.']);
    const idx_ab_q5 = buscarIndiceColumna(headers, ['ALIMENTOS Y BEBIDAS/5. ¿Cuáles son las principales áreas', '🍎 SECCIÓN 2: ALIMENTOS Y BEBIDAS/5. ¿Cuáles son las principales áreas', 'alimentos y bebidas/5.', 'alimentos/5.']);
    const idx_ab_q6 = buscarIndiceColumna(headers, ['ALIMENTOS Y BEBIDAS/6. ¿Cuentas con disponibilidad de tiempo para realizar prácticas', '🍎 SECCIÓN 2: ALIMENTOS Y BEBIDAS/6. ¿Cuentas con disponibilidad de tiempo para realizar prácticas']);
    const idx_ab_planPracticas = sigCol(idx_ab_q6);
    const idx_ab_q7 = buscarIndiceColumna(headers, ['ALIMENTOS Y BEBIDAS/7. ¿Estás dispuesta', '🍎 SECCIÓN 2: ALIMENTOS Y BEBIDAS/7. ¿Estás dispuesta']);
    const idx_ab_planPapeleria = sigCol(idx_ab_q7);
    const idx_ab_q8 = buscarIndiceColumna(headers, ['ALIMENTOS Y BEBIDAS/8. ¿Cuentas con transporte', '🍎 SECCIÓN 2: ALIMENTOS Y BEBIDAS/8. ¿Cuentas con transporte']);
    const idx_ab_planTransporte = sigCol(idx_ab_q8);
    const idx_ab_q9 = buscarIndiceColumna(headers, ['ALIMENTOS Y BEBIDAS/9. ¿Estarías dispuesta', '🍎 SECCIÓN 2: ALIMENTOS Y BEBIDAS/9. ¿Estarías dispuesta']);
    const idx_ab_comentarioDoc = sigCol(idx_ab_q9);

    // === ALIMENTOS Y BEBIDAS - EMPLEABILIDAD ===
    const idx_ab_e1 = buscarIndiceColumna(headers, ['ALIMENTOS Y BEBIDAS/1. ¿Actualmente tienes trabajo', '🍎 SECCIÓN 2: ALIMENTOS Y BEBIDAS/1. ¿Actualmente tienes trabajo']);
    const idx_ab_cuentanosTrabajo = sigCol(idx_ab_e1);
    const idx_ab_e2 = buscarIndiceColumna(headers, ['ALIMENTOS Y BEBIDAS/2. ¿Estás satisfecha', '🍎 SECCIÓN 2: ALIMENTOS Y BEBIDAS/2. ¿Estás satisfecha']);
    const idx_ab_comentarioSatisfaccion = sigCol(idx_ab_e2);
    const idx_ab_e3 = buscarIndiceColumna(headers, ['ALIMENTOS Y BEBIDAS/3. ¿Qué te gustaría hacer en los próximos meses', '🍎 SECCIÓN 2: ALIMENTOS Y BEBIDAS/3. ¿Qué te gustaría hacer en los próximos meses']);
    const idx_ab_e4 = buscarIndiceColumna(headers, ['ALIMENTOS Y BEBIDAS/4. ¿Qué tan importante es para ti conseguir trabajo', '🍎 SECCIÓN 2: ALIMENTOS Y BEBIDAS/4. ¿Qué tan importante es para ti conseguir trabajo']);
    const idx_ab_e5 = buscarIndiceColumna(headers, ['ALIMENTOS Y BEBIDAS/5. ¿Te ves trabajando en el sector', '🍎 SECCIÓN 2: ALIMENTOS Y BEBIDAS/5. ¿Te ves trabajando en el sector']);
    const idx_ab_e6 = buscarIndiceColumna(headers, ['ALIMENTOS Y BEBIDAS/6. ¿Alguien te ayuda económicamente', '🍎 SECCIÓN 2: ALIMENTOS Y BEBIDAS/6. ¿Alguien te ayuda económicamente']);
    const idx_ab_comentarioAyuda = sigCol(idx_ab_e6);
    const idx_ab_e7 = buscarIndiceColumna(headers, ['ALIMENTOS Y BEBIDAS/7. ¿Alguien depende de ti económicamente', '🍎 SECCIÓN 2: ALIMENTOS Y BEBIDAS/7. ¿Alguien depende de ti económicamente']);
    const idx_ab_comentarioDependientes = sigCol(idx_ab_e7);
    const idx_ab_e8 = buscarIndiceColumna(headers, ['ALIMENTOS Y BEBIDAS/8. ¿Tienes responsabilidades de cuidado', '🍎 SECCIÓN 2: ALIMENTOS Y BEBIDAS/8. ¿Tienes responsabilidades de cuidado']);
    const idx_ab_comentarioCuidado = sigCol(idx_ab_e8);
    const idx_ab_e9 = buscarIndiceColumna(headers, ['ALIMENTOS Y BEBIDAS/9. ¿Tienes deudas bancarias', '🍎 SECCIÓN 2: ALIMENTOS Y BEBIDAS/9. ¿Tienes deudas bancarias']);
    const idx_ab_comentarioDeudas = sigCol(idx_ab_e9);
    const idx_ab_e10 = buscarIndiceColumna(headers, ['ALIMENTOS Y BEBIDAS/10. ¿Tienes manchados', '🍎 SECCIÓN 2: ALIMENTOS Y BEBIDAS/10. ¿Tienes manchados']);
    const idx_ab_comentarioAntecedentes = sigCol(idx_ab_e10);
    const idx_ab_e11 = buscarIndiceColumna(headers, ['ALIMENTOS Y BEBIDAS/11. ¿Tienes algún caso', '🍎 SECCIÓN 2: ALIMENTOS Y BEBIDAS/11. ¿Tienes algún caso']);
    const idx_ab_comentarioLegal = sigCol(idx_ab_e11);
    const idx_ab_e12 = buscarIndiceColumna(headers, ['ALIMENTOS Y BEBIDAS/12. ¿Estás dispuesto a continuar', '🍎 SECCIÓN 2: ALIMENTOS Y BEBIDAS/12. ¿Estás dispuesto a continuar']);
    const idx_ab_comentarioEmpleabilidad = sigCol(idx_ab_e12);
    const idx_ab_e13 = buscarIndiceColumna(headers, ['ALIMENTOS Y BEBIDAS/13. ¿En qué temporalidad', '🍎 SECCIÓN 2: ALIMENTOS Y BEBIDAS/13. ¿En qué temporalidad']);

    // === TECNOLOGÍA - PREGUNTAS DEL CURSO ===
    // Búsqueda con normalización de acentos: "TECNOLOGÍA" y "TECNOLOGIA" ambos funcionan
    const idx_tech_q1 = buscarIndiceColumna(headers, ['TECNOLOGÍA/1.', 'TECNOLOGIA/1.', 'tecnologia/1.', '💻 SECCIÓN 2: TECNOLOGÍA/1.']);
    const idx_tech_q2 = buscarIndiceColumna(headers, ['TECNOLOGÍA/2.', 'TECNOLOGIA/2.', 'tecnologia/2.', '💻 SECCIÓN 2: TECNOLOGÍA/2.']);
    const idx_tech_q3 = buscarIndiceColumna(headers, ['TECNOLOGÍA/3.', 'TECNOLOGIA/3.', 'tecnologia/3.', '💻 SECCIÓN 2: TECNOLOGÍA/3.']);
    const idx_tech_q4 = buscarIndiceColumna(headers, ['TECNOLOGÍA/4.', 'TECNOLOGIA/4.', 'tecnologia/4.', '💻 SECCIÓN 2: TECNOLOGÍA/4.']);
    const idx_tech_q5 = buscarIndiceColumna(headers, ['TECNOLOGÍA/5.', 'TECNOLOGIA/5.', 'tecnologia/5.', '💻 SECCIÓN 2: TECNOLOGÍA/5.']);
    const idx_tech_q6 = buscarIndiceColumna(headers, ['TECNOLOGÍA/6.', 'TECNOLOGIA/6.', 'tecnologia/6.', '💻 SECCIÓN 2: TECNOLOGÍA/6.']);
    const idx_tech_planDisponibilidad = sigCol(idx_tech_q6);
    const idx_tech_q7 = buscarIndiceColumna(headers, ['TECNOLOGÍA/7.', 'TECNOLOGIA/7.', 'tecnologia/7.', '💻 SECCIÓN 2: TECNOLOGÍA/7.']);
    const idx_tech_planTransporte = sigCol(idx_tech_q7);
    const idx_tech_q8 = buscarIndiceColumna(headers, ['TECNOLOGÍA/8.', 'TECNOLOGIA/8.', 'tecnologia/8.', '💻 SECCIÓN 2: TECNOLOGÍA/8.']);
    const idx_tech_comentarioDoc = sigCol(idx_tech_q8);

    // === TECNOLOGÍA - EMPLEABILIDAD ===
    // Buscar por sección y número de pregunta (más robusto que buscar el texto completo)
    const idx_tech_e1 = buscarIndiceColumnaAND(headers, ['tecnolog', 'actualmente tienes trabajo']);
    const idx_tech_cuentanosTrabajo = sigCol(idx_tech_e1);
    const idx_tech_e2 = buscarIndiceColumnaAND(headers, ['tecnolog', 'estas satisfecha']);
    const idx_tech_comentarioSatisfaccion = sigCol(idx_tech_e2);
    const idx_tech_e3 = buscarIndiceColumnaAND(headers, ['tecnolog', 'proximos meses']);
    const idx_tech_e4 = buscarIndiceColumnaAND(headers, ['tecnolog', 'importante es para ti conseguir trabajo']);
    const idx_tech_e5 = buscarIndiceColumnaAND(headers, ['tecnolog', 'te ves trabajando']);
    const idx_tech_e6 = buscarIndiceColumnaAND(headers, ['tecnolog', 'alguien te ayuda economicamente']);
    const idx_tech_comentarioAyuda = sigCol(idx_tech_e6);
    const idx_tech_e7 = buscarIndiceColumnaAND(headers, ['tecnolog', 'alguien depende de ti']);
    const idx_tech_comentarioDependientes = sigCol(idx_tech_e7);
    const idx_tech_e8 = buscarIndiceColumnaAND(headers, ['tecnolog', 'responsabilidades de cuidado']);
    const idx_tech_comentarioCuidado = sigCol(idx_tech_e8);
    const idx_tech_e9 = buscarIndiceColumnaAND(headers, ['tecnolog', 'deudas bancarias']);
    const idx_tech_comentarioDeudas = sigCol(idx_tech_e9);
    const idx_tech_e10 = buscarIndiceColumnaAND(headers, ['tecnolog', 'manchados']);
    const idx_tech_comentarioAntecedentes = sigCol(idx_tech_e10);
    const idx_tech_e11 = buscarIndiceColumnaAND(headers, ['tecnolog', 'tienes algun caso']);
    const idx_tech_comentarioLegal = sigCol(idx_tech_e11);
    const idx_tech_e12 = buscarIndiceColumnaAND(headers, ['tecnolog', 'dispuesto a continuar']);
    const idx_tech_comentarioEmpleabilidad = sigCol(idx_tech_e12);
    const idx_tech_e13 = buscarIndiceColumnaAND(headers, ['tecnolog', 'temporalidad']);

    // === SERVICIO AL CLIENTE - PREGUNTAS DEL CURSO ===
    const idx_sac_q1 = buscarIndiceColumna(headers, ['SERVICIO AL CLIENTE/1.', 'servicio al cliente/1.', '🤝 SECCIÓN 2: SERVICIO AL CLIENTE/1.']);
    const idx_sac_q2 = buscarIndiceColumna(headers, ['SERVICIO AL CLIENTE/2.', 'servicio al cliente/2.', '🤝 SECCIÓN 2: SERVICIO AL CLIENTE/2.']);
    const idx_sac_q3 = buscarIndiceColumna(headers, ['SERVICIO AL CLIENTE/3.', 'servicio al cliente/3.', '🤝 SECCIÓN 2: SERVICIO AL CLIENTE/3.']);
    const idx_sac_q4 = buscarIndiceColumna(headers, ['SERVICIO AL CLIENTE/4.', 'servicio al cliente/4.', '🤝 SECCIÓN 2: SERVICIO AL CLIENTE/4.']);
    const idx_sac_q5 = buscarIndiceColumna(headers, ['SERVICIO AL CLIENTE/5.', 'servicio al cliente/5.', '🤝 SECCIÓN 2: SERVICIO AL CLIENTE/5.']);
    const idx_sac_q6 = buscarIndiceColumna(headers, ['SERVICIO AL CLIENTE/6.', 'servicio al cliente/6.', '🤝 SECCIÓN 2: SERVICIO AL CLIENTE/6.']);
    const idx_sac_planDisponibilidad = sigCol(idx_sac_q6);
    const idx_sac_q7 = buscarIndiceColumna(headers, ['SERVICIO AL CLIENTE/7.', 'servicio al cliente/7.', '🤝 SECCIÓN 2: SERVICIO AL CLIENTE/7.']);
    const idx_sac_planTransporte = sigCol(idx_sac_q7);
    const idx_sac_q8 = buscarIndiceColumna(headers, ['SERVICIO AL CLIENTE/8.', 'servicio al cliente/8.', '🤝 SECCIÓN 2: SERVICIO AL CLIENTE/8.']);
    const idx_sac_comentarioDoc = sigCol(idx_sac_q8);

    // === SERVICIO AL CLIENTE - EMPLEABILIDAD ===
    const idx_sac_e1 = buscarIndiceColumnaAND(headers, ['servicio', 'actualmente tienes trabajo']);
    const idx_sac_cuentanosTrabajo = sigCol(idx_sac_e1);
    const idx_sac_e2 = buscarIndiceColumnaAND(headers, ['servicio', 'estas satisfecha']);
    const idx_sac_comentarioSatisfaccion = sigCol(idx_sac_e2);
    const idx_sac_e3 = buscarIndiceColumnaAND(headers, ['servicio', 'proximos meses']);
    const idx_sac_e4 = buscarIndiceColumnaAND(headers, ['servicio', 'importante es para ti conseguir trabajo']);
    const idx_sac_e5 = buscarIndiceColumnaAND(headers, ['servicio', 'te ves trabajando']);
    const idx_sac_e6 = buscarIndiceColumnaAND(headers, ['servicio', 'alguien te ayuda economicamente']);
    const idx_sac_comentarioAyuda = sigCol(idx_sac_e6);
    const idx_sac_e7 = buscarIndiceColumnaAND(headers, ['servicio', 'alguien depende de ti']);
    const idx_sac_comentarioDependientes = sigCol(idx_sac_e7);
    const idx_sac_e8 = buscarIndiceColumnaAND(headers, ['servicio', 'responsabilidades de cuidado']);
    const idx_sac_comentarioCuidado = sigCol(idx_sac_e8);
    const idx_sac_e9 = buscarIndiceColumnaAND(headers, ['servicio', 'deudas bancarias']);
    const idx_sac_comentarioDeudas = sigCol(idx_sac_e9);
    const idx_sac_e10 = buscarIndiceColumnaAND(headers, ['servicio', 'manchados']);
    const idx_sac_comentarioAntecedentes = sigCol(idx_sac_e10);
    const idx_sac_e11 = buscarIndiceColumnaAND(headers, ['servicio', 'tienes algun caso']);
    const idx_sac_comentarioLegal = sigCol(idx_sac_e11);
    const idx_sac_e12 = buscarIndiceColumnaAND(headers, ['servicio', 'dispuesto a continuar']);
    const idx_sac_comentarioEmpleabilidad = sigCol(idx_sac_e12);
    const idx_sac_e13 = buscarIndiceColumnaAND(headers, ['servicio', 'temporalidad']);

    // === SECCIÓN 3: GÉNERO ===
    const idx_genero_previo = buscarIndiceColumna(headers, ['GÉNERO/', 'genero/', 'SECCIÓN 3', 'seccion 3', '🚺']);
    const idx_genero_gruposMixtos = buscarIndiceColumnaAND(headers, ['genero', 'mixtos'])
      || buscarIndiceColumnaAND(headers, ['sección 3', 'mixtos'])
      || buscarIndiceColumnaAND(headers, ['GÉNERO', 'mixtos']);
    const idx_genero_comentarioMixtos = sigCol(idx_genero_gruposMixtos);
    const idx_genero_gruposDiversos = buscarIndiceColumnaAND(headers, ['genero', 'diversos'])
      || buscarIndiceColumnaAND(headers, ['sección 3', 'diversos'])
      || buscarIndiceColumnaAND(headers, ['GÉNERO', 'diversos']);
    const idx_genero_comentarioDiversos = sigCol(idx_genero_gruposDiversos);
    const idx_genero_conflictoGrupos = buscarIndiceColumnaAND(headers, ['genero', 'conflicto'])
      || buscarIndiceColumnaAND(headers, ['genero', 'casa'])
      || buscarIndiceColumnaAND(headers, ['sección 3', 'casa'])
      || buscarIndiceColumnaAND(headers, ['GÉNERO', 'casa']);
    const idx_genero_comentarioConflictoGrupos = sigCol(idx_genero_conflictoGrupos);
    const idx_genero_conflictoHorarios = buscarIndiceColumnaAND(headers, ['genero', 'horarios'])
      || buscarIndiceColumnaAND(headers, ['sección 3', 'horarios'])
      || buscarIndiceColumnaAND(headers, ['GÉNERO', 'horarios']);
    const idx_genero_comentarioConflictoHorarios = sigCol(idx_genero_conflictoHorarios);
    const idx_genero_grupoMujeres = buscarIndiceColumnaAND(headers, ['genero', 'mujeres'])
      || buscarIndiceColumnaAND(headers, ['sección 3', 'mujeres'])
      || buscarIndiceColumnaAND(headers, ['GÉNERO', 'mujeres']);
    const idx_genero_igualdadHM = buscarIndiceColumnaAND(headers, ['genero', 'igual'])
      || buscarIndiceColumnaAND(headers, ['sección 3', 'igual'])
      || buscarIndiceColumnaAND(headers, ['GÉNERO', 'igual']);
    const idx_genero_familiaresCreamos = buscarIndiceColumnaAND(headers, ['genero', 'creamos'])
      || buscarIndiceColumnaAND(headers, ['sección 3', 'creamos']);
    const idx_genero_nombresFamiliares = buscarIndiceColumnaAND(headers, ['genero', 'nombres'])
      || buscarIndiceColumnaAND(headers, ['sección 3', 'nombres']);

    const colMap = {
      // === SECCIÓN 1: DATOS PERSONALES ===
      creamosId: idx_creamosId,
      nombre: idx_nombre,
      genero: idx_genero,
      formacionPrevia: idx_formacionPrevia,
      dondeFormacion: idx_dondeFormacion,
      sectorInteres: idx_sectorInteres,
      cursoInteres: idx_cursoInteres,

      // === ALIMENTOS Y BEBIDAS - PREGUNTAS DEL CURSO ===
      ab_porQueInteres: idx_ab_q1,
      ab_queLlamaAtencion: idx_ab_q2,
      ab_expectativaCurso: idx_ab_q3,
      ab_dificultadesCurso: idx_ab_q4,
      ab_areasVida: idx_ab_q5,
      ab_disponibilidadPracticas: idx_ab_q6,
      ab_planPracticas: idx_ab_planPracticas,
      ab_tramitarPapeleria: idx_ab_q7,
      ab_planPapeleria: idx_ab_planPapeleria,
      ab_transporte: idx_ab_q8,
      ab_planTransporte: idx_ab_planTransporte,
      ab_firmarDocumento: idx_ab_q9,
      ab_comentarioDoc: idx_ab_comentarioDoc,

      // === ALIMENTOS Y BEBIDAS - EMPLEABILIDAD ===
      ab_tieneTrabajoActual: idx_ab_e1,
      ab_cuentanosTrabajo: idx_ab_cuentanosTrabajo,
      ab_satisfechoTrabajo: idx_ab_e2,
      ab_comentarioSatisfaccion: idx_ab_comentarioSatisfaccion,
      ab_proximosMeses: idx_ab_e3,
      ab_importanciaTrabajo: idx_ab_e4,
      ab_teVesSector: idx_ab_e5,
      ab_ayudaEconomica: idx_ab_e6,
      ab_comentarioAyuda: idx_ab_comentarioAyuda,
      ab_dependientes: idx_ab_e7,
      ab_comentarioDependientes: idx_ab_comentarioDependientes,
      ab_responsabilidadesCuidado: idx_ab_e8,
      ab_comentarioCuidado: idx_ab_comentarioCuidado,
      ab_deudasBancarias: idx_ab_e9,
      ab_comentarioDeudas: idx_ab_comentarioDeudas,
      ab_antecedentes: idx_ab_e10,
      ab_comentarioAntecedentes: idx_ab_comentarioAntecedentes,
      ab_casoLegal: idx_ab_e11,
      ab_comentarioLegal: idx_ab_comentarioLegal,
      ab_dispuestoEmpleabilidad: idx_ab_e12,
      ab_comentarioEmpleabilidad: idx_ab_comentarioEmpleabilidad,
      ab_temporalidadMetas: idx_ab_e13,

      // === TECNOLOGÍA - PREGUNTAS DEL CURSO ===
      tech_porQueInteres: idx_tech_q1,
      tech_queLlamaAtencion: idx_tech_q2,
      tech_expectativaCurso: idx_tech_q3,
      tech_dificultadesCurso: idx_tech_q4,
      tech_areasVida: idx_tech_q5,
      tech_disponibilidadCurso: idx_tech_q6,
      tech_planDisponibilidad: idx_tech_planDisponibilidad,
      tech_transporte: idx_tech_q7,
      tech_planTransporte: idx_tech_planTransporte,
      tech_firmarDocumento: idx_tech_q8,
      tech_comentarioDoc: idx_tech_comentarioDoc,

      // === TECNOLOGÍA - EMPLEABILIDAD ===
      tech_tieneTrabajoActual: idx_tech_e1,
      tech_cuentanosTrabajo: idx_tech_cuentanosTrabajo,
      tech_satisfechoTrabajo: idx_tech_e2,
      tech_comentarioSatisfaccion: idx_tech_comentarioSatisfaccion,
      tech_proximosMeses: idx_tech_e3,
      tech_importanciaTrabajo: idx_tech_e4,
      tech_teVesSector: idx_tech_e5,
      tech_ayudaEconomica: idx_tech_e6,
      tech_comentarioAyuda: idx_tech_comentarioAyuda,
      tech_dependientes: idx_tech_e7,
      tech_comentarioDependientes: idx_tech_comentarioDependientes,
      tech_responsabilidadesCuidado: idx_tech_e8,
      tech_comentarioCuidado: idx_tech_comentarioCuidado,
      tech_deudasBancarias: idx_tech_e9,
      tech_comentarioDeudas: idx_tech_comentarioDeudas,
      tech_antecedentes: idx_tech_e10,
      tech_comentarioAntecedentes: idx_tech_comentarioAntecedentes,
      tech_casoLegal: idx_tech_e11,
      tech_comentarioLegal: idx_tech_comentarioLegal,
      tech_dispuestoEmpleabilidad: idx_tech_e12,
      tech_comentarioEmpleabilidad: idx_tech_comentarioEmpleabilidad,
      tech_temporalidadMetas: idx_tech_e13,

      // === SERVICIO AL CLIENTE - PREGUNTAS DEL CURSO ===
      sac_porQueInteres: idx_sac_q1,
      sac_queLlamaAtencion: idx_sac_q2,
      sac_expectativaCurso: idx_sac_q3,
      sac_dificultadesCurso: idx_sac_q4,
      sac_areasVida: idx_sac_q5,
      sac_disponibilidadCurso: idx_sac_q6,
      sac_planDisponibilidad: idx_sac_planDisponibilidad,
      sac_transporte: idx_sac_q7,
      sac_planTransporte: idx_sac_planTransporte,
      sac_firmarDocumento: idx_sac_q8,
      sac_comentarioDoc: idx_sac_comentarioDoc,

      // === SERVICIO AL CLIENTE - EMPLEABILIDAD ===
      sac_tieneTrabajoActual: idx_sac_e1,
      sac_cuentanosTrabajo: idx_sac_cuentanosTrabajo,
      sac_satisfechoTrabajo: idx_sac_e2,
      sac_comentarioSatisfaccion: idx_sac_comentarioSatisfaccion,
      sac_proximosMeses: idx_sac_e3,
      sac_importanciaTrabajo: idx_sac_e4,
      sac_teVesSector: idx_sac_e5,
      sac_ayudaEconomica: idx_sac_e6,
      sac_comentarioAyuda: idx_sac_comentarioAyuda,
      sac_dependientes: idx_sac_e7,
      sac_comentarioDependientes: idx_sac_comentarioDependientes,
      sac_responsabilidadesCuidado: idx_sac_e8,
      sac_comentarioCuidado: idx_sac_comentarioCuidado,
      sac_deudasBancarias: idx_sac_e9,
      sac_comentarioDeudas: idx_sac_comentarioDeudas,
      sac_antecedentes: idx_sac_e10,
      sac_comentarioAntecedentes: idx_sac_comentarioAntecedentes,
      sac_casoLegal: idx_sac_e11,
      sac_comentarioLegal: idx_sac_comentarioLegal,
      sac_dispuestoEmpleabilidad: idx_sac_e12,
      sac_comentarioEmpleabilidad: idx_sac_comentarioEmpleabilidad,
      sac_temporalidadMetas: idx_sac_e13,

      // === SECCIÓN 3: GÉNERO ===
      genero_comentarioPrevio: idx_genero_previo,
      genero_gruposMixtos: idx_genero_gruposMixtos,
      genero_comentarioMixtos: idx_genero_comentarioMixtos,
      genero_gruposDiversos: idx_genero_gruposDiversos,
      genero_comentarioDiversos: idx_genero_comentarioDiversos,
      genero_conflictoGrupos: idx_genero_conflictoGrupos,
      genero_comentarioConflictoGrupos: idx_genero_comentarioConflictoGrupos,
      genero_conflictoHorarios: idx_genero_conflictoHorarios,
      genero_comentarioConflictoHorarios: idx_genero_comentarioConflictoHorarios,
      genero_grupoMujeres: idx_genero_grupoMujeres,
      genero_igualdadHM: idx_genero_igualdadHM,
      genero_familiaresCreamos: idx_genero_familiaresCreamos,
      genero_nombresFamiliares: idx_genero_nombresFamiliares,

      // === NOTAS Y METADATOS KOBO ===
      notasEntrevistador: buscarIndiceColumna(headers, ['NOTAS DEL ENTREVISTADOR']),
      koboId: buscarIndiceColumna(headers, ['_id']),
      koboUuid: buscarIndiceColumna(headers, ['_uuid']),
      koboSubmissionTime: buscarIndiceColumna(headers, ['_submission_time']),
      koboValidationStatus: buscarIndiceColumna(headers, ['_validation_status']),
      koboNotes: buscarIndiceColumna(headers, ['_notes']),
      koboStatus: buscarIndiceColumna(headers, ['_status']),
      koboSubmittedBy: buscarIndiceColumna(headers, ['_submitted_by']),
      koboTags: buscarIndiceColumna(headers, ['_tags']),
      koboIndex: buscarIndiceColumna(headers, ['_index']),
      koboVersion: buscarIndiceColumna(headers, ['__version__']),
      koboRootUuid: buscarIndiceColumna(headers, ['meta/rootUuid'])
    };

    Logger.log('Mapeo de columnas: ' + JSON.stringify(colMap));

    // Obtener hoja destino (usar estructura unificada)
    let detalleSheet = ss.getSheetByName('Detalle Entrevistas');
    if (!detalleSheet) {
      crearHojaDetalleEntrevistas();
      detalleSheet = ss.getSheetByName('Detalle Entrevistas');
    }

    // Deduplicación por _uuid de Kobo (siempre presente, único por envío)
    // El Creamos ID es OPCIONAL: se guarda si existe pero no bloquea la importación
    // Columna CL (índice 89) = koboUuid en la hoja TECH de 99 columnas
    const datosExistentes = detalleSheet.getDataRange().getValues();
    const uuidsExistentesDetalle = new Set();
    for (let i = 1; i < datosExistentes.length; i++) {
      const uuid = datosExistentes[i][89] ? datosExistentes[i][89].toString().trim() : '';
      if (uuid) uuidsExistentesDetalle.add(uuid);
    }

    // Procesar cada fila (solo las nuevas)
    let importados = 0;
    let duplicados = 0;
    let sinCreamosId = 0;    // Importados sin Creamos ID (no es error)
    let sinUUID = 0;         // Omitidos por no tener UUID (sí es error)
    let filtradosPorCurso = 0;

    Logger.log('🔄 Iniciando procesamiento de ' + filasParaProcesar.length + ' filas...');

    for (let i = 0; i < filasParaProcesar.length; i++) {
      const row = filasParaProcesar[i];
      const creamosId = colMap.creamosId >= 0 ? (row[colMap.creamosId] || '').toString().trim() : '';
      const koboUuidVal = colMap.koboUuid >= 0 ? (row[colMap.koboUuid] || '').toString().trim() : '';

      // Necesitamos al menos el UUID de Kobo para identificar el registro
      if (!koboUuidVal) {
        sinUUID++;
        Logger.log(`⚠️ Fila ${i + 1}: Sin UUID de Kobo - OMITIDA`);
        continue;
      }

      if (!creamosId) {
        sinCreamosId++;
        Logger.log(`⚠️ Fila ${i + 1}: Sin Creamos ID (UUID: ${koboUuidVal}) - se importará sin ID`);
        // NO continue: el Creamos ID es opcional
      }

      // Verificar duplicados por UUID de Kobo
      if (uuidsExistentesDetalle.has(koboUuidVal)) {
        duplicados++;
        Logger.log(`⚠️ Fila ${i + 1}: UUID ${koboUuidVal} ya existe - DUPLICADO`);
        continue;
      }

      // Función helper para obtener valor seguro
      const getVal = (idx) => idx >= 0 && row[idx] ? row[idx].toString().trim() : '';

      // Detectar sector desde el campo cursoInteres
      const cursoParsona = colMap.cursoInteres >= 0 ? getVal(colMap.cursoInteres) : '';
      const cursoNorm = normalizarTextoColumna(cursoParsona);
      let esAB    = cursoNorm.includes('alimento') || cursoNorm.includes('bebida') || cursoNorm.includes('cocina') || cursoNorm.includes('reposteria') || cursoNorm.includes('barismo') || cursoNorm.includes('gastronomia');
      let esTech  = cursoNorm.includes('tecnolog') || cursoNorm.includes('computacion') || cursoNorm.includes('marketing') || cursoNorm.includes('programacion') || cursoNorm.includes('alfabetizacion') || cursoNorm.includes('microsoft') || cursoNorm.includes('sac');
      let esSAC   = cursoNorm.includes('servicio') || cursoNorm.includes('cliente');

      // Fallback: si cursoInteres no encontró el sector, detectar por qué columnas del CSV tienen datos
      if (!esAB && !esTech && !esSAC) {
        const tieneDataAB   = colsAB.length   > 0 && colsAB.slice(0, 5).some(ci => row[ci] && row[ci].toString().trim() !== '');
        const tieneDataTECH = colsTECH.length > 0 && colsTECH.slice(0, 5).some(ci => row[ci] && row[ci].toString().trim() !== '');
        const tieneDataSAC  = colsSAC.length  > 0 && colsSAC.slice(0, 5).some(ci => row[ci] && row[ci].toString().trim() !== '');
        if (tieneDataAB)   { esAB   = true; Logger.log(`⚡ Fila ${i+1}: sector detectado por datos: ALIMENTOS Y BEBIDAS (curso="${cursoParsona}")`); }
        if (tieneDataTECH) { esTech = true; Logger.log(`⚡ Fila ${i+1}: sector detectado por datos: TECNOLOGÍA (curso="${cursoParsona}")`); }
        if (tieneDataSAC)  { esSAC  = true; Logger.log(`⚡ Fila ${i+1}: sector detectado por datos: SERVICIO AL CLIENTE (curso="${cursoParsona}")`); }
      }

      // ⚠️ TECH.GS solo procesa TECNOLOGÍA y SERVICIO AL CLIENTE
      // Alimentos y Bebidas corresponde al otro spreadsheet (AlimentosBebidas.gs)
      if (esAB && !esTech && !esSAC) {
        filtradosPorCurso++;
        Logger.log(`⚠️ Fila ${i + 1}: Creamos ID ${creamosId}, Curso "${cursoParsona}" es ALIMENTOS Y BEBIDAS → omitido (corresponde al otro sistema)`);
        continue;
      }

      if (!esTech && !esSAC) {
        filtradosPorCurso++;
        Logger.log(`⚠️ Fila ${i + 1}: Creamos ID ${creamosId}, Curso "${cursoParsona}" - SECTOR NO RECONOCIDO - FILTRADO`);
        continue;
      }

      // Si por alguna razón se detectaron varios sectores, priorizar el que tiene más datos
      if ([esAB, esTech, esSAC].filter(Boolean).length > 1) {
        const cntAB   = colsAB.filter(ci   => row[ci] && row[ci].toString().trim() !== '').length;
        const cntTECH = colsTECH.filter(ci => row[ci] && row[ci].toString().trim() !== '').length;
        const cntSAC  = colsSAC.filter(ci  => row[ci] && row[ci].toString().trim() !== '').length;
        const maxCnt  = Math.max(cntAB, cntTECH, cntSAC);
        esAB   = cntAB   === maxCnt;
        esTech = cntTECH === maxCnt && !esAB;
        esSAC  = cntSAC  === maxCnt && !esAB && !esTech;
        Logger.log(`⚡ Fila ${i+1}: múltiples sectores detectados. AB:${cntAB} TECH:${cntTECH} SAC:${cntSAC} → usando sector con más datos`);
      }

      const tipoSector = esAB ? 'ALIMENTOS Y BEBIDAS' : (esTech ? 'TECNOLOGÍA' : 'SERVICIO AL CLIENTE');
      Logger.log(`✓ Fila ${i + 1}: Creamos ID ${creamosId}, Curso "${cursoParsona}" (${tipoSector}) - PROCESANDO...`);

      // Obtener fecha de entrevista desde Kobo o usar fecha actual como fallback
      const getFechaEntrevista = () => {
        if (colMap.koboSubmissionTime >= 0 && row[colMap.koboSubmissionTime]) {
          try {
            const fechaStr = row[colMap.koboSubmissionTime].toString().trim();
            const fecha = new Date(fechaStr);
            // Verificar si la fecha es válida
            if (!isNaN(fecha.getTime())) {
              return fecha;
            }
          } catch (e) {
            Logger.log('Error parseando fecha: ' + e.message);
          }
        }
        // Si no hay fecha o hay error, usar fecha actual
        return new Date();
      };

      // Crear registro para Detalle Entrevistas (99 columnas: A a CU)
      // Estructura TECH/SAC-específica (99 columnas):
      //   Datos Personales (A-H): 8 cols, índices 0-7
      //   TECH Preguntas (I-S): 11 cols, índices 8-18
      //   TECH Empleabilidad (T-AO): 22 cols, índices 19-40
      //   SAC Preguntas (AP-AZ): 11 cols, índices 41-51
      //   SAC Empleabilidad (BA-BV): 22 cols, índices 52-73
      //   Género (BW-CI): 13 cols, índices 74-86
      //   Metadatos (CJ-CU): 12 cols, índices 87-98
      const registro = new Array(99).fill('');

      // === SECCIÓN 1: DATOS PERSONALES (A-H) === índices 0-7
      registro[0] = getFechaEntrevista();              // A: Fecha Entrevista
      registro[1] = creamosId;                         // B: Creamos ID
      registro[2] = getVal(colMap.nombre);             // C: Nombres y Apellidos
      registro[3] = getVal(colMap.genero);             // D: Género
      registro[4] = getVal(colMap.formacionPrevia);    // E: Formación Previa
      registro[5] = getVal(colMap.dondeFormacion);     // F: Dónde y De Qué Formación
      registro[6] = getVal(colMap.sectorInteres);      // G: Sector Interés
      registro[7] = getVal(colMap.cursoInteres);       // H: Curso Interés

      // === LLENAR SOLO LA SECCIÓN CORRESPONDIENTE AL TIPO DE CURSO ===

      if (esTech) {
        // === TECNOLOGÍA - PREGUNTAS DEL CURSO (I-S) === índices 8-18
        registro[8]  = getVal(colMap.tech_porQueInteres);        // I
        registro[9]  = getVal(colMap.tech_queLlamaAtencion);     // J
        registro[10] = getVal(colMap.tech_expectativaCurso);     // K
        registro[11] = getVal(colMap.tech_dificultadesCurso);    // L
        registro[12] = getVal(colMap.tech_areasVida);            // M
        registro[13] = getVal(colMap.tech_disponibilidadCurso);  // N
        registro[14] = getVal(colMap.tech_planDisponibilidad);   // O
        registro[15] = getVal(colMap.tech_transporte);           // P
        registro[16] = getVal(colMap.tech_planTransporte);       // Q
        registro[17] = getVal(colMap.tech_firmarDocumento);      // R
        registro[18] = getVal(colMap.tech_comentarioDoc);        // S

        // === TECNOLOGÍA - EMPLEABILIDAD (T-AO) === índices 19-40
        registro[19] = getVal(colMap.tech_tieneTrabajoActual);       // T
        registro[20] = getVal(colMap.tech_cuentanosTrabajo);         // U
        registro[21] = getVal(colMap.tech_satisfechoTrabajo);        // V
        registro[22] = getVal(colMap.tech_comentarioSatisfaccion);   // W
        registro[23] = getVal(colMap.tech_proximosMeses);            // X
        registro[24] = getVal(colMap.tech_importanciaTrabajo);       // Y
        registro[25] = getVal(colMap.tech_teVesSector);              // Z
        registro[26] = getVal(colMap.tech_ayudaEconomica);           // AA
        registro[27] = getVal(colMap.tech_comentarioAyuda);          // AB
        registro[28] = getVal(colMap.tech_dependientes);             // AC
        registro[29] = getVal(colMap.tech_comentarioDependientes);   // AD
        registro[30] = getVal(colMap.tech_responsabilidadesCuidado); // AE
        registro[31] = getVal(colMap.tech_comentarioCuidado);        // AF
        registro[32] = getVal(colMap.tech_deudasBancarias);          // AG
        registro[33] = getVal(colMap.tech_comentarioDeudas);         // AH
        registro[34] = getVal(colMap.tech_antecedentes);             // AI
        registro[35] = getVal(colMap.tech_comentarioAntecedentes);   // AJ
        registro[36] = getVal(colMap.tech_casoLegal);                // AK
        registro[37] = getVal(colMap.tech_comentarioLegal);          // AL
        registro[38] = getVal(colMap.tech_dispuestoEmpleabilidad);   // AM
        registro[39] = getVal(colMap.tech_comentarioEmpleabilidad);  // AN
        registro[40] = getVal(colMap.tech_temporalidadMetas);        // AO

      } else if (esSAC) {
        // === SERVICIO AL CLIENTE - PREGUNTAS DEL CURSO (AP-AZ) === índices 41-51
        registro[41] = getVal(colMap.sac_porQueInteres);        // AP
        registro[42] = getVal(colMap.sac_queLlamaAtencion);     // AQ
        registro[43] = getVal(colMap.sac_expectativaCurso);     // AR
        registro[44] = getVal(colMap.sac_dificultadesCurso);    // AS
        registro[45] = getVal(colMap.sac_areasVida);            // AT
        registro[46] = getVal(colMap.sac_disponibilidadCurso);  // AU
        registro[47] = getVal(colMap.sac_planDisponibilidad);   // AV
        registro[48] = getVal(colMap.sac_transporte);           // AW
        registro[49] = getVal(colMap.sac_planTransporte);       // AX
        registro[50] = getVal(colMap.sac_firmarDocumento);      // AY
        registro[51] = getVal(colMap.sac_comentarioDoc);        // AZ

        // === SERVICIO AL CLIENTE - EMPLEABILIDAD (BA-BV) === índices 52-73
        registro[52] = getVal(colMap.sac_tieneTrabajoActual);       // BA
        registro[53] = getVal(colMap.sac_cuentanosTrabajo);         // BB
        registro[54] = getVal(colMap.sac_satisfechoTrabajo);        // BC
        registro[55] = getVal(colMap.sac_comentarioSatisfaccion);   // BD
        registro[56] = getVal(colMap.sac_proximosMeses);            // BE
        registro[57] = getVal(colMap.sac_importanciaTrabajo);       // BF
        registro[58] = getVal(colMap.sac_teVesSector);              // BG
        registro[59] = getVal(colMap.sac_ayudaEconomica);           // BH
        registro[60] = getVal(colMap.sac_comentarioAyuda);          // BI
        registro[61] = getVal(colMap.sac_dependientes);             // BJ
        registro[62] = getVal(colMap.sac_comentarioDependientes);   // BK
        registro[63] = getVal(colMap.sac_responsabilidadesCuidado); // BL
        registro[64] = getVal(colMap.sac_comentarioCuidado);        // BM
        registro[65] = getVal(colMap.sac_deudasBancarias);          // BN
        registro[66] = getVal(colMap.sac_comentarioDeudas);         // BO
        registro[67] = getVal(colMap.sac_antecedentes);             // BP
        registro[68] = getVal(colMap.sac_comentarioAntecedentes);   // BQ
        registro[69] = getVal(colMap.sac_casoLegal);                // BR
        registro[70] = getVal(colMap.sac_comentarioLegal);          // BS
        registro[71] = getVal(colMap.sac_dispuestoEmpleabilidad);   // BT
        registro[72] = getVal(colMap.sac_comentarioEmpleabilidad);  // BU
        registro[73] = getVal(colMap.sac_temporalidadMetas);        // BV
      }

      // === SECCIÓN 3: GÉNERO (BW-CI) === índices 74-86
      registro[74] = getVal(colMap.genero_comentarioPrevio);          // BW
      registro[75] = getVal(colMap.genero_gruposMixtos);              // BX
      registro[76] = getVal(colMap.genero_comentarioMixtos);          // BY
      registro[77] = getVal(colMap.genero_gruposDiversos);            // BZ
      registro[78] = getVal(colMap.genero_comentarioDiversos);        // CA
      registro[79] = getVal(colMap.genero_conflictoGrupos);           // CB
      registro[80] = getVal(colMap.genero_comentarioConflictoGrupos); // CC
      registro[81] = getVal(colMap.genero_conflictoHorarios);         // CD
      registro[82] = getVal(colMap.genero_comentarioConflictoHorarios); // CE
      registro[83] = getVal(colMap.genero_grupoMujeres);              // CF
      registro[84] = getVal(colMap.genero_igualdadHM);                // CG
      registro[85] = getVal(colMap.genero_familiaresCreamos);         // CH
      registro[86] = getVal(colMap.genero_nombresFamiliares);         // CI

      // === NOTAS Y METADATOS KOBO (CJ-CU) === índices 87-98
      registro[87] = getVal(colMap.notasEntrevistador);     // CJ
      registro[88] = getVal(colMap.koboId);                 // CK
      registro[89] = getVal(colMap.koboUuid);               // CL
      registro[90] = getVal(colMap.koboSubmissionTime);     // CM
      registro[91] = getVal(colMap.koboValidationStatus);  // CN
      registro[92] = getVal(colMap.koboNotes);             // CO
      registro[93] = getVal(colMap.koboStatus);            // CP
      registro[94] = getVal(colMap.koboSubmittedBy);       // CQ
      registro[95] = getVal(colMap.koboVersion);           // CR
      registro[96] = getVal(colMap.koboTags);              // CS
      registro[97] = getVal(colMap.koboRootUuid);          // CT
      registro[98] = getVal(colMap.koboIndex);             // CU

      // Usar getLastRow para evitar sobrescribir filas con Creamos ID vacío
      const nuevaFila = detalleSheet.getLastRow() + 1;
      detalleSheet.getRange(nuevaFila, 1, 1, registro.length).setValues([registro]);
      uuidsExistentesDetalle.add(koboUuidVal);
      importados++;
    }

    // Vincular con hoja Entrevistas
    vincularEntrevistasConDetalle();

    // === Guardar fecha de última sincronización ===
    if (importados > 0) {
      const submissionIdx = buscarIndiceColumna(headers, ['_submission_time', 'submission time', 'start', 'end']);
      const nuevaFechaSync = obtenerFechaMasRecienteEntrevistas(filasParaProcesar, submissionIdx);
      guardarUltimaSincronizacionEntrevistas(nuevaFechaSync);
    }

    // Mostrar mensaje de resultado
    const mensajeSincro = `\n📊 Total en Kobo: ${totalRegistrosKobo}`;

    Logger.log('📊 RESUMEN DE IMPORTACIÓN:');
    Logger.log(`   ✅ Importados: ${importados}`);
    Logger.log(`   ⚠️ Duplicados: ${duplicados}`);
    Logger.log(`   ⚠️ Sin Creamos ID: ${sinCreamosId}`);
    Logger.log(`   ⚠️ Filtrados por curso: ${filtradosPorCurso}`);
    Logger.log(`   📊 Total en Kobo: ${totalRegistrosKobo}`);
    Logger.log(`   📊 Nuevos a procesar: ${filasParaProcesar.length}`);

    const partesSinId = [];
    if (sinCreamosId > 0) partesSinId.push(`${sinCreamosId} sin Creamos ID`);
    if (sinUUID > 0) partesSinId.push(`${sinUUID} sin UUID (omitidos)`);
    const mensajeDetallado = `✅ Importados: ${importados}\n⚠️ Duplicados: ${duplicados}\n${partesSinId.length ? '⚠️ ' + partesSinId.join(', ') + '\n' : ''}⚠️ Filtrados (otro sector): ${filtradosPorCurso}${mensajeSincro}`;

    ss.toast(mensajeDetallado, 'Sincronización Completa', 8);

    Logger.log(`Total en Kobo: ${totalRegistrosKobo}, Nuevos procesados: ${filasParaProcesar.length}`);

  } catch (error) {
    ss.toast('❌ Error: ' + error.message, 'ERROR', 5);
    Logger.log('Error importando entrevistas: ' + error.message);
  }
}

/**
 * Normaliza texto: minúsculas + sin acentos + sin signos ¿¡
 * Esto permite comparar "Tecnologia" con "Tecnología", "interes" con "interés", etc.
 */
function normalizarTextoColumna(s) {
  return s.toString().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[¿¡]/g, '');
}

/**
 * Busca el índice de una columna por nombre parcial (case insensitive, sin acentos)
 */
function buscarIndiceColumna(headers, posiblesNombres) {
  for (let i = 0; i < headers.length; i++) {
    const header = normalizarTextoColumna(headers[i]);
    for (const nombre of posiblesNombres) {
      if (header.includes(normalizarTextoColumna(nombre))) {
        return i;
      }
    }
  }
  return -1;
}

/**
 * Busca columna que contenga TODOS los términos (AND logic, sin acentos)
 */
function buscarIndiceColumnaAND(headers, terminos) {
  for (let i = 0; i < headers.length; i++) {
    const header = normalizarTextoColumna(headers[i]);
    if (terminos.every(t => header.includes(normalizarTextoColumna(t)))) {
      return i;
    }
  }
  return -1;
}

/**
 * Retorna todos los índices de columnas que contienen el término de sección (en orden)
 * Útil como fallback para mapear columnas por posición cuando los nombres no coinciden exactamente
 */
function encontrarColumnasPorSeccion(headers, terminoSeccion) {
  const term = normalizarTextoColumna(terminoSeccion);
  const indices = [];
  for (let i = 0; i < headers.length; i++) {
    if (normalizarTextoColumna(headers[i]).includes(term)) {
      indices.push(i);
    }
  }
  return indices;
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

  // Verificar vinculación (sin modificar columnas de datos)
  let vinculados = 0;
  for (let i = 1; i < entrevistas.length; i++) {
    const idEntrevista = entrevistas[i][2] ? entrevistas[i][2].toString().trim() : ''; // Columna C
    if (idEntrevista && detalleMap.has(idEntrevista)) {
      vinculados++;
    }
  }

  Logger.log(`Vinculación completada: ${vinculados} registros vinculados`);
}

/**
 * Configura la URL de KoboToolbox para Entrevistas
 */
function configurarKoboEntrevistasURL() {
  const ui = SpreadsheetApp.getUi();
  const props = PropertiesService.getDocumentProperties();
  const urlActual = props.getProperty('KOBO_ENTREVISTAS_URL') || CONFIG_TECH.KOBO_ENTREVISTAS_URL;

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
  const url = props.getProperty('KOBO_URL') || CONFIG_TECH.KOBO_URL;

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

/**
 * Configura trigger automático para importar entrevistas periódicamente
 * Ejecutar UNA VEZ manualmente para activar la automatización
 */
function activarSincronizacionAutomaticaEntrevistas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Eliminar triggers anteriores del mismo tipo para evitar duplicados
  ScriptApp.getProjectTriggers().forEach(trigger => {
    if (trigger.getHandlerFunction() === 'importarEntrevistasKobo') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Crear nuevo trigger: cada 30 minutos
  ScriptApp.newTrigger('importarEntrevistasKobo')
    .timeBased()
    .everyMinutes(30)
    .create();

  ss.toast('✅ Sincronización automática activada (cada 30 min)', 'Automatización', 5);
  Logger.log('Trigger de sincronización automática creado');
}

/**
 * Desactiva la sincronización automática
 */
function desactivarSincronizacionAutomaticaEntrevistas() {
  ScriptApp.getProjectTriggers().forEach(trigger => {
    if (trigger.getHandlerFunction() === 'importarEntrevistasKobo') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  SpreadsheetApp.getActiveSpreadsheet().toast('⏹️ Sincronización automática desactivada', 'Automatización', 5);
}

// =====================================================================
// GESTIÓN DE COHORTES
// =====================================================================

/**
 * Obtiene el siguiente número disponible para una cohorte con el mismo nombre base
 * @param {string} nombreBase - El nombre base de la cohorte (ej: "barismo")
 * @param {number} anio - El año de la cohorte
 * @returns {number} El siguiente número disponible
 */
/**
 * Limpia y valida nombres de cohorte escritos por el usuario.
 * Quita años, números duplicados, paréntesis, y espacios extras.
 * Ejemplos:
 *   "SAC I (2026)" → "SAC"
 *   "SAC 1" → "SAC"
 *   "SAC I I" → "SAC"
 *   "  Computación  " → "Computación"
 */
function _limpiarNombreCohorte(texto) {
  if (!texto) return '';

  // 1. Quitar paréntesis con años (2024, 2025, etc)
  texto = texto.replace(/\s*\(\s*20\d{2}\s*\)/g, '');

  // 2. Quitar números romanos duplicados al final (I I, II II, etc)
  texto = texto.replace(/\s+([IVX]+)\s+\1(\s|$)/g, ' $1$2');

  // 3. Quitar números arábigos simples si están solos (I, II, 1, 2, etc)
  // pero SOLO si están al final y separados por espacio
  texto = texto.replace(/\s+([IVX]+|[0-9]+)\s*$/g, '');

  // 4. Quitar espacios extras (múltiples espacios → un espacio)
  texto = texto.replace(/\s+/g, ' ').trim();

  // 5. Capitalizar correctamente (primera letra mayúscula, resto minúscula)
  texto = texto.charAt(0).toUpperCase() + texto.slice(1);

  return texto;
}

function obtenerSiguienteNumeroCohorte(nombreBase, anio) {
  const cohortesExistentes = obtenerCohortesActuales();
  const patron = new RegExp('^' + nombreBase + ' (\\d+) \\(' + anio + '\\)$', 'i');
  const numerosExistentes = [];

  cohortesExistentes.forEach(function(cohorte) {
    const match = cohorte.match(patron);
    if (match) {
      numerosExistentes.push(parseInt(match[1]));
    }
  });

  if (numerosExistentes.length === 0) {
    return 1;
  }

  // Ordenar los números existentes
  numerosExistentes.sort(function(a, b) { return a - b; });

  // Buscar el primer número disponible (reutilizar números de cohortes eliminadas)
  for (let i = 1; i <= numerosExistentes.length + 1; i++) {
    if (!numerosExistentes.includes(i)) {
      return i;
    }
  }

  // Si no hay huecos, usar el siguiente número después del máximo
  return Math.max.apply(null, numerosExistentes) + 1;
}

function crearNuevaCohorteTech() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const programasDisponibles = [
    'Programación',
    'SAC',
    'Computación',
    'Alfa Digital',
    'Marketing Digital',
    'Desarrollo Web',
    'Otro (escribir manual)'
  ];

  let mensajeOpciones = '➕ Crear Nueva Cohorte - PASO 1/5\n\n🎯 Selecciona el PROGRAMA (escribe el número):\n\n';
  programasDisponibles.forEach((prog, index) => {
    const simbolo = prog.includes('Otro') ? '➕' : '✓';
    mensajeOpciones += (index + 1) + '. ' + simbolo + ' ' + prog + '\n';
  });
  mensajeOpciones += '\n💡 TIP: El sistema agregará número y año automáticamente';

  const respOpcion = ui.prompt('Seleccionar Programa', mensajeOpciones, ui.ButtonSet.OK_CANCEL);
  if (respOpcion.getSelectedButton() !== ui.Button.OK) return;

  const opcionSeleccionada = parseInt(respOpcion.getResponseText().trim());
  let nombreBase;

  if (opcionSeleccionada === programasDisponibles.length || !opcionSeleccionada || opcionSeleccionada < 1 || opcionSeleccionada > programasDisponibles.length) {
    // OPCIÓN "OTRO" — Con validación y limpieza
    let nombreValido = false;
    let intentos = 0;
    while (!nombreValido && intentos < 3) {
      const respNombreManual = ui.prompt(
        '➕ Nombre del Programa',
        'Ingresa SOLO el nombre (sin año ni número):\n\n' +
        '❌ NO: "SAC I (2026)"\n' +
        '❌ NO: "SAC 1"\n' +
        '❌ NO: "SAC I I"\n' +
        '✅ SÍ: "SAC"\n' +
        '✅ SÍ: "Computación Avanzada"\n\n' +
        'El sistema agregará automáticamente el número y año.',
        ui.ButtonSet.OK_CANCEL
      );
      if (respNombreManual.getSelectedButton() !== ui.Button.OK) return;

      nombreBase = _limpiarNombreCohorte(respNombreManual.getResponseText().trim());

      if (!nombreBase) {
        ui.alert('⚠️ Nombre vacío', 'Por favor ingresa un nombre válido.', ui.ButtonSet.OK);
        intentos++;
        continue;
      }

      // Verificar si ya existe una cohorte con este nombre
      const cohortesExistentes = obtenerCohortesActuales();
      const yaExiste = cohortesExistentes.some(c =>
        c.toLowerCase().startsWith(nombreBase.toLowerCase() + ' ')
      );

      if (yaExiste) {
        ui.alert('⚠️ Cohorte ya existe', 'Ya existe una cohorte de "' + nombreBase + '".\n\nSelecciona otro nombre.', ui.ButtonSet.OK);
        intentos++;
        continue;
      }

      nombreValido = true;
    }

    if (!nombreValido) {
      ui.alert('❌ Error', 'Se alcanzó el límite de intentos. Intenta de nuevo.', ui.ButtonSet.OK);
      return;
    }
  } else {
    nombreBase = programasDisponibles[opcionSeleccionada - 1];
  }

  // Agregar año actual automáticamente entre paréntesis
  const anioActual = new Date().getFullYear();

  // Obtener el siguiente número disponible para esta cohorte
  const numeroCohorte = obtenerSiguienteNumeroCohorte(nombreBase, anioActual);
  const nombre = nombreBase + ' ' + numeroCohorte + ' (' + anioActual + ')';

  const respCupo = ui.prompt(
    '➕ Crear Nueva Cohorte - Paso 2/5',
    'Ingresa el CUPO MÁXIMO:',
    ui.ButtonSet.OK_CANCEL
  );
  if (respCupo.getSelectedButton() !== ui.Button.OK) return;
  const cupo = parseInt(respCupo.getResponseText().trim()) || 20;

  const respFechaInicio = ui.prompt(
    '➕ Crear Nueva Cohorte - Paso 3/5',
    'Ingresa la FECHA DE INICIO (dd/mm/aaaa):\n\n(Si dejas vacío se usará la fecha de hoy)',
    ui.ButtonSet.OK_CANCEL
  );
  if (respFechaInicio.getSelectedButton() !== ui.Button.OK) return;
  const fechaInicioTexto = respFechaInicio.getResponseText().trim();
  let fechaInicio = new Date();
  if (fechaInicioTexto) {
    const partes = fechaInicioTexto.split('/');
    if (partes.length === 3) {
      fechaInicio = new Date(partes[2], partes[1] - 1, partes[0]);
    }
  }

  const respFechaFin = ui.prompt(
    '➕ Crear Nueva Cohorte - Paso 4/5',
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

  // Paso 5: Preguntar si esta cohorte tendrá estipendios
  const respEstipendios = ui.alert(
    '💰 Estipendios - Paso 5/5',
    '¿Esta cohorte tendrá ESTIPENDIOS (pagos a participantes)?\n\nSí = se pedirá el presupuesto ahora\nNo = se crea sin presupuesto de estipendios',
    ui.ButtonSet.YES_NO
  );

  let presupuestoCurso = '';
  let presupuestoPracticas = '';

  if (respEstipendios === ui.Button.YES) {
    const respPresupuestoCurso = ui.prompt(
      '💰 Presupuesto Estipendios',
      'Ingresa el PRESUPUESTO DE CURSO (Q):\n\nEjemplo: 5000\n(Solo el número, sin Q ni comas)',
      ui.ButtonSet.OK_CANCEL
    );
    if (respPresupuestoCurso.getSelectedButton() !== ui.Button.OK) return;
    presupuestoCurso = parseFloat(respPresupuestoCurso.getResponseText().trim().replace(/,/g, '')) || 0;

    const respPresupuestoPracticas = ui.prompt(
      '💰 Presupuesto Estipendios',
      'Ingresa el PRESUPUESTO DE PRÁCTICAS (Q):\n\nEjemplo: 3000\n(Solo el número, sin Q ni comas)\n\nEscribe 0 si no aplica.',
      ui.ButtonSet.OK_CANCEL
    );
    if (respPresupuestoPracticas.getSelectedButton() !== ui.Button.OK) return;
    presupuestoPracticas = parseFloat(respPresupuestoPracticas.getResponseText().trim().replace(/,/g, '')) || 0;
  }

  // Responsable automático: Eva
  const responsable = 'Eva';
  // Todas las cohortes nuevas empiezan como "Activa"
  const estadoInicial = 'Activa';

  const cohortes = ss.getSheetByName('Cohortes');
  const nuevaFila = obtenerPrimeraFilaVacia(cohortes, 'A');

  // Orden: Nombre, Proyecto, Año, FechaInicio, FechaFin, Responsable, Cupo, Inscritas(formula), Graduadx(formula), Retiradx(formula), Ubicación, Horario, Notas, Estado
  const datosCohorte = [nombre, 'Tecnología', anioActual, fechaInicio, fechaFin, responsable, cupo, '', '', '', '', '', '', estadoInicial];
  cohortes.getRange(nuevaFila, 1, 1, 14).setValues([datosCohorte]);

  // Fórmulas: Inscritas cuenta en la hoja individual de la cohorte (resta deserciones)
  cohortes.getRange('H' + nuevaFila).setFormula('=IF(A' + nuevaFila + '="",0,IFERROR(COUNTIF(INDIRECT("\'"&A' + nuevaFila + '&"\'!E:E"),"<>")-1-COUNTIF(INDIRECT("\'"&A' + nuevaFila + '&"\'!K:K"),"Graduadx")-COUNTIF(INDIRECT("\'"&A' + nuevaFila + '&"\'!K:K"),"Retiradx"),0))');
  cohortes.getRange('I' + nuevaFila).setFormula('=IFERROR(COUNTIF(Graduadx!J:J,A' + nuevaFila + '),0)');
  cohortes.getRange('J' + nuevaFila).setFormula('=IFERROR(COUNTIF(Retiradx!J:J,A' + nuevaFila + '),0)');

  // Si tiene estipendios, escribir presupuesto en columnas O, P, Q, y fórmulas R-T
  if (respEstipendios === ui.Button.YES) {
    // Asegurarse de que existan los encabezados de estipendios en la fila 1
    _asegurarEncabezadosEstipendiosCohortes(cohortes);

    cohortes.getRange(nuevaFila, 15).setValue(presupuestoCurso);   // O: Presupuesto Curso
    cohortes.getRange(nuevaFila, 16).setValue(presupuestoPracticas); // P: Presupuesto Prácticas
    cohortes.getRange(nuevaFila, 17).setFormula('=O' + nuevaFila + '+P' + nuevaFila); // Q: Total
    // R: Gastado (SUMIF en hoja Estipendios por nombre de cohorte)
    cohortes.getRange(nuevaFila, 18).setFormula('=IFERROR(SUMIF(Estipendios!E:E,A' + nuevaFila + ',Estipendios!H:H),0)');
    // S: Disponible
    cohortes.getRange(nuevaFila, 19).setFormula('=Q' + nuevaFila + '-R' + nuevaFila);
    // T: % Ejecución
    cohortes.getRange(nuevaFila, 20).setFormula('=IFERROR(R' + nuevaFila + '/Q' + nuevaFila + ',0)');
    cohortes.getRange(nuevaFila, 20).setNumberFormat('0.0%');
  }

  // Crear hoja individual para la cohorte
  crearHojaIndividualCohorte(nombre);

  configurarValidaciones();

  const msgEstipendio = respEstipendios === ui.Button.YES
    ? '\n💰 Presupuesto: Q' + (presupuestoCurso + presupuestoPracticas).toLocaleString()
    : '';
  ss.toast('✅ Cohorte "' + nombre + '" creada con su hoja individual' + msgEstipendio, 'Nueva Cohorte', 7);
}

/**
 * Permite editar una cohorte existente (Fecha Fin, Cupo Máximo, Responsable)
 * Sin afectar los datos de participantes ni las fórmulas
 */
function editarCohorte() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  const cohortesSheet = ss.getSheetByName('Cohortes');

  if (!cohortesSheet) {
    ui.alert('❌ Error', 'No se encontró la hoja Cohortes', ui.ButtonSet.OK);
    return;
  }

  // Obtener cohortes actuales
  const cohortes = obtenerCohortesActuales();
  if (cohortes.length === 0) {
    ui.alert('⚠️ Sin cohortes', 'No hay cohortes para editar.', ui.ButtonSet.OK);
    return;
  }

  // Seleccionar cohorte
  let mensajeSeleccionar = '📋 Selecciona la COHORTE a editar (escribe el número):\n\n';
  cohortes.forEach((c, idx) => {
    mensajeSeleccionar += (idx + 1) + '. ' + c + '\n';
  });

  const respSeleccionar = ui.prompt('Editar Cohorte', mensajeSeleccionar, ui.ButtonSet.OK_CANCEL);
  if (respSeleccionar.getSelectedButton() !== ui.Button.OK) return;

  const idxCohorte = parseInt(respSeleccionar.getResponseText().trim()) - 1;
  if (idxCohorte < 0 || idxCohorte >= cohortes.length) {
    ui.alert('❌ Número inválido', 'Selecciona un número válido.', ui.ButtonSet.OK);
    return;
  }

  const nombreCohorte = cohortes[idxCohorte];

  // Buscar fila de la cohorte
  const datos = cohortesSheet.getDataRange().getValues();
  let filaCohorte = -1;
  for (let i = 1; i < datos.length; i++) {
    if (datos[i][0] && datos[i][0].toString().trim() === nombreCohorte) {
      filaCohorte = i + 1;
      break;
    }
  }

  if (filaCohorte === -1) {
    ui.alert('❌ No encontrada', 'No se encontró la cohorte en el registro.', ui.ButtonSet.OK);
    return;
  }

  // Obtener datos actuales (Columnas: Nombre, Proyecto, Año, Inicio, Fin, Responsable, Cupo, ...)
  const datosActuales = datos[filaCohorte - 1];
  const fechaFinActual = datosActuales[4] ? (datosActuales[4] instanceof Date ? Utilities.formatDate(datosActuales[4], Session.getScriptTimeZone(), 'dd/MM/yyyy') : datosActuales[4]) : '';
  const cupoActual = datosActuales[6] || 20;
  const responsableActual = datosActuales[5] || 'Eva';

  // Menú de qué editar
  const respQueEditar = ui.alert(
    '✏️ ¿Qué deseas editar?',
    '1️⃣ Fecha de Fin: ' + fechaFinActual + '\n' +
    '2️⃣ Cupo Máximo: ' + cupoActual + '\n' +
    '3️⃣ Responsable: ' + responsableActual + '\n\n' +
    '(Elige una opción)',
    ui.ButtonSet.YES_NO_CANCEL
  );

  let queEditar = '';
  if (respQueEditar === ui.Button.YES) queEditar = 'Fecha Fin';
  else if (respQueEditar === ui.Button.NO) queEditar = 'Cupo';
  else {
    queEditar = 'Responsable';
  }

  if (queEditar === 'Fecha Fin') {
    const respFecha = ui.prompt(
      '📅 Editar Fecha de Fin',
      'Ingresa la nueva FECHA DE FIN (dd/mm/aaaa):\n\nActual: ' + fechaFinActual,
      ui.ButtonSet.OK_CANCEL
    );
    if (respFecha.getSelectedButton() !== ui.Button.OK) return;

    const fechaTexto = respFecha.getResponseText().trim();
    let fechaNueva = '';
    if (fechaTexto) {
      const partes = fechaTexto.split('/');
      if (partes.length === 3) {
        fechaNueva = new Date(partes[2], partes[1] - 1, partes[0]);
      } else {
        ui.alert('❌ Formato inválido', 'Usa formato dd/mm/aaaa', ui.ButtonSet.OK);
        return;
      }
    }

    cohortesSheet.getRange(filaCohorte, 5).setValue(fechaNueva);
    ui.alert('✅ Actualizado', 'Fecha de fin de "' + nombreCohorte + '" actualizada.', ui.ButtonSet.OK);
  } else if (queEditar === 'Cupo') {
    const respCupo = ui.prompt(
      '📊 Editar Cupo Máximo',
      'Ingresa el nuevo CUPO MÁXIMO:\n\nActual: ' + cupoActual,
      ui.ButtonSet.OK_CANCEL
    );
    if (respCupo.getSelectedButton() !== ui.Button.OK) return;

    const cupoNuevo = parseInt(respCupo.getResponseText().trim()) || cupoActual;
    cohortesSheet.getRange(filaCohorte, 7).setValue(cupoNuevo);
    ui.alert('✅ Actualizado', 'Cupo de "' + nombreCohorte + '" actualizado a ' + cupoNuevo + '.', ui.ButtonSet.OK);
  } else {
    const respResponsable = ui.prompt(
      '👤 Editar Responsable',
      'Ingresa el nuevo RESPONSABLE:\n\nActual: ' + responsableActual,
      ui.ButtonSet.OK_CANCEL
    );
    if (respResponsable.getSelectedButton() !== ui.Button.OK) return;

    const responsableNuevo = respResponsable.getResponseText().trim() || responsableActual;
    cohortesSheet.getRange(filaCohorte, 6).setValue(responsableNuevo);
    ui.alert('✅ Actualizado', 'Responsable de "' + nombreCohorte + '" actualizado a ' + responsableNuevo + '.', ui.ButtonSet.OK);
  }
}

/**
 * Asegura que existan los encabezados de estipendios en la hoja Cohortes (cols O-T)
 * Sin borrar nada existente
 */
function _asegurarEncabezadosEstipendiosCohortes(cohortes) {
  const headersEst = [
    'Presupuesto Curso (Q)',
    'Presupuesto Prácticas (Q)',
    'Presupuesto Total (Q)',
    'Gastado (Q)',
    'Disponible (Q)',
    '% Ejecución'
  ];
  headersEst.forEach((h, i) => {
    const col = 15 + i; // columna O = 15
    const celda = cohortes.getRange(1, col);
    if (!celda.getValue()) {
      celda.setValue(h).setFontWeight('bold').setBackground('#f3e5f5');
    }
  });
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
    'Zona',             // J
    'Estado',           // K - Solo opción "Graduada" y "Deserción"
    'Año'               // L - Automático (año actual)
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#4caf50')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Anchos de columna
  [120, 50, 100, 130, 200, 120, 60, 120, 150, 120, 100, 80].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });

  // Desplegable Estado con "Graduadx" y "Retiradx"
  sheet.getRange('K2:K100').setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['Graduadx', 'Retiradx'])
      .setAllowInvalid(true)
      .build()
  );

  // Fórmula para Año (automático)
  for (let i = 2; i <= 100; i++) {
    sheet.getRange('L' + i).setFormula('=IF(E' + i + '<>"",YEAR(A' + i + '),"")');
  }

  // Proteger columnas automáticas
  sheet.getRange('A2:A100').protect().setWarningOnly(true);
  sheet.getRange('B2:B100').protect().setWarningOnly(true);
  sheet.getRange('L2:L100').protect().setWarningOnly(true); // Proteger columna Año
}

/**
 * Elimina una cohorte correctamente:
 * - Elimina la fila de la hoja Cohortes
 * - Elimina la hoja individual de la cohorte
 * - Actualiza los desplegables en todas las hojas
 */
function eliminarCohorteTech() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const cohortesSheet = ss.getSheetByName('Cohortes');

  if (!cohortesSheet) {
    ui.alert('⚠️ No se encontró la hoja Cohortes');
    return;
  }

  // Obtener todas las cohortes
  const datos = cohortesSheet.getDataRange().getValues();
  const cohortes = [];
  for (let i = 1; i < datos.length; i++) {
    if (datos[i][0] && datos[i][0].toString().trim() !== '') {
      cohortes.push({
        nombre: datos[i][0].toString().trim(),
        fila: i + 1,
        inscritas: datos[i][7] || 0,
        graduadx: datos[i][8] || 0,
        retiradx: datos[i][9] || 0
      });
    }
  }

  if (cohortes.length === 0) {
    ui.alert('⚠️ No hay cohortes para eliminar');
    return;
  }

  // Crear lista de opciones con información
  const opciones = cohortes.map(c =>
    c.nombre + ' (Inscritas: ' + c.inscritas + ', Graduadx: ' + c.graduadx + ', Retiradx: ' + c.retiradx + ')'
  );

  // Preguntar cuál eliminar
  const respuesta = ui.prompt(
    '🗑️ Eliminar Cohorte',
    'Ingresa el NÚMERO de la cohorte a eliminar:\n\n' +
    opciones.map((o, i) => (i + 1) + '. ' + o).join('\n') +
    '\n\n⚠️ ADVERTENCIA: Esta acción NO se puede deshacer.\nSe eliminará la cohorte de la hoja Cohortes Y su hoja individual.',
    ui.ButtonSet.OK_CANCEL
  );

  if (respuesta.getSelectedButton() !== ui.Button.OK) return;

  const numero = parseInt(respuesta.getResponseText().trim());
  if (isNaN(numero) || numero < 1 || numero > cohortes.length) {
    ui.alert('❌ Número inválido');
    return;
  }

  const cohorteSeleccionada = cohortes[numero - 1];

  // Confirmar si tiene participantes
  const total = cohorteSeleccionada.inscritas + cohorteSeleccionada.graduadx + cohorteSeleccionada.retiradx;
  if (total > 0) {
    const confirmacion = ui.alert(
      '⚠️ ADVERTENCIA',
      'La cohorte "' + cohorteSeleccionada.nombre + '" tiene ' + total + ' participante(s) registrado(s).\n\n' +
      '¿Estás seguro/a de eliminarla?\n\nNOTA: Las participantes graduadas y retiradas NO se eliminarán de sus respectivas hojas.',
      ui.ButtonSet.YES_NO
    );
    if (confirmacion !== ui.Button.YES) return;
  }

  // Eliminar la fila de la hoja Cohortes
  cohortesSheet.deleteRow(cohorteSeleccionada.fila);

  // Eliminar la hoja individual si existe
  const hojaIndividual = ss.getSheetByName(cohorteSeleccionada.nombre);
  if (hojaIndividual) {
    ss.deleteSheet(hojaIndividual);
  }

  // Actualizar desplegables
  configurarValidaciones();

  ui.alert(
    '✅ Cohorte eliminada',
    'La cohorte "' + cohorteSeleccionada.nombre + '" ha sido eliminada correctamente.\n\n' +
    'Los desplegables han sido actualizados.',
    ui.ButtonSet.OK
  );

  Logger.log('✅ Cohorte eliminada: ' + cohorteSeleccionada.nombre);
}

function enviarParticipantesACohorteTech() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const cohortesSheet = ss.getSheetByName('Cohortes');
  const datosCohortes = cohortesSheet.getDataRange().getValues();

  const cohortesActivas = [];
  for (let i = 1; i < datosCohortes.length; i++) {
    // Estado está en columna N (índice 13)
    if (datosCohortes[i][13] === 'Activa') {
      cohortesActivas.push({
        nombre: datosCohortes[i][0],
        cupo: datosCohortes[i][6],     // Columna G (Cupo Máximo)
        inscritas: datosCohortes[i][7] // Columna H (Inscritas)
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
    // ⚠️ CORRECCIÓN: Usar columnas ['B', 'D'] (CreamosID y Nombre)
    // para evitar sobrescribir en AMBOS casos (con ID sin nombre, o con nombre sin ID)
    const nuevaFila = obtenerPrimeraFilaVacia(seleccionadas, ['B', 'D']);

    // ⚠️ CORRECCIÓN: Verificar si solo tiene CreamosID (sin nombre ni otros datos)
    let soloTieneID = false;
    if (datosInteres && datosInteres.datos) {
      // Columnas importantes: [3]=DPI, [4]=Nombre, [5]=Género, [6]=Edad, [8]=NivelEdu, [9]=Zona
      const tieneCreamosId = datosInteres.datos[2] && datosInteres.datos[2].toString().trim() !== '';
      const tieneOtrosDatos = (datosInteres.datos[3] && datosInteres.datos[3].toString().trim() !== '') ||
                              (datosInteres.datos[4] && datosInteres.datos[4].toString().trim() !== '') ||
                              (datosInteres.datos[5] && datosInteres.datos[5].toString().trim() !== '') ||
                              (datosInteres.datos[6] && datosInteres.datos[6].toString().trim() !== '') ||
                              (datosInteres.datos[8] && datosInteres.datos[8].toString().trim() !== '') ||
                              (datosInteres.datos[9] && datosInteres.datos[9].toString().trim() !== '');
      soloTieneID = tieneCreamosId && !tieneOtrosDatos;
    }

    // Columnas: No, CreamosID, DPI, Nombre, Género, Edad, Tel, NivelEdu, Zona, Notas, Estado, EnviarACohorte
    let registro;
    if (soloTieneID) {
      // Si solo tiene ID → Enviar SOLO ID y datos mínimos (no enviar campos vacíos que sobrescriban)
      registro = [
        nuevaFila - 1,       // No
        p.creamosId,         // CreamosID
        '',                  // DPI - VACÍO (no sobrescribir)
        p.nombre || '',      // Nombre (del origen)
        '',                  // Género - VACÍO (no sobrescribir)
        '',                  // Edad - VACÍO (no sobrescribir)
        p.datos[4] || '',    // Teléfono (del origen)
        '',                  // Nivel Educativo - VACÍO (no sobrescribir)
        '',                  // Zona - VACÍO (no sobrescribir)
        p.datos[8] || '',    // Notas
        'Inscritx',          // Estado (automático)
        ''                   // Enviar a Cohorte (vacío)
      ];
    } else {
      // Si tiene información completa → Enviar TODO
      registro = [
        nuevaFila - 1,                               // No
        p.creamosId,                                 // CreamosID
        datosInteres ? datosInteres.datos[3] : '',   // DPI
        p.nombre,                                    // Nombre
        datosInteres ? datosInteres.datos[5] : '',   // Género
        datosInteres ? datosInteres.datos[6] : '',   // Edad
        p.datos[4],                                  // Teléfono
        datosInteres ? datosInteres.datos[8] : '',   // Nivel Educativo
        datosInteres ? datosInteres.datos[9] : '',   // Zona
        p.datos[8] || '',                            // Notas
        'Inscritx',                                  // Estado (automático)
        ''                                           // Enviar a Cohorte (vacío)
      ];
    }

    seleccionadas.getRange(nuevaFila, 1, 1, 12).setValues([registro]);
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

function actualizarReportesTech() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const reporte = ss.getSheetByName('Reporte');
    if (reporte) {
      // Detectar si el reporte tiene el layout nuevo (A5:B5 merged con texto, A6:B6 con fórmula)
      const a6formula = reporte.getRange('A6').getFormula();
      const esLayoutNuevo = a6formula && a6formula.includes('COUNTIFS');
      if (!esLayoutNuevo) {
        // Layout viejo o corrupto → reconstruir desde cero
        redisenarReporteTech();
      } else {
        // Solo actualizar timestamp
        reporte.getRange('D2').setFormula('=TEXT(NOW(),"DD/MM/YYYY HH:MM")');
      }
      SpreadsheetApp.flush();
    }
    return true;
  } catch (e) { return false; }
}


/**
 * Mejora visual y completa los reportes:
 * - Repara fórmulas
 * - Mejora formato (colores, tamaños)
 * - Agrega validaciones
 * - Mejora legibilidad
 */
function redisenarReporteTech() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Reporte');
  if (!sheet) sheet = ss.insertSheet('Reporte');

  sheet.clearContents();
  sheet.clearFormats();
  try { sheet.getRange('A1:F100').breakApart(); } catch(e) {}

  [200, 130, 130, 130, 130, 130].forEach((w, i) => sheet.setColumnWidth(i + 1, w));

  // Z1 siempre = mes actual (se auto-actualiza cada mes)
  sheet.getRange('Z1').setFormula('=TODAY()');
  sheet.getRange('Z1').setNumberFormat('dd/mm/yyyy');
  sheet.hideColumns(26);
  const monthStart = '">="&DATE(YEAR($Z$1),MONTH($Z$1),1)';
  const monthEnd = '"<="&EOMONTH($Z$1,0)';

  // Detectar columna de "Fecha envío a Inscritx" dinámicamente
  let inscFechaCol = 'A';
  const inscSheet = ss.getSheetByName('Inscritx');
  if (inscSheet && inscSheet.getLastColumn() > 0) {
    const inscHdrs = inscSheet.getRange(1, 1, 1, inscSheet.getLastColumn()).getValues()[0];
    const idx = inscHdrs.findIndex(h => {
      const n = (h || '').toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/\s+/g,'');
      return n.includes('fechaenvio') || n.includes('envioainscritx');
    });
    if (idx >= 0) {
      const colNum = idx + 1;
      inscFechaCol = colNum <= 26 ? String.fromCharCode(64 + colNum)
        : String.fromCharCode(64 + Math.floor((colNum-1)/26)) + String.fromCharCode(65 + (colNum-1)%26);
    }
  }

  const f = {
    interesTotal : '=IFERROR(COUNTA(\'Hoja de Interés\'!E:E)-1,0)',
    interesAnioActual : '=IFERROR(COUNTIFS(\'Hoja de Interés\'!A:A,">="&DATE(YEAR(TODAY()),1,1),\'Hoja de Interés\'!A:A,"<"&DATE(YEAR(TODAY())+1,1,1)),0)',
    interesAniosAnteriores : '=IFERROR(COUNTIFS(\'Hoja de Interés\'!A:A,"<"&DATE(YEAR(TODAY()),1,1)),0)',
    interesMes   : '=IFERROR(COUNTIFS(\'Hoja de Interés\'!A:A,' + monthStart + ',\'Hoja de Interés\'!A:A,' + monthEnd + '),0)',
    entrevTotal  : '=IFERROR(COUNTA(Entrevistas!D:D)-1,0)',
    entrevMes    : '=IFERROR(COUNTIFS(Entrevistas!A:A,' + monthStart + ',Entrevistas!A:A,' + monthEnd + ',Entrevistas!A:A,"<>"),0)',
    inscMes      : '=IFERROR(COUNTIFS(Inscritx!' + inscFechaCol + ':' + inscFechaCol + ',' + monthStart + ',Inscritx!' + inscFechaCol + ':' + inscFechaCol + ',' + monthEnd + '),0)',
    inscTotal    : '=IFERROR(MAX(COUNTA(Inscritx!B:B)-1,SUM(IFERROR(VALUE(Cohortes!H2:H),0))),0)',
    gradTotal    : '=IFERROR(COUNTA(Graduadx!D:D)-1,0)',
    gradMes      : '=IFERROR(COUNTIFS(Graduadx!A:A,' + monthStart + ',Graduadx!A:A,' + monthEnd + '),0)',
    desTotal     : '=IFERROR(COUNTA(Retiradx!D:D)-1,0)',
    desMes       : '=IFERROR(COUNTIFS(Retiradx!A:A,' + monthStart + ',Retiradx!A:A,' + monthEnd + '),0)',
    noInscTotal  : '=IFERROR(COUNTA(\'No Inscritx\'!C:C)-1,0)',
    noInscMes    : '=IFERROR(COUNTIFS(\'No Inscritx\'!A:A,' + monthStart + ',\'No Inscritx\'!A:A,' + monthEnd + '),0)',
    aprobMes     : '=IFERROR(COUNTIFS(Entrevistas!A:A,' + monthStart + ',Entrevistas!A:A,' + monthEnd + ',Entrevistas!O:O,"Aprobada")+COUNTIFS(Entrevistas!A:A,' + monthStart + ',Entrevistas!A:A,' + monthEnd + ',Entrevistas!N:N,"Aprobada"),0)',
    noAprobMes   : '=IFERROR(COUNTIFS(Entrevistas!A:A,' + monthStart + ',Entrevistas!A:A,' + monthEnd + ',Entrevistas!O:O,"No asistió / No aprobó")+COUNTIFS(Entrevistas!A:A,' + monthStart + ',Entrevistas!A:A,' + monthEnd + ',Entrevistas!N:N,"No asistió / No aprobó"),0)',
    noAsistMes   : '=IFERROR(0,0)',
    reprogMes    : '=IFERROR(COUNTIFS(Entrevistas!A:A,' + monthStart + ',Entrevistas!A:A,' + monthEnd + ',Entrevistas!O:O,"Reprogramada")+COUNTIFS(Entrevistas!A:A,' + monthStart + ',Entrevistas!A:A,' + monthEnd + ',Entrevistas!N:N,"Reprogramada"),0)',
    derivMes     : '=IFERROR(COUNTIFS(Entrevistas!A:A,' + monthStart + ',Entrevistas!A:A,' + monthEnd + ',Entrevistas!O:O,"Derivar a Paso a Paso")+COUNTIFS(Entrevistas!A:A,' + monthStart + ',Entrevistas!A:A,' + monthEnd + ',Entrevistas!N:N,"Derivar a Paso a Paso"),0)',
    cohActivas   : '=IFERROR(COUNTIF(Cohortes!N:N,"Activa"),0)',
    tasaExito    : '=IFERROR(IF((B22+B25)>0,ROUND(B22/(B22+B25)*100,1)&"%","0%"),"0%")',
    totalAtend   : '=IFERROR(COUNTA(UNIQUE(FILTER({\'Hoja de Interés\'!B2:B;Entrevistas!B2:B;Inscritx!B2:B;Graduadx!B2:B;Retiradx!B2:B;\'No Inscritx\'!B2:B},{\'Hoja de Interés\'!B2:B;Entrevistas!B2:B;Inscritx!B2:B;Graduadx!B2:B;Retiradx!B2:B;\'No Inscritx\'!B2:B}<>""))),0)'
  };

  sheet.getRange('A1:F1').merge()
    .setValue('💻  REPORTE — INCLUSIÓN LABORAL  |  TECNOLOGÍA')
    .setBackground('#1565c0').setFontColor('white')
    .setFontWeight('bold').setFontSize(16).setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(1, 52);

  sheet.getRange('A2:C2').merge().setValue('Última actualización:').setBackground('#e3f2fd').setFontSize(10).setHorizontalAlignment('right');
  sheet.getRange('D2').setFormula('=TEXT(NOW(),"DD/MM/YYYY HH:MM")').setBackground('#e3f2fd').setFontSize(10).setHorizontalAlignment('left');
  sheet.getRange('E2').setValue('Mes actual:').setBackground('#e3f2fd').setFontSize(10).setHorizontalAlignment('right');
  sheet.getRange('F2').setFormula('=TEXT($Z$1,"MMMM YYYY")').setBackground('#e3f2fd').setFontSize(10).setFontWeight('bold').setHorizontalAlignment('left');
  sheet.setRowHeight(2, 28);
  sheet.setRowHeight(3, 8);

  sheet.getRange('A4:F4').merge().setValue('🎯  RESUMEN GENERAL')
    .setBackground('#1565c0').setFontColor('white').setFontWeight('bold')
    .setFontSize(13).setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(4, 36);

  const kpi1 = [
    { label:'👥 Interesadas (Este Mes)', rng:'A5:B5', numRng:'A6:B6', bg:'#1976d2', total: f.interesMes },
    { label:'📋 Entrevistadas (Este Mes)', rng:'C5:D5', numRng:'C6:D6', bg:'#388e3c', total: f.entrevMes },
    { label:'✅ Inscritx (Este Mes)',    rng:'E5:F5', numRng:'E6:F6', bg:'#e65100', total: f.inscMes }
  ];
  kpi1.forEach(k => {
    sheet.getRange(k.rng).merge().setValue(k.label).setBackground(k.bg).setFontColor('white')
      .setFontWeight('bold').setFontSize(10).setHorizontalAlignment('center').setVerticalAlignment('middle');
    sheet.getRange(k.numRng).merge().setFormula(k.total).setBackground(k.bg).setFontColor('white')
      .setFontWeight('bold').setFontSize(36).setHorizontalAlignment('center').setVerticalAlignment('middle');
  });
  sheet.setRowHeight(5, 28);
  sheet.setRowHeight(6, 70);

  const kpi2 = [
    { label:'🎓 Graduadx (Este Mes)',    rng:'A7:B7', numRng:'A8:B8', bg:'#00796b', total: f.gradMes },
    { label:'⚠️ Deserciones (Este Mes)', rng:'C7:D7', numRng:'C8:D8', bg:'#c62828', total: f.desMes },
    { label:'🏫 Cohortes Activas',       rng:'E7:F7', numRng:'E8:F8', bg:'#6a1b9a', total: f.cohActivas }
  ];
  kpi2.forEach(k => {
    sheet.getRange(k.rng).merge().setValue(k.label).setBackground(k.bg).setFontColor('white')
      .setFontWeight('bold').setFontSize(10).setHorizontalAlignment('center').setVerticalAlignment('middle');
    sheet.getRange(k.numRng).merge().setFormula(k.total).setBackground(k.bg).setFontColor('white')
      .setFontWeight('bold').setFontSize(36).setHorizontalAlignment('center').setVerticalAlignment('middle');
  });
  sheet.setRowHeight(7, 28);
  sheet.setRowHeight(8, 70);
  sheet.setRowHeight(9, 12);

  sheet.getRange('A10:F10').merge().setValue('📊  ENTREVISTAS DEL MES')
    .setBackground('#2e7d32').setFontColor('white').setFontWeight('bold')
    .setFontSize(12).setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(10, 34);

  const hdrsEnt = ['Total del Mes', 'Aprobadas', 'No Aprobadas', 'No Asistió', 'Reprogramadas', 'Sin Estado'];
  const valsEnt = [f.entrevMes, f.aprobMes, f.noAprobMes, f.noAsistMes, f.reprogMes,
    '=IFERROR(' + f.entrevMes.replace('=','') + '-' + f.aprobMes.replace('=','') + '-' + f.noAprobMes.replace('=','') + '-' + f.noAsistMes.replace('=','') + '-' + f.reprogMes.replace('=','') + ',0)'];
  const bgEnt = ['#1b5e20','#4caf50','#f44336','#ff9800','#9c27b0','#607d8b'];
  hdrsEnt.forEach((h, i) => {
    sheet.getRange(11, i+1).setValue(h).setBackground(bgEnt[i]).setFontColor('white')
      .setFontWeight('bold').setFontSize(9).setHorizontalAlignment('center').setVerticalAlignment('middle');
    sheet.getRange(12, i+1).setFormula(valsEnt[i]).setBackground('#e8f5e9')
      .setFontWeight('bold').setFontSize(18).setHorizontalAlignment('center').setVerticalAlignment('middle');
  });
  sheet.setRowHeight(11, 30);
  sheet.setRowHeight(12, 50);
  sheet.setRowHeight(13, 12);

  sheet.getRange('A14:F14').merge().setValue('📅  ACTIVIDAD DEL MES ACTUAL')
    .setBackground('#37474f').setFontColor('white').setFontWeight('bold')
    .setFontSize(12).setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(14, 34);

  const miniKpis = [
    { label:'Nuevos Registros', formula: f.interesMes,  bg:'#bbdefb' },
    { label:'Entrevistas',      formula: f.entrevMes,   bg:'#c8e6c9' },
    { label:'Aprobadas',        formula: f.aprobMes,    bg:'#dcedc8' },
    { label:'Graduadx',         formula: f.gradMes,     bg:'#e0f7fa' },
    { label:'Deserciones',      formula: f.desMes,      bg:'#ffcdd2' },
    { label:'No Seleccionadas', formula: f.noInscMes,   bg:'#ffe0b2' }
  ];
  miniKpis.forEach((k, i) => {
    sheet.getRange(15, i+1).setValue(k.label).setBackground('#eceff1')
      .setFontWeight('bold').setFontSize(9).setHorizontalAlignment('center');
    sheet.getRange(16, i+1).setFormula(k.formula).setBackground(k.bg)
      .setFontWeight('bold').setFontSize(16).setHorizontalAlignment('center').setVerticalAlignment('middle');
  });
  sheet.setRowHeight(15, 24);
  sheet.setRowHeight(16, 40);
  sheet.setRowHeight(17, 12);

  sheet.getRange('A18:F18').merge().setValue('📈  RESUMEN EJECUTIVO')
    .setBackground('#1a237e').setFontColor('white').setFontWeight('bold')
    .setFontSize(12).setHorizontalAlignment('center').setVerticalAlignment('middle');
  sheet.setRowHeight(18, 34);

  const resumen = [
    ['Nuevas registradas (mes):', f.interesMes,  'Aprobadas (mes):', f.aprobMes, '', ''],
    ['Entrevistadas (mes):',      f.entrevMes,   'No Seleccionadas (mes):', f.noInscMes, '', ''],
    ['Graduadx (mes):',           f.gradMes,     'Derivadas P. Paso (mes):', f.derivMes, '', '']
  ];
  resumen.forEach((row, i) => {
    const r = 19 + i;
    sheet.getRange(r, 1).setValue(row[0]).setFontWeight('bold').setFontSize(10);
    sheet.getRange(r, 2).setFormula(row[1]).setFontWeight('bold').setFontSize(14)
      .setBackground('#e8eaf6').setHorizontalAlignment('center');
    sheet.getRange(r, 3).setValue(row[2]).setFontWeight('bold').setFontSize(10);
    sheet.getRange(r, 4).setFormula(row[3] || '=""').setFontWeight('bold').setFontSize(14)
      .setBackground('#e8eaf6').setHorizontalAlignment('center');
    sheet.getRange(r, 5, 1, 2).merge();
    sheet.setRowHeight(r, 30);
  });
  sheet.getRange('B19:B21').setNumberFormat('0');
  sheet.getRange('D19:D21').setNumberFormat('0');

  sheet.setRowHeight(22, 10);
  sheet.getRange('A23:F23').merge()
    .setValue('Generado automáticamente  ·  Sistema Inclusión Laboral Creamos Guatemala')
    .setFontColor('#9e9e9e').setFontSize(8).setFontStyle('italic').setHorizontalAlignment('center');

  // Limpiar filas extra por si quedaron datos de versión anterior
  sheet.getRange('A24:F50').clearContent().clearFormat();

  sheet.setFrozenRows(2);
  ss.toast('✅ Reporte rediseñado', 'Reporte', 4);
}

function mejorarYRepararReportes() {
  redisenarReporteTech();
  SpreadsheetApp.getUi().alert('✅ Reporte actualizado',
    'El Reporte fue rediseñado con el nuevo dashboard:\n\n' +
    '✓ Cajas de color con métricas clave\n' +
    '✓ Desglose de entrevistas del mes\n' +
    '✓ Actividad del mes actual\n' +
    '✓ Resumen ejecutivo\n\n' +
    'Los datos se actualizan automáticamente.',
    SpreadsheetApp.getUi().ButtonSet.OK);
}

function asegurarColumnaFechaEnvioInscritxTech() {
  repararColumnaFechaInscritxTech();
}

function rellenarFechasInscritxFaltantesTech() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  const sheet = ss.getSheetByName('Inscritx');
  if (!sheet) { ui.alert('❌', 'No existe la hoja Inscritx', ui.ButtonSet.OK); return; }

  const quitarTildes = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  const norm = h => quitarTildes((h || '').toString().toLowerCase()).replace(/[^a-z0-9]/g, '');

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const colFecha = headers.findIndex(h => norm(h) === 'fechaenvioainscritx');
  const colCreamosId = headers.findIndex(h => norm(h) === 'creamosid');

  if (colFecha < 0 || colCreamosId < 0) {
    ui.alert('❌', 'No se encontraron las columnas necesarias (Creamos ID, Fecha envío)', ui.ButtonSet.OK);
    return;
  }

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) { ui.alert('ℹ️', 'No hay participantes en Inscritx', ui.ButtonSet.OK); return; }

  const entrevistas = ss.getSheetByName('Entrevistas');
  if (!entrevistas) { ui.alert('❌', 'No existe la hoja Entrevistas', ui.ButtonSet.OK); return; }

  const dataEnt = entrevistas.getDataRange().getValues();
  const hdrsEnt = dataEnt[0];
  const colEntCreamosId = hdrsEnt.findIndex(h => norm(h) === 'creamosid');
  const colEntFecha = hdrsEnt.findIndex(h => norm(h).includes('fechaentrevista') || norm(h).includes('fecha'));

  const mapEntrevistas = new Map();
  if (colEntCreamosId >= 0 && colEntFecha >= 0) {
    for (let i = 1; i < dataEnt.length; i++) {
      const id = (dataEnt[i][colEntCreamosId] || '').toString().trim();
      const fecha = dataEnt[i][colEntFecha];
      if (id && fecha) mapEntrevistas.set(id, fecha);
    }
  }

  const datos = sheet.getDataRange().getValues();
  let rellenas = 0;
  let sinCorrespondencia = 0;

  for (let i = 1; i < datos.length; i++) {
    const id = (datos[i][colCreamosId] || '').toString().trim();
    const fechaActual = datos[i][colFecha];

    if (!fechaActual && id) {
      const fechaEnt = mapEntrevistas.get(id);
      if (fechaEnt) {
        sheet.getRange(i + 1, colFecha + 1).setValue(fechaEnt).setNumberFormat('dd/mm/yyyy');
        rellenas++;
      } else {
        sinCorrespondencia++;
      }
    }
  }

  if (sinCorrespondencia > 0) {
    const resp = ui.alert(
      '⚠️ Hay ' + sinCorrespondencia + ' participantes sin fecha en Entrevistas',
      '✅ ' + rellenas + ' fechas llenadas desde Entrevistas.\n\n' +
      sinCorrespondencia + ' participantes no tienen entrevista registrada.\n\n' +
      '¿Qué hacer?\n' +
      '- "Hoy" → Usa fecha de hoy para los restantes\n' +
      '- "Dejar" → Deja los blancos (manualmente después)\n' +
      '- "Cancelar" → Sin cambios',
      ui.ButtonSet.YES_NO_CANCEL
    );

    if (resp === ui.Button.YES) {
      const hoy = new Date();
      for (let i = 1; i < datos.length; i++) {
        const id = (datos[i][colCreamosId] || '').toString().trim();
        const fechaActual = datos[i][colFecha];
        if (!fechaActual && id && !mapEntrevistas.has(id)) {
          sheet.getRange(i + 1, colFecha + 1).setValue(hoy).setNumberFormat('dd/mm/yyyy');
        }
      }
      ui.alert('✅ Completado', rellenas + ' del historial de Entrevistas + ' + sinCorrespondencia + ' de hoy.\n' +
        'Total: ' + (rellenas + sinCorrespondencia) + ' fechas añadidas.', ui.ButtonSet.OK);
    } else if (resp === ui.Button.NO) {
      ui.alert('ℹ️', rellenas + ' fechas rellenadas desde Entrevistas. Los demás quedan en blanco.', ui.ButtonSet.OK);
    }
  } else {
    SpreadsheetApp.flush();
    ui.alert('✅ Listo', 'Todas las ' + rellenas + ' fechas se llenaron desde Entrevistas.', ui.ButtonSet.OK);
  }

  SpreadsheetApp.flush();
}

function mostrarMenuReportesAutomaticos() {
  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu('⏰ Reportes Automáticos')
    .addItem('✅ Activar Reportes + PowerBI Automáticos', 'activarTodosAutomaticos')
    .addItem('🛑 Desactivar Reportes + PowerBI Automáticos', 'desactivarTodosAutomaticos')
    .addItem('📋 Ver Estado de Triggers', 'verEstadoTriggers');
  menu.showModelessDialog(ui.createHtmlOutput(''), '⏰ Automáticos');
}

function activarTodosAutomaticos() {
  instalarTriggersReportesMensuales();
  instalarTriggerPowerBIExport();
  SpreadsheetApp.getUi().alert('✅ Listo', 'Reportes y PowerBI se actualizarán automáticamente', SpreadsheetApp.getUi().ButtonSet.OK);
}

function desactivarTodosAutomaticos() {
  desinstalarTriggersReportesMensuales();
  desinstalarTriggerPowerBIExport();
  SpreadsheetApp.getUi().alert('✅ Listo', 'Automáticos desactivados', SpreadsheetApp.getUi().ButtonSet.OK);
}

function verEstadoTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  const funcionesAutomaticas = ['autoActualizarReportesMensuales', 'autoActualizarPowerBIExport'];
  const activos = triggers.filter(t => funcionesAutomaticas.includes(t.getHandlerFunction()));
  const estado = activos.length > 0 ? '✅ ACTIVOS (' + activos.length + ')' : '❌ DESACTIVADOS';
  SpreadsheetApp.getUi().alert('⏰ Estado de Triggers', estado, SpreadsheetApp.getUi().ButtonSet.OK);
}

function repararColumnaFechaInscritxTech() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Inscritx');
  const ui = SpreadsheetApp.getUi();
  if (!sheet) { ui.alert('❌', 'No existe la hoja Inscritx', ui.ButtonSet.OK); return; }

  const quitarTildes = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  const norm = h => quitarTildes((h || '').toString().toLowerCase()).replace(/[^a-z0-9]/g, '');

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const indices = headers.reduce((acc, h, i) => {
    if (norm(h) === 'fechaenvioainscritx') acc.push(i);
    return acc;
  }, []);

  const log = [];

  if (indices.length === 0) {
    // No existe: crear en columna A
    sheet.insertColumnBefore(1);
    sheet.getRange(1, 1).setValue('Fecha envío a Inscritx').setFontWeight('bold').setBackground('#90caf9');
    sheet.getRange(2, 1, Math.max(1, sheet.getLastRow() - 1), 1).setNumberFormat('dd/mm/yyyy hh:mm');
    log.push('✅ Columna "Fecha envío a Inscritx" creada en columna A');

  } else if (indices.length === 1) {
    // Existe solo una — asegurarse que tiene el formato correcto
    const col = indices[0] + 1;
    sheet.getRange(1, col).setFontWeight('bold').setBackground('#90caf9');
    sheet.getRange(2, col, Math.max(1, sheet.getLastRow() - 1), 1).setNumberFormat('dd/mm/yyyy hh:mm');
    log.push('✅ Columna ya existía en columna ' + String.fromCharCode(64 + col) + ' — formato aplicado');

  } else {
    // Hay duplicados: quedarse con la que tenga más datos, eliminar las demás
    const lastRow = sheet.getLastRow();
    let mejorIdx = indices[0];
    let mejorDatos = 0;
    for (const idx of indices) {
      const vals = sheet.getRange(2, idx + 1, Math.max(1, lastRow - 1), 1).getValues();
      const llenas = vals.filter(r => r[0] !== '').length;
      if (llenas > mejorDatos) { mejorDatos = llenas; mejorIdx = idx; }
    }

    // Eliminar las columnas duplicadas de derecha a izquierda
    const aEliminar = indices.filter(i => i !== mejorIdx).sort((a, b) => b - a);
    for (const idx of aEliminar) {
      sheet.deleteColumn(idx + 1);
      log.push('🗑️ Eliminada columna duplicada ' + (idx + 1));
    }

    // Asegurar formato en la columna buena (recalcular posición tras eliminar)
    const posicion = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
      .findIndex(h => norm(h) === 'fechaenvioainscritx') + 1;
    sheet.getRange(1, posicion).setFontWeight('bold').setBackground('#90caf9');
    sheet.getRange(2, posicion, Math.max(1, sheet.getLastRow() - 1), 1).setNumberFormat('dd/mm/yyyy hh:mm');
    log.push('✅ Columna definitiva en posición ' + String.fromCharCode(64 + posicion));
  }

  SpreadsheetApp.flush();
  ui.alert('✅ Reparación completada', log.join('\n'), ui.ButtonSet.OK);
}

function aplicarActualizacionesTech() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  const confirmar = ui.alert(
    '🆕 APLICAR ACTUALIZACIONES',
    'Aplicará todos los cambios nuevos al sistema existente:\n\n' +
    '✅ Reparar trigger de automatizaciones\n' +
    '✅ Reinstalar/reparar hoja Cohortes y fórmulas\n' +
    '✅ Reparar fórmulas de conteo (Graduadx/Retiradx)\n' +
    '✅ Actualizar validaciones y desplegables\n' +
    '✅ Verificar columnas y reportes\n\n' +
    '⚠️ Los datos existentes NO se borran.\n¿Continuar?',
    ui.ButtonSet.YES_NO
  );
  if (confirmar !== ui.Button.YES) return;

  const log = [];
  const errores = [];

  ss.toast('Paso 1/5: Reparando trigger...', 'Actualizando', 10);
  try {
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(t => {
      if (t.getHandlerFunction() === 'alEditar' || t.getHandlerFunction() === 'alEditarTech') {
        ScriptApp.deleteTrigger(t);
      }
    });
    ScriptApp.newTrigger('alEditarTech').forSpreadsheet(ss).onEdit().create();
    log.push('✓ Trigger alEditarTech instalado');
  } catch(e) { errores.push('✗ Trigger: ' + e.message); }

  ss.toast('Paso 2/5: Reinstalando hoja Cohortes...', 'Actualizando', 10);
  try {
    reinstalarHojaCohortesTech();
    log.push('✓ Hoja Cohortes reinstalada');
  } catch(e) { errores.push('✗ Cohortes: ' + e.message); }

  ss.toast('Paso 3/5: Reparando fórmulas...', 'Actualizando', 10);
  try {
    repararFormulasCohortes();
    log.push('✓ Fórmulas de Cohortes reparadas (Graduadx/Retiradx → columna J)');
  } catch(e) { errores.push('✗ Fórmulas Cohortes: ' + e.message); }
  try {
    repararFormulasReporte();
    log.push('✓ Fórmulas de Reporte reparadas');
  } catch(e) { errores.push('✗ Fórmulas Reporte: ' + e.message); }

  ss.toast('Paso 4/5: Actualizando validaciones y desplegables...', 'Actualizando', 10);
  try {
    configurarValidaciones();
    log.push('✓ Validaciones y dropdowns actualizados');
  } catch(e) { errores.push('✗ Validaciones: ' + e.message); }
  try {
    repararDesplegableEntrevistasTech();
    log.push('✓ Desplegable Entrevistas reparado');
  } catch(e) { errores.push('✗ Desplegable: ' + e.message); }

  ss.toast('Paso 5/5: Verificando columnas y reportes...', 'Actualizando', 10);
  try {
    asegurarColumnaFechaEnvioInscritxTech();
    agregarYOrganizarColumnasLlamadas();
    log.push('✓ Columnas verificadas');
  } catch(e) { errores.push('✗ Columnas: ' + e.message); }
  try {
    asegurarEstructuraReportesMensualesTech();
    log.push('✓ Reportes Mensuales verificados');
  } catch(e) { errores.push('✗ Reportes: ' + e.message); }

  SpreadsheetApp.flush();
  const titulo = errores.length > 0 ? '⚠️ Completado con advertencias' : '✅ Actualizaciones aplicadas';
  ui.alert(titulo,
    log.join('\n') +
    (errores.length > 0 ? '\n\n⚠️ Errores:\n' + errores.join('\n') : ''),
    ui.ButtonSet.OK);
}

function instalarTodoLoNuevoTech() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  try {
    reinstalarHojaCohortesTech();
    asegurarEstructuraReportesMensualesTech();
    asegurarColumnaFechaEnvioInscritxTech();
    redisenarReporteTech();
    repararFormulasCohortes();
    configurarValidaciones();
    repararDesplegableEntrevistasTech();
    SpreadsheetApp.flush();
    ss.toast('✅ Instalación completa aplicada', 'Sistema actualizado', 6);
    ui.alert('✅ Listo', 'Se reinstaló Cohortes y se reparó todo: reporte, fórmulas, validaciones y desplegables.', ui.ButtonSet.OK);
  } catch (e) {
    ui.alert('❌ Error', 'No se pudo completar la instalación: ' + e.message, ui.ButtonSet.OK);
  }
}

function repararDesplegableEntrevistasTech() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const entrevistas = ss.getSheetByName('Entrevistas');
  if (!entrevistas || entrevistas.getLastRow() < 2) return;

  const headers = entrevistas.getRange(1, 1, 1, entrevistas.getLastColumn()).getValues()[0];
  const colEstado = headers.indexOf('Estado') + 1;
  if (colEstado < 1) return;

  [14, 15, 16].forEach(col => {
    if (col !== colEstado && col <= entrevistas.getLastColumn()) {
      entrevistas.getRange(2, col, 499, 1).clearDataValidations();
    }
  });

  const opciones = CONFIG_TECH.RESULTADO_FINAL.concat([
    'Derivar a Paso a Paso', 'Derivación a Programas', 'Enviar a A y B'
  ]);
  entrevistas.getRange(2, colEstado, 499, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(opciones).setAllowInvalid(true).build()
  );
}

/**
 * Instala triggers automáticos para reportes mensuales
 * Se ejecuta el primer día de cada mes a las 8 AM
 */
function instalarTriggersReportesMensuales() {
  const ui = SpreadsheetApp.getUi();

  // Eliminar triggers anteriores
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'guardarReporteMensualAutomatico' ||
        trigger.getHandlerFunction() === 'regenerarPowerBIExport') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Instalar nuevo trigger para reporte mensual (primer día del mes)
  ScriptApp.newTrigger('guardarReporteMensualAutomatico')
    .timeBased()
    .onMonthDay(1)
    .atHour(8)
    .create();

  // Instalar trigger para regenerar PowerBI (primer día, 8:05 AM)
  ScriptApp.newTrigger('regenerarPowerBIExport')
    .timeBased()
    .onMonthDay(1)
    .atHour(8)
    .create();

  ui.alert('✅ Triggers instalados',
    'Los reportes mensuales se guardarán automáticamente:\n\n' +
    '📅 Primer día de cada mes a las 8:00 AM\n' +
    '💾 PowerBI Export se regenera a las 8:05 AM\n\n' +
    'Ya no necesitas hacer nada manualmente.',
    ui.ButtonSet.OK);
}

/**
 * Reinicia el mes de referencia del Reporte al mes actual.
 * Se puede ejecutar desde el menú: Reportes → Reiniciar Mes Actual en Reporte
 */
function reiniciarMesEnReporteTech() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const reporte = ss.getSheetByName('Reporte');
  if (!reporte) {
    SpreadsheetApp.getUi().alert('⚠️ No se encontró la hoja "Reporte". Ejecuta primero "Mejorar Reportes".');
    return;
  }
  reporte.getRange('Z1').setFormula('=TODAY()');
  SpreadsheetApp.flush();
  const mesActual = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MMMM yyyy');
  ss.toast('✅ Reporte reiniciado al mes actual: ' + mesActual, 'Reporte', 4);
  SpreadsheetApp.getUi().alert(
    '✅ Reporte reiniciado',
    'Ahora el reporte muestra los datos de: ' + mesActual + '\n\n' +
    'El reporte se actualizará automáticamente cada mes.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * Regenera la hoja PowerBI Export (para mantener datos actualizados)
 */
function regenerarPowerBIExport() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const hojaExistente = ss.getSheetByName('PowerBI Export');

    if (hojaExistente) {
      ss.deleteSheet(hojaExistente);
    }

    crearHojaPowerBICohortes();
    SpreadsheetApp.getActiveSpreadsheet()
      .toast('✅ PowerBI Export regenerado automáticamente', 'Reporte Mensual', 3);

  } catch (e) {
    Logger.log('Error en regenerarPowerBIExport: ' + e.message);
  }
}

/**
 * Desinstala triggers de reportes mensuales
 */
function desinstalarTriggersReportesMensuales() {
  const triggers = ScriptApp.getProjectTriggers();
  let eliminados = 0;

  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'guardarReporteMensualAutomatico' ||
        trigger.getHandlerFunction() === 'regenerarPowerBIExport') {
      ScriptApp.deleteTrigger(trigger);
      eliminados++;
    }
  });

  SpreadsheetApp.getUi().alert('✅ Triggers desinstalados',
    'Se desinstalaron ' + eliminados + ' trigger(s).\n\n' +
    'Los reportes mensuales ya NO se guardarán automáticamente.',
    SpreadsheetApp.getUi().ButtonSet.OK);
}

function instalarTriggersImportacionAuto() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'importarDesdeKoboTech') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  ScriptApp.newTrigger('importarDesdeKoboTech')
    .timeBased()
    .everyMinutes(10)
    .create();

  SpreadsheetApp.getUi().alert('✅ Auto-importación activada',
    'El sistema descargará datos nuevos automáticamente:\n\n' +
    '📥 Cada 10 minutos: Hoja de Interés (datos de Kobo)\n\n' +
    'Ya no necesitas importar manualmente los registros nuevos.\n' +
    'Las entrevistas aún deben importarse manualmente.',
    SpreadsheetApp.getUi().ButtonSet.OK);
}

function desinstalarTriggersImportacionAuto() {
  const triggers = ScriptApp.getProjectTriggers();
  let eliminados = 0;

  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'importarDesdeKoboTech') {
      ScriptApp.deleteTrigger(trigger);
      eliminados++;
    }
  });

  SpreadsheetApp.getUi().alert('✅ Auto-importación desactivada',
    'Se desactivaron ' + eliminados + ' trigger(s).\n\n' +
    'Ya no se importarán datos automáticamente.',
    SpreadsheetApp.getUi().ButtonSet.OK);
}

function crearHojaPowerBICohortes() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Eliminar si ya existe
  const hojaExistente = ss.getSheetByName('PowerBI Export');
  if (hojaExistente) ss.deleteSheet(hojaExistente);

  const sheet = ss.insertSheet('PowerBI Export');

  // Encabezados en formato tabla para Power BI
  const headers = [
    'Fecha Actualización',
    'Mes',
    'Año',
    'Nombre Cohorte',
    'Proyecto',
    'Responsable',
    'Cupo Máximo',
    'Inscritas',
    'Graduadas',
    'Retiradas',
    'Tasa Éxito %',
    'Inicio',
    'Fin',
    'Estado'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#0d47a1')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Ancho de columnas
  const anchos = [140, 80, 80, 180, 150, 120, 120, 100, 100, 100, 120, 100, 100, 100];
  anchos.forEach((w, i) => sheet.setColumnWidth(i + 1, w));

  // Agregar datos de todas las cohortes
  const cohortesSheet = ss.getSheetByName('Cohortes');
  if (!cohortesSheet) return;

  const datos = cohortesSheet.getDataRange().getValues();
  const hoy = new Date();
  const mesActual = hoy.getMonth() + 1;
  const anioActual = hoy.getFullYear();

  let filaDestino = 2;
  for (let i = 1; i < datos.length; i++) {
    const fila = datos[i];
    if (!fila[0]) continue; // Saltar vacías

    const nombreCohorte = fila[0].toString().trim();
    const proyecto = fila[1] || '';
    const anio = fila[2] || '';
    const fechaInicio = fila[3] || '';
    const fechaFin = fila[4] || '';
    const responsable = fila[5] || '';
    const cupo = fila[6] || '';
    const inscritas = fila[7] || '';
    const graduadas = fila[8] || '';
    const retiradas = fila[9] || '';
    const estado = fila[13] || 'Activa';

    // Calcular tasa de éxito
    let tasaExito = 0;
    if (graduadas && retiradas) {
      const totalTerminadas = parseInt(graduadas) + parseInt(retiradas);
      if (totalTerminadas > 0) {
        tasaExito = (parseInt(graduadas) / totalTerminadas * 100).toFixed(1);
      }
    }

    const filaExportar = [
      hoy,
      mesActual,
      anioActual,
      nombreCohorte,
      proyecto,
      responsable,
      cupo,
      inscritas,
      graduadas,
      retiradas,
      tasaExito,
      fechaInicio,
      fechaFin,
      estado
    ];

    sheet.getRange(filaDestino, 1, 1, headers.length).setValues([filaExportar]);
    filaDestino++;
  }

  // Aplicar formato de tabla
  if (filaDestino > 2) {
    sheet.getRange(2, 1, filaDestino - 2, headers.length)
      .setBackground('#f5f5f5')
      .setFontSize(10);

    // Alternar colores de filas
    for (let i = 2; i < filaDestino; i++) {
      if (i % 2 === 0) {
        sheet.getRange(i, 1, 1, headers.length).setBackground('#ffffff');
      } else {
        sheet.getRange(i, 1, 1, headers.length).setBackground('#f9f9f9');
      }
    }
  }

  sheet.setFrozenRows(1);
  SpreadsheetApp.getActiveSpreadsheet().toast('✅ Hoja PowerBI Export creada', 'Power BI', 5);
}

/**
 * Guarda un reporte mensual automáticamente (una línea por mes)
 * Se ejecuta automáticamente vía trigger
 */
// ─────────────────────────────────────────────────────────────────────────────
// HELPERS REPORTE MENSUAL
// ─────────────────────────────────────────────────────────────────────────────

function contarFilasPorMes_(sheet, colFecha, mes, anio) {
  if (!sheet || sheet.getLastRow() < 2) return 0;
  const datos = sheet.getRange(2, colFecha, sheet.getLastRow() - 1, 1).getValues();
  return datos.filter(r => {
    if (!r[0]) return false;
    const d = (r[0] instanceof Date) ? r[0] : new Date(r[0]);
    return !isNaN(d.getTime()) && d.getMonth() + 1 === mes && d.getFullYear() === anio;
  }).length;
}

function contarEntrevistasPorEstado_(sheet, mes, anio) {
  const res = { total:0, aprobada:0, noAprobada:0, noAsistio:0, reprogramada:0, derivada:0 };
  if (!sheet || sheet.getLastRow() < 2) return res;
  const lastRow = sheet.getLastRow() - 1;
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const colEstado = headers.indexOf('Estado') + 1;
  if (colEstado < 1) return res;
  const fechas  = sheet.getRange(2, 1, lastRow, 1).getValues();
  const estados = sheet.getRange(2, colEstado, lastRow, 1).getValues();
  fechas.forEach((row, i) => {
    if (!row[0]) return;
    const d = (row[0] instanceof Date) ? row[0] : new Date(row[0]);
    if (isNaN(d.getTime()) || d.getMonth() + 1 !== mes || d.getFullYear() !== anio) return;
    res.total++;
    const est = (estados[i][0] || '').toString().trim();
    if (est === 'Seleccionada/o' || est === 'Aprobada')            res.aprobada++;
    else if (est === 'No seleccionada/o' || est === 'No aprobada' || est === 'No asistió / No aprobó') res.noAprobada++;
    else if (est === 'No asistió')                                 res.noAsistio++;
    else if (est === 'Reprogramada')          res.reprogramada++;
    else if (est === 'Derivar a Paso a Paso') res.derivada++;
  });
  return res;
}

function generarTextoImpactoTech_(datos, mesTexto) {
  const { nuevos, entrevistasTotales, aprobadas, inscritxTotal, graduadxMes, cohortesActivas } = datos;
  let titular = '';
  if (aprobadas > 0)
    titular = aprobadas + ' personas avanzaron al programa de Tecnología en ' + mesTexto;
  else if (entrevistasTotales > 0)
    titular = entrevistasTotales + ' personas entrevistadas para el programa de Tecnología — ' + mesTexto;
  else if (nuevos > 0)
    titular = nuevos + ' personas manifestaron interés en el programa de Tecnología — ' + mesTexto;
  else
    titular = 'Mes de acompañamiento en Tecnología — ' + mesTexto;

  const logros = [];
  if (nuevos > 0)             logros.push('• Recibimos ' + nuevos + ' nuevas solicitudes de interés');
  if (entrevistasTotales > 0) logros.push('• Realizamos ' + entrevistasTotales + ' entrevistas (' + aprobadas + ' aprobadas)');
  if (graduadxMes > 0)        logros.push('• Graduamos a ' + graduadxMes + ' participantes del programa');
  if (cohortesActivas > 0)    logros.push('• Mantuvimos ' + cohortesActivas + ' cohortes activas en formación');
  if (inscritxTotal > 0)      logros.push('• Total acumulado en formación: ' + inscritxTotal + ' personas inscritx');
  return { titular, logros: logros.join('\n') };
}

// ─────────────────────────────────────────────────────────────────────────────

function guardarReporteMensualTech_(fechaRef) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let mensuales = ss.getSheetByName('Reportes Mensuales');
    if (!mensuales) { crearHojaReportesMensuales(); mensuales = ss.getSheetByName('Reportes Mensuales'); }

    const baseDate = fechaRef || new Date();
    const mes      = baseDate.getMonth() + 1;
    const anio     = baseDate.getFullYear();
    const mesTexto = Utilities.formatDate(baseDate, Session.getScriptTimeZone(), 'MMMM yyyy');

    const hojaInteres     = ss.getSheetByName('Hoja de Interés');
    const hojaEntrevistas = ss.getSheetByName('Entrevistas');
    const hojaInscritx    = ss.getSheetByName('Inscritx');
    const hojaGraduadx    = ss.getSheetByName('Graduadx');
    const hojaRetiradx    = ss.getSheetByName('Retiradx');
    const hojaCohortes    = ss.getSheetByName('Cohortes');

    const nuevosRegistros = contarFilasPorMes_(hojaInteres, 1, mes, anio);
    const stats           = contarEntrevistasPorEstado_(hojaEntrevistas, mes, anio);
    const inscritxTotal   = (hojaInscritx && hojaInscritx.getLastRow() > 1) ? hojaInscritx.getLastRow() - 1 : 0;
    const graduadxMes     = contarFilasPorMes_(hojaGraduadx, 1, mes, anio);
    const desercionesMes  = contarFilasPorMes_(hojaRetiradx, 1, mes, anio);

    let cohortesActivas = 0;
    if (hojaCohortes && hojaCohortes.getLastRow() > 1) {
      const headersC = hojaCohortes.getRange(1,1,1,hojaCohortes.getLastColumn()).getValues()[0];
      const colEstC  = headersC.indexOf('Estado') + 1;
      if (colEstC > 0) {
        const estCohortes = hojaCohortes.getRange(2, colEstC, hojaCohortes.getLastRow()-1, 1).getValues();
        cohortesActivas   = estCohortes.filter(r => (r[0]||'').toString().trim() === 'Activa').length;
      }
    }

    const tasaConversion = stats.total > 0 ? Math.round((stats.aprobada / stats.total) * 100) + '%' : '0%';
    const texto = generarTextoImpactoTech_({ nuevos: nuevosRegistros, entrevistasTotales: stats.total,
      aprobadas: stats.aprobada, inscritxTotal, graduadxMes, cohortesActivas }, mesTexto);

    const nuevaFila = [
      mesTexto, nuevosRegistros, stats.total, stats.aprobada, stats.noAprobada,
      stats.noAsistio, stats.reprogramada, stats.derivada,
      inscritxTotal, graduadxMes, desercionesMes, cohortesActivas,
      tasaConversion, texto.titular, texto.logros, new Date()
    ];

    const existentes = mensuales.getDataRange().getValues();
    let filaExistente = -1;
    for (let i = 1; i < existentes.length; i++) {
      if ((existentes[i][0] || '').toString().trim().toLowerCase() === mesTexto.toLowerCase()) {
        filaExistente = i + 1; break;
      }
    }
    if (filaExistente > 0) {
      mensuales.getRange(filaExistente, 1, 1, nuevaFila.length).setValues([nuevaFila]);
      mensuales.setRowHeight(filaExistente, 80);
    } else {
      mensuales.getRange(mensuales.getLastRow() + 1, 1, 1, nuevaFila.length).setValues([nuevaFila]);
      mensuales.setRowHeight(mensuales.getLastRow(), 80);
    }

    ss.toast('✅ Reporte ' + mesTexto + ' guardado en Reportes Mensuales', 'Reportes Mensuales', 5);
  } catch (e) {
    Logger.log('Error en guardarReporteMensualAutomatico: ' + e.message);
  }
}

function asegurarFilaMesSiguienteEnCeroTech_(baseDate) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let mensuales = ss.getSheetByName('Reportes Mensuales');
  if (!mensuales) {
    crearHojaReportesMensuales();
    mensuales = ss.getSheetByName('Reportes Mensuales');
  }
  if (!mensuales) return;

  const ref = baseDate || new Date();
  const next = new Date(ref.getFullYear(), ref.getMonth() + 1, 1);
  const mesTexto = Utilities.formatDate(next, Session.getScriptTimeZone(), 'MMMM yyyy');

  const filaCero = [
    mesTexto, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '0%', 'Mes en inicio — ' + mesTexto, '', new Date()
  ];

  const existentes = mensuales.getDataRange().getValues();
  let filaExistente = -1;
  for (let i = 1; i < existentes.length; i++) {
    if ((existentes[i][0] || '').toString().trim().toLowerCase() === mesTexto.toLowerCase()) {
      filaExistente = i + 1; break;
    }
  }
  if (filaExistente > 0) {
    mensuales.getRange(filaExistente, 1, 1, filaCero.length).setValues([filaCero]);
    mensuales.setRowHeight(filaExistente, 40);
  } else {
    const nueva = mensuales.getLastRow() + 1;
    mensuales.getRange(nueva, 1, 1, filaCero.length).setValues([filaCero]);
    mensuales.setRowHeight(nueva, 40);
  }
}

function moverReporteAMesSiguienteTech_(baseDate) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const reporte = ss.getSheetByName('Reporte');
  if (!reporte) return;
  const ref = baseDate || new Date();
  const next = new Date(ref.getFullYear(), ref.getMonth() + 1, 1);
  reporte.getRange('Z1').setValue(next).setNumberFormat('dd/mm/yyyy');
}

function guardarReporteMensualAutomatico() {
  guardarReporteMensualTech_(new Date());
}

function generarReporteMensualPorMesTech() {
  const ui = SpreadsheetApp.getUi();
  const resp = ui.prompt('📅 Generar Reporte Mensual', 'Ingresa mes/año en formato MM/YYYY (ejemplo: 03/2026):', ui.ButtonSet.OK_CANCEL);
  if (resp.getSelectedButton() !== ui.Button.OK) return;

  const txt = (resp.getResponseText() || '').trim();
  const m = txt.match(/^(\d{1,2})\s*\/\s*(\d{4})$/);
  if (!m) {
    ui.alert('Formato inválido. Usa MM/YYYY, por ejemplo 03/2026.');
    return;
  }

  const mes = Number(m[1]);
  const anio = Number(m[2]);
  if (mes < 1 || mes > 12) {
    ui.alert('Mes inválido. Debe ser entre 1 y 12.');
    return;
  }

  guardarReporteMensualTech_(new Date(anio, mes - 1, 1));
  ui.alert('✅ Listo', 'Se guardó/actualizó el reporte de ' + (m[1].padStart(2, '0')) + '/' + anio + ' en "Reportes Mensuales".', ui.ButtonSet.OK);
}

function guardarReporteMensual() {
  // Función manual — llama al mismo motor que el automático
  const hoy = new Date();
  guardarReporteMensualTech_(hoy);
  asegurarFilaMesSiguienteEnCeroTech_(hoy);
  moverReporteAMesSiguienteTech_(hoy);
  SpreadsheetApp.getUi().alert(
    '✅ Reporte guardado',
    'Se guardó el mes actual y se creó/actualizó el mes siguiente en cero en "Reportes Mensuales".\n\n' +
    'El trigger automático hace esto el día 1 de cada mes a las 8:00 AM.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

// =====================================================================
// TRIGGERS
// =====================================================================

function instalarTriggers() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  try {
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => {
      if (['alEditarTech', 'actualizarReportesTech'].includes(trigger.getHandlerFunction())) {
        ScriptApp.deleteTrigger(trigger);
      }
    });
    ScriptApp.newTrigger('alEditarTech').forSpreadsheet(ss).onEdit().create();
    ScriptApp.newTrigger('actualizarReportesTech').timeBased().everyHours(1).create();
    ss.toast('✅ Triggers instalados', 'OK', 3);
    ui.alert('✅ Triggers instalados', 'alEditarTech (onEdit) instalado correctamente.\nLas automatizaciones ya funcionan.', ui.ButtonSet.OK);
    return true;
  } catch (e) {
    ui.alert('❌ Error instalando triggers', e.message + '\n\nVe a Extensiones → Apps Script → Triggers y agrega manualmente:\nFunción: alEditarTech\nEvento: Al editar', ui.ButtonSet.OK);
    return false;
  }
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
  // Estado vacío para que usuario elija "Entrevista realizada" o "No interesado"
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

  actualizarReportesTech();
  ss.toast('✅ Datos eliminados', 'OK', 4);
}

/**
 * =====================================================================
 * DESINSTALAR SISTEMA COMPLETO
 * =====================================================================
 * Elimina todas las hojas del sistema excepto "Copy of CREAMOS ID nuevo"
 * y elimina todos los triggers automáticos.
 *
 * ⚠️ ADVERTENCIA: Esta acción NO se puede deshacer.
 *
 * MANTIENE:
 * - La hoja "Copy of CREAMOS ID nuevo" (datos de Salesforce)
 *
 * ELIMINA:
 * - Todas las hojas del sistema (Hoja de Interés, Entrevistas, etc.)
 * - Todas las hojas de cohortes individuales
 * - Todos los triggers automáticos
 * =====================================================================
 */
function desinstalarSistema() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  // ===== PRIMERA CONFIRMACIÓN =====
  const resp1 = ui.alert(
    '⚠️ DESINSTALAR SISTEMA',
    '⛔ ADVERTENCIA: Esta acción eliminará TODAS las hojas del sistema.\n\n' +
    '✅ SE MANTENDRÁ:\n' +
    '   • "Copy of CREAMOS ID nuevo" (datos de Salesforce)\n\n' +
    '❌ SE ELIMINARÁ:\n' +
    '   • Hoja de Interés\n' +
    '   • Entrevistas y Detalle Entrevistas\n' +
    '   • Inscritx, Graduadx, Retiradx, No Inscritx\n' +
    '   • Cohortes y todas las hojas de cohortes\n' +
    '   • Lista Definitiva\n' +
    '   • Reportes y Reportes Mensuales\n' +
    '   • Guía de Uso\n' +
    '   • Todos los triggers automáticos\n\n' +
    '⚠️ Esta acción NO se puede deshacer.\n\n' +
    '¿Estás segurx de que quieres continuar?',
    ui.ButtonSet.YES_NO
  );

  if (resp1 !== ui.Button.YES) {
    ss.toast('❌ Desinstalación cancelada', 'Cancelado', 3);
    return;
  }

  // ===== SEGUNDA CONFIRMACIÓN =====
  const resp2 = ui.alert(
    '⚠️ CONFIRMACIÓN FINAL',
    '🔴 ÚLTIMA ADVERTENCIA 🔴\n\n' +
    'Se eliminarán TODAS las hojas del sistema.\n' +
    'Solo se mantendrá "Copy of CREAMOS ID nuevo".\n\n' +
    '⚠️ NO podrás recuperar los datos eliminados.\n\n' +
    '¿Confirmas que quieres DESINSTALAR el sistema?',
    ui.ButtonSet.YES_NO
  );

  if (resp2 !== ui.Button.YES) {
    ss.toast('❌ Desinstalación cancelada', 'Cancelado', 3);
    return;
  }

  // ===== PREGUNTA SOBRE COPIA DE SEGURIDAD =====
  const respCopia = ui.alert(
    '💾 Copia de Seguridad',
    '¿Deseas hacer una COPIA DE SEGURIDAD del archivo antes de desinstalar?\n\n' +
    'La copia incluirá todos los datos actuales y se guardará en tu Google Drive.\n\n' +
    '💡 Recomendado: SÍ (podrás recuperar datos si es necesario)',
    ui.ButtonSet.YES_NO
  );

  if (respCopia === ui.Button.YES) {
    ss.toast('💾 Creando copia de seguridad...', 'Respaldo', 5);
    try {
      const nombreCopia = 'BACKUP - ' + ss.getName() + ' - ' + Utilities.formatDate(new Date(), 'GMT-6', 'yyyy-MM-dd HH-mm');
      const archivo = DriveApp.getFileById(ss.getId());
      const copia = archivo.makeCopy(nombreCopia);
      ss.toast('✅ Copia creada: ' + nombreCopia, 'Respaldo Exitoso', 5);
      Logger.log('✅ Copia de seguridad creada: ' + nombreCopia + ' (ID: ' + copia.getId() + ')');
    } catch (errorCopia) {
      ui.alert('⚠️ Error al crear copia', 'No se pudo crear la copia de seguridad:\n' + errorCopia.message + '\n\n¿Deseas continuar con la desinstalación de todos modos?', ui.ButtonSet.OK);
    }
  }

  ss.toast('🗑️ Desinstalando sistema...', 'Desinstalación', -1);

  try {
    // ===== PASO 1: Eliminar solo triggers específicos del sistema =====
    const triggers = ScriptApp.getProjectTriggers();
    let triggersEliminados = 0;
    triggers.forEach(trigger => {
      // Solo eliminar triggers específicos del sistema (alEditarTech y actualizarReportesTech)
      if (['alEditarTech', 'actualizarReportesTech'].includes(trigger.getHandlerFunction())) {
        ScriptApp.deleteTrigger(trigger);
        triggersEliminados++;
      }
    });
    Logger.log('✅ Triggers del sistema eliminados: ' + triggersEliminados + ' de ' + triggers.length + ' totales');

    // ===== PASO 2: Lista de hojas del sistema a eliminar =====
    const hojasDelSistema = [
      'Hoja de Interés',
      'Entrevistas',
      'Detalle Entrevistas',
      'Inscritx',
      'Cohortes',
      'Graduadx',
      'Retiradx',
      'No Inscritx',
      'Lista Definitiva',
      'Reporte',
      'Reportes Mensuales',
      'Guía de Uso'
    ];

    let hojasEliminadas = 0;

    // ===== PASO 3: Eliminar hojas principales del sistema =====
    hojasDelSistema.forEach(nombre => {
      const hoja = ss.getSheetByName(nombre);
      if (hoja) {
        ss.deleteSheet(hoja);
        hojasEliminadas++;
        Logger.log('✅ Hoja eliminada: ' + nombre);
      }
    });

    // ===== PASO 4: Eliminar hojas de cohortes individuales =====
    // Las hojas de cohortes NO están en la lista fija porque se crean dinámicamente

    // IMPORTANTE: Asegurar que existe al menos una hoja visible
    // Verificar si "Copy of CREAMOS ID nuevo" existe
    let hojaProtegida = ss.getSheetByName('Copy of CREAMOS ID nuevo');

    if (hojaProtegida) {
      // Si existe pero está oculta, hacerla visible
      if (hojaProtegida.isSheetHidden()) {
        hojaProtegida.showSheet();
        Logger.log('✅ "Copy of CREAMOS ID nuevo" estaba oculta, ahora visible');
      }
    } else {
      // Si no existe, buscar Sheet1 o Hoja 1
      const hojaSheet1 = ss.getSheetByName('Sheet1');
      const hojaHoja1 = ss.getSheetByName('Hoja 1');

      if (!hojaSheet1 && !hojaHoja1) {
        // Crear hoja temporal si no existe ninguna
        Logger.log('⚠️ No existe hoja protegida. Creando "Hoja 1" temporal...');
        const hojaTemporal = ss.insertSheet('Hoja 1');
        Logger.log('✅ Hoja temporal creada: Hoja 1');
      } else if (hojaSheet1 && hojaSheet1.isSheetHidden()) {
        hojaSheet1.showSheet();
        Logger.log('✅ "Sheet1" estaba oculta, ahora visible');
      } else if (hojaHoja1 && hojaHoja1.isSheetHidden()) {
        hojaHoja1.showSheet();
        Logger.log('✅ "Hoja 1" estaba oculta, ahora visible');
      }
    }

    // Obtener lista actualizada de hojas DESPUÉS de asegurar que hay una visible
    const todasLasHojas = ss.getSheets();
    const hojasCohortesEliminadas = [];

    todasLasHojas.forEach(hoja => {
      const nombre = hoja.getName();

      // NO eliminar "Copy of CREAMOS ID nuevo"
      if (nombre === 'Copy of CREAMOS ID nuevo') {
        Logger.log('✅ Hoja protegida (NO eliminada): ' + nombre);
        return;
      }

      // NO eliminar "Sheet1" (hoja por defecto de Google Sheets)
      if (nombre === 'Sheet1' || nombre === 'Hoja 1') {
        Logger.log('✅ Hoja por defecto (NO eliminada): ' + nombre);
        return;
      }

      // Eliminar cualquier otra hoja (probablemente cohortes)
      if (!hojasDelSistema.includes(nombre)) {
        ss.deleteSheet(hoja);
        hojasCohortesEliminadas.push(nombre);
        hojasEliminadas++;
        Logger.log('✅ Hoja de cohorte eliminada: ' + nombre);
      }
    });

    // ===== PASO 5: Verificar que "Copy of CREAMOS ID nuevo" sigue existiendo =====
    hojaProtegida = ss.getSheetByName('Copy of CREAMOS ID nuevo');
    if (!hojaProtegida) {
      Logger.log('⚠️ ADVERTENCIA: "Copy of CREAMOS ID nuevo" no existe o fue eliminada');
    } else {
      Logger.log('✅ "Copy of CREAMOS ID nuevo" está intacta');
    }

    // ===== PASO 6: Mensaje final =====
    let mensaje = '✅ SISTEMA DESINSTALADO\n\n' +
                  '📊 Hojas eliminadas: ' + hojasEliminadas + '\n' +
                  '⏰ Triggers eliminados: ' + triggers.length + '\n\n' +
                  '✅ Hoja protegida mantenida:\n' +
                  '   • "Copy of CREAMOS ID nuevo"\n\n';

    if (hojasCohortesEliminadas.length > 0) {
      mensaje += '📋 Hojas de cohortes eliminadas:\n';
      hojasCohortesEliminadas.forEach(nombre => {
        mensaje += '   • ' + nombre + '\n';
      });
    }

    mensaje += '\n💡 Para reinstalar el sistema, ejecuta:\n' +
               '   Menú → 🚀 Instalación Completa';

    ui.alert('✅ Desinstalación Completada', mensaje, ui.ButtonSet.OK);

    ss.toast('✅ Sistema desinstalado correctamente', 'Completado', 5);

  } catch (error) {
    Logger.log('❌ Error en desinstalación: ' + error.message);
    ui.alert('❌ Error', 'Error durante la desinstalación:\n' + error.message, ui.ButtonSet.OK);
    ss.toast('❌ Error en la desinstalación', 'Error', 5);
  }
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
    hoja.getRange('B' + i).setFormula('=IF(E' + i + '<>"",ROW()-1,"")');
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

const NOMBRE_HOJA_CREAMOS_ID_TECH = 'Copy of CREAMOS ID nuevo'; // Modificado por petición del usuario

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
  let hoja = ss.getSheetByName(NOMBRE_HOJA_CREAMOS_ID_TECH);
  if (!hoja) {
    hoja = ss.insertSheet(NOMBRE_HOJA_CREAMOS_ID_TECH);
    Logger.log('Hoja "' + NOMBRE_HOJA_CREAMOS_ID_TECH + '" creada.');

    // Establecer headers
    const headers = [
      'Nombre completo',
      'Creamos ID',
      'Año que entró Creamos',
      'Age',
      'Numero de DPI',
      'Nivel Educativo',
      'Zona'
    ];
    hoja.getRange(1, 1, 1, headers.length).setValues([headers])
      .setBackground('#37474f')
      .setFontColor('white')
      .setFontWeight('bold')
      .setHorizontalAlignment('center');

    [200, 120, 120, 60, 150, 150, 120].forEach((w, i) => {
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

  ss.toast('✅ Hoja "' + NOMBRE_HOJA_CREAMOS_ID_TECH + '" configurada: oculta y protegida', 'CREAMOS ID', 5);
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

function _normalizarNombreBusqueda(nombre) {
  if (!nombre) return '';
  return nombre.toString().trim().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}

function autocompletarDesdeCreamosID(silencioso) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = silencioso ? null : SpreadsheetApp.getUi();

  const hojaInteres = ss.getSheetByName('Hoja de Interés');
  const hojaDirectorio = ss.getSheetByName(NOMBRE_HOJA_CREAMOS_ID_TECH);

  if (!hojaDirectorio) {
    if (!silencioso) ui.alert('⚠️ Hoja no encontrada',
      'La hoja "' + NOMBRE_HOJA_CREAMOS_ID_TECH + '" no existe.\nEjecuta primero "Configurar Hoja CREAMOS ID" desde el menú.',
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
      'La hoja "' + NOMBRE_HOJA_CREAMOS_ID_TECH + '" no tiene datos.\nImporta los datos desde Salesforce primero.',
      ui.ButtonSet.OK);
    return;
  }

  // Construir índices de búsqueda desde el directorio maestro
  // Directorio: col 0=Nombre, 1=CreamosID, 2=Año, 3=Age, 4=DPI, 5=NivelEducativo, 6=Zona
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
    if (nombre) mapPorNombre.set(_normalizarNombreBusqueda(nombre), fila);
  }

  let completados = 0;
  let sinCoincidencia = 0;

  // Hoja de Interés: A=FechaRegistro, B=No, C=CreamosID, D=DPI, E=NombreCompleto, F=Género, G=Edad, H=Tel, I=NivelEducativo, J=Zona
  for (let i = 1; i < datosInteres.length; i++) {
    const fila = datosInteres[i];
    const creamosIdActual = fila[2] ? fila[2].toString().trim() : '';
    const dpiActual = fila[3] ? fila[3].toString().trim() : '';
    const nombreActual = fila[4] ? fila[4].toString().trim() : '';
    const edadActual = fila[6] ? fila[6].toString().trim() : '';
    const nivelEducativoActual = fila[8] ? fila[8].toString().trim() : '';
    const zonaActual = fila[9] ? fila[9].toString().trim() : '';

    // Fila vacía
    if (!nombreActual && !creamosIdActual && !dpiActual) continue;

    let filaDirectorio = null;

    if (creamosIdActual) {
      filaDirectorio = mapPorCreamosId.get(creamosIdActual.toUpperCase()) || null;
    } else {
      if (dpiActual) {
        filaDirectorio = mapPorDpi.get(dpiActual) || null;
      }
      if (!filaDirectorio && nombreActual) {
        // Búsqueda fuzzy: sin tildes, sin importar mayúsculas
        filaDirectorio = mapPorNombre.get(_normalizarNombreBusqueda(nombreActual)) || null;
      }
    }

    const filaNum = i + 1;
    const celdaCreamosID = hojaInteres.getRange(filaNum, 3);

    if (!filaDirectorio) {
      sinCoincidencia++;
      // Solo marcar en naranja si hay nombre pero no hay Creamos ID
      if (nombreActual && !creamosIdActual) {
        celdaCreamosID.setBackground('#FFE0B2').setValue('⚠️ Crear en Salesforce');
      }
      continue;
    }

    // Si tenía cualquier placeholder (⚠️ Crear perfil, ⚠️ Crear en Salesforce…), limpiarlo
    const valorActualC = celdaCreamosID.getValue().toString();
    if (valorActualC.startsWith('⚠️')) {
      celdaCreamosID.clearContent().setBackground(null);
    }

    const nombreDirectorio = filaDirectorio[0] ? filaDirectorio[0].toString().trim() : '';
    const creamosIdDirectorio = filaDirectorio[1] ? filaDirectorio[1].toString().trim() : '';
    const ageDirectorio = filaDirectorio[3] ? filaDirectorio[3].toString().trim() : '';
    const dpiDirectorio = filaDirectorio[4] ? filaDirectorio[4].toString().trim() : '';
    const nivelEducativoDirectorio = filaDirectorio[5] ? filaDirectorio[5].toString().trim() : '';
    const zonaDirectorio = filaDirectorio[6] ? filaDirectorio[6].toString().trim() : '';

    let actualizado = false;

    // ⚠️ NUNCA SOBRESCRIBIR - Solo rellenar campos VACÍOS
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
      hojaInteres.getRange(filaNum, 7).setValue(ageDirectorio);
      actualizado = true;
    }

    // Rellenar Nivel Educativo si está vacío
    if (!nivelEducativoActual && nivelEducativoDirectorio) {
      hojaInteres.getRange(filaNum, 9).setValue(nivelEducativoDirectorio);
      actualizado = true;
    }

    // Rellenar Zona si está vacía
    if (!zonaActual && zonaDirectorio) {
      hojaInteres.getRange(filaNum, 10).setValue(zonaDirectorio);
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
 * Detecta automáticamente las columnas del Directorio CREAMOS ID por nombre.
 * Busca en los encabezados (fila 1) y devuelve un objeto con los índices.
 * @returns {object} - {nombre, creamosId, dpi, edad, nivelEducativo, zona} con índices 0-based, o -1 si no existe
 */
function detectarColumnasDirectorio() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hojaDirectorio = ss.getSheetByName(NOMBRE_HOJA_CREAMOS_ID_TECH);

  if (!hojaDirectorio) return null;

  const encabezados = hojaDirectorio.getRange(1, 1, 1, hojaDirectorio.getLastColumn()).getValues()[0];
  const colMap = {
    nombre: -1,
    creamosId: -1,
    dpi: -1,
    edad: -1,
    nivelEducativo: -1,
    zona: -1
  };

  // Buscar cada columna por nombre (case-insensitive, ignora espacios extra)
  for (let i = 0; i < encabezados.length; i++) {
    const header = encabezados[i].toString().trim().toLowerCase();

    // Nombre: puede ser "Nombre", "Nombre Completo", "Full Name", etc.
    if (header.includes('nombre') && !header.includes('cohorte')) {
      colMap.nombre = i;
    }
    // Creamos ID: puede ser "Creamos ID", "CreamosID", "CREAMOS ID", etc.
    else if (header.replace(/\s+/g, '').toLowerCase().includes('creamosid')) {
      colMap.creamosId = i;
    }
    // DPI
    else if (header === 'dpi') {
      colMap.dpi = i;
    }
    // Edad: puede ser "Edad", "Age", etc.
    else if (header === 'edad' || header === 'age') {
      colMap.edad = i;
    }
    // Nivel Educativo: puede tener espacios o no
    else if (header.includes('nivel') && header.includes('educativo')) {
      colMap.nivelEducativo = i;
    }
    // Zona
    else if (header === 'zona') {
      colMap.zona = i;
    }
  }

  return colMap;
}

/**
 * Autocompleta una fila específica desde el Directorio CREAMOS ID
 * Solo rellena campos vacíos - no sobreescribe datos existentes
 *
 * @param {Sheet} sheet - La hoja donde está la fila
 * @param {number} numFila - Número de fila (1-indexed)
 * @param {object} colMap - Mapa de columnas: {creamosId, dpi, nombre, edad, nivelEducativo, zona}
 * @returns {boolean} - true si se actualizó algo, false si no
 */
function autocompletarFilaDesdeDirectorio(sheet, numFila, colMap) {
  if (!sheet || numFila < 2) return false;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hojaDirectorio = ss.getSheetByName(NOMBRE_HOJA_CREAMOS_ID_TECH);

  // Si no existe el directorio, no hacer nada
  if (!hojaDirectorio) {
    Logger.log('⚠️ Directorio no encontrado: ' + NOMBRE_HOJA_CREAMOS_ID_TECH);
    return false;
  }

  const datosDirectorio = hojaDirectorio.getDataRange().getValues();
  if (datosDirectorio.length < 2) {
    Logger.log('⚠️ Directorio vacío');
    return false;
  }

  // *** NUEVO: Detectar columnas del directorio automáticamente ***
  const colMapDir = detectarColumnasDirectorio();
  if (!colMapDir) {
    Logger.log('⚠️ No se pudieron detectar columnas del directorio');
    return false;
  }

  // Construir arrays para búsqueda fuzzy
  const filasDirectorio = [];

  for (let i = 1; i < datosDirectorio.length; i++) {
    const f = datosDirectorio[i];
    const nombre    = colMapDir.nombre >= 0 && f[colMapDir.nombre] ? f[colMapDir.nombre].toString().trim() : '';
    const creamosId = colMapDir.creamosId >= 0 && f[colMapDir.creamosId] ? f[colMapDir.creamosId].toString().trim() : '';
    const dpi       = colMapDir.dpi >= 0 && f[colMapDir.dpi] ? f[colMapDir.dpi].toString().trim() : '';
    if (creamosId || dpi || nombre) {
      filasDirectorio.push({ nombre, creamosId, dpi, fila: f });
    }
  }

  Logger.log('📚 Directorio cargado: ' + filasDirectorio.length + ' registros');

  // Leer la fila actual
  const maxCol = Math.max(
    colMap.creamosId >= 0 ? colMap.creamosId + 1 : 0,
    colMap.dpi >= 0 ? colMap.dpi + 1 : 0,
    colMap.nombre >= 0 ? colMap.nombre + 1 : 0,
    colMap.edad >= 0 ? colMap.edad + 1 : 0,
    colMap.nivelEducativo >= 0 ? colMap.nivelEducativo + 1 : 0,
    colMap.zona >= 0 ? colMap.zona + 1 : 0
  );

  if (maxCol === 0) {
    Logger.log('⚠️ No se encontraron columnas relevantes en la hoja');
    return false;
  }

  const fila = sheet.getRange(numFila, 1, 1, maxCol).getValues()[0];

  const cId = colMap.creamosId >= 0 ? (fila[colMap.creamosId] || '').toString().trim() : '';
  const esPlaceholderCId = cId.startsWith('⚠️') || cId.toLowerCase().includes('salesforce');
  const cIdSearch = esPlaceholderCId ? '' : cId;
  const dpi = colMap.dpi >= 0 ? (fila[colMap.dpi] || '').toString().trim() : '';
  const nom = colMap.nombre >= 0 ? (fila[colMap.nombre] || '').toString().trim() : '';
  const ed  = colMap.edad >= 0 ? (fila[colMap.edad] || '').toString().trim() : '';
  const nvl = colMap.nivelEducativo >= 0 ? (fila[colMap.nivelEducativo] || '').toString().trim() : '';
  const zn  = colMap.zona >= 0 ? (fila[colMap.zona] || '').toString().trim() : '';

  Logger.log('   Buscando: cId="' + (esPlaceholderCId ? '(placeholder)' : cId) + '", dpi="' + dpi + '", nom="' + nom + '"');

  // Buscar en directorio: CreamosID (exacto) → DPI (exacto) → Nombre (fuzzy)
  let filaDir = null;
  let metodo = '';

  // 1. Buscar por Creamos ID exacto (se omite si es placeholder "⚠️ Crear en Salesforce")
  if (cIdSearch) {
    Logger.log('   → Buscando por Creamos ID (exacto): ' + cIdSearch);
    filaDir = filasDirectorio.find(r => normalizarBusqueda(r.creamosId) === normalizarBusqueda(cIdSearch));
    if (filaDir) {
      Logger.log('   ✓ Encontrado por Creamos ID exacto');
      metodo = 'Creamos ID exacto';
    }
  }

  // 2. Buscar por DPI exacto
  if (!filaDir && dpi) {
    Logger.log('   → Buscando por DPI (exacto): ' + dpi);
    filaDir = filasDirectorio.find(r => r.dpi === dpi);
    if (filaDir) {
      Logger.log('   ✓ Encontrado por DPI exacto');
      metodo = 'DPI exacto';
    }
  }

  // 3. Buscar por Nombre con FUZZY MATCHING seguro (word-based)
  if (!filaDir && nom) {
    Logger.log('   → Buscando por Nombre (word-fuzzy): ' + nom);
    let mejorCoincidencia = null;
    let mejorSimilitud = 0;
    let segundaMejor = 0;

    for (let registro of filasDirectorio) {
      const sim = similitudNombre(nom, registro.nombre);
      if (sim > mejorSimilitud) {
        segundaMejor = mejorSimilitud;
        mejorSimilitud = sim;
        mejorCoincidencia = registro;
      } else if (sim > segundaMejor) {
        segundaMejor = sim;
      }
    }

    // Umbral alto (85%) + detección de ambigüedad: si hay 2 candidatos cercanos, no autocompletar
    const UMBRAL_NOMBRE = 85;
    const UMBRAL_AMBIGUEDAD = 70;
    if (mejorSimilitud >= UMBRAL_NOMBRE) {
      if (segundaMejor >= UMBRAL_AMBIGUEDAD) {
        Logger.log('⚠️ Nombre ambiguo: dos candidatos con similitud alta (' + mejorSimilitud.toFixed(0) + '% y ' + segundaMejor.toFixed(0) + '%). Se requiere DPI o Creamos ID para confirmar.');
      } else {
        filaDir = mejorCoincidencia;
        Logger.log('   ✓ Encontrado por Nombre (' + mejorSimilitud.toFixed(0) + '% similar)');
        metodo = 'Nombre (' + mejorSimilitud.toFixed(0) + '%)';
      }
    } else {
      Logger.log('⚠️ Mejor coincidencia solo ' + mejorSimilitud.toFixed(0) + '% similar (necesita ≥' + UMBRAL_NOMBRE + '%)');
    }
  }

  if (!filaDir) {
    const idsAvailable = filasDirectorio.map(r => r.creamosId).filter(x => x).slice(0, 5).join(', ');
    Logger.log('⚠️ No encontrado. IDs disponibles: ' + idsAvailable);
    return false;
  }

  Logger.log('   📍 Método: ' + metodo);

  // Extraer datos DIRECTAMENTE del directorio (sin re-procesar)
  // Esto preserva acentos y caracteres especiales
  const nombreDir          = filaDir.nombre || '';
  const cIdDir             = filaDir.creamosId || '';
  const dpiDir             = filaDir.dpi || '';

  // Para otros datos (edad, zona, nivel educativo), extraer de filaDatos
  const filaDatos = filaDir.fila;
  const edadDir    = colMapDir.edad >= 0 && filaDatos[colMapDir.edad] ? filaDatos[colMapDir.edad].toString().trim() : '';
  const nivelEducativoDir = colMapDir.nivelEducativo >= 0 && filaDatos[colMapDir.nivelEducativo] ? filaDatos[colMapDir.nivelEducativo].toString().trim() : '';
  const zonaDir    = colMapDir.zona >= 0 && filaDatos[colMapDir.zona] ? filaDatos[colMapDir.zona].toString().trim() : '';

  Logger.log('   Datos encontrados: nombre="' + nombreDir + '", edad="' + edadDir + '", zona="' + zonaDir + '"');

  let actualizado = false;

  // Rellenar solo los campos vacíos
  if (colMap.nombre >= 0 && !nom && nombreDir) {
    sheet.getRange(numFila, colMap.nombre + 1).setValue(nombreDir);
    Logger.log('   ✓ Nombre actualizado: ' + nombreDir);
    actualizado = true;
  }
  if (colMap.creamosId >= 0 && (!cId || esPlaceholderCId) && cIdDir) {
    const celdaId = sheet.getRange(numFila, colMap.creamosId + 1);
    celdaId.setValue(cIdDir).setBackground(null); // quita color naranja del placeholder
    actualizado = true;
  }
  if (colMap.dpi >= 0 && !dpi && dpiDir) {
    sheet.getRange(numFila, colMap.dpi + 1).setValue(dpiDir);
    Logger.log('   ✓ DPI actualizado: ' + dpiDir);
    actualizado = true;
  }
  if (colMap.edad >= 0 && !ed && edadDir) {
    sheet.getRange(numFila, colMap.edad + 1).setValue(edadDir);
    Logger.log('   ✓ Edad actualizada: ' + edadDir);
    actualizado = true;
  }
  if (colMap.nivelEducativo >= 0 && !nvl && nivelEducativoDir) {
    sheet.getRange(numFila, colMap.nivelEducativo + 1).setValue(nivelEducativoDir);
    Logger.log('   ✓ Nivel Educativo actualizado: ' + nivelEducativoDir);
    actualizado = true;
  }
  if (colMap.zona >= 0 && !zn && zonaDir) {
    sheet.getRange(numFila, colMap.zona + 1).setValue(zonaDir);
    Logger.log('   ✓ Zona actualizada: ' + zonaDir);
    actualizado = true;
  }

  return actualizado;
}

/**
 * Actualiza datos faltantes desde el directorio CREAMOS ID en TODAS las hojas.
 * Usa fuzzy matching para nombres con errores ortográficos o acentos.
 * silencioso=true  → solo Logger.log (para triggers automáticos)
 * silencioso=false → muestra resumen en pantalla (botón del menú)
 */
function actualizarTodosDesdeDirectorio(silencioso) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = silencioso ? null : SpreadsheetApp.getUi();

  const hojaDirectorio = ss.getSheetByName(NOMBRE_HOJA_CREAMOS_ID_TECH);
  if (!hojaDirectorio) {
    if (!silencioso) ui.alert('⚠️ Directorio no encontrado',
      'La hoja "' + NOMBRE_HOJA_CREAMOS_ID_TECH + '" no existe.',
      ui.ButtonSet.OK);
    return;
  }

  const datosDirectorio = hojaDirectorio.getDataRange().getValues();
  if (datosDirectorio.length < 2) {
    if (!silencioso) ui.alert('ℹ️ Directorio vacío', 'Importa los datos desde Salesforce primero.', ui.ButtonSet.OK);
    return;
  }

  const colMapDir = detectarColumnasDirectorio();
  if (!colMapDir) {
    if (!silencioso) ui.alert('⚠️ Error en directorio', 'No se detectaron columnas del Directorio CREAMOS ID.', ui.ButtonSet.OK);
    return;
  }

  // Construir lista para fuzzy matching (igual que autocompletarFilaDesdeDirectorio)
  const filasDirectorio = [];
  for (let i = 1; i < datosDirectorio.length; i++) {
    const f = datosDirectorio[i];
    const nombre    = colMapDir.nombre    >= 0 && f[colMapDir.nombre]    ? f[colMapDir.nombre].toString().trim()    : '';
    const creamosId = colMapDir.creamosId >= 0 && f[colMapDir.creamosId] ? f[colMapDir.creamosId].toString().trim() : '';
    const dpi       = colMapDir.dpi       >= 0 && f[colMapDir.dpi]       ? f[colMapDir.dpi].toString().trim()       : '';
    if (creamosId || dpi || nombre) filasDirectorio.push({ nombre, creamosId, dpi, fila: f });
  }

  Logger.log('📚 Directorio cargado: ' + filasDirectorio.length + ' registros');

  /**
   * Busca una fila en el directorio con MÚLTIPLES ESTRATEGIAS para máxima cobertura
   * Nivel 1: Creamos ID exacto normalizado
   * Nivel 2: Creamos ID por prefijo
   * Nivel 3: DPI exacto
   * Nivel 4: Nombre fuzzy (70%+)
   * Nivel 5: Nombre parcial (uno de los apellidos coincide)
   */
  function buscarEnDirectorio(cId, dpi, nom) {
    let encontrado = null;

    // ─ NIVEL 1: Creamos ID exacto (normalizado) ─
    if (cId) {
      const cIdNorm = normalizarBusqueda(cId);
      encontrado = filasDirectorio.find(r => normalizarBusqueda(r.creamosId) === cIdNorm) || null;
      if (encontrado) {
        Logger.log('     ✓ Encontrado por CREAMOS ID exacto');
        return encontrado;
      }
    }

    // ─ NIVEL 2: Creamos ID por PREFIJO (primeros 3+ caracteres) ─
    if (cId && cId.length >= 3) {
      const cIdPrefix = normalizarBusqueda(cId).substring(0, 3);
      encontrado = filasDirectorio.find(r => normalizarBusqueda(r.creamosId).startsWith(cIdPrefix)) || null;
      if (encontrado) {
        Logger.log('     ✓ Encontrado por CREAMOS ID prefijo: ' + cIdPrefix);
        return encontrado;
      }
    }

    // ─ NIVEL 3: DPI exacto ─
    if (dpi) {
      encontrado = filasDirectorio.find(r => r.dpi === dpi) || null;
      if (encontrado) {
        Logger.log('     ✓ Encontrado por DPI exacto');
        return encontrado;
      }
    }

    // ─ NIVEL 4: Nombre por palabras (umbral 85%, con detección de ambigüedad) ─
    if (nom) {
      let mejorSim = 0, segundaSim = 0, mejorReg = null;
      for (const r of filasDirectorio) {
        const sim = similitudNombre(nom, r.nombre);
        if (sim > mejorSim) { segundaSim = mejorSim; mejorSim = sim; mejorReg = r; }
        else if (sim > segundaSim) { segundaSim = sim; }
      }
      if (mejorSim >= 85) {
        if (segundaSim >= 70) {
          Logger.log('     ⚠️ Nombre ambiguo (' + mejorSim.toFixed(0) + '% y ' + segundaSim.toFixed(0) + '%): requiere DPI o Creamos ID');
        } else {
          Logger.log('     ✓ Encontrado por Nombre (' + mejorSim.toFixed(0) + '% similar)');
          return mejorReg;
        }
      }
      if (mejorReg) Logger.log('     ℹ️ Mejor por nombre: "' + mejorReg.nombre + '" (' + mejorSim.toFixed(0) + '%, necesita ≥85%)');
    }

    // ─ NIVEL 5: eliminado (búsqueda parcial por apellido causaba falsos positivos) ─

    Logger.log('     ⚠️ NO ENCONTRADO. Búsqueda completada en 5 niveles sin coincidencias.');
    return null;
  }


  /**
   * Recorre una hoja completa y rellena celdas vacías desde el directorio.
   * Detecta automáticamente las columnas por nombre de encabezado.
   */
  function completarHoja(sheet) {
    if (!sheet) return 0;

    const encabezados = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const colIdx = {};
    encabezados.forEach((h, i) => {
      const k = h.toString().trim().toLowerCase().replace(/\s+/g, '');
      colIdx[k] = i;
    });

    const getColi = function() {
      const claves = Array.prototype.slice.call(arguments);
      for (let ki = 0; ki < claves.length; ki++) { const k = claves[ki]; if (colIdx[k] !== undefined) return colIdx[k]; }
      return -1;
    };

    const iCId  = getColi('creamosid', 'creamos id');
    const iDpi  = getColi('dpi', 'numerodedpi', 'numero de dpi');
    const iNom  = getColi('nombrecompleto', 'nombre completo', 'nombre');
    const iEd   = getColi('edad', 'age');
    const iNvl  = getColi('niveleducativo', 'nivel educativo');
    const iZona = getColi('zona');

    if (iCId < 0 && iNom < 0) return 0;  // hoja sin columnas relevantes

    const lastRow = sheet.getLastRow();
    if (lastRow < 2) return 0;

    const datos = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();
    let actualizados = 0;

    for (let i = 0; i < datos.length; i++) {
      const fila = datos[i];
      const cId  = iCId  >= 0 ? (fila[iCId]  || '').toString().trim() : '';
      const esPlaceholder = cId.startsWith('⚠️') || cId.toLowerCase().includes('salesforce');
      const cIdSearch = esPlaceholder ? '' : cId;
      const dpi  = iDpi  >= 0 ? (fila[iDpi]  || '').toString().trim() : '';
      const nom  = iNom  >= 0 ? (fila[iNom]  || '').toString().trim() : '';

      if (!cIdSearch && !dpi && !nom) continue;  // fila vacía

      const reg = buscarEnDirectorio(cIdSearch, dpi, nom);
      if (!reg) continue;

      const filaDatos  = reg.fila;
      const nombreDir  = reg.nombre;
      const cIdDir     = reg.creamosId;
      const dpiDir     = reg.dpi;
      const edadDir    = colMapDir.edad >= 0 && filaDatos[colMapDir.edad] ? filaDatos[colMapDir.edad].toString().trim() : '';
      const nivelDir   = colMapDir.nivelEducativo >= 0 && filaDatos[colMapDir.nivelEducativo] ? filaDatos[colMapDir.nivelEducativo].toString().trim() : '';
      const zonaDir    = colMapDir.zona >= 0 && filaDatos[colMapDir.zona] ? filaDatos[colMapDir.zona].toString().trim() : '';

      const filaNum = i + 2;  // +2 porque empezamos en fila 2 y i es 0-based
      let cambio = false;

      if (iNom  >= 0 && !nom  && nombreDir)  { sheet.getRange(filaNum, iNom  + 1).setValue(nombreDir);  cambio = true; }
      if (iCId  >= 0 && (!cId || esPlaceholder) && cIdDir) { sheet.getRange(filaNum, iCId  + 1).setValue(cIdDir);     cambio = true; }
      if (iDpi  >= 0 && !dpi  && dpiDir)     { sheet.getRange(filaNum, iDpi  + 1).setValue(dpiDir);     cambio = true; }
      if (iEd   >= 0 && !(fila[iEd]   || '').toString().trim() && edadDir)  { sheet.getRange(filaNum, iEd  + 1).setValue(edadDir);  cambio = true; }
      if (iNvl  >= 0 && !(fila[iNvl]  || '').toString().trim() && nivelDir)  { sheet.getRange(filaNum, iNvl + 1).setValue(normalizarNivelEducativo(nivelDir)); cambio = true; }
      if (iZona >= 0 && !(fila[iZona] || '').toString().trim() && zonaDir)  { sheet.getRange(filaNum, iZona+ 1).setValue(zonaDir);  cambio = true; }

      if (cambio) actualizados++;
    }

    return actualizados;
  }

  // ── Recorrer todas las hojas relevantes ──
  const hojas = ['Hoja de Interés', 'Entrevistas', 'Inscritx', 'No Inscritx', 'Retiradx', 'Graduadx', 'Lista Definitiva'];
  let total = 0;

  for (const nombreHoja of hojas) {
    if (!silencioso) ss.toast('🔄 Actualizando ' + nombreHoja + '...', 'Directorio', 3);
    const n = completarHoja(ss.getSheetByName(nombreHoja));
    Logger.log('   ' + nombreHoja + ': ' + n + ' celdas actualizadas');
    total += n;
  }

  // También actualizar hojas de cohortes
  const cohortesSheet = ss.getSheetByName('Cohortes');
  if (cohortesSheet) {
    const datosCohortes = cohortesSheet.getDataRange().getValues();
    for (let i = 1; i < datosCohortes.length; i++) {
      const nombreCohorte = datosCohortes[i][0] ? datosCohortes[i][0].toString().trim() : '';
      if (!nombreCohorte) continue;
      const hojaCohorte = ss.getSheetByName(nombreCohorte);
      if (!hojaCohorte) continue;
      if (!silencioso) ss.toast('🔄 Actualizando cohorte "' + nombreCohorte + '"...', 'Directorio', 3);
      const n = completarHoja(hojaCohorte);
      Logger.log('   Cohorte "' + nombreCohorte + '": ' + n + ' celdas actualizadas');
      total += n;
    }
  }

  const msg = '✅ Actualización completa: ' + total + ' celdas rellenadas';
  if (!silencioso) ui.alert('Actualizar desde CREAMOS ID', msg + '\n\n(Solo se rellenaron celdas vacías, no se borró nada)', ui.ButtonSet.OK);
  Logger.log(msg);
}

/**
 * Instala trigger para actualizar directorio automáticamente cada hora
 */
function instalarTriggerAutoDirectorio() {
  // Eliminar trigger anterior si existe
  desinstalarTriggerAutoDirectorio();

  ScriptApp.newTrigger('autoActualizarDirectorio')
    .timeBased()
    .everyHours(1)
    .create();

  SpreadsheetApp.getUi().alert(
    '✅ Auto-actualización activada',
    'El directorio se actualizará automáticamente cada hora.',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * Elimina el trigger de auto-actualización de directorio
 */
function desinstalarTriggerAutoDirectorio() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'autoActualizarDirectorio')
    .forEach(t => ScriptApp.deleteTrigger(t));
}

/**
 * Función llamada por el trigger automático (silenciosa)
 */
function autoActualizarDirectorio() {
  Logger.log('⏰ Auto-actualización de directorio iniciada: ' + new Date());
  actualizarTodosDesdeDirectorio(true);
  Logger.log('⏰ Auto-actualización de directorio completada');
}

/**
 * Diagnóstico: Muestra exactamente qué Creamos IDs se encontraron y cuáles NO en el directorio
 * Útil para identificar IDs mal escritos o problemáticos
 */
function diagnosticoAutocompletado() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  const sheet = ss.getSheetByName('Hoja de Interés');

  if (!sheet) {
    ui.alert('❌ No se encontró "Hoja de Interés"');
    return;
  }

  const hojaDirectorio = ss.getSheetByName(NOMBRE_HOJA_CREAMOS_ID_TECH);
  if (!hojaDirectorio) {
    ui.alert('❌ Directorio no encontrado');
    return;
  }

  const datosDirectorio = hojaDirectorio.getDataRange().getValues();
  const colMapDir = detectarColumnasDirectorio();

  // Cargar directorio
  const filasDir = [];
  for (let i = 1; i < datosDirectorio.length; i++) {
    const f = datosDirectorio[i];
    const nombre    = colMapDir.nombre >= 0 && f[colMapDir.nombre] ? f[colMapDir.nombre].toString().trim() : '';
    const creamosId = colMapDir.creamosId >= 0 && f[colMapDir.creamosId] ? f[colMapDir.creamosId].toString().trim() : '';
    if (creamosId || nombre) filasDir.push({ nombre, creamosId });
  }

  Logger.log('🔍 DIAGNÓSTICO DE AUTOCOMPLETADO');
  Logger.log('📚 Directorio: ' + filasDir.length + ' registros');

  // Analizar Hoja de Interés
  const encabezados = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const colIdx = {};
  encabezados.forEach((h, i) => {
    const k = h.toString().trim().toLowerCase().replace(/\s+/g, '');
    colIdx[k] = i;
  });

  const iCId = colIdx['creamosid'] || colIdx['creamos id'] || -1;
  const iNom = colIdx['nombrecompleto'] || colIdx['nombre completo'] || colIdx['nombre'] || -1;
  const iNomVacio = colIdx['nombre'] || colIdx['nombrecompleto'] || -1;

  if (iCId < 0) {
    ui.alert('❌ No se encontró columna "Creamos ID" en Hoja de Interés');
    return;
  }

  const datos = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  let encontrados = 0, noEncontrados = 0;
  const problemáticos = [];

  for (let i = 0; i < datos.length; i++) {
    const cId = iCId >= 0 ? (datos[i][iCId] || '').toString().trim() : '';
    const nom = iNom >= 0 ? (datos[i][iNom] || '').toString().trim() : '';

    if (!cId) continue;

    const encontrado = filasDir.find(r => normalizarBusqueda(r.creamosId) === normalizarBusqueda(cId));

    if (encontrado) {
      encontrados++;
      Logger.log('✓ Fila ' + (i+2) + ': "' + cId + '" → "' + encontrado.nombre + '" (OK)');
    } else {
      noEncontrados++;
      problemáticos.push({
        fila: i + 2,
        cId: cId,
        nom: nom,
        similar: filasDir
          .map(r => ({ id: r.creamosId, sim: similitud(cId, r.creamosId) }))
          .sort((a, b) => b.sim - a.sim)
          .slice(0, 2)
      });
      Logger.log('✗ Fila ' + (i+2) + ': "' + cId + '" NO ENCONTRADO');
    }
  }

  const msg =
    '📊 RESULTADO DEL DIAGNÓSTICO\n\n' +
    'Encontrados: ' + encontrados + ' ✓\n' +
    'NO encontrados: ' + noEncontrados + ' ✗\n\n' +
    (noEncontrados > 0 ? 'IDs PROBLEMÁTICOS:\n' + problemáticos.slice(0, 5).map(p =>
      'Fila ' + p.fila + ': "' + p.cId + '"\n' +
      '  Similares: ' + p.similar.map(s => s.id + ' (' + s.sim.toFixed(0) + '%)').join(', ')
    ).join('\n') + '\n\n' : '') +
    'Ver logs para detalles completos.';

  ui.alert('Diagnóstico de Autocompletado', msg, ui.ButtonSet.OK);
}

/**
 * Audita los Creamos IDs en TODAS las hojas del sistema.
 * Para cada fila con Creamos ID: verifica que exista en el directorio y que
 * el nombre de la hoja coincida con el nombre del directorio para ese ID.
 * Crea/actualiza la hoja "Auditoría IDs" con los resultados coloreados.
 */
function auditarCreamosIDsTech() {
  _auditarCreamosIDsEnSistema(NOMBRE_HOJA_CREAMOS_ID_TECH,
    ['Hoja de Interés', 'Entrevistas', 'Inscritx', 'No Inscritx', 'Retiradx', 'Graduadx']);
}

function _auditarCreamosIDsEnSistema(nombreDirectorio, nombresHojas) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  // --- Cargar directorio ---
  const hojaDir = ss.getSheetByName(nombreDirectorio);
  if (!hojaDir) { ui.alert('❌ Directorio no encontrado: ' + nombreDirectorio); return; }

  const colMapDir = detectarColumnasDirectorio();
  if (!colMapDir) { ui.alert('❌ No se pudieron detectar columnas del directorio.'); return; }

  const datosDir = hojaDir.getDataRange().getValues();
  const directorio = []; // [{creamosId, nombre, dpi}]
  const mapPorId = {};   // creamosId_normalizado → entrada

  for (let i = 1; i < datosDir.length; i++) {
    const f = datosDir[i];
    const nombre    = colMapDir.nombre    >= 0 ? (f[colMapDir.nombre]    || '').toString().trim() : '';
    const creamosId = colMapDir.creamosId >= 0 ? (f[colMapDir.creamosId] || '').toString().trim() : '';
    const dpi       = colMapDir.dpi       >= 0 ? (f[colMapDir.dpi]       || '').toString().trim() : '';
    if (creamosId || dpi || nombre) {
      const entrada = { nombre, creamosId, dpi };
      directorio.push(entrada);
      if (creamosId) mapPorId[normalizarBusqueda(creamosId)] = entrada;
    }
  }

  // --- Preparar hoja de resultados ---
  const NOMBRE_AUDITORIA = '🕵️ Auditoría IDs';
  let hojaAudit = ss.getSheetByName(NOMBRE_AUDITORIA);
  if (!hojaAudit) {
    hojaAudit = ss.insertSheet(NOMBRE_AUDITORIA);
  } else {
    hojaAudit.clearContents();
    hojaAudit.clearFormats();
  }

  const ENCABEZADOS = ['Hoja', 'Fila', 'Creamos ID en Hoja', 'Nombre en Hoja', 'Nombre en Directorio', 'DPI en Directorio', 'Estado', 'Problema'];
  hojaAudit.getRange(1, 1, 1, ENCABEZADOS.length).setValues([ENCABEZADOS])
    .setBackground('#37474F').setFontColor('#FFFFFF').setFontWeight('bold');

  const resultados = [];
  let totalOK = 0, totalSinID = 0, totalIDNoExiste = 0, totalNombreMal = 0;

  // --- Analizar cada hoja ---
  for (let nh = 0; nh < nombresHojas.length; nh++) {
    const nombreHoja = nombresHojas[nh];
    const hoja = ss.getSheetByName(nombreHoja);
    if (!hoja || hoja.getLastRow() < 2) continue;

    const encabezados = hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0];
    const idx = {};
    encabezados.forEach(function(h, i) {
      idx[h.toString().trim().toLowerCase().replace(/\s+/g, '')] = i;
    });

    const iCId = idx['creamosid'] !== undefined ? idx['creamosid'] :
                 idx['creamos id'] !== undefined ? idx['creamos id'] : -1;
    const iNom = idx['nombrecompleto'] !== undefined ? idx['nombrecompleto'] :
                 idx['nombre completo'] !== undefined ? idx['nombre completo'] :
                 idx['nombre'] !== undefined ? idx['nombre'] : -1;

    if (iCId < 0) continue; // hoja sin columna Creamos ID

    const datos = hoja.getRange(2, 1, hoja.getLastRow() - 1, hoja.getLastColumn()).getValues();

    for (let i = 0; i < datos.length; i++) {
      const cId  = (datos[i][iCId] || '').toString().trim();
      const nom  = iNom >= 0 ? (datos[i][iNom] || '').toString().trim() : '';
      const fila = i + 2;

      if (!cId) { totalSinID++; continue; }
      if (cId.startsWith('⚠️')) continue; // placeholder esperado

      const entrada = mapPorId[normalizarBusqueda(cId)] || null;

      if (!entrada) {
        // ID no existe en el directorio
        totalIDNoExiste++;
        resultados.push([nombreHoja, fila, cId, nom, '—', '—', '❌ ID no existe', 'Este Creamos ID no está en el directorio']);
      } else if (nom) {
        // Verificar que el nombre de la hoja coincida con el directorio
        const simNombre = similitudNombre(nom, entrada.nombre);
        if (simNombre < 65) {
          totalNombreMal++;
          resultados.push([nombreHoja, fila, cId, nom, entrada.nombre, entrada.dpi,
            '⚠️ Nombre no coincide',
            'Similitud ' + simNombre.toFixed(0) + '%. Posible ID asignado a persona equivocada']);
        } else {
          totalOK++;
          resultados.push([nombreHoja, fila, cId, nom, entrada.nombre, entrada.dpi, '✅ OK', '']);
        }
      } else {
        // Tiene ID pero no nombre — no podemos verificar nombre
        totalOK++;
        resultados.push([nombreHoja, fila, cId, '(sin nombre)', entrada.nombre, entrada.dpi, '✅ ID existe', '']);
      }
    }
  }

  // --- Escribir resultados ---
  if (resultados.length > 0) {
    hojaAudit.getRange(2, 1, resultados.length, ENCABEZADOS.length).setValues(resultados);

    // Colorear por estado
    for (let r = 0; r < resultados.length; r++) {
      const estado = resultados[r][6];
      let color = '#FFFFFF';
      if (estado === '❌ ID no existe')       color = '#FFCDD2'; // rojo claro
      else if (estado === '⚠️ Nombre no coincide') color = '#FFF9C4'; // amarillo claro
      else if (estado.startsWith('✅'))        color = '#E8F5E9'; // verde claro
      hojaAudit.getRange(r + 2, 1, 1, ENCABEZADOS.length).setBackground(color);
    }
  }

  // Ajustar columnas
  hojaAudit.autoResizeColumns(1, ENCABEZADOS.length);
  hojaAudit.setFrozenRows(1);

  // Resumen
  const resumen =
    '📊 AUDITORÍA COMPLETADA\n\n' +
    '✅ OK: ' + totalOK + ' registros\n' +
    '❌ ID no existe en directorio: ' + totalIDNoExiste + ' registros\n' +
    '⚠️ Nombre no coincide con ID: ' + totalNombreMal + ' registros\n\n' +
    (totalIDNoExiste + totalNombreMal > 0
      ? 'Revisa la hoja "' + NOMBRE_AUDITORIA + '" para ver el detalle.\n' +
        'Los registros ⚠️ AMARILLOS son los más urgentes: pueden tener\nel Creamos ID de otra persona.'
      : '¡Todo en orden! No se encontraron inconsistencias.');

  ss.setActiveSheet(hojaAudit);
  ui.alert('Auditoría de Creamos IDs', resumen, ui.ButtonSet.OK);
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

/**
 * Lee la hoja de Auditoría IDs y corrige automáticamente los Creamos IDs
 * incorrectos buscando por nombre en el directorio.
 * Solo corrige cuando hay una coincidencia clara (≥85%) y no ambigua.
 * Pide confirmación antes de aplicar cambios.
 */
function limpiarCreamosIDsIncorrectosTech() {
  _limpiarCreamosIDsIncorrectos(NOMBRE_HOJA_CREAMOS_ID_TECH);
}

function reporteSinCreamosIDTech() {
  _reporteSinCreamosID(NOMBRE_HOJA_CREAMOS_ID_TECH);
}

// Hojas internas del sistema que NUNCA se limpian (no contienen participantes)
const HOJAS_SISTEMA_EXCLUIR = [
  'Copy of CREAMOS ID nuevo', 'PowerBI_Export', 'EXPORT_PowerBI',
  'Reportes Mensuales', 'Dashboard Estipendios', 'Guía de Uso',
  'Registro Formulario Kobo', 'Detalle Entrevistas', 'Reporte',
  '🕵️ Auditoría IDs', 'DEBUG - Datos Kobo', 'DEBUG - Análisis Filtro',
  '🔍 Diagnóstico CSV', 'Paso a Paso'
];

/**
 * Devuelve todas las hojas del spreadsheet que tienen columna "Creamos ID"
 * y no son hojas internas del sistema ni el directorio.
 */
function _detectarHojasConCreamosID(ss, nombreDirectorio, forzarRefresh) {
  const cacheKey = 'hojas_cid_' + ss.getId() + '_' + nombreDirectorio;
  const cache = CacheService.getScriptCache();

  if (!forzarRefresh) {
    const cached = cache.get(cacheKey);
    if (cached) {
      try { return JSON.parse(cached); } catch(e) {}
    }
  }

  const todasLasHojas = ss.getSheets();
  const resultado = [];
  for (let i = 0; i < todasLasHojas.length; i++) {
    const hoja = todasLasHojas[i];
    const nombre = hoja.getName();
    if (nombre === nombreDirectorio) continue;
    if (HOJAS_SISTEMA_EXCLUIR.indexOf(nombre) >= 0) continue;
    const numCols = Math.min(hoja.getMaxColumns(), 60);
    if (numCols < 1) continue;
    const enc = hoja.getRange(1, 1, 1, numCols).getValues()[0];
    if (!enc.some(function(c) { return c !== ''; })) continue;
    const tieneId = enc.some(function(h) {
      const k = h.toString().trim().toLowerCase().replace(/\s+/g, '');
      return k === 'creamosid' || k === 'creamos id';
    });
    if (tieneId) resultado.push(nombre);
  }

  try { cache.put(cacheKey, JSON.stringify(resultado), 3600); } catch(e) {}
  return resultado;
}

/**
 * Recorre TODAS las hojas con Creamos ID y borra cualquier ID cuyo nombre
 * en la hoja no coincida con el nombre del directorio (similitud < 60%).
 * Muestra lista completa y pide confirmación antes de aplicar.
 */
function _limpiarCreamosIDsIncorrectos(nombreDirectorio) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  ss.toast('Cargando directorio...', 'Limpieza de IDs', -1);

  // ── 1. Cargar directorio ─────────────────────────────────────────────
  const hojaDir = ss.getSheetByName(nombreDirectorio);
  if (!hojaDir) { ss.toast('', '', 1); ui.alert('❌ Directorio no encontrado: ' + nombreDirectorio); return; }
  const colMapDir = detectarColumnasDirectorio();
  if (!colMapDir) { ss.toast('', '', 1); ui.alert('❌ No se detectaron columnas del directorio.'); return; }

  const datosDir = hojaDir.getDataRange().getValues();
  const mapPorId = {};
  for (let i = 1; i < datosDir.length; i++) {
    const f         = datosDir[i];
    const nombre    = colMapDir.nombre    >= 0 ? (f[colMapDir.nombre]    || '').toString().trim() : '';
    const creamosId = colMapDir.creamosId >= 0 ? (f[colMapDir.creamosId] || '').toString().trim() : '';
    const dpi       = colMapDir.dpi       >= 0 ? (f[colMapDir.dpi]       || '').toString().trim() : '';
    if (creamosId) mapPorId[normalizarBusqueda(creamosId)] = { nombre, creamosId, dpi };
  }
  Logger.log('🧹 LIMPIEZA — Directorio: ' + Object.keys(mapPorId).length + ' entradas');

  // ── 2. Detectar todas las hojas con Creamos ID ───────────────────────
  const nombresHojas = _detectarHojasConCreamosID(ss, nombreDirectorio);
  Logger.log('🧹 Hojas a revisar: ' + nombresHojas.join(', '));

  // ── 3. Revisar cada hoja ─────────────────────────────────────────────
  const aBorrar = [], aConservar = [];

  for (let nh = 0; nh < nombresHojas.length; nh++) {
    const nombreHoja = nombresHojas[nh];
    const hoja = ss.getSheetByName(nombreHoja);
    if (!hoja || hoja.getLastRow() < 2) continue;
    ss.toast('Revisando "' + nombreHoja + '"...', 'Limpieza de IDs', -1);

    const nCols       = hoja.getLastColumn();
    const encabezados = hoja.getRange(1, 1, 1, nCols).getValues()[0];
    const idx = {};
    encabezados.forEach(function(h, i) { idx[h.toString().trim().toLowerCase().replace(/\s+/g, '')] = i; });

    const iCId = idx['creamosid']       !== undefined ? idx['creamosid']       : idx['creamos id']      !== undefined ? idx['creamos id']      : -1;
    const iNom = idx['nombrecompleto']  !== undefined ? idx['nombrecompleto']  : idx['nombre completo'] !== undefined ? idx['nombre completo'] : idx['nombre'] !== undefined ? idx['nombre'] : -1;

    if (iCId < 0) continue;

    const datos = hoja.getRange(2, 1, hoja.getLastRow() - 1, nCols).getValues();
    for (let i = 0; i < datos.length; i++) {
      const cId = (datos[i][iCId] || '').toString().trim();
      const nom = iNom >= 0 ? (datos[i][iNom] || '').toString().trim() : '';
      if (!cId || cId.startsWith('⚠️') || !nom) continue;

      const entrada = mapPorId[normalizarBusqueda(cId)] || null;
      const fila    = i + 2;

      if (!entrada) {
        aBorrar.push({ hoja, nombreHoja, fila, colCId: iCId + 1, idActual: cId, nomHoja: nom, nomDir: '(no existe en directorio)', motivo: 'ID no existe en directorio' });
      } else {
        const sim = similitudNombre(nom, entrada.nombre);
        if (sim < 60) {
          aBorrar.push({ hoja, nombreHoja, fila, colCId: iCId + 1, idActual: cId, nomHoja: nom, nomDir: entrada.nombre, motivo: 'Nombre difiere ' + sim.toFixed(0) + '% — directorio: "' + entrada.nombre + '"' });
        } else {
          aConservar.push({ nombreHoja, fila, cId, nom });
        }
      }
    }
  }

  ss.toast('', '', 1);

  if (aBorrar.length === 0) {
    ui.alert('✅ Todo el sistema está limpio',
      'Hojas revisadas: ' + nombresHojas.length + '\n' +
      'Registros con ID verificados: ' + aConservar.length + '\n\n' +
      'No se encontraron IDs incorrectos.',
      ui.ButtonSet.OK);
    return;
  }

  // ── 4. Confirmación ──────────────────────────────────────────────────
  let msg = '🧹 IDs A BORRAR (' + aBorrar.length + ' encontrados en ' + nombresHojas.length + ' hojas):\n\n';
  aBorrar.slice(0, 15).forEach(function(b) {
    msg += '• ' + b.nombreHoja + ' fila ' + b.fila + ': "' + b.nomHoja + '"\n  ID: "' + b.idActual + '" → ' + b.motivo + '\n';
  });
  if (aBorrar.length > 15) msg += '... y ' + (aBorrar.length - 15) + ' más.\n';
  msg += '\n✅ IDs correctos que se conservan: ' + aConservar.length + '\n\n' +
         'Después ejecuta "🔁 Actualizar desde directorio" para rellenar\nlos IDs correctos por nombre.\n\n¿Confirmar?';

  if (ui.alert('Confirmar Limpieza Total', msg, ui.ButtonSet.YES_NO) !== ui.Button.YES) {
    ss.toast('Cancelado.', '', 4); return;
  }

  // ── 5. Aplicar ──────────────────────────────────────────────────────
  ss.toast('Aplicando limpieza...', 'Limpieza de IDs', -1);
  let borrados = 0, errores = 0;
  for (let b = 0; b < aBorrar.length; b++) {
    try {
      aBorrar[b].hoja.getRange(aBorrar[b].fila, aBorrar[b].colCId).clearContent();
      borrados++;
    } catch (e) { errores++; Logger.log('❌ ' + e.message); }
  }
  ss.toast('', '', 1);
  ui.alert('Limpieza completada',
    '🗑️ IDs borrados: ' + borrados + '\n' +
    '✅ IDs correctos conservados: ' + aConservar.length + '\n' +
    (errores > 0 ? '❌ Errores: ' + errores + '\n' : '') +
    '\nAhora ejecuta "🔁 Actualizar desde directorio" para poner los IDs correctos.',
    ui.ButtonSet.OK);
}

/**
 * Genera la hoja "📋 Sin Creamos ID" con todas las personas que no tienen
 * Creamos ID en ninguna hoja del sistema, agrupadas por hoja.
 */
function _reporteSinCreamosID(nombreDirectorio) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  ss.toast('Buscando personas sin Creamos ID...', 'Reporte', -1);

  const nombresHojas = _detectarHojasConCreamosID(ss, nombreDirectorio);

  const NOMBRE_REPORTE = '📋 Sin Creamos ID';
  let hojaReporte = ss.getSheetByName(NOMBRE_REPORTE);
  if (!hojaReporte) { hojaReporte = ss.insertSheet(NOMBRE_REPORTE); }
  else { hojaReporte.clearContents(); hojaReporte.clearFormats(); }

  const ENC = ['Hoja', 'Fila', 'Nombre', 'DPI', 'Estado / Motivo'];
  hojaReporte.getRange(1, 1, 1, ENC.length).setValues([ENC])
    .setBackground('#1565C0').setFontColor('#FFFFFF').setFontWeight('bold');

  const filas = [];
  let totalSinId = 0;

  for (let nh = 0; nh < nombresHojas.length; nh++) {
    const nombreHoja = nombresHojas[nh];
    const hoja = ss.getSheetByName(nombreHoja);
    if (!hoja || hoja.getLastRow() < 2) continue;
    ss.toast('Revisando "' + nombreHoja + '"...', 'Reporte', -1);

    const nCols       = hoja.getLastColumn();
    const encabezados = hoja.getRange(1, 1, 1, nCols).getValues()[0];
    const idx = {};
    encabezados.forEach(function(h, i) { idx[h.toString().trim().toLowerCase().replace(/\s+/g, '')] = i; });

    const iCId    = idx['creamosid']       !== undefined ? idx['creamosid']       : idx['creamos id']      !== undefined ? idx['creamos id']      : -1;
    const iNom    = idx['nombrecompleto']  !== undefined ? idx['nombrecompleto']  : idx['nombre completo'] !== undefined ? idx['nombre completo'] : idx['nombre'] !== undefined ? idx['nombre'] : -1;
    const iDpi    = idx['dpi']             !== undefined ? idx['dpi']             : idx['numerodedpi']     !== undefined ? idx['numerodedpi']     : -1;
    const iEstado = idx['estado']          !== undefined ? idx['estado']          : -1;

    if (iNom < 0) continue; // sin columna nombre, ignorar

    const datos = hoja.getRange(2, 1, hoja.getLastRow() - 1, nCols).getValues();
    let contHoja = 0;

    for (let i = 0; i < datos.length; i++) {
      const nom    = iNom    >= 0 ? (datos[i][iNom]    || '').toString().trim() : '';
      const cId    = iCId    >= 0 ? (datos[i][iCId]    || '').toString().trim() : '';
      const dpi    = iDpi    >= 0 ? (datos[i][iDpi]    || '').toString().trim() : '';
      const estado = iEstado >= 0 ? (datos[i][iEstado] || '').toString().trim() : '';

      if (!nom) continue; // fila vacía
      if (cId && cId !== '⚠️ Crear en Salesforce') continue; // ya tiene ID

      const nota = cId.startsWith('⚠️') ? cId : 'Sin Creamos ID';
      filas.push([nombreHoja, i + 2, nom, dpi, nota + (estado ? ' | Estado: ' + estado : '')]);
      contHoja++;
      totalSinId++;
    }

    if (contHoja > 0) Logger.log('📋 "' + nombreHoja + '": ' + contHoja + ' sin Creamos ID');
  }

  ss.toast('', '', 1);

  if (filas.length === 0) {
    hojaReporte.getRange(2, 1).setValue('✅ Todas las personas tienen Creamos ID asignado.');
    ss.setActiveSheet(hojaReporte);
    ui.alert('✅ Sin pendientes', 'Todas las personas en el sistema ya tienen Creamos ID.', ui.ButtonSet.OK);
    return;
  }

  hojaReporte.getRange(2, 1, filas.length, ENC.length).setValues(filas);

  // Colorear separadores por hoja
  let hojaActual = '', colorFila = '#E3F2FD';
  for (let r = 0; r < filas.length; r++) {
    if (filas[r][0] !== hojaActual) {
      hojaActual = filas[r][0];
      colorFila  = colorFila === '#E3F2FD' ? '#FFF8E1' : '#E3F2FD';
    }
    const color = filas[r][4].startsWith('⚠️') ? '#FFE0B2' : colorFila;
    hojaReporte.getRange(r + 2, 1, 1, ENC.length).setBackground(color);
  }

  hojaReporte.autoResizeColumns(1, ENC.length);
  hojaReporte.setFrozenRows(1);
  ss.setActiveSheet(hojaReporte);

  // Resumen por hoja
  const conteo = {};
  filas.forEach(function(f) { conteo[f[0]] = (conteo[f[0]] || 0) + 1; });
  let resumen = '📋 PERSONAS SIN CREAMOS ID: ' + totalSinId + '\n\n';
  Object.keys(conteo).forEach(function(h) { resumen += '• ' + h + ': ' + conteo[h] + '\n'; });
  resumen += '\nVer hoja "' + NOMBRE_REPORTE + '" para el detalle completo.\n\n' +
    '¿Marcar también en las hojas con "⚠️ Crear perfil" para identificarlos fácilmente?\n' +
    '(Se puede deshacer con Ctrl+Z o ejecutando "🔁 Actualizar desde directorio" cuando el ID ya esté en el directorio)';

  const respMarcar = ui.alert('Reporte — Sin Creamos ID', resumen, ui.ButtonSet.YES_NO);

  if (respMarcar === ui.Button.YES) {
    ss.toast('Marcando celdas vacías...', 'Reporte', -1);
    let marcados = 0;
    for (let f = 0; f < filas.length; f++) {
      const nombreHoja = filas[f][0];
      const filaNum    = filas[f][1];
      const hoja = ss.getSheetByName(nombreHoja);
      if (!hoja) continue;

      const enc = hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0];
      const idx = {};
      enc.forEach(function(h, i) { idx[h.toString().trim().toLowerCase().replace(/\s+/g, '')] = i; });
      const iCId = idx['creamosid'] !== undefined ? idx['creamosid'] : idx['creamos id'] !== undefined ? idx['creamos id'] : -1;
      if (iCId < 0) continue;

      const celda = hoja.getRange(filaNum, iCId + 1);
      const valorActual = celda.getValue().toString().trim();
      // Solo marcar si realmente está vacía (no sobreescribir otro placeholder existente)
      if (!valorActual) {
        celda.setValue('⚠️ Crear perfil').setBackground('#FFE0B2').setFontColor('#BF360C');
        marcados++;
      }
    }
    ss.toast('', '', 1);
    SpreadsheetApp.getActiveSpreadsheet().toast(
      marcados + ' celdas marcadas con "⚠️ Crear perfil". Cuando el ID esté en el directorio, ejecuta "🔁 Actualizar desde directorio" y se rellenará automáticamente.',
      '✅ Listo', 8);
  }
}

function repararCreamosIDsTech() {
  _repararCreamosIDsEnSistema(NOMBRE_HOJA_CREAMOS_ID_TECH);
}

function _repararCreamosIDsEnSistema(nombreDirectorio) {
  const ss   = SpreadsheetApp.getActiveSpreadsheet();
  const ui   = SpreadsheetApp.getUi();

  // --- 1. Verificar que existe la hoja de auditoría ---
  const NOMBRE_AUDIT = '🕵️ Auditoría IDs';
  const hojaAudit = ss.getSheetByName(NOMBRE_AUDIT);
  if (!hojaAudit) {
    ui.alert('⚠️ Primero ejecuta "🕵️ Auditar IDs en todas las hojas" para generar el reporte.');
    return;
  }

  // --- 2. Cargar directorio completo ---
  const hojaDir = ss.getSheetByName(nombreDirectorio);
  if (!hojaDir) { ui.alert('❌ Directorio no encontrado: ' + nombreDirectorio); return; }

  const colMapDir = detectarColumnasDirectorio();
  const datosDir  = hojaDir.getDataRange().getValues();
  const dirEntradas = [];

  for (let i = 1; i < datosDir.length; i++) {
    const f       = datosDir[i];
    const nombre    = colMapDir.nombre    >= 0 ? (f[colMapDir.nombre]    || '').toString().trim() : '';
    const creamosId = colMapDir.creamosId >= 0 ? (f[colMapDir.creamosId] || '').toString().trim() : '';
    const dpi       = colMapDir.dpi       >= 0 ? (f[colMapDir.dpi]       || '').toString().trim() : '';
    const edad      = colMapDir.edad      >= 0 ? (f[colMapDir.edad]      || '').toString().trim() : '';
    const zona      = colMapDir.zona      >= 0 ? (f[colMapDir.zona]      || '').toString().trim() : '';
    if (creamosId || nombre) dirEntradas.push({ nombre, creamosId, dpi, edad, zona });
  }

  // --- 3. Leer filas problemáticas de la auditoría ---
  const datosAudit = hojaAudit.getDataRange().getValues();
  const FILAS_PROBLEMA = [];

  for (let i = 1; i < datosAudit.length; i++) {
    const estado = (datosAudit[i][6] || '').toString();
    if (estado === '⚠️ Nombre no coincide' || estado === '❌ ID no existe') {
      FILAS_PROBLEMA.push({
        auditFila : i + 1,          // fila en hoja auditoría (1-based)
        nombreHoja: (datosAudit[i][0] || '').toString().trim(),
        filaHoja  : parseInt(datosAudit[i][1]) || 0,
        idActual  : (datosAudit[i][2] || '').toString().trim(),
        nomHoja   : (datosAudit[i][3] || '').toString().trim(),
        estado    : estado
      });
    }
  }

  if (FILAS_PROBLEMA.length === 0) {
    ui.alert('✅ No hay registros problemáticos en la auditoría.\nEjecuta primero "🕵️ Auditar IDs" para obtener resultados actualizados.');
    return;
  }

  // --- 4. Para cada fila, buscar el ID correcto por nombre en el directorio ---
  const propuestas   = [];  // cambios con alta confianza → se pueden aplicar
  const ambiguos     = [];  // hay 2+ candidatos → requiere revisión manual
  const sinMatch     = [];  // no se encontró nadie con ese nombre

  for (let p = 0; p < FILAS_PROBLEMA.length; p++) {
    const prob = FILAS_PROBLEMA[p];
    if (!prob.nomHoja) { sinMatch.push(prob); continue; }

    let mejorSim = 0, segundaSim = 0, mejorDir = null;
    for (let d = 0; d < dirEntradas.length; d++) {
      const sim = similitudNombre(prob.nomHoja, dirEntradas[d].nombre);
      if (sim > mejorSim) {
        segundaSim = mejorSim;
        mejorSim   = sim;
        mejorDir   = dirEntradas[d];
      } else if (sim > segundaSim) {
        segundaSim = sim;
      }
    }

    if (mejorSim >= 85 && segundaSim < 70) {
      // Coincidencia clara → proponer cambio
      if (mejorDir.creamosId !== prob.idActual) {
        propuestas.push({
          prob   : prob,
          entrada: mejorDir,
          sim    : mejorSim
        });
      }
    } else if (mejorSim >= 70) {
      ambiguos.push({ prob: prob, mejor: mejorDir, mejorSim: mejorSim, segundaSim: segundaSim });
    } else {
      sinMatch.push(prob);
    }
  }

  // --- 5. Mostrar resumen y pedir confirmación ---
  if (propuestas.length === 0) {
    let msg = '📋 RESULTADO DEL ANÁLISIS\n\n';
    msg += '✅ Cambios automáticos posibles: 0\n';
    msg += '⚠️ Ambiguos (revisión manual): ' + ambiguos.length + '\n';
    msg += '❓ Sin coincidencia en directorio: ' + sinMatch.length + '\n\n';
    if (ambiguos.length > 0) {
      msg += 'AMBIGUOS (primeros 5):\n';
      ambiguos.slice(0, 5).forEach(function(a) {
        msg += '• Hoja "' + a.prob.nombreHoja + '" fila ' + a.prob.filaHoja +
               ': "' + a.prob.nomHoja + '" — mejor: ' + a.mejor.nombre +
               ' (' + a.mejorSim.toFixed(0) + '%) vs otro (' + a.segundaSim.toFixed(0) + '%)\n';
      });
    }
    ui.alert('Reparar IDs — Sin cambios automáticos', msg, ui.ButtonSet.OK);
    return;
  }

  let confirmMsg = '🔧 CAMBIOS PROPUESTOS (' + propuestas.length + '):\n\n';
  propuestas.slice(0, 10).forEach(function(c) {
    confirmMsg += '• "' + c.prob.nombreHoja + '" fila ' + c.prob.filaHoja + '\n' +
                  '  Nombre: "' + c.prob.nomHoja + '"\n' +
                  '  ID actual: "' + c.prob.idActual + '" → Nuevo: "' + c.entrada.creamosId + '"\n' +
                  '  (' + c.sim.toFixed(0) + '% similitud)\n';
  });
  if (propuestas.length > 10) confirmMsg += '... y ' + (propuestas.length - 10) + ' más.\n';
  if (ambiguos.length > 0)   confirmMsg += '\n⚠️ ' + ambiguos.length + ' registros ambiguos NO serán cambiados (revisión manual necesaria).';
  if (sinMatch.length > 0)   confirmMsg += '\n❓ ' + sinMatch.length + ' sin coincidencia en directorio (se dejan como están).';
  confirmMsg += '\n\n¿Aplicar los ' + propuestas.length + ' cambios automáticos?';

  const resp = ui.alert('Confirmar Reparación', confirmMsg, ui.ButtonSet.YES_NO);
  if (resp !== ui.Button.YES) {
    ss.toast('Operación cancelada. No se realizaron cambios.', 'Cancelado', 4);
    return;
  }

  // --- 6. Aplicar cambios ---
  let aplicados = 0;
  const errores = [];

  for (let c = 0; c < propuestas.length; c++) {
    const { prob, entrada } = propuestas[c];
    try {
      const hoja = ss.getSheetByName(prob.nombreHoja);
      if (!hoja) { errores.push('No se encontró hoja: ' + prob.nombreHoja); continue; }

      const encabezados = hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0];
      const idx = {};
      encabezados.forEach(function(h, i) { idx[h.toString().trim().toLowerCase().replace(/\s+/g, '')] = i; });

      const iCId = idx['creamosid'] !== undefined ? idx['creamosid'] : idx['creamos id'] !== undefined ? idx['creamos id'] : -1;
      const iDpi = idx['dpi'] !== undefined ? idx['dpi'] : idx['numerodedpi'] !== undefined ? idx['numerodedpi'] : -1;

      if (iCId >= 0 && entrada.creamosId) {
        hoja.getRange(prob.filaHoja, iCId + 1).setValue(entrada.creamosId);
      }
      if (iDpi >= 0 && entrada.dpi) {
        const dpiActual = hoja.getRange(prob.filaHoja, iDpi + 1).getValue().toString().trim();
        if (!dpiActual) hoja.getRange(prob.filaHoja, iDpi + 1).setValue(entrada.dpi);
      }

      // Marcar la fila de auditoría como corregida
      hojaAudit.getRange(prob.auditFila, 7).setValue('✅ Corregido automáticamente');
      hojaAudit.getRange(prob.auditFila, 8).setValue('ID anterior: ' + prob.idActual + ' → ' + entrada.creamosId);
      hojaAudit.getRange(prob.auditFila, 1, 1, 8).setBackground('#C8E6C9');

      aplicados++;
      Logger.log('✅ Corregido: "' + prob.nombreHoja + '" fila ' + prob.filaHoja +
                 ' | ' + prob.idActual + ' → ' + entrada.creamosId);
    } catch (e) {
      errores.push('Fila ' + prob.filaHoja + ' de "' + prob.nombreHoja + '": ' + e.message);
    }
  }

  // --- 7. Resultado final ---
  let msgFinal = '✅ REPARACIÓN COMPLETADA\n\n' +
    'Corregidos: ' + aplicados + ' de ' + propuestas.length + '\n';
  if (ambiguos.length > 0) msgFinal += '⚠️ Ambiguos (revisar manualmente): ' + ambiguos.length + '\n';
  if (sinMatch.length > 0) msgFinal += '❓ Sin coincidencia: ' + sinMatch.length + '\n';
  if (errores.length > 0)  msgFinal += '❌ Errores: ' + errores.length + '\n' + errores.slice(0, 3).join('\n');

  ss.toast('', '', 1);
  ui.alert('Reparación de IDs', msgFinal, ui.ButtonSet.OK);
}

function enviarEmailDesercionEva(nombre, cohorte, motivo, creamosId) {
  try {
    const emailEva    = obtenerEmailEva();
    const emailPamela = 'pamelasamayoa@creamosguatemala.org';
    const emailNotif  = obtenerEmailConfiguracion();
    const fecha = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');

    const asunto = '⚠️ Deserción — ' + nombre + ' — Actualizar Salesforce';
    const cuerpo =
      'Hola Eva y Pamela,\n\n' +
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

    const destinatarios = [emailEva, emailPamela];
    if (emailNotif && !destinatarios.includes(emailNotif)) destinatarios.push(emailNotif);
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
      'Por favor, actualiza la etapa de TODAS las participantes listadas a "Graduadx"\n' +
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
  // Esta función se mantiene por compatibilidad.
  // El reporte nuevo usa celdas combinadas (merged) — no se tocan celdas individuales.
  // Para reconstruir el reporte completo usa redisenarReporteTech().
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const reporte = ss.getSheetByName('Reporte');
  if (!reporte) return;

  // Solo limpiar contenido residual fuera del dashboard (filas 24 en adelante)
  reporte.getRange('A24:F50').clearContent().clearFormat();
  Logger.log('✅ Residuos del Reporte limpiados');
}

/**
 * Repara las fórmulas de la hoja Cohortes para que cuenten correctamente
 * restando las deserciones de la hoja individual de cada cohorte
 */
function repararFormulasCohortes() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const cohortes = ss.getSheetByName('Cohortes');
  if (!cohortes) return;

  const ultimaFila = cohortes.getLastRow();

  for (let i = 2; i <= ultimaFila; i++) {
    const nombreCohorte = cohortes.getRange('A' + i).getValue();
    if (nombreCohorte && nombreCohorte.toString().trim() !== '') {
      // Inscritas: cuenta por Creamos ID (col C) en hoja individual, restando Retiradx
      cohortes.getRange('H' + i).setFormula('=IF(A' + i + '="",0,IFERROR(COUNTIF(INDIRECT("\'"&A' + i + '&"\'!E:E"),"<>")-1-COUNTIF(INDIRECT("\'"&A' + i + '&"\'!K:K"),"Graduadx")-COUNTIF(INDIRECT("\'"&A' + i + '&"\'!K:K"),"Retiradx"),0))');
      // Graduadx: cuenta en la hoja Graduadx
      cohortes.getRange('I' + i).setFormula('=IFERROR(COUNTIF(Graduadx!J:J,A' + i + '),0)');
      // Retiradx: cuenta en la hoja Retiradx (aunque también están marcados en la hoja individual)
      cohortes.getRange('J' + i).setFormula('=IFERROR(COUNTIF(Retiradx!J:J,A' + i + '),0)');
    }
  }

  Logger.log('✅ Fórmulas de Cohortes reparadas');
  ss.toast('✅ Fórmulas de Cohortes reparadas correctamente', 'Reparación completada', 3);
}

/**
 * Reinstala la hoja "Cohortes" sin borrar cohortes existentes.
 * - Repara encabezados A:N
 * - Reaplica validaciones
 * - Reconstruye fórmulas H/I/J para todas las filas con nombre de cohorte
 */
function reinstalarHojaCohortesTech() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Cohortes');
  if (!sheet) {
    crearHojaCohortes();
    sheet = ss.getSheetByName('Cohortes');
  }
  if (!sheet) return;

  const headers = [
    'Nombre Cohorte', 'Proyecto', 'Año', 'Fecha Inicio', 'Fecha Fin', 'Responsable',
    'Cupo Máximo', 'Inscritas', 'Graduadx', 'Retiradx', 'Ubicación', 'Horario', 'Notas', 'Estado'
  ];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#f57c00').setFontColor('white').setFontWeight('bold').setHorizontalAlignment('center');

  const lastRow = Math.max(sheet.getLastRow(), 2);
  if (lastRow >= 2) {
    sheet.getRange(2, 6, lastRow - 1, 1).setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG_TECH.RESPONSABLES).setAllowInvalid(false).build()
    );
    sheet.getRange(2, 14, lastRow - 1, 1).setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG_TECH.ESTADOS_COHORTE).setAllowInvalid(false).build()
    );
  }

  for (let i = 2; i <= lastRow; i++) {
    const nombreCohorte = (sheet.getRange(i, 1).getValue() || '').toString().trim();
    if (!nombreCohorte) continue;
    sheet.getRange('H' + i).setFormula('=IF(A' + i + '="",0,IFERROR(COUNTIF(INDIRECT("\'"&A' + i + '&"\'!E:E"),"<>")-1-COUNTIF(INDIRECT("\'"&A' + i + '&"\'!K:K"),"Graduadx")-COUNTIF(INDIRECT("\'"&A' + i + '&"\'!K:K"),"Retiradx"),0))');
    sheet.getRange('I' + i).setFormula('=IFERROR(COUNTIF(Graduadx!J:J,A' + i + '),0)');
    sheet.getRange('J' + i).setFormula('=IFERROR(COUNTIF(Retiradx!J:J,A' + i + '),0)');
  }

  sheet.setFrozenRows(1);
  ss.toast('✅ Cohortes reinstalada y reparada', 'Cohortes', 5);
}

// =====================================================================
// INSTALAR TODO — BOTÓN MAESTRO DE INSTALACIÓN COMPLETA
// =====================================================================

/**
 * ✅ INSTALAR TODO EL SISTEMA - Función principal de instalación
 * Crea todas las hojas, configura validaciones, formatos, fórmulas y triggers
 */
function instalarSistemaCompletoTech() {
  instalarTodo(); // Llama a la función principal de instalación
}

/**
 * Activa las mejoras de Entrevistas SIN reinstalar todo el sistema
 * - Crea hoja "Paso a Paso"
 * - Oculta columna C "Abrir Kobo" (reemplazada por opción en desplegable)
 * - Actualiza desplegable Estado con "Derivar a Paso a Paso" y "🔗 Abrir Formulario"
 */
function activarMejorasEntrevistasTech() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  ss.toast('🔧 Activando mejoras de Entrevistas...', 'Instalando', 3);

  // 1. Crear hoja "Paso a Paso" si no existe
  crearHojaPasoAPaso();

  // 2. Ocultar columna C "Abrir Kobo" si existe (ya no se usa como columna)
  const entrevistas = ss.getSheetByName('Entrevistas');
  if (entrevistas) {
    const headerC = entrevistas.getRange('C1').getValue();
    if (headerC === '🔗 Abrir Kobo') {
      entrevistas.getRange('C1').setValue('').setBackground(null).setFontColor(null);
      entrevistas.getRange('C2:C500').clearContent().setFontColor(null);
      entrevistas.hideColumns(3);
    }

    // 3. Actualizar desplegable Estado — busca la columna por nombre
    const headers = entrevistas.getRange(1, 1, 1, entrevistas.getLastColumn()).getValues()[0];
    const colEstado = headers.indexOf('Estado') + 1; // 1-based, 0 si no existe
    if (colEstado > 0) {
      const estadoOpciones = ['Seleccionada/o', 'No asistió / No aprobó', 'Reprogramada', 'Próxima cohorte Programación', 'Próxima cohorte Alfa Digital', 'Derivar a Paso a Paso', 'Derivación a Programas', 'Enviar a A y B'];
      entrevistas.getRange(2, colEstado, 499).setDataValidation(
        SpreadsheetApp.newDataValidation()
          .requireValueInList(estadoOpciones)
          .setAllowInvalid(false)
          .build()
      );
      entrevistas.getRange(1, colEstado)
        .setBackground('#4caf50')
        .setFontColor('white');
    }
  }

  // 4. En Paso a Paso: ocultar columna C también (no tiene acciones)
  const pasoAPaso = ss.getSheetByName('Paso a Paso');
  if (pasoAPaso) {
    const headerCPP = pasoAPaso.getRange('C1').getValue();
    if (headerCPP === '🔗 Abrir Kobo') {
      pasoAPaso.getRange('C1').setValue('').setBackground(null).setFontColor(null);
      pasoAPaso.getRange('C2:C500').clearContent();
      pasoAPaso.hideColumns(3);
    }
  }

  ss.toast('✅ Mejoras activadas correctamente', 'Listo', 4);
  SpreadsheetApp.getUi().alert(
    '✅ Mejoras de Entrevistas activadas',
    '✓ Hoja "Paso a Paso" lista\n' +
    '✓ Columna "Abrir Kobo" ocultada\n' +
    '✓ Desplegable Estado actualizado\n\n' +
    'En Estado de Entrevistas ahora tienes:\n' +
    '• "Derivar a Paso a Paso" → copia la fila\n' +
    '• "🔗 Abrir Formulario" → abre el formulario Kobo',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * Agrega la columna "Trasladar a A y B" (col N) a la hoja Inscritx existente
 * y configura el dropdown. Ejecutar una sola vez desde el menú Configuración.
 */
function activarTrasladosTech() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  const inscritx = ss.getSheetByName('Inscritx');
  if (!inscritx) {
    ui.alert('⚠️ Error', 'No se encontró la hoja "Inscritx".', ui.ButtonSet.OK);
    return;
  }

  const headers = inscritx.getRange(1, 1, 1, inscritx.getLastColumn()).getValues()[0];
  const colTrasladar = headers.indexOf('Trasladar a A y B') + 1;

  if (colTrasladar > 0) {
    ui.alert('ℹ️ Ya activado', 'La columna "Trasladar a A y B" ya existe en Inscritx.', ui.ButtonSet.OK);
    return;
  }

  const nuevaCol = inscritx.getLastColumn() + 1;
  inscritx.getRange(1, nuevaCol).setValue('Trasladar a A y B')
    .setBackground('#ffcc80')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');
  inscritx.setColumnWidth(nuevaCol, 180);
  inscritx.getRange(2, nuevaCol, 499).setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInList(['Sí, trasladar a A y B'])
      .setAllowInvalid(false)
      .build()
  );

  ui.alert(
    '✅ Traslados activados',
    '✓ Columna "Trasladar a A y B" agregada en Inscritx\n\n' +
    '⚠️ PASO SIGUIENTE:\n' +
    'Abre el script (Extensiones → Apps Script) y en CONFIG_TECH\n' +
    'coloca el ID del Google Sheets de Alimentos y Bebidas:\n\n' +
    'ID_SPREADSHEET_AB: "PEGAR_ID_AQUI"\n\n' +
    'El ID está en la URL del Sheets de A y B:\n' +
    'docs.google.com/spreadsheets/d/[ESTE_ID]/edit',
    ui.ButtonSet.OK
  );
}

/**
 * Instala SOLO los cambios nuevos (sin tocar datos ni formatos existentes):
 * - Agrega columnas: 1ra Llamada, 2da Llamada, Notas/Comentario
 * - Actualiza Hoja de Interés: Reprogramada + No interesada/o
 * - Actualiza Entrevistas: Derivación a Programas + Seleccionada/o
 */
function instalarCambiosNuevosTech() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  const log = [];

  // 1. Agregar columnas a Hoja de Interés (solo si no existen)
  const interes = ss.getSheetByName('Hoja de Interés');
  if (interes) {
    const hdrsInt = interes.getRange(1, 1, 1, interes.getLastColumn()).getValues()[0];

    const ya1ra = hdrsInt.some(h => h === '1ra Llamada');
    const ya2da = hdrsInt.some(h => h === '2da Llamada');
    const yaNotas = hdrsInt.some(h => h === 'Notas/Comentario');

    if (!ya1ra || !ya2da || !yaNotas) {
      if (!ya1ra) {
        const c1 = interes.getLastColumn() + 1;
        interes.getRange(1, c1).setValue('1ra Llamada').setBackground('#e0e0e0').setFontWeight('bold').setHorizontalAlignment('center');
        interes.getRange(2, c1, 499).setDataValidation(
          SpreadsheetApp.newDataValidation().requireValueInList(['Contestó', 'No contestó', 'Pendiente']).setAllowInvalid(true).build()
        );
        interes.hideColumns(c1);
      }
      if (!ya2da) {
        const c2 = interes.getLastColumn() + 1;
        interes.getRange(1, c2).setValue('2da Llamada').setBackground('#e0e0e0').setFontWeight('bold').setHorizontalAlignment('center');
        interes.getRange(2, c2, 499).setDataValidation(
          SpreadsheetApp.newDataValidation().requireValueInList(['Contestó', 'No contestó', 'Pendiente', 'Reprogramada']).setAllowInvalid(true).build()
        );
        interes.hideColumns(c2);
      }
      if (!yaNotas) {
        const cN = interes.getLastColumn() + 1;
        interes.getRange(1, cN).setValue('Notas/Comentario').setBackground('#fff9c4').setFontWeight('bold').setHorizontalAlignment('center');
        interes.setColumnWidth(cN, 250);
      }
      log.push('✓ Columnas de llamadas agregadas');
    } else {
      log.push('ℹ Columnas ya existían (no se duplicaron)');
    }

    // Actualizar Estado (busca la columna por nombre)
    const hdrsActualInt = interes.getRange(1, 1, 1, interes.getLastColumn()).getValues()[0];
    const idxEstado = hdrsActualInt.findIndex(h => h.toString().trim() === 'Estado');
    if (idxEstado >= 0) {
      interes.getRange(2, idxEstado + 1, 499, 1).setDataValidation(
        SpreadsheetApp.newDataValidation()
          .requireValueInList(['Entrevista agendada', 'Reprogramada', 'No interesada/o'])
          .setAllowInvalid(true).build()
      );
      log.push('✓ Dropdown Estado actualizado');
    }
  }

  // 2. Actualizar Entrevistas (detección dinámica)
  const entrevistas = ss.getSheetByName('Entrevistas');
  if (entrevistas) {
    const hdrs = entrevistas.getRange(1, 1, 1, entrevistas.getLastColumn()).getValues()[0];
    const idxE = hdrs.findIndex(h => h.toString().trim() === 'Estado');
    if (idxE >= 0) {
      const opciones = CONFIG_TECH.RESULTADO_FINAL.concat([
        'Derivar a Paso a Paso', 'Derivación a Programas', 'Enviar a A y B'
      ]);
      entrevistas.getRange(2, idxE + 1, 499, 1).setDataValidation(
        SpreadsheetApp.newDataValidation().requireValueInList(opciones).setAllowInvalid(true).build()
      );
      log.push('✓ Dropdown Estado de Entrevistas actualizado');
    }
  }

  // Reconfigurar validaciones de todas las hojas
  configurarValidaciones();
  log.push('✓ Validaciones recalibradas en todas las hojas');

  ui.alert(
    '✅ Cambios instalados correctamente',
    log.join('\n') + '\n\n' +
    'Opciones nuevas disponibles:\n' +
    '• "Reprogramada" en Hoja de Interés\n' +
    '• "No interesada/o" en Hoja de Interés\n' +
    '• "Seleccionada/o" y "Derivación a Programas" en Entrevistas\n\n' +
    'Los datos existentes NO fueron borrados.',
    ui.ButtonSet.OK
  );
}

/**
 * ❌ DESINSTALAR TODO EL SISTEMA - Elimina todas las hojas del sistema
 */
function desinstalarSistemaCompletoTech() {
  desinstalarSistema(); // Llama a la función principal de desinstalación
}

function instalarTodo() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const confirmacion = ui.alert(
    '✅ INSTALAR TODO EL SISTEMA COMPLETO',
    '🚀 Esta función configurará TODO el sistema automáticamente:\n\n' +
    '✅ HOJAS:\n' +
    '   • Hoja de Interés, Entrevistas, Inscritx\n' +
    '   • Cohortes, Graduadx, Retiradx, No Inscritx\n' +
    '   • Lista Definitiva, Reportes\n' +
    '   • Sistema de Estipendios completo\n' +
    '   • Guía de Uso\n\n' +
    '✅ CONFIGURACIÓN:\n' +
    '   • Validaciones y formatos\n' +
    '   • Fórmulas automáticas\n' +
    '   • Triggers de importación\n' +
    '   • Reglas de formato condicional\n\n' +
    '⚠️ IMPORTANTE:\n' +
    '   • NO se borrarán datos existentes\n' +
    '   • Se mantendrá "Copy of CREAMOS ID nuevo"\n' +
    '   • Después debes configurar URLs de Kobo\n\n' +
    '¿Deseas continuar con la instalación?',
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
    actualizarReportesTech();
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
    ['  →', '"Graduadx"  →  pasa a "Graduadx" + se envía email automático a Eva con lista'],
    ['  →', '"Retiradx"  →  pasa a "Retiradx" + se envía email automático a Eva con alerta Salesforce'],
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
    ['Graduadx',     'La participante se mueve a la hoja "Graduadx" + la fila queda verde en la cohorte'],
    ['Retiradx',     'El sistema pide el motivo + la participante pasa a "Retiradx" + se envía email a Eva'],
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
    const hoja = ss.getSheetByName(NOMBRE_HOJA_CREAMOS_ID_TECH);
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

/**
 * DIAGNÓSTICO DETALLADO - Muestra el contenido EXACTO de cada celda
 * para identificar por qué los campos no se están transfiriendo correctamente
 */
function diagnosticoDetalladoTransferencia() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  let mensaje = '🔍 DIAGNÓSTICO DETALLADO DE TRANSFERENCIA\n\n';

  // === HOJA DE ENTREVISTAS ===
  const entrevistas = ss.getSheetByName('Entrevistas');
  if (entrevistas && entrevistas.getLastRow() > 1) {
    mensaje += '📄 HOJA: ENTREVISTAS\n';
    mensaje += '─'.repeat(50) + '\n';

    // Leer todos los registros (excluyendo encabezado)
    const datosEntrevistas = entrevistas.getRange(2, 1, entrevistas.getLastRow() - 1, 14).getValues();

    for (let i = 0; i < Math.min(datosEntrevistas.length, 3); i++) {
      const fila = datosEntrevistas[i];
      const filaNum = i + 2;

      mensaje += `\nFila ${filaNum}:\n`;
      mensaje += `  C - Creamos ID: "${fila[2]}"\n`;
      mensaje += `  E - Nombre: "${fila[4]}"\n`;
      mensaje += `  I - Nivel Educativo: "${fila[8]}" (longitud: ${String(fila[8]).length})\n`;
      mensaje += `  J - Zona: "${fila[9]}" (longitud: ${String(fila[9]).length})\n`;
      mensaje += `  N - Estado: "${fila[13]}"\n`;

      // Verificar si hay caracteres invisibles
      const nivelEdu = String(fila[8]);
      const zona = String(fila[9]);
      mensaje += `  Nivel Educativo vacío: ${nivelEdu === '' || nivelEdu.trim() === ''}\n`;
      mensaje += `  Zona vacía: ${zona === '' || zona.trim() === ''}\n`;
    }

    if (datosEntrevistas.length > 3) {
      mensaje += `\n... y ${datosEntrevistas.length - 3} registros más\n`;
    }
  } else {
    mensaje += '❌ No hay datos en Entrevistas\n';
  }

  mensaje += '\n' + '='.repeat(50) + '\n\n';

  // === HOJA DE INSCRITX ===
  const inscritx = ss.getSheetByName('Inscritx');
  if (inscritx && inscritx.getLastRow() > 1) {
    mensaje += '📄 HOJA: INSCRITX\n';
    mensaje += '─'.repeat(50) + '\n';

    // Leer todos los registros (excluyendo encabezado)
    const datosInscritx = inscritx.getRange(2, 1, inscritx.getLastRow() - 1, 12).getValues();

    for (let i = 0; i < Math.min(datosInscritx.length, 3); i++) {
      const fila = datosInscritx[i];
      const filaNum = i + 2;

      mensaje += `\nFila ${filaNum}:\n`;
      mensaje += `  B - Creamos ID: "${fila[1]}"\n`;
      mensaje += `  D - Nombre: "${fila[3]}"\n`;
      mensaje += `  H - Nivel Educativo: "${fila[7]}" (longitud: ${String(fila[7]).length})\n`;
      mensaje += `  I - Zona: "${fila[8]}" (longitud: ${String(fila[8]).length})\n`;
      mensaje += `  K - Estado: "${fila[10]}"\n`;

      // Verificar si hay caracteres invisibles
      const nivelEdu = String(fila[7]);
      const zona = String(fila[8]);
      mensaje += `  Nivel Educativo vacío: ${nivelEdu === '' || nivelEdu.trim() === ''}\n`;
      mensaje += `  Zona vacía: ${zona === '' || zona.trim() === ''}\n`;
    }

    if (datosInscritx.length > 3) {
      mensaje += `\n... y ${datosInscritx.length - 3} registros más\n`;
    }
  } else {
    mensaje += '❌ No hay datos en Inscritx\n';
  }

  // Mostrar el diagnóstico
  Logger.log(mensaje);
  ui.alert('🔍 Diagnóstico Detallado', mensaje, ui.ButtonSet.OK);
}

/**
 * Obtiene un mapa de nombres de encabezado a índices de columna (0-based)
 * @param {GoogleAppsScript.Spreadsheet.Sheet} hoja - La hoja a analizar
 * @returns {Object} - Mapa de encabezados a índices
 */
/**
 * Obtiene un mapa de nombres de encabezado a índices de columna (0-based)
 * @param {GoogleAppsScript.Spreadsheet.Sheet} hoja - La hoja a analizar
 * @returns {Object} - Mapa de encabezados a índices. 
 *                     Incluye llaves originales y llaves normalizadas (lowercase, trimmed).
 */
function obtenerMapaColumnas(hoja) {
  if (!hoja) return {};
  const headers = hoja.getRange(1, 1, 1, hoja.getLastColumn()).getValues()[0];
  const mapa = {};
  // Normaliza tildes: "envío" → "envio", "ó" → "o", etc.
  const quitarTildes = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
  headers.forEach((header, index) => {
    if (header !== undefined && header !== null) {
      const original = header.toString().trim();
      const normalizado = original.toLowerCase();
      const sinTildes = quitarTildes(normalizado);
      const superNormalizado = sinTildes.replace(/[^a-z0-9]/g, '');

      mapa[original] = index;
      if (!mapa[normalizado]) mapa[normalizado] = index;
      if (!mapa[sinTildes]) mapa[sinTildes] = index;
      if (!mapa[superNormalizado]) mapa[superNormalizado] = index;
    }
  });
  return mapa;
}

/**
 * Adaptador para que las hojas usen el formato que espera autocompletarFilaDesdeDirectorio
 * @param {GoogleAppsScript.Spreadsheet.Sheet} hoja - La hoja destino
 * @returns {Object} - Mapa con las llaves fijas que espera la función de autocompletado
 */
function mapearColumnasParaAutocompletar(hoja) {
  const mapaOriginal = obtenerMapaColumnas(hoja);
  
  // Función helper para buscar de forma flexible usando normalización extrema
  const buscar = (nombres) => {
    for (let n of nombres) {
      // Probar normalizado (con espacios)
      const norm = n.toLowerCase();
      if (mapaOriginal[norm] !== undefined) return mapaOriginal[norm];
      
      // Probar super normalizado (sin nada más que letras/números)
      const superNorm = norm.replace(/[^a-z0-9]/g, '');
      if (mapaOriginal[superNorm] !== undefined) return mapaOriginal[superNorm];
    }
    return -1;
  };

  return {
    creamosId: buscar(['Creamos ID', 'ID', 'ID Creamos']),
    dpi: buscar(['DPI', 'Número de DPI', 'CUI', 'Documento']),
    nombre: buscar(['Nombre Completo', 'Nombre', 'Participante', 'Full Name']),
    edad: buscar(['Edad', 'Age']),
    nivelEducativo: buscar(['Nivel Educativo', 'Grado', 'Estudios', 'Escolaridad', 'Escuela']),
    zona: buscar(['Zona', 'Ubicación'])
  };
}

/**
 * Normaliza string para búsqueda: quita tildes, espacios extras, minúsculas
 * "María José" → "maria jose"
 * "JUAN" → "juan"
 */
function normalizarBusqueda(texto) {
  if (!texto) return '';
  const map = {
    'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
    'Á': 'a', 'É': 'e', 'Í': 'i', 'Ó': 'o', 'Ú': 'u',
    'ñ': 'n', 'Ñ': 'n'
  };
  return texto
    .toLowerCase()
    .replace(/[áéíóúÁÉÍÓÚñÑ]/g, ch => map[ch] || ch)
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Similitud específica para nombres de personas (basada en palabras, no en caracteres globales).
 * Cada palabra del nombre buscado debe coincidir con alguna palabra del directorio.
 * Esto evita falsos positivos por prefijos cortos ("María" → "María González").
 * Retorna 0-100. Umbral recomendado: 85%.
 */
function similitudNombre(nombre1, nombre2) {
  var s1 = normalizarBusqueda(nombre1);
  var s2 = normalizarBusqueda(nombre2);
  if (s1 === s2) return 100;
  if (!s1 || !s2) return 0;

  var pals1 = s1.split(/\s+/).filter(function(w) { return w.length >= 2; });
  var pals2 = s2.split(/\s+/).filter(function(w) { return w.length >= 2; });
  if (pals1.length === 0 || pals2.length === 0) return 0;

  // Contar palabras de la búsqueda que tienen match en el directorio
  var usadas = new Array(pals2.length).fill(false);
  var matches = 0;
  for (var i = 0; i < pals1.length; i++) {
    var p1 = pals1[i];
    var mejorJ = -1;
    var mejorDist = Infinity;
    for (var j = 0; j < pals2.length; j++) {
      if (usadas[j]) continue;
      var dist = levenshtein(p1, pals2[j]);
      var maxLen = Math.max(p1.length, pals2[j].length);
      var tolerancia = maxLen <= 4 ? 0 : 1; // palabras cortas exigen coincidencia exacta
      if (dist <= tolerancia && dist < mejorDist) { mejorDist = dist; mejorJ = j; }
    }
    if (mejorJ >= 0) { matches++; usadas[mejorJ] = true; }
  }

  // precision: qué % de las palabras buscadas coincidieron (peso alto: lo que el usuario escribió)
  // recall:    qué % de las palabras del directorio están en la búsqueda (peso bajo: puede tener más apellidos)
  var precision = matches / pals1.length;
  var recall    = matches / pals2.length;
  return (precision * 0.65 + recall * 0.35) * 100;
}

/**
 * Calcula similitud entre dos strings (0-100)
 * Usa distancia de Levenshtein simplificada
 */
function similitud(s1, s2) {
  s1 = normalizarBusqueda(s1);
  s2 = normalizarBusqueda(s2);

  if (s1 === s2) return 100;
  if (s1.length === 0 || s2.length === 0) return 0;

  // Búsqueda por prefijo: 80 puntos si uno empieza con el otro
  if (s1.startsWith(s2) || s2.startsWith(s1)) return 80;

  // Búsqueda por contenedor: 60 puntos si uno contiene el otro
  if (s1.includes(s2) || s2.includes(s1)) return 60;

  // Distancia de Levenshtein básica
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;

  if (longer.length === 0) return 100;

  const editDistance = levenshtein(longer, shorter);
  const similarity = (1 - editDistance / longer.length) * 100;

  return Math.max(0, similarity);
}

/**
 * Calcula distancia de Levenshtein entre dos strings
 */
function levenshtein(s1, s2) {
  const costs = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

/**
 * Normaliza el valor de Nivel Educativo para coincidir con el desplegable (Data Validation)
 */
function normalizarNivelEducativo(valor) {
  if (!valor) return 'Otro';
  const v = valor.toString().toLowerCase().trim();
  
  // Mapeos de palabras clave
  if (v.includes('primaria')) {
    if (v.includes('incompleta')) return 'Primaria incompleta';
    return 'Primaria completa';
  }
  
  if (v.includes('basico') || v.includes('básicos')) {
    if (v.includes('incompleto')) return 'Básicos incompletos';
    return 'Básicos completos';
  }
  
  if (v.includes('bachillerato') || v.includes('diversificado') || v.includes('perito') || v.includes('secretaria')) {
    if (v.includes('incompleto')) return 'Diversificado incompleto';
    return 'Diversificado completo';
  }
  
  if (v.includes('universidad') || v.includes('universitario') || v.includes('semestre')) {
    if (v.includes('incompleto')) return 'Universitario incompleto';
    return 'Universitario completo';
  }
  
  if (v.includes('tecnico') || v.includes('técnico')) return 'Técnico';

  // Buscar coincidencia exacta en los valores permitidos
  const permitidos = [
    'Primaria incompleta', 'Primaria completa',
    'Básicos incompletos', 'Básicos completos',
    'Diversificado incompleto', 'Diversificado completo',
    'Universitario incompleto', 'Universitario completo',
    'Técnico', 'Otro'
  ];
  
  for (let p of permitidos) {
    if (p.toLowerCase() === v) return p;
  }
  
  return 'Otro';
}

/**
 * Aplica un color de fondo si el registro pertenece al año 2026
 * #fff3e0 = Ámbar claro
 */
function resaltarSiEs2026(range, valorFechaOAnio) {
  let es2026 = false;
  if (valorFechaOAnio instanceof Date) {
    es2026 = (valorFechaOAnio.getFullYear() === 2026);
  } else if (typeof valorFechaOAnio === 'number') {
    es2026 = (valorFechaOAnio === 2026);
  } else if (typeof valorFechaOAnio === 'string') {
    // Intentar detectar año 2026 en texto (ej: de un nombre de cohorte)
    es2026 = valorFechaOAnio.includes('2026');
  }

  if (es2026) {
    range.setBackground('#fff3e0');
  } else {
    range.setBackground(null); // Limpiar si no es 2026
  }
}

/**
 * =====================================================================
 * MÓDULO: REFERENCIAS INCLUSIÓN LABORAL (VERSIÓN TECNOLOGÍA)
 * =====================================================================
 */

const CONFIG_REFERENCIAS = {
  KOBO_URL: 'https://kf.kobotoolbox.org/api/v2/assets/afuD8C8AzoLfd4o5ksTWUw/export-settings/es52swrnjWcz8NnhY5Wyng3/data.csv',
  NOMBRE_HOJA: 'Referencias de Programas',
  HOJA_DESTINO: 'Entrevistas',
  OPCION_ENVIAR: 'Se realizó hoja de interés',
  FILTRO_PROGRAMA: 'tecnolog' // Filtro clave para ignorar acentos: "tecnología", "tecnologia"
};

function setupMenuReferencias() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('📋 Referencias de Programas')
    .addItem('Importar (Solo Nuevos)', 'importarReferenciasNuevas')
    .addItem('📥 Importar TODAS (sin filtro)', 'importarTodasReferencias')
    .addSeparator()
    .addItem('🔬 Análisis Detallado (FILA x FILA)', 'analizarFiltroDetallado')
    .addItem('🔍 Ver Datos de Kobo (DEBUG)', 'verDatosKoboCrudos')
    .addItem('📊 Diagnóstico Completo', 'diagnosticarReferenciasKobo')
    .addSeparator()
    .addItem('▶️ Activar Auto-Update (5 min)', 'configurarAutoUpdateReferencias')
    .addItem('⏸️ Detener Auto-Update', 'detenerAutoUpdateReferencias')
    .addSeparator()
    .addItem('Configurar Hoja', 'crearHojaReferencias')
    .addToUi();
}

function configurarAutoUpdateReferencias() {
  const ui = SpreadsheetApp.getUi();
  const respuesta = ui.alert('Activar Auto-Update', '¿Deseas activar la importación automática de referencias cada 5 minutos?\n\nTen cuidado con la cuota diaria de Google, pero puedes apagarlo cuando quieras.', ui.ButtonSet.YES_NO);
  if (respuesta !== ui.Button.YES) return;
  
  detenerAutoUpdateReferencias(true); 
  
  ScriptApp.newTrigger('autoImportarReferenciasNuevas')
    .timeBased()
    .everyMinutes(5)
    .create();
    
  SpreadsheetApp.getActiveSpreadsheet().toast('✅ Auto-Update cada 5 min activado.', 'Referencias de Programas', 5);
}

function detenerAutoUpdateReferencias(silencioso) {
  const triggers = ScriptApp.getProjectTriggers();
  let eliminados = 0;
  triggers.forEach(t => {
    if (t.getHandlerFunction() === 'autoImportarReferenciasNuevas' || t.getHandlerFunction() === 'importarReferenciasNuevas') {
      ScriptApp.deleteTrigger(t);
      eliminados++;
    }
  });
  
  if (silencioso !== true) {
    const ui = SpreadsheetApp.getUi();
    const msj = eliminados > 0 ? '❌ Auto-Update detenido correctamente.' : 'ℹ️ No había ningún Auto-Update activo.';
    ui.alert('Detener Auto-Update', msj, ui.ButtonSet.OK);
  }
}

function crearHojaReferencias() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = ss.getSheetByName(CONFIG_REFERENCIAS.NOMBRE_HOJA);
  
  if (!hoja) {
    hoja = ss.insertSheet(CONFIG_REFERENCIAS.NOMBRE_HOJA);
    
    // Configurar encabezados basados en Kobo + ¿Se realizó hoja de interés?
    const headers = [
      'Fecha',
      '_uuid',
      'Programa',
      'Nombre del responsable que deriva',
      'Nombre Completo (según DPI)',
      'DPI',
      'Edad',
      'Teléfono',
      'Nivel educativo',
      'zona',
      '¿En qué área está interesado/a?',
      'Observaciones / Comentarios adicionales',
      '¿Se realizó hoja de interés?' 
    ];
    
    hoja.getRange(1, 1, 1, headers.length).setValues([headers])
      .setBackground('#1a237e')
      .setFontColor('white')
      .setFontWeight('bold');
      
    // Anchos de columna
    hoja.setColumnWidth(1, 150);
    hoja.setColumnWidth(2, 100); 
    hoja.setColumnWidth(3, 150);
    hoja.setColumnWidth(4, 150);
    hoja.setColumnWidth(5, 200);
    hoja.setColumnWidth(6, 120);
    hoja.setColumnWidth(7, 80); 
    hoja.setColumnWidth(8, 100);
    hoja.setColumnWidth(9, 150);
    hoja.setColumnWidth(10, 150);
    hoja.setColumnWidth(11, 250);
    hoja.setColumnWidth(12, 250);
    hoja.setColumnWidth(13, 150);
    
    hoja.setFrozenRows(1);
    
    Logger.log('Hoja Referencias de Programas creada.');
  }
  
  // Siempre re-aplicar validación a la columna de hoja de interés
  const ultimaCol = hoja.getLastColumn();
  const headersRow = hoja.getRange(1, 1, 1, ultimaCol).getValues()[0];
  const colAccionIdx = headersRow.indexOf('¿Se realizó hoja de interés?') + 1;
  
  if (colAccionIdx > 0) {
    const rangoAccion = hoja.getRange(2, colAccionIdx, Math.max(hoja.getMaxRows() - 1, 100));
    rangoAccion.setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(['No', CONFIG_REFERENCIAS.OPCION_ENVIAR], true)
        .setAllowInvalid(false)
        .build()
    );
  }
  
  return hoja;
}

function autoImportarReferenciasNuevas() {
  importarReferenciasNuevas(true);
}

function importarReferenciasNuevas(silencioso) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let hoja = ss.getSheetByName(CONFIG_REFERENCIAS.NOMBRE_HOJA);
  let ui = null;
  if (silencioso !== true) {
    try { ui = SpreadsheetApp.getUi(); } catch(e) {}
  }
  
  if (!hoja) {
    hoja = crearHojaReferencias();
  }
  
  let csvData;
  try {
    const response = UrlFetchApp.fetch(CONFIG_REFERENCIAS.KOBO_URL);
    csvData = response.getContentText('UTF-8');
  } catch (e) {
    Logger.log('Error fetch Kobo (Referencias): ' + e);
    if (ui) ui.alert('Error', 'No se pudo conectar a KoboToolbox. Verifique la URL.\nDetalle: ' + e.message, ui.ButtonSet.OK);
    return;
  }
  
  let koboData;
  try {
    koboData = Utilities.parseCsv(csvData, ';');
  } catch (e) {
    koboData = parsearCSVManualIL(csvData, ';');
  }
  
  if (!koboData || koboData.length <= 1) {
    if (ui) ui.alert('Aviso', 'No hay datos en el formulario de Kobo.', ui.ButtonSet.OK);
    return;
  }
  
  const headersKobo = koboData[0];
  
  // Mapeo dinámico de columnas de Kobo
  const indKobo = {
    fecha: buscarIndiceColumnaRef(headersKobo, ['start', '_submission_time']),
    uuid: buscarIndiceColumnaRef(headersKobo, ['_uuid', 'uuid']),
    programaOrigen: buscarIndiceColumnaRef(headersKobo, ['programa que refiere', 'programa']),
    programaDestino: buscarIndiceColumnaRef(headersKobo, ['¿a qué programa se refiere?', 'programa se refiere']),
    responsable: buscarIndiceColumnaRef(headersKobo, ['responsable que deriva', 'nombre del responsable', 'responsable']),
    nombre: buscarIndiceColumnaRef(headersKobo, ['nombre completo', 'nombre de la derivacion', 'derivacion']),
    dpi: buscarIndiceColumnaRef(headersKobo, ['dpi / cui', 'cui', 'dpi']),
    edad: buscarIndiceColumnaRef(headersKobo, ['edad']),
    telefono: buscarIndiceColumnaRef(headersKobo, ['telefono', 'teléfono', 'tel', 'celular']),
    nivelEdu: buscarIndiceColumnaRef(headersKobo, ['detalles inclusión laboral / último nivel académico aprobado', 'último nivel académico aprobado', 'nivel educativo', 'nivel académico']),
    zona: buscarIndiceColumnaRef(headersKobo, ['zona / colonia', 'zona de residencia', 'zona', 'colonia']),
    aplica: buscarIndiceColumnaRef(headersKobo, ['detalles inclusión laboral / ¿en qué área está interesado/a?', 'en qué área está interesado', 'área está interesado', 'área de interés']),
    observaciones: buscarIndiceColumnaRef(headersKobo, ['observaciones', 'comentarios', 'notas'])
  };
  
  // Obtener UUIDs existentes en la hoja
  const datosHoja = hoja.getDataRange().getValues();
  const headersHoja = datosHoja[0];
  const colUuidHojaIdx = headersHoja.indexOf('_uuid');
  
  const uuidsExistentes = new Set();
  if (colUuidHojaIdx >= 0) {
    for (let i = 1; i < datosHoja.length; i++) {
      if (datosHoja[i][colUuidHojaIdx]) {
        uuidsExistentes.add(datosHoja[i][colUuidHojaIdx].toString().trim());
      }
    }
  }
  
  let nuevosAgregados = 0;
  const nuevasFilas = [];
  
  for (let i = 1; i < koboData.length; i++) {
    const filaKobo = koboData[i];
    const uuidActual = indKobo.uuid >= 0 ? filaKobo[indKobo.uuid].toString().trim() : '';
    
    // Ignorar si no tiene UUID (fila inválida) o si no tiene nombre
    const nombreRef = indKobo.nombre >= 0 ? filaKobo[indKobo.nombre].toString().trim() : '';
    if (!uuidActual || (!nombreRef && indKobo.nombre >= 0)) continue;
    
    // VERIFICACIÓN DE FILTRO PARA TECNOLOGÍA
    // Primero verificar que sea una referencia a "Inclusión Laboral"
    const programaDestino = indKobo.programaDestino >= 0 ? filaKobo[indKobo.programaDestino].toString().trim() : '';
    const programaDestinoNorm = programaDestino.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (!programaDestinoNorm.includes('inclusion laboral')) {
      continue; // IGNORAR SI NO ES REFERENCIA A INCLUSIÓN LABORAL
    }

    // Luego verificar que el área sea Tecnología
    const areaAplica = indKobo.aplica >= 0 ? filaKobo[indKobo.aplica].toString().trim() : '';
    const areaAplicaNorm = areaAplica.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Buscar "tecnologia", "tecnología", "marketing", "programacion", etc.
    const esTecnologia = areaAplicaNorm.includes('tecnologia') ||
                         areaAplicaNorm.includes('marketing') ||
                         areaAplicaNorm.includes('programacion') ||
                         areaAplicaNorm.includes('alfabetizacion') ||
                         areaAplicaNorm.includes('microsoft') ||
                         areaAplicaNorm.includes('servicio al cliente');

    if (!esTecnologia) {
      continue; // IGNORAR SI NO ES REFERENCIA DE TECNOLOGIA
    }

    if (!uuidsExistentes.has(uuidActual)) {
      // Es un registro nuevo
      const nuevaFila = new Array(headersHoja.length).fill('');
      
      const setVal = (nombreCol, valor) => {
        const idx = headersHoja.indexOf(nombreCol);
        if (idx >= 0) nuevaFila[idx] = valor;
      };
      
      const programaOrigen = indKobo.programaOrigen >= 0 ? filaKobo[indKobo.programaOrigen] : '';

      setVal('Fecha', indKobo.fecha >= 0 ? filaKobo[indKobo.fecha] : '');
      setVal('_uuid', uuidActual);
      setVal('Programa', programaOrigen);
      setVal('Nombre del responsable que deriva', indKobo.responsable >= 0 ? filaKobo[indKobo.responsable] : '');
      setVal('Nombre Completo (según DPI)', nombreRef);
      setVal('DPI', indKobo.dpi >= 0 ? filaKobo[indKobo.dpi] : '');
      setVal('Edad', indKobo.edad >= 0 ? filaKobo[indKobo.edad] : '');
      setVal('Teléfono', indKobo.telefono >= 0 ? filaKobo[indKobo.telefono] : '');
      setVal('Nivel educativo', indKobo.nivelEdu >= 0 ? filaKobo[indKobo.nivelEdu] : '');
      setVal('zona', indKobo.zona >= 0 ? filaKobo[indKobo.zona] : '');
      setVal('¿En qué área está interesado/a?', indKobo.aplica >= 0 ? filaKobo[indKobo.aplica] : '');
      setVal('Observaciones / Comentarios adicionales', indKobo.observaciones >= 0 ? filaKobo[indKobo.observaciones] : '');
      setVal('¿Se realizó hoja de interés?', 'No'); // Por defecto: No se ha realizado hoja de interés

      nuevasFilas.push(nuevaFila);
      uuidsExistentes.add(uuidActual);
      nuevosAgregados++;
    }
  }

  if (nuevasFilas.length > 0) {
    const ultimaFilaConDatos = hoja.getLastRow();
    hoja.getRange(ultimaFilaConDatos + 1, 1, nuevasFilas.length, nuevasFilas[0].length).setValues(nuevasFilas);

    // Pintar de rojo la columna "¿Se realizó hoja de interés?" para las nuevas filas (porque son "No")
    const colAccionIdx = headersHoja.indexOf('¿Se realizó hoja de interés?') + 1;
    if (colAccionIdx > 0) {
      hoja.getRange(ultimaFilaConDatos + 1, colAccionIdx, nuevasFilas.length, 1)
        .setBackground('#ffcdd2'); // Rojo claro
    }

    if (ui) ui.alert('Éxito', 'Se importaron ' + nuevosAgregados + ' referencias nuevas de la rama TECNOLOGÍA.', ui.ButtonSet.OK);
  } else {
    if (ui) ui.alert('Información', 'Todo está al día. No se encontraron registros nuevos en Kobo para este programa.', ui.ButtonSet.OK);
  }
}

/**
 * ========================================================================
 * VER DATOS CRUDOS DE KOBO EN UNA HOJA
 * ========================================================================
 * Muestra TODOS los datos de Kobo en una hoja temporal para debugging
 */
function verDatosKoboCrudos() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  ss.toast('Descargando datos de Kobo...', '🔍 Diagnóstico', 5);

  let csvData;
  try {
    const response = UrlFetchApp.fetch(CONFIG_REFERENCIAS.KOBO_URL);
    csvData = response.getContentText('UTF-8');
  } catch (e) {
    ui.alert('❌ Error de Conexión',
      'No se pudo conectar a KoboToolbox.\n\n' +
      'URL: ' + CONFIG_REFERENCIAS.KOBO_URL + '\n\n' +
      'Error: ' + e.message + '\n\n' +
      'Verifica:\n' +
      '1. Que la URL sea correcta\n' +
      '2. Que tengas permisos de acceso\n' +
      '3. Que el formulario exista en Kobo',
      ui.ButtonSet.OK);
    return;
  }

  // Parsear CSV
  let koboData;
  try {
    koboData = Utilities.parseCsv(csvData, ';');
  } catch (e) {
    koboData = parsearCSVManualIL(csvData, ';');
  }

  if (!koboData || koboData.length === 0) {
    ui.alert('⚠️ Sin Datos', 'El archivo CSV de Kobo está vacío.', ui.ButtonSet.OK);
    return;
  }

  if (koboData.length === 1) {
    ui.alert('⚠️ Solo Encabezados',
      'El archivo de Kobo solo tiene encabezados, no hay registros.\n\n' +
      'Esto significa que el formulario de Kobo NO tiene ningún dato.',
      ui.ButtonSet.OK);
    return;
  }

  // Crear o limpiar hoja de debug
  let hojaDebug = ss.getSheetByName('DEBUG - Datos Kobo');
  if (hojaDebug) {
    hojaDebug.clear();
  } else {
    hojaDebug = ss.insertSheet('DEBUG - Datos Kobo');
  }

  // Escribir datos crudos
  hojaDebug.getRange(1, 1, koboData.length, koboData[0].length).setValues(koboData);

  // Formatear encabezados
  hojaDebug.getRange(1, 1, 1, koboData[0].length)
    .setBackground('#4285f4')
    .setFontColor('#ffffff')
    .setFontWeight('bold');

  hojaDebug.setFrozenRows(1);

  // Agregar información adicional
  const infoCol = koboData[0].length + 2;
  hojaDebug.getRange(1, infoCol).setValue('📊 INFORMACIÓN');
  hojaDebug.getRange(2, infoCol).setValue('Total registros:');
  hojaDebug.getRange(2, infoCol + 1).setValue(koboData.length - 1);
  hojaDebug.getRange(3, infoCol).setValue('URL Kobo:');
  hojaDebug.getRange(3, infoCol + 1).setValue(CONFIG_REFERENCIAS.KOBO_URL);
  hojaDebug.getRange(4, infoCol).setValue('Filtro actual:');
  hojaDebug.getRange(4, infoCol + 1).setValue(CONFIG_REFERENCIAS.FILTRO_PROGRAMA);

  hojaDebug.getRange(1, infoCol, 1, 2)
    .setBackground('#34a853')
    .setFontColor('#ffffff')
    .setFontWeight('bold');

  // Buscar columnas importantes
  const headers = koboData[0];
  let colArea = -1;
  let colPrograma = -1;
  let colNombre = -1;

  for (let i = 0; i < headers.length; i++) {
    const h = headers[i].toString().toLowerCase();
    if (h.includes('área') || h.includes('area') || h.includes('aplica')) {
      colArea = i;
    }
    if (h.includes('programa')) {
      colPrograma = i;
    }
    if (h.includes('nombre completo') || h.includes('derivacion')) {
      colNombre = i;
    }
  }

  // Agregar análisis de datos
  let fila = 6;
  hojaDebug.getRange(fila, infoCol).setValue('📋 ANÁLISIS');
  hojaDebug.getRange(fila, infoCol, 1, 2)
    .setBackground('#fbbc04')
    .setFontColor('#000000')
    .setFontWeight('bold');
  fila++;

  if (colArea >= 0) {
    hojaDebug.getRange(fila, infoCol).setValue('Columna "Área":');
    hojaDebug.getRange(fila, infoCol + 1).setValue(headers[colArea]);
    fila++;

    // Mostrar valores únicos en esa columna
    const areasUnicas = new Set();
    for (let i = 1; i < koboData.length; i++) {
      if (koboData[i][colArea]) {
        areasUnicas.add(koboData[i][colArea].toString());
      }
    }

    hojaDebug.getRange(fila, infoCol).setValue('Áreas encontradas:');
    fila++;
    areasUnicas.forEach(area => {
      hojaDebug.getRange(fila, infoCol + 1).setValue(area);
      // Marcar si coincide con filtro
      const areaNorm = area.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (areaNorm.includes(CONFIG_REFERENCIAS.FILTRO_PROGRAMA)) {
        hojaDebug.getRange(fila, infoCol + 2).setValue('✅ COINCIDE');
        hojaDebug.getRange(fila, infoCol + 2).setBackground('#c8e6c9');
      } else {
        hojaDebug.getRange(fila, infoCol + 2).setValue('❌ NO COINCIDE');
        hojaDebug.getRange(fila, infoCol + 2).setBackground('#ffcdd2');
      }
      fila++;
    });
  } else {
    hojaDebug.getRange(fila, infoCol).setValue('⚠️ No se encontró');
    hojaDebug.getRange(fila, infoCol + 1).setValue('columna de Área');
    fila++;
  }

  ss.setActiveSheet(hojaDebug);
  ss.toast('✅ Datos descargados. Revisa la hoja "DEBUG - Datos Kobo"', 'Completado', 5);

  let mensaje = '✅ Datos Descargados\n\n';
  mensaje += 'Se descargaron ' + (koboData.length - 1) + ' registros de Kobo.\n\n';
  mensaje += 'Revisa la hoja "DEBUG - Datos Kobo" para ver:\n';
  mensaje += '• Todos los datos tal como vienen de Kobo\n';
  mensaje += '• Las columnas disponibles\n';
  mensaje += '• Los valores en cada campo\n';
  mensaje += '• Análisis de qué áreas coinciden con el filtro\n\n';
  mensaje += '💡 Filtro actual: "' + CONFIG_REFERENCIAS.FILTRO_PROGRAMA + '"\n';
  mensaje += '   (debe estar en la columna de Área/Programa)';

  ui.alert('🔍 Diagnóstico Completo', mensaje, ui.ButtonSet.OK);
}

/**
 * ========================================================================
 * ANÁLISIS DETALLADO FILA POR FILA
 * ========================================================================
 * Muestra exactamente qué ve el código en cada registro y por qué se filtra
 */
function analizarFiltroDetallado() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  ss.toast('Analizando filtros...', '🔬 Análisis Detallado', 5);

  // Descargar datos
  let csvData;
  try {
    const response = UrlFetchApp.fetch(CONFIG_REFERENCIAS.KOBO_URL);
    csvData = response.getContentText('UTF-8');
  } catch (e) {
    ui.alert('Error', 'No se pudo conectar a Kobo: ' + e.message, ui.ButtonSet.OK);
    return;
  }

  let koboData;
  try {
    koboData = Utilities.parseCsv(csvData, ';');
  } catch (e) {
    koboData = parsearCSVManualIL(csvData, ';');
  }

  if (!koboData || koboData.length <= 1) {
    ui.alert('Sin Datos', 'No hay datos en Kobo para analizar.', ui.ButtonSet.OK);
    return;
  }

  const headersKobo = koboData[0];

  // Mapeo dinámico (igual que en la función de importación)
  const indKobo = {
    uuid: buscarIndiceColumnaRef(headersKobo, ['_uuid', 'uuid']),
    programa: buscarIndiceColumnaRef(headersKobo, ['programa que refiere', 'programa']),
    nombre: buscarIndiceColumnaRef(headersKobo, ['nombre completo', 'nombre de la derivacion', 'derivacion']),
    aplica: buscarIndiceColumnaRef(headersKobo, ['en qué área', 'aplica para puesto', 'área de interés', 'interesado', 'area', 'área', 'programa de interés', 'servicio', 'formación'])
  };

  // Crear hoja de análisis
  let hojaAnalisis = ss.getSheetByName('DEBUG - Análisis Filtro');
  if (hojaAnalisis) {
    hojaAnalisis.clear();
  } else {
    hojaAnalisis = ss.insertSheet('DEBUG - Análisis Filtro');
  }

  // Encabezados del análisis
  const encabezados = [
    'Fila',
    'Nombre',
    'Programa (columna)',
    'Área/Interés (columna)',
    'Textos Combinados',
    'Contiene palabras clave?',
    'Estado',
    'Razón'
  ];

  hojaAnalisis.getRange(1, 1, 1, encabezados.length).setValues([encabezados]);
  hojaAnalisis.getRange(1, 1, 1, encabezados.length)
    .setBackground('#4285f4')
    .setFontColor('#ffffff')
    .setFontWeight('bold');

  const resultados = [];

  // Analizar cada fila
  for (let i = 1; i < koboData.length; i++) {
    const filaKobo = koboData[i];
    const fila = i + 1; // +1 porque en Sheets las filas empiezan en 1, +1 más por encabezado

    const uuidActual = indKobo.uuid >= 0 ? filaKobo[indKobo.uuid].toString().trim() : '';
    const nombreRef = indKobo.nombre >= 0 ? filaKobo[indKobo.nombre].toString().trim() : '';
    const programaBruto = indKobo.programa >= 0 ? filaKobo[indKobo.programa].toString().trim() : '';
    const areaAplica = indKobo.aplica >= 0 ? filaKobo[indKobo.aplica].toString().trim() : '';

    // Combinar textos para análisis
    const textosCombinados = [areaAplica, programaBruto].join(' ').toLowerCase();

    let estado = '';
    let razon = '';
    let cumpleFiltro = false;

    // Verificar UUID y nombre
    if (!uuidActual) {
      estado = '❌ INVÁLIDO';
      razon = 'Sin UUID';
    } else if (!nombreRef) {
      estado = '❌ INVÁLIDO';
      razon = 'Sin nombre';
    } else {
      // Aplicar el MISMO filtro MEJORADO que usa la función de importación
      const filtroNorm = textosCombinados.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      // Buscar todas las palabras clave de Tecnología
      const esTecnologia = filtroNorm.includes(CONFIG_REFERENCIAS.FILTRO_PROGRAMA) ||
                           filtroNorm.includes('marketing') ||
                           filtroNorm.includes('programacion') ||
                           filtroNorm.includes('alfabetizacion') ||
                           filtroNorm.includes('microsoft') ||
                           filtroNorm.includes('servicio al cliente');

      cumpleFiltro = esTecnologia;

      if (cumpleFiltro) {
        estado = '✅ PASA FILTRO';
        razon = 'Encontró palabras clave de Tecnología';
      } else {
        estado = '❌ FILTRADO';
        razon = 'NO contiene palabras clave de Tecnología';
      }
    }

    resultados.push([
      fila,
      nombreRef || '(vacío)',
      programaBruto || '(vacío)',
      areaAplica || '(vacío)',
      textosCombinados || '(vacío)',
      cumpleFiltro ? 'SÍ' : 'NO',
      estado,
      razon
    ]);
  }

  // Escribir resultados
  if (resultados.length > 0) {
    hojaAnalisis.getRange(2, 1, resultados.length, encabezados.length).setValues(resultados);

    // Colorear según estado
    for (let i = 0; i < resultados.length; i++) {
      const filaSheet = i + 2;
      const estado = resultados[i][6];

      if (estado === '✅ PASA FILTRO') {
        hojaAnalisis.getRange(filaSheet, 7).setBackground('#c8e6c9'); // Verde
      } else if (estado === '❌ FILTRADO') {
        hojaAnalisis.getRange(filaSheet, 7).setBackground('#ffcdd2'); // Rojo
      } else {
        hojaAnalisis.getRange(filaSheet, 7).setBackground('#fff9c4'); // Amarillo
      }
    }
  }

  // Agregar información adicional
  const infoCol = encabezados.length + 2;
  hojaAnalisis.getRange(1, infoCol).setValue('📊 RESUMEN');
  hojaAnalisis.getRange(1, infoCol, 1, 2)
    .setBackground('#34a853')
    .setFontColor('#ffffff')
    .setFontWeight('bold');

  let pasanFiltro = 0;
  let filtrados = 0;
  let invalidos = 0;

  resultados.forEach(r => {
    if (r[6] === '✅ PASA FILTRO') pasanFiltro++;
    else if (r[6] === '❌ FILTRADO') filtrados++;
    else invalidos++;
  });

  hojaAnalisis.getRange(2, infoCol).setValue('Total registros:');
  hojaAnalisis.getRange(2, infoCol + 1).setValue(resultados.length);

  hojaAnalisis.getRange(3, infoCol).setValue('✅ Pasan filtro:');
  hojaAnalisis.getRange(3, infoCol + 1).setValue(pasanFiltro);
  hojaAnalisis.getRange(3, infoCol + 1).setBackground('#c8e6c9');

  hojaAnalisis.getRange(4, infoCol).setValue('❌ Filtrados:');
  hojaAnalisis.getRange(4, infoCol + 1).setValue(filtrados);
  hojaAnalisis.getRange(4, infoCol + 1).setBackground('#ffcdd2');

  hojaAnalisis.getRange(5, infoCol).setValue('⚠️ Inválidos:');
  hojaAnalisis.getRange(5, infoCol + 1).setValue(invalidos);
  hojaAnalisis.getRange(5, infoCol + 1).setBackground('#fff9c4');

  hojaAnalisis.getRange(7, infoCol).setValue('🔍 Filtro usado:');
  hojaAnalisis.getRange(7, infoCol + 1).setValue(CONFIG_REFERENCIAS.FILTRO_PROGRAMA);

  hojaAnalisis.getRange(8, infoCol).setValue('📝 Columna analizada:');
  hojaAnalisis.getRange(8, infoCol + 1).setValue(
    indKobo.aplica >= 0 ? headersKobo[indKobo.aplica] : 'NO ENCONTRADA'
  );

  // Auto-ajustar columnas
  hojaAnalisis.autoResizeColumns(1, encabezados.length);
  hojaAnalisis.setFrozenRows(1);

  ss.setActiveSheet(hojaAnalisis);
  ss.toast('✅ Análisis completado', 'Listo', 3);

  let mensaje = '🔬 Análisis Detallado Completado\n\n';
  mensaje += 'Registros totales: ' + resultados.length + '\n';
  mensaje += '✅ Pasan filtro: ' + pasanFiltro + '\n';
  mensaje += '❌ Filtrados: ' + filtrados + '\n';
  mensaje += '⚠️ Inválidos: ' + invalidos + '\n\n';
  mensaje += 'Revisa la hoja "DEBUG - Análisis Filtro" para ver\n';
  mensaje += 'EXACTAMENTE qué está viendo el código en cada registro\n';
  mensaje += 'y por qué se filtra o se acepta.';

  ui.alert('🔬 Análisis Completo', mensaje, ui.ButtonSet.OK);
}

/**
 * ========================================================================
 * FUNCIÓN DE DIAGNÓSTICO: Ver datos de Kobo y filtros aplicados
 * ========================================================================
 * Esta función muestra información detallada sobre los datos en Kobo
 * y por qué algunos registros no se están importando.
 */
function diagnosticarReferenciasKobo() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  ui.alert('🔍 Diagnóstico de Referencias Kobo',
    'Esta función analizará los datos de Kobo y mostrará:\n\n' +
    '• Total de registros en Kobo\n' +
    '• Registros que coinciden con el filtro "' + CONFIG_REFERENCIAS.FILTRO_PROGRAMA + '"\n' +
    '• Registros ya importados\n' +
    '• Registros nuevos disponibles\n\n' +
    'Los resultados se mostrarán en el log y en un mensaje.',
    ui.ButtonSet.OK);

  // Descargar datos de Kobo
  let csvData;
  try {
    ss.toast('Descargando datos de Kobo...', 'Diagnóstico', 5);
    const response = UrlFetchApp.fetch(CONFIG_REFERENCIAS.KOBO_URL);
    csvData = response.getContentText('UTF-8');
  } catch (e) {
    ui.alert('Error', 'No se pudo conectar a KoboToolbox.\nDetalle: ' + e.message, ui.ButtonSet.OK);
    return;
  }

  // Parsear CSV
  let koboData;
  try {
    koboData = Utilities.parseCsv(csvData, ';');
  } catch (e) {
    koboData = parsearCSVManualIL(csvData, ';');
  }

  if (!koboData || koboData.length <= 1) {
    ui.alert('Aviso', 'No hay datos en el formulario de Kobo.', ui.ButtonSet.OK);
    return;
  }

  const headersKobo = koboData[0];
  const totalRegistros = koboData.length - 1; // Sin contar encabezados

  // Mapeo de columnas
  const indKobo = {
    uuid: buscarIndiceColumnaRef(headersKobo, ['_uuid', 'uuid']),
    programaOrigen: buscarIndiceColumnaRef(headersKobo, ['programa que refiere', 'programa']),
    programaDestino: buscarIndiceColumnaRef(headersKobo, ['¿a qué programa se refiere?', 'programa se refiere']),
    nombre: buscarIndiceColumnaRef(headersKobo, ['nombre completo', 'nombre de la derivacion', 'derivacion']),
    aplica: buscarIndiceColumnaRef(headersKobo, ['detalles inclusión laboral / ¿en qué área está interesado/a?', 'en qué área está interesado', 'área está interesado'])
  };

  // Obtener UUIDs ya importados
  let hoja = ss.getSheetByName(CONFIG_REFERENCIAS.NOMBRE_HOJA);
  const uuidsExistentes = new Set();

  if (hoja) {
    const datosHoja = hoja.getDataRange().getValues();
    const headersHoja = datosHoja[0];
    const colUuidHojaIdx = headersHoja.indexOf('_uuid');

    if (colUuidHojaIdx >= 0) {
      for (let i = 1; i < datosHoja.length; i++) {
        if (datosHoja[i][colUuidHojaIdx]) {
          uuidsExistentes.add(datosHoja[i][colUuidHojaIdx].toString().trim());
        }
      }
    }
  }

  // Analizar registros
  let registrosFiltrados = 0;
  let registrosYaImportados = 0;
  let registrosNuevos = 0;
  let registrosInvalidos = 0;
  const areasEncontradas = new Set();
  const programasEncontrados = new Set();

  Logger.log('=== DIAGNÓSTICO DE REFERENCIAS KOBO ===');
  Logger.log('URL: ' + CONFIG_REFERENCIAS.KOBO_URL);
  Logger.log('Filtro aplicado: "' + CONFIG_REFERENCIAS.FILTRO_PROGRAMA + '"');
  Logger.log('Total de registros en Kobo: ' + totalRegistros);
  Logger.log('');

  for (let i = 1; i < koboData.length; i++) {
    const filaKobo = koboData[i];
    const uuidActual = indKobo.uuid >= 0 ? filaKobo[indKobo.uuid].toString().trim() : '';
    const nombreRef = indKobo.nombre >= 0 ? filaKobo[indKobo.nombre].toString().trim() : '';
    const programaDestino = indKobo.programaDestino >= 0 ? filaKobo[indKobo.programaDestino].toString().trim() : '';
    const areaAplica = indKobo.aplica >= 0 ? filaKobo[indKobo.aplica].toString().trim() : '';

    // Registrar áreas y programas encontrados
    if (areaAplica) areasEncontradas.add(areaAplica);
    if (programaDestino) programasEncontrados.add(programaDestino);

    // Verificar si es válido
    if (!uuidActual || !nombreRef) {
      registrosInvalidos++;
      Logger.log('Registro ' + i + ' INVÁLIDO (sin UUID o nombre)');
      continue;
    }

    // Verificar filtro: primero que sea "Inclusión Laboral"
    const programaDestinoNorm = programaDestino.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (!programaDestinoNorm.includes('inclusion laboral')) {
      registrosFiltrados++;
      Logger.log('Registro ' + i + ' FILTRADO: Programa destino "' + programaDestino + '" no es "Inclusión Laboral"');
      continue;
    }

    // Luego verificar que el área sea Tecnología
    const areaAplicaNorm = areaAplica.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const esTecnologia = areaAplicaNorm.includes('tecnologia') ||
                         areaAplicaNorm.includes('marketing') ||
                         areaAplicaNorm.includes('programacion') ||
                         areaAplicaNorm.includes('alfabetizacion') ||
                         areaAplicaNorm.includes('microsoft') ||
                         areaAplicaNorm.includes('servicio al cliente');

    if (!esTecnologia) {
      registrosFiltrados++;
      Logger.log('Registro ' + i + ' FILTRADO: Área "' + areaAplica + '" no es Tecnología');
      continue;
    }

    // Verificar si ya fue importado
    if (uuidsExistentes.has(uuidActual)) {
      registrosYaImportados++;
      Logger.log('Registro ' + i + ' YA IMPORTADO: ' + nombreRef);
    } else {
      registrosNuevos++;
      Logger.log('Registro ' + i + ' NUEVO: ' + nombreRef + ' (Área: ' + areaAplica + ')');
    }
  }

  Logger.log('');
  Logger.log('=== RESUMEN ===');
  Logger.log('Total en Kobo: ' + totalRegistros);
  Logger.log('Inválidos (sin UUID/nombre): ' + registrosInvalidos);
  Logger.log('Filtrados (no son Inclusión Laboral - Tecnología): ' + registrosFiltrados);
  Logger.log('Ya importados: ' + registrosYaImportados);
  Logger.log('Nuevos disponibles: ' + registrosNuevos);
  Logger.log('');
  Logger.log('Áreas encontradas en Kobo:');
  areasEncontradas.forEach(area => Logger.log('  - ' + area));
  Logger.log('');
  Logger.log('Programas destino encontrados en Kobo:');
  programasEncontrados.forEach(prog => Logger.log('  - ' + prog));

  // Mostrar resultado al usuario
  let mensaje = '📊 DIAGNÓSTICO COMPLETO\n\n';
  mensaje += '📋 Total de registros en Kobo: ' + totalRegistros + '\n\n';
  mensaje += '❌ Inválidos (sin UUID/nombre): ' + registrosInvalidos + '\n';
  mensaje += '🔍 Filtrados (no son Inclusión Laboral - Tecnología): ' + registrosFiltrados + '\n';
  mensaje += '✅ Ya importados anteriormente: ' + registrosYaImportados + '\n';
  mensaje += '🆕 Nuevos disponibles para importar: ' + registrosNuevos + '\n\n';

  if (areasEncontradas.size > 0) {
    mensaje += '📌 Áreas encontradas en Kobo:\n';
    areasEncontradas.forEach(area => mensaje += '  • ' + area + '\n');
  }

  if (programasEncontrados.size > 0) {
    mensaje += '\n📍 Programas destino encontrados:\n';
    programasEncontrados.forEach(prog => mensaje += '  • ' + prog + '\n');
  }

  mensaje += '\n💡 TIP: Solo se importan referencias a "Inclusión Laboral" con área "Tecnología".\n';
  mensaje += 'Si no ves registros nuevos, verifica el programa destino y el área de interés.\n\n';
  mensaje += '📝 Revisa la consola (Ver → Registros) para más detalles.';

  ui.alert('🔍 Diagnóstico Completo', mensaje, ui.ButtonSet.OK);

  // Si hay registros nuevos, preguntar si desea importar
  if (registrosNuevos > 0) {
    const respuesta = ui.alert('Importar Ahora',
      '¿Deseas importar los ' + registrosNuevos + ' registros nuevos ahora?',
      ui.ButtonSet.YES_NO);

    if (respuesta === ui.Button.YES) {
      importarReferenciasNuevas(false);
    }
  }
}

/**
 * ========================================================================
 * IMPORTAR TODAS LAS REFERENCIAS (SIN FILTRO DE PROGRAMA)
 * ========================================================================
 * Útil para diagnóstico o cuando se quiere ver TODOS los datos de Kobo
 */
function importarTodasReferencias() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const confirmar = ui.alert('⚠️ Importar TODAS las referencias',
    'Esta opción importará TODOS los registros de Kobo,\n' +
    'sin filtrar por programa.\n\n' +
    '¿Estás seguro de continuar?',
    ui.ButtonSet.YES_NO);

  if (confirmar !== ui.Button.YES) {
    return;
  }

  let hoja = ss.getSheetByName(CONFIG_REFERENCIAS.NOMBRE_HOJA);
  if (!hoja) {
    hoja = crearHojaReferencias();
  }

  let csvData;
  try {
    ss.toast('Descargando datos de Kobo...', 'Importando', 5);
    const response = UrlFetchApp.fetch(CONFIG_REFERENCIAS.KOBO_URL);
    csvData = response.getContentText('UTF-8');
  } catch (e) {
    ui.alert('Error', 'No se pudo conectar a KoboToolbox.\nDetalle: ' + e.message, ui.ButtonSet.OK);
    return;
  }

  let koboData;
  try {
    koboData = Utilities.parseCsv(csvData, ';');
  } catch (e) {
    koboData = parsearCSVManualIL(csvData, ';');
  }

  if (!koboData || koboData.length <= 1) {
    ui.alert('Aviso', 'No hay datos en el formulario de Kobo.', ui.ButtonSet.OK);
    return;
  }

  const headersKobo = koboData[0];

  const indKobo = {
    fecha: buscarIndiceColumnaRef(headersKobo, ['start', '_submission_time']),
    uuid: buscarIndiceColumnaRef(headersKobo, ['_uuid', 'uuid']),
    programa: buscarIndiceColumnaRef(headersKobo, ['programa que refiere', 'programa']),
    responsable: buscarIndiceColumnaRef(headersKobo, ['responsable que deriva', 'nombre del responsable', 'responsable']),
    nombre: buscarIndiceColumnaRef(headersKobo, ['nombre completo', 'nombre de la derivacion', 'derivacion']),
    dpi: buscarIndiceColumnaRef(headersKobo, ['dpi / cui', 'cui', 'dpi']),
    edad: buscarIndiceColumnaRef(headersKobo, ['edad']),
    telefono: buscarIndiceColumnaRef(headersKobo, ['telefono', 'teléfono', 'tel', 'celular']),
    nivelEdu: buscarIndiceColumnaRef(headersKobo, ['último nivel académico aprobado', 'nivel educativo', 'nivel académico', 'nivel cursado', 'escolaridad', 'grado académico', 'nivel de estudios', 'estudios', 'educación']),
    zona: buscarIndiceColumnaRef(headersKobo, ['zona / colonia', 'zona de residencia', 'zona', 'colonia']),
    aplica: buscarIndiceColumnaRef(headersKobo, ['en qué área', 'aplica para puesto', 'área de interés', 'interesado', 'area', 'área', 'programa de interés', 'servicio', 'formación']),
    observaciones: buscarIndiceColumnaRef(headersKobo, ['observaciones', 'comentarios', 'notas'])
  };

  const datosHoja = hoja.getDataRange().getValues();
  const headersHoja = datosHoja[0];
  const colUuidHojaIdx = headersHoja.indexOf('_uuid');

  const uuidsExistentes = new Set();
  if (colUuidHojaIdx >= 0) {
    for (let i = 1; i < datosHoja.length; i++) {
      if (datosHoja[i][colUuidHojaIdx]) {
        uuidsExistentes.add(datosHoja[i][colUuidHojaIdx].toString().trim());
      }
    }
  }

  let nuevosAgregados = 0;
  const nuevasFilas = [];

  for (let i = 1; i < koboData.length; i++) {
    const filaKobo = koboData[i];
    const uuidActual = indKobo.uuid >= 0 ? filaKobo[indKobo.uuid].toString().trim() : '';
    const nombreRef = indKobo.nombre >= 0 ? filaKobo[indKobo.nombre].toString().trim() : '';

    if (!uuidActual || !nombreRef) continue;

    // SIN FILTRO DE PROGRAMA - importar todo

    if (!uuidsExistentes.has(uuidActual)) {
      const nuevaFila = new Array(headersHoja.length).fill('');

      const setVal = (nombreCol, valor) => {
        const idx = headersHoja.indexOf(nombreCol);
        if (idx >= 0) nuevaFila[idx] = valor;
      };

      const programaBruto = indKobo.programa >= 0 ? filaKobo[indKobo.programa] : '';
      const areaAplica = indKobo.aplica >= 0 ? filaKobo[indKobo.aplica] : '';

      setVal('Fecha', indKobo.fecha >= 0 ? filaKobo[indKobo.fecha] : '');
      setVal('_uuid', uuidActual);
      setVal('Programa', programaBruto);
      setVal('Nombre del responsable que deriva', indKobo.responsable >= 0 ? filaKobo[indKobo.responsable] : '');
      setVal('Nombre Completo (según DPI)', nombreRef);
      setVal('DPI', indKobo.dpi >= 0 ? filaKobo[indKobo.dpi] : '');
      setVal('Edad', indKobo.edad >= 0 ? filaKobo[indKobo.edad] : '');
      setVal('Teléfono', indKobo.telefono >= 0 ? filaKobo[indKobo.telefono] : '');
      setVal('Nivel educativo', indKobo.nivelEdu >= 0 ? filaKobo[indKobo.nivelEdu] : '');
      setVal('zona', indKobo.zona >= 0 ? filaKobo[indKobo.zona] : '');
      setVal('¿En qué área está interesado/a?', areaAplica);
      setVal('Observaciones / Comentarios adicionales', indKobo.observaciones >= 0 ? filaKobo[indKobo.observaciones] : '');
      setVal('¿Se realizó hoja de interés?', 'No');

      nuevasFilas.push(nuevaFila);
      uuidsExistentes.add(uuidActual);
      nuevosAgregados++;
    }
  }

  if (nuevasFilas.length > 0) {
    const ultimaFilaConDatos = hoja.getLastRow();
    hoja.getRange(ultimaFilaConDatos + 1, 1, nuevasFilas.length, nuevasFilas[0].length).setValues(nuevasFilas);

    const colAccionIdx = headersHoja.indexOf('¿Se realizó hoja de interés?') + 1;
    if (colAccionIdx > 0) {
      hoja.getRange(ultimaFilaConDatos + 1, colAccionIdx, nuevasFilas.length, 1)
        .setBackground('#ffcdd2');
    }

    ui.alert('Éxito', 'Se importaron ' + nuevosAgregados + ' referencias nuevas (SIN filtro de programa).', ui.ButtonSet.OK);
  } else {
    ui.alert('Información', 'No hay registros nuevos en Kobo (todos ya fueron importados).', ui.ButtonSet.OK);
  }
}

function procesarAccionReferencias(sheet, fila, accion) {
  // Solo procesar cuando se marca "Se realizó hoja de interés"
  if (accion === CONFIG_REFERENCIAS.OPCION_ENVIAR) {
    // Marcar con color verde (ya se realizó hoja de interés)
    const headersRef = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const colAccion = headersRef.indexOf('¿Se realizó hoja de interés?') + 1;
    if (colAccion > 0) {
      sheet.getRange(fila, colAccion).setBackground('#c8e6c9'); // Verde claro
    }
    SpreadsheetApp.getActiveSpreadsheet().toast('✅ Marcado como hoja de interés realizada', 'Actualizado', 3);
  } else if (accion === 'No') {
    // Marcar con color rojo (no se ha realizado)
    const headersRef = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const colAccion = headersRef.indexOf('¿Se realizó hoja de interés?') + 1;
    if (colAccion > 0) {
      sheet.getRange(fila, colAccion).setBackground('#ffcdd2'); // Rojo claro
    }
  }
}

// =====================================================================
// REPARACIÓN DE HOJA DE INTERÉS
// =====================================================================

/**
 * Repara la Hoja de Interés eliminándola y recreándola con estructura correcta
 * IMPORTANTE: Hace backup automático antes de eliminar
 */
function repararHojaInteresTech() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  // Confirmar acción
  const respuesta = ui.alert(
    '⚠️ Reparar Hoja de Interés',
    '⚠️ ATENCIÓN: Esta acción hará lo siguiente:\n\n' +
    '1. Creará un BACKUP de tu Hoja de Interés actual\n' +
    '2. Eliminará la Hoja de Interés\n' +
    '3. La recreará con la estructura correcta\n' +
    '4. Te permitirá restaurar los datos del backup\n\n' +
    '⚠️ El backup se llamará "Hoja de Interés (BACKUP AAAA-MM-DD)"\n\n' +
    '¿Deseas continuar?',
    ui.ButtonSet.YES_NO
  );

  if (respuesta !== ui.Button.YES) {
    ss.toast('❌ Operación cancelada', 'Reparación cancelada', 3);
    return;
  }

  try {
    const hojaOriginal = ss.getSheetByName('Hoja de Interés');

    if (!hojaOriginal) {
      ui.alert('❌ Error', 'No se encontró la Hoja de Interés', ui.ButtonSet.OK);
      return;
    }

    // PASO 1: Crear backup
    ss.toast('📋 Creando backup...', 'Reparación', 3);
    const fechaBackup = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm');
    const nombreBackup = 'Hoja de Interés (BACKUP ' + fechaBackup + ')';
    const backup = hojaOriginal.copyTo(ss);
    backup.setName(nombreBackup);
    backup.setTabColor('#ff9800'); // Naranja para identificar backup

    // PASO 2: Eliminar hoja original
    ss.toast('🗑️ Eliminando hoja original...', 'Reparación', 3);
    ss.deleteSheet(hojaOriginal);

    // PASO 3: Recrear con estructura correcta
    ss.toast('🔨 Recreando con estructura correcta...', 'Reparación', 3);
    const nuevaHoja = ss.insertSheet('Hoja de Interés');

    // Llamar a la función de creación
    crearHojaInteres();

    // PASO 4: Mover la nueva hoja al principio
    ss.setActiveSheet(nuevaHoja);
    ss.moveActiveSheet(1);

    // PASO 5: Preguntar si quiere restaurar datos
    const restaurar = ui.alert(
      '✅ Hoja recreada correctamente',
      '✅ La Hoja de Interés se ha recreado con la estructura correcta.\n\n' +
      '📋 Tu backup está en: "' + nombreBackup + '"\n\n' +
      '¿Deseas restaurar los datos del backup?\n' +
      '(Esto copiará todas las filas de datos, excepto los encabezados)',
      ui.ButtonSet.YES_NO
    );

    if (restaurar === ui.Button.YES) {
      ss.toast('📥 Restaurando datos...', 'Reparación', 3);

      // Obtener datos del backup (sin encabezados)
      const datosBackup = backup.getDataRange().getValues();
      if (datosBackup.length > 1) {
        const soloDatos = datosBackup.slice(1); // Saltar encabezados

        // Pegar datos en la nueva hoja (desde fila 2)
        nuevaHoja.getRange(2, 1, soloDatos.length, soloDatos[0].length).setValues(soloDatos);

        ui.alert(
          '✅ Reparación completada',
          '✅ La Hoja de Interés se reparó exitosamente\n\n' +
          '📊 Datos restaurados: ' + soloDatos.length + ' registros\n' +
          '📋 Backup disponible en: "' + nombreBackup + '"\n\n' +
          '🔄 Ahora puedes usar "Actualizar Notas desde Kobo" para corregir las notas',
          ui.ButtonSet.OK
        );
      }
    } else {
      ui.alert(
        '✅ Reparación completada',
        '✅ La Hoja de Interés se recreó con la estructura correcta\n\n' +
        '📋 Tu backup está en: "' + nombreBackup + '"\n\n' +
        '💡 Puedes copiar los datos manualmente desde el backup si lo necesitas',
        ui.ButtonSet.OK
      );
    }

    ss.toast('✅ Reparación completada exitosamente', 'Éxito', 5);

  } catch (error) {
    Logger.log('ERROR en repararHojaInteresTech: ' + error);
    ui.alert('❌ Error', 'Error al reparar la Hoja de Interés:\n' + error.message, ui.ButtonSet.OK);
  }
}

// =====================================================================
// HELPERS REFERENCE
// =====================================================================

function buscarIndiceColumnaRef(headers, posiblesNombres) {
  for (let i = 0; i < headers.length; i++) {
    const headerNorm = headers[i].toString().toLowerCase().trim();
    for (let j = 0; j < posiblesNombres.length; j++) {
      if (headerNorm.includes(posiblesNombres[j].toLowerCase())) {
        return i;
      }
    }
  }
  return -1;
}

function parsearCSVManualIL(csvData, separador) {
  const lineas = csvData.split('\n');
  const resultado = [];
  for (let i = 0; i < lineas.length; i++) {
    const linea = lineas[i].trim();
    if (!linea) continue;
    resultado.push(linea.split(separador));
  }
  return resultado;
}

function obtenerPrimeraFilaVaciaRef(sheet, colLetra) {
  const valores = sheet.getRange(colLetra + '1:' + colLetra).getValues();
  for (let i = valores.length - 1; i >= 0; i--) {
    if (valores[i][0] && valores[i][0].toString().trim() !== '') {
      return i + 2;
    }
  }
  return 2;
}
// =====================================================================
// MÓDULO DE ESTIPENDIOS - INTEGRADO
// =====================================================================
// Este código se agrega AL FINAL de AlimentosBebidas.gs y tech.gs
// Usa solo 2 hojas nuevas + modifica "Cohortes" existente
// =====================================================================

// =====================================================================
// CONFIGURACIÓN DE ESTIPENDIOS
// =====================================================================

// INSTRUCCIÓN: Agregar estas líneas dentro del CONFIG_AB o CONFIG_TECH existente:
/*
  // === ESTIPENDIOS ===
  KOBO_ESTIPENDIOS_URL: 'https://kf.kobotoolbox.org/api/v2/assets/ay7MxyzvXBGGakXG7jkAE3/export-settings/esS6RKmzxXxn3qK87Jwxgrt/data.csv',
  KOBO_TOKEN: '64cc018b88067397addd36b09288be8b6539cf39',
  EMAIL_ALERTAS_ESTIPENDIOS: 'adrian@example.com', // Cambiar por tu email
*/

// =====================================================================
// FUNCIÓN PRINCIPAL: INSTALAR SISTEMA DE ESTIPENDIOS
// =====================================================================

/**
 * Instala el sistema de estipendios
 * - Agrega columnas a la hoja Cohortes existente (sin borrar nada)
 * - Crea hoja Estipendios (solo pagos)
 * - Crea hoja Dashboard Estipendios (KPIs + calendario + auditoría)
 */
function instalarSistemaEstipendios() {
  try {
    const ui = SpreadsheetApp.getUi();
    const respuesta = ui.alert(
      '💰 Instalar Sistema de Estipendios',
      '¿Deseas instalar el sistema de estipendios?\n\n' +
      'Se realizarán los siguientes cambios:\n\n' +
      '✅ Agregar columnas de presupuesto a la hoja "Cohortes" (no se perderán datos)\n' +
      '✅ Crear hoja "Estipendios" (registro de pagos)\n' +
      '✅ Crear hoja "Dashboard Estipendios" (KPIs y reportes)\n\n' +
      '¿Continuar?',
      ui.ButtonSet.YES_NO
    );

    if (respuesta !== ui.Button.YES) {
      return;
    }

    SpreadsheetApp.getActiveSpreadsheet().toast('Instalando sistema de estipendios...', '💰 Estipendios', 5);

    // 1. Modificar hoja Cohortes
    agregarColumnasPresupuestoACohortes();

    // 2. Crear hoja Estipendios
    crearHojaEstipendios();

    // 3. Crear hoja Dashboard
    crearHojaDashboardEstipendios();

    SpreadsheetApp.getActiveSpreadsheet().toast('✅ Sistema instalado correctamente', 'Éxito', 5);

    ui.alert(
      '✅ Instalación Completa',
      'El sistema de estipendios se instaló correctamente:\n\n' +
      '✅ Hoja "Cohortes" actualizada con columnas de presupuesto\n' +
      '✅ Hoja "Estipendios" creada\n' +
      '✅ Hoja "Dashboard Estipendios" creada\n\n' +
      'Próximos pasos:\n' +
      '1. Configura presupuestos en la hoja "Cohortes"\n' +
      '2. Ejecuta: Estipendios → Importar Desde Kobo\n' +
      '3. Activa actualización automática',
      ui.ButtonSet.OK
    );

  } catch (error) {
    Logger.log('Error instalando sistema de estipendios: ' + error.message);
    SpreadsheetApp.getActiveSpreadsheet().toast('❌ Error: ' + error.message, 'Error', 10);
  }
}

// =====================================================================
// FUNCIÓN: AGREGAR COLUMNAS A COHORTES
// =====================================================================

/**
 * Agrega columnas de presupuesto a la hoja Cohortes existente
 * NO borra ni modifica datos existentes
 */
function agregarColumnasPresupuestoACohortes() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Cohortes');

  if (!sheet) {
    throw new Error('La hoja "Cohortes" no existe');
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  // Columnas a agregar (si no existen)
  const columnasNuevas = [
    'Presupuesto Curso (Q)',
    'Presupuesto Prácticas (Q)',
    'Presupuesto Total (Q)',
    'Gastado a la Fecha (Q)',
    'Disponible (Q)',
    '% Ejecución',
    'Donador/Financiador'
  ];

  let ultimaColumna = sheet.getLastColumn();

  columnasNuevas.forEach(nombreCol => {
    // Verificar si ya existe
    if (!headers.includes(nombreCol)) {
      ultimaColumna++;
      sheet.getRange(1, ultimaColumna).setValue(nombreCol);

      // Formato header
      sheet.getRange(1, ultimaColumna)
        .setFontWeight('bold')
        .setBackground('#4285f4')
        .setFontColor('#ffffff');

      // Agregar fórmulas en fila 2 (ejemplo)
      if (nombreCol === 'Presupuesto Total (Q)') {
        const colCurso = headers.indexOf('Presupuesto Curso (Q)') + 1 || ultimaColumna - 2;
        const colPracticas = headers.indexOf('Presupuesto Prácticas (Q)') + 1 || ultimaColumna - 1;
        const colLetraCurso = columnToLetter(colCurso);
        const colLetraPracticas = columnToLetter(colPracticas);
        sheet.getRange(2, ultimaColumna).setFormula(`=${colLetraCurso}2+${colLetraPracticas}2`);
        sheet.getRange(2, ultimaColumna).setNumberFormat('"Q"#,##0.00');
      }

      if (nombreCol === 'Gastado a la Fecha (Q)') {
        const colID = 1; // Asumiendo que ID Cohorte está en columna A
        sheet.getRange(2, ultimaColumna).setFormula(`=SUMIF(Estipendios!E:E,A2,Estipendios!H:H)`);
        sheet.getRange(2, ultimaColumna).setNumberFormat('"Q"#,##0.00');
      }

      if (nombreCol === 'Disponible (Q)') {
        const colTotal = headers.indexOf('Presupuesto Total (Q)') + 1 || ultimaColumna - 2;
        const colGastado = ultimaColumna - 1;
        const colLetraTotal = columnToLetter(colTotal);
        const colLetraGastado = columnToLetter(colGastado);
        sheet.getRange(2, ultimaColumna).setFormula(`=${colLetraTotal}2-${colLetraGastado}2`);
        sheet.getRange(2, ultimaColumna).setNumberFormat('"Q"#,##0.00');
      }

      if (nombreCol === '% Ejecución') {
        const colGastado = ultimaColumna - 2;
        const colTotal = ultimaColumna - 3;
        const colLetraGastado = columnToLetter(colGastado);
        const colLetraTotal = columnToLetter(colTotal);
        sheet.getRange(2, ultimaColumna).setFormula(`=IF(${colLetraTotal}2>0,${colLetraGastado}2/${colLetraTotal}2,0)`);
        sheet.getRange(2, ultimaColumna).setNumberFormat('0.00%');
      }
    }
  });

  // Formato condicional para % Ejecución
  const colEjecucion = headers.indexOf('% Ejecución') + 1 || ultimaColumna;
  if (colEjecucion > 0) {
    const rango = sheet.getRange(2, colEjecucion, 1000, 1);

    const regla1 = SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThan(0.95)
      .setBackground('#ea4335')
      .setFontColor('#ffffff')
      .setRanges([rango])
      .build();

    const regla2 = SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(0.80, 0.95)
      .setBackground('#fbbc04')
      .setRanges([rango])
      .build();

    const regla3 = SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(0.80)
      .setBackground('#34a853')
      .setFontColor('#ffffff')
      .setRanges([rango])
      .build();

    const reglas = sheet.getConditionalFormatRules();
    reglas.push(regla1, regla2, regla3);
    sheet.setConditionalFormatRules(reglas);
  }

  Logger.log('✅ Columnas de presupuesto agregadas a "Cohortes"');
}

/**
 * Convierte número de columna a letra
 */
function columnToLetter(column) {
  let temp, letter = '';
  while (column > 0) {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
}

// =====================================================================
// FUNCIÓN: CREAR HOJA ESTIPENDIOS
// =====================================================================

/**
 * Crea la hoja Estipendios (solo registro de pagos)
 */
function crearHojaEstipendios() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Estipendios');

  if (sheet) {
    const ui = SpreadsheetApp.getUi();
    const respuesta = ui.alert(
      'La hoja "Estipendios" ya existe',
      '¿Deseas recrearla? (Se perderán los datos existentes)',
      ui.ButtonSet.YES_NO
    );

    if (respuesta === ui.Button.YES) {
      ss.deleteSheet(sheet);
    } else {
      return;
    }
  }

  sheet = ss.insertSheet('Estipendios');

  // Headers — 18 columnas alineadas con import y dashboard
  const headers = [
    'ID Pago',          // A
    'Fecha Registro',   // B
    'ID Participante',  // C (Creamos ID)
    'Nombre Completo',  // D
    'Cohorte',          // E
    'Programa',         // F
    'Tipo Estipendio',  // G (Curso/Prácticas)
    'Monto (Q)',        // H
    'Fecha Programada', // I
    'Fecha Pago Real',  // J
    'Estado',           // K (ARRAYFORMULA — no editar)
    'Método Pago',      // L
    '# Recibo',         // M
    'Responsable',      // N
    'URL Firma',        // O
    'Días Atraso',      // P (ARRAYFORMULA — no editar)
    'Notas',            // Q
    'UUID'              // R (dedup Kobo)
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Formato headers
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#0f9d58')
    .setFontColor('#ffffff')
    .setHorizontalAlignment('center');

  // ARRAYFORMULA en K2 — Estado con guardia: vacío si no hay ID Pago en col A
  sheet.getRange('K2').setFormula(
    '=ARRAYFORMULA(IF(A2:A="","",IF(J2:J<>"","Pagado",IF(I2:I="","Programado",IF(I2:I<TODAY(),"🔴 Atrasado","Programado")))))'
  );
  // ARRAYFORMULA en P2 — Días de atraso con guardia
  sheet.getRange('P2').setFormula(
    '=ARRAYFORMULA(IF(A2:A="","",IF(AND(K2:K<>"Pagado",I2:I<>"",I2:I<TODAY()),TODAY()-I2:I,0)))'
  );

  // Anchos de columna
  sheet.setColumnWidth(1, 120);  // ID Pago
  sheet.setColumnWidth(4, 180);  // Nombre
  sheet.setColumnWidth(5, 150);  // Cohorte
  sheet.setColumnWidth(15, 200); // URL Firma

  // Formato números
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

  // Formato condicional
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

// =====================================================================
// FUNCIÓN: CREAR DASHBOARD ESTIPENDIOS
// =====================================================================

/**
 * Crea la hoja Dashboard Estipendios
 * Contiene: KPIs, Calendario, Resumen por Cohorte, Auditoría
 */
function crearHojaDashboardEstipendios() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Dashboard Estipendios');

  if (sheet) {
    ss.deleteSheet(sheet);
  }

  sheet = ss.insertSheet('Dashboard Estipendios');

  // === TÍTULO ===
  sheet.getRange('A1:H1').merge();
  sheet.getRange('A1').setValue('📊 DASHBOARD DE ESTIPENDIOS');
  sheet.getRange('A1').setFontSize(16).setFontWeight('bold')
    .setBackground('#4285f4').setFontColor('#ffffff')
    .setHorizontalAlignment('center');

  // === SECCIÓN 1: KPIs GLOBALES ===
  sheet.getRange('A3').setValue('📈 KPIs GLOBALES').setFontWeight('bold')
    .setBackground('#e8eaf6').setFontSize(12);

  const kpis = [
    ['KPI', 'Valor'],
    ['Total Presupuestado (Q)',    ''],
    ['Total Gastado (Q)',          ''],
    ['Total Disponible (Q)',       ''],
    ['% Ejecución Global',         ''],
    ['# Cohortes con Estipendios', ''],
    ['# Cohortes Activas',         ''],
    ['Total Pagos Importados',     ''],
    ['Total Monto Pagado (Q)',     ''],
    ['Pagos Atrasados',            '']
  ];
  sheet.getRange(4, 1, kpis.length, 2).setValues(kpis);

  const formulas = [
    '=IFERROR(SUM(Cohortes!Q:Q),0)',
    '=IFERROR(SUM(Cohortes!R:R),0)',
    '=B5-B6',
    '=IFERROR(B6/B5,0)',
    '=IFERROR(COUNTIF(Cohortes!Q:Q,">"&0),0)',
    '=IFERROR(COUNTIF(Cohortes!N:N,"Activa"),0)',
    '=IFERROR(COUNTA(Estipendios!A:A)-1,0)',
    '=IFERROR(SUMIF(Estipendios!A:A,"EST-*",Estipendios!H:H),0)',
    '=IFERROR(COUNTIF(Estipendios!K:K,"*Atrasado*"),0)'
  ];
  formulas.forEach(function(f, i) { sheet.getRange(5 + i, 2).setFormula(f); });

  sheet.getRange('A4:B4').setFontWeight('bold').setBackground('#d9d9d9');
  [5,6,7,12].forEach(function(r) { sheet.getRange('B'+r).setNumberFormat('"Q"#,##0.00'); });
  sheet.getRange('B8').setNumberFormat('0.00%');
  [9,10,11,13].forEach(function(r) { sheet.getRange('B'+r).setNumberFormat('0'); });
  sheet.getRange('A14:C14').clearContent();

  // === SECCIÓN 2: CALENDARIO PRÓXIMOS PAGOS ===
  sheet.getRange('E3').setValue('📅 PRÓXIMOS PAGOS (7 DÍAS)').setFontWeight('bold')
    .setBackground('#e8eaf6').setFontSize(12);

  const headersCalendario = [['Fecha', 'Cohorte', '# Pagos', 'Monto (Q)']];
  sheet.getRange(4, 5, 1, 4).setValues(headersCalendario);
  sheet.getRange('E4:H4').setFontWeight('bold').setBackground('#d9d9d9');
  sheet.getRange('E5').setValue('Ejecuta: Estipendios → Actualizar Dashboard');

  // === SECCIÓN 3: RESUMEN POR COHORTE ===
  sheet.getRange('A16').setValue('📊 RESUMEN POR COHORTE').setFontWeight('bold')
    .setBackground('#e8eaf6').setFontSize(12);
  sheet.getRange(17, 1, 1, 7).setValues([['Cohorte', 'Presupuesto', 'Gastado', 'Disponible', '% Ejec', '# Pagos', 'Estado']]);
  sheet.getRange('A17:G17').setFontWeight('bold').setBackground('#d9d9d9');
  sheet.getRange('A18').setValue('Ejecuta: Estipendios → Actualizar Dashboard');

  // Ajustar columnas
  sheet.setColumnWidths(1, 3, 200);
  sheet.setColumnWidths(5, 4, 120);
  sheet.setFrozenRows(1);

  Logger.log('✅ Hoja "Dashboard Estipendios" creada');
}

// =====================================================================
// FUNCIÓN: IMPORTAR DESDE KOBO
// =====================================================================

/**
 * Importa datos de estipendios desde Kobo
 */
function importarEstipendiosDesdeKobo() {
  try {
    SpreadsheetApp.getActiveSpreadsheet().toast('Importando desde Kobo...', '💰 Estipendios', 5);

    const config = typeof CONFIG_AB !== 'undefined' ? CONFIG_AB : CONFIG_TECH;
    const koboUrl = config.KOBO_ESTIPENDIOS_URL || config.KOBO_URL;
    const token = config.KOBO_TOKEN || '';

    if (!koboUrl) {
      throw new Error('No se ha configurado KOBO_ESTIPENDIOS_URL');
    }

    // Fetch datos
    const options = token ? { headers: { 'Authorization': `Token ${token}` } } : {};
    const response = UrlFetchApp.fetch(koboUrl, options);
    const csv = response.getContentText();

    if (!csv || csv.trim().length === 0) {
      throw new Error('No se obtuvieron datos de Kobo');
    }

    // Parsear CSV — Kobo usa punto y coma como separador
    let data;
    try {
      data = Utilities.parseCsv(csv);
      if (data[0].length < 3) throw new Error('pocas columnas');
    } catch(e) {
      data = Utilities.parseCsv(csv, ';');
    }
    if (!data || data.length <= 1) {
      SpreadsheetApp.getActiveSpreadsheet().toast(
        'ℹ️ El formulario de estipendios aún no tiene respuestas enviadas en Kobo.',
        '💰 Estipendios', 8);
      return;
    }

    const headers = data[0];
    const filas = data.slice(1);

    Logger.log(`✅ ${filas.length} registros obtenidos desde Kobo`);

    // Obtener índices
    const indices = {
      '_uuid':           headers.indexOf('_uuid'),
      'Creamos_ID':      headers.indexOf('Creamos_ID'),
      'Nombre_s':        headers.indexOf('Nombre_s'),
      'Apellido_s':      headers.indexOf('Apellido_s'),
      'Fecha':           headers.indexOf('Fecha'),
      'Proyecto':        headers.indexOf('Proyecto'),
      'Especialidad':    headers.indexOf('Especialidad'),
      'Fase':            headers.indexOf('Fase'),
      'Monto_total':     headers.indexOf('Monto_total'),
      'Comentarios':     headers.indexOf('Comentarios'),
      'Firma':           headers.indexOf('Firma'),
      'Foto_Comprobante':    headers.indexOf('Foto_Comprobante'),
      'Numero_Comprobante':  headers.indexOf('Numero_Comprobante'),
      'Metodo_Pago':     headers.indexOf('Metodo_Pago'),
      'Responsable':     headers.indexOf('Responsable'),
      '_submission_time': headers.indexOf('_submission_time')
    };

    // Procesar datos
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetEstipendios = ss.getSheetByName('Estipendios');

    if (!sheetEstipendios) {
      throw new Error('La hoja "Estipendios" no existe. Ejecuta primero: Estipendios → Instalar Sistema');
    }

    let nuevosRegistros = 0;
    const dataExistente = sheetEstipendios.getDataRange().getValues();

    // Encontrar próxima fila vacía en col A — appendRow falla por ARRAYFORMULA en K
    let nextWriteRow = 2;
    for (let r = dataExistente.length - 1; r >= 1; r--) {
      if (dataExistente[r][0] !== '') { nextWriteRow = r + 2; break; }
    }

    // Dedup por UUID (col R = índice 17)
    const uuidsExistentes = new Set(
      dataExistente.slice(1).map(r => (r[17] || '').toString().trim()).filter(Boolean)
    );

    // Validar Creamos IDs contra Lista Definitiva e Inscritx (una sola lectura)
    const idsValidosTech = new Set();
    let hayValidacionTech = false;
    ['Lista Definitiva', 'Inscritx'].forEach(function(nombre) {
      const h = ss.getSheetByName(nombre);
      if (!h || h.getLastRow() <= 1) return;
      hayValidacionTech = true;
      h.getDataRange().getValues().slice(1).forEach(function(row) {
        row.forEach(function(cell) { if (cell) idsValidosTech.add(cell.toString().trim()); });
      });
    });

    const noEncontradosTech = [];

    // Obtener nombres reales de cohortes para corrección fuzzy
    var nombresCohortesTech = [];
    var shCohTech = ss.getSheetByName('Cohortes');
    if (shCohTech && shCohTech.getLastRow() > 1) {
      nombresCohortesTech = shCohTech.getDataRange().getValues().slice(1)
        .map(function(c) { return (c[0] || '').toString().trim(); })
        .filter(Boolean);
    }

    filas.forEach((fila, index) => {
      try {
        const uuid = indices['_uuid'] >= 0 ? (fila[indices['_uuid']] || '').toString().trim() : '';
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
        const fotoComprobante = indices['Foto_Comprobante'] >= 0 ? fila[indices['Foto_Comprobante']] : '';
        const numeroComprobante = indices['Numero_Comprobante'] >= 0 ? fila[indices['Numero_Comprobante']] : '';
        const metodoPago = indices['Metodo_Pago'] >= 0 ? fila[indices['Metodo_Pago']] : 'Efectivo';
        const responsable = indices['Responsable'] >= 0 ? fila[indices['Responsable']] : '';
        const submissionTime = indices['_submission_time'] >= 0 ? fila[indices['_submission_time']] : '';

        if (!creamosID) return;

        // Dedup por UUID
        if (uuid && uuidsExistentes.has(uuid)) return;

        // Mapear Fase → Tipo
        let tipoEstipendio = '';
        if (fase === 'Teórica') tipoEstipendio = 'Curso';
        else if (fase === 'Práctica' || fase === 'Formación Dual') tipoEstipendio = 'Prácticas';

        // Determinar cohorte desde especialidad
        const año = fecha ? new Date(fecha).getFullYear() : new Date().getFullYear();
        let cohorte = determinarCohorteDesdeEspecialidad(especialidad, año);
        // Corregir nombre de cohorte con nombre real del sheet Cohortes
        const cohorteCorrecta = _buscarNombreCohorteReal(cohorte, nombresCohortesTech);
        if (cohorteCorrecta) cohorte = cohorteCorrecta;

        // Validar Creamos ID en sistema
        if (hayValidacionTech && !idsValidosTech.has(creamosID)) {
          noEncontradosTech.push({ id: creamosID, nombre: `${nombre} ${apellido}`.trim(), cohorte: cohorte });
          return; // omitir — protege el presupuesto
        }

        // Dedup sin UUID: por CreamosID + Fecha Programada
        const existe = !uuid && dataExistente.some((row, i) =>
          i > 0 && row[2] === creamosID && row[8] && row[8].toString() === fecha.toString()
        );

        if (existe) return;

        // ID usa nextWriteRow (no getLastRow que falla por ARRAYFORMULA)
        const idPago = `EST-${año}-${String(nextWriteRow - 1).padStart(4, '0')}`;
        const nombreCompleto = `${nombre} ${apellido}`.trim();

        // Escribir en fila exacta (no appendRow) para evitar que ARRAYFORMULA desplace datos
        sheetEstipendios.getRange(nextWriteRow, 1, 1, 18).setValues([[
          idPago,                     // A - ID Pago
          submissionTime || new Date(), // B - Fecha Registro
          creamosID,                  // C - ID Participante
          nombreCompleto,             // D - Nombre Completo
          cohorte,                    // E - Cohorte
          proyecto,                   // F - Programa
          tipoEstipendio,             // G - Tipo Estipendio
          parseFloat(monto) || 0,     // H - Monto
          fecha,                      // I - Fecha Programada
          '',                         // J - Fecha Pago Real (vacía al importar)
          '',                         // K - Estado (ARRAYFORMULA en K2)
          metodoPago,                 // L - Método Pago
          numeroComprobante,          // M - # Recibo
          responsable,                // N - Responsable
          firma,                      // O - URL Firma
          '',                         // P - Días atraso (ARRAYFORMULA en P2)
          comentarios,                // Q - Notas
          uuid                        // R - UUID (para dedup)
        ]]);
        if (uuid) uuidsExistentes.add(uuid);
        nextWriteRow++;
        nuevosRegistros++;

      } catch (error) {
        Logger.log(`⚠️ Error procesando fila ${index}: ${error.message}`);
      }
    });

    // Notificar por correo si hay Creamos IDs no encontrados en sistema
    if (noEncontradosTech.length > 0) {
      try {
        const emailUser = Session.getActiveUser().getEmail();
        if (emailUser) {
          let cuerpo = `⚠️ Se detectaron ${noEncontradosTech.length} registro(s) en Kobo cuyo Creamos ID NO está en Inscritx ni Lista Definitiva:\n\n`;
          noEncontradosTech.forEach(function(r) {
            cuerpo += `• ${r.id} — ${r.nombre} (Cohorte: ${r.cohorte})\n`;
          });
          cuerpo += '\nEstos registros fueron OMITIDOS para proteger el presupuesto.\n';
          cuerpo += 'Verifica: ¿El Creamos ID es correcto en el formulario Kobo? ¿La persona está en Inscritx o Lista Definitiva?';
          MailApp.sendEmail(emailUser, '⚠️ Tech/SAC Estipendios: IDs no encontrados en sistema', cuerpo);
          Logger.log('📧 Email enviado con ' + noEncontradosTech.length + ' IDs no encontrados');
        }
      } catch(mailErr) { Logger.log('No se pudo enviar email: ' + mailErr.message); }
    }

    Logger.log(`✅ ${nuevosRegistros} nuevos registros importados, ${noEncontradosTech.length} omitidos por validación`);

    // Actualizar dashboard
    actualizarDashboardEstipendios();

    SpreadsheetApp.getActiveSpreadsheet().toast(
      `✅ ${nuevosRegistros} importados${noEncontradosTech.length > 0 ? ' | ⚠️ ' + noEncontradosTech.length + ' IDs no encontrados (revisa tu correo)' : ''}`,
      'Estipendios',
      8
    );

  } catch (error) {
    Logger.log('❌ Error: ' + error.message);
    SpreadsheetApp.getActiveSpreadsheet().toast('❌ Error: ' + error.message, 'Error', 10);
  }
}

/**
 * Determina cohorte desde especialidad
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

function _normalizarCohorte(nombre) {
  return (nombre || '').toString().toLowerCase()
    .replace(/[()]/g, '').replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function _coincideNombreCohorte(nombre1, nombre2) {
  if (!nombre1 || !nombre2) return false;
  if (nombre1.trim() === nombre2.trim()) return true;
  var n1 = _normalizarCohorte(nombre1);
  var n2 = _normalizarCohorte(nombre2);
  if (n1 === n2) return true;
  var parts1 = n1.split(' ');
  var parts2 = n2.split(' ');
  var año1 = parts1.filter(function(p) { return /^\d{4}$/.test(p); })[0];
  var año2 = parts2.filter(function(p) { return /^\d{4}$/.test(p); })[0];
  return parts1[0] === parts2[0] && año1 && año1 === año2;
}

function _buscarNombreCohorteReal(nombreKobo, nombresCohortes) {
  if (!nombreKobo || !nombresCohortes || nombresCohortes.length === 0) return null;
  for (var i = 0; i < nombresCohortes.length; i++) {
    if (nombresCohortes[i] === nombreKobo) return nombreKobo;
  }
  for (var i = 0; i < nombresCohortes.length; i++) {
    if (_coincideNombreCohorte(nombreKobo, nombresCohortes[i])) return nombresCohortes[i];
  }
  return null;
}

// =====================================================================
// FUNCIÓN: ACTUALIZAR DASHBOARD
// =====================================================================

/**
 * Actualiza el dashboard con datos recientes
 */
function actualizarDashboardEstipendios() {
  try {
    SpreadsheetApp.getActiveSpreadsheet().toast('Actualizando dashboard...', '💰 Estipendios', 3);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetDashboard = ss.getSheetByName('Dashboard Estipendios');
    const sheetEstipendios = ss.getSheetByName('Estipendios');
    const sheetCohortes = ss.getSheetByName('Cohortes');

    if (!sheetDashboard || !sheetEstipendios) return;

    // Forzar recálculo
    SpreadsheetApp.flush();

    // Actualizar calendario (próximos 7 días)
    const hoy = new Date();
    const en7Dias = new Date(hoy.getTime() + 7 * 24 * 60 * 60 * 1000);
    // Solo filas con datos reales (col A no vacía)
    const estipendios = sheetEstipendios.getDataRange().getValues().slice(1)
      .filter(function(e) { return e[0] && e[0] !== ''; });

    const proximosPagos = estipendios.filter(function(e) {
      const fechaProg = e[8] ? new Date(e[8]) : null;
      return fechaProg && fechaProg >= hoy && fechaProg <= en7Dias;
    });

    const agrupados = {};
    proximosPagos.forEach(function(e) {
      const fecha = Utilities.formatDate(new Date(e[8]), Session.getScriptTimeZone(), 'dd/MM/yyyy');
      if (!agrupados[fecha]) agrupados[fecha] = { cohorte: e[4], cantidad: 0, monto: 0 };
      agrupados[fecha].cantidad++;
      agrupados[fecha].monto += parseFloat(e[7]) || 0;
    });

    const datosCalendario = Object.keys(agrupados).map(function(fecha) {
      return [fecha, agrupados[fecha].cohorte, agrupados[fecha].cantidad, agrupados[fecha].monto];
    });
    if (datosCalendario.length > 0) {
      sheetDashboard.getRange(5, 5, 10, 4).clear();
      sheetDashboard.getRange(5, 5, datosCalendario.length, 4).setValues(datosCalendario);
      sheetDashboard.getRange(5, 8, datosCalendario.length, 1).setNumberFormat('"Q"#,##0.00');
    }

    // Resumen por cohorte — gastado calculado DIRECTAMENTE desde Estipendios
    if (sheetCohortes) {
      const cohortes = sheetCohortes.getDataRange().getValues().slice(1);
      const resumenCohorte = [];

      cohortes.forEach(function(c) {
        const nombreCohorte = (c[0] || '').toString().trim();
        if (!nombreCohorte) return;
        const presupuestoTotal = parseFloat(c[16]) || 0;
        if (presupuestoTotal <= 0) return;

        // Fuzzy match: "Barismo-2026" ↔ "Barismo 1 (2026)"
        const estipCohorte = estipendios.filter(function(e) {
          return _coincideNombreCohorte((e[4] || '').toString(), nombreCohorte);
        });
        const gastado    = estipCohorte.reduce(function(s, e) { return s + (parseFloat(e[7]) || 0); }, 0);
        const numPagos   = estipCohorte.length;
        const disponible = presupuestoTotal - gastado;
        const pctEjec    = presupuestoTotal > 0 ? gastado / presupuestoTotal : 0;
        const estado     = pctEjec > 0.95 ? '🔴 Crítico' : pctEjec > 0.80 ? '🟡 Alerta' : '🟢 OK';

        resumenCohorte.push([nombreCohorte, presupuestoTotal, gastado, disponible, pctEjec, numPagos, estado]);
      });

      sheetDashboard.getRange(18, 1, 10, 7).clear();
      if (resumenCohorte.length > 0) {
        sheetDashboard.getRange(18, 1, resumenCohorte.length, 7).setValues(resumenCohorte);
        sheetDashboard.getRange(18, 2, resumenCohorte.length, 4).setNumberFormat('"Q"#,##0.00');
        sheetDashboard.getRange(18, 5, resumenCohorte.length, 1).setNumberFormat('0.00%');
      } else {
        sheetDashboard.getRange(18, 1).setValue('Sin cohortes con presupuesto de estipendios aún');
      }
    }

    // Limpiar filas viejas de auditoría
    sheetDashboard.getRange('A25:H50').clearContent().setBackground(null);
    SpreadsheetApp.getActiveSpreadsheet().toast('✅ Dashboard actualizado', 'Estipendios', 3);

  } catch (error) {
    Logger.log('❌ Error actualizando dashboard: ' + error.message);
  }
}

// =====================================================================
// FUNCIÓN: VERIFICAR PRESUPUESTO Y ALERTAS
// =====================================================================

/**
 * Verifica presupuestos y envía alertas por email
 */
function verificarPresupuestoEstipendios() {
  try {
    Logger.log('🔍 Verificando presupuestos...');

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetCohortes = ss.getSheetByName('Cohortes');
    const sheetEstipendios = ss.getSheetByName('Estipendios');

    if (!sheetCohortes || !sheetEstipendios) return;

    const cohortes = sheetCohortes.getDataRange().getValues().slice(1);
    const estipendios = sheetEstipendios.getDataRange().getValues().slice(1);
    const alertas = [];

    cohortes.forEach(c => {
      const nombreCohorte = c[1];
      const pctEjec = c[13] || 0;
      const presupuesto = c[10] || 0;
      const gastado = c[11] || 0;

      // Alerta presupuesto
      if (pctEjec > 0.80) {
        alertas.push({
          tipo: 'presupuesto',
          cohorte: nombreCohorte,
          presupuesto: presupuesto,
          gastado: gastado,
          porcentaje: pctEjec * 100,
          nivel: pctEjec > 0.95 ? 'CRÍTICO' : 'ADVERTENCIA'
        });
      }

      // Alerta pagos atrasados
      const atrasados = estipendios.filter(e =>
        e[4] === nombreCohorte && String(e[10]).includes('🔴')
      );

      if (atrasados.length > 0) {
        const maxDias = Math.max.apply(null, atrasados.map(function(e) { return parseFloat(e[15]) || 0; }));
        alertas.push({
          tipo: 'atrasados',
          cohorte: nombreCohorte,
          cantidad: atrasados.length,
          dias: maxDias
        });
      }
    });

    if (alertas.length > 0) {
      enviarAlertasEstipendios(alertas);
      Logger.log(`⚠️ ${alertas.length} alertas enviadas`);
    }

  } catch (error) {
    Logger.log('❌ Error: ' + error.message);
  }
}

/**
 * Envía alertas por email
 */
function enviarAlertasEstipendios(alertas) {
  try {
    const config = typeof CONFIG_AB !== 'undefined' ? CONFIG_AB : CONFIG_TECH;
    const email = config.EMAIL_ALERTAS_ESTIPENDIOS || Session.getActiveUser().getEmail();

    let mensaje = '<h2>🚨 Alertas del Sistema de Estipendios</h2>';
    mensaje += '<p>Fecha: ' + new Date().toLocaleDateString() + '</p><hr>';

    alertas.forEach(a => {
      if (a.tipo === 'presupuesto') {
        const color = a.nivel === 'CRÍTICO' ? '#ea4335' : '#fbbc04';
        mensaje += `<div style="padding:15px;background:${color};color:white;margin:10px 0;border-radius:5px;">`;
        mensaje += `<strong>${a.nivel}</strong><br>`;
        mensaje += `Cohorte: ${a.cohorte}<br>`;
        mensaje += `Presupuesto: Q${a.presupuesto.toFixed(2)}<br>`;
        mensaje += `Gastado: Q${a.gastado.toFixed(2)} (${a.porcentaje.toFixed(1)}%)<br>`;
        mensaje += `Disponible: Q${(a.presupuesto - a.gastado).toFixed(2)}`;
        mensaje += '</div>';
      } else if (a.tipo === 'atrasados') {
        mensaje += '<div style="padding:15px;background:#fbbc04;margin:10px 0;border-radius:5px;">';
        mensaje += `<strong>⚠️ Pagos Atrasados</strong><br>`;
        mensaje += `Cohorte: ${a.cohorte}<br>`;
        mensaje += `Cantidad: ${a.cantidad} pagos<br>`;
        mensaje += `Días de atraso: hasta ${a.dias} días`;
        mensaje += '</div>';
      }
    });

    mensaje += '<hr><p><small>Sistema de Estipendios - Mensaje automático</small></p>';

    MailApp.sendEmail({
      to: email,
      subject: '🚨 Alertas Sistema Estipendios - ' + new Date().toLocaleDateString(),
      htmlBody: mensaje
    });

  } catch (error) {
    Logger.log('❌ Error enviando alertas: ' + error.message);
  }
}

// =====================================================================
// FUNCIÓN: EXPORTAR PARA POWER BI
// =====================================================================

/**
 * Exporta datos consolidados para Power BI
 */
function exportarParaPowerBI() {
  try {
    SpreadsheetApp.getActiveSpreadsheet().toast('Exportando para Power BI...', '💰 Estipendios', 3);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheetExport = ss.getSheetByName('EXPORT_PowerBI');

    if (sheetExport) {
      ss.deleteSheet(sheetExport);
    }
    sheetExport = ss.insertSheet('EXPORT_PowerBI');

    const headers = [
      'ID Pago', 'Fecha Pago', 'Año', 'Mes', 'ID Participante', 'Nombre',
      'Cohorte', 'Programa', 'Tipo', 'Monto', 'Estado', 'Método', 'Recibo',
      'Responsable', 'Notas', 'Presupuesto Cohorte', 'Estado Cohorte'
    ];

    const shEst = ss.getSheetByName('Estipendios');
    const shCoh = ss.getSheetByName('Cohortes');
    const estipendios = shEst ? shEst.getDataRange().getValues().slice(1) : [];
    const cohortes = shCoh ? shCoh.getDataRange().getValues().slice(1) : [];

    // c[0]=Nombre Cohorte, c[13]=Estado, c[16]=Presupuesto Total
    const dictCohortes = {};
    cohortes.forEach(function(c) {
      if (c[0]) dictCohortes[c[0].toString().trim()] = {
        presupuesto: parseFloat(c[16]) || 0,
        estado: (c[13] || '').toString()
      };
    });

    const datosConsolidados = [headers];

    // Filtrar filas vacías (sin ID en col A)
    estipendios.filter(function(e) { return e[0] && e[0] !== ''; }).forEach(function(e) {
      // Usar fecha pago real si existe, sino fecha programada
      const fechaRaw = e[9] || e[8];
      const fechaPago = fechaRaw ? new Date(fechaRaw) : new Date();
      const cohorteNombre = (e[4] || '').toString().trim();
      // Buscar presupuesto con fuzzy match
      let presInfo = dictCohortes[cohorteNombre];
      if (!presInfo) {
        const keyMatch = Object.keys(dictCohortes).find(function(k) {
          return _coincideNombreCohorte(k, cohorteNombre);
        });
        if (keyMatch) presInfo = dictCohortes[keyMatch];
      }
      presInfo = presInfo || {};

      datosConsolidados.push([
        e[0],                               // ID Pago
        fechaPago,                          // Fecha Pago
        fechaPago.getFullYear(),            // Año
        obtenerNombreMes(fechaPago.getMonth()), // Mes
        e[2],                               // ID Participante
        e[3],                               // Nombre
        e[4],                               // Cohorte
        e[5],                               // Programa
        e[6],                               // Tipo
        parseFloat(e[7]) || 0,             // Monto
        e[10],                              // Estado
        e[11],                              // Método
        e[12],                              // Recibo
        e[13],                              // Responsable
        e[16],                              // Notas
        presInfo.presupuesto || 0,          // Presupuesto Cohorte
        presInfo.estado || ''               // Estado Cohorte
      ]);
    });

    sheetExport.getRange(1, 1, datosConsolidados.length, headers.length).setValues(datosConsolidados);
    sheetExport.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#4285f4').setFontColor('#ffffff');

    sheetExport.activate();
    SpreadsheetApp.getActiveSpreadsheet().toast('✅ Datos exportados', 'Éxito', 5);

  } catch (error) {
    Logger.log('❌ Error: ' + error.message);
  }
}

function obtenerNombreMes(mes) {
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return meses[mes];
}

// =====================================================================
// FUNCIÓN: AUDITORÍA
// =====================================================================

/**
 * Registra acciones en la auditoría del dashboard
 */
function registrarAuditoriaEstipendios(accion, registroID, detalles) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetDashboard = ss.getSheetByName('Dashboard Estipendios');
    if (!sheetDashboard) return;

    const nuevaFila = [
      new Date(),
      Session.getActiveUser().getEmail(),
      accion,
      detalles || registroID || ''
    ];

    // Insertar en fila 27 (empuja las anteriores hacia abajo)
    sheetDashboard.insertRowAfter(26);
    sheetDashboard.getRange(27, 1, 1, 4).setValues([nuevaFila]);

    // Mantener solo las últimas 20
    const ultimaFila = sheetDashboard.getLastRow();
    if (ultimaFila > 46) {
      sheetDashboard.deleteRows(47, ultimaFila - 46);
    }

  } catch (error) {
    Logger.log('⚠️ Error en auditoría: ' + error.message);
  }
}

// =====================================================================
// FUNCIÓN: CONFIGURAR TRIGGERS
// =====================================================================

/**
 * Configura triggers automáticos
 */
function configurarTriggersEstipendios() {
  try {
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(t => {
      if (t.getHandlerFunction().includes('Estipendios') ||
          t.getHandlerFunction().includes('estipendios')) {
        ScriptApp.deleteTrigger(t);
      }
    });

    ScriptApp.newTrigger('importarEstipendiosDesdeKobo')
      .timeBased().everyMinutes(15).create();

    ScriptApp.newTrigger('verificarPresupuestoEstipendios')
      .timeBased().everyHours(6).create();

    ScriptApp.newTrigger('exportarParaPowerBI')
      .timeBased().atHour(6).everyDays(1).create();

    SpreadsheetApp.getUi().alert(
      '✅ Triggers Activados',
      'Procesos automáticos activados:\n\n' +
      '• Importación desde Kobo: Cada 15 minutos\n' +
      '• Verificación presupuesto: Cada 6 horas\n' +
      '• Exportación Power BI: Diario a las 6:00 AM',
      SpreadsheetApp.getUi().ButtonSet.OK
    );

  } catch (error) {
    Logger.log('❌ Error: ' + error.message);
  }
}

function configurarTriggersEstipendiosPrueba() {
  try {
    ScriptApp.getProjectTriggers().forEach(function(t) {
      if (t.getHandlerFunction().toLowerCase().includes('estipendios')) {
        ScriptApp.deleteTrigger(t);
      }
    });
    ScriptApp.newTrigger('importarEstipendiosDesdeKobo')
      .timeBased().everyMinutes(1).create();
    SpreadsheetApp.getUi().alert(
      '🧪 Modo Prueba Activado',
      'Importación automática cada 1 minuto.\n\n' +
      'Cuando termines las pruebas usa:\n' +
      'Estipendios → Activar Actualización (15 min)',
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  } catch (error) {
    Logger.log('❌ Error prueba trigger: ' + error.message);
  }
}

/**
 * Desactiva triggers automáticos
 */
function desactivarTriggersEstipendios() {
  const triggers = ScriptApp.getProjectTriggers();
  let count = 0;
  triggers.forEach(t => {
    if (t.getHandlerFunction().includes('Estipendios') ||
        t.getHandlerFunction().includes('estipendios')) {
      ScriptApp.deleteTrigger(t);
      count++;
    }
  });
  SpreadsheetApp.getUi().alert(`✅ ${count} triggers desactivados`);
}

// =====================================================================
// AGREGAR AL MENÚ PRINCIPAL
// =====================================================================

/**
 * INSTRUCCIÓN: Agregar estas líneas en setupMenuAB() o setupMenuTech()
 * ANTES de .addToUi():
 *
 * .addSeparator()
 * .addSubMenu(ui.createMenu('💰 Estipendios')
 *   .addItem('🚀 Instalar Sistema', 'instalarSistemaEstipendios')
 *   .addSeparator()
 *   .addItem('📥 Importar Desde Kobo', 'importarEstipendiosDesdeKobo')
 *   .addItem('🔄 Actualizar Dashboard', 'actualizarDashboardEstipendios')
 *   .addSeparator()
 *   .addItem('📊 Exportar para Power BI', 'exportarParaPowerBI')
 *   .addSeparator()
 *   .addItem('⚙️ Activar Actualización Automática', 'configurarTriggersEstipendios')
 *   .addItem('🛑 Desactivar Actualización Automática', 'desactivarTriggersEstipendios')
 *   .addItem('🔍 Verificar Presupuestos Ahora', 'verificarPresupuestoEstipendios'))
 *
 */

// =====================================================================
// FIN DEL MÓDULO DE ESTIPENDIOS
// =====================================================================

// =====================================================================
// PROCESAMIENTO POR LOTE DE FILAS PENDIENTES
// =====================================================================

/**
 * Procesa todas las filas pendientes de "Hoja de Interés" que tienen estado
 * "Entrevista realizada" pero que aún no se copiaron a "Entrevistas"
 *
 * Esta función es útil cuando hay muchos registros que se marcaron como
 * "Entrevista realizada" pero el proceso automático no los completó todos
 * (por ejemplo, cuando se editan muchas celdas a la vez).
 */
function procesarFilasPendientesAEntrevistas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  // Mostrar diálogo de confirmación
  const respuesta = ui.alert(
    '🔄 Procesar Filas Pendientes',
    'Esta función procesará todas las filas de "Hoja de Interés" que tienen estado ' +
    '"Entrevista realizada" pero que aún no están en "Entrevistas".\n\n' +
    '¿Deseas continuar?',
    ui.ButtonSet.YES_NO
  );

  if (respuesta !== ui.Button.YES) {
    ss.toast('❌ Proceso cancelado', 'Cancelado', 3);
    return;
  }

  ss.toast('🔍 Identificando filas pendientes...', 'Procesando', -1);

  const hojaInteres = ss.getSheetByName('Hoja de Interés');
  const entrevistas = ss.getSheetByName('Entrevistas');

  if (!hojaInteres || !entrevistas) {
    ui.alert('⚠️ Error: No se encontraron las hojas necesarias');
    return;
  }

  // Obtener mapas de columnas
  const colMapInteres = obtenerMapaColumnas(hojaInteres);
  const colMapEntrevistas = obtenerMapaColumnas(entrevistas);

  // Leer todos los datos de ambas hojas
  const datosInteres = hojaInteres.getDataRange().getValues();
  const datosEntrevistas = entrevistas.getDataRange().getValues();

  // Crear set de Creamos IDs que ya están en Entrevistas
  const creamosIDsEnEntrevistas = new Set();
  for (let i = 1; i < datosEntrevistas.length; i++) {
    const creamosId = datosEntrevistas[i][colMapEntrevistas['creamosid']] ||
                      datosEntrevistas[i][colMapEntrevistas['creamos id']];
    if (creamosId && creamosId.toString().trim() !== '') {
      creamosIDsEnEntrevistas.add(creamosId.toString().trim());
    }
  }

  // Identificar índice de columna Estado en Hoja de Interés
  const idxEstado = colMapInteres['estado'];
  const idxCreamosId = colMapInteres['creamosid'] || colMapInteres['creamos id'];

  if (idxEstado === undefined || idxCreamosId === undefined) {
    ui.alert('⚠️ Error: No se encontraron las columnas necesarias (Estado o Creamos ID)');
    return;
  }

  // Encontrar filas pendientes
  const filasPendientes = [];
  for (let i = 1; i < datosInteres.length; i++) {
    const estado = datosInteres[i][idxEstado];
    const creamosId = datosInteres[i][idxCreamosId];

    if (estado && estado.toString().trim() === 'Entrevista realizada' &&
        creamosId && creamosId.toString().trim() !== '' &&
        !creamosIDsEnEntrevistas.has(creamosId.toString().trim())) {
      filasPendientes.push({
        fila: i + 1, // +1 porque getValues() empieza en 0
        datos: datosInteres[i],
        creamosId: creamosId.toString().trim()
      });
    }
  }

  if (filasPendientes.length === 0) {
    ss.toast('✅ No hay filas pendientes', 'Completado', 5);
    ui.alert('✅ No se encontraron filas pendientes.\n\nTodas las filas con estado "Entrevista realizada" ya están en "Entrevistas".');
    return;
  }

  // Confirmar procesamiento
  const confirmar = ui.alert(
    '📊 Filas Pendientes Encontradas',
    `Se encontraron ${filasPendientes.length} fila(s) pendiente(s) para procesar.\n\n` +
    '¿Deseas procesarlas ahora?',
    ui.ButtonSet.YES_NO
  );

  if (confirmar !== ui.Button.YES) {
    ss.toast('❌ Proceso cancelado', 'Cancelado', 3);
    return;
  }

  // Procesar cada fila pendiente
  ss.toast(`🔄 Procesando ${filasPendientes.length} fila(s)...`, 'Procesando', -1);

  let procesadas = 0;
  let errores = 0;
  const registrosParaInsertar = [];
  const filasParaMarcar = [];

  for (let pendiente of filasPendientes) {
    try {
      const datos = pendiente.datos;

      // Helper para obtener valores
      const getVal = (nombre) => {
        const norm = nombre.toLowerCase().replace(/[^a-z0-9]/g, '');
        const idx = colMapInteres[norm];
        let val = idx !== undefined ? datos[idx] : '';

        // Auto-normalizar nivel educativo
        if (norm === 'niveleducativo' && typeof normalizarNivelEducativo === 'function') {
          return normalizarNivelEducativo(val);
        }
        return val;
      };

      const creamosId = getVal('Creamos ID');
      const nombreCompleto = getVal('Nombre Completo');

      // Preparar registro para Entrevistas
      const numColsEnt = entrevistas.getLastColumn();
      const registro = new Array(numColsEnt).fill('');

      const mapping = {
        'Fecha Entrevista': new Date(),
        'Creamos ID': creamosId,
        'DPI': getVal('DPI'),
        'Nombre Completo': nombreCompleto,
        'Género': getVal('Género'),
        'Edad': getVal('Edad'),
        'Teléfono': getVal('Teléfono'),
        'Nivel Educativo': getVal('Nivel Educativo'),
        'Zona': getVal('Zona')
      };

      for (let [header, valor] of Object.entries(mapping)) {
        const norm = header.toLowerCase().replace(/[^a-z0-9]/g, '');
        const targetIdx = colMapEntrevistas[norm];
        if (targetIdx !== undefined) registro[targetIdx] = valor;
      }

      registrosParaInsertar.push(registro);
      filasParaMarcar.push(pendiente.fila);
      procesadas++;

      Logger.log(`✅ Procesada: ${nombreCompleto} (${creamosId})`);

    } catch (e) {
      Logger.log(`⚠️ Error procesando fila ${pendiente.fila}: ${e.message}`);
      errores++;
    }
  }

  // Insertar todos los registros en un solo lote
  if (registrosParaInsertar.length > 0) {
    try {
      const primeraFilaVacia = obtenerPrimeraFilaVacia(entrevistas, ['C', 'E']);
      entrevistas.getRange(primeraFilaVacia, 1, registrosParaInsertar.length, registrosParaInsertar[0].length)
                 .setValues(registrosParaInsertar);
      SpreadsheetApp.flush();

      // Marcar las filas procesadas en Hoja de Interés
      const maxCol = hojaInteres.getLastColumn();
      for (let fila of filasParaMarcar) {
        hojaInteres.getRange(fila, 1, 1, maxCol).setBackground('#e8f5e9');

        // Autocompletar desde directorio si existe la función
        if (typeof autocompletarFilaDesdeDirectorio === 'function') {
          const nuevaFilaEntrevistas = primeraFilaVacia + filasParaMarcar.indexOf(fila);
          autocompletarFilaDesdeDirectorio(
            entrevistas,
            nuevaFilaEntrevistas,
            mapearColumnasParaAutocompletar(entrevistas)
          );
        }
      }

      ss.toast(`✅ Procesadas ${procesadas} fila(s)`, 'Completado', 5);

      let mensaje = `✅ Proceso completado\n\n` +
                   `Filas procesadas: ${procesadas}\n`;
      if (errores > 0) {
        mensaje += `Errores: ${errores}\n`;
      }
      mensaje += `\nLas filas se copiaron exitosamente a "Entrevistas".`;

      ui.alert('✅ Completado', mensaje, ui.ButtonSet.OK);

    } catch (e) {
      Logger.log('⚠️ ERROR escribiendo en lote: ' + e.message);
      ui.alert('⚠️ Error al guardar en Entrevistas.\n\nDetalle: ' + e.message);
    }
  }
}

// =====================================================================
// FUNCIONES DE SINCRONIZACIÓN INCREMENTAL DE ENTREVISTAS
// =====================================================================

/**
 * Obtiene la fecha de la última sincronización de entrevistas
 * @return {Date|null} Fecha de última sincronización o null si es la primera vez
 */
function obtenerUltimaSincronizacionEntrevistas() {
  const props = PropertiesService.getDocumentProperties();
  const fechaStr = props.getProperty('ULTIMA_SYNC_ENTREVISTAS_TECH');

  if (!fechaStr) return null;

  try {
    return new Date(fechaStr);
  } catch (e) {
    Logger.log('⚠️ Error parseando fecha de última sync: ' + e.message);
    return null;
  }
}

/**
 * Guarda la fecha de última sincronización de entrevistas
 * @param {Date} fecha - Nueva fecha de sincronización
 */
function guardarUltimaSincronizacionEntrevistas(fecha) {
  const props = PropertiesService.getDocumentProperties();
  props.setProperty('ULTIMA_SYNC_ENTREVISTAS_TECH', fecha.toISOString());
  Logger.log(`💾 Última sincronización guardada: ${fecha.toISOString()}`);
}

/**
 * Filtra solo los registros nuevos desde la última sincronización
 * @param {Array} rows - Todas las filas del CSV
 * @param {Array} headers - Headers del CSV
 * @param {Date|null} ultimaSync - Fecha de última sincronización
 * @return {Array} Solo filas nuevas
 */
function filtrarFilasNuevasEntrevistas(rows, headers, ultimaSync) {
  if (!ultimaSync) {
    // Primera vez, importar todo (excepto header)
    return rows.slice(1);
  }

  // Buscar índice de _submission_time
  const submissionIdx = buscarIndiceColumna(headers, ['_submission_time', 'submission time', 'start', 'end']);

  if (submissionIdx < 0) {
    Logger.log('⚠️ No se encontró columna _submission_time, importando todos los registros');
    return rows.slice(1);
  }

  const filasNuevas = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const fechaSubmissionStr = row[submissionIdx];

    if (!fechaSubmissionStr) continue;

    try {
      const fechaSubmission = new Date(fechaSubmissionStr.toString().trim());

      // Solo incluir si es más reciente que la última sync
      if (fechaSubmission > ultimaSync) {
        filasNuevas.push(row);
      }
    } catch (e) {
      // Si hay error parseando fecha, incluir el registro por seguridad
      Logger.log(`⚠️ Error parseando fecha: ${fechaSubmissionStr}`);
      filasNuevas.push(row);
    }
  }

  return filasNuevas;
}

/**
 * Obtiene la fecha más reciente de las filas procesadas
 * @param {Array} rows - Filas procesadas
 * @param {Number} submissionIdx - Índice de la columna _submission_time
 * @return {Date} Fecha más reciente
 */
function obtenerFechaMasRecienteEntrevistas(rows, submissionIdx) {
  let fechaMasReciente = new Date(0); // Epoch

  if (submissionIdx < 0) {
    return new Date(); // Usar fecha actual si no hay columna
  }

  rows.forEach(row => {
    const fechaStr = row[submissionIdx];
    if (!fechaStr) return;

    try {
      const fecha = new Date(fechaStr.toString().trim());
      if (fecha > fechaMasReciente) {
        fechaMasReciente = fecha;
      }
    } catch (e) {
      // Ignorar fechas inválidas
    }
  });

  return fechaMasReciente > new Date(0) ? fechaMasReciente : new Date();
}

/**
 * Resetea la fecha de última sincronización (para re-importar todo)
 */
function resetearSincronizacionEntrevistasTech() {
  const props = PropertiesService.getDocumentProperties();
  props.deleteProperty('ULTIMA_SYNC_ENTREVISTAS_TECH');

  const ui = SpreadsheetApp.getUi();
  ui.alert(
    '🔄 Sincronización Reseteada',
    'La próxima importación traerá TODOS los registros desde Kobo.\n\n' +
    'Use "📝 Importar Entrevistas (Detalle)" para iniciar la importación.',
    ui.ButtonSet.OK
  );

  Logger.log('🔄 Sincronización reseteada - próxima importación traerá todos los datos');
}

/**
 * Muestra el estado actual de la sincronización
 */
function mostrarEstadoSincronizacionEntrevistasTech() {
  const ultimaSync = obtenerUltimaSincronizacionEntrevistas();

  const ui = SpreadsheetApp.getUi();

  const mensaje = ultimaSync
    ? `Última sincronización: ${ultimaSync.toLocaleString('es-GT')}\n\n` +
      `La próxima sincronización solo traerá registros nuevos desde esta fecha.`
    : 'No se ha realizado ninguna sincronización.\n\n' +
      'La próxima sincronización traerá TODOS los registros.';

  ui.alert('📊 Estado de Sincronización de Entrevistas', mensaje, ui.ButtonSet.OK);
}

/**
 * =====================================================================
 * IMPORTACIÓN AUTOMÁTICA COMPLETA DE DETALLE DE ENTREVISTAS
 * =====================================================================
 * Esta función configura TODO el sistema de entrevistas detalladas:
 * 1. Crea la hoja "Detalle Entrevistas" si no existe
 * 2. Importa todos los datos desde KoboToolbox
 * 3. Configura actualización automática cada hora
 */
function configurarSistemaEntrevistasCompleto() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  try {
    // Paso 1: Verificar/Crear hoja de Detalle Entrevistas
    ui.alert(
      '🚀 Configuración del Sistema de Entrevistas',
      'Este proceso:\n\n' +
      '1️⃣ Creará la hoja "Detalle Entrevistas" (si no existe)\n' +
      '2️⃣ Importará todos los datos desde KoboToolbox\n' +
      '3️⃣ Configurará actualización automática cada hora\n\n' +
      '¿Desea continuar?',
      ui.ButtonSet.OK_CANCEL
    ) === ui.Button.CANCEL ? null : (() => {

      ss.toast('📋 Paso 1/3: Verificando hoja...', 'Configurando', 3);

      // Crear hoja si no existe
      if (!ss.getSheetByName('Detalle Entrevistas')) {
        crearHojaDetalleEntrevistasUnificada();
        ss.toast('✅ Hoja "Detalle Entrevistas" creada con 99 columnas (TECH + SAC)', 'Éxito', 5);
      } else {
        ss.toast('✅ Hoja "Detalle Entrevistas" ya existe', 'OK', 3);
      }

      Utilities.sleep(2000);

      // Paso 2: Importar datos desde Kobo
      ss.toast('📥 Paso 2/3: Importando datos desde KoboToolbox...', 'Importando', 5);
      importarEntrevistasDesdeKobo();

      Utilities.sleep(2000);

      // Paso 3: Configurar trigger automático
      ss.toast('⚙️ Paso 3/3: Configurando actualización automática...', 'Configurando', 3);

      // Eliminar triggers anteriores de entrevistas
      const triggers = ScriptApp.getProjectTriggers();
      triggers.forEach(t => {
        if (t.getHandlerFunction() === 'importarEntrevistasDesdeKobo') {
          ScriptApp.deleteTrigger(t);
        }
      });

      // Crear nuevo trigger cada hora
      ScriptApp.newTrigger('importarEntrevistasDesdeKobo')
        .timeBased()
        .everyHours(1)
        .create();

      // Mensaje final
      ui.alert(
        '✅ Sistema Configurado Correctamente',
        '🎉 El sistema de Detalle de Entrevistas está listo:\n\n' +
        '✅ Hoja creada con todas las secciones:\n' +
        '   • Datos Personales\n' +
        '   • Alimentos y Bebidas (Preguntas + Empleabilidad)\n' +
        '   • Tecnología (Preguntas + Empleabilidad)\n' +
        '   • Servicio al Cliente (Preguntas + Empleabilidad)\n' +
        '   • Género\n' +
        '   • Metadatos Kobo\n\n' +
        '✅ Datos importados desde KoboToolbox\n\n' +
        '✅ Actualización automática configurada (cada hora)\n\n' +
        '💡 Los datos se sincronizarán automáticamente.\n' +
        '   Solo se importarán registros NUEVOS (sincronización incremental).',
        ui.ButtonSet.OK
      );

      Logger.log('✅ Sistema de Detalle de Entrevistas configurado completamente');

    })();

  } catch (error) {
    Logger.log('❌ Error en configuración: ' + error.message);
    ui.alert('❌ Error', 'Ocurrió un error: ' + error.message, ui.ButtonSet.OK);
  }
}

/**
 * Configura SOLO el trigger automático para entrevistas (sin importar)
 */
function configurarActualizacionAutomaticaEntrevistas() {
  const ui = SpreadsheetApp.getUi();

  try {
    // Eliminar triggers anteriores
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(t => {
      if (t.getHandlerFunction() === 'importarEntrevistasDesdeKobo') {
        ScriptApp.deleteTrigger(t);
      }
    });

    // Crear nuevo trigger cada hora
    ScriptApp.newTrigger('importarEntrevistasDesdeKobo')
      .timeBased()
      .everyHours(1)
      .create();

    ui.alert(
      '✅ Actualización Automática Activada',
      'La hoja "Detalle Entrevistas" se actualizará automáticamente cada hora.\n\n' +
      '🔄 Solo se importarán registros NUEVOS (sincronización incremental).\n\n' +
      'Para desactivar, ve a: Extensiones > Apps Script > Activadores\n' +
      'y elimina el trigger "importarEntrevistasDesdeKobo".',
      ui.ButtonSet.OK
    );

    Logger.log('✅ Trigger automático de entrevistas configurado');

  } catch (error) {
    Logger.log('❌ Error: ' + error.message);
    ui.alert('❌ Error', 'Ocurrió un error: ' + error.message, ui.ButtonSet.OK);
  }
}

/**
 * Desactiva la actualización automática de entrevistas
 */
function desactivarActualizacionAutomaticaEntrevistas() {
  const ui = SpreadsheetApp.getUi();

  try {
    const triggers = ScriptApp.getProjectTriggers();
    let eliminados = 0;

    triggers.forEach(t => {
      if (t.getHandlerFunction() === 'importarEntrevistasDesdeKobo') {
        ScriptApp.deleteTrigger(t);
        eliminados++;
      }
    });

    ui.alert(
      '✅ Actualización Automática Desactivada',
      `Se eliminaron ${eliminados} trigger(s).\n\n` +
      'La hoja "Detalle Entrevistas" ya NO se actualizará automáticamente.\n\n' +
      'Podrás importar datos manualmente desde el menú:\n' +
      'Configuración → Importar Entrevistas (Detalle)',
      ui.ButtonSet.OK
    );

    Logger.log(`✅ ${eliminados} trigger(s) de entrevistas eliminados`);

  } catch (error) {
    Logger.log('❌ Error: ' + error.message);
    ui.alert('❌ Error', 'Ocurrió un error: ' + error.message, ui.ButtonSet.OK);
  }
}

// =====================================================================

// =====================================================================
// GESTIÓN DE VISIBILIDAD DE HOJAS (TECH)
// =====================================================================

function _hojasSecundariasTech() {
  return [
    'Detalle Entrevistas',
    'No Inscritx',
    'Lista Definitiva',
    'Reportes Mensuales',
    'Referencias de Programas',
    '🔍 Diagnóstico CSV',
    'Estipendios',
    'Dashboard Estipendios',
    'Auditoría Estipendios',
    'Presupuesto Cohortes',
    'Calendario Pagos',
    'Datos Kobo',
    'EXPORT_PowerBI',
  ];
}

function ocultarHojasSecundarias() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let ocultadas = 0;
  _hojasSecundariasTech().forEach(function(nombre) {
    const hoja = ss.getSheetByName(nombre);
    if (hoja) { hoja.hideSheet(); ocultadas++; }
  });
  ss.toast('✅ ' + ocultadas + ' hoja(s) ocultadas. Usa "Mostrar hojas secundarias" para verlas.', '👁️ Hojas', 5);
}

function mostrarHojasSecundarias() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let mostradas = 0;
  _hojasSecundariasTech().forEach(function(nombre) {
    const hoja = ss.getSheetByName(nombre);
    if (hoja) { hoja.showSheet(); mostradas++; }
  });
  ss.toast('✅ ' + mostradas + ' hoja(s) ahora visibles.', '👁️ Hojas', 4);
}

function _mostrarHojaTech(nombre) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hoja = ss.getSheetByName(nombre);
  if (hoja) { hoja.showSheet(); ss.setActiveSheet(hoja); }
  else { SpreadsheetApp.getUi().alert('⚠️ No se encontró la hoja: ' + nombre); }
}

function verDetalleEntrevistas()   { _mostrarHojaTech('Detalle Entrevistas'); }
function verNoInscritx()           { _mostrarHojaTech('No Inscritx'); }
function verListaDefinitiva()      { _mostrarHojaTech('Lista Definitiva'); }
function verReportesMensuales()    { _mostrarHojaTech('Reportes Mensuales'); }
function verEstipendios()          { _mostrarHojaTech('Estipendios'); }
function verDashboardEstipendios() { _mostrarHojaTech('Dashboard Estipendios'); }

// =====================================================================
// REPARACIÓN DE HOJA ESTIPENDIOS (TECH)
// =====================================================================

function repararHojaEstipendios() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  const sheet = ss.getSheetByName('Estipendios');

  if (!sheet) {
    ui.alert('❌ No se encontró la hoja "Estipendios".\nEjecuta primero: Estipendios → Instalar Sistema');
    return;
  }

  ss.toast('🔧 Migrando hoja Estipendios a estructura nueva...', 'Estipendios', 8);

  // ── PASO 1: Leer datos reales (filas donde col A tiene valor) ──────────
  const todosLosDatos = sheet.getDataRange().getValues();
  const esEstructuraVieja = todosLosDatos[0] && todosLosDatos[0].length > 18;

  const filasReales = todosLosDatos.slice(1).filter(function(row) {
    return row[0] && row[0].toString().trim() !== '';
  });

  // Migrar columnas: vieja (22 cols) → nueva (18 cols)
  const datosMigrados = filasReales.map(function(row) {
    return [
      row[0],  row[1],  row[2],  row[3],  row[4],  row[5],  row[6],  row[7],
      row[8],  row[9],
      '',      // K Estado (ARRAYFORMULA)
      row[11], row[12], row[13],
      esEstructuraVieja ? (row[15] || '') : (row[14] || ''), // O URL Firma
      '',      // P Días Atraso (ARRAYFORMULA)
      esEstructuraVieja ? (row[21] || '') : (row[16] || ''), // Q Notas
      ''       // R UUID
    ];
  });

  // ── PASO 2: Limpiar toda la hoja (filas 2+) ───────────────────────────
  const maxCol = sheet.getMaxColumns();
  const maxRow = sheet.getMaxRows();
  if (maxRow > 1) {
    sheet.getRange(2, 1, maxRow - 1, maxCol).clearContent();
    sheet.getRange(2, 1, maxRow - 1, maxCol).setBackground(null);
  }

  // ── PASO 3: Actualizar encabezados a nueva estructura de 18 cols ──────
  const newHeaders = [
    'ID Pago', 'Fecha Registro', 'ID Participante', 'Nombre Completo',
    'Cohorte', 'Programa', 'Tipo Estipendio', 'Monto (Q)',
    'Fecha Programada', 'Fecha Pago Real', 'Estado', 'Método Pago',
    '# Recibo', 'Responsable', 'URL Firma', 'Días Atraso', 'Notas', 'UUID'
  ];
  sheet.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);
  sheet.getRange(1, 1, 1, newHeaders.length)
    .setFontWeight('bold').setBackground('#0f9d58')
    .setFontColor('#ffffff').setHorizontalAlignment('center');
  if (maxCol > 18) {
    sheet.getRange(1, 19, 1, maxCol - 18).clearContent().setBackground(null);
  }

  // ── PASO 4: Reescribir datos migrados ────────────────────────────────
  if (datosMigrados.length > 0) {
    sheet.getRange(2, 1, datosMigrados.length, 18).setValues(datosMigrados);
  }

  // ── PASO 5: ARRAYFORMULA en K2 — Estado con guardia ──────────────────
  sheet.getRange('K2').setFormula(
    '=ARRAYFORMULA(IF(A2:A="","",IF(J2:J<>"","Pagado",IF(I2:I="","Programado",IF(I2:I<TODAY(),"🔴 Atrasado","Programado")))))'
  );

  // ── PASO 6: ARRAYFORMULA en P2 — Días de atraso con guardia ──────────
  sheet.getRange('P2').setFormula(
    '=ARRAYFORMULA(IF(A2:A="","",IF(AND(K2:K<>"Pagado",I2:I<>"",I2:I<TODAY()),TODAY()-I2:I,0)))'
  );

  // ── PASO 7: Formatos ──────────────────────────────────────────────────
  sheet.getRange('H:H').setNumberFormat('"Q"#,##0.00');
  sheet.getRange('P:P').setNumberFormat('0');

  // ── PASO 8: Formato condicional en Estado (K) ─────────────────────────
  sheet.clearConditionalFormatRules();
  const rango = sheet.getRange('K2:K1000');
  sheet.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule().whenTextContains('Atrasado').setBackground('#ffcdd2').setFontColor('#c62828').setRanges([rango]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Pagado').setBackground('#e8f5e9').setFontColor('#2e7d32').setRanges([rango]).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Programado').setBackground('#e3f2fd').setFontColor('#1565c0').setRanges([rango]).build(),
  ]);

  SpreadsheetApp.flush();

  ui.alert(
    '✅ Hoja Estipendios Reparada',
    'Migración completada a estructura de 18 columnas.\n\n' +
    '• Encabezados actualizados (A–R)\n' +
    '• Datos preservados y reubicados\n' +
    '• ARRAYFORMULA en Estado (K) y Días Atraso (P)\n' +
    '• Filas vacías ya NO muestran "Atrasado"\n' +
    '• Columnas S–V eliminadas\n\n' +
    (filasReales.length > 0
      ? filasReales.length + ' registros preservados.'
      : 'Sin registros — hoja lista para importar.'),
    ui.ButtonSet.OK
  );
}

// =====================================================================
// REPARACIÓN DE DASHBOARD ESTIPENDIOS (Tech/SAC)
// =====================================================================

function repararDashboardEstipendios() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dash = ss.getSheetByName('Dashboard Estipendios');
  if (!dash) {
    SpreadsheetApp.getUi().alert('❌ No existe la hoja "Dashboard Estipendios".\nEjecuta: Estipendios → Instalar Sistema');
    return;
  }

  ss.toast('🔧 Reparando Dashboard...', 'Estipendios', 4);

  // KPIs correctos — filas 5 a 13 (col B = fórmulas)
  // Columnas Cohortes: Q=Presupuesto Total, R=Gastado, N=Estado
  const formulas = [
    [5,  '=IFERROR(SUM(Cohortes!Q:Q),0)'],           // Total Presupuestado
    [6,  '=IFERROR(SUM(Cohortes!R:R),0)'],            // Total Gastado
    [7,  '=B5-B6'],                                    // Total Disponible
    [8,  '=IFERROR(B6/B5,0)'],                         // % Ejecución Global
    [9,  '=IFERROR(COUNTIF(Cohortes!Q:Q,">"&0),0)'],  // # Cohortes con Estipendios
    [10, '=IFERROR(COUNTIF(Cohortes!N:N,"Activa"),0)'],// # Cohortes Activas
    [11, '=IFERROR(COUNTA(Estipendios!A:A)-1,0)'],     // Total Pagos Importados
    [12, '=IFERROR(SUMIF(Estipendios!A:A,"EST-*",Estipendios!H:H),0)'], // Total Monto
    [13, '=IFERROR(COUNTIF(Estipendios!K:K,"*Atrasado*"),0)']  // Pagos Atrasados
  ];

  formulas.forEach(function(f) {
    dash.getRange('B' + f[0]).setFormula(f[1]);
  });

  // Formato: porcentaje en fila 8
  dash.getRange('B8').setNumberFormat('0.0%');
  // Formato: moneda solo en filas de monto
  [5,6,7,12].forEach(function(r) { dash.getRange('B' + r).setNumberFormat('"Q"#,##0.00'); });
  // Formato: número entero para conteos (sin símbolo Q)
  [9,10,11,13].forEach(function(r) { dash.getRange('B' + r).setNumberFormat('0'); });
  // Limpiar fila 14 (datos residuales de versiones anteriores)
  dash.getRange('A14:C14').clearContent();
  // Limpiar col C (contenía textos de fórmulas que se evaluaban como valores)
  dash.getRange('C4:C13').clearContent();
  // Limpiar sección Auditoría (filas 25-50) — eliminada del diseño nuevo
  dash.getRange('A25:H50').clearContent().setBackground(null);

  // Nombres de KPIs (col A)
  const nombres = [
    [5,  'Total Presupuestado (Q)'],
    [6,  'Total Gastado (Q)'],
    [7,  'Total Disponible (Q)'],
    [8,  '% Ejecución Global'],
    [9,  '# Cohortes con Estipendios'],
    [10, '# Cohortes Activas'],
    [11, 'Total Pagos Importados'],
    [12, 'Total Monto Pagado (Q)'],
    [13, 'Pagos Atrasados']
  ];
  nombres.forEach(function(n) { dash.getRange('A' + n[0]).setValue(n[1]); });

  SpreadsheetApp.flush();
  ss.toast('✅ Dashboard reparado. Los KPIs ahora muestran datos reales.', 'Estipendios', 5);
}

// =====================================================================
// ACTUALIZAR TODO — Un solo botón que aplica todos los cambios
// =====================================================================
function moverColumnaAntesDe_Tech(sheet, nombreCol, nombreDest) {
  if (!sheet) return '⚠ Hoja no encontrada';
  const hdrs = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const src = hdrs.findIndex(h => h.toString().trim() === nombreCol) + 1;
  const dst = hdrs.findIndex(h => h.toString().trim() === nombreDest) + 1;
  if (src <= 0) return '⚠ Columna "' + nombreCol + '" no encontrada';
  if (dst <= 0) return '⚠ Columna "' + nombreDest + '" no encontrada';
  if (src === dst - 1) return 'ℹ "' + nombreCol + '" ya está en la posición correcta';
  const lastRow = sheet.getMaxRows();
  sheet.insertColumnBefore(dst);
  const srcActual = src >= dst ? src + 1 : src;
  sheet.getRange(1, srcActual, lastRow, 1).copyTo(sheet.getRange(1, dst, lastRow, 1));
  sheet.deleteColumn(srcActual);
  return '✓ "' + nombreCol + '" movida antes de "' + nombreDest + '"';
}

function actualizarTodoTech() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  const errores = [];
  const log = [];

  const confirmar = ui.alert(
    '🔄 ACTUALIZAR TODO',
    'Aplicará todos los cambios necesarios para dejar el sistema listo:\n\n' +
    '0. Instalar/verificar trigger de automatizaciones\n' +
    '1. Reparar columnas (Entrevistas, Hoja de Interés)\n' +
    '2. Instalar columnas faltantes (1ra/2da Llamada, Notas)\n' +
    '3. Reconfigurar todos los dropdowns\n' +
    '4. Reparar y actualizar reportes\n\n' +
    '⚠️ Los datos existentes NO se borran.\n¿Continuar?',
    ui.ButtonSet.YES_NO
  );
  if (confirmar !== ui.Button.YES) return;

  // ── Paso 0: Limpiar triggers viejos e instalar el correcto ────────────
  ss.toast('Paso 0/3: Verificando trigger...', 'Actualizando', 15);
  try {
    const triggers = ScriptApp.getProjectTriggers();
    let borrados = [];
    // Borrar triggers obsoletos: 'alEditar' (nombre viejo) y duplicados de 'alEditarTech'
    triggers.forEach(t => {
      const fn = t.getHandlerFunction();
      if (fn === 'alEditar' || fn === 'alEditarTech') {
        ScriptApp.deleteTrigger(t);
        borrados.push(fn);
      }
    });
    // Instalar trigger correcto limpio
    ScriptApp.newTrigger('alEditarTech').forSpreadsheet(ss).onEdit().create();
    if (borrados.length > 0) {
      log.push('✓ Triggers obsoletos eliminados: ' + borrados.join(', '));
    }
    log.push('✓ Trigger alEditarTech instalado correctamente');
  } catch(e) { errores.push('✗ Error instalando trigger: ' + e.message + ' — Ve a Extensiones → Apps Script → Triggers e instala manualmente alEditarTech'); }

  // ── Paso 1: Reparar columnas ──────────────────────────────────────────
  ss.toast('Paso 1/3: Reparando columnas...', 'Actualizando', 15);

  // 1a. Entrevistas: eliminar "Calificación"
  try {
    const ent = ss.getSheetByName('Entrevistas');
    if (ent) {
      const hdrs = ent.getRange(1, 1, 1, ent.getLastColumn()).getValues()[0];
      const col = hdrs.indexOf('Calificación') + 1;
      if (col > 0) { ent.deleteColumn(col); log.push('✓ "Calificación" eliminada de Entrevistas'); }
      else { log.push('ℹ "Calificación" no estaba en Entrevistas'); }
    }
  } catch(e) { errores.push('✗ Error eliminando Calificación: ' + e.message); }

  // 1b. Hoja de Interés: mover "Notas/Comentario" antes de "Estado"
  try {
    const res = moverColumnaAntesDe_Tech(ss.getSheetByName('Hoja de Interés'), 'Notas/Comentario', 'Estado');
    log.push(res);
  } catch(e) { errores.push('✗ Error moviendo Notas/Comentario: ' + e.message); }

  // ── Paso 2: Columnas faltantes en Hoja de Interés ────────────────────
  ss.toast('Paso 2/3: Agregando columnas de seguimiento...', 'Actualizando', 15);
  try {
    agregarYOrganizarColumnasLlamadas();
    log.push('✓ Columnas de seguimiento (1ra/2da Llamada + Comentarios + Mensajes) agregadas');
  } catch(e) { errores.push('✗ Error en columnas de Interés: ' + e.message); }

  // ── Paso 3: Reconfigurar validaciones ─────────────────────────────────
  ss.toast('Paso 3/3: Reconfigurando dropdowns...', 'Actualizando', 15);
  try {
    configurarValidaciones();
    log.push('✓ Dropdowns actualizados en todas las hojas');
  } catch(e) { errores.push('✗ Error en configurarValidaciones: ' + e.message); }

  // ── Paso 4: Reparar y actualizar reportes ─────────────────────────────
  ss.toast('Paso 4/4: Actualizando reportes...', 'Actualizando', 15);
  try {
    // Reparar fórmulas del Reporte
    repararFormulasReporte();
    log.push('✓ Fórmulas del Reporte reparadas');
  } catch(e) { errores.push('✗ Error reparando fórmulas del Reporte: ' + e.message); }

  try {
    // Reparar fórmulas de Cohortes
    repararFormulasCohortes();
    log.push('✓ Fórmulas de Cohortes reparadas');
  } catch(e) { errores.push('✗ Error reparando fórmulas de Cohortes: ' + e.message); }

  try {
    // Actualizar Reportes Mensuales
    asegurarEstructuraReportesMensualesTech();
    log.push('✓ Estructura de Reportes Mensuales verificada');
  } catch(e) { errores.push('✗ Error en Reportes Mensuales: ' + e.message); }

  // ── Resultado ─────────────────────────────────────────────────────────
  SpreadsheetApp.flush();
  const titulo = errores.length > 0 ? '⚠️ Actualización completada con advertencias' : '✅ Actualización completada';
  ui.alert(titulo,
    (log.length > 0 ? log.join('\n') : '') +
    (errores.length > 0 ? '\n\n⚠️ Errores:\n' + errores.join('\n') : ''),
    ui.ButtonSet.OK);
}

/**
 * Agrega y reorganiza columnas de seguimiento en Hoja de Interés
 * Orden final: ... Notas/Comentario → 1ra Llamada → Comentario 1ra →
 *              Mensaje 1ra → 2da Llamada → Comentario 2da → Mensaje 2da → Estado
 */
function agregarYOrganizarColumnasLlamadas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Hoja de Interés');
  if (!sheet) return;

  const ORDEN = [
    '1ra Llamada',
    'Comentario 1ra Llamada',
    'Mensaje Enviado 1ra',
    '2da Llamada',
    'Comentario 2da Llamada',
    'Mensaje Enviado 2da'
  ];

  // ── Paso 1: Agregar las que faltan al final ──────────────────────────
  let hdrs = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  ORDEN.forEach(nombre => {
    if (!hdrs.some(h => h.toString().trim() === nombre)) {
      sheet.getRange(1, sheet.getLastColumn() + 1).setValue(nombre);
      hdrs = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    }
  });

  // ── Paso 2: Moverlas DESPUÉS de "Estado", en orden correcto ─────────
  for (let i = 0; i < ORDEN.length; i++) {
    hdrs = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const posActual = hdrs.findIndex(h => h.toString().trim() === ORDEN[i]) + 1;
    if (posActual === 0) continue;

    let posDestino;
    if (i === 0) {
      // Primera: justo DESPUÉS de "Estado"
      const posEstado = hdrs.findIndex(h => h.toString().trim() === 'Estado') + 1;
      posDestino = posEstado > 0 ? posEstado + 1 : sheet.getLastColumn();
    } else {
      // Las demás: justo después de la anterior del grupo
      const posAnterior = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
        .findIndex(h => h.toString().trim() === ORDEN[i - 1]) + 1;
      posDestino = posAnterior + 1;
    }

    if (posActual !== posDestino) {
      sheet.moveColumns(sheet.getRange(1, posActual, 1, 1), posDestino);
    }
  }

  // ── Paso 3: Estilo limpio — sin colores, encabezado en negrita ───────
  hdrs = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const lastRow = Math.max(sheet.getLastRow(), 2);
  ORDEN.forEach(nombre => {
    const col = hdrs.findIndex(h => h.toString().trim() === nombre) + 1;
    if (col === 0) return;

    // Encabezado: sin color de fondo, solo negrita
    sheet.getRange(1, col)
      .setBackground(null)
      .setFontWeight('bold')
      .setHorizontalAlignment('center')
      .setFontColor('#000000');

    // Cuerpo: sin color de fondo
    sheet.getRange(2, col, lastRow - 1, 1).setBackground(null);

    // Ancho de columna
    sheet.setColumnWidth(col, nombre.includes('Comentario') || nombre.includes('Mensaje') ? 180 : 130);

    // Validaciones para 1ra y 2da Llamada
    if (nombre === '1ra Llamada') {
      sheet.getRange(2, col, 499, 1).setDataValidation(
        SpreadsheetApp.newDataValidation()
          .requireValueInList(['Contestó', 'No contestó', 'Pendiente'])
          .setAllowInvalid(true).build()
      );
    } else if (nombre === '2da Llamada') {
      sheet.getRange(2, col, 499, 1).setDataValidation(
        SpreadsheetApp.newDataValidation()
          .requireValueInList(['Contestó', 'No contestó', 'Reprogramada', 'Pendiente'])
          .setAllowInvalid(true).build()
      );
    }
  });

  SpreadsheetApp.flush();
  SpreadsheetApp.getActiveSpreadsheet().toast('✅ Columnas organizadas después de "Estado"', 'Hoja de Interés', 4);
}

// =====================================================================
// REPARAR COLUMNAS — Elimina Calificación, reubica Notas/Comentario
// =====================================================================
function repararColumnasTech() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  const log = [];

  // ── 1. Entrevistas: eliminar columna "Calificación" ──────────────────
  const entrevistas = ss.getSheetByName('Entrevistas');
  if (entrevistas) {
    const hdrsEnt = entrevistas.getRange(1, 1, 1, entrevistas.getLastColumn()).getValues()[0];
    const colCalif = hdrsEnt.indexOf('Calificación') + 1;
    if (colCalif > 0) {
      entrevistas.deleteColumn(colCalif);
      log.push('✓ Columna "Calificación" eliminada de Entrevistas');
    } else {
      log.push('ℹ "Calificación" ya no existe en Entrevistas');
    }
  }

  // ── 2. Hoja de Interés: mover "Notas/Comentario" entre O y P ─────────
  const interes = ss.getSheetByName('Hoja de Interés');
  if (interes) {
    const hdrsInt = interes.getRange(1, 1, 1, interes.getLastColumn()).getValues()[0];
    const idxEstado = hdrsInt.indexOf('Estado') + 1;
    const idxNotas  = hdrsInt.indexOf('Notas/Comentario') + 1;
    if (idxNotas > 0 && idxEstado > 0) {
      if (idxNotas === idxEstado - 1) {
        log.push('ℹ "Notas/Comentario" ya está entre Servicio y Estado');
      } else {
        interes.moveColumns(interes.getRange(1, idxNotas, 1, 1), idxEstado);
        log.push('✓ "Notas/Comentario" movida entre Servicio/Formación y Estado');
      }
    } else if (idxNotas === 0) {
      log.push('⚠ Columna "Notas/Comentario" no encontrada en Hoja de Interés');
    }
  }

  // ── 3. Reconfigurar validaciones ──────────────────────────────────────
  configurarValidaciones();
  log.push('✓ Validaciones actualizadas');

  ui.alert(
    '✅ Reparación completada',
    log.join('\n'),
    ui.ButtonSet.OK
  );
}

/**
 * =====================================================================
 * EXPORTACIÓN POWERBI — Consolida datos para Power BI
 * =====================================================================
 */
// ── Helpers compartidos por PowerBI_Export ────────────────────────────────

function _pbiFmt(v) {
  if (!v && v !== 0) return '';
  if (v instanceof Date) return Utilities.formatDate(v, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');
  return v.toString().trim();
}

function _pbiGenero(v) {
  const s = (v || '').toString().trim().toLowerCase();
  if (['mujer','femenino','femenina','f','fem'].includes(s)) return 'Mujer';
  if (['hombre','masculino','masculina','m','masc'].includes(s)) return 'Hombre';
  return _pbiFmt(v);
}

function _pbiNorm(s) {
  return (s || '').toString().normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function _pbiCol(hdr, nombres) {
  if (!hdr) return -1;
  return hdr.findIndex(h => nombres.some(n => _pbiNorm(h) === _pbiNorm(n)));
}

function _pbiIndex(datos, colId) {
  const idx = new Map();
  if (!datos || datos.length < 2 || colId < 0) return idx;
  for (let i = 1; i < datos.length; i++) {
    const id = (datos[i][colId] || '').toString().trim();
    if (id) idx.set(id, datos[i]);
  }
  return idx;
}

// ── Crear hoja PowerBI_Export (participantes) ─────────────────────────────

function crearHojaPowerBIExport() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('PowerBI_Export');
  if (!sheet) sheet = ss.insertSheet('PowerBI_Export');

  const COLS = ['Creamos ID','Nombre Completo','DPI','Teléfono','Edad','Género',
    'Zona','Nivel Educativo','Estado Actual','Fecha Interés','Fecha Entrevista',
    'Resultado Entrevista','Fecha Inscripción','Cohorte','Fecha Graduación',
    'Fecha Retiro','Responsable'];

  sheet.clearContents();
  sheet.getRange(1, 1, 1, COLS.length).setValues([COLS])
    .setFontWeight('bold').setBackground('#1565c0').setFontColor('white');
  sheet.setFrozenRows(1);
  [120,160,110,90,50,110,70,140,100,130,130,150,130,140,130,100,120]
    .forEach((w,i) => sheet.setColumnWidth(i+1, w));
  return sheet;
}

// ── Actualizar PowerBI_Export (participantes consolidados) ────────────────

function actualizarPowerBIExport() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  try {
    const sheet = crearHojaPowerBIExport();

    const get = nombre => {
      const h = ss.getSheetByName(nombre);
      return h ? h.getDataRange().getValues() : [];
    };

    const dInt  = get('Hoja de Interés');
    const dEnt  = get('Entrevistas');
    const dInsc = get('Inscritx');
    const dGrad = get('Graduadx');
    const dRet  = get('Retiradx');

    // Detectar columnas de cada hoja
    const c = {
      int: {
        id:     _pbiCol(dInt[0],  ['Creamos ID','CREAMOS ID']),
        nom:    _pbiCol(dInt[0],  ['Nombre Completo']),
        dpi:    _pbiCol(dInt[0],  ['DPI']),
        tel:    _pbiCol(dInt[0],  ['Teléfono','Telefono']),
        edad:   _pbiCol(dInt[0],  ['Edad']),
        gen:    _pbiCol(dInt[0],  ['Género','Genero']),
        zona:   _pbiCol(dInt[0],  ['Zona']),
        nivel:  _pbiCol(dInt[0],  ['Nivel Educativo']),
        resp:   _pbiCol(dInt[0],  ['Responsable']),
        fecha:  _pbiCol(dInt[0],  ['Fecha','Fecha registro'])
      },
      ent: {
        id:     _pbiCol(dEnt[0],  ['Creamos ID']),
        fecha:  _pbiCol(dEnt[0],  ['Fecha entrevista','Fecha']),
        estado: _pbiCol(dEnt[0],  ['Estado','Resultado'])
      },
      ins: {
        id:     _pbiCol(dInsc[0], ['Creamos ID']),
        fecha:  _pbiCol(dInsc[0], ['Fecha envío a Inscritx','Fecha']),
        coh:    _pbiCol(dInsc[0], ['Enviar a Cohorte','Cohorte'])
      },
      grd: {
        id:     _pbiCol(dGrad[0], ['Creamos ID']),
        fecha:  _pbiCol(dGrad[0], ['Fecha','Fecha graduación'])
      },
      ret: {
        id:     _pbiCol(dRet[0],  ['Creamos ID']),
        fecha:  _pbiCol(dRet[0],  ['Fecha','Fecha retiro'])
      }
    };

    // Índices por Creamos ID para búsqueda O(1)
    const idxEnt  = _pbiIndex(dEnt,  c.ent.id);
    const idxInsc = _pbiIndex(dInsc, c.ins.id);
    const idxGrad = _pbiIndex(dGrad, c.grd.id);
    const idxRet  = _pbiIndex(dRet,  c.ret.id);

    const filas = [];

    for (let i = 1; i < dInt.length; i++) {
      const row = dInt[i];
      const cId = (c.int.id >= 0 ? row[c.int.id] : '').toString().trim();
      if (!cId) continue;

      const rEnt  = idxEnt.get(cId)  || null;
      const rInsc = idxInsc.get(cId) || null;
      const rGrad = idxGrad.get(cId) || null;
      const rRet  = idxRet.get(cId)  || null;

      // Estado actual (prioridad: Graduadx > Retiradx > Inscritx > resultado entrevista > En Entrevista > Interesada)
      const resultEnt = rEnt && c.ent.estado >= 0 ? _pbiFmt(rEnt[c.ent.estado]) : '';
      let estado = 'Interesada';
      if (rGrad)       estado = 'Graduadx';
      else if (rRet)   estado = 'Retiradx';
      else if (rInsc)  estado = 'Inscritx';
      else if (rEnt)   estado = resultEnt || 'En Entrevista';

      filas.push([
        cId,
        c.int.nom   >= 0 ? _pbiFmt(row[c.int.nom])   : '',
        c.int.dpi   >= 0 ? _pbiFmt(row[c.int.dpi])   : '',
        c.int.tel   >= 0 ? _pbiFmt(row[c.int.tel])   : '',
        c.int.edad  >= 0 ? (row[c.int.edad] || '')    : '',
        c.int.gen   >= 0 ? _pbiGenero(row[c.int.gen]) : '',
        c.int.zona  >= 0 ? _pbiFmt(row[c.int.zona])  : '',
        c.int.nivel >= 0 ? _pbiFmt(row[c.int.nivel]) : '',
        estado,
        c.int.fecha >= 0 ? _pbiFmt(row[c.int.fecha]) : '',
        rEnt  && c.ent.fecha >= 0 ? _pbiFmt(rEnt[c.ent.fecha])   : '',
        resultEnt,
        rInsc && c.ins.fecha >= 0 ? _pbiFmt(rInsc[c.ins.fecha])  : '',
        rInsc && c.ins.coh   >= 0 ? _pbiFmt(rInsc[c.ins.coh])    : '',
        rGrad && c.grd.fecha >= 0 ? _pbiFmt(rGrad[c.grd.fecha])  : '',
        rRet  && c.ret.fecha >= 0 ? _pbiFmt(rRet[c.ret.fecha])   : '',
        c.int.resp  >= 0 ? _pbiFmt(row[c.int.resp])  : ''
      ]);
    }

    // Actualizar PowerBI_Export con información de cohorte
    // Si está en una hoja de cohorte, buscar cuál
    for (let i = filas.length - 1; i >= 0; i--) {
      const cId = filas[i][0];
      if (!cId) continue;

      // Si no tiene cohorte en Inscritx, buscar en hojas de cohorte
      if (!filas[i][13]) { // columna 13 = Cohorte
        const cohortesSheet = ss.getSheetByName('Cohortes');
        if (cohortesSheet) {
          const datosCohortes = cohortesSheet.getDataRange().getValues();
          for (let j = 1; j < datosCohortes.length; j++) {
            const nombreCohorte = datosCohortes[j][0] ? datosCohortes[j][0].toString().trim() : '';
            if (nombreCohorte) {
              const hojaCohorte = ss.getSheetByName(nombreCohorte);
              if (hojaCohorte) {
                const datosCohorte = hojaCohorte.getDataRange().getValues();
                const colIdCohorte = datosCohorte[0] ? datosCohorte[0].findIndex(h =>
                  (h || '').toString().toLowerCase().replace(/[^a-z0-9]/g, '').includes('id')
                ) : -1;

                for (let k = 1; k < datosCohorte.length; k++) {
                  const idEnCohorte = colIdCohorte >= 0 ? (datosCohorte[k][colIdCohorte] || '').toString().trim() : '';
                  if (idEnCohorte === cId.toString().trim()) {
                    filas[i][13] = nombreCohorte;
                    break;
                  }
                }
              }
            }
          }
        }
      }
    }

    // Escribir todo de una vez
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) sheet.getRange(2, 1, lastRow - 1, 17).clearContent();
    if (filas.length > 0) sheet.getRange(2, 1, filas.length, 17).setValues(filas);

    SpreadsheetApp.flush();
    ui.alert('✅ PowerBI_Export actualizado',
      filas.length + ' participantes exportados con:\n• Estado Actual\n• Fechas formateadas\n• Resultado de entrevista',
      ui.ButtonSet.OK);
    Logger.log('✅ PowerBI_Export: ' + filas.length + ' filas');

  } catch (e) {
    Logger.log('❌ Error PowerBI_Export: ' + e.message + '\n' + e.stack);
    ui.alert('❌ Error', 'PowerBI_Export falló: ' + e.message, ui.ButtonSet.OK);
  }
}

function instalarTriggerPowerBIExport() {
  const ui = SpreadsheetApp.getUi();
  try {
    desinstalarTriggerPowerBIExport();
    ScriptApp.newTrigger('autoActualizarPowerBIExport')
      .timeBased()
      .atHour(2)
      .everyDays(1)
      .create();
    ui.alert('✅ Trigger instalado', 'PowerBI_Export se actualizará diariamente a las 2 AM', ui.ButtonSet.OK);
  } catch (e) {
    ui.alert('❌ Error', 'No se pudo instalar el trigger: ' + e.message, ui.ButtonSet.OK);
  }
}

function desinstalarTriggerPowerBIExport() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(t => {
    if (t.getHandlerFunction() === 'autoActualizarPowerBIExport') {
      ScriptApp.deleteTrigger(t);
    }
  });
}

function autoActualizarPowerBIExport() {
  try {
    actualizarPowerBIExport();
    Logger.log('✅ PowerBI_Export actualizado automáticamente a ' + new Date());
  } catch (e) {
    Logger.log('❌ Error en actualización automática: ' + e.message);
  }
}

// =====================================================================
// PRUEBA DE RENDIMIENTO
// =====================================================================

function pruebaRendimientoTech() {
  _pruebaRendimiento(NOMBRE_HOJA_CREAMOS_ID_TECH);
}

function _pruebaRendimiento(nombreDirectorio) {
  const ss  = SpreadsheetApp.getActiveSpreadsheet();
  const ui  = SpreadsheetApp.getUi();
  const t0  = Date.now();
  const resultados = [];

  function medir(nombre, fn) {
    const ini = Date.now();
    let filas = 0, error = '';
    try { filas = fn(); } catch(e) { error = e.message; }
    const ms = Date.now() - ini;
    const estado = error ? '❌' : ms < 2000 ? '🟢' : ms < 5000 ? '🟡' : '🔴';
    resultados.push({ nombre, ms, filas, estado, error });
    Logger.log(estado + ' ' + nombre + ': ' + ms + 'ms' + (filas ? ' (' + filas + ' filas)' : '') + (error ? ' ERROR: ' + error : ''));
  }

  ss.toast('Iniciando prueba de rendimiento...', '⚡', -1);

  // 1. Carga del directorio
  medir('Carga directorio', function() {
    const h = ss.getSheetByName(nombreDirectorio);
    if (!h) return 0;
    const d = h.getDataRange().getValues();
    return d.length;
  });

  // 2. Detección de hojas (forzarRefresh=true para medir tiempo real, no caché)
  medir('Detectar hojas con Creamos ID', function() {
    return _detectarHojasConCreamosID(ss, nombreDirectorio, true).length;
  });

  // 3. Lectura de todas las hojas de participantes (usa caché ya calentada)
  const hojas = _detectarHojasConCreamosID(ss, nombreDirectorio);
  let totalFilas = 0;
  medir('Leer todas las hojas (' + hojas.length + ' hojas)', function() {
    hojas.forEach(function(nombre) {
      const h = ss.getSheetByName(nombre);
      if (!h) return;
      // getDataRange().getValues() = 1 llamada API vs 3 (getLastRow+getLastColumn+getValues)
      const d = h.getDataRange().getValues();
      if (d.length > 1) totalFilas += d.length - 1; // -1 para excluir encabezado
    });
    return totalFilas;
  });

  // 4. Construcción del mapa del directorio
  medir('Construir mapa de búsqueda', function() {
    const colMapDir = detectarColumnasDirectorio();
    if (!colMapDir) return 0;
    const datos = ss.getSheetByName(nombreDirectorio).getDataRange().getValues();
    const mapa = {};
    for (let i = 1; i < datos.length; i++) {
      const cId = colMapDir.creamosId >= 0 ? (datos[i][colMapDir.creamosId] || '').toString().trim() : '';
      if (cId) mapa[normalizarBusqueda(cId)] = true;
    }
    return Object.keys(mapa).length;
  });

  // 5. similitudNombre: velocidad con 100 comparaciones
  medir('100 comparaciones similitudNombre', function() {
    const nombres = ['María García López','Juan Pérez Rodríguez','Ana Martínez','Carlos López','Rosa Hernández'];
    let n = 0;
    for (let i = 0; i < 100; i++) {
      similitudNombre(nombres[i % nombres.length], nombres[(i + 1) % nombres.length]);
      n++;
    }
    return n;
  });

  // 6. Triggers instalados
  medir('Verificar triggers', function() {
    return ScriptApp.getProjectTriggers().length;
  });

  // 7. Tiempo total
  const totalMs = Date.now() - t0;
  ss.toast('', '', 1);

  // Generar reporte
  const NOMBRE_REP = '⚡ Rendimiento';
  let hojaRep = ss.getSheetByName(NOMBRE_REP);
  if (!hojaRep) { hojaRep = ss.insertSheet(NOMBRE_REP); }
  else { hojaRep.clearContents(); hojaRep.clearFormats(); }

  hojaRep.getRange(1,1,1,5).setValues([['Prueba','Tiempo (ms)','Filas/Items','Estado','Error']])
    .setBackground('#1A237E').setFontColor('#FFF').setFontWeight('bold');

  const filasDatos = resultados.map(function(r) {
    return [r.nombre, r.ms, r.filas || '', r.estado, r.error || ''];
  });
  filasDatos.push(['── TOTAL ──', totalMs, totalFilas + ' filas en sistema', totalMs < 10000 ? '🟢 Rápido' : totalMs < 20000 ? '🟡 Aceptable' : '🔴 Lento', '']);

  hojaRep.getRange(2, 1, filasDatos.length, 5).setValues(filasDatos);

  // Colorear filas por estado
  resultados.forEach(function(r, i) {
    const color = r.error ? '#FFCDD2' : r.ms < 2000 ? '#E8F5E9' : r.ms < 5000 ? '#FFF9C4' : '#FFCDD2';
    hojaRep.getRange(i + 2, 1, 1, 5).setBackground(color);
  });
  hojaRep.getRange(filasDatos.length + 1, 1, 1, 5).setBackground('#E3F2FD').setFontWeight('bold');
  hojaRep.autoResizeColumns(1, 5);
  hojaRep.setFrozenRows(1);

  // Verificar triggers duplicados
  const triggers = ScriptApp.getProjectTriggers().filter(function(t) {
    return t.getHandlerFunction() === 'alEditarTech' || t.getHandlerFunction() === 'alEditarAB';
  });
  const alertaTrigger = triggers.length > 1
    ? '\n\n⚠️ ALERTA: Tienes ' + triggers.length + ' triggers onEdit instalados. Debe ser exactamente 1. Esto causa diálogos dobles.'
    : '\n\n✅ Trigger onEdit: ' + triggers.length + ' instalado (correcto)';

  const velocidad = totalMs < 10000 ? '🟢 Excelente' : totalMs < 20000 ? '🟡 Aceptable' : '🔴 Necesita optimización';

  ss.setActiveSheet(hojaRep);
  ui.alert('⚡ Resultado de Rendimiento',
    velocidad + ' — ' + totalMs + 'ms total\n' +
    '📊 ' + totalFilas + ' filas de participantes en ' + hojas.length + ' hojas\n\n' +
    resultados.map(function(r) {
      return r.estado + ' ' + r.nombre + ': ' + r.ms + 'ms' + (r.error ? ' ❌ ' + r.error : '');
    }).join('\n') +
    alertaTrigger +
    '\n\nVer hoja "⚡ Rendimiento" para el detalle.',
    ui.ButtonSet.OK);
}

function separarDatos2025Tech() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  const res = ui.alert(
    '📦 Separar datos 2025',
    '¿Mover todos los registros del año 2025 de la Hoja de Interés a una hoja "Histórico 2025"?\n\n⚠️ Los datos serán movidos (se eliminarán de la Hoja de Interés).',
    ui.ButtonSet.YES_NO
  );
  if (res !== ui.Button.YES) return;

  const interes = ss.getSheetByName('Hoja de Interés');
  if (!interes) { ui.alert('No se encontró la Hoja de Interés.'); return; }

  let historico = ss.getSheetByName('Histórico 2025');
  if (!historico) {
    historico = ss.insertSheet('Histórico 2025');
  }

  const datos = interes.getDataRange().getValues();
  const headers = datos[0];

  if (historico.getLastRow() === 0) {
    historico.getRange(1, 1, 1, headers.length).setValues([headers])
      .setBackground('#37474f').setFontColor('white').setFontWeight('bold');
  }

  const filasA2025 = [];
  const filasRestantes = [headers];

  for (let i = 1; i < datos.length; i++) {
    const fila = datos[i];
    const nombreE = fila[4];
    if (!nombreE) continue;
    const fechaVal = fila[0];
    let es2025 = false;
    if (fechaVal instanceof Date && !isNaN(fechaVal)) {
      es2025 = fechaVal.getFullYear() === 2025;
    } else if (typeof fechaVal === 'string') {
      es2025 = fechaVal.includes('2025');
    }
    if (es2025) {
      filasA2025.push(fila);
    } else {
      filasRestantes.push(fila);
    }
  }

  if (filasA2025.length === 0) {
    ui.alert('No se encontraron registros del año 2025.');
    return;
  }

  const ultimaHistorico = Math.max(historico.getLastRow(), 1) + 1;
  historico.getRange(ultimaHistorico, 1, filasA2025.length, headers.length).setValues(filasA2025);

  interes.clearContents();
  interes.getRange(1, 1, filasRestantes.length, headers.length).setValues(filasRestantes);
  interes.getRange(1, 1, 1, headers.length).setBackground('#1565c0').setFontColor('white').setFontWeight('bold');

  ui.alert('✅ Listo', filasA2025.length + ' registros del 2025 movidos a "Histórico 2025".\n' + (filasRestantes.length - 1) + ' registros del 2026+ permanecen en Hoja de Interés.', ui.ButtonSet.OK);
}
