"""Delivery-only resizing/encoding; artistic edits were made with ImageGen."""
from pathlib import Path
import json
import shutil
import subprocess
import sys
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / '.tools'))
import imageio_ffmpeg

GENERATED = Path(r'C:\Users\FernandodePaulaRodri\.codex\generated_images\01a044bf-d25f-7a02-ac76-d2c27ad61daf')
OUT = ROOT / 'assets' / 'media'
OUT.mkdir(parents=True, exist_ok=True)
items = {
    'tempero': 'exec-a5834b18-1fb7-4073-a534-672f8044f609.png',
    'mesa': 'exec-5e8d7483-5bfc-44ad-be01-f2735d11746c.png',
    'coffee': 'exec-a4209e8d-a43c-454b-8c44-2bfeb6c5c534.png',
    'feijoada': 'exec-2ce529bb-a4bd-4eda-a203-184123c3e7a7.png',
    'picnic': 'exec-37ed0e88-844a-4623-8f7f-d0c02547346e.png',
    'buffet': 'exec-aac33e71-4db0-479e-a9e0-0f476458ea6f.png',
    'canapes': 'exec-d8b27878-1926-444a-8765-74877a12be2c.png',
    'burgers': 'exec-1376fdc3-08c9-49c8-81f9-762e2c33b688.png',
    'hero': 'exec-c7c07bf3-9bed-4fd0-a860-c46c06e550e1.png'
}
manifest = {}
for name, filename in items.items():
    source = ImageOps.exif_transpose(Image.open(GENERATED / filename)).convert('RGB')
    # Preserve aspect ratio. 4K here means 3840 pixels on the longest edge.
    scale = 3840 / max(source.size)
    size = tuple(round(d * scale) for d in source.size)
    master = source.resize(size, Image.Resampling.LANCZOS)
    master.save(OUT / f'{name}-4k.webp', quality=93, method=6)
    for width in (640, 1280, 1920):
        if width < size[0]:
            delivery = master.resize((width, round(size[1] * width / size[0])), Image.Resampling.LANCZOS)
            delivery.save(OUT / f'{name}-{width}.webp', quality=85, method=6)
    manifest[name] = {'generated_size': list(source.size), 'export_size': list(size), 'file': f'{name}-4k.webp', 'treatment': 'AI edit + upscale; not native 4K'}

chef = Image.open(r'C:\Users\FernandodePaulaRodri\Downloads\ChatGPT Image 30 de ago. de 2026, 20_02_23.png').convert('RGB')
for size in (640, 1254):
    chef.resize((size, size), Image.Resampling.LANCZOS).save(OUT / f'chef-{size}.webp', quality=91, method=6)
chef.resize((3840, 3840), Image.Resampling.LANCZOS).save(OUT / 'chef-4k.webp', quality=93, method=6)
manifest['chef'] = {'source_size': list(chef.size), 'export_size': [3840,3840], 'treatment': 'Exact supplied portrait; delivery resize only'}

# Keep the complete supplied logo, including original proportions and background.
logo = Image.open(ROOT / 'assets' / 'logo-reinaldo-quoos.png').convert('RGB')
logo.save(OUT / 'logo.webp', quality=98, method=6)
logo.resize((3840, round(3840 * logo.height / logo.width)), Image.Resampling.LANCZOS).save(OUT / 'logo-4k.webp', quality=96, method=6)

# The provided pepper already has an alpha channel: retain it, do not regenerate.
pepper = Image.open(r'C:\Users\FERNAN~1\AppData\Local\Temp\codex-clipboard-6c618215-6248-4387-aba5-f8671409dc6a.png').convert('RGBA')
pepper = pepper.crop(pepper.getchannel('A').getbbox())
icon = Image.new('RGBA', (512,512), (0,0,0,0))
pepper.thumbnail((480,480), Image.Resampling.LANCZOS)
icon.alpha_composite(pepper, ((512-pepper.width)//2, (512-pepper.height)//2))
for size in (32,64,180,192,512):
    icon.resize((size,size), Image.Resampling.LANCZOS).save(OUT / f'pepper-{size}.png')
icon.save(OUT / 'favicon.ico', sizes=[(16,16),(32,32),(48,48),(64,64)])

ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
video = r'C:\Users\FernandodePaulaRodri\Downloads\Chef_plating_dish_for_video_202608302002.mp4'
for width, label, crf in ((1920,'desktop',23),(960,'mobile',25)):
    subprocess.run([ffmpeg,'-hide_banner','-loglevel','error','-y','-i',video,'-an','-vf',f'scale={width}:-2','-c:v','libx264','-preset','slow','-crf',str(crf),'-pix_fmt','yuv420p','-movflags','+faststart',str(OUT / f'hero-{label}.mp4')], check=True)
subprocess.run([ffmpeg,'-hide_banner','-loglevel','error','-y','-ss','0.5','-i',video,'-frames:v','1','-q:v','2',str(OUT / 'video-poster.jpg')],check=True)
poster = Image.open(OUT / 'video-poster.jpg').convert('RGB')
poster.save(OUT / 'video-poster.webp', quality=89, method=6)
poster.resize((960,540), Image.Resampling.LANCZOS).save(OUT / 'video-poster-mobile.webp', quality=85, method=6)
manifest['video'] = {'source_resolution': [1920,1080], 'duration_seconds': 8, 'audio_removed': True, 'desktop': 'hero-desktop.mp4', 'mobile': 'hero-mobile.mp4', 'native_4k': False}
(ROOT / 'media-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(manifest,ensure_ascii=False,indent=2))
