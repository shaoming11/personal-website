// ── Nav ──

export type NavItem = { id: string; label: string; href: string }

export const navItems: NavItem[] = [
  { id: "experience", label: "experience", href: "/experience" },
  { id: "projects", label: "projects", href: "/projects" },
]

// ── Socials ──

export const socials = [
  { label: "linkedin", href: "https://linkedin.com/in/shaoming-wu" },
  { label: "twitter", href: "https://x.com/shaomng" },
  { label: "github", href: "https://github.com/shaoming11" },
]

export const email = "s474wu@uwaterloo.ca"

export const resumeHref = "/Shaoming%20Wu%20Resume.pdf"

// ── Landing ──

export type FeaturedProject = {
  id: string
  title: string
  description: string
  image?: string
  code?: string
  demo?: string
}

export const featuredProjects: FeaturedProject[] = [
  {
    id: "the-brackey-way",
    title: "The Brackey Way",
    description: "Fine-tuned pi0.5 on a Bracketbot",
    image: "/projects/brackey-way.jpg",
    code: "https://github.com/shaoming11/thebracketway",
    demo: "https://devpost.com/software/the-brackey-way",
  },
  {
    id: "hand-sim",
    title: "Water bottle opener",
    description: "Parallel trained in MJX & MuJoCo",
    image: "/projects/hand-sim.gif",
    code: "https://github.com/shaoming11/hand-sim",
  },
  {
    id: "autochem",
    title: "AutoCHEM",
    description: "Automated wet lab with a digital twin in MuJoCo",
    image: "/projects/autochem.jpg",
    code: "https://github.com/shaoming11/hh-winners",
    demo: "https://devpost.com/software/autochem",
  },
]

// ── Experience ──

export type ExperienceCategory = "work" | "community"

export type ExperienceItem = {
  id: string
  role: string
  company: string
  description: string
  category: ExperienceCategory
  image?: string
  github?: string
  demo?: string
}

export const experience: ExperienceItem[] = [
  {
    id: "magic-hour",
    role: "software engineer",
    company: "Magic Hour",
    description: "YC W24 AI video platform",
    category: "work",
    image: "/experience/magic-hour.jpg",
  },
  {
    id: "watonomous",
    role: "simulation developer",
    company: "WATonomous",
    description: "Self-driving car team, working in CARLA",
    category: "work",
    image: "/experience/watonomous.jpg",
  },
  {
    id: "hack-the-6ix",
    role: "engineering director",
    company: "Hack the 6ix",
    description: "Toronto's largest summer hackathon",
    category: "community",
    image: "/experience/hack-the-6ix.jpg",
  },
  {
    id: "roboflow",
    role: "open-source",
    company: "Roboflow",
    description: "Contributions to computer vision tooling",
    category: "work",
    image: "/experience/roboflow.jpg",
  },
  {
    id: "hack-canada",
    role: "organizer",
    company: "Hack Canada",
    description: "Outreach executive for the student hackathon",
    category: "community",
    image: "/experience/hack-canada.jpg",
  },
  {
    id: "altura-robotics",
    role: "co-founder",
    company: "Altura Robotics",
    description: "VEX nonprofit running tournaments and workshops",
    category: "community",
    image: "/experience/altura-robotics.jpg",
    github: "https://github.com/shaoming11/shao-lib",
    demo: "https://www.instagram.com/alturafoundation/",
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

// ── Education ──

export const education = [
  {
    school: "University of Waterloo",
    program: "BASc., Mechatronics Engineering (Incoming)",
    date: "Sep 2026 — 2031",
  },
  {
    school: "Milliken Mills High School",
    program: "IB Programme",
    date: "Sep 2022 — Jun 2026",
  },
]

// ── Projects ──

export type ProjectItem = {
  id: string
  title: string
  description: string
  image?: string
  github?: string
  demo?: string
  expand?: string
}

export const projects: ProjectItem[] = [
  {
    id: "swing",
    title: "Swing",
    description: "Self-improving agent trained on the stock market",
    image: "/projects/swing.png",
    github: "https://github.com/shaoming11/swing-trader",
    expand: "/swing",
  },
  {
    id: "the-brackey-way",
    title: "the brackey way",
    description: "Sandwich-making VLA, built at the Battle of the Schools hackathon",
    image: "/projects/brackey-way.jpg",
    github: "https://github.com/shaoming11/thebracketway",
    demo: "https://devpost.com/software/the-brackey-way",
  },
  {
    id: "hand-sim",
    title: "hand sim",
    description: "Shadow Hand unscrewing a bottle cap, parallel trained in MJX & MuJoCo",
    image: "/projects/hand-sim.gif",
    github: "https://github.com/shaoming11/hand-sim",
  },
  {
    id: "autochem",
    title: "AutoCHEM",
    description: "Low-cost automated wet lab with a digital twin in MuJoCo",
    image: "/projects/autochem.jpg",
    github: "https://github.com/shaoming11/hh-winners",
    demo: "https://devpost.com/software/autochem",
  },
  {
    id: "the-matrix",
    title: "the matrix",
    description: "Three ESP32 camera cars that navigate a maze as a swarm",
    image: "/projects/the-matrix.gif",
    github: "https://github.com/VedantSheel08/thematrix",
    demo: "https://devpost.com/software/the-matrix-ws2yiq",
  },
  {
    id: "mazenav",
    title: "Maze Navigator",
    description: "Maze navigation robot built on ROS2 and Gazebo",
    image: "/projects/mazenav.png",
    github: "https://github.com/shaoming11/mazenav",
  },
  {
    id: "pral",
    title: "PRAL Drone Systems",
    description: "Autonomous drone cinematography pipeline. 1st at JAMHacks 10",
    image: "/projects/pral.png",
    github: "https://github.com/101011101/PRAL-Drone-Systems",
    demo: "https://devpost.com/software/pral",
  },
  {
    id: "dm5",
    title: "DM5",
    description: "Agentic orchestration pipeline for product managers",
    image: "/projects/dm6.png",
    github: "https://github.com/PhongCT1105/YC_Hack",
    demo: "https://research-sprint-phong-caos-projects.vercel.app/dashboard/sp_450d26db474d?key=bee5be1b841fb8fac5a1394e05c92938",
  },
]
