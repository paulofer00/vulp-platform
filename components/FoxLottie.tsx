"use client";

import Lottie from "lottie-react";
import foxAnimationData from "@/assets/raposa-animada.json";

export default function FoxLottie() {
  return (
    // Alterei 'top-1/2' para 'top-[40%]' para subir ela um pouco
    <div className="fixed -left-[5%] top-[45%] -translate-y-1/2 z-0 pointer-events-none hidden lg:block h-[130vh] w-auto aspect-square opacity-100">
      <Lottie 
        animationData={foxAnimationData} 
        loop={true} 
        className="w-full h-full"
      />
    </div>
  );
}