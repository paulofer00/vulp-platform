"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { Timer, ArrowDown, Zap } from 'lucide-react';

const VulpComingSoon = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  // --- CONFIGURAÇÃO DO EFEITO MOUSE (LANDO NORRIS STYLE) ---
  const ref = useRef<HTMLDivElement>(null);
  
  // Valores crus da posição do mouse
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Valores com física de mola (Spring) para o efeito líquido/suave
  const mouseX = useSpring(x, { stiffness: 400, damping: 40 });
  const mouseY = useSpring(y, { stiffness: 400, damping: 40 });

  // Template da Máscara CSS (Isso cria o buraco que revela a imagem)
  const maskImage = useMotionTemplate`radial-gradient(circle 250px at ${mouseX}px ${mouseY}px, black 100%, transparent 0%)`;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      x.set(e.clientX - rect.left);
      y.set(e.clientY - rect.top);
    }
  };

  // --- LÓGICA DO CONTADOR ---
  useEffect(() => {
    const targetDate = new Date('2025-05-31T00:00:00').getTime();

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
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-600 font-sans overflow-x-hidden">
      
      {/* SEÇÃO 1: HERO INTERATIVO (REVEAL) */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
        
        {/* Título Sobreposto (Fica por cima das imagens) */}
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center z-30 pointer-events-none px-4">
            <span className="text-purple-400 font-bold tracking-[0.5em] text-xs md:text-sm uppercase mb-6 animate-pulse bg-purple-900/20 px-4 py-2 rounded-full border border-purple-500/20">
                Breve Lançamento
            </span>
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-transparent drop-shadow-2xl text-center leading-[0.9]">
                O FUTURO <br /> JÁ COMEÇOU
            </h1>
            <p className="text-gray-400 mt-8 text-sm md:text-lg max-w-md mx-auto text-center font-medium bg-black/50 backdrop-blur-sm p-4 rounded-xl border border-white/5">
                Mova o mouse para revelar a nova sede da VULP.
            </p>
        </div>

        {/* Área Interativa das Imagens */}
        <div 
            ref={ref}
            onMouseMove={handleMouseMove}
            className="absolute inset-0 w-full h-full cursor-none"
        >
            {/* 1. CAMADA DE FUNDO: O Passado (Obra Real) */}
            <div 
                className="absolute inset-0 bg-cover bg-center grayscale brightness-50"
                style={{ backgroundImage: "url('/vulp-real.jpg')" }} 
            ></div>

            {/* 2. CAMADA DA FRENTE: O Futuro (Render 3D) - Revelada pela máscara */}
            <motion.div 
                className="absolute inset-0 bg-cover bg-center w-full h-full"
                style={{ 
                    backgroundImage: "url('/vulp-render.jpg')",
                    maskImage: maskImage,       // Aplica a máscara dinâmica
                    WebkitMaskImage: maskImage  // Compatibilidade Safari/Chrome
                }}
            >
                {/* Um brilho extra na parte revelada para ficar "mágico" */}
                <div className="absolute inset-0 bg-purple-500/10 mix-blend-overlay"></div>
            </motion.div>

            {/* Cursor Personalizado (Mira) */}
            <motion.div
                className="pointer-events-none fixed top-0 left-0 w-24 h-24 border border-white/30 rounded-full z-50 backdrop-blur-[2px] flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                style={{ x: mouseX, y: mouseY, translateX: '-50%', translateY: '-50%' }}
            >
                <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white]"></div>
            </motion.div>
        </div>

        {/* Seta indicando scroll */}
        <div className="absolute bottom-10 z-30 animate-bounce flex flex-col items-center gap-2 opacity-50">
            <span className="text-[10px] tracking-widest uppercase">Inauguração</span>
            <ArrowDown size={20} />
        </div>
      </section>

      {/* SEÇÃO 2: CONTAGEM REGRESSIVA */}
      <section className="min-h-screen bg-black relative flex flex-col items-center justify-center py-24 px-6 border-t border-white/10">
        
        {/* Elemento de Luz Decorativa */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-800/20 blur-[150px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-5xl mx-auto w-full text-center">
            
            <div className="inline-flex items-center gap-3 border border-purple-500/30 bg-purple-900/10 px-6 py-2 rounded-full mb-12 backdrop-blur-md">
                <Timer className="text-purple-400" size={18} />
                <span className="text-purple-200 font-bold text-sm tracking-widest uppercase">Cronômetro Oficial</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-16 text-white leading-tight">
                Prepare-se para a <span className="text-purple-500">Nova Era</span>.
            </h2>

            {/* O CONTADOR */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-20">
                <TimeBox value={timeLeft.days} label="DIAS" />
                <TimeBox value={timeLeft.hours} label="HORAS" />
                <TimeBox value={timeLeft.minutes} label="MINUTOS" />
                <TimeBox value={timeLeft.seconds} label="SEGUNDOS" />
            </div>

            <div className="max-w-2xl mx-auto text-gray-400 text-lg leading-relaxed mb-12">
                <p>
                    A estrutura mais tecnológica de empreendedorismo do país está sendo finalizada. 
                    No dia <strong>31 de Maio de 2025</strong>, as portas se abrem.
                </p>
            </div>

            <button className="group relative bg-white text-black font-bold px-10 py-5 rounded-full hover:bg-purple-600 hover:text-white transition-all duration-300 flex items-center gap-3 mx-auto overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                    <Zap size={20} className="fill-current" /> Entrar na Lista VIP
                </span>
                {/* Efeito hover botão */}
                <div className="absolute inset-0 bg-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-12 border-t border-white/5 relative z-20">
         <div className="container mx-auto px-6 text-center">
             <div className="flex justify-center mb-6">
                {/* LOGO DO FOOTER */}
                <img 
                    src="/logo-vulp-white.png" 
                    alt="VULP" 
                    className="h-8 opacity-40 hover:opacity-100 transition duration-500"
                />
             </div>
             <p className="text-gray-700 text-xs tracking-wider uppercase">
                 © 2025 Vulp Academy. Construindo Legados.
             </p>
         </div>
      </footer>
    </div>
  );
};

// Componente para os números do contador
const TimeBox = ({ value, label }: { value: number, label: string }) => (
    <div className="bg-[#0a0a0a] border border-white/5 p-6 md:p-10 rounded-2xl relative overflow-hidden group hover:border-purple-500/30 transition duration-500">
        <div className="relative z-10">
            <div className="text-5xl md:text-7xl font-black text-white tabular-nums tracking-tighter mb-2 group-hover:text-purple-400 transition duration-300">
                {value < 10 ? `0${value}` : value}
            </div>
            <span className="text-gray-500 text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase block">
                {label}
            </span>
        </div>
        {/* Brilho de fundo no card */}
        <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-purple-600/10 blur-[40px] rounded-full group-hover:bg-purple-600/20 transition duration-500"></div>
    </div>
);

export default VulpComingSoon;