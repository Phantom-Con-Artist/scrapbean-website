"""Prepares the website's pictures. Run from the repository root: python3 apps/website/scripts/pictures.py

- assets/hand-drawn/*.png  -> public/art/*.webp, cropped to the drawing
- promotion/screens/*.png  -> public/shots/<name>-640.webp and -1280.webp (only when promotion/ is there)
- promotion/phone/*.png    -> public/shots/phone-<name>-360.webp and -720.webp (made by npm run videos:phone)
- public/media/*.jpg       -> made no wider than 1152 px, the most a video's first picture is ever shown at

Give the names of the steps to run only those: python3 apps/website/scripts/pictures.py phones
"""
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[3]
SITE = ROOT / 'apps' / 'website' / 'public'

# Screenshot in promotion/screens/ -> the name the site uses.
SHOTS = {
    'scrapbook-2-beach-days': 'holiday', 'scrapbook-1-getting-there': 'holiday-arrival', 'lifebook-1-week-one': 'baby',
    'diary-1-first-two-weeks': 'diary', 'notes-1-cell-structure': 'notes', 'thinking-1-should-i-take-it-': 'thinking',
    'planning-1-four-weeks-out': 'planning', 'recipes-1-weekend-sourdough': 'recipes', 'money-1-bills': 'money',
    'lists-1-watching-now': 'lists', 'lists-3-reaction-folder': 'reactions', 'moving-1-pepper-at-home': 'pets',
    'moving-2-a-wet-sunday': 'sound', 'hobby-garden-2-harvest': 'garden', 'library': 'library',
    'mode-reading': 'mode-reading', 'mode-edit': 'mode-edit', 'mode-customize-themes': 'mode-customize-themes',
    'mode-customize-backgrounds': 'mode-customize-backgrounds', 'mode-customize-stickers': 'mode-customize-stickers',
    'mode-customize-border': 'mode-customize-border', 'mode-customize-note': 'mode-customize-note', 'mode-save': 'mode-save',
    'plugins-allowed': 'plugins-allowed', 'plugins-question': 'plugins-question', 'plugins-picture-converter': 'plugins-picture-converter',
}
# Pictures of a dialog show the dialog and a little of the page around it, so its words can be read.
CROPS = {'plugins-question': (400, 230, 1200, 730), 'plugins-allowed': (328, 0, 1288, 600)}
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
        if name != 'library' and not name.startswith(('mode-', 'plugins-')):
            picture = picture.crop((0, TITLE_BAR, picture.width, picture.height))
        if name in CROPS:
            picture = picture.crop(CROPS[name])
        # The four close-ups of Customize show the panel and the part of the page beside it, so the panel can be read.
        if name in CLOSE_UPS:
            picture = picture.crop((round(picture.width * 0.44), 0, picture.width, picture.height))
        for width in (1280, 640):
            small = picture.resize((width, round(picture.height * width / picture.width)), Image.LANCZOS)
            small.save(SITE / 'shots' / f'{name}-{width}.webp', quality=78, method=6)
        print('shot', name)


def phones():
    screens = ROOT / 'promotion' / 'phone'
    if not screens.is_dir():
        print('promotion/phone is not here; phone screenshots left as they are')
        return
    for file in sorted(screens.glob('*.png')):
        picture = Image.open(file).convert('RGB')
        for width in (720, 360):
            small = picture.resize((width, round(picture.height * width / picture.width)), Image.LANCZOS)
            small.save(SITE / 'shots' / f'phone-{file.stem}-{width}.webp', quality=80, method=6)
        print('phone', file.stem)


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
    steps = {'drawings': drawings, 'shots': shots, 'phones': phones, 'posters': posters}
    for name in sys.argv[1:] or steps:
        steps[name]()
