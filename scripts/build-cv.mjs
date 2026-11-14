// Generates a clean, privacy-safe PDF CV (no phone / home address) from src/content.js.
// Usage: npm run cv   (requires: npx playwright install chromium)
import { chromium } from 'playwright';
import { content as C } from '../src/content.js';
import { esc } from '../src/render.js';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

const P = C.person;
const font = (pkg, file) => readFileSync(fileURLToPath(new URL(`../node_modules/${pkg}/files/${file}`, import.meta.url))).toString('base64');
const geist = font('@fontsource-variable/geist', 'geist-latin-wght-normal.woff2');
const mono = font('@fontsource-variable/geist-mono', 'geist-mono-latin-wght-normal.woff2');
const strip = (u) => u.replace(/^https?:\/\/(www\.)?/, '');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:G;src:url(data:font/woff2;base64,${geist}) format('woff2');font-weight:100 900}
@font-face{font-family:M;src:url(data:font/woff2;base64,${mono}) format('woff2');font-weight:100 900}
@page{size:A4;margin:13mm 15mm 11mm}
*{box-sizing:border-box}body{margin:0;font:400 9.2pt/1.45 G,sans-serif;color:#1d1f27;letter-spacing:-.005em}
a{color:inherit;text-decoration:none}
header{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:1.5px solid #1d1f27;padding-bottom:10pt;margin-bottom:14pt}
h1{white-space:nowrap;font-size:22pt;font-weight:650;letter-spacing:-.035em;margin:0;line-height:1.05}
.role{font-size:11pt;color:#3b5bdb;font-weight:550;margin-top:3pt}
.contact{text-align:right;font:400 7.6pt/1.6 M,monospace;color:#4a4f5e}
h2{font:600 7.8pt/1 M,monospace;letter-spacing:.14em;text-transform:uppercase;color:#3b5bdb;margin:13pt 0 6pt;display:flex;gap:8pt;align-items:center}
h2::after{content:'';flex:1;height:.6pt;background:#d9dbe3}
.summary{color:#2c2f3a}
.skills{display:grid;grid-template-columns:repeat(2,1fr);gap:4pt 18pt}
.skills b{font-weight:600}
.job{margin-bottom:9pt;break-inside:avoid}.job .top{display:flex;justify-content:space-between;align-items:baseline}
.job h3{font-size:10.4pt;margin:0;font-weight:600;letter-spacing:-.015em}.job .co{color:#3b5bdb;font-weight:550}
.when{font:400 8pt M,monospace;color:#5d6273}
ul{margin:3pt 0 0;padding-left:12pt}li{margin:1.5pt 0;color:#2c2f3a}
.proj{margin-bottom:6pt;break-inside:avoid}.proj b{font-weight:600}.proj .s{font:400 7.6pt M,monospace;color:#5d6273}
.edu{display:flex;justify-content:space-between;margin-bottom:4pt}.edu span{color:#5d6273}
</style></head><body>
<header><div><h1>${esc(P.name)}</h1><div class="role">${esc(P.role)}</div></div>
<div class="contact"><a href="mailto:${esc(P.email)}">${esc(P.email)}</a><br><a href="${esc(P.linkedin)}">${esc(strip(P.linkedin))}</a><br><a href="${esc(P.github)}">${esc(strip(P.github))}</a><br><a href="${esc(C.meta.url)}">${esc(strip(C.meta.url).replace(/\/$/, ''))}</a></div></header>
<h2>Profile</h2><p class="summary">${esc(C.summary)}</p>
<h2>Core skills</h2><div class="skills">${C.skills.map((g) => `<div><b>${esc(g.group)}:</b> ${g.items.map(esc).join(' · ')}</div>`).join('')}</div>
<h2>Work experience</h2>${C.experience.map((e) => `<div class="job"><div class="top"><h3>${esc(e.role)} — <span class="co">${esc(e.company)}</span></h3><span class="when">${esc(e.period.replace('—', '–'))}</span></div><ul>${e.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul></div>`).join('')}
<h2>Education</h2>${C.education.map((e) => `<div class="edu"><div><b>${esc(e.title)}${e.note ? ` (${esc(e.note)})` : ''}</b> — ${esc(e.org)}</div><span>${esc(e.year)}</span></div>`).join('')}
<h2>Selected projects</h2>${C.projects.slice(0, 3).map((p) => `<div class="proj"><b>${esc(p.name)}</b> <span class="s">${p.stack.map(esc).join(' · ')}</span><br>${esc(p.description)}</div>`).join('')}
</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'load' });
const out = fileURLToPath(new URL('../public/cv/Vishnutharan-Karunakaran-CV.pdf', import.meta.url));
await page.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true });
await browser.close();
console.log('wrote', out);
