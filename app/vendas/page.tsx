"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { 
  CheckCircle2, X, ChevronDown, Trophy, 
  Zap, Users, ArrowRight, TrendingUp, MessageSquare, DollarSign, Lock, Smartphone, Brain, Briefcase, Mic
} from "lucide-react";
import Link from "next/link";

export default function VendasLP() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Supabase Client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const openModal = () => setIsModalOpen(true);
  
  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setIsSuccess(false), 300);
  };

  // Envio do Formulário
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        city: formData.get("city") as string,
        origin: "novo-vendedor-lp"
    };

    const { error } = await supabase.from("leads").insert(data);

    setIsLoading(false);

    if (error) {
        alert("Erro ao enviar. Tente novamente.");
        console.error(error);
    } else {
        setIsSuccess(true);
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed w-full z-40 bg-[#050505]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link href="/">
                <img src="/logo-white.png" alt="VULP" className="h-8 w-auto hover:opacity-80 transition-opacity" />
            </Link>
            <button 
                onClick={openModal}
                className="hidden md:block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full transition-all shadow-lg shadow-purple-900/20 text-sm"
            >
                Aplicar agora
            </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden min-h-[700px] flex items-center">
        <div className="absolute top-0 right-0 w-full md:w-[60%] h-full z-0">
            <img 
                src="/vendedor.png" 
                alt="O Novo Vendedor" 
                className="w-full h-full object-cover object-top md:object-right-top opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/50 to-transparent md:via-transparent block md:hidden" />
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 grid grid-cols-1 md:grid-cols-2">
            <div className="text-left pt-10 md:pt-0">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-[1.1] drop-shadow-xl pr-4">
                    O NOVO <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-300 pb-2 pr-2">
                        VENDEDOR
                    </span>
                </h1>
                
                <p className="text-xl text-gray-300 max-w-lg mb-10 leading-relaxed font-light drop-shadow-md bg-[#050505]/40 md:bg-transparent p-2 md:p-0 rounded-lg backdrop-blur-sm md:backdrop-blur-none">
                    Esqueça o script decorado. Aprenda a negociar, persuadir e fechar contratos com método e previsibilidade.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                        onClick={openModal}
                        className="bg-white text-black hover:bg-gray-200 font-bold py-4 px-12 rounded-full text-lg transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                    >
                        Quero vender mais
                    </button>
                </div>
            </div>
            <div></div>
        </div>
      </header>

      {/* --- SEÇÃO CLARA: PROBLEMA / SOLUÇÃO --- */}
      <section className="py-24 bg-white text-black relative z-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
                <div className="bg-gray-100 p-8 rounded-3xl border border-gray-200 shadow-xl relative">
                    <div className="absolute top-0 left-0 bg-purple-600 text-white text-xs font-bold px-4 py-2 rounded-br-xl">O ERRO COMUM</div>
                    <h3 className="text-xl font-bold mt-4 mb-6">Vendedor de Sorte vs. Profissional</h3>
                    
                    <div className="space-y-4">
                        <div className="p-4 bg-white rounded-xl shadow-sm border-l-4 border-red-500">
                            <h4 className="font-bold text-red-600 mb-1">O Amador</h4>
                            <p className="text-sm text-gray-500">Depende de inspiração, empurra produto e gagueja no preço.</p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-xl shadow-sm border-l-4 border-purple-600">
                            <h4 className="font-bold text-purple-700 mb-1">O Novo Vendedor</h4>
                            <p className="text-sm text-gray-600">Tem método, faz diagnóstico e fecha com previsibilidade.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="order-1 md:order-2">
                <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                    Vendas não é dom. <br/>
                    <span className="text-purple-600">É método.</span>
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    O mercado mudou. O cliente está mais informado e odeia vendedor chato. 
                    A VULP forma profissionais que atuam como consultores, guiando o cliente até o "sim" sem pressão barata.
                </p>
                
                <h4 className="font-bold text-lg mb-4">Você vai dominar:</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2"><CheckCircle2 className="text-green-600" size={18} /> Leitura de Perfil</div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="text-green-600" size={18} /> Quebra de Objeções</div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="text-green-600" size={18} /> Venda no WhatsApp</div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="text-green-600" size={18} /> Fechamento Natural</div>
                </div>
            </div>
        </div>
      </section>

      {/* --- CURRÍCULO (DARK) --- */}
      <section className="py-24 px-6 bg-[#050505]">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Cronograma de Elite</h2>
                <p className="text-gray-400">12 Encontros. 24 Horas de Prática Real.</p>
            </div>

            <div className="space-y-6">
                <AccordionModule number="01" title="Fundamentos & Mentalidade" icon={<Brain className="text-purple-500" />} description="Construa a base de quem vende muito." topics={["Venda Consultiva x Venda Empurrada", "Comunicação Não-Verbal e Postura", "Autoridade sem Arrogância", "Diagnóstico de Perfil Comercial"]} color="purple" />
                <AccordionModule number="02" title="Leitura de Cliente & Diagnóstico" icon={<Users className="text-blue-500" />} description="Entenda para quem você vende em segundos." topics={["Identificação Rápida de Perfil", "Abertura de Conversa que Não Trava", "Escuta Ativa: Dor Real x Desejo", "Adaptação de Linguagem"]} color="blue" />
                <AccordionModule number="03" title="Vendas por Canais (Zap & Insta)" icon={<Smartphone className="text-green-500" />} description="Onde o jogo acontece hoje." topics={["WhatsApp: Deixando de ser atendimento", "Instagram: Direct como ferramenta", "Erros que fazem o cliente sumir", "Venda Presencial e Rapport"]} color="green" />
                <AccordionModule number="04" title="Objeções & Fechamento" icon={<Lock className="text-red-500" />} description="O momento de colocar dinheiro no bolso." topics={["Como vencer o 'Tá Caro'", "Sinais de Compra e Timing", "Follow-up Inteligente", "Construção de Rotina Previsível"]} color="red" />
            </div>
        </div>
      </section>

      {/* --- NOVA SEÇÃO: SOFT SKILLS (EXPERIÊNCIA VULP) --- */}
      <section className="py-24 px-6 bg-[#0A0A0A] border-t border-white/5">
        <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Card Principal (Branco/Roxo) */}
                <div className="lg:col-span-1 bg-white text-black p-10 rounded-3xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-center">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500 blur-[80px] rounded-full opacity-30" />
                    
                    <span className="text-purple-600 font-black uppercase tracking-widest text-sm mb-4 block">Experiência VULP</span>
                    <h3 className="text-4xl font-black mb-6 leading-tight">
                        SOFT <span className="text-purple-600">SKILLS.</span>
                    </h3>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                        Vender é sobre pessoas. Na VULP, você não aprende só script. Você desenvolve as <strong>Soft Skills</strong> que diferenciam um tirador de pedido de um líder comercial.
                    </p>
                    <div className="inline-flex items-center gap-2 px-5 py-3 bg-purple-100 text-purple-700 rounded-full font-bold text-sm self-start">
                        <Zap size={18} /> Skills de Liderança
                    </div>
                </div>

                {/* Grid de Cards Menores (Flutuantes) */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SoftSkillCard 
                        title="Liderança" 
                        icon={<Trophy size={24} />} 
                        desc="Assuma o controle da negociação e lidere o cliente." 
                    />
                    <SoftSkillCard 
                        title="Oratória & Presença" 
                        icon={<Mic size={24} />} 
                        desc="Fale com clareza, tom de voz e persuasão." 
                    />
                    <SoftSkillCard 
                        title="Inteligência Emocional" 
                        icon={<Brain size={24} />} 
                        desc="Não perca a venda (nem a calma) por pressão." 
                    />
                    <SoftSkillCard 
                        title="Networking Estratégico" 
                        icon={<Users size={24} />} 
                        desc="Conexão com outros profissionais e empresas." 
                    />
                    <SoftSkillCard 
                        title="Coworking VULP" 
                        icon={<Briefcase size={24} />} 
                        desc="Acesso a um ambiente de alta performance." 
                    />
                    <SoftSkillCard 
                        title="Vivência de Mercado" 
                        icon={<TrendingUp size={24} />} 
                        desc="Situações reais do dia a dia, zero teoria." 
                    />
                </div>

            </div>
        </div>
      </section>

      {/* --- DIFERENCIAIS VULP (GRID) --- */}
      <section className="py-24 px-6 relative border-y border-white/5 bg-[#050505]">
        <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Por que esse curso funciona?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-8 rounded-3xl bg-[#111] border border-white/5 hover:border-purple-500/50 transition-colors group">
                    <div className="w-12 h-12 bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform"><Zap size={24} /></div>
                    <h3 className="text-xl font-bold mb-3">Simulação Real (Role Play)</h3>
                    <p className="text-gray-400 text-sm">Nada de teoria. Você vai vender para o professor e ser corrigido na hora. Pressão real de negociação.</p>
                </div>
                <div className="p-8 rounded-3xl bg-[#111] border border-white/5 hover:border-purple-500/50 transition-colors group">
                    <div className="w-12 h-12 bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform"><MessageSquare size={24} /></div>
                    <h3 className="text-xl font-bold mb-3">Dossiê de Vendas</h3>
                    <p className="text-gray-400 text-sm">Você sai com seu roteiro de abordagem, respostas para objeções e rotina comercial prontos.</p>
                </div>
                <div className="p-8 rounded-3xl bg-[#111] border border-white/5 hover:border-purple-500/50 transition-colors group">
                    <div className="w-12 h-12 bg-purple-900/20 rounded-xl flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform"><DollarSign size={24} /></div>
                    <h3 className="text-xl font-bold mb-3">Foco em Dinheiro</h3>
                    <p className="text-gray-400 text-sm">O objetivo é formar vendedores que se pagam. Previsibilidade e consistência no fechamento.</p>
                </div>
            </div>
        </div>
      </section>

      {/* --- CTA FINAL --- */}
      <section className="py-32 px-6 text-center bg-[#050505] relative overflow-hidden">
         <div className="max-w-3xl mx-auto relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-white">
                Pare de perder venda.
            </h2>
            <p className="text-xl text-gray-400 mb-12">
                As vagas são limitadas para garantir a qualidade das simulações.
                Garanta seu lugar na próxima turma presencial.
            </p>
            <button 
                onClick={openModal}
                className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-5 px-12 rounded-full text-xl shadow-xl shadow-purple-900/30 flex items-center justify-center gap-2 mx-auto transition-all hover:scale-105"
            >
                Aplicar para O Novo Vendedor <ArrowRight />
            </button>
         </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 px-6 bg-black text-center border-t border-white/5">
        <p className="text-gray-600 text-sm">© 2026 VULP Education.</p>
      </footer>

      {/* --- MODAL INTELIGENTE --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal} />
            <div className="relative bg-[#111] border border-white/10 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                <button onClick={closeModal} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"><X size={24} /></button>

                {isSuccess ? (
                    <div className="flex flex-col items-center justify-center text-center py-6 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20">
                            <CheckCircle2 size={40} className="text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Sucesso!</h3>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            Seu cadastro foi realizado com sucesso!<br/>
                            <span className="text-sm opacity-70">Nossa equipe entrará em contato em breve.</span>
                        </p>
                        <button onClick={closeModal} className="text-purple-500 hover:text-purple-400 font-bold text-sm transition-colors border border-purple-500/30 hover:border-purple-500 px-6 py-2 rounded-full">
                            Fechar
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-8">
                            <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-500"><TrendingUp size={24} /></div>
                            <h3 className="text-2xl font-bold text-white">Aplicação Vendas</h3>
                            <p className="text-gray-400 text-sm mt-2">Preencha seus dados para receber o contato do nosso time.</p>
                        </div>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome Completo</label>
                                <input name="name" type="text" placeholder="Seu nome" className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">E-mail</label>
                                <input name="email" type="email" placeholder="seu@email.com" className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">WhatsApp</label>
                                <input name="phone" type="tel" placeholder="(00) 00000-0000" className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cidade</label>
                                <input name="city" type="text" placeholder="Santarém, PA" className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors" required />
                            </div>

                            <button disabled={isLoading} type="submit" className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl mt-4 transition-colors shadow-lg">
                                {isLoading ? "Enviando..." : "Enviar Aplicação"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
      )}

    </div>
  );
}

// --- SUB-COMPONENTES ---

function AccordionModule({ number, title, description, topics, icon, color }: any) {
    const [isOpen, setIsOpen] = useState(false);
    
    const colors: any = {
        purple: "text-purple-500 bg-purple-500/10 border-purple-500/20",
        blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
        green: "text-green-500 bg-green-500/10 border-green-500/20",
        red: "text-red-500 bg-red-500/10 border-red-500/20",
    };

    return (
        <div className={`border border-white/10 rounded-2xl bg-[#0F0F0F] overflow-hidden transition-all duration-300 hover:border-white/20`}>
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-6 md:p-8 text-left">
                <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${colors[color]}`}>{icon}</div>
                    <div>
                        <span className={`text-xs font-bold uppercase tracking-wider mb-1 block ${colors[color].split(" ")[0]}`}>MÓDULO {number}</span>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{title}</h3>
                        <p className="text-sm text-gray-400 hidden md:block">{description}</p>
                    </div>
                </div>
                <div className={`p-2 rounded-full bg-white/5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}><ChevronDown /></div>
            </button>
            
            {isOpen && (
                <div className="px-8 pb-8 pt-0 border-t border-white/5 animate-in slide-in-from-top-2">
                    <p className="text-gray-400 md:hidden mb-4 text-sm mt-4">{description}</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                        {topics.map((topic: string, i: number) => (
                            <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                                <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${colors[color].split(" ")[0].replace("text", "bg")}`} />{topic}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

// --- NOVO COMPONENTE: CARD FLUTUANTE DE SKILLS ---
function SoftSkillCard({ title, icon, desc }: any) {
    return (
        <div className="
            group bg-[#111] border border-white/5 p-6 rounded-2xl 
            hover:border-purple-500 hover:bg-[#151515] hover:shadow-[0_5px_20px_rgba(168,85,247,0.15)]
            transition-all duration-300 ease-out 
            hover:-translate-y-2 hover:scale-[1.02]
        ">
            <div className="text-purple-500 mb-3 group-hover:text-white transition-colors">
                {icon}
            </div>
            <h4 className="font-bold text-lg text-white mb-1 group-hover:text-purple-300 transition-colors">
                {title}
            </h4>
            <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                {desc}
            </p>
        </div>
    );
}