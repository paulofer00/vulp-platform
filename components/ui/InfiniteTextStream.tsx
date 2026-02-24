"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const items = [
  "Ambiente de mercado real",
  "Dinâmica 100% prática",
  "Mentores que vivem o campo de batalha",
  "Networking com quem contrata",
  "Hard Skills técnicas",
  "Soft Skills de negociação",
  "Pressão e feedback real",
  "Entrega de resultado",
];

// Repetimos os itens para garantir que o loop seja suave sem buracos
const repeatedItems = [...items, ...items, ...items];

export function InfiniteTextStream() {
  return (
    <div className="relative w-full overflow-hidden py-10 bg-[#0A0A0A]/50 border-y border-purple-500/20 backdrop-blur-sm">
      {/* Degradê nas pontas para suavizar a entrada e saída */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10" />
      
      <div className="flex">
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-50%" }} // Move metade do caminho (já que duplicamos o conteúdo visualmente)
          transition={{
            duration: 30, // Ajuste a velocidade aqui (menor = mais rápido)
            ease: "linear",
            repeat: Infinity,
          }}
          className="flex flex-nowrap gap-12 px-6"
        >
          {repeatedItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 shrink-0">
               <CheckCircle2 className="text-purple-500 h-6 w-6" />
               <span className="text-xl md:text-2xl font-bold text-gray-200 uppercase tracking-tight whitespace-nowrap">
                  {item}
               </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}