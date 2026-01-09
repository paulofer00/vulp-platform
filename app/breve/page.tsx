"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useLoader, extend, useThree } from "@react-three/fiber";
import { shaderMaterial, useFBO, OrthographicCamera, Plane } from "@react-three/drei";
import * as THREE from "three";
import { Timer, ArrowDown, Zap } from "lucide-react";

// ==========================================
// SHADER 1: O PINCEL (Brush Material)
// Cria uma bola branca suave onde o mouse passa
// ==========================================
const BrushMaterial = shaderMaterial(
  {
    uCenter: new THREE.Vector2(0.5, 0.5), // Posição do mouse
    uRadius: 0.1, // Tamanho do pincel
    uStrength: 0.5, // Intensidade
  },
  // Vertex Shader (Padrão)
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader (Cria o gradiente radial branco)
  `
    uniform vec2 uCenter;
    uniform float uRadius;
    uniform float uStrength;
    varying vec2 vUv;

    void main() {
      // Calcula a distância do pixel atual até o centro do mouse
      float dist = distance(vUv, uCenter);
      // Cria um círculo suave: 1 no centro, 0 na borda
      float alpha = smoothstep(uRadius, uRadius * 0.2, dist);
      // Cor final: branco com a transparência calculada
      gl_FragColor = vec4(vec3(1.0), alpha * uStrength);
    }
  `
);

// ==========================================
// SHADER 2: A REVELAÇÃO LÍQUIDA (Reveal Material)
// Usa o rastro do pincel para misturar as imagens
// ==========================================
const RevealMaterial = shaderMaterial(
  {
    uTex1: new THREE.Texture(), // Imagem Passado
    uTex2: new THREE.Texture(), // Imagem Futuro
    uDisp: new THREE.Texture(), // Textura de Fumaça (Displacement)
    uMask: new THREE.Texture(), // O Rastro do Mouse (FBO)
    uIntensity: 0.3, // Intensidade da distorção
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader (A mágica acontece aqui)
  `
    uniform sampler2D uTex1;
    uniform sampler2D uTex2;
    uniform sampler2D uDisp;
    uniform sampler2D uMask;
    uniform float uIntensity;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      
      // 1. Ler o rastro do mouse (quão branco está este pixel?)
      float maskValue = texture2D(uMask, uv).r;
      
      // 2. Ler a textura de fumaça para distorção
      float dispFactor = texture2D(uDisp, uv).r;

      // 3. Calcular a distorção baseada no rastro e na fumaça
      // A distorção só acontece onde o 'maskValue' é alto
      vec2 distortedUV = uv + vec2(dispFactor * maskValue * uIntensity, 0.0);

      // 4. Pegar as cores das duas imagens (a segunda já distorcida)
      vec4 tex1 = texture2D(uTex1, uv);
      vec4 tex2 = texture2D(uTex2, distortedUV);

      // 5. Misturar as duas imagens baseado no rastro (maskValue)
      // Se maskValue é 1 (mouse passou), mostra tex2. Se 0, tex1.
      gl_FragColor = mix(tex1, tex2, maskValue);
    }
  `
);

// Registrar os materiais no React Three Fiber
extend({ BrushMaterial, RevealMaterial });

// ==========================================
// COMPONENTE DA CENA 3D
// ==========================================
const Scene = () => {
  const { size, viewport } = useThree();
  const brushMeshRef = useRef<any>(null);
  const revealMeshRef = useRef<any>(null);
  
  // --- CONFIGURAÇÃO DO FBO (A tela invisível para o rastro) ---
  // Criamos um buffer com o dobro do tamanho da tela para nitidez
  const renderTarget = useFBO(size.width * 2, size.height * 2, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    stencilBuffer: false,
    depthBuffer: false,
  });

  // Uma câmera separada só para renderizar o pincel na tela invisível
  const fboCameraRef = useRef<THREE.OrthographicCamera>(null);
  // Uma cena separada só para os objetos do rastro
  const fboScene = useMemo(() => new THREE.Scene(), []);

  // Carrega as texturas
  const [tex1, tex2, disp] = useLoader(THREE.TextureLoader, [
    "/vulp-real.jpg",
    "/vulp-render.jpg",
    "/displacement.jpg"
  ]);

  // Configura as texturas para repetir (melhora o efeito líquido)
  [tex1, tex2, disp].forEach(t => {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
  });

  // --- O LOOP DE RENDERIZAÇÃO (Roda a cada frame) ---
  useFrame(({ gl, mouse }) => {
    if (!brushMeshRef.current || !fboCameraRef.current || !revealMeshRef.current) return;

    // --- PASSO 1: Atualizar a posição do pincel ---
    // Converte a posição do mouse (-1 a 1) para UV (0 a 1)
    const currentMouseUV = new THREE.Vector2(
      (mouse.x + 1) / 2,
      (mouse.y + 1) / 2
    );
    brushMeshRef.current.material.uniforms.uCenter.value.lerp(currentMouseUV, 0.2); // Movimento suave

    // --- PASSO 2: Renderizar o rastro na tela invisível (FBO) ---
    gl.setRenderTarget(renderTarget);
    // NÃO limpamos o buffer antigo. Em vez disso, desenhamos um quadrado preto
    // semi-transparente por cima de tudo para fazer o rastro sumir aos poucos.
    // Isso é o que cria o efeito de "secar" o líquido.
    gl.render(fboScene, fboCameraRef.current); 
    
    // --- PASSO 3: Voltar para a tela principal ---
    gl.setRenderTarget(null);
    // Passar a textura do rastro (FBO) para o shader principal
    revealMeshRef.current.material.uniforms.uMask.value = renderTarget.texture;
  });

  // Função para capturar o movimento do mouse sobre o plano 3D
  const handlePointerMove = (e: any) => {
    // 'e.uv' nos dá a coordenada exata onde o mouse tocou na imagem (de 0 a 1)
    if (brushMeshRef.current) {
      // Atualizamos o alvo do pincel instantaneamente para onde o mouse está
      brushMeshRef.current.material.uniforms.uCenter.value.copy(e.uv);
    }
  };

  return (
    <>
      {/* --- CENA INVISÍVEL (FBO) --- */}
      {/* Esta câmera e objetos não aparecem na tela principal */}
      <OrthographicCamera ref={fboCameraRef} args={[-1, 1, 1, -1, 0, 1]} />
      {createPortal(
        <mesh>
           <planeGeometry args={[2, 2]} />
           {/* O "Desvanecedor": um plano preto 95% transparente que roda todo frame */}
           <meshBasicMaterial color="black" transparent opacity={0.05} />
           {/* O Pincel: a bola branca que segue o mouse */}
           <mesh ref={brushMeshRef} position={[0, 0, 0.01]}>
             <planeGeometry args={[2, 2]} />
             {/* @ts-ignore */}
             <brushMaterial uRadius={0.15} uStrength={1.0} transparent />
           </mesh>
        </mesh>,
        fboScene
      )}

      {/* --- CENA PRINCIPAL (Visível) --- */}
      <mesh ref={revealMeshRef} onPointerMove={handlePointerMove}>
        {/* Plano que ocupa a tela toda */}
        <planeGeometry args={[viewport.width, viewport.height]} />
        {/* O Material que mistura tudo */}
        {/* @ts-ignore */}
        <revealMaterial
          uTex1={tex1}
          uTex2={tex2}
          uDisp={disp}
          // uMask será preenchido pelo FBO no useFrame
          uIntensity={0.3}
          toneMapped={false}
        />
      </mesh>
    </>
  );
};

// Helper do R3F para renderizar em outra cena
import { createPortal } from "@react-three/fiber";


// ==========================================
// O COMPONENTE DA PÁGINA (Layout HTML)
// ==========================================
const VulpLiquidPage = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Contador (Lógica mantida)
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
      <section className="relative h-screen w-full overflow-hidden bg-black">
        {/* O Canvas 3D */}
        <div className="absolute inset-0 z-0 cursor-crosshair">
          {/* dpr={Math.min(window.devicePixelRatio, 2)} ajuda na performance em telas retina */}
          <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 2]}>
            <React.Suspense fallback={null}>
              <Scene />
            </React.Suspense>
          </Canvas>
        </div>

        {/* Interface Sobreposta (Pointer events none para o mouse passar pro Canvas) */}
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