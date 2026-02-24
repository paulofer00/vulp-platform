"use client";

import { useRef, useState, useEffect } from "react";

export default function VideoManifesto() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  
  // Referência para o "timer" que vai esconder os botões
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- LÓGICA DE PLAY/PAUSE ---
  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowControls(true); // Se pausar, mostra os botões sempre
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // --- LÓGICA DO AUTO-HIDE (Sumiço do rato) ---
  const handleMouseMove = () => {
    setShowControls(true);
    
    // Limpa o timer anterior
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    
    // Se estiver a tocar, cria um novo timer para esconder após 2 segundos parado
    if (isPlaying) {
      hideTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2000);
    }
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false);
    }
  };

  // --- LÓGICA DA TIMELINE (Barra de progresso) ---
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      // Calcula a percentagem do vídeo (0 a 100%)
      setProgress((current / duration) * 100);
    }
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Impede que o clique na barra pause o vídeo
    
    if (videoRef.current && progressRef.current) {
      // Calcula onde o utilizador clicou na barra
      const rect = progressRef.current.getBoundingClientRect();
      const clickPosition = (e.clientX - rect.left) / rect.width;
      
      // Atualiza o tempo do vídeo para essa posição
      videoRef.current.currentTime = clickPosition * videoRef.current.duration;
    }
  };

  // Limpeza de memória
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  return (
    <section className="py-24 px-6 relative z-10">
      <div className="max-w-5xl mx-auto relative group">
        
        {/* EFEITO DE LUZ/MOLDURA DISRUPTIVA ATRÁS DO VÍDEO */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600 rounded-[2.5rem] blur-xl opacity-40 group-hover:opacity-60 transition duration-1000 animate-pulse" />

        {/* CONTENTOR PRINCIPAL DO VÍDEO */}
        <div 
            className="relative bg-[#050505] border border-white/10 rounded-[2rem] overflow-hidden aspect-video shadow-2xl cursor-pointer"
            onClick={toggleVideo}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* 👇 VÍDEO (Com Poster/Thumbnail) 👇 */}
            <video
                ref={videoRef}
                className="w-full h-full object-cover"
                src="https://hndwzddcveuzixqcdvav.supabase.co/storage/v1/object/public/video/1023.mp4" 
                poster="/thumbnail.jpg" /* Coloque uma imagem na pasta public com este nome! */
                playsInline
                onTimeUpdate={handleTimeUpdate}
            />

            {/* OVERLAY ESCURO (Aparece quando está pausado ou quando mexe o rato) */}
            <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-500 ${!showControls && isPlaying ? 'opacity-0 backdrop-blur-none' : 'opacity-100'}`} />

            {/* CONTROLES (Botão Central + Timeline) */}
            <div className={`absolute inset-0 flex flex-col justify-between transition-all duration-500 ${!showControls && isPlaying ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
                
                {/* Espaço superior vazio para empurrar o botão pro meio */}
                <div className="flex-1" />

                {/* BOTÃO CENTRAL (Play / Pause) */}
                <div className="flex justify-center items-center">
                    <div className="flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/20 px-8 py-6 rounded-full shadow-[0_0_50px_rgba(168,85,247,0.3)] hover:bg-white/20 transition-all duration-300 hover:scale-110">
                        {!isPlaying ? (
                            // BOTÃO CONTINUAR/PLAY (LOGO TEXT VULP)
                            <img src="/logo-white.png" alt="Play Manifesto" className="h-6 w-auto opacity-90 drop-shadow-lg ml-1" />
                        ) : (
                            // BOTÃO PAUSAR (ÍCONE RAPOSA)
                            <img src="/vulp-icon-white.png" alt="Pause Manifesto" className="h-10 w-10 opacity-90 drop-shadow-lg" />
                        )}
                    </div>
                </div>

                {/* Espaço inferior para empurrar o botão pro meio */}
                <div className="flex-1 flex items-end">
                    {/* TIMELINE / BARRA DE PROGRESSO */}
                    <div className="w-full px-6 pb-6">
                        <div 
                            ref={progressRef}
                            onClick={handleTimelineClick}
                            className="w-full h-2 bg-white/20 rounded-full overflow-hidden cursor-pointer hover:h-3 transition-all duration-300 group/timeline relative"
                        >
                            {/* Barra preenchida de roxo/branco */}
                            <div 
                                className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 relative"
                                style={{ width: `${progress}%` }}
                            >
                                {/* Bolinha brilhante na ponta da timeline (só aparece no hover) */}
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_white] opacity-0 group-hover/timeline:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </section>
  );
}