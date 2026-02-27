"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Faz a Raposa / Logo pulsar suavemente
    gsap.to(".fox-logo", {
      scale: 1.05,
      opacity: 1,
      yoyo: true,
      repeat: -1,
      duration: 0.8,
      ease: "power2.inOut"
    });

    // 2. Anima a Barra de Progresso Neon
    gsap.to(".progress-bar", {
      width: "100%",
      duration: 2.5, // Tempo mínimo que o preloader vai durar
      ease: "power3.inOut"
    });

    // 3. A Função que "Levanta a Cortina"
    const hidePreloader = () => {
      gsap.to(".preloader-container", {
        yPercent: -100, // Sobe a tela inteira para cima
        duration: 1.2,
        ease: "expo.inOut",
        onComplete: () => setIsLoading(false) // Remove do código quando terminar
      });
    };

    // 4. Ouve o navegador: Só sobe a cortina quando o 3D e imagens estiverem prontos
    if (document.readyState === "complete") {
      // Se já carregou rápido demais, garante pelo menos o tempo da animação da barra
      setTimeout(hidePreloader, 2600); 
    } else {
      window.addEventListener("load", () => {
         setTimeout(hidePreloader, 2600);
      });
    }

    return () => window.removeEventListener("load", hidePreloader);
  }, []);

  // Quando termina, o componente desaparece por completo
  if (!isLoading) return null;

  return (
    <div className="preloader-container fixed inset-0 z-[999999] bg-[#050505] flex flex-col items-center justify-center">
      
      {/* 🦊 IMAGEM DA RAPOSA/LOGO */}
      {/* Se tiver um ícone só da cabeça da raposa, troque o src para '/icone-raposa.png' */}
      <img 
        src="/logo-white.png" 
        alt="Carregando VULP..." 
        className="fox-logo h-10 md:h-12 w-auto mb-10 opacity-50" 
      />
      
      {/* BARRA DE PROGRESSO NEON */}
      <div className="w-64 h-[2px] bg-white/5 rounded-full overflow-hidden relative">
        <div className="progress-bar absolute top-0 left-0 h-full w-0 bg-gradient-to-r from-purple-700 via-fuchsia-500 to-purple-400 shadow-[0_0_15px_#a855f7]" />
      </div>
      
      <p className="text-gray-600 text-[9px] uppercase tracking-[0.4em] font-bold mt-6 animate-pulse">
        Preparando o Ecossistema
      </p>
      
    </div>
  );
}