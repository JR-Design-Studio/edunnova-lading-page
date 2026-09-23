// Elementor (renderizado) -> bloques ordenados por página, con fondos de sección resueltos desde su CSS
const fs = require('fs');

const decode = (s) =>
  s
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;|&#039;|&rsquo;/g, "'")
    .replace(/&#8220;|&#8221;|&ldquo;|&rdquo;/g, '"')
    .replace(/&#8211;|&ndash;/g, '–')
    .replace(/&#8212;|&mdash;/g, '—')
    .replace(/&#8230;|&hellip;/g, '…')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n))
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*/g, '\n')
    .trim();

// data-id -> imagen de fondo, desde los CSS de Elementor
const bg = {};
for (const f of fs.readdirSync('css')) {
  const css = fs.readFileSync('css/' + f, 'utf8');
  for (const m of css.matchAll(/\.elementor-element-([a-z0-9]+)(?:[^{]*)\{[^}]*background-image:\s*url\("?([^")]+)"?\)/g)) {
    bg[m[1]] ??= m[2];
  }
}

const pageNames = fs.readdirSync('pages').map((f) => f.replace('.html', ''));
const out = {};
const allImgs = new Set();

for (const name of pageNames) {
  const html = fs.readFileSync(`pages/${name}.html`, 'utf8');
  const start = html.search(/data-elementor-type="wp-(page|post)"/);
  let body = start >= 0 ? html.slice(start) : html;
  const endFooter = body.search(/data-elementor-type="footer"|<footer/);
  if (endFooter > 0) body = body.slice(0, endFooter);

  const blocks = [];
  const re =
    /data-id="([a-z0-9]+)"[^>]*data-element_type="(container|section|column)"|<(h[1-6])[^>]*>([\s\S]*?)<\/\3>|<(p|li)(?:\s[^>]*)?>([\s\S]*?)<\/\5>|<img[^>]+src="([^"]+)"[^>]*>|<a[^>]+href="([^"]*)"[^>]*class="[^"]*elementor-button[^"]*"[^>]*>([\s\S]*?)<\/a>|<span class="elementor-counter-number[^"]*"[^>]*data-to-value="([^"]+)"|<iframe[^>]+src="([^"]+)"|<video[^>]+src="([^"]+)"/g;
  let m;
  while ((m = re.exec(body))) {
    if (m[1]) {
      if (bg[m[1]]) {
        blocks.push({ t: 'bg', src: bg[m[1]] });
        allImgs.add(bg[m[1]]);
      }
    } else if (m[3]) {
      const text = decode(m[4]);
      if (text) blocks.push({ t: m[3], text });
    } else if (m[5]) {
      const text = decode(m[6]);
      if (text) blocks.push({ t: m[5], text });
    } else if (m[7]) {
      if (m[7].startsWith('data:')) continue;
      const alt = (m[0].match(/alt="([^"]*)"/) || [])[1] || '';
      blocks.push({ t: 'img', src: m[7], alt: decode(alt) });
      allImgs.add(m[7]);
    } else if (m[8] !== undefined) {
      blocks.push({ t: 'button', href: m[8], text: decode(m[9]) });
    } else if (m[10]) {
      blocks.push({ t: 'counter', value: m[10] });
    } else if (m[11]) {
      blocks.push({ t: 'iframe', src: m[11] });
    } else if (m[12]) {
      blocks.push({ t: 'video', src: m[12] });
      allImgs.add(m[12]);
    }
  }
  const title = decode((html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '');
  const description = decode((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '');
  const date = (html.match(/"datePublished":"([^"]+)"/) || [])[1];
  out[name] = { title, description, date, blocks };
}

// Encabezado y pie (plantilla global)
const home = fs.readFileSync('pages/home.html', 'utf8');
const head = home.slice(0, home.search(/data-elementor-type="wp-page"/));
const foot = home.slice(home.search(/data-elementor-type="footer"|<footer/));
out._chrome = {
  logos: [...new Set([...head.matchAll(/<img[^>]+src="([^"]+)"/g)].map((x) => x[1]))],
  nav: [...new Set([...head.matchAll(/<a[^>]+href="(https:\/\/edunnova\.com\.mx[^"]*)"[^>]*>([\s\S]*?)<\/a>/g)].map((x) => x[1] + ' | ' + decode(x[2])))],
  footerText: decode(foot.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, '')).slice(0, 1500),
  footerImgs: [...new Set([...foot.matchAll(/<img[^>]+src="([^"]+)"/g)].map((x) => x[1]))],
  footerLinks: [...new Set([...foot.matchAll(/<a[^>]+href="([^"]+)"/g)].map((x) => x[1]))],
};
for (const u of [...out._chrome.logos, ...out._chrome.footerImgs]) allImgs.add(u);

fs.writeFileSync('content.json', JSON.stringify(out, null, 2));
fs.writeFileSync('used-images.txt', [...allImgs].filter((u) => u.startsWith('http')).join('\n'));
console.log('pages', Object.keys(out).length - 1, '| used media', [...allImgs].length);
