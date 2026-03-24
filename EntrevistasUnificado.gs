/**
 * =====================================================================
 * ESTRUCTURA UNIFICADA PARA DETALLE DE ENTREVISTAS
 * =====================================================================
 *
 * Esta función crea UNA ÚNICA hoja "Detalle Entrevistas" con todas las
 * secciones posibles (Alimentos y Bebidas, Tecnología, Servicio al Cliente).
 *
 * Cada registro llena solo las columnas correspondientes a su sector.
 *
 * ESTRUCTURA:
 * - Datos Personales (A-H): 8 columnas
 * - Alimentos y Bebidas - Preguntas (I-U): 13 columnas
 * - Alimentos y Bebidas - Empleabilidad (V-AQ): 22 columnas
 * - Tecnología - Preguntas (AR-BB): 11 columnas
 * - Tecnología - Empleabilidad (BC-BX): 22 columnas
 * - Servicio al Cliente - Preguntas (BY-CI): 11 columnas
 * - Servicio al Cliente - Empleabilidad (CJ-DE): 22 columnas
 * - Género (DF-DR): 13 columnas
 * - Metadatos Kobo (DS-DD): 12 columnas
 *
 * TOTAL: 134 columnas (A-DD)
 * =====================================================================
 */

function crearHojaDetalleEntrevistasUnificada() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Si ya existe, no la recrea
  if (ss.getSheetByName('Detalle Entrevistas')) return;

  const sheet = ss.insertSheet('Detalle Entrevistas');

  const headers = [
    // === SECCIÓN 1: DATOS PERSONALES (A-H) === 8 columnas
    'Fecha Entrevista',                        // A
    'Creamos ID',                              // B - CLAVE DE VINCULACIÓN
    'Nombres y Apellidos',                     // C
    'Género',                                  // D
    'Formación Previa',                        // E
    'Dónde y De Qué Formación',               // F
    'Sector Interés',                          // G
    'Curso Interés',                           // H

    // === SECCIÓN 2A: ALIMENTOS Y BEBIDAS - PREGUNTAS DEL CURSO (I-U) === 13 columnas
    'AB: Por Qué Interesa Curso',              // I
    'AB: Qué Llama la Atención',               // J
    'AB: Expectativa del Curso',               // K
    'AB: Dificultades Curso',                  // L
    'AB: Áreas Vida Cambiarán',                // M
    'AB: Disponibilidad Prácticas',            // N
    'AB: Plan Disponibilidad',                 // O
    'AB: Tramitar Papelería',                  // P
    'AB: Plan Papelería',                      // Q
    'AB: Transporte',                          // R
    'AB: Plan Transporte',                     // S
    'AB: Firmar Documento',                    // T
    'AB: Comentario Documento',                // U

    // === SECCIÓN 2A: ALIMENTOS Y BEBIDAS - ÁREA DE EMPLEABILIDAD (V-AQ) === 22 columnas
    'AB: Actualmente Tiene Trabajo',           // V
    'AB: Cuéntanos Más Trabajo',               // W
    'AB: Satisfecho con Trabajo',              // X
    'AB: Comentario Satisfacción',             // Y
    'AB: Qué Hacer Próximos Meses',            // Z
    'AB: Importancia Conseguir Trabajo',       // AA
    'AB: Te Ves Trabajando Sector',            // AB
    'AB: Ayuda Económica',                     // AC
    'AB: Comentario Ayuda',                    // AD
    'AB: Dependientes Económicos',             // AE
    'AB: Comentario Dependientes',             // AF
    'AB: Responsabilidades Cuidado',           // AG
    'AB: Comentario Cuidado',                  // AH
    'AB: Deudas Bancarias',                    // AI
    'AB: Comentario Deudas',                   // AJ
    'AB: Antecedentes Penales',                // AK
    'AB: Comentario Antecedentes',             // AL
    'AB: Caso Legal',                          // AM
    'AB: Comentario Legal',                    // AN
    'AB: Dispuesto Empleabilidad',             // AO
    'AB: Comentario Empleabilidad',            // AP
    'AB: Temporalidad Metas',                  // AQ

    // === SECCIÓN 2B: TECNOLOGÍA - PREGUNTAS DEL CURSO (AR-BB) === 11 columnas
    'TECH: Por Qué Interesa Curso',            // AR
    'TECH: Qué Llama la Atención',             // AS
    'TECH: Expectativa del Curso',             // AT
    'TECH: Dificultades Curso',                // AU
    'TECH: Áreas Vida Cambiarán',              // AV
    'TECH: Disponibilidad Curso',              // AW
    'TECH: Plan Disponibilidad',               // AX
    'TECH: Transporte',                        // AY
    'TECH: Plan Transporte',                   // AZ
    'TECH: Firmar Documento',                  // BA
    'TECH: Comentario Documento',              // BB

    // === SECCIÓN 2B: TECNOLOGÍA - ÁREA DE EMPLEABILIDAD (BC-BX) === 22 columnas
    'TECH: Actualmente Tiene Trabajo',         // BC
    'TECH: Cuéntanos Más Trabajo',             // BD
    'TECH: Satisfecho con Trabajo',            // BE
    'TECH: Comentario Satisfacción',           // BF
    'TECH: Qué Hacer Próximos Meses',          // BG
    'TECH: Importancia Conseguir Trabajo',     // BH
    'TECH: Te Ves Trabajando Sector',          // BI
    'TECH: Ayuda Económica',                   // BJ
    'TECH: Comentario Ayuda',                  // BK
    'TECH: Dependientes Económicos',           // BL
    'TECH: Comentario Dependientes',           // BM
    'TECH: Responsabilidades Cuidado',         // BN
    'TECH: Comentario Cuidado',                // BO
    'TECH: Deudas Bancarias',                  // BP
    'TECH: Comentario Deudas',                 // BQ
    'TECH: Antecedentes Penales',              // BR
    'TECH: Comentario Antecedentes',           // BS
    'TECH: Caso Legal',                        // BT
    'TECH: Comentario Legal',                  // BU
    'TECH: Dispuesto Empleabilidad',           // BV
    'TECH: Comentario Empleabilidad',          // BW
    'TECH: Temporalidad Metas',                // BX

    // === SECCIÓN 2C: SERVICIO AL CLIENTE - PREGUNTAS DEL CURSO (BY-CI) === 11 columnas
    'SAC: Por Qué Interesa Curso',             // BY
    'SAC: Qué Llama la Atención',              // BZ
    'SAC: Expectativa del Curso',              // CA
    'SAC: Dificultades Curso',                 // CB
    'SAC: Áreas Vida Cambiarán',               // CC
    'SAC: Disponibilidad Curso',               // CD
    'SAC: Plan Disponibilidad',                // CE
    'SAC: Transporte',                         // CF
    'SAC: Plan Transporte',                    // CG
    'SAC: Firmar Documento',                   // CH
    'SAC: Comentario Documento',               // CI

    // === SECCIÓN 2C: SERVICIO AL CLIENTE - ÁREA DE EMPLEABILIDAD (CJ-DE) === 22 columnas
    'SAC: Actualmente Tiene Trabajo',          // CJ
    'SAC: Cuéntanos Más Trabajo',              // CK
    'SAC: Satisfecho con Trabajo',             // CL
    'SAC: Comentario Satisfacción',            // CM
    'SAC: Qué Hacer Próximos Meses',           // CN
    'SAC: Importancia Conseguir Trabajo',      // CO
    'SAC: Te Ves Trabajando Sector',           // CP
    'SAC: Ayuda Económica',                    // CQ
    'SAC: Comentario Ayuda',                   // CR
    'SAC: Dependientes Económicos',            // CS
    'SAC: Comentario Dependientes',            // CT
    'SAC: Responsabilidades Cuidado',          // CU
    'SAC: Comentario Cuidado',                 // CV
    'SAC: Deudas Bancarias',                   // CW
    'SAC: Comentario Deudas',                  // CX
    'SAC: Antecedentes Penales',               // CY
    'SAC: Comentario Antecedentes',            // CZ
    'SAC: Caso Legal',                         // DA
    'SAC: Comentario Legal',                   // DB
    'SAC: Dispuesto Empleabilidad',            // DC
    'SAC: Comentario Empleabilidad',           // DD
    'SAC: Temporalidad Metas',                 // DE

    // === SECCIÓN 3: GÉNERO (DF-DR) === 13 columnas
    'Género: Comentario Previo',               // DF
    'Género: Grupos Mixtos',                   // DG
    'Género: Comentario Mixtos',               // DH
    'Género: Grupos Diversos',                 // DI
    'Género: Comentario Diversos',             // DJ
    'Género: Conflicto en Grupos',             // DK
    'Género: Comentario Conflicto Grupos',     // DL
    'Género: Conflicto Horarios',              // DM
    'Género: Comentario Conflicto Horarios',   // DN
    'Género: Grupo Mayoritariamente Mujeres',  // DO
    'Género: Igualdad H/M',                    // DP
    'Género: Familiares Creamos',              // DQ
    'Género: Nombres Familiares',              // DR

    // === NOTAS Y METADATOS KOBO (DS-DD) === 12 columnas
    'Notas del Entrevistador',                 // DS
    '_id',                                     // DT
    '_uuid',                                   // DU
    '_submission_time',                        // DV
    '_validation_status',                      // DW
    '_notes',                                  // DX
    '_status',                                 // DY
    '_submitted_by',                           // DZ
    '__version__',                             // EA
    '_tags',                                   // EB
    'meta/rootUuid',                           // EC
    '_index'                                   // ED
  ];

  // Total: 134 columnas
  Logger.log('Total de columnas en estructura unificada: ' + headers.length);

  // Expandir la hoja para acomodar todas las columnas
  const currentCols = sheet.getMaxColumns();
  if (headers.length > currentCols) {
    sheet.insertColumnsAfter(currentCols, headers.length - currentCols);
  }

  // Establecer encabezados
  sheet.getRange(1, 1, 1, headers.length).setValues([headers])
    .setFontColor('white')
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setWrap(true);

  // Congelar fila de encabezados
  sheet.setFrozenRows(1);

  // Anchos de columna (134 valores)
  const anchos = [
    // Datos personales A-H (8)
    100, 100, 200, 80, 80, 150, 120, 150,
    // AB: Preguntas del Curso I-U (13)
    200, 200, 200, 200, 200, 80, 200, 80, 200, 80, 200, 80, 200,
    // AB: Empleabilidad V-AQ (22)
    80, 200, 80, 200, 200, 150, 200, 80, 150, 80, 150, 80, 150, 80, 150, 80, 150, 80, 150, 80, 200, 200,
    // TECH: Preguntas del Curso AR-BB (11)
    200, 200, 200, 200, 200, 80, 200, 80, 200, 80, 200,
    // TECH: Empleabilidad BC-BX (22)
    80, 200, 80, 200, 200, 150, 200, 80, 150, 80, 150, 80, 150, 80, 150, 80, 150, 80, 150, 80, 200, 200,
    // SAC: Preguntas del Curso BY-CI (11)
    200, 200, 200, 200, 200, 80, 200, 80, 200, 80, 200,
    // SAC: Empleabilidad CJ-DE (22)
    80, 200, 80, 200, 200, 150, 200, 80, 150, 80, 150, 80, 150, 80, 150, 80, 150, 80, 150, 80, 200, 200,
    // Género DF-DR (13)
    200, 80, 150, 80, 150, 80, 200, 80, 200, 150, 200, 80, 200,
    // Notas y metadatos DS-ED (12)
    250, 100, 150, 120, 100, 120, 100, 100, 80, 120, 150, 80
  ];

  anchos.forEach((w, i) => {
    sheet.setColumnWidth(i + 1, w);
  });

  // Colorear secciones de encabezado
  sheet.getRange('A1:H1').setBackground('#1565c0');    // Datos Personales - Azul
  sheet.getRange('I1:U1').setBackground('#e65100');    // AB: Preguntas Curso - Naranja
  sheet.getRange('V1:AQ1').setBackground('#bf360c');   // AB: Empleabilidad - Naranja oscuro
  sheet.getRange('AR1:BB1').setBackground('#283593');  // TECH: Preguntas Curso - Índigo
  sheet.getRange('BC1:BX1').setBackground('#1a237e');  // TECH: Empleabilidad - Índigo oscuro
  sheet.getRange('BY1:CI1').setBackground('#1b5e20');  // SAC: Preguntas Curso - Verde
  sheet.getRange('CJ1:DE1').setBackground('#33691e');  // SAC: Empleabilidad - Verde oscuro
  sheet.getRange('DF1:DR1').setBackground('#880e4f');  // Género - Rosa
  sheet.getRange('DS1:ED1').setBackground('#455a64');  // Notas y metadatos - Gris azulado

  Logger.log('✅ Hoja "Detalle Entrevistas" unificada creada con éxito - 134 columnas');
}

/**
 * ÍNDICES DE COLUMNAS PARA CADA SECCIÓN
 * Usar estos índices para escribir en las columnas correctas
 */
const INDICES_COLUMNAS_UNIFICADAS = {
  // Datos Personales (A-H): índices 0-7
  DATOS_PERSONALES: {
    fechaEntrevista: 0,      // A
    creamosId: 1,            // B
    nombreCompleto: 2,       // C
    genero: 3,               // D
    formacionPrevia: 4,      // E
    dondeFormacion: 5,       // F
    sectorInteres: 6,        // G
    cursoInteres: 7          // H
  },

  // Alimentos y Bebidas - Preguntas (I-U): índices 8-20
  AB_PREGUNTAS: {
    porQueInteres: 8,        // I
    queLlamaAtencion: 9,     // J
    expectativaCurso: 10,    // K
    dificultadesCurso: 11,   // L
    areasVida: 12,           // M
    disponibilidadPracticas: 13, // N
    planDisponibilidad: 14,  // O
    tramitarPapeleria: 15,   // P
    planPapeleria: 16,       // Q
    transporte: 17,          // R
    planTransporte: 18,      // S
    firmarDocumento: 19,     // T
    comentarioDoc: 20        // U
  },

  // Alimentos y Bebidas - Empleabilidad (V-AQ): índices 21-42
  AB_EMPLEABILIDAD: {
    tieneTrabajoActual: 21,  // V
    cuentanosTrabajo: 22,    // W
    satisfechoTrabajo: 23,   // X
    comentarioSatisfaccion: 24, // Y
    proximosMeses: 25,       // Z
    importanciaTrabajo: 26,  // AA
    teVesSector: 27,         // AB
    ayudaEconomica: 28,      // AC
    comentarioAyuda: 29,     // AD
    dependientes: 30,        // AE
    comentarioDependientes: 31, // AF
    responsabilidadesCuidado: 32, // AG
    comentarioCuidado: 33,   // AH
    deudasBancarias: 34,     // AI
    comentarioDeudas: 35,    // AJ
    antecedentes: 36,        // AK
    comentarioAntecedentes: 37, // AL
    casoLegal: 38,           // AM
    comentarioLegal: 39,     // AN
    dispuestoEmpleabilidad: 40, // AO
    comentarioEmpleabilidad: 41, // AP
    temporalidadMetas: 42    // AQ
  },

  // Tecnología - Preguntas (AR-BB): índices 43-53
  TECH_PREGUNTAS: {
    porQueInteres: 43,       // AR
    queLlamaAtencion: 44,    // AS
    expectativaCurso: 45,    // AT
    dificultadesCurso: 46,   // AU
    areasVida: 47,           // AV
    disponibilidadCurso: 48, // AW
    planDisponibilidad: 49,  // AX
    transporte: 50,          // AY
    planTransporte: 51,      // AZ
    firmarDocumento: 52,     // BA
    comentarioDoc: 53        // BB
  },

  // Tecnología - Empleabilidad (BC-BX): índices 54-75
  TECH_EMPLEABILIDAD: {
    tieneTrabajoActual: 54,  // BC
    cuentanosTrabajo: 55,    // BD
    satisfechoTrabajo: 56,   // BE
    comentarioSatisfaccion: 57, // BF
    proximosMeses: 58,       // BG
    importanciaTrabajo: 59,  // BH
    teVesSector: 60,         // BI
    ayudaEconomica: 61,      // BJ
    comentarioAyuda: 62,     // BK
    dependientes: 63,        // BL
    comentarioDependientes: 64, // BM
    responsabilidadesCuidado: 65, // BN
    comentarioCuidado: 66,   // BO
    deudasBancarias: 67,     // BP
    comentarioDeudas: 68,    // BQ
    antecedentes: 69,        // BR
    comentarioAntecedentes: 70, // BS
    casoLegal: 71,           // BT
    comentarioLegal: 72,     // BU
    dispuestoEmpleabilidad: 73, // BV
    comentarioEmpleabilidad: 74, // BW
    temporalidadMetas: 75    // BX
  },

  // Servicio al Cliente - Preguntas (BY-CI): índices 76-86
  SAC_PREGUNTAS: {
    porQueInteres: 76,       // BY
    queLlamaAtencion: 77,    // BZ
    expectativaCurso: 78,    // CA
    dificultadesCurso: 79,   // CB
    areasVida: 80,           // CC
    disponibilidadCurso: 81, // CD
    planDisponibilidad: 82,  // CE
    transporte: 83,          // CF
    planTransporte: 84,      // CG
    firmarDocumento: 85,     // CH
    comentarioDoc: 86        // CI
  },

  // Servicio al Cliente - Empleabilidad (CJ-DE): índices 87-108
  SAC_EMPLEABILIDAD: {
    tieneTrabajoActual: 87,  // CJ
    cuentanosTrabajo: 88,    // CK
    satisfechoTrabajo: 89,   // CL
    comentarioSatisfaccion: 90, // CM
    proximosMeses: 91,       // CN
    importanciaTrabajo: 92,  // CO
    teVesSector: 93,         // CP
    ayudaEconomica: 94,      // CQ
    comentarioAyuda: 95,     // CR
    dependientes: 96,        // CS
    comentarioDependientes: 97, // CT
    responsabilidadesCuidado: 98, // CU
    comentarioCuidado: 99,   // CV
    deudasBancarias: 100,    // CW
    comentarioDeudas: 101,   // CX
    antecedentes: 102,       // CY
    comentarioAntecedentes: 103, // CZ
    casoLegal: 104,          // DA
    comentarioLegal: 105,    // DB
    dispuestoEmpleabilidad: 106, // DC
    comentarioEmpleabilidad: 107, // DD
    temporalidadMetas: 108   // DE
  },

  // Género (DF-DR): índices 109-121
  GENERO: {
    comentarioPrevio: 109,   // DF
    gruposMixtos: 110,       // DG
    comentarioMixtos: 111,   // DH
    gruposDiversos: 112,     // DI
    comentarioDiversos: 113, // DJ
    conflictoGrupos: 114,    // DK
    comentarioConflictoGrupos: 115, // DL
    conflictoHorarios: 116,  // DM
    comentarioConflictoHorarios: 117, // DN
    grupoMujeres: 118,       // DO
    igualdadHM: 119,         // DP
    familiaresCreamos: 120,  // DQ
    nombresFamiliares: 121   // DR
  },

  // Metadatos Kobo (DS-ED): índices 122-133
  METADATOS: {
    notasEntrevistador: 122, // DS
    koboId: 123,             // DT
    koboUuid: 124,           // DU
    koboSubmissionTime: 125, // DV
    koboValidationStatus: 126, // DW
    koboNotes: 127,          // DX
    koboStatus: 128,         // DY
    koboSubmittedBy: 129,    // DZ
    koboVersion: 130,        // EA
    koboTags: 131,           // EB
    koboRootUuid: 132,       // EC
    koboIndex: 133           // ED
  }
};
