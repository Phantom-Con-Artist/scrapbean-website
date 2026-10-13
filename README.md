# ScrapBean website

The website for ScrapBean, kept in the same repository as the desktop app (which lives at the repository root).
It is a plain static site built with Vite. Right now it is a one-page starting point.

## Commands

Run these from the repository root:

```sh
npm install              # once; installs the app and the website together
npm run website:dev      # http://127.0.0.1:5174
npm run website:build    # writes scrapbean-website/dist
npm run website:preview  # serves the built site on http://127.0.0.1:5175
```

Or from this folder: `npm run dev`, `npm run build`, `npm run preview`.

## What lives where

| Path | What it is |
| --- | --- |
| `index.html` | The page |
| `src/` | Styles and scripts |
| `public/` | Files served as they are (the ScrapBean mark) |
| `dist/` | The built site; not kept in the repository |

## Pictures for the site

Screenshots of the real app are made by `promotion/make/` at the repository root and land in `promotion/`,
which is not kept in the repository. Copy the ones the site uses into `public/` here. Before publishing, read
`promotion/README.md`: some photos need their authors credited, and the pictures of people need your say-so.

The website shares nothing with the app at build time: it does not import from the app's `src/`.
