// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  // URL finale du site (sitemap, canonical, etc.)
  site: 'https://www.clartem.com',

  // URLs PROPRES (sans .html) : /a-propos/ au lieu de /a-propos.html.
  // Requis par le plan SEO (canonicals, maillage, sitemap calés sur les pretty URLs).
  build: { format: 'directory' },
  trailingSlash: 'always',

  // L'intégration Tailwind génère UNIQUEMENT les classes réellement utilisées.
  // Par défaut elle applique aussi le "reset" Tailwind (Preflight), exactement
  // comme le faisait le CDN Tailwind sur ton site actuel -> rendu identique.
  integrations: [tailwind()],
});
