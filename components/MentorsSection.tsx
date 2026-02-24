"use client";

import { useState, useEffect } from "react";

// --- DADOS DOS MENTORES ---
const mentors = [
  {
    id: 1,
    name: "Nelson",
    role: "CEO Agência Up&Up",
    description: "Fundador da Agência Up&Up, empreendedor de visão.",
    color: "from-purple-600 to-indigo-600",
    image: "/nelson.png" 
  },
  {
    id: 2,
    name: "Beatriz Fernandes",
    role: "Influencer",
    description: "Beatriz é a maior influencer de vendas na região, com mais de 70K de seguidores.",
    color: "from-blue-600 to-cyan-500",
    image: "/bea.png" 
  },
  {
    id: 3,
    name: "Alarico Neto",
    role: "CEO Tapajós Skate Shop",
    description: "O criador da maior Skate Shop da região, converte vendas presenciais através do digital.",
    color: "from-pink-500 to-rose-500",
    image: "/alarico.png" 
  }
];

// --- DADOS DAS EMPRESAS PARCEIRAS (ATUALIZADO COM TAPAJÓS) ---
const partners = [
    { name: "UP", area: "Agência de Marketing", image: "/up.png" },
    { name: "Macedo", area: "Engenharia", image: "/macedo.png" },
    { name: "QG", area: "Loja de Iphone", image: "/qg.png" },
    { name: "Tapajós", area: "Skate Shop", image: "/tss.png" },
    // Deixei mais uma vazia caso entre mais um parceiro no futuro!
    { name: "Sua Empresa", area: "Parceiro" }, 
];

// --- SVG PATHS DA RAPOSA ---
const foxPath1 = "M1364.28,183.53c15.28,53.71,11.38,113.06-15.44,167-41.5,83.48-126.44,131.03-213.87,128.93l.05.02h.02c20,32.76,49.16,60.47,86.06,78.81,34.1,16.95,70.58,23.81,106.05,21.74h0s0,.01,0,.02c35.04-1.82,71.02,5.07,104.68,21.8,68.73,34.17,110.64,100.78,116.42,172.09,99.33-215.59,18.45-470.6-183.98-590.39Z";
const foxPath2 = "M1207.1,890.26c-118.67-58.99-180.73-186.42-162.2-310.78h-.04c.43-3.16.79-6.32,1.15-9.49.12-1.04.27-2.08.38-3.12.7-6.44,1.24-12.88,1.66-19.31.1-1.52.19-3.03.27-4.55.36-6.51.63-13.02.72-19.51,0-.55,0-1.09,0-1.64.06-6.14-.03-12.27-.22-18.39-.04-1.44-.08-2.87-.14-4.31-.25-6.35-.63-12.68-1.15-19-.11-1.33-.25-2.66-.37-3.98-.53-5.8-1.15-11.59-1.9-17.36-.12-.94-.22-1.88-.34-2.82-.85-6.31-1.87-12.59-2.98-18.85-.27-1.52-.55-3.03-.83-4.55-1.18-6.27-2.45-12.52-3.89-18.73-.17-.74-.37-1.48-.54-2.22-1.36-5.73-2.84-11.43-4.41-17.1-.38-1.38-.75-2.76-1.15-4.14-1.73-6.02-3.58-12.01-5.56-17.96-.45-1.36-.93-2.7-1.39-4.05-1.87-5.47-3.84-10.92-5.92-16.32-.32-.82-.61-1.66-.93-2.48-2.3-5.89-4.76-11.71-7.31-17.5-.64-1.46-1.29-2.92-1.95-4.37-2.6-5.75-5.29-11.46-8.12-17.1-.44-.87-.9-1.73-1.35-2.59-2.6-5.09-5.3-10.12-8.09-15.12-.71-1.27-1.41-2.55-2.13-3.82-3.1-5.42-6.31-10.78-9.63-16.08-.81-1.3-1.65-2.58-2.48-3.87-3.14-4.9-6.36-9.76-9.69-14.55-.47-.68-.92-1.37-1.39-2.04-3.65-5.19-7.45-10.29-11.33-15.34-1.01-1.31-2.02-2.63-3.05-3.93-3.9-4.97-7.89-9.89-12.01-14.71-.75-.88-1.53-1.73-2.29-2.61-3.71-4.28-7.52-11.41-12.65-1-1.07-1.99-2.15-3-3.22-4.36-4.58-8.84-9.06-13.41-13.47-1.17-1.13-2.35-2.23-3.53-3.35-1.51-1.43-3-2.88-4.53-4.29h0s-.08.04-.12.06c-31.11-28.56-66.6-53.37-106.32-73.11-159.76-79.42-343.53-57.15-477.78,42.11,49.77,2.27,99.89,14.71,147.37,38.31,139.6,69.39,216.01,215.21,203.79,361.64-.04.63-.04,1.25-.08,1.88-.47,7.05-.76,14.1-.9,21.14-.02,1.06-.1,2.12-.12,3.18-.11,8.18,0,16.34.33,24.49.08,2.01.26,4.01.36,6.02.32,6.06.7,12.1,1.26,18.13.26,2.8.61,5.58.91,8.37.58,5.24,1.21,10.47,1.97,15.69.44,3.01.93,6,1.42,9,.83,5.01,1.74,10,2.73,14.98.6,3,1.21,6,1.87,8.99,1.11,5.05,2.34,10.08,3.62,15.09.71,2.8,1.4,5.6,2.16,8.39,1.52,5.53,3.2,11.02,4.92,16.49.69,2.18,1.31,4.38,2.03,6.56,2.54,7.65,5.25,15.24,8.18,22.75.18.46.39.91.58,1.38,2.75,6.98,5.68,13.89,8.77,20.73,1.06,2.36,2.23,4.67,3.33,7.01,2.32,4.92,4.68,9.83,7.18,14.67,1.39,2.69,2.84,5.34,4.28,8,2.4,4.45,4.86,8.86,7.41,13.23,1.59,2.72,3.21,5.42,4.86,8.12,2.61,4.27,5.31,8.5,8.06,12.69,1.71,2.61,3.42,5.21,5.19,7.78,2.97,4.33,6.06,8.59,9.19,12.83,1.69,2.29,3.34,4.61,5.07,6.87,3.86,5.02,7.86,9.95,11.93,14.82,1.13,1.36,2.2,2.76,3.36,4.11,5.29,6.18,10.75,12.24,16.39,18.16,1.41,1.48,2.9,2.89,4.33,4.35,4.29,4.38,8.63,8.73,13.1,12.95.59.56,1.13,1.15,1.73,1.71.03-.02.06-.04.09-.05,31.94,29.82,68.61,55.64,109.74,76.08,189.62,94.26,412.86,46.11,548.22-103.61-80.41,39.37-177.58,42.25-263.95-.68Z";

const foxPatternSVG = `data:image/svg+xml,%3Csvg width='1920' height='1080' viewBox='0 0 1920 1080' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23a855f7' stroke-width='10' opacity='0.15'%3E%3Cpath d='${foxPath1}'/%3E%3Cpath d='${foxPath2}'/%3E%3C/g%3E%3C/svg%3E`;

export function MentorsSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % mentors.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-32 px-6 relative z-10 bg-white text-gray-900 overflow-hidden">
      
      {/* BACKGROUND SVG REPETIDO */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div 
            className="absolute inset-0" 
            style={{
                backgroundImage: `url("${foxPatternSVG}")`,
                backgroundSize: '180px auto', 
                backgroundPosition: 'center',
                backgroundRepeat: 'repeat', 
            }}
         />
         <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            {/* Lado Esquerdo - Texto Mentores */}
            <div className="order-2 lg:order-1">
                <h2 className="text-4xl md:text-6xl font-black leading-[1.1] mb-6">
                    Aprenda com quem <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400">
                        faz acontecer.
                    </span>
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-8 border-l-4 border-purple-500 pl-6">
                    A teoria aceita tudo. O mercado não. <br/>
                    Na VULP, seus mentores não são teóricos de palco.
                </p>
                <div className="flex gap-3 mt-8">
                    {mentors.map((_, idx) => (
                        <button 
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className={`h-2 rounded-full transition-all duration-500 ${current === idx ? "w-10 bg-purple-600 shadow-[0_0_10px_#a855f7]" : "w-2 bg-gray-300 hover:bg-gray-400"}`}
                        />
                    ))}
                </div>
            </div>

            {/* Lado Direito - Slider Cards */}
            <div className="order-1 lg:order-2 relative h-[500px] w-full flex items-center justify-center perspective-1000">
                {mentors.map((mentor, index) => (
                    <div 
                        key={mentor.id}
                        className={`absolute inset-0 transition-all duration-700 ease-out transform ${
                            index === current 
                                ? "opacity-100 translate-x-0 rotate-0 scale-100 z-20" 
                                : "opacity-0 translate-x-20 rotate-6 scale-90 z-0"
                        }`}
                    >
                        {/* CARD REESTRUTURADO */}
                        <div className="relative w-full h-full bg-[#0A0A0A] rounded-[2rem] overflow-hidden border border-purple-500/20 shadow-2xl shadow-purple-900/20 group hover:border-purple-500/50 transition-colors flex flex-col">
                            
                            {/* PARTE SUPERIOR: FOTO E NEON */}
                            <div className="relative w-full h-[60%] overflow-hidden bg-[#151515] flex items-end justify-center">
                                
                                {/* 👇 1. NEON ROXO DISSIPADO (A MÁGICA ACONTECE AQUI) 👇 */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600/70 blur-[80px] rounded-full z-0 pointer-events-none group-hover:scale-110 transition-transform duration-700" />

                                {/* Sobreposição suave colorida por cima da foto */}
                                <div className={`absolute inset-0 bg-gradient-to-t ${mentor.color} opacity-20 mix-blend-overlay z-10 transition-opacity group-hover:opacity-0 pointer-events-none`} />
                                
                                {/* Imagem do Mentor (Para o neon brilhar, a foto precisa estar sem fundo/recortada) */}
                                <img 
                                    src={mentor.image} 
                                    alt={mentor.name} 
                                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 relative z-10" 
                                />
                                
                                {/* Degradê escuro na base da foto para conectar suavemente com o texto */}
                                <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-[#0A0A0A] to-transparent z-20 pointer-events-none" />
                            </div>

                            {/* PARTE INFERIOR: TEXTO (40% do Card) */}
                            <div className="relative flex-1 flex flex-col items-center justify-start p-6 text-center text-white z-30 -mt-4">
                                <h3 className="text-3xl font-black mb-1 uppercase tracking-tight drop-shadow-lg">{mentor.name}</h3>
                                <p className={`text-sm font-bold uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r ${mentor.color} mb-3 drop-shadow-md`}>{mentor.role}</p>
                                <p className="text-gray-400 text-sm max-w-[280px] mx-auto leading-relaxed">"{mentor.description}"</p>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* --- FAIXA DE EMPRESAS INTERATIVA (ATUALIZADA) --- */}
        <div className="border-t border-gray-200 pt-16 relative">
            <p className="text-center text-gray-500 text-xs uppercase tracking-[0.2em] mb-10 font-bold">
                Empresas parceiras do ecossistema
            </p>
            <div className="flex flex-wrap justify-center gap-6">
                {partners.map((p, i) => (
                    <div 
                        key={i} 
                        className="group relative w-36 h-36 bg-gray-50 rounded-2xl flex flex-col items-center justify-center border border-gray-200 
                        transition-all duration-300 overflow-hidden cursor-default
                        hover:bg-black hover:border-black hover:scale-105 hover:shadow-xl p-4"
                    >
                        <div className="relative z-10 flex flex-col items-center w-full">
                             
                             {/* 👇 SISTEMA INTELIGENTE DE LOGOS 👇 */}
{p.image ? (
    <img 
        src={p.image} 
        alt={p.name} 
        // 1. brightness-0 transforma a logo em preta
        // 2. opacity-70 deixa ela com um tom de grafite/cinza escuro perfeito pro fundo branco
        // 3. No hover, tiramos o brilho 0 e ela volta a ter cor/destaque!
        className="w-20 h-20 object-contain mb-2 brightness-0 opacity-70 group-hover:brightness-100 group-hover:opacity-100 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-300" 
    />
) : (
                                // Se não tiver imagem, mostra o nome em texto como fallback
                                <span className="text-2xl font-black tracking-tighter text-gray-900 group-hover:text-white transition-colors duration-300 mb-1">
                                    {p.name}
                                </span>
                             )}

                             <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 text-center">
                                {p.area}
                             </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}