export const profile = {
  name: "Shaoming Wu",
  title: "Engineer & Builder",
  tagline: "I build software and hardware at the intersection of AI, robotics, and the web.",
  location: "Markham, ON",
  email: "shaoming.wu@outlook.com",
  phone: "647-327-1398",
  socials: {
    github: "https://github.com/shaoming11",
    linkedin: "https://linkedin.com/in/shaoming-wu",
  },
}

export const about = [
  "I'm a builder who likes shipping things that span the full stack — from autonomous drone cinematography pipelines and multi-agent AI systems to competition robots and real-time collaborative web apps.",
  "Currently finishing the IB Programme at Milliken Mills High School and heading to the University of Waterloo for Mechatronics Engineering. Along the way I've co-founded a VEX Robotics team, qualified for the VEX World Championship, and won a handful of hackathons.",
  "Most of my favorite work lives where messy hardware meets clean software: sensor fusion, 3D reconstruction, concurrent API orchestration, and the systems that hold it all together.",
]

export type Project = {
  name: string
  date: string
  stack: string[]
  highlights: string[]
  link?: string
}

export const projects: Project[] = [
  {
    name: "PRAL Drone Systems",
    date: "Jun 2026",
    stack: ["Python", "Next.js", "React", "TypeScript", "three.js"],
    highlights: [
      "Architected an autonomous drone cinematography pipeline spanning 5 sequential stages (select, survey, map, analyze, shoot) over 40+ Python modules, driving target confirmation, 3D reconstruction, and shot generation through a fully mocked hardware abstraction layer enabling 100% hardware-free end-to-end test execution.",
      "Engineered a next-best-view 3D mapping system fusing rangefinder and depth sensor data to estimate structure height and obstacle geometry, voxelizing surface coverage and triggering adaptive close-up passes until reconstruction quality crossed a 90% coverage threshold.",
      "Built a vision-attention-driven shot planner that ray-casts every posed camera frame onto the reconstructed 3D mesh to accumulate a per-vertex interest field, scoring hundreds of candidate viewpoints to greedily select 10 waypoints under shot-type quotas, sequenced via a TSP solver and fit to a collision-checked spline trajectory.",
    ],
  },
  {
    name: "FraudGen",
    date: "Mar 2026",
    stack: ["Python", "Anthropic API", "Streamlit", "FastAPI", "Next.js", "NetworkX"],
    highlights: [
      "Architected a multi-agent adversarial simulation pipeline — Orchestrator, Persona Generator, and parallel Fraud Constructor agents coordinated via asyncio — to synthesize structurally diverse fraud transaction networks, closing a 20–100x labeled-data gap for GNN-based fraud detection models.",
      "Built a deterministic graph labeling and validation layer (BFS traversal, 8-rule constraint repair, schema validation) processing 4,000+ transactions per run with zero unlabeled or malformed nodes reaching the dataset.",
      "Designed a live coverage-matrix visualization system (Streamlit + NetworkX) rendering real-time variant-space saturation across 5 parallel agent workers, lifting coverage saturation from 60% to 80%+.",
    ],
  },
  {
    name: "hc-outreach",
    date: "Jun 2026",
    stack: ["Python", "Anthropic API", "Gmail API", "Google Sheets API", "Apollo REST API"],
    highlights: [
      "Architected a multi-agent LLM automation system to fully automate sponsor outreach for a 700+ attendee hackathon across a generate-leads → research → draft → send pipeline, eliminating ~90% of manual prospecting and drafting work.",
      "Engineered a concurrent API orchestration layer with ThreadPoolExecutor (10 parallel workers), a custom token-bucket rate limiter enforcing 30,000 TPM across threads, and an APScheduler-backed send queue on Railway — achieving multi-fold speedup with zero quota violations.",
      "Built a 5-page Streamlit ops dashboard with live Gmail inbox browsing, real-time parallel-research tracking, automated reply classification, and contact queueing — enabling end-to-end pipeline QA without additional tooling.",
    ],
  },
  {
    name: "millikepedia",
    date: "Apr 2026",
    stack: ["Next.js", "Supabase", "React Flow", "WebSockets"],
    highlights: [
      "Built a full-stack knowledge platform for student clubs using Next.js and Supabase, with real-time collaborative drawing and note-taking over WebSockets.",
      "Designed a 5-layer mind map using React Flow and ELK radial layout, connecting 100+ concepts with direct page links to surface relationships between club content.",
      "Implemented a 4-tier access system (Admin → Member) with Git-style edit history, making all changes traceable and reversible without manual backups.",
    ],
  },
  {
    name: "helpidontknowhowtonetworkin.tech",
    date: "May 2025",
    stack: ["TypeScript", "Node.js", "Express.js", "MongoDB"],
    highlights: [
      "Built a full-stack face recognition web app achieving 95% accuracy, enabling real-time identification without relying on third-party APIs.",
      "Designed a RESTful API with documented endpoints and an automated test suite covering core recognition and auth flows.",
      "Recipient of Best Use of Generative AI at JAMHacks 9.",
    ],
  },
  {
    name: "SupplyMe",
    date: "May 2025",
    stack: ["Django REST API", "Flutter", "MongoDB Atlas"],
    highlights: [
      "Built a Django REST API leveraging MongoDB Atlas semantic search and Gemini AI to power inventory queries with 90% search accuracy.",
      "Developed a cross-platform mobile frontend in Flutter, delivering a documented, maintainable codebase that reduced deployment time by 60%.",
    ],
  },
]

export type Role = {
  role: string
  org: string
  location: string
  date: string
  highlights: string[]
  tags: string[]
}

export const experience: Role[] = [
  {
    role: "Co-Founder & Technical Lead",
    org: "Altura Robotics (VEX Robotics Team 1165A)",
    location: "Markham, ON",
    date: "May 2024 — May 2026",
    highlights: [
      "Recruited and led a team of 12 members, secured sponsorships to fund development and travel, and mentored teammates in programming, mechanical design, and competition strategy.",
      "Developed C++ control software integrating inertial, vision, and optical sensors with PID loops, improving autonomous accuracy by 40% and driver control responsiveness.",
      "Designed robots in Fusion 360, coordinating mechanical and electrical integration through iterative build-and-test cycles.",
      "Led the team to 2x Tournament Champion victories, earned the Judges Award, and secured early qualification for the VEX Robotics World Championships.",
    ],
    tags: ["C++", "PID Control", "Sensor Fusion", "Fusion 360"],
  },
  {
    role: "Research Assistant",
    org: "University of Toronto",
    location: "Markham, ON",
    date: "Mar 2025",
    highlights: [
      "Collaborated with PhD students to implement smooth-particle-hydrodynamics simulations in Python on Google Colab and Jupyter Notebook.",
      "Optimized simulation of 100+ particles, achieving a 3x increase in processing speed through algorithmic improvements.",
    ],
    tags: ["Python", "Simulation", "Jupyter"],
  },
]

export const community: Role[] = [
  {
    role: "Business Development Executive",
    org: "Hack the 6ix",
    location: "Toronto, ON",
    date: "Apr 2026 — Present",
    highlights: [
      "Secured 5+ sponsorship agreements with technology companies through targeted outreach campaigns.",
      "Managed a pipeline of 20+ prospective sponsors using structured follow-up sequences, improving response rates by 35% compared to prior cycles.",
      "Coordinated with logistics and marketing teams to deliver all committed sponsor benefit packages on time, achieving 100% fulfillment.",
    ],
    tags: ["Sponsorships", "Outreach"],
  },
  {
    role: "Outreach Officer",
    org: "Hack Canada",
    location: "Waterloo, ON",
    date: "Sep 2025 — Present",
    highlights: [
      "Identified and contacted 30+ technology companies to build a sponsorship pipeline for a 400-person hackathon, converting outreach into confirmed partnerships.",
      "Standardized sponsor communication templates and meeting cadences, cutting average response-to-confirmation time by 20%.",
      "Tracked sponsor deliverables against event milestones, ensuring on-time fulfillment across all active partnerships.",
    ],
    tags: ["Partnerships", "Operations"],
  },
  {
    role: "STEM Outreach Coordinator & MC",
    org: "Caution Tape Independent Program",
    location: "Markham, ON",
    date: "Jun 2024 — May 2025",
    highlights: [
      "Served as event emcee for robotics competitions, delivering commentary that sustained participant energy and fostered an inclusive atmosphere.",
      "Created and led hands-on STEM workshops for Grades 1–6, introducing 10,000+ students to Scratch coding, robotics, and engineering fundamentals.",
      "Organized a VEX IQ tournament for 40+ students, managing technical operations, match scheduling, and logistics end-to-end.",
    ],
    tags: ["STEM Education", "Events"],
  },
]

export const education = [
  {
    school: "University of Waterloo",
    program: "BASc., Mechatronics Engineering (Incoming)",
    date: "Sep 2026 — Jun 2031",
    location: "Waterloo, ON",
  },
  {
    school: "Milliken Mills High School",
    program: "IB Programme",
    date: "Sep 2022 — Jun 2026",
    location: "Markham, ON",
  },
]

export const awards = [
  { name: "JAMHacks 10 — First Place", date: "Jun 2026" },
  { name: "BitGo — Second Place", date: "Mar 2026" },
  { name: "JAMHacks 9 — Best Use of Generative AI", date: "May 2025" },
  { name: "Riverbots Signature Event Champion + VEX Worlds Qualifier", date: "Dec 2024" },
  { name: "VEX Robotics Regional Champion (2x)", date: "2024 — 2025" },
]

export const skills = {
  Languages: ["JavaScript", "TypeScript", "Python", "C/C++", "HTML/CSS"],
  "Frameworks & Libraries": ["React", "Next.js", "Express.js", "Node.js", "Django", "Flutter"],
  Databases: ["MongoDB", "MongoDB Atlas", "Supabase"],
  Tools: ["Git", "GitHub", "Google Colab", "Jupyter Notebook", "Fusion 360"],
}
