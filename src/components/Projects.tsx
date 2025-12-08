"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Github, Globe, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "helpidontknowhowtonetworkin.tech",
    description: "A comprehensive networking platform designed to help developers and tech professionals build meaningful connections. Features include skill matching, event discovery, and mentorship programs.",
    image: "/help.png",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "NextAuth.js"],
    features: [
      "User matching algorithm",
      "Real-time messaging",
      "Event management system",
      "Mentorship matching"
    ],
    liveUrl: "https://helpidontknowhowtonetworkin.tech",
    githubUrl: "https://github.com/naman-sonawane/helpidontknowhowtonetworkintech",
    featured: true
  },
  {
    title: "SupplyMe",
    description: "An innovative supply chain management platform that streamlines inventory tracking, supplier management, and order processing for small to medium businesses.",
    image: "/supply.png",
    tech: ["React", "Node.js", "Express", "MongoDB"],
    features: [
      "Real-time inventory tracking",
      "Automated reorder alerts",
      "Supplier performance analytics",
      "Multi-location support"
    ],
    liveUrl: "#",
    githubUrl: "https://github.com/shaoming11/supplyme-server",
    featured: true
  }
];

const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="projects" className="py-20 bg-muted/30">
      <div className="container mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Featured Projects
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Innovative solutions built with modern technologies and best practices
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto space-y-12">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.3 }}
              className={`flex flex-col ${
                index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"
              } gap-8 items-center`}
            >
              {/* Project Image */}
              <div className="lg:w-1/2">
                <motion.div
                  className="relative rounded-2xl overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {project.image && project.image !== "@" ? (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="aspect-video w-full object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-blue-900 to-purple-900 rounded-2xl flex items-center justify-center">
                      <Globe size={64} className="text-blue-400 opacity-50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex gap-4">
                      {project.liveUrl !== "#" && (
                        <motion.a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <ExternalLink size={20} />
                        </motion.a>
                      )}
                      {project.githubUrl !== "#" && (
                        <motion.a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Github size={20} />
                        </motion.a>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Project Content */}
              <div className="lg:w-1/2 space-y-6">
                <div>
                  <motion.h3
                    className="text-2xl lg:text-3xl font-bold text-white mb-4"
                    initial={{ opacity: 0, x: index % 2 === 1 ? 50 : -50 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.3 + 0.2 }}
                  >
                    {project.title}
                  </motion.h3>
                  
                  <motion.p
                    className="text-gray-300 text-lg leading-relaxed mb-6"
                    initial={{ opacity: 0, x: index % 2 === 1 ? 50 : -50 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.3 + 0.3 }}
                  >
                    {project.description}
                  </motion.p>
                </div>

                {/* Features */}
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 1 ? 50 : -50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.3 + 0.4 }}
                >
                  <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Users size={18} className="text-blue-400" />
                    Key Features
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {project.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-gray-300 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Tech Stack */}
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 1 ? 50 : -50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.3 + 0.5 }}
                >
                  <h4 className="text-white font-semibold mb-3">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm border border-blue-500/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>

                {/* Links */}
                <motion.div
                  className="flex gap-4 pt-4"
                  initial={{ opacity: 0, x: index % 2 === 1 ? 50 : -50 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.3 + 0.6 }}
                >
                  {project.liveUrl !== "#" && (
                    <motion.a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-colors inline-flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ExternalLink size={18} />
                      Live Demo
                    </motion.a>
                  )}
                  {project.githubUrl !== "#" && (
                    <motion.a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-gray-600 hover:border-blue-400 text-gray-300 hover:text-blue-400 px-6 py-3 rounded-full font-medium transition-colors inline-flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Github size={18} />
                      Source Code
                    </motion.a>
                  )}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;