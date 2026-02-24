"use client";

import { useRef, useState, useEffect } from "react";

export default function VideoManifesto() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // --- NOVA LÓGICA: RESET DO TIMER (Essencial para Mobile) ---
  const resetHideTimer = () => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    // Esconde os controles após 2 segundos
    hideTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 2000);
  };

  const toggleVideo = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.stopPropagation(); 

    if (videoRef.current) {
      if (isPlaying) {
        // Pausar
        videoRef.current.pause();
        setIsPlaying(false);
        setShowControls(true);
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      } else {
        // Dar Play
        videoRef.current.play().then(() => {
          setIsPlaying(true);
          resetHideTimer(); // 👈 A MÁGICA DO MOBILE AQUI! Força o timer a contar logo após o clique!
        }).catch(error => console.error("Erro ao tentar reproduzir:", error));
      }
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (isPlaying) {
      resetHideTimer();
    }
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation(); 
    if (videoRef.current && progressRef.current) {
      // Compatibilidade para clique com mouse ou toque na tela (Mobile)
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const rect = progressRef.current.getBoundingClientRect();
      const clickPosition = (clientX - rect.left) / rect.width;
      
      // Limita a posição entre 0 e 1 para evitar bugs
      const clampedPosition = Math.max(0, Math.min(1, clickPosition));
      videoRef.current.currentTime = clampedPosition * videoRef.current.duration;
      
      // Se clicou na timeline, volta a esconder após 2 segundos
      if (isPlaying) resetHideTimer();
    }
  };

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  return (
    <div className="w-full relative group">
      
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600 rounded-[2.5rem] blur-xl opacity-40 group-hover:opacity-60 transition duration-1000 animate-pulse" />

      <div 
          className="relative bg-[#050505] border border-white/10 rounded-[2rem] overflow-hidden aspect-video shadow-2xl cursor-pointer"
          onClick={toggleVideo}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
      >
          <video
              ref={videoRef}
              className="w-full h-full object-cover"
              poster="/thumbnail.jpg" 
              playsInline
              preload="auto" 
              onTimeUpdate={handleTimeUpdate}
          >
              <source src="https://idmiayjsketfgwotlxad.supabase.co/storage/v1/object/public/videos-vulp/vulp_apresentacao_1.mp4" type="video/mp4" />
              O seu navegador não suporta a reprodução de vídeo.
          </video>

          <div className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-all duration-500 ${!showControls && isPlaying ? 'opacity-0 backdrop-blur-none pointer-events-none' : 'opacity-100'}`} />

          <div className={`absolute inset-0 flex flex-col justify-between transition-all duration-500 ${!showControls && isPlaying ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
              
              <div className="flex-1" />

              <div className="flex justify-center items-center">
                  <div 
                      onClick={toggleVideo}
                      className="flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/20 w-36 h-20 rounded-full shadow-[0_0_50px_rgba(168,85,247,0.3)] hover:bg-white/20 transition-all duration-300 hover:scale-110 cursor-pointer z-20"
                  >
                      {!isPlaying ? (
                          <img src="/logo-white.png" alt="Play Manifesto" className="h-6 w-auto opacity-90 drop-shadow-lg object-contain" />
                      ) : (
                          <img src="/vulp-icon-white.png" alt="Pause Manifesto" className="h-10 w-10 opacity-90 drop-shadow-lg object-contain" />
                      )}
                  </div>
              </div>

              <div className="flex-1 flex items-end">
                  <div className="w-full px-6 pb-6">
                      <div 
                          ref={progressRef}
                          onClick={handleTimelineClick}
                          onTouchEnd={handleTimelineClick} // 👈 Adicionado para toque perfeito no mobile
                          className="w-full h-2 bg-white/20 rounded-full overflow-visible cursor-pointer hover:h-3 transition-all duration-300 group/timeline relative z-20"
                      >
                          <div 
                              className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 relative rounded-full"
                              style={{ width: `${progress}%` }}
                          >
                              {/* RAPOSA DA VULP SEMPRE VISÍVEL E MAIOR NA TIMELINE */}
                              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 flex items-center justify-center transition-all duration-300">
                                  <svg viewBox="0 0 512 512" className="w-8 h-8 fill-white drop-shadow-[0_0_10px_rgba(255,255,255,1)]">
                                      <path d="M344.24,169.34c3.52,12.39,2.62,26.07-3.56,38.51-9.57,19.25-29.16,30.22-49.32,29.73h.01s0,0,0,0c4.61,7.55,11.34,13.94,19.85,18.17,7.86,3.91,16.28,5.49,24.46,5.01h0s0,0,0,0c8.08-.42,16.38,1.17,24.14,5.03,15.85,7.88,25.51,23.24,26.85,39.68,22.91-49.72,4.25-108.53-42.43-136.15Z"/>
                                      <path d="M307.99,332.32c-27.37-13.6-41.68-42.99-37.4-71.67h0c.1-.73.18-1.46.27-2.19.03-.24.06-.48.09-.72.16-1.48.29-2.97.38-4.45.02-.35.04-.7.06-1.05.08-1.5.15-3,.17-4.5,0-.13,0-.25,0-.38.01-1.42,0-2.83-.05-4.24-.01-.33-.02-.66-.03-.99-.06-1.46-.15-2.92-.27-4.38-.03-.31-.06-.61-.08-.92-.12-1.34-.27-2.67-.44-4-.03-.22-.05-.43-.08-.65-.2-1.46-.43-2.9-.69-4.35-.06-.35-.13-.7-.19-1.05-.27-1.45-.57-2.89-.9-4.32-.04-.17-.09-.34-.13-.51-.31-1.32-.65-2.64-1.02-3.94-.09-.32-.17-.64-.26-.95-.4-1.39-.83-2.77-1.28-4.14-.1-.31-.21-.62-.32-.93-.43-1.26-.89-2.52-1.36-3.76-.07-.19-.14-.38-.22-.57-.53-1.36-1.1-2.7-1.69-4.04-.15-.34-.3-.67-.45-1.01-.6-1.33-1.22-2.64-1.87-3.94-.1-.2-.21-.4-.31-.6-.6-1.17-1.22-2.33-1.87-3.49-.16-.29-.32-.59-.49-.88-.71-1.25-1.45-2.49-2.22-3.71-.19-.3-.38-.6-.57-.89-.72-1.13-1.47-2.25-2.24-3.36-.11-.16-.21-.32-.32-.47-.84-1.2-1.72-2.37-2.61-3.54-.23-.3-.47-.61-.7-.91-.9-1.15-1.82-2.28-2.77-3.39-.17-.2-.35-.4-.53-.6-.86-.99-1.73-1.96-2.63-2.92-.23-.25-.46-.5-.69-.74-1.01-1.06-2.04-2.09-3.09-3.11-.27-.26-.54-.51-.81-.77-.35-.33-.69-.66-1.04-.99h0s-.02,0-.03.01c-7.17-6.59-15.36-12.31-24.52-16.86-36.84-18.31-79.22-13.18-110.18,9.71,11.48.52,23.03,3.39,33.98,8.83,32.19,16,49.81,49.63,47,83.4-.01.14,0,.29-.02.43-.11,1.63-.17,3.25-.21,4.88,0,.24-.02.49-.03.73-.03,1.89,0,3.77.08,5.65.02.46.06.93.08,1.39.07,1.4.16,2.79.29,4.18.06.65.14,1.29.21,1.93.13,1.21.28,2.42.45,3.62.1.69.21,1.38.33,2.08.19,1.16.4,2.31.63,3.45.14.69.28,1.38.43,2.07.26,1.17.54,2.32.83,3.48.16.65.32,1.29.5,1.93.35,1.28.74,2.54,1.14,3.8.16.5.3,1.01.47,1.51.59,1.76,1.21,3.51,1.89,5.25.04.11.09.21.13.32.63,1.61,1.31,3.2,2.02,4.78.25.54.51,1.08.77,1.62.54,1.14,1.08,2.27,1.66,3.38.32.62.66,1.23.99,1.84.55,1.03,1.12,2.04,1.71,3.05.37.63.74,1.25,1.12,1.87.6.99,1.22,1.96,1.86,2.93.39.6.79,1.2,1.2,1.79.69,1,1.4,1.98,2.12,2.96.39.53.77,1.06,1.17,1.58.89,1.16,1.81,2.29,2.75,3.42.26.31.51.64.77.95,1.22,1.43,2.48,2.82,3.78,4.19.32.34.67.67,1,1,.99,1.01,1.99,2.01,3.02,2.99.14.13.26.27.4.39,0,0,.01,0,.02-.01,7.37,6.88,15.82,12.83,25.31,17.55,43.73,21.74,95.21,10.63,126.42-23.89-18.54,9.08-40.95,9.74-60.87-.16Z"/>
                                  </svg>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

          </div>
      </div>
    </div>
  );
}