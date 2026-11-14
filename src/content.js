/**
 * ─────────────────────────────────────────────────────────────
 *  ALL EDITABLE CONTENT LIVES HERE.
 *  Anything in [square brackets] is a placeholder — replace it.
 *  Photos: drop files into /public/assets/photos/ (see README).
 * ─────────────────────────────────────────────────────────────
 */
export const content = {
  meta: {
    title: 'Vishnutharan Karunakaran — Software Developer Portfolio',
    description:
      'Portfolio of Vishnutharan Karunakaran, a UK-based software developer building full-stack web applications with C#/.NET, Java/Spring Boot, Angular and React.',
    url: 'https://vishnutharan.github.io/', // [Your final site URL]
  },

  person: {
    name: 'Vishnutharan Karunakaran',
    firstName: 'Vishnutharan',
    lastName: 'Karunakaran',
    role: 'Full-Stack Software Developer', // [Your role here]
    location: 'United Kingdom',
    tagline: 'I build booking systems, APIs and interfaces that feel effortless.',
    availability: '[Open to opportunities]',
    email: '', // [your@email.com] — leave empty to hide mailto
    photos: {
      hero: '/assets/photos/hero.webp',
      about: '/assets/photos/about.webp',
    },
  },

  about: {
    heading: 'Engineering calm, fast, human software.',
    paragraphs: [
      "I'm a developer based in the United Kingdom who enjoys turning real-world workflows — hotel stays, tour bookings, classes, salons, attendance — into clean, reliable applications end to end.",
      'My work spans C# / ASP.NET back ends, Java & Spring Boot services, and Angular, React and TypeScript front ends. [Add a sentence about what drives you.]',
    ],
    facts: [
      { label: 'Based in', value: 'United Kingdom' },
      { label: 'Public repos', value: '11' },
      { label: 'Coding on GitHub since', value: '2022' },
    ],
  },

  skills: [
    { group: 'Back end', items: ['C#', 'ASP.NET Core', 'Java', 'Spring Boot', 'REST APIs', 'Auth / OAuth'] },
    { group: 'Front end', items: ['Angular', 'React', 'TypeScript', 'JavaScript', 'HTML', 'CSS'] },
    { group: 'Data & tools', items: ['SQL', 'Git & GitHub', '[Add a tool]', '[Add a tool]'] },
  ],

  // Pulled from github.com/Vishnutharan (public repositories only)
  projects: [
    { name: 'ClassBooking-Application', description: 'Class booking application. [Add a one-line description]', language: 'C#', stars: 1, url: 'https://github.com/Vishnutharan/ClassBooking-Application', year: 2025 },
    { name: 'FLC_BookingSystem', description: 'Booking system built in Java. [Add a one-line description]', language: 'Java', stars: 0, url: 'https://github.com/Vishnutharan/FLC_BookingSystem', year: 2026 },
    { name: 'ABC-Hotel-BackEnd', description: 'This has the login and register code', language: 'C#', stars: 1, url: 'https://github.com/Vishnutharan/ABC-Hotel-BackEnd', year: 2024 },
    { name: 'AttndanceSystem-Auth-Java', description: 'SpringBoot Auth Project', language: 'Java', stars: 0, url: 'https://github.com/Vishnutharan/AttndanceSystem-Auth-Java', year: 2024 },
    { name: 'Spring-Boot-CRUD', description: 'CRUD service with Spring Boot. [Add a one-line description]', language: 'Java', stars: 0, url: 'https://github.com/Vishnutharan/Spring-Boot-CRUD', year: 2024 },
    { name: 'React-CRUD-Front-Back-2', description: 'Full-stack React CRUD app. [Add a one-line description]', language: 'JavaScript', stars: 0, url: 'https://github.com/Vishnutharan/React-CRUD-Front-Back-2', year: 2024 },
    { name: 'Employee-Crud-FrontEnd', description: 'Employee CRUD front end. [Add a one-line description]', language: 'TypeScript', stars: 0, url: 'https://github.com/Vishnutharan/Employee-Crud-FrontEnd', year: 2024 },
    { name: 'My-First-Project', description: 'C# Hall_Managment', language: 'C#', stars: 0, url: 'https://github.com/Vishnutharan/My-First-Project', year: 2022 },
  ],
  githubUrl: 'https://github.com/Vishnutharan',

  experience: [
    { period: '[20XX — Present]', title: '[Your role here]', org: '[Company]', text: '[What you built, owned or improved.]' },
    { period: '[20XX — 20XX]', title: '[Previous role]', org: '[Company]', text: '[Key achievement.]' },
    { period: '[20XX — 20XX]', title: '[Degree / Course]', org: '[University]', text: '[Focus area or thesis.]' },
  ],

  socials: [
    { label: 'GitHub', url: 'https://github.com/Vishnutharan' },
    { label: 'LinkedIn', url: '' }, // [your LinkedIn URL]
  ],
};
