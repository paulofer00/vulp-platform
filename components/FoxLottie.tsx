"use client";

import Lottie from "lottie-react";
import foxAnimationData from "@/assets/raposa-animada.json";

export default function FoxLottie() {
  return (
    // Removi o 'hidden lg:block'
    // Adicionei tamanhos responsivos: h-[60vh] no mobile, lg:h-[130vh] no desktop
    // Opacidade reduzida no mobile (opacity-40) para não atrapalhar o texto, e 100% no desktop (lg:opacity-100)
    <div className="fixed -left-[15%] lg:-left-[5%] top-[45%] lg:top-[45%] -translate-y-1/2 z-0 pointer-events-none h-[60vh] lg:h-[130vh] w-auto aspect-square opacity-40 lg:opacity-100 transition-all duration-700">
      <Lottie 
        animationData={foxAnimationData} 
        loop={true} 
        className="w-full h-full"
      />
    </div>
  );
}