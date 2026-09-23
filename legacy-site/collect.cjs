// Reúne toda la multimedia que realmente usa el sitio y la normaliza a su archivo original
const fs = require('fs');
const urls = new Set();
const add = (u) => {
  if (!u || !u.includes('/wp-content/uploads/') || u.includes('/elementor/')) return;
  u = u.split('?')[0].replace(/&#038;|&amp;/g, '&');
  // quita el sufijo de tamaño de WordPress: foto-1024x682.jpg -> foto.jpg
  urls.add(u.replace(/-\d+x\d+(\.\w+)$/, '$1'));
};

for (const f of fs.readdirSync('pages')) {
  const h = fs.readFileSync('pages/' + f, 'utf8');
  for (const m of h.matchAll(/<img[^>]+src="([^"]+)"/g)) add(m[1]);
  for (const m of h.matchAll(/background-image:\s*url\(([^)]+)\)/g)) add(m[1].replace(/["']/g, ''));
  for (const m of h.matchAll(/<(?:video|source)[^>]+src="([^"]+)"/g)) add(m[1]);
}
for (const f of fs.readdirSync('css')) {
  const css = fs.readFileSync('css/' + f, 'utf8');
  for (const m of css.matchAll(/url\("?([^")]+)"?\)/g)) add(m[1]);
}
const posts = JSON.parse(fs.readFileSync('posts.json', 'utf8'));
for (const p of posts) for (const m of p.content.rendered.matchAll(/<img[^>]+src="([^"]+)"/g)) add(m[1]);

const list = [...urls].sort();
fs.writeFileSync('media-urls.txt', list.join('\n'));
console.log(list.length + ' archivos');
for (const u of list) console.log(u.replace('https://edunnova.com.mx/wp-content/uploads/', ''));
