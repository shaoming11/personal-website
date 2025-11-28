"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/types/project";
import { cardVariants } from "@/lib/animations/variants";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  variant: "left" | "center" | "right" | "expanded" | "focused";
  index: number;
  onCardClick?: () => void;
  className?: string;
}

export const ProjectCard = ({ 
  project, 
  variant, 
  index, 
  onCardClick,
  className 
}: ProjectCardProps) => {
  const isInteractive = variant === "expanded" || variant === "focused";

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      animate={variant}
      whileHover={isInteractive ? "hover" : undefined}
      onClick={onCardClick}
      className={cn(
        "cursor-pointer perspective-1000",
        variant === "focused" && "fixed inset-0 z-50 flex items-center justify-center p-8",
        className
      )}
      style={{
        transformStyle: "preserve-3d"
      }}
    >
      <Card className="w-[280px] h-[400px] bg-[#181818] border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        
        <CardHeader className="p-0 relative h-48">
          <div className="relative w-full h-full overflow-hidden rounded-t-2xl">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 hover:scale-110"
              sizes="(max-width: 768px) 100vw, 280px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#181818]/80 via-transparent to-transparent" />
            
            <Badge 
              variant="secondary" 
              className="absolute top-4 right-4 bg-[#1DB954]/90 text-white border-none"
            >
              {project.category}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          <CardTitle className="text-white text-xl font-bold line-clamp-2">
            {project.title}
          </CardTitle>
          
          <p className="text-gray-300 text-sm line-clamp-3 leading-relaxed">
            {project.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 3).map((tech) => (
              <Badge 
                key={tech} 
                variant="outline" 
                className="text-xs border-white/20 text-gray-300 bg-white/5"
              >
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 3 && (
              <Badge 
                variant="outline" 
                className="text-xs border-white/20 text-gray-400 bg-white/5"
              >
                +{project.technologies.length - 3}
              </Badge>
            )}
          </div>

          {isInteractive && (
            <motion.div 
              className="flex gap-3 pt-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {project.liveUrl && (
                <Button 
                  size="sm" 
                  className="flex-1 bg-[#1DB954] hover:bg-[#1ed760] text-white border-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(project.liveUrl, '_blank');
                  }}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Live Demo
                </Button>
              )}
              {project.githubUrl && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 border-white/20 text-gray-300 hover:bg-white/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(project.githubUrl, '_blank');
                  }}
                >
                  <Github className="w-4 h-4 mr-2" />
                  Code
                </Button>
              )}
            </motion.div>
          )}
        </CardContent>

        {variant === "center" && !isInteractive && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-[#1DB954]/20 via-transparent to-transparent pointer-events-none"
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </Card>
    </motion.div>
  );
};