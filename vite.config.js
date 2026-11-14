import { defineConfig } from 'vite';
import { content } from './src/content.js';
import { render } from './src/render.js';

// Pre-renders all content from src/content.js into index.html (fast first paint + SEO).
const contentPlugin = () => ({
  name: 'content-prerender',
  transformIndexHtml(html) {
    const m = content.meta;
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
