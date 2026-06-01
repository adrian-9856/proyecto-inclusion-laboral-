# Prompts — Integración KoboToolbox con Google Sheets

Estos prompts te permiten pedir la misma integración para cualquier proyecto nuevo.

---

## Opción A — Panel de copia rápida dentro de Sheets

> Tengo un Google Sheets con un script de Apps Script (.gs).
> Quiero que cuando el usuario seleccione `"🔗 Abrir Formulario"` en la columna **Estado** de la hoja **Entrevistas**, se abra un modal dentro de Sheets que muestre los datos de esa fila en una tabla con un botón 📋 por campo para copiar con un clic, más un botón "Copiar todos los datos" que copia todo en formato `Campo: Valor`.
> El modal también debe tener un botón que abra el formulario Kobo en una pestaña nueva.
>
> Datos del proyecto:
> - **URL del formulario Kobo (Enketo):** `[https://ee.kobotoolbox.org/x/XXXXXXXX]`
> - **Nombre del programa:** `[ej: Alimentos y Bebidas]`
> - **Campos a mostrar** (columna en Sheets → etiqueta en el panel):
>   ```
>   Creamos ID      → Creamos ID
>   Nombre Completo → Nombre completo
>   DPI             → DPI / CUI
>   Edad            → Edad
>   Género          → Género
>   Teléfono        → Teléfono
>   Zona            → Zona residencia
>   Nivel Educativo → Nivel educativo
>   Entrevistador   → Responsable
>   [agrega o quita los que necesites]
>   ```
> - **Nombre del objeto de configuración** en el script: `[ej: CONFIG_AB o CONFIG_TECH]`
> - **Nombre de la función que dispara el modal:** `abrirFormularioKobo`

---

## Opción B — Formulario propio dentro de Sheets que envía a KoboToolbox via API

> Tengo un Google Sheets con un script de Apps Script (.gs).
> Quiero crear un formulario HTML que viva dentro de Sheets (sidebar o modal) y que al enviarlo mande los datos directamente a KoboToolbox via API sin abrir otra pestaña.
> Los campos que vienen de la fila actual se pre-llenan automáticamente; los demás los llena el usuario dentro del formulario en Sheets.
>
> Datos del proyecto:
> - **Token de KoboToolbox:** `[tu token, ej: 64cc018b88067397addd36b09288be8b6539cf39]`
> - **Asset UID del formulario:** `[ID en la URL de Kobo, ej: aF4nMQPqbHokM7rg2Vtf5w]`
>   _(se encuentra en: `kf.kobotoolbox.org/#/forms/`**`ASSET_UID`**`/summary`)_
> - **Campos del formulario Kobo** (nombre de variable exacto):
>   ```
>   info_programa/prog_origen
>   info_programa/responsable_ref
>   info_referido/creamos_id
>   info_referido/nombre_completo
>   info_referido/dpi_cui
>   info_referido/edad
>   info_referido/genero
>   info_referido/telefono
>   info_referido/zona_residencia
>   sec_educacion/ultimo_nivel_ed
>   [agrega todos los campos de tu formulario]
>   ```
> - **Campos pre-llenados desde Sheets** (columna → campo Kobo):
>   ```
>   Creamos ID      → info_referido/creamos_id
>   Nombre Completo → info_referido/nombre_completo
>   DPI             → info_referido/dpi_cui
>   Edad            → info_referido/edad
>   Género          → info_referido/genero
>   Teléfono        → info_referido/telefono
>   Zona            → info_referido/zona_residencia
>   Nivel Educativo → sec_educacion/ultimo_nivel_ed
>   Entrevistador   → info_programa/responsable_ref
>   [ajusta según tu proyecto]
>   ```
> - **Campos que el usuario llena manualmente** (no vienen de Sheets):
>   ```
>   [ej: sec_emocional/apoyo_solicitado]
>   [ej: sec_laboral/area_interes]
>   [lista los que apliquen]
>   ```
> - **Nombre del programa** que se enviará automáticamente: `[ej: Tecnología]`
> - **Nombre del objeto de configuración** en el script: `[ej: CONFIG_AB o CONFIG_TECH]`
> - **Función que dispara el formulario:** se abre al seleccionar `"🔗 Abrir Formulario"` en la columna Estado de la hoja Entrevistas.

---

## Notas

- El **Asset UID** está en la URL de KoboToolbox al abrir el formulario:
  `kf.kobotoolbox.org/#/forms/`**`AQUI_VA_EL_UID`**`/summary`
- El **Token** está en KoboToolbox → ícono de cuenta → Seguridad → API token
- Para la Opción A no necesitas token ni Asset UID, solo la URL pública Enketo
- Para la Opción B el token debe mantenerse privado (no subirlo a repositorios públicos)
