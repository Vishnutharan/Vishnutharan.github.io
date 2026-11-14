import './styles.css';
import { content as C } from './content.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile = matchMedia('(max-width: 820px), (pointer: coarse)').matches;
const field = (k) => $(`[data-field="${k}"]`);

/* ─────────── Render content ─────────── */
const P = C.person;
field('hero-eyebrow').textContent = `${P.role} · ${P.location}`;
field('first').textContent = P.firstName;
field('last').textContent = P.lastName;
field('tagline').textContent = P.tagline;
field('availability').textContent = P.availability;
field('about-heading').textContent = C.about.heading;
field('about-body').innerHTML = C.about.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('');
field('facts').innerHTML = C.about.facts.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join('');
field('skills').innerHTML = C.skills.map((g, i) => `
  <article class="skill-card reveal-css">
    <h3>${esc(g.group)} <small>0${i + 1}</small></h3>
    <ul>${g.items.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
  </article>`).join('');

const langColor = { 'C#': 'oklch(0.7 0.2 150)', Java: 'oklch(0.75 0.17 60)', TypeScript: 'oklch(0.68 0.15 245)', JavaScript: 'oklch(0.88 0.17 100)', CSS: 'oklch(0.65 0.22 300)', Python: 'oklch(0.7 0.14 240)' };
field('projects').innerHTML = C.projects.map((p, i) => `
  <li class="project" style="--accent:${langColor[p.language] || 'var(--c-cyan)'}">
    <a href="${esc(p.url)}" target="_blank" rel="noopener" data-cursor="View">
      <span class="project__glow" aria-hidden="true"></span>
      <span class="project__num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
      <h3>${esc(p.name.replace(/[-_]/g, ' '))}</h3>
      <p>${esc(p.description)}</p>
      <div class="project__meta">
        <span class="lang">${esc(p.language)}</span>
        ${p.stars ? `<span aria-label="${p.stars} stars">★ ${p.stars}</span>` : ''}
        <span>${esc(p.year)}</span>
        <span class="arrow" aria-hidden="true">→</span>
      </div>
    </a>
  </li>`).join('') + `
  <li class="project project--more"><a href="${esc(C.githubUrl)}" target="_blank" rel="noopener">
    <h3>See everything on GitHub</h3><p>${esc(C.githubUrl.replace('https://', ''))}</p></a></li>`;

field('experience').insertAdjacentHTML('beforeend', C.experience.map((e) => `
  <li class="tl-item reveal-css"><time>${esc(e.period)}</time><h3>${esc(e.title)}</h3><p class="org">${esc(e.org)}</p><p>${esc(e.text)}</p></li>`).join(''));

const contactBtns = [];
contactBtns.push(P.email
  ? `<a class="btn btn--primary btn--big" href="mailto:${esc(P.email)}" data-magnetic><span>${esc(P.email)}</span></a>`
  : `<a class="btn btn--primary btn--big" href="mailto:" data-magnetic title="Add your email in src/content.js"><span>Email me [add address]</span></a>`);
C.socials.filter((s) => s.url).forEach((s) => contactBtns.push(`<a class="btn btn--ghost btn--big" href="${esc(s.url)}" target="_blank" rel="noopener" data-magnetic><span>${esc(s.label)} ↗</span></a>`));
field('contact').innerHTML = contactBtns.join('');
field('year').textContent = new Date().getFullYear();
field('name').textContent = P.name;

const words = ['Full-stack', 'C# / .NET', 'Spring Boot', 'Angular', 'React', 'TypeScript', 'APIs', 'Booking systems'];
$('[data-marquee]').innerHTML = [...words, ...words].map((w) => `<span>${esc(w)}</span><b>✦</b>`).join('');

$('#ld').textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Person', name: P.name, jobTitle: P.role, address: { '@type': 'PostalAddress', addressCountry: 'GB' }, url: C.meta.url, sameAs: C.socials.filter((s) => s.url).map((s) => s.url) });

/* ─────────── Photos: show if file exists, else keep gradient placeholder ─────────── */
$$('[data-photo]').forEach((fig) => {
  const img = $('img', fig);
  img.addEventListener('load', () => fig.classList.add('has-photo'));
  img.addEventListener('error', () => img.remove());
  img.src = P.photos[fig.dataset.photo];
});

/* ─────────── Split text ─────────── */
function splitWords(el) {
  const text = el.textContent.trim();
  el.innerHTML = `<span class="sr-only">${esc(text)}</span>` + text.split(/\s+/).map((w) => `<span class="word" aria-hidden="true"><span>${esc(w)}</span></span>`).join(' ');
  return $$('.word > span', el);
}
function splitChars(el) {
  const text = el.textContent;
  el.innerHTML = `<span class="sr-only">${esc(text)}</span>` + [...text].map((c) => `<span class="word" aria-hidden="true"><span>${c === ' ' ? '&nbsp;' : esc(c)}</span></span>`).join('');
  return $$('.word > span', el);
}

/* ─────────── Theme toggle (View Transitions API circular reveal) ─────────── */
let hero3d = null;
$('.theme-toggle').addEventListener('click', (e) => {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  const apply = () => { document.documentElement.dataset.theme = next; localStorage.setItem('theme', next); hero3d?.setTheme(next); };
  if (!document.startViewTransition || reduced) return apply();
  const x = e.clientX || innerWidth - 40, y = e.clientY || 40;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  document.startViewTransition(apply).ready.then(() => {
    document.documentElement.animate({ clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 700, easing: 'cubic-bezier(.22,1,.36,1)', pseudoElement: '::view-transition-new(root)' });
  });
});

/* ─────────── Smooth scroll ─────────── */
let lenis = null;
if (!reduced) {
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
$$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
  const id = a.getAttribute('href'); if (id.length < 2 && id !== '#') return;
  const target = id === '#' ? 0 : $(id); if (target == null) return;
  e.preventDefault();
  lenis ? lenis.scrollTo(target, { offset: 0, duration: 1.4 }) : (target === 0 ? scrollTo(0, 0) : target.scrollIntoView());
}));

/* ─────────── Nav hide on scroll + active link ─────────── */
let lastY = 0;
addEventListener('scroll', () => {
  const y = scrollY; $('.nav').classList.toggle('is-hidden', y > lastY && y > 400); lastY = y;
}, { passive: true });
$$('main section[id]').forEach((sec) => ScrollTrigger.create({
  trigger: sec, start: 'top center', end: 'bottom center',
  onToggle: ({ isActive }) => { const l = $(`.nav__links a[href="#${sec.id}"]`); if (l) l.setAttribute('aria-current', isActive); },
}));

/* ─────────── Custom cursor ─────────── */
if (matchMedia('(hover: hover) and (pointer: fine)').matches && !reduced) {
  document.body.classList.add('has-cursor');
  const dot = $('.cursor__dot'), ring = $('.cursor__ring');
  const dx = gsap.quickTo(dot, 'x', { duration: 0.1 }), dy = gsap.quickTo(dot, 'y', { duration: 0.1 });
  const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
  addEventListener('pointermove', (e) => { $('.cursor').classList.add('is-active'); dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); }, { passive: true });
}

/* ─────────── Magnetic buttons ─────────── */
if (!isMobile && !reduced) {
  $$('[data-magnetic]').forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * 0.35); yTo((e.clientY - r.top - r.height / 2) * 0.35); });
    el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
  // 3D tilt photos
  $$('.tilt').forEach((el) => {
    const f = $('.photo-frame', el);
    el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); f.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 16}deg`); f.style.setProperty('--rx', `${-((e.clientY - r.top) / r.height - 0.5) * 16}deg`); });
    el.addEventListener('pointerleave', () => { f.style.setProperty('--rx', '0deg'); f.style.setProperty('--ry', '0deg'); });
  });
}

/* ─────────── 3D hero (lazy) ─────────── */
const canvas = $('.webgl');
const webglOK = (() => { try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; } })();
if (webglOK) {
  const start = () => import('./hero3d.js').then(({ initHero3D }) => {
    hero3d = initHero3D(canvas, { lite: isMobile || (navigator.hardwareConcurrency || 8) <= 4, reduced });
    ScrollTrigger.create({ trigger: document.body, start: 'top top', end: 'bottom bottom', onUpdate: (s) => hero3d.setScroll(s.progress) });
    gsap.to(canvas, { opacity: scrollY > innerHeight ? 0.4 : 1, duration: 1.6, ease: 'power2.out' });
    // after the hero, let the 3D recede so content stays readable
    ScrollTrigger.create({ trigger: '.hero', start: 'center top', end: 'bottom top', scrub: true,
      onUpdate: (st) => gsap.set(canvas, { opacity: 1 - st.progress * 0.6, filter: `saturate(${1 - st.progress * 0.4})` }) });
  });
  'requestIdleCallback' in window ? requestIdleCallback(start, { timeout: 800 }) : setTimeout(start, 200);
}

/* ─────────── Preloader → intro ─────────── */
const pre = $('.preloader');
function intro() {
  const heroChars = $$('.hero__title [data-split]').flatMap(splitChars);
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  if (reduced) { pre.classList.add('is-done'); return; }
  const counter = { v: 0 };
  tl.to(counter, { v: 100, duration: 1.1, ease: 'power2.inOut', onUpdate: () => { $('[data-count]').textContent = Math.round(counter.v); pre.style.setProperty('--p', counter.v / 100); $('.preloader__bar i').style.transform = `scaleX(${counter.v / 100})`; } })
    .add(() => pre.classList.add('is-done'))
    .from(heroChars, { yPercent: 110, rotate: 8, duration: 1.3, stagger: 0.035 }, '+=0.15')
    .from(['.hero__eyebrow', '.hero__tagline', '.hero__cta > *'], { y: 30, opacity: 0, duration: 1, stagger: 0.1 }, '-=1')
    .from('.hero__photo', { clipPath: 'inset(100% 0 0 0)', scale: 1.15, duration: 1.6 }, '-=1.3')
    .from('.nav', { y: -40, opacity: 0, duration: 1 }, '-=1.2');
}
document.fonts?.ready.then(intro) ?? intro();

/* ─────────── Scroll animations (GSAP) ─────────── */
if (!reduced) {
  // hero parallax out
  gsap.to('.hero__inner', { yPercent: -25, opacity: 0.2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__photo', { yPercent: -12, rotate: -3, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

  // about heading word reveal
  $$('[data-split-words]').forEach((el) => {
    gsap.from(splitWords(el), { yPercent: 110, duration: 1, stagger: 0.05, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
  });
  gsap.from('.about__photo .photo-frame', { clipPath: 'inset(15% 15% 15% 15% round 3rem)', scale: 0.9, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'center center', scrub: true } });
  gsap.from(['.about__body p', '.facts > div'], { y: 40, opacity: 0, stagger: 0.08, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.about__body', start: 'top 85%' } });

  // skills heading: scrubbed character colour fill
  $$('[data-scrub-text]').forEach((el) => {
    const chars = splitChars(el);
    gsap.fromTo(chars, { opacity: 0.12 }, { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 35%', scrub: true } });
  });

  // timeline progress line
  gsap.to('.timeline__line i', { scale: 1, ease: 'none', scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 60%', scrub: true } });

  // contact title
  $$('.contact__title [data-split]').forEach((el) => gsap.from(splitWords(el), { yPercent: 110, duration: 1.2, stagger: 0.08, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } }));
}

/* ─────────── Horizontal projects (pinned + scrubbed) ─────────── */
const track = $('.projects__track');
const mm = gsap.matchMedia();
mm.add({ desktop: '(min-width: 821px) and (prefers-reduced-motion: no-preference)', native: '(max-width: 820px), (prefers-reduced-motion: reduce)' }, (ctx) => {
  const projects = $('.projects');
  if (ctx.conditions.native) { projects.classList.add('is-native'); return () => projects.classList.remove('is-native'); }
  const dist = () => track.scrollWidth - innerWidth;
  const tween = gsap.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: '.projects', pin: '.projects__pin', start: 'top top', end: () => `+=${dist()}`, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 } });
  $$('.project', track).forEach((card) => gsap.from(card, { rotateY: -25, opacity: 0.3, scale: 0.9, transformPerspective: 1000, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'left 60%', scrub: true } }));
});

addEventListener('load', () => ScrollTrigger.refresh());
