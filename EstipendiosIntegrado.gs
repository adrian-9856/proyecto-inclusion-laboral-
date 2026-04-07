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
  KOBO_ESTIPENDIOS_URL: 'https://kf.kobotoolbox.org/api/v2/assets/aNpJWVRoxxQ5a8pwBQVJac/export-settings/esqLSo9A8oFvxVwZKUXwADx/data.csv',
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
    '# Recibo',
    'Responsable',
    'URL Firma',
    'Días Atraso',
    'Notas'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Formato headers
  sheet.getRange(1, 1, 1, headers.length)
    .setFontWeight('bold')
    .setBackground('#0f9d58')
    .setFontColor('#ffffff')
    .setHorizontalAlignment('center');

  // Fórmulas en fila 2
  sheet.getRange('K2').setFormula('=IF(J2<>"","Pagado",IF(I2<TODAY(),"🔴 Atrasado","Programado"))');
  sheet.getRange('P2').setFormula('=IF(AND(K2<>"Pagado",I2<TODAY()),TODAY()-I2,0)');

  // Anchos de columna
  sheet.setColumnWidth(1, 120);  // ID Pago
  sheet.setColumnWidth(4, 180);  // Nombre
  sheet.setColumnWidth(5, 150);  // Cohorte

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
    ['KPI', 'Valor', 'Fórmula'],
    ['Total Presupuestado', '', '=SUM(Cohortes!K:K)'],
    ['Total Gastado', '', '=SUM(Cohortes!L:L)'],
    ['Total Disponible', '', '=B5-B6'],
    ['% Ejecución Global', '', '=IF(B5>0,B6/B5,0)'],
    ['# Cohortes Activas', '', '=COUNTIF(Cohortes!F:F,"Activa")'],
    ['# Participantes Beneficiadas', '', '=COUNTA(UNIQUE(FILTER(Estipendios!C:C,Estipendios!C:C<>"")))'],
    ['Total Pagos Realizados', '', '=COUNTIF(Estipendios!K:K,"Pagado")'],
    ['Promedio por Participante', '', '=IF(B9>0,B6/B9,0)'],
    ['Pagos Pendientes', '', '=COUNTIF(Estipendios!K:K,"Programado")'],
    ['Pagos Atrasados', '', '=COUNTIF(Estipendios!K:K,"*Atrasado*")']
  ];

  sheet.getRange(4, 1, kpis.length, kpis[0].length).setValues(kpis);

  // Aplicar fórmulas
  for (let i = 1; i < kpis.length; i++) {
    sheet.getRange(4 + i, 2).setFormula(kpis[i][2]);
  }

  // Formato
  sheet.getRange('A4:C4').setFontWeight('bold').setBackground('#d9d9d9');
  sheet.getRange('B5:B14').setNumberFormat('"Q"#,##0.00');
  sheet.getRange('B8').setNumberFormat('0.00%');

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

  const headersCohorte = [['Cohorte', 'Presupuesto', 'Gastado', 'Disponible', '% Ejec', '# Pagos', 'Estado']];
  sheet.getRange(17, 1, 1, 7).setValues(headersCohorte);
  sheet.getRange('A17:G17').setFontWeight('bold').setBackground('#d9d9d9');

  sheet.getRange('A18').setValue('Ejecuta: Estipendios → Actualizar Dashboard');

  // === SECCIÓN 4: AUDITORÍA ===
  sheet.getRange('A25').setValue('📝 AUDITORÍA (Últimas 20 acciones)').setFontWeight('bold')
    .setBackground('#e8eaf6').setFontSize(12);

  const headersAuditoria = [['Fecha/Hora', 'Usuario', 'Acción', 'Detalles']];
  sheet.getRange(26, 1, 1, 4).setValues(headersAuditoria);
  sheet.getRange('A26:D26').setFontWeight('bold').setBackground('#d9d9d9');

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

    // Parsear CSV
    const data = Utilities.parseCsv(csv);
    if (data.length <= 1) {
      throw new Error('El CSV no contiene datos');
    }

    const headers = data[0];
    const filas = data.slice(1);

    Logger.log(`✅ ${filas.length} registros obtenidos desde Kobo`);

    // Normalizar nombre de columna para búsqueda flexible
    const findCol = (posibles) => {
      for (const p of posibles) {
        const idx = headers.findIndex(h => h.trim().toLowerCase().replace(/[^a-z0-9]/g,'') === p.toLowerCase().replace(/[^a-z0-9]/g,''));
        if (idx >= 0) return idx;
      }
      return -1;
    };

    // Obtener índices (busca variantes del nombre para mayor compatibilidad)
    const indices = {
      'Creamos_ID':       findCol(['Creamos_ID', 'CreamosID', 'Creamos ID']),
      'Nombre_s':         findCol(['Nombre_s', 'Nombre', 'Nombres']),
      'Apellido_s':       findCol(['Apellido_s', 'Apellido', 'Apellidos']),
      'Fecha':            findCol(['Fecha', 'Fecha_de_pago', 'FechaPago']),
      'Proyecto':         findCol(['Proyecto']),
      'Cohorte':          findCol(['Cohorte', 'Nombre_de_Cohorte', 'NombreCohorte']),  // ← NUEVO
      'Especialidad':     findCol(['Especialidad']),
      'Fase':             findCol(['Fase']),
      'Total_de_horas':   findCol(['Total_de_horas', 'TotalHoras', 'Horas']),          // ← NUEVO
      'Tasa_por_hora':    findCol(['Tasa_por_hora', 'TasaHora', 'Tasa']),              // ← NUEVO
      'Monto_total':      findCol(['Monto_total', 'MontoCal', 'Monto calculado', 'Monto_final', 'Monto final']),
      'Monto_descuento':  findCol(['Monto_descuento', 'MontoDescuento', 'Descuento']), // ← NUEVO
      'Motivo_descuento': findCol(['Motivo_de_descuento', 'MotivoDescuento', 'Motivo_descuento']),
      'Incentivo':        findCol(['Incentivo']),
      'Comentarios':      findCol(['Comentarios']),
      'Firma':            findCol(['Firma']),
      '_uuid':            findCol(['_uuid']),
      '_submission_time': findCol(['_submission_time'])
    };

    // Procesar datos
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetEstipendios = ss.getSheetByName('Estipendios');

    if (!sheetEstipendios) {
      throw new Error('La hoja "Estipendios" no existe. Ejecuta primero: Estipendios → Instalar Sistema');
    }

    let nuevosRegistros = 0;
    const dataExistente = sheetEstipendios.getDataRange().getValues();

    // UUID set para dedup
    const uuidsExistentes = new Set();
    dataExistente.slice(1).forEach(row => {
      const u = row[17] ? row[17].toString().trim() : '';
      if (u) uuidsExistentes.add(u);
    });

    filas.forEach((fila, index) => {
      try {
        const get = (key) => indices[key] >= 0 ? (fila[indices[key]] || '').toString().trim() : '';

        const uuid         = get('_uuid');
        const creamosID    = get('Creamos_ID');
        const nombre       = get('Nombre_s');
        const apellido     = get('Apellido_s');
        const fecha        = get('Fecha');
        const proyecto     = get('Proyecto');
        const especialidad = get('Especialidad');
        const fase         = get('Fase');
        const comentarios  = get('Comentarios');
        const firma        = get('Firma');
        const submissionTime = get('_submission_time');
        const motivo       = get('Motivo_descuento');
        const incentivo    = get('Incentivo');

        // Cohorte: usar campo Cohorte si existe, sino derivar de Especialidad
        const año = fecha ? new Date(fecha).getFullYear() : new Date().getFullYear();
        const cohorteKobo = get('Cohorte');
        const cohorte = cohorteKobo || determinarCohorteDesdeEspecialidad(especialidad, año);

        // Calcular monto: usar Monto_total si existe, sino horas × tasa
        let monto = parseFloat(get('Monto_total').replace(/,/g, '')) || 0;
        if (!monto) {
          const horas = parseFloat(get('Total_de_horas').replace(/,/g, '')) || 0;
          const tasa  = parseFloat(get('Tasa_por_hora').replace(/,/g, '')) || 0;
          monto = horas * tasa;
        }
        // Restar descuento si aplica
        const descuento = parseFloat(get('Monto_descuento').replace(/,/g, '')) || 0;
        const montoFinal = monto - descuento;

        if (!creamosID) return;

        // Dedup por UUID (preferido) o por CreamosID+Fecha
        if (uuid && uuidsExistentes.has(uuid)) return;
        if (!uuid) {
          const existe = dataExistente.some((row, i) =>
            i > 0 && row[2] === creamosID && row[8] && row[8].toString() === fecha
          );
          if (existe) return;
        }

        // Mapear Fase → Tipo
        let tipoEstipendio = '';
        if (fase === 'Teórica') tipoEstipendio = 'Curso';
        else if (fase === 'Práctica' || fase === 'Formación Dual') tipoEstipendio = 'Prácticas';

        // Generar ID
        const ultimaFila = sheetEstipendios.getLastRow();
        const idPago = `EST-${año}-${String(ultimaFila).padStart(4, '0')}`;
        const nombreCompleto = `${nombre} ${apellido}`.trim();

        // Agregar registro
        const nuevoRegistro = [
          idPago,
          submissionTime || new Date(),
          creamosID,
          nombreCompleto,
          cohorte,
          proyecto,
          tipoEstipendio,
          montoFinal,
          fecha,
          fecha,
          '',        // Estado (fórmula)
          'Efectivo',
          '',        // # Recibo
          '',        // Responsable
          firma,
          '',        // Días atraso (fórmula)
          comentarios,
          uuid       // UUID para dedup futuro
        ];

        sheetEstipendios.appendRow(nuevoRegistro);
        if (uuid) uuidsExistentes.add(uuid);
        nuevosRegistros++;

        // Registrar en auditoría
        registrarAuditoriaEstipendios('Importación Kobo', idPago, nombreCompleto);

      } catch (error) {
        Logger.log(`⚠️ Error procesando fila ${index}: ${error.message}`);
      }
    });

    Logger.log(`✅ ${nuevosRegistros} nuevos registros importados`);

    // Actualizar dashboard
    actualizarDashboardEstipendios();

    SpreadsheetApp.getActiveSpreadsheet().toast(
      `✅ ${nuevosRegistros} nuevos registros importados`,
      'Éxito',
      5
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
  // ⚠️ TODO: AQUÍ PUEDES CAMBIAR LOS NOMBRES DE LOS PROGRAMAS PARA ESTIPENDIOS
  // Estos nombres deben coincidir con los que usas al crear cohortes
  const mapeo = {
    'Gastronomía': `Cocina-${año}`,        // ← Cambiar aquí
    'Barismo': `Barismo-${año}`,            // ← Cambiar aquí
    'Programación': `SAC-${año}`,           // ← Cambiar aquí
    'SAC': `SAC-${año}`,                    // ← Cambiar aquí (alias)
    'Marketing': `Marketing-${año}`,        // ← Cambiar aquí
    'Carpinteria': `Carpintería-${año}`,    // ← Cambiar aquí
    'Fotovoltaico-Electricidad': `Electricidad-${año}`, // ← Cambiar aquí
    'Mecánica': `Mecánica-${año}`,          // ← Cambiar aquí
    'Alfa Digital': `AlfaDigital-${año}`,   // ← NUEVO - Cambiar aquí
    'Computación': `Computacion-${año}`,    // ← NUEVO - Cambiar aquí
    'Cocina': `Cocina-${año}`,              // ← NUEVO - Cambiar aquí
    'Repostería': `Reposteria-${año}`,      // ← NUEVO - Cambiar aquí
    'Panadería': `Panaderia-${año}`         // ← NUEVO - Cambiar aquí
  };
  return mapeo[especialidad] || `${especialidad}-${año}`;
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
    const estipendios = sheetEstipendios.getDataRange().getValues().slice(1);

    const proximosPagos = estipendios.filter(e => {
      const fechaProg = e[8] ? new Date(e[8]) : null;
      return fechaProg && fechaProg >= hoy && fechaProg <= en7Dias;
    });

    // Agrupar por fecha
    const agrupados = {};
    proximosPagos.forEach(e => {
      const fecha = Utilities.formatDate(new Date(e[8]), Session.getScriptTimeZone(), 'dd/MM/yyyy');
      if (!agrupados[fecha]) {
        agrupados[fecha] = { cohorte: e[4], cantidad: 0, monto: 0 };
      }
      agrupados[fecha].cantidad++;
      agrupados[fecha].monto += parseFloat(e[7]) || 0;
    });

    // Escribir en dashboard
    const datosCalendario = Object.keys(agrupados).map(fecha => [
      fecha,
      agrupados[fecha].cohorte,
      agrupados[fecha].cantidad,
      agrupados[fecha].monto
    ]);

    if (datosCalendario.length > 0) {
      sheetDashboard.getRange(5, 5, 10, 4).clear();
      sheetDashboard.getRange(5, 5, datosCalendario.length, 4).setValues(datosCalendario);
      sheetDashboard.getRange(5, 8, datosCalendario.length, 1).setNumberFormat('"Q"#,##0.00');
    }

    // Actualizar resumen por cohorte
    if (sheetCohortes) {
      const cohortes = sheetCohortes.getDataRange().getValues().slice(1);
      const resumenCohorte = [];

      cohortes.forEach(c => {
        const idCohorte = c[0];
        if (!idCohorte) return;

        const presupuesto = c[10] || 0;  // Columna K
        const gastado = c[11] || 0;      // Columna L
        const disponible = c[12] || 0;   // Columna M
        const pctEjec = c[13] || 0;      // Columna N
        const numPagos = estipendios.filter(e => e[4] === c[1]).length;
        const estado = pctEjec > 0.95 ? '🔴' : pctEjec > 0.80 ? '🟡' : '🟢';

        resumenCohorte.push([
          c[1],  // Nombre cohorte
          presupuesto,
          gastado,
          disponible,
          pctEjec,
          numPagos,
          estado
        ]);
      });

      if (resumenCohorte.length > 0) {
        sheetDashboard.getRange(18, 1, 10, 7).clear();
        sheetDashboard.getRange(18, 1, resumenCohorte.length, 7).setValues(resumenCohorte);
        sheetDashboard.getRange(18, 2, resumenCohorte.length, 4).setNumberFormat('"Q"#,##0.00');
        sheetDashboard.getRange(18, 5, resumenCohorte.length, 1).setNumberFormat('0.00%');
      }
    }

    SpreadsheetApp.getActiveSpreadsheet().toast('✅ Dashboard actualizado', 'Éxito', 3);

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
      'Cohorte', 'Programa', 'Tipo', 'Monto', 'Estado', 'Responsable',
      'Presupuesto Cohorte', 'Donador'
    ];

    const estipendios = ss.getSheetByName('Estipendios').getDataRange().getValues().slice(1);
    const cohortes = ss.getSheetByName('Cohortes').getDataRange().getValues().slice(1);

    const dictCohortes = {};
    cohortes.forEach(c => {
      dictCohortes[c[1]] = { presupuesto: c[10], donador: c[14] || '' };
    });

    const datosConsolidados = [headers];

    estipendios.forEach(e => {
      const fechaPago = e[9] ? new Date(e[9]) : new Date();
      const cohorte = e[4];
      const presupuesto = dictCohortes[cohorte] || {};

      datosConsolidados.push([
        e[0], fechaPago, fechaPago.getFullYear(),
        obtenerNombreMes(fechaPago.getMonth()),
        e[2], e[3], e[4], e[5], e[6], e[7], e[10], e[13],
        presupuesto.presupuesto || 0, presupuesto.donador || ''
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
      .timeBased().everyHours(1).create();

    ScriptApp.newTrigger('verificarPresupuestoEstipendios')
      .timeBased().everyHours(6).create();

    ScriptApp.newTrigger('exportarParaPowerBI')
      .timeBased().atHour(6).everyDays(1).create();

    SpreadsheetApp.getUi().alert(
      '✅ Triggers Activados',
      'Procesos automáticos activados:\n\n' +
      '• Importación desde Kobo: Cada hora\n' +
      '• Verificación presupuesto: Cada 6 horas\n' +
      '• Exportación Power BI: Diario a las 6:00 AM',
      SpreadsheetApp.getUi().ButtonSet.OK
    );

  } catch (error) {
    Logger.log('❌ Error: ' + error.message);
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
// GENERADOR DE XLSFORM PARA KOBO
// =====================================================================

function crearFormularioEstipendiosXLSForm() {
  const ui = SpreadsheetApp.getUi();
  const resp = ui.alert(
    '📋 Generar Formulario Kobo',
    'Se creará un Google Spreadsheet con el formulario IL_03_Estipendios ' +
    'en formato XLSForm.\n\nLuego:\n' +
    '1. Descárgalo como .xlsx (Archivo → Descargar → Excel)\n' +
    '2. Súbelo a KoboToolbox como nuevo formulario\n\n¿Continuar?',
    ui.ButtonSet.YES_NO
  );
  if (resp !== ui.Button.YES) return;

  try {
    const ss2 = SpreadsheetApp.create('IL_03_Estipendios — XLSForm');

    // HOJA survey
    const survey = ss2.getSheets()[0];
    survey.setName('survey');
    _xlsSurvey(survey);

    // HOJA choices
    _xlsChoices(ss2.insertSheet('choices'));

    // HOJA settings
    _xlsSettings(ss2.insertSheet('settings'));

    const url = ss2.getUrl();
    ui.alert(
      '✅ Formulario Creado',
      'Archivo: "IL_03_Estipendios — XLSForm"\n\n' +
      'Link:\n' + url + '\n\n' +
      'Pasos:\n' +
      '1. Abre el link anterior\n' +
      '2. Archivo → Descargar → Microsoft Excel (.xlsx)\n' +
      '3. KoboToolbox → Nuevo Proyecto → Subir XLSForm',
      ui.ButtonSet.OK
    );
  } catch (e) {
    ui.alert('❌ Error: ' + e.message);
  }
}

function _xlsSurvey(sheet) {
  const H = ['type','name','label::Spanish (es)','required','relevant','calculation','hint','appearance'];
  const rows = [
    H,
    ['text','Creamos_ID','Creamos ID','','','','',''],
    ['text','Nombre_s','Nombre(s)','yes','','','',''],
    ['text','Apellido_s','Apellido(s)','yes','','','',''],
    ['note','sep1','── Programa ──','','','','',''],
    ['select_one proyecto','Proyecto','Proyecto','yes','','','',''],
    ['text','Cohorte','Nombre de la Cohorte','yes','','','Ej: Barismo 1 (2026)  ·  SAC 2 (2026)',''],
    ['select_one especialidad','Especialidad','Especialidad','yes','','','',''],
    ['select_one fase','Fase','Fase','yes','','','',''],
    ['note','sep2','── Pago ──','','','','',''],
    ['date','Fecha','Fecha de pago','yes','','','',''],
    ['decimal','Total_de_horas','Total de horas trabajadas','','','','Ej: 40',''],
    ['decimal','Tasa_por_hora','Tasa por hora (Q)','','','','Ej: 12.50',''],
    ['calculate','Monto_calculado','Monto calculado','','',
      'if(${Total_de_horas} != "" and ${Tasa_por_hora} != "", ${Total_de_horas} * ${Tasa_por_hora}, 0)','',''],
    ['note','sep3','── Descuento ──','','','','',''],
    ['select_one si_no','Hay_descuento','¿Hay algún descuento?','yes','','','',''],
    ['select_one motivo_desc','Motivo_descuento','Motivo del descuento','',
      '${Hay_descuento} = "si"','','',''],
    ['decimal','Monto_descuento','Monto del descuento (Q)','',
      '${Hay_descuento} = "si"','','Ej: 50',''],
    ['calculate','Monto_final','Monto final','','',
      '${Monto_calculado} - if(${Hay_descuento} = "si", coalesce(${Monto_descuento},0), 0)','',''],
    ['note','nota_monto','💰 Monto final a pagar: Q ${Monto_final}','','','','',''],
    ['select_one si_no','Incentivo','¿Tiene incentivo adicional?','yes','','','',''],
    ['note','sep4','── Evidencia ──','','','','',''],
    ['text','Comentarios','Comentarios','','','','Observaciones',''],
    ['image','Firma','Firma del participante','yes','','','','signature'],
  ];
  sheet.getRange(1,1,rows.length,H.length).setValues(rows);
  sheet.getRange(1,1,1,H.length).setBackground('#4a86e8').setFontColor('#fff').setFontWeight('bold');
  rows.forEach((r,i) => {
    if (!i) return;
    if (r[0]==='note')      sheet.getRange(i+1,1,1,H.length).setBackground('#f3f3f3').setFontStyle('italic');
    if (r[0]==='calculate') sheet.getRange(i+1,1,1,H.length).setBackground('#e8f5e9');
  });
  [1,2,3,4,5,6,7,8].forEach((w,i) => sheet.setColumnWidth(i+1,[180,180,240,80,220,280,240,120][i]));
  sheet.setFrozenRows(1);
}

function _xlsChoices(sheet) {
  const H = ['list_name','name','label::Spanish (es)'];
  const rows = [H,
    ['proyecto','alimentos_bebidas','Alimentos y Bebidas'],
    ['proyecto','tecnologia','Tecnología'],
    ['proyecto','operario','Operario/a'],
    ['especialidad','gastronomia','Gastronomía'],
    ['especialidad','barismo','Barismo'],
    ['especialidad','reposteria','Repostería'],
    ['especialidad','panaderia','Panadería'],
    ['especialidad','programacion','Programación'],
    ['especialidad','sac','SAC'],
    ['especialidad','computacion','Computación'],
    ['especialidad','marketing','Marketing Digital'],
    ['especialidad','alfa_digital','Alfa Digital'],
    ['especialidad','carpinteria','Carpintería'],
    ['especialidad','fotovoltaico','Fotovoltaico-Electricidad'],
    ['especialidad','mecanica','Mecánica'],
    ['fase','teorica','Teórica'],
    ['fase','practica','Práctica'],
    ['fase','dual','Formación Dual'],
    ['si_no','si','Sí'],
    ['si_no','no','No'],
    ['motivo_desc','ausencia_notificada','Ausencia notificada'],
    ['motivo_desc','ausencia_no_notificada','Ausencia no notificada'],
    ['motivo_desc','impuntualidad','Impuntualidad'],
    ['motivo_desc','actitud','Actitud'],
  ];
  sheet.getRange(1,1,rows.length,3).setValues(rows);
  sheet.getRange(1,1,1,3).setBackground('#6aa84f').setFontColor('#fff').setFontWeight('bold');
  const col = {'proyecto':'#e6f4ea','especialidad':'#fff9c4','fase':'#e8f0fe','si_no':'#fce4ec','motivo_desc':'#fbe9e7'};
  rows.forEach((r,i) => { if(i && col[r[0]]) sheet.getRange(i+1,1,1,3).setBackground(col[r[0]]); });
  sheet.setFrozenRows(1);
}

function _xlsSettings(sheet) {
  const anio = new Date().getFullYear();
  sheet.getRange(1,1,2,5).setValues([
    ['form_title','form_id','version','default_language','style'],
    ['IL_03_Estipendios','IL_03_Estipendios', anio+'-v2','Spanish (es)','pages'],
  ]);
  sheet.getRange(1,1,1,5).setBackground('#e65100').setFontColor('#fff').setFontWeight('bold');
}

// =====================================================================
// GESTIÓN DE VISIBILIDAD DE HOJAS
// =====================================================================

/**
 * Hojas siempre visibles (trabajo diario)
 * Hojas secundarias se ocultan hasta que se necesiten
 */
const HOJAS_SIEMPRE_VISIBLES = [
  'Hoja de Interés',
  'Entrevistas',
  'Inscritx',
  'Cohortes',
  'Graduadx',
  'Retiradx',
  'Reporte',
];

const HOJAS_SECUNDARIAS = [
  'Detalle Entrevistas',   // solo al revisar importaciones
  'No Inscritx',           // solo al consultar rechazados
  'Lista Definitiva',      // solo al preparar listas
  'Reportes Mensuales',    // solo al revisar reportes históricos
  'Referencias de Programas', // configuración interna
  '🔍 Diagnóstico CSV',    // depuración temporal
  'Estipendios',           // módulo estipendios
  'Dashboard Estipendios', // módulo estipendios
  'Auditoría Estipendios', // módulo estipendios
  'Presupuesto Cohortes',  // módulo estipendios
  'Calendario Pagos',      // módulo estipendios
  'Datos Kobo',            // importación raw
  'EXPORT_PowerBI',        // exportación BI
];

/**
 * Oculta hojas secundarias (las que no se usan a diario)
 */
function ocultarHojasSecundarias() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();
  let ocultadas = 0;
  let noEncontradas = [];

  HOJAS_SECUNDARIAS.forEach(nombre => {
    const hoja = ss.getSheetByName(nombre);
    if (hoja) {
      hoja.hideSheet();
      ocultadas++;
    } else {
      noEncontradas.push(nombre);
    }
  });

  ss.toast(
    '✅ ' + ocultadas + ' hoja(s) ocultadas. Usa "Mostrar hojas secundarias" para verlas.',
    '👁️ Hojas', 5
  );
}

/**
 * Muestra todas las hojas secundarias
 */
function mostrarHojasSecundarias() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let mostradas = 0;

  HOJAS_SECUNDARIAS.forEach(nombre => {
    const hoja = ss.getSheetByName(nombre);
    if (hoja) {
      hoja.showSheet();
      mostradas++;
    }
  });

  ss.toast('✅ ' + mostradas + ' hoja(s) ahora visibles.', '👁️ Hojas', 4);
}

/**
 * Muestra SOLO una hoja específica por nombre (y la activa)
 */
function mostrarHojaEspecifica(nombre) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hoja = ss.getSheetByName(nombre);
  if (hoja) {
    hoja.showSheet();
    ss.setActiveSheet(hoja);
  } else {
    SpreadsheetApp.getUi().alert('⚠️ No se encontró la hoja: ' + nombre);
  }
}

// Atajos para las más usadas desde menú
function verDetalleEntrevistas()   { mostrarHojaEspecifica('Detalle Entrevistas'); }
function verNoInscritx()           { mostrarHojaEspecifica('No Inscritx'); }
function verListaDefinitiva()      { mostrarHojaEspecifica('Lista Definitiva'); }
function verReportesMensuales()    { mostrarHojaEspecifica('Reportes Mensuales'); }
function verEstipendios()          { mostrarHojaEspecifica('Estipendios'); }
function verDashboardEstipendios() { mostrarHojaEspecifica('Dashboard Estipendios'); }

// =====================================================================
// CREAR COHORTES DE EJEMPLO (2 por sector)
// =====================================================================

function crearCohortesDemo() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const isTech = typeof CONFIG_TECH !== 'undefined';

  const definiciones = isTech ? [
    { nombre: 'SAC',          proyecto: 'Tecnología',          cupo: 20, presupuestoCurso: 5000, presupuestoPracticas: 3000 },
    { nombre: 'Programación', proyecto: 'Tecnología',          cupo: 20, presupuestoCurso: 6000, presupuestoPracticas: 4000 },
  ] : [
    { nombre: 'Barismo',      proyecto: 'Alimentos y Bebidas', cupo: 20, presupuestoCurso: 4000, presupuestoPracticas: 2500 },
    { nombre: 'Gastronomía',  proyecto: 'Alimentos y Bebidas', cupo: 20, presupuestoCurso: 4500, presupuestoPracticas: 2800 },
  ];

  const resp = ui.alert(
    '🏗️ Crear Cohortes de Ejemplo',
    'Se crearán las siguientes cohortes:\n\n' +
    definiciones.map(d => '• ' + d.nombre + ' 1 (' + new Date().getFullYear() + ')').join('\n') +
    '\n\n¿Continuar?',
    ui.ButtonSet.YES_NO
  );
  if (resp !== ui.Button.YES) return;

  const cohortes = ss.getSheetByName('Cohortes');
  if (!cohortes) { ui.alert('❌ No se encontró la hoja "Cohortes"'); return; }

  const anio = new Date().getFullYear();
  const hoy  = new Date();
  const fin  = new Date(hoy.getFullYear(), hoy.getMonth() + 3, hoy.getDate());

  const nombresExistentes = cohortes.getDataRange().getValues()
    .slice(1).map(r => (r[0] || '').toString().trim());

  let creadas = 0;
  definiciones.forEach(def => {
    const patron = new RegExp('^' + def.nombre.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + ' (\\d+) \\(' + anio + '\\)$', 'i');
    const nums   = nombresExistentes.map(n => { const m = n.match(patron); return m ? parseInt(m[1]) : 0; }).filter(n => n > 0);
    const num    = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    const nombre = def.nombre + ' ' + num + ' (' + anio + ')';

    if (nombresExistentes.includes(nombre)) return;

    const vals = cohortes.getRange('A:A').getValues();
    let nuevaFila = 2;
    for (let i = 1; i < vals.length; i++) {
      if (!vals[i][0] || vals[i][0].toString().trim() === '') { nuevaFila = i + 1; break; }
      nuevaFila = i + 2;
    }

    cohortes.getRange(nuevaFila, 1, 1, 14).setValues(
      [[nombre, def.proyecto, anio, hoy, fin, 'Eva', def.cupo, '', '', '', '', '', '', 'Activa']]
    );
    cohortes.getRange('H'+nuevaFila).setFormula('=IF(A'+nuevaFila+'="",0,IFERROR(COUNTIF(INDIRECT("\'"&A'+nuevaFila+'&"\'!E:E"),"<>")-1-COUNTIF(INDIRECT("\'"&A'+nuevaFila+'&"\'!K:K"),"Retiradx"),0))');
    cohortes.getRange('I'+nuevaFila).setFormula('=IFERROR(COUNTIF(Graduadx!H:H,A'+nuevaFila+'),0)');
    cohortes.getRange('J'+nuevaFila).setFormula('=IFERROR(COUNTIF(Retiradx!H:H,A'+nuevaFila+'),0)');

    if (def.presupuestoCurso > 0) {
      try { _asegurarEncabezadosEstipendiosCohortes(cohortes); } catch(e) {}
      cohortes.getRange(nuevaFila,15).setValue(def.presupuestoCurso);
      cohortes.getRange(nuevaFila,16).setValue(def.presupuestoPracticas);
      cohortes.getRange(nuevaFila,17).setFormula('=O'+nuevaFila+'+P'+nuevaFila);
      cohortes.getRange(nuevaFila,18).setFormula('=IFERROR(SUMIF(Estipendios!E:E,A'+nuevaFila+',Estipendios!H:H),0)');
      cohortes.getRange(nuevaFila,19).setFormula('=Q'+nuevaFila+'-R'+nuevaFila);
      cohortes.getRange(nuevaFila,20).setFormula('=IFERROR(R'+nuevaFila+'/Q'+nuevaFila+',0)');
      cohortes.getRange(nuevaFila,20).setNumberFormat('0.0%');
    }

    try { crearHojaIndividualCohorte(nombre); } catch(e) {}
    nombresExistentes.push(nombre);
    creadas++;
  });

  try { configurarValidaciones(); } catch(e) {}
  ss.toast('✅ ' + creadas + ' cohorte(s) creadas', '🏗️ Cohortes', 5);
}

// =====================================================================
// FIN DEL MÓDULO DE ESTIPENDIOS
// =====================================================================
