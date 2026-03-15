# 📋 GUÍA: Cómo Cambiar los Nombres de Programas de Cohortes

## 🎯 Problema Resuelto

Ahora cuando crees una cohorte, te aparecerá un **menú numerado** con los programas disponibles. Solo escribes el número y ya no hay errores de escritura.

## 📍 LUGARES DONDE CAMBIAR LOS NOMBRES

### 1️⃣ **Para Cohortes de TECNOLOGÍA** → `tech.gs` línea ~4913

```javascript
// ⚠️ TODO: AQUÍ PUEDES CAMBIAR LOS NOMBRES DE LOS PROGRAMAS
const programasDisponibles = [
  'Programación',           // ← Cambiar aquí
  'SAC',                    // ← Cambiar aquí
  'Computación',            // ← Cambiar aquí
  'Alfa Digital',           // ← Cambiar aquí
  'Marketing Digital',      // ← Cambiar aquí
  'Desarrollo Web',         // ← Cambiar aquí
  'Otro (escribir manual)'  // ← NO borrar esta opción
];
```

### 2️⃣ **Para Cohortes de ALIMENTOS Y BEBIDAS** → `AlimentosBebidas.gs` línea ~4950

```javascript
// ⚠️ TODO: AQUÍ PUEDES CAMBIAR LOS NOMBRES DE LOS PROGRAMAS
const programasDisponibles = [
  'Barismo',                // ← Cambiar aquí
  'Gastronomía',            // ← Cambiar aquí
  'Cocina',                 // ← Cambiar aquí
  'Repostería',             // ← Cambiar aquí
  'Panadería',              // ← Cambiar aquí
  'Servicio al Cliente',    // ← Cambiar aquí
  'Otro (escribir manual)'  // ← NO borrar esta opción
];
```

### 3️⃣ **Para ESTIPENDIOS (Mapeo)** → `EstipendiosIntegrado.gs` línea ~554

```javascript
// ⚠️ TODO: AQUÍ PUEDES CAMBIAR LOS NOMBRES DE LOS PROGRAMAS PARA ESTIPENDIOS
const mapeo = {
  'Gastronomía': `Cocina-${año}`,        // ← Cambiar aquí
  'Barismo': `Barismo-${año}`,            // ← Cambiar aquí
  'Programación': `SAC-${año}`,           // ← Cambiar aquí
  // ... etc
};
```

---

## 🔧 CÓMO FUNCIONA AHORA

### ✅ **ANTES** (con errores):
```
Usuario escribe: "Barismos" ❌
Usuario escribe: "Gastronomia" ❌ (sin tilde)
Usuario escribe: "programacion" ❌ (minúsculas)
```

### ✅ **AHORA** (sin errores):
```
Sistema muestra:
1. Barismo
2. Gastronomía
3. Cocina
4. Repostería
5. Panadería
6. Servicio al Cliente
7. Otro (escribir manual)

Usuario escribe: 1 ✅
→ Se crea: "Barismo 1 (2026)"
```

---

## 📝 INSTRUCCIONES PARA ACTUALIZAR

### Paso 1: Abre el Editor de Google Apps Script
1. Abre tu hoja de cálculo
2. Ve a **Extensiones** → **Apps Script**

### Paso 2: Busca el archivo correcto
- Para **Tecnología**: busca `tech.gs`
- Para **Alimentos y Bebidas**: busca `AlimentosBebidas.gs`
- Para **Estipendios**: busca `EstipendiosIntegrado.gs`

### Paso 3: Busca los comentarios marcados
Presiona `Ctrl+F` y busca:
```
⚠️ TODO: AQUÍ PUEDES CAMBIAR
```

### Paso 4: Edita los nombres
```javascript
// EJEMPLO: Si tus programas son diferentes
const programasDisponibles = [
  'Barismo Básico',      // ← Tu nombre real
  'Barismo Avanzado',    // ← Tu nombre real
  'Latte Art',           // ← Tu nombre real
  'Otro (escribir manual)'
];
```

### Paso 5: Guarda
- Presiona `Ctrl+S` o el ícono de guardar 💾
- ¡Listo! Los cambios estarán disponibles inmediatamente

---

## ⚠️ IMPORTANTE

### ✅ HACER:
- Usar los **nombres exactos** que aparecen en tus documentos
- Mantener la opción `'Otro (escribir manual)'` al final
- Usar las **tildes correctas** (Gastronomía, no Gastronomia)
- Usar **mayúsculas/minúsculas consistentes**

### ❌ NO HACER:
- Borrar la opción `'Otro (escribir manual)'`
- Usar nombres con caracteres especiales raros
- Dejar la lista vacía `[]`

---

## 🎨 EJEMPLO COMPLETO

Si tus programas reales son:
- Barismo Profesional
- Gastronomía Internacional
- Cocina Rápida
- Alfa Digital Marketing

Entonces editas así:

```javascript
const programasDisponibles = [
  'Barismo Profesional',
  'Gastronomía Internacional',
  'Cocina Rápida',
  'Alfa Digital Marketing',
  'Otro (escribir manual)'
];
```

---

## 🆘 ¿PROBLEMAS?

Si después de hacer cambios no funcionan:
1. Verifica que guardaste con `Ctrl+S`
2. Recarga la hoja de cálculo (F5)
3. Verifica que no borraste las comillas `'` o comas `,`
4. Verifica que la última línea NO tenga coma:

```javascript
✅ CORRECTO:
  'Barismo',
  'Cocina',
  'Otro (escribir manual)'  // ← Sin coma al final
];

❌ INCORRECTO:
  'Barismo',
  'Cocina',
  'Otro (escribir manual)',  // ← Coma extra
];
```

---

## 📞 CONTACTO

Si necesitas ayuda, busca los comentarios `⚠️ TODO` en los archivos mencionados.

**¡Éxito! 🎉**
