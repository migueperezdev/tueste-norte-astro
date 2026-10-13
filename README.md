# Tueste Norte — Astro

Proyecto educativo desarrollado durante la semana 4 de CODE NODE.
Web estática de un tostadero de café de especialidad, con catálogo,
información de la tienda, avisos y un blog de métodos de preparación.

Autor: Miguel Ángel Pérez Rodríguez.

## Tecnologías

- Astro para las páginas y los componentes.
- Tailwind CSS para el diseño responsive.
- TypeScript para definir tipos y propiedades.
- Git para el control de versiones.

## Requisitos

- Node.js 24, versión utilizada durante el desarrollo.
- npm.

## Instalación y ejecución

Clona o descarga el repositorio y abre una terminal en la carpeta del proyecto.

Instala las dependencias:

```bash
npm install
```

Arranca el servidor de desarrollo:

```bash
npm run dev
```

Abre la dirección que indique la terminal, normalmente
[http://localhost:4321/](http://localhost:4321/).

## Compilación y previsualización

Genera la web estática:

```bash
npm run build
```

Los archivos generados se guardan en `dist/`.

Para revisar el resultado de la compilación:

```bash
npm run preview -- --port 4322
```

Abre [http://localhost:4322/](http://localhost:4322/).
Se utiliza el puerto 4322 para poder mantener abierto el servidor de desarrollo.

Después de modificar las páginas o su contenido, vuelve a ejecutar
`npm run build` para actualizar la previsualización.

## Páginas

| Ruta | Contenido |
| --- | --- |
| `/` | Portada y presentación de Tueste Norte. |
| `/quienes-somos` | Historia y valores del tostadero. |
| `/catalogo` | Cuatro cafés con origen, notas de cata, tueste y precio. |
| `/contacto` | Datos de ejemplo y horarios de la tienda. |
| `/blog` | Listado de tres artículos de preparación de café. |
| `/blog/v60` | Ejemplo de página individual de un artículo. |
| `/avisos` | Novedades ordenadas por fecha. |
| `/pruebas` | Demostración de las tres variantes de Badge. |

## Componentes y organización

- `src/layouts/BaseLayout.astro`: estructura compartida de las páginas
  principales, título, descripción, cabecera y pie.
- `src/components/Header.astro`: navegación principal.
- `src/components/Footer.astro`: pie de página.
- `src/components/Badge.astro`: etiquetas de tueste, origen y nuevo.
- `src/components/CafeCard.astro`: tarjeta reutilizable para cada café.
- `src/content.config.ts`: configuración y validación de las colecciones.
- `src/content/avisos/`: avisos escritos en Markdown.
- `src/content/blog/`: artículos escritos en Markdown.
- `src/styles/global.css`: importación de Tailwind y configuración de fuentes.

## Decisiones sobre los datos

Los cuatro cafés se guardan en un array tipado dentro de
`src/pages/catalogo.astro`. Es una solución sencilla para el catálogo
estático y pequeño de esta entrega.

El blog y los avisos utilizan colecciones de contenido. Sus esquemas
validan los campos de los archivos Markdown. Los listados se ordenan
por fecha, empezando por el contenido más reciente.

Los artículos marcados con `draft: true` se excluyen del listado
y de la generación de páginas del blog.

La dirección, el horario, el correo y el teléfono de Contacto son
datos ficticios de ejemplo. Esta condición se indica también en la página.

## Ejercicios de asimilación

1. **Badge:** componente con propiedades `texto` y `tono`, y tres
   variantes visuales. Se demuestra en `/pruebas`.
2. **BaseLayout y Quiénes somos:** estructura compartida, dos párrafos
   y tres tarjetas de valores con diseño responsive.
3. **Avisos:** colección con esquema, dos archivos Markdown, orden
   descendente por fecha y resaltado de los avisos importantes.
   Se provocó un error eliminando temporalmente `titulo`, se documentó
   en un comentario de `src/pages/avisos.astro` y se corrigió.

## Comprobaciones realizadas

- Compilación completada sin errores: 10 páginas generadas.
- Navegación revisada con `npm run preview`.
- Apertura de los artículos y regreso al listado del blog.
- Tarjetas revisadas en ventanas amplias y estrechas.
- Menú comprobado con un ancho de 320 píxeles.

## Archivos generados y dependencias

`node_modules/`, `.astro/` y `dist/` deben quedar fuera del repositorio
mediante `.gitignore`.

Las dependencias se reconstruyen con `npm install` y la web compilada
con `npm run build`. Se conservan `package.json` y `package-lock.json`
para registrar las dependencias del proyecto.