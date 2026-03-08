# 💾 Guía Completa de Backup y Reinstalación

## 🎯 Objetivo
Crear una copia de seguridad completa de tu Google Sheet para poder:
1. Reinstalar el sistema desde cero
2. Recuperar solo los datos que llevas trabajados
3. No perder información

---

## 📦 Método 1: BACKUP MANUAL (Más Simple)

### Paso 1: Hacer copia del Google Sheet actual
1. Abre tu Google Sheet de Inclusión Laboral
2. **Archivo → Hacer una copia**
3. Nombre sugerido: `BACKUP - Inclusion Laboral - [Fecha]`
4. Guardar en la misma carpeta

### Paso 2: Identificar qué datos CONSERVAR
Solo necesitas copiar los datos de estas hojas (SIN fórmulas ni código):

#### ✅ Hojas con DATOS a conservar:
- **Hoja de Interés**: Tus registros de personas interesadas
- **Entrevistas**: Entrevistas realizadas
- **Inscritx**: Personas inscritas
- **Cohortes**: Lista de cohortes creadas
- **Graduadx**: Personas graduadas
- **Retiradx**: Registros de retiros
- **No Inscritx**: Personas no inscritas
- **Referencias IL**: Referencias externas
- **Referencias de Programas**: Referencias internas
- **[Hojas de Cohortes Individuales]**: Ej: "SAC Cohorte I"

#### ❌ Hojas que NO necesitas copiar (se regeneran):
- **Reporte**: Se calcula automáticamente
- **Reportes Mensuales**: Se calculan automáticamente
- **Lista Definitiva**: Se genera desde Entrevistas
- **Detalle Entrevistas**: Se genera automáticamente

### Paso 3: Exportar datos en formato CSV (Opcional pero recomendado)
Para cada hoja importante:
1. Selecciona la pestaña
2. **Archivo → Descargar → Valores separados por comas (.csv)**
3. Guarda con nombre descriptivo: `HojaInteres_backup_2024-03-08.csv`

---

## 🔄 Método 2: REINSTALACIÓN DESDE CERO

### Opción A: Empezar con nuevo Google Sheet + Copiar datos

#### 1. Crear nuevo Google Sheet vacío
```
1. Ve a sheets.google.com
2. Crea una nueva hoja en blanco
3. Nómbrala: "Inclusión Laboral - [Tu Programa]"
```

#### 2. Instalar el código
```
1. Extensiones → Apps Script
2. Borra el código que viene por defecto
3. Pega el código de:
   - tech.gs (para Tecnología)
   - AlimentosBebidas.gs (para Alimentos y Bebidas)
4. Guarda (Ctrl+S)
```

#### 3. Instalar el sistema
```
1. Ejecuta manualmente la función: instalarSistema
2. Autoriza los permisos cuando lo pida
3. Espera a que termine (crea todas las hojas)
4. Refresca el Google Sheet
```

#### 4. Copiar datos desde el backup
Abre tu backup y el nuevo Sheet lado a lado:
```
Para cada hoja CON DATOS:
1. Abre la hoja en el BACKUP
2. Selecciona TODO (excepto la fila de encabezados)
3. Copiar (Ctrl+C)
4. Ve al NUEVO Sheet, misma hoja
5. Haz clic en la celda A2 (primera fila de datos)
6. Pegar (Ctrl+V)
```

### Opción B: Usar Google Apps Script para migración automática

Te voy a crear un script que hace la migración automática...

---

## 🛡️ Método 3: BACKUP AUTOMÁTICO CON SCRIPT

### Script de Backup Automático
Este script crea una copia automática cada semana:

```javascript
// Agregar al final del código de Apps Script
function crearBackupAutomatico() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const fecha = Utilities.formatDate(new Date(), 'America/Guatemala', 'yyyy-MM-dd');
  const nombreBackup = ss.getName() + ' - BACKUP - ' + fecha;

  // Crear copia
  const backup = ss.copy(nombreBackup);

  // Mover a carpeta padre (misma ubicación)
  const carpetaPadre = DriveApp.getFileById(ss.getId()).getParents().next();
  DriveApp.getFileById(backup.getId()).moveTo(carpetaPadre);

  Logger.log('✅ Backup creado: ' + nombreBackup);
  SpreadsheetApp.getActiveSpreadsheet().toast('✅ Backup creado exitosamente', 'Backup', 5);
}

// Configurar backup automático semanal
function configurarBackupSemanal() {
  // Eliminar triggers antiguos
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(t => {
    if (t.getHandlerFunction() === 'crearBackupAutomatico') {
      ScriptApp.deleteTrigger(t);
    }
  });

  // Crear nuevo trigger: Todos los lunes a las 6 AM
  ScriptApp.newTrigger('crearBackupAutomatico')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(6)
    .create();

  SpreadsheetApp.getActiveSpreadsheet().toast('✅ Backup automático cada lunes activado', 'Configurado', 5);
}
```

---

## 📋 CHECKLIST: Antes de Reinstalar

- [ ] Hice copia del Google Sheet completo
- [ ] Exporté las hojas principales en CSV
- [ ] Guardé el URL del Sheet original
- [ ] Tengo acceso al código (tech.gs o AlimentosBebidas.gs)
- [ ] Identifiqué qué hojas tienen datos importantes
- [ ] Verifiqué que la copia funciona (puedo abrirla)

---

## 🚨 Solución de Problemas

### Problema: "El botón Referencias IL no funciona"
**Solución**:
1. Ve al menú del programa (🎓 o 🍽️)
2. Clic en "🔧 Reparar Validaciones"
3. Luego "⏰ Instalar Triggers"

### Problema: "Perdí datos después de reinstalar"
**Solución**:
1. Abre tu BACKUP
2. Copia manualmente los datos hoja por hoja
3. Pega en el nuevo sistema (solo datos, fila 2 en adelante)

### Problema: "El menú no aparece"
**Solución**:
1. Apps Script → Ejecutar: onOpen
2. Refresca el Google Sheet (F5)

---

## 📞 Contacto
Si tienes problemas con el backup o la reinstalación, revisa los archivos:
- `README.md` - Información general
- `GUIA_IMPLEMENTACION.md` - Instalación detallada
- `EXPLICACION_REFERENCIAS.md` - Sobre las hojas de referencias
