# 🔍 Instrucciones: Diagnosticar por qué no se importan datos de Kobo

## ⚡ Solución Rápida (3 pasos)

### Paso 1: Actualizar el Código
1. Abre tu Google Sheet
2. Ve a: **Extensiones → Apps Script**
3. Selecciona el archivo `Código.gs` o similar
4. Copia y pega el contenido actualizado de:
   - `tech.gs` (para Tecnología)
   - `AlimentosBebidas.gs` (para Alimentos)
5. **Guarda** (Ctrl+S o Cmd+S)
6. **Cierra** el editor de Apps Script
7. **Recarga** el Google Sheet (F5)

### Paso 2: Usar la Función de Debug
1. En el Google Sheet, ve al menú: **📋 Referencias de Programas**
2. Clic en: **🔍 Ver Datos de Kobo (DEBUG)**
3. Espera unos segundos mientras descarga

### Paso 3: Revisar los Resultados
Se creará una nueva hoja llamada **"DEBUG - Datos Kobo"** con:
- Todos los datos de Kobo (tal como vienen del servidor)
- Información de cuántos registros hay
- Análisis automático de qué áreas coinciden con el filtro

---

## 📊 Interpretando los Resultados

### Escenario 1: "No hay datos en el formulario de Kobo"
**Significado**: El formulario de Kobo está completamente vacío.

**Solución**:
1. Ve a KoboToolbox
2. Verifica que haya respuestas en el formulario
3. Si no hay respuestas, no hay nada que importar

---

### Escenario 2: Se muestran datos pero la hoja tiene "❌ NO COINCIDE"
**Significado**: Hay datos en Kobo pero no coinciden con el filtro.

**Ejemplo**:
```
Áreas encontradas:
  Programación    ❌ NO COINCIDE
  Tech            ❌ NO COINCIDE
```

**Solución A: Importar sin filtro**
1. Ve al menú: **📋 Referencias de Programas**
2. Clic en: **📥 Importar TODAS (sin filtro)**
3. Revisa manualmente y elimina lo que no corresponda

**Solución B: Ajustar el filtro**
Si ves que los datos SÍ deberían importarse (ej: "Programación" es parte de Tecnología):

1. Apps Script → Editar el archivo
2. Busca:
   ```javascript
   const CONFIG_REFERENCIAS = {
     FILTRO_PROGRAMA: 'tecnolog'
   ```
3. Cámbialo por:
   ```javascript
   const CONFIG_REFERENCIAS = {
     FILTRO_PROGRAMA: 'programacion'  // o el texto que veas en Kobo
   ```
4. Guarda y recarga el Sheet

---

### Escenario 3: Se muestran datos con "✅ COINCIDE"
**Significado**: Hay datos que coinciden con el filtro.

**Acción**:
1. Ve al menú: **📋 Referencias de Programas**
2. Clic en: **Importar (Solo Nuevos)**

Si aún dice "No se encontraron registros nuevos", significa que **todos ya fueron importados antes**.

Para verificar:
1. Ve a la hoja **"Referencias de Programas"**
2. Busca en la columna **"_uuid"** si ya existen esos registros
3. El sistema NO importa duplicados

---

### Escenario 4: Error de conexión
**Mensaje**: "No se pudo conectar a KoboToolbox"

**Causas posibles**:
1. URL incorrecta
2. Sin permisos de acceso
3. Formulario eliminado o privado

**Solución**:
1. Verifica la URL en el código:
   ```javascript
   const CONFIG_REFERENCIAS = {
     KOBO_URL: 'https://kf.kobotoolbox.org/...'
   ```
2. Copia esa URL y ábrela en tu navegador
3. Debes poder descargar un archivo CSV
4. Si no puedes, la URL es incorrecta o no tienes permisos

---

## 🔧 Ajustes Avanzados

### Cambiar el Filtro del Programa

**Para Tecnología** (archivo `tech.gs`):
```javascript
const CONFIG_REFERENCIAS = {
  KOBO_URL: 'https://kf.kobotoolbox.org/api/v2/assets/afuD8C8AzoLfd4o5ksTWUw/export-settings/es52swrnjWcz8NnhY5Wyng3/data.csv',
  NOMBRE_HOJA: 'Referencias de Programas',
  HOJA_DESTINO: 'Entrevistas',
  OPCION_ENVIAR: 'Se realizó hoja de interés',
  FILTRO_PROGRAMA: 'tecnolog'  // ← CAMBIAR AQUÍ
};
```

Valores comunes:
- `'tecnolog'` → busca "tecnología", "tecnologia", "Tecnológico"
- `'programacion'` → busca "programación", "programacion"
- `'tech'` → busca "tech", "technology"

**Para Alimentos y Bebidas** (archivo `AlimentosBebidas.gs`):
```javascript
const CONFIG_REFERENCIAS = {
  FILTRO_PROGRAMA: 'alimentos'  // ← CAMBIAR AQUÍ
};
```

Valores comunes:
- `'alimentos'` → busca "alimentos", "Alimentos y Bebidas"
- `'bebidas'` → busca "bebidas"
- `'cocina'` → busca "cocina", "Cocina"

---

## ✅ Checklist de Verificación

Usa este checklist para diagnosticar el problema:

- [ ] Actualicé el código en Apps Script
- [ ] Recargué el Google Sheet (F5)
- [ ] Veo el nuevo menú "🔍 Ver Datos de Kobo (DEBUG)"
- [ ] Ejecuté la función de debug
- [ ] Se creó la hoja "DEBUG - Datos Kobo"
- [ ] Veo datos en esa hoja (o un mensaje de error claro)
- [ ] Revisé la columna "Áreas encontradas"
- [ ] Identifiqué si dice "✅ COINCIDE" o "❌ NO COINCIDE"
- [ ] Tomé acción según el escenario correspondiente

---

## 🚨 Problemas Comunes

### Problema: No veo el menú "📋 Referencias de Programas"
**Solución**:
1. Apps Script → Ejecuta manualmente la función `onOpen`
2. Recarga el Sheet (F5)

### Problema: El menú no tiene la opción "🔍 Ver Datos de Kobo (DEBUG)"
**Solución**:
1. Verifica que hayas copiado el código actualizado
2. Guarda el código (Ctrl+S)
3. Ejecuta manualmente `setupMenuReferencias` en Apps Script
4. Recarga el Sheet (F5)

### Problema: La hoja "DEBUG - Datos Kobo" aparece vacía
**Solución**:
1. Revisa si hubo un mensaje de error
2. Verifica la URL de Kobo
3. Prueba copiar la URL y abrirla directamente en el navegador

### Problema: Dice "Solo Encabezados" pero sé que hay datos en Kobo
**Causas posibles**:
1. La URL apunta a un formulario diferente
2. Los datos fueron eliminados en Kobo
3. La URL de exportación cambió

**Solución**:
1. Ve a KoboToolbox
2. Abre el formulario correcto
3. Ve a: Datos → Descargar → CSV
4. Copia la URL de descarga
5. Actualiza `KOBO_URL` en el código

---

## 📞 Preguntas Frecuentes

### ¿La hoja "DEBUG - Datos Kobo" se actualiza automáticamente?
No. Debes ejecutar manualmente "🔍 Ver Datos de Kobo (DEBUG)" cada vez que quieras ver los datos actuales.

### ¿Puedo borrar la hoja "DEBUG - Datos Kobo"?
Sí. Es una hoja temporal solo para diagnóstico. Se recreará cada vez que ejecutes la función.

### ¿Afecta esto mis datos existentes?
No. La función solo lee datos de Kobo y crea una hoja temporal. No modifica ninguna hoja existente.

### ¿Por qué algunos datos tienen "✅ COINCIDE" pero no se importan?
Porque ya fueron importados anteriormente. El sistema no importa duplicados (verifica por UUID).

---

## 📚 Siguiente Paso

Una vez que identifiques el problema usando esta función:

1. **Si hay datos nuevos**: Usa "Importar (Solo Nuevos)"
2. **Si están filtrados**: Usa "📥 Importar TODAS (sin filtro)" o ajusta el filtro
3. **Si no hay datos**: Verifica el formulario de Kobo

Para más información, consulta: `SOLUCION_REFERENCIAS_NO_IMPORTAN.md`

---

**Fecha**: 2026-03-08
**Versión**: 1.0
**Ayuda**: Si después de estos pasos aún tienes problemas, comparte la hoja "DEBUG - Datos Kobo" para más ayuda.
