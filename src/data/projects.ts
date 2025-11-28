import { Project } from "@/types/project";

export const sampleProjects: Project[] = [
  {
    id: "1",
    title: "AI-Powered E-Commerce Platform",
    description: "A modern e-commerce platform with AI-powered product recommendations, real-time inventory management, and seamless checkout experience. Built with Next.js and featuring advanced search capabilities.",
    image: "/api/placeholder/400/300",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "OpenAI API"],
    liveUrl: "https://example-ecommerce.com",
    githubUrl: "https://github.com/username/ecommerce-platform",
    category: "Web Application"
  },
  {
    id: "2", 
    title: "Real-Time Chat Application",
    description: "A scalable real-time chat application with end-to-end encryption, file sharing, and video calling features. Supports thousands of concurrent users with robust message delivery.",
    image: "/api/placeholder/400/300",
    technologies: ["React", "Socket.io", "Node.js", "Redis", "MongoDB", "WebRTC"],
    liveUrl: "https://example-chat.com",
    githubUrl: "https://github.com/username/chat-app",
    category: "SaaS Platform"
  },
  {
    id: "3",
    title: "Robotic Process Automation Suite",
    description: "Enterprise-grade RPA solution for automating repetitive business processes. Features visual workflow designer, AI-powered decision making, and comprehensive audit trails.",
    image: "/api/placeholder/400/300", 
    technologies: ["Python", "TensorFlow", "FastAPI", "React", "Docker", "Kubernetes"],
    liveUrl: "https://example-rpa.com",
    githubUrl: "https://github.com/username/rpa-suite",
    category: "Enterprise Software"
  },
  {
    id: "4",
    title: "Smart Home IoT Dashboard",
    description: "Comprehensive IoT dashboard for managing smart home devices with real-time monitoring, automation rules, and energy usage analytics. Mobile-first responsive design.",
    image: "/api/placeholder/400/300",
    technologies: ["Vue.js", "MQTT", "InfluxDB", "Grafana", "Arduino", "Raspberry Pi"],
    githubUrl: "https://github.com/username/smart-home",
    category: "IoT Application"
  },
  {
    id: "5",
    title: "Machine Learning Model Deployment Platform", 
    description: "MLOps platform for deploying, monitoring, and scaling machine learning models in production. Features automated model versioning, A/B testing, and performance monitoring.",
    image: "/api/placeholder/400/300",
    technologies: ["Python", "MLflow", "Kubernetes", "FastAPI", "PostgreSQL", "Prometheus"],
    liveUrl: "https://example-mlops.com",
    githubUrl: "https://github.com/username/mlops-platform",
    category: "Machine Learning"
  }
];

export const getProjectById = (id: string): Project | undefined => {
  return sampleProjects.find(project => project.id === id);
};

export const getProjectsByCategory = (category: string): Project[] => {
  return sampleProjects.filter(project => project.category === category);
};

export const getFeaturedProjects = (limit: number = 3): Project[] => {
  return sampleProjects.slice(0, limit);
};