import { defineConfig } from 'vite';
import { content } from './src/content.js';
import { render } from './src/render.js';

// Pre-renders all content from src/content.js into index.html (fast first paint + SEO).
const contentPlugin = () => ({
  name: 'content-prerender',
  transformIndexHtml(html, ctx) {
    const m = content.meta;
    // preload the three Latin font files used above the fold (avoids late font swap / layout shift)
    if (ctx?.bundle) {
      const want = [/geist-latin-wght-normal-.*\.woff2$/, /geist-mono-latin-wght-normal-.*\.woff2$/, /instrument-serif-latin-400-italic-.*\.woff2$/];
      const links = Object.keys(ctx.bundle).filter((f) => want.some((r) => r.test(f)))
        .map((f) => `<link rel="preload" href="/${f}" as="font" type="font/woff2" crossorigin>`).join('\n  ');
      html = html.replace('</title>', `</title>\n  ${links}`);
    }
    const slots = render(content);
    return html
      .replace(/<!--slot:(\w+)-->/g, (_, k) => slots[k] ?? '')
      .replaceAll('%TITLE%', m.title)
      .replaceAll('%DESCRIPTION%', m.description)
      .replaceAll('%URL%', m.url)
      .replaceAll('%NAME%', content.person.name);
  },
});

export default defineConfig({
  base: '/',
  plugins: [contentPlugin()],
  build: { target: 'es2022', chunkSizeWarningLimit: 800 },
});
