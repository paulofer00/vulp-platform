"use client";

import { useRef, useState } from "react";

export default function VideoManifesto() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <section className="py-24 px-6 relative z-10">
      <div className="max-w-5xl mx-auto relative">
        
        {/* EFEITO DE LUZ/MOLDURA DISRUPTIVA ATRÁS DO VÍDEO */}
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600 rounded-[2.5rem] blur-xl opacity-40 group-hover:opacity-60 transition duration-1000 animate-pulse" />

        {/* CONTENTOR DO VÍDEO */}
        <div 
            className="relative bg-[#050505] border border-white/10 rounded-[2rem] overflow-hidden aspect-video shadow-2xl cursor-pointer group"
            onClick={toggleVideo}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* 👇 COLA AQUI O LINK QUE COPIASTE DO SUPABASE 👇 */}
            <video
                ref={videoRef}
                className="w-full h-full object-cover"
                src="https://idmiayjsketfgwotlxad.supabase.co/storage/v1/object/public/videos-vulp/vulp_apresentacao_1.mov" 
                playsInline
                loop
            />

            {/* OVERLAY ESCURO (Aparece quando está pausado para o botão ficar visível) */}
            <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-700 ${isPlaying && !isHovered ? 'opacity-0 backdrop-blur-none' : 'opacity-100'}`} />

            {/* BOTÕES PERSONALIZADOS VULP NO MEIO */}
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${isPlaying && !isHovered ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                
                {/* O "Vidro" flutuante do botão */}
                <div className="flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/20 px-8 py-6 rounded-full shadow-[0_0_50px_rgba(168,85,247,0.3)] hover:bg-white/20 transition-all duration-300 hover:scale-110">
                    
                    {!isPlaying ? (
                        // BOTÃO CONTINUAR/PLAY (LOGO TEXT VULP) - Certifica-te que logo-white.png existe
                        <img src="/logo-white.png" alt="Play Manifesto" className="h-6 w-auto opacity-90 drop-shadow-lg ml-1" />
                    ) : (
                        // BOTÃO PAUSAR (ÍCONE RAPOSA) - Certifica-te que vulp-icon-white.png existe
                        <img src="/vulp-icon-white.png" alt="Pause Manifesto" className="h-10 w-10 opacity-90 drop-shadow-lg" />
                    )}

                </div>
            </div>
            
        </div>
      </div>
    </section>
  );
}