"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Timer, Zap, ArrowDown } from 'lucide-react';
import Link from 'next/link';

const VulpScrollReveal = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Hook para capturar o progresso do scroll (0 a 1)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // --- ANIMAÇÕES BASEADAS NO SCROLL ---
  
  // 1. A Imagem de fundo diminui (scale) e some (opacity)
  const imageScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.6]);
  const imageOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const imageFilter = useTransform(scrollYProgress, [0, 0.4], ["brightness(1) blur(0px)", "brightness(0.2) blur(10px)"]);

  // 2. O Logo aparece desenhando (stroke) e preenchendo (fill)
  const logoPathLength = useTransform(scrollYProgress, [0.2, 0.6], [0, 1]);
  const logoOpacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
  const logoFill = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);

  // 3. O Conteúdo (Contador + Botão) sobe e aparece
  const contentOpacity = useTransform(scrollYProgress, [0.5, 0.8], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0.5, 0.8], [50, 0]);

  // --- LÓGICA DO CONTADOR ---
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // DATA ALVO: 31 de Maio de 2026 às 20:00
    const targetDate = new Date('2026-05-31T20:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    // Container com altura extra (200vh) para permitir o scroll
    <div ref={containerRef} className="h-[250vh] bg-[#050505] relative">
      
      {/* O conteúdo fica "preso" na tela enquanto scrollamos */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        
        {/* --- CAMADA 1: IMAGEM DE FUNDO (RENDER) --- */}
        <motion.div 
          style={{ scale: imageScale, opacity: imageOpacity, filter: imageFilter }}
          className="absolute inset-0 z-0"
        >
            <div 
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: "url('/vulp-render.jpg')" }} // Use sua imagem aqui
            >
                {/* Overlay escuro para garantir leitura inicial */}
                <div className="absolute inset-0 bg-black/30"></div>
            </div>
        </motion.div>

        {/* Indicador de Scroll Inicial */}
        <motion.div 
            style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
            className="absolute bottom-10 z-10 flex flex-col items-center gap-2 text-white animate-bounce"
        >
            <span className="text-[10px] tracking-widest uppercase">Role para Revelar</span>
            <ArrowDown size={20} />
        </motion.div>


        {/* --- CAMADA 2: LOGO TRACEJADA E CONTEÚDO --- */}
        <div className="relative z-20 flex flex-col items-center w-full px-6">
            
            {/* LOGO SVG ANIMADO */}
            <motion.div 
                style={{ opacity: logoOpacity }}
                className="mb-12 relative w-48 h-48 md:w-64 md:h-64"
            >
                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                    {/* Definição do Gradiente Roxo */}
                    <defs>
                        <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#9333ea" /> {/* Purple-600 */}
                            <stop offset="100%" stopColor="#a855f7" /> {/* Purple-500 */}
                        </linearGradient>
                    </defs>

                    {/* Caminho da Raposa (Simplificado para Demo) */}
                    {/* O 'pathLength' animado cria o efeito de desenho */}
                    <motion.path
                        d="M344.24,169.34c3.52,12.39,2.62,26.07-3.56,38.51-9.57,19.25-29.16,30.22-49.32,29.73h.01s0,0,0,0c4.61,7.55,11.34,13.94,19.85,18.17,7.86,3.91,16.28,5.49,24.46,5.01h0s0,0,0,0c8.08-.42,16.38,1.17,24.14,5.03,15.85,7.88,25.51,23.24,26.85,39.68,22.91-49.72,4.25-108.53-42.43-136.15Z" // Troque este 'd' pelo path do seu logo real
                        fill="url(#purpleGrad)"
                        stroke="#a855f7"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0, fillOpacity: 0 }}
                        style={{ pathLength: logoPathLength, fillOpacity: logoFill }}
                    />
                </svg>
                
                {/* Brilho atrás do logo */}
                <motion.div 
                    style={{ opacity: logoFill }}
                    className="absolute inset-0 bg-purple-600/30 blur-[60px] -z-10 rounded-full"
                />
            </motion.div>


            {/* CONTEÚDO INFERIOR (CONTADOR + BOTÃO) */}
            <motion.div 
                style={{ opacity: contentOpacity, y: contentY }}
                className="text-center w-full max-w-4xl"
            >
                <h1 className="text-4xl md:text-6xl font-black text-white mb-12 tracking-tighter">
                    VULP ACADEMY
                </h1>

                {/* CONTADOR */}
                <div className="grid grid-cols-4 gap-2 md:gap-6 mb-16">
                    <TimeBox value={timeLeft.days} label="DIAS" />
                    <TimeBox value={timeLeft.hours} label="HORAS" />
                    <TimeBox value={timeLeft.minutes} label="MINUTOS" />
                    <TimeBox value={timeLeft.seconds} label="SEGUNDOS" />
                </div>

                {/* BOTÃO VIP */}
                <Link 
                    href="https://wa.me/5593991174787" 
                    target="_blank"
                    className="inline-flex items-center gap-3 bg-white text-black font-bold text-lg px-10 py-5 rounded-full hover:bg-purple-600 hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(147,51,234,0.6)] hover:scale-105"
                >
                    <Zap size={24} fill="currentColor" />
                    ENTRAR NA LISTA VIP
                </Link>

            </motion.div>
        </div>

      </div>
      
      {/* Espaço extra no final para garantir que o scroll termine suave */}
      <div className="h-[50vh] w-full bg-[#050505]"></div>
    </div>
  );
};

// Componente dos Quadrados do Tempo
const TimeBox = ({ value, label }: { value: number, label: string }) => (
    <div className="bg-white/5 border border-white/10 p-4 md:p-8 rounded-2xl backdrop-blur-sm">
        <div className="text-3xl md:text-6xl font-black text-white tabular-nums tracking-tighter mb-1 md:mb-2">
            {value < 10 ? `0${value}` : value}
        </div>
        <span className="text-purple-400 text-[8px] md:text-xs font-bold tracking-[0.2em] uppercase block">
            {label}
        </span>
    </div>
);

export default VulpScrollReveal;