"use client";

import { useState } from "react";
import { Rocket, Activity } from "lucide-react";

export default function AnaliseDadosVulp() {
  const [dados, setDados] = useState<any>(null);
  const [carregando, setCarregando] = useState(false);

  // 👇 FUNÇÃO QUE PUXA OS DADOS DO PYTHON 👇
  const rodarAnalise = async () => {
    setCarregando(true);
    try {
      // Chama a porta 8000 onde o Python está rodando
      const resposta = await fetch("http://localhost:8000/api/analise");
      const data = await resposta.json();
      setDados(data);
    } catch (erro) {
      console.error("Erro ao conectar com o motor Python", erro);
    }
    setCarregando(false);
  };

  return (
    <main className="min-h-screen bg-[#02000A] text-white p-24 flex flex-col items-center">
      <h1 className="text-5xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">
        Motor de Análise VULP
      </h1>

      <button 
        onClick={rodarAnalise}
        disabled={carregando}
        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-8 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all flex items-center gap-3"
      >
        {carregando ? "Processando no Python..." : "Iniciar Análise de Dados"} 
        <Activity size={20} />
      </button>

      {/* RESULTADO VINDO DO PYTHON */}
      {dados && (
        <div className="mt-12 bg-[#0A051A] border border-indigo-500/30 p-8 rounded-3xl w-full max-w-2xl shadow-xl">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Rocket className="text-green-500" /> Insight Gerado:
            </h3>
            <p className="text-gray-300 text-xl mb-6">{dados.insights}</p>
            
            <div className="text-gray-500 text-sm uppercase tracking-widest font-bold mb-2">Dados do Gráfico:</div>
            <div className="flex gap-4">
                {dados.dados_grafico.map((num: number, i: number) => (
                    <div key={i} className="bg-indigo-500/20 text-indigo-300 px-4 py-2 rounded-lg font-mono">
                        {num}
                    </div>
                ))}
            </div>
        </div>
      )}
    </main>
  );
}