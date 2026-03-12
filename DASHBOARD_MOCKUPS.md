# 📊 MOCKUPS DE DASHBOARDS POWER BI
## Visualización del Sistema de Estipendios

---

## 📌 CONTENIDO

1. [Dashboard Ejecutivo](#dashboard-1-ejecutivo) - Para Jefatura/Dirección
2. [Dashboard Operativo](#dashboard-2-operativo) - Para Coordinadores
3. [Dashboard Donadores](#dashboard-3-donadores) - Para Reportes Externos
4. [Elementos Comunes](#elementos-comunes)
5. [Paleta de Colores](#paleta-de-colores)

---

## DASHBOARD 1: EJECUTIVO
**Para**: Jefatura, Dirección, Gerencia
**Propósito**: Vista rápida de métricas clave y estado general
**Actualización**: Cada hora (automático)

### Layout Visual

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  🎓 SISTEMA DE ESTIPENDIOS - INCLUSIÓN LABORAL          [⟳ Última act: Hoy 10:15 AM] │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│  RESUMEN GENERAL - 2026                                        [Filtros: ▼ Año]  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┬──────────────────┬──────────────────┬──────────────────────┐
│  💰 PRESUPUESTO  │  💸 GASTADO      │  💵 DISPONIBLE   │  📊 EJECUCIÓN        │
│                  │                  │                  │                      │
│   Q 500,000      │   Q 285,000      │   Q 215,000      │      57%             │
│                  │                  │                  │                      │
│   ▲ vs mes ant.  │   ▲ +Q 45,000    │   ▼ -Q 45,000    │   ▲ +8%              │
└──────────────────┴──────────────────┴──────────────────┴──────────────────────┘

┌──────────────────┬──────────────────┬──────────────────┬──────────────────────┐
│  👥 BENEFICIADAS │  📝 TOTAL PAGOS  │  ⏱️ TIEMPO PAGO   │  🔔 ALERTAS          │
│                  │                  │                  │                      │
│      158         │      312         │    5 días        │       2              │
│                  │                  │                  │                      │
│   personas       │   realizados     │   promedio       │   🔴 Ver detalles    │
└──────────────────┴──────────────────┴──────────────────┴──────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│  ESTADO POR COHORTE                                                             │
│                                                                                 │
│  Cohorte          Presupuesto    Gastado      Disponible   % Ejec    Estado    │
│  ═══════════════════════════════════════════════════════════════════════════    │
│  🔴 Cocina I      Q 55,000      Q 50,050      Q 4,950       91%      ⚠️         │
│  🟡 SAC I         Q 65,000      Q 58,200      Q 6,800       89%      ⚠️         │
│  🟢 SAC II        Q 70,000      Q 42,000      Q 28,000      60%      ✓          │
│  🟢 Computación I Q 48,000      Q 28,500      Q 19,500      59%      ✓          │
│  🟢 Barismo I     Q 45,000      Q 18,000      Q 27,000      40%      ✓          │
│  🟢 Repostería I  Q 52,000      Q 31,200      Q 20,800      60%      ✓          │
│                                                                                 │
│  [Ver todas las cohortes →]                                                     │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────┬───────────────────────────────────────┐
│  GASTO MENSUAL - 2026                   │   DISTRIBUCIÓN POR TIPO               │
│                                         │                                       │
│   Q                                     │          CURSO: 42%                   │
│   80K │                                 │        ██████████░░░░░░░░░            │
│   60K │    ▄▄                           │                                       │
│   40K │ ▄▄ ██ ▄▄ ▄▄ ▄▄ ▄▄               │      PRÁCTICAS: 58%                   │
│   20K │ ██ ██ ██ ██ ██ ██               │        ██████████████░░░              │
│    0  └──────────────────               │                                       │
│       ENE FEB MAR ABR MAY JUN           │   Q 120,000     Q 165,000             │
└─────────────────────────────────────────┴───────────────────────────────────────┘

┌─────────────────────────────────────────┬───────────────────────────────────────┐
│  TOP 5 COHORTES - EFICIENCIA            │   PRÓXIMOS PAGOS (7 DÍAS)             │
│  (Costo por graduada)                   │                                       │
│                                         │   📅 Hoy (12 Mar)                     │
│  1. SAC II          Q 1,850 ✓           │   • SAC I: 12 pagos (Q 9,600)        │
│  2. Computación I   Q 1,900 ✓           │                                       │
│  3. Barismo I       Q 2,100 ✓           │   📅 Mañana (13 Mar)                  │
│  4. Repostería I    Q 2,200 ✓           │   • Cocina I: 8 pagos (Q 6,400)      │
│  5. SAC I           Q 2,450 ✓           │                                       │
│                                         │   📅 15 Mar                           │
│  Promedio: Q 2,100                      │   • Barismo I: 15 pagos (Q 12,000)   │
│                                         │                                       │
│                                         │   TOTAL: Q 28,000                     │
└─────────────────────────────────────────┴───────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│  🚨 ALERTAS Y ACCIONES REQUERIDAS                                               │
│                                                                                 │
│  🔴 CRÍTICO (2)                                                                 │
│  • Cocina I: Presupuesto al 91%, solo Q 4,950 disponibles                      │
│  • SAC I: 5 pagos atrasados (> 10 días)                                        │
│                                                                                 │
│  🟡 ADVERTENCIA (1)                                                             │
│  • Computación I: Programados Q 15,000 en próximos 7 días, verificar liquidez  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### KPIs Calculados Automáticamente

| KPI | Fórmula | Fuente de Datos |
|-----|---------|-----------------|
| Presupuesto Total | SUMA de todos los presupuestos activos | Hoja "Presupuesto Cohortes" |
| Gastado | SUMA de pagos con estado "Pagado" | Hoja "Estipendios" |
| Disponible | Presupuesto Total - Gastado | Calculado |
| % Ejecución | (Gastado / Presupuesto) × 100 | Calculado |
| # Beneficiadas | COUNT DISTINCT de ID Participante | Hoja "Estipendios" |
| Total Pagos | COUNT de pagos realizados | Hoja "Estipendios" |
| Tiempo Pago | AVERAGE(Fecha Real - Fecha Programada) | Hoja "Estipendios" |
| # Alertas | COUNT de cohortes con % > 80% o pagos atrasados | Calculado |

### Interactividad

**Filtros disponibles:**
- 📅 Año (2026, 2025, 2024, Todos)
- 🎓 Programa (Tecnología, Alimentos y Bebidas, Todos)
- 👤 Responsable (Eva, Adrian, Paola, Todos)

**Acciones al hacer clic:**
- En "ALERTAS": Abre lista detallada de alertas con opciones de acción
- En una cohorte: Navega a Dashboard Operativo filtrado para esa cohorte
- En "Próximos Pagos": Muestra calendario completo
- En gráficos: Muestra tooltip con detalles

---

## DASHBOARD 2: OPERATIVO
**Para**: Coordinadores, Personal Operativo
**Propósito**: Gestión día a día, detalles por cohorte
**Actualización**: Cada hora (automático)

### Layout Visual

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  🔧 DASHBOARD OPERATIVO - ESTIPENDIOS                                           │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│  FILTROS                                                                        │
│  Cohorte: [SAC Cohorte I ▼]  Año: [2026 ▼]  Estado: [Todos ▼]  Tipo: [Todos ▼] │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────┬──────────────────────────────────────────────┐
│  RESUMEN: SAC COHORTE I          │   CALENDARIO MENSUAL - MARZO 2026            │
│                                  │                                              │
│  Presupuesto:  Q 65,000          │   L   M   M   J   V   S   D                  │
│  Gastado:      Q 58,200 (89%)    │                  1   2   3   4               │
│  Disponible:   Q 6,800           │   5   6   7   8   9  10  11                  │
│                                  │  🔴  🟢  🟢  🔴     🔴  🟢                   │
│  Progreso: ████████████████░░    │  12  13  14  15  16  17  18                  │
│                                  │  🟡  🔴     🟢     🔴                        │
│  📊 Participantes: 45            │  19  20  21  22  23  24  25                  │
│  💰 Pagos realizados: 89         │      🟢         🟢                           │
│  ⏱️ Tiempo promedio: 4 días      │  26  27  28  29  30  31                      │
│  ⚠️ Pagos atrasados: 5           │                  🔴                          │
│                                  │                                              │
│                                  │  🔴 Atrasado  🟡 Hoy  🟢 Programado          │
└──────────────────────────────────┴──────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│  TABLA DETALLADA DE PAGOS                                    [📥 Exportar Excel]│
│                                                                                 │
│  🔍 Buscar: [___________]                                     Pág 1 de 4        │
│                                                                                 │
│  ID Pago  │ Fecha    │ Nombre          │ Tipo      │ Monto   │ Estado  │ Días  │
│  ════════════════════════════════════════════════════════════════════════════   │
│  EST-001  │ 10 Mar   │ María López     │ Curso     │ Q 500   │ ✓ Pagado│   -2  │
│  EST-002  │ 10 Mar   │ Ana Pérez       │ Curso     │ Q 500   │ ✓ Pagado│   0   │
│  EST-003  │ 11 Mar   │ Juana Gómez     │ Prácticas │ Q 800   │ ✓ Pagado│   0   │
│  EST-004  │ 12 Mar   │ Rosa Hernández  │ Curso     │ Q 500   │ 🟡 Hoy  │   0   │
│  EST-005  │ 28 Feb   │ Carmen Díaz     │ Prácticas │ Q 800   │ 🔴 Atras│  +12  │
│  EST-006  │ 05 Mar   │ Laura Morales   │ Prácticas │ Q 800   │ 🔴 Atras│   +7  │
│  EST-007  │ 13 Mar   │ Sofia Ramírez   │ Curso     │ Q 500   │ Programd│   -   │
│  EST-008  │ 13 Mar   │ Elena Castro    │ Curso     │ Q 500   │ Programd│   -   │
│  EST-009  │ 15 Mar   │ Marta Flores    │ Prácticas │ Q 800   │ Programd│   -   │
│  EST-010  │ 15 Mar   │ Isabel Vargas   │ Prácticas │ Q 800   │ Programd│   -   │
│                                                                                 │
│  ◄ Anterior  [1] 2 3 4  Siguiente ►                       Mostrando 10 de 89   │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────┬───────────────────────────────────────┐
│  DISTRIBUCIÓN CURSO VS PRÁCTICAS        │   TENDENCIA SEMANAL                   │
│                                         │                                       │
│           CURSO                         │   Pagos por semana                    │
│        ████████░░                       │   25│    ▄▄                            │
│        Q 22,000 (38%)                   │   20│ ▄▄ ██ ▄▄                         │
│        44 pagos                         │   15│ ██ ██ ██ ▄▄                      │
│                                         │   10│ ██ ██ ██ ██ ▄▄                   │
│        PRÁCTICAS                        │    5│ ██ ██ ██ ██ ██                   │
│        ██████████████                   │    0└──────────────                    │
│        Q 36,200 (62%)                   │      S1 S2 S3 S4 S5                    │
│        45 pagos                         │      Marzo 2026                        │
└─────────────────────────────────────────┴───────────────────────────────────────┘

┌─────────────────────────────────────────┬───────────────────────────────────────┐
│  PAGOS POR RESPONSABLE                  │   MÉTODO DE PAGO                      │
│                                         │                                       │
│  Eva              █████████░ 45 pagos   │   Efectivo         60%                │
│  Adrian Torres    ████████░░ 32 pagos   │   ████████████████                    │
│  Paola Ortiz      ████░░░░░ 12 pagos   │                                       │
│                                         │   Transferencia    35%                │
│                   Total: 89 pagos       │   █████████████                       │
│                                         │                                       │
│                                         │   Cheque           5%                 │
│                                         │   ███                                 │
└─────────────────────────────────────────┴───────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│  ⚠️ ACCIONES REQUERIDAS - SAC COHORTE I                                         │
│                                                                                 │
│  🔴 5 pagos atrasados                                                           │
│  • Carmen Díaz: 12 días atraso (Q 800) - Prácticas                             │
│  • Laura Morales: 7 días atraso (Q 800) - Prácticas                            │
│  • [Ver todos los atrasados]                                                    │
│                                                                                 │
│  🟡 12 pagos programados próximos 7 días (Q 9,600)                              │
│  • Verificar disponibilidad de fondos                                           │
│                                                                                 │
│  ⚠️ Presupuesto al 89% - Solo Q 6,800 disponibles                               │
│  • 15 participantes aún no reciben estipendio de prácticas (Q 12,000 necesarios)│
│  • ⚠️ INSUFICIENTE - Solicitar extensión presupuestaria                         │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Funcionalidades Especiales

**1. Búsqueda y filtros avanzados**
- Buscar por nombre, ID, rango de fechas
- Filtrar por múltiples criterios simultáneos
- Guardar filtros favoritos

**2. Exportación**
- Excel: tabla completa con filtros aplicados
- PDF: reporte formateado para imprimir
- CSV: para procesamiento adicional

**3. Drill-down**
- Clic en una participante → Ver historial completo de pagos
- Clic en un pago → Ver detalles (foto firma, recibo, GPS, etc.)
- Clic en responsable → Ver todos sus pagos

**4. Alertas configurables**
- Configurar umbrales personalizados
- Notificaciones por email automáticas
- Snooze de alertas

---

## DASHBOARD 3: DONADORES
**Para**: Donadores, Financiadores, Stakeholders Externos
**Propósito**: Demostrar impacto social y transparencia
**Actualización**: Diaria (automático)

### Layout Visual

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│           🌟 PROGRAMA DE INCLUSIÓN LABORAL                                      │
│              Reporte de Estipendios 2026                                        │
│                                                                                 │
│           "Empoderando mujeres a través de la educación"                        │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│  NUESTRO IMPACTO EN NÚMEROS                                                     │
└─────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────┬────────────────────┬────────────────────┬─────────────────┐
│  💰 INVERSIÓN      │  👥 BENEFICIADAS   │  🎓 GRADUADAS      │  💼 EMPLEADAS   │
│                    │                    │                    │                 │
│   Q 285,000        │      158           │      127           │      98         │
│                    │                    │                    │                 │
│   invertidos       │   mujeres          │   (80%)            │   (77%)         │
└────────────────────┴────────────────────┴────────────────────┴─────────────────┘

┌────────────────────┬────────────────────┬────────────────────┬─────────────────┐
│  📊 ROI SOCIAL     │  💵 COSTO/GRADUDA  │  ⏱️ RETENCIÓN      │  🌍 ALCANCE     │
│                    │                    │                    │                 │
│      77%           │    Q 2,244         │      92%           │   12 zonas      │
│                    │                    │                    │                 │
│   empleabilidad    │   promedio         │   de asistencia    │   Ciudad de Gto │
└────────────────────┴────────────────────┴────────────────────┴─────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│  USO DE FONDOS - TRANSPARENCIA TOTAL                                            │
│                                                                                 │
│  ┌─────────────────────────────────────┬──────────────────────────────────────┐│
│  │ Estipendios Curso         42%       │         Q 120,000                    ││
│  │ ████████████████████                │                                      ││
│  │                                     │  • Alimentación durante curso        ││
│  │ Estipendios Prácticas     58%       │  • Transporte                        ││
│  │ █████████████████████████████       │  • Materiales personales             ││
│  │                                     │         Q 165,000                    ││
│  │                                     │                                      ││
│  │ TOTAL INVERTIDO                     │  • Apoyo durante prácticas           ││
│  │ ████████████████████████████████    │  • Gastos de movilidad               ││
│  │                                     │                                      ││
│  └─────────────────────────────────────┴──────────────────────────────────────┘│
│                                                                                 │
│  ✓ 100% de fondos destinados directamente a beneficiarias                      │
│  ✓ 0% gastos administrativos (cubiertos por otras fuentes)                     │
│  ✓ Auditoría completa disponible con trazabilidad de cada pago                 │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│  EVOLUCIÓN DEL PROGRAMA 2024-2026                                               │
│                                                                                 │
│   Beneficiadas                          Inversión (Q miles)                     │
│                                                                                 │
│   200│                      ███         300│                      ███           │
│   150│         ███          ███         200│         ███          ███           │
│   100│  ███    ███          ███         100│  ███    ███          ███           │
│    50│  ███    ███          ███          50│  ███    ███          ███           │
│     0└─────────────────────────           0└─────────────────────────           │
│      2024   2025   2026                    2024   2025   2026                   │
│       78    145    158                      120    245    285                   │
│                                                                                 │
│   ▲ +103% crecimiento                   ▲ +138% incremento inversión            │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│  IMPACTO POR PROGRAMA                                                           │
│                                                                                 │
│  Programa              Beneficiadas   Invertido    Graduadas   Empleadas       │
│  ════════════════════════════════════════════════════════════════════════       │
│  🎓 Tecnología                                                                  │
│    • SAC                    45        Q 65,000       38 (84%)    32 (84%)      │
│    • Computación            30        Q 48,000       25 (83%)    20 (80%)      │
│    • Marketing Digital      25        Q 42,000       20 (80%)    15 (75%)      │
│                                                                                 │
│  🍽️ Alimentos y Bebidas                                                        │
│    • Cocina                 35        Q 55,000       28 (80%)    22 (79%)      │
│    • Repostería             15        Q 45,000       11 (73%)     7 (64%)      │
│    • Barismo                 8        Q 30,000        5 (63%)     2 (40%)      │
│                                                                                 │
│  TOTAL                     158       Q 285,000      127 (80%)    98 (77%)      │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│  🗺️ ALCANCE GEOGRÁFICO                                                         │
│                                                                                 │
│  [Mapa de Ciudad de Guatemala con pins en las zonas]                           │
│                                                                                 │
│  Zonas con mayor cobertura:                                                     │
│  1. Zona 18: 28 beneficiarias (18%)                                             │
│  2. Zona 7:  22 beneficiarias (14%)                                             │
│  3. Mixco:   20 beneficiarias (13%)                                             │
│  4. Zona 12: 18 beneficiarias (11%)                                             │
│  5. Zona 1:  15 beneficiarias (9%)                                              │
│                                                                                 │
│  Total: 12 zonas y municipios del área metropolitana                            │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│  📖 HISTORIAS DE ÉXITO                                                          │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ 👩 MARÍA LÓPEZ - SAC Cohorte I                                          │   │
│  │                                                                         │   │
│  │ "El estipendio me permitió asistir al curso sin preocuparme por el     │   │
│  │ transporte y la comida. Ahora trabajo como desarrolladora junior        │   │
│  │ ganando Q4,500 mensuales. ¡Mi vida cambió completamente!"              │   │
│  │                                                                         │   │
│  │ Recibió: Q 1,800 en estipendios | Graduada: Feb 2026 | Empleada: Mar 26│   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ 👩 ANA PÉREZ - Cocina Cohorte I                                        │   │
│  │                                                                         │   │
│  │ "Gracias al apoyo económico pude dedicarme 100% al curso. Hoy soy      │   │
│  │ sous chef en un restaurante y ayudo a mantener a mis tres hijos."      │   │
│  │                                                                         │   │
│  │ Recibió: Q 2,200 en estipendios | Graduada: Ene 2026 | Empleada: Feb 26│   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  [Ver más historias →]                                                          │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│  💡 EL IMPACTO DE TU DONACIÓN                                                   │
│                                                                                 │
│  Con cada Q 2,200 invertidos en estipendios:                                    │
│                                                                                 │
│  ✓ 1 mujer puede completar todo el programa (curso + prácticas)                │
│  ✓ 80% de probabilidad de graduación exitosa                                   │
│  ✓ 77% de probabilidad de conseguir empleo formal                              │
│  ✓ Salario promedio post-programa: Q 3,500/mes                                 │
│  ✓ ROI social en primer año: Q 42,000 en salarios generados                    │
│                                                                                 │
│  MULTIPLICADOR: Cada Q1 invertido genera Q19 en ingresos primer año            │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│  📊 COMPARATIVA CON OTRAS INTERVENCIONES                                        │
│                                                                                 │
│  Programa                    Costo/Persona    Tasa Empleo    ROI Social        │
│  ═════════════════════════════════════════════════════════════════════════      │
│  🏆 Nuestro Programa          Q 2,200           77%            19x             │
│  Programa A (referencia)      Q 3,500           65%            12x             │
│  Programa B (referencia)      Q 2,800           58%            10x             │
│  Promedio Nacional            Q 3,200           55%             8x             │
│                                                                                 │
│  ✅ Somos 24% más costo-eficientes que el promedio                              │
│  ✅ 40% mayor tasa de empleabilidad que promedio nacional                       │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│  🎯 METAS 2026                                                                  │
│                                                                                 │
│  Beneficiarias:     158 / 200  ████████████████░░░░  79%                       │
│  Graduadas:         127 / 160  ████████████████░░░░  79%                       │
│  Empleadas:          98 / 120  ████████████████░░░░  82%                       │
│  Presupuesto:   285K / 500K    ███████████░░░░░░░░░  57%                       │
│                                                                                 │
│  ✓ En buen camino para cumplir todas las metas del año                         │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│  📞 CONTACTO Y MÁS INFORMACIÓN                                                  │
│                                                                                 │
│  Coordinación del Programa:                                                     │
│  📧 Email: inclusion@organizacion.org                                           │
│  📱 Teléfono: +502 1234-5678                                                    │
│  🌐 Web: www.organizacion.org/inclusion-laboral                                 │
│                                                                                 │
│  [Ver reporte completo PDF] [Descargar datos Excel] [Agendar presentación]     │
│                                                                                 │
│  Última actualización: 12 de Marzo 2026, 10:15 AM                              │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Elementos Diferenciadores

**1. Narrativa de impacto**
- Enfoque en historias humanas, no solo números
- Visualización del ROI social
- Comparativas con benchmarks

**2. Transparencia radical**
- 100% de fondos trazables
- Desglose completo de uso de fondos
- Acceso a datos exportables

**3. Profesionalismo**
- Diseño limpio y corporativo
- Exportable a PDF de alta calidad
- Listo para presentaciones a junta directiva

---

## ELEMENTOS COMUNES

### Barra Superior (Todas las dashboards)
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ [Logo]  Dashboard: [Ejecutivo ▼]       👤 Usuario: Adrian      [⚙️ Config]  [?] │
│                                                                                 │
│ ⟳ Última actualización: Hoy 10:15 AM   |   Próxima: 11:15 AM   |   🟢 Sistema OK│
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Footer (Todas las dashboards)
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ Fuente de datos: Google Sheets | Actualización: Automática cada hora           │
│ © 2026 Programa de Inclusión Laboral | [Ayuda] [Reportar problema] [Feedback]  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Leyenda de Estados
```
🔴 Crítico / Atrasado   Requiere acción inmediata
🟡 Advertencia / Hoy    Requiere atención
🟢 Normal / Programado  Sin problemas
⚪ Completado / Pagado  Finalizado exitosamente
```

---

## PALETA DE COLORES

### Colores Principales
```
PRIMARIO:   #2E7D32 (Verde oscuro) - Éxito, positivo, graduadas
SECUNDARIO: #1565C0 (Azul oscuro)  - Información, datos
ACENTO:     #F57C00 (Naranja)      - Alertas, atención
```

### Colores de Estado
```
CRÍTICO:    #D32F2F (Rojo)         - Errores, atrasados, > 90% presupuesto
ADVERTENCIA:#FBC02D (Amarillo)     - Warnings, 80-90% presupuesto
ÉXITO:      #388E3C (Verde)        - Completado, dentro de rango
NEUTRAL:    #757575 (Gris)         - Pendiente, programado
```

### Colores de Gráficos
```
CURSO:      #42A5F5 (Azul claro)
PRÁCTICAS:  #66BB6A (Verde claro)
COHORTE 1:  #EF5350 (Rojo claro)
COHORTE 2:  #AB47BC (Morado)
COHORTE 3:  #FFA726 (Naranja claro)
COHORTE 4:  #26A69A (Turquesa)
```

### Fondos
```
FONDO PRINCIPAL:      #FFFFFF (Blanco)
FONDO SECUNDARIO:     #F5F5F5 (Gris muy claro)
FONDO CARDS:          #FFFFFF con sombra suave
FONDO HEADERS:        #ECEFF1 (Gris azulado claro)
```

---

## CONSIDERACIONES DE DISEÑO

### Responsive
- Dashboards adaptables a diferentes resoluciones
- Versión móvil simplificada para consultas rápidas
- Priorizar KPIs principales en pantallas pequeñas

### Accesibilidad
- Contraste mínimo WCAG AA
- Textos legibles (mínimo 12pt)
- No depender solo de colores (usar íconos también)
- Alternativas textuales para gráficos

### Performance
- Carga rápida (< 3 segundos)
- Actualización incremental (no recargar todo)
- Optimizar consultas de datos

### Exportación
- PDF: Mantener formato y colores
- Excel: Incluir datos raw + formatos
- PowerPoint: Slides individuales por sección

---

## ROADMAP DE MEJORAS FUTURAS

### Fase 2 (Opcional - Post-Lanzamiento)

**1. Dashboard Móvil**
- App complementaria o PWA
- Notificaciones push de alertas
- Escaneo QR para registro rápido

**2. Inteligencia Artificial**
- Predicción de deserción basada en patrones de pagos
- Recomendaciones automáticas de presupuesto
- Detección de anomalías

**3. Integración Bancaria**
- Conexión con bancos para verificar transferencias
- Conciliación automática
- Pagos directos desde el sistema

**4. Dashboard de Participantes**
- Portal para que beneficiarias vean su historial
- Solicitud digital de estipendios
- Confirmación automática de recibo

**5. Análisis Avanzado**
- Correlación estipendios ↔ graduación
- Análisis de tendencias multi-año
- Segmentación por vulnerabilidad

---

## ANEXO: TOOLTIPS Y AYUDA CONTEXTUAL

### Tooltips en KPIs

**Presupuesto Total**
```
💡 ¿Qué es esto?
Suma de todos los presupuestos asignados a cohortes activas en el período seleccionado.

📊 Cómo se calcula:
SUMA(Presupuesto Curso + Presupuesto Prácticas) de todas las cohortes activas

✓ Rango esperado:
Varía según número de cohortes. Este año: Q 450K - Q 550K
```

**% Ejecución**
```
💡 ¿Qué es esto?
Porcentaje del presupuesto total que ya se ha gastado.

📊 Cómo se calcula:
(Total Gastado / Total Presupuestado) × 100

✓ Rangos de interpretación:
• 0-50%: Normal inicio de programa
• 50-80%: Ejecución saludable
• 80-95%: Advertencia, monitorear de cerca
• >95%: Crítico, fondos por agotarse
```

**Costo por Graduada**
```
💡 ¿Qué es esto?
Inversión promedio en estipendios por cada participante que completa el programa exitosamente.

📊 Cómo se calcula:
Total Invertido en Estipendios / # de Graduadas

✓ Benchmark:
• Excelente: < Q 2,000
• Bueno: Q 2,000 - Q 2,500
• Aceptable: Q 2,500 - Q 3,000
• Revisar: > Q 3,000
```

---

## RESUMEN

Estos 3 dashboards cubren las necesidades de todos los stakeholders:

1. **Ejecutivo**: Vista rápida para toma de decisiones
2. **Operativo**: Herramienta de trabajo diario
3. **Donadores**: Demostración de impacto y transparencia

Todos se alimentan de la misma fuente de datos (Google Sheets) y se actualizan automáticamente, garantizando consistencia y ahorrando tiempo.

---

**¿Listo para implementar?** Ver `PLAN_SISTEMA_ESTIPENDIOS.md` para el plan completo.

*Última actualización: Marzo 2026 | Versión: 1.0*
