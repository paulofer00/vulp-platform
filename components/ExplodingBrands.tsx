"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Float, Environment } from "@react-three/drei";
import * as THREE from "three";
import { motion, useInView } from "framer-motion";

const MODELS = {
  macbook: "/macbook.glb",
  camera: "/camera.glb",
  coin: "/moeda.glb", 
  instagram: "/instagram.glb",
};

Object.values(MODELS).forEach((path) => useGLTF.preload(path));

function Model({ path, startPos, endPos, expanded, scale = 1 }: any) {
  const { scene } = useGLTF(path as string) as any;
  const posRef = useRef<THREE.Group>(null);
  const rotRef = useRef<THREE.Group>(null);

  const [hovered, setHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const previousMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    document.body.style.cursor = hovered ? (isDragging ? "grabbing" : "grab") : "auto";
    return () => { document.body.style.cursor = "auto"; };
  }, [hovered, isDragging]);

  useFrame((state, delta) => {
    if (posRef.current) {
      const targetPos = expanded ? endPos : startPos;
      posRef.current.position.x = THREE.MathUtils.lerp(posRef.current.position.x, targetPos[0], 0.04);
      posRef.current.position.y = THREE.MathUtils.lerp(posRef.current.position.y, targetPos[1], 0.04);
      posRef.current.position.z = THREE.MathUtils.lerp(posRef.current.position.z, targetPos[2], 0.04);
    }

    if (rotRef.current && !isDragging) {
      rotRef.current.rotation.y += delta * 0.2;
      rotRef.current.rotation.x += delta * 0.1;
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
    <group ref={posRef} position={startPos}>
      <Float speed={2} rotationIntensity={0} floatIntensity={1.5}>
        <group
          ref={rotRef}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
          onPointerOut={(e) => { e.stopPropagation(); setHovered(false); setIsDragging(false); }}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerMove={handlePointerMove}
        >
          <primitive object={scene} scale={scale} />
        </group>
      </Float>
    </group>
  );
}

// Recebe isMobile para saber qual tamanho usar!
function Scene({ expanded, isMobile }: { expanded: boolean, isMobile: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, state.pointer.y * 0.15, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.pointer.x * 0.15, 0.05);
    }
  });

  return (
    <group ref={groupRef}>
      <Environment preset="city" />
      <ambientLight intensity={1.5} />
      <spotLight position={[10, 15, 10]} intensity={3} castShadow />
      <spotLight position={[-10, -15, -10]} intensity={1} color="#a855f7" />

      {/* 👇 A MAGIA AQUI: Operador ternário (isMobile ? valorMobile : valorPC) 👇 */}
      <Model 
        path={MODELS.macbook} 
        startPos={[-1, 0, 0]} 
        endPos={isMobile ? [-2.9, 1.4, -1] : [-4.0, 1.8, -1]} 
        expanded={expanded} 
        scale={isMobile ? 0.04 : 0.06} 
      />
      <Model 
        path={MODELS.camera} 
        startPos={[-0.3, 0, 0]} 
        endPos={isMobile ? [3.0, 1.4, -1] : [4.0, 1.8, -1]} 
        expanded={expanded} 
        scale={isMobile ? 0.2 : 0.3} 
      />
      <Model 
        path={MODELS.coin} 
        startPos={[0.3, 0, 0]} 
        endPos={isMobile ? [-2.7, -1.5, 0] : [-3.8, -2.0, 0]} 
        expanded={expanded} 
        scale={isMobile ? 0.5 : 0.8} 
      />
      <Model 
        path={MODELS.instagram} 
        startPos={[1, 0, 0]} 
        endPos={isMobile ? [2.7, -1.5, 0] : [3.8, -2.0, 0]} 
        expanded={expanded} 
        scale={isMobile ? 0.7 : 1} 
      />
    </group>
  );
}

export function ExplodingBrands() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.4 });
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detetor de Telemóvel Inteligente
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Checa na primeira vez que abre
    window.addEventListener("resize", handleResize); // Fica a ouvir caso o utilizador gire a tela
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setExpanded(true), 300);
      return () => clearTimeout(timer);
    } else {
      setExpanded(false);
    }
  }, [isInView]);

  return (
    <section ref={containerRef} className="relative h-[80vh] min-h-[600px] w-full bg-[#050505] flex items-center justify-center overflow-hidden border-t border-white/5">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] max-w-full h-[500px] bg-purple-900/20 blur-[150px] rounded-full pointer-events-none" />

      <div className="absolute z-30 text-center pointer-events-none flex flex-col items-center justify-center w-full">
        <motion.h2
          initial={{ scale: 0.3, opacity: 0, filter: "blur(10px)" }}
          animate={expanded ? { scale: 1, opacity: 1, filter: "blur(0px)" } : { scale: 0.3, opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
          className="text-7xl md:text-[10rem] font-black leading-[0.9] tracking-tighter drop-shadow-2xl pointer-events-none"
        >
          PRA QUEM É<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-500 pointer-events-none pr-4 pb-2">
            A VULP?
          </span>
        </motion.h2>
      </div>

      <div className="absolute inset-0 z-10 touch-pan-y">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={[1, 2]}>
          <Suspense fallback={null}>
            {/* Passamos a informação para dentro da cena! */}
            <Scene expanded={expanded} isMobile={isMobile} />
          </Suspense>
        </Canvas>
      </div>

    </section>
  );
}