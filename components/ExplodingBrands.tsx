"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Float, Environment } from "@react-three/drei";
import * as THREE from "three";
import { motion, useInView } from "framer-motion";

// 👇 OS NOMES DOS SEUS ARQUIVOS .GLB 👇
const MODELS = {
  macbook: "/macbook.glb",
  camera: "/camera.glb",
  coin: "/moeda.glb", 
  instagram: "/instagram.glb",
};

Object.values(MODELS).forEach((path) => useGLTF.preload(path));

// --- COMPONENTE DE CADA MODELO 3D (BLINDADO CONTRA TRAVADAS) ---
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
    // 👇 A MÁGICA: O navegador "prende" o foco neste objeto até você soltar o dedo! 👇
    e.target.setPointerCapture(e.pointerId);
    setIsDragging(true);
    previousMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: any) => {
    e.stopPropagation();
    // Solta o objeto quando levantar o dedo/rato
    e.target.releasePointerCapture(e.pointerId);
    setIsDragging(false);
  };

  const handlePointerMove = (e: any) => {
    if (isDragging && rotRef.current) {
      e.stopPropagation();
      const deltaX = e.clientX - previousMouse.current.x;
      const deltaY = e.clientY - previousMouse.current.y;

      // Dividimos por 80 (antes era 50) para deixar a rotação mais macia e controlada
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
          onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
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

// --- CENA 3D PRINCIPAL ---
function Scene({ expanded }: { expanded: boolean }) {
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

      <Model path={MODELS.macbook} startPos={[-1, 0, 0]} endPos={[-2.8, 1.2, -1]} expanded={expanded} scale={0.06} />
      <Model path={MODELS.camera} startPos={[-0.3, 0, 0]} endPos={[2.8, 1.2, -1]} expanded={expanded} scale={0.3} />
      <Model path={MODELS.coin} startPos={[0.3, 0, 0]} endPos={[-2.5, -1.2, 0]} expanded={expanded} scale={0.8} />
      <Model path={MODELS.instagram} startPos={[1, 0, 0]} endPos={[2.5, -1.2, 0]} expanded={expanded} scale={1} />
    </group>
  );
}

// --- COMPONENTE FINAL EXPORTADO ---
export function ExplodingBrands() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.4 });
  const [expanded, setExpanded] = useState(false);

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
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/20 blur-[150px] rounded-full pointer-events-none" />

      {/* REFORÇO NO TEXTO: O texto inteiro agota tem pointer-events-none cravado! */}
      <div className="absolute z-30 text-center pointer-events-none flex flex-col items-center justify-center w-full">
        <motion.h2
          initial={{ scale: 0.3, opacity: 0, filter: "blur(10px)" }}
          animate={expanded ? { scale: 1, opacity: 1, filter: "blur(0px)" } : { scale: 0.3, opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
          className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter drop-shadow-2xl pointer-events-none"
        >
          PRA QUEM É<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-500 pointer-events-none pr-2 pb-2">
            A VULP?
          </span>
        </motion.h2>
      </div>

      <div className="absolute inset-0 z-10">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <Suspense fallback={null}>
            <Scene expanded={expanded} />
          </Suspense>
        </Canvas>
      </div>

    </section>
  );
}