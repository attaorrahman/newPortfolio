export const profile = {
  firstName: "Atta Ur",
  lastName: "Rahman",
  fullName: "M. Atta Ur Rahman",
  role: "AI Powered Full Stack Developer",
  location: "Based in Lahore",
  email: "ar416.official@gmail.com",
  phone: "+92 321 6108400",
  website: "attaurrahman.dev",
  linkedin: "linkedin.com/in/attaurahman",
};

export const navLinks = [
  { name: "Home", href: "/#home" },
  { name: "About", href: "/about" },
  { name: "Skills", href: "/#skills" },
  { name: "Experience", href: "/#experience" },
  { name: "Portfolio", href: "/projects" },
  { name: "Contact", href: "/#contact" },
];

export const resumeUrl = "/Mr.%20Atta%20Ur%20Rahman%20resume.pdf";
export const resumeFileName = "Mr.-Atta-Ur-Rahman-Resume.pdf";

export const whatsappNumber = "923216108400"; // international format, no +
export const contactEmail = "ar416.official@gmail.com";

export const heroStats = [
  { value: "100%", label: "Client Satisfaction" },
  { value: "30+", label: "Projects Delivered" },
  { value: "3+", label: "Years Experience" },
];

export const aboutTabs = ["MYSELF", "EDUCATION", "MY TOOLS"] as const;

export const aboutContent = {
  MYSELF:
    "AI Powered Full Stack Developer with 3+ years of experience building responsive and dynamic web applications using React.js, Next.js, and Node.js. I create clean, scalable user interfaces, develop RESTful APIs, and integrate third-party services to deliver smooth, high-performance experiences — with strong focus on troubleshooting and cross-functional delivery.",
  EDUCATION:
    "BS Computer Science — The Islamia University Bahawalpur. Intermediate from Govt. Sayad Nasr Ul Deen Shah Degree College, Gogran, Lodhran. Certified by Microsoft (Frontend Developer), IBM (Front-End Apps with React) and Packt/Coursera (Advanced React & Ecommerce).",
  "MY TOOLS":
    "React.js · Next.js · Redux Toolkit · Node.js / Express · MongoDB · REST APIs · JavaScript · HTML / CSS · Material UI · Bootstrap · Git / GitHub · Axios · JWT Auth · Stripe · Firebase · Mapbox.",
};

export const services = [
  {
    id: 1,
    icon: "desktop",
    projects: 12,
    title: "Web Development",
    description:
      "Responsive, SEO-friendly web apps built with React.js and Next.js — dashboards, tables, filters and modular UI.",
    progress: 92,
  },
  {
    id: 2,
    icon: "mobile",
    projects: 8,
    title: "Frontend UI Engineering",
    description:
      "Material UI, Bootstrap and custom CSS with Redux Toolkit state management and real-time form validation.",
    progress: 88,
  },
  {
    id: 3,
    icon: "brand",
    projects: 10,
    title: "Full-Stack & APIs",
    description:
      "Node.js + Express + MongoDB backends, REST APIs, JWT authentication and Stripe payment integration.",
    progress: 80,
  },
];

export type Project = {
  id: number;
  title: string;
  tagline: string;
  image: string;
  tech: string[];
  gradient: string;
  confidential?: boolean;
  links: { live: string; repo?: string };
};

export const projects: Project[] = [
  {
    id: 1,
    title: "AhmaSoft",
    tagline:
      "Full-stack development, API integration & server management solutions",
    image: "/ahmasoft.png",
    gradient: "from-orange-500 via-red-500 to-rose-600",
    confidential: true,
    tech: [
      "React",
      "Next.js",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Firebase",
      "Socket.io",
      "Tailwind",
      "Prisma",
    ],
    links: { live: "https://ahmasoft.com/" },
  },
  {
    id: 2,
    title: "Ahmad Shayan Portfolio",
    tagline:
      "Building scalable systems, automation workflows & intelligent infrastructure",
    image: "/ahmadShayan.png",
    gradient: "from-blue-700 via-blue-500 to-cyan-400",
    confidential: true,
    tech: [
      "Node.js",
      "Automation",
      "System Design",
      "Cloud",
      "APIs",
      "Microservices",
    ],
    links: { live: "https://ahmadshayan.com/" },
  },
  {
    id: 3,
    title: "Admin Dashboard",
    tagline: "Analytics, tables, auth – React + MUI + RTK Query",
    image: "/AdminDB.png",
    gradient: "from-purple-800 via-purple-600 to-pink-500",
    tech: ["React", "MUI", "Redux Toolkit", "Node"],
    links: {
      live: "https://aradmindashboard.netlify.app/",
      repo: "https://github.com/attaorrahman/admin-dashboard",
    },
  },
  {
    id: 4,
    title: "BNH Masterkey",
    tagline:
      "Full-stack content & filter management platform built solo — forms, dynamic content display and advanced filtering",
    image: "/bnhmasterkey.png",
    gradient: "from-emerald-700 via-teal-600 to-cyan-500",
    confidential: true,
    tech: ["Next.js", "Supabase", "Tailwind CSS", "PostgreSQL", "Vercel"],
    links: { live: "https://bnhmasterkey.ae" },
  },
  {
    id: 5,
    title: "ASBISRP",
    tagline:
      "Interactive data platform with analytics graphs, location management, advanced filters and comprehensive form handling",
    image: "/asbisrp.png",
    gradient: "from-blue-800 via-indigo-600 to-violet-500",
    confidential: true,
    tech: ["React.js", "Next.js", "Material UI", "Tailwind CSS"],
    links: { live: "https://asbisrp.com" },
  },
  {
    id: 6,
    title: "TubeVibe",
    tagline:
      "YouTube-like video streaming app with MUI styling and smooth navigation",
    image: "/youtubeClone.png",
    gradient: "from-rose-600 via-red-500 to-orange-500",
    tech: ["HTML", "CSS", "React.js", "Material UI"],
    links: {
      live: "https://tubevibe.netlify.app/",
      repo: "https://github.com/attaorrahman/youtube_clone",
    },
  },
  {
    id: 7,
    title: "Social Media Frontend",
    tagline:
      "Responsive social media UI built with modern HTML, CSS, and vanilla JavaScript",
    image: "/SocialMEdia.png",
    gradient: "from-indigo-700 via-indigo-500 to-blue-400",
    tech: ["HTML", "CSS", "JavaScript"],
    links: {
      live: "https://socialmediafront-end.netlify.app/",
      repo: "https://github.com/attaorrahman/Social-Media-FrontEnd",
    },
  },
  {
    id: 8,
    title: "AA Visa Consultants",
    tagline:
      "Professional visa consultancy website with clean layout and responsive design",
    image: "/AAvisaConsultancy.png",
    gradient: "from-emerald-600 via-teal-500 to-cyan-400",
    tech: ["HTML", "CSS", "JavaScript"],
    links: {
      live: "https://aavisaconsultants.com/",
      repo: "https://github.com/attaorrahman/AA-Visa-Consultants",
    },
  },
  {
    id: 9,
    title: "FIT Club",
    tagline: "Image grid with filters and modal preview",
    image: "/fitClubIMG.png",
    gradient: "from-amber-500 via-orange-500 to-red-500",
    tech: ["React", "Tailwind", "Lightbox"],
    links: {
      live: "https://arfitnessclub.netlify.app/",
      repo: "https://github.com/attaorrahman/FitnessClub",
    },
  },
  {
    id: 10,
    title: "Portfolio",
    tagline: "React.js, dynamic content, blazing fast on Vercel",
    image: "/portfolioIMG.png",
    gradient: "from-sky-600 via-blue-500 to-indigo-500",
    tech: ["React.js", "Tailwind", "Framer Motion"],
    links: {
      live: "https://attaurahman.netlify.app/",
      repo: "https://github.com/attaorrahman/portfolio",
    },
  },
];

export const socials = [
  { label: "GitHub", href: "https://github.com/attaorrahman" },
  { label: "LinkedIn", href: "https://linkedin.com/in/attaurahman" },
  { label: "Email", href: "mailto:ar416.official@gmail.com" },
];

export const happyClients = "30+";

export const testimonials = [
  {
    id: 1,
    name: "Aleedz Solutions",
    quote:
      "Atta shipped our entire dashboard — responsive tables, advanced filters, Excel export — and kept it performant with memoization and virtualization. Reliable under pressure.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Ahmasoft",
    quote:
      "Strong across both React/Next.js and backend APIs. Picked up production bugs quickly and delivered clean fixes without breaking responsive layouts.",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    id: 3,
    name: "Voyage Freight",
    quote:
      "Built client and admin features with solid JWT auth, PDF generation and real-time validation. Delivered on time across desktop and mobile.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: 4,
    name: "Freelance Client",
    quote:
      "Integrated Stripe checkout and a full Node/Mongo backend for our store. Smooth shopping experience and clean handoff — highly recommended.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
];

export const skillGroups = [
  {
    title: "Frontend",
    items: [
      { name: "React.js", level: 95 },
      { name: "Next.js", level: 92 },
      { name: "JavaScript", level: 94 },
      { name: "TypeScript", level: 85 },
      { name: "Redux Toolkit", level: 90 },
      { name: "HTML / CSS", level: 96 },
      { name: "Tailwind CSS", level: 92 },
      { name: "Material UI", level: 90 },
      { name: "Bootstrap", level: 90 },
    ],
  },
  {
    title: "Backend",
    items: [
      { name: "Node.js", level: 85 },
      { name: "Express", level: 82 },
      { name: "REST APIs", level: 90 },
      { name: "MongoDB", level: 82 },
      { name: "JWT Auth", level: 88 },
      { name: "Stripe", level: 80 },
    ],
  },
  {
    title: "Tools & Others",
    items: [
      { name: "Git / GitHub", level: 92 },
      { name: "Axios", level: 92 },
      { name: "Firebase", level: 80 },
      { name: "Mapbox", level: 75 },
      { name: "PDF-Kit / XLSX", level: 82 },
      { name: "Figma", level: 78 },
    ],
  },
];

export const experience = [
  {
    company: "Aleedz Solutions",
    role: "Full-Stack Developer",
    period: "Aug 2024 — Present",
    location: "Remote · New Zealand",
    bullets: [
      "Built and maintained the full frontend using React.js + Redux Toolkit — dynamic dashboards, responsive data tables, advanced filters, multi-level dropdowns, modals and image previews.",
      "Provided technical support diagnosing UI/API issues, coordinating with backend teams and resolving production bugs.",
      "Integrated APIs with Axios for real-time fetching, implemented pagination, search, sorting and Excel export via XLSX.",
      "Performance work with React.lazy, Suspense, useMemo, React.memo, useRef, debouncing and virtualized tables.",
      "Implemented conditional rendering, real-time form validation, PDF/image handling and interactive UI workflows.",
    ],
  },
  {
    company: "Ahmasoft",
    role: "Full-Stack Developer",
    period: "Feb 2025 — Feb 2026",
    location: "Lahore, Pakistan",
    bullets: [
      "Developed and enhanced web applications using React.js, Next.js and Redux Toolkit — dashboards, tables, filters and responsive UI components.",
      "Worked with backend APIs and server endpoints, managing data flow and implementing search, pagination, sorting and export.",
      "Performed testing and application support — fixing UI bugs, responsiveness issues and resolving production problems.",
      "Improved performance using code-splitting, memoization and optimized rendering, while maintaining responsive layouts with Material UI, Bootstrap and custom CSS.",
    ],
  },
  {
    company: "Voyage Freight",
    role: "Junior Frontend Developer",
    period: "Nov 2023 — Aug 2024",
    location: "Lahore",
    bullets: [
      "Built client- and admin-side features with React.js and Next.js — modular, SEO-friendly, maintainable frontend apps.",
      "Triaged client-reported issues, reproduced bugs and delivered timely fixes to ensure smooth platform operations.",
      "Managed state with Redux Toolkit, handled dynamic data via Axios, implemented JWT auth with real-time form validation.",
      "Created interactive dashboards, tables, filters, modals and PDF generation via PDF-Kit.",
      "Optimized with React.memo, useMemo, useRef and lazy loading via React.lazy + Suspense.",
    ],
  },
];

export const certifications = [
  { name: "Microsoft Frontend Developer", issuer: "Microsoft" },
  { name: "Developing Front-End Apps with React", issuer: "IBM" },
  { name: "Advanced React Projects & Ecommerce", issuer: "Packt / Coursera" },
];

export const articles = [
  {
    id: 1,
    day: "10",
    month: "jul 2025",
    title: "Optimizing React performance with memoization and virtualization",
    readTime: "10 mins read",
    image:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: 2,
    day: "09",
    month: "jun 2025",
    title: "Building role-based dashboards in Next.js with Redux Toolkit",
    readTime: "7 mins read",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=60",
  },
  {
    id: 3,
    day: "06",
    month: "may 2025",
    title: "JWT authentication patterns for secure React applications",
    readTime: "8 mins read",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&auto=format&fit=crop&q=60",
  },
];
