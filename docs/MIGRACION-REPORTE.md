# Informe de migración todoip.com → Next.js

Captura pública del sitio: solo peticiones GET anónimas, sin cuentas ni credenciales, con
pausas por el rate limit (429) del hosting. WordPress, DNS, hosting y producción no se
tocaron. Fuente de verdad: `capture/manifest.json` y `capture/html/`.

## 1. Cobertura de URLs

| Grupo | URLs | Estado en el clon |
| --- | --- | --- |
| Páginas del `page-sitemap.xml` | 12 (incluye `/salud/`) | 200, HTML estático |
| Posts del `post-sitemap.xml` | 15 | 200, HTML estático |
| Landings de ads | `/bots/ /salud/ /cobranzas/ /turismo/` | 200, `noindex, follow` en producción, root layout propio |
| Páginas WP fuera del sitemap | `/aviso-de-privacidad/`, `/registro-exitoso/`, `/reportes-telefonia/` | 200, robots original |
| Categorías enlazadas | `/category/inteligencia-artificial/`, `/category/analysis/`, `/category/seguridad/` | 200, indexables (como en vivo) |
| Archivos WP públicos | `/author/admin/`, `/category/uncategorized/` | 200, `follow, noindex` (como en vivo) |
| 404 de WordPress | cualquier otra URL | 404 con la plantilla "Page Not Found \| Todo IP" |
| Archivos SEO | robots.txt, llms.txt, sitemap_index, page/post-sitemap, main-sitemap.xsl, /feed/, /comments/feed/, 19 feeds por post/categoría/autor | byte a byte; sitemaps con `X-Robots-Tag: noindex` y `text/xml` como en vivo |
| Redirecciones | `todoip.com/*` → `www`, sin barra → con barra, `/sitemap.xml` y `/wp-sitemap.xml` → `/sitemap_index.xml` | 301, igual que en vivo |

No replicado a propósito (y por qué):

- `/page/2/` y `/blog/page/2/`: en vivo responden 200 como duplicados suaves (canonical a la
  base). Son paginación vacía de WP; en el clon dan 404. Ninguna URL del sitemap ni enlace
  interno apunta a ellas.
- `/?s=…` (búsqueda de WordPress): depende del backend de WP. El formulario de búsqueda
  conserva su interfaz pero no envía (ver §5).
- `/wp-login.php`, `/wp-admin/`, `/wp-json/`, oEmbed, xmlrpc: backend de WordPress.
- `/category-sitemap.xml`: también es 404 en vivo (el baseline adjunto guardó como
  "sitemap" el HTML de la 404). El clon responde 404 igual.

## 2. Paridad SEO (snapshot por URL)

`scripts/test/seo.mjs` compara, para las 38 URLs más la 404, el HTML capturado en vivo con
el HTML servido por el clon (renderizado en servidor/estático, no por cliente):
`<title>`, meta robots, canonical, hreflang, description, Open Graph, Twitter, `article:*`,
JSON-LD (comparado como JSON), `lang`, H1, conjunto de enlaces, anclas (`id`), imágenes,
códigos de estado, redirecciones (incluido no‑www), `X-Robots-Tag` y archivos especiales.

Resultado en modo producción (`Host: www.todoip.com`): **0 diferencias**. Diferencias
conocidas y explicadas:

1. El enlace oculto `/imunify-bot-check` (honeypot que inyecta el WAF Imunify360 del
   hosting en cada página) no se reproduce: no es contenido del sitio y en Vercel apuntaría
   a una 404. `robots.txt` conserva su `Disallow: /imunify-bot-check` porque se sirve
   byte a byte.
2. En la 404, Next.js siempre añade `<meta name="robots" content="noindex">` además del
   `follow, noindex` original. La directiva efectiva es la misma.

Modo preview: todas las URLs devuelven `noindex, nofollow` en meta y en `X-Robots-Tag`, y
`robots.txt` es `Disallow: /`.

Otros cambios técnicos invisibles para SEO:

- Etiquetas de `<head>` propias de WordPress que se eliminaron por no tener sentido fuera
  de WP: `meta generator`, `api.w.org`, `EditURI` (xmlrpc), `shortlink`, enlaces oEmbed,
  alternates `wp-json` y `gmpg profile`.
- Los enlaces internos del cuerpo pasan de absolutos (`https://www.todoip.com/x/`) a
  relativos (`/x/`) para que la navegación funcione en preview; resuelven a la misma URL.
  Canonical, Open Graph, JSON-LD, sitemaps y feeds mantienen URLs absolutas a `www`.
- Las imágenes conservan sus rutas originales `/wp-content/uploads/...` (415 assets
  espejados, 48 MB), así que las URLs de imagen indexadas siguen siendo válidas.
- En Vercel, `http → https` lo hace la plataforma con **308** (en vivo es 301). Google
  trata ambos como permanentes.

## 3. Contradicciones del baseline (reportadas, no corregidas)

Se replicaron tal cual porque el objetivo es no cambiar SEO; quedan para decisión aparte:

- `/salud/` está en `page-sitemap.xml` pero es `noindex, follow`. Las otras 3 landings
  de ads no están en el sitemap.
- `llms.txt` lista las 4 landings de ads (que son noindex), y además sin barra final
  (`https://www.todoip.com/bots`), lo que obliga a un 301.
- Las 3 categorías con posts son indexables (`index, follow`) pero no están en ningún
  sitemap (`category-sitemap.xml` es 404).
- `/author/admin/` está expuesto públicamente (noindex) y revela el usuario `admin`.
- Las páginas WP incluyen el `<noscript>` de GTM (`GTM-WPNDKSR`) pero no cargan el script
  de GTM (que solo usan las landings). El clon reproduce exactamente eso.
- 4 imágenes de `/aviso-de-privacidad/` dan 404 también en vivo:
  `/wp-content/uploads/2020/09/{tabla-1,tabla-2,Tabla-3,TABLA-4}.png`.
- Las landings `/salud/` y `/turismo/` enlazan `landing_page_optimizada_todoip_bots.html`
  (ruta relativa), que es 404 en vivo.
- Las fuentes Geologica se cargan desde `beratung.vamtam.com` (dominio demo del tema
  VamTam), igual que en vivo.
- **Seguridad**: en `/reportes-telefonia/` hay dos formularios de acceso; uno envía a
  `https://telefonia.todoip.com/_autenticacion/login.php` y el otro a
  `https://telefonia.com/_autenticacion/login.php` (dominio ajeno a TodoIP). En vivo, quien
  use ese segundo formulario enviaría sus credenciales a un tercero. En el clon ambos están
  bloqueados.

## 4. Paridad visual

`scripts/test/visual.mjs`: capturas de página completa en vivo y en el clon, escritorio
1440×900 y móvil 390×844, con diff de píxeles (pixelmatch, umbral 0,15). Se ocultan en
ambos lados solo los elementos que cambian con el tiempo (fotograma del slideshow del
hero, palabra rotatoria del titular, iframes, popups). Resultados en
`artifacts/visual/report.json`.

| Métrica (38 URLs × 2 dispositivos = 76 capturas) | Resultado |
| --- | --- |
| Altura de página idéntica a la real | 76 / 76 |
| Diferencia de píxeles 0 % | 66 / 76 |
| Diferencia < 0,1 % | 73 / 76 |
| Diferencia máxima | 0,29 % (`/lectura-inteligente-de-documentos/` móvil; antialiasing de texto) |
| Errores de consola en el clon | solo las 4 imágenes de `/aviso-de-privacidad/` que también son 404 en vivo |

Diferencias pendientes conocidas: el slideshow del hero y el titular rotatorio de la home
están implementados, pero su fase depende del momento en que se mira (por eso se ocultan
en la comparación); el reCAPTCHA del formulario de la home se ve como un recuadro del mismo
tamaño (304×78) que indica que está pendiente de conexión, y al enviar un formulario aparece
un aviso que el sitio real no tiene.

Interacciones (`scripts/test/interactions.mjs`, mismo escenario en vivo y en el clon,
diff del viewport): menú mega al pasar el ratón (escritorio), header sticky al hacer
scroll, menú móvil abierto, submenú móvil, cambio de pestaña en tabs anidadas y menú del
botón flotante de WhatsApp: **0 % de diferencia en los 6 escenarios**.

Comportamientos de Elementor reimplementados sin jQuery ni WordPress
(`src/components/elementor/`): sticky, menú mega/n-menu, animaciones de entrada, fondos
lazy, motion effects (translateY), slideshow de fondo con fundido, tabs anidadas,
contadores, titular animado (blinds), popups (disparo por scroll), vídeos de YouTube,
botón flotante de WhatsApp, catálogo de productos y validaciones personalizadas de los
formularios.

## 5. Estado funcional honesto

| Elemento | Estado |
| --- | --- |
| Navegación, enlaces, anclas, feeds, sitemaps | Funcional |
| Menús, sticky, tabs, popups, vídeos, animaciones, FAB WhatsApp | Funcional |
| Enlaces a WhatsApp, Google Calendar, redes sociales | Funcional (enlaces externos originales) |
| Formulario "Schedule consultation" (home, Elementor + reCAPTCHA v2) | **Interfaz y validación sí; envío no.** Requiere backend (endpoint, correo/CRM) y una clave reCAPTCHA autorizada para el dominio. Muestra un aviso y no envía datos ni simula éxito |
| Formulario de referidos (`/referidos/`, Piotnet Forms) | Igual: requiere backend |
| Búsqueda (`elementor-search-form`, 33 páginas) | Interfaz sí; requiere un índice de búsqueda o backend |
| Login del portal de telefonía (`/reportes-telefonia/`) | Bloqueado; el portal externo `telefonia.todoip.com` no se tocó. Requiere decidir si se reactiva el envío directo (y corregir el `action` a `telefonia.com`) |
| Analítica (Site Kit GT-55JLXX5H, GA4 G-D2PT7HZGP2, Hotjar 6406092, GTM-WPNDKSR en landings) | Mismos snippets, solo en producción; desactivables con `SITE_DISABLE_TRACKING=1` |

## 6. Despliegue

- Preview en Vercel: **no publicado**. La integración de Vercel disponible (cuenta de Juan,
  plan Hobby) solo permite desplegar subiendo cada archivo por API (inviable con 48 MB de
  assets) o vinculando un proyecto de Vercel al repositorio Git. Este proyecto todavía no
  tiene repositorio publicado y no hay CLI/token de Vercel en el entorno. Paso requerido
  (cualquiera de los dos):
  1. Crear el repositorio del proyecto y autorizar que un proyecto de Vercel se conecte a
     él (despliegue de preview, sin dominio ni producción), o
  2. Añadir un secreto `VERCEL_TOKEN` para desplegar con `vercel deploy` (preview) sin
     conectar Git.
- En un preview de Vercel, `VERCEL_ENV=preview` activa automáticamente el noindex global.
- Producción futura: al construir con `VERCEL_ENV=production` se restauran los robots por
  URL. El dominio `*.vercel.app` de producción sigue con `X-Robots-Tag: noindex` hasta que
  el host sea `www.todoip.com`.

## 7. Riesgos para el cambio de DNS

No se puede garantizar efecto cero en rankings. Lo que se controló: URLs, estados,
redirecciones, metadatos, datos estructurados, sitemaps, enlaces e imágenes idénticos.
Lo que puede variar: rendimiento/Core Web Vitals (el HTML es estático, pero se mantienen
las hojas CSS originales de Elementor), `http → https` con 308 en vez de 301, y la 404 de
`/page/2/`. Recomendado: Search Console y monitorización de logs 404 tras el cambio.
