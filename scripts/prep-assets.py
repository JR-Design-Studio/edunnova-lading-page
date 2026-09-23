"""Organiza la multimedia descargada de edunnova.com.mx dentro del proyecto Astro.

- Imágenes de páginas -> src/assets/ (Astro las optimiza)
- Fotos de las notas del blog -> public/media/posts/<slug>/ en WebP (el HTML de las notas las usa tal cual)
- Tipografía Blauer Nue -> public/fonts/
- src/data/posts.json con el contenido limpio de cada nota
"""
import json, os, re, shutil, sys
from html import unescape
from PIL import Image

SRC = sys.argv[1]  # carpeta con media/, posts.json, icons/, girl-cutout.png
PROJ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UP = os.path.join(SRC, 'media')
A = os.path.join(PROJ, 'src', 'assets')

def put(src_rel, dst_rel):
    dst = os.path.join(A, dst_rel)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.copyfile(os.path.join(UP, src_rel) if not os.path.isabs(src_rel) else src_rel, dst)

# --- Marca e ilustraciones ---------------------------------------------------
put('2024/12/Logotipo.webp', 'brand/logo-horizontal.webp')          # texto blanco: fondos oscuros
put('2024/12/VariacionLogotipo.webp', 'brand/logo-stacked.webp')    # texto oscuro: fondos claros
put('2026/01/logo_EI-4.png', 'brand/red-conocer-evaluador.png')
put(os.path.join(SRC, 'girl-cutout.png'), 'hero/estudiante.png')

ill = {
    'ilustracion01.webp': 'web-cohete', 'ilustracion02.webp': 'persona-laptop',
    'Ilustracion03.webp': 'manos-choque', 'Ilustracion04-01.webp': 'persona-computadora',
    'Ilustracion05.webp': 'abrazo-mundo',
}
for f, n in ill.items():
    put(f'2024/12/{f}', f'illustrations/{n}.webp')
for num, n in {'09': 'certificacion', '32': 'consultoria', '17': 'capacitacion',
               '21': 'incluye', '16': 'proceso', '04': 'recursos'}.items():
    put(f'2026/07/Business-concepts-03-{num}.png', f'illustrations/concepto-{n}.png')

for f in os.listdir(os.path.join(SRC, 'icons')):
    put(os.path.join(SRC, 'icons', f), f'icons/{f}')
for f, n in {'empresa.webp': 'empresas', 'instituciones-educativas.webp': 'instituciones-educativas',
             'organismo-gubernamentales.webp': 'gobierno'}.items():
    put(f'2024/12/{f}', f'icons/vinculacion-{n}.webp')

# Fotos reales usadas como fondo de las tarjetas de servicios
put('2026/02/625755822_122160030128622236_3001060374027126166_n-2.jpg', 'photos/certificacion-grupo.jpg')
put('2026/07/540741279_122146926458622236_899244939408775852_n.jpg', 'photos/capacitacion-aula.jpg')
put('2026/07/638769899_122161224440622236_4858313990755940064_n.jpg', 'photos/consultoria-reunion.jpg')

# --- Tipografía --------------------------------------------------------------
fonts = os.path.join(PROJ, 'public', 'fonts')
os.makedirs(fonts, exist_ok=True)
for w in ('Regular', 'Bold', 'ExtraBold'):
    shutil.copyfile(os.path.join(UP, 'fonts', f'BlauerNue-{w}.ttf'), os.path.join(fonts, f'BlauerNue-{w}.ttf'))

# --- Notas del blog ----------------------------------------------------------
posts = json.load(open(os.path.join(SRC, 'posts.json'), encoding='utf-8'))
out = []
for p in posts:
    slug = p['slug']
    html = p['content']['rendered']
    pdir = os.path.join(PROJ, 'public', 'media', 'posts', slug)
    os.makedirs(pdir, exist_ok=True)
    images = []

    def local_img(m):
        tag = m.group(0)
        src = re.search(r'src="([^"]+)"', tag).group(1)
        orig = re.sub(r'-\d+x\d+(\.\w+)$', r'\1', src.split('?')[0])
        rel = orig.split('/wp-content/uploads/')[1]
        name = f'{len(images) + 1:02d}.webp'
        im = Image.open(os.path.join(UP, rel)).convert('RGB')
        im.thumbnail((1600, 1600))
        im.save(os.path.join(pdir, name), 'WEBP', quality=80)
        images.append({'src': f'/media/posts/{slug}/{name}', 'width': im.width, 'height': im.height})
        alt = unescape(re.search(r'alt="([^"]*)"', tag).group(1)) if 'alt="' in tag else ''
        return f'<img src="/media/posts/{slug}/{name}" width="{im.width}" height="{im.height}" alt="{alt}" loading="lazy" decoding="async">'

    html = re.sub(r'<img[^>]+>', local_img, html)
    # limpiar clases/estilos de WordPress y envoltorios vacíos
    html = re.sub(r'\s(class|style|id|data-[\w-]+)="[^"]*"', '', html)
    html = re.sub(r'<hr[^>]*>', '', html)
    html = re.sub(r'<div>\s*</div>', '', html)
    html = re.sub(r'\n{2,}', '\n', html).strip()
    # varias fotos seguidas -> galería
    html = re.sub(r'((?:<figure>\s*<img[^>]+>\s*(?:<figcaption>.*?</figcaption>)?\s*</figure>\s*){2,})',
                  lambda m: f'<div class="gallery">{m.group(1)}</div>', html, flags=re.S)

    text = re.sub(r'<[^>]+>', ' ', html)
    excerpt = unescape(re.sub(r'\s+', ' ', unescape(re.sub(r'<[^>]+>', ' ', p['excerpt']['rendered']))).strip())
    out.append({
        'slug': slug,
        'title': unescape(p['title']['rendered']),
        'date': p['date'],
        'excerpt': excerpt.replace('[…]', '…').replace(' […]', '…'),
        'cover': images[0] if images else None,
        'images': len(images),
        'words': len(text.split()),
        'html': html,
    })
    print(f"{slug[:50]:50} imgs={len(images):2} words={out[-1]['words']}")

os.makedirs(os.path.join(PROJ, 'src', 'data'), exist_ok=True)
json.dump(sorted(out, key=lambda x: x['date'], reverse=True),
          open(os.path.join(PROJ, 'src', 'data', 'posts.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
