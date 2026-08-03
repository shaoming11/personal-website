// ── Types ──

export type BioSegment = { text: string } | { link: string; href: string; icon?: string }

export type WorkCategory = "project" | "experience" | "community"

export type WorkItem = {
  id: string
  title: string
  category: WorkCategory
  label: string
  date: string
  image: string
  stack?: string
  description: string
  filter: "Projects" | "Communities" | "Experience"
  github?: string
  demo?: string
  expand?: string
}

// ── Bio ──

export const bioItems: BioSegment[][] = [
  [
    { text: "incoming mechatronics engineering @ " },
    { link: "UWaterloo", href: "https://uwaterloo.ca", icon: "/icons/icon_uw.png" },
  ],
  [
    { text: "doing research on " },
    { link: "world models", href: "#" },
  ],
  [
    { text: "building a self-driving car @ " },
    { link: "WATonomous", href: "https://watonomous.ca", icon: "/icons/icon_wato.jpeg" },
  ],
  [
    { text: "open-source CV @ " },
    { link: "Roboflow", href: "https://roboflow.com", icon: "/icons/icon_rb.webp" },
  ],
  [
    { text: "building a " },
    { link: "dexterous hand", href: "https://github.com/shaoming11/rb-proj" },
  ],
  [
    { text: "organizing toronto's largest " },
    { link: "summer hackathon", href: "https://hackthe6ix.com", icon: "/icons/icon_ht6.jpeg" },
    { text: " (400+ participants)" },
  ],
  [
    { text: "previously organized " },
    { link: "Hack Canada", href: "https://hackcanada.org", icon: "/icons/icon_hc.png" },
    { text: " (700+ participants)" },
  ],
]

// ── Socials ──

export const socials = [
  { label: "linkedin", href: "https://linkedin.com/in/shaoming-wu" },
  { label: "twitter", href: "https://x.com/shaomng" },
  { label: "github", href: "https://github.com/shaoming11" },
]

// ── Nav ──

export const navItems = [
  { id: "about", label: "about" },
  { id: "projects", label: "projects" },
  { id: "writing", label: "writing" },
]

// ── Blog Posts ──

export const blogPosts = [
  { title: "coming soon", date: "N/A" },
]

// ── Projects ──

export const work: WorkItem[] = [
  {
    id: "swing",
    title: "Swing",
    category: "project",
    label: "project",
    date: "2026",
    image: "/projects/swing.png",
    description:
      "Self-improving agent trained on the stock market",
    filter: "Projects",
    github: "https://github.com/shaoming11/swing-trader",
    expand: "/swing",
  },
  {
    id: "hand-cv",
    title: "Hand CV",
    category: "project",
    label: "project",
    date: "2026",
    image: "/projects/hand.png",
    description:
      "CV model trained on hand gestures for humanoids",
    filter: "Projects",
    github: "https://github.com/shaoming11/rb-proj",
  },
  {
    id: "dm5",
    title: "DM5",
    category: "project",
    label: "project",
    date: "2026",
    image: "/projects/dm6.png",
    description:
      "Agentic orchestration pipeline for product managers",
    filter: "Projects",
    github: "https://github.com/PhongCT1105/YC_Hack",
    demo: "https://research-sprint-phong-caos-projects.vercel.app/dashboard/sp_450d26db474d?key=bee5be1b841fb8fac5a1394e05c92938",
  },
  {
    id: "pral",
    title: "PRAL",
    category: "project",
    label: "project",
    date: "2026",
    image: "/projects/pral.png",
    description:
      "Autonomous drone flight planner for cinematography",
    filter: "Projects",
    github: "https://github.com/101011101/PRAL-Drone-Systems",
    demo: "https://devpost.com/software/pral",
  },
  {
    id: "fraudgen",
    title: "FraudGen",
    category: "project",
    label: "project",
    date: "2026",
    image: "/projects/fraudgen.png",
    stack: "ts",
    description:
      "Synthetic data generation for machine learning in finance",
    filter: "Projects",
    github: "https://github.com/101011101/GenAi",
    demo: "https://devpost.com/software/fraudsense-3gltkw",
  },
  {
    id: "millikepedia",
    title: "millikepedia",
    category: "project",
    label: "project",
    date: "2026",
    image: "/projects/millikeepedia.png",
    description:
      "Knowledge graph built for multidisciplinary learners",
    filter: "Projects",
    github: "https://github.com/shaoming11/millikepedia",
  },
  {
    id: "outreach",
    title: "Outreach",
    category: "project",
    label: "project",
    date: "2026",
    image: "/projects/hc-outreach.png",
    description:
      "Agentic outreach pipeline + CRM for securing sponsorships",
    filter: "Projects",
    github: "https://github.com/shaoming11/hc-outreach",
  },
  {
    id: "vex-robotics",
    title: "VEX Robotics",
    category: "experience",
    label: "co-founder",
    date: "2025",
    image: "/projects/VEX.png",
    description:
      "Robots built on the VEX V5 ecosystem for competitive robotics",
    filter: "Experience",
    github: "https://github.com/shaoming11/shao-lib",
    demo: "https://www.instagram.com/alturafoundation/",
  },
]

// ── Cool Things ──

export const coolThings: { text: string; highlight?: string; color?: string }[] = [
  {
    text: "architected an autonomous drone cinematography pipeline with ",
    highlight: "5 stages",
    color: "bg-[#00ffff]/30 dark:bg-[#00ffff]/25",
  },
  {
    text: "won ",
    highlight: "first place @ JAMHacks 10",
    color: "bg-[#39ff14]/30 dark:bg-[#39ff14]/25",
  },
  {
    text: "organized a hackathon for ",
    highlight: "700+ participants",
    color: "bg-[#ffff00]/30 dark:bg-[#ffff00]/25",
  },
  {
    text: "qualified 4 times to ",
    highlight: "VEX Worlds",
    color: "bg-[#ff6ec7]/30 dark:bg-[#ff6ec7]/25",
  },
  {
    text: "introduced engineering principles to ",
    highlight: "10,000+ students",
    color: "bg-[#bf00ff]/30 dark:bg-[#bf00ff]/25",
  },
]

// ── Awards ──

export const awards = [
  { title: "JAMHacks 10 — First Place", date: "Jun 2026" },
  { title: "BitGo — Second Place", date: "Mar 2026" },
  { title: "JAMHacks 9 — Best Use of Generative AI", date: "May 2025" },
  { title: "Riverbots Champion + VEX Worlds Qualifier", date: "Dec 2024" },
  { title: "VEX Robotics Regional Champion (2x)", date: "2024 — 2025" },
]
