"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useLoader, extend, useThree } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { Timer, ArrowDown, Zap } from "lucide-react";
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

// =========================================================
// PARTE 1: WEBGL (Fundo Líquido - Código Blindado)
// =========================================================

const LiquidMaskMaterial = shaderMaterial(
  {
    uTex1: new THREE.Texture(),
    uTex2: new THREE.Texture(),
    uDisp: new THREE.Texture(),
    uMask: new THREE.Texture(),
    uIntensity: 0.2, 
  },
  `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  `
    uniform sampler2D uTex1;
    uniform sampler2D uTex2;
    uniform sampler2D uDisp;
    uniform sampler2D uMask;
    uniform float uIntensity;
    varying vec2 vUv;

    void main() {
      float mask = texture2D(uMask, vUv).r;
      float disp = texture2D(uDisp, vUv).r;
      
      vec4 t1 = texture2D(uTex1, vUv); // Obra
      vec4 t2 = texture2D(uTex2, vUv); // Render
      
      // Filtro Dark P&B na Obra
      float gray = dot(t1.rgb, vec3(0.299, 0.587, 0.114));
      t1 = vec4(vec3(gray) * 0.3, 1.0);

      float edge = disp * uIntensity;
      float mixFactor = smoothstep(0.1 - edge, 0.9 + edge, mask);

      gl_FragColor = mix(t1, t2, mixFactor);
    }
  `
);
extend({ LiquidMaskMaterial });

function useMaskCanvas() {
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(null);

  const texture = useMemo(() => {
    if (!canvasElement) return null;
    const t = new THREE.CanvasTexture(canvasElement);
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    return t;
  }, [canvasElement]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const c = document.createElement('canvas');
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    const ctx = c.getContext('2d');
    if(ctx) { ctx.fillStyle = 'black'; ctx.fillRect(0,0,c.width,c.height); }
    setCanvasElement(c);

    const handleResize = () => {
        c.width = window.innerWidth;
        c.height = window.innerHeight;
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const update = (uv: {x:number, y:number} | null) => {
    if(!canvasElement || !texture) return;
    const ctx = canvasElement.getContext('2d');
    if(!ctx) return;
    
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)'; 
    ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
    
    if (uv) {
      ctx.globalCompositeOperation = 'lighter'; 
      const x = uv.x * canvasElement.width;
      const y = (1 - uv.y) * canvasElement.height;
      const baseSize = Math.max(canvasElement.width, canvasElement.height) * 0.08; 
      
      const draw = (ox:number, oy:number, r:number, op:number) => {
          const g = ctx.createRadialGradient(ox, oy, 0, ox, oy, r);
          g.addColorStop(0, `rgba(255, 255, 255, ${op})`);
          g.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(ox, oy, r, 0, Math.PI*2); ctx.fill();
      }
      draw(x, y, baseSize, 0.6);
      draw(x - baseSize*0.3, y - baseSize*0.2, baseSize*0.7, 0.3);
      draw(x + baseSize*0.3, y + baseSize*0.2, baseSize*0.7, 0.3);
    }
    texture.needsUpdate = true;
  };
  return { texture, update };
}

const Scene = () => {
  const { viewport } = useThree();
  const materialRef = useRef<any>(null);
  const { texture, update } = useMaskCanvas();
  const mouseUV = useRef<{x:number, y:number}|null>(null);
  const [tex1, tex2, disp] = useLoader(THREE.TextureLoader, ["/vulp-real.jpg", "/vulp-render.jpg", "/displacement.jpg"]);
  
  useFrame(() => update(mouseUV.current));
  
  return (
    <mesh onPointerMove={(e:any) => mouseUV.current = e.uv} onPointerLeave={() => mouseUV.current = null}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      {/* @ts-ignore */}
      <liquidMaskMaterial ref={materialRef} uTex1={tex1} uTex2={tex2} uDisp={disp} uMask={texture || new THREE.Texture()} uIntensity={0.2} toneMapped={false} />
    </mesh>
  );
};

// =========================================================
// PARTE 2: PÁGINA (Layout Empilhado e Corrigido)
// =========================================================

const VulpMergedPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  // --- ANIMAÇÕES SINCRONIZADAS ---
  // Fundo (Background)
  const bgScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]); // Some mais rápido para focar no conteúdo
  const bgFilter = useTransform(scrollYProgress, [0, 0.4], ["blur(0px)", "blur(15px)"]);
  
  // Texto "O FUTURO..." (Some ao rolar)
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  // Container Principal (Raposa + Conteúdo)
  // Começa invisível e baixo (100px), sobe para o centro e aparece
  const mainContentOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
  const mainContentY = useTransform(scrollYProgress, [0.2, 0.5], [100, 0]);
  
  // Desenho da Raposa (O Path se desenha)
  const logoPathProgress = useTransform(scrollYProgress, [0.3, 0.6], [0, 1]);

  // Contador
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const targetDate = new Date('2026-05-31T20:00:00').getTime();
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
    // Aumentei para 300vh para dar bastante espaço de scroll suave
    <div ref={containerRef} className="h-[300vh] bg-[#050505] relative font-sans selection:bg-purple-600">
      
      {/* STICKY CONTAINER: A janela onde tudo acontece */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

        {/* --- CAMADA 0: FUNDO LÍQUIDO (WebGL) --- */}
        <motion.div 
            style={{ scale: bgScale, opacity: bgOpacity, filter: bgFilter, transformOrigin: "center center" }}
            className="absolute inset-0 z-0"
        >
            <Canvas dpr={[1, 2]} gl={{ antialias: true }} className="w-full h-full">
                <React.Suspense fallback={null}>
                    <Scene />
                </React.Suspense>
            </Canvas>
        </motion.div>

        {/* --- CAMADA 1: TEXTO INICIAL (Some com scroll) --- */}
        <motion.div 
            style={{ opacity: textOpacity, scale: textScale }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none"
        >
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-purple-600 drop-shadow-[0_0_30px_rgba(147,51,234,0.5)] leading-[0.9] mix-blend-screen opacity-80 text-center">
                O FUTURO <br /> JÁ COMEÇOU
            </h1>
            <div className="absolute bottom-10 animate-bounce text-white/50">
                <ArrowDown size={30} />
            </div>
        </motion.div>


        {/* --- CAMADA 2: CONTEÚDO PRINCIPAL (Aparece com scroll) --- */}
        {/* Usamos Flex Column para garantir que o contador fique EMBAIXO da raposa */}
        <motion.div 
            style={{ opacity: mainContentOpacity, y: mainContentY }}
            className="relative z-20 flex flex-col items-center justify-center w-full max-w-4xl px-4 gap-12" // gap-12 separa raposa do contador
        >
            
            {/* 1. RAPOSA (Topo) */}
            <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
                {/* ViewBox 0 0 100 100 para o seu novo SVG quadrado */}
                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-[0_0_25px_rgba(168,85,247,0.6)]">
                    <defs>
                        <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#d8b4fe" /> {/* Roxo claro */}
                            <stop offset="100%" stopColor="#7c3aed" /> {/* Roxo escuro */}
                        </linearGradient>
                    </defs>

                    <motion.path
                        // SEU NOVO CÓDIGO AQUI
                        d="M64.84,36.74c.55,1.94.41,4.09-.56,6.03-1.5,3.02-4.57,4.73-7.73,4.66h0s0,0,0,0c.72,1.18,1.78,2.18,3.11,2.85,1.23.61,2.55.86,3.83.79h0s0,0,0,0c1.27-.07,2.57.18,3.78.79,2.48,1.23,4,3.64,4.21,6.22,3.59-7.79.67-17-6.65-21.33Z"
                        fill="transparent"
                        stroke="url(#purpleGrad)"
                        strokeWidth="1.5" // Linha mais fina para desenho delicado
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ pathLength: logoPathProgress }}
                    />
                    
                    {/* Brilho extra atrás da raposa */}
                    <motion.div 
                        style={{ opacity: logoPathProgress }}
                        className="absolute inset-0 bg-purple-500/20 blur-[50px] -z-10 rounded-full"
                    />
                </svg>
            </div>

            {/* 2. CONTADOR E BOTÃO (Embaixo) */}
            <div className="flex flex-col items-center w-full">
                <div className="grid grid-cols-4 gap-3 md:gap-8 mb-10">
                    <TimeBox value={timeLeft.days} label="DIAS" />
                    <TimeBox value={timeLeft.hours} label="HORAS" />
                    <TimeBox value={timeLeft.minutes} label="MINUTOS" />
                    <TimeBox value={timeLeft.seconds} label="SEGUNDOS" />
                </div>

                <Link 
                    href="https://wa.me/5593991174787" 
                    target="_blank"
                    className="inline-flex items-center gap-3 bg-white text-black font-bold text-lg px-10 py-4 rounded-full hover:bg-purple-600 hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(147,51,234,0.6)] hover:scale-105"
                >
                    <Zap size={22} fill="currentColor" />
                    ENTRAR NA LISTA VIP
                </Link>
            </div>

        </motion.div>

      </div>
    </div>
  );
};

const TimeBox = ({ value, label }: { value: number, label: string }) => (
    <div className="bg-white/5 border border-white/10 p-4 md:p-6 rounded-2xl backdrop-blur-md min-w-[80px] flex flex-col items-center">
        <div className="text-3xl md:text-6xl font-black text-white tabular-nums tracking-tighter mb-2">
            {value < 10 ? `0${value}` : value}
        </div>
        <span className="text-purple-400 text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase">
            {label}
        </span>
    </div>
);

export default VulpMergedPage;