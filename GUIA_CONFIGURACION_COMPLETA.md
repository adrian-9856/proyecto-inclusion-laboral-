# 🚀 Guía Completa: Configurar Tech + Alimentos

## ⚡ Resumen Rápido

**Situación actual:**
- 1 formulario Kobo con referencias de TODOS los programas
- 2 Google Sheets diferentes (Tech y Alimentos)
- Cada Sheet debe importar solo SUS referencias

**De tus 6 registros en Kobo:**
- ✅ 1 es de Tecnología → Importar en DP_IL_Formación_Tech
- ✅ 2 son de Alimentos y Bebidas → Importar en DP_IL_Formación_AyB
- ❌ 3 son de Apoyo Emocional → NO importar (filtrados)

---

## 📋 Pasos Rápidos

### PARA TECNOLOGÍA:

1. Abre **DP_IL_Formación_Tech**
2. **Extensiones → Apps Script**
3. Borra todo y pega el contenido de **`tech.gs`**
4. Guarda y recarga (F5)
5. **📋 Referencias de Programas → 🔬 Análisis Detallado**
6. Verifica que el registro de "Tecnología" tenga ✅ PASA FILTRO
7. **Importar (Solo Nuevos)**

### PARA ALIMENTOS:

1. Abre **DP_IL_Formación_AyB**
2. **Extensiones → Apps Script**
3. Borra todo y pega el contenido de **`AlimentosBebidas.gs`**
4. Guarda y recarga (F5)
5. **📋 Referencias de Programas → 🔬 Análisis Detallado**
6. Verifica que los 2 registros de "Alimentos y Bebidas" tengan ✅ PASA FILTRO
7. **Importar (Solo Nuevos)**

---

## 🎯 Resultado Esperado

**DP_IL_Formación_Tech:**
- 1 registro: "pruaba tech" (Tecnología)

**DP_IL_Formación_AyB:**
- 2 registros: "prueba IL" y "Orueba ayb" (Alimentos y Bebidas)

**Los 3 de Apoyo Emocional NO se importan en ninguno (correcto).**

---

## 🔧 Configuración Importante

Ambos archivos deben tener:

**tech.gs:**
```javascript
FILTRO_PROGRAMA: 'tecnolog'
```

**AlimentosBebidas.gs:**
```javascript
FILTRO_PROGRAMA: 'alimentos'
```

**Ambos deben usar la MISMA URL de Kobo.**

---

## ✅ Verificación Rápida

Después de configurar, ejecuta en cada Sheet:
```
📋 Referencias de Programas → 🔬 Análisis Detallado (FILA x FILA)
```

Esto te mostrará EXACTAMENTE qué registros pasan el filtro y cuáles no.

---

## 🚨 Si no funciona

1. Verifica que actualizaste el código
2. Recarga el Sheet (F5)
3. Ejecuta el análisis detallado
4. Comparte el resultado si hay errores

---

**¿Listo para empezar? Empieza con el que quieras (Tech o Alimentos).**
