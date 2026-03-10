# 🔧 SOLUCIÓN AL PROBLEMA DE DUPLICADOS EN COHORTES

## 📋 Problema Identificado

Al enviar personas desde la hoja "Inscritx" a las cohortes, se estaban creando **registros duplicados** en las hojas individuales de cada cohorte.

### Causa raíz

La función `procesarEnvioACohorte()` tenía una **validación de duplicados incompleta**:

```javascript
// ❌ CÓDIGO ANTERIOR (PROBLEMÁTICO)
if (creamosId && creamosId.toString().trim() !== '') {
  // Solo validaba duplicados si existía Creamos ID
  // Si no había Creamos ID, permitía duplicados
}
```

**Problema:** Si una persona no tenía `Creamos ID` o estaba vacío, la validación se omitía completamente, permitiendo que se enviara múltiples veces a la misma cohorte.

---

## ✅ SOLUCIÓN IMPLEMENTADA

Se mejoró la validación para detectar duplicados usando **dos criterios**:

### 1. Validación por Creamos ID (criterio principal)
- Si existe `Creamos ID`, verifica que no haya otro registro con el mismo ID en la cohorte

### 2. Validación por Nombre Completo (criterio secundario/fallback)
- Si no hay `Creamos ID` o como validación adicional
- Compara el nombre completo (ignorando mayúsculas/minúsculas)
- Detecta duplicados incluso sin Creamos ID

### Código actualizado

```javascript
// ✅ CÓDIGO NUEVO (CORREGIDO)
const idxCreamosIdCohorte = colMapCohorte['creamos id'];
const idxNombreCohorte = colMapCohorte['nombre completo'];
const datosCohorte = hojaCohorte.getDataRange().getValues();

for (let i = 1; i < datosCohorte.length; i++) {
  let esDuplicado = false;

  // Verificar por Creamos ID si existe
  if (creamosId && creamosId.toString().trim() !== '' && idxCreamosIdCohorte !== undefined) {
    const idExistente = datosCohorte[i][idxCreamosIdCohorte] ? datosCohorte[i][idxCreamosIdCohorte].toString().trim() : '';
    if (idExistente !== '' && idExistente === creamosId.toString().trim()) {
      esDuplicado = true;
    }
  }

  // Verificar por Nombre Completo (fallback si no hay Creamos ID)
  if (!esDuplicado && nombre && nombre.toString().trim() !== '' && idxNombreCohorte !== undefined) {
    const nombreExistente = datosCohorte[i][idxNombreCohorte] ? datosCohorte[i][idxNombreCohorte].toString().trim().toLowerCase() : '';
    if (nombreExistente !== '' && nombreExistente === nombre.toString().trim().toLowerCase()) {
      esDuplicado = true;
    }
  }

  if (esDuplicado) {
    ss.toast('⚠️ ' + nombre + ' ya está en la cohorte "' + cohorteDestino + '"', 'Duplicado', 4);
    const colEnvio = colMapInscritx['enviar a cohorte'];
    if (colEnvio !== undefined) sheet.getRange(fila, colEnvio + 1).setValue('');
    return; // Detiene el envío
  }
}
```

---

## 🎯 BENEFICIOS DE LA SOLUCIÓN

1. **Previene duplicados en todos los casos**
   - Con Creamos ID: valida por ID
   - Sin Creamos ID: valida por nombre completo
   - Con ambos: valida por ambos criterios

2. **Validación robusta**
   - No importa si falta algún dato
   - Siempre hay un criterio de validación activo
   - Comparación case-insensitive para nombres

3. **Mensaje claro al usuario**
   - Muestra advertencia cuando detecta duplicado
   - Limpia el dropdown automáticamente
   - No permite continuar con el envío

4. **Aplicado en ambos sistemas**
   - `AlimentosBebidas.gs` ✅
   - `tech.gs` ✅

---

## 📝 CÓMO APLICAR LA CORRECCIÓN

### Opción 1: Copiar el código actualizado

1. Abrir el editor de Google Apps Script
2. Buscar la función `procesarEnvioACohorte` (línea ~2254 en AlimentosBebidas.gs)
3. Reemplazar la sección de validación de duplicados con el código nuevo
4. Repetir para `tech.gs`
5. Guardar y probar

### Opción 2: Usar los archivos del repositorio

Los archivos corregidos están disponibles en el branch:
```
claude/add-registration-fields-9lsla
```

Archivos modificados:
- `AlimentosBebidas.gs`
- `tech.gs`

---

## 🧪 PRUEBAS RECOMENDADAS

Después de aplicar la corrección, realizar estas pruebas:

### Prueba 1: Con Creamos ID
1. Seleccionar una persona de "Inscritx" con Creamos ID
2. Enviar a una cohorte
3. Intentar enviar la misma persona nuevamente
4. ✅ Debe mostrar: "⚠️ [Nombre] ya está en la cohorte"

### Prueba 2: Sin Creamos ID
1. Crear un registro sin Creamos ID en "Inscritx"
2. Enviar a una cohorte
3. Intentar enviar la misma persona nuevamente
4. ✅ Debe mostrar: "⚠️ [Nombre] ya está en la cohorte"

### Prueba 3: Nombres con diferente capitalización
1. Enviar "Juan Pérez" a una cohorte
2. Intentar enviar "JUAN PÉREZ" (mayúsculas)
3. ✅ Debe detectarlo como duplicado

---

## 📊 CASOS CUBIERTOS

| Caso | Creamos ID | Nombre | Validación | Resultado |
|------|------------|--------|------------|-----------|
| 1 | ✅ Existe | ✅ Existe | Por ID | ✅ Detecta duplicado |
| 2 | ❌ Vacío | ✅ Existe | Por Nombre | ✅ Detecta duplicado |
| 3 | ✅ Existe | ❌ Vacío | Por ID | ✅ Detecta duplicado |
| 4 | ✅ Diferente | ✅ Igual | Por Nombre | ✅ Detecta duplicado |
| 5 | ✅ Igual | ✅ Diferente | Por ID | ✅ Detecta duplicado |

---

## ⚠️ NOTAS IMPORTANTES

1. **Duplicados existentes:** Esta corrección **previene nuevos duplicados**, pero no elimina duplicados que ya existan en las hojas de cohorte. Si hay duplicados previos, deben eliminarse manualmente.

2. **Nombres idénticos diferentes personas:** Si dos personas diferentes tienen exactamente el mismo nombre y ninguna tiene Creamos ID, el sistema las tratará como duplicados. En estos casos:
   - Asignar un Creamos ID único a cada una
   - O modificar ligeramente uno de los nombres

3. **Rendimiento:** La validación revisa toda la hoja de cohorte. En cohortes muy grandes (>1000 participantes), podría tardar unos segundos.

---

## 🔄 VERSIÓN

**Versión:** 2.2
**Fecha:** 2026-03-10
**Archivos modificados:**
- `AlimentosBebidas.gs` - líneas 2290-2320
- `tech.gs` - líneas 2285-2315

**Commit:** `e6b0332`
**Branch:** `claude/add-registration-fields-9lsla`

---

## 📧 SOPORTE

Si después de aplicar esta corrección siguen apareciendo duplicados:

1. Verificar que el código se copió correctamente
2. Revisar que no haya duplicados previos en las hojas de cohorte
3. Verificar los mensajes en la consola de logs (Ver → Registros)
4. Consultar este documento para entender el comportamiento esperado

---

**Desarrollado por:** Claude AI Assistant
**Fecha de corrección:** 2026-03-10
