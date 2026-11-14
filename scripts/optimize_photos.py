"""Turn your original photos into optimised WebP files used by the site.

Usage:  python3 scripts/optimize_photos.py path/to/hero-photo.jpg path/to/about-photo.jpg
        (pass one file to use the same photo for both slots)
Writes: public/assets/photos/hero.webp  (800x1000) and about.webp (750x940)
Requires: pip install pillow
"""
import sys
from pathlib import Path
from PIL import Image, ImageOps

OUT = Path(__file__).resolve().parent.parent / 'public' / 'assets' / 'photos'
SIZES = {'hero': (800, 1000), 'about': (750, 940)}

def make(src, name):
    im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
    im = ImageOps.fit(im, SIZES[name], method=Image.LANCZOS, centering=(0.5, 0.3))
    OUT.mkdir(parents=True, exist_ok=True)
    im.save(OUT / f'{name}.webp', 'WEBP', quality=82, method=6)
    print('wrote', OUT / f'{name}.webp')

if __name__ == '__main__':
    files = sys.argv[1:]
    if not files:
        sys.exit(__doc__)
    make(files[0], 'hero')
    make(files[1] if len(files) > 1 else files[0], 'about')
