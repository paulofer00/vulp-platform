"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useLoader, extend, useThree } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import { Timer, ArrowDown, Zap } from "lucide-react";

// =========================================================
// 1. O MATERIAL LÍQUIDO (Shader)
// =========================================================
const LiquidMaskMaterial = shaderMaterial(
  {
    uTex1: new THREE.Texture(), // Passado
    uTex2: new THREE.Texture(), // Futuro
    uDisp: new THREE.Texture(), // Fumaça (Distorção)
    uMask: new THREE.Texture(), // O Rastro do Mouse (Nosso Canvas 2D)
    uIntensity: 0.2,            // Força da distorção
  },
  // Vertex Shader (Padrão)
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader (A Mágica)
  `
    uniform sampler2D uTex1;
    uniform sampler2D uTex2;
    uniform sampler2D uDisp;
    uniform sampler2D uMask;
    uniform float uIntensity;
    varying vec2 vUv;

    void main() {
      // 1. Pega o valor da máscara (quão branco está o pixel no canvas 2D?)
      float mask = texture2D(uMask, vUv).r;
      
      // 2. Pega a textura de fumaça
      float disp = texture2D(uDisp, vUv).r;

      // 3. Cria a coordenada distorcida
      // A distorção é mais forte onde a máscara é branca
      vec2 distortedUV = vUv + vec2(disp * mask * uIntensity, 0.0);

      // 4. Pega as cores
      vec4 t1 = texture2D(uTex1, vUv);            // Imagem original
      vec4 t2 = texture2D(uTex2, distortedUV);    // Imagem distorcida

      // 5. Mistura as duas baseada na máscara
      // Se mask for 0 (preto), mostra t1. Se for 1 (branco), mostra t2.
      gl_FragColor = mix(t1, t2, mask);
    }
  `
);

extend({ LiquidMaskMaterial });

// =========================================================
// 2. HOOK: GERENCIADOR DO RASTRO (Canvas 2D)
// =========================================================
function useMaskCanvas() {
  // Cria um canvas HTML na memória (invisível)
  const [canvas] = useState(() => {
    if (typeof document === 'undefined') return null; // Proteção para servidor
    const c = document.createElement('canvas');
    c.width = 128;  // Resolução baixa para performance e efeito "soft"
    c.height = 128;
    return c;
  });

  const [texture] = useState(() => new THREE.CanvasTexture(canvas!));

  useEffect(() => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Preenche de preto inicialmente
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [canvas]);

  // Função para atualizar o canvas a cada frame
  const update = (uv: { x: number, y: number } | null) => {
    if (!canvas || !texture) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Efeito "Fade": Desenha um retângulo preto quase transparente
    // Isso faz o rastro branco sumir aos poucos
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // 0.05 define a velocidade de sumir (menor = mais lento)
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Desenha o Pincel Branco se o mouse estiver na tela
    if (uv) {
      const x = uv.x * canvas.width;
      const y = (1 - uv.y) * canvas.height; // Inverte Y porque canvas é top-down

      // Cria um gradiente radial (bola suave)
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 20); // 20 é o tamanho do pincel
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();
    }

    // Avisa o Three.js que a textura mudou
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
  
  // Usa nosso hook customizado
  const { texture: maskTexture, update: updateMask } = useMaskCanvas();
  
  // Referência para guardar a posição do mouse
  const mouseUV = useRef<{x: number, y: number} | null>(null);

  // Carrega imagens
  const [tex1, tex2, disp] = useLoader(THREE.TextureLoader, [
    "/vulp-real.jpg",
    "/vulp-render.jpg",
    "/displacement.jpg"
  ]);

  // Loop de Animação
  useFrame(() => {
    // Atualiza o canvas 2D com a posição atual do mouse
    updateMask(mouseUV.current);
  });

  const handlePointerMove = (e: any) => {
    // Salva a coordenada UV (0 a 1) de onde o mouse tocou
    mouseUV.current = e.uv;
  };

  const handlePointerLeave = () => {
    mouseUV.current = null;
  };

  return (
    <mesh 
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* O plano ocupa a tela toda */}
      <planeGeometry args={[viewport.width, viewport.height]} />
      {/* @ts-ignore */}
      <liquidMaskMaterial
        ref={materialRef}
        uTex1={tex1}
        uTex2={tex2}
        uDisp={disp}
        uMask={maskTexture} // Passamos nosso canvas dinâmico aqui
        uIntensity={0.3}    // Força do efeito líquido
        toneMapped={false}  // Cores reais
      />
    </mesh>
  );
};

// =========================================================
// 4. LAYOUT DA PÁGINA
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
          <Canvas dpr={[1, 2]}>
            <React.Suspense fallback={null}>
              <Scene />
            </React.Suspense>
          </Canvas>
        </div>

        {/* Textos Sobrepostos */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-center px-4 mix-blend-difference">
                <span className="text-purple-300 font-bold tracking-[0.5em] text-xs md:text-sm uppercase mb-6 inline-block animate-pulse border border-purple-500/50 px-3 py-1 rounded-full">
                    Breve Lançamento
                </span>
                <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white drop-shadow-2xl leading-[0.9] mb-6">
                    O FUTURO <br /> JÁ COMEÇOU
                </h1>
                <p className="text-gray-200 text-sm md:text-lg font-medium tracking-wide">
                    Mova o mouse para revelar a transformação
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