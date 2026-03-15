/**
 * =====================================================================
 * FUNCIÓN PARA SOBRESCRIBIR DATOS COMPLETOS
 * =====================================================================
 *
 * LÓGICA:
 * 1. Si la persona en el directorio SOLO tiene ID (sin nombre ni datos)
 *    → Solo enviar/usar el ID
 *
 * 2. Si la persona en el directorio tiene INFORMACIÓN COMPLETA
 *    → SOBRESCRIBIR TODO (incluso campos que ya tenían datos)
 *
 * Esta función es diferente a autocompletarDesdeCreamosID porque:
 * - autocompletarDesdeCreamosID: solo llena campos VACÍOS
 * - sobrescribirSiCompleto: SOBRESCRIBE todo si hay info completa
 * =====================================================================
 */

/**
 * Sobrescribe datos si el directorio tiene información completa
 * @param {string} nombreHoja - Nombre de la hoja a actualizar (ej: "Hoja de Interés", "Entrevistas", etc.)
 */
function sobrescribirSiCompleto(nombreHoja) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  const hoja = ss.getSheetByName(nombreHoja);
  const hojaDirectorio = ss.getSheetByName(NOMBRE_HOJA_CREAMOS_ID_TECH);

  if (!hojaDirectorio) {
    ui.alert('⚠️ Error', 'La hoja "' + NOMBRE_HOJA_CREAMOS_ID_TECH + '" no existe.', ui.ButtonSet.OK);
    return;
  }

  if (!hoja) {
    ui.alert('⚠️ Error', 'No se encontró la hoja "' + nombreHoja + '".', ui.ButtonSet.OK);
    return;
  }

  const datos = hoja.getDataRange().getValues();
  const datosDirectorio = hojaDirectorio.getDataRange().getValues();

  if (datosDirectorio.length < 2) {
    ui.alert('ℹ️ Directorio vacío', 'La hoja del directorio no tiene datos.', ui.ButtonSet.OK);
    return;
  }

  // ===================================================================
  // PASO 1: Construir mapas de búsqueda desde el directorio
  // ===================================================================
  // Directorio: col 0=Nombre, 1=CreamosID, 2=Año, 3=Age, 4=DPI, 5=NivelEducativo, 6=Zona
  const mapPorCreamosId = new Map();
  const mapPorDpi = new Map();
  const mapPorNombre = new Map();

  for (let i = 1; i < datosDirectorio.length; i++) {
    const fila = datosDirectorio[i];
    const nombre = fila[0] ? fila[0].toString().trim() : '';
    const creamosId = fila[1] ? fila[1].toString().trim() : '';
    const dpi = fila[4] ? fila[4].toString().trim() : '';

    if (creamosId) mapPorCreamosId.set(creamosId.toUpperCase(), fila);
    if (dpi) mapPorDpi.set(dpi, fila);
    if (nombre) mapPorNombre.set(nombre.toLowerCase(), fila);
  }

  // ===================================================================
  // PASO 2: Detectar las columnas de la hoja a actualizar
  // ===================================================================
  const encabezados = datos[0];
  const colMap = {};

  // Buscar índices de columnas
  for (let j = 0; j < encabezados.length; j++) {
    const header = encabezados[j].toString().toLowerCase().trim();
    if (header.includes('creamos') && header.includes('id')) colMap.creamosId = j;
    else if (header.includes('dpi')) colMap.dpi = j;
    else if (header.includes('nombre') && header.includes('completo')) colMap.nombre = j;
    else if (header.includes('edad') || header === 'age') colMap.edad = j;
    else if (header.includes('nivel') && header.includes('educativo')) colMap.nivelEducativo = j;
    else if (header.includes('zona')) colMap.zona = j;
    else if (header.includes('género') || header.includes('genero')) colMap.genero = j;
    else if (header.includes('teléfono') || header.includes('telefono') || header.includes('tel')) colMap.telefono = j;
  }

  let actualizados = 0;
  let soloID = 0;
  let sinCoincidencia = 0;

  // ===================================================================
  // PASO 3: Recorrer cada fila de la hoja y actualizar
  // ===================================================================
  for (let i = 1; i < datos.length; i++) {
    const fila = datos[i];

    // Leer datos actuales de la fila
    const creamosIdActual = colMap.creamosId !== undefined && fila[colMap.creamosId] ? fila[colMap.creamosId].toString().trim() : '';
    const dpiActual = colMap.dpi !== undefined && fila[colMap.dpi] ? fila[colMap.dpi].toString().trim() : '';
    const nombreActual = colMap.nombre !== undefined && fila[colMap.nombre] ? fila[colMap.nombre].toString().trim() : '';
    const edadActual = colMap.edad !== undefined && fila[colMap.edad] ? fila[colMap.edad].toString().trim() : '';
    const nivelActual = colMap.nivelEducativo !== undefined && fila[colMap.nivelEducativo] ? fila[colMap.nivelEducativo].toString().trim() : '';
    const zonaActual = colMap.zona !== undefined && fila[colMap.zona] ? fila[colMap.zona].toString().trim() : '';

    // Fila vacía
    if (!nombreActual && !creamosIdActual && !dpiActual) continue;

    // ===================================================================
    // PASO 4: VERIFICAR SI LA FILA ACTUAL SOLO TIENE ID
    // ===================================================================
    // Si la fila actual SOLO tiene CreamosID (sin nombre ni datos)
    // → NO BUSCAR EN DIRECTORIO, solo mantener el ID
    const soloTieneIDActual = creamosIdActual && !nombreActual && !edadActual && !nivelActual && !zonaActual;

    if (soloTieneIDActual) {
      // ============================================================
      // CASO 1: Fila actual SOLO tiene ID → NO SOBRESCRIBIR
      // ============================================================
      // Solo mantener el ID, no buscar nada en el directorio
      soloID++;
      continue; // Saltar esta fila
    }

    // ===================================================================
    // PASO 5: Buscar en el directorio (solo si la fila tiene datos)
    // ===================================================================
    let filaDirectorio = null;

    // Buscar primero por CreamosID, luego DPI, luego Nombre
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

    // ===================================================================
    // PASO 6: Extraer datos del directorio
    // ===================================================================
    const nombreDir = filaDirectorio[0] ? filaDirectorio[0].toString().trim() : '';
    const creamosIdDir = filaDirectorio[1] ? filaDirectorio[1].toString().trim() : '';
    const edadDir = filaDirectorio[3] ? filaDirectorio[3].toString().trim() : '';
    const dpiDir = filaDirectorio[4] ? filaDirectorio[4].toString().trim() : '';
    const nivelEducativoDir = filaDirectorio[5] ? filaDirectorio[5].toString().trim() : '';
    const zonaDir = filaDirectorio[6] ? filaDirectorio[6].toString().trim() : '';

    // ===================================================================
    // PASO 7: LÓGICA PRINCIPAL - Verificar si DIRECTORIO tiene info completa
    // ===================================================================

    // Verificar si el DIRECTORIO tiene información COMPLETA
    const directorioTieneInfoCompleta = nombreDir && edadDir && (nivelEducativoDir || zonaDir);

    const filaNum = i + 1;
    let actualizado = false;

    if (directorioTieneInfoCompleta) {
      // ============================================================
      // CASO 2: DIRECTORIO tiene información completa → SOBRESCRIBIR TODO
      // ============================================================

      // Sobrescribir TODOS los campos (incluso los que tenían datos)
      if (colMap.nombre !== undefined && nombreDir) {
        hoja.getRange(filaNum, colMap.nombre + 1).setValue(nombreDir);
        actualizado = true;
      }

      if (colMap.creamosId !== undefined && creamosIdDir) {
        hoja.getRange(filaNum, colMap.creamosId + 1).setValue(creamosIdDir);
        actualizado = true;
      }

      if (colMap.dpi !== undefined && dpiDir) {
        hoja.getRange(filaNum, colMap.dpi + 1).setValue(dpiDir);
        actualizado = true;
      }

      if (colMap.edad !== undefined && edadDir) {
        hoja.getRange(filaNum, colMap.edad + 1).setValue(edadDir);
        actualizado = true;
      }

      if (colMap.nivelEducativo !== undefined && nivelEducativoDir) {
        hoja.getRange(filaNum, colMap.nivelEducativo + 1).setValue(nivelEducativoDir);
        actualizado = true;
      }

      if (colMap.zona !== undefined && zonaDir) {
        hoja.getRange(filaNum, colMap.zona + 1).setValue(zonaDir);
        actualizado = true;
      }

    } else {
      // ============================================================
      // CASO 3: DIRECTORIO tiene info parcial → Solo completar vacíos
      // ============================================================
      if (colMap.nombre !== undefined && !nombreActual && nombreDir) {
        hoja.getRange(filaNum, colMap.nombre + 1).setValue(nombreDir);
        actualizado = true;
      }

      if (colMap.creamosId !== undefined && !creamosIdActual && creamosIdDir) {
        hoja.getRange(filaNum, colMap.creamosId + 1).setValue(creamosIdDir);
        actualizado = true;
      }

      if (colMap.dpi !== undefined && !dpiActual && dpiDir) {
        hoja.getRange(filaNum, colMap.dpi + 1).setValue(dpiDir);
        actualizado = true;
      }

      if (colMap.edad !== undefined && !edadActual && edadDir) {
        hoja.getRange(filaNum, colMap.edad + 1).setValue(edadDir);
        actualizado = true;
      }

      if (colMap.nivelEducativo !== undefined && !nivelActual && nivelEducativoDir) {
        hoja.getRange(filaNum, colMap.nivelEducativo + 1).setValue(nivelEducativoDir);
        actualizado = true;
      }

      if (colMap.zona !== undefined && !zonaActual && zonaDir) {
        hoja.getRange(filaNum, colMap.zona + 1).setValue(zonaDir);
        actualizado = true;
      }
    }

    if (actualizado) {
      actualizados++;
    }
  }

  // ===================================================================
  // PASO 7: Mostrar resultados
  // ===================================================================
  let mensaje = '✅ Actualización completada:\n\n';
  mensaje += '📊 Filas actualizadas: ' + actualizados + '\n';
  mensaje += '🆔 Solo ID enviado: ' + soloID + '\n';
  mensaje += '⚠️ Sin coincidencia: ' + sinCoincidencia + '\n\n';

  if (soloID > 0) {
    mensaje += '💡 Se enviaron ' + soloID + ' IDs (sin sobrescribir datos)\n';
  }

  if (actualizados - soloID > 0) {
    mensaje += '♻️ Se sobrescribieron ' + (actualizados - soloID) + ' filas con información completa\n';
  }

  ui.alert('✅ Completado', mensaje, ui.ButtonSet.OK);
}


/**
 * Función de ejemplo para usar desde el menú
 * Actualiza la hoja de "Hoja de Interés"
 */
function sobrescribirHojaInteres() {
  sobrescribirSiCompleto('Hoja de Interés');
}


/**
 * Función de ejemplo para usar desde el menú
 * Actualiza la hoja de "Entrevistas"
 */
function sobrescribirEntrevistas() {
  sobrescribirSiCompleto('Entrevistas');
}


/**
 * Función de ejemplo para usar desde el menú
 * Actualiza la hoja de "Inscritx"
 */
function sobrescribirInscritx() {
  sobrescribirSiCompleto('Inscritx');
}
