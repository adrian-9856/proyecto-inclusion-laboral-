# 📋 Explicación: Referencias IL vs Referencias de Programas

## 🔴 Problema Actual
Existen DOS hojas con nombres similares que causan confusión:

### 1️⃣ **"Referencias IL"** (Hoja ANTIGUA - Legacy)
- **Propósito**: Importar datos desde KoboToolbox (formulario externo de referencias)
- **Botón en menú**: 📋 Referencias IL → Importar (Solo Nuevos)
- **Cuándo se usa**: Cuando recibes referencias de otros programas o instituciones
- **Auto-actualización**: Puede configurarse para importar cada 5 minutos

### 2️⃣ **"Referencias de Programas"** (Hoja NUEVA)
- **Propósito**: Registrar personas que YA llenaron "Hoja de Interés"
- **Cómo se llena**: Automáticamente cuando en "Hoja de Interés" marcas "Sí" en columna Q (¿Tiene Hoja de Interés?)
- **Ventaja**: Consolida datos ya capturados

---

## ✅ **¿Qué significan las columnas?**

### Columna K: "Programa de Referencia"
De qué programa viene la persona:
- Tecnología
- Alimentos y Bebidas
- Otros programas

### Columna L: "Referido por"
Quién o qué proceso lo refirió:
- "Hoja de Interés" → Vino del proceso interno
- "Referencias externas" → Vino de otro programa
- Nombre de persona o institución

---

## 🔧 **¿Cómo funciona actualmente?**

### FLUJO 1: Uso de "Referencias IL" (Externa)
```
Formulario KoboToolbox → Referencias IL → Botón "Enviar a Entrevista" → Entrevistas
```

### FLUJO 2: Uso de "Referencias de Programas" (Interna)
```
Hoja de Interés → Marca "Sí" en columna Q → Referencias de Programas (copia automática)
```

---

## 💡 **Recomendaciones**

### Opción A: Mantener ambas hojas
- **Referencias IL**: Solo para datos externos (Kobo)
- **Referencias de Programas**: Solo para datos internos (Hoja de Interés)

### Opción B: Unificar en una sola (Recomendado)
- Renombrar "Referencias de Programas" a solo **"Referencias"**
- Eliminar "Referencias IL" después de migrar datos
- Consolidar todo en un solo lugar

---

## 🚨 **Si el botón no funciona**

1. Ve al menú: **🎓 Inclusion Laboral** (Tecnología) o **🍽️ Alimentos y Bebidas**
2. Selecciona: **🔧 Reparar Validaciones**
3. Luego: **🔧 Reparar Fórmulas**
4. Si persiste: **⏰ Instalar Triggers**

---

## 📞 Siguientes pasos
1. Decide si quieres mantener ambas hojas o unificar
2. Haz un backup completo (ver GUIA_BACKUP.md)
3. Si quieres unificar, avísame para crear el script
