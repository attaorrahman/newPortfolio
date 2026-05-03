import {
  profile,
  heroStats,
  services,
  projects,
  experience,
  certifications,
  skillGroups,
  contactEmail,
  whatsappNumber,
  resumeUrl,
} from "./data";

type Reply = string | (() => string);

type Intent = {
  id: string;
  /** Keywords / phrases. Multi-word phrases are matched as substrings (higher weight). */
  keywords: string[];
  /** Optional regex the input must match. */
  regex?: RegExp;
  /** Optional disqualifier — if any of these appear, intent is skipped. */
  blockers?: string[];
  /** Boost score when this intent fires. */
  weight?: number;
  reply: Reply;
};

const formatPhone = (n: string) =>
  n.replace(/(\d{2})(\d{3})(\d{7})/, "+$1 $2 $3");

const formatProjectsList = (limit = 5) =>
  projects
    .slice(0, limit)
    .map((p, i) => `${i + 1}. **${p.title}** — ${p.tagline}`)
    .join("\n");

const formatExperience = () =>
  experience
    .map(
      (e) =>
        `• **${e.role}** at ${e.company} (${e.period})${
          e.location ? ` — ${e.location}` : ""
        }`
    )
    .join("\n");

const formatSkills = () =>
  skillGroups
    .map(
      (g) =>
        `**${g.title}:** ${g.items.map((s) => s.name).join(", ")}`
    )
    .join("\n\n");

const findProject = (q: string) =>
  projects.find((p) => {
    const t = p.title.toLowerCase();
    return q.includes(t) || (t.includes(" ") && q.includes(t.split(" ")[0]));
  });

export const suggestedPrompts = [
  "What's your tech stack?",
  "Show me your top projects",
  "Are you available to hire?",
  "How do I contact you?",
  "What's your experience?",
];

export const chatbotGreeting = `Hi! I'm Atta's AI assistant. 👋\n\nAsk me anything about his **skills**, **projects**, **experience**, **availability**, **rates**, or **how to get in touch**.`;

const intents: Intent[] = [
  // ---------- conversational ----------
  {
    id: "greeting",
    regex:
      /^\s*(hi|hii+|hello+|hey+|yo|sup|salam|asalam|assalam|hola|namaste|good\s+(morning|evening|afternoon|day))\b/,
    keywords: [],
    weight: 5,
    reply: () =>
      `Hello! 👋 I'm here to answer questions about ${profile.fullName}. Try asking about his **stack**, **projects**, **rates**, or **how to hire him**.`,
  },
  {
    id: "thanks",
    keywords: ["thank", "thanks", "thx", "ty ", " ty", "appreciate", "grateful"],
    reply: "You're welcome! 🙌 Anything else you'd like to know?",
  },
  {
    id: "bye",
    keywords: ["bye", "goodbye", "see you", "see ya", "later", "cya", "talk soon"],
    reply: `Goodbye! 👋 Drop Atta a line at **${contactEmail}** if you have a project in mind.`,
  },
  {
    id: "how-are-you",
    keywords: ["how are you", "how's it going", "how do you do", "what's up", "whats up"],
    reply:
      "I'm doing great — running 24/7 to answer questions about Atta's work. How can I help?",
  },
  {
    id: "joke",
    keywords: ["joke", "funny", "make me laugh"],
    reply:
      "Why did the React developer break up with their partner? They had too many unresolved props. 😄\n\nNow — anything I can tell you about Atta?",
  },

  // ---------- identity / about ----------
  {
    id: "who-are-you",
    keywords: ["who are you", "what are you", "your name", "are you a bot", "are you ai", "are you human"],
    weight: 3,
    reply: () =>
      `I'm an AI assistant built into **${profile.fullName}'s** portfolio. I know everything on this site — his stack, projects, experience, and how to reach him.`,
  },
  {
    id: "about-atta",
    keywords: [
      "about atta",
      "about him",
      "about you",
      "tell me about",
      "who is atta",
      "introduce",
      "background",
      "bio",
    ],
    reply: () =>
      `**${profile.fullName}** is an ${profile.role} based in Lahore with **${heroStats[2].value}** years building responsive, high-performance web applications. He specializes in **React, Next.js & Node.js** — shipping dashboards, admin panels, e-commerce stores, real-time features, and REST APIs. Strong on UI engineering, performance, and clean architecture.`,
  },
  {
    id: "age",
    keywords: ["how old", "age", "your age"],
    reply:
      "Atta keeps that detail private — but he has 3+ years of professional dev experience and a CS degree. Want to know about his stack or projects instead?",
  },

  // ---------- tech stack ----------
  {
    id: "stack",
    keywords: [
      "stack",
      "tech stack",
      "technologies",
      "technology",
      "tools",
      "tooling",
      "languages",
      "framework",
      "frameworks",
      "skills",
      "skill set",
      "what do you use",
      "what do you know",
      "what can you do",
    ],
    weight: 2,
    reply: () => `Here's the full stack:\n\n${formatSkills()}`,
  },

  // tech-specific answers
  {
    id: "tech-react",
    keywords: ["react", "reactjs", "react.js"],
    blockers: ["react native"],
    reply:
      "**React** is one of Atta's strongest skills (95%). Production work includes dashboards, admin panels, e-commerce frontends, and real-time apps — using **Redux Toolkit, React Query, hooks, context**, and performance patterns: memoization, virtualization, code-splitting, lazy loading.",
  },
  {
    id: "tech-nextjs",
    keywords: ["next.js", "nextjs", "next js"],
    reply:
      "**Next.js (App Router & Pages Router)** — SSR, SSG, ISR, API routes, dynamic OG images, MDX blogs, SEO-optimized marketing sites, and full e-commerce. This portfolio itself is built on Next.js 14.",
  },
  {
    id: "tech-node",
    keywords: ["node", "nodejs", "node.js", "express", "backend api", "rest api"],
    reply:
      "**Backend:** Node.js + Express + MongoDB (or PostgreSQL when needed). REST APIs, JWT auth, role-based access, Stripe payments, file uploads, PDF generation (PDF-Kit), Excel export (XLSX), and real-time features via Socket.io.",
  },
  {
    id: "tech-typescript",
    keywords: ["typescript", "ts ", "type script", "types"],
    reply:
      "**TypeScript** is Atta's default for new projects (85%) — strict mode, generics, discriminated unions, and well-typed API layers. Strong opinions on minimizing `any` and modeling state with the type system.",
  },
  {
    id: "tech-database",
    keywords: ["database", "db", "mongodb", "mongo", "postgres", "postgresql", "sql", "nosql", "prisma"],
    reply:
      "**Databases:** MongoDB (primary), PostgreSQL with Prisma, and Firebase Firestore. Comfortable designing schemas, writing aggregations, indexing for performance, and migrations.",
  },
  {
    id: "tech-auth",
    keywords: ["auth", "authentication", "jwt", "login", "oauth"],
    reply:
      "**Authentication:** JWT (access + refresh tokens), session-based auth, OAuth (Google, GitHub), role-based access control, and protected routes. Familiar with NextAuth.js / Auth.js patterns.",
  },
  {
    id: "tech-payments",
    keywords: ["stripe", "payment", "checkout", "paypal"],
    reply:
      "**Payments:** Stripe Checkout, Stripe Elements, webhooks, subscriptions, and refund flows. Built end-to-end e-commerce with cart, order management, and email receipts.",
  },
  {
    id: "tech-styling",
    keywords: ["tailwind", "css", "styling", "scss", "sass", "material ui", "mui", "bootstrap", "shadcn"],
    reply:
      "**Styling:** Tailwind CSS (primary), Material UI, Bootstrap, custom CSS, CSS modules, and Framer Motion for animations. Strong on responsive design and design-system consistency.",
  },
  {
    id: "tech-ai",
    keywords: ["ai ", " ai", "openai", "anthropic", "claude", "gpt", "llm", "chatbot", "machine learning", "ml "],
    weight: 2,
    reply:
      "**AI integrations:** Atta builds AI-powered apps with OpenAI / Anthropic APIs — chat assistants (like this one!), RAG pipelines, document Q&A, semantic search with embeddings, and AI-augmented dashboards.",
  },
  {
    id: "tech-realtime",
    keywords: ["socket", "websocket", "real time", "realtime", "live"],
    reply:
      "**Realtime:** Socket.io for chat, live dashboards, and notifications. Familiar with WebSocket lifecycle, rooms, broadcasting, and presence.",
  },
  {
    id: "tech-mobile",
    keywords: ["react native", "mobile app", "ios", "android", "expo"],
    reply:
      "Atta focuses on the web (React/Next.js). For mobile, he ships responsive PWAs that feel native. Native iOS/Android isn't his primary domain — but happy to collaborate with mobile teams.",
  },
  {
    id: "tech-testing",
    keywords: ["test", "testing", "jest", "vitest", "cypress", "playwright"],
    reply:
      "**Testing:** Jest / Vitest for unit tests, React Testing Library for components, and Cypress / Playwright for E2E. Pragmatic test coverage — focused on critical paths over chasing 100%.",
  },
  {
    id: "tech-deploy",
    keywords: ["deploy", "deployment", "vercel", "netlify", "aws", "docker", "ci", "ci/cd", "devops"],
    reply:
      "**Deployment:** Vercel (default for Next.js), Netlify, and Node servers on AWS/DigitalOcean. Comfortable with GitHub Actions for CI/CD, Docker for containerization, and environment-based configs.",
  },
  {
    id: "tech-git",
    keywords: ["git", "github", "version control"],
    reply:
      "**Git/GitHub** daily — feature branching, pull requests, code reviews, conventional commits, and rebasing. GitHub Actions for CI. Profile: github.com/attaorrahman",
  },

  // ---------- projects ----------
  {
    id: "projects-list",
    keywords: [
      "project",
      "projects",
      "portfolio",
      "your work",
      "what have you built",
      "show me",
      "showcase",
      "case study",
      "case studies",
      "examples",
      "samples",
    ],
    weight: 2,
    reply: () =>
      `Here are highlighted projects:\n\n${formatProjectsList(5)}\n\nFull catalog with live links: visit the **/projects** page.`,
  },
  {
    id: "project-specific",
    keywords: [
      "ahmasoft",
      "ahmad shayan",
      "tubevibe",
      "youtube",
      "fit club",
      "fitness",
      "social media",
      "visa",
      "admin dashboard",
    ],
    weight: 4,
    reply: () => "__project_specific__",
  },
  {
    id: "project-count",
    keywords: ["how many projects", "number of projects", "total projects"],
    reply: () =>
      `Atta has shipped **${heroStats[1].value}** projects — dashboards, marketplaces, e-commerce, real-time apps, and admin panels. The 8 highlighted ones are on the portfolio.`,
  },
  {
    id: "github",
    keywords: ["github", "git hub", "open source", "code", "repository", "repo"],
    reply:
      "GitHub: **github.com/attaorrahman** — public repos for portfolio, FitClub, TubeVibe, Social Media Frontend, Admin Dashboard and more.",
  },

  // ---------- experience / career ----------
  {
    id: "experience",
    keywords: [
      "experience",
      "work history",
      "where have you worked",
      "previous job",
      "previous jobs",
      "career",
      "companies",
      "company",
      "employment",
    ],
    reply: () => `**Work experience:**\n\n${formatExperience()}`,
  },
  {
    id: "years",
    keywords: ["how many years", "years of experience", "how long have you", "experience years", "since when"],
    reply: () =>
      `**${heroStats[2].value} years** of professional full-stack experience, plus prior personal-project work building React apps before going pro.`,
  },
  {
    id: "current-job",
    keywords: ["current job", "current role", "currently working", "where do you work now", "where are you working"],
    reply: () =>
      `Currently: **${experience[0].role}** at **${experience[0].company}** (${experience[0].period}).`,
  },

  // ---------- services / hire / availability ----------
  {
    id: "services",
    keywords: ["service", "services", "what do you offer", "what can you build", "what do you do for clients"],
    reply: () =>
      `Services Atta offers:\n\n${services
        .map((s) => `• **${s.title}** — ${s.description}`)
        .join("\n\n")}`,
  },
  {
    id: "hire",
    keywords: [
      "hire",
      "hiring",
      "available",
      "availability",
      "open to work",
      "looking for",
      "need a developer",
      "freelance",
      "contract",
      "full time",
      "fulltime",
      "part time",
      "remote",
      "onsite",
      "work with you",
    ],
    weight: 2,
    reply: () =>
      `Yes — Atta is **available for new projects** (full-time, contract, or freelance, fully remote).\n\n📧 ${contactEmail}\n💬 WhatsApp ${formatPhone(
        whatsappNumber
      )}\n💼 linkedin.com/in/attaurahman`,
  },
  {
    id: "rates",
    keywords: ["rate", "rates", "price", "pricing", "cost", "charge", "how much", "fee", "fees", "budget", "quote", "estimate"],
    reply: () =>
      `Rates depend on **scope, duration, and complexity**. For a quick estimate, send a brief to **${contactEmail}** — Atta replies within 24 hours with a tailored quote and timeline.`,
  },
  {
    id: "schedule-meeting",
    keywords: ["schedule", "meeting", "call", "book a call", "book meeting", "consultation", "zoom", "google meet"],
    reply:
      "Click the **calendar icon** in the bottom-right corner to schedule a meeting — Atta will confirm by email within a few hours.",
  },

  // ---------- contact ----------
  {
    id: "contact",
    keywords: ["contact", "reach you", "get in touch", "talk", "message you", "dm"],
    weight: 2,
    reply: () =>
      `**Best ways to reach Atta:**\n\n• 📧 **${contactEmail}**\n• 💬 WhatsApp: ${formatPhone(
        whatsappNumber
      )}\n• 💼 LinkedIn: linkedin.com/in/attaurahman\n• 🐙 GitHub: github.com/attaorrahman\n\nOr use the **contact form** at the bottom of the page.`,
  },
  {
    id: "email",
    keywords: ["email", "e-mail", "mail address", "gmail"],
    reply: () => `Email Atta directly at **${contactEmail}**.`,
  },
  {
    id: "phone",
    keywords: ["phone", "call you", "phone number", "mobile number"],
    reply: () =>
      `WhatsApp / phone: **${formatPhone(whatsappNumber)}**. WhatsApp is fastest.`,
  },
  {
    id: "linkedin",
    keywords: ["linkedin", "linked in"],
    reply: "LinkedIn: **linkedin.com/in/attaurahman** — drop a connection request with a short note.",
  },
  {
    id: "social",
    keywords: ["social", "socials", "social media", "instagram", "facebook", "twitter"],
    reply:
      "Atta is most active on **GitHub** (github.com/attaorrahman) and **LinkedIn** (linkedin.com/in/attaurahman). Email is the best way to reach him for work.",
  },

  // ---------- location / personal ----------
  {
    id: "location",
    keywords: ["where", "location", "based", "country", "city", "from", "live", "live in", "located"],
    reply:
      "Atta is based in **Lahore, Pakistan** 🇵🇰 — and works **fully remote** with clients worldwide.",
  },
  {
    id: "timezone",
    keywords: ["timezone", "time zone", "what time", "working hours"],
    reply:
      "Atta is in **PKT (UTC+5)** — overlaps comfortably with EU mornings, US evenings, and full APAC business hours. Flexible on schedule.",
  },
  {
    id: "languages",
    keywords: ["language", "languages", "english", "urdu", "speak"],
    reply: "Atta speaks **English** and **Urdu** fluently — comfortable with English-only client communication.",
  },

  // ---------- credentials ----------
  {
    id: "education",
    keywords: ["education", "degree", "university", "college", "study", "studied", "school", "qualification"],
    reply: () =>
      `**BS in Computer Science** — The Islamia University of Bahawalpur.\n\n**Certifications:**\n${certifications
        .map((c) => `• ${c.name} (${c.issuer})`)
        .join("\n")}`,
  },
  {
    id: "certs",
    keywords: ["certif", "credential", "course", "courses", "training", "bootcamp"],
    reply: () =>
      `**Certifications:**\n${certifications
        .map((c) => `• **${c.name}** — ${c.issuer}`)
        .join("\n")}`,
  },
  {
    id: "resume",
    keywords: ["resume", "cv", "download", "pdf"],
    reply: () =>
      `Download Atta's CV here: [Download CV](${resumeUrl}) — or click the **Download CV** button at the top of the page.`,
  },

  // ---------- meta ----------
  {
    id: "site-tech",
    keywords: ["this site", "this website", "this portfolio", "built this", "this page", "made this"],
    reply:
      "This portfolio is built with **Next.js 14, TypeScript, Tailwind CSS, and Framer Motion**, deployed as a static export. The chatbot you're talking to is also custom-built.",
  },
  {
    id: "yourself",
    keywords: ["who built you", "who made you", "are you chatgpt", "are you claude", "what model"],
    reply:
      "I'm a custom assistant Atta built for this portfolio — pattern-matching trained on his data, no external API calls. Lightweight, instant, and private.",
  },
];

// ----- scoring -----

function scoreIntent(intent: Intent, q: string): number {
  let score = 0;

  if (intent.regex) {
    if (intent.regex.test(q)) score += 8;
  }

  for (const kw of intent.keywords) {
    if (!kw) continue;
    if (q.includes(kw.toLowerCase())) {
      // multi-word keywords are stronger signals
      score += kw.includes(" ") ? 4 : 2;
    }
  }

  if (score > 0 && intent.blockers) {
    for (const b of intent.blockers) {
      if (q.includes(b.toLowerCase())) return 0;
    }
  }

  if (score > 0 && intent.weight) score += intent.weight;
  return score;
}

function projectSpecificReply(q: string): string | null {
  const p = findProject(q);
  if (!p) return null;
  const techList = p.tech.join(", ");
  const liveLink = p.links.live ? `\n🔗 Live: ${p.links.live}` : "";
  const repoLink = p.links.repo ? `\n💻 Code: ${p.links.repo}` : "";
  return `**${p.title}**\n${p.tagline}\n\n**Stack:** ${techList}${liveLink}${repoLink}`;
}

function fallback(q: string): string {
  const topics = [
    "stack & technologies",
    "projects",
    "experience",
    "rates & availability",
    "contact info",
    "education",
  ];
  return `I'm not sure I caught that — could you rephrase? You can also ask about:\n\n${topics
    .map((t) => `• ${t}`)
    .join("\n")}\n\nOr email Atta directly at **${contactEmail}**.`;
}

export function getBotReply(input: string): string {
  const q = input.trim().toLowerCase();
  if (!q) return "Could you type your question? I'm listening. 🙂";

  // Find the highest-scoring intent
  let best: { intent: Intent; score: number } | null = null;
  for (const intent of intents) {
    const score = scoreIntent(intent, q);
    if (score > 0 && (!best || score > best.score)) {
      best = { intent, score };
    }
  }

  if (!best) return fallback(q);

  // Special handler for project-specific
  if (best.intent.id === "project-specific") {
    const reply = projectSpecificReply(q);
    if (reply) return reply;
    return `Here are the projects:\n\n${formatProjectsList(8)}`;
  }

  const r = best.intent.reply;
  return typeof r === "function" ? r() : r;
}
