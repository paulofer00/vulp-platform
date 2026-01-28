"use client";

import { useState } from "react";
import { loginToClassroom } from "@/app/actions/cademi-auth";
import { Loader2, PlayCircle } from "lucide-react";

export function ClassroomButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleAccess = async () => {
    try {
      setIsLoading(true);
      
      // Chama a Server Action
      const magicLink = await loginToClassroom();

      if (magicLink) {
        // Redireciona o usuário para a Cademi em uma nova aba (ou na mesma)
        window.open(magicLink, "_blank"); 
        // Se quiser na mesma aba use: window.location.href = magicLink;
      } else {
        alert("Erro ao acessar a sala de aula. Entre em contato com o suporte.");
      }
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleAccess}
      disabled={isLoading}
      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 w-full md:w-auto shadow-lg shadow-purple-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin" size={20} />
          Acessando...
        </>
      ) : (
        <>
          <PlayCircle size={20} />
          Meus Cursos
        </>
      )}
    </button>
  );
}