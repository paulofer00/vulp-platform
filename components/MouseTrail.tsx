"use client";

import React, { useRef, useEffect } from "react";

export default function MouseTrail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPos = useRef({ x: 0, y: 0 });
  const timeLast = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      // Distância entre os pontos para criar uma nova "fumaça"
      const distance = Math.hypot(e.clientX - lastPos.current.x, e.clientY - lastPos.current.y);
      
      // Ajustei para criar partículas com mais frequência para o rastro ficar contínuo
      if (now - timeLast.current > 20 || distance > 30) {
        createParticle(e.clientX, e.clientY);
        lastPos.current = { x: e.clientX, y: e.clientY };
        timeLast.current = now;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const createParticle = (x: number, y: number) => {
    if (!containerRef.current) return;

    const particle = document.createElement("div");
    
    // --- MUDANÇAS VISUAIS AQUI ---
    
    // 1. Tamanho muito maior para criar "nuvens" em vez de bolinhas
    const size = 120; // Aumentei de 20px para 120px
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // 2. Cor base com menos opacidade
    particle.style.background = "rgba(168, 85, 247, 0.25)"; // Roxo VULP mais transparente

    // 3. O SEGREDO DO ESFUMAÇADO: Muito Blur e Blend Mode
    particle.style.filter = "blur(40px)"; // Desfoque alto para sumir as bordas
    // 'screen' faz as partículas se somarem criando luz onde se sobrepõem
    particle.style.mixBlendMode = "screen"; 
    
    particle.style.position = "fixed";
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.borderRadius = "50%";
    particle.style.pointerEvents = "none";
    // Centraliza a partícula no mouse
    particle.style.transform = "translate(-50%, -50%) scale(1)";
    // Animação mais lenta para a fumaça dissipar
    particle.style.transition = "transform 1.5s ease-out, opacity 1.5s ease-out";
    particle.style.opacity = "1";

    containerRef.current.appendChild(particle);

    // Animação de dissipar
    requestAnimationFrame(() => {
      // Ela cresce um pouco e some, dando efeito de fumaça subindo/sumindo
      particle.style.transform = "translate(-50%, -50%) scale(1.5)";
      particle.style.opacity = "0";
    });

    // Remove do DOM
    setTimeout(() => {
      particle.remove();
    }, 1500);
  };

  // --- MUDANÇA DE CAMADA (Z-INDEX) ---
  // Mudei de z-50 para z-0. Como seu conteúdo principal é z-10, isso fica atrás.
  return <div ref={containerRef} className="pointer-events-none fixed inset-0 z-0" />;
}