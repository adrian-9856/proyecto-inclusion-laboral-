# Sistemas de Inclusion Laboral

Sistemas de Google Apps Script para gestionar el proceso de inclusion laboral.

## Dos Programas Disponibles

### 1. Tecnologia (🎓)
- SAC Cohorte I y II
- Computacion Cohorte I
- Otras cohortes configurables

**Archivo:** `InclusionLaboral.gs`

### 2. Alimentos y Bebidas (🍽️)
- Cocina Cohorte I y II
- Reposteria Cohorte I
- Barismo Cohorte I
- Otras cohortes configurables

**Archivo:** `AlimentosYBebidas.gs`

---

## Instalacion Rapida

1. Crea un nuevo Google Sheets
2. Ve a **Extensiones > Apps Script**
3. Copia el codigo del archivo correspondiente:
   - `InclusionLaboral.gs` para Tecnologia
   - `AlimentosYBebidas.gs` para Alimentos y Bebidas
4. Guarda y ejecuta `instalarSistema`
5. Autoriza los permisos
6. Refresca la hoja

**Ver instrucciones completas:** [GUIA_IMPLEMENTACION.md](GUIA_IMPLEMENTACION.md)

---

## Estructura del Sistema

Ambos sistemas tienen la misma estructura de hojas:

| Hoja | Descripcion |
|------|-------------|
| **Hoja de Interes** | Registro inicial de interesados |
| **Entrevistas** | Seguimiento de entrevistas |
| **Seleccionadas** | Participantes activas por cohorte |
| **Cohortes** | Gestion de cohortes |
| **Asistencias** | Control de asistencia |
| **Graduadas** | Graduadas con seguimiento |
| **Deserciones** | Registro de deserciones |
| **No Interesados** | Personas que declinaron |
| **Reporte** | Dashboard automatico |
| **Reportes Mensuales** | Historico |

---

## Flujo de Trabajo

```
HOJA DE INTERES
      ↓
   (Estado: "Entrevista agendada")
      ↓
ENTREVISTAS
      ↓
   (Estado: "Aprobada" / "No aprobada")
      ↓
SELECCIONADAS  ←──────────────────┐
      ↓                           │
   (Participa en cohorte)         │
      ↓                           │
  ┌───┴───┐                       │
  ↓       ↓                       │
GRADUADAS  DESERCIONES            │
                                  │
NO INTERESADOS ←──────────────────┘
```

---

## Funciones Principales

### Gestion de Cohortes
- ➕ **Crear Nueva Cohorte** - Wizard de 5 pasos
- 👥 **Enviar Participantes a Cohorte** - Envio masivo
- 📊 **Estadisticas por Cohorte** - Metricas en tiempo real

### Automatizaciones
- Cambios de estado automaticos
- Movimiento entre hojas automatico
- Reportes actualizados cada hora
- Notificaciones por email

### Datos
- Creamos ID, DPI, Nombre, Edad, Telefono
- Nivel Educativo, Zona
- Deserciones con motivos (desplegable)

---

## Archivos

```
proyecto-inclusion-laboral-/
├── InclusionLaboral.gs      # Sistema Tecnologia
├── AlimentosYBebidas.gs     # Sistema Alimentos y Bebidas
├── README.md                # Este archivo
└── GUIA_IMPLEMENTACION.md   # Guia paso a paso
```

---

## Menu del Sistema

**Tecnologia:** Menu 🎓 Inclusion Laboral
**Alimentos:** Menu 🍽️ Alimentos y Bebidas

| Opcion | Descripcion |
|--------|-------------|
| Instalar Sistema | Crea todas las hojas |
| Crear Nueva Cohorte | Wizard completo |
| Enviar Participantes | Envio masivo a cohorte |
| Agregar Responsable | Nuevo responsable |
| Actualizar Reportes | Refresca dashboard |
| Configurar Email | Notificaciones |
| Reparar Validaciones | Arregla desplegables |

---

## Soporte

Si tienes problemas:
1. Menu > 🔧 Reparar Validaciones
2. Menu > 🔧 Reparar Formulas
3. Menu > ⏰ Instalar Triggers

Ver la [Guia de Implementacion](GUIA_IMPLEMENTACION.md) para instrucciones detalladas.
