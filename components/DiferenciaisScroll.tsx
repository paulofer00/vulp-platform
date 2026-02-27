"use client";

import { useRef, Suspense, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Float, Stars, useVideoTexture } from "@react-three/drei";
import * as THREE from "three";

// --- 1. MODELO 3D INTERATIVO (OTIMIZADO PARA MOBILE) ---
function InteractiveModel({ path, scale = 1, rotationSpeed = 0.5, position = [0, 0.5, 0] }: { path: string, scale?: number, rotationSpeed?: number, position?: [number, number, number] }) {
  const { scene } = useGLTF(path as string) as any;
  const rotRef = useRef<THREE.Group>(null);
  const scaleRef = useRef<THREE.Group>(null);
  
  const [hovered, setHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const previousMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    document.body.style.cursor = hovered ? (isDragging ? "grabbing" : "grab") : "auto";
    return () => { document.body.style.cursor = "auto"; };
  }, [hovered, isDragging]);

  useFrame((state, delta) => {
    if (rotRef.current && !isDragging) {
      rotRef.current.rotation.y += delta * rotationSpeed;
    }
    if (scaleRef.current) {
      const targetScale = hovered ? scale * 1.15 : scale;
      scaleRef.current.scale.setScalar(THREE.MathUtils.lerp(scaleRef.current.scale.x, targetScale, 0.1));
    }
  });

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    e.target.setPointerCapture(e.pointerId);
    setIsDragging(true);
    previousMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: any) => {
    e.stopPropagation();
    e.target.releasePointerCapture(e.pointerId);
    setIsDragging(false);
  };

  const handlePointerMove = (e: any) => {
    if (isDragging && rotRef.current) {
      e.stopPropagation();
      const deltaX = e.clientX - previousMouse.current.x;
      const deltaY = e.clientY - previousMouse.current.y;
      rotRef.current.rotation.y += deltaX / 80;
      rotRef.current.rotation.x += deltaY / 80;
      previousMouse.current = { x: e.clientX, y: e.clientY };
    }
  };

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0} floatIntensity={1.5}>
        <group ref={scaleRef} scale={scale}>
          <group
            ref={rotRef}
            onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
            onPointerOut={(e) => { e.stopPropagation(); setHovered(false); setIsDragging(false); }}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
            onPointerMissed={() => setIsDragging(false)}
          >
            {/* OTIMIZAÇÃO: Luz de interação muito mais leve */}
            {hovered && <pointLight distance={3} intensity={3} color="#a855f7" />}
            <primitive object={scene} />
          </group>
        </group>
      </Float>
    </group>
  );
}

// --- 2. FUNDO COM METEOROS ---
function MeteorBackground() {
  const { scene } = useGLTF("/meteoro.glb" as string) as any;
  const ref = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.05;
      ref.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <group ref={ref} position={[15, 10, -60]}>
      <Float speed={1} rotationIntensity={1} floatIntensity={2}>
        <primitive object={scene} scale={0.05} /> 
      </Float>
    </group>
  );
}

// --- 3. CARROSSEL DE VÍDEOS (OTIMIZADO - APENAS 5 VÍDEOS) ---
function VideoCard({ url, angle, radius }: { url: string, angle: number, radius: number }) {
  const texture = useVideoTexture(url, { muted: true, loop: true, start: true });
  return (
    <group position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]} rotation={[0, angle, 0]}>
      <mesh>
        <planeGeometry args={[2.5, 4.4]} />
        <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} color="#ffffff" />
      </mesh>
    </group>
  );
}

function PortfolioCylinder() {
  const groupRef = useRef<THREE.Group>(null);
  const radius = 3.5; // OTIMIZAÇÃO: Raio menor para caberem 5 vídeos perfeitamente
  
  const baseAngle = useRef(0);
  
  // OTIMIZAÇÃO EXTREMA: Cortei os vídeos duplicados. O telemóvel não aguenta 10 decodificadores mp4 simultâneos.
  const videos = [
    "/qg mov.mp4",
    "/qg atacadao.mp4",
    "/tss tatoo.mp4",
    "/tss nike.mp4",
    "/prudentte.mp4",
  ];

  useFrame((state, delta) => {
    if (groupRef.current) {
      baseAngle.current += delta * 0.15; 
      const scrollRotation = window.scrollY * 0.0025; 
      const targetRotation = baseAngle.current + scrollRotation;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotation, 0.1);
    }
  });

  return (
    <group ref={groupRef} position={[0, 1.5, 0]} rotation={[0.05, 0, 0]} scale={0.8}>
      {videos.map((url, i) => {
         const angle = (i / videos.length) * Math.PI * 2;
         return <VideoCard key={i} url={url} angle={angle} radius={radius} />;
      })}
    </group>
  );
}

// --- 4. DADOS DAS SEÇÕES ---
const cards = [
  {
    title: "80% Prática",
    desc: "Menos teoria, mais execução. Você não vai só ouvir, você vai fazer.",
    type: "3d",
    modelPath: "/engrenagem.glb",
    scale: 0.015, 
    posY: 0.5,
  },
  {
    title: "Presencial",
    desc: "Networking olho no olho. A energia da sala de aula te força a evoluir.",
    type: "3d",
    modelPath: "/fachada.glb", 
    scale: 1, 
    posY: 0.5,
  },
  {
    title: "Feedback Real",
    desc: "Sem rodeios, direto ao ponto. O mercado não passa a mão na cabeça.",
    type: "3d",
    modelPath: "/comentario.glb", 
    scale: 0.35, 
    posY: 0.5,
  },
  {
    title: "Portfólio",
    desc: "Saia com projetos reais prontos para apresentar aos grandes tubarões.",
    type: "cylinder",
  },
  {
    title: "Networking Elite",
    desc: "Conecte-se com empresários que já estão no topo e que contratam.",
    type: "3d",
    modelPath: "/xadrez.glb",
    scale: 0.15, 
    posY: 0.5,
  },
  {
    title: "Soft Skills",
    desc: "Aprenda a negociar, a portar-se e a vender o seu valor de verdade.",
    type: "3d",
    modelPath: "/cerebro.glb",
    scale: 2.5, 
    posY: 0.5,
  },
];

// --- COMPONENTE PRINCIPAL DO SCROLL ---
export function DiferenciaisScroll() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", "-600vw"]);

  return (
    <section ref={targetRef} className="relative h-[600vh] bg-[#050505] border-t border-white/5">
      
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        
        {/* FUNDO ESPACIAL (OTIMIZADO) */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-[#050505]">
          {/* OTIMIZAÇÃO: dpr={1} salva a bateria e o framerate no mobile */}
          <Canvas camera={{ position: [0, 0, 10], fov: 50 }} dpr={1}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 20, 10]} intensity={3} color="#ffffff" /> 
              <directionalLight position={[-10, -10, -10]} intensity={1.5} color="#a855f7" /> 
              
              {/* OTIMIZAÇÃO: Estrelas reduzidas de 5000 para 1500 */}
              <Stars radius={100} depth={50} count={1500} factor={4} saturation={0} fade speed={1} />
              <MeteorBackground />
            </Suspense>
          </Canvas>
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        </div>

        {/* TRILHA HORIZONTAL */}
        <motion.div style={{ x }} className="flex h-full w-[700vw] relative z-10 touch-pan-y">
          
          <div className="w-screen h-screen shrink-0 flex flex-col items-center justify-center p-6 text-center">
             <motion.h2 
                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0.5, duration: 1 }}
                viewport={{ once: false }}
                className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-none drop-shadow-2xl"
             >
                Por que a <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-400 pr-4 pb-2">
                   VULP é diferente?
                </span>
             </motion.h2>
             <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 1 }}
                viewport={{ once: false }}
                className="text-2xl md:text-4xl text-purple-400 font-bold"
             >
                Esqueça a lousa e o caderno. Continue descendo.
             </motion.p>
          </div>

          {cards.map((card, index) => (
            <div key={index} className="w-screen h-screen shrink-0 flex items-center justify-center relative overflow-hidden">
              
              <div className="absolute inset-0 w-full h-full flex items-center justify-center z-0">
                  {card.type === "cylinder" && (
                    <div className="absolute inset-0 cursor-ew-resize">
                      {/* OTIMIZAÇÃO: dpr={1} */}
                      <Canvas camera={{ position: [0, 0, 16], fov: 45 }} dpr={1}>
                        <Suspense fallback={null}>
                          <ambientLight intensity={1} />
                          <PortfolioCylinder />
                        </Suspense>
                      </Canvas>
                    </div>
                  )}

                  {card.type === "3d" && card.modelPath && (
                    <div className="absolute inset-0">
                      {/* OTIMIZAÇÃO: dpr={1} e iluminação estática leve em vez de HDRI (Environment) */}
                      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={1}>
                        <Suspense fallback={null}>
                          <ambientLight intensity={2.5} />
                          <directionalLight position={[10, 10, 5]} intensity={2} color="#ffffff" />
                          <spotLight position={[-5, 5, 5]} intensity={2} color="#a855f7" />
                          <InteractiveModel path={card.modelPath} scale={card.scale} position={[0, card.posY ?? 0.5, 0]} />
                        </Suspense>
                      </Canvas>
                    </div>
                  )}
              </div>

              <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", bounce: 0.4, duration: 1.2 }}
                  viewport={{ once: false, margin: "-100px" }}
                  className="relative z-10 flex flex-col items-center justify-center text-center p-6 mt-48 pointer-events-none"
              >
                <h2 className="text-6xl md:text-9xl font-black mb-2 tracking-tighter leading-none text-white [text-shadow:_0_10px_40px_rgb(0_0_0_/_100%)]">
                  {card.title}
                </h2>
                <p className="text-2xl md:text-4xl text-purple-400 font-bold max-w-3xl [text-shadow:_0_5px_20px_rgb(0_0_0_/_100%)]">
                  {card.desc}
                </p>
              </motion.div>

            </div>
          ))}

        </motion.div>
      </div>
    </section>
  );
}

// Preload mantém o site rápido nas trocas de tela
useGLTF.preload("/meteoro.glb");
useGLTF.preload("/xadrez.glb");
useGLTF.preload("/cerebro.glb");
useGLTF.preload("/engrenagem.glb");
useGLTF.preload("/comentario.glb");
useGLTF.preload("/fachada.glb");