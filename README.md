# Vishnutharan Karunakaran — Immersive Portfolio (v1)

Vite + Three.js + GSAP ScrollTrigger + Lenis, with modern CSS.

## Run
```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # serve the build
```

## Edit content
**Everything** (name, role, tagline, about, skills, projects, experience, socials, email, SEO meta) is in
`src/content.js`. Anything in `[square brackets]` is a placeholder to replace.

## Photos
See `public/assets/photos/README.md`. Replace `hero.webp` and `about.webp`.

## What's inside
- **3D hero** (`src/hero3d.js`): simplex-noise shader blob + particle field; reacts to mouse & scroll; lighter geometry/particles on mobile or low-core devices; lazy-loaded after idle; paused when tab hidden; static frame under reduced motion.
- **Scroll**: Lenis smooth scroll, GSAP pinned horizontal projects rail with 3D card entrances (containerAnimation), scrubbed text fills, parallax hero, clip-path photo reveals, timeline progress line.
- **Modern CSS**: `animation-timeline: scroll()/view()` (with `@supports` fallbacks), View Transitions API circular theme reveal, `@property` animated conic gradients, container queries, `clamp()` fluid type, `:has()`, `oklch()` + `color-mix()`, native nesting.
- **Extras**: preloader, custom blend-mode cursor, magnetic buttons, 3D tilt photos, split-text reveals, dark/light theme (persisted, no flash), marquee, scroll progress bar, hide-on-scroll nav with active section, skip link, JSON-LD + Open Graph meta, `prefers-reduced-motion` support, native scroll-snap projects on mobile.

## Deploy (not done yet)
- **GitHub Pages**: push to a repo (e.g. `Vishnutharan.github.io`), build with a Pages Action and publish `dist/` (`base: './'` is already set).
- **Vercel / Netlify**: import the repo; build command `npm run build`, output `dist`.
