// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { readFileSync } from 'node:fs';

const site = 'https://edunnova.com.mx';
// Absoluta: con trailingSlash 'always', Astro convertiría '/rss.xml' en '/rss.xml/'
const feed = `${site}/rss.xml`;
const posts = JSON.parse(readFileSync(new URL('./src/data/posts.json', import.meta.url), 'utf-8'));

export default defineConfig({
  site,
  server: { port: 4323 },
  // Las URLs de WordPress terminan en "/" (edunnova.com.mx/servicios/); se conservan igual
  trailingSlash: 'always',
  // Direcciones que existían en WordPress y ya no tienen página propia
  redirects: {
    '/home/': '/',
    '/feed/': feed,
    '/comments/feed/': feed,
    // Cada nota tenía su feed de comentarios; se manda a la nota
    ...Object.fromEntries(posts.map((p) => [`/${p.slug}/feed/`, `/${p.slug}/`])),
  },
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});
