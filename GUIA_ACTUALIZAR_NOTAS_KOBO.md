# 🔄 Guía: Actualizar Notas desde Kobo

## 📋 ¿Qué hace esta función?

La nueva función **"Actualizar Notas desde Kobo"** te permite actualizar la columna "Notas" (M) de todos los registros existentes en la "Hoja de Interés" con los comentarios/observaciones de Kobo, **sin tener que borrar nada ni reimportar todo**.

## ✨ ¿Para qué sirve?

Esta función es útil cuando:
- ✅ Ya tienes datos importados en tu sistema
- ✅ Se corrigió el mapeo de las notas de Kobo (como en la corrección de marzo 2026)
- ✅ Quieres aplicar las correcciones a los datos existentes
- ✅ **No quieres** desinstalar y reinstalar el sistema
- ✅ **No quieres** borrar y reimportar todos los datos

## 🎯 ¿Qué hace exactamente?

1. **Descarga** los datos actuales desde Kobo
2. **Busca** cada registro existente en tu "Hoja de Interés"
3. **Actualiza** solo la columna M (Notas) con los comentarios de Kobo
4. **Mantiene** todo lo demás intacto (fecha, estado, responsable, etc.)

## 📝 Cómo usar

### Paso 1: Abrir el menú

1. Abre tu Google Sheet del sistema
2. Busca en el menú superior:
   - **💻 Tecnología** (para el sistema de Tecnología)
   - **🍔 Alimentos y Bebidas** (para el sistema de Alimentos y Bebidas)

### Paso 2: Ejecutar la actualización

1. Haz clic en el menú correspondiente
2. Selecciona: **📝 Actualizar Notas desde Kobo**
3. Aparecerá un mensaje de confirmación explicando qué se va a hacer
4. Haz clic en **"Sí"** para continuar

### Paso 3: Esperar

- El sistema descargará los datos de Kobo
- Comparará cada registro
- Actualizará las notas donde sea necesario
- Mostrará un resumen al finalizar

### Paso 4: Revisar el resultado

Al terminar, verás un mensaje con el resumen:

```
✅ ACTUALIZACIÓN DE NOTAS FINALIZADA

🔄 Registros actualizados: 25
✓ Sin cambios: 10
⚠ Sin coincidencia en Kobo: 5
```

**Explicación:**
- **Registros actualizados:** Cuántos registros se actualizaron con nuevas notas
- **Sin cambios:** Registros que ya tenían las notas correctas
- **Sin coincidencia en Kobo:** Registros que están en tu hoja pero no en Kobo (posiblemente agregados manualmente o eliminados de Kobo)

## ✅ Ventajas

1. **No pierdes datos:** Todos tus datos existentes se mantienen
2. **Solo actualiza lo necesario:** Solo cambia la columna de Notas
3. **Rápido:** No necesitas borrar y reimportar todo
4. **Seguro:** Pide confirmación antes de hacer cambios
5. **Informativo:** Te muestra exactamente qué se actualizó

## ⚠️ Notas importantes

### ¿Qué columnas se actualizan?

- ✅ **Columna M (Notas):** Se actualiza con comentarios de Kobo
- ❌ **Todas las demás columnas:** NO se modifican

### ¿Cómo identifica los registros?

La función identifica los registros usando:
1. **CREAMOS ID** (columna C) - método preferido
2. **DPI** (columna D) - método alternativo

Si un registro no tiene ni CREAMOS ID ni DPI, no se podrá actualizar.

### ¿Qué pasa con registros nuevos?

Esta función **NO importa** registros nuevos. Solo actualiza los que ya existen.

Para importar registros nuevos, usa:
- **📥 Importar Datos Nuevos (cada 10 min)**

### ¿Se puede deshacer?

No hay un botón de "deshacer", pero puedes:
1. Ejecutar la función nuevamente para volver a sincronizar con Kobo
2. Usar el historial de versiones de Google Sheets (Archivo → Historial de versiones)

## 🔄 Casos de uso

### Caso 1: Corrección de mapeo de notas

**Situación:** Se corrigió el código para que las notas muestren los comentarios de Kobo en lugar de los programas seleccionados.

**Solución:**
1. Actualizar el código en Apps Script
2. Ejecutar **📝 Actualizar Notas desde Kobo**
3. Todas las notas se corrigen sin borrar nada

### Caso 2: Actualizar comentarios editados en Kobo

**Situación:** Una persona actualizó sus comentarios en el formulario de Kobo.

**Solución:**
1. Ejecutar **📝 Actualizar Notas desde Kobo**
2. Los comentarios actualizados se reflejan en tu hoja

### Caso 3: Verificar que las notas están correctas

**Situación:** Quieres asegurarte de que todos los registros tienen las notas correctas de Kobo.

**Solución:**
1. Ejecutar **📝 Actualizar Notas desde Kobo**
2. El resumen te dirá cuántos registros se actualizaron y cuántos ya estaban correctos

## 🆚 Comparación con otras opciones

| Método | Ventajas | Desventajas |
|--------|----------|-------------|
| **📝 Actualizar Notas desde Kobo** | ✅ Rápido<br>✅ No borra datos<br>✅ Solo actualiza lo necesario | ⚠️ Solo actualiza columna Notas<br>⚠️ No importa registros nuevos |
| **📥 Importar Datos Nuevos** | ✅ Importa registros nuevos<br>✅ Datos completos | ⚠️ No actualiza registros existentes<br>⚠️ No corrige datos viejos |
| **Borrar y reimportar todo** | ✅ Todo queda actualizado | ❌ Pierdes estados manuales<br>❌ Pierdes responsables asignados<br>❌ Muy lento |

## 📊 Ejemplo antes y después

### ANTES de ejecutar "Actualizar Notas desde Kobo"

| CREAMOS ID | Nombre | Notas | Servicio/Formación |
|------------|--------|-------|-------------------|
| ABC123 | Juan Pérez | Gastronomía, Barismo | Gastronomía, Barismo |
| DEF456 | María López | Marketing Digital | Marketing Digital |

❌ **Problema:** Las notas contienen los programas en lugar de los comentarios

### DESPUÉS de ejecutar "Actualizar Notas desde Kobo"

| CREAMOS ID | Nombre | Notas | Servicio/Formación |
|------------|--------|-------|-------------------|
| ABC123 | Juan Pérez | Me interesa aprender cocina profesional | Gastronomía, Barismo |
| DEF456 | María López | Disponibilidad de lunes a viernes | Marketing Digital |

✅ **Resultado:** Las notas ahora contienen los comentarios correctos de Kobo

## 🛠️ Solución de problemas

### Problema 1: "No hay datos en Kobo para actualizar"

**Causa:** No se pudo conectar con Kobo o no hay datos.

**Solución:**
1. Verifica tu conexión a internet
2. Verifica que la URL de Kobo esté configurada correctamente
3. Intenta nuevamente en unos minutos

### Problema 2: "Sin coincidencia en Kobo" para muchos registros

**Causa:** Los registros en tu hoja no tienen CREAMOS ID o DPI, o fueron eliminados de Kobo.

**Solución:**
1. Verifica que los registros tengan CREAMOS ID o DPI
2. Si fueron agregados manualmente, agrega el CREAMOS ID manualmente
3. Si fueron eliminados de Kobo, las notas no se pueden actualizar desde Kobo

### Problema 3: Las notas no cambian

**Causa:** Las notas en Kobo son exactamente iguales a las que ya tienes.

**Solución:**
- Esto es normal. El sistema no hace cambios innecesarios si las notas ya son correctas.

## 📞 Soporte

Si después de ejecutar esta función:
- ❌ Las notas no se actualizan correctamente
- ❌ Aparecen errores
- ❌ Se pierden datos

**Verifica:**
1. ✅ El código se actualizó correctamente en Apps Script
2. ✅ La URL de Kobo está configurada
3. ✅ Los registros tienen CREAMOS ID o DPI
4. ✅ Los comentarios existen en el formulario de Kobo

---

**Versión:** 1.0
**Fecha:** 2026-03-11
**Archivos modificados:**
- `tech.gs` - Línea ~3827
- `AlimentosBebidas.gs` - Línea ~3834

**Funciones agregadas:**
- `actualizarNotasDesdeKoboTech()` - Para Tecnología
- `actualizarNotasDesdeKoboAB()` - Para Alimentos y Bebidas

**Desarrollado por:** Claude AI Assistant
