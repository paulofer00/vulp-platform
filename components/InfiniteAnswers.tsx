"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const answers = [
  "É pra quem busca mercado.",
  "É pra quem quer formação prática.",
  "É pra quem quer desenvolver hard skills e soft skills com direção.",
  "É pra quem valoriza networking, portfólio e crescimento consistente.",
  "É pra quem entende que evolução exige movimento.",
];

const repeatedAnswers = [...answers, ...answers, ...answers]; // Duplicado para loop perfeito

export function InfiniteAnswers() {
  return (
    <div className="relative w-full overflow-hidden py-10 bg-[#0A0A0A] border-y border-white/10">
      {/* Sombras nas laterais para suavizar o texto entrando e saindo */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0A0A0A] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10 pointer-events-none" />
      
      <div className="flex">
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{ duration: 40, ease: "linear", repeat: Infinity }}
          className="flex flex-nowrap gap-16 px-6"
        >
          {repeatedAnswers.map((text, idx) => (
            <div key={idx} className="flex items-center gap-3 shrink-0 group">
               <CheckCircle2 className="text-purple-600 h-6 w-6 group-hover:scale-125 transition-transform" />
               <span className="text-2xl font-bold text-gray-300 uppercase tracking-tight whitespace-nowrap group-hover:text-white transition-colors">
                  {text}
               </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}