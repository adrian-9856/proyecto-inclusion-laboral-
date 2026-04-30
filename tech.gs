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
  ],

  // ========== ESTIPENDIOS ==========
  // URL de KoboToolbox para importar Estipendios
  KOBO_ESTIPENDIOS_URL: 'https://kf.kobotoolbox.org/api/v2/assets/ay7MxyzvXBGGakXG7jkAE3/export-settings/esS6RKmzxXxn3qK87Jwxgrt/data.csv',

  // Token de Kobo para autenticación
  KOBO_TOKEN: '64cc018b88067397addd36b09288be8b6539cf39',

  // Email para alertas de estipendios
  EMAIL_ALERTAS_ESTIPENDIOS: 'adrian@example.com'  // ⚠️ CAMBIAR POR TU EMAIL REAL
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
      // ========== ACCIONES PRINCIPALES ==========
      .addItem('📥 Importar Datos Históricos (una vez)', 'importarDatosHistoricos')
      .addItem('📥 Importar Datos Nuevos (cada 10 min)', 'importarDesdeKoboTech')
      .addItem('🔁 Actualizar desde CREAMOS ID', 'actualizarTodosDesdeDirectorio')
      .addSeparator()

      // ========== DATOS (IMPORTAR/ACTUALIZAR) ==========
      .addSubMenu(ui.createMenu('📥 Datos')
        .addItem('🔄 Actualizar Todas las Notas', 'actualizarNotasDesdeKoboTech')
        .addItem('📝 Importar Entrevistas', 'importarEntrevistasDesdeKobo')
        .addSeparator()
        .addItem('⏰ Activar Auto-Importación (c/10 min)', 'instalarTriggersImportacionAuto')
        .addItem('🛑 Desactivar Auto-Importación', 'desinstalarTriggersImportacionAuto'))
      .addSeparator()

      // ========== COHORTES ==========
      .addSubMenu(ui.createMenu('📋 Cohortes')
        .addItem('➕ Crear Nueva Cohorte', 'crearNuevaCohorteTech')
        .addItem('✏️ Editar Cohorte', 'editarCohorte')
        .addItem('👥 Enviar Participantes', 'enviarParticipantesACohorteTech')
        .addItem('📊 Estadísticas', 'estadisticasCohorte')
        .addSeparator()
        .addItem('📝 Ver/Gestionar', 'verCohortes'))
      .addSeparator()

      // ========== REPORTES ==========
      .addSubMenu(ui.createMenu('📊 Reportes')
        .addItem('✨ Mejorar Reportes', 'mejorarYRepararReportes')
        .addItem('📊 Guardar Mensual (Manual)', 'guardarReporteMensualAutomatico')
        .addItem('💾 PowerBI Export', 'crearHojaPowerBIExport')
        .addSeparator()
        .addItem('⏰ Activar Reportes Automáticos', 'instalarTriggersReportesMensuales')
        .addItem('🛑 Desactivar Reportes Automáticos', 'desinstalarTriggersReportesMensuales'))
      .addSeparator()

      // ========== HERRAMIENTAS ==========
      .addSubMenu(ui.createMenu('🛠️ Herramientas')
        .addItem('🧹 Limpiar Cohortes Mal Nombradas', 'limpiarCohortesMalNombradasTech')
        .addItem('🧹 Limpiar Cohortes Eliminadas', 'limpiarCohortesEliminadas')
        .addItem('🔧 Reparar Validaciones', 'repararValidaciones')
        .addItem('🔧 Reparar Fórmulas', 'repararFormulas')
        .addSeparator()
        .addItem('👤 Agregar Responsable', 'agregarResponsable')
        .addItem('✅ Verificar Instalación', 'verificarInstalacion'))
      .addSeparator()

      // ========== CONFIGURACIÓN ==========
      .addSubMenu(ui.createMenu('⚙️ Configuración')
        .addItem('✅ Instalar Sistema', 'instalarSistemaCompletoTech')
        .addItem('🆕 Activar Mejoras Entrevistas', 'activarMejorasEntrevistasTech')
        .addSeparator()
        .addItem('🔗 URL Kobo Registros', 'configurarKoboURL')
        .addItem('🔗 URL Kobo Entrevistas', 'configurarKoboEntrevistasURL')
        .addItem('📧 Configurar Email', 'configurarEmail')
        .addSeparator()
        .addItem('⏰ Instalar Triggers', 'instalarTriggers'))

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
    'Estado',           // K - Automático "Inscritx"
    'Enviar a Cohorte'  // L - Desplegable dinámico (última columna - trigger)
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setBackground('#2e7d32')
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  [50, 100, 130, 200, 120, 60, 120, 150, 120, 250, 120, 180].forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });

  // Destacar columnas importantes
  sheet.getRange('K1').setBackground('#ffd54f'); // Estado en amarillo
  sheet.getRange('L1').setBackground('#4caf50');  // Enviar a Cohorte en verde
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
    // Inscritas: cuenta participantes en la hoja individual de la cohorte, restando los que están en Retiradx
    sheet.getRange('H' + i).setFormula('=IF(A' + i + '="",0,IFERROR(COUNTIF(INDIRECT("\'"&A' + i + '&"\'!E:E"),"<>")-1-COUNTIF(INDIRECT("\'"&A' + i + '&"\'!K:K"),"Retiradx"),0))');
    sheet.getRange('I' + i).setFormula('=IFERROR(COUNTIF(Graduadx!H:H,A' + i + '),0)');
    sheet.getRange('J' + i).setFormula('=IFERROR(COUNTIF(Retiradx!H:H,A' + i + '),0)');
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
        .requireValueInList(CONFIG_TECH.GENEROS)
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
  // Columnas: A-Fecha, B-Hora, C-AbrirKobo, D-CreamosID, E-DPI, F-Nombre, G-Género, H-Edad, I-Tel, J-NivelEdu, K-Zona, L-Entrevistador, M-Calificación, N-Observaciones, O-Estado
  const entrevistas = ss.getSheetByName('Entrevistas');
  if (entrevistas) {
    // Género (G)
    entrevistas.getRange('G2:G500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG_TECH.GENEROS).setAllowInvalid(true).build()
    );
    // Nivel Educativo (J)
    entrevistas.getRange('J2:J500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG_TECH.NIVELES_EDUCATIVOS).setAllowInvalid(true).build()
    );
    // Zona (K)
    entrevistas.getRange('K2:K500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG_TECH.ZONAS).setAllowInvalid(true).build()
    );
    // Entrevistador (L)
    entrevistas.getRange('L2:L500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(responsables).setAllowInvalid(true).build()
    );
    // Estado (O) - Resultado de entrevista (última columna)
    // Opciones: Aprobada, No aprobada, No asistió, Reprogramada, Derivar a Paso a Paso, 🔗 Abrir Kobo
    entrevistas.getRange('O2:O500').setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList(CONFIG_TECH.RESULTADO_FINAL.concat(['Derivar a Paso a Paso', '🔗 Abrir Kobo']))
        .setAllowInvalid(false)
        .build()
    );
  }

  // === HOJA DE SELECCIONADAS ===
  // Columnas: A-No, B-CreamosID, C-DPI, D-Nombre, E-Género, F-Edad, G-Tel, H-NivelEdu, I-Zona, J-Notas, K-Estado, L-EnviarACohorte
  const seleccionadas = ss.getSheetByName('Inscritx');
  if (seleccionadas) {
    // Género (E)
    seleccionadas.getRange('E2:E500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG_TECH.GENEROS).setAllowInvalid(true).build()
    );
    seleccionadas.getRange('H2:H500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG_TECH.NIVELES_EDUCATIVOS).setAllowInvalid(false).build()
    );
    seleccionadas.getRange('I2:I500').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(CONFIG_TECH.ZONAS).setAllowInvalid(true).build()
    );
    // Enviar a Cohorte (L) - dropdown dinámico con cohortes activas
    if (cohortes.length > 0) {
      seleccionadas.getRange('L2:L500').setDataValidation(
        SpreadsheetApp.newDataValidation().requireValueInList(cohortes).setAllowInvalid(false).build()
      );
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
  // Estado está en columna P (16) - solo "Entrevista agendada" o "No interesado"
  // ¿Tiene Hoja de Interés? está en columna Q (17) - Sí/No con marcado de color
  if (hoja === 'Hoja de Interés') {
    // Autocompletar cuando editan DPI (col D=4) o Nombre (col E=5)
    if (columna === 4 || columna === 5) {
      autocompletarDesdeCreamosID(true);
    }
    if (columna === 16) {
      procesarCambioEstadoInteres(sheet, fila, val);
    }
    if (columna === 17 && (val === 'Sí' || val === 'No')) {
      procesarMarcaHojaInteres(sheet, fila, val);
    }
  }

  // === ENTREVISTAS ===
  // Estado está en columna O (15) - triggers automáticos según resultado
  if (hoja === 'Entrevistas') {
    if (columna === 15) {
      if (val === '🔗 Abrir Kobo') {
        abrirFormularioKobo(sheet, fila, columna);
        return;
      }
      procesarResultadoEntrevista(sheet, fila, val);
      if (val === 'Derivar a Paso a Paso') {
        derivarApasoAPaso(sheet, fila);
      }
    }
  }

  // === PASO A PASO ===
  // Estado está en columna O (15) - mismas opciones que Entrevistas
  if (hoja === 'Paso a Paso') {
    if (columna === 15 && val === '🔗 Abrir Kobo') {
      abrirFormularioKobo(sheet, fila, columna);
      return;
    }
  }

  // === SELECCIONADAS ===
  // "Enviar a Cohorte" está en columna K (11) - al seleccionar cohorte se envía
  if (hoja === 'Inscritx') {
    // Enviar a Cohorte está en columna L (12)
    if (columna === 12 && val !== '') {
      procesarEnvioACohorte(sheet, fila, val);
    }
  }

  // === COHORTES ===
  // Estado está en columna N (14) - "Finalizada" activa graduación masiva
  if (hoja === 'Cohortes') {
    if (columna === 14 && val === 'Finalizada') {
      procesarFinalizacionCohorte(sheet, fila);
    }
  }

  // === NO SELECCIONADAS ===
  // Acción está en columna K (11) - reenviar a Entrevistas o Inscritx
  if (hoja === 'No Inscritx') {
    if (columna === 11 && val.startsWith('Reenviar')) {
      procesarReenvioDesdeNoInscritx(sheet, fila, val);
    }
  }

  // === DESERCIONES ===
  // Acción está en columna M (13) - reenviar a Inscritx
  if (hoja === 'Retiradx') {
    if (columna === 13 && val === 'Reenviar a Inscritx') {
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
 * Procesa cambio de estado en Hoja de Interés
 * - "No interesado" → Copia a No Inscritx (conserva registro en Hoja de Interés)
 * - "Entrevista agendada" → Copia a Entrevistas (conserva registro en Hoja de Interés)
 */
function procesarCambioEstadoInteres(sheet, fila, estado) {
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

  if (estado === 'No interesado') {
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
      'Motivo': 'No interesado',
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
      return; // ❌ NO REINTENTAR - puede sobrescribir datos
    }

    // Autocompletar robusto
    autocompletarFilaDesdeDirectorio(noInscritx, nuevaFila, mapearColumnasParaAutocompletar(noInscritx));
    
    sheet.getRange(fila, 1, 1, maxCol).setBackground('#ffe0b2');
    ss.toast('Registrado en No Inscritx', 'Hoja de Interés', 3);
  } 
  else if (estado === 'Entrevista agendada') {
    const entrevistas = ss.getSheetByName('Entrevistas');
    const colMapEntrevistas = obtenerMapaColumnas(entrevistas);
    const nuevaFila = obtenerPrimeraFilaVacia(entrevistas, ['C', 'E']);  // Columnas C=CreamosID y E=Nombre (evita sobrescritura en ambos casos)

    const numColsEnt = entrevistas.getLastColumn();
    const registro = new Array(numColsEnt).fill('');
    
    const mapping = {
      'Fecha Entrevista': new Date(),  // Nombre correcto de columna A en Entrevistas
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

    try {
      entrevistas.getRange(nuevaFila, 1, 1, registro.length).setValues([registro]);
      SpreadsheetApp.flush();
    } catch (e) {
      Logger.log('⚠️ ERROR CRÍTICO escribiendo en Entrevistas (tech): ' + e.message);
      SpreadsheetApp.getUi().alert('⚠️ Error al guardar en Entrevistas. Por favor inténtalo nuevamente.\n\nDetalle: ' + e.message);
      return; // ❌ NO REINTENTAR - puede sobrescribir datos
    }

    // Autocompletar robusto
    autocompletarFilaDesdeDirectorio(entrevistas, nuevaFila, mapearColumnasParaAutocompletar(entrevistas));
    
    sheet.getRange(fila, 1, 1, maxCol).setBackground('#e8f5e9');
    ss.toast('Copiada a Entrevistas', 'Hoja de Interés', 3);
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

  if (resultado === 'Aprobada') {
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
    
    // Función helper para obtener valor de Entrevistas de forma robusta
    const getVal = (nombre) => {
      const norm = nombre.toLowerCase().replace(/[^a-z0-9]/g, '');
      const idx = colMapEntrevistas[norm];
      let val = idx !== undefined ? datos[idx] : '';
      
      // Auto-normalizar nivel educativo
      if (norm === 'niveleducativo') return normalizarNivelEducativo(val);
      return val;
    };

    Logger.log('>>>> TRASLADO DESDE ENTREVISTAS (Aprobada - tech): ' + getVal('Nombre Completo') + ' (' + creamosId + ')');
    Logger.log('     Nivel Educativo: ' + getVal('Nivel Educativo'));
    Logger.log('     Zona: ' + getVal('Zona'));

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
      'Notas': getVal('Observaciones'),
      'Estado': 'Inscritx'
    };

    // Llenar el registro usando el mapa de destino (también robusto)
    for (let [header, valor] of Object.entries(mapping)) {
      const norm = header.toLowerCase().replace(/[^a-z0-9]/g, '');
      const targetIdx = colMapInscritx[norm];
      if (targetIdx !== undefined) registroInscritx[targetIdx] = valor;
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

    ss.toast('✅ Aprobada - copiada a Inscritx. (Mapeo Robusto V2.5)', 'Entrevista', 4);
    return;
  }

  if (resultado === 'No aprobada' || resultado === 'No asistió') {
    const noInscritx = ss.getSheetByName('No Inscritx');
    const colMapNoInscritx = obtenerMapaColumnas(noInscritx);
    const nuevaFila = obtenerPrimeraFilaVacia(noInscritx, 'C');

    const motivo = resultado === 'No aprobada' ? 'No aprobó entrevista' : 'No asistió a entrevista';

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
 * Muestra un modal con el link clickeable al formulario Kobo y limpia la celda Estado.
 */
function abrirFormularioKobo(sheet, fila, columna) {
  sheet.getRange(fila, columna).setValue('');
  const html = HtmlService.createHtmlOutput(
    '<div style="padding:24px;font-family:Arial,sans-serif;text-align:center;">' +
    '<h3 style="color:#1565c0;margin-top:0;">🔗 Formulario de Entrevista</h3>' +
    '<p style="color:#555;margin-bottom:20px;">Haz clic para abrir el formulario:</p>' +
    '<a href="https://ee.kobotoolbox.org/x/LHmyWvLj" target="_blank" ' +
    'style="display:inline-block;background:#2196f3;color:white;padding:14px 28px;' +
    'text-decoration:none;border-radius:8px;font-size:16px;font-weight:bold;">' +
    '🔗 Abrir Formulario</a>' +
    '</div>'
  ).setWidth(320).setHeight(180);
  SpreadsheetApp.getUi().showModalDialog(html, '🔗 Formulario Kobo');
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
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  // Datos de la hoja de cohorte: Fecha, No, CreamosID, DPI, Nombre, Género, Edad, Tel, NivelEdu, Zona, Estado, Año
  const datos = sheet.getRange(fila, 1, 1, 12).getValues()[0];
  const creamosId = datos[2];
  const nombre = datos[4];

  // Mostrar motivos de deserción
  let listaMotivos = '';
  CONFIG_TECH.MOTIVOS_DESERCION.forEach((motivo, idx) => {
    listaMotivos += (idx + 1) + '. ' + motivo + '\n';
  });

  const respuesta = ui.prompt(
    '📋 Deserción - ' + nombre,
    'Seleccione el MOTIVO:\n\n' + listaMotivos + '\nIngrese el número:',
    ui.ButtonSet.OK_CANCEL
  );

  if (respuesta.getSelectedButton() !== ui.Button.OK) {
    sheet.getRange(fila, 11).setValue(''); // Limpiar Estado
    return;
  }

  const num = parseInt(respuesta.getResponseText().trim());
  if (isNaN(num) || num < 1 || num > CONFIG_TECH.MOTIVOS_DESERCION.length) {
    ui.alert('Número inválido');
    sheet.getRange(fila, 11).setValue(''); // Limpiar Estado
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

  // LOCK: Prevenir condición de carrera al procesar múltiples envíos simultáneos
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000); // Esperar hasta 30 segundos
  } catch (e) {
    ss.toast('⚠️ El sistema está ocupado. Intente nuevamente en unos segundos.', 'Error', 4);
    const colMapTemp = obtenerMapaColumnas(sheet);
    const colEnvioTemp = colMapTemp['enviar a cohorte'];
    if (colEnvioTemp !== undefined) sheet.getRange(fila, colEnvioTemp + 1).setValue('');
    return;
  }

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

      const mappingDef = {
        ...mappingCohorte,
        'Cohorte': cohorteDestino
      };

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
    sheet.getRange(fila, 14).setValue('Activa');
    return;
  }

  const hojaCohorte = ss.getSheetByName(nombreCohorte);
  if (!hojaCohorte) {
    ss.toast('⚠️ No existe la hoja de la cohorte', 'Error', 3);
    sheet.getRange(fila, 14).setValue('Activa');
    return;
  }

  // Contar participantes activas en la cohorte (sin estado definido)
  const datosCohorte = hojaCohorte.getDataRange().getValues();
  let participantesActivas = 0;
  for (let i = 1; i < datosCohorte.length; i++) {
    if (datosCohorte[i][4] && (!datosCohorte[i][10] || datosCohorte[i][10] === '')) {
      participantesActivas++;
    }
  }

  if (participantesActivas === 0) {
    hojaCohorte.hideSheet();
    ss.toast('✅ Cohorte finalizada y archivada', 'Completado', 3);
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
    sheet.getRange(fila, 14).setValue('Activa');
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

  // ✅ FIX: Calcular primera fila vacía UNA SOLA VEZ antes del loop
  // Evita condiciones de carrera y sobrescritura de datos
  const primeraFilaVaciaGrad = graduadas.getLastRow() + 1;
  const registrosParaBatch = []; // Acumular todos los registros para escribir en batch

  for (let i = 1; i < datosCohorte.length; i++) {
    const fila = datosCohorte[i];
    // Solo procesar si tiene nombre y no tiene estado (o estado vacío)
    if (fila[4] && (!fila[10] || fila[10] === '')) {
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

  ss.toast('🎓 ' + datos[4] + ' graduada exitosamente', 'Completado', 3);

  // Recordatorio Salesforce
  ui.alert(
    '⚠️ Recordatorio Salesforce',
    datos[4] + ' ha sido graduada.\n\n' +
    'Recuerda cambiar la etapa en Salesforce a "Graduadx" para mantener el CRM actualizado.',
    ui.ButtonSet.OK
  );

  // Verificar si todos los participantes de la cohorte ya tienen estado
  const datosActualizados = sheet.getDataRange().getValues();
  const pendientes = datosActualizados.slice(1).filter(r => r[4] && (!r[10] || r[10] === '')).length;

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
  const ui = SpreadsheetApp.getUi();

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

      // Restaurar dropdown de Género (columna F) para esta fila
      hojaInteres.getRange(nuevaFila, 6).setDataValidation(
        SpreadsheetApp.newDataValidation()
          .requireValueInList(CONFIG_TECH.GENEROS)
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
          resultado.push([...campos]);
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
      resultado.push([...campos]);
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
  const ui = SpreadsheetApp.getUi();

  const props = PropertiesService.getDocumentProperties();
  const url = props.getProperty('KOBO_ENTREVISTAS_URL') || CONFIG_TECH.KOBO_ENTREVISTAS_URL;

  if (!url) {
    ui.alert('⚠️ URL no configurada', 'Configure la URL de Entrevistas de KoboToolbox primero.', ui.ButtonSet.OK);
    return;
  }

  try {
    ss.toast('📥 Descargando datos de entrevistas desde KoboToolbox...', 'Importando', 5);

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
  cohortes.getRange('H' + nuevaFila).setFormula('=IF(A' + nuevaFila + '="",0,IFERROR(COUNTIF(INDIRECT("\'"&A' + nuevaFila + '&"\'!E:E"),"<>")-1-COUNTIF(INDIRECT("\'"&A' + nuevaFila + '&"\'!K:K"),"Retiradx"),0))');
  cohortes.getRange('I' + nuevaFila).setFormula('=IFERROR(COUNTIF(Graduadx!H:H,A' + nuevaFila + '),0)');
  cohortes.getRange('J' + nuevaFila).setFormula('=IFERROR(COUNTIF(Retiradx!H:H,A' + nuevaFila + '),0)');

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
      // Auto-reparar fórmulas si alguna celda clave está vacía o es un número sin fórmula
      const b5 = reporte.getRange('B5').getFormula();
      if (!b5 || !b5.includes('COUNTA')) {
        repararFormulasReporte();
      } else {
        reporte.getRange('B2').setValue(new Date());
      }
      SpreadsheetApp.flush();
    }
    return true;
  } catch (e) { return false; }
}

/**
 * Re-aplica todas las fórmulas del Reporte sin borrar datos existentes.
 * Usar cuando el reporte muestra celdas vacías o datos incorrectos.
 */
function repararFormulasReporte() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const reporte = ss.getSheetByName('Reporte');
  if (!reporte) { ss.toast('❌ No existe la hoja Reporte', 'Error', 3); return; }

  reporte.getRange('B5').setFormula("=IFERROR(COUNTA('Hoja de Interés'!E:E)-1,0)");
  reporte.getRange('C5').setFormula("=IFERROR(COUNTIFS('Hoja de Interés'!A:A,\">=\"&DATE(YEAR(TODAY()),MONTH(TODAY()),1)),0)");
  reporte.getRange('B8').setFormula('=IFERROR(COUNTA(Entrevistas!D:D)-1,0)');
  reporte.getRange('C8').setFormula('=IFERROR(COUNTIF(Entrevistas!N:N,""),0)');
  reporte.getRange('B11').setFormula('=IFERROR(COUNTA(Inscritx!D:D)-1,0)');
  reporte.getRange('B17').setFormula('=IFERROR(COUNTA(Graduadx!D:D)-1,0)');
  reporte.getRange('C17').setFormula("=IFERROR(COUNTIFS(Graduadx!A:A,\">=\"&DATE(YEAR(TODAY()),MONTH(TODAY()),1)),0)");
  reporte.getRange('B20').setFormula('=IFERROR(COUNTA(Retiradx!D:D)-1,0)');
  reporte.getRange('C20').setFormula("=IFERROR(COUNTIFS(Retiradx!A:A,\">=\"&DATE(YEAR(TODAY()),MONTH(TODAY()),1)),0)");
  reporte.getRange('D20').setFormula('=IFERROR(IF((B17+B20)>0,ROUND(B20/(B17+B20)*100,1)&"%","0%"),"0%")');
  reporte.getRange('B23').setFormula("=IFERROR(COUNTA('No Inscritx'!C:C)-1,0)");
  reporte.getRange('C23').setFormula("=IFERROR(COUNTIFS('No Inscritx'!A:A,\">=\"&DATE(YEAR(TODAY()),MONTH(TODAY()),1)),0)");
  reporte.getRange('B26').setFormula('=B5+B17+B20+B23');
  reporte.getRange('B27').setFormula('=IFERROR(IF((B17+B20)>0,ROUND(B17/(B17+B20)*100,1)&"%","0%"),"0%")');
  reporte.getRange('B28').setFormula('=B11');
  reporte.getRange('B2').setValue(new Date());

  ss.toast('✅ Fórmulas del Reporte reparadas', 'Reporte', 4);
}

/**
 * Mejora visual y completa los reportes:
 * - Repara fórmulas
 * - Mejora formato (colores, tamaños)
 * - Agrega validaciones
 * - Mejora legibilidad
 */
function mejorarYRepararReportes() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  const reporte = ss.getSheetByName('Reporte');

  if (!reporte) {
    ui.alert('❌ Error', 'No existe la hoja Reporte', ui.ButtonSet.OK);
    return;
  }

  // Primero, reparar todas las fórmulas
  repararFormulasReporte();

  // Mejorar formato visual
  const rangos = [
    { rango: 'A4:D4', bg: '#2196f3', color: 'white', bold: true }, // PERSONAS INTERESADAS
    { rango: 'A7:D7', bg: '#4caf50', color: 'white', bold: true }, // ENTREVISTAS
    { rango: 'A10:D10', bg: '#ff9800', color: 'white', bold: true }, // SELECCIONADAS
    { rango: 'A13:D13', bg: '#9c27b0', color: 'white', bold: true }, // PARTICIPANTES POR COHORTE
    { rango: 'A16:D16', bg: '#00bcd4', color: 'white', bold: true }, // GRADUADAS
    { rango: 'A19:D19', bg: '#f44336', color: 'white', bold: true }, // DESERCIONES
    { rango: 'A22:D22', bg: '#795548', color: 'white', bold: true }, // NO SELECCIONADAS
    { rango: 'A25:D25', bg: '#1a237e', color: 'white', bold: true }  // RESUMEN GENERAL
  ];

  rangos.forEach(r => {
    const rng = reporte.getRange(r.rango);
    rng.setBackground(r.bg);
    rng.setFontColor(r.color);
    if (r.bold) rng.setFontWeight('bold');
    rng.setHorizontalAlignment('center');
  });

  // Ajustar ancho de columnas
  reporte.setColumnWidth(1, 300);
  reporte.setColumnWidth(2, 120);
  reporte.setColumnWidth(3, 120);
  reporte.setColumnWidth(4, 120);

  // Formato para números (columnas B, C, D)
  reporte.getRange('B5:D28').setNumberFormat('0');

  // Números en porcentaje (D20, B27)
  reporte.getRange('D20').setNumberFormat('0.0"%"');
  reporte.getRange('B27').setNumberFormat('0.0"%"');

  // Centrar algunos valores
  reporte.getRange('B5:D28').setHorizontalAlignment('center');

  // Congelar filas
  reporte.setFrozenRows(3);

  ui.alert('✅ Reportes mejorados',
    'Se han reparado y mejorado todos los reportes:\n\n' +
    '✓ Fórmulas validadas y actualizadas\n' +
    '✓ Formato visual mejorado (colores, tamaños)\n' +
    '✓ Números formateados correctamente\n' +
    '✓ Fácil de leer y entender\n\n' +
    'Los datos se actualizan automáticamente.',
    ui.ButtonSet.OK);
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
 * Regenera la hoja PowerBI Export (para mantener datos actualizados)
 */
function regenerarPowerBIExport() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const hojaExistente = ss.getSheetByName('PowerBI Export');

    if (hojaExistente) {
      ss.deleteSheet(hojaExistente);
    }

    crearHojaPowerBIExport();
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

function crearHojaPowerBIExport() {
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
function guardarReporteMensualAutomatico() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const reporte = ss.getSheetByName('Reporte');
    const mensuales = ss.getSheetByName('Reportes Mensuales');

    if (!reporte || !mensuales) return;

    // Obtener datos del reporte actual
    const hoy = new Date();
    const mesActual = hoy.getMonth() + 1;
    const anioActual = hoy.getFullYear();
    const mesTexto = Utilities.formatDate(hoy, Session.getScriptTimeZone(), 'MMMM YYYY');

    // Verificar si ya existe un reporte para este mes
    const datosExistentes = mensuales.getDataRange().getValues();
    for (let i = 1; i < datosExistentes.length; i++) {
      const celda = datosExistentes[i][0] ? datosExistentes[i][0].toString() : '';
      if (celda.includes(Utilities.formatDate(hoy, Session.getScriptTimeZone(), 'MMMM')) &&
          celda.includes(anioActual.toString())) {
        return; // Ya existe reporte para este mes
      }
    }

    // Leer datos del Reporte
    const interesadas = reporte.getRange('B5').getValue();
    const entrevistas = reporte.getRange('B8').getValue();
    const inscritx = reporte.getRange('B11').getValue();
    const activasCohorte = reporte.getRange('B28').getValue();
    const graduadas = reporte.getRange('B17').getValue();
    const retiradas = reporte.getRange('B20').getValue();
    const noInscritas = reporte.getRange('B23').getValue();
    const tasaExito = reporte.getRange('B27').getValue();

    // Obtener cohortes activas para agregar columas
    const cohortesSheet = ss.getSheetByName('Cohortes');
    const cohortesDatos = cohortesSheet ? cohortesSheet.getDataRange().getValues() : [];
    const datosCohortes = {};

    for (let i = 1; i < cohortesDatos.length; i++) {
      if (cohortesDatos[i][0]) {
        const nombreCohorte = cohortesDatos[i][0].toString().trim();
        // Obtener conteo de inscritas por cohorte
        const hoja = ss.getSheetByName(nombreCohorte);
        if (hoja && hoja.getLastRow() > 1) {
          const rango = hoja.getRange(2, 5, hoja.getLastRow() - 1, 1).getValues();
          let contador = 0;
          for (let j = 0; j < rango.length; j++) {
            if (rango[j][0]) contador++;
          }
          datosCohortes[nombreCohorte] = contador;
        } else {
          datosCohortes[nombreCohorte] = 0;
        }
      }
    }

    // Armamos los datos del mes
    const nuevaFila = [
      mesTexto,
      interesadas,
      entrevistas,
      inscritx,
      activasCohorte,
      graduadas,
      retiradas,
      noInscritas,
      tasaExito
    ];

    // Agregar datos por cohorte (si existen)
    const headerCohortes = ['SAC I', 'SAC II', 'Computación I'];
    headerCohortes.forEach(cohorte => {
      nuevaFila.push(datosCohortes[cohorte] || 0);
    });

    // Fecha de guardado
    nuevaFila.push(new Date());

    // Agregar fila a Reportes Mensuales
    const ultimaFila = mensuales.getLastRow() + 1;
    mensuales.getRange(ultimaFila, 1, 1, nuevaFila.length).setValues([nuevaFila]);

    SpreadsheetApp.getActiveSpreadsheet().toast('✅ Reporte mensual guardado: ' + mesTexto, 'Reportes Mensuales', 5);

  } catch (e) {
    Logger.log('Error en guardarReporteMensualAutomatico: ' + e.message);
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
      reporte.getRange('B20').getValue(),
      reporte.getRange('B23').getValue(),
      reporte.getRange('B26').getValue(),
      reporte.getRange('B30').getValue(),
      reporte.getRange('B14').getValue(),
      reporte.getRange('B15').getValue(),
      reporte.getRange('B16').getValue(),
      new Date()
    ];

    // ✅ DEDUP: Verificar si el mes ya fue guardado
    const datosExistentes = mensuales.getDataRange().getValues();
    let filaExistente = -1;
    for (let i = 1; i < datosExistentes.length; i++) {
      if ((datosExistentes[i][0] || '').toString().trim() === mesActual) {
        filaExistente = i + 1;
        break;
      }
    }

    if (filaExistente > 0) {
      const ui = SpreadsheetApp.getUi();
      const resp = ui.alert('⚠️ Mes ya guardado',
        'El reporte de "' + mesActual + '" ya existe.\n¿Deseas actualizarlo con los datos actuales?',
        ui.ButtonSet.YES_NO);
      if (resp === ui.Button.YES) {
        mensuales.getRange(filaExistente, 1, 1, 13).setValues([datos]);
        ss.toast('✅ Reporte actualizado: ' + mesActual, 'OK', 4);
      }
      return;
    }

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
      if (['alEditarTech', 'actualizarReportesTech'].includes(trigger.getHandlerFunction())) {
        ScriptApp.deleteTrigger(trigger);
      }
    });

    ScriptApp.newTrigger('alEditarTech').forSpreadsheet(ss).onEdit().create();
    ScriptApp.newTrigger('actualizarReportesTech').timeBased().everyHours(1).create();

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

    // Si tenía la alerta, limpiarla antes de autocompletar
    const valorActualC = celdaCreamosID.getValue().toString();
    if (valorActualC === '⚠️ Crear en Salesforce') {
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
  if (!hojaDirectorio) return false;

  const datosDirectorio = hojaDirectorio.getDataRange().getValues();
  if (datosDirectorio.length < 2) return false;

  // *** NUEVO: Detectar columnas del directorio automáticamente ***
  const colMapDir = detectarColumnasDirectorio();
  if (!colMapDir) return false;

  // Construir mapas de búsqueda
  const mapPorCreamosId = new Map();
  const mapPorDpi = new Map();
  const mapPorNombre = new Map();

  for (let i = 1; i < datosDirectorio.length; i++) {
    const f = datosDirectorio[i];
    const nombre    = colMapDir.nombre >= 0 && f[colMapDir.nombre] ? f[colMapDir.nombre].toString().trim() : '';
    const creamosId = colMapDir.creamosId >= 0 && f[colMapDir.creamosId] ? f[colMapDir.creamosId].toString().trim() : '';
    const dpi       = colMapDir.dpi >= 0 && f[colMapDir.dpi] ? f[colMapDir.dpi].toString().trim() : '';
    if (creamosId) mapPorCreamosId.set(creamosId.toUpperCase(), f);
    if (dpi)       mapPorDpi.set(dpi, f);
    if (nombre)    mapPorNombre.set(nombre.toLowerCase(), f);
  }

  // Leer la fila actual
  const maxCol = Math.max(
    colMap.creamosId >= 0 ? colMap.creamosId + 1 : 0,
    colMap.dpi >= 0 ? colMap.dpi + 1 : 0,
    colMap.nombre >= 0 ? colMap.nombre + 1 : 0,
    colMap.edad >= 0 ? colMap.edad + 1 : 0,
    colMap.nivelEducativo >= 0 ? colMap.nivelEducativo + 1 : 0,
    colMap.zona >= 0 ? colMap.zona + 1 : 0
  );

  if (maxCol === 0) return false;

  const fila = sheet.getRange(numFila, 1, 1, maxCol).getValues()[0];

  const cId = colMap.creamosId >= 0 ? (fila[colMap.creamosId] || '').toString().trim() : '';
  const dpi = colMap.dpi >= 0 ? (fila[colMap.dpi] || '').toString().trim() : '';
  const nom = colMap.nombre >= 0 ? (fila[colMap.nombre] || '').toString().trim() : '';
  const ed  = colMap.edad >= 0 ? (fila[colMap.edad] || '').toString().trim() : '';
  const nvl = colMap.nivelEducativo >= 0 ? (fila[colMap.nivelEducativo] || '').toString().trim() : '';
  const zn  = colMap.zona >= 0 ? (fila[colMap.zona] || '').toString().trim() : '';

  // Buscar en directorio: CreamosID → DPI → Nombre
  let filaDir = null;
  if (cId) filaDir = mapPorCreamosId.get(cId.toUpperCase()) || null;
  if (!filaDir && dpi) filaDir = mapPorDpi.get(dpi) || null;
  if (!filaDir && nom) filaDir = mapPorNombre.get(nom.toLowerCase()) || null;

  if (!filaDir) return false;

  // *** NUEVO: Extraer datos del directorio usando detección automática ***
  const nombreDir  = colMapDir.nombre >= 0 && filaDir[colMapDir.nombre] ? filaDir[colMapDir.nombre].toString().trim() : '';
  const cIdDir     = colMapDir.creamosId >= 0 && filaDir[colMapDir.creamosId] ? filaDir[colMapDir.creamosId].toString().trim() : '';
  const edadDir    = colMapDir.edad >= 0 && filaDir[colMapDir.edad] ? filaDir[colMapDir.edad].toString().trim() : '';
  const dpiDir     = colMapDir.dpi >= 0 && filaDir[colMapDir.dpi] ? filaDir[colMapDir.dpi].toString().trim() : '';
  const nivelEducativoDir = colMapDir.nivelEducativo >= 0 && filaDir[colMapDir.nivelEducativo] ? filaDir[colMapDir.nivelEducativo].toString().trim() : '';
  const zonaDir    = colMapDir.zona >= 0 && filaDir[colMapDir.zona] ? filaDir[colMapDir.zona].toString().trim() : '';

  let actualizado = false;

  // Rellenar solo los campos vacíos
  if (colMap.nombre >= 0 && !nom && nombreDir) {
    sheet.getRange(numFila, colMap.nombre + 1).setValue(nombreDir);
    actualizado = true;
  }
  if (colMap.creamosId >= 0 && !cId && cIdDir) {
    sheet.getRange(numFila, colMap.creamosId + 1).setValue(cIdDir);
    actualizado = true;
  }
  if (colMap.dpi >= 0 && !dpi && dpiDir) {
    sheet.getRange(numFila, colMap.dpi + 1).setValue(dpiDir);
    actualizado = true;
  }
  if (colMap.edad >= 0 && !ed && edadDir) {
    sheet.getRange(numFila, colMap.edad + 1).setValue(edadDir);
    actualizado = true;
  }
  if (colMap.nivelEducativo >= 0 && !nvl && nivelEducativoDir) {
    sheet.getRange(numFila, colMap.nivelEducativo + 1).setValue(normalizarNivelEducativo(nivelEducativoDir));
    actualizado = true;
  }
  if (colMap.zona >= 0 && !zn && zonaDir) {
    sheet.getRange(numFila, colMap.zona + 1).setValue(zonaDir);
    actualizado = true;
  }

  return actualizado;
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

  const hojaDirectorio = ss.getSheetByName(NOMBRE_HOJA_CREAMOS_ID_TECH);
  if (!hojaDirectorio) {
    if (!silencioso) ui.alert('⚠️ Directorio no encontrado',
      'La hoja "' + NOMBRE_HOJA_CREAMOS_ID_TECH + '" no existe.',
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

  // *** NUEVO: Detectar columnas del directorio automáticamente ***
  const colMapDir = detectarColumnasDirectorio();
  if (!colMapDir) {
    if (!silencioso) ui.alert('⚠️ Error en estructura del Directorio',
      'No se pudieron detectar las columnas del Directorio CREAMOS ID.',
      ui.ButtonSet.OK);
    return;
  }

  // Construir mapas de búsqueda
  const mapPorCreamosId = new Map();
  const mapPorDpi = new Map();
  const mapPorNombre = new Map();

  for (let i = 1; i < datosDirectorio.length; i++) {
    const f = datosDirectorio[i];
    const nombre   = colMapDir.nombre >= 0 && f[colMapDir.nombre] ? f[colMapDir.nombre].toString().trim() : '';
    const creamosId = colMapDir.creamosId >= 0 && f[colMapDir.creamosId] ? f[colMapDir.creamosId].toString().trim() : '';
    const dpi       = colMapDir.dpi >= 0 && f[colMapDir.dpi] ? f[colMapDir.dpi].toString().trim() : '';
    if (creamosId) mapPorCreamosId.set(creamosId.toUpperCase(), f);
    if (dpi)       mapPorDpi.set(dpi, f);
    if (nombre)    mapPorNombre.set(nombre.toLowerCase(), f);
  }

  /**
   * Recorre una hoja y rellena celdas vacías desde el directorio.
   * colMap (números de columna 0-indexados):
   *   creamosId, dpi, nombre, edad, nivelEducativo, zona  → -1 si esa columna no existe en la hoja
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
      const nvl = colMap.nivelEducativo >= 0 ? (fila[colMap.nivelEducativo] || '').toString().trim() : '';
      const zn  = colMap.zona     >= 0 ? (fila[colMap.zona]     || '').toString().trim() : '';

      // Fila completamente vacía → saltar
      if (!cId && !dpi && !nom) continue;

      // ⚠️ CORRECCIÓN CRÍTICA: Evitar sobrescritura de datos existentes
      // Si la fila ya tiene CreamosID, SOLO buscar por CreamosID (no por nombre/DPI)
      // Esto evita que una persona con ID completo sea sobrescrita por otra persona con el mismo nombre
      let filaDir = null;

      if (cId) {
        // Si tiene CreamosID → buscar SOLO por CreamosID
        filaDir = mapPorCreamosId.get(cId.toUpperCase()) || null;
        // NO buscar por otros criterios si hay CreamosID
      } else {
        // Si NO tiene CreamosID → buscar por DPI o Nombre
        if (dpi) filaDir = mapPorDpi.get(dpi) || null;
        if (!filaDir && nom) filaDir = mapPorNombre.get(nom.toLowerCase()) || null;
      }

      if (!filaDir) continue;

      const nombreDir  = colMapDir.nombre >= 0 && filaDir[colMapDir.nombre] ? filaDir[colMapDir.nombre].toString().trim() : '';
      const cIdDir     = colMapDir.creamosId >= 0 && filaDir[colMapDir.creamosId] ? filaDir[colMapDir.creamosId].toString().trim() : '';
      const edadDir    = colMapDir.edad >= 0 && filaDir[colMapDir.edad] ? filaDir[colMapDir.edad].toString().trim() : '';
      const dpiDir     = colMapDir.dpi >= 0 && filaDir[colMapDir.dpi] ? filaDir[colMapDir.dpi].toString().trim() : '';
      const nivelEducativoDir = colMapDir.nivelEducativo >= 0 && filaDir[colMapDir.nivelEducativo] ? filaDir[colMapDir.nivelEducativo].toString().trim() : '';
      const zonaDir    = colMapDir.zona >= 0 && filaDir[colMapDir.zona] ? filaDir[colMapDir.zona].toString().trim() : '';

      const filaNum = i + 1;
      let actualizado = false;

      if (colMap.nombre   >= 0 && !nom && nombreDir) { sheet.getRange(filaNum, colMap.nombre   + 1).setValue(nombreDir);  actualizado = true; }
      if (colMap.creamosId >= 0 && !cId && cIdDir)  { sheet.getRange(filaNum, colMap.creamosId + 1).setValue(cIdDir);     actualizado = true; }
      if (colMap.dpi      >= 0 && !dpi && dpiDir)   { sheet.getRange(filaNum, colMap.dpi      + 1).setValue(dpiDir);      actualizado = true; }
      if (colMap.edad     >= 0 && !ed  && edadDir)  { sheet.getRange(filaNum, colMap.edad     + 1).setValue(edadDir);     actualizado = true; }
      if (colMap.nivelEducativo >= 0 && !nvl && nivelEducativoDir) { sheet.getRange(filaNum, colMap.nivelEducativo + 1).setValue(nivelEducativoDir); actualizado = true; }
      if (colMap.zona     >= 0 && !zn  && zonaDir)  { sheet.getRange(filaNum, colMap.zona     + 1).setValue(zonaDir);     actualizado = true; }

      if (actualizado) actualizados++;
    }
    return actualizados;
  }

  let total = 0;

  // Hoja de Interés: C[2]=CreamosID, D[3]=DPI, E[4]=Nombre, G[6]=Edad, I[8]=NivelEducativo, J[9]=Zona
  ss.toast('🔄 Actualizando Hoja de Interés...', 'Actualizando', 4);
  total += completarHoja(ss.getSheetByName('Hoja de Interés'),
    { creamosId: 2, dpi: 3, nombre: 4, edad: 6, nivelEducativo: 8, zona: 9 });

  // Entrevistas: C[2]=CreamosID, D[3]=DPI, E[4]=Nombre, G[6]=Edad, I[8]=NivelEducativo, J[9]=Zona
  ss.toast('🔄 Actualizando Entrevistas...', 'Actualizando', 4);
  total += completarHoja(ss.getSheetByName('Entrevistas'),
    { creamosId: 2, dpi: 3, nombre: 4, edad: 6, nivelEducativo: 8, zona: 9 });

  // Inscritx: B[1]=CreamosID, C[2]=DPI, D[3]=Nombre, F[5]=Edad, H[7]=NivelEducativo, I[8]=Zona
  ss.toast('🔄 Actualizando Inscritx...', 'Actualizando', 4);
  total += completarHoja(ss.getSheetByName('Inscritx'),
    { creamosId: 1, dpi: 2, nombre: 3, edad: 5, nivelEducativo: 7, zona: 8 });

  // No Inscritx: B[1]=CreamosID, C[2]=Nombre (sin DPI, Edad, Nivel Educativo, ni Zona)
  ss.toast('🔄 Actualizando No Inscritx...', 'Actualizando', 4);
  total += completarHoja(ss.getSheetByName('No Inscritx'),
    { creamosId: 1, dpi: -1, nombre: 2, edad: -1, nivelEducativo: -1, zona: -1 });

  // Hojas individuales de cada cohorte: C[2]=CreamosID, D[3]=DPI, E[4]=Nombre, G[6]=Edad, I[8]=NivelEducativo, J[9]=Zona
  const cohortesSheet = ss.getSheetByName('Cohortes');
  if (cohortesSheet) {
    const datosCohortes = cohortesSheet.getDataRange().getValues();
    for (let i = 1; i < datosCohortes.length; i++) {
      const nombreCohorte = datosCohortes[i][0] ? datosCohortes[i][0].toString().trim() : '';
      if (!nombreCohorte) continue;
      const hojaCohorte = ss.getSheetByName(nombreCohorte);
      if (!hojaCohorte) continue;
      ss.toast('🔄 Actualizando cohorte "' + nombreCohorte + '"...', 'Actualizando', 4);
      total += completarHoja(hojaCohorte, { creamosId: 2, dpi: 3, nombre: 4, edad: 6, nivelEducativo: 8, zona: 9 });
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
      // Inscritas: cuenta participantes en la hoja individual, restando los que están en Retiradx
      cohortes.getRange('H' + i).setFormula('=IF(A' + i + '="",0,IFERROR(COUNTIF(INDIRECT("\'"&A' + i + '&"\'!E:E"),"<>")-1-COUNTIF(INDIRECT("\'"&A' + i + '&"\'!K:K"),"Retiradx"),0))');
      // Graduadx: cuenta en la hoja Graduadx
      cohortes.getRange('I' + i).setFormula('=IFERROR(COUNTIF(Graduadx!H:H,A' + i + '),0)');
      // Retiradx: cuenta en la hoja Retiradx (aunque también están marcados en la hoja individual)
      cohortes.getRange('J' + i).setFormula('=IFERROR(COUNTIF(Retiradx!H:H,A' + i + '),0)');
    }
  }

  Logger.log('✅ Fórmulas de Cohortes reparadas');
  ss.toast('✅ Fórmulas de Cohortes reparadas correctamente', 'Reparación completada', 3);
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
 * - Pone link de Kobo en columna C de Entrevistas
 * - Agrega "Derivar a Paso a Paso" al desplegable Estado
 */
function activarMejorasEntrevistasTech() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const KOBO_LINK = 'https://ee.kobotoolbox.org/x/LHmyWvLj';

  ss.toast('🔧 Activando mejoras de Entrevistas...', 'Instalando', 3);

  // 1. Crear hoja "Paso a Paso" si no existe
  crearHojaPasoAPaso();

  // 2. Agregar link de Kobo en columna C de Entrevistas
  const entrevistas = ss.getSheetByName('Entrevistas');
  if (entrevistas) {
    const lastRow = Math.max(entrevistas.getLastRow(), 2);

    // Verificar si la columna C ya tiene el header correcto
    const headerC = entrevistas.getRange('C1').getValue();
    if (headerC !== '🔗 Abrir Kobo') {
      // Insertar columna C si aún tiene la estructura vieja (sin columna Kobo)
      entrevistas.insertColumnBefore(3);
      entrevistas.getRange('C1')
        .setValue('🔗 Abrir Kobo')
        .setBackground('#2196f3')
        .setFontColor('white')
        .setFontWeight('bold')
        .setHorizontalAlignment('center');
      entrevistas.setColumnWidth(3, 120);
    }

    // Poner fórmula HYPERLINK en C2:C500 — link clickeable en cada fila
    entrevistas.getRange('C2:C500').setFormula(
      '=HYPERLINK("' + KOBO_LINK + '","🔗 Abrir Kobo")'
    );
    entrevistas.getRange('C2:C500').setFontColor('#1565c0');

    // 3. Actualizar desplegable Estado (columna O = 15)
    const estadoOpciones = ['Aprobada', 'No aprobada', 'No asistió', 'Reprogramada', 'Derivar a Paso a Paso', '🔗 Abrir Kobo'];
    const validacionEstado = SpreadsheetApp.newDataValidation()
      .requireValueInList(estadoOpciones)
      .setAllowInvalid(false)
      .build();
    entrevistas.getRange('O2:O500').setDataValidation(validacionEstado);
    // Aplicar también en Paso a Paso
    const pasoAPaso = ss.getSheetByName('Paso a Paso');
    if (pasoAPaso) {
      pasoAPaso.getRange('O2:O500').setDataValidation(validacionEstado);
    }

    // Header Estado en verde
    entrevistas.getRange('O1')
      .setBackground('#4caf50')
      .setFontColor('white');
  }

  ss.toast('✅ Mejoras activadas correctamente', 'Listo', 4);
  SpreadsheetApp.getUi().alert(
    '✅ Mejoras de Entrevistas activadas',
    '✓ Hoja "Paso a Paso" creada\n' +
    '✓ Columna "🔗 Abrir Kobo" configurada\n' +
    '✓ Desplegable Estado actualizado con "Derivar a Paso a Paso"\n\n' +
    'Ahora cuando cambies Estado a "Derivar a Paso a Paso",\n' +
    'la fila se copiará automáticamente a la hoja "Paso a Paso".',
    SpreadsheetApp.getUi().ButtonSet.OK
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
  headers.forEach((header, index) => {
    if (header !== undefined && header !== null) {
      const original = header.toString().trim();
      const normalizado = original.toLowerCase();
      const superNormalizado = normalizado.replace(/[^a-z0-9]/g, '');
      
      // Guardar con nombre original
      mapa[original] = index;
      // Guardar con nombre normalizado (lowercase + trim)
      if (!mapa[normalizado]) mapa[normalizado] = index;
      // Guardar con nombre super normalizado (solo caracteres alfa)
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
        const maxDias = Math.max(...atrasados.map(e => parseFloat(e[15]) || 0));
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
 * "Entrevista agendada" pero que aún no se copiaron a "Entrevistas"
 *
 * Esta función es útil cuando hay muchos registros que se marcaron como
 * "Entrevista agendada" pero el proceso automático no los completó todos
 * (por ejemplo, cuando se editan muchas celdas a la vez).
 */
function procesarFilasPendientesAEntrevistas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  // Mostrar diálogo de confirmación
  const respuesta = ui.alert(
    '🔄 Procesar Filas Pendientes',
    'Esta función procesará todas las filas de "Hoja de Interés" que tienen estado ' +
    '"Entrevista agendada" pero que aún no están en "Entrevistas".\n\n' +
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

    if (estado && estado.toString().trim() === 'Entrevista agendada' &&
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
    ui.alert('✅ No se encontraron filas pendientes.\n\nTodas las filas con estado "Entrevista agendada" ya están en "Entrevistas".');
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
