# Vishnutharan Karunakaran — Portfolio

Live: https://vishnutharan.github.io/

Vite + Three.js + GSAP ScrollTrigger + Lenis, Geist / Instrument Serif type, modern CSS.

## Run
```bash
npm install
npm run dev       # local dev server
npm run build     # production build -> dist/
npm run preview   # serve the build
npm run cv        # regenerate public/cv/Vishnutharan-Karunakaran-CV.pdf from src/content.js (needs: npx playwright install chromium)
```

## Edit content
All content (from the CV + GitHub) lives in `src/content.js` and is pre-rendered into the HTML at build time (`src/render.js`, `vite.config.js`).
Phone number and home address are deliberately not published.

## Photos
Add `public/assets/photos/hero.webp` (used in the hero pill avatar) and `public/assets/photos/about.webp` (About portrait).
Until they exist a monogram treatment is shown. `python3 scripts/optimize_photos.py photo.jpg` creates both.

## Deploy (GitHub Pages, branch-based)
```bash
npm run build && touch dist/.nojekyll
# push the contents of dist/ to the gh-pages branch
```
