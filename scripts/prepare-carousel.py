"""Delivery resizing only. Supplied photographs are not retouched or upscaled."""
from pathlib import Path
from PIL import Image, ImageOps
import json
import shutil

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path('C:/Users/FERNAN~1/AppData/Local/Temp')
OUT = ROOT / 'assets/media'
photos = {
    'experiencia-feijoada': '6f422d70-dbd1-47b8-ab1c-e1a9276fa66e',
    'experiencia-churrasco': 'e69461d0-9717-4809-a13f-ba9cd868542e',
    'experiencia-buffet': '8ff99598-3a6a-4fad-8836-f22ed823fac3',
    'experiencia-encontro': 'd157a45b-cb53-4689-9acc-806e61b9273b',
    'experiencia-frescor': '24a0a8e2-b35d-4644-94ed-20b47305bcad',
    'experiencia-entradas': '253794e7-abe0-47ec-a58b-d144e4c2f9a0'
}
manifest = json.loads((ROOT / 'media-manifest.json').read_text(encoding='utf-8'))
for name, identifier in photos.items():
    source = ImageOps.exif_transpose(Image.open(SOURCE / f'codex-clipboard-{identifier}.png')).convert('RGB')
    source.save(OUT / f'{name}-original.webp', lossless=True, exact=True, method=6)
    widths = [640, 960]
    for width in widths:
        size = (width, round(source.height * width / source.width))
        source.resize(size, Image.Resampling.LANCZOS).save(OUT / f'{name}-{width}.webp', quality=92, method=6)
    manifest[name] = {'source_size': list(source.size), 'file': f'{name}-original.webp', 'responsive_widths': widths + [source.width], 'treatment': 'Supplied image, lossless native-size master; delivery downscaling only, no retouching or upscale'}
    print(name, source.size)

logo_source = SOURCE / 'codex-clipboard-db896171-11f1-4e12-9f4d-89e6ecb908be.png'
shutil.copyfile(logo_source, OUT / 'logo-footer-v4.png')
logo = Image.open(logo_source)
for width in (384, 768):
    logo.resize((width, round(logo.height * width / logo.width)), Image.Resampling.LANCZOS).save(OUT / f'logo-footer-v4-{width}.png', optimize=True)
assert logo_source.read_bytes() == (OUT / 'logo-footer-v4.png').read_bytes()
manifest['logo-footer-v4'] = {'source_size': list(logo.size), 'file': 'logo-footer-v4.png', 'responsive_widths': [384, 768, logo.width], 'treatment': 'Exact supplied PNG with transparency, resized PNG delivery variants'}
(ROOT / 'media-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
