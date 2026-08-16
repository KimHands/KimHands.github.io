// Micro-interactions. All motion effects are gated to fine pointers and to
// users who have not asked for reduced motion. Scrollspy is a state change,
// not motion, so it always runs.
const fine = matchMedia('(pointer: fine)').matches;
const motion = matchMedia('(prefers-reduced-motion: no-preference)').matches;

initScrollspy();
if (fine && motion) {
  initMagnetic();
  initCardSpotlight();
}

function initScrollspy() {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.nlink'));
  const sections = new Map<Element, HTMLAnchorElement>();
  links.forEach((link) => {
    const href = link.getAttribute('href') ?? '';
    if (!href.startsWith('#')) return;
    const section = document.getElementById(href.slice(1));
    if (section) sections.set(section, link);
  });
  if (!sections.size || !('IntersectionObserver' in window)) return;

  const setActive = (link: HTMLAnchorElement) => {
    links.forEach((l) => l.classList.toggle('is-active', l === link));
  };
  const io = new IntersectionObserver(
    (entries) => {
      const hit = entries.find((e) => e.isIntersecting);
      if (hit) setActive(sections.get(hit.target)!);
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
  );
  sections.forEach((_, section) => io.observe(section));
}

function clamp(value: number, limit: number) {
  return Math.max(-limit, Math.min(limit, value));
}

function initMagnetic() {
  const pull = 0.3;
  const maxShift = 6;
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    let raf = 0;
    el.addEventListener('pointermove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const box = el.getBoundingClientRect();
        const dx = e.clientX - (box.left + box.width / 2);
        const dy = e.clientY - (box.top + box.height / 2);
        el.style.transform = `translate(${clamp(dx * pull, maxShift)}px,${clamp(dy * pull, maxShift)}px)`;
      });
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });
}

function initCardSpotlight() {
  document.querySelectorAll<HTMLElement>('.card:not(.slot)').forEach((card) => {
    let raf = 0;
    card.addEventListener('pointermove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const box = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - box.left}px`);
        card.style.setProperty('--my', `${e.clientY - box.top}px`);
      });
    });
  });
}
