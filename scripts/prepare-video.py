"""Prepare a supplied background video with cache-safe responsive assets."""
from pathlib import Path
from PIL import Image
import argparse
import hashlib
import json
import re
import subprocess

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('source', type=Path)
parser.add_argument('revision')
args = parser.parse_args()
if not re.fullmatch(r'v\d+', args.revision):
    parser.error('Revision must be v followed by a number')
source = args.source.resolve(strict=True)
out = ROOT / 'assets/media'
ffmpeg = ROOT / '.tools/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe'
base = [str(ffmpeg), '-hide_banner', '-loglevel', 'error', '-y']

frame = ROOT / '.tools' / f'video-poster-{args.revision}.png'
subprocess.run(base + ['-ss', '0.5', '-i', str(source), '-frames:v', '1', str(frame)], check=True)
poster = Image.open(frame).convert('RGB')
mobile_width = min(1280, poster.width)
mobile_height = round(poster.height * mobile_width / poster.width / 2) * 2
desktop = f'hero-desktop-{args.revision}.mp4'
mobile = f'hero-mobile-{args.revision}.mp4'
subprocess.run(base + ['-i', str(source), '-an', '-c:v', 'copy', '-movflags', '+faststart', str(out / desktop)], check=True)
subprocess.run(base + ['-i', str(source), '-an', '-vf', f'scale={mobile_width}:{mobile_height}', '-c:v', 'libx264', '-preset', 'slow', '-crf', '24', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', str(out / mobile)], check=True)
poster.save(out / f'video-poster-{args.revision}.webp', quality=90, method=6)
poster.resize((mobile_width, mobile_height), Image.Resampling.LANCZOS).save(out / f'video-poster-mobile-{args.revision}.webp', quality=87, method=6)

manifest = json.loads((ROOT / 'media-manifest.json').read_text(encoding='utf-8'))
manifest['video'] = {
    'source_file': source.name,
    'source_sha256': hashlib.sha256(source.read_bytes()).hexdigest(),
    'source_resolution': list(poster.size),
    'mobile_resolution': [mobile_width, mobile_height],
    'audio_removed': True,
    'desktop': desktop,
    'mobile': mobile,
    'treatment': 'New supplied footage. Native desktop video stream; optimized smaller mobile delivery. Silent background playback, no upscaling.'
}
(ROOT / 'media-manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'New background video: {poster.width}x{poster.height}; mobile {mobile_width}x{mobile_height}.')
