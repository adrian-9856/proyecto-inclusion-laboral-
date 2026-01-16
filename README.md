# Sistema de Inclusion Laboral - Area de Tecnologia

Sistema de Google Apps Script para gestionar el proceso de inclusion laboral en programas de tecnologia.

## Descripcion

Este sistema permite gestionar todo el ciclo de vida de participantes en programas de capacitacion tecnologica:

- **SAC Cohorte I y II** - Servicio de Atencion al Cliente
- **Computacion Cohorte I** - Fundamentos de computacion
- **Otras cohortes** - Configurables segun necesidad

## Responsables

- Adrian Torres
- Paola Ortiz

## Estructura del Sistema

### Hojas del Sistema

| Hoja | Descripcion |
|------|-------------|
| **Hoja de Interes** | Registro inicial de personas interesadas |
| **Entrevistas** | Seguimiento de entrevistas programadas |
| **Seleccionadas** | Lista definitiva de participantes por cohorte |
| **Cohortes** | Gestion de cohortes activas y sus estadisticas |
| **Asistencias** | Control de asistencia por cohorte |
| **Graduadas** | Personas que completaron el programa + seguimiento |
| **Deserciones** | Registro de personas que abandonaron |
| **No Interesados** | Personas que declinaron participar |
| **Reporte** | Dashboard con metricas principales |
| **Reportes Mensuales** | Historico de reportes mensuales |

### Datos Principales (Hoja de Interes)

- Creamos ID
- DPI
- Nombre Completo
- Edad
- Telefono
- Nivel Educativo
- Zona
- Programa de Interes
- Responsable
- Estado
- Notas

## Instalacion

### Paso 1: Crear Google Sheets

1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea una nueva hoja de calculo
3. Ponle nombre: "Inclusion Laboral - Area Tecnologia"

### Paso 2: Abrir Apps Script

1. En el menu, ve a **Extensiones** > **Apps Script**
2. Se abrira el editor de codigo

### Paso 3: Copiar el Codigo

1. Elimina cualquier codigo existente en el editor
2. Copia TODO el contenido del archivo `InclusionLaboral.gs`
3. Pega el codigo en el editor
4. Guarda el proyecto (Ctrl+S o Cmd+S)

### Paso 4: Ejecutar la Instalacion

1. En el editor de Apps Script, selecciona la funcion `instalarSistema`
2. Haz clic en el boton **Ejecutar** (triangulo)
3. La primera vez, te pedira autorizar permisos:
   - Haz clic en "Revisar permisos"
   - Selecciona tu cuenta de Google
   - Haz clic en "Avanzado" > "Ir a [nombre del proyecto]"
   - Haz clic en "Permitir"

### Paso 5: Verificar Instalacion

1. Refresca la hoja de calculo (F5)
2. Debera aparecer el menu **🎓 Inclusion Laboral**
3. Ve al menu y selecciona **Verificar Instalacion**

## Uso del Sistema

### Flujo de Trabajo

```
1. HOJA DE INTERES
   ↓ (Estado: "Entrevista agendada")
2. ENTREVISTAS
   ↓ (Estado: "Realizada - Aprobada")
3. SELECCIONADAS
   ↓ (Estado: "Graduada" o "Desercion")
4. GRADUADAS / DESERCIONES
```

### Registrar Nueva Persona Interesada

1. Ve a la hoja **Hoja de Interes**
2. Llena los datos en una nueva fila:
   - Creamos ID
   - DPI
   - Nombre Completo
   - Edad
   - Telefono
   - Nivel Educativo (desplegable)
   - Zona (desplegable)
   - Como se entero
   - Programa Interes (desplegable)
   - Responsable (desplegable)
3. La fecha y numero se generan automaticamente

### Agendar Entrevista

1. En **Hoja de Interes**, cambia el Estado a "Entrevista agendada"
2. El sistema crea automaticamente un registro en **Entrevistas**
3. Ve a **Entrevistas** y completa fecha y hora

### Aprobar/Rechazar Entrevista

1. En **Entrevistas**, cambia el Estado a:
   - "Realizada - Aprobada" → Se mueve a **Seleccionadas**
   - "Realizada - No aprobada" → Se mueve a **No Interesados**

### Registrar Graduacion

1. En **Seleccionadas**, cambia el Estado a "Graduada"
2. El sistema mueve automaticamente a **Graduadas**
3. Se envia notificacion por email

### Registrar Desercion

1. En **Seleccionadas**, cambia el Estado a "Desercion"
2. Aparece un dialogo para seleccionar el motivo
3. El sistema mueve a **Deserciones**
4. Se envia notificacion por email

## Configuracion

### Configurar Emails

1. Menu **🎓 Inclusion Laboral** > **📧 Configurar Email Notificaciones**
2. Ingresa el email donde quieres recibir notificaciones

### Configurar Emails de Responsables

1. Menu > **👥 Configurar Emails Responsables**
2. Ingresa el email de cada responsable

### Agregar Nueva Cohorte

1. Menu > **📋 Gestion de Cohortes** > **➕ Agregar Nueva Cohorte**
2. Ingresa el nombre de la nueva cohorte
3. Las validaciones se actualizan automaticamente

## Menu Principal

| Opcion | Descripcion |
|--------|-------------|
| 🚀 Instalar Sistema | Crea todas las hojas y configuraciones |
| ✅ Verificar Instalacion | Comprueba que todo este correcto |
| 📋 Gestion de Cohortes | Agregar, ver y estadisticas de cohortes |
| 📊 Actualizar Reportes | Actualiza el dashboard manualmente |
| 💾 Guardar Reporte Mensual | Guarda snapshot mensual |
| 📧 Configurar Email | Configura email de notificaciones |
| 👥 Configurar Emails Responsables | Emails de Adrian y Paola |
| ✉️ Probar Envio de Email | Verifica que funcionen los emails |
| ⏰ Instalar Triggers | Instala automatizaciones |
| 🔧 Reparar Validaciones | Repara desplegables |
| 🔧 Reparar Formulas | Repara formulas automaticas |
| 🧪 Crear Datos de Prueba | Crea 3 registros de ejemplo |
| 🧹 Limpiar Todos los Datos | Elimina todos los datos |

## Cohortes Disponibles

| Cohorte | Area | Estado |
|---------|------|--------|
| SAC Cohorte I | Tecnologia | Activa |
| SAC Cohorte II | Tecnologia | Planificada |
| Computacion Cohorte I | Tecnologia | Planificada |
| Por definir | Tecnologia | Planificada |

## Validaciones (Desplegables)

### Niveles Educativos
- Primaria incompleta/completa
- Basicos incompletos/completos
- Diversificado incompleto/completo
- Universitario incompleto/completo
- Tecnico
- Otro

### Zonas
- Zona 1 a Zona 25
- Mixco, Villa Nueva, San Miguel Petapa
- Villa Canales, Santa Catarina Pinula
- Y mas municipios de Guatemala

### Motivos de Desercion
- Otras prioridades
- Horario laboral
- Problemas familiares
- Migracion
- Problemas de salud
- Consiguio empleo
- Problemas de transporte
- Y mas...

## Soporte

Si tienes problemas:

1. **Triggers no funcionan**: Menu > ⏰ Instalar Triggers
2. **Desplegables vacios**: Menu > 🔧 Reparar Validaciones
3. **Formulas no calculan**: Menu > 🔧 Reparar Formulas
4. **Verificar estado**: Menu > ✅ Verificar Instalacion

## Notas Tecnicas

- El sistema usa Google Apps Script
- Los triggers se ejecutan automaticamente al editar
- Los reportes se actualizan cada hora
- Los emails requieren permisos de Gmail

---

Desarrollado para el Area de Tecnologia - Programa de Inclusion Laboral
