/**
 * All site content — sourced from Vishnutharan's CV and public GitHub repositories.
 * Privacy: phone number and home address are intentionally NOT included.
 * Photos: drop hero.webp / about.webp into /public/assets/photos/ (see README there).
 */
export const content = {
  meta: {
    title: 'Vishnutharan Karunakaran — Full-Stack Software Engineer',
    description:
      'Full-Stack Software Engineer with 3+ years across .NET, Angular and the MERN stack — authentication, Stripe payments and scalable CRUD systems on MS SQL and MongoDB.',
    url: 'https://vishnutharan.github.io/',
  },

  person: {
    name: 'Vishnutharan Karunakaran',
    firstName: 'Vishnutharan',
    lastName: 'Karunakaran',
    initials: 'VK',
    role: 'Full-Stack Software Engineer',
    location: 'United Kingdom',
    email: 'karunakaran.vishnu6@gmail.com',
    linkedin: 'https://www.linkedin.com/in/vishnutharan-karunakaran-a0096521a',
    github: 'https://github.com/Vishnutharan',
    cvPdf: '/cv/Vishnutharan-Karunakaran-CV.pdf',
    headline: ['Full-stack engineer building', 'secure, scalable', 'web platforms.'],
    intro:
      '3+ years across .NET, Angular and the MERN stack — from JWT & Google OAuth authentication to Stripe-integrated payments and role-based admin dashboards.',
    photos: { hero: '/assets/photos/hero.webp', about: '/assets/photos/about.webp' },
  },

  highlights: [
    { value: '3+', label: 'Years building software' },
    { value: 'Prima', label: 'Software Engineer, Aug 2025 – Present' },
    { value: 'MSc', label: 'Software Engineering, University of Hertfordshire' },
  ],

  summary:
    'Full-stack Software Engineer with 3+ years of experience across .NET, Angular, and MERN stack, specialising in JWT/Google OAuth authentication, Stripe-integrated payments, and scalable CRUD systems on MS SQL and MongoDB. Proven track record delivering booking platforms, food delivery systems, and enterprise sales management tools with PDF invoicing, email notifications, and role-based admin dashboards. Adept in QA practices, API testing, and CI/CD pipelines.',

  specialisms: [
    { title: 'Authentication', text: 'JWT and Google OAuth sign-in flows.' },
    { title: 'Payments', text: 'Stripe-integrated checkout and payments.' },
    { title: 'Data & CRUD', text: 'Scalable CRUD systems on MS SQL and MongoDB.' },
    { title: 'Business features', text: 'PDF invoicing, email notifications, role-based admin dashboards.' },
    { title: 'Quality', text: 'QA practices, API testing and CI/CD pipelines.' },
  ],

  experience: [
    {
      role: 'Software Engineer', company: 'Prima', period: 'Aug 2025 — Present', current: true,
      points: [
        'Developed and maintained a web-based sales management system for Ceylon Beverage International.',
        'Implemented new features, performed system modifications, and resolved critical bugs to improve UX.',
      ],
      tags: ['Sales management', 'Feature delivery', 'Bug fixing'],
    },
    {
      role: 'Intern QA Engineer', company: 'Unicom SD', period: 'Jul 2023 — Nov 2023',
      points: [
        'Designed test cases and scenarios; executed manual and performance testing across web applications.',
        'Worked within CI/CD pipelines and DevOps workflows; managed the full bug lifecycle from reporting to closure.',
      ],
      tags: ['Manual testing', 'Performance testing', 'CI/CD', 'DevOps'],
    },
    {
      role: 'Software Engineer Intern', company: 'Unicom SD', period: 'Nov 2022 — May 2023',
      points: [
        'Built CRUD applications using Angular, .NET MVC, .NET Web Apps, and MS SQL with stored procedures.',
        'Contributed to a large-scale Event Management System — Excel import/export with DB sync, bug fixing, and feature enhancements.',
      ],
      tags: ['Angular', '.NET MVC', 'MS SQL', 'Stored procedures'],
    },
    {
      role: 'Service Colleague', company: 'ASDA UK', period: '2026 — Present', current: true, secondary: true,
      points: ['Delivering excellent customer service within a fast-paced retail environment in the UK.'],
      tags: [],
    },
  ],

  skills: [
    { group: 'Languages', items: ['Java', 'C#', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'SQL'] },
    { group: 'Frameworks', items: ['Angular', '.NET', 'ASP.NET', 'Entity Framework', 'React'] },
    { group: 'Tools & Platforms', items: ['Git', 'Azure DevOps', 'Postman', 'WordPress', 'MS Office'] },
    { group: 'Quality Assurance', items: ['Manual Testing', 'Debugging', 'Test Plans', 'CI/CD', 'API Testing'] },
  ],

  // Public repositories on github.com/Vishnutharan (descriptions from each repo's README / languages)
  projects: [
    { name: 'ClassBooking Platform', repo: 'ClassBooking-Application', description: 'Class booking platform with an ASP.NET API and Angular front end, including Stripe Checkout card payments alongside cash payments.', stack: ['C#', '.NET', 'Angular', 'Stripe'], url: 'https://github.com/Vishnutharan/ClassBooking-Application', year: 2025, featured: true },
    { name: 'FLC Booking System', repo: 'FLC_BookingSystem', description: 'Java Swing booking app for a leisure centre: timetable filtering, capacity limits, conflict checks, booking changes with rollback and audit reports.', stack: ['Java', 'Swing'], url: 'https://github.com/Vishnutharan/FLC_BookingSystem', year: 2026, featured: true },
    { name: 'ABC Hotel — Back End', repo: 'ABC-Hotel-BackEnd', description: 'Hotel system back end containing the login and registration code.', stack: ['C#', '.NET'], url: 'https://github.com/Vishnutharan/ABC-Hotel-BackEnd', year: 2024 },
    { name: 'Attendance System Auth', repo: 'AttndanceSystem-Auth-Java', description: 'Spring Boot authentication project for an attendance system.', stack: ['Java', 'Spring Boot'], url: 'https://github.com/Vishnutharan/AttndanceSystem-Auth-Java', year: 2024 },
    { name: 'React CRUD — Full Stack', repo: 'React-CRUD-Front-Back-2', description: 'CRUD application with separate React front end and JavaScript back end.', stack: ['React', 'JavaScript'], url: 'https://github.com/Vishnutharan/React-CRUD-Front-Back-2', year: 2024 },
    { name: 'Spring Boot CRUD', repo: 'Spring-Boot-CRUD', description: 'CRUD REST service built with Spring Boot.', stack: ['Java', 'Spring Boot'], url: 'https://github.com/Vishnutharan/Spring-Boot-CRUD', year: 2024 },
    { name: 'Employee CRUD — Angular', repo: 'Employee-Crud-FrontEnd', description: 'Employee management CRUD front end built with Angular.', stack: ['Angular', 'TypeScript'], url: 'https://github.com/Vishnutharan/Employee-Crud-FrontEnd', year: 2024 },
    { name: 'Hall Management', repo: 'My-First-Project', description: 'Hall management system — the first project on GitHub.', stack: ['C#', 'PHP'], url: 'https://github.com/Vishnutharan/My-First-Project', year: 2022 },
  ],

  education: [
    { title: 'MSc Software Engineering', note: 'Ongoing', org: 'University of Hertfordshire', year: '2026' },
    { title: 'BSc Software Engineering', org: 'Cardiff Metropolitan University', year: '2024' },
    { title: 'HND in Software Engineering', org: 'Pearson College', year: '2020' },
    { title: 'Diploma in English', org: 'British College', year: '2020' },
    { title: 'Diploma in Business Application', org: 'MCS IT Campus', year: '2019' },
  ],
};
