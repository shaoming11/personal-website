"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Calendar, MapPin, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const experiences = [
  {
    title: "Robotics Team Leader",
    company: "Altura Robotics",
    period: "2022 - Present",
    location: "Ontario, Canada",
    description: "Leading robotics team in competitive programming and hardware design. Mentoring team members in C++, Python, and robotics engineering principles.",
    achievements: [
      "Led team to regional championships",
      "Mentored 15+ students in robotics programming",
      "Implemented advanced autonomous navigation systems"
    ]
  },
  {
    title: "Software Developer & Mentor",
    company: "Brampton Robotics",
    period: "2021 - 2022",
    location: "Brampton, ON",
    description: "Developed software solutions for robotics applications and mentored junior developers in programming fundamentals and best practices.",
    achievements: [
      "Built real-time robot control systems",
      "Trained 20+ students in programming",
      "Improved team efficiency by 40%"
    ]
  },
  {
    title: "Event Organizer & Developer",
    company: "Hack Canada",
    period: "2020 - Present",
    location: "Remote",
    description: "Organizing hackathons and tech events across Canada. Developing platforms and tools to support the Canadian tech community.",
    achievements: [
      "Organized 5+ successful hackathons",
      "Built event management platforms",
      "Supported 500+ student developers"
    ]
  }
];

const Experience = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="experience" className="py-20 bg-background">
      <div className="container mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Experience
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            My journey in robotics, software development, and community building
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative mb-12 last:mb-0"
            >
              {/* Timeline line */}
              {index !== experiences.length - 1 && (
                <div className="absolute left-8 top-20 w-px h-32 bg-gradient-to-b from-blue-500 to-transparent opacity-50" />
              )}
              
              <Card className="hover:border-primary/50 transition-colors duration-300">
                <CardContent className="p-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex-shrink-0" />
                      <h3 className="text-2xl font-bold text-foreground">{exp.title}</h3>
                    </div>
                    <h4 className="text-xl text-primary font-semibold mb-4">{exp.company}</h4>
                  </div>
                  <div className="flex flex-col md:items-end text-sm text-muted-foreground gap-1">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{exp.period}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={16} />
                      <span>{exp.location}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-foreground text-lg leading-relaxed mb-6">
                  {exp.description}
                </p>
                
                <div className="space-y-2">
                  <h5 className="text-foreground font-semibold flex items-center gap-2 mb-3">
                    <Award size={18} className="text-primary" />
                    Key Achievements
                  </h5>
                  <ul className="space-y-2">
                    {exp.achievements.map((achievement, achIndex) => (
                      <li key={achIndex} className="text-foreground flex items-start gap-3">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;