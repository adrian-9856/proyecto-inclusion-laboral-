# 📝 CHANGELOG - Sistema de Estipendios

## Versión 2.0 - Marzo 16, 2026

### ✨ Nuevas Funcionalidades

#### 1. Campos Adicionales en Hoja "Estipendios"

Se agregaron **5 nuevos campos** a la hoja de Estipendios para mejorar el registro y análisis de pagos:

| Campo | Columna | Tipo | Descripción |
|-------|---------|------|-------------|
| **Ubicación GPS** | O | Texto | Coordenadas GPS del lugar donde se realizó el pago |
| **URL Foto Comprobante** | Q | URL | Link a la foto del comprobante de pago |
| **Mes** | S | Fórmula | Mes del pago (calculado automáticamente) |
| **Año** | T | Fórmula | Año del pago (calculado automáticamente) |
| **Semana** | U | Fórmula | Número de semana del año (calculado automáticamente) |

#### 2. Fórmulas Automáticas Mejoradas

**Nuevas fórmulas implementadas:**

```excel
// Columna S - Mes
=IF(I2<>"",TEXT(I2,"MMMM"),"")

// Columna T - Año
=IF(I2<>"",YEAR(I2),"")

// Columna U - Semana
=IF(I2<>"",WEEKNUM(I2),"")
```

Estas fórmulas se copian automáticamente hasta la fila 1000 al crear la hoja.

#### 3. Importación Mejorada desde Kobo

**Nuevos campos importados automáticamente:**

- `Foto_Comprobante` → Foto del comprobante de pago
- `Numero_Comprobante` → Número de recibo/comprobante
- `Metodo_Pago` → Método de pago utilizado
- `Responsable` → Persona que realizó el pago
- `GPS` / `_geolocation` / `Ubicacion` → Ubicación GPS del pago

**Mapeo flexible de GPS:**
El sistema busca el campo GPS en múltiples nombres posibles de Kobo:
- `_geolocation`
- `GPS`
- `Ubicacion`

#### 4. Estructura Completa Actualizada

**Estructura actual de la hoja "Estipendios" (22 columnas):**

| Col | Campo | Tipo | Descripción |
|-----|-------|------|-------------|
| A | ID Pago | Texto | EST-2026-0001, EST-2026-0002, etc. |
| B | Fecha Registro | Fecha/Hora | Timestamp de Kobo |
| C | ID Participante | Texto | ID único de la participante |
| D | Nombre Completo | Texto | Nombre completo de la participante |
| E | Cohorte | Texto | Cohorte a la que pertenece |
| F | Programa | Texto | Tech o Alimentos y Bebidas |
| G | Tipo Estipendio | Lista | Curso o Prácticas |
| H | Monto (Q) | Moneda | Monto del estipendio |
| I | Fecha Programada | Fecha | Fecha programada del pago |
| J | Fecha Pago Real | Fecha | Fecha real del pago |
| K | Estado | Fórmula | Pagado, Atrasado, Programado |
| L | Método Pago | Lista | Efectivo, Transferencia, Cheque |
| M | # Recibo | Texto | Número de comprobante |
| N | Responsable | Texto | Quien realizó el pago |
| O | **Ubicación GPS** | Texto | **NUEVO** Coordenadas GPS |
| P | URL Firma | URL | Link a firma digital |
| Q | **URL Foto Comprobante** | URL | **NUEVO** Link a foto |
| R | Días Atraso | Fórmula | Días de atraso calculados |
| S | **Mes** | Fórmula | **NUEVO** Mes del pago |
| T | **Año** | Fórmula | **NUEVO** Año del pago |
| U | **Semana** | Fórmula | **NUEVO** Semana del año |
| V | Notas | Texto | Observaciones |

---

## 🔄 Cambios Técnicos

### Archivos Modificados

1. **tech.gs**
   - ✅ Función `crearHojaEstipendios()` actualizada
   - ✅ Función `importarEstipendiosDesdeKobo()` actualizada
   - ✅ Nuevas fórmulas automáticas
   - ✅ Nuevos anchos de columna

2. **AlimentosBebidas.gs**
   - ✅ Función `crearHojaEstipendios()` actualizada
   - ✅ Función `importarEstipendios DesdeKobo()` actualizada
   - ✅ Nuevas fórmulas automáticas
   - ✅ Nuevos anchos de columna

### Compatibilidad

- ✅ **Backward Compatible**: Los archivos existentes no se ven afectados
- ✅ **Forward Compatible**: Nuevas instalaciones incluyen todos los campos
- ✅ **Kobo Flexible**: Si un campo no existe en Kobo, simplemente queda vacío

---

## 📊 Beneficios de las Mejoras

### 1. Ubicación GPS
- **Beneficio**: Trazabilidad del lugar donde se realizó cada pago
- **Uso**: Verificación de pagos en campo, auditoría geográfica
- **Exportable**: Datos listos para mapas en Power BI

### 2. Foto Comprobante
- **Beneficio**: Respaldo visual de cada pago
- **Uso**: Auditoría, resolución de disputas, archivo digital
- **Acceso**: Un clic para ver la foto del comprobante

### 3. Mes, Año, Semana
- **Beneficio**: Análisis temporal automático
- **Uso**: Reportes mensuales, análisis de tendencias, gráficos por período
- **Power BI**: Campos listos para dashboards temporales

---

## 🚀 Cómo Actualizar un Sistema Existente

Si ya tienes el sistema instalado y quieres actualizarlo:

### Opción 1: Reinstalar (Recomendado para nuevos sheets)

1. Copia el código nuevo de `tech.gs` o `AlimentosBebidas.gs`
2. Reemplaza el código completo en Apps Script
3. Ejecuta: **Menú → Estipendios → Instalar Sistema**
4. Confirma que quieres recrear la hoja (se perderán datos existentes)

### Opción 2: Agregar Columnas Manualmente (Para preservar datos)

Si ya tienes datos en la hoja "Estipendios" y no quieres perderlos:

1. **Abrir la hoja "Estipendios"**

2. **Insertar nuevas columnas:**
   - Después de la columna N (Responsable), insertar **1 columna** → O (Ubicación GPS)
   - Después de la columna P (URL Firma), insertar **1 columna** → Q (URL Foto Comprobante)
   - Después de la columna R (Días Atraso), insertar **3 columnas** → S, T, U

3. **Agregar encabezados:**
   - O1: `Ubicación GPS`
   - Q1: `URL Foto Comprobante`
   - S1: `Mes`
   - T1: `Año`
   - U1: `Semana`

4. **Agregar fórmulas en fila 2:**
   - S2: `=IF(I2<>"",TEXT(I2,"MMMM"),"")`
   - T2: `=IF(I2<>"",YEAR(I2),"")`
   - U2: `=IF(I2<>"",WEEKNUM(I2),"")`

5. **Copiar fórmulas hacia abajo:**
   - Selecciona S2:U2
   - Arrastra hasta la última fila con datos

6. **Actualizar el código:**
   - Copia el código nuevo de `tech.gs` o `AlimentosBebidas.gs`
   - Reemplaza en Apps Script
   - Guarda (Ctrl+S)

7. **Probar importación:**
   - Menú → Estipendios → Importar Desde Kobo
   - Verifica que los nuevos campos se llenen correctamente

---

## 🧪 Cómo Probar los Cambios

### Test 1: Crear Nueva Hoja

```
1. Menú → Estipendios → Instalar Sistema
2. Verificar que la hoja tenga 22 columnas (A-V)
3. Verificar encabezados correctos
4. Verificar fórmulas en S2, T2, U2
```

### Test 2: Importar Datos

```
1. Tener datos de prueba en Kobo con campos GPS y Foto
2. Menú → Estipendios → Importar Desde Kobo
3. Verificar que columna O (GPS) se llene
4. Verificar que columna Q (Foto) se llene
5. Verificar que columnas S, T, U calculen automáticamente
```

### Test 3: Verificar Fórmulas

```
1. Agregar un registro manualmente en fila 2
2. Poner fecha en columna I
3. Verificar que S2 muestre el mes (ej: "Marzo")
4. Verificar que T2 muestre el año (ej: 2026)
5. Verificar que U2 muestre la semana (ej: 11)
```

---

## 📋 Campos de Kobo Requeridos

Para aprovechar todas las funcionalidades, tu formulario de Kobo debe tener:

### Campos Obligatorios
- ✅ `Creamos_ID` - ID de la participante
- ✅ `Nombre_s` - Nombre
- ✅ `Apellido_s` - Apellido
- ✅ `Fecha` - Fecha del pago
- ✅ `Monto_total` - Monto

### Campos Nuevos Opcionales (Recomendados)
- 🆕 `Foto_Comprobante` - Foto del comprobante
- 🆕 `Numero_Comprobante` - Número de recibo
- 🆕 `Metodo_Pago` - Efectivo, Transferencia, etc.
- 🆕 `Responsable` - Quien realizó el pago
- 🆕 `_geolocation` o `GPS` o `Ubicacion` - Coordenadas GPS

### Campos Existentes
- `Proyecto` - Tech o Alimentos y Bebidas
- `Especialidad` - SAC, Cocina, etc.
- `Fase` - Teórica, Práctica, etc.
- `Comentarios` - Notas
- `Firma` - Firma digital

---

## 🎯 Próximas Mejoras (Roadmap)

### Versión 2.1 (Próximamente)
- [ ] Hoja "Participantes" separada para estipendios
- [ ] Hoja "Configuración" con catálogos
- [ ] Hoja "Dashboard_Alertas" independiente
- [ ] Hoja "Reporte_Mensual" con tabla dinámica
- [ ] Validaciones mejoradas con listas de participantes
- [ ] Integración con Power BI (guía paso a paso)

### Versión 3.0 (Futuro)
- [ ] Módulo de presupuesto avanzado
- [ ] Alertas por email automáticas
- [ ] Generación de reportes PDF
- [ ] API REST para consultas externas

---

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias:

1. **Revisar documentación:**
   - `GUIA_INSTALACION_ESTIPENDIOS.md`
   - `ESTRUCTURA_GOOGLE_SHEETS.md`

2. **Verificar logs:**
   - Apps Script → Ver → Registros de ejecución

3. **Contacto:**
   - Reportar issue en GitHub
   - Email: adrian@example.com

---

## 🙏 Agradecimientos

Gracias a todos los que están utilizando y mejorando este sistema para gestionar estipendios y apoyar la inclusión laboral.

---

**Versión**: 2.0
**Fecha**: 16 de Marzo de 2026
**Autor**: Equipo de Inclusión Laboral
