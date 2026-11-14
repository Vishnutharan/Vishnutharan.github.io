import { defineConfig } from 'vite';
import { content } from './src/content.js';

// Injects SEO meta from src/content.js at build time.
const metaPlugin = () => ({
  name: 'content-meta',
  transformIndexHtml(html) {
    const m = content.meta;
    return html
      .replaceAll('%TITLE%', m.title)
      .replaceAll('%DESCRIPTION%', m.description)
      .replaceAll('%URL%', m.url)
      .replaceAll('%NAME%', content.person.name);
  },
});

export default defineConfig({
  base: './',
  plugins: [metaPlugin()],
  build: { target: 'es2022', chunkSizeWarningLimit: 800 },
});
