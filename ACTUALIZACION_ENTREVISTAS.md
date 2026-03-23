# Actualización de Sistema de Entrevistas - KoboToolbox

## Fecha: 2026-03-23

## Resumen de Cambios

Se ha actualizado el sistema para manejar la nueva estructura de la hoja de detalles de entrevista con campos expandidos y una nueva URL de exportación de KoboToolbox.

## 1. Actualización de URL de KoboToolbox

### URL Anterior
```
https://kf.kobotoolbox.org/api/v2/assets/aF4nMQPqbHokM7rg2Vtf5w/export-settings/esqKoJjmoR34panMLhM8j3Z/data.csv
```

### URL Nueva
```
https://kf.kobotoolbox.org/api/v2/assets/aF4nMQPqbHokM7rg2Vtf5w/export-settings/es8WpJjRKe9LhhrKPChUpFh/data.csv
```

**Archivos actualizados:**
- `tech.gs` - Línea 30
- `AlimentosBebidas.gs` - Línea 30

## 2. Nuevas Columnas Agregadas a Detalle Entrevistas

Se expandió la hoja de **52 columnas (A-AZ)** a **85 columnas (A-CG)**.

### Nuevas Secciones Agregadas:

#### BA-BF: NUEVAS PREGUNTAS DEL CURSO (6 columnas)
- BA: Qué te llama atención curso
- BB: Expectativa del curso
- BC: Tramitar papelería
- BD: Plan tramitar papelería
- BE: Comentario Firmar Documento
- BF: Plan Disponibilidad

#### BG-BS: ÁREA DE EMPLEABILIDAD (13 columnas)
- BG: Actualmente tiene trabajo
- BH: Cuéntanos más trabajo
- BI: Satisfecho con trabajo
- BJ: Comentario satisfacción trabajo
- BK: Qué hacer próximos meses
- BL: Importancia conseguir trabajo
- BM: Te ves trabajando sector
- BN: Comentario Deudas Bancarias
- BO: Caso Legal
- BP: Comentario Caso Legal
- BQ: Dispuesto participar empleabilidad
- BR: Comentario empleabilidad
- BS: Temporalidad metas empleabilidad

#### BT-BU: GÉNERO ADICIONAL (2 columnas)
- BT: Conflictos casa horarios variados
- BU: Comentario conflictos horarios

#### BV-CG: NOTAS Y METADATOS KOBO (12 columnas)
- BV: Notas del Entrevistador
- BW: _id (Kobo)
- BX: _uuid (Kobo)
- BY: _submission_time (Kobo)
- BZ: _validation_status (Kobo)
- CA: _notes (Kobo)
- CB: _status (Kobo)
- CC: _submitted_by (Kobo)
- CD: _tags (Kobo)
- CE: _index (Kobo)
- CF: __version__ (Kobo)
- CG: meta/rootUuid (Kobo)

## 3. Funciones Actualizadas

### crearHojaDetalleEntrevistas()
- Expandida para incluir 85 columnas con los nuevos headers
- Actualizada configuración de anchos de columna
- Agregados nuevos colores de fondo para las nuevas secciones:
  - BA-BF: Morado oscuro (#7b1fa2) - Nuevas preguntas curso
  - BG-BS: Azul claro (#0277bd) - Empleabilidad
  - BT-BU: Rosa oscuro (#c2185b) - Género adicional
  - BV-CG: Gris azulado (#455a64) - Notas y metadatos

### importarEntrevistasDesdeKobo()
- Expandido `colMap` para incluir todos los nuevos campos
- Actualizado array `registro` para mapear las 85 columnas
- Se agregan automáticamente los metadatos de Kobo (_id, _uuid, etc.)

## 4. Estructura de Datos por Sector

El formulario de KoboToolbox ahora incluye preguntas específicas por sector:

### 🍎 SECCIÓN 2: ALIMENTOS Y BEBIDAS
- Preguntas del Curso (8 preguntas)
- Área de Empleabilidad (13 preguntas)

### 💻 SECCIÓN 2: TECNOLOGÍA
- Preguntas del Curso (8 preguntas)
- Área de Empleabilidad (13 preguntas)

### 🤝 SECCIÓN 2: SERVICIO AL CLIENTE
- Preguntas del Curso (8 preguntas)
- Área de Empleabilidad (13 preguntas)

### 👥 SECCIÓN 3: GÉNERO
- Preguntas sobre trabajo en grupos diversos y mixtos
- Preguntas sobre conflictos y horarios
- Preguntas sobre igualdad de género

## 5. Cómo Usar el Sistema Actualizado

### Importar Datos de Entrevistas

1. **Desde el menú de Google Sheets:**
   - Ve a **Creamos > 📝 Importar Entrevistas (Detalle)**

2. **El sistema automáticamente:**
   - Descarga los datos desde la nueva URL de KoboToolbox
   - Mapea todos los 85 campos a las columnas correspondientes
   - Evita duplicados basándose en el Creamos ID
   - Vincula los datos con la hoja "Entrevistas"

### Verificar Importación

- Revisa la hoja **"Detalle Entrevistas"**
- Los nuevos campos aparecerán en las columnas BA-CG
- La columna AZ muestra si el registro está vinculado ("Sí"/"No")

## 6. Archivos Modificados

1. **tech.gs**
   - Línea 30: URL actualizada
   - Línea 840-951: Función crearHojaDetalleEntrevistas expandida
   - Línea 4626-4715: Mapeo de columnas expandido
   - Línea 4765-4853: Array de registro expandido

2. **AlimentosBebidas.gs**
   - Línea 30: URL actualizada
   - Línea 837-1004: Función crearHojaDetalleEntrevistas expandida
   - Línea 4661-4750: Mapeo de columnas expandido
   - Línea 4800-4888: Array de registro expandido

## 7. Notas Importantes

- ✅ Los datos existentes no se verán afectados
- ✅ Las nuevas columnas se agregarán automáticamente
- ✅ El sistema sigue evitando duplicados por Creamos ID
- ✅ Todos los metadatos de Kobo se capturan automáticamente
- ✅ Compatible con ambos sectores (Tecnología y Alimentos/Bebidas)

## 8. Próximos Pasos Recomendados

1. **Probar la importación** con un par de registros desde Kobo
2. **Verificar** que todos los campos se mapean correctamente
3. **Ajustar búsquedas** en `buscarIndiceColumna()` si los nombres de columnas en Kobo son diferentes
4. **Documentar** cualquier campo personalizado adicional

## Soporte

Para reportar problemas o solicitar cambios adicionales, crear un issue en el repositorio del proyecto.
