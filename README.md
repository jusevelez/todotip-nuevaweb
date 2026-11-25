# todoip.com en Next.js (migración tecnológica 1:1)

Clon de alta fidelidad de https://www.todoip.com construido con **Next.js 16 (App Router)**.
Objetivo: cambiar la tecnología (WordPress + Elementor → Next.js) **sin rediseño, sin
reescritura de contenido y sin cambios SEO**. CSS vanilla (las hojas originales de
WordPress/Elementor espejadas en sus rutas originales), sin Tailwind ni librerías de UI.

- 38 URLs públicas: 12 páginas del sitemap, 3 páginas WP fuera del sitemap, 15 posts,
  4 landings de ads (`/bots/ /salud/ /cobranzas/ /turismo/`, `noindex, follow`),
  3 categorías enlazadas, `/author/admin/` y `/category/uncategorized/`, más la 404 de WP.
- Archivos SEO servidos byte a byte: `robots.txt`, `llms.txt`, `sitemap_index.xml`,
  `page-sitemap.xml`, `post-sitemap.xml`, `main-sitemap.xsl`, `/feed/`, `/comments/feed/`
  y los 19 feeds RSS por post/categoría/autor anunciados en `<head>`.
- Redirecciones 301 iguales al sitio real: `todoip.com → www`, URL sin barra final → con
  barra, `/sitemap.xml` y `/wp-sitemap.xml → /sitemap_index.xml`.

El informe de paridad (cobertura, diferencias SEO/visuales, dependencias de backend y
contradicciones del baseline) está en [`docs/MIGRACION-REPORTE.md`](docs/MIGRACION-REPORTE.md).

## Ejecutar en local

```bash
npm install
npm run dev            # http://127.0.0.1:4317 (modo preview: todo noindex)
npm run build && npm start   # build de producción en http://127.0.0.1:4318
```

## Guardas de indexación

Este repo **no es el sitio oficial** (ese irá en `github.com/todoip/website`). En todos los
entornos — preview, local y producción, incluido `www.todoip.com` si el DNS sigue aquí —
el clon va con `noindex, nofollow` global: meta, `X-Robots-Tag` y `robots.txt` con
`Disallow: /`. Los sitemaps se siguen sirviendo (mismas rutas) con `X-Robots-Tag`.

- `SITE_DISABLE_TRACKING=1` desactiva GTM/GA4/Site Kit/Hotjar (que solo se cargan en
  producción). Recomendado en cualquier despliegue de producción previo al cambio de DNS,
  para no mezclar tráfico de prueba con la analítica real.

## Formularios

Los formularios de contacto conservan su interfaz y validación, pero **no envían nada**: el envío se
bloquea y se muestra un aviso honesto (sin simular éxito). Conectarlos requiere un backend
(ver informe). El reCAPTCHA v2 muestra un marcador del mismo tamaño porque su clave está
ligada al dominio real.

Excepción: el login de **Acceso Clientes** en `/reportes-telefonia/` hace POST nativo
(`application/x-www-form-urlencoded`) a `https://telefonia.todoip.com/_autenticacion/login.php`.

## Cómo se generó

```text
scripts/capture/   crawl público (solo GET) del sitio + assets + sondas lentas de estado/redirecciones
capture/           HTML capturado, archivos SEO, manifest (fuente de verdad del clon)
scripts/generate/  HTML capturado → componentes TSX reales (src/generated/**, landings)
src/components/elementor/  runtime vanilla que reemplaza el JS de Elementor/plugins
```

```bash
npm run capture     # vuelve a capturar el sitio público (lento, respeta el rate limit)
npm run generate    # regenera los componentes desde capture/
```

## Pruebas

Con un build servido (por ejemplo `npm start`), y para producción un build aparte:
`SITE_ENV=production SITE_DISABLE_TRACKING=1 NEXT_DIST_DIR=.next-prod npm run build`
y `... NEXT_DIST_DIR=.next-prod npx next start -p 4319`.

```bash
npm run test:seo -- --clone http://127.0.0.1:4319 --mode production   # metadatos por URL vs sitio real
npm run test:seo -- --clone http://127.0.0.1:4318 --mode preview      # guardas noindex
npm run test:links -- --clone http://127.0.0.1:4319                   # enlaces y assets internos
npm run test:visual -- --clone http://127.0.0.1:4318                  # capturas desktop/móvil vs sitio real
node scripts/test/interactions.mjs --clone http://127.0.0.1:4319      # menú, sticky, tabs, FAB, formularios
node scripts/test/layout-diff.mjs /ruta/ desktop --clone http://127.0.0.1:4318
```

Las pruebas contra el sitio real hacen pocas peticiones y con pausas (el hosting aplica
rate limit 429). Resultados en `artifacts/`.
