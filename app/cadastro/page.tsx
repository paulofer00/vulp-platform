import Link from "next/link";
import { ArrowRight, Building2, GraduationCap, ArrowLeft } from "lucide-react";

export default function SignupSelectionPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 font-sans text-white relative overflow-hidden">
      
      {/* Elementos de Fundo (Apenas Roxo agora) */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl w-full relative z-10">
        
        {/* Botão Voltar */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-12 transition-colors">
            <ArrowLeft size={20} /> Voltar para Home
        </Link>

        <div className="text-center mb-16 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Como você deseja entrar?</h1>
            <p className="text-xl text-gray-400">Escolha o perfil que melhor se adapta aos seus objetivos.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-12">
            
            {/* OPÇÃO 1: ALUNO (Roxo Vibrante) */}
            <Link href="/cadastro/aluno" className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative h-full bg-[#0A0A0A] border border-white/10 p-8 md:p-12 rounded-3xl hover:border-purple-500/50 transition-all group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-purple-900/20 flex flex-col items-start">
                    {/* Ícone Roxo */}
                    <div className="w-16 h-16 bg-purple-600/10 rounded-2xl flex items-center justify-center mb-6 text-purple-500 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <GraduationCap size={32} />
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-3">Sou Aluno</h2>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                        Quero desenvolver minhas habilidades, conquistar certificados e encontrar vagas no mercado.
                    </p>
                    
                    <div className="mt-auto flex items-center gap-2 text-purple-400 font-bold group-hover:text-purple-300">
                        Criar conta de Aluno <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </Link>

            {/* OPÇÃO 2: EMPRESA (Branco/Corporativo com Toque Roxo) */}
            <Link href="/cadastro/empresa" className="group relative">
                {/* Glow mais "Branco/Limpo" para diferenciar */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative h-full bg-[#0A0A0A] border border-white/10 p-8 md:p-12 rounded-3xl hover:border-white/30 transition-all group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-white/5 flex flex-col items-start">
                    {/* Ícone Branco/Roxo Escuro */}
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 text-gray-300 group-hover:bg-white group-hover:text-purple-900 transition-colors">
                        <Building2 size={32} />
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-3 text-white">Sou Empresa</h2>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                        Quero encontrar talentos qualificados, gerenciar vagas e impulsionar meu negócio.
                    </p>
                    
                    {/* Botão Branco */}
                    <div className="mt-auto flex items-center gap-2 text-gray-300 font-bold group-hover:text-white">
                        Criar conta Empresarial <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </Link>

        </div>

        <div className="text-center mt-16 text-gray-500">
            Já tem uma conta? <Link href="/login" className="text-white hover:underline font-bold">Fazer Login</Link>
        </div>

      </div>
    </div>
  );
}