import { decode } from "html-entities";
const API = import.meta.env.WP_API_URL;

export type Tueste = "claro" | "medio" | "oscuro";

// Forma de los datos que devuelve WordPress.
interface CafeWP {
    id: number;
    slug: string;
    title: { rendered: string };
    content: { rendered: string };
    acf: {
        origen: string;
        notas_cata: string;
        nivel_tueste: Tueste;
        precio: number | string;
    };
    _embedded?: {
        "wp:featuredmedia"?: {
            source_url: string;
            alt_text: string;
        }[];
    };
}

// Forma de los datos que utilizará nuestra web.
export interface Cafe {
    id: number;
    slug: string;
    nombre: string;
    origen: string;
    notas: string;
    tueste: Tueste;
    precio: number;
    descripcionHtml: string;
    imagen: string | null;
    imagenAlt: string;
}

// Convierte un café de WordPress al formato de nuestra web.
function mapCafe(raw: CafeWP): Cafe {
    const media = raw._embedded?.["wp:featuredmedia"]?.[0];

    return {
        id: raw.id,
        slug: raw.slug,
        nombre: raw.title.rendered,
        origen: raw.acf.origen,
        notas: raw.acf.notas_cata,
        tueste: raw.acf.nivel_tueste,
        precio: Number(raw.acf.precio),
        descripcionHtml: raw.content.rendered,
        imagen: media?.source_url ?? null,
        imagenAlt: media?.alt_text || raw.title.rendered,
    };
}

// Realiza una petición y comprueba su estado HTTP.
async function pedirWP(ruta: string): Promise<Response> {
    if (!API) {
        throw new Error("Falta configurar WP_API_URL en el archivo .env.");
    }

    const respuesta = await fetch(`${API}${ruta}`);

    if (!respuesta.ok) {
        throw new Error(
            `Error al consultar WordPress: HTTP ${respuesta.status}`
        );
    }

    return respuesta;
}

// Obtiene todos los cafés, recorriendo las páginas necesarias.
export async function getCafes(): Promise<Cafe[]> {
    const respuesta = await pedirWP(
        "/wp/v2/cafes?_embed&per_page=100"
    );

    const datos: CafeWP[] = await respuesta.json();

    const totalPaginas = Number(
        respuesta.headers.get("X-WP-TotalPages")
    );

    for (let pagina = 2; pagina <= totalPaginas; pagina++) {
        const respuestaPagina = await pedirWP(
            `/wp/v2/cafes?_embed&per_page=100&page=${pagina}`
        );

        const datosPagina: CafeWP[] = await respuestaPagina.json();

        datos.push(...datosPagina);
    }

    return datos.map(mapCafe);
}

// Busca un café por el nombre que aparece en su URL.
export async function getCafeBySlug(slug: string): Promise<Cafe | null> {
    const respuesta = await pedirWP(
        `/wp/v2/cafes?_embed&slug=${encodeURIComponent(slug)}`
    );

    const datos: CafeWP[] = await respuesta.json();
    const cafe = datos[0];

    return cafe ? mapCafe(cafe) : null;
}

// Datos que devuelve WordPress para una entrada del blog.
interface ArticuloWP {
    id: number;
    slug: string;
    date_gmt: string;
    title: { rendered: string };
    excerpt: { rendered: string };
    content: { rendered: string };
    _embedded?: {
        "wp:featuredmedia"?: {
            source_url: string;
            alt_text: string;
        }[];
        author?: {
            name: string;
        }[];
    };
}

// Datos que utilizarán nuestras páginas.
export interface Articulo {
    id: number;
    slug: string;
    titulo: string;
    resumen: string;
    contenidoHtml: string;
    fecha: Date;
    autor: string;
    imagen: string | null;
    imagenAlt: string;
}

// Adapta una entrada de WordPress al formato de nuestra web.
function mapArticulo(raw: ArticuloWP): Articulo {
    const media = raw._embedded?.["wp:featuredmedia"]?.[0];
    const titulo = decode(raw.title.rendered);

    return {
        id: raw.id,
        slug: raw.slug,
        titulo,
        resumen: decode(
            raw.excerpt.rendered.replace(/<[^>]*>/g, "")
        ).trim(),
        contenidoHtml: raw.content.rendered,
        fecha: new Date(`${raw.date_gmt}Z`),
        autor: raw._embedded?.author?.[0]?.name || "Tueste Norte",
        imagen: media?.source_url ?? null,
        imagenAlt: media?.alt_text || titulo,
    };
}

// Obtiene todas las entradas, de la más reciente a la más antigua.
export async function getArticulos(): Promise<Articulo[]> {
    const ruta =
        "/wp/v2/posts?_embed&per_page=100&orderby=date&order=desc";

    const respuesta = await pedirWP(ruta);
    const datos: ArticuloWP[] = await respuesta.json();
    const totalPaginas = Number(
        respuesta.headers.get("X-WP-TotalPages")
    );

    for (let pagina = 2; pagina <= totalPaginas; pagina++) {
        const respuestaPagina = await pedirWP(
            `${ruta}&page=${pagina}`
        );

        const datosPagina: ArticuloWP[] = await respuestaPagina.json();
        datos.push(...datosPagina);
    }

    return datos.map(mapArticulo);
}

// Busca una entrada por su slug.
export async function getArticuloBySlug(
    slug: string
): Promise<Articulo | null> {
    const respuesta = await pedirWP(
        `/wp/v2/posts?_embed&slug=${encodeURIComponent(slug)}`
    );

    const datos: ArticuloWP[] = await respuesta.json();
    const articulo = datos[0];

    return articulo ? mapArticulo(articulo) : null;
}