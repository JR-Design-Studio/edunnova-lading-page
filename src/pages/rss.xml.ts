import type { APIRoute } from 'astro';
import { posts } from '../data/posts';

// Feed RSS de Enlace; WordPress lo servía en /feed/ (redirigido aquí en astro.config.mjs)
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = ({ site }) => {
  const abs = (path: string) => new URL(path, site).href;
  const items = [...posts]
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${abs(`/${p.slug}/`)}</link>
      <guid isPermaLink="true">${abs(`/${p.slug}/`)}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${esc(p.excerpt)}</description>
    </item>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Enlace | Edunnova</title>
    <link>${abs('/red-edunnova/')}</link>
    <atom:link href="${abs('/rss.xml')}" rel="self" type="application/rss+xml" />
    <description>Convenios, capacitaciones, certificaciones y artículos de Edunnova sobre educación continua.</description>
    <language>es-MX</language>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
