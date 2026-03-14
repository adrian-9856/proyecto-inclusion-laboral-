/**
 * SISTEMA DE IMPORTACIÓN AUTOMÁTICA DE ESTIPENDIOS DESDE KOBO
 * Importa datos de pagos/estipendios desde KoboToolbox a Google Sheets
 * Se ejecuta automáticamente cada hora
 */

// ============================================================================
// CONFIGURACIÓN - IMPORTANTE: Completar con tus datos
// ============================================================================

const CONFIG = {
  // Token de API de Kobo (obtener desde: https://kf.kobotoolbox.org/token/)
  KOBO_TOKEN: '64cc018b88067397addd36b09288be8b6539cf39',

  // URL del CSV de Kobo
  KOBO_CSV_URL: 'https://kf.kobotoolbox.org/api/v2/assets/aNpJWVRoxxQ5a8pwBQVJac/export-settings/esqLSo9A8oFvxVwZKUXwADx/data.csv',

  // IDs de Google Sheets (si ya existen, sino se crean nuevos)
  SHEET_ALIMENTOS_ID: '', // Dejar vacío para crear nuevo
  SHEET_TECH_ID: '',      // Dejar vacío para crear nuevo

  // Nombres de las hojas
  NOMBRE_HOJA_DATOS: 'Datos Kobo',
  NOMBRE_HOJA_ESTIPENDIOS: 'Estipendios',
  NOMBRE_HOJA_PRESUPUESTO: 'Presupuesto Cohortes',
  NOMBRE_HOJA_DASHBOARD: 'Dashboard Resumen',
  NOMBRE_HOJA_CALENDARIO: 'Calendario Pagos',
  NOMBRE_HOJA_AUDITORIA: 'Auditoría',

  // Actualización automática (en horas)
  INTERVALO_ACTUALIZACION: 1 // cada 1 hora
};

// ============================================================================
// MAPEO DE CAMPOS KOBO → ESTRUCTURA DE ESTIPENDIOS
// ============================================================================

const MAPEO_CAMPOS = {
  'Creamos_ID': 'idParticipante',
  'Nombre_s': 'nombre',
  'Apellido_s': 'apellido',
  'Fecha': 'fechaPago',
  'Proyecto': 'programa',
  'Especialidad': 'especialidad',
  'Fase': 'tipoEstipendio',
  'Motivo_de_descuento': 'motivoDescuento',
  'Incentivo': 'tieneIncentivo',
  'Total_de_horas': 'totalHoras',
  'Monto_total': 'monto',
  'Comentarios': 'notas',
  'Firma': 'urlFirma',
  '_submission_time': 'fechaRegistro',
  '_submitted_by': 'responsableRegistro'
};

// ============================================================================
// FUNCIÓN PRINCIPAL: IMPORTAR DATOS DESDE KOBO
// ============================================================================

/**
 * Importa datos desde Kobo y actualiza ambas hojas (Alimentos y Tecnología)
 * Ejecutar manualmente o configurar como trigger automático
 */
function importarEstipendiosDesdeKobo() {
  try {
    Logger.log('🚀 Iniciando importación desde Kobo...');

    // 1. Obtener datos desde Kobo
    const datosKobo = obtenerDatosKobo();
    if (!datosKobo || datosKobo.length === 0) {
      Logger.log('⚠️ No se obtuvieron datos de Kobo');
      return;
    }

    Logger.log(`✅ ${datosKobo.length} registros obtenidos desde Kobo`);

    // 2. Separar por proyecto
    const datosAlimentos = datosKobo.filter(row => row.Proyecto === 'Alimentos y Bebidas');
    const datosTech = datosKobo.filter(row => row.Proyecto === 'Tecnología' || row.Proyecto === 'Operario/a');

    Logger.log(`📊 Alimentos y Bebidas: ${datosAlimentos.length} registros`);
    Logger.log(`📊 Tecnología: ${datosTech.length} registros`);

    // 3. Actualizar Google Sheets
    if (datosAlimentos.length > 0) {
      actualizarSheet('Alimentos y Bebidas', datosAlimentos);
    }

    if (datosTech.length > 0) {
      actualizarSheet('Tecnología', datosTech);
    }

    // 4. Registrar en auditoría
    registrarImportacion(datosKobo.length, datosAlimentos.length, datosTech.length);

    Logger.log('✅ Importación completada exitosamente');

  } catch (error) {
    Logger.log('❌ Error en importación: ' + error.message);
    enviarAlertaError(error);
    throw error;
  }
}

// ============================================================================
// FUNCIÓN: OBTENER DATOS DESDE KOBO API
// ============================================================================

/**
 * Conecta a la API de Kobo y descarga los datos en formato CSV
 * @return {Array} Array de objetos con los datos
 */
function obtenerDatosKobo() {
  try {
    const url = CONFIG.KOBO_CSV_URL;
    const token = CONFIG.KOBO_TOKEN;

    if (token === 'TU_TOKEN_AQUI') {
      throw new Error('⚠️ Debes configurar tu KOBO_TOKEN en la sección CONFIG');
    }

    // Headers con autenticación
    const options = {
      'method': 'get',
      'headers': {
        'Authorization': `Token ${token}`
      },
      'muteHttpExceptions': true
    };

    Logger.log('📡 Conectando a Kobo API...');
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();

    if (responseCode !== 200) {
      throw new Error(`Error HTTP ${responseCode}: ${response.getContentText()}`);
    }

    // Parsear CSV
    const csvText = response.getContentText();
    const datos = parsearCSV(csvText);

    return datos;

  } catch (error) {
    Logger.log('❌ Error obteniendo datos de Kobo: ' + error.message);
    throw error;
  }
}

// ============================================================================
// FUNCIÓN: PARSEAR CSV
// ============================================================================

/**
 * Convierte texto CSV en array de objetos
 * @param {string} csvText - Texto del CSV
 * @return {Array} Array de objetos
 */
function parsearCSV(csvText) {
  const lineas = csvText.split('\n');
  if (lineas.length === 0) return [];

  // Headers (primera línea)
  const headers = lineas[0].split(',').map(h => h.trim().replace(/"/g, ''));

  // Datos (resto de líneas)
  const datos = [];
  for (let i = 1; i < lineas.length; i++) {
    const linea = lineas[i];
    if (!linea.trim()) continue; // Saltar líneas vacías

    const valores = parsearLineaCSV(linea);
    if (valores.length === 0) continue;

    // Crear objeto
    const objeto = {};
    headers.forEach((header, index) => {
      objeto[header] = valores[index] || '';
    });

    datos.push(objeto);
  }

  return datos;
}

/**
 * Parsea una línea de CSV respetando comillas
 */
function parsearLineaCSV(linea) {
  const resultado = [];
  let valorActual = '';
  let dentroComillas = false;

  for (let i = 0; i < linea.length; i++) {
    const char = linea[i];

    if (char === '"') {
      dentroComillas = !dentroComillas;
    } else if (char === ',' && !dentroComillas) {
      resultado.push(valorActual.trim());
      valorActual = '';
    } else {
      valorActual += char;
    }
  }

  resultado.push(valorActual.trim());
  return resultado;
}

// ============================================================================
// FUNCIÓN: ACTUALIZAR GOOGLE SHEET
// ============================================================================

/**
 * Actualiza o crea Google Sheet con los datos
 * @param {string} programa - "Alimentos y Bebidas" o "Tecnología"
 * @param {Array} datos - Datos a escribir
 */
function actualizarSheet(programa, datos) {
  try {
    Logger.log(`📝 Actualizando sheet de ${programa}...`);

    // Obtener o crear spreadsheet
    let spreadsheet;
    const sheetId = programa === 'Alimentos y Bebidas' ? CONFIG.SHEET_ALIMENTOS_ID : CONFIG.SHEET_TECH_ID;

    if (sheetId) {
      spreadsheet = SpreadsheetApp.openById(sheetId);
    } else {
      // Crear nuevo
      const emoji = programa === 'Alimentos y Bebidas' ? '🍽️' : '🎓';
      spreadsheet = SpreadsheetApp.create(`${emoji} Estipendios - ${programa}`);
      Logger.log(`✅ Nuevo spreadsheet creado: ${spreadsheet.getUrl()}`);
    }

    // Crear/actualizar hojas
    crearEstructuraHojas(spreadsheet);

    // Escribir datos en hoja "Datos Kobo"
    escribirDatosKobo(spreadsheet, datos);

    // Transformar a formato Estipendios
    transformarAEstipendios(spreadsheet, datos);

    Logger.log(`✅ Sheet de ${programa} actualizado`);

  } catch (error) {
    Logger.log(`❌ Error actualizando sheet de ${programa}: ` + error.message);
    throw error;
  }
}

// ============================================================================
// FUNCIÓN: CREAR ESTRUCTURA DE HOJAS
// ============================================================================

/**
 * Crea todas las hojas necesarias según el plan
 */
function crearEstructuraHojas(spreadsheet) {
  const hojasNecesarias = [
    CONFIG.NOMBRE_HOJA_DATOS,
    CONFIG.NOMBRE_HOJA_ESTIPENDIOS,
    CONFIG.NOMBRE_HOJA_PRESUPUESTO,
    CONFIG.NOMBRE_HOJA_DASHBOARD,
    CONFIG.NOMBRE_HOJA_CALENDARIO,
    CONFIG.NOMBRE_HOJA_AUDITORIA
  ];

  hojasNecesarias.forEach(nombreHoja => {
    let hoja = spreadsheet.getSheetByName(nombreHoja);
    if (!hoja) {
      hoja = spreadsheet.insertSheet(nombreHoja);
      Logger.log(`✅ Hoja creada: ${nombreHoja}`);

      // Configurar headers según la hoja
      configurarHeaders(hoja, nombreHoja);
    }
  });

  // Eliminar hoja por defecto si existe
  const hojaDefault = spreadsheet.getSheetByName('Sheet1');
  if (hojaDefault && spreadsheet.getSheets().length > 1) {
    spreadsheet.deleteSheet(hojaDefault);
  }
}

/**
 * Configura los headers de cada hoja
 */
function configurarHeaders(hoja, nombreHoja) {
  let headers = [];

  switch(nombreHoja) {
    case CONFIG.NOMBRE_HOJA_DATOS:
      headers = Object.keys(MAPEO_CAMPOS);
      break;

    case CONFIG.NOMBRE_HOJA_ESTIPENDIOS:
      headers = [
        'ID Pago', 'Fecha Registro', 'ID Participante', 'Nombre Completo',
        'Cohorte', 'Programa', 'Tipo Estipendio', 'Monto (Q)',
        'Fecha Programada', 'Fecha Pago Real', 'Estado', 'Método Pago',
        'Banco/Cuenta', '# Recibo/Transacción', 'Responsable Aprobó',
        'Responsable Entregó', 'URL Foto Firma', 'URL Foto Recibo',
        'GPS Ubicación', 'Días Atraso', 'Notas'
      ];
      break;

    case CONFIG.NOMBRE_HOJA_PRESUPUESTO:
      headers = [
        'ID Cohorte', 'Nombre Cohorte', 'Año', 'Programa',
        'Fecha Inicio', 'Fecha Fin', '# Participantes Proyectado',
        '# Participantes Real', 'Presupuesto Curso (Q)', 'Presupuesto Prácticas (Q)',
        'Presupuesto Total (Q)', 'Gastado a la Fecha (Q)', 'Disponible (Q)',
        '% Ejecución', 'Donador/Financiador', 'Responsable', 'Estado', 'Notas'
      ];
      break;

    case CONFIG.NOMBRE_HOJA_AUDITORIA:
      headers = [
        'Fecha/Hora', 'Usuario', 'Acción', 'Hoja', 'Registro ID',
        'Campo', 'Valor Anterior', 'Valor Nuevo'
      ];
      break;
  }

  if (headers.length > 0) {
    hoja.getRange(1, 1, 1, headers.length).setValues([headers]);
    hoja.getRange(1, 1, 1, headers.length).setFontWeight('bold')
      .setBackground('#4285f4').setFontColor('#ffffff');
    hoja.setFrozenRows(1);
  }
}

// ============================================================================
// FUNCIÓN: ESCRIBIR DATOS KOBO
// ============================================================================

/**
 * Escribe datos raw de Kobo en la hoja correspondiente
 */
function escribirDatosKobo(spreadsheet, datos) {
  const hoja = spreadsheet.getSheetByName(CONFIG.NOMBRE_HOJA_DATOS);
  if (!hoja || datos.length === 0) return;

  // Limpiar datos existentes (excepto headers)
  const ultimaFila = hoja.getLastRow();
  if (ultimaFila > 1) {
    hoja.getRange(2, 1, ultimaFila - 1, hoja.getLastColumn()).clearContent();
  }

  // Preparar datos
  const headers = Object.keys(MAPEO_CAMPOS);
  const filas = datos.map(dato => headers.map(header => dato[header] || ''));

  // Escribir
  if (filas.length > 0) {
    hoja.getRange(2, 1, filas.length, headers.length).setValues(filas);
  }

  Logger.log(`✅ ${filas.length} filas escritas en "${CONFIG.NOMBRE_HOJA_DATOS}"`);
}

// ============================================================================
// FUNCIÓN: TRANSFORMAR A FORMATO ESTIPENDIOS
// ============================================================================

/**
 * Transforma datos de Kobo al formato estándar de Estipendios
 */
function transformarAEstipendios(spreadsheet, datos) {
  const hoja = spreadsheet.getSheetByName(CONFIG.NOMBRE_HOJA_ESTIPENDIOS);
  if (!hoja || datos.length === 0) return;

  // Limpiar datos existentes
  const ultimaFila = hoja.getLastRow();
  if (ultimaFila > 1) {
    hoja.getRange(2, 1, ultimaFila - 1, hoja.getLastColumn()).clearContent();
  }

  // Transformar cada registro
  const filas = datos.map((dato, index) => {
    const año = new Date(dato.Fecha).getFullYear() || new Date().getFullYear();
    const idPago = `EST-${año}-${String(index + 1).padStart(4, '0')}`;
    const nombreCompleto = `${dato.Nombre_s} ${dato.Apellido_s}`.trim();

    // Mapear Fase → Tipo Estipendio
    let tipoEstipendio = '';
    if (dato.Fase === 'Teórica') tipoEstipendio = 'Curso';
    else if (dato.Fase === 'Práctica' || dato.Fase === 'Formación Dual') tipoEstipendio = 'Prácticas';

    // Cohorte basada en Especialidad
    const cohorte = determinarCohorte(dato.Especialidad, dato.Proyecto);

    return [
      idPago,                           // A: ID Pago
      dato._submission_time || '',      // B: Fecha Registro
      dato.Creamos_ID || '',            // C: ID Participante
      nombreCompleto,                   // D: Nombre Completo
      cohorte,                          // E: Cohorte
      dato.Proyecto || '',              // F: Programa
      tipoEstipendio,                   // G: Tipo Estipendio
      parseFloat(dato.Monto_total) || 0,// H: Monto (Q)
      dato.Fecha || '',                 // I: Fecha Programada
      dato.Fecha || '',                 // J: Fecha Pago Real
      'Pagado',                         // K: Estado
      'Efectivo',                       // L: Método Pago (ajustar si tienes el campo)
      '',                               // M: Banco/Cuenta
      '',                               // N: # Recibo/Transacción
      '',                               // O: Responsable Aprobó
      dato._submitted_by || '',         // P: Responsable Entregó
      dato.Firma || '',                 // Q: URL Foto Firma
      '',                               // R: URL Foto Recibo
      '',                               // S: GPS Ubicación
      0,                                // T: Días Atraso
      dato.Comentarios || ''            // U: Notas
    ];
  });

  // Escribir
  if (filas.length > 0) {
    hoja.getRange(2, 1, filas.length, 21).setValues(filas);
  }

  Logger.log(`✅ ${filas.length} estipendios transformados`);
}

/**
 * Determina la cohorte basándose en especialidad y proyecto
 */
function determinarCohorte(especialidad, proyecto) {
  const año = new Date().getFullYear();

  // Mapeo especialidad → cohorte
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

// ============================================================================
// FUNCIÓN: REGISTRAR IMPORTACIÓN EN AUDITORÍA
// ============================================================================

function registrarImportacion(total, alimentos, tech) {
  try {
    // Registrar en ambos sheets si existen
    const sheets = [CONFIG.SHEET_ALIMENTOS_ID, CONFIG.SHEET_TECH_ID];

    sheets.forEach(sheetId => {
      if (!sheetId) return;

      const spreadsheet = SpreadsheetApp.openById(sheetId);
      const hoja = spreadsheet.getSheetByName(CONFIG.NOMBRE_HOJA_AUDITORIA);
      if (!hoja) return;

      const nuevaFila = [
        new Date(),
        Session.getActiveUser().getEmail(),
        'Importación automática desde Kobo',
        'Datos Kobo',
        '',
        '',
        '',
        `Total: ${total}, Alimentos: ${alimentos}, Tech: ${tech}`
      ];

      hoja.appendRow(nuevaFila);
    });

  } catch (error) {
    Logger.log('⚠️ Error registrando auditoría: ' + error.message);
  }
}

// ============================================================================
// FUNCIÓN: ENVIAR ALERTA DE ERROR
// ============================================================================

function enviarAlertaError(error) {
  const email = Session.getActiveUser().getEmail();
  const asunto = '⚠️ Error en importación de Estipendios desde Kobo';
  const mensaje = `
    Se produjo un error en la importación automática:

    Error: ${error.message}
    Fecha: ${new Date()}

    Por favor revisa los logs en Apps Script.
  `;

  try {
    MailApp.sendEmail(email, asunto, mensaje);
  } catch (e) {
    Logger.log('⚠️ No se pudo enviar email de alerta: ' + e.message);
  }
}

// ============================================================================
// FUNCIÓN: INSTALAR TRIGGER AUTOMÁTICO
// ============================================================================

/**
 * Configura trigger para ejecutar importación cada hora
 * EJECUTAR UNA VEZ MANUALMENTE
 */
function instalarTriggerAutomatico() {
  // Eliminar triggers existentes
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'importarEstipendiosDesdeKobo') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Crear nuevo trigger (cada hora)
  ScriptApp.newTrigger('importarEstipendiosDesdeKobo')
    .timeBased()
    .everyHours(CONFIG.INTERVALO_ACTUALIZACION)
    .create();

  Logger.log('✅ Trigger automático instalado - ejecuta cada ' + CONFIG.INTERVALO_ACTUALIZACION + ' hora(s)');

  // Enviar confirmación
  const email = Session.getActiveUser().getEmail();
  MailApp.sendEmail(
    email,
    '✅ Trigger de Estipendios instalado',
    `La importación automática desde Kobo se ejecutará cada ${CONFIG.INTERVALO_ACTUALIZACION} hora(s).`
  );
}

/**
 * Desinstalar trigger automático
 */
function desinstalarTriggerAutomatico() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'importarEstipendiosDesdeKobo') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  Logger.log('✅ Trigger automático desinstalado');
}

// ============================================================================
// MENÚ PERSONALIZADO
// ============================================================================

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('📊 Estipendios Kobo')
    .addItem('🔄 Importar Ahora', 'importarEstipendiosDesdeKobo')
    .addItem('⚙️ Instalar Actualización Automática', 'instalarTriggerAutomatico')
    .addItem('🛑 Desinstalar Actualización Automática', 'desinstalarTriggerAutomatico')
    .addSeparator()
    .addItem('📋 Ver Configuración', 'mostrarConfiguracion')
    .addToUi();
}

function mostrarConfiguracion() {
  const config = `
    CONFIGURACIÓN ACTUAL:

    Token configurado: ${CONFIG.KOBO_TOKEN !== 'TU_TOKEN_AQUI' ? 'Sí ✅' : 'No ❌'}
    URL Kobo: ${CONFIG.KOBO_CSV_URL}
    Intervalo: Cada ${CONFIG.INTERVALO_ACTUALIZACION} hora(s)

    Sheet Alimentos: ${CONFIG.SHEET_ALIMENTOS_ID || 'Se creará automáticamente'}
    Sheet Tecnología: ${CONFIG.SHEET_TECH_ID || 'Se creará automáticamente'}
  `;

  SpreadsheetApp.getUi().alert(config);
}
