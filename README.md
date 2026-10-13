# ScrapBean website

The website for ScrapBean, a free scrapbook app for Windows, macOS and Linux: https://scrapbean.mavern.in

It is a plain static site built with Vite: three pages of ordinary HTML, one stylesheet and a small script. This
repository holds the website only. The app itself is not open source and is not here.

## Run it

Node.js 22.12 or newer.

```sh
npm install
npm run dev       # http://127.0.0.1:5174
npm run build     # checks the types, then writes dist/
npm run preview   # serves the built site on http://127.0.0.1:5175
```

## Publish it

Build, then upload the contents of `dist/` to any host that serves static files. For a host that builds from the
repository: the build command is `npm run build` and the folder to publish is `dist`.

- **The address.** `site.config.ts` holds the site's address, `https://scrapbean.mavern.in`. Canonical links, social
  cards, structured data, the sitemap and `robots.txt` are all written from it. Change it there, or build with
  `SITE_URL=https://your.address npm run build`.
- **The not-found page.** Set the host to serve `404.html` for addresses that do not exist, if it does not already.
- **Downloads.** `site.config.ts` lists Windows, macOS and Linux. While an entry's `href` is empty its card says
  "Coming soon"; give it a link and the card becomes a download button. The "Coming soon" buttons in
  `partials/header.html`, `partials/footer.html` and the hero in `index.html` are plain text to change then.

## What lives where

| Path | What it is |
| --- | --- |
| `index.html` | Home: tagline, what it is, Edit and Customize, who it is for, features, export and share, plugins, free, questions, coming soon |
| `docs/index.html` | Documentation, one long page with a list of sections |
| `about/index.html` | About and credits |
| `404.html` | The page shown for a wrong address |
| `partials/` | The head, top bar and foot shared by every page; written into each page at build time |
| `site.config.ts` | Address, page list and downloads |
| `vite.config.ts` | Builds the pages; also writes `sitemap.xml`, `robots.txt` and the questions' search data |
| `src/` | The stylesheet and the script (the films' play and pause labels, the headline shuffle, the docs section marker) |
| `public/art/` | The hand-drawn pictures |
| `public/shots/` | Screenshots of the real app, at 640 and 1280 pixels wide |
| `public/media/` | Feature videos, their first pictures, and the brand images used for link previews |
| `public/textures/`, `public/stickers/` | Paper textures and stickers borrowed from the app |
| `scripts/pictures.py` | Remakes `public/art/` and `public/shots/` from their originals (see below) |
| `CREDITS.md` | Whose work the site uses, and under which licences |

## How it is put together

- **Every word is in the HTML.** Nothing is drawn by script, so search engines and people without scripts get the
  whole page. Each page has its own title, description, canonical link, social card and structured data. The
  questions on the home page are turned into `FAQPage` data when the site is built, so the two cannot disagree.
- **It runs the full width of the screen.** There is no centred column. The gap at each side (`--side` in
  `src/style.css`) and the number of columns grow with the screen, from a phone to a very wide monitor.
- **One look, light only.** Several of the hand drawings are dark lines and would vanish on a dark page.
- **Films never play uninvited sound, and never hide behind a control bar.** They are silent, play only while on
  screen, and each has one small label to stop and start it. With reduced movement asked for, nothing plays until
  that label is pressed.

## Where the pictures and videos come from

The screenshots and videos show the real app. They are made in the app's own repository, by tools that drive the app
and film it, and the finished files are kept here in `public/`. `scripts/pictures.py` is the step that crops and
shrinks them; it expects the app's repository around it and does nothing useful on its own here. To change a
picture by hand, replace the `-640.webp` and `-1280.webp` pair in `public/shots/` with new ones of the same sizes.

When changing which screenshots are shown, keep `CREDITS.md` and the table on the About page in step: some of the
photos in the sample pages must have their authors named.
