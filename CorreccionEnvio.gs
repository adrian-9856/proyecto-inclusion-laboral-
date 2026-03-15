/**
 * =====================================================================
 * CORRECCIÓN: NO SOBRESCRIBIR AL ENVIAR ENTRE HOJAS
 * =====================================================================
 *
 * PROBLEMA:
 * Cuando se envía una persona entre hojas (Hoja de Interés → Entrevistas → Inscritx → Cohorte),
 * si esa persona solo tiene CreamosID (sin nombre ni datos), se están enviando campos VACÍOS
 * que sobrescriben datos existentes.
 *
 * SOLUCIÓN:
 * - Si solo tiene CreamosID (sin otros datos) → Enviar SOLO el ID
 * - Si tiene información completa → Enviar TODO
 *
 * =====================================================================
 */


/**
 * Verifica si una fila de datos solo tiene CreamosID (sin nombre ni otros datos)
 * @param {Array} datos - Fila de datos de la hoja
 * @param {number} colCreamosId - Índice de la columna CreamosID
 * @param {Array} colsOtrasDatos - Índices de otras columnas importantes (nombre, DPI, edad, etc.)
 * @returns {boolean} - true si solo tiene CreamosID, false si tiene otros datos
 */
function soloTieneCreamosID(datos, colCreamosId, colsOtrasDatos) {
  // Verificar que tenga CreamosID
  const tieneCreamosId = datos[colCreamosId] && datos[colCreamosId].toString().trim() !== '';

  if (!tieneCreamosId) return false;

  // Verificar que NO tenga otros datos
  for (let col of colsOtrasDatos) {
    if (datos[col] && datos[col].toString().trim() !== '') {
      return false; // Tiene otros datos
    }
  }

  return true; // Solo tiene CreamosID
}


/**
 * Crea un registro para enviar, evitando sobrescribir si solo tiene ID
 * @param {Object} opciones - Objeto con las opciones
 *   - datosOrigen: datos de la fila de origen
 *   - datosInteres: datos de la Hoja de Interés (opcional)
 *   - creamosId: CreamosID de la persona
 *   - nombre: Nombre de la persona
 *   - telefono: Teléfono
 *   - notas: Notas adicionales
 *   - estado: Estado para la hoja destino
 * @returns {Array} - Array con el registro a insertar
 */
function crearRegistroParaEnvio(opciones) {
  const {
    datosOrigen,
    datosInteres,
    creamosId,
    nombre,
    telefono,
    notas,
    estado,
    nuevaFila
  } = opciones;

  // Verificar si datosInteres solo tiene CreamosID
  let soloID = false;
  if (datosInteres && datosInteres.datos) {
    // Columnas de Hoja de Interés: [0]=Fecha, [1]=No, [2]=CreamosID, [3]=DPI, [4]=Nombre, [5]=Género, [6]=Edad, [7]=Tel, [8]=NivelEdu, [9]=Zona
    const colsImportantes = [3, 4, 5, 6, 8, 9]; // DPI, Nombre, Género, Edad, NivelEdu, Zona
    soloID = soloTieneCreamosID(datosInteres.datos, 2, colsImportantes);
  }

  // Si solo tiene ID → crear registro con solo CreamosID y datos mínimos
  if (soloID) {
    return [
      nuevaFila - 1,     // No
      creamosId,         // CreamosID
      '',                // DPI - VACÍO (no sobrescribir)
      nombre || '',      // Nombre (tomar del origen si existe)
      '',                // Género - VACÍO (no sobrescribir)
      '',                // Edad - VACÍO (no sobrescribir)
      telefono || '',    // Teléfono (tomar del origen si existe)
      '',                // Nivel Educativo - VACÍO (no sobrescribir)
      '',                // Zona - VACÍO (no sobrescribir)
      notas || '',       // Notas
      estado || '',      // Estado
      ''                 // Enviar a Cohorte (vacío)
    ];
  }

  // Si tiene información completa → crear registro completo
  return [
    nuevaFila - 1,                                          // No
    creamosId,                                              // CreamosID
    datosInteres ? (datosInteres.datos[3] || '') : '',      // DPI
    nombre || '',                                            // Nombre
    datosInteres ? (datosInteres.datos[5] || '') : '',      // Género
    datosInteres ? (datosInteres.datos[6] || '') : '',      // Edad
    telefono || '',                                          // Teléfono
    datosInteres ? (datosInteres.datos[8] || '') : '',      // Nivel Educativo
    datosInteres ? (datosInteres.datos[9] || '') : '',      // Zona
    notas || '',                                             // Notas
    estado || '',                                            // Estado
    ''                                                       // Enviar a Cohorte (vacío)
  ];
}


/**
 * CORRECCIÓN DE LA FUNCIÓN: enviarParticipantesACohorteTech
 * Esta es la versión corregida que NO sobrescribe datos si solo tiene ID
 */
function enviarParticipantesACohorteTech_Corregido() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const cohortesSheet = ss.getSheetByName('Cohortes');
  const datosCohortes = cohortesSheet.getDataRange().getValues();

  const cohortesActivas = [];
  for (let i = 1; i < datosCohortes.length; i++) {
    if (datosCohortes[i][13] === 'Activa') {
      cohortesActivas.push({
        nombre: datosCohortes[i][0],
        cupo: datosCohortes[i][6],
        inscritas: datosCohortes[i][7]
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

    // ========================================================================
    // ⚠️ CORRECCIÓN: Usar la función que evita sobrescribir si solo tiene ID
    // ========================================================================
    const registro = crearRegistroParaEnvio({
      datosOrigen: p.datos,
      datosInteres: datosInteres,
      creamosId: p.creamosId,
      nombre: p.nombre,
      telefono: p.datos[4],
      notas: p.datos[8] || '',
      estado: 'Inscritx',
      nuevaFila: nuevaFila
    });

    seleccionadas.getRange(nuevaFila, 1, 1, 12).setValues([registro]);
    entrevistas.getRange(p.fila, 1, 1, 11).setBackground('#c8e6c9');
    entrevistas.getRange(p.fila, 11).setValue('Enviado ✓');
    enviados++;
  });

  ss.toast('✅ ' + enviados + ' participantes enviados a ' + cohorteDestino, 'Completado', 5);
}


/**
 * Aplica el mismo formato a datos que se copian a hojas de cohorte individual
 * @param {Array} datosInteres - Datos de la Hoja de Interés
 * @param {Object} persona - Objeto con datos de la persona
 * @returns {Array} - Registro formateado
 */
function crearRegistroParaCohorte(datosInteres, persona) {
  // Verificar si solo tiene CreamosID
  let soloID = false;
  if (datosInteres && datosInteres.datos) {
    const colsImportantes = [3, 4, 5, 6, 8, 9]; // DPI, Nombre, Género, Edad, NivelEdu, Zona
    soloID = soloTieneCreamosID(datosInteres.datos, 2, colsImportantes);
  }

  if (soloID) {
    // Solo enviar datos mínimos
    return [
      persona.numero || '',
      persona.creamosId,
      '',  // DPI vacío
      persona.nombre || '',
      '',  // Género vacío
      '',  // Edad vacía
      persona.telefono || '',
      '',  // Nivel educativo vacío
      '',  // Zona vacía
      '',  // Estado vacío
      '',  // Notas vacías
      persona.fechaInicio || ''
    ];
  }

  // Enviar datos completos
  return [
    persona.numero || '',
    persona.creamosId,
    datosInteres ? (datosInteres.datos[3] || '') : '',  // DPI
    persona.nombre || '',
    datosInteres ? (datosInteres.datos[5] || '') : '',  // Género
    datosInteres ? (datosInteres.datos[6] || '') : '',  // Edad
    persona.telefono || '',
    datosInteres ? (datosInteres.datos[8] || '') : '',  // Nivel educativo
    datosInteres ? (datosInteres.datos[9] || '') : '',  // Zona
    '',  // Estado
    '',  // Notas
    persona.fechaInicio || ''
  ];
}


/**
 * Función de prueba para verificar que funciona correctamente
 */
function probarDeteccionSoloID() {
  const ui = SpreadsheetApp.getUi();

  // Caso 1: Solo tiene CreamosID
  const datos1 = ['2024-01-01', '1', 'TECH-001', '', '', '', '', '', '', ''];
  const resultado1 = soloTieneCreamosID(datos1, 2, [3, 4, 5, 6, 8, 9]);

  // Caso 2: Tiene CreamosID + otros datos
  const datos2 = ['2024-01-01', '1', 'TECH-001', '1234567890101', 'María López', 'Mujer', '25', '12345678', 'Universitario', 'Zona 10'];
  const resultado2 = soloTieneCreamosID(datos2, 2, [3, 4, 5, 6, 8, 9]);

  let mensaje = '🧪 PRUEBA DE DETECCIÓN:\n\n';
  mensaje += 'Caso 1 (solo ID): ' + (resultado1 ? '✅ Detectado correctamente' : '❌ Error') + '\n';
  mensaje += 'Caso 2 (con datos): ' + (!resultado2 ? '✅ Detectado correctamente' : '❌ Error') + '\n';

  ui.alert('Resultado', mensaje, ui.ButtonSet.OK);
}
