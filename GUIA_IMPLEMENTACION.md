# Guia de Implementacion - Sistemas de Inclusion Laboral

Esta guia te ayudara a implementar los dos sistemas de inclusion laboral:
1. **Tecnologia** - SAC, Computacion, etc.
2. **Alimentos y Bebidas** - Cocina, Reposteria, Barismo, etc.

---

## PASO 1: Crear los Google Sheets

### Para Tecnologia:
1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea una nueva hoja de calculo
3. Nombrala: **"Inclusion Laboral - Tecnologia"**

### Para Alimentos y Bebidas:
1. Crea otra nueva hoja de calculo
2. Nombrala: **"Inclusion Laboral - Alimentos y Bebidas"**

---

## PASO 2: Copiar el Codigo

### Para Tecnologia:
1. Abre el archivo `InclusionLaboral.gs` de este repositorio
2. Copia TODO el contenido (Ctrl+A, Ctrl+C)
3. En tu Google Sheet de Tecnologia:
   - Ve a **Extensiones > Apps Script**
   - Elimina cualquier codigo existente
   - Pega el codigo (Ctrl+V)
   - Guarda (Ctrl+S)

### Para Alimentos y Bebidas:
1. Abre el archivo `AlimentosYBebidas.gs` de este repositorio
2. Copia TODO el contenido
3. En tu Google Sheet de Alimentos y Bebidas:
   - Ve a **Extensiones > Apps Script**
   - Pega el codigo
   - Guarda

---

## PASO 3: Instalar el Sistema

En cada Google Sheet:

1. En Apps Script, selecciona la funcion `instalarSistema`
2. Haz clic en **Ejecutar** (boton de play)
3. **Primera vez solamente**: Te pedira autorizar permisos:
   - Clic en "Revisar permisos"
   - Selecciona tu cuenta
   - Clic en "Avanzado"
   - Clic en "Ir a [nombre del proyecto] (no seguro)"
   - Clic en "Permitir"
4. Espera a que termine la instalacion
5. Refresca la hoja (F5)

---

## PASO 4: Verificar la Instalacion

1. Deberas ver el menu:
   - **🎓 Inclusion Laboral** (Tecnologia)
   - **🍽️ Alimentos y Bebidas** (Alimentos)
2. Ve al menu y selecciona **Verificar Instalacion**
3. Debe mostrar todas las hojas creadas y triggers instalados

---

## PASO 5: Configurar Responsables

### Antes de comenzar a usar:

1. Ve al menu > **Gestion de Responsables** > **Agregar Responsable**
2. Agrega los nombres de las personas responsables:
   - Para Tecnologia: Adrian Torres, Paola Ortiz, etc.
   - Para Alimentos: [nombres de los responsables]
3. Repite para cada responsable

---

## PASO 6: Configurar/Crear Cohortes

### Cohortes Predefinidas:

**Tecnologia:**
- SAC Cohorte I (Activa)
- SAC Cohorte II (Planificada)
- Computacion Cohorte I (Planificada)

**Alimentos y Bebidas:**
- Cocina Cohorte I (Activa)
- Cocina Cohorte II (Planificada)
- Reposteria Cohorte I (Planificada)
- Barismo Cohorte I (Planificada)

### Para crear una nueva cohorte:

1. Ve al menu > **Gestion de Cohortes** > **Crear Nueva Cohorte**
2. Sigue los 5 pasos:
   - Nombre (ej: "Cocina Cohorte III")
   - Especialidad
   - Responsable
   - Cupo maximo
   - Estado inicial (Activa o Planificada)

---

## PASO 7: Flujo de Trabajo

### 1. Registrar Persona Interesada

1. Ve a la hoja **Hoja de Interes**
2. Llena los datos en una fila nueva:
   - Creamos ID
   - DPI
   - Nombre Completo
   - Edad
   - Telefono
   - Nivel Educativo (desplegable)
   - Zona (desplegable)
   - Como se entero
   - Programa de Interes (desplegable)
   - Responsable (desplegable)
3. La fecha y numero se generan automaticamente

### 2. Agendar Entrevista

1. En **Hoja de Interes**, cambia el Estado a **"Entrevista agendada"**
2. El sistema crea automaticamente un registro en la hoja **Entrevistas**
3. Ve a **Entrevistas** y completa:
   - Fecha de entrevista
   - Hora

### 3. Registrar Resultado de Entrevista

En la hoja **Entrevistas**, cambia el Estado a:

- **"Realizada - Aprobada"** → La persona pasa a **Seleccionadas**
- **"Realizada - No aprobada"** → La persona va a **No Interesados**
- **"No asistio"** → Puedes reprogramar

### 4. Enviar Participantes a una Cohorte

**Opcion A - Automatico:**
Al aprobar una entrevista, se asigna a la cohorte que seleccionaste

**Opcion B - Manual (varios a la vez):**
1. Menu > **Gestion de Cohortes** > **Enviar Participantes a Cohorte**
2. Selecciona la cohorte destino
3. El sistema muestra todos los aprobados pendientes
4. Confirma el envio

### 5. Registrar Graduacion

1. Ve a **Seleccionadas**
2. Busca la participante
3. Cambia el Estado a **"Graduada"**
4. El sistema la mueve automaticamente a la hoja **Graduadas**

### 6. Registrar Desercion

1. Ve a **Seleccionadas**
2. Cambia el Estado a **"Desercion"**
3. Aparece un dialogo para seleccionar el motivo
4. El sistema la mueve a la hoja **Deserciones**

---

## PASO 8: Configurar Notificaciones por Email

1. Menu > **Configurar Email Notificaciones**
2. Ingresa el email donde quieres recibir notificaciones
3. Menu > **Probar Envio de Email** para verificar

Las notificaciones se envian automaticamente cuando:
- Se aprueba una participante
- Se registra una graduacion
- Se registra una desercion

---

## Estructura de las Hojas

| Hoja | Proposito |
|------|-----------|
| **Hoja de Interes** | Registro inicial de personas interesadas |
| **Entrevistas** | Seguimiento de entrevistas |
| **Seleccionadas** | Lista definitiva por cohorte (participantes activas) |
| **Cohortes** | Gestion y estadisticas de cada cohorte |
| **Asistencias** | Control de asistencia por fecha |
| **Graduadas** | Personas que completaron + seguimiento laboral |
| **Deserciones** | Registro con motivos de desercion |
| **No Interesados** | Personas que declinaron |
| **Reporte** | Dashboard automatico con metricas |
| **Reportes Mensuales** | Historico mensual |

---

## Diferencias entre Tecnologia y Alimentos

| Caracteristica | Tecnologia | Alimentos y Bebidas |
|---------------|------------|---------------------|
| **Color del menu** | Azul 🎓 | Naranja 🍽️ |
| **Cohortes iniciales** | SAC I, SAC II, Computacion I | Cocina I, II, Reposteria I, Barismo I |
| **Campo adicional** | - | Especialidad (cocina, reposteria, barismo) |
| **Estados de seguimiento** | Empleada en tecnologia | Empleada en restaurante, hotel, cafeteria |

---

## Funciones del Menu

### Tecnologia (🎓 Inclusion Laboral)
### Alimentos (🍽️ Alimentos y Bebidas)

| Funcion | Descripcion |
|---------|-------------|
| 🚀 Instalar Sistema | Crea todas las hojas |
| ✅ Verificar Instalacion | Comprueba que todo funcione |
| ➕ Crear Nueva Cohorte | Crea cohorte con wizard de 5 pasos |
| 📝 Ver/Editar Cohortes | Lista cohortes existentes |
| 📊 Estadisticas por Cohorte | Muestra metricas de cada cohorte |
| 👥 Enviar Participantes a Cohorte | Envia aprobados a una cohorte |
| ➕ Agregar Responsable | Agrega nuevo responsable |
| 📝 Ver Responsables | Lista responsables |
| 📊 Actualizar Reportes | Refresca el dashboard |
| 💾 Guardar Reporte Mensual | Guarda snapshot del mes |
| 📧 Configurar Email | Configura notificaciones |
| ✉️ Probar Email | Verifica que funcione |
| ⏰ Instalar Triggers | Instala automatizaciones |
| 🔧 Reparar Validaciones | Repara desplegables |
| 🔧 Reparar Formulas | Repara formulas |
| 🧪 Crear Datos de Prueba | Crea 3 registros de ejemplo |
| 🧹 Limpiar Todos los Datos | Elimina todos los datos |

---

## Soluccion de Problemas

### Los desplegables estan vacios
→ Menu > 🔧 Reparar Validaciones

### Las formulas no calculan
→ Menu > 🔧 Reparar Formulas

### Los cambios automaticos no funcionan
→ Menu > ⏰ Instalar Triggers Automaticos

### El menu no aparece
1. Refresca la pagina (F5)
2. Si no aparece, ve a Apps Script y ejecuta `onOpen`

### Error de permisos
1. Ve a Apps Script
2. Ejecuta `instalarSistema`
3. Autoriza los permisos cuando se solicite

---

## Contacto y Soporte

Si tienes problemas con la implementacion:
1. Revisa esta guia
2. Usa las funciones de reparacion del menu
3. Revisa los logs en Apps Script (Ver > Registros de ejecucion)

---

## Archivos del Repositorio

```
proyecto-inclusion-laboral-/
├── InclusionLaboral.gs      # Sistema para Tecnologia
├── AlimentosYBebidas.gs     # Sistema para Alimentos y Bebidas
├── README.md                # Documentacion general
└── GUIA_IMPLEMENTACION.md   # Esta guia
```
