"use client";

import { useRef, Suspense, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Float, Environment, Stars, useVideoTexture } from "@react-three/drei";
import * as THREE from "three";

// --- 1. MODELO 3D INTERATIVO ---
function InteractiveModel({ path, scale = 1, rotationSpeed = 0.5 }: { path: string, scale?: number, rotationSpeed?: number }) {
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
    <group>
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
            {hovered && <pointLight distance={5} intensity={5} color="#a855f7" />}
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
    <group ref={ref} position={[0, -8, -35]}>
      <Float speed={1} rotationIntensity={1} floatIntensity={2}>
        <primitive object={scene} scale={0.15} /> 
      </Float>
    </group>
  );
}

// --- 3. CARROSSEL DE VÍDEOS (HÍBRIDO: AUTO + SCROLL) ---
function VideoCard({ url, angle, radius }: { url: string, angle: number, radius: number }) {
  const texture = useVideoTexture(url, { muted: true, loop: true, start: true });
  return (
    <group position={[Math.sin(angle) * radius, 0, Math.cos(angle) * radius]} rotation={[0, angle, 0]}>
      <mesh>
        <planeGeometry args={[2.5, 4.4]} />
        <meshBasicMaterial map={texture} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function PortfolioCylinder() {
  const groupRef = useRef<THREE.Group>(null);
  const radius = 4; 
  
  const baseAngle = useRef(0);
  
  const videos = [
    "/qg mov.mp4",
    "/qg atacadao.mp4",
    "/tss tatoo.mp4",
    "/tss nike.mp4",
    "/prudentte.mp4",
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
    // 👇 AJUSTES AQUI:
    // 1. scale={1.15} -> Aumenta o tamanho geral do carrossel
    // 2. position={[-2.5, 0, 0]} -> Move o carrossel para a ESQUERDA (perto do texto)
    <group ref={groupRef} rotation={[0.05, 0, 0]} scale={1.5} position={[-2.5, 0, 0]}>
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
    scale: 0.018,
  },
  {
    title: "Presencial",
    desc: "Networking olho no olho. A energia da sala de aula te força a evoluir.",
    type: "3d",
    modelPath: "/cadeira.glb", 
    scale: 0.09, 
  },
  {
    title: "Feedback Real",
    desc: "Sem rodeios, direto ao ponto. O mercado não passa a mão na cabeça.",
    type: "3d",
    modelPath: "/comentario.glb", 
    scale: 0.3, 
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
    scale: 0.1, 
  },
  {
    title: "Soft Skills",
    desc: "Aprenda a negociar, a portar-se e a vender o seu valor de verdade.",
    type: "3d",
    modelPath: "/cerebro.glb",
    scale: 3,
  },
];

// --- COMPONENTE PRINCIPAL DO SCROLL ---
export function DiferenciaisScroll() {
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: targetRef });
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", "-600vw"]);

  return (
    <section ref={targetRef} className="relative h-[700vh] bg-[#050505] border-t border-white/5">
      
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        
        {/* FUNDO ESPACIAL */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-[#050505]">
          <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
            <Suspense fallback={null}>
              <Environment preset="city" />
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 20, 10]} intensity={3} color="#ffffff" /> 
              <directionalLight position={[-10, -10, -10]} intensity={1.5} color="#a855f7" /> 
              
              <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
              <MeteorBackground />
            </Suspense>
          </Canvas>
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        </div>

        {/* TRILHA HORIZONTAL */}
        <motion.div style={{ x }} className="flex h-full w-[700vw] relative z-10">
          
          <div className="w-screen h-screen shrink-0 flex flex-col items-center justify-center p-6 text-center">
             <motion.h2 
                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", bounce: 0.5, duration: 1 }}
                viewport={{ once: false }}
                className="text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-none drop-shadow-2xl"
             >
                Por que a <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-400">
                   VULP é diferente?
                </span>
             </motion.h2>
             <motion.p 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 1 }}
                viewport={{ once: false }}
                className="text-xl md:text-3xl text-gray-400 font-medium"
             >
                Esqueça a lousa e o caderno. Continue descendo.
             </motion.p>
          </div>

          {cards.map((card, index) => (
            <div key={index} className="w-screen h-screen shrink-0 flex items-center justify-center p-8 md:p-24">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center w-full max-w-7xl h-full">
                
                <motion.div 
                    initial={{ opacity: 0, x: -100, scale: 0.8 }}
                    whileInView={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ type: "spring", bounce: 0.4, duration: 1.2 }}
                    viewport={{ once: false, margin: "-100px" }}
                    className="flex flex-col justify-center"
                >
                  <h2 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-none drop-shadow-xl">
                    {card.title}
                  </h2>
                  <p className="text-xl md:text-3xl text-gray-400 font-medium max-w-xl">
                    {card.desc}
                  </p>
                </motion.div>

                <div className="h-[55vh] md:h-[75vh] w-full flex items-center justify-center relative">
                  
                  {card.type === "cylinder" && (
                    <div className="absolute inset-0 cursor-ew-resize">
                      {/* 👇 Afastei a câmara para 19 para compensar o aumento do cilindro 👇 */}
                      <Canvas camera={{ position: [0, 0, 19], fov: 45 }}>
                        <Suspense fallback={null}>
                          <ambientLight intensity={1} />
                          <PortfolioCylinder />
                        </Suspense>
                      </Canvas>
                    </div>
                  )}

                  {card.type === "3d" && card.modelPath && (
                    <div className="absolute inset-0">
                      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                        <Suspense fallback={null}>
                          <Environment preset="city" />
                          <ambientLight intensity={1} />
                          <spotLight position={[5, 5, 5]} intensity={2} color="#fff" />
                          <InteractiveModel path={card.modelPath} scale={card.scale} />
                        </Suspense>
                      </Canvas>
                    </div>
                  )}

                </div>

              </div>
            </div>
          ))}

        </motion.div>
      </div>
    </section>
  );
}

useGLTF.preload("/meteoro.glb");
useGLTF.preload("/xadrez.glb");
useGLTF.preload("/cerebro.glb");
useGLTF.preload("/engrenagem.glb");
useGLTF.preload("/comentario.glb");
useGLTF.preload("/cadeira.glb");