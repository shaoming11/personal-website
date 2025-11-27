"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Code, Database, Wrench, Globe } from "lucide-react";

const skillCategories = [
  {
    title: "Frontend Development",
    icon: <Globe className="w-6 h-6" />,
    skills: [
      { name: "JavaScript", level: 95 },
      { name: "TypeScript", level: 90 },
      { name: "React", level: 95 },
      { name: "Next.js", level: 90 },
      { name: "Tailwind CSS", level: 88 },
      { name: "HTML/CSS", level: 95 }
    ],
    color: "blue"
  },
  {
    title: "Backend Development",
    icon: <Database className="w-6 h-6" />,
    skills: [
      { name: "Node.js", level: 85 },
      { name: "Python", level: 90 },
      { name: "C++", level: 85 },
      { name: "PostgreSQL", level: 80 },
      { name: "MongoDB", level: 75 },
      { name: "Express.js", level: 82 }
    ],
    color: "green"
  },
  {
    title: "Robotics & Hardware",
    icon: <Wrench className="w-6 h-6" />,
    skills: [
      { name: "Arduino", level: 88 },
      { name: "Raspberry Pi", level: 85 },
      { name: "Circuit Design", level: 80 },
      { name: "Sensor Integration", level: 85 },
      { name: "Motor Control", level: 82 },
      { name: "CAD Design", level: 75 }
    ],
    color: "purple"
  },
  {
    title: "Tools & Technologies",
    icon: <Code className="w-6 h-6" />,
    skills: [
      { name: "Git", level: 90 },
      { name: "Docker", level: 75 },
      { name: "AWS", level: 70 },
      { name: "Vercel", level: 85 },
      { name: "VS Code", level: 95 },
      { name: "Linux", level: 80 }
    ],
    color: "orange"
  }
];

const getColorClasses = (color: string) => {
  const colors = {
    blue: {
      bg: "bg-blue-600/20",
      border: "border-blue-500/30",
      text: "text-blue-300",
      progress: "bg-blue-500",
      icon: "text-blue-400"
    },
    green: {
      bg: "bg-green-600/20",
      border: "border-green-500/30",
      text: "text-green-300",
      progress: "bg-green-500",
      icon: "text-green-400"
    },
    purple: {
      bg: "bg-purple-600/20",
      border: "border-purple-500/30",
      text: "text-purple-300",
      progress: "bg-purple-500",
      icon: "text-purple-400"
    },
    orange: {
      bg: "bg-orange-600/20",
      border: "border-orange-500/30",
      text: "text-orange-300",
      progress: "bg-orange-500",
      icon: "text-orange-400"
    }
  };
  return colors[color as keyof typeof colors];
};

const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="skills" className="py-20 bg-background">
      <div className="container mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Skills & Technologies
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A comprehensive toolkit for building innovative solutions
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          {skillCategories.map((category, categoryIndex) => {
            const colorClasses = getColorClasses(category.color);
            
            return (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
                className="bg-card rounded-2xl p-8 backdrop-blur-sm border hover:border-primary/50 transition-colors duration-300"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 rounded-lg ${colorClasses.bg} ${colorClasses.border} border`}>
                    <div className={colorClasses.icon}>
                      {category.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{category.title}</h3>
                </div>

                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-foreground font-medium">{skill.name}</span>
                        <span className={`text-sm ${colorClasses.text} font-semibold`}>
                          {skill.level}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <motion.div
                          className={`h-full ${colorClasses.progress} rounded-full`}
                          initial={{ width: 0 }}
                          animate={isInView ? { width: `${skill.level}%` } : {}}
                          transition={{ 
                            duration: 1.2, 
                            delay: categoryIndex * 0.2 + skillIndex * 0.1,
                            ease: "easeOut"
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {[
            { label: "Years of Experience", value: "4+" },
            { label: "Languages Mastered", value: "8+" },
            { label: "Projects Completed", value: "25+" },
            { label: "Students Mentored", value: "50+" }
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-card rounded-xl border"
            >
              <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;