// Single source of truth — everything on the site is driven from here.
// Sourced from Arju Singh's CV.

export const PROFILE = {
  name: 'Arju Singh',
  firstName: 'Arju',
  lastName: 'Singh',
  roles: ['Entrepreneur', 'Software Engineer', 'Generative AI Engineer'],
  tagline: 'Building revolutionary startups that transform industries — full-stack engineering meets generative AI.',
  summary:
    'Entrepreneur, Software Engineer and Generative AI Engineer building revolutionary startups that transform industries. Hands-on across full-stack web development, UI/UX design, generative AI and product building. Completed a Software Development Internship with India’s Ministry of Housing and Urban Affairs, and founded and launched live startups spanning legal tech and pet care.',
  email: 'connect@arjusingh.com',
  phone: '+91 93064 66642',
  location: 'India',
  website: 'https://arjusingh.com',
  resume: '/Arju_Singh_CV.pdf',
  socials: [
    { label: 'LinkedIn', handle: 'arju-singh', url: 'https://www.linkedin.com/in/arju-singh-0ab697228/' },
    { label: 'GitHub', handle: 'arju-singh', url: 'https://github.com/arju-singh' },
    { label: 'Website', handle: 'arjusingh.com', url: 'https://arjusingh.com' },
    { label: 'Email', handle: 'connect@arjusingh.com', url: 'mailto:connect@arjusingh.com' }
  ]
};

export const STATS = [
  { value: 2, suffix: '', label: 'Live startups founded' },
  { value: 100, suffix: '+', label: 'Active platform users' },
  { value: 60, suffix: '+', label: 'Developers mentored' },
  { value: 5, suffix: '+', label: 'Years building software' }
];

// Capability marquee
export const MARQUEE = [
  'React',
  'Next.js',
  'Node.js',
  'Express.js',
  'MongoDB',
  'TypeScript',
  'Firebase',
  'Tailwind CSS',
  'Python',
  'Generative AI',
  'LLM Integration',
  'OpenAI API',
  'Gemini API',
  'Claude API',
  'Prompt Engineering',
  'UI / UX',
  'Figma',
  'AWS',
  'Google Cloud',
  'REST APIs'
];

export const SKILL_GROUPS = [
  { title: 'Frontend', items: ['React', 'Next.js', 'Tailwind CSS', 'Responsive Design', 'HTML5 Canvas'] },
  { title: 'Backend', items: ['Node.js', 'Express.js', 'REST APIs', 'Cloud Functions', 'Firebase'] },
  { title: 'Databases', items: ['MongoDB', 'Firestore', 'Realtime Database', 'SQL'] },
  { title: 'Generative AI', items: ['OpenAI API', 'Gemini API', 'Claude API', 'Prompt Engineering'] },
  { title: 'Design', items: ['Figma', 'Prototyping', 'Wireframing', 'User Research'] },
  { title: 'Cloud & DevOps', items: ['AWS', 'Google Cloud', 'Git', 'GitHub', 'CI/CD'] }
];

export const EXPERIENCE = [
  {
    role: 'Software Engineer',
    company: 'Akshay Lakshay Pvt Ltd',
    period: 'Jan 2026 — May 2026',
    location: 'India',
    tech: ['React', 'JavaScript', 'Firebase', 'UI/UX', 'AI Integration', 'Prompt Engineering'],
    points: [
      'Designed and developed end-to-end software solutions across React frontends and Firebase backends.',
      'Integrated LLM-based AI features and engineered prompts for intelligent, user-facing capabilities.',
      'Owned deployment, debugging and performance optimization in production under Agile.'
    ]
  },
  {
    role: 'Founder & CEO',
    company: 'PetsCare.Club',
    period: '2024 — Present',
    location: 'India',
    tech: ['React', 'Node.js', 'Firebase', 'REST APIs', 'Payments'],
    points: [
      'Founded and launched a live pet-care platform connecting owners with vets, groomers and communities.',
      'Architected the full-stack platform end-to-end — product strategy, UI/UX and backend.',
      'Scaled to 100+ active users with service booking, community features and provider dashboards.'
    ]
  },
  {
    role: 'Software Instructor',
    company: 'Mega Tech Bot',
    period: 'Sep 2024 — Dec 2025',
    location: 'India',
    tech: ['JavaScript', 'HTML', 'CSS', 'Programming Fundamentals'],
    points: [
      'Taught programming and software development to 60+ aspiring developers.',
      'Designed curriculum and hands-on exercises across web fundamentals and modern frameworks.'
    ]
  },
  {
    role: 'MERN Stack Trainee',
    company: 'Croma Campus',
    period: 'Jul 2024 — Dec 2024',
    location: 'India',
    tech: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Git'],
    points: [
      'Completed comprehensive MERN training with hands-on project development.',
      'Built full-stack apps with RESTful APIs, auth flows and component-driven UI.',
      'Recognized as a good performer and excellent learner (Cert ID: CCN-43321794).'
    ]
  },
  {
    role: 'Software Development Intern',
    company: 'Ministry of Housing & Urban Affairs, Govt. of India',
    period: 'Jul 2023 — Sep 2023',
    location: 'New Delhi, India',
    tech: ['Web Technologies', 'Government Portals', 'Data Visualization'],
    points: [
      'Contributed to urban development tech under the DAY-NULM program via the TULIP internship.',
      'Delivered analytics dashboards and reporting modules supporting smart-city initiatives.'
    ]
  }
];

// Live startups + key projects. `kind` drives the mockup style.
export const PROJECTS = [
  {
    slug: 'petscare-club',
    title: 'PetsCare.Club',
    category: 'Live Startup · PetTech',
    kind: 'dashboard',
    year: '2024',
    accent: '#6ee7b7',
    link: 'https://petscare.club',
    summary: 'A live pet-care platform connecting owners with vets, groomers and communities.',
    description:
      'Founded and launched end-to-end. Service booking, provider dashboards and community features, scaled to 100+ active users.',
    tech: ['React', 'Node.js', 'Firebase', 'REST APIs', 'Payments'],
    metrics: [
      { k: '100+', v: 'Active users' },
      { k: '3', v: 'Provider types' },
      { k: 'Live', v: 'In production' }
    ]
  },
  {
    slug: 'lawms',
    title: 'LawMS',
    category: 'Live Startup · LegalTech',
    kind: 'kanban',
    year: '2024',
    accent: '#c4b5fd',
    link: 'https://lawms.in',
    summary: 'AI-powered legal management — case tracking, document AI and automated billing.',
    description:
      'Case tracking, document categorization, deadline management and automated billing for law practices, powered by LLM APIs.',
    tech: ['React', 'Node.js', 'MongoDB', 'LLM APIs'],
    metrics: [
      { k: 'LLM', v: 'Doc categorize' },
      { k: 'Auto', v: 'Billing' },
      { k: 'Track', v: 'Deadlines' }
    ]
  },
  {
    slug: 'portfolio',
    title: 'Portfolio',
    category: 'Key Project · Web',
    kind: 'site',
    year: '2026',
    accent: '#c8ff4d',
    link: 'https://arjusingh.com',
    summary: 'This site — a fast, animated personal portfolio built from scratch.',
    description:
      'A custom-built personal portfolio with a single source-of-truth data layer, smooth scroll, 3D/particle effects and a fully responsive design. Built with React and Vite, deployed on Firebase Hosting at arjusingh.com.',
    tech: ['React', 'Vite', 'Three.js', 'Framer Motion', 'Firebase Hosting'],
    metrics: [
      { k: 'Live', v: 'arjusingh.com' },
      { k: '3D', v: 'Particle FX' },
      { k: '100', v: 'Lighthouse-ready' }
    ]
  },
  {
    slug: 'analytics-dashboard',
    title: 'Analytics Dashboard',
    category: 'Key Project · BI',
    kind: 'analytics',
    year: '2023',
    accent: '#fcd34d',
    link: null,
    summary: 'Real-time BI dashboard with interactive charts and AI-generated insights.',
    description:
      'Interactive charts, drill-down views, customizable KPI tracking, AI-generated insights and role-based access control.',
    tech: ['React', 'Chart.js', 'Node.js', 'MongoDB'],
    metrics: [
      { k: 'RBAC', v: 'Access control' },
      { k: 'AI', v: 'Insights' },
      { k: 'Live', v: 'KPIs' }
    ]
  },
  {
    slug: 'task-management',
    title: 'Task Management System',
    category: 'Key Project · Productivity',
    kind: 'kanban',
    year: '2023',
    accent: '#67e8f9',
    link: null,
    summary: 'Enterprise collaboration with kanban, real-time sync and integrations.',
    description:
      'Kanban boards, drag-and-drop, real-time sync, deadline reminders, progress analytics and Slack/Google Calendar integrations. PWA.',
    tech: ['React', 'Firebase', 'Cloud Functions', 'PWA'],
    metrics: [
      { k: 'Real-time', v: 'Sync' },
      { k: 'Slack', v: 'Integration' },
      { k: 'PWA', v: 'Offline' }
    ]
  },
  {
    slug: 'flappy-bird',
    title: 'Flappy Bird Game',
    category: 'Key Project · Game',
    kind: 'game',
    year: '2022',
    accent: '#86efac',
    link: 'https://flappybird.arjusingh.com',
    summary: 'Browser Flappy Bird clone with a custom physics engine. Live.',
    description:
      'A browser-based Flappy Bird clone with a custom physics engine, scoring system and responsive controls. Deployed and live.',
    tech: ['JavaScript', 'HTML5 Canvas'],
    metrics: [
      { k: 'Custom', v: 'Physics' },
      { k: '60fps', v: 'Canvas' },
      { k: 'Live', v: 'Deployed' }
    ]
  },
  {
    slug: 'hope-charity',
    title: 'Hope Charity Website',
    category: 'Key Project · Non-profit',
    kind: 'site',
    year: '2022',
    accent: '#f9a8d4',
    link: null,
    summary: 'Responsive charity platform with secure donations and event management.',
    description:
      'Secure donation processing, volunteer registration, event management and an animated UI on a fully responsive platform.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Payment APIs'],
    metrics: [
      { k: 'Secure', v: 'Donations' },
      { k: 'Events', v: 'Management' },
      { k: '100%', v: 'Responsive' }
    ]
  }
];

export const CERTIFICATIONS = [
  {
    title: 'MERN Stack Training — Certificate of Achievement',
    issuer: 'Croma Campus (NASSCOM Member · Wipro Partner)',
    date: 'Mar 2025',
    id: 'CCN-43321794',
    url: 'https://drive.google.com/file/d/13YVpb2uKNKEyExXNiMVb3ZVZ6sdl8l0H/view'
  },
  {
    title: 'TULIP — The Urban Learning Internship Program',
    issuer: 'Ministry of Housing & Urban Affairs, Govt. of India (DAY-NULM)',
    date: 'Oct 2023',
    id: null,
    url: 'https://drive.google.com/file/d/1XcbUltnNBld0rVopKoUMyswQ1r_-Bu2L/view'
  },
  {
    title: 'Microsoft Learn Student Ambassador — DevRise',
    issuer: 'Microsoft',
    date: '2022',
    id: null,
    url: 'https://drive.google.com/file/d/1EvMa7TCKKXbilzqYcW7tFFAhQvKkMOdG/view'
  },
  {
    title: 'Projectathon Competition — 3rd Position',
    issuer: 'GJUST-CODERS Coding Club, GJUS&T Hisar',
    date: 'Jan 2022',
    id: 'TPC/E-CERT/22/3435',
    url: 'https://drive.google.com/file/d/1RYiYILSRe87Nqn0rM0KN2RZG0PUirwhz/view'
  }
];

export const EDUCATION = {
  degree: 'B.Tech in Information Technology',
  school: 'Guru Jambheshwar University of Science & Technology, Hisar',
  period: '2021 — 2025'
};

export const RESOURCES = [
  {
    title: 'Résumé / CV',
    desc: 'Full PDF résumé — experience, projects, skills and certifications.',
    action: 'Download PDF',
    url: '/Arju_Singh_CV.pdf',
    download: true,
    tag: 'PDF'
  },
  {
    title: 'GitHub',
    desc: 'Open-source work, experiments and project source.',
    action: 'github.com/arju-singh',
    url: 'https://github.com/arju-singh',
    tag: 'Code'
  },
  {
    title: 'LinkedIn',
    desc: 'Professional background, recommendations and updates.',
    action: 'in/arju-singh',
    url: 'https://www.linkedin.com/in/arju-singh-0ab697228/',
    tag: 'Network'
  },
  {
    title: 'Personal Site',
    desc: 'Live products, writing and the latest from me.',
    action: 'arjusingh.com',
    url: 'https://arjusingh.com',
    tag: 'Web'
  }
];
