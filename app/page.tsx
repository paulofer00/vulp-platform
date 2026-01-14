"use client";

import { ArrowRight, CheckCircle2, Loader2, Play, Trophy, Users, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleJoinWaitlist(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setIsSuccess(true);
        setEmail("");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 selection:text-purple-200">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tighter">VULP<span className="text-purple-600">.</span></div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#metodo" className="hover:text-white transition-colors">O Método</a>
            <a href="#trilhas" className="hover:text-white transition-colors">Trilhas</a>
            <Link href="/vitrine" className="hover:text-white transition-colors">Talentos</Link>
          </div>
          <button className="bg-white/10 text-white px-5 py-2 rounded-full text-xs font-bold border border-white/10 cursor-not-allowed opacity-50">
            Área do Aluno (Em breve)
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION COM CAPTURA --- */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-300 text-[10px] font-bold uppercase tracking-widest">
            <Zap size={12} /> Lista de Espera Aberta
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.1]">
            Domine o Digital. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
              Garanta sua Vaga.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Cadastre-se gratuitamente para ser avisado em primeira mão quando abrirmos a nova turma da VULP.
          </p>

          {/* FORMULÁRIO DE CAPTURA */}
          <div className="max-w-md mx-auto pt-4">
            {isSuccess ? (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-4 rounded-xl flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                <CheckCircle2 size={24} />
                <div className="text-left">
                  <p className="font-bold">Sucesso!</p>
                  <p className="text-xs opacity-80">Você está na lista VIP. Fique de olho no e-mail.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleJoinWaitlist} className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Seu melhor e-mail" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <button 
                  disabled={isLoading}
                  type="submit" 
                  className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : "Entrar na Lista"} <ArrowRight size={18} />
                </button>
              </form>
            )}
            <p className="text-xs text-gray-600 mt-3">Junte-se a mais de 2.000 interessados.</p>
          </div>

          <div className="pt-8 flex items-center justify-center gap-6 text-sm text-gray-500 font-medium">
            <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-purple-500" /> Certificado Reconhecido</span>
            <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-purple-500" /> Acesso Vitalício</span>
          </div>
        </div>
      </section>

      {/* --- ESTATÍSTICAS --- */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
          {[
            { label: "Alunos na Espera", value: "+2.000" },
            { label: "Empresas Parceiras", value: "+150" },
            { label: "Contratações", value: "98%" },
            { label: "Aulas Gravadas", value: "+400" },
          ].map((stat, i) => (
            <div key={i} className="py-12 text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs uppercase tracking-widest text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* --- O RESTO DO SITE (VITRINE E TRILHAS) MANTÉM IGUAL AO ANTERIOR --- */}
      {/* ... (O restante do código de Vitrine e Trilhas continua igual, só mantive o começo que mudou) ... */}
      {/* Para facilitar, pode copiar o resto do código anterior a partir da section "O DIFERENCIAL" e colar abaixo */}
      
      {/* --- O DIFERENCIAL (VITRINE) --- */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto bg-gradient-to-b from-[#0A0A0A] to-black border border-white/10 rounded-3xl p-8 md:p-20 relative overflow-hidden">
          
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
                Estude e saia <span className="text-purple-500">empregado.</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Diferente de cursos tradicionais, a VULP tem uma Vitrine de Talentos integrada. 
                Ao concluir seus cursos e ganhar medalhas, seu perfil é automaticamente exibido para empresários que buscam contratar.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="bg-purple-500/20 p-2 rounded-lg text-purple-400"><Trophy size={18}/></div>
                  Gamificação que vale dinheiro
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400"><Users size={18}/></div>
                  Conexão direta com o mercado
                </li>
              </ul>
              <Link href="/vitrine" className="inline-flex items-center gap-2 text-purple-400 font-bold hover:text-purple-300 transition-colors border-b border-purple-500/30 pb-1">
                Conheça a Vitrine VULP <ArrowRight size={16} />
              </Link>
            </div>

            {/* Simulação Visual de Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-purple-600/20 blur-[60px] rounded-full"></div>
              <div className="relative bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl rotate-3 hover:rotate-0 transition-all duration-500">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-700"></div>
                  <div>
                    <div className="w-32 h-4 bg-gray-800 rounded mb-2"></div>
                    <div className="w-20 h-3 bg-gray-900 rounded"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="w-full h-3 bg-gray-800 rounded"></div>
                  <div className="w-full h-3 bg-gray-800 rounded"></div>
                  <div className="w-2/3 h-3 bg-gray-800 rounded"></div>
                </div>
                <div className="flex gap-2">
                  <div className="px-3 py-1 rounded bg-purple-900/30 text-purple-400 text-xs border border-purple-500/20">Copywriter</div>
                  <div className="px-3 py-1 rounded bg-purple-900/30 text-purple-400 text-xs border border-purple-500/20">Tráfego</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- TRILHAS (CARDS) --- */}
      <section id="trilhas" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">Trilhas de Conhecimento</h2>
          <p className="text-gray-400">Tudo o que você precisa para construir um negócio digital.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Digital Marketing", desc: "Do zero ao avançado em tráfego e copy.", icon: <Zap /> },
            { title: "Design & Branding", desc: "Crie marcas desejadas e visuais impactantes.", icon: <Play /> },
            { title: "Vendas & Negociação", desc: "Aprenda a fechar contratos high-ticket.", icon: <Users /> },
          ].map((card, i) => (
            <div key={i} className="group p-8 rounded-2xl bg-[#0A0A0A] border border-white/5 hover:border-purple-500/30 transition-all hover:bg-white/[0.02]">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-white mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{card.title}</h3>
              <p className="text-gray-400 leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-bold text-xl tracking-tighter">VULP<span className="text-purple-600">.</span></div>
          <p className="text-gray-500 text-sm">© 2026 VULP Education. Todos os direitos reservados.</p>
        </div>
      </footer>

    </div>
  );
}