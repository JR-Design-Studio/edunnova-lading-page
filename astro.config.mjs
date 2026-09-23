// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://edunnova.com.mx',
  server: { port: 4323 },
  // Las URLs de WordPress terminan en "/" (edunnova.com.mx/servicios/); se conservan igual
  trailingSlash: 'always',
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
