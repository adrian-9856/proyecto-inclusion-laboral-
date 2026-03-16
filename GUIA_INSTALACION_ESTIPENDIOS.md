# 💰 GUÍA DE INSTALACIÓN - SISTEMA DE ESTIPENDIOS

## 📋 Tabla de Contenidos
1. [Descripción General](#descripción-general)
2. [Requisitos Previos](#requisitos-previos)
3. [Paso 1: Crear Nuevo Google Sheet](#paso-1-crear-nuevo-google-sheet)
4. [Paso 2: Copiar el Código](#paso-2-copiar-el-código)
5. [Paso 3: Configurar el Sistema](#paso-3-configurar-el-sistema)
6. [Paso 4: Instalar las Hojas](#paso-4-instalar-las-hojas)
7. [Paso 5: Configurar Kobo](#paso-5-configurar-kobo)
8. [Paso 6: Importar Datos](#paso-6-importar-datos)
9. [Paso 7: Activar Actualización Automática](#paso-7-activar-actualización-automática)
10. [Verificación Final](#verificación-final)

---

## 📝 Descripción General

El **Sistema de Estipendios** es un sistema SEPARADO e INDEPENDIENTE del sistema de Inclusión Laboral (tech.gs y AlimentosBebidas.gs).

**NO modifica ni afecta el sistema existente.**

### ¿Qué hace este sistema?

- Gestiona pagos de estipendios a participantes
- Se conecta automáticamente con KoboToolbox
- Calcula presupuestos y KPIs automáticamente
- Genera dashboards y reportes
- Envía alertas de presupuesto
- Exporta datos para Power BI

---

## ✅ Requisitos Previos

Antes de comenzar, necesitas:

- [ ] Cuenta de Google con acceso a Google Sheets
- [ ] Cuenta de KoboToolbox (https://kf.kobotoolbox.org)
- [ ] Un formulario de Kobo creado para registrar pagos de estipendios
- [ ] Token de API de Kobo (lo obtendremos en el proceso)
- [ ] Datos de participantes y cohortes

---

## 🚀 PASO 1: Crear Nuevo Google Sheet

1. Ve a https://sheets.google.com
2. Clic en **+ Nuevo** → **Hoja de cálculo en blanco**
3. Nombra el archivo: **"Sistema de Estipendios 2026"**
4. ¡Listo! Ya tienes tu Google Sheet

---

## 📋 PASO 2: Copiar el Código

1. En tu Google Sheet, ve a **Extensiones** → **Apps Script**
2. Se abrirá el editor de Apps Script
3. Borra todo el código que aparece por defecto
4. Copia **TODO** el contenido del archivo `SistemaEstipendios.gs` (lo encontrarás en este repositorio)
5. Pega el código en el editor
6. Haz clic en **💾 Guardar** (o Ctrl+S)
7. Nombra el proyecto: **"Sistema Estipendios"**

---

## ⚙️ PASO 3: Configurar el Sistema

### 3.1 Obtener Token de Kobo

1. Ve a https://kf.kobotoolbox.org/token/
2. Inicia sesión con tu cuenta
3. Copia el token que aparece (una cadena larga de letras y números)

### 3.2 Obtener URL del CSV de Kobo

1. Ve a https://kf.kobotoolbox.org
2. Abre tu formulario de estipendios
3. Clic en **Configuración** (⚙️) → **API**
4. Copia la URL que dice **"Export Data"** o similar
5. La URL debe verse algo así:
   ```
   https://kf.kobotoolbox.org/api/v2/assets/xxxxxx/data.csv
   ```

### 3.3 Editar la Configuración en el Código

En el editor de Apps Script, busca la sección `CONFIG` (líneas 10-30 aproximadamente):

```javascript
const CONFIG = {
  // Pega tu token de Kobo aquí
  KOBO_TOKEN: 'PEGA_TU_TOKEN_AQUÍ',

  // Pega la URL del CSV aquí
  KOBO_CSV_URL: 'PEGA_TU_URL_AQUÍ',

  // Email para recibir alertas
  EMAIL_ALERTAS: 'tu-email@example.com'
};
```

**Guarda** el archivo después de editar (Ctrl+S).

---

## 🏗️ PASO 4: Instalar las Hojas

1. Vuelve a tu Google Sheet (la pestaña del navegador donde está el archivo)
2. Refresca la página (F5 o Ctrl+R)
3. Espera unos segundos
4. Verás un nuevo menú: **💰 Estipendios**
5. Haz clic en **💰 Estipendios** → **🏗️ Instalar Sistema**
6. Aparecerá un mensaje de autorización. Haz clic en **Continuar**
7. Selecciona tu cuenta de Google
8. Haz clic en **Avanzado** → **Ir a Sistema Estipendios (no seguro)**
9. Haz clic en **Permitir**
10. Espera a que se instale (verás una notificación)

### Hojas Creadas

Después de la instalación, verás estas hojas:

- **Configuración**: Catálogos y valores de referencia
- **Presupuesto_Cohortes**: Presupuestos por cohorte
- **Participantes**: Registro de participantes
- **Estipendios**: Registro detallado de pagos
- **Dashboard_KPIs**: Indicadores clave
- **Dashboard_Alertas**: Alertas automáticas
- **Reporte_Mensual**: Reportes automáticos

---

## 📱 PASO 5: Configurar Kobo

### 5.1 Estructura del Formulario Kobo

Tu formulario de Kobo debe tener estos campos (pueden tener nombres diferentes, pero deben existir):

| Campo en Kobo | Descripción | Tipo |
|---------------|-------------|------|
| `id_cohorte` | ID de la cohorte | Texto |
| `id_participante` | ID de la participante | Texto |
| `monto` | Monto del estipendio | Número |
| `tipo_estipendio` | Curso o Prácticas | Selección |
| `fecha_programada` | Fecha programada del pago | Fecha |
| `fecha_pago` | Fecha real del pago | Fecha |
| `estado` | Estado del pago | Selección |
| `metodo_pago` | Método de pago | Selección |
| `responsable` | Quien realizó el pago | Texto |
| `ubicacion_gps` | GPS del lugar de pago | GPS |
| `firma` | Firma digital | Foto/Firma |
| `foto_comprobante` | Foto del comprobante | Foto |
| `numero_comprobante` | Número de recibo | Texto |
| `notas` | Observaciones | Texto |

### 5.2 Mapeo de Campos

Si los nombres de tus campos son diferentes, necesitas editar el mapeo en el código:

Busca la sección `MAPEO_CAMPOS` en el código y actualiza según tus nombres:

```javascript
const MAPEO_CAMPOS = {
  'tu_campo_kobo': 'campo_sistema',
  // Ejemplo:
  'ID_Cohorte': 'idCohorte',
  'Creamos_ID': 'idParticipante',
  // etc...
};
```

---

## 📥 PASO 6: Importar Datos

### 6.1 Primera Importación Manual

1. En tu Google Sheet, ve al menú **💰 Estipendios**
2. Haz clic en **📥 Importar Desde Kobo**
3. Espera a que termine (verás una notificación)
4. Revisa la hoja **Estipendios** para ver los datos importados

### 6.2 Configurar Datos Iniciales

Antes de importar, necesitas tener:

#### a) Hoja "Configuración"
- Programas: Tech, Alimentos y Bebidas
- Cohortes: SAC Cohorte I, Cocina Cohorte I, etc.
- Tipos de Estipendio: Curso, Prácticas
- Estados: Programado, Pagado, Atrasado, Cancelado
- Métodos de Pago: Efectivo, Transferencia, etc.
- Responsables: Eva, Adrian, Paola, etc.

#### b) Hoja "Presupuesto_Cohortes"
- Crea un registro para cada cohorte con:
  - ID_Cohorte: COH-001, COH-002, etc.
  - Programa: Tech o Alimentos y Bebidas
  - Nombre: SAC Cohorte I, etc.
  - Fechas de inicio y fin
  - Número de participantes
  - Presupuestos de curso y prácticas

#### c) Hoja "Participantes"
- Crea un registro para cada participante con:
  - ID_Participante: PART-001, PART-002, etc.
  - Nombre completo
  - DPI, Teléfono
  - Programa y Cohorte
  - Estado: Activa, Graduada, Retirada

---

## ⏰ PASO 7: Activar Actualización Automática

Para que el sistema importe datos de Kobo automáticamente cada hora:

1. En el menú **💰 Estipendios**
2. Haz clic en **⏰ Activar Actualización Automática**
3. Verás un mensaje de confirmación
4. ¡Listo! El sistema se actualizará cada hora

### Desactivar Actualización Automática

Si necesitas desactivarla:
1. Menú **💰 Estipendios** → **⏰ Desactivar Actualización Automática**

---

## ✅ Verificación Final

### Checklist de Instalación

- [ ] Google Sheet creado con el nombre correcto
- [ ] Código copiado y guardado en Apps Script
- [ ] Token de Kobo configurado en CONFIG
- [ ] URL de Kobo configurada en CONFIG
- [ ] Email de alertas configurado
- [ ] Sistema instalado (7 hojas creadas)
- [ ] Hoja "Configuración" completada con catálogos
- [ ] Hoja "Presupuesto_Cohortes" con datos de cohortes
- [ ] Hoja "Participantes" con datos de participantes
- [ ] Primera importación desde Kobo exitosa
- [ ] Datos visibles en hoja "Estipendios"
- [ ] KPIs calculándose en "Dashboard_KPIs"
- [ ] Actualización automática activada

### Probar el Sistema

1. **Crear un pago de prueba en Kobo**
   - Llena el formulario con datos de prueba
   - Envía el formulario

2. **Importar manualmente**
   - Menú → Importar Desde Kobo
   - Verifica que aparezca en la hoja "Estipendios"

3. **Revisar KPIs**
   - Ve a la hoja "Dashboard_KPIs"
   - Verifica que los números se calculen correctamente

4. **Revisar Alertas**
   - Ve a "Dashboard_Alertas"
   - Debe mostrar alertas si hay pagos atrasados o presupuesto crítico

---

## 🆘 Solución de Problemas

### Error: "No se puede leer la propiedad..."
**Solución**: Verifica que el mapeo de campos en MAPEO_CAMPOS coincida con los nombres en Kobo.

### Error: "Token inválido"
**Solución**: Verifica que copiaste el token completo desde https://kf.kobotoolbox.org/token/

### Los datos no se importan
**Solución**:
1. Verifica la URL del CSV de Kobo
2. Verifica que el formulario tenga submissions
3. Revisa los logs en Apps Script: Ver → Registros de ejecución

### Las fórmulas no calculan
**Solución**:
1. Verifica que haya datos en las hojas de referencia
2. Menú → Reparar Fórmulas

### No aparece el menú "Estipendios"
**Solución**:
1. Refresca la página del Google Sheet
2. Espera 5-10 segundos después de refrescar
3. Si no aparece, ve a Apps Script y ejecuta manualmente: `onOpen()`

---

## 📞 Soporte

Si tienes problemas:
1. Revisa esta guía paso a paso
2. Revisa el archivo ESTRUCTURA_GOOGLE_SHEETS.md para detalles técnicos
3. Consulta los logs en Apps Script (Ver → Registros de ejecución)

---

## 📚 Documentación Adicional

- **ESTRUCTURA_GOOGLE_SHEETS.md**: Estructura detallada de todas las hojas
- **PLAN_SISTEMA_ESTIPENDIOS.md**: Plan completo del sistema
- **SistemaEstipendios.gs**: Código fuente con comentarios

---

**Versión**: 1.0
**Fecha**: Marzo 2026
**Autor**: Sistema de Inclusión Laboral
