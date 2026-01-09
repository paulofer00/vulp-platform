"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader, extend } from "@react-three/fiber";
import { shaderMaterial, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { Timer, ArrowDown, Zap } from "lucide-react";

// --- 1. O SHADER (A MÁGICA MATEMÁTICA) ---
// Isso roda direto na placa de vídeo para criar o líquido
const LiquidTransitionMaterial = shaderMaterial(
  {
    uTime: 0,
    uHover: 0, // Vai de 0 a 1
    uTex1: new THREE.Texture(),
    uTex2: new THREE.Texture(),
    uDisp: new THREE.Texture(), // A imagem de "fumaça"
  },
  // Vertex Shader (Geometria)
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader (Cores e Distorção)
  `
    uniform float uHover;
    uniform float uTime;
    uniform sampler2D uTex1;
    uniform sampler2D uTex2;
    uniform sampler2D uDisp;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      
      // Lógica da Distorção Líquida
      vec4 disp = texture2D(uDisp, uv);
      float dispFactor = disp.r; // Usamos o canal vermelho da imagem de fumaça

      // Calcula a distorção baseada no movimento do mouse (uHover)
      vec2 distortedPosition1 = vec2(uv.x + dispFactor * (uHover * 0.3), uv.y);
      vec2 distortedPosition2 = vec2(uv.x - (1.0 - dispFactor) * ((1.0 - uHover) * 0.3), uv.y);

      // Pega as cores das duas imagens já distorcidas
      vec4 _texture1 = texture2D(uTex1, distortedPosition1);
      vec4 _texture2 = texture2D(uTex2, distortedPosition2);

      // Mistura final suave
      vec4 finalTexture = mix(_texture1, _texture2, uHover);

      gl_FragColor = finalTexture;
    }
  `
);

// Registra o material para o React entender
extend({ LiquidTransitionMaterial });

// --- 2. O COMPONENTE DA CENA 3D ---
const Scene = ({ isHovering }: { isHovering: boolean }) => {
  const meshRef = useRef<any>();
  
  // Carrega as texturas (imagens)
  // ATENÇÃO: Se der erro de carregamento, verifique os nomes na pasta public
  const [tex1, tex2, disp] = useLoader(THREE.TextureLoader, [
    "/vulp-real.jpg",   // Imagem 1 (Passado)
    "/vulp-render.jpg", // Imagem 2 (Futuro)
    "/displacement.jpg" // A imagem de fumaça/mapa
  ]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Animação suave (Lerp) do valor uHover entre 0 e 1
      // Se isHovering for true, vai pra 1. Se false, vai pra 0.
      meshRef.current.uHover = THREE.MathUtils.lerp(
        meshRef.current.uHover,
        isHovering ? 1 : 0,
        delta * 2.5 // Velocidade da transição (aumente para ser mais rápido)
      );
    }
  });

  return (
    <mesh>
      {/* Cria um plano que ocupa a tela toda (viewport) */}
      <planeGeometry args={[16, 9]} /> 
      {/* @ts-ignore */}
      <liquidTransitionMaterial
        ref={meshRef}
        uTex1={tex1}
        uTex2={tex2}
        uDisp={disp}
        toneMapped={false}
      />
    </mesh>
  );
};

// --- 3. A PÁGINA COMPLETA ---
const VulpLiquidPage = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Contador (Mantido igual)
  useEffect(() => {
    const targetDate = new Date('2025-05-31T00:00:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance < 0) clearInterval(interval);
      else {
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
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-600 font-sans">
      
      {/* SEÇÃO HERO WEBGL */}
      <section 
        className="relative h-screen w-full overflow-hidden bg-black"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* O Canvas 3D (Onde o efeito acontece) */}
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <React.Suspense fallback={null}>
              <Scene isHovering={isHovering} />
            </React.Suspense>
          </Canvas>
        </div>

        {/* Interface Sobreposta (HTML/CSS normal por cima do 3D) */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-center px-4 mix-blend-difference">
                <span className="text-purple-300 font-bold tracking-[0.5em] text-xs md:text-sm uppercase mb-6 inline-block animate-pulse border border-purple-500/50 px-3 py-1 rounded-full">
                    Breve Lançamento
                </span>
                <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white drop-shadow-2xl leading-[0.9] mb-6">
                    O FUTURO <br /> JÁ COMEÇOU
                </h1>
                <p className="text-gray-200 text-sm md:text-lg font-medium tracking-wide">
                    Passe o mouse para visualizar a transformação
                </p>
            </div>
        </div>

        <div className="absolute bottom-10 z-20 w-full flex justify-center animate-bounce opacity-70 pointer-events-none">
            <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] tracking-widest uppercase text-white shadow-black drop-shadow-md">Inauguração</span>
                <ArrowDown size={20} className="text-white drop-shadow-md" />
            </div>
        </div>
      </section>

      {/* SEÇÃO CONTAGEM REGRESSIVA */}
      <section className="min-h-screen bg-black relative flex flex-col items-center justify-center py-24 px-6 border-t border-white/10 z-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-800/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-5xl mx-auto w-full text-center">
            <div className="inline-flex items-center gap-3 border border-purple-500/30 bg-purple-900/10 px-6 py-2 rounded-full mb-12">
                <Timer className="text-purple-400" size={18} />
                <span className="text-purple-200 font-bold text-sm tracking-widest uppercase">Cronômetro Oficial</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-16 text-white leading-tight">
                Prepare-se para a <span className="text-purple-500">Nova Era</span>.
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-20">
                <TimeBox value={timeLeft.days} label="DIAS" />
                <TimeBox value={timeLeft.hours} label="HORAS" />
                <TimeBox value={timeLeft.minutes} label="MINUTOS" />
                <TimeBox value={timeLeft.seconds} label="SEGUNDOS" />
            </div>

            <button className="bg-white text-black font-bold px-10 py-5 rounded-full hover:bg-purple-600 hover:text-white transition-all duration-300 flex items-center gap-3 mx-auto shadow-lg hover:shadow-purple-500/50 hover:scale-105">
                <Zap size={20} className="fill-current" /> Entrar na Lista VIP
            </button>
        </div>
      </section>

      <footer className="bg-black py-12 border-t border-white/5 relative z-20 text-center">
         <img src="/logo-vulp-white.png" alt="VULP" className="h-8 mx-auto mb-4 opacity-40 hover:opacity-100 transition duration-500" />
         <p className="text-gray-700 text-xs tracking-wider uppercase">© 2025 Vulp Academy.</p>
      </footer>
    </div>
  );
};

const TimeBox = ({ value, label }: { value: number, label: string }) => (
    <div className="bg-[#0a0a0a] border border-white/5 p-6 md:p-10 rounded-2xl relative">
        <div className="relative z-10">
            <div className="text-5xl md:text-7xl font-black text-white tabular-nums tracking-tighter mb-2">
                {value < 10 ? `0${value}` : value}
            </div>
            <span className="text-gray-500 text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase block">{label}</span>
        </div>
    </div>
);

export default VulpLiquidPage;