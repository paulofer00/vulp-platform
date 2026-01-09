"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useLoader, extend, useThree } from "@react-three/fiber";
import { shaderMaterial, useFBO, OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";
import { Timer, ArrowDown, Zap } from "lucide-react";

// ==========================================
// SHADER 1: O PINCEL (Brush Material)
// Desenha o círculo branco do mouse
// ==========================================
const BrushMaterial = shaderMaterial(
  {
    uCenter: new THREE.Vector2(0.5, 0.5),
    uRadius: 0.1,
    uStrength: 1.0,
  },
  `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  `
    uniform vec2 uCenter;
    uniform float uRadius;
    uniform float uStrength;
    varying vec2 vUv;

    void main() {
      float dist = distance(vUv, uCenter);
      // Cria um círculo suave
      float alpha = smoothstep(uRadius, uRadius * 0.5, dist);
      gl_FragColor = vec4(1.0, 1.0, 1.0, alpha * uStrength);
    }
  `
);

// ==========================================
// SHADER 2: A REVELAÇÃO (Reveal Material)
// Usa o rastro para misturar as imagens
// ==========================================
const RevealMaterial = shaderMaterial(
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
      vec2 uv = vUv;
      
      // Lê o rastro do mouse (Máscara)
      float maskVal = texture2D(uMask, uv).r;
      
      // Lê a distorção (Fumaça)
      float dispVal = texture2D(uDisp, uv).r;

      // Calcula a distorção: só distorce onde o mouse passou
      vec2 distortedUV = uv + vec2(dispVal * maskVal * uIntensity, 0.0);

      vec4 t1 = texture2D(uTex1, uv); // Passado
      vec4 t2 = texture2D(uTex2, distortedUV); // Futuro (Distorcido)

      // Mistura final
      gl_FragColor = mix(t1, t2, maskVal);
    }
  `
);

extend({ BrushMaterial, RevealMaterial });

// ==========================================
// CENA 3D
// ==========================================
const Scene = () => {
  const { size, viewport, gl, mouse } = useThree();
  
  // Refs para os materiais
  const brushMatRef = useRef<any>(null);
  const revealMatRef = useRef<any>(null);
  
  // Câmera e Cena exclusivas para o Rastro (FBO)
  const fboCameraRef = useRef<THREE.OrthographicCamera>(null);
  const fboScene = useMemo(() => {
    const scene = new THREE.Scene();
    return scene;
  }, []);

  // Criação dos objetos da cena do rastro (manualmente para garantir ordem)
  const fboMeshes = useMemo(() => {
    // 1. O "Apagador" (Fade): Um plano preto quase transparente que cobre tudo
    const fadePlane = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.05 })
    );
    
    // 2. O Pincel: O plano que segue o mouse
    const brushPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      // @ts-ignore
      new THREE.ShaderMaterial({
        uniforms: {
          uCenter: { value: new THREE.Vector2(0.5, 0.5) },
          uRadius: { value: 0.1 },
          uStrength: { value: 1.0 }
        },
        vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `
          uniform vec2 uCenter;
          uniform float uRadius;
          uniform float uStrength;
          varying vec2 vUv;
          void main() {
            float dist = distance(vUv, uCenter);
            float alpha = smoothstep(uRadius, uRadius * 0.5, dist);
            gl_FragColor = vec4(1.0, 1.0, 1.0, alpha * uStrength);
          }
        `,
        transparent: true,
      })
    );
    // Coloca o pincel um pouquinho na frente do fundo preto
    brushPlane.position.z = 0.1;

    return { fadePlane, brushPlane };
  }, []);

  // Adiciona os objetos na cena FBO uma única vez
  useEffect(() => {
    fboScene.add(fboMeshes.fadePlane);
    fboScene.add(fboMeshes.brushPlane);
  }, [fboScene, fboMeshes]);

  // Buffer (Tela Invisível)
  const renderTarget = useFBO(size.width, size.height, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
  });

  // Carrega Texturas
  const [tex1, tex2, disp] = useLoader(THREE.TextureLoader, [
    "/vulp-real.jpg",
    "/vulp-render.jpg",
    "/displacement.jpg"
  ]);

  // Configura repetição para evitar glitch nas bordas
  [tex1, tex2, disp].forEach(t => {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
  });

  // LOOP DE RENDERIZAÇÃO
  useFrame((state) => {
    if (!fboCameraRef.current || !revealMatRef.current) return;

    // 1. Atualiza posição do mouse no shader do pincel
    // Converte coordenadas de (-1 a 1) para (0 a 1)
    const uvX = (state.mouse.x + 1) / 2;
    const uvY = (state.mouse.y + 1) / 2;
    
    // Atualiza o uniforme do shader manual que criamos no useMemo
    fboMeshes.brushPlane.material.uniforms.uCenter.value.set(uvX, uvY);

    // 2. Renderiza o rastro na tela invisível (FBO)
    // TRUQUE: Desligamos o autoClear para o rastro acumular
    const originalAutoClear = gl.autoClear;
    gl.autoClear = false;
    
    gl.setRenderTarget(renderTarget);
    gl.render(fboScene, fboCameraRef.current);
    
    gl.setRenderTarget(null);
    gl.autoClear = originalAutoClear; // Restaura para a cena principal

    // 3. Passa a textura do rastro para o material principal
    revealMatRef.current.uMask = renderTarget.texture;
  });

  return (
    <>
      {/* Câmera Invisível para o FBO */}
      <OrthographicCamera ref={fboCameraRef} args={[-1, 1, 1, -1, 0, 1]} position={[0, 0, 10]} />

      {/* Tela Principal */}
      <mesh>
        <planeGeometry args={[viewport.width, viewport.height]} />
        {/* @ts-ignore */}
        <revealMaterial
          ref={revealMatRef}
          uTex1={tex1}
          uTex2={tex2}
          uDisp={disp}
          uIntensity={0.3}
          toneMapped={false}
        />
      </mesh>
    </>
  );
};

// ==========================================
// COMPONENTE DA PÁGINA
// ==========================================
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
                    Use o cursor para revelar a transformação
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