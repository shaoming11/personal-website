"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "folder";
}

export const GlassContainer = ({ 
  children, 
  className,
  variant = "default" 
}: GlassContainerProps) => {
  const baseStyles = "backdrop-blur-[29px] saturate-100 border rounded-3xl";
  
  const variantStyles = {
    default: "bg-white/5 border-white/10",
    folder: "bg-gradient-to-br from-[#1DB954] via-[#1ed760] to-[#1DB954] border-white/20"
  };

  return (
    <motion.div
      className={cn(
        baseStyles,
        variantStyles[variant],
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
};