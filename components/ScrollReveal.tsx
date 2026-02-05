"use client";

import { motion, useAnimation, useInView } from "framer-motion";
import { ReactNode, useEffect, useRef } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right";
  className?: string;
}

export function ScrollReveal({ 
  children, 
  delay = 0, 
  direction = "up",
  className = "" 
}: ScrollRevealProps) {
  
  const ref = useRef(null);
  // O "margin" ajustado evita que a animação dispare cedo demais ou tarde demais
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const controls = useAnimation();

  const directions = {
    up: { y: 40, x: 0 },
    left: { y: 0, x: -40 },
    right: { y: 0, x: 40 },
  };

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { 
          opacity: 0, 
          ...directions[direction] 
        },
        visible: { 
          opacity: 1, 
          y: 0, 
          x: 0,
          transition: {
            duration: 0.6, // Levemente mais rápido para evitar "arrasto"
            delay: delay,
            ease: "easeOut"
          }
        }
      }}
      className={className}
      // will-change avisa o navegador para preparar a GPU (evita piscadas)
      style={{ willChange: "opacity, transform" }} 
    >
      {children}
    </motion.div>
  );
}