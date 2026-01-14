import { Zap, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 text-center relative overflow-hidden">
      
      {/* Luz de Fundo (Glow) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full -z-10"></div>

      <div className="z-10 flex flex-col items-center gap-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium">
          <Zap size={16} />
          <span>VULP Platform v1.0</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
          O Ecossistema do <br />
          <span className="text-gradient">Novo Mercado</span>
        </h1>

        <p className="text-gray-400 max-w-lg text-lg">
          Conectando jovens talentos a empresários de elite. 
          A vitrine oficial dos melhores alunos.
        </p>

        <button className="mt-4 flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-all">
          Acessar Vitrine <ArrowRight size={20} />
        </button>
      </div>

    </main>
  );
}