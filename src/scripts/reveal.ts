const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveals = document.querySelectorAll<HTMLElement>('.reveal');
const tls = document.querySelectorAll<HTMLElement>('.tl');
if (reduce || !('IntersectionObserver' in window)) {
  reveals.forEach((e) => e.classList.add('in'));
  tls.forEach((e) => e.classList.add('in'));
} else {
  let termStarted = false;
  const revealTerm = () => {
    if (termStarted) return; termStarted = true;
    tls.forEach((l, i) => setTimeout(() => l.classList.add('in'), 260 + i * 210));
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        io.unobserve(en.target);
        if (en.target.classList.contains('term')) revealTerm();
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
  reveals.forEach((e) => io.observe(e));
}
