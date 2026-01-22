"use client";

import { useState, useEffect } from "react";

const slides = [
  {
    id: 1,
    title: "Social Media",
    subtitle: "Curso Faro",
    description: "Domine a estratégia e a criação de conteúdo.",
    bg: "bg-gradient-to-r from-purple-900 via-[#1a0b2e] to-[#050505]", // Ajustei o gradiente para suavizar
    link: "/social-media"
  },
  {
    id: 2,
    title: "Designer",
    subtitle: "Curso Instinto",
    description: "Crie identidades visuais que marcam.",
    bg: "bg-gradient-to-r from-blue-900 via-[#0b1a2e] to-[#050505]",
    link: "/designer"
  },
  {
    id: 3,
    title: "Filmmaker",
    subtitle: "Curso Hiperfocus",
    description: "Produção de vídeo mobile de alto nível.",
    bg: "bg-gradient-to-r from-emerald-900 via-[#062e1b] to-[#050505]",
    link: "/filmmaker"
  }
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    // CORREÇÃO: Removi 'mt-20' e aumentei a altura para ficar imersivo
    <div className="relative w-full h-[750px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center px-6 md:px-20 ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          } ${slide.bg}`}
        >
          {/* Efeito de Luz de Fundo */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 blur-[100px] rounded-full pointer-events-none" />

          {/* Conteúdo Centralizado */}
          <div className="max-w-7xl mx-auto w-full relative z-20 pt-20"> 
            <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/10 text-sm font-bold tracking-wider mb-4 uppercase text-gray-300 backdrop-blur-sm">
               {slide.subtitle}
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-6 uppercase drop-shadow-2xl">
              {slide.title}
            </h1>
            <p className="text-xl text-gray-300 max-w-xl mb-8 font-light leading-relaxed drop-shadow-md">
              {slide.description}
            </p>
            
            {/* Indicadores (Bolinhas) */}
            <div className="flex gap-3 mt-12">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === current ? "w-12 bg-purple-500" : "w-4 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}