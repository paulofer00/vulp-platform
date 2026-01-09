"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useLoader, extend, useThree } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { Timer, ArrowDown, Zap } from "lucide-react";

// =========================================================
// 1. O MATERIAL (SHADER) - AGORA COM P&B E SEM DISTORÇÃO
// =========================================================
const LiquidMaskMaterial = shaderMaterial(
  {
    uTex1: new THREE.Texture(),
    uTex2: new THREE.Texture(),
    uDisp: new THREE.Texture(),
    uMask: new THREE.Texture(),
    uIntensity: 0.2, 
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader (A Mágica Visual)
  `
    uniform sampler2D uTex1;
    uniform sampler2D uTex2;
    uniform sampler2D uDisp;
    uniform sampler2D uMask;
    uniform float uIntensity;
    varying vec2 vUv;

    void main() {
      // Lê a máscara (Rastro do mouse)
      float mask = texture2D(uMask, vUv).r;
      
      // Lê a fumaça para criar a borda orgânica
      float disp = texture2D(uDisp, vUv).r;

      // --- MUDANÇA 1: IMAGENS ---
      vec4 t1 = texture2D(uTex1, vUv); // Obra (Passado)
      vec4 t2 = texture2D(uTex2, vUv); // Render (Futuro) -> SEM DISTORÇÃO NAS UVs

      // --- MUDANÇA 2: FILTRO DARK & P&B NA OBRA ---
      // Converte t1 para escala de cinza
      float gray = dot(t1.rgb, vec3(0.299, 0.587, 0.114));
      // Escurece a imagem (multiplica por 0.3 para ficar bem dark)
      vec3 darkBW = vec3(gray) * 0.3;
      t1 = vec4(darkBW, 1.0);

      // --- MUDANÇA 3: MISTURA LÍQUIDA ---
      // A distorção acontece apenas no "fator de mistura" (a borda), não na imagem.
      // Isso cria uma borda ondulada, mas revela uma imagem reta.
      float edge = disp * uIntensity;
      float mixFactor = smoothstep(0.1 - edge, 0.9 + edge, mask);

      gl_FragColor = mix(t1, t2, mixFactor);
    }
  `
);

extend({ LiquidMaskMaterial });

// =========================================================
// 2. HOOK: RASTRO DO MOUSE (MANTIDO SUAVE)
// =========================================================
function useMaskCanvas() {
  const [canvas] = useState(() => {
    if (typeof document === 'undefined') return null;
    const c = document.createElement('canvas');
    c.width = 1280; 
    c.height = 720;
    return c;
  });

  const [texture] = useState(() => {
    const t = new THREE.CanvasTexture(canvas!);
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    return t;
  });

  useEffect(() => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [canvas]);

  const drawSoftCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, opacity: number) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
  }

  const update = (uv: { x: number, y: number } | null) => {
    if (!canvas || !texture) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fade out mais lento para o rastro durar mais
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.04)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (uv) {
      ctx.globalCompositeOperation = 'lighter'; 
      const x = uv.x * canvas.width;
      const y = (1 - uv.y) * canvas.height;
      const baseSize = canvas.width * 0.08; 

      drawSoftCircle(ctx, x, y, baseSize, 0.6);
      drawSoftCircle(ctx, x - baseSize * 0.3, y - baseSize * 0.2, baseSize * 0.7, 0.3);
      drawSoftCircle(ctx, x + baseSize * 0.3, y + baseSize * 0.2, baseSize * 0.7, 0.3);
    }
    texture.needsUpdate = true;
  };

  return { texture, update };
}

// =========================================================
// 3. CENA 3D
// =========================================================
const Scene = () => {
  const { viewport } = useThree();
  const materialRef = useRef<any>(null);
  const { texture: maskTexture, update: updateMask } = useMaskCanvas();
  const mouseUV = useRef<{x: number, y: number} | null>(null);

  const [tex1, tex2, disp] = useLoader(THREE.TextureLoader, [
    "/vulp-real.jpg",
    "/vulp-render.jpg",
    "/displacement.jpg"
  ]);

  useFrame(() => {
    updateMask(mouseUV.current);
  });

  const handlePointerMove = (e: any) => {
    mouseUV.current = e.uv;
  };

  const handlePointerLeave = () => {
    mouseUV.current = null;
  };

  return (
    <mesh onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      {/* @ts-ignore */}
      <liquidMaskMaterial
        ref={materialRef}
        uTex1={tex1}
        uTex2={tex2}
        uDisp={disp}
        uMask={maskTexture}
        uIntensity={0.2} // Ajustado para borda suave
        toneMapped={false}
      />
    </mesh>
  );
};

// =========================================================
// 4. LAYOUT DA PÁGINA (LIMPO E ROXO)
// =========================================================
const VulpLiquidPage = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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
      
      {/* HERO SECTION 3D */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        <div className="absolute inset-0 z-0 cursor-crosshair">
          <Canvas dpr={[1, 2]} gl={{ antialias: true }}>
            <React.Suspense fallback={null}>
              <Scene />
            </React.Suspense>
          </Canvas>
        </div>

        {/* --- TEXTOS (INTERFACE LIMPA) --- */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-center px-4">
                {/* Título Roxo, Sem Caixa, Sem Instruções */}
                <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-purple-600 drop-shadow-[0_0_30px_rgba(147,51,234,0.5)] leading-[0.9] mix-blend-screen">
                    O FUTURO <br /> JÁ COMEÇOU
                </h1>
            </div>
        </div>

        <div className="absolute bottom-10 z-20 w-full flex justify-center animate-bounce opacity-50 pointer-events-none">
            <ArrowDown size={24} className="text-purple-500 drop-shadow-md" />
        </div>
      </section>

      {/* CONTAGEM REGRESSIVA */}
      <section className="min-h-screen bg-black relative flex flex-col items-center justify-center py-24 px-6 border-t border-white/10 z-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-800/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-5xl mx-auto w-full text-center">
            <div className="inline-flex items-center gap-3 border border-purple-500/30 bg-purple-900/10 px-6 py-2 rounded-full mb-12">
                <Timer className="text-purple-400" size={18} />
                <span className="text-purple-200 font-bold text-sm tracking-widest uppercase">Cronômetro Oficial</span>
            </div>
            
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
        <div className="text-5xl md:text-7xl font-black text-white tabular-nums tracking-tighter mb-2">
            {value < 10 ? `0${value}` : value}
        </div>
        <span className="text-gray-500 text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase block">{label}</span>
    </div>
);

export default VulpLiquidPage;