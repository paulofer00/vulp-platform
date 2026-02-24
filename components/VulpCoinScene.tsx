"use client";

import { useRef, Suspense, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, useGLTF, ContactShadows, useCursor } from "@react-three/drei";
import * as THREE from "three";

// 👇 COLOCA AQUI O NOME EXATO DO TEU FICHEIRO .glb QUE ESTÁ NA PASTA PUBLIC 👇
// Exemplo: se o ficheiro for "minha-moeda.glb", deixa '/minha-moeda.glb'
const NOME_DO_FICHEIRO = '/moeda-vulp.glb';

// Esta linha faz com que o modelo carregue mais rápido (pré-carregamento)
useGLTF.preload(NOME_DO_FICHEIRO);

// --- 1. CARREGAMENTO DO MODELO 3D REAL ---
function GlbCoinModel() {
  const coinRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(NOME_DO_FICHEIRO);
  
  // Estado para saber se o rato está por cima da moeda
  const [hovered, setHovered] = useState(false);
  
  // Muda o cursor automaticamente para a "mãozinha" de clicar
  useCursor(hovered); 
  
  // Variável para guardar a velocidade atual da rotação
  const currentSpeed = useRef(0.005);

  useFrame((state) => {
    if (coinRef.current) {
      // O SEGREDO DA FÍSICA AQUI:
      // Se tiver o rato por cima, a velocidade alvo é alta (0.1). Se não, é lenta (0.005).
      const targetSpeed = hovered ? 0.08 : 0.005;
      
      // O Lerp faz a transição suave entre a velocidade atual e a velocidade alvo (acelera/trava aos poucos)
      currentSpeed.current = THREE.MathUtils.lerp(currentSpeed.current, targetSpeed, 0.05);
      
      // Aplica a velocidade à rotação
      coinRef.current.rotation.y += currentSpeed.current;
      
      // Efeito magnético suave (inclina a moeda na direção do rato)
      coinRef.current.rotation.x = THREE.MathUtils.lerp(coinRef.current.rotation.x, state.pointer.y * 0.3, 0.05);
      coinRef.current.rotation.z = THREE.MathUtils.lerp(coinRef.current.rotation.z, -state.pointer.x * 0.3, 0.05);
    }
  });

  return (
    <group 
      ref={coinRef}
      // Deteta quando o rato entra e sai de cima do modelo 3D
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
      // BÓNUS: Se clicar na moeda, ela leva um "empurrão" e gira super rápido!
      onClick={() => { currentSpeed.current = 0.5; }}
    >
      <primitive object={scene} scale={2} /> 
    </group>
  );
}

// --- 2. A CENA FINAL COM LUZES DE ESTÚDIO ---
export default function VulpCoinScene() {
  return (
    <div className="w-full h-full relative pointer-events-auto cursor-grab active:cursor-grabbing">
      <Suspense fallback={null}>
        <Canvas shadows camera={{ position: [0, 0, 10], fov: 30 }} gl={{ preserveDrawingBuffer: true }}>
          
          {/* Ambiente invisível que cria reflexos realistas no metal da tua moeda */}
          <Environment preset="city" />

          {/* Luzes de Estúdio para destacar o Ouro */}
          <ambientLight intensity={1.5} />
          
          {/* Luz principal a bater de cima */}
          <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={3} castShadow color="#FFFACD" />
          
          {/* Luz de preenchimento vinda de baixo para não deixar sombras 100% pretas */}
          <spotLight position={[-10, -10, -5]} angle={0.5} penumbra={1} intensity={2} color="#FFD700" /> 

          {/* O Float faz a moeda "respirar" como se estivesse a flutuar no espaço */}
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <GlbCoinModel />
          </Float>

          {/* Sombra projetada "no chão" para dar ainda mais profundidade */}
          <ContactShadows position={[0, -2.5, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="#000000" />

        </Canvas>
      </Suspense>
    </div>
  );
}