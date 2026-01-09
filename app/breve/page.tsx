"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useLoader, extend, useThree, createPortal } from "@react-three/fiber";
import { shaderMaterial, useFBO, OrthographicCamera, Plane } from "@react-three/drei";
import * as THREE from "three";
import { Timer, ArrowDown, Zap } from "lucide-react";

// =========================================================
// 1. SHADER DE SIMULAÇÃO (O Rastro Líquido)
// =========================================================
// Este shader roda num loop invisível. Ele pega o desenho anterior,
// aplica um leve escurecimento (fade) e desenha a nova posição do mouse.
const SimulationMaterial = shaderMaterial(
  {
    uTexture: new THREE.Texture(), // O quadro anterior
    uMouse: new THREE.Vector2(-1, -1), // Posição do mouse (UV)
    uResolution: new THREE.Vector2(0, 0),
    uRadius: 0.08, // Tamanho do pincel
    uDissipation: 0.96, // Velocidade que o rastro some (0.9 a 0.99)
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform sampler2D uTexture;
    uniform vec2 uMouse;
    uniform vec2 uResolution;
    uniform float uRadius;
    uniform float uDissipation;
    varying vec2 vUv;

    void main() {
      // 1. Lê o pixel do frame anterior (o rastro antigo)
      vec4 original = texture2D(uTexture, vUv);
      
      // 2. Calcula a distância deste pixel até o mouse
      // Ajustamos o aspect ratio para o pincel ser redondo e não oval
      vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
      float dist = distance(vUv * aspect, uMouse * aspect);
      
      // 3. Desenha o novo círculo do mouse (Branco puro)
      // smoothstep cria uma borda suave
      float intensity = 1.0 - smoothstep(0.0, uRadius, dist);
      vec4 brush = vec4(vec3(intensity), 1.0);

      // 4. Mistura o rastro antigo (escurecido) com o novo pincel
      // max() garante que o branco do mouse sempre vença o rastro antigo
      vec4 color = original * uDissipation;
      color = max(color, brush);

      gl_FragColor = color;
    }
  `
);

// =========================================================
// 2. SHADER DE REVELAÇÃO (A Mistura Final)
// =========================================================
const LiquidRevealMaterial = shaderMaterial(
  {
    uTex1: new THREE.Texture(), // Obra Real
    uTex2: new THREE.Texture(), // Render 3D
    uDisp: new THREE.Texture(), // Fumaça
    uMask: new THREE.Texture(), // O Resultado da Simulação
    uIntensity: 0.3,
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
      vec2 uv = vUv;
      
      // Lemos o valor da máscara (o rastro líquido)
      float maskVal = texture2D(uMask, uv).r;
      
      // Lemos a distorção (fumaça)
      float dispVal = texture2D(uDisp, uv).r;

      // Calculamos a distorção baseada na máscara
      vec2 distortedUV = uv + vec2(dispVal * maskVal * uIntensity, 0.0);

      vec4 t1 = texture2D(uTex1, uv);
      vec4 t2 = texture2D(uTex2, distortedUV);

      // Mistura final
      gl_FragColor = mix(t1, t2, maskVal);
    }
  `
);

extend({ SimulationMaterial, LiquidRevealMaterial });

// =========================================================
// CENA 3D
// =========================================================
const Scene = () => {
  const { size, gl, viewport } = useThree();
  
  // Refs para os materiais
  const simMatRef = useRef<any>(null);
  const revealMatRef = useRef<any>(null);
  const sceneCameraRef = useRef<any>(null);
  
  // Cria 2 Buffers (FBOs) para fazer o "Ping-Pong"
  // Um lê, o outro escreve, e depois eles trocam.
  const [sceneTarget, setSceneTarget] = useState(
    useFBO(size.width, size.height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType, // Importante para suavidade
    })
  );
  
  const [sceneTarget2, setSceneTarget2] = useState(
    useFBO(size.width, size.height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
    })
  );

  // Cena separada para a simulação
  const bufferScene = useMemo(() => new THREE.Scene(), []);

  // Carrega imagens
  const [tex1, tex2, disp] = useLoader(THREE.TextureLoader, [
    "/vulp-real.jpg",
    "/vulp-render.jpg",
    "/displacement.jpg"
  ]);

  // LOOP DE RENDERIZAÇÃO
  useFrame(({ gl }) => {
    if (!simMatRef.current || !revealMatRef.current || !sceneCameraRef.current) return;

    // 1. Configura a Simulação
    gl.setRenderTarget(sceneTarget);
    gl.render(bufferScene, sceneCameraRef.current);
    
    // 2. Troca os buffers (Ping-Pong)
    // O shader lê a textura 2 e escreve na 1
    simMatRef.current.uTexture = sceneTarget2.texture;
    
    // Limpa o alvo para renderizar na tela
    gl.setRenderTarget(null);

    // 3. Atualiza o material principal com o resultado da simulação
    revealMatRef.current.uMask = sceneTarget.texture;

    // Troca as variáveis de estado para o próximo frame
    const temp = sceneTarget;
    setSceneTarget(sceneTarget2);
    setSceneTarget2(temp);
  });

  // Evento de movimento do mouse (Preciso e Alinhado)
  const handlePointerMove = (e: any) => {
    // e.uv nos dá a coordenada exata (0 a 1) na imagem
    if (simMatRef.current) {
      simMatRef.current.uMouse.set(e.uv.x, e.uv.y);
      simMatRef.current.uResolution.set(size.width, size.height);
    }
  };

  return (
    <>
      {/* CENA DE BUFFER (Invisível, roda a lógica do rastro) */}
      {createPortal(
        <mesh>
          <planeGeometry args={[2, 2]} />
          {/* @ts-ignore */}
          <simulationMaterial
            ref={simMatRef}
            // Passamos texturas vazias inicialmente
            args={[null, new THREE.Vector2(0, 0), new THREE.Vector2(0, 0), 0.1, 0.98]}
          />
        </mesh>,
        bufferScene
      )}
      <OrthographicCamera ref={sceneCameraRef} args={[-1, 1, 1, -1, 0, 1]} />

      {/* CENA PRINCIPAL (Visível) */}
      {/* O plano ocupa a tela toda (viewport) */}
      <mesh onPointerMove={handlePointerMove}>
        <planeGeometry args={[viewport.width, viewport.height]} />
        {/* @ts-ignore */}
        <liquidRevealMaterial
          ref={revealMatRef}
          uTex1={tex1}
          uTex2={tex2}
          uDisp={disp}
          uIntensity={0.2}
          toneMapped={false}
        />
      </mesh>
    </>
  );
};

// =========================================================
// LAYOUT DA PÁGINA
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
      
      <section className="relative h-screen w-full overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <Canvas dpr={[1, 2]}>
            <React.Suspense fallback={null}>
              <Scene />
            </React.Suspense>
          </Canvas>
        </div>

        {/* Interface Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-center px-4 mix-blend-difference">
                <span className="text-purple-300 font-bold tracking-[0.5em] text-xs md:text-sm uppercase mb-6 inline-block animate-pulse border border-purple-500/50 px-3 py-1 rounded-full">
                    Breve Lançamento
                </span>
                <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white drop-shadow-2xl leading-[0.9] mb-6">
                    O FUTURO <br /> JÁ COMEÇOU
                </h1>
                <p className="text-gray-200 text-sm md:text-lg font-medium tracking-wide">
                    Use o cursor para pintar o futuro
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

      {/* Footer / Contagem Regressiva */}
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