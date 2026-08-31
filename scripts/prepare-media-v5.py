"""Prepare the supplied replacement video and logo for web delivery only."""
from pathlib import Path
from PIL import Image
import hashlib
import json
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/media'
VIDEO = Path(r'C:\Users\FernandodePaulaRodri\Downloads\Chef_plating_dish_for_video_202608311501.mp4')
LOGO = Path(r'C:\Users\FERNAN~1\AppData\Local\Temp\codex-clipboard-15c49ca2-2142-44f6-a9a3-876903ee3c72.png')
FFMPEG = ROOT / '.tools/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe'

# Preserve the native 720p video stream on desktop, removing only its audio.
base = [str(FFMPEG), '-hide_banner', '-loglevel', 'error', '-y']
subprocess.run(base + ['-i', str(VIDEO), '-an', '-c:v', 'copy', '-movflags', '+faststart', str(OUT / 'hero-desktop-v5.mp4')], check=True)
subprocess.run(base + ['-i', str(VIDEO), '-an', '-vf', 'scale=960:-2', '-c:v', 'libx264', '-preset', 'slow', '-crf', '24', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(OUT / 'hero-mobile-v5.mp4')], check=True)
frame = ROOT / '.tools/video-poster-v5.png'
subprocess.run(base + ['-ss', '0.5', '-i', str(VIDEO), '-frames:v', '1', str(frame)], check=True)
poster = Image.open(frame).convert('RGB')
poster.save(OUT / 'video-poster-v5.webp', quality=90, method=6)
poster.resize((960, 540), Image.Resampling.LANCZOS).save(OUT / 'video-poster-mobile-v5.webp', quality=87, method=6)

# Preserve the full transparent canvas and every part of the supplied artwork.
shutil.copyfile(LOGO, OUT / 'logo-header-v5.png')
logo = Image.open(LOGO)
for width in (192, 384):
    logo.resize((width, round(logo.height * width / logo.width)), Image.Resampling.LANCZOS).save(OUT / f'logo-header-v5-{width}.png', optimize=True)
assert LOGO.read_bytes() == (OUT / 'logo-header-v5.png').read_bytes()
manifest = json.loads((ROOT / 'media-manifest.json').read_text(encoding='utf-8'))
manifest['video'] = {'source_file': VIDEO.name, 'source_sha256': hashlib.sha256(VIDEO.read_bytes()).hexdigest(), 'source_resolution': [1280, 720], 'duration_seconds': 8, 'audio_removed': True, 'desktop': 'hero-desktop-v5.mp4', 'mobile': 'hero-mobile-v5.mp4', 'treatment': 'Desktop video stream copied without re-encoding; mobile downscaled to 960x540. No retouching or upscaling.'}
manifest['logo-header-v5'] = {'file': 'logo-header-v5.png', 'source_size': list(logo.size), 'responsive_widths': [192,384,1536], 'treatment': 'Exact supplied transparent PNG. Delivery downscaling only; no crop, recoloring or regeneration.'}
(ROOT / 'media-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print('New video, posters and transparent header logo prepared.')
