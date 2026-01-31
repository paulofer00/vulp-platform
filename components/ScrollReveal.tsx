"use client"; // Obrigatório no topo

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right";
  className?: string;
}

// NOTE AQUI: Tirei o "default" e deixei "export function"
export function ScrollReveal({ 
  children, 
  delay = 0, 
  direction = "up",
  className = "" 
}: ScrollRevealProps) {
  
  const directions = {
    up: { y: 50, x: 0 },
    left: { y: 0, x: -50 },
    right: { y: 0, x: 50 },
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...directions[direction] 
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        x: 0 
      }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.8, 
        delay: delay, 
        ease: [0.21, 0.47, 0.32, 0.98]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}