// Pure string renderers — used at build time (vite.config.js) to pre-render content into index.html.
export const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const icon = {
  arrow: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  down: '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 4v13m0 0-5-5m5 5 5-5M5 20h14" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  github: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11Zm0 .5 9 6 9-6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
};
export { icon };

export function render(C) {
  const P = C.person;
  const out = {};

  out.hero = `
    <p class="pill reveal-up"><span class="pill__avatar" data-photo="hero"><img alt="" width="48" height="48" decoding="async" /><b>${esc(P.initials)}</b></span>
      <span>${esc(C.experience[0].role)} at <strong>${esc(C.experience[0].company)}</strong></span><span class="pill__dot" aria-hidden="true"></span><span class="muted">${esc(P.location)}</span></p>
    <h1 class="hero__title" id="hero-title">
      <span class="sr-only">${esc(P.name)} — ${esc(P.role)}. </span>
      <span class="hero__line" aria-hidden="true"><span>${esc(P.headline[0])}</span></span>
      <span class="hero__line" aria-hidden="true"><span><em>${esc(P.headline[1])}</em></span></span>
      <span class="hero__line" aria-hidden="true"><span>${esc(P.headline[2])}</span></span>
    </h1>
    <p class="hero__intro reveal-up"><strong>${esc(P.name)}</strong> — ${esc(P.intro)}</p>
    <div class="hero__cta reveal-up">
      <a class="btn btn--primary" href="#experience" data-magnetic>View experience</a>
      <a class="btn btn--ghost" href="${esc(P.cvPdf)}" download data-magnetic>${icon.down}<span>Download CV</span></a>
      <span class="hero__social">
        <a href="${esc(P.github)}" target="_blank" rel="noopener" aria-label="GitHub profile">${icon.github}</a>
        <a href="${esc(P.linkedin)}" target="_blank" rel="noopener" aria-label="LinkedIn profile">${icon.linkedin}</a>
        <a href="mailto:${esc(P.email)}" aria-label="Email ${esc(P.email)}">${icon.mail}</a>
      </span>
    </div>
    <dl class="highlights reveal-up">${C.highlights.map((h) => `<div><dt>${esc(h.label)}</dt><dd>${esc(h.value)}</dd></div>`).join('')}</dl>`;

  const stack = ['C#', '.NET', 'ASP.NET', 'Angular', 'React', 'TypeScript', 'Java', 'Spring Boot', 'MS SQL', 'MongoDB', 'Stripe', 'JWT / OAuth', 'Azure DevOps', 'Postman'];
  out.stack = [...stack, ...stack].map((s) => `<span>${esc(s)}</span>`).join('');

  out.about = `
    <figure class="portrait reveal-css" data-photo="about">
      <div class="portrait__frame">
        <img alt="Portrait of ${esc(P.name)}" width="600" height="750" loading="lazy" decoding="async" />
        <div class="monogram" aria-hidden="true"><span>${esc(P.initials)}</span><svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="88"/><circle cx="100" cy="100" r="64"/></svg></div>
      </div>
      <figcaption><span>${esc(P.name)}</span><span class="mono muted">${esc(P.role)}</span></figcaption>
    </figure>
    <div class="about__text">
      <p class="eyebrow">About</p>
      <h2 class="h2" id="about-title">Engineering reliable products, <em>end to end.</em></h2>
      <p class="lead">${esc(C.summary)}</p>
      <ul class="specialisms" role="list">${C.specialisms.map((s, i) => `<li class="card spot reveal-css"><span class="mono muted">0${i + 1}</span><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></li>`).join('')}</ul>
    </div>`;

  out.experience = C.experience.map((e) => `
    <li class="job reveal-css${e.secondary ? ' job--secondary' : ''}">
      <div class="job__when mono">${esc(e.period)}${e.current ? '<span class="badge">Current</span>' : ''}</div>
      <article class="job__body card spot">
        <header><h3>${esc(e.role)}</h3><p class="job__co">${esc(e.company)}</p></header>
        <ul>${e.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>
        ${e.tags.length ? `<p class="tags">${e.tags.map((t) => `<span>${esc(t)}</span>`).join('')}</p>` : ''}
      </article>
    </li>`).join('');

  out.projects = C.projects.map((p, i) => `
    <li class="project${p.featured ? ' project--featured' : ''}">
      <a class="card spot" href="${esc(p.url)}" target="_blank" rel="noopener">
        <div class="project__top"><span class="mono muted">${String(i + 1).padStart(2, '0')}</span>${p.featured ? '<span class="badge">Featured</span>' : ''}<span class="project__year mono muted">${esc(p.year)}</span></div>
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.description)}</p>
        <div class="project__foot"><p class="tags">${p.stack.map((s) => `<span>${esc(s)}</span>`).join('')}</p><span class="project__go" aria-hidden="true">${icon.arrow}</span></div>
        <span class="project__repo mono muted">github.com/Vishnutharan/${esc(p.repo)}</span>
      </a>
    </li>`).join('') + `
    <li class="project project--more"><a class="card spot" href="${esc(P.github)}" target="_blank" rel="noopener"><span class="mono muted">More</span><h3>All repositories on GitHub</h3><span class="project__go" aria-hidden="true">${icon.arrow}</span></a></li>`;

  out.skills = C.skills.map((g) => `
    <div class="skill card spot reveal-css"><h3 class="mono">${esc(g.group)}</h3><ul role="list">${g.items.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>`).join('');

  out.education = C.education.map((e) => `
    <li class="edu reveal-css"><span class="edu__year mono">${esc(e.year)}</span><div><h3>${esc(e.title)}${e.note ? ` <span class="badge">${esc(e.note)}</span>` : ''}</h3><p>${esc(e.org)}</p></div></li>`).join('');

  out.contact = `
    <a class="btn btn--primary btn--lg" href="mailto:${esc(P.email)}" data-magnetic>${icon.mail}<span>${esc(P.email)}</span></a>
    <a class="btn btn--ghost btn--lg" href="${esc(P.linkedin)}" target="_blank" rel="noopener" data-magnetic>${icon.linkedin}<span>LinkedIn</span></a>
    <a class="btn btn--ghost btn--lg" href="${esc(P.github)}" target="_blank" rel="noopener" data-magnetic>${icon.github}<span>GitHub</span></a>`;

  out.footer = `<p>© ${new Date().getFullYear()} ${esc(P.name)}</p><p class="muted">Built with Three.js, GSAP &amp; modern CSS</p><a href="#top" class="mono">Back to top ↑</a>`;

  out.jsonld = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Person', name: P.name, jobTitle: P.role, email: `mailto:${P.email}`,
    url: C.meta.url, sameAs: [P.github, P.linkedin],
    worksFor: { '@type': 'Organization', name: C.experience[0].company },
    alumniOf: C.education.slice(0, 2).map((e) => ({ '@type': 'CollegeOrUniversity', name: e.org })),
  });
  return out;
}
