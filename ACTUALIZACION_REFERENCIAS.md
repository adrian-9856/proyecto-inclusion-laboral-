# ✅ Actualización: Referencias IL → Referencias de Programas

## 🎯 Cambios Implementados

Se actualizó el sistema para usar **"Referencias de Programas"** como nombre oficial, reemplazando a **"Referencias IL"**.

---

## 📋 ¿Qué cambió?

### 1. **Nombre de la hoja**
- **Antes**: `Referencias IL`
- **Ahora**: `Referencias de Programas`

### 2. **Botón del menú**
- **Antes**: `📋 Referencias IL`
- **Ahora**: `📋 Referencias de Programas`

### 3. **Compatibilidad**
✅ El sistema sigue funcionando con ambos nombres para no romper instalaciones existentes.

---

## 🚀 Cómo actualizar tu Google Sheet

### Opción A: Renombrar la hoja existente (Recomendado)

1. Abre tu Google Sheet
2. Haz clic derecho en la pestaña **"Referencias IL"**
3. Selecciona **"Cambiar nombre..."**
4. Cambia el nombre a: **Referencias de Programas**
5. Presiona Enter

¡Listo! El sistema ahora usará el nuevo nombre.

---

### Opción B: Crear nueva hoja y migrar datos

Si prefieres empezar con una hoja nueva:

1. Ve al menú: **📋 Referencias de Programas** (el nombre del botón ya cambió)
2. Selecciona: **Configurar Hoja**
3. Esto creará una nueva hoja llamada "Referencias de Programas"
4. Si tienes datos en "Referencias IL":
   - Copia los datos (sin encabezados)
   - Pégalos en la nueva hoja
5. Opcionalmente, elimina la hoja antigua "Referencias IL"

---

## 🔧 Actualizar el código en Google Apps Script

### Paso 1: Abrir el editor de Apps Script
1. En tu Google Sheet, ve a: **Extensiones → Apps Script**
2. Verás el código actual

### Paso 2: Reemplazar el código
**Para Tecnología:**
- Borra todo el contenido del archivo
- Copia el contenido actualizado de `tech.gs`
- Pégalo en el editor
- Guarda (Ctrl+S)

**Para Alimentos y Bebidas:**
- Borra todo el contenido del archivo
- Copia el contenido actualizado de `AlimentosBebidas.gs`
- Pégalo en el editor
- Guarda (Ctrl+S)

### Paso 3: Recargar el Sheet
1. Cierra el editor de Apps Script
2. Refresca el Google Sheet (F5)
3. Verás el nuevo botón: **📋 Referencias de Programas**

---

## 📖 Cómo usar "Referencias de Programas"

### Función 1: Importar desde KoboToolbox
```
1. Clic en: 📋 Referencias de Programas
2. Selecciona: "Importar (Solo Nuevos)"
3. El sistema importa referencias externas desde Kobo
4. Solo trae los registros nuevos (no duplica)
```

### Función 2: Auto-actualización cada 5 minutos
```
1. Clic en: 📋 Referencias de Programas
2. Selecciona: "▶️ Activar Auto-Update (5 min)"
3. El sistema importará automáticamente cada 5 minutos
4. Para detener: "⏸️ Detener Auto-Update"
```

### Función 3: Enviar a Entrevistas
```
1. En la hoja "Referencias de Programas"
2. En la última columna (Acción), selecciona: "Enviar a Entrevista"
3. El registro se copia automáticamente a la hoja "Entrevistas"
4. La fila se marca con color verde
```

---

## 🔄 Diferencia con "Hoja de Interés"

| Concepto | Descripción | Origen |
|----------|-------------|--------|
| **Referencias de Programas** | Referencias externas de otros programas/instituciones | KoboToolbox (externo) |
| **Hoja de Interés** | Personas que llenaron tu formulario directamente | Formulario interno |

**Flujo "Referencias de Programas":**
```
KoboToolbox → Referencias de Programas → [Enviar a Entrevista] → Entrevistas
```

**Flujo "Hoja de Interés":**
```
Formulario Kobo → Hoja de Interés → [Marca "Sí"] → Referencias de Programas
```

---

## ❓ Preguntas Frecuentes

### ¿Debo eliminar la hoja "Referencias IL"?
No es necesario. El sistema funciona con ambos nombres para compatibilidad. Pero si quieres mantener todo ordenado, puedes:
1. Renombrarla a "Referencias de Programas"
2. O eliminarla si no tiene datos importantes

### ¿El botón sigue diciendo "Referencias IL"?
Si el botón no cambió:
1. Refresca el Google Sheet (F5)
2. Si persiste, ve a: Extensiones → Apps Script
3. Ejecuta manualmente la función: `onOpen`
4. Refresca el Sheet nuevamente

### ¿Puedo tener ambas hojas?
Sí, el código soporta ambas hojas. Pero es más limpio tener solo una para evitar confusión.

---

## ✅ Checklist de Actualización

- [ ] Código actualizado en Apps Script
- [ ] Google Sheet refrescado (F5)
- [ ] Botón del menú cambió a "📋 Referencias de Programas"
- [ ] Hoja renombrada de "Referencias IL" a "Referencias de Programas"
- [ ] Probé importar desde Kobo (si aplica)
- [ ] Probé la acción "Enviar a Entrevista"

---

## 📞 Problemas Comunes

### Problema: "El botón no aparece"
**Solución:**
1. Apps Script → Ejecutar: `onOpen`
2. Refresca el Sheet (F5)

### Problema: "Error al importar desde Kobo"
**Solución:**
1. Verifica que la URL de Kobo esté correcta en `CONFIG_REFERENCIAS.KOBO_URL`
2. Verifica que tengas permisos para acceder a Kobo

### Problema: "La acción 'Enviar a Entrevista' no funciona"
**Solución:**
1. Ve al menú del programa (🎓 o 🍽️)
2. Clic en: "🔧 Reparar Validaciones"
3. Luego: "⏰ Instalar Triggers"

---

## 📚 Documentos Relacionados

- `EXPLICACION_REFERENCIAS.md` - Diferencia entre las dos hojas
- `GUIA_BACKUP.md` - Cómo hacer backup y reinstalar
- `README.md` - Información general del sistema
- `GUIA_IMPLEMENTACION.md` - Instalación completa paso a paso

---

**Fecha de actualización**: 2024-03-08
**Versión**: 2.0
