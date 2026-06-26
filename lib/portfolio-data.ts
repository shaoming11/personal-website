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
    id: "pral-drone",
    title: "PRAL Drone Systems",
    category: "project",
    label: "project",
    date: "Jun 2026",
    image: "/projects/pral-drone.png",
    stack: "Python, Next.js, React, TypeScript, three.js",
    description:
      "an autonomous drone cinematography pipeline spanning 5 sequential stages over 40+ python modules — target confirmation, 3D reconstruction, and shot generation through a fully mocked hardware layer for 100% hardware-free testing.",
    filter: "Projects",
  },
  {
    id: "fraudgen",
    title: "FraudGen",
    category: "project",
    label: "project",
    date: "Mar 2026",
    image: "/projects/fraudgen.png",
    stack: "Python, Anthropic API, Streamlit, FastAPI, Next.js",
    description:
      "a multi-agent adversarial simulation pipeline that synthesizes structurally diverse fraud transaction networks, closing a 20–100x labeled-data gap for GNN-based fraud detection. won 2nd place at BitGo.",
    filter: "Projects",
  },
  {
    id: "hc-outreach",
    title: "hc-outreach",
    category: "project",
    label: "project",
    date: "Jun 2026",
    image: "/projects/hc-outreach.png",
    stack: "Python, Anthropic API, Gmail API, Apollo API",
    description:
      "a multi-agent LLM system automating sponsor outreach for a 700+ attendee hackathon across a generate → research → draft → send pipeline, eliminating ~90% of manual prospecting work.",
    filter: "Projects",
  },
  {
    id: "millikepedia",
    title: "millikepedia",
    category: "project",
    label: "project",
    date: "Apr 2026",
    image: "/projects/millikepedia.png",
    stack: "Next.js, Supabase, React Flow, WebSockets",
    description:
      "a full-stack knowledge platform for student clubs with real-time collaborative drawing, a 5-layer mind map connecting 100+ concepts, and a 4-tier access system with git-style edit history.",
    filter: "Projects",
  },
  {
    id: "altura-robotics",
    title: "Altura Robotics",
    category: "experience",
    label: "co-founder",
    date: "2024 — 2026",
    image: "/projects/altura-robotics.png",
    stack: "C++, Fusion 360, PID, Computer Vision",
    description:
      "co-founded and led a team of 12. built C++ control software fusing inertial, vision and optical sensors with PID loops, improving autonomous accuracy by 40%. 2x tournament champion + VEX Worlds qualifier.",
    filter: "Experience",
  },
  {
    id: "supplyme",
    title: "SupplyMe",
    category: "project",
    label: "project",
    date: "May 2025",
    image: "/projects/supplyme.png",
    stack: "Django REST, Flutter, MongoDB Atlas",
    description:
      "a django REST API leveraging MongoDB Atlas semantic search and Gemini AI for inventory queries with 90% accuracy, paired with a cross-platform flutter mobile frontend.",
    filter: "Projects",
  },
]

export const coolThings: { text: string; highlight?: string; color?: string }[] = [
  {
    text: "architected an autonomous drone cinematography pipeline across ",
    highlight: "40+ python modules",
    color: "bg-blue-100 dark:bg-blue-500/20",
  },
  {
    text: "won ",
    highlight: "first place @ JAMHacks 10",
    color: "bg-green-100 dark:bg-green-500/20",
  },
  {
    text: "co-founded ",
    highlight: "Altura Robotics",
    color: "bg-amber-100 dark:bg-amber-500/20",
  },
  {
    text: "led my team to ",
    highlight: "VEX Worlds",
    color: "bg-rose-100 dark:bg-rose-500/20",
  },
  {
    text: "introduced ",
    highlight: "10,000+ students",
    color: "bg-indigo-100 dark:bg-indigo-500/20",
  },
  {
    text: "research assistant at ",
    highlight: "UofT",
    color: "bg-violet-100 dark:bg-violet-500/20",
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
