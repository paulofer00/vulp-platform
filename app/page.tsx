import { ArrowRight, CheckCircle2, LogIn, PlayCircle, Trophy, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30">
      
      {/* NAVBAR */}
      <nav className="border-b border-white/5 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="cursor-pointer">
  <img src="/logo-white.png" alt="VULP" className="h-8 w-auto" />
</Link>
          
          <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
            <a href="#metodo" className="hover:text-white transition-colors">O Método</a>
            <Link href="/vitrine" className="hover:text-white transition-colors text-purple-400">Contratar Talentos</Link>
          </div>

          {/* BOTÃO ATUALIZADO (Neutro) 👇 */}
          <Link href="/login" className="px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors font-bold text-sm flex items-center gap-2">
            <LogIn size={16} /> Entrar
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-purple-300 mb-8 uppercase tracking-wider">
            <Zap size={12} fill="currentColor" /> Plataforma On-line
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
            O ponto de encontro <br/>
            do <span className="text-purple-500">Mercado Digital.</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            A única plataforma que conecta alunos capacitados diretamente com empresas que precisam contratar. Estude ou contrate em um só lugar.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full md:w-auto px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold text-lg transition-all shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2">
               Começar Agora <ArrowRight size={20} />
            </Link>
            <Link href="/vitrine" className="w-full md:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2">
               Explorar Talentos
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-gray-500 text-sm font-medium">
             <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500"/> Profissionais Verificados</span>
             <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500"/> Vagas Reais</span>
          </div>
        </div>
      </header>

      {/* CARDS DE BENEFÍCIOS */}
      <section className="py-20 border-t border-white/5 bg-[#0A0A0A]" id="metodo">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[#050505] border border-white/5 hover:border-purple-500/30 transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-purple-900/20 flex items-center justify-center text-purple-400 mb-6">
                    <PlayCircle size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">Para Alunos</h3>
                <p className="text-gray-400 leading-relaxed">Aprenda as habilidades mais valiosas do digital e construa um portfólio que as empresas querem ver.</p>
            </div>
            
            <div className="p-8 rounded-3xl bg-[#050505] border border-white/5 hover:border-purple-500/30 transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-blue-900/20 flex items-center justify-center text-blue-400 mb-6">
                    <Users size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">Para Empresas</h3>
                <p className="text-gray-400 leading-relaxed">Pare de perder tempo filtrando currículos ruins. Acesse nossa base de talentos ranqueados por XP.</p>
            </div>

            <div className="p-8 rounded-3xl bg-[#050505] border border-white/5 hover:border-purple-500/30 transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-yellow-900/20 flex items-center justify-center text-yellow-400 mb-6">
                    <Trophy size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">Ranking VULP</h3>
                <p className="text-gray-400 leading-relaxed">Um sistema meritocrático onde os melhores alunos ganham destaque e as melhores vagas.</p>
            </div>
        </div>
      </section>

    </div>
  );
}