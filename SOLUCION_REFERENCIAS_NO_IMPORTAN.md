# ✅ Solución: Referencias no importan desde Kobo

## 🔴 Problema
Aparece el mensaje: **"Todo está al día. No se encontraron registros nuevos en Kobo para este programa."**

## 🎯 Solución Implementada

Se agregaron **2 nuevas funciones** al menú "📋 Referencias de Programas" para diagnosticar y resolver el problema:

---

## 🔍 1. Diagnóstico: Ver Datos Kobo

### ¿Para qué sirve?
Esta función te muestra:
- Total de registros en Kobo
- Cuántos registros coinciden con el filtro del programa (Tecnología/Alimentos)
- Cuántos ya fueron importados
- Cuántos son nuevos y están disponibles
- **Las áreas/programas que existen en Kobo**

### ¿Cómo usarla?
1. Ve al menú: **📋 Referencias de Programas**
2. Clic en: **🔍 Diagnóstico: Ver Datos Kobo**
3. Espera a que descargue los datos
4. Verás un resumen con:
   ```
   📊 DIAGNÓSTICO COMPLETO

   📋 Total de registros en Kobo: XX

   ❌ Inválidos (sin UUID/nombre): X
   🔍 Filtrados (no son "tecnolog"): X
   ✅ Ya importados anteriormente: X
   🆕 Nuevos disponibles para importar: X

   📌 Áreas encontradas en Kobo:
     • Tecnología
     • Alimentos y Bebidas
     • Otros...
   ```

### ¿Qué hacer con los resultados?

#### Caso 1: "Nuevos disponibles: 0"
**Significado**: Todos los datos ya fueron importados antes.
**Acción**: No hay nada que hacer, todo está al día.

#### Caso 2: "Filtrados: XX"
**Significado**: Hay registros en Kobo pero no coinciden con el filtro.
**Ejemplo**:
- Tecnología filtra por: `"tecnolog"`
- Alimentos filtra por: `"alimentos"`

**Posibles causas**:
1. Los datos en Kobo tienen nombres diferentes (ej: "Programación", "Tech", "Tecnología - Programación")
2. El formulario de Kobo tiene un error y no guarda correctamente el área

**Acción**:
- Si ves áreas que deberían importarse, usa la opción **"📥 Importar TODAS (sin filtro)"**
- O ajusta el filtro en el código (ver sección "Ajustar Filtro" más abajo)

#### Caso 3: "Inválidos: XX"
**Significado**: Hay registros en Kobo sin UUID o sin nombre.
**Acción**: Revisa el formulario de Kobo y verifica que todos los campos obligatorios estén completos.

---

## 📥 2. Importar TODAS (sin filtro)

### ¿Para qué sirve?
Importa **TODOS** los registros de Kobo, sin filtrar por programa.

⚠️ **PRECAUCIÓN**: Esto puede importar referencias de TODOS los programas (Tecnología, Alimentos, etc.)

### ¿Cuándo usarla?
- Cuando el diagnóstico muestra que hay registros pero están siendo filtrados
- Cuando quieres ver TODOS los datos de Kobo para verificar qué hay
- Para debug/pruebas

### ¿Cómo usarla?
1. Ve al menú: **📋 Referencias de Programas**
2. Clic en: **📥 Importar TODAS (sin filtro)**
3. Confirma la acción
4. Espera a que importe los datos

### Después de importar
Una vez importadas, puedes:
1. Revisar manualmente qué registros se importaron
2. Eliminar los que no corresponden al programa
3. Ajustar el filtro para futuras importaciones (ver sección siguiente)

---

## 🔧 3. Ajustar el Filtro (Opcional)

Si descubres que los datos en Kobo tienen un nombre diferente al esperado:

### Para Tecnología
El filtro actual busca: `"tecnolog"` (sin acento, para que coincida con "tecnología" o "tecnologia")

Si tu formulario usa otro nombre (ej: "programación", "tech", "tecnología - programación"):

**Opción A: Cambiar el filtro en el código**
1. Apps Script → Editar `tech.gs`
2. Busca:
   ```javascript
   const CONFIG_REFERENCIAS = {
     FILTRO_PROGRAMA: 'tecnolog'
   ```
3. Cámbialo por:
   ```javascript
   const CONFIG_REFERENCIAS = {
     FILTRO_PROGRAMA: 'programacion'  // o el texto que aparezca en Kobo
   ```

**Opción B: Normalizar los datos en Kobo**
Edita el formulario de Kobo para que siempre guarde "Tecnología" en el campo de área.

### Para Alimentos y Bebidas
El filtro actual busca: `"alimentos"`

Proceso similar al de Tecnología, editando `AlimentosBebidas.gs`.

---

## 📊 4. Ver Logs Detallados

Para ver información técnica completa:

1. Apps Script → **Ver → Registros**
2. Ejecuta: **🔍 Diagnóstico: Ver Datos Kobo**
3. En los registros verás:
   ```
   === DIAGNÓSTICO DE REFERENCIAS KOBO ===
   URL: https://kf.kobotoolbox.org/...
   Filtro aplicado: "tecnolog"
   Total de registros en Kobo: XX

   Registro 1 NUEVO: Juan Pérez (Área: Tecnología)
   Registro 2 FILTRADO: María López (Área "Alimentos" no contiene "tecnolog")
   Registro 3 YA IMPORTADO: Pedro García
   ...

   === RESUMEN ===
   ...
   ```

---

## ✅ Pasos Recomendados

### Paso 1: Diagnóstico
```
📋 Referencias de Programas → 🔍 Diagnóstico: Ver Datos Kobo
```
Esto te dirá exactamente qué está pasando.

### Paso 2: Importar según resultados

#### Si hay "Nuevos disponibles: X"
```
📋 Referencias de Programas → Importar (Solo Nuevos)
```

#### Si hay "Filtrados: X" pero crees que deberían importarse
```
📋 Referencias de Programas → 📥 Importar TODAS (sin filtro)
```
Luego revisa manualmente y elimina lo que no corresponda.

### Paso 3: Revisar áreas en Kobo
En el diagnóstico, verás algo como:
```
📌 Áreas encontradas en Kobo:
  • Tecnología
  • Alimentos y Bebidas
  • Textiles
```

**Si ves un área que debería importarse pero no está:**
- Ajusta el filtro (ver sección "Ajustar el Filtro")

### Paso 4: Automatizar (Opcional)
Una vez que todo funcione correctamente:
```
📋 Referencias de Programas → ▶️ Activar Auto-Update (5 min)
```
Esto importará automáticamente cada 5 minutos.

---

## 🚨 Troubleshooting

### Problema: "No se pudo conectar a KoboToolbox"
**Causa**: URL incorrecta o permisos de Kobo
**Solución**:
1. Verifica la URL en `CONFIG_REFERENCIAS.KOBO_URL`
2. Verifica que tengas permisos para acceder a la exportación de Kobo

### Problema: "No hay datos en el formulario de Kobo"
**Causa**: El formulario de Kobo está vacío o la URL es incorrecta
**Solución**:
1. Accede a KoboToolbox y verifica que haya datos
2. Verifica que la URL de exportación sea correcta

### Problema: Todos los registros aparecen como "Filtrados"
**Causa**: El filtro no coincide con los datos en Kobo
**Solución**:
1. Ejecuta el diagnóstico
2. Ve qué áreas están en Kobo
3. Ajusta el filtro o usa "Importar TODAS"

### Problema: Se importan referencias de otros programas
**Causa**: Usaste "Importar TODAS (sin filtro)"
**Solución**:
1. Elimina manualmente las filas que no corresponden
2. Ajusta el filtro para futuras importaciones
3. Usa "Importar (Solo Nuevos)" en el futuro

---

## 📋 Checklist de Verificación

- [ ] Ejecuté el diagnóstico
- [ ] Revisé el total de registros en Kobo
- [ ] Identifiqué cuántos están filtrados vs. cuántos son nuevos
- [ ] Verifiqué las áreas que aparecen en Kobo
- [ ] Si necesario, ajusté el filtro
- [ ] Importé los datos correctamente
- [ ] Verifiqué que los datos importados sean correctos

---

## 📞 Preguntas Frecuentes

### ¿Por qué el filtro es "tecnolog" y no "tecnología"?
Para que funcione con o sin acento. El código normaliza automáticamente:
- "Tecnología" → "tecnologia"
- "tecnologia" → "tecnologia"

Así coincide con cualquier variante.

### ¿Puedo tener múltiples filtros?
No en la versión actual, pero puedes:
1. Usar "Importar TODAS"
2. Luego filtrar manualmente

O modificar el código para aceptar múltiples filtros.

### ¿Los datos duplicados se importan dos veces?
No. El sistema verifica el UUID único de cada registro y solo importa los que no existen.

---

## 📚 Documentos Relacionados

- `EXPLICACION_REFERENCIAS.md` - Diferencia entre las dos hojas de referencias
- `ACTUALIZACION_REFERENCIAS.md` - Cómo actualizar el nombre de las hojas
- `README.md` - Información general del sistema
- `GUIA_BACKUP.md` - Cómo hacer backup antes de cambios

---

**Fecha de creación**: 2026-03-08
**Versión**: 1.0
**Autor**: Claude Code
