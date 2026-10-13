// The facts every page shares. Change them here and the pages, the sitemap and robots.txt follow.
export const site = {
  name: 'ScrapBean',
  tagline: 'Dump it. Shuffle it. Done.',
  /** Where the site is published, without a slash at the end. Search engines are told this is the real address. */
  url: process.env.SITE_URL ?? 'https://scrapbean.mavern.in',
  /** The pages listed in the sitemap, most important first. */
  pages: ['/', '/docs/', '/about/'],
};

/** One entry per system. Leave `href` empty until that download exists: the card then says "Coming soon". */
export const downloads = [
  { system: 'Windows', needs: 'Windows 10 or newer', href: '' },
  { system: 'macOS', needs: 'macOS 12 or newer', href: '' },
  { system: 'Linux', needs: 'Most 64-bit desktops', href: '' },
];
