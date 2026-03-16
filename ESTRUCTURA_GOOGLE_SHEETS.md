# 📊 ESTRUCTURA GOOGLE SHEETS - SISTEMA DE ESTIPENDIOS

## 🎯 OBJETIVO
Crear un sistema de Google Sheets que gestione estipendios para dos programas principales:
- **TECH** (Tecnología): SAC, Computación, Marketing Digital
- **ALIMENTOS Y BEBIDAS**: Cocina, Repostería, Barismo

---

## 📑 HOJAS DEL DOCUMENTO

### HOJA 1: `Configuración`
**Propósito**: Catálogos y valores de referencia

| Columna A | Columna B | Columna C | Columna D | Columna E |
|-----------|-----------|-----------|-----------|-----------|
| **PROGRAMAS** | **COHORTES** | **TIPOS DE ESTIPENDIO** | **ESTADOS PAGO** | **MÉTODOS PAGO** |
| Tech | SAC Cohorte I | Curso | Programado | Efectivo |
| Alimentos y Bebidas | SAC Cohorte II | Prácticas | Pagado | Transferencia |
| | Computación Cohorte I | | Atrasado | Cheque |
| | Cocina Cohorte I | | Cancelado | Depósito |
| | Repostería Cohorte I | | | |
| | Barismo Cohorte I | | | |

**Columnas adicionales:**

| Columna F | Columna G | Columna H |
|-----------|-----------|-----------|
| **MONTO CURSO** | **MONTO PRÁCTICAS** | **RESPONSABLES** |
| Q 500 | Q 800 | Eva |
| | | Adrian Torres |
| | | Paola Ortiz |

---

### HOJA 2: `Presupuesto_Cohortes`
**Propósito**: Presupuestos asignados por cohorte

| Columna | Nombre | Tipo | Ejemplo | Descripción |
|---------|--------|------|---------|-------------|
| A | ID_Cohorte | Texto | COH-001 | Identificador único |
| B | Programa | Lista | Tech | Tech o Alimentos y Bebidas |
| C | Nombre_Cohorte | Texto | SAC Cohorte I | Nombre descriptivo |
| D | Año | Número | 2026 | Año del programa |
| E | Fecha_Inicio | Fecha | 01/02/2026 | Inicio de la cohorte |
| F | Fecha_Fin | Fecha | 30/06/2026 | Fin de la cohorte |
| G | Num_Participantes | Número | 45 | # participantes inscritas |
| H | Presupuesto_Curso | Moneda | Q 22,500 | Presupuesto para estipendios de curso |
| I | Presupuesto_Practicas | Moneda | Q 36,000 | Presupuesto para estipendios de prácticas |
| J | Presupuesto_Total | Fórmula | Q 58,500 | =H2+I2 |
| K | Gastado_Curso | Fórmula | Q 18,000 | =SUMIFS(Estipendios!$G:$G, Estipendios!$C:$C, A2, Estipendios!$H:$H, "Curso", Estipendios!$M:$M, "Pagado") |
| L | Gastado_Practicas | Fórmula | Q 24,800 | =SUMIFS(Estipendios!$G:$G, Estipendios!$C:$C, A2, Estipendios!$H:$H, "Prácticas", Estipendios!$M:$M, "Pagado") |
| M | Gastado_Total | Fórmula | Q 42,800 | =K2+L2 |
| N | Disponible_Total | Fórmula | Q 15,700 | =J2-M2 |
| O | Porcentaje_Ejecucion | Fórmula | 73% | =M2/J2 |
| P | Estado_Presupuesto | Fórmula | Normal | =IFS(O2>=0.95,"Crítico", O2>=0.80,"Advertencia", TRUE,"Normal") |
| Q | Responsable | Texto | Eva | Coordinador(a) responsable |
| R | Activa | Checkbox | ☑ | Si la cohorte está activa |
| S | Notas | Texto | - | Observaciones |

**Fórmulas importantes:**

```excel
// J2: Presupuesto Total
=H2+I2

// K2: Gastado en Curso
=SUMIFS(Estipendios!$G:$G, Estipendios!$C:$C, A2, Estipendios!$H:$H, "Curso", Estipendios!$M:$M, "Pagado")

// L2: Gastado en Prácticas
=SUMIFS(Estipendios!$G:$G, Estipendios!$C:$C, A2, Estipendios!$H:$H, "Prácticas", Estipendios!$M:$M, "Pagado")

// M2: Gastado Total
=K2+L2

// N2: Disponible
=J2-M2

// O2: % Ejecución
=IF(J2=0, 0, M2/J2)

// P2: Estado Presupuesto
=IFS(O2>=0.95,"🔴 Crítico", O2>=0.80,"🟡 Advertencia", TRUE,"🟢 Normal")
```

---

### HOJA 3: `Participantes`
**Propósito**: Registro de participantes del programa

| Columna | Nombre | Tipo | Ejemplo | Descripción |
|---------|--------|------|---------|-------------|
| A | ID_Participante | Texto | PART-001 | Identificador único |
| B | Nombre_Completo | Texto | María López García | Nombre completo |
| C | DPI | Texto | 2345678901234 | DPI (encriptado/ofuscado si es necesario) |
| D | Telefono | Texto | 5512-3456 | Teléfono de contacto |
| E | Programa | Lista | Tech | Tech o Alimentos y Bebidas |
| F | ID_Cohorte | Lista | COH-001 | ID de cohorte (validar con Presupuesto_Cohortes) |
| G | Nombre_Cohorte | Fórmula | SAC Cohorte I | =VLOOKUP(F2,Presupuesto_Cohortes!A:C,3,FALSE) |
| H | Estado | Lista | Activa | Activa, Graduada, Retirada |
| I | Nivel_Vulnerabilidad | Lista | Alta | Alta, Media, Baja |
| J | Zona_Residencia | Texto | Zona 18 | Ubicación geográfica |
| K | Fecha_Inscripcion | Fecha | 01/02/2026 | Fecha de inscripción |
| L | Fecha_Graduacion | Fecha | 30/06/2026 | Si ya se graduó |
| M | Empleada | Checkbox | ☑ | Si consiguió empleo post-programa |
| N | Salario_Empleo | Moneda | Q 4,500 | Salario mensual (si está empleada) |
| O | Total_Estipendios_Recibidos | Fórmula | Q 1,800 | =SUMIFS(Estipendios!$G:$G, Estipendios!$D:$D, A2, Estipendios!$M:$M, "Pagado") |
| P | Num_Pagos_Recibidos | Fórmula | 3 | =COUNTIFS(Estipendios!$D:$D, A2, Estipendios!$M:$M, "Pagado") |
| Q | Notas | Texto | - | Observaciones |

**Fórmulas importantes:**

```excel
// G2: Nombre Cohorte
=IFERROR(VLOOKUP(F2,Presupuesto_Cohortes!A:C,3,FALSE),"")

// O2: Total Estipendios Recibidos
=SUMIFS(Estipendios!$G:$G, Estipendios!$D:$D, A2, Estipendios!$M:$M, "Pagado")

// P2: Número de Pagos
=COUNTIFS(Estipendios!$D:$D, A2, Estipendios!$M:$M, "Pagado")
```

---

### HOJA 4: `Estipendios`
**Propósito**: Registro detallado de cada pago de estipendio (Conectada con KOBO)

| Columna | Nombre | Tipo | Ejemplo | Descripción |
|---------|--------|------|---------|-------------|
| A | ID_Pago | Texto | EST-001 | Identificador único del pago |
| B | Timestamp_Kobo | Fecha/Hora | 10/03/2026 14:30 | Fecha/hora de registro en Kobo |
| C | ID_Cohorte | Texto | COH-001 | ID de cohorte |
| D | ID_Participante | Texto | PART-001 | ID de participante |
| E | Nombre_Participante | Fórmula | María López | =VLOOKUP(D2,Participantes!A:B,2,FALSE) |
| F | Programa | Fórmula | Tech | =VLOOKUP(D2,Participantes!A:E,5,FALSE) |
| G | Monto | Moneda | Q 500 | Monto del estipendio |
| H | Tipo_Estipendio | Lista | Curso | Curso o Prácticas |
| I | Fecha_Programada | Fecha | 10/03/2026 | Fecha programada para el pago |
| J | Fecha_Real_Pago | Fecha | 12/03/2026 | Fecha real del pago |
| K | Dias_Diferencia | Fórmula | 2 | =J2-I2 |
| L | Estado_Tiempo | Fórmula | Atrasado | =IFS(K2<0,"Adelantado", K2=0,"A tiempo", K2<=7,"Atrasado", TRUE,"Muy Atrasado") |
| M | Estado_Pago | Lista | Pagado | Programado, Pagado, Atrasado, Cancelado |
| N | Metodo_Pago | Lista | Efectivo | Efectivo, Transferencia, Cheque, Depósito |
| O | Responsable_Pago | Texto | Eva | Quien realizó el pago |
| P | Ubicacion_GPS | Texto | 14.6349,-90.5069 | Coordenadas GPS del pago |
| Q | Firma_Digital | URL | [link] | URL de imagen de firma |
| R | Foto_Comprobante | URL | [link] | URL de foto del comprobante |
| S | Numero_Comprobante | Texto | REC-001 | Número de recibo/comprobante |
| T | Mes | Fórmula | Marzo | =TEXT(I2,"MMMM") |
| U | Año | Fórmula | 2026 | =YEAR(I2) |
| V | Semana | Fórmula | 11 | =WEEKNUM(I2) |
| W | Notas | Texto | - | Observaciones |

**Fórmulas importantes:**

```excel
// E2: Nombre Participante
=IFERROR(VLOOKUP(D2,Participantes!A:B,2,FALSE),"No encontrado")

// F2: Programa
=IFERROR(VLOOKUP(D2,Participantes!A:E,5,FALSE),"")

// K2: Días de Diferencia
=IF(AND(J2<>"",I2<>""), J2-I2, "")

// L2: Estado Tiempo
=IF(K2="", "", IFS(K2<0,"⚡ Adelantado", K2=0,"✓ A tiempo", K2<=7,"🟡 Atrasado", TRUE,"🔴 Muy Atrasado"))

// T2: Mes
=TEXT(I2,"MMMM")

// U2: Año
=YEAR(I2)

// V2: Semana del año
=WEEKNUM(I2)
```

---

### HOJA 5: `Dashboard_KPIs`
**Propósito**: Cálculos de KPIs para Power BI y reportes

#### SECCIÓN A: KPIs GENERALES

| Fila | KPI | Fórmula | Descripción |
|------|-----|---------|-------------|
| 2 | **Total Presupuesto** | =SUM(Presupuesto_Cohortes!J:J) | Suma de todos los presupuestos |
| 3 | **Total Gastado** | =SUMIF(Estipendios!M:M,"Pagado",Estipendios!G:G) | Total de pagos realizados |
| 4 | **Total Disponible** | =B2-B3 | Presupuesto - Gastado |
| 5 | **% Ejecución** | =B3/B2 | Porcentaje ejecutado |
| 6 | **# Beneficiadas** | =COUNTA(UNIQUE(FILTER(Estipendios!D:D, Estipendios!M:M="Pagado"))) | Participantes únicas que recibieron pago |
| 7 | **# Total Pagos** | =COUNTIF(Estipendios!M:M,"Pagado") | Cantidad de pagos realizados |
| 8 | **Tiempo Prom. Pago (días)** | =AVERAGE(FILTER(Estipendios!K:K, Estipendios!M:M="Pagado")) | Promedio de días de demora |
| 9 | **# Pagos Atrasados** | =COUNTIF(Estipendios!M:M,"Atrasado") | Pagos pendientes atrasados |

#### SECCIÓN B: KPIs POR PROGRAMA

**TECH:**

| Fila | KPI | Fórmula | Descripción |
|------|-----|---------|-------------|
| 12 | **Presupuesto Tech** | =SUMIF(Presupuesto_Cohortes!B:B,"Tech",Presupuesto_Cohortes!J:J) | Presupuesto total Tech |
| 13 | **Gastado Tech** | =SUMIFS(Estipendios!G:G,Estipendios!M:M,"Pagado",Estipendios!F:F,"Tech") | Gastado en Tech |
| 14 | **Disponible Tech** | =B12-B13 | Disponible Tech |
| 15 | **% Ejecución Tech** | =B13/B12 | % ejecutado Tech |
| 16 | **Beneficiadas Tech** | =COUNTA(UNIQUE(FILTER(Participantes!A:A,Participantes!E:E="Tech",Participantes!H:H<>"Retirada"))) | # participantes Tech |

**ALIMENTOS Y BEBIDAS:**

| Fila | KPI | Fórmula | Descripción |
|------|-----|---------|-------------|
| 19 | **Presupuesto A&B** | =SUMIF(Presupuesto_Cohortes!B:B,"Alimentos y Bebidas",Presupuesto_Cohortes!J:J) | Presupuesto A&B |
| 20 | **Gastado A&B** | =SUMIFS(Estipendios!G:G,Estipendios!M:M,"Pagado",Estipendios!F:F,"Alimentos y Bebidas") | Gastado en A&B |
| 21 | **Disponible A&B** | =B19-B20 | Disponible A&B |
| 22 | **% Ejecución A&B** | =B20/B19 | % ejecutado A&B |
| 23 | **Beneficiadas A&B** | =COUNTA(UNIQUE(FILTER(Participantes!A:A,Participantes!E:E="Alimentos y Bebidas",Participantes!H:H<>"Retirada"))) | # participantes A&B |

#### SECCIÓN C: KPIs TIPO DE ESTIPENDIO

| Fila | KPI | Fórmula | Descripción |
|------|-----|---------|-------------|
| 26 | **Gastado Curso** | =SUMIFS(Estipendios!G:G,Estipendios!M:M,"Pagado",Estipendios!H:H,"Curso") | Total curso |
| 27 | **Gastado Prácticas** | =SUMIFS(Estipendios!G:G,Estipendios!M:M,"Pagado",Estipendios!H:H,"Prácticas") | Total prácticas |
| 28 | **% Curso** | =B26/(B26+B27) | Porcentaje curso |
| 29 | **% Prácticas** | =B27/(B26+B27) | Porcentaje prácticas |

#### SECCIÓN D: KPIs DE IMPACTO

| Fila | KPI | Fórmula | Descripción |
|------|-----|---------|-------------|
| 32 | **# Graduadas** | =COUNTIF(Participantes!H:H,"Graduada") | Total graduadas |
| 33 | **# Empleadas** | =COUNTIF(Participantes!M:M,TRUE) | Total empleadas |
| 34 | **% Graduación** | =B32/COUNTA(Participantes!A:A) | Tasa de graduación |
| 35 | **% Empleabilidad** | =B33/B32 | Tasa de empleabilidad |
| 36 | **Costo por Graduada** | =B3/B32 | Inversión por graduada |
| 37 | **Salario Prom. Egresadas** | =AVERAGE(FILTER(Participantes!N:N,Participantes!M:M=TRUE)) | Salario promedio |

---

### HOJA 6: `Dashboard_Alertas`
**Propósito**: Alertas automáticas para monitoreo

| Columna A | Columna B | Columna C | Columna D | Columna E |
|-----------|-----------|-----------|-----------|-----------|
| **Tipo** | **Descripción** | **Cohorte** | **Severidad** | **Acción Requerida** |

**Fórmulas automáticas que poblan alertas:**

```excel
// Alerta de presupuesto crítico (>95%)
=IF(Presupuesto_Cohortes!O2>=0.95,
    "Presupuesto al " & TEXT(Presupuesto_Cohortes!O2,"0%") & " - Solo " & TEXT(Presupuesto_Cohortes!N2,"Q#,##0") & " disponibles",
    "")

// Alerta de pagos atrasados por cohorte
=IF(COUNTIFS(Estipendios!C:C, Presupuesto_Cohortes!A2, Estipendios!M:M, "Atrasado")>0,
    COUNTIFS(Estipendios!C:C, Presupuesto_Cohortes!A2, Estipendios!M:M, "Atrasado") & " pagos atrasados",
    "")
```

---

### HOJA 7: `Reporte_Mensual`
**Propósito**: Tabla dinámica para reportes mensuales automáticos

Esta hoja puede usar una tabla dinámica o fórmulas QUERY para generar reportes automáticos por:
- Mes
- Programa
- Cohorte
- Tipo de estipendio

**Ejemplo de fórmula QUERY:**

```excel
=QUERY(Estipendios!A:W,
  "SELECT T, F, SUM(G), COUNT(A)
   WHERE M='Pagado' AND U=2026
   GROUP BY T, F
   ORDER BY T, F
   LABEL T 'Mes', F 'Programa', SUM(G) 'Total Pagado', COUNT(A) 'Número de Pagos'")
```

---

## 🔗 CONEXIÓN CON KOBO

### Campos que vienen de Kobo → Estipendios

Cuando un formulario Kobo se envía, debe mapear a estas columnas:

| Campo Kobo | Columna Sheet | Ejemplo |
|------------|---------------|---------|
| _submission_time | B (Timestamp_Kobo) | 10/03/2026 14:30 |
| id_cohorte | C (ID_Cohorte) | COH-001 |
| id_participante | D (ID_Participante) | PART-001 |
| monto | G (Monto) | 500 |
| tipo_estipendio | H (Tipo_Estipendio) | Curso |
| fecha_programada | I (Fecha_Programada) | 10/03/2026 |
| fecha_pago | J (Fecha_Real_Pago) | 12/03/2026 |
| estado | M (Estado_Pago) | Pagado |
| metodo_pago | N (Metodo_Pago) | Efectivo |
| responsable | O (Responsable_Pago) | Eva |
| ubicacion_gps | P (Ubicacion_GPS) | 14.6349,-90.5069 |
| firma | Q (Firma_Digital) | [URL] |
| foto_comprobante | R (Foto_Comprobante) | [URL] |
| numero_comprobante | S (Numero_Comprobante) | REC-001 |
| notas | W (Notas) | - |

### Configuración de integración Kobo → Sheets

**Opción 1: Usar Zapier/Make**
- Trigger: New submission in Kobo
- Action: Add row to Google Sheets (Hoja "Estipendios")
- Mapping: Según tabla anterior

**Opción 2: Usar REST API de Kobo**
- Script en Google Apps Script que consulta API de Kobo cada hora
- Inserta nuevos registros en hoja Estipendios

**Opción 3: Usar webhook de Kobo**
- Configurar webhook en Kobo que envía a Google Apps Script
- Script recibe y procesa datos en tiempo real

---

## 🎨 FORMATO Y VALIDACIONES

### Validación de Datos (Data Validation)

**Hoja Configuración:**
- Sin validaciones (es la fuente de verdad)

**Hoja Presupuesto_Cohortes:**
- Columna B (Programa): Lista desde Configuración!A2:A3
- Columna Q (Responsable): Lista desde Configuración!H2:H4
- Columna R (Activa): Checkbox

**Hoja Participantes:**
- Columna E (Programa): Lista desde Configuración!A2:A3
- Columna F (ID_Cohorte): Lista desde Presupuesto_Cohortes!A:A
- Columna H (Estado): Lista: Activa, Graduada, Retirada
- Columna I (Nivel_Vulnerabilidad): Lista: Alta, Media, Baja
- Columna M (Empleada): Checkbox

**Hoja Estipendios:**
- Columna C (ID_Cohorte): Lista desde Presupuesto_Cohortes!A:A
- Columna D (ID_Participante): Lista desde Participantes!A:A
- Columna H (Tipo_Estipendio): Lista desde Configuración!C2:C3
- Columna M (Estado_Pago): Lista desde Configuración!D2:D5
- Columna N (Metodo_Pago): Lista desde Configuración!E2:E5

### Formato Condicional

**Presupuesto_Cohortes:**
- Columna O (% Ejecución):
  - Rojo si >= 95%
  - Amarillo si >= 80%
  - Verde si < 80%

**Estipendios:**
- Columna K (Días Diferencia):
  - Verde si <= 0
  - Amarillo si 1-7
  - Rojo si > 7
- Columna M (Estado):
  - Verde: "Pagado"
  - Azul: "Programado"
  - Rojo: "Atrasado"
  - Gris: "Cancelado"

### Formato de Moneda
- Todas las columnas de moneda: Formato personalizado `"Q"#,##0.00`

### Protección de Hojas

**Proteger estas hojas:**
- ✅ Configuración (solo administradores)
- ✅ Dashboard_KPIs (solo fórmulas, no editable)
- ✅ Dashboard_Alertas (solo fórmulas)
- ✅ Reporte_Mensual (solo fórmulas)

**Editable:**
- ✅ Presupuesto_Cohortes (coordinadores)
- ✅ Participantes (coordinadores)
- ⚠️ Estipendios (solo via Kobo, no manual)

---

## 📊 PREPARACIÓN PARA POWER BI

### Tablas de Hechos (Fact Tables)

**1. Fact_Estipendios** (desde hoja Estipendios)
- Contiene: ID_Pago, ID_Cohorte, ID_Participante, Monto, Fecha, Estado, etc.
- Granularidad: Un registro por pago

### Tablas de Dimensiones (Dimension Tables)

**2. Dim_Cohortes** (desde Presupuesto_Cohortes)
- Contiene: ID_Cohorte, Nombre_Cohorte, Programa, Año, Responsable

**3. Dim_Participantes** (desde Participantes)
- Contiene: ID_Participante, Nombre, Programa, Cohorte, Zona, Nivel_Vulnerabilidad

**4. Dim_Tiempo** (generar desde Estipendios)
- Contiene: Fecha, Día, Mes, Año, Semana, Trimestre
- Se puede crear con fórmula o en Power BI

**5. Dim_Programas** (desde Configuración)
- Contiene: Programa (Tech, Alimentos y Bebidas)

### Relaciones en Power BI

```
Fact_Estipendios (Many) → (One) Dim_Cohortes [ID_Cohorte]
Fact_Estipendios (Many) → (One) Dim_Participantes [ID_Participante]
Fact_Estipendios (Many) → (One) Dim_Tiempo [Fecha]
Dim_Cohortes (Many) → (One) Dim_Programas [Programa]
Dim_Participantes (Many) → (One) Dim_Programas [Programa]
```

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Configuración Inicial
- [ ] Crear nuevo Google Sheet
- [ ] Crear las 7 hojas con los nombres exactos
- [ ] Configurar columnas y headers de cada hoja
- [ ] Agregar datos a hoja "Configuración"

### Fase 2: Datos Maestros
- [ ] Ingresar cohortes actuales en "Presupuesto_Cohortes"
- [ ] Ingresar participantes en "Participantes"
- [ ] Validar que IDs sean únicos

### Fase 3: Fórmulas
- [ ] Implementar fórmulas en "Presupuesto_Cohortes"
- [ ] Implementar fórmulas en "Participantes"
- [ ] Implementar fórmulas en "Estipendios"
- [ ] Crear KPIs en "Dashboard_KPIs"
- [ ] Configurar alertas en "Dashboard_Alertas"

### Fase 4: Validaciones y Formato
- [ ] Agregar validación de datos (listas desplegables)
- [ ] Configurar formato condicional
- [ ] Aplicar formato de moneda
- [ ] Proteger hojas necesarias

### Fase 5: Integración Kobo
- [ ] Mapear campos Kobo → Sheets
- [ ] Configurar conexión (Zapier/Make/API)
- [ ] Probar con datos de prueba
- [ ] Validar que datos lleguen correctamente

### Fase 6: Testing
- [ ] Ingresar 10 pagos de prueba
- [ ] Verificar que KPIs calculen correctamente
- [ ] Verificar alertas automáticas
- [ ] Probar filtros por Programa (Tech vs A&B)

### Fase 7: Conexión Power BI
- [ ] Conectar Power BI a Google Sheets
- [ ] Importar tablas de hechos y dimensiones
- [ ] Configurar relaciones
- [ ] Crear medidas calculadas
- [ ] Construir dashboards

---

## 🚀 DATOS DE EJEMPLO

### Ejemplo Cohorte Tech:
- ID: COH-001
- Programa: Tech
- Nombre: SAC Cohorte I
- Año: 2026
- Participantes: 45
- Presupuesto Curso: Q 22,500 (45 × Q500)
- Presupuesto Prácticas: Q 36,000 (45 × Q800)

### Ejemplo Cohorte A&B:
- ID: COH-002
- Programa: Alimentos y Bebidas
- Nombre: Cocina Cohorte I
- Año: 2026
- Participantes: 35
- Presupuesto Curso: Q 17,500 (35 × Q500)
- Presupuesto Prácticas: Q 28,000 (35 × Q800)

---

## 📞 NOTAS FINALES

- **Backup**: Configurar backup automático diario del Google Sheet
- **Permisos**: Dar acceso "Editor" solo a coordinadores de confianza
- **Auditoría**: Activar historial de versiones de Google Sheets
- **Documentación**: Crear video tutorial para el equipo sobre cómo usar el sistema

---

**Versión**: 1.0
**Fecha**: Marzo 2026
**Autor**: Claude AI + Equipo Inclusión Laboral
