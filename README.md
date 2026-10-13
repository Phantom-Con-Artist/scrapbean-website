# ScrapBean website

The website for ScrapBean, kept in the same repository as the desktop app (which lives at the repository root).
It is a plain static site built with Vite: three pages of ordinary HTML, one stylesheet and a small script.

## Commands

Run these from the repository root:

```sh
npm install              # once; installs the app, the website and the videos together
npm run website:dev      # http://127.0.0.1:5174
npm run website:build    # writes scrapbean-website/dist
npm run website:preview  # serves the built site on http://127.0.0.1:5175
```

Or from this folder: `npm run dev`, `npm run build`, `npm run preview`.

## Before publishing

- **Set the address.** `site.config.ts` holds the site's address (`https://scrapbean.app` is a placeholder).
  Canonical links, social cards, the sitemap and `robots.txt` are all written from it. Change it there, or build
  with `SITE_URL=https://your.address npm run website:build`.
- **Add the downloads.** The same file lists Windows, macOS and Linux. While an entry's `href` is empty its card
  says "Coming soon"; give it a link and the card becomes a download button. The "Coming soon" buttons in
  `partials/header.html`, `partials/footer.html` and the hero in `index.html` are plain text to change then.

## What lives where

| Path | What it is |
| --- | --- |
| `index.html` | Home: tagline, what it is, Edit and Customize, who it is for, features, export and share, free, questions, coming soon |
| `docs/index.html` | Documentation, one long page with a list of sections |
| `about/index.html` | About and credits |
| `404.html` | The page shown for a wrong address |
| `partials/` | The head, top bar and foot shared by every page; written into each page at build time |
| `site.config.ts` | Address, page list and downloads |
| `vite.config.ts` | Builds the pages; also writes `sitemap.xml`, `robots.txt` and the questions' search data |
| `src/` | The stylesheet and the script (video play and pause, the headline shuffle, the docs section marker) |
| `scripts/pictures.py` | Makes `public/art/` and `public/shots/` from the drawings and screenshots, and shrinks video posters |
| `public/art/` | The hand-drawn pictures, from `assets/hand-drawn/` at the root, cropped and saved as WebP |
| `public/shots/` | Screenshots of the real app, from `promotion/screens/`, at 640 and 1280 pixels wide |
| `public/media/` | Feature videos, posters and brand stills, made by `scrapbean-videos/` |
| `public/textures/`, `public/stickers/` | Paper textures and stickers copied from the app |
| `dist/` | The built site; not kept in the repository |

## How it is put together

- **Every word is in the HTML.** Nothing is drawn by script, so search engines and people without scripts get the
  whole page. Each page has its own title, description, canonical link, social card and structured data. The
  questions on the home page are turned into `FAQPage` data when the site is built, so the two cannot disagree.
- **It runs the full width of the screen.** There is no centred column. The gap at each side (`--side` in
  `src/style.css`) and the number of columns grow with the screen, from a phone to a very wide monitor.
- **One look, light only.** Several of the hand drawings are dark lines and would vanish on a dark page.
- **It shares nothing with the app at build time.** It does not import from the app's `src/`; what it borrows
  (textures, stickers, colours) is copied here.

## Credits to keep

Some sample photos in the screenshots are CC BY and their authors are named on the About page. Keep that list
when changing which screenshots are shown; the full list is in `promotion/CREDITS.md`.

## Refreshing the pictures and videos

After the app's look changes, from the repository root:

```sh
npm run build                     # the app, which is what gets filmed
npm run videos:capture            # films every clip
npm run videos:render             # writes the videos and posters into public/media/
# rebuild promotion/screens (see promotion/README.md), then promotion/make/modes.mjs for the Edit and Customize pictures
python3 scrapbean-website/scripts/pictures.py
```
