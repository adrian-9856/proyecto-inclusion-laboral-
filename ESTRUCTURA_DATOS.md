# 📁 ESTRUCTURA DE DATOS
## Sistema de Gestión de Estipendios - Ejemplos Concretos

---

## 📋 ÍNDICE

1. [Hoja: Presupuesto Cohortes](#hoja-1-presupuesto-cohortes)
2. [Hoja: Estipendios](#hoja-2-estipendios)
3. [Hoja: Calendario Pagos](#hoja-3-calendario-pagos)
4. [Hoja: Dashboard Resumen](#hoja-4-dashboard-resumen)
5. [Hoja: Auditoría](#hoja-5-auditoría)
6. [Formulario Kobo - Estructura](#formulario-kobo)
7. [Exportación para Power BI](#exportación-power-bi)
8. [Fórmulas Clave](#fórmulas-clave)

---

## HOJA 1: PRESUPUESTO COHORTES

### Estructura de Columnas

| Col | Campo | Tipo | Ejemplo | Validación/Fórmula |
|-----|-------|------|---------|-------------------|
| A | ID Cohorte | Texto | SAC-I-2026 | Único, formato: XXX-X-YYYY |
| B | Nombre Cohorte | Texto | SAC Cohorte I | - |
| C | Año | Número | 2026 | Año válido |
| D | Programa | Desplegable | Tecnología | Tecnología / Alimentos y Bebidas |
| E | Fecha Inicio | Fecha | 01/02/2026 | Formato fecha |
| F | Fecha Fin | Fecha | 30/06/2026 | Debe ser > Fecha Inicio |
| G | # Participantes Proyectado | Número | 50 | > 0 |
| H | # Participantes Real | Número | 45 | ≤ Proyectado |
| I | Presupuesto Curso (Q) | Moneda | 25,000 | > 0 |
| J | Presupuesto Prácticas (Q) | Moneda | 40,000 | > 0 |
| K | Presupuesto Total (Q) | Fórmula | 65,000 | =I2+J2 |
| L | Gastado a la Fecha (Q) | Fórmula | 58,200 | =SUMIF(Estipendios!C:C,A2,Estipendios!H:H) |
| M | Disponible (Q) | Fórmula | 6,800 | =K2-L2 |
| N | % Ejecución | Fórmula | 89% | =L2/K2 |
| O | Donador/Financiador | Texto | Fundación XYZ | - |
| P | Responsable | Desplegable | Eva | Lista de responsables |
| Q | Estado | Desplegable | Activa | Activa/Finalizada/En Espera |
| R | Notas | Texto | - | - |

### Ejemplo de Datos

```
┌──────────────┬─────────────────┬──────┬──────────────┬────────────┬────────────┬───────────┬─────────┬──────────┬─────────────┬───────────┬──────────┬────────────┬──────────┬──────────────┬──────────┬───────────┬────────┐
│ ID Cohorte   │ Nombre Cohorte  │ Año  │ Programa     │ F. Inicio  │ F. Fin     │ # Proyect │ # Real  │ Presup C │ Presup P    │ Pres Total│ Gastado  │ Disponible │ % Ejec   │ Donador      │ Respons  │ Estado    │ Notas  │
├──────────────┼─────────────────┼──────┼──────────────┼────────────┼────────────┼───────────┼─────────┼──────────┼─────────────┼───────────┼──────────┼────────────┼──────────┼──────────────┼──────────┼───────────┼────────┤
│ SAC-I-2026   │ SAC Cohorte I   │ 2026 │ Tecnología   │ 01/02/2026 │ 30/06/2026 │ 50        │ 45      │ 25,000   │ 40,000      │ 65,000    │ 58,200   │ 6,800      │ 89%      │ Fund. XYZ    │ Eva      │ Activa    │        │
│ SAC-II-2026  │ SAC Cohorte II  │ 2026 │ Tecnología   │ 01/03/2026 │ 31/07/2026 │ 50        │ 48      │ 28,000   │ 42,000      │ 70,000    │ 42,000   │ 28,000     │ 60%      │ Fund. ABC    │ Adrian   │ Activa    │        │
│ COMP-I-2026  │ Computación I   │ 2026 │ Tecnología   │ 15/01/2026 │ 15/05/2026 │ 35        │ 30      │ 18,000   │ 30,000      │ 48,000    │ 28,500   │ 19,500     │ 59%      │ USAID        │ Eva      │ Activa    │        │
│ COC-I-2026   │ Cocina I        │ 2026 │ Alim. y Beb. │ 10/01/2026 │ 10/06/2026 │ 40        │ 35      │ 20,000   │ 35,000      │ 55,000    │ 50,050   │ 4,950      │ 91%      │ Fund. XYZ    │ Paola    │ Activa    │ ⚠️     │
│ BAR-I-2026   │ Barismo I       │ 2026 │ Alim. y Beb. │ 01/03/2026 │ 01/07/2026 │ 25        │ 20      │ 15,000   │ 30,000      │ 45,000    │ 18,000   │ 27,000     │ 40%      │ Privado      │ Paola    │ Activa    │        │
│ REP-I-2026   │ Repostería I    │ 2026 │ Alim. y Beb. │ 15/02/2026 │ 15/07/2026 │ 30        │ 30      │ 22,000   │ 30,000      │ 52,000    │ 31,200   │ 20,800     │ 60%      │ Fund. ABC    │ Adrian   │ Activa    │        │
└──────────────┴─────────────────┴──────┴──────────────┴────────────┴────────────┴───────────┴─────────┴──────────┴─────────────┴───────────┴──────────┴────────────┴──────────┴──────────────┴──────────┴───────────┴────────┘
```

### Formato Condicional

- **% Ejecución:**
  - Verde: 0-80%
  - Amarillo: 80-95%
  - Rojo: >95%

---

## HOJA 2: ESTIPENDIOS

### Estructura de Columnas

| Col | Campo | Tipo | Ejemplo | Validación/Fórmula |
|-----|-------|------|---------|-------------------|
| A | ID Pago | Texto | EST-2026-0001 | Auto-generado: ="EST-"&TEXT(C2,"YYYY")&"-"&TEXT(ROW(),"0000") |
| B | Fecha Registro | Fecha/Hora | 12/03/2026 10:30 | Automático: =NOW() |
| C | ID Participante | Texto | IL-001 | Ref a hoja Inscritx/Seleccionadas |
| D | Nombre Completo | Texto | María López García | Auto-llenado desde Inscritx |
| E | Cohorte | Texto | SAC-I-2026 | Desplegable desde Presupuesto Cohortes |
| F | Programa | Texto | Tecnología | Auto-llenado desde cohorte |
| G | Tipo Estipendio | Desplegable | Curso | Curso / Prácticas |
| H | Monto (Q) | Moneda | 500 | > 0, < 2000 |
| I | Fecha Programada | Fecha | 10/03/2026 | Fecha futura |
| J | Fecha Pago Real | Fecha | 12/03/2026 | Puede ser vacío si pendiente |
| K | Estado | Fórmula/Manual | Pagado | =SI(J2<>"","Pagado",SI(I2<HOY(),"Atrasado","Programado")) |
| L | Método Pago | Desplegable | Transferencia | Efectivo/Transferencia/Cheque |
| M | Banco/Cuenta | Texto | BAC / 1234567 | Si método=Transferencia o Cheque |
| N | # Recibo/Transacción | Texto | TRX-9876543 | Obligatorio |
| O | Responsable Aprobó | Desplegable | Eva | Lista de responsables |
| P | Responsable Entregó | Desplegable | Adrian Torres | Lista de responsables |
| Q | URL Foto Firma | URL | https://kobo... | Link de Kobo |
| R | URL Foto Recibo | URL | https://kobo... | Link de Kobo (opcional) |
| S | GPS Ubicación | Texto | 14.634915,-90.506882 | Desde Kobo |
| T | Días Atraso | Fórmula | 2 | =SI(Y(K2<>"Pagado",I2<HOY()),HOY()-I2,0) |
| U | Notas | Texto | - | - |

### Ejemplo de Datos

```
┌──────────────┬─────────────────┬──────────┬────────────────────┬────────────┬────────────┬──────────┬────────┬─────────────┬──────────────┬──────────┬───────────────┬────────────┬─────────────┬────────────┬─────────────┬───────────────┬────────────────┬────────────────┬────────────┬────────┐
│ ID Pago      │ F. Registro     │ ID Part  │ Nombre Completo    │ Cohorte    │ Programa   │ Tipo     │ Monto  │ F. Programa │ F. Pago Real │ Estado   │ Método        │ Banco/Cta  │ # Recibo    │ Aprobó     │ Entregó     │ URL Firma     │ URL Recibo     │ GPS            │ Días Atr   │ Notas  │
├──────────────┼─────────────────┼──────────┼────────────────────┼────────────┼────────────┼──────────┼────────┼─────────────┼──────────────┼──────────┼───────────────┼────────────┼─────────────┼────────────┼─────────────┼───────────────┼────────────────┼────────────────┼────────────┼────────┤
│ EST-2026-001 │ 12/03/26 10:30  │ IL-001   │ María López García │ SAC-I-2026 │ Tecnología │ Curso    │ Q 500  │ 10/03/2026  │ 12/03/2026   │ Pagado   │ Transferencia │ BAC/123456 │ TRX-9876543 │ Eva        │ Adrian      │ https://k...  │ https://k...   │ 14.634,-90.506 │ 0          │        │
│ EST-2026-002 │ 12/03/26 10:35  │ IL-002   │ Ana Pérez Morales  │ SAC-I-2026 │ Tecnología │ Curso    │ Q 500  │ 10/03/2026  │ 12/03/2026   │ Pagado   │ Efectivo      │ -          │ REC-001     │ Eva        │ Eva         │ https://k...  │ -              │ 14.634,-90.506 │ 0          │        │
│ EST-2026-003 │ 11/03/26 14:20  │ IL-001   │ María López García │ SAC-I-2026 │ Tecnología │ Prácticas│ Q 800  │ 11/03/2026  │ 11/03/2026   │ Pagado   │ Transferencia │ BAC/123456 │ TRX-9876544 │ Eva        │ Adrian      │ https://k...  │ https://k...   │ 14.634,-90.506 │ 0          │        │
│ EST-2026-004 │ 08/03/26 09:00  │ IL-003   │ Juana Gómez        │ SAC-I-2026 │ Tecnología │ Curso    │ Q 500  │ 12/03/2026  │ -            │ 🟡 Hoy   │ -             │ -          │ -           │ Eva        │ -           │ -             │ -              │ -              │ 0          │        │
│ EST-2026-005 │ 25/02/26 11:00  │ IL-004   │ Carmen Díaz        │ SAC-I-2026 │ Tecnología │ Prácticas│ Q 800  │ 28/02/2026  │ -            │ 🔴 Atraso│ -             │ -          │ -           │ Eva        │ -           │ -             │ -              │ -              │ 12         │ ⚠️     │
│ EST-2026-006 │ 02/03/26 15:30  │ IL-005   │ Laura Morales      │ SAC-I-2026 │ Tecnología │ Prácticas│ Q 800  │ 05/03/2026  │ -            │ 🔴 Atraso│ -             │ -          │ -           │ Eva        │ -           │ -             │ -              │ -              │ 7          │ ⚠️     │
│ EST-2026-007 │ 10/03/26 08:00  │ IL-006   │ Sofia Ramírez      │ SAC-I-2026 │ Tecnología │ Curso    │ Q 500  │ 13/03/2026  │ -            │ Programado│ -             │ -          │ -           │ Eva        │ -           │ -             │ -              │ -              │ 0          │        │
│ EST-2026-008 │ 10/03/26 08:05  │ IL-007   │ Elena Castro       │ SAC-I-2026 │ Tecnología │ Curso    │ Q 500  │ 13/03/2026  │ -            │ Programado│ -             │ -          │ -           │ Eva        │ -           │ -             │ -              │ -              │ 0          │        │
│ EST-2026-009 │ 12/03/26 09:00  │ IL-001   │ María López García │ COC-I-2026 │ Alim y Beb │ Curso    │ Q 600  │ 15/03/2026  │ -            │ Programado│ -             │ -          │ -           │ Paola      │ -           │ -             │ -              │ -              │ 0          │        │
│ EST-2026-010 │ 12/03/26 09:05  │ IL-008   │ Isabel Vargas      │ COC-I-2026 │ Alim y Beb │ Prácticas│ Q 900  │ 15/03/2026  │ -            │ Programado│ -             │ -          │ -           │ Paola      │ -           │ -             │ -              │ -              │ 0          │        │
└──────────────┴─────────────────┴──────────┴────────────────────┴────────────┴────────────┴──────────┴────────┴─────────────┴──────────────┴──────────┴───────────────┴────────────┴─────────────┴────────────┴─────────────┴───────────────┴────────────────┴────────────────┴────────────┴────────┘
```

### Formato Condicional

- **Estado:**
  - Verde: "Pagado"
  - Amarillo: "🟡 Hoy"
  - Rojo: "🔴 Atrasado"
  - Gris: "Programado"

- **Días Atraso:**
  - Verde: 0
  - Amarillo: 1-7
  - Rojo: >7

---

## HOJA 3: CALENDARIO PAGOS

### Vista Mensual

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  CALENDARIO DE PAGOS - MARZO 2026                                               │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────────┬────────────────────┬──────────┬───────────────┬──────────┬─────────┐
│ Fecha        │ Cohorte            │ # Pagos  │ Monto Total   │ Pagados  │ Estado  │
├──────────────┼────────────────────┼──────────┼───────────────┼──────────┼─────────┤
│ 01/03/2026   │ SAC-I-2026         │ 10       │ Q 5,000       │ 10       │ ✅ 100% │
│ 01/03/2026   │ COC-I-2026         │ 8        │ Q 4,800       │ 8        │ ✅ 100% │
│ 05/03/2026   │ SAC-II-2026        │ 15       │ Q 7,500       │ 15       │ ✅ 100% │
│ 10/03/2026   │ SAC-I-2026         │ 12       │ Q 9,600       │ 10       │ 🟡 83%  │
│ 12/03/2026   │ COMP-I-2026        │ 8        │ Q 4,000       │ 0        │ 🟡 Hoy  │
│ 13/03/2026   │ COC-I-2026         │ 10       │ Q 9,000       │ 0        │ ⏰ Mañana│
│ 15/03/2026   │ BAR-I-2026         │ 15       │ Q 12,000      │ 0        │ ⏰ Prog │
│ 20/03/2026   │ SAC-I-2026         │ 10       │ Q 8,000       │ 0        │ ⏰ Prog │
│ 25/03/2026   │ REP-I-2026         │ 12       │ Q 7,200       │ 0        │ ⏰ Prog │
│ 30/03/2026   │ SAC-II-2026        │ 20       │ Q 16,000      │ 0        │ ⏰ Prog │
├──────────────┼────────────────────┼──────────┼───────────────┼──────────┼─────────┤
│ TOTAL MARZO  │ Todas              │ 120      │ Q 83,100      │ 43       │ 36%     │
└──────────────┴────────────────────┴──────────┴───────────────┴──────────┴─────────┘
```

### Fórmulas Clave

```excel
# Pagos Programados para una Fecha
=COUNTIFS(Estipendios!I:I,"="&A2)

# Monto Total Programado
=SUMIFS(Estipendios!H:H,Estipendios!I:I,"="&A2)

# Pagos Realizados
=COUNTIFS(Estipendios!I:I,"="&A2,Estipendios!K:K,"Pagado")

# % Cumplimiento
=D2/B2
```

---

## HOJA 4: DASHBOARD RESUMEN

### Sección 1: KPIs Globales

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  KPIs GLOBALES - 2026                                                            │
└──────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────┬─────────────────────┬────────────────────────────────┐
│ KPI                     │ Valor               │ Fórmula                        │
├─────────────────────────┼─────────────────────┼────────────────────────────────┤
│ Total Presupuestado     │ Q 500,000           │ =SUM(Presupuesto!K:K)          │
│ Total Gastado           │ Q 285,000           │ =SUMIF(Estipendios!K:K,"Pagado",Estipendios!H:H) │
│ Total Disponible        │ Q 215,000           │ =B2-B3                         │
│ % Ejecución Global      │ 57%                 │ =B3/B2                         │
│ # Cohortes Activas      │ 6                   │ =COUNTIF(Presupuesto!Q:Q,"Activa") │
│ # Participantes Benef.  │ 158                 │ =COUNTA(UNIQUE(Estipendios!C:C)) │
│ Total Pagos Realizados  │ 312                 │ =COUNTIF(Estipendios!K:K,"Pagado") │
│ Promedio por Participante│ Q 1,804            │ =B3/B7                         │
│ Tiempo Promedio Pago    │ 5 días              │ =AVERAGE(Estipendios!J:J-Estipendios!I:I) │
│ Pagos Pendientes        │ 45                  │ =COUNTIF(Estipendios!K:K,"Programado") │
│ Monto Pendiente         │ Q 35,000            │ =SUMIF(Estipendios!K:K,"Programado",Estipendios!H:H) │
│ Pagos Atrasados         │ 8                   │ =COUNTIF(Estipendios!K:K,"*Atrasado*") │
│ Monto Atrasado          │ Q 6,200             │ =SUMIF(Estipendios!K:K,"*Atrasado*",Estipendios!H:H) │
└─────────────────────────┴─────────────────────┴────────────────────────────────┘
```

### Sección 2: Por Cohorte

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  RESUMEN POR COHORTE                                                             │
└──────────────────────────────────────────────────────────────────────────────────┘

┌──────────────┬─────────────┬──────────┬────────────┬─────────┬──────────┬────────┐
│ Cohorte      │ Presupuesto │ Gastado  │ Disponible │ % Ejec  │ # Pagos  │ Estado │
├──────────────┼─────────────┼──────────┼────────────┼─────────┼──────────┼────────┤
│ SAC-I-2026   │ Q 65,000    │ Q 58,200 │ Q 6,800    │ 89%     │ 89       │ 🟡     │
│ SAC-II-2026  │ Q 70,000    │ Q 42,000 │ Q 28,000   │ 60%     │ 75       │ 🟢     │
│ COMP-I-2026  │ Q 48,000    │ Q 28,500 │ Q 19,500   │ 59%     │ 52       │ 🟢     │
│ COC-I-2026   │ Q 55,000    │ Q 50,050 │ Q 4,950    │ 91%     │ 68       │ 🔴     │
│ BAR-I-2026   │ Q 45,000    │ Q 18,000 │ Q 27,000   │ 40%     │ 18       │ 🟢     │
│ REP-I-2026   │ Q 52,000    │ Q 31,200 │ Q 20,800   │ 60%     │ 38       │ 🟢     │
├──────────────┼─────────────┼──────────┼────────────┼─────────┼──────────┼────────┤
│ TOTAL        │ Q 335,000   │ Q 228,000│ Q 107,000  │ 68%     │ 340      │        │
└──────────────┴─────────────┴──────────┴────────────┴─────────┴──────────┴────────┘

Fórmulas:
- Gastado: =SUMIF(Estipendios!E:E,A2,Estipendios!H:H)
- % Ejecución: =C2/B2
- # Pagos: =COUNTIF(Estipendios!E:E,A2)
- Estado: =SI(D2>90%,"🔴",SI(D2>80%,"🟡","🟢"))
```

### Sección 3: Por Tipo

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  DISTRIBUCIÓN POR TIPO DE ESTIPENDIO                                             │
└──────────────────────────────────────────────────────────────────────────────────┘

┌──────────────┬───────────────┬──────────┬──────────────┬──────────────────────┐
│ Tipo         │ Monto Total   │ # Pagos  │ Promedio     │ % del Total          │
├──────────────┼───────────────┼──────────┼──────────────┼──────────────────────┤
│ Curso        │ Q 120,000     │ 180      │ Q 667        │ 42% ████████░░░░░░░  │
│ Prácticas    │ Q 165,000     │ 132      │ Q 1,250      │ 58% ████████████░░░  │
├──────────────┼───────────────┼──────────┼──────────────┼──────────────────────┤
│ TOTAL        │ Q 285,000     │ 312      │ Q 913        │ 100%                 │
└──────────────┴───────────────┴──────────┴──────────────┴──────────────────────┘

Fórmulas:
- Monto: =SUMIF(Estipendios!G:G,"Curso",Estipendios!H:H)
- # Pagos: =COUNTIF(Estipendios!G:G,"Curso")
- Promedio: =B2/C2
- %: =B2/$B$4
```

### Sección 4: Alertas

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│  🚨 ALERTAS Y ACCIONES REQUERIDAS                                                │
└──────────────────────────────────────────────────────────────────────────────────┘

┌──────┬──────────────┬────────────────────────────────────────────────────────────┐
│ Nivel│ Cohorte      │ Descripción                                                │
├──────┼──────────────┼────────────────────────────────────────────────────────────┤
│ 🔴   │ COC-I-2026   │ Presupuesto al 91%, solo Q 4,950 disponibles              │
│ 🔴   │ SAC-I-2026   │ 5 pagos atrasados (hasta 12 días)                         │
│ 🟡   │ SAC-I-2026   │ Presupuesto al 89%, monitorear de cerca                   │
│ 🟡   │ COMP-I-2026  │ Q 15,000 programados próximos 7 días, verificar liquidez  │
└──────┴──────────────┴────────────────────────────────────────────────────────────┘

Fórmula para identificar alertas:
=SI(Presupuesto!N2>0.9, "🔴 Presupuesto crítico",
   SI(Presupuesto!N2>0.8, "🟡 Presupuesto alto", ""))
```

---

## HOJA 5: AUDITORÍA

### Estructura

```
┌──────────────┬────────────┬──────────────┬─────────────┬──────────────┬──────────┬───────────┬────────────┐
│ Fecha/Hora   │ Usuario    │ Acción       │ Hoja        │ Registro ID  │ Campo    │ Valor Ant │ Valor Nuevo│
├──────────────┼────────────┼──────────────┼─────────────┼──────────────┼──────────┼───────────┼────────────┤
│ 12/03 10:30  │ Eva        │ Creado       │ Estipendios │ EST-2026-001 │ -        │ -         │ -          │
│ 12/03 10:35  │ Eva        │ Editado      │ Estipendios │ EST-2026-001 │ Estado   │ Programa. │ Pagado     │
│ 12/03 11:00  │ Adrian     │ Creado       │ Presupuesto │ SAC-III-2026 │ -        │ -         │ -          │
│ 12/03 11:15  │ Sistema    │ Auto-import  │ Estipendios │ EST-2026-010 │ -        │ -         │ -          │
│ 12/03 14:20  │ Paola      │ Eliminado    │ Estipendios │ EST-2026-999 │ -        │ -         │ -          │
└──────────────┴────────────┴──────────────┴─────────────┴──────────────┴──────────┴───────────┴────────────┘
```

### Implementación con Apps Script

```javascript
function registrarAuditoria(accion, hoja, registroID, campo = "", valorAnterior = "", valorNuevo = "") {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const auditSheet = ss.getSheetByName('Auditoría');

  const nuevaFila = [
    new Date(),
    Session.getActiveUser().getEmail(),
    accion,
    hoja,
    registroID,
    campo,
    valorAnterior,
    valorNuevo
  ];

  auditSheet.appendRow(nuevaFila);
}

// Trigger onEdit
function onEdit(e) {
  const range = e.range;
  const sheet = range.getSheet();
  const row = range.getRow();
  const col = range.getColumn();

  // Evitar loop infinito (no auditar cambios en Auditoría)
  if (sheet.getName() === 'Auditoría') return;

  // Obtener ID del registro (asumiendo que está en columna A)
  const registroID = sheet.getRange(row, 1).getValue();
  const campo = sheet.getRange(1, col).getValue(); // Header de columna
  const valorAnterior = e.oldValue || '';
  const valorNuevo = e.value || '';

  registrarAuditoria('Editado', sheet.getName(), registroID, campo, valorAnterior, valorNuevo);
}
```

---

## FORMULARIO KOBO

### Estructura JSON (Simplificada)

```json
{
  "title": "Registro de Estipendios - Inclusión Laboral",
  "settings": {
    "version": "1.0",
    "id_string": "estipendios_registro"
  },
  "content": {
    "survey": [
      {
        "type": "start",
        "name": "start"
      },
      {
        "type": "end",
        "name": "end"
      },
      {
        "type": "today",
        "name": "today"
      },
      {
        "type": "text",
        "name": "id_participante",
        "label": "ID de Participante (escaneado o manual)",
        "required": true,
        "hint": "Escanear código QR o ingresar manualmente (ej: IL-001)"
      },
      {
        "type": "select_one_from_file",
        "name": "participante_details",
        "label": "Detalles de la Participante",
        "appearance": "search('id_participante')",
        "calculation": "pulldata('participantes', 'nombre', 'id', ${id_participante})",
        "note": "Auto-llenado desde base de datos"
      },
      {
        "type": "calculate",
        "name": "nombre_completo",
        "calculation": "pulldata('participantes', 'nombre', 'id', ${id_participante})"
      },
      {
        "type": "calculate",
        "name": "cohorte",
        "calculation": "pulldata('participantes', 'cohorte', 'id', ${id_participante})"
      },
      {
        "type": "calculate",
        "name": "programa",
        "calculation": "pulldata('participantes', 'programa', 'id', ${id_participante})"
      },
      {
        "type": "note",
        "name": "display_participante",
        "label": "Participante: ${nombre_completo}\nCohorte: ${cohorte}\nPrograma: ${programa}"
      },
      {
        "type": "select_one",
        "name": "tipo_estipendio",
        "label": "Tipo de Estipendio",
        "required": true,
        "choices": [
          {"name": "curso", "label": "Curso"},
          {"name": "practicas", "label": "Prácticas"}
        ]
      },
      {
        "type": "decimal",
        "name": "monto",
        "label": "Monto (Q)",
        "required": true,
        "constraint": ". > 0 and . <= 2000",
        "constraint_message": "El monto debe ser entre Q1 y Q2,000"
      },
      {
        "type": "select_one",
        "name": "metodo_pago",
        "label": "Método de Pago",
        "required": true,
        "choices": [
          {"name": "efectivo", "label": "Efectivo"},
          {"name": "transferencia", "label": "Transferencia Bancaria"},
          {"name": "cheque", "label": "Cheque"}
        ]
      },
      {
        "type": "text",
        "name": "banco_cuenta",
        "label": "Banco y Cuenta (si aplica)",
        "relevant": "${metodo_pago} = 'transferencia' or ${metodo_pago} = 'cheque'",
        "required": true
      },
      {
        "type": "text",
        "name": "numero_recibo",
        "label": "Número de Recibo o Transacción",
        "required": true,
        "hint": "Ejemplo: TRX-9876543, REC-001, CHQ-12345"
      },
      {
        "type": "image",
        "name": "foto_firma",
        "label": "Foto de Firma o Recibo Firmado",
        "required": true,
        "hint": "Tomar foto clara de la firma de la participante"
      },
      {
        "type": "image",
        "name": "foto_recibo",
        "label": "Foto del Recibo (opcional)",
        "required": false
      },
      {
        "type": "geopoint",
        "name": "ubicacion",
        "label": "Ubicación (GPS automático)"
      },
      {
        "type": "select_one",
        "name": "responsable_entrega",
        "label": "Responsable que Entrega",
        "required": true,
        "choices": [
          {"name": "eva", "label": "Eva"},
          {"name": "adrian", "label": "Adrian Torres"},
          {"name": "paola", "label": "Paola Ortiz"}
        ]
      },
      {
        "type": "text",
        "name": "notas",
        "label": "Notas Adicionales (opcional)",
        "hint": "Cualquier observación relevante"
      },
      {
        "type": "acknowledge",
        "name": "confirmacion",
        "label": "Confirmo que la información es correcta y el pago fue entregado",
        "required": true
      }
    ]
  }
}
```

### Mapeo Kobo → Google Sheets

```javascript
function mapearDatosKobo(filaKobo) {
  return {
    idPago: generarIDPago(), // Auto-generado
    fechaRegistro: new Date(),
    idParticipante: filaKobo['id_participante'],
    nombreCompleto: filaKobo['nombre_completo'],
    cohorte: filaKobo['cohorte'],
    programa: filaKobo['programa'],
    tipoEstipendio: filaKobo['tipo_estipendio'] === 'curso' ? 'Curso' : 'Prácticas',
    monto: parseFloat(filaKobo['monto']),
    fechaProgramada: new Date(), // O desde otro campo
    fechaPagoReal: new Date(),
    estado: 'Pagado',
    metodoPago: capitalizar(filaKobo['metodo_pago']),
    bancoCuenta: filaKobo['banco_cuenta'] || '',
    numeroRecibo: filaKobo['numero_recibo'],
    responsableAprobo: 'Eva', // Determinar lógica
    responsableEntrego: capitalizar(filaKobo['responsable_entrega']),
    urlFotoFirma: filaKobo['_attachments']?.[0]?.download_url || '',
    urlFotoRecibo: filaKobo['_attachments']?.[1]?.download_url || '',
    gpsUbicacion: filaKobo['ubicacion'],
    diasAtraso: 0,
    notas: filaKobo['notas'] || ''
  };
}
```

---

## EXPORTACIÓN POWER BI

### Estructura Consolidada (Tabla Plana)

```
┌──────────────┬────────────┬─────────────┬──────────────┬──────────┬─────────┬─────────┬────────────┬──────────┬──────────┬──────────┬─────────┬─────────┬──────────┬──────────┐
│ ID Pago      │ Fecha Pago │ Año         │ Mes          │ ID Part  │ Nombre  │ Cohorte │ Programa   │ Tipo     │ Monto    │ Estado   │ Método  │ Respons │ Zona     │ Género   │
├──────────────┼────────────┼─────────────┼──────────────┼──────────┼─────────┼─────────┼────────────┼──────────┼──────────┼──────────┼─────────┼─────────┼──────────┼──────────┤
│ EST-2026-001 │ 12/03/2026 │ 2026        │ Marzo        │ IL-001   │ María L │ SAC-I   │ Tecnología │ Curso    │ 500      │ Pagado   │ Transfer│ Eva     │ Zona 18  │ Mujer    │
│ EST-2026-002 │ 12/03/2026 │ 2026        │ Marzo        │ IL-002   │ Ana P   │ SAC-I   │ Tecnología │ Curso    │ 500      │ Pagado   │ Efectivo│ Eva     │ Zona 7   │ Mujer    │
│ EST-2026-003 │ 11/03/2026 │ 2026        │ Marzo        │ IL-001   │ María L │ SAC-I   │ Tecnología │ Prácticas│ 800      │ Pagado   │ Transfer│ Adrian  │ Zona 18  │ Mujer    │
└──────────────┴────────────┴─────────────┴──────────────┴──────────┴─────────┴─────────┴────────────┴──────────┴──────────┴──────────┴─────────┴─────────┴──────────┴──────────┘

+ Columnas adicionales de participante (Edad, Nivel Educativo, etc.)
+ Columnas adicionales de cohorte (Presupuesto Total, Donador, etc.)
```

### Script de Generación

```javascript
function generarExportParaPowerBI() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Obtener datos de múltiples hojas
  const estipendios = ss.getSheetByName('Estipendios').getDataRange().getValues();
  const participantes = ss.getSheetByName('Inscritx').getDataRange().getValues();
  const cohortes = ss.getSheetByName('Presupuesto Cohortes').getDataRange().getValues();

  // Crear diccionarios para lookups rápidos
  const dictParticipantes = {};
  participantes.slice(1).forEach(row => {
    dictParticipantes[row[0]] = { // row[0] = ID
      nombre: row[1],
      zona: row[10],
      genero: row[8],
      edad: row[3]
      // ... más campos
    };
  });

  const dictCohortes = {};
  cohortes.slice(1).forEach(row => {
    dictCohortes[row[0]] = { // row[0] = ID Cohorte
      nombreCohorte: row[1],
      programa: row[3],
      donador: row[14],
      presupuestoTotal: row[10]
      // ... más campos
    };
  });

  // Consolidar datos
  const datosConsolidados = [
    ['ID Pago', 'Fecha Pago', 'Año', 'Mes', 'ID Participante', 'Nombre',
     'Cohorte', 'Programa', 'Tipo', 'Monto', 'Estado', 'Método', 'Responsable',
     'Zona', 'Género', 'Edad', 'Donador', 'Presupuesto Cohorte']
  ];

  estipendios.slice(1).forEach(row => {
    const idPart = row[2];
    const idCohorte = row[4];
    const fechaPago = row[9];

    const part = dictParticipantes[idPart] || {};
    const cohorte = dictCohortes[idCohorte] || {};

    datosConsolidados.push([
      row[0], // ID Pago
      fechaPago,
      fechaPago ? fechaPago.getFullYear() : '',
      fechaPago ? getMesNombre(fechaPago.getMonth()) : '',
      idPart,
      part.nombre || row[3],
      cohorte.nombreCohorte || idCohorte,
      cohorte.programa || row[5],
      row[6], // Tipo
      row[7], // Monto
      row[10], // Estado
      row[11], // Método
      row[15], // Responsable
      part.zona || '',
      part.genero || '',
      part.edad || '',
      cohorte.donador || '',
      cohorte.presupuestoTotal || 0
    ]);
  });

  // Escribir en hoja temporal
  const exportSheet = ss.insertSheet('EXPORT_PowerBI');
  exportSheet.getRange(1, 1, datosConsolidados.length, datosConsolidados[0].length)
    .setValues(datosConsolidados);

  // Exportar a Excel en Drive
  const folder = DriveApp.getFolderById('ID_CARPETA');
  const fecha = Utilities.formatDate(new Date(), 'GMT-6', 'yyyy-MM-dd');
  const nombreArchivo = `Estipendios_PowerBI_${fecha}.xlsx`;

  const blob = exportSheet.getParent().getBlob();
  const file = folder.createFile(blob).setName(nombreArchivo);

  // Limpiar
  ss.deleteSheet(exportSheet);

  Logger.log('Archivo generado: ' + file.getUrl());
  return file.getUrl();
}

function getMesNombre(mes) {
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return meses[mes];
}
```

---

## FÓRMULAS CLAVE

### 1. Presupuesto Disponible por Cohorte

```excel
=SUMIF(Presupuesto!A:A, "SAC-I-2026", Presupuesto!K:K) -
 SUMIFS(Estipendios!H:H, Estipendios!E:E, "SAC-I-2026", Estipendios!K:K, "Pagado")
```

### 2. Número de Beneficiarias Únicas

```excel
=COUNTA(UNIQUE(FILTER(Estipendios!C:C, Estipendios!K:K="Pagado")))
```

### 3. Promedio de Días entre Programado y Pago Real

```excel
=AVERAGEIF(Estipendios!K:K, "Pagado", Estipendios!J:J - Estipendios!I:I)
```

### 4. Alerta de Presupuesto Crítico

```excel
=SI(
  (Presupuesto!L2 / Presupuesto!K2) > 0.9,
  "🔴 CRÍTICO",
  SI((Presupuesto!L2 / Presupuesto!K2) > 0.8, "🟡 ADVERTENCIA", "🟢 NORMAL")
)
```

### 5. Pagos Atrasados con Número de Días

```excel
=SI(Y(K2<>"Pagado", I2<HOY()), HOY()-I2, 0)
```

### 6. Próximos Pagos en N Días

```excel
=SUMIFS(Estipendios!H:H,
        Estipendios!I:I, ">="&HOY(),
        Estipendios!I:I, "<="&HOY()+7,
        Estipendios!K:K, "Programado")
```

### 7. Tasa de Cumplimiento de Pagos (Mensual)

```excel
=COUNTIFS(Estipendios!I:I, ">="&FECHA(2026,3,1),
          Estipendios!I:I, "<="&FECHA(2026,3,31),
          Estipendios!K:K, "Pagado") /
 COUNTIFS(Estipendios!I:I, ">="&FECHA(2026,3,1),
          Estipendios!I:I, "<="&FECHA(2026,3,31))
```

### 8. Costo Promedio por Graduada

```excel
=SUMIF(Estipendios!E:E, "SAC-I-2026", Estipendios!H:H) /
 COUNTIF(Graduadx!D:D, "SAC-I-2026")
```

### 9. Distribución Curso vs Prácticas (%)

```excel
// % Curso
=SUMIFS(Estipendios!H:H, Estipendios!G:G, "Curso", Estipendios!K:K, "Pagado") /
 SUMIF(Estipendios!K:K, "Pagado", Estipendios!H:H)

// % Prácticas
=SUMIFS(Estipendios!H:H, Estipendios!G:G, "Prácticas", Estipendios!K:K, "Pagado") /
 SUMIF(Estipendios!K:K, "Pagado", Estipendios!H:H)
```

### 10. Proyección de Gastos hasta Final de Año

```excel
// Gasto mensual promedio hasta ahora
=SUMIF(Estipendios!K:K, "Pagado", Estipendios!H:H) /
 (MONTH(HOY()) - 1)

// Proyección anual
=B1 * 12
```

---

## VALIDACIONES DE DATOS

### 1. Desplegables

```javascript
function configurarValidaciones() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hojaEstipendios = ss.getSheetByName('Estipendios');

  // Tipo Estipendio (columna G)
  const rangoTipo = hojaEstipendios.getRange('G2:G1000');
  const reglaTipo = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Curso', 'Prácticas'])
    .setAllowInvalid(false)
    .build();
  rangoTipo.setDataValidation(reglaTipo);

  // Método Pago (columna L)
  const rangoMetodo = hojaEstipendios.getRange('L2:L1000');
  const reglaMetodo = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Efectivo', 'Transferencia', 'Cheque'])
    .setAllowInvalid(false)
    .build();
  rangoMetodo.setDataValidation(reglaMetodo);

  // Responsable (columnas O y P)
  const responsables = ['Eva', 'Adrian Torres', 'Paola Ortiz'];
  const rangoResponsable = hojaEstipendios.getRange('O2:P1000');
  const reglaResponsable = SpreadsheetApp.newDataValidation()
    .requireValueInList(responsables)
    .setAllowInvalid(false)
    .build();
  rangoResponsable.setDataValidation(reglaResponsable);
}
```

### 2. Validación de Montos

```javascript
// En Apps Script, al importar desde Kobo
function validarMonto(monto) {
  if (isNaN(monto) || monto <= 0 || monto > 2000) {
    throw new Error(`Monto inválido: Q${monto}. Debe estar entre Q1 y Q2,000`);
  }
  return parseFloat(monto);
}
```

### 3. Validación de Fechas

```javascript
function validarFechas(fechaProgramada, fechaPagoReal) {
  if (fechaPagoReal && fechaPagoReal < fechaProgramada) {
    Logger.log(`⚠️ Advertencia: Pago realizado antes de la fecha programada`);
    // No bloquear, solo advertir
  }
}
```

---

## RESUMEN

Esta estructura de datos proporciona:

✅ **Trazabilidad completa** de cada pago
✅ **Cálculos automáticos** de todos los KPIs
✅ **Alertas proactivas** de problemas
✅ **Auditoría completa** de cambios
✅ **Integración fácil** con Power BI
✅ **Validaciones** para prevenir errores

**Próximos pasos:**
1. Crear estas hojas en Google Sheets
2. Configurar fórmulas y validaciones
3. Diseñar formulario Kobo
4. Desarrollar scripts de automatización

---

**Documentos relacionados:**
- `PLAN_SISTEMA_ESTIPENDIOS.md` - Plan completo de implementación
- `DASHBOARD_MOCKUPS.md` - Visualización de dashboards
- `PRESENTACION_JEFE.md` - Speech para presentar

---

*Última actualización: Marzo 2026 | Versión: 1.0*
