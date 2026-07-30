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
}

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
  },
  {
    id: "fraudgen",
    title: "FraudGen",
    category: "project",
    label: "project",
    date: "2026",
    image: "/projects/fraudgen.png",
    description:
      "Synthetic data generation for machine learning in finance",
    filter: "Projects",
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
  },
]

export const coolThings: { text: string; highlight?: string; color?: string }[] = [
  {
    text: "architected an autonomous drone cinematography pipeline with ",
    highlight: "5 stages",
    color: "bg-blue-100 dark:bg-blue-500/20",
  },
  {
    text: "won ",
    highlight: "first place @ JAMHacks 10",
    color: "bg-green-100 dark:bg-green-500/20",
  },
  {
    text: "organized a hackathon for ",
    highlight: "700+ participants",
    color: "bg-amber-100 dark:bg-amber-500/20",
  },
  {
    text: "qualified 4 times to ",
    highlight: "VEX Worlds",
    color: "bg-rose-100 dark:bg-rose-500/20",
  },
  {
    text: "introduced engineering principles to ",
    highlight: "10,000+ students",
    color: "bg-indigo-100 dark:bg-indigo-500/20",
  },
]

export const awards = [
  { title: "JAMHacks 10 — First Place", date: "Jun 2026" },
  { title: "BitGo — Second Place", date: "Mar 2026" },
  { title: "JAMHacks 9 — Best Use of Generative AI", date: "May 2025" },
  { title: "Riverbots Champion + VEX Worlds Qualifier", date: "Dec 2024" },
  { title: "VEX Robotics Regional Champion (2x)", date: "2024 — 2025" },
]

export const navItems = [
  { id: "about", label: "about" },
  { id: "experience", label: "experience" },
  { id: "community", label: "community" },
  { id: "awards", label: "awards" },
  { id: "education", label: "education" },
]
