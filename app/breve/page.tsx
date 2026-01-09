"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useLoader, extend, useThree } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { Timer, ArrowDown, Zap } from "lucide-react";
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

// =========================================================
// PARTE 1: WEBGL (Shader & Canvas)
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

// Hook corrigido para lidar com redimensionamento de tela (evita bugs nos cantos)
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
    // Força o canvas a ter o tamanho real da janela para não bugar a mascara
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    
    const ctx = c.getContext('2d');
    if(ctx) { ctx.fillStyle = 'black'; ctx.fillRect(0,0,c.width,c.height); }
    
    setCanvasElement(c);

    // Atualiza se a tela mudar de tamanho
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
      const baseSize = canvasElement.width * 0.08; 
      
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
// PARTE 2: PÁGINA (Layout Centralizado)
// =========================================================

const VulpMergedPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  // Animações
  const bgScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const bgFilter = useTransform(scrollYProgress, [0, 0.4], ["blur(0px)", "blur(10px)"]);
  
  const logoProgress = useTransform(scrollYProgress, [0.1, 0.5], [0, 1]);
  const contentOpacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 1]);
  const contentY = useTransform(scrollYProgress, [0.3, 0.6], [100, 0]);

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
    <div ref={containerRef} className="h-[200vh] bg-[#050505] relative font-sans selection:bg-purple-600">
      
      {/* STICKY CONTAINER: Forçamos justify-center e items-center para nada sair do lugar */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center text-center">

        {/* WEBGL BACKGROUND */}
        <motion.div 
            style={{ scale: bgScale, opacity: bgOpacity, filter: bgFilter, transformOrigin: "center center" }}
            className="absolute inset-0 z-0 origin-center" // origin-center EVITA O PULO PRO LADO
        >
            <Canvas dpr={[1, 2]} gl={{ antialias: true }} className="w-full h-full">
                <React.Suspense fallback={null}>
                    <Scene />
                </React.Suspense>
            </Canvas>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-purple-600 drop-shadow-[0_0_30px_rgba(147,51,234,0.5)] leading-[0.9] mix-blend-screen opacity-80 text-center">
                    O FUTURO <br /> JÁ COMEÇOU
                </h1>
            </div>
            
            <div className="absolute bottom-10 w-full flex justify-center animate-bounce opacity-80 pointer-events-none text-white">
                <ArrowDown size={24} className="drop-shadow-md" />
            </div>
        </motion.div>


        {/* LOGO E CONTEÚDO (Centralizados) */}
        <div className="relative z-20 flex flex-col items-center justify-center w-full px-4">
            
            {/* LOGO DA RAPOSA: Viewbox ajustado para mostrar o corpo inteiro */}
            <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] mb-4 flex justify-center">
                {/* AJUSTE FINAL VIEWBOX: 
                   O path começa em 344 e vai até ~400. 
                   ViewBox: 290 (x) 30 (y) 120 (width) 220 (height) 
                   Isso enquadra o desenho perfeitamente.
                */}
                <svg viewBox="290 30 120 220" className="w-full h-full overflow-visible drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                    <defs>
                        <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#9333ea" />
                            <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                    </defs>

                    <motion.path
                        d="M344.24,169.34c3.52,12.39,2.62,26.07-3.56,38.51-9.57,19.25-29.16,30.22-49.32,29.73h.01s0,0,0,0c4.61,7.55,11.34,13.94,19.85,18.17,7.86,3.91,16.28,5.49,24.46,5.01h0s0,0,0,0c8.08-.42,16.38,1.17,24.14,5.03,15.85,7.88,25.51,23.24,26.85,39.68,22.91-49.72,4.25-108.53-42.43-136.15Z"
                        fill="transparent"
                        stroke="url(#purpleGrad)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ pathLength: logoProgress, opacity: logoProgress }}
                    />
                </svg>
            </div>

            {/* CONTEÚDO SUBIDO E CENTRALIZADO */}
            <motion.div 
                style={{ opacity: contentOpacity, y: contentY }}
                className="flex flex-col items-center justify-center w-full max-w-4xl -mt-10"
            >
                {/* CONTADOR */}
                <div className="grid grid-cols-4 gap-2 md:gap-6 mb-10 justify-center mx-auto">
                    <TimeBox value={timeLeft.days} label="DIAS" />
                    <TimeBox value={timeLeft.hours} label="HORAS" />
                    <TimeBox value={timeLeft.minutes} label="MINUTOS" />
                    <TimeBox value={timeLeft.seconds} label="SEGUNDOS" />
                </div>

                {/* BOTÃO VIP */}
                <Link 
                    href="https://wa.me/5593991174787" 
                    target="_blank"
                    className="inline-flex items-center gap-3 bg-white text-black font-bold text-base md:text-lg px-8 py-4 rounded-full hover:bg-purple-600 hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(147,51,234,0.6)] hover:scale-105"
                >
                    <Zap size={20} fill="currentColor" />
                    ENTRAR NA LISTA VIP
                </Link>

            </motion.div>
        </div>

      </div>
    </div>
  );
};

const TimeBox = ({ value, label }: { value: number, label: string }) => (
    <div className="bg-white/5 border border-white/10 p-3 md:p-6 rounded-xl backdrop-blur-md min-w-[70px] flex flex-col items-center justify-center">
        <div className="text-2xl md:text-5xl font-black text-white tabular-nums tracking-tighter mb-1">
            {value < 10 ? `0${value}` : value}
        </div>
        <span className="text-purple-400 text-[8px] md:text-[10px] font-bold tracking-[0.2em] uppercase block">
            {label}
        </span>
    </div>
);

export default VulpMergedPage;