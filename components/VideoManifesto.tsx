"use client";

export default function VideoManifesto() {
  return (
    <div className="w-full relative group">
      
      {/* Aquele brilho insano de fundo da VULP (mantido!) */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600 rounded-[2.5rem] blur-xl opacity-40 group-hover:opacity-60 transition duration-1000 animate-pulse" />

      {/* Caixa do Player */}
      <div className="relative bg-[#050505] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl w-full aspect-video">
        
        <iframe 
          src="https://player.scaleup.com.br/embed/1057d1fc9dda41635ccc14cc784533dd695ba71f" 
          title="Aula LP Posicione-se" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
          allowFullScreen
          className="w-full h-full border-0 absolute top-0 left-0"
        ></iframe>

      </div>
    </div>
  );
}