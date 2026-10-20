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