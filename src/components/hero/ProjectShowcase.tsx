"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Project } from "@/types/project";
import { ProjectCard } from "./ProjectCard";
import { ProjectModal } from "./ProjectModal";
import { GlassContainer } from "./GlassContainer";
import { containerVariants, folderVariants, cardEntryVariants } from "@/lib/animations/variants";
import { cn } from "@/lib/utils";

interface ProjectShowcaseProps {
  projects: Project[];
  maxVisibleCards?: number;
  autoRotate?: boolean;
  rotationInterval?: number;
  enableKeyboardNav?: boolean;
  className?: string;
}

export const ProjectShowcase = ({
  projects,
  maxVisibleCards = 3,
  autoRotate = false,
  rotationInterval = 5000,
  enableKeyboardNav = true,
  className
}: ProjectShowcaseProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const visibleProjects = projects.slice(0, maxVisibleCards);
  const currentProject = visibleProjects[currentIndex];
  const leftProject = visibleProjects[currentIndex - 1];
  const rightProject = visibleProjects[currentIndex + 1];

  const handleMouseEnter = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsExpanded(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 300);
  }, []);

  const navigateToProject = useCallback((direction: 'prev' | 'next') => {
    setCurrentIndex(prevIndex => {
      if (direction === 'prev') {
        return prevIndex > 0 ? prevIndex - 1 : visibleProjects.length - 1;
      } else {
        return prevIndex < visibleProjects.length - 1 ? prevIndex + 1 : 0;
      }
    });
  }, [visibleProjects.length]);

  const openProjectModal = useCallback((project: Project) => {
    setSelectedProject(project);
  }, []);

  const closeProjectModal = useCallback(() => {
    setSelectedProject(null);
  }, []);

  const navigateModalProject = useCallback((direction: 'prev' | 'next') => {
    if (!selectedProject) return;
    
    const currentModalIndex = projects.findIndex(p => p.id === selectedProject.id);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentModalIndex > 0 ? currentModalIndex - 1 : projects.length - 1;
    } else {
      newIndex = currentModalIndex < projects.length - 1 ? currentModalIndex + 1 : 0;
    }
    
    setSelectedProject(projects[newIndex]);
  }, [selectedProject, projects]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!enableKeyboardNav || selectedProject) return;
      
      if (e.key === 'ArrowLeft') {
        navigateToProject('prev');
      } else if (e.key === 'ArrowRight') {
        navigateToProject('next');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboardNav, navigateToProject, selectedProject]);

  useEffect(() => {
    if (!autoRotate || isExpanded || selectedProject) return;

    const interval = setInterval(() => {
      navigateToProject('next');
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [autoRotate, isExpanded, selectedProject, rotationInterval, navigateToProject]);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No projects to display
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="container mx-auto px-6 py-12">
        <GlassContainer 
          className="relative p-10 bg-gradient-to-br from-[#1e5c2e] to-[#0a3d1f] border-white/10"
        >
          <motion.div 
            variants={folderVariants}
            initial="initial"
            animate="animate"
            className="relative"
          >
            <div className="absolute -top-6 left-8 w-16 h-8 bg-gradient-to-r from-[#1DB954] to-[#1ed760] rounded-t-xl border-t border-l border-r border-white/20" />
            
            <GlassContainer 
              variant="folder"
              className="min-h-[500px] rounded-t-none pt-8 relative overflow-hidden"
            >
              <div className="absolute top-4 left-6 flex items-center gap-2 text-white/90">
                <FolderOpen className="w-5 h-5" />
                <span className="font-medium">Featured Projects</span>
              </div>

              <motion.div
                ref={containerRef}
                variants={containerVariants}
                animate={isExpanded ? "open" : "closed"}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="flex items-center justify-center mt-16 relative perspective-1000"
              >
                {leftProject && (
                  <motion.div
                    variants={cardEntryVariants}
                    initial="initial"
                    animate="animate"
                    custom={0}
                    className="absolute left-0"
                  >
                    <ProjectCard
                      project={leftProject}
                      variant={isExpanded ? "expanded" : "left"}
                      index={0}
                      onCardClick={() => isExpanded && openProjectModal(leftProject)}
                      className={cn(
                        "transition-opacity duration-300",
                        !isExpanded && "opacity-70"
                      )}
                    />
                  </motion.div>
                )}

                <motion.div
                  variants={cardEntryVariants}
                  initial="initial"
                  animate="animate"
                  custom={1}
                  className="z-10 relative"
                >
                  <ProjectCard
                    project={currentProject}
                    variant={isExpanded ? "expanded" : "center"}
                    index={1}
                    onCardClick={() => openProjectModal(currentProject)}
                  />
                </motion.div>

                {rightProject && (
                  <motion.div
                    variants={cardEntryVariants}
                    initial="initial"
                    animate="animate"
                    custom={2}
                    className="absolute right-0"
                  >
                    <ProjectCard
                      project={rightProject}
                      variant={isExpanded ? "expanded" : "right"}
                      index={2}
                      onCardClick={() => isExpanded && openProjectModal(rightProject)}
                      className={cn(
                        "transition-opacity duration-300",
                        !isExpanded && "opacity-70"
                      )}
                    />
                  </motion.div>
                )}

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="absolute -left-4 top-1/2 -translate-y-1/2 z-20"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigateToProject('prev')}
                      disabled={visibleProjects.length <= 1}
                      className="bg-black/20 hover:bg-black/40 text-white border border-white/20 backdrop-blur-sm"
                      aria-label="Previous project"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                  </motion.div>
                )}

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="absolute -right-4 top-1/2 -translate-y-1/2 z-20"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigateToProject('next')}
                      disabled={visibleProjects.length <= 1}
                      className="bg-black/20 hover:bg-black/40 text-white border border-white/20 backdrop-blur-sm"
                      aria-label="Next project"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </motion.div>
                )}
              </motion.div>

              {visibleProjects.length > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex justify-center mt-8 gap-2"
                >
                  {visibleProjects.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all duration-300",
                        index === currentIndex
                          ? "bg-[#1DB954] w-6"
                          : "bg-white/30 hover:bg-white/50"
                      )}
                      aria-label={`Go to project ${index + 1}`}
                    />
                  ))}
                </motion.div>
              )}

              {enableKeyboardNav && !selectedProject && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="text-center text-white/70 text-sm mt-6"
                >
                  Use arrow keys to navigate • Click cards to view details
                </motion.p>
              )}
            </GlassContainer>
          </motion.div>
        </GlassContainer>
      </div>

      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={closeProjectModal}
        onPrevious={() => navigateModalProject('prev')}
        onNext={() => navigateModalProject('next')}
        hasPrevious={projects.length > 1}
        hasNext={projects.length > 1}
      />
    </div>
  );
};