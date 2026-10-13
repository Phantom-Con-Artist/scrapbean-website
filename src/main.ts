import '@fontsource-variable/bricolage-grotesque/wght.css';
import '@fontsource-variable/shantell-sans/wght.css';
import './style.css';

const calm = window.matchMedia('(prefers-reduced-motion: reduce)');

// Videos are silent loops of the app. They play while they are on screen and rest when they are not.
// With movement turned down they keep their controls and wait to be started.
const films = [...document.querySelectorAll<HTMLVideoElement>('video')];
if (!calm.matches && 'IntersectionObserver' in window) {
  const watch = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const film = entry.target as HTMLVideoElement;
      if (entry.isIntersecting) film.play().catch(() => { film.controls = true; });
      else film.pause();
    }
  }, { threshold: 0.35 });
  for (const film of films) {
    film.controls = false;
    watch.observe(film);
  }
}

// The headline is three scraps, and the dice deals them again: new tilt, new place, new paper.
const PAPERS = ['is-sticky', 'is-torn', 'is-stamp', 'is-pink', 'is-blue', 'is-kraft'];
const between = (low: number, high: number) => low + Math.random() * (high - low);
const dice = document.querySelector<HTMLButtonElement>('[data-shuffle]');
const scraps = [...document.querySelectorAll<HTMLElement>('.deal .scrap')];
let deals = 0;
dice?.addEventListener('click', () => {
  deals += 1;
  const papers = [...PAPERS].sort(() => Math.random() - 0.5);
  scraps.forEach((scrap, index) => {
    scrap.classList.remove(...PAPERS);
    // "Done." keeps its stamp every other deal, so the joke is not lost.
    scrap.classList.add(index === 2 && deals % 2 === 0 ? 'is-stamp' : papers[index]);
    scrap.style.setProperty('--turn', `${between(-9, 9).toFixed(1)}deg`);
    scrap.style.setProperty('--dx', `${between(-10, 14).toFixed(0)}px`);
    scrap.style.setProperty('--dy', `${between(-8, 10).toFixed(0)}px`);
    if (calm.matches) return;
    scrap.animate([
      { translate: '0 0', scale: '1' },
      { translate: `${between(-40, 40).toFixed(0)}px -46px`, scale: '1.12', rotate: `${between(-16, 16).toFixed(0)}deg` },
      { translate: '0 0', scale: '1' },
    ], { duration: 520, delay: index * 70, easing: 'cubic-bezier(0.3, 1.5, 0.5, 1)' });
  });
  dice.classList.toggle('is-rolled', deals % 2 === 1);
});

// The documentation's list of sections marks the one being read.
const marks = [...document.querySelectorAll<HTMLAnchorElement>('.toc a')];
if (marks.length > 0 && 'IntersectionObserver' in window) {
  const reading = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      for (const mark of marks) mark.toggleAttribute('data-here', mark.hash === `#${entry.target.id}`);
    }
  }, { rootMargin: '-15% 0px -70% 0px' });
  document.querySelectorAll('.doc section[id]').forEach((section) => reading.observe(section));
}
