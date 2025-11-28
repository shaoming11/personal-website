"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Github, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/types/project";
import { modalVariants, overlayVariants } from "@/lib/animations/variants";
import { useEffect } from "react";

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
}

export const ProjectModal = ({
  project,
  isOpen,
  onClose,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext
}: ProjectModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (hasPrevious && onPrevious) onPrevious();
          break;
        case 'ArrowRight':
          if (hasNext && onNext) onNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrevious, onNext, hasPrevious, hasNext]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!project) return null;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          variants={overlayVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            className="bg-[#181818] border border-white/10 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white border-white/20"
            >
              <X className="w-4 h-4" />
            </Button>

            {hasPrevious && onPrevious && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white border-white/20"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}

            {hasNext && onNext && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onNext}
                className="absolute right-16 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white border-white/20"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
              <div className="relative min-h-[300px] lg:min-h-[500px]">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#181818]/50 lg:to-[#181818]/80" />
              </div>

              <div className="p-8 space-y-6 overflow-y-auto max-h-[90vh]">
                <div className="space-y-4">
                  <Badge 
                    variant="secondary" 
                    className="bg-[#1DB954]/20 text-[#1DB954] border-[#1DB954]/30"
                  >
                    {project.category}
                  </Badge>

                  <h2 className="text-3xl font-bold text-white leading-tight">
                    {project.title}
                  </h2>

                  <p className="text-gray-300 text-lg leading-relaxed">
                    {project.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge 
                        key={tech} 
                        variant="outline" 
                        className="border-white/20 text-gray-300 bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  {project.liveUrl && (
                    <Button 
                      size="lg" 
                      className="flex-1 bg-[#1DB954] hover:bg-[#1ed760] text-white border-none"
                      onClick={() => window.open(project.liveUrl, '_blank')}
                    >
                      <ExternalLink className="w-5 h-5 mr-2" />
                      View Live Demo
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="flex-1 border-white/20 text-gray-300 hover:bg-white/10"
                      onClick={() => window.open(project.githubUrl, '_blank')}
                    >
                      <Github className="w-5 h-5 mr-2" />
                      View Source Code
                    </Button>
                  )}
                </div>

                <div className="text-sm text-gray-500 pt-4 border-t border-white/10">
                  <p>Use arrow keys to navigate between projects • Press ESC to close</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};