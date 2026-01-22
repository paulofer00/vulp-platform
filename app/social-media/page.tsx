"use client";

import { useState } from "react";
import { 
  CheckCircle2, 
  X, 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  Calendar, 
  Clock, 
  Trophy, 
  Zap, 
  Brain, 
  Users,
  ArrowRight
} from "lucide-react";

export default function SocialMediaLP() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Função para abrir o modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30">
      
      {/* --- NAV BAR SIMPLES --- */}
      <nav className="fixed w-full z-40 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
            {/* Espaço para sua Logo */}
            <img src="/logo-white.png" alt="VULP" className="h-8 w-auto" />
            <button 
                onClick={openModal}
                className="hidden md:block bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full transition-all shadow-lg shadow-purple-900/20 text-sm"
            >
                Garantir minha vaga
            </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
        {/* Efeito de luz de fundo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-bold text-purple-300 mb-8 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Inscrições Abertas - Turma 2026
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
                Faro de <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
                    Social Media.
                </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                Não é apenas sobre postar. É sobre estratégia, dados e liderança. 
                Torne-se um Social Media Estrategista em <strong>90 dias de imersão presencial</strong>.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <button 
                    onClick={openModal}
                    className="w-full md:w-auto bg-white text-black hover:bg-gray-200 font-bold py-4 px-10 rounded-full text-lg transition-all transform hover:scale-105"
                >
                    Quero aplicar para a vaga
                </button>
                <p className="text-xs text-gray-500 mt-2 md:mt-0 uppercase font-bold tracking-widest">
                    Vagas Limitadas
                </p>
            </div>

            {/* Ícones de destaque */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 border-t border-white/5 pt-10">
                <div className="flex flex-col items-center gap-2">
                    <MapPin className="text-purple-500" />
                    <span className="font-bold">100% Presencial</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Calendar className="text-purple-500" />
                    <span className="font-bold">90 Dias de Duração</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Clock className="text-purple-500" />
                    <span className="font-bold">120 Horas/Aula</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <Trophy className="text-purple-500" />
                    <span className="font-bold">Certificado VULP</span>
                </div>
            </div>
        </div>
      </header>

      {/* --- IMAGEM DESTAQUE (PLACEHOLDER) --- */}
      <section className="px-6 mb-20">
        <div className="max-w-5xl mx-auto h-[400px] md:h-[500px] bg-[#111] border border-white/10 rounded-3xl flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-purple-900/10 group-hover:bg-purple-900/20 transition-colors" />
            <p className="text-gray-500 font-mono text-sm z-10">[Inserir foto da turma/sala de aula aqui]</p>
            {/* <img src="/sua-foto-aqui.jpg" className="absolute inset-0 w-full h-full object-cover" /> */}
        </div>
      </section>

      {/* --- O PROBLEMA / QUEM É VOCÊ --- */}
      <section className="py-20 bg-[#0A0A0A] border-y border-white/5">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    O mercado está cheio de <span className="text-purple-500">amadores.</span>
                </h2>
                <div className="space-y-6 text-gray-400 text-lg">
                    <p>
                        Você vê profissionais ganhando R$ 1.500 enquanto outros cobram R$ 6.000+ pelo mesmo serviço? A diferença não é sorte. É <strong>posicionamento</strong>.
                    </p>
                    <p>
                        A VULP não forma "fazedores de post". Nós formamos líderes estratégicos. 
                        O curso foi desenhado para quem quer sair do operacional e entrar na gestão de grandes contas.
                    </p>
                    <ul className="space-y-3 mt-4">
                        <li className="flex items-center gap-3 text-white">
                            <CheckCircle2 size={20} className="text-purple-500" /> Profissionais de Marketing e Comunicação
                        </li>
                        <li className="flex items-center gap-3 text-white">
                            <CheckCircle2 size={20} className="text-purple-500" /> Empreendedores que querem escala
                        </li>
                        <li className="flex items-center gap-3 text-white">
                            <CheckCircle2 size={20} className="text-purple-500" /> Quem busca transição de carreira
                        </li>
                    </ul>
                </div>
            </div>
            
            {/* Card Visual */}
            <div className="bg-[#151515] p-8 rounded-3xl border border-white/5 relative">
                <div className="absolute -top-4 -right-4 bg-purple-600 text-white px-4 py-2 rounded-lg font-bold text-sm transform rotate-3">
                    Método Exclusivo
                </div>
                <h3 className="text-xl font-bold mb-4">Você vai aprender a:</h3>
                <div className="space-y-4">
                    <div className="p-4 bg-black/40 rounded-xl border border-white/5 hover:border-purple-500/50 transition-colors">
                        <h4 className="font-bold text-white">Precificar do jeito certo</h4>
                        <p className="text-sm text-gray-500">Pare de brigar por preço e comece a cobrar pelo valor.</p>
                    </div>
                    <div className="p-4 bg-black/40 rounded-xl border border-white/5 hover:border-purple-500/50 transition-colors">
                        <h4 className="font-bold text-white">Liderar Processos</h4>
                        <p className="text-sm text-gray-500">Organize rotinas, times e entregas sem caos.</p>
                    </div>
                    <div className="p-4 bg-black/40 rounded-xl border border-white/5 hover:border-purple-500/50 transition-colors">
                        <h4 className="font-bold text-white">Criar Portfólio que Vende</h4>
                        <p className="text-sm text-gray-500">Mesmo que você esteja começando do zero.</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- GRADE CURRICULAR (Módulos) --- */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">O Caminho da Estratégia</h2>
                <p className="text-gray-400">Um currículo completo, do básico à liderança de times.</p>
            </div>

            <div className="space-y-6">
                
                {/* Módulo 1 */}
                <AccordionModule 
                    number="01"
                    title="Posicionamento, Portfólio e Precificação"
                    description="Construa sua autoridade e aprenda a cobrar o que você vale."
                    topics={[
                        "Identidade Profissional: Generalista x Especialista",
                        "Portfólio que Vende: O que o cliente realmente quer ver",
                        "Precificação Inteligente: Como calcular hora e projeto",
                        "Negociação e Propostas: Como fechar contratos de alto valor"
                    ]}
                />

                {/* Módulo 2 */}
                <AccordionModule 
                    number="02"
                    title="Organização e Processos"
                    description="O segredo da escala é a organização. Domine o fluxo de trabalho."
                    topics={[
                        "O Fluxo Real: Briefing, Planejamento, Criação e Aprovação",
                        "Gestão de Rotina e Ferramentas (ClickUp, Notion)",
                        "Escrita Persuasiva (Copy) para Social Media",
                        "Planejamento de Conteúdo na Prática"
                    ]}
                />

                {/* Módulo 3 */}
                <AccordionModule 
                    number="03"
                    title="Liderança e Visão de Time"
                    description="Deixe de ser operacional e torne-se um gestor de marketing."
                    topics={[
                        "Liderança sem Cargo: Postura e Responsabilidade",
                        "Trabalhando com Squads (Designers, Tráfego, Editores)",
                        "Gestão de Pequenas Equipes e Freelancers",
                        "Feedback e Alinhamento de Expectativas"
                    ]}
                />

            </div>
        </div>
      </section>

      {/* --- BÔNUS / SOFT SKILLS --- */}
      <section className="py-20 bg-gradient-to-b from-[#0A0A0A] to-[#050505] border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                <div>
                    <span className="text-purple-500 font-bold tracking-wider uppercase text-sm">O Diferencial VULP</span>
                    <h2 className="text-3xl md:text-4xl font-bold mt-2">Formação Humana de Alta Performance</h2>
                    <p className="text-gray-400 mt-2 max-w-xl">
                        Técnica se aprende no YouTube. Comportamento se aprende aqui. 
                        Aulas exclusivas aos sábados para desenvolver suas Soft Skills.
                    </p>
                </div>
        
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <BonusCard 
                    icon={<Brain size={32} />}
                    title="Inteligência Emocional"
                    desc="Lidar com pressão, críticas e gestão de conflitos no ambiente corporativo."
                />
                <BonusCard 
                    icon={<Zap size={32} />}
                    title="Produtividade e Tempo"
                    desc="Aprenda a organizar prioridades e entregar mais com menos desgaste."
                />
                <BonusCard 
                    icon={<Users size={32} />}
                    title="Liderança e Oratória"
                    desc="Como se posicionar, falar bem e influenciar pessoas e clientes."
                />
            </div>
        </div>
      </section>

      {/* --- QUEM É A VULP --- */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/3 h-full bg-purple-900/5 blur-3xl pointer-events-none" />
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Placeholder Imagem VULP */}
            <div className="w-full h-[500px] bg-[#151515] rounded-3xl border border-white/10 flex items-center justify-center relative overflow-hidden">
                 <p className="text-gray-600 font-mono">[Foto da Sede ou Equipe VULP]</p>
                 {/* <img src="/sede-vulp.jpg" className="absolute inset-0 w-full h-full object-cover" /> */}
            </div>

            <div>
                <img src="/logo-white.png" alt="VULP" className="h-10 mb-8" />
                <h2 className="text-4xl font-bold mb-6">Mais que uma escola.<br/>Um ecossistema.</h2>
                <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                    A VULP nasceu para conectar talentos reais a oportunidades reais. 
                    Não vendemos apenas cursos, nós inserimos você no mercado. 
                </p>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    Nossa metodologia foi validada por centenas de empresas que buscam 
                    profissionais formados com nosso DNA: técnica impecável e comportamento de elite.
                </p>
                
                <div className="flex gap-8 border-t border-white/10 pt-8">
                    <div>
                        <h4 className="text-3xl font-bold text-white">90+</h4>
                        <p className="text-sm text-gray-500">Dias de Imersão</p>
                    </div>
                    <div>
                        <h4 className="text-3xl font-bold text-white">120h</h4>
                        <p className="text-sm text-gray-500">Carga Horária</p>
                    </div>
                    <div>
                        <h4 className="text-3xl font-bold text-white">Presencial</h4>
                        <p className="text-sm text-gray-500">Networking Real</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- CTA FINAL --- */}
      <section className="py-32 px-6 text-center bg-[#0A0A0A]">
        <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
                Essa é a <span className="text-purple-500">única turma</span> do ano.
            </h2>
            <p className="text-xl text-gray-400 mb-12">
                Não deixe para 2027 a carreira que você pode construir agora.
                As vagas são extremamente limitadas para garantir a qualidade do presencial.
            </p>
            <button 
                onClick={openModal}
                className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-5 px-12 rounded-full text-xl transition-all shadow-xl shadow-purple-900/30 transform hover:scale-105 flex items-center justify-center gap-2 mx-auto"
            >
                Quero ser uma Raposa <ArrowRight />
            </button>
            <p className="mt-6 text-sm text-gray-600">
                Ao clicar, você preencherá um formulário de aplicação. Nossa equipe entrará em contato.
            </p>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 px-6 border-t border-white/5 bg-black text-center md:text-left">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <img src="/logo-white.png" alt="VULP" className="h-6 opacity-50" />
            <p className="text-gray-600 text-sm">
                © 2026 VULP Education. Todos os direitos reservados.
            </p>
        </div>
      </footer>

      {/* --- MODAL POPUP (FORMULÁRIO) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop com blur */}
            <div 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
                onClick={closeModal}
            />
            
            {/* Card do Modal */}
            <div className="relative bg-[#111] border border-white/10 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                <button 
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-500">
                        <Zap size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Aplicação VULP</h3>
                    <p className="text-gray-400 text-sm mt-2">
                        Preencha seus dados. Nossa equipe entrará em contato para agendar sua entrevista.
                    </p>
                </div>

                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Obrigado! Em breve entraremos em contato."); closeModal(); }}>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nome Completo</label>
                        <input type="text" placeholder="Seu nome" className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">E-mail</label>
                        <input type="email" placeholder="seu@email.com" className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">WhatsApp</label>
                        <input type="tel" placeholder="(00) 00000-0000" className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cidade</label>
                        <input type="text" placeholder="Santarém, PA" className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors" required />
                    </div>

                    <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl mt-4 transition-colors shadow-lg">
                        Enviar Aplicação
                    </button>
                    <p className="text-[10px] text-gray-600 text-center mt-4">
                        Seus dados estão seguros. Não enviamos spam.
                    </p>
                </form>
            </div>
        </div>
      )}

    </div>
  );
}

// --- SUB-COMPONENTES PARA ORGANIZAÇÃO ---

function AccordionModule({ number, title, description, topics }: { number: string, title: string, description: string, topics: string[] }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-white/10 rounded-2xl bg-[#0F0F0F] overflow-hidden transition-all duration-300 hover:border-purple-500/30">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left"
            >
                <div className="flex items-center gap-6">
                    <span className="text-3xl font-bold text-white/10 font-mono">{number}</span>
                    <div>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{title}</h3>
                        <p className="text-sm text-gray-400 hidden md:block">{description}</p>
                    </div>
                </div>
                <div className={`p-2 rounded-full bg-white/5 text-purple-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDown />
                </div>
            </button>
            
            {/* Conteúdo Expansível */}
            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="px-8 pb-8 pt-0 border-t border-white/5 mt-2">
                        <p className="text-gray-400 md:hidden mb-4 text-sm mt-4">{description}</p>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                            {topics.map((topic, i) => (
                                <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                                    {topic}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

function BonusCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="bg-[#111] p-8 rounded-3xl border border-white/5 hover:border-purple-500/40 transition-colors group">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 mb-6 group-hover:text-purple-400 group-hover:bg-purple-500/10 transition-colors">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
        </div>
    );
}