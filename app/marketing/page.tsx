"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { 
  CheckCircle2, X, ChevronDown, Trophy, 
  Zap, Brain, Video, PenTool, Layout, ArrowRight, ShieldCheck, 
  Users, Mic, Briefcase, TrendingUp, CreditCard, Lock
} from "lucide-react";
import Link from "next/link";

// --- CONFIGURAÇÃO ---
// Mantivemos fora do componente para ficar organizado e sem erro
const CHECKOUT_CONFIG = {
    infiniteTag: "upeup", // ✅ Sua Tag Correta
    productName: "Formacao Raposa do Marketing",
    price: 100, // R$ 1,00
};

export default function MarketingLP() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentLink, setPaymentLink] = useState(""); 

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const openModal = () => setIsModalOpen(true);
  
  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
        setIsSuccess(false);
        setPaymentLink(""); 
    }, 300);
  };

  // --- GERADOR DE LINK INTELIGENTE ---
  const generateCheckoutUrl = (leadId: string) => {
    // Detecta automaticamente se é localhost ou vulp.vc
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://vulp.vc";
    
    const items = JSON.stringify([
        {
            name: CHECKOUT_CONFIG.productName,
            price: CHECKOUT_CONFIG.price,
            quantity: 1
        }
    ]);

    const params = new URLSearchParams({
        items: items,
        order_nsu: leadId,
        redirect_url: `${baseUrl}/obrigado` // <--- Redireciona para a página certa
    });

    return `https://checkout.infinitepay.io/${CHECKOUT_CONFIG.infiniteTag}?${params.toString()}`;
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        city: formData.get("city") as string,
        origin: "raposa-marketing-lp" 
    };

    let leadId = `temp_${Date.now()}`;
    
    try {
        const { data: lead, error } = await supabase
            .from("leads")
            .insert(data)
            .select()
            .single();

        if (!error && lead) {
            leadId = lead.id;
        }
    } catch (err) {
        console.error("Erro ao salvar", err);
    }

    // Gera o link e salva no estado
    const link = generateCheckoutUrl(leadId);
    setPaymentLink(link);
    
    setIsLoading(false);
    setIsSuccess(true);
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30">
      
      {/* NAVBAR */}
      <nav className="fixed w-full z-40 bg-[#050505]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
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
      <header className="relative pt-[45vh] pb-12 md:pt-40 md:pb-32 overflow-hidden min-h-[100vh] md:min-h-[700px] flex items-end md:items-center">
        <div className="absolute inset-0 w-full h-full z-0">
            {/* 1. IMAGEM DESKTOP */}
            <img 
                src="/raposa.png" 
                alt="Raposa do Marketing" 
                className="hidden md:block w-full md:w-[60%] h-full object-cover object-right-top opacity-90 absolute top-0 right-0"
            />

            {/* 2. IMAGEM MOBILE */}
            <img 
                src="/raposa-mobile.png" 
                alt="Raposa do Marketing Mobile" 
                className="block md:hidden w-full h-full object-cover object-center opacity-100"
            />

            {/* Gradientes Desktop */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/50 to-transparent hidden md:block" />
            
            {/* Gradiente Mobile - Focado na parte de baixo para liberar o topo */}
            <div className="absolute bottom-0 w-full h-[75%] bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent block md:hidden" />
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 grid grid-cols-1 md:grid-cols-2">
            <div className="text-left">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-4 leading-[0.9] drop-shadow-2xl">
                    <span className="block text-white whitespace-nowrap">A RAPOSA DO</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-300">
                        MARKETING
                    </span>
                </h1>
                
                <p className="text-xl text-gray-300 max-w-lg mb-8 leading-relaxed font-light drop-shadow-md">
                    Não é um curso. É uma formação de mercado. <br className="hidden md:block" />
                    <span className="font-bold text-white">Estratégia, Design e Vídeo</span> em 3 meses de imersão.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                        onClick={openModal}
                        className="bg-white text-black hover:bg-gray-200 font-bold py-4 px-12 rounded-full text-lg transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                    >
                        Quero garantir minha vaga
                    </button>
                </div>
            </div>
            <div></div>
        </div>
      </header>

      {/* SEÇÃO O PROBLEMA */}
      <section className="py-20 bg-white text-black relative z-20">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
                <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                    O mercado está cheio de <span className="text-purple-600">postadores.</span>
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    A maioria dos cursos ensina ferramenta. Ensinam a apertar botão no Canva ou no CapCut. O resultado? Profissionais substituíveis que brigam por preço.
                </p>
                <p className="text-lg text-gray-600 font-bold mb-8">
                    Na VULP, formamos a Raposa: o profissional que pensa, cria e vende.
                </p>
                
                <ul className="space-y-4">
                    <li className="flex items-center gap-3 font-medium"><X className="text-red-500" /> Nada de "copiar slide".</li>
                    <li className="flex items-center gap-3 font-medium"><X className="text-red-500" /> Nada de teoria sem aplicação.</li>
                    <li className="flex items-center gap-3 font-medium"><X className="text-red-500" /> Nada de professor que nunca vendeu nada.</li>
                </ul>
            </div>
            
            <div className="bg-gray-100 p-8 rounded-3xl border border-gray-200 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">METODOLOGIA VULP</div>
                <h3 className="text-xl font-bold mb-6">Aqui você aprende a:</h3>
                <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
                        <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><Brain size={20} /></div>
                        <div><h4 className="font-bold">Estratégia</h4><p className="text-sm text-gray-500">Pensar como dono, não como executor.</p></div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><PenTool size={20} /></div>
                        <div><h4 className="font-bold">Design com Propósito</h4><p className="text-sm text-gray-500">Criar visuais que vendem, não só enfeitam.</p></div>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
                        <div className="bg-green-100 p-2 rounded-lg text-green-600"><Video size={20} /></div>
                        <div><h4 className="font-bold">Filmmaker Mobile</h4><p className="text-sm text-gray-500">Captar, editar e dirigir usando o celular.</p></div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* A TRILHA DA RAPOSA */}
      <section className="py-24 px-6 bg-[#050505]">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">A Trilha da Raposa</h2>
                <p className="text-gray-400">Um currículo multidisciplinar para formar o profissional completo.</p>
            </div>

            <div className="space-y-6">
                <AccordionModule 
                    month="MÊS 01" 
                    title="Estratégia & Marketing" 
                    icon={<Brain className="text-purple-500" />} 
                    description="Transforme-se em alguém que pensa antes de postar." 
                    topics={["Mindset: O Marketing como sistema", "Público-alvo real (quem paga x quem curte)", "Planejamento de Campanhas e Jornada", "Processos e Organização de Agência"]} 
                    color="purple" 
                />
                <AccordionModule 
                    month="MÊS 02" 
                    title="Design & Identidade" 
                    icon={<Layout className="text-blue-500" />} 
                    description="Design que resolve problemas e constrói valor." 
                    topics={["Hierarquia Visual e Composição", "Design para Redes Sociais e Anúncios", "Sprint de Criação (Sob Pressão)", "Portfólio Estratégico e Precificação"]} 
                    color="blue" 
                />
                <AccordionModule 
                    month="MÊS 03" 
                    title="Filmmaker Mobile" 
                    icon={<Video className="text-green-500" />} 
                    description="O celular como arma de vendas. Captação e edição." 
                    topics={["Linguagem de Vídeo Curto (Reels/TikTok)", "Enquadramento, Luz e Direção de Cena", "Edição Funcional e Ritmo", "Vídeo de Vendas e Institucional"]} 
                    color="green" 
                />
            </div>
        </div>
      </section>

      {/* SOFT SKILLS */}
      <section className="py-24 px-6 bg-[#0A0A0A] border-t border-white/5">
        <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-white text-black p-10 rounded-3xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-center">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500 blur-[80px] rounded-full opacity-30" />
                    <span className="text-purple-600 font-black uppercase tracking-widest text-sm mb-4 block">Experiência VULP</span>
                    <h3 className="text-4xl font-black mb-6 leading-tight">Muito além da <span className="text-purple-600">técnica.</span></h3>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">Marketing é sobre pessoas. Na VULP, você não aprende só ferramenta. Você desenvolve as <strong>Soft Skills</strong> que diferenciam um executor de um estrategista.</p>
                    <div className="inline-flex items-center gap-2 px-5 py-3 bg-purple-100 text-purple-700 rounded-full font-bold text-sm self-start"><Zap size={18} /> Skills de Liderança</div>
                </div>
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SoftSkillCard title="Liderança Criativa" icon={<Trophy size={24} />} desc="Aprenda a liderar projetos e defender suas ideias." />
                    <SoftSkillCard title="Oratória & Pitch" icon={<Mic size={24} />} desc="Apresente campanhas com segurança e clareza." />
                    <SoftSkillCard title="Inteligência Emocional" icon={<Brain size={24} />} desc="Lide com pressão, prazos e feedback sem surtar." />
                    <SoftSkillCard title="Networking Estratégico" icon={<Users size={24} />} desc="Conexão com empresários e profissionais da área." />
                    <SoftSkillCard title="Coworking VULP" icon={<Briefcase size={24} />} desc="Acesso a um ambiente criativo de alta performance." />
                    <SoftSkillCard title="Vivência de Agência" icon={<TrendingUp size={24} />} desc="Rotina real de aprovação, refação e entrega." />
                </div>
            </div>
        </div>
      </section>

      {/* CARREIRA */}
      <section className="py-24 px-6 bg-white text-black border-t border-gray-200">
         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative">
                <div className="bg-gray-100 rounded-3xl h-[400px] w-full border border-gray-200 flex items-center justify-center">
                    <p className="text-gray-400 font-mono text-sm">[Foto: Alunos apresentando projeto]</p>
                </div>
                <div className="absolute -bottom-6 -right-6 bg-black text-white p-6 rounded-2xl shadow-2xl max-w-xs">
                    <div className="flex items-center gap-2 mb-2 text-purple-400"><ShieldCheck size={20} /><span className="font-bold text-sm uppercase">Garantia de Ensino</span></div>
                    <p className="text-sm text-gray-300">Você sai com um portfólio real contendo Estratégia, Design e Vídeo.</p>
                </div>
            </div>
            <div className="order-1 md:order-2">
                <h2 className="text-3xl md:text-5xl font-black mb-6">Você não sai apenas com um certificado.</h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">Sai com uma profissão. Ensinamos não só a técnica, mas como <strong>vender seu serviço, precificar e fechar contratos.</strong></p>
                <div className="space-y-6">
                    <h3 className="font-bold text-xl">Onde você pode atuar:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"><CheckCircle2 className="text-green-600" size={18} /> Social Media Freelancer</div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"><CheckCircle2 className="text-green-600" size={18} /> Agências de Marketing</div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"><CheckCircle2 className="text-green-600" size={18} /> Filmmaker Mobile</div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"><CheckCircle2 className="text-green-600" size={18} /> Equipes Internas de Empresas</div>
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-32 px-6 text-center bg-[#050505] relative">
         <div className="max-w-3xl mx-auto relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-6 text-white">Torne-se uma <span className="text-purple-500">Raposa.</span></h2>
            <p className="text-xl text-gray-400 mb-12">As vagas são limitadas para garantir a qualidade da mentoria presencial. Não deixe para depois.</p>
            <button onClick={openModal} className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-5 px-12 rounded-full text-xl shadow-xl shadow-purple-900/30 flex items-center justify-center gap-2 mx-auto transition-all hover:scale-105">Quero ser uma Raposa <ArrowRight /></button>
         </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 bg-black text-center border-t border-white/5">
        <div className="flex justify-center mb-6"><img src="/logo-white.png" alt="VULP" className="h-6 opacity-50" /></div>
        <p className="text-gray-600 text-sm">© 2026 VULP Education.</p>
      </footer>

      {/* MODAL DE INSCRIÇÃO */}
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
                        <h3 className="text-2xl font-bold text-white mb-2">Inscrição Recebida!</h3>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            Para garantir sua vaga, finalize o pagamento seguro através da InfinitePay.
                        </p>
                        
                        {/* BOTÃO VERDE INFINITEPAY */}
                        {paymentLink && (
                            <Link 
                                href={paymentLink}
                                target="_self" // Self para garantir que vá, ou _blank se preferir aba nova
                                className="w-full bg-[#00D775] hover:bg-[#00c068] text-[#002f1a] font-black text-lg py-4 px-6 rounded-xl shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 transition-transform hover:scale-105 mb-4"
                            >
                                <CreditCard size={20} />
                                Pagar com InfinitePay
                            </Link>
                        )}
                        
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Lock size={12} /> Ambiente seguro e criptografado
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-8">
                            <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-500"><Zap size={24} /></div>
                            <h3 className="text-2xl font-bold text-white">Aplicação Raposa</h3>
                            <p className="text-gray-400 text-sm mt-2">Preencha seus dados para receber o contato do nosso time.</p>
                        </div>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <input name="name" type="text" placeholder="Seu nome" className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors" required />
                            <input name="email" type="email" placeholder="seu@email.com" className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors" required />
                            <input name="phone" type="tel" placeholder="(00) 00000-0000" className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors" required />
                            <input name="city" type="text" placeholder="Santarém, PA" className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors" required />
                            <button disabled={isLoading} type="submit" className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-4 rounded-xl mt-4 transition-colors shadow-lg">
                                {isLoading ? "Processando..." : "Ir para Pagamento"}
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

// Sub-componentes
function AccordionModule({ month, title, description, topics, icon, color }: any) {
    const [isOpen, setIsOpen] = useState(false);
    const colors: any = {
        purple: "text-purple-500 bg-purple-500/10 border-purple-500/20",
        blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
        green: "text-green-500 bg-green-500/10 border-green-500/20",
    };
    return (
        <div className="border border-white/10 rounded-2xl bg-[#0F0F0F] overflow-hidden transition-all hover:border-white/20">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-6 md:p-8 text-left">
                <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${colors[color]}`}>{icon}</div>
                    <div>
                        <span className={`text-xs font-bold uppercase tracking-wider mb-1 block ${colors[color].split(" ")[0]}`}>{month}</span>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{title}</h3>
                        <p className="text-sm text-gray-400 hidden md:block">{description}</p>
                    </div>
                </div>
                <div className={`p-2 rounded-full bg-white/5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}><ChevronDown /></div>
            </button>
            {isOpen && (
                <div className="px-8 pb-8 pt-0 border-t border-white/5">
                    <p className="text-gray-400 md:hidden mb-4 text-sm mt-4">{description}</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                        {topics.map((t: string, i: number) => <li key={i} className="flex items-start gap-3 text-gray-300 text-sm"><div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${colors[color].split(" ")[0].replace("text", "bg")}`} />{t}</li>)}
                    </ul>
                </div>
            )}
        </div>
    );
}

function SoftSkillCard({ title, icon, desc }: any) {
    return (
        <div className="group bg-[#111] border border-white/5 p-6 rounded-2xl hover:border-purple-500 hover:bg-[#151515] hover:shadow-[0_5px_20px_rgba(168,85,247,0.15)] transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02]">
            <div className="text-purple-500 mb-3 group-hover:text-white transition-colors">{icon}</div>
            <h4 className="font-bold text-lg text-white mb-1 group-hover:text-purple-300 transition-colors">{title}</h4>
            <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">{desc}</p>
        </div>
    );
}