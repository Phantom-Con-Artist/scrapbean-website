const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
const clamp = (value: number, low = 0, high = 1) => Math.min(high, Math.max(low, value));
const between = (low: number, high: number) => low + Math.random() * (high - low);

// Videos are silent loops of the app. They play while they are on screen and rest when they are not. The browser's
// own video bar is taken away (it covered the picture whenever the pointer passed over); each film gets one small
// button of its own to stop and start it. With movement turned down nothing starts until that button is pressed.
const films = [...document.querySelectorAll<HTMLVideoElement>('video')];
for (const film of films) {
  film.controls = false;
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'film-toggle';
  const label = () => {
    button.textContent = film.paused ? 'Play' : 'Pause';
    button.setAttribute('aria-label', `${film.paused ? 'Play' : 'Pause'}: ${film.getAttribute('aria-label') ?? 'this film'}`);
  };
  button.addEventListener('click', () => {
    // Stopped by hand, a film stays stopped until it is started by hand.
    if (film.paused) { delete film.dataset.held; void film.play().catch(() => undefined); } else { film.dataset.held = 'yes'; film.pause(); }
  });
  film.addEventListener('play', label);
  film.addEventListener('pause', label);
  label();
  film.after(button);
}
if (calm.matches) document.documentElement.classList.add('is-calm');
if ('IntersectionObserver' in window) {
  const watch = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const film = entry.target as HTMLVideoElement;
      if (!entry.isIntersecting) film.pause();
      else if (!calm.matches && !film.dataset.held) void film.play().catch(() => undefined);
    }
  }, { threshold: 0.35 });
  for (const film of films) watch.observe(film);
}

// The dice deals the scraps in the sky again: each one takes another's place, give or take a little.
const dice = document.querySelector<HTMLButtonElement>('[data-shuffle]');
const drifts = [...document.querySelectorAll<HTMLElement>('[data-air] .drift')];
const places = drifts.map((drift) => ({ x: Number(drift.style.getPropertyValue('--x')), y: Number(drift.style.getPropertyValue('--y')) }));
let deals = 0;
dice?.addEventListener('click', () => {
  deals += 1;
  const order = places.map((_, index) => index).sort(() => Math.random() - 0.5);
  drifts.forEach((drift, index) => {
    const place = places[order[index]];
    drift.style.setProperty('--x', clamp(place.x + between(-6, 6), 8, 92).toFixed(1));
    drift.style.setProperty('--y', clamp(place.y + between(-5, 5), 6, 74).toFixed(1));
    drift.style.setProperty('--r', `${between(-14, 14).toFixed(1)}deg`);
    drift.style.transitionDelay = calm.matches ? '' : `${index * 40}ms`;
  });
  dice.classList.toggle('is-rolled', deals % 2 === 1);
});

// The loop, acted out as the page scrolls: the scraps rain onto the floor, rise into the air, and land in a frame.
// Each pose is [x, y, turn] in percent of the scene; the four poses are: still in the sky, dumped, shuffled, done.
type Pose = [number, number, number];
const POSES: Pose[][] = [
  [[30, -40, -25], [36, 74, -9], [26, 22, -11], [31, 32, -4]],
  [[70, -60, 30], [62, 76, 7], [72, 30, 9], [68, 30, 3]],
  [[52, -90, -15], [50, 68, -3], [56, 58, -6], [60, 56, -2]],
  [[20, -50, 10], [24, 82, 14], [42, 44, 8], [30, 58, 3]],
  [[85, -30, -10], [80, 82, -16], [84, 60, -12], [82, 52, -5]],
  [[10, -70, -30], [14, 80, -20], [12, 42, -14], [14, 46, -8]],
  [[92, -110, 20], [90, 79, 24], [88, 14, 16], [86, 18, 10]],
  [[45, -130, 0], [44, 87, -22], [46, 10, -14], [44, 69, -9]],
];
// Where each move happens along the scroll, with a pause after it to look at the result.
const MOVES = [[0, 0.22], [0.34, 0.58], [0.7, 0.92]];
const landing = (t: number) => 1 + 2.2 * (t - 1) ** 3 + 1.2 * (t - 1) ** 2;
const lifting = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);
const settling = (t: number) => 1 - (1 - t) ** 3;
const EASES = [landing, lifting, settling];

const loop = document.querySelector<HTMLElement>('[data-loop]');
if (loop && !calm.matches) {
  const track = loop.querySelector<HTMLElement>('.loop-track')!;
  const scene = loop.querySelector<HTMLElement>('.scene')!;
  const bits = [...loop.querySelectorAll<HTMLElement>('[data-bit]')];
  const steps = [...loop.querySelectorAll<HTMLElement>('[data-step]')];
  const meter = document.createElement('div');
  meter.className = 'loop-meter';
  meter.setAttribute('aria-hidden', 'true');
  meter.append(...steps.map(() => document.createElement('i')));
  const words = document.createElement('div');
  steps[0].parentElement!.before(words);
  words.append(meter, steps[0].parentElement!);
  loop.classList.add('is-live');

  let stage = -1;
  const draw = () => {
    const box = track.getBoundingClientRect();
    const lead = window.innerHeight * 0.45;
    const travelled = clamp((lead - box.top) / (track.offsetHeight - window.innerHeight + lead));
    let move = 0;
    let done = 0;
    MOVES.forEach(([from, to], index) => { if (travelled >= from) { move = index; done = clamp((travelled - from) / (to - from)); } });
    const progress = move + done;
    bits.forEach((bit, index) => {
      const poses = POSES[Number(bit.dataset.bit)];
      // The scraps don't all move at once: each starts a little after the one before.
      const own = clamp((done - index * 0.05) / (1 - (bits.length - 1) * 0.05));
      const t = EASES[move](own);
      const [x0, y0, r0] = poses[move];
      const [x1, y1, r1] = poses[move + 1];
      bit.style.setProperty('--x', (x0 + (x1 - x0) * t).toFixed(2));
      bit.style.setProperty('--y', (y0 + (y1 - y0) * t).toFixed(2));
      bit.style.setProperty('--r', `${(r0 + (r1 - r0) * t).toFixed(2)}deg`);
    });
    scene.style.setProperty('--hang', move === 2 ? settling(done).toFixed(3) : '0');
    meter.querySelectorAll('i').forEach((mark, index) => mark.style.setProperty('--fill', clamp(progress - index).toFixed(3)));
    const now = progress < 1.35 ? 0 : progress < 2.35 ? 1 : 2;
    if (now !== stage) {
      stage = now;
      loop.dataset.stage = String(now);
      steps.forEach((step, index) => step.classList.toggle('is-on', index === now));
    }
  };
  let queued = false;
  const ask = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; draw(); }); } };
  window.addEventListener('scroll', ask, { passive: true });
  window.addEventListener('resize', ask);
  draw();
}

// Sections arrive as they scroll into view, a few at a time.
const arriving = document.querySelectorAll<HTMLElement>('.band .lead, .wall li, .night .handsets li, .show, .modes article, .deep li, .bring, .drawer, .exports li, .get, .proof-films li, .faqs');
if ('IntersectionObserver' in window && !calm.matches) {
  const reveal = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-in');
      reveal.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -8% 0px' });
  arriving.forEach((item) => {
    const place = item.parentElement ? [...item.parentElement.children].indexOf(item) : 0;
    item.style.setProperty('--stagger', `${(place % 4) * 80}ms`);
    item.classList.add('will-reveal');
    reveal.observe(item);
  });
}

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
