# Edunnova — sitio en Astro

Rediseño de [edunnova.com.mx](https://edunnova.com.mx) (WordPress + Elementor) como sitio estático en Astro + Tailwind CSS v4.

```sh
npm install
npm run dev      # http://localhost:4323
npm run build    # genera dist/
```

## Páginas

Las URLs son las mismas que en WordPress (con `/` al final), así que los enlaces y el posicionamiento se conservan.

| URL | Contenido |
| --- | --- |
| `/` | Portada (componente `Hero`), servicios, por qué Edunnova, contexto, lo más reciente de Enlace |
| `/servicios/` | Los tres servicios con fotos reales, metodología y sectores |
| `/ami-docente/` | Certificación de Estándares CONOCER: qué incluye y los estándares (EC0301, EC0217.01, EC1621, EC0401, EC0105) |
| `/nosotros/` | Quiénes somos, misión, visión, valores, vinculación y ubicación |
| `/resp-social/` | Programas de responsabilidad social |
| `/red-edunnova/` | Enlace: noticias y artículos |
| `/<slug>/` | Cada nota del blog (7) |
| `/contacto/` | WhatsApp, teléfono, correo, formulario y redes |
| `/rss.xml` | Feed RSS de Enlace |
| `404.html` | Página no encontrada con accesos a las secciones principales |

Direcciones viejas de WordPress (`/home/`, `/feed/`, `/comments/feed/` y `/<nota>/feed/`) redirigen a su equivalente; se definen en `astro.config.mjs`. En un hosting estático son redirecciones con `<meta refresh>`; si el hosting permite reglas de redirección 301, conviene replicarlas ahí.

## Marca

- **Tipografía:** Blauer Nue (la que ya usa el sitio), en `public/fonts/`. Es una fuente comercial de Webhance; confirma que la licencia de Edunnova cubre uso web.
- **Colores** tomados del banner: verde `#4DD47E`, verde bosque `#04624E`, morado de resaltado `#8147F3`.
- **`Mark`**: la caja morada detrás de una palabra ("aprendiendo" en el banner original).
- **`Arcs`**: los arcos del logotipo en SVG, que se dibujan solos al cargar.
- **`Hero`**: el banner original era una sola imagen con el texto incrustado. Ahora el texto es HTML, la estudiante es un recorte transparente (`src/assets/hero/estudiante.png`, extraído del banner) y los arcos son SVG.
- Las tarjetas de valores eran imágenes con el texto dentro; ahora son texto real con el ícono recortado.

## Contenido y multimedia

- `src/data/posts.json`: las 7 notas con su HTML limpio; sus fotos están en `public/media/posts/<slug>/` (WebP).
- `src/data/services.ts` y `src/data/site.ts`: servicios, contacto, redes y menú.
- `legacy-site/`: todo lo descargado del sitio original (HTML de cada página, CSS de Elementor, multimedia original, JSON de la API de WordPress) y los scripts de extracción.
- `scripts/prep-assets.py`: organiza la multimedia descargada dentro del proyecto.

## Formulario

El sitio es estático: el formulario de contacto abre el correo del visitante con el mensaje listo para `contacto@edunnova.com`, y WhatsApp está a un clic en todo el sitio. Para recibir mensajes directamente, conecta `src/pages/contacto.astro` a un servicio como Formspree o Web3Forms.
