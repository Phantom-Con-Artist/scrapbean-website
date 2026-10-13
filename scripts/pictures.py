"""Prepares the website's pictures. Run from the repository root: python3 scrapbean-website/scripts/pictures.py

- assets/hand-drawn/*.png  -> public/art/*.webp, cropped to the drawing
- promotion/screens/*.png  -> public/shots/<name>-640.webp and -1280.webp (only when promotion/ is there)
- public/media/*.jpg       -> made no wider than 1152 px, the most a video's first picture is ever shown at
"""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SITE = ROOT / 'scrapbean-website' / 'public'

# Screenshot in promotion/screens/ -> the name the site uses.
SHOTS = {
    'scrapbook-2-beach-days': 'holiday', 'scrapbook-1-getting-there': 'holiday-arrival', 'lifebook-1-week-one': 'baby',
    'diary-1-first-two-weeks': 'diary', 'notes-1-cell-structure': 'notes', 'thinking-1-should-i-take-it-': 'thinking',
    'planning-1-four-weeks-out': 'planning', 'recipes-1-weekend-sourdough': 'recipes', 'money-1-bills': 'money',
    'lists-1-watching-now': 'lists', 'lists-3-reaction-folder': 'reactions', 'moving-1-pepper-at-home': 'pets',
    'moving-2-a-wet-sunday': 'sound', 'hobby-garden-2-harvest': 'garden', 'library': 'library',
    'mode-reading': 'mode-reading', 'mode-edit': 'mode-edit', 'mode-customize-themes': 'mode-customize-themes',
    'mode-customize-backgrounds': 'mode-customize-backgrounds', 'mode-customize-stickers': 'mode-customize-stickers',
    'mode-customize-border': 'mode-customize-border', 'mode-customize-note': 'mode-customize-note',
}
CLOSE_UPS = {'mode-customize-backgrounds', 'mode-customize-stickers', 'mode-customize-border', 'mode-customize-note'}
# The strip at the top of a screenshot that holds the window's own buttons.
TITLE_BAR = 34


def drawings():
    for file in sorted((ROOT / 'assets' / 'hand-drawn').glob('*.png')):
        name = 'scrapbean-wordmark' if file.stem == 'scarpbean' else file.stem
        picture = Image.open(file).convert('RGBA')
        left, top, right, bottom = picture.getchannel('A').point(lambda alpha: 255 if alpha > 12 else 0).getbbox()
        picture = picture.crop((max(0, left - 6), max(0, top - 6), min(picture.width, right + 6), min(picture.height, bottom + 6)))
        picture.save(SITE / 'art' / f'{name}.webp', quality=92, method=6)
        print('art', name, picture.size)


def shots():
    screens = ROOT / 'promotion' / 'screens'
    if not screens.is_dir():
        print('promotion/screens is not here; screenshots left as they are')
        return
    for source, name in SHOTS.items():
        picture = Image.open(screens / f'{source}.png').convert('RGB')
        # Pictures of the whole window keep their top strip; pictures of a page lose it.
        if name != 'library' and not name.startswith('mode-'):
            picture = picture.crop((0, TITLE_BAR, picture.width, picture.height))
        # The four close-ups of Customize show the panel and the part of the page beside it, so the panel can be read.
        if name in CLOSE_UPS:
            picture = picture.crop((round(picture.width * 0.44), 0, picture.width, picture.height))
        for width in (1280, 640):
            small = picture.resize((width, round(picture.height * width / picture.width)), Image.LANCZOS)
            small.save(SITE / 'shots' / f'{name}-{width}.webp', quality=78, method=6)
        print('shot', name)


def posters():
    for file in sorted((SITE / 'media').glob('*.jpg')):
        picture = Image.open(file)
        if picture.width <= 1152:
            continue
        picture.convert('RGB').resize((1152, round(picture.height * 1152 / picture.width)), Image.LANCZOS).save(file, quality=80, optimize=True, progressive=True)
        print('poster', file.name)


if __name__ == '__main__':
    for folder in ('art', 'shots'):
        (SITE / folder).mkdir(parents=True, exist_ok=True)
    drawings()
    shots()
    posters()
