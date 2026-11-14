import './styles.css';
import { content as C } from './content.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const isMobile = matchMedia('(max-width: 900px), (pointer: coarse)').matches;

/* ─── Photos: use real photo when the file exists; otherwise the monogram stays ─── */
$$('[data-photo]').forEach((el) => {
  const img = $('img', el); if (!img) return;
  img.addEventListener('load', () => el.classList.add('has-photo'), { once: true });
  img.addEventListener('error', () => img.remove(), { once: true });
  img.src = C.person.photos[el.dataset.photo];
});

/* ─── Theme toggle with View Transitions circular reveal ─── */
let hero3d = null;
$('.theme-toggle').addEventListener('click', (e) => {
  const next = document.documentElement.dataset.theme === 'mist' ? 'dawn' : 'mist';
  const apply = () => { document.documentElement.dataset.theme = next; try { localStorage.setItem('palette', next); } catch {} hero3d?.setTheme(next); };
  if (!document.startViewTransition || reduced) return apply();
  const r = e.currentTarget.getBoundingClientRect(); const x = r.left + r.width / 2, y = r.top + r.height / 2;
  const rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  document.startViewTransition(apply).ready.then(() => document.documentElement.animate(
    { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${rad}px at ${x}px ${y}px)`] },
    { duration: 650, easing: 'cubic-bezier(.16,1,.3,1)', pseudoElement: '::view-transition-new(root)' }));
});

/* ─── Scrolling: native (compositor-driven, smooth even when the main thread is busy) ─── */
ScrollTrigger.config({ ignoreMobileResize: true });
$$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
  const id = a.getAttribute('href'); const target = id === '#top' ? null : $(id);
  if (id !== '#top' && !target) return; e.preventDefault();
  const top = target ? target.getBoundingClientRect().top + scrollY - 72 : 0;
  scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
}));

/* ─── Nav: glass after scroll, hide on scroll down, active section ─── */
const nav = $('.nav'); let lastY = 0, navTick = false, scrolled = null, hidden = false;
const onScroll = () => {
  navTick = false;
  const y = scrollY, s = y > 24;
  if (s !== scrolled) { scrolled = s; nav.classList.toggle('is-scrolled', s); }
  const h = y > 600 && (y > lastY + 4 ? true : y < lastY - 4 ? false : hidden);
  if (h !== hidden) { hidden = h; nav.classList.toggle('is-hidden', h); }
  lastY = y;
};
addEventListener('scroll', () => { if (!navTick) { navTick = true; requestAnimationFrame(onScroll); } }, { passive: true }); onScroll();

/* ─── Pause the tech ticker when it is off-screen ─── */
const stack = $('.stack');
new IntersectionObserver(([e]) => stack.classList.toggle('is-off', !e.isIntersecting)).observe(stack);


/* ─── Spotlight cards (pointer-tracked radial glow, @property vars) ─── */
if (finePointer) {
  let pending = null;
  document.addEventListener('pointermove', (e) => {
    const card = e.target.closest?.('.spot'); if (!card) return;
    if (!pending) requestAnimationFrame(() => {
      const { card: c, x, y } = pending; pending = null;
      const r = c.getBoundingClientRect();
      c.style.setProperty('--mx', `${x - r.left}px`); c.style.setProperty('--my', `${y - r.top}px`);
    });
    pending = { card, x: e.clientX, y: e.clientY };
  }, { passive: true });
}

/* ─── Subtle magnetic buttons + portrait tilt ─── */
if (finePointer && !reduced) {
  $$('[data-magnetic]').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: .5, ease: 'power3' }), yTo = gsap.quickTo(el, 'y', { duration: .5, ease: 'power3' });
    el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * .18); yTo((e.clientY - r.top - r.height / 2) * .25); });
    el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
  const pf = $('.portrait__frame'), p = $('.portrait');
  p?.addEventListener('pointermove', (e) => { const r = p.getBoundingClientRect(); pf.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - .5) * 8}deg`); pf.style.setProperty('--rx', `${-((e.clientY - r.top) / r.height - .5) * 8}deg`); });
  p?.addEventListener('pointerleave', () => { pf.style.setProperty('--rx', '0deg'); pf.style.setProperty('--ry', '0deg'); });
}

/* ─── 3D hero (lazy-loaded after idle) ─── */
const canvas = $('.webgl');
const webgl = (() => { try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; } })();
if (webgl) {
  const start = () => import('./hero3d.js').then(({ initHero3D }) => {
    const lowEnd = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
    hero3d = initHero3D(canvas, { lite: isMobile || lowEnd, reduced });
    canvas.classList.add('is-ready');
    ScrollTrigger.create({
      trigger: '.hero', start: 'top top', end: () => `+=${innerHeight * 1.3}`,
      onUpdate: (st) => { hero3d.setScroll(st.progress); canvas.style.opacity = String(1 - st.progress * .88); },
      onToggle: (st) => hero3d.setActive(st.isActive || st.progress < 1),
      onLeave: () => hero3d.setActive(false), onEnterBack: () => hero3d.setActive(true),
    });
  });
  setTimeout(() => ('requestIdleCallback' in window ? requestIdleCallback(start, { timeout: 1200 }) : start()), 400);
}

/* ─── Intro ─── */
if (!reduced) {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: .55 });
  tl.from('.hero__line > span', { yPercent: 105, duration: 1.2, stagger: .09 })
    .from('.hero .reveal-up', { y: 18, opacity: 0, duration: 1, stagger: .08 }, '-=.95')
    .from('.nav', { y: -16, opacity: 0, duration: .9 }, '-=1');
}

/* ─── Scroll choreography (subtle) ─── */
if (!reduced) {
  gsap.to('.hero__inner', { y: -60, opacity: .35, ease: 'none', force3D: true, scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // headings: word mask reveal
  $$('.section .h2, .contact__title').forEach((h) => {
    const words = splitWords(h);
    gsap.from(words, { yPercent: 105, duration: 1, stagger: .04, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 88%' } });
  });

  // experience progress line
  gsap.to('.jobs__line i', { '--p': 1, ease: 'none', scrollTrigger: { trigger: '.jobs', start: 'top 65%', end: 'bottom 65%', scrub: true } });

  // fallback reveals where CSS scroll-driven animations are not supported
  if (!CSS.supports('animation-timeline: view()')) {
    ScrollTrigger.batch('.reveal-css', { start: 'top 90%', once: true, onEnter: (els) => gsap.from(els, { y: 24, opacity: 0, duration: .9, stagger: .06, ease: 'power3.out' }) });
  }
}

/* ─── Horizontal projects: pinned + scrubbed on desktop, native scroll-snap on mobile ─── */
const track = $('.projects__track'), bar = $('.projects__progress i');
gsap.matchMedia().add({ desk: '(min-width: 901px) and (prefers-reduced-motion: no-preference)', native: '(max-width: 900px), (prefers-reduced-motion: reduce)' }, (ctx) => {
  const sec = $('.projects');
  if (ctx.conditions.native) { sec.classList.add('is-native'); return () => sec.classList.remove('is-native'); }
  const dist = () => Math.max(0, track.scrollWidth - innerWidth);
  const tween = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: {
    trigger: sec, pin: '.projects__pin', start: 'top top', end: () => `+=${dist()}`, scrub: true, invalidateOnRefresh: true, anticipatePin: 1, fastScrollEnd: true,
    onUpdate: (st) => bar.style.setProperty('--p', st.progress) } });
  $$('.project', track).forEach((card) => gsap.from(card, { opacity: .4, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 100%', end: 'left 75%', scrub: true } }));
});

function splitWords(el) {
  if (el.dataset.split) return $$('.word > span', el);
  el.dataset.split = '1';
  const walk = (node) => [...node.childNodes].map((n) => {
    if (n.nodeType === 3) return n.textContent.split(/(\s+)/).map((w) => (/^\s+$/.test(w) || !w ? w : `<span class="word"><span>${w.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</span></span>`)).join('');
    const tag = n.tagName.toLowerCase(); return `<${tag}>${walk(n)}</${tag}>`;
  }).join('');
  const label = el.textContent.trim();
  el.innerHTML = `<span class="sr-only">${label.replace(/</g, '&lt;')}</span><span aria-hidden="true">${walk(el)}</span>`;
  return $$('.word > span', el);
}

// active nav link (created after the pinned section so positions include pin spacing)
$$('main section[id]').forEach((sec) => ScrollTrigger.create({
  trigger: sec, start: 'top 45%', end: 'bottom 45%',
  onToggle: ({ isActive }) => $(`.nav__links a[href="#${sec.id}"]`)?.setAttribute('aria-current', String(isActive)),
}));

addEventListener('load', () => ScrollTrigger.refresh());
