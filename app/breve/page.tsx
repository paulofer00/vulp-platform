"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useLoader, extend, useThree } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { Timer, ArrowDown, Zap } from "lucide-react";
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

// =========================================================
// PARTE 1: WEBGL (Fundo Líquido)
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
// PARTE 2: PÁGINA COM SCROLL
// =========================================================

const VulpMergedPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  // Animações
  const bgScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const bgFilter = useTransform(scrollYProgress, [0, 0.4], ["blur(0px)", "blur(15px)"]);
  
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  const mainContentOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
  const mainContentY = useTransform(scrollYProgress, [0.2, 0.5], [100, 0]);
  
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
    <div ref={containerRef} className="h-[300vh] bg-[#050505] relative font-sans selection:bg-purple-600">
      
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

        {/* WEBGL BACKGROUND */}
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

        {/* --- CORREÇÃO 1: pointer-events-none --- */}
        {/* O texto agora é "fantasma" para o mouse, permitindo clicar no canvas atrás */}
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


        {/* CONTEÚDO PRINCIPAL (Raposa + Contador) */}
        {/* pointer-events-none aqui também, para garantir que nada bloqueie */}
        <motion.div 
            style={{ opacity: mainContentOpacity, y: mainContentY }}
            className="relative z-20 flex flex-col items-center justify-center w-full max-w-4xl px-4 gap-12 pointer-events-none"
        >
            
            {/* LOGO DA RAPOSA (Completa com 2 partes) */}
            <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-[0_0_25px_rgba(168,85,247,0.6)]">
                    <defs>
                        <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#d8b4fe" /> 
                            <stop offset="100%" stopColor="#7c3aed" /> 
                        </linearGradient>
                    </defs>

                    {/* PARTE 1: Cabeça */}
                    <motion.path
                        d="M64.84,36.74c.55,1.94.41,4.09-.56,6.03-1.5,3.02-4.57,4.73-7.73,4.66h0s0,0,0,0c.72,1.18,1.78,2.18,3.11,2.85,1.23.61,2.55.86,3.83.79h0s0,0,0,0c1.27-.07,2.57.18,3.78.79,2.48,1.23,4,3.64,4.21,6.22,3.59-7.79.67-17-6.65-21.33Z"
                        fill="transparent"
                        stroke="url(#purpleGrad)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ pathLength: logoPathProgress }}
                    />
                    
                    {/* PARTE 2: Corpo (Adicionada Agora) */}
                    <motion.path
                        d="M59.16,62.28c-4.29-2.13-6.53-6.74-5.86-11.23h0c.02-.11.03-.23.04-.34,0-.04,0-.08.01-.11.03-.23.04-.47.06-.7,0-.05,0-.11,0-.16.01-.24.02-.47.03-.71,0-.02,0-.04,0-.06,0-.22,0-.44,0-.66,0-.05,0-.1,0-.16,0-.23-.02-.46-.04-.69,0-.05,0-.1-.01-.14-.02-.21-.04-.42-.07-.63,0-.03,0-.07-.01-.1-.03-.23-.07-.45-.11-.68,0-.05-.02-.11-.03-.16-.04-.23-.09-.45-.14-.68,0-.03-.01-.05-.02-.08-.05-.21-.1-.41-.16-.62-.01-.05-.03-.1-.04-.15-.06-.22-.13-.43-.2-.65-.02-.05-.03-.1-.05-.15-.07-.2-.14-.39-.21-.59-.01-.03-.02-.06-.03-.09-.08-.21-.17-.42-.26-.63-.02-.05-.05-.11-.07-.16-.09-.21-.19-.41-.29-.62-.02-.03-.03-.06-.05-.09-.09-.18-.19-.37-.29-.55-.03-.05-.05-.09-.08-.14-.11-.2-.23-.39-.35-.58-.03-.05-.06-.09-.09-.14-.11-.18-.23-.35-.35-.53-.02-.02-.03-.05-.05-.07-.13-.19-.27-.37-.41-.55-.04-.05-.07-.09-.11-.14-.14-.18-.29-.36-.43-.53-.03-.03-.06-.06-.08-.09-.13-.15-.27-.31-.41-.46-.04-.04-.07-.08-.11-.12-.16-.17-.32-.33-.48-.49-.04-.04-.09-.08-.13-.12-.05-.05-.11-.1-.16-.16h0s0,0,0,0c-1.12-1.03-2.41-1.93-3.84-2.64-5.77-2.87-12.41-2.06-17.26,1.52,1.8.08,3.61.53,5.32,1.38,5.04,2.51,7.81,7.78,7.36,13.07,0,.02,0,.05,0,.07-.02.25-.03.51-.03.76,0,.04,0,.08,0,.11,0,.3,0,.59.01.88,0,.07,0,.14.01.22.01.22.03.44.05.66,0,.1.02.2.03.3.02.19.04.38.07.57.02.11.03.22.05.33.03.18.06.36.1.54.02.11.04.22.07.32.04.18.08.36.13.55.03.1.05.2.08.3.06.2.12.4.18.6.02.08.05.16.07.24.09.28.19.55.3.82,0,.02.01.03.02.05.1.25.21.5.32.75.04.09.08.17.12.25.08.18.17.36.26.53.05.1.1.19.15.29.09.16.18.32.27.48.06.1.12.2.18.29.09.15.19.31.29.46.06.09.12.19.19.28.11.16.22.31.33.46.06.08.12.17.18.25.14.18.28.36.43.54.04.05.08.1.12.15.19.22.39.44.59.66.05.05.1.1.16.16.15.16.31.32.47.47.02.02.04.04.06.06,0,0,0,0,0,0,1.15,1.08,2.48,2.01,3.97,2.75,6.85,3.41,14.92,1.67,19.81-3.74-2.91,1.42-6.42,1.53-9.54-.02Z"
                        fill="transparent"
                        stroke="url(#purpleGrad)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ pathLength: logoPathProgress }}
                    />

                    {/* Brilho */}
                    <motion.div 
                        style={{ opacity: logoPathProgress }}
                        className="absolute inset-0 bg-purple-500/20 blur-[50px] -z-10 rounded-full"
                    />
                </svg>
            </div>

            {/* CONTADOR E BOTÃO */}
            <div className="flex flex-col items-center w-full">
                <div className="grid grid-cols-4 gap-3 md:gap-8 mb-10">
                    <TimeBox value={timeLeft.days} label="DIAS" />
                    <TimeBox value={timeLeft.hours} label="HORAS" />
                    <TimeBox value={timeLeft.minutes} label="MINUTOS" />
                    <TimeBox value={timeLeft.seconds} label="SEGUNDOS" />
                </div>

                {/* CORREÇÃO 2: pointer-events-auto */}
                {/* O Botão PRECISA ser clicável, então reativamos os eventos nele */}
                <Link 
                    href="https://wa.me/5593991174787" 
                    target="_blank"
                    className="pointer-events-auto inline-flex items-center gap-3 bg-white text-black font-bold text-lg px-10 py-4 rounded-full hover:bg-purple-600 hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(147,51,234,0.6)] hover:scale-105"
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