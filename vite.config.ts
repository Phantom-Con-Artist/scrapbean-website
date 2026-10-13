import { readFileSync } from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import { downloads, site } from './site.config.ts';

const here = import.meta.dirname;
const part = (name: string) => readFileSync(path.join(here, 'partials', `${name}.html`), 'utf8');

const downloadCards = () => downloads.map((item) => item.href
  ? `<li class="get"><a class="button" href="${item.href}">Download for ${item.system}</a><small>${item.needs}</small></li>`
  : `<li class="get is-soon"><span class="button" aria-disabled="true">${item.system}</span><small>Coming soon. ${item.needs}.</small></li>`).join('\n');

// The questions on a page, restated for search engines, so the two can never disagree.
const faqSchema = (html: string) => {
  const plain = (text: string) => text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const asked = [...html.matchAll(/<details class="faq">\s*<summary>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/g)];
  if (asked.length === 0) return '';
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: asked.map(([, question, answer]) => ({ '@type': 'Question', name: plain(question), acceptedAnswer: { '@type': 'Answer', text: plain(answer) } })),
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
};

// Every page is plain HTML, so search engines read all of it without running a script. The parts pages share
// (the head, the top bar, the foot) are kept once in partials/ and written into each page when it is built.
function pages(): Plugin {
  return {
    name: 'scrapbean-pages',
    transformIndexHtml: {
      order: 'pre',
      handler(html, context) {
        // "/docs/index.html" is published as "/docs/".
        const address = context.path.replace(/index\.html$/, '');
        return html
          .replace('<!-- @faq-schema -->', faqSchema(html))
          .replace('<!-- @head -->', part('head'))
          .replace('<!-- @header -->', part('header').replace(`<a href="${address}">`, `<a href="${address}" aria-current="page">`))
          .replace('<!-- @footer -->', part('footer'))
          .replace('<!-- @downloads -->', downloadCards())
          .replaceAll('%SITE%', site.url)
          .replaceAll('%PAGE%', site.url + address)
          .replaceAll('%YEAR%', String(new Date().getFullYear()));
      },
    },
    generateBundle() {
      const today = new Date().toISOString().slice(0, 10);
      const entries = site.pages.map((page) => `  <url><loc>${site.url}${page}</loc><lastmod>${today}</lastmod></url>`).join('\n');
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n` });
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n` });
    },
  };
}

// The website is a plain static site. It has its own port so it can run beside the app's dev server (5173).
export default defineConfig({
  appType: 'mpa',
  plugins: [pages()],
  build: {
    rollupOptions: {
      input: {
        home: path.join(here, 'index.html'),
        docs: path.join(here, 'docs/index.html'),
        about: path.join(here, 'about/index.html'),
        missing: path.join(here, '404.html'),
      },
    },
  },
  server: { host: '127.0.0.1', port: 5174, strictPort: true },
  preview: { host: '127.0.0.1', port: 5175, strictPort: true },
});
