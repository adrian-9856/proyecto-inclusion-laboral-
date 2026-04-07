/**
 * GeneradorXLSForm.gs
 * Genera el formulario IL_03_Estipendios en formato XLSForm
 * (Google Spreadsheet descargable como .xlsx para subir a KoboToolbox)
 *
 * Menú: Estipendios → 📋 Generar Formulario Kobo (XLSForm)
 */

// =====================================================================
// GENERADOR DE XLSFORM PARA KOBO
// =====================================================================

function crearFormularioEstipendiosXLSForm() {
  const ui = SpreadsheetApp.getUi();

  const resp = ui.alert(
    '📋 Generar Formulario Kobo',
    'Se creará un nuevo Google Spreadsheet con el formulario IL_03_Estipendios ' +
    'en formato XLSForm.\n\nLuego puedes:\n' +
    '1. Descargarlo como .xlsx (Archivo → Descargar → Excel)\n' +
    '2. Subir el .xlsx a KoboToolbox\n\n¿Continuar?',
    ui.ButtonSet.YES_NO
  );
  if (resp !== ui.Button.YES) return;

  try {
    const ss = SpreadsheetApp.create('IL_03_Estipendios — XLSForm');

    // ── HOJA: survey ──────────────────────────────────────────────────
    const survey = ss.getSheets()[0];
    survey.setName('survey');
    _escribirSurvey(survey);

    // ── HOJA: choices ─────────────────────────────────────────────────
    const choices = ss.insertSheet('choices');
    _escribirChoices(choices);

    // ── HOJA: settings ────────────────────────────────────────────────
    const settings = ss.insertSheet('settings');
    _escribirSettings(settings);

    // Abrir el nuevo archivo
    const url = ss.getUrl();
    SpreadsheetApp.getActiveSpreadsheet().toast(
      '✅ Formulario creado. Ábrelo, descárgalo como .xlsx y súbelo a Kobo.',
      '📋 XLSForm Listo', 10
    );

    // Mostrar link
    ui.alert(
      '✅ Formulario Creado',
      'Se creó el archivo:\n"IL_03_Estipendios — XLSForm"\n\n' +
      'Link:\n' + url + '\n\n' +
      'Pasos:\n' +
      '1. Abre el link\n' +
      '2. Archivo → Descargar → Microsoft Excel (.xlsx)\n' +
      '3. En KoboToolbox: Nuevo Proyecto → Subir XLSForm → sube el .xlsx',
      ui.ButtonSet.OK
    );

  } catch (e) {
    ui.alert('❌ Error: ' + e.message);
  }
}

// ─────────────────────────────────────────────────────────────────────
// HOJA survey
// ─────────────────────────────────────────────────────────────────────
function _escribirSurvey(sheet) {
  const COLS = [
    'type', 'name', 'label::Spanish (es)', 'required',
    'relevant', 'calculation', 'hint', 'appearance', 'constraint', 'constraint_message'
  ];

  const rows = [
    COLS,
    // ── Identificación ──────────────────────────────────────────────
    ['text', 'Creamos_ID', 'Creamos ID', '', '', '', 'Ej: 12345', '', '', ''],
    ['text', 'Nombre_s', 'Nombre(s)', 'yes', '', '', '', '', '', ''],
    ['text', 'Apellido_s', 'Apellido(s)', 'yes', '', '', '', '', '', ''],

    // ── Separador ───────────────────────────────────────────────────
    ['note', 'sep_programa', '── Información del programa ──', '', '', '', '', '', '', ''],

    // ── Programa ────────────────────────────────────────────────────
    ['select_one proyecto', 'Proyecto', 'Proyecto', 'yes', '', '', '', '', '', ''],
    ['text', 'Cohorte', 'Nombre de la Cohorte', 'yes', '', '',
      'Escribe el nombre exacto. Ej: Barismo 1 (2026) · SAC 2 (2026)', '', '', ''],
    ['select_one especialidad', 'Especialidad', 'Especialidad', 'yes', '', '', '', '', '', ''],
    ['select_one fase', 'Fase', 'Fase', 'yes', '', '', '', '', '', ''],

    // ── Separador ───────────────────────────────────────────────────
    ['note', 'sep_pago', '── Detalle del pago ──', '', '', '', '', '', '', ''],

    // ── Fecha y horas ────────────────────────────────────────────────
    ['date', 'Fecha', 'Fecha de pago', 'yes', '', '', 'aaaa-mm-dd', '', '', ''],
    ['decimal', 'Total_de_horas', 'Total de horas trabajadas', '', '', '', 'Ej: 40', '', '. >= 0', 'Debe ser 0 o más'],
    ['decimal', 'Tasa_por_hora', 'Tasa por hora (Q)', '', '', '', 'Ej: 12.50', '', '. >= 0', 'Debe ser 0 o más'],
    ['calculate', 'Monto_calculado', 'Monto calculado (Q)', '', '',
      'if(${Total_de_horas} != "" and ${Tasa_por_hora} != "", ${Total_de_horas} * ${Tasa_por_hora}, 0)',
      '', '', '', ''],

    // ── Descuento ────────────────────────────────────────────────────
    ['select_one si_no', 'Hay_descuento', '¿Hay algún descuento?', 'yes', '', '', '', '', '', ''],
    ['select_one motivo_descuento', 'Motivo_descuento', 'Motivo del descuento',
      '', '${Hay_descuento} = "si"', '', '', '', '', ''],
    ['decimal', 'Monto_descuento', 'Monto del descuento (Q)',
      '', '${Hay_descuento} = "si"', '', 'Ej: 50', '', '. >= 0', 'Debe ser 0 o más'],

    // ── Monto final ──────────────────────────────────────────────────
    ['calculate', 'Monto_final', 'Monto final a pagar (Q)', '', '',
      '${Monto_calculado} - if(${Hay_descuento} = "si", coalesce(${Monto_descuento}, 0), 0)',
      '', '', '', ''],
    ['note', 'nota_monto', 'Monto final: Q ${Monto_final}', '', '', '', '', '', '', ''],

    // ── Incentivo ────────────────────────────────────────────────────
    ['select_one si_no', 'Incentivo', '¿Tiene incentivo adicional?', 'yes', '', '', '', '', '', ''],

    // ── Evidencia ────────────────────────────────────────────────────
    ['note', 'sep_evidencia', '── Evidencia ──', '', '', '', '', '', '', ''],
    ['text', 'Comentarios', 'Comentarios', '', '', '', 'Observaciones adicionales', '', '', ''],
    ['image', 'Firma', 'Firma del participante', 'yes', '', '', '', 'signature', '', ''],
  ];

  sheet.getRange(1, 1, rows.length, COLS.length).setValues(rows);

  // Estilo header
  const header = sheet.getRange(1, 1, 1, COLS.length);
  header.setBackground('#4a86e8').setFontColor('#ffffff').setFontWeight('bold');

  // Resaltar filas de note/calculate
  rows.forEach((row, i) => {
    if (i === 0) return;
    if (row[0].startsWith('note')) {
      sheet.getRange(i + 1, 1, 1, COLS.length).setBackground('#f3f3f3').setFontStyle('italic');
    } else if (row[0] === 'calculate') {
      sheet.getRange(i + 1, 1, 1, COLS.length).setBackground('#e8f5e9');
    }
  });

  sheet.setColumnWidth(1, 200);
  sheet.setColumnWidth(2, 180);
  sheet.setColumnWidth(3, 260);
  sheet.setColumnWidth(5, 260);
  sheet.setColumnWidth(6, 300);
  sheet.setColumnWidth(7, 260);
  sheet.setFrozenRows(1);
}

// ─────────────────────────────────────────────────────────────────────
// HOJA choices
// ─────────────────────────────────────────────────────────────────────
function _escribirChoices(sheet) {
  const COLS = ['list_name', 'name', 'label::Spanish (es)'];

  const rows = [
    COLS,

    // proyecto
    ['proyecto', 'alimentos_bebidas', 'Alimentos y Bebidas'],
    ['proyecto', 'tecnologia',        'Tecnología'],
    ['proyecto', 'operario',          'Operario/a'],

    // especialidad
    ['especialidad', 'gastronomia',   'Gastronomía'],
    ['especialidad', 'barismo',       'Barismo'],
    ['especialidad', 'reposteria',    'Repostería'],
    ['especialidad', 'panaderia',     'Panadería'],
    ['especialidad', 'programacion',  'Programación'],
    ['especialidad', 'sac',           'SAC'],
    ['especialidad', 'computacion',   'Computación'],
    ['especialidad', 'marketing',     'Marketing Digital'],
    ['especialidad', 'alfa_digital',  'Alfa Digital'],
    ['especialidad', 'carpinteria',   'Carpintería'],
    ['especialidad', 'fotovoltaico',  'Fotovoltaico-Electricidad'],
    ['especialidad', 'mecanica',      'Mecánica'],

    // fase
    ['fase', 'teorica',    'Teórica'],
    ['fase', 'practica',   'Práctica'],
    ['fase', 'dual',       'Formación Dual'],

    // si_no
    ['si_no', 'si', 'Sí'],
    ['si_no', 'no', 'No'],

    // motivo_descuento
    ['motivo_descuento', 'ausencia_notificada',     'Ausencia notificada'],
    ['motivo_descuento', 'ausencia_no_notificada',  'Ausencia no notificada'],
    ['motivo_descuento', 'impuntualidad',            'Impuntualidad'],
    ['motivo_descuento', 'actitud',                  'Actitud'],
  ];

  sheet.getRange(1, 1, rows.length, COLS.length).setValues(rows);

  // Estilo header
  sheet.getRange(1, 1, 1, COLS.length)
    .setBackground('#6aa84f').setFontColor('#ffffff').setFontWeight('bold');

  // Colorear por grupo
  const colores = {
    'proyecto':          '#e6f4ea',
    'especialidad':      '#fff9c4',
    'fase':              '#e8f0fe',
    'si_no':             '#fce4ec',
    'motivo_descuento':  '#fbe9e7',
  };
  rows.forEach((row, i) => {
    if (i === 0) return;
    const color = colores[row[0]];
    if (color) sheet.getRange(i + 1, 1, 1, COLS.length).setBackground(color);
  });

  sheet.setColumnWidth(1, 200);
  sheet.setColumnWidth(2, 240);
  sheet.setColumnWidth(3, 260);
  sheet.setFrozenRows(1);
}

// ─────────────────────────────────────────────────────────────────────
// HOJA settings
// ─────────────────────────────────────────────────────────────────────
function _escribirSettings(sheet) {
  const anio = new Date().getFullYear();
  const rows = [
    ['form_title', 'form_id', 'version', 'default_language', 'style'],
    ['IL_03_Estipendios', 'IL_03_Estipendios', anio + '-v2', 'Spanish (es)', 'pages'],
  ];
  sheet.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
  sheet.getRange(1, 1, 1, rows[0].length)
    .setBackground('#e65100').setFontColor('#ffffff').setFontWeight('bold');
  sheet.setColumnWidth(1, 200);
  sheet.setColumnWidth(2, 200);
  sheet.setFrozenRows(1);
}


// =====================================================================
// CREAR COHORTES DE EJEMPLO (2 por sector)
// =====================================================================

/**
 * Crea 2 cohortes de demo para Tech/SAC y 2 para AB
 * sin borrar nada existente
 */
function crearCohortesDemo() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const isTech = typeof CONFIG_TECH !== 'undefined';
  const isAB   = typeof CONFIG_AB   !== 'undefined';

  const resp = ui.alert(
    '🏗️ Crear Cohortes de Ejemplo',
    'Se crearán cohortes de ejemplo (con fecha de inicio hoy).\n\n' +
    (isTech ? '📱 Tech/SAC:\n  • SAC 1 (2026)\n  • Programación 1 (2026)\n\n' : '') +
    (isAB   ? '🍽️ Alimentos y Bebidas:\n  • Barismo 1 (2026)\n  • Gastronomía 1 (2026)\n\n' : '') +
    '¿Continuar?',
    ui.ButtonSet.YES_NO
  );
  if (resp !== ui.Button.YES) return;

  const cohortes = ss.getSheetByName('Cohortes');
  if (!cohortes) {
    ui.alert('❌ No se encontró la hoja "Cohortes"');
    return;
  }

  const anio = new Date().getFullYear();
  const hoy  = new Date();
  const fin  = new Date(hoy.getFullYear(), hoy.getMonth() + 3, hoy.getDate()); // 3 meses después

  const definiciones = isTech ? [
    { nombre: 'SAC',           proyecto: 'Tecnología',          cupo: 20, presupuestoCurso: 5000, presupuestoPracticas: 3000 },
    { nombre: 'Programación',  proyecto: 'Tecnología',          cupo: 20, presupuestoCurso: 6000, presupuestoPracticas: 4000 },
  ] : [
    { nombre: 'Barismo',       proyecto: 'Alimentos y Bebidas', cupo: 20, presupuestoCurso: 4000, presupuestoPracticas: 2500 },
    { nombre: 'Gastronomía',   proyecto: 'Alimentos y Bebidas', cupo: 20, presupuestoCurso: 4500, presupuestoPracticas: 2800 },
  ];

  // Leer cohortes existentes para obtener número correcto
  const nombresExistentes = cohortes.getDataRange().getValues()
    .slice(1).map(r => (r[0] || '').toString().trim());

  let creadas = 0;
  definiciones.forEach(def => {
    // Calcular número de cohorte
    const patron = new RegExp('^' + def.nombre + ' (\\d+) \\(' + anio + '\\)$', 'i');
    const nums   = nombresExistentes
      .map(n => { const m = n.match(patron); return m ? parseInt(m[1]) : 0; })
      .filter(n => n > 0);
    const num    = nums.length > 0 ? Math.max(...nums) + 1 : 1;
    const nombre = def.nombre + ' ' + num + ' (' + anio + ')';

    // Verificar que no exista ya
    if (nombresExistentes.includes(nombre)) {
      Logger.log('Ya existe: ' + nombre);
      return;
    }

    const nuevaFila = _primeraFilaVaciaCohortes(cohortes);

    // Datos base (14 columnas A-N)
    const datos = [nombre, def.proyecto, anio, hoy, fin, 'Eva', def.cupo, '', '', '', '', '', '', 'Activa'];
    cohortes.getRange(nuevaFila, 1, 1, 14).setValues([datos]);

    // Fórmulas de conteo
    cohortes.getRange('H' + nuevaFila).setFormula(
      '=IF(A' + nuevaFila + '="",0,IFERROR(COUNTIF(INDIRECT("\'"&A' + nuevaFila + '&"\'!E:E"),"<>")-1-COUNTIF(INDIRECT("\'"&A' + nuevaFila + '&"\'!K:K"),"Retiradx"),0))'
    );
    cohortes.getRange('I' + nuevaFila).setFormula('=IFERROR(COUNTIF(Graduadx!H:H,A' + nuevaFila + '),0)');
    cohortes.getRange('J' + nuevaFila).setFormula('=IFERROR(COUNTIF(Retiradx!H:H,A' + nuevaFila + '),0)');

    // Presupuesto estipendios (cols O-T)
    if (def.presupuestoCurso > 0 || def.presupuestoPracticas > 0) {
      _asegurarEncabezadosEstipendiosCohortes(cohortes);
      cohortes.getRange(nuevaFila, 15).setValue(def.presupuestoCurso);
      cohortes.getRange(nuevaFila, 16).setValue(def.presupuestoPracticas);
      cohortes.getRange(nuevaFila, 17).setFormula('=O' + nuevaFila + '+P' + nuevaFila);
      cohortes.getRange(nuevaFila, 18).setFormula('=IFERROR(SUMIF(Estipendios!E:E,A' + nuevaFila + ',Estipendios!H:H),0)');
      cohortes.getRange(nuevaFila, 19).setFormula('=Q' + nuevaFila + '-R' + nuevaFila);
      cohortes.getRange(nuevaFila, 20).setFormula('=IFERROR(R' + nuevaFila + '/Q' + nuevaFila + ',0)');
      cohortes.getRange(nuevaFila, 20).setNumberFormat('0.0%');
    }

    // Crear hoja individual
    try { crearHojaIndividualCohorte(nombre); } catch(e) { Logger.log('Hoja individual: ' + e.message); }

    nombresExistentes.push(nombre); // para que el siguiente cálculo lo tome en cuenta
    creadas++;
    Logger.log('✅ Creada: ' + nombre);
  });

  try { configurarValidaciones(); } catch(e) {}

  SpreadsheetApp.getActiveSpreadsheet().toast(
    '✅ ' + creadas + ' cohorte(s) creadas correctamente',
    '🏗️ Cohortes Demo', 5
  );
}

/**
 * Encuentra la primera fila vacía en col A de la hoja Cohortes
 */
function _primeraFilaVaciaCohortes(sheet) {
  const vals = sheet.getRange('A:A').getValues();
  for (let i = 1; i < vals.length; i++) {
    if (!vals[i][0] || vals[i][0].toString().trim() === '') return i + 1;
  }
  return vals.length + 1;
}
