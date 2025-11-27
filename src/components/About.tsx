"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            About Me
          </h2>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-border/50 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-foreground text-lg leading-relaxed">
                    I'm a passionate <span className="text-primary font-semibold">robotics leader</span> and{" "}
                    <span className="text-primary font-semibold">fullstack developer</span> with a deep love for
                    innovation and technology. Currently pursuing my studies while leading robotics teams
                    and building impactful web applications.
                  </p>
                  
                  <p className="text-foreground text-lg leading-relaxed">
                    My journey in tech spans from competitive robotics with{" "}
                    <span className="text-primary font-semibold">Altura Robotics</span> and{" "}
                    <span className="text-primary font-semibold">Brampton Robotics</span>, to organizing
                    hackathons and empowering the next generation of developers through{" "}
                    <span className="text-primary font-semibold">Hack Canada</span>.
                  </p>

                  <p className="text-foreground text-lg leading-relaxed">
                    I believe in the power of <span className="text-primary font-semibold">STEM education</span> and 
                    enjoy mentoring others, building innovative solutions, and pushing the boundaries of 
                    what's possible with code. When I'm not coding, you'll find me exploring new technologies 
                    or working on robotics projects that bridge the gap between hardware and software.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;