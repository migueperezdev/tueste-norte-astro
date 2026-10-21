# Tueste Norte — Astro

Proyecto educativo desarrollado durante las semanas 4 y 5 de CODE NODE.

Web de un tostadero de café de especialidad, con catálogo, información
de la tienda, avisos y un blog de métodos de preparación.

Astro presenta la web y WordPress permite administrar los cafés y las
entradas del blog. El catálogo y el blog utilizan renderizado en el
servidor (SSR) para consultar el contenido actualizado en cada visita.

Autor: Miguel Ángel Pérez Rodríguez.

## Tecnologías

- Astro para las páginas, las rutas y los componentes.
- Tailwind CSS para el diseño responsive.
- TypeScript para definir los tipos de datos y las propiedades.
- WordPress y su API REST como gestor de contenido.
- Advanced Custom Fields (ACF) para los campos de los cafés.
- Adaptador `@astrojs/node` en modo `standalone`.
- `html-entities` para decodificar entidades HTML del blog.
- Git y GitHub para el control de versiones.

## Requisitos

- Node.js 24, versión utilizada durante el desarrollo.
- npm.
- WordPress de las semanas 2 y 3 instalado y funcionando.
- Apache y MySQL encendidos en XAMPP durante las pruebas locales.
- Varios cafés publicados, con campos ACF e imagen destacada.
- Entradas de blog publicadas, con contenido e imagen destacada.

El repositorio de Astro contiene el frontend. La base de datos y los
archivos multimedia pertenecen a la instalación de WordPress.

## Instalación y configuración

Clona o descarga el repositorio y abre una terminal en la carpeta
`tueste-norte-astro`.

Instala las dependencias:

```bash
npm install
```

Copia `.env.example` con el nombre `.env` en la raíz del proyecto
y configura la dirección de la API de tu WordPress.

En el entorno local utilizado durante el desarrollo:

```env
WP_API_URL=http://localhost/tueste-norte-wp/wp-json
```

La dirección termina en `/wp-json`. El módulo de acceso a los datos
añade las rutas correspondientes a cafés y entradas.

El archivo `.env` queda fuera de Git. Se conserva `.env.example`
para documentar la configuración necesaria.

Los endpoints utilizados son:

- `/wp/v2/cafes`: cafés del CPT `cafe`.
- `/wp/v2/posts`: entradas del blog.

Los campos ACF utilizados en los cafés son:

- `origen`
- `notas_cata`
- `nivel_tueste`
- `precio`

Las peticiones incluyen `_embed` para obtener recursos relacionados,
como las imágenes destacadas.

## Servidor de desarrollo

Con WordPress funcionando, arranca Astro en segundo plano:

```bash
npx astro dev --background
```

Abre la dirección indicada por Astro, normalmente
[http://localhost:4321/](http://localhost:4321/).

Comandos para gestionar el servidor:

- Consultar su estado: `npx astro dev status`
- Consultar sus registros: `npx astro dev logs`
- Detenerlo: `npx astro dev stop`

Los registros permiten consultar también los mensajes de `console.log`
ejecutados en el frontmatter de las páginas.

Si modificas `.env`, reinicia el servidor de desarrollo.

## Compilación y servidor de producción

Mantén WordPress encendido durante las comprobaciones.

Detén el servidor de desarrollo para liberar su puerto, compila el
proyecto y arranca el servidor Node generado:

```bash
npx astro dev stop
npm run build
node ./dist/server/entry.mjs
```

Abre la dirección indicada por el servidor, normalmente
[http://localhost:4321/](http://localhost:4321/).

La compilación se guarda en `dist/`. En esta configuración, incluye
el servidor Node y los recursos que utiliza el navegador.

Para detener el servidor de producción, pulsa `Ctrl+C` en su terminal.

Cuando cambies páginas, componentes o estilos, vuelve a compilar
y reinicia el servidor Node.

Los cambios de contenido publicados en WordPress se consultan en la
siguiente petición al catálogo o al blog, sin recompilar Astro.

En esta implementación, `WP_API_URL` se lee mediante `import.meta.env`.
Si cambias esa dirección para producción, vuelve a compilar con el
nuevo valor antes de arrancar el servidor.

La dirección `localhost` corresponde al entorno local. Para publicar
la web en un alojamiento, WordPress debe ser accesible desde el
servidor Node y las imágenes deben tener direcciones accesibles
desde el navegador de los visitantes.

## Páginas

| Ruta | Contenido |
| --- | --- |
| `/` | Portada y presentación de Tueste Norte. |
| `/quienes-somos/` | Historia y valores del tostadero. |
| `/cafes/` | Catálogo de cafés obtenido desde WordPress. |
| `/cafes/[slug]/` | Ficha completa de un café. |
| `/contacto/` | Datos de ejemplo y horarios de la tienda. |
| `/blog/` | Listado de entradas publicadas en WordPress. |
| `/blog/[slug]/` | Contenido completo de una entrada del blog. |
| `/avisos/` | Avisos locales ordenados por fecha. |
| `/pruebas/` | Demostración de las tres variantes de Badge. |
| `/ejercicios/titulares/` | Títulos y fechas de entradas de WordPress. |
| `/ejercicios/inventario/` | Cabeceras de paginación y listado de cafés. |
| `/ejercicios/reloj/` | Comparación entre SSR y prerenderizado. |

`[slug]` representa la parte de la dirección que identifica cada
contenido, por ejemplo:

- `/cafes/sidamo-floral/`
- `/blog/como-preparar-cafe-con-v60/`

## Componentes y organización

- `src/layouts/BaseLayout.astro`: estructura compartida, título,
  descripción, cabecera y pie.
- `src/components/Header.astro`: navegación principal.
- `src/components/Footer.astro`: pie de página.
- `src/components/Badge.astro`: etiquetas de tueste, origen y nuevo.
- `src/components/CafeCard.astro`: tarjeta de café con sus datos,
  imagen y enlace a la ficha.
- `src/lib/wp.ts`: tipos, peticiones y transformación de los datos
  recibidos de WordPress.
- `src/pages/cafes/`: listado y detalle de cafés.
- `src/pages/blog/`: listado y detalle de entradas.
- `src/pages/ejercicios/`: ejercicios de aprendizaje de la semana 5.
- `src/content.config.ts`: configuración de la colección local de avisos.
- `src/content/avisos/`: avisos escritos en Markdown.
- `src/styles/global.css`: estilos globales e integración de Tailwind.

## Acceso a los datos

El acceso a la API del catálogo y del blog está centralizado en
`src/lib/wp.ts`.

Este módulo obtiene los campos ACF, las imágenes destacadas y el
contenido HTML. También convierte los datos a los tipos `Cafe` y
`Articulo`, utilizados por las páginas.

Las páginas del cliente trabajan con propiedades como `nombre`,
`titulo`, `imagen`, `resumen` o `contenidoHtml`. Los detalles de
WordPress, como `title.rendered` y `_embedded`, se gestionan
dentro del módulo de acceso.

Los listados consultan todas las páginas de resultados utilizando
la cabecera `X-WP-TotalPages`.

Los detalles buscan el contenido mediante su slug en cada petición.
Al utilizar SSR, estas rutas no necesitan `getStaticPaths()`.

Cuando no existe el café o el artículo solicitado, la página establece
el estado HTTP 404 y muestra un mensaje de contenido no encontrado.

El HTML de las descripciones y los artículos se muestra con `set:html`,
a partir del contenido publicado en el WordPress del proyecto.

## Migración del blog a WordPress

Los tres artículos que estaban en Markdown se han trasladado a
WordPress, conservando su título, resumen, fecha y contenido.

Las páginas del blog utilizan ahora la API REST. Se han retirado
los archivos de `src/content/blog/` y la definición de la colección
local de blog.

Las versiones anteriores de esos archivos permanecen en el historial
de Git.

La colección local de avisos se conserva. Su esquema valida el título,
la fecha y el indicador de importancia. Los avisos se ordenan del más
reciente al más antiguo y los importantes se resaltan visualmente.

La dirección, el horario, el correo y el teléfono de Contacto son
datos ficticios de ejemplo. Esta condición se indica en la página.

## Decisión de renderizado

He elegido SSR con `output: 'server'` y el adaptador de Node en modo `standalone`.  
Cada visita al catálogo o al blog consulta WordPress y genera el HTML actualizado.  
Para Marta: publica un café o una receta y aparece en la siguiente visita, sin recompilar Astro.  
Con SSG, los datos se consultarían durante el build y se guardarían en páginas HTML.  
Una publicación nueva en SSG necesitaría otro build y despliegue para aparecer.  
Ese proceso podría automatizarse, pero en este proyecto se ha elegido SSR.  
SSG permite un alojamiento estático sencillo, normalmente con menor consumo y coste.  
SSR requiere un alojamiento capaz de ejecutar Node y consume recursos por petición.  
Además, WordPress debe estar disponible para responder a las consultas de la web.  
Si WordPress está caído, el catálogo y el blog no podrán obtener sus datos.  
Esta implementación no incorpora una caché ni una copia de respaldo para ese caso.  
Con SSG, el HTML ya publicado podría seguir disponible durante la caída de WordPress.  
Las imágenes servidas desde WordPress podrían fallar también en una web SSG.  
Un nuevo build SSG que necesitase consultar la API fallaría mientras WordPress estuviese caído.

## Ejercicios de aprendizaje

### Semana 4

1. **Badge:** componente con propiedades `texto` y `tono`, y tres
   variantes visuales. Se demuestra en `/pruebas/`.
2. **BaseLayout y Quiénes somos:** estructura compartida y tarjetas
   de valores con diseño responsive.
3. **Avisos:** colección con esquema, archivos Markdown, orden por
   fecha y resaltado de los avisos importantes.

En el ejercicio de avisos se provocó un error eliminando temporalmente
`titulo`, se documentó en un comentario de `src/pages/avisos.astro`
y se corrigió.

### Semana 5

1. **Titulares:** petición a las entradas de WordPress desde el
   frontmatter, títulos, fechas y registro del número de resultados.
   El registro aparece en el servidor porque el frontmatter se ejecuta allí.
2. **Inventario:** peticiones con `per_page=3`, lectura de `X-WP-Total`
   y `X-WP-TotalPages`, y recorrido de todas las páginas de cafés.
3. **Reloj:** comparación del resultado compilado con SSR y con
   `export const prerender = true`.

En la prueba SSR, la hora cambiaba al recargar porque se calculaba
por petición. Con prerenderizado, se calculaba durante el build y
quedaba fija hasta la siguiente compilación.

El reloj conserva `prerender = true` en su estado final. Las páginas
del catálogo y del blog utilizan SSR.

Los ejercicios de la semana 5 son material de aprendizaje y no forman
parte de las secciones del cliente.

## Procedencia de las imágenes

Las imágenes destacadas de estos cuatro artículos se han generado
con IA mediante ChatGPT para el proyecto:

| Artículo | Procedencia |
| --- | --- |
| Cómo conservar el café en casa | Generada con IA mediante ChatGPT. |
| Cómo preparar café con cafetera italiana | Generada con IA mediante ChatGPT. |
| Cómo preparar café con prensa francesa | Generada con IA mediante ChatGPT. |
| Cómo preparar café con V60 | Generada con IA mediante ChatGPT. |

Se han subido a la biblioteca de medios de WordPress y asignado como
imágenes destacadas. Astro obtiene sus direcciones mediante la API.

Las imágenes del catálogo se obtienen igualmente de las imágenes
destacadas asignadas a cada café en WordPress.

## Comprobaciones realizadas

- Compilación completada sin errores tras la migración del blog.
- Catálogo con los cafés y sus imágenes de WordPress.
- Cambio de precio en WordPress reflejado al recargar el catálogo.
- Apertura de las fichas de los cuatro cafés.
- Mensaje de café no encontrado para un slug inexistente.
- Aparición de las nuevas entradas de WordPress en el listado del blog.
- Imágenes destacadas visibles en las tarjetas del blog.
- Página de avisos funcionando después de retirar la colección local de blog.
- Comparación del reloj con SSR y con prerenderizado.

Para repetir las comprobaciones, mantén WordPress encendido, ejecuta
`npm run build` y arranca el servidor Node.

Revisa también Inicio, Quiénes somos, Contacto y los enlaces de regreso
desde las fichas y los artículos.

Las consultas de las páginas SSR se ejecutan al visitarlas. Por eso,
además de compilar, hay que comprobar el listado y los detalles
con WordPress disponible.

## Archivos generados y dependencias

`.env`, `node_modules/`, `.astro/` y `dist/` quedan fuera del repositorio
mediante `.gitignore`.

Se conservan `.env.example`, `package.json` y `package-lock.json`
para documentar la configuración y las dependencias.

Las dependencias se instalan con `npm install` y la compilación
se genera con `npm run build`.

Los archivos de `.astro/` son generados automáticamente. La configuración
de la colección de avisos se modifica en `src/content.config.ts`.

## Documentación consultada

- [Rutas de Astro](https://docs.astro.build/en/guides/routing/)
- [Renderizado bajo demanda](https://docs.astro.build/en/guides/on-demand-rendering/)
- [Adaptador de Node](https://docs.astro.build/en/guides/integrations-guide/node/)
- [Variables de entorno](https://docs.astro.build/en/guides/environment-variables/)
- [Colecciones de contenido](https://docs.astro.build/en/guides/content-collections/)
- [Comandos de Astro](https://docs.astro.build/en/reference/cli-reference/)